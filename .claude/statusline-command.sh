#!/usr/bin/env bash
# Status line for alhaol.github.io project
# Format: [HH:MM] dir │ model ◐effort │ ⎇branch ● │ context%

input=$(cat)

# Parse JSON without jq using sed/grep
cwd=$(echo "$input" | grep -o '"current_dir":"[^"]*"' | head -1 | sed 's/"current_dir":"//;s/"//')
[ -z "$cwd" ] && cwd=$(echo "$input" | grep -o '"cwd":"[^"]*"' | head -1 | sed 's/"cwd":"//;s/"//')
[ -z "$cwd" ] && cwd=$(pwd)
dir=$(basename "$cwd")
time_now=$(date +%H:%M)

model=$(echo "$input" | grep -o '"display_name":"[^"]*"' | head -1 | sed 's/"display_name":"//;s/"//')
[ -z "$model" ] && model=$(echo "$input" | grep -o '"model_id":"[^"]*"' | head -1 | sed 's/"model_id":"//;s/"//' | sed 's/claude-sonnet-4-6/sonnet/;s/claude-opus-4-8/opus/;s/claude-haiku-4-5.*/haiku/')
[ -z "$model" ] && model="sonnet"

effort=$(echo "$input" | grep -o '"level":"[^"]*"' | head -1 | sed 's/"level":"//;s/"//')

branch=$(git -C "$cwd" --no-optional-locks rev-parse --abbrev-ref HEAD 2>/dev/null)
[ -z "$branch" ] && branch=$(git --no-optional-locks rev-parse --abbrev-ref HEAD 2>/dev/null)

used=$(echo "$input" | grep -o '"used_percentage":[0-9.]*' | head -1 | sed 's/"used_percentage"://')

# [HH:MM] dir
printf '\033[1;37m[%s]\033[0m \033[1;34m%s\033[0m' "$time_now" "$dir"

# │ model ◐effort
printf ' \033[2;37m│\033[0m \033[2;37m%s\033[0m' "$model"
if [ -n "$effort" ]; then
  effort_upper=$(echo "$effort" | tr '[:lower:]' '[:upper:]')
  printf ' \033[1;33m◐%s\033[0m' "$effort_upper"
fi

# │ ⎇branch ●
if [ -n "$branch" ]; then
  printf ' \033[2;37m│\033[0m \033[1;32m⎇%s ●\033[0m' "$branch"
fi

# │ context%
if [ -n "$used" ]; then
  used_int=$(printf '%.0f' "$used")
  if [ "$used_int" -ge 80 ]; then
    ctx_color='\033[1;31m'
  elif [ "$used_int" -ge 50 ]; then
    ctx_color='\033[1;33m'
  else
    ctx_color='\033[1;32m'
  fi
  printf " \033[2;37m│\033[0m ${ctx_color}%d%%\033[0m" "$used_int"
fi
printf '\n'
