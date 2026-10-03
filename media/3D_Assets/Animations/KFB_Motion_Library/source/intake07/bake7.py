import bpy, json, math, sys, time
from mathutils import Vector
sys.path.insert(0, '/tmp/ml4')
IDS = json.load(open('/tmp/ml7/ids.json'))
b = open('/tmp/ml4/ml_bake_orig.py').read().replace("BASE='/Users/georgv.westphalen/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/'", "BASE='/mnt/user-data/uploads/'")
b = b.replace("INBOX=BASE+'_inbox/'", "INBOX=BASE+'BLENDER MCP--_inbox/'")
bpy.ops.wm.open_mainfile(filepath='/tmp/ml4/base.blend')
ns = {}; exec(compile(b, 'b', 'exec'), ns)
sc = bpy.context.scene; log = {}; t0 = time.time()
def style(out, hh, fps):
    # walk-style descriptors in the character's own frame (forward from the shoulder line at frame 1), lengths / hips height
    v = out[0][1]['hand.l'] - out[0][1]['hand.r']; v.z = 0
    l0 = out[0][2]; 
    n = len(out); H = [o[1]['hips'] for o in out]
    sh = Vector((0, 0, 0))
    fwd = None
    rel = lambda o, k: o[1][k] - o[1]['hips']
    # facing from hips world rotation: local -Y of the hips bone is not reliable across rigs; use travel direction or hand midline
    d = H[-1] - H[0]; d.z = 0
    if d.length > 0.05 * hh: fwd = d.normalized()
    else:
        q = out[0][2]['hips']; fwd = (q @ Vector((0, 0, 1))); fwd.z = 0
        fwd = fwd.normalized() if fwd.length > 1e-6 else Vector((0, -1, 0))
    side = Vector((fwd.y, -fwd.x, 0))   # to the character's right
    def ax(k, a): return [rel(o, k).dot(a) / hh for o in out]
    res = {}
    for k in ('hand.l', 'hand.r'):
        f = ax(k, fwd); s = ax(k, side); z = [(o[1][k].z - o[1]['hips'].z) / hh for o in out]
        res[k] = {'swing': round(max(f) - min(f), 3), 'fwdMean': round(sum(f) / n, 3), 'sideMean': round(sum(abs(x) for x in s) / n, 3), 'zMean': round(sum(z) / n, 3), 'zRange': round(max(z) - min(z), 3)}
    hf = ax('head', fwd); res['lean'] = round(sum(hf) / n, 3)
    zs = [h.z for h in H]; res['bounce'] = round((max(zs) - min(zs)) / hh, 3)
    ft = [o[1]['foot.l'] - o[1]['foot.r'] for o in out]; res['stride'] = round(max(abs(x.dot(fwd)) for x in ft) / hh, 3)
    res['footWidth'] = round(sum(abs(x.dot(side)) for x in ft) / n / hh, 3)
    return res
for i, r in enumerate(IDS):
    fn, cid = r['file'], r['id']; t = time.time()
    arm, acts = ns['import_src'](fn); fps = sc.render.fps / sc.render.fps_base
    f0, f1, fr = ns['sample_src'](arm)
    res = {**r, 'fps': fps, 'srcFrames': len(fr), 'srcBones': len(arm.data.bones), 'rigs': {}}
    for rig, tn in ns['TARGETS'].items():
        out, k = ns['retarget'](arm, fr, tn); ns['make_action'](cid + '__' + rig, tn, out)
        hh = bpy.data.objects[tn].data.bones['hips'].head_local.z
        m = ns['measure'](out, hh, fps); m['k'] = round(k, 4)
        m['rootXY'] = round(((out[-1][1]['root'].x - out[0][1]['root'].x) ** 2 + (out[-1][1]['root'].y - out[0][1]['root'].y) ** 2) ** .5, 3)
        sp = {}
        for h in ('hand.l', 'hand.r'):
            sp[h] = [0.0] + [(out[j][1][h] - out[j - 1][1][h]).length * fps for j in range(1, len(out))]
        hand = max(sp, key=lambda h: max(sp[h])); j = max(range(len(out)), key=lambda x: sp[hand][x])
        m['peakHand'] = {'hand': hand, 'frame': j + 1, 'speed': round(sp[hand][j], 2)}
        m['style'] = style(out, hh, fps)
        res['rigs'][rig] = m
    for a in acts: bpy.data.actions.remove(a)
    bpy.data.objects.remove(arm)
    res['sec'] = round(time.time() - t, 1); log[cid] = res
    json.dump(log, open('/tmp/ml7/ml7_log.json', 'w'))
    print('bake', i + 1, cid, res['sec'], flush=True)
bpy.ops.wm.save_as_mainfile(filepath='/tmp/ml7/KFB_MOTION_LIBRARY_07.blend')
print('BAKED', round(time.time() - t0), flush=True)
