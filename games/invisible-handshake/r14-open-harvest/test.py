import random,json,collections
from pathlib import Path

def options(s,p):
 board,hands,ds=s['board'],s['hands'],s['dice'];out=[];active=[j for j,b in enumerate(board) if b]
 for i,(pos,v) in enumerate(ds):
  if pos is None:continue
  out += [('adjust',i,-1),('adjust',i,1),('reroll',i,0)]
  out += [('move',i,j) for j in active if j!=pos]
 for i in range(3):
  for j in range(i+1,3):
   if ds[i][0] is not None and ds[j][0] is not None and ds[i][0]!=ds[j][0]:out.append(('swap',i,j))
 if not board[p] and hands[p]>0:out.append(('play',p,0))
 if hands[p]<6 and s['stock']>0:out.append(('draw',p,0))
 return out

def choose(s,p,mode,rng):
 opts=options(s,p)
 if not opts:return None
 if mode=='random':
  cats=sorted(set(a[0] for a in opts));c=rng.choice(cats);return rng.choice([a for a in opts if a[0]==c])
 harvest=[a for a in opts if a[0]=='adjust' and a[2]==1 and s['dice'][a[1]][1]==6]
 if harvest:return rng.choice(harvest)
 # Both deliberate policies replenish an empty own slot before preparing shared dice.
 for cat in ['play','draw']:
  if (cat=='play' or not s['board'][p]) and any(a[0]==cat for a in opts):return next(a for a in opts if a[0]==cat)
 dice=[i for i,(pos,v) in enumerate(s['dice']) if pos is not None]
 if mode=='builder' and dice:
  best=max(s['dice'][i][1] for i in dice);return ('adjust',rng.choice([i for i in dice if s['dice'][i][1]==best]),1)
 if mode=='waiter' and dice:
  # Refuse the deterministic gift 5->6; reroll a low die, hoping for a future opportunity.
  low=min(s['dice'][i][1] for i in dice);return ('reroll',rng.choice([i for i in dice if s['dice'][i][1]==low]),0)
 return rng.choice(opts)

def apply(s,p,a,roll,dest,turn):
 kind,i,arg=a;ds=s['dice'];before=[d[:] for d in ds];removed=None
 s['used'][kind]+=1
 if kind=='draw':s['stock']-=1;s['hands'][p]+=1
 elif kind=='play':
  s['hands'][p]-=1;s['board'][p]=True
  for d in ds:
   if d[0] is None:d[0]=p
 elif kind=='move':ds[i][0]=arg
 elif kind=='swap':ds[i][0],ds[arg][0]=ds[arg][0],ds[i][0]
 elif kind in ['adjust','reroll']:
  ds[i][1]=ds[i][1]+arg if kind=='adjust' else roll
  if ds[i][1]>6:
   s['wins'][p]+=1;s['emotion_wins'][p][i]+=1;removed=ds[i][0]
   mark=s['six'][i]
   if mark:
    source,who,when=mark;s['resolved'][source]+=1;s['self_return'][source]+=who==p;s['next_return'][source]+=turn==when+1
   s['upper']+=1
  elif ds[i][1]<1:removed=ds[i][0];s['discard']+=1;s['lower']+=1
  if removed is not None:
   s['board'][removed]=False;ds[i][1]=3
   active=[j for j,b in enumerate(s['board']) if b]
   for j,d in enumerate(ds):
    if d[0]==removed:d[0]=active[int(dest[j]*len(active))] if active else None
  for j,d in enumerate(ds):
   if d[1]!=6:s['six'][j]=None
  if before[i][1]!=6 and ds[i][1]==6:
   source='prepare' if kind=='adjust' else 'reroll';s['created'][source]+=1;s['six'][i]=(source,p,turn)
 assert s['stock']+sum(s['hands'])+sum(s['board'])+sum(s['wins'])+s['discard']==50
 assert all(0<=h<=6 for h in s['hands'])
 assert all(1<=v<=6 and (pos is None or s['board'][pos]) for pos,v in ds)
 return removed

def game(n,seed,config,rounds=24):
 rng=random.Random(seed*31+1);rr=random.Random(seed*31+2);rel=random.Random(seed*31+3)
 s=dict(board=[True]*n,hands=[3]*n,stock=50-4*n,dice=[[i%n,3] for i in range(3)],wins=[0]*n,emotion_wins=[[0]*3 for _ in range(n)],discard=0,upper=0,lower=0,six=[None]*3,used=collections.Counter(),created=collections.Counter(),resolved=collections.Counter(),self_return=collections.Counter(),next_return=collections.Counter())
 passes=0
 for turn in range(rounds*n):
  p=(turn+seed%n)%n
  if config in ['builder','waiter','random']:mode=config
  elif config=='waiter_focal':mode='waiter' if p==0 else 'builder'
  elif config=='builder_focal':mode='builder' if p==0 else 'waiter'
  elif config=='mixed':mode='random' if rng.random()<.3 else ('builder' if p%2==0 else 'waiter')
  roll=rr.randrange(1,7);dest=[rel.random() for _ in range(3)];a=choose(s,p,mode,rng)
  if a is None:passes+=1;continue
  apply(s,p,a,roll,dest,turn)
 return dict(wins=s['wins'],upper=s['upper'],lower=s['lower'],used=dict(s['used']),created=dict(s['created']),resolved=dict(s['resolved']),self_return=dict(s['self_return']),next_return=dict(s['next_return']),passes=passes,stock=s['stock'],empty=sum(not b for b in s['board']),emotion_wins=s['emotion_wins'])

def main():
 rows=[]
 for n in range(2,7):
  for config in ['builder','waiter','random','mixed','waiter_focal','builder_focal']:
   runs=[game(n,seed,config) for seed in range(200)];out=dict(n=n,config=config,runs=200,wins=sum(sum(r['wins'])/n for r in runs)/200,focal=sum(r['wins'][0] for r in runs)/200,others=sum(sum(r['wins'][1:])/(n-1) for r in runs)/200,zero=sum(sum(r['wins'])==0 for r in runs),lower=sum(r['lower'] for r in runs),passes=sum(r['passes'] for r in runs),stock_empty=sum(r['stock']==0 for r in runs))
   for key in ['used','created','resolved','self_return','next_return']:
    c=collections.Counter()
    for r in runs:c.update(r[key])
    out[key]=dict(c)
   rows.append(out)
  print(n,'done',flush=True)
 Path(__file__).with_name('results.json').write_text(json.dumps(dict(rounds=24,seeds=200,rows=rows),indent=2))
 for x in rows:print(x['n'],x['config'],round(x['wins'],2),round(x['focal'],2),round(x['others'],2),x['zero'],x['created'],x['self_return'],x['resolved'])
if __name__=='__main__':main()
