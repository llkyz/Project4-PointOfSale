from pymongo import MongoClient
import os

client = MongoClient(os.getenv('DATABASE'))
db = client.flask_db
users = db.users
archive = db.archives
orders = db.orders
menus = db.menus
categories = db.categories
entries = db.entries

JWT_ALGORITHM = os.getenv('JWT_ALGORITHM')
JWT_SECRET = os.getenv('JWT_SECRET')