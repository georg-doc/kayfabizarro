// ============================================================================
// world-palettes.js — KFB Travel · Slice S58 · Die Farbwelt als Auswahl
// ----------------------------------------------------------------------------
// Zurückgeholt aus „KFB Terrain + Skydome v3": die BENANNTEN Paletten. Der Shader in
// `voxel-terrain.js` konnte sie die ganze Zeit (`setPalette`, `setRainbow`,
// `setColorParams` sind unverändert da) — es fehlte nur die Auswahl. Deshalb ist
// dieses Modul Daten und eine Auflösung, kein Feature.
//
// HERKUNFT DER ZAHLEN: `terrain-v3/palettes.json`, 1:1 übernommen (drei Stops je
// Palette, RGB 0..1, dunkles Tal → Mitte → leuchtende Spitze). Die JSON bleibt dort
// als Vorgeschichte liegen; gelesen wird sie nicht — 14 Zeilen Daten über einen
// Fetch zu holen schafft nur einen Fehlerfall („leeres Menü im Standalone-Export"),
// den es sonst nicht gibt.
//
// WAS BEWUSST FEHLT: die sechs Story-Paletten stehen NICHT in dieser Liste, obwohl
// v3 sie im selben Menü hatte. In v10 wählt man den Story-Modus schon an einer
// anderen Stelle (Sektion „Karten"), und dieselbe Sache an zwei Reglern ist die
// Fehlerklasse „eine Zahl, zwei Orte". Stattdessen gibt es EINEN Eintrag `story`:
// die Farbwelt folgt dem Story-Modus. Das ist auch der Standard.
//
//   import { PALETTE_OPTIONS, resolvePalette } from './world-palettes.js';
//   const r = resolvePalette(id, { wc, paletteFromVector });
//   terrain.setPalette(r.stops, spreadOpts);
//   terrain.setRainbow(r.rainbow, speed, spread);
// ============================================================================

// Die acht benannten Farbwelten aus v3.
export const NAMED_PALETTES = [
  { id: 'cubescape', name: 'Cubescape (CMY)', note: 'Demo-Hommage — reines Cyan/Gelb/Magenta, maximal cartoony.',
    stops: [[0.02, 0.35, 0.42], [0.96, 0.86, 0.12], [0.92, 0.20, 0.72]] },
  { id: 'bubblegum', name: 'Bubblegum', note: 'Pink → Koralle → Creme, weich und knallig.',
    stops: [[0.30, 0.06, 0.28], [0.96, 0.30, 0.55], [1.00, 0.86, 0.62]] },
  { id: 'toybox', name: 'Toybox', note: 'Primärfarben-Spielzeug: Blau/Rot/Gelb.',
    stops: [[0.06, 0.14, 0.42], [0.92, 0.22, 0.22], [1.00, 0.84, 0.16]] },
  { id: 'mint_pop', name: 'Mint Pop', note: 'Türkis → Limette → Zitronencreme.',
    stops: [[0.02, 0.24, 0.28], [0.16, 0.82, 0.62], [0.90, 1.00, 0.60]] },
  { id: 'sunset_arcade', name: 'Sunset Arcade', note: 'Violett → Orange → Gold, warmer Verlauf.',
    stops: [[0.16, 0.05, 0.30], [0.94, 0.34, 0.20], [1.00, 0.82, 0.34]] },
  { id: 'grape_soda', name: 'Grape Soda', note: 'Indigo → Magenta → Cyan, kühl-poppig.',
    stops: [[0.10, 0.04, 0.28], [0.72, 0.18, 0.82], [0.20, 0.86, 0.92]] },
  { id: 'seafoam', name: 'Seafoam', note: 'Tiefblau → Aqua → Sandweiß, ruhiger.',
    stops: [[0.03, 0.10, 0.24], [0.14, 0.62, 0.74], [0.86, 0.96, 0.90]] },
  { id: 'ember', name: 'Ember', note: 'Schwarzrot → Glut → Butter, dramatisch warm.',
    stops: [[0.14, 0.02, 0.04], [0.88, 0.26, 0.10], [1.00, 0.80, 0.42]] },
];

// Reihenfolge im Menü: erst der Standard, dann die Handarbeit, dann die beiden
// Sonderfälle (abgeleitet und animiert) — die stehen unten, weil sie keine Farben
// SIND, sondern Farben MACHEN.
export const PALETTE_OPTIONS = [
  { v: 'story', l: 'Story-Modus (folgt)' },
  ...NAMED_PALETTES.map((p) => ({ v: p.id, l: p.name })),
  { v: 'from_cards', l: 'Aus Karten ableiten' },
  { v: 'rainbow', l: 'Regenbogen (animiert)' },
];

export const PALETTE_NOTES = (() => {
  const m = {
    story: 'Die Farbwelt folgt dem Story-Modus — der Standard, und der einzige Eintrag, der sich mit der Erzählung ändert.',
    from_cards: 'Die Palette wird live aus dem Kartenvektor gebaut (wonder · threat · humor …): jede Kartenkombination eine eigene Farbwelt.',
    rainbow: 'Vollspektrum-Hue, im Shader nach Weltposition und Zeit animiert — Tempo und Skala regeln die beiden Slider darunter.',
  };
  for (const p of NAMED_PALETTES) m[p.id] = p.note;
  return m;
})();

const byId = {};
for (const p of NAMED_PALETTES) byId[p.id] = p;

// Ein Eintrag → drei Stops plus die Frage, ob der Regenbogen läuft. `ctx.wc` ist der
// WorldContext (er trägt `palette`, `vector`, `seed`), `ctx.paletteFromVector` die
// vorhandene Funktion aus `world-context.js` — hier wird nichts nachgebaut.
//
// Der Regenbogen ERSETZT die Stops nicht: er mischt im Shader darüber. Also behält der
// Eintrag `rainbow` die Story-Palette als Unterlage — sonst wäre das Wasser farblos und
// der Nebel würde beim Umschalten springen.
export function resolvePalette(id, ctx = {}) {
  const wc = ctx.wc || {};
  const story = wc.palette || [[0.1, 0.1, 0.12], [0.5, 0.5, 0.55], [0.9, 0.9, 0.92]];
  if (id === 'rainbow') return { stops: story, rainbow: true, id };
  if (id === 'from_cards') {
    const f = ctx.paletteFromVector;
    const stops = (f && wc.vector) ? f(wc.vector, wc.seed || 1) : story;
    return { stops, rainbow: false, id };
  }
  const named = byId[id];
  if (named) return { stops: named.stops, rainbow: false, id };
  return { stops: story, rainbow: false, id: 'story' };
}
