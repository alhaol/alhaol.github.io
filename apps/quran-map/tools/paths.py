"""Shared paths for the Quran Map word-notes tools. Everything is relative to this folder."""
import os

TOOLS = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(TOOLS)                      # apps/quran-map
DATA = os.path.join(APP, 'data.json')             # Quran text, rukus, juz (bundled with the app)
GLOSS = os.path.join(APP, 'gloss.json')           # word notes: the single source of truth
CACHE = os.path.join(TOOLS, 'cache')              # downloaded quran.com data (git-ignored, re-fetch with fetch.py)
PARTS = os.path.join(TOOLS, 'parts')              # drafts waiting to be merged (git-ignored)
PROGRESS = os.path.join(TOOLS, 'progress.html')   # generated dashboard

SOURCES = {
    'wbw': 'Word-by-word English: quran.com',
    'muyassar': 'التفسير الميسر (مجمع الملك فهد)',
    'saadi': 'تفسير السعدي',
    'muslim': 'صحيح مسلم',
    'ibnkathir': 'تفسير ابن كثير',
}
