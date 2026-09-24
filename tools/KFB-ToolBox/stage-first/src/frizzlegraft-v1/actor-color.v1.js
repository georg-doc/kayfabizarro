/**
 * actor-color.v1 · Ein Schritt heißt ein Schritt — überall gleich.
 *
 * Georgs Regel (13.09. spät): »Augenlider: default ist -1 dunklere Variante der main/body/face
 * color; die Wimpern sind die -2 dunklere Variante — kann überschrieben/geändert werden.«
 * Ein Schritt ist eine feste Absenkung der Helligkeit in OKLCH (perzeptuell gleichmäßig — ein
 * Schritt auf Gelb sieht so dunkel aus wie ein Schritt auf Blau, was `multiplyScalar` auf sRGB
 * nicht garantiert und `#17130f` als fester Wert gar nicht erst versucht).
 *
 *   shade('#f2c93c', -1)   // Lid-Vorgabe
 *   shade('#f2c93c', -2)   // Wimpern-Vorgabe
 *
 * Das ist die VORGABE, kein Zwang: jede Stelle, die das benutzt, liest zuerst eine gespeicherte
 * Überschreibung und fällt erst auf `shade()` zurück, wenn keine da ist.
 */
const clamp01 = (v) => Math.max(0, Math.min(1, v));
function srgbToLinear(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function linearToSrgb(c) { c = Math.max(0, c); return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; }

function rgbToOklab(r, g, b) {
  r = srgbToLinear(r); g = srgbToLinear(g); b = srgbToLinear(b);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
}
function oklabToRgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
  return [
    linearToSrgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
  ];
}
function hexToRgb01(hex) {
  const n = parseInt(String(hex).replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
function rgb01ToHex([r, g, b]) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * 255)));
  return '#' + [c(r), c(g), c(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** `steps` negativ = dunkler, positiv = heller. `stepL` ist die OKLCH-Lightness je Schritt (0..1). */
export function shade(hex, steps, stepL = 0.11) {
  if (!hex) return hex;
  const [r, g, b] = hexToRgb01(hex);
  const { L, a, b: bb } = rgbToOklab(r, g, b);
  const L2 = clamp01(L + steps * stepL);
  return rgb01ToHex(oklabToRgb(L2, a, bb));
}
