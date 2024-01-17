# app/__init__.py
import os
from flask import Flask
from flask_cors import CORS
from app.routes import routes
from app.models import db, Users, Payslips, Shifts, Jobs, Accounts
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
    # Create test data
    user1 = Users(name="John Doe", email="john@example.com", password="password123")
    user2 = Users(name="Jane Doe", email="jane@example.com", password="password456")

    account1 = Accounts(
        plaid_item_id="plaid_item_1",
        plaid_access_token="access_token_1",
        iso_currency_code="USD",
        available_balance=1000.00,
        current_balance=1500.00,
        type="Checking",
        limit=2000.00,
        user=user1,
    )

    account2 = Accounts(
        plaid_item_id="plaid_item_2",
        plaid_access_token="access_token_2",
        iso_currency_code="EUR",
        available_balance=800.00,
        current_balance=1000.00,
        type="Savings",
        limit=1200.00,
        user=user2,
    )

    job1 = Jobs(
        role="Developer",
        entity="XYZ Corp",
        default_hourly_rate=25.00,
        pay_frequency=2,
        last_pay=datetime(2023, 1, 1),
        last_pay_offset=0,
        account=account1,
    )

    job2 = Jobs(
        role="Designer",
        entity="ABC Inc",
        default_hourly_rate=30.00,
        pay_frequency=1,
        last_pay=datetime(2023, 1, 15),
        last_pay_offset=1,
        account=account2,
    )

    payslip1 = Payslips(
        amount=500.00,
        start_period=datetime(2023, 1, 1),
        end_period=datetime(2023, 1, 15),
        hourly_rate=25.00,
        tax_code="Single",
        job=job1,
    )

    payslip2 = Payslips(
        amount=600.00,
        start_period=datetime(2023, 1, 16),
        end_period=datetime(2023, 1, 31),
        hourly_rate=30.00,
        tax_code="Married",
        job=job2,
    )

    shift1 = Shifts(
        date=datetime(2023, 1, 5),
        start=datetime.strptime("08:00", "%H:%M").time(),
        finish=datetime.strptime("16:00", "%H:%M").time(),
        job=job1,
        payslip=payslip1,
    )

    shift2 = Shifts(
        date=datetime(2023, 1, 20),
        start=datetime.strptime("10:00", "%H:%M").time(),
        finish=datetime.strptime("18:00", "%H:%M").time(),
        job=job2,
        payslip=payslip2,
    )

    # Add data to the database
    db.session.add_all([user1, user2, account1, account2, job1, job2, payslip1, payslip2, shift1, shift2])
    db.session.commit()

