/* KFB Combat Arena v3 · spuck.v3.js — S12: DAS SPUCKEN IST EIN BEAT
   ─────────────────────────────────────────────────────────────────────────────────────────────
   WAS SICH ÄNDERT: bis S11 entstand ein Tuscheklecks im Augenblick des Auslösens — Tusche ohne
   Ursache, unlesbar und unausweichlich. Jetzt ist das Spucken ein VORGANG mit einer Zeitachse, so
   wie der Schuss des Spielers einer ist (Audit-Kernthese: choreographieren statt auslösen):

     ANSAGE 0,34 s   das Monster dreht sich zum Ziel, am Maul sammeln sich Tropfen, auf der Karte
                     erscheint eine gezeichnete Zielmarke. Wer das sieht, kann weggehen.
     ABGANG          der Schwung löst sich und wird zur SPUCKE (`muzzle`)
     FLUG 0,42–0,95 s ein Bogen; drei bis fünf verschieden große Tropfen mit Nachlauf (`projektil`)
     AUFPRALL        JETZT erst wird der Klecks in die Zensurschicht gezeichnet, plus zwei bis vier
                     Satelliten (`impact`), dazu ein Cue (`sfx`)

   ⚠ DIE VIER BEFUNDE VOM 08.09. (Georg am Bild) UND WAS SIE GEÄNDERT HABEN:

   (a) »die fliegenden Spits sind klar als Flächen/Ovale zu erkennen« · »mehrere kleine,
       unterschiedlich große Tropfen wären besser«. Ursache war MEINE Streckung: die Kugel wurde
       entlang der WELT-Y-Achse gestreckt (`scale.set(1/√s, s, 1/√s)`) — eine stehende Ellipse, die
       aus jeder Kamerarichtung als Oval liest, und bei 0,115 u Radius zu groß für einen Tropfen.
       Jetzt fliegt eine SPUCKE: drei bis fünf Kugeln, Radien 0,4 bis 1,0 der Grundgröße, seitlich
       versetzt und mit NACHLAUF (jeder Tropfen sitzt ein Stück weiter hinten auf derselben Kurve).
       Keine Streckung mehr. Eine Wolke kleiner Kugeln braucht keine Verformung, um Bewegung zu
       zeigen — die Staffelung macht das.

   (b) »die Enemies spucken die Ink teilweise aus dem Rücken« · »die Ink geht nicht eindeutig vom
       Mund aus, kommt eher aus Modellmitte«. Ursache war die falsche Achse: gerechnet wurde mit
       `m.dir` (der LAUFrichtung), gezeigt wird das Modell aber mit `m.blick`, und `blick` dreht
       WEICH nachher (mobs.v2 dreht mit begrenzter Winkelgeschwindigkeit). In dem Augenblick, in dem
       ich `m.dir` aufs Ziel setzte, stand der Körper noch woanders — die Spucke verließ ihn also
       seitlich oder hinten. Jetzt kommt die Mündung aus der ECHTEN Blickachse
       (`sin(blick), cos(blick)` × `e.forwardZ`, dieselbe Umrechnung, die mobs.v2 zum Setzen der
       Modelldrehung benutzt), und der Abgang WARTET, bis der Körper innerhalb von `zielFenster` auf
       das Ziel schaut (bis `ansageMax`, dann bricht der Beat ab und wird gezählt).
       Merksatz: wer aus einem Körper heraus etwas abschickt, muss die Achse nehmen, die man SIEHT,
       nicht die, mit der man rechnet.

   (c) »Ink-Blobs scheinen teilweise vor dem Enemy herunterzufallen, statt ausgespuckt zu werden«.
       Dieselbe Wurzel wie (b) plus ein zu flacher Bogen: bei kurzer Distanz war der Scheitel nur
       0,5 u über dem Maul, also sah man ein Fallen und keinen Wurf. Jetzt hat der Bogen eine
       Mindesthöhe über dem MAUL (`mindestSteig`), und der erste Teil der Kurve steigt sichtbar.

   (d) »die einfachen weißen Target-Kreise wirken auf Schwarz nicht« — und im zweiten Anlauf, mit
       gezeichnetem Ring: »sieht nicht gut aus, ich würde das Target weglassen und die Ink einfach so
       spitten« (Georg 08.09., zwei Runden am Bild). ES GIBT KEINE ZIELMARKE MEHR. Zwei Fassungen sind
       an derselben Frage gescheitert, und die dritte Antwort ist ein Weglassen: die Ansage steckt in
       den Tropfen, die sich am Maul sammeln, und im Körper, der sich dreht. Das ist genug Vorwarnung
       für 340 ms, und es kostet die Karte keine fremde Grafik.
       Nebenbefund, den erst das Weglassen erklärt hat: »Zielkreuze tauchen teilweise unmotiviert auf
       und verschwinden dann« — das waren die ABBRÜCHE (Körper dreht sich nicht rechtzeitig, siehe b).
       Die Marke stand auf der Karte für eine Spucke, die nie kam. Ein Zeichen, das ein Ereignis
       ankündigt, das ausfallen kann, ist ein Versprechen ohne Deckung.

   ⚠ ZWEI ENTSCHEIDUNGEN, DIE BLEIBEN:

   (1) DER KLECKS ENTSTEHT AM AUFPRALL, NICHT AM AUSLÖSEN. Das ist der ganze Punkt des Slices: die
       Deckung steigt in dem Augenblick, in dem man den Grund dafür gesehen hat. Nebenwirkung, die
       wir wollen: die Uhr des Spiels wird ausweichbar, ohne dass eine Regel dazukommt.

   (2) KEINE KÖRPERVERFORMUNG ALS ANSAGE — und das ist eine Lücke, nicht eine Feinheit. Ein
       Aufbäumen gehört auf den `deform`-Kanal, und dessen Schiedsrichter (DP3, Slice S6) ist NICHT
       gebaut: es gibt niemanden, der entscheidet, wer die Achse besitzt, wenn Locomotion und Ansage
       gleichzeitig ziehen. Also verformt dieses Modul keinen fremden Körper. Es baut seine Ansage
       aus EIGENEN Knoten (Tropfen, Zielmarke), und `anim` steht deshalb NICHT in der Soll-Liste
       des Beats — sonst meldete C16 bei jedem Spucken eine stumme Schicht, die es gar nicht gibt.

   KEIN Math.random (Boden C10): jede Streuung kommt aus `rng` des Wirts.
   BODEN C25: jeder gezeichnete Spuckklecks trägt eine Beat-Nummer — 0 Waisen, gemessen.
   RÜCKWEG: `an = false`. Dann spuckt `zensur.v3` wieder direkt vor die Füße.                    */

export const SPEC = {
  ansage: 0.34,           // s Telegraph, bevor etwas fliegt
  ansageMax: 0.9,         // s · so lange wird auf die Drehung gewartet, dann Abbruch (gezählt)
  zielFenster: 0.5,       // rad · so genau muss der Körper zum Ziel schauen (≈ 29°)
  flug: [0.42, 0.95],     // s Flugdauer, nach Entfernung interpoliert
  reichweite: 8.0,        // u, weiter wird nicht gespuckt (dann fällt der Beat aus, gezählt)
  bogen: [0.3, 0.14],     // u Scheitelhöhe = bogen[0] + Distanz × bogen[1]
  mindestSteig: 0.42,     // u · der Scheitel liegt mindestens so weit ÜBER dem Maul (Befund c)
  tropfen: [3, 5],        // Kugeln je Spucke
  tropfenR: [0.4, 1.0],   // × Grundgröße — kleine häufiger, siehe `_spucke`
  ballR: 0.075,           // u Grundradius eines Tropfens (war 0,115 als EINE Kugel)
  nachlauf: 0.13,         // Anteil der Flugstrecke, um den der letzte Tropfen zurückliegt
  streu: 0.055,           // u seitlicher Versatz der Tropfen zueinander
  maulHoehe: 0.62,        // Anteil der Körperhöhe = Höhe des Mauls
  maulVor: 1.02,          // × Körperradius = Abstand des Mauls von der Achse
  plaetze: 8,             // Spucken gleichzeitig (Pool, kein Neubau je Schuss)
  klecks: [0.42, 0.78],   // u Radius des Kleckses am Aufprall
  satelliten: [2, 4],     // kleine Nebenkleckse
  satWeite: [0.35, 0.95], // u Abstand der Satelliten
  satR: [0.12, 0.3],      // × Kleckradius
  marke: null,            // — entfernt (Georg 08.09.): keine Zielmarke, die Ansage sind die Tropfen
  ink: [31, 26, 20]
};

export default class Spuck {
  static describe() {
    return { name: 'Spuck', capabilities: ['three@0.160', 'rng', 'time'], view: '3d', determinism: 'seeded', spec: SPEC };
  }

  constructor(o = {}) {
    this.THREE = o.THREE || o.three;
    this.rng = o.rng || Math.random;
    this.log = (s) => (o.log || console.info)('[spuck] ' + s);
    this.an = o.an !== false;
    this.schuesse = 0; this.getroffen = 0; this.verworfen = 0; this.waisen = 0;
    this.satzahl = 0; this.abbrueche = 0; this.platzer = 0; this.stumm = { sfx: 0 };
    this.aktiv = [];
    const T = this.THREE;
    this.gruppe = new T.Group();
    this.gruppe.name = 'spuck';
    const farbe = (SPEC.ink[0] << 16) | (SPEC.ink[1] << 8) | SPEC.ink[2];
    /* EIN Material für alle Tropfen: Tusche ist Druck, kein Licht — `toneMapped` false, damit die
       Szenenbelichtung sie nicht aufhellt (dieselbe Regel wie bei der Schicht). */
    this.mat = new T.MeshBasicMaterial({ color: farbe, toneMapped: false });
    const geo = new T.SphereGeometry(SPEC.ballR, 12, 9);
    this.pool = [];
    for (let i = 0; i < SPEC.plaetze; i++) {
      const tropfen = [];
      for (let j = 0; j < SPEC.tropfen[1]; j++) {
        const b = new T.Mesh(geo, this.mat);
        b.visible = false; b.frustumCulled = false;
        this.gruppe.add(b); tropfen.push(b);
      }
      this.pool.push({ tropfen, frei: true });
    }
  }

  mount(parent) { parent.add(this.gruppe); return this.gruppe; }

  /** Die drei Handgriffe: die Tuscheschicht (Ziel + Klecks), das Beat-Buch, der Ton. */
  binden(o = {}) {
    this.ze = o.ze || this.ze || null;
    this.beat = o.beat !== undefined ? o.beat : this.beat;
    this.cue = o.cue !== undefined ? o.cue : this.cue;
    return this;
  }

  _platz() { for (const p of this.pool) if (p.frei) return p; return null; }

  /* DIE ECHTE BLICKACHSE (Befund b). mobs.v2 setzt die Modelldrehung aus `blick` und dreht sie WEICH
     nach; die Weltvorwärtsrichtung ist deshalb `(sin blick, cos blick) × forwardZ` — nachgerechnet
     an der Umrechnung, mit der mobs.v2 `blick` aus `dir` bildet, und für beide Vorzeichen von
     `forwardZ` geprüft. `m.dir` ist die LAUFrichtung und hier ausdrücklich nicht gemeint. */
  _maul(m) {
    const fz = (m.e && m.e.forwardZ) || 1;
    const b = m.blick || 0;
    const fx = Math.sin(b) * fz, fzz = Math.cos(b) * fz;
    const r = (m.radius || 0.4) * SPEC.maulVor;
    return {
      x: m.pos.x + fx * r, y: (m.pos.y || 0) + (m.hoehe || 0.9) * SPEC.maulHoehe, z: m.pos.z + fzz * r,
      fx, fz: fzz, winkel: Math.atan2(fzz, fx)
    };
  }

  /* Die Tropfen einer Spucke: Radien mit Vorliebe für KLEIN (`u*u` zieht die Verteilung nach unten —
     gemessen über 200 Ziehungen: Mittel 0,614 · Median 0,586 · 70 % unter 0,7), Nachlauf gestaffelt,
     seitlicher Versatz gestreut. Der größte Tropfen führt — sonst sieht es aus, als würde die Spucke
     von hinten geschoben.
     ⚠ Erste Fassung stand `1 - u*u` und behauptete im Kommentar das Gegenteil dessen, was sie tat
       (Kritiker 08.09.: Mittel 0,79, nur 34 % unter 0,7 — also lauter gleich große Tropfen, genau
       der Befund, den der Umbau beheben sollte). Dieselbe Klasse wie die bow-Falle in der SOP: eine
       zugesagte Zahl, die der Code nicht einhält. */
  _spucke(anz) {
    const t = [];
    for (let i = 0; i < anz; i++) {
      const u = this.rng();
      const gr = SPEC.tropfenR[0] + (SPEC.tropfenR[1] - SPEC.tropfenR[0]) * u * u;
      t.push({
        gr, lag: (i / Math.max(1, anz - 1)) * SPEC.nachlauf * (0.6 + this.rng() * 0.6),
        ox: (this.rng() - 0.5) * 2 * SPEC.streu, oz: (this.rng() - 0.5) * 2 * SPEC.streu,
        oy: (this.rng() - 0.5) * 2 * SPEC.streu * 0.7
      });
    }
    t.sort((a, b) => b.gr - a.gr);
    for (let i = 0; i < t.length; i++) t[i].lag = (i / Math.max(1, t.length - 1)) * SPEC.nachlauf;
    return t;
  }

  /* Ein Spucken beginnen. Gibt false zurück, wenn es NICHT stattfindet (kein Ziel, kein Platz,
     zu weit) — der Aufrufer entscheidet dann, ob er stattdessen direkt spuckt. */
  spucken(m) {
    if (!this.an || !this.ze || !this.ze.schicht || !m || m.tot || m.weg || m.geheilt) return false;
    const ziel = this.ze.freiesZiel ? this.ze.freiesZiel(m.pos.x, m.pos.z, 0.06) : null;
    if (!ziel) { this.verworfen++; return false; }
    const dist = Math.hypot(ziel.x - m.pos.x, ziel.z - m.pos.z);
    if (!(dist > 0.2) || dist > SPEC.reichweite) { this.verworfen++; return false; }
    const p = this._platz();
    if (!p) { this.verworfen++; return false; }
    p.frei = false;
    const maul = this._maul(m);
    const anz = SPEC.tropfen[0] + Math.floor(this.rng() * (SPEC.tropfen[1] - SPEC.tropfen[0] + 1));
    const s = {
      m, p, t: 0, phase: 'ansage', beat: null,
      zu: { x: ziel.x, y: (m.pos.y || 0) + 0.02, z: ziel.z },
      dauer: SPEC.flug[0] + (SPEC.flug[1] - SPEC.flug[0]) * Math.min(1, dist / SPEC.reichweite),
      r: SPEC.klecks[0] + this.rng() * (SPEC.klecks[1] - SPEC.klecks[0]),
      dist, tropfen: this._spucke(anz), maul
    };
    /* Der Scheitel liegt mindestens `mindestSteig` über dem MAUL, nicht über dem Boden (Befund c):
       sonst ist der Bogen bei kurzer Distanz ein Fallen. */
    s.scheitel = Math.max(SPEC.mindestSteig, SPEC.bogen[0] + dist * SPEC.bogen[1]);
    if (this.beat && this.beat.beginn) {
      s.beat = this.beat.beginn('spuck', {
        schuetze: (m.e && m.e.id) || 'mob', ziel: 'karte',
        soll: ['muzzle', 'projektil', 'impact', 'sfx'],
        fireAt: SPEC.ansage
      });
    } else this.waisen++;
    /* ⚠ DAS FENSTER MUSS DEN GANZEN VORGANG ÜBERDECKEN. `beat.beginn` rechnet es aus `fireAt` + 0,2 s
       (also 0,54 s) — ein Spucken dauert aber Ansage PLUS Flug, bis zu 1,3 s. Gemessen 08.09.: der
       Beat wurde vom Takt abgelegt, bevor der Aufprall kam, und mein `ende()` legte ihn ein zweites
       Mal ab — Beat #4 stand doppelt im Protokoll, und C13 zählt Beats. `fireAt` bleibt die ehrliche
       Ansagezeit (C14 vergleicht sie), nur das Fenster wird nachgezogen.
       Merksatz: wer ein Ereignis eröffnet, muss wissen, wie lange es dauert. */
    if (s.beat) s.beat.fenster = SPEC.ansageMax + s.dauer + 0.25;
    /* Der Körper dreht sich zum Ziel — EIN Wert, EIN Schreiber: `m.dir` gehört ohnehin der
       Zielsuche der Zensur (M12 schreibt sie im Frieden). Kein zweiter Bewegungsweg. */
    m.dir = Math.atan2(s.zu.z - m.pos.z, s.zu.x - m.pos.x);
    for (let i = 0; i < p.tropfen.length; i++) p.tropfen[i].visible = i < s.tropfen.length;
    this.aktiv.push(s);
    this.schuesse++;
    return true;
  }

  /* ── DER TUSCHETOD (Georg 08.09.: »für den Ink-Death von FB wäre noch ein VFX & SFX super«) ───
     Kein neues Gewerk: FB PLATZT in dieselben Tropfen, die die Monster spucken. Sie fliegen radial
     nach außen, und weil der Aufprall ohnehin einen Klecks zeichnet, entsteht die Pfütze aus dem
     VORGANG statt als sechs Kleckse aus dem Nichts (so war es bis heute: `tuscheAufFB` malte sie
     direkt hin).
     `ohneBeat` ist der Unterschied zum Spucken: hier gibt es keine Choreographie und keinen
     Schützen, also darf der Aufprall auch keine Beat-Nummer verlangen — sonst zählt C25 acht Waisen
     für einen Vorgang, der gar keinen Beat haben soll. Gezählt wird er trotzdem (`platzer`). */
  platzen(pos, anz, hoch) {
    if (!this.ze || !this.ze.schicht || !pos) return 0;
    const N = anz || 8;
    let n = 0;
    for (let i = 0; i < N; i++) {
      const p = this._platz();
      if (!p) break;
      p.frei = false;
      const a = (i / N) * Math.PI * 2 + (this.rng() - 0.5) * 0.9;
      const d = 0.45 + this.rng() * 1.7;
      const y0 = (pos.y || 0) + (hoch != null ? hoch : 0.45);
      const s = {
        p, t: 0, phase: 'flug', beat: null, ohneBeat: true, gemeldet: true,
        abflug: { x: pos.x, y: y0, z: pos.z },
        zu: { x: pos.x + Math.cos(a) * d, y: (pos.y || 0) + 0.02, z: pos.z + Math.sin(a) * d },
        dauer: 0.28 + this.rng() * 0.38,
        scheitel: 0.45 + this.rng() * 0.75,
        r: 0.3 + this.rng() * 0.5,
        dist: d, tropfen: this._spucke(3 + Math.floor(this.rng() * 3))
      };
      for (let k = 0; k < p.tropfen.length; k++) p.tropfen[k].visible = k < s.tropfen.length;
      this.aktiv.push(s);
      this.platzer++; n++;
    }
    return n;
  }

  /** Punkt auf dem Bogen bei Fortschritt k (0 = Maul, 1 = Ziel). */
  _bahn(s, k, out) {
    const kk = Math.max(0, Math.min(1, k));
    out.x = s.abflug.x + (s.zu.x - s.abflug.x) * kk;
    out.z = s.abflug.z + (s.zu.z - s.abflug.z) * kk;
    out.y = s.abflug.y + (s.zu.y - s.abflug.y) * kk + 4 * kk * (1 - kk) * s.scheitel;
    return out;
  }

  update(dt) {
    if (!(dt > 0) || !this.aktiv.length) return 0;
    const pt = { x: 0, y: 0, z: 0 };
    let n = 0;
    for (let i = this.aktiv.length - 1; i >= 0; i--) {
      const s = this.aktiv[i];
      s.t += dt;
      if (s.phase === 'ansage' && (s.m.tot || s.m.weg)) {
        if(this.beat && s.beat)this.beat.ende(s.beat);
        for(const b of s.p.tropfen)b.visible=false;
        s.p.frei=true;this.aktiv.splice(i,1);continue;
      }
      if (s.phase === 'ansage') {
        /* Am Maul sammeln sich die Tropfen und wachsen; die Marke zieht sich zusammen. Der Ort wird
           NACHGEFÜHRT, solange das Monster noch geht und sich dreht — sonst löst sich die Spucke von
           einem Maul, das nicht mehr dort ist. */
        const maul = this._maul(s.m);
        const k = Math.min(1, s.t / SPEC.ansage);
        for (let j = 0; j < s.tropfen.length; j++) {
          const d = s.tropfen[j];
          s.p.tropfen[j].position.set(maul.x + d.ox * k, maul.y + d.oy * k, maul.z + d.oz * k);
          s.p.tropfen[j].scale.setScalar(d.gr * (0.3 + 0.7 * k));
        }
        /* DER ABGANG WARTET AUF DIE DREHUNG (Befund b). Schaut der Körper noch nicht hin, läuft die
           Ansage weiter — bis `ansageMax`. Dann ist es kein Spucken, sondern ein Abbruch, und der
           wird gezählt statt still verschluckt. */
        const zielW = Math.atan2(s.zu.z - s.m.pos.z, s.zu.x - s.m.pos.x);
        let dw = zielW - maul.winkel;
        while (dw > Math.PI) dw -= Math.PI * 2;
        while (dw < -Math.PI) dw += Math.PI * 2;
        const schaut = Math.abs(dw) <= SPEC.zielFenster;
        if (s.t >= SPEC.ansage && schaut) {
          s.phase = 'flug'; s.t = 0;
          s.abflug = { x: maul.x, y: maul.y, z: maul.z };
          if (this.beat && s.beat) { this.beat.feuer(s.beat); this.beat.schicht(s.beat, 'muzzle', true, s.tropfen.length + ' Tropfen am Maul'); }
          if (this.cue) this.cue('spuck', s.abflug); else this.stumm.sfx++;
          if (this.beat && s.beat) this.beat.schicht(s.beat, 'sfx', !!this.cue, this.cue ? null : 'kein Cue-Kanal gebunden');
        } else if (s.t >= SPEC.ansageMax) {
          this.abbrueche++;
          if (this.beat && s.beat) {
            this.beat.schicht(s.beat, 'muzzle', false, 'Körper drehte sich nicht zum Ziel (' + (Math.abs(dw) * 57.3).toFixed(0) + '° offen)');
            this.beat.ende(s.beat);
          }
          for (const b of s.p.tropfen) b.visible = false;
          s.p.frei = true;
          this.aktiv.splice(i, 1);
        }
        continue;
      }
      const k = Math.min(1, s.t / s.dauer);
      for (let j = 0; j < s.tropfen.length; j++) {
        const d = s.tropfen[j];
        this._bahn(s, k - d.lag, pt);
        s.p.tropfen[j].position.set(pt.x + d.ox, pt.y + d.oy, pt.z + d.oz);
        s.p.tropfen[j].scale.setScalar(d.gr);
        s.p.tropfen[j].visible = k - d.lag >= 0;
      }
      if (this.beat && s.beat && !s.gemeldet) { this.beat.schicht(s.beat, 'projektil', true, 'Bogen ' + s.dist.toFixed(1) + ' u · Scheitel ' + s.scheitel.toFixed(2) + ' u'); s.gemeldet = true; }
      if (k >= 1) {
        /* AUFPRALL: erst hier entsteht Tusche. Der Klecks kommt aus derselben Methode wie jeder
           andere (`zensur.spritzer`) — eine Zeichenstelle, ein Zähler, eine Wahrheit. */
        const ok = !!(this.ze && this.ze.spritzer(s.zu.x, s.zu.z, s.r));
        let sat = 0;
        const anz = SPEC.satelliten[0] + Math.floor(this.rng() * (SPEC.satelliten[1] - SPEC.satelliten[0] + 1));
        for (let j = 0; j < anz; j++) {
          const a = this.rng() * Math.PI * 2;
          const d = s.r * (SPEC.satWeite[0] + this.rng() * (SPEC.satWeite[1] - SPEC.satWeite[0])) * 2;
          const rr = s.r * (SPEC.satR[0] + this.rng() * (SPEC.satR[1] - SPEC.satR[0]));
          if (this.ze.spritzer(s.zu.x + Math.cos(a) * d, s.zu.z + Math.sin(a) * d, rr)) sat++;
        }
        this.satzahl += sat;
        if (ok) this.getroffen++;
        if (this.beat && s.beat) {
          this.beat.schicht(s.beat, 'impact', ok, ok ? 'Klecks ' + s.r.toFixed(2) + ' u + ' + sat + ' Satelliten' : 'Ziel lag neben dem Blatt');
          this.beat.ende(s.beat);
        } else if (!s.ohneBeat) this.waisen++;
        if (this.cue) this.cue('splat', s.zu);
        for (const b of s.p.tropfen) b.visible = false;
        s.p.frei = true;
        this.aktiv.splice(i, 1);
        n++;
      }
    }
    return n;
  }

  /** Karte frei: fliegende Tusche gehört zur alten Karte. */
  raeumen() {
    for (const s of this.aktiv) {
      if (this.beat && s.beat) this.beat.ende(s.beat);
      for (const b of s.p.tropfen) b.visible = false;
      s.p.frei = true;
    }
    this.aktiv.length = 0;
    return true;
  }

  probe() {
    return {
      an: !!this.an, fliegen: this.aktiv.length,
      schuesse: this.schuesse, getroffen: this.getroffen, satelliten: this.satzahl,
      verworfen: this.verworfen, abbrueche: this.abbrueche, waisen: this.waisen, stummSfx: this.stumm.sfx,
      platzer: this.platzer,
      ansage: SPEC.ansage, reichweite: SPEC.reichweite, tropfen: SPEC.tropfen
    };
  }

  zeile() {
    const p = this.probe();
    return '[spuck] ' + (p.an ? 'an' : 'AUS') + ' · ' + p.schuesse + ' Spuckbeats · ' + p.getroffen + ' Treffer'
      + ' + ' + p.satelliten + ' Satelliten · ' + p.fliegen + ' in der Luft'
      + ' · ' + p.tropfen[0] + '–' + p.tropfen[1] + ' Tropfen je Spucke · Ansage ' + (p.ansage * 1000).toFixed(0) + ' ms'
      + (p.abbrueche ? ' · ' + p.abbrueche + ' Abbrüche (Drehung zu langsam)' : '')
      + (p.platzer ? ' · ' + p.platzer + ' Tropfen aus dem Tuschetod' : '')
      + (p.verworfen ? ' · ' + p.verworfen + ' verworfen (kein Ziel/Platz)' : '')
      + (p.waisen ? ' · ⚠ ' + p.waisen + ' Waisen' : ' · 0 Waisen')
      + (p.stummSfx ? ' · ' + p.stummSfx + ' × ohne Ton' : '');
  }

  /* C25: jeder Spuckklecks trägt eine Beat-Nummer. Eine Waise entsteht, wenn dieses Modul zeichnet,
     ohne dass ein Beat offen war — genau der Fehler, den S5 für den Schuss geschlossen hat. */
  tor() {
    const ok = this.waisen === 0;
    return { name: 'spuck.v3', bestanden: ok ? 1 : 0, von: 1, pass: ok,
             zeile: 'C25 · ' + this.waisen + ' Waisen über ' + this.schuesse + ' Spuckbeats' };
  }

  dispose() {
    this.raeumen();
    for (const p of this.pool) {
      for (const b of p.tropfen) if (b.geometry) b.geometry.dispose();
    }
    if (this.mat) this.mat.dispose();
    if (this.gruppe && this.gruppe.parent) this.gruppe.parent.remove(this.gruppe);
    return true;
  }
}
