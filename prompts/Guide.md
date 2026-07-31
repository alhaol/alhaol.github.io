# Guide — How to use these prompts

Copy-paste prompts that make a chat AI work *with* you rather than at you. Each one lives in its
own file under [`mds/`](mds/). This guide explains the shared idea behind them, which one to reach
for, how to fill them in, and how to chain them into a full learning loop.

<!-- PROMPTS:COUNT:START -->
**9 prompts** across 3 categories: Learning, Workflow, Writing.
<!-- PROMPTS:COUNT:END -->

> **Use the hub instead of copying by hand.** [`index.html`](index.html) renders every prompt from
> these same markdown files and adds the fiddly part: a form for the `[PLACEHOLDER]` blanks that
> substitutes as you type, a one-click copy of the finished text, and a hand-off straight into a
> new chat. Serve the site (`python -m http.server 8000`) and open
> [`/prompts/`](http://localhost:8000/prompts/). This file stays the source of truth for the
> wording — the hub reads it, it does not duplicate it.

## The one idea behind all of them

A normal AI answer *hands you the fish*. These prompts make the AI *coach you to fish*: it asks
before it tells, waits for your reply, and refuses to reveal the answer until you've actually
tried. Understanding sticks when you struggle a little before the answer arrives — so every prompt
is built around interaction, one step at a time. **The prompts only work if you actually reply and
wait.** Don't paste them and then skim ahead; play your part in the back-and-forth.

## Which prompt when

> Generated from `prompts.json` — edit the registry, not this table.

<!-- PROMPTS:TABLE:START -->
| Your situation | Use |
|----------------|-----|
| "I have almost no time and need to be useful in this, fast." | [01 — The Learning Curve Destroyer](mds/01-learning-curve-destroyer.md) |
| "I get it in theory but keep messing it up in practice." | [02 — The Real Error Simulator](mds/02-real-error-simulator.md) |
| "I read this and it just won't click — there's something I'm missing." | [03 — The Impossible Language Translator](mds/03-impossible-language-translator.md) |
| "I have a specific goal and deadline and need a day-by-day plan." | [04 — The Personal Learning Path Architect](mds/04-personal-learning-path-architect.md) |
| "I think I know this — check whether my confidence is earned." | [05 — The Hidden Gap Detector](mds/05-hidden-gap-detector.md) |
| "I just studied this — is my understanding actually solid?" | [06 — The Forced Feynman Method](mds/06-forced-feynman-method.md) |
| "Every session starts with me re-explaining the project because nothing carries over." | [07 — The Claude Code Scaffold](mds/07-claude-code-scaffold.md) |
| "I keep re-paying for the same reasoning every time I run this." | [08 — The Local-First Harness](mds/08-local-first-harness.md) |
| "I write clearly and correctly, and a week later nobody remembers a word of it." | [09 — The Memory-First Editor](mds/09-memory-first-editor.md) |
<!-- PROMPTS:TABLE:END -->

On the hub these same situations appear on the cards, so you can search by symptom
("won't click", "interview", "deadline") rather than by prompt name.

## How to use one

**On the hub (recommended):**

1. Click a card. The left side explains what the prompt does and why; the right side is the
   working copy.
2. Fill in the blanks. Each field is one `[PLACEHOLDER]`, with the file's own "Fill in first"
   note as its hint, and any documented default pre-filled. The preview substitutes live —
   amber means still empty, cyan means filled.
3. Hit **Copy prompt**, or use **Open in Claude / ChatGPT** to jump into a fresh chat with the
   text already loaded.
4. **Play along.** Answer each question honestly and wait.

**From the markdown directly:**

1. Open the prompt's file in [`mds/`](mds/) and copy the block inside the ```` ```text ```` fence.
2. Replace every `[PLACEHOLDER]` with your specifics — each file's **"Fill in first"** section
   tells you exactly what goes where. Vague inputs produce vague sessions; be concrete.
3. Paste into a fresh chat (ChatGPT, Claude, Gemini, whatever) and send.
4. **Play along.** Answer each question honestly and wait — don't say "just tell me." The value
   is in the loop, not the final answer.

Either way: if the AI slips back into lecturing or dumps the answer early, reply: *"Follow your
own rules — ask me one question and wait."*

## Chain them into a full loop

The prompts are stronger together than alone. A typical progression:

1. **04 — Path Architect** → get your 7-day plan toward a specific goal.
2. **01 — Curve Destroyer** → for each day's skill, find the 20% that matters and the one exercise.
3. **02 — Error Simulator** → drill that skill under realistic, mistake-prone conditions.
4. **06 — Feynman** *or* **05 — Gap Detector** → verify the understanding is real before moving on.
5. **03 — Language Translator** → whenever a specific piece of material refuses to click, pull it out.

Think of it as: **plan → focus → practice → verify**, with the Translator on standby for anything
confusing along the way. The hub draws this as a clickable chain — each step opens its prompt.

## Tips that apply to all of them

- **Concrete beats broad.** "Get better at Python" is weak; "build a CLI that scrapes a page to
  CSV" is strong. The narrower your input, the sharper the coaching.
- **One session, one skill.** Don't cram three topics into one prompt — run it again per topic.
- **Keep the transcript.** Re-running 05 or 06 a week later on the same topic shows you what stuck.
- **Fresh chat each time** so an old conversation's context doesn't leak in.

## Categories

Every prompt declares a `category` in the registry, and the hub derives its filter pills from
whatever categories the data contains — add a prompt in a new category and the pill appears by
itself. `Learning` is where this library started; anything a chat AI can be coached into is fair
game (writing, coding, research, decisions, career), so keep the categories broad and reuse an
existing one before inventing another.

`tags` stay narrower and cross-cutting — they are the second-level filter, reachable by tapping a
tag on any card.

## Adding a prompt

Run the **`create-prompt`** skill:

```
/create-prompt a prompt that stress-tests a business plan before I pitch it
```

It allocates the next number, drafts the markdown in the shape below, stages it under
`_not_approved/` for your approval, then registers it and regenerates the tables in this file and
in the README. The tables between the `<!-- PROMPTS:TABLE -->` markers are generated — edit
`prompts.json`, not the tables.

### The file shape the hub parses

The hub fetches each markdown file at runtime and reads it by label, so the shape is a contract:

1. `# N. Title` — the number must match the filename.
2. `**Purpose:**` — one line, on the same line as the label.
3. `**Use it when:**` — a bullet list, 2+ items.
4. `**Fill in first:**` — one bullet per blank, each `` `[TOKEN]` — what goes here ``.
5. `**The prompt:**` — exactly one ```` ```text ```` fence. This is what gets copied.
6. `**Example filled-in:**` — a `>` blockquote.
7. `**Tip:**` — one line.

Placeholders are detected from the prompt body itself — anything in `[CAPITALS]` becomes an input
field — and matched to the description you wrote in **Fill in first**, so keep those two in sync.
Writing `(default: …)` in a hint pre-fills that field. Prefix matching means a body token of
`[PASTE CONTENT HERE]` still finds a `[PASTE CONTENT]` hint.

See [README.md](README.md) for the quick file-to-purpose lookup table.
