"""KFB #369 debate r2: load extra Motion Library v6 clips (idle variety, audience, reactions) for the talk pool.

Imports the library GLBs (node clips) into a temporary 24 fps scene, renames the actions to '<rig>|ML|<group>|<id>'
and bakes them onto the resident rigs with kfb369_lib.ensure_action (three.js semantics), giving '<rig>|MLB|...'.
"""
import bpy, os
import kfb369_lib as L

LIB = os.path.join(L.SRC, "dfb6b8a1", "media", "3D_Assets", "Animations", "KFB_Motion_Library", "libs")
WANT = {
    "idle": ("KFB_Motion_idle.glb", ["kfb_idle_breathing_a", "kfb_idle_breathing_b", "kfb_idle_idle_a", "kfb_idle_idle_b",
             "kfb_idle_idle_c", "kfb_idle_idle_d", "kfb_idle_idle_e", "kfb_idle_idle_f", "kfb_idle_standing_a",
             "kfb_idle_standing_idle_03_a", "kfb_idle_unarmed_idle_looking_ver_1_a", "kfb_idle_sad_a",
             "kfb_idle_happy_a", "kfb_idle_rejected_a", "kfb_idle_laughing_a"]),
    "idle_i04": ("KFB_Motion_idle_i04.glb", ["kfb_idle_looking_around_a"]),
    "gesture": ("KFB_Motion_gesture.glb", ["kfb_gesture_cheering_a", "kfb_gesture_clapping_a", "kfb_gesture_standing_clap_a",
                "kfb_gesture_look_over_shoulder_a"]),
    "gesture_i06": ("KFB_Motion_gesture_i06.glb", ["kfb_gesture_taunt_b"]),
    "reaction_i06": ("KFB_Motion_reaction_i06.glb", ["kfb_reaction_surprised_a", "kfb_reaction_reacting_a"]),
}
RIGDIR = {"M": "Rig_Medium", "L": "Rig_Large"}


def run():
    tmp = bpy.data.scenes.get("_LIBLOAD") or bpy.data.scenes.new("_LIBLOAD")
    tmp.render.fps = 24; tmp.render.fps_base = 1.0
    rep = {}
    for rig, rdir in RIGDIR.items():
        for key, (fn, ids) in WANT.items():
            group = key.split("_i0")[0]
            todo = [i for i in ids if f"{rig}|MLB|{group}|{i}" not in bpy.data.actions]
            if not todo: continue
            ba = set(bpy.data.actions)
            new = L.import_into(tmp, "_LIBLOAD", os.path.join(LIB, rdir, fn))
            for a in [a for a in bpy.data.actions if a not in ba]:
                base = a.name.split(".")[0]
                if base in todo and f"{rig}|ML|{group}|{base}" not in bpy.data.actions:
                    a.name = f"{rig}|ML|{group}|{base}"; a.use_fake_user = True
            for i in todo:
                if f"{rig}|ML|{group}|{i}" in bpy.data.actions:
                    rep[f"{rig}:{i}"] = L.ensure_action(rig, f"ML:{i}")
            for a in [a for a in bpy.data.actions if a not in ba and not a.name.startswith(rig + "|")]:
                bpy.data.actions.remove(a)
            for o in new: bpy.data.objects.remove(o, do_unlink=True)
    bpy.data.scenes.remove(tmp)
    return rep


result = run()
