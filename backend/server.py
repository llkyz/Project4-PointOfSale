from flask import Flask, request
from flask_socketio import SocketIO, emit
import datetime
from pymongo import MongoClient
from bson.objectid import ObjectId
import secrets
import os
from dotenv import load_dotenv
from routes.user import userRoutes
from routes.order import orderRoutes
from routes.archive import archiveRoutes

load_dotenv()
x = datetime.datetime.now()
client = MongoClient(os.getenv('DATABASE'))
db = client.flask_db
users = db.users
todos = db.todos
app = Flask(__name__)
socketio = SocketIO(app)


app.register_blueprint(userRoutes, url_prefix="/api/user")
app.register_blueprint(orderRoutes, url_prefix="/api/order")
app.register_blueprint(archiveRoutes, url_prefix="/api/archive")

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

@socketio.on("clickButton")
def clickButton(json):
    print("Button clicked: ", str(json))
    todos.insert_one({'content': 'ButtonClick', 'degree': "Important"})

@socketio.on("generateRandom")
def generateRandom():
    random_key = secrets.token_urlsafe(12)
    emit("randomKey", {"data": random_key})


@socketio.on("ping")
def ping():
    print("ping")
    emit("pong")

if __name__ == "__main__":
    socketio.run(app)