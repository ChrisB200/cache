import psycopg2
from psycopg2.extensions import connection, cursor
from psycopg2.extras import DictCursor
from ..utils.exceptions import RowNotFoundError

from .env import DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME, DB_PORT


def connect_to_database() -> tuple[connection, cursor]:
    conn: connection = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USERNAME,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    cur: cursor = conn.cursor(cursor_factory=DictCursor)
    return conn, cur


def get_user(cur: cursor, user_id: str):
    cur.execute("""
        SELECT *
        FROM public.users
        WHERE user_id = %s
    """, (user_id,))

    row = cur.fetchone()

    if not row:
        raise RowNotFoundError(f"Could not find user {id}")

    return row


def get_users(cur: cursor):
    cur.execute("SELECT id FROM public.users")
    rows = cur.fetchall()

    rows = [row["id"] for row in rows]

    return rows
