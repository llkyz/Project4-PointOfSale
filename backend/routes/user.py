from flask import request, Blueprint
from pymongo import MongoClient
import bcrypt
import os
from dotenv import load_dotenv
from datetime import timedelta
import datetime
import jwt
import middleware

load_dotenv()
client = MongoClient(os.getenv('DATABASE'))
db = client.flask_db
users = db.users

userRoutes = Blueprint('user', __name__, template_folder='templates')

@userRoutes.put("/editself")
def edit_self():
    jwt_token = request.cookies.get("token")
    payload = jwt.decode(jwt_token, os.getenv('JWT_SECRET'),algorithms=[os.getenv('JWT_ALGORITHM')])
    result = users.find_one({'username': payload["username"]})
    if not result:
        return ({"data": "Invalid Token"}), 400
    
    data = request.get_json()
    oldPassword = data["oldPassword"]
    newPassword = data["newPassword"]
    if not bcrypt.checkpw(oldPassword.encode('utf-8'), result["password"]):
        # Password does not match
        return {"data": "Invalid username/password"}, 400

    hashed = bcrypt.hashpw(newPassword.encode('utf-8'), bcrypt.gensalt())
    result = users.find_one_and_update({"username": result["username"]}, {"$set": {"password": hashed}})
    if result:
        return ({"data": "User updated successfully"}), 200
    else:
        return ({"data": "An error occurred"}), 400

@userRoutes.post("/adminlogin")
def admin_vendor_login():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    result = users.find_one({'$or': [{'username': username, 'accessLevel': 'admin'}, {'username': username, 'accessLevel': 'vendor'} ]})
    if not result:
        # Username does not exist
        return {"data": "Invalid username/password"}, 400
    if not bcrypt.checkpw(password.encode('utf-8'), result["password"]):
        # Password does not match
        return {"data": "Invalid username/password"}, 400
    else:
        payload = {'username': username, 'exp': datetime.datetime.utcnow() + timedelta(days=90)}
        jwt_token = jwt.encode(payload, os.getenv('JWT_SECRET'), os.getenv('JWT_ALGORITHM'))
        return {'token': jwt_token, 'accessLevel': result["accessLevel"]}, 200

@userRoutes.post("/outletlogin")
def outlet_login():
    data = request.get_json()
    vendor = data["vendor"]
    username = data["username"]
    password = data["password"]
    result = users.find_one({'username': username, 'vendor': vendor, 'accessLevel': 'outlet'})
    if not result:
        # Username does not exist
        return {"data": "Invalid username/password"}, 400
    if not bcrypt.checkpw(password.encode('utf-8'), result["password"]):
        # Password does not match
        return {"data": "Invalid username/password"}, 400
    else:
        payload = {'username': username, 'exp': datetime.datetime.utcnow() + timedelta(days=90)}
        jwt_token = jwt.encode(payload, os.getenv('JWT_SECRET'), os.getenv('JWT_ALGORITHM'))
        return {'token': jwt_token, 'accessLevel': "outlet"}, 200

@userRoutes.get("/verify")
def verify():
    jwt_token = request.cookies.get("token")
    try:
        payload = jwt.decode(jwt_token, os.getenv('JWT_SECRET'),algorithms=[os.getenv('JWT_ALGORITHM')])
        result = users.find_one({'username': payload["username"]})
        if not result:
            return {'message': 'Token is invalid'}, 400    
        return {'accessLevel': result["accessLevel"]}, 200
    except (jwt.DecodeError, jwt.ExpiredSignatureError):
        return {'message': 'Token is invalid'}, 400