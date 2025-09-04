from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import binascii
from psycopg2.extensions import cursor
from ..config.env import ENCRYPTION_KEY
from ..utils.exceptions import RowNotFoundError


def decrypt(encrypted: str) -> str:
    iv_hex, ct_hex = encrypted.split(":")
    iv = binascii.unhexlify(iv_hex)
    ct = binascii.unhexlify(ct_hex)
    key = binascii.unhexlify(ENCRYPTION_KEY)

    cipher = AES.new(key, AES.MODE_CBC, iv=iv)
    pt = unpad(cipher.decrypt(ct), 16)
    return pt.decode("utf-8")


def decrypt_credentials(credentials: dict) -> dict:
    enc_username = credentials.get("username")
    enc_password = credentials.get("password")

    if not enc_username:
        raise ValueError("username not present in credentials")
    if not enc_password:
        raise ValueError("password not present in credentials")

    username = decrypt(enc_username)
    password = decrypt(enc_password)

    new_credentials = credentials.copy()

    new_credentials["username"] = username
    new_credentials["password"] = password

    return new_credentials


def get_credentials(cur: cursor, user_id: str, service: str):
    cur.execute("""
        SELECT *
        FROM public.credentials
        WHERE user_id = %s and service = %s
    """, (user_id, service))

    row = cur.fetchone()

    if not row:
        raise RowNotFoundError(f"Could not get credentials for user {user_id}")

    return decrypt_credentials(row)
