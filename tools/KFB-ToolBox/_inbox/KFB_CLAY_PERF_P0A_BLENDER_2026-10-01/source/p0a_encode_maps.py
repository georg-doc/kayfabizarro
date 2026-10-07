import numpy as np, json
from scipy import ndimage
from PIL import Image
OUT='/tmp/p0a/out'
stats={}
for s,tag in ((101,'v1'),(102,'v2'),(103,'v3'),(104,'v4')):
  n=np.load(f'bake_{s}_normal.npy'); r=np.load(f'bake_{s}_rough.npy'); t=np.load(f'bake_{s}_tint.npy')
  cov=n[...,3]>0.5
  _,idx=ndimage.distance_transform_edt(~cov,return_indices=True)
  dist=ndimage.distance_transform_edt(~cov)
  fill=lambda a: a[idx[0],idx[1]]
  ts=fill(n[...,:3]).copy(); L=np.linalg.norm(ts,axis=-1,keepdims=True); L[L==0]=1; ts/=L
  ts[...,1]*=-1   # GLTFLoader flips normalScale.y when tangents are derived
  far=dist>24; ts[far]=[0,0,1]
  nimg=np.clip(np.round((ts*0.5+0.5)*255),0,255).astype(np.uint8)
  rr=fill(r[...,0]); rr[far]=0.98
  rimg=np.zeros(rr.shape+(3,),np.uint8); rimg[...,0]=255; rimg[...,1]=np.clip(np.round(rr*255),0,255); rimg[...,2]=0
  tt=fill(t[...,:3].mean(-1)); tt[far]=1
  timg=np.clip(np.round(tt/1.25*255),0,255).astype(np.uint8)   # 255 = x1.25, 204 = x1.0
  Image.fromarray(nimg).save(f'{OUT}/building_A__kfb-clay-k2-normal-{tag}.png',optimize=True)
  Image.fromarray(rimg).save(f'{OUT}/building_A__kfb-clay-k2-roughness-{tag}.png',optimize=True)
  Image.fromarray(timg).save(f'{OUT}/building_A__kfb-clay-k2-tint-debug-{tag}.png',optimize=True)
  stats[tag]=dict(seed=s,coverage=float(cov.mean()),rough=[float(x) for x in np.percentile(r[cov][:,0],[1,50,99])],tint=[float(x) for x in np.percentile(t[cov][:,:3].mean(1),[1,50,99])])
json.dump(stats,open('/tmp/p0a/work/map_stats.json','w'),indent=1); print(stats)
