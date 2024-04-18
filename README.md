# Address Book

## Description

This web application is designed to utilize basic CRUD operations with a simple UI to simulate the functionality of an address book. It is containerized using Docker, deployed on an AWS EC2 instance, and is using a PostgreSQL database that using AWS RDS service.

## Features

React Frontend

Flask Backened

Docker Integration

AWS EC2 Deployment

## Prerequisites

To run locally, you will need to have Docker installed. You will also need to have an AWS account.

## Running Application

### Production
Note: To access the production build that is currently hosted on AWS, please reach out to me.

In production to create the docker image, run: ``sh deploy.sh`` this script will build the UI and copy the files to a static directory that the backend servivce will serve for the API. After this, the ``docker-compose up`` will create the image.

### Development
#### Mock Environment
In the frontend service, run ``npm install`` to install all the necessary dependencies. 

To run the mock environment, the following command: ``npm run dev`` will start the express service to serve the mock api.

#### Local PostgreSQL Database Environment
Run the script: ``sh buildStaticDev.sh``
This will build the UI files and copy them to static directory for backend use.

Set local database credentials a .env file within the backend service. After doing so, ``flask run`` is the command to start the API service.
