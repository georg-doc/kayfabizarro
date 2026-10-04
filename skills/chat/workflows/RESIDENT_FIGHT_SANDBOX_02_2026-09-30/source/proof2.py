exec(open('/tmp/fs1/proof.py').read().split("COMBOS=")[0])
M=json.load(open('/tmp/fs1/out/measure2.json')); T=json.load(open('/tmp/fs2/table.json')); K=json.load(open('/tmp/fs2/knock.json'))
bpy.ops.mesh.primitive_uv_sphere_add(radius=1); puff=bpy.context.active_object
m=bpy.data.materials.new('o'); m.diffuse_color=(1,0.55,0.1,1); puff.data.materials.append(m)
sc.display.shading.color_type='MATERIAL'  # characters render in material colour; puff stands out
COMBOS=[('kfb_action_headbutt_a','kfb_reaction_taking_punch_a'),('kfb_action_kicking_a','kfb_reaction_standing_death_left_01_a'),
        ('kfb_action_flying_kick_a','kfb_reaction_receiving_an_uppercut_a'),('kfb_action_sword_and_shield_attack_a','kfb_reaction_reaction_a'),
        ('kfb_action_punching_b','kfb_reaction_taking_punch_a')]
PAIRS=[('Rig_Medium','Rig_Medium'),('Rig_Medium','Rig_Large'),('Rig_Large','Rig_Medium'),('Rig_Large','Rig_Large')]
rows=[]
for ra,rb in PAIRS:
    tiles=[]
    for aid,rid in COMBOS:
        t=T[f'{aid}|{ra}|{rb}']; a=M['attacks'][aid][ra]; k=K[rid]
        OA=bpy.data.objects[RIGS[ra]]; OB=COPY[rb] if ra==rb else bpy.data.objects[RIGS[rb]]
        for o in bpy.data.objects:
            if o.type in ('ARMATURE','MESH') and o.name not in ('ml_floor',puff.name):
                root=o if o.type=='ARMATURE' else o.parent; o.hide_render=root not in (OA,OB)
        WB=frames(rb,rid)[k['impactFrame']-1]; pose_obj(OB,rb,WB)
        WA=frames(ra,aid)[a['contactFrame']-1]; pose_obj(OA,ra,WA); OA.matrix_world=Matrix.Identity(4)
        ax=math.radians(t['attackAxisYawDeg']); s=t['hipsDistanceM']; ha=Vector(a['hipsAtContact'])
        tgt=Vector((ha.x+math.cos(ax)*s, ha.y+math.sin(ax)*s, 0)); hb=WB['hips'].translation
        yaw=ax-math.radians(k['byRig'][rb]['knockbackYawInClipDeg'])
        OB.matrix_world=Matrix.Translation(tgt)@Matrix.Rotation(yaw,4,'Z')@Matrix.Translation(Vector((-hb.x,-hb.y,0)))
        sz=0.12*(2.568 if 'Large' in rb else 1.0); puff.scale=(sz,sz,sz); puff.location=Vector(t['impactPuffAt'])
        bpy.context.view_layer.update()
        dg=bpy.context.evaluated_depsgraph_get(); P=[]
        for o in bpy.data.objects:
            if o.type=='MESH' and not o.hide_render and o.name!='ml_floor':
                e=o.evaluated_get(dg); me=e.to_mesh(); a3=np.empty(len(me.vertices)*3); me.vertices.foreach_get('co',a3)
                a3=a3.reshape(-1,3); mw=np.array(e.matrix_world); P.append(a3@mw[:3,:3].T+mw[:3,3]); e.to_mesh_clear()
        P=np.vstack(P); lo,hi=P.min(0),P.max(0); ctr=Vector(((lo+hi)/2).tolist())
        perp=Vector((-math.sin(ax),math.cos(ax),0)); w=abs(np.dot(hi[:2]-lo[:2],[math.cos(ax),math.sin(ax)]))+0.3
        size=max(w/1.23,hi[2]-lo[2])*1.18; d=size/(2*math.tan(math.radians(15.5)))
        cam.location=ctr+perp*d+Vector((0,0,size*0.12)); cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(ctr-cam.location).to_track_quat('-Z','Y')
        p='/tmp/fs2/_t.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
        im=bpy.data.images.load(p,check_existing=False); tiles.append(np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4)); bpy.data.images.remove(im)
    rows.append(np.concatenate(tiles,axis=1)); print(ra,rb,flush=True)
full=np.concatenate(rows[::-1],axis=0)
img=bpy.data.images.new('s',full.shape[1],full.shape[0]); img.pixels.foreach_set(full.ravel()); img.filepath_raw='/tmp/fs2/proof_cartoon_contact.png'; img.file_format='PNG'; img.save(); print('OK')
