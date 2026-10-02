import bpy
LITE_A='/tmp/hex/work/mat/lite_A.png'; LITE_B='/tmp/hex/work/mat/lite_B.png'
SCALE=0.62; BUMP=0.42; COLOR=0.22; ROUGH=0.55
def _img(p):
    im=bpy.data.images.get(p.split('/')[-1]) or bpy.data.images.load(p,check_existing=True)
    im.colorspace_settings.name='Non-Color'; return im
def apply_clay_lite(mat, world_scale=1.0):
    nt=mat.node_tree; N=nt.nodes; L=nt.links
    bs=next(n for n in N if n.type=='BSDF_PRINCIPLED')
    tc=N.new('ShaderNodeTexCoord')
    sc=N.new('ShaderNodeVectorMath'); sc.operation='SCALE'; sc.inputs['Scale'].default_value=world_scale*SCALE
    L.new(tc.outputs['Object'],sc.inputs[0])
    sep=N.new('ShaderNodeSeparateXYZ'); L.new(sc.outputs[0],sep.inputs[0])
    # triplanar weights from object-space normal: |n|^4 normalised (Blender z-up: glTF y == Blender z)
    nsep=N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Normal'],nsep.inputs[0])
    w=[]
    for ax in ('X','Y','Z'):
        a=N.new('ShaderNodeMath'); a.operation='ABSOLUTE'; L.new(nsep.outputs[ax],a.inputs[0])
        p=N.new('ShaderNodeMath'); p.operation='POWER'; p.inputs[1].default_value=4.0; L.new(a.outputs[0],p.inputs[0]); w.append(p)
    s1=N.new('ShaderNodeMath'); s1.operation='ADD'; L.new(w[0].outputs[0],s1.inputs[0]); L.new(w[1].outputs[0],s1.inputs[1])
    s2=N.new('ShaderNodeMath'); s2.operation='ADD'; L.new(s1.outputs[0],s2.inputs[0]); L.new(w[2].outputs[0],s2.inputs[1])
    s2m=N.new('ShaderNodeMath'); s2m.operation='MAXIMUM'; s2m.inputs[1].default_value=1e-5; L.new(s2.outputs[0],s2m.inputs[0])
    wn=[]
    for p in w:
        d=N.new('ShaderNodeMath'); d.operation='DIVIDE'; L.new(p.outputs[0],d.inputs[0]); L.new(s2m.outputs[0],d.inputs[1]); wn.append(d)
    # planes: x-dominant -> (y,z) ; y-dominant -> (x,z) ; z-dominant -> (x,y)   (Blender axes; equivalent to three zy/xz/xy up to axis naming)
    planes=[('Y','Z'),('X','Z'),('X','Y')]
    def sample(path):
        acc=None
        for (u,v),wt in zip(planes,wn):
            cx=N.new('ShaderNodeCombineXYZ'); L.new(sep.outputs[u],cx.inputs[0]); L.new(sep.outputs[v],cx.inputs[1])
            t=N.new('ShaderNodeTexImage'); t.image=_img(path); t.extension='REPEAT'; t.interpolation='Linear'
            L.new(cx.outputs[0],t.inputs[0])
            m=N.new('ShaderNodeMath'); m.operation='MULTIPLY'; L.new(t.outputs['Color'],m.inputs[0]); L.new(wt.outputs[0],m.inputs[1])
            if acc is None: acc=m
            else:
                a=N.new('ShaderNodeMath'); a.operation='ADD'; L.new(acc.outputs[0],a.inputs[0]); L.new(m.outputs[0],a.inputs[1]); acc=a
        return acc
    A=sample(LITE_A); B=sample(LITE_B)
    # colour: base *= clamp(1 + (A-0.5)*2*COLOR, 0.72, 1.28)
    f1=N.new('ShaderNodeMath'); f1.operation='MULTIPLY_ADD'; L.new(A.outputs[0],f1.inputs[0]); f1.inputs[1].default_value=2*COLOR; f1.inputs[2].default_value=1-COLOR
    f2=N.new('ShaderNodeClamp'); f2.inputs['Min'].default_value=0.72; f2.inputs['Max'].default_value=1.28; L.new(f1.outputs[0],f2.inputs[0])
    bc=bs.inputs['Base Color']
    mul=N.new('ShaderNodeVectorMath'); mul.operation='SCALE'; L.new(f2.outputs[0],mul.inputs['Scale'])
    if bc.is_linked:
        src=bc.links[0].from_socket; L.new(src,mul.inputs[0])
    else:
        mul.inputs[0].default_value=bc.default_value[:3]
    L.new(mul.outputs[0],bc)
    # roughness: clamp(mix(r, B, ROUGH), .25, 1)
    rs=bs.inputs['Roughness']
    mx=N.new('ShaderNodeMix'); mx.data_type='FLOAT'; mx.inputs['Factor'].default_value=ROUGH
    if rs.is_linked: L.new(rs.links[0].from_socket,mx.inputs['A'])
    else: mx.inputs['A'].default_value=rs.default_value
    L.new(B.outputs[0],mx.inputs['B'])
    rc=N.new('ShaderNodeClamp'); rc.inputs['Min'].default_value=0.25; rc.inputs['Max'].default_value=1.0; L.new(mx.outputs[0],rc.inputs[0]); L.new(rc.outputs[0],rs)
    # relief: bump from the value channel (A is linear in donor luminance; JS uses its gradient)
    bump=N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value=1.0
    bump.inputs['Distance'].default_value=0.1886/(0.188*512*SCALE*world_scale)
    L.new(A.outputs[0],bump.inputs['Height'])
    if bs.inputs['Normal'].is_linked: L.new(bs.inputs['Normal'].links[0].from_socket,bump.inputs['Normal'])
    L.new(bump.outputs['Normal'],bs.inputs['Normal'])
    mat['kfb_clay_lite']=f'clay_floor_001 512 · ws {world_scale}'
    return mat
