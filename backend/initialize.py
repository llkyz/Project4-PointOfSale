from pymongo import MongoClient
import os
import certifi
from google.cloud import storage

ca = certifi.where()
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'ServiceKey_GoogleCloud.json'
storage_client = storage.Client()
bucket = storage_client.get_bucket('pos-system')

client = MongoClient(os.getenv('DATABASE'), tlsCAFile=ca)
db = client.flask_db
users = db.users
archives = db.archives
orders = db.orders
menus = db.menus
categories = db.categories
entries = db.entries
outlets = db.outlets

JWT_ALGORITHM = os.getenv('JWT_ALGORITHM')
JWT_SECRET = os.getenv('JWT_SECRET')