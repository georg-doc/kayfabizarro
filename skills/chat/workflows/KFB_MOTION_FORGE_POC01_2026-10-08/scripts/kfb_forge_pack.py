"""KFB Motion Forge pack 01 (#376 follow-up, Georg 2026-10-08: "so bauen, dass wir es nutzen können").

Builds usable clips on Rig_Medium (ARM_farmer_b) and Rig_Large (ARM_orcbrute), scene 369_ISOLATION, 30 fps:
  * UniMate picks (POC 01): point low, point forward (lane A, Medium source, also driven onto Large), kneel offer
    (lane B, Mixamo-model source onto both rigs).
  * Georg's Mixamo shrug (M/L|MX|perf|kfb_perf_shrug_georg_raw), tuned per Georg: arms less far back, shorter hold.
Every clip starts and ends exactly on KayKit Idle_A frame 0 (smoothstep transitions), feet/knees are lifted out of
the ground per frame, and it is measured with the #369 QA (kfb_forge.measure).
"""
import bpy, os, math, json
from mathutils import Vector, Matrix, Quaternion
import kfb_forge as F

IDLE = {'M': 'M|KK|General|Idle_A', 'L': 'L|KK|General|Idle_A'}
DESC = {'upperarm.l': ['upperarm.l', 'lowerarm.l', 'wrist.l', 'hand.l', 'handslot.l'],
        'upperarm.r': ['upperarm.r', 'lowerarm.r', 'wrist.r', 'hand.r', 'handslot.r']}


def _scene():
    sc = bpy.data.scenes[F.SCENE]; win = bpy.context.window; prev = win.scene; win.scene = sc
    return sc, win, prev


def idle_basis(T, rig):
    """Pose basis (q, loc) of Idle_A frame 0 for every bone."""
    F.use_action(T, bpy.data.actions[IDLE[rig]])
    bpy.context.scene.frame_set(int(bpy.data.actions[IDLE[rig]].frame_range[0]))
    return {pb.name: (pb.rotation_quaternion.copy(), pb.location.copy()) for pb in T.pose.bones}


def sample_arm(T, action, src_frames):
    """Armature-space bone matrices at (fractional) source frames."""
    F.use_action(T, bpy.data.actions[action])
    sc = bpy.context.scene
    out = []
    for s in src_frames:
        fi = int(math.floor(s)); sub = s - fi
        sc.frame_set(fi, subframe=sub)
        out.append({pb.name: pb.matrix.copy() for pb in T.pose.bones})
    rest = {b.name: b.matrix_local.copy() for b in T.data.bones}
    return out, rest


def arms_forward(frames, keep=0.35):
    """Georg: arms go too far back. Rotate each arm chain about the shoulder so the hand's backward offset
    (armature +Y = behind; KayKit faces -Y) relative to frame 0 is reduced to `keep`."""
    ref = frames[0]
    for fr in frames:
        for ua, chain in DESC.items():
            sh = fr[ua].translation.copy()
            hand = fr[chain[3]].translation.copy()
            y0 = ref[chain[3]].translation.y
            if hand.y <= y0:
                continue
            tgt = hand.copy(); tgt.y = y0 + (hand.y - y0) * keep
            R = (hand - sh).rotation_difference(tgt - sh).to_matrix().to_4x4()
            P = Matrix.Translation(sh) @ R @ Matrix.Translation(-sh)
            for b in chain:
                fr[b] = P @ fr[b]
    return frames


def smooth(x):
    return x * x * (3 - 2 * x)


LOWER = ('root', 'hips', 'upperleg.l', 'lowerleg.l', 'foot.l', 'toes.l', 'upperleg.r', 'lowerleg.r', 'foot.r', 'toes.r')


def upper_body_only(out, idle):
    """Gestures: legs, hips and root stay on Idle_A frame 0 (KayKit stance, feet never slide); the clip drives
    spine, chest, head and arms only (same upper-body mask idea as the KayKit loco set / #369 layers)."""
    for basis in out:
        for bn in LOWER:
            if bn in basis and bn in idle:
                basis[bn] = idle[bn]
    return out


def with_transitions(out, idle, n_in=10, n_out=10):
    """Idle_A frame 0 -> clip -> Idle_A frame 0 (smoothstep slerp / lerp on every bone's basis)."""
    def mix(a, b, w):
        res = {}
        for bn in a:
            qa, la = a[bn]; qb, lb = b[bn]
            if qa.dot(qb) < 0:
                qb = -qb
            res[bn] = (qa.slerp(qb, w), la.lerp(lb, w))
        return res
    first, last = out[0], out[-1]
    seq = [idle]
    seq += [mix(idle, first, smooth(i / n_in)) for i in range(1, n_in)]
    seq += out
    seq += [mix(last, idle, smooth(i / n_out)) for i in range(1, n_out)]
    seq += [idle]
    return seq


def ground_fix(T, out, margin=0.0):
    """Per-frame hips lift so toes, feet and knees stay at or above armature z 0 (Georg's ground-clearance rule)."""
    a = F.make_action('_FORGE_TMP', T, out)
    F.use_action(T, a)
    sc = bpy.context.scene
    lifts = []
    for i in range(len(out)):
        sc.frame_set(i)
        low = min(T.pose.bones[b].head.z for b in ('toes.l', 'toes.r', 'foot.l', 'foot.r', 'lowerleg.l', 'lowerleg.r'))
        lifts.append(max(0.0, margin - low))
    bpy.data.actions.remove(a)
    # widen + soften so the lift does not pop
    n = len(lifts)
    wide = [max(lifts[max(0, i - 3):min(n, i + 4)]) for i in range(n)]
    soft = [sum(wide[max(0, i - 2):min(n, i + 3)]) / len(wide[max(0, i - 2):min(n, i + 3)]) for i in range(n)]
    Rinv = T.data.bones['hips'].matrix_local.to_3x3().inverted()
    for i, basis in enumerate(out):
        if soft[i] > 0:
            q, l = basis['hips']
            basis['hips'] = (q, l + Rinv @ Vector((0, 0, soft[i])))
    return out, max(lifts)


def from_unimate(rig, glb, lane):
    T = bpy.data.objects[F.TARGETS[rig]]
    arm, objs = F.import_glb(glb)
    smap = F.src_name_map(arm, lane)
    frames, srest = F.sample(arm)
    F.cleanup(objs)
    out, k = F.retarget(frames, srest, smap, T)
    return T, out


def from_own(rig, action, src_frames, keep=0.35):
    T = bpy.data.objects[F.TARGETS[rig]]
    frames, rest = sample_arm(T, action, src_frames)
    frames = arms_forward(frames, keep)
    smap = {b.name: b.name for b in T.data.bones}
    out, k = F.retarget(frames, rest, smap, T, align=False)
    return T, out


def shrug_timing(fps_src=24.0, fps_out=30.0, hold_src=9.0):
    """Georg's Mixamo shrug (source 24 fps, 1..68): rise 1-16, hold 16-40, drop 40-52, settle 52-58.
    New timing: rise and drop unchanged, hold shortened to `hold_src` source frames, settle trimmed."""
    segs = [(1, 16, 15), (16, 40, hold_src), (40, 52, 12), (52, 58, 6)]   # (src start, src end, output length in src frames)
    total = sum(s[2] for s in segs)
    n = int(round(total / fps_src * fps_out)) + 1
    out = []
    for i in range(n):
        t = i / (n - 1) * total
        acc = 0
        for a, b, L in segs:
            if t <= acc + L or (a, b, L) == segs[-1]:
                u = min(1.0, max(0.0, (t - acc) / L))
                out.append(a + (b - a) * u); break
            acc += L
    return out


CLIPS = [
    # id, group, label_de, source kind, source, rigs
    # id, group, label_de, kind, source, task, upper-body only, transition frames
    ('kfb_gesture_point_low_a', 'gesture', 'Zeigen nach vorn-unten (hüfthoch)', 'unimate', ('A_medium', 'A', 'KFB_RigMedium_FarmerB-an_object_kneels_on_its_right_knee_points_then-rep_2-'), 'T3', True, 10),
    ('kfb_gesture_point_forward_a', 'gesture', 'Zeigen nach vorn (Brusthöhe, kopffrei)', 'unimate', ('A_medium', 'A', 'KFB_RigMedium_FarmerB-an_object_points_forward_and_down_with_its_right-rep_1-'), 'T3', True, 10),
    ('kfb_interaction_kneel_offer_a', 'interaction', 'Hinknien und nach vorn anbieten', 'unimate', ('B_mixamo', 'B', 'mixamo-an_object_kneels_on_its_right_knee_and_holds-rep_1-'), 'T2', False, 16),
    ('kfb_gesture_shrug_georg_a', 'gesture', 'Schulterzucken (Georgs Mixamo, Arme weniger nach hinten, kürzer gehalten)', 'own', 'shrug_georg_raw', 'T1', True, 8),
]


def find_glb(run, stem):
    d = os.path.join(F.FORGE, 'samples', run, 'animated')
    c = sorted(f for f in os.listdir(d) if f.startswith(stem) and f.endswith('.glb'))
    if not c:
        raise FileNotFoundError(stem)
    return os.path.join(d, c[0])


def build(rigs=('M', 'L'), n_in=10, n_out=10, hold_src=9.0, keep=0.35):
    sc, win, prev = _scene()
    rep = []
    try:
        for cid, group, label, kind, src, task, upper, ntr in CLIPS:
            for rig in rigs:
                if kind == 'unimate':
                    run, lane, stem = src
                    T, out = from_unimate(rig, find_glb(run, stem), lane)
                else:
                    T, out = from_own(rig, f'{rig}|MX|perf|kfb_perf_{src}', shrug_timing(hold_src=hold_src), keep)
                idle = idle_basis(T, rig)
                if upper:
                    out = upper_body_only(out, idle)
                seq = with_transitions(out, idle, ntr, ntr)
                seq, lift = ground_fix(T, seq)
                name = f'{rig}|FORGE|PACK|{cid}'
                a = F.make_action(name, T, seq)
                a['clip_id'] = cid; a['source'] = json.dumps(src)
                m = F.measure(T, a, task)
                rep.append(dict(id=cid, rig=rig, action=name, groundLift=round(lift, 4), **m))
    finally:
        win.scene = prev
    return rep
