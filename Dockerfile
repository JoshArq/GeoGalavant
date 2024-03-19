# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Install git
RUN apt-get update && apt-get install -y git

# Clone the application code from the GitHub repository
RUN git clone https://github.com/JoshArq/GeoGalavant .
WORKDIR /usr/src/app/
RUN npm install
CMD ["npm", "start"]

# Client
# Install dependencies
WORKDIR /usr/src/app/client
RUN npm install

# Expose the port that your Node.js app listens on
EXPOSE 3000

# Command to run your Node.js application
CMD ["npm", "start"]

