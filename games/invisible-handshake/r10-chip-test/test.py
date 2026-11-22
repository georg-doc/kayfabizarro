import random,json
from pathlib import Path
V=[(1,1,0),(-1,1,0),(1,0,1),(-1,0,-1),(0,-1,1),(0,1,-1),(1,0,0),(-1,0,0),(0,1,0),(0,-1,0),(0,0,1),(0,0,-1)]
def run(n,layout,policy,values,seed,lock=False):
 r=random.Random(seed);actors=6 if layout=='six' else n;slots=6 if layout=='six' else max(3,n) if layout=='scaled' else 3
 chips=[None]*slots;dice=[3]*3;hands=[[r.choice(V) for _ in range(3)] for _ in range(actors)];wins=[0]*actors;claims=lost=won=breaks=0;trace=[];zero_rounds=0
 for turn in range(actors*12):
  p=turn%actors
  for j,c in enumerate(chips):
   if c==p:chips[j]=None;wins[p]+=1;won+=1
  mode='random' if p>=n else policy
  if mode=='mixed':mode='block' if r.random()<.5 else 'build'
  occupied=[j for j,c in enumerate(chips) if c is not None and c!=p]
  if mode=='block' and occupied:target=min(occupied,key=lambda j:(chips[j]-p)%actors)
  elif mode=='build':
   empty=[j for j,c in enumerate(chips) if c is None];target=(p%slots if p%slots in empty else r.choice(empty)) if empty else r.randrange(slots)
  else:target=r.randrange(slots)
  if values=='free':
   legal=[(i,d) for i in range(3) for d in [-1,1] if 1<=dice[i]+d<=6];i,d=r.choice(legal);delta=[0]*3;delta[i]=d
  else:
   opts=[i for i,v in enumerate(hands[p]) if all(1<=dice[k]+v[k]<=6 for k in range(3))]
   index=r.choice(opts) if opts and mode!='random' else r.randrange(3);delta=hands[p][index];hands[p][index]=r.choice(V)
  after=[dice[k]+delta[k] for k in range(3)];bust=any(v<1 or v>6 for v in after);dice=[v if 1<=v<=6 else 3 for v in after]
  if bust:breaks+=1
  else:
   if chips[target] is not None:lost+=1
   chips[target]=None
  # Variant: attacking an occupied opponent slot cannot place a new chip this turn.
  canclaim=not(lock and target in occupied and not bust)
  if canclaim:
   free=[j for j,c in enumerate(chips) if c is None]
   if free:
    j=target if target in free else r.choice(free);chips[j]=p;claims+=1
  assert len([c for c in chips if c is not None])==len(set(c for c in chips if c is not None))
  assert all(1<=v<=6 for v in dice)
  if seed==0 and turn<18:trace.append([turn+1,p+1,target+1,bust,chips[:],wins[:]])
 return dict(human_wins=sum(wins[:n])/n,total_wins=sum(wins),claims=claims,won=won,lost=lost,pending=sum(c is not None for c in chips),breaks=breaks,zero=sum(wins)==0,trace=trace)
rows=[]
for layout in ['three','scaled','six']:
 for values in ['free','fixed']:
  for policy in ['build','random','mixed','block']:
   for n in range(2,7):
    a=[run(n,layout,policy,values,seed) for seed in range(400)]
    assert all(x['claims']==x['won']+x['lost']+x['pending'] for x in a)
    rows.append(dict(layout=layout,values=values,policy=policy,players=n,games=len(a),wins_per_human=sum(x['human_wins'] for x in a)/len(a),survival=sum(x['won'] for x in a)/max(1,sum(x['won']+x['lost'] for x in a)),zero_games=sum(x['zero'] for x in a),breaks_per_game=sum(x['breaks'] for x in a)/len(a)))
variants=[]
for n in range(2,7):
 a=[run(n,'six','block','free',s,True) for s in range(400)]
 variants.append(dict(players=n,wins_per_human=sum(x['human_wins'] for x in a)/400,zero_games=sum(x['zero'] for x in a)))
Path(__file__).with_name('results.json').write_text(json.dumps(dict(games=48000+2000,rounds=12,seeds=400,results=rows,attack_no_claim=variants,trace=run(2,'three','block','free',0)['trace']),indent=2))
for layout in ['three','scaled','six']:
 print(layout)
 for policy in ['build','random','mixed','block']:
  print(policy,[round(x['wins_per_human'],2) for x in rows if x['layout']==layout and x['policy']==policy and x['values']=='free'])
print('attack_no_claim',variants)
