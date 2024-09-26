from flask import Blueprint, request, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from datetime import datetime
from app.models import db, User

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User does not exist"}), 401

    if not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    login_user(user, remember=True)

    return jsonify({"success": True}), 201


@auth.route("/signup", methods=["POST"])
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
        return jsonify({"error", "User already exists"}), 409

    new_user = User(
        email=email,
        fg_user=fg_user,
        sd_user=sd_user,
        pointer=pointer,
    )
    new_user.set_password(password)
    new_user.set_fg_pass(fg_pass)
    new_user.set_sd_pass(sd_pass)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"success": True, "user_id": new_user.id}), 201
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


@auth.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"success": True}), 200


@auth.route("/delete", methods=["DELETE"])
@login_required
def delete():
    id = current_user.id
    logout_user()

    try:
        User.query.filter_by(id=id).delete()
        db.session.commit()
        return jsonify({"success": True}), 200
    except Exception:
        return jsonify({"error": "Internal server error"}), 500


@auth.route("/is_authenticated", methods=["GET"])
@login_required
def is_authenticated():
    return jsonify({"success": True}), 200


@auth.route("/is_user", methods=["POST"])
def is_user():
    email = request.json.get("email")
    existing = User.query.filter_by(email=email).first()

    if existing:
        return jsonify({"error": "User already exists"}), 401

    return jsonify({"success": True}), 200
