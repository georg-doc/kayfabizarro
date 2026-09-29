# proof sheet: auto-staged combos at the attacker's contact frame, rows = rig pairings, columns = combos
exec(open('/tmp/fs1/common.py').read())
M=json.load(open('/tmp/fs1/out/measure2.json')); ST=json.load(open('/tmp/fs1/out/stage.json'))
CORR=open_ws(); sc=bpy.context.scene
sc.render.engine='BLENDER_WORKBENCH'; sc.display.shading.light='STUDIO'; sc.display.shading.color_type='TEXTURE'
sc.render.resolution_x=320; sc.render.resolution_y=260; sc.render.resolution_percentage=100
ims=sc.render.image_settings
if hasattr(ims,'media_type'): ims.media_type='IMAGE'
ims.file_format='PNG'; ims.color_mode='RGB'
cam=bpy.data.objects['ml_cam']; sc.camera=cam; cam.data.lens=50
fl=bpy.data.objects['ml_floor']; fl.scale=(40,40,1); fl.location=(0,0,0)
# second copies of both rigs so a rig can fight itself
COPY={}
for rig,tn in RIGS.items():
    T=bpy.data.objects[tn]; T2=T.copy(); T2.name=tn+'_B'; sc.collection.objects.link(T2)
    for ch in T.children:
        c2=ch.copy(); c2.parent=T2; sc.collection.objects.link(c2)
        for m in c2.modifiers:
            if m.type=='ARMATURE': m.object=T2
    COPY[rig]=T2
def pose_obj(ob,rig,W):
    T=bpy.data.objects[RIGS[rig]]
    if ob is not T:
        pose(rig,W,CORR)
        for pb in T.pose.bones:
            q=ob.pose.bones[pb.name]; q.rotation_mode='QUATERNION'; q.rotation_quaternion=pb.rotation_quaternion; q.location=pb.location
    else: pose(rig,W,CORR)
def rz(a): return Matrix.Rotation(a,4,'Z')

AG,VI='kfb_throw_shoulder_aggressor_a','kfb_throw_shoulder_victim_a'
PAIRS=[('Rig_Medium','Rig_Medium'),('Rig_Medium','Rig_Large'),('Rig_Large','Rig_Medium'),('Rig_Large','Rig_Large')]
rows=[]
for f in (41,61,81,121):
    tiles=[]
    for ra,rb in PAIRS:
        OA=bpy.data.objects[RIGS[ra]]; OB=COPY[rb] if ra==rb else bpy.data.objects[RIGS[rb]]
        for o in bpy.data.objects:
            if o.type in ('ARMATURE','MESH') and o.name!='ml_floor':
                root=o if o.type=='ARMATURE' else o.parent; o.hide_render=root not in (OA,OB)
        pose_obj(OB,rb,frames(rb,VI)[f-1]); pose_obj(OA,ra,frames(ra,AG)[f-1])
        OA.matrix_world=Matrix.Identity(4); OB.matrix_world=Matrix.Identity(4); bpy.context.view_layer.update()
        dg=bpy.context.evaluated_depsgraph_get(); P=[]
        for o in bpy.data.objects:
            if o.type=='MESH' and not o.hide_render and o.name!='ml_floor':
                e=o.evaluated_get(dg); me=e.to_mesh(); a3=np.empty(len(me.vertices)*3); me.vertices.foreach_get('co',a3)
                a3=a3.reshape(-1,3); mw=np.array(e.matrix_world); P.append(a3@mw[:3,:3].T+mw[:3,3]); e.to_mesh_clear()
        P=np.vstack(P); lo,hi=P.min(0),P.max(0); ctr=Vector(((lo+hi)/2).tolist())
        size=max((hi[0]-lo[0])/1.23,hi[2]-lo[2])*1.2; d=size/(2*math.tan(math.radians(15.5)))
        cam.location=ctr+Vector((0,-d,size*0.12)); cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(ctr-cam.location).to_track_quat('-Z','Y')
        p='/tmp/fs1/_t.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
        im=bpy.data.images.load(p,check_existing=False); t=np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4); bpy.data.images.remove(im); tiles.append(t)
    rows.append(np.concatenate(tiles,axis=1))
full=np.concatenate(rows[::-1],axis=0); Hh,Ww=full.shape[:2]
img=bpy.data.images.new('s',Ww,Hh); img.pixels.foreach_set(full.ravel()); img.filepath_raw='/tmp/fs1/out/proof_shoulder_throw.png'; img.file_format='PNG'; img.save(); print('OK')
