import os
import json
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

def get_secret():

    secret_name = "rds!db-9bf2c9c5-1fa1-4456-8dd2-f73620bb3854"
    region_name = "us-east-2"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    credentials = session.get_credentials().get_frozen_credentials()

    client = session.client(
        aws_access_key_id=credentials.access_key,
        aws_secret_access_key=credentials.secret_key,
        aws_session_token=credentials.token,
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e

    return get_secret_value_response['SecretString']

class DevelopmentConfig:
    load_dotenv()
    DEBUG = True
    DATABASE_PARAMS = {
        'host':'localhost',
        'database': 'postgres',
        'user': os.getenv("LOCAL_DB_USER"),
        'password': os.getenv("LOCAL_DB_PASS"),
        'port': 5432
    }

class ProductionConfig:
    db_credentials = json.loads(get_secret())
    user = db_credentials['username']
    password = db_credentials['password']
    DEBUG = False
    DATABASE_PARAMS = {
        'host':'address-book-db-1.caj7nng7virt.us-east-2.rds.amazonaws.com',
        'database': 'postgres',
        'user':user,
        'password': password,
        'port': 5432
    }
