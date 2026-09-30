import json
from PIL import Image, ImageDraw, ImageFont
J=json.load(open('lineup.json')); P=J['PPM']; W=int(J['W']*P); Hh=int(J['H']*P)
x0m=J['camX']-J['W']/2; z0m=J['camZ']-J['H']/2
X=lambda m:int((m-x0m)*P); Z=lambda m:int(Hh-(m-z0m)*P)
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',20); FB=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',24)
NAMES={'brute':'Large','raider':'Medium','fb':'FrizzleBob','orcB':'Legacy','car':'CVP1 sedan ×1.8'}
TITLE={'A':'A · KayKit as shipped, one factor for all (Medium = 1.5 m)','B':'B · your intuition: Large 2 m · Medium 1.5 m · Legacy 1 m (per-rig factor)'}
panels=[]
for row in 'AB':
    im=Image.new('RGBA',(W,Hh+110),(246,245,240,255)); d=ImageDraw.Draw(im)
    for m in range(-1,18):
        d.line([(X(m),50),(X(m),50+Z(0))],fill=(215,215,208),width=1)
    for m in range(0,5):
        y=50+Z(m); d.line([(0,y),(W,y)],fill=(200,200,192) if m else (90,90,90),width=1 if m else 3); d.text((6,y-24),f'{m} m',font=F,fill=(120,120,120))
    # race car reference 4.1 m x 1.3 m
    rx=J['rows'][row]['car']['x1']+0.7
    d.rectangle([X(rx),50+Z(1.3),X(rx+4.1),50+Z(0)],outline=(200,60,40),width=3)
    d.text((X(rx)+8,50+Z(1.3)-28),'track-core race car 4.1 m',font=F,fill=(200,60,40))
    r=Image.open(f'row_{row}.png'); im.alpha_composite(r,(0,50))
    d=ImageDraw.Draw(im)
    for k,v in J['rows'][row].items():
        cx=X((v['x0']+v['x1'])/2); lbl=NAMES[k]; h=v['h']
        sub=f'{h:.2f} m' if k!='fb' else f'{h:.2f} m (ears)'
        if k=='car': sub=f'{v["x1"]-v["x0"]:.1f} m long · {h:.1f} m high'
        for i,t in enumerate((lbl,sub)):
            w=d.textlength(t,font=F); d.text((cx-w/2,50+Z(0)+8+i*24),t,font=F,fill=(40,40,40))
    d.text((10,10),TITLE[row],font=FB,fill=(20,20,20))
    top=50+Z(3.3); im2=Image.new('RGBA',(W,im.height-top+50),(246,245,240,255)); im2.alpha_composite(im.crop((0,top,W,im.height)),(0,50)); ImageDraw.Draw(im2).text((10,10),TITLE[row],font=FB,fill=(20,20,20)); panels.append(im2)
out=Image.new('RGBA',(W,sum(p.height for p in panels)),(255,255,255,255)); y=0
for p in panels: out.alpha_composite(p,(0,y)); y+=p.height
out=out
out.convert('RGB').save('scale_lineup.png'); print(out.size)
