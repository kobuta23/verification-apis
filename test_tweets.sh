#!/bin/bash

# Define the context
# CONTEXT="The post is about \$FLUID, the 0xFluid token."
CONTEXT="The tweet is about $HYPE or contains the word $HYPE, which is the HyperLiquid token. The tweet is expressing an opinion specifically about the token itself. It isn't relevant if it's about HyperLiquid but not the token itself"
# Array of tweet URLs
# TWEETS=(
#     "https://x.com/litocoen/status/1864065160471851288"
#     "https://x.com/nonstopTheo/status/1874155274308829631"
#     "https://x.com/0xfluid/status/1864009746988372448"
#     "https://x.com/PageOf_History/status/1874444656907567246"
# )
TWEETS=(
    "https://x.com/stacy_muur/status/1874415033427656887" # positive
    "https://x.com/fiege_max/status/1874481896970973655" # negative
    "https://x.com/CapitalMonet/status/1874570326589456581" # unclear
    "https://x.com/wesyang/status/1874679493203197980" # irrelevant
)

# Create a timestamp for the log file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="reports/tweet_analysis_${TIMESTAMP}.log"

# Check if server is running
if ! curl -s "http://localhost:3000" > /dev/null; then
    echo "Error: Server is not running on localhost:3000" | tee -a "$LOG_FILE"
    exit 1
fi

echo "Starting tweet analysis at $(date)" | tee -a "$LOG_FILE"
echo "----------------------------------------" | tee -a "$LOG_FILE"

# Test each tweet
for tweet in "${TWEETS[@]}"; do
    echo "Testing tweet: $tweet" | tee -a "$LOG_FILE"
    
    # Send POST request to localhost with error handling
    response=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "{\"url\": \"$tweet\", \"context\": \"$CONTEXT\"}" \
        http://localhost:3000/analyze-sentiment)
    
    echo "$response" | tee -a "$LOG_FILE"
    
    echo "----------------------------------------" | tee -a "$LOG_FILE"
    
    # Add a small delay between requests
    sleep 1
done

echo "Analysis complete. Results saved to $LOG_FILE" 