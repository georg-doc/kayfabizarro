// ============================================================================
// weltstimmungen.js — v5 · Slice H · verdant · molten · frost · bone
// ----------------------------------------------------------------------------
// ⚠ **Eine Stimmung liefert FARBTÖNE, nichts anderes.** Sättigung und Helligkeit kommen in jedem
// Fall aus den Werten der Quelle (`Globe.ts · createSurface`, `SkyPresets.ts`). Das ist keine
// Sparmaßnahme, sondern die Lehre des 30.8., in einer Zeile: **das Verwaschene war nie eine Farbe,
// es war Sättigung** — Land 0,21 gegen 0,63 bei der Quelle. Eine Stimmung, die an der Sättigung
// drehen darf, kann diesen Fehler wieder einbauen, und zwar viermal.
// `frost` und `bone` sind genau die zwei, die dazu verführen: „frostig" und „knochig" klingen nach
// blass. Sie sind hier NICHT blass, sie sind kalt bzw. dürr — das ist ein Farbton, keine Blässe.
// Deshalb prüft das Tor am Ende jeder Umschaltung nach, und deshalb ist es durchfallbar.
//
// Wo eine Stimmung wirkt (vier Eingänge, alle vorhanden, keiner neu erfunden):
//   1. Landpalette · vier Grundtöne + Berg + Schnee      → globe.setStimmung
//   2. Zonen-Fleckenfarben · vier Zonen × drei Töne       → globe.setStimmung
//   3. Ozean · Flachwasser und Tiefe                      → globe.setOceanColors
//   4. Spuren · Teppichband und Driftstaub                → trail.setTint · rauch.setTint
//   5. Atmosphäre · Himmelsverlauf, Nebel, Hüllenglut      → zyklus.setHimmelTon (VERSATZ in Grad)
//
// ⚠ **Die Lichter bleiben quellentreu — die Stimmung besitzt die ATMOSPHÄRE, die Quelle das LICHT.**
// Würde eine Stimmung die Lichtfarben mitdrehen, wäre bei `molten` auch das Pet rot und die Karte
// rot: die Stimmung färbte dann nicht die Welt, sondern das Bild. Der Nebel ist das Bindeglied — er
// trägt die Himmelsfarbe an das Land heran, ohne die Beleuchtung anzufassen.
//
// ⚠ **Die Gischt wird NICHT eingefärbt, und das ist eine Kategorienentscheidung.** Gischt ist
// LICHT auf Wasser, kein Material — sie hat ihre Farbe von der Lichtquelle, nicht von der Stimmung
// (Georg, 30.8.: „die gischt tagsüber muss wie bei TS sein (eher weiß)"). Eine molten-Welt hat
// heißes Land und heißes Licht, aber ihre Brandung bleibt Brandung.
// ============================================================================

/** Vier Stimmungen. Jede Zahl ist ein FARBTON in Grad.
 *  `land` gilt für die vier Tieflagen-Töne, `berg` und `schnee` für die Höhenbänder,
 *  `zonen` sind die vier Gegenden in der Reihenfolge plateau · spires · shatter · flatwater,
 *  `wasser` für Flachwasser und Tiefe, `spur` für Band und Staub. */
export const STIMMUNGEN = [
  {
    id: 'verdant', name: 'Verdant',
    // Der Ausgangszustand: die Töne, die am 30.8. gegen die Quelle geprüft wurden. Eine Stimmung
    // muss auch den Normalfall benennen können, sonst ist „zurück" nicht erreichbar.
    land: 99, berg: 45, schnee: 53, zonen: [42, 233, 148, 47], wasser: 191, spur: 45,
    // `himmel` ist ein VERSATZ in Grad, kein Zielton (Begründung in `day-night.js`): das Preset
    // weiß schon, wo die Sonne steht. `null` = unverändert; verdant IST der geprüfte Stand.
    himmel: null,
    was: 'der geprüfte Stand · Grün mit goldenen Flecken',
  },
  {
    id: 'molten', name: 'Molten',
    // E-36, der härteste Fall — deshalb zuerst. Rot-Orange über die ganze Höhe, und die Zonen
    // ziehen ins Glut-Rot bzw. Asche. Das Wasser bleibt Wasser (dunkel, kalt gegen das Land) —
    // ein rotes Meer wäre Lava, und Lava ist ein anderes Feature.
    land: 18, berg: 30, schnee: 38, zonen: [12, 352, 28, 40], wasser: 205, spur: 26,
    // +14° wärmer als das Preset. Klein, weil der Horizont schon warm IST — eine Glutwelt schiebt
    // ihn weiter ins Rot, sie ersetzt ihn nicht. Und der Himmel bleibt vom Landton (18°) getrennt:
    // gleiche Farbe oben und unten nimmt dem Horizont die Kante, und die Kante ist die Lesbarkeit.
    himmel: 14,
    was: 'Glut · rotes Land gegen kaltes Wasser',
  },
  {
    id: 'frost', name: 'Frost',
    // ⚠ Die Falle: „frostig" heißt nicht entsättigt. Blau-Türkis bei UNVERÄNDERTER Sättigung —
    // eiskalt und trotzdem farbig. Wer hier die Sättigung senkt, baut das Grau wieder ein.
    land: 196, berg: 205, schnee: 200, zonen: [188, 224, 176, 208], wasser: 186, spur: 198,
    // −20° kälter. Der Horizont behält die Sonne (die verschiebt keine Frostwelt), der Himmel wird
    // kalt. Ein absoluter Zielton hätte hier 157° gedreht und den Nebel rot gemacht.
    himmel: -20,
    was: 'Eis · kalt, aber nicht blass',
  },
  {
    id: 'bone', name: 'Bone',
    // Die zweite Falle, aus der anderen Richtung: „Knochen" klingt nach Weiß. Hier ist es dürr —
    // Ocker und Kalk im Farbton, die Helligkeit bleibt die der Quelle.
    land: 44, berg: 40, schnee: 48, zonen: [38, 26, 52, 34], wasser: 196, spur: 42,
    himmel: 8,   // +8° · dürr, nicht heiß
    was: 'Dürre · Ocker und Kalk',
  },
];

export function stimmungNach(id) {
  return STIMMUNGEN.find((s) => s.id === id) || STIMMUNGEN[0];
}
