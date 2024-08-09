from flask import Blueprint
from .auth import auth

routes = Blueprint("routes", __name__)

routes.register_blueprint(auth)
