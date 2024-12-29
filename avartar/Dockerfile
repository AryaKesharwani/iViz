# Use the official Node.js image as the base image
FROM --platform=linux/amd64 node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies needed for ffmpeg
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy the 'bin' folder (that contains the Rhubarb binary) to the container
COPY ./bin2 /app/bin
# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your application code into the container
COPY . .


# Define build-time variables with default values
ARG GEMINI_API_KEY=AIzaSyCSg7xQ5Cvpe9lrPuDaB-o3bVybVPX5gN8
ARG ELEVEN_LABS_API_KEY=dsk_52aaf5d2b86f9e744527d0c3b0835fceee1a7d045f6aeb7d
ARG VOICE_ID=MXGyTMlsvQgQ4BL0emIa
ARG CLIENT_URL=http://localhost:5173

# Pass build-time arguments as environment variables
ENV GEMINI_API_KEY=$GEMINI_API_KEY
ENV ELEVEN_LABS_API_KEY=$ELEVEN_LABS_API_KEY
ENV VOICE_ID=$VOICE_ID
ENV CLIENT_URL=$CLIENT_URL

# Expose the port your src runs on (assuming it's 3000)
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "run", "dev"]