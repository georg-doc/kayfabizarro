import json, sys, hashlib, copy
sys.path.insert(0, '/tmp/ml7'); from notes import N; from plan import SKIP
c = json.load(open('/tmp/loco/out/KFB_Motion_Library.catalog.json'))  # v6 + LOCOMOTION_LADDER_01 sets
I = json.load(open('/tmp/ml7/ids.json')); L = json.load(open('/tmp/ml7/ml7_log.json')); P = json.load(open('/tmp/ml7/post7.json'))['post']; files = json.load(open('/tmp/ml7/files.json'))
lib_of = {i: f for f, l in files.items() for i in l}
new = []
for x in I:
    r = L[x['id']]; m = r['rigs']; nn = N[x['id']]; loopd = P[x['id']]['Rig_Medium']['loopPoseDiffDeg']
    trav = max(m['Rig_Medium']['travelXY'], m['Rig_Medium']['rootXY']) >= 0.05
    e = {'id': x['id'], 'label_de': x['label_de'], 'group': x['group'], 'rigs': ['Rig_Medium', 'Rig_Large'], 'frames': m['Rig_Medium']['frames'],
         'durationSec': m['Rig_Medium']['durationSec'], 'fps': r['fps'], 'loop': loopd < 15, 'loopPoseDiffDeg': loopd,
         'rootMotion': 'travel' if trav else 'in-place', 'rootBone': 'root',
         'travelMetersPerCycle': {k: round(max(v['travelXY'], v['rootXY']), 3) if trav else 0.0 for k, v in m.items()},
         'contacts': {k: {'feet': v['contacts']} for k, v in m.items()}, 'bestVariant': None,
         'sourceFbx': x['file'] + '.fbx', 'sourcePack': None,
         'facingYawDeg': P[x['id']]['Rig_Medium']['facingYawDeg'],
         'library': {k: f'libs/{k}/{lib_of[x["id"]]}' for k in ('Rig_Medium', 'Rig_Large')}, 'intake': '07'}
    if nn.get('v'): e['variantOf'] = nn['v']
    e['tags'] = nn['t']; e['comment'] = nn['c']; e['residentIdeas'] = nn['r']; e['notes'] = nn.get('n', '')
    new.append(e)
c2 = copy.deepcopy(c)
c2['clips'] = c['clips'] + new
c2['clipCount'] = len(c2['clips']); c2['version'] = '2026-10-03'
assert len(set(x['id'] for x in c2['clips'])) == c2['clipCount']
for f in files:
    for rig in ('Rig_Medium', 'Rig_Large'):
        b = open(f'/tmp/ml7/out/libs/{rig}/{f}', 'rb').read()
        c2['libraries'][f'libs/{rig}/{f}'] = {'rig': rig, 'group': f.split('_')[2], 'bytes': len(b), 'sha256': hashlib.sha256(b).hexdigest(), 'clipCount': len(files[f])}
c2['intakes']['07'] = (f'{len(new)} locomotion clips (2026-10-03) for the gait ladder: jogs, slow/medium/fast runs, sprint and sprint start, walk start/stop, '
    'backward jog and run, a clean right strafe run, running turns and two jumps; supplement libraries *_i07.glb; all earlier files unchanged. '
    f'{len(SKIP)} files are (near) duplicates and were not baked: ' + ', '.join(f'{k}.fbx = {v[0]} ({v[1]} deg)' for k, v in SKIP.items()))
FW = json.load(open('/tmp/ml7/fwd7.json')) if len(sys.argv) > 1 else {}
for e in c2['clips']:
    if e['id'] in FW:
        e['forwardYawDeg'] = FW[e['id']]['forwardYawDeg']; e['forwardYawMethod'] = FW[e['id']]['method']
        if FW[e['id']].get('travelYawDeg') is not None: e['travelYawDeg'] = FW[e['id']]['travelYawDeg']; e['travelYawMethod'] = FW[e['id']]['travelMethod']
json.dump(c2, open('/tmp/ml7/out/KFB_Motion_Library.catalog.json', 'w'), indent=1, ensure_ascii=False)
print(c2['clipCount'], len(new), sum(1 for e in new if e['loop']), sum(1 for e in c2['clips'] if 'forwardYawDeg' in e))
