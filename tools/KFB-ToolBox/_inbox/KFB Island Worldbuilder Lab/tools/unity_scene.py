#!/usr/bin/env python3
"""StreakByte demo scenes (Unity YAML) → one JSON per scene for the lab viewer (/demo-scenes.html).
Resolves scene GameObjects/Transforms, PrefabInstances with m_Modifications, prefab hierarchies, MeshFilters →
mesh GUID → FBX path (guid index from the .unitypackage in ~/KFB-AssetCache/unity/StreakByte_LPFI).
World matrices are converted from Unity (left-handed) to three.js (right-handed) by mirroring x: M·T·M, M = diag(−1,1,1,1).
Unity EULA: output stays local (public/assets/streakbyte/scenes/), never in a public repo.
Usage: python3 tools/unity_scene.py"""
import os, re, json, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TREE = os.path.join(ROOT, 'donors/streakbyte-floating-islands/tree')
CACHE = os.path.expanduser('~/KFB-AssetCache/unity/StreakByte_LPFI')
OUT = os.path.join(ROOT, 'public/assets/streakbyte/scenes')
GUIDS = json.load(open(os.path.join(CACHE, 'guids.json')))

HDR = re.compile(r'^--- !u!(\d+) &(-?\d+)( stripped)?')
FLOW = re.compile(r'(\w+):\s*(-?[\w.+-]+)')

MODELS = os.path.join(ROOT, 'public/assets/streakbyte/Models')
_USF = {}
def unit(rel):
    """metres per FBX unit as Unity imports it: UnitScaleFactor / 100 (cm exports = 0.01, m exports = 1)"""
    if rel not in _USF:
        import struct
        try:
            b = open(os.path.join(MODELS, rel), 'rb').read()
            i = b.find(b'UnitScaleFactor'); j = b.find(b'Number', i, i + 80); k = b.find(b'D', j + 6, j + 40)
            _USF[rel] = struct.unpack('<d', b[k + 1:k + 9])[0] / 100 if i >= 0 and k > 0 else 1
        except OSError:
            _USF[rel] = 1
    return _USF[rel]

def flow(s):
    return {k: v for k, v in FLOW.findall(s)}

def parse(path):
    """minimal Unity YAML: {fileID: {'cls': int, 'stripped': bool, 'type': str, 'lines': [...]}}"""
    docs, cur = {}, None
    for line in open(path, encoding='utf-8', errors='ignore'):
        m = HDR.match(line)
        if m:
            cur = {'cls': int(m.group(1)), 'stripped': bool(m.group(3)), 'lines': []}
            docs[m.group(2)] = cur
            continue
        if cur is not None:
            cur['lines'].append(line.rstrip('\n'))
    for d in docs.values():
        L = d['lines']
        d['type'] = L[0].rstrip(':') if L else ''
        d['kv'] = {}
        for ln in L[1:]:
            mm = re.match(r'^  (\w+):\s*(.*)$', ln)
            if mm: d['kv'][mm.group(1)] = mm.group(2)
    return docs

def lst(doc, key):
    """list items under `  key:` (lines starting with '  - ')"""
    out, on = [], False
    for ln in doc['lines']:
        if re.match(rf'^  {key}:', ln): on = True; continue
        if on:
            if ln.startswith('  - '): out.append(ln[4:])
            elif ln.startswith('    '): out[-1] += ' ' + ln.strip() if out else None
            else: break
    return out

def trs(doc):
    kv = doc['kv']
    r = flow(kv.get('m_LocalRotation', '{x:0,y:0,z:0,w:1}'))
    p = flow(kv.get('m_LocalPosition', '{x:0,y:0,z:0}'))
    s = flow(kv.get('m_LocalScale', '{x:1,y:1,z:1}'))
    return {'p': [float(p.get(a, 0)) for a in 'xyz'], 'q': [float(r.get(a, 0 if a != 'w' else 1)) for a in 'xyzw'], 's': [float(s.get(a, 1)) for a in 'xyz']}

def mat(t):
    x, y, z, w = t['q']; sx, sy, sz = t['s']; px, py, pz = t['p']
    r = [[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
         [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
         [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]]
    return [[r[0][0] * sx, r[0][1] * sy, r[0][2] * sz, px], [r[1][0] * sx, r[1][1] * sy, r[1][2] * sz, py], [r[2][0] * sx, r[2][1] * sy, r[2][2] * sz, pz], [0, 0, 0, 1]]

def mul(a, b):
    return [[sum(a[i][k] * b[k][j] for k in range(4)) for j in range(4)] for i in range(4)]

MIR = [[-1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]

PREFAB = {}
def prefab(guid):
    if guid not in PREFAB:
        PREFAB[guid] = parse(os.path.join(TREE, GUIDS[guid]))
    return PREFAB[guid]

def apply_mods(t, mods, target):
    """mods: {(targetFileID): {propertyPath: value}}; returns modified TRS + extra props"""
    m = mods.get(target, {})
    for key, axes in (('m_LocalPosition', 'xyz'), ('m_LocalRotation', 'xyzw'), ('m_LocalScale', 'xyz')):
        idx = {'m_LocalPosition': 'p', 'm_LocalRotation': 'q', 'm_LocalScale': 's'}[key]
        for i, a in enumerate(axes):
            v = m.get(f'{key}.{a}')
            if v is not None: t[idx][i] = float(v)
    return t

def scene(path):
    S = parse(path)
    items = []
    # transform id → (local matrix, father id) within the scene; prefab instance roots get registered as well
    T = {}
    for fid, d in S.items():
        if d['cls'] in (4, 224) and not d['stripped']:
            T[fid] = {'m': mat(trs(d)), 'father': flow(d['kv'].get('m_Father', '{fileID: 0}'))['fileID'], 'go': flow(d['kv'].get('m_GameObject', '{fileID: 0}'))['fileID']}
    # stripped transforms: prefab instance roots referenced as children / parents
    stripped = {fid: d for fid, d in S.items() if d['stripped'] and d['cls'] in (4, 224)}
    def world_scene(fid):
        M = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
        guard = 0
        while fid and fid != '0' and guard < 64:
            guard += 1
            if fid in T:
                M = mul(T[fid]['m'], M); fid = T[fid]['father']
            elif fid in stripped:
                pi = flow(stripped[fid]['kv'].get('m_PrefabInstance', '{fileID: 0}'))['fileID']
                inst = INST.get(pi)
                if not inst: break
                M = mul(inst['rootM'], M); fid = inst['parent']
            else: break
        return M
    active = lambda go: S.get(go, {}).get('kv', {}).get('m_IsActive', '1').strip() != '0'
    # prefab instances
    INST = {}
    for fid, d in S.items():
        if d['cls'] != 1001: continue
        src = flow(d['kv'].get('m_SourcePrefab', ''))
        g = src.get('guid')
        if not g or g not in GUIDS: continue
        mods = {}
        cur = None
        for ln in d['lines']:
            mt = re.match(r'^\s+- target: (\{.*\})', ln)
            if mt: cur = flow(mt.group(1))['fileID']; continue
            mp = re.match(r'^\s+propertyPath: (.*)$', ln)
            if mp: pp = mp.group(1).strip(); continue
            mv = re.match(r'^\s+value: (.*)$', ln)
            if mv and cur is not None: mods.setdefault(cur, {})[pp] = mv.group(1).strip()
        parent = '0'
        for ln in d['lines']:
            mpar = re.match(r'^\s+m_TransformParent: (\{.*\})', ln)
            if mpar: parent = flow(mpar.group(1))['fileID']
        if GUIDS[g].lower().endswith('.fbx'):
            # model prefab: the FBX itself is the source; its root transform is the target that carries the TRS mods
            tgt = max(mods, key=lambda t: sum(1 for k in mods[t] if k.startswith(('m_LocalPosition', 'm_LocalRotation', 'm_LocalScale')))) if mods else None
            t0 = {'p': [0, 0, 0], 'q': [0, 0, 0, 1], 's': [1, 1, 1]}
            if tgt is not None: apply_mods(t0, mods, tgt)
            name = next((v['m_Name'] for v in mods.values() if 'm_Name' in v), os.path.basename(GUIDS[g]))
            INST[fid] = {'guid': g, 'model': True, 'rootM': mat(t0), 'parent': parent, 'name': name}
            continue
        P = prefab(g)
        PT = {pf: pd for pf, pd in P.items() if pd['cls'] in (4, 224)}
        root = next((pf for pf, pd in PT.items() if flow(pd['kv'].get('m_Father', '{fileID: 0}'))['fileID'] == '0'), None)
        if root is None: continue
        rootT = apply_mods(trs(PT[root]), mods, root)
        INST[fid] = {'guid': g, 'P': P, 'PT': PT, 'root': root, 'rootM': mat(rootT), 'parent': parent, 'mods': mods}
    for fid, inst in INST.items():
        if inst.get('model'):
            items.append({'fbx': GUIDS[inst['guid']], 'mesh': None, 'go': inst['name'], 'name': inst['name'], 'M': mul(world_scene(inst['parent']), inst['rootM'])})
            continue
        P, PT, mods = inst['P'], inst['PT'], inst['mods']
        base = mul(world_scene(inst['parent']), inst['rootM'])
        def world_prefab(tf):
            if tf == inst['root']: return base
            d = PT[tf]
            father = flow(d['kv'].get('m_Father', '{fileID: 0}'))['fileID']
            return mul(world_prefab(father), mat(apply_mods(trs(d), mods, tf)))
        gos = {pf: pd for pf, pd in P.items() if pd['cls'] == 1}
        for pf, pd in P.items():
            if pd['cls'] != 33: continue
            go = flow(pd['kv'].get('m_GameObject', '{fileID: 0}'))['fileID']
            if mods.get(go, {}).get('m_IsActive', gos.get(go, {}).get('kv', {}).get('m_IsActive', '1')).strip() == '0': continue
            mesh = flow(pd['kv'].get('m_Mesh', ''))
            mg = mesh.get('guid')
            if not mg or mg not in GUIDS: continue
            tf = next((t for t, td in PT.items() if flow(td['kv'].get('m_GameObject', '{fileID: 0}'))['fileID'] == go), None)
            if tf is None: continue
            name = mods.get(go, {}).get('m_Name') or gos.get(go, {}).get('kv', {}).get('m_Name', '')
            items.append({'fbx': GUIDS[mg], 'mesh': mesh.get('fileID'), 'go': gos.get(go, {}).get('kv', {}).get('m_Name', ''), 'name': name, 'M': world_prefab(tf)})
    # plain scene objects with a MeshFilter
    for fid, d in S.items():
        if d['cls'] != 33 or d['stripped']: continue
        go = flow(d['kv'].get('m_GameObject', '{fileID: 0}'))['fileID']
        if not active(go): continue
        mesh = flow(d['kv'].get('m_Mesh', ''))
        mg = mesh.get('guid')
        if not mg or mg not in GUIDS: continue
        tf = next((t for t, td in T.items() if td['go'] == go), None)
        if tf is None: continue
        name = S[go]['kv'].get('m_Name', '') if go in S else ''
        items.append({'fbx': GUIDS[mg], 'mesh': mesh.get('fileID'), 'go': name, 'name': name, 'M': world_scene(tf)})
    # cameras: the demo scene's own view (for the reference comparison)
    cams = []
    for fid, d in S.items():
        if d['cls'] != 20: continue
        go = flow(d['kv'].get('m_GameObject', '{fileID: 0}'))['fileID']
        tf = next((t for t, td in T.items() if td['go'] == go), None)
        if tf is None: continue
        fov = float(re.search(r'field of view: ([\d.]+)', '\n'.join(d['lines'])).group(1)) if re.search(r'field of view', '\n'.join(d['lines'])) else 60
        cams.append({'M': mul(mul(MIR, world_scene(tf)), MIR), 'fov': fov})
    out = []
    for it in items:
        M = mul(mul(MIR, it['M']), MIR)
        flat = [M[r][c] for c in range(4) for r in range(4)]  # column-major for THREE.Matrix4.fromArray
        rel = it['fbx'].replace('Assets/Low Poly Floating Islands/Models/', '')
        out.append({'fbx': rel, 'u': round(unit(rel), 5), 'mesh': it['mesh'], 'go': it['go'], 'name': it['name'], 'm': [round(v, 5) for v in flat]})
    cams = [{'m': [round(c['M'][r][k], 5) for k in range(4) for r in range(4)], 'fov': c['fov']} for c in cams]
    return out, cams

os.makedirs(OUT, exist_ok=True)
sd = os.path.join(TREE, 'Assets/Low Poly Floating Islands/Scenes')
index = []
for f in sorted(os.listdir(sd)):
    if not f.endswith('.unity'): continue
    items, cams = scene(os.path.join(sd, f))
    name = f[:-6]
    json.dump({'scene': name, 'items': items, 'cameras': cams}, open(os.path.join(OUT, name + '.json'), 'w'))
    multi = {}
    for it in items: multi.setdefault(it['fbx'], set()).add(it['mesh'])
    index.append({'scene': name, 'items': len(items), 'fbx': len(multi), 'multiMesh': [k for k, v in multi.items() if len(v) > 1], 'cameras': len(cams)})
    print(name, len(items), 'items,', len(multi), 'fbx,', len(cams), 'cams, multi-mesh:', [k for k, v in multi.items() if len(v) > 1][:4])
json.dump(index, open(os.path.join(OUT, 'index.json'), 'w'), indent=1)
