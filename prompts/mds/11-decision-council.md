# 11. The Decision Council

**Purpose:** Get a hard second opinion from five advisors who argue, review each other blind, and reach a verdict without knowing what you hoped to hear.

**Use it when:**
- You are about to commit to something costly (a hire, a launch, a job change, an architecture) and suspect the AI is mostly agreeing with you.
- You have been going back and forth for days and need one clear call with the risks named, not another list of pros and cons.

**Fill in first:**
- `[DECISION]` — the decision in one sentence, phrased as a choice (e.g. "Should I leave my job to go full-time on my consulting practice in January?").
- `[OPTIONS]` — the options you see, including doing nothing (e.g. "quit in January; go part-time for six months; stay").
- `[CONTEXT]` — the facts that matter: money, deadlines, people affected, what you have already tried, and anything you cannot change.

**The prompt:**

```text
You chair a decision council. Language models tend to agree with the asker; I want the opposite.

Decision: [DECISION]
Options: [OPTIONS]
Context: [CONTEXT]

I have not said which option I lean toward. Do not guess it or favour it.

In ONE reply:

1. Five advisors, labelled only A to E, 40 to 60 words each. Each opens with one thing my
   framing gets wrong.
   A. Contrarian: how this fails and what that costs.
   B. First principles: the hidden assumptions, torn down.
   C. Expansionist: the upside or bigger option I missed.
   D. Outsider: the naive question an expert would skip.
   E. Executor: what can happen by Monday, and what blocks it.

2. Blind review: each advisor names the strongest and weakest point among the others, by letter,
   in one line.

3. Chairman: Decision (one line, pick one). Why (two sentences). Biggest risk. Confidence
   (low/medium/high). Kill test: the one fact that would reverse this, and how to check it this
   week. Three next steps for this week.

Rules: mark assumptions. No invented statistics. No "it depends". The Chairman must choose.

Then STOP and ask: "Which option were you leaning toward, and why?" After I answer, say where we
disagree and whether my reason is evidence or preference. Change the verdict only for new facts.
When I say "final", restate the decision and three steps, and end.

Start with Advisor A. No preamble.
```

**Example filled-in:**
> `[DECISION]` = "Should we rebuild our billing service in Go before the Q2 pricing launch?" → the Contrarian prices the delay to the launch, the Outsider asks why pricing depends on a rewrite at all, and the Chairman recommends shipping pricing on the current service, with a kill test of "billing cannot support usage tiers without schema changes; check with a one-day spike."

**Tip:** Keep your leaning out of the context too. A line like "I'm excited about option 2" in `[CONTEXT]` undoes the whole design, because the advisors will quietly argue toward it.
