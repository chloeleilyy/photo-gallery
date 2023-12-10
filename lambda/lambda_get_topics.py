import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.client('dynamodb')

    try:
        response = dynamodb.scan(
            TableName='photo-metadata',
            ProjectionExpression='topic'
        )
        # print(response)
        topics = response['Items']

        topicList = set()
        for topic in topics:
            topicList.add(topic['topic']['S'])

        return {
            'statusCode': 200,
            'body': json.dumps({
                'topicList': list(topicList),
                'message': 'Success'
            })
        }

    except Exception as e:
        return {
            'statusCode': 500,  # Internal Server Error
            'body': json.dumps({
                'message': 'Failed to retrieve topic list from DynamoDB',
                'error': str(e)
            })
        }
