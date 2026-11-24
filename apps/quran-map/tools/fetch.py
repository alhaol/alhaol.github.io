"""Download quran.com word-by-word English, Tafsir al-Muyassar (16) and Tafsir al-Sa'di (91) for a surah range
into tools/cache/ as wbw<n>.json, m<n>.json, s<n>.json. Follows pagination. Safe to re-run (overwrites).
usage: python fetch.py <first surah> [<last surah>]
"""
import json, os, sys, time, urllib.request
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import CACHE, DATA

API = 'https://api.quran.com/api/v4'
KINDS = {
    'wbw': ('verses', API + '/verses/by_chapter/{c}?words=true&word_fields=text_uthmani&word_translation_language=en&per_page=50&page={p}'),
    'm': ('tafsirs', API + '/tafsirs/16/by_chapter/{c}?per_page=50&page={p}'),
    's': ('tafsirs', API + '/tafsirs/91/by_chapter/{c}?per_page=50&page={p}'),
}

def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'quran-map-tools'})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except Exception:
            if attempt == 2: raise
            time.sleep(2 + attempt * 3)

def main():
    a = int(sys.argv[1]); b = int(sys.argv[2]) if len(sys.argv) > 2 else a
    os.makedirs(CACHE, exist_ok=True)
    data = json.load(open(DATA, encoding='utf-8'))
    for c in range(a, b + 1):
        for kind, (key, tpl) in KINDS.items():
            items, p = [], 1
            while p:
                d = get(tpl.format(c=c, p=p))
                items += d[key]
                p = (d.get('pagination') or {}).get('next_page')
            json.dump({key: items}, open(os.path.join(CACHE, f'{kind}{c}.json'), 'w', encoding='utf-8'), ensure_ascii=False)
        n = len(json.load(open(os.path.join(CACHE, f'wbw{c}.json'), encoding='utf-8'))['verses'])
        ok = 'ok' if n == len(data[c - 1]['a']) else f'!! {n} of {len(data[c - 1]["a"])} ayahs'
        print(f'surah {c}: {ok}')

if __name__ == '__main__':
    main()
