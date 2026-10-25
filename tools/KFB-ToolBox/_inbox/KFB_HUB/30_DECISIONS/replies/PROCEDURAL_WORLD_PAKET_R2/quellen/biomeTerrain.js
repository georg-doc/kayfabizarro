// V-619 · Biom-Paletten auf dem terrain3-Gelände der endlosen Fahrt. Hängt sich NACH applyTerrain3 an dasselbe Material (onBeforeCompile verkettet).
// Je Eckpunkt sechs Biom-Gewichte (aBioA, aBioB aus biomeField). Je Bildpunkt: die zwei stärksten Biome (feste Reihenfolge nach Index, damit an der
// Grenze nichts kippt), Anteil w des zweiten. Welche Palette ein Bildpunkt bekommt, entscheidet das EINE Sprenkel-Modul (kfb-speckle-transition.v1,
// zweiseitige Ebene mit Formverzerrung, Look 'intent'): kein Verlauf, keine Linie (V-403, V-011). Die Fließfarben der Probe bleiben (gleiche Bänder),
// nur ihre Farben kommen aus der Palette des gewählten Bioms; Palettenschatten (V-564) ebenso je Biom.
// Paletten 1–5 aus kfb-terrain3.r1.json (erzeugt aus der Probe), Palette 6 Claybound-Canyon aus kfb-biome-drive.r1.json.
import * as THREE from 'three'
import T3 from '../data/looks/kfb-terrain3.r1.json' with { type: 'json' }
import BD from '../data/worlds/kfb-biome-drive.r1.json' with { type: 'json' }
import IP from '../data/looks/kfb-island-palettes.r1.json' with { type: 'json' }
import { fromHue as cartoonFromHue, mulberry32 as mulberry } from '../vendor/palette/kfb-cartoon-palette.js'
import { generatePalette } from './paletteGen.js'
import { ZONE, ZONE_GLSL } from '../world/zoneField.js'
import { SPECKLE_GLSL_NOSIN, WARP_GLSL, WS1_SHAPE_GLSL, WS1_BI_GLSL, ws1LayerGLSL, speckleK, speckleBiK, zoneSeed } from '../vendor/speckle/kfb-speckle-transition.v1.js'

const ROLES = ['water', 'sand', 'low', 'mid', 'high', 'peak', 'cliff']
export const paletteOf = (key) => T3.palettes[key] || BD.palettes[key]
// Biom-Paletten: Standard prozedural (paletteGen, Georg 22.10.); Hash palgen=0 = die handgemachten Paletten, palseed=<Zahl> = andere Ausprägung.
// BIOME_PALETTES ist ein lebendes Feld (setBiomePalettes tauscht den Inhalt; Gelände, Bewuchs und Himmel lesen es)
const HASH = typeof location !== 'undefined' ? location.hash : ''
// Ruhefläche (V-788) ist zurückgenommen (Georg q210: Farbbänder fast weg): Standard sind wieder die vollen Fließfarben;
// Hash ground=tone[:k] zeigt die Tonstufen-Variante zum Vergleich
const GT = /(^|[#,])ground=tone(?::([\d.]+))?(,|$)/.exec(HASH)
export const GROUND_TONE = GT ? (GT[2] != null ? +GT[2] : 0.2) : 0   // Georg q210 (25.10.): Fließbänder zurück als Standard, ground=tone nur noch als Vergleich
const MASS_ZONES = /(^|[#,])veg=mass(,|$)/.test(HASH)   // V-797 Stilbild: Waldboden als Materialzone unter den Waldmassen
const BIO_SPECKLE = /(^|[#,])biot=speckle(,|$)/.test(HASH)   // Georg q220: Biom-Übergang über die Fließbänder (ganze Bänder wechseln die Palette); biot=speckle = altes Sprenkel-Modul
export const PALGEN = !/(^|[#,])palgen=0(,|$)/.test(HASH)
export const handPalettes = () => BD.order.map((b) => paletteOf(BD.biomes[b].palette))
export const genPalettes = (seed) => BD.order.map((b) => generatePalette({ ...BD.paletteGen.families[b], key: b }, seed))
export const PAL_STATE = { seed: +(/[#,]palseed=(\d+)/.exec(HASH)?.[1] ?? BD.paletteGen.seed), gen: PALGEN, listeners: new Set() }
// V-800 · Cartoon-Paletten je Biom aus dem eingelockten V-305-Generator (kfb-cartoon-palette.js, abgeleitet aus Joyride/Bucht, Canyon, O-Town):
// je Biom eine zufällige, harmonische, bunte Palette (random(seed)), sechs Leitfarben (Boden, Strang, Wahrzeichen, Laub, Himmel, Rinde) plus Leitern.
// Standard. Hash pal=gen = alte paletteGen-Platten, pal=island = die acht Insel-Paletten, palgen=0 = Handpaletten.
export const ISLAND_PAL = /(^|[#,])pal=island(,|$)/.test(HASH)
export const HARMONY_PAL = !ISLAND_PAL && !/(^|[#,])pal=gen(,|$)/.test(HASH) && PALGEN
// Anmutung wie die drei Golden Samples (Georg q219): Boden-Farbton aus den Familien der Golden Samples (Canyon 299°, O-Town 182°, Bucht 88°) und ihren
// Nachbarn (Taubenblau 240°, Bonbon 330°, Mint 150°), je Welt-Seed gewürfelt ±14°; Gelände nur aus Boden/Hügel-Leiter wie in J17 (keine Creme-Bänder),
// Props aus den J17-Rollen (Laub, Stamm, Blüte, Fels, Turm)
const GOLD_HUES = [299, 182, 88, 240, 330, 150]
// je Biom eine eigene Farbfamilie (gemischte Reihenfolge je Seed, keine Wiederholung): sonst stehen lila Biome neben lila Biomen (Georg 25.10.)
const hueOrder = (seed) => { const r = mulberry((seed | 0) * 2654435761 + 99), o = GOLD_HUES.slice(); for (let k = o.length - 1; k > 0; k--) { const j = Math.floor(r() * (k + 1)); [o[k], o[j]] = [o[j], o[k]] } return o }
export const harmonyPalettes = (seed) => { const HO = hueOrder(seed); return BD.order.map((b, i) => { const rr = mulberry((seed | 0) * 7919 + i * 104729 + 17), h0 = HO[i % HO.length] + (rr() - 0.5) * 20
  const p = cartoonFromHue(h0, (seed | 0) * 31 + i + 1), E = p.envRoles, R = p.roles, g = genPalettes(seed)[i]
  return { ...g, name: 'harmony:' + p.scheme, family: b, scheme: p.scheme, water: R.water, sand: R.under[1], low: R.top, mid: R.hill[1], high: R.tower[0], peak: R.sand, cliff: R.under[3], band6: R.leaf[1],
    sky: R.sky, leaf: R.leaf[1], leafAlt: R.leaf[0], bloom: R.leaf[2], bark: R.trunk, stone: R.rock, grass: R.leaf[0], accent: R.strang, landmark: R.tower[0], earth: R.under[2], ground: R.top,   // Bänder zeigen das ganze Schema (Georg 25.10.): Boden, Hügel, Erde, Sand, Wahrzeichen, Laub – je ein Band, wie die Insel-Seiten der Golden Samples
    six: [E.ground[1], E.accent[1], E.landmark[1], E.leaf[1], E.sky[1], E.bark[1]] } }) }
export const islandPalettes = () => BD.order.map((b) => { const isl = IP.islands[IP.biomeMap[b]], g = genPalettes(PAL_STATE.seed)[BD.order.indexOf(b)], P = { ...g, name: IP.biomeMap[b], family: b }
  for (const [band, role] of Object.entries(IP.bandMap)) P[band] = isl.roles[role][1]
  for (const r of ['leaf', 'bark', 'stone', 'grass', 'accent', 'bloom', 'earth', 'ground']) P[r] = isl.roles[r][1]
  return P })
export const BIOME_PALETTES = ISLAND_PAL ? islandPalettes() : HARMONY_PAL ? harmonyPalettes(PAL_STATE.seed) : PALGEN ? genPalettes(PAL_STATE.seed) : handPalettes()
export function setBiomePalettes(seed) { PAL_STATE.seed = seed; PAL_STATE.gen = true; BIOME_PALETTES.splice(0, BIOME_PALETTES.length, ...(HARMONY_PAL ? harmonyPalettes(seed) : genPalettes(seed))); for (const fn of PAL_STATE.listeners) fn(BIOME_PALETTES); return BIOME_PALETTES }
const shadowOf = (P) => new THREE.Color(P.cliff).lerp(new THREE.Color('#5a6f9a'), 0.45).multiplyScalar(0.7)

// opts: { cell_m = 3.4 (Grundzelle der großen Sprenkel, Übergänge 30–80 m), mix = 0.3 (Menge kleiner Tropfen), rim = 0.08 }
export function applyBiomeTerrain(mat, { cell_m = 3.4, mix = 0.3, rim = 0.08, seed = 'biome-drive' } = {}) {
  const pal = Array.from({ length: 54 }, () => new THREE.Color())
  const fill = (list) => { list.forEach((P, b) => { ROLES.forEach((r, i) => pal[b * 9 + i].set(P[r])); pal[b * 9 + 7].copy(shadowOf(P)); pal[b * 9 + 8].set(P.band6 || P.mid) }) }   // 6 × 9 Farben (Slot 8: sechstes Fließband)
  fill(BIOME_PALETTES); PAL_STATE.listeners.add(fill)
  const z = zoneSeed(seed, cell_m)
  const U = { uBioPal: { value: pal }, uSpeckleK: { value: speckleK() }, uSpBiK: { value: speckleBiK() }, uSpMix: { value: mix }, uBioCell: { value: z.cell }, uBioOff: { value: new THREE.Vector2(z.off.x, z.off.z) }, uBioRim: { value: rim }, uWindFlow: { value: new THREE.Vector2() }, uWindFlowCalm: { value: new THREE.Vector2() }, uFlowCalm: { value: new THREE.Vector4(0, 0, 0, 0) }, uGroundTone: { value: GROUND_TONE } }
  const lib = SPECKLE_GLSL_NOSIN + WARP_GLSL + WS1_SHAPE_GLSL + WS1_BI_GLSL + ws1LayerGLSL('kfbBioLayer', true, true) + '\n'
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => {
    prev?.call(mat, sh, r)
    Object.assign(sh.uniforms, U)
    sh.vertexShader = 'attribute vec3 aBioA; attribute vec3 aBioB; varying vec3 vBioA; varying vec3 vBioB;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  vBioA = aBioA; vBioB = aBioB;')
    let f = sh.fragmentShader
    const uA = /uniform vec3 uA_water[^;]*;/, uB = /uniform vec3 uB_water[^;]*;/, tb = /float tb=uMix>0\.5 \?[^;]*;/
    if (!uA.test(f) || !uB.test(f) || !tb.test(f) || !f.includes('diffuseColor.rgb = flowBands(')) throw new Error('[biomeTerrain] terrain3-Shader nicht gefunden (applyTerrain3 zuerst)')
    f = f.replace(uA, (m) => m.replace('uniform ', '')).replace(uB, (m) => m.replace('uniform ', '')).replace(tb, 'float tb=gBioSel;')
    f = f.replace(/mix\(uA_mid,uA_high,0\.5\)/g, 'uA_b6').replace(/mix\(uB_mid,uB_high,0\.5\)/g, 'uB_b6')   // sechstes Band: eigene Rolle des Schemas statt Mischton
    if (!BIO_SPECKLE) f = f.replace(/smoothstep\(h([AB])\*0\.8, h\1\*0\.8\+0\.2, tb\)/g, (m, k) => `step(h${k}*0.8+0.1, tb)`)   // je Band harte Palettenwahl (kein Verlauf im Band)   // Palettenfarben je Bildpunkt statt Uniforms
    if (MASS_ZONES) f = ZONE_GLSL + f
    f = 'uniform vec3 uBioPal[54]; vec3 uA_b6, uB_b6; uniform float uBioCell, uBioRim; uniform vec2 uBioOff, uWindFlow, uWindFlowCalm; uniform vec4 uFlowCalm; uniform float uGroundTone; varying vec3 vBioA; varying vec3 vBioB; float gBioSel = 0.0; vec3 gBioShadow = vec3(0.0); float gBioRim = 0.0;\n' + lib + f
    f = f.replace('  diffuseColor.rgb = flowBands(', `  { // V-619: zwei stärkste Biome (feste Reihenfolge), Anteil des zweiten → Sprenkel-Auswahl (kfb-speckle-transition.v1)
    float bw[6]; bw[0]=vBioA.x; bw[1]=vBioA.y; bw[2]=vBioA.z; bw[3]=vBioB.x; bw[4]=vBioB.y; bw[5]=vBioB.z;
    int i1 = 0; for (int k = 1; k < 6; k++) if (bw[k] > bw[i1]) i1 = k;
    int i2 = i1; float w2 = 0.0; for (int k = 0; k < 6; k++) if (k != i1 && bw[k] > w2) { w2 = bw[k]; i2 = k; }
    int iA = min(i1, i2), iB = max(i1, i2); float wB = w2 < 0.002 ? 0.0 : bw[iB] / max(bw[iA] + bw[iB], 1e-5); if (iA == iB) wB = 0.0;
    // Sprenkel nur im Übergangsband rechnen (mitten im Biom ist wB = 0 → Auswahl 0); fwidth der Bandkante vor der Verzweigung (Donor-Regel)
    float wEdge = fwidth(wB);
    ${BIO_SPECKLE ? `if (wB > 0.0005 || wEdge > 0.0) { vec2 q = vT3W.xz + uBioOff; vec2 wq = kfbWarpV2(q, uBioCell) + kfbWs1Shape2(q, uBioCell);
      float rimB; gBioSel = kfbBioLayer(q + 31.7 + wq, uBioCell, wB, rimB); gBioRim = rimB; }` : `gBioSel = clamp(wB * 1.3 - 0.15 + 0.12 * snoise(vT3W.xz / 47.0 + 11.3), 0.0, 1.0);`}
    int a = iA * 9, b = iB * 9; uA_b6 = uBioPal[a+8]; uB_b6 = uBioPal[b+8];
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
    diffuseColor.rgb = mix(diffuseColor.rgb, mix(uA_low, uA_mid, 0.5), calmK * 0.35);
    // Ruhefläche (Critic R1): gleiche Bänder, aber nur als Helligkeitsstufe der Grundfarbe des gewählten Bioms (kein Sand-/Gipfelton im Wiesenboden)
    if (uGroundTone > 0.0) { vec3 gBase = mix(mix(uA_low, uA_mid, 0.5), mix(uB_low, uB_mid, 0.5), gBioSel), gL = vec3(0.2126, 0.7152, 0.0722);
      float gR = dot(diffuseColor.rgb, gL) / max(dot(gBase, gL), 1e-4); diffuseColor.rgb = gBase * mix(1.0, clamp(gR, 0.55, 1.45), uGroundTone); }
    ${MASS_ZONES ? `{ // V-797: Waldboden als Materialzone (KayKit: flache Farbfläche, klare Kante), Lage aus demselben Zonenfeld wie die Waldmassen
      float zn = kfbZone(fpB) + 0.008 * snoise(fpB * 0.35); float fe = ${(ZONE.forest - ZONE.edge * 0.35).toFixed(3)};
      vec3 floorC = mix(mix(uA_mid, uA_high, 0.45), mix(uB_mid, uB_high, 0.45), gBioSel) * 0.78;
      diffuseColor.rgb = mix(diffuseColor.rgb, floorC, smoothstep(fe - 0.0025, fe + 0.0025, zn)); }` : ''} }
  diffuseColor.rgb *= 1.0 - uBioRim * gBioRim;`)
    f = f.replace('mix(diffuseColor.rgb * uT3Keep, uT3Shadow, uT3Mix)', 'mix(diffuseColor.rgb * uT3Keep, gBioShadow, uT3Mix)')
    sh.fragmentShader = f
  }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|biome-drive' + (BIO_SPECKLE ? '|spk' : '|bands')
  mat.needsUpdate = true
  // Farbfluss mit Wind (Georg 22.10., V-605): die Fließfarben treiben mit dem geteilten Wind (Richtung, Stärke, Böen kurz schneller). k = Regler 0..1.
  const flow = { k: 0.35, speed: 2.4, calmK: 0, calmR: 12 }   // calmK 0: um die Figur das ruhende Muster (Lead 22.10.), gesprenkelt gewählt statt überblendet (V-403)
  return { uniforms: U, palettes: BIOME_PALETTES, flow, setMix(v) { U.uSpMix.value = v }, setCell(v) { U.uBioCell.value = v },
    windFlow(dt, dir, strength, gust01 = 0, focus = null) { const v = flow.speed * flow.k * strength * (1 + 0.8 * gust01), vc = flow.speed * flow.k * strength * flow.calmK
      U.uWindFlow.value.x += dir.x * v * dt; U.uWindFlow.value.y += dir.y * v * dt; U.uWindFlowCalm.value.x += dir.x * vc * dt; U.uWindFlowCalm.value.y += dir.y * vc * dt
      if (focus) U.uFlowCalm.value.set(focus.x, focus.z, flow.calmR, flow.k > 0.001 ? 1 : 0) } }
}
