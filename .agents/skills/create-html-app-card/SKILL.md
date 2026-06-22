---
name: create-html-app-card
description: Turn a body of content — an article, a talk, a YouTube video, a book chapter, a thread, or any list of lessons/wisdom — into a self-contained "wisdom card" mini-app under /apps/<slug>/ on the alhaol.github.io portfolio, wired into the Apps Hub and README. The app is a spaced-repetition flashcard deck with four views: Study (flip cards + Leitner SRS), Browse all, a taxonomy Map (root → groups → keyword leaves), and a force-directed Knowledge Graph (with named cross-links between ideas). It is purpose-built to HARNESS wisdom and make it easy to recall and memorize via mnemonic keywords and visual structure. USE THIS SKILL whenever the user types the literal phrase "create_html_app_card", or asks to "turn this into flashcards / a card deck", "make a memorize app from this content / video / article", "build a recall app for these lessons", "help me harness / remember the wisdom in X", or anything that implies distilling source content into memorizable, visually-mapped cards living under /apps/<slug>/. It carries its own bundled, data-driven template (generalized from the habit-cards app) — do not reach into /apps/habit-cards/ to copy markup at trigger time.
---

# create_html_app_card

Turn arbitrary content — an article, a YouTube talk, a book chapter, a thread, or a raw list of lessons — into a **wisdom-card mini-app** at `apps/<slug>/index.html` for the alhaol.github.io portfolio, register it with the Apps Hub, and add it to the README.

The output is the same proven shell as the `habit-cards` app, but **data-driven**: a spaced-repetition flashcard deck with four linked views —

- **Study** — flip cards (cue → answer) with a Leitner box SRS, due-scheduling, streaks, and 1–4 recall ratings.
- **Browse all** — every card grouped by taxonomy, with mastery dots.
- **Map** — a dendrogram: one root → groups → keyword leaves, plus a mnemonic "keyword spine" per group. This is the recall scaffold.
- **Graph** — a force-directed knowledge graph: the hierarchy as solid edges, plus dashed teal **cross-links** that name how ideas relate across groups.

The whole point is to **harness wisdom and make it stick** — every card carries a short uppercase mnemonic `key` (the hook you memorize), and the Map/Graph give the content a visual shape the brain can re-walk.

The bundled template at `references/template.html` is the **single source of truth** for the shell. All four views are generic engine code; only one `const DECK = {...}` block changes per app. Do not read or copy from `/apps/habit-cards/` to start a new one — the template already encodes the login overlay, favicon path, SRS engine, map, and graph. `references/deck-example.js` shows the exact `DECK` shape worked through with real content.

## When this fires

Primary trigger: the literal phrase `create_html_app_card`.

Also fire when the user wants to **distill content into something memorizable** and have it live as an app: "turn this article into flashcards", "make a recall/memorize app from this video", "help me remember the lessons in this talk", "build a card deck for these principles", "I want to harness the wisdom in X as cards I can study". If they hand you content (paste, link, file, YouTube URL) and want to *remember* it, this is the skill.

Do **not** fire for:
- A generic tool/tracker/calculator with no flashcard/recall intent → use `create-html-app`.
- A new article → use `new-article`. A new presentation → use `create-presentation`.
- Edits to an existing card app, or changes to the main portfolio (`index.html` / `conf/profile.json`).

If the request is a plain app with no "memorize / recall / cards / wisdom" angle, prefer `create-html-app`. This skill is specifically the *card-deck* variant.

## The workflow

### 1. Get the source content

The user will give you one of: pasted text, a file, an article URL, a YouTube URL/title, a book/chapter reference, or just a topic they want carded.

- **Pasted text / file** — use it directly.
- **URL (article, blog, transcript page)** — fetch it with `WebFetch` and extract the substance.
- **YouTube** — get the content in this order (learned the hard way):
  1. **`WebFetch` on the watch URL gives you almost nothing** — usually just the title. Don't stop there.
  2. **The YouTube Data API v3 is the high-value path.** If a `YOUTUBE_API_KEY`/token is available (ask the user for one if not — many of these videos are useless without it), hit `videos.list` for the description + chapters + duration:
     ```bash
     curl -s "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=<VIDEOID>&key=$TOKEN"
     ```
     For these "X strategies / N-step protocol" videos the **description almost always contains the whole framework and the chapter timestamps** (e.g. the named steps of a protocol). That structure is gold — it doubles as your taxonomy (see step 3). Use the token transiently (curl only); **never write it to a file** that could be committed.
  3. **Caption *bodies* need OAuth** — `captions.download` returns `401` with an API key, and the public `youtube.com/api/timedtext` endpoints return empty (they now require signed params). Don't burn time on transcript-scraper sites either; they 403 or return marketing pages. So for word-level detail beyond the description, **ask the user to paste the transcript or their notes** — and they often will, which makes the deck far more faithful.
- **Just a topic / "wisdom about X"** — you may draw on well-known, uncontroversial principles, but say so and keep claims defensible.

Never fabricate quotes or claims you can't trace to the source. Card **examples** are the one place you legitimately author illustrative content — keep them true to the idea, and tell the user the examples are yours (the framework, claims, and named concepts must come from the source).

You need enough material to write **6–15 distinct, non-overlapping ideas**. If the content only yields 3–4, that's fine (the engine handles any count); if it yields 30, pick the most memorable and tell the user what you cut.

### 2. Propose a slug

Lowercase, hyphen-separated, short, describes the *content*, not the source brand:
`stoic-principles`, `deep-work-rules`, `negotiation-tactics` — not `huberman-ep-42`.

Check `links/links.json` and `apps/` for collisions. Show your proposal: *"I'll scaffold this as `apps/stoic-principles/`. Sound good, or a different slug?"* Wait for confirmation.

### 3. Design the taxonomy (the part that makes it stick)

This is the highest-leverage step. Before writing cards, decide the **groups** — 2–5 buckets that the ideas naturally fall into. Good groups are memorable and roughly balanced. Each group gets a label and a distinct hex color that reads on dark (the site trio is sky `#60a5fa`, gold `#fbbf24`, violet `#a78bfa`; add rose `#f87171`, emerald `#34d399`, teal `#5eead4` if you need more).

**If the source already has an explicit structure — a named protocol, a numbered list, chapter sections — mirror it; that *is* your taxonomy.** Don't invent groups when the source hands you one. The best decks fall straight out of the source's own skeleton (e.g. a "3C Protocol" → three groups Compress/Compile/Consolidate, each with its named sub-steps as the cards, plus one "Foundations" group for the framing ideas). Faithful structure is also more memorable than a structure you imposed.

Pick a short ALL-CAPS `rootName` for the whole system — ideally the source's own name for it (e.g. `3C PROTOCOL`, `STOIC OPERATING SYSTEM`).

Keep the **accent color distinct from existing decks** so the apps feel different at a glance (habit-cards is gold; the 3C deck uses sky `#38bdf8`/`#0ea5e9`). Pick an accent that doesn't collide with your group colors — the accent is chrome, the group colors are content.

### 4. Author the cards

One card per idea. Each card is an object in `DECK.cards` with these fields (see `references/deck-example.js`):

| Field | What it is | Rules |
|---|---|---|
| `id` | unique slug | a-z + hyphens, no spaces; reused in `cross` |
| `group` | which bucket | MUST be a key of `DECK.groups` |
| `name` | the idea's title | the card heading |
| `key` | **mnemonic recall keyword** | SHORT, ALL-CAPS, ideally one vivid word (CATCH, SHRINK, SKY). This is the memory hook and the Map's "keyword spine" — invest in it |
| `gist` | 3–6 word compression | shown on the map leaf |
| `cue` | the question on the card FRONT | should prompt active recall, not give it away |
| `back` | the full lesson | 2–4 sentences, plain language, faithful to the source |
| `example` | one concrete instance | specific and vivid |

Write **real, faithful** content — the deck must teach the actual ideas in the source, not generic filler. The `key` words are what make the deck recallable; spend effort making them distinct and evocative.

### 5. Add cross-links (the knowledge layer)

Fill `DECK.cross` with 3–8 named relationships between cards: `["idA", "idB", "short label"]`. These are the dashed teal edges in the Graph and the "knowledge" in the knowledge graph — they show how ideas connect, especially *across* groups. Both ids must exist in `cards`. If two ideas reinforce, oppose, or sequence into each other, link them.

### 6. Render the template

Read `references/template.html`. Substitute these placeholders:

| Placeholder | What it is |
|---|---|
| `{{APP_TITLE}}` | Human title (e.g. "Stoic Principles") — title tag + `<h1>` |
| `{{APP_TAGLINE}}` | One-line subtitle (e.g. "Memorize the 12 core Stoic moves") |
| `{{ACCENT_HEX}}` | Accent colour **with** `#` (e.g. `#fbbf24`) — used in CSS `:root` and JS |
| `{{ACCENT_SOFT_HEX}}` | Companion gradient colour **with** `#` (e.g. `#f59e0b`) |
| `{{DECK_DATA}}` | The entire `const DECK = {...};` block (groups, cards, cross, rootName, stateKey) |

`{{ACCENT_HEX}}` appears in two places (CSS var + JS const) and `{{APP_TITLE}}` in two — substitute **all** occurrences. Set `DECK.stateKey` to `"cardDeck_<slug>_v1"` so the app's localStorage never collides with another deck.

**Render with a throwaway Python script, not an inline bash heredoc.** The `DECK` block is full of apostrophes, em-dashes, and quotes that break shell heredocs (`unexpected EOF` errors). The reliable, repeatable method:

```python
# write _render_<slug>.py, run it, then delete it
import pathlib, re
tpl = pathlib.Path("<skill_dir>/references/template.html").read_text(encoding="utf-8")
DECK = r'''const DECK = { ... };'''          # the whole block as a raw triple-quoted string
out = (tpl.replace("{{APP_TITLE}}", "...").replace("{{APP_TAGLINE}}", "...")
          .replace("{{ACCENT_HEX}}", "#38bdf8").replace("{{ACCENT_SOFT_HEX}}", "#0ea5e9")
          .replace("{{DECK_DATA}}", DECK))
assert not re.findall(r"\{\{[A-Z_]+\}\}", out), "leftover placeholders"
pathlib.Path("apps/<slug>/index.html").write_text(out, encoding="utf-8")
```

Keep the `DECK` JS strings in **straight quotes/ASCII-safe punctuation** where easy; the file is written UTF-8 so em-dashes are fine, but apostrophes inside double-quoted JS strings (`"don't"`) are the safe choice. After writing, **syntax-check the rendered engine with `node --check`** (extract the largest `<script>` block) to catch any structural slip before previewing. Delete the render script when done.

The login overlay block and the `_login()` script are **shared site-wide infrastructure** — do not modify, rename ids, or "improve" them. Write the result to `apps/<slug>/index.html`. Do not touch the engine JS (the four views) unless the user explicitly asks for a behavior change; the template is meant to be filled, not forked.

### 7. Validate

```bash
python "{{skill_dir}}/scripts/validate.py" . <slug>
```

It checks slug uniqueness, the login overlay + `_login()`, the favicon path, leftover `{{PLACEHOLDER}}` tokens, that `const DECK` is present with its required fields, and that `stateKey` contains the slug. Fix the real issue on failure — the most common are a forgotten placeholder and a `stateKey` left as the example's.

**Run the validator BEFORE registering (step 8), not after.** The slug-uniqueness check passes only while the slug is *absent* from `links.json`; once you register, re-running the validator will report `slug '<slug>' already exists` — that's expected and benign, not a regression. So validate → register, in that order, and don't re-validate after registering expecting a clean pass.

### 8. Register in the Apps Hub + README

Append one entry to `links/links.json`:

```json
{
  "slug": "<slug>",
  "name": "<App Title>",
  "tagline": "<short tagline>",
  "description": "<one-sentence description, ends with a period>",
  "category": "<tools|learning|spiritual|fitness|finance|fun>",
  "icon": "<map|calculator|check|network|loop|book|play|shield|spark>"
}
```

Card decks are almost always `category: "learning"` and `icon: "book"` (or `"network"` to nod at the graph, `"spark"` for wisdom/spiritual content). Pick what fits; let the user override.

Then add one row to the `## Pages & Apps` table in `README.md`:

```
| <App Title> | `/apps/<slug>/` | <one-sentence description> |
```

### 9. Preview + sign-off

```bash
python -m http.server 8000
# then open http://localhost:8000/apps/<slug>/
```

Surface the URL, remind them of the credentials (`ibrahim / ibrahimwin`), and tell them to check all four views — especially that the **Map keyword spine** reads well and the **Graph cross-links** make sense. Iterate in place on feedback, then re-validate.

### 10. Offer a review pass

Once they sign off, offer `/simplify` or `/review` on the new file — mention it, don't auto-run.

## Approval gating

Per the site's `CLAUDE.md`: if the user wants the deck staged for approval first, write it to `apps/_not_approved/<slug>/index.html` and **do not** register it in `links.json` / `README.md` until they approve and it's promoted to `apps/<slug>/`. Only register content that lives at its final path.

## Conventions that matter (and why)

- **The bundled template is the source of truth.** Every view (SRS, browse, map, graph) is generic and reads from `DECK`. If a future deck needs a different shell, update the template here, don't fork it inside `/apps/<slug>/`.
- **Only `DECK` changes per app.** Resist editing the engine. A card deck is content + taxonomy; the machinery is shared.
- **The `key` field is the product.** This skill's whole value over a generic flashcard app is mnemonic compression + visual taxonomy. Weak, generic keywords (TIP, IDEA, POINT) defeat the purpose — make them vivid and distinct.
- **Faithfulness over volume.** Better 8 true, well-keyed cards than 20 padded ones. Don't invent claims to fill a quota; if the source is thin, make fewer cards and say so.
- **Login overlay + favicon are site-wide.** `../../assets/ibrahim-image-circle.png`; don't reskin the gate. The validator catches both.
- **Self-contained.** One HTML file, no build step, no framework, no extra deps beyond Tailwind + lucide (already on the CDN). No `data.json` needed — the deck is inline.

## Anti-patterns to avoid

- **Reaching into `/apps/habit-cards/` at trigger time** for "inspiration." The template already is the generalized habit-cards; copying the original re-introduces hardcoded content and accent colors.
- **Editing the engine instead of the data.** If the map looks wrong, the fix is almost always in `DECK` (a bad group split, a missing `key`), not the render code.
- **Fabricating wisdom.** If you can't trace a claim to the source (or to genuinely common knowledge), don't card it. For YouTube with no transcript, ask for the points.
- **Generic mnemonic keys.** The deck lives or dies on recall hooks. Don't ship POINT-1 / POINT-2.
- **Forgetting README / stateKey.** A deck missing from the README looks half-done; a `stateKey` left as `cardDeck_micro-habits_v1` makes two decks stomp each other's progress.

## What "done" looks like

- `apps/<slug>/index.html` exists and works in a browser (after login): all four views render, Study schedules cards, the Map shows the keyword spine, the Graph settles with cross-links.
- The validator prints `VALIDATION PASSED`.
- `links/links.json` has one new entry; `README.md` has one new row.
- The user has eyeballed the live deck and signed off.
