# Baut src/data/deck-genres.json: je Deck genre (Liste, klein), bundle und role (index.json) aus den Deck-JSONs in media/kfb am MEDIA_COMMIT (V-245: Palette nach genre/bundle).
# python3 scripts/build-deck-genres.py [MEDIA_COMMIT]
import json, re, sys, urllib.parse, urllib.request, concurrent.futures as cf
commit = (sys.argv[1:] or [re.search(r"MEDIA_COMMIT = '([0-9a-f]{40})'", open('src/cardMapping.js').read()).group(1)])[0]
base = f'https://raw.githubusercontent.com/georg-doc/kayfabizarro/{commit}/media/kfb/'
idx = json.load(urllib.request.urlopen(base + 'index.json'))['decks']
def one(d):
    j = json.load(urllib.request.urlopen(base + urllib.parse.quote(d['data'])))
    g = j.get('genre'); g = g if isinstance(g, list) else ([g] if g else [])
    return d['packId'], {'genre': [str(x).strip().lower() for x in g if x], 'bundle': (str(j.get('bundle') or '').strip().lower() or None), 'role': d.get('role') or None}  # role: Deck-Rolle aus index.json (Gewicht in cardSemanticVector)
with cf.ThreadPoolExecutor(12) as ex: out = dict(sorted(ex.map(one, idx)))
json.dump({'source': f'georg-doc/kayfabizarro media/kfb @{commit} (Deck-JSON: genre, bundle)', 'decks': out}, open('src/data/deck-genres.json', 'w'), ensure_ascii=False, indent=1)
print(len(out), 'decks')
