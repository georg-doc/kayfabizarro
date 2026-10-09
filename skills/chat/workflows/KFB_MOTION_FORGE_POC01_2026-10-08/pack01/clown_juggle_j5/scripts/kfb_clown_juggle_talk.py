"""Sprint #381 T3: the marketplace performance loop for the juggling Clown (J4, 2026-10-09).

Runtime state machine (all clips 30 fps, Rig_Medium, actor root on the podium top):

    juggle (cascade3_c, 96 f, loops) --joke due, at loop frame 0--> stop (48 f)
    stop --> talk (96 f, loops while the Chatterbox line / bad joke plays) --line done--> resume (120 f)
    resume --> juggle (from frame 0)

* stop: at loop frame 0 the right hand does NOT throw; it keeps its club, catches the club still in the air at
  frame 10 (two clubs in the right hand), the left hand keeps its club; both hands settle, a small "ta-da", rest.
* talk: rest pose holding the clubs (right hand two, fanned; left hand one). The left hand gestures with its club,
  the head nods and tilts. Never in front of the face.
* resume: 24-frame wind-up from rest into the loop's frame-0 pose, then the loop's 96 frames, except that the club
  which is in the air at loop frames 0..10 is still held in the right hand there (a standard 3-club start).
* Idle_A base: all clip boundaries fall on whole Idle_A cycles (24 frames), so the base pose is continuous.
* talkWindows (frames, clip-local) are written to the export: the line may start once the clubs are caught.
"""
import bpy, math, os, json
from mathutils import Vector, Quaternion, Matrix
import kfb_clown_juggle as CJ
import kfb_table_atlas as AT
import kfb_table_activity as TA
import kfb_seat_standup_c as SU
import kfb_stammtisch_realize as R

STOP_N, TALK_N, WIND = 48, 96, 24
RESUME_N = WIND + CJ.LOOP
REST = {'r': Vector((-0.30, -0.40, 0.78)), 'l': Vector((0.34, -0.36, 0.82))}   # J5: elbows bent, clubs in (critic: T-pose)
D_REST1 = (0.75, -0.55, 0.20)     # first club in a hand at rest (x outward); critic T3: anything more upright hugs the cheek
D_FWD = (0.25, -0.92, 0.10)       # right hand, the kept club: forward and level (more upright crossed the cheek in the right 3/4 view)
D_OUT = (0.55, -0.80, 0.05)       # right hand, the caught club: fanned outward, a narrow V (about 20 deg) with D_FWD
OFF2 = (0.07, 0.02, 0.0)          # the outward club sits a little outward in the fist
CLIPS = {'stop': 'kfb_clown_juggle_stop_j5', 'talk': 'kfb_clown_juggle_talk_j5', 'resume': 'kfb_clown_juggle_resume_j5'}   # J4 names without _j5
TALK_WINDOWS = {'stop': [[18, STOP_N - 1]], 'talk': [[0, TALK_N - 1]], 'resume': []}


def ss(x):
    x = max(0.0, min(1.0, x)); return x * x * (3 - 2 * x)


def sv(side, t):
    s = CJ.side_sign(side); return Vector((s * t[0], t[1], t[2]))


def qd(side, d):
    return sv(side, d).normalized().to_track_quat('Z', 'Y')


# ---------------------------------------------------------------- body
def _targets(clip, f):
    """(r target, l target, head pitch deg, head roll deg, hips dz) in actor space."""
    if clip == 'stop':
        tr = CJ.hand_target('r', f)                              # same path as the loop up to the catch at f10
        w = ss((f - 10) / 20.0); tr = tr.lerp(REST['r'], w)
        tl = CJ.hand_target('l', (f - CJ.BEAT) % (2 * CJ.BEAT)).lerp(REST['l'], ss(f / 22.0))
        tada = math.sin(math.pi * ss((f - 28) / 18.0))            # a small "ta-da": both hands up and out
        tr = tr + Vector((-0.12, -0.06, 0.40)) * tada; tl = tl + Vector((0.12, -0.06, 0.40)) * tada
        pitch = CJ.HEAD_PITCH * (1 - ss((f - 8) / 22.0)) - 8 * tada
        return tr, tl, pitch, 0.0, CJ.dip(f) * (1 - ss(f / 8.0))
    if clip == 'talk':
        a = 2 * math.pi * f / 48.0; b = 2 * math.pi * f / 96.0
        tl = REST['l'] + Vector((0.12 * (0.5 - 0.5 * math.cos(a)), -0.10 * math.sin(b), 0.26 * abs(math.sin(a))))   # gestures out and up
        tr = REST['r'] + Vector((-0.02 * math.sin(b), 0.0, 0.03 * math.sin(2 * b)))
        pitch = 9 * math.sin(2 * math.pi * f / 24.0) * (0.6 + 0.4 * math.sin(b)) ** 2   # nods, stronger and weaker
        roll = 11 * math.sin(b)
        return tr, tl, pitch, roll, 0.0
    if clip == 'resume':
        if f < WIND:
            w = ss(f / WIND)
            tr = REST['r'].lerp(CJ.hand_target('r', 0), w); tl = REST['l'].lerp(CJ.hand_target('l', CJ.BEAT), w)
            tr = tr + Vector((0, 0, -0.06)) * math.sin(math.pi * ss((f - 8) / 16.0))   # small anticipation dip
            return tr, tl, CJ.HEAD_PITCH * w, 0.0, CJ.dip(f - WIND) * ss((f - 12) / 12.0)
        g = f - WIND
        return CJ.hand_target('r', g % (2 * CJ.BEAT)), CJ.hand_target('l', (g - CJ.BEAT) % (2 * CJ.BEAT)), CJ.head_pitch(g), 0.0, CJ.dip(g)
    raise KeyError(clip)


def bake(arm, clip, n):
    Wi = arm.matrix_world.inverted(); W = arm.matrix_world
    d, i0, i1 = R.chans(CJ.BASE); L = i1 - i0
    k = round(CJ.LOOP / L) * L / CJ.LOOP                           # same Idle_A speed as the loop (24-frame cycle)
    frames = []
    for f in range(n):
        pose = R.pose_at(CJ.BASE, i0 + f * k, cyclic=True)
        TA._set(arm, {bn: (q, l if l is not None else Vector()) for bn, (q, l) in pose.items()})
        tr, tl, pitch, roll, dz = _targets(clip, f)
        TA._lift_hips(arm, dz)
        hb = arm.pose.bones['head']
        hb.rotation_quaternion = hb.rotation_quaternion @ Quaternion((1, 0, 0), math.radians(pitch)) @ Quaternion((0, 1, 0), math.radians(roll))
        bpy.context.view_layer.update()
        for side, t in (('r', tr), ('l', tl)):
            AT._arm_ik(arm, side, Wi @ (W @ t), CJ.POLE[side])
        frames.append(TA._basis(arm))
    a = SU.make_action_full('CL|clown|' + CLIPS[clip], arm, frames)
    a['clip_id'] = CLIPS[clip]
    return a


def use(arm, action):
    ad = arm.animation_data or arm.animation_data_create(); ad.use_nla = False; ad.action = action
    try: ad.action_slot = action.slots[0]
    except Exception: pass


# ---------------------------------------------------------------- props
def _slots(arm, action, n):
    sc = bpy.data.scenes[CJ.SC]; use(arm, action); out = {'r': [], 'l': []}
    for f in range(n):
        sc.frame_set(f)
        for s in 'rl':
            out[s].append(arm.matrix_world @ arm.pose.bones[f'handslot.{s}'].head)
    return out


def _held(slot, side, q, second=False, kind='pin'):
    K = CJ.KINDS[kind]; grip = Vector((0, 0, K.get('grip', 0.0) * K['scale']))
    p = slot + q @ grip
    if second: p = p + sv(side, OFF2)
    return p, q


def prop_tracks(arm, acts, loop_track, kind='pin'):
    """Per clip: {prop index: [(loc, quat)] * n} in world space (actor on the podium). loop_track = CJ.prop_tracks()."""
    W = arm.matrix_world; out = {}
    # stop
    sl = _slots(arm, acts['stop'], STOP_N); T = {i: [] for i in range(3)}
    for f in range(STOP_N):
        w2 = ss((f - 10) / 20.0)
        # prop 0: kept by the right hand (it was about to be thrown); becomes the second club once prop 2 lands
        q0 = CJ.hold_rot('r', 1.0, None).slerp(qd('r', D_FWD), ss(f / 10.0))   # turns forward, making room for the catch
        T[0].append(_held(sl['r'][f], 'r', q0, kind=kind))
        # prop 2: in the air until frame 10 (loop track), then caught by the right hand
        if f <= 10:
            T[2].append(loop_track[2][f])
        else:
            q = CJ.hold_rot('r', 0.0, None).slerp(qd('r', D_OUT), ss((f - 10) / 8.0))   # closes into the V right after the catch
            p, q = _held(sl['r'][f], 'r', q, kind=kind)
            T[2].append((p + sv('r', OFF2) * w2, q))
        # prop 1: held by the left hand all along
        u = (f + 6) / CJ.DWELL
        q1 = CJ.hold_rot('l', min(u, 1.0), None).slerp(qd('l', D_REST1), ss(f / 22.0))
        T[1].append(_held(sl['l'][f], 'l', q1, kind=kind))
    out['stop'] = T
    # talk
    sl = _slots(arm, acts['talk'], TALK_N); T = {i: [] for i in range(3)}
    for f in range(TALK_N):
        b = 2 * math.pi * f / 96.0; a = 2 * math.pi * f / 48.0
        T[0].append(_held(sl['r'][f], 'r', qd('r', D_FWD), kind=kind))
        T[2].append(_held(sl['r'][f], 'r', qd('r', D_OUT), second=True, kind=kind))
        wag = Quaternion((0, 1, 0), 0.25 * math.sin(a)) @ Quaternion((1, 0, 0), 0.15 * math.sin(b))   # the pointing club wags
        T[1].append(_held(sl['l'][f], 'l', wag @ qd('l', D_REST1), kind=kind))
    out['talk'] = T
    # resume
    sl = _slots(arm, acts['resume'], RESUME_N); T = {i: [] for i in range(3)}
    for f in range(RESUME_N):
        g = f - WIND
        if g < 0:
            w = ss(f / WIND)
            T[0].append(_held(sl['r'][f], 'r', qd('r', D_FWD).slerp(CJ.hold_rot('r', 1.0, None), w), kind=kind))
            T[2].append(_held(sl['r'][f], 'r', qd('r', D_OUT), second=True, kind=kind))
            T[1].append(_held(sl['l'][f], 'l', qd('l', D_REST1).slerp(CJ.hold_rot('l', 6 / CJ.DWELL, None), w), kind=kind))
            continue
        for i in range(3):
            T[i].append(loop_track[i][g % CJ.LOOP])
        if g <= 10:                                         # prop 2 is still in the right hand (it was never thrown)
            w = ss(g / 10.0)
            q = qd('r', D_OUT).slerp(CJ.hold_rot('r', 0.0, None), w)
            p, q = _held(sl['r'][f], 'r', q, kind=kind); p = p + sv('r', OFF2) * (1 - w)
            T[2][-1] = (p, q)
    out['resume'] = T
    return out


def apply(props, track, f):
    for i, o in enumerate(props):
        loc, q = track[i][f]; o.location = loc; o.rotation_quaternion = q


def check(arm, props, acts, tracks, step=1):
    """Clearance per clip: prop -> head / hat / body, prop -> prop; screen face cover in the three check cameras."""
    from mathutils.kdtree import KDTree
    from bpy_extras.object_utils import world_to_camera_view
    sc = bpy.data.scenes[CJ.SC]; out = {}
    for clip, n in (('stop', STOP_N), ('talk', TALK_N), ('resume', RESUME_N)):
        use(arm, acts[clip]); wb = (9,); wp = (9,); face = 0
        for f in range(0, n, step):
            sc.frame_set(f); apply(props, tracks[clip], f); bpy.context.view_layer.update()
            body = AT.mesh_points(arm, include=('Head', 'Hat', 'Body'))
            kd = KDTree(len(body))
            for i, p in enumerate(body): kd.insert(p, i)
            kd.balance()
            P = [[o.matrix_world @ v.co for v in list(o.data.vertices)[::3]] for o in props]
            for i, Q in enumerate(P):
                d = min(kd.find(q)[2] for q in Q)
                if d < wb[0]: wb = (round(d, 3), f, i)
            for i in range(3):
                for j in range(i + 1, 3):
                    d = min((a - b).length for a in P[i][::2] for b in P[j][::2])
                    if d < wp[0]: wp = (round(d, 3), f, i, j)
            Wi = arm.matrix_world.inverted()
            front = [p for p in AT.mesh_points(arm, include=('Head',)) if (Wi @ p).y < -0.25 and 1.15 < (Wi @ p).z < 2.0 and abs((Wi @ p).x) < 0.60]   # eyes, cheeks, mouth
            for cn in ('CL_CAM', 'CL_CAM_R', 'CL_CAM_F'):
                cam = bpy.data.objects[cn]
                sp = [world_to_camera_view(sc, cam, p) for p in front]
                x0, x1 = min(v.x for v in sp), max(v.x for v in sp); y0, y1 = min(v.y for v in sp), max(v.y for v in sp)
                depth = min(v.z for v in sp)
                hit = any(x0 < q.x < x1 and y0 < q.y < y1 and q.z < depth + 0.6
                          for Q in P for q in (world_to_camera_view(sc, cam, v) for v in Q[::2]))
                face += hit
        out[clip] = dict(propToBody=wb, propToProp=wp, faceFrames=face)
    return out


def continuity(arm, acts, loop_action):
    """Max bone-matrix jump (actor space, translation) across the four joins, vs a normal in-clip frame step."""
    sc = bpy.data.scenes[CJ.SC]
    def snap(action, f):
        use(arm, action); sc.frame_set(f)
        return {pb.name: pb.matrix.copy() for pb in arm.pose.bones}
    def diff(A, B):
        return round(max((A[k].translation - B[k].translation).length for k in A), 4)
    lp = loop_action
    joins = {'loop95->stop0': (snap(lp, CJ.LOOP - 1), snap(acts['stop'], 0)),
             'stop47->talk0': (snap(acts['stop'], STOP_N - 1), snap(acts['talk'], 0)),
             'talk95->talk0': (snap(acts['talk'], TALK_N - 1), snap(acts['talk'], 0)),
             'talk95->resume0': (snap(acts['talk'], TALK_N - 1), snap(acts['resume'], 0)),
             'resume119->loop0': (snap(acts['resume'], RESUME_N - 1), snap(lp, 0)),
             'ref loop0->loop1': (snap(lp, 0), snap(lp, 1))}
    out = {k: diff(*v) for k, v in joins.items()}
    use(arm, lp)
    return out


def render(acts, tracks, props, arm, out_dir, clip, cam, f0=0, f1=None, res=(960, 540)):
    import kfb_eye_guard as EG
    sc = bpy.data.scenes[CJ.SC]; os.makedirs(out_dir, exist_ok=True); EG.check(sc)
    c = bpy.data.objects.get('CL_RCAM') or bpy.data.objects.new('CL_RCAM', bpy.data.cameras.new('CL_RCAM'))
    if c.name not in sc.collection.objects: sc.collection.objects.link(c)
    sc.camera = c; c.location = cam[0]; c.data.lens = cam[2]
    c.rotation_euler = (Vector(cam[1]) - Vector(cam[0])).to_track_quat('-Z', 'Y').to_euler()
    sc.render.resolution_x, sc.render.resolution_y = res
    use(arm, acts[clip])
    for o in props: o.animation_data_clear()
    n = len(tracks[clip][0])
    for f in range(f0, f1 if f1 is not None else n):
        sc.frame_set(f); apply(props, tracks[clip], f)
        sc.render.filepath = os.path.join(out_dir, f'f_{f:04d}.png')
        bpy.ops.render.render(write_still=True, scene=sc.name)


def export(arm, acts, loop_action, tracks, loop_track, out_dir, kind='pin'):
    """Pose dump for all four clips + prop matrices per clip (actor space, Blender) for the cloud GLB / JSON builders."""
    sc = bpy.data.scenes[CJ.SC]; os.makedirs(out_dir, exist_ok=True); K = CJ.KINDS[kind]
    Wi = arm.matrix_world.inverted(); fix = CJ.AXIS_FIX if K.get('axis_x') else Matrix()
    seq = [(CJ.CLIP, loop_action, CJ.LOOP)] + [(CLIPS[c], acts[c], n) for c, n in (('stop', STOP_N), ('talk', TALK_N), ('resume', RESUME_N))]
    dump = dict(rig='Rig_Medium', parents={b.name: (b.parent.name if b.parent else None) for b in arm.data.bones}, clips={})
    for cid, act, n in seq:
        use(arm, act); fr = []
        for f in range(n):
            sc.frame_set(f)
            fr.append({pb.name: [round(x, 7) for r in ((pb.parent.matrix.inverted() @ pb.matrix) if pb.parent else pb.matrix) for x in r]
                       for pb in arm.pose.bones})
        dump['clips'][cid] = fr
    use(arm, loop_action)
    json.dump(dump, open(os.path.join(out_dir, 'M_pose_dump.json'), 'w'))
    def mats(track):
        rows = {}
        for i in range(3):
            rows[i] = []
            for loc, q in track[i]:
                M = Wi @ Matrix.LocRotScale(loc, q, Vector((K['scale'],) * 3)) @ fix
                rows[i].append([round(x, 6) for r in M for x in r])
        return rows
    loop_rows = {i: [(Vector(l), Quaternion(q)) for l, q in loop_track[i][:CJ.LOOP]] for i in range(3)}
    meta = dict(kind=kind, scale=K['scale'], props={i: K['files'][i].split('/')[-1] for i in range(3)},
                propPaths={i: K['files'][i] for i in range(3)},
                clips={CJ.CLIP: dict(frames=CJ.LOOP, loop=True, talkWindows=[], next='self or ' + CLIPS['stop'], rows=mats(loop_rows)),
                       CLIPS['stop']: dict(frames=STOP_N, loop=False, talkWindows=TALK_WINDOWS['stop'], next=CLIPS['talk'], rows=mats(tracks['stop'])),
                       CLIPS['talk']: dict(frames=TALK_N, loop=True, talkWindows=TALK_WINDOWS['talk'], next=CLIPS['resume'], rows=mats(tracks['talk'])),
                       CLIPS['resume']: dict(frames=RESUME_N, loop=False, talkWindows=[], next=CJ.CLIP, rows=mats(tracks['resume']))},
                timing=dict(beat=CJ.BEAT, dwell=CJ.DWELL, flight=CJ.FLIGHT, apex=CJ.APEX, aroundUp=CJ.AROUND_UP, aroundDown=CJ.AROUND_DOWN,
                            aroundShape=CJ.AROUND_SHAPE, aroundExp=CJ.AROUND_EXP, bow=CJ.BOW, spinEase=CJ.SPIN_EASE, grip=K.get('grip', 0.0)),
                throws=[list(t) for t in CJ.schedule()], podiumTop=CJ.PODIUM_TOP)
    json.dump(meta, open(os.path.join(out_dir, f'prop_tracks_blender_{kind}.json'), 'w'))
    return {fn: os.path.getsize(os.path.join(out_dir, fn)) for fn in sorted(os.listdir(out_dir))}
