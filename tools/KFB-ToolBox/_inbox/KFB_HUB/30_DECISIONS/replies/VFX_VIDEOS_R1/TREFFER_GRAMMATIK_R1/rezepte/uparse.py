# Unity-YAML (Teilmenge) lesen und ParticleSystem-Rezepte je Prefab ausziehen
import re, json, os, sys, glob
def flow(v):
    v=v.strip()
    if v.startswith('{') and v.endswith('}'):
        d={}
        for part in re.split(r',\s*(?=[A-Za-z_][\w]*:)', v[1:-1]):
            if ':' in part: k,x=part.split(':',1); d[k.strip()]=flow(x)
        return d
    if v.startswith('[') and v.endswith(']'): return [flow(x) for x in v[1:-1].split(',') if x.strip()]
    try: return int(v)
    except: pass
    try: return float(v)
    except: return v
def parse_block(lines, i, ind):
    # liefert (obj, next_i); obj ist dict oder list
    if i<len(lines) and lines[i][0]==ind and lines[i][1].startswith('- ') or (i<len(lines) and lines[i][0]==ind and lines[i][1]=='-'):
        out=[]
        while i<len(lines) and lines[i][0]==ind and lines[i][1].startswith('-'):
            body=lines[i][1][1:].lstrip()
            if not body: o,i=parse_block(lines,i+1,lines[i+1][0]); out.append(o); continue
            if re.match(r'^[A-Za-z_][\w ]*:(\s|$)', body) and not body.startswith('{'):
                sub_ind=ind+2; lines[i]=(sub_ind, body); o,i=parse_block(lines,i,sub_ind); out.append(o)
            else: out.append(flow(body)); i+=1
        return out,i
    d={}
    while i<len(lines) and lines[i][0]==ind and not lines[i][1].startswith('- '):
        k,_,v=lines[i][1].partition(':'); k=k.strip(); v=v.strip(); i+=1
        if v=='':
            if i<len(lines) and (lines[i][0]>ind or (lines[i][0]==ind and lines[i][1].startswith('-'))): d[k],i=parse_block(lines,i,lines[i][0])
            else: d[k]=None
        else: d[k]=flow(v)
    return d,i
def docs(path):
    txt=open(path,encoding='utf-8',errors='replace').read()
    for m in re.finditer(r'^--- !u!(\d+) &(\d+)[^\n]*\n(.*?)(?=^--- |\Z)', txt, re.S|re.M):
        ls=[(len(l)-len(l.lstrip(' ')), l.strip()) for l in m.group(3).split('\n') if l.strip()]
        o,_=parse_block(ls,0,0); yield int(m.group(1)), m.group(2), o
def mm(c):   # MinMaxCurve -> kompakt
    if not isinstance(c,dict): return c
    st=c.get('minMaxState',0); s=c.get('scalar',0)
    keys=lambda cu:[(round(k['time'],3), round(k['value'],3)) for k in ((cu or {}).get('m_Curve') or [])]
    if st==0: return round(s,3)
    if st==3: return [round(c.get('minScalar',0),3), round(s,3)]
    if st==1: return {'x':round(s,3),'kurve':keys(c.get('maxCurve'))}
    return {'x':round(s,3),'kurveMin':keys(c.get('minCurve')),'kurveMax':keys(c.get('maxCurve'))}
def hexc(c): return '#%02x%02x%02x'%tuple(int(max(0,min(1,c.get(k,0)))*255+.5) for k in 'rgb') + ('/a%.2f'%c.get('a',1) if c.get('a',1)<0.995 else '')
def grad(g):
    if not g: return None
    nc=g.get('m_NumColorKeys',0); na=g.get('m_NumAlphaKeys',0)
    return {'farbe':[(round(g.get('ctime%d'%i,0)/65535,2), hexc(g.get('key%d'%i,{})).split('/')[0]) for i in range(nc)], 'alpha':[(round(g.get('atime%d'%i,0)/65535,2), round(g.get('key%d'%i,{}).get('a',1),2)) for i in range(na)]}
def mmg(c):
    if not isinstance(c,dict): return c
    st=c.get('minMaxState',0)
    if st==0: return hexc(c.get('maxColor',{}))
    if st==2: return [hexc(c.get('minColor',{})), hexc(c.get('maxColor',{}))]
    if st==1: return grad(c.get('maxGradient'))
    return {'min':grad(c.get('minGradient')),'max':grad(c.get('maxGradient'))}
GUID=json.load(open(os.path.join(os.path.dirname(__file__),'guid.json')))
MATCACHE={}
def material(guid, root):
    if guid in MATCACHE: return MATCACHE[guid]
    p=GUID.get(guid); r={'mat':os.path.basename(p) if p else guid, 'tex':None, 'misch':None}
    if p:
        f=os.path.join(root,p)
        if os.path.exists(f):
            t=open(f,encoding='utf-8',errors='replace').read()
            m=re.search(r'_MainTex:\s*\n\s*m_Texture: \{fileID: \d+, guid: ([0-9a-f]+)', t) or re.search(r'_BaseMap:\s*\n\s*m_Texture: \{fileID: \d+, guid: ([0-9a-f]+)', t)
            if m: r['tex']=GUID.get(m.group(1), m.group(1))
            sh=re.search(r'm_Shader: \{fileID: (\d+)(?:, guid: ([0-9a-f]+))?', t); dst=re.search(r'_DstBlend: ([\d.]+)', t); src=re.search(r'_SrcBlend: ([\d.]+)', t)
            fid=sh.group(1) if sh else None; r['misch']={'10720':'additiv','10721':'alpha'}.get(fid) or ('additiv' if dst and float(dst.group(1))==1 else 'alpha' if dst and float(dst.group(1))==10 else 'eigen'); r['shader']=(sh.group(2) or sh.group(1)) if sh else None
            col=re.search(r'_(?:Tint)?Color: \{r: ([\d.e-]+), g: ([\d.e-]+), b: ([\d.e-]+), a: ([\d.e-]+)\}', t)
            if col: r['farbe']=hexc(dict(zip('rgba',map(float,col.groups()))))
    MATCACHE[guid]=r; return r
SHAPES={0:'Kugel',4:'Kegel',5:'Box',10:'Kreis',12:'Kante',17:'Donut',6:'Netz',2:'Halbkugel',8:'KegelVolumen',15:'Rechteck'}
RMODE={0:'Billboard',1:'gestreckt',2:'waagrecht',3:'senkrecht',4:'Netz',5:'keins'}
def rezept(path, root):
    go={}; tr={}; ps={}; rd={}
    for cls,fid,o in docs(path):
        if cls==1: go[fid]=o['GameObject']
        elif cls==4: tr[o['Transform']['m_GameObject']['fileID']]=o['Transform']; o['Transform']['_id']=fid
        elif cls==198: ps[o['ParticleSystem']['m_GameObject']['fileID']]=o['ParticleSystem']
        elif cls==199: rd[o['ParticleSystemRenderer']['m_GameObject']['fileID']]=o['ParticleSystemRenderer']
    trById={str(t['_id']):(g,t) for g,t in tr.items()}
    out=[]
    for g,P in ps.items():
        g=str(g) if not isinstance(g,str) else g
    for gid,P in ps.items():
        G=go.get(str(gid)) or go.get(gid) or {}; T=tr.get(gid) or {}; R=rd.get(gid) or {}
        I=P.get('InitialModule',{}); E=P.get('EmissionModule',{}); Sz=P.get('SizeModule',{}); C=P.get('ColorModule',{}); U=P.get('UVModule',{}); Sh=P.get('ShapeModule',{}); V=P.get('VelocityModule',{}); Rt=P.get('RotationModule',{}); N=P.get('NoiseModule',{}); CV=P.get('ClampVelocityModule',{}); F=P.get('ForceModule',{}); TrM=P.get('TrailModule',{}); L=P.get('LightsModule',{})
        par=trById.get(str((T.get('m_Father') or {}).get('fileID')))
        e={'name':G.get('m_Name'),'aktiv':G.get('m_IsActive',1),'eltern':(go.get(str(par[0])) or go.get(par[0]) or {}).get('m_Name') if par else None,
           'pos':T.get('m_LocalPosition'),'rot':T.get('m_LocalEulerAnglesHint'),'skala':T.get('m_LocalScale'),
           'dauer':P.get('lengthInSec'),'schleife':P.get('looping'),'verzoegerung':mm(P.get('startDelay')),'simTempo':P.get('simulationSpeed'),'raum':{0:'lokal',1:'Welt',2:'eigen'}.get(P.get('moveWithTransform'),P.get('moveWithTransform')),
           'leben':mm(I.get('startLifetime')),'tempo':mm(I.get('startSpeed')),'groesse':mm(I.get('startSize')),'groesse3D':I.get('size3D'),'groesseY':mm(I.get('startSizeY')) if I.get('size3D') else None,
           'drehung':mm(I.get('startRotation')),'farbe':mmg(I.get('startColor')),'schwere':mm(I.get('gravityModifier')),'max':I.get('maxNumParticles'),
           'rate':mm(E.get('rateOverTime')) if E.get('enabled') else 0,'bursts':[{'t':b.get('time'),'n':mm(b.get('countCurve')),'zyklen':b.get('cycleCount'),'abstand':b.get('repeatInterval')} for b in (E.get('m_Bursts') or [])] if E.get('enabled') else [],
           'form':({'art':SHAPES.get(Sh.get('type'),Sh.get('type')),'winkel':Sh.get('angle'),'radius':(Sh.get('radius') or {}).get('value') if isinstance(Sh.get('radius'),dict) else Sh.get('radius')} if Sh.get('enabled') else None),
           'groesseZeit':mm(Sz.get('curve')) if Sz.get('enabled') else None,'groesseZeitGetrennt':bool(Sz.get('separateAxes')) if Sz.get('enabled') else None,
           'farbeZeit':mmg(C.get('gradient')) if C.get('enabled') else None,
           'flipbook':({'raster':[U.get('tilesX'),U.get('tilesY')],'bild':mm(U.get('frameOverTime')),'start':mm(U.get('startFrame')),'zyklen':U.get('cycles'),'art':U.get('animationType'),'zeitmodus':U.get('timeMode'),'fps':U.get('fps')} if U.get('enabled') else None),
           'geschwZeit':({'x':mm(V.get('x')),'y':mm(V.get('y')),'z':mm(V.get('z')),'tempoFaktor':mm(V.get('speedModifier'))} if V.get('enabled') else None),
           'drehZeit':mm(Rt.get('curve')) if Rt.get('enabled') else None,'bremse':({'daempfung':mm(CV.get('dampen')),'drag':mm(CV.get('drag')),'limit':mm(CV.get('magnitude'))} if CV.get('enabled') else None),
           'kraft':({'x':mm(F.get('x')),'y':mm(F.get('y')),'z':mm(F.get('z'))} if F.get('enabled') else None),'rauschen':({'staerke':mm(N.get('strength')),'frequenz':N.get('frequency')} if N.get('enabled') else None),
           'spur':bool(TrM.get('enabled')),'licht':bool(L.get('enabled')),
           'render':RMODE.get(R.get('m_RenderMode'),R.get('m_RenderMode')),'streck':{'laenge':R.get('m_LengthScale'),'tempo':R.get('m_VelocityScale')} if R.get('m_RenderMode')==1 else None,'ausrichtung':{0:'Sicht',1:'Welt',2:'lokal',3:'Blick',4:'Tempo'}.get(R.get('m_RenderAlignment'),R.get('m_RenderAlignment')),
           'sortierung':R.get('m_SortingFudge'),'ordnung':R.get('m_SortingOrder'),'pivot':R.get('m_Pivot'),'renderAn':R.get('m_Enabled'),
           'material':[material(m.get('guid'),root) for m in (R.get('m_Materials') or []) if isinstance(m,dict) and m.get('guid')]}
        out.append(e)
    return out
if __name__=='__main__':
    root=sys.argv[1]; res={}
    for f in sorted(glob.glob(os.path.join(root,'**/*.prefab'),recursive=True)):
        try: res[os.path.relpath(f,root)]=rezept(f,root)
        except Exception as ex: res[os.path.relpath(f,root)]={'fehler':repr(ex)}
    json.dump(res,open(sys.argv[2],'w'),ensure_ascii=False,indent=1); print(len(res), sum(len(v) for v in res.values() if isinstance(v,list)), [k for k,v in res.items() if isinstance(v,dict)])
