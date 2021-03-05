import os
import random
import string
from sqlalchemy import inspect
from sqlalchemy.ext.declarative import declarative_base
from models.user import User
from models.recipe import Recipe
from models.profile import Profile
from models.message import Message, Conversation
#from models.models import User, Profile, Recipe

def print_info(users, profiles, recipes):
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
    print(user_separator)
    for user in users:
        for field, value in user.items():
            print("%s: %s\n" % (field, value))
        print("\n\n")
    print(profile_separator)
    for profile in profiles:
        for field, value in profile.items():
            print("%s: %s\n" % (field, value))
        print("\n\n")
    print(recipe_separator)
    for recipe in recipes:
        for field, value in recipe.items():
            print("%s: %s\n" % (field, value))
        print("\n\n")
    print("\n\nCompleted creating objects\n\n")

# Seed script
def seed_database(debug=False):
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
    if debug:
        # If something happened during object creation
        # we'll get a UNIQUE CONSTRAINT FAILED error
        # when trying again so, delete all the records 
        # in the database and try to create the objects.
        # so we can preserve the existing tables
        from models.base_model import Base
        from db import engine
        for tbl in reversed(Base.metadata.sorted_tables):
            engine.execute(tbl.delete())

    # Create how ever many user and profile objects the user defined
    user_dicts =[
        {
            'street_address': "777 Brockton Avenue",
            'city': "Mishawaka",
            "state_or_province": "Indana",
            'country': "United States",
            'zip_code': "46545",
            'email': "deepSigh123@gmail.com",
            'password': "Testing123",
        },
        {
            'street_address': "777 Brockton Avenue",
            'city': "Abington",
            "state_or_province": "Massachusetts",
            'country': "United States",
            'zip_code': "01001",
            'email': "slayit@gmail.com",
            'password': "Testing123",
        },
        {
            'street_address': "30 Memorial Drive",
            'city': "Avon",
            'state_or_province': "Massachusetts",
            'country': "United States",
            'zip_code': "20194",
            'email': "foodgood@aol.com",
            'password': "Testing123"

        },
        {
            'street_address': "250 Hartford Avenue",
            'city': "Toronto",
            'state_or_province': "Ontario",
            'country': "Canada",
            'zip_code': "A1A 1A1",
            'email': "imAchef@food.org",
            'password': "Testing123"
        },
    ]
    profile_dicts = [
        {
            'name': "Alexander",
            'is_chef': True,
            'about_me': "I am nothing but a testing account, I do nothing, say nothing and see nothing....but food is indeed delicious",
            'location': "Mishawaka, United States",
            'profile_image': "https://images.unsplash.com/photo-1595347097560-69238724e7bd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            'favourite_recipe': "Shepherds Pie,",
            'favourite_cuisine': "french,"
        },
        {
            'name': "Giuseppe",
            "is_chef": True,
            "about_me": "I love to cook and have been doing so for 15 years. My specialty is Italian food",
            "location": "Massachusettes, United States",
            'profile_image': "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
            'favourite_recipe': "Spicy Pork Tenderloin with Apples and Sweet Potatoes",
            'favourite_cuisine': "italian,",
        },
        {
            'name': "Mario",
            "is_chef": False,
            'about_me': "I love food, if I could eat every hour of the day I would.",
            "location": "Massachusettes, United States",

            'profile_image': "https://images.unsplash.com/photo-1521341057461-6eb5f40b07ab?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            'favourite_cuisine': "thai,",
        },
        {
            'name': "Tessa",
            "is_chef": False,
            'about_me': "I'm not a chef but wish I was, I couldn't boil noodles without burning them!",
            "location": "Ontario, Canada",
            'profile_image': "https://images.unsplash.com/photo-1505999407077-7937810b98ae?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1188&q=80",
            'favourite_cuisine': "Mexican,"
        }
    ]

    recipe_dicts = [
        {
            'name': 'Spicy Pork Tenderloin with Apples and Sweet Potatoes',
            'description': "A spicy pork tenderloin with delicious green apples and sweet potatoes",
            'available': True,
            'cuisine': "french",
            'price': 1000,
            'ingredients': "Pork Tenderloin,Green Apples,Sweet Potatoes,Rosemary",
            'required_items': "Dinner Plate, Kitchen Table, Oven",
            'image_urls': "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8cG9yayUyMHRlbmRlcmxvaW58ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=60https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8cG9yayUyMHRlbmRlcmxvaW58ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=60,"
        },
        {
            'name': "Al's Burmese Chicken Curry",
            'description': "Chicken",
            'available': False,
            'cuisine': "indian",
            'price': 1000,
            'ingredients': "Pork Tenderloin,Green Apples,Sweet Potatoes,Rosemary",
            'required_items': "Dinner Plate,Kitchen Table,Oven",
            'image_urls': "https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHw%3D&auto=format&fit=crop&w=1000&q=60,"
        },
        {
            'name': "Sweet Potato and Venison Shepherd's Pie",
            'description': "Shepherds Pie stuffed with sweet potatoes and venison, cooked to golden perfection",
            'available': True,
            'cuisine': "french",
            'price': 2000,
            'ingredients': "Venison,Sweet potatoes,Gravy",
            'required_items': "Dinner Plate,Oven",
            'image_urls': "https://images.unsplash.com/photo-1600626336264-60ef2a55bd33?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NHx8c2hlcGhlcmRzJTIwcGllfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=60,"
        },
        {
            'name': "Gemelli Pasta with Roasted Pumpkin and Pancetta",
            "description": "Delicious pasta smothered in Pancetta with Roasted Pumpkin",
            'available': False,
            'cuisine': "italian",
            'price': 1500,
            'ingredients': "Roasted Pumpkin,Pasta,Pancetta",
            'required_items': "Large Pot,Stove,Dinner Table",
            'image_urls': "https://images.unsplash.com/photo-1579631542720-3a87824fff86?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80,"
        },
        {
            'name': "Beef Stroganoff with Ground Beef",
            'description': "Beef stroganoff filled with ground beef, served with a delicious buttery dinner roll",
            'available': True,
            'cuisine': "turkish",
            'price': 2500,
            'ingredients': "Ground Beef,Brown Gravy,Wide Egg Noodles,",
            'required_items': "Large Pot,Stove Top,Oven",
            'image_urls': "https://images.unsplash.com/photo-1504669221159-56caf7b07f57?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80,",
        },
    ]
    # Add latitude/longitude fields to the users
    for user in user_dicts:
        address_info = [
            user['street_address'],
            user['city'],
            user['state_or_province'],
            user['country'],
        ]
        full_address = " ,".join(address_info)
        geocode = User.get_geocode(full_address)
        user['latitude'] = geocode.get('lat')
        user['longitude'] = geocode.get('lng')

    conversations_info = []
    users = []
    conversations = []
    last_user = None
    for index in range(len(user_dicts)):
        new_user = User.create(**user_dicts[index])
            # Create profile     
        new_profile = Profile()
        new_profile = new_profile.create(**profile_dicts[index])

            # Assign the new profile to the new user
        new_user.assign_one_to_one('profile', new_profile)
        if last_user != None:
            conversations_info.append(
                {
                    'user_one': last_user,
                    'user_two': new_user
                }
            )
        if new_profile.is_chef:
            new_recipe = Recipe.create(**recipe_dicts[index])
                # Add the new recipe to the One to Many field in the Profile model
            new_profile.add_to_relationship('recipes', new_recipe)

        users.append(new_user)
        last_user = new_user
    
    # Create conversations and their messages
    conversations_info.append(
        {
            'user_one': users[-1],
            'user_two': users[0]
        }
    )
    for info in conversations_info:
        new_conversation = Conversation.create(**info)
        conversations.append(new_conversation)
    for conversation in conversations:
        user_one_message = Message.create(
            **{
                'sender': conversation.user_one,
                'content': "Hello %s how are you today?" % (conversation.user_two.profile.name)
            }
        )
        user_two_message = Message.create(
            **{
                'sender': conversation.user_two,
                'content': "I'm good how are you %s" % (conversation.user_one.profile.name)
            }
        )
        conversation.add_to_relationship('messages', user_one_message)
        conversation.add_to_relationship('messages', user_two_message)
    # Debug loop
    for conversation in conversations:
        print(
            "\n\nConversation between",
            conversation.user_one, conversation.user_two,"\n",
            "conversation id:", conversation.id,"\n",
            "Messages in conversation:", conversation.messages,"\n"
        )
    print_info(user_dicts, profile_dicts, recipe_dicts)