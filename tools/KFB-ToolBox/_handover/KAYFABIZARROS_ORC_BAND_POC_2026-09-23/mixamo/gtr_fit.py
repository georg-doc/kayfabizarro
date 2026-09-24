
import bpy, json, math, time
from mathutils import Vector, Matrix, Quaternion
from mathutils.bvhtree import BVHTree
OUT="/Users/georgv.westphalen/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/_inbox/_probe_batch1/"
def gather(scn='GTR_RAIDER_A', rigname='Raider_GA', parent='spine', step=4, pstep=3, pframes=8):
    sc=bpy.data.scenes[scn]; bpy.context.window.scene=sc; rig=bpy.data.objects[rigname]
    pb=rig.pose.bones; W=rig.matrix_world
    D={'R':[],'L':[],'SL':[],'SR':[],'F':[],'U':[]}
    f0,f1=sc.frame_start,sc.frame_end
    for f in range(f0,f1+1,step):
        sc.frame_set(f)
        sp=W@pb[parent].matrix; inv=sp.inverted(); i3=inv.to_3x3()
        g=lambda n: inv@(W@pb[n].head)
        D['R'].append(g('handslot.r')); D['L'].append(g('handslot.l'))
        D['SL'].append(g('upperarm.l')); D['SR'].append(g('upperarm.r'))
        fw=((W@pb['toes.l'].head)-(W@pb['foot.l'].head))+((W@pb['toes.r'].head)-(W@pb['foot.r'].head)); fw.z=0
        D['F'].append(i3@fw.normalized()); D['U'].append(i3@Vector((0,0,1)))
    pts=[]
    dg=bpy.context.evaluated_depsgraph_get()
    fr=[round(f0+i*(f1-f0)/(pframes-1)) for i in range(pframes)]
    for f in fr:
        sc.frame_set(f); dg=bpy.context.evaluated_depsgraph_get()
        inv=(W@pb[parent].matrix).inverted()
        for o in sc.objects:
            if o.type!='MESH' or o.parent!=rig: continue
            if not any(k in o.name for k in ('Body','Leg','Head')): continue
            e=o.evaluated_get(dg)
            for v in list(e.data.vertices)[::pstep]:
                pts.append(inv@(o.matrix_world@v.co))
    return D, pts
def guitar_bvh(name='guitar_B'):
    g=bpy.data.objects[name]; me=g.data
    return BVHTree.FromPolygons([v.co.copy() for v in me.vertices],[tuple(p.vertices) for p in me.polygons])
def frame_axes(D):
    avg=lambda l: sum(l,Vector())/len(l)
    up=avg(D['U']).normalized(); fwd=avg(D['F']); fwd=(fwd-up*fwd.dot(up)).normalized(); left=up.cross(fwd).normalized()
    return left,up,fwd
def guitar_rot(left,up,fwd,th,psi,phi):
    th,psi,phi=map(math.radians,(th,psi,phi))
    d=(left*math.cos(th)*math.cos(psi)+up*math.sin(th)+fwd*math.cos(th)*math.sin(psi)).normalized()
    n=(fwd-d*fwd.dot(d)).normalized()
    n=(Quaternion(d,-phi)@n).normalized()  # tilt face upward
    y=-n; x=y.cross(d).normalized(); y=d.cross(x).normalized()
    return Matrix((x,y,d)).transposed(), n
def collides(bvh,R,pos,s,pts,margin=0.015):
    Ri=R.transposed()
    for p in pts:
        q=Ri@(p-pos)/s
        if abs(q.z+0.4)>1.0 or abs(q.x)>0.5 or abs(q.y)>0.2+margin/s: continue
        hit,nrm,idx,dist=bvh.find_nearest(q)
        if hit is None: continue
        if dist<margin/s or (q-hit).dot(nrm)<0: return True
    return False
