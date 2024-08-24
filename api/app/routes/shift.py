
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, User, Shift

shift = Blueprint("shift", __name__)


@shift.route("/api/shift/all", methods=["POST"])
@login_required
def placeholder():
    if not current_user:
        return jsonify({"error": "No user logged in"}), 401
    
    return jsonify([payslip.to_json() for payslip in current_user.payslips])
