import sys,os
from PIL import Image,ImageDraw
d,out,items=sys.argv[1],sys.argv[2],sys.argv[3].split(',')
W=600;H=320;cols=3;rows=(len(items)+cols-1)//cols
S=Image.new('RGB',(W*cols+10*(cols-1),H*rows),(248,246,240)); dr=ImageDraw.Draw(S)
for k,it in enumerate(items):
    role,lab=it.split(':'); x=(k%cols)*(W+10); y=(k//cols)*H
    for j,v in enumerate(('side','q34')): S.paste(Image.open(f'{d}/{role}__{v}.png'),(x+300*j,y+20))
    dr.text((x+3,y+3),f'{role} · {lab}',fill=(0,0,0))
S.save(out)
