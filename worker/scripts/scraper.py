import os
import pymysql
import bs4
import re
import contextlib
import logging
import asyncio

from datetime import datetime
from datetime import timedelta
from cryptography.fernet import Fernet
from bs4 import BeautifulSoup
from playwright.async_api import BrowserContext, expect
from playwright._impl._errors import TargetClosedError
from pymysql.err import OperationalError

from dotenv import load_dotenv

logger = logging.getLogger(__name__)

load_dotenv()
fernet = Fernet(os.environ.get("ENCRYPT_KEY"))
DB_NAME = os.environ.get("DB_NAME")
DB_HOST = os.environ.get("DB_HOST")
DB_USERNAME = os.environ.get("DB_USERNAME")
DB_PASSWORD = os.environ.get("DB_PASSWORD")


FGP_BASE_URL = "https://fgp.fiveguys.co.uk/portal.php"
SD_BASE_URL = "https://my.sdworx.co.uk/portal/login.aspx?organisation=76231"


def time_difference(start, end):
    diff = end - start
    h = diff / 3600
    return h


def remove_all_range(cursor, start, end, stype):
    qry = """
        DELETE
        FROM shift
        WHERE %s < date AND date < %s AND has_scraped = 1 and type = %s
    """
    values = (start, end, stype)
    cursor.execute(qry, values)


def commit_shifts(user, cursor, start, end, shifts, stype):
    remove_all_range(cursor, start, end, stype)

    query = """
        INSERT INTO shift (date, start, end, hours, rate, type, user_id, has_scraped, has_removed, category)
        VALUES (%s, %s, %s, %s, %s, %s, %s, 1, 0, %s)
    """

    for shift in shifts:
        shift["hours"] = time_difference(shift["start"], shift["end"])
        values = (
            shift["date"],
            shift["start"],
            shift["end"],
            shift["hours"],
            shift["rate"],
            shift["type"],
            user["id"],
            shift["category"]
        )
        cursor.execute(query, values)

def commit_payslips(user, cursor, start, end, payslips):
    qry = """
        DELETE
        FROM payslip
        WHERE %s < date and %s > date and user_id = %s 
    """
    vals = (start, end, user["id"])
    cursor.execute(qry, vals)

    query = """
        INSERT INTO payslip (date, rate, net, user_id)
        VALUES (%s, %s, %s, %s)
    """

    for payslip in payslips:
        values = (payslip["date"], payslip["rate"], payslip["net"], user["id"])

        cursor.execute(query, values)

@contextlib.contextmanager
def connect_sql():
    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USERNAME,
        password=DB_PASSWORD,
        db=DB_NAME,
    )
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    logger.debug(f"Connection made to database {DB_NAME}")
    try:
        yield cursor
    except OperationalError as e:
        logger.error("Login credentials for database is invalid")
        raise e
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        connection.commit()
        connection.close()
        logger.debug(f"Connection closed to database {DB_NAME}")


def load_table(cursor, query, values=None):
    if values:
        cursor.execute(query, values)
    else:
        cursor.execute(query)

    rows = cursor.fetchall()

    return rows


def get_user(user_id):
    with connect_sql() as cursor:
        qry = """
            SELECT * FROM user
            WHERE id = %s
        """
        values = user_id
        cursor.execute(qry, values)
        user = cursor.fetchone()
    return user


def get_users():
    with connect_sql() as cursor:
        users = load_table(cursor, "SELECT * from user")

        for user in users:
            print(str(user))
            user["fg_pass"] = fernet.decrypt(user["fg_pass"]).decode()
            user["sd_pass"] = fernet.decrypt(user["sd_pass"]).decode()

        return users


async def parse_page(page) -> BeautifulSoup:
    html = await page.content()
    soup = BeautifulSoup(html, "html.parser")
    return soup


def start_of_week(date: datetime):
    weekday_index = date.weekday()
    return date - timedelta(days=weekday_index)


async def scrape_shifts(context: BrowserContext, button, user):
    # log in to fgp
    page = await context.new_page()
    url = f"{FGP_BASE_URL}?site=login&page=login"
    await page.goto(url)

    await page.get_by_label("Username").fill(user["fg_user"])
    await page.get_by_label("Password").fill(user["fg_pass"])
    await page.get_by_role("button", name="Submit").click()

    # await page.wait_for_load_state("networkidle")
    # if page.url == url:
    #     return {"error": "invalid credentials for fgp"}

    # navigate to rota
    await page.locator("a").filter(has_text="My Rota").click()
    await page.locator("a").filter(has_text=button).click()

    # check what type of shifts
    if button != "Timecard":
        await page.get_by_role("button", name="Week").click()
        html = await parse_page(page)

    # initializing the details
    week_after = start_of_week(datetime.today()) + timedelta(weeks=4)
    current_date = user["pointer"]
    start_date = current_date
    date_element = page.get_by_placeholder("dd/mm/yy")
    shifts = []

    while True:
        # choose the current week
        current_date_str = current_date.strftime("%d/%m/%Y")
        await date_element.fill(str(current_date_str))
        await date_element.press("Enter")
        await date_element.press("Enter")

        # wait for it to load and then parse the page
        await page.wait_for_selector("text=Total")
        html = await parse_page(page)
        days = html.find_all(class_="day-heading")

        # get the date
        date_content = await date_element.input_value()
        selected_date = datetime.strptime(date_content, "%d/%m/%Y")
        week_start = start_of_week(selected_date)

        # get the total number of hours for week
        total_element = page.locator("h3").filter(has_text="Total ")
        total_text = await total_element.text_content()
        total_split = total_text.split(" ")
        numHours = float(total_split[1].split("hrs")[0])

        if numHours != 0:
            # gets the shifts
            day: bs4.element.PageElement
            for count, day in enumerate(days):
                shift = day.find_next("p")
                shift_line = shift.find_next("span").find_next("span").text
                hours = shift_line.split(" ")

                if "HOL" in hours:
                    logger.debug(hours)
                    date = (week_start + timedelta(days=count)).date()
                    shift = {
                        "date": date,
                        "start": 0,
                        "end": 0,
                        "category": "holiday",
                        "hours": 8,
                        "rate": 12.05,
                        "type": button,
                    }

                    logger.debug(f"Scraped shift: {str(shift)} for user {user["id"]}")
                    shifts.append(shift)

                if len(hours) > 7 and hours[0] != "-":
                    date = (week_start + timedelta(days=count)).date()

                    # Parse start and end times
                    start = datetime.strptime(hours[0], "%H:%M").time()
                    end = datetime.strptime(hours[2], "%H:%M").time()

                    # Combine with date and adjust if shift goes past midnight
                    start_datetime = datetime.combine(date, start)
                    if end < start:  # Shift ends the next day
                        end_datetime = datetime.combine(date + timedelta(days=1), end)
                    else:
                        end_datetime = datetime.combine(date, end)

                    shift = {
                        "date": date,
                        "start": start_datetime.timestamp(),
                        "end": end_datetime.timestamp(),
                        "rate": 12.05,
                        "type": button,
                        "category": "work"
                    }
                    logger.debug(f"Scraped shift: {str(shift)} for user {user["id"]}")
                    shifts.append(shift)

        current_date = current_date + timedelta(weeks=1)
        if current_date >= week_after.date():
            break

    logger.info(f"Scraped {len(shifts)} shifts for user {user["id"]}")

    return {
        "shifts": shifts,
        "start": start_date,
        "end": week_after.date()
    }


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
        if len(text_content) == 4:
            currentYear = int(text_content)

        if len(text_content) != 6:
            continue

        # convert the date
        date_str = await element.inner_text()
        day, month = date_str.split(" ")
        date_obj = datetime.strptime(month, "%b")
        date = date_obj.replace(year=currentYear, day=int(day))
        new_date_str = date.strftime("%d/%m/%Y")

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
            await expect(locator).to_have_text(new_date_str, timeout=10000)
        except AssertionError as e:
            logger.error(e)

        # Get the rate for payslip
        rate_lbls = await current.locator(".TDData").all()
        rate = None
        for lbl in rate_lbls:
            lbl_inner_text = await lbl.inner_text()
            if "£" in lbl_inner_text:
                rate = float(lbl_inner_text.split("£")[1])

        # get the net for payslip
        net_pay_lbl = current.locator("#baseNetPayBackground")
        net_pay = net_pay_lbl.locator("xpath=following-sibling::*[1]")
        net_pay = await net_pay.inner_text()
        net_pay = net_pay.split("£")[1]

        if "," in net_pay:
            tmp = net_pay.split(",")
            net_pay = float((int(tmp[0]) * 1000) + float(tmp[1]))
        else:
            net_pay = float(net_pay)

        # create payslip object
        payslip = {"date": date.date(), "net": net_pay, "rate": rate, "user_id": user["id"]}
        logger.debug(
            f"Scraped payslip at date {
                payslip["date"]} for user {user["id"]}"
        )
        payslips.append(payslip)

    logger.info(f"Scraped {len(payslips)} payslips for user {user["id"]}")
    return {"payslips": payslips, "start": payslips[0]["date"], "end": payslips[-1]["date"]}


async def get_payslips(browser, user):
    with connect_sql() as cursor:
        payslips = await scrape_payslips(browser, user)

        # NEED TO COMMIT PAYSLIPS HERE
        commit_payslips(user, cursor, **payslips)


async def get_shifts(browser, user):
    with connect_sql() as cursor:
        # shifts and schedule (fgp)
        schedule = await scrape_shifts(browser, "Schedule", user)
        if schedule.get("error"):
            return schedule.get("error")

        commit_shifts(user, cursor, schedule["start"], schedule["end"], schedule["shifts"], "Schedule")

        timecard = await scrape_shifts(browser, "Timecard", user)
        if timecard.get("error"):
            return timecard.get("error")

        commit_shifts(user, cursor, timecard["start"], timecard["end"], timecard["shifts"], "Timecard")


async def scrape_user(user, playwright, headless, command):
    browser = await playwright.firefox.launch(headless=headless)
    logger.debug(f"Browser opened for user {user["id"]}")

    try:
        if command == "all":
            await get_payslips(browser, user)
            await get_shifts(browser, user)
        if command == "shifts":
            await get_shifts(browser, user)
        if command == "payslips":
            await get_payslips(browser, user)
    except TargetClosedError as e:
        logger.exception(e)
    finally:
        await browser.close()
        logger.debug(f"Browser closed for user {user["id"]}")
        logger.info(f"Finished scraping {command} for user {user["id"]}")


async def scrape_all(playwright, headless, command):
    users = get_users()
    tasks = [scrape_user(user, playwright, headless, command) for user in users]
    await asyncio.gather(*tasks)
