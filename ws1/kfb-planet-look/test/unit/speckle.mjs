// Sprenkel-Modul kfb-speckle-transition.v1 (V-403) · Node-Einheitstest ohne Browser. Aufruf: node test/unit/speckle.mjs
// Prüft: GLSL-Blöcke byte-gleich mit dem Donor (Lab-Snapshot @64ae61fe7, gelesen über git aus dem lokalen Klon; fehlt der Klon → INFO, übersprungen),
// Kalibrier-Tabellen gleich dem Donor (live über Node-Typentfernung, sonst gegen den festgehaltenen Fingerabdruck), Gewichts-Bäcker (monoton, 0/1 an den
// Enden), Seeds (deterministisch, Nachbarzonen verschieden), patch()-Shadertext (Ebenen-Code drin, keine offenen Platzhalter, alle Uniforms/Funktionen
// deklariert, Klammern ausgeglichen), Cache-Key, setColors ohne Neu-Kompilieren, Verkettung, dispose, Presets, Bewuchs-Haken, Modulreinheit.
import fs from 'fs'
import os from 'os'
import path from 'path'
import crypto from 'crypto'
import { execFileSync } from 'child_process'
import { pathToFileURL } from 'url'
import * as THREE from 'three'
import { report } from './_report.mjs'
import * as SP from '../../src/vendor/speckle/kfb-speckle-transition.v1.js'

const MOD_PATH = 'src/vendor/speckle/kfb-speckle-transition.v1.js'
const MOD = fs.readFileSync(MOD_PATH, 'utf8')
const CLONE = process.env.KFB_CLONE || path.join(os.homedir(), 'kfb-ws1', 'kayfabizarro')
const DONOR_COMMIT = '64ae61fe781e79235790359449f2eee23ce201f9'
const DONOR_DIR = 'tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/src'
const DONOR = { speckle: `${DONOR_DIR}/clay/kfb-speckle.ts`, top: `${DONOR_DIR}/island/r2d/top-material.ts` }
const BLOBS = { speckle: 'ffac76a630d5f5011a34d6497ad80adfcc918a7d', top: '4003e9862c829c4e0e870e20f9d1ffd1b6a08ae6' } // = SOURCE.md
// Fingerabdruck (sha256 über JSON) der Donor-Tabellen, festgehalten am 17.10. aus dem Donor selbst (für Läufe ohne Klon)
const FP = { K: '5211d9388d6a7c17fa5d5c1c7da2a1a2f890a2fc8b266428c256909c21cf61b7', K3: '0be2194135375ed534ca1d8da78d2154a787cd9745b0209bbfa3bf7872718af2' }
const sha = (v) => crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex')
const info = []
const checks = {}
const extra = {}

// ── Donor über git lesen ──
const git = (args) => execFileSync('git', ['-C', CLONE, ...args], { encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] })
let donor = null
try {
  donor = { speckle: git(['show', `${DONOR_COMMIT}:${DONOR.speckle}`]), top: git(['show', `${DONOR_COMMIT}:${DONOR.top}`]),
    blobSpeckle: git(['rev-parse', `${DONOR_COMMIT}:${DONOR.speckle}`]).trim(), blobTop: git(['rev-parse', `${DONOR_COMMIT}:${DONOR.top}`]).trim() }
} catch { info.push(`INFO Donor-Klon nicht lesbar (${CLONE}): Byte-Gleichheit und Live-Vergleich übersprungen`) }

// Template-Literal bzw. String-Konstante aus Quelltext ziehen
const tpl = (src, name) => { const m = new RegExp(`const ${name} = (?:/\\* glsl \\*/ )?\`([\\s\\S]*?)\\n\`;`).exec(src); return m ? m[1] : null }
const line = (src, re) => { const m = re.exec(src); return m ? m[0] : null }
if (donor) {
  checks.donorBlobsAsRecorded = donor.blobSpeckle === BLOBS.speckle && donor.blobTop === BLOBS.top
  const pairs = {
    KFB_SPECKLE_GLSL: [tpl(donor.speckle, 'KFB_SPECKLE_GLSL'), tpl(MOD, 'KFB_SPECKLE_GLSL')],
    WARP_GLSL: [tpl(donor.top, 'WARP_GLSL'), tpl(MOD, 'WARP_GLSL')],
    SPECKLE3_GLSL: [tpl(donor.top, 'SPECKLE3_GLSL'), tpl(MOD, 'SPECKLE3_GLSL')],
    HOSKINS_H3: [line(donor.top, /^const HOSKINS_H3 = '[^\n]*';$/m), line(MOD, /^const HOSKINS_H3 = '[^\n]*';$/m)],
    SPECKLE_GLSL_NOSIN: [line(donor.top, /^export const SPECKLE_GLSL_NOSIN = [^\n]*\n[^\n]*$/m), line(MOD, /^export const SPECKLE_GLSL_NOSIN = [^\n]*\n[^\n]*$/m)],
  }
  const res = {}
  for (const [k, [a, b]] of Object.entries(pairs)) res[k] = !!a && a === b
  extra.byteIdentical = res
  checks.glslByteIdentical = Object.values(res).every(Boolean)
  // Ebenen-Generator ohne Erweiterung = Donor-kfbSpeckleLayer wörtlich
  const fnDonor = /float kfbSpeckleLayer\(vec2 p[\s\S]*?return sel; \}/.exec(donor.speckle)?.[0]
  checks.layerGeneratorEqualsDonor = !!fnDonor && SP.ws1LayerGLSL('kfbSpeckleLayer', false, true) === fnDonor
}

// ── Donor als Modul laden (Node entfernt TypeScript-Typen), Laufzeitwerte vergleichen ──
let D = null, DS = null
if (donor) {
  try {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kfb-speckle-donor-'))
    const threeUrl = import.meta.resolve('three')
    fs.writeFileSync(path.join(dir, 'kfb-speckle.ts'), donor.speckle)
    fs.writeFileSync(path.join(dir, 'top-material.ts'), donor.top.replace("from '../../clay/kfb-speckle'", "from './kfb-speckle.ts'").replace("from 'three'", `from '${threeUrl}'`))
    D = await import(pathToFileURL(path.join(dir, 'top-material.ts')).href)
    DS = await import(pathToFileURL(path.join(dir, 'kfb-speckle.ts')).href)
    fs.rmSync(dir, { recursive: true, force: true })
  } catch (e) { info.push('INFO Donor-Modul nicht ladbar (Node-Typentfernung?): ' + e.message.slice(0, 120)) }
}
const K = SP.speckleThresholds(), K3 = SP.speckleK3()
checks.thresholdTableShape = K.length === 64 && K3.length === 64 && K.every((v, i) => i === 0 || v <= K[i - 1]) && K3.every((v, i) => i === 0 || v <= K3[i - 1])
if (D && DS) {
  checks.thresholdsEqualDonor = JSON.stringify(K) === JSON.stringify(DS.speckleThresholds()) && JSON.stringify(SP.speckleK()) === JSON.stringify(D.speckleK())
  checks.thresholds3EqualDonor = JSON.stringify(K3) === JSON.stringify(D.speckleK3())
  checks.glslRuntimeEqualDonor = SP.KFB_SPECKLE_GLSL === DS.KFB_SPECKLE_GLSL && SP.SPECKLE_GLSL_NOSIN === D.SPECKLE_GLSL_NOSIN && SP.WARP_GLSL === D.WARP_GLSL && SP.SPECKLE3_GLSL === D.SPECKLE3_GLSL
  checks.speckleSeedEqualDonor = [0, 1, 7, 42, 30315, 99999].every((s) => { const a = SP.speckleSeed(s), b = D.speckleSeed(s); return a.off.equals(b.off) && a.cell === b.cell })
  extra.fingerprint = { K: sha(DS.speckleThresholds()), K3: sha(D.speckleK3()) }
}
extra.tableFingerprint = { K: sha(K), K3: sha(K3) }
checks.thresholdFingerprint = sha(K) === FP.K && sha(K3) === FP.K3

// ── zweiseitige Tabelle (WS1-Erweiterung): monoton, punktsymmetrisch, Deckung = w ──
const KB = SP.speckleBiK()
checks.biTableMonotonic = KB.length === 64 && KB.every((v, i) => i === 0 || v <= KB[i - 1])
// Enden (w = 0 / 1) sind Stichproben-Extreme (Donor-Kommentar zu speckleK3), dort nur grob
checks.biTableAntisymmetric = KB.every((v, i) => Math.abs(v + KB[63 - i]) < (i === 0 || i === 63 ? 0.1 : 0.04))
{ // Deckung an frischen Stichproben (andere Orte als die Kalibrierung), JS-Zwilling des Feldes über die Donor-Tabelle geprüft
  const fr = (v) => v - Math.floor(v), N = 12000, cov = { s1: [], bi: [] }
  const field = (x, y, s) => { // = Donor-diskField (JS-Zwilling, sin-Hash)
    const h3 = (a, b) => [fr(Math.sin(a * 127.1 + b * 311.7) * 43758.5453), fr(Math.sin(a * 269.5 + b * 183.3) * 43758.5453), fr(Math.sin(a * 419.2 + b * 371.9) * 43758.5453)]
    x += 0.18 * Math.sin(y * 1.7 + s); y += 0.18 * Math.cos(x * 1.9 + s); const bx = Math.floor(x), by = Math.floor(y); let F = -1e9
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const cx = bx + i, cy = by + j, h = h3(cx + s, cy + s), h2 = h3(cx + s + 7.3, cy + s + 7.3); F = Math.max(F, (0.45 + 0.55 * h2[0]) * (1 - Math.hypot(x - (cx + 0.15 + 0.7 * h[0]), y - (cy + 0.15 + 0.7 * h[1])) / (0.28 + 0.32 * h[2]))) }
    return F
  }
  const P = [...Array(N).keys()].map((n) => [fr(Math.sin(n * 3.17 + 1.3) * 9134.7) * 211 + 300, fr(Math.sin(n * 5.71 + 2.9) * 7319.3) * 211 + 300])
  const F = P.map(([x, y]) => field(x, y, 17)), G = P.map(([x, y]) => field(x + 71.3, y + 71.3, 23))
  for (const w of [0.1, 0.25, 0.5, 0.75, 0.9]) {
    const t = w * 63, i = Math.floor(t), j = Math.min(i + 1, 63), k = K[i] + (K[j] - K[i]) * (t - i), kb = KB[i] + (KB[j] - KB[i]) * (t - i)
    cov.s1.push(+(F.filter((f) => f > k).length / N).toFixed(3)); cov.bi.push(+(F.filter((f, n) => f - G[n] > kb).length / N).toFixed(3))
  }
  extra.coverage = cov
  checks.coverageEqualsW = [0.1, 0.25, 0.5, 0.75, 0.9].every((w, n) => Math.abs(cov.s1[n] - w) < 0.03 && Math.abs(cov.bi[n] - w) < 0.03)
}

// ── Seeds ──
{
  const a = SP.zoneSeed(7), b = SP.zoneSeed(7), c = SP.zoneSeed('amphitheater'), d = SP.zoneSeed('zone-a')
  checks.seedDeterministic = a.off.equals(b.off) && a.cell === b.cell && a.angle === b.angle && SP.seedOf('amphitheater') === SP.seedOf('amphitheater')
  checks.zoneSeedsDiffer = !c.off.equals(d.off) && c.cell !== d.cell && c.seed !== d.seed
  // Zelle ±11 % um cell_m (Donor 0,9 … 1,12), alle Paare aus 1…200 sichtbar verschieden (Versatz > 1 Zelle oder Zelle > 1 % anders)
  const Z = [...Array(200).keys()].map((i) => SP.zoneSeed(i + 1))
  checks.zoneCellWithin11pct = Z.every((z) => z.cell >= 0.9 * SP.CELL_M - 1e-9 && z.cell <= 1.12 * SP.CELL_M + 1e-9)
  let minSep = Infinity
  for (let i = 0; i < Z.length; i++) for (let j = i + 1; j < Z.length; j++) {
    const off = Math.max(Math.abs(Z[i].off.x - Z[j].off.x), Math.abs(Z[i].off.z - Z[j].off.z)) / Z[i].cell, dc = Math.abs(Z[i].cell / Z[j].cell - 1) * 100
    minSep = Math.min(minSep, Math.max(off, dc))
  }
  extra.minZoneSeparation = +minSep.toFixed(3)
  checks.neighbourPatternsDiffer = minSep > 1
  const s1 = SP.createSpeckle({ seed: 'amphitheater' }), s2 = SP.createSpeckle({ seed: 'amphitheater' })
  checks.instanceDeterministic = s1.zone.off.equals(s2.zone.off) && s1.zone.cell === s2.zone.cell
}

// ── Gewichts-Bäcker ──
const strip = (n = 200, L = 40) => { const g = new THREE.PlaneGeometry(L, 2, n, 1); g.rotateX(-Math.PI / 2); g.translate(L / 2 - 4, 0, 0); return g } // x von −4 bis 36
const alongX = (g, w) => { const P = g.getAttribute('position'), r = []; for (let i = 0; i < P.count; i++) if (Math.abs(P.getZ(i) - 1) < 1e-6) r.push([P.getX(i), w[i]]); return r.sort((a, b) => a[0] - b[0]) }
const mono = (r, dir) => r.every(([, w], i) => i === 0 || (dir < 0 ? w <= r[i - 1][1] + 1e-7 : w >= r[i - 1][1] - 1e-7))
{
  const g = strip(), w = SP.weights.band(g, (x) => x, { inner: 2, outer: 10, wobble: false }), r = alongX(g, w)
  checks.bandMonotonic = mono(r, -1)
  checks.bandEnds01 = r.filter(([x]) => x <= 2).every(([, v]) => v === 1) && r.filter(([x]) => x >= 10).every(([, v]) => v === 0)
  const A = g.getAttribute('aSW')
  checks.bandWritesAttribute = !!A && A.itemSize === 3 && A.array[0] === w[0] && A.array[1] === 0
  const w2 = SP.weights.band(g, (x) => x, { inner: 2, outer: 10, channel: 1, seed: 5 }), r2 = alongX(g, w2)
  checks.bandWobbleInRange = w2.every((v) => v >= 0 && v <= 1) && r2.filter(([x]) => x <= 2).every(([, v]) => v === 1) && r2.filter(([x]) => x >= 11.6).every(([, v]) => v === 0) && A.array[0] === w[0]
  checks.bandWobbleMoves = r2.some(([x, v], i) => Math.abs(v - r[i][1]) > 0.01)
}
{
  const g = strip(240, 48); g.translate(-20, 0, 0) // x von −24 bis 24
  const w = SP.weights.zone(g, (x) => (x < 0 ? 'A' : 'B'), 'B', { band_m: 8, wobble: false, attr: 'aZW', itemSize: 1 }), r = alongX(g, w)
  checks.zoneMonotonic = mono(r, +1)
  checks.zoneEnds01 = r.filter(([x]) => x <= -4).every(([, v]) => v === 0) && r.filter(([x]) => x >= 4).every(([, v]) => v === 1) && Math.abs(r.find(([x]) => Math.abs(x) < 0.11)[1] - 0.5) < 0.1
}
{
  const g = new THREE.PlaneGeometry(2, 10, 1, 100); g.translate(0, -5, 0) // y von 0 (Kante) bis −10
  const w = SP.weights.depthBelowRim(g, { solid_m: 1.75, band_m: 3.8, wobble: false, attr: 'aGW', itemSize: 1 })
  const P = g.getAttribute('position'), r = []; for (let i = 0; i < P.count; i++) if (P.getX(i) > 0) r.push([-P.getY(i), w[i]]); r.sort((a, b) => a[0] - b[0])
  checks.depthMonotonic = mono(r, -1)
  checks.depthEnds01 = r.filter(([d]) => d <= 1.75).every(([, v]) => v === 1) && r.filter(([d]) => d >= 5.55).every(([, v]) => v === 0)
}

// ── patch(): Shadertext ──
const fakeShader = () => ({ vertexShader: THREE.ShaderLib.standard.vertexShader, fragmentShader: THREE.ShaderLib.physical.fragmentShader, uniforms: THREE.UniformsUtils.clone(THREE.ShaderLib.physical.uniforms) })
const expand = (s, depth = 0) => (depth > 6 ? s : s.replace(/^[ \t]*#include <(\w+)>/gm, (_, n) => expand(THREE.ShaderChunk[n] ?? `#error missing ${n}`, depth + 1)))
const noComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
const balanced = (s) => { const t = noComments(s); let a = 0, b = 0; for (const ch of t) { if (ch === '{') a++; if (ch === '}') a--; if (ch === '(') b++; if (ch === ')') b--; if (a < 0 || b < 0) return false } return a === 0 && b === 0 }
function shaderCheck(sh, mustHave) {
  const v = sh.vertexShader, f = sh.fragmentShader, vf = expand(v), ff = expand(f), all = v + f
  const declaredU = new Set([...(vf + ff).matchAll(/uniform\s+\w+\s+([^;]+);/g)].flatMap((m) => m[1].split(',').map((x) => x.trim().replace(/\[.*$/, ''))))
  const usedSp = new Set([...all.matchAll(/\b(uSp\w*|uSpeckle\w*)\b/g)].map((m) => m[1]))
  const defined = new Set([...ff.matchAll(/\b(?:float|vec2|vec3|vec4|void)\s+(kfb\w+)\s*\(/g)].map((m) => m[1]))
  const called = new Set([...noComments(ff).matchAll(/\b(kfb\w+)\s*\(/g)].map((m) => m[1]))
  const ifs = (vf.match(/^\s*#if/gm) || []).length, ends = (vf.match(/^\s*#endif/gm) || []).length, ifsF = (ff.match(/^\s*#if/gm) || []).length, endsF = (ff.match(/^\s*#endif/gm) || []).length
  const r = {
    hasLayerCode: mustHave.every((s) => f.includes(s) || v.includes(s)),
    noPlaceholders: !/\$\{|undefined|NaN|\[object/.test(noComments(v + f)) && !/#error/.test(vf + ff),
    uniformsDeclared: [...usedSp].every((u) => declaredU.has(u)),
    uniformsProvided: [...usedSp].every((u) => u in sh.uniforms),
    functionsDefined: [...called].every((c) => defined.has(c)),
    noDuplicateFunctions: [...ff.matchAll(/\b(?:float|vec2|vec3|vec4)\s+(kfb\w+)\s*\(/g)].length === defined.size,
    balanced: balanced(v) && balanced(f), // ungekürzt: three-Chunks haben #if-Zweige mit je eigener Klammer
    preprocessorBalanced: ifs === ends && ifsF === endsF,
    hookAfterColorFragment: /#include <color_fragment>\n\{ \/\/ kfb\.speckle-transition\/1/.test(f),
    hookAfterBeginVertex: /#include <begin_vertex>\n\{ vec4 kfbSpP/.test(v),
  }
  return r
}
{
  const sp = SP.createSpeckle({ seed: 'amphitheater' }), m = new THREE.MeshStandardMaterial({ color: '#8a6' })
  const h = sp.patch(m, { layers: [
    { weight: 'aSW.x', color: '#c9a36b', name: 'ring' },
    { weight: 'aSW.y', color: '#9c7a4f', micro: false, cellScale: 0.8, rim: 0.12 },
    { weight: 'aGW', color: '#6f8a3a', space: 'world-3d', cellScale: 1.3 },
  ] })
  const sh = fakeShader(); m.onBeforeCompile(sh, null)
  const r = shaderCheck(sh, ['kfbWs1LayerBM(', 'kfbWs1LayerBN(', 'kfbSpeckleLayer3(', 'kfbWs1SpeckleBi(', 'kfbWs1Shape2(', 'kfbWs1Shape3(', 'vSpW.x', 'vSpW.y', 'vSpW.z', 'attribute vec4 aSW;', 'attribute float aGW;', 'vSpW = vec3(aSW.x, aSW.y, aGW);'])
  extra.shaderIntent = r
  checks.patchShaderIntent = Object.values(r).every(Boolean)
  checks.patchNotes3d = h.notes.length === 1 && /TODO/.test(h.notes[0]) && h.layers[2].bidir === false && h.layers[0].fn === 'kfbWs1LayerBM' && h.layers[1].fn === 'kfbWs1LayerBN'
  const key1 = m.customProgramCacheKey(), ver = m.version
  h.setColors({ ring: '#ff0000', 2: new THREE.Color('#00ff00') }); sp.setColors(['#0000ff'])
  checks.setColorsNoRecompile = m.customProgramCacheKey() === key1 && m.version === ver && sh.uniforms.uSpC0.value.equals(new THREE.Color('#0000ff')) && sh.uniforms.uSpC2.value.equals(new THREE.Color('#00ff00')) && sh.uniforms.uSpC1.value.equals(new THREE.Color('#9c7a4f'))
  // gleicher Ebenen-Satz → gleicher Key, anderer Satz → anderer Key
  const m2 = new THREE.MeshStandardMaterial(), m3 = new THREE.MeshStandardMaterial()
  sp.patch(m2, { layers: [{ weight: 'aSW.x', color: '#123456', name: 'ring' }, { weight: 'aSW.y', color: '#000', micro: false, cellScale: 0.8, rim: 0.12 }, { weight: 'aGW', color: '#fff', space: 'world-3d' }] })
  sp.patch(m3, { layers: [{ weight: 'aSW.x', color: '#123456' }] })
  checks.cacheKeyPerLayerSet = m2.customProgramCacheKey() === key1 && m3.customProgramCacheKey() !== key1 && key1.includes('kfb-speckle-v1|')
  // Look s1 = Donor-Ebenen ohne WS1-Erweiterung
  const s1 = SP.createSpeckle({ seed: 3, look: 's1' }), m4 = new THREE.MeshStandardMaterial(), sh4 = fakeShader()
  s1.patch(m4, { layers: [{ weight: 'aSW.x', color: '#c9a36b' }] }); m4.onBeforeCompile(sh4, null)
  const r4 = shaderCheck(sh4, ['kfbSpeckleLayer(kfbSpQ'])
  checks.patchShaderS1 = Object.values(r4).every(Boolean) && !/kfbWs1/.test(sh4.fragmentShader) && !('uSpBiK' in sh4.uniforms)
  // built: eine Ebene ohne Mikro-Punkte, Zelle 1,7
  const sb = SP.createSpeckle({ seed: 9, preset: 'built' }), m5 = new THREE.MeshStandardMaterial(), sh5 = fakeShader()
  const h5 = sb.patch(m5, { layers: [{ weight: 'aBW', color: '#777' }] }); m5.onBeforeCompile(sh5, null)
  checks.patchShaderBuilt = Object.values(shaderCheck(sh5, ['kfbWs1LayerSN('])).every(Boolean) && h5.layers[0].micro === false && Math.abs(sb.zone.cell / 1.7 - 1) <= 0.121
  // Verkettung: vorhandenes onBeforeCompile läuft zuerst, beide Änderungen bleiben; dispose stellt zurück
  const m6 = new THREE.MeshStandardMaterial(); let ran = 0
  m6.onBeforeCompile = (s) => { ran++; s.fragmentShader = '// vorher\n' + s.fragmentShader }
  const prev = m6.onBeforeCompile
  const h6 = sp.patch(m6, { layers: [{ weight: 0.5, color: '#abc' }] }); const sh6 = fakeShader(); m6.onBeforeCompile(sh6, null)
  checks.chainsExistingHook = ran === 1 && sh6.fragmentShader.includes('// vorher') && sh6.fragmentShader.includes('kfb.speckle-transition/1') && /vSpW = vec3\(0\.500000, 0\.0, 0\.0\)/.test(sh6.vertexShader)
  h6.dispose()
  checks.disposeRestores = m6.onBeforeCompile === prev && m6.customProgramCacheKey === THREE.Material.prototype.customProgramCacheKey && !m6.userData.kfbSpeckle && !sp.handles.includes(h6)
  sp.dispose()
  checks.disposeAll = sp.handles.length === 0 && m.onBeforeCompile === THREE.Material.prototype.onBeforeCompile && !m.userData.kfbSpeckle
  // Grenzen: höchstens 3 Ebenen, kein Doppel-Patch, gültige Gewichtsnamen
  const thr = (fn) => { try { fn(); return false } catch { return true } }
  const sx = SP.createSpeckle({ seed: 1 }), mx = new THREE.MeshStandardMaterial()
  checks.rejectsBadInput = thr(() => sx.patch(new THREE.MeshStandardMaterial(), { layers: [1, 2, 3, 4].map(() => ({ weight: 'aSW.x' })) }))
    && thr(() => sx.patch(new THREE.MeshStandardMaterial(), { layers: [{ weight: 'aSW.x; discard' }] }))
    && (sx.patch(mx, { layers: [{ weight: 'aW' }] }), thr(() => sx.patch(mx, { layers: [{ weight: 'aW' }] })))
    && thr(() => SP.createSpeckle({ space: 'track-su' }))
  // Knet-Material (clay-material.v8) zuerst, Sprenkel danach: beide Hooks im Shader
  try {
    const C = await import('../../src/vendor/clay/clay-material.v8.js')
    const U = C.makeClayUniforms(THREE), mc = C.makeClayMaterial(THREE, U, { color: '#a87', role: 'world' }), shc = fakeShader()
    SP.createSpeckle({ seed: 'amphitheater', preset: 'diorama-ground' }).patch(mc, { layers: [{ weight: 'aSW.x', color: '#c9a36b' }] }); mc.onBeforeCompile(shc, null)
    const rc = shaderCheck(shc, ['vClayP = position', 'kfb.speckle-transition/1'])
    extra.shaderClay = rc
    checks.patchOverClayMaterial = Object.values(rc).every(Boolean) && mc.customProgramCacheKey().startsWith('kfb-clay-v8|kfb-speckle-v1|')
  } catch (e) { info.push('INFO clay-material.v8 in Node nicht prüfbar: ' + e.message.slice(0, 100)) }
}

// ── Presets ──
{
  const P = SP.PRESETS, need = ['track↔ground', 'diorama↔ground', 'biome↔biome', 'rim/scholle', 'built']
  checks.presetsComplete = need.every((k) => P[k]) && need.every((k) => SP.presetOf(P[k].alias) === P[k])
  const d = P['diorama↔ground'], b = P['biome↔biome'], t = P['track↔ground']
  checks.presetBands = Math.abs(t.band.outer - t.band.inner - 2.8) < 1e-9 && d.band.outer - d.band.inner >= 3 && d.band.outer - d.band.inner <= 8 && b.zone.band_m >= 6 && b.zone.band_m <= 12 && P['rim/scholle'].space === 'world-3d' && P.built.cell_m === 1.7 && t.cell_m === 1.1
  const sp = SP.createSpeckle({ seed: 'amphitheater', preset: 'diorama↔ground' }), g = strip()
  const w = sp.bake(g, (x) => Math.max(0, x)), r = alongX(g, w)
  checks.presetBake = r.filter(([x]) => x <= 0.5).every(([, v]) => v === 1) && r.filter(([x]) => x >= 7.5).every(([, v]) => v === 0)
}

// ── Bewuchs-Haken ──
{
  const V = SP.vegetation, ws = [...Array(21).keys()].map((i) => i / 20), ds = ws.map((w) => V.density(w))
  checks.vegetationDensity = ds[0] === 1 && ds[20] === 0 && ds.every((d, i) => i === 0 || d <= ds[i - 1])
  const p = { count: 9, big: 0.4, reach: 2 }, n0 = V.nestParams(p, 0), n5 = V.nestParams(p, 0.5), n1 = V.nestParams(p, 0.97)
  checks.vegetationNest = n0.count === 9 && n0.big === 0.4 && n5.count < 9 && n5.big < 0.4 && n1 === null
  const rng = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const bits = [...Array(40).keys()].map((i) => ({ x: i * 0.25, z: 0, size: 0.3, rot: 0 })), wAt = (x) => Math.min(1, x / 10)
  const t1 = V.thin(bits, wAt, rng(7)), t2 = V.thin(bits, wAt, rng(7))
  checks.vegetationThinDeterministic = JSON.stringify(t1) === JSON.stringify(t2) && t1.length < bits.length && t1.length > 0 && t1.every((b) => b.size <= 0.3)
}

// ── Modulreinheit ──
{
  const imports = [...MOD.matchAll(/^import .* from ['"]([^'"]+)['"]/gm)].map((m) => m[1])
  checks.moduleImportsOnlyThree = imports.length === 1 && imports[0] === 'three'
  checks.moduleNoReactStoreWindow = !/react|useGame|window\.|document\.|addEventListener|location\./.test(MOD.replace(/^\/\/.*$/gm, ''))
  checks.schema = SP.SCHEMA === 'kfb.speckle-transition/1' && SP.MODULE === 'kfb-speckle-transition.v1'
}

for (const l of info) console.log(l)
process.exit(report('speckle', checks, extra))
