from dotenv import load_dotenv
import os

load_dotenv()


def get_env(key: str, default=None):
    value = os.getenv(key)
    if not value and not default:
        raise TypeError("Key does not exist")
    if value:
        return value
    return default


DB_NAME = get_env("DB_NAME")
DB_PASSWORD = get_env("DB_PASSWORD")
DB_USERNAME = get_env("DB_USERNAME")
DB_HOST = get_env("DB_HOST")
DB_PORT = get_env("DB_PORT", 54322)
ENCRYPTION_KEY = get_env("ENCRYPTION_KEY")
