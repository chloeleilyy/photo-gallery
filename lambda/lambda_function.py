import json
import boto3
import base64
import os
import email
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        raw_data = base64.b64decode(event['body'])
        message = email.message_from_bytes(raw_data)

        for part in message.walk():
            content_disposition = part.get('Content-Disposition', None)
            logger.info(f"content_disposition: {content_disposition}")
            if content_disposition:
                _, params = part.get_params(header='Content-Disposition')
                filename = params.get('filename')
                logger.info(f"filename: {filename}")
                if filename:
                    file_content = part.get_payload(decode=True)
                    print(file_content)
                    s3.put_object(Bucket='photo-gallery-storage', Key=filename, Body=file_content)

        return {
            'statusCode': 200,
            'body': json.dumps('File uploaded successfully to S3')
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps('Error uploading file')
        }
