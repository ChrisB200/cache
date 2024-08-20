from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from cryptography.fernet import Fernet
from uuid import uuid4

import bcrypt
import os

db = SQLAlchemy()
fernet = Fernet(os.environ.get("ENCRYPT_KEY"))


def get_uuid():
    return uuid4().hex


class User(UserMixin, db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(300), nullable=False)
    password = db.Column(db.Text)
    fg_user = db.Column(db.String(200))
    fg_pass = db.Column(db.String(200))
    pointer = db.Column(db.Date)
    last_pay = db.Column(db.Float)
    cutoff_index = db.Column(db.Integer)

    shifts = db.relationship("Shift", back_populates="user", cascade="all, delete")

    def get_id(self):
        return str(self.id)

    def set_password(self, password):
        self.password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode(
            "utf-8"
        )

    def check_password(self, password):
        hashed_password = self.password.encode("utf-8")
        return bcrypt.checkpw(password.encode(), hashed_password)

    def set_fg_pass(self, password: str):
        self.fg_pass = fernet.encrypt(password.encode())

    def get_fg_pass(self):
        return fernet.decrypt(self.fg_pass).decode()


class Shift(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    date = db.Column(db.Date)
    start = db.Column(db.Time)
    end = db.Column(db.Time)
    hours = db.Column(db.Float)
    rate = db.Column(db.Float)
    type = db.Column(db.String(32))
    user_id = db.Column(db.String(32), db.ForeignKey("user.id"), nullable=False)

    user = db.relationship("User", back_populates="shifts", cascade="all, delete")
