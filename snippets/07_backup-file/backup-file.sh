#!/usr/bin/env bash
# Make a timestamped copy of a file: name.ext -> name.ext.20260816-153000.bak
# Usage: backup-file.sh <path>
set -euo pipefail
src="$1"

if [ ! -f "$src" ]; then
  echo "not a file: $src" >&2
  exit 1
fi

ts="$(date +%Y%m%d-%H%M%S)"
dest="${src}.${ts}.bak"
cp -p -- "$src" "$dest"
echo "$dest"
