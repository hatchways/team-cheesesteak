import os
from flask_jwt_extended import JWTManager
from flask import Flask
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from api.map_handler import map_handler
from api.upload_image_handler import upload_image_handler
from api.tests import test_handler

from api.auth import auth_views
from api.search import search_views

app = Flask(__name__)
app.secret_key = os.environ.get('flask_secret_key')
app.config['JWT_SECRET_KEY'] = os.environ.get("jwt_secret_key")

app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_REFRESH_COOKIE_PATH'] = "/auth/token/refresh/"

# Set this to True when pushing to production
# Only allows the cookies to be sent through https
app.config['JWT_COOKIE_SECURE'] = False

# Enable CSRF protection -- Only turned off
# for testing with postman. Turn this on before
# pushing to production or adding csrf protection
# to front end forms
app.config['JWT_COOKIE_CSRF_PROTECT'] = False

# Register flask_jwt_extended with Flask
jwt = JWTManager(app)

app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)
app.register_blueprint(map_handler)
app.register_blueprint(upload_image_handler)
app.register_blueprint(test_handler)

app.register_blueprint(auth_views)
app.register_blueprint(search_views)
