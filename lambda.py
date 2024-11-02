from __future__ import print_function
import boto3
import json
import urllib

print('Loading function')

dynamodb = boto3.resource('dynamodb')  # Use DynamoDB as a resource for put_item
s3 = boto3.client('s3')
rekognition = boto3.client('rekognition')

# --------------- Helper Functions ------------------

def index_faces(bucket, key):
    response = rekognition.index_faces(
        Image={
            "S3Object": {
                "Bucket": bucket,
                "Name": key
            }
        },
        CollectionId="facerecognition_collection" 
    )
    return response

def update_index(tableName, faceId, fullName):
    table = dynamodb.Table(tableName)  # Accessing the DynamoDB table
    response = table.put_item(
        Item={
            'RekognitionId': faceId,
            'FullName': fullName
        }
    )
    return response

# --------------- Main handler ------------------

def lambda_handler(event, context):
    # Get the object details from the event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    
    # Decode the key if it contains URL-encoded characters
    key = urllib.parse.unquote_plus(key)

    print("Bucket:", bucket)
    print("Key:", key)

    try:
        # Call Rekognition to index faces in the specified collection
        response = index_faces(bucket, key)
        
        # Retrieve face ID and commit face data to DynamoDB
        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            faceId = response['FaceRecords'][0]['Face']['FaceId']

            # Retrieve custom metadata (fullname) from the S3 object
            ret = s3.head_object(Bucket=bucket, Key=key)
            personFullName = ret['Metadata'].get('fullname', 'Unknown')

            # Update DynamoDB with the faceId and person's full name
            update_index('facerecognition', faceId, personFullName)

        # Print response to console
        print(response)

        return response
    except Exception as e:
        print(e)
        print("Error processing object {} from bucket {}.".format(key, bucket))
        raise e
