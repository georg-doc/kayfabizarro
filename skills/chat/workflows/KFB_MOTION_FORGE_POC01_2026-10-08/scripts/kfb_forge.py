"""KFB Motion Forge POC 01 (#376): bring UniMate samples onto the KayKit rigs and measure them.

R&D only (UniMate checkpoints are CC BY-NC 4.0). Actions are named 'M|FORGE|...' / 'L|FORGE|...' and are never
exported to the Motion Library.

Pipeline per animated GLB (UniMate run_animate_motion output, 60 frames @ 30 fps):
  import GLB -> sample the source armature's pose (armature space) -> world-rotation transfer onto the target rig
  (same math as ml_bake.retarget: D = R_src(t) * R_src_rest^-1, R_tgt = D * R_tgt_rest; hips translation scaled by
  the hips-height ratio; root stays at rest) -> one action per clip at 30 fps.
Lane A sources already carry KayKit bone names; lane B (Mixamo 22-joint rig) uses MIX below.
"""
import bpy, os, json, math, glob, re
from mathutils import Matrix, Vector, Quaternion

FORGE = os.path.expanduser('~/KFB_MotionForge')
TARGETS = {'M': 'ARM_farmer_b', 'L': 'ARM_orcbrute'}
SCENE = '369_ISOLATION'
MIX = {'hips': 'Hips', 'spine': 'Spine', 'chest': 'Spine2', 'head': 'Head',
       'upperarm.l': 'LeftArm', 'lowerarm.l': 'LeftForeArm', 'wrist.l': 'LeftHand', 'hand.l': 'LeftHand',
       'upperarm.r': 'RightArm', 'lowerarm.r': 'RightForeArm', 'wrist.r': 'RightHand', 'hand.r': 'RightHand',
       'upperleg.l': 'LeftUpLeg', 'lowerleg.l': 'LeftLeg', 'foot.l': 'LeftFoot', 'toes.l': 'LeftToeBase',
       'upperleg.r': 'RightUpLeg', 'lowerleg.r': 'RightLeg', 'foot.r': 'RightFoot', 'toes.r': 'RightToeBase'}


def import_glb(path):
    before = set(bpy.data.objects.keys())
    bpy.ops.import_scene.gltf(filepath=path)
    objs = [o for o in bpy.data.objects if o.name not in before]
    arm = [o for o in objs if o.type == 'ARMATURE'][0]
    return arm, objs


def cleanup(objs):
    for o in objs:
        d = o.data if o.type in ('ARMATURE', 'MESH') else None
        bpy.data.objects.remove(o, do_unlink=True)
        if d is not None and d.users == 0:
            (bpy.data.armatures if isinstance(d, bpy.types.Armature) else bpy.data.meshes).remove(d)


def src_name_map(arm, lane):
    names = {b.name: b.name for b in arm.data.bones}
    if lane == 'A':
        return {n: n for n in names}
    short = {re.sub(r'^.*:', '', n): n for n in names}
    return {k: short[v] for k, v in MIX.items() if v in short}


def sample(arm):
    a = arm.animation_data.action
    f0, f1 = int(round(a.frame_range[0])), int(round(a.frame_range[1]))
    sc = bpy.context.scene
    fr = []
    for f in range(f0, f1 + 1):
        sc.frame_set(f)
        mw = arm.matrix_world.copy()
        fr.append({pb.name: mw @ pb.matrix for pb in arm.pose.bones})
    mw = arm.matrix_world.copy()
    rest = {b.name: mw @ b.matrix_local for b in arm.data.bones}
    return fr, rest


def retarget(frames, srest, smap, T, align=True):
    restT = {b.name: b.matrix_local.copy() for b in T.data.bones}
    hs = smap.get('hips')
    k = restT['hips'].translation.z / max(1e-6, srest[hs].translation.z)
    out = []
    prevq = {}
    for fr in frames:
        M, basis = {}, {}
        for b in T.data.bones:
            n = b.name
            s = smap.get(n)
            if s is None:          # root, handslots: keep rest relative to parent
                if b.parent:
                    P = M[b.parent.name] @ restT[b.parent.name].inverted() @ restT[n]
                else:
                    P = restT[n].copy()
                M[n] = P
                basis[n] = (Quaternion(), Vector())
                continue
            D = fr[s].to_3x3().normalized().to_quaternion() @ srest[s].to_3x3().normalized().to_quaternion().inverted()
            # rest alignment: turn the target rest bone onto the source rest bone direction first (T-pose vs A-pose)
            sdir = (srest[s].to_3x3().normalized() @ Vector((0, 1, 0))).normalized()
            tdir = (restT[n].to_3x3().normalized() @ Vector((0, 1, 0))).normalized()
            O = tdir.rotation_difference(sdir) if align else Quaternion()
            R = (D @ O @ restT[n].to_quaternion()).to_matrix().to_4x4()
            if n == 'hips':
                R.translation = restT[n].translation + (fr[s].translation - srest[s].translation) * k
            P = M[b.parent.name] @ restT[b.parent.name].inverted() @ restT[n] if b.parent else restT[n]
            if n == 'hips':
                B = P.inverted() @ R
                M[n] = R
            else:
                B = (P.to_3x3().inverted() @ R.to_3x3()).to_4x4()
                M[n] = P @ B
            q = B.to_quaternion()
            if n in prevq and q.dot(prevq[n]) < 0:
                q = -q
            prevq[n] = q
            basis[n] = (q, B.translation.copy() if n == 'hips' else Vector())
        out.append(basis)
    return out, k


def make_action(name, T, out, fps_scale=1.0):
    a = bpy.data.actions.get(name)
    if a:
        bpy.data.actions.remove(a)
    a = bpy.data.actions.new(name)
    a.use_fake_user = True
    slot = a.slots.new(id_type='OBJECT', name=T.name)
    lay = a.layers.new('L'); st = lay.strips.new(type='KEYFRAME'); cb = st.channelbag(slot, ensure=True)
    for b in T.data.bones:
        bn = b.name
        for path, cnt in [('rotation_quaternion', 4)] + ([('location', 3)] if bn == 'hips' else []):
            for i in range(cnt):
                fc = cb.fcurves.new(f'pose.bones["{bn}"].{path}', index=i, group_name=bn)
                fc.keyframe_points.add(len(out))
                co = []
                for fi, basis in enumerate(out):
                    q, l = basis[bn]
                    co += [fi * fps_scale, q[i] if path == 'rotation_quaternion' else l[i]]
                fc.keyframe_points.foreach_set('co', co)
                for kp in fc.keyframe_points:
                    kp.interpolation = 'LINEAR'
                fc.update()
    a['forge'] = True
    return a


def use_action(T, a):
    ad = T.animation_data or T.animation_data_create()
    ad.use_nla = False
    ad.action = a
    try:
        ad.action_slot = a.slots[0]
    except Exception:
        pass


def measure(T, a, task):
    """#369-style numbers in the armature's own frame (ground = armature z 0)."""
    sc = bpy.context.scene
    use_action(T, a)
    f0, f1 = [int(round(x)) for x in a.frame_range]
    rest_hand = {}
    for b in ('hand.l', 'hand.r', 'head'):
        rest_hand[b] = T.data.bones[b].head_local.copy()
    track = {k: [] for k in ('hips', 'hand.l', 'hand.r', 'head', 'toes.l', 'toes.r', 'foot.l', 'foot.r', 'chest', 'upperarm.r')}
    for f in range(f0, f1 + 1):
        sc.frame_set(f)
        for k in track:
            pb = T.pose.bones[k]
            track[k].append(((pb.head + pb.tail) / 2) if k.startswith('hand') else pb.head.copy())
    H = T.data.bones['head'].head_local.z
    hip0 = track['hips'][0]
    hip_travel = max((Vector((p.x - hip0.x, p.y - hip0.y)).length for p in track['hips']))
    slide = 0.0
    for ft in ('toes.l', 'toes.r'):
        pts = track[ft]
        zmin = min(p.z for p in pts)
        planted = [p for p in pts if p.z < zmin + 0.03 * H]
        if planted:
            xs = [p.x for p in planted]; ys = [p.y for p in planted]
            slide = max(slide, math.hypot(max(xs) - min(xs), max(ys) - min(ys)))
    feet_min = min(p.z for ft in ('toes.l', 'toes.r', 'foot.l', 'foot.r') for p in track[ft])
    hand_min = min(p.z for h in ('hand.l', 'hand.r') for p in track[h])
    head_min = min(p.z for p in track['head'])
    hits, worst = 0, 9
    try:
        import kfb_talk
        hits, worst = kfb_talk.hand_in_head(T, a.name, step=1)
    except Exception as e:
        hits, worst = -1, str(e)[:60]
    # forward = -Y in armature space (KayKit faces -Y in Blender)
    fwd = lambda p: -(p.y - hip0.y)
    r = dict(frames=f1 - f0 + 1, hipTravel=round(hip_travel / H, 3), footSlide=round(slide / H, 3),
             feetMinZ=round(feet_min / H, 3), handMinZ=round(hand_min / H, 3), headMinZ=round(head_min / H, 3),
             handInHead=hits, headClear=worst)
    if task == 'T1':
        spread0 = (track['hand.l'][0] - track['hand.r'][0]).length
        spread = max((l - rr).length for l, rr in zip(track['hand.l'], track['hand.r']))
        lift = max(max(p.z for p in track[h]) - track[h][0].z for h in ('hand.l', 'hand.r'))
        r.update(spreadGain=round((spread - spread0) / H, 3), handLift=round(lift / H, 3))
        r['score'] = round(r['spreadGain'] + r['handLift'] - 2 * r['hipTravel'] - 3 * r['footSlide'], 3)
    elif task == 'T2':
        low = min((p.z for h in ('hand.l', 'hand.r') for p in track[h]))
        reach = max(fwd(p) for h in ('hand.l', 'hand.r') for p in track[h])
        both_low = min(max(l.z, rr.z) for l, rr in zip(track['hand.l'], track['hand.r']))
        offer = [max(l.z, rr.z) for l, rr in zip(track['hand.l'], track['hand.r']) if min(fwd(l), fwd(rr)) > 0.15 * H]
        r.update(handsLowZ=round(low / H, 3), bothHandsLowZ=round(both_low / H, 3), handReach=round(reach / H, 3),
                 handsLowM=round(both_low, 3), offerLowM=round(min(offer), 3) if offer else None,
                 offerFrames=len(offer))
        r['score'] = round((-(r['offerLowM'] / H) if r['offerLowM'] is not None else -2) + 0.5 * r['handReach'] - 2 * r['hipTravel'], 3)
    elif task == 'T3':
        reach = max(fwd(p) for p in track['hand.r'])
        sh = track['upperarm.r']
        below = sum(1 for p, s in zip(track['hand.r'], sh) if p.z < s.z) / len(sh)
        r.update(rHandReach=round(reach / H, 3), handBelowShoulder=round(below, 2))
        r['score'] = round(r['rHandReach'] + 0.3 * below - (1 if hits > 0 else 0) - 2 * r['hipTravel'], 3)
    return r


def task_of(prompt, prompts):
    for t, L in prompts.items():
        if prompt in L:
            return t, L.index(prompt)
    return None, None


def run_lane(lane_dir, lane, rigs, prompts, limit=None):
    """lane_dir: samples/<run>; rigs: which targets ('M','L') receive these clips."""
    man = json.load(open(os.path.join(FORGE, 'samples', lane_dir, 'manifest.json')))
    anim = os.path.join(FORGE, 'samples', lane_dir, 'animated')
    rows = []
    sc = bpy.data.scenes[SCENE]
    win = bpy.context.window; prev = win.scene; win.scene = sc
    try:
        items = sorted(man['samples'].items())[:limit] if limit else sorted(man['samples'].items())
        for npy, info in items:
            glb = os.path.join(anim, npy.replace('.npy', '.glb'))
            if not os.path.exists(glb):
                continue
            task, pi = task_of(info['prompt'], prompts)
            rep = re.search(r'rep_(\d+)', npy).group(1)
            arm, objs = import_glb(glb)
            smap = src_name_map(arm, lane)
            frames, srest = sample(arm)
            cleanup(objs)
            for rig in rigs:
                if lane == 'A' and not npy.startswith('KFB_Rig' + ('Medium' if rig == 'M' else 'Large')):
                    continue
                T = bpy.data.objects[TARGETS[rig]]
                out, k = retarget(frames, srest, smap, T)
                name = f'{rig}|FORGE|{lane}|{task}_p{pi}_r{rep}'
                a = make_action(name, T, out)
                a['prompt'] = info['prompt']; a['src'] = npy
                m = measure(T, a, task)
                rows.append(dict(action=name, rig=rig, lane=lane, task=task, prompt=info['prompt'], rep=int(rep),
                                 src=npy, k=round(k, 3), **m))
    finally:
        win.scene = prev
    return rows


def measure_donor(rig, action, task):
    sc = bpy.data.scenes[SCENE]; win = bpy.context.window; prev = win.scene; win.scene = sc
    try:
        T = bpy.data.objects[TARGETS[rig]]
        return dict(action=action, rig=rig, lane='donor', task=task, **measure(T, bpy.data.actions[action], task))
    finally:
        win.scene = prev


def render_strip(rig, action, out_dir, frames=(0, 15, 30, 45, 59), res=360, tag=None, yaw_deg=30):
    """Workbench stills of one action on the target rig (front 3/4), one PNG per frame."""
    sc = bpy.data.scenes[SCENE]; win = bpy.context.window; prev = win.scene; win.scene = sc
    T = bpy.data.objects[TARGETS[rig]]
    os.makedirs(out_dir, exist_ok=True)
    keep = (sc.camera, sc.render.resolution_x, sc.render.resolution_y, sc.render.filepath, sc.frame_current)
    cd = bpy.data.cameras.new('FORGE_cam'); cam = bpy.data.objects.new('FORGE_cam', cd); sc.collection.objects.link(cam)
    ad = T.animation_data or T.animation_data_create(); kept = (ad.action, ad.use_nla)
    paths = []
    try:
        use_action(T, bpy.data.actions[action])
        base = T.matrix_world.translation
        zs = [(o.matrix_world @ Vector(c)).z for o in T.children if o.type == 'MESH' for c in o.bound_box]
        H = (max(zs) - base.z) if zs else T.data.bones['head'].tail_local.z * T.matrix_world.to_scale().z
        fwd = T.matrix_world.to_3x3() @ Vector((0, -1, 0)); fwd.z = 0; fwd.normalize()
        d = Matrix.Rotation(math.radians(yaw_deg), 3, 'Z') @ fwd
        cd.type = 'ORTHO'; cd.ortho_scale = H * 1.45
        tgt = base + Vector((0, 0, H * 0.5))
        cam.location = tgt + d * H * 6 + Vector((0, 0, H * 0.6))
        cam.rotation_euler = (tgt - cam.location).to_track_quat('-Z', 'Y').to_euler()
        sc.camera = cam; sc.render.resolution_x = sc.render.resolution_y = res
        hide = [o for o in sc.objects if o.type in ('MESH', 'ARMATURE', 'EMPTY') and o != T and not (o.parent == T or (o.parent and o.parent.parent == T) or o.name.startswith('EYE_' + T.name)) and not o.hide_render]
        for o in hide: o.hide_render = True
        for f in frames:
            sc.frame_set(f)
            p = os.path.join(out_dir, f'{tag or action.replace("|", "_")}_f{f:02d}.png')
            sc.render.filepath = p
            bpy.ops.render.render(write_still=True, scene=sc.name)
            paths.append(p)
        for o in hide: o.hide_render = False
    finally:
        ad.action, ad.use_nla = kept
        sc.camera, sc.render.resolution_x, sc.render.resolution_y, sc.render.filepath, f0 = keep
        sc.frame_set(f0)
        bpy.data.objects.remove(cam); bpy.data.cameras.remove(cd)
        win.scene = prev
    return paths
