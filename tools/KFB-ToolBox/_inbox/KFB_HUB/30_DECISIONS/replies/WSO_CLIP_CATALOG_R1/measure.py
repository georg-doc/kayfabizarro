import json, math, re
d=json.load(open('raw.json'))
LEG={'upperleg','lowerleg','foot','toes'}; ARM={'upperarm','lowerarm','wrist','hand','handslot'}; TORSO={'hips','spine','chest'}; HEAD={'head'}
def region(b):
    b=b.replace('DEF-','')
    base=b.split('.')[0]
    base={'thigh':'upperleg','shin':'lowerleg','toe':'toes','neck':'head','shoulder':'upperarm','upper_arm':'upperarm','forearm':'lowerarm'}.get(base,base)
    if base.startswith('f_') or base.startswith('thumb'): base='hand'
    if base in LEG: return 'leg'
    if base in ARM: return 'arm'
    if base in TORSO: return 'torso'
    if base in HEAD: return 'head'
    if base=='root': return 'root'
    return 'other'
rows=[]
for f in d:
    fn=f['file'].split('/')[-1]
    if 'Mannequin' in fn and 'Quaternius' not in fn: continue
    pack=fn.replace('.glb','')
    rig='Large' if 'Large' in fn else ('Quaternius-Rigify' if 'Quaternius' in fn else 'Medium')
    # hip rest height from any clip's hips translation first value
    hip=None
    for a in f['animations']:
        for c in a['channels']:
            if c['node'] in ('hips','DEF-hips') and c['path']=='translation': hip=abs(c['first'][1]) or abs(c['first'][2]); break
        if hip: break
    hip=hip or 1.0
    for a in f['animations']:
        name=a['name']; dur=a['duration']
        animated=set(); regs=set(); maxrot_end=0; maxtr_end=0; rootdrift=0; rootvar=0
        for c in a['channels']:
            if c['path']=='rotation':
                if c['var']>2.0: animated.add(c['node']); maxrot_end=max(maxrot_end,c['endgap'])
            elif c['path']=='translation':
                if c['var']>0.01*hip:
                    animated.add(c['node']); maxtr_end=max(maxtr_end,c['endgap']/hip)
                    if c['node'] in ('root','hips','DEF-hips'):
                        fx,fy,fz=c['first']; lx,ly,lz=c['last']
                        horiz=math.sqrt((lx-fx)**2+(lz-fz)**2)/hip
                        rootdrift=max(rootdrift,horiz)
        for b in animated: regs.add(region(b))
        body=regs-{'root','other'}
        if dur==0: cov='Pose'
        elif 'leg' in body and ('arm' in body or 'torso' in body): cov='Ganzkörper'
        elif 'leg' in body: cov='nur Beine'
        elif body<= {'head'}: cov='nur Kopf' if body else 'keine'
        elif 'leg' not in body: cov='nur Oberkörper'
        loop_meas = (dur>0 and maxrot_end<=6.0 and maxtr_end<=0.03)
        rows.append(dict(file=fn,pack=pack,rig=rig,clip=name,duration=dur,bones=sorted(animated),coverage=cov,
            regions=sorted(body),endRotDeg=round(maxrot_end,1),endTransHip=round(maxtr_end,3),loopMeasured=loop_meas,
            rootDriftHip=round(rootdrift,3),hipRest=round(hip,3)))
json.dump(rows,open('measured.json','w'),indent=1,ensure_ascii=False)
for r in rows:
    print(f"{r['rig'][:1]} {r['pack'].replace('Rig_Medium_','').replace('Rig_Large_','')[:12]:12} {r['clip']:34} {r['duration']:7.3f} {r['coverage']:14} loop={'J' if r['loopMeasured'] else 'N'} endRot={r['endRotDeg']:6.1f} endTr={r['endTransHip']:.3f} drift={r['rootDriftHip']:.3f} nb={len(r['bones'])}")
