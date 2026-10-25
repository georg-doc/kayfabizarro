# kfb_place_bpy · Blender-Adapter für kfb-place (V-748; Nachtrag 36, Freigabe über WS0, Georg q201) · WSB N39 · Vorschlag für CANON_3D/lib
#   Liest ein Rezept kfb.place-recipe/1 (Löser kfb-place-core.v1.mjs) und die Kacheln (kfb_place.r1.json → tiles) und baut es nach:
#   Import → kfb_clay_bpy.apply → kfb_env_bpy.place (Einsinken aus dem Rezept) → Stamps durch embed.sop (N36-Werkzeug, Regeln aus der einen Datei) → kfb_env_bpy.run().
#   Keine eigene Platzierung und kein eigenes nest() (V-748): Positionen, Drehung, Maßstab und Einsinken kommen aus dem Rezept, das Aufsetzen aus place().
#   Achsen: Rezept three.js (x, y oben, z) → Blender (x, −z, y); rotY (Bogenmaß um y) → rz (Grad um z), gleiche Drehrichtung; r2: rotX → x, rotZ → −y (Reihenfolge YZX).
#   Platzhalter (nicht gemessene Kacheln, Fluff-Nester, Fundstücke, Bodenübergänge) werden als markierte Empties gesetzt, nie als eigene Geometrie.
# Usage (in Blender):
#   import sys; sys.path.insert(0, '<KFB_HUB>/30_DECISIONS/CANON_3D/lib'); import kfb_place_bpy as kp
#   rep = kp.build(recipe='rezept.json', tiles=None, media={'media/3D_Assets/': '<lokaler Spiegel>/'}, ground=None, island='08_Forest', out_json='bericht.json')
import bpy, json, os, math, sys
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); HUB = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
for p in (HERE, os.path.join(HUB, '30_DECISIONS', 'CANON_3D', 'lib')):
    if p not in sys.path: sys.path.append(p)
import kfb_env, kfb_env_bpy, kfb_clay_bpy as clay
VERSION = 'kfb_place_bpy.r3'   # r2 (V-761): rotX/rotZ aus dem Rezept; r3 (V-763): focus/echo → Signatur
# Slot-Rolle bzw. Art → Material-Rolle (Hinweis WS0): anchor/support → bark/leaf bzw. stone; path, pebble, rubble → stone; fluff_hero/fluff_side → Fluff; find → prop
MAT_ROLE = {'tree': 'leaf', 'bush': 'leaf', 'grass': 'grass', 'water_plant': 'leaf', 'rock': 'stone', 'rockgroup': 'stone', 'stone_L': 'stone', 'stone_M': 'stone', 'stone_S': 'stone',
            'rubble': 'stone', 'path_stone': 'stone', 'stump': 'bark', 'log': 'bark', 'contact': 'stone', 'building': 'stone', 'prop': 'prop', 'fluff': 'accent', 'find': 'prop', 'dust': 'ground'}
PROFILE = {'stump': 'midground', 'log': 'midground', 'tree': 'midground', 'bush': 'midground', 'grass': 'midground', 'building': 'midground', 'prop': 'midground'}
CONTACT_TILE = {'moss_pebble': ('stone_S', 'Kiesel'), 'pebble': ('stone_S', 'Kiesel'), 'moss': ('stone_S', 'Kiesel')}   # Kontakt-Geometrie aus dem Steinkit (kleine Steine)


def _cfg():
    return json.load(open(os.path.join(HUB, '30_DECISIONS', 'CANON_3D', 'lib', 'kfb_place.r1.json')))


def _resolve(path, media):
    """Kachel-Pfad → Datei: 'KFB_HUB/…' unter dem Hub, Repo-Pfade (media/…) über die Spiegel-Tabelle, '#knoten' = Knoten im GLB."""
    node = None
    if '#' in path: path, node = path.split('#', 1)
    if path.startswith('KFB_HUB/'): f = os.path.join(HUB, path[len('KFB_HUB/'):])
    else:
        f = None
        for k, v in (media or {}).items():
            if path.startswith(k): f = os.path.join(v, path[len(k):]); break
    return f, node


class _Library:
    """Importiert jede Datei einmal (versteckt) und gibt je Instanz eine Kopie des Teils (Objekt-Kopie, Mesh-Daten geteilt)."""
    def __init__(self): self.src = {}; self.col = bpy.data.collections.new('kfb_place_src'); bpy.context.scene.collection.children.link(self.col); self.col.hide_render = True; self.col.hide_viewport = True
    def roots(self, f, node):
        if f not in self.src:
            before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=f); new = [o for o in bpy.data.objects if o not in before]
            for o in new:
                for c in list(o.users_collection): c.objects.unlink(o)
                self.col.objects.link(o)
            self.src[f] = new
        objs = self.src[f]
        if node: return [o for o in objs if o.name == node or o.name.startswith(node + '.')][:1]
        return [o for o in objs if o.parent is None]
    def instance(self, f, node, name):
        src = self.roots(f, node)
        if not src: return None
        root = bpy.data.objects.new(name, None); bpy.context.scene.collection.objects.link(root)
        def cp(o, parent):
            c = o.copy(); bpy.context.scene.collection.objects.link(c); c.parent = parent
            if node and o is src[0]: c.matrix_parent_inverse.identity(); c.location = (0, 0, 0)   # Knoten aus einem Sammel-GLB: Ursprung = Sohle des Teils
            for ch in o.children: cp(ch, c)
            return c
        for o in src: cp(o, root)
        return root


def _marker(name, inst, kind, extra=None):
    e = bpy.data.objects.new(name, None); bpy.context.scene.collection.objects.link(e); e.empty_display_type = 'SPHERE'; e.empty_display_size = 0.25
    e['kfb_placeholder'] = True; e['kfb_place_kind'] = kind; e['kfb_place_tile'] = inst.get('tile'); e['kfb_role_slot'] = inst.get('role')
    for k, v in (extra or {}).items(): e[k] = v
    return e


def placeholder_terrain(size=64.0, cell=0.5, h=None, name='PLATZHALTER_Terrain'):
    """Platzhalter-Gelände bis zum Höhenfeld-Export (V-711): h(x, z) im Rezept-Raum (Standard wie kfb-place.mjs)."""
    import bmesh
    h = h or (lambda x, z: 0.06 * z + 0.6 * math.sin(x / 9) * math.cos(z / 11))
    n = int(round(size / cell)) + 1; me = bpy.data.meshes.new(name); bm = bmesh.new(); vs = {}
    for i in range(n):
        for j in range(n): x, z = j * cell, i * cell; vs[i, j] = bm.verts.new((x, -z, h(x, z)))
    for i in range(n - 1):
        for j in range(n - 1): bm.faces.new((vs[i, j], vs[i + 1, j], vs[i + 1, j + 1], vs[i, j + 1]))
    bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    ob = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(ob)
    ob['kfb_ground'] = 'terrain'; ob['kfb_placeholder'] = True; ob['kfb_story'] = 'Platzhalter-Gelände bis zum Höhenfeld-Export (V-711), Hang nach +z wie kfb-place.mjs'
    return ob


def embed_stamp(stamp_root, inst, ground, cfg, rep):
    """embed.sop (V-753) für feste Stamps mit dem N36-Werkzeug: Fußabdruck/Maske → Düne nur auftragen (lay_in) → Sockel/Eingänge über n36_rules.
    Steinbänder, Abschlüsse (kfb_edge free_end/built_end/ruin_end je Kante, V-754) und Kontakt folgen den Rezept-Feldern; Bodenübergang = Platzhalter (V-749 Nr. 11)."""
    steps = cfg['embed']['sop']['steps']; done = []
    try:
        sys.path.insert(0, os.path.join(HUB, '50_BLENDER', 'N36', 'scripts')); import n36_embed as E, numpy as np
        if ground.get('kfb_grid'):
            g = json.loads(ground['kfb_grid']); grid = E.Grid(g['origin_m'][0], g['origin_m'][1], (g['nx'] - 1) * g['cell_m'], (g['ny'] - 1) * g['cell_m'], g['cell_m'])
        else:
            xs = [v.co.x for v in ground.data.vertices]; ys = [v.co.y for v in ground.data.vertices]; cell = abs(ground.data.vertices[1].co.x - ground.data.vertices[0].co.x) or 0.5
            grid = E.Grid(min(xs), min(ys), max(xs) - min(xs), max(ys) - min(ys), cell)
        T = E.world_tris([o for o in stamp_root.children_recursive if o.type == 'MESH'])
        if len(T):
            zb = float(T[:, :, 2].min()); m_ = E.contact_mask(grid, T, zb + 0.3); pl_ = E.ccw(E.footprint(grid, m_))
            H0 = np.array([v.co.z for v in ground.data.vertices]).reshape(grid.ny, grid.nx) if len(ground.data.vertices) == grid.nx * grid.ny else None
            if H0 is not None:
                hm = float(T[:, :, 2].max()) - zb; H1, w_, F_ = E.lay_in(grid, H0, m_, pl_, zb, hm, {'connect_of_H': 0.06, 'dune_of_H': 0.0}, inst.get('entrances') or [])
                E.set_heights(ground, grid, np.maximum(H1, H0)); done += [steps[0], steps[1], steps[2]]   # nur auftragen (V-716)
                rep['embed'].append({'stamp': inst.get('group'), 'added_max_m': round(float((np.maximum(H1, H0) - H0).max()), 3), 'cells': int((np.maximum(H1, H0) - H0 > 1e-4).sum())})
        else: rep['embed'].append({'stamp': inst.get('group'), 'note': 'Stamp ohne Mesh (Platzhalter-Kachel): Einbettung übersprungen'})
    except Exception as e: rep['embed'].append({'stamp': inst.get('group'), 'error': f'{type(e).__name__}: {e}'})
    edges = inst.get('edges') or []
    if edges:
        import kfb_edge_bpy as edge
        for ed in edges:   # Schritt 6: Abschluss je Kante (V-577/V-754)
            fn = {'free_end': None, 'built_end': edge.built_end, 'ruin_end': getattr(edge, 'ruin_end', None)}.get(ed.get('form'))
            if fn: fn(stamp_root, seed=f"{inst.get('group')}:{ed.get('form')}"); done.append(steps[5])
    rep['embed_steps'] = sorted(set(done)); rep['embed_open'] = [s for s in steps if s not in done]


def build(recipe, tiles=None, media=None, ground=None, island='08_Forest', out_json=None, gate=True, concept=None, landmark=None):
    cfg = _cfg(); R = json.load(open(recipe)) if isinstance(recipe, str) else recipe
    T = tiles if tiles is not None else cfg.get('tiles') or []
    if isinstance(T, str): T = json.load(open(T))['tiles']
    TI = {t['id']: t for t in T}; PAL = clay.palette_from_island(island); lib = _Library()
    ground = ground or next((o for o in bpy.context.scene.objects if o.get('kfb_ground')), None) or placeholder_terrain()
    rep = {'tool': VERSION, 'recipe_seed': R.get('seed'), 'instances': 0, 'placed': 0, 'placeholders': [], 'errors': [], 'sink_clamped': [], 'embed': [], 'by_kind': {}}
    smalls = [t for t in T if t['kind'] == 'stone_S']; k_contact = 0
    for i, inst in enumerate(R['instances']):
        rep['instances'] += 1; kind = inst['kind']; tid = inst.get('tile') or ''; name = f"kp_{i:03d}_{kind}"
        x, y = inst['p'][0], -inst['p'][2]; rz = math.degrees(inst.get('rotY', 0.0))
        if kind == 'contact' and tid.startswith('contact:') and smalls:   # Kontakt-Geometrie aus dem Steinkit (deterministisch je Instanz)
            t = smalls[k_contact % len(smalls)]; k_contact += 1
        else: t = TI.get(tid)
        if t is None or inst.get('placeholder') or kind in ('fluff', 'find'):
            m = _marker(name, inst, kind, {'kfb_note': {'fluff': 'Fluff-Nest (B2-R2-Grammatik, Laufzeit/Fluff-Modul)', 'find': 'Fundstück (Paket-Variante, V-434)'}.get(kind, 'Kachel nicht gemessen (Platzhalter des Lösers)')})
            m.location = (x, y, inst['p'][1]); rep['placeholders'].append({'i': i, 'kind': kind, 'tile': tid}); continue
        f, node = _resolve(t['path'], media)
        if not f or not os.path.exists(f): rep['errors'].append({'i': i, 'tile': tid, 'error': f'Datei fehlt: {f}'}); continue
        ob = lib.instance(f, node, name)
        if ob is None: rep['errors'].append({'i': i, 'tile': tid, 'error': 'Knoten fehlt'}); continue
        base = sum(t['scale_m']) / 2 if t.get('scale_m') else t['import_scale'] if t.get('import_scale') else cfg['units']['m_per_kaykit_u']   # Steinkit normiert → Klassenmitte in m; r2: Kenney gleichmäßig × import_scale (Kachel, WS0); KayKit, K6, B29 in u → m
        s = inst.get('s', 1.0) * base
        if kind == 'contact' and inst.get('r') and t.get('hull_r_m'): s = base * inst['r'] / t['hull_r_m']   # r2: Kontaktstück auf den Radius des Lösers (inst.r), gleichmäßig
        ob.scale = (s, s, s)   # s vor place() (Hinweis WS0)
        role = MAT_ROLE.get(kind, 'prop'); role = role if role in PAL else 'prop'; clay.apply(ob, role, PAL, source='kit', profile=PROFILE.get(kind), seed=f'kp:{tid}:{i}')
        lo, hi = kfb_env.SINK.get(kind if kind != 'contact' else 'contact', (0.0, 0.05)); sk = inst.get('sink')
        hi_eff = min(hi, kfb_env.SINK_CAP) if kind in kfb_env_bpy.STONE_KINDS else hi
        if hi_eff - lo >= 0.99: hi_eff = lo + 0.2 * (hi_eff - lo)
        if sk is not None and not (lo <= sk <= hi_eff): rep['sink_clamped'].append({'i': i, 'kind': kind, 'sink': sk, 'band': [lo, hi_eff]}); sk = min(max(sk, lo), hi_eff)
        if inst.get('rotX') or inst.get('rotZ'):   # V-761: schräge Kiesel. three.js Euler XYZ → Blender: rotX → x, rotY → z, rotZ → −y; Matrix Rx·Rz·Ry = Blender-Reihenfolge 'YZX' (z setzt place())
            ob.rotation_mode = 'YZX'; ob.rotation_euler.x = inst.get('rotX', 0.0); ob.rotation_euler.y = -inst.get('rotZ', 0.0); rep['tilted'] = rep.get('tilted', 0) + 1
        try:
            pr = kfb_env_bpy.place(ob, x, y, kind, ground=ground, rz=rz, sink=sk, role=role, layer=inst.get('layer'), group=inst.get('group'), story=inst.get('story'), kit=t.get('kit'),
                                   signature={'landmark': 'hero', 'focus': 'hero', 'echo': 'echo'}.get(inst.get('role')))   # r3: Fokus = Signatur-Hero, Echos aus dem Rezept
            ob['kfb_tile'] = tid; ob['kfb_role_slot'] = inst.get('role'); ob['kfb_ordered'] = bool(t.get('ordered'))
            rep['placed'] += 1; rep['by_kind'][kind] = rep['by_kind'].get(kind, 0) + 1
            if pr.get('downhill_gap'): rep['errors'].append({'i': i, 'tile': tid, 'downhill_gap_m': pr['downhill_gap']})
        except Exception as e: rep['errors'].append({'i': i, 'tile': tid, 'error': f'place: {e}'})
        if inst.get('fixed'): embed_stamp(ob, inst, ground, cfg, rep)
    rep['ground_transition'] = 'Platzhalter (Sprenkel-Modul, V-749 Nr. 11)'
    if gate:
        try: rep['gate'] = kfb_env_bpy.run(concept=concept or {}, scene_kind='proof', landmark=landmark, out_json=(out_json.replace('.json', '.env_gate.json') if out_json else None), raise_on_fail=False)
        except Exception as e: rep['gate'] = {'error': str(e)}
    if out_json: json.dump(rep, open(out_json, 'w'), indent=1, ensure_ascii=False, default=str)
    return rep
