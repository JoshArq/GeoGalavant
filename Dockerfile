# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Install git
RUN apt-get update && apt-get install -y git

# Clone the application code from the GitHub repository
RUN git clone https://github.com/JoshArq/GeoGalavant .
RUN git checkout sysadmin
WORKDIR /usr/src/app/
RUN npm install
#RUN npm run all
CMD ["npm", "run", "all"]

# Expose the port that your Node.js app listens on
EXPOSE 3000


