import sys,math,numpy as np; sys.path.insert(0,'/tmp/loco/work'); from gl import *
ML='/tmp/fluff/ml/'
JN=['root','hips','spine','chest','head','upperarm.l','lowerarm.l','wrist.l','hand.l','handslot.l','upperarm.r','lowerarm.r','wrist.r','hand.r','handslot.r','upperleg.l','lowerleg.l','foot.l','toes.l','upperleg.r','lowerleg.r','foot.r','toes.r']
class Clip:
    def __init__(s,path,name):
        s.g=g=GLB(path); s.P=Pose(g,name); s.name=name
        s.PAR={}
        for n in JN:
            i=g.name2i[n]; p=g.parent.get(i); pn=g.nodes[p].get('name') if p is not None else None
            s.PAR[n]=pn if pn in JN else None
        s.N=s.P.frames
    def locals(s,f):
        P=s.P; g=s.g; t=P.t0+min(f/30,P.T); L={}
        for n in JN:
            i=g.name2i[n]; nd=g.nodes[i]
            T=np.array(nd.get('translation',[0,0,0]),float); R=np.array(nd.get('rotation',[0,0,0,1]),float); S=np.array(nd.get('scale',[1,1,1]),float)
            if (i,'translation') in P.ch: T=sample(P.ch[(i,'translation')],t,'translation')
            if (i,'rotation') in P.ch: R=qnorm(sample(P.ch[(i,'rotation')],t,'rotation'))
            if (i,'scale') in P.ch: S=sample(P.ch[(i,'scale')],t,'scale')
            L[n]=(np.array(T),qnorm(np.array(R)),np.array(S))
        return L
    def fk(s,L):
        W={}
        def w(n):
            if n in W: return W[n]
            T,R,S=L[n]; M=trs(T,R,S); p=s.PAR[n]
            W[n]=(w(p)@M) if p else M; return W[n]
        for n in JN: w(n)
        return W
def qax(axis,deg):
    a=math.radians(deg)/2; v=np.array(axis,float)*math.sin(a); return np.array([v[0],v[1],v[2],math.cos(a)])
def qmul(a,b):
    x1,y1,z1,w1=a; x2,y2,z2,w2=b
    return np.array([w1*x2+x1*w2+y1*z2-z1*y2, w1*y2-x1*z2+y1*w2+z1*x2, w1*z2+x1*y2-y1*x2+z1*w2, w1*w2-x1*x2-y1*y2-z1*z2])
def rv2q(r):
    a=np.linalg.norm(r)
    if a<1e-12: return np.array([0,0,0,1.])
    v=r/a*math.sin(a/2); return np.array([v[0],v[1],v[2],math.cos(a/2)])
def qinv(q): return np.array([-q[0],-q[1],-q[2],q[3]])
def m2q(m):
    t=np.trace(m)
    if t>0: s=math.sqrt(t+1)*2; q=[(m[2,1]-m[1,2])/s,(m[0,2]-m[2,0])/s,(m[1,0]-m[0,1])/s,0.25*s]
    else:
        i=int(np.argmax([m[0,0],m[1,1],m[2,2]]))
        if i==0: s=math.sqrt(1+m[0,0]-m[1,1]-m[2,2])*2; q=[0.25*s,(m[0,1]+m[1,0])/s,(m[0,2]+m[2,0])/s,(m[2,1]-m[1,2])/s]
        elif i==1: s=math.sqrt(1+m[1,1]-m[0,0]-m[2,2])*2; q=[(m[0,1]+m[1,0])/s,0.25*s,(m[1,2]+m[2,1])/s,(m[0,2]-m[2,0])/s]
        else: s=math.sqrt(1+m[2,2]-m[0,0]-m[1,1])*2; q=[(m[0,2]+m[2,0])/s,(m[1,2]+m[2,1])/s,0.25*s,(m[1,0]-m[0,1])/s]
    q=np.array(q); return q/np.linalg.norm(q)
