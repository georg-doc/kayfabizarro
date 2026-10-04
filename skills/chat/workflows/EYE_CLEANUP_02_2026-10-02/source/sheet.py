import json,os
from PIL import Image, ImageDraw
order=[l.split('\t')[0] for l in open('/tmp/eye2/src/list.tsv').read().strip().split('\n')]
doc=json.load(open('/tmp/eye2/out/eye-cleanup-02.json')); st={f['id']:(f['status'],f['class']) for f in doc['figures']}
T=260; rows=[]
for fid in order:
  R=Image.new('RGB',(T*4+170,T),'white'); d=ImageDraw.Draw(R)
  s,c=st[fid]; d.text((6,8),fid,fill='black'); d.text((6,26),f'{s} / {c}',fill=(0,120,0) if s=='done' else (160,0,0))
  for k,(t,v) in enumerate((('before','front'),('before','34'),('after','front'),('after','34'))):
    p=f'rend/{fid}_{t}_{v}.png'
    if os.path.exists(p):
      im=Image.open(p).convert('RGB'); W,H=im.size; s2=min(W,H); im=im.crop(((W-s2)//2,(H-s2)//2,(W+s2)//2,(H+s2)//2)); R.paste(im.resize((T,T)),(170+k*T,0))
    else: d.rectangle((170+k*T,0,170+(k+1)*T,T),fill=(225,225,225)); d.text((170+k*T+80,T//2),'no file (none)',fill='grey')
  rows.append(R)
H=Image.new('RGB',(T*4+170,30),'black'); dh=ImageDraw.Draw(H)
for k,t in enumerate(('ORIGINAL frontal','ORIGINAL 3/4','NoEyes frontal (no eye rig)','NoEyes 3/4')): dh.text((170+k*T+8,9),t,fill='white')
dh.text((6,9),'EYE-CLEANUP-02 · 2026-10-02',fill='white')
S=Image.new('RGB',(T*4+170,30+T*len(rows)),'white'); S.paste(H,(0,0))
for i,r in enumerate(rows): S.paste(r,(0,30+i*T))
S.save('/tmp/eye2/out/eye-cleanup-02_contact.png',optimize=True); print(S.size,os.path.getsize('/tmp/eye2/out/eye-cleanup-02_contact.png'))
