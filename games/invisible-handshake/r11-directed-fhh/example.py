import json
from pathlib import Path
# Import definitions without rerunning batches.
ns={};exec(Path(__file__).with_name('test.py').read_text().split('rows=[]')[0],ns)
s={'dice':[[0,4],[2,5],[3,4]],'cards':[0]*6,'chips':[False]*6,'wins':[0]*6,'breaks':[0,0],'lost':0}
actions=[('move',1,0),('move',0,1),('move',1,2),('change',1,1),('change',1,1),('move',2,5),('change',2,-1),('change',2,-1),('change',1,-1),('change',2,-1),('change',2,-1),('move',0,5),('move',1,0),('change',0,-1),('change',1,1),('move',1,3),('change',0,1),('change',2,1)]
trace=[]
for k,a in enumerate(actions):
 p=k%6;cash=s['chips'][p]
 if cash:s['wins'][p]+=1;s['cards'][p]+=1;s['chips'][p]=False
 before=s['chips'][:];s,b=ns['resolve'](s,p,a)
 if ns['eligible'](s,p):s['chips'][p]=True
 trace.append(dict(turn=k+1,player=p,action=a,cashed=cash,broken_slot=b,dice=[d[:] for d in s['dice']],claims=s['chips'][:],wins=s['wins'][:]))
Path(__file__).with_name('example.json').write_text(json.dumps(trace,indent=2))
print([(t['turn'],t['cashed'],t['broken_slot'],t['wins']) for t in trace if t['cashed'] or t['broken_slot'] is not None])
