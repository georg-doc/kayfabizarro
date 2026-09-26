"""CLAY-B1 · KFB_ClayMaster v0.2 · re-conceived after Georg's round-1 review ("looks nothing like claymation, too bright")
Plasticine reads through: soft, large thumb-press dents + gentle waxy sheen + a little light going into the material
+ darker, soft creases. NOT through fine grain. So v0.2:
- dents: Voronoi smooth-F1 (rounded cells = pressed thumb/tool marks) -> Bump, plus a very low noise for unevenness
- micro grain: almost off (optional Dandruff mottle height, default 0.02)
- sheen: roughness 0.5..0.62 (plasticine is slightly waxy, not chalk)
- SSS: small warm subsurface (T1 Cycles look-dev only; T3 fakes it with wrap light in three.js)
- creases: Ambient Occlusion node darkens contacts/creases (T1/T2; baked into ORM for T3)
- colour stays the character's own colour; mottle is subtle
Coordinates: rest pose (Generated x rest bbox) + per-object seed -> no swimming under the armature.
exec globals: CLAY_TEX_DIR, CLAY_PARAMS."""
import bpy, random

SCENE = 'CLAY_B1_FB_v5'
TEX = globals().get('CLAY_TEX_DIR', '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Clay seamless texture + stop-motion-shader - itchio/_KFB_converted/clay1/')
PAR = dict(mottle=0.06, dents=0.55, dent_scale=5.0, dent_depth=0.012, lumps=0.25, lump_scale=1.4,
           micro=0.02, rough_min=0.50, rough_max=0.62, sss=0.12, crease=0.6)
PAR.update(globals().get('CLAY_PARAMS', {}))
GROUP = 'KFB_ClayMaster'
SKIN = ['FB_Yellow']


def img(name):
    im = bpy.data.images.get(name) or bpy.data.images.load(TEX + name, check_existing=True)
    im.colorspace_settings.name = 'Non-Color'
    return im


def build_group():
    g = bpy.data.node_groups.get(GROUP)
    if g:
        bpy.data.node_groups.remove(g)
    g = bpy.data.node_groups.new(GROUP, 'ShaderNodeTree')
    io = g.interface
    def sock(name, typ, d):
        s = io.new_socket(name, in_out='INPUT', socket_type=typ); s.default_value = d
    sock('Base Color', 'NodeSocketColor', (0.888, 0.584, 0.045, 1))
    for k in ('mottle', 'dents', 'dent_scale', 'dent_depth', 'lumps', 'lump_scale', 'micro', 'rough_min', 'rough_max', 'sss', 'crease'):
        sock(k.replace('_', ' ').title(), 'NodeSocketFloat', PAR[k])
    io.new_socket('BSDF', in_out='OUTPUT', socket_type='NodeSocketShader')
    N, L = g.nodes, g.links
    gi = N.new('NodeGroupInput'); go = N.new('NodeGroupOutput')
    I = lambda k: gi.outputs[k.replace('_', ' ').title()]
    tc = N.new('ShaderNodeTexCoord')
    bb = N.new('ShaderNodeAttribute'); bb.attribute_type = 'OBJECT'; bb.attribute_name = 'kfb_clay_bbox'
    sd = N.new('ShaderNodeAttribute'); sd.attribute_type = 'OBJECT'; sd.attribute_name = 'kfb_clay_seed'
    m1 = N.new('ShaderNodeVectorMath'); m1.operation = 'MULTIPLY'
    L.new(tc.outputs['Generated'], m1.inputs[0]); L.new(bb.outputs['Vector'], m1.inputs[1])
    p = N.new('ShaderNodeVectorMath'); p.operation = 'ADD'
    L.new(m1.outputs[0], p.inputs[0]); L.new(sd.outputs['Vector'], p.inputs[1])
    # thumb dents: smooth F1 distance -> rounded cups
    vo = N.new('ShaderNodeTexVoronoi'); vo.feature = 'SMOOTH_F1'; vo.distance = 'EUCLIDEAN'
    vo.inputs['Smoothness'].default_value = 1.0; vo.inputs['Randomness'].default_value = 0.85
    L.new(p.outputs[0], vo.inputs['Vector']); L.new(I('dent_scale'), vo.inputs['Scale'])
    # lumps: low-frequency unevenness
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Detail'].default_value = 1.0; nz.inputs['Roughness'].default_value = 0.3
    L.new(p.outputs[0], nz.inputs['Vector']); L.new(I('lump_scale'), nz.inputs['Scale'])
    b1 = N.new('ShaderNodeBump'); L.new(I('lumps'), b1.inputs['Strength']); L.new(nz.outputs['Fac'], b1.inputs['Height'])
    b1.inputs['Distance'].default_value = 0.03
    b2 = N.new('ShaderNodeBump'); L.new(I('dents'), b2.inputs['Strength']); L.new(vo.outputs['Distance'], b2.inputs['Height'])
    L.new(I('dent_depth'), b2.inputs['Distance']); L.new(b1.outputs['Normal'], b2.inputs['Normal'])
    # optional micro grain (Dandruff mottle as height), almost off by default
    sc = N.new('ShaderNodeVectorMath'); sc.operation = 'SCALE'; sc.inputs['Scale'].default_value = 3.0
    L.new(p.outputs[0], sc.inputs[0])
    tm = N.new('ShaderNodeTexImage'); tm.image = img('clay1_mottle.png'); tm.projection = 'BOX'; tm.projection_blend = 0.3
    L.new(sc.outputs[0], tm.inputs['Vector'])
    b3 = N.new('ShaderNodeBump'); L.new(I('micro'), b3.inputs['Strength']); L.new(tm.outputs['Color'], b3.inputs['Height'])
    b3.inputs['Distance'].default_value = 0.004; L.new(b2.outputs['Normal'], b3.inputs['Normal'])
    # colour: base * (1 + mottle*2*(m-0.5)) * crease AO
    s1 = N.new('ShaderNodeMath'); s1.operation = 'SUBTRACT'; s1.inputs[1].default_value = 0.5; L.new(tm.outputs['Color'], s1.inputs[0])
    k2 = N.new('ShaderNodeMath'); k2.operation = 'MULTIPLY'; k2.inputs[1].default_value = 2.0; L.new(I('mottle'), k2.inputs[0])
    s2 = N.new('ShaderNodeMath'); s2.operation = 'MULTIPLY_ADD'; s2.inputs[2].default_value = 1.0
    L.new(s1.outputs[0], s2.inputs[0]); L.new(k2.outputs[0], s2.inputs[1])
    ao = N.new('ShaderNodeAmbientOcclusion'); ao.samples = 16; ao.inputs['Distance'].default_value = 0.08
    mx = N.new('ShaderNodeMix'); mx.data_type = 'FLOAT'; mx.inputs['A'].default_value = 1.0
    L.new(I('crease'), mx.inputs['Factor']); L.new(ao.outputs['AO'], mx.inputs['B'])
    v = N.new('ShaderNodeMath'); v.operation = 'MULTIPLY'; L.new(s2.outputs[0], v.inputs[0]); L.new(mx.outputs['Result'], v.inputs[1])
    col = N.new('ShaderNodeVectorMath'); col.operation = 'SCALE'; L.new(gi.outputs['Base Color'], col.inputs[0]); L.new(v.outputs[0], col.inputs['Scale'])
    # roughness: waxy, slightly rougher inside the dents
    mr = N.new('ShaderNodeMapRange'); L.new(vo.outputs['Distance'], mr.inputs['Value'])
    mr.inputs['From Min'].default_value = 0.0; mr.inputs['From Max'].default_value = 0.6
    L.new(I('rough_max'), mr.inputs['To Min']); L.new(I('rough_min'), mr.inputs['To Max'])
    bs = N.new('ShaderNodeBsdfPrincipled')
    L.new(col.outputs[0], bs.inputs['Base Color']); L.new(mr.outputs['Result'], bs.inputs['Roughness'])
    L.new(b3.outputs['Normal'], bs.inputs['Normal'])
    L.new(I('sss'), bs.inputs['Subsurface Weight']); bs.inputs['Subsurface Scale'].default_value = 0.03
    bs.inputs['Subsurface Radius'].default_value = (1.0, 0.45, 0.2)
    bs.inputs['Specular IOR Level'].default_value = 0.45
    L.new(bs.outputs[0], go.inputs['BSDF'])
    for i, n in enumerate(N):
        n.location = (i * 170 - 2200, (i % 6) * -200)
    return g


def clay_material(src):
    m = bpy.data.materials.get(src.name + '_CLAY') or bpy.data.materials.new(src.name + '_CLAY')
    m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial'); gn = nt.nodes.new('ShaderNodeGroup'); gn.node_tree = bpy.data.node_groups[GROUP]
    b = [n for n in src.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    gn.inputs['Base Color'].default_value = b.inputs['Base Color'].default_value
    nt.links.new(gn.outputs['BSDF'], out.inputs['Surface']); gn.location = (-250, 0)
    m['kfb_clay_material'] = 'kfb.clay-material/0.1 · ClayMaster v0.2 · T1/T2 look-dev'
    m['kfb_clay_source'] = src.name
    return m


sc = bpy.data.scenes[SCENE]
build_group()
rep = {}
for o in sc.objects:
    if o.type != 'MESH':
        continue
    for i, slot in enumerate(o.material_slots):
        src = slot.material
        if src and src.get('kfb_clay_source'):
            src = bpy.data.materials.get(src['kfb_clay_source'])
        if src and src.name in SKIN:
            o.material_slots[i].material = clay_material(src)
            if 'kfb_clay_seed' not in o:
                r = random.Random(hash(o.name) & 0xffff); o['kfb_clay_seed'] = [r.uniform(0, 10) for _ in range(3)]
            vs = [v.co for v in o.data.vertices]
            o['kfb_clay_bbox'] = [max(v[a] for v in vs) - min(v[a] for v in vs) for a in range(3)]
            rep[o.name] = o.material_slots[i].material.name
result = dict(group=GROUP, version='0.2', applied=len(rep), par=PAR)
