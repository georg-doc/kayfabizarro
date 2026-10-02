import numpy as np
from PIL import Image
T='/tmp/hex/repo/media/3D_Assets/Textures/clay_floor_001/clay_floor_001_'
def lum(a): return (a[...,0]*0.2126+a[...,1]*0.7152+a[...,2]*0.0722)/255
size=512
d=np.asarray(Image.open(T+'diffuse.jpg').convert('RGB').resize((size,size),Image.BILINEAR,reducing_gap=None),dtype=np.float64)
r=np.asarray(Image.open(T+'roughness.jpg').convert('RGB').resize((size,size),Image.BILINEAR),dtype=np.float64)
L=lum(d); mean=L.mean(); std=L.std() or 0.1
dx=(np.roll(L,-1,1)-np.roll(L,1,1))*0.5; dy=(np.roll(L,-1,0)-np.roll(L,1,0))*0.5
cl=lambda v: np.clip(np.round(v),0,255).astype(np.uint8)
out=np.stack([cl(128+dx/std*26*2.2),cl(128+dy/std*26*2.2),cl(lum(r)*255),cl(128+(L-mean)/std*48*0.20/0.20)],-1)
Image.fromarray(out,'RGBA').save('/tmp/hex/work/mat/KFB_GlobalClayLite_clay_floor_001_512.png')
Image.fromarray(out[...,3],'L').save('/tmp/hex/work/mat/lite_A.png'); Image.fromarray(out[...,2],'L').save('/tmp/hex/work/mat/lite_B.png')
print('mean',mean,'std',std,'A range',out[...,3].min(),out[...,3].max(),'B mean',out[...,2].mean())
