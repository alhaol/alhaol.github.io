---
name: new-article
description: >
  Creates a complete new technical article for alhaol.github.io. Generates: (1) a full HTML article page
  matching the existing article series style, (2) a short LinkedIn post markdown file, and (3) a hero
  image prompt plus download. Also updates articles/index.html with a new card and auto-assigns the next
  sequential number. Use this skill whenever the user says "new article",
  "write an article", "add an article", "create article #N", or provides a topic/link for a new post.
  Always invoke this skill — do not try to generate the article inline without it.
---

# New Article Generator

This skill creates the next article in the alhaol.github.io series. The site lives at `C:\alhaol.github.io`.

## Step 1 — Determine the next number

Do NOT hardcode a count. Use the **Glob** tool to count what already exists:

- `articles/Articles/*.html`
- `articles/LinkedIn_Posts/*.md`
- `articles/Post_Images/Image_*.png`

The next number = **(max of those three counts) + 1**, zero-padded to 2 digits (e.g. `16`, `17`).
Taking the max keeps the article, LinkedIn post, and image numbers in sync even if one stream is
ahead. Use Glob, not `ls`/`wc` (those are unreliable in this PowerShell environment).

## Step 2 — Research the topic

The user will provide a topic, description, or URL. Your job:
- If a URL is given, fetch it and extract the key ideas, claims, and any references cited.
- Synthesize 5–7 core insights the article should cover.
- Find 3–5 real, verifiable references (books, papers, docs, official pages) relevant to the topic. **Do not invent references.** Use well-known sources: Anthropic docs, arXiv papers, O'Reilly books, official framework docs, IEEE papers. Include the real URL or DOI when it exists.
- **Reference validation and authentication rules:**
  - Every reference link must be authenticated (actively loaded via curl/url retrieval tools) to ensure it works, is not a dead host, and does not return a 404 error.
  - Every reference must point to the actual paper, article, or source document. Do not link to general author homepages or academic directories.
  - References must be highly relevant to the specific topic intersection of the article (e.g. if the article is about AI systems thinking, general business dynamics textbooks or organizational learning books without explicit connection to AI/computation are not relevant). Remove or replace any irrelevant references.

## Step 3 — Generate the hero image

Generate the image **after** you have drafted the article, so the prompt can be built from the
article's actual core idea rather than just the title.

**Build the prompt from the article's central metaphor** (usually captured in the blockquote), then
append the fixed house-style token block so every hero matches the live site theme:

```
[core metaphor of the article], dark navy #0a1628 background, neon blue #60a5fa accents,
abstract, cinematic volumetric light, no text, subject offset to one side for title space
```

Note: the site theme is **blue** (`#0a1628` / `#60a5fa`), not green. Do not use "neon green".

Download with pollinations.ai. `model=flux` gives more coherent results, and a fixed `seed`
makes a re-roll reproducible when you only want to tweak the prompt:

```bash
curl -L "https://image.pollinations.ai/prompt/ENCODED_PROMPT?width=1200&height=630&nologo=true&model=flux&seed=42" \
  -o "C:\alhaol.github.io\articles\Post_Images\Image_NN.png" --max-time 180 -s -w "%{http_code} %{size_download}bytes\n"
```

URL-encode the prompt (replace spaces with `%20`, etc.).

**Validate the download.** pollinations returns small error pages (under ~1 KB, HTTP 402) when
rate-limited. Check the reported HTTP code and byte size:
- If HTTP is not `200` or the file is under ~5 KB, it failed. Wait a few seconds and retry once.
- If it still fails, tell the user and proceed without the image:
  > "Please generate a hero image and save it as `articles/Post_Images/Image_NN.png`. A good prompt: [PROMPT]"

Optional: generate a few candidates with different `seed` values into a temp folder and pick the
best one. The article is complete with or without the image.

## Step 4 — Generate the HTML article

Write `C:\alhaol.github.io\articles\Articles\SLUG.html` using the template in `references/article-template.html`.
The template already carries the correct blue theme and the favicon link — copy it verbatim and only
fill the placeholders.

**SLUG rules:** lowercase, hyphens only, max 4 words. Example: "prompt-caching-strategies"

**Fill in these placeholders:**
- `{{TITLE}}` — Short punchy title (3–5 words)
- `{{SUBTITLE}}` — One-sentence expanded title (~15 words)
- `{{IMAGE_NUM}}` — Zero-padded number, e.g. `16`
- `{{ALT_TEXT}}` — Article title
- `{{CATEGORY_1_CLASS}}` / `{{CATEGORY_1_LABEL}}` — Pick from: `category-ai` (AI/ML), `category-engineering` (Engineering/DevOps), `category-cognitive` (Cognitive/UX), `category-workflow` (Workflow/Process), `category-architecture` (Architecture/Systems)
- `{{CATEGORY_2_CLASS}}` / `{{CATEGORY_2_LABEL}}` — Second badge
- `{{PUBLISH_DATE}}` — Use today's date in format "Month DD, YYYY"
- `{{READ_TIME}}` — Estimate: ~1 min per 200 words
- `{{ARTICLE_BODY}}` — Full prose content (see writing guide below)
- `{{RELATED_ARTICLES}}` — 2–3 related article cards. Pick from the existing articles (enumerate them via Glob at runtime; never rely on a frozen list). Use their actual HTML filenames.
- `{{REFERENCES}}` — Numbered `<li class="reference-item">` items

### Writing guide for `{{ARTICLE_BODY}}`

Target ~1,200 words. Structure:
1. **Opening hook** — one bold claim or counterintuitive statement
2. **The problem** — what breaks without this concept
3. **The insight** — your core thesis, with a `<blockquote>` pulling out the key idea
4. **3–4 `<h2>` sections** — each with 2–3 paragraphs + optional list or code block
5. **Practical application** — concrete steps or code example
6. **Conclusion** — 2 paragraphs zooming out to broader implications

This is a skeleton for you, not a license to force triples in the prose. Vary sentence length and
don't pad sections to look symmetric (see the humanizer checklist below).

### Style contract (default)

- **No em-dashes or en-dashes anywhere.** Use periods, commas, colons, semicolons, or parentheses
  instead. The only `--` allowed in any output file is CSS custom-property names inside the template
  (e.g. `--bg-color`). Check the finished files for `—` and `–` before reporting done.
- **Plain language for an executive audience.** Define any technical term on first use. Favor short,
  clear sentences. Avoid jargon for its own sake.
- **End every article with a concrete "What leaders should do" ordered list** (3–4 actionable steps).
  These must be specific actions, never a vague upbeat ending (no "the future looks bright").
- Use `<strong>` **sparingly** — only a key term on its first definition, never every phrase and
  never bolded-header colon lists (humanizer §15/§16). Use `<code>` for inline technical terms and
  `<blockquote>` for the single most important insight.
- **Section headings in sentence case**, not Title Case (humanizer §17).
- **Apply the full AI-tell checklist** in `references/humanizer.md` (no AI vocabulary, no `-ing`
  padding, plain copulas, no forced rule-of-three, no weasel attributions). Run the humanize pass
  in Step 4b before inserting the body into the template.

Note: a denser, engineering-first voice is available if the user explicitly asks for it. Otherwise
default to the executive, no-dash style above.

## Step 4b — Humanize pass

Before pasting `{{ARTICLE_BODY}}` into the template, run the draft → audit → final loop from
`references/humanizer.md` over the drafted body:

1. You have a draft body from Step 4.
2. Audit it: ask "what here still reads as AI?" Walk the checklist (dash scan, AI-vocab list,
   copula avoidance, `-ing` padding, rule of three, mechanical boldface, Title-Case headings, the
   closer).
3. Rewrite to fix what you found, then re-scan for `—` and `–`. Keep the executive voice and every
   claim and reference intact — this is tells-only cleanup, not a rewrite of the argument and not
   an excuse to invent facts.

## Step 5 — Generate the LinkedIn post

Write `C:\alhaol.github.io\articles\LinkedIn_Posts\NN_Title_Words.md` using this structure:

```
[Hook sentence. Bold claim or surprising fact.]

[One-sentence elaboration.]

[Core insight paragraph. 2-3 sentences explaining the concept simply, no jargon.]

[So-what paragraph. What changes for the reader.]

[Closing line. Forward-looking, inspiring.]

#Tag1 #Tag2 #Tag3 #Tag4 #Tag5 #iwork4dell

Extended Reading: https://alhaol.github.io/articles/Articles/SLUG.html
```

Keep it under 300 words. No bullet points. Conversational but professional. **No em-dashes or
en-dashes** (same rule as the article), and run the same humanize pass: apply the full
`references/humanizer.md` checklist (no AI vocabulary, no forced rule-of-three, plain copulas, no
generic upbeat closer). Pick 5–6 hashtags relevant to the topic plus always `#iwork4dell`.

## Step 6 — Update index.html

Open `C:\alhaol.github.io\articles\index.html` and add a new `<article>` card **inside** the grid `<div class="grid ...">`. Insert it after the last existing `<!-- N. ... -->` comment block.

Card template:
```html
            <!-- NN. {{TITLE}} -->
            <article class="theme-card article-card rounded-xl overflow-hidden">
                <img src="Post_Images/Image_NN.png" alt="{{TITLE}}">
                <div class="article-card-content">
                    <div class="mb-3">
                        <span class="category-badge {{CATEGORY_1_CLASS}}">{{CATEGORY_1_LABEL}}</span>
                        <span class="category-badge {{CATEGORY_2_CLASS}}">{{CATEGORY_2_LABEL}}</span>
                    </div>
                    <h3 class="text-xl font-bold mb-2">{{TITLE}}</h3>
                    <p class="text-sm mb-4">{{SUBTITLE}}</p>
                    <p class="text-sm prose mb-4 flex-grow">{{CARD_DESCRIPTION}}</p>
                    <div class="article-card-footer">
                        <div>
                            <p class="published-date">{{PUBLISH_DATE}}</p>
                            <p class="read-time">{{READ_TIME}} read</p>
                        </div>
                        <a href="Articles/SLUG.html" class="article-link">Read →</a>
                    </div>
                </div>
            </article>
```

`{{CARD_DESCRIPTION}}` is a 1–2 sentence summary (different from subtitle) emphasizing the practical takeaway.

## Series / multi-article mode

When the user asks for several articles at once:
- Assign sequential numbers (e.g. 16, 17, 18) and matching image / LinkedIn numbers.
- In each article's Related Articles, **cross-link the sibling articles** in the batch (plus one or
  two relevant existing pieces) so the set reads as a coherent series.
- Download each hero image separately and validate each (see Step 3); retry only the ones that fail.

## Step 7 — Verify

After writing all files, confirm (use **Glob**, not `ls`):
- `articles/Articles/SLUG.html` exists and the hero image path is correct
- `articles/Post_Images/Image_NN.png` exists (or the user was told to add it)
- `articles/LinkedIn_Posts/NN_Title.md` exists
- `articles/index.html` contains the new card
- All `<a href>` links in the article point to real existing files
- No `—` or `–` characters appear in the new HTML or LinkedIn files
- All reference URLs are authenticated, resolve successfully, point to direct content rather than homepages, and are highly relevant to the topic context.
- Ran the humanizer audit (`references/humanizer.md`) over the article body and LinkedIn post: no
  AI-vocab clusters, forced triples, `-ing` padding, copula avoidance, mechanical boldface, or
  Title-Case headings remain

Report a summary table:

| File | Status |
|------|--------|
| `articles/Articles/SLUG.html` | ✓ Created |
| `articles/Post_Images/Image_NN.png` | ✓ Downloaded / ⚠ Needs manual image |
| `articles/LinkedIn_Posts/NN_Title.md` | ✓ Created |
| `articles/index.html` | ✓ Card added |

Then ask: "Ready to commit and push? Run `/saveit` to publish."

### Notes on publishing

- The Git warning `LF will be replaced by CRLF` on Windows is benign line-ending normalization, not
  an error. It does not need action.
- When committing manually, pass the message with repeated `-m` flags
  (`git commit -m "subject" -m "body"`) rather than a here-string, so no stray character leaks into
  the commit subject line.

---

Read `references/article-template.html` for the exact HTML boilerplate to use.
Read `references/index-card-example.html` to see the exact card format from a real example.
Read `references/linkedin-template.md` for the LinkedIn post format.
Read `references/humanizer.md` for the AI-tell checklist to apply in Steps 4b and 5.
