"""Merge reviewed draft files into gloss.json, then rebuild it (fills w/wbw and checks every key).
A draft is {"words": {"s:a:w": {...}}}; an existing key is replaced, so this is also how corrections go in.
usage: python merge_parts.py <draft.json> [<draft.json> ...]
"""
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import GLOSS, TOOLS

doc = json.load(open(GLOSS, encoding='utf-8'))
before = len(doc['words'])
for f in sys.argv[1:]:
    for k, v in json.load(open(f, encoding='utf-8'))['words'].items():
        doc['words'][k] = v
json.dump(doc, open(GLOSS, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'gloss.json {before} -> {len(doc["words"])} entries before rebuild')
sys.exit(subprocess.call([sys.executable, '-I', os.path.join(TOOLS, 'build_gloss.py')]))
