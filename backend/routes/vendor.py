from flask import request, Blueprint
import bcrypt
import jwt
import middleware
from bson import ObjectId
from initialize import users, menus, JWT_SECRET, JWT_ALGORITHM, bucket
import os
import uuid
import datetime

vendorRoutes = Blueprint('vendor', __name__, template_folder='templates')

def upload_file(blob_name, file):
    try:
        blob = bucket.blob(blob_name)
        blob.upload_from_file(file)
        return True
    except Exception as e:
        print(e)
        return False

def delete_file(blob_name):
    try:
        blob = bucket.blob(blob_name)
        blob.delete()
        return True
    except Exception as e:
        print(e)
        return False

def get_file_url(blob_name):
    try:
        blob = bucket.blob(blob_name)
        serving_url = blob.generate_signed_url(version="v4",
        expiration=datetime.timedelta(minutes=30),
        method="GET")
        return serving_url
    except Exception as e:
        return False

# ==================================
# Outlet Routes
# ==================================

@vendorRoutes.get("/outlet")
@middleware.vendor_required
def get_outlet_list():
    token = request.headers.get('Authorization').split()[1]
    payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)

    outletResult = list(users.find({'vendor': ObjectId(payload['_id'])}, {'password': 0, 'accessLevel': 0, 'vendor': 0}))
    for x in outletResult:
        x['_id'] = str(x['_id'])
    return {"data": outletResult}, 200

@vendorRoutes.post("/outlet")
@middleware.vendor_required
def new_outlet():
    token = request.headers.get('Authorization').split()[1]
    payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)
    result = users.find_one({'_id': ObjectId(payload['_id'])})
    
    if result["accessLevel"] != "vendor":
        return {"data": "This user is not a vendor"}, 400

    data = request.get_json()
    if users.find_one({'username': data['username'], 'vendor': ObjectId(payload['_id'])}):
        return {"data": "Username already exists"}, 400
    data['password'] = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    users.insert_one({'username': data['username'], 'password': data['password'], 'accessLevel': "outlet", 'vendor': ObjectId(payload['_id'])})
    return {"data": "New outlet created successfully"}, 200

@vendorRoutes.put("/outlet/<userid>")
@middleware.vendor_required
def edit_outlet(userid):
    token = request.headers.get('Authorization').split()[1]
    payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)
    result = users.find_one({'_id': ObjectId(payload["_id"])})

    data = request.get_json()
    if data['username']:
        duplicateCheck = users.find_one({'username': data['username'], 'vendor': ObjectId(payload['_id'])})
        if str(duplicateCheck['_id']) != userid:
            return ({'data': 'This outlet ID already exists'}), 200
    else:
        del data['username']

    if data['password']:
        data['password'] = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    else:
        del data['password']

    result = users.find_one_and_update({'_id': ObjectId(userid)}, {"$set": {data}})
    if result:
        return ({'data': 'Outlet updated successfully'}), 200
    else:
        return ({'data': 'An error occurred'}), 400

@vendorRoutes.delete("/outlet/<userid>")
@middleware.vendor_required
def delete_outlet(userid):
    token = request.headers.get('Authorization').split()[1]
    payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)

    deleteTarget = users.find_one_and_delete({'_id': ObjectId(userid), 'vendor': ObjectId(payload["_id"])})
    if deleteTarget:
        return ({'data': 'Outlet deleted successfully'}), 200
    else:
        return ({'data': 'Outlet does not exist'}), 400

# ==================================
# Menu Routes
# ==================================
@vendorRoutes.get('/menu')
@middleware.vendor_required
def get_menu():
    token = request.headers.get('Authorization').split()[1]
    payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)

    result = menus.find_one({'vendor': ObjectId(payload['_id'])})
    if result:
        result['_id'] = str(result['_id'])
        result['vendor'] = str(result['vendor'])
        if result['logo']:
            result['logoUrl'] = get_file_url(result['logo'])
        else:
            result['logoUrl'] = get_file_url('placeholder.jpg')

        for x in result['categories']:
            for y in x['entries']:
                if y['image']:
                    y['imageUrl'] = get_file_url(y['image'])
                else:
                    y['imageUrl'] = get_file_url('placeholder.jpg')

        return ({'data': result}), 200
    else:
        return ({'data': 'No menu found'}), 400

@vendorRoutes.post('/menu')
@middleware.vendor_required
def create_menu():
    try:
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)
        menus.insert_one({'title': '', 'logo': '', 'tax': 0, 'service': 0, 'vendor': ObjectId(payload['_id']), 'categories': []})
        result = menus.find_one({'vendor': ObjectId(payload['_id'])})
        result['_id'] = str(result['_id'])
        result['vendor'] = str(result['vendor'])
        result['logoUrl'] = get_file_url('placeholder.jpg')
        return ({'data': result}), 200
    except Exception as e:
        print(e)
        return ({'data': 'An error occurred'}), 400

@vendorRoutes.put('/menu')
@middleware.vendor_required
def update_menu():
    try:
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)
        data = request.get_json()
        data['tax'] = float(data['tax'])
        data['service'] = float(data['service'])

        for x in data['categories']:
            for y in x['entries']:
                if 'imageUrl' in y:
                    del y['imageUrl']

        result = menus.find_one_and_update({'vendor': ObjectId(payload['_id'])}, {'$set': data})
        if result:
            return ({'data': 'Menu upated successfully'}), 200
        else:
            return ({'data': 'An error occurred'}), 400
    except:
        return ({'data': 'An error occurred'}), 400

@vendorRoutes.delete('/menu')
@middleware.vendor_required
def delete_menu():
    try:
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)

        result = menus.find_one_and_delete({'vendor': ObjectId(payload['_id'])})
        if result:
            return ({'data': 'Menu deleted successfully'}), 200
        else:
            return ({'data': 'An error occurred'}), 400
    except:
        return ({'data': 'An error occurred'}), 400

# ==================================
# Menu Logo Routes
# ==================================

@vendorRoutes.post('/menu/logo')
@middleware.vendor_required
def upload_logo():
    try:
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)

        result = menus.find_one({'vendor': ObjectId(payload['_id'])})
        if result['logo']:
            delete_file(result['logo'])

        if 'file' in request.files:
            split = os.path.splitext(request.files['file'].filename)
            fileId = f'logo_{uuid.uuid4().hex}{split[1]}'
            if not upload_file(fileId, request.files['file']):
                return ({'data': 'Unable to upload file'}), 400

            result = menus.find_one_and_update({'vendor': ObjectId(payload['_id'])}, {'$set': {'logo': fileId}})
            if result:
                return ({'data': 'Logo successfully updated'}), 200
            else:
                return ({'data': 'An error occurred'}), 400
        else:
            return ({'data': 'File not found'}), 400
    except Exception as e:
        return ({'data': e}), 400

@vendorRoutes.delete('/menu/logo')
@middleware.vendor_required
def delete_logo():
    try:
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)

        result = menus.find_one({'vendor': ObjectId(payload['_id'])})
        if result['logo']:
            delete_file(result['logo'])
        result = menus.find_one_and_update({'vendor': ObjectId(payload['_id'])}, {'$set': {'logo': ""}})
        if result:
            return ({'data': 'Logo successfully deleted'}), 200
        else:
            return ({'data': 'An error occurred'}), 400
    except Exception as e:
        return ({'data': e}), 400

# ==================================
# Menu Entry Image Routes
# ==================================

@vendorRoutes.post('/menu/entry/image/')
@middleware.vendor_required
def upload_entry_image():
    try:
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)

        categoryIndex = int(request.form['categoryIndex'])
        entryIndex = int(request.form['entryIndex'])

        getMenu = menus.find_one({'vendor': ObjectId(payload['_id'])})
        if not getMenu:
            return ({'data': 'An error occurred'}), 400
        if getMenu['categories'][categoryIndex]['entries'][entryIndex]['image']:
            delete_file(getMenu['categories'][categoryIndex]['entries'][entryIndex]['image'])

        if 'file' in request.files:
            split = os.path.splitext(request.files['file'].filename)
            fileId = f'{uuid.uuid4().hex}{split[1]}'
            if not upload_file(fileId, request.files['file']):
                return ({'data': 'Unable to upload file'}), 400
            getMenu['categories'][categoryIndex]['entries'][entryIndex]['image'] = fileId

            result = menus.find_one_and_update({'vendor': ObjectId(payload['_id'])}, {'$set': getMenu})
            if result:
                return ({'data': 'Image successfully updated'}), 200
            else:
                return ({'data': 'An error occurred'}), 400
        else:
            return ({'data': 'File not found'}), 400
    except Exception as e:
        return ({'data': e}), 400

@vendorRoutes.delete('/menu/entry/image')
@middleware.vendor_required
def delete_image():
    try:
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)

        data = request.get_json()
        categoryIndex = data['categoryIndex']
        entryIndex = data['entryIndex']
        result = menus.find_one({'vendor': ObjectId(payload['_id'])})
        categories = result['categories']
        if categories[categoryIndex]['entries'][entryIndex]['image']:
            delete_file(categories[categoryIndex]['entries'][entryIndex]['image'])

        if result:
            return ({'data': 'Category successfully updated'}), 200
        else:
            return ({'data': 'An error occurred'}), 400
    except Exception as e:
        return ({'data': e}), 400