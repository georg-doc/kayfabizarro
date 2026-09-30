import bpy, bmesh, numpy as np, math, json
# Inputs next to this script: FB_TEMPLATE_LOOK_v5.glb (ear-rig/glb @19088b14) and kfb-pet-frizzlebob-earrig-v5.json (Georg export 2026-09-30). Outputs go to /tmp/fbe/.
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath='FB_TEMPLATE_LOOK_v5.glb')
dg=bpy.context.evaluated_depsgraph_get()
def world_mesh(name):
    o=bpy.data.objects[name].evaluated_get(dg); me=o.to_mesh(); bm=bmesh.new(); bm.from_mesh(me); bm.transform(o.matrix_world); o.to_mesh_clear(); return bm
H=world_mesh('CharacterTemplate_Head'); bvh=BVHTree.FromBMesh(H)
V=np.array([v.co[:] for v in H.verts]); lo,hi=V.min(0),V.max(0); lc=(lo+hi)/2; U=(hi[2]-lo[2])/2
print('head bbox',lo.round(3),hi.round(3),'U',round(U,4))
P=json.load(open('kfb-pet-frizzlebob-earrig-v5.json'))['pets'][0]['eye']
A=P['anchor']; R=U*A['ring']; k=0.24+P['inset']*1.15; ov=P['oval']
print('anchor',A,'R',round(R,4),'depth k',k,'oval',ov)
FWD=Vector((0,-1,0))
def normal_at(p, rad):
    # area-weighted mean face normal of head faces within rad of p
    n=Vector(); 
    for f in H.faces:
        c=f.calc_center_median()
        if (c-p).length<rad: n+=f.normal*f.calc_area()
    return n.normalized()
def sdist(p):
    loc,nrm,idx,d=bvh.find_nearest(p); s=(p-loc).dot(nrm); return math.copysign(d,s)   # + outside, - inside
out={}
for side,sx in (('L',1),('R',-1)):   # three.js +x = Blender +x ; FB_Eye_L sits at +x
    ex=lc[0]+sx*U*A['dx']; ez=lc[2]+U*A['dy']
    o=Vector((ex,-3.5*U+lc[1],ez)); hit,nrm,idx,d=bvh.ray_cast(o,-FWD)
    S=hit; C_now=S+FWD*(-R*k)      # rig v6: centre = hit - R*k along the (straight) view axis
    n=normal_at(S,R*1.2)
    yaw=math.degrees(math.atan2(n.x,-n.y)); pitch=math.degrees(math.asin(max(-1,min(1,n.z))))
    # current canthi: eye-local +-X, oval w scaling, tilt around view axis (e.rotation.z = -sx*tilt; three z-axis = Blender -y)
    t=math.radians(-(-1 if side=='R' else 1)*ov['tilt'])   # three sx: left eye index0 sx=-1 at -x ... map below
    res={'surfaceHit':[round(x,4) for x in S],'normal':[round(x,4) for x in n],'normalYawOutDeg':round(sx*yaw,1),'normalPitchUpDeg':round(pitch,1)}
    # current rig: hinge axis = world X (splay 0), tilt ignored for depth test of the corners at the equator
    for label,hax,cen in (('current',Vector((1,0,0)),C_now),):
        K=[cen+hax*R*ov['w'], cen-hax*R*ov['w']]
        res[label]={'eyeCentre':[round(x,4) for x in cen],'cornerSignedDistToHeadM':[round(sdist(p),4) for p in K],'cornerNames':['toward +x','toward -x']}
    # proposed: socket frame from the surface normal, centre along the normal
    C_new=S-n*R*k
    h=Vector((0,0,1)).cross(n).normalized()   # horizontal tangent
    K=[C_new+h*R*ov['w'], C_new-h*R*ov['w']]
    res['proposed']={'eyeCentre':[round(x,4) for x in C_new],'hinge':[round(x,4) for x in h],'cornerSignedDistToHeadM':[round(sdist(p),4) for p in K]}
    # protrusion of the eyeball: fraction of a ring of rim points outside the head
    out[side]=res
    print(side,json.dumps(res))
json.dump({'U':U,'R':R,'k':k,'eyes':out},open('/tmp/fbe/measure.json','w'),indent=1)
