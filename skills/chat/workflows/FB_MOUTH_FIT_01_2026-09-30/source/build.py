# FB-MOUTH-FIT-01 reference: ToolBox placement of the painted model mouth (rigid PartRig) vs conformed to the head skin
import bpy, bmesh, numpy as np, math, json, sys
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
PET=json.load(open('/root/.claude/uploads/9739e4d7-eb48-5210-ae61-4cd82525f150/3fe7df17-kfb-pet-frizzlebob-earrig-v5.georg-2026-09-30_2.json'))['pets'][0]
PR=PET['original']['mouth']; EPS=0.004
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath='/tmp/fbe/FB_TEMPLATE_LOOK_v5.glb')
for n in ('Icosphere','Grid','FB_Eye_L','FB_Eye_R','Carl_Nose'):
    if n in bpy.data.objects: bpy.data.objects[n].hide_render=True
dg=bpy.context.evaluated_depsgraph_get()
h=bpy.data.objects['CharacterTemplate_Head'].evaluated_get(dg); hm=h.to_mesh(); HB=bmesh.new(); HB.from_mesh(hm); HB.transform(h.matrix_world); bvh=BVHTree.FromBMesh(HB)
def sd(p):
    loc,nrm,i,d=bvh.find_nearest(Vector(p)); return math.copysign(d,(Vector(p)-loc).dot(nrm))
M=bpy.data.objects['FB_Mouth_Smile']; me=M.data
W0=[M.matrix_world@v.co for v in me.vertices]
c=sum(W0,Vector())/len(W0); c=Vector(((min(v.x for v in W0)+max(v.x for v in W0))/2,(min(v.y for v in W0)+max(v.y for v in W0))/2,(min(v.z for v in W0)+max(v.z for v in W0))/2))
# PartRig about its own centre: scale, pitch about x, then move (three: +y lift = Blender +z, +z depth = Blender -y)
Rx=Matrix.Rotation(math.radians(PR['pitch']),3,'X'); T=Vector((PR['spread'],-PR['depth'],PR['lift']))
W1=[c+T+Rx@((v-c)*PR['scale']) for v in W0]
n_card=(Rx@Vector((0,-1,0))).normalized()     # card faces forward (-y), tilted with the pitch
def conform(W):
    out=[];miss=0
    for v in W:
        hit=bvh.ray_cast(v+n_card*0.6,-n_card,1.5)[0]
        if hit is None: out.append(v); miss+=1
        else: out.append(hit+n_card*EPS)
    return out,miss
W2,miss=conform(W1)
def stats(W):
    d=np.array([sd(v) for v in W]); 
    # also triangle centres (between vertices)
    tc=[]
    for p in me.polygons:
        q=sum((W[i] for i in p.vertices),Vector())/len(p.vertices); tc.append(sd(q))
    tc=np.array(tc)
    return {'vertMinM':round(float(d.min()),4),'vertMaxM':round(float(d.max()),4),'triCentreMinM':round(float(tc.min()),4),'triCentreMaxM':round(float(tc.max()),4)}
rep={'restCardDistanceToSkin':stats(W0),'toolboxRigid':stats(W1),'conformed':stats(W2),'missedRays':miss,'params':PR,'eps':EPS,'cardCentre':[round(x,3) for x in c]}
json.dump(rep,open('/tmp/fbm/measure.json','w'),indent=1); print(json.dumps(rep,indent=1))
# ---- renders ----
Mi=M.matrix_world.inverted()
def setW(W):
    for v,w in zip(me.vertices,W): v.co=Mi@w
    me.update()
sc=bpy.context.scene; sc.render.engine='CYCLES'; sc.cycles.samples=24; sc.cycles.device='CPU'
sc.render.resolution_x=560; sc.render.resolution_y=560; sc.render.film_transparent=False
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; w.node_tree.nodes['Background'].inputs[0].default_value=(0.82,0.8,0.76,1); w.node_tree.nodes['Background'].inputs[1].default_value=0.9
bpy.ops.object.light_add(type='SUN',location=(2,-3,4)); L=bpy.context.object; L.data.energy=3.2; L.rotation_euler=(math.radians(50),0,math.radians(30))
bpy.ops.object.camera_add(); cam=bpy.context.object; sc.camera=cam; cam.data.lens=150
tgt=Vector((0,-0.3,1.45))
views={'front':(0,-1,0.05),'three_quarter':(0.8,-0.6,0.08),'side':(1,-0.05,0.05),'top':(0.02,-0.25,1)}
tiles=[]
for mode,W in (('toolbox',W1),('conformed',W2)):
    setW(W); row=[]
    for vn,d in views.items():
        dv=Vector(d).normalized(); cam.location=tgt+dv*4.2; cam.rotation_euler=(tgt-cam.location).to_track_quat('-Z','Y').to_euler()
        p=f'/tmp/fbm/_{mode}_{vn}.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
        im=bpy.data.images.load(p); row.append(np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4)); bpy.data.images.remove(im)
    tiles.append(np.concatenate(row,axis=1))
full=np.concatenate(tiles[::-1],axis=0)
img=bpy.data.images.new('s',full.shape[1],full.shape[0]); img.pixels.foreach_set(full.ravel()); img.filepath_raw='/tmp/fbm/before_after.png'; img.file_format='PNG'; img.save(); print('OK')
