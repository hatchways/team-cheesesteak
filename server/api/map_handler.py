
import json
import smtplib
import requests
from flask import jsonify, request, Blueprint
from config import API_KEY
map_handler = Blueprint('map_handler', __name__)

@map_handler.route('/map', methods=['POST'])
def map():
    if request.method != 'POST':
        return 'NOT POST'
    
    postData = json.loads(request.get_data())
    address = postData['address'].replace(' ', '+')
    
    url = "https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s" % (address, API_KEY)
    googleReq = requests.get(url).json()

    #check for bad request
    #check if location exists
    googleHandler = googleAPIHandler()
    status = googleHandler.handle(googleReq)
    if status != True:
        print(status['log'])
        return status['msg']
    
    #get geocodes
    geocodes = googleReq['results'][0]['geometry']['location']
    #get bounds: viewport -> latitude,longitude values defining the southwest and northeast corner of the viewport bounding box
    viewport = googleReq['results'][0]['geometry']['viewport']
    
    #return geolocation
    return {'geocodes':geocodes,'viewport':viewport}

class googleAPIHandler:
    
    gMapRequest = {}

    def handle(self,gMapRequest):
        self.gMapRequest = gMapRequest
        default = "Request could not be processed due to a server error"
        return getattr(self, str(self.gMapRequest['status']), lambda: default)()
 
    def OK(self):
        return True
        
    def ZERO_RESULTS(self):
        msg = "No results Found: Please check that you've inputed the correct information."
        log = "ZERO_RESULTS: %(error_message)s" % self.gMapRequest
        return {'msg': msg,'log': log}
 
    def OVER_DAILY_LIMIT(self):
        msg = "Over Daily Limit: We are experiencing heavy traffic please try again later."
        log = "OVER_DAILY_LIMIT: %(error_message)s" % self.gMapRequest
        return {'msg': msg,'log': log}
 
    def OVER_QUERY_LIMIT(self):
        msg = "To many requests made today."
        log = "OVER_QUERY_LIMIT: %(error_message)s" % self.gMapRequest
        return {'msg': msg,'log': log}
 
    def REQUEST_DENIED(self):
        msg = "Your Request was denied: This is not your fault."
        log = "REQUEST_DENIED: %(error_message)s" % self.gMapRequest
        return {'msg': msg,'log': log}
 
    def INVALID_REQUEST(self):
        msg = "Invalid Request: Please double check whether you entered the right info."
        log = "INVALID_REQUEST: %(error_message)s" % self.gMapRequest
        return {'msg': msg,'log': log}