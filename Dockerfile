# Use an Image, that contains Node.js, npm and the OS
FROM node:20-alpine

# Set working directory in Docker container
WORKDIR /wish-list-tg

# Hire dependencies
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application to the container
COPY . .

# Run the application. The words must be separated by a "space"
CMD ["npm", "run", "start"]