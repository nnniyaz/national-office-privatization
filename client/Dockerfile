# Use a Node.js base image with a specified version
FROM node:19.5.0-alpine

# Copy the entire project to the working directory
COPY . .

# Set the working directory inside the container
WORKDIR /client

# Install dependencies
RUN npm install

# Build the project
RUN npm run build

# Expose the port on which the server will run
EXPOSE 8080

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SPACE_HOST

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SPACE_HOST=$NEXT_PUBLIC_SPACE_HOST

ARG build_id
ARG commit_hash
ENV BUILD_ID=$build_id
ENV COMMIT_HASH=$commit_hash
ENV NODE_ENV production
ENV PORT 8080

# Command to run the server
CMD ["npm", "start"]