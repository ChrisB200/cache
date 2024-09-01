from flask import Blueprint
from .auth import auth
from .work import work

routes = Blueprint("routes", __name__)

routes.register_blueprint(auth)
routes.register_blueprint(work)
