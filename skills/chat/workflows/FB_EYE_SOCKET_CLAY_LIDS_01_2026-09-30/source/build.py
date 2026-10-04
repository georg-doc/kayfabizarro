# Reference build: FrizzleBob eyes seated in a head-surface socket frame + clay lids hinged on the canthus axis
# Inputs next to this script: FB_TEMPLATE_LOOK_v5.glb (ear-rig/glb @19088b14) and kfb-pet-frizzlebob-earrig-v5.json (Georg export 2026-09-30). Outputs go to /tmp/fbe/.
import bpy, bmesh, numpy as np, math, json, sys
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
MODE=sys.argv[-1] if sys.argv[-1] in ('before','after') else 'after'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath='FB_TEMPLATE_LOOK_v5.glb')
for n in ('FB_Eye_L','FB_Eye_R','FB_Mouth_Smile','Icosphere','Grid','Carl_Brow_L','Carl_Brow_R'):
    if n in bpy.data.objects: bpy.data.objects[n].hide_render=True
dg=bpy.context.evaluated_depsgraph_get()
def world_bm(name):
    o=bpy.data.objects[name].evaluated_get(dg); me=o.to_mesh(); bm=bmesh.new(); bm.from_mesh(me); bm.transform(o.matrix_world); o.to_mesh_clear(); return bm
H=world_bm('CharacterTemplate_Head'); bvh=BVHTree.FromBMesh(H)
V=np.array([v.co[:] for v in H.verts]); lo,hi=V.min(0),V.max(0); lc=(lo+hi)/2; U=(hi[2]-lo[2])/2
PET=json.load(open('kfb-pet-frizzlebob-earrig-v5.json'))['pets'][0]
A=PET['eye']['anchor']; OV=PET['eye']['oval']; R=U*A['ring']; K=0.24+PET['eye']['inset']*1.15
FWD=Vector((0,-1,0)); UP=Vector((0,0,1))
def normal_at(p,rad):
    n=Vector()
    for f in H.faces:
        if (f.calc_center_median()-p).length<rad: n+=f.normal*f.calc_area()
    return n.normalized()
def sdist(p):
    loc,nrm,i,d=bvh.find_nearest(Vector(p)); return math.copysign(d,(Vector(p)-loc).dot(nrm))
def mat(name,rgb,rough=0.6):
    m=bpy.data.materials.new(name); m.diffuse_color=(*rgb,1); m.roughness=rough; return m
M_W=mat('sclera',(0.95,0.93,0.88),0.3); M_P=mat('pupil',(0.02,0.02,0.02),0.3)
base=np.array([0xf2,0xc9,0x3c])/255; M_L=mat('lid',tuple(base*0.78),0.9)
# ---- socket frames ----
EYES=[]
for sx in (1,-1):
    S=bvh.ray_cast(Vector((lc[0]+sx*U*A['dx'],lc[1]-3.5*U,lc[2]+U*A['dy'])),-FWD)[0]
    if MODE=='after':
        n=normal_at(S,R*1.2); C=S-n*R*K
    else:
        n=FWD.copy(); C=S-FWD*R*K     # ToolBox today: straight view axis, splay 0
    h0=UP.cross(n).normalized()        # horizontal tangent (points toward -x for n~-y ... sign fixed below)
    if h0.x*sx<0: h0=-h0               # h points to the OUTER side of each eye
    v0=n.cross(h0).normalized()
    if v0.z<0: v0=-v0
    tilt=math.radians(-(-sx)*OV['tilt'])   # e.rotation.z = -sx3*tilt, three sx3 = -1 for the eye at -x
    Rn=Matrix.Rotation(tilt,3,n)
    h=(Rn@h0).normalized(); v=(Rn@v0).normalized()
    F=Matrix((h,v,n)).transposed()     # columns h v n
    EYES.append(dict(sx=sx,S=S,n=n,C=C,h=h,v=v,F=F))
# unit-sphere coordinates in the socket frame: x along the hinge (outer +), y up, z out along the normal
def lid_mesh(name,theta_fn,lower,gap,t,bead,span,taper,Mw):
    NS,NP,NL=48,26,7                     # along the hinge, over the shell, around the lip
    rows=[]
    for i in range(NS+1):
        s=-1+2*i/NS; psi=s*math.pi/2; c=max(0.0,math.cos(psi))
        th=theta_fn(psi)
        prof=c**taper                      # thickness melts to zero at the corners
        ring=[]
        # outer surface from the back edge to the margin, lip, inner surface back
        for j in range(NP+1):
            u=j/NP; phi=th+span*(1-u)        # u=1 at the margin
            b=bead*math.exp(-((1-u)*span/0.22)**2)
            r=1+gap*prof+(t+b)*prof
            ring.append((r,phi))
        rim_o=1+gap*prof+(t+bead)*prof; rim_i=1+gap*prof
        for k in range(1,NL):
            a=math.pi*k/NL; mid=(rim_o+rim_i)/2; hr=(rim_o-rim_i)/2
            ring.append((mid+hr*math.cos(a), th-hr*math.sin(a)*1.0))
        for j in range(NP,-1,-1):
            u=j/NP; phi=th+span*(1-u); ring.append((1+gap*prof,phi))
        pts=[]
        for r,phi in ring:
            ph=-phi if lower else phi
            p=Vector((math.sin(psi), math.cos(psi)*math.sin(ph), math.cos(psi)*math.cos(ph)))*r
            pts.append(p)
        rows.append(pts)
    return rows
def to_world(p,E):
    q=Vector((p.x*OV['w'],p.y*OV['h'],p.z*OV['d']))*R
    return E['C']+E['F']@q
def make_obj(name,rows,E,m,closed_ring=True):
    bm=bmesh.new(); vs=[[bm.verts.new(to_world(p,E)) for p in row] for row in rows]
    for i in range(len(rows)-1):
        L=len(rows[i])
        for j in range(L-1):
            bm.faces.new((vs[i][j],vs[i+1][j],vs[i+1][j+1],vs[i][j+1]))
    me=bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth=True
    o=bpy.data.objects.new(name,me); o.data.materials.append(m); bpy.context.scene.collection.objects.link(o); return o
def sphere_obj(name,E,m,cap=None,gaze=None,rscale=1.0):
    bm=bmesh.new(); bmesh.ops.create_uvsphere(bm,u_segments=48,v_segments=int(32 if cap is None else 90),radius=1.0)
    if cap is not None:
        gl=(E['F'].transposed()@gaze).normalized()   # gaze in socket coords
        g3=Vector((gl.x/OV['w'],gl.y/OV['h'],gl.z/OV['d'])).normalized()
        rot=Vector((0,0,1)).rotation_difference(g3).to_matrix()
        kill=[v for v in bm.verts if v.co.z<math.cos(cap)-1e-4]
        bmesh.ops.delete(bm,geom=kill,context='VERTS')
        for v in bm.verts: v.co=rot@v.co
    for v in bm.verts:
        p=v.co*rscale; v.co=to_world(p,E)
    me=bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth=True
    o=bpy.data.objects.new(name,me); o.data.materials.append(m); bpy.context.scene.collection.objects.link(o); return o
LID=dict(gap=0.035,t=0.14,bead=0.07,span=math.radians(150),taper=0.7,curveU=0.10,curveL=0.06,seam=math.radians(-5),ov=math.radians(2.5))
OPEN_U=math.radians(74); OPEN_L=math.radians(66)
def build_state(cu,cl,slant,gaze=FWD):
    for o in [o for o in bpy.data.objects if o.name.startswith('kfb_')]: bpy.data.objects.remove(o)
    rep=[]
    for E in EYES:
        sl=-E['sx']*slant*0.85   # EyeRig v6: e._lids.rotation.z = -sx*slant*0.85 (rad); angry (-) = inner end down
        Rs=Matrix.Rotation(sl,3,E['n']); Es=dict(E); Es['F']=(Rs@E['F'])
        tu=OPEN_U+(LID['seam']-LID['ov']-OPEN_U)*cu
        tl=OPEN_L+(-LID['seam']-LID['ov']-OPEN_L)*cl
        fu=lambda psi,tu=tu: tu-LID['curveU']*math.cos(psi)**2*(1-cu)      # convex upper margin (lower in the middle), flattens as it closes
        fl=lambda psi,tl=tl: tl-LID['curveL']*math.cos(psi)**2*(1-cl)
        up=lid_mesh('u',fu,False,LID['gap'],LID['t'],LID['bead'],LID['span'],LID['taper'],None)
        lw=lid_mesh('l',fl,True,LID['gap']+0.006,LID['t']*0.93,LID['bead']*0.8,LID['span'],LID['taper'],None)
        ou=make_obj('kfb_lidU',up,Es,M_L); ol=make_obj('kfb_lidL',lw,Es,M_L)
        sphere_obj('kfb_sclera',E,M_W); sphere_obj('kfb_pupil',E,M_P,cap=0.36,gaze=gaze,rscale=1.012)
        # corner check: lid vertices near the canthi (|x| > 0.85 in socket units)
        worst=-9
        for row in up[:4]+up[-4:]+lw[:4]+lw[-4:]:
            for p in row: worst=max(worst,sdist(to_world(p,Es)))
        rep.append(round(worst,4))
    return rep
bpy.context.scene.render.engine='BLENDER_WORKBENCH'; sh=bpy.context.scene.display.shading
sh.light='STUDIO'; sh.color_type='MATERIAL'; sh.show_cavity=False
for o in bpy.data.objects:
    if o.type=='MESH' and o.data.materials and o.data.materials[0].name.startswith('FB_Yellow'):
        o.data.materials[0].diffuse_color=(*base,1)
cam_d=bpy.data.cameras.new('c'); cam=bpy.data.objects.new('cam',cam_d); bpy.context.scene.collection.objects.link(cam); bpy.context.scene.camera=cam
sc=bpy.context.scene; sc.render.resolution_x=400; sc.render.resolution_y=280
ims=sc.render.image_settings
if hasattr(ims,'media_type'): ims.media_type='IMAGE'
ims.file_format='PNG'
tgt=Vector((0,-0.35,1.74))
VIEWS={'front':Vector((0,-2.2,1.80)),'three_q':Vector((1.45,-1.55,1.95)),'side':Vector((2.1,-0.45,1.80))}
def shot(view,lens=85):
    cam.data.lens=lens; cam.location=VIEWS[view]; cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(tgt-cam.location).to_track_quat('-Z','Y')
    p='/tmp/fbe/_t.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
    im=bpy.data.images.load(p,check_existing=False); a=np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4); bpy.data.images.remove(im); return a
def save(rows,path):
    full=np.concatenate(rows[::-1],axis=0); img=bpy.data.images.new('s',full.shape[1],full.shape[0]); img.pixels.foreach_set(full.ravel()); img.filepath_raw=path; img.file_format='PNG'; img.save()
REP={'mode':MODE,'R':R,'U':U,'eyes':[{'sx':E['sx'],'normal':list(map(lambda x:round(x,4),E['n'])),'centre':list(map(lambda x:round(x,4),E['C']))} for E in EYES]}
if MODE=='before':
    REP['lidCornerMaxOutsideM']=build_state(0.25,0.38,0)
    save([np.concatenate([shot('front'),shot('three_q'),shot('side')],axis=1)],'/tmp/fbe/row_before.png')
else:
    REP['lidCornerMaxOutsideM']=build_state(0.25,0.38,0)
    save([np.concatenate([shot('front'),shot('three_q'),shot('side')],axis=1)],'/tmp/fbe/row_after.png')
    STATES=[('open',0,0,0),('neutral',0.25,0.38,0),('half',0.55,0.45,0),('closed',1,1,0),('angry',0.45,0.15,-0.4),('sad',0.35,0.05,0.35)]
    tiles=[];tq=[];REP['states']={}
    for nm,cu,cl,sl in STATES:
        REP['states'][nm]={'cu':cu,'cl':cl,'slant':sl,'lidCornerMaxOutsideM':build_state(cu,cl,sl)}
        tiles.append(shot('front',72)); tq.append(shot('three_q',72))
    save([np.concatenate(tiles,axis=1),np.concatenate(tq,axis=1)],'/tmp/fbe/states_after.png')
json.dump(REP,open(f'/tmp/fbe/report_{MODE}.json','w'),indent=1); print('REPORT',json.dumps(REP))
