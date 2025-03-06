import os
import pymysql
import contextlib
import logging
import asyncio

from datetime import datetime
from datetime import timedelta
from cryptography.fernet import Fernet
from bs4 import BeautifulSoup
from pymysql.err import OperationalError

from dotenv import load_dotenv

logger = logging.getLogger(__name__)

load_dotenv()
fernet = Fernet(os.environ.get("ENCRYPT_KEY"))
DB_NAME = os.environ.get("DB_NAME")
DB_HOST = os.environ.get("DB_HOST")
DB_USERNAME = os.environ.get("DB_USERNAME")
DB_PASSWORD = os.environ.get("DB_PASSWORD")


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
