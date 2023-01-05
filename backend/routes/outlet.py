from flask import request, Blueprint
from pymongo import MongoClient
import bcrypt
import os
from dotenv import load_dotenv
import jwt
import middleware

load_dotenv()
client = MongoClient(os.getenv('DATABASE'))
db = client.flask_db
users = db.users

outletRoutes = Blueprint('outlet', __name__, template_folder='templates')