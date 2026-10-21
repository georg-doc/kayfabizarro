/* KFB HUD R4 · Farbrollen. Die HUD-Töne kommen aus dem Palettengenerator (V-305, kfb-cartoon-palette.js);
 * Ruf-Farben und Story-Mode-Farben sind fest (V-292). Kartenbilder werden nie getönt (V-334).
 *
 *   const pal = stagePalette('otown');   // oder fromStoryMode('mystical') / fromHue(h)
 *   const T = hudTheme(pal, 'A');         // 'A' reine Knete · 'B' Knete + Holz/Pappe
 */
import { fromHue, fromStoryMode, hexToOklch, oklchToHex, deltaE, STORY_MODES } from './kfb-cartoon-palette.js';

export const STAGES = {
  otown: { label: 'O-Town · Boden 182° (R3-Insel)', make: () => fromHue(182) },
  canyon: { label: 'Canyon · Boden 299°', make: () => fromHue(299) },
  bucht: { label: 'Bucht · Boden 88°', make: () => fromHue(88) },
  wiese: { label: 'Grüne Wiese · Boden 135°', make: () => fromHue(135) },
  ...Object.fromEntries(Object.entries(STORY_MODES).map(([k, m]) => [k, { label: 'Story-Mode ' + m.label, make: () => fromStoryMode(k) }]))
};
export const stagePalette = (id) => (STAGES[id] || STAGES.otown).make();

const inBand = (h, a, b) => (a <= b ? h >= a && h <= b : h >= a || h <= b);
const ok = (L, C, h) => oklchToHex(L, C, h);
const lum = (hex) => { const n = parseInt(hex.slice(1), 16); const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(n >> 16 & 255) + 0.7152 * f(n >> 8 & 255) + 0.0722 * f(n & 255); };
export const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

/* Rollen-Zuordnung (Vorschlag R4):
 *   Platte (Grundplakette)   ← Boden-Farbton `roles.top`, hell (L .80) und ruhig (C ≤ .07)   → das HUD gehört zur Insel, schreit aber nicht
 *   Sockel / Kante           ← gleicher Farbton, L .52
 *   Mulde (Anzeige-Grube)    ← gleicher Farbton, L .30–.37, C .045                          → Zahlen in Creme darauf
 *   Schrift auf Platte       ← `source.storyDunkel` (Story-Mode) sonst Boden-Ton L .30
 *   Schrift in Mulde         ← `roles.cloud` (Creme)
 *   Akzent-Knopf, Tacho-Bogen← `roles.strang` (immer warm) + Leiter hell/dunkel
 *   Ziel (Ring, Nadel, Karte-Marker) ← `roles.pad` (immer Gelb)
 *   Pfeil fern               ← `roles.strang`;  Pfeil nah → Ankunfts-Grün (s. u.)
 *   Fluff                    ← `variants.bloom.satt`
 */
export function hudTheme(pal, variant = 'A') {
  const R = pal.roles, g = hexToOklch(R.top), gh = g.h;
  const pc = Math.min(0.07, Math.max(0.028, g.C * 0.6));
  const s = hexToOklch(R.strang), pd = hexToOklch(R.pad);
  const greenGround = inBand(gh, 105, 215);
  /* Ankunfts-Grün: Standard 145°. Auf grünen/türkisen Böden kippt es nach Gelbgrün (118°) und wird heller,
   * damit es sich vom Boden löst; Form (Puls + Ring) trägt die Ankunft zusätzlich. */
  const arrive = greenGround ? ok(0.86, 0.17, 118) : ok(0.74, 0.17, 145);
  const T = {
    variant, ground: R.top, groundHue: gh, sky: R.sky, cream: R.cloud,
    plaqueHi: ok(0.88, pc * 0.8, gh), plaque: ok(0.8, pc, gh), plaqueLo: ok(0.71, pc * 1.05, gh), socket: ok(0.52, pc, gh),
    wellTop: ok(0.3, 0.04, gh), wellBot: ok(0.37, 0.045, gh),
    ink: pal.source?.storyDunkel || ok(0.3, 0.06, gh), inkSoft: ok(0.44, 0.05, gh), inkWell: R.cloud,
    accent: R.strang, accentHi: ok(s.L + 0.08, s.C * 0.9, s.h), accentLo: ok(s.L - 0.15, s.C * 0.85, s.h), accentSocket: ok(s.L - 0.3, s.C * 0.7, s.h), accentInk: ok(0.27, 0.06, s.h),
    pad: R.pad, padHi: ok(pd.L + 0.05, pd.C * 0.8, pd.h), padLo: ok(pd.L - 0.2, pd.C * 0.8, pd.h),
    /* Ziel (Ring, Nadel, Kartenmarke) = Wahrzeichen-Ton (Candy-Band, gegenüber dem Boden): hebt sich vom Boden UND vom warmen Pfeil ab.
     * Ist das Wahrzeichen monochrom mit dem Strang (Canyon), nimmt das Ziel das Pad-Gelb. */
    ...(() => { const mono = pal.mode?.wahrzeichen === 'monochrom', t = hexToOklch(mono ? R.pad : R.tower[0]); return { target: mono ? R.pad : R.tower[0], targetHi: ok(t.L + 0.07, t.C * 0.9, t.h), targetLo: ok(t.L - 0.18, t.C * 0.85, t.h), targetInk: ok(0.24, 0.06, t.h), targetRole: mono ? 'roles.pad (Wahrzeichen monochrom)' : 'roles.tower[0]' }; })(),
    arrive, arriveLo: greenGround ? ok(0.66, 0.15, 118) : ok(0.55, 0.15, 145), greenGround,
    fluff: pal.variants?.bloom?.satt || '#FFF4E2',
    bubble: '#FFFDF7', bubbleInk: '#2A2420',
    /* Variante B: Holz und Pappe sind feste Naturtöne (nicht getönt). Tönung lebt in Knöpfen und Mulden. */
    wood: '#C99A62', woodHi: '#DDB27A', woodLo: '#9C6E3E', woodSocket: '#6E4A26', woodInk: '#3A2716',
    board: '#CFAE80', boardHi: '#DEC197', boardLo: '#AE8A58', tape: '#F1E7CC', tapeInk: '#4A3A24',
    storyDunkel: pal.source?.storyDunkel || null
  };
  T.checks = {
    inkOnPlaque: +contrast(T.ink, T.plaque).toFixed(2),
    creamOnWell: +contrast(T.inkWell, T.wellTop).toFixed(2),
    accentInkOnAccent: +contrast(T.accentInk, T.accent).toFixed(2),
    woodInkOnWood: +contrast(T.woodInk, T.wood).toFixed(2),   // Maserung liegt als soft-light darauf (kein multiply), die Fläche bleibt bei ≈ L 0,70
    arriveVsGround: +deltaE(T.arrive, R.top).toFixed(3),
    strangVsGround: +deltaE(T.accent, R.top).toFixed(3),
    arriveVsStrang: +deltaE(T.arrive, T.accent).toFixed(3),
    targetVsGround: +deltaE(T.target, R.top).toFixed(3),
    targetVsArrow: +deltaE(T.target, T.accent).toFixed(3)
  };
  return T;
}

/* Pfeilfarbe je Entfernung: fern (≥ 60 m) Strang, ab 60 m Übergang, ab 15 m ganz Ankunfts-Grün. Mischung in OKLCH (kürzester Farbtonweg). */
export function arrowColor(T, dist, near = 15, far = 60) {
  const t = Math.max(0, Math.min(1, (far - dist) / (far - near)));
  const a = hexToOklch(T.accent), b = hexToOklch(T.arrive);
  let dh = b.h - a.h; if (dh > 180) dh -= 360; if (dh < -180) dh += 360;
  const e = t * t * (3 - 2 * t);
  return { hex: ok(a.L + (b.L - a.L) * e, a.C + (b.C - a.C) * e, a.h + dh * e), t: e };
}

/* Entfernung kurz wie im Rollenspiel (V-335). Unter `arrive` m: keine Zahl, nur Ankunfts-Zeichen (null). */
export function fmtDist(m, { arrive = 12, compact = false } = {}) {
  if (m == null || m <= arrive) return null;
  if (m < 100) return Math.max(5, Math.round(m / 5) * 5) + ' m';
  if (m < 995) return Math.round(m / 10) * 10 + ' m';
  if (m < 9950) { const v = (m / 1000).toFixed(1).replace('.', ','); return compact ? v + 'k' : v + ' km'; }
  return Math.round(m / 1000) + (compact ? 'k' : ' km');
}
/* Höhe im Flug: 5-m-Schritte, Pfeil ↑/↓; unter 5 m „auf Höhe“ (null) */
export function fmtHeight(dy) {
  const a = Math.abs(dy); if (a < 5) return null;
  return (dy > 0 ? '↑ ' : '↓ ') + (a < 100 ? Math.round(a / 5) * 5 : Math.round(a / 10) * 10) + ' m';
}
export { STORY_MODES };
