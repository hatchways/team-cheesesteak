"""
Auth views
"""
import functools
from sqlalchemy.orm.exc import NoResultFound
from flask import (
    Bluprint, g,
    redirect, request,
    session, url_for
)
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, set_access_cookies,
    set_refresh_cookies, unset_jwt_cookies
)
from models.user import User

auth_views = Bluprint('auth', __name__, url_prefix="/auth")

@auth_views.register("/signup", methods=["POST"])
def signup():
    """
    Add JWT logic
    """
    if request.method == "POST":
        username = request.json.get('username')
        password = request.json.get('password')
        email = request.json.get('email')
        street_address = request.json.get('street_address')
        city = request.json.get('city')
        state_or_province = request.json.get("state_or_province")
        country = request.json.get("country")
        zip_code = request.json.get("zip_code")
        try:
            user = User.create(**{
                'username': username,
                'password': password,
                'email': email,
                'street_address': street_address,
                'city': city,
                'state_or_province': state_or_province,
                'country': country,
                'zip_code': zip_code
                })
            # Put all information in a non nested dictionary
            # which will make it easier to get info in the frontend
            resp = user.to_dict(excludes=['password_hash'])
            resp['status'] = 200
            resp['message'] = "Successfully created account!"
            return resp

        except AttributeError as e:
            print("DEBUG server/api/auth --> signup(). Got error %s during user creation" % (e))
            return {
                'status': 401,
                'message': "Error: %s" % (e)
            }
        except:
            return {
                'status': 400,
                'message': "An unknown error occurred"
            }

@auth_views.route('/login', methods=['POST'])
def login():
    """
    TODO Add JWT logic
    """
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        try:
            user = User.credentials_match(username, password)
            # User was found but password failed to match
            if not user:
                return {
                    'status': 401,
                    'message': "Incorrect Password"
                }
            # Credentials are correct, continue
            session.clear()
            session['user_id'] = user['id']
            resp = user.to_dict(excludes=['password_hash'])
            resp['status'] = 200
            resp['message'] = "Successfully Logged in"
            # Set JWT
            return resp
        except NoResultFound as e:
            print("DEBUG server/api/auth --> login(). Got error %s during user creation" % (e))

            # User with the passed username was not found
            return {
                'status': 401,
                'message': "Incorrect Username"
            }
        except:
            return {
                'status': 400,
                'message': "An unknown error occured"
            }

@auth_views.before_app_request
def load_logged_in_user():
    """
    TODO Add JWT
    """
    user_id = session.get("user_id")
    if user_id is None:
        g.user = None
    else:
        g.user = User.get_instance(**{'id': user_id})

@auth_views.route('/logout')
def logout():
    """
    TODO Flush JWT
    """
    session.clear()
    return {
        'status': 200,
        'message': 'Successfully Logged Out'
    }

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return {
                'status': 401,
                'message': "You must be logged in to do that"
            }
        return view(**kwargs)
    return wrapped_view
