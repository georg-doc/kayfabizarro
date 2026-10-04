import sys,json,math
sys.path.insert(0,'/tmp/ch1'); sys.path.insert(0,'/tmp/fs1')
import bpy
from common import CAT,C,path
import glb
def n180(a): return (a+180)%360-180
def yl(W,l,r):
    a=W[l].translation; b=W[r].translation; return math.degrees(math.atan2(a.y-b.y,a.x-b.x))-90
out={}
rig='Rig_Medium'
for i,c in enumerate(CAT['clips']):
    cid=c['id']
    try:
        G=glb.clip_world(path(c['library'][rig]),cid)
    except Exception as e:
        out[cid]={'err':str(e)}; continue
    off=G[0][rig].translation
    f0,f1=G[0],G[-1]
    h0=f0['hips'].translation-off; h1=f1['hips'].translation-off
    d=h1-h0; trav=math.hypot(d.x,d.y)
    out[cid]={'first':round(n180(yl(f0,'upperleg.l','upperleg.r')),1),'last':round(n180(yl(f1,'upperleg.l','upperleg.r')),1),
      'shoulderFirst':round(n180(yl(f0,'upperarm.l','upperarm.r')),1),'shoulderLast':round(n180(yl(f1,'upperarm.l','upperarm.r')),1),
      'travelM':round(trav,2),'travelYaw':round(math.degrees(math.atan2(d.y,d.x)),1) if trav>0.3 else None,
      'hipsFirst':[round(v,3) for v in h0],'hipsLast':[round(v,3) for v in h1],'cat':c.get('facingYawDeg')}
    if i%100==0: print(i,cid,out[cid],flush=True)
json.dump(out,open('/tmp/fs3/fwd.json','w'),indent=0)
print('done',len(out))
