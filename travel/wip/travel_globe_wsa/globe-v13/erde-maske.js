// ============================================================================
// erde-maske.js — v10 · Die Erde als Schablone über dem Zufallsfeld
// ----------------------------------------------------------------------------
// **Georg, 2.9.: „als Vorlage habe ich an die ,reale‘ Erde gedacht."**
//
// Das Feld dieses Projekts erfindet seine Kontinente bisher vollständig aus Zufall
// (`simplex-noise.js`). Eine erkennbare Erde kann daraus nicht entstehen — nicht mit besseren
// Zahlen, nicht mit mehr Oktaven: gewürfelte Küsten sehen nie nach Afrika aus.
// Also kommt die Form von außen und die Feinheit von innen:
//   · **Die Erde gibt die Kontinente.** Ein grobes Land/Meer-Gitter, 5° je Zelle (72 × 36).
//   · **Der Zufall zerfranst die Küsten.** Das vorhandene Rauschen bleibt unverändert und
//     entscheidet weiter alles unterhalb von 5° — Buchten, Inseln, Landzungen.
// Was man sieht, ist damit wiedererkennbar, aber keine Fotokopie: dieselbe Welt zweimal
// gebaut ist identisch, zwei verschiedene Seeds geben zwei verschiedene Erden.
//
// ⚠ **Warum ein Gitter und keine Bilddatei.** Eine Bildmaske müsste geladen, dekodiert und
// gepixelt werden, bevor das erste Dreieck steht — und das Terrain wird an mindestens sechs
// Stellen synchron abgefragt (Mesh, Flugphysik, Zonen, Props, Schatten, Karten). Ein Feld, das
// erst nach einem `await` antwortet, wäre in jeder dieser Stellen ein neuer Sonderfall.
// Das Gitter hier ist Text, ist sofort da und ist lesbar: eine Zeile je 5°-Breitenband,
// darin die Spaltenbereiche, die Land sind. Wer Grönland verschieben will, ändert eine Zahl.
// Eine echte Bildvorlage kann später DIESES Gitter füllen — der Eingang bleibt derselbe.
//
// **Auflösung, ehrlich benannt:** 5° sind am Äquator etwa 550 km. Das Gitter kennt Grönland,
// Madagaskar und Neuseeland; es kennt nicht Sizilien, Kreta oder die Ostsee. Genau dafür ist
// die Zerfransung da — und deshalb ist „Erd-Treue" ein Regler und keine Wahrheit.
// ============================================================================

/** Land je 5°-Breitenband, von Nord (87,5°) nach Süd (−87,5°).
 *  Spalte c meint die Länge −180 + 5·c, also c = 0 bei der Datumsgrenze, c = 36 bei Greenwich.
 *  Bereiche dürfen sich überlappen; leer heißt: dieses Band ist ganz Wasser. */
const BAENDER = [
  '',                                    // 87,5 N — Arktis ist Eis, nicht Land
  '27-31',                               // 82,5   Nordspitze Grönlands
  '15-20,24-31,39-40',                   // 77,5   Kanadische Arktis · Grönland · Spitzbergen
  '4-7,12-18,25-31,55-58',               // 72,5   Nordküsten — dazwischen Barents- und Karasee
  '3-16,20-23,25-31,38-43,46-49,52-62',  // 67,5   Foxe-Becken · Baffinbai · Ob-Bucht
  '3-17,20-23,26-27,31-33,37-39,42-49,53-62', // 62,5 Hudson Bay · Bottnien · Ob · Beringsee
  '4-7,10-16,20-24,28-30,34-35,37-39,43-60,67-68', // 57,5 Hudson Bay · Ostsee · Ochotskisches Meer
  '10-16,20-25,34-36,37-64,67-68',       // 52,5   James Bay · Kamtschatka steht für sich
  '11-25,35-64',                         // 47,5
  '11-22,34-42,45-46,48-62,64-65',       // 42,5   Schwarzes und Kaspisches Meer · Japan
  '12-21,34-36,38-39,42-44,46-58,61-64', // 37,5   Mittelmeer · Ägäis · Korea · Japan
  '13-20,34-43,46-58,62-63',             // 32,5   Nordafrika · Rotes Meer · China
  '13-17,19-20,33-42,44-56,58-60',       // 27,5   Sahara · Rotes Meer · Golf von Bengalen
  '15-17,19-21,33-58,60-60',             // 22,5   Kuba · Sahel · Taiwan
  '18-23,33-43,50-53,55-58,60-60',       // 17,5   Karibik · Westafrika · Indien · Hinterindien
  '18-19,21-24,33-44,51-52,55-58,60-61', // 12,5
  '19-24,33-43,51-52,56-58,60-61',       //  7,5   Panama · Guinea-Küste · Philippinen
  '20-26,38-44,56-60',                   //  2,5   Äquator: Amazonas · Gabun · Borneo
  '20-29,38-44,56-58,60-61,63-66',       // −2,5   Brasilien · Kongo · Borneo · Neuguinea
  '20-29,38-44,57-58,61-62,64-67',       // −7,5   Javasee · Bandasee
  '21-28,38-44,45-46,60-65',             // −12,5  Madagaskar · Nordaustralien
  '22-28,38-43,45-46,60-65',             // −17,5
  '22-28,38-43,45-46,59-66',             // −22,5
  '22-26,39-42,59-66',                   // −27,5
  '21-25,40-41,59-66',                   // −32,5  Kap der Guten Hoffnung
  '21-24,63-65,70-71',                   // −37,5  Neuseeland
  '21-23,65-65,69-71',                   // −42,5  Tasmanien
  '21-23',                               // −47,5
  '21-22',                               // −52,5
  '22-22',                               // −57,5  Kap Hoorn
  '23-24',                               // −62,5  Antarktische Halbinsel
  '24-25,38-46,52-58,64-70',             // −67,5  nur was die Antarktis wirklich nach Norden schiebt
  '0-12,20-30,36-71',                    // −72,5  Ross- und Weddellmeer
  '0-71', '0-71', '0-71',                // −77,5 … −87,5  Antarktis
];

// ⚠ **Nachtrag 2.9., nach der Abnahme — die erste Tabelle war systematisch verschoben.**
// Gemessen an den Pixeln der Werkbank-Karte: die Südatlantik-Lücke war bei 10° Süd 11° breit
// statt 44° — Afrika und Südamerika hingen zusammen, und mit Zerfransung verschmolzen sie
// stellenweise zu einer Landmasse. Der flächengewichtete Landanteil lag bei 44 % statt 29 %.
// **Zwei Vorzeichenfehler meinerseits, nicht einer:** Südamerika stand zehn Grad zu weit OSTEN
// (Brasiliens Ostspitze liegt bei 35° W, also Spalte 29 — ich hatte 31 und 32), Afrika
// fünfundzwanzig Grad zu weit WESTEN (die Küste am Golf von Guinea liegt bei 9° O, also Spalte
// 38 — ich hatte 32 und 33). Beides zusammen hat den halben Ozean aufgefressen.
// Dazu waren mehrere Nordbänder durchgehend Land, wo Barentssee, Nordatlantik und Pazifik liegen.
// **Die Lehre steht im Modulkopf und ist hier eingelöst:** eine Handtabelle ist Text, also
// prüfbar — aber nur, wenn jemand nachmisst. Die Werkbank IST dieses Messgerät: der Landanteil
// oben rechts ist gewichtet gerechnet und muss gegen die 29 % der echten Erde stehen können.

const SPALTEN = 72, ZEILEN = 36;

const GITTER = (() => {
  const g = new Float32Array(SPALTEN * ZEILEN);
  for (let r = 0; r < ZEILEN; r++) {
    const zeile = BAENDER[r] || '';
    if (!zeile) continue;
    for (const teil of zeile.split(',')) {
      const [a, b] = teil.split('-');
      const von = Math.max(0, +a), bis = Math.min(SPALTEN - 1, +b);
      for (let c = von; c <= bis; c++) g[r * SPALTEN + c] = 1;
    }
  }
  return g;
})();

const zelle = (c, r) => {
  const rr = r < 0 ? 0 : (r > ZEILEN - 1 ? ZEILEN - 1 : r);   // Pole klemmen
  const cc = ((c % SPALTEN) + SPALTEN) % SPALTEN;             // Länge läuft rundum
  return GITTER[rr * SPALTEN + cc];
};

/**
 * Landanteil an einer Richtung, weich zwischen den Zellen gemischt.
 * Rückgabe 0…1 — nicht „Land ja/nein": zwischen zwei Zellen liegt die Küste, und genau dort
 * soll das Rauschen entscheiden dürfen. Ein harter Sprung würde 5°-Treppen in die Welt zeichnen.
 * @param {number} drehung  Längengrad-Versatz in Grad. Damit kann dieselbe Erde woanders liegen,
 *                          ohne dass das Gitter angefasst wird (Georg: „Props dürfen wandern").
 */
export function erdeLand(nx, ny, nz, drehung = 0) {
  const lat = Math.asin(Math.max(-1, Math.min(1, ny))) * 180 / Math.PI;
  let lon = Math.atan2(nz, nx) * 180 / Math.PI + drehung;
  lon = ((lon + 180) % 360 + 360) % 360 - 180;
  const fc = (lon + 180) / 5 - 0.5;
  const fr = (90 - lat) / 5 - 0.5;
  const c0 = Math.floor(fc), r0 = Math.floor(fr);
  const tc = fc - c0, tr = fr - r0;
  const a = zelle(c0, r0), b = zelle(c0 + 1, r0);
  const d = zelle(c0, r0 + 1), e = zelle(c0 + 1, r0 + 1);
  return (a + (b - a) * tc) * (1 - tr) + (d + (e - d) * tc) * tr;
}

/**
 * Der Beitrag der Erde zum Feldwert — genau die Form, die `setKontinentHook` erwartet.
 *
 * ⚠ **Warum ein ZUSCHLAG auf den Wert und kein Schalter.** Das Feld hat eine Schwelle
 * (`threshold`), an der aus Wasser Land wird, und alle Leser kennen nur diese eine Schwelle.
 * Wer stattdessen „hier ist Land" erzwingt, hat zwei Wahrheiten im selben Feld — Fehlerklasse 1.
 * Ein Zuschlag hebt den Boden dort an, wo die Erde Land will, und senkt ihn, wo sie Meer will;
 * die Schwelle bleibt der eine Richter, und das Rauschen behält an der Küste das letzte Wort.
 *
 * @param {number} treue   0 = reiner Zufall (die Erde ist aus), 1 = die Erde setzt sich fast
 *                         überall durch. Dazwischen liegt das Interessante.
 * @param {number} drehung Längengrad-Versatz in Grad.
 */
export function erdeZuschlag(treue = 0.7, drehung = 0) {
  if (treue <= 0) return null;
  // ⚠ **Nachtrag 2.9., zweite Abnahme: der symmetrische Zuschlag hat den HÖHENVERTRAG gebrochen.**
  // `terrainElevationFromValue` verspricht 0…1. Gemessen kam bei voller Erd-Treue 2,28 heraus —
  // und das ist kein Schönheitsfehler: `natur-marken.js` setzt Vulkane bei `elevation > 0.4`,
  // Mesh-Höhe und Biomfarben rechnen ebenso mit 0…1. Eine so exportierte Welt hätte im Globus
  // 2,3-fach überhöhte Berge und verschobene Prop-Schwellen gehabt.
  // **Der Denkfehler war die Symmetrie.** Ein Zuschlag, der Land genauso stark hebt wie er Meer
  // senkt, muss riesig sein, damit die Kontinente sich durchsetzen — und hebt dann die Gipfel mit.
  // Dabei braucht Land nur so viel Schub, dass es die Schwelle überhaupt überschreitet; alles
  // darüber ist Gebirge, das die Erde gar nicht meint. Also ZWEI Beträge statt einem:
  //   · nach oben wenig — gerade genug, damit Sahara und Sibirien trocken werden,
  //   · nach unten viel — der Ozean soll Ozean sein, auch wo das Rauschen Land würfelt.
  // Die Form kommt damit aus der Senkung, nicht aus der Hebung, und die Gipfel bleiben, wo sie
  // waren. (Die weiche Sättigung gegen 1 sitzt in `simplex-noise.js` — sie fängt den Rest ab.)
  // Der Betrag der Hebung stammt aus der Messung, nicht aus dem Gefühl: bei 0,45 fielen bei der
  // Voreinstellung (72 %) Sahara und Indien ins Wasser — Wüsteninneres kam nicht über die Schwelle.
  // Ich hatte zu vorsichtig gedeckelt, weil ich den Höhenvertrag von HIER aus schützen wollte;
  // das tut inzwischen die weiche Decke in `simplex-noise.js`, und zwar dort, wo sie hingehört.
  // Zwei Sicherungen für dieselbe Sache sind eine zu viel — diese hier darf lockerlassen.
  const hebung = 0.70 * treue;
  const senkung = 0.40 * treue + 1.70 * treue * treue * treue;
  return (nx, ny, nz, schwelle) => {
    // ⚠ **Der Zuschlag rechnet in SCHWELLEN-ABSTÄNDEN, nicht in absoluten Feldwerten.**
    // Jede Geländesorte hat ihre eigene Schwelle: pangaea −0,15, default 0, archipelago 0,20,
    // waterworld 0,35. Ein fester Betrag bedeutet an jeder davon etwas anderes — er ist für
    // pangaea eine Senkung tief unter Wasser und für waterworld gerade genug. Gemessen kippte
    // damit die Rangfolge: das größte Deck (pangaea) machte die wasserreichste Welt, obwohl in
    // der Oberfläche „großes Deck → ein Kontinent" stand. Die Sorte trat nicht zurück, sie wurde
    // umgedreht — und die Werkbank behauptete dabei weiter das Gegenteil.
    // Jetzt bekommt jede Sorte denselben ANTEIL ihres eigenen Spielraums: nach oben, was
    // zwischen Schwelle und 1 liegt, nach unten, was zwischen Schwelle und −1 liegt. Ohne
    // Vorlage ändert sich nichts, und bei `default` (Schwelle 0) sind die Beträge dieselben
    // wie zuvor — die Eichung von gestern bleibt gültig.
    // ⚠ **Die Mitte liegt bei 0,62 und nicht bei 0,5 — das ist die Raster-Korrektur.**
    // Ein 5°-Gitter, das jede Zelle mit Küste ganz zu Land erklärt, überzeichnet Land
    // systematisch: dieselbe Erde, so gerastert, kommt auf 38 % statt 29 %. Der Fehler steckt
    // in JEDER Küstenzelle, nicht in einzelnen Bändern — also wird er auch dort korrigiert und
    // nicht durch Wegstreichen echter Geografie. Die Mitte höher zu legen trägt eine halbe
    // Zellbreite von jeder Küste ab, gleichmäßig rundum.
    const t = schwelle || 0;
    const m = erdeLand(nx, ny, nz, drehung), mitte = 0.62;
    return m >= mitte ? (m - mitte) / (1 - mitte) * hebung * (1 - t)
                      : -(mitte - m) / mitte * senkung * (1 + t);
  };
}

/** Für die Werkbank: das rohe Gitter, damit die Vorschau die Vorlage zeichnen kann. */
export const erdeGitter = { spalten: SPALTEN, zeilen: ZEILEN, werte: GITTER };
