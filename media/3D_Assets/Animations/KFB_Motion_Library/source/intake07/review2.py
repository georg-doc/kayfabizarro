import json, sys, io, contextlib, os
sys.path.insert(0,'/tmp/loco/work')
ns={}
with contextlib.redirect_stdout(io.StringIO()): exec(open('/tmp/loco2/ladder2.py').read(), ns)
core=json.load(open('/tmp/loco2/ladder_core2.json'))
L='kfb_locomotion_'
for rig in ('Rig_Medium','Rig_Large'):
    ns['RIG']=rig; c=[]
    for r in core[rig]['rungs']:
        for a in r.get('alternatives',[]):
            c.append(ns['rung'](rig, r['rung']+'~'+a['clip'][len(L):], a['clip'], 'loop' if r['kind']=='loop' else 'oneshot'))
    core[rig+'_cands']={'rungs':c}
    order=[]
    for r in core[rig]['rungs']:
        order.append(r); order+= [x for x in c if x['rung'].split('~')[0]==r['rung']]
    core[rig+'_ordered']={'rungs':order}
json.dump(core,open('/tmp/loco2/ladder_core2_review.json','w'))
from merge import merge
SRC='/tmp/loco/src/'
KK=ns['KKFILE']; cat=ns['cmap']
for rig in ('Rig_Medium','Rig_Large'):
    clips=[]; seen=set()
    for key in (rig, rig+'_cands'):
        for r in core[key]['rungs']:
            cl=r.get('clip')
            if not cl or cl in seen: continue
            seen.add(cl)
            src=SRC+f'{rig}__{rig}_{KK[cl]}.glb' if cl in KK else SRC+rig+'__'+cat[cl]['library'][rig].split('/')[-1]
            clips.append((cl,src,cl))
    merge(SRC+f'{rig}__{rig}_General.glb', clips, f'/tmp/loco2/out/KFB_LOCOMOTION_LADDER_02_{rig}.glb'); print(rig,len(clips))
P=open('/tmp/loco/work/plan.py').read().replace("L=json.load(open('/tmp/loco/work/ladder_core.json'))","L=json.load(open('/tmp/loco2/ladder_core2_review.json'))").replace("MEAS=json.load(open('/tmp/loco/work/measure_all.json'))","MEAS=json.load(open('/tmp/loco/work/measure_all.json'))+json.load(open('/tmp/ml7/w/meas7.json'))")
P=P[:P.index("if __name__")]
pn={}; exec(P,pn)
out={'Rig_Medium':pn['plan']('Rig_Medium','/tmp/loco2/out/KFB_LOCOMOTION_LADDER_02_Rig_Medium.glb',['Rig_Medium_ordered'],1.4),
     'Rig_Large':pn['plan']('Rig_Large','/tmp/loco2/out/KFB_LOCOMOTION_LADDER_02_Rig_Large.glb',['Rig_Large_ordered'],2.6)}
for rig,gap in (('Rig_Medium',1.4),('Rig_Large',2.6)):
    main=[q for q in out[rig] if not q['rung'].startswith('strafe')]; st=[q for q in out[rig] if q['rung'].startswith('strafe')]
    for i,q in enumerate(main): q['laneX']=i*gap
    x0=len(main)*gap+2*gap
    for k,q in enumerate(st):
        right=q['dirBl'][0]<0
        q['laneX']=x0+(6*gap if right else 0.0); q['laneY']=-k*gap*1.15
    out[rig]=main+st
json.dump(out,open('/tmp/loco2/out/KFB_LOCOMOTION_LADDER_02_review_plan.json','w'))
print({k:len(v) for k,v in out.items()})
for s in out['Rig_Medium']: print(round(s['laneX'],1), s.get('laneY',0), s['rung'], s['clip'][-24:], round(s['speed'],2), s['moving'])
