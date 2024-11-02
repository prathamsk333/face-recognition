import boto3
import io
import os
from PIL import Image

rekognition = boto3.client('rekognition', region_name='ap-south-1')
dynamodb = boto3.client('dynamodb', region_name='ap-south-1')

image_path = input("Enter path of the image to check: ")

if not os.path.isfile(image_path):
    print("The specified file does not exist.")
else:
    try:
        image = Image.open(image_path)
        stream = io.BytesIO()
        image.save(stream, format="JPEG") 
        image_binary = stream.getvalue()

        response = rekognition.search_faces_by_image(
            CollectionId='facerecognition_collection',
            Image={'Bytes': image_binary}
        )

        found = False
        if 'FaceMatches' in response:
            for match in response['FaceMatches']:
                print(f"Face ID: {match['Face']['FaceId']}, Confidence: {match['Face']['Confidence']}")
                
                face = dynamodb.get_item(
                    TableName='facerecognition',
                    Key={'RekognitionId': {'S': match['Face']['FaceId']}}
                )

                if 'Item' in face:
                    print("Found Person:", face['Item']['FullName']['S'])
                    found = True

        if not found:
            print("Person cannot be recognized.")

    except Exception as e:
        print("An error occurred:", str(e))
