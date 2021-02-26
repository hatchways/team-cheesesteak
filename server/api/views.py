from flask import (    
    request, jsonify
)
from models.recipe import Recipe
from models.user import User
from models.profile import Profile
from app import app
from auth import authenticate

@app.route("/recipe/create/", methods=["POST"])
@authenticate
def create_recipe(**kwargs):
    request_dict = request.get_json()
    recipe_info = {}
    response_dict = {'recipe': {}}
    for field in Recipe.get_fields():
        if request_dict.get(field, None) != None:
            recipe_info[field] = request_dict.get(field)
    try:
        recipe = Recipe.create(**recipe_info)
        kwargs['user'].profile.add_to_relationship('recipes', recipe)
        response_dict['recipe'] = recipe.to_dict(excludes=[
            'profile',
            'profile_id',
            'price',
            'ingredients',
            'required_items',
            'image_urls'
        ])
        for field, value in recipe.get_formatted_info():
            response_dict['recipe'][field] = value
        response_dict['status'] = 200
        response_dict['message'] = "Successfully created recipe"
        return jsonify(response_dict), 201
    except AssertionError as e:
        response_dict['status'] = 400
        response_dict['message'] = "%s" % (e)
        # Validation problem
        return jsonify(response_dict), 400
    

@app.route("/recipe/edit", methods=["PUT"])
def edit_recipe(recipe_id):    
    request_dict = request.get_json()
    recipe_id = request_dict.get('recipe_id')
    recipe_info = {'recipe': {}}
    response_dict = {}
    for field in Recipe.get_fields():
        if request_dict.get(field, None) != None:
            recipe_info[field] = request_dict.get(field)
    try:
        Recipe.update(recipe_id,**recipe_info)
        recipe = Recipe.get_instance(**{'id', recipe_id})
        response_dict['recipe'] = recipe.to_dict(excludes=[
            'profile',
            'profile_id',
            'price',
            'ingredients',
            'required_items',
            'image_urls'
        ])
        for field, value in recipe.get_formatted_info():
            response_dict['recipe'][field] = value
        response_dict['status'] = 200
        response_dict['message'] = "Successfully updated recipe"
        return jsonify(response_dict), 200
    except AssertionError as e:
        # Validation problem
        response_dict['status'] = 400
        response_dict['message'] = "%s" % (e)
        return jsonfiy(response_dict), 400

@app.route("/recipe/delete", methods=["DELETE"])
@authenticate
def delete_recipe(**kwargs):
    response_dict = {}
    recipe_id = request.get_json().get('recipe_id')
    try:
        recipe = Recipe.get_instance(**{'id': recipe_id})
        kwargs['user'].profile.remove_from_relationship('recipes', recipe)
        Recipe.delete(recipe_id)
        response_dict['status'] = 200
        response_dict['message'] = "Recipe successfully deleted"
        return jsonify(response_dict), 200
   except AssertionError as e:
       response_dict['status'] = 400
       response_dict['message'] = "%s" % (e)
       return jsonify(response_dict), 400


# The following 2 endpoints could possibly be
# merged into one. This depends on the front
# end design when it comes to editing information
@app.route("/user/edit",methods=["PUT"])
@authenticate
def edit_user():
    """
    I'm not sure if I need to return the updated
    information or not. The front end can use the
    given values to udpate the display as long 
    as the status is 200. If the front end will
    re-render, this is not a concern. Otherwise 
    this needs to return a new user information dictionary
    """
    request_dict = request.form.to_dict()
    user_info = {}
    for field in User.get_fields():
        if request_dict.get(field, None) != None:
            user_info[field] = request_dict.get(field)
    try:
        User.update(user.id,**user_info)
        # An updated user information dictionary will
        # be returned on next re-render
        response_dict['status'] = 200
        response_dict['message'] = "Successfully updated information"
        return jsonify(response_dict), 200
    except AssertionError as e:
        # Validation problem
        response_dict['status'] = 400
        response_dict['message'] = "%s" % (e)
        return jsonify(response_dict), 400

@app.route('/profile/edit', methods=["PUT"])
@authenticate
def edit_profile(**kwargs):
    response_dict = {}
    request_dict = request.get_json()
    new_info = {}
    for field in Profile.get_fields():
        if request_dict.get(field, None) != None:
            new_info[field] = request_dict.get(field)
    try:
        Profile.update(user.profile.id, **new_info)
        response_dict['status'] = 200
        response_dict['message'] = "Successfully updated profile"
        return jsonify(response_dict), 200
    except AssertionError as e:
        response_dict['status'] = 400
        response_dict['message'] = "%s" % (e)
        return jsonify(response_dict), 400
