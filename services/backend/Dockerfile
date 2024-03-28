# pull official base image
FROM python:3.10.9

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
CMD ["flask", "run"]