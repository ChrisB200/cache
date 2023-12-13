import traceback
from scripts.utils import *
from scripts.operations import *
from passlib.hash import argon2

def database_operation(func):
    def wrapper(*args, **kwargs):
        connection, cursor = db_connection(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME)
        try:
            data = func(connection, cursor, *args, **kwargs)
            connection.commit()
        except Exception as e:
            connection.rollback()
            data["message"] = traceback.format_exc()
        finally:
            connection.close()
            return data
    return wrapper

@database_operation
def add_shift(connection, cursor, shift, user_id):
    query = f"INSERT INTO tblPayslip (user_id, date, start, finish, rate) VALUES (%s, %s, %s, %s, %s)"
    # NEED TO MAKE DATE MATCH USING MATCHING FUNCTION
    date = datetime.strptime(shift.get("date"), "%d/%m/%Y").date()
    # --------------------------------------------
    values = (user_id, date, shift.get("start"), shift.get("finish"), shift.get("rate"))
    cursor.execute(query, values)
    return {"message": "Successfully added shift to database"}

@database_operation
def add_user(connection, cursor, email: str, password: str):
    if get_user(email=email)["user"] != None:
        return {"message": "User already exists"}
    else:
        try:
            # Step 1: Inserts a blank config record
            cursor.execute("INSERT INTO tblConfig (date_format, pay_frequency) VALUES (DEFAULT, DEFAULT)")

            # Step 2: Insert a new user record with the associated config_id
            config_id = cursor.lastrowid
            query = "INSERT INTO tblUser (email, password_hash, config_id) VALUES (%s, %s, %s)"
            values = (email, password, config_id)
            cursor.execute(query, values)
        except Exception as e:
            connection.rollback()
            return {"message": traceback.format_exc()}
        return {"message": "Successfully added new user to database"}

@database_operation
def validate_user(connection, cursor, email: str, provided_password: str):
    data = get_user(email)
    user = data["user"]

    if user:
        hashed_password = user['password_hash']
        if argon2.verify(provided_password, hashed_password):
            return {"message": "Successfully validated user", "user": user}
        else:
            return {"message": "Invalid user credentials", "user": user}

    return data

@database_operation
def get_user(connection, cursor, email: str):
    cursor = connection.cursor(dictionary=True)
    query = f"SELECT * FROM tblUser WHERE email = %s"
    cursor.execute(query, (email,))
    
    user = cursor.fetchone()
    if user:
        return {"message": "Successfully found user", "user": user}
    else:
        return {"message": "User not found", "user": None}