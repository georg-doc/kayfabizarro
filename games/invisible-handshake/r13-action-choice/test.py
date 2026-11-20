import random,json,collections
from pathlib import Path
KINDS=['adjust','reroll','move','swap','flip']
def eligible(ds,p):
 v=[v for s,v in ds if s==p]
 return any(3<=x<=5 for x in v) and all(2<=x<=5 for x in v)
def project(ds,a,roll=3):
 out=[list(d) for d in ds];kind,i,arg=a;broken=None
 if kind=='adjust':
  out[i][1]+=arg
  if out[i][1] not in range(1,7):broken=out[i][0];out[i][1]=3
 elif kind=='reroll':out[i][1]=roll
 elif kind=='move':out[i][0]=arg
 elif kind=='swap':out[i][0],out[arg][0]=out[arg][0],out[i][0]
 elif kind=='flip':out[i][1]=7-out[i][1]
 return out,broken

def options(ds,n,kinds):
 a=[]
 if 'adjust' in kinds:a += [('adjust',i,d) for i in range(3) for d in [-1,1]]
 if 'reroll' in kinds:a += [('reroll',i,None) for i in range(3)]
 if 'move' in kinds:a += [('move',i,p) for i in range(3) for p in range(n) if p!=ds[i][0]]
 if 'swap' in kinds:a += [('swap',i,j) for i in range(3) for j in range(i+1,3) if ds[i][0]!=ds[j][0]]
 if 'flip' in kinds:a += [('flip',i,None) for i in range(3)]
 return a

def value(ds,b,p,chips,policy):
 dead=[j for j,c in enumerate(chips) if c and (b==j or not eligible(ds,j))]
 deny=sum(4+1/chips[j] for j in dead if j!=p)
 return (6 if policy=='build' else 3)*eligible(ds,p)+deny

def evaluate(ds,a,p,chips,policy):
 return sum(value(*project(ds,a,r),p,chips,policy) for r in range(1,7))/6 if a[0]=='reroll' else value(*project(ds,a),p,chips,policy)

def game(n,seed,policy,kinds,omit=None,rounds=18):
 rng=random.Random(seed*97+2);rr=random.Random(seed*97+1);setup=random.Random(seed*97+3)
 positions=list(range(n));setup.shuffle(positions);ds=[[positions[i%n],3] for i in range(3)]
 chips=[None]*n;wins=[0]*n;claimed=lost=cash=0;used=collections.Counter();best=collections.Counter();unique=collections.Counter();legal=collections.Counter();breaks=0
 for turn in range(n*rounds):
  p=(turn+seed%n)%n;selector,category,tie=rng.random(),rng.random(),rng.random();roll=rr.randrange(1,7)
  allowed=[x for x in kinds if not(p==0 and x==omit)]
  opts=options(ds,n,allowed);scores=[evaluate(ds,a,p,chips,policy) for a in opts];mx=max(scores)
  top=[a for a,s in zip(opts,scores) if abs(s-mx)<1e-9];cats=sorted(set(a[0] for a in top))
  for c in set(a[0] for a in opts):legal[c]+=1
  for c in cats:best[c]+=1
  if len(cats)==1:unique[cats[0]]+=1
  if policy=='mixed' and selector<.5:top=opts;cats=sorted(set(a[0] for a in top))
  c=cats[int(category*len(cats))];pool=[a for a in top if a[0]==c];a=pool[int(tie*len(pool))];used[c]+=1
  ds,b=project(ds,a,roll);breaks+=b is not None
  for j,ch in enumerate(chips):
   if ch and (b==j or not eligible(ds,j)):chips[j]=None;lost+=1
  for j,ch in enumerate(chips):
   if ch and j!=p:
    chips[j]-=1
    if chips[j]==0:wins[j]+=1;cash+=1;chips[j]=None
  if eligible(ds,p):
   assert chips[p] is None
   chips[p]=min(2,n-1);claimed+=1
  assert claimed==cash+lost+sum(bool(c) for c in chips)
  assert all(v in range(1,7) for _,v in ds)
 return dict(wins=wins,cash=cash,lost=lost,used=used,best=best,unique=unique,legal=legal,breaks=breaks)

def batch(n,policy,kinds,omit=None,seeds=100):
 runs=[game(n,s,policy,kinds,omit) for s in range(seeds)]
 out=dict(n=n,policy=policy,kinds=kinds,omit=omit,seeds=seeds,wins=sum(sum(r['wins'])/n for r in runs)/seeds,focal_wins=sum(r['wins'][0] for r in runs)/seeds,zero=sum(sum(r['wins'])==0 for r in runs),lost_rate=sum(r['lost'] for r in runs)/max(1,sum(r['lost']+r['cash'] for r in runs)))
 for key in ['used','best','unique','legal']:
  cc=collections.Counter()
  for r in runs:cc.update(r[key])
  out[key]=dict(cc)
 return out

if __name__=='__main__':
 rows=[]
 for n in range(2,7):
  for policy in ['build','deny','mixed']:
   for kinds in [KINDS[:4],KINDS]:rows.append(batch(n,policy,kinds))
  for omit in KINDS[:4]:rows.append(batch(n,'deny',KINDS[:4],omit))
  print('done',n,flush=True)
 Path(__file__).with_name('results.json').write_text(json.dumps(dict(rounds=18,rows=rows),indent=2))
 for x in rows:
  if x['policy']=='deny':print(x['n'],len(x['kinds']),x['omit'],round(x['wins'],2),x['focal_wins'],x['used'])
