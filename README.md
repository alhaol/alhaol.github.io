# alhaol.github.io

Personal portfolio and tools website for **Ibrahim AbuAlhaol** — AI Technical Lead | PhD, PEng, SMIEEE — hosted at [alhaol.github.io](https://alhaol.github.io).

## Overview

A static GitHub Pages site built with plain HTML, [Tailwind CSS](https://tailwindcss.com/), and vanilla JavaScript. The main portfolio is data-driven: content is loaded from `conf/profile.json` and styled via `conf/style.json`, making it easy to update without touching HTML.

## Run locally

```bash
python -m http.server 8000   # then open http://localhost:8000/
```

No build step, no package manager.

## Structure

```
.
├── index.html          # Main portfolio / CV page (two foldable docks: hub bottom-right → Apps Hub, Articles, Blooms, Memory, Books, Prompts, Pages, Snippets, Resources; stats bottom-left → citations, patents, conferences, journals)
├── conf/
│   ├── profile.json    # Portfolio data (bio, experience, publications, patents…)
│   └── style.json      # Theme / colour-scheme configuration
├── assets/             # Shared static assets (profile image; also used as site-wide favicon)
├── links/
│   ├── index.html      # Apps Hub — searchable, category-filtered card grid (data-driven)
│   └── links.json      # App registry (edit this to add / update / remove apps)
├── presentations/      # Browser-native HTML decks
│   ├── index.html      # Presentations Hub landing page (data-driven)
│   ├── presentations.json   # Deck registry (edit to surface a new deck)
│   ├── assets/         # Shared deck engine: css/, js/, images/, pdfs/, artifacts/
│   └── Presentations/
│       ├── _template/      # Reusable HTML deck template — duplicate per new deck
│       ├── _not_approved/  # Gitignored: draft decks live here until approved
│       └── <slug>/         # Approved decks live one level up; listed in presentations.json
├── articles/           # Technical Articles series
│   ├── index.html      # Articles landing page (54 articles grid)
│   ├── Post_Images/    # Hero images for articles (Image_NN.png/.jpg, 1200x630; Fig_NN_* for in-article raster figures)
│   ├── LinkedIn_Posts/ # Companion LinkedIn post drafts (one per article)
│   └── Articles/       # Individual article pages
│       └── _not_approved/  # Gitignored: draft articles staged here until approved
│       └── # 54 article pages, the-paradigm-shift.html … buying-the-format.html
├── playlist/           # Playlists Hub
│   ├── index.html      # Playlists landing page (card grid, gold accent)
│   ├── playlists.json  # Playlist registry (edit to surface a new playlist)
│   └── <slug>/         # One playlist per folder: index.html + data.json
└── apps/               # (partial listing — see the Pages & Apps table below for all apps)
    ├── _not_approved/  # Gitignored: draft apps staged here until approved
    ├── 21/             # 21 Repetitions tracker
    ├── books/          # Neural Archive — AI & data science e-book library
    ├── build-system/   # Build System playlist (14 self-improvement videos)
    ├── careermap/      # Interactive career journey / timeline
    ├── collection/     # Agentic AI video collection (7 videos)
    ├── dash/           # Geometry Dash audio library (20 tracks)
    ├── fullbody/       # Full-body workout video playlist (5 videos)
    ├── hifz/           # Quran Hifz Repeater — memorisation tool
    ├── ibm-ai/         # AI concepts video playlist (11 videos)
    ├── ibm-cs/         # Cybersecurity Architecture video series
    ├── invest-python/  # Python for investing video playlist (15 videos)
    ├── rukus/          # Quran Ruku Ultimate — Arabic reader with audio
    ├── systems/        # Life Systems Visualizer (AFPISH & P3N3SLW)
    ├── tasfeer-alsadi/ # Tafseer Al-Sadi — full 114-surah Arabic video series
    ├── tier-lists/     # Exercise tier-list video playlist (7 videos)
    ├── todo/           # TaskMaster Pro — focus-mode task manager
    ├── warmup/         # Warmup & core workout playlist (25 videos)
    └── wizard-duel/    # Wizard Duel — 2-player turn-based battle game with monsters
├── memory/             # Memory Classes — cognitive masterclasses built for long-term retention
│   ├── index.html      # Memory Hub (data-driven from memory.json)
│   ├── memory.json     # Memory-class registry
│   ├── Memories/       # Individual class pages (NN_slug_YYYY-MM-DD.html)
│   ├── LinkedIn_Posts/ # Companion post drafts (one per class)
│   └── _not_approved/  # Gitignored: drafts staged here until approved
├── books/              # Books — full books distilled into interactive workbook pages
│   ├── index.html      # Books Hub (data-driven from books.json)
│   ├── books.json      # Book registry
│   ├── books/          # Individual book pages (NNN_slug.html)
│   └── _not_approved/  # Gitignored: drafts + their .book.json staged here until approved
├── workshops/          # Hands-on, code-first workshop decks (reuse the presentations deck engine)
│   ├── index.html      # Workshops hub (data-driven from workshops.json)
│   ├── workshops.json  # Workshop registry
│   ├── assets/         # workshop.css — workshop-only components (exercises, callouts, motion)
│   └── <slug>/         # One folder per workshop: index.html + images/
├── pages/              # Masterclass Library — self-contained interactive learning pages
│   ├── index.html      # Static card-grid landing page (not data-driven; add a card per new class)
│   └── NNN_slug.html   # Individual masterclass pages (001_the_synthetic_mind.html …)
├── snippets/           # Snippet Library — short, self-contained, vetted reference scripts
│   ├── index.html      # Card-grid gallery with filter (not data-driven; add a card per new snippet)
│   └── NN_slug/        # One folder per snippet: NN_slug.html doc page + source (.py/.sh/.js)
└── resources/          # Research Resources — filterable index of tier-one research sources
    └── index.html      # Single self-contained page; the registry is the RESOURCES array inside it
```

## Pages & Apps

| App | URL | Description |
|-----|-----|-------------|
| Portfolio | `/` | Full CV: bio, motto, experience, education, patents, publications, recent activity. The portrait is the contact link (mailto). Every section folds, one open at a time. Two docks, both starting folded: **hub** bottom-right (`+` unfolds Apps Hub, Articles, Blooms, Memory, Books, Prompts, Pages, Snippets, Resources, Playlists; Presentations commented out) and **stats** bottom-left (`#` unfolds citations, patents, conferences, journals). Folding either flattens its glyph — `+` to `−`, `#` to `=` — and Esc or a click outside does the same. |
| Apps Hub | `/links/` | Landing page for all apps below — searchable, category-filtered card grid (data-driven via `links/links.json`) |
| Technical Articles | `/articles/` | 54-article series on agentic AI, cognitive systems, AI security, and advanced engineering practices (dark-blue theme). Data-carrying diagrams are authored inline SVG (see `the-experience-bottleneck.html`); heroes are authored as vector art and exported to `Post_Images/Image_NN.png` |
| Bloom Classes | `/blooms/` | Single-topic learning pages structured by Bloom's Taxonomy in Peak Preview order: an opening judgment call you cannot yet defend, the foundation built underneath it, then a capstone that resolves it. Each page carries a level pyramid, sticky sidebar, freehand sketchpad and a retrieval quiz that resurfaces what you missed. |
| Memory Classes | `/memory/` | 3-class series that moves one concept into long-term memory via the 5-step cognitive sequence (chunk, offload to a diagram, spring a trap, scaffold, then re-encode it into the format you will actually retrieve it in: a decision card, a rule you say aloud, a diagram you redraw from memory, a causal graph you rebuild edge by edge, a procedure with the decisions blanked out, a letter system you fill in yourself, a metrical rule, or real code). Each page carries a freehand sketchpad, a light/dark toggle and a retrieval quiz that resurfaces what you missed. |
| Learning Prompts | `/prompts/` | 9 copy-paste prompts that turn any chat AI into an active tutor — it asks before it tells and won't hand over the answer until you've tried. Searchable icon card grid; opening a prompt gives you a form for its `[PLACEHOLDER]` blanks with live substitution, a one-click copy, and a hand-off into a fresh chat. Driven by `prompts/prompts.json` over the markdown in `prompts/mds/`. |
| Books | `/books/` | 2 books distilled into interactive workbooks: every model the book actually teaches gets a redrawn diagram, a what/how/when card and a worked example, all placed on a 2x2 memory map so a model can be found again mid-decision. Each page lets you sort your own items into a model's zones, sketch over the figure and answer three questions in place, with everything persisted locally and exportable as JSON. Login-gated. |
| Presentations | `/presentations/` | Browser-native HTML decks (cyber theme + light/dark toggle). Arrow keys to navigate, `F` fullscreen, `T` theme, `O` overview, `N` speaker notes, `↓ pdf` button or `E` to export. Decks cloned from `Presentations/_template/`. Current decks: _template demo, The Efficiency Trilemma, Predicting the Network |
| Workshops | `/workshops/` | 1-workshop hands-on series (shared deck engine, login-gated, code-first). Build-along decks where each module ends in a "your turn" exercise; real code embedded via the create-workshop-presentation-html skill's scripts. |
| Playlists | `/playlist/` | Video courses, one folder per playlist, each with its own tracker. The hub is a searchable, tag-filtered card grid driven by `playlist/playlists.json`; a playlist page reads its own `data.json` and keeps watch progress, ratings, tags, notes and per-video annotations in the browser. Currently 5 playlists (150 videos): Gemini Enterprise (49, English), Math for Data Science (10, English), Your Life as a System (11, English) and two Arabic courses (47 and 33). |
| Pages | `/pages/` | Masterclass Library — 5 self-contained interactive learning pages: The Synthetic Mind (knowledge, cognitive, causal & wisdom graphs in AI agents), The Wealth Barbell (sequencing employment, investing, entrepreneurship & family business via Taleb's Barbell Strategy), The Grafted Tree (raising kids fluent in Western life and rooted in Islamic values), The AFPISH Operating System (Allah, family, profession, independence, social life & health as six scheduled processes), The Focus Loop (attention residue, implementation intentions, and an AI-held loop that turns a 23-minute restart into a 20-second one). |
| Snippets | `/snippets/` | Snippet Library — 10 short, self-contained, vetted reference scripts (Python, Bash, JavaScript) with a filterable card gallery. Each opens a doc sheet with usage, input/output, and source. Covers hash-file, json-pretty-print, find-large-files, csv-to-json, count-lines, port-check, backup-file, disk-usage-top, uuid-gen, slugify. |
| Research Resources | `/resources/` | Curated index of 267 tier-one research sources across AI/ML, robotics, cybersecurity and 5G/6G wireless (plus a shared core, a cross-cutting reproducibility section, and 21 technology influencers worth reading daily). Every entry says what you get from it and why it is worth the time. **30 ranked top picks** (5 per domain) lead each section with a personalised rationale tied to the profile in `conf/profile.json`: agentic AI, knowledge graphs, GNNs, network digital twins, O-RAN, and the 42-patent IP portfolio. Filter by domain, by type or by picks only; search names/descriptions/tags; `/` focuses search; copy the visible set out as markdown. Light/dark toggle persisted in localStorage, overridable with `?theme=light` or `?theme=dark`. Colour-and-shape icons per type and domain, skip link, `aria-pressed` filters and a live result count. Single self-contained page; the registry is the `RESOURCES` array in the file. |
| InvestStack | `http://138.197.135.196:5173/` | External — agentic investment platform with AI-powered basket analysis and investor education |
| 21 Repetitions | `/apps/21/` | Habit-building tracker based on the 21-repetitions principle |
| Neural Archive | `/apps/books/` | AI & data science e-book library with PDF viewer (12 books) |
| Build System | `/apps/build-system/` | Curated self-improvement & productivity video playlist (14 videos) |
| Career Map | `/apps/careermap/` | Interactive visualisation of Ibrahim's professional journey |
| AI Collection | `/apps/collection/` | Agentic AI and multi-LLM video collection (7 videos) |
| Dash Audio | `/apps/dash/` | Geometry Dash music audio library (20 tracks) |
| Full Body | `/apps/fullbody/` | Science-based full-body workout video playlist (5 videos) |
| Quran Hifz | `/apps/hifz/` | Quran memorisation repeater with loop and segment controls |
| IBM AI | `/apps/ibm-ai/` | Foundational AI concepts and terminology video playlist (11 videos) |
| Cybersecurity Videos | `/apps/ibm-cs/` | Cybersecurity Architecture Series video collection |
| Invest Python | `/apps/invest-python/` | Python for finance and stock analysis video playlist (15 videos) |
| Quran Ruku | `/apps/rukus/` | Quran reader organised by ruku with Arabic text and audio |
| Life Systems | `/apps/systems/` | Multi-system visualiser for AFPISH & P3N3SLW frameworks |
| Tafseer Al-Sadi | `/apps/tasfeer-alsadi/` | Complete Quran Tafseer Al-Sadi — all 114 surahs (Arabic, 114 videos) |
| Tier Lists | `/apps/tier-lists/` | Science-ranked exercise tier-list video playlist (7 videos) |
| Canada Tax Maximizer | `/apps/tax/` | Ontario federal/provincial tax estimator with RRSP/TFSA strategy, deductions and refund optimization |
| TaskMaster Pro | `/apps/todo/` | Focus-mode task manager with active-task hero view |
| Warmup | `/apps/warmup/` | Daily warmup and core workout video playlist (25 videos) |
| Wizard Duel | `/apps/wizard-duel/` | 2-player turn-based wizard battle game with monsters |
| theMITmonk Vault | `/apps/mitmonk/` | Searchable explorer for Sandeep Swadia's videos — filter by topic/year/value, AI concept summaries, in-page playback, and a paste-a-URL watchlist |
| Yaqeen Vault | `/apps/yaqeen/` | Searchable explorer for Yaqeen Institute lectures (Dr. Omar Suleiman) — seerah, spiritual growth, end-times signs & khutbahs with AI summaries, in-page playback, and a watchlist |
| Wealth Vault | `/apps/wealth/` | Searchable explorer for Codie Sanchez's videos — buying businesses, money mindset, wealth habits, sales & BigDeal interviews with AI summaries, in-page playback, and a watchlist |
| Habit Cards | `/apps/habit-cards/` | Spaced-repetition flashcard trainer for theMITmonk's nine micro-habits (attention, energy, happiness) with level tracking and a study streak; companion to the article The Smallest Lever |
| The 3C Protocol | `/apps/learn-fast/` | Spaced-repetition flashcard trainer for Sandeep Swadia's 3C Protocol (Compress, Compile, Consolidate) with a taxonomy map and knowledge graph; based on theMITmonk's video How To Learn So Fast It's Almost Unfair |
| Systems Thinking | `/apps/systems-thinking/` | Spaced-repetition flashcard trainer for Sandeep Swadia's framework for systems thinking (Clear, Complicated, Complex, Chaotic, and the DART framework) with a taxonomy map and knowledge graph; based on theMITmonk's video How To Think SO CLEARLY People Assume You're A Genius |
| High-Performance Skills | `/apps/high-performance-skills/` | Spaced-repetition flashcard trainer for Sandeep Swadia's seven high-performance skills across three relationships (with yourself, with others, with reality) with a taxonomy map and knowledge graph; based on his video 7 Skills That Will Be Worth Twice As Much By 2030 |
| Quran 247 | `/apps/quran-247/` | Quran reader with a 604-page mushaf view and a verse-by-verse view — synchronized recitation, translation audio and tafseer audio, 20 reciters, 17 translations, 6 tafseer editions, auto-scroll follow-along, bookmarks and resume |
| Thinking Habits | `/apps/thinking-habits/` | Spaced-repetition flashcard trainer for Dr Justin Sung's nine habits for clearer thinking — the anatomy of confusion, five habits to stop and four to start — with a taxonomy map and knowledge graph; based on his video 9 Habits For Clearer Thinking (I Wish I Knew Sooner) |
| Memory Ladder | `/apps/memory-ladder/` | Spaced-repetition flashcard trainer for Dr Justin Sung's Memory Ladder — the six conditions for enduring memory and the three rungs (repetition, diverse retrieval, evaluation and synthesis) you choose between by asking how much a memory is worth, with a taxonomy map and knowledge graph |
| Ruku Hifz | `/apps/ruku-hifz/` | Quran memorization workspace that shows one ruku a page with the verse before it and the verse after it for continuity — seamless paging across surah boundaries, jump by surah or ruku number, blur-to-recall self-testing, boxing individual verses for a second pass, per-ayah recitation with repeat counts, a spaced review schedule with due queue, streak and activity heatmap, dark/light modes, and per-ruku progress across all 551 rukus |


## Updating Content

All portfolio content lives in `conf/profile.json`. Edit that file to update:

- Personal info, summary, and stats (citations, patents, journals)
- Work experience and education
- Publications, patents, and patent applications
- Recent activities / highlights

Theme colours and display preferences are controlled by `conf/style.json`.

Each playlist app reads its own `data.json` in the same folder — update that file to add or remove videos.

## Tech Stack

- **HTML5** — semantic, no build step required
- **Tailwind CSS** (CDN) — utility-first styling
- **Vanilla JavaScript** — data loading, filtering, and interactivity
- **Google Fonts** — Inter (UI) and Amiri (Arabic text)
- **GitHub Pages** — hosting

## About Ibrahim AbuAlhaol

AI Technical Lead and System Architect at Dell Technologies (Ottawa, Canada). PhD in Electrical and Computer Engineering. Inventor with 42+ patents. Research focus areas: Agentic AI, intelligent edge systems, 5G/6G networks, and advanced cybersecurity. 1,000+ academic citations.

- Email: iabualhaol@gmail.com
- LinkedIn: [linkedin.com/in/abualhaol](https://linkedin.com/in/abualhaol/)
- Google Scholar: [scholar.google.com](https://scholar.google.com/citations?user=UougQ9UAAAAJ)
