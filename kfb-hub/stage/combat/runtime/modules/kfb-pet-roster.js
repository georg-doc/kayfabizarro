/* kfb-pet-roster.js · die 24 KFB Cube-Pets als Kampf-Roster (v1, 04.09.2026)
 *
 * HERKUNFT
 * `pet-library.v6.js` → `SETS.animals`: `media/3D_Assets/GLB_cube-pets/animal-{id}.glb`,
 * 24 Namen. Dasselbe Set, das das Pet Studio bespielt.
 *
 * 04.09.2026 · DIE SCHICHT IST DA. Hier stand „hier kommen die Modelle NACKT herein
 * — der Studio-Look ist eine eigene Schicht". Das war ehrlich und trotzdem ein
 * Fehler im Bild: Georg sah zwei verschiedene Pets. `modules/kfb-pet-look.js`
 * schneidet jetzt Kenneys flache Augen heraus und setzt Augen-Rig, Mund und den
 * abgenommenen Clay-Look aus `pet-LIBRARY.json` darauf. Dieses Modul bleibt, was es
 * war: Maße, Clips, Blickachse. Das GESICHT gehört nicht hierher.
 *
 * ═══ GEMESSEN, NICHT GEGLAUBT (qa/cubepets-inventur.html, 04.09.2026) ═════════
 *   24/24 laden · KEINE geskinnten Meshes: 3–7 benannte Teile je Pet, knoten-animiert
 *   422–951 Dreiecke · Hoehen 1,43–2,02 u · Breiten 1,33–2,34 u (mehrere sind BREITER
 *   als hoch — das entscheidet die Trefferkapsel, siehe `w`)
 *   ALLE 24 tragen denselben 8-Clip-Satz:
 *     static · idle · walk · run · eat · dance · gesture-positive · gesture-negative
 *
 * ═══ WAS FEHLT, UND WAS AN SEINE STELLE TRITT ════════════════════════════════
 * Kein `attack`, kein `hit`, kein `death`, kein `fly`. Das ist keine Luecke im
 * Roster, sondern im Asset — und es wird benannt statt gefuellt:
 *   attack → `eat`   Das Maul geht auf. Fuer ein Pet, das einen Schuss SPUCKT, ist
 *                    das die anatomisch richtige Pose; ein Kopfschuetteln
 *                    (`gesture-negative`) waere eine Verlegenheitsloesung.
 *   hit    → keiner  Die Trefferreaktion traegt allein der Deformer des Wirts
 *                    (Stauchung aus der Wucht). Der Wirt meldet das als Ersatz.
 *   death  → keiner  Der Schussstand braucht ihn nicht; im Spiel ist es ein Slice.
 *   fly    → `idle`  Schweben macht der Wirt (Hoehe + Bob), wie bei den Cube-Monstern.
 *
 * ═══ BLICKACHSE: +Z, ZWEI ZEUGEN — UND EIN WIDERSPRUCH, DER STEHEN BLEIBT ═════
 * Der `walk`-Clip laeuft AUF DER STELLE (0 Wurzelversatz), es gibt also keinen
 * Gangzeugen wie bei den Mechs. Gemessen wurde deshalb die Anatomie:
 *   (1) BEINE: `leg-front-*` liegt bei 21 von 24 Pets um +0,50 u in Z vor
 *       `leg-back-*` (Pinguin/Kueken haben nur Vorderbeine: +0,05 gegen den Rumpf).
 *   (2) AUGEN: das Pet Studio setzt seine Googly-Augen mit `eyeAnchor.z = +0,70`,
 *       also auf die +Z-Seite — und dieses Overlay sitzt im Studio sichtbar richtig.
 * ABER: die sieben Modelle mit `tail`-Mesh (cat fox tiger lion monkey beaver parrot)
 * haben ihren Schwanz bei z +0,75 … +0,92, was auf \u2212Z als vorne deuten wuerde; der
 * Elefant widerspricht sich sogar selbst (Beine +Z, Schwanz \u22120,84). Zwei Zeugen
 * gegen einen, und der schwaechere ist der Schwanz (ein hochgebogener Katzenschwanz
 * hat seinen Kastenmittelpunkt ueber dem Ruecken, nicht hinter dem Koerper).
 * ENTSCHEIDUNG: vorne = +Z fuer alle 24. `tailZ` steht je Eintrag DRIN, damit
 * niemand die Messung neu erfinden muss — und der Wirt prueft sie im BILD nach
 * (Seitenansicht: Gesicht zum Gegner), bevor jemand \u201erichtig\" sagt.
 *
 * VERTRAG (gleich wie kfb-monster-roster.js, damit der Wirt EINEN Pfad hat)
 *   PETS · CLIPSETS · roleClip(e, rolle) · stance(e, pose) · zeile() · tor()
 */

export const BASE = 'media/3D_Assets/GLB_cube-pets/';

export const CLIPSETS = {
  pet8: {
    idle: 'idle', walk: 'walk', run: 'run', fly: null,
    attack: 'eat', attackHold: 'eat', hit: null, death: null,
    jump: null, dance: 'dance', yes: 'gesture-positive', no: 'gesture-negative', static: 'static'
  }
};

/* Massstab. VORHER 0,84 — uebernommen aus dem Monster-Roster, wo der Bezug der
   Space-Kit-Flieger auf 3,74 u ist. Das war der Fehler: ein Cube-Pet ist kein
   Gegner, sondern eine SPIELFIGUR, und Georgs Befund vom 04.09. sagt „cube pets
   sind ca 1/3 zu gross". Also runter um genau ein Drittel: 0,84 / 1,5 = 0,56.
   Der groesste Cube-Pet (bee, 2,02 u roh) steht damit auf 1,13 u, bei
   `enemyScale 2,2` also auf 2,49 u — knapp zwei Drittel der Flieger-Hoehe, was
   dem Groessenverhaeltnis im Studio entspricht.
   Warum EIN Faktor und keine Tabelle: die Verhaeltnisse der 24 untereinander sind
   gemessen und richtig; falsch war nur der gemeinsame Bezug. */
export const H_FAKTOR = 0.56;

/* id, rohhoehe, rohbreite, dreiecke, schwanz-z (null = kein tail-Mesh) */
const P = [
  ['bunny', 2.01, 1.33, 575, null], ['cat', 1.71, 1.81, 684, 0.83], ['fox', 1.69, 2.31, 568, 0.92],
  ['tiger', 1.71, 1.90, 951, 0.83], ['lion', 1.75, 1.90, 889, 0.83], ['penguin', 1.59, 2.19, 558, null],
  ['panda', 1.50, 1.44, 734, null], ['koala', 1.46, 1.94, 594, null], ['deer', 1.99, 1.56, 760, null],
  ['monkey', 1.61, 1.98, 918, 0.80], ['pig', 1.58, 1.46, 424, null], ['hog', 1.52, 1.50, 706, null],
  ['cow', 1.61, 1.54, 578, null], ['polar', 1.50, 1.50, 522, null], ['beaver', 1.50, 1.84, 670, 0.75],
  ['giraffe', 1.71, 1.56, 598, null], ['chick', 1.59, 2.20, 490, null], ['fish', 1.63, 1.88, 422, null],
  ['parrot', 1.68, 2.20, 530, 0.77], ['bee', 2.02, 1.33, 742, null], ['crab', 1.43, 2.34, 676, null],
  ['caterpillar', 1.75, 1.44, 578, null], ['elephant', 1.43, 1.88, 676, -0.84], ['dog', 1.58, 1.50, 490, null]
];

const NAME = { polar: 'Polarbär', hog: 'Wildschwein', chick: 'Küken', caterpillar: 'Raupe' };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const PETS = P.map(([id, raw, breit, tri, tailZ]) => ({
  id: 'p_' + id,
  name: NAME[id] || cap(id),
  file: BASE + 'animal-' + id + '.glb',
  h: +(raw * H_FAKTOR).toFixed(2),
  raw: raw, breit: breit, tris: tri, tailZ: tailZ,
  /* Fuer den Spielwirt, nicht fuer den Stand (der hat keine Lebenspunkte): aus der
     Groesse abgeleitet, nicht geraten. */
  hp: Math.round(22 + raw * 9),
  bolt: 0xe9c14a, bs: +(0.6 + raw * 0.12).toFixed(2), dmg: Math.round(4 + raw * 1.4),
  air: false,
  /* Ein Pet ist weich: Fleisch und Fell, kein Blech. Bis 05.09. stand hier `bone` — das war\n     in `SURFACES` die Zelle fuer Koerper, obwohl sie `bone` hiess. Der Name log, jetzt gibt es\n     `flesh` (weicher Anschlag, Fleisch-Body) und `bone` ist trockener Knochen. */
  surface: 'flesh',
  ready: true,
  clipSet: 'pet8',
  pack: 'pets',
  forwardZ: 1,
  quelle: 'GLB_cube-pets · gemessen 04.09.2026 (qa/cubepets-inventur.html)'
}));

export function roleClip(e, rolle) {
  const S = CLIPSETS[(e && e.clipSet) || ''] || null;
  return (S && S[rolle]) || null;
}

const POSEN = {
  boden: { y: 0, rolle: 'idle', loco: 'stand' },
  lauf:  { y: 0, rolle: 'walk', loco: 'lauf'  },
  luft:  { y: 1, rolle: 'idle', loco: 'hover' },
  flug:  { y: 1, rolle: 'fly',  loco: 'flug'  }
};

export function stance(e, pose) {
  const Q = POSEN[pose] || POSEN.boden;
  let rolle = Q.rolle, clip = roleClip(e, rolle), echt = !!clip, ersatz = null;
  if (!clip) {
    if (rolle === 'fly') { clip = roleClip(e, 'idle'); ersatz = 'kein Flug-Clip → Idle + Schweben vom Wirt'; }
    else { clip = roleClip(e, 'idle') || roleClip(e, 'static'); ersatz = 'kein ' + rolle + '-Clip'; }
  }
  return { y: Q.y, rolle: rolle, clip: clip || null, echt: echt, ersatz: ersatz, loco: Q.loco };
}

export function zeile() {
  const t = PETS.filter((e) => e.tailZ != null).length;
  return 'pet-roster · ' + PETS.length + ' Cube-Pets · 8 Clips je Pet (static idle walk run eat dance yes no) · '
    + 'kein attack/hit/death/fly — attack läuft über `eat` · vorne +Z (Beine 21×, Augenanker der Pet-Library), '
    + t + ' Schwanz-Meshes gemessen, ' + PETS.filter((e) => e.tailZ != null && e.tailZ > 0).length
    + ' davon widersprechen (steht als `tailZ` drin) · Massstab h = Rohhoehe × ' + H_FAKTOR
    + ' (04.09. von 0,84 gedrittelt — Georgs Befund) · Gesicht/Farbe: modules/kfb-pet-look.js';
}

export function tor() {
  const z = []; let ok = 0, von = 0, nm = 0;
  const pruef = (b, gut, schlecht) => { von++; if (b) { ok++; z.push('\u2713 ' + gut); } else z.push('\u2717 ' + schlecht); };
  const info = (s) => { z.push('\u00b7 ' + s); };
  const offen = (s) => { nm++; z.push('\u2013 ' + s + ' (nicht messbar)'); };

  pruef(PETS.length === 24, '24 Eintraege', PETS.length + ' Eintraege, erwartet 24');
  const ids = new Set(PETS.map((e) => e.id));
  pruef(ids.size === PETS.length, 'Kennungen eindeutig', (PETS.length - ids.size) + ' doppelt');
  pruef(PETS.every((e) => /animal-[a-z]+\.glb$/.test(e.file)), 'jeder Eintrag zeigt auf eine animal-*.glb',
    'Dateipfad(e) falsch: ' + PETS.filter((e) => !/animal-[a-z]+\.glb$/.test(e.file)).map((e) => e.id).join(', '));
  /* Die Rolle, ohne die ein Schuetze regungslos feuert. `eat` MUSS da sein \u2014 fehlt
     sie, ist der Ersatz weg und niemand merkt es. */
  pruef(PETS.every((e) => roleClip(e, 'idle') && roleClip(e, 'walk') && roleClip(e, 'attack')),
    'alle tragen idle · walk · attack(=eat)', 'Pflichtrolle fehlt');
  /* Und die Zeile, die fallen muss, wenn jemand die fehlenden Clips \u201enachtraegt\":
     dieser Satz HAT kein hit/death/fly, und der Ersatz haengt daran. */
  pruef(!roleClip(PETS[0], 'hit') && !roleClip(PETS[0], 'death') && !roleClip(PETS[0], 'fly'),
    'Messung unversehrt: kein hit, kein death, kein fly im Satz',
    'Clipsatz behauptet Rollen, die die Dateien nicht haben');
  info('Hoehen ' + Math.min.apply(null, PETS.map((e) => e.raw)).toFixed(2) + '–' + Math.max.apply(null, PETS.map((e) => e.raw)).toFixed(2)
    + ' u roh, Breiten ' + Math.min.apply(null, PETS.map((e) => e.breit)).toFixed(2) + '–' + Math.max.apply(null, PETS.map((e) => e.breit)).toFixed(2)
    + ' u \u2014 mehrere sind breiter als hoch, die Kapsel muss das lesen');
  info('Dreiecke ' + Math.min.apply(null, PETS.map((e) => e.tris)) + '–' + Math.max.apply(null, PETS.map((e) => e.tris)) + ', knoten-animiert (0 geskinnt)');
  offen('Blickachse im BILD: die Seitenansicht muss Gesicht-zum-Gegner zeigen (zwei Zeugen dafuer, der Schwanz dagegen)');

  return { ok: ok === von, bestanden: ok, von: von, nichtMessbar: nm, zeilen: z,
           text: 'pet-roster: ' + ok + '/' + von + ' bestanden' + (nm ? ', ' + nm + ' nicht messbar' : '') };
}
