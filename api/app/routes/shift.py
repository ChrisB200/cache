
from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, User, Shift

shift = Blueprint("shift", __name__)


@shift.route("/api/shift/login", methods=["POST"])
def placeholder():
    pass
