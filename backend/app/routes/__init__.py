from flask import Blueprint

routes = Blueprint("routes", __name__)

from .auth import auth_routes
from .shift import shift_routes
from .plaid_client import plaid_routes
from .accounts import account_routes

routes.register_blueprint(auth_routes)
routes.register_blueprint(shift_routes)
routes.register_blueprint(plaid_routes)
routes.register_blueprint(account_routes)