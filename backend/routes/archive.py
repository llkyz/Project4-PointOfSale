from flask import request, Blueprint
import middleware
from datetime import datetime
import jwt
from bson import ObjectId
from initialize import users, archives, JWT_SECRET, JWT_ALGORITHM

archiveRoutes = Blueprint('archive', __name__, template_folder='templates')

@archiveRoutes.get("/outlet")
@middleware.outlet_required
def retrieve_outlet_archive():
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

        startDate = request.args.get('startDate').split('-')
        endDate = request.args.get('endDate').split('-')
        startDate = datetime(int(startDate[0]), int(startDate[1]), int(startDate[2]))
        endDate = datetime(int(endDate[0]), int(endDate[1]), int(endDate[2]))
        
        returnList = list(archives.find({'outlet': ObjectId(payload['_id']), 'time': {'$gt': startDate, '$lt': endDate}}))
        for x in returnList:
            x['_id'] = str(x['_id'])
            x['vendor'] = str(x['vendor'])
            x['outlet'] = str(x['outlet'])

        stats = archives.aggregate([
            {
                '$group':
                {
                    '_id': {'outlet': ObjectId(payload['_id'])},
                    'sum': {'$sum': '$total'}
                }
            }
        ])
        print(list(stats))
        return {'list': returnList, 'sum': stats}, 200
    except Exception as e:
        print(e)
        return {'data': 'An error occurred'}, 400

@archiveRoutes.post("/")
@middleware.vendor_required
def create_archive():
    data = request.get_json()
    archives.insert_one(data)
    return ({"data": "Archive Created"}), 200

@archiveRoutes.put("/")
@middleware.vendor_required
def edit_archive():
    data = request.get_json()
    archives.find_one_and_update("something goes here")
    return ({"data": "Archive Updated"}), 200

@archiveRoutes.put("/")
@middleware.vendor_required
def delete_archive():
    data = request.get_json()
    archives.find_one_and_delete("something goes here")
    return ({"data": "Archive Deleted"}), 200