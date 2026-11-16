"""DANCE-01: load the Motion Library v6 dance clips onto both rigs (same path as kfb369_talk_libclips)."""
import bpy, os
import kfb369_lib as L

LIB = os.path.join(L.SRC, "dfb6b8a1", "media", "3D_Assets", "Animations", "KFB_Motion_Library", "libs")
DANCES = ["kfb_dance_breakdance_uprock_var_1_a", "kfb_dance_chicken_a", "kfb_dance_dancing_maraschino_step_a",
          "kfb_dance_hip_hop_a", "kfb_dance_hip_hop_c", "kfb_dance_hokey_pokey_a", "kfb_dance_house_a",
          "kfb_dance_house_b", "kfb_dance_jazz_dancing_a", "kfb_dance_locking_hip_hop_a", "kfb_dance_northern_soul_spin_a",
          "kfb_dance_samba_a", "kfb_dance_slide_hip_hop_a", "kfb_dance_swing_dancing_a", "kfb_dance_twist_dance_a",
          "kfb_dance_wave_hip_hop_a", "kfb_dance_step_hip_hop_a", "kfb_dance_thriller_part3_a"]
WANT = {"dance": ("KFB_Motion_dance.glb", DANCES), "dance_i05": ("KFB_Motion_dance_i05.glb", ["kfb_dance_gangnam_style_a"])}
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
