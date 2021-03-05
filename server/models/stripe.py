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
from config import API_KEY
from handlers.GoogleAPIHandler import GoogleAPIHandler
import requests


class Stripe(Base, BaseModelMixin):
	__tablename__ = "stripe"
	id = Column(Integer, primary_key=True)
	stripe_id = Column(Integer, default=0)
	user_id = Column(Integer, ForeignKey('user.id'))

	#card info
	stripe_customer_id = Column(Integer, default=0)
	card_number = Column(String(16), default='4242424242424242')
	card_expiry = Column(String(4), default='0424')
	card_ccv = Column(String(3), default='117')

	@property
	def get_card_info(self):
		"""
		Return a full address for the user such as...
		123 Main Street, Columbus, Ohio, United States, 45796
		"""
		return self.card_number, self.card_expiry, self.card_ccv

	@property
	def get_customer_id(self):
		"""
		Return a full address for the user such as...
		123 Main Street, Columbus, Ohio, United States, 45796
		"""
		return self.stripe_id

	def __repr__(self):
		return "<Stripe(stripe_id='%s')>" % (self.stripe_id)