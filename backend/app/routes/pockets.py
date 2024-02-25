from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..models import db, Shifts

pocket_routes = Blueprint("pockets", __name__)

@account_routes.route("/api/pockets/get_pockets", methods=["GET"])
@login_required
def get_accounts():
    pass
