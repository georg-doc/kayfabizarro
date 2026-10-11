"""Export existing editor metadata only; no paths, meshes, coordinates, module construction or auto docking."""
import json,sys,hashlib
from pathlib import Path
source=json.loads(Path(sys.argv[1]).read_text());s=source.get('sceneStudy',source)
if s.get('schema')!='kfb.scene-study/1':raise ValueError('Expected existing scene-study/1')
packet={'schema':'kfb.scene-study/2','binding':'receiver-selected-world','places':[{'id':p['id'],'island':p['island'],'name':p['name'],'action':p['action'],'sourceObjectId':p['focus'],'members':p['members']} for p in s['places']],'connections':[{'id':'relation-v1-'+hashlib.sha256(json.dumps([c['from'],c['to']],ensure_ascii=False,separators=(',',':')).encode()).hexdigest(),'from':c['from'],'to':c['to'],'reason':c['reason'],'desiredAttachment':{end:{'type':None,'anchorId':None} for end in ['from','to']}} for i,c in enumerate(s['connections'])]}
# Directed endpoint pair defines stable legacy connection identity; editing purpose or reordering does not change IDs.
Path(sys.argv[2]).write_text(json.dumps(packet,ensure_ascii=False,indent=2)+'\n')
