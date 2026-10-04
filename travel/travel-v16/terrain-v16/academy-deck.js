// ============================================================================
// academy-deck.js — KFB Travel · Slice S31/S32a · Würfelakademie als Daten
// ----------------------------------------------------------------------------
// **Echter Lern-Content statt mehr Juice.** Die 30 Lektionen sind nicht erfunden:
// sie sind 1:1 das Curriculum der KFB Cube Academy v1
// (`uploads/KFB Cube Academy v1/KFB Cube Academy v1.html`, const CHAPTERS) —
// fünf Kapitel × sechs Lektionen, jede mit ihrer three.js-Beispiel-Id und dem
// Renderer-Tag (GL = klassisches WebGL, GPU = WebGPU/TSL, KFB = eigenes Stück).
// Die sechste Fläche des Kapitel-Würfels war „Meta"; hier wird sie der HUB.
//
// KANON aus der Academy: Kapitel = Story-Modus = Zonenfarbe, und innerhalb eines
// Kapitels **hell (leicht) → dunkel (schwer)**. Im Himmel wird daraus die HÖHE.
//
// S32a — DIE KARTE IST EINE FLÄCHE, KEIN FORMULAR.
// Vorher trug das Blatt ein Kopfband und ein Fenster; jetzt zeigt es vollflächig,
// was es zu zeigen hat (Live-Demo · three.js-Vorschaubild · Zonenfeld), und
// Titel/Meta schweben daneben (Voxel-Glyphen, S32b). Daraus folgt die Technik:
//  · **Silhouette als `alphaMap`** — die wobbly Kartenkante wird ausgestanzt
//    (`alphaTest`, harte Kante, kein Glow), nicht ins Bild gemalt. Damit ist sie
//    auch über einer Render-Textur unregelmäßig.
//  · **Tusche als DECAL** — ein zweites Quad davor trägt NUR die Linie, sonst
//    transparent. Kanontreu: „Tusche liegt auf der Bildebene, nicht am Objekt."
//  · **Die Linie ist der Kanon, kein Eigenbau:** `kfb-ink.js` (SSOT im
//    Projektwurzel), `inked`-Stil mit den Gewichten aus rollercoaster-v11
//    (baseW = min(w,h)·0.032 · jit = ·0.014 · wob 0.5 · #191410).
//    Der vorige Eigenbau war eine Jitter-Schleife mit konstanter Breite — also
//    ein verrauschtes Rechteck, keine Tusche.
// ============================================================================

import { MODES } from './world-context.js';
import './kfb-ink.js';   // IIFE, registriert window.KFBInk — für CHIPS (Post-it), nicht für Karten
import { brushLoop, inkTail, inkHalfWidth } from './ink-tail.js';
import { CARD_AR, fitCell, fillPad } from '../cardbuilder/kfb-card-format.js';

const INKAPI = window.KFBInk;
// S82 · Abnahme der Papier-Bänder: Anteil und die gemessenen Farbtöne des letzten Blattes.
let lastPad = null;
export function padReport() { return lastPad; }
const INK = '#191410', PAPER = '#efe6d0', CREAM = '#f7f0dd';

// S62 · Das Blattformat kommt aus EINER Stelle. Vorher stand 1,79 hier, in `sky-cards.js` und im
// CardBuilder — dreimal dieselbe Zahl mit einem Kommentar, der mahnte, sie gleich zu halten.
export const SHEET_AR = CARD_AR;
// Vier Kanten-Seeds statt 31: „pro Element ein stabiler Seed" bleibt erfüllt (Reload =
// gleiche Kante), aber Maske und Decal werden geteilt — 8 Texturen für 31 Karten.
const SEEDS = [7, 23, 41, 59];
export const seedFor = (route) => SEEDS[(route | 0) % SEEDS.length];

export const CHAPTERS = [
  { nr: '01', titel: 'Bewegung', sub: 'Animation & Charakter', mode: 'heroic', lekt: [
    ['Keyframe-Animation', 'webgl_animation_keyframes', 'GL', 'KEYFRAME'],
    ['Viele Tänzer', 'webgl_animation_multiple', 'GL', 'CROWD'],
    ['Clips überblenden', 'webgl_animation_skinning_blending', 'GL', 'BLEND'],
    ['Morph-Mimik', 'webgl_animation_skinning_morph', 'GL', 'MORPH'],
    ['Inverse Kinematik', 'webgl_animation_skinning_ik', 'GL', 'IK RIG'],
    ['Physik-Charakter', 'physics_rapier_character_controller', 'GL', 'WALKER'],
  ] },
  { nr: '02', titel: 'Masse, Form & Welt', sub: 'Geometrie & Instancing', mode: 'comic', lekt: [
    ['Instancing', 'webgl_instancing_dynamic', 'GL', 'INSTANCING'],
    ['Formen-Galerie', 'webgl_geometries', 'GL', 'SHAPES'],
    ['Terrain aus Noise', 'webgl_geometry_terrain', 'GL', 'TERRAIN'],
    ['Terrain abtasten', 'webgl_geometry_terrain_raycast', 'GL', 'RAYCAST'],
    ['Log-Tiefenpuffer', 'webgl_camera_logarithmicdepthbuffer', 'GL', 'DEPTH'],
    ['TSL-Nebel', 'webgpu_custom_fog_background', 'GPU', 'FOG'],
  ] },
  { nr: '03', titel: 'Partikel, VFX & Look', sub: 'WebGPU / TSL', mode: 'mystical', lekt: [
    ['Attractor-Partikel', 'webgpu_tsl_compute_attractors_particles', 'GPU', 'ATTRACTOR'],
    ['Linked Particles', 'webgpu_tsl_vfx_linkedparticles', 'GPU', 'LINKED'],
    ['Tornado-VFX', 'webgpu_tsl_vfx_tornado', 'GPU', 'TORNADO'],
    ['TSL-Erde', 'webgpu_tsl_earth', 'GPU', 'EARTH'],
    ['Radial Blur', 'webgpu_postprocessing_radial_blur', 'GPU', 'BLUR'],
    ['Light Probes', 'webgl_lightprobes_complex', 'GL', 'PROBES'],
  ] },
  { nr: '04', titel: 'Interaktion & Steuerung', sub: 'Greifen, Fahren, Einbetten', mode: 'absurd', lekt: [
    ['Drag-Controls', 'misc_controls_drag', 'GL', 'DRAG'],
    ['Fly-Controls', 'misc_controls_fly', 'GL', 'FLY'],
    ['Physik-Basics', 'physics_rapier_basic', 'GL', 'PHYSICS'],
    ['Fahrzeug-Physik', 'physics_rapier_vehicle_controller', 'GL', 'VEHICLE'],
    ['YouTube in 3D', 'css3d_youtube', 'GL', 'VIDEO'],
    ['CSS3D + WebGL', 'css3d_mixed', 'GL', 'CSS3D'],
  ] },
  { nr: '05', titel: 'Klang', sub: 'Audio & Rhythmus', mode: 'tragic', lekt: [
    ['FFT-Visualizer', 'webaudio_visualizer', 'GL', 'FFT'],
    ['Räumlicher Klang', 'webaudio_orientation', 'GL', 'SPATIAL'],
    ['Timing & Rhythmus', 'webaudio_timing', 'GL', 'TIMING'],
    ['Klang-Sandbox', 'webaudio_sandbox', 'GL', 'SANDBOX'],
    ['GPU-Audio', 'webgpu_compute_audio', 'GPU', 'GPU AUDIO'],
    ['KFB Jukebox', 'kfb_jukebox', 'KFB', 'JUKEBOX'],
  ] },
];

export const HUB = { nr: '··', titel: 'Meta', sub: 'Übersicht & Werkstatt', mode: 'forbidden' };

// ============================================================================
// S71 · **EINE ZONE PRO DECK** (Georg, 26.7.)
// ----------------------------------------------------------------------------
// Bis hierher waren die fünf Farbzonen fünf three.js-Themen, und 28 der 31 Karten
// trugen ein FOTO einer Lektion, die nicht lief. Jetzt trägt die Akademie das, was
// KFB ist: **echte Deck-Karten**, geschnitten aus den Repo-PDFs (S61), im Sollformat
// (S62), mit der kanonischen Tuschekante.
//
// Warum eine Zone PRO DECK und nicht alles gemischt: die Farbe einer Zone ist die
// Orientierung in dieser Welt — man reißt ein Deck ab, nicht eine Sammlung. Gemischt
// wäre näher am Spielabend, aber ohne Ort. (Das Mischen kommt als Journey-Form, S72;
// dann mischt die REISE, nicht der Ort.)
//
// **Nur drei Decks, nicht vier** — aber der Grund ist seit S90a ein anderer.
// `sonic_slaughterhouse` war ausgeschlossen, weil es kein gemessenes `cardGrid` hatte und
// seine Karten falsch geschnitten worden wären. Das gilt nicht mehr: der Crop ist jetzt das
// stumpfe Seitenviertel (`card-registry.js` → `windowOf`), das Deck steht mit `yShift: 0` im
// Vertrag und würde sauber schneiden. Es fehlt also nur noch die ENTSCHEIDUNG, ob die Reise
// eine vierte Zone bekommt — das ist Georgs Sache, nicht die des Crops.
export const DECK_ZONES = [
  { packId: 'forget_utopia',    nr: '01', titel: 'Forget Utopia',    sub: 'Das Versprechen',   mode: 'tragic' },
  { packId: 'ignore_dystopia',  nr: '02', titel: 'Ignore Dystopia',  sub: 'Das Wegsehen',      mode: 'absurd' },
  { packId: 'embrace_protopia', nr: '03', titel: 'Embrace Protopia', sub: 'Das Machbare',      mode: 'heroic' },
];
// Die Werkstatt: was WIRKLICH läuft. Kein Foto einer Demo, sondern die Demo.
// (`css3d_youtube` ist der Steckplatz für die Video-Karte — der Player selbst ist der
// nächste Slice, weil ein fremdes Video sich nicht auf eine 3D-Fläche malen lässt.)
export const WORKSHOP = { nr: '04', titel: 'Werkstatt', sub: 'Was wirklich läuft', mode: 'comic', lekt: [
  ['Drag-Controls', 'misc_controls_drag', 'GL', 'DRAG'],
  ['Instancing', 'webgl_instancing_dynamic', 'GL', 'INSTANCING'],
  ['YouTube in 3D', 'css3d_youtube', 'GL', 'VIDEO'],
] };
export const CARDS_PER_ZONE = 6;

const modeOf = (key) => MODES.find((m) => m.key === key) || MODES[3];
const hex = (n) => '#' + n.toString(16).padStart(6, '0');

// 31 Lektionskarten als flache Liste, in Routen-Reihenfolge (Kapitel-weise, leicht → schwer).
// `mode`: 'kfb' (Standard seit S71) = drei Deck-Zonen + Werkstatt + Hub · 'lessons' = die alte
// three.js-Akademie mit 31 Lektionen (bleibt lauffähig, damit der Vergleich möglich ist).
export function academyDeck(mode) {
  if (mode !== 'lessons') return kfbDeck();
  return lessonDeck();
}

// S71 · Deck-Zonen. Die Karten sind hier noch LEER: Titel, Power und Lore kommen aus dem
// Repo-Manifest, und das kommt über das Netz. Ein Steckplatz mit Deck und Nummer ist alles,
// was der Ort im Vorhinein wissen kann — `academy.fillDeck()` legt den Inhalt nach.
function kfbDeck() {
  const out = [];
  DECK_ZONES.forEach((z, c) => {
    const m = modeOf(z.mode);
    for (let i = 0; i < CARDS_PER_ZONE; i++) {
      out.push({
        kind: 'kfbcard', chapter: c, index: i, route: c * CARDS_PER_ZONE + i,
        packId: z.packId, n: i + 1,          // Karte 1..6 des Decks (lineare Reise)
        nr: z.nr, chapterTitle: z.titel, chapterSub: z.sub,
        title: '…', glyph: '', example: null, tag: 'KFB',
        deck: z.titel,
        mode: z.mode, ink: m.ink, panel: m.panel, modeName: m.name,
        depth: i / (CARDS_PER_ZONE - 1), visited: false,
      });
    }
  });
  const wm = modeOf(WORKSHOP.mode), base = DECK_ZONES.length * CARDS_PER_ZONE;
  WORKSHOP.lekt.forEach((L, i) => {
    out.push({
      kind: 'lesson', chapter: DECK_ZONES.length, index: i, route: base + i,
      nr: WORKSHOP.nr, chapterTitle: WORKSHOP.titel, chapterSub: WORKSHOP.sub,
      title: L[0], example: L[1], tag: L[2], glyph: L[3],
      deck: 'Werkstatt · ' + WORKSHOP.titel,
      mode: WORKSHOP.mode, ink: wm.ink, panel: wm.panel, modeName: wm.name,
      depth: i / 2, visited: false,
    });
  });
  const hm = modeOf(HUB.mode);
  out.push({ kind: 'hub', chapter: DECK_ZONES.length + 1, index: 0, route: base + WORKSHOP.lekt.length,
             nr: HUB.nr, chapterTitle: HUB.titel, chapterSub: HUB.sub, title: 'Die Akademie', glyph: 'ACADEMY',
             example: 'kfb_academy_hub', tag: 'KFB', deck: 'Meta · Übersicht',
             mode: HUB.mode, ink: hm.ink, panel: hm.panel, modeName: hm.name, depth: 0.5, visited: false });
  return out;
}

function lessonDeck() {
  const out = [];
  CHAPTERS.forEach((ch, c) => {
    const m = modeOf(ch.mode);
    ch.lekt.forEach((L, i) => {
      out.push({
        kind: 'lesson', chapter: c, index: i, route: c * 6 + i,
        nr: ch.nr, chapterTitle: ch.titel, chapterSub: ch.sub,
        title: L[0], example: L[1], tag: L[2], glyph: L[3],
        deck: 'Kapitel ' + ch.nr + ' · ' + ch.titel,
        mode: ch.mode, ink: m.ink, panel: m.panel, modeName: m.name,
        depth: i / 5, visited: false,
      });
    });
  });
  const hm = modeOf(HUB.mode);
  out.push({ kind: 'hub', chapter: 5, index: 0, route: 30, nr: HUB.nr,
             chapterTitle: HUB.titel, chapterSub: HUB.sub, title: 'Die Akademie', glyph: 'ACADEMY',
             example: 'kfb_academy_hub', tag: 'KFB', deck: 'Meta · Übersicht',
             mode: HUB.mode, ink: hm.ink, panel: hm.panel, modeName: hm.name, depth: 0.5, visited: false });
  return out;
}

// Vorschaubild = der offizielle Screenshot des three.js-Beispiels. Das ist die dritte
// Sprosse der Fallback-Leiter (Zonenfarbe → Feld → Vorschau → LIVE) und stammt aus der
// Cube Academy, wo die Würfelflächen genau diese Bilder trugen. Eigene Stücke (kfb_*)
// haben keins — dort bleibt das Zonenfeld.
// S71 · Die Video-Karte. **Klein & sicher** (Georgs Wahl): das Blatt trägt das Vorschaubild,
// der echte Player liegt in der Detailansicht als Fenster darüber. Ein fremdes Video lässt sich
// nicht in eine Textur lesen — das ist eine Grenze des Browsers, kein Aufwand.
export const VIDEO = {
  id: 'MTCSwppblk0',
  list: 'PLXkttda-5VwFjNvC-pISnrRYw-mFyPZwF',
  index: 10,
};
export const videoThumb = (id) => 'https://i.ytimg.com/vi/' + (id || VIDEO.id) + '/hqdefault.jpg';
export const videoEmbed = (v) => {
  const V = v || VIDEO;
  return 'https://www.youtube-nocookie.com/embed/' + V.id
       + '?rel=0&modestbranding=1&playsinline=1'
       + (V.list ? '&list=' + V.list : '');
};

export function previewURL(example) {
  if (!example) return null;
  if (example === 'css3d_youtube') return videoThumb(VIDEO.id);
  if (example.indexOf('kfb_') === 0) return null;
  return 'https://threejs.org/examples/screenshots/' + example + '.jpg';
}

// ---------------------------------------------------------------- Tusche & Silhouette
// **Die Kartenkante ist `inkTail`, nicht `drawInkOutline`.** Das ist der Kern des Fehlers,
// den ich dreimal an den Parametern gesucht habe: `kfb-ink.js` hat ZWEI Familien.
//   · `inkChip`/`drawInkOutline` (`inked`): per-Punkt-Zufallsversatz + gestrichene Polylinie.
//     Richtig für Buttons, HUD-Chips, **Post-its** — und dort sah es auch immer richtig aus.
//   · `inkTail` (ink-tail.js, 1:1 aus rollercoaster-v11): **gefülltes Band** mit variabler
//     Halbbreite, Wobble = zwei langwellige Sinus über den Umfang mit Ecken-Fade, plus
//     diagonaler Taper. **Das ist die Karte.**
// Eine gestrichene Polylinie mit Punktrauschen kann nie wie ein Pinselband aussehen — egal,
// wie man jit und baseW dreht. Deshalb steht das hier so ausführlich.
//
// EINE normalisierte Kontur pro Seed, geteilt von Maske, Decal und Feld-Clip (sonst sieht man
// zwei Kanten und dazwischen Lücken). Die Form ist ohnehin auflösungsunabhängig: die Bandbreite
// ist `0.0069·min(W,H)` und der Wobble hängt am Umfangs-Parameter, nicht an der Punktzahl.
const CONTOUR_REF = 1024;
// Kanon aus v11, jetzt vollständig: v11 ruft `brushLoop(…, 1.4, 1.4 * 0.14)` — `wob` 1,4 UND
// `bow` 0,196. Bis 2026-07-25 stand hier `INK_BOW = 1.4` (siebenmal zu viel, gemessen Faktor 3,9
// in der Abweichung von der Geraden — „Bend statt ink"). Korrigiert nach SSOT Kanon v2.
const INK_WOB = 1.4, INK_BOW = 1.4 * 0.14;   // = 0,196
const _contours = {};
function normContour(seed) {
  if (_contours[seed]) return _contours[seed];
  const W = CONTOUR_REF, H = Math.round(W / SHEET_AR), m = 14;
  const pts = brushLoop(m, m, W - m, H - m, seed, INK_WOB, INK_BOW);
  _contours[seed] = pts.map((p) => [p[0] / W, p[1] / H]);
  return _contours[seed];
}
export function contourAt(seed, W, H) { return normContour(seed).map((p) => [p[0] * W, p[1] * H]); }
const pathOf = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); };

// Silhouette als alphaMap: weiß innen, schwarz außen. Das Band liegt MITTIG auf der Kontur,
// die Fläche darf also um die kleinste vorkommende Halbbreite nach außen — nicht mehr, sonst
// blitzt sie an den dünnen Stellen über die Tusche.
export function maskTexture(THREE, seed, W) {
  W = W || 512; const H = Math.round(W / SHEET_AR);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  const pts = contourAt(seed, W, H);
  const half = inkHalfWidth(pts, W, H, seed);
  g.fillStyle = '#fff'; g.strokeStyle = '#fff';
  g.lineJoin = 'round'; g.lineCap = 'round'; g.lineWidth = half.min * 1.6;
  pathOf(g, pts); g.fill(); g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace; t.anisotropy = 2;
  return t;
}

// Tusche-Decal: NUR das Band auf transparentem Grund, auf DERSELBEN Kontur wie die Maske.
export function decalTexture(THREE, seed, W) {
  W = W || 1536; const H = Math.round(W / SHEET_AR);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  inkTail(g, contourAt(seed, W, H), W, H, seed);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

// Post-it: der Besuch als Beweisstück, nicht als Punktestand. **S61: das Blatt ist GELB** — ein
// Post-it ist gelb, sonst ist es ein farbiges Quadrat. Die Zonenfarbe wandert auf den **Klebestreifen
// oben**, und der ist mit Absicht dort: eingeklappt sieht man nur diesen Streifen, also muss er die
// Identität tragen (Zonenfarbe + Glyph). Tusche-Chip bleibt kanonisch (kfb-ink HUD-Rezept:
// baseW 4 · wob .5 · jit 1.6), drei blasse Linien darunter für die Studiennotizen.
export const POSTIT_PAPER = '#f4dc63';
export function postitTexture(THREE, d, W, note, opts) {
  W = W || 256; const H = W;
  const O = opts || {};
  const paper = O.paper === 'zone' ? hex(d.panel) : (O.paper || POSTIT_PAPER);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const m = 10;
  INKAPI.inkChip(g, m, m, W - m, H - m, 100 + (d.route | 0) * 7,
    { fill: paper, uniform: true, baseW: 4, wob: 0.5, jit: 1.6, color: INK });
  g.save();
  g.beginPath(); g.rect(m, m, W - 2 * m, H - 2 * m); g.clip();
  // Klebestreifen: das sichtbare Band im eingeklappten Zustand. Zonenfarbe, leicht durchscheinend,
  // mit dem Glyph darin — damit der dünne Rand unter der Karte etwas AUSSAGT.
  const tapeH = H * 0.16;
  g.globalAlpha = 0.9; g.fillStyle = hex(d.panel);
  g.fillRect(m, m, W - 2 * m, tapeH);
  g.globalAlpha = 0.35; g.strokeStyle = hex(d.ink); g.lineWidth = Math.max(1, W * 0.005);
  g.beginPath(); g.moveTo(m, m + tapeH); g.lineTo(W - m, m + tapeH); g.stroke();
  g.globalAlpha = 0.92; g.fillStyle = hex(d.ink);
  g.textAlign = 'center';
  g.font = Math.round(H * 0.085) + 'px "Special Elite", monospace';
  // S61b · Ein **unbeschriebener** Zettel bleibt anonym: kein Glyph, kein „BESUCHT". Nur so können
  // sich alle Karten einer Zone EINE Textur teilen (31 Leinwände → 6). Den Namen bekommt der Zettel
  // in dem Moment, in dem er etwas zu sagen hat — beim Besuch oder beim ersten Wort.
  if (!O.blank) g.fillText(d.glyph || '', W / 2, m + tapeH * 0.72);
  g.textAlign = 'center';
  // S51 · **Steht eine Notiz da, ist SIE das Post-it.** „BESUCHT" ist nur der Zustand vor der
  // ersten Zeile — sobald jemand schreibt, zählt das Geschriebene, nicht die Tatsache des Besuchs.
  const txt = String(note == null ? '' : note).trim();
  g.globalAlpha = 0.26; g.strokeStyle = hex(d.ink); g.lineWidth = Math.max(1, W * 0.006);
  for (let i = 0; i < 3; i++) {
    const y = H * (0.52 + i * 0.14);
    g.beginPath(); g.moveTo(W * 0.16, y); g.lineTo(W * 0.84, y); g.stroke();
  }
  g.globalAlpha = 0.92;
  if (!txt && O.blank) {
    // leerer Zettel: nur Linien — er wartet.
  } else if (!txt) {
    g.font = Math.round(H * 0.115) + 'px "Special Elite", monospace';
    g.fillText('BESUCHT', W / 2, H * 0.4);
  } else {
    // Umbruch auf die Blattbreite, höchstens fünf Zeilen, danach eine Ellipse: ein Post-it ist
    // ein Zettel, kein Textfeld. Der volle Text lebt in der Journey und im Reisetagebuch.
    const fs = Math.round(H * 0.085);
    g.font = fs + 'px "Special Elite", monospace';
    g.textAlign = 'left';
    const maxW = W * 0.7, lines = [];
    for (const para of txt.split('\n')) {
      let line = '';
      for (const word of para.split(/\s+/)) {
        const t2 = line ? line + ' ' + word : word;
        if (g.measureText(t2).width > maxW && line) { lines.push(line); line = word; } else line = t2;
        if (lines.length >= 5) break;
      }
      if (lines.length < 5 && line) lines.push(line);
      if (lines.length >= 5) break;
    }
    if (lines.length === 5) lines[4] = lines[4].slice(0, Math.max(0, lines[4].length - 1)) + '…';
    lines.forEach((l, i) => g.fillText(l, W * 0.16, H * (0.36 + i * 0.14)));
  }
  g.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

// Zonenfeld: der Wartezustand, jetzt VOLLFLÄCHIG. Kein Kopfband, kein Fenster —
// Zonenfarbe, Kapitelnummer als Wasserzeichen, das Kurzwort (das in S32b zu Würfeln
// wird) und die Beispiel-Id. Auf die Kontur geclippt, damit kein Pixel über die
// Silhouette hinausläuft.
export function fieldTexture(THREE, d, W) {
  W = W || 512; const H = Math.round(W / SHEET_AR);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const pts = contourAt(seedFor(d.route), W, H);
  const ink = hex(d.ink), panel = hex(d.panel);
  g.save(); pathOf(g, pts); g.clip();
  g.fillStyle = panel; g.fillRect(0, 0, W, H);
  // Diagonale Schraffur in der Zonenfarbe — das Feld ist erkennbar ein Platzhalter
  g.globalAlpha = 0.13; g.strokeStyle = ink; g.lineWidth = W * 0.014;
  for (let x = -H; x < W + H; x += W * 0.055) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + H, H); g.stroke(); }
  g.globalAlpha = 1;
  // Kapitelnummer als Wasserzeichen
  g.fillStyle = 'rgba(25,20,16,.14)'; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  g.font = '700 ' + Math.round(H * 0.86) + 'px "Irish Grover", Georgia, serif';
  g.fillText(d.nr, W * 0.035, H * 0.93);
  // Kurzwort groß (wird in S32b zu Voxel-Glyphen über der Karte)
  g.fillStyle = 'rgba(25,20,16,.82)'; g.textAlign = 'center';
  let s = Math.round(H * 0.28);
  for (let i = 0; i < 12; i++) { g.font = '700 ' + s + 'px "Irish Grover", Georgia, serif'; if (g.measureText(d.glyph).width <= W * 0.8) break; s = Math.round(s * 0.92); }
  g.fillText(d.glyph, W / 2, H * 0.52);
  g.fillStyle = 'rgba(25,20,16,.55)';
  g.font = Math.round(H * 0.062) + 'px "Special Elite", monospace';
  g.fillText(d.example, W / 2, H * 0.68);
  g.fillStyle = ink;
  g.font = Math.round(H * 0.06) + 'px "Special Elite", monospace';
  g.fillText('[' + d.tag + ']', W / 2, H * 0.8);
  g.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

// Vorschau-Blatt: das Foto von threejs.org auf der Kartenkontur — **und eine Bauchbinde, die sagt,
// was man da sieht.** Grund (Georgs Befund, 26.7.): 28 der 31 Karten sind Fotos, drei sind Demos, und
// im Bild sah man den Unterschied nicht. Eine Karte, die nicht spielbar ist, darf nicht wie eine
// spielbare aussehen — zumal das Foto ein Screenshot aus einer anderen Version des Beispiels ist und
// deshalb ohnehin anders aussieht als die Demo. Lieber ehrlich beschriftet als heimlich falsch.
// `live` = die Lektion kann wirklich laufen (dann ist das Foto nur der Ladezustand).
// S71 · **Das KFB-Kartenblatt.** Die gemessene Zelle aus dem Deck-PDF, mittig im Sollformat
// (`fitCell`, S62 — nie `cover`, das schnitt Titel und LORE weg), auf die Kartenkontur geclippt.
// Kein Foto, keine Bauchbinde, keine Behauptung: das IST die Karte.
//
// **S74 · Und KEINE Tusche.** Hier stand ein `inkTail(...)`, und das war der Grund für Georgs
// „Outline dreifach, mit Lücken": die Kartenkante wird vom eigenen Decal-Quad gezeichnet, 0,16 u vor
// dem Blatt. Ein zweites Band im Blatt selbst liegt also perspektivisch versetzt daneben — zwei
// Striche, die an den Ecken auseinanderlaufen (und mit der Silhouetten-Maske ein dritter Rand).
// `previewSheet` hat es nie getan; dieses Blatt war die Ausnahme. Die Kante gehört dem Decal.
export function kfbCardSheet(THREE, crop, route, W) {
  W = W || 1024; const H = Math.round(W / SHEET_AR);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const pts = contourAt(seedFor(route), W, H);
  g.save(); pathOf(g, pts); g.clip();
  g.fillStyle = CREAM; g.fillRect(0, 0, W, H);
  const f = fitCell(crop.width, crop.height, W, H);
  g.drawImage(crop, f.x, f.y, f.w, f.h);
  // S82 · Der Fehlbetrag neben der Zelle bekommt ANSCHNITT (die äußersten Reihen der Karte werden
  // hinausgezogen) — kein gefärbtes Band, kein Gutter: das Papier läuft bis an die Tuschekante.
  lastPad = fillPad(g, crop, f, W, H);
  g.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

export function previewSheet(THREE, img, d, W, live) {
  W = W || 1024; const H = Math.round(W / SHEET_AR);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const pts = contourAt(seedFor(d.route), W, H);
  g.save(); pathOf(g, pts); g.clip();
  g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
  // Foto deckend einpassen (cover): das Seitenverhältnis der Screenshots ist nicht das Kartenmaß.
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  if (iw && ih) {
    const s = Math.max(W / iw, H / ih), dw = iw * s, dh = ih * s;
    g.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
  }
  // Bauchbinde unten: dunkles Band, Text in der Zonenfarbe. 13 % Höhe — genug zum Lesen auf dem
  // kleinen Blatt, wenig genug, dass das Bild das Blatt bleibt.
  const bh = H * 0.13;
  g.fillStyle = 'rgba(25,20,16,.78)';
  g.fillRect(0, H - bh, W, bh);
  g.fillStyle = live ? '#cfe8d4' : hex(d.panel);
  g.textAlign = 'left'; g.textBaseline = 'middle';
  g.font = Math.round(bh * 0.46) + 'px "Special Elite", monospace';
  g.fillText(live ? 'DEMO L\u00c4DT \u00b7 threejs.org' : 'FOTO \u00b7 threejs.org', W * 0.045, H - bh * 0.52);
  if (!live) {
    g.textAlign = 'right';
    g.fillStyle = 'rgba(247,240,221,.72)';
    g.fillText('nicht spielbar', W * 0.955, H - bh * 0.52);
  }
  g.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
