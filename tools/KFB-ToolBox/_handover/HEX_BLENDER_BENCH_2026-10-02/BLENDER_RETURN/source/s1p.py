import sys; sys.path.insert(0,'/tmp/hex/work')
from bl import *
import json
G=json.load(open('/tmp/hex/proc/proc_geoms.json'))
def mkproc(id,loc=Vector(),s=1.0,col=(0.62,0.6,0.56)):
    g=G[id]; p=g['pos']; V=[three2bl(p[i],p[i+1],p[i+2]) for i in range(0,len(p),3)]
    idx=g['index'] or list(range(len(V)))
    F=[(idx[i],idx[i+1],idx[i+2]) for i in range(0,len(idx),3)]
    me=bpy.data.meshes.new(id); me.from_pydata(V,[],F); me.update()
    for poly in me.polygons: poly.use_smooth=True
    o=bpy.data.objects.new(id,me); o.location=loc; o.scale=(s,s,s); bpy.context.scene.collection.objects.link(o)
    o.color=(*col,1); me.materials.append(proc_mat()); return o
def proc_mat():
    m=bpy.data.materials.get('KFB_proc_shared')
    if m: return m
    m=bpy.data.materials.new('KFB_proc_shared'); m.use_nodes=True; nt=m.node_tree
    oi=nt.nodes.new('ShaderNodeObjectInfo'); bs=nt.nodes['Principled BSDF']; bs.inputs['Roughness'].default_value=0.8
    nt.links.new(oi.outputs['Color'],bs.inputs['Base Color']); return m
if __name__=='__main__':
    for id in G:
        reset((420,360)); o=mkproc(id); camera([o],az=30,el=22,lens=50,margin=1.15); render(f'/tmp/hex/work/rend/s1p_{id}.png')
    # native-unit scale strip
    reset((1400,520))
    objs=[]
    r,n=place('hex|hex_grass',Vector((0,0,0))); objs+=n
    r,n=place('hex|building_windmill_blue',Vector((0,0,0))); objs+=n
    r,n=place('hex|tree_single_A',Vector((2.2,0,0))); objs+=n
    r,n=place('hex|hex_grass',Vector((2.2,0,0))); objs+=n
    objs.append(mkproc('P0B_TREE',Vector((4.6,0,0))))
    r,n=place('hex|hex_grass',Vector((4.6,0,0))); objs+=n
    objs.append(mkproc('T3_ACCENT_ROCK',Vector((12,0,0))))
    objs.append(mkproc('SOFT_MUSHROOM_GROUP3',Vector((6.4,-0.4,0))))
    objs.append(mkproc('SOFT_LOG_STACK3',Vector((6.6,0.6,0))))
    for i,t in enumerate(['hex tile + windmill','KayKit tree_single_A','P0B_TREE (native)','T3_ACCENT_ROCK (native)']):
        label(t,Vector(([0,2.2,4.6,12][i],-1.8 if i<3 else -6,0.02)),size=0.32,color=(0.1,0.1,0.1))
    camera(objs,az=0,el=12,lens=35,margin=1.0); render('/tmp/hex/work/rend/s1p_scale_native.png')
