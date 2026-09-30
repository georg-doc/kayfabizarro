exec(open('/tmp/fs1/proof.py').read().split("COMBOS=")[0])
T=json.load(open('/tmp/fs3/prop_table.json')); K=json.load(open('/tmp/fs2/knock.json'))
bpy.ops.import_scene.gltf(filepath='/home/claude/kfbhub/media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/clown_hammer.gltf')
hm=[o for o in bpy.context.selected_objects if o.type=='MESH'][0]
mh=bpy.data.materials.new('h'); mh.diffuse_color=(1,0.2,0.2,1); hm.data.materials.clear(); hm.data.materials.append(mh)
bpy.ops.mesh.primitive_uv_sphere_add(radius=1); puff=bpy.context.active_object
m=bpy.data.materials.new('o'); m.diffuse_color=(1,0.55,0.1,1); puff.data.materials.append(m)
sc.display.shading.color_type='MATERIAL'
Cinv=Matrix.Rotation(math.pi/2,4,'X').inverted()
AT='kfb_action_sword_and_shield_attack_a'; IDLE='kfb_action_boxing_a'
tiles=[]
for ra,rb in [('Rig_Medium','Rig_Medium'),('Rig_Medium','Rig_Large'),('Rig_Large','Rig_Medium'),('Rig_Large','Rig_Large')]:
    t=T[f'{AT}|{ra}|{rb}']; sA=1 if ra=='Rig_Medium' else 2.568
    OA=bpy.data.objects[RIGS[ra]]; OB=COPY[rb] if ra==rb else bpy.data.objects[RIGS[rb]]
    for o in bpy.data.objects:
        if o.type in ('ARMATURE','MESH') and o.name not in ('ml_floor',puff.name,hm.name):
            root=o if o.type=='ARMATURE' else o.parent; o.hide_render=root not in (OA,OB)
    WB=frames(rb,IDLE)[0]; pose_obj(OB,rb,WB)
    WA=frames(ra,AT)[t['contactFrame']-1]; pose_obj(OA,ra,WA); OA.matrix_world=Matrix.Identity(4)
    G=WA['handslot.r']; hm.matrix_world=Matrix.Translation(G.translation)@G.to_3x3().normalized().to_4x4()@Matrix.Scale(sA,4)@Cinv
    ax=math.radians(t['attackAxisYawDeg']); ha=WA['hips'].translation
    tgt=Vector((ha.x+math.cos(ax)*t['hipsDistanceM'],ha.y+math.sin(ax)*t['hipsDistanceM'],0)); hb=WB['hips'].translation
    OB.matrix_world=Matrix.Translation(tgt)@Matrix.Rotation(math.radians(t['defenderStanceYawDeg']),4,'Z')@Matrix.Translation(Vector((-hb.x,-hb.y,0)))
    sz=0.12*(2.568 if 'Large' in rb else 1.0); puff.scale=(sz,sz,sz); puff.location=Vector(t['impactPuffAt'])
    bpy.context.view_layer.update()
    print('DBG',ra,rb,'hand',[round(x,3) for x in (OA.matrix_world@OA.pose.bones['handslot.r'].matrix).translation],'G',[round(x,3) for x in G.translation],'hmOrigin',[round(x,3) for x in hm.matrix_world.translation],'OAhips',[round(x,3) for x in (OA.matrix_world@OA.pose.bones['hips'].matrix).translation],'OBhips',[round(x,3) for x in (OB.matrix_world@OB.pose.bones['hips'].matrix).translation],OA.name,OB.name,flush=True)
    ctr=(ha+tgt)/2; ctr.z=1.2*max(sA,2.568 if 'Large' in rb else 1)
    perp=Vector((-math.sin(ax),math.cos(ax),0)); size=(t['hipsDistanceM']+2.5*max(sA,1))*1.1
    cam.location=ctr+perp*size*1.9+Vector((0,0,size*0.15)); cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(ctr-cam.location).to_track_quat('-Z','Y')
    p='/tmp/fs3/_t.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
    im=bpy.data.images.load(p,check_existing=False); tiles.append(np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4)); bpy.data.images.remove(im)
full=np.concatenate(tiles,axis=1)
img=bpy.data.images.new('s',full.shape[1],full.shape[0]); img.pixels.foreach_set(full.ravel()); img.filepath_raw='/tmp/fs3/proof_prop_hit.png'; img.file_format='PNG'; img.save(); print('OK')
