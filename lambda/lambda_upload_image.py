import os
import json
import boto3
import base64
import uuid
from io import BytesIO
from cgi import parse_header, parse_multipart
import logging


logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')


def lambda_handler(event, context):
    try:
        content_type = event['headers'].get('content-type', '')
        c_type, c_data = parse_header(content_type)
        c_data["boundary"] = bytes(c_data["boundary"], "utf-8")
        body_file = BytesIO(base64.b64decode(event['body']))
        form_data = parse_multipart(body_file, c_data)

        filename = form_data["filename"][0]
        file_content = b''.join(form_data["file"])
        username = form_data["username"][0]
        topic = form_data["topic"][0]
        timestamp = form_data["timestamp"][0]

        unique_id = str(uuid.uuid4())
        _, file_extension = os.path.splitext(filename)
        unique_filename = f"{unique_id}{file_extension}"

        # logger.info("Username: " + username)
        # logger.info("Topic: " + topic)
        # logger.info("Timestamp: " + timestamp)
        # logger.info("Unique filename: " + unique_filename)

        s3.put_object(
            Bucket='photo-gallery-storage',
            Key=unique_filename,
            Body=file_content
        )
        table = dynamodb.Table('photo-metadata')
        table.put_item(Item={
            'imageId': unique_id,
            'username': username,
            'topic': topic,
            'timestamp': timestamp,
            's3Key': unique_filename 
        })

        return {
            'statusCode': 200,
            'body': json.dumps(event)
        }

    except Exception as e:
        logger.error(e)
        return {
            'statusCode': 500,
            'body': json.dumps(event)
        }
