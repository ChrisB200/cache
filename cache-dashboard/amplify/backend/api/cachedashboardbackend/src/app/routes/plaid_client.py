import json, time, plaid

from flask import Flask, request, Blueprint, jsonify, g

from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.institutions_get_by_id_request import InstitutionsGetByIdRequest
from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import (
    ItemPublicTokenExchangeRequest,
)
from plaid.model.accounts_get_request import AccountsGetRequest


from ..models import db, User, Account
from ..auth import load_current_user
from ..plaid_config import client, products, PLAID_REDIRECT_URI, PLAID_COUNTRY_CODES

plaid_routes = Blueprint("plaid", __name__)


@plaid_routes.route("/api/plaid/create_link_token", methods=["POST"])
@load_current_user
def create_link_token():
    if not g.current_user:
        return jsonify({"error": "Unauthorised"}), 401
    try:
        request = LinkTokenCreateRequest(
            products=products,
            client_name="Cache",
            country_codes=[CountryCode(PLAID_COUNTRY_CODES)],
            language="en",
            user=LinkTokenCreateRequestUser(client_user_id=str(g.current_user.id)),
        )
        if PLAID_REDIRECT_URI != None:
            request["redirect_uri"] = PLAID_REDIRECT_URI
        # create link token
        response = client.link_token_create(request)
        return jsonify(response.to_dict())
    except plaid.ApiException as e:
        return json.loads(e.body)


@plaid_routes.route("/api/plaid/exchange_public_token", methods=["POST"])
@load_current_user
def exchange_public_token():
    if not g.current_user:
        return jsonify({"error": "Unauthorised"}), 401
    
    public_token = request.json["public_token"]

    new_request = ItemPublicTokenExchangeRequest(public_token=public_token)
    response = client.item_public_token_exchange(new_request)

    access_token = response["access_token"]
    item_id = response["item_id"]

    accounts = AccountsGetRequest(access_token=access_token)
    response = client.accounts_get(accounts)
    db_accounts = []

    insRequest = InstitutionsGetByIdRequest(
        institution_id=response["item"]["institution_id"],
        country_codes=[CountryCode("GB")]
        )
    insResponse = client.institutions_get_by_id(insRequest)

    for account in response["accounts"]:
        db_accounts.append(Account(
            user=g.current_user,
            name=account["name"],
            institution_name=insResponse["institution"]["name"],
            plaid_account_id=account["account_id"],
            plaid_institution_id=response["item"]["institution_id"],
            plaid_item_id=item_id,
            plaid_access_token=access_token,
            iso_currency_code=account["balances"]["iso_currency_code"],
            current_balance=account["balances"]["current"]
        ))
        print(account["type"])

    db.session.add_all(db_accounts)
    db.session.commit()

    return jsonify({"public_token_exchange": "complete"})

@plaid_routes.route("/api/plaid/get_accounts_test", methods=["GET"])
@load_current_user
def get_all():
    if not g.current_user:
        return jsonify({"error": "Unauthorised"}), 401
    
    user_accounts = Account.query.filter_by(user=g.current_user).all()

    responses = []
    for account in user_accounts:
        request = AccountsGetRequest(access_token=account.plaid_access_token)
        response = client.accounts_get(request)
        responses.append(response["accounts"])
    
    print(responses)
