import json
import boto3
import base64
from io import BytesIO
from cgi import parse_header, parse_multipart
import logging


logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        content_type = event['headers'].get('content-type', '')
        c_type, c_data = parse_header(content_type)
        logger.info(str(c_type))
        logger.info(str(c_data))
        c_data["boundary"] = bytes(c_data["boundary"], "utf-8")
        logger.info(str(c_data["boundary"]))
        # logger.info(base64.b64decode(event['body']))
        body_file = BytesIO(base64.b64decode(event['body']))
        form_data = parse_multipart(body_file, c_data)
        filename = form_data["filename"][0]
        file_content = b''.join(form_data["file"])
        logger.info(filename)
        s3.put_object(Bucket='photo-gallery-storage', Key=filename, Body=file_content)
        
        return {
            'statusCode': 200,
            'body': json.dumps('File uploaded to S3.')
        }
    except Exception as e:
        logger.error(e)
        return {
            'statusCode': 500,
            'body': json.dumps('Uploading failed: Internal Error')
        }
