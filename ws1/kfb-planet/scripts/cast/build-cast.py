# Zweite Besetzung (F-4): je Kandidat Profil-Auszug aus Georgs Batch (eye-rig-medium.batch-1.json @ac9dbaed), Rezept und GLB-Kopie
# (Revision und Blob aus dem Profil, unverändert). Kein eigener Wert: Profil = Batch-Eintrag (AUTO_CANDIDATE: Klassen-Standard von Georg
# + automatisch gemessener Anker je Figur). python3 scripts/cast/build-cast.py
import json, subprocess, os, hashlib
REPO = os.path.expanduser('~/kfb-ws1/kayfabizarro')
BATCH_COMMIT = 'ac9dbaed2e5966a537a4bb719e8cd847dcc5e099'
BATCH = 'tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/data/eye-rig/eye-rig-medium.batch-1.json'
CAST = {'adventurer-mage': 'Mage', 'adventurer-barbarian': 'Barbarian', 'gothgirl': 'GothGirl', 'farmer-b': 'Farmer_B',  # farmer-b: WS-NPC Phase A (V-585, Farmer B = KayKit S6 Farmers Textur B)
        'skeleton-warrior': 'Skeleton_Warrior', 'skeleton-rogue': 'Skeleton_Rogue', 'skeleton-mage': 'Skeleton_Mage', 'skeleton-minion': 'Skeleton_Minion', 'toy-soldier': 'ToySoldier',
        'lorekeeper': 'Lorekeeper'}  # lorekeeper: WS-NPC (WS0 V-595: Original aus main mit Georgs Profil als Übergang; k11b privat ersetzt den Körper, wenn da)  # WS-NPC Phase D (Georg 21.10. Go): Skelett-Patrouille, Spielzeugsoldaten
git = lambda *a: subprocess.run(['git', '-C', REPO, *a], capture_output=True, check=True).stdout
batch = json.loads(git('show', f'{BATCH_COMMIT}:{BATCH}')); P = {p['actorId']: p for p in batch['profiles']}
os.makedirs('src/data/eyes/cast', exist_ok=True); os.makedirs('src/data/actors/cast', exist_ok=True); os.makedirs('src/assets/actors/cast', exist_ok=True)
out = []
ONLY = os.environ.get('CAST_ONLY')
for aid, name in CAST.items():
    if ONLY and aid not in ONLY.split(','): continue
    p = P[aid]; src = p['source']; rev, path = src['revision'], src['path']
    data = git('show', f'{rev}:{path}'); blob = git('rev-parse', f'{rev}:{path}').decode().strip()
    open(f'src/assets/actors/cast/{name}.glb', 'wb').write(data)
    json.dump({'schema': 'kfb.ws1.eye-profile-pick/1', 'source': {'repo': 'georg-doc/kayfabizarro', 'path': BATCH, 'commit': BATCH_COMMIT, 'note': 'Georg-Export 19.09., Profil unverändert'},
               'profile': p, 'classDefault': batch['classDefault'], 'inheritanceOrder': batch['inheritanceOrder']},
              open(f'src/data/eyes/cast/{aid}.profile.json', 'w'), ensure_ascii=False, indent=1)
    rec = {'schema': 'kfb.actor-recipe/0.2-candidate', 'primaryFormat': 'kfb.pets/1',
           'source': {'selectedId': aid, 'rigFamily': 'Rig_Medium', 'label': f'{name} (Kandidat zweite Besetzung, F-4)'},
           'composition': {'modelRef': {'path': path, 'revision': rev, 'blob': blob[:8]},
                           'faceOwners': {'face': 'lib/kaykit-eye-adapter.v1.js', 'eye': 'pet-eye-rig.v6', 'mouth': 'keiner (KayKit ohne Sprechmund; Mund ist eine spätere Frage, F-4)'}},
           'profile': f'src/data/eyes/cast/{aid}.profile.json ({p["status"]}, Batch @{BATCH_COMMIT[:8]})'}
    json.dump(rec, open(f'src/data/actors/cast/{aid}.recipe.json', 'w'), ensure_ascii=False, indent=1)
    out.append((aid, name, p['status'], p['sourceFace'].get('pairConfidence'), rev[:8], blob[:8], len(data)))
for r in out: print(*r)
