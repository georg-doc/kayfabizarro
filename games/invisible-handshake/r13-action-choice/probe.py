import random,json
from pathlib import Path
from test import *
r=random.Random(731);examples={};totals=collections.Counter()
for _ in range(5000):
 ds=[[r.randrange(4),r.randrange(1,7)] for i in range(3)];p=r.randrange(4)
 chips=[r.randrange(1,3) if j!=p and eligible(ds,j) and r.random()<.6 else None for j in range(4)]
 opts=options(ds,4,KINDS);vals=[evaluate(ds,a,p,chips,'deny') for a in opts];mx=max(vals);cats=set(a[0] for a,v in zip(opts,vals) if abs(mx-v)<1e-9)
 if len(cats)==1:
  c=next(iter(cats));totals[c]+=1
  if c not in examples:examples[c]=dict(dice=ds,actor=p,chips=chips,best_actions=[a for a,v in zip(opts,vals) if abs(mx-v)<1e-9],best_score=mx,other_best=max(v for a,v in zip(opts,vals) if a[0]!=c))
Path(__file__).with_name('probe-results.json').write_text(json.dumps(dict(sample=5000,unique_counts=totals,examples=examples),indent=2))
print(json.dumps(dict(unique_counts=totals,examples=examples),indent=2))
