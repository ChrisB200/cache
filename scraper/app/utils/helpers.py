from bs4 import BeautifulSoup
from datetime import datetime
from datetime import timedelta


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


def upper_first_letter(string):
    return f"{string[0].upper()}{string[1:]}"
