import os
import psycopg2
from flask import Flask, render_template, jsonify

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