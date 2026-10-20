# kfb_env_bpy · Blender-Adapter für das Kanon-Gate (V-563). Pflicht am Ende JEDES Diorama-/Resident-/Scenelet-Builds:
#   import sys; sys.path.insert(0, '<KFB_HUB>/30_DECISIONS/CANON_3D/lib'); import kfb_env_bpy
#   res = kfb_env_bpy.run(concept=CONCEPT, scene_kind='diorama', landmark='Barn', out_json='<job>/env_gate.json')  # wirft bei FAIL
# Pflicht-Eigenschaften je Umgebungsobjekt (Custom Properties auf dem Wurzel-Objekt):
#   kfb_kind (siehe kfb_env.SINK), kfb_role (Palettenrolle), kfb_layer (1–4), kfb_story (Satz), kfb_group, optional kfb_signature (hero|echo), kfb_kit
# Boden: genau ein Objekt mit kfb_ground = 'terrain' | 'island' (Scheibe/Platte = FAIL).
import json, bpy
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
            if n.type == 'BSDF_PRINCIPLED' and n.inputs.get('Emission Strength') and n.inputs['Emission Strength'].default_value > 0: baked = True
    return name, baked


def export(concept=None, scene_kind='diorama', landmark=None, units_per_H=1.0):
    ground = next((o for o in bpy.context.scene.objects if o.get('kfb_ground')), None)
    objs, gz = [], []
    for ob in bpy.context.scene.objects:
        if not ob.get('kfb_kind') or (ob.parent and ob.parent.get('kfb_kind')): continue
        (x0, y0, z0), (x1, y1, z1) = _bounds(ob); cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        g = _ground_z(ground, cx, cy, z1)
        objs.append({'id': ob.name, 'kind': ob['kfb_kind'], 'role': ob.get('kfb_role'), 'layer': ob.get('kfb_layer'), 'story': ob.get('kfb_story'),
                     'group': ob.get('kfb_group'), 'signature': ob.get('kfb_signature'), 'kit': ob.get('kfb_kit'), 'asset': ob.data.name if ob.data else ob.name,
                     'c': [cx, cy, (z0 + z1) / 2], 'r': max(x1 - x0, y1 - y0) / 2, 'h': z1 - z0, 'bottom_z': z0, 'ground_z': g,
                     'rot_z': round(ob.matrix_world.to_euler().z * 57.2958, 1), 'color': ob.get('kfb_color'), 'meaning': ob.get('kfb_meaning'), 'asset_pass': ob.get('kfb_asset_pass')})
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
