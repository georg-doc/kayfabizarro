import math
def R(yaw,v):
    a=math.radians(yaw); return (v[0]*math.cos(a)-v[1]*math.sin(a), v[0]*math.sin(a)+v[1]*math.cos(a))
def door(off,yaw,depth): d=R(yaw,(0,-(depth/2+0.12))); return (round(off[0]+d[0],3),round(off[1]+d[1],3))
S1={'id':'SCENELET_1CELL','title':'Rule-of-Three clearing on one grass cell',
 'cells':[{'cell':[0,0],'key':'hex|hex_grass','rotTurns':0,'level':0}],
 'props':[
  {'role':'leader','source':'procedural','id':'P0B_TREE','cell':[0,0],'offset':[0.12,0.30],'yawDeg':20,'palette':'foliage','required':True,'tier':'L'},
  {'role':'support','source':'procedural','id':'T3_BUSH','cell':[0,0],'offset':[-0.42,0.05],'yawDeg':0,'palette':'foliage','required':False,'tier':'M','density':'TARGET'},
  {'role':'support','source':'procedural','id':'T3_BUSH','cell':[0,0],'offset':[0.55,0.0],'yawDeg':130,'scaleMul':0.62,'palette':'foliage','required':False,'tier':'S','density':'TARGET'},
  {'role':'accent','source':'procedural','id':'K1_BOULDER','cell':[0,0],'offset':[-0.25,-0.45],'yawDeg':35,'palette':'rock','required':True,'tier':'M'},
  {'role':'ground','source':'procedural','id':'SOFT_GRASS_TUFT','cell':[0,0],'offset':[0.35,-0.42],'yawDeg':10,'palette':'grass','required':False,'tier':'S','density':'TARGET'},
  {'role':'ground','source':'procedural','id':'SOFT_GRASS_TUFT','cell':[0,0],'offset':[-0.62,-0.25],'yawDeg':200,'scaleMul':0.8,'palette':'grass','required':False,'tier':'S','density':'MAX'},
  {'role':'detail','source':'procedural','id':'SOFT_MUSHROOM_GROUP3','cell':[0,0],'offset':[0.30,0.52],'yawDeg':60,'palette':'mush','required':False,'tier':'S','density':'MAX'},
  {'role':'accent-small','source':'procedural','id':'P0B_PEBBLE','cell':[0,0],'offset':[0.05,-0.62],'yawDeg':80,'scaleMul':0.5,'palette':'rock','required':False,'tier':'S','density':'MAX'}],
 'anchors':[{'id':'rest_under_tree','cell':[0,0],'offset':[0.08,-0.18],'facingDeg':200,'kind':'resident-idle'},
            {'id':'look_out','cell':[0,0],'offset':[0.62,-0.55],'facingDeg':-30,'kind':'resident-idle'}]}
S2={'id':'SCENELET_2CELL','title':'Beach to uphill road (coast + sloped road, directed height relation)',
 'cells':[{'cell':[0,0],'key':'hex|hex_coast_B','rotTurns':0,'level':0},{'cell':[1,0],'key':'hex|hex_road_A_sloped_high','rotTurns':0,'level':0}],
 'props':[
  {'role':'leader','source':'procedural','id':'T3_ACCENT_ROCK','cell':[0,0],'offset':[-0.05,0.55],'yawDeg':15,'palette':'rock','required':True,'tier':'L'},
  {'role':'companion','source':'procedural','id':'K1_BOULDER','cell':[0,0],'offset':[0.45,0.62],'yawDeg':70,'scaleMul':0.62,'palette':'rock','required':False,'tier':'M','density':'TARGET'},
  {'role':'companion','source':'procedural','id':'P0B_PEBBLE','cell':[0,0],'offset':[-0.62,0.1],'yawDeg':10,'scaleMul':0.44,'palette':'rock','required':False,'tier':'S','density':'TARGET'},
  {'role':'ground','source':'procedural','id':'SOFT_GRASS_TUFT','cell':[0,0],'offset':[-0.45,0.62],'yawDeg':40,'palette':'grass','required':False,'tier':'S','density':'MAX'},
  {'role':'separator','source':'procedural','id':'SOFT_LOG_SEPARATOR','cell':[1,0],'offset':[0.0,0.42],'yawDeg':90,'palette':'wood','required':True,'tier':'M'},
  {'role':'detail','source':'procedural','id':'SOFT_STUMP_ROUND','cell':[1,0],'offset':[0.45,0.58],'yawDeg':0,'palette':'wood','required':False,'tier':'S','density':'TARGET'},
  {'role':'detail','source':'procedural','id':'SOFT_MUSHROOM_NORMAL','cell':[1,0],'offset':[0.52,0.72],'yawDeg':0,'palette':'mush','required':False,'tier':'S','density':'MAX'},
  {'role':'ground','source':'procedural','id':'SOFT_GRASS_TUFT','cell':[1,0],'offset':[0.35,-0.62],'yawDeg':120,'scaleMul':0.8,'palette':'grass','required':False,'tier':'S','density':'MAX'}],
 'anchors':[{'id':'beach_lookout','cell':[0,0],'offset':[-0.55,-0.15],'facingDeg':180,'kind':'resident-idle'},
            {'id':'road_foot','cell':[1,0],'offset':[-0.75,0.0],'facingDeg':-90,'kind':'path-node'},
            {'id':'road_top','cell':[1,0],'offset':[0.75,0.0],'facingDeg':-90,'kind':'path-node'}]}
tav=(-0.05,0.0); home=(0.05,-0.05)
S3={'id':'SCENELET_3CELL','title':'Tavern plaza: authored hero buildings + well + procedural nature cluster',
 'cells':[{'cell':[0,0],'key':'hex|hex_grass','rotTurns':0,'level':0},{'cell':[1,0],'key':'hex|hex_road_M','rotTurns':3,'level':0},{'cell':[0,1],'key':'hex|hex_grass','rotTurns':0,'level':0}],
 'props':[
  {'role':'hero-building','source':'authored','key':'hex|building_tavern_blue','cell':[0,0],'offset':list(tav),'yawDeg':90,'required':True,'tier':'XL'},
  {'role':'social-focus','source':'authored','key':'hex|building_well_blue','cell':[1,0],'offset':[0.05,0.0],'yawDeg':90,'required':True,'tier':'M'},
  {'role':'normal-building','source':'authored','key':'hex|building_home_A_blue','cell':[0,1],'offset':list(home),'yawDeg':150,'required':True,'tier':'L'},
  {'role':'prop','source':'authored','key':'hex|barrel','cell':[1,0],'offset':[-0.55,0.55],'yawDeg':0,'required':False,'tier':'S','density':'TARGET'},
  {'role':'prop','source':'authored','key':'hex|crate_A_big','cell':[1,0],'offset':[-0.35,0.68],'yawDeg':20,'required':False,'tier':'S','density':'TARGET'},
  {'role':'prop','source':'authored','key':'hex|sack','cell':[1,0],'offset':[-0.62,0.32],'yawDeg':40,'required':False,'tier':'S','density':'MAX'},
  {'role':'leader','source':'procedural','id':'P0B_TREE','cell':[0,1],'offset':[-0.55,0.35],'yawDeg':0,'palette':'foliage','required':True,'tier':'L'},
  {'role':'support','source':'procedural','id':'T3_BUSH','cell':[0,1],'offset':[-0.72,-0.15],'yawDeg':50,'scaleMul':0.62,'palette':'foliage','required':False,'tier':'S','density':'TARGET'},
  {'role':'accent','source':'procedural','id':'P0B_PEBBLE','cell':[0,1],'offset':[-0.2,-0.68],'yawDeg':0,'scaleMul':0.6,'palette':'rock','required':False,'tier':'S','density':'TARGET'},
  {'role':'detail','source':'procedural','id':'SOFT_MUSHROOM_GROUP3','cell':[0,1],'offset':[-0.35,0.62],'yawDeg':0,'palette':'mush','required':False,'tier':'S','density':'MAX'},
  {'role':'ground','source':'procedural','id':'SOFT_GRASS_TUFT','cell':[0,0],'offset':[-0.7,0.45],'yawDeg':0,'palette':'grass','required':False,'tier':'S','density':'MAX'},
  {'role':'separator','source':'procedural','id':'SOFT_LOG_STACK3','cell':[0,0],'offset':[0.55,0.62],'yawDeg':30,'palette':'wood','required':False,'tier':'S','density':'TARGET'}],
 'anchors':[{'id':'tavern_door','cell':[0,0],'offset':list(door(tav,90,1.33)),'facingDeg':90+180,'kind':'building-door'},
            {'id':'home_door','cell':[0,1],'offset':list(door(home,150,1.05)),'facingDeg':150+180,'kind':'building-door'},
            {'id':'gather_1','cell':[1,0],'offset':[0.05,-0.55],'facingDeg':90,'kind':'social-spot'},
            {'id':'gather_2','cell':[1,0],'offset':[0.55,0.3],'facingDeg':210,'kind':'social-spot'},
            {'id':'gather_3','cell':[1,0],'offset':[-0.45,-0.25],'facingDeg':330,'kind':'social-spot'}]}
ALL=[S1,S2,S3]
