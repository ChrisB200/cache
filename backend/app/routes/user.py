from flask import Blueprint, request, jsonify
from ..models import db, Shift

user_routes = Blueprint("user", __name__)

""" @user_routes.route("/api/user/data", methods=["GET"])
@login_required
def get_data():
    # Print out request details
    print("Request Method:", request.method)
    print("Request URL:", request.url)
    print("Request Headers:", request.headers)
    print("Request Data:", request.get_data(as_text=True))  # Get request data as text


    # Ensure the user is logged in before accessing their data
    user_data = {
        "name": current_user.name,
        "email": current_user.email
    }

    return jsonify(user_data) """