"""
KFB · ORB · joint-limit audit for KayKit rigs (Rig_Medium / Rig_Large, 23 bones).

Georg 2026-09-23: "wir muessen solche Extrem-Haltungen & Biegungen verhindern durch Limits".
Every candidate clip must pass this audit BEFORE it is shown. It measures, per frame and per arm:
  - elbow angle      (180 = straight; from joint positions shoulder-elbow-wrist, axis-independent)
  - wrist bend       (rotation of hand relative to forearm, compared with the rest pose; 0 = as modelled)
  - forearm twist    (twist of lowerarm relative to upperarm about the forearm axis, vs rest)
and flags every frame outside LIMITS.

Usage (inside Blender): audit(rig_object, frames) -> dict; or audit_glb(path) for an exported module.
"""
import bpy, math
from mathutils import Vector

# Stylised-cartoon limits (candidate; Georg to confirm). Exceeding = FAIL, not "tune later".
LIMITS = {
    "elbow_min": 35.0,        # deg; smaller = arm folded into itself
    "wrist_max": 35.0,        # deg total bend of hand vs forearm (flex/extension + deviation)
    "twist_max": 70.0,        # deg forearm twist vs rest (pronation/supination budget)
}


def _rel(pb_a, pb_b):
    return pb_a.matrix.to_quaternion().inverted() @ pb_b.matrix.to_quaternion()


def _rel_rest(ba, bb):
    return ba.matrix_local.to_quaternion().inverted() @ bb.matrix_local.to_quaternion()


def _twist_deg(q, axis):
    # swing-twist decomposition: twist of q about axis
    p = Vector((q.x, q.y, q.z)).project(axis)
    t = (q.w, p.x, p.y, p.z)
    n = math.sqrt(sum(c * c for c in t)) or 1.0
    w = abs(t[0] / n)
    return math.degrees(2 * math.acos(min(1.0, w)))


def measure(rig, side):
    pb, bb = rig.pose.bones, rig.data.bones
    s = side
    S = pb[f"upperarm.{s}"].head; E = pb[f"lowerarm.{s}"].head; W = pb[f"hand.{s}"].head
    elbow = math.degrees((S - E).angle(W - E))
    dq = _rel(pb[f"lowerarm.{s}"], pb[f"hand.{s}"]) @ _rel_rest(bb[f"lowerarm.{s}"], bb[f"hand.{s}"]).inverted()
    wrist = math.degrees(dq.angle) if dq.angle <= math.pi else 360 - math.degrees(dq.angle)
    tq = _rel(pb[f"upperarm.{s}"], pb[f"lowerarm.{s}"]) @ _rel_rest(bb[f"upperarm.{s}"], bb[f"lowerarm.{s}"]).inverted()
    twist = _twist_deg(tq, Vector((0, 1, 0)))
    return round(elbow, 1), round(wrist, 1), round(twist, 1)


def audit(rig, frames):
    sc = bpy.context.scene
    worst = {"elbow_min": 999, "wrist_max": 0, "twist_max": 0}
    fails = []
    for f in frames:
        sc.frame_set(f)
        for s in "lr":
            e, w, t = measure(rig, s)
            worst["elbow_min"] = min(worst["elbow_min"], e)
            worst["wrist_max"] = max(worst["wrist_max"], w)
            worst["twist_max"] = max(worst["twist_max"], t)
            bad = []
            if e < LIMITS["elbow_min"]: bad.append(f"elbow {e}")
            if w > LIMITS["wrist_max"]: bad.append(f"wrist {w}")
            if t > LIMITS["twist_max"]: bad.append(f"twist {t}")
            if bad:
                fails.append((f, s, bad))
    return {"worst": worst, "failFrames": len({(f, s) for f, s, _ in fails}),
            "framesChecked": len(list(frames)) * 2, "firstFails": fails[:8], "limits": LIMITS}


def audit_glb(path, rig_hint="Brute", clip="drum", frames=range(0, 48)):
    """Import an exported module GLB into a temp collection, play `clip` on the armature, audit it, clean up."""
    before = set(bpy.data.objects); ba = set(bpy.data.actions)
    col = bpy.data.collections.new("_audit_import"); bpy.context.scene.collection.children.link(col)
    bpy.context.view_layer.active_layer_collection = bpy.context.view_layer.layer_collection.children[col.name]
    bpy.ops.import_scene.gltf(filepath=path)
    try:
        rig = [o for o in bpy.data.objects if o not in before and o.type == "ARMATURE" and rig_hint in o.name][0]
        ad = rig.animation_data
        for t in ad.nla_tracks:
            t.mute = not t.name.startswith(clip)
        bpy.context.view_layer.update()
        return audit(rig, frames)
    finally:
        for o in list(col.objects):
            bpy.data.objects.remove(o, do_unlink=True)
        bpy.data.collections.remove(col)
        for a in [a for a in bpy.data.actions if a not in ba and a.users == 0]:
            bpy.data.actions.remove(a)
        bpy.data.orphans_purge(do_recursive=True)
