import os
import json
import jwt
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from scripts.processer import read_payslip
from scripts.utils import *
from scripts.operations import *
from routes import *
from dotenv import load_dotenv
from passlib.hash import argon2
from flask import g
from scripts.models import db, User, Settings, Shift

from dotenv import load_dotenv

load_dotenv()

# Environment Variables
DB_USERNAME = os.environ.get('DB_USERNAME')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_HOST = os.environ.get('DB_HOST')
DB_NAME = os.environ.get('DB_NAME')

# Create a Flask app
app= Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}'
app.register_blueprint(routes)
db.init_app(app)
CORS(app)

#with app.app_context():
#    db.drop_all()
#    db.create_all()

# Test route to see if the code is working
@app.route("/", methods=["GET"])
def test():
    return {"Hi": "HI"}

# Route to return the most recent shifts for a user in the database 
@app.route("/api/recent_shifts", methods=["GET"])
@login_required
def recent_shifts():
    if "start_date"not in request.form:
        return jsonify({"error": "No start date provided"}), 400
    if "end_date"not in request.form:
        return jsonify({"error": "No end date provided"}), 400

# Route to upload a payslip image (NEEDS TO WORK FOR MULTIPLE PAYSLIPS NOT JUST ONE TYPE)
@app.route("/api/upload_payslip", methods=["POST"])
@login_required
def upload_payslip():
    user = g.user
    # Error Checking
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    if "pay" not in request.form:
        pay = user.settings.pay
    else:
        pay = float(request.form["pay"])

    # Image formatting
    image = format_image(request.files["image"])
    
    # Shift Formatting
    shift = read_payslip(image, pay)
    return jsonify(shift), 200


@app.route("/api/confirm_shift", methods=["POST"])
@login_required
def confirm_shift():
    # Error Checking
    if "shift" not in request.form:
        return jsonify({"error": "No shift provided"}, 400)
    
    # Formatting Data
    shift = json.loads(request.form["shift"])
    date = datetime.strptime(shift["date"], "%d/%m/%Y").date()
    start = shift["start"]
    finish = shift["finish"]
    rate = shift["rate"]
    new_shift = Shift(date=date, start=start, finish=finish, rate=rate)
    
    user = g.user
    user.shifts.append(new_shift)
    db.session.commit()
    
    return jsonify({"message": "Successfully updated database"}), 200

if __name__ == "__main__":
    app.run(debug=True, port=8000)