exec(open('/tmp/an1/perf.py').read())
# Item 2, repair pass 1: no hop clip. Solve fist contact by staging: the defender stands off the attack line so the big
# heads pass each other and the fist lands on the torso. Search the smallest side angle that keeps heads apart.
CAT = {c['id']: c for c in json.load(open('/tmp/ml4/out/KFB_Motion_Library.catalog.json'))['clips']}
DON = ['kfb_action_quad_punch_a', 'kfb_action_hook_punch_b', 'kfb_action_punching_b']
def dup(tn):
    src = bpy.data.objects[tn]; B = src.copy(); B.name = 'DEF_' + tn; B.animation_data_clear(); sc.collection.objects.link(B); kids = []
    for c in src.children:
        m = c.copy(); sc.collection.objects.link(m); m.parent = B
        for md in m.modifiers:
            if md.type == 'ARMATURE': md.object = B
        kids.append(m)
    for pb in B.pose.bones: pb.rotation_mode = 'QUATERNION'
    return B, kids
def head_sphere(ob, rig, meshname):
    dg = bpy.context.evaluated_depsgraph_get(); hd = bpy.data.objects[meshname].evaluated_get(dg)
    vs = [hd.matrix_world @ v.co for v in hd.data.vertices]; c = sum(vs, Vector()) / len(vs)
    r = max(((v - c) * Vector((1, 1, 0))).length for v in vs); return c, r
def body_front(ob, rig):
    body = {'Rig_Medium': 'OrcRaider_Body', 'Rig_Large': 'OrcBrute_Body'}[rig]
    dg = bpy.context.evaluated_depsgraph_get(); bd = bpy.data.objects[body].evaluated_get(dg); hp = W(ob, 'hips')
    return max((bd.matrix_world @ v.co - hp).dot(FWD) for v in bd.data.vertices)
meta = {}; cam = cam_setup(300); rows = []
for rig, tn in RIGS.items():
    ob = bpy.data.objects[tn]; show(rig); D, kids = dup(tn); H = {'Rig_Medium': 1.9, 'Rig_Large': 3.9}[rig]; tiles = []
    headmesh_D = 'DEF_x'
    for cid in DON:
        ev = CAT[cid]['events']['strike']; s = ev['frame']; limb = ev['limb']
        apply(ob, basis(cid, rig, s)); fist = W(ob, limb, True); hipA = W(ob, 'hips')
        ax = fist - hipA; ax.z = 0; ax.normalize(); perp = Vector((-ax.y, ax.x, 0))
        hcA, rA = head_sphere(ob, rig, HEADMESH[rig])
        best = None
        for side in (1, -1):
            for deg in range(0, 90, 2):
                phi = math.radians(deg) * side
                n = (ax * math.cos(phi) + perp * math.sin(phi)).normalized()
                apply(D, basis('kfb_action_boxing_a', rig, 1)); D.rotation_mode = 'XYZ'; D.location = (0, 0, 0); D.rotation_euler = (0, 0, 0)
                bpy.context.view_layer.update(); bf = body_front(D, rig) * 0.9
                # defender faces back along n; hips at fist + n * body front
                yaw = math.atan2(-n.y, -n.x) - math.atan2(FWD.y, FWD.x)
                D.rotation_euler = (0, 0, yaw); bpy.context.view_layer.update()
                hpD = W(D, 'hips'); D.location = Vector((fist.x, fist.y, 0)) + n * bf - Vector((hpD.x, hpD.y, 0)) + D.location
                bpy.context.view_layer.update()
                dg = bpy.context.evaluated_depsgraph_get(); hdm = [o for o in kids if o.name.startswith(HEADMESH[rig])][0].evaluated_get(dg)
                vs = [hdm.matrix_world @ v.co for v in hdm.data.vertices]; hcD = sum(vs, Vector()) / len(vs)
                gap = ((hcD - hcA) * Vector((1, 1, 0))).length - (rA + rA)
                if gap >= 0.0:
                    if best is None or deg < best[0]: best = (deg, side, gap, bf, (hpD - hipA).length)
                    break
        if best is None:
            meta.setdefault(cid, {})[rig] = {'strikeFrame': s, 'limb': limb, 'result': 'no side angle 0-88 deg keeps the heads apart', 'headRadius': round(rA, 3),
                'fistAheadOfHips': round((fist - hipA).length, 3), 'headCentreAheadOfHips': round(((hcA - hipA) * Vector((1, 1, 0))).length, 3)}
            print(rig, cid, meta[cid][rig], flush=True); continue
        deg, side, gap, bf, dist = best
        phi = math.radians(deg) * side; n = (ax * math.cos(phi) + perp * math.sin(phi)).normalized()
        yaw = math.atan2(-n.y, -n.x) - math.atan2(FWD.y, FWD.x); D.rotation_euler = (0, 0, 0); D.location = (0, 0, 0)
        apply(D, basis('kfb_action_boxing_a', rig, 1)); D.rotation_euler = (0, 0, yaw); bpy.context.view_layer.update()
        hpD = W(D, 'hips'); D.location = Vector((fist.x, fist.y, 0)) + n * bf - Vector((hpD.x, hpD.y, 0)); bpy.context.view_layer.update()
        hpD = W(D, 'hips'); rel = hpD - hipA; rel.z = 0
        meta.setdefault(cid, {})[rig] = {'strikeFrame': s, 'limb': limb, 'attackAxisDeg': round(math.degrees(math.atan2(ax.y, ax.x)), 1),
            'defenderOffAxisDeg': deg * side, 'defenderHipsFromAttackerHips': [round(rel.x, 3), round(rel.y, 3)], 'hipsDistance': round(rel.length, 3),
            'headRadius': round(rA, 3), 'headGapCm': round(gap * 100, 1), 'fistLandsOn': 'torso front'}
        print(rig, cid, meta[cid][rig], flush=True)
        mid = (hipA + hpD) / 2; tgt = Vector((mid.x, mid.y, H * 0.5)); pv = Vector((-rel.y, rel.x, 0)).normalized()
        for view in (pv, (pv + rel.normalized() * 0.0 + Vector((0, 0, 1.2))).normalized()):
            cam.location = tgt + view * H * 2.7 + Vector((0, 0, H * 0.2)); cam.rotation_euler = (tgt - cam.location).to_track_quat('-Z', 'Y').to_euler()
            tiles.append(tile())
    rows.append(np.concatenate(tiles, axis=1) if tiles else [])
    for k in kids: bpy.data.objects.remove(k)
    bpy.data.objects.remove(D)
save_rows([r for r in rows if len(r)], '/tmp/an1/out/sheets/_punch_staging_proof_large.png')
json.dump(meta, open('/tmp/an1/out/punch_staging.json', 'w'), indent=1)
