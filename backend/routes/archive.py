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
def retrieve_archive():
    print("Retrieve archive")
    return {"data": "Retrieve archive"}, 200

@archiveRoutes.post("/")
@middleware.vendor_required
def create_archive():
    data = request.get_json()
    archive.insert_one(data)
    return ({"data": "Archive Created"}), 200

@archiveRoutes.put("/")
@middleware.vendor_required
def edit_archive():
    data = request.get_json()
    archive.find_one_and_update("something goes here")
    return ({"data": "Archive Updated"}), 200

@archiveRoutes.put("/")
@middleware.vendor_required
def delete_archive():
    data = request.get_json()
    archive.find_one_and_delete("something goes here")
    return ({"data": "Archive Deleted"}), 200