# app/__init__.py
import os
from flask import Flask
from flask_cors import CORS
from app.routes import auth, shift
from app.models import db, User
from flask_login import LoginManager

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
app.register_blueprint(auth)
app.register_blueprint(shift)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route("/")
def index():
    # Access the URL map
    url_map = app.url_map

    # List all registered routes and their associated endpoints
    for rule in url_map.iter_rules():
        print(f"Endpoint: {rule.endpoint}, Methods: {', '.join(rule.methods)}, Path: {rule.rule}")