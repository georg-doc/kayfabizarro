"""CLAY-B1 · KFB_ClayMaster v0.1 (T1 Cycles / T2 EEVEE) on FrizzleBob v5 · Claude Coworker 26.09.2026
Runs in scene CLAY_B1_FB_v5 only. Never touches other scenes, never saves the open file.

Design (PR #228 plan):
- Colour stays the character's own colour (FB_Yellow). Clay only modulates: mottle +-, soft AO cavity, roughness range.
- Relief = BUMP CHAIN (valid): meso bump (procedural noise, rest-pose coords) -> micro bump (ClayDandruff01 mottle as height).
  No Normal Map node: head/ears have no UVs, so tangent-space maps are invalid there.
- Coordinates: Generated (undeformed rest pose -> no swimming under the armature) x per-object bbox (metres)
  + per-object seed offset. Box projection for the images.
- Only the skin zone material (FB_Yellow) is replaced by a clay copy. Eyes, brows, nose and mouth keep their materials.
exec globals: CLAY_TEX_DIR, CLAY_PARAMS (dict overrides), CLAY_APPLY (default True)."""
import bpy, os, random

SCENE = 'CLAY_B1_FB_v5'
TEX = globals().get('CLAY_TEX_DIR', '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Clay seamless texture + stop-motion-shader - itchio/_KFB_converted/clay1/')
PAR = dict(mottle=0.10, ao=0.35, rough_min=0.72, rough_max=0.90, meso=0.10, meso_scale=3.0, micro=0.06, scale=4.0)
PAR.update(globals().get('CLAY_PARAMS', {}))
GROUP = 'KFB_ClayMaster'
SKIN = ['FB_Yellow']


def img(name):
    p = TEX + name
    im = bpy.data.images.get(name) or bpy.data.images.load(p, check_existing=True)
    im.colorspace_settings.name = 'Non-Color'
    return im


def build_group():
    g = bpy.data.node_groups.get(GROUP)
    if g:
        bpy.data.node_groups.remove(g)
    g = bpy.data.node_groups.new(GROUP, 'ShaderNodeTree')
    iface = g.interface
    def sock(name, typ, default=None, mn=None, mx=None):
        s = iface.new_socket(name, in_out='INPUT', socket_type=typ)
        if default is not None: s.default_value = default
        if mn is not None: s.min_value = mn
        if mx is not None: s.max_value = mx
    sock('Base Color', 'NodeSocketColor', (0.888, 0.584, 0.045, 1))
    sock('Mottle', 'NodeSocketFloat', PAR['mottle'], 0, 1)
    sock('AO', 'NodeSocketFloat', PAR['ao'], 0, 1)
    sock('Rough Min', 'NodeSocketFloat', PAR['rough_min'], 0, 1)
    sock('Rough Max', 'NodeSocketFloat', PAR['rough_max'], 0, 1)
    sock('Meso', 'NodeSocketFloat', PAR['meso'], 0, 2)
    sock('Meso Scale', 'NodeSocketFloat', PAR['meso_scale'], 0, 50)
    sock('Micro', 'NodeSocketFloat', PAR['micro'], 0, 2)
    sock('Scale', 'NodeSocketFloat', PAR['scale'], 0, 100)
    iface.new_socket('BSDF', in_out='OUTPUT', socket_type='NodeSocketShader')
    N, L = g.nodes, g.links
    gi = N.new('NodeGroupInput'); go = N.new('NodeGroupOutput')
    tc = N.new('ShaderNodeTexCoord')
    bb = N.new('ShaderNodeAttribute'); bb.attribute_type = 'OBJECT'; bb.attribute_name = 'kfb_clay_bbox'
    sd = N.new('ShaderNodeAttribute'); sd.attribute_type = 'OBJECT'; sd.attribute_name = 'kfb_clay_seed'
    m1 = N.new('ShaderNodeVectorMath'); m1.operation = 'MULTIPLY'          # generated (0..1) * bbox (m) = rest metres
    L.new(tc.outputs['Generated'], m1.inputs[0]); L.new(bb.outputs['Vector'], m1.inputs[1])
    a1 = N.new('ShaderNodeVectorMath'); a1.operation = 'ADD'               # + seed offset
    L.new(m1.outputs[0], a1.inputs[0]); L.new(sd.outputs['Vector'], a1.inputs[1])
    sc = N.new('ShaderNodeVectorMath'); sc.operation = 'SCALE'             # * tiles per metre
    L.new(a1.outputs[0], sc.inputs[0]); L.new(gi.outputs['Scale'], sc.inputs['Scale'])
    def tex(name):
        t = N.new('ShaderNodeTexImage'); t.image = img(name); t.projection = 'BOX'; t.projection_blend = 0.3
        L.new(sc.outputs[0], t.inputs['Vector']); return t
    t_m = tex('clay1_mottle.png'); t_r = tex('clay1_roughness.png'); t_ao = tex('clay1_ao.png')
    # colour: base * (1 + mottle*2*(m-0.5)) * mix(1, ao, AO)
    s1 = N.new('ShaderNodeMath'); s1.operation = 'SUBTRACT'; s1.inputs[1].default_value = 0.5
    L.new(t_m.outputs['Color'], s1.inputs[0])
    s2 = N.new('ShaderNodeMath'); s2.operation = 'MULTIPLY_ADD'           # (m-0.5)*(2*mottle)+1
    k = N.new('ShaderNodeMath'); k.operation = 'MULTIPLY'; k.inputs[1].default_value = 2.0
    L.new(gi.outputs['Mottle'], k.inputs[0])
    L.new(s1.outputs[0], s2.inputs[0]); L.new(k.outputs[0], s2.inputs[1]); s2.inputs[2].default_value = 1.0
    ao = N.new('ShaderNodeMix'); ao.data_type = 'FLOAT'
    L.new(gi.outputs['AO'], ao.inputs['Factor']); ao.inputs['A'].default_value = 1.0; L.new(t_ao.outputs['Color'], ao.inputs['B'])
    v = N.new('ShaderNodeMath'); v.operation = 'MULTIPLY'
    L.new(s2.outputs[0], v.inputs[0]); L.new(ao.outputs['Result'], v.inputs[1])
    col = N.new('ShaderNodeVectorMath'); col.operation = 'SCALE'
    L.new(gi.outputs['Base Color'], col.inputs[0]); L.new(v.outputs[0], col.inputs['Scale'])
    # roughness: texture range -> [min, max]
    mr = N.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = 0.725; mr.inputs['From Max'].default_value = 0.906
    L.new(t_r.outputs['Color'], mr.inputs['Value']); L.new(gi.outputs['Rough Min'], mr.inputs['To Min']); L.new(gi.outputs['Rough Max'], mr.inputs['To Max'])
    # relief: meso noise bump -> micro texture bump (Bump has a Normal input: valid chain)
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Detail'].default_value = 2.0; nz.inputs['Roughness'].default_value = 0.45
    L.new(a1.outputs[0], nz.inputs['Vector']); L.new(gi.outputs['Meso Scale'], nz.inputs['Scale'])
    b1 = N.new('ShaderNodeBump'); b1.inputs['Distance'].default_value = 0.02
    L.new(gi.outputs['Meso'], b1.inputs['Strength']); L.new(nz.outputs['Fac'], b1.inputs['Height'])
    b2 = N.new('ShaderNodeBump'); b2.inputs['Distance'].default_value = 0.005
    L.new(gi.outputs['Micro'], b2.inputs['Strength']); L.new(t_m.outputs['Color'], b2.inputs['Height']); L.new(b1.outputs['Normal'], b2.inputs['Normal'])
    bs = N.new('ShaderNodeBsdfPrincipled')
    L.new(col.outputs[0], bs.inputs['Base Color']); L.new(mr.outputs['Result'], bs.inputs['Roughness']); L.new(b2.outputs['Normal'], bs.inputs['Normal'])
    bs.inputs['Specular IOR Level'].default_value = 0.35
    L.new(bs.outputs[0], go.inputs['BSDF'])
    for i, n in enumerate(N):
        n.location = (i * 180 - 1600, (i % 5) * -220)
    return g


def clay_material(src):
    name = src.name + '_CLAY'
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial'); gn = nt.nodes.new('ShaderNodeGroup'); gn.node_tree = bpy.data.node_groups[GROUP]
    b = [n for n in src.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    gn.inputs['Base Color'].default_value = b.inputs['Base Color'].default_value
    nt.links.new(gn.outputs['BSDF'], out.inputs['Surface'])
    gn.location = (-250, 0)
    m['kfb_clay_material'] = 'kfb.clay-material/0.1 · tier T1/T2 · CALIBRATION START'
    m['kfb_clay_source'] = src.name
    return m


sc = bpy.data.scenes[SCENE]
build_group()
report = {}
if globals().get('CLAY_APPLY', True):
    for o in sc.objects:
        if o.type != 'MESH':
            continue
        for i, slot in enumerate(o.material_slots):
            src = slot.material
            base = src.get('kfb_clay_source') and bpy.data.materials.get(src['kfb_clay_source']) if src else None
            src = base or src
            if src and src.name in SKIN:
                cm = clay_material(src)
                o.material_slots[i].material = cm
                if 'kfb_clay_seed' not in o:
                    rnd = random.Random(hash(o.name) & 0xffff)
                    o['kfb_clay_seed'] = [rnd.uniform(0, 10) for _ in range(3)]
                # rest-pose bbox in metres (object data, undeformed)
                vs = [v.co for v in o.data.vertices]
                o['kfb_clay_bbox'] = [max(v[a] for v in vs) - min(v[a] for v in vs) for a in range(3)]
                report[o.name] = cm.name
result = dict(group=GROUP, applied=report, tex=TEX, par=PAR)
