#!/bin/bash
set -e

# Saudi
echo -n "t78B3ze7niWamv2pjpu4NtAvFAqgyLlLRGHQIWdm8aL" | npx firebase-tools@latest functions:secrets:set BUFFER_API_KEY_SAUDI --project zamra-web-01 --force
echo "Saudi key set."

# UAE
echo -n "tIkSwpyxgYsuKl8P73OAW7w8JOHKDaTQI2mMYvNAvsT" | npx firebase-tools@latest functions:secrets:set BUFFER_API_KEY_UAE --project zamra-web-01 --force
echo "UAE key set."

# Qatar
echo -n "B4xYAfJq2908cR8R7waGXWgdif4308uD4UK_CqZrfcg" | npx firebase-tools@latest functions:secrets:set BUFFER_API_KEY_QATAR --project zamra-web-01 --force
echo "Qatar key set."

# Oman
echo -n "bOQtX6AiJNo3M-QieIolZ3xCWBQz_-oKWBjmfC6ucU1" | npx firebase-tools@latest functions:secrets:set BUFFER_API_KEY_OMAN --project zamra-web-01 --force
echo "Oman key set."
