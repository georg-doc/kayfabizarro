#!/usr/bin/env python3
"""Git-Blob je Deck-JSON in media/kfb am festgenagelten MEDIA_COMMIT -> src/data/deck-blobs.json.
Der Pool-Vertrag (#365/#379) bindet jeden Beat an `cardBlob` = Blob des Deck-JSON; der Pool-Leser prüft das.
Quelle: GitHub Contents API (öffentlich). Aufruf: python3 scripts/deck-blobs.py"""
import json, re, urllib.request
commit = re.search(r"MEDIA_COMMIT = '([0-9a-f]{40})'", open('src/cardMapping.js').read()).group(1)
api = f'https://api.github.com/repos/georg-doc/kayfabizarro/contents/media/kfb?ref={commit}'
files = {f['name']: f['sha'] for f in json.load(urllib.request.urlopen(api))}
reg = json.load(urllib.request.urlopen(f'https://raw.githubusercontent.com/georg-doc/kayfabizarro/{commit}/media/kfb/index.json'))
out = {'schema': 'kfb.ws1.deck-blobs/1', 'media': commit, 'decks': {}}
for d in reg['decks']:
    if d.get('data') in files:
        out['decks'][d['packId']] = {'data': d['data'], 'blob': files[d['data']], 'pdf': d.get('pdf'), 'coverOffset': d.get('coverOffset')}
json.dump(out, open('src/data/deck-blobs.json', 'w'), indent=1, sort_keys=True)
print(len(out['decks']), 'Decks')
