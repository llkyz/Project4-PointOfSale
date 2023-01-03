from flask import Flask, request, Blueprint
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

@userRoutes.post("/register")
def register_user():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    print(username)
    print(password)
    print(hashed)
    users.insert_one({'username': username, 'password': hashed, 'accessLevel': "outlet"})
    return {"data": "Created new User"}, 200

@userRoutes.post("/login")
def login():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    result = users.find_one({'username': username})
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

@userRoutes.get("/verify")
@middleware.outlet_required
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