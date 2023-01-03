from functools import wraps
from flask import request
from pymongo import MongoClient
import os
import jwt
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv('DATABASE'))
db = client.flask_db
users = db.users

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        jwt_token = request.cookies.get("token")
        try:
            payload = jwt.decode(jwt_token, os.getenv('JWT_SECRET'),algorithms=[os.getenv('JWT_ALGORITHM')])
            result = users.find_one({'username': payload["username"]})
            if not result:
                return {'message': 'Token is invalid'}, 400   
            if result["accessLevel"] != "admin":
                return {'message': 'Insufficient access Level'}, 400   
        except (jwt.DecodeError, jwt.ExpiredSignatureError):
            return {'message': 'Token is invalid'}, 400
        return f(*args, **kwargs)
    return decorated_function

def vendor_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        jwt_token = request.cookies.get("token")
        try:
            payload = jwt.decode(jwt_token, os.getenv('JWT_SECRET'),algorithms=[os.getenv('JWT_ALGORITHM')])
            result = users.find_one({'username': payload["username"]})
            if not result:
                return {'message': 'Token is invalid'}, 400   
            if result["accessLevel"] != "admin" and result["accessLevel"] != "vendor":
                return {'message': 'Insufficient access Level'}, 400   
        except (jwt.DecodeError, jwt.ExpiredSignatureError):
            return {'message': 'Token is invalid'}, 400
        return f(*args, **kwargs)
    return decorated_function

def outlet_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        jwt_token = request.cookies.get("token")
        try:
            payload = jwt.decode(jwt_token, os.getenv('JWT_SECRET'),algorithms=[os.getenv('JWT_ALGORITHM')])
            result = users.find_one({'username': payload["username"]})
            if not result:
                return {'message': 'Token is invalid'}, 400
        except (jwt.DecodeError, jwt.ExpiredSignatureError):
            return {'message': 'Token is invalid'}, 400
        return f(*args, **kwargs)
    return decorated_function