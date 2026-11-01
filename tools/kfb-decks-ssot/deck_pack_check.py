#!/usr/bin/env python3
"""Prüfskript Deck-Paket R1. python3 deck_pack_check.py <paketordner> [...]
FAIL, wenn eine Karte Text, Bild oder Bewertung vermisst, etwas verwaist ist oder die Zahl nicht zum PDF passt. Exit 0 nur ohne FAIL."""
import json, os, re, sys, unicodedata
from PIL import Image

STERNE = lambda s: 5 if s >= 9 else 4 if s >= 7 else 3 if s >= 5 else 2 if s >= 3 else 1


def check(p):
    fail, warn = [], []
    pack = os.path.basename(p.rstrip('/'))
    d = json.load(open(os.path.join(p, 'deck.json')))
    pr_name = next((f for f in os.listdir(p) if unicodedata.normalize('NFC', f) == 'prüfung.json'), None)
    if not pr_name:
        fail.append('prüfung.json fehlt')
    if d.get('schema') != 'kfb.deck-paket/1':
        fail.append('schema falsch')
    if d.get('packId') != pack:
        fail.append(f"packId {d.get('packId')} passt nicht zum Ordner")
    if not os.path.exists(os.path.join(p, d.get('cover', 'bilder/cover.webp'))):
        fail.append('Cover fehlt')
    q = d.get('quelle', {})
    cs = d.get('cards', [])
    erwartet = (q.get('seiten', 0) - q.get('coverOffset', 1)) * 4
    extra = q.get('kartenAbweichung')
    if len(cs) != erwartet and not extra:
        fail.append(f'{len(cs)} Karten, PDF lässt {erwartet} erwarten (ohne erklärte Abweichung)')
    if not re.fullmatch(r'[0-9a-f]{64}', q.get('sha256', '')):
        fail.append('PDF-Prüfsumme fehlt')
    seen, used = set(), set()
    for c in cs:
        n = c.get('n')
        tag = f'#{n}'
        if n in seen:
            fail.append(tag + ' doppelt')
        seen.add(n)
        if c.get('cid') != f'cid:{pack}:{n}':
            fail.append(tag + ' cid falsch')
        offen = (c.get('pruefstand') or {}).get('printOpen')
        if not (c.get('cardName') or '').strip():
            fail.append(tag + ' Titel fehlt')
        for f in ('power', 'lore'):
            if not (c.get(f) or '').strip() and not offen:
                fail.append(f'{tag} {f} fehlt ohne printOpen')
        r = c.get('rating') or {}
        sc = r.get('scores') or {}
        if set(sc) != {'pointe', 'power', 'lore', 'wissen', 'bild'}:
            fail.append(tag + ' Bewertung unvollständig')
        else:
            if any(v not in (0, 1, 2) for v in sc.values()):
                fail.append(tag + ' Punkte außerhalb 0-2')
            elif STERNE(sum(sc.values())) != r.get('stars'):
                fail.append(f"{tag} Sterne {r.get('stars')} passen nicht zur Summe {sum(sc.values())}")
        if not (r.get('reason') or '').strip():
            fail.append(tag + ' Begründung fehlt')
        if c.get('grade') not in (1, 2, 3, None):
            warn.append(tag + ' grade ungewöhnlich')
        for kind in ('karte', 'motiv'):
            rel = (c.get('bilder') or {}).get(kind)
            fp = os.path.join(p, rel) if rel else None
            if not fp or not os.path.exists(fp):
                fail.append(f'{tag} Bild {kind} fehlt')
                continue
            used.add(rel)
            with Image.open(fp) as im:
                if im.format != 'WEBP':
                    fail.append(f'{tag} {kind} ist kein WebP')
                w = max(im.size)
                if kind == 'karte' and not 1300 <= w <= 1420:
                    fail.append(f'{tag} karte {w} px')
                if kind == 'motiv' and w > 720:
                    fail.append(f'{tag} motiv {w} px')
        m = (c.get('motiv') or {}).get('rect')
        if not m or len(m) != 4 or m[0] < 0 or m[1] < 0 or m[0] + m[2] > 1.001 or m[1] + m[3] > 1.001 or m[2] <= 0 or m[3] <= 0:
            fail.append(tag + ' Motiv-Rechteck ungültig')
        if not (c.get('herkunft') or {}).get('seite'):
            fail.append(tag + ' Herkunft fehlt')
        if not (c.get('pruefstand') or {}).get('checkedAt'):
            fail.append(tag + ' Prüfstand fehlt')
    for kind in ('karte', 'motiv'):
        folder = os.path.join(p, 'bilder', kind)
        for f in sorted(os.listdir(folder)) if os.path.isdir(folder) else []:
            if f"bilder/{kind}/{f}" not in used:
                fail.append(f'verwaistes Bild {kind}/{f}')
    for f in sorted(os.listdir(p)):
        if f not in ('deck.json', 'bilder', 'texte') and unicodedata.normalize('NFC', f) != 'prüfung.json':
            warn.append('unerwartet im Paket: ' + f)
    if d.get('marketing', {}).get('tier') == 'ROT' and os.path.isdir(os.path.join(p, 'texte')):
        fail.append('ROT-Deck darf kein texte/ haben')
    v = (d.get('bewertung') or {}).get('deckRating') or {}
    if not v.get('stars'):
        fail.append('deckRating fehlt')
    st = [c['rating']['stars'] for c in cs if c.get('rating')]
    if st:
        a, b = sum(1 for s in st if s == 5) / len(st), sum(1 for s in st if s >= 4) / len(st)
        if (a > .10 or b > .30) and not v.get('ratingNote'):
            warn.append(f'Inflationsbremse: 5★ {a:.0%}, 4+5★ {b:.0%} ohne ratingNote')
    return {'packId': pack, 'karten': len(cs), 'ergebnis': 'FAIL' if fail else 'PASS', 'fail': fail, 'warn': warn}


if __name__ == '__main__':
    res = [check(p) for p in sys.argv[1:]]
    for r in res:
        print(f"{r['packId']}: {r['ergebnis']} ({r['karten']} Karten, {len(r['fail'])} FAIL, {len(r['warn'])} Hinweise)")
        for x in r['fail'][:30]:
            print('  FAIL', x)
        for x in r['warn'][:30]:
            print('  warn', x)
    sys.exit(0 if all(r['ergebnis'] == 'PASS' for r in res) else 1)
