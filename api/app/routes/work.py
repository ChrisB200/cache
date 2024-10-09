from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Shift, Payslip
from sqlalchemy import desc
from datetime import timedelta, datetime

work = Blueprint("work", __name__)


def time_difference(time1, time2):
    dummy_date = datetime(1900, 1, 1)
    dt1 = datetime.combine(dummy_date, time1)
    dt2 = datetime.combine(dummy_date, time2)
    time_diff = dt2 - dt1
    hours = time_diff.total_seconds() / 3600
    return hours


@work.route("/shifts", methods=["GET"])
@login_required
def all_shifts():
    return jsonify([shift.to_json() for shift in current_user.shifts])


@work.route("/payslips", methods=["GET"])
@login_required
def all_payslips():
    return jsonify([payslip.to_json() for payslip in current_user.payslips])


@work.route("/payslips/month/<int:month>/<int:year>", methods=["GET"])
@login_required
def payslips_by_month(month, year):
    if month < 1 or month > 12:
        return jsonify("Invalid Month"), 422

    start_date = datetime(year, month, 1)
    end_date = start_date + timedelta(month=1)
    payslips = db.session.query(Payslip).filter(Payslip.date.between(start_date, end_date)).all()

    return jsonify([payslip.to_json() for payslip in payslips])


@work.route("/payslips/<int:payslip_id>/shifts", methods=["GET"])
@login_required
def shifts_by_payslip(payslip_id):
    payslip = Payslip.query.filter_by(user_id=current_user.id, id=payslip_id).first()

    if payslip:
        return jsonify([shift.to_json() if shift.type == "Timecard" else None for shift in payslip.shifts])
    else:
        return jsonify("Can't find the payslip"), 404


@work.route("/payslips/forecast", methods=["GET"])
@login_required
def forecasted_payslip():
    recent_payslip = Payslip.query.order_by(desc(Payslip.date)).first()
    start_date = recent_payslip.date - timedelta(days=2)
    end_date = start_date + timedelta(weeks=2)

    shifts = db.session.query(Shift).filter(Shift.date.between(start_date, end_date)).all()

    payslip = {
        "date": end_date + timedelta(days=2),
        "hours": 0,
        "rate": recent_payslip.rate,
        "shifts": []
    }

    timecard = [shift for shift in shifts if shift.type == "Timecard"]
    schedule = [shift for shift in shifts if shift.type == "Schedule"]
    combined = timecard.copy()

    for shift in schedule:
        if shift.date not in [tshift.date for tshift in timecard]:
            combined.append(shift)

    payslip["hours"] = sum([shift.hours for shift in combined])
    payslip["shifts"] = [shift.to_json() for shift in combined]

    return jsonify(payslip)

@work.route("/shifts/<int:shift_id>", methods=["PUT"])
@login_required
def edit_shift(shift_id):
    start_str = request.json.get("start")
    end_str = request.json.get("end")

    start = datetime.strptime(start_str, "%H:%M").time()
    end = datetime.strptime(end_str, "%H:%M").time()

    if start > end:
        return jsonify({"error": "Start time is after end time"}), 422

    shift = Shift.query.filter_by(id=shift_id).one()

    if shift is None:
        return jsonify({"error": "Cannot find shift with that ID"}), 410

    shift.start = start
    shift.end = end
    shift.hours = time_difference(start, end)
    shift.has_scraped = 0

    db.session.add(shift)
    db.session.commit()

    return jsonify({"message": "Successfully updated shift"}), 200
