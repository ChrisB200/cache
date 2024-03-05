from flask import Blueprint, request, jsonify, g
import plaid
from plaid.model.institutions_get_by_id_request import InstitutionsGetByIdRequest
from ..models import db, Shift, Account
from ..auth import load_current_user
from ..plaid_config import client, PLAID_COUNTRY_CODES
from plaid.model.country_code import CountryCode

account_routes = Blueprint("accounts", __name__)

@account_routes.route("/api/accounts/get_accounts", methods=["GET"])
@load_current_user
def get_accounts():
    if not g.current_user:
        return jsonify({"error": "Unauthorised"}), 401
    
    accounts = Account.query.filter_by(user=g.current_user).all()

    accountData = []
    for account in accounts:
        accountData.append(account.return_json())

    print(accountData)

    return jsonify(accountData), 200


@account_routes.route("/api/accounts/get_institutions", methods=["GET"])
@load_current_user
def get_institutions():
    if not g.current_user:
        return jsonify({"error": "Unauthorised"}), 401
    
    # Query to get all distinct institutions for the specific user
    distinct_institutions = Account.query.filter_by(user=g.current_user).with_entities(Account.plaid_institution_id).distinct().all()

    # Extract the distinct institution IDs from the query result
    institution_ids = [result[0] for result in distinct_institutions]
    institutions_data = []

    for institution_id in institution_ids:
        request = InstitutionsGetByIdRequest(
            institution_id=institution_id,
            country_codes=[CountryCode("GB")]
        )
        response = client.institutions_get_by_id(request)

        print(response)

        institutions_data.append({
            "name": response["institution"]["name"],
            "id": response["institution"]["institution_id"]
        })

    return jsonify(institutions_data), 200
