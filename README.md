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
├── index.html          # Main portfolio / CV page (foldable hub dock, bottom-right → Apps Hub, Articles, Blooms, Memory, Prompts. Presentations entry is commented out)
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
│   ├── index.html      # Articles landing page (43 articles grid)
│   ├── Post_Images/    # Hero images for articles (Image_01 through Image_43, .png/.jpg; Fig_NN_* for in-article raster figures)
│   ├── LinkedIn_Posts/ # Companion LinkedIn post drafts (one per article)
│   └── Articles/       # Individual article pages
│       └── _not_approved/  # Gitignored: draft articles staged here until approved
│       └── # 43 article pages, the-paradigm-shift.html … the-experience-bottleneck.html
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
```

## Pages & Apps

| App | URL | Description |
|-----|-----|-------------|
| Portfolio | `/` | Full CV: bio, experience, education, patents, publications, recent activity. A single foldable hub dock at bottom-right: it starts folded — tap `+` to unfold labelled links to the Apps Hub, Articles, Blooms, Memory, Books and Prompts, `−` to fold. Presentations entry is commented out. |
| Apps Hub | `/links/` | Landing page for all apps below — searchable, category-filtered card grid (data-driven via `links/links.json`) |
| Technical Articles | `/articles/` | 43-article series on agentic AI, cognitive systems, AI security, and advanced engineering practices (dark-blue theme). Data-carrying diagrams are authored inline SVG (see `the-experience-bottleneck.html`) |
| Bloom Classes | `/blooms/` | Single-topic learning pages structured by Bloom's Taxonomy in Peak Preview order: an opening judgment call you cannot yet defend, the foundation built underneath it, then a capstone that resolves it. Each page carries a level pyramid, sticky sidebar, freehand sketchpad and a retrieval quiz that resurfaces what you missed. |
| Memory Classes | `/memory/` | 2-class series that moves one concept into long-term memory via the 5-step cognitive sequence (chunk, offload to a diagram, spring a trap, scaffold, then re-encode it into the format you will actually retrieve it in: a decision card, a rule you say aloud, a diagram you redraw from memory, a causal graph you rebuild edge by edge, a procedure with the decisions blanked out, a letter system you fill in yourself, a metrical rule, or real code). Each page carries a freehand sketchpad, a light/dark toggle and a retrieval quiz that resurfaces what you missed. |
| Learning Prompts | `/prompts/` | 9 copy-paste prompts that turn any chat AI into an active tutor — it asks before it tells and won't hand over the answer until you've tried. Searchable icon card grid; opening a prompt gives you a form for its `[PLACEHOLDER]` blanks with live substitution, a one-click copy, and a hand-off into a fresh chat. Driven by `prompts/prompts.json` over the markdown in `prompts/mds/`. |
| Books | `/books/` | 1 book distilled into an interactive workbook: every model the book actually teaches gets a redrawn diagram, a what/how/when card and a worked example, all placed on a 2x2 memory map so a model can be found again mid-decision. Each page lets you sort your own items into a model's zones, sketch over the figure and answer three questions in place, with everything persisted locally and exportable as JSON. Login-gated. |
| Presentations | `/presentations/` | Browser-native HTML decks (cyber theme + light/dark toggle). Arrow keys to navigate, `F` fullscreen, `T` theme, `O` overview, `N` speaker notes, `↓ pdf` button or `E` to export. Decks cloned from `Presentations/_template/`. Current decks: _template demo, The Efficiency Trilemma, Predicting the Network |
| Workshops | `/workshops/` | 1-workshop hands-on series (shared deck engine, login-gated, code-first). Build-along decks where each module ends in a "your turn" exercise; real code embedded via the create-workshop-presentation-html skill's scripts. |
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
