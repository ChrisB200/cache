import json
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..models import db, Shifts
from ..scripts.utils import format_image
from ..scripts.processer import read_payslip

#CHRIS EVERYTHING I ADD ILL MARK WITH A ":3" SO YOU CAN CHANGE IT EASIER IF IT DOESNT WORK
shift_routes = Blueprint("shift", __name__)

# Route to return the most recent shifts for a user in the database 
@shift_routes.route("/api/shift/get_shifts", methods=["GET"])
@login_required
def get_shifts():
    start_date_str = request.args.get("start_date") #:3
    end_date_str = request.args.get("end_date")# :3

    #do a selection if, figure out how to define all shifts as they are added by user, if shifts are between date we get them
    #updates as shifts are added
    #start_date = datetime.fromisoformat(start_date_str)#:3
    #end_date = datetime.fromisoformat(end_date_str)#:3

    start_date = datetime.strptime(start_date_str, '%Y-%m-%d') # Converts string to datetime in the format YY--MM--DD
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d') # Converts string to datetime in the format YY--MM--DD

    
    #shifts_in_date = db.query_shifts_between_dates(start_date, end_date)#:3 also i dont know if any of this works. but you can see what my monkey brain is cooking

    # Ok so ill explain how this works
    # Basically db.session is the database. It is how you perform functions
    # .query(Shifts) is saying that you want to do a query on the database where the table is the Shifts table
    # .filter(Shifts.date.between(start_date, end_date)) Is getting shifts between the start and end date
    # .all is getting all the shifts that meet the filter criteria
    shifts = db.session.query(Shifts).filter(Shifts.date.between(start_date, end_date)).all()

    # Then for all the shifts that we have we have to convert it into JSON format as this is what websites understand.
    # In the Shifts class in the models.py file there is a function return_json()
    # When we call this it returns all of the json data
    # So this just goes through all the shifts we found and adds its json data to the shift_data list
    shift_data = []
    for shift in shifts:
        shift_data.append(shift.return_json())

    # Then just return shift data
    return jsonify(shift_data)



# Route to upload a payslip image (NEEDS TO WORK FOR MULTIPLE PAYSLIPS NOT JUST ONE TYPE)
@shift_routes.route("/api/shift/image_recognition", methods=["POST"])
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


@shift_routes.route("/api/shift/confirm", methods=["POST"])
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
    new_shift = Shifts(date=date, start=start, finish=finish, rate=rate)
    
    current_user.shifts.append(new_shift)
    db.session.commit()
    
    return jsonify({"message": "Successfully updated database"}), 200