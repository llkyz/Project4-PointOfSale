from flask import request, Blueprint
import bcrypt
import os
from dotenv import load_dotenv
import jwt
import middleware
from initialize import users, JWT_SECRET, JWT_ALGORITHM

vendorRoutes = Blueprint('vendor', __name__, template_folder='templates')

@vendorRoutes.get("/index/<vendor>")
@middleware.vendor_required
def get_outlet_list(vendor):
    jwt_token = request.cookies.get("token")
    payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
    result = users.find_one({'username': payload["username"]})

    if result["accessLevel"] == "vendor" and result["username"] != vendor:
        return {"data": "Vendor ID does not match"}, 400
    outletResult = list(users.find({'vendor': vendor}, {'_id': 0, 'password': 0}))
    print(outletResult)
    return {"data": outletResult}, 200

@vendorRoutes.post("/newoutlet")
@middleware.vendor_required
def new_outlet():
    jwt_token = request.cookies.get("token")
    payload = jwt.decode(jwt_token, os.getenv('JWT_SECRET'),algorithms=[os.getenv('JWT_ALGORITHM')])
    result = users.find_one({'username': payload["username"]})        

    data = request.get_json()
    username = data["username"]
    password = data["password"]
    vendor = data["vendor"]
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    if result["accessLevel"] == "vendor" and result["username"] != vendor:
        return {"data": "Vendor ID does not match"}, 400
    if users.find_one({'username': username}):
        return {"data": "Username already exists"}, 400
    users.insert_one({'username': username, 'password': hashed, 'accessLevel': "outlet", 'vendor': vendor})
    return {"data": "Created new Vendor"}, 200

@vendorRoutes.put("/editoutlet")
@middleware.vendor_required
def edit_outlet():
    jwt_token = request.cookies.get("token")
    payload = jwt.decode(jwt_token, os.getenv('JWT_SECRET'),algorithms=[os.getenv('JWT_ALGORITHM')])
    result = users.find_one({'username': payload["username"]})

    data = request.get_json()
    username = data["username"]
    password = data["password"]

    result = users.find_one_and_update({"username": username}, {"$set": {"password": password}})
    if result:
        return ({"data": "User updated successfully"}), 200
    else:
        return ({"data": "An error occurred"}), 400