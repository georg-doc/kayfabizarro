#!/usr/bin/env python3
"""Ergebnisteil eines Analyzer-Berichts aus pilot/*.print.json + logs/*.apply.json (Markdown auf stdout).
Nutzung: python3 make_report.py <packId> [<packId> …]"""
import json, sys, os
from collections import Counter
here = os.path.dirname(os.path.abspath(__file__))
nm = lambda xs: [x['cardName'] if isinstance(x, dict) else x for x in xs]
for p in sys.argv[1:]:
    l = json.load(open(f'{here}/logs/{p}.apply.json')); P = json.load(open(f'{here}/pilot/{p}.print.json')); D = P['deck']; R = D['deckRating']
    f = Counter(x for c in l['changed'] for x in c['fields'])
    print(f"### `{p}`\n")
    print(f"- Karten: {l['cards']} · Titel geändert {f.get('cardName',0)} · Power geändert {f.get('power',0)} · Lore geändert {f.get('lore',0)} · neu {len(l['added'])} · nicht im Druck {len(l['notInPrint'])} · offen (printOpen) {len(l['open'])} · unverändert bestätigt {len(l['confirmed'])}")
    print(f"- Zuordnung: {P.get('mappingNote') or 'Registry stimmt'}")
    print(f"- Bewertung: Deck {R['stars']}★ (Ø {R['avgPoints']} Punkte), Verteilung {R['distribution']}. {R['reason']}" + (f" Hinweis: {R['ratingNote']}" if R.get('ratingNote') else ''))
    print(f"- Top: {', '.join(nm(D['topCards']))} · Schwächste: {', '.join(nm(D['worstCards']))}")
    print(f"- Viral-Score {D['viralScore']}: {D['viralReason']}")
    print("- Titeländerungen: " + ('; '.join(f"#{c['n']} „{c['old']['cardName']}“ → „{c['new']['cardName']}“" for c in l['changed'] if 'cardName' in c['fields']) or 'keine'))
    print("- Auffälligkeiten:"); [print(f"  - {x}") for x in P.get('findings', [])]; print()
