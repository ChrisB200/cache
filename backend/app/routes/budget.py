from flask import Blueprint, request, jsonify
from ..models import db, Shift

budget_routes = Blueprint("budgets", __name__)

@budget_routes.route("/api/budget/get_budgets", methods=["GET"])

def get_accounts():
    pass
