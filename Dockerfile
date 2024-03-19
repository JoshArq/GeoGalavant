# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Install git
RUN apt-get update && apt-get install -y git

# Clone the application code from the GitHub repository
RUN git clone https://github.com/JoshArq/GeoGalavant .

# Install dependencies
WORKDIR /usr/src/app/client
RUN npm install
CMD ["npm", "run", "server"]
# Expose the port that your Node.js app listens on
WORKDIR /usr/src/app/client
RUN npm install
EXPOSE 3000
CMD ["npm","start"]
