# Seeding Your Database with seed_database()
### Running The Script
To run the script, navigate to the server directory then open a python shell. If you do not have any tables in your database/have not ran ```Base.metadata.create_all(engine)``` you must follow steps 1-3, otherwise start from step 4
1. Import the declarative base with ```from models.models import Base``` (see below for more information about why it MUST be imported from models.models)
2. Import the engine ```from db import engine```
3. Create your tables ```Base.metadata.create_all(engine)``
4. Import the script ```from seed import seed_database```
5. Run the script with ```seed_database()``` 

You may pass any number into the parenthesis and the script will create the number of users and profiles that you entered. Recipes are generated based on whether or not the current user being created is a chef, which is True for every other user it creates, so if you pass 4 to the script, 2 of them will be chefs, each with 5 recipe objects associated with their profiles.

### Import Base ONLY from models.models
You MUST import Base (declarative_base) from models.models because it will take any classes that subclass that specific instance and add them to its metadata. If you don't already have existing tables and don't import Base from models.models then try to run the ```seed_database()``` script, you WILL get an error. This (and circular imports) are why all of the models are now located in models.models.

### Input and Output (I/O)
When you call the script in your python shell you can tell it how many Profile and User objects to create by simply passing it a number as the only argument. If you give the script a 5 (i.e ```seed_database(5)```) it will create 5 Users, 5 Profiles and about 12 recipe objects. It loops however many times you told it to (which defaults to 5) and for every loop, it creates one user, then one profile, after that it will connect those two and, if the user is a chef, it will create 5 Recipe objects that will be put into the Profile.recipes field. You'll see a bunch of SQL commands in your terminal, you should be able to stop this by changing ```engine = create_engine(db_string, echo=True)``` to ```engine = create_engine(db_string, echo=False)``` in the engine variable in db.py, if you want to.
Something worth noting is that some of the recipes will have ```available=False``` which will let us filter recipes based on availability to be sure that the filtering works.

After all the objects are created and linked with the appropriate parent objects, the script will start writing the data you might need to test something to a text file called "seeded_objects_info.txt"; This way you can test anything you need to, drop your database then repopulate it in just a few seconds if you need to, and this will make sure we have enough objects to test our pagination should we be using it.
If you want to save the generated text files from previous runs, either change the code to make a new file/append to the old one or you can copy the old file and, once the script finishes, paste it back in because this will overwrite the old file that contains the data generated for the objects.

Here's an example of the output (if you only wanted one user and profile)

=========Users=========
id: 37
username: sprlsJFvmEfvRVNIkjNA
email: AZhbWwqfxA@gmail.com
zip_code: 45698


=========Profiles=========
id: 37
user_id: 38
name: wxbCSWaIDWstJTl
is_chef: True


=========Recipes=========
id: 91
profile_id: 37
name: XGzwPTgIQyuvUenKRYOyVoRsz
cuisine: moroccan
price: 43700


id: 92
profile_id: 37
name: ziFzIVfvIFDVDpgiVzSBIJsxX
cuisine: moroccan
price: 54500


id: 93
profile_id: 37
name: OKWVDsqsdxznQmTyfLRIRqTGl
cuisine: spanish
price: 67700


id: 94
profile_id: 37
name: DKaKJxYErixqzkDSoUoPagYDQ
cuisine: indian
price: 71300


id: 95
profile_id: 37
name: puJLpqXifGkDiqrEeLCsTCMOB
cuisine: moroccan
price: 86500


id: 96
profile_id: 37
name: cyYazQVMfVjjVbBSiMPZFOxhA
cuisine: indian
price: 69300
