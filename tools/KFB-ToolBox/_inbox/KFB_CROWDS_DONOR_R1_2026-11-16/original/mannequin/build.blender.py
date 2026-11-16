# Patch's mannequin, rigged and animated, for the crowds block: fewer triangles (about 2,600) and the clips a crowd needs.
#
# The body is Patch's 1.8 m scale figure (the jointed test dummy), built by the same signed distance fields, but each
# shell and ball joint is meshed on its own and parented, rigid, to one bone of a humanoid skeleton (no skinning).
# The bones carry the usual humanoid names (Hips, Spine, ..., LeftForeArm, LeftToeBase), which the sandbox's body
# effects look up.
#
# The clips are retargeted from Quaternius' Universal Animation Library 1 and 2 (CC0): for every bone, the rotation
# a source bone makes away from its rest pose, in world space, is applied to the matching bone here. So the figure is
# first laid out in the source's rest pose (a T-pose): arms and legs are swung, rigidly, about their joints to point
# the way the source's limbs do.
#
#   blender -b --factory-startup --python build.blender.py -- figure.py <ual1.glb> <ual2.glb> ../public/models/mannequin.glb [tris]
#
# ual1.glb and ual2.glb are the Godot/Unreal GLBs in the two packs' Standard zips (README.md here says where).
# PATCH_PREVIEW=<prefix> also renders 8 frames of every clip.
import bpy, bmesh, sys, math, os, tempfile, time
import numpy as np
from mathutils import Vector, Matrix, Quaternion

args = sys.argv[sys.argv.index("--") + 1:]
FIELDS, UAL1, UAL2, OUT = args[:4]
TARGET = int(args[4]) if len(args) > 4 else 26000
VS = 0.002  # voxel size, as the scale figure
T0 = time.time()

# ------------------------------------------------------------------ shells
# The scale figure's field code, with each part kept apart instead of merged into one field.
PIECES = []  # (bone, kind, piece)


def keep(piece, bone, kind):
    PIECES.append((bone, kind, piece))


code = open(FIELDS, encoding="utf-8").read()
code = code.replace("SHELL_F = np.full(N, 1.0, dtype=np.float32)\n", "").replace("JOINT_F = np.full(N, 1.0, dtype=np.float32)\n", "")
side = "('Left' if s > 0 else 'Right')"
for name, bone in (("head", "'Head'"), ("chest", "'Spine2'"), ("pelvis", "'Hips'"), ("arm", side + " + 'Arm'"),
                   ("fore", side + " + 'ForeArm'"), ("hand", side + " + 'Hand'"), ("thigh", side + " + 'UpLeg'"),
                   ("shin", side + " + 'Leg'"), ("foot", side + " + 'Foot'")):
    assert f"{name}.into(SHELL_F)" in code, name
    code = code.replace(f"{name}.into(SHELL_F)", f"keep({name}, {bone}, 'shell')")
old = "for c, r in ((sh, R_SH), (el, R_EL), (wr, R_WR), (hp, R_HP), (kn, R_KN), (an, R_AN)):"
assert old in code
code = code.replace(old, "for c, r, bn in ((sh, R_SH, 'Arm'), (el, R_EL, 'ForeArm'), (wr, R_WR, 'Hand'), (hp, R_HP, 'UpLeg'), (kn, R_KN, 'Leg'), (an, R_AN, 'Foot')):")
code = code.replace("b.into(JOINT_F)", f"keep(b, {side} + bn, 'joint')")
code = code.replace("neck.into(JOINT_F)", "keep(neck, 'Neck', 'joint')").replace("waist.into(JOINT_F)", "keep(waist, 'Spine', 'joint')")
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
exec(compile(code, "figure_fields", "exec"))
print("fields", len(PIECES), round(time.time() - T0, 1))

import openvdb as vdb


def to_mesh(piece, name):
    vals = np.clip(0.5 - piece.D / VS, -3.5, 4.5).astype(np.float32)
    g = vdb.FloatGrid(-3.5)
    g.copyFromArray(vals, ijk=tuple(int(s.start) for s in piece.sl), tolerance=0.0)
    g.name = "density"
    path = os.path.join(tempfile.gettempdir(), f"patch-mannequin-{name}.vdb")
    vdb.write(path, grids=[g])
    vol = bpy.data.volumes.new(name)
    vol.filepath = path
    vobj = bpy.data.objects.new(name + " field", vol)
    scene.collection.objects.link(vobj)
    obj = bpy.data.objects.new(name, bpy.data.meshes.new(name))
    scene.collection.objects.link(obj)
    mod = obj.modifiers.new("v2m", "VOLUME_TO_MESH")
    mod.object = vobj
    mod.grid_name = "density"
    mod.threshold = 0.5
    mod.resolution_mode = "GRID"
    mod.adaptivity = 0.0
    bpy.context.view_layer.objects.active = obj
    bpy.context.view_layer.update()
    bpy.ops.object.modifier_apply(modifier="v2m")
    bpy.data.objects.remove(vobj)
    co = np.empty(len(obj.data.vertices) * 3)
    obj.data.vertices.foreach_get("co", co)
    co = co.reshape(-1, 3) * VS + LO
    obj.data.vertices.foreach_set("co", co.ravel())
    obj.data.update()
    return obj


def tris(obj):
    return sum(len(p.vertices) - 2 for p in obj.data.polygons)


def decimate(obj, target):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    dec = obj.modifiers.new("decimate", "DECIMATE")
    dec.ratio = min(1.0, target / max(1, tris(obj)))
    bpy.ops.object.modifier_apply(modifier="decimate")
    bpy.ops.object.shade_smooth()


objs = []
for i, (bone, kind, piece) in enumerate(PIECES):
    o = to_mesh(piece, f"{bone}-{kind}-{i}")
    objs.append((bone, kind, o))
del PIECES
for kind, share in (("shell", 0.84), ("joint", 0.16)):
    group = [o for _, k, o in objs if k == kind]
    total = sum(tris(o) for o in group)
    for o in group:
        decimate(o, TARGET * share * tris(o) / total)
print("meshed", round(time.time() - T0, 1))


def srgb(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple((x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c) + (1,)


def material(name, colour, rough):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = srgb(colour)
    b.inputs["Roughness"].default_value = rough
    return m


SHELL = material("shell", "#D4D4D1", 0.42)
JOINT = material("joint", "#333333", 0.5)
INK = material("mark ink", "#000000", 0.6)
PINK = material("mark patch", "#F53CD1", 0.6)
for _, kind, o in objs:
    o.data.materials.append(SHELL if kind == "shell" else JOINT)

# The Patch mark on the wearer's left chest, wrapped onto the chest shell and joined to it.
chest = next(o for b, k, o in objs if b == "Spine2")
CELL = 0.012
cx, cz = 0.075, 1.376
mbm = bmesh.new()
SUB = 1
for row in range(7):
    for col in range(7):
        pink = row <= 2 and col <= 2
        if not pink and not (1 <= row <= 6 and 1 <= col <= 6):
            continue
        x0 = cx + (col - 3.5) * CELL
        z0 = cz + (3.5 - row) * CELL
        g = {}
        for i in range(SUB + 1):
            for k in range(SUB + 1):
                g[i, k] = mbm.verts.new((x0 + CELL * i / SUB, -0.3, z0 - CELL * k / SUB))
        for i in range(SUB):
            for k in range(SUB):
                f = mbm.faces.new((g[i, k], g[i, k + 1], g[i + 1, k + 1], g[i + 1, k]))
                f.material_index = 1 if pink else 0
bmesh.ops.remove_doubles(mbm, verts=mbm.verts, dist=1e-6)
mark = bpy.data.objects.new("Patch mark", bpy.data.meshes.new("mark"))
mbm.to_mesh(mark.data)
mbm.free()
scene.collection.objects.link(mark)
mark.data.materials.append(INK)
mark.data.materials.append(PINK)
sw = mark.modifiers.new("wrap", "SHRINKWRAP")
sw.target = chest
sw.wrap_method = "PROJECT"
sw.use_project_y = True
sw.use_negative_direction = True
sw.use_positive_direction = True
sw.offset = 0.0012
bpy.ops.object.select_all(action="DESELECT")
bpy.context.view_layer.objects.active = mark
mark.select_set(True)
bpy.ops.object.modifier_apply(modifier="wrap")
bpy.ops.object.select_all(action="DESELECT")
mark.select_set(True)
chest.select_set(True)
bpy.context.view_layer.objects.active = chest
bpy.ops.object.join()

# One object per bone and material kind: fewer draw calls.
merged = []
for bone in sorted({b for b, _, _ in objs}):
    for kind in ("shell", "joint"):
        group = [o for b, k, o in objs if b == bone and k == kind and o.name in bpy.data.objects]
        if not group:
            continue
        bpy.ops.object.select_all(action="DESELECT")
        for o in group:
            o.select_set(True)
        bpy.context.view_layer.objects.active = group[0]
        if len(group) > 1:
            bpy.ops.object.join()
        group[0].name = f"{bone} {kind}"
        merged.append((bone, kind, group[0]))
objs = merged

# Exactly 1.8 m, feet on the ground (as the scale figure).
allco = []
for b, k, o in objs:
    co = np.empty(len(o.data.vertices) * 3)
    o.data.vertices.foreach_get("co", co)
    allco.append(co.reshape(-1, 3))
zs = np.concatenate([c[:, 2] for c, (_, k, _) in zip(allco, objs) if k == "shell"])
ZMIN, ZMAX = float(zs.min()), float(zs.max())
K = 1.8 / (ZMAX - ZMIN)
for co, (_, _, o) in zip(allco, objs):
    co[:, 2] -= ZMIN
    co *= K
    o.data.vertices.foreach_set("co", co.ravel())
    o.data.update()


def S(p):
    return Vector((p[0] * K, p[1] * K, (p[2] - ZMIN) * K))


# --------------------------------------------------------------- skeleton
# name, parent, head, aim (a point the bone points at), source bone, swung into the source's rest pose
BONES = [
    ("Hips", None, (0, 0.004, 0.93), (0, 0.006, 1.04), "DEF-hips", False),
    ("Spine", "Hips", (0, 0.006, 1.04), (0, 0.008, 1.16), "DEF-spine.001", False),
    ("Spine1", "Spine", (0, 0.008, 1.16), (0, 0.01, 1.30), "DEF-spine.002", False),
    ("Spine2", "Spine1", (0, 0.01, 1.30), (0, 0.012, 1.46), "DEF-spine.003", False),
    ("Neck", "Spine2", (0, 0.012, 1.46), (0, 0.006, 1.60), "DEF-neck", False),
    ("Head", "Neck", (0, 0.006, 1.60), (0, 0.006, 1.80), "DEF-head", False),
]
for s, L, l in ((1, "Left", "L"), (-1, "Right", "R")):
    BONES += [
        (L + "Shoulder", "Spine2", M((0.04, 0.01, 1.44), s), M(SH, s), f"DEF-shoulder.{l}", False),
        (L + "Arm", L + "Shoulder", M(SH, s), M(EL, s), f"DEF-upper_arm.{l}", True),
        (L + "ForeArm", L + "Arm", M(EL, s), M(WR, s), f"DEF-forearm.{l}", True),
        (L + "Hand", L + "ForeArm", M(WR, s), M((0.295, -0.01, 0.77), s), f"DEF-hand.{l}", True),
        (L + "UpLeg", "Hips", M(HP, s), M(KN, s), f"DEF-thigh.{l}", True),
        (L + "Leg", L + "UpLeg", M(KN, s), M(AN, s), f"DEF-shin.{l}", True),
        (L + "Foot", L + "Leg", M(AN, s), M((0.118, -0.11, 0.025), s), f"DEF-foot.{l}", True),
        (L + "ToeBase", L + "Foot", M((0.118, -0.11, 0.025), s), M((0.121, -0.19, 0.02), s), f"DEF-toe.{l}", True),
    ]

# The source rig and its rest pose, in world space.
before = set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=UAL1)
src = next(o for o in bpy.data.objects if o not in before and o.type == "ARMATURE")
src_objs = [o for o in bpy.data.objects if o not in before]
SRC_FPS = scene.render.fps / scene.render.fps_base
rest_src = {b.name: src.matrix_world @ b.matrix_local for b in src.data.bones}
src_tail = {b.name: src.matrix_world @ b.tail_local for b in src.data.bones}
src_head = {b.name: src.matrix_world @ b.head_local for b in src.data.bones}
# UAL2's clips are on a second rig with the same rest pose and other bone names.
before2 = set(bpy.data.objects)
acts1 = set(bpy.data.actions)
bpy.ops.import_scene.gltf(filepath=UAL2)
src2 = next(o for o in bpy.data.objects if o not in before2 and o.type == "ARMATURE")
src_objs += [o for o in bpy.data.objects if o not in before2]
ACTS2 = {a.name for a in bpy.data.actions if a not in acts1}
UAL2_NAMES = {"DEF-hips": "pelvis", "DEF-spine.001": "spine_01", "DEF-spine.002": "spine_02", "DEF-spine.003": "spine_03",
              "DEF-neck": "neck_01", "DEF-head": "Head"}
for l in ("l", "r"):
    L = l.upper()
    UAL2_NAMES.update({f"DEF-shoulder.{L}": f"clavicle_{l}", f"DEF-upper_arm.{L}": f"upperarm_{l}",
                       f"DEF-forearm.{L}": f"lowerarm_{l}", f"DEF-hand.{L}": f"hand_{l}", f"DEF-thigh.{L}": f"thigh_{l}",
                       f"DEF-shin.{L}": f"calf_{l}", f"DEF-foot.{L}": f"foot_{l}", f"DEF-toe.{L}": f"ball_{l}"})
rest_src2 = {b.name: src2.matrix_world @ b.matrix_local for b in src2.data.bones}
for a, b in UAL2_NAMES.items():
    d = (rest_src[a].to_translation() - rest_src2[b].to_translation()).length
    assert d < 0.005, (a, b, d)
print("source", src.name, src2.name, "fps", SRC_FPS, len(bpy.data.actions), "actions")

# Lay the figure out in the source's rest pose: a rigid transform per bone, chained from the root.
XF = {}
for name, parent, head, aim, sname, swing in BONES:
    h, a = S(head), S(aim)
    P = XF[parent] if parent else Matrix.Identity(4)
    if swing:
        h2 = P @ h
        d = P.to_3x3() @ (a - h)
        q = d.rotation_difference(src_tail[sname] - src_head[sname])
        XF[name] = Matrix.Translation(h2) @ q.to_matrix().to_4x4() @ P.to_3x3().to_4x4() @ Matrix.Translation(-h)
    else:
        XF[name] = P.copy()

arm_data = bpy.data.armatures.new("Mannequin")
arm = bpy.data.objects.new("Mannequin", arm_data)
scene.collection.objects.link(arm)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.select_all(action="DESELECT")
arm.select_set(True)
bpy.ops.object.mode_set(mode="EDIT")
for name, parent, head, aim, sname, swing in BONES:
    eb = arm_data.edit_bones.new(name)
    eb.head = XF[name] @ S(head)
    eb.tail = XF[name] @ S(aim)
    eb.roll = 0
    if parent:
        eb.parent = arm_data.edit_bones[parent]
bpy.ops.object.mode_set(mode="OBJECT")

for bone, kind, o in objs:
    co = np.empty(len(o.data.vertices) * 3)
    o.data.vertices.foreach_get("co", co)
    co = co.reshape(-1, 3)
    X = np.array(XF[bone])
    co = co @ X[:3, :3].T + X[:3, 3]
    o.data.vertices.foreach_set("co", co.ravel())
    o.data.update()
    o.parent = arm
    o.parent_type = "BONE"
    o.parent_bone = bone
    bpy.context.view_layer.update()
    o.matrix_world = Matrix.Identity(4)

# ---------------------------------------------------------------- retarget
REST = {b.name: b.matrix_local.copy() for b in arm_data.bones}
PAR = {n: p for n, p, *_ in BONES}
SRCN = {n: s for n, _, _, _, s, _ in BONES}
RS0 = {n: rest_src[SRCN[n]].to_quaternion() for n in REST}
RS0_2 = {n: rest_src2[UAL2_NAMES[SRCN[n]]].to_quaternion() for n in REST}
RT0 = {n: REST[n].to_quaternion() for n in REST}
HIP0 = REST["Hips"].to_translation()
SHIP0 = src_head["DEF-hips"]
RATIO = HIP0.z / SHIP0.z
OUT_FPS = 30


def use_action(obj, action):
    ad = obj.animation_data or obj.animation_data_create()
    ad.action = action
    if action is not None and hasattr(ad, "action_slot") and ad.action_suitable_slots:
        ad.action_slot = ad.action_suitable_slots[0]


def sample(parts):
    """parts: [(source action, t0, t1)] played one after another -> list of {bone: armature-space matrix}."""
    frames = []
    for pi, (aname, t0, t1) in enumerate(parts):
        two = aname in ACTS2
        rig, rs0 = (src2, RS0_2) if two else (src, RS0)
        use_action(rig, bpy.data.actions[aname])
        n = max(1, round((t1 - t0) * OUT_FPS))
        for i in range(0 if pi == 0 else 1, n + 1):
            t = t0 + (t1 - t0) * i / n
            f = t * SRC_FPS
            scene.frame_set(int(math.floor(f)), subframe=f - math.floor(f))
            pose = {}
            for name, parent, *_ in BONES:
                pb = rig.pose.bones[UAL2_NAMES[SRCN[name]] if two else SRCN[name]]
                W = rig.matrix_world @ pb.matrix
                d = W.to_quaternion() @ rs0[name].inverted()
                rot = d @ RT0[name]
                if parent is None:
                    pos = HIP0 + (W.to_translation() - SHIP0) * RATIO
                else:
                    pos = (pose[parent] @ REST[parent].inverted() @ REST[name]).to_translation()
                pose[name] = Matrix.Translation(pos) @ rot.to_matrix().to_4x4()
            frames.append(pose)
    return frames


def bake(name, parts):
    frames = sample(parts)
    action = bpy.data.actions.new(name)
    use_action(arm, action)
    prev = {}
    for fi, pose in enumerate(frames):
        for bname, parent, *_ in BONES:
            local = REST[bname] if parent is None else REST[parent].inverted() @ REST[bname]
            mp = Matrix.Identity(4) if parent is None else pose[parent]
            basis = local.inverted() @ mp.inverted() @ pose[bname]
            pb = arm.pose.bones[bname]
            pb.rotation_mode = "QUATERNION"
            loc, q, _ = basis.decompose()
            if bname in prev and prev[bname].dot(q) < 0:
                q.negate()
            prev[bname] = q
            pb.location = loc if parent is None else Vector()
            pb.rotation_quaternion = q
            if parent is None:
                pb.keyframe_insert("location", frame=fi)
            pb.keyframe_insert("rotation_quaternion", frame=fi)
    action.use_fake_user = True
    print("baked", name, len(frames), "frames", round(time.time() - T0, 1))
    return action


def length(aname):
    return bpy.data.actions[aname].frame_range[1] / SRC_FPS


CLIPS = {
    "idle": [("Idle_Loop", 0, length("Idle_Loop"))],
    "talk": [("Idle_Talking_Loop", 0, length("Idle_Talking_Loop"))],
    "fold": [("Idle_FoldArms_Loop", 0, length("Idle_FoldArms_Loop"))],
    "walk": [("Walk_Loop", 0, length("Walk_Loop"))],
    "jog": [("Jog_Fwd_Loop", 0, length("Jog_Fwd_Loop"))],
    "sprint": [("Sprint_Loop", 0, length("Sprint_Loop"))],
}
ours = [bake(n, p) for n, p in CLIPS.items()]
use_action(arm, None)
use_action(src, None)
use_action(src2, None)
for o in src_objs:
    bpy.data.objects.remove(o, do_unlink=True)
for a in list(bpy.data.actions):
    if a not in ours:
        bpy.data.actions.remove(a)
for a in ours:
    for slot in getattr(a, "slots", []):
        pass
scene.render.fps, scene.render.fps_base = OUT_FPS, 1
# Rest pose for the export; the glTF's first clip (idle) is what three plays.
use_action(arm, ours[0])
for pb in arm.pose.bones:
    pb.location, pb.rotation_quaternion = Vector(), Quaternion()

print("triangles", sum(tris(o) for _, _, o in objs), "objects", len(objs))
bpy.ops.object.select_all(action="DESELECT")
arm.select_set(True)
for _, _, o in objs:
    o.select_set(True)
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", use_selection=True, export_apply=True,
                          export_animations=True, export_animation_mode="ACTIONS", export_force_sampling=True,
                          export_frame_step=1, export_optimize_animation_size=True, export_skins=False)
print("exported", round(time.time() - T0, 1))

# Optional strips of every clip (workbench), for review: PATCH_PREVIEW=<prefix>.
PREVIEW = os.environ.get("PATCH_PREVIEW")
if PREVIEW:
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
    scene.collection.objects.link(cam)
    scene.camera = cam
    cam.data.type = "ORTHO"
    cam.data.ortho_scale = 2.6
    view = os.environ.get("PATCH_PREVIEW_VIEW", "side")
    loc = Vector((3.6, -4.8, 1.0)) if view == "side" else Vector((0, -6, 1.0))
    cam.location = loc
    cam.rotation_euler = (Vector((0, 0, 1.0)) - loc).to_track_quat("-Z", "Y").to_euler()
    scene.render.engine = "BLENDER_WORKBENCH"
    scene.render.resolution_x, scene.render.resolution_y = 260, 340
    scene.display.shading.light = "STUDIO"
    scene.display.shading.color_type = "MATERIAL"
    n = 8
    for a in ours:
        use_action(arm, a)
        f0, f1 = a.frame_range
        for i in range(n):
            scene.frame_set(int(round(f0 + (f1 - f0) * i / (n - 1))))
            scene.render.filepath = f"{PREVIEW}-{a.name}-{i:02d}.png"
            bpy.ops.render.render(write_still=True)
print("done", round(time.time() - T0, 1))
