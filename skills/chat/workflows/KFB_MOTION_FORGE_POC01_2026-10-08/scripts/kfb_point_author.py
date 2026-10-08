"""KFB authored point-forward gesture (#376 Pack 01 follow-up, Georg 2026-10-08).

Georg: the UniMate "point forward" is bad on both rigs (the Orc's arm reads as broken). A point is a simple motion we
can author ourselves: the right arm points straight forward (Orc a bit lower), plus a light upper-body and head move.

Built on Idle_A frame 0 (KayKit faces -Y in armature space). Legs, hips and root never move.
  * arm chain upperarm.r -> lowerarm.r -> wrist.r -> hand.r is aligned to one straight direction D
    (no elbow bend, so no hyperextension); D = forward, tilted down by PITCH, with a small outward bias;
  * chest/spine lean forward a little and twist the pointing shoulder forward; head dips slightly to look along the arm;
  * timing: body leads, arm follows with a small overshoot, one small "there!" pulse in the hold, ease back to Idle_A.
"""
import bpy, math
from mathutils import Vector, Matrix, Quaternion
import kfb_forge as F
import kfb_forge_pack as P

CHAIN = ['upperarm.r', 'lowerarm.r', 'wrist.r', 'hand.r']
PITCH = {'M': -4.0, 'L': -18.0}        # degrees below horizontal (Georg: Orc a bit lower)
OUTWARD = 0.10                          # outward bias so the arm does not cross the body line
LEAN = {'spine': 3.0, 'chest': 4.0}     # forward lean, degrees
TWIST = {'spine': 3.0, 'chest': 5.0}    # pointing shoulder forward, degrees
HEAD_DIP = 6.0                          # head pitch down along the arm, degrees
N = 60                                  # frames at 30 fps


def _apply(T, basis):
    for pb in T.pose.bones:
        if pb.name in basis:
            q, l = basis[pb.name]
            pb.rotation_mode = 'QUATERNION'
            pb.rotation_quaternion = q; pb.location = l
    bpy.context.view_layer.update()


def _rot_about_head(pb, R3):
    M = pb.matrix.copy(); h = M.translation.copy()
    pb.matrix = Matrix.Translation(h) @ R3.to_4x4() @ Matrix.Translation(-h) @ M
    bpy.context.view_layer.update()


def point_pose(T, idle, rig):
    """Return the full-point pose as a basis dict (same layout as kfb_forge_pack)."""
    _apply(T, idle)
    pbs = T.pose.bones
    side = 1.0 if pbs['upperarm.r'].head.x >= 0 else -1.0
    for bn in ('spine', 'chest'):
        if bn in pbs:
            lean = Matrix.Rotation(math.radians(LEAN[bn]), 3, 'X')        # +X rotation tips +Z toward -Y (forward)
            twist = Matrix.Rotation(math.radians(-side * TWIST[bn]), 3, 'Z')
            _rot_about_head(pbs[bn], twist @ lean)
    if 'head' in pbs:
        _rot_about_head(pbs['head'], Matrix.Rotation(math.radians(HEAD_DIP), 3, 'X'))
    p = math.radians(PITCH[rig])
    D = Vector((side * OUTWARD, -math.cos(p), math.sin(p))).normalized()
    for bn in CHAIN:
        pb = pbs[bn]
        M = pb.matrix.copy()
        y = M.to_3x3().col[1].normalized()
        R = y.rotation_difference(D).to_matrix()
        pb.matrix = Matrix.Translation(M.translation) @ (R @ M.to_3x3()).to_4x4()
        bpy.context.view_layer.update()
    return {pb.name: (pb.rotation_quaternion.copy(), pb.location.copy()) for pb in pbs}


def _ease(x):
    x = min(1.0, max(0.0, x)); return x * x * (3 - 2 * x)


def _out(x):
    x = min(1.0, max(0.0, x)); return 1 - (1 - x) ** 3


def arm_w(f):
    if f < 3: return 0.0
    if f < 13: return 1.07 * _out((f - 3) / 10)
    if f < 18: return 1.07 - 0.07 * _ease((f - 13) / 5)
    if f < 42:
        return 1.0 + 0.035 * math.sin(math.pi * min(1.0, max(0.0, (f - 24) / 8)))   # one small "there!" pulse
    if f < 57: return 1.0 - _ease((f - 42) / 15)
    return 0.0


def body_w(f):
    if f < 1: return 0.0
    if f < 11: return _ease((f - 1) / 10)
    if f < 40: return 1.0
    if f < 55: return 1.0 - _ease((f - 40) / 15)
    return 0.0


ARM = set(CHAIN + ['handslot.r'])
BODY = {'spine', 'chest', 'head'}


def _blend(qi, qp, w):
    if qi.dot(qp) < 0: qp = -qp
    d = qp @ qi.inverted()
    ax, ang = d.to_axis_angle()
    return Quaternion(ax, ang * w) @ qi


def sequence(idle, pose):
    seq = []
    for f in range(N):
        fr = {}
        for bn, (qi, li) in idle.items():
            w = arm_w(f) if bn in ARM else body_w(f) if bn in BODY else 0.0
            qp, lp = pose[bn]
            fr[bn] = (_blend(qi, qp, w) if w else qi.copy(), li.lerp(lp, min(w, 1.0)) if w else li.copy())
        seq.append(fr)
    seq[0] = {k: (v[0].copy(), v[1].copy()) for k, v in idle.items()}
    seq[-1] = {k: (v[0].copy(), v[1].copy()) for k, v in idle.items()}
    return seq


def build(rigs=('M', 'L'), cid='kfb_gesture_point_forward_b'):
    sc, win, prev = P._scene()
    rep = []
    try:
        for rig in rigs:
            T = bpy.data.objects[F.TARGETS[rig]]
            keep = T.animation_data.action if T.animation_data else None
            idle = P.idle_basis(T, rig)
            pose = point_pose(T, idle, rig)
            name = f'{rig}|FORGE|PACK|{cid}'
            if name in bpy.data.actions:
                bpy.data.actions.remove(bpy.data.actions[name])
            a = F.make_action(name, T, sequence(idle, pose))
            a['clip_id'] = cid; a['source'] = 'authored (kfb_point_author.py)'
            m = F.measure(T, a, 'T3')
            rep.append(dict(id=cid, rig=rig, action=name, **m))
            if keep: T.animation_data.action = keep
    finally:
        win.scene = prev
    return rep
