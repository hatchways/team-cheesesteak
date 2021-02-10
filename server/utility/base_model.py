from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base, declared_attr, as_declarative
from sqlalchemy.orm.exc import NoResultFound

# from .database.db import engine
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

    @classmethod
    def instance_exists(cls, **info):
        """
        NOTE
        This may need to call session.close() before returning the result!
        
        
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
            raise Exception(f"\nFailed to find instance from table {cls.__tablename__} with info listed above")

    @classmethod
    def update(cls, id, **info):
        """
        WARNING
        This will NOT work if updating a relationship.
        See the comments in the following SO post
        https://stackoverflow.com/questions/23152337/how-to-update-sqlalchemy-orm-object-by-a-python-dict
        Get an object from the database matching the id
        then use the kwargs to update its fields
        """
        instance = session.query(cls).get(id)
        for key, value in info.items():
            setattr(instance, key, value)
        session.commit()

    @classmethod
    def delete(cls, id):
        """
        Retrieve and delete a recipe instance from the database
        Also delete any and all connections to and from the user
        """
        # get_instance() will raise a NoResultFound error if the user doesn't exist
        instance = cls.get_instance(**{'id': id})
        session.delete(instance)
        session.commit()
