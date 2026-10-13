import sys,re
# usage: merge_changelog.py LOCAL REMOTE  -> inserts remote '## ' blocks missing locally, keeping remote order position (top for newest)
local_p, remote_p = sys.argv[1], sys.argv[2]
def split(t):
    parts=re.split(r'(?m)^(?=## )',t); return parts[0],[p for p in parts[1:]]
lhead,lb=split(open(local_p).read()); _,rb=split(open(remote_p).read())
lh=[b.split('\n',1)[0].strip() for b in lb]
added=0
for i,b in enumerate(rb):
    h=b.split('\n',1)[0].strip()
    if h in lh: continue
    # place before the first local block that follows it in remote order
    pos=len(lb)
    for nb in rb[i+1:]:
        nh=nb.split('\n',1)[0].strip()
        if nh in lh: pos=lh.index(nh); break
    if not b.endswith('\n\n'): b=b.rstrip('\n')+'\n\n'
    lb.insert(pos,b); lh.insert(pos,h); added+=1
open(local_p,'w').write(lhead+''.join(lb))
print(f'merged {added} remote changelog block(s)')
