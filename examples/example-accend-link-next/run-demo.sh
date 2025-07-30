#!/bin/bash

# Accend Link Next.js Demo Runner
# This script starts the Next.js development server

echo "🚀 Starting Accend Link Next.js Demo..."
echo "📝 Make sure to update the customerAccessToken in src/app/page.tsx"
echo "🌐 Demo will be available at http://localhost:3000"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the development server
echo "▶️  Starting Next.js development server..."
npm run dev 