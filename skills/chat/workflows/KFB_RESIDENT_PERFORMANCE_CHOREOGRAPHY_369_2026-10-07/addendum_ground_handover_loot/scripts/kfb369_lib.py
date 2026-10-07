# KFB #369 Resident Performance helper (Blender 5.2). Source-isolated: reads pinned repo copies under ../src only.
import bpy, os, json, math, mathutils

JOB = os.path.expanduser("~/Library/CloudStorage/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/RESIDENT_PERFORMANCE_369_2026-10-07")
SRC = os.path.join(JOB, "src")
MAIN8 = "34150cd1"
S6 = "media/3D_Assets/KayKit_Mystery_Series6/"

RESIDENTS = {
    # atlas residentId/actor -> (repo path @ main, rigFamily per cast.js)
    "farmer_b":   (S6 + "12 - June 2026 - Farmers/Farmer_B.glb", "Rig_Medium"),
    "farmer_a":   (S6 + "12 - June 2026 - Farmers/Farmer_A.glb", "Rig_Medium"),
    "lorekeeper": (S6 + "1 - July 2025 - Lorekeeper/Lorekeeper.glb", "Rig_Medium"),
    "gothgirl":   (S6 + "GothGirl/characters/GothGirl.glb", "Rig_Medium"),
    "orcbrute":   (S6 + "2 - August 2025 - Orc Brute/OrcBrute.glb", "Rig_Large"),
}
PROPS = {
    "pitchfork":  S6 + "12 - June 2026 - Farmers/gltf/pitchfork.gltf",
    "wheelbarrow": S6 + "12 - June 2026 - Farmers/gltf/wheelbarrow.gltf",
    "tome":       S6 + "1 - July 2025 - Lorekeeper/gltf/Lorekeeper_Tome.gltf",
    "staff":      S6 + "1 - July 2025 - Lorekeeper/gltf/Lorekeeper_Staff.gltf",
    "present":    S6 + "6 - December 2025 - Toy Soldier/gltf/Present_Base.gltf",
    "stool":      S6 + "GothGirl/assets/gltf/GothGirl_Stool.gltf",
    "micstand":   S6 + "GothGirl/assets/gltf/GothGirl_MicStand.gltf",
}
FLUFF_MERGE = os.path.join(SRC, "9124366b", "skills/chat/workflows/KFB_FLUFF_WORK_MOTION_PACK_01_2026-10-04/PART3_RETURN/kfb_fluff_merge_6to1_reference.glb")
CLAY_PRESENTS = os.path.join(SRC, "2a92f2bf", "skills/chat/workflows/KFB_EXCHANGE_REACTION_KIT_01_2026-10-05/PART2_RETURN/props/KFB_Gift_Presents_clay01.glb")


def src_path(repo_path, commit8=MAIN8):
    return os.path.join(SRC, commit8, repo_path)


def ensure_scene(name):
    sc = bpy.data.scenes.get(name) or bpy.data.scenes.new(name)
    return sc


def collection(scene, name):
    col = bpy.data.collections.get(name)
    if not col:
        col = bpy.data.collections.new(name)
        scene.collection.children.link(col)
    return col


def import_into(scene, colname, filepath):
    """Import a glTF into scene/collection; return list of new objects."""
    win = bpy.context.window
    prev = win.scene
    win.scene = scene
    col = collection(scene, colname)
    lc = bpy.context.view_layer.layer_collection.children.get(colname)
    if lc:
        bpy.context.view_layer.active_layer_collection = lc
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=filepath)
    new = [o for o in bpy.data.objects if o not in before]
    for o in new:
        for c in list(o.users_collection):
            c.objects.unlink(o)
        col.objects.link(o)
    win.scene = prev
    return new


def armature_of(objs):
    for o in objs:
        if o.type == 'ARMATURE':
            return o
    return None


def actions(prefix):
    return sorted(a.name for a in bpy.data.actions if a.name.startswith(prefix))


def set_action(arm, action_name):
    a = bpy.data.actions[action_name]
    if not arm.animation_data:
        arm.animation_data_create()
    ad = arm.animation_data
    ad.action = a
    try:
        if len(a.slots):
            ad.action_slot = a.slots[0]
    except Exception:
        pass
    return a


def bound_tracks(arm, action_name):
    """Count fcurve bone paths that resolve on this armature (binding proof)."""
    a = bpy.data.actions[action_name]
    paths = set()
    try:
        for layer in a.layers:
            for strip in layer.strips:
                for cb in strip.channelbags:
                    for fc in cb.fcurves:
                        paths.add(fc.data_path)
    except Exception:
        for fc in getattr(a, 'fcurves', []):
            paths.add(fc.data_path)
    bones = set()
    for p in paths:
        if p.startswith('pose.bones["'):
            bones.add(p.split('"')[1])
    names = set(b.name for b in arm.pose.bones)
    return len(bones & names), len(bones)


def wpos(arm, bone):
    return arm.matrix_world @ arm.pose.bones[bone].head


def wtail(arm, bone):
    return arm.matrix_world @ arm.pose.bones[bone].tail


def lowest_foot(arm):
    ys = []
    for b in arm.pose.bones:
        if 'foot' in b.name.lower() or 'toe' in b.name.lower():
            ys.append(wpos(arm, b.name).z)  # heads only: importer-guessed tails are not geometry
    return min(ys) if ys else None


def mesh_min_z(objs, depsgraph=None):
    dg = depsgraph or bpy.context.evaluated_depsgraph_get()
    mz = 1e9
    for o in objs:
        if o.type != 'MESH':
            continue
        oe = o.evaluated_get(dg)
        me = oe.to_mesh()
        mw = oe.matrix_world
        for v in me.vertices:
            z = (mw @ v.co).z
            if z < mz:
                mz = z
        oe.to_mesh_clear()
    return mz


# ---------------------------------------------------------------- analysis
from mathutils.bvhtree import BVHTree
import numpy as np


def act_by_short(rig, short):
    """rig 'M'/'L'; short like 'KK:Idle_A' or 'ML:kfb_gesture_pointing_a'."""
    kind, name = short.split(':', 1)
    for a in bpy.data.actions:
        p = a.name.split('|')
        if len(p) == 4 and p[0] == rig and p[1] == kind and p[3] == name:
            return a.name
    return None


def head_mesh(arm):
    for o in bpy.data.objects:
        if o.type == 'MESH' and o.parent == arm and o.name.split('.')[0].endswith('_Head'):
            return o
    return None


def body_meshes(arm):
    return [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == arm]


def _bvh(obj, dg):
    oe = obj.evaluated_get(dg)
    me = oe.to_mesh()
    mw = oe.matrix_world
    verts = [mw @ v.co for v in me.vertices]
    polys = [tuple(p.vertices) for p in me.polygons]
    oe.to_mesh_clear()
    return BVHTree.FromPolygons(verts, polys)


def inside(bvh, p, maxd=10.0):
    hit = bvh.find_nearest(p, maxd)
    if hit[0] is None:
        return False, None
    loc, nor, idx, d = hit
    return (p - loc).dot(nor) < 0, d


def local_rot_signature(arm):
    return {b.name: b.matrix_basis.to_quaternion().copy() for b in arm.pose.bones}


def analyze(scene, arm, action_name, step=2, hand_probe=True):
    a = set_action(arm, action_name)
    f0, f1 = int(a.frame_range[0]), int(a.frame_range[1])
    scene.frame_set(f0)
    ref = local_rot_signature(arm)
    root0 = (arm.matrix_world @ arm.pose.bones['hips'].head).copy()
    hm = head_mesh(arm)
    foot_min = 1e9
    peak_f, peak_v = f0, -1
    max_trav = 0.0
    hand_in_head = 0
    hand_head_min = 1e9
    frames = list(range(f0, f1 + 1, step)) or [f0]
    if frames[-1] != f1:
        frames.append(f1)
    for f in frames:
        scene.frame_set(f)
        dg = bpy.context.evaluated_depsgraph_get()
        lf = lowest_foot(arm)
        if lf is not None:
            foot_min = min(foot_min, lf)
        tz = min(wpos(arm, 'toes.l').z, wpos(arm, 'toes.r').z)
        toe_min = tz if f == frames[0] else min(toe_min, tz)
        sig = local_rot_signature(arm)
        v = 0.0
        for k, q in sig.items():
            if k in ('root',):
                continue
            v += q.rotation_difference(ref[k]).angle
        if v > peak_v:
            peak_v, peak_f = v, f
        hp = arm.matrix_world @ arm.pose.bones['hips'].head
        tr = math.hypot(hp.x - root0.x, hp.y - root0.y)
        max_trav = max(max_trav, tr)
        if hand_probe and hm is not None:
            bvh = _bvh(hm, dg)
            for side in ('l', 'r'):
                p = arm.matrix_world @ arm.pose.bones['handslot.' + side].head  # palm point
                ins, d = inside(bvh, p)
                if ins:
                    hand_in_head += 1
                if d is not None:
                    hand_head_min = min(hand_head_min, d)
    return {
        'action': action_name, 'frames': [f0, f1], 'peakFrame': peak_f,
        'peakPoseDeltaDeg': round(math.degrees(peak_v), 1),
        'footMinZ': round(foot_min, 3), 'toeHeadMinZ': round(toe_min, 3), 'hipsTravelMaxM': round(max_trav, 3),
        'handInsideHeadSamples': hand_in_head,
        'handHeadMinDistM': round(hand_head_min, 3) if hand_head_min < 1e8 else None,
    }


# ---------------------------------------------------------------- render
def setup_eevee(scene, res=320):
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x = res
    scene.render.resolution_y = res
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = False
    scene.render.image_settings.file_format = 'PNG'
    try:
        scene.eevee.taa_render_samples = 16
    except Exception:
        pass
    if scene.world is None:
        scene.world = bpy.data.worlds.new('369_world')
    w = scene.world
    w.use_nodes = True
    bg = w.node_tree.nodes.get('Background')
    if bg:
        bg.inputs[0].default_value = (0.78, 0.76, 0.72, 1)
        bg.inputs[1].default_value = 0.35
    sun = bpy.data.objects.get('369_SUN')
    if sun is None:
        ld = bpy.data.lights.new('369_SUN', 'SUN')
        ld.energy = 3.0
        sun = bpy.data.objects.new('369_SUN', ld)
        sun.rotation_euler = (math.radians(50), 0, math.radians(-35))
    if sun.name not in scene.collection.objects:
        scene.collection.objects.link(sun)


def setup_render(scene, res=320):
    scene.render.engine = 'BLENDER_WORKBENCH'
    sh = scene.display.shading
    sh.light = 'STUDIO'
    sh.color_type = 'TEXTURE'
    sh.show_shadows = True
    sh.show_cavity = True
    scene.render.resolution_x = res
    scene.render.resolution_y = res
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = False
    scene.render.image_settings.file_format = 'PNG'
    if scene.world is None:
        scene.world = bpy.data.worlds.new('369_world')
    scene.world.color = (0.82, 0.80, 0.76)


def cam_for(scene, height, target_xy=(0, 0), yaw_deg=30, dist_k=2.0, elev=0.25, name='369_CAM', lens=50):
    cam = bpy.data.objects.get(name)
    if cam is None:
        cd = bpy.data.cameras.new(name)
        cam = bpy.data.objects.new(name, cd)
    if cam.name not in scene.collection.objects:
        scene.collection.objects.link(cam)
    cam.data.lens = lens
    d = height * dist_k
    y = math.radians(yaw_deg)
    tx, ty = target_xy
    cz = height * 0.5
    cam.location = (tx + d * math.sin(y), ty - d * math.cos(y), cz + height * elev)
    direction = mathutils.Vector((tx, ty, cz)) - cam.location
    cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
    scene.camera = cam
    return cam


def render_np(scene, path):
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True, scene=scene.name)
    img = bpy.data.images.load(path, check_existing=False)
    w, h = img.size
    arr = np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4)
    bpy.data.images.remove(img)
    return arr


def save_np(arr, path):
    h, w, _ = arr.shape
    img = bpy.data.images.new('369_sheet_tmp', w, h, alpha=True)
    img.pixels.foreach_set(arr.ravel())
    img.filepath_raw = path
    img.file_format = 'PNG'
    img.save()
    bpy.data.images.remove(img)


def grid(tiles, cols, pad=4, bg=(1, 1, 1, 1)):
    th, tw, _ = tiles[0].shape
    rows = (len(tiles) + cols - 1) // cols
    H = rows * th + (rows + 1) * pad
    W = cols * tw + (cols + 1) * pad
    out = np.ones((H, W, 4), dtype=np.float32)
    out[:] = bg
    for i, t in enumerate(tiles):
        r, c = divmod(i, cols)
        r = rows - 1 - r  # Blender images are bottom-up
        y = pad + r * (th + pad)
        x = pad + c * (tw + pad)
        out[y:y + th, x:x + tw] = t
    return out


def label_obj(scene, text, loc, size, name='369_LABEL'):
    ob = bpy.data.objects.get(name)
    if ob is None:
        cu = bpy.data.curves.new(name, 'FONT')
        ob = bpy.data.objects.new(name, cu)
        scene.collection.objects.link(ob)
        mat = bpy.data.materials.new(name + '_mat')
        mat.diffuse_color = (0.05, 0.05, 0.05, 1)
        ob.data.materials.append(mat)
    ob.data.body = text
    ob.data.size = size
    ob.data.align_x = 'CENTER'
    ob.location = loc
    return ob


def solo(scene, keep_cols):
    for lc in bpy.context.view_layer.layer_collection.children:
        pass
    vl = scene.view_layers[0]
    for lc in vl.layer_collection.children:
        lc.exclude = lc.name not in keep_cols


# ---------------------------------------------------------------- ML node-clip -> bone action bake
# The KFB Motion Library GLBs carry node (joint) animation without a skin. Blender imports them as
# an empty hierarchy, one action slot per joint. Runtime (three.js) writes those node TRS straight
# onto the KayKit bones of the same name. We reproduce that: evaluate the node chain from the fcurves,
# then express it on the resident's armature with a constant per-bone rest correction.
from mathutils import Matrix, Quaternion, Vector


def _slot_objects(action):
    m = {}
    for s in action.slots:
        on = s.identifier[2:]
        o = bpy.data.objects.get(on)
        if o is not None:
            m[s.identifier] = o
    return m


def _bone_name(objname):
    b = objname
    if '.' in b and b.rsplit('.', 1)[1].isdigit():
        b = b.rsplit('.', 1)[0]
    return b


def _channel_values(action):
    """slot identifier -> {data_path: [fcurves by index]}"""
    out = {}
    for layer in action.layers:
        for strip in layer.strips:
            for cb in strip.channelbags:
                d = out.setdefault(cb.slot.identifier, {})
                for fc in cb.fcurves:
                    d.setdefault(fc.data_path, {})[fc.array_index] = fc
    return out


def _local(obj, chans, f):
    loc = Vector(obj.location)
    rq = obj.rotation_quaternion.copy() if obj.rotation_mode == 'QUATERNION' else obj.rotation_euler.to_quaternion()
    sc = Vector(obj.scale)
    if chans:
        if 'location' in chans:
            for i, fc in chans['location'].items():
                loc[i] = fc.evaluate(f)
        if 'rotation_quaternion' in chans:
            q = [rq.w, rq.x, rq.y, rq.z]
            for i, fc in chans['rotation_quaternion'].items():
                q[i] = fc.evaluate(f)
            rq = Quaternion(q).normalized()
        if 'scale' in chans:
            for i, fc in chans['scale'].items():
                sc[i] = fc.evaluate(f)
    return Matrix.LocRotScale(loc, rq, sc)


def glb_json(path):
    import struct
    with open(path, 'rb') as f:
        data = f.read()
    ln = struct.unpack_from('<I', data, 12)[0]
    return json.loads(data[20:20 + ln].decode('utf-8'))


def _conv_local(node):
    t = node.get('translation', [0, 0, 0])
    r = node.get('rotation', [0, 0, 0, 1])
    s = node.get('scale', [1, 1, 1])
    loc = Vector((t[0], -t[2], t[1]))
    q = Quaternion((r[3], r[0], -r[2], r[1]))
    sc = Vector((s[0], s[2], s[1]))
    return Matrix.LocRotScale(loc, q, sc)


def resident_rest_locals(glb_path):
    """bone name -> (local rest Matrix in Blender axes, parent bone name or None) from the skin joints."""
    js = glb_json(glb_path)
    nodes = js['nodes']
    joints = set(js['skins'][0]['joints'])
    parent = {}
    for i, n in enumerate(nodes):
        for c in n.get('children', []):
            parent[c] = i
    out = {}
    for j in joints:
        n = nodes[j]
        p = parent.get(j)
        out[n['name']] = (_conv_local(n), nodes[p]['name'] if (p is not None and p in joints) else None)
    return out


def _chain(locals_by_bone, parents):
    cache = {}
    def w(bn):
        if bn in cache:
            return cache[bn]
        p = parents.get(bn)
        M = (w(p) @ locals_by_bone[bn]) if p else locals_by_bone[bn]
        cache[bn] = M
        return M
    for bn in locals_by_bone:
        w(bn)
    return cache


_REST_CACHE = {}


def rest_info(template_arm, glb_path):
    key = template_arm.name
    if key in _REST_CACHE:
        return _REST_CACHE[key]
    rl = resident_rest_locals(glb_path)
    parents = {k: v[1] for k, v in rl.items()}
    R = {k: v[0] for k, v in rl.items()}
    Rw = _chain(R, parents)
    C = {}
    for b in template_arm.data.bones:
        if b.name in Rw:
            C[b.name] = Rw[b.name].inverted() @ b.matrix_local
    _REST_CACHE[key] = (R, parents, C)
    return _REST_CACHE[key]


def _clip_local(chans, f, default):
    if not chans:
        return default
    loc, rq, sc = default.decompose()
    loc = Vector(loc); sc = Vector(sc)
    if 'location' in chans:
        for i, fc in chans['location'].items():
            loc[i] = fc.evaluate(f)
    if 'rotation_quaternion' in chans:
        q = [rq.w, rq.x, rq.y, rq.z]
        for i, fc in chans['rotation_quaternion'].items():
            q[i] = fc.evaluate(f)
        rq = Quaternion(q).normalized()
    if 'scale' in chans:
        for i, fc in chans['scale'].items():
            sc[i] = fc.evaluate(f)
    return Matrix.LocRotScale(loc, rq, sc)


def bake_ml_to_rig(ml_action_name, template_arm, glb_path, out_name=None, step=1):
    """Bake an ML node-clip into a bone action, reproducing three.js semantics (clip TRS replaces bone local TRS)."""
    a = bpy.data.actions[ml_action_name]
    out_name = out_name or ml_action_name.replace('|ML|', '|MLB|')
    if out_name in bpy.data.actions:
        return out_name
    R, parents, C = rest_info(template_arm, glb_path)
    chans = _channel_values(a)
    chans_by_bone = {}
    for s in a.slots:
        bn = _bone_name(s.identifier[2:])
        chans_by_bone[bn] = chans.get(s.identifier)
    f0, f1 = int(a.frame_range[0]), int(a.frame_range[1])
    frames = list(range(f0, f1 + 1, step))
    if frames[-1] != f1:
        frames.append(f1)
    bones = [b for b in template_arm.data.bones if b.name in C]
    newa = bpy.data.actions.new(out_name)
    newa.use_fake_user = True
    slot = newa.slots.new('OBJECT', template_arm.name)
    layer = newa.layers.new('Layer')
    strip = layer.strips.new(type='KEYFRAME')
    cb = strip.channelbag(slot, ensure=True)
    keys = {b.name: {'loc': [], 'rot': [], 'scl': []} for b in bones}
    prev_q = {}
    for f in frames:
        L = {bn: _clip_local(chans_by_bone.get(bn), f, R[bn]) for bn in R}
        W = _chain(L, parents)
        P = {bn: W[bn] @ C[bn] for bn in C}
        for b in bones:
            if b.parent and b.parent.name in P:
                rel = b.parent.matrix_local.inverted() @ b.matrix_local
                basis = rel.inverted() @ P[b.parent.name].inverted() @ P[b.name]
            else:
                basis = b.matrix_local.inverted() @ P[b.name]
            l, q, s = basis.decompose()
            if b.name in prev_q and prev_q[b.name].dot(q) < 0:
                q.negate()
            prev_q[b.name] = q
            keys[b.name]['loc'].append((f, l))
            keys[b.name]['rot'].append((f, q))
            keys[b.name]['scl'].append((f, s))
    for bn, kk in keys.items():
        for path, n, comp in (('location', 3, 'loc'), ('rotation_quaternion', 4, 'rot'), ('scale', 3, 'scl')):
            for i in range(n):
                fc = cb.fcurves.new('pose.bones["%s"].%s' % (bn, path), index=i)
                vals = kk[comp]
                fc.keyframe_points.add(len(vals))
                co = []
                for (f, v) in vals:
                    vv = (v.w, v.x, v.y, v.z)[i] if comp == 'rot' else v[i]
                    co += [f, vv]
                fc.keyframe_points.foreach_set('co', co)
                for kp in fc.keyframe_points:
                    kp.interpolation = 'LINEAR'
                fc.update()
    return out_name


TEMPLATE_GLB = {'M': 'farmer_b', 'L': 'orcbrute'}


def ensure_action(rig, short, template_arm=None):
    """Return a bone action usable on rig's armatures for 'KK:..' or 'ML:..'."""
    an = act_by_short(rig, short)
    if an is None:
        return None
    if '|ML|' in an:
        rid = TEMPLATE_GLB[rig]
        arm = template_arm or bpy.data.objects['ARM_' + rid]
        return bake_ml_to_rig(an, arm, src_path(RESIDENTS[rid][0]))
    return an


# ---------------------------------------------------------------- sheets
def unsolo(scene):
    for lc in scene.view_layers[0].layer_collection.children:
        lc.exclude = False


def clip_sheet(scene, rid, rig, shorts, outpng, yaw=-28, res=256, cols=9, analysis=None):
    arm = bpy.data.objects['ARM_' + rid]
    loc0 = arm.location.copy()
    arm.location = (0, 0, 0)
    for o in bpy.data.objects:
        if o.name.startswith('Icosphere'):
            o.hide_render = True
    setup_render(scene, res)
    solo(scene, ['ISO_' + rid, 'ISO_ground', 'ISO_label'])
    h = 2.4 if rig == 'M' else 4.4
    cam_for(scene, h, yaw_deg=yaw, dist_k=1.95, elev=0.12)
    lcol = collection(scene, 'ISO_label')
    lab = label_obj(scene, '', (0, 0, h * 1.02), h * 0.075)
    for c in list(lab.users_collection):
        c.objects.unlink(lab)
    lcol.objects.link(lab)
    cam = scene.camera
    lab.rotation_euler = cam.rotation_euler
    tiles = []
    idx = []
    for s in shorts:
        an = ensure_action(rig, s)
        if not an:
            idx.append({'clip': s, 'missing': True})
            continue
        r = analyze(scene, arm, an, step=3, hand_probe=False)
        f0, f1 = r['frames']
        pk = r['peakFrame']
        nm = s.split(':', 1)[1].replace('kfb_', '')
        for i, f in enumerate((f0, pk, f1)):
            lab.data.body = (nm if i == 1 else ('start' if i == 0 else 'end')) + '  f%d' % f
            set_action(arm, an)
            scene.frame_set(f)
            tiles.append(render_np(scene, os.path.join(JOB, 'previews/_tile.png')))
        idx.append({'clip': s, 'action': an, 'frames': [f0, pk, f1]})
    arr = grid(tiles, cols)
    save_np(arr, outpng)
    arm.location = loc0
    lab.data.body = ''
    unsolo(scene)
    return idx


# ---------------------------------------------------------------- additive performance layers
# Bone-local axes, verified identical on Rig_Medium and Rig_Large (probe 15 deg, see data/axis_probe):
#   spine/chest/head: +X pitch forward (nod down / lean in), +Z lean to the character's right, +Y twist.
from mathutils import Euler


def delta_quat(xyz_deg):
    x, y, z = xyz_deg
    return Euler((math.radians(x), math.radians(y), math.radians(z)), 'XYZ').to_quaternion()


def make_layer_action(name, template_arm, keys):
    """keys: list of (frame, {bone: (x,y,z deg)}) -> additive (delta) action, identity elsewhere."""
    if name in bpy.data.actions:
        bpy.data.actions.remove(bpy.data.actions[name])
    a = bpy.data.actions.new(name)
    a.use_fake_user = True
    slot = a.slots.new('OBJECT', template_arm.name)
    layer = a.layers.new('Layer')
    strip = layer.strips.new(type='KEYFRAME')
    cb = strip.channelbag(slot, ensure=True)
    bones = sorted({b for _, d in keys for b in d})
    for bn in bones:
        fcs = [cb.fcurves.new('pose.bones["%s"].rotation_quaternion' % bn, index=i) for i in range(4)]
        for f, d in keys:
            q = delta_quat(d.get(bn, (0, 0, 0)))
            for i, fc in enumerate(fcs):
                kp = fc.keyframe_points.insert(f, (q.w, q.x, q.y, q.z)[i])
                kp.interpolation = 'BEZIER'
        for fc in fcs:
            fc.update()
    return a.name


def stack(arm, base_action, layer_actions, weights=None):
    """NLA: base strip (REPLACE) + layer strips (COMBINE, held)."""
    ad = arm.animation_data or arm.animation_data_create()
    ad.action = None
    for t in list(ad.nla_tracks):
        ad.nla_tracks.remove(t)
    def add(an, blend, w=1.0):
        a = bpy.data.actions[an]
        t = ad.nla_tracks.new()
        s = t.strips.new(an, int(a.frame_range[0]), a)
        try:
            if len(a.slots):
                s.action_slot = a.slots[0]
        except Exception:
            pass
        s.blend_type = blend
        s.extrapolation = 'HOLD'
        s.influence = w
        s.use_animated_influence = False
        return s
    add(base_action, 'REPLACE')
    for i, la in enumerate(layer_actions or []):
        add(la, 'COMBINE', (weights or [1.0] * len(layer_actions))[i])


def unstack(arm):
    ad = arm.animation_data
    if ad:
        for t in list(ad.nla_tracks):
            ad.nla_tracks.remove(t)


# ---------------------------------------------------------------- authored clip: shrug (only proven gap)
SHRUG_PEAK = {"upperarm.l": (15, 0, -10), "upperarm.r": (15, 0, 10),
              "lowerarm.l": (70, 0, -25), "lowerarm.r": (70, 0, 25),
              "wrist.l": (0, -60, 0), "wrist.r": (0, 60, 0),
              "chest": (-4, 0, 0), "head": (-3, 0, 12)}
# envelope: (frame, weight) -- anticipation dip, quick rise with overshoot, hold with settle, ease out
SHRUG_ENV = [(0, 0.0), (3, -0.06), (8, 1.08), (11, 1.0), (24, 0.94), (34, 0.0)]


def _env(f, env):
    for (fa, wa), (fb, wb) in zip(env, env[1:]):
        if fa <= f <= fb:
            t = (f - fa) / float(fb - fa)
            t = t * t * (3 - 2 * t)
            return wa + (wb - wa) * t
    return env[-1][1]


def bake_pose_clip(name, template_arm, base_action, base_frame, peak, env, nframes):
    """Clip = base pose (base_action @ base_frame) composed with delta(peak * env(f)). Starts/ends on base pose."""
    sc = bpy.context.scene
    unstack(template_arm)
    set_action(template_arm, base_action)
    sc.frame_set(base_frame)
    base = {pb.name: (pb.location.copy(), pb.rotation_quaternion.copy(), pb.scale.copy()) for pb in template_arm.pose.bones}
    if name in bpy.data.actions:
        bpy.data.actions.remove(bpy.data.actions[name])
    a = bpy.data.actions.new(name)
    a.use_fake_user = True
    slot = a.slots.new('OBJECT', template_arm.name)
    layer = a.layers.new('Layer')
    strip = layer.strips.new(type='KEYFRAME')
    cb = strip.channelbag(slot, ensure=True)
    for pb in template_arm.pose.bones:
        l0, q0, s0 = base[pb.name]
        rows = []
        prevq = None
        for f in range(0, nframes + 1):
            w = _env(f, env)
            d = peak.get(pb.name)
            q = q0 @ delta_quat(tuple(c * w for c in d)) if d else q0.copy()
            if prevq is not None and prevq.dot(q) < 0:
                q.negate()
            prevq = q
            rows.append((f, l0, q, s0))
        for path, n, comp in (('location', 3, 1), ('rotation_quaternion', 4, 2), ('scale', 3, 3)):
            for i in range(n):
                fc = cb.fcurves.new('pose.bones["%s"].%s' % (pb.name, path), index=i)
                fc.keyframe_points.add(len(rows))
                co = []
                for r in rows:
                    v = r[comp]
                    vv = (v.w, v.x, v.y, v.z)[i] if comp == 2 else v[i]
                    co += [r[0], vv]
                fc.keyframe_points.foreach_set('co', co)
                for kp in fc.keyframe_points:
                    kp.interpolation = 'LINEAR'
                fc.update()
    return a.name


def _to_gltf_trs(M):
    l, q, sc = M.decompose()
    return [l.x, l.z, -l.y], [q.x, q.z, -q.y, q.w], [sc.x, sc.z, sc.y]


def sample_clip_gltf(template_arm, glb_path, action_name, frames):
    """Evaluate a bone action on the template armature -> per-joint glTF-space local TRS per frame."""
    R, parents, C = rest_info(template_arm, glb_path)
    Cinv = {k: v.inverted() for k, v in C.items()}
    sc = bpy.context.scene
    unstack(template_arm)
    set_action(template_arm, action_name)
    out = {bn: {'t': [], 'r': [], 's': []} for bn in R}
    prevq = {}
    for f in frames:
        sc.frame_set(f)
        W = {pb.name: pb.matrix @ Cinv[pb.name] for pb in template_arm.pose.bones if pb.name in Cinv}
        for bn in R:
            p = parents.get(bn)
            L = (W[p].inverted() @ W[bn]) if p else W[bn]
            t, r, s_ = _to_gltf_trs(L)
            if bn in prevq and sum(a * b for a, b in zip(prevq[bn], r)) < 0:
                r = [-c for c in r]
            prevq[bn] = r
            out[bn]['t'].append(t); out[bn]['r'].append(r); out[bn]['s'].append(s_)
    return out


def write_motion_glb(out_path, rig_root_name, template_glb, clips, fps=30.0):
    """clips: list of (name, frames, sampled) -> joints-only node-animation GLB (KFB Motion Library layout)."""
    import struct
    js_src = glb_json(template_glb)
    nodes_src = js_src['nodes']
    joints = js_src['skins'][0]['joints']
    jset = set(joints)
    idx = {}
    nodes = []
    for j in joints:
        idx[j] = len(nodes)
        n = nodes_src[j]
        nn = {'name': n['name']}
        for k in ('translation', 'rotation', 'scale'):
            if k in n:
                nn[k] = n[k]
        nodes.append(nn)
    for j in joints:
        ch = [idx[c] for c in nodes_src[j].get('children', []) if c in jset]
        if ch:
            nodes[idx[j]]['children'] = ch
    child_set = {c for n in nodes for c in n.get('children', [])}
    top = [i for i in range(len(nodes)) if i not in child_set]
    nodes.append({'name': rig_root_name, 'children': top})
    root_i = len(nodes) - 1
    name2i = {n['name']: i for i, n in enumerate(nodes)}
    bin_ = bytearray()
    bufviews, accessors, anims = [], [], []
    def add_acc(vals, typ, ncomp, minmax=False):
        off = len(bin_)
        flat = [float(x) for v in vals for x in (v if isinstance(v, (list, tuple)) else [v])]
        bin_.extend(struct.pack('<%df' % len(flat), *flat))
        while len(bin_) % 4:
            bin_.append(0)
        bufviews.append({'buffer': 0, 'byteOffset': off, 'byteLength': len(flat) * 4})
        acc = {'bufferView': len(bufviews) - 1, 'componentType': 5126, 'count': len(vals), 'type': typ}
        if minmax:
            acc['min'] = [min(flat)]; acc['max'] = [max(flat)]
        accessors.append(acc)
        return len(accessors) - 1
    for name, frames, sampled in clips:
        t0 = frames[0]
        tin = add_acc([(f - t0) / fps for f in frames], 'SCALAR', 1, minmax=True)
        samplers, channels = [], []
        for bn, d in sampled.items():
            for path, key, typ in (('translation', 't', 'VEC3'), ('rotation', 'r', 'VEC4'), ('scale', 's', 'VEC3')):
                o = add_acc(d[key], typ, 3 if typ == 'VEC3' else 4)
                samplers.append({'input': tin, 'output': o, 'interpolation': 'LINEAR'})
                channels.append({'sampler': len(samplers) - 1, 'target': {'node': name2i[bn], 'path': path}})
        anims.append({'name': name, 'samplers': samplers, 'channels': channels})
    js = {'asset': {'version': '2.0', 'generator': 'KFB #369 Blender MCP writer (Blender 5.2 pose eval)'},
          'scene': 0, 'scenes': [{'name': 'MOTIONLIB', 'nodes': [root_i]}], 'nodes': nodes,
          'animations': anims, 'accessors': accessors, 'bufferViews': bufviews,
          'buffers': [{'byteLength': len(bin_)}]}
    jb = json.dumps(js, separators=(',', ':')).encode('utf-8')
    while len(jb) % 4:
        jb += b' '
    total = 12 + 8 + len(jb) + 8 + len(bin_)
    with open(out_path, 'wb') as f:
        f.write(struct.pack('<III', 0x46546C67, 2, total))
        f.write(struct.pack('<II', len(jb), 0x4E4F534A)); f.write(jb)
        f.write(struct.pack('<II', len(bin_), 0x004E4942)); f.write(bytes(bin_))
    return out_path


# ---------------------------------------------------------------- encounter storyboards
LAYERS = None


def layers_json():
    global LAYERS
    LAYERS = json.load(open(os.path.join(JOB, 'data/kfb_perf_layers.json')))
    return LAYERS


def layer_action_for(arm, key):
    """key 'basePose:curious' | 'relational:lean_toward' | 'micro:nod@6' (envelope frame)"""
    L = LAYERS or layers_json()
    grp, name = key.split(':', 1)
    if grp == 'micro':
        name, fr = name.split('@')
        fr = float(fr)
        env = L['microEnvelopes'][name]['keys']
        bones = sorted({b for k in env for b in k[1]})
        d = {}
        for b in bones:
            pts = [(k[0], k[1].get(b, [0, 0, 0])) for k in env]
            v = pts[-1][1]
            for (fa, va), (fb, vb) in zip(pts, pts[1:]):
                if fa <= fr <= fb:
                    t = (fr - fa) / float(fb - fa)
                    v = [a + (c - a) * t for a, c in zip(va, vb)]
                    break
            d[b] = tuple(v)
        return make_layer_action('369_L_%s_%s_%g' % (arm.name, name, fr), arm, [(0, d)]), None
    d = L['basePose' if grp == 'basePose' else 'relational'][name]
    d = {b: tuple(v) for b, v in d.items() if isinstance(v, list)}
    return make_layer_action('369_L_%s_%s' % (arm.name, name), arm, [(0, d)]), None


def pose_actor(arm, rig, base_short, frame, layer_keys=(), loc=(0, 0, 0), yaw_deg=0.0):
    """Pose one actor at one frame: base clip + held layers. Returns scene frame used."""
    an = ensure_action(rig, base_short) if ':' in base_short and not base_short.startswith('NEW:') else base_short
    if base_short.startswith('NEW:'):
        an = '%s|NEW|perf|%s' % (rig, base_short[4:])
    las = []
    for k in layer_keys:
        la, _ = layer_action_for(arm, k)
        las.append(la)
    stack(arm, an, las)
    arm.location = loc
    arm.rotation_mode = 'QUATERNION'
    arm.rotation_quaternion = mathutils.Euler((0, 0, math.radians(yaw_deg))).to_quaternion()
    return an


def hands_mid(arm):
    return (wpos(arm, 'handslot.l') + wpos(arm, 'handslot.r')) / 2


def eval_at(scene, arms_frames):
    """Different actors need different action frames in the same picture: offset each NLA base strip."""
    # we shift each actor's NLA strips so that the shared scene frame F shows each actor's own frame
    F = 1000
    for arm, fr in arms_frames:
        ad = arm.animation_data
        for t in ad.nla_tracks:
            for s in t.strips:
                s.frame_start_ui = F - fr
    scene.frame_set(F)
    bpy.context.view_layer.update()
    return F


def head_overlap(a, b):
    dg = bpy.context.evaluated_depsgraph_get()
    hp = lambda arm: [o for o in body_meshes(arm) if any(k in o.name for k in ('Head', 'Hat', 'Glasses'))]
    A = [_bvh(o, dg) for o in hp(a)]
    B = [_bvh(o, dg) for o in hp(b)]
    return sum(len(x.overlap(y)) for x in A for y in B)


def storyboard(scene, title, actors, beats, outpng, cam=(0, 0, 2.4, -22, 2.9, 0.22), res=300, cols=None, eevee=True):
    """actors: {key: (rid, rig)}; beats: list of dict(label, A:{key:(base, frame, layers, loc, yaw)}, props:{objname: rule})
    rule: ('hands', key) | ('mid', keyA, keyB) | ('at', (x,y,z)) | ('hide',)"""
    if eevee:
        setup_eevee(scene, res)
    else:
        setup_render(scene, res)
    cols_keep = ['ISO_' + v[0] for v in actors.values()] + ['ISO_ground', 'ISO_label', 'ISO_props']
    solo(scene, cols_keep)
    cx, cy, h, yaw, dk, el = cam
    camo = cam_for(scene, h, target_xy=(cx, cy), yaw_deg=yaw, dist_k=dk, elev=el)
    lcol = collection(scene, 'ISO_label')
    lab = label_obj(scene, '', (cx, cy, h * 1.15), h * 0.07)
    if lab.name not in lcol.objects:
        for c in list(lab.users_collection):
            c.objects.unlink(lab)
        lcol.objects.link(lab)
    lab.rotation_euler = camo.rotation_euler
    lab.hide_render = False
    saved = {k: (bpy.data.objects['ARM_' + v[0]].location.copy(), bpy.data.objects['ARM_' + v[0]].rotation_quaternion.copy()) for k, v in actors.items()}
    tiles, log = [], []
    for b in beats:
        arms_frames = []
        for k, (base, fr, lays, loc, yw) in b['A'].items():
            rid, rig = actors[k]
            arm = bpy.data.objects['ARM_' + rid]
            pose_actor(arm, rig, base, fr, lays, loc, yw)
            arms_frames.append((arm, fr))
        eval_at(scene, arms_frames)
        for on, rule in (b.get('props') or {}).items():
            o = bpy.data.objects[on]
            if rule[0] == 'hands':
                a_ = bpy.data.objects['ARM_' + actors[rule[1]][0]]
                fwd = a_.matrix_world.to_3x3() @ mathutils.Vector((0, -1, 0))
                o.location = hands_mid(a_) + fwd * (rule[2] if len(rule) > 2 else 0.0) + mathutils.Vector((0, 0, rule[3] if len(rule) > 3 else 0.0))
            elif rule[0] == 'mid':
                o.location = (hands_mid(bpy.data.objects['ARM_' + actors[rule[1]][0]]) + hands_mid(bpy.data.objects['ARM_' + actors[rule[2]][0]])) / 2 + mathutils.Vector((0, 0, rule[3] if len(rule) > 3 else 0.0))
            elif rule[0] == 'local':
                o.location = rule[1]
            elif rule[0] == 'rot':
                o.location = rule[1]
                o.rotation_mode = 'XYZ'
                o.rotation_euler = tuple(math.radians(v) for v in rule[2])
            elif rule[0] == 'at':
                o.location = rule[1]
            elif rule[0] == 'hide':
                o.location = (0, 0, -50)
            if len(rule) > 2 and rule[0] == 'hands':
                pass
        bpy.context.view_layer.update()
        rec = {'beat': b['label']}
        for k, (rid, rig) in actors.items():
            arm = bpy.data.objects['ARM_' + rid]
            rec[k] = {'toeMinZ': round(min(wpos(arm, 'toes.l').z, wpos(arm, 'toes.r').z), 3),
                      'handGap': round((wpos(arm, 'handslot.l') - wpos(arm, 'handslot.r')).length, 3)}
        if len(actors) == 2:
            ks = list(actors.keys())
            a0 = bpy.data.objects['ARM_' + actors[ks[0]][0]]
            a1 = bpy.data.objects['ARM_' + actors[ks[1]][0]]
            rec['headGap'] = round((wpos(a0, 'head') - wpos(a1, 'head')).length, 3)
            rec['headMeshOverlapTris'] = head_overlap(a0, a1)
        for on, rule in (b.get('props') or {}).items():
            if rule[0] in ('hands', 'mid'):
                o = bpy.data.objects[on]
                k = rule[1] if rule[0] == 'hands' else rule[2]
                arm = bpy.data.objects['ARM_' + actors[k][0]]
                rec['prop_%s_palmDist' % on] = round(min((wpos(arm, 'handslot.l') - o.location).length, (wpos(arm, 'handslot.r') - o.location).length), 3)
        log.append(rec)
        lab.data.body = b['label']
        tiles.append(render_np(scene, os.path.join(JOB, 'previews/_tile.png')))
    for k, v in actors.items():
        arm = bpy.data.objects['ARM_' + v[0]]
        unstack(arm)
        set_action(arm, '%s|KK|General|Idle_A' % v[1])
        arm.location, arm.rotation_quaternion = saved[k]
    for b in beats:
        for on, rule in (b.get('props') or {}).items():
            if rule[0] != 'local':
                bpy.data.objects[on].location = (0, 0, -50)
    lab.data.body = ''
    unsolo(scene)
    save_np(grid(tiles, cols or len(tiles)), outpng)
    return log
