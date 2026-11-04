#!/usr/bin/env python3
"""KFB Blender pose/motion sampler. Read-only scene inspection; not an animation authoring tool.
Run under Blender --python, explicitly naming the real rig/root/feet of the currently active action.
Contact, IK correctness, gameplay physics and foot-slide verdicts require separate visual/runtime proof.
"""
import argparse
import json
import math
import sys
from pathlib import Path

try:
    import bpy
except ImportError as exc:
    raise SystemExit("Run this script from inside Blender (bpy required).") from exc


def arguments():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser(description="Read-only KFB sampled pose coordinate evidence")
    for name in ("armature", "root", "left-foot", "right-foot", "output"):
        parser.add_argument("--" + name, required=True)
    parser.add_argument("--start", type=int)
    parser.add_argument("--end", type=int)
    parser.add_argument("--step", type=int, default=1)
    return parser.parse_args(argv)


def sample():
    args = arguments()
    if args.step < 1:
        raise ValueError("step must be >= 1")
    arm = bpy.data.objects.get(args.armature)
    if arm is None or arm.type != "ARMATURE":
        raise ValueError("Named real ARMATURE not found: " + args.armature)
    bones = {"root": args.root, "left_foot": args.left_foot, "right_foot": args.right_foot}
    missing = [name for name in bones.values() if arm.pose.bones.get(name) is None]
    if missing:
        raise ValueError("Missing named pose bones: " + ", ".join(missing))
    action = arm.animation_data.action if arm.animation_data else None
    if action is None:
        raise ValueError("Armature has no active action; explicitly assign the source action in Blender first")
    scene = bpy.context.scene
    start = args.start if args.start is not None else int(math.floor(action.frame_range[0]))
    end = args.end if args.end is not None else int(math.ceil(action.frame_range[1]))
    if end < start or (end - start) // args.step + 1 > 4000:
        raise ValueError("Invalid frame range or more than 4000 samples")
    old_frame = scene.frame_current
    frames = []
    try:
        for frame in range(start, end + 1, args.step):
            scene.frame_set(frame)
            depsgraph = bpy.context.evaluated_depsgraph_get()
            evaluated_arm = arm.evaluated_get(depsgraph)
            result = {"frame": frame, "seconds": round(frame / (scene.render.fps / scene.render.fps_base), 6)}
            for label, bone_name in bones.items():
                pb = evaluated_arm.pose.bones.get(bone_name)
                if pb is None:
                    raise ValueError("Evaluated bone unavailable: " + bone_name)
                w = (evaluated_arm.matrix_world @ pb.matrix).translation
                result[label] = [round(float(w.x), 6), round(float(w.y), 6), round(float(w.z), 6)]
            frames.append(result)
    finally:
        scene.frame_set(old_frame)
    if not frames:
        raise ValueError("No frames sampled")
    def xyz_delta(label):
        a, b = frames[0][label], frames[-1][label]
        return [round(b[i] - a[i], 6) for i in range(3)]
    data = {
        "schema": "kfb.pose-motion-sample/0.1",
        "status": "SAMPLED_ONLY_NOT_CONTACT_APPROVED",
        "source": {"armature": arm.name, "action": action.name, "bones": bones, "fps": scene.render.fps / scene.render.fps_base},
        "range": {"start": start, "end": end, "step": args.step, "count": len(frames)},
        "root_delta_xyz": xyz_delta("root"),
        "observations": ["world-space origins of named bones, not toe/sole contact points",
                         "Z values are not a terrain/ground sample",
                         "foot sliding and final pose quality require authored contact spans and visual inspection",
                         "sampling does not modify actions or bake motion"],
        "frames": frames,
    }
    output = Path(args.output).expanduser()
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print("KFB sampled", len(frames), "frames from", arm.name, action.name, "->", str(output))


if __name__ == "__main__":
    sample()
