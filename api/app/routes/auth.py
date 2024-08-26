from flask import Blueprint, request, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from datetime import datetime
from app.models import db, User

auth = Blueprint("auth", __name__)


@auth.route("/api/auth/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    login_user(user, remember=True)

    return jsonify({"message": "Successfully logged in user"}), 200


@auth.route("/api/auth/signup", methods=["POST"])
def signup():
    email = request.json.get("email")
    password = request.json.get("password")
    fg_user = request.json.get("fguser")
    fg_pass = request.json.get("fgpass")
    sd_user = request.json.get("sduser")
    sd_pass = request.json.get("sdpass")
    pointer = datetime(2024, 7, 8).date()

    user_exists = User.query.filter_by(email=email).first() is not None
    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    new_user = User(
        email=email,
        fg_user=fg_user,
        sd_user=sd_user,
        pointer=pointer,
    )
    new_user.set_password(password)
    new_user.set_fg_pass(fg_pass)
    new_user.set_sd_pass(sd_pass)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Successfully created user"})


@auth.route("/api/auth/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Successfully logged out user"}), 200


@auth.route("/api/auth/delete", methods=["DELETE"])
@login_required
def delete():
    id = current_user.id
    logout_user()
    User.query.filter_by(id=id).delete()
    db.session.commit()
    return jsonify({"message": "Successfully deleted user"}), 200


@auth.route("/api/auth/is_authenticated", methods=["GET"])
@login_required
def is_authenticated():
    return jsonify({"message": "You are authenticated"}), 200


@auth.route("/api/auth/is_user", methods=["POST"])
def is_user():
    email = request.json.get("email")

    existing = User.query.filter_by(email=email).first()

    if existing:
        return jsonify({"message": "User already exists"}), 409
    else:
        return jsonify({"message": "User does not exist"}), 200
