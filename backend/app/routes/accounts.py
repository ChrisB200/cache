from flask import Blueprint, request, jsonify, g
import plaid
from plaid.model.institutions_get_by_id_request import InstitutionsGetByIdRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from ..models import db, Shift, Account, BalanceHistories, Transactions
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

    account_data = []
    for account in accounts:
        # Get the most recent balance entry for the account
        recent_balance = (
            BalanceHistories.query.filter_by(account_id=account.id)
            .order_by(BalanceHistories.date.desc(), BalanceHistories.time.desc())
            .first()
        )
        
        # Construct dictionary containing account name and most recent balance data
        if recent_balance:
            balance_data = {
                "current_balance": float(recent_balance.current_balance),
                "date": recent_balance.date.strftime("%Y-%m-%d"),
                "time": recent_balance.time.strftime("%H:%M:%S")
            }
        else:
            balance_data = None
        
        account_data.append({
            "name": account.name,
            "id": account.id,
            "plaid_institution_id": account.plaid_institution_id,
            "most_recent_balance": balance_data
        })

    return jsonify(account_data), 200



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

@account_routes.route("/api/accounts/sync_transactions", methods=["POST"])
@load_current_user
def sync_transactions():
    if not g.current_user:
        return jsonify({"error": "Unauthorised"}), 401
    
    print(request.json)
    account_ids = request.json["data"]

    for account_id in account_ids:
        account = Account.query.get(account_id)

        cursor = "" if account.transactions_cursor == None else account.transactions_cursor
        # New transaction updates since "cursor"
        added = []
        modified = []
        removed = [] # Removed transaction ids
        has_more = True

        # Iterate through each page of new transaction updates for item
        while has_more:
            plaidRequest = TransactionsSyncRequest(
                access_token=account.plaid_access_token,
                cursor=cursor,
            )
            response = client.transactions_sync(plaidRequest)

            for transaction in response["added"]:
                added.append(Transactions(
                    account=account,
                    date=transaction["date"],
                    name=transaction["name"],
                    amount=transaction["amount"]
                ))

            #modified.extend(response['modified'])
            #removed.extend(response['removed'])
            has_more = response['has_more']

            # Update cursor to the next cursor

            cursor = response['next_cursor']

        db.session.add_all(added)
        db.session.commit()

    return "success"
