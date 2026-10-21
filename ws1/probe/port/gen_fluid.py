# Bettet den Fluid-Shader des KFB Island Kit (kit/fluid.js, Stand F2) 1:1 in die Gelände-Probe ein – erzeugt, nicht abgeschrieben.
# Quelle: ~/kfb-ws1/research/island-kit/KFB_Island_Kit_R1/kit/fluid.js (aus Georgs Export „Hex Assets Worldbuilding.zip“, 21.10.)
# Übernommen wird der Fragment-Shader Zeile für Zeile. Umbenannt wird nur, was in der Probe schon belegt ist:
#   Hilfsfunktionen hh/h3/nz3/nz/pat → kfHh/kfH3/kfNz3/kfNz/kfPat · Kit-Uniforms u* → uKF* · uTime → uTimeR (Echtzeit-Sekunden der Probe)
#   main() → vec4 kitFluid(vW, vFlow, vShore, vSN): die Probe liefert die vier Eingänge des Kits aus ihrem Gelände (Weltort, Fließrichtung, Meter zum Ufer, Fließkoordinaten).
# Texturen (waterdudv.jpg, water.jpg) vom Commit-Pin des Kits aus dem kayfabizarro-Repo, als data-URI (Artefakt-CSP lädt keine fremden Bilder).
# Aufruf:  python3 port/gen_fluid.py   (schreibt den Block KFB_FLUID in gelaende-probe.html)
import re, os, base64, subprocess, json
here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIT = os.path.expanduser('~/kfb-ws1/research/island-kit/KFB_Island_Kit_R1/kit/fluid.js')
REPO = os.path.expanduser('~/kfb-ws1/kayfabizarro')
src = open(KIT).read()

pin = re.search(r"FLUID_PIN = '([0-9a-f]{40})'", src).group(1)
i = src.index('fragmentShader: ['); j = src.index("].join('\\n') });", i)
region = src[i + len('fragmentShader: ['):j]
region = re.sub(r'/\*.*?\*/', '', region, flags=re.S)          # JS-Kommentare zwischen den Zeilen (keine Shader-Zeilen)
region = re.sub(r'//[^\n]*', '', region)
lines = re.findall(r"'((?:[^'\\]|\\.)*)'", region)
assert len(lines) > 30, len(lines)

out = []
for ln in lines:
    s = ln.strip()
    if s.startswith('uniform ') or s.startswith('varying '):
        continue                                               # Eingänge deklariert die Probe selbst (siehe HEAD)
    out.append(ln)
glsl = '\n'.join(out)
for a, b in [('hh', 'kfHh'), ('h3', 'kfH3'), ('nz3', 'kfNz3'), ('nz', 'kfNz'), ('pat', 'kfPat')]:
    glsl = re.sub(r'\b%s\b' % a, b, glsl)
UNI = ['uMoat', 'uHasMap', 'uV', 'uWind', 'uCol', 'uZ', 'uDudv', 'uMap', 'uShallow', 'uBand', 'uShoreFoam']
for u in UNI:
    glsl = re.sub(r'\b%s\b' % u, 'uKF' + u[1:], glsl)
glsl = re.sub(r'\buTime\b', 'uTimeR', glsl)
assert glsl.count('void main(){') == 1 and glsl.count('gl_FragColor = vec4(col, a);') == 1
glsl = glsl.replace('void main(){', 'vec4 kitFluid(vec3 vW, vec2 vFlow, float vShore, vec2 vSN){')
glsl = glsl.replace('gl_FragColor = vec4(col, a);', 'return vec4(col, a);')
HEAD = ('uniform float uKFMoat, uKFHasMap, uKFV, uKFBand, uKFShoreFoam; uniform vec2 uKFWind, uKFZ; uniform vec3 uKFCol, uKFShallow; uniform sampler2D uKFDudv, uKFMap;\n')
glsl = HEAD + glsl

# Startwerte aus dem Uniform-Block des Kits (fluidMaterial) lesen
U = src[src.index('const U = {'):src.index('};', src.index('const U = {'))]
def num(name):
    m = re.search(name + r": \{ value: ([0-9.]+) \}", U); return float(m.group(1))
def vec(name, ctor):
    m = re.search(name + r": \{ value: new THREE\." + ctor + r"\(([^)]*)\) \}", U); return [float(x) for x in m.group(1).split(',')]
col = [float(x) for x in re.search(r"wasser: \{ label: 'Wasser', col: \[([^\]]*)\]", src).group(1).split(',')]
defaults = { 'col': col, 'shallow': vec('uShallow', 'Color'), 'moat': num('uMoat'), 'band': num('uBand'), 'shoreFoam': num('uShoreFoam'), 'v': num('uV'), 'wind': vec('uWind', 'Vector2'), 'z': vec('uZ', 'Vector2') }

def tex(name):
    b = subprocess.run(['git', '-C', REPO, 'show', pin + ':media/3D_Assets/KFB/' + name], capture_output=True, check=True).stdout
    return 'data:image/jpeg;base64,' + base64.b64encode(b).decode()
data = { 'pin': pin, 'source': 'KFB Island Kit R1 · kit/fluid.js (F2) · fluidMaterial() Fragment-Shader 1:1', 'glsl': glsl, 'defaults': defaults, 'dudv': tex('waterdudv.jpg'), 'map': tex('water.jpg') }
block = '<script>/* KFB_FLUID_BEGIN · Island-Kit-Fluid, erzeugt von port/gen_fluid.py (nicht von Hand ändern) */\nwindow.KFB_FLUID = ' + json.dumps(data, ensure_ascii=False) + ';\n/* KFB_FLUID_END */</script>'
f = os.path.join(here, 'gelaende-probe.html'); s = open(f).read()
if 'KFB_FLUID_BEGIN' in s:
    s = re.sub(r'<script>/\* KFB_FLUID_BEGIN.*?/\* KFB_FLUID_END \*/</script>', lambda m: block, s, flags=re.S)
else:
    a = '/* KFB_DRIVE_END */</script>'
    assert s.count(a) == 1; s = s.replace(a, a + '\n' + block)
open(f, 'w').write(s); print('ok', pin[:7], 'glsl', len(glsl), 'tex', len(data['dudv']) + len(data['map']), defaults)
