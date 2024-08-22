from flask import Blueprint
from .auth import auth
from .shift import shift

routes = Blueprint("routes", __name__)

routes.register_blueprint(auth)
routes.register_blueprint(shift)
