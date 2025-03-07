import re
import logging

from datetime import datetime
from datetime import timedelta
from playwright.async_api import expect

from .scraper import connect_sql
from .scraper import load_table

logger = logging.getLogger(__name__)

SD_BASE_URL = "https://my.sdworx.co.uk/portal/login.aspx?organisation=76231"


async def get_payslips(browser, user):
    with connect_sql() as cursor:
        payslips = await scrape_payslips(browser, user)

        # NEED TO COMMIT PAYSLIPS HERE
        commit_payslips(user, cursor, **payslips)

    with connect_sql() as cursor:
        qry = """
            SELECT *
            FROM payslip
            WHERE date >= %s and date <= %s and user_id = %s
        """
        values = (payslips["start"], payslips["end"], user["id"])
        payslips = load_table(cursor, qry, values)
        for payslip in payslips:
            link_shifts(payslip, cursor)


async def match_years(anchors):
    # match all years and click them
    year_elements = []
    for element in anchors:
        text_content = await element.inner_text()
        # find all year patterns in the text
        matches = re.findall(r"\b\d{4}\b", text_content)
        # append the matches if they represent a year
        for match in matches:
            year = int(match)
            if 1900 <= year <= 2100:  # valid year range
                year_elements.append(element)
    return year_elements


async def convert_date(element, year):
    # convert the date
    date_str = await element.inner_text()
    day, month = date_str.split(" ")
    date_obj = datetime.strptime(month, "%b")
    date = date_obj.replace(year=year, day=int(day))
    return date


async def get_rate(page):
    # Get the rate for payslip by pound sign
    rate_lbls = await page.locator(".TDData").all()
    rate = None
    for lbl in rate_lbls:
        lbl_inner_text = await lbl.inner_text()
        if "£" in lbl_inner_text:
            rate = float(lbl_inner_text.split("£")[1])
    return rate


def str_to_float(string):
    string = string.split("£")[1]
    if "," in string:
        tmp = string.split(",")
        string = float((int(tmp[0]) * 1000) + float(tmp[1]))
    else:
        string = float(string)

    return string


async def get_net(page):
    # get the net for payslip
    net_pay_lbl = page.locator("#baseNetPayBackground")
    net_pay = net_pay_lbl.locator("xpath=following-sibling::*[1]")
    net_pay = await net_pay.inner_text()

    return str_to_float(net_pay)


async def get_work_pay(page):
    tds = await page.locator(".PSLabel").all()

    for td in tds:
        div = td.locator("div")
        if await div.count() == 0:
            continue
        text = await div.text_content()
        if "BASICHR" in text or "ESWORKHR" in text:
            sibling = td.locator("xpath=following-sibling::*[1]")
            if await sibling.count() == 0:
                continue
            work_pay = str_to_float(await sibling.inner_text())
            return work_pay

    return None


async def get_pay(page):
    total_lbls = await page.locator(".TotalData").all()
    lbl_1 = str_to_float(await total_lbls[0].inner_text())
    lbl_2 = str_to_float(await total_lbls[1].inner_text())
    pay = 0
    deductions = 0

    if lbl_1 > lbl_2:
        pay = lbl_1
        deductions = lbl_2
    else:
        pay = lbl_2
        deductions = lbl_1

    return pay, deductions


async def scrape_payslips(browser, user):
    context = await browser.new_context()
    page = await context.new_page()
    await page.goto(SD_BASE_URL)

    # enter log in details
    await page.get_by_placeholder("Username").fill(user["sd_user"])
    await page.get_by_placeholder("Password").fill(user["sd_pass"])
    await page.get_by_role("button", name="Sign In").click()

    # presses payslips
    async with page.expect_popup() as popup_info:
        await page.frame_locator('iframe[name="ContainerFrame"]').frame_locator(
            'iframe[name="iframeCommunityContainer"]'
        ).get_by_role("link", name="My Payslip").click()

    # highlights popup page
    current = await popup_info.value
    await current.bring_to_front()

    # locates payslip history
    await current.wait_for_timeout(1000)
    date_div = current.locator(".divPaymentHistory").first
    anchors = await date_div.locator("a").all()

    year_elements = await match_years(anchors)

    # press all date dropdowns
    for count, element in enumerate(year_elements):
        if count != 0:
            await element.click()

    # get all anchors
    payslips = []
    currentYear = datetime.today().year
    for element in anchors:
        text_content = await element.inner_text()
        # if it is a year
        if len(text_content) == 4:
            currentYear = int(text_content)

        # if it is a date
        if len(text_content) != 6:
            continue

        # convert the date
        expected_date = await convert_date(element, currentYear)
        expected_str = expected_date.strftime("%d/%m/%Y")

        # look for the date in the details section
        details = current.locator("#ctl00_MCPH_PayslipCtrl_udpEmployeeDetails")
        tableCells = await details.locator(".TDData").all()
        pattern = r"^\d{2}/\d{2}/\d{4}$"
        locator = None

        # Iterate over tableCells asynchronously and find the matching cell
        for cell in tableCells:
            inner_text = await cell.inner_text()
            if re.match(pattern, inner_text):
                locator = cell
                break

        # wait for page to reload by expected date
        try:
            await element.click()
            await expect(locator).to_have_text(expected_str, timeout=10000)
        except AssertionError as e:
            logger.error(e)

        rate = await get_rate(current)
        net = await get_net(current)
        pay, deductions = await get_pay(current)
        work_pay = await get_work_pay(current)

        # create payslip object
        payslip = {
            "date": expected_date.date(),
            "net": net,
            "rate": rate,
            "pay": pay,
            "deductions": deductions,
            "user_id": user["id"],
            "hours": round(work_pay / rate, 2)
        }

        logger.debug(
            f"Scraped payslip at date {
                payslip["date"]} for user {user["id"]}"
        )
        payslips.append(payslip)

        if len(payslips) == 6:
            break

    logger.info(f"Scraped {len(payslips)} payslips for user {user["id"]}")
    return {
        "payslips": payslips,
        "end": payslips[0]["date"],
        "start": payslips[-1]["date"],
    }


def link_shifts(payslip, cursor):
    qry = """
        SELECT *
        FROM shift
        WHERE date >= %s and date <= %s and type = "Timecard"
    """
    end = payslip["date"] - timedelta(days=2)
    start = end - timedelta(weeks=2)

    shifts = load_table(cursor, qry, (start, end))

    linked = []
    total = 0
    for shift in shifts:
        if total == payslip["hours"]:
            break

        total += round(shift["hours"], 2)
        total = round(total, 2)
        linked.append(shift)

    qry = """
        UPDATE shift
        SET payslip_id = %s
        WHERE id = %s
    """

    for shift in linked:
        values = (payslip["id"], shift["id"])
        cursor.execute(qry, values)


def commit_payslips(user, cursor, start, end, payslips):
    # get ids existing payslips
    qry = """
        SELECT date, id
        FROM payslip
        WHERE date >= %s and date <= %s and user_id = %s
    """
    vals = (start, end, user["id"])
    cursor.execute(qry, vals)
    rows = cursor.fetchall()

    # update old payslips with new payslip data
    qry = """
        UPDATE payslip
        SET rate = %s, net = %s, pay = %s, deductions = %s, hours = %s
        WHERE id = %s
    """

    tmp = payslips.copy()
    for row in rows:
        for payslip in tmp:
            if not row["date"] == payslip["date"]:
                continue

            vals = (
                payslip["rate"],
                payslip["net"],
                payslip["pay"],
                payslip["deductions"],
                payslip["hours"],
                row["id"]
            )
            cursor.execute(qry, vals)
            payslips.remove(payslip)

    # create new payslips if they do not already exist
    query = """
        INSERT INTO payslip (date, rate, net, pay, deductions, hours, user_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """

    for payslip in payslips:
        values = (
            payslip["date"],
            payslip["rate"],
            payslip["net"],
            payslip["pay"],
            payslip["deductions"],
            payslip["hours"],
            user["id"],
        )

        cursor.execute(query, values)
