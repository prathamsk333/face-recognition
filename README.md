#face recognition

services used:
# 1)rekognition - to check the images and generate faceprints
# 2)S3 - to store the images of students before using the application
# 3)Lambda functions - to trigger the events
# 4)DynamoDB - to save the faceprint and the name of the person in the photo
 
also there are two scripts one is to upload images(recognition.py) and another is to test the similarity of images (./test/test.py) 
