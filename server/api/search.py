
import json
from flask import make_response, request, Blueprint
from models.recipe import Recipe
from models.profile import Profile
from .auth import authenticate
from db import session
search_views = Blueprint('search', __name__, url_prefix="/search")

@search_views.route("/cuisines/", methods=["GET"])
@authenticate
def search_cuisines():
    """
    Search for chefs or recipes based on GET parameters
    Return the proper info exampled in the mockup
    or give back an error
    """
    search_by = request.args.get('search_by')
    cuisine = request.args.get('cuisine')
    result = []
    response_dict = {}
    # Make sure values were passed
    if search_by != "recipe" and search_by != "chef":
        return {
            'status': 404,
            'message': "No filter was provided, select either 'by recipe' or 'by chef'" 
        }
    if cuisine not in Recipe.get_cuisines() or not cuisine:
        return {
            'status': 404,
            "message": "No cuisine was provided, please select a cuisine and try again"
        }
    # Start searching
    if search_by == "recipe":
        result = session.query(Recipe).filter(Recipe.cuisine==cuisine).all()
        if len(result) == 0:
            response_dict['message'] = "We didn't find any recipes that matched your desired cuisine, please try again!"
            response_dict['status'] = 404
            return response_dict
        for recipe in result:
            response_dict[str(recipe.id)] = {
                'name': recipe.name,
                'image_urls': recipe.get_image_url_list,
                'price': recipe.get_formatted_price,
                'chef_image': recipe.profile.profile_image,
                'chef_name': recipe.profile.name,
                'chef_location': recipe.profile.user.get_city_and_province
            }

    if search_by == "chef":
        # Get all profiles that contain at least one recipe that matches the given cuisine
        result = session.query(Profile).join(Profile.recipes).filter(Recipe.cuisine==cuisine).all()
        if len(result) == 0:
            response_dict['message'] = "We didn't find any chefs that have recipes with that cuisine, please try again!"
            response_dict['status'] = 404
            return response_dict
        for chef in result:
            response_dict[str(chef.id)] = {
                'name': chef.name,
                'location': chef.user.get_province_and_country,
                'specialty': chef.favourite_recipe,
                "about_me": chef.about_me
            }
    # All good, make the response and return
    response_dict['status'] = 200
    response = make_response(response_dict)
    return response

@search_views.route("/hi", methods=["GET"])
def hi():
    return {
        'message': "hello"
    }