from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..models import db, Shifts

account_routes = Blueprint("accounts", __name__)

@account_routes.route("/api/accounts/get_accounts", methods=["GET"])
@login_required
def get_accounts():
    pass