from flask import request, Blueprint
import bcrypt
import jwt
import middleware
from bson import ObjectId
from initialize import users, menus, categories, entries, JWT_SECRET, JWT_ALGORITHM, bucket
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
    jwt_token = request.cookies.get("token")
    payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

    outletResult = list(users.find({'vendor': ObjectId(payload['_id'])}, {'password': 0, 'accessLevel': 0, 'vendor': 0}))
    for x in outletResult:
        x['_id'] = str(x['_id'])
    return {"data": outletResult}, 200

@vendorRoutes.post("/outlet")
@middleware.vendor_required
def new_outlet():
    jwt_token = request.cookies.get("token")
    payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
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
    jwt_token = request.cookies.get("token")
    payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
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
    jwt_token = request.cookies.get("token")
    payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

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
    jwt_token = request.cookies.get("token")
    payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

    result = menus.aggregate([
        {
            '$match': {'vendor': ObjectId(payload['_id'])}
        },
        {
            '$lookup': {
                'from': 'categories',
                'localField': 'vendor',
                'foreignField': 'vendor',
                'as': 'categories',
                'pipeline': [
                    {
                        '$lookup': {
                            'from': 'entries',
                            'localField': '_id',
                            'foreignField': 'category',
                            'as': 'entries'
                        }
                    }
                ]
            }
        }
    ])
    result = list(result)[0]
    if result:
        result['_id'] = str(result['_id'])
        result['vendor'] = str(result['vendor'])
        if result['logo']:
            result['logo'] = get_file_url(result['logo'])
        else:
            result['logo'] = get_file_url('placeholder.jpg')
        for x in result['categories']:
            x['_id'] = str(x['_id'])
            x['vendor'] = str(x['vendor'])
            for y in x['entries']:
                y['_id'] = str(y['_id'])
                y['category'] = str(y['category'])
                y['vendor'] = str(y['vendor'])
                if y['image']:
                    y['image'] = get_file_url(y['image'])
                else:
                    y['image'] = get_file_url('placeholder.jpg')
        return ({'data': result}), 200
    else:
        return ({'data': 'No menu found'}), 400

@vendorRoutes.post('/menu')
@middleware.vendor_required
def create_menu():
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
        result = menus.insert_one({'title': '', 'logo': '', 'tax': 0, 'service': 0, 'vendor': ObjectId(payload['_id'])})
        result['_id'] = str(result['_id'])
        result['vendor'] = str(result['vendor'])
        return ({'data': result}), 200
    except:
        return ({'data': 'An error occurred'}), 400

@vendorRoutes.put('/menu')
@middleware.vendor_required
def update_menu():
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
        data = request.get_json()
        data['tax'] = float(data['tax'])
        data['service'] = float(data['service'])
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
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

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
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

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
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

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
# Menu Category Routes
# ==================================

@vendorRoutes.post('/menu/category')
@middleware.vendor_required
def create_category():
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
        data = request.get_json()

        result = categories.insert_one({'name': data['name'], 'order': data['order'], 'vendor': ObjectId(payload['_id'])})
        if result:
            return ({'data': 'Category successfully created'}), 200
        else:
            return ({'data': 'An error occurred'}), 400
    except Exception as e:
        return ({'data': e}), 400

@vendorRoutes.put('/menu/category/<categoryid>')
@middleware.vendor_required
def edit_category(categoryid):
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
        data = request.get_json()

        result = categories.find_one_and_update({'_id': ObjectId(categoryid), 'vendor': ObjectId(payload['_id'])},{'$set': data})
        if result:
            return ({'data': 'Category successfully updated'}), 200
        else:
            return ({'data': 'An error occurred'}), 400
    except Exception as e:
        return ({'data': e}), 400

@vendorRoutes.delete('/menu/category/<categoryid>')
@middleware.vendor_required
def delete_category(categoryid):
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

        result = entries.find_one({'category': ObjectId(categoryid)})
        if result:
            return ({'data': 'Delete all entries in this category first'}), 400
        result = categories.find_one_and_delete({'_id': ObjectId(categoryid), 'vendor': ObjectId(payload['_id'])})
        if result:
            return ({'data': 'Category successfully updated'}), 200
        else:
            return ({'data': 'An error occurred'}), 400
    except Exception as e:
        return ({'data': e}), 400

# ==================================
# Menu Entry Routes
# ==================================

@vendorRoutes.post('/menu/entry')
@middleware.vendor_required
def create_entry():
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
        data = request.get_json()

        result = entries.insert_one({'name': data['name'], 'price': data['price'], 'description': data['description'], 'order': data['order'], 'image': "", 'category': ObjectId(data['category']), 'vendor': ObjectId(payload['_id'])})
        if result:
            return ({'data': 'Entry successfully created'}), 200
        else:
            return ({'data': 'An error occurred'}), 400
    except Exception as e:
        return ({'data': e}), 400

@vendorRoutes.put('/menu/entry/<entryid>')
@middleware.vendor_required
def edit_entry(entryid):
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
        data = request.get_json()

        result = entries.find_one_and_update({'_id': ObjectId(entryid), 'vendor': ObjectId(payload['_id'])},{'$set': data})
        if result:
            return ({'data': 'Entry successfully updated'}), 200
        else:
            return ({'data': 'An error occurred'}), 400
    except Exception as e:
        return ({'data': e}), 400

@vendorRoutes.delete('/menu/entry/<entryid>')
@middleware.vendor_required
def delete_entry(entryid):
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

        result = entries.find_one({'_id': ObjectId(entryid), 'vendor': ObjectId(payload['_id'])})
        if result['image']:
            delete_file(result['image'])

        result = entries.find_one_and_delete({'_id': ObjectId(entryid), 'vendor': ObjectId(payload['_id'])})
        if result:
            return ({'data': 'Category successfully updated'}), 200
        else:
            return ({'data': 'An error occurred'}), 400
    except Exception as e:
        return ({'data': e}), 400

# ==================================
# Menu Entry Image Routes
# ==================================

@vendorRoutes.post('/menu/entry/image/<entryid>')
@middleware.vendor_required
def upload_entry_image(entryid):
    print("attempting to upload image")
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

        result = entries.find_one({'_id': ObjectId(entryid), 'vendor': ObjectId(payload['_id'])})
        if not result:
            return ({'data': 'An error occurred'}), 400
        if result['image']:
            delete_file(result['image'])

        if 'file' in request.files:
            split = os.path.splitext(request.files['file'].filename)
            fileId = f'{uuid.uuid4().hex}{split[1]}'
            if not upload_file(fileId, request.files['file']):
                return ({'data': 'Unable to upload file'}), 400

            result = entries.find_one_and_update({'_id': ObjectId(entryid), 'vendor': ObjectId(payload['_id'])}, {'$set': {'image': fileId}})
            if result:
                return ({'data': 'Image successfully updated'}), 200
            else:
                return ({'data': 'An error occurred'}), 400
        else:
            return ({'data': 'File not found'}), 400
    except Exception as e:
        return ({'data': e}), 400

@vendorRoutes.delete('/menu/entry/image/<entryid>')
@middleware.vendor_required
def delete_entry_image(entryid):
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

        result = entries.find_one({'_id': ObjectId(entryid), 'vendor': ObjectId(payload['_id'])})
        if not result:
            return ({'data': 'An error occurred'}), 400
        if result['image']:
            delete_file(result['image'])

        result = entries.find_one_and_update({'vendor': ObjectId(payload['_id'])}, {'$set': {'image': ""}})
        if result:
            return ({'data': 'Image successfully deleted'}), 200
        else:
            return ({'data': 'An error occurred'}), 400
    except Exception as e:
        return ({'data': e}), 400