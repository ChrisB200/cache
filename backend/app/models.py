from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class Users(db.Model, UserMixin):
    __tablename__ = "users"
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))

    institution = db.relationship("Institutions", back_populates="user", cascade="all, delete")
    pocket = db.relationship("Pockets", back_populates="user", cascade="all, delete")
    budget = db.relationship("Budgets", back_populates="user", cascade="all, delete")
    
    def get_id(self):
        return str(self.user_id)

class Institutions(db.Model):
    __tablename__ = "institutions"
    institution_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    name = db.Column(db.String(255))
    plaid_item_id = db.Column(db.String(255), nullable=False)
    plaid_access_token = db.Column(db.String(255), nullable=False)

    user = db.relationship("Users", back_populates="institution", cascade="all, delete")
    account = db.relationship("Accounts", back_populates="institution", cascade="all, delete")

class Accounts(db.Model):
    __tablename__ = "accounts"
    account_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.institution_id'))
    plaid_account_id = db.Column(db.String(255), nullable=False)

    iso_currency_code = db.Column(db.String(3), nullable=False)
    available_balance = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=True)
    current_balance = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=True)
    type = db.Column(db.String(45), nullable=False)
    limit = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=True)

    job = db.relationship("Jobs", back_populates="account", cascade="all, delete")
    institution = db.relationship("Institutions", back_populates="account", cascade="all, delete")

class Jobs(db.Model):
    __tablename__ = "jobs"
    job_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.account_id'), index=True)
    role = db.Column(db.String(45), nullable=False)
    entity = db.Column(db.String(45), nullable=False)
    default_hourly_rate = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=False)
    pay_frequency = db.Column(db.Integer, nullable=False)
    last_pay = db.Column(db.Date, nullable=False)
    last_pay_offset = db.Column(db.Integer, nullable=True)

    account = db.relationship("Accounts", back_populates="job", cascade="all, delete")
    payslip = db.relationship("Payslips", back_populates="job", cascade="all, delete")
    shift = db.relationship("Shifts", back_populates="job", cascade="all, delete")

class Payslips(db.Model):
    __tablename__ = "payslips"
    payslip_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), index=True)
    amount = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=False)
    start_period = db.Column(db.Date, nullable=False)
    end_period = db.Column(db.Date, nullable=False)
    hourly_rate = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=False)
    tax_code = db.Column(db.String(45))

    job = db.relationship("Jobs", back_populates="payslip", cascade="all, delete")
    shift = db.relationship("Shifts", back_populates="payslip", cascade="all, delete")

class Shifts(db.Model):
    __tablename__ = "shifts"
    shift_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), index=True)
    payslip_id = db.Column(db.Integer, db.ForeignKey('payslips.payslip_id'), index=True, nullable=True)
    date = db.Column(db.Date, nullable=False)
    start = db.Column(db.Time, nullable=False)
    finish = db.Column(db.Time, nullable=False)

    job = db.relationship("Jobs", back_populates="shift", cascade="all, delete")
    payslip = db.relationship("Payslips", back_populates="shift", cascade="all, delete")

    def return_json(self):
        return {
            "shift_id": self.shift_id,
            "job_id": self.job_id,
            "payslip_id": self.payslip_id,
            "date": self.date.strftime('%Y-%m-%d'),
            "start": self.start.strftime('%H:%M:%S'),  
            "finish": self.finish.strftime('%H:%M:%S') 
        }

class Pockets(db.Model):
    __tablename__ = "pockets"
    pocket_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), index=True)
    goal = db.Column(db.String(80), nullable=False)
    balance = db.Column(db.DECIMAL(15, 2), nullable=False)
    desired_balance = db.Column(db.DECIMAL(15, 2))
    percent_allocated = db.Column(db.DECIMAL(1, 2))
    status = db.Column(db.String(45))

    user = db.relationship("Users", back_populates="pocket", cascade="all, delete")

class Budgets(db.Model):
    __tablename__ = "budgets"
    budget_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), index=True)
    name = db.Column(db.String(45), nullable=False)
    percent_allocated = db.Column(db.DECIMAL(1, 2))

    user = db.relationship("Users", back_populates="budget", cascade="all, delete")
