from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, User, Shift, Payslip
from sqlalchemy import desc
from datetime import timedelta, datetime

work = Blueprint("work", __name__)


@work.route("/api/work/all_shifts", methods=["GET"])
@login_required
def all_shifts():
    return jsonify([shift.to_json() for shift in current_user.shifts])


@work.route("/api/work/all_payslips", methods=["GET"])
@login_required
def all_payslips():
    return jsonify([payslip.to_json() for payslip in current_user.payslips])


@work.route("/api/work/payslips_by_month", methods=["GET"])
@login_required
def payslips_by_month():
    month = request.args.get("month")
    year = request.args.get("year")

    start_date = datetime(year, month, 1)
    end_date = start_date + timedelta(month=1)
    payslips = db.session.query(Payslip).filter(Payslip.date.between(start_date, end_date)).all()

    return jsonify([payslip.to_json() for payslip in payslips])


@work.route("/api/work/shifts_by_month", methods=["GET"])
@login_required
def shifts_by_month():
    month = request.args.get("month")
    year = request.args.get("year")

    start_date = datetime(int(year), int(month), 1)
    end_date = start_date + timedelta(weeks=4)
    shifts = db.session.query(Shift).filter(Shift.date.between(start_date, end_date)).all()

    return jsonify([shift.to_json() for shift in shifts])


@work.route("/api/work/shifts_by_payslip", methods=["GET"])
@login_required
def shifts_by_payslip():
    payslip_id = request.args.get("payslip_id")
    payslip = Payslip.query.filter_by(user_id=current_user.id, id=payslip_id).first()

    if payslip:
        return jsonify([shift.to_json() if shift.type == "Timecard" else None for shift in payslip.shifts])
    else:
        return jsonify("Can't find the payslip"), 404


@work.route("/api/work/forecasted_payslip", methods=["GET"])
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

    print([shift.to_json() for shift in combined])

    return jsonify(payslip)
