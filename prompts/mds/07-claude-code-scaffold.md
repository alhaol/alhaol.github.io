# 7. The Claude Code Scaffold

**Purpose:** Stand up a working Claude Code setup in an existing repo — persistent memory, workflow skills, state files, editor tasks — with a mandatory audit first so nothing already in the repo gets overwritten.

**Use it when:**
- You're adding Claude Code to a repo that already has history, and a blind scaffold would clobber files.
- Every session starts with you re-explaining the project because nothing carries over between them.

**Fill in first:**
- `[PROJECT]` — the repo to set up, by path or name (e.g. "C:/work/billing-api").
- `[SKILL LIST]` — the workflow skills you want, one per line, each with its one-line job (default: resume — brief me on where we left off; suspend — write the exact stopping point; janitor — pull scattered TODOs into one place).
- `[STATE FILES]` — the markdown files that carry context between sessions (default: STATUS.md for where we stopped, ARCHITECTURE.md for how it fits together, IDEAS.md for parked work).

**The prompt:**

```text
Set up Claude Code properly in [PROJECT].

I want three things that outlive a single session: persistent memory, reusable skills for
the work I repeat, and state files you actually read before answering.

Skills to create: [SKILL LIST]
State files to create: [STATE FILES]

DO NOT CREATE OR MODIFY ANYTHING YET.

Step 1 — audit, then STOP. Look at what is already in the repo and report back:
- Does a CLAUDE.md, .claude/ directory, or skills directory already exist? If so, what is in
  it, and is it project-level or user-level?
- Which of the files I asked for already exist, and what would be LOST if you overwrote them?
- What does the repo's existing structure tell you about how it actually works — the parts a
  memory file would need to state so a cold session gets them right?
Then wait for my reply. Do not propose the plan in the same message as the audit.

Step 2 — after I respond, propose the plan as a file tree: every path you would create, every
path you would modify, and for each modified path, what survives. Flag anything you'd rather
merge than replace. Then STOP and wait for my approval. If I approved a path in step 1 that
your own audit shows is destructive, say so instead of doing it.

Step 3 — only once I approve, create the files. Rules while writing:
- CLAUDE.md states rules you must follow and facts a cold session cannot infer. It is not a
  README and not a summary of the code — if a line would be obvious from reading the repo,
  cut it.
- Each skill gets a trigger ("fire when I say X"), the exact steps, and its stop condition.
  A skill that just says "help with X" is filler; delete it rather than ship it.
- The state files start with real content taken from this repo, not empty headings.

Step 4 — prove it works. Tell me exactly what to type to test each skill, and what I should
see if it worked. Then name the one thing most likely to rot first, and what keeps it honest.

Start with step 1. Audit only. No files.
```

**Example filled-in:**
> `[PROJECT]` = "a Django API with an existing CLAUDE.md" → the audit comes back with "you already have a CLAUDE.md with 40 lines of deployment rules — the scaffold I was asked for would replace it; I suggest appending a Session State section instead", which is the answer you actually needed and would never have got from a prompt that just started writing files.

**Tip:** The audit step is the whole point — skipping it is how a scaffold silently eats a CLAUDE.md someone spent months tuning. If the model starts creating files in its first reply, stop it and say "step 1 was audit only."
