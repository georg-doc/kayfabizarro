// ============================================================================
// sky-presets.js — Tageszeit-Presets, 1:1 aus tinyskies
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, client/src/game/SkyPresets.ts (gelesen 27.8.2026).
// Alle drei Presets vollständig, jeder Farbwert und jede Intensität unverändert.
//
// **Das war die größte Lücke meiner Fassung.** Ich hatte zwei Lichter frei erfunden
// (`DirectionalLight(0xfff3e0, 2.2)` + `HemisphereLight`). Die Quelle fährt SIEBEN Lichter je
// Preset — Sonne, zweite Sonne, zwei Fülllichter, Gegenlicht, Hemisphäre, Ambient — plus
// Himmelsverlauf, Nebel, Ozeanfarben, Rim, Wolkendeckkraft und Atmosphärenglut. Genau dieses
// Zusammenspiel macht aus einer facettierten Kugel einen Planeten; mit zwei Lichtern bleibt sie
// ein Polygonklumpen, egal wie fein das Mesh ist.
//
// `skyGradient` ist der Verlauf, den `Game.paintRadialSky` als Hintergrund malt: Stop 0 = Zenit,
// Stop 1 = Horizont.
// ============================================================================

export const DAY_PRESET = {
  skyGradient: [
    { stop: 0.0, color: '#1a4a82' }, { stop: 0.12, color: '#1e5c90' },
    { stop: 0.26, color: '#2a8cb4' }, { stop: 0.4, color: '#40c8dc' },
    { stop: 0.52, color: '#60d8e8' }, { stop: 0.62, color: '#80e8f4' },
    { stop: 0.72, color: '#b8f4f0' }, { stop: 0.78, color: '#e0f0d0' },
    { stop: 0.84, color: '#f2eca8' }, { stop: 0.91, color: '#fff078' },
    { stop: 1.0, color: '#fff050' },
  ],
  fogColor: 0x60ccde, fogNear: 15, fogFar: 40,
  hemiSkyColor: 0x80ccdd, hemiGroundColor: 0x66aa44, hemiIntensity: 1.75,
  ambientColor: 0xffffff, ambientIntensity: 1.25,
  sunColor: 0xfff0d0, sunIntensity: 5.0, sun2Color: 0xfff0d0, sun2Intensity: 3.25,
  fillColor: 0x90bbcc, fillIntensity: 1.75, fill2Color: 0x90bbcc, fill2Intensity: 1.5,
  backColor: 0xaaddee, backIntensity: 1.5,
  // ── S9b · petFill: das ACHTE Licht, jetzt benannt und mit Werten je Tageszeit ─────────────
  // ⚠ Es lag bis zum 29.8. anonym in `pet-lighting.js` (0,55 konstant, kaltblau) und war damit
  // der Teil des Lichthaushalts, den keine Tabelle kannte — nachts leuchtete es genauso hell wie
  // mittags. Es DARF bleiben (Georgs Auftrag S14: „wie bekommen wir Farbe und Textur des Pets
  // besser heraus?"), aber nur als Eintrag, den man ablesen und mitfahren kann.
  // Nicht in der Quelle — deshalb hier ausdrücklich als UNSERE Zeile markiert.
  petFillColor: 0xbcd4ff, petFillIntensity: 0.55,
  // ⚠ **Schaumfarbe harmonisiert — Georg, 30.8.: „könnte zur Farbpalette harmonisiert werden..?"**
  // Erst die Herkunft, weil er gefragt hat, ob sie von uns kommt: **nein.** Die orangen Wellen bei
  // Sonnenuntergang sind `SkyPresets.ts:132`, `oceanFoam: 0xff9944` — alle drei Ozean-Tripel waren
  // bei uns zeichengleich mit der Quelle. Auch `Globe.setOceanColors(shallow, deep, foam)` existiert
  // dort (Globe.ts 5329–5338, gerufen aus `Game.ts:6274`) — das Modul, das ich vorgestern als
  // Reparatur „erfunden" habe, steht in der Quelle unter demselben Namen. Unsere eine Abweichung
  // dort ist die Umfärb-SCHWELLE (0,012 linear statt exakter Hex-Gleichheit): die Quelle würde bei
  // laufender Blende praktisch jedes Bild 66 049 Vertices neu schreiben. Bewusst, dokumentiert.
  //
  // Harmonisiert nach derselben Regel wie das Land (§05q, „dritter Weg"): **Farbton KFB, Sättigung
  // und Helligkeit exakt aus der Quelle.** Damit bleibt die Gischt genau so kräftig und genau so
  // hell wie dort — nur ihre Familie ist unsere. Der Ton der Quelle steht in jeder Zeile daneben,
  // und `Ocean palette vs source` im Panel meldet ✗, wenn jemand an S oder L dreht.
  // ⚠ **Zurück auf den Wert der Quelle — Georg, 30.8.: „gelbe wellen stören jetzt aktuell".**
  // Mein Harmonisieren war hier ein KATEGORIENFEHLER, nicht ein Geschmacksfehler. Die Regel aus
  // §05q („Farbton KFB, Sättigung und Helligkeit aus der Quelle") gilt für **Material** — Boden,
  // Fels, Papier. **Gischt ist kein Material, sie ist LICHT auf Wasser.** Und Licht hat seine
  // Farbe nicht von der Marke, sondern von seiner Quelle: mittags weiß, abends von der Sonne
  // warm gefärbt. Creme auf blauem Wasser liest deshalb nicht als „KFB", sondern als schmutzig —
  // gelbe Wellen.
  // *Eine Regel, die für Materialien gilt, auf Licht anzuwenden, ist keine Konsequenz, sondern
  // eine Verwechslung von Kategorien.* Das Abendgold bleibt, weil dort die Sonne WIRKLICH warm
  // ist (die Quelle malt es aus demselben Grund orange); der Tag geht zurück auf Cyan-Weiß.
  oceanShallow: 0x2a8ca0, oceanDeep: 0x1560a0, oceanFoam: 0xb3ffff,   // = Quelle
  rimColor: 0xffeebb, cloudOpacity: 0.2,
  atmosphereGlow: 0xbbddcc, flareColorScale: [1.0, 1.0, 1.0], stars: false, aurora: false,
};

export const EVENING_PRESET = {
  skyGradient: [
    { stop: 0.0, color: '#0e0a2a' }, { stop: 0.15, color: '#1a1050' },
    { stop: 0.3, color: '#4a2078' }, { stop: 0.45, color: '#a03060' },
    { stop: 0.55, color: '#cc4840' }, { stop: 0.65, color: '#e07828' },
    { stop: 0.75, color: '#f0a030' }, { stop: 0.85, color: '#f8c858' },
    { stop: 1.0, color: '#fce0a0' },
  ],
  fogColor: 0xc07848, fogNear: 12, fogFar: 35,
  hemiSkyColor: 0xff9944, hemiGroundColor: 0x554422, hemiIntensity: 0.94,
  ambientColor: 0xffd8a0, ambientIntensity: 0.44,
  sunColor: 0xffaa40, sunIntensity: 3.5, sun2Color: 0xaa6640, sun2Intensity: 1.0,
  fillColor: 0xcc8855, fillIntensity: 0.875, fill2Color: 0x886644, fill2Intensity: 0.5,
  backColor: 0xaa7766, backIntensity: 0.625,
  petFillColor: 0xa8b8e8, petFillIntensity: 0.30,   // S9b · unsere Zeile, siehe DAY
  oceanShallow: 0x5a4a98, oceanDeep: 0x302868, oceanFoam: 0xffd144,   // Quelle 0xff9944 · KFB strand 45°: Gold statt Orange
  rimColor: 0xffaa30, cloudOpacity: 0.2,
  atmosphereGlow: 0xffcc44, flareColorScale: [1.0, 0.75, 0.4], stars: false, aurora: false,
};

export const NIGHT_PRESET = {
  skyGradient: [
    { stop: 0.0, color: '#020818' }, { stop: 0.12, color: '#050f22' },
    { stop: 0.25, color: '#08142a' }, { stop: 0.38, color: '#0c1834' },
    { stop: 0.5, color: '#121a3c' }, { stop: 0.62, color: '#241858' },
    { stop: 0.74, color: '#321c70' }, { stop: 0.86, color: '#4428a0' },
    { stop: 1.0, color: '#5a34c8' },
  ],
  fogColor: 0x08142c, fogNear: 10, fogFar: 30,
  hemiSkyColor: 0x283c80, hemiGroundColor: 0x10202c, hemiIntensity: 0.625,
  ambientColor: 0x7088bb, ambientIntensity: 0.375,
  sunColor: 0x102060, sunIntensity: 1.25, sun2Color: 0x0c1848, sun2Intensity: 0.625,
  fillColor: 0x304880, fillIntensity: 0.625, fill2Color: 0x283868, fill2Intensity: 0.44,
  backColor: 0x303860, backIntensity: 0.5,
  petFillColor: 0x7088cc, petFillIntensity: 0.18,   // S9b · unsere Zeile, siehe DAY
  oceanShallow: 0x081838, oceanDeep: 0x040c20, oceanFoam: 0x2030aa,   // Quelle 0x2050aa · KFB spires 233°: 11° von der Quelle
  /** Passt zum violetten Nachthimmel; treibt `globalRimColor` und den Globus-Rim. */
  rimColor: 0x9a7af0, cloudOpacity: 0.06,
  atmosphereGlow: 0x2850aa, flareColorScale: [0.3, 0.4, 0.8], stars: true, aurora: true,
};

const SKY_PRESETS = { day: DAY_PRESET, evening: EVENING_PRESET, night: NIGHT_PRESET };
export const TIMES_OF_DAY = ['day', 'evening', 'night'];
export function getSkyPreset(time) { return SKY_PRESETS[time] || DAY_PRESET; }

/** Himmelsverlauf 1:1 aus `Game.ts` Zeile 6147–6176 (`createSkyGradient` + `paintRadialSky`).
 *
 *  ⚠ **Hier lag mein Fehler, und er hat den halben „verwaschen"-Eindruck erzeugt.** Ich hatte die
 *  Leinwand als `EquirectangularReflectionMapping` angehängt. Bei Equirect ist die Bild**mitte**
 *  der Horizont und der Bild**rand** sind die Pole — der Zenitwert landete damit am Horizont und
 *  der Horizontwert am Zenit. Gemessen: Zenit rgb(57,33,127) statt rgb(2,8,24). Auf dem
 *  DAY-Screenshot füllte deshalb das Gelb (stop 1 = Horizontband) den ganzen oberen Himmel, und das
 *  Band, das den Boden verankert, fehlte.
 *
 *  Die Quelle setzt **kein Mapping**: eine `CanvasTexture` mit Standard-`UVMapping` wird von three
 *  als schirmfüllender Backdrop gezeichnet. Damit ist der Verlauf in BILDSCHIRM-Koordinaten —
 *  Mitte = stop 0, Ecken = stop 1. Das ist Absicht: der Globus füllt die Bildmitte, der Himmel
 *  liegt am Rand, und dort sitzt das Horizontband. Blickt man nach oben, kommt die Zenitfarbe aus
 *  der Mitte. Eine Bildschirm-Näherung, kein Skydome — und genau deshalb 512×512 und
 *  `outerR` bis zur ECKE (Zeile 6175), nicht bis zur Kante.
 *
 *  512×512 und `colorSpace = SRGBColorSpace` wörtlich aus Zeile 6148–6153. */
export function paintRadialSky(THREE, preset, size) {
  const n = size || 512;
  const cv = document.createElement('canvas');
  cv.width = cv.height = n;
  const ctx = cv.getContext('2d');
  const cx = n / 2, cy = n / 2;
  const outerR = Math.sqrt(cx * cx + cy * cy);
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
  for (const s of preset.skyGradient) gradient.addColorStop(s.stop, s.color);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, n, n);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;   // KEIN mapping — Standard-UVMapping macht daraus den Bildschirm-Backdrop
}

/** Der Lichtaufbau des Presets: sieben Lichter wie in `Game.applySkyPreset` — **plus EIN achtes,
 *  das uns gehört** (`petFill`, siehe DAY_PRESET).
 *
 *  ⚠ S9b · **Dies ist der EINZIGE Erzeuger von Weltlichtern.** Vorher legte `pet-lighting.js` eine
 *  weitere DirectionalLight direkt in die Szene — locally begründet, global unsichtbar, und damit
 *  der Anfang des Whack-a-Mole (§6j): eine Summe, die niemand besitzt, kann man nur raten.
 *  Jede Lampe trägt jetzt einen `name` — `light-budget` listet sie namentlich auf, und eine Zahl
 *  allein würde nicht sagen, WELCHE dazugekommen ist. */
export function buildLightRig(THREE, scene, preset) {
  const sun = new THREE.DirectionalLight(preset.sunColor, preset.sunIntensity);
  sun.position.set(-1.6, 1.1, 0.9).normalize().multiplyScalar(60);
  const sun2 = new THREE.DirectionalLight(preset.sun2Color, preset.sun2Intensity);
  sun2.position.set(1.2, 0.8, -1.4).normalize().multiplyScalar(60);
  const fill = new THREE.DirectionalLight(preset.fillColor, preset.fillIntensity);
  fill.position.set(1.4, -0.3, 1.1).normalize().multiplyScalar(60);
  const fill2 = new THREE.DirectionalLight(preset.fill2Color, preset.fill2Intensity);
  fill2.position.set(-1.1, -0.6, -1.2).normalize().multiplyScalar(60);
  const back = new THREE.DirectionalLight(preset.backColor, preset.backIntensity);
  back.position.set(0.2, -1.5, 0.4).normalize().multiplyScalar(60);
  const hemi = new THREE.HemisphereLight(preset.hemiSkyColor, preset.hemiGroundColor, preset.hemiIntensity);
  const amb = new THREE.AmbientLight(preset.ambientColor, preset.ambientIntensity);
  // Das achte: kaltes Gegenlicht, folgt dem Fahrzeug (der Runner ruft `petFill.position` nach).
  const petFill = new THREE.DirectionalLight(preset.petFillColor != null ? preset.petFillColor : 0xbcd4ff,
                                             preset.petFillIntensity != null ? preset.petFillIntensity : 0.55);
  petFill.castShadow = false;
  const rig = { sun, sun2, fill, fill2, back, hemi, amb, petFill };
  for (const k of Object.keys(rig)) { rig[k].name = k; scene.add(rig[k]); }
  scene.add(petFill.target);
  return rig;
}

/** Die Ozeanfarben der QUELLE, als Bezugspunkt für den Wächter im Panel.
 *  `SkyPresets.ts` 81–83 · 130–132 · 180–182 (Tree 2659a5cc987d, gelesen 30.8.).
 *  Ohne diese Tabelle wäre „harmonisiert, aber nicht verblasst" eine Behauptung — und beim nächsten
 *  Abdunkeln würde niemand die Gischt als Ursache verdächtigen. */
// ⚠ **Die Schlüssel heißen `day` · `evening` · `night` — nicht `sunset`.**
// Die erste Fassung dieser Tabelle stand auf `sunset`, weil die QUELLE ihr Preset so nennt. Unsere
// Tageszeiten heißen seit v3 `evening` (siehe `TIMES_OF_DAY`). Der Wächter im Panel hat daraufhin
// `getSkyPreset('sunset')` gefragt, `undefined` bekommen — und das Abend-Original gegen das
// TAG-Preset verglichen. Ergebnis: `✗ sunset.oceanFoam drifted · Δ 0.234 / 0.196`.
// **Der Wächter war rot, die Palette war richtig.** Und das ist die schlimmere Sorte Fehler: ein
// Instrument, das dauerhaft ✗ meldet, erzieht dazu, es zu überlesen — und dann fängt es den echten
// Fall nicht mehr. Deshalb steht die Namenskarte hier und nicht in einem Kommentar im Panel.
// *Ein falscher Schlüssel darf niemals als Messwert erscheinen.* Der Wächter meldet ab jetzt
// ausdrücklich `MISSING KEY`, wenn ein Name nicht auflöst.
export const OZEAN_QUELLE = {
  day:     { oceanShallow: 0x2a8ca0, oceanDeep: 0x1560a0, oceanFoam: 0xb3ffff },
  evening: { oceanShallow: 0x5a4a98, oceanDeep: 0x302868, oceanFoam: 0xff9944 },   // Quelle nennt es `sunset`
  night:   { oceanShallow: 0x081838, oceanDeep: 0x040c20, oceanFoam: 0x2050aa },
};
