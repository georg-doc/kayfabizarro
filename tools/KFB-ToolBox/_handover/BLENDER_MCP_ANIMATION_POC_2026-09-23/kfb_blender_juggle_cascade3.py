"""
KFB · Blender MCP Animation POC · Clown 3-club cascade (JUG-P1)

Reproduces the accepted POC from a plain KayKit Clown scene:
  1. import the three KayKit juggling pins (red / yellow / blue)
  2. attach them by the Resident Atlas identity rule at `handslot.*`
  3. key a 16-frame hand cycle per hand (throw / follow / catch / dip), L offset 8
  4. bake the pins per frame (hand -> flight -> other hand), 48-frame loop @ 24 fps
  5. verify clearance against the *deformed* head / hat / body meshes

Run inside Blender (Text Editor, or the Blender MCP `execute_blender_code`) with a
scene that contains the KayKit Clown (`Rig_Medium` + `Clown_*` meshes).
Tested: Blender 5.2.2 LTS, KayKit Mystery Monthly Series 4 · 11 · May 2024 · Clown.

Rules applied (see tools/resident_atlas_s6/docs/ATLAS_NEXT_SLICES.md):
  - Identity first: prop origin = grip; scale 1; no free rotation. In T-pose the
    handslot's forward axis is the prop's long axis (glTF +Y == Blender +Z of the prop).
  - Orientation comes from the arm (forearm direction + wrist twist), never from
    rotating the prop.
  - Measure against real vertex clouds, not bounding boxes.
"""
import bpy, math, os
from math import radians, pi
from mathutils import Vector, Matrix, Quaternion

# ---------------------------------------------------------------- config
RIG = "Rig_Medium"
PIN_DIR = os.environ.get("KFB_CLOWN_GLTF_DIR", "")  # folder with juggling_pin_*.gltf
PINS = {"juggling_pin_red": 0, "juggling_pin_yellow": 16, "juggling_pin_blue": 32}  # phase offsets
PERIOD = 48          # frames per full loop (each pin: R->L flight, L hold, L->R flight, R hold)
HAND_PERIOD = 16     # each hand throws every 16 frames
HAND_OFFSET = {"r": 0, "l": 8}
FLIGHT = 20          # frames in the air
APEX = 2.5           # extra height at mid-flight
Y_FORWARD = -0.6     # flights bow forward, in front of the face
ACTION = "Clown_Juggle_Cascade3"

# arm pose library (LEFT side, mirrored for right): upperarm dir, forearm dir, twist deg
# found by search: grip on target, prop long axis up, no penetration of the head ellipsoid
POSES = {
    "THROW":  ((0.8, -0.9, -1.0), (0.0, -1.0, -0.1), -80),
    "FOLLOW": ((0.8, -0.9, -1.0), (0.3, -1.0, -0.1), -80),
    "CATCH":  ((0.8, -0.6, -1.0), (0.6, -1.0, -0.1), -80),
    "DIP":    ((0.2, -0.9, -1.0), (0.6, -1.0, -0.4), -40),
}
CYCLE = [(0, "THROW"), (5, "FOLLOW"), (12, "CATCH"), (14, "DIP"), (16, "THROW")]
ARM = ["upperarm", "lowerarm", "wrist", "hand"]

sc = bpy.context.scene
vl = bpy.context.view_layer
rig = bpy.data.objects[RIG]


# ---------------------------------------------------------------- helpers
def aim(name, d, tw=0.0):
    """Rotate pose bone so its Y axis points along armature-space dir d (minimal arc + twist)."""
    vl.update()
    pb = rig.pose.bones[name]
    M = pb.matrix.copy()
    y = (M.to_3x3().normalized() @ Vector((0, 1, 0))).normalized()
    d = Vector(d).normalized()
    R = Matrix.Rotation(radians(tw), 3, d) @ y.rotation_difference(d).to_matrix()
    N = (R @ M.to_3x3().normalized()).to_4x4()
    N.translation = M.translation
    pb.matrix = N
    pb.scale = (1, 1, 1)
    pb.location = (0, 0, 0)
    vl.update()


def arm(side, ua, fa, tw):
    s = -1 if side == "r" else 1
    for n in ARM:
        pb = rig.pose.bones[f"{n}.{side}"]
        pb.rotation_quaternion = (1, 0, 0, 0); pb.location = (0, 0, 0); pb.scale = (1, 1, 1)
    m = lambda v: (s * v[0], v[1], v[2])
    aim(f"upperarm.{side}", m(ua))
    aim(f"lowerarm.{side}", m(fa), s * tw / 2)
    aim(f"wrist.{side}", m(fa), s * tw / 4)
    aim(f"hand.{side}", m(fa), s * tw / 4)


def import_pins():
    col = bpy.data.collections.get("Props_Juggling") or bpy.data.collections.new("Props_Juggling")
    if col.name not in sc.collection.children:
        sc.collection.children.link(col)
    base_mat = bpy.data.materials.get("clown")
    for name in PINS:
        if name in bpy.data.objects:
            continue
        before = set(bpy.data.objects)
        bpy.ops.import_scene.gltf(filepath=os.path.join(PIN_DIR, name + ".gltf"))
        for o in set(bpy.data.objects) - before:
            for uc in list(o.users_collection):
                uc.objects.unlink(o)
            col.objects.link(o)
            if base_mat:  # pins share the clown atlas; reuse the scene material
                for slot in o.material_slots:
                    slot.material = base_mat
    for m in [m for m in bpy.data.materials if m.name.startswith("clown.") and m.users == 0]:
        bpy.data.materials.remove(m)
    for i in [i for i in bpy.data.images if i.name.startswith("clown_texture.") and i.users == 0]:
        bpy.data.images.remove(i)


def identity_offsets():
    """prop-in-handslot matrix for the identity rule, measured once in REST."""
    rig.data.pose_position = "REST"; sc.frame_set(0); vl.update()
    L = {}
    for side in "rl":
        hs = rig.matrix_world @ rig.pose.bones[f"handslot.{side}"].matrix
        W = Matrix.Translation(hs.translation) @ Matrix.Rotation(radians(90), 4, "X")
        L[side] = hs.inverted() @ W
    rig.data.pose_position = "POSE"; vl.update()
    return L


def key_body():
    if not rig.animation_data:
        rig.animation_data_create()
    rig.animation_data.action = None
    old = bpy.data.actions.get(ACTION)
    if old:
        bpy.data.actions.remove(old)
    act = bpy.data.actions.new(ACTION); act.use_fake_user = True
    sc.frame_set(0)
    for pb in rig.pose.bones:
        pb.rotation_mode = "QUATERNION"
        pb.rotation_quaternion = (1, 0, 0, 0); pb.location = (0, 0, 0); pb.scale = (1, 1, 1)
    aim("head", (0, 0.3, 1))
    aim("upperleg.l", (0.15, 0, -1)); aim("upperleg.r", (-0.15, 0, -1))
    aim("lowerleg.l", (0, 0.05, -1)); aim("lowerleg.r", (0, 0.05, -1))
    static = {n: rig.pose.bones[n].rotation_quaternion.copy()
              for n in ["head", "upperleg.l", "upperleg.r", "lowerleg.l", "lowerleg.r"]}
    rig.animation_data.action = act
    keys = sorted({(HAND_OFFSET[s] + rep * HAND_PERIOD + t, s, p)
                   for s in "rl" for rep in range(-1, 4) for t, p in CYCLE
                   if -HAND_PERIOD <= HAND_OFFSET[s] + rep * HAND_PERIOD + t <= PERIOD + HAND_PERIOD})
    for f, side, pose in keys:
        sc.frame_set(f)
        for n, q in static.items():
            rig.pose.bones[n].rotation_quaternion = q
        arm(side, *POSES[pose])
        for n in ARM:
            rig.pose.bones[f"{n}.{side}"].keyframe_insert("rotation_quaternion", frame=f, group=f"{n}.{side}")
    for n, q in static.items():
        rig.pose.bones[n].rotation_quaternion = q
        rig.pose.bones[n].keyframe_insert("rotation_quaternion", frame=0)
    hips = rig.pose.bones["hips"]  # small bounce on every throw (bone-local Y = up)
    for f in range(-HAND_PERIOD, PERIOD + HAND_PERIOD + 1, HAND_PERIOD // 2):
        hips.location = (0, 0, 0); hips.keyframe_insert("location", frame=f)
        hips.location = (0, -0.03, 0); hips.keyframe_insert("location", frame=f + 4)
    return act


def bake_pins(L):
    held = {}
    for f in range(PERIOD):
        sc.frame_set(f); vl.update()
        for side in "rl":
            held[(side, f)] = (rig.matrix_world @ rig.pose.bones[f"handslot.{side}"].matrix) @ L[side]
    H = lambda s, f: held[(s, f % PERIOD)]

    def flight(src, dst, f0, f1, f, yo):
        s = (f - f0) / (f1 - f0)
        A, B = H(src, f0), H(dst, f1)
        p = A.translation.lerp(B.translation, s)
        p.z += APEX * 4 * s * (1 - s)
        p.y += (Y_FORWARD + yo) * math.sin(pi * s)
        d = B.translation - A.translation; d.z = 0
        axis = d.normalized().cross(Vector((0, 0, 1))).normalized()
        q = Quaternion(axis, -2 * pi * s) @ A.to_quaternion().slerp(B.to_quaternion(), s)  # one full turn
        return p, q

    hold = HAND_PERIOD // 2 - (FLIGHT - HAND_PERIOD)  # = 4 frames in hand
    for name, off in PINS.items():
        o = bpy.data.objects[name]
        o.parent = None; o.rotation_mode = "QUATERNION"; o.scale = (1, 1, 1)
        if o.animation_data:
            o.animation_data_clear()
        prev = None
        for f in range(PERIOD + 1):
            t = (f - off) % PERIOD
            if t < FLIGHT:
                p, q = flight("r", "l", off, off + FLIGHT, off + t, -0.1)
            elif t < FLIGHT + hold:
                M = H("l", f); p, q = M.translation, M.to_quaternion()
            elif t < 2 * FLIGHT + hold:
                a = off + FLIGHT + hold
                p, q = flight("l", "r", a, a + FLIGHT, off + t, 0.1)
            else:
                M = H("r", f); p, q = M.translation, M.to_quaternion()
            if prev is not None:
                q.make_compatible(prev)
            prev = q.copy()
            o.location = p; o.rotation_quaternion = q
            o.keyframe_insert("location", frame=f)
            o.keyframe_insert("rotation_quaternion", frame=f)


def verify(step=4):
    """min distance pin <-> deformed head/hat/body, and pin <-> pin, over the loop."""
    worst = {}
    for f in range(PERIOD):
        sc.frame_set(f)
        dg = bpy.context.evaluated_depsgraph_get()
        body = []
        for b in ["Clown_Head", "Clown_Hat", "Clown_Body"]:
            e = bpy.data.objects[b].evaluated_get(dg)
            body += [e.matrix_world @ v.co for v in e.data.vertices][::step]
        pw = {n: [bpy.data.objects[n].matrix_world @ v.co for v in bpy.data.objects[n].data.vertices][::step]
              for n in PINS}
        for n, pv in pw.items():
            d = min((a - b).length for a in pv for b in body)
            if n not in worst or d < worst[n][0]:
                worst[n] = (round(d, 3), f)
        names = list(PINS)
        for i in range(len(names)):
            for j in range(i + 1, len(names)):
                d = min((a - b).length for a in pw[names[i]][::3] for b in pw[names[j]][::3])
                if "pin_pin" not in worst or d < worst["pin_pin"][0]:
                    worst["pin_pin"] = (round(d, 3), f)
    sc.frame_set(0)
    return worst


def run():
    import_pins()
    L = identity_offsets()
    key_body()
    bake_pins(L)
    sc.frame_start, sc.frame_end, sc.render.fps = 0, PERIOD - 1, 24
    return verify()


if __name__ == "__main__":
    print(run())
