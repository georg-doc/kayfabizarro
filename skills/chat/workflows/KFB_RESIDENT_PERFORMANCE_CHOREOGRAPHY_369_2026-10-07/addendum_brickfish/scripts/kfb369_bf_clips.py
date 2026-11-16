"""BRICKFISH-TOSS-01: load the Motion Library v6 clips the toss needs (throw, pick-up, hit, dodge, mock) onto both rigs.
Same path as kfb369_talk_libclips: library GLB -> '<rig>|ML|<group>|<id>' -> kfb369_lib.ensure_action -> '<rig>|MLB|...'.
"""
import bpy, os
import kfb369_lib as L

LIB = os.path.join(L.SRC, "dfb6b8a1", "media", "3D_Assets", "Animations", "KFB_Motion_Library", "libs")
WANT = {
    "throw": ("KFB_Motion_throw.glb", ["kfb_throw_throw_a", "kfb_throw_goalkeeper_overhand_a", "kfb_throw_frisbee_a"]),
    "action": ("KFB_Motion_action.glb", ["kfb_action_baseball_pitching_a"]),
    "interaction": ("KFB_Motion_interaction.glb", ["kfb_interaction_picking_up_object_a"]),
    "reaction": ("KFB_Motion_reaction.glb", ["kfb_reaction_standing_react_small_from_right_a"]),
    "action_i06": ("KFB_Motion_action_i06.glb", ["kfb_action_dodging_a", "kfb_action_dodging_back_a"]),
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
