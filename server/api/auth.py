import functools
import json
from sqlalchemy.orm.exc import NoResultFound
from flask import Blueprint as bp
from flask import (
    make_response, redirect,
    request, session,
    url_for, g
)
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, set_access_cookies,
    set_refresh_cookies, unset_jwt_cookies,
    jwt_optional, verify_jwt_in_request
)
from models.user import User

auth_views = bp('auth', __name__, url_prefix="/auth")

def authenticate(view):
    @functools.wraps(view)
    def decorated_function(*args, **kwargs):
        # First look for a user object
        if g.user is None:
            return {
                "status": 401,
                "message": "You have to be logged in for that"
            }
        # Then validate the token
        try:
            # This will raise an error if the token
            # is not valid is some way
            verify_jwt_in_request()
        except:
            return {
                'status': 401,
                'message': "Invalid Token"
            }
        return view(*args, **kwargs)
    return decorated_function

@auth_views.before_app_request
def load_logged_in_user():
    user_id = session.get("user_id", None)
    if user_id is not None:
        g.user = User.get_instance(**{'id': user_id})
    else:
        g.user = None

@auth_views.route("/signup", methods=["POST"])
def signup():
    if request.method == "POST":
        request_dict = request.form.to_dict()
        user_info = {}
        for field in User.get_fields():
            if field == "id":
                continue
            if field == "password_hash":
                user_info['password'] = request_dict['password']
                continue
            user_info[field] = request_dict[field]
        try:
            user = User.create(**user_info)
            # Since we're sending all the information back
            # to the front end, use the user_info dict as a
            # response dictionary
            username = user_info['username']
            access_token = create_access_token(identity=username)
            refresh_token = create_refresh_token(identity=username)
            session['user_id'] = user.id
            # Put all information in a non nested dictionary
            # which will make it easier to get info in the frontend
            user_info['status'] = 201
            user_info['message'] = "Successfully created account!"
            user_info['login'] = True
            response = make_response(user_info)
            # Set JWT cookies
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            return response
        except AssertionError as e:
            # Validation problem
            return {
                'status': 401,
                'message': "%s" % (e)
            }

@auth_views.route('/login', methods=['POST'])
def login():
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
            # Clear the session for fresh data
            session.clear()
            access_token = create_access_token(identity=username)
            refresh_token = create_refresh_token(identity=username)
            # Build response
            response_dict = user.to_dict(excludes=['password_hash'])
            session['user_id'] = user.id
            response_dict['status'] = 200
            response_dict['message'] = "Successfully Logged in"
            response = make_response(response_dict)
            # Set JWT cookies
            set_access_cookies(response, access_token)
            return response
        except NoResultFound as e:
            # User with the passed username was not found
            return {
                'status': 401,
                'message': "Incorrect Username"
            }
        except Exception as e:
            # In case something happens with user.to_dict()
            return {
                'status': 400,
                'message': f"An unknown error occured ERROR: {e}"
            }

@auth_views.route('/logout')
def logout():
    # Build response
    response_dict = {'logout': True}
    response_dict['status'] = 200
    response_dict['message'] = "Successfully logged out"
    response = make_response(response_dict)
    # Remove cookies and clear the session
    unset_jwt_cookies(response)
    session.clear()
    return response


@auth_views.route('/token/refresh')
@jwt_refresh_token_required
def refresh_jwt_token():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    response = {'refresh': True}
    set_access_cookies(response, access_token)
    response['status'] = 200
    return response
