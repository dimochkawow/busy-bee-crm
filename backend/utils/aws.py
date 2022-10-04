import boto3
import io
from botocore.exceptions import ClientError
from utils.exceptions import BBAWSIntegrationException


s3_resource = boto3.resource('s3')


def upload_file(file_obj, obj_name, bucket_name):
    bucket = s3_resource.Bucket(bucket_name)
    file_obj.seek(0)
    
    try:
        return bucket.upload_fileobj(file_obj, obj_name)
    except ClientError as e:
        raise BBAWSIntegrationException(e)


def download_file(bucket_name, obj_name):
    bucket = s3_resource.Bucket(bucket_name)
    obj = bucket.Object(obj_name)
    file = io.BytesIO()
    
    try:
        obj.download_fileobj(file)
        file.seek(0)
        return file
    except ClientError as e:
        raise BBAWSIntegrationException(e)
