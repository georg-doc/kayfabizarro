import random,json,copy
from pathlib import Path
# Three public dice, six faction signature slots. Infinite replacement cards: topology test only.
def eligible(s,p):
 ds=[v for pos,v in s['dice'] if pos==p]
 return any(3<=v<=5 for v in ds) and all(2<=v<=5 for v in ds)
def resolve(s,p,a):
 s=copy.deepcopy(s);kind,i,arg=a;broken=None
 if kind=='move':s['dice'][i][0]=arg
 else:
  pos,v=s['dice'][i];v+=arg
  if v<1 or v>6:
   broken=pos;s['cards'][pos]+=1;s['chips'][pos]=False;s['dice'][i][1]=3;s['breaks'][0 if v==0 else 1]+=1
  else:s['dice'][i][1]=v
 for j in range(6):
  if s['chips'][j] and not eligible(s,j):s['chips'][j]=False;s['lost']+=1
 return s,broken
def options(s,roll):
 i=(roll-1)//2
 return [('move',i,p) for p in range(6) if p!=s['dice'][i][0]] if roll%2 else [('change',i,d) for d in [-1,1]]
def game(seed,policy,rounds=18):
 r=random.Random(seed);s={'dice':[[0,3],[2,3],[4,3]],'cards':[0]*6,'chips':[False]*6,'wins':[0]*6,'breaks':[0,0],'lost':0};claims=0
 for turn in range(6*rounds):
  p=turn%6
  if s['chips'][p]:
   assert eligible(s,p);s['wins'][p]+=1;s['cards'][p]+=1;s['chips'][p]=False
  roll=r.randint(1,6);opts=options(s,roll);scores=[]
  for a in opts:
   t,b=resolve(s,p,a);destroyed=sum(s['chips'][j] and not t['chips'][j] for j in range(6) if j!=p)
   own=int(eligible(t,p));safe=sum(3<=v<=5 for pos,v in t['dice'] if pos==p)
   scores.append((own*3+destroyed*(4 if policy=='deny' else 1)+safe*.1+r.random()*.01,a))
  a=r.choice(opts) if policy=='random' else max(scores)[1];s,_=resolve(s,p,a)
  if eligible(s,p):s['chips'][p]=True;claims+=1
  assert all(1<=v<=6 for _,v in s['dice'])
 return {'wins':s['wins'],'breaks':s['breaks'],'zero':sum(s['wins'])==0,'claims':claims}
rows=[]
for policy in ['random','build','deny']:
 runs=[game(i,policy) for i in range(400)]
 rows.append({'policy':policy,'runs':400,'rounds':18,'wins_per_player':sum(sum(s['wins']) for s in runs)/2400,'seat_means':[sum(s['wins'][p] for s in runs)/400 for p in range(6)],'zero_runs':sum(s['zero'] for s in runs),'low_breaks':sum(s['breaks'][0] for s in runs),'high_breaks':sum(s['breaks'][1] for s in runs)})
# Boundary and continuous-survival tests
s={'dice':[[0,1],[2,6],[4,4]],'cards':[0]*6,'chips':[False]*6,'wins':[0]*6,'breaks':[0,0],'lost':0}
t,b=resolve(s,1,('change',0,-1));assert b==0 and t['cards'][0]==1 and t['dice'][0]==[0,3]
t,b=resolve(s,1,('change',1,1));assert b==2 and t['cards'][2]==1 and t['dice'][1]==[2,3]
s['chips'][4]=True;t,b=resolve(s,0,('change',2,-1));assert t['chips'][4];t,b=resolve(t,0,('change',2,-1));assert not t['chips'][4];t,b=resolve(t,0,('change',2,1));assert not t['chips'][4] # restoration doesnot resurrectclaim
Path(__file__).with_name('results.json').write_text(json.dumps({'results':rows,'boundary_tests':5,'pass':True},indent=2));print(json.dumps(rows,indent=2))
