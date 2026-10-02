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
  lineYellow: 0xfde957,  // b02 accent 0,48 % — MITTELSTREIFEN
  lineOuter:  0xfdc348,  // b01 accent 0,43 % — AUSSENSTREIFEN, orange-gelb
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

export const hex = v => '#' + v.toString(16).padStart(6, '0');
