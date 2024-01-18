# app/__init__.py
import os
from flask import Flask
from flask_cors import CORS
from app.routes import routes
from app.models import db, Users, Payslips, Shifts, Jobs, Accounts, Institutions
from flask_login import LoginManager
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Environment Variables
DB_USERNAME = os.environ.get('DB_USERNAME')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_HOST = os.environ.get('DB_HOST')
DB_NAME = os.environ.get('DB_NAME')

# Create a Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Add this line to suppress a warning
db.init_app(app)
login_manager = LoginManager(app)
CORS(app)

# Register Blueprints
app.register_blueprint(routes)

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))

@app.route("/")
def index():
    from datetime import date, time

    # Sample Users
    user1 = Users(name='John Doe', email='john@example.com', password='password123')
    user2 = Users(name='Jane Smith', email='jane@example.com', password='securepass')

    # Sample Institutions
    institution1 = Institutions(user=user1, name='Bank A', plaid_item_id='item_1', plaid_access_token='token_1')
    institution2 = Institutions(user=user2, name='Bank B', plaid_item_id='item_2', plaid_access_token='token_2')

    # Sample Accounts
    account1 = Accounts(institution=institution1, plaid_account_id='acc_1', iso_currency_code='USD', available_balance=1000.00, current_balance=1200.00, type='Checking', limit=None)
    account2 = Accounts(institution=institution2, plaid_account_id='acc_2', iso_currency_code='EUR', available_balance=800.00, current_balance=800.00, type='Savings', limit=None)

    # Sample Jobs
    job1 = Jobs(account=account1, role='Software Developer', entity='Company A', default_hourly_rate=30.00, pay_frequency=2, last_pay=date(2023, 1, 1), last_pay_offset=None)
    job2 = Jobs(account=account2, role='Marketing Manager', entity='Company B', default_hourly_rate=35.00, pay_frequency=1, last_pay=date(2023, 2, 15), last_pay_offset=None)

    # Sample Payslips
    payslip1 = Payslips(job=job1, amount=1200.00, start_period=date(2023, 1, 1), end_period=date(2023, 1, 15), hourly_rate=30.00, tax_code='S1')
    payslip2 = Payslips(job=job2, amount=1400.00, start_period=date(2023, 2, 1), end_period=date(2023, 2, 15), hourly_rate=35.00, tax_code='S2')

    # Sample Shifts
    shift1 = Shifts(job=job1, payslip=payslip1, date=date(2023, 1, 10), start=time(9, 0), finish=time(17, 0))
    shift2 = Shifts(job=job2, payslip=payslip2, date=date(2023, 2, 5), start=time(10, 0), finish=time(18, 0))

    # Commit the sample data to the database
    db.session.add_all([user1, user2, institution1, institution2, account1, account2, job1, job2, payslip1])