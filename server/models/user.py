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
from db import session
from models.base_model import Base, BaseModelMixin
# Initialize the other models to prevent an issue with
# the database
from models.recipe import Recipe
from models.profile import Profile
from models.message import Message

class User(Base, BaseModelMixin):
    __tablename__ = "user"
    
    id = Column(Integer, primary_key=True)

    # Split up the address to make finding location radius easier
    # Also makes displaying info easier
    street_address = Column(String(150), default="Not entered")
    city = Column(String(30), default="Not entered")
    state_or_province = Column(String(30), default="Not entered")
    country = Column(String(30), default="Not entered")
    zip_code = Column(String(12), default="Not entered")

    # Auth
    email = Column(String(150), index=True, unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)

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
    def credentials_match(email, password):
        """
        First get the user by using the given email,
        then use the user.
        Return True if the credentials are correct
        False otherwise
        """
        user = User.get_by_email(email)
        # If the password is a match, return the user
        # Otherwise return None
        if user.check_password(password):
            return user
        return None

    @staticmethod
    def get_by_email(email):
        """
        Return a user instance or raise a NoResultFound exception
        """
        user = session.query(User).filter(User.email == email).first()
        if not user:
            raise NoResultFound("User with email %s does not exist" % (email))
        return user

    # Properties

    @property
    def get_full_address(self):
        """
        Return a full address for the user such as...
        123 Main Street, Columbus, Ohio, United States, 45796
        """
        return "%s, %s, %s, %s" % (self.get_street_and_city, self.state_or_province, self.country, self.zip_code)

    @property
    def get_street_and_city(self):
        """
        Return only the street address and city such as...
        123 Main Street, Columbus
        """
        return "%s, %s" % (self.street_address, self.city)
    
    @property
    def get_city_and_province(self):
        """
        Return only the city and state/province such as...
        Columbus, Ohio
        """
        return "%s, %s" % (self.city, self.state_or_province)

    @property
    def get_province_and_country(self):
        """
        Return only the state/province and country such as...
        Ohio, United States
        """
        return "%s, %s" % (self.state_or_province, self.country)

    # Field Validation -- Executes when setting fields
    
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
        if not city:
            raise AssertionError("City not provided")
        if len(city) < 3 or len(city) > 30:
            raise AssertionError("City must be between 3 and 30 characters")
        return city

    @validates('state_or_province')
    def validate_state_or_province(self, key, state_or_province):
        if not state_or_province:
            raise AssertionError("State or Province not provided")
        if len(state_or_province) < 5 or len(state_or_province) > 30:
            raise AssertionError("State or Province must be between 5 and 30 characters")
        return state_or_province

    @validates('country')
    def validate_country(self, key, country):
        if not country:
            raise AssertionError("Country not provided")
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
        return "<User(email='%s')>" % (self.email)

