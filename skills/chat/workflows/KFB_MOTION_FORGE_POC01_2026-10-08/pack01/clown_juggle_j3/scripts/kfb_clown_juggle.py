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
BEAT, DWELL = 16, 22
FLIGHT = 3 * BEAT - DWELL
LOOP = 6 * BEAT
BOW = 0.70             # forward bow at the apex (actor -Y), keeps the props in front of the face
AROUND = 1.05          # half width of the arc around the head (the chibi head is 1.3 wide, the arms reach 0.5)
AROUND_EXP = 0.2      # how early the prop swings out after the release (smaller = earlier)
APEX = 1.65            # apex above the release point
PODIUM_TOP = 1.0
BASE = 'M|KK|General|Idle_A'
ARM = 'ARM_clown'
# hand IK targets in actor space (actor faces -Y, x < 0 = the actor's right)
THROW = Vector((0.26, -0.46, 0.86))   # inside (wide enough that the rising prop clears the face sooner)
CATCH = Vector((0.44, -0.40, 0.95))   # outside
POLE = {'r': Vector((-1.0, 0.3, -0.6)), 'l': Vector((1.0, 0.3, -0.6))}
KINDS = {
    'pin': dict(files=['juggling_pin_red', 'juggling_pin_yellow', 'juggling_pin_blue'], scale=1.0, com=0.35, spins=1.0),
    'ball': dict(files=['clown_ball'] * 3, scale=0.15, com=0.0, spins=0.5, tint=[(0.94, 0.35, 0.13), (0.15, 0.62, 0.86), (0.98, 0.80, 0.18)]),
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
        bpy.ops.import_scene.gltf(filepath=KK + f + '.gltf')
        o = [x for x in bpy.data.objects if x not in before][0]; o.name = f'CL_prop_{i}'
        o.scale = (K['scale'],) * 3; o.rotation_mode = 'QUATERNION'; o.visible_shadow = False
        if K.get('tint'):
            m = bpy.data.materials.new(f'CL_clay_{i}'); m.use_nodes = True
            bs = m.node_tree.nodes['Principled BSDF']; bs.inputs['Base Color'].default_value = (*K['tint'][i], 1)
            bs.inputs['Roughness'].default_value = 0.8
            o.data = o.data.copy(); o.data.materials.clear(); o.data.materials.append(m)
        props.append(o)
    bpy.context.view_layer.update()
    return sc, arm, props


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
        TA._lift_hips(arm, -0.018 * math.exp(-((ph - 2) / 4.0) ** 2))
        hb = arm.pose.bones['head']; hb.rotation_quaternion = hb.rotation_quaternion @ Quaternion((1, 0, 0), math.radians(-10))
        bpy.context.view_layer.update()
        for side, off in (('r', 0), ('l', BEAT)):
            t = hand_target(side, (f - off) % (2 * BEAT))
            AT._arm_ik(arm, side, Wi @ (W @ t), POLE[side])
        frames.append(TA._basis(arm))
    a = SU.make_action_full('CL|clown|kfb_clown_juggle_cascade3_b', arm, frames)
    a['clip_id'] = 'kfb_clown_juggle_cascade3_b'; a['beat'] = BEAT; a['dwell'] = DWELL; a['flight'] = FLIGHT; a['loop'] = LOOP
    ad = arm.animation_data or arm.animation_data_create(); ad.use_nla = False; ad.action = a
    try: ad.action_slot = a.slots[0]
    except Exception: pass
    return a


def hold_rot(side, u, fwd):
    """Hold direction of the prop's long axis (+Z): leans outward at the catch (u = 0), inward at the throw (u = 1)."""
    s = side_sign(side)
    dc = Vector((s * 0.55, -0.70, 0.55)); dt = Vector((-s * 0.05, -0.85, 0.62))   # forward-out, a little up, below the face
    d = dc.lerp(dt, u).normalized()
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
    com = Vector((0, 0, K['com'] * K['scale']))
    lat = Vector((1, 0, 0))
    track = {i: [None] * LOOP for i in range(3)}
    throws = schedule()
    for k, p, thr, cat in throws:
        t0 = k * BEAT; t1 = t0 + FLIGHT; t2 = (k + 3) * BEAT
        q_rel = hold_rot(thr, 1.0, None); q_cat = hold_rot(cat, 0.0, None)
        a = slots[thr][t0 % LOOP] + q_rel @ com          # release: centre of mass
        b = slots[cat][t1 % LOOP] + q_cat @ com          # catch
        g = 8 * APEX / FLIGHT ** 2
        for j in range(FLIGHT + 1):
            u = j / FLIGHT
            c = a.lerp(b, u) + Vector((0, -BOW * 4 * u * (1 - u), 0.5 * g * j * (FLIGHT - j) + 0.0))
            # around the head: on the way up the prop swings out past the face, crosses above the head at the
            # apex and comes down outside the other side (z stays the true parabola)
            wb = math.sin(math.pi * u) ** AROUND_EXP
            c.x = (1 - wb) * c.x + wb * (side_sign(thr) * AROUND * math.cos(math.pi * u))
            spin = Quaternion(lat, 2 * math.pi * K['spins'] * u)
            q = spin @ q_rel.slerp(q_cat, u)
            track[p][(t0 + j) % LOOP] = (c - q @ com, q)
        for j in range(t1, t2 + 1):                      # held by the catcher until it throws this prop again
            u = (j - t1) / (t2 - t1)
            q = hold_rot(cat, u, None)
            track[p][j % LOOP] = (slots[cat][j % LOOP], q)
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
    c = bpy.data.objects.get('CL_CAM') or bpy.data.objects.new('CL_CAM', bpy.data.cameras.new('CL_CAM'))
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
