FROM ubuntu:focal

# Update packages and install necessary dependencies
RUN apt-get update && apt-get install -y curl git

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get upgrade -y && \
    apt-get install -y nodejs

# Set working directory
WORKDIR /home/app

# Copy scripts
COPY script.js script.js
COPY pushToStorage.js pushToStorage.js

# Ensure the scripts are executable
RUN chmod +x script.js

# Initialize npm and install dependencies
RUN npm config set registry https://registry.npmjs.org/ && \
    npm cache clean --force && \
    npm init -y && \
    npm install --no-fund --no-audit @google-cloud/storage