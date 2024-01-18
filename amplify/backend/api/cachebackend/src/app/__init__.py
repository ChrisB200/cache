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

with app.app_context():
    db.drop_all()
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))

@app.route("/")
def index():
    from datetime import date, time

    # Add test data
    user1 = Users(name='John Doe', email='john@example.com', password='password123')
    institution1 = Institutions(user=user1, name='University', plaid_item_id='item123', plaid_access_token='token123')
    account1 = Accounts(institution=institution1, plaid_account_id='acc123', iso_currency_code='USD',
                        available_balance=1000.00, current_balance=1500.00, type='checking', limit=5000.00)
    job1 = Jobs(account=account1, role='Developer', entity='Tech Inc.', default_hourly_rate=25.00, pay_frequency=2,
            last_pay=datetime.now(), last_pay_offset=15)
    payslip1 = Payslips(job=job1, amount=500.00, start_period=datetime(2023, 1, 1), end_period=datetime(2023, 1, 15),
                    hourly_rate=25.00, tax_code='A123')
    shift1 = Shifts(job=job1, payslip=payslip1, date=datetime(2023, 1, 5),
                    start=datetime.strptime('08:00', '%H:%M'), finish=datetime.strptime('16:00', '%H:%M'))

    # Add more test data as needed

    # Commit all data in one go
    db.session.add_all([user1, institution1, account1, job1, payslip1, shift1])
    db.session.commit()

    # Close the session when done
    db.session.close()
