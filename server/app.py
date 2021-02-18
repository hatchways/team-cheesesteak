from flask import Flask
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from api.auth import auth_views
from api.search import search_views

app = Flask(__name__)


app.register_blueprint(search_views)
app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)
app.register_blueprint(auth_views)
app.register_blueprint(search_views)