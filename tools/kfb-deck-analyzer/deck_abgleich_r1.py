#!/usr/bin/env python3
"""Deck-Abgleich R1: main gegen Spielstand (52adc8f1 + ws1/karten-druck-spiel). Nur git, kein PDF."""
import json, subprocess, sys, re, collections
REPO = sys.argv[1]
MAIN = 'origin/main'
GAME = 'origin/ws1/karten-druck-spiel'   # = 52adc8f1 + Druckfix 3 Decks
def show(ref, path):
    try: return subprocess.run(['git','-C',REPO,'show',f'{ref}:{path}'],capture_output=True,check=True).stdout
    except subprocess.CalledProcessError: return None
def cards(doc):
    if isinstance(doc, list): return doc
    for k in ('cards','deck','items'):
        if isinstance(doc.get(k), list): return doc[k]
    for v in doc.values():
        if isinstance(v, list) and v and isinstance(v[0], dict) and ('power' in v[0] or 'lore' in v[0]): return v
    return []
def name(c): return c.get('cardName', c.get('name')) or ''
def num(c, i): return c.get('cardNumber', c.get('num', i+1))
norm = lambda s: re.sub(r'\s+',' ',(s or '').strip())
idx = json.loads(show(GAME,'media/kfb/index.json'))
rows = []
for d in idx['decks']:
    p = 'media/kfb/' + d['data']
    a, b = show(MAIN,p), show(GAME,p)
    r = {'packId': d['packId'], 'title': d['title'], 'data': d['data'], 'pdf': d['pdf']}
    if a is None or b is None:
        r['klasse'] = 'unklar'; r['note'] = f"Datei fehlt in {'main' if a is None else 'Spiel'}"; rows.append(r); continue
    try: A, B = json.loads(a), json.loads(b)
    except Exception as e:
        r['klasse']='unklar'; r['note']=f'JSON-Fehler {e}'; rows.append(r); continue
    ca, cb = cards(A), cards(B)
    r['cardsMain'], r['cardsGame'] = len(ca), len(cb)
    ma = {num(c,i): c for i,c in enumerate(ca)}; mb = {num(c,i): c for i,c in enumerate(cb)}
    added = sorted(set(mb)-set(ma), key=str); removed = sorted(set(ma)-set(mb), key=str)
    case=title=power=lore=0; ex=[]
    for k in set(ma)&set(mb):
        x,y = ma[k], mb[k]
        nx, ny = norm(name(x)), norm(name(y))
        if nx!=ny:
            if nx.lower()==ny.lower() or nx==norm(y.get('cardNamePrint','')): case+=1
            else: title+=1; ex.append(f"#{k} Titel: {nx!r} → {ny!r}")
        if norm(x.get('power'))!=norm(y.get('power')): power+=1
        if norm(x.get('lore'))!=norm(y.get('lore')): lore+=1
    ts = collections.Counter((c.get('textSource') or {}).get('method','—') for c in cb)
    r.update(added=added, removed=removed, nurSchreibweise=case, titelAnders=title, powerAnders=power, loreAnders=lore,
             beispiele=ex[:5], textSourceSpiel=dict(ts), cardNamePrintSpiel=sum('cardNamePrint' in c for c in cb),
             jsonLegacySpiel=sum('jsonLegacy' in c for c in cb), gradeSpiel=sum(bool(c.get('grade')) for c in cb),
             extractionTool=B.get('extractionTool'), analysisVersion=B.get('analysisVersion'))
    if added or removed: r['klasse']='Karten fehlen/neu'
    elif title or power or lore: r['klasse']='Text abweichend'
    elif case: r['klasse']='nur Schreibweise'
    else: r['klasse']='gleich'
    rows.append(r)
json.dump(rows, sys.stdout, ensure_ascii=False, indent=1)
