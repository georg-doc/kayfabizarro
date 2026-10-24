# Gesprochene Kartenzeilen (TRIPLET_SSOT_R1 V-698–700, Daten aus dem Modul der Deck-Songs-Sitzung) → src/data/spoken/ssot-lines.r1.json
# Liest aus kayfabizarro ws-song/workshop-r1 am angegebenen Commit: Opener-Pool (nur Status POOL), Sperrlisten (*.tr1.blocked.json).
# Aufruf: python3 scripts/sync-spoken-lines.py <commit>   (Repo ~/kfb-ws1/kayfabizarro, vorher git fetch)
import json, os, subprocess, sys
commit = sys.argv[1]; repo = os.path.expanduser('~/kfb-ws1/kayfabizarro')
R = 'tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies'
show = lambda p: subprocess.check_output(['git', '-C', repo, 'show', f'{commit}:{p}'])
ls = subprocess.check_output(['git', '-C', repo, 'ls-tree', '-r', '--name-only', commit, R + '/SONGS_WORKSHOP_R1']).decode().split('\n')
pool = json.loads(show(R + '/SONGS_WORKSHOP_R1/OPENER_POOL_BY_STANCE_R1.json'))['openers']
FIT = ('I once met', 'My neighbour is', 'Ever tasted', 'I found a', 'You played', 'What if', 'I used to believe')   # Kartenpassung bzw. braucht einen ganzen Satz (vor dem Titel allein nicht verwendbar)   # Kartenpassung braucht die Kartenart – im Rückfall nicht verwendet
A_STANCES = {'Gerücht', 'Frage', 'Begegnung', 'Theorie', 'Beobachtung', 'Behauptung'}
openers = [{'id': f"op{i}", 'text': o['opener'], 'stance': o['stance'], 'q': o.get('ending', '?' if o['class'] == 'Q' else '.') == '?', 'family': o.get('family')}
           for i, o in enumerate(pool) if o['status'] == 'POOL' and o['slot'] == 'into_title' and o['stance'] in A_STANCES and not o['opener'].startswith(FIT)]
retorts = [{'id': f"re{i}", 'text': o['opener']} for i, o in enumerate(pool) if o['status'] == 'POOL' and o['stance'] == 'Erwiderung']
STRIKE = ('You with the card in your hand', 'You played', 'Welcome to', 'Ever tasted', 'This one has a rule', 'The deck insists on', 'Here is something nobody asked for', 'Before we continue')   # Georg 24.10. bzw. Audit Deck-Songs §31 (Streichung bei WS0 in Arbeit)
openersT = [{'id': f"ot{i}", 'text': o['opener'], 'stance': o['stance'], 'q': o.get('ending', '?' if o['class'] == 'Q' else '.') == '?', 'slot': o['slot'], 'family': o.get('family')}
            for i, o in enumerate(pool) if o['status'] == 'POOL' and not o['opener'].startswith(STRIKE) and (o['slot'] == 'own_clause' or o.get('clause_ok'))]   # vor ganzen tr1-Sätzen nur Satz-Opener (SSOT S8)
import csv, io
idx = json.loads(show(R + '/SSOT_SPOKEN_LINES/TR1_INDEX.json'))
tr1 = {}
for d in idx['decks']:
    rows = csv.DictReader(io.StringIO(show(R + '/' + d['lines']).decode()))
    tr1[d['deckId']] = {str(int(r['card_number'])): r['triplet'].strip() for r in rows if (r.get('triplet') or '').strip()}
blocked = {}
for p in ls:
    if p.endswith('.tr1.blocked.json'):
        b = json.loads(show(p)); blocked[b['deckId']] = sorted(x['cardNumber'] for x in b['blocked'])
out = {'schema': 'kfb.spoken-lines/1', 'source': f'georg-doc/kayfabizarro ws-song/workshop-r1 @{commit} (TRIPLET_SSOT_R1, V-698–700)', 'openersA': openers, 'openersT': openersT, 'retortsB': retorts, 'blocked': blocked, 'tr1Status': idx['status'], 'tr1': tr1}
json.dump(out, open('src/data/spoken/ssot-lines.r1.json', 'w'), ensure_ascii=False, indent=1)
print(len(openers), 'Opener A,', len(openersT), 'Satz-Opener,', len(tr1), 'tr1-Decks,', len(retorts), 'Erwiderungen,', sum(len(v) for v in blocked.values()), 'gesperrte Karten in', len(blocked), 'Decks')
