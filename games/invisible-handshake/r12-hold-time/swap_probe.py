import itertools,json
from pathlib import Path
def e(ds):
 return tuple(any(p==s and 3<=v<=5 for p,v in ds) and all(v not in [1,6] for p,v in ds if p==s) for s in range(6))
total=changed=sameplace=equalvalue=0
for pos in itertools.product(range(6),repeat=3):
 for vals in itertools.product(range(1,7),repeat=3):
  ds=list(zip(pos,vals));before=e(ds)
  for i,j in [(0,1),(0,2),(1,2)]:
   total+=1;dd=ds[:];dd[i]=(ds[j][0],ds[i][1]);dd[j]=(ds[i][0],ds[j][1]);changed+=e(dd)!=before;sameplace+=pos[i]==pos[j];equalvalue+=vals[i]==vals[j]
r=dict(states=6**6,swaps=total,eligibility_changed=changed,eligibility_unchanged=total-changed,same_location=sameplace,equal_value=equalvalue,scope='Exhaustive eligibility-only probe. Emotion-specific faction effects absent. Values/identities travel with dice; only positions swapped. Neutral eligibility doesnotmean narratively neutral.')
Path(__file__).with_name('swap-results.json').write_text(json.dumps(r,indent=2));print(r)
