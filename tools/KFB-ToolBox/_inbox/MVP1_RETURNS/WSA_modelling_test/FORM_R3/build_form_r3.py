import bpy, math, json, os
from pathlib import Path
from mathutils import Vector
ROOT=Path('/private/tmp/kfb-wsa-stairs-r3');OUT=ROOT/'output'
H=3.64;WIDTH=10.92
RISES=[.62,.66,.59,.68,.61,.65,.60,.67]
RUNS=[1.70,1.82,1.66,1.86,1.73,1.79,1.65,1.76]
TOTAL=sum(RUNS)+4;HEIGHT=sum(RISES)
def aim(o,t):o.rotation_euler=(Vector(t)-o.location).to_track_quat('-Z','Y').to_euler()
def neutral(name,value):
 m=bpy.data.materials.new(name);m.diffuse_color=(value,value,value,1);m.use_nodes=True
 p=m.node_tree.nodes['Principled BSDF'];p.inputs['Base Color'].default_value=m.diffuse_color;p.inputs['Roughness'].default_value=.86
 return m
def stone(name,family,cx,y0,y1,z0,z1,w,seed,bevel=.14,slope=0,topflat=False):
 # Authored eight-corner outlines, shifted shoulders and broad chamfers. No sinusoidal surface/noise.
 # Ring widths differ deliberately; bearing surfaces stay planar and closed.
 a=.18+.025*(seed%3);b=.24+.03*((seed+1)%3)
 outline=[(-1,-1+a),(-1+a,-1),(1-b,-1),(1,-1+b),(1,1-a),(1-a,1),(-1+b,1),(-1,1-b)]
 verts=[]
 for ring in range(2):
  for i,(x,y) in enumerate(outline):
   skew=0 if topflat else ((seed%3)-1)*.045*(y+1)/2
   xx=cx+x*w/2+skew;yy=y0+(y+1)/2*(y1-y0)
   # slight intentional front-outline differences, with continuous flat treads
   if family=='tread' and y<-.8: yy+=.035*((seed%3)-1)*(x+1)/2
   zz=z0 if ring==0 else z1+slope*(yy-y0)
   verts.append((xx,yy,zz))
 faces=[tuple(range(7,-1,-1)),tuple(range(8,16))]
 for i in range(8):j=(i+1)%8;faces.append((i,j,8+j,8+i))
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
 o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o)
 o['form_family']=family;o['bearing_z']=z0;o['architecture_role']=name
 o.data.materials.append(MATS[family]);bpy.context.view_layer.objects.active=o;o.select_set(True)
 mod=o.modifiers.new('Hand rounded arris','BEVEL');mod.width=bevel;mod.segments=3
 bpy.ops.object.modifier_apply(modifier=mod.name);o.select_set(False)
 # normals point outwards independently of ring orientation
 import bmesh
 bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(o.data);bm.free()
 return o
bpy.ops.wm.read_factory_settings(use_empty=True)
MATS={f:neutral('QA_gray_'+f,v) for f,v in [('tread',.58),('bearing',.48),('crown',.58),('pillar',.52),('landing',.58)]}
asset=[];y=0;z=0;steps=[]
for i,(rise,run) in enumerate(zip(RISES,RUNS)):
 z+=rise
 # Grounded full-depth riser stones maintain continuous load path; seam only at vertical fronts.
 o=stone('Tread_%02d'%(i+1),'tread',0,y-.06,y+run+.06,0,z,11.32,i,.085,topflat=True);asset.append(o)
 steps.append(dict(index=i+1,y_start=y,y_end=y+run,z=z));y+=run
asset.append(stone('Landing_endstone','landing',0,y-.08,TOTAL,0,HEIGHT,11.32,12,.11,topflat=True))
wall_records=[]
for side,sign in [('L',-1),('R',1)]:
 cx=sign*6.58
 # Three broad foundation stones; upper joints offset from foundation joints.
 basecuts=[.4,5.9+(0.2 if side=='R' else 0),12.5,TOTAL]
 for i,(a,b) in enumerate(zip(basecuts,basecuts[1:])):
  asset.append(stone('Foundation_%s_%d'%(side,i),'bearing',cx,a-.05,b+.05,0,1.32,1.92,i+4,.13))
 cuts=[.45,4.3+(0.3 if side=='R' else 0),8.9,13.65,TOTAL]
 # Four large hand-set masonry bodies. Their slope follows the stair, but the base/course and joints read as construction.
 for i,(a,b) in enumerate(zip(cuts,cuts[1:])):
  top=2.16+.286*a
  asset.append(stone('WallTragstein_%s_%d'%(side,i),'bearing',cx,a-.05,b+.05,1.20,top,1.76,i+7,.14,slope=.286))
  wall_records.append(dict(side=side,start=a,end=b,bearing=1.20,upper_start=top,slope=.286))
 crowns=[.45,3.45+(0.2 if side=='R' else 0),7.35,11.3,15.0,TOTAL]
 for i,(a,b) in enumerate(zip(crowns,crowns[1:])):
  bottom=2.16+.286*(a-.07)-.08
  asset.append(stone('Crown_%s_%d'%(side,i),'crown',cx,a-.07,b+.07,bottom,bottom+.44,1.98,i+13,.14,slope=.286))
 # Planned upper termination is a wider end-block at landing, not a free ramp tip.
 asset.append(stone('Upper_termination_'+side,'landing',cx,TOTAL-1.15,TOTAL+.20,0,7.72,2.15,17,.19))
 # Two lower terminal pillars: visible load-bearing foot, squat shaft, overhanging cap.
 pcx=sign*7.12
 for zone,sy0,sy1,sz0,sz1,w,bv in [('foot',-.96,1.70,0,.78,3.04,.17),('shaft',-.65,1.32,.65,3.00,2.40,.17),('cap',-.95,1.64,2.88,3.58,3.05,.22)]:
  asset.append(stone('Pillar_%s_%s'%(side,zone),'pillar',pcx,sy0,sy1,sz0,sz1,w,21 if side=='L' else 23,bv))
for o in asset:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'KFB_TOWN_CASTLE_STAIRS_FORM_R3.glb'),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_extras=True)
for o in asset:o.select_set(False)
scene=bpy.context.scene;scene.world=bpy.data.worlds.new('NeutralWorld');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.38,.38,.38,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.5
scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=1600;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=94;scene.view_settings.look='AgX - Medium High Contrast'
for loc,power,size in [((-12,-14,24),4200,12),((14,5,16),2500,10)]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.size=size;aim(o,(0,8,3))
cameras={'three_quarter':((24,-24,21),(0,8,3),31),'front':((0,-32,11),(0,8,3),27),'side':((30,8,7),(0,8,3),29),'pedestal_detail':((18,-13,10),(6.2,1.8,2.0),11),'upper_detail':((19,23,14),(3,16,5.3),15),'foot_eye':((0,-15,H),(0,8,3),27)}
for name,(loc,target,scale) in cameras.items():
 bpy.ops.object.camera_add(location=loc);cam=bpy.context.object;cam.data.type='ORTHO';cam.data.ortho_scale=scale;aim(cam,target);scene.camera=cam
 scene.render.filepath=str(OUT/'renders/form_gray'/(name+'.jpg'));bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'R3_NEUTRAL_WORK.blend'))
families=[dict(id=f,count=sum(o.get('form_family')==f for o in asset)) for f in MATS]
grammar=dict(schema='kfb.formGrammar.r3/1',H=H,clear_width_target=WIDTH,family_count=len(families),mesh_count=len(asset),families=families,steps=steps,landing=dict(y_start=y,y_end=TOTAL,z=HEIGHT),wall_records=wall_records,pillar_anatomy=['foot','shaft','cap'],materials='NEUTRAL_QA_ONLY',formBeforeMaterials=True,hill_contact='NOT_YET_RUN',human_gate='PENDING')
(OUT/'FORM_GRAMMAR_R3.json').write_text(json.dumps(grammar,indent=2))
(OUT/'camera_lock.json').write_text(json.dumps(cameras,indent=2))
print(json.dumps(dict(meshes=len(asset),families=families,steps=steps)))
