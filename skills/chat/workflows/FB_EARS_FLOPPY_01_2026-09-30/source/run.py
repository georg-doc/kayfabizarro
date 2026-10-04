import sys; sys.path.insert(0,'/tmp/fbr'); import bpy; from sim import *
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
exec(open('/tmp/fbr/cfg.py').read())
up=np.array([0,1.0,0])   # character faces -y, air relative to a forward-moving character flows +y
SC=[('idle · idle_b (10 s)','kfb_idle_idle_b',1,None),
    ('bend over · lifting (deadlift)','kfb_action_lifting_a',1,None),
    ('walk 1.4 m/s · wind fed','kfb_locomotion_walking_a',6,lambda i:up*1.4),
    ('racer 12 m/s · wind fed','kfb_idle_idle_b',1,lambda i:up*12.0),
    ('jump + landing','kfb_locomotion_jump_a',1,None)]
R={}; fig,axs=plt.subplots(len(SC),1,figsize=(11,2.6*len(SC)))
cols=['#888888','#2a7ab8','#d9822b','#b83a3a']
for (name,cid,loops,wind),ax in zip(SC,axs):
    P,Q=head_track(cid,loops); hp=head_pitch_deg(Q); t=np.arange(len(P))/FPS
    R[name]={'clip':cid,'headPitchDeg':[round(float(hp.min()),1),round(float(hp.max()),1)]}
    for (cn,e),c in zip(CFG.items(),cols):
        o=simulate(P,Q,e,None if cn.startswith('today') else wind); tip=np.degrees(o[:,:,0].sum(1)); roll=np.degrees(o[:,:,1].sum(1))
        sk=int(FPS*0.5)   # skip settle
        R[name][cn]={'tipPitchDeg':{'min':round(float(tip[sk:].min()),1),'max':round(float(tip[sk:].max()),1),'mean':round(float(tip[sk:].mean()),1),'p2p':round(float(np.ptp(tip[sk:])),1)},'rollP2pDeg':round(float(np.ptp(roll[sk:])),1)}
        ax.plot(t,tip,color=c,lw=1.6 if cn.startswith('today') else 1.2,label=cn)
        np.save(f'/tmp/fbr/tip_{cid}_{cn[:5].strip()}.npy',o)
    ax2=ax.twinx(); ax2.plot(t,hp,color='#999',ls=':',lw=1); ax2.set_ylabel('head lean fwd °',color='#999',fontsize=8)
    ax.set_title(name,fontsize=10,loc='left'); ax.set_ylabel('ear tip ° (+ fwd)',fontsize=8); ax.axhline(0,color='#ccc',lw=0.6)
axs[0].legend(fontsize=7,loc='upper right',ncol=2); axs[-1].set_xlabel('s')
plt.tight_layout(); plt.savefig('/tmp/fbr/ear_curves.png',dpi=110)
json.dump(R,open('/tmp/fbr/sim.json','w'),indent=1)
for k,v in R.items():
    print(k,v['headPitchDeg']); [print('   ',cn[:12],v[cn]['tipPitchDeg'],v[cn]['rollP2pDeg']) for cn in CFG]
