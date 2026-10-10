"""Brick Fish / Red Herring prop, first clay pass (BRICKFISH-TOSS-01).

Design per PR #254 + Georg's notes: a red clay brick that is also a fish. Brick silhouette first (rounded,
slightly uneven edges), thick-lipped mouth on the front face, two big cartoon eyes, tail fin and dorsal fin.
Pivot = body centre (the grip). Long axis = local +X (nose), up = +Z. Size fits one Rig_Medium hand.
Colours are first proposals; Georg decides the look.
"""
import bpy, bmesh, math, random
from mathutils import Vector, Matrix

DIMS = (0.36, 0.17, 0.11)          # brick body, metres
COL = {"body": "#c8402e", "fin": "#9e2a22", "lip": "#f07a6e", "eye": "#fbf6ee", "pupil": "#1b1512"}
EYE_R = 0.036


def hex2lin(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple((x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c) + (1.0,)


def clay_mat(name, hexcol, rough=0.82, bump=0.12):
    m = bpy.data.materials.get(name)
    if m: return m
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    p = nt.nodes["Principled BSDF"]; p.inputs["Base Color"].default_value = hex2lin(hexcol)
    p.inputs["Roughness"].default_value = rough
    nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 22.0; nz.inputs["Detail"].default_value = 3.0
    bp = nt.nodes.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = bump; bp.inputs["Distance"].default_value = 0.004
    nt.links.new(nz.outputs["Fac"], bp.inputs["Height"]); nt.links.new(bp.outputs["Normal"], p.inputs["Normal"])
    return m


def _obj(name, bm, mat, col, parent):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); col.objects.link(o); o.parent = parent
    me.materials.append(mat)
    for p in me.polygons: p.use_smooth = True
    return o


def _apply(o, mods):
    for kind, kw in mods:
        m = o.modifiers.new(kind, kind)
        for k, v in kw.items(): setattr(m, k, v)
    dg = bpy.context.evaluated_depsgraph_get(); me = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
    old = o.data; o.modifiers.clear(); o.data = me; bpy.data.meshes.remove(old)


def _lumpy(o, amp, seed):
    rnd = random.Random(seed); ph = [rnd.uniform(0, 6.28) for _ in range(6)]
    for v in o.data.vertices:
        p = v.co
        n = (math.sin(p.x * 23 + ph[0]) * math.sin(p.y * 29 + ph[1]) + math.sin(p.z * 31 + ph[2]) * math.sin(p.x * 17 + ph[3])) * 0.5
        v.co = p + p.normalized() * amp * n


def build(col, name="BF_fish", seed=7):
    for o in [o for o in bpy.data.objects if o.name.startswith(name)]: bpy.data.objects.remove(o, do_unlink=True)
    root = bpy.data.objects.new(name, None); col.objects.link(root); root.empty_display_size = 0.15
    M = {k: clay_mat(f"BF_{k}", v, bump=0.0 if k in ("eye", "pupil") else 0.12) for k, v in COL.items()}
    L, W, H = DIMS
    # body: rounded, slightly uneven brick
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(L, W, H), verts=bm.verts)
    body = _obj(name + "_body", bm, M["body"], col, root)
    _apply(body, [("BEVEL", {"width": 0.024, "segments": 4, "limit_method": 'NONE'}),
                  ("SUBSURF", {"levels": 1, "render_levels": 1})])
    _lumpy(body, 0.004, seed)
    # lips: flattened torus on the front face (+X)
    bm = bmesh.new()
    seg, ring = 28, 12; R, r = 0.042, 0.019
    verts = []
    for i in range(seg):
        a = 2 * math.pi * i / seg
        row = []
        for j in range(ring):
            b = 2 * math.pi * j / ring
            x = (R + r * math.cos(b)) * math.cos(a); y = (R + r * math.cos(b)) * math.sin(a); z = r * math.sin(b)
            row.append(bm.verts.new((z * 0.8, x * 1.25, y * 0.62)))   # ring faces +X; wide, flat mouth
        verts.append(row)
    for i in range(seg):
        for j in range(ring):
            bm.faces.new((verts[i][j], verts[(i + 1) % seg][j], verts[(i + 1) % seg][(j + 1) % ring], verts[i][(j + 1) % ring]))
    lip = _obj(name + "_lips", bm, M["lip"], col, root); lip.location = (L / 2 + 0.006, 0, -0.012)
    # mouth opening (dark) inside the lips
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=8, radius=1.0)
    bmesh.ops.scale(bm, vec=(0.008, 0.05, 0.022), verts=bm.verts)
    mo = _obj(name + "_mouth", bm, M["pupil"], col, root); mo.location = (L / 2 + 0.004, 0, -0.012)
    # eyes: big cartoon eyes on the upper front corners, pupils looking forward
    for s in (1, -1):
        bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=12, radius=EYE_R)
        e = _obj(f"{name}_eye_{'l' if s > 0 else 'r'}", bm, M["eye"], col, root)
        e.location = (L / 2 - 0.045, s * (W / 2 - 0.022), H / 2 + 0.012)
        bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=14, v_segments=8, radius=EYE_R * 0.42)
        p = _obj(f"{name}_pupil_{'l' if s > 0 else 'r'}", bm, M["pupil"], col, root)
        p.location = e.location + Vector((EYE_R * 0.78, s * 0.006, 0.004))
    # tail fin: two-lobed fan at the back (-X), vertical
    def fin(pts, thick, mat, nm, loc):
        bm = bmesh.new(); vs = [bm.verts.new((x, 0, z)) for x, z in pts]; f = bm.faces.new(vs)
        r = bmesh.ops.extrude_face_region(bm, geom=[f]); top = [g for g in r["geom"] if isinstance(g, bmesh.types.BMVert)]
        bmesh.ops.translate(bm, vec=(0, thick, 0), verts=top); bmesh.ops.translate(bm, vec=(0, -thick / 2, 0), verts=bm.verts)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        o = _obj(nm, bm, mat, col, root); o.location = loc
        _apply(o, [("BEVEL", {"width": 0.006, "segments": 2, "limit_method": 'NONE'}), ("SUBSURF", {"levels": 1})])
        return o
    fin([(0.02, 0.0), (-0.05, 0.035), (-0.115, 0.075), (-0.095, 0.0), (-0.115, -0.07), (-0.05, -0.03)], 0.022,
        M["fin"], name + "_tail", (-L / 2 + 0.01, 0, 0))
    fin([(-0.08, 0.0), (-0.03, 0.05), (0.04, 0.068), (0.07, 0.0)], 0.016, M["fin"], name + "_dorsal", (-0.02, 0, H / 2 - 0.006))
    return root


def parts(root):
    return [c for c in root.children if c.type == 'MESH']
