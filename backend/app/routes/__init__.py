from flask import Blueprint

from .auth import auth_routes
from .shift import shift_routes
from .plaid_client import plaid_routes
from .accounts import account_routes
from .budget import budget_routes
from .pockets import pocket_routes

routes = Blueprint("routes", __name__)

routes.register_blueprint(auth_routes)
routes.register_blueprint(shift_routes)
routes.register_blueprint(plaid_routes)
routes.register_blueprint(account_routes)
routes.register_blueprint(budget_routes)
routes.register_blueprint(pocket_routes)
