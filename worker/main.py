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


class Shift:
    def __init__(self, date: date, start: time, end: time, type, rate=11.85):
        self.date: date = date
        self.start: time = start
        self.end: date = end
        self.hours = time_difference(self.start, self.end)
        self.rate = rate
        self.type = type

    def to_json(self):
        return {
            "date": self.date.strftime("%d/%m/%Y"),
            "start": self.start.strftime("%H:%M"),
            "end": self.end.strftime("%H:%M"),
            "hours": self.hours,
            "rate": self.rate,
        }


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
def get_shifts(context: BrowserContext, page, button):
    page.locator("a").filter(has_text="My Rota").click()
    page.locator("a").filter(has_text=button).click()

    if button != "Timecard":
        page.get_by_role("button", name="Week View").click()
        html = parse_page(page)

    # initialising the details
    details = read_details("details.json")
    pointer = details.get("pointer")
    week_after = start_of_week(datetime.today()) + timedelta(weeks=2)
    current_date = datetime.strptime(pointer, "%d/%m/%Y")
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
                print(hours)

                if len(hours) > 7 and hours[0] != "-":
                    start = datetime.strptime(hours[0], "%H:%M").time()
                    end = datetime.strptime(hours[2], "%H:%M").time()
                    date = (week_start + timedelta(days=count)).date()
                    shifts.append(Shift(date, start, end))

        current_date = current_date + timedelta(weeks=1)
        if current_date >= week_after:
            break

    return shifts

    with open(f"{button}.json", "w") as file:
        json.dump([shift.to_json() for shift in shifts], file)


def get_data(browser):
    connection, cursor = connect_sql()
    cursor.execute("SELECT * FROM user")
    users = cursor.fetchall()
    for user in users:
        print(user)
        print(get_shifts(browser, user[3], fernet.decrypt(user[4]).decode(), "Schedule"))


def main(headless=True):

    with sync_playwright() as p:
        browser = p.firefox.launch(headless=headless)
        get_data(browser)
        browser.close()

main(False)
