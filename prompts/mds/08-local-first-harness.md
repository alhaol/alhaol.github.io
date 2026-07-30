# 8. The Local-First Harness

**Purpose:** Make the agent you're building with turn every repeatable step into a local script, cache or graph as it goes — so the second run is deterministic, cheap in tokens, and barely needs the agent at all.

**Use it when:**
- You're building something with a coding agent that you will run again next week, and you don't want to pay full price in tokens and re-explaining every single time.
- The work involves fetching, relating or ranking external material, and right now all of that logic lives in the chat instead of in the repo.

**Fill in first:**
- `[SOLUTION GOAL]` — what you're building and what one successful run produces (e.g. "a weekly report ranking new arXiv papers on agent memory").
- `[AGENT]` — the agent and stack you're working in (default: Claude Code, Python and bash).
- `[KNOWLEDGE SOURCES]` — the external things it reads: sites, APIs, papers, repos, internal docs (default: none decided yet — work it out with me in step 1).
- `[REPEATS]` — how often this gets re-run, and by whom (default: weekly, by me, eventually by a smaller model).

**The prompt:**

```text
You are my build agent for this: [SOLUTION GOAL]

Treat yourself as the expensive part. Every step you do by reasoning is a step I pay for again
on every future run, and one a smaller model or a tired human will get wrong. So while we build
this, your real job is to leave behind a local harness that does the work without you.

Agent and stack: [AGENT]
External sources it reads: [KNOWLEDGE SOURCES]
How often it gets re-run, and by whom: [REPEATS]

Harness means anything local and deterministic:
- bash / python / javascript scripts with real CLI arguments — one job each
- a cached knowledge base on disk: every fetched page, paper, API response, saved and reused
- a knowledge graph (entities and typed edges as JSON) when the answers depend on how things
  relate to each other
- a causal graph (directed edges, each with the assumption behind it) when the answers depend
  on what causes or changes what
- schemas and validators, so a weak model fails loudly on format instead of quietly on content
Pick the simplest one that fits. A flat JSON file beats a graph nobody queries.

Step 1 — decompose, then STOP. List every step the solution needs and mark each one:
  SCRIPT   — deterministic; written once, called forever (name the file and its arguments)
  CACHE    — an external lookup whose result belongs on disk (name the file and the key)
  GRAPH    — relations or causes worth storing as structure (say which, and why a flat table
             won't answer the question)
  JUDGMENT — genuinely needs a model to think
Then count the JUDGMENT steps and defend each one to me. Wait for my reply. Do not write the
solution in this message.

Step 2 — build the harness before the deliverable. For each SCRIPT and CACHE piece: write it,
run it, show me the command and its real output. The deliverable is built last and reads from
what those produced — it must never re-fetch or re-reason anything a harness step already settled.

The re-reasoning rule: the moment you are about to work something out that will be needed again
next run, stop and write the script instead. Say "this is a harness step" out loud when you
catch yourself.

The caching rule: the first lookup may hit the network, the second must hit disk. Every fetch
goes through a script that checks the cache first under a normalized key — never a raw call
buried inside application code.

Step 3 — prove it converged. Re-run the whole thing from the scripts alone, as if you had never
seen this conversation, and report two things: which steps still needed you, and what run 2 cost
compared with run 1. If the answer is "about the same", the harness failed and we fix it before
shipping.

Done means: I can hand the scripts, the cache and a short README to a weaker model or a new
teammate and get the same output without you. Say plainly when we're there — then name the one
harness piece most likely to go stale, and what would detect it.

Start with step 1. The decomposition only. No solution code.
```

**Example filled-in:**
> `[SOLUTION GOAL]` = "a weekly report ranking new arXiv papers on agent memory" → step 1 comes back with `tools/fetch_arxiv.py` (SCRIPT + CACHE, keyed on the normalized query), `knowledge/papers/*.json`, a small knowledge graph of paper→method→author edges justified by "ranking needs *who else built on this*, which a flat table can't answer", and exactly one JUDGMENT step: the two-line takeaway per paper. Run 2 reads the cache and the model writes eight sentences.

**Tip:** Watch the JUDGMENT list in step 1 — that's where an agent hides the work it would rather keep doing itself. "Rank the results by relevance" is not judgment, it's a scoring function nobody has written yet. Push back until every remaining JUDGMENT step is one you'd actually want a human weighing in on.
