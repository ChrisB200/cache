from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class Users(db.Model, UserMixin):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))
    settings_id = db.Column(db.Integer)

    # Implement the get_id method
    def get_id(self):
        return str(self.user_id)

class Accounts(db.Model):
    account_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), index=True)
    plaid_item_id = db.Column(db.String(255), nullable=False)
    plaid_access_token = db.Column(db.String(255), nullable=False)
    iso_currency_code = db.Column(db.String(3), nullable=False)
    available_balance = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=True)
    current_balance = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=True)
    type = db.Column(db.String(45), nullable=False)
    limit = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=True)

class Jobs(db.Model):
    job_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    account_id = db.Column(db.Integer, db.ForeignKey('account.account_id'), index=True)
    role = db.Column(db.String(45), nullable=False)
    entity = db.Column(db.String(45), nullable=False)
    default_hourly_rate = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=False)
    pay_frequency = db.Column(db.Integer, nullable=False)
    last_pay = db.Column(db.Date, nullable=False)
    last_pay_offset = db.Column(db.Integer, nullable=True)

class Payslips(db.Model):
    payslip_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(db.Integer, db.ForeignKey('job.job_id'), index=True)
    amount = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=False)
    start_period = db.Column(db.Date, nullable=False)
    end_period = db.Column(db.Date, nullable=False)
    hourly_rate = db.Column(db.DECIMAL(15, 2, asdecimal=False), nullable=False)
    tax_code = db.Column(db.String(45))

class Shifts(db.Model):
    shift_id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('job.job_id'), index=True)
    payslip_id = db.Column(db.Integer, db.ForeignKey('payslip.payslip_id'), index=True, nullable=True)
    date = db.Column(db.Date, nullable=False)
    start = db.Column(db.Time, nullable=False)
    finish = db.Column(db.Time, nullable=False)

# --------------------

class User(db.Model, UserMixin):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255))
    settings_id = db.Column(db.Integer, db.ForeignKey('settings.settings_id'))
    
    # Define the relationship to the Settings model
    settings = db.relationship('Settings', back_populates='user', cascade='all, delete')
    shifts = db.relationship('Shift', back_populates='user', cascade='all, delete')

    # Implement the get_id method
    def get_id(self):
        return str(self.user_id)

class Settings(db.Model):
    settings_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date_format = db.Column(db.String(25), nullable=True)
    pay_frequency = db.Column(db.Integer, nullable=True)
    pay = db.Column(db.Float, nullable=True)
    
    # Define the relationship to the User model
    user = db.relationship('User', back_populates='settings')

class Shift(db.Model):
    shift_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    date = db.Column(db.Date)
    start = db.Column(db.Time)
    finish = db.Column(db.Time)
    rate = db.Column(db.Float)
    
    # Define the relationship to the User model
    user = db.relationship('User', back_populates='shifts')
