from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from uuid import uuid4

db = SQLAlchemy()


def get_uuid():
    return uuid4().hex

