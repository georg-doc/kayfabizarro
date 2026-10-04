/* KFB WhackMan v1 · Dachgärten
   Georgs Vorgabe: die Blockdächer bündig, IMMER mit abgerundeten Ecken, darauf Tiny-Treats-Gras
   als Mini-Park. Keine hohen Bäume im Blickfeld — dafür viele kleine Requisiten, in Dreiergruppen
   und semantisch zusammengehörig verteilt, so dass die Draufsicht einen organischen Garten zeigt.

   Die abgerundeten Ecken sind kein Nachbau: der Park bringt einen 3×3-SLICE-SATZ mit
   (\`floor_grass_sliced_A…I\`, gemessene Kachel 2,00). A/C/G/I sind die Ecken, B/D/F/H die Kanten,
   E die Mitte. Wer je Teilkachel prüft, welche Nachbarn fehlen, bekommt die Rundung geschenkt —
   genau dafür ist der Satz gemacht.

   Ein Modul (4,00) sind also VIER Teilkacheln. Der Rand wird auf dem doppelt so feinen Raster
   bestimmt, nicht auf dem Zellraster: sonst rundet nur die Zelle, nicht das Blockfeld. */

/* Slice-Wahl aus den vier Nachbarn. Namen wie im Pack, Reihenfolge wie im 3×3-Blatt. */
const SLICE = [
  ['A', 'B', 'C'],
  ['D', 'E', 'F'],
  ['G', 'H', 'I']
];
export function sliceFor(openN, openE, openS, openW) {
  const row = openN ? 0 : openS ? 2 : 1;
  const col = openW ? 0 : openE ? 2 : 1;
  return 'floor_grass_sliced_' + SLICE[row][col];
}

/* Requisiten in semantischen Gruppen. Die Harmonie steckt in der Zusammengehörigkeit — Blumen
   zu Blumen, Sitzen zu Sitzen — die Lebendigkeit in der Streuung über die ganze Zelle.

   HÖHENGRENZE, gemessen statt geraten: „keine hohen Bäume im FOV" ist eine Aussage über HÖHE,
   nicht über Namen. Ich hatte tree und tree_large per Namen ausgeschlossen und street_lantern
   ungeprüft aufgenommen — gemessen ist die 0,94 × 4,50 × 0,94 und damit höher als der Baum
   (3,62), höher als die Wandkrone (4,00) und höher als die Verfolgerkamera. Drei davon ragten
   quer durchs Bild. Jetzt entscheidet die Messung: MAX_HOEHE als Anteil der Wandhöhe, alles
   darüber fliegt raus und steht im Bericht. */
export const MAX_HOEHE = 0.375;      // × Wandhöhe, also 1,50 bei WALL_H 4

export const GRUPPEN = [
  { id: 'blumenbeet', teile: ['flower_A', 'flower_B', 'flower_A', 'grass_A'], dreh: true },
  { id: 'wiese', teile: ['grass_A', 'grass_B', 'grass_A', 'flower_B'], dreh: true },
  { id: 'buschgruppe', teile: ['bush', 'bush_large', 'bush'], dreh: true },
  { id: 'rastplatz', teile: ['bench', 'trashcan', 'grass_B'], dreh: false },
  { id: 'steinweg', teile: ['cobble_stones', 'cobble_stones_large', 'cobble_stones'], dreh: true },
  { id: 'vogelwiese', teile: ['bird', 'grass_A', 'flower_A', 'grass_B'], dreh: true },
  { id: 'heckenkante', teile: ['hedge_straight', 'bush', 'grass_A'], dreh: false }
];

/* Was von OBEN liest, ist nicht dasselbe wie was da ist. Gemessen auf 562 Requisiten: 83 % waren
   Bodendecker — grass_A/B grün auf grün, flower_A/B praktisch flach (0,11–0,14 hoch). Sichtbar
   blieb einzig cobble_stones, weil hell und gross, und damit zeigte jedes Dach genau einen
   Kiesfleck. Mehr Masse hat die Lesart nicht verbessert, nur die Zahl.

   Also wird nach SILHOUETTE getrennt, und die Trennung ist eine Messung: alles ab SILHOUETTE_MIN
   Höhe wirft von oben einen erkennbaren Umriss. */
export const SILHOUETTE_MIN = 0.5;

/* Träger der Lesart. Alle gemessen zwischen 0,54 und 1,50 — unter der Höhengrenze, also ohne
   Konflikt mit „keine hohen Dinge im Blickfeld". */
export const SILHOUETTEN = ['bush', 'bush_large', 'bench', 'trashcan', 'hedge_straight'];

/* Grundschicht. Flach und billig, aber NICHT die Hauptmasse — sie füllt zwischen den Umrissen. */
export const BODENDECKER = ['grass_A', 'grass_B', 'flower_A', 'flower_B'];

/* Kies ist der einzige Bodendecker mit Kontrast und dominiert das Bild, wenn er überall liegt.
   Deshalb Akzent statt Standard: nur auf jeder fünften Zelle. */
export const AKZENT = 'cobble_stones';
export const AKZENT_ANTEIL = 0.2;

/* An die Spielfeldränder gehört, was hoch ist — Georgs Trennung. Durch den Rahmenring muss
   niemand hindurchsehen, dort darf es ragen. */
export const RANDHOHES = ['tree', 'tree_large', 'street_lantern', 'fountain'];

export function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}

/* Zusammenhängende Blockfelder. Ein Garten gehört zu einem FELD, nicht zu einer Zelle —
   sonst sitzt auf jedem Quadrat dieselbe Dreiergruppe und nichts wirkt gewachsen. */
export function blockRegions(roles) {
  const isBlock = (x, y) => x >= 0 && y >= 0 && x < roles.w && y < roles.h && !roles.cells.has(x + ',' + y);
  const seen = new Set(), out = [];
  for (let y = 0; y < roles.h; y++) {
    for (let x = 0; x < roles.w; x++) {
      if (!isBlock(x, y) || seen.has(x + ',' + y)) continue;
      const list = [], q = [[x, y]];
      seen.add(x + ',' + y);
      while (q.length) {
        const [cx, cy] = q.pop();
        list.push([cx, cy]);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = cx + dx, ny = cy + dy;
          if (!isBlock(nx, ny) || seen.has(nx + ',' + ny)) continue;
          seen.add(nx + ',' + ny);
          q.push([nx, ny]);
        }
      }
      out.push(list);
    }
  }
  return { regions: out, isBlock };
}
