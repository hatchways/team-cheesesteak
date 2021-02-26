
import json
import smtplib
import requests
import stripe
from flask import jsonify, request, Blueprint
from api.auth import authenticate
from config import STRIPE_KEYS

stripe_handler = Blueprint('stripe_handler', __name__)

# Stripe Setup
stripe.api_key = STRIPE_KEYS['secret_key']

@stripe_handler.route('/charge', methods=['POST'])
@authenticate
def charge(**kwargs):
    user = kwargs['user']

    # Amount in cents: Stripe expects charges in cents
    amount = 450

    # create a stripe customer object
    # stripe token is a auto generated from the stripe form in the frontend
    customer = stripe.Customer.create(
        email=user.email,
        source=request.form['stripeToken']
    )

    # create a charge object via stripe
    charge = stripe.Charge.create(
        customer=customer.id,
        amount=amount,
        currency='usd',
        description='Flask Charge'
    )

    return jsonify({'response': {''}, 'status': 200}), 200