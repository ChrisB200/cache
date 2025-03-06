import logging

from datetime import datetime
from datetime import timedelta
from playwright.async_api import BrowserContext
from bs4 import PageElement

from .scraper import connect_sql
from .scraper import parse_page
from .scraper import start_of_week
from .scraper import remove_all_range
from .scraper import time_difference

logger = logging.getLogger(__name__)

FGP_BASE_URL = "https://fgp.fiveguys.co.uk/portal.php"


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
