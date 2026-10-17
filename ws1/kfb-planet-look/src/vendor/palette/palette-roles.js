// KFB Clay Stage R2 · Rollenpalette (09.10.2026) · Kopie von R1; R2: Portal-Rollen, Bögen = Stofffarbe
// EIN Besitzer für die Rollenzuordnung von Billboards UND Bühne/Vorhang. Kein neuer Palettengenerator:
// Eingang sind die drei Stops [dunkel, mitte, hell] + wc.accent aus world-context.js / world-palettes.js @5b523eb
// (Auswahl CARDS / BIOME / WORLD wie in Billboard Family v1). Ausgang sind Rollen.
// Gemischt wird im linearen Raum wie THREE.Color.lerp, damit die Billboard-Körperfarben identisch zu v1 bleiben.
const toLin = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const toS = c => c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
const parse = h => { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); return [0, 2, 4].map(i => toLin(parseInt(h.slice(i, i + 2), 16) / 255)); };
const fmt = a => '#' + a.map(v => Math.round(Math.max(0, Math.min(1, toS(Math.max(0, v)))) * 255).toString(16).padStart(2, '0')).join('');
export const mix = (a, b, t) => { const A = parse(a), B = parse(b); return fmt(A.map((v, i) => v + (B[i] - v) * t)); };
export const lum = h => { const [r, g, b] = parse(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

export const DEFAULT_STOPS = ['#3b2b4a', '#b8361f', '#e9c14a'], DEFAULT_ACCENT = '#3e6a83';

export function roles(stops = DEFAULT_STOPS, wcAccent = DEFAULT_ACCENT, night = false) {
  const [d, m, g] = stops, accent = lum(g) > 0.72 ? mix(g, m, 0.28) : g, trim = mix(g, '#f3ead3', 0.55);
  const R = { frame: m, accent, accent2: wcAccent, trim, dark: mix(d, '#1f1a14', 0.3), post: mix(d, '#a59f94', 0.5), back: mix(m, d, 0.6), ground: night ? '#2a2520' : '#6d655a' };
  // Licht: keine schwarzen Punkte. An = warmes Weiß mit Akzentstich, Aus = Milchglas im Trim-Ton (nachts gedimmt, bleibt farbig).
  R.bulbOn = mix('#fff3d2', accent, 0.22); R.bulbOff = mix('#efe6d0', trim, 0.45); R.bulbOffK = night ? 0.42 : 0.9; R.glow = R.bulbOn;
  // Bühne + Vorhang
  R.cloth = mix(m, d, 0.3); R.clothFade = mix(m, trim, 0.3); R.clothHem = mix(m, d, 0.62); R.clothWear = mix(m, '#f3ead3', 0.32); R.dust = mix('#a0937e', d, 0.2);
  R.patchA = mix(accent, m, 0.3); R.patchB = mix(wcAccent, '#e8dcc4', 0.25); R.stitch = mix(trim, '#fffaf0', 0.45); R.stain = mix(m, '#2b2018', 0.4);
  R.wood = mix('#a8774a', R.post, 0.28); R.woodPatch = mix('#d0ac74', trim, 0.3); R.woodDark = mix('#6e4b2e', d, 0.3); R.nail = mix('#857e72', d, 0.25); R.stone = mix('#bcb09e', R.post, 0.35);
  R.column = mix(wcAccent, '#ece2cd', 0.3); R.colRing = trim; R.capital = accent; R.flat = mix(R.back, '#a8774a', 0.35); R.flat2 = mix(R.back, trim, 0.25);
  R.valance = R.cloth; R.valanceDark = mix(m, d, 0.6); R.tassel = accent; R.cord = trim; R.signBoard = trim; R.lantern = accent;
  R.portal = mix(accent, '#ece2cd', 0.35); R.portalEdge = mix(accent, d, 0.45); R.portalLine = mix(m, d, 0.5);
  R.skyTop = mix(wcAccent, '#f3ead3', 0.45); R.skyBottom = mix(accent, '#f3ead3', 0.4); R.studio = mix('#d6d1c6', trim, 0.12); R.table = mix('#b9ab95', d, 0.12);
  return R;
}
