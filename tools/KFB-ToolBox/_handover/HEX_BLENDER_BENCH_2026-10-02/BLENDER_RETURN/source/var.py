import sys; sys.path.insert(0,'/tmp/hex/work')
from bl import *
import hashlib, json
types=['archeryrange','barracks','blacksmith','castle','church','home_A','home_B','lumbermill','market','mine','tavern','tower_A','tower_B','tower_base','tower_catapult','watermill','well','windmill']
res={}
def sig(key,uv=False):
    reset(); roots,new=place(key); h=hashlib.sha1(); 
    for o in sorted([x for x in new if x.type=='MESH'],key=lambda x:x.data.name.rsplit('_',1)[0]):
        me=o.data
        if uv:
            for d in me.uv_layers[0].data: h.update(('%.4f,%.4f'%tuple(d.uv)).encode())
        else:
            for v in me.vertices: h.update(('%.4f,%.4f,%.4f'%tuple(o.matrix_world@v.co)).encode())
    return h.hexdigest()[:10]
for t in types:
    g=[sig(f'hex|building_{t}_{c}') for c in ['blue','green','red','yellow']]
    u=[sig(f'hex|building_{t}_{c}',True) for c in ['blue','green','red','yellow']]
    res[t]={'geomIdentical':len(set(g))==1,'uvDistinct':len(set(u))}
# builder deck heights
deck={}
for k in ['builder|hex_forest','builder|hex_rock','builder|hex_sand','builder|hex_water','hex|hex_grass']:
    reset(); place(k); bpy.context.view_layer.update(); dg=bpy.context.evaluated_depsgraph_get()
    hit,loc,*_=bpy.context.scene.ray_cast(dg,Vector((0.3,0.3,5)),Vector((0,0,-1))); deck[k]=round(loc.z,3) if hit else None
print(json.dumps(res)); print(deck)
json.dump({'colourVariants':res,'deckThreeY':deck},open('/tmp/hex/work/variants.json','w'),indent=1)
