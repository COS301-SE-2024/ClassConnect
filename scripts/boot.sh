#!/bin/bash

# Start up the frontend
cd ../src || exit
bun run dev &

# Store the process ID (PID) of the server
next_pid=$!

# Wait for the server to start up
while ! curl -s http://localhost:5173 > /dev/null
do
  echo "Waiting for server to start up..."
  sleep 1
done

sleep 10

echo "Server has started."