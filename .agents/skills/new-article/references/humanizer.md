# Humanizer checklist for articles and LinkedIn posts

Apply this to the article body (`{{ARTICLE_BODY}}`) and the LinkedIn post before finalizing.
This is a tells-only distillation of [blader/humanizer](https://github.com/blader/humanizer)
v2.7.0 (itself based on Wikipedia's "Signs of AI writing"). Goal: remove the mechanical signs of
AI writing while keeping the polished executive voice and every claim/reference intact. Do **not**
inject opinions, first person, or tangents here. The fix is phrasing, never inventing facts.

## Hard rule: no em/en dashes
- No em dashes (`—`), en dashes (`–`), `---`, or ` -- ` anywhere in the output. This is the single
  most reliable AI tell, so treat it as a hard constraint.
- Replace each one with a period (new sentence), a comma (tight aside), a colon (before an
  explanation), parentheses (a true aside), or reword. A hyphen in a real compound
  (`cross-functional`, `5G/6G`) is fine. The only `--` allowed is a CSS custom-property name in
  the template (`--bg-color`).
- Before finishing, scan the article HTML and the `.md` post for `—`, `–`, `---`, ` -- `. Any hit
  means it is not done.

## Cut AI vocabulary and inflation
- Avoid: leverage(s), delve, showcase, underscore, testament, pivotal, crucial, vibrant, robust,
  seamless, tapestry, landscape (figurative), realm, foster, garner, intricate/intricacies,
  interplay, enduring, additionally, align with, key (as filler adjective), valuable.
- Don't inflate significance: skip "marking a pivotal moment", "in today's rapidly evolving
  landscape", "stands as a testament to", "reflects a broader". State the fact and the result.
- Prefer plain copulas (is/are/has/led/built/shipped) over "serves as / stands as / boasts /
  represents / features."

## Structural tells to avoid
- **No `-ing` padding:** don't tack on "..., ensuring X, enabling Y, highlighting Z." Make each a
  real clause or cut it.
- **Don't force the rule of three:** no "innovation, inspiration, and insight" triads for the sake
  of symmetry. Use two items, or a real list with specifics. (The Step-4 six-point structure is a
  skeleton for you, not a license to triple-up the prose.)
- **No negative parallelism:** avoid "not just X, but Y" and "it's not about X, it's about Y."
- **Name your sources:** replace weasel attributions ("experts argue", "industry reports",
  "observers have noted") with a specific source, or cut the claim.
- **No filler / hedging / authority tropes / signposting:** "in order to" → "to"; "it is important
  to note that the data shows" → "the data shows"; drop "the real question is", "at its core",
  "let's dive into", "here's what you need to know."
- **No fragmented header line** that just restates the heading before the real content starts.

## Formatting tells (reconcile with the skill's style contract)
- **Boldface / `<strong>` is purposeful, not mechanical:** bold a key term only on first
  definition. Never bold every phrase, and never use bolded-header colon lists
  ("**Performance:** ...").
- **Headings in sentence case**, not Title Case ("Strategic negotiations", not "Strategic
  Negotiations And Global Partnerships").
- **Straight quotes only** (`"`), never curly. No emojis in the body or headings.
- **Keep the closer concrete.** The "What leaders should do" list must be real, specific actions.
  No vague upbeat endings ("the future looks bright", "exciting times lie ahead").

## Don't over-edit (false positives)
A clean writer can hit some of these without any AI involvement. Polish, a formal word, a lone
transition word, curly quotes from an editor, or a single dash are **not** tells on their own. Act
on **clusters** (e.g. inflated significance + rule of three + "vibrant tapestry" + a generic
"Conclusion"). Preserve genuinely human signals: concrete hard-to-fabricate specifics (a real
number, a named system, a real result), varied sentence length, and a defensible point of view.

## Process (every time)
1. Draft the article body / post normally.
2. Audit: ask "what here still reads as AI?" Run through the dash scan, the AI-vocab list, copula
   avoidance, `-ing` padding, rule of three, boldface, heading case, and the closer.
3. Rewrite to fix what you found, then re-scan for `—` and `–`. Only then insert into the template
   / save the post.

## Quick before / after
- Before: "In today's rapidly evolving landscape, prompt caching serves as a pivotal,
  game-changing technique that empowers teams by streamlining costs, enhancing speed, and fostering
  innovation."
- After: "Prompt caching cuts cost and latency by reusing the parts of a prompt that don't change.
  At scale it is often the difference between a feature that ships and one that stays a demo."

Source: [blader/humanizer](https://github.com/blader/humanizer) (MIT) and
[Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).
