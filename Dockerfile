# Use the Node.js 14 image as a base
FROM node:18.16.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --production
RUN npm i --save-dev @types/uuid

# Copy the rest of the application files to the container
COPY . .

# Build the Next.js app (skip TypeScript type checking)
RUN npm run build

EXPOSE 3000

# Set the command to start the Next.js app
CMD ["npm", "run", "start"]