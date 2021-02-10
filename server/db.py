"""
As a work around for too many sessions being open
and not being able to use cls.query.filter(<arg>) 
due to query not being an attribute of the mixin
create the engine and session ONLY ONCE here
and import it everywhere else
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# To be replaced with the actual engine
engine = create_engine("sqlite:///:memory:", echo=True)
Session = sessionmaker(bind=engine)
session = Session()