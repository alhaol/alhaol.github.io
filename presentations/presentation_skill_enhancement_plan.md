# Presentation Skill Enhancement Plan

> **Status**: Draft — not yet implemented  
> **Scope**: `create-presentation` skill + deck engine (`deck.js`, `deck.css`, `_template`)  
> **Goal**: Expand the agent's visualization palette and introduce interactive approval gates so every deck produced is visually diverse and content-rich.

---

## Section 1 — Problem Statement

### Current Ceiling

The `create-presentation` skill (`C:\md-skills\skills\create-presentation\SKILL.md`) produces structurally correct decks but the agent consistently reaches for the same small set of components regardless of content type:

- **Stat-grid** for key numbers
- **Mermaid flowchart (LR)** for any system or process diagram
- **Table** for comparisons
- **Two-column** for concept + detail

Evidence from the 5 existing production decks: every deck contains a stat-grid and at least one LR flowchart. No deck uses a chart library, timeline, process-steps, comparison grid, or any Mermaid diagram type other than flowchart.

### Root Causes

1. The skill's interview asks about visualization mix as a free-form question — the agent doesn't know what to ask for because the palette isn't enumerated.
2. The `_template/index.html` shows only basic slide types; Chart.js and richer Mermaid types are not demonstrated.
3. There are no selection heuristics — no rule tells the agent "if you're comparing 5 models on accuracy, use a bar chart, not a table."
4. No approval gates — the user cannot redirect visualization choices before the agent has already generated 15 slides.

### What High-Impact Decks Look Like

A visually diverse deck for a 15-minute technical talk uses:
- **1–2 Chart.js charts** for quantitative comparisons (bar for single-metric, radar for multi-dimensional)
- **1 sequence or flowchart diagram** for system/interaction flows
- **1 timeline or process-steps component** for methodology or roadmap slides
- **1 comparison grid** when 3–4 options are evaluated side-by-side
- **Stat-grid sparingly** (1–2 instances max, for the hook or the wrap)

---

## Section 2 — Skill Creation Best Practices Applied

This enhancement follows the `skill-creator` conventions:

### Interview First, Generate Second
Every ambiguous decision (visualization type, chart axis, timeline entries) surfaces to the user before generation starts. The agent never auto-selects a chart type without the user confirming the data shape.

### Approval Gates
Three mandatory checkpoints where the skill pauses and calls `AskUserQuestion`:

| Gate | When | What user reviews |
|------|------|-------------------|
| **Gate A** | After interview, before subagents | Outline (slide count, section titles, visualization map per slide) |
| **Gate B** | After critique + research return | Top 5 critique revisions + top 3 research citations; user picks which to apply |
| **Gate C** | After deck is drafted | Slide-type breakdown table; user confirms before registry + README writes |

### Parallel Subagents (Unchanged)
Critique and research subagents still run concurrently after Gate A approval.

### Evals Before Changes
Any edit to `SKILL.md` must ship with new eval scenarios in `evals.json` that cover the new component types. The eval passes when the agent picks the correct visualization for the given content shape.

---

## Section 3 — Visual Enhancement Inventory

### 3a. New Library Components (require deck.js changes)

| Component | Slide class | Chart.js type | When to use |
|-----------|-------------|---------------|-------------|
| Bar chart | `.slide-chart` | `bar` | Comparing 2–5 items on 1–2 metrics (accuracy, latency, energy, F1-score) |
| Radar chart | `.slide-chart` | `radar` | Multi-dimensional model comparison on 4+ axes at the same scale |
| Line chart | `.slide-chart` | `line` | Trend over time, training loss curve, adoption growth |

**Implementation**: `deck.js` lazy-loads Chart.js v4 from CDN (same pattern as Mermaid). Canvas element carries `data-chart` attribute containing JSON config. Charts re-render on theme toggle with cyber-dark or light color palettes.

### 3b. New CSS-Only Components (require deck.css changes only)

| Component | CSS class | When to use | Priority |
|-----------|-----------|-------------|----------|
| Timeline | `.timeline` / `.timeline-item` | Project milestones, paper history, adoption roadmap | High |
| Process steps | `.process-steps` / `.process-step` | Sequential methodology (collect→train→evaluate→deploy) | High |
| Comparison grid | `.comparison-grid` / `.comparison-card` | Side-by-side 3–4 options with a clear winner (`.highlight`) | High |
| Score bar | `.score-bar` / `.score-bar-fill` | Visual % inside a card or table cell | Medium |
| Architecture zones | `.arch-zones` / `.arch-layer` | Layered system diagram (hardware → firmware → app → cloud) | Medium |

### 3c. Existing Mermaid Types to Add to Skill Palette

These are already supported by the engine but not referenced in the skill's generation guidance:

| Mermaid type | Keyword | When to use |
|--------------|---------|-------------|
| `sequenceDiagram` | `sequenceDiagram` | Agent↔tool↔LLM interaction flows, API call sequences, protocol handshakes |
| `quadrantChart` | `quadrantChart` | Strategic positioning on 2 axes (accuracy vs cost, risk vs impact) |
| `mindmap` | `mindmap` | Concept map branching from one central theme |
| `timeline` | `timeline` (Mermaid v10+) | Chronological event list when CSS timeline is too plain |

---

## Section 4 — Content Enhancement Rules

### Selection Heuristics (to be added to SKILL.md generation step)

```
IF content compares N items on 1 or 2 metrics       → bar chart (not table)
IF content compares items on 4+ axes, same scale    → radar chart
IF content shows a trend or time series             → line chart
IF content describes system/agent interaction flow  → sequenceDiagram (not flowchart)
IF content describes a strategic tradeoff (2-axis)  → quadrantChart
IF content has a roadmap or milestone history       → timeline component
IF content has a sequential process (steps 1-N)     → process-steps component
IF content compares 3–4 options, one is recommended → comparison-grid with .highlight
IF content has 3–6 key numbers to anchor            → stat-grid (limit to 1 instance/deck)
```

### Density Rule
Maximum 1 complex visualization (chart, diagram, comparison grid) per slide. Stat-grid and score-bars may accompany other elements but not dominate.

### Diversity Target
No more than 3 consecutive slides of the same type. If the draft has 4 `.slide-content` in a row, the third must be converted to a different type.

### Fragment Strategy
- Chart.js datasets: add `data-fragment` to each dataset block so bars/lines reveal one series at a time.
- `.timeline-item` elements: each carries `data-fragment` so the timeline builds from top to bottom.
- `.process-step` elements: each carries `data-fragment` for left-to-right pipeline build.
- Comparison grid cards: each `.comparison-card` carries `data-fragment`; `.highlight` card reveals last.

---

## Section 5 — SKILL.md Changes (Diff Summary)

### 5.1 Interview Step Update
Change visualization-mix question from free-form text to a multi-select `AskUserQuestion` listing all components from Section 3. User picks which types fit their content; the agent uses their answer to assign components to slides in the outline.

### 5.2 Add Gate A (New — after interview)
After building the outline, present it as:
```
Slide 1: Cover
Slide 2: Hook — hook-stat (dominant number)
Slide 3: Promise — data-fragment bullets
Slide 4: Section // 01
Slide 5: bar chart — accuracy comparison (3 models)
...
```
`AskUserQuestion`: "Does this outline and visualization map look right before I launch research?"

### 5.3 Add Palette Reference Table (New — inline in Step 4)
Insert the full inventory table from Section 3 as a reference block immediately before the generation instruction so the agent can consult it while writing slides without searching externally.

### 5.4 Add Chart.js Syntax Block (New — in Step 4)
Concrete copy-pasteable canvas syntax:

```html
<!-- Bar chart -->
<section class="slide slide-chart">
  <div class="slide-body">
    <h2>Model Accuracy Comparison</h2>
    <canvas data-chart='{
      "type": "bar",
      "data": {
        "labels": ["GPT-4o", "Llama-3.1-8B", "Mistral-7B"],
        "datasets": [{
          "label": "Top-1 Accuracy (%)",
          "data": [87.3, 79.1, 76.8],
          "backgroundColor": ["rgba(0,255,65,0.7)", "rgba(0,204,51,0.5)", "rgba(0,153,38,0.4)"],
          "borderColor": "#00ff41",
          "borderWidth": 1
        }]
      },
      "options": {
        "responsive": true,
        "plugins": { "legend": { "labels": { "color": "#ffffff" } } },
        "scales": {
          "x": { "ticks": { "color": "#b3b3b3" }, "grid": { "color": "rgba(255,255,255,0.05)" } },
          "y": { "ticks": { "color": "#b3b3b3" }, "grid": { "color": "rgba(255,255,255,0.05)" }, "beginAtZero": true }
        }
      }
    }'></canvas>
  </div>
</section>

<!-- Radar chart -->
<section class="slide slide-chart">
  <div class="slide-body">
    <h2>Multi-Dimensional Model Comparison</h2>
    <canvas data-chart='{
      "type": "radar",
      "data": {
        "labels": ["Accuracy", "Speed", "Energy", "Memory", "Cost"],
        "datasets": [
          {
            "label": "GPT-4o", "data": [87, 62, 45, 40, 30],
            "borderColor": "#00ff41", "backgroundColor": "rgba(0,255,65,0.15)", "pointBackgroundColor": "#00ff41"
          },
          {
            "label": "Llama-3.1-8B", "data": [79, 88, 82, 75, 90],
            "borderColor": "#00cc33", "backgroundColor": "rgba(0,204,51,0.1)", "pointBackgroundColor": "#00cc33"
          }
        ]
      },
      "options": {
        "responsive": true,
        "scales": { "r": { "ticks": { "color": "#b3b3b3", "backdropColor": "transparent" }, "grid": { "color": "rgba(255,255,255,0.08)" }, "pointLabels": { "color": "#ffffff" } } },
        "plugins": { "legend": { "labels": { "color": "#ffffff" } } }
      }
    }'></canvas>
  </div>
</section>
```

### 5.5 Add Gate B (Existing step, now explicit)
After subagents return, present:
- Critique punch list (top 5 items, ordered by impact)
- Top 3 research citations with URLs
`AskUserQuestion` (multi-select): "Which critique items should I apply, and which citations should I weave in?"

### 5.6 Add Gate C (New — after deck draft)
Before writing registry + README, output a slide-type breakdown:
```
Generated 14 slides:
- 3 × .slide-content
- 2 × .slide-chart (1 bar, 1 radar)
- 2 × .slide-diagram (1 flowchart, 1 sequence)
- 1 × .slide-content [timeline]
- 1 × .slide-content [process-steps]
- 1 × .slide-content [comparison-grid]
- 1 × .slide-quote
- 1 × .slide-code
- 1 × .slide-cover
- 1 × .slide-end
```
`AskUserQuestion`: "Does this structure look right? I'll write to presentations.json and README.md next."

---

## Section 6 — Template Changes (Diff Summary)

New slides to add to `presentations/Presentations/_template/index.html` (after existing examples, before `.slide-end`):

1. **Bar chart slide** — 3-model accuracy comparison with `data-chart` JSON
2. **Radar chart slide** — 5-axis model comparison
3. **Sequence diagram slide** — `sequenceDiagram` with agent↔tool↔LLM pattern
4. **Quadrant chart slide** — `quadrantChart` with accuracy vs cost axes
5. **Timeline slide** — 5-item CSS `.timeline` with years and descriptions
6. **Process-steps slide** — 5-step CSS `.process-steps` pipeline
7. **Comparison-grid slide** — 3 `.comparison-card` with `.highlight` on recommended option and `.score-bar` inside each card

Each new slide carries `<aside class="speaker-notes">` explaining when to use it and how to customize the data.

---

## Section 7 — Engine Changes (Diff Summary)

### deck.js (~80 lines added)

```javascript
// Chart.js lazy loading — mirrors _loadMermaid() pattern
function _loadCharts() {
  const hasCharts = document.querySelector('.slide-chart canvas[data-chart]');
  if (!hasCharts) return;
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';
  script.onload = () => _renderChartsOnSlide(currentSlide);
  document.head.appendChild(script);
}

function _renderChartsOnSlide(idx) {
  const slide = slides[idx];
  if (!slide || !slide.classList.contains('slide-chart')) return;
  const canvas = slide.querySelector('canvas[data-chart]');
  if (!canvas || canvas._chartInstance) return;
  const config = JSON.parse(canvas.getAttribute('data-chart'));
  _applyChartTheme(config);
  canvas._chartInstance = new Chart(canvas, config);
}

function _applyChartTheme(config) {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const labelColor = isDark ? '#ffffff' : '#111111';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)';
  // Walk config.options.scales and plugins.legend to apply theme colors
  // ...
}

// On theme toggle: destroy and re-render all chart instances
function _reRenderCharts() {
  document.querySelectorAll('canvas[data-chart]').forEach(canvas => {
    if (canvas._chartInstance) { canvas._chartInstance.destroy(); canvas._chartInstance = null; }
  });
  _renderChartsOnSlide(currentSlide);
}
```

Call `_loadCharts()` after login succeeds (same location as `_loadMermaid()`).  
Call `_reRenderCharts()` in the theme-toggle handler (same location as Mermaid re-render).  
Call `_renderChartsOnSlide(idx)` in the slide-change handler.

### deck.css (~140 lines added)

Five new component blocks appended after existing rules, each scoped to `.slide-body` to avoid conflicts:

```css
/* Timeline */
.timeline { ... }
.timeline-item { display: grid; grid-template-columns: 5rem 1fr; gap: 1rem; align-items: start; }
.timeline-year { font-family: 'JetBrains Mono'; color: var(--primary-color); ... }
.timeline-content h4 { ... }
.timeline-content p { color: var(--text-muted); ... }

/* Process Steps */
.process-steps { display: flex; gap: 0; align-items: stretch; flex-wrap: wrap; }
.process-step { flex: 1; min-width: 120px; background: var(--card-bg); border: 1px solid rgba(0,255,65,0.15); ... }
.process-step + .process-step::before { content: '→'; color: var(--primary-color); ... }
.step-num { font-family: 'JetBrains Mono'; color: var(--primary-color); font-size: 1.4rem; font-weight: 700; }
.step-label { font-size: 0.8rem; color: var(--text-muted); }

/* Comparison Grid */
.comparison-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
.comparison-card { background: var(--card-bg); border: 1px solid rgba(0,255,65,0.15); border-radius: 6px; padding: 1rem; }
.comparison-card.highlight { border-color: var(--primary-color); box-shadow: 0 0 12px var(--accent-glow); }
.comparison-card h4 { color: var(--primary-color); margin: 0 0 0.5rem; }

/* Score Bar */
.score-bar { height: 6px; background: rgba(0,255,65,0.15); border-radius: 3px; margin-top: 4px; overflow: hidden; }
.score-bar-fill { height: 100%; background: var(--primary-color); border-radius: 3px; box-shadow: 0 0 6px var(--accent-glow); }

/* Architecture Zones */
.arch-zones { display: flex; flex-direction: column; gap: 0.5rem; }
.arch-layer { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; border-radius: 6px; border-left: 4px solid var(--primary-color); background: var(--card-bg); }
.arch-layer-label { font-family: 'JetBrains Mono'; font-size: 0.75rem; color: var(--primary-color); min-width: 6rem; }
```

---

## Section 8 — Eval Scenarios

Four new entries to add to `C:\md-skills\skills\create-presentation\evals\evals.json`:

```json
{
  "id": "benchmark-comparison-source",
  "description": "Source contains accuracy/latency table for 4 models — expects bar chart, not table",
  "source": "We benchmarked GPT-4o, Llama-3.1-8B, Mistral-7B, and Phi-3-mini on SQuAD 2.0. GPT-4o scored 87.3 F1 (120ms latency), Llama-3.1-8B scored 79.1 F1 (42ms), Mistral-7B scored 76.8 F1 (38ms), Phi-3-mini scored 71.2 F1 (18ms).",
  "audience": "engineers",
  "expected_components": ["slide-chart:bar", "NOT:table-only-comparison"]
},
{
  "id": "sequential-methodology-source",
  "description": "Source describes a 5-step pipeline — expects process-steps component",
  "source": "Our approach: (1) collect network traces, (2) preprocess and normalize, (3) train GNN on graph snapshots, (4) evaluate on held-out topology, (5) deploy as O-RAN xApp.",
  "audience": "engineers",
  "expected_components": ["process-steps", "NOT:bulleted-list-only"]
},
{
  "id": "roadmap-source",
  "description": "Source has year-by-year milestones — expects timeline component",
  "source": "2020: Initial RNN baseline published. 2021: GNN extension with 12-point improvement. 2022: Patent filed for digital twin architecture. 2023: O-RAN alliance demo. 2024: First commercial deployment. 2026: Multi-vendor rollout.",
  "audience": "executives",
  "expected_components": ["timeline", "NOT:table-only-timeline"]
},
{
  "id": "strategic-tradeoff-source",
  "description": "Source has accuracy vs cost framing — expects quadrantChart",
  "source": "We categorize models by accuracy and inference cost. High accuracy / high cost: GPT-4o. High accuracy / low cost: Llama-3.1-70B. Low accuracy / low cost: Phi-3-mini. Low accuracy / high cost: avoid.",
  "audience": "executives",
  "expected_components": ["mermaid:quadrantChart", "NOT:table-only"]
}
```

---

## Section 9 — Implementation Sequence (Gated)

Each phase ends with a user approval gate before the next phase begins.

```
Phase 1: Engine
  ├── Edit deck.css — add 5 CSS component blocks
  ├── Edit deck.js — add Chart.js lazy loading
  ├── Edit _template/index.html — add 7 new example slides
  └── ← USER APPROVES: open template in browser, verify charts + CSS components render correctly

Phase 2: Skill
  ├── Edit SKILL.md — expand interview question
  ├── Edit SKILL.md — add Gate A (outline approval)
  ├── Edit SKILL.md — add Palette Reference table
  ├── Edit SKILL.md — add Chart.js syntax block
  ├── Edit SKILL.md — add Gate B (critique/research approval)
  ├── Edit SKILL.md — add Gate C (structure approval before registry write)
  └── ← USER APPROVES: read updated SKILL.md end-to-end

Phase 3: Evals
  ├── Edit evals.json — add 4 new eval scenarios
  ├── Run /skill-creator eval on create-presentation
  └── ← USER REVIEWS: eval pass rate; fix regressions before merging

Phase 4: Docs
  ├── Edit _template/template.md — add new component syntax to markdown DSL reference
  └── ← Done — no registry or README changes needed (template is not a deck entry)
```

---

## Quick Reference: Component Decision Tree

```
Content shape                        → Use
─────────────────────────────────────────────────────────
N items, 1-2 metrics                 → bar chart
N items, 4+ axes, same scale         → radar chart
1 metric trending over time          → line chart
Steps in a sequential process        → process-steps
Year-by-year milestones              → timeline
3-4 options, one recommended         → comparison-grid
2-axis strategic positioning         → quadrantChart
System/agent interaction flow        → sequenceDiagram
Decision tree / data pipeline        → flowchart (LR)
Concept map / related ideas          → mindmap
3-6 anchor numbers (hook or wrap)    → stat-grid
Single authoritative statement       → quote slide
Long reference data (specs, params)  → table
Code snippet / config                → code slide
```
