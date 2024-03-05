from flask import Blueprint, request, jsonify
from ..models import db, Shift

account_routes = Blueprint("accounts", __name__)

@account_routes.route("/api/accounts/get_accounts", methods=["GET"])
def get_accounts():
    pass