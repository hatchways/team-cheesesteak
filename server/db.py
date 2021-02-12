"""
As a work around for too many sessions being open
and not being able to use cls.query.filter(<arg>) 
due to query not being an attribute of the mixin
create the engine and session ONLY ONCE here
and import it everywhere else
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Fill these fields with your local DB information
username = os.environ.get('username')
password = os.environ.get('password')
port = os.environ.get('port')
db_name = os.environ.get('db_name')
db_string = "postgresql+psycopg2://%s:%s@localhost:%s/%s" % (username, password, port, db_name)
engine = create_engine(db_string, echo=True)
Session = sessionmaker(bind=engine)
session = Session()
