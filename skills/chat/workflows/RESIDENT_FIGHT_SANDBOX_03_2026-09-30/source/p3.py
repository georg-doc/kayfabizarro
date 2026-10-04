exec(open('/tmp/fs1/proof.py').read().split("COMBOS=")[0])
D=json.load(open('/tmp/fs3/KFB_Fight_Cartoon_Contact_03.json')); FW={k:v['forwardYawDeg'] for k,v in D['facing']['clips'].items()}
sc.display.shading.color_type='MATERIAL'
def place(ob,rig,cid,f,pos,yaw,lift=0):
    W=frames(rig,cid)[f-1]; pose_obj(ob,rig,W); h=W['hips'].translation
    ob.matrix_world=Matrix.Translation(Vector((pos[0],pos[1],lift)))@Matrix.Rotation(math.radians(yaw),4,'Z')@Matrix.Translation(Vector((-h.x,-h.y,0)))
def show(obs):
    for o in bpy.data.objects:
        if o.type in ('ARMATURE','MESH') and o.name!='ml_floor':
            root=o if o.type=='ARMATURE' else o.parent; o.hide_render=root not in obs
def shot(ctr,dist,elev=0.18):
    cam.location=Vector(ctr)+Vector((0,-dist,dist*elev)); cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(Vector(ctr)-cam.location).to_track_quat('-Z','Y')
    p='/tmp/fs3/_t.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
    im=bpy.data.images.load(p,check_existing=False); a=np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4); bpy.data.images.remove(im); return a
A=bpy.data.objects[RIGS['Rig_Medium']]; B=COPY['Rig_Medium']
rows=[]; t=[]
# row 1: facing, Raider pair
def pair(ca,fa,cb,fb,d,ya,yb):
    place(B,'Rig_Medium',cb,fb,(d/2,0),yb); place(A,'Rig_Medium',ca,fa,(-d/2,0),ya); show([A,B]); bpy.context.view_layer.update()
pair('kfb_action_boxing_a',1,'kfb_action_boxing_a',1,2.2,0-FW['kfb_action_boxing_a'],180-FW['kfb_action_boxing_a']); t.append(shot((0,0,0.9),6))
pair('kfb_locomotion_run_a',5,'kfb_locomotion_run_a',14,3.0,0-FW['kfb_locomotion_run_a'],180-FW['kfb_locomotion_run_a']); t.append(shot((0,0,0.9),6))
pair('kfb_action_fist_fight_a_a',20,'kfb_reaction_taking_punch_a',20,1.3,0-FW['kfb_action_fist_fight_a_a'],180-FW['kfb_reaction_taking_punch_a']); t.append(shot((0,0,0.9),6))
# 02 behaviour for comparison: idle with -cat
cat=json.load(open('/mnt/user-data/uploads/BLENDER MCP/MOTION_LIB_v5/KFB_Motion_Library.catalog.json')); CF={c['id']:c.get('facingYawDeg',0) for c in cat['clips']}
pair('kfb_locomotion_run_a',5,'kfb_locomotion_run_a',14,3.0,0-CF['kfb_locomotion_run_a'],180-CF['kfb_locomotion_run_a']); t.append(shot((0,0,0.9),6))
rows.append(np.concatenate(t,axis=1)); t=[]
# row 2: lying lift, before / after, Raider + Brute
for rig,cid in [('Rig_Medium','kfb_reaction_standing_death_left_01_a'),('Rig_Large','kfb_reaction_fall_flat_a')]:
    O=bpy.data.objects[RIGS[rig]]; n=len(frames(rig,cid)); L=D['lift'][cid][rig]['liftM'][n-1]
    for lift in (0,L):
        W=frames(rig,cid)[n-1]; pose_obj(O,rig,W); h=W['hips'].translation
        O.matrix_world=Matrix.Translation(Vector((-h.x,-h.y,lift))); show([O]); bpy.context.view_layer.update()
        s=1 if rig=='Rig_Medium' else 2.568; t.append(shot((0,0,0.3*s),4.2*s,0.08))
rows.append(np.concatenate(t,axis=1))
full=np.concatenate(rows[::-1],axis=0)
img=bpy.data.images.new('s',full.shape[1],full.shape[0]); img.pixels.foreach_set(full.ravel()); img.filepath_raw='/tmp/fs3/proof_facing_lift.png'; img.file_format='PNG'; img.save(); print('OK')
