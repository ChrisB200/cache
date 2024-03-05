from flask import Blueprint, request, jsonify
from ..models import db, Shift

pocket_routes = Blueprint("pockets", __name__)

@pocket_routes.route("/api/pockets/get_pockets", methods=["GET"])
def get_accounts():
    pass
