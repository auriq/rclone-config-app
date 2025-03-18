#!/bin/bash

echo "Finding backup app processes..."

# Find and kill node process running electron
NODE_PIDS=$(pgrep -f "node.*electron .")
if [ ! -z "$NODE_PIDS" ]; then
    echo "Found node processes:"
    ps -p $NODE_PIDS
    kill $NODE_PIDS
fi

# Find and kill Electron processes
ELECTRON_PIDS=$(pgrep -f "Electron\.(app|Helper)")
if [ ! -z "$ELECTRON_PIDS" ]; then
    echo "Found Electron processes:"
    ps -p $ELECTRON_PIDS
    kill -9 $ELECTRON_PIDS
fi

# Verify all processes are killed
sleep 1
NODE_CHECK=$(pgrep -f "node.*electron .")
ELECTRON_CHECK=$(pgrep -f "Electron\.(app|Helper)")

if [ -z "$NODE_CHECK" ] && [ -z "$ELECTRON_CHECK" ]; then
    echo "All app processes killed successfully"
else
    echo "Some processes might still be running:"
    ps aux | grep -E "node.*electron|Electron\.(app|Helper)" | grep -v grep
fi