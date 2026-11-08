// Twenty original KFB ChronoLoom icon silhouettes (editable SVG sources).
// NOT historical Maya glyph facsimiles; NOT an approved final claymation skin.
// No tile, faux transparency, font fallback, HUD frame or replacement branding.
import { DAY_SIGNS, SIGNS } from "./chronoloom-core.mjs";

// Each original motif is a simple independent shape; transparent SVG background.
// Names follow the calendar sequence, while the drawn marks are KFB interpretation.
export const MOTIF_PATHS = Object.freeze([
  "M33 78 C21 61 34 39 51 42 C67 29 89 46 90 60 C94 82 69 91 50 82 M36 58 Q54 68 78 56 M51 48 L52 49",
  "M28 67 C23 40 74 33 84 52 C95 80 51 90 44 68 C40 53 64 49 70 61 C76 74 59 76 56 68",
  "M33 88 L33 43 Q64 20 95 43 L95 88 M43 88 V58 Q64 42 85 58 V88 M48 36 Q67 48 81 35",
  "M64 91 C48 78 40 62 45 48 Q64 36 83 48 C90 68 78 83 64 91 M64 86 V45 M64 64 Q46 58 38 49 M64 69 Q81 55 91 51",
  "M32 77 C30 48 47 37 58 47 C70 58 45 72 65 81 C85 92 101 62 83 46 C79 42 72 43 69 46 M78 42 L90 33 M84 45 L100 43",
  "M29 42 Q64 30 99 42 M36 42 V91 M92 42 V91 M38 91 Q64 71 90 91 M51 53 V68 M78 53 V68",
  "M39 91 L35 68 Q32 59 38 56 L39 35 Q43 28 48 38 L50 58 L53 29 Q60 25 61 34 L62 58 L68 31 Q76 26 77 38 L74 62 L83 43 Q90 42 89 53 L84 76 L71 91",
  "M64 26 L74 53 L101 64 L74 74 L64 102 L53 74 L27 64 L53 53 Z M64 51 L64 77 M51 64 H77",
  "M64 26 C61 47 42 57 42 74 C42 99 86 100 86 75 C86 59 68 46 64 26 M49 80 Q64 90 79 79",
  "M38 73 Q51 66 66 75 Q78 86 92 70 M42 57 L44 54 M59 51 L60 46 M76 51 L80 46 M42 83 L39 89 M59 88 L57 96 M80 83 L84 90",
  "M30 83 C43 95 55 76 44 66 C32 56 46 39 63 51 C74 60 66 74 78 77 C88 80 96 68 91 55 M43 44 L34 34 M80 49 L93 39",
  "M36 94 L48 79 L41 63 L60 50 L55 37 M60 50 L77 60 L90 42 M48 79 L65 87 L88 77 M65 87 L69 99",
  "M53 95 L50 38 M77 95 L75 29 M38 62 L90 59 M41 74 L89 71 M48 42 Q64 24 82 41",
  "M30 43 Q64 20 99 43 L91 83 Q63 102 37 83 Z M46 54 L48 55 M80 49 L82 51 M65 75 L68 76 M49 84 L51 85 M78 85 L80 86",
  "M33 83 Q57 40 96 42 Q88 77 45 92 M41 75 Q65 70 84 51 M58 67 L52 46 M73 58 L90 76",
  "M44 94 Q36 70 51 44 Q59 36 70 42 Q88 59 77 83 Q69 97 44 94 M52 47 Q71 70 51 90 M74 50 L89 36",
  "M30 79 Q44 37 60 57 Q73 75 94 40 M38 87 Q66 103 91 82 M46 63 Q65 51 78 66 M66 35 L71 45",
  "M68 25 L42 65 L60 65 L50 101 L90 51 L68 51 Z M34 39 L44 29 M90 91 L98 81",
  "M32 66 C28 49 43 44 51 50 C56 30 82 31 87 50 C103 54 99 75 88 79 M40 89 L52 72 L60 88 L73 66 L80 90 M52 43 L55 32",
  "M64 27 V40 M64 87 V102 M27 64 H40 M88 64 H101 M38 38 L47 47 M82 82 L91 91 M91 38 L82 47 M38 91 L47 82 M64 45 A19 19 0 1 0 64 83 A19 19 0 1 0 64 45"
]);
function checkIndex(index) {
  if (!Number.isInteger(index) || index < 0 || index >= SIGNS) throw new RangeError("signIndex must be 0..19");
}
function safeColor(value) {
  if (typeof value !== "string" || !/^#[0-9a-fA-F]{6}$/.test(value)) throw new TypeError("color must be a six-digit hex");
  return value;
}
// SVG is an authored graphic source for a later clay render, not final production art.
// 13 small markers indicate a KFB navigational phase—not an authentic Maya numeral.
export function chronoglyphSvg(signIndex, tone = 1, { accent = "#D5A74F", ink = "#34251E" } = {}) {
  checkIndex(signIndex);
  if (!Number.isInteger(tone) || tone < 1 || tone > 13) throw new RangeError("tone must be 1..13");
  safeColor(accent); safeColor(ink);
  const shape = MOTIF_PATHS[signIndex];
  const dots = Array.from({ length: tone }, (_, i) => {
    const a = (20 + i * (140 / 12)) * Math.PI / 180;
    const x = (64 + 49 * Math.cos(a)).toFixed(2);
    const y = (64 + 49 * Math.sin(a)).toFixed(2);
    return '<circle cx="' + x + '" cy="' + y + '" r="2.6" fill="' + ink + '"/>';
  }).join("");
  return '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" fill="none" role="img" aria-label="' + DAY_SIGNS[signIndex].name + ', Phase ' + tone + '">' +
    '<path d="' + shape + '" stroke="' + ink + '" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + shape + '" stroke="' + accent + '" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    dots + '</svg>';
}
