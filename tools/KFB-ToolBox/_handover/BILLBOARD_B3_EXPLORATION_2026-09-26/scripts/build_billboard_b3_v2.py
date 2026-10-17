"""KFB BILLBOARD B3 · cartoon roadside signs (Googie / motel / casino spirit, own designs) · Claude Coworker 26.09.2026

exec(open(<kit>/BILLBOARD-B3/scripts/build_billboard_b3.py).read())

Parametric, responsive billboard bodies for the KFB elastic-grotesque world.
- Every type is built AROUND a media face: face = contain-fit(content aspect) into (maxW, maxH).
  So a 4:3 YouTube video, a ~16:9 KFB card or a portrait clip each get a body shaped to fit.
- Palette = role materials (bb_body, bb_frame, bb_accent, bb_post, bb_bulb, bb_face); swap colours, not geometry.
- Face contract: an object `<name>_FACE` (plane, UV 0..1, normal = front = -Y) + metadata JSON per board
  (face centre, size, normal, aspect) so the existing B1/B2a media owners can bind without change.
- Kenney racing-kit billboard is imported beside them as the accepted source object (comparison only).

Types (own shapes, inspired by 1950s/60s roadside sign language, no real sign copied):
  KIDNEY  kidney/boomerang head, asymmetric lobe, one slanted boomerang leg, starburst
  ARROW   motel-style fat arrow sweeping over and down the right side with bulbs, two posts
  BLOB    soft bumpy amoeba frame on two stubby legs with round feet (creature-ready: eyes/mouth later)
  TOTEM   tall leaning pylon, screen box mid-height, disc + star crown, side fin
Blender: Z up, boards face -Y. 1 unit = 1 m."""
import bpy, bmesh, math, json, os
from mathutils import Vector, Matrix

KIT = globals().get('BB_BASE', '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/BILLBOARD-B3')
COLL = 'KFB_BILLBOARD_B3'
ORIGIN = Vector(globals().get('BB_ORIGIN', (0.0, 3000.0, 0.0)))
KENNEY = globals().get('BB_KENNEY', '/Users/georgv.westphalen/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/'
                       '3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/kenney_racing-kit/Models/GLTF format/billboard.glb')

PALETTES = {
    'motel':  dict(bb_body='#2fb5a8', bb_frame='#fff1d6', bb_accent='#ff6b4a', bb_post='#e8c547', bb_bulb='#fff4b0', bb_face='#1b1f2b'),
    'casino': dict(bb_body='#d7263d', bb_frame='#ffd23f', bb_accent='#1b998b', bb_post='#2e294e', bb_bulb='#fffbe6', bb_face='#141018'),
    'kfb':    dict(bb_body='#279797', bb_frame='#fdc348', bb_accent='#fa7a47', bb_post='#674b54', bb_bulb='#fff6c8', bb_face='#1a1c24'),
}
PALETTES.update(globals().get('BB_PALETTES', {}))

# (type, content aspect w/h, palette, maxW, maxH, x position)
BOARDS = globals().get('BB_BOARDS', [
    ('KIDNEY', 16 / 9, 'motel', 8.0, 4.6, 0.0),
    ('ARROW', 4 / 3, 'motel', 8.0, 4.6, 14.0),
    ('BLOB', 16 / 9, 'motel', 8.0, 4.6, 28.0),
    ('TOTEM', 4 / 3, 'motel', 5.5, 4.0, 41.0),
    # responsive row: same type, different content, same max box
    ('KIDNEY', 4 / 3, 'casino', 8.0, 4.6, 0.0, 18.0),
    ('KIDNEY', 9 / 16, 'kfb', 8.0, 4.6, 12.0, 18.0),
    ('BLOB', 4 / 3, 'kfb', 8.0, 4.6, 24.0, 18.0),
    ('ARROW', 16 / 9, 'casino', 8.0, 4.6, 38.0, 18.0),
])


def hexcol(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c] + [1.0]


def material(pal, role):
    name = f'BB_{pal}_{role}'
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    col = hexcol(PALETTES[pal][role])
    b.inputs['Base Color'].default_value = col
    b.inputs['Roughness'].default_value = 0.55 if role != 'bb_face' else 0.35
    if role in ('bb_bulb', 'bb_face'):
        b.inputs['Emission Color'].default_value = col
        b.inputs['Emission Strength'].default_value = 2.5 if role == 'bb_bulb' else 0.4
    m.diffuse_color = col
    m['kfb_role'] = role
    return m


# ------------------------------------------------------------------ scene plumbing
def ensure_coll():
    c = bpy.data.collections.get(COLL)
    if c:
        for o in list(c.all_objects):
            me = o.data if o.type == 'MESH' else None
            bpy.data.objects.remove(o, do_unlink=True)
            if me is not None and me.users == 0:
                bpy.data.meshes.remove(me)
    else:
        c = bpy.data.collections.new(COLL)
        bpy.context.scene.collection.children.link(c)
    for cu in [cu for cu in bpy.data.curves if cu.name.startswith('bbtmp') and cu.users == 0]:
        bpy.data.curves.remove(cu)
    return c


coll = ensure_coll()


def link(o, parent=None):
    coll.objects.link(o)
    if parent:
        o.parent = parent
    return o


def mesh_obj(name, bm, mat, parent, smooth=True):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = smooth
    me.materials.append(mat)
    return link(bpy.data.objects.new(name, me), parent)


def curve_solid(name, loops, depth, bevel, mat, parent, loc=(0, 0, 0), rot_x=math.pi / 2):
    """2D closed polylines (outer + optional holes) in local XY -> extruded, round-bevelled solid.
    Local +Z becomes world -Y (front) after rot_x = +90 deg."""
    cu = bpy.data.curves.new('bbtmp_' + name, 'CURVE')
    cu.dimensions = '2D'
    cu.fill_mode = 'BOTH'
    cu.extrude = depth
    cu.bevel_depth = bevel
    cu.bevel_resolution = 4
    cu.resolution_u = 1
    for pts in loops:
        sp = cu.splines.new('POLY')
        sp.points.add(len(pts) - 1)
        for i, (x, y) in enumerate(pts):
            sp.points[i].co = (x, y, 0.0, 1.0)
        sp.use_cyclic_u = True
    tmp = bpy.data.objects.new('bbtmp_' + name, cu)
    bpy.context.scene.collection.objects.link(tmp)
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(tmp.evaluated_get(dg))
    bpy.data.objects.remove(tmp, do_unlink=True)
    bpy.data.curves.remove(cu)
    me.name = name
    for p in me.polygons:
        p.use_smooth = True
    me.materials.append(mat)
    o = link(bpy.data.objects.new(name, me), parent)
    o.location = loc
    o.rotation_euler = (rot_x, 0, 0)
    return o


def tube(name, path, radius_fn, mat, parent, seg=20, cap=True):
    """Tube along a 3D polyline; radius_fn(t in 0..1). Rounded look via many rings + smooth shading."""
    bm = bmesh.new()
    rings = []
    n = len(path)
    for i, p in enumerate(path):
        p = Vector(p)
        t0 = Vector(path[min(i + 1, n - 1)]) - Vector(path[max(i - 1, 0)])
        t0.normalize()
        a = t0.orthogonal().normalized()
        b = t0.cross(a).normalized()
        r = radius_fn(i / (n - 1))
        rings.append([bm.verts.new(p + (a * math.cos(2 * math.pi * k / seg) + b * math.sin(2 * math.pi * k / seg)) * r)
                      for k in range(seg)])
    for i in range(n - 1):
        for k in range(seg):
            bm.faces.new((rings[i][k], rings[i][(k + 1) % seg], rings[i + 1][(k + 1) % seg], rings[i + 1][k]))
    if cap:
        for ring, rev in ((rings[0], True), (rings[-1], False)):
            c = bm.verts.new(sum((v.co for v in ring), Vector()) / seg)
            for k in range(seg):
                f = (c, ring[(k + 1) % seg], ring[k]) if rev else (c, ring[k], ring[(k + 1) % seg])
                bm.faces.new(f)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return mesh_obj(name, bm, mat, parent)


def blob_sphere(name, loc, scale, mat, parent, seg=24):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=seg // 2, radius=1.0)
    bmesh.ops.scale(bm, vec=Vector(scale), verts=bm.verts)
    bmesh.ops.translate(bm, vec=Vector(loc), verts=bm.verts)
    return mesh_obj(name, bm, mat, parent)


# ------------------------------------------------------------------ 2D outlines (local XY, screen centred at 0,0)
def rrect(w, h, r, n=10):
    r = min(r, w / 2 - 1e-3, h / 2 - 1e-3)
    pts = []
    for cx, cy, a0 in ((w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90), (-w / 2 + r, -h / 2 + r, 180), (w / 2 - r, -h / 2 + r, 270)):
        for k in range(n + 1):
            a = math.radians(a0 + 90 * k / n)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def superblob(ax, ay, expo=2.6, bumps=(), skew=0.0, lobes=(), n=180, cx=0.0, cy=0.0):
    """Superellipse (half axes ax, ay) with radial bumps [(k, amp, phase)], gaussian lobes [(angle, amp, width)]
    and horizontal skew. Soft, slightly irregular cartoon outline."""
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        c, s = math.cos(t), math.sin(t)
        x = ax * math.copysign(abs(c) ** (2 / expo), c)
        y = ay * math.copysign(abs(s) ** (2 / expo), s)
        f = 1.0 + sum(a * math.sin(k * t + ph) for k, a, ph in bumps)
        for ang, amp, wid in lobes:
            d = math.atan2(math.sin(t - ang), math.cos(t - ang))
            f += amp * math.exp(-(d / wid) ** 2)
        pts.append((cx + x * f + skew * y * f, cy + y * f))
    return pts


def fit_face(aspect, maxW, maxH):
    w, h = maxW, maxW / aspect
    if h > maxH:
        h, w = maxH, maxH * aspect
    return w, h


# ------------------------------------------------------------------ face (media contract)
def face(name, w, h, r, mat, parent, y_front):
    bm = bmesh.new()
    pts = rrect(w, h, r, 6)
    vs = [bm.verts.new((x, y_front, z)) for x, z in pts]
    f = bm.faces.new(vs)
    uv = bm.loops.layers.uv.new('UVMap')
    for lp in f.loops:
        lp[uv].uv = (lp.vert.co.x / w + 0.5, lp.vert.co.z / h + 0.5)
    if f.normal.y > 0:
        f.normal_flip()
    o = mesh_obj(name, bm, mat, parent, smooth=False)
    return o


# ------------------------------------------------------------------ board types
def head(name, root, pal, w, h, outer, hole_r, zc, body_d=0.55, frame_d=0.12, extra_front=()):
    """Body slab (outer, solid) + frame ring (outer minus screen) + recessed face. zc = screen centre height."""
    M = lambda r: material(pal, r)
    curve_solid(name + '_body', [outer], body_d * 0.5, 0.18, M('bb_body'), root, loc=(0, body_d * 0.5 + 0.02, zc))
    inner = rrect(w + 0.02, h + 0.02, hole_r, 8)
    band = max(0.28, 0.07 * min(w, h))  # cream frame band around the screen; the coloured body silhouette stays visible
    ring = [rrect(w + 2 * band, h + 2 * band, hole_r + band, 10), inner[::-1]]
    curve_solid(name + '_frame', ring, frame_d * 0.5, 0.09, M('bb_frame'), root, loc=(0, -0.12, zc))
    for i, (loops, role, dy, depth, bev) in enumerate(extra_front):
        curve_solid(f'{name}_deco{i}', loops, depth, bev, M(role), root, loc=(0, dy, zc))
    fo = face(name + '_FACE', w, h, hole_r, M('bb_face'), root, -0.19)
    fo.location = (0, 0, zc)
    return fo


def starburst(name, root, pal, c, r, spikes=8, thick=0.07):
    M = material(pal, 'bb_accent')
    for k in range(spikes):
        a = 2 * math.pi * k / spikes + 0.2
        L = r * (1.0 if k % 2 == 0 else 0.62)
        d = Vector((math.cos(a), 0, math.sin(a)))
        tube(f'{name}_spike{k}', [c, c + d * L * 0.5, c + d * L], lambda t: thick * (1.0 - 0.85 * t) + 0.01, M, root, seg=10)
    blob_sphere(name + '_core', c, (r * 0.22, r * 0.22, r * 0.22), material(pal, 'bb_bulb'), root)


def bulbs(name, root, pal, pts, r=0.13):
    for i, p in enumerate(pts):
        blob_sphere(f'{name}_bulb{i}', p, (r, r * 0.8, r), material(pal, 'bb_bulb'), root, seg=12)


def post(name, root, pal, base, top, r0, r1, bulge=0.12, foot=True):
    path = [base.lerp(top, i / 12) for i in range(13)]
    tube(name, path, lambda t: (r0 + (r1 - r0) * t) * (1 + bulge * math.sin(math.pi * t)), material(pal, 'bb_post'), root)
    if foot:
        blob_sphere(name + '_foot', base + Vector((0, 0, 0.05)), (r0 * 2.1, r0 * 1.9, r0 * 0.9), material(pal, 'bb_post'), root)


def build_kidney(name, root, pal, w, h):
    m = 0.18 * min(w, h) + 0.45
    zc = 4.2 + h / 2
    outer = superblob(w / 2 + m, h / 2 + m, expo=2.3, bumps=((2, 0.04, 0.6),), skew=-0.12,
                      lobes=((math.radians(30), 0.30, 0.42), (math.radians(200), 0.12, 0.45), (math.radians(270), -0.10, 0.35)))
    fo = head(name, root, pal, w, h, outer, 0.18 * min(w, h), zc)
    # one boomerang leg: from the lower-left of the head, kinking outward, to a round foot
    b0 = Vector((-(w / 2 + m) * 0.25, 0.25, zc - h / 2 - m * 0.6))
    knee = Vector((-(w / 2 + m) * 0.55, 0.25, 1.8))
    ft = Vector((-(w / 2 + m) * 0.2, 0.25, 0.0))
    path = [b0.lerp(knee, i / 8) for i in range(8)] + [knee.lerp(ft, i / 8) for i in range(9)]
    tube(name + '_leg', path, lambda t: 0.34 - 0.12 * abs(t - 0.45), material(pal, 'bb_post'), root)
    blob_sphere(name + '_foot', ft + Vector((0, 0, 0.05)), (0.75, 0.6, 0.3), material(pal, 'bb_post'), root)
    starburst(name + '_star', root, pal, Vector((-(w / 2 + m) * 0.78, -0.35, zc + h / 2 + m * 0.75)), 0.55 + 0.1 * w)
    return fo, zc


def build_arrow(name, root, pal, w, h):
    m = 0.14 * min(w, h) + 0.35
    zc = 3.9 + h / 2
    outer = rrect(w + 2 * m, h + 2 * m, 0.35 * min(w, h), 10)
    outer = [(x + 0.06 * y, y) for x, y in outer]  # a slight lean
    # fat arrow band: from above-left, arcing over the top-right corner, down the right side, head points at the ground
    R = max(w, h) * 0.55 + m
    cxa, cya = w / 2 - R * 0.55, h / 2 - R * 0.35
    band_o, band_i, spine = [], [], []
    th = 0.55 + 0.05 * min(w, h)
    a0, a1 = math.radians(150), math.radians(-40)
    for i in range(25):
        a = a0 + (a1 - a0) * i / 24
        rr = R + 0.25 * math.sin(math.pi * i / 24)
        band_o.append((cxa + (rr + th / 2) * math.cos(a), cya + (rr + th / 2) * math.sin(a)))
        band_i.append((cxa + (rr - th / 2) * math.cos(a), cya + (rr - th / 2) * math.sin(a)))
        spine.append((cxa + rr * math.cos(a), cya + rr * math.sin(a)))
    ex, ey = spine[-1]
    tx, ty = spine[-1][0] - spine[-2][0], spine[-1][1] - spine[-2][1]
    L = math.hypot(tx, ty)
    tx, ty = tx / L, ty / L
    nx, ny = -ty, tx
    hw, hl = th * 1.35, th * 1.8
    headp = [(ex + nx * hw, ey + ny * hw), (ex + tx * hl, ey + ty * hl), (ex - nx * hw, ey - ny * hw)]
    arrow = band_o + [headp[0], headp[1], headp[2]] + band_i[::-1]
    # arrow sits in front of the body, its own layer
    fo = head(name, root, pal, w, h, outer, 0.2 * min(w, h), zc,
              extra_front=[([arrow], 'bb_accent', -0.34, 0.1, 0.06)])
    bulbs(name, root, pal, [Vector((x, -0.52, zc + y)) for x, y in spine[1:-1:2]], r=0.1 + 0.01 * w)
    for sx in (-0.3, 0.3):
        post(f'{name}_post{"L" if sx < 0 else "R"}', root, pal, Vector((sx * (w + 2 * m), 0.3, 0.0)),
             Vector((sx * (w + 2 * m) * 0.9, 0.3, zc - h / 2)), 0.3, 0.2)
    return fo, zc


def build_blob(name, root, pal, w, h):
    m = 0.22 * min(w, h) + 0.5
    zc = 2.3 + h / 2 + m
    outer = superblob(w / 2 + m, h / 2 + m, expo=2.2, bumps=((5, 0.035, 0.3), (3, 0.03, 1.4)),
                      lobes=((math.radians(62), 0.14, 0.3), (math.radians(118), 0.14, 0.3)))  # two 'ear' swells on top
    fo = head(name, root, pal, w, h, outer, 0.28 * min(w, h), zc, body_d=0.8)
    for sx in (-1, 1):
        top = Vector((sx * w * 0.25, 0.3, zc - h / 2 - m * 0.55))
        base = Vector((sx * w * 0.3, 0.3, 0.35))
        post(f'{name}_leg{"L" if sx < 0 else "R"}', root, pal, base, top, 0.42, 0.34, bulge=0.25, foot=False)
        blob_sphere(f'{name}_shoe{"L" if sx < 0 else "R"}', base + Vector((sx * 0.15, -0.25, -0.1)), (0.8, 1.05, 0.42),
                    material(pal, 'bb_accent'), root)
    return fo, zc


def build_totem(name, root, pal, w, h):
    m = 0.16 * min(w, h) + 0.35
    zc = 5.2 + h / 2
    outer = rrect(w + 2 * m, h + 2 * m, 0.45 * min(w, h), 10)
    fo = head(name, root, pal, w, h, outer, 0.22 * min(w, h), zc)
    top = zc + h / 2 + m
    # leaning pylon behind the head, taller than the head, with a side fin
    base = Vector((w * 0.1, 0.55, 0.0))
    crown = Vector((-w * 0.05, 0.55, top + 2.4))
    tube(name + '_pylon', [base.lerp(crown, i / 16) for i in range(17)],
         lambda t: 0.55 - 0.3 * t + 0.08 * math.sin(math.pi * t * 2), material(pal, 'bb_post'), root)
    fin = superblob(0.55, 1.6, expo=2.0, skew=0.45, n=90)
    curve_solid(name + '_fin', [fin], 0.08, 0.05, material(pal, 'bb_accent'), root, loc=(crown.x - 1.1, 0.75, top + 1.1))
    disc = superblob(1.05, 1.05, expo=2.0, n=64)
    curve_solid(name + '_disc', [disc], 0.12, 0.08, material(pal, 'bb_frame'), root, loc=(crown.x, 0.2, crown.z))
    starburst(name + '_star', root, pal, Vector((crown.x, -0.05, crown.z)), 0.9, spikes=10, thick=0.06)
    blob_sphere(name + '_foot', base + Vector((0, 0, 0.1)), (1.2, 1.0, 0.35), material(pal, 'bb_post'), root)
    return fo, zc


BUILDERS = dict(KIDNEY=build_kidney, ARROW=build_arrow, BLOB=build_blob, TOTEM=build_totem)

# ------------------------------------------------------------------ build all
meta = dict(schema='kfb.billboard-body.v0', unit='m', up='+Z (Blender) / +Y (glTF)', front='-Y (Blender) / +Z (glTF)',
            palettes=PALETTES, boards=[])
count = {}
for spec in BOARDS:
    typ, aspect, pal, maxW, maxH, x = spec[:6]
    y = spec[6] if len(spec) > 6 else 0.0
    count[typ] = count.get(typ, 0) + 1
    name = f'BB_{typ}_{count[typ]}'
    root = link(bpy.data.objects.new(name, None))
    root.empty_display_size = 0.5
    root.location = ORIGIN + Vector((x, y, 0))
    w, h = fit_face(aspect, maxW, maxH)
    fo, zc = BUILDERS[typ](name, root, pal, w, h)
    root['kfb_billboard'] = typ
    meta['boards'].append(dict(name=name, type=typ, palette=pal, content_aspect=round(aspect, 4), max_box=[maxW, maxH],
                               face=dict(object=fo.name, w=round(w, 3), h=round(h, 3), centre_local=[0, -0.19, round(zc, 3)],
                                         normal_local=[0, -1, 0], uv='0..1 across the face rectangle')))

# the accepted source object, beside the new family, scaled to the B0 face width (4.20 m)
if os.path.exists(KENNEY):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=KENNEY)
    for o in [o for o in bpy.data.objects if o not in before]:
        for c in list(o.users_collection):
            c.objects.unlink(o)
        coll.objects.link(o)
        o.name = 'KENNEY_billboard_donor'
        o.scale = (4.2, 4.2, 4.2)
        o.location = ORIGIN + Vector((-12.0, -0.85 * 4.2, 0.0))
        o.rotation_euler = (0, 0, 0)
    meta['donor'] = dict(path='kenney_racing-kit/Models/GLTF format/billboard.glb', scale=4.2, note='comparison only')

# ground slab for the review scene (preview only)
bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=45)
g = mesh_obj('BB_preview_ground', bm, material('kfb', 'bb_post'), None, smooth=False)
g.location = ORIGIN + Vector((18, -8, 0))
g.data.materials[0] = bpy.data.materials.get('BB_prev_ground') or bpy.data.materials.new('BB_prev_ground')
g.data.materials[0].diffuse_color = (0.55, 0.62, 0.38, 1)
g['kfb_module'] = 'preview'

if globals().get('BB_EXPORT'):
    os.makedirs(KIT + '/glb', exist_ok=True)
    json.dump(meta, open(KIT + '/billboard_b3.bodies.json', 'w'), indent=1)
    for b in meta['boards']:
        root = bpy.data.objects[b['name']]
        bpy.ops.object.select_all(action='DESELECT')
        root.select_set(True)
        for c in root.children_recursive:
            c.select_set(True)
        loc = root.location.copy()
        root.location = (0, 0, 0)
        bpy.ops.export_scene.gltf(filepath=f"{KIT}/glb/{b['name']}.glb", export_format='GLB', use_selection=True,
                                  export_apply=True, export_yup=True)
        root.location = loc
RESULT = meta
