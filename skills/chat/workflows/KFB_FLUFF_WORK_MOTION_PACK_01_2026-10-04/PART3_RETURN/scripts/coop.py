import bpy, math, sys, json, os, numpy as np
from mathutils import Vector, Matrix
C=json.loads(sys.argv[1]); R=float(sys.argv[2]); angs=json.loads(sys.argv[3]); actors=json.loads(sys.argv[4]); out=sys.argv[5]; tag=sys.argv[6]
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene; sc.render.fps=30
Cb=Vector((C[0],-C[2],C[1]))
rigs=[]
for i,(glb,ang,off) in enumerate(zip(actors,angs,[0,9,17])):
    before=set(sc.objects); bpy.ops.import_scene.gltf(filepath=glb,loglevel=50); new=[o for o in sc.objects if o not in before]
    arm=[o for o in new if o.type=='ARMATURE'][0]; tops=[o for o in new if o.parent is None]
    a=[v for k,v in bpy.data.actions.items() if k.startswith('kfb_fluff_roll_push_big_a')][-1]
    arm.animation_data_create(); arm.animation_data.action=None; tr=arm.animation_data.nla_tracks.new(); st=tr.strips.new('p',1,a)
    if a.slots: st.action_slot=a.slots[0]
    st.repeat=4; st.frame_start_ui=1-off
    M=Matrix.Translation(Cb)@Matrix.Rotation(math.radians(ang),4,'Z')@Matrix.Translation(-Cb)
    for o in tops: o.matrix_world=M@o.matrix_world
    rigs.append((arm,[o for o in new if o.type=='MESH']))
bpy.ops.mesh.primitive_plane_add(size=80); fl=bpy.context.active_object; m=bpy.data.materials.new('f'); m.diffuse_color=(0.80,0.78,0.74,1); fl.data.materials.append(m)
sys.path.insert(0,'/tmp/f3'); from knead import kneaded; ball=kneaded('fluff',11); ball.scale=(R,R,R); ball.location=Cb
mb=bpy.data.materials.new('b'); mb.diffuse_color=(0.55,0.41,0.78,1); ball.data.materials.append(mb)
sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='TEXTURE'; sh.show_shadows=True
sc.world=bpy.data.worlds.new('w'); sc.world.color=(0.93,0.91,0.86); sc.render.resolution_x=520; sc.render.resolution_y=420
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.type='ORTHO'; cam.data.ortho_scale=7.0
os.makedirs(out,exist_ok=True); rep=dict(minActorGap=[],minHandToBall=[])
def V(ms):
    dg=bpy.context.evaluated_depsgraph_get(); A=[]
    for o in ms:
        e=o.evaluated_get(dg); M=np.array(e.matrix_world); P=np.array([v.co for v in e.data.vertices])[::4]; A.append(P@M[:3,:3].T+M[:3,3])
    return np.concatenate(A)
for k,f in enumerate([1,8,15,22]):
    sc.frame_set(f); bpy.context.view_layer.update()
    vs=[V(ms) for _,ms in rigs]; g=1e9
    for i in range(len(vs)):
        for j in range(i+1,len(vs)):
            from scipy.spatial import cKDTree
            g=min(g,float(cKDTree(vs[i]).query(vs[j])[0].min()))
    rep['minActorGap'].append(round(g,3))
    for arm,_ in rigs:
        for sd in 'lr':
            p=arm.matrix_world@arm.pose.bones[f'handslot.{sd}'].head; rep['minHandToBall'].append(round((p-Cb).length-R,3))
    if k in (0,2):
        for nm,loc in (('q34',Vector((0,-6,3.4))),('top',Vector((0.01,-0.01,9))),('back',Vector((0,6,2.6)))):
            L=loc+Vector((Cb.x,Cb.y-0.6,0)); cam.location=L; cam.rotation_euler=(Vector((Cb.x,Cb.y-0.6,0.9))-L).to_track_quat('-Z','Y').to_euler()
            sc.render.filepath=f'{out}/{tag}__{nm}__{k}.png'; bpy.ops.render.render(write_still=True)
rep['minActorGap']=min(rep['minActorGap']); rep['handToBallRange']=[min(rep['minHandToBall']),max(rep['minHandToBall'])]; del rep['minHandToBall']
rep.update(angles=angs,R=R,ballCentreGltf=C); json.dump(rep,open(f'{out}/{tag}.json','w'),indent=1); print('REP',rep)
