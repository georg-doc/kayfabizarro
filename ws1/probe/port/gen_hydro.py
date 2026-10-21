# Erzeugt kfb-hydro.v1.js (reiner Rechenteil der Flüsse/Seen/Fälle) aus gelaende-probe.html zwischen HYDRO_BEGIN und HYDRO_END – kein Abschreiben.
# Ziel: probe/port/kfb-hydro.v1.js; mit Argument <spiel-repo> zusätzlich nach <spiel-repo>/src/world/kfb-hydro.v1.js
import os, sys, re, hashlib
P = os.path.expanduser('~/kfb-ws1/probe/gelaende-probe.html'); s = open(P).read()
a = s.index('/* HYDRO_BEGIN'); a = s.index('\n', a) + 1; b = s.index('      /* HYDRO_END */')
body = s[a:b]
RV = "(typeof window !== 'undefined' && window.__RIVA)"
assert body.count(RV) == 1, 'RIVA-Stelle in der Probe verändert'
body = body.replace(RV, 'riverArea')   # Probe-Testschalter → env.riverArea (kein window im Spielmodul)
m = re.search(r"const ss = \(a, b, x\) => \{[^\n]*?\};", s) or re.search(r"const ss = \(a, b, x\) => [^\n]*", s)
ssdef = m.group(0).split('   /*')[0]
if not ssdef.rstrip().endswith((';', '}')): ssdef = ssdef.rstrip()
sha = hashlib.sha256(body.encode()).hexdigest()[:12]
out = f"""// kfb-hydro.v1 · Flüsse, Bergseen, Wasserfälle (Netz zuerst) · ERZEUGT von probe/port/gen_hydro.py aus probe/gelaende-probe.html (HYDRO_BEGIN…END, sha {sha}).
// Nicht von Hand ändern: Quelle ist die Gelände-Probe. Rein (ohne three.js): Eingang = Höhenraster + Höhenfunktion, Ausgang = Läufe, Seen, Fälle,
// Talprofil-Feld (512² · R = Sohle·Gewicht, G = Gewicht, B = Maske, A = Pegel) und Mesh-Arrays für Wasserband, Seen, Fall und Gischt.
// env: {{ H (Float32Array HN², Grundhöhe ohne Rinnen), HN, HG (m), ox, oz (Rasterursprung), cx, cz (Feldmitte), wl (Meeresspiegel), hgt(x,z) (Grundhöhe fein),
//        N = 512, size = 1024 (Feld), over() (true = Bild-Budget aufgebraucht → yield), riverArea (m², optional) }}
export function* hydroGen(env) {{
  const {{ H, HN, HG, ox, oz, cx, cz, wl, hgt, N = 512, size = 1024, over = () => false, riverArea }} = env
  const RIV = {{ size, on: false, data: {{ length: N * N * 4 }} }}, ROX = cx - size / 2, ROZ = cz - size / 2, BG = {{ over }}, ST = {{}}
  {ssdef}
{body}
  return {{ lines: live, lakes, falls, field: {{ data: D, N, size, ox: ROX, oz: ROZ }}, ribbon: {{ pos, fl, sn, lvA, idx }}, fallMesh: FA, stats: ST }}
}}
export function hydro(env) {{ const g = hydroGen(env); let r; do {{ r = g.next() }} while (!r.done); return r.value }}
// Feld lesen wie rivSampleJS der Probe (quadratischer B-Spline über 3×3 Texel) → [R, G] oder null
export function sampleField(f, px, pz) {{
  const N = f.N, tx = (px - f.ox) / f.size * N - 0.5, tz = (pz - f.oz) / f.size * N - 0.5, cx = Math.floor(tx + 0.5), cz = Math.floor(tz + 0.5)
  if (cx < 1 || cz < 1 || cx > N - 2 || cz > N - 2) return null; const D = f.data; if (D[(cz * N + cx) * 4 + 2] < 1e-4) return null
  const fx = tx - cx, fz = tz - cz, wx = [0.5 * (0.5 - fx) ** 2, 0.75 - fx * fx, 0.5 * (0.5 + fx) ** 2], wz = [0.5 * (0.5 - fz) ** 2, 0.75 - fz * fz, 0.5 * (0.5 + fz) ** 2]; let r = 0, g = 0
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) {{ const k = ((cz + j - 1) * N + cx + i - 1) * 4, w = wx[i] * wz[j]; r += w * D[k]; g += w * D[k + 1] }} return [r, g]
}}
// Talprofil auf eine Grundhöhe anwenden (= rivModJS: Profil ersetzt das Gelände)
export function carve(f, px, pz, h) {{ const v = sampleField(f, px, pz); if (!v || v[1] < 1e-4) return h; return h * (1 - v[1]) + v[0] }}
export const HYDRO_SOURCE_SHA = '{sha}'
"""
open(os.path.expanduser('~/kfb-ws1/probe/port/kfb-hydro.v1.js'), 'w').write(out)
if len(sys.argv) > 1:
    d = os.path.join(sys.argv[1], 'src/world'); os.makedirs(d, exist_ok=True); open(os.path.join(d, 'kfb-hydro.v1.js'), 'w').write(out)
print('ok', sha, len(out))
