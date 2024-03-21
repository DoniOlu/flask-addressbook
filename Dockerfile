# pull official base image
FROM node:20.2.0

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY /app/package.json ./
COPY /app/package-lock.json ./
RUN npm install 

# add app
COPY . ./

# Describe which ports your application is listening on.
EXPOSE 5000

# start app
CMD ["npm", "start"]