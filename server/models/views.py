from flask import (    
    request, make_response, 
)
from models.recipe import Recipe
from models.user import User
from models.profile import Profile


@app.route("/recipe/add/", methods=["POST"])
def add_recipe(chef_id):
    if request.method == "POST":
        request_dict = request.form.to_dict()
        recipe_info = {}
        for field in Recipe.get_fields():
            if request_dict.get(field, None) != None:
                if field =='price':
                    recipe_info[field]= request_dict.get(field)/100
                else:
                    recipe_info[field] = request_dict.get(field)
        try:
            recipe = Recipe.create(**recipe_info)
            response_dict = recipe.to_dict(excludes=['chef_profile_id', 'chef_profile', 'ingredients', 'required_items', 'image_urls'])
            response_dict['price'] = recipe.get_formatted_price
            response_dict['image_urls'] = recipe.get_image_url_list
            response_dict['ingredients'] = recipe.get_ingredients_list
            response_dict['required_items'] = recipe.get_utensil_list
            
            response = make_response(response_dict,201)
            return response
        except AssertionError as e:
            # Validation problem
            return {
                'status': 401,
                'message': "%s" % (e)
            }
        

@app.route("/recipe/edit/<int:recipe_id>", methods=["POST"])
def edit_recipe(recipe_id):
    if request.method == "POST":
        request_dict = request.form.to_dict()
        recipe_info = {}
        for field in Recipe.get_fields():
            if request_dict.get(field, None) != None:
                recipe_info[field] = request_dict.get(field)
        try:
            Recipe.update(recipe_id,**recipe_info)
            return{
            'status': 201,
            'message': "Recipe updated successfully."
        }
        except AssertionError as e:
            # Validation problem
            return {
                'status': 401,
                'message': "%s" % (e)
            }

@app.route("/recipe/delete/<int:recipe_id>", methods=["GET"])
def delete_recipe(recipe_id):
    try:
        Recipe.delete(recipe_id)
        return{
            'status': 201,
            'message': "Recipe deleted successfully."
        }
    except AssertionError as e:
            # Validation problem
            return {
                'status': 401,
                'message': "%s" % (e)
            }

@app.route("/user/edit/<int:user_id>",methods=["POST"])
def edit_user(user_id):
    if request.method == "POST":
        request_dict = request.form.to_dict()
        user_info = {}
        for field in User.get_fields():
            if request_dict.get(field, None) != None:
                user_info[field] = request_dict.get(field)
        try:
            User.update(user_id,**user_info)
            return{
            'status': 201,
            'message': "User details updated successfully."
        }
        except AssertionError as e:
            # Validation problem
            return {
                'status': 401,
                'message': "%s" % (e)
            }