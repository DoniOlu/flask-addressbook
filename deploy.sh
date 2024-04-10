#!/bin/sh

# Set the path to your React project and the target directory for the build files
REACT_PROJECT_PATH="services/frontend"
TARGET_DIRECTORY="services/backend"

# Step 1: Build your React project
echo "Building React project..."
cd "$REACT_PROJECT_PATH" || exit
docker build .

# Check if npm build was successful
if [ $? -ne 0 ]; then
    echo "npm build failed. Exiting..."
    exit 1
fi

# Step 2: Copy the build files to the target directory
echo "Copying build files to target directory..."
mkdir -p ../../$TARGET_DIRECTORY/static && cp -R dist/* "../../$TARGET_DIRECTORY/static"

# Check if copy operation was successful
if [ $? -ne 0 ]; then
    echo "Failed to copy build files. Exiting..."
    exit 1
fi

# Step 3: Navigate to the directory containing your docker-compose.yml and run Docker Compose
echo "Running Docker Compose..."
cd "../.." || exit
docker-compose up --build

# Check if Docker Compose was successful
if [ $? -ne 0 ]; then
    echo "Docker Compose failed. Exiting..."
    exit 1
fi

echo "Operation completed successfully."
