import json
import boto3


def lambda_handler(event, context):
    """
    Return all thumbnail images s3 Object URLs and according metadata from DynamoDB.

    :param event: API Gateway Lambda Proxy Input Format
    :return dict example:
    { 
        image_url: 'https://th.bing.com/th/id/OIP.HOGkv77hC306cbdcYR7x8QHaFm?rs=1&pid=ImgDetMain', 
        username: 'User1', 
        topic: 'Nature', 
        timestamp: '2023-12-07 12:00' 
    },
    """
    try:
        s3_client = boto3.client('s3')
        dynamodb_client = boto3.client('dynamodb')

        table_name = 'photo-metadata'
        response = dynamodb_client.scan(TableName=table_name)
        response_list = []

        for item in response['Items']:
            s3_object_key = item['s3Key']['S']
            image_url = f"https://photo-gallery-storage.s3.us-east-2.amazonaws.com/thumbnail/{s3_object_key}"

            response_list.append({
                'image_url': image_url,
                'username': item['username']['S'],
                'topic': item['topic']['S'],
                'timestamp': item['timestamp']['S']
            })

        return {
            'statusCode': 200,
            'body': json.dumps(response_list)
        }
    except Exception as e:
        # logger.error(e)
        return {
            'statusCode': 500,
            'body': json.dumps('Internal Server Error. Can\'t get images.')
        }
