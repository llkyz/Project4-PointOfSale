from flask import request, Blueprint
import jwt
import middleware
from bson import ObjectId
import uuid
from datetime import datetime
from initialize import users, orders, menus, archives, JWT_SECRET, JWT_ALGORITHM

outletRoutes = Blueprint('outlet', __name__, template_folder='templates')

# ==================================
# Route for retrieving menu properties
# ==================================

@outletRoutes.get('/menudata')
@middleware.outlet_required
def get_menu_data():
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

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
# Room Routes
# ==================================

@outletRoutes.get('/room')
@middleware.outlet_required
def get_rooms():
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
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
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

        result = users.find_one({'_id': ObjectId(payload['_id'])})
        vendorId = result['vendor']

        data = request.get_json()
        tableNum = data['tableNum']
        result = orders.find_one({'outlet': ObjectId(payload['_id']), 'table': tableNum})
        if result:
            return ({'data': 'An order for this table already exists'}), 400
        
        while True:
            roomId = uuid.uuid4().hex
            result = orders.find_one({'room': roomId})
            if not result:
                break
        
        result = orders.insert_one({'outlet': ObjectId(payload['_id']), 'vendor': vendorId, 'table': tableNum, 'room': roomId, 'orders': [], 'time': datetime.utcnow()})
        return ({'data': roomId}), 200
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

    result = archives.insert_one({'vendor': getOrder['vendor'], 'outlet': getOrder['outlet'], 'table': getOrder['table'], 'orders': getOrder['orders'], 'time': getOrder['time'], 'subtotal': subtotal, 'tax': tax, 'service': service, 'total': total})
    if result:
        orders.find_one_and_delete({'_id': ObjectId(data['orderId'])})
        return ({'data': 'Order archived, room closed'}), 200
    else:
        return ({'data': 'Something went wrong. Could not create archive'}), 400