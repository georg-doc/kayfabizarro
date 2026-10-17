import json, math, numpy as np, sys
sys.path.insert(0,'.')
from glbnp import load, acc, worlds, node_by_name
A='/Users/georgv.westphalen/Dropbox/CLAUDE/KFB_HUB/30_DECISIONS/replies/E2_ATTACH_R1/assets/'
F={'hunky':('LordHunky','LordHunky_RigMedium.toolbox.r4.glb','lordhunky-headpart-r4.ws0-2026-10-16.kfb-pets.json'),
   'dory':('LadyDory','LadyDory_RigMedium.toolbox.r4.glb','ladydory-headpart-r4.ws0-2026-10-16.kfb-pets.json')}
TUBE=0.075
out={}
for edge in ['r4','70','80','90']:
    M=json.load(open(f'meas/measure_{edge}.json')); out[edge]={}
    for fm in M['figs']:
        fig=fm['fig']; name,glb,rec=F[fig]
        path=A+glb if edge=='r4' else A+f'variants/{name}_edge{edge}.r4e.glb'
        g,b=load(path); W=worlds(g); pet=json.load(open(A+rec))['pets'][0]
        Mh=W[node_by_name(g,pet['headPart']['root'])]; s=np.linalg.norm(Mh[:3,0])
        mi=[i for i,m in enumerate(g['meshes']) if m['name']==pet['headPart']['mesh']][0]
        prims=g['meshes'][mi]['primitives']
        eyesR=[]
        for em in fm['eyes']:
            i=em['eye']; q=pet['eyes'][i] if len(pet['eyes'])>1 else pet['eyes'][0]
            # page eye index -> recipe eye via cdKey ordering eyeL,eyeR
            byk={e['cdKey']:e for e in pet['eyes']}; q=[byk.get('eyeL',pet['eyes'][0]),byk.get('eyeR',pet['eyes'][0])][i]
            c=(Mh@np.array(q['pos']+[1]))[:3]; Rw=q['R']*s
            # socket prim nearest
            best=min(((np.linalg.norm(acc(g,b,p['attributes']['POSITION']).mean(0)-c),pi) for pi,p in enumerate(prims) if 'Sockel' in g['materials'][p['material']]['name']))[1]
            P=acc(g,b,prims[best]['attributes']['POSITION']).astype(float)
            nloft=3904
            Vs=P[nloft:nloft+600]; A_=np.c_[2*Vs,np.ones(len(Vs))]; sol=np.linalg.lstsq(A_,(Vs**2).sum(1),rcond=None)[0]; O=sol[:3]; Rs=math.sqrt(sol[3]+O@O)
            # rim = last 1649 verts: tube centre circle -> axis + edge angle
            Rr=P[-1649:]; 
            # axis: plane through rim centroid via SVD
            c0=Rr.mean(0); _,_,vt=np.linalg.svd(Rr-c0); ax=vt[2]*np.sign(vt[2][2])
            the=math.degrees(math.atan2(np.linalg.norm(np.cross(c0-O,ax))*0+math.hypot(*(lambda q_: (np.linalg.norm(q_-np.outer(q_@ax,ax),axis=1).mean(),))(Rr-O)) ,1)) # placeholder
            zc=(c0-O)@ax; rhoc=math.sqrt(max(Rs**2-zc**2,0)); the=math.degrees(math.atan2(rhoc,zc))
            Rsn=Rs/Rw; tube=TUBE
            def toS(Xw):
                qv=(Xw-O)/Rw; z=qv@ax; rho=np.linalg.norm(qv-np.outer(z,ax),axis=1); return qv,z,rho
            def tube_dist(Xw):
                qv,z,rho=toS(Xw); return np.hypot(rho-Rsn*math.sin(math.radians(the)), z-Rsn*math.cos(math.radians(the)))
            # page eye frame -> world: check identity quaternion
            qw=np.array(em['quatW']); 
            res={'Rh_page':round(em['Rh'],6),'Rw_glb':round(Rw,6),'quatW':[round(x,5) for x in qw],'edgeDeg_measured':round(the,3),'shellR_R':round(Rsn,5),'fit_s':round(em['fit'],5)}
            res['visible']=em['visible']; res['pupilPxClosed']=em['pupilPxClosed']; res['pupilPxRest']=em['pupilPxRest']
            sk={}
            for st,arr in em['skin'].items():
                v=np.array(arr).reshape(-1,3); Xw=c+v*em['Rh']   # identity quaternion asserted below
                qv,z,rho=toS(Xw); r=np.linalg.norm(qv,axis=1); th=np.degrees(np.arctan2(rho,z))
                onshell=th>=the
                over=r[onshell]-Rsn
                td=tube_dist(Xw); inside=td<tube
                sk[st]={'skinOuterMax_R':round(float(r.max()),4),'skinThroughShell_verts':int((over>0).sum()),'skinMaxOverShell_R':round(float(over.max()),4),
                        'skinInsideRimTube_verts':int(inside.sum()),'rimDepthIntoSkin_R':round(float((tube-td[inside]).max()) if inside.any() else 0.0,4),
                        'skinInsideRim_thetaDeg':[round(float(th[inside].min()),1),round(float(th[inside].max()),1)] if inside.any() else None}
            res['skin']=sk
            s_=em['fit']; res['eyeball']={'scleraR_R':round(s_,4),'gapScleraToShell_R':round(Rsn-s_,4),'gapScleraToRimInner_R':round(Rsn-tube-s_,4),'crossesShellOrRim':bool(Rsn-tube-s_<0)}
            # stalk / loft vs rim tube; and loft exposure in front of the shell edge
            L=P[:nloft]; tdl=tube_dist(L); qv,z,rho=toS(L); rl=np.linalg.norm(qv,axis=1); thl=np.degrees(np.arctan2(rho,z))
            H=acc(g,b,prims[0]['attributes']['POSITION']).astype(float); near=np.linalg.norm(H-c,axis=1)<1.6*Rw; tdh=tube_dist(H[near])
            res['stalk']={'loftVertsInsideRimTube':int((tdl<tube).sum()),'loftMaxDepthInRim_R':round(float((tube-tdl[tdl<tube]).max()) if (tdl<tube).any() else 0,4),
                          'headMeshVertsInsideRimTube':int((tdh<tube).sum()),'minDistLoftToRimTubeSurface_R':round(float(tdl.min()-tube),4),'minDistHeadToRimTubeSurface_R':round(float(tdh.min()-tube),4) if near.any() else None,
                          'loftVertsOutsideShellRadius_frontOfEdge':int(((rl>Rsn)&(thl<the)).sum()),
                          'loftVertsBetweenSkinAndShellRadius_frontOfEdge':int(((rl>sk['rest']['skinOuterMax_R']-0.0001)&(rl<=Rsn)&(thl<the)).sum())}
            eyesR.append(res)
        out[edge][fig]=eyesR
json.dump(out,open('analysis_r1e.json','w'),indent=1)
for edge in out:
    for fig in out[edge]:
        for i,e in enumerate(out[edge][fig]):
            v=e['visible']
            print(edge,fig,i,'edge',e['edgeDeg_measured'],'Rh/Rw',e['Rh_page'],e['Rw_glb'],'q',e['quatW'])
            print('  eyeball open f/tq/side',[v[k]['eyeball_open']['visibleFrac'] for k in ('front','threeq','side')],'rest',[v[k]['eyeball_rest']['visibleFrac'] for k in ('front','threeq','side')],'lid50',[v[k]['lid_half']['visibleFrac'] for k in ('front','threeq','side')])
            print('  pupil closed',e['pupilPxClosed'])
            for st,x in e['skin'].items(): print('  skin',st,x)
            print('  eyeball',e['eyeball']); print('  stalk',e['stalk'])
