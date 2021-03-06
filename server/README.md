# Seeding Your Database with seed_database()

### Setup
1. Download/Setup postgres and run the service
	i) For Mac: https://postgresapp.com/downloads.html
	ii) For PC: https://www.postgresql.org/download/windows/
2. setup Path: sudo mkdir -p /etc/paths.d && echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
3. create your database and ensure you have your credentials (i.e username, password, port, database name)
### Running The Script
To run the script, navigate to the server directory then open a python shell with ```pipenv run python```. If you do not have any tables in your database/have not ran ```Base.metadata.create_all(engine)``` you must follow steps 1-4, otherwise start from step 5
1. Import the declarative base with ```from models.base_model import Base``` (see below for more information about why it MUST be imported from models.base_model)
2. Import all the models so they get added to the metadata in the declarative base with ```from models import user, profile, recipe```
3. Import the engine ```from db import engine```
4. Create your tables ```Base.metadata.create_all(engine)```
5. Import the script ```from seed import seed_database```
6. Run the script ```seed_database()``` 
This will create 3 users, 3 profiles and 3 recipes. Each user will have one profile in the profile field and each profile will have one recipe in the recipes field.

### Import Base ONLY from models.base_model
You MUST import Base (declarative_base) from models.base_model because Base will take any classes that subclass that specific instance and add them to its metadata. If you don't already have existing tables and don't import Base from models.base_model then try to run ```seed_database()```, you WILL get an error.

### Output
After all objects are created in the database, this will print out all the data that was used to create the instances so you can use it in any search functions you may create or any other areas that need testing.
Here's an example of the output (shortened)

=========Users=========<br>
id: 37<br>
username: imAchef<br>
email: imAchef@gmail.com<br>
zip_code: 45698<br>
<br>
<br>
=========Profiles=========<br>
id: 37<br>
user_id: 38<br>
name: Alexander<br>
is_chef: True<br>
<br>
<br>
=========Recipes=========<br>
id: 91<br>
profile_id: 37<br>
name: Roasted Potatoes with Barbeque Chicken<br>
cuisine: moroccan<br>
price: 43700<br>
<br>
id: 92<br>
profile_id: 37<br>
name: Some moroccan meal<br>
cuisine: moroccan<br>
price: 43700<br>
<br>
