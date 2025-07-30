#!/bin/bash

# Change to the root directory
cd /Users/robo/doobu/robin/link

# Build the main library
echo "Building the main library..."
npm run build

# Start the main server in the background
echo "Starting the main server..."
npm run start &
MAIN_SERVER_PID=$!

# Wait a moment to ensure the main server is up
sleep 2

# Start the React demo
echo "Starting the React demo..."
cd examples/react-wrapper && npm run start

# Cleanup when the script is terminated
trap "kill $MAIN_SERVER_PID; echo 'Servers stopped.'" EXIT 