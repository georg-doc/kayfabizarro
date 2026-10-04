import sys,json,math; sys.path.insert(0,'/tmp/ch1'); sys.path.insert(0,'/tmp/fs1')
import bpy,numpy as np
from common import C,path
import glb
F=json.load(open('/tmp/fs2/KFB_Fight_Cartoon_Contact.json'))
ids=list(F['attacks'])+list(F['reactions'])+['kfb_action_boxing_a','kfb_locomotion_run_a','kfb_action_fist_fight_a_a','kfb_reaction_taking_punch_a','kfb_reaction_dizzy_idle_a','kfb_reaction_fall_flat_a','kfb_reaction_getting_up_a','kfb_gesture_taunt_a','kfb_throw_shoulder_aggressor_a','kfb_throw_shoulder_victim_a']
ids=list(dict.fromkeys(ids))
def yl(W,l,r):
    a=W[l].translation; b=W[r].translation; return math.atan2(a.y-b.y,a.x-b.x)-math.pi/2
def body(W):
    a=yl(W,'upperleg.l','upperleg.r'); b=yl(W,'upperarm.l','upperarm.r'); return math.atan2(math.sin(a)+math.sin(b),math.cos(a)+math.cos(b))
def d(x): return round((math.degrees(x)+180)%360-180,1)
out={}
for cid in ids:
    c=C[cid]; G=glb.clip_world(path(c['library']['Rig_Medium']),cid)
    fs=[body(W) for W in G]
    mean=math.atan2(sum(map(math.sin,fs)),sum(map(math.cos,fs)))
    r={'atFirst':d(fs[0]),'atLast':d(fs[-1]),'loop':bool(c.get('loop'))}
    if c.get('loop'): r['cycleMean']=d(mean)
    if c['group']=='locomotion':
        V=[]
        for i in range(1,len(G)):
            for f in ('foot.l','foot.r'):
                q=(G[i][f].translation-G[i]['hips'].translation)-(G[i-1][f].translation-G[i-1]['hips'].translation); V.append((q.x,q.y))
        V=np.array(V); w,v=np.linalg.eigh(V.T@V); ax=math.atan2(v[1,-1],v[0,-1])
        cand=[ax,ax+math.pi]; ax=min(cand,key=lambda a:abs(math.atan2(math.sin(a-mean),math.cos(a-mean))))
        r['travelAxis']=d(ax)
    r['use']=r.get('travelAxis',r.get('cycleMean',r['atFirst']))
    out[cid]=r; print(cid,r,flush=True)
json.dump(out,open('/tmp/fs3/facing.json','w'),indent=1)
