
import json
import smtplib
import requests
from flask import jsonify, request, Blueprint
from config import API_KEY
from handlers.GoogleAPIHandler import GoogleAPIHandler
from api.auth import authenticate

autocomplete_handler = Blueprint('autocomplete_handler', __name__)

@autocomplete_handler.route('/api/autocomplete', methods=['POST'])
def autocomplete():
    post_data = json.loads(request.get_data())
    location = post_data['location'].replace(' ', '+')
    locations = []
    url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=%s&key=%s" % (location, API_KEY)
    google_req = requests.get(url).json()

    #check for bad request
    #check if location exists
    googleHandler = GoogleAPIHandler(google_req)
    status = googleHandler.handle()

    if status != 'OK':
        print(status['log'])
        return jsonify({'response': {'msg': status['msg']}, "status": 400}), 400

    #select only predicted address
    google_predictions = google_req['predictions']

    #build array of locations
    for predictions in google_predictions:
        locations.append(predictions['description'])

    #return geolocation
    return jsonify({'response': {'locations': locations}, "status": 200}), 200
