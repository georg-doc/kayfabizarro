import bpy,bmesh,math
bpy.ops.wm.read_factory_settings(use_empty=True)
H=0.14*2.29  # 0.14 figure heights (Hero Man 2.29)
bpy.ops.mesh.primitive_cube_add(size=H); c=bpy.context.active_object; c.name='KFB_Die'
bev=c.modifiers.new('b','BEVEL'); bev.width=H*0.12; bev.segments=4
bpy.ops.object.modifier_apply(modifier='b')
white=bpy.data.materials.new('die_white'); white.use_nodes=True; white.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(0.93,0.92,0.88,1); white.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=0.6
ink=bpy.data.materials.new('die_pip_1f1a14'); ink.use_nodes=True; ink.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(0.0137,0.0103,0.0070,1); ink.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=0.9
c.data.materials.append(white)
h=H/2; r=H*0.09; o=H*0.25
P={1:[(0,0)],2:[(-o,-o),(o,o)],3:[(-o,-o),(0,0),(o,o)],4:[(-o,-o),(o,-o),(-o,o),(o,o)],5:[(-o,-o),(o,-o),(0,0),(-o,o),(o,o)],6:[(-o,-o),(-o,0),(-o,o),(o,-o),(o,0),(o,o)]}
# faces: +Z=1, -Z=6, +X=2, -X=5, +Y=3, -Y=4  (opposites sum 7)
F={1:((0,0,1),'xy'),6:((0,0,-1),'xy'),2:((1,0,0),'yz'),5:((-1,0,0),'yz'),3:((0,1,0),'xz'),4:((0,-1,0),'xz')}
pips=[]
for n,(nrm,pl) in F.items():
    for a,b in P[n]:
        if pl=='xy': loc=(a,b,nrm[2]*h)
        elif pl=='yz': loc=(nrm[0]*h,a,b)
        else: loc=(a,nrm[1]*h,b)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=r,location=loc,segments=12,ring_count=6)
        s=bpy.context.active_object; s.scale=[0.35 if abs(v)>0 else 1 for v in nrm]; s.data.materials.append(ink); pips.append(s)
bpy.ops.object.select_all(action='DESELECT')
for s in pips: s.select_set(True)
bpy.context.view_layer.objects.active=pips[0]; bpy.ops.object.join(); pp=bpy.context.active_object; pp.name='KFB_Die_Pips'; pp.parent=c
bpy.ops.export_scene.gltf(filepath='/tmp/bd/KFB_Die_Arena_KFB.glb',export_format='GLB')
print('die',H)
