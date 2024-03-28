import os
import psycopg2, psycopg2.extras
from flask import Flask, render_template, jsonify, make_response, request

app = Flask(__name__, static_url_path='', static_folder='../app/build', template_folder='../app/build'
            )

def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ['DB_HOSTNAME'],
        database=os.environ['DB_NAME'],
        user=os.environ['DB_USERNAME'],
        password=os.environ['DB_PASSWORD'])
    return conn
    
# Example of api route that will return all records in a table
# def index():
#     conn = get_db_connection()
#     cur = conn.cursor()
#     cur.execute('SELECT * FROM books;')
#     books = cur.fetchall()
#     cur.close()
#     conn.close()
#     return jsonify(books)

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
    except:
        return {'status': 500}

# @app.route("/contact/<user_id>", methods=["GET"])
# def get_contact(user_id):
#     return {'status': 200}

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

# @app.route("/contact/edit", methods=["POST"])
# def edit_contact(user):
#     return {'status': 200}

# @app.route("/contact/delete/<user_id>", methods=["DELETE"])
# def delete_contact(user):
#     return {'status': 200}
    

