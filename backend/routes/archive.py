from flask import request, Blueprint
import middleware
from datetime import datetime
import jwt
from bson import ObjectId
import calendar
from initialize import users, archives, JWT_SECRET, JWT_ALGORITHM

archiveRoutes = Blueprint('archive', __name__, template_folder='templates')

@archiveRoutes.get("/outlet")
@middleware.outlet_required
def outlet_retrieve_archive():
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

        startDate = request.args.get('startDate').split('-')
        endDate = request.args.get('endDate').split('-')
        endYear = int(endDate[0])
        endMonth = int(endDate[1])
        startDate = datetime(int(startDate[0]), int(startDate[1]), int(startDate[2]))
        endDate = datetime(int(endDate[0]), int(endDate[1]), calendar.monthrange(int(endDate[0]), int(endDate[1]))[1], 23, 59, 59)
        
        returnList = list(archives.find({'outlet': ObjectId(payload['_id']), 'time': {'$gt': startDate, '$lt': endDate}}))
        for x in returnList:
            x['_id'] = str(x['_id'])
            x['vendor'] = str(x['vendor'])
            x['outlet'] = str(x['outlet'])

        statList = []
        for x in range(0,6):
            queryMonth = endMonth - x
            queryYear = endYear
            if queryMonth < 1:
                queryMonth += 12
                queryYear -= 1
            lastDay = calendar.monthrange(queryYear, queryMonth)[1]

            stats = list(archives.aggregate([
                {
                    '$match': {'outlet': ObjectId(payload['_id']), 'time':{'$gte': datetime(queryYear, queryMonth, 1),'$lt': datetime(queryYear, queryMonth, lastDay)}}
                },
                {
                    '$group':
                    {
                        '_id': {
                            'outlet': ObjectId(payload['_id']),
                        },
                        'revenue': {'$sum': '$total'},
                        'orders': {'$sum': 1}
                    }
                }
            ]))
            for y in stats:
                y['_id']['outlet'] = str(y['_id']['outlet'])
            if stats:
                statList.append({**stats[0], 'date': f'{queryMonth}-{queryYear} ({calendar.month_abbr[queryMonth]})'})
            else:
                statList.append({'_id': {'outlet': payload['_id']}, 'revenue': 0, 'orders': 0, 'date': f'{queryMonth}-{queryYear} ({calendar.month_abbr[queryMonth]})'})
        statList.reverse()
        
        return {'list': returnList, 'stats': statList}, 200
    except Exception as e:
        print(e)
        return {'data': 'An error occurred'}, 400

@archiveRoutes.delete("/outlet")
@middleware.outlet_required
def outlet_delete_archive():
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

        data = request.get_json()
        getArchive = archives.find_one({'_id': ObjectId(data['archiveId'])})
        if getArchive['outlet'] == ObjectId(payload['_id']):
            result = archives.find_one_and_delete({'_id': ObjectId(data['archiveId'])})
            if result:
                return ({'data': 'Archive Deleted'}), 200
            else:
                return ({'data': 'Archive could not be deleted'}), 400
        else:
            return ({'data': 'This archive does not belong to you'}), 200

    except Exception as e:
        print(e)
        return {'data': 'An error occurred'}, 400

@archiveRoutes.get("/vendor")
@middleware.vendor_required
def vendor_retrieve_stats():
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

        endDate = request.args.get('endDate').split('-')
        endYear = int(endDate[0])
        endMonth = int(endDate[1])

        revenueList = []
        orderList = []
        for x in range(0,6):
            queryMonth = endMonth - x
            queryYear = endYear
            if queryMonth < 1:
                queryMonth += 12
                queryYear -= 1
            lastDay = calendar.monthrange(queryYear, queryMonth)[1]

            stats = list(archives.aggregate([
                {
                    '$match': {'vendor': ObjectId(payload['_id']), 'time':{'$gte': datetime(queryYear, queryMonth, 1),'$lt': datetime(queryYear, queryMonth, lastDay)}}
                },
                {
                    '$lookup': {
                        'from': 'users',
                        'localField': 'outlet',
                        'foreignField': '_id',
                        'as': 'data',
                        'pipeline' : [{ '$project': {'_id': 0, 'username': 1 } }],
                    }
                },
                {
                     '$unwind': '$data'
                },
                {
                    '$group':
                    {
                        '_id': {
                            'username': '$data.username'
                        },
                        'revenue': {'$sum': '$total'},
                        'orders': {'$sum': 1}
                    }
                }
            ]))

            tempRevenue = {}
            tempOrder = {}
            for y in stats:
                tempRevenue[y['_id']['username']] = y['revenue']
                tempOrder[y['_id']['username']] = y['orders']
                
            if stats:
                revenueList.append({**tempRevenue, 'date': f'{queryMonth}-{queryYear} ({calendar.month_abbr[queryMonth]})'})
                orderList.append({**tempOrder, 'date': f'{queryMonth}-{queryYear} ({calendar.month_abbr[queryMonth]})'})
            else:
                revenueList.append({'date': f'{queryMonth}-{queryYear} ({calendar.month_abbr[queryMonth]})'})
                orderList.append({'date': f'{queryMonth}-{queryYear} ({calendar.month_abbr[queryMonth]})'})
        revenueList.reverse()
        orderList.reverse()

        print(revenueList)
        print(orderList)
        
        return {'revenue': revenueList, 'order': orderList}, 200
    except Exception as e:
        print(e)
        return {'data': 'An error occurred'}, 400

@archiveRoutes.get("/vendor/<outletId>")
@middleware.vendor_required
def vendor_retrieve_archive(outletId):
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

        getOutlet = users.find_one({'_id': ObjectId(outletId)})
        if getOutlet['vendor'] != ObjectId(payload['_id']):
            return ({'data': 'Unauthorised Access'}), 400

        startDate = request.args.get('startDate').split('-')
        endDate = request.args.get('endDate').split('-')
        endYear = int(endDate[0])
        endMonth = int(endDate[1])
        startDate = datetime(int(startDate[0]), int(startDate[1]), int(startDate[2]))
        endDate = datetime(int(endDate[0]), int(endDate[1]), calendar.monthrange(int(endDate[0]), int(endDate[1]))[1], 23, 59, 59)
        
        returnList = list(archives.find({'outlet': ObjectId(outletId), 'time': {'$gt': startDate, '$lt': endDate}}))
        for x in returnList:
            x['_id'] = str(x['_id'])
            x['vendor'] = str(x['vendor'])
            x['outlet'] = str(x['outlet'])

        statList = []
        for x in range(0,6):
            queryMonth = endMonth - x
            queryYear = endYear
            if queryMonth < 1:
                queryMonth += 12
                queryYear -= 1
            lastDay = calendar.monthrange(queryYear, queryMonth)[1]

            stats = list(archives.aggregate([
                {
                    '$match': {'outlet': ObjectId(outletId), 'time':{'$gte': datetime(queryYear, queryMonth, 1),'$lt': datetime(queryYear, queryMonth, lastDay)}}
                },
                {
                    '$group':
                    {
                        '_id': {
                            'outlet': ObjectId(outletId),
                        },
                        'revenue': {'$sum': '$total'},
                        'orders': {'$sum': 1}
                    }
                }
            ]))
            for y in stats:
                y['_id']['outlet'] = str(y['_id']['outlet'])
            if stats:
                statList.append({**stats[0], 'date': f'{queryMonth}-{queryYear} ({calendar.month_abbr[queryMonth]})'})
            else:
                statList.append({'_id': {'outlet': outletId}, 'revenue': 0, 'orders': 0, 'date': f'{queryMonth}-{queryYear} ({calendar.month_abbr[queryMonth]})'})
        statList.reverse()
        
        return {'list': returnList, 'stats': statList}, 200
    except Exception as e:
        print(e)
        return {'data': 'An error occurred'}, 400

@archiveRoutes.delete("/vendor")
@middleware.vendor_required
def vendor_delete_archive():
    try:
        jwt_token = request.cookies.get("token")
        payload = jwt.decode(jwt_token, JWT_SECRET,algorithms=[JWT_ALGORITHM])

        data = request.get_json()
        getArchive = archives.find_one({'_id': ObjectId(data['archiveId'])})
        if getArchive['vendor'] == ObjectId(payload['_id']):
            result = archives.find_one_and_delete({'_id': ObjectId(data['archiveId'])})
            if result:
                return ({'data': 'Archive Deleted'}), 200
            else:
                return ({'data': 'Archive could not be deleted'}), 400
        else:
            return ({'data': 'This archive does not belong to you'}), 200

    except Exception as e:
        print(e)
        return {'data': 'An error occurred'}, 400