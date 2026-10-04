exec(open('/tmp/fs1/common.py').read())
import numpy as np
M=json.load(open('/tmp/fs1/out/measure2.json'))
def fwd(W):
    lr=np.array(W['upperleg.l'].translation-W['upperleg.r'].translation); f=np.array([lr[1],-lr[0]]); return f/np.linalg.norm(f)
out={}
for rid in M['reactions']:
    G=frames('Rig_Medium',rid); n=len(G); f0=fwd(G[0]); a0=math.atan2(f0[1],f0[0])
    fi=M['reactions'][rid]['Rig_Medium']['impactFrame']
    h=lambda i: np.array(G[i]['hips'].translation)
    hd=lambda i: np.array(G[i]['head'].translation)
    def rel(v):
        a=math.degrees(math.atan2(v[1],v[0])-a0); return (a+180)%360-180
    # early recoil: head motion impact..impact+12 ; overall: hips start->end
    e=hd(min(n-1,fi+11))-hd(fi-1); o=h(n-1)-h(0)
    lr=np.array(G[-1]['upperarm.l'].translation-G[-1]['upperarm.r'].translation); up=hd(n-1)-h(n-1)
    fr=np.cross(lr,up); fr/=np.linalg.norm(fr)
    out[rid]={'headRecoilRelDeg':round(rel(e),0),'headRecoilM':round(float(np.hypot(*e[:2])),3),
              'hipsTravelRelDeg':round(rel(o),0),'hipsTravelM':round(float(np.hypot(*o[:2])),3),
              'endsLying':bool(hd(n-1)[2]<0.5*hd(0)[2]),'endFace':('up' if fr[2]>0.5 else 'down' if fr[2]<-0.5 else 'side') if hd(n-1)[2]<0.5*hd(0)[2] else 'standing',
              'impactFrame':fi,'frames':n}
    print(rid[13:],out[rid])
json.dump(out,open('/tmp/fs2/react.json','w'),indent=1)
