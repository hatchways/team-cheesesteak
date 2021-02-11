from sqlalchemy import (
    Column, String,
    Integer, ForeignKey,
    Boolean, Text,
    Float
    )
from sqlalchemy.orm import relationship, validates
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm.exc import NoResultFound
from base_model import BaseModelMixin 

# Base model the other model(s) will subclass
Base = declarative_base()

class Recipe(Base, BaseModelMixin):
    """
    Some notes
    - chef_profile -- A relationship to chef profile related to this recipe
    
    - ingredients -- A list of ingredients to be converted to a string
        then back to a list when recipe.get_ingredient_list is called
    
    - required_items -- A list of required utensils to be converted to a string
        then back to a list when recipe.get_utensil_list is called
    
    - image_urls -- A list of image urls to be converted to a string
        then back to a list when recipe.get_image_link_list is called
        This will gaurentee positions in case images are ordered
        in a certain way for a gallery as well as preventing the need
        for saving the image as Binary in the database directly.
    
    - cuisine -- The category this recipe falls in.
        **A predefined list of cuisines would be very useful here**
    
    - price -- The float that holds the price, to be formatted
        to $19.00 and accessed with recipe.get_formatted_price()
    """
    __tablename__ = "recipe"

    id = Column(Integer, primary_key=True)

    # Relationships
    chef_profile_id = Column(Integer, ForeignKey('profile.id'))
    chef_profile = relationship('Profile')

    # All fields are required hence nullable=False
    # General Info -- No length constraints because they
    # could all end up being fairly long
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    available = Column(Boolean, nullable=False)
    cuisine = Column(String, nullable=False)
    price = Column(Integer, nullable=False)

    # These store lists as strings in CSV format
    ingredients = Column(Text, nullable=False)
    required_items = Column(Text, nullable=False)
    image_urls = Column(Text, nullable=False)

    # TODO Validation for cuisine which 
    # requires a predefined list of cuisines
    # Which will also allow a select drop box to be used
    # instead of an input box

    @validates('price')
    def validate_price(self, key, price):
        if not isinstance(price, int):
            raise AssertionError(f"Expected price to be of type integer but got {type(price)}")
        new_price = price * 100
        return new_price

    @validates('image_urls')
    def validate_image_urls(self, key, image_urls):
        """
        Make sure we were passed a list
        Convert it to a string and return it
        """
        if not isinstance(image_urls, list):
            raise AssertionError(f"Expected field 'image_urls' to be of type list but got {type(image_urls)}")
        stringified_urls = ",".join(image_urls)
        return stringified_urls

    @validates('ingredients')
    def validate_ingredients(self, key, ingredients):
        if not isinstance(ingredients, list):
            raise AssertionError(f"Expected field 'ingredients' to be of type list but got {type(ingredients)}")
        stringified_ingredients = ",".join(ingredients)
        return stringified_ingredients

    @validates('required_items')
    def validate_required_items(self, key, required_items):
        if not isinstance(required_items, list):
            raise AssertionError(f"Expected field 'required_items' to be of type list but got {type(required_items)}")
        stringified_required_items = ",".join(required_items)
        return stringified_required_items

    @validates('available')
    def validate_available(self, key, available):
        """
        In case someone sends the value of a checkbox directly
        from html (which would yield 'true'), make sure it's a 
        true Boolean.
        """
        if not isinstance(available, bool):
            raise AssertionError(f"Expected field 'available' to be a boolean but got {type(available)}")
        return available

    @property

    def get_formatted_price(self):
        """
        For use in displaying a price in $19.26 format to a user
        """
        return f"${self.price/100}"

    @property
    def get_image_url_list(self):
        return self.image_urls.split(',')

    @property
    def get_ingredient_list(self):
        return self.ingredients.split(',')

    @property
    def get_utensil_list(self):
        return self.required_items.split(',')

    @property
    def get_chef_profile(self):
        """
        We can use this to link to a chefs profile if a
        user decides to browse all recipes instead of going
        directly to a chefs profile.
        """
        # This *should* return the instance due to backref="profle" 
        # (if it was added to the profile) being used in the profile model.
        # This needs tested though
        return self.chef_profile

    def __repr__(self):
        """
        self.chef_profile.user.name SHOULD yield the name of the user that
        owns the profile associated with this recipe but needs tested
        """
        return "<Recipe(chef='%s', name=%s)>" % (self.chef_profile.user.username, self.name)
