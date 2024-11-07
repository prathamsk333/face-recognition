import boto3

s3 = boto3.resource('s3')

# List of images with full name and roll number
images = [
    ('image1.jpeg', 'Pratham S Kore', '2023BCS0201'),
    ('image2.jpeg', 'Pratham S Kore', '2023BCS0201'),
    ('image3.jpeg', 'Pratham S Kore', '2023BCS0201'),
    ('image4.jpeg', 'Pratham S Kore', '2023BCS0201'),
]

# Iterate through list to upload objects to S3   
for image in images:
    file = open(image[0], 'rb')
    object = s3.Object('facerecognition-attendence', 'index/' + image[0])
    ret = object.put(Body=file,
                     Metadata={'FullName': image[1], 'rollNumber': image[2]})
