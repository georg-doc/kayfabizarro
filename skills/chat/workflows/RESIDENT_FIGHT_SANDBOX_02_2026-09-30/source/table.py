# cartoon-contact table: standoff from head spheres / body capsules, remaining gap from the striking limb to the defender
exec(open('/tmp/fs1/common.py').read())
M=json.load(open('/tmp/fs1/out/measure2.json')); SH=json.load(open('/tmp/fs2/shapes.json'))
S={'Rig_Medium':1.0,'Rig_Large':2.568}
def hips_fwd(W):
    lr=W['upperleg.l'].translation-W['upperleg.r'].translation; f=np.array([lr.y,-lr.x]); return f/np.linalg.norm(f)
def shapes(rig,W,T=np.eye(4)):
    h=SH[rig]['headSphere']; c=W['head']@Vector(h['offsetInBoneSpace'])
    P=lambda v: (T@np.array([v[0],v[1],v[2],1.0]))[:3]
    return {'head':(P(c),h['radiusM']),'cap':(P(W['hips'].translation),P(W['head'].translation),SH[rig]['bodyCapsule']['radiusM'])}
def seg_pt(a,b,p):
    ab=b-a; t=np.clip((p-a)@ab/(ab@ab),0,1); return a+t*ab
def seg_seg(a,b,c,d):
    best=9e9
    for t in np.linspace(0,1,21):
        p=a+t*(b-a); q=seg_pt(c,d,p); best=min(best,np.linalg.norm(p-q))
    return best
def rz(a,t):
    c,s=math.cos(a),math.sin(a); T=np.eye(4); T[:2,:2]=[[c,-s],[s,c]]; T[:3,3]=t; return T
stance={r:frames(r,'kfb_action_boxing_a')[0] for r in RIGS}
out={}
for aid,ad in M['attacks'].items():
    for ra in RIGS:
        a=ad[ra]; WA=frames(ra,aid)[a['contactFrame']-1]; A=shapes(ra,WA)
        lp=np.array(a['limbAtContact']); ha=np.array(a['hipsAtContact'])
        ax=lp[:2]-ha[:2]
        if np.linalg.norm(ax)<0.3*S[ra]: ax=hips_fwd(WA)
        ax=ax/np.linalg.norm(ax)
        for rb in RIGS:
            WB=stance[rb]; fb=hips_fwd(WB); yaw=math.atan2(-ax[1],-ax[0])-math.atan2(fb[1],fb[0])
            hb=np.array(WB['hips'].translation); m=0.05*min(S[ra],S[rb])
            def at(s):
                t=np.array([ha[0]+ax[0]*s,ha[1]+ax[1]*s,0.0])
                T=rz(yaw,[0,0,0]); T2=np.eye(4); T2[:3,3]=[-hb[0],-hb[1],0]; T3=np.eye(4); T3[:3,3]=t
                return shapes(rb,WB,T3@T@T2)
            def gaps(s):
                B=at(s)
                hg=np.linalg.norm(A['head'][0]-B['head'][0])-A['head'][1]-B['head'][1]
                bg=seg_seg(*A['cap'][:2],*B['cap'][:2])-A['cap'][2]-B['cap'][2]
                lh=np.linalg.norm(lp-B['head'][0])-B['head'][1]
                q=seg_pt(B['cap'][0],B['cap'][1],lp); lb=np.linalg.norm(lp-q)-B['cap'][2]
                x1=np.linalg.norm(A['head'][0]-seg_pt(B['cap'][0],B['cap'][1],A['head'][0]))-A['head'][1]-B['cap'][2]
                x2=np.linalg.norm(B['head'][0]-seg_pt(A['cap'][0],A['cap'][1],B['head'][0]))-B['head'][1]-A['cap'][2]
                bg=min(bg,x1,x2)
                return hg,bg,lh,lb,B,q
            s=0.0; step=0.01*max(S[ra],S[rb])
            while True:
                hg,bg,lh,lb,B,q=gaps(s)
                if (hg>=m and bg>=m and min(lh,lb)>=0) or s>6*max(S[ra],S[rb]): break
                s+=step
            if a['limb']=='head':
                ca=A['head'][0]; qb=seg_pt(B['cap'][0],B['cap'][1],ca); gb=np.linalg.norm(ca-qb)-A['head'][1]-B['cap'][2]
                if hg<=gb: zone='head'; cb=B['head'][0]; rr=B['head'][1]; gap=hg
                else: zone='body'; cb=qb; rr=B['cap'][2]; gap=gb
                surf=cb+(ca-cb)/np.linalg.norm(ca-cb)*rr; lp2=ca+(cb-ca)/np.linalg.norm(cb-ca)*A['head'][1]; puff=(lp2+surf)/2
            elif lh<=lb: zone='head'; surf=B['head'][0]+(lp-B['head'][0])/np.linalg.norm(lp-B['head'][0])*B['head'][1]; gap=lh
            else: zone='body'; surf=q+(lp-q)/np.linalg.norm(lp-q)*B['cap'][2]; gap=lb
            if a['limb']!='head': puff=(lp+surf)/2
            out[f'{aid}|{ra}|{rb}']={'hipsDistanceM':round(s,3),'visualGapM':round(float(gap),3),'hitZone':zone,
               'impactPuffAt':[round(float(x),3) for x in puff],'attackAxisYawDeg':round(math.degrees(math.atan2(ax[1],ax[0])),1),
               'defenderStanceYawDeg':round(math.degrees(yaw),1),'limitedBy':'head spheres' if hg<m+step*1.5 else ('bodies' if bg<m+step*1.5 else 'limb')}
    print(aid,flush=True)
json.dump(out,open('/tmp/fs2/table.json','w'),indent=1)
