# app/__init__.py
import os, time
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

# with app.app_context():
#     db.drop_all()
#     db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))

@app.route("/")
def index():
    user1 = Users(name="Christopher", email="cbonner.dev@outlook.com", password="test")
    institution1 = Institutions(user=user1, name="Barclays", plaid_item_id="test_item_id", plaid_access_token="test_access_token")
    account1 = Accounts(institution=institution1, plaid_account_id="test_account_id", iso_currency_code="GBR", available_balance=500, current_balance=900, type="banking", limit=200)
    job1 = Jobs(account=account1, role="Software", entity="Five Guys", default_hourly_rate=500, pay_frequency=2, last_pay=datetime(2020, 8, 9).date(), last_pay_offset=2)
    shift1 = Shifts(job=job1, date=datetime(2020, 9, 18).date(), start=time.time(), finish=time.time())
    payslip1 = Payslips(job=job1, amount=15, start_period=datetime(2020, 9, 18).date(), end_period=datetime(2020, 9, 18).date(), hourly_rate=15, tax_code="Fanum")

    shift1.payslip = payslip1

    # Commit all data in one go
    db.session.add_all([user1, institution1, account1, job1, payslip1, shift1])
    db.session.commit()

    # Close the session when done
    db.session.close()

    return 
