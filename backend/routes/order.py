from flask import Flask, request, Blueprint
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import middleware
import datetime

load_dotenv()
client = MongoClient(os.getenv('DATABASE'))
db = client.flask_db
order = db.orders

orderRoutes = Blueprint('order', __name__, template_folder='templates')

@orderRoutes.get("/order")
@middleware.outlet_required
def retrieve_order():
    print("Retrieve order")
    return {"data": "Retrieve order"}, 200