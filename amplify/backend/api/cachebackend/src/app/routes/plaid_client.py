import json, time, plaid

from flask import Blueprint, jsonify

from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.country_code import CountryCode

from ..models import db, User, Settings
from ..plaid_config import client, products, PLAID_REDIRECT_URI, PLAID_COUNTRY_CODES

plaid_routes = Blueprint("plaid", __name__)

@plaid_routes.route('/api/plaid/create_link_token', methods=['POST'])
def create_link_token():
    try:
        request = LinkTokenCreateRequest(
            products=products,
            client_name="Plaid Quickstart",
            country_codes=[CountryCode(PLAID_COUNTRY_CODES)],
            language='en',
            user=LinkTokenCreateRequestUser(
                client_user_id=str(time.time())
            )
        )
        if PLAID_REDIRECT_URI!=None:
            request['redirect_uri']=PLAID_REDIRECT_URI
    # create link token
        response = client.link_token_create(request)
        return jsonify(response.to_dict())
    except plaid.ApiException as e:
        return json.loads(e.body)