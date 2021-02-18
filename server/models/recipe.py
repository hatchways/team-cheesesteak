from sqlalchemy import (
    Column, String,
    Integer, ForeignKey,
    Text, Boolean
    )
from sqlalchemy.orm import validates
from models.base_model import Base, BaseModelMixin

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
    profile_id = Column(Integer, ForeignKey('profile.id'))
    #profile = relationship("Profile", back_populates="recipes")
    
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
    required_items = Column(Text)
    image_urls = Column(Text, nullable=False)

    @validates('price')
    def validate_price(self, key, price):
        if not isinstance(price, int):
            raise AssertionError("Expected price to be of type integer but got %s" % (type(price)))
        new_price = price * 100
        return new_price

    @validates('image_urls')
    def validate_image_urls(self, key, image_urls):
        """
        Make sure we were passed a list
        Convert it to a string and return it
        """
        if "," not in image_urls:
            raise AssertionError("Expected field 'image_urls' to be in CSV format")
        if not isinstance(image_urls, str):
            raise AssertionError("Expected field 'image_urls' to be a string in CSV format but got a %s instead" % (type(image_urls)))
        return image_urls

    @validates('ingredients')
    def validate_ingredients(self, key, ingredients):
        if "," not in ingredients:
            raise AssertionError("Expected field 'ingredients' to be in CSV format")
        if not isinstance(ingredients, str):
            raise AssertionError("Expected field 'ingredients' to be a string in CSV format but got a %s instead" % (type(ingredients)))
        return ingredients

    @validates('required_items')
    def validate_required_items(self, key, required_items):
        if "," not in required_items:
            raise AssertionError("Expected field 'required_items' in CSV format")
        if not isinstance(required_items, str):
            raise AssertionError("Expected field 'required_items' to be a string in CSV format but got a %s instead" % (type(required_items)))
        return required_items

    @validates('available')
    def validate_available(self, key, available):
        """
        In case someone sends the value of a checkbox directly
        from html (which would yield 'true'), make sure it's a 
        true Boolean.
        """
        if not isinstance(available, bool):
            raise AssertionError("Expected field 'available' to be a boolean but got %s" % (type(available)))
        return available

    @validates('cuisine')
    def validate_cuisine(self, key, cuisine):
        """
        Make sure the cuisine is an existing one for more uniform
        models, easier drop downs, and so the user doesn't need
        to worry about typos or anything
        """
        if not cuisine:
            raise AssertionError("No cuisine was provided")
        if cuisine.lower() not in self.get_cuisines():
            raise AssertionError("The given cuisine '%s' is not in the list of accepted cuisines, please try again" % (cuisine))
        return cuisine

    @staticmethod
    def get_cuisines():
        cuisines = [
            "indonesian",
            "turkish",
            "thai",
            "spanish",
            "moroccan",
            "japanese",
            "indian",
            "italian",
            "french",
            "english"
        ]
        return cuisines


    @property
    def get_formatted_price(self):
        """
        For use in displaying a price in $19.26 format to a user
        """
        return "$%s" % (self.price/100)

    @property
    def get_image_url_list(self):
        return self.image_urls.split(',')

    @property
    def get_ingredient_list(self):
        return self.ingredients.split(',')

    @property
    def get_utensil_list(self):
        return self.required_items.split(',')


    def __repr__(self):
        """
        self.chef_profile.user.name SHOULD yield the name of the user that
        owns the profile associated with this recipe but needs tested
        """
        return "<Recipe(name=%s ID=%s)>" % (self.name, self.id)
