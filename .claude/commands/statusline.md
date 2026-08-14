# /statusline

Print the current status line on demand (the same script Claude Code runs on every redraw of the bottom status bar).

```bash
bash .claude/statusline-command.sh
```

**Display format:** `dir ◆ branch │ model ● EFFORT │ ctx-bar % │ tokens │ session │ reset-timer`

**Zones:**

| Zone | Shows |
|---|---|
| `dir ◆ branch` | Current directory name, joined to the git branch |
| `model ● EFFORT` | Active model, and an effort circle colored by level (🟢 LOW, 🟡 MEDIUM, 🔴 HIGH/XHIGH/MAX) |
| `ctx-bar %` | Context window usage, 10-segment bar, green under 50%, amber 50-80%, red 80%+ |
| `session-bar %` | Five-hour rate-limit budget used, same bar/color scheme |
| `tokens` | Session token consumption over the back-calculated session budget |
| `elapsed ▸ tokens` | Session elapsed time and total session tokens |
| `reset-timer` | Time until the five-hour rate-limit window resets |

Source: [github.com/alhaol/md-skills](https://github.com/alhaol/md-skills) `tools/statusline-command.sh` (canonical; this project mirrors it locally at `.claude/statusline-command.sh`).
