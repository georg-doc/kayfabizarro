/**
 * Klo-Rolli · Papier-Pet mit Abreissblatt
 *
 * Modulvertrag nach skills/session_modulvertrag.md Abschnitt 2: Dateiname ist
 * Kennung, Docblock ist Pflicht, Faehigkeiten sind deklarativ, Default-Export
 * mit festem Lebenszyklus.
 *
 * @kfb name        Klo-Rolli, Papier-Pet mit Abreissblatt
 * @kfb category    pet
 * @kfb capability  three@0.160
 * @kfb capability  pets
 * @kfb capability  cards
 * @kfb capability  pointer
 * @kfb capability  rng
 * @kfb capability  clock
 * @kfb capability  audio
 * @kfb view        3d
 * @kfb determinism seeded
 * @kfb since       v10
 *
 * Herkunft, mit Zeilen, nicht nachgerechnet:
 *   klo-rolli-v3.js  Cloth                 Z. 378–467   verbatim uebernommen
 *   klo-rolli-v3.js  ZONE                  Z. 215–220   verbatim
 *   klo-rolli-v3.js  buildSheet            Z. 843–890   Geometrie + Wickelwinkel
 *   klo-rolli-v3.js  Zug- und Riss-Gestik  Z. 1121–1195 Schwellen verbatim
 *   klo-rolli-v3.js  buildRoll/buildNail   Z. 620–724   Anker- und Klippwerte
 *   klo-rolli-buehne-v2.js  STAGE          Z. 40–60     Maszstabskette
 * Eigene Arbeit ist nur die Naht: Lebenszyklus, ctx-Injektion, Hook-Punkte.
 *
 * Was dieses Modul NICHT mitbringt und der Wirt liefern muss: Szene, Kamera,
 * Licht, Boden. Rolli haengt am Nagel und bringt keinen Raum mit.
 *
 * Determinismus: kein Math.random und keine Uhrzeit. Zufall kommt aus ctx.rng,
 * Zeit aus dem dt, das update() bekommt. Der Riss-Jitter in Cloth.advanceRip
 * ist deshalb gegenueber v3 auf rng umgestellt — die einzige inhaltliche
 * Abweichung von der Vorlage, und sie ist hier benannt.
 */

/* ------------------------------------------------------------------ Vertrag */

export const SPEC = {
  /* Rollenmasze in Buehneneinheiten. Aus v3 unveraendert. rollHalfW wird beim
   * Laden aus der GLB neu gemessen und ueberschreibt den Startwert. */
  roll: { y: 0.16, r: 0.115, halfW: 0.105 },

  /* Maszstabskette: die gemessene Rolle gegen die echte Rollengroesze. Ein
   * Faktor fuer einen ganzen Requisitensatz ist falsch, jedes Modell bringt
   * seine eigene Maszangabe. */
  scale: { realRollR: 0.0575, cartoon: 0.85 },

  /* Anker. Rolli hat keine Beine — legs.on = false. Sein Anker ist der Nagel,
   * nicht der Boden, und alles Bewegliche haengt an dessen Pivot. */
  anchor: {
    kind: 'nail',
    pivotFromHolderTop: -0.004,
    fallbackPivotY: 'roll.y + roll.r + 0.12',
    nail: { r: 0.006, len: 0.07, dy: -0.016, dz: 0.004 },
    head: { r: 0.0145, len: 0.005, dz: 0.030 },
    material: { color: 0x9a9a9c, roughness: 0.3, metalness: 0.9 }
  },

  /* Klippebene: schneidet das GLB-Papier an der Tangente ab, damit das
   * simulierte Blatt und das Modellpapier eine Kante bilden. */
  clip: { normal: [0, 1, 0], constantFrom: 'roll.y - roll.r + 0.006' },

  /* Augen: EyeRig v5, Host-Box unsichtbar, Ankerwerte aus v3 buildEyes. */
  eyes: {
    rig: 'pet-eye-rig.v5',
    host: { w: 'roll.halfW * 2 * 0.82', h: 0.17, d: 0.11, dy: 'roll.y + roll.r + 0.016 - pivotY', dz: 0.018 },
    anchor: { dx: 1.22, dy: 0.02, ring: 0.62, track: 0.24 },
    look: { pupilStyle: 'glossy-googly', pupilSize: 0.62, gloss: 0.9, lidFit: 0.92 },
    gazeFollow: true
  },

  /* Mund: Red-Lips-Set als Textur auf einer gebogenen Schale vor dem Zylinder.
   * Unbeleuchtet — Licht bleicht gemalte Charakterteile aus. */
  mouth: {
    set: 'FrizzleBob-RedMouth_01',
    prefix: 'FrizzleBob_RedLips_Mouth_01_0000s_0000s_',
    visemes: {
      l: '0000_L', woo: '0001_W-Oo', f: '0002_F', m: '0003_M', ee: '0004_Ee',
      s: '0005_S', d: '0006_D', r: '0007_R', oh: '0008_Oh', ah: '0009_Aa',
      uh: '0010_Uh', neutral: '0011_Neutral'
    },
    shell: { w: 'min(roll.halfW * 2 * 0.96, 0.20)', span: 0.72, a0: 1.02, r: 'roll.r * 1.004', segments: 18 },
    material: { basic: true, toneMapped: false, doubleSide: true, polygonOffset: -3 },

    /* Werte fuer PetMouth, wenn der WIRT sein eigenes Mund-Bauteil auf den Mantel setzt
     * (Pet Studio tut das, damit Rolli denselben Mund-Reiter bekommt wie jedes Pet).
     * Abgeleitet aus der Schale darueber, damit beide Wege dieselbe Lippe zeigen:
     *   Hoehe   = U * size,  U = roll.r          -> span 0,72 rad ergibt Bogenhoehe r*0,72 -> size 0,72
     *   Breite  = U * size * asp * sx, asp 1,621 -> sx 1,49 fuer die Schalenbreite 0,20
     *   Lage    = a0 1,02 rad, cos(1,02) = 0,52  -> dy +0,52, also UEBER der Achse
     * ⚠ dy ist positiv. Die Regler des Studios kamen von Cube-Pets, deren Mund UNTER der
     * Mitte sitzt; ein haengendes Pet braucht die andere Haelfte der Spanne. */
    petMouth: { set: 'red', size: 0.72, sx: 1.49, dy: 0.52, dx: 0, lift: 0.004, wrap: 1, tilt: 0, rot: 0, bend: 0, onTop: false }
  },

  /* Papier. KISS-FASSUNG (Georg, 29.08.): »ein weisses Blatt von vorne/unten knapp IN die Rolle,
   * kein Winkel, kein Gimmick, haengt gerade runter.« Die Tuch-Simulation unten bleibt im Code (sie
   * ist gemessen und dokumentiert), ist aber im Bild NICHT beteiligt: `mode: 'flat'`. Sechs Runden
   * Korrekturen an Wickel, Bodenklemmung, Dehnung und Spiegelung haben gezeigt, dass eine
   * Verlet-Simulation fuer einen Comic-Papierstreifen die falsche Vorrichtung ist — jede Zahl war
   * richtig und das Bild trotzdem falsch. Ein flaches Rechteck kann nicht flackern, nicht kriechen
   * und nicht knicken. */
  paper: {
    mode: 'flat',
    /* Wo das Blatt in die Rolle geht, als Anteil des Radius — vorne unten und knapp INNEN:
     * hypot(0,45 · 0,80) = 0,918 < 1, die Oberkante liegt also 8 % des Radius unter der Flaeche
     * und ist verdeckt. Von dort faellt das Blatt senkrecht (z bleibt konstant). */
    entryY: 0.45, entryZ: 0.80,
    cols: 9, rows: 15, pinRows: 4,
    w: 'roll.halfW * 2 * 0.985',
    h: 'w * 1.42',
    /* Die vier genadelten Reihen bilden den WICKEL auf der Rolle: Reihe 0 an der vorderen
     * Tangente, Reihe 3 unten an der Rolle. Erst darunter haengt das Papier frei — es kommt also
     * UNTER der Rolle heraus und klebt nicht vor ihr (Befund Georg 29.08.). Viertelkreis, weil
     * genau dort die Rolle den Faden abgibt. */
    wrapAngle: Math.PI / 2,
    /* Haut: der Wickel laeuft diesen Abstand VOR der Rollenflaeche. Papier hat Dicke, und zwei
     * Flaechen im selben Abstand vom Auge streiten um Pixel. */
    skin: 0.004,
    hangOffsetZ: 'roll.r + 0.004',
    passes: 25, damp: 0.986, gravity: 9.81, windAmp: 0.5, windPeriod: 0.7,
    /* Was auf dem Boden ankommt, muss NACH VORN ausweichen, nicht sich stapeln. Ohne das legen sich
     * alle Restreihen auf dieselbe Hoehe: die Reihenabstaende gehen auf 0, die Dreiecke werden
     * entartet und die beidseitige Flaeche streitet mit sich selbst um dieselben Pixel — Georgs
     * Befund 29.08. »am unteren Papierrand glitcht und flackert etwas, Quer-Knick«. Der Wert ist der
     * Anteil der Eindringtiefe, der je Bild in +z wandert. */
    floorSpread: 0.8
    /* passes: GEMESSEN 29.08. bei Zug 0,28 — 3 → Dehnung 14,9 %, oberstes Segment 0,0232 statt
     * 0,0083 und 27 Punkte auf dem Boden; 10 → 0 Punkte auf dem Boden; 25 → Dehnung 7,9 %,
     * oberstes Segment 0,0104; 50 → 3,3 %. 25 ist die Stufe, ab der das Blatt gleichmaessig
     * haengt, ohne dass die Rechnung auffaellt. */
  },

  /* Riss. Die RATE reiszt, nicht der Weg. */
  tear: {
    jerkRate: 2.6,        // Zug pro Sekunde, ab hier reiszt die Perforation
    minPull: 0.5,         // vorher haelt sie, egal wie schnell gezogen wird
    frontDuration: 0.26,  // Sekunden, in denen die Risskante die Reihe durchlaeuft
    releaseAfter: 0.42,   // Sekunden, dann ist das Blatt ein eigenes Objekt
    pullPerHeight: 0.44,  // Zugweg als Anteil der Bildhoehe
    jitter: 0.004
  },

  /* Bewertungsfelder sind AUF DAS BLATT GEDRUCKT. Dieselben normierten Rechtecke
   * malen die Textur und beantworten den Treffertest — eine Wahrheit fuer Pixel
   * und fuer Tippen. */
  zones: {
    ok:   { x: 0.07, y: 0.735, w: 0.40, h: 0.115, label: 'SITZT' },
    fail: { x: 0.53, y: 0.735, w: 0.40, h: 0.115, label: 'INS KLO GEGRIFFEN' }
  },

  /* Impuls-Antworten des Koerpers, aus v3 uebernommen. */
  body: { rollVelOnTear: 22, squashVelOnTear: -7, omegaOnTear: -1.8, omegaOnPull: 0.8 },

  /* Assets. Alle absolut, keine relativen Pfade — ein relativer Pfad laeuft in
   * der Vorschau und bricht im Standalone-Export. */
  assets: {
    glb: [
      'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Toilet%20Paper%20Roll.glb',
      'https://kayfabizarro.pages.dev/media/3D_Assets/Toilet%20Paper%20Roll.glb'
    ],
    eyeRig: 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/build/pet-eye-rig.v5.js',
    mouthDir: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Textures/FrizzleBob-RedMouth_01/'
  },

  /* GLB-Struktur, wie sie beim Laden erkannt wird: Suffix _1 ist der Kern,
   * _2 das Papier, alles andere der Halter. Weicht die Datei ab, bricht der
   * Ladeweg absichtlich statt still falsch zu bauen. */
  glbStructure: { core: /_1$/, paper: /_2$/, rest: 'holder' },

  /* Eintrag fuer pet-LIBRARY.json. cubeH und legs.length gelten fuer Rolli
   * nicht — er ist kein Cube-Pet mit Beinen, sondern ein Zylinder am Nagel. */
  petLibraryEntry: {
    id: 'klo-rolli',
    shape: 'cylinder',
    legs: { on: false },
    anchor: 'nail',
    cubeH: null,
    mouth: 'texture-set',
    eyes: 'eye-rig-v5',
    notes: 'Haengt, steht nicht. Schwerkraft wirkt auf das Papier, nicht auf Beine.'
  }
};

/* -------------------------------------------------------------------- Cloth */
/* Verbatim aus klo-rolli-v3.js Z. 378–467. Einzige Aenderung: der Riss-Jitter
 * nimmt eine uebergebene rng statt Math.random, damit determinism: seeded
 * haelt. Die Naht ist der zweite Parameter von advanceRip. */

export function Cloth(cols, rows, w, h) {
  this.cols = cols; this.rows = rows;
  this.w = w; this.h = h;
  /* Die genadelten Reihen liegen AUF der Rolle und bilden den Wickel. Zwei reichen dafuer nicht:
   * mit zwei Reihen ist der Wickel eine Sehne, und eine Sehne durch den Viertelkreis schneidet die
   * Rolle. Zahl kommt aus SPEC, damit sie EINEN Ort hat. */
  this.pinRows = SPEC.paper.pinRows || 2;
  this.rollR = 0; this.wrapAngle = 0; this.skin = 0;
  this.arc = 0; this.arcDY = 0; this.arcDZ = 0;
  this.p = [];
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var x = -w / 2 + w * (i / (cols - 1));
      this.p.push({ x: x, y: 0, z: 0, px: x, py: 0, pz: 0, pin: j < this.pinRows, row: j, col: i });
    }
  }
  this.cons = [];
  for (var jj = 0; jj < rows; jj++) {
    for (var ii = 0; ii < cols; ii++) {
      var a = jj * cols + ii;
      if (ii < cols - 1) this.cons.push({ a: a, b: a + 1, axis: 'x', on: true });
      // die Wickelsegmente behalten eine FESTE Ruhelaenge, nur der freie Fall skaliert
      if (jj < rows - 1) this.cons.push({ a: a, b: a + cols, axis: jj < this.pinRows - 1 ? 'arc' : 'y', on: true });
    }
  }
  this.ripAt = -1;
}
Cloth.prototype.idx = function (i, j) { return j * this.cols + i; };
Cloth.prototype.restX = function () { return this.w / (this.cols - 1); };
// der freie Fall spannt die Reihen unter dem Wickel, teilt also durch die freien Luecken
Cloth.prototype.restY = function (pull) { return (this.h * Math.max(0.001, pull)) / (this.rows - this.pinRows); };
/* Die genadelte Reihe r sitzt auf der ROLLENFLAECHE, im Winkel r/(pinRows-1) x wrapAngle von der
 * vorderen Tangente aus nach unten. Bei wrapAngle = pi/2 endet der Wickel unten an der Rolle, und
 * das freie Papier faellt von dort senkrecht — so laeuft Papier von einer Rolle.
 * ⚠ VORHER: Reihe 0 an der vorderen Tangente, Reihe 1 senkrecht darunter. Damit begann das freie
 * Papier auf HALBER Rollenhoehe und lag als Platte vor der Rolle (Georgs »vorgeklebt«), und seine
 * obere Kante lag 4 mm vor der Rollenflaeche — zwei Flaechen um dieselben Pixel, das war das
 * Flackern. */
Cloth.prototype.pinTarget = function (q) {
  var x = -this.w / 2 + this.w * (q.col / (this.cols - 1));
  if (this.pinRows < 2 || !this.rollR) return { x: x, y: 0, z: 0 };
  /* Der Wickel laeuft auf Radius + Haut. GEMESSEN 29.08.: ohne die Haut im Radius verjuengt sich
   * der Abstand ueber den Viertelkreis von 0,1190 auf 0,1151 — die letzte genadelte Reihe lag
   * 0,0001 vor der Rollenflaeche und stritt mit ihr um dieselben Pixel. Mit der Haut IM Radius
   * ist der Abstand ueber den ganzen Wickel konstant. */
  var rr = this.rollR + (this.skin || 0);
  var t = (q.row / (this.pinRows - 1)) * this.wrapAngle;
  return { x: x, y: -rr * Math.sin(t), z: -rr * (1 - Math.cos(t)) };
};
/* floorY (in Blatt-Koordinaten) ist optional. Ohne sie faellt das Papier durch den Boden —
 * genau das war Georgs Befund vom 29.08.: das Blatt reichte unter die Platte, und weil der
 * Klick-Ring AUF der Platte liegt, stand er vor dem Stueck Papier, das darunter hing. Der
 * Ring war nie falsch gezeichnet, das Papier war zu lang. */
Cloth.prototype.step = function (dt, pull, gx, gy, wind, floorY) {
  var dx = this.restX(), dy = this.restY(pull);
  var damp = 0.986;
  for (var k = 0; k < this.p.length; k++) {
    var q = this.p[k];
    if (q.pin) {
      var t = this.pinTarget(q);
      q.x = t.x; q.y = t.y; q.z = t.z;
      q.px = q.x; q.py = q.y; q.pz = q.z;
      continue;
    }
    var vx = (q.x - q.px) * damp, vy = (q.y - q.py) * damp, vz = (q.z - q.pz) * damp;
    q.px = q.x; q.py = q.y; q.pz = q.z;
    q.x += vx + gx * dt * dt;
    q.y += vy + gy * dt * dt;
    q.z += vz + wind * dt * dt;
  }
  var pass, m, s;
  /* Eindringtiefe EINMAL je Bild ablesen, vor den Zwaengen. Danach ist sie weg (die Klemmung hebt
   * die Punkte an), und in der Zwang-Schleife 25-mal auszuweichen waere das 25-fache Ausweichen. */
  if (floorY != null) for (m = 0; m < this.p.length; m++) { s = this.p[m]; s.deep = s.pin ? 0 : Math.max(0, floorY - s.y); }
  /* Durchlaeufe aus SPEC (war fest 3). GEMESSEN 29.08.: bei 3 Durchlaeufen trug das oberste freie
   * Segment das Gewicht der ganzen Kette und war 0,0231 lang statt 0,0083 — das Blatt war dadurch
   * 0,1235 statt 0,1074 lang (+15 %) und reichte deshalb auf den Boden. Papier dehnt sich nicht. */
  var passes = SPEC.paper.passes || 3;
  for (pass = 0; pass < passes; pass++) {
    for (var c = 0; c < this.cons.length; c++) {
      var con = this.cons[c];
      if (!con.on) continue;
      var A = this.p[con.a], B = this.p[con.b];
      var rest = con.axis === 'x' ? dx : con.axis === 'arc' ? this.arc : dy;
      var ex = B.x - A.x, ey = B.y - A.y, ez = B.z - A.z;
      var d = Math.sqrt(ex * ex + ey * ey + ez * ez) || 1e-6;
      var diff = (d - rest) / d * 0.5;
      var mx = ex * diff, my = ey * diff, mz = ez * diff;
      if (!A.pin) { A.x += mx; A.y += my; A.z += mz; }
      if (!B.pin) { B.x -= mx; B.y -= my; B.z -= mz; }
    }
    /* ⚠ DER BODEN GEHOERT IN DIE SCHLEIFE, NICHT DAHINTER. Erste Fassung klemmte nach den drei
     * Durchlaeufen und schrieb dabei die Geschwindigkeit auf null — das war KLEBER: das Blatt
     * schoss beim ersten Fall unter den Boden, wurde dort festgehalten und kam nie zurueck,
     * obwohl die Kette lang genug war (gemessen: 36 Punkte lagen bei Zug 0,278 auf der Platte,
     * rechnerisch braucht der Zug nur 0,176 von 0,193). Klemmt man in jedem Durchlauf, kann der
     * naechste Zwang liegende Punkte wieder hochziehen. */
    if (floorY != null) for (m = 0; m < this.p.length; m++) { s = this.p[m]; if (!s.pin && s.y < floorY) s.y = floorY; }
  }
  /* Was jetzt noch auf dem Boden LIEGT, liegt wirklich: senkrechte Geschwindigkeit weg (es huepft
   * nicht), Reibung in der Ebene (es rutscht nicht weg). Die Lage selbst ruehrt das nicht an, die
   * Zwaenge duerfen sie im naechsten Bild weiter korrigieren.
   * Dazu das Ausweichen nach vorn: die Restlaenge legt sich AUF die Platte statt sich zu stapeln. */
  if (floorY != null) {
    this.below = 0;
    var spread = SPEC.paper.floorSpread == null ? 0.8 : SPEC.paper.floorSpread;
    for (m = 0; m < this.p.length; m++) {
      s = this.p[m];
      if (s.deep > 0) { s.z += s.deep * spread; s.pz += s.deep * spread; }   // Lage UND Vorlage: kein Geschwindigkeitsstoss
      if (s.pin || s.y > floorY + 1e-6) continue;
      this.below++;
      s.py = s.y;
      s.px = s.x - (s.x - s.px) * 0.5;
      s.pz = s.z - (s.z - s.pz) * 0.5;
    }
  } else this.below = 0;
};
// die Risskante laeuft die Pin-Reihen ab, das Blatt schaelt sich also statt zu schnappen
Cloth.prototype.advanceRip = function (t, rng) {
  var rnd = rng || function () { return 0.5; };
  var upto = Math.floor(t * this.cols);
  while (this.ripAt < upto && this.ripAt < this.cols) {
    this.ripAt++;
    var i = Math.min(this.ripAt, this.cols - 1);
    for (var r = 0; r < this.pinRows; r++) {
      var q = this.p[this.idx(i, r)];
      if (!q || !q.pin) continue;
      q.pin = false;
      q.px = q.x + (rnd() - 0.5) * 0.004;
      q.py = q.y + 0.004;
    }
  }
  return this.ripAt >= this.cols;
};
Cloth.prototype.repin = function () {
  for (var i = 0; i < this.cols; i++) {
    for (var r = 0; r < this.pinRows; r++) this.p[this.idx(i, r)].pin = true;
  }
  this.ripAt = -1;
};
Cloth.prototype.anyPinned = function () {
  for (var i = 0; i < this.cols; i++) if (this.p[this.idx(i, 0)].pin) return true;
  return false;
};

/* --------------------------------------------------------------- Papierblatt */
/* Die Mechanik als eigenes Stueck: Geometrie, Zug, Riss, Freigabe. Der Wirt
 * bekommt Ereignisse und entscheidet, was mit dem freigegebenen Blatt
 * geschieht — Spuelung, Leine, Verschwinden. Das Modul entscheidet das nicht. */

export class PaperSheet {
  constructor(THREE, dims, rng) {
    this.THREE = THREE;
    this.rng = rng;
    this.w = dims.w;
    this.h = dims.h;
    this.rollR = dims.rollR;
    this.cloth = new Cloth(SPEC.paper.cols, SPEC.paper.rows, this.w, this.h);
    /* ⚠ DER WICKEL LIEGT AUF DER ROLLE, nicht daneben. Die Cloth kennt dafuer Radius und
     * Wickelwinkel und setzt ihre genadelten Reihen selbst auf die Flaeche (`pinTarget`).
     * `arc` ist die Sehne zwischen zwei benachbarten genadelten Reihen — die Ruhelaenge, die das
     * Wickelstueck behaelt, waehrend nur der freie Fall mit dem Zug skaliert. */
    this.cloth.rollR = this.rollR;
    this.cloth.wrapAngle = SPEC.paper.wrapAngle;
    this.cloth.skin = SPEC.paper.skin == null ? 0.004 : SPEC.paper.skin;
    var rrr = this.rollR + this.cloth.skin;
    var stepA = SPEC.paper.wrapAngle / Math.max(1, SPEC.paper.pinRows - 1);
    this.cloth.arc = 2 * rrr * Math.sin(stepA / 2);
    this.cloth.arcDY = -rrr * Math.sin(SPEC.paper.wrapAngle);
    this.cloth.arcDZ = -rrr * (1 - Math.cos(SPEC.paper.wrapAngle));
    this.floorY = null;   // setzt der Wirt ueber KloRolli.setGroundY — das Modul kennt keine Buehne
    this.pull = 0; this.pullTarget = 0;
    this.phase = 'idle';   // idle · ripping · released
    this.ripT = 0;
    this.pendingOk = null;
    this.build();
  }

  build() {
    this.flat = SPEC.paper.mode === 'flat';
    var T = this.THREE, C = this.cloth;
    var pos = new Float32Array(C.p.length * 3), uv = [], idx = [];
    for (var j = 0; j < C.rows; j++) {
      for (var i = 0; i < C.cols; i++) {
        uv.push(i / (C.cols - 1), 1 - j / (C.rows - 1));
        if (i < C.cols - 1 && j < C.rows - 1) {
          var a = j * C.cols + i;
          idx.push(a, a + 1, a + C.cols, a + 1, a + C.cols + 1, a + C.cols);
        }
      }
    }
    var geo = this.geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    this.material = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.94, metalness: 0, side: T.DoubleSide });
    this.mesh = new T.Mesh(geo, this.material);
    this.mesh.castShadow = true;
    this.sync();
  }

  /* Das flache Blatt: EINE Zahl (Zug) bestimmt die Laenge, sonst ist nichts zu rechnen.
   * Reihe 0 sitzt an der Einstichlinie, alle Reihen darunter haengen senkrecht darunter. */
  _flat() {
    var C = this.cloth, len = this.h * Math.max(0.06, this.pull);
    for (var j = 0; j < C.rows; j++) {
      var y = -len * (j / (C.rows - 1));
      for (var i = 0; i < C.cols; i++) {
        var q = C.p[j * C.cols + i];
        q.x = -C.w / 2 + C.w * (i / (C.cols - 1));
        q.y = y; q.z = 0;
        q.px = q.x; q.py = q.y; q.pz = 0;
      }
    }
    C.below = 0;
  }

  sync() {
    var arr = this.geo.attributes.position.array, P = this.cloth.p;
    for (var k = 0; k < P.length; k++) {
      arr[k * 3] = P[k].x; arr[k * 3 + 1] = P[k].y; arr[k * 3 + 2] = P[k].z;
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.computeVertexNormals();
  }

  /* Zug als Gestik. rate ist Zug pro Sekunde und entscheidet ueber den Riss —
   * langsam ziehen rollt ab, ruckartig reiszt. */
  drag(deltaPull, dt) {
    if (this.phase !== 'idle') return null;
    var prev = this.pullTarget;
    this.pullTarget = Math.max(0, Math.min(1, prev + deltaPull));
    var rate = (this.pullTarget - prev) / Math.max(0.008, dt);
    if (rate > SPEC.tear.jerkRate && this.pull > SPEC.tear.minPull) {
      this.startRip(null);
      return 'rip';
    }
    return 'pull';
  }

  startRip(ok) {
    if (this.phase !== 'idle') return false;
    this.phase = 'ripping';
    this.ripT = 0;
    this.pendingOk = ok;
    this.cloth.ripAt = -1;
    return true;
  }

  /* Ein Schritt. Gibt zurueck, was passiert ist, damit der Wirt Ton, Blase und
   * Bewertung daran haengen kann, ohne dass das Modul davon weisz. */
  update(dt, tiltRad, elapsed) {
    var out = null;
    this.pull += (this.pullTarget - this.pull) * Math.min(1, dt * 7);
    var g = SPEC.paper.gravity;
    var th = tiltRad || 0;
    var gx = -g * Math.sin(th), gy = -g * Math.cos(th);
    var wind = Math.sin((elapsed || 0) / SPEC.paper.windPeriod) * SPEC.paper.windAmp;
    if (this.phase === 'ripping') {
      this.ripT += dt;
      if (this.cloth.advanceRip(this.ripT / SPEC.tear.frontDuration, this.rng) && this.ripT > SPEC.tear.releaseAfter) {
        this.phase = 'released';
        out = { released: true, ok: this.pendingOk };
      }
    }
    if (this.flat) { this._flat(); this.sync(); return out; }
    this.cloth.step(dt, this.pull, gx, gy, wind, this.floorY);
    this.sync();
    return out;
  }

  /* Neues Blatt an der Perforation. Nach der Freigabe geht der Zug auf null
   * zurueck, das Papier ist wieder angeheftet. */
  reset() {
    this.cloth.repin();
    this.pull = 0; this.pullTarget = 0;
    this.phase = 'idle';
    this.ripT = 0;
    this.pendingOk = null;
    /* Ein neues Blatt wickelt kein Papier zurueck. Ohne dieses Zeichen liest die Rolle den Sprung
     * von Zug 0,9 auf 0 als abgerolltes Papier mit umgekehrtem Vorzeichen und dreht sich 3 rad
     * zurueck — sichtbar falsch. */
    this.rewound = true;
  }

  /* uv → gedrucktes Feld. Dieselben Rechtecke, die die Textur gemalt hat.
   * Das Blatt zeigt nur den oberen pull-Anteil der Karte. */
  zoneAt(uv, flipped) {
    if (!uv || !flipped) return null;
    var y = 1 - (1 - uv.y) * Math.max(0.001, this.pull);
    var x = uv.x;
    var keys = ['ok', 'fail'];
    for (var i = 0; i < keys.length; i++) {
      var z = SPEC.zones[keys[i]];
      if (x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h) return keys[i];
    }
    return null;
  }

  dispose() {
    this.geo.dispose();
    this.material.dispose();
  }
}

/* ------------------------------------------------------------------- Modul */

export default class KloRolli {
  static describe() {
    return {
      seedable: true,
      needsPointer: true,
      mounts: 'THREE.Object3D',      // kein DOM-Container: Rolli haengt in einer fremden Szene
      anchor: SPEC.anchor.kind,
      spec: SPEC
    };
  }

  /* Ereignis auf Methode, Abschnitt 5 des Vertrags. Der Wirt legt seine
   * Ereignisse per Tabelle darauf, das Modul kennt sie nicht. */
  static methods() {
    return {
      pull:     { args: ['amount'] },
      flip:     { args: [] },
      tear:     { args: ['ok'] },
      rate:     { args: ['ok'] },
      setDeck:  { args: ['cards'] },
      setCard:  { args: ['index'] },
      setEmote: { args: ['name', 'hold'] },
      say:      { args: ['text', 'secs'] },
      nudge:    { args: ['strength'] }
    };
  }

  async init(ctx) {
    this.THREE = ctx.three;                 // die eine Instanz, die der Wirt haelt
    this.rng = ctx.rng;                     // determinism: seeded
    this.clock = ctx.clock;
    this.cards = ctx.cards || null;
    this.audio = ctx.audio || null;         // standardmaessig aus, Einschaltgeste beim Wirt
    this.pointer = ctx.pointer || null;
    /* NEU (Import in Studio v10): der Wirt darf Ladewerkzeug und das Augen-Modul MITBRINGEN.
     * Warum nicht selbst holen: das Studio hat den EyeRig lokal im Projekt liegen, ein
     * Netzabruf waere dort ein Rueckschritt. Fehlt beides, holt sich das Modul die Adressen
     * aus SPEC.assets — also laeuft es auch ohne Wirt, der davon weiss. */
    this.gltfLoader = ctx.gltfLoader || null;
    this.eyeRigModule = ctx.eyeRigModule || null;
    this.renderer = ctx.renderer || null;
    /* faceByHost: das Modul baut die FLAECHEN des Gesichts (Stiel-Box, Rollenmantel), aber
     * nicht das Gesicht. Der Wirt setzt seine eigenen Bauteile darauf — Pet Studio nimmt
     * damit seinen Augen- und seinen Mund-Reiter fuer Rolli, statt einen zweiten zu bauen.
     * Ohne das Flag bleibt das Modul allein lauffaehig. */
    this.faceByHost = !!ctx.faceByHost;
    this.provenance = [];
    this.dims = {
      rollY: SPEC.roll.y,
      rollR: SPEC.roll.r,
      rollHalfW: SPEC.roll.halfW
    };
    this.rollY = SPEC.roll.y; this.rollR = SPEC.roll.r; this.rollHalfW = SPEC.roll.halfW;
    this.state = { index: 0, flip: 0, flipTarget: 0, emote: 'neutral' };
    this.elapsed = 0;
    this.theta = 0;                         // Neigung des Nagel-Pivots
    this.omega = 0;
    this.rollVel = 0;                       // Eigendrehung der Rolle nach einem Riss
    this.log = (s) => { this.provenance.push(s); };
  }

  /* mount nimmt einen THREE.Object3D, nicht ein DOM-Element: ein Pet haengt in
   * der Szene des Wirts. Das ist die eine bewusste Abweichung vom Vertrag,
   * hier benannt statt stillschweigend. Der Wirt liefert zusaetzlich seinen
   * Renderer, weil localClippingEnabled global ist.
   *
   * NEU (Import in Studio v10): mount baut jetzt ALLE FUENF Teile, nicht nur das Papier.
   * Vorher standen Rolle, Nagel, Augen und Mund in SPEC, gebaut wurden sie aber nur in
   * `klo-rolli-buehne-v2.js` — wer das Modul einhaengte, bekam ein Blatt, das in der Luft
   * hing. Uebernommen mit Zeilen aus der Buehne: buildRoll Z. 525–606, buildNail Z. 612–629,
   * buildEyes Z. 632–655, buildMouth Z. 658–701.
   *
   * Die Reihenfolge ist zwingend und steht so in Georgs Uebergabe: Rolle liefert die
   * gemessene Halterhoehe, daraus kommt der Nagel-Pivot, daran haengen Augen und Mund, und
   * das Blatt braucht die am GLB GEMESSENE Rollenbreite — wer die nicht neu messen laesst,
   * baut ein Blatt, das nicht auf die Rolle passt.
   *
   * mount() kehrt SOFORT zurueck (der Wirt kann seine Szene stellen), das Laden laeuft in
   * `this.ready`. Auf ein Ereignis warten, nicht auf die Uhr. */
  mount(parent, host) {
    var T = this.THREE;
    this.parent = parent;
    this.host = host || {};
    if (this.renderer) this.renderer.localClippingEnabled = true;
    this.swing = new T.Group();
    parent.add(this.swing);
    this.ready = this._buildAll();
    return this.swing;
  }

  async _buildAll() {
    if (!this.gltfLoader) {
      try {
        var m = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js');
        this.gltfLoader = new m.GLTFLoader();
      } catch (e) { this.log('GLTFLoader nicht erreichbar'); }
    }
    if (!this.eyeRigModule) {
      try { this.eyeRigModule = await import(SPEC.assets.eyeRig); }
      catch (e) { this.log('EyeRig-Modul nicht erreichbar'); }
    }
    await this.buildRoll();
    this.buildNail();
    this.buildFaceHosts();
    if (!this.faceByHost) { this.buildEyes(this.eyeRigModule); await this.buildMouth(); }
    this.attachPaper();
    this.dims.rollY = this.rollY; this.dims.rollR = this.rollR; this.dims.rollHalfW = this.rollHalfW;
    this.built = true;
    return this.report();
  }

  /* Das Blatt. Erst NACH buildRoll, weil `rollHalfW` am GLB gemessen wird, und erst nach
   * buildNail, weil seine Lage gegen den Pivot gerechnet ist. */
  attachPaper() {
    var T = this.THREE;
    this.paper = new PaperSheet(T, {
      w: this.rollHalfW * 2 * 0.985,
      h: this.rollHalfW * 2 * 0.985 * 1.42,
      rollR: this.rollR
    }, this.rng);
    /* ⚠ KEIN GEKLONTES ROLLENMATERIAL MEHR. Georg wollte ein WEISSES Blatt; das GLB-Papier traegt
     * Metall 0,400 und Farbe #a1a19e, was auf einer flachen Bahn als graue Platte liest. Das Blatt
     * behaelt darum sein eigenes weisses Material (0xffffff, Metall 0, Rauheit 0,94). */
    if (this.sheetTexture) {
      this.paper.material.map = this.sheetTexture;
      this.paper.material.needsUpdate = true;
    }
    this.hang = new T.Group();
    /* Einstichpunkt: vorne unten, knapp INNEN (SPEC.paper.entryY/entryZ). Von hier faellt das Blatt
     * senkrecht — kein Wickel, kein Winkel. `hang` sitzt wie die Rolle im `swing`, darum zaehlt
     * `rollY` direkt (der frueher hier stehende Abzug `- pivotY` war ein Rest aus der
     * Buehnenfassung und hat das Blatt 0,4262 zu tief gehaengt). */
    this.hang.position.set(0, this.rollY - SPEC.paper.entryY * this.rollR, SPEC.paper.entryZ * this.rollR);
    this.hang.add(this.paper.mesh);
    this.swing.add(this.hang);
  }

  /* Rolle. Uebernommen aus klo-rolli-buehne-v2.js Z. 525–606 (dort aus v3 buildRoll).
   * Zwei Quellen fuer das GLB, danach eine prozedurale Rolle als Rueckweg — ohne Netz
   * bleibt das Bild da, es sagt nur, dass es ein Ersatz ist. */
  async buildRoll() {
    var T = this.THREE;
    var GLB_URLS = SPEC.assets.glb;
    var pivot = this.roll = new T.Group();
    pivot.position.set(0, this.rollY, 0);
    this.swing.add(pivot);
    if (this.gltfLoader) {
      for (var i = 0; i < GLB_URLS.length; i++) {
        try {
          var gltf = await this.gltfLoader.loadAsync(GLB_URLS[i]);
          var obj = gltf.scene, core = null, paper = null, holder = null;
          obj.traverse(function (o) {
            if (!o.isMesh) return;
            var n = o.name || '';
            if (SPEC.glbStructure.core.test(n)) core = o;
            else if (SPEC.glbStructure.paper.test(n)) paper = o;
            else holder = o;
          });
          if (!core || !paper) throw new Error('unerwartete GLB-Struktur');
          obj.updateMatrixWorld(true);
          var pb = new T.Box3().setFromObject(paper);
          obj.scale.setScalar(this.rollR / (pb.getSize(new T.Vector3()).z / 2));
          var host = new T.Group();
          host.add(obj);
          this.swing.add(host);
          host.updateMatrixWorld(true);
          var c = new T.Box3().setFromObject(core).getCenter(new T.Vector3());
          host.position.set(-c.x, this.rollY - c.y, -c.z);
          host.updateMatrixWorld(true);
          this.rollHalfW = new T.Box3().setFromObject(paper).getSize(new T.Vector3()).x / 2;
          /* ⚠ DAS BLATT MUSS DAS MATERIAL DER ROLLE TRAGEN. Georgs Befund 29.08.: »das Blatt ist
             unsauber und mit Farb-/Licht-Unterschied lazy vor die Rolle geklebt.« Genau das war es:
             `PaperSheet` baut sich ein eigenes weisses MeshStandardMaterial (0xffffff, roughness
             0,94), waehrend die Rolle das Material aus der GLB traegt — andere Farbe, andere
             Rauheit, andere Antwort auf dasselbe Licht. Zwei Materialien fuer EIN Stueck Papier.
             Also merkt sich das Modul hier das Papiermaterial der Rolle; `attachPaper` klont es. */
          this.paperMaterial = paper.material || null;
          pivot.attach(core); pivot.attach(paper);
          /* ⚠ DAS GLB BRINGT SEIN EIGENES BLATT MIT, und es haengt an DERSELBEN Stelle wie das
             simulierte. Gemessen am geladenen Mesh: 62 Dreiecke, 52 liegen auf dem Zylinder,
             10 reichen bis Radius 0,216 bei Rollenradius 0,115 — ein Blatt, das vorn an der
             Tangente ansetzt und 0,183 unter die Achse faellt. Das simulierte Blatt startet
             4 mm davor. Georgs Befund vom 29.08.: »zwei ueberlappende Blaetter«.
             Die Klippebene aus SPEC.clip konnte das nie loesen: sie schneidet, was UNTER der
             unteren Tangente liegt, und laesst genau das Stueck zwischen Achse und Tangente
             stehen — die Haelfte, die man sieht. Eine Flaeche gegen eine Form, dieselbe Klasse
             Fehler wie beim Schatten in Podcast v3.
             Also weg mit der Geometrie: ein Dreieck, dessen SCHWERPUNKT weiter als 1,03 x Radius
             von der Achse liegt, gehoert zum Blatt und nicht zur Rolle. */
          this.flap = this._stripFlap(paper);
          var planes = [];
          if (!this.flap.removed) {
            /* Rueckweg: laesst sich die Geometrie nicht trennen (fremdes GLB, kein Index),
               gilt weiter Georgs Klippebene. Sie steht in WELTkoordinaten und muss nach jeder
               Skalierung nachgerechnet werden — `updateClip()`. */
            var plane = new T.Plane(new T.Vector3(0, 1, 0), -(this.rollY - this.rollR + 0.006));
            this._clipPlane = plane;
            this._clipLocalY = this.rollY - this.rollR + 0.006;
            planes = [plane];
          }
          [core, paper].forEach(function (m) {
            m.material = m.material.clone();
            if (planes.length) m.material.clippingPlanes = planes;
            m.material.roughness = 0.93;
            m.castShadow = true; m.receiveShadow = true;
          });
          paper.material.color.set(0xffffff);
          paper.material.envMapIntensity = 0.55;
          if (holder) {
            holder.castShadow = true; holder.receiveShadow = true;
            host.updateMatrixWorld(true);
            var hb = new T.Box3().setFromObject(holder);
            this.holderTop = hb.max.y;
            this.holderZ = (hb.min.z + hb.max.z) / 2;
          }
          this.glbSource = i === 0 ? 'Repo (raw)' : 'pages.dev';
          this.log('Toilet Paper Roll.glb · ' + this.glbSource);
          return;
        } catch (e) { this.glbErrors = (this.glbErrors || []).concat(String(e && e.message ? e.message : e)); }
      }
    }
    var paperMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.94 });
    var cardMat = new T.MeshStandardMaterial({ color: 0xc2ab8a, roughness: 0.96 });
    var steel = new T.MeshStandardMaterial({ color: 0x3a3a3c, roughness: 0.32, metalness: 0.86 });
    var R = this.rollR, self = this;
    var body = new T.Mesh(new T.CylinderGeometry(R, R, R * 1.83, 64, 1, true), paperMat);
    body.rotation.z = Math.PI / 2;
    body.castShadow = true; body.receiveShadow = true;
    pivot.add(body);
    [-1, 1].forEach(function (s) {
      var face = new T.Mesh(new T.RingGeometry(0.033, R, 64), paperMat);
      face.rotation.y = Math.PI / 2 * s;
      face.position.x = s * self.rollHalfW;
      pivot.add(face);
    });
    var tube = new T.Mesh(new T.CylinderGeometry(0.033, 0.033, R * 1.88, 40, 1, true), cardMat);
    tube.rotation.z = Math.PI / 2;
    pivot.add(tube);
    var barY = this.rollY + R + 0.10;
    var bar = new T.Mesh(new T.CylinderGeometry(0.017, 0.017, 0.42, 20), steel);
    bar.rotation.z = Math.PI / 2; bar.position.set(0, barY, 0);
    bar.castShadow = true;
    this.swing.add(bar);
    [-1, 1].forEach(function (s) {
      var post = new T.Mesh(new T.BoxGeometry(0.026, barY - self.rollY + 0.05, 0.03), steel);
      post.position.set(s * 0.20, (barY + self.rollY) / 2, -0.02);
      post.castShadow = true;
      self.swing.add(post);
    });
    this.holderTop = barY + 0.02; this.holderZ = -0.02;
    this.fallbackRoll = true;
    this.log('GLB nicht erreichbar — prozedurale Rolle');
  }

  /* Nagel. Uebernommen aus der Buehne Z. 612–629 (dort aus v3 buildNail): in die Halterung
   * geschlagen, nur der Kopf steht vor. Danach haengt alles am Nagel-Pivot.
   * EINE Abweichung, benannt: die Buehne haengt Nagel und Kopf in ihre Szene, das Modul
   * haengt sie an `parent` — sie duerfen NICHT mitpendeln, und eine Szene hat das Modul nicht. */
  buildNail() {
    var T = this.THREE;
    this.pivotY = (this.holderTop != null ? this.holderTop : this.rollY + this.rollR + 0.12)
      + SPEC.anchor.pivotFromHolderTop;
    this.swing.position.set(0, this.pivotY, 0);
    for (var i = 0; i < this.swing.children.length; i++) this.swing.children[i].position.y -= this.pivotY;
    var A = SPEC.anchor, M = A.material;
    var steel = new T.MeshStandardMaterial({ color: M.color, roughness: M.roughness, metalness: M.metalness });
    var nz = (this.holderZ || 0);
    var nail = new T.Mesh(new T.CylinderGeometry(A.nail.r, A.nail.r, A.nail.len, 14), steel);
    nail.rotation.x = Math.PI / 2;
    nail.position.set(0, this.pivotY + A.nail.dy, nz + A.nail.dz);
    nail.castShadow = true;
    this.parent.add(nail);
    var head = new T.Mesh(new T.CylinderGeometry(A.head.r, A.head.r, A.head.len, 20), steel);
    head.rotation.x = Math.PI / 2;
    head.position.set(0, this.pivotY + A.nail.dy, nz + A.head.dz);
    head.castShadow = true;
    this.parent.add(head);
    this.nailParts = [nail, head];
  }

  /* Augen. Uebernommen aus der Buehne Z. 632–655, samt Ankerwerten aus v3 buildEyes.
   *
   * ⚠ DAS IST DIE STELLE, DIE EINE GANZE MESSRUNDE ERSPART HAETTE: die Lidschalen sitzen
   * NICHT auf der gewoelbten Rolle, sondern auf einer unsichtbaren BOX, und die haengt an
   * einer eigenen Gruppe am Nagel-Pivot. Deshalb ist `ring 0.62` richtig (auf einem Zylinder
   * waere es ein grosser Spalt), und deshalb dreht die Rolle das Gesicht nicht mit. */
  /** Das mitgelieferte Blatt vom Rollen-Mesh trennen. Kriterium ist der SCHWERPUNKT eines
   *  Dreiecks, nicht ein einzelner Eckpunkt: die Uebergangsdreiecke haben Punkte auf beiden
   *  Seiten, und wer sie mitnimmt, reisst ein Loch in den Zylinder. Gerechnet wird im
   *  Pivot-Raum, wo die Rollenachse die x-Achse durch den Ursprung ist. */
  _stripFlap(paper) {
    var T = this.THREE, g = paper.geometry;
    var out = { total: 0, removed: 0, maxRadius: 0, keptRadius: 0 };
    var idx = g.index, pos = g.attributes.position;
    if (!idx || !pos) { this.log('Modell-Blatt: nicht trennbar (kein Index)'); return out; }
    paper.updateMatrix();
    var v = new T.Vector3(), rad = new Float64Array(pos.count), i;
    for (i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(paper.matrix);
      rad[i] = Math.hypot(v.y, v.z);
      if (rad[i] > out.maxRadius) out.maxRadius = rad[i];
    }
    var lim = this.rollR * 1.03, keep = [], t, a, b, c;
    out.total = idx.count / 3;
    for (t = 0; t < idx.count; t += 3) {
      a = idx.getX(t); b = idx.getX(t + 1); c = idx.getX(t + 2);
      if ((rad[a] + rad[b] + rad[c]) / 3 > lim) { out.removed++; continue; }
      keep.push(a, b, c);
      out.keptRadius = Math.max(out.keptRadius, rad[a], rad[b], rad[c]);
    }
    if (out.removed && keep.length) {
      g.setIndex(keep);
      g.computeVertexNormals();
      /* ⚠ DIE HUELLKISTE EINER GEOMETRIE KOMMT AUS ALLEN ECKPUNKTEN, NICHT AUS DEN BENUTZTEN.
         Nach dem Trennen liegen die Blatt-Eckpunkte noch im Puffer — sie werden von keinem
         Dreieck mehr benutzt und sind unsichtbar, aber `computeBoundingBox()` zaehlt sie mit.
         Gemessen: die Kiste reichte weiter bis 0,045 Welt, wo die Rolle bei 0,325 endet. Das
         faellt nicht im Bild auf, sondern beim RAHMEN: die Kamera holt ihren Ausschnitt aus
         dieser Kiste und liess Rolli klein und hochgeschoben stehen — ein Phantom, das die
         Bildmitte verschiebt. Also die Kiste ueber die benutzten Eckpunkte selbst setzen. */
      var bb = new T.Box3(), used = {}, kk;
      for (kk = 0; kk < keep.length; kk++) used[keep[kk]] = 1;
      for (kk in used) bb.expandByPoint(v.fromBufferAttribute(pos, +kk));
      g.boundingBox = bb;
      g.boundingSphere = new T.Sphere();
      bb.getBoundingSphere(g.boundingSphere);
      out.box = [+bb.min.y.toFixed(4), +bb.max.y.toFixed(4)];
    }
    out.maxRadius = +out.maxRadius.toFixed(4);
    out.keptRadius = +out.keptRadius.toFixed(4);
    this.log('Modell-Blatt entfernt: ' + out.removed + '/' + out.total + ' Dreiecke, Radius '
      + out.maxRadius + ' -> ' + out.keptRadius);
    return out;
  }

  /* Die zwei FLAECHEN, an denen ein Gesicht sitzen kann. Sie sind unsichtbar, gehoeren dem
   * Modul, und WER darauf ein Gesicht baut, entscheidet der Wirt.
   *
   * Warum zwei und nicht eine: Georgs SPEC hat zwei verschiedene Orte, und beide absichtlich —
   * die Augen sitzen auf einer Box UEBER der Rolle (Wackelaugen auf Stielen, darum ist dort
   * `ring 0.62` richtig), der Mund liegt auf dem MANTEL. Ein Bauteil, das seine Punkte auf die
   * Flaeche abtastet, bekommt die Woelbung damit von selbst — genau das tut PetMouth mit seinen
   * 52 Punkten, und deshalb braucht Rolli im Studio keine eigene gebogene Schale mehr.
   *
   * ⚠ Beide sind `opacity: 0` und NICHT `visible = false`: ein unsichtbares Elternteil
   * versteckt seine Kinder mit, und das Gesicht ist ein Kind. */
  buildFaceHosts() {
    var T = this.THREE, E = SPEC.eyes;
    var glass = function () { return new T.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }); };
    var box = this.eyeHost = new T.Mesh(
      new T.BoxGeometry(this.rollHalfW * 2 * 0.82, E.host.h, E.host.d), glass());
    box.name = 'body';
    box.position.set(0, this.rollY + this.rollR + 0.016 - this.pivotY, E.host.dz);
    var eyeInner = this.eyeInner = new T.Group();
    eyeInner.add(box);
    this.swing.add(eyeInner);

    /* Der Mantel als Flaeche: derselbe Radius und dieselbe Breite wie die GELADENE Rolle.
     * Er haengt an `swing`, nicht am Rollen-Pivot — sonst dreht der Mund mit, wenn die Rolle
     * nach einem Riss nachlaeuft.
     * ⚠ Die Achse wird in der GEOMETRIE gedreht, nicht am Mesh: PetMouth liest seine Einheit U
     * aus der halben y-Ausdehnung der Geometrie-Huellkiste. Am Mesh gedreht waere U die halbe
     * LAENGE (0,137) statt der Radius (0,115) — dann wandert der Mund beim Hoehenregler
     * seitlich statt nach oben. */
    var cg = new T.CylinderGeometry(this.rollR, this.rollR, this.rollHalfW * 2, 48, 1, true);
    cg.rotateZ(Math.PI / 2);
    var cyl = this.mouthHostMesh = new T.Mesh(cg, glass());
    cyl.name = 'body';
    cyl.position.set(0, this.rollY - this.pivotY, 0);
    var mouthInner = this.mouthInner = new T.Group();
    mouthInner.add(cyl);
    this.swing.add(mouthInner);
  }

  /** Zwei Gesichts-Kontexte im Format, das EyeRig v5 und PetMouth erwarten. Damit setzt der
   *  Wirt SEINE Bauteile auf, ohne dass das Modul sie kennen muss. */
  eyeCtx() { return { THREE: this.THREE, inner: this.eyeInner, o: {}, _squash: null, getFaceShells: function () { return []; } }; }
  mouthCtx() { return { THREE: this.THREE, inner: this.mouthInner, o: {}, _squash: null, getFaceShells: function () { return []; } }; }

  buildEyes(rigMod) {
    var T = this.THREE;
    if (!rigMod || !rigMod.EyeRig) { this.eyesMissing = true; this.log('EyeRig v5 nicht erreichbar'); return; }
    var E = SPEC.eyes;
    if (!this.eyeInner) return;            // die Flaeche gehoert buildFaceHosts — ein Ort, ein Eigentuemer
    var rig = this.rig = new rigMod.EyeRig(this.eyeCtx(), {
      anchor: { dx: E.anchor.dx, dy: E.anchor.dy, ring: E.anchor.ring, track: E.anchor.track },
      pupilStyle: E.look.pupilStyle, pupilSize: E.look.pupilSize, gloss: E.look.gloss,
      lidFit: E.look.lidFit,
      baseColor: 0x4d4d4d,
      blink: { minGap: 2.2, maxGap: 6.5, dur: 0.13 },
      life: { on: true, wander: 0.4, tremor: 0.3 }
    });
    rig.build();
    rig.setGazeFollow(!!E.gazeFollow);
    this.eyeBase = (rig.eyes || []).map(function (e) { return e.position.clone(); });
    this.log('EyeRig v5');
  }

  /* Mund. Uebernommen aus der Buehne Z. 658–701 (dort aus v3 buildMouth/mouthGeometry).
   * Eine gerechnete gebogene Schale um den Zylinder — kein Strahl-Abtasten, also gibt es
   * hier auch kein Loch-Problem. Unbeleuchtet, weil Licht gemalte Charakterteile ausbleicht.
   * NEU: alle zwoelf Formen sind umschaltbar (`setViseme`), nachgeladen bei Bedarf. */
  async buildMouth() {
    var T = this.THREE;
    var S = SPEC.mouth;
    this.mouthMat = new T.MeshBasicMaterial({
      transparent: true, side: T.DoubleSide, toneMapped: false,
      polygonOffset: true, polygonOffsetFactor: S.material.polygonOffset, polygonOffsetUnits: S.material.polygonOffset
    });
    this.mouthShape = { w: Math.min(this.rollHalfW * 2 * 0.96, 0.20), span: S.shell.span, a0: S.shell.a0 };
    this._buildMouthGeo();
    this.mouth = new T.Mesh(this.mouthGeo, this.mouthMat);
    this.mouth.position.set(0, this.rollY - this.pivotY, 0);
    this.swing.add(this.mouth);
    this.mouthTex = {};
    this.viseme = 'neutral';
    var ok = await this.setViseme('neutral');
    if (!ok) { this.mouth.visible = false; this.mouthMissing = true; this.log('Mund-Set nicht erreichbar'); }
    else this.log('Red-Lips-Set (neutral)');
  }

  _buildMouthGeo() {
    var T = this.THREE, S = SPEC.mouth, M = this.mouthShape;
    var W = M.w, span = M.span, a0 = M.a0, r = this.rollR * 1.004, NY = S.shell.segments;
    var pos = [], uv = [], idx = [], i, j;
    for (i = 0; i <= 1; i++) {
      for (j = 0; j <= NY; j++) {
        var a = a0 + (j / NY - 0.5) * span;
        pos.push(-W / 2 + W * i, Math.cos(a) * r, Math.sin(a) * r);
        uv.push(i, 1 - j / NY);
      }
    }
    for (j = 0; j < NY; j++) {
      var a1 = j, b1 = a1 + NY + 1;
      idx.push(a1, b1, a1 + 1, b1, b1 + 1, a1 + 1);
    }
    if (this.mouthGeo) this.mouthGeo.dispose();
    var geo = this.mouthGeo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    if (this.mouth) this.mouth.geometry = geo;
  }

  /** Eine der zwoelf Formen. Wird bei Bedarf geladen und dann behalten — ein Wechsel
   *  kostet danach nichts. Gibt zurueck, ob das Bild wirklich da ist. */
  async setViseme(name) {
    var T = this.THREE, S = SPEC.mouth;
    var file = S.visemes[name] || S.visemes.neutral;
    if (!this.mouthTex) this.mouthTex = {};
    if (!this.mouthTex[file]) {
      if (!this._texLoader) { this._texLoader = new T.TextureLoader(); this._texLoader.setCrossOrigin('anonymous'); }
      try {
        var tex = await this._texLoader.loadAsync(SPEC.assets.mouthDir + S.prefix + file + '.png');
        tex.colorSpace = T.SRGBColorSpace;
        tex.anisotropy = 4;
        this.mouthTex[file] = tex;
      } catch (e) { return false; }
    }
    this.viseme = name;
    this.mouthMat.map = this.mouthTex[file];
    this.mouthMat.needsUpdate = true;
    if (this.mouth) this.mouth.visible = true;
    this.mouthMissing = false;
    return true;
  }

  /** Regler des Munds: Breite, Bogenlaenge, Lage auf dem Bogen. Aendert die Geometrie,
   *  nicht die Textur — darum neu rechnen und nicht neu laden. */
  setMouthShape(patch) {
    if (!this.mouthShape) return;
    Object.assign(this.mouthShape, patch || {});
    this._buildMouthGeo();
  }

  /** Regler der Augen. Geht ueber die oeffentliche Schnittstelle des Rigs, damit die
   *  Zahlen an EINER Stelle leben. `setAnchor` baut das Rig neu — das ist so gewollt. */
  setEyes(patch) {
    if (!this.rig) return;
    var p = patch || {};
    var a = {};
    ['dx', 'dy', 'ring', 'track'].forEach(function (k) { if (p[k] != null) a[k] = p[k]; });
    var rest = {};
    ['pupilSize', 'gloss', 'lidFit', 'pupilStyle', 'inset', 'converge'].forEach(function (k) { if (p[k] != null) rest[k] = p[k]; });
    if (p.lashes) this.rig.setLashes(p.lashes);
    if (Object.keys(rest).length) this.rig.setEye(rest);
    if (Object.keys(a).length) this.rig.setAnchor(a);
    if (p.life) this.rig.setLife(p.life);
    if (p.emote) this.rig.applyEmote(p.emote);
    this.eyeBase = (this.rig.eyes || []).map(function (e) { return e.position.clone(); });
  }

  /** Der Blick folgt dem Zeiger. Bild-Koordinaten −1…1, wie das Rig sie erwartet. */
  look(nx, ny) { if (this.rig) this.rig.pointTo(nx, ny); }

  /** Was wirklich geladen wurde und was gemessen ist — die Tabelle, die zurueck in den
   *  Vertrag geschrieben wird. Kein Manifest: alles hier ist abgelesen. */
  /** Die Klippebene an die aktuelle Weltlage nachrechnen — nach jedem Skalieren/Verschieben.
   *  Ohne Drehung bleibt die Normale (0,1,0), nur die Höhe des Tangentenpunkts wandert, und die
   *  wird durch die echte Kette gerechnet statt geschätzt. */
  updateClip() {
    if (!this._clipPlane || !this.parent) return null;
    var T = this.THREE;
    this.parent.updateMatrixWorld(true);
    var p = this.parent.localToWorld(new T.Vector3(0, this._clipLocalY, 0));
    this._clipPlane.set(new T.Vector3(0, 1, 0), -p.y);
    return +p.y.toFixed(4);
  }

  /** Die Bodenhoehe der BUEHNE, in Weltkoordinaten. Das Modul kennt keine Buehne und soll auch
   *  keine kennen — es bekommt eine Zahl und rechnet sie selbst in seine Blatt-Koordinaten um
   *  (`_floorLocal`), weil nur es weiss, in welcher Kette das Papier haengt. null = kein Boden,
   *  Verhalten wie vor dem 29.08. (Rueckweg). */
  setGroundY(y) { this._groundY = (y == null ? null : y); return this; }

  /* Weltmass → Blattmass. `hang` sitzt im `swing` und der im skalierten Wurzelknoten des Wirts,
   * also muss die Weltskala mit heraus — sonst klemmt das Blatt in der falschen Hoehe, sobald der
   * Wirt Rolli auf Pet-Groesse bringt. 0,004 Luft, damit das liegende Papier nicht mit dem
   * Klick-Ring auf derselben Hoehe um dieselben Pixel streitet. */
  _floorLocal() {
    if (this._groundY == null || !this.hang) return null;
    var T = this.THREE;
    this.hang.updateWorldMatrix(true, false);
    var p = new T.Vector3(), q = new T.Quaternion(), s = new T.Vector3();
    this.hang.matrixWorld.decompose(p, q, s);
    var k = Math.abs(s.y) > 1e-6 ? s.y : 1;
    return (this._groundY + 0.004 - p.y) / k;
  }

  report() {
    return {
      provenance: this.provenance.slice(),
      fallbackRoll: !!this.fallbackRoll,
      glbSource: this.glbSource || null,
      glbErrors: (this.glbErrors || []).slice(),
      flap: this.flap || null,
      faceByHost: this.faceByHost,
      eyes: this.rig ? 'EyeRig v5' : (this.faceByHost ? 'Wirt' : 'fehlt'),
      mouth: this.faceByHost ? 'Wirt' : (this.mouthMissing ? 'fehlt' : ('Red-Lips · ' + this.viseme)),
      measured: {
        rollHalfW: +this.rollHalfW.toFixed(4),
        rollR: +this.rollR.toFixed(4),
        rollY: +this.rollY.toFixed(4),
        pivotY: this.pivotY != null ? +this.pivotY.toFixed(4) : null,
        holderTop: this.holderTop != null ? +this.holderTop.toFixed(4) : null,
        holderZ: this.holderZ != null ? +this.holderZ.toFixed(4) : null,
        sheetW: this.paper ? +this.paper.w.toFixed(4) : null,
        sheetH: this.paper ? +this.paper.h.toFixed(4) : null,
        eyeL: this.eyeBase && this.eyeBase[0] ? this.eyeBase[0].toArray().map((v) => +v.toFixed(4)) : null,
        eyeR: this.eyeBase && this.eyeBase[1] ? this.eyeBase[1].toArray().map((v) => +v.toFixed(4)) : null,
        mouthW: this.mouthShape ? +this.mouthShape.w.toFixed(4) : null,
        /* Die zwei Zahlen zu Georgs Befunden vom 29.08.: der Knick nach innen ist die z-Differenz
         * zwischen Tangentenreihe und Bogenreihe (war 0,0241), und `sheetBelow` zaehlt die Punkte
         * unter der Bodenhoehe (war > 0, darum stach der Klick-Ring durch das Blatt). */
        kinkZ: this.paper ? +Math.abs(this.paper.cloth.arcDZ).toFixed(4) : null,
        floorLocalY: this.paper && this.paper.floorY != null ? +this.paper.floorY.toFixed(4) : null,
        sheetBelow: this.paper ? (this.paper.cloth.below || 0) : null
      }
    };
  }

  update(dt) {
    this.elapsed += dt;
    // Pendel am Nagel: Rueckstellung plus Daempfung, wie in v3
    this.omega += -this.theta * 26 * dt;
    this.omega *= Math.pow(0.86, dt * 60);
    this.theta += this.omega * dt;
    if (this.swing) this.swing.rotation.z = this.theta;
    /* Eigendrehung der Rolle nach einem Riss (SPEC.body.rollVelOnTear). Sie gehoert der
     * ROLLE, nicht dem Pendel — und weil das Gesicht am Pivot haengt und nicht an der Rolle,
     * dreht es hier nichts mit. Genau der Grund, warum der Traeger kein Problem ist. */
    if (this.roll && Math.abs(this.rollVel) > 1e-4) {
      this.roll.rotation.x += this.rollVel * dt;
      this.rollVel *= Math.pow(0.86, dt * 60);
    }
    /* ⚠ DIE ROLLE DREHT SICH, WEIL PAPIER ABGEHT — nicht, weil jemand sie dreht. Der Winkel ist
     * Bogenmass: abgerollte Laenge / Radius. Damit gibt es EINEN Eigentuemer fuer »wie viel Papier
     * ist unten« (paper.pull), und Zug, Blattlaenge und Drehung koennen nicht auseinanderlaufen.
     * GEMESSEN 29.08. an DIESEM update() (kopflos, THREE-Stub, docs/petstudio-v10/PRUEFUNG_kopflos_rolli.md):
     * Zug 0 → 1 dreht 0,0000 → 3,3365 rad = 191,2°, Vorzeichen positiv.
     * Vorzeichen: Drehung um +x bewegt die vordere Flaeche (+z) nach unten — das Papier laeuft ab. */
    if (this.roll && this.paper) {
      if (this.paper.rewound) { this._pullSeen = this.paper.pull; this.paper.rewound = false; }
      var seen = this._pullSeen == null ? this.paper.pull : this._pullSeen;
      var dl = (this.paper.pull - seen) * this.paper.h;
      this._pullSeen = this.paper.pull;
      if (Math.abs(dl) > 1e-7) this.roll.rotation.x += dl / this.rollR;
    }
    if (this.rig && !this._hostTicksRig) this.rig.update(dt);
    if (this.paper) this.paper.floorY = this._floorLocal();   // jedes Bild neu: der Wirt darf skalieren
    var ev = this.paper ? this.paper.update(dt, this.theta, this.elapsed) : null;
    if (ev && ev.released) this.onReleased(ev.ok);
    return ev;
  }

  resize() { /* das Pet haelt keine eigene Leinwand */ }

  /* ---- Methoden aus der Ereignistabelle ---- */
  pull(amount) {
    if (!this.paper) return;
    this.paper.pullTarget = Math.min(1, this.paper.pullTarget + (amount == null ? 0.5 : amount));
    this.omega += SPEC.body.omegaOnPull;
  }
  flip() {
    if (!this.paper || this.paper.phase !== 'idle') return;
    if (this.paper.pullTarget < 0.9) { this.pull(1); return; }
    this.state.flipTarget = this.state.flipTarget > 0.5 ? 0 : 1;
  }
  tear(ok) {
    if (!this.paper) return;
    if (this.paper.startRip(ok == null ? null : !!ok)) {
      this.omega += SPEC.body.omegaOnTear;
      this.rollVel += SPEC.body.rollVelOnTear * 0.1;
      if (this.audio) this.audio.play('rip');
    }
  }
  rate(ok) { this.tear(ok); }
  setDeck(cards) { this.deck = cards || []; this.state.index = 0; this.onCard(); }
  setCard(i) { this.state.index = i | 0; this.onCard(); }
  setEmote(name) { this.state.emote = name; }
  nudge(strength) { this.omega += (strength == null ? 1 : strength); }

  /* Hooks. Der Wirt ueberschreibt sie; das Modul ruft sie nur. Damit bleibt die
   * Inszenierung austauschbar, ohne die Mechanik anzufassen. */
  /** Ziehen als GESTIK. Der Wirt liefert nur, wie weit der Zeiger gewandert ist; die RATE
   *  entscheidet ueber den Riss (SPEC.tear.jerkRate), und der Koerper antwortet hier — nicht beim
   *  Aufrufer, sonst hat die Reaktion zwei Eigentuemer und laeuft irgendwann auseinander. */
  dragBy(deltaPull, dt) {
    if (!this.paper) return null;
    var res = this.paper.drag(deltaPull, dt || 1 / 60);
    if (res === 'rip') {
      this.omega += SPEC.body.omegaOnTear;
      this.rollVel += SPEC.body.rollVelOnTear * 0.1;
      if (this.audio) this.audio.play('rip');
    } else if (res === 'pull') {
      this.omega += SPEC.body.omegaOnPull * Math.min(1, Math.abs(deltaPull) * 6);
    }
    return res;
  }

  /** Neues Blatt an der Perforation, von Hand. */
  newSheet() { if (this.paper) { this.paper.reset(); this.paper.pullTarget = 0.28; } }

  /** Was der Wirt zum Anzeigen braucht — eine Quelle, keine zweite Buchhaltung im Panel. */
  sheetState() {
    if (!this.paper) return null;
    return {
      phase: this.paper.phase,
      pull: +this.paper.pull.toFixed(3),
      target: +this.paper.pullTarget.toFixed(3),
      spinRad: +(this.roll ? this.roll.rotation.x : 0).toFixed(3),
      onFloor: this.paper.cloth.below || 0,
      radPerPull: +(this.paper.h / this.rollR).toFixed(3)
    };
  }

  onCard() {}
  onReleased(/* ok */) { if (this.paper) this.paper.reset(); }

  dispose() {
    if (this.paper) this.paper.dispose();
    if (this.rig) this.rig.dispose();
    if (this.nailParts) this.nailParts.forEach((m) => { if (m.parent) m.parent.remove(m); });
    if (this.swing && this.swing.parent) this.swing.parent.remove(this.swing);
    this.paper = null; this.swing = null; this.parent = null; this.rig = null;
  }
}
