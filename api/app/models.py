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
    sd_user = db.Column(db.String(200))
    sd_pass = db.Column(db.String(200))

    shifts = db.relationship("Shift", back_populates="user", cascade="all, delete")
    payslips = db.relationship("Payslip", back_populates="user", cascade="all, delete")

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

    def set_sd_pass(self, password: str):
        self.sd_pass = fernet.encrypt(password.encode())

    def get_sd_pass(self):
        return fernet.decrypt(self.sd_pass).decode()


class Shift(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    date = db.Column(db.Date)
    start = db.Column(db.Integer)
    end = db.Column(db.Integer)
    hours = db.Column(db.Float)
    rate = db.Column(db.Float)
    type = db.Column(db.String(32))
    category = db.Column(db.String(32), default="work")
    has_scraped = db.Column(db.Boolean, default=True)
    has_removed = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.String(32), db.ForeignKey("user.id"), nullable=False)
    payslip_id = db.Column(db.Integer, db.ForeignKey("payslip.id", ondelete="CASCADE"))

    user = db.relationship("User", back_populates="shifts", cascade="all, delete")
    payslip = db.relationship("Payslip", back_populates="shifts", cascade="all, delete")

    def to_json(self):
        return {
            "id": self.id,
            "date": self.date,
            "start": self.start,
            "end": self.end,
            "hours": self.hours,
            "rate": self.rate,
            "type": self.type,
            "category": self.category,
        }


class Payslip(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    date = db.Column(db.Date)
    rate = db.Column(db.Float)
    net = db.Column(db.Float)
    hours = db.Column(db.Float)
    deductions = db.Column(db.Float)
    pay = db.Column(db.Float)
    user_id = db.Column(db.String(32), db.ForeignKey("user.id"), nullable=False)

    user = db.relationship("User", back_populates="payslips", cascade="all, delete")
    shifts = db.relationship("Shift", back_populates="payslip", cascade="all, delete")

    def to_json(self):
        return {
            "id": self.id,
            "date": self.date,
            "rate": self.rate,
            "net": self.net,
            "user_id": self.user_id,
            "shifts": [shift.id for shift in self.shifts]
        }

