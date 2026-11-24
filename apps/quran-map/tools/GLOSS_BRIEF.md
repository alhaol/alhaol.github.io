# Brief: drafting Quran word notes ("gloss") for the Quran Map reader

T = apps/quran-map/tools (run every command from this folder; first run `python fetch.py <first> <last>` for your surahs)

The Quran Map app underlines a few essential words per surah; clicking one shows a card. The owner approved
the format on Al-Fatihah and Juz 30. Your job: draft entries for the surahs you are assigned, in the same style.

## Approved examples — read these first
`../gloss.json` → "words" holds the approved entries for all 114 surahs. Read at least
1:1:3, 1:4:3, 1:7:6, 80:1:1, 93:7:2, 105:3:4 to absorb tone, length and how sources are cited.

## Tools
- Digest: `python digest.py <surah> [--full]` prints for every ayah: token positions as the reader
  splits the text (`3:word=english`; `(mark)` tokens are pause marks — never choose them), quran.com
  word-by-word English, `M:` Tafsir al-Muyassar, `S:` Tafsir al-Sa'di (trimmed to 500 chars; `--full` for all of it).
  `*` marks words that already have a note. Long surahs: redirect to a file and read it in parts (e.g. `> parts/digest_<n>.txt`).
- Check: `python build_gloss.py --src parts/part_<first>-<last>.json --out parts/check.json -v`
  It prints each `key word = wbw` and any `PROBLEM` lines, without touching the app.

## Which words (the owner insists: only the most essential and important)
- Words a reader genuinely needs explained: rare/gharib vocabulary, or key terms whose Quranic sense differs
  from everyday use (e.g. dīn = recompense, ḍāll in 93:7). Skip common words and names everyone knows.
- Budget: roughly 1 word per 10–12 ayahs; a little denser for surahs rich in rare vocabulary; minimum 2 per
  surah, maximum 20 (Al-Baqarah up to 25). Spread choices across the surah, not all at the start.
- Gloss the first occurrence of a word in the surah only. Avoid words already glossed in ../gloss.json
  unless the sense here is different.

## Entry format (key "surah:ayah:position", position from the digest)
```
"2:2:6": {
  "tr": "lil-muttaqīn",            // transliteration
  "root": "و ق ي",                 // spaced Arabic root letters, "" if none
  "form_en": "...", "form_ar": "...",   // short grammatical note (standard morphology)
  "en": "...",                      // YOUR clear English meaning, one sentence
  "ar": "...",                      // meaning taken / condensed from al-Muyassar's wording, one sentence
  "note_en": "...", "note_ar": "...",   // short context, mostly from al-Sa'di ("قال السعدي:" when quoting); <= ~45 words each; "" if nothing useful
  "see": ["surah:ayah"],            // related ayahs ONLY if certain (e.g. ones the tafsir itself quotes), else []
  "src": ["wbw", "muyassar", "saadi"]   // codes actually used; add "ibnkathir"/"muslim" only if genuinely cited
}
```
Do NOT include "w" or "wbw" (the build script fills them).

## Accuracy and style rules
- Never invent hadith, quotes or attributions. Quotes from al-Muyassar / al-Sa'di must match the digest text.
  When al-Muyassar explains several ayahs in one passage, take the wording from that shared passage.
- Where quran.com's word-by-word differs from the tafsirs, follow the tafsirs in "en"/"ar" (the card shows both).
- Sensitive verses (prophets, other faiths, rulings): state what the tafsirs say, attributed, neutrally.
- Plain English, short sentences, no em dashes. ﷺ after mentions of the Prophet.
- Valid UTF-8 JSON.

## Output
Write `parts/part_<first>-<last>.json` = {"words": {...}} with keys in mushaf order. Run the check, fix every
PROBLEM, and confirm each printed `word = wbw` is the word you meant. Do not edit ../gloss.json or anything else in the site; the owner merges with merge_parts.py. Final report: count per surah, list of keys + words, and any doubts (keep it brief).
