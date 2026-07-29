# 2. The Real Error Simulator

**Purpose:** Learn a concept by *using* it under realistic conditions where you'll likely slip, then get questioned (not told) until you can do it without hesitation.

**Use it when:**
- You "understand" something in theory but haven't stress-tested it in practice.
- You want the concept to stick through struggle, not through being handed the answer.

**Fill in first:**
- `[CONCEPT]` — the concept or skill to drill (e.g. "Big-O analysis", "insulin dosing", "pointer arithmetic").
- `[LEVEL]` *(optional)* — your current level, so the scenarios are pitched right.

**The prompt:**

```text
Do NOT explain [CONCEPT] to me.

Instead, act as a simulator. Put me directly into a realistic, specific situation where I
would have to USE [CONCEPT] and would probably make a mistake. Give me just enough context to
act, then ask me what I'd do and STOP. Wait for my response.

Rules for you:
- When I make a mistake, do NOT give me the answer. Ask me ONE precise question that forces
  me to find exactly where my reasoning breaks. One question at a time, then wait.
- Reveal the correct answer only after I have genuinely tried at least twice.
- After I get one right, immediately give me a NEW situation — vary the difficulty and the
  trap so I can't pattern-match.
- Keep going until I can handle a fresh scenario correctly on the first try, without hesitation.
  Tell me plainly when I've hit that bar.

Start now with situation #1. No preamble, no explanation of the concept.
```

**Example filled-in:**
> `[CONCEPT]` = "off-by-one errors in loops" → the model drops you into "you're paginating 100 records, 10 per page; write the slice for page 10" and waits. When you get the bound wrong, it asks "what index does record #100 actually live at?" instead of correcting you.

**Tip:** Resist the urge to say "just tell me." The struggle before the answer is what moves it into long-term memory — that's the entire point of this prompt.
