import bpy, json, math, os, sys
import numpy as np
bpy.ops.wm.open_mainfile(filepath='/tmp/ml7/KFB_MOTION_LIBRARY_07.blend')
sc = bpy.context.scene
T = {'Rig_Medium': 'Rig_Raider', 'Rig_Large': 'Rig_Brute'}
L = json.load(open('/tmp/ml7/ml7_log.json'))
post = {}
def use(ob, a):
    if not ob.animation_data: ob.animation_data_create()
    ob.animation_data.action = a; ob.animation_data.action_slot = a.slots[0]
for cid in L:
    post[cid] = {}
    for rig, tn in T.items():
        a = bpy.data.actions[cid + '__' + rig]; ob = bpy.data.objects[tn]; use(ob, a)
        n = int(a.frame_range[1]); qs = []
        for f in (1, n):
            sc.frame_set(f); bpy.context.view_layer.update()
            qs.append({pb.name: (ob.matrix_world @ pb.matrix).to_quaternion() for pb in ob.pose.bones})
        worst = 0
        for b in qs[0]:
            if b == 'root': continue
            d = abs(qs[0][b].dot(qs[1][b])); worst = max(worst, math.degrees(2 * math.acos(min(1, d))))
        sc.frame_set(1); bpy.context.view_layer.update()
        W = ob.matrix_world; pb = ob.pose.bones; v = (W @ pb['upperarm.l'].head) - (W @ pb['upperarm.r'].head)
        post[cid][rig] = {'loopPoseDiffDeg': round(worst, 1), 'facingYawDeg': round(math.degrees(math.atan2(v.y, v.x)), 1)}
    # rotation channels for duplicate detection (Rig_Medium)
a2 = {}
for cid in L:
    a = bpy.data.actions[cid + '__Rig_Medium']
    fc = [f for l in a.layers for s in l.strips for cb in s.channelbags for f in cb.fcurves if 'rotation' in f.data_path]
    arr = []
    for f in fc:
        co = np.zeros(len(f.keyframe_points) * 2); f.keyframe_points.foreach_get('co', co); arr.append(co[1::2])
    a2[cid] = arr
dups = {}
ids = list(L)
for i, x in enumerate(ids):
    for y in ids[:i]:
        if len(a2[x]) == len(a2[y]) and all(len(p) == len(q) for p, q in zip(a2[x], a2[y])):
            d = max(float(np.abs(p - q).max()) for p, q in zip(a2[x], a2[y]))
            if d < 1e-5: dups[x] = y
json.dump({'post': post, 'dups': dups}, open('/tmp/ml7/post7.json', 'w'), indent=1)
print('dups', dups)
# contact sheets (same framing as v2)
s = open('/tmp/ml4/ml_sheets_orig.py').read().replace("ML='/Users/georgv.westphalen/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/MOTION_LIB/'", "ML='/tmp/ml7/'")
s = s.replace("tgt=Vector((r.x,r.y,max(r.z,H*0.2)+H*0.2))", "tgt=Vector((r.x,r.y,max(r.z,H*0.2)+H*0.3))").replace("Vector((H*1.0,-H*1.8,H*0.45))", "Vector((H*1.15,-H*2.1,H*0.5))").replace("img.filepath_raw=ML+'sheets/'+cid+'.png'", "img.filepath_raw=SD+cid+'.png'").replace("return ML+'sheets/'+cid+'.png'", "return SD+cid+'.png'")
ns = {}; exec(compile(s, 's', 'exec'), ns); os.makedirs('/tmp/ml7/sheets', exist_ok=True)
ns['setup_render']()
for j, cid in enumerate(ids):
    g = L[cid]['group']; ns['SD'] = f'/tmp/ml7/out/sheets/{g}/'; os.makedirs(ns['SD'], exist_ok=True)
    ns['sheet'](cid); print('sheet', j + 1, cid, flush=True)
print('DONE', flush=True)
