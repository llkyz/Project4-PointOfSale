from flask import request, Blueprint
import bcrypt
import middleware
import json
from initialize import users

adminRoutes = Blueprint('admin', __name__, template_folder='templates')

@adminRoutes.get("/")
@middleware.admin_required
def get_admins_vendors():
    result = list(users.find({'$or': [{'accessLevel': 'admin'}, {'accessLevel': 'vendor'}]},{"password": 0}))
    print(result)
    return {"data": json.dumps(result)}, 200

@adminRoutes.post("/")
@middleware.admin_required
def create_user():
    try:
        data = request.get_json()
        username = data["username"]
        password = data["password"]
        accessLevel = data["accessLevel"]
        print("test1")
        try:
            vendor = data["vendor"]
        except:
            vendor = ""
        print("test2")
        print(vendor)
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        if accessLevel == 'admin' or accessLevel == 'vendor':
            if users.find_one({'$or': [{'username': username, 'accessLevel': 'admin'}, {'username': username, 'accessLevel': 'vendor'}]}):
                return {"data": "Username already exists"}, 400
        elif accessLevel == 'outlet':
            if users.find_one({'username': username, 'vendor': vendor}):
                return {"data": "Outlet ID already exists for this vendor"}, 400
        users.insert_one({'username': username, 'password': hashed, 'accessLevel': accessLevel, 'vendor': vendor})
        return {"data": "Created new user"}, 200
    except:
        return {"data": "An error occurered"}, 400

@adminRoutes.put("/")
@middleware.admin_required
def edit_user():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    accessLevel = data["acessLevel"]
    result = users.find_one_and_update({"username": username}, {"$set": {"password": password, "accessLevel": accessLevel}})
    if result:
        return ({"data": "User updated successfully"}), 200
    else:
        return ({"data": "An error occurred"}), 400

@adminRoutes.delete("/")
@middleware.admin_required
def delete_user():
    data = request.get_json()
    username = data["username"]
    result = users.find_one_and_delete({"username": username})
    if result:
        return ({"data": "User updated successfully"}), 200
    else:
        return ({"data": "An error occurred"}), 400

@adminRoutes.get("/vendorlist")
@middleware.admin_required
def get_vendor_list():
    result = list(users.find({"accessLevel": "vendor"},{"_id": 0, "password": 0, "accessLevel": 0}))
    return {"data": result}, 200