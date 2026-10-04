import json,sys
from PIL import Image,ImageDraw,ImageFont
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',13)
def sheet(tag,clips,out,cols=2,metrics=None):
    tw,th=240,280; rows=(len(clips)+cols-1)//cols
    S=Image.new('RGB',(cols*(4*tw+8),rows*(th+20)),(250,248,242)); d=ImageDraw.Draw(S)
    for k,c in enumerate(clips):
        x=(k%cols)*(4*tw+8); y=(k//cols)*(th+20)
        lab=c+('' if not metrics else '  '+metrics.get(c,''))
        d.text((x+4,y+3),lab,fill=(31,26,20),font=F)
        for i in range(4):
            try: S.paste(Image.open(f'aud/{tag}/{c}__{i}.png').convert('RGB'),(x+i*tw,y+20))
            except Exception as e: pass
    S.save(out)
r=json.load(open('metrics.json'))
for rig,tag in [('Rig_Medium','RobotOne'),('Rig_Large','OrcBrute')]:
    cl=[x['clip'] for x in r if x['rig']==rig]
    M={x['clip']:f"headMin {x['headMin']} handH {x['handH']} fwd {x['handFwd']}" for x in r if x['rig']==rig}
    half=(len(cl)+1)//2
    sheet(tag,cl[:half],f'AUD_{tag}_1.png',metrics=M); sheet(tag,cl[half:],f'AUD_{tag}_2.png',metrics=M)
sheet('RobotTwo',"Idle_A,Work_A,Working_B,kfb_locomotion_wheelbarrow_walk_a,kfb_interaction_gift_give_a,Hammering,Cheering".split(','),'AUD_RobotTwo.png')
sheet('SkeletonMinion',"Idle_A,Work_A,Working_B,kfb_locomotion_wheelbarrow_walk_a,kfb_interaction_gift_give_a,Hammering,Cheering".split(','),'AUD_SkeletonMinion.png')
