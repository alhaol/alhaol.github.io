#!/usr/bin/env bash
# Check TCP reachability of host:port within a timeout.
# Usage: port-check.sh <host> <port> [timeout_seconds]
set -euo pipefail
host="$1"
port="$2"
timeout_s="${3:-3}"

if timeout "$timeout_s" bash -c 'exec 3<>"/dev/tcp/$1/$2"' _ "$host" "$port" 2>/dev/null; then
  echo "open"
else
  echo "closed"
  exit 1
fi
