exec(open('/tmp/an1/perf.py').read())
# ---------- Item 1 · gift give / receive ----------
N = 90
def reach_pose(ob, rig, P, w, target_mid, halfw, lean_deg):
    apply(ob, P)
    if w <= 0: return read(ob)
    # torso lean forward about the character's side axis
    rot_world(ob, 'spine', Quaternion(SIDE, -math.radians(lean_deg) * w))
    rot_world(ob, 'head', Quaternion(SIDE, math.radians(lean_deg * 0.6) * w))   # keep the face up
    for s, sg in (('l', 1), ('r', -1)):
        pb = ob.pose.bones['lowerarm.' + s]; pb.rotation_quaternion = pb.rotation_quaternion.slerp(Quaternion(), 0.75 * w)
        pw = ob.pose.bones['wrist.' + s]; pw.rotation_quaternion = pw.rotation_quaternion.slerp(Quaternion(), 0.6 * w)
        bpy.context.view_layer.update()
        tgt = target_mid + SIDE * sg * halfw
        for _ in range(2): aim(ob, 'upperarm.' + s, lambda: W(ob, 'handslot.' + s), tgt, w)
    return read(ob)
out = {}; meta = {}
for rig, tn in RIGS.items():
    ob = bpy.data.objects[tn]
    idle = lambda f: basis('kfb_idle_breathing_a', rig, f, loop=True)
    carryA = basis('kfb_locomotion_jogging_with_box_a', rig, 1)
    apply(ob, idle(1)); hh = W(ob, 'hips').z; shl = (W(ob, 'upperarm.l') + W(ob, 'upperarm.r')) / 2
    armlen = (W(ob, 'upperarm.l') - W(ob, 'hand.l', True)).length
    apply(ob, mix(idle(1), carryA, 1, ARM['l'] + ARM['r'])); halfw = abs((W(ob, 'handslot.l') - W(ob, 'handslot.r')).x) / 2
    offer = shl + FWD * armlen * 1.0 - UP * armlen * 0.12
    give, recv = [], []
    for f in range(1, N + 1):
        base = idle(f); carry = mix(base, carryA, 1, ARM['l'] + ARM['r'])
        # GIVE: carry -> reach (10..30) -> hold -> release at 50 -> empty arms back to idle (50..72)
        if f <= 50:
            w = min(1.0, ramp(f, 10, 30)) - 0.04 * math.sin((f - 30) / 20 * math.pi) * (f > 30)
            P = reach_pose(ob, rig, carry, w, offer + UP * armlen * 0.07 * ramp(f, 28, 38) * (1 - ramp(f, 44, 50)), halfw, 12)
        else:
            R = reach_pose(ob, rig, carry, 1.0, offer, halfw, 12); P = mix(R, base, ramp(f, 50, 72))
        give.append(P)
        # RECEIVE: idle -> reach (15..38) -> grab at 40 -> pull to chest into carry pose (45..68) -> hold carry
        if f <= 45: P = reach_pose(ob, rig, base, ramp(f, 15, 38), offer, halfw, 6)
        else:
            R = reach_pose(ob, rig, carry, 1.0, offer, halfw, 6); P = mix(R, carry, ramp(f, 45, 68))
            if f > 68:   # happy head wobble while holding
                apply(ob, P); rot_world(ob, 'head', Quaternion(FWD, math.radians(7) * math.sin((f - 68) / 11 * math.pi))); P = read(ob)
        recv.append(P)
    out[rig] = {'give': fix_signs(give), 'recv': fix_signs(recv)}
    meta[rig] = {'hipsHeight': round(hh, 3), 'armLength': round(armlen, 3), 'boxHalfWidth': round(halfw, 3),
                 'offerPointFromHips': [round(x, 3) for x in (offer - Vector((W(ob, 'hips').x, W(ob, 'hips').y, 0)))],
                 'contacts': {'give': contacts(ob, give, hh), 'receive': contacts(ob, recv, hh)}}
    write_action('kfb_interaction_gift_give_a__' + rig + '__N', ob, give)
    write_action('kfb_interaction_gift_receive_a__' + rig + '__N', ob, recv)
    print(rig, json.dumps(meta[rig]), flush=True)
# previews with the box
import os; os.makedirs('/tmp/an1/out/sheets', exist_ok=True)
def boxprop(kind):
    def fn(ob, rig, f):
        own = (f <= 50) if kind == 'give' else (f >= 40)
        if not own: return
        c = (W(ob, 'handslot.l') + W(ob, 'handslot.r')) / 2; s = meta[rig]['boxHalfWidth'] * 2
        cube((s * 0.9, s * 0.75, s * 0.7), c, (0.85, 0.12, 0.15))
    return fn
sheet('kfb_interaction_gift_give_a', {r: out[r]['give'] for r in RIGS}, boxprop('give'))
sheet('kfb_interaction_gift_receive_a', {r: out[r]['recv'] for r in RIGS}, boxprop('recv'))
sheet('_gift_give_side', {r: out[r]['give'] for r in RIGS}, boxprop('give'), side=True)
json.dump(meta, open('/tmp/an1/out/gift_meta.json', 'w'), indent=1)
bpy.ops.wm.save_as_mainfile(filepath='/tmp/an1/AN_PERF_01.blend')
