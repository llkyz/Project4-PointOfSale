from flask import request, Blueprint
import bcrypt
import os
from datetime import timedelta
from bson import ObjectId
import datetime
import jwt
from initialize import users, JWT_SECRET, JWT_ALGORITHM

userRoutes = Blueprint('user', __name__, template_folder='templates')

@userRoutes.get("/id")
def get_user_id():
    try:
        jwt_token = request.cookies.get("token")
        if not jwt_token:
            return ({'data': 'Token not found'}), 400
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
        return ({'data': payload['_id']}), 200
    except:
        return ({'data': 'An error occurred'}), 400

@userRoutes.get("profile")
def profile():
    jwt_token = request.cookies.get("token")
    payload = jwt.decode(jwt_token, os.getenv('JWT_SECRET'),algorithms=[os.getenv('JWT_ALGORITHM')])
    result = users.find_one({'_id': ObjectId(payload["_id"])},{'password': 0})
    result['_id'] = str(result['_id'])
    result['vendor'] = str(result['vendor'])
    return {'data': result}, 200

@userRoutes.get("/verify")
def verify():
    jwt_token = request.cookies.get("token")
    try:
        payload = jwt.decode(jwt_token, os.getenv('JWT_SECRET'),algorithms=[os.getenv('JWT_ALGORITHM')])
        result = users.find_one({'_id': ObjectId(payload["_id"])})
        if not result:
            return {'message': 'Token is invalid'}, 400    
        return {'accessLevel': result["accessLevel"]}, 200
    except (jwt.DecodeError, jwt.ExpiredSignatureError):
        return {'message': 'Token is invalid'}, 400

@userRoutes.post("/adminlogin")
def admin_vendor_login():
    data = request.get_json()
    result = users.find_one({'$or': [{'username': data['username'], 'accessLevel': 'admin'}, {'username': data['username'], 'accessLevel': 'vendor'} ]})
    if not result:
        # Username does not exist
        return {"data": "Invalid username/password"}, 400
    if not bcrypt.checkpw(data['password'].encode('utf-8'), result["password"]):
        # Password does not match
        return {"data": "Invalid username/password"}, 400
    else:
        payload = {'_id': str(result['_id']), 'exp': datetime.datetime.utcnow() + timedelta(days=90)}
        jwt_token = jwt.encode(payload, os.getenv('JWT_SECRET'), os.getenv('JWT_ALGORITHM'))
        return {'token': jwt_token, 'accessLevel': result["accessLevel"]}, 200

@userRoutes.post("/outletlogin")
def outlet_login():
    data = request.get_json()
    vendorResult = users.find_one({'username': data['vendor'], 'accessLevel': 'vendor'})
    result = users.find_one({'username': data['username'], 'vendor': vendorResult['_id'], 'accessLevel': 'outlet'})
    if not result:
        # Username does not exist
        return {"data": "Invalid username/password"}, 400
    if not bcrypt.checkpw(data['password'].encode('utf-8'), result["password"]):
        # Password does not match
        return {"data": "Invalid username/password"}, 400
    else:
        payload = {'_id': str(result['_id']), 'exp': datetime.datetime.utcnow() + timedelta(days=90)}
        jwt_token = jwt.encode(payload, os.getenv('JWT_SECRET'), os.getenv('JWT_ALGORITHM'))
        return {'token': jwt_token, 'accessLevel': "outlet"}, 200

@userRoutes.put("/<userid>")
def edit_user(userid):
    jwt_token = request.cookies.get("token")
    payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
    result = users.find_one({'_id': ObjectId(payload["_id"])})
    if not result:
        return ({"data": "Invalid Token"}), 400

    data = request.get_json()
    if not data['username']:
        del data['username']
    if not data['password']:
        del data['password']
    else:
        data['password'] = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    # Check for unauthorized access
    if str(result["_id"]) != userid:
        if result['accessLevel'] == "outlet":
            return ({"data": "Unauthorized access"}), 400
        elif result['accessLevel'] == "vendor":
            foundOutlet = users.find_one({'_id': ObjectId(userid), 'vendor': result['_id']})
            if not foundOutlet:
                return ({"data": "Unauthorized access"}), 400

    # Check for duplicate username
    if 'username' in data:
        userToEdit = users.find_one({'_id': ObjectId(userid)})
        if userToEdit['accessLevel'] == 'admin' or userToEdit['accessLevel'] == 'vendor':
            duplicateCheck = users.find_one({'$or': [{'username': data['username'], 'accessLevel': 'admin'}, {'username': data['username'], 'accessLevel': 'vendor'}]})
            if duplicateCheck and str(duplicateCheck['_id']) != userid:
                return ({"data": "Username already exists"}), 400
        elif userToEdit['accessLevel'] == 'outlet':
            duplicateCheck = users.find_one({'username': data['username'], 'vendor': userToEdit['vendor']})
            if duplicateCheck and str(duplicateCheck['_id']) != userid:
                return ({"data": "Username already exists"}), 400

    updated = users.find_one_and_update({'_id': ObjectId(userid)}, {'$set': data})
    if updated:
        return ({"data": "User updated successfully"}), 200
    else:
        return ({"data": "An error occurred"}), 400

@userRoutes.delete("/<userid>")
def delete_user(userid):
    jwt_token = request.cookies.get("token")
    payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
    result = users.find_one({'_id': ObjectId(payload["_id"])})
    if not result:
        return ({"data": "Invalid Token"}), 400
        
    # Check for unauthorized access
    if result['accessLevel'] == 'outlet':
        return ({"data": "Unauthorised Access"}), 400
    if result['accessLevel'] == 'vendor':
        outletCheck = users.find_one({'_id': ObjectId(userid), 'vendor': result['_id']})
        if not outletCheck:
            return ({"data": "Unauthorised Access"}), 400

    deletionTarget = users.find_one({'_id': ObjectId(userid)})
    if deletionTarget['accessLevel'] == 'vendor':
        # Check for any existing outlets under this vendor
        existingOutlets = users.find_one({'vendor': deletionTarget['_id']})
        if existingOutlets:
            return ({"data": "Delete all outlets under this vendor first"}), 400
    
    deleted = users.find_one_and_delete({'_id': ObjectId(userid)})
    if deleted:
        return ({"data": "User deleted successfully"}), 200
    else:
        return ({"data": "An error occurred"}), 400