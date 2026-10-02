import sys; sys.path.insert(0,'/tmp/hex/work')
exec(open('/tmp/hex/work/s1p.py').read().split("if __name__")[0])
import math
reset((1200,520)); objs=[]
xs=[0,2.2,4.4,6.6]
r,n=place('hex|hex_grass',Vector((0,0,0))); objs+=n
r,n=place('hex|building_windmill_blue',Vector((0,0,0))); objs+=n
for x in xs[1:]: r,n=place('hex|hex_grass',Vector((x,0,0))); objs+=n
r,n=place('hex|tree_single_A',Vector((2.2,0,0))); objs+=n
objs.append(mkproc('P0B_TREE',Vector((4.4,0,0))))
objs.append(mkproc('SOFT_MUSHROOM_GROUP3',Vector((6.2,-0.3,0)))); objs.append(mkproc('SOFT_LOG_STACK3',Vector((6.9,0.3,0)))); objs.append(mkproc('SOFT_GRASS_TUFT',Vector((6.4,0.5,0))))
for x,t in zip(xs,['windmill 1.46','KayKit tree 1.20','P0B tree 2.18','P2 mushrooms/logs/grass']):
    o=label(t,Vector((x,-1.3,2.75)),size=0.22,color=(0.1,0.1,0.1)); o.rotation_euler=(math.radians(90),0,0)
camera(objs,az=0,el=10,lens=50,margin=0.95); render('/tmp/hex/work/rend/s1p_scale_native.png')
