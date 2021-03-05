
import json
import boto3
from flask import jsonify, request, Blueprint
from botocore.client import Config
from config import S3_ACCESS_KEY_ID, S3_ACCESS_SECRET_KEY

from models.profile import Profile

upload_image_handler = Blueprint('upload_image_handler', __name__)

# should prevent user upload if user is not logged in (authenticate add as dec)
# @authenticate
@upload_image_handler.route('/api/upload', methods=['POST'])
def UploadImg():

	if request.method != 'POST':
		return jsonify({'response': {'msg': 'NOT POST'}}), 400
	if not request.files['profilePic']:
		return jsonify({'response': {'msg': 'No File Was Uploaded'}}), 400
	if not is_image(request.files['profilePic'].content_type):
		return jsonify({'response': {'msg': 'Bad File Type'}}), 400

	# user = kwargs['user']
	img = request.files['profilePic']
	FILE_NAME = img.filename
	BUCKET_NAME = "chef-booking"

	# S3 Connect
	s3 = boto3.resource(
		's3',
		aws_access_key_id=S3_ACCESS_KEY_ID,
		aws_secret_access_key=S3_ACCESS_SECRET_KEY,
		config=Config(signature_version='s3v4')
	)

	# Image Uploaded
	s3.Bucket(BUCKET_NAME).put_object(Key='%s/%s' % ("slayit@gmail.com",FILE_NAME), Body=img, ACL='public-read')
	msg = 'File Was Uploaded Successfully.'

	#save url
	url = 'https://%s.s3.amazonaws.com/%s' % (BUCKET_NAME, FILE_NAME)

	Profile.update(1, **{'profile_image': url})

	return jsonify({'response': {'url': url, 'msg': msg}}), 200

def is_image(fileType):
	if not fileType:
		return False

	fileTypes = ['image/jpg','image/jpeg', 'image/png']
	is_valid = False

	for type in fileTypes:
		if type == fileType:
			is_valid= True
			break

	return is_valid
import json
import boto3
from flask import jsonify, request, Blueprint
from botocore.client import Config
from config import S3_ACCESS_KEY_ID, S3_ACCESS_SECRET_KEY

from models.profile import Profile

upload_image_handler = Blueprint('upload_image_handler', __name__)

# should prevent user upload if user is not logged in (authenticate add as dec)
# @authenticate
@upload_image_handler.route('/api/upload', methods=['POST'])
def UploadImg():

	if request.method != 'POST':
		return jsonify({'response': {'msg': 'NOT POST'}}), 400
	if not request.files['profilePic']:
		return jsonify({'response': {'msg': 'No File Was Uploaded'}}), 400
	if not is_image(request.files['profilePic'].content_type):
		return jsonify({'response': {'msg': 'Bad File Type'}}), 400

	# user = kwargs['user']
	img = request.files['profilePic']
	FILE_NAME = img.filename
	BUCKET_NAME = "chef-booking"

	# S3 Connect
	s3 = boto3.resource(
		's3',
		aws_access_key_id=S3_ACCESS_KEY_ID,
    aws_secret_access_key=S3_ACCESS_SECRET_KEY,
    config=Config(signature_version='s3v4')
	)

	# Image Uploaded
	s3.Bucket(BUCKET_NAME).put_object(Key='%s/%s' % ("slayit@gmail.com",FILE_NAME), Body=img, ACL='public-read')
	msg = 'File Was Uploaded Successfully.'

	#save url
	url = 'https://%s.s3.amazonaws.com/%s' % (BUCKET_NAME, FILE_NAME)

	Profile.update(1, **{'profile_image': url})

	return jsonify({'response': {'url': url, 'msg': msg}}), 200

def is_image(fileType):
	if not fileType:
		return False
	
	fileTypes = ['image/jpg','image/jpeg', 'image/png']
	is_valid = False

	for type in fileTypes:
		if type == fileType:
			is_valid= True
			break

	return is_valid