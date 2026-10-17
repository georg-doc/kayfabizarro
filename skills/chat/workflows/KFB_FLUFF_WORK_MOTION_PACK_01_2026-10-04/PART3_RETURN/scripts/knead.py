# Irregular "kneaded" Fluff lump (unit radius; scale by R). Clay look: low-frequency lumps, 3-5 thumb dents, slight squash.
import bpy, math, random
from mathutils import Vector
def kneaded(name='fluff', seed=7, subdiv=5, lump=0.13, dents=4, dent_depth=0.10, squash=(1.05,0.97,0.92)):
    rnd=random.Random(seed)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdiv,radius=1.0); o=bpy.context.active_object; o.name=name
    tx=bpy.data.textures.new(name+'_lump','CLOUDS'); tx.noise_scale=0.85; tx.noise_depth=1
    d=o.modifiers.new('lump','DISPLACE'); d.texture=tx; d.texture_coords='LOCAL'; d.strength=lump*2; d.mid_level=0.5
    bpy.ops.object.modifier_apply(modifier='lump')
    cs=[]
    for i in range(dents):
        v=Vector((rnd.uniform(-1,1),rnd.uniform(-1,1),rnd.uniform(-0.6,1))).normalized(); cs.append((v,rnd.uniform(0.28,0.45),dent_depth*rnd.uniform(0.6,1.2)))
    for vt in o.data.vertices:
        n=vt.co.normalized(); s=1.0
        for c,w,dep in cs:
            a=n.angle(c); s-=dep*math.exp(-(a/w)**2)
        vt.co=vt.co*s
        vt.co.x*=squash[0]; vt.co.y*=squash[1]; vt.co.z*=squash[2]
    # re-centre so the lowest point sits at -1 (rests on the ground when placed at z=R)
    zmin=min(v.co.z for v in o.data.vertices)
    for vt in o.data.vertices: vt.co.z+=(-1-zmin)
    bpy.ops.object.shade_smooth(); return o
