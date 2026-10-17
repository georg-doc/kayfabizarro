from PIL import Image,ImageDraw,ImageFont
import json
A=json.load(open('aud.json')); cl=list(A)
try: F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15); Fb=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',16)
except: F=Fb=ImageFont.load_default()
S=240; LW=250; HDR=30
def make(rows,fn):
    W=LW+6*S; H=HDR+len(rows)*(S+4)
    im=Image.new('RGB',(W,H),(246,244,238)); d=ImageDraw.Draw(im)
    for i,t in enumerate(['Robot One · in','peak','out','Orc Brute · in','peak','out']): d.text((LW+i*S+6,7),t,fill=(30,30,30),font=Fb)
    for r,c in enumerate(rows):
        y=HDR+r*(S+4); v=A[c]
        m=v['Rig_Medium']; l=v['Rig_Large']
        txt=f"{m['reaction'].upper()}\n{c.replace('kfb_','')}\nframes {m['frames']} {'loop' if m['loop'] else 'one-shot'}\nM trim {m['trim'][0]}-{m['trim'][1]} ({m['trimSec']} s)\n   peak f{m['peak']}\nL trim {l['trim'][0]}-{l['trim'][1]} peak f{l['peak']}\ntravel M {m['hipsTravel']} m"
        d.multiline_text((8,y+8),txt,fill=(20,20,20),font=F,spacing=4)
        for k,(a,fr) in enumerate([('RobotOne',0),('RobotOne',1),('RobotOne',2),('OrcBrute',0),('OrcBrute',1),('OrcBrute',2)]):
            p=Image.open(f'r_{a}/{c}__{fr}.png').convert('RGB').resize((S,S)); im.paste(p,(LW+k*S,y))
            if fr==1: d.rectangle([LW+k*S,y,LW+k*S+S-1,y+S-1],outline=(200,60,40),width=3)
    im.save(fn)
make(cl[:9],'out_REACTION_AUDITION_1.png'); make(cl[9:],'out_REACTION_AUDITION_2.png')
