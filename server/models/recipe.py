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
    
    - image_links -- A list of image urls to be converted to a string
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
    price = Column(Float, nullable=False)

    # These store lists as strings in CSV format
    ingredients = Column(Text, nullable=False)
    required_items = Column(Text, nullable=False)
    image_links = Column(Text, nullable=False)

    # TODO Validation for cuisine which 
    # requires a predefined list of cuisines
    # Which will also allow a select drop box to be used
    # instead of an input box

    @validates('price')
    def validate_price(self, key, price):
        if not isinstance(price, float):
            # Try to convert it to a float
            try:
                float_price = float(price)
                # Reassign price to be the float version
                price = float_price
            except:
                raise ValueError(f"Expected a price as an integer or float but got {type(price)}")
        return price

    @validates('image_links')
    def validate_image_links(self, key, image_links):
        """
        Make sure we were passed a list
        Convert it to a string and return it
        """
        if not isinstance(image_links, list):
            raise AssertionError(f"Expected image_links to be of type list but got {type(image_links)}")
        stringified_links = ",".join(link for link in image_links)
        return stringified_links

    @validates('ingredients')
    def validate_ingredients(self, key, ingredients):
        if not isinstance(ingredients, list):
            raise AssertionError(f"Expected ingredients to be of type list but got {type(ingredients)}")
        stringified_ingredients = ",".join(ingredient for ingredient in ingredients)
        return stringified_ingredients

    @validates('required_items')
    def validate_required_items(self, key, required_items):
        if not isinstance(required_items, list):
            raise AssertionError(f"Expected required_items to be of type list but got {type(required_items)}")
        stringified_required_items = ",".join(item for item in required_items)
        return stringified_required_items

    @validates('available')
    def validate_available(self, key, available):
        """
        In case someone sends the value of a checkbox directly
        from html (which would yield 'true'), make sure it's a 
        true Boolean.
        """
        if not isinstance(available, bool):
            raise AssertionError(f"Expected available to be a boolean but got {type(available)}")
        return available

    @property
    def get_formatted_price(self):
        return f"${self.price}"

    @property
    def get_image_link_list(self):
        return self.image_links.split(',')

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
