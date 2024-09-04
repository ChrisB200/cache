from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, User, Shift, Payslip
from sqlalchemy import desc
from datetime import timedelta

work = Blueprint("work", __name__)


@work.route("/api/work/all_shifts", methods=["GET"])
@login_required
def all_shifts():
    return jsonify([shift.to_json() for shift in current_user.shifts])


@work.route("/api/work/all_payslips", methods=["GET"])
@login_required
def all_payslips():
    return jsonify([payslip.to_json() for payslip in current_user.payslips])


@work.route("/api/work/get_payslip", methods=["GET"])
@login_required
def get_payslip():
    month = request.args.get("month")
    year = request.args.get("year")
    print(month, year)


@work.route("/api/work/payslip_shifts", methods=["GET"])
@login_required
def payslip_shifts():
    payslip_id = request.args.get("payslip_id")
    payslip = Payslip.query.filter_by(user=current_user, id=payslip_id)

    if payslip:
        shifts = Shift.query.filter_by(payslip=payslip).all()
        return jsonify([shift.to_json() for shift in shifts])
    else:
        return jsonify("Can't find the payslip"), 404


@work.route("/api/work/recent_payslip", methods=["GET"])
@login_required
def recent_payslip():
    recent_payslip = Payslip.query.order_by(desc(Payslip.date)).first()
    start_date = recent_payslip.date - timedelta(days=2)
    end_date = start_date + timedelta(weeks=2)

    shifts = db.session.query(Shift).filter(Shift.date.between(start_date, end_date)).all()

    return jsonify([shift.to_json() for shift in shifts])
