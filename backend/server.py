from flask import Flask
from flask_socketio import SocketIO, emit, send, join_room
from flask_cors import CORS
import datetime
import os
from routes.user import userRoutes
from routes.admin import adminRoutes
from routes.vendor import vendorRoutes
from routes.outlet import outletRoutes
from routes.archive import archiveRoutes
from routes.customer import customerRoutes
from initialize import orders
from pymongo import ReturnDocument

x = datetime.datetime.now()
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

app.register_blueprint(userRoutes, url_prefix="/api/user")
app.register_blueprint(adminRoutes, url_prefix="/api/admin")
app.register_blueprint(vendorRoutes, url_prefix="/api/vendor")
app.register_blueprint(outletRoutes, url_prefix="/api/outlet")
app.register_blueprint(archiveRoutes, url_prefix="/api/archive")
app.register_blueprint(customerRoutes, url_prefix="/api/customer")
CORS(app, supports_credentials=True)

@socketio.on("connect")
def connect():
    print("A user has connected")

@socketio.on("sendOrder")
def receive_order(json):
    print("Received order from customer")
    data = json['data']
    
    for x in data['items']:
        x['price'] = int(x['price'])
        x['quantity'] = int(x['quantity'])

    getOrder = orders.find_one({'room': data['roomid']})
    if not getOrder:
        print("Order not found")
        return
    getOrder['orders'].append(data['items'])
    result = orders.find_one_and_update({'room': data['roomid']}, {'$set': {'orders': getOrder['orders']}}, return_document=ReturnDocument.AFTER)
    result['_id'] = str(result['_id'])
    result['outlet'] = str(result['outlet'])
    result['vendor'] = str(result['vendor'])
    del result['time']
    emit("acknowledgeOrder", {"data": result, "items": data['items']}, to=data['roomid'])

@socketio.on("outletReconnect")
def reconnect_rooms(json):
    for x in json['data']:
        join_room(x)
        print(f'Outlet reconnected to {x}')
        send(f'Outlet connected to room {x}', to=x)

@socketio.on("joinRoom")
def enter_room(json):
    join_room(json['data'])
    send(f'A user joined room ' + json['data'], to=json['data'])

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))