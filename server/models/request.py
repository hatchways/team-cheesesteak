from datetime import datetime
from sqlalchemy import (
    Column, String,
    Integer, ForeignKey,
    Text, Boolean
    )
from sqlalchemy.orm import relationship, validates
from models.base_model import Base, BaseModelMixin

from models.recipe import Recipe
from models.user import User

class Request(Base, BaseModelMixin):

    __tablename__ = 'request'

    id = Column(Integer, primary_key=True)
    chef_id = Column(Integer, ForeignKey('user.id'))
    user_id = Column(Integer, ForeignKey('user.id'))
    recipe_id = Column(Integer, ForeignKey('recipe.id'))
    created_date_time = Column(DateTime, default=datetime.now)


    accepted = Column(db.Boolean) #indicates request has been made by the user/customer and accepted by the chef
    request_fulfilled = Column(db.Boolean) #indicates request has been paid for by the user/customer
    quantity = Column(db.Integer) 

    @validates('accepted')
    def validate_is_chef(self, key, accepted):
        if not isinstance(accepted, bool):
            raise AssertionError("Expected field 'accepted' to be a boolean but got %s" % (type(accepted)))
        return accepted

    @validates('request_fulfilled')
    def validate_is_chef(self, key, request_fulfilled):
        if not isinstance(request_fulfilled, bool):
            raise AssertionError("Expected field 'request_fulfilled' to be a boolean but got %s" % (type(request_fulfilled)))
        return request_fulfilled

    def __repr__(self):
        return f"<Request #{self.id}>"