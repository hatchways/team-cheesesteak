from sqlalchemy.orm.exc import NoResultFound
from flask import Blueprint as bp
from flask import (
    make_response,
    jsonify, request,
    session, g
)
from auth import authenticate
from models.user import User
from models.notification import Notification

notif_views = Blueprint("notifications", __name__, url_prefix="notifications")

@notif_views.route("/mark_read")
@authenticate
def mark_read(**kwargs):
    """
    Mark a notification as read
    """
    response_dict = {}
    # Probably needs to be json
    notif_id =  request.get_json().get('id', None)
    # Try to get the notification id
    if notif_id == None:
        response_dict['status'] = 417
        response_dict['message'] = "Failed to get notification id"
        return jsonify(response_dict), 417
    # Try to get the notification object
    try:
        notification = Notification.get_instance(**{'id': notif_id})
    except NoResultFound:
        response_dict['status'] = 404
        response_dict['message'] = "Notification with id %s was not found" % (notif_id)
    Notification.update(notification.id, **{'read': True})
    # Return an updated list of notifications
    response_dict['notifications'] = []
    for notification in notifications:
        response_dict['notifications'].append(
            notification.to_dict(excludes=['user', 'user_id'])
        )
    response_dict['status'] = 200
    return jsonify(response_dict), 200

@notif_views.route("/get_notifications")
@authenticate
def get_all_notifications(**kwargs):
    """
    Get all notifications from a users notifications field
    and return a list of dictionaries assigned to 'notifications'
    in the following format 
    [{
        'id': 1,
        'message': 'New Message From Linda',
        'notif_type': "New Message",
        'created_at': "12:23pm 02/23/2021",
        'read': False,
        'link': 'http://localhost:3000/some/url'
    }]
    """
    response_dict = {}
    user = kwargs['user']
    notifications = user.notifications.all()
    if len(notifications) == 0:
        response_dict['status'] = 204
        response_dict['message'] = "No notifications yet"
        return jsonify(response_dict), 204

    response_dict['notifications'] = []
    for notification in notifications:
        notif_dict = notification.to_dict(excludes=['user', 'user_id', 'created_at'])
        notif_dict['created_at'] = notification.get_date_time
        response_dict['notifications'].append(notif_dict)
    response_dict['status'] = 200
    return jsonify(response_dict), 200
