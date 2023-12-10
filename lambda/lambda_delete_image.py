import json
import boto3
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        request_data = json.loads(event['body'])
        s3_object_key = request_data.get('s3_object_key', '')
        logger.info('s3_object_key: ' + s3_object_key)

        if not s3_object_key:
            return {
                'statusCode': 400,
                'body': json.dumps('Missing s3_object_key in request body')
            }

        s3_client = boto3.client('s3')
        dynamodb_client = boto3.client('dynamodb')

        bucket_name = 'photo-gallery-storage'
        dynamodb_table_name = 'photo-metadata'
        imageId = s3_object_key.split(".")[0]
        dynamodb_key = {'imageId': {'S': imageId}}


        s3_client.delete_object(
            Bucket=bucket_name, 
            Key=f'original/{s3_object_key}'
        )
        s3_client.delete_object(
            Bucket=bucket_name, 
            Key=f'thumbnail/{s3_object_key}'
        )
        dynamodb_client.delete_item(
            TableName=dynamodb_table_name, Key=dynamodb_key
        )

        # deleted successfully
        return {
            'statusCode': 204,
            'body': json.dumps('Successfully deleted image and metadata of \
                                s3 object key: ' + s3_object_key)
        }
    except Exception as e:
        print('Error deleting image:', str(e))
        return {
            'statusCode': 500,
            'body': json.dumps('Failed to delete image and metadata')
        }
