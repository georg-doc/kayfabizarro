# Erzeugt kfb-planet-t439/src/look/terrain3.js + src/data/looks/kfb-terrain3.r1.json aus der Gelände-Probe (Shader 1:1, kein Abschreiben).
import re, json, os
P=os.path.expanduser('~/kfb-ws1/probe/gelaende-probe.html'); G=os.path.expanduser('~/kfb-ws1/kfb-planet-t439')
s=open(P).read()
def grab(name):
    i=s.index('const %s = `'%name)+len('const %s = `'%name); j=s.index('`;',i); return s[i:j]
def obj(name):
    i=s.index('const %s = {'%name); j=s.index('\n  };',i); t=s[i+len('const %s = '%name):j+4]
    t=re.sub(r"([{,]\s*)(\w+)\s*:", r'\1"\2":', t); t=t.replace("'",'"'); t=re.sub(r',\s*}', '}', t); return json.loads(t)
noise=grab('GLSL_NOISE'); flow=grab('GLSL_FLOW'); sky=grab('GLSL_SKY')
cfg={ 'schema':'kfb.look-terrain3/1', 'source':'probe/gelaende-probe.html (Gelände-Probe, Georg 20./21.10.)',
      'palette':'mesa', 'paletteB':'moos', 'mix':False, 'flow':{'speed':1.0,'bands':4,'tempoCoupling':True,'scale':2.5,'downhill':True},
      'palettes': obj('PALETTES'), 'moods': obj('MOODS') }
os.makedirs(G+'/src/data/looks', exist_ok=True)
open(G+'/src/data/looks/kfb-terrain3.r1.json','w').write(json.dumps(cfg, ensure_ascii=False, indent=1))
R=['water','sand','low','mid','high','peak','cliff']
tpl=open(os.path.expanduser('~/kfb-ws1/probe/port/terrain3.tpl.js')).read()
js=tpl.replace('/*@NOISE@*/', noise).replace('/*@FLOW@*/', flow).replace('/*@UA@*/', ', '.join('uA_'+r for r in R)).replace('/*@UB@*/', ', '.join('uB_'+r for r in R))
open(G+'/src/look/terrain3.js','w').write(js)
open(os.path.expanduser('~/kfb-ws1/probe/port/skycolor.glsl'),'w').write(sky[:sky.index('  vec3 applyAir(')])
print('ok', len(js))
