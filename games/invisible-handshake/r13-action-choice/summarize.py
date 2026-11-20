import json
from pathlib import Path
rows=json.loads(Path(__file__).with_name('results.json').read_text())['rows']
for r in rows:
 if r['omit'] is None:
  total=sum(r['used'].values());print(r['n'],r['policy'],len(r['kinds']),'wins',round(r['wins'],2),'lost',round(100*r['lost_rate'],1),'zero',r['zero'],'use',{k:round(100*v/total,1) for k,v in r['used'].items()})
print('FOCAL OMISSION DELTAS')
for n in range(2,7):
 base=next(r['focal_wins'] for r in rows if r['n']==n and r['policy']=='deny' and len(r['kinds'])==4 and r['omit'] is None)
 print(n,'base',base,[(r['omit'],round(r['focal_wins']-base,2)) for r in rows if r['n']==n and r['omit']])
