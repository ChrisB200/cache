import logging
from zoneinfo import ZoneInfo
from datetime import datetime
from datetime import timedelta
from playwright.async_api import BrowserContext
from psycopg2.extensions import cursor
from bs4 import PageElement
from ics import Calendar, Event
from ..utils.security import get_credentials
from ..utils.helpers import start_of_week
from ..config.database import connect_to_database
from ..utils.helpers import time_difference
from ..utils.helpers import parse_page
from ..utils.helpers import upper_first_letter


logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


start_date = datetime(2024, 7, 8)
FGP_BASE_URL = "https://fgp.fiveguys.co.uk/portal.php"


async def login_to_fgp(page: BrowserContext, user_id: str, cur: cursor):
    # navigate to login page
    url = f"{FGP_BASE_URL}?site=login&page=login"
    await page.goto(url)

    # grab decrpyted credentials
    credentials = get_credentials(cur, user_id, "FGP")
    username = credentials["username"]
    password = credentials["password"]

    # fill in the elements
    await page.get_by_label("Username").fill(username)
    await page.get_by_label("Password").fill(password)
    await page.get_by_role("button", name="Submit").click()

    # TODO: add error handling to check if user has logged in

    logger.debug(f"user {user_id} logged into fgp")


async def navigate_to_rota(page: BrowserContext, shift_type: str, user_id: str):
    # navigate to rota
    await page.locator("a").filter(has_text="My Rota").click()

    # choose timecard or schedule
    shift_type_upper = upper_first_letter(shift_type)
    await page.locator("a").filter(has_text=shift_type_upper).click()

    # week view needs to be toggled for schedule
    print(shift_type_upper)
    if shift_type_upper != "Timecard":
        await page.get_by_role("button", name="Week").click()

    # TODO: add error handling to check if we are on the rota page

    logger.debug(f"user {user_id} navigated to {shift_type} rota")


async def select_week(date, date_element):
    # choose the current week
    date_str = date.strftime("%d/%m/%Y")
    await date_element.fill(str(date_str))
    await date_element.press("Enter")
    await date_element.press("Enter")


async def get_week_days(page: BrowserContext):
    # get all the days of the week on the page
    await page.wait_for_selector("text=Total")
    html = await parse_page(page)
    days = html.find_all(class_="day-heading")
    return days


async def get_week_start(date_element):
    # get the date
    date_content = await date_element.input_value()
    selected_date = datetime.strptime(date_content, "%d/%m/%Y")
    week_start = start_of_week(selected_date)
    return week_start


async def get_week_hours(page: BrowserContext):
    total_element = page.locator("h3").filter(has_text="Total ")
    total_text = await total_element.text_content()
    total_split = total_text.split(" ")
    week_hours = float(total_split[1].split("hrs")[0])
    return week_hours


async def parse_week_view(page: BrowserContext, week_date):
    date_element = page.get_by_placeholder("dd/mm/yy")
    await select_week(week_date, date_element)
    week_days = await get_week_days(page)
    week_start = await get_week_start(date_element)
    week_hours = await get_week_hours(page)

    return week_days, week_start, week_hours


def parse_regular_shift(hours, week_start, count):
    date = (week_start + timedelta(days=count)).date()

    start = datetime.strptime(hours[0], "%H:%M").time()
    end = datetime.strptime(hours[2], "%H:%M").time()

    tz = ZoneInfo("Europe/London")  # pick your source timezone
    start_dt = datetime.combine(date, start).replace(tzinfo=tz)
    end_dt = datetime.combine(
        date + timedelta(days=end < start), end).replace(tzinfo=tz)

    return {
        "date": date,
        "start": start_dt,              # no .timestamp()
        "finish": end_dt,               # no .timestamp()
        "rate": 12.05,
        "category": "work",
        "hours": round((end_dt - start_dt).total_seconds() / 3600, 2),
    }


# TODO: this is not calculated correctly
def parse_holiday_shift(week_start, count):
    date = (week_start + timedelta(days=count)).date()
    shift = {
        "date": date,
        "start": 0,
        "finish": 0,
        "category": "holiday",
        "hours": 8,
        "rate": 12.05,
    }

    logger.debug(f"Scraped shift: {str(shift)} for user")
    return shift


async def get_shift(day, count, week_start):
    # gets the shifts
    shift = day.find_next("p")
    shift_line = shift.find_next("span").find_next("span").text
    hours = shift_line.split(" ")

    if len(hours) > 7 and hours[0] != "-":
        return parse_regular_shift(hours, week_start, count)
    elif "HOL" in hours:
        pass
        # return parse_holiday_shift(week_start, count)


async def get_shifts(week_days, week_start, week_hours):
    week_shifts = []

    day: PageElement
    for count, day in enumerate(week_days):
        if week_hours == 0:
            continue

        shift = await get_shift(day, count, week_start)
        if shift:
            week_shifts.append(shift)

    return week_shifts


async def scrape_shifts(context: BrowserContext, shift_type: str, user_id: str, cur):
    # navigate to the fgp
    page = await context.new_page()
    await page.goto(FGP_BASE_URL)

    await login_to_fgp(page, user_id, cur)
    await navigate_to_rota(page, shift_type, user_id)

    # looping through the weeks
    current_date = get_start_date(cur, user_id, shift_type)
    end_date = start_of_week(datetime.today()) + timedelta(weeks=4)
    shifts = []

    max = 1000000
    current = 0
    while True:
        current += 1
        week_days, week_start, week_hours = await parse_week_view(page, current_date)
        week_shifts = await get_shifts(week_days, week_start, week_hours)
        shifts.extend(week_shifts)

        # to stop it from scraping after current date + offset
        current_date = current_date + timedelta(weeks=1)
        if isinstance(current_date, datetime):
            current_date = current_date.date()
        if current_date >= end_date.date():
            break

        if current > max:
            print("btoke")
            break

    return shifts


def get_existing_shifts(start_date, end_date, user_id, shift_type, cur):
    cur.execute("""
        SELECT *
        FROM public.shifts
        WHERE date >= %s and date <= %s and user_id = %s and type = %s
    """, (start_date, end_date, user_id, shift_type))

    rows = cur.fetchall()
    shifts = {}

    for row in rows:
        shifts[row["date"]] = row

    return shifts


def add_shift(new_shift, shift_type, cur, user_id):
    cur.execute("""
        INSERT INTO public.shifts (date, start, finish, category, type, user_id)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (new_shift["date"], new_shift["start"], new_shift["finish"], new_shift["category"], shift_type, user_id))


def update_shift(existing, new_shift, cur):
    date = new_shift.get("date")
    start = new_shift.get("start")
    finish = new_shift.get("finish")
    category = new_shift.get("category")

    if not date or not start or not finish or not category:
        raise TypeError("new shift doesn't have the correct values")

    cur.execute("""
        UPDATE public.shifts
        SET date = %s, start = %s, finish = %s, category = %s
        WHERE id = %s
    """, (date, start, finish, category, existing["id"]))


def commit_shifts(shifts, start_date, end_date, cur, user_id, shift_type):
    existing_shifts = get_existing_shifts(
        start_date, end_date, user_id, shift_type, cur)

    for shift in shifts:
        existing = existing_shifts.get(shift["date"])
        if existing:
            update_shift(existing, shift, cur)
        else:
            add_shift(shift, shift_type,  cur, user_id)

    cur.connection.commit()


def get_last_shift(cur, user_id, shift_type):
    cur.execute("""
        SELECT date
        FROM public.shifts
        WHERE user_id = %s and type = %s
        ORDER BY date DESC
        LIMIT 1
    """, (user_id, shift_type))

    row = cur.fetchone()

    return row


def get_start_date(cur, user_id, shift_type):
    last_shift = get_last_shift(cur, user_id, shift_type)
    date = last_shift.get("date")
    if not date:
        return start_date
    else:
        return date - timedelta(weeks=2)


async def run_shift_scraper(context: BrowserContext, cur: cursor, user_id: str):
    schedule = await scrape_shifts(context, "schedule", user_id, cur)
    timecard = await scrape_shifts(context, "timecard", user_id, cur)

    commit_shifts(schedule, start_date,
                  schedule[-1]["date"], cur, user_id, "schedule")
    commit_shifts(timecard, start_date,
                  timecard[-1]["date"], cur, user_id, "timecard")

    generate_ics(user_id)


def get_schedule(cur, user_id):
    cur.execute("""
        SELECT *
        FROM public.shifts
        where user_id = %s and type = %s
    """, (user_id, "schedule"))

    shifts = cur.fetchall()

    return shifts

# TODO: make this way more efficient


def generate_ics(user_id):
    conn, cur = connect_to_database()
    shifts = get_schedule(cur, user_id)

    c = Calendar()

    for shift in shifts:
        e = Event()
        e.name = "Five Guys Shift"
        e.begin = shift["start"]
        e.end = shift["finish"]
        e.categories = {shift.get("category", "work")}
        e.uid = shift["id"]

        c.events.add(e)

    with open(f"{user_id}/shift.ics", "w", encoding="utf-8") as f:
        f.writelines(c.serialize())
