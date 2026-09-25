"""Builds ear_rig_studio.html (bundle) from ear_rig_template.html + ear-dangle.v1.js + the two GLBs."""
import base64, re, sys, pathlib
here = pathlib.Path(__file__).parent
glb = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else here.parent / 'glb'
tpl = (here / 'ear_rig_template.html').read_text()
mod = (here.parent / 'ear-dangle.v1.js').read_text()
mod = re.sub(r"^import \* as THREE from 'three';\n", '', mod, flags=re.M)
mod = re.sub(r'^export ', '', mod, flags=re.M)
out = tpl.replace('/*__EAR_DANGLE__*/', mod)
out = out.replace('__BASE__', base64.b64encode((glb / 'FB_BASE_NOEARS_v5.glb').read_bytes()).decode())
out = out.replace('__EAR__', base64.b64encode((glb / 'FB_EAR_UNIT_v5.glb').read_bytes()).decode())
(here / 'ear_rig_studio.html').write_text(out)
print('ok', len(out) // 1024, 'KB')
