#!/bin/bash


# Weekly obligation target
WEEKLY_OBLIGATION=40   # hours
DAILY_OBLIGATION=8     # hours per weekday

# Current time
NOW=$(date +%s)

# Start time = Monday 7 AM of the current week
START=$(date -vmon -v7H -v0M -v0S +%s)

DAY=$(date +%u)

# Calculate obligation based on full previous weekdays + hours today
TODAY_START=$(date -v7H -v0M -v0S +%s)
MINUTES_TODAY=$(( (NOW - TODAY_START) / 60 ))
HOURS_TODAY=$(echo "$MINUTES_TODAY / 60" | bc -l)
if [ "$HOURS_TODAY" = "" ] || (( $(echo "$HOURS_TODAY < 0" | bc -l) )); then
  HOURS_TODAY=0
fi

# Full days finished before today
if [ "$DAY" -gt 1 ]; then
  FULL_DAYS=$(( (DAY - 1) * DAILY_OBLIGATION ))
else
  FULL_DAYS=0
fi

OBLIGATION=$(echo "$FULL_DAYS + $HOURS_TODAY" | bc -l)

if (( $(echo "$OBLIGATION > $(( DAY * DAILY_OBLIGATION ))" | bc -l) )); then
  OBLIGATION=$(( DAY * DAILY_OBLIGATION ))
fi

# Cap by maximum obligation by weekday (Mon=1..Fri=5)

echo "Obligation: ${OBLIGATION}h"
OBLIGATION_MINUTE=$(echo "$OBLIGATION * 60" | bc)
LOGFILE="/Users/aamuzakii/Library/Application Support/Upwork/Upwork/Logs/upwork..$(date +%Y%m%d).log"

# Extract the last occurrence of minutesWorkedThisWeek value
MINUTES=$(grep -o '"minutesWorkedThisWeek": [0-9]*' "$LOGFILE" \
  | awk '{print $2}' \
  | grep -v '^0$' \
  | tail -n 1)
  
echo "Minutes worked this week: $MINUTES"
if [ -n "$MINUTES" ]; then
  RESPONSE=$(curl -s -X GET \
    -H "Content-Type: application/json" \
    https://home-dashboard-lac.vercel.app/api/user/$MINUTES/$OBLIGATION_MINUTE)

  echo "Response: $RESPONSE"
fi
