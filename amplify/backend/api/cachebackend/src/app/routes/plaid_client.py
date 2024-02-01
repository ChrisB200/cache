import json, time, plaid

from flask import Flask, request, Blueprint, jsonify
from flask_login import current_user, login_required 

from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest


from ..models import db, Users
from ..plaid_config import client, products, PLAID_REDIRECT_URI, PLAID_COUNTRY_CODES

plaid_routes = Blueprint("plaid", __name__)

@plaid_routes.route('/api/plaid/create_link_token', methods=['POST'])
def create_link_token():
    try:
        request = LinkTokenCreateRequest(
            products=products,
            client_name="Cache",
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
    
@plaid_routes.route('/api/plaid/exchange_public_token', methods=['POST'])
def exchange_public_token():
    public_token = request.form['public_token']

    new_request = ItemPublicTokenExchangeRequest(public_token=public_token)
    response = client.item_public_token_exchange(new_request)

    # These values should be saved to a persistent database and

    # associated with the currently signed-in user

    access_token = response['access_token']
    item_id = response['item_id']

    return jsonify({'public_token_exchange': 'complete'})