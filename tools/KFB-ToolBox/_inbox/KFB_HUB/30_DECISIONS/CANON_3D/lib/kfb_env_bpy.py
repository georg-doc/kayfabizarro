# kfb_env_bpy · Blender-Adapter für das Kanon-Gate (V-563). Pflicht am Ende JEDES Diorama-/Resident-/Scenelet-Builds:
#   import sys; sys.path.insert(0, '<KFB_HUB>/30_DECISIONS/CANON_3D/lib'); import kfb_env_bpy
#   res = kfb_env_bpy.run(concept=CONCEPT, scene_kind='diorama', landmark='Barn', out_json='<job>/env_gate.json')  # wirft bei FAIL
# Pflicht-Eigenschaften je Umgebungsobjekt (Custom Properties auf dem Wurzel-Objekt):
#   kfb_kind (siehe kfb_env.SINK), kfb_role (Palettenrolle), kfb_layer (1–4), kfb_story (Satz), kfb_group, optional kfb_signature (hero|echo), kfb_kit,
#   kfb_support (Name des gebauten Objekts, auf dem es steht, z. B. Bühne; das Gebaute selbst ist kfb_kind 'building' und steht im Terrain)
# Boden: genau ein Objekt mit kfb_ground = 'terrain' | 'island' (Scheibe/Platte = FAIL).
# r3 (WSB, V-763): Export 'slot' = kfb_role_slot (Rolle im Rezept: anchor, support, focus …) für ENV-KONTAKTFENSTER und Fokus.
# r2 (WSB N39): zusätzlich optional kfb_wear (Liste), kfb_form, kfb_keystone, kfb_ordered, kfb_trunk_r, kfb_slope_deg; Neigung/Lehnrichtung aus der Rotation (ENV-LEHNE).
import json, math, bpy
from mathutils import Vector
import kfb_env


def _bounds(ob):
    objs = [ob] + [c for c in ob.children_recursive if c.type == 'MESH']
    pts = [o.matrix_world @ Vector(c) for o in objs if o.type == 'MESH' for c in o.bound_box]
    return (min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)), (max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts))


def _ground_z(ground, x, y, ztop):
    """Höhe nur des Boden-Objekts unter (x, y) – andere Objekte werden nicht getroffen."""
    if ground is None: return 0.0
    dg = bpy.context.evaluated_depsgraph_get(); ge = ground.evaluated_get(dg); inv = ground.matrix_world.inverted()
    o = inv @ Vector((x, y, ztop + 50)); d = (inv.to_3x3() @ Vector((0, 0, -1))).normalized()
    hit, loc, *_ = ge.ray_cast(o, d)
    return (ground.matrix_world @ loc).z if hit else 0.0


def _material_info(ob):
    """Material-Name (kfb-clay-Konvention von kfb_clay_bpy) und Verdacht auf eingebackenes Licht (AO-/Bake-/Light-Textur, Emission)."""
    mats = [s.material for o in [ob] + list(ob.children_recursive) if o.type == 'MESH' for s in o.material_slots if s.material]
    if not mats: return None, False
    name = mats[0].get('kfb_material') or mats[0].name
    baked = False
    for m in mats:
        if not m.use_nodes: continue
        for n in m.node_tree.nodes:
            if n.type == 'TEX_IMAGE' and n.image and any(k in n.image.name.lower() for k in ('ao', 'bake', 'light', 'shadow')): baked = True
            if n.type == 'BSDF_PRINCIPLED' and n.inputs.get('Emission Strength') and n.inputs['Emission Strength'].default_value > 0 and not str(m.get('kfb_material') or m.name).startswith('kfb-clay'): baked = True  # kfb-clay-Profile dürfen ihre SSOT-Emission tragen (Web = Blender)
    return name, baked


def export(concept=None, scene_kind='diorama', landmark=None, units_per_H=1.0):
    ground = next((o for o in bpy.context.scene.objects if o.get('kfb_ground')), None)
    objs, gz = [], []
    for ob in bpy.context.scene.objects:
        if not ob.get('kfb_kind') or (ob.parent and ob.parent.get('kfb_kind')): continue
        (x0, y0, z0), (x1, y1, z1) = _bounds(ob); cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        sup = bpy.context.scene.objects.get(ob.get('kfb_support')) if ob.get('kfb_support') else None  # steht auf Gebautem (Bühne, Tisch): dessen Oberfläche ist der Grund
        g = _ground_z(sup or ground, cx, cy, z1)
        objs.append({'id': ob.name, 'kind': ob['kfb_kind'], 'role': ob.get('kfb_role'), 'layer': ob.get('kfb_layer'), 'story': ob.get('kfb_story'),
                     'group': ob.get('kfb_group'), 'slot': ob.get('kfb_role_slot'), 'signature': ob.get('kfb_signature'), 'kit': ob.get('kfb_kit'), 'asset': ob.data.name if ob.data else ob.name,
                     'c': [cx, cy, (z0 + z1) / 2], 'r': max(x1 - x0, y1 - y0) / 2, 'h': z1 - z0, 'bottom_z': z0, 'ground_z': g,
                     'rot_z': round(ob.matrix_world.to_euler().z * 57.2958, 1), 'color': ob.get('kfb_color'), 'meaning': ob.get('kfb_meaning'), 'asset_pass': ob.get('kfb_asset_pass')})
        # r2 (N39): Messwerte für ENV-LEHNE Ü1–Ü4, ENV-ORDNUNG und ENV-BIOGRAFIE
        up = ob.matrix_world.to_3x3() @ Vector((0, 0, 1)); tilt = math.degrees(math.acos(max(-1.0, min(1.0, up.normalized().z))))
        objs[-1].update({'tilt': round(tilt, 1), 'lean_az': round(math.degrees(math.atan2(up.y, up.x)), 1) if tilt > 1.0 else None, 'form': ob.get('kfb_form'), 'keystone': bool(ob.get('kfb_keystone')),
                         'ordered': bool(ob.get('kfb_ordered')), 'trunk_r': ob.get('kfb_trunk_r'), 'slope_deg': ob.get('kfb_slope_deg'), 'lean_deg': round(tilt, 1) if ob.get('kfb_kind') == 'tree' else None})
        if ob.get('kfb_wear') is not None: objs[-1]['wear'] = list(ob['kfb_wear'])
        objs[-1]['material'], objs[-1]['baked_light'] = _material_info(ob)
    for ob in bpy.context.scene.objects:   # unmarkierte flache Scheiben/Platten (Georg 20.10.: Props auf eine Scheibe)
        if ob.type != 'MESH' or ob is ground or ob.get('kfb_kind') or ob.parent: continue
        (x0, y0, z0), (x1, y1, z1) = _bounds(ob); r = max(x1 - x0, y1 - y0) / 2
        if r > 1.0 and (z1 - z0) < 0.15 * r: objs.append({'id': ob.name, 'kind': 'untagged_plate', 'c': [(x0 + x1) / 2, (y0 + y1) / 2], 'r': r, 'h': z1 - z0})
    if ground:
        (gx0, gy0, _), (gx1, gy1, gz1) = _bounds(ground)
        gz = [_ground_z(ground, gx0 + (gx1 - gx0) * i / 6, gy0 + (gy1 - gy0) * j / 6, gz1) for i in range(1, 6) for j in range(1, 6)]
        area = {'min': [gx0, gy0], 'max': [gx1, gy1]}
    else:
        area = None
    return {'id': bpy.path.basename(bpy.data.filepath) or 'unsaved', 'kind': scene_kind, 'units_per_H': units_per_H, 'concept': concept or {},
            'landmark': landmark, 'ground': {'kind': ground.get('kfb_ground') if ground else None, 'samples_z': gz}, 'area': area, 'objects': objs}


def run(concept=None, scene_kind='diorama', landmark=None, out_json=None, units_per_H=1.0, raise_on_fail=True):
    scene = export(concept, scene_kind, landmark, units_per_H); res = kfb_env.gate(scene)
    if out_json:
        json.dump({'scene': scene, 'gate': res}, open(out_json, 'w'), indent=1, ensure_ascii=False)
    if raise_on_fail and not res['ok']:
        raise RuntimeError('KFB-Kanon-Gate FAIL:\n  ' + '\n  '.join(res['fail']))
    return res


# ------------------------------------------------------------------ place() · Teil auf den Boden setzen (WSB K3, WS0-Ja 20.10.)
# Einziger Baustein für „auf Boden setzen + Einsinken“; Jobs schreiben kein eigenes place() mehr.
#   Einsinken nur aus kfb_env.SINK[kind] und kfb_env.SINK_CAP (V-570), nie hier definiert. Boden nur über den Raycast auf das kfb_ground-Objekt (_ground_z).
#   Gemessen wird wie im Gate: Bodenhöhe unter der Mitte der Hülle, sink = (ground_z − Unterkante) / Höhe.
#   Am Hang: liegt der Boden an der Talseite der Grundfläche tiefer als die Unterkante, wird so weit eingesunken, dass die Talseite aufliegt –
#   höchstens bis zur Bandobergrenze (Fels/Stein zusätzlich bis SINK_CAP). Reicht das nicht, meldet place() 'downhill_gap' (Teil zu groß für den Hang).
#   Arten mit offenem Band (grass, fluff, water_plant: 0–100 %) nehmen das untere Fünftel des Bands.
STONE_KINDS = ('rock', 'rockgroup', 'stone_L', 'stone_M', 'stone_S')


def place(ob, x, y, kind, ground=None, rz=0.0, seed=1, sink=None, role=None, layer=None, group=None, story=None, kit=None, signature=None, support=None):
    """Setzt ob (Wurzel, Kinder zählen mit) auf (x, y) des Bodens und lässt es nach kfb_env.SINK[kind] einsinken. Liefert einen Bericht.
    support: gebautes Objekt (kfb_kind 'building', z. B. Bühne/Tisch), auf dem ob steht → dessen Oberfläche ist der Grund, ob bekommt kfb_support (WS0 20.10.)."""
    import random, math
    if kind not in kfb_env.SINK: raise ValueError(f'place: unbekannte Art {kind!r} (kfb_env.SINK)')
    ground = ground or next((o for o in bpy.context.scene.objects if o.get('kfb_ground')), None)
    if ground is None or not ground.get('kfb_ground'): raise ValueError('place: kein Boden mit kfb_ground in der Szene')
    lo, hi = kfb_env.SINK[kind]
    if kind in STONE_KINDS: hi = min(hi, kfb_env.SINK_CAP)
    if hi - lo >= 0.99: hi = lo + 0.2 * (hi - lo)
    if sink is None: sink = lo + (hi - lo) * random.Random(f'{seed}:{ob.name}:{kind}').random()
    elif not (lo <= sink <= hi): raise ValueError(f'place: Einsinken {sink:.2f} außerhalb {lo:.2f}–{hi:.2f} ({kind})')
    ob.location.x, ob.location.y = x, y; ob.rotation_euler.z = math.radians(rz); bpy.context.view_layer.update()
    (x0, y0, z0), (x1, y1, z1) = _bounds(ob); cx, cy = (x0 + x1) / 2, (y0 + y1) / 2; h = max(z1 - z0, 1e-6); r = max(x1 - x0, y1 - y0) / 2
    surf = support or ground
    gc = _ground_z(surf, cx, cy, z1 + 10)
    ring = [_ground_z(surf, cx + 0.7 * r * math.cos(a), cy + 0.7 * r * math.sin(a), z1 + 10) for a in [k * math.pi / 4 for k in range(8)]]
    need = (gc - min(ring)) / h + 0.005                     # Einsinken, damit die Talseite aufliegt
    gap = None
    if need > sink:
        if need <= hi: sink = need
        else: sink = hi; gap = round((need - hi) * h, 4)
    ob.location.z += (gc - sink * h) - z0; bpy.context.view_layer.update()
    ob['kfb_kind'] = kind
    if support is not None: ob['kfb_support'] = support.name
    for key, v in (('kfb_role', role), ('kfb_layer', layer), ('kfb_group', group), ('kfb_story', story), ('kfb_kit', kit), ('kfb_signature', signature)):
        if v is not None: ob[key] = v
    return {'id': ob.name, 'kind': kind, 'sink': round(sink, 4), 'band': [lo, hi], 'ground_z': round(gc, 4), 'bottom_z': round(gc - sink * h, 4), 'h': round(h, 4),
            'slope_drop': round(gc - min(ring), 4), 'downhill_gap': gap, 'source': 'kfb_env.SINK' + (' + SINK_CAP' if kind in STONE_KINDS else ''), 'support': support.name if support is not None else None}
