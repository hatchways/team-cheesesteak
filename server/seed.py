import os
import random
import string
from sqlalchemy import inspect
from sqlalchemy.ext.declarative import declarative_base
from models.models import User, Profile, Recipe

def write_fields_to_file(users, profiles, recipes):
    """
    WARNING: This WILL overwrite the data in the
    'seeded_objects_info.txt' file if one already exists!

    Use the Model.to_dict() method to write some fields
    that are likely to be used in searches and other
    testing so we can use these instances instead of
    creating them by hand

    This will write the 'seeded_objects_info.txt' file
    to the directory this is located in so, be sure
    to add it to your .gitignore!
    """
    user_separator = "=========Users=========\n"
    profile_separator = "\n=========Profiles=========\n"
    recipe_separator = "\n=========Recipes=========\n"
    user_fields = ['id', 'username', 'email', 'zip_code']
    profile_fields = ['id','user_id', 'name', 'is_chef']
    recipe_fields = ['id', 'profile_id', 'name', 'cuisine', 'price']
    with open("seeded_objects_info.txt", "w") as info:
        info.write(user_separator)
        for user in users:
            for field, value in user.to_dict(includes=user_fields).items():
                info.write("%s: %s\n" % (field, value))
            info.write("\n\n")
        info.write(profile_separator)
        for profile in profiles:
            for field, value in profile.to_dict(includes=profile_fields).items():
                info.write("%s: %s\n" % (field, value))
            info.write("\n\n")
        info.write(recipe_separator)
        for recipe in recipes:
            print("Writing recipe", recipe, "\n\n")
            for field, value in recipe.to_dict(includes=recipe_fields).items():
                info.write("%s: %s\n" % (field, value))
            info.write("\n\n")
    print("\n\nCompleted creating objects and writing information to seeded_objects_info.txt\n\n")

# Seed script
def seed_database(num_of_instances=5):
    """
    WARNING: This will NOT create the tables for you if you
    dropped your entire database. You must re-create the database
    then run 'Base.metadata.create_all(<engine>)' to create your
    tables then you can run this without an issue!

    IMPORTANT: You need to import Base from models.models or else
    SQLAlchemy won't know about the models and therefore will NOT
    create the proper tables in your database which will cause this
    function to fail.

    Create data in the database by randomly generating values.
    Once this function is complete, it will write data that is
    likely to be used in testing to the 'seeded_objects_info.txt'
    file with separators and linebreaks to make it easier to read.

    When a user instance is created, its subsequent Profile is created
    as well and then they are associated with one another.
    After the user and profile objects are created, create some recipe
    objects to be associated with the profile object. Leave some profile
    objects without any recipes for filter testing.
    """

    # Helper functions
    def random_value(value_type, length, is_price=False, is_password=False):
        """
        Create random values to fill out the data for the random models
        """
        if is_price:
            return random.randint(300, 1000)
        elif value_type == "int":
            return random.randint(0,length)
        elif is_password:
            # Everyone gets the same password
            return "AbcdE123"
        elif value_type == "str":
            # make a string of the given length and return
            letters = string.ascii_letters
            return "".join(random.choice(letters) for letter in range(length))
    def generate_email():
        return random_value("str", 10)+"@gmail.com"

    users = []
    profiles = []
    recipes = []
    is_chef = False
    # Create how ever many user and profile objects the user defined
    for i in range(num_of_instances):

        # Create user
        new_user = User.create(**{
            'street_address': random_value('str', 16),
            'city': random_value('str', 10),
            'state_or_province': random_value('str', 15),
            'country': random_value('str', 10),
            'zip_code': "45698",
            'username': random_value('str', 20),
            'email': generate_email(),
            # The first two args don't actually matter when is_password=True
            'password': random_value("str", 15, is_password=True)
            })
        users.append(new_user)

        # Create profile     
        new_profile = Profile()
        new_profile = new_profile.create(**{
            'name': random_value('str', 15),
            'is_chef': is_chef,
            'about_me': random_value('str', 50),
            'profile_image': random_value('str', 12),
            'favourite_cuisine': random.choice(Recipe.get_cuisines()),
            "location": random_value('str', 20),
        })
        profiles.append(new_profile)

        # Assign the new profile to the new user
        new_user.assign_one_to_one('profile', new_profile)
        # Make some users normal, i.e no recipes
        if not is_chef:
            is_chef = True
            continue
        # Create 5 recipes for each user/profile
        for j in range(0,6):
            # For filter testing
            if i % 3 == 1:
                is_available = False
            else:
                is_available = True
            # Generate random lists
            random_items = [random.choice(string.ascii_letters) for x in range(6)]
            random_ingredients = [random.choice(string.ascii_letters) for x in range(6)]
            random_urls = [random.choice(string.ascii_letters) for x in range(6)]
            new_recipe = Recipe.create(**{
                'name': random_value('str', 25),
                'description': random_value('str', 50),
                'available': is_available,
                'cuisine': random.choice(Recipe.get_cuisines()),
                'price': random_value("str", 10, is_price=True),
                'ingredients': ",".join(random_ingredients),
                'required_items': ",".join(random_items),
                'image_urls': ",".join(random_urls)
            })
            recipes.append(new_recipe)
            # Add the new recipe to the One to Many field in the Profile model
            new_profile.add_to_relationship('recipes', new_recipe)
        if is_chef:
            is_chef = False
    write_fields_to_file(users, profiles, recipes)
