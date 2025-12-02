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
HOURS_TODAY=$(( (NOW - TODAY_START) / 3600 ))
if [ "$HOURS_TODAY" -lt 0 ]; then
  HOURS_TODAY=0
fi

# Full days finished before today
if [ "$DAY" -gt 1 ]; then
  FULL_DAYS=$(( (DAY - 1) * DAILY_OBLIGATION ))
else
  FULL_DAYS=0
fi

OBLIGATION=$(( FULL_DAYS + HOURS_TODAY ))

if [ "$OBLIGATION" -gt $(( DAY * DAILY_OBLIGATION )) ]; then
  OBLIGATION=$(( DAY * DAILY_OBLIGATION ))
fi

# Cap by maximum obligation by weekday (Mon=1..Fri=5)

echo "Obligation: ${OBLIGATION}h"
OBLIGATION_MINUTE=$(( OBLIGATION * 60 ))
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
