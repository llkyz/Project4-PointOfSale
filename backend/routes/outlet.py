from flask import request, Blueprint
import jwt
import middleware
from bson import ObjectId
import uuid
from datetime import datetime
from pymongo import ReturnDocument
from initialize import users, orders, menus, outlets, archives, JWT_SECRET, JWT_ALGORITHM

outletRoutes = Blueprint('outlet', __name__, template_folder='templates')

# ==================================
# Route to fetch menu properties
# ==================================

@outletRoutes.get('/menudata')
@middleware.outlet_required
def get_menu_data():
    try:
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)

        result = users.aggregate([
        {
            '$match': {'_id': ObjectId(payload['_id'])}
        },
        {
            '$lookup': {
                'from': 'menus',
                'localField': 'vendor',
                'foreignField': 'vendor',
                'as': 'menu'
            }
        }
    ])
        result = list(result)[0]
        title = result['menu'][0]['title']
        tax = result['menu'][0]['tax']
        service = result['menu'][0]['service']
        return({'data': {'title': title, 'tax': tax, 'service': service}}), 200
    except:
        return ({'data': 'An error occurred'}), 400

# ==================================
# Routes for outlet settings
# ==================================

@outletRoutes.get('/setting')
@middleware.outlet_required
def get_setting_data():
    try:
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)

        result = outlets.find_one({'outlet': ObjectId(payload['_id'])},{'vendor': 0, 'outlet' : 0})
        if not result:
            getUser = users.find_one({'_id': ObjectId(payload['_id'])})
            outlets.insert_one({'vendor': getUser['vendor'], 'outlet': ObjectId(payload['_id']), 'name': '', 'address1': '', 'address2': '', 'taxNum': '', 'telephone': '', 'fax': '', 'footer': '', 'tables': []})
            result = outlets.find_one({'outlet': ObjectId(payload['_id'])},{'vendor': 0, 'outlet' : 0})
        result['_id'] = str(result['_id'])
        return ({'data': result}), 200
    except:
        return ({'data': 'An error occurred'}), 400

@outletRoutes.put('/setting/')
@middleware.outlet_required
def update_setting_data():
    try:
        data = request.get_json()
        settingId = data['_id']
        del data['_id']
        result = outlets.find_one_and_update({'_id': ObjectId(settingId)}, {'$set': data})
        if not result:
            return ({'data': 'Unable to update'}), 400
        return ({'data': 'Settings updated'}), 200
    except:
        return ({'data': 'An error occurred'}), 400

# ==================================
# Room Routes
# ==================================

@outletRoutes.get('/room')
@middleware.outlet_required
def get_rooms():
    try:
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)
        result = list(orders.find({'outlet': ObjectId(payload['_id'])}))
        for x in result:
            x['_id'] = str(x['_id'])
            x['outlet'] = str(x['outlet'])
            x['vendor'] = str(x['vendor'])
        return ({'data': result}), 200
    except:
        return ({'data': 'An error occurred'}), 400

@outletRoutes.post('/room')
@middleware.outlet_required
def create_room():
    try:
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, JWT_SECRET,algorithms=JWT_ALGORITHM)

        result = users.find_one({'_id': ObjectId(payload['_id'])})
        vendorId = result['vendor']

        data = request.get_json()
        tableNum = data['tableNum']
        tableName = data['tableName']
        findTable = orders.find_one({'outlet': ObjectId(payload['_id']), 'tableNum': tableNum})
        if findTable:
            return ({'data': 'An order for this table already exists'}), 400
        
        while True:
            roomId = uuid.uuid4().hex
            findRoom = orders.find_one({'room': roomId})
            if not findRoom:
                break

        newOrder = {'outlet': ObjectId(payload['_id']), 'vendor': vendorId, 'tableNum': tableNum, 'tableName': tableName, 'room': roomId, 'orders': [], 'time': datetime.utcnow()}
        result = orders.insert_one(newOrder)
        if result:
            newOrder['_id'] = str(newOrder['_id'])
            newOrder['outlet'] = str(newOrder['outlet'])
            newOrder['vendor'] = str(newOrder['vendor'])
            return ({'data': newOrder}), 200
        else:
            return ({'data': "Unable to create room"}), 400
    except:
        return ({'data': 'An error occurred'}), 400

@outletRoutes.delete('/room')
@middleware.outlet_required
def delete_room():
    data = request.get_json()
    getOrder = orders.find_one({'_id': ObjectId(data['orderId'])})
    getVendorMenu = menus.find_one({'vendor': getOrder['vendor']})
    taxAmount = getVendorMenu['tax']
    serviceAmount = getVendorMenu['service']

    subtotal = 0
    for x in getOrder['orders']:
        for y in x:
            subtotal += y['price'] * y['quantity']

    subtotal = round(subtotal, 2)
    tax = round(subtotal * taxAmount / 100, 2)
    service = round(subtotal * serviceAmount / 100, 2)
    total = subtotal + tax + service

    result = archives.insert_one({'vendor': getOrder['vendor'], 'outlet': getOrder['outlet'], 'tableName': getOrder['tableName'], 'orders': data['orders'], 'time': getOrder['time'], 'subtotal': subtotal, 'tax': tax, 'service': service, 'total': total})
    if result:
        orders.find_one_and_delete({'_id': ObjectId(data['orderId'])})
        return ({'data': 'Order archived, room closed'}), 200
    else:
        return ({'data': 'Something went wrong. Could not create archive'}), 400

# ==================================
# Order Update Routes
# ==================================

@outletRoutes.put('/order')
@middleware.outlet_required
def update_order():
    data = request.get_json()

    result = orders.find_one_and_update({'_id': ObjectId(data['_id'])}, {'$set': {'orders': data['orders']}}, return_document=ReturnDocument.AFTER)

    if result:
        return ({'data': 'Updated order'}), 200
    else:
        return ({'data': 'Unable to update order'}), 400