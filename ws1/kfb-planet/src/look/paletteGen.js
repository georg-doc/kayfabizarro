// V-619 · Prozedurale Cartoon-Farbplatten für Biome (Georg 22.10.: „harmonische Cartoon-Farbplatten, die wir prozedural generieren können“; für die
// Biom-Farben gilt nicht der Kanon). Aus einer Familie (Grundton + Harmonie) und einem Seed entsteht eine Palette mit den sieben Flächenrollen der
// Gelände-Probe (water, sand, low, mid, high, peak, cliff) plus sky. Ohne three, ohne DOM.
// Regeln (in OKLCH, wahrnehmungsgleich):
//   • Platten: feste Helligkeitsleiter (peak > sand > low > water > mid > high > cliff), Abstand ≥ 0,07 → jede Rolle liest sich als eigene, flache Fläche;
//   • Harmonie: low/mid/high analog um den Grundton (±d), cliff = Akzent nach Harmonie (komplementär, geteilt-komplementär, Triade), water kühl, zum Akzent
//     gezogen, sand warm zum Grundton gezogen, peak fast weiß im Grundton, sky hell und entsättigt;
//   • Cartoon: kräftig, aber nie Neon (Chroma begrenzt, in den sRGB-Raum zurückgeführt), Nachbarrollen nie gleich;
//   • Seed: Grundton ±hueJitter, Abstände, Chroma ±15 %, Helligkeit ±0,02 – gleiche Familie, je Welt eine andere Ausprägung.
export const ROLES = ['water', 'sand', 'low', 'mid', 'high', 'peak', 'cliff', 'sky']
const HARM = { komplement: [180], split: [150, 210], triade: [120, 240], analog: [40] }

// ── OKLCH ↔ sRGB ─────────────────────────────────────────────────────────────────────────────────────────────────
const srgb = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055), lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
export function oklchToRgb(L, C, H) {
  const h = (H * Math.PI) / 180, a = C * Math.cos(h), b = C * Math.sin(h)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s]
}
export function hexToOklch(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255))
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return [L, Math.hypot(A, B), ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360]
}
const inGamut = (c) => c.every((v) => v >= -1e-4 && v <= 1.0001)
// Chroma so weit senken, bis die Farbe im sRGB-Raum liegt (Ton und Helligkeit bleiben)
export function oklchHex(L, C, H) {
  let lo = 0, hi = C, rgb = oklchToRgb(L, C, H)
  if (!inGamut(rgb)) { for (let i = 0; i < 18; i++) { const mid = (lo + hi) / 2; if (inGamut(oklchToRgb(L, mid, H))) lo = mid; else hi = mid } rgb = oklchToRgb(L, lo, H) }
  return '#' + rgb.map((v) => Math.round(Math.min(1, Math.max(0, srgb(Math.min(1, Math.max(0, v))))) * 255).toString(16).padStart(2, '0')).join('')
}
const mixHue = (a, b, k) => { let d = ((b - a + 540) % 360) - 180; return (a + d * k + 360) % 360 }

// Seed-Zufall (mulberry32)
export function rng(seed) { let s = (seed >>> 0) || 1; return () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
const strSeed = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0 } return h }

// family: { hue, harmony, chroma = 1, light = 0, d = 18, hueJitter = 14, accent?: Gradzahl statt Harmonie, water?: Ton, ladder?: {rolle: L} }
export function generatePalette(family, seed = 0) {
  const R = rng(strSeed(family.name || '') ^ (seed * 2654435761)), j = (a) => (R() * 2 - 1) * a
  const H = (family.hue + j(family.hueJitter ?? 20) + 360) % 360, c = (family.chroma ?? 1) * (1 + j(0.15)), dL = (family.light ?? 0) + j(0.02)
  const d1 = (family.d ?? 18) * (R() < 0.5 ? 1 : -1) * (0.6 + 0.9 * R()), d2 = -d1 * (0.6 + 0.6 * R())
  const offs = HARM[family.harmony] || HARM.komplement, accent = family.accent != null ? (family.accent + j(10) + 360) % 360 : (H + offs[Math.floor(R() * offs.length)] + j(12) + 360) % 360
  const waterH = family.water != null ? family.water + j(8) : mixHue(205, accent, 0.25)
  const LAD = { peak: 0.955, sand: 0.875, low: 0.785, water: 0.71, mid: 0.635, high: 0.55, cliff: 0.465, sky: 0.9, ...(family.ladder || {}) }
  const Lr = (k) => (dL >= 0 ? 1 - (1 - LAD[k]) * (1 - dL) : LAD[k] * (1 + dL))   // heller/dunkler ohne Anschlag: die Leiter wird gestaucht, nicht abgeschnitten
  const P = {
    peak: oklchHex(Lr('peak'), 0.025 * c, H),
    sand: oklchHex(Lr('sand'), 0.075 * c, mixHue(H, 85, family.sandWarm ?? 0.55)),   // Sand warm gezogen; kühle/violette Familien behalten ihren Ton (sandWarm klein)
    low: oklchHex(Lr('low'), 0.12 * c, (H + d1 + 360) % 360),
    mid: oklchHex(Lr('mid'), 0.14 * c, H),
    high: oklchHex(Lr('high'), 0.12 * c, (H + d2 + 360) % 360),
    cliff: oklchHex(Lr('cliff'), 0.13 * c, accent),
    water: oklchHex(Lr('water'), 0.1 * Math.max(0.7, c), waterH),
    sky: oklchHex(Lr('sky'), 0.045, mixHue(235, H, 0.2)),
  }
  return { ...P, name: family.name, family: family.key, seed, hue: +H.toFixed(1), accent: +accent.toFixed(1), harmony: family.harmony }
}

// Prüfung „Platten“: kleinster Helligkeitsabstand der Flächenrollen und kleinster Farbabstand (OKLab ΔE) zwischen zwei Rollen
export function plateStats(P) {
  const R6 = ['water', 'sand', 'low', 'mid', 'high', 'peak', 'cliff'], ok = R6.map((r) => hexToOklch(P[r]))
  const lab = ok.map(([L, C, H]) => [L, C * Math.cos((H * Math.PI) / 180), C * Math.sin((H * Math.PI) / 180)])
  let dE = Infinity; for (let i = 0; i < lab.length; i++) for (let k = i + 1; k < lab.length; k++) dE = Math.min(dE, Math.hypot(lab[i][0] - lab[k][0], lab[i][1] - lab[k][1], lab[i][2] - lab[k][2]))
  const Ls = ok.map((o) => o[0]).sort((a, b) => a - b); let dL = Infinity; for (let i = 1; i < Ls.length; i++) dL = Math.min(dL, Ls[i] - Ls[i - 1])
  return { minDeltaE: +dE.toFixed(3), minDeltaL: +dL.toFixed(3), maxChroma: +Math.max(...ok.map((o) => o[1])).toFixed(3) }
}
