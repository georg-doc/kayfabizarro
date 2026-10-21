// V-619 · Biom-Paletten auf dem terrain3-Gelände der endlosen Fahrt. Hängt sich NACH applyTerrain3 an dasselbe Material (onBeforeCompile verkettet).
// Je Eckpunkt sechs Biom-Gewichte (aBioA, aBioB aus biomeField). Je Bildpunkt: die zwei stärksten Biome (feste Reihenfolge nach Index, damit an der
// Grenze nichts kippt), Anteil w des zweiten. Welche Palette ein Bildpunkt bekommt, entscheidet das EINE Sprenkel-Modul (kfb-speckle-transition.v1,
// zweiseitige Ebene mit Formverzerrung, Look 'intent'): kein Verlauf, keine Linie (V-403, V-011). Die Fließfarben der Probe bleiben (gleiche Bänder),
// nur ihre Farben kommen aus der Palette des gewählten Bioms; Palettenschatten (V-564) ebenso je Biom.
// Paletten 1–5 aus kfb-terrain3.r1.json (erzeugt aus der Probe), Palette 6 Claybound-Canyon aus kfb-biome-drive.r1.json.
import * as THREE from 'three'
import T3 from '../data/looks/kfb-terrain3.r1.json' with { type: 'json' }
import BD from '../data/worlds/kfb-biome-drive.r1.json' with { type: 'json' }
import { generatePalette } from './paletteGen.js'
import { SPECKLE_GLSL_NOSIN, WARP_GLSL, WS1_SHAPE_GLSL, WS1_BI_GLSL, ws1LayerGLSL, speckleK, speckleBiK, zoneSeed } from '../vendor/speckle/kfb-speckle-transition.v1.js'

const ROLES = ['water', 'sand', 'low', 'mid', 'high', 'peak', 'cliff']
export const paletteOf = (key) => T3.palettes[key] || BD.palettes[key]
// Biom-Paletten: Standard prozedural (paletteGen, Georg 22.10.); Hash palgen=0 = die handgemachten Paletten, palseed=<Zahl> = andere Ausprägung.
// BIOME_PALETTES ist ein lebendes Feld (setBiomePalettes tauscht den Inhalt; Gelände, Bewuchs und Himmel lesen es)
const HASH = typeof location !== 'undefined' ? location.hash : ''
export const PALGEN = !/(^|[#,])palgen=0(,|$)/.test(HASH)
export const handPalettes = () => BD.order.map((b) => paletteOf(BD.biomes[b].palette))
export const genPalettes = (seed) => BD.order.map((b) => generatePalette({ ...BD.paletteGen.families[b], key: b }, seed))
export const PAL_STATE = { seed: +(/[#,]palseed=(\d+)/.exec(HASH)?.[1] ?? BD.paletteGen.seed), gen: PALGEN, listeners: new Set() }
export const BIOME_PALETTES = PALGEN ? genPalettes(PAL_STATE.seed) : handPalettes()
export function setBiomePalettes(seed) { PAL_STATE.seed = seed; PAL_STATE.gen = true; BIOME_PALETTES.splice(0, BIOME_PALETTES.length, ...genPalettes(seed)); for (const fn of PAL_STATE.listeners) fn(BIOME_PALETTES); return BIOME_PALETTES }
const shadowOf = (P) => new THREE.Color(P.cliff).lerp(new THREE.Color('#5a6f9a'), 0.45).multiplyScalar(0.7)

// opts: { cell_m = 3.4 (Grundzelle der großen Sprenkel, Übergänge 30–80 m), mix = 0.3 (Menge kleiner Tropfen), rim = 0.08 }
export function applyBiomeTerrain(mat, { cell_m = 3.4, mix = 0.3, rim = 0.08, seed = 'biome-drive' } = {}) {
  const pal = Array.from({ length: 48 }, () => new THREE.Color())
  const fill = (list) => { list.forEach((P, b) => { ROLES.forEach((r, i) => pal[b * 8 + i].set(P[r])); pal[b * 8 + 7].copy(shadowOf(P)) }) }   // 6 × 8 Farben
  fill(BIOME_PALETTES); PAL_STATE.listeners.add(fill)
  const z = zoneSeed(seed, cell_m)
  const U = { uBioPal: { value: pal }, uSpeckleK: { value: speckleK() }, uSpBiK: { value: speckleBiK() }, uSpMix: { value: mix }, uBioCell: { value: z.cell }, uBioOff: { value: new THREE.Vector2(z.off.x, z.off.z) }, uBioRim: { value: rim }, uWindFlow: { value: new THREE.Vector2() }, uWindFlowCalm: { value: new THREE.Vector2() }, uFlowCalm: { value: new THREE.Vector4(0, 0, 0, 0) } }
  const lib = SPECKLE_GLSL_NOSIN + WARP_GLSL + WS1_SHAPE_GLSL + WS1_BI_GLSL + ws1LayerGLSL('kfbBioLayer', true, true) + '\n'
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => {
    prev?.call(mat, sh, r)
    Object.assign(sh.uniforms, U)
    sh.vertexShader = 'attribute vec3 aBioA; attribute vec3 aBioB; varying vec3 vBioA; varying vec3 vBioB;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  vBioA = aBioA; vBioB = aBioB;')
    let f = sh.fragmentShader
    const uA = /uniform vec3 uA_water[^;]*;/, uB = /uniform vec3 uB_water[^;]*;/, tb = /float tb=uMix>0\.5 \?[^;]*;/
    if (!uA.test(f) || !uB.test(f) || !tb.test(f) || !f.includes('diffuseColor.rgb = flowBands(')) throw new Error('[biomeTerrain] terrain3-Shader nicht gefunden (applyTerrain3 zuerst)')
    f = f.replace(uA, (m) => m.replace('uniform ', '')).replace(uB, (m) => m.replace('uniform ', '')).replace(tb, 'float tb=gBioSel;')   // Palettenfarben je Bildpunkt statt Uniforms
    f = 'uniform vec3 uBioPal[48]; uniform float uBioCell, uBioRim; uniform vec2 uBioOff, uWindFlow, uWindFlowCalm; uniform vec4 uFlowCalm; varying vec3 vBioA; varying vec3 vBioB; float gBioSel = 0.0; vec3 gBioShadow = vec3(0.0); float gBioRim = 0.0;\n' + lib + f
    f = f.replace('  diffuseColor.rgb = flowBands(', `  { // V-619: zwei stärkste Biome (feste Reihenfolge), Anteil des zweiten → Sprenkel-Auswahl (kfb-speckle-transition.v1)
    float bw[6]; bw[0]=vBioA.x; bw[1]=vBioA.y; bw[2]=vBioA.z; bw[3]=vBioB.x; bw[4]=vBioB.y; bw[5]=vBioB.z;
    int i1 = 0; for (int k = 1; k < 6; k++) if (bw[k] > bw[i1]) i1 = k;
    int i2 = i1; float w2 = 0.0; for (int k = 0; k < 6; k++) if (k != i1 && bw[k] > w2) { w2 = bw[k]; i2 = k; }
    int iA = min(i1, i2), iB = max(i1, i2); float wB = w2 < 0.002 ? 0.0 : bw[iB] / max(bw[iA] + bw[iB], 1e-5); if (iA == iB) wB = 0.0;
    // Sprenkel nur im Übergangsband rechnen (mitten im Biom ist wB = 0 → Auswahl 0); fwidth der Bandkante vor der Verzweigung (Donor-Regel)
    float wEdge = fwidth(wB);
    if (wB > 0.0005 || wEdge > 0.0) { vec2 q = vT3W.xz + uBioOff; vec2 wq = kfbWarpV2(q, uBioCell) + kfbWs1Shape2(q, uBioCell);
      float rimB; gBioSel = kfbBioLayer(q + 31.7 + wq, uBioCell, wB, rimB); gBioRim = rimB; }
    int a = iA * 8, b = iB * 8;
    uA_water = uBioPal[a]; uA_sand = uBioPal[a+1]; uA_low = uBioPal[a+2]; uA_mid = uBioPal[a+3]; uA_high = uBioPal[a+4]; uA_peak = uBioPal[a+5]; uA_cliff = uBioPal[a+6];
    uB_water = uBioPal[b]; uB_sand = uBioPal[b+1]; uB_low = uBioPal[b+2]; uB_mid = uBioPal[b+3]; uB_high = uBioPal[b+4]; uB_peak = uBioPal[b+5]; uB_cliff = uBioPal[b+6];
    gBioShadow = mix(uBioPal[a+7], uBioPal[b+7], gBioSel); }
  diffuseColor.rgb = flowBands(`)
    // Farbfluss mit dem geteilten Wind (Georg 22.10.): ein Versatz (keine Scherung); nahe der Figur (uFlowCalm: Mitte, Radius) gedämpfter Bandkontrast
    const call = /diffuseColor\.rgb = flowBands\(vT3W\.xz \* uT3S, (clamp\(\(vT3W\.y - uT3H\.x\)[^;]*\))\);/
    if (!call.test(f)) throw new Error('[biomeTerrain] flowBands-Aufruf nicht gefunden')
    f = f.replace(call, (m, hn) => `{ float hnB = ${hn}; vec2 fpB = vT3W.xz;
    diffuseColor.rgb = flowBands((fpB - uWindFlow) * uT3S, hnB);
    // nahe der Figur ruhiger (Lead 22.10., Variante „Bandkontrast weicher“): gleiche Bänder, Kontrast zur Plattenmitte gedämpft, keine zweite Rechnung
    float calmK = uFlowCalm.w > 0.5 ? 1.0 - smoothstep(uFlowCalm.z, uFlowCalm.z * 2.3, length(fpB - uFlowCalm.xy)) : 0.0;
    diffuseColor.rgb = mix(diffuseColor.rgb, mix(uA_low, uA_mid, 0.5), calmK * 0.35); }
  diffuseColor.rgb *= 1.0 - uBioRim * gBioRim;`)
    f = f.replace('mix(diffuseColor.rgb * uT3Keep, uT3Shadow, uT3Mix)', 'mix(diffuseColor.rgb * uT3Keep, gBioShadow, uT3Mix)')
    sh.fragmentShader = f
  }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|biome-drive'
  mat.needsUpdate = true
  // Farbfluss mit Wind (Georg 22.10., V-605): die Fließfarben treiben mit dem geteilten Wind (Richtung, Stärke, Böen kurz schneller). k = Regler 0..1.
  const flow = { k: 0.35, speed: 2.4, calmK: 0, calmR: 12 }   // calmK 0: um die Figur das ruhende Muster (Lead 22.10.), gesprenkelt gewählt statt überblendet (V-403)
  return { uniforms: U, palettes: BIOME_PALETTES, flow, setMix(v) { U.uSpMix.value = v }, setCell(v) { U.uBioCell.value = v },
    windFlow(dt, dir, strength, gust01 = 0, focus = null) { const v = flow.speed * flow.k * strength * (1 + 0.8 * gust01), vc = flow.speed * flow.k * strength * flow.calmK
      U.uWindFlow.value.x += dir.x * v * dt; U.uWindFlow.value.y += dir.y * v * dt; U.uWindFlowCalm.value.x += dir.x * vc * dt; U.uWindFlowCalm.value.y += dir.y * vc * dt
      if (focus) U.uFlowCalm.value.set(focus.x, focus.z, flow.calmR, flow.k > 0.001 ? 1 : 0) } }
}
