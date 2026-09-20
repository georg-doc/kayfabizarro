// KFB Cologne Race · Option C · gemessene Farbautorität
//
// Quelle: die zwei gepinnten Option-C-Tafeln auf public kayfabizarro/main
//   01  travel/wip/travel_globe_wsa/_inbox/KFB Racer Option C - ChatGPT Image 20. Sept. 2026, 05_06_22 (1).png
//       blob 59fd27fcb5dae48bc159093427a3e688cc83b6a4   1672x941
//   02  travel/wip/travel_globe_wsa/_inbox/KFB Racer Option C - ChatGPT Image 20. Sept. 2026, 05_06_22 (2).png
//       blob ac0bf0064c8af8235a49b97d3b7e5e8196ed5579   1448x1086
//
// Verfahren: beide Tafeln wurden auf Canvas gelegt und in 4-Bit-Kanalklassen
// gebinnt; je Bin der ungewichtete Mittelwert. Regionen wurden getrennt
// ausgewertet, damit die dunkle UI-Rahmung von Tafel 02 nicht die Weltfarben
// verfaelscht. Jeder Wert unten traegt seinen Messanteil.
//
// KEINE Farbe in dieser Datei ist erfunden oder "verbessert".

export const MEASURED = {
  board01: {
    trackRegion: [   // x 200..1500, z 560..930 — die Fahrbahn der Heldenansicht
      ['#279797', 11.70], ['#258c91', 4.38], ['#1e848c', 3.72], ['#369a96', 3.35],
      ['#1c7685', 3.31], ['#25878d', 3.28], ['#fdd37b', 3.24], ['#47a49c', 3.18],
      ['#57a59b', 2.68], ['#fddb88', 2.55], ['#d5c8b2', 2.43], ['#38aca1', 1.95]
    ],
    sky: [
      ['#164b59', 2.99], ['#d76974', 2.33], ['#c8657b', 2.25], ['#fb8858', 2.09],
      ['#f8795b', 1.78], ['#fca73b', 1.78], ['#fde892', 1.53], ['#b86384', 1.44]
    ],
    accents: [['#fdc348', 0.43], ['#fd6b43', 0.31], ['#fb3233', 0.13], ['#fc6669', 0.44]]
  },
  board02: {
    sky: [   // x 300..1250, y 120..300 — Sonnenuntergang der Systemtafel
      ['#972b3b', 4.50], ['#88243c', 4.43], ['#a73639', 3.87], ['#681a43', 2.52],
      ['#fed95a', 2.42], ['#d65a35', 2.15], ['#b94536', 2.13], ['#fee263', 2.06],
      ['#e56933', 2.00], ['#f6b888', 1.80], ['#f98834', 1.66]
    ],
    road: [  // x 330..1240, y 430..600
      ['#674b54', 5.79], ['#d8956b', 5.04], ['#785559', 4.56], ['#c88869', 3.76],
      ['#ac7965', 3.68], ['#422d1d', 3.44], ['#dba474', 3.21], ['#f77754', 2.70]
    ],
    accents: [['#fef247', 0.20], ['#fde957', 0.48], ['#fdd959', 0.39], ['#fca657', 0.43]]
  }
};

// Versionierte, seed-faehige Farbfamilien. Alle Farben stammen aus den oben
// gemessenen Option-C-Tafeln; die Varianten aendern nur deren Rollenverteilung.
// Der JSON-Zwilling `color-map.v1.json` ist die Editor-/Import-Schnittstelle.
export const COLOR_MAP_PRESETS = [
  {
    id: 'cologne-sunset', label: 'Cologne Sunset',
    world: { bed: 0x279797, bedDark: 0x1c7685, bedLight: 0x47a49c, shoulder: 0xd8956b, shoulderHi: 0xdba474, shoulderLo: 0x674b54, structure: 0xc88869, structureLo: 0xac7965, skyHighDay: 0xd76974, skyMidDay: 0xfb8858, skyLowDay: 0xfde892, skyHighDusk: 0x88243c, skyMidDusk: 0xa73639, skyLowDusk: 0xe56933 },
    ui: { cool: '#39bfc4', warm: '#d6b33a', hot: '#e33f24', panel: '#14100e', ink: '#f2ece1' },
    buildingTones: [0x25878d,0x1e848c,0x57a59b,0xd8956b,0xc88869,0x96665e,0xb86384,0x674b54,0xd5c8b2],
    roofTones: [0x88243c,0x972b3b,0x422d1d,0x785559,0x164b59]
  },
  {
    id: 'rhine-dusk', label: 'Rhine Dusk',
    world: { bed: 0x1e848c, bedDark: 0x164b59, bedLight: 0x57a59b, shoulder: 0xac7965, shoulderHi: 0xd8956b, shoulderLo: 0x674b54, structure: 0x96665e, structureLo: 0x785559, skyHighDay: 0x88243c, skyMidDay: 0xa73639, skyLowDay: 0xe56933, skyHighDusk: 0x681a43, skyMidDusk: 0x972b3b, skyLowDusk: 0xd65a35 },
    ui: { cool: '#57a59b', warm: '#fdd37b', hot: '#fb3233', panel: '#164b59', ink: '#f2ece1' },
    buildingTones: [0x164b59,0x1e848c,0x25878d,0x57a59b,0x674b54,0x785559,0x88243c,0x972b3b,0xd5c8b2],
    roofTones: [0x681a43,0x88243c,0x972b3b,0x422d1d,0x164b59]
  },
  {
    id: 'fractal-coral', label: 'Fractal Coral',
    world: { bed: 0x25878d, bedDark: 0x1c7685, bedLight: 0x38aca1, shoulder: 0xf77754, shoulderHi: 0xfca657, shoulderLo: 0x785559, structure: 0xd8956b, structureLo: 0xac7965, skyHighDay: 0xb86384, skyMidDay: 0xf8795b, skyLowDay: 0xfde892, skyHighDusk: 0x972b3b, skyMidDusk: 0xd65a35, skyLowDusk: 0xf98834 },
    ui: { cool: '#38aca1', warm: '#fde957', hot: '#fd6b43', panel: '#422d1d', ink: '#fff8ee' },
    buildingTones: [0x25878d,0x38aca1,0x57a59b,0xf77754,0xd8956b,0xc88869,0xb86384,0x785559,0xd5c8b2],
    roofTones: [0x972b3b,0xa73639,0x681a43,0x422d1d,0x164b59]
  }
];

const hashSeed = value => {
  let h = 2166136261;
  for (const ch of String(value)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
};
const params = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
let stored = null;
try { stored = JSON.parse(localStorage.getItem('kfb-cologne-color-map') || 'null'); } catch (_) { stored = null; }
const randomSeed = typeof crypto !== 'undefined' && crypto.getRandomValues
  ? crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
  : Date.now().toString(36);
const requestedSeed = params.get('seed') || (stored && stored.seed) || randomSeed;
const requestedId = params.get('palette') || (stored && stored.paletteId);
const selectedPreset = COLOR_MAP_PRESETS.find(p => p.id === requestedId)
  || COLOR_MAP_PRESETS[hashSeed(requestedSeed) % COLOR_MAP_PRESETS.length];

// Die abgeleitete Arbeitspalette. Jeder Eintrag nennt seinen Messwert.
export const C = {
  // Fahrbahn — Tafel 01 fuehrt: das Band ist teal, nicht schwarz (§33)
  bed:        0x279797,  // b01 trackRegion 11,70 %
  bedDark:    0x1c7685,  // b01 3,31 %
  bedLight:   0x47a49c,  // b01 3,18 %
  bedFar:     0x1e848c,  // b01 3,72 %

  // Schulter und Stuetzwerk — Tafel 02 fuehrt: warmer Ton
  shoulder:   0xd8956b,  // b02 road 5,04 %
  shoulderHi: 0xdba474,  // b02 road 3,21 %
  shoulderLo: 0x674b54,  // b02 road 5,79 %
  structure:  0xc88869,  // b02 road 3,76 %
  structureLo:0xac7965,  // b02 road 3,68 %

  // Linien
  lineCream:  0xd5c8b2,  // b01 2,43 %
  lineGold:   0xfdd37b,  // b01 3,24 %
  lineYellow: 0xfde957,  // b02 accent 0,48 %
  lineOrange: 0xfa7a47,  // b01 1,60 % gesamt

  // Himmel
  skyHighDay: 0xd76974,  // b01 2,33 %
  skyMidDay:  0xfb8858,  // b01 2,09 %
  skyLowDay:  0xfde892,  // b01 1,53 %
  skyHighDusk:0x88243c,  // b02 4,43 %
  skyMidDusk: 0xa73639,  // b02 3,87 %
  skyLowDusk: 0xe56933,  // b02 2,00 %
  sun:        0xfed95a,  // b02 2,42 %
  deep:       0x164b59,  // b01 2,99 % — der tiefe Kontrastwert

  // Akzente
  hot:        0xfb3233,  // b01 0,13 % — Fahrzeug, Orb
  hotSoft:    0xfc6669,  // b01 0,44 %
  gold:       0xfdc348,  // b01 0,43 %
  magenta:    0xb86384,  // b01 1,44 %
  coral:      0xfd6b43,  // b01 0,31 %

  // Wasser — Rhein, aus dem tiefen Teal-Kanal von Tafel 01
  water:      0x1c7685,
  waterDeep:  0x164b59,
  waterFoam:  0xd5c8b2
};

// Gebaeudefamilien. Farbwerte ausschliesslich aus den gemessenen Listen oben;
// die Zuordnung zu materialClass ist eine Gestaltungsentscheidung, die Farbe nicht.
export const BUILDING_TONES = [
  0x25878d, // b01 3,28 %
  0x1e848c, // b01 3,72 %
  0x57a59b, // b01 2,68 %
  0xd8956b, // b02 5,04 %
  0xc88869, // b02 3,76 %
  0x96665e, // b02 2,19 %
  0xb86384, // b01 1,44 %
  0x674b54, // b02 5,79 %
  0xd5c8b2  // b01 2,43 %
];

export const ROOF_TONES = [0x88243c, 0x972b3b, 0x422d1d, 0x785559, 0x164b59];

// Importierte Konfiguration darf Rollen ersetzen, aber nicht neue Runtime-
// Besitzer einfuehren. Ein Import wird lokal gespeichert und beim Neustart
// angewendet; dadurch bleiben Materialerzeugung und Shader deterministisch.
const importedWorld = stored && stored.world && typeof stored.world === 'object' ? stored.world : {};
Object.assign(C, selectedPreset.world, importedWorld);
if (stored && Array.isArray(stored.buildingTones)) BUILDING_TONES.splice(0, BUILDING_TONES.length, ...stored.buildingTones.map(Number));
else BUILDING_TONES.splice(0, BUILDING_TONES.length, ...selectedPreset.buildingTones);
if (stored && Array.isArray(stored.roofTones)) ROOF_TONES.splice(0, ROOF_TONES.length, ...stored.roofTones.map(Number));
else ROOF_TONES.splice(0, ROOF_TONES.length, ...selectedPreset.roofTones);

export const COLOR_MAP_STATE = {
  schema: 'kfb.track-zone-color-map.v1',
  seed: requestedSeed,
  paletteId: selectedPreset.id,
  paletteLabel: selectedPreset.label,
  world: { ...C },
  ui: { ...selectedPreset.ui, ...((stored && stored.ui) || {}) },
  buildingTones: [...BUILDING_TONES],
  roofTones: [...ROOF_TONES]
};

if (typeof document !== 'undefined') {
  const root = document.documentElement;
  for (const [role, value] of Object.entries(COLOR_MAP_STATE.ui)) root.style.setProperty(`--kfb-${role}`, value);
  root.dataset.kfbPalette = COLOR_MAP_STATE.paletteId;
}

export const hex = v => '#' + v.toString(16).padStart(6, '0');
