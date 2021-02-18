from sqlalchemy import (
    Column, String,
    Integer, ForeignKey,
    Boolean, Text
    )
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

from base_model import BaseModelMixin 


# Base model the other model(s) will subclass
Base = declarative_base()


class Profile(Base, BaseModelMixin):

    __tablename__ = 'profile'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    is_chef = Column(Boolean, nullable=False)
    about_me = Column(Text)
    profile_image = Column(Text)
    favourite_recipe = Column(Text)
    favourite_cuisine = Column(String, nullable = False)
    location = Column(Text, nullable = False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
 
    #relationship Profile and Recipe
    recipe = relationship("Recipe", back_populates="profile") 

    @validates('is_chef')
    def validate_is_chef(self, key, is_chef):
        if not isinstance(is_chef, bool):
            raise AssertionError(f"Expected field 'is_chef' to be a boolean but got {type(is_chef)}")
        return is_chef
    
    @validates('favourite_cuisine')
    def validate_ingredients(self, key, favourite_cuisine):
        if not isinstance(favourite_cuisine, list):
            raise AssertionError(f"Expected field 'favourite_cuisine' to be of type list but got {type(favourite_cuisine)}")
        stringified_favourite_cuisine= ",".join(favourite_cuisine)
        return stringified_favourite_cuisine

    def __repr__(self):
        return f"<Profile #{self.id}: {self.name}>"

    
        
