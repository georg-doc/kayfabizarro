# Disco K12 (Lead): Augenprofile der Tänzer aus Georgs Batch (eye-rig-medium.batch-1.json @ac9dbaed), unverändert wie scripts/cast/build-cast.py,
# aber ohne GLB-Kopie (die Körper sind privat: K12 KFB_Disco_*.src.glb). Ritter und Dämon haben kein Batch-Profil (Augen-Sitz aus den Ankern, PROOF).
# python3 scripts/disco/build-disco-profiles.py
import json, subprocess, os
REPO = os.path.expanduser('~/kfb-ws1/kayfabizarro')
BATCH_COMMIT = 'ac9dbaed2e5966a537a4bb719e8cd847dcc5e099'
BATCH = 'tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/data/eye-rig/eye-rig-medium.batch-1.json'
IDS = ['witch', 'avian', 'protagonist-a']   # skeleton-minion, toy-soldier liegen schon in src/data/eyes/cast
batch = json.loads(subprocess.run(['git', '-C', REPO, 'show', f'{BATCH_COMMIT}:{BATCH}'], capture_output=True, check=True).stdout); P = {p['actorId']: p for p in batch['profiles']}
os.makedirs('src/data/eyes/disco', exist_ok=True)
for aid in IDS:
    json.dump({'schema': 'kfb.ws1.eye-profile-pick/1', 'source': {'repo': 'georg-doc/kayfabizarro', 'path': BATCH, 'commit': BATCH_COMMIT, 'note': 'Georg-Export 19.09., Profil unverändert'},
               'profile': P[aid], 'classDefault': batch['classDefault'], 'inheritanceOrder': batch['inheritanceOrder']}, open(f'src/data/eyes/disco/{aid}.profile.json', 'w'), ensure_ascii=False, indent=1)
    print('ok', aid, P[aid]['status'])

# Herkunft der privaten Körper für den Darsteller-Vertrag (MODEL_RIG_SOURCE_REQUIRED): nur Commit und Blob-Hashes, nichts Privates (Muster kayfabrick-bot.sources.json)
PRIV = os.path.expanduser('~/kfb-ws1/private-assets'); D = '50_BLENDER/B50/disco/_privat_kauf_asset'
commit = subprocess.run(['git', '-C', PRIV, 'rev-parse', 'HEAD'], capture_output=True, check=True, text=True).stdout.strip()
blobs = {f: subprocess.run(['git', '-C', PRIV, 'rev-parse', f'HEAD:{D}/{f}'], capture_output=True, check=True, text=True).stdout.strip() for f in sorted(os.listdir(os.path.join(PRIV, D))) if f.startswith('KFB_Disco_') and f.endswith('.src.glb')}
json.dump({'schema': 'kfb.private-sources/1', 'repo': 'georg-doc/KFB-Stunt-Car-Race', 'branch': 'assets/private', 'commit': commit, 'dir': 'KFB_HUB/' + D, 'blobs': blobs}, open('src/data/actors/cast/disco-k12.sources.json', 'w'), ensure_ascii=False, indent=1)
print('sources', commit[:8], len(blobs))
