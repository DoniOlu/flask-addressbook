# pull official base image
FROM node:20.2.0 AS builder

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH

# install app dependencies
COPY /app/package.json ./
COPY /app/package-lock.json ./
RUN npm install 

# add app
COPY app ./

# Describe which ports your application is listening on.
EXPOSE 5000

# start app
CMD ["npm", "start"]