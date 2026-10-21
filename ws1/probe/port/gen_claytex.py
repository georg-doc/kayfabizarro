# Bettet Clay001 (kayfabizarro media/3D_Assets/Textures/Clay001, Pin unten) als Normal- und AO-Karte (512², JPEG) in die Gelände-Probe ein: Block KFB_CLAYTEX.
# Neu bauen: Karten nach port/clay/c512_{normal,ao}.jpg legen (sips -Z 512), dann python3 port/gen_claytex.py
import os, re, base64, json
here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PIN = 'c746a9567e0ea20a24b8969fe9130ac0756e7a7e'
d = { 'pin': PIN, 'source': 'media/3D_Assets/Textures/Clay001 (normal, ao), 512²' }
for k in ['normal', 'ao']:
    d[k] = 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(here, 'port', 'clay', 'c512_%s.jpg' % k), 'rb').read()).decode()
block = '<script>/* KFB_CLAYTEX_BEGIN · erzeugt von port/gen_claytex.py */\nwindow.KFB_CLAYTEX = ' + json.dumps(d) + ';\n/* KFB_CLAYTEX_END */</script>'
f = os.path.join(here, 'gelaende-probe.html'); s = open(f).read()
if 'KFB_CLAYTEX_BEGIN' in s: s = re.sub(r'<script>/\* KFB_CLAYTEX_BEGIN.*?/\* KFB_CLAYTEX_END \*/</script>', lambda m: block, s, flags=re.S)
else:
    a = '/* KFB_FLUID_END */</script>'; assert s.count(a) == 1; s = s.replace(a, a + '\n' + block)
open(f, 'w').write(s); print('ok', sum(len(d[k]) for k in ['normal', 'ao']))
