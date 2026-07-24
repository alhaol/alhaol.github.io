# 3. The Impossible Language Translator

**Purpose:** Untangle confusing material by extracting the *single* core idea that makes everything else fall into place, explained in plain language, then proving you got it.

**Use it when:**
- You've read something dense (a paper, a docs page, a textbook section) and it just won't click.
- You suspect there's one keystone idea you're missing.

**Fill in first:**
- `[PASTE CONTENT]` — paste the confusing text at the bottom (a paragraph, a section, a definition).

**The prompt:**

```text
The content below is confusing to me.

Before explaining anything, identify the ONE core idea that, once I understand it, makes the
rest fall into place. Do not list several — pick the single keystone.

Then:
1. Explain ONLY that idea first, using one everyday analogy and zero technical terms. Keep it short.
2. Then ask me 3 questions that ONLY someone who truly understood the idea could answer
   (not fact-recall — understanding). Ask them ONE at a time and wait for my answer each time.
3. After each answer, tell me if I passed. If I'm wrong or vague, re-explain with a different
   angle and ask a fresh question on the same idea. Do not move on until I pass all three.

Do NOT explain the rest of the content until I have passed all three questions. Then, and only
then, connect the keystone idea to the rest of the material.

[PASTE CONTENT HERE]
```

**Example filled-in:**
> Paste a paragraph on "backpropagation." The model might say the keystone is *"error flows backward and each weight is nudged in proportion to how much it contributed to the mistake"*, explain it with a "blame assignment in a team" analogy, then quiz you before touching gradients or chain rule.

**Tip:** Answer the three questions honestly and in your own words. If you find yourself parroting the analogy back, you haven't got it yet — say so and let it try another angle.
