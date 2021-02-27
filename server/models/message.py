
from datetime import datetime
from sqlalchemy import (
    Column, String,
    Integer, ForeignKey,
    Text, Boolean,
    DateTime
    )
from sqlalchemy.orm import relationship, validates
from models.base_model import Base, BaseModelMixin

class Message(Base, BaseModelMixin):
    """
    sender - The user that originally sent the message

    receiver - The user that the message was intended for
    
    file_url - In case we do need to have file sending, this
    can be used to store the url from s3

    content - The actual content of the message

    created_at - When the message was sent/created. This will
    not really be used except in the database/programatically
    for sorting/ordering to ensure proper display.
    Everywhere else, the return of 'get_formatted_date_time'
    will be used instead
    """
    __tablename__ = "message"

    id = Column(Integer, primary_key=True)
    receiver_id = Column(Integer, ForeignKey('user.id'))
    sender_id = Column(Integer, ForeignKey('user.id'))

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])
    file_url = Column(String)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

    @property
    def get_formatted_info(self):
        info = {}
        info['time'] = self.get_formatted_time
        info['date'] = self.get_formatted_date
        info['created_at'] = self.get_formatted_date_time
        return info

    @property
    def get_formatted_date_time(self):
        """
        Return an easily read date time in the format
        of 12:32pm 02/25/2021
        """
        return self.created_at.strftime("%H:%M%p %b/%d/%Y")
    
    @property
    def get_formatted_time(self):
        """
        Return only the time in the format of 12:59pm
        """
        return self.created_at.strftime("%H:%M%p")
    
    @property
    def get_formatted_date(self):
        """
        Return only the date in the format of 02/23/2021
        """
        return self.created_at.strftime("%b/%d/%Y")
