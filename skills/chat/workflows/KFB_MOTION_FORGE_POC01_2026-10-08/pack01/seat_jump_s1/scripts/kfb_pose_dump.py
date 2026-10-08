"""Dump forge clips as parent-relative pose matrices per bone and frame (run in Blender; no glTF export).
Feed the JSON to kfb_pose_dump_to_glb.py in a plain Python env (pygltflib) to write the skeleton-only GLB."""
import bpy, json, os
import kfb_forge as F, kfb_seat_standup_c as SU


def dump(rig, clips, path):
    T = bpy.data.objects[F.TARGETS[rig]]
    sc = bpy.context.scene
    keep = T.animation_data.action
    data = dict(rig=rig, parents={b.name: (b.parent.name if b.parent else None) for b in T.data.bones}, clips={})
    for cid in clips:
        a = bpy.data.actions[f'{rig}|FORGE|PACK|{cid}']
        SU.zero_locations(T); F.use_action(T, a)          # unkeyed locations must not leak in
        n = int(round(a.frame_range[1] - a.frame_range[0])) + 1
        frames = []
        for f in range(n):
            sc.frame_set(int(a.frame_range[0]) + f)
            frames.append({pb.name: [round(x, 7) for r in ((pb.parent.matrix.inverted() @ pb.matrix) if pb.parent else pb.matrix) for x in r]
                           for pb in T.pose.bones})
        data['clips'][cid] = frames
    SU.zero_locations(T); F.use_action(T, keep)
    json.dump(data, open(path, 'w'))
    return os.path.getsize(path)
