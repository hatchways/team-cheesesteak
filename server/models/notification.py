from datetime.datetime import now, strftime
from sqlalchemy import (
    Column, String,
    Integer, ForeignKey,
    Text, Boolean,
    DateTime
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

class Notification(Base, BaseModelMixin):
    """
    Notes on fields
    message - The message to be displayed to the user. Restricted to
    150 characters to keep notifications consistent for styling.

    notif_type - The type of notification this is such as 'new request',
    'new message', etc. this can also help us if we want to style different
    notifications differently or handle the different types differently

    created_at - The time that this notification was created. This is
    auto-populated with datetime.now(). Mainly we will only be using
    the 'get_date_time' method so it's easier to read for the user
    WARNING - using now() in the default arg *may* cause issues but is 
    a very easy fix.

    read - Indicates if the user has viewed the notification or not

    get_date_time - Returns a human readable version of the date time
    In the format of '12:23pm 02/23/2021
    """
    __tablename__ = "notification"
    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("user.id"))
    message = Column(String(150), nullable=False)
    # Generic link between objects
    related_id = Column(Integer)
    notif_type = Column(String(60), nullable=False)
    # This may cause problems so it will need tested before
    # being used
    created_at = Column(DateTime, default=now)
    read = Column(Boolean, default=False)

    def get_date_time(self):
        """
        Return an easily read date time
        """
        return self.created_at.strftime("%H:%M%p %b/%d/%Y")
