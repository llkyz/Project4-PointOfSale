from flask import Flask
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from flask_cors import CORS
import datetime
import secrets
from routes.user import userRoutes
from routes.admin import adminRoutes
from routes.vendor import vendorRoutes
from routes.outlet import outletRoutes
from routes.order import orderRoutes
from routes.archive import archiveRoutes
from routes.customer import customerRoutes

x = datetime.datetime.now()
app = Flask(__name__)
socketio = SocketIO(app)

app.register_blueprint(userRoutes, url_prefix="/api/user")
app.register_blueprint(adminRoutes, url_prefix="/api/admin")
app.register_blueprint(vendorRoutes, url_prefix="/api/vendor")
app.register_blueprint(outletRoutes, url_prefix="/api/outlet")
app.register_blueprint(orderRoutes, url_prefix="/api/order")
app.register_blueprint(archiveRoutes, url_prefix="/api/archive")
app.register_blueprint(customerRoutes, url_prefix="/api/customer")
CORS(app, supports_credentials=True)

@app.route("/data")
def get_time():
    return {
        'Name': "geek",
        'Age': "22",
        "Date": x,
        "Programming": "Python"
    }

@socketio.on("connect")
def connect():
    print("A user has connected")

# @socketio.on("clickButton")
# def clickButton(json):
#     print("Button clicked: ", str(json))
#     todos.insert_one({'content': 'ButtonClick', 'degree': "Important"})

@socketio.on("generateRandom")
def generateRandom():
    random_key = secrets.token_urlsafe(12)
    emit("randomKey", {"data": random_key})


@socketio.on("ping")
def ping():
    print("ping")
    emit("pong")

@socketio.on("sendOrder")
def receive_order(json):
    print("Received order from customer")
    print(json['data'])
    print(json['roomid'])
    emit("acknowledgeOrder", to=json['room'])

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
    socketio.run(app)