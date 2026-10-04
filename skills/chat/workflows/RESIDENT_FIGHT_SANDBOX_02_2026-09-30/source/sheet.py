exec(open('/tmp/fs1/proof.py').read().split("COMBOS=")[0])
R=json.load(open('/tmp/fs2/react.json'))
sc.render.resolution_x=240; sc.render.resolution_y=200
OA=bpy.data.objects['Rig_Raider']
for o in bpy.data.objects:
    if o.type in ('ARMATURE','MESH') and o.name!='ml_floor':
        root=o if o.type=='ARMATURE' else o.parent; o.hide_render=root is not OA
# red cone = own facing at frame 1, placed in front of the start position
bpy.ops.mesh.primitive_cone_add(radius1=0.12,depth=0.35); cone=bpy.context.active_object
m=bpy.data.materials.new('r'); m.diffuse_color=(1,0,0,1); cone.data.materials.append(m)
sc.display.shading.color_type='MATERIAL'
rows=[]
for rid,x in R.items():
    G=frames('Rig_Medium',rid); n=len(G); fi=x['impactFrame']
    lr=G[0]['upperleg.l'].translation-G[0]['upperleg.r'].translation; f=Vector((lr.y,-lr.x,0)).normalized()
    h0=G[0]['hips'].translation; cone.location=Vector((h0.x,h0.y,0.05))+f*0.55; cone.rotation_euler=(0,0,0)
    cone.rotation_mode='QUATERNION'; cone.rotation_quaternion=f.to_track_quat('Z','Y')
    side=Vector((-f.y,f.x,0))   # character's left
    tiles=[]
    for fr in (1,fi,min(n,fi+12),n):
        pose_obj(OA,'Rig_Medium',G[fr-1]); OA.matrix_world=Matrix.Identity(4); bpy.context.view_layer.update()
        ctr=Vector((h0.x,h0.y,0.6))+f*0.3
        cam.location=ctr-side*5.2+Vector((0,0,1.6)); cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(ctr-cam.location).to_track_quat('-Z','Y')
        p='/tmp/fs2/_t.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
        im=bpy.data.images.load(p,check_existing=False); tiles.append(np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4)); bpy.data.images.remove(im)
    rows.append(np.concatenate(tiles,axis=1)); print(rid,flush=True)
full=np.concatenate(rows[::-1],axis=0)
img=bpy.data.images.new('s',full.shape[1],full.shape[0]); img.pixels.foreach_set(full.ravel()); img.filepath_raw='/tmp/fs2/reactions_side.png'; img.file_format='PNG'; img.save(); print('OK')
