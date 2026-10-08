"""KFB EyeRig v6 eyes on measured anchors, for Blender (job 369).

Port of pet-eye-rig.v6.js + anchored-eyes.v1.js (three.js) to static Blender meshes:
  * sclera sphere R=1, #f3ede2, roughness 0.42, clearcoat 1
  * pupil cap around local +Z at R*1.004, half-angle 0.12 + 0.5*0.62 rad (matte-cute), #070707
  * upper lid cap (theta 0..0.56pi about +Y), lower lid cap (theta 0.44pi..pi), radius R*(1.006+0.1*0.05),
    skin colour; rotation x: up = -(1.30 - cu*1.18), lo = +(1.30 - cl*1.18); rest cu 0.12, cl 0.06
  * no lashes (anchored mount passes none)
  * eye centre = anchor - n*r*0.24, eye frame: +Z = anchor normal, +Y = head up, scale = r
Anchors come from eye-cleanup-01/02.json (glTF Y-up, figure root space); Blender mesh space = (x, -z, y).
The original dark eye-cap islands are removed from the head mesh (nearest big island + its 2-face island).
Eyes hang on the 'head' bone (parent_type BONE) with a rest-pose parent inverse, so they follow the head
exactly as the skinned head mesh does.
"""
import bpy, bmesh, math, random
from mathutils import Vector, Matrix

SEAT = 0.24
CAP = 0.12 + 0.5 * 0.62
LID_R = 1.006 + (1 - 0.9) * 0.05
REST_U, REST_L = 0.12, 0.06

# glTF anchors (left eye; right = mirror of x / normal.x, per file values), skin sRGB
FIG = {
    'Farmer_B_Head':   dict(skin='#f6bf9b', l=((0.2056, 1.612, 0.4308), (0.4409, 0.0052, 0.8975), 0.0727),
                            r=((-0.2056, 1.612, 0.4308), (-0.4409, 0.0052, 0.8975), 0.0720)),
    'GothGirl_Head':   dict(skin='#f8d3be', l=((0.2055, 1.612, 0.4308), (0.4409, 0.0052, 0.8975), 0.0727),
                            r=((-0.2056, 1.612, 0.4308), (-0.4409, 0.0052, 0.8975), 0.0720)),
    'Farmer_A_Head':   dict(skin='#f6c19d', l=((0.2036, 1.6064, 0.435), (0.4152, -0.0003, 0.9097), 0.0649),
                            r=((-0.2036, 1.6064, 0.435), (-0.4152, -0.0003, 0.9097), 0.0649)),
    'Lorekeeper_Head': dict(skin='#f5bc97', l=((0.2031, 1.6059, 0.435), (0.4152, -0.0003, 0.9097), 0.0649),
                            r=((-0.2042, 1.6059, 0.435), (-0.4152, -0.0003, 0.9097), 0.0649)),
    'OrcBrute_Head':   dict(skin='#82c061', l=((0.165, 3.5063, 0.6275), (0.4152, -0.0003, 0.9097), 0.0556),
                            r=((-0.165, 3.5063, 0.6275), (-0.4152, -0.0003, 0.9097), 0.0556)),
}


def gl2b(v):
    return Vector((v[0], -v[2], v[1]))


def srgb2lin(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c] + [1.0]


def _mat(name, hexcol, rough, coat):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = srgb2lin(hexcol)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = 0.0
    if 'Coat Weight' in b.inputs:
        b.inputs['Coat Weight'].default_value = coat
        b.inputs['Coat Roughness'].default_value = 0.06 if coat else 0.5
    m.diffuse_color = srgb2lin(hexcol)
    return m


def _cap_mesh(name, radius, th0, th1, nphi=48, nth=24, axis='Y'):
    """three.js SphereGeometry(radius, nphi, nth, 0, 2pi, th0, th1-th0); axis 'Z' = rotateX(pi/2)."""
    me = bpy.data.meshes.get(name)
    if me:
        return me
    verts, faces = [], []
    for j in range(nth + 1):
        th = th0 + (th1 - th0) * j / nth
        for i in range(nphi):
            ph = 2 * math.pi * i / nphi
            x, y, z = -math.cos(ph) * math.sin(th), math.cos(th), math.sin(ph) * math.sin(th)
            if axis == 'Z':  # rotateX(+pi/2): y -> z, z -> -y
                y, z = -z, y
            verts.append((x * radius, y * radius, z * radius))
    for j in range(nth):
        for i in range(nphi):
            a = j * nphi + i
            b = j * nphi + (i + 1) % nphi
            faces.append((a, a + nphi, b + nphi, b))
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.validate(clean_customdata=False)
    bm = bmesh.new(); bm.from_mesh(me)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    return me


def shared_meshes():
    return dict(
        sclera=_cap_mesh('KFBEYE_sclera', 1.0, 0, math.pi, 26, 18),
        pupil=_cap_mesh('KFBEYE_pupil', 1.004, 0, CAP, 30, 22, axis='Z'),
        up=_cap_mesh('KFBEYE_lid_up', LID_R, 0, math.pi * 0.56),
        lo=_cap_mesh('KFBEYE_lid_lo', LID_R, math.pi * 0.44, math.pi),
    )


EXPECT = {'Farmer_B_Head': 69, 'GothGirl_Head': 69}   # EYE-CLEANUP-02: 67-face cap + 2-face island per eye; others 66


def strip_eye_caps(me, anchors_b, expect=66):
    """Per anchor: delete the nearest >=60-face island, then the nearest small islands (within 1.3 r)
    until the per-eye face count from EYE-CLEANUP is reached. Brows/freckles stay."""
    bm = bmesh.new(); bm.from_mesh(me); bm.faces.ensure_lookup_table()
    seen, isl = set(), []
    for f in bm.faces:
        if f.index in seen:
            continue
        st, comp = [f], []
        seen.add(f.index)
        while st:
            g = st.pop(); comp.append(g)
            for e in g.edges:
                for h in e.link_faces:
                    if h.index not in seen:
                        seen.add(h.index); st.append(h)
        c = sum((g.calc_center_median() for g in comp), Vector()) / len(comp)
        isl.append((comp, c))
    kill, rep = [], []
    for p, r in anchors_b:
        big = sorted([i for i in isl if len(i[0]) >= 60], key=lambda i: (i[1] - p).length)
        if not big or (big[0][1] - p).length > 0.6 * r:
            rep.append(0); continue
        kill += big[0][0]; n = len(big[0][0]); rep.append(n)
        small = sorted([i for i in isl if len(i[0]) <= 4 and (i[1] - p).length < 1.3 * r], key=lambda i: (i[1] - p).length)
        for comp, c in small:
            if n + len(comp) <= expect:
                kill += comp; n += len(comp); rep.append(len(comp))
    if kill:
        bmesh.ops.delete(bm, geom=list({f.index: f for f in kill}.values()), context='FACES')
    bm.to_mesh(me); bm.free(); me.update()
    me['kfb_eyecaps_removed'] = rep
    return rep


def eye_frame(p_gl, n_gl, r):
    p, n = gl2b(p_gl), gl2b(n_gl).normalized()
    up = Vector((0, 0, 1))
    y = (up - n * up.dot(n)).normalized()
    x = y.cross(n)
    rot = Matrix((x, y, n)).transposed().to_4x4()
    c = p - n * r * SEAT
    return Matrix.Translation(c) @ rot @ Matrix.Scale(r, 4), (p, r)


def mount(arm, head_key, mesh_set, mats):
    spec = FIG[head_key]
    bone = arm.data.bones['head']
    rest_tail = bone.matrix_local @ Matrix.Translation((0, bone.length, 0))
    pinv = rest_tail.inverted()
    out = []
    coll = arm.users_collection
    for side in ('l', 'r'):
        M, _ = eye_frame(*spec[side])
        nm = f'EYE_{arm.name}_{side.upper()}'
        old = bpy.data.objects.get(nm)
        if old:
            for ch in list(old.children):
                bpy.data.objects.remove(ch, do_unlink=True)
            bpy.data.objects.remove(old, do_unlink=True)
        root = bpy.data.objects.new(nm, None)
        root.empty_display_size = 1.0
        root.empty_display_type = 'SPHERE'
        for c in coll:
            c.objects.link(root)
        root.parent = arm; root.parent_type = 'BONE'; root.parent_bone = 'head'
        root.matrix_parent_inverse = pinv
        root.matrix_basis = M
        parts = {}
        for key, me, mat in (('sclera', mesh_set['sclera'], mats['W']), ('pupil', mesh_set['pupil'], mats['P']),
                             ('up', mesh_set['up'], mats['L']), ('lo', mesh_set['lo'], mats['L'])):
            ob = bpy.data.objects.new(f'{nm}_{key}', me)
            ob.data = me
            for c in coll:
                c.objects.link(ob)
            ob.parent = root
            if not me.materials:
                me.materials.append(None)
            ob.material_slots[0].link = 'OBJECT'
            ob.material_slots[0].material = mat
            ob.visible_shadow = False
            parts[key] = ob
        parts['up'].rotation_euler.x = -(1.30 - REST_U * 1.18)
        parts['lo'].rotation_euler.x = (1.30 - REST_L * 1.18)
        root['kfb_eye'] = dict(head=head_key, side=side, r=spec[side][2], skin=spec['skin'])
        out.append((root, parts))
    return out


def key_blinks(eyes, f0, f1, fps=24, seed=0, min_gap=2.5, max_gap=6.5, dur=0.12):
    """Global blink (both eyes together) like EyeRig.update: bl = sin(k*pi) over dur seconds."""
    rnd = random.Random(seed)
    t = f0 + int((1.2 + rnd.random() * 2) * fps)
    half = max(1, round(dur * fps / 2))
    for root, parts in eyes:
        for k in ('up', 'lo'):
            parts[k].animation_data_clear()
    blinks = []
    while t < f1:
        blinks.append(t)
        t += int((min_gap + rnd.random() * (max_gap - min_gap)) * fps)
    for root, parts in eyes:
        up, lo = parts['up'], parts['lo']
        ru, rl = -(1.30 - REST_U * 1.18), (1.30 - REST_L * 1.18)
        for b in blinks:
            for f, cu, cl in ((b - half, REST_U, REST_L), (b, 1.0, 1.0), (b + half, REST_U, REST_L)):
                up.rotation_euler.x = -(1.30 - cu * 1.18); up.keyframe_insert('rotation_euler', index=0, frame=f)
                lo.rotation_euler.x = (1.30 - cl * 1.18); lo.keyframe_insert('rotation_euler', index=0, frame=f)
        up.rotation_euler.x, lo.rotation_euler.x = ru, rl
    return blinks


def head_key_of(arm):
    for ch in arm.children:
        if ch.type == 'MESH':
            k = ch.name.split('.')[0]
            if k in FIG:
                return k, ch
    return None, None


def run(scene_names=None, blink=True):
    ms = shared_meshes()
    report, done_mesh = [], {}
    arms = [o for o in bpy.data.objects if o.type == 'ARMATURE' and 'head' in o.data.bones]
    for arm in arms:
        k, head = head_key_of(arm)
        if not k:
            continue
        scs = [s for s in bpy.data.scenes if arm.name in s.objects]
        if scene_names and not any(s.name in scene_names for s in scs):
            continue
        spec = FIG[k]
        if head.data.name not in done_mesh:
            anchors = [(gl2b(spec[s][0]), spec[s][2]) for s in ('l', 'r')]
            done_mesh[head.data.name] = (head.data.get('kfb_eyecaps_removed') and list(head.data['kfb_eyecaps_removed'])) \
                or strip_eye_caps(head.data, anchors, EXPECT.get(k, 66))
        mats = dict(W=_mat('KFBEYE_sclera', '#f3ede2', 0.42, 1.0), P=_mat('KFBEYE_pupil', '#070707', 0.45, 1.0),
                    L=_mat(f'KFBEYE_lid_{k}', spec['skin'], 0.98, 0.0))
        eyes = mount(arm, k, ms, mats)
        bl = []
        if blink and scs:
            f0 = min(s.frame_start for s in scs); f1 = max(s.frame_end for s in scs)
            fps = scs[0].render.fps
            bl = key_blinks(eyes, f0, f1, fps, seed=sum(map(ord, arm.name)))
        report.append(dict(arm=arm.name, head=k, mesh=head.data.name, removed=done_mesh[head.data.name],
                           scenes=[s.name for s in scs], blinks=len(bl)))
    return report
