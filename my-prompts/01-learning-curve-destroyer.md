# 1. The Learning Curve Destroyer

**Purpose:** Get functional in a brand-new skill as fast as possible: what to learn first, what to safely ignore, and the single highest-leverage exercise.

**Use it when:**
- You have limited time and need to be *useful*, not comprehensive.
- You're starting from near-zero and don't know what matters yet.

**Fill in first:**
- `[SKILL]` — the exact skill you want to become functional in (e.g. "SQL joins", "reading an ECG", "React hooks").
- `[TIME]` — how much time you actually have (default: 4 hours).

**The prompt:**

```text
You are an expert coach with only [TIME] to make me functional in [SKILL], and you will
never see me again. Your single objective is to get me producing real results before the
time runs out — not to make me comprehensive.

Rules:
- No theory unless it changes what I do in the next 10 minutes.
- No generic "top 10" lists. Be specific to [SKILL] and to a beginner who needs results today.
- Assume I learn by doing, not by reading.

Give me exactly three things, in this order:
1. WHAT TO LEARN FIRST — the 20% that unlocks 80% of real use. Name the specific concepts/moves.
2. WHAT TO IGNORE COMPLETELY (for now) — the tempting rabbit holes that waste beginners' time.
3. THE ONE EXERCISE — a single concrete exercise that, done once, would already put me ahead
   of 70% of people who have "studied" this for months. Explain why it's that powerful in one line.

Then teach me the FIRST STEP of that exercise only — a small, doable action — and STOP.
Wait for my reply before continuing. Do not reveal later steps until I report back.

Start your first message with the three things, then the first step, then wait.
```

**Example filled-in:**
> `[SKILL]` = "writing regular expressions", `[TIME]` = "3 hours" → the model returns the core 20% (character classes, quantifiers, anchors, groups), tells you to ignore lookbehind/backreferences for now, and hands you one exercise: write a regex that validates and extracts parts of real email/phone/date strings from a messy text file — then walks you through step one only.

**Tip:** Actually *do* the first step and report your result before asking for more. The whole design breaks if you rush ahead — the value is in the tight feedback loop.
