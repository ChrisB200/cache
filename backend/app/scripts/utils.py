import numpy as np
import os
import re
from datetime import datetime, timedelta, time
from PIL import Image

DATE_PATTERN = [
    [r"\b\d{2}/\d{2}/\d{4}\b", "%d/%m/%Y"],
    [r"\b\d{4}/\d{2}/\d{2}\b", "%Y/%m/%d"],
    [r"\b\d{2}-\d{2}-\d{2}\b", "%d-%m-%y"],
    [r"\b\d{1}/\d{2}/\d{4}\b", "%d/%m/%Y"],
    [r"\b\d{2}/\d{1}/\d{4}\b", "%d/%m/%Y"],
    [r"\b\d{1}/\d{1}/\d{4}\b", "%d/%m/%Y"],
]

# Database Environment Variables
DB_USERNAME = os.environ.get("DB_USERNAME")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
DB_HOST = os.environ.get("DB_HOST")
DB_NAME = os.environ.get("DB_NAME")

def is_valid_date_format(date_string, expected_format):
    date_pattern = re.compile(expected_format)
    return bool(date_pattern.match(date_string))


class Shift:
    def __init__(self, date: datetime, start: datetime, finish: datetime, rate: float):
        self.date: datetime.date = date
        self.start: time = start
        self.finish: time = finish
        self.rate: float = rate

    @staticmethod
    def convert12hr(time: int, timeframe: str) -> int:
        if timeframe.lower() == "pm":
            time += 12
        return time

    @staticmethod
    def strToDate(date: str, format: str) -> datetime:
        return datetime.strptime(date, format).date()

    @staticmethod
    def strToTime(time_str: str, format: str) -> time:
        return datetime.strptime(time_str, format).time()

    @property
    def hours(self) -> timedelta:
        return self.finish - self.start

    @property
    def type(self) -> str:
        if (self.finish - self.start) <= timedelta(hours=8.5):
            return "Open"
        elif (self.finish - self.start) <= timedelta(hours=13.5):
            return "Middle"
        else:
            return "Close"

    @property
    def dateStr(self) -> str:
        return self.date.strftime("%Y-%m-%d")

    @property
    def startStr(self) -> str:
        return self.start.strftime("%H:%M")

    @property
    def finishStr(self) -> str:
        return self.finish.strftime("%H:%M")
    
    @property
    def hoursStr(self) -> str:
        duration = datetime.utcfromtimestamp(self.hours.total_seconds())
        return duration.strftime('%H:%M')

    @property
    def pay(self) -> float:
        return round((self.hours.total_seconds() / 3600) * self.rate, 2)

    @property
    def values(self) -> tuple:
        return (
            self.dateStr,
            self.startStr,
            self.finishStr,
            self.rate,
        )

    def json(self) -> dict:
        return {
            "shiftDate": self.dateStr,
            "shiftStart": self.startStr,
            "shiftFinish": self.finishStr,
            "rate": self.rate,
            "hours": self.hoursStr,
            "pay": self.pay,
            "type": self.type,
        }


# Formats the image so that it can be read
# NEED TO CHECK TYPE OF IMAGE
def format_image(image) -> np.ndarray:
    pil_image = Image.open(image)
    return np.array(pil_image)

# Returns all shifts within a time period
def return_period_shifts(initial, current=datetime.now(), interval=2) -> tuple:
    current_date = current.date()
    initial_pay = initial.date()
    current_pay = initial_pay

    # Gets final date
    while True:
        current_pay += timedelta(weeks=interval)
        upper_bound = current_pay

        if current_date <= upper_bound:
            end_date = upper_bound
            start_date = (end_date - timedelta(weeks=2)).strftime("%Y-%m-%d")
            end_date = end_date.strftime("%Y-%m-%d")
            break

    return start_date, end_date


def get_next_pay(lastPay, nextPay) -> dict:
    daysLeft = (datetime.strptime(nextPay, "%Y-%m-%d") - datetime.today()).days + 2
    return {"lastPaid": lastPay, "nextPaid": nextPay, "daysLeft": daysLeft}

