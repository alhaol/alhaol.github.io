# My Prompts — a working-partner library

Copy-paste prompts that make a chat AI work *with* you rather than at you: they ask before they
tell, wait for your reply, and won't hand over the answer until you've genuinely tried. Each prompt
is a standalone file you can open, fill in the `[BRACKETS]`, and paste into any model.

<!-- PROMPTS:COUNT:START -->
**7 prompts** across 2 categories: Learning, Workflow.
<!-- PROMPTS:COUNT:END -->

**Start at the hub:** [`index.html`](index.html) renders them all from the markdown below, fills in
the blanks for you, and copies the finished prompt in one click. Serve the site and open
`/prompts/`:

```bash
python -m http.server 8000   # then open http://localhost:8000/prompts/
```

Prefer prose? **[Guide.md](Guide.md)** explains the shared idea, which prompt to use when, and how
to chain them into a full learn → practice → verify loop.

## The prompts

> Generated from `prompts.json` by the `create-prompt` skill — edit the registry, not this table.

<!-- PROMPTS:TABLE:START -->
| # | Prompt | Category | Purpose |
|---|--------|----------|---------|
| 1 | [The Learning Curve Destroyer](mds/01-learning-curve-destroyer.md) | Learning | Get functional fast — the 20% that matters, the rabbit holes to skip, and one high-leverage exercise. |
| 2 | [The Real Error Simulator](mds/02-real-error-simulator.md) | Learning | Dropped into realistic tasks where you'll slip, then questioned — never told — until it sticks. |
| 3 | [The Impossible Language Translator](mds/03-impossible-language-translator.md) | Learning | The single keystone idea in plain language, then a quiz to prove you actually got it. |
| 4 | [The Personal Learning Path Architect](mds/04-personal-learning-path-architect.md) | Learning | A 7-day plan: one 45-minute task a day, each with a done-criterion and a don't-do-this guardrail. |
| 5 | [The Hidden Gap Detector](mds/05-hidden-gap-detector.md) | Learning | Five deceptively simple questions that expose the gaps of someone who never truly went deep. |
| 6 | [The Forced Feynman Method](mds/06-forced-feynman-method.md) | Learning | Explain it simply while the AI catches every jargon crutch, skipped step and hidden oversimplification. |
| 7 | [The Claude Code Scaffold](mds/07-claude-code-scaffold.md) | Workflow | Stand up memory, skills and state files in an existing repo — with an audit that stops it overwriting what's already there. |
<!-- PROMPTS:TABLE:END -->

## Layout

| Path | Purpose |
|------|---------|
| `index.html` | The hub — searchable, category-filtered icon card grid; opens each prompt with a fill-in-the-blanks form, live preview and copy button. The Guide's method, chain and tips are folded into a disclosure so the default view stays minimal. |
| `prompts.json` | Registry driving the grid (`num`, `slug`, `file`, `title`, `tagline`, `situation`, `icon`, `stage`, `category`, `tags`). Category pills are derived from it, so a new category needs no HTML change. |
| `mds/*.md` | The prompts themselves — the single source of truth the hub fetches and parses at runtime. |
| `Guide.md` | Long-form guide: the method, which-prompt-when, chaining, and how to add a prompt. |
| `_not_approved/` | Gitignored staging for drafts awaiting approval. |

## Adding a prompt

Run the **`create-prompt`** skill — `/create-prompt <what the prompt should achieve>`. It allocates
the next number, writes the markdown in the required shape, stages it for approval, then registers
it and regenerates every table above. See [Guide.md](Guide.md#adding-a-prompt) for the manual route
and the file-shape contract.

## How to use

1. Open the hub, click a prompt, and fill the fields — or copy the block inside a file's
   ```` ```text ```` fence and replace every `[PLACEHOLDER]` by hand.
2. Paste into a **fresh** chat.
3. Play along — answer each question and wait. The value is in the loop.

> These were tuned for efficiency and accuracy: explicit AI role, hard "ask one question and wait"
> guardrails, clear stop/success conditions, and anti-cheat rules so the model can't shortcut the
> struggle that makes learning stick.
