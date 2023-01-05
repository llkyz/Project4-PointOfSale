from functools import wraps
from flask import request
import os
import jwt
from initialize import users, JWT_ALGORITHM, JWT_SECRET

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        jwt_token = request.cookies.get("token")
        try:
            payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
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