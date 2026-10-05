import bpy,sys,os,json,colorsys,numpy as np
from PIL import Image
KH='/tmp/x1/kh/'
PAL={'purple':'#8b68c7','yellow':'#f2b632','orange':'#ef5a22','green':'#1f7a3e','olive':'#cdc666','pink':'#b86384'}
def hx(h): return np.array([int(h[i:i+2],16) for i in (1,3,5)],float)
base=np.array(Image.open(KH+'Textures/colormap.png').convert('RGB')).astype(float)
def recolor(boxc,ribc,fn):
    im=base.copy(); r,g,b=im[...,0],im[...,1],im[...,2]
    lum=(0.3*r+0.59*g+0.11*b)/255
    white=(np.abs(r-g)<25)&(np.abs(g-b)<40)&(lum>0.65)
    red=(r>150)&(g<110)&(b<100)
    for mask,c,ref in ((white,hx(PAL[boxc]),0.95),(red,hx(PAL[ribc]),0.80)):
        shade=np.clip(lum/ref,0.6,1.15)[...,None]
        im[mask]=np.clip(c*shade,0,255)[mask]
    Image.fromarray(im.astype(np.uint8)).save(fn); return fn
combos=[('present-a-cube','purple','yellow'),('present-a-rectangle','green','pink'),('present-a-round','orange','purple'),
        ('present-b-cube','yellow','green'),('present-b-rectangle','pink','olive'),('present-b-round','olive','orange')]
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene
os.makedirs('/tmp/x2/props',exist_ok=True); info=[]
for i,(shape,bc,rc) in enumerate(combos):
    before=set(sc.objects); bpy.ops.import_scene.gltf(filepath=KH+shape+'.glb',loglevel=50); new=[o for o in sc.objects if o not in before]
    tex=recolor(bc,rc,f'/tmp/x2/props/{shape}_{bc}_{rc}.png')
    img=bpy.data.images.load(tex); img.pack()
    mat=bpy.data.materials.new(f'KFB_ClayGift_{bc}_{rc}'); mat.use_nodes=True; nt=mat.node_tree
    bsdf=nt.nodes['Principled BSDF']; bsdf.inputs['Roughness'].default_value=0.9; bsdf.inputs['Metallic'].default_value=0.0
    t=nt.nodes.new('ShaderNodeTexImage'); t.image=img; t.interpolation='Closest'; nt.links.new(t.outputs['Color'],bsdf.inputs['Base Color'])
    root=bpy.data.objects.new(f'gift_{shape}',None); sc.collection.objects.link(root); root.location=(i*0.9-2.25,0,0)
    for o in new:
        if o.type=='MESH':
            o.data.materials.clear(); o.data.materials.append(mat)
            o.name=('lid_' if o.name.startswith('lid') else 'box_')+shape
        if o.parent is None: o.parent=root
    info.append(dict(node=f'gift_{shape}',box=f'box_{shape}',lid=f'lid_{shape}',colours=[bc,rc],sizeM=None))
bpy.ops.export_scene.gltf(filepath='/tmp/x2/props/KFB_Gift_Presents_clay01.glb',export_format='GLB',export_image_format='AUTO',export_yup=True)
json.dump(info,open('/tmp/x2/props/presents.json','w'),indent=1); print('ok',len(info))
