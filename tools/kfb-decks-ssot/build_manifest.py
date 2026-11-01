#!/usr/bin/env python3
"""Kleines Manifest je Deck fürs Spiel (V-1180): Bildpfade relativ zum Paket, Seitenverhältnis, Motiv-Rechteck.
python3 build_manifest.py <paketordner> [...]. Die Basis-Adresse setzt der Einbauende; das Manifest kennt keinen Host."""
import json, os, sys
from PIL import Image
for p in sys.argv[1:]:
    d = json.load(open(os.path.join(p, 'deck.json')))
    cards = []
    for c in d['cards']:
        with Image.open(os.path.join(p, c['bilder']['karte'])) as im:
            w, h = im.size
        with Image.open(os.path.join(p, c['bilder']['motiv'])) as im:
            mw, mh = im.size
        cards.append({'cid': c['cid'], 'n': c['n'], 'name': c['cardName'], 'karte': c['bilder']['karte'], 'motiv': c['bilder']['motiv'],
                      'w': w, 'h': h, 'ar': round(w / h, 4), 'motivWH': [mw, mh], 'motivRect': c['motiv']['rect'], 'motivGuete': c['motiv']['guete']})
    m = {'schema': 'kfb.deck-manifest/1', 'packId': d['packId'], 'title': d['title'], 'cover': d['cover'], 'cards': cards}
    json.dump(m, open(os.path.join(p, 'manifest.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    ars = [c['ar'] for c in cards]
    print(d['packId'], len(cards), 'ar', min(ars), max(ars), os.path.getsize(os.path.join(p, 'manifest.json')) // 1024, 'KB')
