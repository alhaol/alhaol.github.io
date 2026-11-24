"""Generate tools/progress.html: a 114-surah strip plus one card per surah listing its glossed words.
Status: live (in gloss.json) > review (in a tools/parts/part_*.json draft) > drafting (surahs passed as --active) > queued.
The page is also published as a claude.ai artifact; republish it after regenerating.
usage: python progress.py [--active 2-77] [--out <file>]
"""
import json, glob, os, sys, html, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import DATA, GLOSS, PARTS, PROGRESS

args = sys.argv[1:]
opt = lambda name, default: args[args.index(name) + 1] if name in args else default
data = json.load(open(DATA, encoding='utf-8'))
live = json.load(open(GLOSS, encoding='utf-8'))['words']
drafts = {}
for f in glob.glob(os.path.join(PARTS, 'part_*.json')):
    try: drafts.update({k: v for k, v in json.load(open(f, encoding='utf-8'))['words'].items() if k not in live})
    except Exception: pass
BATCH = list(range(1, 115))
ACTIVE = set()
for part in filter(None, opt('--active', '').split(',')):
    a, _, b = part.partition('-'); ACTIVE.update(range(int(a), int(b or a) + 1))

def words_for(src, n):
    return [(k, v) for k, v in src.items() if int(k.split(':')[0]) == n]

def status(n):
    if words_for(drafts, n): return 'review'
    if words_for(live, n): return 'live'
    if n in ACTIVE: return 'drafting'
    return 'queued'

def token(n, key):
    s, a, w = map(int, key.split(':'))
    return data[s - 1]['a'][a - 1].split(' ')[w - 1]

LABEL = {'live': 'Live in app', 'review': 'Drafted, checking', 'drafting': 'Drafting', 'queued': 'Queued'}
e = html.escape
cards = []
for n in BATCH:
    s, st = data[n - 1], status(n)
    ws = words_for(live, n) + words_for(drafts, n)
    chips = ''.join(f'<span class="w" title="{e(k)} · {e(v.get("en", ""))}">{e(token(n, k))}</span>' for k, v in ws)
    cards.append(f'''<article class="card s-{st}">
  <header><span class="num">{n}</span><span class="ar">{e(s["ar"])}</span></header>
  <div class="en">{e(s["en"])} <span class="muted">· {len(s["a"])} ayahs</span></div>
  <div class="row"><span class="pill">{LABEL[st]}</span><span class="count">{len(ws) or ""}{" words" if len(ws) > 1 else (" word" if len(ws) == 1 else "")}</span></div>
  <div class="words" dir="rtl">{chips}</div>
</article>''')

strip = ''.join(f'<span class="cell s-{status(n)}" title="{n}. {e(data[n-1]["en"])}: {LABEL[status(n)]}"></span>' for n in range(1, 115))
n_live_s = sum(1 for n in range(1, 115) if status(n) == 'live')
n_live_w = len(live)
b_live = sum(1 for n in BATCH if status(n) == 'live')
b_review = sum(1 for n in BATCH if status(n) == 'review')
b_words = sum(len(words_for(live, n) + words_for(drafts, n)) for n in BATCH)
stamp = datetime.datetime.now().strftime('%d %b %Y, %H:%M')
pct = round(100 * (b_live + 0.5 * b_review) / len(BATCH))

page = f'''<title>Quran Word Notes Progress</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Noto+Naskh+Arabic:wght@500;700&family=Space+Grotesk:wght@500;700&display=swap">
<style>
/* Layout: summary band, 114-surah strip, then a wrapping grid of surah cards in mushaf order. */
:root {{
  --bg: #f5f7f6; --surface: #ffffff; --fg: #17211d; --muted: #5d6b65; --line: #dbe3df;
  --live: #0f7a55; --live-bg: #dcf2e8; --review: #9a6a00; --review-bg: #fbefcf; --draft: #3e5f8a; --draft-bg: #e2eaf5; --queued: #b9c4bf;
  --display: 'Space Grotesk', system-ui, sans-serif; --body: 'IBM Plex Sans', system-ui, sans-serif; --arabic: 'Noto Naskh Arabic', 'Amiri', serif;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
  --bg: #0e1412; --surface: #151d1a; --fg: #e6eeea; --muted: #93a39c; --line: #26322d;
  --live: #4fd1a1; --live-bg: #12342a; --review: #f2c14e; --review-bg: #3a2f12; --draft: #8fb0de; --draft-bg: #1b2738; --queued: #34413b; color-scheme: dark }} }}
:root[data-theme="dark"] {{
  --bg: #0e1412; --surface: #151d1a; --fg: #e6eeea; --muted: #93a39c; --line: #26322d;
  --live: #4fd1a1; --live-bg: #12342a; --review: #f2c14e; --review-bg: #3a2f12; --draft: #8fb0de; --draft-bg: #1b2738; --queued: #34413b; color-scheme: dark }}
body {{ background: var(--bg); color: var(--fg); font-family: var(--body); line-height: 1.5; }}
.wrap {{ max-width: 1120px; margin: 0 auto; padding-block: 28px 48px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 22px; }}
h1 {{ font-family: var(--display); font-size: clamp(1.6rem, 3vw, 2.2rem); margin: 0; text-wrap: balance; }}
h2 {{ font-family: var(--display); font-size: 1.1rem; margin: 0; }}
.sub {{ color: var(--muted); margin: 4px 0 0; max-width: 70ch; }}
.stats {{ display: flex; flex-wrap: wrap; gap: 28px; font-variant-numeric: tabular-nums; }}
.stat b {{ display: block; font-family: var(--display); font-size: 1.7rem; line-height: 1.1; }}
.stat span {{ color: var(--muted); font-size: .8rem; text-transform: uppercase; letter-spacing: .06em; }}
.bar {{ height: 8px; border-radius: 99px; background: var(--line); overflow: hidden; }}
.bar i {{ display: block; height: 100%; width: {pct}%; background: var(--live); }}
.strip {{ display: grid; grid-template-columns: repeat(38, 1fr); gap: 3px; direction: rtl; }}
.cell {{ aspect-ratio: 1; border-radius: 3px; background: var(--queued); max-width: 100%; }}
.cell.s-live {{ background: var(--live); }} .cell.s-review {{ background: var(--review); }} .cell.s-drafting {{ background: var(--draft); }}
.legend {{ display: flex; flex-wrap: wrap; gap: 14px; font-size: .8rem; color: var(--muted); }}
.legend i {{ display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; vertical-align: -1px; }}
.grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; direction: rtl; }}
.card {{ direction: ltr; background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; display: grid; gap: 6px; align-content: start; min-width: 0; }}
.card header {{ display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }}
.num {{ font-family: var(--display); font-weight: 700; color: var(--muted); font-variant-numeric: tabular-nums; }}
.ar {{ font-family: var(--arabic); font-size: 1.25rem; font-weight: 700; }}
.en {{ font-weight: 600; font-size: .92rem; }} .muted {{ color: var(--muted); font-weight: 400; }}
.row {{ display: flex; align-items: center; justify-content: space-between; gap: 8px; }}
.pill {{ font-size: .72rem; font-weight: 600; padding: 2px 9px; border-radius: 99px; }}
.s-live .pill {{ background: var(--live-bg); color: var(--live); }} .s-review .pill {{ background: var(--review-bg); color: var(--review); }}
.s-drafting .pill {{ background: var(--draft-bg); color: var(--draft); }} .s-queued .pill {{ background: var(--line); color: var(--muted); }}
.count {{ font-size: .78rem; color: var(--muted); font-variant-numeric: tabular-nums; }}
.words {{ display: flex; flex-wrap: wrap; gap: 4px; }}
.w {{ font-family: var(--arabic); font-size: .95rem; padding: 0 7px; border-radius: 6px; background: var(--bg); border: 1px solid var(--line); }}
.foot {{ color: var(--muted); font-size: .8rem; }}
@media (max-width: 520px) {{ .strip {{ grid-template-columns: repeat(19, 1fr); }} }}
</style>
<div class="wrap">
  <div>
    <h1>Quran Word Notes Progress</h1>
    <p class="sub">Essential-word notes for the Quran Map reader. Each note pairs quran.com's word-by-word English with a meaning from التفسير الميسر and context from تفسير السعدي. All 114 surahs have notes in the app. Regenerate with tools/progress.py after any new batch.</p>
  </div>
  <div class="stats">
    <div class="stat"><b>{b_live + b_review} / 114</b><span>Surahs drafted</span></div>
    <div class="stat"><b>{b_words}</b><span>Words drafted or live</span></div>
    <div class="stat"><b>{n_live_s} / 114</b><span>Surahs live overall</span></div>
    <div class="stat"><b>{n_live_w}</b><span>Words live overall</span></div>
  </div>
  <div class="bar" role="img" aria-label="Progress {pct} percent"><i></i></div>
  <section style="display:grid;gap:8px">
    <h2>All 114 surahs</h2>
    <div class="strip">{strip}</div>
    <div class="legend"><span><i style="background:var(--live)"></i>Live in app</span><span><i style="background:var(--review)"></i>Drafted, checking</span><span><i style="background:var(--draft)"></i>Drafting</span><span><i style="background:var(--queued)"></i>Queued</span><span>Read right to left, from Al-Fatihah.</span></div>
  </section>
  <section style="display:grid;gap:10px">
    <h2>By surah</h2>
    <div class="grid">{"".join(cards)}</div>
  </section>
  <p class="foot">Updated {stamp}. Each card lists the words chosen for that surah; hover a word for its English meaning.</p>
</div>
'''
out = opt('--out', PROGRESS)
open(out, 'w', encoding='utf-8').write(page)
print('statuses', {k: sum(1 for n in range(1, 115) if status(n) == k) for k in LABEL}, 'batch words', b_words)
