# AN-PERF-01 · Resident Performance Batch · authoring library + items (Blender 5.0, headless bpy)
# Donors come from the published Motion Library GLBs (see build.py). Every new clip is written for
# Rig_Medium (Rig_Raider) and Rig_Large (Rig_Brute) by the same procedure, measured in each rig's own proportions.
import bpy, sys, json, math
import numpy as np
from mathutils import Vector, Matrix, Quaternion
bpy.ops.wm.open_mainfile(filepath='/tmp/an1/AN_PERF_01.blend')
sc = bpy.context.scene
RIGS = {'Rig_Medium': 'Rig_Raider', 'Rig_Large': 'Rig_Brute'}
HEADMESH = {'Rig_Medium': 'OrcRaider_Head', 'Rig_Large': 'OrcBrute_Head'}
ARM = {s: ['upperarm.' + s, 'lowerarm.' + s, 'wrist.' + s, 'hand.' + s, 'handslot.' + s] for s in 'lr'}
UP = Vector((0, 0, 1)); FWD = Vector((0, -1, 0)); SIDE = Vector((1, 0, 0))   # rigs face -Y at rest; +X = character's left
LOG = {}

def smooth(x): x = max(0.0, min(1.0, x)); return x * x * (3 - 2 * x)
def ramp(t, a, b): return smooth((t - a) / (b - a)) if b > a else float(t >= b)
for rig, tn in RIGS.items():
    ob = bpy.data.objects[tn]; ob.rotation_mode = 'QUATERNION'; ob.rotation_quaternion = (1, 0, 0, 0); ob.location = (0, 0, 0)
    ob.animation_data_clear()
    for pb in ob.pose.bones: pb.rotation_mode = 'QUATERNION'
BONES = [b.name for b in bpy.data.objects['Rig_Raider'].data.bones]

# ---- donor sampling ----
_fc = {}
def curves(name):
    if name not in _fc:
        a = bpy.data.actions[name]; d = {}
        for l in a.layers:
            for s in l.strips:
                for cb in s.channelbags:
                    for f in cb.fcurves: d[(f.data_path, f.array_index)] = f
        _fc[name] = (d, int(a.frame_range[1]))
    return _fc[name]
def donor(cid, rig): return f'{cid}__{rig}__D'
def nfr(cid, rig): return curves(donor(cid, rig))[1]
def basis(cid, rig, f, loop=False):
    d, n = curves(donor(cid, rig))
    if loop: f = 1 + (f - 1) % (n - 1)
    f = max(1, min(n, f)); out = {}
    for b in BONES:
        dp = f'pose.bones["{b}"]'
        out[b] = (Quaternion([d[(dp + '.rotation_quaternion', i)].evaluate(f) for i in range(4)]).normalized(),
                  Vector([d[(dp + '.location', i)].evaluate(f) for i in range(3)]))
    return out
def mix(A, B, w, bones=None):
    out = dict(A)
    for b in (bones or A.keys()):
        qa, la = A[b]; qb, lb = B[b]
        if qa.dot(qb) < 0: qb = -qb
        out[b] = (qa.slerp(qb, w), la.lerp(lb, w))
    return out
def apply(ob, P):
    for b, (q, l) in P.items():
        pb = ob.pose.bones[b]; pb.rotation_quaternion = q; pb.location = l; pb.scale = (1, 1, 1)
    bpy.context.view_layer.update()
def read(ob): return {b: (ob.pose.bones[b].rotation_quaternion.copy(), ob.pose.bones[b].location.copy()) for b in BONES}
def W(ob, b, tail=False): pb = ob.pose.bones[b]; return ob.matrix_world @ (pb.tail if tail else pb.head)
def rot_world(ob, b, R):
    # rotate a pose bone (and so its children) about its own head by world-space quaternion R
    pb = ob.pose.bones[b]; M = pb.matrix.copy(); h = M.translation.copy()
    N = R.to_matrix().to_4x4() @ Matrix.Translation(-h) @ M; N.translation = h
    pb.matrix = N; bpy.context.view_layer.update()
def aim(ob, b, eff, target, w):
    # rotate bone b so that the effector point `eff` (a bone head/tail getter) moves towards target
    a = ob.pose.bones[b].matrix.translation; e = eff()
    R = Quaternion().slerp((e - a).rotation_difference(target - a), w); rot_world(ob, b, R)

# ---- writing, measuring, rendering, export ----
def write_action(name, ob, frames):
    a = bpy.data.actions.get(name)
    if a: bpy.data.actions.remove(a)
    a = bpy.data.actions.new(name); a.use_fake_user = True
    slot = a.slots.new(id_type='OBJECT', name=ob.name); cb = a.layers.new('L').strips.new(type='KEYFRAME').channelbag(slot, ensure=True)
    n = len(frames)
    for b in BONES:
        for path, cnt in (('rotation_quaternion', 4), ('location', 3)):
            for i in range(cnt):
                fc = cb.fcurves.new(f'pose.bones["{b}"].{path}', index=i, group_name=b); fc.keyframe_points.add(n)
                co = []
                prev = None
                for fi, P in enumerate(frames):
                    q, l = P[b]
                    co += [fi + 1, (q if path == 'rotation_quaternion' else l)[i]]
                fc.keyframe_points.foreach_set('co', co)
                for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'
                fc.update()
    return a
def fix_signs(frames):
    for b in BONES:
        prev = None
        for P in frames:
            q, l = P[b]
            if prev is not None and q.dot(prev) < 0: q = -q; P[b] = (q, l)
            prev = q
    return frames
def contacts(ob, frames, hh):
    # feet: planted spans (height within 6 % of hips height of the clip minimum) and slide during planted spans
    pos = {f: [] for f in ('foot.l', 'foot.r')}
    for P in frames:
        apply(ob, P)
        for f in pos: pos[f].append(W(ob, f))
    res = {}
    for f, ps in pos.items():
        zs = [p.z for p in ps]; zmin = min(zs); thr = zmin + 0.06 * hh
        spans = []; cur = None; slide = 0.0
        for i, z in enumerate(zs):
            if z <= thr and cur is None: cur = i
            if z > thr and cur is not None: spans.append([cur + 1, i]); cur = None
        if cur is not None: spans.append([cur + 1, len(zs)])
        for s0, s1 in spans:
            xy = [Vector((p.x, p.y)) for p in ps[s0 - 1:s1]]
            slide = max(slide, max((v - xy[0]).length for v in xy))
        res[f] = {'planted': spans, 'maxSlideInPlantCm': round(slide * 100, 1), 'maxLiftCm': round((max(zs) - zmin) * 100, 1)}
    return res
def cam_setup(res=240):
    sc.render.engine = 'BLENDER_WORKBENCH'; sc.display.shading.light = 'STUDIO'; sc.display.shading.color_type = 'TEXTURE'
    sc.render.resolution_x = res; sc.render.resolution_y = res; sc.render.resolution_percentage = 100
    ims = sc.render.image_settings
    if hasattr(ims, 'media_type'): ims.media_type = 'IMAGE'
    ims.file_format = 'PNG'; ims.color_mode = 'RGB'
    cam = bpy.data.objects['ml_cam']; cam.data.lens = 50; sc.camera = cam; return cam
def show(rig):
    for r, tn in RIGS.items():
        o = bpy.data.objects[tn]
        for c in [o] + list(o.children): c.hide_render = (r != rig)
def tile(path='/tmp/an1/_t.png'):
    sc.render.filepath = path; bpy.ops.render.render(write_still=True)
    im = bpy.data.images.load(path, check_existing=False)
    a = np.array(im.pixels[:], dtype=np.float32).reshape(im.size[1], im.size[0], 4); bpy.data.images.remove(im); return a
def save_rows(rows, path):
    full = np.concatenate(rows[::-1], axis=0); H, Wd = full.shape[:2]
    img = bpy.data.images.new('s', Wd, H); img.pixels.foreach_set(full.ravel()); img.filepath_raw = path; img.file_format = 'PNG'; img.save(); bpy.data.images.remove(img)
PROPS = []
def clear_props():
    for o in PROPS: bpy.data.objects.remove(o)
    PROPS.clear()
def mat(name, rgb):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name); m.diffuse_color = (*rgb, 1); m.use_nodes = True
    m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (*rgb, 1); return m
def cube(dims, loc, rgb, rotz=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1); o = bpy.context.active_object; o.scale = dims; o.location = loc; o.rotation_euler = (0, 0, rotz)
    o.data.materials.append(mat('p_' + str(rgb), rgb)); PROPS.append(o); return o
def cyl(r, depth, loc, rot, rgb):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth); o = bpy.context.active_object; o.location = loc; o.rotation_euler = rot
    o.data.materials.append(mat('p_' + str(rgb), rgb)); PROPS.append(o); return o
def sheet(name, clips, prop_fn=None, nt=6, side=False, fixed=False):
    cam = cam_setup(240); rows = []
    for rig, tn in RIGS.items():
        ob = bpy.data.objects[tn]; show(rig); H = {'Rig_Medium': 1.9, 'Rig_Large': 3.9}[rig]
        frames = clips[rig]; n = len(frames); tiles = []
        for f in [round(i * (n - 1) / (nt - 1)) for i in range(nt)]:
            apply(ob, frames[f]); clear_props()
            if prop_fn: prop_fn(ob, rig, f + 1)
            if fixed:
                if f == 0: apply(ob, frames[0]); r0 = W(ob, 'hips'); apply(ob, frames[f])
                r = r0
            else: r = W(ob, 'hips')
            tgt = Vector((r.x, r.y, H * 0.5))
            off = Vector((H * 2.8, -H * 0.35, H * 0.3)) if side else Vector((H * 1.25, -H * 2.1, H * 0.35))
            cam.location = tgt + off; cam.rotation_euler = (tgt - cam.location).to_track_quat('-Z', 'Y').to_euler()
            tiles.append(tile())
        rows.append(np.concatenate(tiles, axis=1))
    clear_props(); save_rows(rows, f'/tmp/an1/out/sheets/{name}.png')
def export(ids):
    import os; os.makedirs('/tmp/an1/out/libs/Rig_Medium', exist_ok=True); os.makedirs('/tmp/an1/out/libs/Rig_Large', exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath='/tmp/an1/AN_PERF_01_authored.blend')
    for rig, tn in RIGS.items():
        bpy.ops.wm.open_mainfile(filepath='/tmp/an1/AN_PERF_01_authored.blend')
        for a in list(bpy.data.actions):
            if a.name.endswith('__' + rig + '__N'): a.name = a.name[:-len(rig) - 5]
            else: bpy.data.actions.remove(a)
        ob = bpy.data.objects[tn]; ob.name = rig; ob.animation_data_clear(); ob.animation_data_create()
        ob.rotation_mode = 'QUATERNION'; ob.rotation_quaternion = (1, 0, 0, 0); ob.location = {'Rig_Medium': (-2.7, -1.2, 0.0), 'Rig_Large': (0.0, 1.3, 0.0)}[rig]   # library object placement (root node parity)
        for o in bpy.data.objects: o.select_set(False)
        ob.select_set(True); bpy.context.view_layer.objects.active = ob
        bpy.ops.export_scene.gltf(filepath=f'/tmp/an1/out/libs/{rig}/KFB_Motion_perf_an01.glb', export_format='GLB', use_selection=True,
            export_animations=True, export_animation_mode='ACTIONS', export_yup=True, export_apply=False, export_skins=False,
            export_image_format='NONE', export_cameras=False, export_lights=False)
        print('EXPORTED', rig, sorted(a.name for a in bpy.data.actions), flush=True)

def hips_h(ob): return ob.data.bones['hips'].head_local.z if ob.data.bones['hips'].head_local.z > 0.05 else (ob.matrix_world @ ob.data.bones['hips'].head_local).z
def head_front(ob, rig):
    apply(ob, basis('kfb_action_boxing_a', rig, 1))
    dg = bpy.context.evaluated_depsgraph_get(); hd = bpy.data.objects[HEADMESH[rig]].evaluated_get(dg); hp = W(ob, 'hips')
    return max((hd.matrix_world @ v.co - hp).dot(FWD) for v in hd.data.vertices)
