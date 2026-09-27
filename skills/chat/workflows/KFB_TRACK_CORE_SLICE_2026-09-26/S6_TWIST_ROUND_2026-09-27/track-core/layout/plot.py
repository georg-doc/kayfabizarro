import json, math, sys
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
B=dict(hub_r=68,hole_r=36,core_r=13,arm_w=28,arm_len=50,arms=dict(orange=90,green=210,yellow=330))
D0=math.sqrt(B['hub_r']**2-(B['arm_w']/2)**2)
S=json.load(open(sys.argv[1]))['samples']; out=sys.argv[2]
fig,ax=plt.subplots(1,2,figsize=(16,8))
a=ax[0]
t=[i*math.pi/90 for i in range(181)]
for r,c in ((B['hub_r'],'#bbb'),(B['hole_r'],'#888'),(B['core_r'],'#a6a')): a.plot([r*math.cos(x) for x in t],[r*math.sin(x) for x in t],c)
for n,ang in B['arms'].items():
    d=math.radians(ang); u=(math.cos(d),math.sin(d)); v=(-u[1],u[0]); w=B['arm_w']/2
    pts=[(D0,-w),(D0+B['arm_len'],-w),(D0+B['arm_len'],w),(D0,w),(D0,-w)]
    a.plot([p[0]*u[0]+p[1]*v[0] for p in pts],[p[0]*u[1]+p[1]*v[1] for p in pts],{'orange':'#e8834f','green':'#6c9','yellow':'#d4b53a'}[n])
def W(q,k):
    lat,lift=q['slots'][k]; return [q['p'][i]+q['R'][i]*lat+q['U'][i]*lift for i in range(3)]
for k,c in ((6,'#279797'),(7,'#279797'),(2,'#fa7a47'),(11,'#fa7a47')):
    P=[W(q,k) for q in S]; a.plot([p[0] for p in P],[-p[2] for p in P],c,lw=.8)
a.set_aspect('equal'); a.set_title('plan (Blender x,y)')
b=ax[1]; b.plot([q['s'] for q in S],[q['p'][1] for q in S]); b.set_title('height over s'); b.grid(alpha=.3)
plt.tight_layout(); plt.savefig(out,dpi=90)
