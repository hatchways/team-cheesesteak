from flask import request, Blueprint, jsonify
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy import or_, and_
from models.message import Message, Conversation
from models.user import User
from db import session
from .auth import authenticate

messaging_views = Blueprint('messaging', __name__, url_prefix="chat")

@messaging_views.route('/new_message', methods=["POST"])
@authenticate
def new_message(**kwargs):
    response_dict = {}
    user = kwargs['user']
    request_dict = request.get_json()
    receiver_id = request.get('receiver_id', None)
    receiver = User.get_instance(**{'id': receiver_id})
    if receiver_id == None:
        response_dict['status'] = 400
        response_dict['message'] = "Cannot create a new message with no receiving user"
        return jsonify(response_dict), 400
    # Get the receiving user by getting the corresponding
    # instance using the receiver_id passed in the request
    message_info = {}
    try:
        # Sending user should already have their information
        # populated from the user context provider, no need to add it
        message_info['receiver'] = receiver.to_dict(excludes=['profile', 'password_hash'])
        message_info['receiver']['profile'] = receiver.profile.to_dict(excludes=['user_id', 'recipes', 'user'])
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
    # Get or create a conversation between the users
    if Conversation.conversation_exists(user, receiver):
        message_info['conversation'] = Conversation.get_conversation(user, receiver)
    else:
        message_info['conversation'] = Conversation.create(**{'user_one': user, "user_two": receiver})
    new_message = Message.create(**message_info)
    message_info['conversation'].add_to_relationship('messages', new_message)
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
        for field, value in message.get_formatted_info.items():
            message_dict[field] = value
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
        for field, value in message.get_formatted_info.items():
            message_dict[field] = value
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
        response_dict['status'] = 404
        response_dict['message'] = "User with id %s does not exist" % (other_user_id)
        return jsonify(response_dict), 404
    # Get the conversation between the two users.
    conversation = Conversation.get_conversation(user, other_user)
    # Messages in the conversation are already ordered by descending created_at (date/time)
    for message in conversation.messages.all():
        if message.sender != user:
            profile_image = message.sender.profile.profile_image
        else:
            profile_image = message.receiver.profile.profile_image
        message_dict = {
            'sender': message.sender.profile.name,
            'image_url': profile_image,
            'content': message.content
        }
        for field, value in message.get_formatted_info:
            message_dict[field] = value
        response_dict['messages'].append(message_dict)
    response_dict['status'] = 200
    return jsonify(response_dict), 200

@messaging_views.route("/get_conversation_previews", methods=["GET"])
@authenticate
def get_convo_previews():
    """
    Get all conversations this user has, then build a
    dictionary where the outer most key is 'messages'
    and its value is a list of dictionaries. The fields
    for each message in the dictionaries are...
    1. The name of the other user (at the key of 'name')
    2. The other users profile image (at the key of 'image_url')
    3. The last message sent in the conversation (at the key of 'content')
    """
    response_dict = {'messages': []}
    # If we're getting the previews for the ConversationView
    # there will be an 'exclude' key with the value of a
    # user id of the other user in the current conversation
    request_dict = request.get_json()
    excluded_user = None
    if request_dict.get('user_id', None) != None:
        excluded_user = User.get_instance(**{'id': request_dict.get('user_id')})
    base_query = session.query(Conversation).filter(or_(
            user_one=user,
            user_two=user
        ))
    if excluded_user != None:
        conversations = base_query.filter(
            and_(
                user_one!=excluded_user,
                user_two!=excluded_user
            )
        ).all()
    else:
        conversations = base_query.all()
    if len(conversations) == 0:
        response_dict['status'] = 204
        response_dict['message'] = "No conversations yet"
        return jsonify(response_dict), 204
    for conversation in conversations:
        newest_message = conversation.messages.first()
        sender_profile = newest_message.sender.profile
        if sender_profile.name != user.profile.name:
            other_user_profile = sender_profile.name
        else:
            other_user = newest_message.receiver.profile.name
        message_info = {
            'name': other_user_profile.name,
            'image_url': other_user_profile.profile_image,
            'content': newest_message.content,
            'created_at': newest_message.get_formatted_time
        }
        response_dict['messages'].append(message_info)
    return jsonify(response_dict), 200

@messaging_views.route("/delete", methods=["GET"])
@authenticate
def delete_message(**kwargs):
    response_dict = {}
    message_id = request.get_json().get('message_id')
    message = Message.get_instance(**{'id': message_id})
    try:
        conversation = message.conversation
        conversation.remove_from_relationship("messages", message)
        Message.delete(message_id)
    except NoResultFound:
        response_dict['status'] = 404
        response_dict['message'] = "Failed to delete message with id %s because it does not exist" % (message_id)
        return jsonify(response_dict), 404
    response_dict['status'] = 200
    response_dict['message'] = "Successfully deleted message"
    return jsonify(response_dict), 200
