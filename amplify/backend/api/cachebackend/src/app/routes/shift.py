import json
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from ..models import db, Shift
from ..scripts.utils import format_image
from ..scripts.processer import read_payslip

shift = Blueprint("shift", __name__)

# Route to return the most recent shifts for a user in the database 
@shift.route("/api/shift/get_shifts", methods=["GET"])
@login_required
def get_shifts():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

# Route to upload a payslip image (NEEDS TO WORK FOR MULTIPLE PAYSLIPS NOT JUST ONE TYPE)
@shift.route("/api/shift/image_recognition", methods=["POST"])
@login_required
def image_recognition():
    # Error Checking
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    if "pay" not in request.form:
        pay = current_user.settings.pay
    else:
        pay = float(request.form["pay"])

    # Image formatting
    image = format_image(request.files["image"])
    
    # Shift Formatting
    shift = read_payslip(image, pay)
    return jsonify(shift), 200


@shift.route("/api/shift/confirm", methods=["POST"])
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
    
    current_user.shifts.append(new_shift)
    db.session.commit()
    
    return jsonify({"message": "Successfully updated database"}), 200