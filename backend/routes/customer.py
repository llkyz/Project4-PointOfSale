from flask import Blueprint
from bson import ObjectId
from initialize import menus

customerRoutes = Blueprint('customer', __name__, template_folder='templates')

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
        for x in result['categories']:
            x['_id'] = str(x['_id'])
            x['vendor'] = str(x['vendor'])
            for y in x['entries']:
                y['_id'] = str(y['_id'])
                y['category'] = str(y['category'])
                y['vendor'] = str(y['vendor'])
        return ({'data': result}), 200
    else:
        return ({'data': 'No menu found'}), 400