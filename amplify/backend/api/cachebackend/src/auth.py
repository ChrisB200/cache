# src/auth.py
from functools import wraps
from flask import request, jsonify, g
import jwt
from app import app, db  # Import your Flask app and database instance
from scripts.models import User

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            data = jwt.decode(token.split(" ")[1], app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = data['user_id']
            g.user = db.session.get(User, user_id)
            g.token = token  # pass the token to the route
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401

        return f(*args, **kwargs)

    return decorated
