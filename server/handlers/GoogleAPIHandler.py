class GoogleAPIHandler:
    
    google_maps_request = {}

    def __init__(self, google_maps_request):
        super().__init__()
        self.google_maps_request = google_maps_request

    def handle(self):
        default = "Request could not be processed due to a server error"
        return getattr(self, str(self.google_maps_request['status']), lambda: default)()

    def OK(self):
        return 'OK'
        
    def ZERO_RESULTS(self):
        msg = "No results Found: Please check that you've inputed the correct information."
        log = "ZERO_RESULTS: %(error_message)s" % self.google_maps_request
        return {'msg': msg,'log': log}
 
    def OVER_DAILY_LIMIT(self):
        msg = "Over Daily Limit: We are experiencing heavy traffic please try again later."
        log = "OVER_DAILY_LIMIT: %(error_message)s" % self.google_maps_request
        return {'msg': msg,'log': log}
 
    def OVER_QUERY_LIMIT(self):
        msg = "To many requests made today."
        log = "OVER_QUERY_LIMIT: %(error_message)s" % self.google_maps_request
        return {'msg': msg,'log': log}
 
    def REQUEST_DENIED(self):
        msg = "Your Request was denied: This is not your fault."
        log = "REQUEST_DENIED: %(error_message)s" % self.google_maps_request
        return {'msg': msg,'log': log}
 
    def INVALID_REQUEST(self):
        msg = "Invalid Request: Please double check whether you entered the right info."
        log = "INVALID_REQUEST: %(error_message)s" % self.google_maps_request
        return {'msg': msg,'log': log}