from flask import Flask, request, Blueprint
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import middleware
import datetime

load_dotenv()
client = MongoClient(os.getenv('DATABASE'))
db = client.flask_db
archive = db.archive

archiveRoutes = Blueprint('archive', __name__, template_folder='templates')

@archiveRoutes.get("/archive")
@middleware.vendor_required
def retrieve_order():
    print("Retrieve archive")
    return {"data": "Retrieve archive"}, 200