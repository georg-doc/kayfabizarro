# auto-stage every attack x reaction x rig pairing against the real meshes (both rigs, published clips)
exec(open('/tmp/fs1/common.py').read())
from scipy.spatial import cKDTree
M=json.load(open('/tmp/fs1/out/measure2.json'))
Z=np.load('/tmp/fs1/out/verts.npz')
V={}
for k in Z.files:
    t,rig,cid,part=k.split('|'); V.setdefault((t,rig,cid),{})[part]=Z[k]
S={'Rig_Medium':1.0,'Rig_Large':M['rigs']['Rig_Large']['hipsHeight']/M['rigs']['Rig_Medium']['hipsHeight']}
SIDE_PART={'handslot.l':['ArmLeft'],'handslot.r':['ArmRight'],'toes.l':['LegLeft'],'toes.r':['LegRight'],
           'lowerleg.l':['LegLeft'],'lowerleg.r':['LegRight'],'head':['Head']}
HITSIDE={'kfb_reaction_standing_react_small_from_right_a':'right'}   # all others: the defender faces the attacker
def hips_fwd(W):
    lr=W['upperleg.l'].translation-W['upperleg.r'].translation; f=np.array([lr.y,-lr.x]); return f/np.linalg.norm(f)
def rz(a): c,s=math.cos(a),math.sin(a); return np.array([[c,-s,0],[s,c,0],[0,0,1.]])
res={}
for aid,ad in M['attacks'].items():
  for rid,rd in M['reactions'].items():
    for ra in RIGS:
      for rb in RIGS:
        a=ad[ra]; r=rd[rb]; sa=S[ra]; sb=S[rb]
        GA=frames(ra,aid)[a['contactFrame']-1]; GB=frames(rb,rid)[r['impactFrame']-1]
        VA=V[('A',ra,aid)]; VB=V[('R',rb,rid)]
        L=a['limb']; lp=np.array(a['limbAtContact'])
        parts=SIDE_PART[L]; P=np.vstack([VA[p] for p in parts if p in VA])
        rad=0.13*sa if L!='head' else 9
        limb=P[np.linalg.norm(P-lp,axis=1)<rad]
        body=np.vstack([v for p,v in VA.items() if p not in parts])
        headA=VA['Head']
        # attack axis: hips->limb; nearly vertical strikes (uppercut) use the attacker's hip facing
        ha=np.array(a['hipsAtContact'])
        ax=lp[:2]-ha[:2]
        if np.linalg.norm(ax)<0.3*sa: ax=hips_fwd(GA); axis_src='hip facing (vertical strike)'
        else: axis_src='hips to limb'
        ax=ax/np.linalg.norm(ax)
        # defender yaw: its hip facing at impact turns to face the attacker (or its right side for hits from the right)
        fb=hips_fwd(GB); want=math.atan2(-ax[1],-ax[0])+(math.pi/2 if HITSIDE.get(rid)=='right' else 0)
        yaw=want-math.atan2(fb[1],fb[0])
        hb=np.array(GB['hips'].translation)
        allB=np.vstack(list(VB.values())); Rm=rz(yaw)
        loc=(allB-[hb[0],hb[1],0])@Rm.T
        headB=(VB['Head']-[hb[0],hb[1],0])@Rm.T
        tree=cKDTree(loc); treeH=cKDTree(headB)
        perp=np.array([-ax[1],ax[0]])
        lat=[0.0]
        def at(s): return np.array([ha[0]+ax[0]*s+perp[0]*lat[0],ha[1]+ax[1]*s+perp[1]*lat[0],0])
        def gap(s): return float(tree.query(limb-at(s))[0].min())
        def bodygap(s): return float(tree.query(body-at(s))[0].min())
        def headgap(s): return float(treeH.query(headA-at(s))[0].min())
        tol=0.01*min(sa,sb); step=0.01*max(sa,sb)
        grid=np.arange(4.0*max(sa,sb),0,-step)
        coarse=np.arange(4.0*max(sa,sb),0,-4*step)
        def scan():
            gm=(9,None)
            for s in coarse:
                g=gap(s)
                if g<gm[0]: gm=(g,s)
                if g<=tol+4*step:
                    for s2 in np.arange(s+4*step,max(s-4*step,0),-step):
                        g2=gap(s2)
                        if g2<gm[0]: gm=(g2,s2)
                        if g2<=tol: return float(s2),gm
            return None,gm
        sT,gmin=scan(); lateral=0.0
        if sT is None:   # try a sideways shift of the defender (up to 0.4 x its scale) before calling it a miss
            for l in sorted(np.arange(-0.4*sb,0.401*sb,0.04*sb),key=abs):
                lat[0]=float(l); s1,g1=scan()
                if s1 is not None: sT,lateral=s1,float(l); break
            if sT is None: lat[0]=0.0
        out={'attackAxisYawDeg':round(math.degrees(math.atan2(ax[1],ax[0])),1),'axisFrom':axis_src,
             'defenderYawDeg':round(math.degrees(yaw),1),'defenderHitSide':HITSIDE.get(rid,'front'),
             'defenderStartOnAttackerFrame':a['contactFrame']-r['impactFrame']+1}
        if sT is not None and lateral: out['defenderSideShiftM']=round(lateral,3)
        if sT is None:
            s=gmin[1]; d,i=tree.query(limb-at(s)); j=int(np.argmin(d)); zc=float(limb[j][2])
            out.update(status='NO_CONTACT',closestGapM=round(gmin[0],3),limbHeightM=round(zc,3),
                       defenderHeadTopM=round(float(headB[:,2].max()),3),defenderHipsHeightM=round(float(hb[2]),3))
            d2,i2=tree.query(limb-at(s)); hint='over the head' if zc>headB[:,2].max() else ('under' if zc<0.15*sb else 'beside')
            out['why']=hint; out['hipsDistanceM']=round(float(s),3)
        else:
            d,i=tree.query(limb-at(sT)); j=int(np.argmin(d)); pB=loc[i[j]]+at(sT)
            zone='head' if float(treeH.query(pB-at(sT))[0])<0.02*sb else ('torso' if pB[2]>hb[2] else 'legs')
            bg,hg=bodygap(sT),headgap(sT)
            out.update(hipsDistanceM=round(sT,3),zone=zone)
            if bg>tol: out['status']='LANDS'
            else:
                s2=sT
                while bodygap(s2)<=tol and s2<4*max(sa,sb): s2+=step
                out.update(status='HEADS_COLLIDE' if hg<=tol else 'BODIES_TOUCH',clearHipsDistanceM=round(s2,3),missAtClearM=round(gap(s2),3))
        res[f'{aid}|{rid}|{ra}|{rb}']=out
  print(aid,flush=True)
json.dump(res,open('/tmp/fs1/out/stage.json','w'),indent=1)
