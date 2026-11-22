// Waffen-Look R1 (Georg 19.11.): Skins für die Waffen, ohne neue Modelle. Ziel: dunkle, gebrauchte Sci-Fi-/Dieselpunk-Waffen mit eigener Akzentfarbe je Waffe,
// blauem Glühen an den Energieteilen und abgewetzten Kanten; die cartoonige Form und der Knete-Materialcode bleiben, nichts Goldenes, nicht alles grau.
// Weg: Die Waffen tragen je ein Material mit Farbtabelle (KayKit-Atlas, Kenney-Palette). Der Shader liest je Bildpunkt die Originalfarbe und leitet die Rolle ab:
//   hell und unbunt → abgewetzter Stahl · mittel und unbunt → Gunmetal · dunkel → Griff · bunt → Akzent der Waffe · Cyan/Blau → Glühteil (Emission).
//   Verläufe der Tabelle bleiben als Helligkeit erhalten. Kanten aus der Geometrie (fwidth der Normale) werden blank gescheuert.
//   Glühen und Laufhitze: uGlut (0…1, je Schuss) hebt die Glühteile an, wie das Laufglühen vorn.
// Alle Varianten in einem Programm: Umschalten = Uniform-Werte, kein Neuübersetzen. Variante 'bestand' lässt das Material unverändert (uAn 0).
// Eingriff nach color_fragment: Textur und Vertexfarben (Kenney) sind dann schon verrechnet.
// Der Patch hängt sich hinter vorhandene onBeforeCompile-Patches (Laufglühen, Knete) und ändert die Cache-Kennung nur um ein Suffix.
// waffenLook(material, { akzent }) → Uniforms; setzeWaffenLook(uniforms, variante) schaltet um. Rein: nur THREE.
import * as THREE from 'three'

// Varianten (Farben sRGB): stahl = abgewetzt hell, mitte = Gunmetal, griff = dunkel; akzent = Anteil der Waffenfarbe; glow = Farbe und Grundleuchten;
// metall/rauh je Rolle [stahl, mitte, griff, akzent]; kante = Stärke der blanken Kanten
export const WAFFEN_LOOKS = Object.freeze({
  bestand: null,
  einsatz: { stahl: '#9aa3ad', mitte: '#3d444d', griff: '#1b1e23', akzent: 0.95, satt: 0.85, glow: '#49b6ff', glowBasis: 0.55, metall: [0.75, 0.6, 0.12, 0.35], rauh: [0.32, 0.44, 0.72, 0.5], kante: 0.65, rost: 0.15, oel: 0.3, naht: 0.3 },
  // Diesel (Georg 19.11. über A-192): wie das Cabrio Skyline – mattes, verwittertes Blech, Rost an Kanten und Nähten, Öl- und Schmutzflecken, nicht spiegelnd
  diesel: { stahl: '#9b9c97', mitte: '#5d605e', griff: '#2b2825', akzent: 0.7, satt: 0.4, glow: '#5fc8ff', glowBasis: 0.45, metall: [0.35, 0.28, 0.02, 0.15], rauh: [0.58, 0.68, 0.85, 0.74], kante: 0.8, rost: 1.0, oel: 0.8, naht: 1.0 },
  nacht: { stahl: '#5c646f', mitte: '#22262c', griff: '#0f1114', akzent: 0.6, satt: 0.75, glow: '#3d8bff', glowBasis: 1.0, metall: [0.85, 0.7, 0.1, 0.4], rauh: [0.28, 0.36, 0.7, 0.45], kante: 0.4, rost: 0, oel: 0.2, naht: 0.2 },
})
export const WAFFEN_LOOK_NAMEN = Object.freeze(Object.keys(WAFFEN_LOOKS))
// Akzent je Waffe (Spiel-IDs und Bühnen-IDs): unterscheidbar, keine Goldtöne; unbekannte Waffen bekommen eine Farbe aus ihrer ID
export const WAFFEN_AKZENT = Object.freeze({
  pistol: '#2fb3a5', spy: '#b4c0d4', spygun: '#b4c0d4', rifle: '#6f8a3a', ranger: '#4f86c6', marksman: '#7a8f9c', shotgun: '#a3452a', toysoldier: '#5d7d2a',
  blaster: '#3f7fe0', gatling: '#e0861c', spreadshot: '#c0472f', granate: '#8c9a3a', grenade: '#8c9a3a', rakete: '#d0602a', rocket: '#d0602a', clownbomb: '#c23a5a',
  railgun: '#7a5ce0', laser: '#e0503a', blitz: '#58a8ff', kugelblitz: '#58a8ff', wasser: '#2f9fd0', saeure: '#8fbf2a', farbkanone: '#3fbfb0',
})
const AKZENT_REIHE = ['#2fb3a5', '#e0861c', '#a3452a', '#4f86c6', '#7a5ce0', '#6f8a3a', '#c23a5a', '#3f7fe0']
export const akzentFuer = (id = '') => WAFFEN_AKZENT[id] || AKZENT_REIHE[[...String(id)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % AKZENT_REIHE.length]

// Spiel-Schalter waffenlook=einsatz|diesel|nacht (flags.js): ohne Schalter bleibt der Bestand, der Patch wird dann gar nicht angelegt
export const WAFFENLOOK_WAHL = (() => { const m = typeof location !== 'undefined' ? /(^|[#,])waffenlook=(einsatz|diesel|nacht)(,|$)/.exec(location.hash) : null; return m ? m[2] : null })()
const lin = (hex) => new THREE.Color(hex)   // three rechnet Color.set im Arbeitsfarbraum (linear) um
export function waffenLook(material, { akzent = '#3f7fe0', uniforms = null } = {}) {
  const U = uniforms || {
    uLookAn: { value: 0 }, uLookStahl: { value: new THREE.Color() }, uLookMitte: { value: new THREE.Color() }, uLookGriff: { value: new THREE.Color() },
    uLookAkzent: { value: lin(akzent) }, uLookAkzentAnteil: { value: 1 }, uLookSatt: { value: 1 }, uLookGlow: { value: new THREE.Color() }, uLookGlowBasis: { value: 0 },
    uLookMetall: { value: new THREE.Vector4() }, uLookRauh: { value: new THREE.Vector4() }, uLookKante: { value: 0 }, uGlut: { value: 0 }, uLookKoerperHue: { value: -1 },
    uLookRost: { value: 0 }, uLookOel: { value: 0 }, uLookNaht: { value: 0 }, uLookSkala: { value: 20 },
  }
  const vorher = material.onBeforeCompile, schluessel = material.customProgramCacheKey?.bind(material)
  material.onBeforeCompile = (sh, r) => {
    vorher?.call(material, sh, r)
    Object.assign(sh.uniforms, U)
    // Objektraum für Rost und Öl: Flecken kleben am Modell (kein Flimmern bei Bewegung)
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vKfbLookP;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvKfbLookP = position;')
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
uniform float uLookAn; uniform vec3 uLookStahl; uniform vec3 uLookMitte; uniform vec3 uLookGriff; uniform vec3 uLookAkzent; uniform float uLookAkzentAnteil; uniform float uLookSatt;
uniform vec3 uLookGlow; uniform float uLookGlowBasis; uniform vec4 uLookMetall; uniform vec4 uLookRauh; uniform float uLookKante; uniform float uGlut; uniform float uLookKoerperHue;
uniform float uLookRost; uniform float uLookOel; uniform float uLookNaht; uniform float uLookSkala; varying vec3 vKfbLookP;
float kfbLookRauheit = -1.0;
float kfbH3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float kfbRausch(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(kfbH3(i), kfbH3(i + vec3(1, 0, 0)), f.x), mix(kfbH3(i + vec3(0, 1, 0)), kfbH3(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(kfbH3(i + vec3(0, 0, 1)), kfbH3(i + vec3(1, 0, 1)), f.x), mix(kfbH3(i + vec3(0, 1, 1)), kfbH3(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
float kfbLookGlow = 0.0; vec4 kfbLookRolle = vec4(0.0);
float kfbHue(vec3 c) { float mx = max(max(c.r, c.g), c.b), mn = min(min(c.r, c.g), c.b), d = mx - mn; if (d < 1e-4) return 0.0;
  float h = mx == c.r ? mod((c.g - c.b) / d, 6.0) : mx == c.g ? (c.b - c.r) / d + 2.0 : (c.r - c.g) / d + 4.0; return h / 6.0; }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
if (uLookAn > 0.5) {
  vec3 cs = pow(max(diffuseColor.rgb, vec3(0.0)), vec3(1.0 / 2.2));
  float mx = max(max(cs.r, cs.g), cs.b), mn = min(min(cs.r, cs.g), cs.b), L = dot(cs, vec3(0.299, 0.587, 0.114));
  float sat = mx > 1e-3 ? (mx - mn) / mx : 0.0, h = kfbHue(cs);
  float bunt = smoothstep(0.28, 0.48, sat) * smoothstep(0.08, 0.2, L);
  float blau = smoothstep(0.43, 0.5, h) * (1.0 - smoothstep(0.68, 0.74, h));
  // Körperfarbe (vorherrschender Farbton der Waffe, koerperHue): wird dunkles Metall mit Farbstich statt Akzent, auch wenn sie blau ist
  float dh = abs(h - uLookKoerperHue); dh = min(dh, 1.0 - dh);
  float koerper = uLookKoerperHue < 0.0 ? 0.0 : 1.0 - smoothstep(0.05, 0.11, dh);
  float wKoerper = bunt * koerper, wGlow = bunt * (1.0 - koerper) * blau * smoothstep(0.25, 0.4, L), wAkz = bunt * (1.0 - koerper) * (1.0 - blau), wNeu = 1.0 - wGlow - wAkz;
  float hell = smoothstep(0.5, 0.75, L), dunkel = 1.0 - smoothstep(0.1, 0.28, L);
  vec3 kfbLookRolleRoh = vec3(hell, dunkel, bunt);
  vec3 neutral = mix(mix(uLookMitte, uLookStahl, hell), uLookGriff, dunkel);
  float spur = 0.7 + 0.6 * L;
  vec3 akz = mix(vec3(dot(uLookAkzent, vec3(0.299, 0.587, 0.114))), uLookAkzent, uLookSatt) * (0.45 + 0.9 * L);
  vec3 stich = mix(uLookMitte, uLookAkzent * 0.35, 0.22) * (0.8 + 0.5 * L);
  vec3 neu = neutral * spur * (wNeu - wKoerper) + stich * wKoerper + mix(neutral * spur, akz, uLookAkzentAnteil) * wAkz + uLookMitte * 0.6 * wGlow;
  // blanke Kanten: Krümmung über die Normale im Bildraum
  float kante = clamp(length(fwidth(normalize(vNormal))) * 3.0 - 0.15, 0.0, 1.0) * uLookKante;
  neu = mix(neu, uLookStahl * 1.25, kante * (1.0 - wGlow));
  // Diesel: Rost an Kanten und in Flecken, Öl als dunkle Schlieren, Nähte dort, wo die Bauteil-Rolle wechselt (alles matt)
  vec3 q = vKfbLookP * uLookSkala;
  float n1 = kfbRausch(q * 2.2), n2 = kfbRausch(q * 5.5 + 7.0), n3 = kfbRausch(q * 0.8 + 3.0);
  float rost = clamp(smoothstep(0.56, 0.72, n1 * 0.6 + n2 * 0.4) + kante * 0.7 * smoothstep(0.4, 0.62, n2), 0.0, 1.0) * uLookRost * (1.0 - wGlow);
  float naht = clamp(length(fwidth(kfbLookRolleRoh)) * 2.5, 0.0, 1.0) * uLookNaht * (1.0 - wGlow);
  float oel = smoothstep(0.5, 0.75, n3) * uLookOel * (1.0 - wGlow);
  vec3 rostFarbe = mix(vec3(0.16, 0.055, 0.02), vec3(0.34, 0.12, 0.04), n2);
  neu = mix(neu, rostFarbe, max(rost * 0.85, naht * 0.7));
  neu *= 1.0 - 0.45 * oel;
  kfbLookRauheit = clamp(0.25 * rost + 0.15 * naht - 0.2 * oel, -0.3, 0.3);
  diffuseColor.rgb = neu;
  kfbLookGlow = wGlow;
  kfbLookRolle = vec4(wNeu * (1.0 - dunkel) * hell, wNeu * (1.0 - dunkel) * (1.0 - hell), wNeu * dunkel, wAkz);
}`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
if (uLookAn > 0.5) { float rs = dot(kfbLookRolle, vec4(1.0)); if (rs > 1e-3) roughnessFactor = dot(kfbLookRolle, uLookRauh) / rs; roughnessFactor = clamp(roughnessFactor + kfbLookRauheit * step(-0.9, kfbLookRauheit), 0.04, 1.0); }`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>
if (uLookAn > 0.5) { float ms = dot(kfbLookRolle, vec4(1.0)); if (ms > 1e-3) metalnessFactor = dot(kfbLookRolle, uLookMetall) / ms; }`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
if (uLookAn > 0.5) totalEmissiveRadiance += uLookGlow * kfbLookGlow * (uLookGlowBasis + 2.5 * uGlut);`)
  }
  material.customProgramCacheKey = () => (schluessel ? schluessel() : '') + '|kfb-waffenlook-r1'
  material.needsUpdate = true
  return U
}
// Vorherrschender bunter Farbton einer Waffe (0…1) oder -1, wenn sie überwiegend unbunt ist: Stichprobe der Farbe an den UVs der Ecken (Textur über
// ein Canvas, sonst Vertexfarbe bzw. Materialfarbe), Histogramm über 24 Farbtöne. Läuft einmal je Waffe beim Laden (Browser).
const _bilder = new WeakMap()
function pixelLeser(img) {
  if (!img || typeof document === 'undefined') return null
  if (_bilder.has(img)) return _bilder.get(img)
  const w = img.width || img.naturalWidth, h = img.height || img.naturalHeight; if (!w || !h) return null
  const c = document.createElement('canvas'); c.width = Math.min(256, w); c.height = Math.min(256, h)
  const g = c.getContext('2d', { willReadFrequently: true }); try { g.drawImage(img, 0, 0, c.width, c.height) } catch { return null }
  const d = g.getImageData(0, 0, c.width, c.height).data, L = { w: c.width, h: c.height, d }; _bilder.set(img, L); return L
}
export function koerperHue(object3d, { schwelle = 0.25, anteil = null } = {}) {
  // nach Fläche gewichtet (Dreieck: Farbe in der Mitte, Gewicht = Fläche): große flache Körperflächen haben wenige Ecken
  const bins = new Float32Array(24); let alle = 0, bunt = 0
  const zaehle = (r, g, b, w) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), s = mx > 0.003 ? (mx - mn) / mx : 0, l = 0.299 * r + 0.587 * g + 0.114 * b; alle += w
    if (s < 0.35 || l < 0.12) return; bunt += w; const d = mx - mn; let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = ((h / 6) % 1 + 1) % 1; bins[Math.floor(h * 24) % 24] += w }
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  object3d.traverse((o) => {
    if (!o.isMesh) return
    const geo = o.geometry, pos = geo?.attributes?.position, uv = geo?.attributes?.uv, vc = geo?.attributes?.color, idx = geo?.index; if (!pos) return
    const ms = [].concat(o.material), gruppen = geo.groups?.length ? geo.groups : [{ start: 0, count: idx ? idx.count : pos.count, materialIndex: 0 }]
    for (const gr of gruppen) {
      const m = ms[gr.materialIndex ?? 0] || ms[0], P = m?.map ? pixelLeser(m.map.image) : null
      const farbe = m?.color ? m.color.clone().convertLinearToSRGB() : null
      const n = Math.floor(gr.count / 3), schritt = Math.max(1, Math.floor(n / 3000))
      for (let t = 0; t < n; t += schritt) {
        const k = gr.start + t * 3, i0 = idx ? idx.getX(k) : k, i1 = idx ? idx.getX(k + 1) : k + 1, i2 = idx ? idx.getX(k + 2) : k + 2
        a.fromBufferAttribute(pos, i0); b.fromBufferAttribute(pos, i1); c.fromBufferAttribute(pos, i2)
        const w = b.sub(a).cross(c.sub(a)).length() * 0.5; if (!(w > 0)) continue
        if (P && uv) { let u = (uv.getX(i0) + uv.getX(i1) + uv.getX(i2)) / 3 % 1, v = (uv.getY(i0) + uv.getY(i1) + uv.getY(i2)) / 3 % 1; if (u < 0) u += 1; if (v < 0) v += 1; if (m.map.flipY !== false) v = 1 - v
          const x = Math.min(P.w - 1, Math.floor(u * P.w)), y = Math.min(P.h - 1, Math.floor(v * P.h)), q = (y * P.w + x) * 4; zaehle(P.d[q] / 255, P.d[q + 1] / 255, P.d[q + 2] / 255, w) }
        else if (vc) zaehle(vc.getX(i0), vc.getY(i0), vc.getZ(i0), w)
        else if (farbe) zaehle(farbe.r, farbe.g, farbe.b, w)
      }
    }
  })
  if (anteil) anteil.wert = alle ? bunt / alle : 0
  if (!alle || bunt / alle < schwelle) return -1
  let best = 0; for (let i = 1; i < 24; i++) if (bins[i] + 0.5 * (bins[(i + 23) % 24] + bins[(i + 1) % 24]) > bins[best] + 0.5 * (bins[(best + 23) % 24] + bins[(best + 1) % 24])) best = i
  return (best + 0.5) / 24
}
// Fleckengröße je Waffe: Rauschfrequenz im Objektraum so, dass etwa 6 Flecken über die Waffenlänge gehen (Kenney ×1,92, KayKit 1:1)
export function lookSkala(object3d) { const b = new THREE.Box3(); object3d.traverse((o) => { if (o.isMesh && o.geometry) { o.geometry.computeBoundingBox?.(); if (o.geometry.boundingBox) b.union(o.geometry.boundingBox) } }); const l = b.isEmpty() ? 0.3 : b.getSize(new THREE.Vector3()).length(); return 6 / Math.max(0.02, l) }
// Variante setzen (Name aus WAFFEN_LOOKS); 'bestand' schaltet ab
export function setzeWaffenLook(U, variante = 'bestand') {
  const V = WAFFEN_LOOKS[variante]
  if (!V) { U.uLookAn.value = 0; return false }
  U.uLookAn.value = 1
  U.uLookStahl.value.set(V.stahl); U.uLookMitte.value.set(V.mitte); U.uLookGriff.value.set(V.griff); U.uLookGlow.value.set(V.glow)
  U.uLookAkzentAnteil.value = V.akzent; U.uLookSatt.value = V.satt; U.uLookGlowBasis.value = V.glowBasis; U.uLookKante.value = V.kante
  U.uLookMetall.value.fromArray(V.metall); U.uLookRauh.value.fromArray(V.rauh)
  U.uLookRost.value = V.rost ?? 0; U.uLookOel.value = V.oel ?? 0; U.uLookNaht.value = V.naht ?? 0
  return true
}
