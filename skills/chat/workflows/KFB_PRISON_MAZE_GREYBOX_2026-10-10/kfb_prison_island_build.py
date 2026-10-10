"""KFB Prison Maze · Blender builder for everything around the maze (Step C).

Reads prison_island_layout.json and builds, from isolated Kenney source pieces (CC0):
  * the gate (castle-gate) at the maze opening;
  * the bridge: six plank segments, each its own collection, plus rails and side beams;
  * the racetrack socket at the far bridge end (an empty with the socket data as custom properties);
  * guard / cannon slots (flat blue pads, not characters: residents only appear with the KFB eyes);
  * the tower: base + middles (count from the ground height) + rotating lantern (tower-watch) with a light
    cone and a spot light + fixed crenellated crown (tower-top) with a cannon on the deck.
Also: a darker copy of the terrain material and two lighting states (dusk, cold day).

Use inside Blender:
    exec(open(PATH).read()); build(layout_path, scene_name, terrain_name, template_collection)
"""
import bpy, bmesh, json, math
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

FPS = 30


def _bvh(terrain):
    dg = bpy.context.evaluated_depsgraph_get(); ev = terrain.evaluated_get(dg); me = ev.to_mesh()
    b = BVHTree.FromPolygons([terrain.matrix_world @ v.co for v in me.vertices], [list(p.vertices) for p in me.polygons])
    ev.to_mesh_clear(); return b


def _gz(bvh, x, y):
    h = bvh.ray_cast(Vector((x, y, 50.0)), Vector((0, 0, -1)))
    return h[0].z if h[0] is not None else 0.0


def _col(name, parent):
    c = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if c.name not in parent.children:
        parent.children.link(c)
    for o in list(c.objects):
        bpy.data.objects.remove(o)
    return c


def _place(tpl, piece, col, M, tag):
    """Copy the template objects of one source piece into col with world matrix M @ template world matrix."""
    objs = [o for o in tpl.objects if o.type == 'MESH' and o.name.split('.')[0] == piece]
    if not objs:
        raise KeyError(f'template piece {piece} missing')
    out = []
    for o in objs:
        n = o.copy(); col.objects.link(n); n.parent = None
        n.matrix_world = M @ o.matrix_world; n.hide_render = False; n.hide_viewport = False
        n['src'] = tag; out.append(n)
    return out


def _mat(name, rgba, emit=0.0, alpha=1.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = rgba; b.inputs['Alpha'].default_value = alpha
    b.inputs['Emission Color'].default_value = rgba; b.inputs['Emission Strength'].default_value = emit
    if alpha < 1.0:
        m.surface_render_method = 'BLENDED'
    return m


def _box(name, col, size, loc, mat):
    me = bpy.data.meshes.new(name); bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector(size), verts=bm.verts); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); col.objects.link(o); o.location = loc; me.materials.append(mat); return o


def _pad(name, col, loc):
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=16, radius1=0.45, radius2=0.45, depth=0.08); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); col.objects.link(o); o.location = loc
    me.materials.append(_mat('C_SLOT_BLUE', (0.10, 0.35, 0.95, 1), emit=0.6)); return o


def dark_terrain(terrain, factor=0.55, sat=0.75):
    """Darker, less saturated copy of the terrain material (the source material stays untouched)."""
    src = terrain.data.materials[0]
    if src.name.startswith('C_TERRAIN_DARK'):
        return src
    m = src.copy(); m.name = 'C_TERRAIN_DARK'; nt = m.node_tree
    bsdf = nt.nodes['Principled BSDF']; link = bsdf.inputs['Base Color'].links[0]; feed = link.from_socket
    nt.links.remove(link)
    hsv = nt.nodes.new('ShaderNodeHueSaturation'); hsv.inputs['Saturation'].default_value = sat; hsv.inputs['Value'].default_value = factor
    nt.links.new(feed, hsv.inputs['Color']); nt.links.new(hsv.outputs['Color'], bsdf.inputs['Base Color'])
    terrain.data.materials[0] = m
    return m


def build(layout_path, scene_name, terrain_name, tpl_name='A2_TEMPLATES'):
    L = json.load(open(layout_path)); sc = bpy.data.scenes[scene_name]; tpl = bpy.data.collections[tpl_name]
    terrain = bpy.data.objects[terrain_name]; bvh = _bvh(terrain)
    root = bpy.data.collections.get('C_ISLAND') or bpy.data.collections.new('C_ISLAND')
    if root.name not in sc.collection.children:
        sc.collection.children.link(root)
    info = {}
    # bridgehead: stone block that extends the island where the gate and the bridge meet it
    bh = L.get('bridgehead')
    if bh:
        cbh = _col('C_BRIDGEHEAD', root)
        (x0, y0), (x1, y1) = bh['from'], bh['to']
        _box('BRIDGEHEAD', cbh, (abs(x1 - x0), abs(y1 - y0), bh['depth']), ((x0 + x1) / 2, (y0 + y1) / 2, bh['topZ'] - bh['depth'] / 2),
             _mat('C_STONE_DARK', (0.09, 0.085, 0.08, 1)))
    # gate (on the rim or on the bridgehead top)
    g = L['gate']; gx, gy = g['pos']; gz = max(_gz(bvh, gx, gy), bh['topZ'] if bh else -99)
    cg = _col('C_GATE', root)
    _place(tpl, 'castle-gate', cg, Matrix.Translation((gx, gy, gz)), g['asset'])
    info['gateZ'] = round(gz, 3)
    # bridge
    b = L['bridge']; sx, sy = b['start']; seg = b['segmentLength']; w = b['deckWidth']; z = b['deckZ']
    cb = _col('C_BRIDGE', root)
    wood = _mat('C_WOOD_DARK', (0.16, 0.10, 0.06, 1))
    for k in range(b['segments']):
        cs = _col(f'BRIDGE_SEG_{k + 1:02d}', cb)
        cy = sy - seg * (k + 0.5)
        for px in (-w / 4, w / 4):
            _place(tpl, 'platform-planks', cs, Matrix.Translation((sx + px, cy, z - 0.43)), b['plank'])
        for side in (-1, 1):
            _box(f'RAIL_{k + 1:02d}_{side}', cs, (0.12, seg, 0.12), (sx + side * (w / 2 - 0.06), cy, z + b['railHeight']), wood)
            _box(f'POST_{k + 1:02d}_{side}', cs, (0.14, 0.14, b['railHeight']), (sx + side * (w / 2 - 0.06), cy - seg / 2 + 0.1, z + b['railHeight'] / 2), wood)
            _box(f'BEAM_{k + 1:02d}_{side}', cs, (0.3, seg, 0.4), (sx + side * (w / 2 - 0.3), cy, z - 0.65), wood)
    # socket
    s = L['sockets'][0]
    cso = _col('C_SOCKETS', root)
    e = bpy.data.objects.new('SOCKET_' + s['id'], None); cso.objects.link(e)
    e.empty_display_type = 'SINGLE_ARROW'; e.empty_display_size = 2.0
    e.location = s['pos']; e.rotation_euler = (math.radians(90), 0, 0)    # arrow points along -Y (heading)
    for k_, v in s.items():
        e[k_] = json.dumps(v) if isinstance(v, (list, dict)) else v
    _box('SOCKET_PAD_' + s['id'], cso, (s['width'], 0.4, 0.06), (s['pos'][0], s['pos'][1] + 0.2, s['pos'][2] + 0.03),
         _mat('C_SOCKET_ORANGE', (1.0, 0.45, 0.05, 1), emit=0.8))
    # tower
    T = L['tower']; tx, ty = T['pos']; tz = _gz(bvh, tx, ty)
    st = T['storey']; base = T['stack']['base']; mids = T['stack']['middles']
    n_mid = max(0, math.ceil((T['lampTargetZ'] - (tz + st[base] + T['lampCentreInLantern'])) / 2.0))
    ct = _col('C_TOWER', root)
    zc = tz
    _place(tpl, base, ct, Matrix.Translation((tx, ty, zc)), 'kenney_pirate-kit/' + base); zc += st[base]
    for i in range(n_mid):
        p = mids[0] if i == 0 else mids[1]
        _place(tpl, p, ct, Matrix.Translation((tx, ty, zc)), 'kenney_pirate-kit/' + p); zc += st[p]
    lamp_z = zc + T['lampCentreInLantern']
    pivot = bpy.data.objects.new('LANTERN_PIVOT', None); ct.objects.link(pivot); pivot.location = (tx, ty, lamp_z)
    lant = _place(tpl, 'tower-watch', ct, Matrix.Translation((tx, ty, zc)), 'kenney_pirate-kit/tower-watch')
    for o in lant:                      # parent to the pivot; local offset set directly (pivot matrix is not evaluated yet)
        loc = o.matrix_world.translation.copy(); o.parent = pivot; o.matrix_parent_inverse.identity()
        o.location = loc - pivot.location
    zc += st['tower-watch']
    _place(tpl, 'tower-top', ct, Matrix.Translation((tx, ty, zc)), 'kenney_pirate-kit/tower-top')
    deck_z = zc + T['deckFloorInCrown']; zc += st['tower-top']
    # beam: cone from the lamp to the maze floor at hitRadius, parented to the pivot
    bm_ = T['beam']; R = bm_['hitRadius']; hit_z = _gz(bvh, tx, ty - R)
    length = math.hypot(R, lamp_z - hit_z); pitch = math.atan2(lamp_z - hit_z, R)
    me = bpy.data.meshes.new('BEAM_CONE'); bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=False, segments=20, radius1=bm_['endRadius'], radius2=0.12, depth=length)
    bmesh.ops.translate(bm, vec=Vector((0, 0, -length / 2)), verts=bm.verts)   # apex at the origin, open end at -Z
    bm.to_mesh(me); bm.free()
    beam = bpy.data.objects.new('BEAM_CONE', me); ct.objects.link(beam)
    me.materials.append(_mat('C_BEAM', (1.0, 0.86, 0.45, 1), emit=1.6, alpha=0.14))
    beam.parent = pivot; beam.location = (0, 0, 0)
    beam.rotation_euler = (-(math.pi / 2 - pitch), 0, 0)       # -Z axis turned to point along -Y and down
    spot = bpy.data.objects.new('BEAM_SPOT', bpy.data.lights.new('BEAM_SPOT', 'SPOT')); ct.objects.link(spot)
    spot.data.energy = 3000; spot.data.color = (1.0, 0.88, 0.6)
    spot.data.spot_size = 2 * math.atan2(bm_['endRadius'], length) * 1.6; spot.data.spot_blend = 0.4
    spot.parent = pivot; spot.location = (0, 0, 0); spot.rotation_euler = beam.rotation_euler
    # rotation: one turn per secondsPerTurn, linear, cyclic
    pivot.rotation_euler = (0, 0, 0); pivot.keyframe_insert('rotation_euler', index=2, frame=1)
    pivot.rotation_euler = (0, 0, 2 * math.pi); pivot.keyframe_insert('rotation_euler', index=2, frame=1 + int(FPS * bm_['secondsPerTurn']))
    try:
        fc = next(f for f in pivot.animation_data.action.fcurves if f.data_path == 'rotation_euler')
    except Exception:
        fc = None
        for layer in pivot.animation_data.action.layers:
            for strip in layer.strips:
                for cb_ in strip.channelbags:
                    for f in cb_.fcurves:
                        if f.data_path == 'rotation_euler':
                            fc = f
    if fc:
        for kp in fc.keyframe_points:
            kp.interpolation = 'LINEAR'
        fc.modifiers.new('CYCLES')
    # deck: cannon (fixed, aims at the gate) + guard pad
    _place(tpl, 'cannon', ct, Matrix.Translation((tx + 0.6, ty - 0.4, deck_z)) @ Matrix.Rotation(math.pi, 4, 'Z'), 'kenney_pirate-kit/cannon')
    # slots
    csl = _col('C_SLOTS', root)
    for sl in L['slots']:
        if sl['id'] == 'guard_gate_top':
            _pad('SLOT_' + sl['id'], csl, (sl['pos'][0], sl['pos'][1], gz + 4.42))
        elif sl['id'] == 'guard_bridge_start':
            _pad('SLOT_' + sl['id'], csl, (sl['pos'][0], sl['pos'][1], z + 0.05))
        elif sl['id'] == 'guard_tower_deck':
            _pad('SLOT_' + sl['id'], csl, (tx - 0.7, ty + 0.3, deck_z + 0.05))
    info.update({'towerGroundZ': round(tz, 3), 'middles': n_mid, 'lampZ': round(lamp_z, 3), 'deckZ': round(deck_z, 3),
                 'towerTopZ': round(zc, 3), 'beamPitchDeg': round(math.degrees(pitch), 1), 'beamLength': round(length, 2)})
    return info


def lighting(scene, state):
    """'dusk' (gloomy, beam reads) or 'cold_day'. One sun + world colour; nothing per character."""
    sun = bpy.data.objects.get('B_SUN'); w = scene.world; bg = w.node_tree.nodes['Background']
    if state == 'dusk':
        sun.data.energy = 2.2; sun.data.color = (1.0, 0.62, 0.38); sun.rotation_euler = (math.radians(70), 0, math.radians(-55))
        bg.inputs[0].default_value = (0.09, 0.10, 0.16, 1); bg.inputs[1].default_value = 1.3
        bpy.data.lights['BEAM_SPOT'].energy = 3000
    else:
        sun.data.energy = 3.2; sun.data.color = (0.86, 0.92, 1.0); sun.rotation_euler = (math.radians(42), 0, math.radians(30))
        bg.inputs[0].default_value = (0.42, 0.47, 0.55, 1); bg.inputs[1].default_value = 0.8
        bpy.data.lights['BEAM_SPOT'].energy = 800
    try:
        scene.view_settings.view_transform = 'AgX'
        scene.view_settings.look = 'AgX - Medium High Contrast' if state == 'dusk' else 'None'
    except TypeError:
        pass
