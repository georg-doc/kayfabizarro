"""KFB appear grammar (shared): how any conjured / unpacked item arrives in the world.

One visual logic for every source (gift box spit, spell shot, later a treasure chest):
  source path  -> a clay ball travels along a caller-given path (box mouth, hands, ...)
  arrive       -> braked to a stop at the presentation point, catch squash
  morph        -> the ball's own surface is pulled onto the item's outer hull (shape key, glTF morph target)
  colour wave  -> clay dissolves top-down with a glowing edge, the real item is underneath
  glow         -> the item's own rim glow (inverted hull) fades in; a short light flash from the item
  float        -> zero-G: launch spin decays into a slow turn, two-axis tilt, bob
Only the source path and the clay colour differ per use. Visibility is done with scale keys only.

Usage:
    import kfb_appear as A
    res = A.build(scene, collection, prop_root, path=[(frame, Vector loc, scale), ...],
                  arrive=74, present=Vector((x, y, z)), clay_hex="#ef5a22", prop_scale=0.95, name="FS")
"""
import bpy, bmesh, math, random, os
from mathutils import Vector, Euler
from mathutils.bvhtree import BVHTree

DEFAULTS = dict(
    clay_hex="#ef5a22", edge_hex="#fff1b0", glow_hex="#ffd27a",
    lump_r=0.2, prop_scale=1.0, prop_rz=90.0,
    morph=(-4, 14),            # relative to arrive
    colour=(16, 28),           # relative to arrive
    glow=(22, 34),             # relative to arrive
    spin_launch=0.55, spin_steady=200, spin_tau=6.0,
    tilt_x=(0.28, 97), tilt_y=(0.22, 131), bob=(0.055, 74),
    flash=45.0, hull_w=0.035, crumbs_out=10, end=180, seed=21,
    fingerprints=None,
)


def lin(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c) + (1.0,)


def _fcs(idb):
    ad = idb.animation_data
    if not ad or not ad.action: return []
    out = []
    for l in ad.action.layers:
        for s in l.strips:
            for cb in s.channelbags: out += [(fc, cb) for fc in cb.fcurves]
    return out


def clear_anim(o):
    for fc, cb in _fcs(o): cb.fcurves.remove(fc)


def key(o, path, f, v, ip='BEZIER'):
    if path.startswith('['): o[path[2:-2]] = v
    else: setattr(o, path, v)
    o.keyframe_insert(path, frame=f)
    for fc, cb in _fcs(o):
        if fc.data_path == path:
            for k in fc.keyframe_points:
                if abs(k.co.x - f) < 0.01: k.interpolation = ip


def key_sk(block, f, v, ip='BEZIER'):
    block.value = v; block.keyframe_insert("value", frame=f)
    dp = block.path_from_id("value")
    for fc, cb in _fcs(block.id_data):
        if fc.data_path == dp:
            for k in fc.keyframe_points:
                if abs(k.co.x - f) < 0.01: k.interpolation = ip


# ---------------------------------------------------------------- materials
def clay_material(name, hex_, edge_hex, zmin, zmax, fingerprints=None):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); N = nt.nodes; Lk = nt.links.new
    out = N.new('ShaderNodeOutputMaterial'); b = N.new('ShaderNodeBsdfPrincipled')
    b.inputs['Base Color'].default_value = lin(hex_); b.inputs['Roughness'].default_value = 0.82
    b.inputs['Sheen Weight'].default_value = 0.15
    tc = N.new('ShaderNodeTexCoord')
    if fingerprints and os.path.exists(fingerprints):
        mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (7.0,) * 3; Lk(tc.outputs['Object'], mp.inputs['Vector'])
        img = N.new('ShaderNodeTexImage'); img.projection = 'BOX'; img.projection_blend = 0.3
        img.image = bpy.data.images.load(fingerprints, check_existing=True); img.image.colorspace_settings.name = 'Non-Color'
        Lk(mp.outputs['Vector'], img.inputs['Vector'])
        bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.55; bp.inputs['Distance'].default_value = 0.004; bp.invert = True
        Lk(img.outputs['Color'], bp.inputs['Height']); Lk(bp.outputs['Normal'], b.inputs['Normal'])
    sep = N.new('ShaderNodeSeparateXYZ'); Lk(tc.outputs['Object'], sep.inputs[0])
    mr = N.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = zmin; mr.inputs['From Max'].default_value = zmax
    Lk(sep.outputs['Z'], mr.inputs['Value'])
    att = N.new('ShaderNodeAttribute'); att.attribute_type = 'OBJECT'; att.attribute_name = 'dissolve'
    noi = N.new('ShaderNodeTexNoise'); noi.inputs['Scale'].default_value = 7.0; Lk(tc.outputs['Object'], noi.inputs['Vector'])
    def M(op, a, bb=None):
        n = N.new('ShaderNodeMath'); n.operation = op
        for i, v in enumerate((a, bb)):
            if v is None: continue
            if isinstance(v, (int, float)): n.inputs[i].default_value = v
            else: Lk(v, n.inputs[i])
        return n.outputs[0]
    t = M('ADD', M('MULTIPLY', M('SUBTRACT', 1.0, mr.outputs['Result']), 0.78), M('MULTIPLY', noi.outputs['Fac'], 0.22))
    diff = M('SUBTRACT', t, att.outputs['Fac'])
    alpha = M('GREATER_THAN', diff, 0.0)
    edge = M('MULTIPLY', M('LESS_THAN', diff, 0.05), alpha)
    b.inputs['Emission Color'].default_value = lin(edge_hex); Lk(M('MULTIPLY', edge, 5.0), b.inputs['Emission Strength'])
    tr = N.new('ShaderNodeBsdfTransparent'); mx = N.new('ShaderNodeMixShader')
    Lk(alpha, mx.inputs['Fac']); Lk(tr.outputs[0], mx.inputs[1]); Lk(b.outputs[0], mx.inputs[2]); Lk(mx.outputs[0], out.inputs['Surface'])
    return m


def invisible_material():
    m = bpy.data.materials.get("KFB_Invisible")
    if m: return m
    m = bpy.data.materials.new("KFB_Invisible"); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    o = nt.nodes.new('ShaderNodeOutputMaterial'); t = nt.nodes.new('ShaderNodeBsdfTransparent')
    nt.links.new(t.outputs[0], o.inputs['Surface']); return m


def glow_material(glow_hex):
    """Rim glow shell: fresnel emission, faded in by the object attribute 'reveal' (0..1.05)."""
    name = "KFB_AppearGlow"
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); N = nt.nodes; Lk = nt.links.new
    out = N.new('ShaderNodeOutputMaterial')
    lw = N.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.35
    em = N.new('ShaderNodeEmission'); em.inputs['Color'].default_value = lin(glow_hex); em.inputs['Strength'].default_value = 4.0
    tr = N.new('ShaderNodeBsdfTransparent'); mx = N.new('ShaderNodeMixShader')
    att = N.new('ShaderNodeAttribute'); att.attribute_type = 'OBJECT'; att.attribute_name = 'reveal'
    cl = N.new('ShaderNodeMath'); cl.operation = 'MINIMUM'; cl.inputs[1].default_value = 1.0; Lk(att.outputs['Fac'], cl.inputs[0])
    mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; Lk(lw.outputs['Facing'], mul.inputs[0]); Lk(cl.outputs[0], mul.inputs[1])
    Lk(mul.outputs[0], mx.inputs['Fac']); Lk(tr.outputs[0], mx.inputs[1]); Lk(em.outputs[0], mx.inputs[2])
    Lk(mx.outputs[0], out.inputs['Surface'])
    try: m.surface_render_method = 'BLENDED'
    except Exception: pass
    m.use_backface_culling = True
    return m


# ---------------------------------------------------------------- geometry
def prop_meshes(root):
    return [root] * (root.type == 'MESH') + [c for c in root.children_recursive
                                              if c.type == 'MESH' and not c.name.endswith(("_GLOW", "_HULL"))]


def hull_ball(name, root, prop_scale, lump_r, sub=4):
    """Sphere around the item's centre + shape key 'prop' pulled onto its outer hull. Coordinates are in carrier
    space, where the root sits at -c with uniform scale prop_scale."""
    sc = bpy.context.scene
    keep = (root.location.copy(), root.rotation_euler.copy(), root.scale.copy(), root.parent, root.matrix_parent_inverse.copy())
    root.parent = None; root.location = (0, 0, 0); root.rotation_euler = (0, 0, 0); root.scale = (prop_scale,) * 3
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    verts, polys = [], []
    for o in prop_meshes(root):
        e = o.evaluated_get(dg); mw = e.matrix_world; base = len(verts)
        verts += [mw @ v.co for v in e.data.vertices]
        polys += [tuple(base + i for i in p.vertices) for p in e.data.polygons]
    root.parent, root.matrix_parent_inverse = keep[3], keep[4]
    root.location, root.rotation_euler, root.scale = keep[0], keep[1], keep[2]
    lo = Vector((min(v.x for v in verts), min(v.y for v in verts), min(v.z for v in verts)))
    hi = Vector((max(v.x for v in verts), max(v.y for v in verts), max(v.z for v in verts)))
    c = (lo + hi) / 2
    bvh = BVHTree.FromPolygons(verts, polys); big = (hi - lo).length * 2
    bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=1.0)
    basis, target = [], []
    half = (hi - lo) / 2
    flat = min(half) < 0.15 * max(half)          # thin items (cards, plates): clay slab instead of hull spikes
    if flat:
        ax = [max(h, 0.04) + 0.012 for h in half]
    for v in bm.verts:
        d = v.co.normalized()
        if flat:                                   # rounded slab (superellipsoid, n=6) around the item's box
            n_ = 6.0
            t = sum(abs(d[i] / ax[i]) ** n_ for i in range(3)) ** (-1.0 / n_)
            basis.append(d * lump_r); target.append(d * t)
            continue
        hit = bvh.ray_cast(c + d * big, -d, big * 2)[0]
        p = hit if hit is not None else bvh.find_nearest(c + d * 0.3)[0]
        basis.append(d * lump_r); target.append(p - c + d * 0.015)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for v, b in zip(me.vertices, basis): v.co = b
    for p in me.polygons: p.use_smooth = True
    o = bpy.data.objects.new(name, me)
    o.shape_key_add(name="Basis"); sk = o.shape_key_add(name="prop", from_mix=False)
    for i, t in enumerate(target): sk.data[i].co = t
    return o, c, lo - c, hi - c


def glow_shells(root, mat_inv, mat_glow, hull_w, prop_scale):
    shells = []
    for src in prop_meshes(root):
        me = src.data.copy(); me.name = src.data.name + "_GLOW"
        for p in me.polygons: p.material_index = 0
        me.materials.clear(); me.materials.append(mat_inv); me.materials.append(mat_glow)
        o = bpy.data.objects.new(src.name + "_GLOW", me)
        for c in src.users_collection: c.objects.link(o)
        o.parent = src; o.matrix_parent_inverse.identity()
        w = o.modifiers.new("weld", 'WELD'); w.merge_threshold = 0.002
        s = o.modifiers.new("hull", 'SOLIDIFY'); s.offset = 1.0; s.material_offset = 1; s.material_offset_rim = 1; s.use_rim = False
        ws = prop_scale * max(src.matrix_basis.to_scale()) if src is not root else prop_scale
        s.thickness = hull_w / max(ws, 1e-6)
        shells.append(o)
    return shells


def blob_mesh(name, seed):
    rnd = random.Random(seed)
    me = bpy.data.meshes.get(name)
    if me: return me
    bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=2, radius=1.0)
    for v in bm.verts: v.co *= 1.0 + 0.12 * (rnd.random() - 0.5)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    return me


# ---------------------------------------------------------------- build
def build(sc, col, root, path, arrive, present, name="APP", **kw):
    P = dict(DEFAULTS); P.update(kw)
    rnd = random.Random(P["seed"])
    for o in [o for o in bpy.data.objects if o.name.startswith(name + "_") or o.name.endswith("_GLOW") and o.parent and
              (o.parent == root or o.parent in root.children_recursive)]:
        bpy.data.objects.remove(o, do_unlink=True)
    clear_anim(root); root.rotation_mode = 'XYZ'; root.hide_render = False; root.hide_viewport = False
    for o in prop_meshes(root): o.hide_render = False; o.hide_viewport = False
    ball, c, lo, hi = hull_ball(name + "_ball", root, P["prop_scale"], P["lump_r"])
    col.objects.link(ball); ball.rotation_mode = 'XYZ'
    ball.data.materials.append(clay_material(name + "_clay", P["clay_hex"], P["edge_hex"], lo.z, hi.z, P["fingerprints"]))
    car = bpy.data.objects.new(name + "_carrier", None); col.objects.link(car); car.rotation_mode = 'XYZ'; car.empty_display_size = 0.3
    ball.parent = car; ball.matrix_parent_inverse.identity(); ball.location = (0, 0, 0)
    root.parent = car; root.matrix_parent_inverse.identity(); root.location = -c; root.rotation_euler = (0, 0, 0)
    M0, M1 = arrive + P["morph"][0], arrive + P["morph"][1]
    C0, C1 = arrive + P["colour"][0], arrive + P["colour"][1]
    G0, G1 = arrive + P["glow"][0], arrive + P["glow"][1]
    # visibility by scale
    key(root, "scale", 1, Vector((0.0,) * 3), 'CONSTANT'); key(root, "scale", C0, Vector((P["prop_scale"],) * 3), 'CONSTANT')
    key(ball, "scale", 1, Vector((1, 1, 1)), 'CONSTANT'); key(ball, "scale", C1 + 1, Vector((0.0,) * 3), 'CONSTANT')
    sk = ball.data.shape_keys.key_blocks["prop"]
    key_sk(sk, 1, 0.0, 'CONSTANT'); key_sk(sk, M0, 0.0); key_sk(sk, M1, 1.0)
    key(ball, '["dissolve"]', 1, -0.05, 'CONSTANT'); key(ball, '["dissolve"]', C0, -0.05); key(ball, '["dissolve"]', C1, 1.05)
    # glow shells
    shells = glow_shells(root, invisible_material(), glow_material(P["glow_hex"]), P["hull_w"], P["prop_scale"])
    for s in shells:
        key(s, '["reveal"]', 1, 0.0, 'CONSTANT'); key(s, '["reveal"]', G0, 0.0, 'LINEAR'); key(s, '["reveal"]', G1, 1.05, 'LINEAR')
    # carrier: source path (caller), then arrive + zero-G float
    rz0 = math.radians(P["prop_rz"])
    first = path[0]
    key(car, "location", 1, first[1], 'CONSTANT'); key(car, "scale", 1, Vector((0.0,) * 3), 'CONSTANT')
    key(car, "rotation_euler", 1, Euler((0, 0, rz0)), 'CONSTANT')
    for f, loc, s in path:
        key(car, "location", f, loc, 'LINEAR'); key(car, "scale", f, Vector(s) if hasattr(s, '__len__') else Vector((s,) * 3), 'LINEAR')
    launch = path[-1][0]
    # brake into the presentation point
    pL = path[-1][1]; n = max(1, arrive - launch)
    s_last = path[-1][2] if not hasattr(path[-1][2], '__len__') else path[-1][2][0]
    d = present - pL
    axis = 0 if abs(d.x) >= max(abs(d.y), abs(d.z)) else (1 if abs(d.y) >= abs(d.z) else 2)
    bump = 0.18 if axis != 2 else 0.0                       # arc only for sideways shots
    for i in range(1, n + 1):
        t = i / n; e = 1 - (1 - t) ** 3; f = launch + i
        key(car, "location", f, pL.lerp(present, e) + Vector((0, 0, bump * math.sin(math.pi * e))), 'LINEAR')
        base = s_last + (1.0 - s_last) * (1 - (1 - t) ** 2)    # grows to full size on the way
        st = 1.0 + 0.2 * (1 - t) ** 2                          # stretched along the flight while fast
        v = [base / math.sqrt(st)] * 3; v[axis] = base * st
        key(car, "scale", f, Vector(v), 'LINEAR')
    w0, winf, tau = P["spin_launch"], 2 * math.pi / P["spin_steady"], P["spin_tau"]
    rz_launch = rz0 + 0.1 * (launch - path[0][0])
    for f in range(path[0][0], P["end"] + 1):
        k = max(0, f - arrive)
        if f < launch:
            rz = rz0 + 0.1 * (f - path[0][0])
        else:
            t = f - launch
            rz = rz_launch + winf * t + (w0 - winf) * tau * (1 - math.exp(-t / tau))
        if f < launch:
            rx, ry = 0.15 * math.sin(f * 0.4), 0.12 * math.cos(f * 0.33)
        else:
            amp = min(1.0, k / 20)
            rx = P["tilt_x"][0] * math.sin(2 * math.pi * k / P["tilt_x"][1] + 0.4) * amp
            ry = P["tilt_y"][0] * math.sin(2 * math.pi * k / P["tilt_y"][1] + 1.3) * amp
        key(car, "rotation_euler", f, Euler((rx, ry, rz)), 'LINEAR')
        if f > arrive:
            key(car, "location", f, present + Vector((0, 0, P["bob"][0] * math.sin(2 * math.pi * k / P["bob"][1]) * min(1, k / 12))), 'LINEAR')
            sq = 0.12 * math.exp(-k / 4.0) * math.cos(k * 1.1)
            key(car, "scale", f, Vector((1 + sq, 1 + sq, 1 - sq)), 'LINEAR')
    # light flash from the item itself
    ld = bpy.data.lights.new(name + "_flash", 'POINT'); ld.color = (1.0, 0.85, 0.6); ld.shadow_soft_size = 0.3
    lo_ = bpy.data.objects.new(name + "_flash", ld); col.objects.link(lo_); lo_.parent = car
    for f, e in ((1, 0.0), (C0 - 2, 0.0), (C0 + 4, P["flash"]), (C1 + 6, P["flash"] * 0.15), (P["end"], P["flash"] * 0.12)):
        ld.energy = e; ld.keyframe_insert("energy", frame=f)
    # crumbs falling off while it reshapes and colours
    cm = bpy.data.materials.get(name + "_crumb") or bpy.data.materials.new(name + "_crumb")
    cm.use_nodes = True; cm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = lin(P["clay_hex"])
    csrc = blob_mesh(name + "_crumb_src", 4)
    if not csrc.materials: csrc.materials.append(cm)
    for i in range(P["crumbs_out"]):
        fs = rnd.randint(M0 + 2, C1 - 2)
        sc.frame_set(fs); cen = car.matrix_world.translation.copy()
        d = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-0.2, 0.8))).normalized()
        sz = rnd.uniform(0.022, 0.04); p1 = cen + d * 0.32
        b = bpy.data.objects.new(f"{name}_crumb_out{i:02d}", csrc); col.objects.link(b)
        for f, loc, s_ in ((1, p1, 0.0), (fs - 0.5, p1, 0.0), (fs, p1, sz), (fs + 4, p1 + d * 0.12, sz * 1.1),
                           (fs + 14, p1 + d * 0.25 + Vector((0, 0, -0.35)), 0.0)):
            key(b, "location", f, loc); key(b, "scale", f, Vector((s_,) * 3))
    return {"carrier": car.name, "ball": ball.name, "item_dims": [round(x, 3) for x in (hi - lo)],
            "morph": (M0, M1), "colour": (C0, C1), "glow": (G0, G1), "shells": [s.name for s in shells]}
