from sqlalchemy import inspect
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.ext.declarative import declarative_base
from db import session
# Base model the other model(s) will subclass
Base = declarative_base()

class BaseModelMixin(object):
    """
    Add the ability to perform some queries in any class that subclasses
    this mixin. This prevents alot of repeated code such as, update,
    delete, and getting a specific or multiple instances from the
    corresponding table
    """

    def to_dict(self, includes=[], excludes=[]):
        """
        WARNING
        This is to be called from an existing instance so it has
        access to existing values
        Take in a list of includes and/or excludes then return a
        dictionary of fields and values. If includes is passed but
        not excludes, it will return all fields that were in includes.
        If excludes is passed but not includes, it will return all fields
        except those in excludes.
        If neither are passed, it will return ALL fields and values in the model
        """
        serialized_fields = {}
        # Get all fields if includes is not passed
        if len(includes) == 0:
            for field in self.__get_fields():
                if field in excludes:
                    continue
                # Make sure the class has the attribute
                try:
                    serialized_fields[field] = getattr(self, field)
                except AttributeError:
                    raise AttributeError("Tried to get field %s but %s doesn't exist") % (field, field)
                except:
                    raise Exception("Uncaught exception in %s to_dict()" % (self))
            return serialized_fields
            
        # Get only the fields provided in the includes list
        for field in includes:
            if field in excludes:
                continue
            # Make sure the class has the attribute
            try:
                serialized_fields[field] = getattr(self, field)
            except AttributeError:
                raise AttributeError("Tried to get field %s but %s doesn't exist") % (field, field)
            except:
                raise Exception("Uncaught exception in %s to_dict()" % (self))
        return serialized_fields

    @classmethod
    def instance_exists(cls, **info):
        """
        Try to find an instance with the passed information
        if at least one instance exists, return True else False
        """
        instance = session.query(cls).filter_by(**info).first()
        return instance != None

    @classmethod
    def get_instance(cls, multiple=False, **info):
        """
        Get an instance from the database with the given info
        If multiple is True, this function will return all
        instances that were retrieved.
        Otherwise (and by default) it will return the first.
        If no row was found, this will throw a NoResultFound error
        """
        # Don't waste time, 'cache' the query result
        query = session.query(cls).filter_by(**info)
        # .first() will return None if no matching rows were found
        if query.first():
            if multiple:
                return query.all()
            return query.first()
        else:
            for field, value in info.items():
                print(f"{field}: {value}")
            raise NoResultFound(f"\nFailed to find instance from table {cls.__tablename__} with info listed above")

    @classmethod
    def create(cls, **info):
        """
        PLEASE NOTE: To validate fields, you'll need to write validation functions
        review this for more information on validation... https://docs.sqlalchemy.org/en/13/orm/mapped_attributes.html
        If you need to extend this functionality,  over ride it by making a new create function
        in your class.
        This takes in a dictionary of information, instantiates a new instance,
        loops the passed info, updates the new instance, adds it to the pending sql,
        commits it to the database and returns the newly created user
        """
        new_instance = cls()
        for field, value in info.items():
            if hasattr(cls, field):
                setattr(new_instance, field, value)
            else:
                raise AttributeError(f"Tried to set {field} to {value} but this {cls} does not have a {field} field")
        session.add(new_instance)
        created_instance = session.query(cls).filter_by(**info).first()
        return created_instance


    @classmethod
    def update(cls, id, **info):
        """
        WARNING
        This will NOT work if updating a relationship.
        See the comments in the following SO post
        https://stackoverflow.com/questions/23152337/how-to-update-sqlalchemy-orm-object-by-a-python-dict
        This gets an object from the database matching the id
        then uses the kwargs to update its fields
        """
        instance = session.query(cls).get(id)
        for field, value in info.items():
            if hasattr(instance, field):
                setattr(instance, key, value)
            else:
                raise AttributeError(f"Could not update {cls} instance because {cls} does not have a {field} field")
        session.commit()

    @classmethod
    def delete(cls, id):
        """
        This retrieves and deletes an instance from the database
        **May need to take in an extra arg to configure delete behavior**
        """
        # get_instance() will raise a NoResultFound error if the user doesn't exist
        instance = cls.get_instance(**{'id': id})
        session.delete(instance)
        session.commit()


    @classmethod
    def __get_fields(cls):
        """
        Get all the names used for the columns in the model definition
        then append them to a list and return them
        """
        fields = []
        mapper = inspect(cls)
        for field in mapper.attrs:
            fields.append(field.key)
        return fields
