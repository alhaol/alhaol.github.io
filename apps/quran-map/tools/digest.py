"""Print a drafting digest for one or more surahs: each ayah's tokens with positions (as the reader splits them),
quran.com word-by-word English, Tafsir al-Muyassar (M:) and al-Sa'di (S:). Needs fetch.py run first.
usage: python digest.py <surah> [<surah> ...] [--full]     (--full prints al-Sa'di untrimmed)
"""
import json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import CACHE, DATA, GLOSS

sys.stdout.reconfigure(encoding='utf-8')
full = '--full' in sys.argv
data = json.load(open(DATA, encoding='utf-8'))
glossed = json.load(open(GLOSS, encoding='utf-8'))['words'] if os.path.exists(GLOSS) else {}
clean = lambda t: re.sub(r'\s+', ' ', re.sub('<[^>]+>', '', t)).strip()
isword = lambda t: bool(re.search('[ء-يٱ]', t))   # standalone pause marks (e.g. ۖ) are not words

for c in [int(x) for x in sys.argv[1:] if not x.startswith('--')]:
    s = data[c - 1]
    load = lambda k: json.load(open(os.path.join(CACHE, f'{k}{c}.json'), encoding='utf-8'))
    wbw = {int(v['verse_key'].split(':')[1]): [w for w in v['words'] if w['char_type_name'] == 'word'] for v in load('wbw')['verses']}
    mu = {t['verse_key']: clean(t['text']) for t in load('m')['tafsirs']}
    sa = {t['verse_key']: clean(t['text']) for t in load('s')['tafsirs']}
    print(f'################ SURAH {c} {s["en"]} ({s["ar"]}) — {len(s["a"])} ayahs')
    for i, a in enumerate(s['a'], 1):
        toks, ws = a.split(' '), wbw.get(i, [])
        flags = [isword(t) for t in toks]
        flag = '' if sum(flags) == len(ws) else f'  !! {sum(flags)} words vs {len(ws)} wbw'
        print(f'--- {c}:{i}{flag}')
        out, wi = [], 0
        for j, t in enumerate(toks, 1):
            star = '*' if f'{c}:{i}:{j}' in glossed else ''          # * = already has a note
            if not flags[j - 1]: out.append(f'{j}:{t}(mark)'); continue
            out.append(f'{star}{j}:{t}={ws[wi]["translation"]["text"] if wi < len(ws) else "?"}'); wi += 1
        print('  ' + ' | '.join(out))
        k = f'{c}:{i}'
        if k in mu: print('  M: ' + mu[k])
        if sa.get(k): print('  S: ' + (sa[k] if full else sa[k][:500]))
