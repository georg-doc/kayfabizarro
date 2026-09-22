/* kfb-monster-roster.js · die 21 MonsterCuteCubes als Kampf-Roster (v1, 04.09.2026)
 *
 * HERKUNFT · GEMESSEN, NICHT GEGLAUBT
 * `media/3D_Assets/MonsterPack_Quaternius/MonsterCuteCubes/glTF/` — 21 `.gltf`,
 * Textur je Monster daneben in `Textures/`. Der Ordner ist per GitHub-Contents-API
 * gelistet (der Tree-Filter blendet `.gltf` aus — bekannte Falle, steht in
 * `github.md`), jede Datei danach im Browser GELADEN und ausgemessen:
 * `qa/monstercubes-inventur.html`, Protokoll 04.09.2026.
 *
 * Ergebnis der Messung, und es widerspricht der alten Tree-Annahme:
 *   · alle 21: EIN SkinnedMesh, EIN Material („Texture"), 450–1820 Dreiecke
 *   · 16 Laeufer mit 10 Clips: Bite_Front · Bite_InPlace · Dance · Death ·
 *     HitRecieve · Idle · Jump · No · Walk · Yes
 *   · `Tree` hat NEUN Clips — ihm fehlt `Death`. Kein Tippfehler, gemessen.
 *   · 4 Flieger mit VIER Clips: Bite_Front · Death · Flying · HitRecieve.
 *     Sie haben KEIN Idle und KEIN Walk.
 *
 * ═══ DIE EINE UNBEQUEME WAHRHEIT ══════════════════════════════════════════════
 * Georgs Auftrag lautet „alle 21 fliegend ODER am Boden waehlbar". Die Modelle
 * geben das nicht her: ein Laeufer hat keinen Flugzyklus, ein Flieger keinen
 * Gehzyklus. Beides ist trotzdem SPIELBAR — aber nur, wenn der Ersatz benannt ist
 * statt vorgetaeuscht (dieselbe Regel wie beim stummen Tonausfall: „ein stilles
 * System und ein fehlerfreies System sehen gleich aus"):
 *   Laeufer in der Luft  → Clip `Idle`, der Wirt traegt das Schweben (Hoehe + Bob).
 *                          `stance().ersatz` sagt es, das HUD zeigt es.
 *   Flieger am Boden     → Clip `Flying` als Ruettelschweben knapp ueber Grund.
 * `stance()` gibt deshalb IMMER zurueck, ob der Clip echt oder Ersatz ist.
 *
 * ═══ WARUM EIGENES MODUL, NICHT `kfb-combat-def.js` ═══════════════════════════
 * `kfb-combat-def.js` ist geteiltes Gut (v8 UND Schussbahn lesen es). 21 Einträge
 * mit `ready:true` dort hineinzuschreiben haette v8s Gegnermischung veraendert,
 * ohne dass in v8 je ein Monster im Bild war — unbewiesen und still. Der Roster
 * ist deshalb ein eigenes Modul, und der Wirt MISCHT (`_enemies()`), statt dass
 * die Datenbasis wandert. v8 bleibt byte-gleich.
 *
 * VERTRAG
 *   MONSTERS            · Array, Form wie `ENEMIES` in kfb-combat-def.js
 *   CLIPSETS            · Rollen → Clipnamen je gemessener Satz
 *   roleClip(e, rolle)  · Clipname oder null (nie ein geratener Name)
 *   stance(e, pose)     · { y, rolle, clip, echt, ersatz, loco } fuer eine Haltung
 *   zeile() · tor()     · Selbstauskunft, drei Urteile (bestanden/nicht/nicht messbar)
 */

export const BASE = 'media/3D_Assets/MonsterPack_Quaternius/MonsterCuteCubes/glTF/';

/* Rollen → Clipnamen. `null` heisst: DIESER SATZ HAT DEN CLIP NICHT. Kein Fallback
   in der Tabelle, weil ein Fallback hier die Messung ueberschreiben wuerde. */
export const CLIPSETS = {
  cube10: { idle: 'Idle', walk: 'Walk', fly: null, attack: 'Bite_Front', attackHold: 'Bite_InPlace', hit: 'HitRecieve', death: 'Death', jump: 'Jump', dance: 'Dance', yes: 'Yes', no: 'No' },
  cube9:  { idle: 'Idle', walk: 'Walk', fly: null, attack: 'Bite_Front', attackHold: 'Bite_InPlace', hit: 'HitRecieve', death: null,    jump: 'Jump', dance: 'Dance', yes: 'Yes', no: 'No' },
  fly4:   { idle: 'Flying', walk: null, fly: 'Flying', attack: 'Bite_Front', attackHold: null, hit: 'HitRecieve', death: 'Death', jump: null, dance: null, yes: null, no: null }
};

/* Der MASSSTAB IST ABGELEITET, NICHT GESETZT (WIRT §10.12): Bezug ist der
   Space-Kit-Flieger, den Georg mit `enemyScale 2,2` als Silhouette abgenommen hat
   (h 1,7 → 3,74 u auf der Bahn). Der groesste Cube ist `Tree` mit 2,86 u Rohhoehe;
   Faktor 0,62 legt ihn auf 1,77 → 3,90 u, also genau dorthin. Alle anderen behalten
   ihr VERHAELTNIS zu ihm — die Groessenunterschiede des Packs sind Teil seiner
   Identitaet, ein Gleichmachen auf eine Zahl haette sie weggerechnet. */
export const H_FAKTOR = 0.62;

/* Oberflaeche = woraus das Ding gemacht ist, denn sie waehlt Ton, Splitter und
   Marke (`SURFACES` in kfb-combat-def.js). Pflanzen klingen nicht wie Knochen. */
const M = [
  // name,           rohhoehe, dreiecke, satz,     oberflaeche
  ['Alien',            2.07, 1720, 'cube10', 'bone'],
  ['Alien_Tall',       2.12, 1592, 'cube10', 'bone'],
  ['Bat',              1.75, 1200, 'fly4',   'bone'],
  ['Bee',              1.90, 1492, 'fly4',   'bone'],
  ['Cactus',           2.24, 1500, 'cube10', 'wood'],
  ['Chicken',          1.62, 1040, 'cube10', 'bone'],
  ['Crab',             1.58, 1820, 'cube10', 'stone'],
  ['Cthulhu',          1.56, 1576, 'fly4',   'bone'],
  ['Cyclops',          1.68,  972, 'cube10', 'bone'],
  ['Deer',             1.91, 1180, 'cube10', 'bone'],
  ['Demon',            1.64, 1640, 'cube10', 'bone'],
  ['Ghost',            1.41, 1000, 'cube10', 'bone'],
  ['GreenDemon',       1.64, 1280, 'cube10', 'bone'],
  ['Mushroom',         2.08,  868, 'cube10', 'wood'],
  ['Panda',            1.65, 1428, 'cube10', 'bone'],
  ['Penguin',          1.62, 1040, 'cube10', 'bone'],
  ['Pig',              1.65, 1316, 'cube10', 'bone'],
  ['Skull',            1.56,  450, 'cube10', 'bone'],
  ['Tree',             2.86, 1368, 'cube9',  'wood'],
  ['YellowDragon',     1.65, 1592, 'fly4',   'bone'],
  ['Yeti',             1.68, 1292, 'cube10', 'bone']
];

export const MONSTERS = M.map(([n, raw, tri, set, surface]) => ({
  id: 'q_' + n.toLowerCase(),
  name: n.replace(/_/g, ' '),
  file: BASE + n + '.gltf',
  h: +(raw * H_FAKTOR).toFixed(2),
  raw: raw, tris: tri,
  /* `hp`/`dmg`/`bs` liest der SCHUSSSTAND NICHT (er hat keine Lebenspunkte). Sie
     stehen fuer den Spielwirt (v8, Voxel-Welt) im Vertrag und sind aus der Groesse
     abgeleitet, nicht geraten: 26 + 8 × Rohhoehe. */
  hp: Math.round(26 + raw * 8),
  bolt: set === 'fly4' ? 0xc9e05a : 0x9ad63f,
  bs: +(0.62 + raw * 0.1).toFixed(2),
  dmg: Math.round(4 + raw * 1.6),
  /* `air` ist die VORGABE der Haltung, keine Eigenschaft: der Wirt darf jede der
     21 in die Luft oder auf den Boden stellen (Georgs Auftrag). Die Vorgabe folgt
     dem, was die Datei kann. */
  air: set === 'fly4',
  surface: surface,
  ready: true,
  clipSet: set,
  /* BLICKACHSE: **VORNE IST +Z**, fuer alle 21 GEMESSEN (nicht erschlossen).
     Zwei unabhaengige Messungen je Modell in `qa/monstercubes-orientierung.html`
     (04.09.2026): (1) `Bite_Front` stoesst den Kopf um 0,44–0,47 u nach **+Z**
     (`Head3`; bei den vier Fliegern `Wing5L` mit 0,85 u, ebenfalls +Z) — der Clip
     heisst „Front", also IST das vorne. (2) Der Wurzelknochen (`Body`) driftet im
     `Walk` um 0,205 u nach **−Z**, traegt den Koerper also nach +Z — dasselbe Muster
     wie beim Flamingo-Mech, wo die Vorwaertsachse nur aus dem Gangzyklus messbar
     war (`github.md`). Ergebnis: 21× +Z, kein Abweicher.
     ZUVOR STAND HIER `-1`, ERSCHLOSSEN AUS EINEM SCREENSHOT — und das war falsch:
     der Ruecken, den Georg sah, kam vom Bewegungs-Yaw des Laufzyklus, nicht von der
     Modellachse. Eine Achse aus einem Bild zu RATEN ist genau der Fehler, den der
     Mech-Befund schon einmal aufgeschrieben hat. */
  forwardZ: 1,
  quelle: 'MonsterCuteCubes · gemessen 04.09.2026 (qa/monstercubes-inventur.html)'
}));

export const FLYERS = MONSTERS.filter((e) => e.clipSet === 'fly4').map((e) => e.id);

export function roleClip(e, rolle) {
  const S = CLIPSETS[(e && e.clipSet) || ''] || null;
  return (S && S[rolle]) || null;
}

/* VIER HALTUNGEN, und jede sagt, was sie wirklich zeigt.
   `y` ist der Anteil der Schwebehoehe (0 = Boden, 1 = volle Flughoehe des Wirts) —
   die Hoehe selbst kennt nur der Wirt, hier steht nur das Verhaeltnis. */
const POSEN = {
  boden: { y: 0,    rolle: 'idle', loco: 'stand' },
  lauf:  { y: 0,    rolle: 'walk', loco: 'lauf'  },
  luft:  { y: 1,    rolle: 'idle', loco: 'hover' },
  flug:  { y: 1,    rolle: 'fly',  loco: 'flug'  }
};

export function stance(e, pose) {
  const P = POSEN[pose] || POSEN.boden;
  let rolle = P.rolle, clip = roleClip(e, rolle), echt = !!clip, ersatz = null;
  if (!clip) {
    /* Der Ersatz ist BENANNT, nicht still. Zwei Faelle, beide gemessen:
       Laeufer soll fliegen (kein `fly`) → Idle, Schweben macht der Wirt.
       Flieger soll gehen (kein `walk`)  → Flying knapp ueber Grund. */
    if (rolle === 'fly') { clip = roleClip(e, 'idle'); ersatz = 'kein Flying-Clip → Idle + Schweben vom Wirt'; }
    else if (rolle === 'walk') { clip = roleClip(e, 'fly') || roleClip(e, 'idle'); ersatz = 'kein Walk-Clip → Flying dicht ueber Grund'; }
    else { clip = roleClip(e, 'idle') || roleClip(e, 'fly'); ersatz = 'kein ' + rolle + '-Clip'; }
  }
  return { y: P.y, rolle: rolle, clip: clip || null, echt: echt, ersatz: ersatz, loco: P.loco };
}

export function zeile() {
  const f = MONSTERS.filter((e) => e.clipSet === 'fly4').length;
  const ohneTod = MONSTERS.filter((e) => !roleClip(e, 'death')).map((e) => e.name);
  const fw = MONSTERS.filter((e) => e.forwardZ !== 1).length;
  return 'monster-roster · ' + MONSTERS.length + ' Cube-Monster · ' + (MONSTERS.length - f - ohneTod.length) + ' Laeufer (10 Clips) · '
    + (ohneTod.length ? ohneTod.length + ' Laeufer ohne Death (' + ohneTod.join(', ') + ') · ' : '')
    + f + ' Flieger (4 Clips, ohne Walk und ohne Idle)'
    + ' · vorne +Z (21× gemessen' + (fw ? ', ' + fw + ' abweichend' : '') + ')'
    + ' · Massstab h = Rohhoehe × ' + H_FAKTOR;
}

export function tor() {
  const z = []; let ok = 0, von = 0, nm = 0;
  const pruef = (b, gut, schlecht) => { von++; if (b) { ok++; z.push('\u2713 ' + gut); } else z.push('\u2717 ' + schlecht); };
  const info = (s) => { z.push('\u00b7 ' + s); };
  const offen = (s) => { nm++; z.push('\u2013 ' + s + ' (nicht messbar)'); };

  pruef(MONSTERS.length === 21, '21 Eintraege', MONSTERS.length + ' Eintraege, erwartet 21');
  const ids = new Set(MONSTERS.map((e) => e.id));
  pruef(ids.size === MONSTERS.length, 'Kennungen eindeutig', (MONSTERS.length - ids.size) + ' doppelte Kennung(en)');
  const ohneDatei = MONSTERS.filter((e) => !/\.gltf$/.test(e.file || ''));
  pruef(!ohneDatei.length, 'jeder Eintrag hat eine .gltf-Datei', ohneDatei.length + ' ohne Datei');
  const ohneSatz = MONSTERS.filter((e) => !CLIPSETS[e.clipSet]);
  pruef(!ohneSatz.length, 'jeder Eintrag zeigt auf einen gemessenen Clipsatz', ohneSatz.map((e) => e.id).join(', ') + ' ohne Clipsatz');
  /* Die Pflichtrollen: ohne die drei ist ein Gegner im Kampf stumm. */
  const luecken = MONSTERS.filter((e) => !roleClip(e, 'idle') || !roleClip(e, 'attack') || !roleClip(e, 'hit'));
  pruef(!luecken.length, 'alle tragen idle · attack · hit', luecken.map((e) => e.id).join(', ') + ' ohne Pflichtrolle');
  /* Und die Zeile, die FALLEN MUSS, wenn jemand die Messung „aufraeumt": ein
     Flieger DARF keinen Walk haben, ein Laeufer kein Flying. Waere das anders,
     wuerde `stance()` einen Ersatz melden, den es nicht braucht. */
  const falscheFlieger = MONSTERS.filter((e) => e.clipSet === 'fly4' && roleClip(e, 'walk'));
  const falscheLaeufer = MONSTERS.filter((e) => e.clipSet !== 'fly4' && roleClip(e, 'fly'));
  pruef(!falscheFlieger.length && !falscheLaeufer.length,
    'Messung unversehrt: 4 Flieger ohne Walk, ' + (MONSTERS.length - 4) + ' Laeufer ohne Flying',
    'Clipsatz widerspricht der Messung (' + falscheFlieger.length + ' Flieger mit Walk, ' + falscheLaeufer.length + ' Laeufer mit Flying)');

  const gross = MONSTERS.reduce((a, e) => Math.max(a, e.h), 0);
  /* Die Blickachse ist gemessen (Biss + Gang, alle 21), also DARF sie fallen: wer
     sie „aufraeumt", bekommt hier ein Kreuz statt eines gedrehten Modells im Bild. */
  const fw = MONSTERS.filter((e) => e.forwardZ !== 1);
  pruef(!fw.length, 'Blickachse +Z fuer alle 21 (Biss und Gang gemessen)',
    fw.length + ' Eintrag/Eintraege mit abweichender Achse: ' + fw.map((e) => e.name + '=' + e.forwardZ).join(', '));
  info('groesster: ' + gross.toFixed(2) + ' u nominal (× enemyScale des Wirts)');
  info('Dreiecke: ' + Math.min.apply(null, MONSTERS.map((e) => e.tris)) + '–' + Math.max.apply(null, MONSTERS.map((e) => e.tris)) + ' je Modell, EIN Material');
  offen('Ladbarkeit der 21 Dateien — das kann nur der Wirt beim Laden melden');

  return { ok: ok === von, bestanden: ok, von: von, nichtMessbar: nm, zeilen: z,
           text: 'monster-roster: ' + ok + '/' + von + ' bestanden' + (nm ? ', ' + nm + ' nicht messbar' : '') };
}
