exec(open('/tmp/an1/perf.py').read())
# ---------- Item 3 · Nutcracker march from walk_with_briefcase_a ----------
CID = 'kfb_locomotion_walk_with_briefcase_a'; NEWID = 'kfb_locomotion_nutcracker_march_a'
meta = {}; res = {}
def pitch(v): return math.degrees(math.atan2(v.dot(FWD), -v.z))   # forward swing of a down-hanging segment, degrees
for rig, tn in RIGS.items():
    ob = bpy.data.objects[tn]; n = nfr(CID, rig); fr = list(range(1, n + 1))
    D = [basis(CID, rig, f) for f in fr]
    apply(ob, basis('kfb_idle_breathing_a', rig, 1)); hh = W(ob, 'hips').z
    # donor measurements
    zs = {s: [] for s in 'lr'}; armp = []; spine_dirs = []
    for P in D:
        apply(ob, P)
        for s in 'lr': zs[s].append(W(ob, 'foot.' + s).z)
        armp.append(pitch(W(ob, 'lowerarm.l') - W(ob, 'upperarm.l')))
        spine_dirs.append((W(ob, 'head') - W(ob, 'hips')).normalized())
    zmin = {s: min(zs[s]) for s in 'lr'}
    swing = {s: [smooth((z - zmin[s]) / (0.05 * hh)) for z in zs[s]] for s in 'lr'}   # 0 planted .. 1 clearly in the air
    arm_mean = sum(armp) / len(armp); sd = sum(spine_dirs, Vector()) / len(spine_dirs)
    lean_mean = math.degrees(math.atan2(sd.dot(FWD), sd.z))
    chest_mean = D[0]['chest'][0]; head_mean = D[0]['head'][0]
    ra_fix = {b: D[0][b] for b in ARM['r']}
    frames = []
    for i, P in enumerate(D):
        P = dict(P)
        for b in ('chest', 'head'):   # stiffer upper body: pull towards the first-frame pose
            q, l = P[b]; P[b] = (q.slerp(D[0][b][0], 0.6 if b == 'chest' else 0.7), l)
        for b in ARM['r']: P[b] = ra_fix[b]                       # rifle arm: held still at the side
        apply(ob, P)
        rot_world(ob, 'spine', Quaternion(SIDE, -math.radians(lean_mean)))   # upright: remove the mean forward lean
        # left arm: straight elbow, bigger swing
        pb = ob.pose.bones['lowerarm.l']; pb.rotation_quaternion = pb.rotation_quaternion.slerp(Quaternion(), 0.8); bpy.context.view_layer.update()
        extra = (armp[i] - arm_mean) * 0.8
        rot_world(ob, 'upperarm.l', Quaternion(SIDE, -math.radians(extra)))
        # knee lift in swing only (stance untouched, so no new foot slide)
        for s in 'lr':
            w = math.sin(math.pi * swing[s][i]) if swing[s][i] > 0 else 0.0
            w = swing[s][i] ** 0.7
            if w > 0:
                rot_world(ob, 'upperleg.' + s, Quaternion(SIDE, -math.radians(38) * w))
                rot_world(ob, 'lowerleg.' + s, Quaternion(SIDE, math.radians(55) * w))
        frames.append(read(ob))
    fix_signs(frames)
    # measurements after
    zs2 = {s: [] for s in 'lr'}; armp2 = []; lean2 = []
    for P in frames:
        apply(ob, P)
        for s in 'lr': zs2[s].append(W(ob, 'foot.' + s).z)
        armp2.append(pitch(W(ob, 'lowerarm.l') - W(ob, 'upperarm.l')))
        v = (W(ob, 'head') - W(ob, 'hips')); lean2.append(math.degrees(math.atan2(v.dot(FWD), v.z)))
    q0 = frames[0]; q1 = frames[-1]
    loopdiff = max(math.degrees(q0[b][0].rotation_difference(q1[b][0]).angle) for b in BONES if b != 'root')
    meta[rig] = {'frames': n, 'donorFootLiftCm': {s: round((max(zs[s]) - zmin[s]) * 100, 1) for s in 'lr'},
                 'marchFootLiftCm': {s: round((max(zs2[s]) - min(zs2[s])) * 100, 1) for s in 'lr'},
                 'leftArmSwingDeg': {'donor': round(max(armp) - min(armp), 1), 'march': round(max(armp2) - min(armp2), 1)},
                 'torsoLeanDeg': {'donor': round(lean_mean, 1), 'march': round(sum(lean2) / len(lean2), 1)},
                 'loopPoseDiffDeg': round(loopdiff, 2),
                 'contactsDonor': contacts(ob, D, hh), 'contacts': contacts(ob, frames, hh)}
    write_action(NEWID + '__' + rig + '__N', ob, frames); res[rig] = frames
    print(rig, json.dumps({k: v for k, v in meta[rig].items() if not k.startswith('contacts')}),
          {k: v['maxSlideInPlantCm'] for k, v in meta[rig]['contactsDonor'].items()}, {k: v['maxSlideInPlantCm'] for k, v in meta[rig]['contacts'].items()}, flush=True)
json.dump(meta, open('/tmp/an1/out/march_meta.json', 'w'), indent=1)
def rifle(ob, rig, f):
    h = W(ob, 'handslot.r'); L = {'Rig_Medium': 1.0, 'Rig_Large': 2.0}[rig]
    cyl(0.025 * L, L, h + UP * L * 0.42, (0, 0, 0), (0.35, 0.22, 0.12))
    cyl(0.012 * L, L * 0.5, h + UP * L * 0.95, (0, 0, 0), (0.2, 0.2, 0.22))
sheet(NEWID, res, rifle, side=True)
sheet('_march_front', res, rifle)
bpy.ops.wm.save_as_mainfile(filepath='/tmp/an1/AN_PERF_01.blend')
