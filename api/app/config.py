from dotenv import load_dotenv
import os

load_dotenv()


class ApplicationConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY")

    DB_USERNAME = os.environ.get("DB_USERNAME")
    DB_PASSWORD = os.environ.get("DB_PASSWORD")
    DB_HOST = os.environ.get("DB_HOST")
    DB_NAME = os.environ.get("DB_NAME")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{
        DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
