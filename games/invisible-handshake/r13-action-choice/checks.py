from test import *
from pathlib import Path
checks=[]
ds=[[0,6],[1,1],[2,4]]
assert project(ds,('adjust',0,1))==([[0,3],[1,1],[2,4]],0);checks.append('upper crossing resets only trigger and discards target')
assert project(ds,('adjust',1,-1))[1]==1;checks.append('lower crossing discards target')
for i,want in enumerate([1,6,3]):assert project(ds,('flip',i,None))[0][i][1]==want
checks.append('opposite face is 7 minus value')
assert all(project(ds,('reroll',0,None),r)[1] is None for r in range(1,7));checks.append('reroll never crosses 0 or 7')
assert project(ds,('swap',0,1))[0]==[[1,6],[0,1],[2,4]];checks.append('swap preserves values and identity')
assert evaluate([[0,1],[1,3],[1,4]],('reroll',0,None),0,[None,None],'deny')==1.5;checks.append('reroll uses six-outcome expectation')
assert not any(a[0]=='swap' for a in options([[0,3],[0,4],[0,5]],2,KINDS));checks.append('same-location swaps excluded')
Path(__file__).with_name('checks.json').write_text(json.dumps(dict(passed=checks),indent=2))
print(len(checks),'checks passed')
