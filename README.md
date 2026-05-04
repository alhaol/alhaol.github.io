# alhaol.github.io

Personal portfolio and tools website for **Ibrahim AbuAlhaol** — AI Technical Lead | PhD, PEng, SMIEEE — hosted at [alhaol.github.io](https://alhaol.github.io).

## Overview

A static GitHub Pages site built with plain HTML, [Tailwind CSS](https://tailwindcss.com/), and vanilla JavaScript. The main portfolio is data-driven: content is loaded from `profile.json` and styled via `style.json`, making it easy to update without touching HTML.

## Structure

```
.
├── index.html          # Main portfolio / CV page (bottom-left circle FAB → Apps Hub)
├── links.html          # Apps Hub — landing page for all /apps with search + category filters
├── profile.json        # Portfolio data (bio, experience, publications, patents…)
├── style.json          # Theme / colour-scheme configuration
├── imgs/               # Profile images
├── pdfs/               # PDF documents
├── articles/           # Technical Articles series
│   ├── index.html      # Articles landing page (11 articles grid)
│   ├── Post_Images/    # Hero images for articles (Image_01.png through Image_11.png)
│   ├── LinkedIn_Posts/ # Companion LinkedIn post drafts (one per article)
│   └── Articles/       # Individual article pages
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
│       └── small-model-efficiency.html
├── links/
│   └── index.html      # Resource Hub — searchable, filterable link collection
└── apps/
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
| Portfolio | `/` | Full CV: bio, experience, education, patents, publications, featured articles, recent activity |
| Apps Hub | `/links.html` | Landing page for all apps below — searchable, category-filtered card grid (also reachable via the floating circle on `/`) |
| Technical Articles | `/articles/` | 11-article series on agentic AI, cognitive systems, and advanced engineering practices |
| Resource Hub | `/links/` | Curated, searchable resource links with grid / list toggle |
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

All portfolio content lives in `profile.json`. Edit that file to update:

- Personal info, summary, and stats (citations, patents, journals)
- Work experience and education
- Publications, patents, and patent applications
- Recent activities / highlights

Theme colours and display preferences are controlled by `style.json`.

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
