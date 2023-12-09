import os
import json
import boto3
import base64
import uuid
from io import BytesIO
from cgi import parse_header, parse_multipart
import logging
from PIL import Image


logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')


def create_thumbnail(image_bytes, thumbnail_size=(128, 128)):
    with Image.open(BytesIO(image_bytes)) as image:
        image.thumbnail(thumbnail_size, Image.Resampling.LANCZOS)
        thumb_buffer = BytesIO()
        image.save(thumb_buffer, format=image.format)
        return thumb_buffer.getvalue()


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

        # create thumbnail image.
        thumbnail_content = create_thumbnail(file_content)

        unique_id = str(uuid.uuid4())
        _, file_extension = os.path.splitext(filename)
        unique_filename = f"{unique_id}{file_extension}"

        # upload images to S3 bucket and save metadata to DynamoDB.
        s3.put_object(
            Bucket='photo-gallery-storage',
            Key=f'original/{unique_filename}',
            Body=file_content
        )
        s3.put_object(
            Bucket='photo-gallery-storage',
            Key=f'thumbnail/{unique_filename}',
            Body=thumbnail_content
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
            'body': json.dumps('Success.')
        }

    except Exception as e:
        logger.error(e)
        return {
            'statusCode': 500,
            'body': json.dumps('Failed.')
        }
