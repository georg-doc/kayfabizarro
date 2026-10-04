// ============================================================================
// card-flight.js — die getroffene Karte WIRD GEZEIGT und dann eingesteckt.
// ----------------------------------------------------------------------------
// Georg, 29.8., und das ist die Diagnose, nicht die Beschwerde:
//   „insgesamt sind auch die show card animation mit den übergängen viel zu schnell getimed, es
//    gibt kein easy in/out etc → das scheint mir alles eher BERECHNET als KONZIPIERT — die
//    Methoden sind okay, aber falsch umgesetzt … es ist jedenfalls nicht das ‚chilled‘ animation
//    timing aus tinyskies"
//
// Er hat auf den Kern gezeigt. Die Vorfassungen hatten je Phase ihre eigene Easing-Funktion und
// ihre eigenen Zauberzahlen (`easeOutBack(1.5)`, `easeIn`, `t / 0.34`, `Math.sin(π t)`). Das ist
// **gerechnete Bewegung**: jede Zeile plausibel, zusammen ohne Handschrift — und an den
// Phasengrenzen springt die Geschwindigkeit, weil zwei Kurven aneinanderstoßen, die nichts
// voneinander wissen. Genau das liest man als „kein ease in/out".
//
// **Die Bewegungssprache dieses Projekts liegt bereits portiert vor**, in `card-carrier.js`:
//   function spring(cur, target, stiff, damp, dt) {
//     cur.v += (target - cur.x) * stiff * dt;
//     cur.v *= Math.pow(damp, dt * 60);
//     cur.x += cur.v * dt;
//   }
// Federn zweiter Ordnung mit Überschwinger — damit sind dort Roll, Pitch, Kantencurl und Squash
// des Teppichs gemacht, samt Impulsen über `v +=`. Sie ist die Antwort auf alle drei Vorwürfe
// gleichzeitig:
//   · **ease in/out gibt es gratis** — eine Feder startet und endet mit Geschwindigkeit null;
//   · **die Übergänge springen nicht** — beim Phasenwechsel ändert sich nur das ZIEL, Ort und
//     Geschwindigkeit bleiben stehen. Es gibt keine Naht, an der etwas springen könnte;
//   · **„chilled" ist EINE Zahl** — die Steifigkeit. Nicht sieben Kurven, die man einzeln
//     nachzieht.
// Deshalb ist dieses Modul jetzt eine Zustandsmaschine, die ZIELE setzt, plus drei Federn. Keine
// Easing-Funktion mehr, kein `t / dur` im Bewegungspfad.
//
// ⚠ Gerechnet wird im **KAMERA-Raum** (Fehlerklasse 17): ein Objekt, das für den Betrachter
// stillstehen soll, kann nicht in Weltkoordinaten zu einer fliegenden Kamera interpoliert werden.
// Im Kamera-Raum ist Stillstand `target = const`, und die Feder kommt dort zur Ruhe.
//
// Die Schläge und ihre Zeiten stehen in EINER Tabelle (`P`), nicht verteilt im Code.
// ============================================================================

export function createCardFlight(opts = {}) {
  const THREE = opts.THREE;
  const scene = opts.scene, camera = opts.camera;
  /** () => {x, y} in CSS-Pixeln — die Mitte des HUD-Stapels. */
  const anchor = opts.anchor || (() => ({ x: innerWidth - 38, y: innerHeight - 60 }));

  const P = Object.assign({
    // ── Federn. `stiff` ist das Tempo, `damp` die Gelassenheit (kleiner = mehr Überschwinger).
    //    Die Werte liegen bewusst WEICHER als die Teppich-Federn (90 / 0,80): der Teppich reagiert
    //    auf Steuerung und muss knackig sein, eine vorgezeigte Karte soll ruhig kommen.
    posStiff: 26, posDamp: 0.84,
    sclStiff: 30, sclDamp: 0.80,   // etwas straffer: der Maßstab darf einmal überschwingen
    tiltStiff: 20, tiltDamp: 0.86,

    hit: 0.16,           // Schlag 1: sie STEHT und quittiert (nur Glut + Impuls, keine Fahrt)
    punchV: 9.0,         // Impuls auf die Maßstab-Feder — der Punch ist ein STOSS, keine Kurve
    flash: 2.4,

    hold: 1.05,          // Schlag 2: Lesedauer, nachdem die Feder angekommen ist
    // ⚠ Der Halt ist BEWEGT, nicht still (siehe `update`): ein Stillstand liest in einer
    // fahrenden Kamera als Hänger, nicht als Betonung — Georgs „hier stoppt die Animation".
    // Beträge klein halten: es soll driften, nicht wandern.
    holdDrift: 0.014,    // Querdrift des Ziels im Halt (Weltmaß, Amplitude)
    holdRise: 0.010,     // Steigen im Halt (Weltmaß je Sekunde)
    presentDepth: 0.34,
    presentFill: 0.46,   // Anteil der Bildhöhe — der Maßstab kommt aus dem BILD, nicht geraten
    presentTilt: 0.10,

    // ⚠ **1.9., Block 3 (Georg): „die Karte dreht sich je nach Kollisionsseite um ihre senkrechte
    // Achse, und die Drehung geht dann physikalisch sauber animiert in die Großansicht über."**
    // `roll` war bis jetzt in `hit`/`present` immer auf 0 gezielt (nur `tuck` drehte, unsigned).
    // Jetzt bekommt die Feder schon beim Einschlag ein Ziel mit VORZEICHEN — derselben Richtung,
    // aus der die Karte getroffen wurde (`f.side`, von `sky-cards`/`card-towers` gemeldet) — und
    // `tuck` dreht in dieselbe Richtung weiter. Eine Feder, ein Ziel, das nur den Betrag wechselt:
    // keine Naht, an der die Drehung umschlagen könnte.
    presentSpin: 0.5,    // rad, wie weit die Karte beim Vorzeigen zur getroffenen Seite kippt
    tuckSpin: 1.0,       // Umdrehungen beim Einstecken (Vorzeichen von `f.side`)
    tuckStiff: 42,       // beim Einstecken darf es straffer sein: jetzt ist es ein Wegräumen
    depth: 0.42,
    // ── Auflegen ────────────────────────────────────────────────────────
    // Georg: „die karten animation muss die karte visuell nachvollziehbar OBEN auf den stapel
    // GLEITEN unten rechts lassen". Drei Bedingungen stecken in dem Satz, und alle drei fehlten:
    //  1. **oben auf** — also von OBEN heran und dann herunter, nicht auf geradem Weg in die Ecke.
    //     Dazu ein Zwischenziel über dem Stapel (`overshootPx`), von dem aus sie sich auflegt.
    //  2. **gleiten** — die letzte Bewegung ist langsam und kurz. Deshalb wird die Feder für das
    //     Auflegen WEICHER (`layStiff` < `tuckStiff`): heranfahren ist zügig, auflegen ist ein
    //     Gleiten. Zwei Steifigkeiten sind der ganze Unterschied.
    //  3. **nachvollziehbar** — die Übergabe an das HUD-Blatt darf nicht springen. Also wird die
    //     3D-Karte auf **genau die Bildhöhe des Blatts** skaliert und erst freigegeben, wenn Ort
    //     UND Größe stimmen. Vorher endete sie bei einem geratenen `endScale` — und ein
    //     Größensprung im Moment des Wechsels ist genau das, was man als „weg, bevor man was
    //     erkennt" liest.
    //     ⚠ Der Landeplatz wird beim Eintritt in `tuck` EINMAL genommen, nicht je Bild gelesen —
    //     das oberste Blatt animiert 0,34 s lang und wäre ein wanderndes Ziel (siehe dort).
    overshootPx: 46,     // so weit ÜBER dem Stapel setzt sie zum Auflegen an
    outwardPx: -34,      // seitlicher Versatz des Anflugziels — NEGATIV = ins Bild hinein
    // ⚠ War +14, also nach AUSSEN. Georg: „die erste Card verschwindet angeschnitten hinter Maske".
    // Gerechnet: der Fächer sitzt 16 px vom rechten Rand, seine Mitte 38 px; +14 macht 24 px — und
    // eine Karte, die dort 44 px breit ankommt, hängt zur Hälfte außerhalb des Bildes. Sie wurde
    // vom Viewport BESCHNITTEN, nicht von einer Maske.
    // Der Denkfehler war „sie soll von der Bildkante kommen" — in einer ECKE gibt es diese Seite
    // nicht. Der freie Raum liegt nach innen und nach oben, also kommt sie von dort.
    clampPx: 8,          // Mindestabstand jedes Ziels zur Bildkante (plus halbe Kartenbreite)
    layStiff: 15,        // Auflege-Feder: deutlich weicher als `tuckStiff` → das Gleiten
    layDamp: 0.90,       // stark gedämpft: ein Blatt, das auf einen Stapel gleitet, wippt nicht
    // ── Wo das Gleiten ENDET ──────────────────────────────────────────────────
    // Georg: „die Karte fliegt hinter das Deck; dann wird sie sichtbar nach vorne geflackert!?"
    // Das ist keine Zeitfrage, sondern eine **Schichten-Wahrheit**, die ich übersehen habe: die
    // 3D-Karte lebt im WebGL-Canvas, der Fächer ist DOM DARÜBER (`#kfb-hud`, z-index 9). Eine
    // 3D-Karte kann also NIE vor dem Stapel liegen, egal welche `renderOrder` sie trägt — und mein
    // Ziel war die MITTE des obersten Blatts. Sie verschwand folgerichtig dahinter, und im Moment
    // der Übergabe erschien das DOM-Blatt oben auf: das ist das „Flackern nach vorne".
    // Kein z-index behebt das (das Canvas unter die Blätter zu legen wäre noch schlechter).
    // Die Lösung ist geometrisch: **die 3D-Karte kommt bis DIREKT ÜBER die Stapelkante und hört
    // dort auf** — sie überdeckt das Blatt nie, also kann sie auch nicht dahinter geraten. Die
    // letzten Pixel legt das DOM-Blatt selbst zurück (die `intake`-Animation gleitet aus
    // −7 px herunter). Eine Bewegung, zwei Techniken, EINE sichtbare Fortsetzung.
    layAbovePx: 20,      // so weit ÜBER der Oberkante des obersten Blatts endet der 3D-Teil
    endTolPx: 10,        // näher als das an der Stapelkante: übergeben
    presentTolPx: 14,    // näher als das am Vorzeige-Ort: der Halt beginnt
    // Reichweite des Bogens: ab diesem Abstand zum Landeplatz ist der Versatz VOLL, darunter
    // nimmt er quadratisch ab. Kein Umschaltpunkt — deshalb gibt es auch keine Toleranz dafür.
    biasRefPx: 190,
    // Harte Obergrenze für EINEN Sammelvorgang, phasenunabhängig. Der gesunde Weg braucht ≈ 4,4 s
    // (Einschlag + Vorzeigen + Halt 1,05 + Anflug + Auflegen); 9 s ist reichlich Rand und trotzdem
    // weit unter „irgendwann fällt es auf".
    maxAge: 9.0,
    tuckEnd: 0.20,

    on: true,
    // ⚠ Das Canvas — der eigentliche Bildraum. Ohne es fällt `rahmen()` aufs Fenster zurück, und
    // dann gilt wieder der alte Fehler. Der Runner MUSS es übergeben.
    canvas: null,
  }, opts.params || {});

  /** Die Feder aus `card-carrier.js`, wörtlich. Ein Zitat, keine Neuerfindung. */
  function spring(cur, target, stiff, damp, dt) {
    cur.v += (target - cur.x) * stiff * dt;
    cur.v *= Math.pow(damp, dt * 60);
    cur.x += cur.v * dt;
  }

  const flying = [];
  const _w = new THREE.Vector3(), _l = new THREE.Vector3();
  // v3 · Der ECHTE Landeplatz (ohne Bogen-Versatz) — daran wird der Abstand gemessen.
  const _lz = new THREE.Vector3();
  const _zq = new THREE.Quaternion(), _z = new THREE.Vector3(0, 0, 1);
  let started = 0, arrived = 0, verloren = 0;
  // ── v9 · Der ANSCHNITT-MESSER (Georg, 1.9.: „das Kartensammeln mit dem Masken-Anschnitt ist ja
  // auch noch auf der Bug-Liste") ───────────────────────────────────────────────────────────────
  // BUG-03 ist dreimal geraten worden, und dreimal war die Vorschau blind: hier UND in Georgs
  // Ansicht sind Canvas, Bühne und Fenster deckungsgleich (heute gemessen: 862×669 alle drei),
  // also ist der Versatz, den der 29.8.-Fix behoben hat, in beiden Ansichten exakt null.
  // *Wer einen Fehler nicht reproduzieren kann, baut kein viertes Mal einen Fix — er baut ein
  // Instrument, das beim NUTZER misst.* Dieses hier verfolgt die gezeichnete Kartenfläche in
  // Canvas-Pixeln und merkt sich je Kante, wie weit sie hinausragte. Eine harte gerade Kante im
  // Bild ist fast immer eine Bildgrenze — und ab jetzt sagt eine Zahl, WELCHE.
  const anschnitt = { links: 0, rechts: 0, oben: 0, unten: 0, proben: 0, wann: '',
                      kante: '', breitePx: 0, rahmen: '' };
  function anschnittMessen(fl) {
    const depth = Math.max(1e-4, -fl.z.x);
    const hoeheWelt = 2 * depth * Math.tan((camera.fov * Math.PI / 180) / 2);
    const breiteWelt = hoeheWelt * (camera.aspect || 1);
    const R = rahmen();
    const cx = (fl.x.x / breiteWelt + 0.5) * R.w;
    const cy = (0.5 - fl.y.x / hoeheWelt) * R.h;
    const pxW = R.h / hoeheWelt;
    const hw = fl.hoehe * fl.s.x * 1.74 * 0.5 * pxW;
    const hh = fl.hoehe * fl.s.x * 0.5 * pxW;
    const li = Math.max(0, hw - cx), re = Math.max(0, cx + hw - R.w);
    const ob = Math.max(0, hh - cy), un = Math.max(0, cy + hh - R.h);
    anschnitt.proben++;
    anschnitt.breitePx = Math.round(hw * 2);
    anschnitt.rahmen = Math.round(R.w) + '×' + Math.round(R.h) + ' canvas vs '
                     + innerWidth + '×' + innerHeight + ' window';
    let neu = false;
    if (li > anschnitt.links) { anschnitt.links = li; neu = true; }
    if (re > anschnitt.rechts) { anschnitt.rechts = re; neu = true; }
    if (ob > anschnitt.oben) { anschnitt.oben = ob; neu = true; }
    if (un > anschnitt.unten) { anschnitt.unten = un; neu = true; }
    if (neu) {
      const paare = [['left', anschnitt.links], ['right', anschnitt.rechts],
                     ['top', anschnitt.oben], ['bottom', anschnitt.unten]];
      paare.sort((a, b) => b[1] - a[1]);
      anschnitt.kante = paare[0][1] > 0.5 ? paare[0][0] : '';
      anschnitt.wann = fl.phase;
    }
  }

  /** ── Der BILDRAUM ist das Canvas, nicht das Fenster ────────────────────────────────────────
   *  ⚠ **Das war Georgs „Maske", die die Karte schneidet** — dreimal gemeldet, dreimal falsch
   *  gesucht. Ich habe Bildschirmkoordinaten mit `innerWidth`/`innerHeight` in NDC umgerechnet,
   *  also mit dem FENSTER. Die Kamera projiziert aber in das **Canvas**, und das ist in Georgs
   *  Editor eingerückt und kleiner als das Fenster (Werkzeugleiste oben, Seitenleiste links).
   *  Folge: jedes Bildschirmziel landet versetzt und zu weit außen, die Karte fliegt über den
   *  Canvas-Rand hinaus — und der Rand schneidet sie mit einer harten geraden Kante ab.
   *  **Eine harte gerade Kante ist fast immer eine Bildgrenze, keine Maske.**
   *  Und es erklärt, warum weder mein Vorschaufenster noch die Abnahme es je sahen: dort füllt
   *  das Canvas das Fenster, also war der Fehler exakt null. **Ein Fehler, der nur beim Nutzer
   *  auftritt, sitzt fast immer in einer Annahme über den Rahmen.**
   *  Der Anker (`getBoundingClientRect`) liefert Fensterkoordinaten — die werden jetzt in
   *  Canvas-Koordinaten übersetzt, statt sie zu verwechseln. */
  const _rect = { x: 0, y: 0, w: 1, h: 1 };
  function rahmen() {
    const el = camera && P.canvas;
    if (!el) { _rect.x = 0; _rect.y = 0; _rect.w = innerWidth; _rect.h = innerHeight; return _rect; }
    const r = el.getBoundingClientRect();
    _rect.x = r.left; _rect.y = r.top;
    _rect.w = r.width || innerWidth; _rect.h = r.height || innerHeight;
    return _rect;
  }

  /** ⚠ Das Tor zu BUG-03. Es beantwortet die Frage, die drei Fixes lang geraten wurde:
   *  ragte die gezeichnete Karte über eine BILDKANTE — und über welche, um wieviele Pixel?
   *  Dazu der Rahmenvergleich, weil genau dort der Fehler des 29.8. saß. */
  function anschnittTor() {
    const w = Math.max(anschnitt.links, anschnitt.rechts, anschnitt.oben, anschnitt.unten);
    const anteil = anschnitt.breitePx > 0 ? w / anschnitt.breitePx * 100 : 0;
    if (anschnitt.proben === 0) {
      return { idle: true, ok: null, text: '— no card has flown yet · collect one, then read this line' };
    }
    const ok = w < 1;
    return { ok, worst: +w.toFixed(1), kante: anschnitt.kante, anteilProzent: +anteil.toFixed(1),
      links: +anschnitt.links.toFixed(1), rechts: +anschnitt.rechts.toFixed(1),
      oben: +anschnitt.oben.toFixed(1), unten: +anschnitt.unten.toFixed(1),
      text: (ok ? '✓ no edge crossed' : '✗ card crossed the ' + anschnitt.kante + ' edge by '
              + w.toFixed(1) + ' px = ' + anteil.toFixed(1) + ' % of its width, during phase '
              + anschnitt.wann)
        + ' · worst per edge L/R/T/B ' + anschnitt.links.toFixed(1) + '/' + anschnitt.rechts.toFixed(1)
        + '/' + anschnitt.oben.toFixed(1) + '/' + anschnitt.unten.toFixed(1)
        + ' px · card ' + anschnitt.breitePx + ' px wide · ' + anschnitt.rahmen
        + ' · ' + anschnitt.proben + ' frames measured' };
  }
  function anschnittReset() {
    anschnitt.links = anschnitt.rechts = anschnitt.oben = anschnitt.unten = 0;
    anschnitt.proben = 0; anschnitt.kante = ''; anschnitt.wann = '';
  }

  /** Bildschirmpunkt (FENSTER-Koordinaten, wie `getBoundingClientRect` sie liefert)
   *  → Punkt im KAMERA-Raum bei gegebener Tiefe.
   *  Geklemmt wird auf das CANVAS, plus halbe Kartenbreite — sonst ist der Mittelpunkt drin und
   *  die Karte hängt raus. */
  function lokalAusBild(sx, sy, tiefe, ziel, halbPx) {
    const R = rahmen();
    const rand = P.clampPx + (halbPx || 0);
    // Fenster → Canvas: erst den Ursprung abziehen, dann klemmen.
    const cx = Math.max(rand, Math.min(R.w - rand, sx - R.x));
    const cy = Math.max(rand, Math.min(R.h - rand, sy - R.y));
    _w.set((cx / R.w) * 2 - 1, -(cy / R.h) * 2 + 1, 0.5).unproject(camera);
    camera.worldToLocal(_w);
    return ziel.copy(_w).multiplyScalar(tiefe / Math.max(1e-4, -_w.z));
  }
  /** Weltmaß, das bei `tiefe` die volle Bildhöhe füllt — Bildhöhe = CANVAS-Höhe. */
  function bildHoehe(tiefe) {
    return 2 * tiefe * Math.tan((camera.fov * Math.PI / 180) / 2);
  }
  /** Pixel je Weltmaß bei `tiefe` — jetzt gegen die Canvas-Höhe, nicht die Fensterhöhe. */
  function pxJeWelt(tiefe) {
    return rahmen().h / Math.max(1e-4, bildHoehe(tiefe));
  }

  function launch(taken, onArrive, side) {
    if (!P.on || !taken || !taken.mesh) {
      if (taken && taken.release) taken.release();
      if (onArrive) onArrive();
      return false;
    }
    const m = taken.mesh;
    scene.attach(m);
    m.visible = true;
    m.renderOrder = 3;
    m.frustumCulled = false;
    // Trefferpose EINMAL in den Kamera-Raum. Ab hier gibt es keine Weltkoordinate mehr, an der
    // die Animation hängen könnte.
    const lp = camera.worldToLocal(m.position.clone());
    flying.push({
      taken, mesh: m, mat: taken.mat, phase: 'hit', t: 0, age: 0,
      hoehe: (taken.width || 0.08) / 1.74,
      // Je Achse eine Feder. Startzustand = Trefferpose, Geschwindigkeit null.
      x: { x: lp.x, v: 0 }, y: { x: lp.y, v: 0 }, z: { x: lp.z, v: 0 },
      s: { x: 1, v: 0 }, roll: { x: 0, v: 0 },
      pres: new THREE.Vector3(), presQ: new THREE.Quaternion(),
      // v3 · Landeplatz, beim Eintritt in `tuck` EINMAL genommen (siehe dort). `null` = noch nicht.
      aX: null, aY: null, aH: null, aW: 0, aHh: 0,
      // Eingerastete Ankunft am Vorzeigeort. Ab dann zählt der Halt reine Zeit — die Drift kann
      // ihn nicht mehr verlängern (siehe update).
      angekommen: false,
      onArrive,
      side: side === -1 ? -1 : 1,   // Block 3 · Kollisionsseite, EIN Vorzeichen für die ganze Reise
    });
    started++;
    return true;
  }

  function update(dt) {
    if (!flying.length) return;
    const d = Math.min(0.05, dt);          // dieselbe Klemme wie der Frame-Loop
    for (let i = flying.length - 1; i >= 0; i--) {
      const f = flying[i];
      f.t += d;
      // ⚠ **Lebensalter, das NIE zurückgesetzt wird — und der harte Notausstieg.**
      // `f.t` wird bei jedem Phasenwechsel genullt, also gibt es ohne dieses Feld keine Gesamtuhr,
      // und die 2,5-s-Sicherung in `lay` ist von den zwei Phasen aus, die hängen können,
      // unerreichbar. Beide Phasenübergänge hängen an ABSOLUTEN Schwellen (`nah < 0.02`,
      // `rest < 0.035`) ohne Rand — verfehlt eine davon, bleibt die Karte in `sky-cards` ewig im
      // Zustand `flying`: keine Drift, kein Treffertest, kein Respawn, kein `recycle`. Das Mesh
      // ist dann aus einem Pool von SECHS dauerhaft verloren, `hud.add` feuert nie, der Himmel
      // leert sich langsam — und nichts sagt, warum.
      // Das ist genau die Fehlerklasse aus dieser Sitzung: ein Zustand, der nur in einem Zweig
      // beendet wird. Die Sicherung gehört deshalb VOR die Zustandsmaschine und ist
      // phasenunabhängig — sie fragt nicht, wo die Karte steht, sondern nur, wie lange schon.
      f.age += d;
      if (f.age > P.maxAge) {
        verloren++;
        f.taken.release();
        flying.splice(i, 1);
        if (f.onArrive) { try { f.onArrive(); } catch (e2) {} }   // der Zähler springt trotzdem
        continue;
      }

      // ── Ziele je Phase. Die Zustandsmaschine setzt ZIELE; bewegen tun die Federn.
      //
      // ⚠ **Georg über ALLE meine Animationen: „sie zeigen KEINE FLÜSSIGE TRANSITION … hier
      // stoppt die Animation."** Er hat recht, und die Ursache war nicht Technik, sondern Entwurf:
      // **ich habe Stillstände eingebaut und sie „Schläge" genannt.**
      //  · `hit` setzte das Ziel auf die EIGENE Position — ein Stillstand von 0,16 s, per
      //    Definition. Dazu ein `continue`, das die Federn übersprang.
      //  · `hold` ließ die Feder 1,05 s in Ruhe stehen.
      // Ein Stillstand ist im Kino ein Akzent, weil dort die Kamera auch steht. Hier fliegt die
      // Kamera mit 0,28/s weiter — ein ruhendes Objekt liest deshalb nicht als Betonung, sondern
      // als **Hänger**. Animatoren nennen die Lösung *moving hold*: Betonung durch VERLANGSAMUNG,
      // nie durch Anhalten.
      // Jetzt hat die Karte **von der ersten bis zur letzten Sekunde ein Ziel, das nicht ihre
      // eigene Position ist**, und die Federn laufen in jedem Bild. Der Einschlag ist nur noch ein
      // Impuls auf die Maßstab-Feder plus Glut — beides liegt AUF der laufenden Bewegung.
      let stiff = P.posStiff, damp = P.posDamp, rollZiel = 0, tiltZiel = 0;
      if (f.phase === 'hit' || f.phase === 'present') {
        const R0 = rahmen();
        lokalAusBild(R0.x + R0.w * 0.5, R0.y + R0.h * 0.46, P.presentDepth, _l);
        tiltZiel = P.presentTilt;
        // Block 3 · schon der Einschlag zielt auf die Seite, aus der die Karte kam — nicht erst
        // `tuck`. Dieselbe Feder, dasselbe Vorzeichen, die ganze Reise lang.
        rollZiel = f.side * P.presentSpin;

        if (f.phase === 'hit') {
          // Der Einschlag: EIN Impuls auf den Maßstab (ein Stoß, den die Feder aussetzen lässt)
          // und eine kurze Glut. Kein eigenes Ziel, kein Stillstand, keine Phasengrenze im Weg —
          // die Fahrt zum Vorzeigeort hat schon begonnen.
          if (!f.gepuncht) { f.s.v += P.punchV; f.gepuncht = true; }
          if (f.mat.color) {
            const k = Math.min(1, f.t / P.hit);
            f.mat.color.copy(f.taken.color0 || f.mat.color)
              .multiplyScalar(1 + Math.sin(k * Math.PI) * (P.flash - 1));
          }
          if (f.t >= P.hit) {
            f.phase = 'present'; f.t = 0;
            if (f.mat.color && f.taken.color0) f.mat.color.copy(f.taken.color0);
          }
        } else {
          // ── Ankunft messen, DANN verzieren — in dieser Reihenfolge ────────────────────────────
          // ⚠ Ich hatte es umgekehrt: die Drift wurde auf `_l` addiert und der Ankunftsabstand
          // DANACH aus `_l` gemessen. Die Zierbewegung schob damit das Ziel immer wieder aus der
          // 14-px-Toleranz und blockierte genau den Zähler, der den Halt beendet. Gemessen:
          // `hold: 1.05` lief **1,65–1,71 s** (+60 %), und wie weit hängt am Verhältnis von
          // `holdDrift` zu `presentTolPx` — zwei Zahlen, die nie miteinander zu tun haben sollten.
          // **Ein Sichteffekt darf keine Zeit steuern.**
          // Also: Ankunft am UNVERZIERTEN Ziel prüfen, einmal einrasten, danach zählt reine Zeit.
          // Ein eingerasteter Zustand kann von einer Zierbewegung nicht mehr aufgehoben werden.
          if (!f.angekommen) {
            const nah = Math.hypot(_l.x - f.x.x, _l.y - f.y.x, _l.z - f.z.x) * pxJeWelt(P.presentDepth);
            if (nah < P.presentTolPx && Math.abs(f.s.v) < 0.6) f.angekommen = true;
          } else {
            f.ruht = (f.ruht || 0) + d;
          }
          // **Der BEWEGTE Halt** — erst JETZT, nach der Messung. Das Ziel driftet langsam weiter,
          // während die Karte lesbar ist: quer mit einem Sinus, dazu ein leises Steigen. Die Karte
          // hört nie auf sich zu bewegen; das ist der Unterschied zwischen Betonung und Hänger.
          const r = f.ruht || 0;
          _l.x += Math.sin(r * 1.6) * P.holdDrift;
          _l.y += r * P.holdRise;
          if (r >= P.hold) { f.phase = 'tuck'; f.t = 0; }
        }
      } else {
        // ── Schlag 3 · EIN Bogen zum Stapel, ohne Halt ───────────────────────────────────────
        // ⚠ Georg: „die Karte STOPPT vor dem Stapel, flackert kurz und wird dann halb-richtig
        // weiter bewegt auf Stapel". Das ist ein Konstruktionsfehler, kein Timing-Fehler, und er
        // ist mein eigener: ich hatte einen **Wegpunkt als Federziel** gebaut (erst „über und
        // außerhalb", dann umschalten auf „auflegen").
        // **Eine Feder HÄLT AN ihrem Ziel** — sie bremst hinein, kommt zur Ruhe, und beim
        // Umschalten springt das Ziel 34 px seitlich und 26 px hoch: Stopp, Ruck, Neustart. Dazu
        // sprangen im selben Bild Steifigkeit (42 → 15) und Neigung (Kippung → 0). Das war das
        // Flackern. Ein Gleiten geht durch einen Punkt HINDURCH; es stoppt nicht darin.
        //
        // Richtig ist deshalb: **ein Ziel, ein Bogen.** Die Karte zielt immer auf den Landeplatz;
        // solange sie weit weg ist, wird das Ziel nach oben und nach innen VERSETZT, und der
        // Versatz verschwindet mit der Nähe. Der Weg ist dann eine Kurve durch die Gegend, in der
        // der Wegpunkt lag — ohne Naht, ohne Halt, ohne Umschalten.
        // Dieselbe Bauform wie das Ausweichen an Landmarken (S7b): ein Versatz, der von selbst auf
        // null zurückgeht, statt eines zweiten Ziels. Steifigkeit, Dämpfung und Neigung blenden mit
        // demselben `k`, also kann auch dort nichts springen.
        //
        // Einfrieren, EINMAL. Ausnahme: ändert sich die Fenstergröße mitten im Flug, ist der
        // gemerkte Pixelort falsch — dann neu nehmen. Ein eingefrorener Wert braucht die Bedingung,
        // unter der er gilt, sonst wird aus der Sicherung ein zweiter Fehler.
        // Einfrieren, EINMAL — neu nehmen nur, wenn sich der RAHMEN ändert (Fenstergröße oder
        // Canvas-Größe; in einem Editor kann sich das Canvas ohne das Fenster ändern).
        const Rf = rahmen();
        if (f.aX == null || f.aW !== Rf.w || f.aHh !== Rf.h) {
          const a0 = anchor();
          f.aX = a0.x; f.aY = a0.y; f.aH = a0.h || 33;
          f.aW = Rf.w; f.aHh = Rf.h;
        }
        f.zielPx = f.aH;
        const pxW = pxJeWelt(P.depth);
        // 1) Der ECHTE Landeplatz — über der Stapelkante, nie darauf (Schichten-Wahrheit im Kopf).
        lokalAusBild(f.aX, f.aY - P.layAbovePx, P.depth, _lz, 0);
        // 2) Wie weit ist sie noch? In Pixeln, wie alle Tore dieser Datei.
        const restPx = Math.hypot(_lz.x - f.x.x, _lz.y - f.y.x, _lz.z - f.z.x) * pxW;
        // 3) `k` = 1 weit weg, 0 am Ziel. Quadratisch, damit der Bogen sich zum Schluss auflegt
        //    statt einzuschwenken.
        const k0 = Math.min(1, restPx / P.biasRefPx);
        const k = k0 * k0;
        // Halbe Kartenbreite in Pixeln — sie wächst mit dem Maßstab, also muss die Klemme sie
        // kennen. Während des Anflugs ist die Karte noch groß; genau dann wurde sie beschnitten.
        const halbPx = (f.hoehe * f.s.x * 1.74 * 0.5) * pxW;
        // 4) Dasselbe Ziel, mit einem Versatz, der mit `k` verschwindet: nach oben und nach INNEN
        //    (in einer Bildecke ist das der einzige freie Raum — außen würde beschnitten).
        lokalAusBild(f.aX + P.outwardPx * k,
                     f.aY - P.layAbovePx - P.overshootPx * k,
                     P.depth, _l, halbPx * k);
        // 5) Alles andere blendet mit demselben `k`. Keine Umschaltung, also keine Naht.
        stiff = P.layStiff + (P.tuckStiff - P.layStiff) * k;
        damp = P.layDamp + (P.posDamp - P.layDamp) * k;
        // Weiterdrehen in DERSELBEN Richtung wie beim Vorzeigen (`f.side`) — die Drehung geht
        // ohne Vorzeichenwechsel aus der Großansicht ins Einstecken über.
        rollZiel = f.side * P.tuckSpin * Math.PI * 2;
        tiltZiel = P.presentTilt * k;
        f.restPx = restPx;
      }

      // ── Die Federn. Vier Zeilen, und sie sind die ganze Bewegung.
      spring(f.x, _l.x, stiff, damp, d);
      spring(f.y, _l.y, stiff, damp, d);
      spring(f.z, _l.z, stiff, damp, d);
      const zielS = f.phase === 'tuck'
        // Zielmaßstab aus der PIXELHÖHE des HUD-Blatts: so ist die 3D-Karte im Moment der
        // Übergabe exakt so groß wie das Blatt, und der Wechsel ist unsichtbar.
        ? (bildHoehe(P.depth) * ((f.zielPx || 33) / rahmen().h)) / Math.max(1e-4, f.hoehe)
        // `hit` und `present` teilen dasselbe Maßstabsziel — sonst wäre der Phasenwechsel ein
        // Sprung im Sollwert, und genau das erzeugt den sichtbaren Ruck (Fehlerklasse 19).
        : (bildHoehe(P.presentDepth) * P.presentFill) / Math.max(1e-4, f.hoehe);
      spring(f.s, zielS, P.sclStiff, P.sclDamp, d);
      spring(f.roll, rollZiel, P.tiltStiff, P.tiltDamp, d);
      if (f.tilt == null) f.tilt = { x: 0, v: 0 };
      spring(f.tilt, tiltZiel, P.tiltStiff, P.tiltDamp, d);

      // ── Kamera-Raum → Welt. EIN Ort, an dem umgerechnet wird.
      f.mesh.position.set(f.x.x, f.y.x, f.z.x);
      camera.localToWorld(f.mesh.position);
      _zq.setFromAxisAngle(_z, f.tilt.x + f.roll.x);
      f.mesh.quaternion.copy(camera.quaternion).multiply(_zq);
      f.mesh.scale.setScalar(Math.max(0.02, f.s.x));
      anschnittMessen(f);   // v9 · messen, nicht raten (BUG-03)

      // Angekommen ist eine ENTFERNUNG, keine Uhr: die Feder entscheidet, wann sie da ist — und
      // zwar in BILDPIXELN gemessen, weil „steht sie an der Stapelkante" eine Bildaussage ist,
      // keine Weltaussage. Es gibt nur noch EINE Landephase; `lay` als eigener Zustand ist mit dem
      // Wegpunkt entfallen.
      if (f.phase === 'tuck') {
        // Übergeben, sobald sie über der Kante steht und ruhig ist — nicht erst, wenn sie das
        // Blatt deckt. Sie soll es nicht decken. `restPx` ist der Abstand zum ECHTEN Landeplatz,
        // im selben Bild gerechnet, nicht zum versetzten Zwischenziel.
        if (((f.restPx || 1e9) < P.endTolPx && Math.abs(f.y.v) * pxJeWelt(P.depth) < 90) || f.t > 3.5) {
          f.taken.release();
          flying.splice(i, 1);
          arrived++;
          if (f.onArrive) { try { f.onArrive(); } catch (e2) {} }
        }
      }
    }
  }

  return {
    name: 'card-flight', params: P, launch, update,
    get flying() { return flying.length; },
    setEnabled(on) { P.on = !!on; },
    get enabled() { return P.on; },
    // ⚠ Block 3 (Georg): „Großansicht verschwindet von allein, Klick beschleunigt (kein OK-Knopf)."
    // „Von allein" ist schon da (`r >= P.hold` oben) — das hier ist NUR der Klick-Vorzug: er
    // versetzt den Halt-Zähler ans Ende, die Feder macht den Rest genauso wie beim natürlichen Ende
    // (kein zweiter Übergang, keine neue Naht). Wirkt nur auf Karten, die schon eingerastet sind
    // (`angekommen`) — ein Klick, bevor sie steht, hätte kein „Ende" zu beschleunigen.
    presenting() { return flying.some((f) => f.phase === 'present' && f.angekommen); },
    skipPresent() {
      let n = 0;
      for (const f of flying) if (f.phase === 'present' && f.angekommen) { f.ruht = P.hold; n++; }
      return n;
    },
    anschnittTor, anschnittReset,
    report() { return { an: P.on, unterwegs: flying.length, gestartet: started, angekommen: arrived,
                        // `verloren` ist die Zahl, die eine stille Fehlfunktion laut macht:
                        // steht sie über 0, hat ein Sammelvorgang seinen Weg nicht gefunden.
                        verloren,
                        alterS: flying.length ? +Math.max(...flying.map((f) => f.age)).toFixed(2) : 0,
                        phasen: flying.map((f) => f.phase),
                        modell: 'Federn (card-carrier.spring)', halt: P.hold,
                        steifigkeit: [P.posStiff, P.sclStiff, P.tuckStiff],
                        bildanteil: P.presentFill, eigeneMeshes: 0 }; },
  };
}
