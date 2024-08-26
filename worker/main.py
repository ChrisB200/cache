from playwright.sync_api import sync_playwright
from playwright.sync_api import BrowserContext
from bs4 import BeautifulSoup
from datetime import datetime
from datetime import date
from datetime import time
from datetime import timedelta
from dotenv import load_dotenv
from cryptography.fernet import Fernet

import os
import json
import bs4
import pymysql
import logging
import logging.config
import time as t
import re

logger = logging.getLogger(__name__)


def setup_logging():
    config_path = "log_config.json"
    with open(config_path, "r") as conf_file:
        config = json.load(conf_file)
    logging.config.dictConfig(config=config)


setup_logging()

load_dotenv()
BASE_URL = "https://fgp.fiveguys.co.uk/portal.php"
fernet = Fernet(os.environ.get("ENCRYPT_KEY"))


def time_difference(time1, time2):
    dummy_date = datetime(1900, 1, 1)
    dt1 = datetime.combine(dummy_date, time1)
    dt2 = datetime.combine(dummy_date, time2)
    time_diff = dt2 - dt1
    hours = time_diff.total_seconds() / 3600
    return hours


def connect_sql():
    connection = pymysql.connect(
        host=os.environ.get("DB_HOST"),
        user=os.environ.get("DB_USERNAME"),
        password=os.environ.get("DB_PASSWORD"),
        db=os.environ.get("DB_NAME"),
    )

    cursor = connection.cursor()
    return connection, cursor


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

    @staticmethod
    def convert_to_time(delta):
        # Extract the hours, minutes, and seconds from the timedelta
        hours, remainder = divmod(delta.seconds, 3600)
        minutes, seconds = divmod(remainder, 60)

        # Create a time object using the extracted values
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

    def exist(self, connection, cursor, user_id):
        query = """
            SELECT * FROM shift
            WHERE date = %s AND type = %s AND user_id = %s
        """

        values = (self.date, self.type, user_id)
        cursor.execute(query, values)
        shift = cursor.fetchone()

        return shift

    def commit(self, connection, cursor, user_id):
        existing_shift = self.exist(connection, cursor, user_id)
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

    def exist(self, connection, cursor, user_id):
        query = """
            SELECT * FROM payslip
            WHERE date = %s AND user_id = %s
        """

        values = (self.date, user_id)
        cursor.execute(query, values)
        payslip = cursor.fetchone()

        return payslip

    def commit(self, connection, cursor, user_id):
        existing_payslip = self.exist(connection, cursor, user_id)
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


def login_required(func):
    def wrapper(browser, user, password, *args, **kwargs):
        page = browser.new_page()
        page.goto(f"{BASE_URL}?site=login&page=login")

        # enter user details
        page.get_by_label("Username").fill(user)
        page.get_by_label("Password").fill(password)
        page.get_by_role("button", name="Submit").click()

        result = func(browser, page, *args)

        return result

    return wrapper


def read_details(filename):
    with open(filename, "r") as file:
        contents = json.load(file)

    return contents


def write_details(filename, contents):
    with open(filename, "w") as file:
        json.dump(contents, file)


def parse_page(page) -> BeautifulSoup:
    html = page.content()
    soup = BeautifulSoup(html, "html.parser")
    return soup


def start_of_week(date: datetime):
    weekday_index = date.weekday()
    return date - timedelta(days=weekday_index)


@login_required
def scrape_shifts(context: BrowserContext, page, pointer, button):
    page.locator("a").filter(has_text="My Rota").click()
    page.locator("a").filter(has_text=button).click()

    if button != "Timecard":
        page.get_by_role("button", name="Week View").click()
        html = parse_page(page)

    # initialising the details
    week_after = start_of_week(datetime.today()) + timedelta(weeks=2)
    current_date = pointer
    date_element = page.get_by_placeholder("dd/mm/yy")
    shifts = []

    while True:
        # choose the current week
        current_date_str = current_date.strftime("%d/%m/%Y")
        date_element.fill(str(current_date_str))
        date_element.press("Enter")
        date_element.press("Enter")

        # wait for it to load and then parse the page
        page.wait_for_selector("text=Total")
        html = parse_page(page)
        days = html.find_all(class_="day-heading")

        # get the date
        date_content = date_element.input_value()
        selected_date = datetime.strptime(date_content, "%d/%m/%Y")
        week_start = start_of_week(selected_date)

        # get the total number of hours for week
        total_element = page.locator("h3").filter(has_text="Total ")
        total_split = total_element.text_content().split(" ")
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
                    shifts.append(Shift(date, start, end, button))

        current_date = current_date + timedelta(weeks=1)
        if current_date >= week_after.date():
            break

    return shifts


def get_users():
    connection, cursor = connect_sql()
    cursor.execute("SELECT * FROM user")
    users = cursor.fetchall()
    connection.close()
    return users


def scrape_payslips(browser, username, password):
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://my.sdworx.co.uk/portal/login.aspx?organisation=76231")

    # enter log in details
    page.get_by_placeholder("Username").fill(username)
    page.get_by_placeholder("Password").fill(password)
    page.get_by_role("button", name="Sign In").click()

    # presses payslips
    with page.expect_popup() as popup_info:
        page.frame_locator('iframe[name="ContainerFrame"]').frame_locator(
            'iframe[name="iframeCommunityContainer"]'
        ).get_by_role("link", name="My Payslip").click()

    # highlights popup page
    current = popup_info.value
    current.bring_to_front()

    # locates payslip history
    current.wait_for_timeout(5000)
    date_div = current.locator(".divPaymentHistory").first
    anchors = date_div.locator("a").all()

    # match all years and click them
    year_elements = []
    for element in anchors:
        text_content = element.inner_text()
        # find all year patterns in the text
        matches = re.findall(r"\b\d{4}\b", text_content)
        # append the matches if they represent a year
        for match in matches:
            year = int(match)
            if 1900 <= year <= 2100:  # valid year range
                year_elements.append(element)

    # press all date dropdowns
    for count, element in enumerate(year_elements):
        if count != 0:
            element.click()

    # get all anchors
    payslips = []
    currentYear = datetime.today().year
    for element in anchors:
        text_content = element.inner_text()
        if len(text_content) == 4:
            currentYear = int(text_content)

        elif len(text_content) == 6:
            # get date
            date_str = element.inner_text()
            day, month = date_str.split(" ")
            date_obj = datetime.strptime(month, "%b")
            date = date_obj.replace(year=currentYear, day=int(day))

            element.click()
            current.wait_for_timeout(1000)

            rate_lbls = current.locator(".TDData").all()
            rate = None
            for lbl in rate_lbls:
                if "£" in lbl.inner_text():
                    rate = float(lbl.inner_text().split("£")[1])

            net_pay_lbl = current.locator("#baseNetPayBackground")
            net_pay = net_pay_lbl.locator("xpath=following-sibling::*[1]")
            net_pay = net_pay.inner_text().split("£")[1]

            payslip = Payslip(date.date(), net_pay, rate)
            payslips.append(payslip)

    return payslips


def get_data(browser, user):
    connection, cursor = connect_sql()

    # payslips (sdworkx)
    payslips = scrape_payslips(browser, user.sd_user, user.sd_pass)
    for payslip in payslips:
        payslip.commit(connection, cursor, user.id)

    # shifts and schedule (fgp)
    schedule = scrape_shifts(
        browser, user.fg_user, user.fg_pass, user.pointer, "Schedule"
    )
    timecard = scrape_shifts(
        browser, user.fg_user, user.fg_pass, user.pointer, "Timecard"
    )

    for shift in schedule + timecard:
        shift.commit(connection, cursor, user.id)

    connection.commit()
    connection.close()


def assign_shifts(user):
    connection, cursor = connect_sql()
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

    connection.commit()


def scrape_user(user, playwright, headless):
    browser = playwright.firefox.launch(headless=headless)
    #get_data(browser, user)
    assign_shifts(user)
    browser.close()


def main(headless=True):
    users = get_users()
    with sync_playwright() as p:
        [scrape_user(User(user), p, headless) for user in users]


main(False)
