
import bpy, json, math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
def bvh_world(ob,dg):
    e=ob.evaluated_get(dg); me=e.to_mesh(); mw=ob.matrix_world
    vs=[mw@v.co for v in me.vertices]; ps=[tuple(p.vertices) for p in me.polygons]
    e.to_mesh_clear(); return BVHTree.FromPolygons(vs,ps), vs
def pen_depth(pts,bvh):
    worst=0.0
    for p in pts:
        loc,nor,i,d=bvh.find_nearest(p)
        if loc is None: continue
        if (p-loc).dot(nor)<0: worst=max(worst,d)
    return worst
def run_checks(frames, out):
    sc=bpy.data.scenes['DRUM_MANUAL']; res=[]
    for f in frames:
        sc.frame_set(f); dg=bpy.context.evaluated_depsgraph_get()
        drum,_=bvh_world(sc.objects['DR_drum_main'],dg)
        row={'f':f}
        for s,n in (('r','Orc_WardrumStick.R_DR'),('l','Orc_WardrumStick_DR')):
            _,sv=bvh_world(sc.objects[n],dg)
            row['club_drum_'+s]=round(pen_depth(sv,drum),3)
            row['club_minz_'+s]=round(min(v.z for v in sv),3)
            hb,_=bvh_world(sc.objects['OrcBrute_Head_DR'],dg)
            row['club_head_'+s]=round(pen_depth(sv,hb),3)
            bb,_=bvh_world(sc.objects['OrcBrute_Body_DR'],dg)
            row['club_body_'+s]=round(pen_depth(sv,bb),3)
        for n in ('OrcBrute_ArmLeft_DR','OrcBrute_ArmRight_DR'):
            _,av=bvh_world(sc.objects[n],dg); row['arm_drum_'+n[9:12]]=round(pen_depth(av,drum),3)
        res.append(row)
    json.dump(res,open(out,'w')); return res
