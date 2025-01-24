#!/bin/bash

REMOTE=${REMOTE:-"http://localhost:5555"}

echo "Using remote: $REMOTE"

# Define the sender address and chain
SENDER="0xE2Ed962948005AB01F2cEfE8326a0730B7D268af" 
CHAIN="optimism-mainnet (10)"

# Create a timestamp for the log file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="reports/stream_check_${TIMESTAMP}.log"

# Ensure reports directory exists
mkdir -p reports

# Check if server is running with verbose output
echo "Testing server connection..." | tee -a "$LOG_FILE"
curl -v "$REMOTE" 2>&1 | tee -a "$LOG_FILE"

echo "Starting stream check at $(date)" | tee -a "$LOG_FILE"
echo "----------------------------------------" | tee -a "$LOG_FILE"

echo "Checking streams for address: $SENDER on $CHAIN" | tee -a "$LOG_FILE"

# Send POST request to localhost with verbose output and proper error handling
response=$(curl -v -X POST \
    -H "Content-Type: application/json" \
    -d "{\"chainString\": \"$CHAIN\", \"sender\": \"$SENDER\"}" \
    "$REMOTE/check-sender-streams" 2>&1)

# Capture the exit code
curl_exit_code=$?

# Log the complete response and curl exit code
echo "Curl exit code: $curl_exit_code" | tee -a "$LOG_FILE"
echo "Response:" | tee -a "$LOG_FILE"
echo "$response" | tee -a "$LOG_FILE"

# Check for curl errors
if [ $curl_exit_code -ne 0 ]; then
    echo "Error: Failed to connect to the server (Exit code: $curl_exit_code)" | tee -a "$LOG_FILE"
    exit 1
fi

echo "----------------------------------------" | tee -a "$LOG_FILE"
echo "Check complete. Results saved to $LOG_FILE"