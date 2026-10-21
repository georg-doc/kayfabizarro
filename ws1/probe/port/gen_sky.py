import os
G=os.path.expanduser('~/kfb-ws1/kfb-planet-t439')
tpl=open(os.path.expanduser('~/kfb-ws1/probe/port/sky-r13.tpl.js')).read()
sky=open(os.path.expanduser('~/kfb-ws1/probe/port/skycolor.glsl')).read()
open(G+'/src/modules/sky-r13.js','w').write(tpl.replace('/*@SKY@*/', sky)); print('ok')
