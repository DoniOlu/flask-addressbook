import boto3
from botocore.exceptions import ClientError
import os
import json
import psycopg2, psycopg2.extras
from flask import Flask, render_template, jsonify, make_response, request

app = Flask(__name__, static_url_path='', static_folder='../app/build', template_folder='../app/build'
            )

def get_secret():

    secret_name = "rds!db-9bf2c9c5-1fa1-4456-8dd2-f73620bb3854"
    region_name = "us-east-2"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    credentials = session.get_credentials().get_frozen_credentials()

    client = session.client(
        aws_access_key_id=credentials.access_key,
        aws_secret_access_key=credentials.secret_key,
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

def get_db_connection():
    db_credentials = json.loads(get_secret())
    user = db_credentials['username']
    password = db_credentials['password']
    conn = psycopg2.connect(
        host='address-book-db-1.caj7nng7virt.us-east-2.rds.amazonaws.com',
        database='postgres',
        user=user,
        password=password,
        port=5432)
    return conn


# Database connection
conn = psycopg2.connect(
        host='address-book-db-1.caj7nng7virt.us-east-2.rds.amazonaws.com',
        database='postgres',
        user=json.loads(get_secret())['username'],
        password=json.loads(get_secret())['password'],
        port=5432)

# Open a cursor to perform database operations
cur = conn.cursor()

cur.execute('DROP TABLE IF EXISTS ADDRESS_BOOK;')
cur.execute('CREATE TABLE ADDRESS_BOOK (id serial PRIMARY KEY,'
                                 'first_name varchar (150) NOT NULL,'
                                 'last_name varchar (150),'
                                 'phone varchar (12) NOT NULL,'
                                 'email varchar (150),'
                                 'address varchar (200),'
                                 'birthday date);'
                                 )

cur.execute('INSERT INTO ADDRESS_BOOK (first_name, phone)'
            'VALUES (%s, %s);',
            ('Doni D',
             '123-456-7890')
            )

conn.commit()

cur.close()
conn.close()

@app.route('/')
def hello():
    return app.send_static_file("index.html")

@app.route("/contact/users", methods=["GET"])
def get_all_contacts():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute('SELECT * FROM ADDRESS_BOOK;')
        contacts = cur.fetchall()
        cur.close()
        conn.close()
        return {'status': 200, 'data': contacts}
    except Exception as error:
        print('Error:', error)
        return {'status': 500}

@app.route("/contact/<user_id>", methods=["GET"])
def get_contact(user_id):
    print('User ID:', user_id)
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute('SELECT * FROM ADDRESS_BOOK WHERE "id" = (%s);', (user_id))
        contact = cur.fetchall()
        cur.close()
        conn.close()
        return {'status': 200, 'data': contact}
    except Exception as error:
        print('Error:', error)
        return {'status': 500}

@app.route("/contact/add", methods=["PUT"])
def add_contact():
    try:
        request_payload = request.get_json()
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute('INSERT INTO ADDRESS_BOOK (first_name, last_name, phone, email, address, birthday)'
                    'VALUES (%s, %s, %s, %s, %s, %s);',
                    (request_payload['first_name'], request_payload['last_name'], request_payload['phone'], request_payload['email'], request_payload['address'], request_payload['birthday'])
                    )
        conn.commit()

        cur.close()
        conn.close()
        return {'status': 200}
    except: 
        return {'status': 500}



@app.route("/contact/edit/<user_id>", methods=["POST"])
def edit_contact(user_id):
    try:
        request_payload = request.get_json()
        update_columns = ", ".join(f"{k} = '{v}'" for k, v in request_payload.items())
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute('UPDATE ADDRESS_BOOK SET ' + update_columns + ' WHERE "id" = (%s);', (user_id))
        conn.commit()

        cur.close()
        conn.close()
        return {'status': 200}
    except Exception as error:
        print('Error:', error)
        return {'status': 500}

@app.route("/contact/delete/<user_id>", methods=["DELETE"])
def delete_contact(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute('DELETE FROM ADDRESS_BOOK WHERE "id" = (%s);', (user_id))
        conn.commit()

        cur.close()
        conn.close()
        return {'status': 200}
    except:
        return {'status': 500}
    

