from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(300), nullable=False)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)

    institution = db.relationship("Institution", back_populates="user", cascade="all, delete")
    pocket = db.relationship("Pocket", back_populates="user", cascade="all, delete")
    budget = db.relationship("Budget", back_populates="user", cascade="all, delete")
    
    def get_id(self):
        return str(self.user_id)

class Institution(db.Model):
    __tablename__ = "institutions"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    name = db.Column(db.String(255))
    plaid_item_id = db.Column(db.String(255), nullable=False)
    plaid_access_token = db.Column(db.String(255), nullable=False)

    user = db.relationship("User", back_populates="institution", cascade="all, delete")
    account = db.relationship("Account", back_populates="institution", cascade="all, delete")

class Account(db.Model):
    __tablename__ = "accounts"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    institution_id = db.Column(db.String(32), db.ForeignKey('institutions.id'))
    plaid_account_id = db.Column(db.String(255), nullable=False)

    iso_currency_code = db.Column(db.String(3), nullable=False)
    available_balance = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=True)
    current_balance = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=True)
    type = db.Column(db.String(45), nullable=False)
    limit = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=True)

    job = db.relationship("Job", back_populates="account", cascade="all, delete")
    institution = db.relationship("Institution", back_populates="account", cascade="all, delete")

class Job(db.Model):
    __tablename__ = "jobs"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    account_id = db.Column(db.String(32), db.ForeignKey('accounts.id'), index=True)
    role = db.Column(db.String(45), nullable=False)
    entity = db.Column(db.String(45), nullable=False)
    default_hourly_rate = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=False)
    pay_frequency = db.Column(db.Integer, nullable=False)
    last_pay = db.Column(db.Date, nullable=False)
    last_pay_offset = db.Column(db.Integer, nullable=True)

    account = db.relationship("Account", back_populates="job", cascade="all, delete")
    payslip = db.relationship("Payslip", back_populates="job", cascade="all, delete")
    shift = db.relationship("Shift", back_populates="job", cascade="all, delete")

class Payslip(db.Model):
    __tablename__ = "payslips"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    job_id = db.Column(db.String(32), db.ForeignKey('jobs.id'), index=True)
    amount = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=False)
    start_period = db.Column(db.Date, nullable=False)
    end_period = db.Column(db.Date, nullable=False)
    hourly_rate = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=False)
    tax_code = db.Column(db.String(45))

    job = db.relationship("Job", back_populates="payslip", cascade="all, delete")
    shift = db.relationship("Shift", back_populates="payslip", cascade="all, delete")

class Shift(db.Model):
    __tablename__ = "shifts"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    job_id = db.Column(db.String(32), db.ForeignKey('jobs.id'), index=True)
    payslip_id = db.Column(db.String(32), db.ForeignKey('payslips.id'), index=True, nullable=True)
    date = db.Column(db.Date, nullable=False)
    start = db.Column(db.Time, nullable=False)
    finish = db.Column(db.Time, nullable=False)

    job = db.relationship("Job", back_populates="shift", cascade="all, delete")
    payslip = db.relationship("Payslip", back_populates="shift", cascade="all, delete")

    def return_json(self):
        return {
            "shift_id": self.shift_id,
            "job_id": self.job_id,
            "payslip_id": self.payslip_id,
            "date": self.date.strftime('%Y-%m-%d'),
            "start": self.start.strftime('%H:%M:%S'),  
            "finish": self.finish.strftime('%H:%M:%S') 
        }

class Pocket(db.Model):
    __tablename__ = "pockets"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'), index=True)
    goal = db.Column(db.String(80), nullable=False)
    balance = db.Column(db.DECIMAL(15, 2), nullable=False)
    desired_balance = db.Column(db.DECIMAL(15, 2))
    percent_allocated = db.Column(db.DECIMAL(15, 2))
    status = db.Column(db.String(45))

    user = db.relationship("User", back_populates="pocket", cascade="all, delete")

class Budget(db.Model):
    __tablename__ = "budgets"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'), index=True)
    name = db.Column(db.String(45), nullable=False)
    percent_allocated = db.Column(db.DECIMAL(15, 2))

    user = db.relationship("User", back_populates="budget", cascade="all, delete")
