from flask import Blueprint

from .auth import auth_routes
from .shift import shift_routes
from .plaid_client import plaid_routes