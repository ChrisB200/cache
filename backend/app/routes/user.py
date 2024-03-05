from flask import Blueprint, request, jsonify, g
from ..models import db, Shift
from ..auth import load_current_user

user_routes = Blueprint("user", __name__)

@user_routes.route("/api/user/data", methods=["GET"])
@load_current_user
def get_data():
    # Print out request details
    print("Request Method:", request.method)
    print("Request URL:", request.url)
    print("Request Headers:", request.headers)
    print("Request Data:", request.get_data(as_text=True))  # Get request data as text


    # Ensure the user is logged in before accessing their data
    user_data = {
        "name": g.current_user.username,
        "email": g.current_user.email
    }

    return jsonify(user_data)