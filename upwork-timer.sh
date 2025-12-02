#!/bin/bash

LOGFILE="/Users/aamuzakii/Library/Application Support/Upwork/Upwork/Logs/upwork..$(date +%Y%m%d).log"

# Extract the last occurrence of minutesWorkedThisWeek value
MINUTES=$(grep -o '"minutesWorkedThisWeek": [0-9]*' "$LOGFILE" \
  | awk '{print $2}' \
  | grep -v '^0$' \
  | tail -n 1)
  
echo "Minutes worked this week: $MINUTES"
if [ -n "$MINUTES" ]; then
  curl -X POST \
    -H "Content-Type: application/json" \
    -d "{\"minutesWorkedThisWeek\": $MINUTES}" \
    https://home-dashboard-lac.vercel.app/api/user/$MINUTES/4200
fi
