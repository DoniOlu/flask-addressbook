import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

# Database connection
conn = psycopg2.connect(
        host=os.environ['DB_HOSTNAME'],
        database=os.environ['DB_NAME'],
        user=os.environ['DB_USERNAME'],
        password=os.environ['DB_PASSWORD'])

# Open a cursor to perform database operations
cur = conn.cursor()

# Example of execute a command to create a new table
# cur.execute('DROP TABLE IF EXISTS addressbook;')
# cur.execute('CREATE TABLE books (id serial PRIMARY KEY,'
#                                  'title varchar (150) NOT NULL,'
#                                  'author varchar (50) NOT NULL,'
#                                  'pages_num integer NOT NULL,'
#                                  'review text,'
#                                  )

# Example of inserting data into the table
# cur.execute('INSERT INTO books (title, author, pages_num, review)'
#             'VALUES (%s, %s, %s, %s)',
#             ('A Tale of Two Cities',
#              'Charles Dickens',
#              489,
#              'A great classic!!!')
#             )

conn.commit()

cur.close()
conn.close()