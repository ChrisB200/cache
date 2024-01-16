import numpy as np
import cv2
import re
import datetime
import pytesseract
from scripts.utils import Shift, DATE_PATTERN


class PreProcesser:
    @staticmethod
    # get grayscale image
    def get_grayscale(image):
        return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    @staticmethod
    # noise removal
    def remove_noise(image):
        return cv2.medianBlur(image, 5)

    @staticmethod
    # thresholding
    def thresholding(image):
        return cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

    @staticmethod
    # dilation
    def dilate(image):
        kernel = np.ones((5, 5), np.uint8)
        return cv2.dilate(image, kernel, iterations=1)

    @staticmethod
    # erosion
    def erode(image):
        kernel = np.ones((5, 5), np.uint8)
        return cv2.erode(image, kernel, iterations=1)

    @staticmethod
    # opening - erosion followed by dilation
    def opening(image):
        kernel = np.ones((5, 5), np.uint8)
        return cv2.morphologyEx(image, cv2.MORPH_OPEN, kernel)

    @staticmethod
    # canny edge detection
    def canny(image):
        return cv2.Canny(image, 100, 200)

    @staticmethod
    # skew correction
    def deskew(image):
        coords = np.column_stack(np.where(image > 0))
        angle = cv2.minAreaRect(coords)[-1]
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(
            image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE
        )
        return rotated

    @staticmethod
    # template matching
    def match_template(image, template):
        return cv2.matchTemplate(image, template, cv2.TM_CCOEFF_NORMED)


def extract_date(sentence):
    # Define the regular expression pattern to extract the date in the format "dd/mm/yyyy"
    for pattern in DATE_PATTERN:
        match = re.search(pattern[0], sentence)

        if match:
            date = match.group()
            print(date)
            return date

    return None


def is_time_format(input_string):
    # Define the regular expression pattern for the time format "hh:mm am/pm"
    time_pattern = r"\d{1,2}:\d{2}\s(?:am|pm)"
    match = re.match(time_pattern, input_string, re.IGNORECASE)
    return match is not None


def time_and_event(input_string):
    # Define the regular expression pattern to extract time and event (time in/out)
    time_pattern = r"(\d{1,2}:\d{2}\s(?:am|pm))"
    event_pattern = r"(Time (?:in|out))"

    # Use re.findall() to find all occurrences of time and event in the input_string
    times = re.findall(time_pattern, input_string, re.IGNORECASE)
    events = re.findall(event_pattern, input_string, re.IGNORECASE)

    if times and events:
        # Assuming there is only one time and one event in the input_string
        time = times[0]
        event = events[0]

        return time, event
    else:
        return None, None


def split_time(unconvertedTime):
    splitTime = unconvertedTime.split(" ")
    time = splitTime[0]
    hours = int(time.split(":")[0])
    minutes = int(time.split(":")[1])
    period = splitTime[1].lower()
    hours = Shift.convert12hr(hours, period)
    return hours, minutes, period


def read_payslip(image, rate):
    # PreProcessing
    payslip = image
    payslip_gray = PreProcesser.get_grayscale(payslip)
    processed_payslip = PreProcesser.thresholding(payslip_gray)

    # Image Recognition
    custom_config = r"--oem 3 --psm 6"
    text_from_image = pytesseract.image_to_string(
        processed_payslip, config=custom_config
    )
    split_text = text_from_image.split("\n")

    # Text Recognition
    time_in = False
    time_out = False
    date = False

    # Time and Date formatting
    for i in split_text:
        timeFormat = time_and_event(i)
        if timeFormat != (None, None):
            if "time in" in timeFormat[1].lower():
                time_in = timeFormat[0]
                time_in = split_time(time_in)
            else:
                time_out = timeFormat[0]
                time_out = split_time(time_out)

        # Date formatting
        loopDate = extract_date(i)
        if loopDate is not None:
            date = loopDate

    # Shift formatting
    message = 1

    if time_in != False:
        startingTime = datetime.time(hour=time_in[0], minute=time_in[1])
    else:
        message = 0

    if time_out != False:
        finishingTime = datetime.time(hour=time_out[0], minute=time_out[1])
    else:
        message = 0

    shift = {
        "date": date,
        "start": startingTime.strftime("%H:%M"),
        "finish": finishingTime.strftime("%H:%M"),
        "rate": rate,
        "message": message,
    }

    return shift
