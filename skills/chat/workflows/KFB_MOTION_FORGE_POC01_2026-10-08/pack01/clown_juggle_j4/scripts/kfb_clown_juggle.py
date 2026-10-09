"""Sprint #381 item 5a: the Clown's 3-prop cascade, rev b (Georg 2026-10-09). Replaces JUG-P1 (2026-09-23).

Rules:
  * 30 fps. Beat b = 16 frames (one throw every beat, hands alternate). Dwell ratio 0.69: each prop is held
    D = 22 frames and flies F = 26 frames (F + D = 3b). Loop = 6 beats = 96 frames (3.2 s), seamless.
    Apex 1.65 above the release -> cartoon gravity 8 h / F^2 = 0.0195 units/frame^2 (about real gravity at this scale).
  * Hands (two-bone IK on the Idle_A body) run the classic cascade loop: release inside, the empty hand travels
    up and out to the catch point outside, catches, scoops down and in, and throws again from inside.
  * Props are not bone children: held, the prop sits at handslot with a hold direction (long axis up-forward,
    leaning outward at the catch and inward at the throw); in the air its centre of mass flies a true parabola
    from the release to the catch point (one cartoon gravity for all throws) with a forward bow that keeps it in
    front of the big chibi head, and a pin turns exactly once about the actor's left-right axis, so it lands
    handle-first in the catching hand.
  * Variants: pins (KayKit juggling_pin_*), clay balls, anything round (donuts, sweets): the spin is per prop kind.
Checks: prop vertices vs deformed head / hat / body (min distance) and prop vs prop, every frame.
"""
import bpy, math, os
from mathutils import Vector, Quaternion, Matrix
import kfb_table_atlas as AT
import kfb_table_activity as TA
import kfb_seat_standup_c as SU
import kfb_stammtisch_realize as R
import kfb_eye_guard as EG

SC = '381_CLOWN'
KK = ('/Users/georg/Library/CloudStorage/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + '
      'PDF VIewer/3D ASSETS/KayKit_Mystery_Monthly_Series_4/11 - May 2024 - Clown/assets/gltf/')
_IN = ('/Users/georg/Library/CloudStorage/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + '
       'PDF VIewer/3D ASSETS/_INBOX/')
TT = _IN + 'Tiny_Treats_Baked_Goods_1.0_FREE/Assets/gltf/'
HB = _IN + 'KayKit_Bits_Bundle1_1.1/Halloween Bits/Assets/gltf/'
BEAT, DWELL = 16, 22
FLIGHT = 3 * BEAT - DWELL
LOOP = 6 * BEAT
BOW = 0.0              # forward bow at the apex (actor -Y); J3 0.70 put the props in front of the face
AROUND = 1.25          # (J4a) half width of the arc around the head (the chibi head is 1.3 wide, the arms reach 0.5)
AROUND_UP = 1.4        # half width on the rising leg
AROUND_DOWN = 1.7      # half width on the falling leg
BOW_APEX = 0.0         # extra forward bow concentrated at the apex
BOW_EXP = 6.0
AROUND_EXP = 0.15     # how early the prop swings out after the release (smaller = earlier)
DEPTH_SPLIT = 0.0     # separates the rising and the falling prop where their paths cross at the side
AROUND_MODE = 'seg'   # 'seg' (J4 final) or 'exp' (J3)
OUT_U = 0.12          # fraction of the flight to swing out after the release (and in before the catch)
CROSS = (0.30, 0.70)  # the crossing over the head (the prop is above the hat for u in about 0.3..0.7)
AROUND_SHAPE = 0.45   # exponent on cos: < 1 keeps the prop out at the side longer before it crosses over the head
APEX = 1.85            # apex above the release point
SPIN_EASE = 0.9        # 0 = constant spin; up to 1 = spin slows near release / catch and speeds up at the apex
HOLD_C = (0.65, -0.70, 0.55)   # held prop axis at the catch (x is outward)
HOLD_T = (0.55, -0.75, 0.42)   # held prop axis at the throw (x is outward)
HOLD_DIP = (0.6, -0.45, -0.55)  # added mid-dwell (x outward): the held club dips and swings, it is not parked
PODIUM_TOP = 1.0
BASE = 'M|KK|General|Idle_A'
ARM = 'ARM_clown'
AXIS_FIX = Matrix.Rotation(-math.pi / 2, 4, 'Y')   # asset X -> Z
CLIP = 'kfb_clown_juggle_cascade3_c'   # J4 (J3 = cascade3_b)
# hand IK targets in actor space (actor faces -Y, x < 0 = the actor's right)
THROW = Vector((0.26, -0.54, 0.86))   # inside (wide enough that the rising prop clears the face sooner)
CATCH = Vector((0.44, -0.50, 0.95))   # outside
POLE = {'r': Vector((-1.0, 0.3, -0.6)), 'l': Vector((1.0, 0.3, -0.6))}
KINDS = {
    'pin': dict(files=['juggling_pin_red', 'juggling_pin_yellow', 'juggling_pin_blue'], scale=1.0, com=0.35, spins=1.0, grip=0.27),
    'ball': dict(files=['clown_ball'] * 3, scale=0.15, com=0.0, spins=0.5, tint=[(0.94, 0.35, 0.13), (0.15, 0.62, 0.86), (0.98, 0.80, 0.18)]),
    # sweets (CC0): Tiny Treats Baked Goods by Isa Lousberg; KayKit Halloween Bits by Kay Lousberg. com='auto' = bounding-box centre
    'donut': dict(files=[TT + 'donut_pink', TT + 'donut_chocolate', TT + 'donut'], scale=1.0, com='auto', spins=1.0),
    'candy': dict(files=[HB + 'candy_pink_A', HB + 'candy_orange_A', HB + 'candy_blue_B'], scale=1.0, com='auto', spins=1.0,
                  axis_x=True, grip=0.2),   # wrapped sweet: its long axis (asset X) becomes the juggling axis, so it tumbles end over end
}


def side_sign(side):
    return -1.0 if side == 'r' else 1.0


def hand_target(side, phase):
    """Actor-space IK target at phase 0..2b of this hand's own cycle (0 = release)."""
    s = side_sign(side)
    T = Vector((s * THROW.x, THROW.y, THROW.z)); C = Vector((s * CATCH.x, CATCH.y, CATCH.z))
    V = 2 * BEAT - DWELL                       # empty-hand time: release -> catch
    if phase < V:                              # up and out (follow-through, then reach for the catch)
        u = phase / V
        p0, p1, p2, p3 = T, T + Vector((0, 0, 0.16)), C + Vector((0, -0.02, 0.10)), C
    else:                                      # dwell: catch, scoop down and in, rise into the throw
        u = (phase - V) / DWELL
        p0, p1, p2, p3 = C, C + Vector((0, 0.02, -0.26)), T + Vector((0, 0.03, -0.24)), T
    a = (1 - u) ** 3; b = 3 * u * (1 - u) ** 2; c = 3 * u * u * (1 - u); d = u ** 3
    return p0 * a + p1 * b + p2 * c + p3 * d


def setup(kind='pin'):
    sc = bpy.data.scenes[SC]; bpy.context.window.scene = sc
    arm = bpy.data.objects[ARM]
    col = bpy.data.collections['CL_props']
    sc.view_layers[0].active_layer_collection = sc.view_layers[0].layer_collection.children[col.name]
    for o in [o for o in bpy.data.objects if o.name.startswith(('CL_test_', 'CL_prop_'))]:
        bpy.data.objects.remove(o, do_unlink=True)
    pod = bpy.data.objects.get('CL_podium')
    if pod is None:
        before = set(bpy.data.objects)
        bpy.ops.import_scene.gltf(filepath=KK + 'circus_podium.gltf')
        pod = [x for x in bpy.data.objects if x not in before][0]; pod.name = 'CL_podium'
    arm.location = (0, 0, PODIUM_TOP)
    K = KINDS[kind]; props = []
    for i, f in enumerate(K['files']):
        before = set(bpy.data.objects)
        bpy.ops.import_scene.gltf(filepath=(f if f.startswith('/') else KK + f) + '.gltf')
        o = [x for x in bpy.data.objects if x not in before][0]; o.name = f'CL_prop_{i}'
        o.scale = (K['scale'],) * 3; o.rotation_mode = 'QUATERNION'; o.visible_shadow = False
        if K.get('axis_x'):                              # mesh copy rotated so asset X -> Z; export() undoes it for the runtime
            o.data = o.data.copy(); o.data.transform(AXIS_FIX)
        if K.get('tint'):
            m = bpy.data.materials.new(f'CL_clay_{i}'); m.use_nodes = True
            bs = m.node_tree.nodes['Principled BSDF']; bs.inputs['Base Color'].default_value = (*K['tint'][i], 1)
            bs.inputs['Roughness'].default_value = 0.8
            o.data = o.data.copy(); o.data.materials.clear(); o.data.materials.append(m)
        props.append(o)
    if K['com'] == 'auto':                               # bounding-box centre of the first prop, in prop space
        vs = [v.co for v in props[0].data.vertices]
        K['_com'] = tuple(0.5 * (min(c[i] for c in vs) + max(c[i] for c in vs)) for i in range(3))
    bpy.context.view_layer.update()
    return sc, arm, props


def dip(f):
    """Hips dip after every throw (beat phase 2), wrapped so the beat boundary has no pop (J3 jumped 1.4 cm there)."""
    d = ((f % BEAT) - 2 + BEAT / 2) % BEAT - BEAT / 2
    return -0.018 * math.exp(-(d / 4.0) ** 2)


def bake_body(arm, n=LOOP):
    """Idle_A + IK hands on the cascade loop + a small hips dip at every throw + head tilted up a little."""
    Wi = arm.matrix_world.inverted(); W = arm.matrix_world
    frames = []
    d, i0, i1 = R.chans(BASE); L = i1 - i0
    m = max(1, round(n / L)); k = m * L / n            # fit a whole number of Idle_A cycles into the loop
    for f in range(n):
        pose = R.pose_at(BASE, i0 + f * k, cyclic=True)
        TA._set(arm, {bn: (q, l if l is not None else Vector()) for bn, (q, l) in pose.items()})
        ph = f % BEAT
        TA._lift_hips(arm, dip(f))
        hb = arm.pose.bones['head']; hb.rotation_quaternion = hb.rotation_quaternion @ Quaternion((1, 0, 0), math.radians(-10))
        bpy.context.view_layer.update()
        for side, off in (('r', 0), ('l', BEAT)):
            t = hand_target(side, (f - off) % (2 * BEAT))
            AT._arm_ik(arm, side, Wi @ (W @ t), POLE[side])
        frames.append(TA._basis(arm))
    a = SU.make_action_full('CL|clown|' + CLIP, arm, frames)
    a['clip_id'] = CLIP; a['beat'] = BEAT; a['dwell'] = DWELL; a['flight'] = FLIGHT; a['loop'] = LOOP
    ad = arm.animation_data or arm.animation_data_create(); ad.use_nla = False; ad.action = a
    try: ad.action_slot = a.slots[0]
    except Exception: pass
    return a


def hold_rot(side, u, fwd):
    """Hold direction of the prop's long axis (+Z): leans outward at the catch (u = 0), inward at the throw (u = 1)."""
    s = side_sign(side)
    dc = Vector((s * HOLD_C[0], HOLD_C[1], HOLD_C[2])); dt = Vector((s * HOLD_T[0], HOLD_T[1], HOLD_T[2]))
    d = dc.lerp(dt, u) + math.sin(math.pi * u) * Vector((s * HOLD_DIP[0], HOLD_DIP[1], HOLD_DIP[2]))   # the club swings down-forward in the scoop
    d = d.normalized()
    return d.to_track_quat('Z', 'Y')


def schedule():
    """Throw list for one loop: (beat k, prop, thrower, catcher)."""
    out = []
    for k in range(6):
        thrower = 'r' if k % 2 == 0 else 'l'
        out.append((k, k % 3, thrower, 'l' if thrower == 'r' else 'r'))
    return out


def prop_tracks(arm, props, kind='pin'):
    sc = bpy.data.scenes[SC]; K = KINDS[kind]
    slots = {'r': [], 'l': []}
    for f in range(LOOP):
        sc.frame_set(f)
        for s in 'rl':
            slots[s].append(arm.matrix_world @ arm.pose.bones[f'handslot.{s}'].head)
    com = Vector(K['_com']) * K['scale'] if K['com'] == 'auto' else Vector((0, 0, K['com'] * K['scale']))
    grip = Vector((0, 0, K.get('grip', 0.0) * K['scale']))   # the fist holds the prop this far down its axis (pins: near the knob)
    lat = Vector((1, 0, 0))
    track = {i: [None] * LOOP for i in range(3)}
    throws = schedule()
    for k, p, thr, cat in throws:
        t0 = k * BEAT; t1 = t0 + FLIGHT; t2 = (k + 3) * BEAT
        q_rel = hold_rot(thr, 1.0, None); q_cat = hold_rot(cat, 0.0, None)
        a = slots[thr][t0 % LOOP] + q_rel @ (com + grip)  # release: centre of mass
        b = slots[cat][t1 % LOOP] + q_cat @ (com + grip)  # catch
        g = 8 * APEX / FLIGHT ** 2
        for j in range(FLIGHT + 1):
            u = j / FLIGHT
            c = a.lerp(b, u) + Vector((0, -BOW * 4 * u * (1 - u), 0.5 * g * j * (FLIGHT - j) + 0.0))
            # around the head: on the way up the prop swings out past the face, crosses above the head at the
            # apex and comes down outside the other side (z stays the true parabola)
            if AROUND_MODE == 'seg':
                # J4: three smooth segments, no snap anywhere: swing out to the thrower's side by OUT_U, stay out,
                # cross above the head between CROSS[0] and CROSS[1] (the prop is above the hat there), swing in to
                # the catch over the last OUT_U. Outer widths: rising AROUND_UP, falling AROUND_DOWN.
                e = lambda x: (lambda t: t * t * (3 - 2 * t))(max(0.0, min(1.0, x)))
                st = side_sign(thr); xo_t = st * AROUND_UP; xo_c = -st * AROUND_DOWN
                c.x = (a.x + (xo_t - a.x) * e(u / OUT_U) + (xo_c - xo_t) * e((u - CROSS[0]) / (CROSS[1] - CROSS[0]))
                       + (b.x - xo_c) * e((u - 1 + OUT_U) / OUT_U))
            else:                                                       # J3 / J4a-c: exponent blend (snapped at the apex)
                wb = math.sin(math.pi * u) ** AROUND_EXP
                cu = math.cos(math.pi * u); cu = math.copysign(abs(cu) ** AROUND_SHAPE, cu)
                amp = AROUND_UP if u < 0.5 else AROUND_DOWN
                c.x = (1 - wb) * c.x + wb * (side_sign(thr) * amp * cu)
            c.y -= BOW_APEX * math.sin(math.pi * u) ** BOW_EXP           # extra forward bow only near the apex: above eye level, nearer reads higher
            c.y -= DEPTH_SPLIT * math.sin(math.pi * u) * (1 - 2 * u)   # rising leg a little forward, falling leg a little back
            # eased spin: slow while the prop passes the face on the way up and down, the flip happens above the head
            ue = u - SPIN_EASE * math.sin(2 * math.pi * u) / (2 * math.pi)
            spin = Quaternion(lat, 2 * math.pi * K['spins'] * ue)
            q = spin @ q_rel.slerp(q_cat, u)
            track[p][(t0 + j) % LOOP] = (c - q @ com, q)
        for j in range(t1, t2 + 1):                      # held by the catcher until it throws this prop again
            u = (j - t1) / (t2 - t1)
            q = hold_rot(cat, u, None)
            track[p][j % LOOP] = (slots[cat][j % LOOP] + q @ grip, q)
    for i, o in enumerate(props):
        o.animation_data_clear()
        for f in range(LOOP + 1):
            loc, q = track[i][f % LOOP]
            o.location = loc; o.rotation_quaternion = q
            o.keyframe_insert('location', frame=f); o.keyframe_insert('rotation_quaternion', frame=f)
        for fc in AT.fcurves(o.animation_data.action):
            for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'
            fc.modifiers.new('CYCLES')
    return track


def clearance(arm, props, step=2):
    """min distance prop vertex -> deformed head/hat/body vertex, and prop -> prop, over the loop."""
    sc = bpy.data.scenes[SC]; dg = bpy.context.evaluated_depsgraph_get()
    from mathutils.kdtree import KDTree
    worst_body = (9, None); worst_pp = (9, None)
    for f in range(0, LOOP, step):
        sc.frame_set(f); dg = bpy.context.evaluated_depsgraph_get()
        body = AT.mesh_points(arm, include=('Head', 'Hat', 'Body'))
        kd = KDTree(len(body))
        for i, p in enumerate(body): kd.insert(p, i)
        kd.balance()
        pts = []
        for o in props:
            oe = o.evaluated_get(dg); m = oe.to_mesh(); pts.append([oe.matrix_world @ v.co for v in list(m.vertices)[::3]]); oe.to_mesh_clear()
        for i, P in enumerate(pts):
            d = min(kd.find(p)[2] for p in P)
            if d < worst_body[0]: worst_body = (round(d, 3), f, i)
        for i in range(3):
            for j in range(i + 1, 3):
                kj = KDTree(len(pts[j]))
                for n, p in enumerate(pts[j]): kj.insert(p, n)
                kj.balance()
                d = min(kj.find(p)[2] for p in pts[i])
                if d < worst_pp[0]: worst_pp = (round(d, 3), f, i, j)
    return dict(propToBody=worst_body, propToProp=worst_pp)


def render(out_dir, f0, f1, cam, res=(960, 540)):
    sc = bpy.data.scenes[SC]; os.makedirs(out_dir, exist_ok=True)
    EG.check(sc)
    c = bpy.data.objects.get('CL_RCAM') or bpy.data.objects.new('CL_RCAM', bpy.data.cameras.new('CL_RCAM'))   # never moves the check cameras
    if c.name not in sc.collection.objects: sc.collection.objects.link(c)
    sc.camera = c; c.location = cam[0]; c.data.lens = cam[2]
    c.rotation_euler = (Vector(cam[1]) - Vector(cam[0])).to_track_quat('-Z', 'Y').to_euler()
    sc.render.resolution_x, sc.render.resolution_y = res
    for f in range(f0, f1):
        sc.frame_set(f % LOOP); sc.render.filepath = os.path.join(out_dir, f'f_{f:04d}.png')
        bpy.ops.render.render(write_still=True, scene=sc.name)


def face_overlap(cam_name='CL_CAM'):
    """Screen-space check in the review camera: frames where a prop covers the face box (head verts in front)."""
    from bpy_extras.object_utils import world_to_camera_view
    sc = bpy.data.scenes[SC]; cam = bpy.data.objects[cam_name]; arm = bpy.data.objects[ARM]
    props = [bpy.data.objects[f'CL_prop_{i}'] for i in range(3)]
    hits = []
    for f in range(LOOP):
        sc.frame_set(f); dg = bpy.context.evaluated_depsgraph_get()
        head = [p for p in AT.mesh_points(arm, include=('Head',))]
        Wi = arm.matrix_world.inverted()
        front = [p for p in head if (Wi @ p).y < -0.30 and 1.30 < (Wi @ p).z < 1.95 and abs((Wi @ p).x) < 0.42]   # eyes, nose, mouth
        sp = [world_to_camera_view(sc, cam, p) for p in front]
        x0, x1 = min(v.x for v in sp), max(v.x for v in sp); y0, y1 = min(v.y for v in sp), max(v.y for v in sp)
        depth = min(v.z for v in sp)
        n = 0; who = []
        for o in props:
            oe = o.evaluated_get(dg); m = oe.to_mesh()
            for v in list(m.vertices)[::2]:
                q = world_to_camera_view(sc, cam, oe.matrix_world @ v.co)
                if x0 < q.x < x1 and y0 < q.y < y1 and q.z < depth + 0.6:
                    n += 1; who.append(o.name[-1])
            oe.to_mesh_clear()
        if n: hits.append((f, n, ''.join(sorted(set(who)))))
    return hits


def screen_gaps(cams=('CL_CAM', 'CL_CAM_R', 'CL_CAM_F'), res=(960, 540), step=1):
    """Screen-space read check (J4b critic): per camera, the smallest pixel gap between a flying prop and the
    head/hat outline, and between two flying props. 3D clearance cannot see contact along the line of sight."""
    from bpy_extras.object_utils import world_to_camera_view
    from mathutils.kdtree import KDTree
    sc = bpy.data.scenes[SC]; arm = bpy.data.objects[ARM]
    props = [bpy.data.objects[f'CL_prop_{i}'] for i in range(3)]
    sched = schedule(); flying = {}
    for k, p, thr, cat in sched:
        for j in range(1, FLIGHT):
            flying.setdefault((k * BEAT + j) % LOOP, set()).add(p)
    out = {}
    for cn in cams:
        cam = bpy.data.objects[cn]; worst_h = (1e9,); worst_p = (1e9,)
        for f in range(0, LOOP, step):
            sc.frame_set(f)
            px = lambda w: (lambda v: Vector((v.x * res[0], v.y * res[1], 0)))(world_to_camera_view(sc, cam, w))
            head = [px(p) for p in AT.mesh_points(arm, include=('Head', 'Hat'))[::2]]
            kd = KDTree(len(head))
            for i, p in enumerate(head): kd.insert(p, i)
            kd.balance()
            P = {i: [px(props[i].matrix_world @ v.co) for v in list(props[i].data.vertices)[::3]] for i in flying.get(f, ())}
            for i, Q in P.items():
                d = min(kd.find(q)[2] for q in Q)
                if d < worst_h[0]: worst_h = (round(d, 1), f, i)
            ks = sorted(P)
            for a in range(len(ks)):
                for b in range(a + 1, len(ks)):
                    kb = KDTree(len(P[ks[b]]))
                    for n, q in enumerate(P[ks[b]]): kb.insert(q, n)
                    kb.balance()
                    d = min(kb.find(q)[2] for q in P[ks[a]])
                    if d < worst_p[0]: worst_p = (round(d, 1), f, ks[a], ks[b])
        out[cn] = dict(head_px=worst_h, prop_px=worst_p)
    return out


def head_touch_frames(cams=('CL_CAM', 'CL_CAM_R', 'CL_CAM_F'), thr=6.0, res=(960, 540), step=1):
    """Frames where a prop outline comes within thr px of the head/hat outline (or overlaps it) while the prop is
    nearer to the camera than the head: that reads as contact even with a real 3D gap. Returns {cam: [(f, prop, px)]}."""
    from bpy_extras.object_utils import world_to_camera_view
    from mathutils.kdtree import KDTree
    sc = bpy.data.scenes[SC]; arm = bpy.data.objects[ARM]
    props = [bpy.data.objects[f'CL_prop_{i}'] for i in range(3)]
    pv = [list(o.data.vertices)[::3] for o in props]
    out = {c: [] for c in cams}
    for f in range(0, LOOP, step):
        sc.frame_set(f)
        hp = AT.mesh_points(arm, include=('Head', 'Hat'))[::2]
        for cn in cams:
            cam = bpy.data.objects[cn]
            hv = [world_to_camera_view(sc, cam, p) for p in hp]
            kd = KDTree(len(hv))
            for i, v in enumerate(hv): kd.insert(Vector((v.x * res[0], v.y * res[1], 0)), i)
            kd.balance()
            for i, o in enumerate(props):
                best = (1e9, 0, 0)
                for v in pv[i]:
                    q = world_to_camera_view(sc, cam, o.matrix_world @ v.co)
                    co, idx, d = kd.find(Vector((q.x * res[0], q.y * res[1], 0)))
                    if d < best[0]: best = (d, q.z, hv[idx].z)
                if best[0] < thr and best[1] < best[2]:
                    out[cn].append((f, i, round(best[0], 1)))
    return out


def export(out_dir, kind='pin', clip=None):
    """Pose dump (parent-relative bone matrices per frame, for kfb_pose_dump_to_glb.py) and the prop matrices in
    actor space (Blender) for kfb_prop_tracks_to_gltf.py. No glTF export in live Blender."""
    import json
    sc = bpy.data.scenes[SC]; arm = bpy.data.objects[ARM]; K = KINDS[kind]; clip = clip or CLIP
    props = [bpy.data.objects[f'CL_prop_{i}'] for i in range(3)]
    os.makedirs(out_dir, exist_ok=True)
    Wi = arm.matrix_world.inverted()
    dump = dict(rig='Rig_Medium', parents={b.name: (b.parent.name if b.parent else None) for b in arm.data.bones}, clips={clip: []})
    mats = {o.name: [] for o in props}
    for f in range(LOOP):
        sc.frame_set(f)
        dump['clips'][clip].append({pb.name: [round(x, 7) for r in ((pb.parent.matrix.inverted() @ pb.matrix) if pb.parent else pb.matrix) for x in r]
                                   for pb in arm.pose.bones})
        for o in props:
            M = Wi @ o.matrix_world @ (AXIS_FIX if K.get('axis_x') else Matrix())   # transform of the raw asset
            mats[o.name].append([round(x, 6) for r in M for x in r])
    json.dump(dump, open(os.path.join(out_dir, 'M_pose_dump.json'), 'w'))
    meta = dict(clip=clip, kind=kind, loop=LOOP, beat=BEAT, dwell=DWELL, flight=FLIGHT, apex=APEX, aroundUp=AROUND_UP,
                aroundDown=AROUND_DOWN, aroundExp=AROUND_EXP, aroundShape=AROUND_SHAPE, bow=BOW, spinEase=SPIN_EASE,
                grip=K.get('grip', 0.0), scale=K['scale'], podiumTop=PODIUM_TOP,
                props={o.name: dict(src=K['files'][i].split('/')[-1], path=K['files'][i]) for i, o in enumerate(props)},
                throws=[list(t) for t in schedule()], propMatricesActorSpaceBlender=mats)
    json.dump(meta, open(os.path.join(out_dir, f'prop_tracks_blender_{kind}.json'), 'w'))
    return {fn: os.path.getsize(os.path.join(out_dir, fn)) for fn in os.listdir(out_dir)}
