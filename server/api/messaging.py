from itertools import chain
from flask import request, Blueprint, jsonify
from sqlalchemy.orm.exc import NoResultFound
from models.message import Message
from models.user import User
from .auth import authenticate

messaging_views = Blueprint('messaging', __name__, url_prefix="chat")

@messaging_views.route('/new_message', methods=["POST"])
@authenticate
def new_message(**kwargs):
    response_dict = {}
    user = kwargs['user']
    request_dict = request.get_json()
    receiver_id = request.get('receiver_id', None)
    if receiver_id == None:
        response_dict['status'] = 400
        response_dict['message'] = "Cannot create a new message with no receiving user"
        return jsonify(response_dict), 400
    # Get the receiving user by getting the corresponding
    # instance using the receiver_id passed in the request
    message_info = {}
    try:
        message_info['receiver'] = User.get_instance(**{'id': receiver_id})
    except NoResultFound:
        response_dict['status'] = 404
        response_dict['message'] = "User with id %s does not exist" % (receiver_id)
        return jsonify(response_dict), 404
    for field in Message.get_fields():
        if field == "sender":
            message_info['sender'] = user
            continue
        if request_dict.get(field, None) != None:
            message_info[field] = request_dict[field]
    new_message = Message.create(**message_info)
    response_dict['status'] = 201
    response_dict['message'] = "Successfully sent message to %s" % (message_info['receiver'].profile.name)
    return jsonify(response_dict), 201
    

@messaging_views.route("/get_received_messages", methods=["GET"])
@authenticate
def received_messages(**kwargs):
    response_dict = {'messages': []}
    user = kwargs['user']
    # Try to get all received messages
    # if no instances are found, catch 
    # the exception and tell the user 
    # there are no messages
    try:
        messages = Message.get_instance(multiple=True, **{'receiver': user})
    except NoResultFound:    
        response_dict['status'] = 204
        response_dict['message'] = "You haven't received any messages yet"
        return jsonify(response_dict), 204

    for message in messages:
        message_dict = message.to_dict(exclude=['receiver', 'sender', 'created_at'])
        message_dict['sender'] = message.sender.profile.name
        message_dict['sender_image_url'] = message.sender.profile.profile_image
        message['created_at'] = message.get_formatted_date_time
        message_dict['time'] = message.get_formatted_time
        message_dict['date'] = mesage.get_formatted_date
        response_dict['messages'].append(message_dict)

    return jsonify(response_dict), 200

@messaging_views.route('/get_sent_messages', methods=["GET"])
@authenticate
def sent_messages(**kwargs):
    response_dict = {'messages': []}
    user = kwargs['user']
    try:
        messages = Message.get_instance(multiple=True, **{'sender': user})
    except NoResultFound:    
        response_dict['status'] = 204
        response_dict['message'] = "You haven't sent any messages yet"
        return jsonify(response_dict), 204

    for message in messages:
        message_dict = message.to_dict(excludes=['sender', 'receiver', 'created_at'])
        message_dict['created_at'] = message.get_formatted_date_time
        message_dict['time'] = message.get_formatted_time
        message_dict['date'] = mesage.get_formatted_date
        message['receiver'] = message.receiver.profile.name
        message['receiver_image'] = message.receiver.profile.profile_image
        response_dict['messages'].append(message_dict)
    return jsonify(response_dict), 200


@messaging_views.route('/get_conversation_messages', methods=["GET"])
@authenticate
def conversation_messages(**kwargs):
    """
    Get all messages between the logged in user
    and the other user then order them by the 
    created_at field to ensure a proper descending
    order so the newest messages are at the bottom
    """
    response_dict = {'messages': []}
    user = kwargs['user']
    other_user_id = request.get_json().get('other_user_id')
    try:
        other_user = User.get_instance(**{'id': other_user_id})
    except NoResultFound:
        resposne_dict['status'] = 404
        resposne_dict['message'] = "User with id %s does not exist" % (other_user_id)
        return jsonify(resposne_dict), 404
    # Try to get messages or default to an empty list
    try:
        current_users_messages = Message.get_instance(multiple=True, **{
            'sender': user,
            'receiver': other_user
        })
    except NoResultFound:
        current_users_messages = []

    try:
        other_users_messages = Message.get_instance(multiple=True, **{
            'sender': other_user,
            'receiver': user
        })
    except NoResultFound:
        other_users_messages = []

    if (
        len(current_users_messages) == 0
        and len(other_users_messages) == 0
        ):
        # No one has sent messages, give back an empty message
        response_dict['status'] = 204
        response_dict['message'] = "No messages have been sent yet"
        return jsonify(response_dict), 204

    # Chain the messages and sort by descending date time
    # This may be wrong? Depends on how the front end displays
    # the messages. If it is wrong, reverse it or order by created_at
    # instead of -created_at
    messages = sorted(
        chain(
            current_users_messages,
            other_users_messages
        ),
        key="-created_at"
    )
    # Build the response dict
    for message in messages:
        message_dict = message.to_dict(
            excludes=['sender', 'receiver', 'created_at']
        )
        # Replace objects with names
        message_dict['sender'] = message.sender.profile.name
        message_dict['receiver'] = message.receiver.profile.name
        # Give back an easy to read date/time the message was sent
        message_dict['created_at'] = message.get_formatted_date_time
        message_dict['time'] = message.get_formatted_time
        message_dict['date'] = mesage.get_formatted_date
        response_dict['messages'].append(message_dict)
    return jsonify(response_dict), 200

@messaging_views.route("/delete", methods=["GET"])
@authenticate
def delete_message(**kwargs):
    response_dict = {}
    message_id = request.get_json().get('message_id')
    try:
        Message.delete(message_id)
    except NoResultFound:
        response_dict['status'] = 404
        response_dict['message'] = "Failed to delete message with id %s because it does not exist" % (message_id)
        return jsonify(response_dict), 404
    response_dict['status'] = 200
    response_dict['message'] = "Successfully deleted message"
    return jsonify(response_dict), 200
