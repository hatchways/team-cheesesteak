import functools
import json
from sqlalchemy.orm.exc import NoResultFound
from flask import Blueprint as bp
from flask import (
    jsonify, request,
    session, url_for,
    g
)
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    create_refresh_token, get_jwt_identity,
    set_access_cookies, set_refresh_cookies,
    unset_jwt_cookies, verify_jwt_in_request
)
from models.user import User
from models.profile import Profile

auth_views = bp('auth', __name__, url_prefix="/auth")

def authenticate(view):
    @functools.wraps(view)
    def decorated_function(*args, **kwargs):
        response_dict = {}
        # First look for a user object
        if g.user is None:
            response_dict['status'] = 401
            response_dict['message'] = "You have to be logged in for that"
            return jsonify(response_dict), 401
        # Then validate the token
        try:
            # This will raise an error if the token
            # is not valid is some way
            verify_jwt_in_request()
        except:
            response_dict['status'] = 401
            response_dict['message'] = "Invalid token"
            return jsonify(response_dict), 401
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
        response_dict = {}
        user_info = {}
        for field in User.get_fields():
            if field == "id":
                continue
            if field == "password_hash":
                user_info['password'] = request_dict['password']
                continue
            if request_dict.get(field, None) != None:
                user_info[field] = request_dict[field]
        try:
            user = User.create(**user_info)
            # New profile info
            placeholder_info = {
                'name': "Not entered",
                'is_chef': False,
                "about_me": "Not entered",
                "profile_image": "No image uploaded",
                "favourite_recipe": "None yet,",
                "favourite_cuisine": "None yet,",
                "location": "Unknown Location"
            }
            profile = Profile.create(**placeholder_info)
            user.assign_one_to_one("profile", profile)
            # Since we're sending all the information back
            # to the front end, use the user_info dict as a
            # response dictionary
            user_info = user.to_dict(excludes=['profile', 'password_hash'])
            user_info['profile_id'] = user.profile.id
            email = user.email
            access_token = create_access_token(identity=email)
            refresh_token = create_refresh_token(identity=email)
            session['user_id'] = user.id
            # Put all information in a non nested dictionary
            # which will make it easier to get info in the frontend
            response_dict['status'] = 201
            response_dict['message'] = "Successfully created account!"
            response_dict['login'] = True
            response_dict['user'] = user_info
            response = jsonify(response_dict)
            # Set JWT cookies
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            return response, 200
        except AssertionError as e:
            response_dict['status'] = 401
            response_dict['message'] = "%s" % (e)
            # Validation problem
            return jsonify(response_dict), 401

@auth_views.route('/login', methods=['POST'])
def login():
    if request.method == "POST":
        response_dict = {}
        email = request.form['email']
        password = request.form['password']
        try:
            user = User.credentials_match(email, password)
            # User was found but password failed to match
            if not user:
                response_dict['status'] = 401
                response_dict['message'] = "Incorrect Password"
                return jsonify(response_dict), 401
            # Credentials are correct, continue
            # Clear the session for fresh data
            session.clear()
            access_token = create_access_token(identity=email)
            refresh_token = create_refresh_token(identity=email)
            # Build response
            user_dict = user.to_dict(excludes=['password_hash', "profile"])
            user_dict['profile_id'] = user.profile.id
            response_dict['user'] = user_dict
            session['user_id'] = user.id
            response_dict['status'] = 200
            response_dict['message'] = "Successfully Logged in"
            response = jsonify(response_dict), 200
            # Set JWT cookies
            set_access_cookies(response, access_token)
            return response
        except NoResultFound as e:
            response_dict['status'] = 401
            response_dict['message'] = "Incorrect Email"
            # User with the passed email was not found
            return jsonify(response_dict), 401
        except Exception as e:
            response_dict['status'] = 400
            response_dict['message'] = "An unknown error occured ERROR: %s" % (e)
            # In case something happens with user.to_dict()
            return jsonify(response_dict), 400

@auth_views.route('/logout')
def logout():
    # Build response
    response_dict = {'logout': True}
    response_dict['status'] = 200
    response_dict['message'] = "Successfully logged out"
    response = jsonify(response_dict)
    # Remove cookies and clear the session
    unset_jwt_cookies(response)
    session.clear()
    return response



@auth_views.route('/token/refresh')
@jwt_required(refresh=True)
def refresh_jwt_token():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    response_dict = {'refresh': True}
    response_dict['status'] = 200
    response = jsonify(response_dict)
    set_access_cookies(response, access_token)
    return response, 200
