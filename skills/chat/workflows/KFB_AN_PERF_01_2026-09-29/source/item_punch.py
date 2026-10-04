exec(open('/tmp/an1/perf.py').read())
# ---------- Item 2 · cartoon punches with a hop-in step ----------
CAT = {c['id']: c for c in json.load(open('/tmp/ml4/out/KFB_Motion_Library.catalog.json'))['clips']}
DON = ['kfb_action_quad_punch_a', 'kfb_action_hook_punch_b', 'kfb_action_punching_b']
NEW = {'kfb_action_quad_punch_a': 'kfb_action_quad_punch_hop_a', 'kfb_action_hook_punch_b': 'kfb_action_hook_punch_hop_a', 'kfb_action_punching_b': 'kfb_action_punching_hop_a'}
meta = {}; res = {}
for rig, tn in RIGS.items():
    ob = bpy.data.objects[tn]
    hf = head_front(ob, rig); apply(ob, basis('kfb_idle_breathing_a', rig, 1)); hh = W(ob, 'hips').z
    spacing = 2 * hf + 0.06 * hh / 0.387
    for cid in DON:
        n = nfr(cid, rig); ev = CAT[cid]['events']['strike']; s = ev['frame']; limb = ev['limb']
        apply(ob, basis(cid, rig, s)); hip = W(ob, 'hips'); hand = W(ob, limb, True)
        ax = hand - hip; ax.z = 0; reach = ax.length; ax.normalize()   # attack axis: where the fist is at the hit
        face = spacing - hf * 0.85
        base_c = contacts(ob, [basis(cid, rig, f) for f in range(1, n + 1)], hh)
        d = max(0.0, face - reach)
        a0, a1 = max(1, s - 8), s - 1                  # hop in, land one frame before the hit
        b0, b1 = min(n, s + 7), min(n, s + 15)          # hop back
        lift = 0.18 * hh
        frames = []
        for f in range(1, n + 1):
            P = basis(cid, rig, f)
            u_in = ramp(f, a0, a1); u_out = ramp(f, b0, b1); off = d * (u_in - u_out)
            z = lift * (math.sin(math.pi * min(1, max(0, (f - a0) / max(1, a1 - a0)))) if a0 <= f <= a1 else 0) \
              + lift * 0.7 * (math.sin(math.pi * min(1, max(0, (f - b0) / max(1, b1 - b0)))) if b0 <= f <= b1 else 0)
            q, l = P['root']
            # root bone: translate in armature space (object at origin, identity) -> convert to root-local by the root rest matrix
            apply(ob, P); pb = ob.pose.bones['root']; M = pb.matrix.copy(); M.translation = M.translation + ax * off + UP * z; pb.matrix = M
            bpy.context.view_layer.update(); frames.append(read(ob))
        fix_signs(frames)
        apply(ob, frames[s - 1]); hand2 = W(ob, limb, True); hip2 = W(ob, 'hips')
        miss = face - Vector((hand2.x, hand2.y, 0)).dot(ax) + Vector((hip.x, hip.y, 0)).dot(ax)   # distance from the rest-position hips of the attacker
        c = contacts(ob, frames, hh)
        write_action(NEW[cid] + '__' + rig + '__N', ob, frames); res.setdefault(cid, {})[rig] = frames
        meta.setdefault(NEW[cid], {})[rig] = {'strikeFrame': s, 'limb': limb, 'headFront': round(hf, 3), 'spacing': round(spacing, 3),
            'reachAtStrike': round(reach, 3), 'attackAxisDeg': round(math.degrees(math.atan2(ax.y, ax.x)), 1), 'donorContacts': {k: v['maxSlideInPlantCm'] for k, v in base_c.items()}, 'hopForward': round(d, 3), 'hopIn': [a0, a1], 'hopBack': [b0, b1], 'hopLift': round(lift, 3),
            'fistToFaceAtStrikeCm': round(miss * 100, 1), 'endOffsetCm': round(d * (ramp(n, a0, a1) - ramp(n, b0, b1)) * 100, 1), 'contacts': c}
        print(rig, NEW[cid], json.dumps({k: v for k, v in meta[NEW[cid]][rig].items() if k != 'contacts'}), {k: (v['maxSlideInPlantCm'], v['planted']) for k, v in c.items()}, flush=True)
json.dump(meta, open('/tmp/an1/out/punch_meta.json', 'w'), indent=1)
# previews: sheets per clip, both rigs, side view
import os; os.makedirs('/tmp/an1/out/sheets', exist_ok=True)
for cid in DON:
    sheet(NEW[cid], {r: res[cid][r] for r in RIGS}, side=True, fixed=True)
# duo proof at the strike frame: a defender (boxing stance) at head spacing along the attack axis
def dup(tn):
    src = bpy.data.objects[tn]; B = src.copy(); B.name = 'DEF_' + tn; B.animation_data_clear(); sc.collection.objects.link(B)
    kids = []
    for c in src.children:
        m = c.copy(); sc.collection.objects.link(m); m.parent = B
        for md in m.modifiers:
            if md.type == 'ARMATURE': md.object = B
        kids.append(m)
    for pb in B.pose.bones: pb.rotation_mode = 'QUATERNION'
    return B, kids
cam = cam_setup(300); rows = []
for rig, tn in RIGS.items():
    ob = bpy.data.objects[tn]; show(rig); D, kids = dup(tn); H = {'Rig_Medium': 1.9, 'Rig_Large': 3.9}[rig]; tiles = []
    for cid in DON:
        m = meta[NEW[cid]][rig]; s0 = m['strikeFrame']
        for which in ('donor', 'hop'):
            fr = basis(cid, rig, 1); apply(ob, fr); h0 = W(ob, 'hips'); h0.z = 0
            a = math.radians(m['attackAxisDeg']); ax = Vector((math.cos(a), math.sin(a), 0))
            apply(ob, basis(cid, rig, s0) if which == 'donor' else res[cid][rig][s0 - 1])
            D.rotation_mode = 'XYZ'; D.location = h0 + ax * m['spacing']
            D.rotation_euler = (0, 0, math.atan2(-ax.y, -ax.x) - math.atan2(FWD.y, FWD.x))
            apply(D, basis('kfb_action_boxing_a', rig, 1))
            mid = h0 + ax * m['spacing'] / 2; tgt = Vector((mid.x, mid.y, H * 0.55)); perp = Vector((-ax.y, ax.x, 0))
            cam.location = tgt + perp * H * 2.6 + Vector((0, 0, H * 0.25)); cam.rotation_euler = (tgt - cam.location).to_track_quat('-Z', 'Y').to_euler()
            tiles.append(tile())
    rows.append(np.concatenate(tiles, axis=1))
    for k in kids: bpy.data.objects.remove(k)
    bpy.data.objects.remove(D)
save_rows(rows, '/tmp/an1/out/sheets/_punch_hop_contact_proof.png')
bpy.ops.wm.save_as_mainfile(filepath='/tmp/an1/AN_PERF_01.blend')
