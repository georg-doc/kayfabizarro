from PIL import Image, ImageDraw, ImageFont
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',16); FB=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',20)
E='/tmp/hex/out/evidence/'
def grid(files,caps,cols,cw,ch,title,out):
    rows=(len(files)+cols-1)//cols
    W=Image.new('RGB',(cols*cw,40+rows*(ch+26)),'white'); d=ImageDraw.Draw(W); d.text((8,8),title,fill='black',font=FB)
    for i,(f,c) in enumerate(zip(files,caps)):
        im=Image.open(f).convert('RGB'); im.thumbnail((cw,ch)); x=(i%cols)*cw; y=40+(i//cols)*(ch+26)
        W.paste(im,(x+(cw-im.width)//2,y)); d.text((x+6,y+ch+3),c,fill='black',font=F)
    W.save(out,quality=88); return W
R='rend/'
D=['hex_grass','hex_road_B','hex_coast_B','hex_road_A_sloped_high']
g1=grid([R+f's1_{d}_{v}.png' for d in D for v in ('34','top')]+[R+'s1_building_windmill_blue_34.png',R+'s1_building_windmill_blue_back.png'],
 [f'{d} · {v}' for d in D for v in ('¾','top, edge labels 0–5')]+['building_windmill_blue · ¾','building_windmill_blue · back'],
 4,420,330,'01 · Source isolation · five fixed Hexagon donors (catalog edge classes confirmed visually)',E+'01_source_isolation_donors.jpg')
P=['P0B_TREE','P0B_PEBBLE','K1_BOULDER','T3_ACCENT_ROCK','T3_BUSH','SOFT_LOG_SEPARATOR','SOFT_LOG_STACK3','SOFT_STUMP_ROUND','SOFT_STUMP_DETAILED','SOFT_MUSHROOM_NORMAL','SOFT_MUSHROOM_GROUP3','SOFT_GRASS_TUFT']
g2=grid([R+f's1p_{p}.png' for p in P],P,6,280,240,'02 · Procedural controls P1 (5) + P2 (7) in isolation, geometry only, neutral colour',E+'02_procedural_controls.jpg')
Image.open(R+'s1p_scale_native.png').convert('RGB').crop((0,40,1200,520)).save(E+'02b_native_scale_mismatch.jpg',quality=88)
for n in ['buildings','nature','props','builder','tiles']:
    Image.open(f'thumbs_{n}.png').convert('RGB').save(E+f'03_family_{n}.jpg',quality=85)
g4=grid([R+f'mat_{m}_{v}.png' for v in ('overview','close') for m in ('neutral','clayfloor_ws8.66','clayfloor_ws1')]+[R+'SCENELET_3CELL_34.png',R+'SCENELET_3CELL_clayfloor_ws8.66_34.png',R+'SCENELET_3CELL_clayfloor_ws1_34.png'],
 [f'{m} · {v}' for v in ('overview','close') for m in ('neutral source','clay_floor_001 ×8.66 (WC1 cell)','clay_floor_001 ×1 (hex native)')]+['scenelet 3 · neutral','scenelet 3 · clay ×8.66','scenelet 3 · clay ×1'],
 3,520,360,'04 · Material bench · neutral vs clay_floor_001 (Global Clay Lite semantics, Blender approximation)',E+'04_material_bench.jpg')
S=['hex__building_home_A_blue','hex__building_home_B_blue','hex__building_tavern_blue','builder__house']
g5=grid([R+f'seed_{s}_{v}.png' for s in S for v in ('34','back')],[f'{s.split("__")[1]} · {v}' for s in S for v in ('front ¾','back ¾')],4,340,300,'05 · Building seeds (home_A, home_B, tavern) + Builder house as style comparison',E+'05_building_seeds.jpg')
SC=['SCENELET_1CELL','SCENELET_2CELL','SCENELET_3CELL']
g6=grid([R+f'{s}_{v}.png' for s in SC for v in ('34','top')],[f'{s} · {v}' for s in SC for v in ('¾','top, edge labels')],2,640,450,'06 · Three semantic scenelets (all MAX props built; recipes carry LOW / TARGET / MAX)',E+'06_scenelets.jpg')
w=1600; parts=[]
for g in (g1,g2,g4,g5,g6):
    im=g.copy(); im.thumbnail((w,10000)); parts.append(im)
C=Image.new('RGB',(w,sum(p.height for p in parts)),'white'); y=0
for p in parts: C.paste(p,(0,y)); y+=p.height
C.save('/tmp/hex/out/HEX_BENCH_contact.jpg',quality=84); print(C.size)
