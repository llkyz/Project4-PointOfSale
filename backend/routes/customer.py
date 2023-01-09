from flask import Blueprint
from bson import ObjectId
import datetime
from initialize import menus, bucket

customerRoutes = Blueprint('customer', __name__, template_folder='templates')

def get_file_url(blob_name):
    try:
        blob = bucket.blob(blob_name)
        serving_url = blob.generate_signed_url(version="v4",
        expiration=datetime.timedelta(minutes=30),
        method="GET")
        return serving_url
    except Exception as e:
        return False

@customerRoutes.get('/menu/<vendorid>')
def get_menu(vendorid):
    result = menus.aggregate([
        {
            '$match': {'vendor': ObjectId(vendorid)}
        },
        {
            '$lookup': {
                'from': 'categories',
                'localField': 'vendor',
                'foreignField': 'vendor',
                'as': 'categories',
                'pipeline': [
                    {
                        '$lookup': {
                            'from': 'entries',
                            'localField': '_id',
                            'foreignField': 'category',
                            'as': 'entries'
                        }
                    }
                ]
            }
        }
    ])
    result = list(result)[0]
    if result:
        result['_id'] = str(result['_id'])
        result['vendor'] = str(result['vendor'])
        if result['logo']:
            result['logo'] = get_file_url(result['logo'])
        for x in result['categories']:
            x['_id'] = str(x['_id'])
            x['vendor'] = str(x['vendor'])
            for y in x['entries']:
                y['_id'] = str(y['_id'])
                y['category'] = str(y['category'])
                y['vendor'] = str(y['vendor'])
                if y['image']:
                    y['image'] = get_file_url(y['image'])
                else:
                    y['image'] = get_file_url('placeholder.jpg')
        return ({'data': result}), 200
    else:
        return ({'data': 'No menu found'}), 400