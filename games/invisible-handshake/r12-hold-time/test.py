import random,json
from pathlib import Path

def eligible(ds,slot):
 vals=[v for p,v in ds if p==slot]
 return any(3<=v<=5 for v in vals) and all(2<=v<=5 for v in vals)
def projection(ds,a):
 out=[d[:] for d in ds];kind,i,arg=a;broken=None
 if kind=='m':out[i][0]=arg
 else:
  out[i][1]+=arg
  if not 1<=out[i][1]<=6:broken=out[i][0];out[i][1]=3
 return out,broken

def game(n,k,policy,seed,slots_per=1,rounds=18):
 rolls=random.Random(seed*97+1);moves=random.Random(seed*97+2);setup=random.Random(seed*97+3)
 positions=list(range(n*slots_per));setup.shuffle(positions);ds=[[positions[i%len(positions)],3] for i in range(3)];chips=[None]*n;wins=[0]*n;claimed=lost=cash=attacks=attempts=breaks=0;opportunities=[0]*n
 for turn in range(n*rounds):
  p=(turn+seed%n)%n;roll=rolls.randrange(6);i=roll//2
  opts=[('m',i,j) for j in range(n*slots_per) if j!=ds[i][0]] if roll%2==0 else [('v',i,d) for d in [-1,1]]
  selector=moves.random();tie=moves.random();mode=('random' if selector<.5 else 'deny') if policy=='mixed' else policy
  projected=[]
  for a in opts:
   dd,b=projection(ds,a);dead=[j for j,ch in enumerate(chips) if ch and (ch[0]==b or not eligible(dd,ch[0]))]
   own=sum(eligible(dd,j) for j in range(p*slots_per,(p+1)*slots_per));enemy=[j for j in dead if j!=p]
   urgent=sum(1/(chips[j][1]) for j in enemy)
   projected.append((dd,b,dead,3*bool(own)+4*len(enemy)+urgent,a))
  possible=any(any(j!=p for j in x[2]) for x in projected)
  attempts+=possible
  if mode=='random':pick=int(tie*len(opts))
  else:
   best=max(x[3] for x in projected);ids=[j for j,x in enumerate(projected) if x[3]==best];pick=ids[int(tie*len(ids))]
  ds,b,dead,_,a=projected[pick];breaks+=b is not None
  attacks+=any(j!=p for j in dead)
  for j in dead:chips[j]=None;lost+=1
  # Only opponents' turns decrement the waiting period; a new claim never ages on its creation turn.
  for j,ch in enumerate(chips):
   if ch and j!=p:
    ch[1]-=1
    if ch[1]==0:
     assert eligible(ds,ch[0]);wins[j]+=1;cash+=1;chips[j]=None
  free=[j for j in range(p*slots_per,(p+1)*slots_per) if eligible(ds,j)]
  if free:
   assert chips[p] is None
   chips[p]=[free[0],k];claimed+=1
  assert all(1<=v<=6 for _,v in ds)
  assert claimed==cash+lost+sum(c is not None for c in chips)
 return dict(wins=sum(wins)/n,zero=sum(wins)==0,claims=claimed,cash=cash,lost=lost,pending=sum(c is not None for c in chips),attempts=attempts,attacks=attacks,breaks=breaks)
rows=[]
for n in range(2,7):
 for k in sorted(set([1,min(2,n-1),n-1])):
  for policy in ['random','mixed','deny']:
   a=[game(n,k,policy,s) for s in range(200)]
   rows.append(dict(n=n,k=k,policy=policy,runs=len(a),wins=sum(x['wins'] for x in a)/len(a),zero=sum(x['zero'] for x in a),lost_rate=sum(x['lost'] for x in a)/sum(x['lost']+x['cash'] for x in a),denial_when_possible=sum(x['attacks'] for x in a)/max(1,sum(x['attempts'] for x in a))))
extra=[]
for n in [2,4,6]:
 for sp in [1,3]:
  a=[game(n,min(2,n-1),'mixed',s,sp) for s in range(200)]
  extra.append(dict(n=n,slots_per=sp,wins=sum(x['wins'] for x in a)/200,lost_rate=sum(x['lost'] for x in a)/sum(x['lost']+x['cash'] for x in a)))
Path(__file__).with_name('results.json').write_text(json.dumps(dict(rounds=18,seeds=200,rows=rows,extra=extra),indent=2))
for n in range(2,7):print(n,[(x['k'],round(x['wins'],2),round(x['lost_rate']*100,1)) for x in rows if x['n']==n and x['policy']=='mixed'])
print('extra',extra)
