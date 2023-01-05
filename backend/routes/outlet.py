from flask import request, Blueprint
import os
import jwt
from initialize import users

outletRoutes = Blueprint('outlet', __name__, template_folder='templates')