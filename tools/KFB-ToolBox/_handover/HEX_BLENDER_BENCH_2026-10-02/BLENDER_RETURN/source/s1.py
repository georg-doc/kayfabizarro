import sys; sys.path.insert(0,'/tmp/hex/work')
from bl import *
import math, json
D=['hex|hex_grass','hex|hex_road_B','hex|hex_coast_B','hex|hex_road_A_sloped_high','hex|building_windmill_blue']
facts={}
for k in D:
    sc=reset((700,560)); roots,new=place(k)
    mesh=[o for o in new if o.type=='MESH']
    # vertex height histogram (three y) for deck/water levels
    zs=[]; pts=[]
    for o in mesh:
        for v in o.data.vertices:
            w=o.matrix_world@v.co; zs.append(round(w.z,3)); pts.append(w)
    lv={}
    for z in zs: lv[z]=lv.get(z,0)+1
    f={'levels_threeY_top':sorted(lv.items(),key=lambda t:-t[1])[:6]}
    wat=[p for p in pts if -0.26<p.z<-0.14]
    if wat:
        cx=sum(p.x for p in wat)/len(wat); cy=sum(p.y for p in wat)/len(wat)
        f['waterVerts']=len(wat); f['waterCentroidDeg_threeAtan2zx']=round(math.degrees(math.atan2(-cy,cx))%360,1)
    facts[k]=f
    tile='building' not in k
    camera(new,az=35,el=32,lens=50,margin=1.05 if tile else 1.2); render(f'/tmp/hex/work/rend/s1_{k.split("|")[1]}_34.png')
    if tile:
        edge_labels(z=0.05 if 'sloped' not in k else 1.05)
        cam=camera(new,az=0,el=90,ortho=True,margin=1.0); cam.rotation_euler=(0,0,0)
        render(f'/tmp/hex/work/rend/s1_{k.split("|")[1]}_top.png')
    else:
        camera(new,az=-145,el=20,lens=50,margin=1.2); render(f'/tmp/hex/work/rend/s1_{k.split("|")[1]}_back.png')
json.dump(facts,open('/tmp/hex/work/s1_facts.json','w'),indent=1)
print(json.dumps(facts,indent=0))
