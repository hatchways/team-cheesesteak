
import stripe
import json
from flask import jsonify, request, Blueprint
from api.auth import authenticate
from config import STRIPE_KEYS
from models.user import User

stripe_handler = Blueprint('stripe_handler', __name__)

# Stripe Setup
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/account/apikeys
stripe.api_key = "sk_test_51IP9dfI01HW2iopN0ind3403WkPZd1RaFF2WDaQP2Au2QPa7FfPhXlq2fXOvizqHjKoJ0rdggL8khdUj36OS2NFA00BStOvs0a"
# YOUR_DOMAIN = 'http://localhost:3000/checkout'


@stripe_handler.route('/checkout', methods=['POST'])
@authenticate
def checkout(**kwargs):
	post_data = json.loads(request.get_data())
	price = post_data['price']
	user = kwargs['user']
	currency = 'usd'
	customer = stripe.Customer.create()

	intent = stripe.PaymentIntent.create(
		amount=price,
		currency=currency,
		customer=customer['id'],
		receipt_email=user.email
	)

	#add customerID to the customer table

	return jsonify(client_secret=intent.client_secret), 200


	# try:
	# 	checkout_session = stripe.checkout.Session.create(
	# 		payment_method_types=['card'],
	# 		line_items=[
	# 			{
	# 				'price': 'price_1IQaZyI01HW2iopNgAlbISvy',
	# 				'quantity': 1,
	# 			},
	# 		],
	# 		mode='payment',
	# 		success_url=YOUR_DOMAIN + '?success=true',
	# 		cancel_url=YOUR_DOMAIN + '?canceled=true'
	# 	)
	# 	return jsonify({'id': checkout_session.id})
	# except Exception as e:
	# 	return jsonify(error=str(e)), 403