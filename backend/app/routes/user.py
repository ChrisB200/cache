from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..models import db, Shifts

user_routes = Blueprint("user", __name__)

@user_routes.route("/api/user/data", methods=["GET"])
@login_required
def get_data():
    return jsonify(current_user.name, current_user.email)
