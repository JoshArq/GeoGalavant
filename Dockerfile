# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Install git
RUN apt-get update && apt-get install -y git

# Clone the application code from the GitHub repository
RUN git clone -b clustertesting https://github.com/JoshArq/GeoGalavant .
WORKDIR /usr/src/app/

# Install dependencies
RUN npm install
RUN npm install -g react-scripts react react-bootstrap react-dom react-router-dom
WORKDIR /usr/src/app/client/
RUN npm install
WORKDIR /usr/src/app/

# Expose the port that your Node.js app listens on
EXPOSE 3000

# Run server and client scripts
CMD node Server/index.js & cd ./client && npm start

