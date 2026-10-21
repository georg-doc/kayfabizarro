# Erzeugt kfbWater.js (Wasserband, Seen, Wasserfälle, Gischt) fürs Spiel aus der Gelände-Probe – Shader 1:1 übernommen, kein Abschreiben.
# Übernommen: GLSL_NOISE, KFB_FLUID (Kit-Fluid + Texturen), rivSample, die drei main()-Körper (Band/See, Fall, Gischt), die Gischt-Bällchen.
# Ersetzt (Spiel ≠ Probe): hgt() liest die Höhentextur des Gelände-Netzes (gleiche Dreiecke wie PlaneGeometry), Probe-Schatten (wShadow) und
# Luftperspektive (applyAir) vorerst neutral, Meer aus (uWater tief). Aufruf: python3 port/gen_water_game.py <spiel-repo>
import os, sys, re, json, hashlib
P = os.path.expanduser('~/kfb-ws1/probe/gelaende-probe.html'); s = open(P).read(); G = sys.argv[1]
def between(a, b, start=0):
    i = s.index(a, start); j = s.index(b, i); return s[i:j], j
noise = s[s.index('const GLSL_NOISE = `') + len('const GLSL_NOISE = `'):]; noise = noise[:noise.index('`;')]
i = s.index('window.KFB_FLUID = '); j = s.index('\n', i); fluid = json.loads(s[i + len('window.KFB_FLUID = '):j].rstrip(';'))
riv, _ = between('  vec2 rivSample(vec2 p){', '  float rivMod(vec2 p, float h)')
def main_of(marker):
    k = s.index(marker); m = s.index('  void main(){', k); e = s.index('}` })', m); return s[m:e + 1]
def frag_of(marker):   # Ende = schließender Backtick des Template-Strings (` }) oder `,)
    k = s.index(marker); a = s.index('fragmentShader: `', k) + len('fragmentShader: `'); return s[a:s.index('`', a)]
def vert_of(marker):
    k = s.index(marker); a = s.index('vertexShader: `', k) + len('vertexShader: `'); return s[a:s.index('`,', a)]
M_R = "    const mat = new THREE.ShaderMaterial({ uniforms: U, transparent: true, depthWrite: false, side: THREE.DoubleSide,"
M_F = "    const fallMat = new THREE.ShaderMaterial("; M_C = "    const foamMat = new THREE.ShaderMaterial("
HEIGHT_SUB = """uniform float uAmp; uniform vec2 uSeed;
float gNE;
uniform sampler2D uGround; uniform vec4 uGroundO;
float hgt(vec2 p){ vec2 f=(p-uGroundO.xy)/uGroundO.z, i=clamp(floor(f), vec2(0.0), vec2(uGroundO.w-1.0)), uv=f-i; ivec2 c=ivec2(i);   /* = surfaceAt des Gelände-Moduls (Spiel) */
  float ha=texelFetch(uGround,c,0).r, hb=texelFetch(uGround,c+ivec2(0,1),0).r, hc=texelFetch(uGround,c+ivec2(1,1),0).r, hd=texelFetch(uGround,c+ivec2(1,0),0).r;
  return uv.x+uv.y<=1.0 ? ha+(hd-ha)*uv.x+(hb-ha)*uv.y : hc+(hb-hc)*(1.0-uv.x)+(hd-hc)*(1.0-uv.y); }
uniform sampler2D uRiv; uniform vec4 uRivO;
#define RIV_N 512.0
""" + riv
SKY_SUB = "uniform float uSky2; uniform vec3 uSunDir, uSunCol;\nvec3 applyAir(vec3 c, vec3 p, float n){ return c; }   /* Spiel: Luftperspektive vorerst neutral */\nvec3 skyColor(vec3 d){ return mix(vec3(0.78,0.88,0.94), vec3(0.45,0.66,0.86), clamp(d.y,0.0,1.0)); }   /* nur im alten Probe-Wasserzweig (uWKit = 0) */"
WSH_SUB = "float wShadow(vec3 p){ return 1.0; }   /* Spiel: Probe-Schattenkarte gibt es nicht (Schatten im Wasser folgt) */"
def game_frag(t):
    t = t.replace('${GLSL_NOISE}\\n${GLSL_HEIGHT}', '${GLSL_NOISE}\n${GLSL_HEIGHT}')
    t = t.replace('${GLSL_NOISE}', noise).replace('${GLSL_HEIGHT}', HEIGHT_SUB).replace('${GLSL_SKY}', SKY_SUB).replace('${window.KFB_FLUID.glsl}', fluid['glsl']).replace('${wsh}', WSH_SUB)
    assert '${' not in t, t[t.index('${'):t.index('${') + 60]
    return t
M_S = "  const waterMat = new THREE.ShaderMaterial({"
ribbon, fall, foam, sea = frag_of(M_R), frag_of(M_F), frag_of(M_C), frag_of(M_S)
f_rib, f_fall, f_foam, f_sea = game_frag(ribbon), game_frag(fall), game_frag(foam), game_frag(sea)
def color_out(t):   # Probe-Werte sind sRGB-Bildwerte (r147 roh ausgegeben) → im Spiel (Farbverwaltung r186) in den Ausgaberaum übertragen: Bildschirm gleich, Render-Ziele nicht doppelt aufgehellt
    k = t.rindex('void main(){'); return t[:k] + 'void kfbMain(){' + t[k + len('void main(){'):] + '\nvoid main(){ kfbMain(); gl_FragColor.rgb = sRGBTransferEOTF(gl_FragColor).rgb;\n#include <colorspace_fragment>\n}'
f_rib, f_fall, f_foam, f_sea = color_out(f_rib), color_out(f_fall), color_out(f_foam), color_out(f_sea)
v_rib, v_fall, v_foam, v_sea = vert_of(M_R), vert_of(M_F), vert_of(M_C), game_frag(vert_of(M_S))
pf_end = s.index('      M.count = n; M.instanceMatrix.needsUpdate = true }', s.index('    function puffs(t) {')) + len('      M.count = n; M.instanceMatrix.needsUpdate = true }')
puffs = s[s.index('    function puffs(t) {'):pf_end]
src = ribbon + fall + foam + sea + riv + puffs
sha = hashlib.sha256(src.encode()).hexdigest()[:12]
os.makedirs(G + '/src/data/looks', exist_ok=True)
json.dump(fluid, open(G + '/src/data/looks/kfb-fluid.r1.json', 'w'), ensure_ascii=False)
tpl = open(os.path.expanduser('~/kfb-ws1/probe/port/kfbWater.tpl.js')).read()
J = lambda t: t.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
out = (tpl.replace('/*@SHA@*/', sha).replace('/*@F_RIBBON@*/', J(f_rib)).replace('/*@F_FALL@*/', J(f_fall)).replace('/*@F_FOAM@*/', J(f_foam)).replace('/*@F_SEA@*/', J(f_sea)).replace('/*@V_SEA@*/', J(v_sea))
          .replace('/*@V_RIBBON@*/', J(v_rib)).replace('/*@V_FALL@*/', J(v_fall)).replace('/*@V_FOAM@*/', J(v_foam)).replace('/*@PUFFS@*/', puffs))
os.makedirs(G + '/src/look', exist_ok=True); open(G + '/src/look/kfbWater.js', 'w').write(out); print('ok', sha, len(out))
