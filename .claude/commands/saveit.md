---
description: Refresh docs, then commit & push all changes to the private InvestStack repo on GitHub.
allowed-tools: Bash, Read, Edit, Write, Grep, Glob
---

Do exactly these three things, in order. Be terse.

## 1. Update docs

- Re-read `README.md` and `CLAUDE.md`. If either is missing, create it.
- Skim the repo for anything that drifted since the last doc update (new endpoints, compose services, env vars, commands, file-tree changes). Use `git diff HEAD~5 --stat` + `git log --oneline -20` as fast signals.
- Edit `README.md` so it still reflects what the project is, how to run it, and what URLs come up. Keep it concise — user-facing.
- Edit `CLAUDE.md` so future agents see current commands, architecture, and key files. **Hard cap: 100 lines.**
- Do NOT invent features that don't exist in the code. Only document what's there.

## 2. Commit

- `git add -A` then commit with a short, specific message (`docs/feat/fix: …` style) describing what actually changed. Use a HEREDOC so newlines render.
- Include the `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` trailer.
- If pre-commit hooks fail, fix the underlying issue and create a **new** commit — never amend.

## 3. Push

- If not in a git repo yet: `git init -b main`, set remote to `git@github.com:<owner>/InvestStack.git` (private), and push with `-u origin main`. If the user's GitHub owner isn't known, ask once before pushing.
- If the remote exists: `git push`. If the branch is new, add `-u origin <branch>`.
- Never `--force` or `--no-verify`. Never push to `main` with force.

Report in one line: which files changed, the commit SHA, and the push target.
