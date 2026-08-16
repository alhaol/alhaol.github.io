#!/usr/bin/env bash
# Show the top N largest immediate subdirectories in a path.
# Usage: disk-usage-top.sh <path> [N]   (requires GNU or BSD `du`/`sort -h`)
set -euo pipefail
target="$1"
n="${2:-10}"

if [ ! -d "$target" ]; then
  echo "not a directory: $target" >&2
  exit 1
fi

du -h -d 1 -- "$target" 2>/dev/null | sort -rh | head -n "$n"
