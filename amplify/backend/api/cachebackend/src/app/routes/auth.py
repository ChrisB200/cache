# app/routes/auth.py
import jwt
from datetime import datetime, timedelta
from passlib.hash import argon2
from flask import request, jsonify, Blueprint, current_app
from flask_login import login_user, logout_user, login_required, current_user

from ..models import db, User, Settings

auth = Blueprint('auth', __name__)

@auth.route("/api/auth/register", methods=["POST"])
def register():
    if "name" not in request.form:
        return jsonify({"error": "No name provided"}), 400
    if "email" not in request.form:
        return jsonify({"error": "No email provided"}), 400
    if "password" not in request.form:
        return jsonify({"error": "No password provided"}), 400
    
    name = request.form["name"]
    email = request.form["email"]
    raw_password = request.form["password"]
    hashed_password = argon2.using(salt_size=16).hash(raw_password)
    
    new_user = User(name=name, password=hashed_password, email=email)
    new_settings = Settings()  # Assuming Settings is a model in your models.py
    new_user.settings = new_settings
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Successfully created a new user"}), 200

@auth.route("/api/auth/login", methods=["POST"])
def login(): 
    if "email" not in request.form:
        return jsonify({"error": "No email provided"}), 400
    else:
        email = request.form["email"]
        
    if "password" not in request.form:
        return jsonify({"error": "No password provided"}), 400
    else:
        password = request.form["password"]
    
    user = User.query.filter_by(email=email).first()
    
    if user:
        if argon2.verify(password, user.password):
            login_user(user)
            token = jwt.encode({"user_id": user.user_id, 'exp': datetime.utcnow() + timedelta(hours=1)}, current_app.config["SECRET_KEY"], algorithm="HS256")
            return jsonify({'token': token})
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
    
@auth.route("/api/auth/remove", methods=["DELETE"])
@login_required
def remove_user():
    if "password" not in request.form:
        return jsonify({"error": "No password provided"}), 400
    else:
        password = request.form["password"]
    
    if argon2.verify(password, current_user.password):
        db.session.delete(current_user)
        db.session.commit()
        logout_user()  # Log out the user after deleting the account
        return jsonify({"message": "User removed successfully"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401
