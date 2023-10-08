# Use the Node.js LTS image as a base
FROM node:lts

# Set working directory to /src
WORKDIR /src/app

# Copy package.json and package-lock.json to the working directory
COPY ./app/package*.json /src/app

# Install app dependencies
RUN npm install

# Copy app source
COPY ./app /src/app

# Expose port to outside world
EXPOSE 3000

# Start command as per the package.json file
CMD ["node", "index.js"]