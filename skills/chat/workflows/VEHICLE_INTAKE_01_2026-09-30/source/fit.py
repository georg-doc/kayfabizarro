# Seat fit: KayKit Medium (Orc Raider) and FrizzleBob (FB_TEMPLATE_LOOK_v5b) in the driving pose, placed on the driver seat of each
# Cartoon Vehicles Pack 1 car. Finds the car scale at which head (and FB ears) clear the roof and nothing hits dash/wheel/doors.
import sys; sys.path.insert(0,'/tmp/ch1'); sys.path.insert(0,'/tmp/fbr')
import bpy, bmesh, numpy as np, math, json, glb
from mathutils import Matrix, Vector, Quaternion, Euler
from mathutils.bvhtree import BVHTree
LIB='/mnt/user-data/uploads/BLENDER MCP/MOTION_LIB_v6/libs/Rig_Medium/KFB_Motion_interaction_i06.glb'
CARS=['sedan','hatchback','estate','cabrio','sportster','pickup','transporter','truck']
bpy.ops.wm.open_mainfile(filepath='/tmp/an1/AN_PERF_01.blend')   # read only, never saved
for o in list(bpy.data.objects):
    keep=o.name=='Rig_Raider' or (o.parent and o.parent.name=='Rig_Raider')
    if not keep: bpy.data.objects.remove(o)
bpy.ops.import_scene.gltf(filepath='/tmp/fbr/FB_TEMPLATE_LOOK_v5b.glb')
FB=bpy.data.objects['Rig']; FB.name='FB_Rig'
for n in ('Icosphere',):
    if n in bpy.data.objects: bpy.data.objects.remove(bpy.data.objects[n])
RA=bpy.data.objects['Rig_Raider']
def clip_rest(path):
    J,acc=glb.load(path); nodes=J['nodes']; parent={}
    for i,n in enumerate(nodes):
        for c in n.get('children',[]): parent[c]=i
    L={}
    for i,n in enumerate(nodes):
        tr=n.get('translation',[0,0,0]); r=n.get('rotation',[0,0,0,1]); s=n.get('scale',[1,1,1])
        L[i]=Matrix.Translation(Vector(tr))@Quaternion((r[3],r[0],r[1],r[2])).to_matrix().to_4x4()@Matrix.Diagonal((*s,1))
    W={}
    def w(i):
        if i in W: return W[i]
        W[i]=(w(parent[i])@L[i]) if i in parent else L[i]; return W[i]
    C=Matrix.Rotation(math.pi/2,4,'X'); return {nodes[i].get('name',str(i)):C@w(i) for i in range(len(nodes))}
def pose_body(A,Wc,Rc):
    for pb in A.pose.bones: pb.rotation_mode='QUATERNION'; [setattr(c,'mute',True) for c in pb.constraints]
    A.matrix_world=Matrix.Identity(4); bpy.context.view_layer.update()
    REST={b.name:b.matrix_local.copy() for b in A.data.bones}; M={}
    for b in A.data.bones:
        n=b.name; skip=n.startswith(('IK','control','heelIK','elbowIK','handIK','kneeIK','ear.')) or b.parent is None
        if not skip and n in Wc and n in Rc:
            rot=(Wc[n].to_3x3()@Rc[n].to_3x3().inverted()@REST[n].to_3x3()).normalized()
            pos=REST[n].translation+(Wc[n].translation-Rc[n].translation) if n=='hips' else (M[b.parent.name]@(REST[b.parent.name].inverted()@REST[n])).translation
            Mt=Matrix.Translation(pos)@rot.to_4x4()
        else: Mt=(M[b.parent.name]@(REST[b.parent.name].inverted()@REST[n])) if b.parent else REST[n]
        M[n]=Mt; rel=(REST[b.parent.name].inverted()@REST[n]) if b.parent else REST[n]
        basis=(rel.inverted()@(M[b.parent.name].inverted()@Mt)) if b.parent else REST[n].inverted()@Mt
        pb=A.pose.bones[n]; pb.rotation_quaternion=basis.to_quaternion(); pb.location=basis.translation
    bpy.context.view_layer.update()
G=glb.clip_world(LIB,'kfb_interaction_driving_a',fps=30); Rc=clip_rest(LIB); FR=len(G)//2
for A in (RA,FB): pose_body(A,G[FR],Rc)
def kids(A): return [c for c in bpy.data.objects if c.type=='MESH' and c.parent==A]
def verts(objs,filt=None):
    dg=bpy.context.evaluated_depsgraph_get(); out=[]
    for o in objs:
        if filt and not filt(o): continue
        e=o.evaluated_get(dg); me=e.to_mesh(); a=np.empty(len(me.vertices)*3); me.vertices.foreach_get('co',a); a=a.reshape(-1,3)
        mw=np.array(e.matrix_world); out.append(a@mw[:3,:3].T+mw[:3,3]); e.to_mesh_clear()
    return np.concatenate(out) if out else np.zeros((0,3))
def bm_world(objs):
    dg=bpy.context.evaluated_depsgraph_get(); bm=bmesh.new()
    for o in objs:
        e=o.evaluated_get(dg); me=e.to_mesh(); t=bmesh.new(); t.from_mesh(me); t.transform(e.matrix_world); me2=bpy.data.meshes.new('tmp'); t.to_mesh(me2); t.free(); bm.from_mesh(me2); bpy.data.meshes.remove(me2); e.to_mesh_clear()
    bmesh.ops.triangulate(bm,faces=bm.faces); return bm
EARS=lambda o:'Ear' in o.name
# character metrics in their own frame (object at origin, facing -Y, clip pose)
CH={}
for tag,A in (('kaykit_raider',RA),('frizzlebob',FB)):
    body=[o for o in kids(A) if not EARS(o) and o.name not in ('FB_Mouth_Smile','Grid')]
    V=verts(body); hips=(A.matrix_world@A.pose.bones['hips'].head)
    near=V[np.abs(V[:,1]-hips.y)<0.2]; butt=near[:,2].min()
    head=verts([o for o in body if 'Head' in o.name])
    ears=verts([o for o in kids(A) if EARS(o)]) if tag=='frizzlebob' else np.zeros((0,3))
    CH[tag]=dict(A=A,body=body,hips=hips,butt=butt,headTop=head[:,2].max(),earTop=(ears[:,2].max() if len(ears) else None),
                 seatH=head[:,2].max()-butt, earH=(ears[:,2].max()-butt if len(ears) else None),halfW=float(np.abs(V[:,0]-hips.x).max()))
    print(tag,'seated height (butt->head top)',round(CH[tag]['seatH'],3),'ears',CH[tag]['earH'] and round(CH[tag]['earH'],3),'half width',round(CH[tag]['halfW'],3))
REP={'clip':'kfb_interaction_driving_a','frame':FR,'chars':{k:{'seatedHeightM':round(v['seatH'],3),'earTopAboveSeatM':v['earH'] and round(v['earH'],3),'halfWidthM':round(v['halfW'],3)} for k,v in CH.items()},'cars':{}}
def place(tag,seat_xy,cush_z,k):
    c=CH[tag]; A=c['A']; T=Matrix.Translation((0,0,0))
    # rotate 180 about z (char faces -Y, car front +Y), hips over the seat point, butt on the cushion; the car is scaled by k instead of the char
    R=Matrix.Rotation(math.pi,4,'Z'); h=R@c['hips']
    A.matrix_world=Matrix.Translation((seat_xy[0]-h.x, seat_xy[1]-h.y, cush_z-c['butt']))@R; bpy.context.view_layer.update()
def overlap(bm1,bm2):
    t1=BVHTree.FromBMesh(bm1); t2=BVHTree.FromBMesh(bm2); return len(t1.overlap(t2))
for car in CARS:
    for o in list(bpy.data.objects):
        if o.get('kfbcar'): bpy.data.objects.remove(o)
    before=set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=f'/tmp/veh/glb/{car}.glb'); new=[o for o in bpy.data.objects if o not in before]
    for o in new: o['kfbcar']=1
    for o in new:
        if o.name.startswith('Icosphere'): o.hide_render=True; o.hide_viewport=True
    root=[o for o in new if o.parent is None and o.name.startswith('RootNode')][0]
    meshes=[o for o in new if o.type=='MESH' and not o.name.startswith('Icosphere')]
    by=lambda p:[o for o in meshes if o.name.startswith(p)]
    sw=[o for o in new if o.name.startswith('SteeringWheel')]
    swx=(sw[0].matrix_world.translation.x) if sw else -0.38
    seats=[o for o in meshes if o.name.startswith('Seat') and 'Rear' not in o.name]
    drv=min(seats,key=lambda o:abs(o.matrix_world.translation.x- swx)) if seats else None
    res={'driverSeat':drv.name if drv else None,'steeringX':round(swx,3)}
    for tag in CH:
        best=None
        for k in [1.0,1.1,1.2,1.3,1.4,1.5,1.6,1.8,2.0]:
            root.scale=(k,k,k); bpy.context.view_layer.update()
            if not drv: break
            bb=[drv.matrix_world@Vector(c) for c in drv.bound_box]; lo=Vector(map(min,*bb)); hi=Vector(map(max,*bb))
            sb=bm_world([drv]); st=BVHTree.FromBMesh(sb)
            px,py=(lo.x+hi.x)/2,(lo.y+hi.y)/2+0.12*k   # a little forward of the seat centre (clear of the backrest)
            hit=st.ray_cast(Vector((px,py,hi.z+1)),Vector((0,0,-1)))[0]; cz=hit.z if hit else lo.z+0.4*(hi.z-lo.z)
            place(tag,(px,py),cz,k)
            c=CH[tag]; A=c['A']
            body=verts(c['body']); headTop=body[:,2].max()
            cab=bm_world([o for o in meshes if o.name.startswith(('CarMesh','Top','Interior','Dash','Steering','Torus','Door','Window','WIndow','Glass'))]); ct=BVHTree.FromBMesh(cab)
            hx,hy=body[body[:,2].argmax()][:2]
            up=ct.ray_cast(Vector((hx,hy,cz+0.3)),Vector((0,0,1)))[0]; roofZ=up.z if up else None
            cb=bm_world(c['body']); hits={}
            for part in ('CarMesh','Interior','Dash','Steering','Torus','Door','Window','WIndow','Top','Glass'):
                objs=[o for o in meshes if o.name.startswith(part)]
                if objs:
                    pb=bm_world(objs); n=overlap(cb,pb); pb.free()
                    if n: hits[part]=n
            ear=None
            if c['earH']:
                ev=verts([o for o in kids(A) if EARS(o)]); ex,ey=ev[ev[:,2].argmax()][:2]
                upE=ct.ray_cast(Vector((ex,ey,cz+0.3)),Vector((0,0,1)))[0]
                ear=round((upE.z if upE else 99)-ev[:,2].max(),3)
            cb.free(); cab.free(); sb.free()
            r=dict(carScale=k,cushionZ=round(cz,3),headClearM=(round(roofZ-headTop,3) if roofZ else None),earClearM=ear,hits=hits)
            if best is None: best={'at1':r}
            clean=(r['headClearM'] is None or r['headClearM']>0.03) and not any(p in hits for p in ('CarMesh','Dash','Steering','Torus','Door','Top','Window','WIndow','Glass'))
            if clean: best['fit']=r; break
            best['last']=r
        res[tag]=best
        print(car,tag,json.dumps(best))
    root.scale=(1,1,1); REP['cars'][car]=res
json.dump(REP,open('/tmp/veh/fit.json','w'),indent=1)
