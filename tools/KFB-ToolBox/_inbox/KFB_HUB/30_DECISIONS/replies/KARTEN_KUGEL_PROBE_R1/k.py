import numpy as np,os
from PIL import Image, ImageFilter
Image.MAX_IMAGE_PIXELS=None
web,dr=Image.open('web3.png').convert('RGB'),Image.open('druck3.png').convert('RGB')
K=4400/1600
crop=lambda im,box:im.crop(tuple(int(v*K) for v in box))
mot={'pfau':(868,505,1282,855),'zauberer':(880,45,1262,435),'lampe':(70,505,490,835)}
def sphere(src,R=512,bulge=.82,light=True):
    w,h=src.size;s=min(w,h);a=np.asarray(src).astype(np.float32)/255
    y,x=np.mgrid[0:R*2,0:R*2];nx=(x+.5-R)/R;ny=(y+.5-R)/R;r=np.hypot(nx,ny);rc=np.clip(r,1e-6,1)
    m=(np.arcsin(rc)/(np.pi/2)/rc)*bulge
    u=(nx*m*.5+.5)*s+(w-s)/2;v=(ny*m*.5+.5)*s+(h-s)/2
    u0=np.clip(np.floor(u).astype(int),0,w-2);v0=np.clip(np.floor(v).astype(int),0,h-2);fu=(u-u0)[...,None];fv=(v-v0)[...,None]
    c=(a[v0,u0]*(1-fu)*(1-fv)+a[v0,u0+1]*fu*(1-fv)+a[v0+1,u0]*(1-fu)*fv+a[v0+1,u0+1]*fu*fv)
    z=np.sqrt(np.clip(1-rc**2,0,1))
    if light:
        L=np.array([-.45,-.55,.7]);L/=np.linalg.norm(L);d=np.clip(nx*L[0]+ny*L[1]+z*L[2],0,1)
        c=c*(.34+.78*d**.8)[...,None]
        c=c+(np.clip((rc-.86)/.14,0,1)**2*np.clip(d+.25,0,1))[...,None]*np.array([1,.93,.78])*.22
    al=np.clip((1-r)*R/1.2,0,1)
    return Image.fromarray((np.dstack([np.clip(c,0,1),al])*255+.5).astype(np.uint8),'RGBA')
def onsky(pl,size=1400):
    c=Image.new('RGBA',(size,size),(150,196,232,255));p=pl.resize((int(size*.82),)*2,Image.LANCZOS);o=(size-p.size[0])//2;c.alpha_composite(p,(o,o));return c.convert('RGB')
for n,b in mot.items():
    p=sphere(crop(dr,b));p.save(f'kugel_{n}_druck.png');onsky(p).save(f'kugel_{n}_himmel.jpg',quality=92);print(n,'1024 png kB',os.path.getsize(f'kugel_{n}_druck.png')//1024)
b=mot['pfau'];ws=crop(web,b);ds=crop(dr,b)
lap=lambda g:float(np.var(np.asarray(g.convert('L').filter(ImageFilter.Kernel((3,3),(0,1,0,1,-4,1,0,1,0),1,128))).astype(float)))
for R in (128,256,512):
    a=sphere(ws,R,light=False);c=sphere(ds,R,light=False);print('Durchmesser',R*2,'Abw',round(float(np.abs(np.asarray(a.convert('RGB')).astype(float)-np.asarray(c.convert('RGB')).astype(float)).mean()),2),'schaerfe web',round(lap(a),1),'druck',round(lap(c),1))
q=sphere(ws,256);q2=sphere(ds,256)
V=Image.new('RGB',(1044,512),(150,196,232));V.paste(q,(0,0),q);V.paste(q2,(532,0),q2);V.save('v512.png')
w=340;bx=(int(.33*ds.size[0]),int(.12*ds.size[1]));A=ws.crop((bx[0],bx[1],bx[0]+w,bx[1]+w));C=ds.crop((bx[0],bx[1],bx[0]+w,bx[1]+w))
V=Image.new('RGB',(w*4+20,w*2),(20,20,28));V.paste(A.resize((w*2,w*2),Image.BICUBIC),(0,0));V.paste(C.resize((w*2,w*2),Image.BICUBIC),(w*2+20,0));V.save('nah_web_druck.png')

# Endfassung: ganzes Motiv, Himmel aus echtem Spielbild, WebP-Größen
p=sphere(crop(dr,mot['pfau']),R=384,bulge=1.0);onsky(p).save('kugel_pfau_nah.jpg',quality=92)
f=Image.open('/Users/georgv.westphalen/kfb-ws0/design-wt/review/design-r1/skycard/SKY_F1_1_FERN.png').convert('RGBA')
for n,(x,y,d) in {'pfau':(250,70,230),'zauberer':(1250,150,120)}.items():
    q=sphere(crop(dr,mot[n]),R=384,bulge=1.0).resize((d,d),Image.LANCZOS);f.alpha_composite(q,(x,y))
f.convert('RGB').save('kugel_im_himmel.jpg',quality=92)
K2=2732/1600
full=dr.crop((int(800*K),int(446*K),int(1600*K),int(892*K)));print('volle Karte aus 4400er',full.size)
c=full.resize((1366,762),Image.LANCZOS);c.save('c.webp',quality=82,method=6);print('Karte 1366 webp kB',os.path.getsize('c.webp')//1024)
m=crop(dr,mot['pfau']).resize((708,598),Image.LANCZOS);m.save('m.webp',quality=82,method=6);print('Motiv 708 webp kB',os.path.getsize('m.webp')//1024)
