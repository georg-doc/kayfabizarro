exec(open('/tmp/fs1/proof.py').read().split("COMBOS=")[0])
from mathutils import Quaternion
sc.display.shading.color_type='MATERIAL'
rig='Rig_Medium'; O=bpy.data.objects[RIGS[rig]]
for o in bpy.data.objects:
    if o.type in ('ARMATURE','MESH') and o.name!='ml_floor':
        root=o if o.type=='ARMATURE' else o.parent; o.hide_render=root!=O
def V():
    dg=bpy.context.evaluated_depsgraph_get(); out={}
    for o in bpy.data.objects:
        if o.type=='MESH' and o.parent==O:
            e=o.evaluated_get(dg); me=e.to_mesh(); a=np.array([e.matrix_world@v.co for v in me.vertices]); out[o.name]=a; e.to_mesh_clear()
    return out
tiles=[]
for cid,ang in [('kfb_reaction_standing_death_left_01_a',60),('kfb_reaction_fall_flat_a',-60)]:
    for mode in ('full','body','tuck'):
        W=frames(rig,cid)[-1]; pose_obj(O,rig,W); h=W['hips'].translation; O.matrix_world=Matrix.Translation(Vector((-h.x,-h.y,0)))
        pb=O.pose.bones['head']
        if mode=='tuck': pb.rotation_quaternion=pb.rotation_quaternion@Quaternion((1,0,0),math.radians(ang))
        bpy.context.view_layer.update(); v=V()
        allmin=min(a[:,2].min() for a in v.values()); body=min(a[:,2].min() for k,a in v.items() if not k.endswith('Head'))
        lift=-allmin if mode in ('full','tuck') else -body
        if mode=='tuck': lift=-allmin
        O.matrix_world=Matrix.Translation(Vector((-h.x,-h.y,lift-0.03))); bpy.context.view_layer.update()
        hp=(O.matrix_world@O.pose.bones['hips'].head); hd=(O.matrix_world@O.pose.bones['head'].head); ax=(hd-hp); ax.z=0; ax.normalize(); perp=Vector((-ax.y,ax.x,0))
        ctr=(hp+hd)/2; ctr.z=0.45; cam.location=ctr+perp*5.2+Vector((0,0,0.9)); cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(ctr-cam.location).to_track_quat('-Z','Y')
        p='/tmp/fs3/_t.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
        im=bpy.data.images.load(p,check_existing=False); tiles.append(np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4)); bpy.data.images.remove(im)
        print(cid,mode,round(lift,3),flush=True)
r1=np.concatenate(tiles[:3],axis=1); r2=np.concatenate(tiles[3:],axis=1); full=np.concatenate([r2,r1],axis=0)
img=bpy.data.images.new('s',full.shape[1],full.shape[0]); img.pixels.foreach_set(full.ravel()); img.filepath_raw='/tmp/fs3/lying_options.png'; img.file_format='PNG'; img.save(); print('OK')
