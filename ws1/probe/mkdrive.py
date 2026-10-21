# Bettet die Fahrphysik des Spiels (k2t + Racer-Flug, unverändert gebündelt aus kfb-planet-t439/src) in die Probe ein.
# Neu bündeln:  cd ~/kfb-ws1/kfb-planet-t439 && npx vite build --config ~/kfb-ws1/probe/drive/vite.drive.mjs   (outDir anpassen) – dann: python3 mkdrive.py
import re, subprocess, os
here = os.path.dirname(os.path.abspath(__file__))
src = os.path.expanduser('~/kfb-ws1/kfb-planet-t439')
rev = subprocess.run(['git', '-C', src, 'log', '-1', '--format=%h', '--', 'src/m2/k2t.js', 'src/m2/racerFlight.js', 'src/m1/elan.js', 'src/m1/m1Scale.js', 'src/worldScale.js', 'src/camera/followCam.js'], capture_output=True, text=True).stdout.strip()
b = open(os.path.join(here, 'drive', 'kfb-drive.k2t.js')).read()
block = f'<script>/* KFB_DRIVE_BEGIN · Fahrphysik aus dem Spiel, unverändert gebündelt (kfb-planet-t439 @{rev}: m2/k2t.js, m2/racerFlight.js, m1/elan.js, camera/followCam.js; three = globales THREE) */\n{b}\n/* KFB_DRIVE_END */</script>'
f = os.path.join(here, 'gelaende-probe.html'); s = open(f).read()
if 'KFB_DRIVE_BEGIN' in s:
    s = re.sub(r'<script>/\* KFB_DRIVE_BEGIN.*?/\* KFB_DRIVE_END \*/</script>', lambda m: block, s, flags=re.S)
else:
    a = '<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/loaders/GLTFLoader.js"></script>'
    assert s.count(a) == 1; s = s.replace(a, a + '\n' + block)
open(f, 'w').write(s); print('ok', rev, len(b))
