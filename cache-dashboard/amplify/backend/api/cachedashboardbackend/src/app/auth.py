from flask import session, g, jsonify, request
from functools import wraps
from app.models import User

# Put this on any route that needs the current user to be loaded
def load_current_user(route_function):
    @wraps(route_function)
    def wrapper(*args, **kwargs):
        user_id = session.get("user_id")
        g.current_user = None
        
        if user_id:
            g.current_user = User.query.get(user_id)
        
        return route_function(*args, **kwargs)
    return wrapper