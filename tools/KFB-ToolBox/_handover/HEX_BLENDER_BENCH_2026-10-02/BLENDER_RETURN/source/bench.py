import sys; sys.path.insert(0,'/tmp/hex/work')
exec(open('/tmp/hex/work/s1p.py').read().split("if __name__")[0])
from clay import apply_clay_lite
import json, math
PAL={'foliage':(0.13,0.42,0.22),'bark':(0.42,0.22,0.12),'rock':(0.42,0.44,0.46),'mush':(0.75,0.25,0.18),'grass':(0.45,0.62,0.18),'wood':(0.50,0.30,0.16)}
def proc(id,loc,s,col,rot=0):
    o=mkproc(id,loc,s,PAL[col]); o.rotation_euler=(0,0,math.radians(rot)); return o
def diorama():
    objs=[]
    for key,cell,rot in [('hex|hex_grass',(0,0),0),('hex|hex_road_B',(1,0),0),('hex|hex_coast_B',(0,1),0),('hex|hex_grass',(1,1),0),('hex|hex_grass',(-1,1),0)]:
        r,n=place(key,cell_xy(*cell),rot); objs+=n
    r,n=place('hex|building_home_A_blue',cell_xy(0,0)+Vector((0.1,0.1,0)),210); objs+=n
    r,n=place('hex|building_windmill_blue',cell_xy(1,1),150); objs+=n
    c=cell_xy(-1,1)
    objs.append(proc('P0B_TREE',c+Vector((0.2,0.15,0)),0.55,'foliage'))
    objs.append(proc('T3_BUSH',c+Vector((-0.45,-0.2,0)),0.045,'foliage'))
    objs.append(proc('T3_BUSH',c+Vector((0.55,-0.35,0)),0.035,'foliage',40))
    objs.append(proc('P0B_PEBBLE',c+Vector((-0.2,-0.6,0)),0.3,'rock'))
    objs.append(proc('SOFT_MUSHROOM_GROUP3',cell_xy(0,0)+Vector((-0.6,-0.35,0)),0.8,'mush'))
    objs.append(proc('SOFT_GRASS_TUFT',cell_xy(1,0)+Vector((0.6,0.5,0)),0.45,'grass'))
    return objs
if __name__=='__main__':
    res={}
    for mode,ws in [('neutral',None),('clayfloor_ws8.66',8.66),('clayfloor_ws1',1.0)]:
        reset((900,620)); objs=diorama()
        mats=sorted({s.material for o in objs if o.type=='MESH' for s in o.material_slots if s.material},key=lambda m:m.name)
        if ws:
            for m in mats: apply_clay_lite(m,ws)
        imgs={n.image.name for m in mats for n in m.node_tree.nodes if n.type=='TEX_IMAGE' and n.image}
        res[mode]={'materials':[m.name for m in mats],'materialCount':len(mats),'images':sorted(imgs),'imageCount':len(imgs)}
        camera(objs,az=30,el=34,lens=45,margin=0.92); render(f'/tmp/hex/work/rend/mat_{mode}_overview.png')
        tgt=cell_xy(0,0)+Vector((0.1,0.1,0.45))
        cam=camera(objs,az=20,el=18,lens=60,target=tgt,margin=0.25); render(f'/tmp/hex/work/rend/mat_{mode}_close.png')
    json.dump(res,open('/tmp/hex/work/material_counts.json','w'),indent=1); print(json.dumps(res))
