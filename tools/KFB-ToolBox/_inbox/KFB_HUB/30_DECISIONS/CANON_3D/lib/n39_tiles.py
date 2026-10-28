# Kopie (WS0 28.10., für WSA V-920) von 50_BLENDER/N39/scripts/n39_tiles.py – unverändert; maßgeblich ist measure(). Pfade unten beziehen sich auf die Dropbox-Ablage (HUB/50_BLENDER), für neue Packs nur die Pack-Liste/Pfade anpassen, measure() und Einheiten (kfb_place.r1.json) unverändert lassen.
# WSB N39 (a) · Kacheln für kfb-place messen (Nachtrag 36, Freigabe über WS0, Georg q201): KayKit Forest (84), Steinkit v4 (82), B29-Mauer-Kit r4 (28), KayKit path_A–D.
#   Gemessen in Blender headless an den Original-Dateien (Kit-Teile unverändert, V-574): Höhe, Hüllradius (größter waagerechter Abstand von der Fußmitte),
#   Ruhelage. Einsinken [lo, hi] aus rules.sink der Regeldatei (Kappe sink_cap), Anker für Fluff aus B2 (kaykit-tree-fluff-anchors.v1), Sockets B29 aus wall_kit.r4 (abgeleitet).
# Usage: Blender -b --factory-startup --python n39_tiles.py -- <out.json>
import bpy, sys, os, json, math, re
from mathutils import Vector
OUT = sys.argv[sys.argv.index('--') + 1:][0]
HUB = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..')); B50 = os.path.join(HUB, '50_BLENDER')
CFG = json.load(open(os.path.join(HUB, '30_DECISIONS', 'CANON_3D', 'lib', 'kfb_place.r1.json'))); SINK, CAP = CFG['rules']['sink'], CFG['rules']['sink_cap']
MU, MH = CFG['units']['m_per_kaykit_u'], CFG['units']['m_per_H']
KF = os.path.expanduser('~/Library/CloudStorage/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf')
KF_MAIN = 'media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf'   # Repo-Pfad auf main (Blob-Hashes = lokale Kopie, geprüft an Tree_1_A)
ANCH = json.load(open(os.path.join(B50, 'B2', 'kaykit-tree-fluff-anchors.v1.json')))['models']
STONE = json.load(open(os.path.join(B50, 'STEINKIT', 'data', 'kfb_stone_kit.v4.json'))); WALL = json.load(open(os.path.join(B50, 'B29', 'data', 'wall_kit.r4.json')))
def sink(kind):
    lo, hi = SINK.get(kind, [0.0, 0.05]); return [lo, min(hi, CAP) if kind.startswith(('stone', 'rock')) else hi]
def measure(objs):
    bpy.context.view_layer.update(); P = [o.matrix_world @ v.co for o in objs if o.type == 'MESH' for v in o.data.vertices]
    if not P: return None
    z0, z1 = min(p.z for p in P), max(p.z for p in P); cx, cy = (min(p.x for p in P) + max(p.x for p in P)) / 2, (min(p.y for p in P) + max(p.y for p in P)) / 2
    foot = [p for p in P if p.z < z0 + 0.05 * (z1 - z0)] or P; fx, fy = sum(p.x for p in foot) / len(foot), sum(p.y for p in foot) / len(foot)
    ext = max(max(p.x for p in P) - min(p.x for p in P), max(p.y for p in P) - min(p.y for p in P))
    return {'h': z1 - z0, 'ext': ext, 'hull_r': max(math.hypot(p.x - fx, p.y - fy) for p in P), 'z0': z0, 'foot_off': math.hypot(fx - cx, fy - cy), 'tris': sum(len(o.data.polygons) for o in objs if o.type == 'MESH')}
def imp(path):
    bpy.ops.wm.read_factory_settings(use_empty=True); before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=path); return [o for o in bpy.data.objects if o not in before]
tiles, notes = [], []
# ---- KayKit Forest (84)
for f in sorted(x for x in os.listdir(KF) if x.endswith('.gltf')):
    name = f[:-5].replace('_Color1', ''); m = measure(imp(os.path.join(KF, f)));
    if m is None: notes.append(f'{name}: kein Mesh'); continue
    h_m, r_m = m['h'] * MU, m['hull_r'] * MU
    if name.startswith('Tree_Bare'): kind, role, fam = 'tree', 'anchor', 'moss_root'
    elif name.startswith('Tree'): kind, role, fam = 'tree', 'anchor', 'moss_root'
    elif name.startswith('Bush'): kind, role, fam = 'bush', 'support', 'moss_grass'
    elif name.startswith('Grass'): kind, role, fam = 'grass', 'pebble', None
    else:   # Rock_*: nach Steinkit-Größenklassen in m (größte waagerechte Ausdehnung)
        ext = 2 * r_m; kind = 'stone_L' if ext >= 0.5 else 'stone_M' if ext >= 0.25 else 'stone_S'; role = {'stone_L': 'anchor', 'stone_M': 'support', 'stone_S': 'pebble'}[kind]; fam = 'pebble_moss'
        if ext > 0.9: kind, role = 'rock', 'accent'
    sc = 'L' if kind in ('tree', 'rock', 'stone_L') else 'M' if kind in ('bush', 'stone_M') else 'S'
    anchors = []
    if kind == 'tree' and not name.startswith('Tree_Bare'):
        for a in (ANCH.get(name + '_Color1') or ANCH.get(name) or {}).get('anchors', []):
            if a.get('group') == 99: continue
            anchors.append({'p': [round(c * MU, 4) for c in a['p']], 'n': [round(c, 4) for c in a['n']], 'attach': a.get('attach'), 'maxBallR_m': round(a.get('maxBallR', 0.15) * MU, 4)})
    tiles.append({'id': f'kaykit_forest:{name}', 'pack': 'KayKit Forest Nature Pack 1.0 FREE', 'path': f'{KF_MAIN}/{f}', 'kit': 'KayKit Forest', 'kind': kind, 'role': role, 'size_class': sc,
                  'h_m': round(h_m, 4), 'h_H': round(h_m / MH, 4), 'hull_r_m': round(r_m, 4), 'hull_r_H': round(r_m / MH, 4), 'rest': 'flat', 'up': '+Y', 'sink': sink(kind), 'anchors': anchors,
                  'fluff': ('keiner (kahler Baum)' if name.startswith('Tree_Bare') else 'Krone, Lichtseite' if kind == 'tree' else 'unter den Rand' if kind == 'bush' else None),
                  'contact_family': fam, 'biomes': ['moos'], 'asset_pass': {'clay': 'kfb-clay.v1.1/midground', 'eyes': 'keine (keine Figur)', 'licence': 'CC0 (KayKit)', 'deform': 'nein (V-574)'},
                  'tris': m['tris'], 'variant_note': 'reine Mesh-Variante ohne Farbe' if name.endswith('_Mesh') else None})
# ---- Steinkit v4 (82 Steine × erlaubte Größenklassen)
G = imp(os.path.join(B50, 'STEINKIT', STONE['glb'])); nodes = {o.name: o for o in G}
for s in STONE['stones']:
    nd = nodes.get(s['node']); mm = measure([nd] + list(nd.children_recursive)) if nd else None
    dev = round(abs(mm['h'] / max(1e-6, mm['ext']) - s['dims_unit']['y']), 4) if mm else None   # Gegenprobe GLB ↔ JSON: Höhe / größte waagerechte Ausdehnung = dims_unit.y
    path_like = 'Weg' in (s.get('role') or ''); ruin = s.get('family') == 'eigen' and 'Ruinen' in (s.get('role') or '')
    for sc in s['sizeClass']:
        lo, hi = STONE['sizeClasses_m'][sc]; mid = (lo + hi) / 2
        kind = 'path_stone' if path_like else 'rubble' if (ruin and sc in ('M', 'S')) else f'stone_{sc}'
        role = 'path' if path_like else 'accent' if 'Akzent' in (s.get('role') or '') else {'L': 'anchor', 'M': 'support', 'S': 'pebble'}[sc]
        tiles.append({'id': f'steinkit_v4:{s["id"]}:{sc}', 'pack': 'Steinkit v4', 'path': f'KFB_HUB/50_BLENDER/STEINKIT/{STONE["glb"]}#{s["node"]}', 'kit': 'Steinkit v4', 'kind': kind, 'role': role, 'size_class': sc,
                      'h_m': round(s['dims_unit']['y'] * mid, 4), 'h_H': round(s['dims_unit']['y'] * mid / MH, 4), 'hull_r_m': round(s['hullRadius_unit'] * mid, 4), 'hull_r_H': round(s['hullRadius_unit'] * mid / MH, 4),
                      'scale_m': [lo, hi], 'scale_note': 'normiert: größte waagerechte Ausdehnung = 1, Laufzeit skaliert in scale_m; h_m/hull_r_m bei Klassenmitte',
                      'rest': s['rest'], 'up': s['upAxis'], 'sink': sink(kind), 'anchors': [], 'contact_family': 'pebble_moss', 'biomes': ['moos'], 'shape': s['shape'], 'family': s.get('family'), 'weight': s.get('weight'),
                      'asset_pass': {'clay': 'kfb-clay.v1.1/midground (Vertex-Farbe Höhle)', 'eyes': 'keine', 'deform': 'nein'}, 'tris': s.get('tris'), 'glb_check_dev': dev})
# ---- B29-Mauer-Kit r4 (28 Teile) mit abgeleiteten Sockets
cell_m = WALL['cell_u'] * MU
for k, p in WALL['pieces'].items():
    G = imp(os.path.join(B50, 'B29', 'kit_r4', p['glb'])); mm = measure(G)
    h_m = (p['bbox_max'][2] - p['bbox_min'][2]) * MU; r_m = mm['hull_r'] * MU if mm else max(p['bbox_max'][0] - p['bbox_min'][0], p['bbox_max'][1] - p['bbox_min'][1]) / 2 * MU
    socks = [{'edge': c, 'grid_m': round(cell_m, 4), 'class': 'wall_h3.6u', 'step': 0, 'derived': True} for c in (p.get('connect') or [])]
    tiles.append({'id': f'b29_wall_r4:{k}', 'pack': 'B29-Mauer-Kit r4', 'path': f'KFB_HUB/50_BLENDER/B29/kit_r4/{p["glb"]}', 'kit': 'B29', 'kind': 'building', 'role': 'support', 'size_class': 'L',
                  'h_m': round(h_m, 4), 'h_H': round(h_m / MH, 4), 'hull_r_m': round(r_m, 4), 'hull_r_H': round(r_m / MH, 4), 'rest': 'flat', 'up': '+Z (Blender) = +Y (glTF)', 'sink': sink('building'),
                  'cells': p.get('cells'), 'sockets': socks, 'sockets_note': 'abgeleitet aus wall_kit.r4 cells/connect/crown (kfb.stone-kit/1-Vorlage)', 'crown': WALL['crown'], 'foot_attribute': WALL['foot_attribute']['gltf'],
                  'anchors': [], 'contact_family': 'rubble_dust', 'edge_forms': ['free_end', 'built_end', 'ruin_end'], 'ordered': True, 'biomes': ['moos'],
                  'asset_pass': {'clay': 'zur Laufzeit (kfb_role_stone_1)', 'eyes': 'keine', 'deform': 'nein'}, 'tris': p.get('tris')})
# ---- KayKit path_A–D (Steinspur)
for L in 'ABCD':
    fp = os.path.join(B50, 'K6', 'out', f'KFB_Graveyard_path_{L}.k6.glb'); mm = measure(imp(fp)); ap = json.load(open(fp.replace('.glb', '.asset_pass.json')))
    h_m, r_m = mm['h'] * MU * ap.get('scale', {}).get('world_scale', 1.0), mm['hull_r'] * MU * ap.get('scale', {}).get('world_scale', 1.0)
    tiles.append({'id': f'kaykit_path:{L}', 'pack': 'KayKit Halloween Bits 1.0 FREE (über K6)', 'path': f'KFB_HUB/50_BLENDER/K6/out/KFB_Graveyard_path_{L}.k6.glb', 'kit': 'KayKit path', 'kind': 'path_stone', 'role': 'path',
                  'size_class': 'M', 'h_m': round(h_m, 4), 'h_H': round(h_m / MH, 4), 'hull_r_m': round(r_m, 4), 'hull_r_H': round(r_m / MH, 4), 'rest': 'flat', 'up': '+Y', 'sink': sink('path_stone'),
                  'anchors': [], 'contact_family': 'pebble', 'biomes': ['moos'], 'asset_pass': {'file': f'KFB_HUB/50_BLENDER/K6/out/KFB_Graveyard_path_{L}.k6.asset_pass.json', 'clay': ap['clay']['profile'], 'eyes': 'keine'},
                  'note': 'asset_pass K6 sagt sink [0, 0] (Spielterrain-Kachel); rules.sink path_stone ist [0,3, 0,5] – Widerspruch an WS0'})
os.makedirs(os.path.dirname(OUT), exist_ok=True)
import collections
summ = {'packs': dict(collections.Counter(t['pack'] for t in tiles)), 'kinds': dict(collections.Counter(t['kind'] for t in tiles))}
json.dump({'schema': 'kfb.place-tiles/1', 'for': 'kfb_place.r1.json → tiles', 'by': 'WSB N39', 'date': '2026-10-25', 'approval': 'Freigabe über WS0, Georg q201 (V-741)', 'units': 'm (m_per_kaykit_u 0.616381, m_per_H 2.24362684)',
           'summary': summ, 'notes': notes, 'tiles': tiles}, open(OUT, 'w'), indent=1, ensure_ascii=False)
print('N39_TILES', len(tiles), json.dumps(summ, ensure_ascii=False))
