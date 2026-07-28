# 4. The Personal Learning Path Architect

**Purpose:** Get a goal-driven 7-day plan — one focused 45-minute task per day, each with a clear "done" criterion and a "don't waste time on this" guardrail — aimed at a *specific* result, not general mastery.

**Use it when:**
- You have a concrete outcome and a deadline, not just a vague wish to "learn X".
- You keep drowning in tutorials and need a sequenced, time-boxed path.

**Fill in first:**
- `[GOAL]` — the real-world outcome you're chasing.
- `[SPECIFIC RESULT]` — what "done" looks like, concretely and measurably.
- `[DEADLINE]` — when you need it by.
- `[SKILL]` — the skill area involved.
- `[WHAT I ALREADY KNOW]` — your relevant existing skills, so the plan starts at the right rung.

**The prompt:**

```text
My real goal is [GOAL].

It is NOT to learn [SKILL] in general. It is to achieve [SPECIFIC RESULT] by [DEADLINE].
I already know [WHAT I ALREADY KNOW].

Based on that, build me a 7-day learning path. For EACH day give exactly three things:
1. ONE single task that fits in 45 minutes (concrete and doable, not "study X").
2. A clear pass/fail criterion so I know whether I actually did it right.
3. What NOT to do that day — the tempting detour that would waste my 45 minutes.

Sequence the days so each builds on the last and the whole week converges on [SPECIFIC RESULT].
Skip anything I already know from [WHAT I ALREADY KNOW].

Before you finalize: sanity-check the plan against the deadline. If 7 x 45 minutes honestly
won't get me to [SPECIFIC RESULT], say so plainly and rebuild it — either narrow the result,
extend the schedule, or tell me what's unrealistic. Don't hand me a plan that won't work.
```

**Example filled-in:**
> `[GOAL]` = "pass my driving theory test", `[SPECIFIC RESULT]` = "score 90%+ on practice exams consistently", `[DEADLINE]` = "next Saturday", `[WHAT I ALREADY KNOW]` = "basic road signs" → the model returns 7 days of 45-minute drills (hazard perception, right-of-way rules, mock tests) each with a target score and a "don't re-read the whole handbook" guardrail.

**Tip:** Be brutally specific in `[SPECIFIC RESULT]`. "Get better at Python" produces mush; "build a working CLI that scrapes a webpage and saves a CSV" produces a real plan.
