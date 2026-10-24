#!/usr/bin/env python3
"""WS-NPC Karten-Tratsch Stufe 0 · Datenschnappschuss aus georg-doc/kayfabizarro, gepinnt (Commit + Blob je Datei).

Liest aus einem lokalen Klon (Standard ~/kfb-ws1/kayfabizarro) per git, ohne Arbeitsbaum, Zweig ws-song/workshop-r1:
  - SSOT_SPOKEN_LINES/TR1_INDEX.json (kfb.tr1.index/1): je Deck lines.csv (card_number, triplet), blocked.json, Kartenquelle
    · tr1 = Tratsch-Triplets nach SSOT (ganze Sätze, Titel im Satz, kein Doppelpunkt) · ENTWURF bis Georgs Abnahme; t1 ist verworfen (Georg 23.10.)
    · blocked = Karten, die nie gesprochen werden, auch nicht roh (SSOT S12; Georg bzw. WS0 entscheiden endgültig)
  - SSOT_SPOKEN_LINES/checks.json (früher rules.json; Regeln S…, W…)
  - SONGS_WORKSHOP_R1/OPENER_POOL_BY_STANCE_R1.json (kfb.opener-pool.stance/1; die SIM nutzt nur status POOL)
  - SONGS_WORKSHOP_R1/signature/SIGNATURE_DECKS_R1.json (Georg 20.10. bestätigt; Grundlage je Eintrag)
cards.json im Spiel ist die Druckfassung (mvp 2d236e2); die tr1-Kartenquellen sind damit identisch (geprüft 24.10.).
Schreibt src/data/npc/tratsch/tratsch-data.r1.json. Aufruf: python3 scripts/tratsch/sync-tratsch-data.py [<commit>]
"""
import csv, io, json, os, subprocess, sys

REPO = os.path.expanduser('~/kfb-ws1/kayfabizarro')
COMMIT = sys.argv[1] if len(sys.argv) > 1 else 'a428e0913764e604eeaeff630ea423710323ce60'  # ws-song/workshop-r1, 24.10. (tr1, Pool mit into_clause/clause_ok)
R = 'tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies'
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data', 'npc', 'tratsch', 'tratsch-data.r1.json')

def git(*a): return subprocess.run(['git', '-C', REPO, *a], capture_output=True, check=True).stdout
def blob(path): return git('rev-parse', f'{COMMIT}:{path}').decode().strip()
def show(path): return git('show', f'{COMMIT}:{path}').decode('utf-8')
def pinned(path, **extra): return {'path': path, 'blob': blob(path), **extra}

ip = f'{R}/SSOT_SPOKEN_LINES/TR1_INDEX.json'; I = json.loads(show(ip))
trip, blocked = {}, {}
for d in I['decks']:
    lp = f"{R}/{d['lines']}"
    rows = list(csv.DictReader(io.StringIO(show(lp))))
    trip[d['deckId']] = pinned(lp, cards={str(int(r['card_number'])): r['triplet'] for r in rows if r.get('triplet')})
    if d.get('blocked'):
        bp = f"{R}/{d['blocked']}"; B = json.loads(show(bp))
        blocked[d['deckId']] = pinned(bp, cards={str(x['cardNumber']): x['reason'] for x in B['blocked']})
files = git('ls-tree', '-r', '--name-only', COMMIT, f'{R}/SSOT_SPOKEN_LINES').decode().splitlines()
rp = next(f for f in (f'{R}/SSOT_SPOKEN_LINES/checks.json', f'{R}/SSOT_SPOKEN_LINES/rules.json') if f in files); rules = json.loads(show(rp))  # rules.json heißt seit a428e091 checks.json
op = f'{R}/SONGS_WORKSHOP_R1/OPENER_POOL_BY_STANCE_R1.json'; O = json.loads(show(op))
sp = f'{R}/SONGS_WORKSHOP_R1/signature/SIGNATURE_DECKS_R1.json'; S = json.loads(show(sp))
out = {
    'schema': 'kfb.tratsch-data/1', 'note': 'Stufe 0 (headless). Triplets tr1 = ENTWURF bis Georgs Abnahme; im Spiel nur hinter Vorschalter (Georg 23.10.).',
    'source': {'repo': 'georg-doc/kayfabizarro', 'branch': 'ws-song/workshop-r1', 'commit': COMMIT, 'revision': 'tr1', 'index': pinned(ip, status=I.get('status'))},
    'triplets': trip, 'blocked': blocked, 'print': {},
    'rules': pinned(rp, revision=rules.get('revision'), rules=[{'id': r['id'], 'rule': r['rule'], 'level': r['level']} for r in (rules.get('checks') or rules.get('rules') or [])]),
    'openers': pinned(op, rules=O['rules'], openers=O['openers']),
    'signature': pinned(sp, status=S['status'], confirmedBy=S['confirmedBy'], figures=[{'figure': x['figure'], 'models': x['models'], 'deck': x['deck'], 'basis': x['basis']} for x in S['signature']]),
}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'w', encoding='utf-8') as fh: json.dump(out, fh, ensure_ascii=False, indent=1); fh.write('\n')
print(f"tr1: {len(trip)} Decks ({sum(len(v['cards']) for v in trip.values())} Zeilen), gesperrt {sum(len(v['cards']) for v in blocked.values())} Karten in {len(blocked)} Decks, "
      f"Opener {len(O['openers'])} (POOL {sum(1 for x in O['openers'] if x['status'] == 'POOL')}), {len(S['signature'])} Signatur-Figuren → {os.path.relpath(OUT)}")
