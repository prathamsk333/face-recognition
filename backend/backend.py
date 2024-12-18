from fastapi import FastAPI, File, UploadFile, HTTPException
import boto3
import io
from PIL import Image
from botocore.exceptions import ClientError
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

# Allow CORS from everywhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AWS clients
rekognition = boto3.client('rekognition', region_name='ap-south-1')
dynamodb = boto3.client('dynamodb', region_name='ap-south-1')

@app.post("/match-face/")
async def match_face(file: UploadFile = File(...)):
    try:
        # Ensure the uploaded file is an image
        if file.content_type not in ["image/jpeg", "image/jpg", "image/png", "image/webp"]:
            raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")
        
        # Open the image and convert it to bytes
        image = Image.open(file.file)
        stream = io.BytesIO()
        image.save(stream, format="JPEG")
        image_binary = stream.getvalue()

        # Call Rekognition to search for the face in the collection
        try:
            response = rekognition.search_faces_by_image(
                CollectionId='facerecognition_collection',
                Image={'Bytes': image_binary}
            )

            # Check if a match is found
            if 'FaceMatches' in response and response['FaceMatches']:
                for match in response['FaceMatches']:
                    face_id = match['Face']['FaceId']
                    confidence = match['Face']['Confidence']

                    # Retrieve the person's name and roll number from DynamoDB using the Face ID
                    face = dynamodb.get_item(
                        TableName='facerecognition',
                        Key={'RekognitionId': {'S': face_id}}
                    )

                    if 'Item' in face:
                        full_name = face['Item']['FullName']['S']
                        roll_no = face['Item']['RollNumber']['S']
                        current_date = datetime.now().strftime('%Y-%m-%d')

                        # Retrieve existing attendance data for the user
                        existing_data = dynamodb.get_item(
                            TableName='attandance',
                            Key={'RollNo': {'S': roll_no}}
                        )

                        # Check if there is already an attendance record
                        if 'Item' in existing_data:
                            existing_dates = [date['S'] for date in existing_data['Item'].get('DatesPresent', {}).get('L', [])]
                            print(current_date+" - \n")
                            print(existing_dates)
                            # Check if today's date is already present in the attendance record
                            if current_date in existing_dates:
                                return {
                                    "status": "info",
                                    "message": f"Attendance already taken for {full_name} on {current_date} successfully.",
                                    "confidence": confidence,
                                    "roll_no": roll_no,
                                    "date": current_date
                                }

                            # If today's date is not present, update the record to add it
                            else:
                                try:
                                    update_response = dynamodb.update_item(
                                        TableName='attandance',
                                        Key={'RollNo': {'S': roll_no}},
                                        UpdateExpression="SET FullName = :fullname, DatesPresent = list_append(DatesPresent, :new_date)",
                                        ExpressionAttributeValues={
                                            ':fullname': {'S': full_name},
                                            ':new_date': {'L': [{'S': current_date}]}
                                        }
                                    )
                                    print("UpdateItem response:", update_response)

                                    return {
                                        "status": "success",
                                        "message": f"Face matched with {full_name}. Attendance recorded.",
                                        "confidence": confidence,
                                        "roll_no": roll_no,
                                        "date": current_date
                                    }

                                except ClientError as e:
                                    print("Error updating item in DynamoDB:", e)
                                    raise HTTPException(status_code=500, detail=f"Failed to record attendance: {str(e)}")

                        # If no previous attendance record exists, create a new one with today's date
                        else:
                            try:
                                dynamodb.put_item(
                                    TableName='attandance',
                                    Item={
                                        'RollNo': {'S': roll_no},
                                        'FullName': {'S': full_name},
                                        'DatesPresent': {'L': [{'S': current_date}]}
                                    }
                                )
                                return {
                                    "status": "success",
                                    "message": f"Face matched with {full_name}. Attendance recorded.",
                                    "confidence": confidence,
                                    "roll_no": roll_no,
                                    "date": current_date
                                }

                            except ClientError as e:
                                print("Error creating item in DynamoDB:", e)
                                raise HTTPException(status_code=500, detail=f"Failed to record attendance: {str(e)}")

            # If no match is found
            return {
                "status": "error",
                "message": "Face not recognized. Please try again."
            }

        except ClientError as e:
            # Handle specific error if no face is found in the image
            if 'InvalidParameterException' in str(e):
                raise HTTPException(status_code=400, detail="No faces detected in the image.")
            else:
                raise HTTPException(status_code=500, detail=f"Error with Rekognition service: {str(e)}")

    except Exception as e:
        print("Internal error:", e)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/attendance/{roll_no}")
async def get_attendance(roll_no: str):
    """
    Retrieve attendance details from DynamoDB based on the provided roll_no.
    """
    try:
        response = dynamodb.get_item(
            TableName='attandance',
            Key={'RollNo': {'S': roll_no}}
        )

        if 'Item' in response:
            item = response['Item']
            attendance_data = {
                'RollNo': item['RollNo']['S'],
                'FullName': item['FullName']['S'],
                'DatesPresent': [date['S'] for date in item.get('DatesPresent', {}).get('L', [])]  # Retrieves as a list of dates
            }
            return {
                "status": "success",
                "attendance_data": attendance_data
            }
        else:
            raise HTTPException(status_code=404, detail="Attendance record not found.")

    except ClientError as e:
        print("Error retrieving item from DynamoDB:", e)
        raise HTTPException(status_code=500, detail="Error retrieving attendance data.")

    except Exception as e:
        print("Internal error:", e)
        raise HTTPException(status_code=500, detail="Internal server error.")
