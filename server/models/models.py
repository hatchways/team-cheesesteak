import re
from sqlalchemy import (
    Column, String,
    Integer, ForeignKey,
    Text, Boolean
    )
from sqlalchemy.orm import relationship, validates, backref
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.security import generate_password_hash, check_password_hash

from models.base_model import BaseModelMixin

# Base model the other model(s) will subclass
Base = declarative_base()

class User(Base, BaseModelMixin):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)

    # Split up the address to make finding location radius easier
    # Also makes displaying info easier
    street_address = Column(String(30), nullable=False)
    city = Column(String(30), nullable=False)
    state_or_province = Column(String(30), nullable=False)
    country = Column(String(30), nullable=False)
    zip_code = Column(String(12), nullable=False)

    # Auth
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(150), index=True, unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)

    # Relationships
    # This requires the Profile model to link back to the user model
    profile = relationship("Profile", uselist=False, backref="user", cascade="all, delete-orphan")

    def set_password(self, password):
        if not password:
            raise AssertionError('Password not provided')
        if not re.match('\d.*[A-Z]|[A-Z].*\d', password):
            raise AssertionError('Password must contain 1 capital letter and 1 number')
        if len(password) < 8 or len(password) > 50:
            raise AssertionError('Password must be between 8 and 50 characters')
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def credentials_match(username, password):
        """
        Return True if the credentials are correct
        False otherwise
        """
        user = User.get_by_username(username)
        return user.check_password(password)

    @staticmethod
    def get_by_username(username):
        """
        Return a user instance or raise a NoResultFound exception
        """
        user = User.query.filter(User.username == username).first()
        if not user:
            raise NoResultFound(f"User with username {username} does not exist")
        return user

    # Properties

    @property
    def get_full_address(self):
        """
        Return a full address for the user such as...
        123 Main Street, Columbus, Ohio, United States, 45796
        """
        return f"{self.street_and_city}, {self.state_or_province}, {self.country}, {self.zip_code}"

    @property
    def get_street_and_city(self):
        """
        Return only the street address and city such as...
        123 Main Street, Columbus
        """
        return f"{self.street_address}, {self.city}"
    
    @property
    def get_city_and_province(self):
        """
        Return only the city and state/province such as...
        Columbus, Ohio
        """
        return f"{self.city}, {self.state_or_province}"

    @property
    def get_province_and_country(self):
        """
        Return only the state/province and country such as...
        Ohio, United States
        """
        return f"{self.state_or_province}, {self.country}"

    # Field Validation -- Executes when setting fields

    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise AssertionError('No username provided')
        if User.instance_exists(**{'username': username}):
            raise AssertionError('Username is already in use')
        if len(username) < 5 or len(username) > 50:
            raise AssertionError('Username must be between 5 and 20 characters')
        return username
    
    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise AssertionError('No email provided')
        if User.instance_exists(**{'email': email}):
            raise AssertionError("Email is already in use")
        if not re.match("[^@]+@[^@]+\.[^@]+", email):
            raise AssertionError('Provided email is not an email address')
        return email

    @validates('street_address')
    def validate_street_address(self, key, street_address):
        if not street_address:
            raise AssertionError("Street Address not provided")
        if len(street_address) < 10 or len(street_address) > 150:
            raise AssertionError("Street Address must be between 10 and 150 characters")
        return street_address

    @validates('city')
    def validate_city(self, key, city):
        if not city or not city.isalpha():
            raise AssertionError("City not provided")
        if len(city) < 5 or len(city) > 30:
            raise AssertionError("City must be between 5 and 30 characters")
        return city

    @validates('state_or_province')
    def validate_state_or_province(self, key, state_or_province):
        if not state_or_province or not state_or_province.isalpha():
            raise AssertionError("State or Province not provided or contains non alphabetical characters")
        if len(state_or_province) < 5 or len(state_or_province) > 30:
            raise AssertionError("State or Province must be between 5 and 30 characters")
        return state_or_province

    @validates('country')
    def validate_country(self, key, country):
        if not country or not country.isalpha():
            raise AssertionError("Country not provided or contains non alphabetical characters")
        elif len(country) < 5 or len(country) > 30:
            raise AssertionError("Country must be between 5 and 30 characters")
        return country

    @validates('zip_code')
    def validate_zip_code(self, key, zip_code):
        canada_regex_matched = False
        america_regex_matched = False
        if not zip_code:
            raise AssertionError("Zip code not provided")
        # Try to match American zip code layout
        if re.match('^[0-9]{5}(?:-[0-9]{4})?$', zip_code):
            america_regex_matched = True
        # Try to match Canadian zip code layout
        if re.match('^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$', zip_code):
            canada_regex_matched = True
        if not america_regex_matched and not canada_regex_matched:
            raise AssertionError("Zip code did not match American nor Canadian zip code formats")
        if len(zip_code) < 5 or len(zip_code) > 12:
            raise AssertionError("Zip code must be between 5 and 12 characters")
        return zip_code

    def __repr__(self):
        return "<User(username='%s')>" % (self.username)


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
    user_id = Column(Integer, ForeignKey('user.id'))

 
    #relationship Profile and Recipe
    recipes = relationship("Recipe", backref="profile", cascade="all, delete-orphan") 

    @validates('is_chef')
    def validate_is_chef(self, key, is_chef):
        if not isinstance(is_chef, bool):
            raise AssertionError(f"Expected field 'is_chef' to be a boolean but got {type(is_chef)}")
        return is_chef

    def __repr__(self):
        return f"<Profile #{self.id}: {self.name}>"



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
            "french"
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
