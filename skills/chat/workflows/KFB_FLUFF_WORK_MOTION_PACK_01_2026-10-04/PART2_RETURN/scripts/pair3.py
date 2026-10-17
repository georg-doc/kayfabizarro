from lib import *; import json
out={}
for rr in ['Rig_Medium','Rig_Large']:
    rig=Rig(rr); h=H[rr]
    g=Clip(lib(rr,'perf_an01'),'kfb_interaction_gift_give_a'); r=Clip(lib(rr,'perf_an01'),'kfb_interaction_gift_receive_a')
    M=lambda c,f:(lambda w:(w['handslot.l'][:3,3]+w['handslot.r'][:3,3])/2)(rig.fk(c.locals(f)))
    gi,ri=49,39  # catalog events: give.release=50, receive.grab=40 (1-based)
    a=M(g,gi); b=M(r,ri); D=a[2]+b[2]
    lat=abs(a[0]+b[0]); vert=abs(a[1]-b[1])
    out[rr]=dict(D=float(D),receiverLagFrames=10,handoverGiverFrame=50,handoverReceiverFrame=40,lateral=float(lat),vertical=float(vert),verticalH=float(vert/h))
    print(rr,{k:round(v,3) if isinstance(v,float) else v for k,v in out[rr].items()})
json.dump(out,open('/tmp/f2/pair.json','w'))
