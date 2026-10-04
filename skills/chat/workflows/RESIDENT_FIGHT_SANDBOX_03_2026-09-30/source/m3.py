import sys,json,math; sys.path.insert(0,'/tmp/ch1'); sys.path.insert(0,'/tmp/fs1')
import bpy, numpy as np
from common import *
from mathutils import Vector
F=json.load(open('/tmp/fs2/KFB_Fight_Cartoon_Contact.json'))
SC={'Rig_Medium':1.0,'Rig_Large':2.568}
CORR=open_ws(); out={'lift':{},'limbs':{},'prop':{}}
def allv(rig): return np.concatenate(list(verts(rig).values()))
# 1 lying lift
LC=list(F['reactions'].keys())+['kfb_reaction_fall_flat_a','kfb_reaction_getting_up_a','kfb_reaction_dizzy_idle_a']
LC=list(dict.fromkeys(LC))
for cid in LC:
    out['lift'][cid]={}
    for rig in RIGS:
        G=frames(rig,cid); mins=[];below=[]
        for W in G:
            pose(rig,W,CORR); a=allv(rig); mins.append(float(a[:,2].min())); below.append(float((a[:,2]<0).mean()))
        sink=0.03*SC[rig]
        lift=[round(max(0,-m-sink),3) for m in mins]
        out['lift'][cid][rig]={'minZEnd':round(mins[-1],3),'belowEndPct':round(100*below[-1],1),'minZWorst':round(min(mins),3),'liftM':lift,'maxLiftM':max(lift)}
        print(cid,rig,out['lift'][cid][rig]['minZEnd'],out['lift'][cid][rig]['belowEndPct'],max(lift),flush=True)
# 2 limb capsules
SEG=[('upperarm','lowerarm'),('lowerarm','wrist'),('upperleg','lowerleg'),('lowerleg','foot')]
for rig in RIGS:
    T=bpy.data.objects[RIGS[rig]]; pose(rig,frames(rig,'kfb_action_boxing_a')[0],CORR)
    dg=bpy.context.evaluated_depsgraph_get(); P={}
    for o in bpy.data.objects:
        if o.type=='MESH' and o.parent and o.parent.name==RIGS[rig]:
            e=o.evaluated_get(dg); me=e.to_mesh(); mw=e.matrix_world
            for v in o.data.vertices:
                if not v.groups: continue
                g=max(v.groups,key=lambda g:g.weight); nm=o.vertex_groups[g.group].name
                P.setdefault(nm,[]).append(np.array(mw@me.vertices[v.index].co))
            e.to_mesh_clear()
    res={}
    for a,b in SEG:
        rr=[]
        for s in ('l','r'):
            A=np.array((T.matrix_world@T.pose.bones[a+'.'+s].matrix).translation); B=np.array((T.matrix_world@T.pose.bones[b+'.'+s].matrix).translation)
            pts=np.array(P.get(a+'.'+s,[]));
            if not len(pts): continue
            d=B-A; t=np.clip(((pts-A)@d)/(d@d),0,1); dist=np.linalg.norm(pts-(A+t[:,None]*d),axis=1); rr.append(np.percentile(dist,80))
        res[a+'->'+b]={'radiusM':round(float(np.mean(rr)),3)}
    out['limbs'][rig]=res; print(rig,res,flush=True)
# 3 prop (clown hammer), capsules in prop space (glTF, Y up), scaled by rig scale
H=np.load('/tmp/fs3/hammer.npy')
CAPS={'handle':((0,-0.5,0),(0,0.55,0),0.08),'head':((0,0.9,-0.4),(0,0.9,0.4),0.34)}
def seg_d(p0,p1,q0,q1):
    # closest distance between segments (sampled)
    ts=np.linspace(0,1,11); P=p0+ts[:,None]*(p1-p0); Q=q0+ts[:,None]*(q1-q0)
    return float(np.min(np.linalg.norm(P[:,None]-Q[None],axis=2)))
for cid in ['kfb_action_sword_and_shield_attack_a','kfb_action_stabbing_a','kfb_action_hook_punch_a','kfb_action_punching_a']:
    out['prop'][cid]={}
    for rig in RIGS:
        s=SC[rig]; R=F['rigs'][rig]; G=frames(rig,cid); rows=[]; prev=None
        for i,W in enumerate(G):
            M=W['handslot.r']; Rm=np.array(M.to_3x3().normalized()); o=np.array(M.translation)
            cap={k:(o+Rm@(s*np.array(a)),o+Rm@(s*np.array(b)),r*s) for k,(a,b,r) in CAPS.items()}
            hips=np.array(W['hips'].translation); neck=np.array(W['head'].translation)
            hc=np.array((W['head']@Vector(R['headSphere']['offsetInBoneSpace'])))
            pen=0
            for k,(a,b,r) in cap.items():
                pen=max(pen,(r+R['bodyCapsule']['radiusM'])-seg_d(a,b,hips,neck))
                pen=max(pen,(r+R['headSphere']['radiusM'])-seg_d(a,b,hc,hc))
            hd=(cap['head'][0]+cap['head'][1])/2
            sp=0 if prev is None else float(np.linalg.norm(hd-prev))*30; prev=hd
            rows.append((i+1,round(pen,3),[round(x,3) for x in hd],round(sp,2)))
        bad=[r[0] for r in rows if r[1]>0.02*s]
        cf=F['attacks'].get(cid,{}).get(rig,{}).get('contactFrame')
        pk=max(rows,key=lambda r:r[3])
        out['prop'][cid][rig]={'framesPropInOwnBody':bad,'maxPenetrationM':max(r[1] for r in rows),'contactFrame':cf,
            'propHeadAtContact':rows[cf-1][2] if cf else None,'penetrationAtContactM':rows[cf-1][1] if cf else None,
            'propHeadFastestFrame':pk[0],'propHeadAtFastest':pk[2],'frames':len(rows)}
        print(cid,rig,json.dumps(out['prop'][cid][rig]),flush=True)
json.dump(out,open('/tmp/fs3/m3.json','w'))
print('ok')
