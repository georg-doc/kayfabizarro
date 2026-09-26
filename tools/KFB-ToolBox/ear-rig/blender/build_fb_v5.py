"""FB_TEMPLATE_LOOK_v5 · base model for the Frankenstein Studio.
v5 (Georg 25.09.): bigger ears, slimmer base with a fillet foot that lies on the head, unit ear module for the ear-rig editor.
v4: pear head baked in, rebuilt as a clean smoothed sphere mesh (no template ripples);
cartoon leaf ears: wide rounded top, tapering base, rounded rim tube all round, recessed inner dish, bellied back;
standalone ear module GLB (own mini rig) next to the combined model;
3 bones per ear for the runtime spring; face parts optional (hidden by default).
Run on FB_TEMPLATE_LOOK_v1.blend (fresh open). Saves only NEW files (v1/v2 untouched).
exec(open(<FB_GRAFT>/_v5/build_fb_v5.py).read())"""
import bpy, bmesh, math, os, json
from mathutils import Vector
from mathutils.bvhtree import BVHTree

import os as _os
BASE = globals().get('FB_BASE', _os.environ.get('FB_GRAFT', '') )   # folder holding FB_TEMPLATE_LOOK_v1.blend (Georg's Dropbox: 3D ASSETS/BLENDER MCP/FB_GRAFT/), trailing slash
P = dict(ear_len=0.86, ear_width=0.37, ear_base_w=0.058, ear_max_at=0.52, tip_exp=1.8, ear_centre=0.5, rim_r=0.042, rim_slope=0.035,
         recess=0.024, back_t=0.11, bow_back=0.07, tip_fwd=0.05, root_flare=0.45, foot=0.0, foot_h=0.09, seat=False, leaf_cup=0.03, ear_x=0.16, ear_tilt_deg=19.0, ear_back_deg=4.0,
         neck=0.18, ear_smooth=6, lat=56, lon=112, smooth=14)
P.update(globals().get('FB_P', {}))
rig = bpy.data.objects['Rig']
head = bpy.data.objects['CharacterTemplate_Head']
yellow = bpy.data.materials['FB_Yellow']
look = bpy.data.collections['FB_LOOK']


def ss(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def ctx(obj):
    return bpy.context.temp_override(active_object=obj, object=obj, selected_objects=[obj],
                                     selected_editable_objects=[obj])


# ------------------------------------------------------------------ 1 head: pear (full) baked in, then rounded
me = head.data
zs = [v.co.z for v in me.vertices]
Z0, Z1 = min(zs), max(zs)
H = Z1 - Z0


def pear(p):
    t = (p.z - Z0) / H
    f = 1.0 - 0.26 * ss(0.45, 1.0, t) + 0.13 * math.exp(-((t - 0.26) / 0.14) ** 2)
    return Vector((p.x * (f - 1.0), p.y * (f - 1.0) * 0.55, -0.03 * ss(0.7, 1.0, t) * H))


if me.shape_keys:
    head.shape_key_clear()
for v in me.vertices:
    v.co = v.co + pear(v.co)
me.update()


def bbox(o):
    xs = [v.co for v in o.data.vertices]
    return (Vector((min(p.x for p in xs), min(p.y for p in xs), min(p.z for p in xs))),
            Vector((max(p.x for p in xs), max(p.y for p in xs), max(p.z for p in xs))))


b0 = bbox(head)
# Rebuild the head as a clean sphere-topology mesh: sample the pear-shaped template surface from the head centre,
# smooth the radius field (kills the ripples the 234-vert template topology left behind), rescale to the same size.
import numpy as np
bmh = bmesh.new()
bmh.from_mesh(head.data)
htree = BVHTree.FromBMesh(bmh)
C = (b0[0] + b0[1]) / 2
NLAT, NLON = P['lat'], P['lon']
R = np.zeros((NLAT, NLON))
dirs = {}
for i in range(NLAT):
    ph = math.pi * (i + 0.5) / NLAT
    for j in range(NLON):
        th = 2 * math.pi * j / NLON
        d = Vector((math.sin(ph) * math.cos(th), math.sin(ph) * math.sin(th), math.cos(ph)))
        dirs[i, j] = d
        hit = htree.ray_cast(C, d)
        R[i, j] = (hit[0] - C).length if hit[0] else np.nan
bmh.free()
R = np.where(np.isnan(R), np.nanmean(R), R)
for _ in range(P['smooth']):
    lon = (np.roll(R, 1, 1) + np.roll(R, -1, 1)) * 0.5
    up = np.vstack([R[:1], R[:-1]]); dn = np.vstack([R[1:], R[-1:]])
    lat = (up + dn) * 0.5
    R = 0.5 * R + 0.25 * lon + 0.25 * lat
verts = [tuple(C + dirs[i, j] * R[i, j]) for i in range(NLAT) for j in range(NLON)]
verts.append(tuple(C + Vector((0, 0, 1)) * float(R[0].mean())))
verts.append(tuple(C + Vector((0, 0, -1)) * float(R[-1].mean())))
top, bot = len(verts) - 2, len(verts) - 1
faces = []
for i in range(NLAT - 1):
    for j in range(NLON):
        a_, b_ = i * NLON + j, i * NLON + (j + 1) % NLON
        faces.append((a_, a_ + NLON, b_ + NLON, b_))
for j in range(NLON):
    faces.append((top, j, (j + 1) % NLON))
    o_ = (NLAT - 1) * NLON
    faces.append((bot, o_ + (j + 1) % NLON, o_ + j))
old_me = head.data
nm = bpy.data.meshes.new('FB_Head_v4')
nm.from_pydata(verts, [], faces)
nm.validate()
for m_ in old_me.materials:
    nm.materials.append(m_)
for p in nm.polygons:
    p.use_smooth = True
if nm.polygons and nm.polygons[0].normal.dot(Vector(nm.polygons[0].center) - C) < 0:
    nm.flip_normals()
head.data = nm
b1 = bbox(head)
c1 = (b1[0] + b1[1]) / 2
sc = Vector([(b0[1][k] - b0[0][k]) / max(1e-6, (b1[1][k] - b1[0][k])) for k in range(3)])
for v in nm.vertices:
    d = v.co - c1
    v.co = C + Vector((d.x * sc.x, d.y * sc.y, d.z * sc.z))
nm.update()
(head.vertex_groups.get('head') or head.vertex_groups.new(name='head')).add(list(range(len(nm.vertices))), 1.0, 'REPLACE')

# ------------------------------------------------------------------ 2 face parts follow the pear, stay optional
face = ['FB_Eye_L', 'FB_Eye_R', 'Carl_Brow_L', 'Carl_Brow_R', 'Carl_Nose', 'FB_Mouth_Smile']
for name in face:
    o = bpy.data.objects.get(name)
    if not o:
        continue
    mw = o.matrix_world
    pts = [mw @ v.co for v in o.data.vertices]
    c = sum(pts, Vector()) / len(pts)
    d_local = mw.inverted().to_3x3() @ pear(c)
    for v in o.data.vertices:
        v.co = v.co + d_local
    o['kfb_optional_face'] = True
    o['kfb_default_visible'] = False

# ------------------------------------------------------------------ 3 ears: straight, bellied, cupped, closer together
arc = bpy.data.collections.get('FB_LOOK_v1_parts') or bpy.data.collections.new('FB_LOOK_v1_parts')
if arc.name not in bpy.context.scene.collection.children:
    bpy.context.scene.collection.children.link(arc)
arc.hide_render = arc.hide_viewport = True
for n in ('FB_Ear_L', 'FB_Ear_R'):
    o = bpy.data.objects.get(n)
    if o and look in o.users_collection:
        look.objects.unlink(o)
        arc.objects.link(o)

dg = bpy.context.evaluated_depsgraph_get()
bm = bmesh.new()
bm.from_mesh(head.data)
bm.transform(head.matrix_world)
tree = BVHTree.FromBMesh(bm)
tilt, back = math.radians(P['ear_tilt_deg']), math.radians(P['ear_back_deg'])
AX = Vector((math.sin(tilt), math.sin(back), math.cos(tilt) * math.cos(back))).normalized()
WX = Vector((1, 0, 0)) - AX * AX.x
WX.normalize()
DX = AX.cross(WX).normalized()                        # front/back direction of the ear
if DX.y < 0:
    DX = -DX                                          # +DX = back
hit = tree.ray_cast(Vector((P['ear_x'], 0.02, 5.0)), Vector((0, 0, -1)))
SURF = hit[0] if hit[0] else Vector((P['ear_x'], 0.02, Z1))
L_VIS, NECK = P['ear_len'], P['neck']
L_TOT = L_VIS + NECK
U_SURF = NECK / L_TOT
START_L = SURF - AX * NECK


# Leaf outline in the ear plane: x across (half-width), y along the ear from its buried base (y=0).
def half_width(y):
    """v3 leaf silhouette: narrow base, belly slightly above the middle, top a little slimmer."""
    if y < 0 or y > L_TOT:
        return 0.0
    W = P['ear_width'] / 2
    v = (y - NECK) / L_VIS                       # 0 at the head surface, 1 at the tip
    if v <= 0:
        return P['ear_base_w']
    if v <= P['ear_max_at']:
        return P['ear_base_w'] + (W - P['ear_base_w']) * ss(0.0, P['ear_max_at'], v)
    k = (v - P['ear_max_at']) / (1 - P['ear_max_at'])
    return W * math.sqrt(max(0.0, 1 - k ** P['tip_exp']))


def outline_pts(n=720):
    """Closed outline polygon (x, y), used for the distance field and for the radial mesh."""
    ys = np.linspace(0, L_TOT, n // 2)
    right = [(half_width(y), y) for y in ys]
    left = [(-x, y) for x, y in reversed(right)]
    return np.array(right + left)


OUT = outline_pts()
SEG_A, SEG_B = OUT, np.roll(OUT, -1, axis=0)


def sdf_inside(P2):
    """Distance from each point (N,2) to the outline (points assumed inside)."""
    ab = SEG_B - SEG_A
    ap = P2[:, None, :] - SEG_A[None, :, :]
    t = np.clip((ap * ab[None]).sum(-1) / np.maximum((ab * ab).sum(-1), 1e-12)[None], 0, 1)
    q = SEG_A[None] + t[..., None] * ab[None]
    return np.sqrt(((P2[:, None, :] - q) ** 2).sum(-1)).min(1)


def boundary_dist(cx, cy, dx_, dy_):
    lo, hi = 0.0, 2.0
    for _ in range(40):
        m = (lo + hi) / 2
        x, y = cx + dx_ * m, cy + dy_ * m
        if 0 <= y <= L_TOT and abs(x) <= half_width(y):
            lo = m
        else:
            hi = m
    return lo


def depth(s_, x, front):
    """Depth along the ear normal (+ = back) from the distance s_ to the outline.
    Front: rounded rim tube + shallow inner dish. Back: one full convex dome that follows the inner shape."""
    r, w, rec = P['rim_r'], P['rim_slope'], P['recess']
    W = P['ear_width'] / 2
    cup = -P['leaf_cup'] * (x / W) ** 2
    if front:
        if s_ < r:
            return cup - math.sqrt(max(0.0, r * r - (r - s_) ** 2))
        return cup - r + rec * ss(r, r + w, s_)
    q = min(s_ / W, 1.0)                                   # 0 at the outline, 1 at the widest centre
    return cup + P['back_t'] * math.sqrt(max(0.0, 1 - (1 - q) ** 2)) ** 0.8


def bow(y):
    """Side-view S-curve: the ear swings back from the head, the tip curls slightly forward (+ = back)."""
    v = max(0.0, (y - NECK) / L_VIS)
    return P['bow_back'] * math.sin(math.pi * v * 0.9) - P['tip_fwd'] * v ** 3


def root_mul(y):
    """Thicker, rounder root so the ear grows out of the head instead of being plugged in."""
    return 1.0 + P['root_flare'] * math.exp(-((y - NECK) / 0.09) ** 2)


NA, NK = 160, 36
EAR_LY = {}


def foot_mul(y):
    """Widening towards the head so the base reads as a fillet, not a plugged-in stick."""
    return 1.0 + P['foot'] * ss(NECK + P['foot_h'], NECK - 0.05, y) ** 1.5


def build_ear(side, frame=None, name=None, coll=None):
    sgn = 1 if side == 'L' else -1
    if frame:
        start, ax, wx, dx = frame
    else:
        start = Vector((START_L.x * sgn, START_L.y, START_L.z))
        ax = Vector((AX.x * sgn, AX.y, AX.z))
        wx = Vector((WX.x * sgn, WX.y, WX.z))
        dx = Vector((DX.x * sgn, DX.y, DX.z))
    cy = P['ear_centre'] * L_TOT
    ks = [1 - (1 - q) ** 2.2 for q in np.linspace(0, 1, NK + 1)[1:]]     # dense near the rim
    pts2, idx = [], {}
    for j in range(NA):
        a_ = 2 * math.pi * j / NA
        dx_, dy_ = math.sin(a_), math.cos(a_)
        L_ = boundary_dist(0.0, cy, dx_, dy_)
        for ki, k in enumerate(ks):
            pts2.append((dx_ * L_ * k, cy + dy_ * L_ * k))
    pts2 = np.array(pts2)
    sd = sdf_inside(pts2)
    verts, uvals, lys = [], [], []

    def put(x, y, d):
        e = foot_mul(y)
        verts.append(start + ax * y + wx * (x * e) + dx * (d * root_mul(y) * e + bow(y)))
        uvals.append(y / L_TOT)
        lys.append(y)
        return len(verts) - 1

    grid = {}
    for side_f in (True, False):
        for j in range(NA):
            for ki in range(NK):
                n = j * NK + ki
                x, y = pts2[n]
                if ki == NK - 1:                                    # shared outline ring
                    key = ('o', j)
                    if key not in grid:
                        grid[key] = put(x, y, depth(0.0, x, True))
                    grid[(side_f, j, ki)] = grid[key]
                else:
                    grid[(side_f, j, ki)] = put(x, y, depth(float(sd[n]), x, side_f))
    cf = put(0.0, cy, depth(1.0, 0.0, True))
    cb = put(0.0, cy, depth(1.0, 0.0, False))
    faces = []
    for side_f, cen in ((True, cf), (False, cb)):
        for j in range(NA):
            j2 = (j + 1) % NA
            f = (cen, grid[(side_f, j, 0)], grid[(side_f, j2, 0)])
            faces.append(f)
            for ki in range(NK - 1):
                q = (grid[(side_f, j, ki)], grid[(side_f, j, ki + 1)], grid[(side_f, j2, ki + 1)], grid[(side_f, j2, ki)])
                faces.append(q)
    name = name or f'FB_Ear_{side}_v5'
    for old in (name, f'FB_Ear_{side}_v2', f'FB_Ear_{side}_v3', f'FB_Ear_{side}_v4'):
        if bpy.data.objects.get(old):
            bpy.data.objects.remove(bpy.data.objects[old], do_unlink=True)
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], faces)
    me.validate()
    bm_ = bmesh.new()
    bm_.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm_, faces=bm_.faces)
    for _ in range(P['ear_smooth']):                 # evens out the radial-grid steps on the rim slope
        bmesh.ops.smooth_vert(bm_, verts=bm_.verts, factor=0.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)
    bm_.to_mesh(me)
    bm_.free()
    me.materials.append(yellow)
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    (coll or look).objects.link(ob)
    ob['kfb_part'] = 'ear'
    EAR_LY[name] = lys
    return ob, start, ax, uvals


SEGS = ((U_SURF, 0.44), (0.44, 0.72), (0.72, 0.99))
rig.hide_set(False)
rig.hide_viewport = False
built = {}
for side in ('L', 'R'):
    built[side] = build_ear(side)


def seat_on_head(ob):
    """Fillet foot: everything of the ear base that would sit inside the head is laid onto the head surface,
    the band just above it is relaxed so ear and head meet in a soft curve."""
    ly = EAR_LY[ob.name]
    me_ = ob.data
    lo, hi = NECK - 0.03, NECK + 0.03
    for _ in range(3):
        for v, y in zip(me_.vertices, ly):
            if y > hi or y < lo:
                continue                                  # deeper parts stay hidden inside the head
            loc, n, _i, _d = tree.find_nearest(v.co)
            if loc is None:
                continue
            inside = (v.co - loc).dot(n) < 0
            w = 1.0 if inside else ss(hi, lo, y) * 0.6
            if w > 0:
                v.co = v.co.lerp(loc + n * 0.004, w)
        bm_ = bmesh.new()
        bm_.from_mesh(me_)
        bm_.verts.ensure_lookup_table()
        band = [bm_.verts[i] for i, y in enumerate(ly) if lo - 0.05 < y < NECK + 0.16]
        bmesh.ops.smooth_vert(bm_, verts=band, factor=0.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)
        bm_.to_mesh(me_)
        bm_.free()
    for v, y in zip(me_.vertices, ly):          # nothing may end up inside the head after relaxing
        if y > NECK + 0.2 or y < lo:
            continue
        loc, n, _i, _d = tree.find_nearest(v.co)
        if loc is not None and (v.co - loc).dot(n) < 0.002:
            v.co = loc + n * 0.004
    me_.update()


for side in ('L', 'R'):
    if P['seat']:
        seat_on_head(built[side][0])
bpy.context.view_layer.objects.active = rig
with ctx(rig):
    bpy.ops.object.mode_set(mode='EDIT')
    eb = rig.data.edit_bones
    for side in ('L', 'R'):
        ob, start, ax, uv = built[side]
        sg = 1 if side == 'L' else -1
        dx_s = Vector((DX.x * sg, DX.y, DX.z))
        prev = eb['head']
        for k, (u0, u1) in enumerate(SEGS, 1):
            nm = f'ear.{side.lower()}.{k}'
            b = eb.get(nm) or eb.new(nm)
            b.head = start + ax * (u0 * L_TOT) + dx_s * bow(u0 * L_TOT)
            b.tail = start + ax * (u1 * L_TOT) + dx_s * bow(u1 * L_TOT)
            b.roll = 0.0
            b.parent = prev
            b.use_connect = k > 1
            b.use_deform = True
            prev = b
    bpy.ops.object.mode_set(mode='OBJECT')

for side in ('L', 'R'):
    ob, start, ax, uv = built[side]
    sl = side.lower()
    groups = {n: ob.vertex_groups.new(name=n) for n in ['head', f'ear.{sl}.1', f'ear.{sl}.2', f'ear.{sl}.3']}
    cen = [(u0 + u1) / 2 for u0, u1 in SEGS]
    for vi, u in enumerate(uv):
        if u <= U_SURF:
            wts = {'head': 1.0}
        elif u < cen[0]:
            k = ss(U_SURF, cen[0], u)
            wts = {'head': 1 - k, f'ear.{sl}.1': k}
        elif u < cen[1]:
            k = (u - cen[0]) / (cen[1] - cen[0])
            wts = {f'ear.{sl}.1': 1 - k, f'ear.{sl}.2': k}
        elif u < cen[2]:
            k = (u - cen[1]) / (cen[2] - cen[1])
            wts = {f'ear.{sl}.2': 1 - k, f'ear.{sl}.3': k}
        else:
            wts = {f'ear.{sl}.3': 1.0}
        for n, w in wts.items():
            if w > 1e-4:
                groups[n].add([vi], w, 'REPLACE')
    ob.parent = rig
    m = ob.modifiers.new('Armature', 'ARMATURE')
    m.object = rig

rig['kfb_ear_spring'] = json.dumps(dict(
    bones={'L': ['ear.l.1', 'ear.l.2', 'ear.l.3'], 'R': ['ear.r.1', 'ear.r.2', 'ear.r.3']},
    start=dict(stiffness=[60, 38, 24], damping=[7, 5, 3.5], gravity=0.35, maxAngleDeg=[35, 55, 70],
               windPerMs=0.012, windNoiseHz=7.0),
    rest='straight up (tilt %.0f deg out, %.0f deg back)' % (P['ear_tilt_deg'], P['ear_back_deg']),
    note='Secondary motion at runtime; one shared spring system with the nose dangle.'))
head['kfb_head_shape'] = 'pear 1.0 baked, resampled sphere %dx%d, smoothed %d (size kept)' % (P['lat'], P['lon'], P['smooth'])

# ------------------------------------------------------------------ 4 export + save (new files only)
out = BASE + '_v5/'
os.makedirs(out, exist_ok=True)
for o in bpy.context.view_layer.objects:
    o.select_set(False)
keep = ['Rig'] + [o.name for o in bpy.data.collections['TEMPLATE'].objects
                  if o.type == 'MESH' and o.name.startswith('CharacterTemplate')] + [o.name for o in look.objects]
for n in keep:
    o = bpy.data.objects[n]
    o.hide_set(False)
    o.hide_viewport = False
    o.select_set(True)
glb = out + 'FB_TEMPLATE_LOOK_v5.glb'
bpy.ops.export_scene.gltf(filepath=glb, export_format='GLB', use_selection=True, export_apply=False,
                          export_morph=True, export_skins=True, export_animations=False, export_extras=True,
                          export_yup=True)
# ------------------------------------------------------------------ 5 unit ear module for the ear-rig editor
# One left ear in its own frame: base on the surface at the origin, up = +Z, back = +Y (glTF: up +Y, front +Z).
# The editor mirrors it for the right ear and places both freely on any head. Generic foot (no head fit baked in).
mc = bpy.data.collections.get('FB_EAR_MODULE') or bpy.data.collections.new('FB_EAR_MODULE')
if mc.name not in bpy.context.scene.collection.children:
    bpy.context.scene.collection.children.link(mc)
for o in list(mc.objects):
    bpy.data.objects.remove(o, do_unlink=True)
fr = (Vector((0, 0, -NECK)), Vector((0, 0, 1)), Vector((1, 0, 0)), Vector((0, 1, 0)))
uob, _s, _a, uuv = build_ear('L', frame=fr, name='FB_EarUnit', coll=mc)
ad = bpy.data.armatures.new('FB_EarUnitRig')
arm = bpy.data.objects.new('FB_EarUnitRig', ad)
mc.objects.link(arm)
bpy.context.view_layer.objects.active = arm
with ctx(arm):
    bpy.ops.object.mode_set(mode='EDIT')
    e = ad.edit_bones
    root = e.new('ear_root')
    root.head, root.tail = Vector((0, 0, -NECK)), Vector((0, 0, 0))
    prev = root
    for k, (u0, u1) in enumerate(SEGS, 1):
        b = e.new(f'ear.{k}')
        b.head = fr[0] + fr[1] * (u0 * L_TOT) + fr[3] * bow(u0 * L_TOT)
        b.tail = fr[0] + fr[1] * (u1 * L_TOT) + fr[3] * bow(u1 * L_TOT)
        b.parent = prev
        b.use_connect = k > 1
        prev = b
    bpy.ops.object.mode_set(mode='OBJECT')
g_ = {n: uob.vertex_groups.new(name=n) for n in ['ear_root', 'ear.1', 'ear.2', 'ear.3']}
cen = [(u0 + u1) / 2 for u0, u1 in SEGS]
for vi, u in enumerate(uuv):
    if u <= U_SURF:
        wts = {'ear_root': 1.0}
    elif u < cen[0]:
        k = ss(U_SURF, cen[0], u); wts = {'ear_root': 1 - k, 'ear.1': k}
    elif u < cen[1]:
        k = (u - cen[0]) / (cen[1] - cen[0]); wts = {'ear.1': 1 - k, 'ear.2': k}
    elif u < cen[2]:
        k = (u - cen[1]) / (cen[2] - cen[1]); wts = {'ear.2': 1 - k, 'ear.3': k}
    else:
        wts = {'ear.3': 1.0}
    for n, w in wts.items():
        if w > 1e-4:
            g_[n].add([vi], w, 'REPLACE')
uob.parent = arm
m = uob.modifiers.new('Armature', 'ARMATURE')
m.object = arm
arm['kfb_module'] = 'ear_unit'
arm['kfb_mirror_for_right'] = True
arm['kfb_ear_spring'] = rig['kfb_ear_spring']
arm['kfb_dims'] = json.dumps(dict(visible_len=L_VIS, neck=NECK, width=P['ear_width']))
for o in bpy.context.view_layer.objects:
    o.select_set(False)
arm.select_set(True)
uob.select_set(True)
glb_ears = out + 'FB_EAR_UNIT_v5.glb'
bpy.ops.export_scene.gltf(filepath=glb_ears, export_format='GLB', use_selection=True, export_apply=False,
                          export_skins=True, export_animations=False, export_extras=True, export_yup=True)
# head/body without ears, as the default model in the editor
for o in bpy.context.view_layer.objects:
    o.select_set(False)
for n in keep:
    if not n.startswith('FB_Ear_'):
        bpy.data.objects[n].select_set(True)
glb_base = out + 'FB_BASE_NOEARS_v5.glb'
bpy.ops.export_scene.gltf(filepath=glb_base, export_format='GLB', use_selection=True, export_apply=False,
                          export_morph=True, export_skins=True, export_animations=False, export_extras=True,
                          export_yup=True)
mc.hide_viewport = True
mc.hide_render = True

blend = BASE + 'FB_TEMPLATE_LOOK_v5.blend'
bpy.ops.wm.save_as_mainfile(filepath=blend, copy=True)
result = dict(head_verts=len(head.data.vertices), ear_surface=[round(v, 3) for v in SURF],
              glb_kb=round(os.path.getsize(glb) / 1024),
              ears_kb=round(os.path.getsize(glb_ears) / 1024), base_kb=round(os.path.getsize(glb_base) / 1024), ear_verts=len(built['L'][0].data.vertices))
