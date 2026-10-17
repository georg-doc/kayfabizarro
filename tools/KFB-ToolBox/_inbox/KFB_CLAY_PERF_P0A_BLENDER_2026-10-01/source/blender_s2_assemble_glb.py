import bpy, json, math, struct
OUT='/tmp/p0a/out'; W='/tmp/p0a/work'
bpy.ops.wm.open_mainfile(filepath=W+'/p0a_stage1.blend')
sc=bpy.context.scene; col=bpy.data.collections['KFB_CLAY_BAKE_P0A']
old=bpy.data.objects['building_A__kfb_clay_p0a']; old.name='building_A__kfb_clay_p0a_lowpoly_uv'; old.hide_render=True; old.hide_set(True)
before=set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=W+'/building_A__soft.glb')
new=[o for o in bpy.data.objects if o not in before and o.type=='MESH'][0]
for c in list(new.users_collection): c.objects.unlink(new)
col.objects.link(new); new.name='building_A__kfb_clay_p0a'
me=new.data; print('UVS',[u.name for u in me.uv_layers])
me.uv_layers[0].name='UVMap'; me.uv_layers[1].name='KFB_CLAY_UV'
me.materials.clear()
m=bpy.data.materials.new('kfb_clay_k2_baked_p0a'); m.use_nodes=True; nt=m.node_tree; N=nt.nodes; L=nt.links
bsdf=N['Principled BSDF']
src_img=bpy.data.images.load('/tmp/p0a/src/donor/citybits_texture.png'); src_img.name='citybits_texture'
nimg=bpy.data.images.load(OUT+'/building_A__kfb-clay-k2-normal-v1.png'); nimg.colorspace_settings.name='Non-Color'
rimg=bpy.data.images.load(OUT+'/building_A__kfb-clay-k2-roughness-v1.png'); rimg.colorspace_settings.name='Non-Color'
def uvn(name):
  u=N.new('ShaderNodeUVMap'); u.uv_map=name; return u
tb=N.new('ShaderNodeTexImage'); tb.image=src_img; L.new(uvn('UVMap').outputs[0],tb.inputs[0]); L.new(tb.outputs[0],bsdf.inputs['Base Color'])
tn=N.new('ShaderNodeTexImage'); tn.image=nimg; L.new(uvn('KFB_CLAY_UV').outputs[0],tn.inputs[0])
nm=N.new('ShaderNodeNormalMap'); nm.space='TANGENT'; nm.uv_map='KFB_CLAY_UV'; L.new(tn.outputs[0],nm.inputs['Color']); L.new(nm.outputs[0],bsdf.inputs['Normal'])
tr=N.new('ShaderNodeTexImage'); tr.image=rimg; L.new(uvn('KFB_CLAY_UV').outputs[0],tr.inputs[0])
sp=N.new('ShaderNodeSeparateColor'); L.new(tr.outputs[0],sp.inputs[0]); L.new(sp.outputs['Green'],bsdf.inputs['Roughness'])
bsdf.inputs['Metallic'].default_value=0.0
bsdf.inputs['Sheen Weight'].default_value=1.0; bsdf.inputs['Sheen Roughness'].default_value=0.85
def lin(c): return ((c/255+0.055)/1.055)**2.4 if c/255>0.04045 else c/255/12.92
bsdf.inputs['Sheen Tint'].default_value=(0.12*lin(0xff),0.12*lin(0xf1),0.12*lin(0xe0),1)  # three v10: sheen 0.12 x #fff1e0
m.use_backface_culling=True
me.name='building_A__kfb_clay_p0a'
me.materials.append(m)
for o in bpy.context.view_layer.objects: o.select_set(o==new)
bpy.context.view_layer.objects.active=new
bpy.ops.wm.save_as_mainfile(filepath=OUT+'/source/building_A__kfb-clay-k2-baked-p0a.blend', compress=True)
bpy.ops.export_scene.gltf(filepath=OUT+'/building_A__kfb-clay-k2-baked-p0a.glb', export_format='GLB', use_selection=True, export_texcoords=True, export_normals=True, export_tangents=False, export_materials='EXPORT', export_image_format='AUTO', export_yup=True)
print('EXPORTED')
