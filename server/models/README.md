# BaseModelMixin
### Usage

#### Adding BaseModelMixin to your model
To use the BaseModelMixin, import it from base_model.py and add it to your class definition. (See the snippet in 'customizing' below)
You'll need to subclass both Base and BaseModelMixin with Base first followed by the mixin so you have access to the Base functionality and don't get any errors.
To use the methods in BaseModelMixin, all you have to do is access them as if you had written them in your class like so ``` YourModel.create(**{'field': 'value'}) ```
just replace "YourModel" with the name of your model and use any method included in the BaseModelMixin which are all listed at the end of this README.

#### Passing args to the Mixins methods
All methods except the delete and update methods use the same syntax when it comes to accepting arguments; for methods other than delete and update you can use the following syntax. ```YourModel.create(**{'field': 'value'})``` Where field is the name of a field in your model and value is the value you'd like to assign to said field. It will accept a dictionary of any length but will throw an error if one of the fields does not exist in your model. **So take care to only pass existing fields to the create and update methods!**
NOTE: Be sure to add two asterisks before your dictionary in the arguments so the method knows to use the dictionary as key word arguments. Like so
```
dictionary = {'name': 'Alex'}
YourModel.create(**dictionary)
```

#### Validating fields
You may want to over ride the create function in the mixin to modify or validate some inputs. However, you may be able to do these modifications in a validation function (See the doc below and review the 'validates' section). As long as your validation function returns the value to be used in the field, it will work. This way you don't need to rewrite code and can both validate inputs and change whatever data you need in one place.
***Please Note*** All methods decorated with the @validates('field') decorator will be executed when the fields get changed with new inputs.
Docs: https://docs.sqlalchemy.org/en/13/orm/mapped_attributes.html

### Customizing
You can customize the functionality in the mixin by simply over riding the method in your own class.
For example, BaseModelMixin has a create() method; If you need some specific functionality in the create method simply define the method like so
```
from base_model import BaseModelMixin
from sqalchemy.declarative import declarative_base
Base = declarative_base()
class YourModel(Base, BaseModelMixin):
    # Fields here

    def create(self, <args here>):
        # Do things
```
This will over ride the base create method and your defined method will be called instead of the one in BaseModelMixin.

### Included Methods
```create(**info)``` - Create a new instance of the model in the database with the given info dictionary and return the new instance.

```update(id, **info)``` - Takes in the id of a model instance to be updated, gets the instance from the database then uses the passed info dictionary to update its fields. This will throw an AttributeError if you try to set a field that does not exist!

```delete(id)``` - Gets an instance from the database using the id that was passed then deletes it and commits the changes to the database. This will throw a "NoResultFound" exception if an instance with the passed id doesn't exist in the database.

```instance_exists(**info)``` - Takes in a dictionary of information to filter the table by and if it finds at least one instance with the passed information, it will return True; otherwise it will return False.

```get_instance(multiple=False, **info)``` - Filters through the table using the passed info dictionary to find matching instance(s). By default 'multiple' is False so this will return only one instance (if one is found). If you would like all matching records, pass in multiple=True and you'll be returned all instances that were found.