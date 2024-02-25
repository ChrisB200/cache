from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..models import db, Shifts

budget_routes = Blueprint("budgets", __name__)

@budget_routes.route("/api/budget/get_budgets", methods=["GET"])
@login_required
def get_accounts():
    pass
