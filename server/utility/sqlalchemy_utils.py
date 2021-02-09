"""
SQLAlchemy specific Utilities to prevent duplicate code and
keep things more centralized
"""
from sqlalchemy.orm.exc import NoResultFound

def instance_exists(table_class, **info):
    """
    Try to find an instance with the passed information
    if at least one instance exists, return True else False
    """
    instance = table_class.query.filter_by(**info).first()
    return instance != None

def get_instance(table_class, multiple=False, **info):
    """
    Get an instance from the database with the given info
    If multiple is True, this function will return all
    instances that were retrieved.
    Otherwise (and by default) it will return the first.
    If no row was found, this will throw a NoResultFound error
    """
    # Don't waste time, 'cache' the query result
    query = table_class.query.filter_by(**info)
    # .first() will return None if no matching rows were found
    if query.first():
        if multiple:
            return query.all()
        return query.first()
    else:
        raise NoResultFound(f"No result was found in table {table_class.__tablename__} with info: {info}")
