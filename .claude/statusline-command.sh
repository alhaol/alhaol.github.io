#!/usr/bin/env bash
# Claude Code status line — cybersecurity theme
# Layout: [dir ◆ branch]  [model │ ctx-bar pct% ▸ tokens  cost]  [rate-limit reset]

input=$(cat)

# Extract fields using grep/sed
CWD=$(echo "$input" | grep -o '"current_dir"\s*:\s*"[^"]*"' | sed 's/.*"\([^"]*\)".*/\1/' | head -1)
[ -z "$CWD" ] && CWD=$(echo "$input" | grep -o '"cwd"\s*:\s*"[^"]*"' | sed 's/.*"\([^"]*\)".*/\1/' | head -1)

MODEL_ID=$(echo "$input" | grep -o '"id"\s*:\s*"[^"]*"' | sed 's/.*"\([^"]*\)".*/\1/' | head -1 | tr '[:upper:]' '[:lower:]')
MODEL_FULL=$(echo "$input" | grep -o '"display_name"\s*:\s*"[^"]*"' | sed 's/.*"\([^"]*\)".*/\1/' | head -1)
MODEL_SHORT=$(echo "$MODEL_FULL" | sed 's/^[Cc]laude\s\+//')
MODEL=$(echo "$MODEL_SHORT" | tr ' ' '_')

USED_PCT=""  # will be set from five_hour rate-limit percentage below
CTX_USED_PCT=$(echo "$input" | grep -o '"used_percentage"\s*:\s*[0-9.]*' | sed 's/.*:\s*\([0-9.]*\).*/\1/' | head -1)
TOTAL_IN=$(echo "$input" | grep -o '"total_input_tokens"\s*:\s*[0-9]*' | sed 's/.*:\s*\([0-9]*\).*/\1/' | head -1)
TOTAL_OUT=$(echo "$input" | grep -o '"total_output_tokens"\s*:\s*[0-9]*' | sed 's/.*:\s*\([0-9]*\).*/\1/' | head -1)
SESSION_ELAPSED=$(echo "$input" | grep -o '"elapsed_ms"\s*:\s*[0-9]*' | sed 's/.*:\s*\([0-9]*\).*/\1/' | head -1)
SESSION_IN=$(echo "$input" | grep -o '"session_input_tokens"\s*:\s*[0-9]*' | sed 's/.*:\s*\([0-9]*\).*/\1/' | head -1)
SESSION_OUT=$(echo "$input" | grep -o '"session_output_tokens"\s*:\s*[0-9]*' | sed 's/.*:\s*\([0-9]*\).*/\1/' | head -1)

# Rate-limit based session budget: extract five_hour used_percentage
FIVE_HOUR_PCT=$(echo "$input" | grep -o '"five_hour"\s*:\s*{[^}]*}' | grep -o '"used_percentage"\s*:\s*[0-9.]*' | sed 's/.*:\s*\([0-9.]*\).*/\1/' | head -1)
# Use five_hour rate-limit % as the session usage percentage for the bar
[ -n "$FIVE_HOUR_PCT" ] && USED_PCT="$FIVE_HOUR_PCT"

TOTAL_IN=${TOTAL_IN:-0}
TOTAL_OUT=${TOTAL_OUT:-0}
SESSION_IN=${SESSION_IN:-0}
SESSION_OUT=${SESSION_OUT:-0}

# Session consumption = total tokens in current context window
TOTAL_CTX=$((TOTAL_IN + TOTAL_OUT))

# Back-calculate session budget from rate-limit percentage if available
SESSION_BUDGET=0
if [ -n "$FIVE_HOUR_PCT" ] && [ "$TOTAL_CTX" -gt 0 ]; then
  PCT_CHECK=$(awk "BEGIN {printf \"%.4f\", $FIVE_HOUR_PCT}")
  if awk "BEGIN {exit !($PCT_CHECK > 0)}"; then
    SESSION_BUDGET=$(awk "BEGIN {printf \"%.0f\", $TOTAL_CTX / ($FIVE_HOUR_PCT / 100)}")
  fi
fi

# Format session consumption
TOK_USED_STR=""
if [ "$TOTAL_CTX" -ge 1000000 ]; then
  TOK_USED_STR=$(awk "BEGIN {printf \"%.1fM\", $TOTAL_CTX / 1000000}")
elif [ "$TOTAL_CTX" -ge 1000 ]; then
  TOK_USED_STR=$(awk "BEGIN {printf \"%.0fk\", $TOTAL_CTX / 1000}")
elif [ "$TOTAL_CTX" -gt 0 ]; then
  TOK_USED_STR="$TOTAL_CTX"
fi

# Format session budget
SESSION_BUDGET_STR=""
if [ "$SESSION_BUDGET" -ge 1000000 ]; then
  SESSION_BUDGET_STR=$(awk "BEGIN {printf \"%.1fM\", $SESSION_BUDGET / 1000000}")
elif [ "$SESSION_BUDGET" -ge 1000 ]; then
  SESSION_BUDGET_STR=$(awk "BEGIN {printf \"%.0fk\", $SESSION_BUDGET / 1000}")
elif [ "$SESSION_BUDGET" -gt 0 ]; then
  SESSION_BUDGET_STR="$SESSION_BUDGET"
fi

# Session elapsed time
EFFORT_LEVEL=$(echo "$input" | grep -o '"level"\s*:\s*"[^"]*"' | sed 's/.*"\([^"]*\)".*/\1/' | head -1)

EFFORT=""
if [ -n "$SESSION_ELAPSED" ] && [ "$SESSION_ELAPSED" -gt 0 ]; then
  ELAPSED_SEC=$((SESSION_ELAPSED / 1000))
  if [ "$ELAPSED_SEC" -ge 3600 ]; then
    EFFORT=$(printf "%dh%02dm" $((ELAPSED_SEC / 3600)) $(((ELAPSED_SEC % 3600) / 60)))
  elif [ "$ELAPSED_SEC" -ge 60 ]; then
    EFFORT=$(printf "%dm%02ds" $((ELAPSED_SEC / 60)) $((ELAPSED_SEC % 60)))
  else
    EFFORT=$(printf "%ds" "$ELAPSED_SEC")
  fi
fi

# Session tokens used
SESSION_TOTAL=$((SESSION_IN + SESSION_OUT))
SESSION_TOKENS=""
if [ "$SESSION_TOTAL" -ge 1000000 ]; then
  SESSION_TOKENS=$(awk "BEGIN {printf \"%.1fM\", $SESSION_TOTAL / 1000000}")
elif [ "$SESSION_TOTAL" -ge 1000 ]; then
  SESSION_TOKENS=$(awk "BEGIN {printf \"%.0fk\", $SESSION_TOTAL / 1000}")
elif [ "$SESSION_TOTAL" -gt 0 ]; then
  SESSION_TOKENS="$SESSION_TOTAL"
fi


# Context window bar (model context usage)
CTX_BAR=""
CTX_INT=""
if [ -n "$CTX_USED_PCT" ]; then
  CTX_FILLED=$(awk "BEGIN {printf \"%.0f\", $CTX_USED_PCT / 100 * 10}")
  for ((i=0; i<CTX_FILLED; i++)); do CTX_BAR+="█"; done
  for ((i=0; i<10-CTX_FILLED; i++)); do CTX_BAR+="░"; done
  CTX_INT=$(awk "BEGIN {printf \"%.0f\", $CTX_USED_PCT}")
fi

# Session budget bar (five_hour rate-limit)
BAR=""
if [ -n "$USED_PCT" ]; then
  FILLED=$(awk "BEGIN {printf \"%.0f\", $USED_PCT / 100 * 10}")
  for ((i=0; i<FILLED; i++)); do BAR+="█"; done
  for ((i=0; i<10-FILLED; i++)); do BAR+="░"; done
fi

USED=""
[ -n "$USED_PCT" ] && USED=$(awk "BEGIN {printf \"%.0f\", $USED_PCT}")

# Rate-limit reset
RESET_AT=$(echo "$input" | grep -o '"resets_at"\s*:\s*[0-9]*' | sed 's/.*:\s*\([0-9]*\).*/\1/' | head -1)
RESET=""
if [ -n "$RESET_AT" ] && [ "$RESET_AT" -gt 0 ]; then
  NOW=$(date +%s)
  REMAINING=$((RESET_AT - NOW))
  if [ "$REMAINING" -gt 0 ]; then
    HOURS=$((REMAINING / 3600))
    MINS=$(((REMAINING % 3600) / 60))
    if [ "$HOURS" -gt 0 ]; then
      RESET=$(printf "%dh%02dm" "$HOURS" "$MINS")
    else
      RESET=$(printf "%dm" "$MINS")
    fi
  fi
fi

MODEL=${MODEL//_/ }
[ -z "$CWD" ] && CWD=$(pwd)
DIR=$(basename "$CWD")

BRANCH=""
if git -C "$CWD" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  BRANCH=$(git -C "$CWD" -c core.fsmonitor=false symbolic-ref --short HEAD 2>/dev/null \
           || git -C "$CWD" -c core.fsmonitor=false rev-parse --short HEAD 2>/dev/null)
fi

# --- ANSI palette (cybersecurity / dark-terminal theme) ---
RS=$'\033[0m'
BOLD=$'\033[1m'
DIM=$'\033[2m'
GREEN=$'\033[38;5;82m'    # bright lime-green  (primary accent, matches portfolio)
TEAL=$'\033[38;5;51m'     # electric cyan      (model name)
GRAY=$'\033[38;5;245m'    # mid gray           (separators / labels)
WHITE=$'\033[38;5;252m'   # near-white         (tokens, general values)
YELLOW=$'\033[38;5;220m'  # gold               (cost)
AMBER=$'\033[38;5;214m'   # amber              (context mid warning)
RED=$'\033[38;5;196m'     # vivid red          (context high warning)
BLUE=$'\033[38;5;75m'     # steel blue         (rate-limit reset)
SEP="${GRAY}│${RS}"        # zone separator
DOT="${GRAY}◆${RS}"        # dir/branch joiner
ARR="${GRAY}▸${RS}"        # inline metric joiner

# ── Zone 1: location ────────────────────────────────────────────
printf "${BOLD}${GREEN}%s${RS}" "$DIR"
if [ -n "$BRANCH" ]; then
  printf " %s ${WHITE}%s${RS}" "$DOT" "$BRANCH"
fi

# ── Zone 2: model │ context │ tokens  cost ──────────────────────
if [ -n "$MODEL" ]; then
  printf "  %s ${TEAL}%s${RS}" "$SEP" "$MODEL"
  # Effort circle: color-coded by effort level, with effort level label
  case "$EFFORT_LEVEL" in
    low)    printf " ${GREEN}● LOW${RS}" ;;
    medium) printf " ${YELLOW}● MEDIUM${RS}" ;;
    high)   printf " ${RED}● HIGH${RS}" ;;
    xhigh)  printf " ${RED}● XHIGH${RS}" ;;
    max)    printf " ${RED}● MAX${RS}" ;;
    *)      printf " ${GRAY}● ${EFFORT_LEVEL}${RS}" ;;
  esac
fi

# Context window bar (model ctx usage) — before session budget bar
if [ -n "$CTX_INT" ]; then
  if   [ "$CTX_INT" -ge 80 ]; then ctx_bar_color="$RED"
  elif [ "$CTX_INT" -ge 50 ]; then ctx_bar_color="$AMBER"
  else                               ctx_bar_color="$GREEN"
  fi
  printf " %s ${ctx_bar_color}%s${RS} ${GRAY}%s%%${RS}" "$SEP" "$CTX_BAR" "$CTX_INT"
fi

# Session budget bar (five_hour rate-limit)
if [ -n "$USED" ]; then
  used_int=$(printf '%.0f' "$USED")
  if   [ "$used_int" -ge 80 ]; then ses_color="$RED"
  elif [ "$used_int" -ge 50 ]; then ses_color="$AMBER"
  else                               ses_color="$GREEN"
  fi
  printf " %s ${ses_color}%s${RS} ${GRAY}%s%%${RS}" "$SEP" "$BAR" "$used_int"
fi

# Session token consumption / session budget
if [ -n "$TOK_USED_STR" ]; then
  if [ -n "$SESSION_BUDGET_STR" ]; then
    printf "  ${YELLOW}%s/%s tokens${RS}" "$TOK_USED_STR" "$SESSION_BUDGET_STR"
  else
    printf "  ${YELLOW}%s tokens${RS}" "$TOK_USED_STR"
  fi
fi

# ── Zone 2.5: session effort & tokens (this session) ──────────────
if [ -n "$EFFORT" ]; then
  printf "  %s ${DIM}%s${RS}" "$SEP" "$EFFORT"
fi

if [ -n "$SESSION_TOKENS" ]; then
  printf " %s ${WHITE}%s${RS}" "$ARR" "$SESSION_TOKENS"
fi

# ── Zone 3: rate-limit reset (only when present) ────────────────
if [ -n "$RESET" ]; then
  printf "  %s ${BLUE}%s${RS}" "$SEP" "$RESET"
fi
