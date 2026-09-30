# FB-EYES-LIDS-02 reference: surface seat + one mirrored turn; lids mech hinge|slide x lip round|cut.
# Blender 5.0 headless. Builds on FB-EYE-SOCKET-CLAY-LIDS-01 (socket frame, hinge lids).
import bpy, bmesh, numpy as np, math, json
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
OUT='/tmp/fbl/'
import sys
LID_TILT=sys.argv[-1] if sys.argv[-1] in ('level','follow') else 'level'   # level: hinge stays horizontal; follow: lids take the oval tilt (v1 renders)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath='/tmp/fbe/FB_TEMPLATE_LOOK_v5.glb')
for n in ('FB_Eye_L','FB_Eye_R','FB_Mouth_Smile','Icosphere','Grid','Carl_Brow_L','Carl_Brow_R'):
    if n in bpy.data.objects: bpy.data.objects[n].hide_render=True
dg=bpy.context.evaluated_depsgraph_get()
def world_bm(name):
    o=bpy.data.objects[name].evaluated_get(dg); me=o.to_mesh(); bm=bmesh.new(); bm.from_mesh(me); bm.transform(o.matrix_world); o.to_mesh_clear(); return bm
H=world_bm('CharacterTemplate_Head'); bvh=BVHTree.FromBMesh(H)
V=np.array([v.co[:] for v in H.verts]); lo,hi=V.min(0),V.max(0); lc=(lo+hi)/2; U=(hi[2]-lo[2])/2
PET=json.load(open('/root/.claude/uploads/9739e4d7-eb48-5210-ae61-4cd82525f150/3fe7df17-kfb-pet-frizzlebob-earrig-v5.georg-2026-09-30_2.json'))['pets'][0]
A=dict(PET['eye']['anchor']); OV=PET['eye']['oval']; R=U*A['ring']; K=0.24+PET['eye']['inset']*1.15
FWD=Vector((0,-1,0)); UP=Vector((0,0,1))
FC=[(f.calc_center_median(),f.normal.copy(),f.calc_area()) for f in H.faces]
def normal_at(p,rad):
    n=Vector()
    for c,nn,a in FC:
        if (c-p).length<rad: n+=nn*a
    return n.normalized()
def sdist(p):
    loc,nrm,i,d=bvh.find_nearest(Vector(p)); return math.copysign(d,(Vector(p)-loc).dot(nrm))
def mat(name,rgb,rough=0.6):
    m=bpy.data.materials.new(name); m.diffuse_color=(*rgb,1); m.roughness=rough; return m
M_W=mat('sclera',(0.95,0.93,0.88),0.3); M_P=mat('pupil',(0.02,0.02,0.02),0.3)
base=np.array([0xf2,0xc9,0x3c])/255; M_L=mat('lid',tuple(base*0.78),0.9)

# ---- 1 · socket frame with ONE mirrored turn ----
def socket(dx,dy,turn_deg=0.0,fine=(0.0,0.0)):
    E=[]
    for sx in (1,-1):   # Blender +x = character's left? irrelevant: mirrored by construction
        S0=bvh.ray_cast(Vector((lc[0]+sx*U*dx,lc[1]-3.5*U,lc[2]+U*dy)),-FWD)[0]
        n0=normal_at(S0,R*1.2); n=n0.copy(); S=S0
        ang=math.radians(turn_deg+(fine[0] if sx>0 else fine[1]))
        if abs(ang)>1e-6:   # rotate about vertical, outward = away from the midline, then re-seat on the skin
            n=(Matrix.Rotation(-sx*ang if False else sx*ang,3,UP)@n0).normalized()
            if (n.x*sx) < (n0.x*sx): n=(Matrix.Rotation(-sx*ang,3,UP)@n0).normalized()
            O=S0-n0*U*0.5; hit=bvh.ray_cast(O+n*U*3.5,-n)[0]
            if hit: S=hit
        h0=UP.cross(n).normalized()
        if h0.x*sx<0: h0=-h0
        v0=n.cross(h0).normalized()
        if v0.z<0: v0=-v0
        Rn=Matrix.Rotation(math.radians(sx*OV['tilt']),3,n)
        h=(Rn@h0).normalized(); v=(Rn@v0).normalized()
        yaw=math.degrees(math.atan2(n.x*sx,-n.y)); pitch=math.degrees(math.asin(n.z))
        E.append(dict(sx=sx,S=S,n=n,C=S-n*R*K,F=Matrix((h,v,n)).transposed(),FL=Matrix((h0,v0,n)).transposed(),yaw=yaw,pitch=pitch))
    return E
def to_world(p,E):
    if 'lid' in E: p=E['F'].transposed()@(E['lid']@p)   # lid frame -> eyeball (oval) frame, so the lid still hugs the oval ball
    return E['C']+E['F']@(Vector((p.x*OV['w'],p.y*OV['h'],p.z*OV['d']))*R)

# ---- 2 · lid cross-section (lip profile), shared by both mechanisms ----
# returns (r, a) pairs; a = the angle coordinate that grows from the margin onto the lid body (phi for hinge, latitude for slide)
def ring(th,span,ri,t,bead,lip,chamfer):
    out=[]; NP=26
    if lip=='round':
        for j in range(NP+1):
            u=j/NP; b=bead*math.exp(-((1-u)*span/0.22)**2); out.append((ri+t+b,th+span*(1-u)))
        ro=ri+t+bead; mid=(ro+ri)/2; hr=(ro-ri)/2
        for k in range(1,7):
            a=math.pi*k/7; out.append((mid+hr*math.cos(a),th-hr*math.sin(a)))
    else:   # 'cut': flat outer shell, hard flat edge face, small 45deg chamfer on the outer corner
        ro=ri+t; c=min(chamfer,0.45*t)
        for j in range(NP+1):
            u=j/NP; out.append((ro,th+c+(span-c)*(1-u)))
        out.append((ro-c,th)); out.append(((ro-c+ri)/2,th))
    for j in range(NP,-1,-1): out.append((ri,th+span*(1-j/NP)))
    return out
def pt(mech,s,r,a,lower):
    a=-a if lower else a
    if mech=='hinge': return Vector((math.sin(s),math.cos(s)*math.sin(a),math.cos(s)*math.cos(a)))*r
    return Vector((math.cos(a)*math.sin(s),math.sin(a),math.cos(a)*math.cos(s)))*r   # slide: s = longitude, a = latitude
def lid_rows(mech,lip,theta,closure,lower,P):
    rows=[]
    if mech=='hinge':
        S=[-math.pi/2+math.pi*i/48 for i in range(49)]
    else:
        S=[-math.pi+2*math.pi*i/72 for i in range(72)]   # closed loop
    for s in S:
        if mech=='hinge':
            c=max(0.0,math.cos(s)); prof=c**P['taper']; th=theta-P['curve']*c*c*(1-closure); span=P['span']
        else:
            w=min(1.0,max(0.0,(abs(s)-math.radians(30))/math.radians(80))); prof=1-w*w*(3-2*w)   # from 30 deg longitude to 110 deg (the eye sides, where the ball leaves the head) the shell melts onto the ball (no brim behind the eye)
            th=theta; span=math.radians(89.0)-theta   # to the pole: rim is a constant latitude
        ri=1+P['gap']*(prof if mech=='hinge' else max(prof,0.3))
        rows.append([pt(mech,s,r,a,lower) for r,a in ring(th,span,ri,P['t']*prof,P['bead']*prof,lip,P['chamfer']*prof)])
    return rows
def make_obj(name,rows,E,m,wrap,sharp):
    bm=bmesh.new(); vs=[[bm.verts.new(to_world(p,E)) for p in row] for row in rows]
    NR=len(rows); L=len(rows[0])
    for i in range(NR if wrap else NR-1):
        i1=(i+1)%NR
        for j in range(L):
            j1=(j+1)%L
            try: bm.faces.new((vs[i][j],vs[i1][j],vs[i1][j1],vs[i][j1]))
            except ValueError: pass
    bmesh.ops.remove_doubles(bm,verts=bm.verts,dist=1e-7)
    me=bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth=True
    if sharp: me.set_sharp_from_angle(angle=math.radians(35))
    o=bpy.data.objects.new(name,me); o.data.materials.append(m); bpy.context.scene.collection.objects.link(o); return o
def sphere_obj(name,E,m,cap=None,rscale=1.0):
    bm=bmesh.new(); bmesh.ops.create_uvsphere(bm,u_segments=48,v_segments=int(32 if cap is None else 90),radius=1.0)
    if cap is not None:
        gl=(E['F'].transposed()@FWD).normalized(); g3=Vector((gl.x/OV['w'],gl.y/OV['h'],gl.z/OV['d'])).normalized()
        rot=Vector((0,0,1)).rotation_difference(g3).to_matrix()
        bmesh.ops.delete(bm,geom=[v for v in bm.verts if v.co.z<math.cos(cap)-1e-4],context='VERTS')
        for v in bm.verts: v.co=rot@v.co
    for v in bm.verts: v.co=to_world(v.co*rscale,E)
    me=bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth=True
    o=bpy.data.objects.new(name,me); o.data.materials.append(m); bpy.context.scene.collection.objects.link(o); return o

# ---- 3 · parameters (start values; hinge = LIDS-01 values) ----
BASE=dict(gap=0.035,taper=0.7,curve=0.10,curveLo=0.06,span=math.radians(150),chamfer=0.04)
LIP={'round':dict(t=0.14,bead=0.07),'cut':dict(t=0.28,bead=0.0)}
OPEN={'hinge':(74,66),'slide':(58,50)}          # degrees; slide opens less: its rim does not converge to corners
SEAM=math.radians(-5); OVL=math.radians(2.5)
def angles(mech,cu,cl):
    ou,ol=[math.radians(x) for x in OPEN[mech]]
    return ou+(SEAM-OVL-ou)*cu, ol+(-SEAM-OVL-ol)*cl
def build(EYES,mech,lip,cu,cl,slant,mask=False):
    for o in [o for o in bpy.data.objects if o.name.startswith('kfb_')]: bpy.data.objects.remove(o)
    M_W.diffuse_color=(0,1,0,1) if mask else (0.95,0.93,0.88,1)
    rep=[]
    for E in EYES:
        Rs=Matrix.Rotation(-E['sx']*slant*0.85,3,E['n']); Es=dict(E); Es['lid']=Rs@(E['FL'] if LID_TILT=='level' else E['F'])
        tu,tl=angles(mech,cu,cl)
        Pu=dict(BASE,**LIP[lip]); Pl=dict(Pu); Pl['gap']+=0.006; Pl['t']*=0.93; Pl['bead']*=0.8; Pl['curve']=BASE['curveLo']
        up=lid_rows(mech,lip,tu,cu,False,Pu); lw=lid_rows(mech,lip,tl,cl,True,Pl)
        wrap=(mech=='slide'); sharp=(lip=='cut')
        make_obj('kfb_lidU',up,Es,M_L,wrap,sharp); make_obj('kfb_lidL',lw,Es,M_L,wrap,sharp)
        sphere_obj('kfb_sclera',E,M_W); sphere_obj('kfb_pupil',E,M_P,cap=0.36,rscale=1.012)
        r={'sx':E['sx']}
        if mech=='hinge':   # shared corners: first/last row of upper vs lower lid (inner ring point)
            cu0=[to_world(up[0][-1],Es),to_world(up[-1][-1],Es)]; cl0=[to_world(lw[0][-1],Es),to_world(lw[-1][-1],Es)]
            r['cornerGapR']=round(max((a-b).length for a,b in zip(cu0,cl0))/R,6)
            r['cornerSdistM']=[round(sdist(p),4) for p in cu0]
        else:               # rim = margin vertex of the inner surface in every row: latitude spread and front straightness
            idx=len(up[0])-27
            lat=[math.degrees(math.asin(max(-1,min(1,up[i][idx].y/up[i][idx].length)))) for i in range(len(up))]
            r['rimLatSpreadDeg']=round(max(lat)-min(lat),6)
            side=[to_world(up[i][idx],Es) for i in (18,54)]   # lon -90 / +90: where the rim meets the eye's sides
            r['rimSideSdistM']=[round(sdist(p),4) for p in side]
            fr=[up[i][idx] for i in range(len(up)) if abs(-math.pi+2*math.pi*i/72)<=math.radians(80)]
            r['frontRimYSpread']=round(max(p.y for p in fr)-min(p.y for p in fr),6)
        rep.append(r)
    return rep

# ---- render ----
bpy.context.scene.render.engine='BLENDER_WORKBENCH'; sh=bpy.context.scene.display.shading
sh.light='STUDIO'; sh.color_type='MATERIAL'; sh.show_cavity=False
for o in bpy.data.objects:
    if o.type=='MESH' and o.data.materials and o.data.materials[0].name.startswith('FB_Yellow'):
        o.data.materials[0].diffuse_color=(*base,1)
cam_d=bpy.data.cameras.new('c'); cam=bpy.data.objects.new('cam',cam_d); bpy.context.scene.collection.objects.link(cam); bpy.context.scene.camera=cam
sc=bpy.context.scene; sc.render.resolution_x=420; sc.render.resolution_y=240
ims=sc.render.image_settings
if hasattr(ims,'media_type'): ims.media_type='IMAGE'
ims.file_format='PNG'
tgt=Vector((0,-0.35,1.80))
VIEWS={'front':Vector((0,-2.4,1.86)),'three_q':Vector((1.55,-1.75,1.98)),'side':Vector((2.2,-0.45,1.84))}
def shot(view,lens=100):
    cam.data.lens=lens; cam.location=VIEWS[view]; cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(tgt-cam.location).to_track_quat('-Z','Y')
    p=OUT+'_t.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
    im=bpy.data.images.load(p,check_existing=False); a=np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4); bpy.data.images.remove(im); return a
def green(a):
    return int(((a[...,1]>0.3)&(a[...,0]<0.25)&(a[...,2]<0.25)).sum())
def save(rows,path):
    full=np.concatenate(rows[::-1],axis=0); img=bpy.data.images.new('s',full.shape[1],full.shape[0]); img.pixels.foreach_set(full.ravel()); img.filepath_raw=path; img.file_format='PNG'; img.save()

REP={'R':R,'U':U,'anchor':A,'oval':OV}
# (a) auto turn: sweep the anchor dx, turn 0
SW=[]; tiles=[]
for dx in (0.345,0.40,0.455,0.52):
    E=socket(dx,A['dy']); build(E,'hinge','round',0.25,0.38,0)
    SW.append({'dx':dx,'yawOutDeg':[round(e['yaw'],2) for e in E],'pitchUpDeg':[round(e['pitch'],2) for e in E]}); tiles.append(shot('front',80))
REP['dxSweep']=SW; save([np.concatenate(tiles,axis=1)],OUT+'auto_turn_dx.png')
# (b) one mirrored turn
TT=[]; tiles=[]
for t in (0,10,20):
    E=socket(A['dx'],A['dy'],t); build(E,'hinge','round',0.25,0.38,0)
    TT.append({'turn':t,'yawOutDeg':[round(e['yaw'],2) for e in E]}); tiles.append(shot('front',80))
REP['turn']=TT; save([np.concatenate(tiles,axis=1)],OUT+'turn_mirrored.png')
# (c) 4 combinations x states
EY=socket(A['dx'],A['dy'])
STATES=[('open',0,0,0),('neutral',0.25,0.38,0),('half',0.55,0.45,0),('closed',1,1,0),('angry',0.45,0.15,-0.4),('sad',0.35,0.05,0.35)]
COMBOS=[('hinge','round'),('hinge','cut'),('slide','round'),('slide','cut')]
REP['combos']={}; grid=[]; tq=[]
for mech,lip in COMBOS:
    key=mech+'+'+lip; REP['combos'][key]={}; row=[]
    for nm,cu,cl,sl in STATES:
        REP['combos'][key][nm]=build(EY,mech,lip,cu,cl,sl); row.append(shot('front',80))
    grid.append(np.concatenate(row,axis=1))
    build(EY,mech,lip,0.25,0.38,0); a=shot('three_q'); b=shot('side'); build(EY,mech,lip,1,1,0); c=shot('three_q')
    tq.append(np.concatenate([a,b,c],axis=1))
    build(EY,mech,lip,1,1,0,mask=True); REP['combos'][key]['closedScleraPx']={'front':green(shot('front',80)),'three_q':green(shot('three_q'))}
    build(EY,mech,lip,0.25,0.38,0,mask=True); REP['combos'][key]['neutralScleraPx']={'front':green(shot('front',80))}
save(grid,OUT+'lids_4x6_front.png'); save(tq,OUT+'lids_4_threeq_side.png')
json.dump(REP,open(OUT+'measure.json','w'),indent=1); print('REPORT',json.dumps(REP)[:3000])
