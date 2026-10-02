import sys; sys.path.insert(0,'/tmp/hex/work')
from bl import *
import math,json
res={}
for k in [k for k in PATH if 'sloped' in k]:
    reset(); roots,new=place(k); bpy.context.view_layer.update(); dg=bpy.context.evaluated_depsgraph_get()
    out=[]
    for i in range(7):
        if i<6:
            a=math.radians(60*i); p=three2bl(math.cos(a)*0.9,0,math.sin(a)*0.9)
        else: p=Vector((0,0,0))
        hit,loc,*_=bpy.context.scene.ray_cast(dg,Vector((p.x,p.y,5)),Vector((0,0,-1)))
        out.append(round(loc.z,3) if hit else None)
    res[k]={'edgeMid0to5':out[:6],'centre':out[6]}
print(json.dumps(res)); json.dump(res,open('/tmp/hex/work/ramp_edges.json','w'))
