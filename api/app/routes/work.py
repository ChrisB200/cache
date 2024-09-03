from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, User, Shift

work = Blueprint("work", __name__)


@work.route("/api/work/shifts", methods=["GET"])
@login_required
def shifts():
    return jsonify([shift.to_json() for shift in current_user.shifts])


@work.route("/api/work/all_payslips", methods=["GET"])
@login_required
def payslips():
    return jsonify([payslip.to_json() for payslip in current_user.payslips])

@work.route("/api/work/get_payslip", methods=["GET"])
def get_payslip():
    month = request.args.get("month")
    year = request.args.get("year")
