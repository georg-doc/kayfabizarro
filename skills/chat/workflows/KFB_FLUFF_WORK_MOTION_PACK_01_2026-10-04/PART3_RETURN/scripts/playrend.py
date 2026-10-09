import bpy, math, sys, json, os, numpy as np
from mathutils import Vector
glb,jobs,scale,outdir,res=sys.argv[1],json.load(open(sys.argv[2])),float(sys.argv[3]),sys.argv[4],int(sys.argv[5])
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene; sc.render.fps=30
bpy.ops.import_scene.gltf(filepath=glb,loglevel=50)
arm=[o for o in sc.objects if o.type=='ARMATURE'][0]; meshes=[o for o in sc.objects if o.type=='MESH']
bpy.ops.mesh.primitive_plane_add(size=80); fl=bpy.context.active_object; m=bpy.data.materials.new('f'); m.diffuse_color=(0.80,0.78,0.74,1); fl.data.materials.append(m)
sys.path.insert(0,'/tmp/f3'); from knead import kneaded; ball=kneaded('fluff',11)
mb=bpy.data.materials.new('b'); mb.diffuse_color=(0.55,0.41,0.78,1); ball.data.materials.append(mb)
sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='TEXTURE'; sh.show_shadows=True
sc.world=bpy.data.worlds.new('w'); sc.world.color=(0.93,0.91,0.86)
sc.render.resolution_x=res; sc.render.resolution_y=res
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam
cam.data.type='ORTHO'
acts={a.name:a for a in bpy.data.actions}; os.makedirs(outdir,exist_ok=True); report={}
def g2b(p): return Vector((p[0],-p[2],p[1]))
def verts():
    dg=bpy.context.evaluated_depsgraph_get(); V=[]
    for o in meshes:
        e=o.evaluated_get(dg); M=np.array(e.matrix_world); P=np.array([v.co for v in e.data.vertices]); V.append(P@M[:3,:3].T+M[:3,3])
    return np.concatenate(V)
for j in jobs:
    clip=j['clip']; a=[v for k,v in acts.items() if k.startswith(clip)][0]
    arm.animation_data_create(); arm.animation_data.action=a
    if a.slots: arm.animation_data.action_slot=a.slots[0]
    f0=int(a.frame_range[0]); R=j['R']; ball.scale=(R,R,R)
    if j.get('topfit'):
        zmax=max(v.co.z for v in ball.data.vertices); ball.scale=(R,R,R*2/(zmax+1))   # kneaded lump: stretch so its top meets the feet (ball height 2R)
    if 'C' in j: C=np.array(g2b(j['C']))
    else:
        cf=f0+j['contactFrame']-1; sc.frame_set(cf); bpy.context.view_layer.update()
        P=np.array(arm.matrix_world@arm.pose.bones[j['part']].head); dv=np.array(g2b(j['hitDir'])); dv/=np.linalg.norm(dv)
        V=verts(); near=V[np.linalg.norm(V-P,axis=1)<j.get('near',0.5)*scale]
        ext=float(((near-P)@dv).max()) if len(near) else 0.0
        C=P+dv*(ext+R*0.92)            # ball just touching the body part's outer surface (slight press = contact)
        if j.get('ground'): C[2]=R
        if C[2]<R: C[2]=R   # never below the floor
    ball.location=Vector(C)
    report[clip]=dict(ballCentreBlender=[round(float(x),3) for x in C],ballCentreGltf=[round(float(C[0]),3),round(float(C[2]),3),round(float(-C[1]),3)],R=R)
    for k,f in enumerate(j['frames']):
        sc.frame_set(f0+f-1); bpy.context.view_layer.update()
        hp=arm.matrix_world@arm.pose.bones['hips'].head; mid=(hp+ball.location)/2
        cam.data.ortho_scale=j.get('ortho',3.6)*scale
        for nm,loc in j.get('views',{'side':[6,0,1.2],'q34':[3.2,-3.9,1.9]}).items():
            L=Vector(loc)*scale+Vector((mid.x,mid.y,0)); tgt=Vector((mid.x,mid.y,j.get('tz',0.95)*scale)); cam.location=L
            cam.rotation_euler=(tgt-L).to_track_quat('-Z','Y').to_euler()
            sc.render.filepath=f'{outdir}/{clip}__{nm}__{k:03d}.png'; bpy.ops.render.render(write_still=True)
json.dump(report,open(f'{outdir}/report.json','w'),indent=1)
