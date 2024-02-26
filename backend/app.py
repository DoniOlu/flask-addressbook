import os
import psycopg2, psycopg2.extras
from flask import Flask, render_template, jsonify, make_response

app = Flask(__name__)

def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ['DB_HOSTNAME'],
        database=os.environ['DB_NAME'],
        user=os.environ['DB_USERNAME'],
        password=os.environ['DB_PASSWORD'])
    return conn
    
# Example of api route that will return all records in a table
# @app.route('/')
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

# @app.route("/contact/add", methods=["PUT"])
# def add_contact(user):
#     return {'status': 200}

# @app.route("/contact/edit", methods=["POST"])
# def edit_contact(user):
#     return {'status': 200}

# @app.route("/contact/delete/<user_id>", methods=["DELETE"])
# def delete_contact(user):
#     return {'status': 200}
    

