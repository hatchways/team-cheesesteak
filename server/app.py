from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from api.ping_handler import ping_handler
from api.home_handler import home_handler

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:cheesesteak@localhost:5432/team-cheesesteak'

app.config['SQLALCHEMY_DATABASE_URI'] = ''
    
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)

import profile