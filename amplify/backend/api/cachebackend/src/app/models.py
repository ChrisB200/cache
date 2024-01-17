from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class Users(db.Model):
    __tablename__ = "users"
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))

    accounts = db.relationship("Accounts", back_populates="user", cascade="all, delete")

    def get_id(self):
        return str(self.user_id)

class Accounts(db.Model):
    __tablename__ = "accounts"
    account_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), index=True)
    plaid_item_id = db.Column(db.String(255), nullable=False)
    plaid_access_token = db.Column(db.String(255), nullable=False)
    iso_currency_code = db.Column(db.String(3), nullable=False)
    available_balance = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=True)
    current_balance = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=True)
    type = db.Column(db.String(45), nullable=False)
    limit = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=True)

    user = db.relationship("Users", back_populates="accounts", cascade="all, delete")
    jobs = db.relationship("Jobs", back_populates="account", cascade="all, delete")

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

    account = db.relationship("Accounts", back_populates="jobs", cascade="all, delete")
    payslips = db.relationship("Payslips", back_populates="job", cascade="all, delete")
    shifts = db.relationship("Shifts", back_populates="job", cascade="all, delete")

class Payslips(db.Model):
    __tablename__ = "payslips"
    payslip_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), index=True)
    amount = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=False)
    start_period = db.Column(db.Date, nullable=False)
    end_period = db.Column(db.Date, nullable=False)
    hourly_rate = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=False)
    tax_code = db.Column(db.String(45))

    job = db.relationship("Jobs", back_populates="payslips", cascade="all, delete")
    shifts = db.relationship("Shifts", back_populates="payslip", cascade="all, delete")

class Shifts(db.Model):
    __tablename__ = "shifts"
    shift_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), index=True)
    payslip_id = db.Column(db.Integer, db.ForeignKey('payslips.payslip_id'), index=True, nullable=True)
    date = db.Column(db.Date, nullable=False)
    start = db.Column(db.Time, nullable=False)
    finish = db.Column(db.Time, nullable=False)

    job = db.relationship("Jobs", back_populates="shifts", cascade="all, delete")
    payslip = db.relationship("Payslips", back_populates="shifts", cascade="all, delete")


# --------------------

# class User(db.Model, UserMixin):
#     user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     name = db.Column(db.String(80), nullable=False)
#     email = db.Column(db.String(255), unique=True, nullable=False)
#     password = db.Column(db.String(255))
#     settings_id = db.Column(db.Integer, db.ForeignKey('settings.settings_id'))
    
#     # Define the relationship to the Settings model
#     settings = db.relationship('Settings', back_populates='user', cascade='all, delete')
#     shifts = db.relationship('Shift', back_populates='user', cascade='all, delete')

#     # Implement the get_id method
#     def get_id(self):
#         return str(self.user_id)

# class Settings(db.Model):
#     settings_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     date_format = db.Column(db.String(25), nullable=True)
#     pay_frequency = db.Column(db.Integer, nullable=True)
#     pay = db.Column(db.Float, nullable=True)
    
#     # Define the relationship to the User model
#     user = db.relationship('User', back_populates='settings')

# class Shift(db.Model):
#     shift_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
#     date = db.Column(db.Date)
#     start = db.Column(db.Time)
#     finish = db.Column(db.Time)
#     rate = db.Column(db.Float)
    
#     # Define the relationship to the User model
#     user = db.relationship('User', back_populates='shifts')
