"""KFB #369 follow-up r8: item materializes from its own clay twin straight above the gift box.

Replaces the r7 clay lump. Sequence (frames):
  247-256  clay blobs shoot straight up out of the box mouth and stick to the item's surface
  249-268  item group launches straight up from the box, uniform scale 0.2 -> 1 (proportions kept),
           decelerates, overshoots and settles above the box
  250-257  clay twin (inflated copy of the item mesh, clay material) builds bottom-up as blobs arrive
  259-267  clay twin dissolves top-down with a glowing edge (UFO-lab threshold), real item underneath
  262-272  item glow shell fades in
  248-end  zero-G float: spin decays from launch spin to a slow steady turn, tilt on two axes,
           bob and drift on incommensurate periods
Idempotent: removes GH_PX_* (r7 lump) and GH_CT_* objects before rebuilding.
"""
import bpy, bmesh, math, random
from mathutils import Vector, Euler

SC = "369_GROUND_HANDOVER"
BOX = Vector((-0.85, 0.0, 0.0))
MOUTH_Z = 0.46
ZP = 1.55                       # item centre height above the box
RADIO_MAXDIM = 1.0
LAUNCH = 249
BUILD = (250, 257)
DISS = (259, 267)
HULL = (262, 272)
CLAY_HEX = "#f2b632"
EDGE_HEX = "#fff1b0"
# zero-G float
SPIN_LAUNCH = 0.55              # rad/frame right after the spit
SPIN_STEADY_FRAMES = 200        # frames per turn once settled
SPIN_DRAG_TAU = 6.0             # frames, launch spin decay
TILT_X = (0.28, 97)             # amplitude rad, period frames
TILT_Y = (0.22, 131)
BOB = (0.055, 74)               # amplitude m, period frames
DRIFT = (0.03, 113, 0.025, 151) # x amp, x period, y amp, y period
BLOBS_IN = {"card": 22, "radio": 26}
CRUMBS_OUT = {"card": 16, "radio": 20}

# Optional overrides: data/loot_reveal_params.json in the job folder (same keys as above).
# Lets timing, size and float be retuned later without touching this file.
def _load_params():
    import json, os
    try:
        import kfb369_lib as L
        p = os.path.join(L.JOB, "data", "loot_reveal_params.json")
    except Exception:
        return {}
    if not os.path.exists(p): return {}
    d = json.load(open(p))
    g = globals()
    for k, v in d.items():
        if k in g and not k.startswith("_"):
            g[k] = Vector(v) if k == "BOX" else (tuple(v) if isinstance(v, list) else v)
    return d
_PARAMS = _load_params()


def hex2lin(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c) + (1.0,)


def fcurves(o):
    ad = o.animation_data
    if not ad or not ad.action: return []
    out = []
    for l in ad.action.layers:
        for s in l.strips:
            for cb in s.channelbags:
                out += [(fc, cb) for fc in cb.fcurves]
    return out


def clear_path(o, path):
    for fc, cb in fcurves(o):
        if fc.data_path == path: cb.fcurves.remove(fc)


def key(o, path, frame, value, interp='BEZIER'):
    if path.startswith('['): o[path[2:-2]] = value
    else: setattr(o, path, value)
    o.keyframe_insert(path, frame=frame)
    for fc, cb in fcurves(o):
        if fc.data_path == path:
            for k in fc.keyframe_points:
                if abs(k.co.x - frame) < 0.01: k.interpolation = interp


def twin_mat():
    m = bpy.data.materials.get("GH_CT_clay") or bpy.data.materials.new("GH_CT_clay")
    m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); N = nt.nodes; Lk = nt.links.new
    out = N.new('ShaderNodeOutputMaterial')
    tc = N.new('ShaderNodeTexCoord'); sep = N.new('ShaderNodeSeparateXYZ'); Lk(tc.outputs['Generated'], sep.inputs[0])
    def attr(n):
        a = N.new('ShaderNodeAttribute'); a.attribute_type = 'OBJECT'; a.attribute_name = n; return a.outputs['Fac']
    noi = N.new('ShaderNodeTexNoise'); noi.inputs['Scale'].default_value = 6.0; noi.inputs['Detail'].default_value = 3.0
    Lk(tc.outputs['Object'], noi.inputs['Vector'])
    def M(op, a, b=None):
        n = N.new('ShaderNodeMath'); n.operation = op
        for i, v in enumerate((a, b)):
            if v is None: continue
            if isinstance(v, (int, float)): n.inputs[i].default_value = v
            else: Lk(v, n.inputs[i])
        return n.outputs[0]
    hz = sep.outputs['Z']; nf = noi.outputs['Fac']
    dx = M('SUBTRACT', sep.outputs['X'], 0.5); dy = M('SUBTRACT', sep.outputs['Y'], 0.5)
    r = M('MINIMUM', M('MULTIPLY', M('SQRT', M('ADD', M('MULTIPLY', dx, dx), M('MULTIPLY', dy, dy))), 2.0), 1.0)
    bt = M('ADD', M('MULTIPLY', hz, 0.7), M('MULTIPLY', nf, 0.3))                     # build: bottom first
    bdiff = M('SUBTRACT', attr('build'), bt)
    dt = M('ADD', M('ADD', M('MULTIPLY', M('SUBTRACT', 1.0, hz), 0.6), M('MULTIPLY', M('SUBTRACT', 1.0, r), 0.12)),
           M('MULTIPLY', nf, 0.28))                                                   # dissolve: top first
    ddiff = M('SUBTRACT', dt, attr('dissolve'))
    alpha = M('MULTIPLY', M('GREATER_THAN', bdiff, 0.0), M('GREATER_THAN', ddiff, 0.0))
    edge = M('MULTIPLY', M('MAXIMUM', M('LESS_THAN', bdiff, 0.06), M('LESS_THAN', ddiff, 0.06)), alpha)
    b = N.new('ShaderNodeBsdfPrincipled')
    b.inputs['Base Color'].default_value = hex2lin(CLAY_HEX); b.inputs['Roughness'].default_value = 0.72
    b.inputs['Emission Color'].default_value = hex2lin(EDGE_HEX)
    Lk(M('MULTIPLY', edge, 9.0), b.inputs['Emission Strength'])
    bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.3
    n2 = N.new('ShaderNodeTexNoise'); n2.inputs['Scale'].default_value = 24.0
    Lk(tc.outputs['Object'], n2.inputs['Vector']); Lk(n2.outputs['Fac'], bump.inputs['Height']); Lk(bump.outputs['Normal'], b.inputs['Normal'])
    tr = N.new('ShaderNodeBsdfTransparent'); mix = N.new('ShaderNodeMixShader')
    Lk(alpha, mix.inputs['Fac']); Lk(tr.outputs[0], mix.inputs[1]); Lk(b.outputs[0], mix.inputs[2]); Lk(mix.outputs[0], out.inputs['Surface'])
    try: m.surface_render_method = 'DITHERED'
    except Exception: pass
    return m


def frag_mat():
    m = bpy.data.materials.get("GH_PX_clay_frag") or bpy.data.materials.new("GH_PX_clay_frag")
    m.use_nodes = True; b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = hex2lin(CLAY_HEX); b.inputs['Roughness'].default_value = 0.72
    b.inputs['Emission Color'].default_value = hex2lin(EDGE_HEX); b.inputs['Emission Strength'].default_value = 1.6
    return m


def blob_mesh(rnd):
    me = bpy.data.meshes.get("GH_CT_blob_src")
    if me: return me
    bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=2, radius=1.0)
    for v in bm.verts: v.co *= 1.0 + 0.15 * (rnd.random() - 0.5)
    me = bpy.data.meshes.new("GH_CT_blob_src"); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    me.materials.append(frag_mat()); return me


def run():
    sc = bpy.data.scenes[SC]; bpy.context.window.scene = sc
    rnd = random.Random(3698)
    for o in [o for o in bpy.data.objects if o.name.startswith(("GH_PX_", "GH_CT_"))]:
        bpy.data.objects.remove(o, do_unlink=True)
    pivot = bpy.data.objects["GH_loot_pivot"]; spin = bpy.data.objects["GH_loot_spin"]
    card_root = bpy.data.objects["GH_card_root"]; radio_root = bpy.data.objects["GH_radio_root"]
    rep = {}
    # --- float carrier between pivot and both items
    fl = bpy.data.objects.get("GH_float")
    if not fl:
        fl = bpy.data.objects.new("GH_float", None); sc.collection.objects.link(fl)
    fl.parent = pivot; fl.location = (0, 0, 0); fl.rotation_mode = 'XYZ'; fl.empty_display_size = 0.25
    for o in (card_root, spin):
        clear_path(o, "rotation_euler"); o.parent = fl; o.matrix_parent_inverse.identity()
        o.location = (0, 0, 0); o.rotation_euler = (0, 0, 0)
    # --- radio scale: max dimension RADIO_MAXDIM in world
    rm = [c for c in radio_root.children_recursive if c.type == 'MESH' and not c.name.endswith("_HULL")]
    sc.frame_set(1); dg = bpy.context.evaluated_depsgraph_get(); inv = radio_root.matrix_world.inverted()
    lo = Vector((1e9,) * 3); hi = -lo
    for o in rm:
        e = o.evaluated_get(dg)
        for v in e.data.vertices:
            q = inv @ (e.matrix_world @ v.co); lo = Vector(map(min, lo, q)); hi = Vector(map(max, hi, q))
    radio_root.scale = Vector((1, 1, 1)) * (RADIO_MAXDIM / max(hi - lo))
    rep["radio_root_scale"] = round(radio_root.scale.x, 3)
    # --- launch straight up out of the box, uniform scale only
    for p in ("location", "scale"): clear_path(pivot, p)
    P = lambda z: Vector((BOX.x, BOX.y, z))
    seq = [(LAUNCH - 1, MOUTH_Z - 0.1, 0.001), (LAUNCH, MOUTH_Z, 0.2), (LAUNCH + 3, 1.05, 0.62),
           (LAUNCH + 6, 1.52, 0.92), (LAUNCH + 9, 1.76, 1.06), (LAUNCH + 13, 1.66, 0.97),
           (LAUNCH + 17, 1.58, 1.02), (LAUNCH + 21, ZP, 1.0)]
    for f, z, s in seq:
        key(pivot, "location", f, P(z)); key(pivot, "scale", f, Vector((s, s, s)))
    key(pivot, "location", 1, P(MOUTH_Z - 0.1), 'CONSTANT'); key(pivot, "scale", 1, Vector((0.001,) * 3), 'CONSTANT')
    for f in range(LAUNCH + 24, sc.frame_end + 1, 6):           # zero-G bob and drift
        t = f - (LAUNCH + 21)
        key(pivot, "location", f, Vector((BOX.x + DRIFT[0] * math.sin(2 * math.pi * t / DRIFT[1]),
                                         BOX.y + DRIFT[2] * math.sin(2 * math.pi * t / DRIFT[3] + 1.1),
                                         ZP + BOB[0] * math.sin(2 * math.pi * t / BOB[1]))))
    # --- zero-G rotation: decaying launch spin to steady turn, two tilt axes
    clear_path(fl, "rotation_euler")
    w0, winf, tau = SPIN_LAUNCH, 2 * math.pi / SPIN_STEADY_FRAMES, SPIN_DRAG_TAU
    key(fl, "rotation_euler", 1, Euler((0, 0, 0)), 'CONSTANT')
    for f in range(LAUNCH - 1, sc.frame_end + 1):
        t = max(0, f - LAUNCH)
        rz = winf * t + (w0 - winf) * tau * (1 - math.exp(-t / tau))
        kick = math.exp(-t / 10.0)
        rx = TILT_X[0] * math.sin(2 * math.pi * t / TILT_X[1] + 0.4) + 0.35 * kick * math.sin(t * 0.9)
        ry = TILT_Y[0] * math.sin(2 * math.pi * t / TILT_Y[1] + 1.3) + 0.25 * kick * math.cos(t * 0.8)
        key(fl, "rotation_euler", f, Euler((rx, ry, rz)), 'LINEAR')
    # --- reveal keys on the real items and glow shells
    for col in ("GH_LOOT_card", "GH_LOOT_radio"):
        for o in bpy.data.collections[col].all_objects:
            if o.type != 'MESH' or "reveal" not in o.keys(): continue
            clear_path(o, '["reveal"]')
            if o.name.endswith("_HULL"):
                key(o, '["reveal"]', HULL[0], 0.0, 'LINEAR'); key(o, '["reveal"]', HULL[1], 1.05, 'LINEAR')
            else:
                key(o, '["reveal"]', DISS[0] - 1, 0.0, 'CONSTANT'); key(o, '["reveal"]', DISS[0], 1.05, 'CONSTANT')
    # --- clay twins
    tm = twin_mat(); bsrc = blob_mesh(rnd)
    items = {"card": ([bpy.data.objects["GH_card"]], "GH_LOOT_card"),
             "radio": (rm, "GH_LOOT_radio")}
    for tag, (meshes, colname) in items.items():
        col = bpy.data.collections[colname]; twins = []
        for src in meshes:
            tw = bpy.data.objects.new("GH_CT_" + src.name, src.data); col.objects.link(tw)
            tw.parent = src; tw.matrix_parent_inverse.identity()
            for s in tw.material_slots: s.link = 'OBJECT'; s.material = tm
            ws = max((pivot.matrix_world.inverted() @ src.matrix_world).to_scale())
            d = tw.modifiers.new("inflate", 'DISPLACE'); d.strength = 0.012 / ws; d.mid_level = 0.0
            key(tw, '["build"]', 1, 0.0, 'CONSTANT'); key(tw, '["build"]', BUILD[0], 0.0); key(tw, '["build"]', BUILD[1], 1.05)
            key(tw, '["dissolve"]', 1, -0.05, 'CONSTANT'); key(tw, '["dissolve"]', DISS[0], -0.05); key(tw, '["dissolve"]', DISS[1], 1.05)
            twins.append(tw)
        # inbound blobs: straight up out of the box mouth, absorbed on the twin surface
        nb = BLOBS_IN.get(tag, 22); byf = {}
        for i in range(nb):
            fa = rnd.randint(BUILD[0] + 1, BUILD[1]); byf.setdefault(fa, []).append(i)
        targets = {}
        for fa, ids in byf.items():
            sc.frame_set(fa); dg = bpy.context.evaluated_depsgraph_get()
            pts = []
            for tw in twins:
                e = tw.evaluated_get(dg); mw = e.matrix_world
                pts += [mw @ v.co for v in e.data.vertices]
            for i in ids: targets[i] = (fa, rnd.choice(pts))
        for i, (fa, tp) in targets.items():
            fl0 = fa - rnd.randint(3, 5)
            sp = Vector((BOX.x + rnd.uniform(-0.12, 0.12), BOX.y + rnd.uniform(-0.12, 0.12), MOUTH_Z))
            mid = sp.lerp(tp, 0.55) + Vector((rnd.uniform(-0.06, 0.06), rnd.uniform(-0.06, 0.06), 0.08))
            sz = rnd.uniform(0.035, 0.065)
            b = bpy.data.objects.new(f"GH_CT_{tag}_in{i:02d}", bsrc); col.objects.link(b)
            for f, loc, s, ip in ((1, sp, 0.0, 'CONSTANT'), (fl0 - 0.5, sp, 0.0, 'CONSTANT'), (fl0, sp, sz, 'BEZIER'),
                                  ((fl0 + fa) / 2, mid, sz * 1.15, 'BEZIER'), (fa, tp, sz * 0.7, 'CONSTANT'),
                                  (fa + 1, tp, 0.0, 'CONSTANT')):
                key(b, "location", f, loc, ip); key(b, "scale", f, Vector((s, s, s)), ip)
        # outbound crumbs during the dissolve
        no = CRUMBS_OUT.get(tag, 16); byf = {}
        for i in range(no):
            fs = rnd.randint(DISS[0], DISS[1] - 1); byf.setdefault(fs, []).append(i)
        for fs, ids in byf.items():
            sc.frame_set(fs); dg = bpy.context.evaluated_depsgraph_get(); polys = []
            for tw in twins:
                e = tw.evaluated_get(dg); mw = e.matrix_world; n3 = mw.to_3x3()
                polys += [(mw @ p.center, (n3 @ p.normal).normalized(), p.area) for p in e.data.polygons]
            tot = sum(a for *_, a in polys)
            for i in ids:
                r = rnd.random() * tot; acc = 0
                for c, nn, a in polys:
                    acc += a
                    if acc >= r: break
                sz = rnd.uniform(0.025, 0.05); d1 = rnd.uniform(0.07, 0.14)
                fo = bpy.data.objects.new(f"GH_CT_{tag}_out{i:02d}", bsrc); col.objects.link(fo)
                for f, loc, s, ip in ((1, c, 0.0, 'CONSTANT'), (fs - 0.5, c, 0.0, 'CONSTANT'), (fs, c, sz * 0.6, 'BEZIER'),
                                      (fs + 3, c + nn * d1, sz * 1.15, 'BEZIER'),
                                      (fs + 12, c + nn * (d1 + 0.2) + Vector((0, 0, -0.14)), 0.0, 'BEZIER')):
                    key(fo, "location", f, loc, ip); key(fo, "scale", f, Vector((s, s, s)), ip)
        rep[tag] = {"twins": [t.name for t in twins], "blobs_in": nb, "crumbs_out": no}
    sc.frame_set(290)
    return rep


result = run()
