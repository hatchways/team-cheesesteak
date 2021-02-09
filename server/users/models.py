import re
from sqlalchemy import (
    Column, String,
    Integer, ForeignKey,
    Boolean, create_engine
    )
from sqlalchemy.orm import (
    relationship, sessionmaker,
    validates
    )
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.security import (
    generate_password_hash, check_password_hash
    )

# from .database.db import engine
from .utility import sqlalchemy_utils

# Base model the other model(s) will subclass
Base = declarative_base()

# Temporary engine for local testing
# To be replaced with actual engine
engine = create_engine("sqlite:///:memory:", echo=True)

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)

    # General Info
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    is_chef = Column(Boolean, default=False)

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
    profile = relationship("Profile", uselist=False, back_populates="user")

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
    def create(
            first_name, last_name,
            username, email,
            street_address, city,
            state_or_province, country,
            zip_code, is_chef,
            password
        ):
        """
        Create a new user in the database and return the newly created instance

        WARNING
        You MUST wrap a call to create() in a try/except
        This is because the validates() decorator will raise an AssertionError
        if one of the fields fails validation!

        Example
        try:
            new_user = User.create(<args>)
        except AssertionError as e:
            return {'message': f"Encountered the following error: {e}"}
        except:
            return {'message': "Uncaught exception"}
        """
        # Create a clean session
        session = sessionmaker(bind=engine)

        # Create user object
        user_instance = User(
            first_name, last_name,
            username, email,
            street_address, city,
            state_or_province, country,
            zip_code, is_chef
        )
        # Set the new instances password hash
        user_instance.set_password(password)

        # Add the new instance to pending SQL
        # Should automatically use the validation functions to validate fields
        session.add(user_instance)
        # Perform a query for the new user so the pending SQL
        # is committed and we get the newly created User
        user = session.query(User).filter(User.email == email).first()
        # Return the complete object
        return user

    @staticmethod
    def get_by_username(username):
        """
        Return a user instance or raise a NoResultFound exception
        """
        user = User.query.filter(User.username == username).first()
        if not user:
            raise NoResultFound(f"User with username {username} does not exist")
        return user

    @staticmethod
    def update(user_id, **new_info):
        """
        WARNING
        This will NOT work if updating a relationship.
        See the comments in the following SO post
        https://stackoverflow.com/questions/23152337/how-to-update-sqlalchemy-orm-object-by-a-python-dict

        Get a user object from the database matching the id
        then use the kwargs to update its fields
        """
        session = Session(bind=engine)
        user = session.query(User).get(user_id)
        for key, value in new_info.items():
            setattr(user, key, value)
        session.commit()

    @staticmethod
    def delete(user_id):
        """
        Retrieve and delete a user instance from the database
        Also delete any and all connections to and from the user
        """
        # get_instance() will raise a NoResultFound error if the user doesn't exist
        user = sqlalchemy_utils.get_instance(User, **{'id': user_id})
        session = Session(bind=engine)
        session.delete(user)
        session.commit()

    # Properties

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_address(self):
        """
        Return a full address for the user such as...
        123 Main Street, Columbus, Ohio, United States, 45796
        """
        return f"{self.street_and_city}, {self.state_or_province}, {self.country}, {self.zip_code}"

    @property
    def street_and_city(self):
        """
        Return only the street address and city such as...
        123 Main Street, Columbus
        """
        return f"{self.street_address}, {self.city}"
    
    @property
    def city_and_province(self):
        """
        Return only the city and state/province such as...
        Columbus, Ohio
        """
        return f"{self.city}, {self.state_or_province}"

    @property
    def province_and_country(self):
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
        if sqlalchemy_utils.instance_exists(User, **{'username': username}):
            raise AssertionError('Username is already in use')
        if len(username) < 5 or len(username) > 50:
            raise AssertionError('Username must be between 5 and 20 characters')
        return username
    
    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise AssertionError('No email provided')
        if sqlalchemy_utils.instance_exists(User, **{'email': email}):
            raise AssertionError("Email is already in use")
        if not re.match("[^@]+@[^@]+\.[^@]+", email):
            raise AssertionError('Provided email is not an email address')
        return email

    @validates('first_name')
    def validate_first_name(self, key, first_name):
        if not first_name or not first_name.is_alpha():
            raise AssertionError('First name not provided')
        if len(first_name) < 3 or len(first_name) > 50:
            raise AssertionError('First name must be between 3 and 50 characters')
        return first_name

    @validates('last_name')
    def validate_last_name(self, key, last_name):
        if not last_name or not last_name.is_alpha():
            raise AssertionError("Last name not provided")
        if len(last_name) < 3 or len(last_name) > 50:
            raise AssertionError('Last name must be between 3 and 50 characters')
        return last_name

    @validates('street_address')
    def validate_street_address(self, key, street_address):
        if not street_address:
            raise AssertionError("Street Address not provided")
        if len(street_address) < 10 or len(street_address) > 150:
            raise AssertionError("Street Address must be between 10 and 150 characters")
        return street_address

    @validates('city')
    def validate_city(self, key, city):
        if not city or not city.is_alpha():
            raise AssertionError("City not provided")
        if len(city) < 5 or len(city) > 30:
            raise AssertionError("City must be between 5 and 30 characters")
        return city

    @validates('state_or_province')
    def validate_state_or_province(self, key, state_or_province):
        if not state_or_province or not state_or_province.is_alpha():
            raise AssertionError("State or Province not provided or contains non alphabetical characters")
        if len(state_or_province) < 5 or len(state_or_province) > 30:
            raise AssertionError("State or Province must be between 5 and 30 characters")
        return state_or_province

    @validates('country')
    def validate_country(self, key, country):
        if not country or not country.is_alpha():
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

    def __repr__(self):
        return "<User(username='%s', fullname='%s')>" % (
            self.username, self.fullname)
