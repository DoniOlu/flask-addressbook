import boto3
from botocore.exceptions import ClientError
import os
import json
import psycopg2, psycopg2.extras
from flask import Flask, request

app = Flask(__name__, static_url_path='', static_folder='static', template_folder='static')

if os.environ.get('FLASK_ENV') == 'production':
    app.config.from_object('config.ProductionConfig')
else:
    app.config.from_object('config.DevelopmentConfig')

# Function to create a connection to the database
def connect_to_database():
    return psycopg2.connect(**app.config['DATABASE_PARAMS'])

# Initialize the database connection
db_connection = connect_to_database()

# Open a cursor to perform database operations
cur = db_connection.cursor()

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
             '1234567890')
            )

db_connection.commit()

cur.close()
db_connection.close()

@app.route('/')
def hello():
    return app.send_static_file("index.html")

@app.route("/contact/users", methods=["GET"])
def get_all_contacts():
    try:
        conn = connect_to_database()
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
        conn = connect_to_database()
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
        conn = connect_to_database()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute('INSERT INTO ADDRESS_BOOK (first_name, last_name, phone, email, address, birthday)'
                    'VALUES (%s, %s, %s, %s, %s, %s);',
                    (request_payload['first_name'], request_payload['last_name'], request_payload['phone'], request_payload['email'], request_payload['address'], request_payload['birthday'])
                    )
        conn.commit()

        cur.close()
        conn.close()
        return {'status': 200}
    except Exception as error: 
        print('Error:', error)
        return {'status': 500}



@app.route("/contact/edit/<user_id>", methods=["POST"])
def edit_contact(user_id):
    try:
        request_payload = request.get_json()
        update_columns = ", ".join(f"{k} = '{v}'" for k, v in request_payload.items())
        conn = connect_to_database()
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
        conn = connect_to_database()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute('DELETE FROM ADDRESS_BOOK WHERE "id" = (%s);', (user_id))
        conn.commit()

        cur.close()
        conn.close()
        return {'status': 200}
    except:
        return {'status': 500}
    

def create_app():
    return app