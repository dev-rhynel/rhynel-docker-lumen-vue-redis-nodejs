#!/bin/bash

# Function to run commands in background and store PID
run_background() {
    eval "$@" &
    echo $!
}

# Start backend
cd backend/lumen
echo "Starting backend server..."
php -S localhost:8000 -t public &
BACKEND_PID=$!

# Start frontend
cd ../../frontend
echo "Installing frontend dependencies..."
npm install
echo "Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
