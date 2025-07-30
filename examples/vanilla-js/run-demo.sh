#!/bin/bash

# Accend Link Vanilla JS Demo Runner
# This script starts a simple HTTP server to serve the demo

echo "🚀 Starting Accend Link Vanilla JS Demo..."
echo "📝 Make sure to update the customerAccessToken in index.html"
echo "🌐 Demo will be available at http://localhost:8080"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the HTTP server
echo "▶️  Starting HTTP server..."
npm start 