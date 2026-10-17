from lib import *; import pickle
res=pickle.load(open('res.pkl','rb')); rr='Rig_Large'; rig=Rig(rr); R=0.22*2.17*3**(1/3)
LEGR=0.17   # approx Orc Brute shin/foot half-thickness (m), checked against the mesh test afterwards
def legclear(seq,C):
    m=1e9
    for L in seq:
        W=rig.fk(L)
        for sd in 'lr':
            P=[W[f'{n}.{sd}'][:3,3] for n in ('upperleg','lowerleg','foot','toes')]
            for a,b in zip(P[:-1],P[1:]):
                for u in np.linspace(0,1,8):
                    p=a+(b-a)*u; m=min(m,np.linalg.norm(p-C)-R-LEGR)
    return m
srcs={'kfb_fluff_roll_push_a':('locomotion','kfb_locomotion_wheelbarrow_walk_a',False),'kfb_fluff_roll_push_heavy_a':('locomotion_i05','kfb_locomotion_wheelbarrow_walk_b',True)}
for k,(lb,cl,heavy) in srcs.items():
    c=Clip(lib(rr,lb),cl); src=seq_from(c)
    if heavy:
        st,info=strip_travel(src); src=stretch(st,round(len(src)/0.75)/len(src))
    for reach in (0.90,0.95,0.98):
        for el in range(30,80,5):
            C,T,a=ball_contacts(rig,src,R,el_deg=el,reach=reach); e=ball_contacts.last_el
            print(k,'reach',reach,'el req',el,'used',e,'C',C.round(2),'legClear',round(legclear(src[::3],C),3))
            if e!=el: break
