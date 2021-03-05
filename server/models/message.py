
from datetime import datetime
from sqlalchemy import (
    Column, String,
    Integer, ForeignKey,
    Text, Boolean,
    DateTime, and_
    )
from sqlalchemy.orm import relationship, validates
from models.base_model import Base, BaseModelMixin
from db import session

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
    # Foreign Keys
    conversation_id = Column(Integer, ForeignKey("conversation.id"))
    sender_id = Column(Integer, ForeignKey('user.id'))
    # Relationships
    sender = relationship("User", foreign_keys=[sender_id])

    file_url = Column(String)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

    @property
    def receiver(self):
        return self.conversation.get_other_user(self.sender)

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


class Conversation(Base, BaseModelMixin):
    """
    An intermediary table to not only make it easier
    to get messages in a conversation between two users
    but also *probably* speed up query times
    """
    __tablename__ = "conversation"

    id = Column(Integer, primary_key=True)
    user_one_id = Column(Integer, ForeignKey('user.id'))
    user_two_id = Column(Integer, ForeignKey('user.id'))

    user_one = relationship("User", foreign_keys=[user_one_id])
    user_two = relationship("User", foreign_keys=[user_two_id])

    # Ensure a consistent order. Order being descending dates
    messages = relationship(
        "Message",
        backref="conversation",
        cascade="all, delete-orphan",
        order_by="desc(Message.created_at)"
    )

    def get_other_user(self, first_user):
        """
        Get the other user in this conversation
        This also works for getting the receiver of a message
        """
        if first_user.id != self.user_one.id:
            return self.user_one
        elif first_user.id != self.user_two.id:
            return self.user_two

    @staticmethod
    def get_conversation(first_user, second_user):
        users = [first_user, second_user]
        conversation = session.query(Conversation).filter(and_(Conversation.user_one.in_(users), Conversation.user_two.in_(users))).first()
        # If the first query found nothing, attempt the inverse
        if conversation == None:
            raise NoResultFound("Failed to find conversation between %s and %s" % (first_user, second_user))
        return conversation

    @staticmethod
    def conversation_exists(first_user, second_user):
        try:
            conversation = Conversation.get_conversation(first_user, second_user)
            return True
        except NoResultFound:
            return False
