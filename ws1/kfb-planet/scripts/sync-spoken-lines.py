# Gesprochene Kartenzeilen (TRIPLET_SSOT_R1 V-698–700, Daten aus dem Modul der Deck-Songs-Sitzung) → src/data/spoken/ssot-lines.r1.json
# Liest aus kayfabizarro ws-song/workshop-r1 am angegebenen Commit: Opener-Pool (nur Status POOL), Sperrlisten (*.tr1.blocked.json).
# Aufruf: python3 scripts/sync-spoken-lines.py <commit>   (Repo ~/kfb-ws1/kayfabizarro, vorher git fetch)
import json, os, subprocess, sys
commit = sys.argv[1]; repo = os.path.expanduser('~/kfb-ws1/kayfabizarro')
R = 'tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies'
show = lambda p: subprocess.check_output(['git', '-C', repo, 'show', f'{commit}:{p}'])
ls = subprocess.check_output(['git', '-C', repo, 'ls-tree', '-r', '--name-only', commit, R + '/SONGS_WORKSHOP_R1']).decode().split('\n')
pool = json.loads(show(R + '/SONGS_WORKSHOP_R1/OPENER_POOL_BY_STANCE_R1.json'))['openers']
FIT = ('I once met', 'My neighbour is', 'Ever tasted', 'I found a', 'You played')   # Kartenpassung braucht die Kartenart – im Rückfall nicht verwendet
A_STANCES = {'Gerücht', 'Frage', 'Begegnung', 'Theorie', 'Beobachtung', 'Behauptung'}
openers = [{'id': f"op{i}", 'text': o['opener'], 'stance': o['stance'], 'q': o['class'] == 'Q', 'family': o.get('family')}
           for i, o in enumerate(pool) if o['status'] == 'POOL' and o['slot'] == 'into_title' and o['stance'] in A_STANCES and not o['opener'].startswith(FIT)]
retorts = [{'id': f"re{i}", 'text': o['opener']} for i, o in enumerate(pool) if o['status'] == 'POOL' and o['stance'] == 'Erwiderung']
blocked = {}
for p in ls:
    if p.endswith('.tr1.blocked.json'):
        b = json.loads(show(p)); blocked[b['deckId']] = sorted(x['cardNumber'] for x in b['blocked'])
out = {'schema': 'kfb.spoken-lines/1', 'source': f'georg-doc/kayfabizarro ws-song/workshop-r1 @{commit} (TRIPLET_SSOT_R1, V-698–700)', 'openersA': openers, 'retortsB': retorts, 'blocked': blocked}
json.dump(out, open('src/data/spoken/ssot-lines.r1.json', 'w'), ensure_ascii=False, indent=1)
print(len(openers), 'Opener A,', len(retorts), 'Erwiderungen,', sum(len(v) for v in blocked.values()), 'gesperrte Karten in', len(blocked), 'Decks')
