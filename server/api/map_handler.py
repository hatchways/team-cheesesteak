
import json
import smtplib
import requests
from flask import jsonify, request, Blueprint
from config import API_KEY
from handlers.GoogleAPIHandler import GoogleAPIHandler

map_handler = Blueprint('map_handler', __name__)

@map_handler.route('/map', methods=['POST'])
def map():
    post_data = json.loads(request.get_data())
    address = post_data['address'].replace(' ', '+')

    url = "https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s" % (address, API_KEY)
    google_req = requests.get(url).json()

    #check for bad request
    #check if location exists
    googleHandler = GoogleAPIHandler(google_req)
    status = googleHandler.handle()
    if status != 'OK':
        print(status['log'])
        return status['msg'], 400
    
    #get geocodes
    geocodes = google_req['results'][0]['geometry']['location']
    
    #get bounds: viewport -> latitude,longitude values defining the southwest and northeast corner of the viewport bounding box
    viewport = google_req['results'][0]['geometry']['viewport']
    
    #return geolocation
    return jsonify({'response': {'geocodes':geocodes,'viewport':viewport}}), 200
