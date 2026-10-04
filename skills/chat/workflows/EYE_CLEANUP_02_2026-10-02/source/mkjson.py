import json,os
lst=dict(l.split('\t') for l in open('/tmp/eye2/src/list.tsv').read().strip().split('\n'))
got={l.split('\t')[0]:l.split('\t')[1] for l in open('/tmp/eye2/src/got.tsv').read().strip().split('\n')}
FULL={'10a7fdce':'10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0'}
bind=json.load(open('bind_check.json')); cmpj=json.load(open('glb_compare.json')); ins=json.load(open('inspect.json'))
NOTES=json.load(open('notes.json'))
SKIN={'orcA':'#6db335','hoarder':'#f6c19d'}
NONE=['knight','hero','marksman','gtn','gtn_forgotten']
order=[l.split('\t')[0] for l in open('/tmp/eye2/src/list.tsv').read().strip().split('\n')]
figs=[]
for fid in order:
  c=FULL.get(got[fid],got[fid]); src=f"media/3D_Assets/{lst[fid]}@{c}"
  if fid in NONE:
    figs.append({'id':fid,'source':src,'out':None,'status':'none','class':'none','removed':[],'uvRect':None,'skin':None,'anchors':None,'bones':ins[fid].get('bones'),'bindCheck':None,'notes':NOTES[fid]}); continue
  cl=json.load(open(f'clean_{fid}.json')); b=bind[fid]; g=cmpj[fid]
  base=os.path.basename(cl['out']); tex=cl.get('cls')=='texture'
  A={s:{k:cl['anchors'][s][k] for k in ('pos','normal','r')} for s in ('l','r')}
  bc=f"{b['clip']} {b['noEyes']['bound']} (original {b['orig']['bound']})" if b['clip'] else 'n/a (no skin)'
  figs.append({'id':fid,'source':src,'out':'skills/chat/workflows/EYE_CLEANUP_01_2026-10-01/glb/'+base,'status':'done','class':'texture' if tex else 'island',
    'removed':[] if tex else [f"{cl['obj']}: 2 eye islands, {cl['removedFaces']} faces"],
    'uvRect':{s:cl['anchors'][s]['uvRect'] for s in ('l','r')} if tex else None,
    'skin':SKIN.get(fid,cl['anchors']['l']['surround']),'anchors':A,'anchorDetail':cl['anchors'],'anchorParent':cl['anchorParent'],
    'bones':b['noEyes']['bones'],'bindCheck':bc,'glbCompare':g,'notes':NOTES[fid]})
doc={'schema':'kfb.eye-cleanup/0.1-candidate','date':'2026-10-02','job':'EYE-CLEANUP-02','lane':'Blender MCP / Coworker',
 'tool':'Blender 5.0.1 (bpy) + three.js 0.160 GLTFLoader bind check','coordinates':'glTF / three.js, Y up, figure root space, bind pose',
 'anchorAxes':'local +Z = outward normal, +Y = head up, scale = eye radius; three.js names eye_anchorl / eye_anchorr',
 'counts':{k:sum(f['status']==k for f in figs) for k in ('done','none','blocked')},'figures':figs}
json.dump(doc,open('/tmp/eye2/out/eye-cleanup-02.json','w'),indent=1); print(doc['counts'],len(figs))
