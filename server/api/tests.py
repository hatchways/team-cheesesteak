
import json
import smtplib
import requests
from flask import jsonify, request, Blueprint
from config import API_KEY
from handlers.GoogleAPIHandler import GoogleAPIHandler
from models.user import User
from api.auth import authenticate

test_handler = Blueprint('test_handler', __name__)


@test_handler.route('/test')
@authenticate
def get_geocode_test(**kwargs):
    user = kwargs['user']
    geocodes = user.get_geocode()
    #return geolocation
    return jsonify(geocodes), 200