# KFB choreography player v0 (Blender, headless). Reads kfb.choreo.v0 JSON, resolves auto values and sync,
# poses two actors per shot from the Rig_Medium clips in CHOREO_LAB_01.blend and renders a storyboard strip.
import bpy, sys, json, math, colorsys
import numpy as np
from mathutils import Vector, Matrix, Quaternion
sys.path.insert(0, '/tmp/ch1')
bpy.ops.wm.open_mainfile(filepath='/tmp/ch1/CHOREO_LAB_01.blend')
from common import setup, render_tile, save
sc = bpy.context.scene
CAT = {c['id']: c for c in json.load(open('/tmp/ml4/out/KFB_Motion_Library.catalog.json'))['clips']}
A0 = bpy.data.objects['Rig_Raider']
ARMS = ['upperarm.l', 'lowerarm.l', 'wrist.l', 'hand.l', 'handslot.l', 'upperarm.r', 'lowerarm.r', 'wrist.r', 'hand.r', 'handslot.r']
TORSO = ['spine', 'chest', 'head']
BONES = [b.name for b in A0.data.bones]

# ---------- actors ----------
def make_actor_b():
    if 'Actor_B' in bpy.data.objects: return bpy.data.objects['Actor_B']
    B = A0.copy(); B.name = 'Actor_B'; B.animation_data_clear(); sc.collection.objects.link(B)
    tinted = {}
    for c in A0.children:
        m = c.copy(); m.name = 'B_' + c.name; sc.collection.objects.link(m); m.parent = B
        for md in m.modifiers:
            if md.type == 'ARMATURE': md.object = B
        for i, slot in enumerate(m.material_slots):
            mat = slot.material
            if mat is None: continue
            if mat.name not in tinted:
                nm = mat.copy(); nm.name = mat.name + '_B'
                for n in nm.node_tree.nodes if nm.use_nodes else []:
                    if n.type == 'TEX_IMAGE' and n.image:
                        im = n.image.copy(); px = np.array(im.pixels[:], dtype=np.float32).reshape(-1, 4)
                        px[:, [1, 2]] = px[:, [2, 1]]   # swap green/blue: green skin turns blue
                        im.pixels.foreach_set(px.ravel()); im.pack(); n.image = im
                tinted[mat.name] = nm
            slot.link = 'OBJECT'; slot.material = tinted[mat.name]
    return B
ACT = {'A': A0, 'B': make_actor_b()}
for ob in ACT.values():
    ob.animation_data_clear()
    for pb in ob.pose.bones: pb.rotation_mode = 'QUATERNION'
bpy.data.objects['Rig_Brute'].hide_render = True
for c in bpy.data.objects['Rig_Brute'].children: c.hide_render = True

# ---------- clip sampling ----------
_bc = {}
def act(cid): return bpy.data.actions[cid + '__M']
def nfr(cid): return int(act(cid).frame_range[1])
# fcurve evaluation straight from the action (no scene evaluation needed)
_fc = {}
def curves(cid):
    if cid not in _fc:
        a = act(cid); d = {}
        for lay in a.layers:
            for st in lay.strips:
                for cb in st.channelbags:
                    for fc in cb.fcurves: d[(fc.data_path, fc.array_index)] = fc
        _fc[cid] = d
    return _fc[cid]
def basis(cid, f):
    k = (cid, int(round(f)))
    if k in _bc: return _bc[k]
    C = curves(cid); out = {}
    for n in BONES:
        dp = f'pose.bones["{n}"]'
        q = Quaternion([C[(dp + '.rotation_quaternion', i)].evaluate(k[1]) for i in range(4)]).normalized()
        t = Vector([C[(dp + '.location', i)].evaluate(k[1]) for i in range(3)])
        out[n] = (q, t)
    _bc[k] = out; return out
def local_frame(seg, t, key='base'):
    cid = seg[key]; n = nfr(cid)
    fin = seg.get('in', 1) if key == 'base' else 1
    fout = seg.get('_out', n) if key == 'base' else n
    lf = fin + (t - seg['_start'])
    loop = seg.get('loop', False) if key == 'base' else seg.get(key + 'Loop', True)
    L = fout - fin
    if lf > fout:
        lf = (fin + (lf - fin) % L) if (loop and L > 0) else fout
    return max(1, lf)

# ---------- posing ----------
def apply_pose(ob, P):
    for n, (q, t) in P.items():
        pb = ob.pose.bones[n]; pb.rotation_quaternion = q; pb.location = t; pb.scale = (1, 1, 1)
def seg_pose(seg, t):
    P = dict(basis(seg['base'], local_frame(seg, t)))
    if 'upper' in seg:
        U = basis(seg['upper'], local_frame(seg, t, 'upper'))
        for n in (TORSO if seg.get('upperBones') == 'torso' else TORSO + ARMS): P[n] = U[n]
    if 'arms' in seg:
        Ar = basis(seg['arms'], local_frame(seg, t, 'arms'))
        for n in ARMS: P[n] = Ar[n]
    return P
def face_rot(stage, me, other):
    d = Vector(stage[other]['_p']) - Vector(stage[me]['_p'])
    return math.atan2(d.y, d.x) - FWD0
def rest_forward():
    ob = ACT['A']; place(ob, (0, 0), 0); apply_pose(ob, basis('kfb_idle_breathing_a', 1))
    v = (world(ob, 'toes.l') + world(ob, 'toes.r')) / 2 - (world(ob, 'foot.l') + world(ob, 'foot.r')) / 2
    return math.atan2(v.y, v.x)
def place(ob, pos, yaw):
    ob.rotation_mode = 'XYZ'; ob.location = (pos[0], pos[1], 0); ob.rotation_euler = (0, 0, yaw)
def world(ob, n, head=True):
    bpy.context.view_layer.update(); pb = ob.pose.bones[n]
    return ob.matrix_world @ (pb.head if head else pb.tail)
def pose_seg_at(k, seg, t):
    ob = ACT[k]; place(ob, seg['_loc'], seg['_yaw']); apply_pose(ob, seg_pose(seg, t)); bpy.context.view_layer.update()

# ---------- measurements ----------
def react_hit(cid, lo=1, span=70):
    # first strong head jolt: frame of max head acceleration in the first `span` frames (Rig_Medium, actor A at origin)
    ob = ACT['A']; place(ob, (0, 0), 0); P = []
    for f in range(lo, min(nfr(cid), lo + span) + 1):
        apply_pose(ob, basis(cid, f)); P.append(world(ob, 'head'))
    acc = [((P[i + 1] - P[i]) - (P[i] - P[i - 1])).length for i in range(1, len(P) - 1)]
    return lo + 1 + int(np.argmax(acc))
def strike_frame(cid): return CAT[cid]['events']['strike']['frame'] if 'events' in CAT[cid] and 'strike' in CAT[cid]['events'] else None
def strike_limb(cid): return CAT[cid]['events']['strike']['limb']

# ---------- resolve ----------
FWD0 = None
HEAD_FRONT = 0.6
HQ0 = None
def resolve(S):
    global FWD0
    FWD0 = rest_forward(); print('rest forward deg', round(math.degrees(FWD0), 1))
    global HQ0
    ob = ACT['A']; place(ob, (0, 0), 0); apply_pose(ob, basis('kfb_idle_breathing_a', 1)); bpy.context.view_layer.update()
    HQ0 = (ob.matrix_world @ ob.pose.bones['hips'].matrix).to_quaternion()
    st = S['stage']; tr = S['tracks']; ev = {}
    for k in st: st[k]['_p'] = [p if isinstance(p, (int, float)) else 0 for p in st[k]['pos']]
    # auto distances
    for k, s in st.items():
        for i, p in enumerate(s['pos']):
            if p == 'auto:handover':
                s['_p'][i] = st['A']['_p'][0] + 1.52; s['_auto'] = 'handover: head spacing (2 x 0.73 m face front + 6 cm); arms reach out to the box at the pass'
            if p == 'auto:reach':
                rf = s['reachFrom']; seg = tr[rf['actor']][rf['segment']]; cid = seg['base']; f = strike_frame(cid)
                ob = ACT['A']; place(ob, (0, 0), 0); fw = Vector((math.cos(FWD0), math.sin(FWD0), 0))
                apply_pose(ob, basis(cid, f)); bpy.context.view_layer.update()
                reach = (world(ob, strike_limb(cid), head=False) - world(ob, 'hips')).dot(fw)
                apply_pose(ob, basis('kfb_action_boxing_a', 1)); bpy.context.view_layer.update()
                dg = bpy.context.evaluated_depsgraph_get(); hips = world(ob, 'hips')
                hd = bpy.data.objects['OrcRaider_Head'].evaluated_get(dg)
                front = max((hd.matrix_world @ v.co - hips).dot(fw) for v in hd.data.vertices)
                global HEAD_FRONT; HEAD_FRONT = front
                s['_p'][i] = st['A']['_p'][0] + 2 * front + 0.06
                s['_auto'] = (f'heads: face front {front:.2f} m ahead of the hips, so hips {2*front+0.06:.2f} m apart (faces 6 cm apart); '
                              f'the strike hand reaches only {reach:.2f} m, so the arm stretches at the hit (cartoon stretch)')
    for k in st: st[k]['_yaw'] = face_rot(st, k, 'B' if k == 'A' else 'A')
    # timing, sync and anchors (iterate until events resolve)
    for it in range(6):
        for k, segs in tr.items():
            prev = None
            for i, seg in enumerate(segs):
                s0 = seg['start']
                if isinstance(s0, (int, float)): seg['_start'] = s0
                elif s0 == 'afterPrev' and prev is not None and '_end' in prev: seg['_start'] = prev['_end']
                elif isinstance(s0, dict) and s0['event'] in ev:
                    rh = react_hit(seg['base'], seg.get('in', 1)); seg['_reactHit'] = rh
                    seg['_start'] = ev[s0['event']] - (rh - seg.get('in', 1))
                if '_start' not in seg: prev = seg; continue
                n = nfr(seg['base'])
                o = seg.get('out')
                if isinstance(o, str) and o.startswith('reactHit'): seg['_out'] = min(n, seg.get('_reactHit', 1) + int(o.split('+')[1]))
                elif isinstance(o, int): seg['_out'] = o
                length = seg.get('_out', n) - seg.get('in', 1)
                seg['_end'] = seg['_start'] + length + seg.get('holdEnd', 0)
                nxt = segs[i + 1]['start'] if i + 1 < len(segs) else None
                if seg.get('loop') and isinstance(nxt, (int, float)): seg['_end'] = nxt
                prev = seg
        for e in S['events']:
            if e.get('type') == 'strike':
                seg = tr[e['actor']][e['segment']]
                if '_start' in seg: ev[e['id']] = seg['_start'] + strike_frame(seg['base']) - seg.get('in', 1)
    # locations and headings. heading(): the hips' facing in object space (object at origin, yaw 0)
    def heading(cid, f):
        ob = ACT['A']; place(ob, (0, 0), 0); apply_pose(ob, basis(cid, f)); bpy.context.view_layer.update()
        q = (ob.matrix_world @ ob.pose.bones['hips'].matrix).to_quaternion()
        v = q @ HQ0.inverted() @ Vector((math.cos(FWD0), math.sin(FWD0), 0))
        return math.atan2(v.y, v.x)
    def hips_xy(k, seg, lf, yaw):
        ob = ACT[k]; place(ob, (0, 0), yaw); P = dict(basis(seg['base'], lf)); apply_pose(ob, P); return world(ob, 'hips')
    wrap = lambda x: (x + math.pi) % (2 * math.pi) - math.pi
    for k, segs in tr.items():
        prev = None
        other = 'B' if k == 'A' else 'A'
        d = Vector(st[other]['_p']) - Vector(st[k]['_p']); face = math.atan2(d.y, d.x)
        for seg in segs:
            if '_start' not in seg: raise SystemExit('unresolved ' + k + ' ' + seg['base'])
            an = seg.get('anchor'); fin = seg.get('in', 1); cid = seg['base']
            h_in = heading(cid, fin)
            if an == 'continue' and prev is not None:
                pend = prev.get('_out', nfr(prev['base']))
                def axis(cid, f):   # lying poses: use the hips->head body axis instead of the facing
                    ob = ACT['A']; place(ob, (0, 0), 0); apply_pose(ob, basis(cid, f)); v = world(ob, 'head') - world(ob, 'hips')
                    return (math.atan2(v.y, v.x), v.z < 0.35)
                a0, ly0 = axis(prev['base'], pend); a1, ly1 = axis(cid, fin)
                seg['_yaw'] = prev['_yaw'] + (wrap(a0 - a1) if (ly0 and ly1) else wrap(heading(prev['base'], pend) - h_in))
                if not ly1: seg['_yaw'] = face - h_in if abs(wrap(h_in - FWD0)) > math.radians(100) else face - FWD0   # standing again: face the partner
                h0 = hips_xy(k, prev, pend, prev['_yaw']) + Vector((prev['_loc'][0], prev['_loc'][1], 0))
                h1 = hips_xy(k, seg, fin, seg['_yaw']); seg['_loc'] = [h0.x - h1.x, h0.y - h1.y]
                seg['_why'] = 'continue: hips and heading carried over from the previous clip end'
                if not ly1:
                    me = Vector((h0.x, h0.y)); op = Vector(st[other]['_p']); gap = (me - op).length; mind = 2 * HEAD_FRONT + 0.06
                    if gap < mind:
                        push = (me - op).normalized() * (mind - gap); seg['_loc'] = [seg['_loc'][0] + push.x, seg['_loc'][1] + push.y]
                        seg['_why'] = f'continue, facing the partner, then stepped back {mind-gap:.2f} m to keep head spacing'
                prev = seg; continue
            turned = abs(wrap(h_in - FWD0)) > math.radians(100)
            seg['_yaw'] = face - (h_in if turned else FWD0)
            if turned: seg['_why'] = f'clip is turned {math.degrees(wrap(h_in - FWD0)):.0f} deg at its in-frame: re-aimed at the partner'
            lf = nfr(cid) if an == 'endAtStage' else fin
            h = hips_xy(k, seg, lf, seg['_yaw']); seg['_loc'] = [st[k]['_p'][0] - h.x, st[k]['_p'][1] - h.y]
            prev = seg
    ev_t = dict(ev)
    def tref(x):
        if isinstance(x, (int, float)): return x
        if x in ev_t: return ev_t[x]
        a, s, rest = x.split('.', 2); off = 0
        if '+' in rest: rest, o = rest.split('+'); off = int(o)
        seg = tr[a][int(s.replace('segment', ''))]
        return (seg['_start'] if rest == 'start' else seg['_end'] - seg.get('holdEnd', 0)) + off
    for e in S['events']:
        if 'after' in e: e['_t'] = tref(e['after'])
        elif 't' in e: e['_t'] = e['t']
        elif e['type'] == 'strike': e['_t'] = ev_t[e['id']]
    S['_shots'] = [tref(x) for x in S['shots']]
    return S

# ---------- props ----------
def mat(name, rgb):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.diffuse_color = (*rgb, 1); m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF'); b.inputs['Base Color'].default_value = (*rgb, 1); return m
def box(name, dims, m):
    bpy.ops.mesh.primitive_cube_add(size=1); o = bpy.context.active_object; o.name = name
    o.scale = dims; bpy.ops.object.transform_apply(scale=True); o.data.materials.append(m); return o
def clear_fx():
    for o in list(bpy.data.objects):
        if o.name.startswith('fx_') or o.name.startswith('prop_'): bpy.data.objects.remove(o)
def make_gift(dims):
    w, d, h = dims
    base = box('prop_gift', (w, d, h), mat('gift_red', (0.85, 0.12, 0.15)))
    rib = box('prop_rib', (w * 0.16, d * 1.02, h * 1.02), mat('gift_gold', (0.95, 0.75, 0.15))); rib.parent = base
    lid = box('prop_lid', (w * 1.08, d * 1.08, h * 0.18), mat('gift_red2', (0.7, 0.08, 0.12)))
    return base, lid
def make_item():
    bpy.ops.mesh.primitive_torus_add(major_radius=0.17, minor_radius=0.05); o = bpy.context.active_object; o.name = 'prop_item'
    o.data.materials.append(mat('item_teal', (0.1, 0.8, 0.75)))
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.08); e = bpy.context.active_object; e.name = 'prop_item_eye'; e.parent = o; e.location = (0, 0, 0.17)
    e.data.materials.append(mat('eye_white', (0.97, 0.97, 0.97)))
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035); p = bpy.context.active_object; p.name = 'prop_item_pupil'; p.parent = e; p.location = (0, -0.06, 0.0)
    p.data.materials.append(mat('eye_black', (0.02, 0.02, 0.02)))
    return o
def burst(pos, r=0.35):
    verts = []; n = 10
    for i in range(2 * n):
        a = i * math.pi / n; rr = r if i % 2 == 0 else r * 0.45
        verts.append((math.cos(a) * rr, 0, math.sin(a) * rr))
    me = bpy.data.meshes.new('fx_burst'); me.from_pydata(verts + [(0, 0, 0)], [], [(i, (i + 1) % (2 * n), 2 * n) for i in range(2 * n)])
    o = bpy.data.objects.new('fx_burst', me); sc.collection.objects.link(o); o.location = pos; o.location.y -= 0.3
    o.data.materials.append(mat('fx_yellow', (1.0, 0.85, 0.1)))
def stars(center):
    for i in range(5):
        a = i * 2 * math.pi / 5
        bpy.ops.mesh.primitive_ico_sphere_add(radius=0.1, subdivisions=1); s = bpy.context.active_object; s.name = f'fx_star{i}'
        s.location = center + Vector((math.cos(a) * 0.45, math.sin(a) * 0.45, 0.1 * math.sin(a * 2)))
        s.data.materials.append(mat('fx_yellow', (1.0, 0.85, 0.1)))
def bubble(pos, text):
    bpy.ops.object.text_add(); t = bpy.context.active_object; t.name = 'fx_txt'; t.data.body = text
    t.data.size = 0.32; t.data.align_x = 'CENTER'; t.data.extrude = 0.01
    t.rotation_euler = (math.pi / 2, 0, 0); t.location = pos + Vector((0, -0.25, 0))
    t.data.materials.append(mat('fx_ink', (0.03, 0.03, 0.03)))
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1); b = bpy.context.active_object; b.name = 'fx_bub'
    b.scale = (0.38 + 0.09 * len(text), 0.05, 0.28); b.location = pos + Vector((0, -0.15, 0.1))
    b.data.materials.append(mat('fx_paper', (0.98, 0.98, 0.95)))

# ---------- render ----------
def aim_limb(att, side, limb, target, w):
    # 1) aim the upper arm so shoulder->hand points at the target, 2) stretch the forearm to close the gap (cartoon stretch)
    for _ in range(2):
        bpy.context.view_layer.update()
        sh = world(att, 'upperarm.' + side); hand = world(att, limb, head=False)
        R = Quaternion().slerp((hand - sh).rotation_difference(target - sh), w)
        pb = att.pose.bones['upperarm.' + side]; M = pb.matrix.copy()
        Wr = att.matrix_world.to_quaternion()
        N = (Wr.inverted() @ R @ Wr).to_matrix().to_4x4() @ Matrix.Translation(-M.translation) @ M; N.translation = M.translation
        pb.matrix = N
    k = 1.0
    for _ in range(3):
        bpy.context.view_layer.update()
        sh = world(att, 'upperarm.' + side); hand = world(att, limb, head=False)
        need = (target - sh).length - (hand - sh).length
        L = att.pose.bones['lowerarm.' + side].length
        k = max(1.0, min(2.6, k + w * need / L))
        att.pose.bones['lowerarm.' + side].scale = (1 / math.sqrt(k), k, 1 / math.sqrt(k))
        att.pose.bones['wrist.' + side].scale = (math.sqrt(k), 1 / k, math.sqrt(k))
    bpy.context.view_layer.update()
    return k

STRETCH = []
SPACING = []
def active_seg(k, t, tr):
    segs = [s for s in tr[k] if s['_start'] <= t]
    return segs[-1] if segs else tr[k][0]
def shot(S, t, cam):
    clear_fx(); tr = S['tracks']
    for k in ACT:
        seg = active_seg(k, t, tr)
        pose_seg_at(k, seg, t)
    # personal-space solver: big chibi heads must not overlap; slide both actors apart along their line
    ha, hb = world(ACT['A'], 'head'), world(ACT['B'], 'head'); dv = Vector((hb.x - ha.x, hb.y - ha.y, 0))
    need = 2 * 0.72 - dv.length
    if need > 0:
        u = dv.normalized() if dv.length > 1e-6 else Vector((1, 0, 0))
        ACT['A'].location -= u * need / 2; ACT['B'].location += u * need / 2; bpy.context.view_layer.update()
        SPACING.append({'t': t, 'pushedApart_cm': round(need * 100, 1)})
    # props
    gift = next((p for p in S['props'] if p['kind'] == 'giftBox'), None)
    if gift:
        base, lid = make_gift(gift['dims'])
        owner = gift['owner']
        for e in S['events']:
            if e['type'] == 'handover' and e['_t'] <= t: owner = e['to']
        ob = ACT[owner]; c = (world(ob, 'handslot.l') + world(ob, 'handslot.r')) / 2
        ho = next((e for e in S['events'] if e['type'] == 'handover'), None)
        if ho and abs(t - ho['_t']) <= 8:
            w = 1 - abs(t - ho['_t']) / 9
            ca = (world(ACT['A'], 'hips') + world(ACT['B'], 'hips')) / 2; ca.z = c.z
            c = c.lerp(ca, w)
            for k2 in ('A', 'B') if t >= ho['_t'] - 3 else (ho['from'],):
                o2 = ACT[k2]; half = gift['dims'][0] / 2
                side_v = Vector((0, 1, 0)) if o2.location.x < ca.x else Vector((0, -1, 0))
                for sd, sg in (('l', 1), ('r', -1)):
                    aim_limb(o2, sd, 'handslot.' + sd, c + side_v * sg * half * 0.9, 1.0 if k2 == owner else w)
        op0 = next((e for e in S['events'] if e['type'] == 'open'), None)
        if op0 and t >= op0['_t'] - 10:
            w = min(1, (t - (op0['_t'] - 10)) / 10)
            fwv = (world(ACT['A' if owner == 'B' else 'B'], 'hips') - world(ob, 'hips')); fwv.z = 0; fwv.normalize()
            pt = world(ob, 'hips') + fwv * 0.78; pt.z = 0.62
            c = c.lerp(pt, w); half = gift['dims'][0] / 2; sv = Vector((-fwv.y, fwv.x, 0))
            for sd, sg in (('l', 1), ('r', -1)): aim_limb(ob, sd, 'handslot.' + sd, c + sv * sg * half * 0.9 * (1 if owner == 'A' else -1), 1.0)
        base.location = c; base.rotation_euler = (0, 0, ob.rotation_euler.z)
        if ho and 0 <= t - ho['_t'] < 4: base.scale = (1.25, 1.25, 0.75)       # squash on the pass
        op = next((e for e in S['events'] if e['type'] == 'open'), None)
        h = gift['dims'][2]
        lid.location = c + Vector((0, 0, h / 2 + 0.03)); lid.rotation_euler = (0, 0, ob.rotation_euler.z)
        if op and t >= op['_t']:
            u = min(1, (t - op['_t']) / op['duration'])
            lid.location.z += 0.55 * math.sin(u * math.pi * 0.9) + 0.25 * u; lid.rotation_euler = (1.2 * u, 0.5 * u, ob.rotation_euler.z)
        rv = next((e for e in S['events'] if e['type'] == 'reveal'), None)
        if rv and t >= rv['_t']:
            u = min(1, (t - rv['_t']) / rv['duration']); it = make_item()
            it.location = c + Vector((0, 0, h / 2 + rv['rise'] * u)); it.rotation_euler = (math.pi / 2, 0, ob.rotation_euler.z + math.pi)
    STRETCH.clear()
    for e in S['events']:
        if e['type'] == 'strike' and abs(t - e['_t']) <= 4:
            att = ACT[e['actor']]; tgt = ACT['B' if e['actor'] == 'A' else 'A']
            seg = [x for x in tr[e['actor']] if x['_start'] <= t][-1]; limb = strike_limb(seg['base'])
            side = limb[-1]; w = 1 - abs(t - e['_t']) / 5
            hd = world(tgt, 'head'); to_att = (world(att, 'hips') - world(tgt, 'hips')); to_att.z = 0; to_att.normalize()
            face = hd + to_att * HEAD_FRONT * 0.85
            k = aim_limb(att, side, limb, face, w)
            STRETCH.append({'t': t, 'actor': e['actor'], 'limb': limb, 'k': round(k, 2), 'miss_cm': round(max(0, (face - world(att, limb, head=False)).length) * 100, 1)})
            if abs(t - e['_t']) < 3: burst(face)
    for e in S['events']:
        if e['type'] == 'stars' and e['_t'] - 30 <= t <= e['_t'] + e['duration']:
            stars(world(ACT[e['actor']], 'head') + Vector((0, 0, 0.25)))
        if e['type'] == 'bubble' and 0 <= t - e['_t'] < 45:
            bubble(world(ACT[e['actor']], 'head') + Vector((0, 0, 1.25)), e['text'])
    print('  shot', t, {k: (active_seg(k, t, tr)['base'][4:], round(world(ACT[k], 'hips').x, 2), round(world(ACT[k], 'head').x, 2)) for k in ACT}, flush=True)
    xs = [world(ACT[k], n).x for k in ACT for n in ('hips', 'head', 'foot.l', 'foot.r')]
    cx = (min(xs) + max(xs)) / 2; span = max(xs) - min(xs)
    dist = max((span + 2.6) / 0.72, 3.0 * 1.45 / 0.72)
    tgt = Vector((cx, 0, 1.05)); cam.location = tgt + Vector((0.18 * dist, -dist, 0.35))
    cam.rotation_euler = (tgt - cam.location).to_track_quat('-Z', 'Y').to_euler()
    return render_tile()
def run(path):
    S = resolve(json.load(open(path)))
    cam = setup(300); sc.render.resolution_x = 360; sc.render.resolution_y = 300
    for ob in ACT.values():
        for c in [ob] + list(ob.children): c.hide_render = False
    tiles = []; stl = []; SPACING.clear()
    for t in S['_shots']:
        tiles.append(shot(S, t, cam)); stl += list(STRETCH)
    out = f"/tmp/ch1/out/B_{S['id']}.png"; save([np.concatenate(tiles, axis=1)], out)
    # resolved contract for the runtime (numbers the player computed)
    R = {'id': S['id'], 'stage': {k: {'pos': [round(x, 3) for x in v['_p']], 'yawDeg': round(math.degrees(v['_yaw']), 1), 'auto': v.get('_auto')} for k, v in S['stage'].items()},
         'tracks': {k: [{'clip': s['base'], 'start': s['_start'], 'end': round(s['_end'], 1), **({'reactHit': s['_reactHit']} if '_reactHit' in s else {}), **({'out': s['_out']} if '_out' in s else {}),
                         'loc': [round(x, 3) for x in s['_loc']]} for s in segs] for k, segs in S['tracks'].items()},
         'events': [{k2: v for k2, v in e.items() if k2 in ('id', 'type', 'actor', '_t')} for e in S['events']], 'shots': S['_shots'], 'stretch': stl, 'spacing': list(SPACING),
         'segmentNotes': {k: {i: s.get('_why') for i, s in enumerate(segs) if s.get('_why')} for k, segs in S['tracks'].items()}}
    json.dump(R, open(f"/tmp/ch1/out/B_{S['id']}.resolved.json", 'w'), indent=1)
    print(S['id'], json.dumps(R['stage']), 'shots', S['_shots'], flush=True)
for p in sys.argv[sys.argv.index('--') + 1:]: run(p)
