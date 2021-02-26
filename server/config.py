import os

TEAM_NAME = os.environ['TEAM_NAME']
API_KEY = os.environ['API_KEY']
STRIPE_KEYS = {
    'publishable_key': os.environ['STRIPE_PUBLISHABLE_KEY'],
    'secret_key': os.environ['STRIPE_SECRET_KEY']
}

