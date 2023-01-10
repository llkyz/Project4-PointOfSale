from flask import request, Blueprint
import jwt
import middleware
from bson import ObjectId
import uuid
from datetime import datetime
from initialize import users, orders, archives, JWT_SECRET, JWT_ALGORITHM

outletRoutes = Blueprint('outlet', __name__, template_folder='templates')

# ==================================
# Get Outlet ID Route
# ==================================

@outletRoutes.get("/id")
@middleware.outlet_required
def get_outlet_id():
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
        return ({'data': payload['_id']}), 200
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
    if not getOrder:
        return ({'data': 'Cannot find order'}), 400
    result = archives.insert_one({'vendor': getOrder['vendor'], 'outlet': getOrder['outlet'], 'table': getOrder['table'], 'orders': getOrder['orders'], 'time': getOrder['time']})
    if result:
        orders.find_one_and_delete({'_id': ObjectId(data['orderId'])})
        return ({'data': 'Order archived, room closed'}), 200
    else:
        return ({'data': 'Something went wrong. Could not create archive'}), 400