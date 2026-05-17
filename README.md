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
├── index.html          # Main portfolio / CV page (FABs: bottom-left → Apps Hub, bottom-right → Articles. Presentations FAB is commented out)
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
│   ├── index.html      # Articles landing page (14 articles grid)
│   ├── Post_Images/    # Hero images for articles (Image_01.png through Image_14.png)
│   ├── LinkedIn_Posts/ # Companion LinkedIn post drafts (one per article)
│   └── Articles/       # Individual article pages
│       └── _not_approved/  # Gitignored: draft articles staged here until approved
│       ├── the-paradigm-shift.html
│       ├── cognitive-shortcuts.html
│       ├── context-management-hygiene.html
│       ├── extended-working-memory.html
│       ├── headless-automation.html
│       ├── multi-agent-orchestration.html
│       ├── parallel-cognitive-processes.html
│       ├── progressive-token-budgets.html
│       ├── structured-rpi-workflows.html
│       ├── the-trust-gradient.html
│       ├── small-model-efficiency.html
│       ├── agentic-cli-context-patterns.html
│       ├── the-agentic-os.html
│       └── the-augmentation-trap.html
└── apps/
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
```

## Pages & Apps

| App | URL | Description |
|-----|-----|-------------|
| Portfolio | `/` | Full CV: bio, experience, education, patents, publications, recent activity. Floating circle FABs: bottom-left → Apps Hub, bottom-right → Articles. Presentations FAB is commented out. |
| Apps Hub | `/links/` | Landing page for all apps below — searchable, category-filtered card grid (data-driven via `links/links.json`) |
| Technical Articles | `/articles/` | 14-article series on agentic AI, cognitive systems, and advanced engineering practices (dark-blue theme) |
| Presentations | `/presentations/` | Browser-native HTML decks (cyber theme + light/dark toggle). Arrow keys to navigate, `F` fullscreen, `T` theme, `O` overview, `N` speaker notes, `↓ pdf` button or `E` to export. Decks cloned from `Presentations/_template/`. Current decks: 6 (including the EdTech 2026 trilogy: Designing for Effort, Mission-Based Adoption, AI for Learning Engineering) |
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
| TaskMaster Pro | `/apps/todo/` | Focus-mode task manager with active-task hero view |
| Warmup | `/apps/warmup/` | Daily warmup and core workout video playlist (25 videos) |
| Wizard Duel | `/apps/wizard-duel/` | 2-player turn-based wizard battle game with monsters |

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
