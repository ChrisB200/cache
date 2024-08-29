import os
import pymysql
import bs4
import re
import contextlib
import logging
import asyncio
import time as t

from datetime import date
from datetime import time
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


class User:
    def __init__(self, details):
        self.id = details[0]
        self.email = details[1]
        self.pass_hash = details[2]
        self.fg_user = details[3]
        self.fg_pass = fernet.decrypt(details[4]).decode()
        self.sd_user = details[5]
        self.sd_pass = fernet.decrypt(details[6]).decode()
        self.pointer = details[7]

    def get_payslips(self, connection, cursor):
        query = """
            SELECT * FROM payslip
            WHERE user_id = %s
        """
        values = self.id
        cursor.execute(query, values)


class Shift:
    def __init__(self, date: date, start: time, end: time, type, rate=11.85):
        self.date: date = date
        self.start: time = start
        self.end: date = end
        self.hours = time_difference(self.start, self.end)
        self.rate = rate
        self.type = type
        self.user_id = None
        self.payslip_id = None
        self.id = None

    def __str__(self):
        return f"Date: {self.date}, Start: {self.start}, End: {self.end}, Type: {self.type}"

    @staticmethod
    def convert_to_time(delta):
        hours, remainder = divmod(delta.seconds, 3600)
        minutes, seconds = divmod(remainder, 60)

        time_obj = datetime(1900, 1, 1, hours, minutes, seconds)
        return time_obj.time()

    @staticmethod
    def create_from_details(details):
        id = details[0]
        date = details[1]
        start = Shift.convert_to_time(details[2])
        end = Shift.convert_to_time(details[3])
        hours = details[4]
        rate = details[5]
        shift_type = details[6]
        user_id = details[7]
        payslip_id = details[8]

        shift = Shift(date, start, end, shift_type, rate)
        shift.hours = hours
        shift.user_id = user_id
        shift.payslip_id = payslip_id
        shift.id = id
        return shift

    def exist(self, cursor, user_id):
        query = """
            SELECT * FROM shift
            WHERE date = %s AND type = %s AND user_id = %s
        """

        values = (self.date, self.type, user_id)
        cursor.execute(query, values)
        shift = cursor.fetchone()

        return shift

    def commit(self, cursor, user_id):
        existing_shift = self.exist(cursor, user_id)
        if existing_shift:
            query = """
                UPDATE shift
                SET start = %s, end = %s, hours = %s, rate = %s
                WHERE date = %s and user_id = %s
            """

            values = (self.start, self.end, self.hours, self.rate, self.date, user_id)
        else:
            query = """
                INSERT INTO shift (date, start, end, hours, rate, type, user_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """

            values = (
                self.date,
                self.start,
                self.end,
                self.hours,
                self.rate,
                self.type,
                user_id,
            )

        cursor.execute(query, values)


class Payslip:
    def __init__(self, date, net, rate):
        self.date = date
        self.net = net
        self.rate = rate
        self.id = None
        self.user_id = None

    @staticmethod
    def create_from_details(details):
        id = details[0]
        date = details[1]
        rate = details[2]
        net = details[3]
        user_id = details[4]

        payslip = Payslip(date, net, rate)
        payslip.id = id
        payslip.user_id = user_id

        return payslip

    def exist(self, cursor, user_id):
        query = """
            SELECT * FROM payslip
            WHERE date = %s AND user_id = %s
        """

        values = (self.date, user_id)
        cursor.execute(query, values)
        payslip = cursor.fetchone()

        return payslip

    def commit(self, cursor, user_id):
        existing_payslip = self.exist(cursor, user_id)
        if existing_payslip:
            query = """
                UPDATE payslip
                SET rate = %s, net = %s
                WHERE id = %s
            """
            values = (self.rate, self.net, existing_payslip[0])
        else:
            query = """
                INSERT INTO payslip (date, rate, net, user_id)
                VALUES (%s, %s, %s, %s)
            """

            values = (self.date, self.rate, self.net, user_id)

        cursor.execute(query, values)


def time_difference(time1, time2):
    dummy_date = datetime(1900, 1, 1)
    dt1 = datetime.combine(dummy_date, time1)
    dt2 = datetime.combine(dummy_date, time2)
    time_diff = dt2 - dt1
    hours = time_diff.total_seconds() / 3600
    return hours


@contextlib.contextmanager
def connect_sql():
    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USERNAME,
        password=DB_PASSWORD,
        db=DB_NAME,
    )
    cursor = connection.cursor()
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


def get_user(user_id):
    with connect_sql() as cursor:
        qry = """
            SELECT * FROM user
            WHERE id = %s
        """
        values = user_id
        cursor.execute(qry, values)
        user_details = cursor.fetchone()
        if user_details:
            user = User(user_details)
        else:
            user = None
    return user


def get_users():
    with connect_sql() as cursor:
        qry = "SELECT * FROM user"
        cursor.execute(qry)
        users_details = cursor.fetchall()
        return list(map(lambda user: User(user), users_details))


async def parse_page(page) -> BeautifulSoup:
    html = await page.content()
    soup = BeautifulSoup(html, "html.parser")
    return soup


def start_of_week(date: datetime):
    weekday_index = date.weekday()
    return date - timedelta(days=weekday_index)


async def scrape_shifts(context: BrowserContext, pointer, button, user):
    # log in to fgp
    page = await context.new_page()
    await page.goto(f"{FGP_BASE_URL}?site=login&page=login")

    await page.get_by_label("Username").fill(user.fg_user)
    await page.get_by_label("Password").fill(user.fg_pass)
    await page.get_by_role("button", name="Submit").click()

    await page.locator("a").filter(has_text="My Rota").click()
    await page.locator("a").filter(has_text=button).click()

    # check what type of shifts
    if button != "Timecard":
        await page.get_by_role("button", name="Week View").click()
        html = await parse_page(page)

    # initialising the details
    week_after = start_of_week(datetime.today()) + timedelta(weeks=2)
    current_date = pointer
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

                if len(hours) > 7 and hours[0] != "-":
                    start = datetime.strptime(hours[0], "%H:%M").time()
                    end = datetime.strptime(hours[2], "%H:%M").time()
                    date = (week_start + timedelta(days=count)).date()
                    shift = Shift(date, start, end, button)
                    logger.debug(f"Scraped shift: {shift} for user {user.id}")
                    shifts.append(shift)

        current_date = current_date + timedelta(weeks=1)
        if current_date >= week_after.date():
            break

    logger.info(f"Scraped {len(shifts)} shifts for user {user.id}")

    return shifts


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
    await page.get_by_placeholder("Username").fill(user.sd_user)
    await page.get_by_placeholder("Password").fill(user.sd_pass)
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

        # create payslip object
        payslip = Payslip(date.date(), net_pay, rate)
        logger.debug(f"Scraped payslip at date {payslip.date} for user {user.id}")
        payslips.append(payslip)

    logger.info(f"Scraped {len(payslips)} payslips for user {user.id}")
    return payslips


def assign_shifts(user, cursor):
    payslip_qry = """
        SELECT * FROM payslip
        WHERE user_id = %s
    """
    payslip_values = user.id
    cursor.execute(payslip_qry, payslip_values)
    payslips = [Payslip.create_from_details(payslip) for payslip in cursor.fetchall()]

    shift_qry = """
        SELECT * FROM shift
        WHERE user_id = %s and payslip_id IS NULL
    """
    shift_values = user.id
    cursor.execute(shift_qry, shift_values)
    shifts = [Shift.create_from_details(shift) for shift in cursor.fetchall()]

    for payslip in payslips:
        date_end = payslip.date - timedelta(days=2)
        date_start = date_end - timedelta(weeks=2) + timedelta(days=1)
        for shift in shifts:
            if shift.date > date_start and shift.date < date_end:
                qry = """
                    UPDATE shift
                    SET payslip_id = %s
                    WHERE id = %s and type = %s
                """
                values = (payslip.id, shift.id, "Timecard")
                cursor.execute(qry, values)


async def get_payslips(browser, user):
    with connect_sql() as cursor:
        payslips = await scrape_payslips(browser, user)
        for payslip in payslips:
            payslip.commit(cursor, user.id)


async def get_shifts(browser, user):
    with connect_sql() as cursor:
        # shifts and schedule (fgp)
        schedule = await scrape_shifts(browser, user.pointer, "Schedule", user)
        timecard = await scrape_shifts(browser, user.pointer, "Timecard", user)

        for shift in schedule + timecard:
            shift.commit(cursor, user.id)

        assign_shifts(user, cursor)


async def scrape_user(user, playwright, headless, command):
    browser = await playwright.firefox.launch(headless=headless)
    logger.debug(f"Browser opened for user {user.id}")

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
        logger.debug(f"Browser closed for user {user.id}")
        logger.info(f"Finished scraping {command} for user {user.id}")


async def scrape_all(playwright, headless, command):
    users = get_users()
    tasks = [scrape_user(user, playwright, headless, command) for user in users]
    await asyncio.gather(*tasks)
