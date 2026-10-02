import sys; sys.path.insert(0,'/tmp/hex/work')
from bl import *
import bmesh, json, math
C=['hex|building_home_A_blue','hex|building_home_B_blue','hex|building_tavern_blue','hex|building_church_blue','hex|building_blacksmith_blue','hex|building_well_blue','hex|building_market_blue','hex|building_windmill_blue','builder|house','builder|market','builder|well','builder|mill']
res={}
for k in C:
    reset(); roots,new=place(k)
    ms=[o for o in new if o.type=='MESH']
    isl=0; faces={'wall':0,'roofSlope':0,'up':0,'down':0}; area={'wall':0,'roofSlope':0,'up':0,'down':0}; ys=set(); parts=[]
    for o in ms:
        bm=bmesh.new(); bm.from_mesh(o.data); bm.transform(o.matrix_world)
        seen=set()
        for f in bm.faces:
            nz=f.normal.z
            c='up' if nz>0.95 else 'down' if nz<-0.95 else 'wall' if abs(nz)<0.2 else 'roofSlope'
            faces[c]+=1; area[c]+=f.calc_area()
        for v in bm.verts: ys.add(round(v.co.z,2))
        for f in bm.faces:
            if f.index in seen: continue
            stack=[f]; comp=[]; seen.add(f.index)
            while stack:
                g=stack.pop(); comp.append(g)
                for e in g.edges:
                    for h in e.link_faces:
                        if h.index not in seen: seen.add(h.index); stack.append(h)
            vs={v for g in comp for v in g.verts}
            zs=[v.co.z for v in vs]; xs=[v.co.x for v in vs]; yy=[v.co.y for v in vs]
            parts.append({'faces':len(comp),'zMin':round(min(zs),3),'zMax':round(max(zs),3),'w':round(max(xs)-min(xs),3),'d':round(max(yy)-min(yy),3)})
        bm.free()
    parts.sort(key=lambda p:-p['faces'])
    mats=sorted({s.material.name for o in ms for s in o.material_slots if s.material})
    res[k]={'meshes':len(ms),'looseParts':len(parts),'largestParts':parts[:6],'faceClass':faces,'areaClass':{a:round(b,3) for a,b in area.items()},'distinctVertexHeights':len(ys),'materials':mats}
    camera(new,az=35,el=25,lens=50,margin=1.15); render(f'/tmp/hex/work/rend/seed_{k.replace("|","__")}_34.png')
    camera(new,az=215,el=25,lens=50,margin=1.15); render(f'/tmp/hex/work/rend/seed_{k.replace("|","__")}_back.png')
json.dump(res,open('/tmp/hex/work/building_structure.json','w'),indent=1)
for k,v in res.items(): print(k,v['meshes'],v['looseParts'],v['faceClass'],v['distinctVertexHeights'],v['largestParts'][:2])
