# Seeding Your Database with seed_database()

### Setup
1. Download/Setup postgres and run the service
	i) For Mac: https://postgresapp.com/downloads.html
	ii) For PC: https://www.postgresql.org/download/windows/
2. setup Path: sudo mkdir -p /etc/paths.d && echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
3. create your database and ensure you have your credentials (i.e username, password, port, database name)
### Running The Script
To run the script, navigate to the server directory then open a python shell with ```pipenv run python```. If you do not have any tables in your database/have not ran ```Base.metadata.create_all(engine)``` you must follow steps 1-3, otherwise start from step 4
1. Import the declarative base with ```from models.base_model import Base``` (see below for more information about why it MUST be imported from models.base_model)
2. Import the engine ```from db import engine```
3. Create your tables ```Base.metadata.create_all(engine)``
4. Import the script ```from seed import seed_database```
5. Run the script ```seed_database()``` 
This will create 3 users, 3 profiles and 3 recipes. Each user will have one profile in the profile field and each profile will have one recipe in the recipes field.

### Import Base ONLY from models.base_model
You MUST import Base (declarative_base) from models.base_model because Base will take any classes that subclass that specific instance and add them to its metadata. If you don't already have existing tables and don't import Base from models.base_model then try to run ```seed_database()```, you WILL get an error.

### Output
After all objects are created in the database, this will print out all the data that was used to create the instances so you can use it in any search functions you may create or any other areas that need testing.
Here's an example of the output (shortened)

=========Users=========
id: 37
username: imAchef
email: imAchef@gmail.com
zip_code: 45698


=========Profiles=========
id: 37
user_id: 38
name: Alexander
is_chef: True


=========Recipes=========
id: 91
profile_id: 37
name: Roasted Potatoes with Barbeque Chicken
cuisine: moroccan
price: 43700
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
