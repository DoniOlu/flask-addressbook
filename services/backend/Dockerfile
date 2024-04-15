# pull official base image
FROM --platform=linux/amd64 python:3.10.9

# set working directory
WORKDIR /flask-addressbook/backend

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# add app
COPY . .

# add and install requirements
COPY ./requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 
CMD ["waitress-serve", "--host=0.0.0.0", "app:create_app"]

EXPOSE 5001