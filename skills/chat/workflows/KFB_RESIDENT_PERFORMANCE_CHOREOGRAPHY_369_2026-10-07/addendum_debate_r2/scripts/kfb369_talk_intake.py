"""KFB #369 debate r2: intake of Mixamo 'Gestures Pack Basic' (listener / backchannel clips).

The pack was downloaded on a KayKit Rig_Medium, so bone names already match. Retarget = ml_bake.retarget (exact
world-rotation transfer, unchanged Motion Library v1 pipeline) onto Rig_Medium (DB_farmer_b) and Rig_Large
(DB_orcbrute). Source is 30 fps; keys are resampled to the 24 fps scene clock (frame = i * 24/30), like the
glTF-imported library clips. Raw FBX stay in Dropbox _inbox and never go to GitHub.
Result actions: '<M|L>|MLB|gesture|kfb_gesture_<name>_a'.
"""
import bpy, os, sys, math
import kfb369_lib as L
sys.path.append(os.path.normpath(os.path.join(L.JOB, "..", "MOTION_LIB")))
import ml_bake as MB

INBOX = os.path.normpath(os.path.join(L.JOB, "..", "_inbox", "Gestures Pack Basic"))
TARGETS = {"M": "DB_farmer_b", "L": "DB_orcbrute"}
# file -> clip name; 'angry gesture', 'dismissing gesture', 'thoughtful head shake' are already in the library
CLIPS = {"acknowledging": "acknowledging", "annoyed head shake": "annoyed_head_shake", "being cocky": "being_cocky",
         "happy hand gesture": "happy_hand", "hard head nod": "hard_head_nod", "head nod yes": "head_nod_yes",
         "lengthy head nod": "lengthy_head_nod", "look away gesture": "look_away", "relieved sigh": "relieved_sigh",
         "sarcastic head nod": "sarcastic_head_nod", "shaking head no": "shaking_head_no", "weight shift": "weight_shift"}
SRC_FPS = 30.0; DST_FPS = 24.0


def make_action(name, tname, out):
    T = bpy.data.objects[tname]
    a = bpy.data.actions.get(name)
    if a: bpy.data.actions.remove(a)
    a = bpy.data.actions.new(name); a.use_fake_user = True
    slot = a.slots.new(id_type='OBJECT', name=tname)
    lay = a.layers.new('L'); st = lay.strips.new(type='KEYFRAME'); cb = st.channelbag(slot, ensure=True)
    sc = DST_FPS / SRC_FPS
    for b in T.data.bones:
        bn = b.name
        chans = [('rotation_quaternion', 4)] + ([('location', 3)] if bn in ('root', 'hips') else [])
        for path, cnt in chans:
            for i in range(cnt):
                fc = cb.fcurves.new(f'pose.bones["{bn}"].{path}', index=i, group_name=bn)
                fc.keyframe_points.add(len(out))
                co = []
                for fi, (basis, _, _) in enumerate(out):
                    q, l = basis[bn]
                    co += [fi * sc, q[i] if path == 'rotation_quaternion' else l[i]]
                fc.keyframe_points.foreach_set('co', co)
                for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'
                fc.update()
    return a


def run():
    cur = bpy.context.window.scene
    sc = bpy.data.scenes.get("_INTAKE") or bpy.data.scenes.new("_INTAKE")
    bpy.context.window.scene = sc
    rep = {}
    for fn, nm in CLIPS.items():
        before = set(bpy.data.objects.keys()); ba = set(bpy.data.actions.keys())
        bpy.ops.import_scene.fbx(filepath=os.path.join(INBOX, fn + ".fbx"), automatic_bone_orientation=False,
                                 ignore_leaf_bones=False)
        objs = [o for o in bpy.data.objects if o.name not in before]
        arm = [o for o in objs if o.type == 'ARMATURE'][0]
        for o in objs:
            if o is not arm: bpy.data.objects.remove(o)
        f0, f1, frames = MB.sample_src(arm)
        for rig, tname in TARGETS.items():
            out, k = MB.retarget(arm, frames, tname)
            make_action(f"{rig}|MLB|gesture|kfb_gesture_{nm}_a", tname, out)
        rep[nm] = {"srcFrames": len(frames), "frames24": round((len(frames) - 1) * DST_FPS / SRC_FPS, 1)}
        bpy.data.objects.remove(arm)
        for n in set(bpy.data.actions.keys()) - ba:
            if not n.startswith(("M|", "L|")): bpy.data.actions.remove(bpy.data.actions[n])
    bpy.context.window.scene = cur
    bpy.data.scenes.remove(sc)
    return rep


result = run()
