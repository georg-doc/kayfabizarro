# cache mesh vertices of every attack at its contact frame and every reaction at its impact frame, both rigs
exec(open('/tmp/fs1/common.py').read())
M=json.load(open('/tmp/fs1/out/measure.json'))
CORR=open_ws()
# contact-frame overrides where the speed peak is not the hit:
#  kicks: frame of the highest toe (the speed peak and the widest reach pick the take-off or the planted foot)
#  back flip to uppercut: highest hand after the landing (frames 70-150)
UNUSABLE={'kfb_action_hurricane_kick_a':'source FBX and library clip animate only the root (spin + travel); every body bone is frozen in one pose'}
for cid in UNUSABLE: M['attacks'].pop(cid,None)
def set_contact(x,G,L,f,src):
    v=G[f-1][L].translation-G[f-1]['hips'].translation
    x.update(limb=L,contactFrame=f,limbAtContact=[round(c,3) for c in G[f-1][L].translation],hipsAtContact=[round(c,3) for c in G[f-1]['hips'].translation],
             reachFromHipsM=round(math.hypot(v.x,v.y),3),limbHeightM=round(G[f-1][L].translation.z,3),attackAxisYawDeg=round(math.degrees(math.atan2(v.y,v.x)),1),
             hipsTravelToContactM=round(math.hypot(*(G[f-1]['hips'].translation-G[0]['hips'].translation)[:2]),3),source=src)
for cid,d in M['attacks'].items():
    for rig,x in d.items():
        G=frames(rig,cid)
        if x['limb'].startswith('toes'):
            best=max(((G[i][L].translation.z,i+1,L) for L in ('toes.l','toes.r') for i in range(len(G))))
            set_contact(x,G,best[2],best[1],'frame of the highest toe')
        if cid=='kfb_action_back_flip_to_uppercut_a':
            best=max(((G[i][L].translation.z-G[i]['hips'].translation.z,i+1,L) for L in ('handslot.l','handslot.r') for i in range(69,150)))
            set_contact(x,G,best[2],best[1],'highest hand after the landing (frames 70-150)')
M['unusable']=UNUSABLE
def chest_fwd(W):
    lr=W['upperarm.l'].translation-W['upperarm.r'].translation; f=Vector((lr.y,-lr.x,0)).normalized()  # cross(lr, up)
    return f
V={}
for rig in RIGS:
    for cid,d in M['attacks'].items():
        f=d[rig]['contactFrame']; W=frames(rig,cid)[f-1]; pose(rig,W,CORR)
        V[f'A|{rig}|{cid}']=verts(rig)
        d[rig]['chestFwdYawDeg']=round(math.degrees(math.atan2(*reversed(chest_fwd(W)[:2]))),1)
    for cid,d in M['reactions'].items():
        f=d[rig]['impactFrame']; W=frames(rig,cid)[f-1]; pose(rig,W,CORR)
        V[f'R|{rig}|{cid}']=verts(rig)
        cf=chest_fwd(W); d[rig]['chestFwdYawDeg']=round(math.degrees(math.atan2(cf.y,cf.x)),1)
        rel=(d[rig]['hitFromYawDeg']-d[rig]['chestFwdYawDeg']+180)%360-180
        d[rig]['hitFromRelDeg']=round(rel,1)
        d[rig]['hipsAtImpact']=[round(c,3) for c in W['hips'].translation]
    print(rig,'posed',flush=True)
np.savez_compressed('/tmp/fs1/out/verts.npz',**{k+'|'+p:a for k,dd in V.items() for p,a in dd.items()})
json.dump(M,open('/tmp/fs1/out/measure2.json','w'),indent=1)
