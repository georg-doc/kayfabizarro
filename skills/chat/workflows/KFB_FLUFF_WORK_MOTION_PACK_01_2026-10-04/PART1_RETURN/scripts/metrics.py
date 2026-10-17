import sys,json,math,numpy as np
sys.path.insert(0,'/tmp/loco/work'); from gl import *
A='/home/claude/kfbhub/media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/'
ML='/tmp/fluff/ml/'
KK=[('Rig_Medium/Rig_Medium_General.glb',['Interact','PickUp','Throw','Use_Item','Idle_A']),
    ('Rig_Medium/Rig_Medium_Tools.glb',['Chop','Chopping','Dig','Digging','Hammer','Hammering','Holding_A','Holding_B','Holding_C','Pickaxe','Pickaxing','Saw','Sawing','Work_A','Work_B','Work_C','Working_A','Working_B','Working_C','Lockpicking']),
    ('Rig_Medium/Rig_Medium_Simulation.glb',['Cheering','Waving','Push_Ups']),
    ('Rig_Large/Rig_Large_General.glb',['Idle_A']),('Rig_Large/Rig_Large_Simulation.glb',['Flexing'])]
want=json.load(open('/tmp/fluff/ml/want.json'))
cat={e['id']:e for e in json.load(open('/tmp/fluff/ml/catalog.json'))['clips']+json.load(open('/tmp/fluff/ml/patch_an01.json'))['clips']}
cache={}
def G(p):
    if p not in cache: cache[p]=GLB(p)
    return cache[p]
def meas(g,clip,H0):
    P=Pose(g,clip); n=P.frames; idx={k:g.name2i[k] for k in ['head','hips','hand.l','hand.r','root','chest']}
    hy=[];hip=[];hl=[];hr=[];hpos=[]
    for f in range(n):
        t=P.t0+min(f/30,P.T); c={}
        W={k:P.world(i,t,c)[:3,3] for k,i in idx.items()}
        hy.append(W['head'][1]); hip.append(W['hips']); hl.append(W['hand.l']); hr.append(W['hand.r'])
    hl=np.array(hl); hr=np.array(hr); hip=np.array(hip); hy=np.array(hy)
    rel_l=hl-hip*np.array([1,0,1]); rel_r=hr-hip*np.array([1,0,1])
    travel=float(np.linalg.norm((hip[-1]-hip[0])*np.array([1,0,1])))
    return dict(frames=n,dur=round(P.T,2),headMin=round(float(hy.min()/H0),2),hipsMin=round(float(hip[:,1].min()/hip[0,1]) if hip[0,1]>0 else 0,2),
        handH=round(float((hl[:,1].mean()+hr[:,1].mean())/2/H0),2),handFwd=round(float((rel_l[:,2].mean()+rel_r[:,2].mean())/2/H0),2),
        handSep=round(float(np.abs(hl[:,0]-hr[:,0]).mean()/H0),2),handMotion=round(float((hl.std(0).sum()+hr.std(0).sum())/H0),2),travel=round(travel/H0,2))
out={}
for f,cl in KK:
    g=G(A+f); H0=Pose(g,'Idle_A').world(g.name2i['head'],Pose(g,'Idle_A').t0,{})[1,3] if 'Idle_A' in g.anims else None
    if H0 is None: g2=G(A+f.split('/')[0]+'/'+f.split('/')[0]+'_General.glb'); H0=Pose(g2,'Idle_A').world(g2.name2i['head'],Pose(g2,'Idle_A').t0,{})[1,3]
    for c in cl:
        if c in g.anims: out[('KayKit',f.split('/')[0],c)]=meas(g,c,H0)
for rig in ['Rig_Medium','Rig_Large']:
    gi=G(ML+f'libs/{rig}/KFB_Motion_idle.glb'); H0=None
    ida=[k for k in gi.anims if 'breathing' in k][0]; P=Pose(gi,ida); H0=P.world(gi.name2i['head'],P.t0,{})[1,3]
    for w in want:
        if w not in cat: continue
        e=cat[w]; p=ML+e['library'][rig]; g=G(p)
        if w in g.anims: out[('Library',rig,w)]=meas(g,w,H0)
rows=[dict(src=k[0],rig=k[1],clip=k[2],**v) for k,v in out.items()]
json.dump(rows,open('/tmp/fluff/metrics.json','w'),indent=0)
for r in rows: print(r['src'][:3],r['rig'][4:7],f"{r['clip']:<42}",'f',r['frames'],'headMin',r['headMin'],'hips',r['hipsMin'],'handH',r['handH'],'fwd',r['handFwd'],'sep',r['handSep'],'mot',r['handMotion'],'trav',r['travel'])
