import bpy, numpy as np, math, json
from mathutils import Vector, Matrix
bpy.ops.wm.open_mainfile(filepath='/tmp/an1/AN_PERF_01.blend')   # read only, never saved
keep={'Rig_Brute','Rig_Raider'}
for o in list(bpy.data.objects):
    if not (o.name in keep or (o.parent and o.parent.name in keep)): bpy.data.objects.remove(o)
for o in bpy.data.objects: o.hide_render=False; o.hide_viewport=False
def imp(path):
    before=set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=path); return [o for o in bpy.data.objects if o not in before]
def group(objs,name):
    e=bpy.data.objects.new(name,None); bpy.context.scene.collection.objects.link(e)
    for o in objs:
        if o.parent is None: o.parent=e
    return e
def meshes_of(root):
    out=[]; st=[root]
    while st:
        o=st.pop(); st+=list(o.children)
        if o.type=='MESH' and not o.hide_render: out.append(o)
    return out
def bounds(root):
    bpy.context.view_layer.update(); dg=bpy.context.evaluated_depsgraph_get(); P=[]
    for o in meshes_of(root):
        e=o.evaluated_get(dg); me=e.to_mesh(); a=np.empty(len(me.vertices)*3); me.vertices.foreach_get('co',a); a=a.reshape(-1,3)
        mw=np.array(e.matrix_world); P.append(a@mw[:3,:3].T+mw[:3,3]); e.to_mesh_clear()
    P=np.concatenate(P); return P.min(0),P.max(0)
def mat(n,hexc,a=1):
    c=tuple(int(hexc[i:i+2],16)/255 for i in (1,3,5)); m=bpy.data.materials.new(n); m.diffuse_color=(*[x**2.2 for x in c],a); return m
def paint(root,m,skip=()):
    for o in meshes_of(root):
        if any(s in o.name for s in skip): continue
        o.data.materials.clear(); o.data.materials.append(m)
# sources
brute=bpy.data.objects['Rig_Brute']; raider=bpy.data.objects['Rig_Raider']
fb=group([o for o in imp('/tmp/fbr/FB_TEMPLATE_LOOK_v5b.glb') if o.name not in('Icosphere',)],'FB')
for n in ('Grid','FB_Mouth_Smile'):
    for o in bpy.data.objects:
        if o.name.startswith(n): o.hide_render=True
orc=group(imp('/tmp/kr4/media/3D_Assets/KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcB.gltf'),'orcB')
car=group(imp('/tmp/veh/kfb_glb/KFB_CVP1_sedan.glb'),'car')
paint(brute,mat('br','#6f9a52')); paint(raider,mat('ra','#7fae5c')); paint(fb,mat('fb','#f2c93c'),skip=('Eye',)); paint(orc,mat('orc','#8fbf6a'))
H={}
for k,o in (('brute',brute),('raider',raider),('fb',fb),('orcB',orc),('car',car)):
    lo,hi=bounds(o); H[k]=dict(lo=lo.tolist(),hi=hi.tolist())
f=1.5/(H['raider']['hi'][2]-H['raider']['lo'][2])
print('factor',f,json.dumps({k:round(v['hi'][2]-v['lo'][2],3) for k,v in H.items()}))
sc=bpy.context.scene; sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='MATERIAL'; sh.show_cavity=True
sc.render.film_transparent=True; PPM=100; W,Hm=17.0,5.0
sc.render.resolution_x=int(W*PPM); sc.render.resolution_y=int(Hm*PPM)
ims=sc.render.image_settings
if hasattr(ims,'media_type'): ims.media_type='IMAGE'
ims.file_format='PNG'; ims.color_mode='RGBA'
cam=bpy.data.objects.new('cam',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam
cam.data.type='ORTHO'; cam.data.ortho_scale=W; cam.location=(W/2-0.5,-30,Hm/2-0.3); cam.rotation_euler=(math.pi/2,0,0)
car.rotation_euler=(0,0,-math.pi/2)
ROWS={'A':{'brute':f,'raider':f,'fb':f,'orcB':f,'car':1.8*f},'B':{'brute':2.0/4.041,'raider':f,'fb':f,'orcB':1.0/2.046,'car':1.8*f}}
OBJ={'brute':brute,'raider':raider,'fb':fb,'orcB':orc,'car':car}
OUT={}
for row,S in ROWS.items():
    x=0.0; OUT[row]={}
    for k in ('brute','raider','fb','orcB','car'):
        o=OBJ[k]; o.scale=(S[k],)*3; o.location=(0,0,0); lo,hi=bounds(o)
        o.location=(x-lo[0],-(lo[1]+hi[1])/2,-lo[2]); lo2,hi2=bounds(o)
        OUT[row][k]=dict(x0=float(lo2[0]),x1=float(hi2[0]),h=float(hi2[2]-lo2[2]),scale=S[k]); x=hi2[0]+0.6
    sc.render.filepath=f'/tmp/veh/scale/row_{row}.png'; bpy.ops.render.render(write_still=True)
# FB body height without ears in metres
fbh=[o for o in meshes_of(fb)]
json.dump(dict(factor=f,camX=W/2-0.5,camZ=Hm/2-0.3,PPM=PPM,W=W,H=Hm,rows=OUT),open('/tmp/veh/scale/lineup.json','w'),indent=1)
print(json.dumps(OUT))
