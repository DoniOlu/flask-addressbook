# pull official base image
FROM --platform=linux/amd64 node:20.2.0 AS builder

# set working directory
WORKDIR /flask-addressbook/frontend

# add `/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH

# install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install 

COPY . .

# build app
CMD ["npm", "run", "build"]