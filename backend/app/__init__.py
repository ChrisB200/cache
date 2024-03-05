# app/__init__.py
import time
from datetime import datetime
from flask import Flask, request, jsonify, session, g
from flask_cors import CORS
from flask_session import Session
from flask_bcrypt import Bcrypt
from app.config import ApplicationConfig
from app.routes import routes
from app.models import db, User, Payslip, Shift, Job, Account, Pocket, Budget
from app.auth import load_current_user

# Create a Flask app
app = Flask(__name__)
app.config.from_object(ApplicationConfig)
CORS(app, supports_credentials=True)

# Initialisation
bcrypt = Bcrypt(app)
server_session = Session(app)
db.init_app(app)

# Register Blueprints
app.register_blueprint(routes)

# Recreates databases with these models
#with app.app_context():
#    db.drop_all()
#    db.create_all()

# Authentication routes

@app.route("/@me")
@load_current_user
def get_current_user():
    if not g.current_user:
        return jsonify({"error": "Unauthorised"}), 401

    return jsonify({
        "id": g.current_user.id,
        "name": g.current_user.username,
        "email": g.current_user.email
    })

@app.route("/api/auth/register", methods=["POST"])
def register():
    # Get data
    username = request.json["username"]
    email = request.json["email"]
    password = request.json["password"]

    # Check if user exists
    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409
    
    # Hash password, and commit a new user
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Successfully created a new user"}), 200


@app.route("/api/auth/login", methods=["POST"])
def login():
    # Get data
    email = request.json["email"]
    password = request.json["password"]

    # Find user
    user = User.query.filter_by(email=email).first()

    # If user is not found
    if user is None:
        return jsonify({"error": "Unauthorised"}), 401
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorised"}), 401
    
    # Creates a session using the id of the user
    session["user_id"] = user.id

    return jsonify({"message": "Successfully logged in"})

@app.route("/api/auth/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return jsonify({"message: Successfully logged out user"}), 200

@app.route("/api/auth/remove_user", methods=["DELETE"])
@load_current_user
def remove_user():
    if not g.current_user:
        return jsonify({"error": "Unauthorised"}), 401
    
    db.session.delete(g.current_user)
    db.session.commit()

    return jsonify({"message": "Successfully deleted all user details"}), 200

""" @app.route("/")
def index():
    user1 = User(name="Christopher", email="cbonner.dev@outlook.com", password=bcrypt.generate_password_hash("test"))
    institution1 = Institution(user=user1, name="Barclays", plaid_item_id="test_item_id", plaid_access_token="test_access_token")
    account1 = Account(institution=institution1, plaid_account_id="test_account_id", iso_currency_code="GBR", available_balance=500, current_balance=900, type="banking", limit=200)
    account2 = Account(institution=institution1, plaid_account_id="test_account_id2", iso_currency_code="GBR", available_balance=500, current_balance=900, type="saving", limit=200)
    institution2 = Institution(user=user1, name="Santander", plaid_item_id="test_item_id", plaid_access_token="test_access_token")
    account3 = Account(institution=institution2, plaid_account_id="test_account_id3", iso_currency_code="GBR", available_balance=500, current_balance=900, type="banking", limit=200)
    job1 = Job(account=account1, role="Software", entity="Five Guys", default_hourly_rate=500, pay_frequency=2, last_pay=datetime(2020, 8, 9).date(), last_pay_offset=2)
    shift1 = Shift(job=job1, date=datetime(2023, 8, 18).date(), start=time.time(), finish=time.time())
    shift2 = Shift(job=job1, date=datetime(2023, 8, 17).date(), start=time.time(), finish=time.time())
    shift3 = Shift(job=job1, date=datetime(2023, 8, 19).date(), start=time.time(), finish=time.time())
    pocket = Pocket(user=user1, goal="Tenerife Holiday", balance=200.10, desired_balance=220.10, percent_allocated=0.4, status="Not completed")
    budget = Budget(user=user1, name="Shopping", percent_allocated=0.4)

    # Commit all data in one go
    db.session.add_all([user1, institution1, institution2, account1, account2, account3, job1, shift1, shift2, shift3, pocket, budget])
    db.session.commit()

    # Close the session when done
    db.session.close()

    return "Successfully Created Test data"
 """