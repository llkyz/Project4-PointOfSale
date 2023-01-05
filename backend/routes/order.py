from flask import request, Blueprint
import middleware
from initialize import orders

orderRoutes = Blueprint('order', __name__, template_folder='templates')

@orderRoutes.get("/")
@middleware.outlet_required
def retrieve_order():
    data = request.get_json()
    orders.find_one("something goes here")
    return {"data": "Retrieve order"}, 200

@orderRoutes.post("/")
@middleware.vendor_required
def create_archive():
    data = request.get_json()
    orders.insert_one(data)
    return ({"data": "Order Created"}), 200

@orderRoutes.put("/")
@middleware.vendor_required
def edit_archive():
    data = request.get_json()
    orders.find_one_and_update("something goes here")
    return ({"data": "Order Updated"}), 200

@orderRoutes.put("/")
@middleware.vendor_required
def delete_archive():
    data = request.get_json()
    orders.find_one_and_delete("something goes here")
    return ({"data": "Order Deleted"}), 200