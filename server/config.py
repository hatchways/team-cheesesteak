import os

API_KEY = os.environ['API_KEY']
STRIPE_KEYS = {
    'publishable_key': os.environ['STRIPE_PUBLISHABLE_KEY'],
    'secret_key': os.environ['STRIPE_SECRET_KEY']
}

