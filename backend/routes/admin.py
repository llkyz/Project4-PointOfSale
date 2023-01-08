from flask import request, Blueprint
import bcrypt
import middleware
from bson import ObjectId
from initialize import users

adminRoutes = Blueprint('admin', __name__, template_folder='templates')

@adminRoutes.get("/")
@middleware.admin_required
def get_admins_vendors():
    result = list(users.find({'$or': [{'accessLevel': 'admin'}, {'accessLevel': 'vendor'}]},{'password': 0, 'vendor': 0}))
    for x in result:
        x["_id"] = str(x["_id"])
    return {"data": result}, 200

@adminRoutes.get("/outletlist/<vendor>")
@middleware.admin_required
def get_outlet_list(vendor):
    result = list(users.find({'vendor': ObjectId(vendor)}, {'password': 0, 'accessLevel': 0, 'vendor': 0}))
    if not result: 
        return ({"data": "Vendor not found"}), 400
    for x in result:
        x['_id'] = str(x['_id'])
    return {"data": result}, 200

@adminRoutes.post("/")
@middleware.admin_required
def create_user():
    data = request.get_json()
    print(data)
    if 'vendor' in data:
        data['vendor'] = ObjectId(data['vendor'])
    
    data['password'] = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    if data['accessLevel'] == 'admin' or data['accessLevel'] == 'vendor':
        if users.find_one({'$or': [{'username': data['username'], 'accessLevel': 'admin'}, {'username': data['username'], 'accessLevel': 'vendor'}]}):
            return {"data": "Username already exists"}, 400
    elif data['accessLevel'] == 'outlet':
        if users.find_one({'username': data['username'], 'vendor': data['vendor']}):
            return {"data": "Outlet ID already exists for this vendor"}, 400
    users.insert_one(data)
    return {"data": "Created new user"}, 200

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
    result = list(users.find({"accessLevel": "vendor"},{"password": 0, "accessLevel": 0}))
    for x in result:
        x['_id'] = str(x['_id'])
    return {"data": result}, 200