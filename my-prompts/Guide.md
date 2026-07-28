# Guide — How to use these learning prompts

Six copy-paste prompts that turn any chat AI into an active tutor instead of an answer-vending
machine. Each one lives in its own file. This guide explains the shared idea behind them, which
one to reach for, how to fill them in, and how to chain them into a full learning loop.

## The one idea behind all six

A normal AI answer *hands you the fish*. These prompts make the AI *coach you to fish*: it asks
before it tells, waits for your reply, and refuses to reveal the answer until you've actually
tried. Understanding sticks when you struggle a little before the answer arrives — so every prompt
is built around interaction, one step at a time. **The prompts only work if you actually reply and
wait.** Don't paste them and then skim ahead; play your part in the back-and-forth.

## Which prompt when

| Your situation | Use |
|----------------|-----|
| "I have almost no time and need to be *useful* in this, fast." | [01 — Learning Curve Destroyer](01-learning-curve-destroyer.md) |
| "I get it in theory but keep messing it up in practice." | [02 — Real Error Simulator](02-real-error-simulator.md) |
| "I read this and it just won't click — there's something I'm missing." | [03 — Impossible Language Translator](03-impossible-language-translator.md) |
| "I have a specific goal + deadline and need a day-by-day plan." | [04 — Personal Learning Path Architect](04-personal-learning-path-architect.md) |
| "I think I know this — check if my confidence is earned." | [05 — Hidden Gap Detector](05-hidden-gap-detector.md) |
| "I just studied this — is my understanding actually solid?" | [06 — Forced Feynman Method](06-forced-feynman-method.md) |

## How to use one

1. Open the prompt's file and copy the block inside the ```` ```text ```` fence.
2. Replace every `[PLACEHOLDER]` with your specifics — each file's **"Fill in first"** section
   tells you exactly what goes where. Vague inputs produce vague sessions; be concrete.
3. Paste into a fresh chat (ChatGPT, Claude, Gemini, whatever) and send.
4. **Play along.** Answer each question honestly and wait — don't say "just tell me." The value
   is in the loop, not the final answer.
5. If the AI slips back into lecturing or dumps the answer early, reply: *"Follow your own rules —
   ask me one question and wait."*

## Chain them into a full loop

The prompts are stronger together than alone. A typical progression:

1. **04 — Path Architect** → get your 7-day plan toward a specific goal.
2. **01 — Curve Destroyer** → for each day's skill, find the 20% that matters and the one exercise.
3. **02 — Error Simulator** → drill that skill under realistic, mistake-prone conditions.
4. **06 — Feynman** *or* **05 — Gap Detector** → verify the understanding is real before moving on.
5. **03 — Language Translator** → whenever a specific piece of material refuses to click, pull it out.

Think of it as: **plan → focus → practice → verify**, with the Translator on standby for anything
confusing along the way.

## Tips that apply to all of them

- **Concrete beats broad.** "Get better at Python" is weak; "build a CLI that scrapes a page to
  CSV" is strong. The narrower your input, the sharper the coaching.
- **One session, one skill.** Don't cram three topics into one prompt — run it again per topic.
- **Keep the transcript.** Re-running 05 or 06 a week later on the same topic shows you what stuck.
- **Fresh chat each time** so an old conversation's context doesn't leak in.

See [README.md](README.md) for the quick file-to-purpose lookup table.
