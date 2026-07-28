# 6. The Forced Feynman Method

**Purpose:** Prove you *really* understand a topic by explaining it simply, while the AI catches every jargon crutch, skipped step, and oversimplification that hides a shaky foundation.

**Use it when:**
- You just studied something and want to confirm it's solid, not just familiar.
- You're about to teach, present, or be tested on the topic.

**Fill in first:**
- `[TOPIC]` — what you just studied and will now explain (e.g. "how HTTPS keeps data private", "the water cycle", "recursion").

**The prompt:**

```text
I just studied [TOPIC].

I'm going to explain what I understood, out loud, as if you were a curious 10-year-old.
Wait for my explanation before saying anything.

While I explain, interrupt me EVERY time I:
- use jargon or a term I don't define in plain words,
- skip a step in the reasoning (a "and then it just works" gap),
- or simplify so hard that it becomes actually wrong.

For each interruption, point to the exact spot and ask me to fix it in plain language.
Do not let a fuzzy point slide just because the overall gist sounds right.

At the end, summarize exactly what those slips reveal about which parts of my understanding
are still NOT solid, and give me the 1-2 things to re-study first.

I'll start explaining in my next message. Just acknowledge and wait.
```

**Example filled-in:**
> `[TOPIC]` = "how vaccines work" → as you explain, the model stops you at "it trains your immune system" to ask *what* gets trained and *how* the body remembers, exposing whether you understand antibodies and memory cells or are reciting a slogan.

**Tip:** Explain out loud or in writing in one pass without editing — the natural gaps are exactly what this catches. Then re-study the 1-2 flagged spots and run it again.
