#!/bin/bash
PROJECT="/root/services/"

# Navigate to the parent directory and pull the latest changes
cd $PROJECT || { echo "Failed to navigate to parent directory"; exit 1; }
echo -e "Pulling latest changes from git..."
/usr/bin/git pull || { echo "Git pull failed"; exit 1; }

# Navigate to the frontend directory and run the build command
cd frontend || { echo "Failed to navigate to frontend directory"; exit 1; }
echo -e "Running npm build in frontend..."
npm run build || { echo "npm build failed"; exit 1; }

# Navigate to the backend directory
cd ../backend || { echo "Failed to navigate to backend directory"; exit 1; }

# Remove existing files in backend/src/client/dist
echo -e "Removing old files in backend/src/client/dist..."
rm -rf ./src/client/dist || { echo "Failed to remove old files"; exit 1; }

# Copy the build files from frontend/dist to backend/src/client/dist
echo -e "Copying files from frontend/dist to backend/src/client/dist..."
cp -r ../frontend/dist ./src/client || { echo "File copy failed"; exit 1; }

# Killing existing backend if it exists
echo -e "Killing existing backend if exists..."
pkill -f node || { echo "found nothing to kill"; }

# Run the backend start command
echo -e "Starting the backend..."
npm run start || { echo "npm start failed"; exit 1; }
