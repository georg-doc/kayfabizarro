import bpy, json, sys, os, hashlib, subprocess
from mathutils import Vector
R='/tmp/hex/repo/'
M=json.load(open(R+'tools/KFB-ToolBox/_handover/HEX_BLENDER_BENCH_2026-10-02/data/HEX_BROWSER_MEASUREMENTS.json'))
inv=M['hexTiles']['inventory']
out=[]
def t3(v): return [round(v.x,4),round(v.z,4),round(-v.y,4)]  # blender -> glTF/three
for i,row in enumerate(inv):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    p=R+row['path']; rec={'key':row['key'],'path':row['path']}
    try:
        bpy.ops.import_scene.gltf(filepath=p, loglevel=50)
    except Exception as e:
        rec['error']=str(e)[:200]; out.append(rec); continue
    objs=list(bpy.context.scene.objects)
    meshes=[o for o in objs if o.type=='MESH']
    dg=bpy.context.evaluated_depsgraph_get()
    tris=0; verts=0; mn=Vector((1e9,)*3); mx=Vector((-1e9,)*3); mats=set(); imgs=set(); uvs=set(); vcol=False
    for o in meshes:
        me=o.data; me.calc_loop_triangles()
        tris+=len(me.loop_triangles); verts+=len(me.vertices)
        for v in me.vertices:
            w=o.matrix_world@v.co; mn=Vector(map(min,mn,w)); mx=Vector(map(max,mx,w))
        for s in o.material_slots:
            if s.material:
                mats.add(s.material.name)
                if s.material.node_tree:
                    for n in s.material.node_tree.nodes:
                        if n.type=='TEX_IMAGE' and n.image: imgs.add(os.path.basename(n.image.filepath or n.image.name))
        for u in me.uv_layers: uvs.add(u.name)
        if me.color_attributes: vcol=True
    roots=[o for o in objs if o.parent is None]
    rec.update(objects=len(objs),meshObjects=len(meshes),empties=[o.name for o in objs if o.type=='EMPTY'],
        roots=[{'name':o.name,'loc':t3(o.location),'rotQ':[round(x,4) for x in o.rotation_quaternion] if o.rotation_mode=='QUATERNION' else None,'scale':[round(x,4) for x in o.scale]} for o in roots],
        meshNames=sorted(o.data.name for o in meshes),
        tris=tris,verts=verts,materials=sorted(mats),images=sorted(imgs),uvLayers=sorted(uvs),vertexColors=vcol)
    if meshes:
        a=t3(mn); b=t3(mx); lo=[min(a[k],b[k]) for k in range(3)]; hi=[max(a[k],b[k]) for k in range(3)]
        rec.update(min=lo,max=hi,size=[round(hi[k]-lo[k],4) for k in range(3)])
    out.append(rec)
    if i%50==0: print(i,row['key'],flush=True)
json.dump(out,open('/tmp/hex/work/blender_inventory_raw.json','w'),indent=0)
print('done',len(out))
