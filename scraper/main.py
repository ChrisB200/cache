import logging
import time
import asyncio
from bs4 import BeautifulSoup
from datetime import datetime
from datetime import timedelta
from playwright.async_api import async_playwright
from playwright.async_api import BrowserContext
from bs4 import PageElement

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


username = "30500"
password = "xbq1DBF3azm9kqv.hkh"
FGP_BASE_URL = "https://fgp.fiveguys.co.uk/portal.php"

start_date = datetime(2024, 7, 8)


def time_difference(start, end):
    diff = end - start
    h = diff / 3600
    return h


def start_of_week(date: datetime):
    weekday_index = date.weekday()
    return date - timedelta(days=weekday_index)


async def parse_page(page) -> BeautifulSoup:
    html = await page.content()
    soup = BeautifulSoup(html, "html.parser")
    return soup


async def scrape_shifts(context: BrowserContext):
    page = await context.new_page()
    url = f"{FGP_BASE_URL}?site=login&page=login"

    await page.goto(url)
    logger.debug(f"navigated to ${url}")

    # log in
    await page.get_by_label("Username").fill(username)
    await page.get_by_label("Password").fill(password)
    await page.get_by_role("button", name="Submit").click()
    logger.debug("logged in")

    # navigate to rota
    await page.locator("a").filter(has_text="My Rota").click()

    # choose timecard or schedule
    shift_type = "Schedule"
    await page.locator("a").filter(has_text=shift_type).click()

    # check what type of shifts
    if shift_type != "Timecard":
        await page.get_by_role("button", name="Week").click()
        html = await parse_page(page)

    # initializing the details
    current_date = start_date
    week_after = start_of_week(datetime.today()) + timedelta(weeks=4)
    date_element = page.get_by_placeholder("dd/mm/yy")
    shifts = []
    e = 3
    c = 0

    while True:
        if c > e:
            break
        c += 1
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
            day: PageElement
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
                        "type": shift_type,
                    }

                    logger.debug(f"Scraped shift: {
                                 str(shift)} for user")
                    shifts.append(shift)

                if len(hours) > 7 and hours[0] != "-":
                    date = (week_start + timedelta(days=count)).date()

                    # Parse start and end times
                    start = datetime.strptime(hours[0], "%H:%M").time()
                    end = datetime.strptime(hours[2], "%H:%M").time()

                    # Combine with date and adjust if shift goes past midnight
                    start_datetime = datetime.combine(date, start)
                    if end < start:  # Shift ends the next day
                        end_datetime = datetime.combine(
                            date + timedelta(days=1), end)
                    else:
                        end_datetime = datetime.combine(date, end)

                    shift = {
                        "date": date,
                        "start": start_datetime.timestamp(),
                        "end": end_datetime.timestamp(),
                        "rate": 12.05,
                        "type": shift_type,
                        "category": "work",
                        "hours": round(time_difference(start_datetime.timestamp(), end_datetime.timestamp()), 2)
                    }
                    logger.debug(f"Scraped shift: {
                                 str(shift)} for user")
                    shifts.append(shift)

        current_date = current_date + timedelta(weeks=1)
        if isinstance(current_date, datetime):
            current_date = current_date.date()
        if current_date >= week_after.date():
            break

    logger.info(f"Scraped {len(shifts)} shifts for user ")
    [print(f"{shift}\n\n") for shift in shifts]


async def main():
    async with async_playwright() as p:
        browser = await p.firefox.launch(headless=False)
        logger.debug("Opened browser")
        await scrape_shifts(browser)


asyncio.run(main())
