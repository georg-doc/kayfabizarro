/* boxelblitz-v4/dice.v4.js — FORK VON `boxelball-v1/dice.v1.js`, EINE ÄNDERUNG DRIN (V4-S6).

   DIE EINE ÄNDERUNG: die BEWEGUNG kommt aus `boxelblitz-v4/cube.v1.js` — einem Kastenkörper mit
   Trägheit, Kontaktnormalen und Reibung am Kontaktpunkt. Alles andere ist byteweise die v1: das
   Ugur-Modell samt Tönung, Halten/Aufladen/Zielen, die Tusche-VFX, der Klangerzeuger, die
   Ereignisse nach außen.

   WARUM: der Würfel der v1 ist physikalisch ein KREIS (Z. 118 dort: `F.r = F.edge * 0.55`, Inkreis
   plus 10 %, übernommen aus einem FLIPPER-Löser). Georgs sieben Befunde vom 06.09. haben alle
   diese eine Ursache; die Zuordnung Punkt für Punkt steht in `docs/boxelblitz-v4/MODELL_wuerfel_v1.md`
   §1. SSOT des Modells ist `uploads/KFB Dice_Movement+Physics_v1.md`.

   ZWEI DINGE, DIE HIER VERSCHWINDEN, UND DAS IST DER PUNKT:
     1) Die GEFÄLSCHTE DREHUNG. `dice.v1` rechnete `mesh.rotation.x += (vy/e)·dt·1,5` — eine
        Kugeldrehung aus der Geschwindigkeit — und RASTETE sie danach auf Vierteldrehungen ein.
        Genau dieses Einrasten ist Georgs »er ruht auf Kante«: es zieht die Lage zur nächsten
        Fläche, ohne dass eine Fläche trägt. Jetzt kommt die Drehlage aus dem Quaternion des
        Körpers — keine Fälschung, kein Einrasten, und `stats().kante` misst zum ersten Mal die
        WIRKLICHE Schiefe (Winkel der Hochachse zur nächsten Flächennormale).
     2) Der GASSEN-NOTBEHELF (`pitLift` + `hold`): »erst hoch, dann los«, weil ein Kreis aus einem
        Schacht von einer Zelle seitlich nie herauskam. Ein Körper kippt sich hinaus (gemessen in
        Vorrichtung 09: er erklimmt eine Stufe von 0,611 und bleibt oben liegen). Notbehelfe
        verstecken Fehler — also weg damit, und statt dessen wird das Steckenbleiben GEZÄHLT
        (`dev.audit`). Der Rechenweg bleibt als toter Code stehen: er ist der Rückweg.

   NICHT MEHR AUF DEM WEG (unverändert stehen geblieben, als Rückweg lesbar): `stepDieKreis`,
   `solveGrid`, `bounce`, `wall`, `touch`, `pitLift`. Sie sind die Kugel-Fassung.

   RÜCKWEG: im Wirt eine Zeile auf `./boxelball-v1/dice.v1.js?a14`.
   ============================================================================ */

/* boxelball-v1/dice.v1.js — MODUL B · DER WÜRFEL.

   Meldet an: `three`, `assets` (Ugur-GLB), `rng`, `clock`, `pointer`, `audio`
   view:3d · determinism:seeded

   ============================================================================
   WAS KOPIERT IST, UND WAS DIE NAHT IST
   ----------------------------------------------------------------------------
   KOPIERT aus `ws1-buehne/spinballcast-v2/game.v2.js` (Regel 2: übernehmen heißt kopieren):
     · das gesäte Zufallsrad `rand()`                                      (Z. 108–114)
     · die Auflösung eines Kontakts: Restitution, Coulomb-Reibung, `restE`,
       Drall an der Bande                                                  (`resolve`, Z. 466–…)
     · Coulomb-Rollreibung statt multiplikativer Dämpfung, Ruheschwelle    (`stepDie`)
     · der abgeleitete Geschwindigkeitsdeckel `MAXV = kontaktradius · hz · 0.5`
     · der Cartoon-Deformer (Federrate zurück, Volumenerhaltung)           (`deform`, `drawDice`)
     · das Ugur-Modell VOLLSTÄNDIG samt gezielter Tönung nach Helligkeit   (`tintClone`, Z. 300–…)
       — inklusive der zwei bezahlten Befunde: das GANZE Modell nehmen (Körper + Augen, sonst
       Löcher) und `transparent:false` erzwingen (sonst sieht man durch die Augen).
     · die Tusche-Sprites und Wellenringe als VFX, normale Mischung statt additiv
     · der Klang-Synth (zwei Primitive, eine Antwortkurve, Material Pappe/Gummi)

   DIE NAHT — hier endet die Kopie, hier beginnt dieses Spiel:
     1) In SpinballCast fragt der Löser eine LISTE VON SEGMENTEN. Hier fragt er ein RASTER
        (`boxel.surfaceAt` / `boxel.at`). Die Auflösung ist dieselbe Rechnung, die ABFRAGE ist neu.
     2) SpinballCast rechnet zweidimensional. Hier kommt ein DRITTER Kanal dazu (z, vz): der
        Würfel fällt in Lücken, prallt vom Blatt wie von einem Trampolin zurück und stößt an eine
        unsichtbare Decke. Das steht so im Design-Dokument (§2, §3) und ist nicht ableitbar aus
        einem flachen Löser.
     3) Kein Magazin, kein Drain, keine Kette. Der Würfel wird GEHALTEN und AUFGELADEN
        (Haltedauer = Energie, Zeigerrichtung = Richtung) — Georgs Vorgabe für dieses Spiel.
   ============================================================================ */

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
/* ⚠ V4-S7: DIE BEWEGUNG KOMMT JETZT AUS `cube.v2.js` — cannon-es, nach Georgs Vorbildern
   (`uuuulala/Threejs-rolling-dice-tutorial` und `pmndrs/cannon-es`). Die Schnittstelle ist
   dieselbe wie in `cube.v1.js`, deshalb ist das hier die EINZIGE Zeile, die sich ändert.
   RÜCKWEG: `./cube.v1.js` (eigener Löser, 8 von 10 flachen Landungen). */
/* ⚠ V4-S9: DIE BEWEGUNG KOMMT AUS `cube.v3.js` — cannon-es mit dem MATERIALMODELL (sechs
   Oberflächen, je Paar eine Restitution). `cube.v2` hatte EINE globale Restitution 0,3, die Zahl
   des Vorbilds, das nur einen Tisch kennt — das war Georgs »nasser Sack«.
   RÜCKWEG: `./cube.v2.js` (eine Restitution) oder `./cube.v1.js` (eigener Löser). */
import { createBody, makeGridWorld } from './cube.v3.js?a9';

/* Dasselbe Modell wie in SpinballCast und Travel — KEIN NEUBAU (Georg, 26.8.). */
const DICE_URL = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/dice_ugur_lowpoly.glb';

/* blau · gelb · rot — Georgs Reihenfolge, wörtlich die Hexwerte aus `game.v2.js` Z. 353. */
export const DIE_HEX = ['#3e6fb0', '#e0a92e', '#c14435'];

export function createDice({ THREE, stage, boxel, params = {} }) {
  const P = Object.assign({
    count: 1,              // ein Würfel zu Beginn, bis drei (Design-Dokument §3)
    max: 3,
    edgeFrac: 0.66,        /* Würfelkante als Anteil der ZELLBREITE. ABGELEITET, in drei Schritten:
                              (1) er muss in eine Lücke von einer Zelle fallen können
                                  (Design-Dokument §2), also < 1;
                              (2) er darf eine Grube nicht ÜBERBRÜCKEN — sonst verkeilt er sich
                                  diagonal auf dem Rand und liegt nie flach. Bedingung: s·√2 < Weite;
                              (3) ⚠ UND DIE WEITE IST NICHT 1: die Zellen sind NICHT quadratisch.
                                  Eine Zeile ist gemessen 0,9556 Zellbreiten hoch (`cellAR`), also
                                  gilt s·√2 < 0,9556 → s < 0,676. Mit 0,68 war die Diagonale 0,962
                                  gegen 0,9556 — knapp zu breit, und genau das waren die letzten
                                  2 von 12 Würfen, die schief stehen blieben (34° und 31°).
                                  0,66 gibt eine Diagonale von 0,933. Meine erste Ableitung hatte
                                  mit der Zellbreite gerechnet statt mit der kleineren der beiden
                                  Weiten. */
    hz: 480,               // fester Zeitschritt — Zahl aus game.v2 (Neon-Gutter)
    maxFrame: 0.25,
    gravityZ: 24,          // Zellbreiten/s², senkrecht
    roll: 3.2,             /* Coulomb-Rollreibung auf der Boxel-Fläche, in Zellbreiten/s².
                              ABGENOMMEN AN EINER ZAHL, nicht am Gefühl: `dev.audit()` zählt, wie
                              viele Würfe binnen 5 s zur RUHE kommen. Mit 0,34 (der Zahl aus
                              SpinballCast) waren es 0 von 6 — dort zieht die Kippung den Würfel in
                              den Drain, hier ist das Feld flach und die Reibung ist das EINZIGE,
                              was ihn anhält. Aus 16 Einheiten/s Anfangstempo folgt bei 3,2 ein
                              Auslauf von rund 8 s, also drei bis vier Feldlängen. */
    rollPaper: 4.6,        // auf dem freien Blatt bremst es stärker (Pappe, nicht Glas)
    rest: 0.05,
    restE: 0.22,
    eWall: 0.42,           // Bande (unsichtbare Seitenwand)
    eBoxel: 0.38,          // seitlicher Anprall an eine höhere Zelle
    eBumper: 0.92,         // Bumper-Gesicht
    kickBumper: 1.05,
    eTop: 0.30,            // Aufprall auf eine Boxel-Oberseite
    ePaper: 0.62,          /* das Blatt federt WIE EIN TRAMPOLIN (Design-Dokument §2:
                              »rebound upward like a trampoline or springboard«) */
    eCeil: 0.55,
    ceilCells: 0,          /* 0 = ABGELEITET aus der kurzen Feldseite (siehe `measure`). Eine Zahl > 0
                              setzt die Decke in Zellbreiten von Hand — Rückweg auf 3,4. */
    /* V4-S31 · HITSTOP (`kfb-cartoon-animation_v2` §11.4: 40–95 ms nach dem Kontakt). Die Wucht
       wird über ZEIT gelesen, nicht nur über Verformung — §14 verbietet ausdrücklich, Cartoon als
       Ersatz für Timing zu behaupten, und genau das haben wir bisher getan.
       `hitstop` ist die HÖCHSTdauer bei voller Wucht; schwache Treffer bekommen weniger, unter der
       Schwelle nichts. Rückweg: `setParams({ hitstop: 0 })`. */
    hitstop: 0.06, hitstopMin: 0.03, hitstopWucht: 6, hitstopArm: 0.025,
    deform: 0.34, deformBack: 9.0,
    /* ⚠ V4-S21: die Zieldarstellung ist als Fehlschlag stillgelegt (Begründung in `drawAim`).
       `aimShow: true` gibt sie zurück. */
    aimShow: false,
    /* Fortwährende Flugstreckung: Stärke und ihr Bezugstempo. `vRef` ist ABGELEITET — das Tempo des
       stärksten Wurfs (voller Druck UND voller Zug), damit »volle Streckung« genau dort steht. */
    /* ⚠ V4-S24: die Gummi-Verformung ist auf null gestellt (Georgs Urteil, Begründung in
       `drawDice`). Der Würfel bleibt eine saubere Kiste; gestaucht wird nur, wenn er auf einer
       Fläche liegt. Zurück zur Gummifassung: round 0,62 · stretch 0,22 · pull 0,26 · bulge 0,55. */
    pull: 0, bulge: 0, hoch: 0.07, round: 0,
    stretch: 0, vRef: 24,
    /* V4-S25 · Georgs Weg (b): die Ladung zeigt sich AM WÜRFEL, ohne Overlay.
       `lean`   Höchstneigung gegen die Schussrichtung im Bogenmaß (14° bei vollem Zug) —
                eine Drehung um die vordere Bodenkante, die keinen Platz neben dem Würfel braucht.
       `tremor` Zittern bei hoher Ladung, in Kantenlängen (0,022 ≈ ein Bildpunkt bei 45 px Zelle). */
    /* ⚠ V4-S30 · GEORGS DREI VORGABEN AM LADEBILD:
       »das Zittern beim Ziehen würde ich noch versuchen zu verhindern« → `tremor: 0`.
       »vielleicht noch ein bisschen mehr Kippung je nach Zugstärke« → `lean` von 14° auf 24°.
       »mit der aktuellen Sprunghöhe wird er ein bisschen zu groß — dezenter« → `hoch` halbiert.
       RÜCKWEG: tremor 0,022 · lean 0,244 · hoch 0,16. */
    lean: 0.42, tremor: 0,
    /* `spinKick` · Drall aus einem Aufprall in rad/s bei voller Wucht (V4-S27).
       ⚠ ERSTE ZAHL WAR 5,2 UND HAT GENAU DEN FEHLER GEMACHT, VOR DEM MEIN EIGENER KOMMENTAR WARNT:
       gemessen kippte der Würfel auf 30–50°, blieb bei 25–49° liegen und kam in **4 von 4** Fällen
       NICHT zur Ruhe. Ein Drall, der den Würfel auf eine Kante legt, ist keine Belebung, sondern
       der Rückfall in V4-S16. 1,6 rad/s dreht ihn in einer Zehntelsekunde um 9° — sichtbar als
       Kippen, zu wenig zum Umlegen. */
    spinKick: 1.6,
    /* `press` · Höchststauchung beim Laden, eigene Zahl (nicht die des Aufpralls).
       ⚠ V4-S27 · GEORG SIEHT DIE HÖCHSTSTAUCHUNG WEITER NICHT — und die Ursache steckt in seiner
       eigenen Mechanik: das ZIEHEN friert die Druckmessung ein (`grab.eFix`), also bleibt die
       Ladung bei dem Wert stehen, den sie beim Anfassen der Richtung hatte. Wer zügig zielt,
       kommt nie über Ladung 0,2 — und 0,2 ergab mit der Wurzelkurve 13 %. Die vollen 30 % waren
       nur erreichbar, wenn man über eine Sekunde still hält, ohne zu ziehen.
       Also die Kurve STEILER (Exponent 0,4 statt 0,5) und die Höchststauchung auf 0,36: bei Ladung
       0,2 sind es jetzt 19 %, bei 0,5 sind es 28 %. Die Alternative wäre eine kürzere Ladezeit —
       die ändert aber die Sprunghöhe und gehört Georg, nicht mir. */
    /* ⚠ V4-S29 · STUFENLOS, NICHT VORNEÜBER. Georg: »das sieht man jetzt so ein bisschen, aber es
       ist nicht stufenlos — es scheint direkt nach dem ersten und auch kurzen Klick die volle
       Breite anzunehmen.« Er hat recht, und es war meine Überkorrektur: der Exponent 0,4 ist
       vorne steil, hinten flach — bei Ladung 0,05 standen schon 30 % der Stauchung, bei 0,15
       fast die Hälfte. Damit war das Wachsen unsichtbar und der Sprung sichtbar.
       Jetzt LINEAR (Exponent 1) mit größerem Endwert: das Wachsen ist gleichmäßig über die ganze
       Ladezeit, und weil die Ladezeit seit V4-S27c 0,55 s ist, ist der Endwert erreichbar. */
    press: 0.40, pressKurve: 1,
    /* ⚠ V4-S27c · VON 1,05 s AUF 0,55 s — die eigentliche Ursache für »Höchststauchung sehe ich
       nicht«. Die Pose selbst ist gemessen unmissverständlich (bei voller Ladung 0,669/1,308/1,308,
       also 33 % gestaucht und **1,95-mal breiter als hoch**) — sie war nur nicht ERREICHBAR: das
       Ziehen friert die Druckmessung ein (Georgs eigene Vorgabe), und wer nach 0,3 s zu zielen
       beginnt, steht bei Ladung 0,29. Mit 0,55 s ist derselbe Griff bei 0,55.
       Die Zuordnung Ladung → Sprunghöhe bleibt unverändert; nur die Zeit bis zum Anschlag ist
       kürzer. RÜCKWEG: `setParams({ chargeTime: 1.05 })`. */
    chargeTime: 0.55,      // Sekunden bis volle Ladung
    jumpMin: 0.28,         // niedrigster Sprung in Zellbreiten — ein Pflug knapp über dem Blatt
    reichMin: 0.15,        /* kürzester Wurf in Zellbreiten — ABGELEITET, nicht gewählt: bei
                              vollem Druck (vZ 11,5) braucht der Würfel 0,075 s, um die Höhe einer
                              Zelle (0,78) zu erreichen; um in dieser Zeit NICHT gegen die Flanke
                              des Nachbarklotzes zu stossen, darf er höchstens 0,17 Zellen weit
                              kommen, also vH ≤ 2,3 = √(2·μ·g·0,15). Mit dem ersten Wert (1,4 →
                              vH 7,0) endete jeder reine Druckschuss gemessen nach 0,22 Zellen an
                              der nächsten Flanke — ein Sprung, der nie über etwas hinwegkam.
                              Voller Zug trägt weiter über das ganze Feld. */
    zugVoll: 3,            // Zugweite in Zellbreiten für volles Tempo
    launchMin: 0.8, launchRange: 3.6,   // Ladekurve (Anteil von vMax) — volle Ladung trägt über das Feld
    launchDeg: 25,         // Abwurfwinkel in Grad — der EINE gesetzte Wert des Wurfs
    launchPower: 1,        // Faktor auf die abgeleitete Wurfweite — Georgs Regler für das Gefühl
    jitter: 0.09,
    audio: false,          // Ton standardmäßig AUS (Gründungsdokument §3.3)
    seed: 0x9e3779b9,
  }, params);

  const root = new THREE.Group();
  root.name = 'kfb-dice';
  const noMeasure = (o) => { o.traverse((x) => { x.userData.noMeasure = true; }); return o; };
  root.add = ((add) => (...objs) => { objs.forEach(noMeasure); return add(...objs); })(root.add.bind(root));
  noMeasure(root);
  stage.panelGroup.add(root);

  /* ---- gesätes Rad · game.v2.js Z. 108 ---- */
  const rndState = { s: P.seed | 0 };
  function rand() {
    rndState.s = (rndState.s + 0x6d2b79f5) | 0;
    let t = Math.imul(rndState.s ^ (rndState.s >>> 15), 1 | rndState.s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  const listeners = [];
  const emit = (k, d) => { for (const f of listeners) { try { f(k, d || {}); } catch (e) {} } };

  const F = { cell: 1, edge: 1, r: 0.5, left: 0, right: 0, bot: 0, top: 0, ceil: 1, ready: false };
  let MAXV = 8, time = 0, acc = 0;

  function measure() {
    const g = boxel.geometry();
    const cl = stage.metrics().cardLocal;
    F.cell = g.cell;
    F.edge = g.cell * P.edgeFrac;
    F.r = F.edge * 0.55;                    // Inkreis + 10 % — game.v2 `queryFirst`
    /* ⚠⚠ V4-S33 · DIE BANDEN STANDEN AM KARTENRAND, NICHT AM FELDRAND — und das ist Georgs
       »Würfel steckt in der Karte«. Gemessen: die Karte reicht von −5,000 bis +5,000, das
       BOXELFELD aber nur von −4,700 bis +4,700 (12 Spalten · 0,7833) und von −2,620 bis +2,620
       (7 Reihen · 0,7485). Die Wände lagen also **0,30 außerhalb** des Feldes in x und 0,167 in y —
       bei einer Würfelhälfte von 0,26 passt er dort vollständig hinein. Auf diesem Streifen ist
       nicht mehr das flache Blatt, sondern der aufgestellte Papprückenrand des Kartenstapels: der
       Würfel sitzt mit der Sohle korrekt auf z = 0 (gemessen 0,0000) und sieht trotzdem halb
       versunken aus. **Die Sohle war nie das Problem — der Ort war es.**
       Jetzt sind die Banden die Grenzen des FELDES. Damit kann er den Streifen nicht mehr
       erreichen, und alle Zahlen, die an der Feldbreite hängen (Wurfweite, Vorhersage, Decke),
       rechnen mit der Fläche, auf der wirklich gespielt wird.
       RÜCKWEG: die vier Zeilen auf `cl.cx ± cl.w/2` bzw. `cl.cy ± cl.h/2`. */
    F.left = g.x0; F.right = g.x0 + g.cols * g.cell;
    F.bot = g.y0; F.top = g.y0 + g.rows * g.rowH;
    /* ⚠ V4-S31 · DIE DECKE IST JETZT ABGELEITET, NICHT GEWÄHLT. Georgs Frage: »wie ist denn die
       Höhe, die du mit 3,40 bezeichnest — ist das die kurze Seite der Karte? Das würde ich als
       Minimum sehen, aber dass wir das wie einen Quader sehen, der genau die Kartenproportionen
       hat, und die kurzen Seiten quasi quadratisch sind.«
       3,40 war eine gewählte Zahl (`ceilCells`) und stand in keinem Verhältnis zur Karte. Jetzt ist
       die Decke die **kurze Seite des Feldes** — damit ist der Spielraum ein Quader, dessen
       Querschnitt an der kurzen Seite ein QUADRAT ist, genau wie beschrieben. Bei 16:9 ist das
       ziemlich genau die doppelte Höhe von vorher.
       `ceilCells > 0` überschreibt sie weiterhin (Rückweg: `setParams({ ceilCells: 3.4 })`). */
    F.ceil = P.ceilCells > 0 ? g.cell * P.ceilCells
                             : Math.min(F.right - F.left, F.top - F.bot);
    /* Der Deckel ist ABGELEITET: Weg je Schritt < Kontaktradius, sonst schlägt der Würfel durch
       eine Wand ohne Dicke. Löser-Invariante, keine Spielzahl (game.v2). */
    MAXV = F.r * P.hz * 0.5;
    F.ready = true;
  }

  /* ================= das Modell ================= */
  const geoDie = new THREE.BoxGeometry(1, 1, 1);
  const proto = { node: null, kind: 'fallback', note: 'GLB lädt noch', mats: 0, tinted: 0 };

  const PIP = { 1: [[.5, .5]], 2: [[.28, .28], [.72, .72]], 3: [[.26, .26], [.5, .5], [.74, .74]],
                4: [[.28, .28], [.72, .28], [.28, .72], [.72, .72]],
                5: [[.26, .26], [.74, .26], [.5, .5], [.26, .74], [.74, .74]],
                6: [[.28, .24], [.72, .24], [.28, .5], [.72, .5], [.28, .76], [.72, .76]] };
  function pipTexture(n, hex) {                       // game.v2.js Z. 328 — unverändert
    const S = 192, c = document.createElement('canvas');
    c.width = c.height = S;
    const g = c.getContext('2d');
    g.fillStyle = hex; g.fillRect(0, 0, S, S);
    const rg = g.createRadialGradient(S * .34, S * .3, 0, S * .5, S * .5, S * .8);
    rg.addColorStop(0, 'rgba(255,255,255,0.20)'); rg.addColorStop(1, 'rgba(0,0,0,0.16)');
    g.fillStyle = rg; g.fillRect(0, 0, S, S);
    g.strokeStyle = 'rgba(23,20,15,0.55)'; g.lineWidth = S * 0.035;
    g.strokeRect(g.lineWidth / 2, g.lineWidth / 2, S - g.lineWidth, S - g.lineWidth);
    for (const [u, v] of PIP[n]) {
      g.beginPath(); g.arc(u * S, v * S, S * 0.082, 0, Math.PI * 2);
      g.fillStyle = '#fdf7e6'; g.fill();
      g.lineWidth = S * 0.017; g.strokeStyle = 'rgba(23,20,15,0.62)'; g.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    return t;
  }

  /* HARTGUMMI (Georgs Vorgabe für dieses Spiel): matte, tiefe Oberfläche mit einem knappen,
     harten Glanzsaum — kein Klavierlack. `roughness` bleibt hoch, `clearcoat` niedrig, und die
     Umgebung wird gedämpft (0,30 — der Überstrahlt-Befund aus WS1). */
  function rubber(c) {
    if ('roughness' in c) c.roughness = Math.min(0.72, Math.max(0.48, c.roughness || 0.6));
    if ('metalness' in c) c.metalness = 0;
    if ('clearcoat' in c) c.clearcoat = Math.min(0.18, c.clearcoat || 0);
    if ('envMapIntensity' in c) c.envMapIntensity = 0.30;
    return c;
  }

  function tintClone(node, hex) {                     // game.v2.js Z. 300 — Verfahren unverändert
    const out = node.clone(true);
    const col = new THREE.Color(hex);
    let mats = 0, tinted = 0;
    out.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const list = Array.isArray(o.material) ? o.material : [o.material];
      const mapped = list.map((mm) => {
        const c = mm.clone(); mats++;
        const b = c.color ? (0.2126 * c.color.r + 0.7152 * c.color.g + 0.0722 * c.color.b) : 1;
        if (c.color && b > 0.42) { c.color.copy(col); tinted++; }   // hell = Körper
        /* DIE AUGEN SIND WEISS (Georg 04.09.). Das Modell bringt sie DUNKEL mit — in SpinballCast
           blieben sie darum unangetastet, was dort richtig war (Tusche auf Papier). Hier ist der
           Würfel Hartgummi auf einem bunten Feld, und dunkle Augen verschwinden darin.
           Kein Rein-Weiß: 0,94 mit einem Hauch Creme, sonst frisst es das Tonwert-Ende auf. */
        else if (c.color) { c.color.setRGB(0.94, 0.93, 0.89); }
        if (!c.alphaMap && (c.alphaTest || 0) === 0) {
          c.transparent = false; c.opacity = 1; c.depthWrite = true; c.depthTest = true;
        }
        rubber(c);
        c.needsUpdate = true;
        return c;
      });
      o.material = mapped.length === 1 ? mapped[0] : mapped;
      o.castShadow = true;
      o.receiveShadow = false;
    });
    proto.mats = mats; proto.tinted = tinted;
    return out;
  }

  function bakedDie(hex) {
    const mats = [3, 4, 1, 6, 2, 5].map((n) => rubber(new THREE.MeshStandardMaterial({ map: pipTexture(n, hex) })));
    const mesh = new THREE.Mesh(geoDie, mats);
    mesh.castShadow = true;
    const g = new THREE.Group(); g.add(mesh);
    return g;
  }
  const bodyFor = (hex) => (proto.kind === 'glb' && proto.node ? tintClone(proto.node, hex) : bakedDie(hex));

  /** Die Drehung eines Würfelnetzes finden, in der es AUFRECHT steht — ohne flache Flächen zu
      brauchen. Ein Würfel hat die kleinste achsparallele Hüllkiste genau dann, wenn seine Flächen
      achsparallel sind; jede Kippung vergrößert sie (auf der Ecke um √3). Also: die Drehung suchen,
      die das Hüllvolumen minimiert — grob in 6°, dann fein in 1°. Wegen der Würfelsymmetrie reichen
      0…90° je Achse. Das Verfahren ist gegen Rundungen und die Augen unempfindlich. */
  function begradige(root) {
    root.updateMatrixWorld(true);
    const pts = [];
    const tmp = new THREE.Vector3();
    root.traverse((o) => {
      if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
      const p = o.geometry.attributes.position;
      const step = Math.max(1, Math.floor(p.count / 700));
      for (let i = 0; i < p.count; i += step) { tmp.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); pts.push(tmp.clone()); }
    });
    if (pts.length < 8) return { grad: 0, volVorher: 0, volNachher: 0 };
    const vol = (q) => {
      let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
      for (const p of pts) {
        tmp.copy(p).applyQuaternion(q);
        if (tmp.x < x0) x0 = tmp.x; if (tmp.x > x1) x1 = tmp.x;
        if (tmp.y < y0) y0 = tmp.y; if (tmp.y > y1) y1 = tmp.y;
        if (tmp.z < z0) z0 = tmp.z; if (tmp.z > z1) z1 = tmp.z;
      }
      return (x1 - x0) * (y1 - y0) * (z1 - z0);
    };
    const D2R = Math.PI / 180, eu = new THREE.Euler(), q = new THREE.Quaternion();
    const v0 = vol(new THREE.Quaternion());
    let best = { a: 0, b: 0, c: 0, v: v0 };
    const suche = (a0, a1, b0, b1, c0, c1, schritt) => {
      for (let a = a0; a <= a1; a += schritt) for (let b = b0; b <= b1; b += schritt) for (let c = c0; c <= c1; c += schritt) {
        eu.set(a * D2R, b * D2R, c * D2R); q.setFromEuler(eu);
        const v = vol(q);
        if (v < best.v) best = { a, b, c, v };
      }
    };
    suche(0, 89, 0, 89, 0, 89, 6);
    suche(best.a - 6, best.a + 6, best.b - 6, best.b + 6, best.c - 6, best.c + 6, 1);
    eu.set(best.a * D2R, best.b * D2R, best.c * D2R); q.setFromEuler(eu);
    const grad = +(2 * Math.acos(Math.min(1, Math.abs(q.w))) * 180 / Math.PI).toFixed(1);
    /* Nur drehen, wenn es sich lohnt: unter 1 % Volumengewinn ist das Netz schon aufrecht. */
    if (best.v < v0 * 0.99) { root.quaternion.premultiply(q); root.updateMatrixWorld(true); }
    return { grad: best.v < v0 * 0.99 ? grad : 0, euler: [best.a, best.b, best.c],
             volVorher: +v0.toFixed(3), volNachher: +best.v.toFixed(3), punkte: pts.length };
  }

  function loadModel() {
    let done = false;
    const fail = (why) => {
      if (done) return; done = true;
      proto.kind = 'fallback'; proto.note = why;
      console.log('[boxelball] BEFUND: Würfel-GLB nicht verwendet (' + why + ') — gebackener Ersatz.');
      emit('assetMissing', { what: 'dice', why });
    };
    try {
      new GLTFLoader().load(DICE_URL, (gltf) => {
        if (done) return;
        const meshes = [];
        gltf.scene.traverse((o) => { if (o.isMesh && o.geometry) meshes.push(o); });
        if (!meshes.length) { fail('keine Mesh im Modell'); return; }
        /* DAS GANZE MODELL — Körper UND Augen. Wer nur das größte Mesh nimmt, wirft die Augen weg
           und sieht in die Vertiefungen (Georgs »Lücken«, game.v2 Z. 262). */
        const node = new THREE.Group();
        const m = gltf.scene.clone(true);
        m.position.set(0, 0, 0); m.rotation.set(0, 0, 0); m.scale.set(1, 1, 1);
        node.add(m);
        /* ⚠ DAS UGUR-MODELL IST IN SEINER DATEI SCHIEF GESPEICHERT — GEORGS »RUHT AUF KANTE« SEIT
           DEM ERSTEN TAG, DURCH JEDE PHYSIK-REPARATUR HINDURCH. Gemessen in seinem Fenster (06.09.,
           04:15): der KÖRPER liegt flach (Schiefe 0°, schläft), das NETZ steht auf der Ecke. Im
           Netz sind nur 23 von 1928 Flächennormalen achsparallel (1,2 %), die häufigsten Winkel zur
           Achse liegen bei 20°–45° — ein achsparalleler Würfel hätte dort einen Berg bei 0°.
           Die Datei zeigt den Würfel also in einer Schauhaltung, und jede Drehung des Körpers
           addierte sich darauf. Deshalb war die Physik richtig UND das Bild falsch.
           Also einmal beim Laden: die drei stärksten Normalenrichtungen sind die Flächenachsen des
           Modells; ihre Umkehrdrehung macht sie achsparallel. Danach erst das Maß nehmen — vorher
           war die Hüllkiste die eines GEKIPPTEN Würfels (2,70 statt Kante), und das Netz wurde um
           rund ein Viertel zu KLEIN skaliert (Post Mortem §2: »der Würfel ist geschrumpft«). */
        const geradeInfo = begradige(m);
        /* `precise: true` — sonst nimmt three die HÜLLKISTE DER GEOMETRIE und dreht deren acht Ecken
           mit: nach der Begradigung wäre das die Hülle eines gekippten Kastens (gemessen 3,98 statt
           2,01), und das Netz würde auf die HALBE Größe des Körpers skaliert. */
        const box = new THREE.Box3().setFromObject(node, true);
        const size = new THREE.Vector3(); box.getSize(size);
        const ctr = new THREE.Vector3(); box.getCenter(ctr);
        const big = Math.max(size.x, size.y, size.z) || 1;
        /* Normalisierung auf das INNERE Mesh, nie auf die Gruppe: die Gruppe ist der Griff, den
           jedes Bild auf die Würfelkante skaliert wird (zwei Eigentümer derselben Zahl). */
        m.scale.setScalar(1 / big);
        m.position.copy(ctr).multiplyScalar(-1 / big);
        node.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.userData.noMeasure = true; } });
        proto.node = node; proto.kind = 'glb';
        proto.note = 'Ugur-Modell VOLLSTÄNDIG, ' + meshes.length + ' Mesh (Körper + Augen), Kante ' + big.toFixed(3) + ' → 1,000'
                   + ' · begradigt um ' + geradeInfo.grad + '° (Hüllvolumen ' + geradeInfo.volVorher + ' → ' + geradeInfo.volNachher + ')';
        done = true;
        console.log('[boxelball] Würfel: ' + proto.note);
        rebuild();
      }, undefined, (err) => fail((err && (err.message || err.type)) || 'Ladefehler'));
    } catch (e) { fail(e.message || 'Loader nicht verfügbar'); }
    setTimeout(() => fail('Zeitlimit 12 s'), 12000);
  }

  /* ── (4) DIE WÖLBUNG — Georgs Frage 4 ────────────────────────────────────────────────────
     »Sollte der Würfel bei Druck von oben nicht rundlich gestaucht werden?« — ja, und eine reine
     Achsenskalierung kann das nicht: sie hält die Flanken GERADE, ein gedrückter Gummiwürfel
     wölbt sie nach außen. Das ist eine Verschiebung der Punkte, keine Skalierung, also gehört sie
     in den Vertex-Teil des Materials.
     Die Formel ist ein Fass: quer zur Stauchachse nach außen, am stärksten in der MITTE
     (1 − a², a = Lage auf der Achse), null an den beiden Deckflächen — dort liegt der Druck an,
     dort kann nichts ausweichen. Das ist dieselbe Form, die ein Radiergummi unter dem Daumen macht.
     ⚠ ZWEI GRENZEN, benannt: (a) der EIGENE Programm-Schlüssel ist Pflicht, sonst teilt sich die
     gewölbte Fassung das übersetzte Programm mit einer ungewölbten und die Wölbung fällt lautlos
     aus (Lehre aus `stack.v2.js`). (b) Der Ersatzwürfel (gebacken, `BoxGeometry` ohne Unterteilung)
     hat nur Eckpunkte, und dort ist 1 − a² = 0 — auf ihm ist die Wölbung unsichtbar. Am
     Ugur-Netz mit seinen abgerundeten Kanten wirkt sie. */
  /* ⚠ NACHBESSERUNG 06.09. — Georg: »beim Richtungswechsel springt der Würfel von der einen
     Streck-Information zur anderen« und »kurz bevor er zur Ruhe kommt, wird er trotzdem gestreckt«.
     Ursache 1: die Verformung suchte sich die NÄCHSTE der drei Würfelachsen. Dreht man den Zug,
     kippt diese Wahl bei 45° um und die Streckung schnappt — vier Richtungen, keine dazwischen.
     Ursache 2: die Feder schwingt nach jedem Aufprall ins Negative (= Streckung), auch beim
     letzten Mikrostoß, wenn längst nichts mehr fliegt.
     SEINE LÖSUNG, besser als eine Reparatur: »ob wir den Würfel nicht ein bisschen ELLIPSOID
     verformen können — wie einen Gummiball, der in die Länge gezogen wird« — dann ist die Richtung
     STUFENLOS und das Springen hat keinen Ort mehr. Drei Dinge im Vertex-Teil:
       (a) RUNDUNG — der Würfel blendet mit der Stärke der Verformung zum Ball hin: bei Ruhe eine
           scharfe Kiste, unter Last ein Gummi-Ellipsoid.
       (b) ZWEI FREIE ACHSEN beliebiger Richtung (A = Druck, B = Zug). Keine Auswahl unter dreien,
           also kein Springen. Jede ist einzeln volumenerhaltend (längs ·(1−amt), quer ·1/√(1−amt)),
           also auch ihre Verkettung.
       (c) FASSWÖLBUNG quer zur Druckachse, am stärksten in der Mitte (1 − a²), null an den
           Deckflächen — dort liegt der Druck an, dort kann nichts ausweichen.
     Die NORMALEN werden mitgerechnet (Kehrwerte der Faktoren — die inverse Transponierte einer
     Achsenskalierung); ohne das bleibt die Schattierung die eines Würfels und die Rundung sieht wie
     ein Fehler aus.
     Der Knoten trägt nur noch eine GLEICHMÄSSIGE Skalierung — damit ist das Schern aus V4-S20 nicht
     behoben, sondern unmöglich.
     ⚠ ZWEI GRENZEN: (1) der EIGENE Programm-Schlüssel ist Pflicht, sonst teilt sich die verformte
     Fassung das übersetzte Programm mit einer unverformten und alles fällt lautlos aus (Lehre aus
     `stack.v2.js`). (2) Der gebackene Ersatzwürfel hat nur acht Eckpunkte — dort ist 1 − a² = 0 und
     `position/|position|` zeigt in die Ecke: auf ihm wirkt weder Wölbung noch Rundung. Am Ugur-Netz
     mit seinen abgerundeten Kanten wirkt beides. */
  const bulgePatched = new WeakSet();
  const KFB_DEF_GLSL = [
    'uniform vec3 uAxA; uniform float uAmA;',
    'uniform vec3 uAxB; uniform float uAmB;',
    'uniform float uRound; uniform float uBulge;',
    'vec3 kfbAx(vec3 p, vec3 ax, float amt){',
    '  float lg = max(0.05, 1.0 - amt); float qr = inversesqrt(lg);',
    '  float a = dot(p, ax); return ax * (a * lg) + (p - ax * a) * qr; }',
    'vec3 kfbAxN(vec3 n, vec3 ax, float amt){',
    '  float lg = max(0.05, 1.0 - amt); float qr = inversesqrt(lg);',
    '  float a = dot(n, ax); return ax * (a / lg) + (n - ax * a) / qr; }',
    'vec3 kfbRund(vec3 p){ float r = length(p);',
    '  return r > 1e-4 ? mix(p, p * (0.5 / r), uRound) : p; }',
    '',
  ].join('\n');
  function patchBulge(root) {
    const uni = [];
    root.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) {
        if (!m) continue;
        if (!bulgePatched.has(m)) {
          bulgePatched.add(m);
          const U = m.userData;
          U.kfbBulge = { value: 0 };
          U.kfbRound = { value: 0 };
          U.kfbAxA = { value: new THREE.Vector3(0, 0, 1) };
          U.kfbAmA = { value: 0 };
          U.kfbAxB = { value: new THREE.Vector3(1, 0, 0) };
          U.kfbAmB = { value: 0 };
          m.onBeforeCompile = (sh) => {
            sh.uniforms.uAxA = U.kfbAxA; sh.uniforms.uAmA = U.kfbAmA;
            sh.uniforms.uAxB = U.kfbAxB; sh.uniforms.uAmB = U.kfbAmB;
            sh.uniforms.uRound = U.kfbRound; sh.uniforms.uBulge = U.kfbBulge;
            sh.vertexShader = KFB_DEF_GLSL + sh.vertexShader
              .replace('#include <beginnormal_vertex>',
                '#include <beginnormal_vertex>\n'
                + '{ float rr = length(position);\n'
                + '  if (rr > 1e-4) objectNormal = normalize(mix(objectNormal, position / rr, uRound));\n'
                + '  objectNormal = normalize(kfbAxN(kfbAxN(objectNormal, uAxA, uAmA), uAxB, uAmB)); }')
              .replace('#include <begin_vertex>',
                '#include <begin_vertex>\n'
                + '{ vec3 p = kfbRund(transformed);\n'
                + '  p = kfbAx(kfbAx(p, uAxA, uAmA), uAxB, uAmB);\n'
                + '  float a = dot(p, uAxA) * 2.0;\n'
                + '  p += (p - uAxA * dot(p, uAxA)) * uBulge * max(0.0, 1.0 - a * a);\n'
                + '  transformed = p; }');
          };
          m.customProgramCacheKey = () => 'kfbDeform2';
          m.needsUpdate = true;
        }
        uni.push(m.userData);
      }
    });
    return uni;
  }

  /* ================= Würfel ================= */
  const dice = [];
  function makeDie(i) {
    const hex = DIE_HEX[i % DIE_HEX.length];
    const mesh = bodyFor(hex);
    /* ⚠ V4-S18 · DER DEFORMER IST EIN KIND, KEIN GRIFF AM KÖRPER — drei Knoten je Würfel:
         `sqOuter`  Ort + Stauchung, gedreht so, dass ihre z-Achse auf die STAUCHRICHTUNG zeigt
         `sqInner`  dieselbe Drehung rückwärts — damit die Stauchung in WELTACHSEN wirkt
         `mesh`     die Drehlage des Körpers und die Kantenlänge
       Warum das nötig ist, stand als Eingeständnis im alten Kommentar dieser Datei: die Stauchung
       lag auf DEMSELBEN Knoten wie die Körperdrehung, also in den LOKALEN Achsen des Würfels — ein
       gedrehter Würfel wurde in einer beliebigen Richtung platt. Genau das ist Georgs »die
       Deformierungen sind noch nicht korrekt«. Und der Deformer kann die Lage jetzt nicht mehr
       anfassen: er sitzt in einem eigenen Knoten, der Körper schreibt nur `mesh.quaternion`. */
    const sqOuter = new THREE.Group(), sqInner = new THREE.Group();
    sqOuter.add(sqInner); sqInner.add(mesh);
    root.add(sqOuter);
    const bulge = patchBulge(mesh);
    /* DER KÖRPER. Einheit ist die ZELLBREITE (`s = edgeFrac`), Schwere und Zeitschritt kommen aus
       den Zahlen dieses Moduls — EINE Uhr, EIN Satz Zahlen. Der Rest sind die SSOT-Vorgaben aus
       `cube.v1` (Reibung 0,72 · Restitution 0,38 · Dämpfung 0,12/0,22). */
    const body = createBody({ s: P.edgeFrac, gravity: P.gravityZ, hz: P.hz, maxFrame: P.maxFrame });
    return { i, hex, mesh, body,
      x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0,
      spin: 0, state: 'idle',         // idle | charge | live | asleep
      /* Stauchung: STÄRKE (negativ = gestreckt) und ihre RICHTUNG als Weltvektor. Vorher war die
         Richtung ein Winkel in der Ebene — damit war »Druck von oben« gar nicht ausdrückbar. */
      squash: 0, squashV: 0, sqx: 0, sqy: 0, sqz: 1,
      sqOuter, sqInner, bulge,
      quat: [0, 0, 0, 1], seiteGemeldet: null, wandT: 0,
      cell: null, onPaper: false, settled: false,
      charge: 0, aimX: 0, aimY: 1, sleepT: 0 };
  }
  function rebuild() {
    for (const d of dice) {
      if (d.mesh && d.sqInner) d.sqInner.remove(d.mesh);
      d.mesh = bodyFor(d.hex);
      d.bulge = patchBulge(d.mesh);
      if (d.sqInner) d.sqInner.add(d.mesh); else root.add(d.mesh);
    }
  }
  function reset(n) {
    for (const d of dice) root.remove(d.mesh);
    dice.length = 0;
    const k = Math.max(1, Math.min(P.max, n != null ? n : P.count));
    for (let i = 0; i < k; i++) dice.push(makeDie(i));
    return dice;
  }

  /** Den Würfel setzen (Rundenbeginn): er FÄLLT auf seinen Platz, er erscheint nicht.
      `spawn` unterdrückt den ersten Kontakt: der Einwurf soll seine eigene Zelle nicht auflösen —
      gemessen hatte die Runde nach 0 Würfen schon 20 Punkte und ein Loch unter dem Würfel. */
  function place(d, x, y, z, dropAbs) {
    d.x = x; d.y = y;
    /* `dropAbs` ist die ABSOLUTE Abwurfhöhe, wenn der Wirt sie besitzt (Startablauf: eine Höhe
       AUSSERHALB des Bildes, aus dem Sichtfeld gerechnet — Georg 05.09.: »muss vom oberen
       bildschirmrand erscheinen«). Ohne sie bleibt es bei 5,2 Zellen über der Fläche, was für
       das Nachrücken während des Spiels richtig ist. EINE Zeile schreibt `d.z`, hier. */
    d.z = dropAbs != null ? dropAbs : (z || 0) + F.cell * 5.2;
    /* ⚠ ES GIBT EINE UNSICHTBARE DECKE, UND SIE WAR DIE URSACHE (Georg 05.09.: »würfel fällt
       nicht vom oberen bildschirmrand, sondern erscheint in geringer höhe«).
       `stepDie` prüft `d.z > F.ceil` und prallt ab — der Abwurf über dem Bildrand wurde also im
       ersten Bild auf Deckenhöhe zurückgeholt. Die Höhe war richtig gerechnet und trotzdem nie
       zu sehen: nicht der Rechenweg war falsch, sondern die Grenze, die danach kommt.
       Ein Einwurf VON AUSSEN bekommt darum eine eigene, mitgereiste Decke, die erlischt, sobald
       er einmal unter der echten war — die Decke des SPIELS bleibt unangetastet. */
    d.ceilUp = dropAbs != null && dropAbs > F.ceil ? dropAbs + F.cell : 0;
    d.vx = 0; d.vy = 0; d.vz = 0;
    /* Der Körper bekommt dieselbe Lage — in ZELLBREITEN, und als SOHLE (er rechnet selbst auf den
       Mittelpunkt um; `z = Träger + s/2` steht an EINER Stelle, in `cube.v1`). */
    d.body.setWorld(gridWorld()).setPose(d.x / F.cell, d.y / F.cell, d.z / F.cell);
    /* Die mitgereiste Decke: ein Einwurf von ausserhalb des Bildes darf nicht im ersten Bild von
       der Spiel-Decke zurückgeholt werden (Georg 06.09.: »er fällt aus geringer Höhe ins Spiel
       statt vom oberen Bildschirmrand« — dieselbe Falle wie in der v1 am 05.09.). */
    /* ⚠ IMMER EINE DECKE, NICHT NUR BEIM EINWURF. Die v1 rechnete mit `d.ceilUp || F.ceil` —
       im Fork stand hier `d.ceilUp ? … : null`, also GAR KEINE Decke, sobald der Einwurf vorbei
       war. Gemessen: 594 Bilder über der Decke in 12 Würfen. */
    d.body.setCeil((d.ceilUp || F.ceil) / F.cell);
    d.quat = d.body.body.quat; d.seiteGemeldet = null; d.wandT = 0;
    d.state = 'live'; d.settled = false; d.sleepT = 0; d.spawn = true; d.hold = null;
    const k = boxel.cellOf(x, y);
    d.cell = k ? k.c + ':' + k.r : null;
    d.mesh.visible = true;
  }

  /* ================= Physik ================= */
  /** Die Welt des Körpers: das Raster als Kastenlandschaft. Neu erhoben, wenn sich die Geometrie
      ändert (Rasterwechsel, Fenstergröße) — der Körper rechnet keine Oberflächenhöhe, er fragt. */
  let _world = null, _worldKey = '';
  function gridWorld() {
    const g = boxel.geometry();
    const key = g.cols + 'x' + g.rows + ':' + g.cell.toFixed(5);
    if (!_world || _worldKey !== key) { _world = makeGridWorld(boxel, stage); _worldKey = key; }
    return _world;
  }

  /** ⚠ HIER IST DIE EINE ÄNDERUNG DES FORKS: ein Schritt des Körpers, dann zurückschreiben, dann
      die Kontakte dem SPIEL melden. Der Körper entscheidet nichts über Auflösen, Bumper oder
      Umlenker — er sagt nur, WO und WIE HART etwas berührt wurde (Modell §4: Eigentum). */
  function stepDie(d, dt) {
    if (d.state !== 'live') return;
    const b = d.body;
    if (b.world() !== gridWorld()) b.setWorld(gridWorld());
    const bd = b.body;
    /* VOR dem Schritt merken — ein Aufprall ist ein EREIGNIS, kein Zustand (Befund v1, 04.09.). */
    const vzVor = bd.vel.z * F.cell;
    const spVor = Math.hypot(bd.vel.x, bd.vel.y) * F.cell;
    const bodenVor = bd.grounded;

    b.step(dt);

    /* Zurückschreiben in die Felder, die das SPIEL liest (Gesichter, Striche, Juice, Wirt).
       Einheit dort ist die Karte, hier die Zelle — die Umrechnung steht an dieser EINEN Stelle. */
    const h = P.edgeFrac / 2;
    d.x = bd.pos.x * F.cell; d.y = bd.pos.y * F.cell;
    d.z = (bd.pos.z - h) * F.cell;                       // `d.z` ist die SOHLE, wie in der v1
    d.vx = bd.vel.x * F.cell; d.vy = bd.vel.y * F.cell; d.vz = bd.vel.z * F.cell;
    d.spin = Math.hypot(bd.ang.x, bd.ang.y, bd.ang.z);
    d.onGround = bd.grounded;
    d.onPaper = boxel.surfaceAt(d.x, d.y) <= 1e-6;
    d.quat = bd.quat;
    /* ⚠ DIE MITGEREISTE EINWURF-DECKE WURDE NIE ZURÜCKGESETZT. Gemessen: die Spiel-Decke liegt bei
       3,40 Zellen, der Körper hielt aber 6,98 — die Höhe, die der Einwurf gebraucht hat. Also galt
       im Spiel praktisch keine Decke. Sobald er einmal unter der echten ist, gilt sie wieder. */
    if (d.ceilUp && d.z < F.ceil) { d.ceilUp = 0; d.body.setCeil(F.ceil / F.cell); }

    let wandJetzt = false, seiteJetzt = false;
    /* ⚠ EINE MELDUNG JE ZELLWECHSEL UNTER DEM KONTAKTPUNKT — NICHT JE ECKE.
       Georgs Abnahme 06.09.: »ein Würfel, der nach dem geringsten Kontakt sofort irgendwas
       auslöst«, im Bild ein Loch durch das halbe Feld. Meine erste Fassung meldete jede Ecke und
       jede berührte Zelle mit Schwelle 0,06 — ein Kasten hat ACHT Ecken und berührt mehrere
       Zellen im selben Bild. Die v1 meldet genau EINE Zelle, und nur bei einem WECHSEL bzw. bei
       einem Aufprall über `vin > Zelle·1,1`. Dieselbe Fehlerklasse wie »ein Aufprall ist ein
       EREIGNIS, kein Zustand« — der Satz steht im Kopf der Datei, die ich geforkt habe.
       Gemessene Referenz der v1: 8 geräumte Zellen je Wurf im Mittel, 14 im Höchstfall. */
    const kp = b.contactPoint();
    const kzelle = boxel.cellOf(kp.x * F.cell, kp.y * F.cell);
    const kkey = kzelle ? kzelle.c + ':' + kzelle.r : null;

    if (!bodenVor && d.onGround && -vzVor > F.cell * 1.1) {
      /* Landung: die Fläche drückt von UNTEN — Stauchrichtung senkrecht, nicht in Flugrichtung. */
      deform(d, Math.min(1, -vzVor / (F.cell * 12)), { x: 0, y: 0, z: 1 });
      hitstop(-vzVor);
      /* ⚠ V4-S27 · EIN AUFPRALL KIPPT. Georg: »der Würfel wird einfach hoch- und runtergefahren;
         der Impact/Bounce würde eine leichte Drehung, Kippung oder so nahelegen.« Stimmt — ein
         senkrechter Stoß auf einen Kasten trifft ihn in der Praxis nie genau mittig, und ohne
         Drehmoment sieht der Abprall wie ein Aufzug aus. Also ein kleiner Drall aus der Wucht,
         auf beide WAAGERECHTEN Achsen (das ist das Kippen) und ein Rest Gierung.
         Die Zahl ist klein gehalten: sie soll das Bild beleben, nicht den Würfel auf eine Kante
         legen — genau der Fall, der in V4-S16 fünf Runden gekostet hat. `settle` im Körper legt
         ihn am Ende wieder flach, also bleibt Georgs Bedingung erfüllt: »der Würfel kann dann ja
         trotzdem am Ende der Strecke gerade in die Zelle fallen«. */
      const w = Math.min(1, -vzVor / (F.cell * 14));
      d.body.addSpin({ x: (rand() - 0.5) * P.spinKick * w,
                       y: (rand() - 0.5) * P.spinKick * w,
                       z: (rand() - 0.5) * P.spinKick * w * 0.4 });
      emit('land', { x: d.x, y: d.y, z: d.z, impact: -vzVor, paper: d.onPaper });
      if (!d.onPaper && !d.spawn && kzelle && lebt(kzelle.c, kzelle.r)) {
        touchBody(d, kzelle.c, kzelle.r, 'roll', -vzVor / Math.max(1e-3, F.cell * 6));
      }
    }
    if (d.onGround && kkey && kkey !== d.cell) {
      d.cell = kkey;
      /* ⚠ EINE SCHWELLE, DIE VORHER FEHLTE. Georg 06.09.: »bei einer leichten Berührung platzen
         sofort ein bis drei Boxel«. Diese Meldung feuerte bei JEDEM Zellwechsel unter dem
         Kontaktpunkt — auch wenn der Würfel praktisch stand: der tiefste Eckpunkt eines ruhenden
         Kastens wandert um Bruchteile und wechselt dabei die Zelle. Die v1 hatte diese Regel
         GAR NICHT; sie löste beim Rollen nur im Aufprall-Zweig aus (`vin > Zelle·1,1`,
         `dice.v1.js` Z. 441). Also gilt hier dieselbe Schwelle, jetzt waagerecht. */
      if (!d.onPaper && !d.spawn && spVor > F.cell * 1.1 && lebt(kzelle.c, kzelle.r)) {
        touchBody(d, kzelle.c, kzelle.r, 'roll', spVor / Math.max(1e-3, F.cell * 6));
      }
    } else if (!kkey) d.cell = null;

    for (const k of b.contacts()) {
      if (k.art === 'wand') { wandJetzt = true; continue; }
      if (k.art === 'decke') { emit('ceiling', { x: d.x, y: d.y }); continue; }
      if (k.art !== 'seite' || !k.zelle) continue;
      seiteJetzt = true;
      const sk = k.zelle.c + ':' + k.zelle.r;
      if (sk === d.cell || sk === d.seiteGemeldet) continue;
      if (spVor < F.cell * 1.5) continue;          // ein Streifen ist kein Anprall
      d.seiteGemeldet = sk;
      touchBody(d, k.zelle.c, k.zelle.r, 'side', spVor / Math.max(1e-3, F.cell * 4));
    }
    if (!seiteJetzt) d.seiteGemeldet = null;
    /* Ein Wandstoß ist eine EPISODE, kein Bild (Befund V4-S5, Vorrichtung 05): bei einem KASTEN
       trifft zuerst eine Ecke, und die Umkehr ist erst fertig, wenn er sich wieder löst. */
    if (wandJetzt) {
      d.wandT++;
      if (d.wandT === 1 && spVor > F.cell * 2.2) {
        deform(d, Math.min(0.6, spVor / (F.cell * 14)));
        emit('wall', { x: d.x, y: d.y, z: d.z, impact: spVor });
      }
    } else d.wandT = 0;

    if (bd.sleeping) {
      if (!d.settled) { d.settled = true; d.spawn = false; d.seiteGemeldet = null;
                        emit('settle', { x: d.x, y: d.y, z: d.z }); }
    } else if (spVor > P.rest * F.cell * 2) d.settled = false;

    /* ⚠ DER KEIL IST EINE SPIELREGEL, KEINE PHYSIKFRAGE (Georgs Bild 06.09., 01:09: der Würfel
       lehnt in 37° an einem Boxel). Auf einem Klotzfeld gibt es echte Ruhelagen in Schieflage;
       die Kanten-Regel des Vorbilds kann sie nicht lösen (sie setzt einen flachen Boden voraus —
       gemessen `kanteWartet 396` bei Tempo 0, im Kreis). Das Spiel hat aber schon die passende
       Regel: EIN KONTAKT LÖST EINE ZELLE AUF. Wer sich verkeilt, räumt den Klotz weg, auf dem er
       lehnt, und fällt danach flach. Nichts wird verdreht, nichts geschoben, und der Keil wird
       nutzbringend statt lästig. Gezählt in `d.entkeilt`. */
    /* ⚠ SOFORT, NICHT NACH EINER VIERTELSEKUNDE. Georgs Bild 04:03 mit den Zahlen aus seinem
       Fenster: `kanteWartet 5`, `entkeilt 2` — der Würfel hat sich fünfmal schief hingelegt und
       zweimal einen Klotz gebraucht, an dem er lehnte, bis er flach lag. Die Geometrie erlaubt das:
       ein Boxel ist 0,78 hoch, der Würfel 0,68, also kann er an JEDEM Lochrand an einen höheren
       Klotz lehnen, und bei Reibung 0,72 ist das eine echte Ruhelage. Jede Runde der Regel kostete
       0,25 s Wartezeit plus das Einschlafen — sekundenlang ein gekippter Würfel im Bild, obwohl
       die Physik am Ende flach meldet. Das Kriterium ist jetzt »liegt schief und ist praktisch
       still«, nicht »schläft schief«, und es greift nach drei Bildern. */
    const stK = d.body.stats();
    const schiefStill = stK.schiefeGrad >= 6 && stK.boden && stK.tempo < 0.35 && stK.winkeltempo < 0.7;
    if (schiefStill) {
      d.keilT = (d.keilT || 0) + dt;
      if (d.keilT > 0.06) {
        d.keilT = 0;
        const mp = bd.pos;
        let best = null, bz = -1;
        for (const dx of [-0.7, 0, 0.7]) for (const dy of [-0.7, 0, 0.7]) {
          const k = boxel.cellOf((mp.x + dx) * F.cell, (mp.y + dy) * F.cell);
          if (!k) continue;
          const c = boxel.at(k.c, k.r);
          if (!c || !c.alive || c.state !== 'seated') continue;
          if (c.lvl > bz) { bz = c.lvl; best = k; }
        }
        if (best && lebt(best.c, best.r)) { d.entkeilt = (d.entkeilt || 0) + 1;
                    /* ⚠ OHNE KICK UND OHNE UMLENKER. Georg 06.09.: »der Würfel springt ohne
                       Kontakt weiter«. Diese Regel feuerte alle 0,25 s an einem STILLSTEHENDEN
                       Würfel — traf sie ein Bumper-Gesicht, gab das Feld einen Kick von 11
                       Zellbreiten/s nach oben, und der Würfel hüpfte aus dem Nichts los. Ein
                       Entkeilen ist eine AUFRÄUMREGEL: es löst den Klotz, auf dem er lehnt, und
                       sonst nichts. */
                    touchBody(d, best.c, best.r, 'roll', 0.5, true); }
        else { /* ⚠ KEIN KLOTZ ZU LÖSEN — er lehnt auf dem blanken Blatt oder auf einer Feldkante.
                  Vorher stand hier »dann darf er liegen«, und genau das ist Georgs Bild: ein Würfel,
                  der gekippt auf einer Kante steht und schläft. Ein Würfel auf einer Kante ist
                  METASTABIL — in der Wirklichkeit fällt er, weil es dort immer eine Störung gibt.
                  Die Regel des Vorbilds (»warten, bis er umfällt«) setzt genau diese Störung
                  voraus; in einem Löser mit exakt null Drehmoment gibt es sie nicht, deshalb
                  wartet er ewig. Also liefert das SPIEL sie: ein Drall, klein genug, um unsichtbar
                  zu sein, und höchstens alle 0,25 s. Eigentümer ist das Spiel, nicht der Körper —
                  der korrigiert weiter keine Lage. */
               d.keilFrei = (d.keilFrei || 0) + 1;
               const a = rand() * Math.PI * 2;
               d.body.addSpin({ x: Math.cos(a) * 0.8, y: Math.sin(a) * 0.8, z: 0 }); }
      }
    } else d.keilT = 0;
  }

  /** Lebt diese Zelle WIRKLICH noch? — die Antwort auf Georgs »es passiert auf freier Fläche«.
      `boxel.cellOf()` gibt die Rasterzelle unter einem Punkt zurück, OHNE zu fragen, ob dort noch
      ein Klotz steht. Wer damit einen Kontakt meldet, meldet ihn an der Stelle, an der bis vor
      einem Augenblick ein Boxel WAR — und ein Bumper, der nicht mehr existiert, gibt trotzdem
      seinen Kick von 11 Zellbreiten/s nach oben. Das ist die Feder ohne Kontakt.
      Die physische Seite (`k.zelle` aus der Engine) braucht diese Prüfung nicht: ein gelöschter
      statischer Kasten kann keine Kollision melden. Nur die selbst gesuchten Zellen brauchen sie. */
  function lebt(c, r) {
    const z = boxel.at(c, r);
    return !!(z && z.alive && z.state === 'seated');
  }

  /** Ein Kontakt wird dem Feld gemeldet; was er BEDEUTET, entscheidet das Feld. Die Antwort
      (Bumper-Kick, Umlenker) geht als IMPULS in den Körper zurück — niemals als Lage. */
  function touchBody(d, c, r, mode, strength, nurAufraeumen) {
    const res = boxel.contact(c, r, mode, strength, Math.sign(d.vx), Math.sign(d.vy));
    if (!res) return;
    const b = d.body, v = b.body.vel;
    if (res.kick && !nurAufraeumen) { b.push({ x: 0, y: 0, z: Math.max(0, 11 - v.z) }); deform(d, 0.9, { x: 0, y: 0, z: 1 }); hitstop(F.cell * P.hitstopWucht); }
    if (res.redirect && !nurAufraeumen) {
      const s = res.redirect >= 0 ? 1 : -1;
      b.push({ x: -v.y * s - v.x, y: v.x * s - v.y, z: 0 });
      deform(d, 0.7);
    }
    if (res.dissolved) deform(d, 0.35);
    emit('hit', { kind: res.face, mode, x: d.x, y: d.y, z: d.z, hex: res.cell.hex, impact: strength });
  }

  /* ================= Physik der KUGEL-Fassung (nicht mehr auf dem Weg, Rückweg) ================= */
  /** STAUCHEN. `amount` ist die Stärke, `n` die Richtung als Weltvektor (wohin gedrückt wird).
      Ohne `n` gilt die Flugrichtung — aber ein Aufprall hat eine NORMALE, und die ist besser:
      der Würfel wird gegen die Fläche platt, die ihn stoppt, nicht in seiner Bahnrichtung. */
  /** V4-S31 · Hitstop anfordern. `wucht` in Weltmaß je Sekunde; unter einem Siebtel der
      Bezugswucht passiert nichts, damit ein Ausrollen nicht die ganze Welt anhält. */
  let stopT = 0, stopArm = 0, stopPend = 0;
  function hitstop(wucht) {
    if (!(P.hitstop > 0)) return;
    const k = Math.min(1, Math.abs(wucht) / (F.cell * P.hitstopWucht));
    /* ⚠ V4-S32 · GEORGS BEFUND: »der Würfel wird teilweise erst nach einer kurzen Verzögerung von
       dem Boxel zurückgestoßen — das Timing stimmt nicht, das sollte direkt passieren.«
       Das war mein Hitstop, an zwei Stellen falsch:
       (1) ER FROR ZU FRÜH. §11.4 legt den Stillstand auf 40–95 ms **NACH** der Kontaktaufnahme
           (0–40 ms Kontakt registriert, DANN Hitstop). Ich habe im Augenblick des Kontakts
           eingefroren, also **vor** dem Rückprall: der Würfel klebte am Klotz und flog danach los
           — genau die Verzögerung, die er beschreibt. Jetzt wird der Stop erst nach `hitstopArm`
           Sekunden Simulation scharf: der Abstoß ist sichtbar, dann steht das Bild.
       (2) ER FROR ZU OFT UND ZU LANG: Schwelle bei einem Siebtel der Bezugswucht, Dauer 96 ms —
           also bei fast jeder Landung. Jetzt erst ab der HALBEN Bezugswucht und kürzer (30–60 ms).
           Ein Hitstop ist ein Ausrufezeichen; wer ihn überall setzt, schreibt keinen Satz mehr. */
    if (k < 0.5) return;
    const dauer = P.hitstopMin + (P.hitstop - P.hitstopMin) * ((k - 0.5) / 0.5);
    if (stopArm > 0 && dauer <= stopPend) return;
    stopPend = dauer; stopArm = P.hitstopArm;
  }

  function deform(d, amount, n) {
    /* ⚠ V4-S28 · EIN KONTAKT IST KEIN AUFPRALL. Georg: »am Ende, wenn kaum noch Impact da ist und
       der Würfel einfach rollt, deformiert er sich noch — das sollte schon eine Abhängigkeit von
       Geschwindigkeit, Impact und Kinetik haben und nicht einfach bei jedem Kontakt die
       Informationen zeigen.«
       Er hat recht, und die Ursache stand an ACHT Aufrufstellen: die Hälfte übergibt eine FESTE
       Stärke (0,30 beim Rollen · 0,35 beim Auflösen · 0,7 beim Umlenken · 0,9 beim Bumper · 1,0
       beim Flankenstoß) — unabhängig davon, ob der Würfel fliegt oder gerade ausrollt. Ein
       auslaufender Würfel, der noch über Zellen rollt, bekam also dieselbe Verformung wie ein
       Treffer aus dem Flug.
       Statt acht Aufrufstellen zu korrigieren, bekommt der EIGENTÜMER eine Hüllkurve: unter
       einem Achtel des Bezugstempos passiert NICHTS, darunter… darüber wächst sie linear bis zur
       halben Bezugsgeschwindigkeit. Ein Ort, eine Regel, alle Aufrufer.
       Die Bewegung wird aus dem KÖRPER gelesen, nicht aus `d.vx/vy` — die sind seit dem Umbau auf
       cannon nur noch eine Kopie für die Anzeige, und eine Kopie kann alt sein. */
    const bv = d.body && d.body.body ? d.body.body.vel : null;
    const tempo = bv ? Math.hypot(bv.x, bv.y, bv.z) : 0;
    if (tempo < P.vRef * 0.08) return;
    const huelle = Math.min(1, tempo / (P.vRef * 0.5));
    /* ⚠ UND HIER LAG DER EIGENTLICHE FEHLER: die Stärke wurde ADDIERT. Gemessen im ausrollenden
       Würfel (Tempo 1,2–2,8) stand die Stauchung bei **0,30–0,34**, also am Anschlag — obwohl
       jeder einzelne Beitrag mit der Hüllkurve nur 0,02 groß war. Ein rollender Würfel hat aber
       in jedem Bild einen Kontakt: 31 Aufrufe × 0,02 = 0,62, geklammert auf das Maximum.
       **Eine Verformung ist kein Konto.** Sie nimmt das MAXIMUM: ein schwacher Kontakt kann den
       Würfel nie voll stauchen, gleich wie oft er kommt — und ein starker setzt sofort durch. */
    const stark = P.deform * amount * huelle;
    if (stark <= d.squash) return;
    d.squash = Math.min(P.deform, stark);
    if (n && (n.x || n.y || n.z)) { d.sqx = n.x; d.sqy = n.y; d.sqz = n.z; }
    else {
      const sp = Math.hypot(d.vx, d.vy) || 1;
      d.sqx = d.vx / sp; d.sqy = d.vy / sp; d.sqz = 0;
    }
    d.squashV = 0;
  }

  /* Kontakt-Auflösung: WÖRTLICH die Rechnung aus `game.v2.js` `resolve()` — Restitution,
     Tangentialreibung, `restE` als Schwelle für vollständig inelastisch, Drall in
     Tangentialgeschwindigkeit. Neu ist nur, WOHER die Normale kommt. */
  function bounce(d, nx, ny, e, mu) {
    const rvn = d.vx * nx + d.vy * ny;
    const impact = Math.max(0, -rvn);
    if (rvn < 0) {
      const ee = impact < P.restE ? 0 : e;
      const j = -(1 + ee) * rvn;
      d.vx += j * nx; d.vy += j * ny;
      const tx = -ny, ty = nx;
      const rvt = d.vx * tx + d.vy * ty;
      d.vx -= rvt * (mu == null ? 0.06 : mu) * tx;
      d.vy -= rvt * (mu == null ? 0.06 : mu) * ty;
      if (Math.abs(d.spin) > 0.2) {
        const give = d.spin * 0.14;
        d.vx += tx * give; d.vy += ty * give; d.spin *= 0.72;
      }
    }
    return impact;
  }

  /** Das Raster fragen: welche Zelle blockiert an dieser Stelle seitlich?
      NAHT: in SpinballCast war das eine Segmentliste; hier reicht die Nachbarschaft der Zelle
      unter dem Würfel, weil eine Zelle ein Rechteck bekannter Größe an bekanntem Ort ist.

      ZWEI BEFUNDE VOM BILD (04.09.), beide hier behoben:
      1) DIE ZELLE UNTER DEM WÜRFEL IST BODEN, NIE WAND. Ohne diese Regel gilt beim Einwurf jede
         Zelle als höher als der fallende Würfel — auch die, auf der er landen will — und sein
         Mittelpunkt liegt IN ihrem Rechteck. Gemessen: die Runde begann mit 20 Punkten, einem Loch
         unter dem Würfel und `z = 0` statt `z = 0,4875`.
      2) EINE ZELLE, DIE SICH AUFLÖST, IST KEINE WAND. Sie hat vorher abgeprallt und danach
         aufgelöst — der Würfel verlor seine Energie an Bauteile, die es hinterher nicht mehr gab
         (gemessen: 8 Zellen, dann stand er). Jetzt PFLÜGT er hindurch und verliert 3,5 % Tempo je
         Zelle; das ist die Kaskade, die das Design-Dokument §5 beschreibt. Abgeprallt wird nur an
         Bumper und Redirect — den Gesichtern, deren Aufgabe genau das ist. */
  function solveGrid(d) {
    const g = boxel.geometry();
    const k = boxel.cellOf(d.x, d.y);
    const baseC = k ? k.c : Math.round((d.x - g.x0) / g.cell - 0.5);
    const baseR = k ? k.r : Math.round((d.y - g.y0) / g.rowH - 0.5);
    const bottom = d.z;
    let hits = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const c = baseC + dc, r = baseR + dr;
        if (c === baseC && r === baseR) continue;      // Befund 1: das ist der Boden
        const cell = boxel.at(c, r);
        if (!cell || !cell.alive || cell.state !== 'seated') continue;
        const topZ = g.hgt * cell.lvl;
        /* Nur was HÖHER steht als der Würfelboden, ist eine Wand. Eine Zelle auf gleicher Ebene
           ist Boden — darüber rollt er hinweg. Genau hier entsteht das ganze Verhalten. */
        if (topZ <= bottom + F.edge * 0.14) continue;
        const p = boxel.center(c, r);
        const hx = g.cell / 2, hy = g.rowH / 2;
        const qx = Math.max(p.x - hx, Math.min(d.x, p.x + hx));
        const qy = Math.max(p.y - hy, Math.min(d.y, p.y + hy));
        let dx = d.x - qx, dy = d.y - qy;
        let dist = Math.hypot(dx, dy);
        if (dist >= F.r) continue;
        if (dist < 1e-6) {                       // Mittelpunkt genau auf der Kante: Achse wählen
          dx = d.x - p.x; dy = d.y - p.y;
          dist = Math.hypot(dx, dy) || 1;
        }
        const nx = dx / dist, ny = dy / dist;
        const speed = Math.hypot(d.vx, d.vy);

        /* Befund 2: die weiche Mehrheit löst sich auf und lässt durch. */
        if (cell.face === 'dissolve') {
          const res = boxel.contact(c, r, 'side', speed / Math.max(1e-3, F.cell * 6), -nx, -ny);
          if (res) {
            hits++;
            d.vx *= 0.965; d.vy *= 0.965;
            deform(d, 0.30);
            emit('hit', { kind: 'dissolve', mode: 'side', x: p.x, y: p.y, z: d.z, impact: speed / Math.max(1e-3, F.cell * 6), hex: res.cell.hex });
          }
          continue;
        }

        d.x += nx * (F.r - dist); d.y += ny * (F.r - dist);
        const e = cell.face === 'bumper' ? P.eBumper : P.eBoxel;
        const impact = bounce(d, nx, ny, e, 0.05);
        const res = boxel.contact(c, r, 'side', impact / Math.max(1e-3, F.cell * 4), -nx, -ny);
        if (res) {
          hits++;
          if (res.kick) {
            const ja = (rand() - 0.5) * P.jitter, ca = Math.cos(ja), sa = Math.sin(ja);
            const kx = nx * ca - ny * sa, ky = nx * sa + ny * ca;
            const J = P.kickBumper * F.cell * 9;
            d.vx += J * kx; d.vy += J * ky;
            d.spin += (rand() - 0.5) * 6;
            deform(d, 1);
          }
          if (res.redirect) {                    // Knick um 90 Grad, Drehsinn aus der Zelle
            const s = res.redirect >= 0 ? 1 : -1;
            const ox = d.vx, oy = d.vy;
            d.vx = -oy * s; d.vy = ox * s;
            deform(d, 0.8);
          }
          deform(d, Math.min(1, impact / (F.cell * 6)));
          emit('hit', { kind: res.face, mode: 'side', x: d.x, y: d.y, z: d.z, impact, hex: res.cell.hex });
        }
      }
    }
    return hits;
  }

  function stepDieKreis(d, dt) {
    if (d.state !== 'live') return;
    const g = boxel.geometry();

    /* Der gehaltene Absprung: die Bahn beginnt, sobald die Wandhöhe erreicht ist. Fällt er wieder
       zurück, ohne oben angekommen zu sein, gilt sie trotzdem — sonst hätte er gar keinen Wurf. */
    if (d.hold) {
      if (d.z >= d.hold.z || d.vz <= 0) {
        d.vx = d.hold.vx; d.vy = d.hold.vy; d.hold = null;
      }
    }

    /* ---- waagerecht: Coulomb, nicht multiplikativ (game.v2 SPEC §1) ---- */
    const sp = Math.hypot(d.vx, d.vy);
    if (sp > 1e-6 && d.onGround) {
      const mu = (d.onPaper ? P.rollPaper : P.roll) * F.cell;
      const f = Math.max(0, 1 - (mu * dt) / sp);
      d.vx *= f; d.vy *= f;
    }
    if (sp > MAXV) { const s = MAXV / sp; d.vx *= s; d.vy *= s; }
    d.spin *= (1 - 1.6 * dt);

    d.x += d.vx * dt; d.y += d.vy * dt;

    /* ---- die Bande: unsichtbare Seitenwand am Kartenrand (Design-Dokument §2) ---- */
    if (d.x - F.r < F.left) { d.x = F.left + F.r; const im = bounce(d, 1, 0, P.eWall, 0.06); wall(d, im); }
    if (d.x + F.r > F.right) { d.x = F.right - F.r; const im = bounce(d, -1, 0, P.eWall, 0.06); wall(d, im); }
    if (d.y - F.r < F.bot) { d.y = F.bot + F.r; const im = bounce(d, 0, 1, P.eWall, 0.06); wall(d, im); }
    if (d.y + F.r > F.top) { d.y = F.top - F.r; const im = bounce(d, 0, -1, P.eWall, 0.06); wall(d, im); }

    solveGrid(d);

    /* ---- senkrecht: fallen, aufprallen, liegen ---- */
    const surf = boxel.surfaceAt(d.x, d.y);
    d.vz -= P.gravityZ * F.cell * dt;
    d.z += d.vz * dt;
    d.onGround = false;
    if (d.z <= surf) {
      if (d.ceilUp) d.ceilUp = 0;   // einmal drin, dann gilt die Decke des Spiels
      const wasAir = d.z < surf - 1e-9;
      d.z = surf;
      const onPaper = surf <= 1e-6;
      d.onPaper = onPaper;
      const e = onPaper ? P.ePaper : P.eTop;
      const vin = -d.vz;
      if (vin > F.cell * 1.1) {
        d.vz = vin * e;
        deform(d, Math.min(1, vin / (F.cell * 12)));
        emit('land', { x: d.x, y: d.y, z: d.z, impact: vin, paper: onPaper });
        /* ⚠ DER KONTAKT GEHÖRT IN DIESEN ZWEIG UND NUR HIERHIN (gemessen 04.09.).
           Er stand eine Ebene höher, an `wasAir` — und `wasAir` ist bei einem RUHENDEN Würfel in
           JEDEM Bild wahr: die Schwerkraft drückt ihn je Schritt einen Bruchteil unter die
           Fläche, die Korrektur hebt ihn zurück. Ergebnis war ein Würfel, der die Zelle unter
           sich auflöst, ohne sich zu bewegen, dann die nächste, dann das Blatt — im Bild ein
           weißes Loch unter dem Einwurf und 20 Punkte nach null Würfen (»ein Ausdruck ohne
           Reifezeugnis« in seiner geometrischen Form: dieselbe Bedingung, zwei Bedeutungen).
           Ein Aufprall ist ein EREIGNIS, kein Zustand — die Schwelle, die über Abprall oder Ruhe
           entscheidet, entscheidet darum auch über den Kontakt. */
        if (!onPaper && !d.spawn) {
          const k = boxel.cellOf(d.x, d.y);
          if (k) touch(d, k.c, k.r, 'roll', vin / Math.max(1e-3, F.cell * 6));
        }
      } else {
        d.vz = 0;
        d.onGround = true;
      }
    } else if (d.z > (d.ceilUp || F.ceil)) {
      d.z = F.ceil; d.vz = -Math.abs(d.vz) * P.eCeil;
      deform(d, 0.5);
      emit('ceiling', { x: d.x, y: d.y });
    }

    /* ---- Rollkontakt: eine NEUE Zelle unter dem Würfel ist ein Ereignis ---- */
    if (d.onGround || d.z <= surf + 1e-6) {
      const k = boxel.cellOf(d.x, d.y);
      const key = k ? k.c + ':' + k.r : null;
      if (key && key !== d.cell) {
        d.cell = key;
        if (k && !d.onPaper) touch(d, k.c, k.r, 'roll', Math.hypot(d.vx, d.vy) / Math.max(1e-3, F.cell * 6));
      } else if (!key) d.cell = null;
    }

    /* ---- Ruhe: eine echte Schwelle, kein asymptotisches Kriechen ---- */
    const sp2 = Math.hypot(d.vx, d.vy);
    if (sp2 < P.rest * F.cell && d.onGround) {
      d.vx = d.vy = 0;
      if (!d.settled) { d.settled = true; d.spawn = false; emit('settle', { x: d.x, y: d.y, z: d.z }); }
    } else if (sp2 > P.rest * F.cell * 2) d.settled = false;
  }

  function wall(d, impact) {
    if (impact > F.cell * 2.2) {
      deform(d, Math.min(0.6, impact / (F.cell * 14)));
      emit('wall', { x: d.x, y: d.y, z: d.z, impact });
    }
  }

  function touch(d, c, r, mode, strength) {
    const res = boxel.contact(c, r, mode, strength, Math.sign(d.vx), Math.sign(d.vy));
    if (!res) return;
    if (res.kick) { d.vz = Math.max(d.vz, F.cell * 11); deform(d, 0.9); }
    if (res.redirect) {
      const s = res.redirect >= 0 ? 1 : -1;
      const ox = d.vx, oy = d.vy;
      d.vx = -oy * s; d.vy = ox * s;
      deform(d, 0.7);
    }
    if (res.dissolved) deform(d, 0.35);
    emit('hit', { kind: res.face, mode, x: d.x, y: d.y, z: d.z, hex: res.cell.hex, impact: strength });
  }

  /* ================= Halten, aufladen, loslassen ================= */
  const grab = { on: false, die: null, t0: 0, px: 0, py: 0, ax: 0, ay: 0, eFix: null, zug: 0 };
  /* Ringpuffer für die Klick-Aufzeichnung (siehe `dev.klickLog`). */
  const klicks = [];
  function klickNote(art, d) {
    const e = F.edge || 1, sc = d && d.mesh ? d.mesh.scale : null;
    klicks.push({ art, nr: klicks.length + 1, t: +time.toFixed(2),
                  charge: d ? +d.charge.toFixed(3) : null,
                  eFix: grab.eFix == null ? null : +grab.eFix.toFixed(3),
                  t0: +grab.t0.toFixed(2), zug: d ? +(d.zug || 0).toFixed(2) : null,
                  faktoren: sc ? [+(sc.x / e).toFixed(3), +(sc.y / e).toFixed(3), +(sc.z / e).toFixed(3)] : null,
                  state: d ? d.state : null, boden: d ? !!d.onGround : null });
    if (klicks.length > 40) klicks.shift();
  }

  function onDown(ev) {
    if (!F.ready) return false;
    const p = stage.toField(ev, 0);
    if (!p) return false;
    let d = null, best = F.edge * 2.6;
    for (const m of dice) {
      if (m.state !== 'live') continue;
      const dd = Math.hypot(p.x - m.x, p.y - m.y);
      if (dd < best) { best = dd; d = m; }
    }
    if (!d) return false;
    /* Nur was liegt, lässt sich aufladen. Ein fliegender Würfel wird nicht angehalten — die
       Kausalkette bleibt sichtbar (Design-Dokument §15). */
    if (!d.onGround && Math.hypot(d.vx, d.vy) > F.cell * 1.2) return false;
    grab.on = true; grab.die = d; grab.t0 = time; grab.px = p.x; grab.py = p.y;
    /* Der ANKER: wo der Zeiger angefangen hat. `px/py` werden von `onMove` mitgeschrieben, der
       Anker nie — an ihm hängen Totzone und Zugweite. */
    grab.ax = p.x; grab.ay = p.y;
    grab.eFix = null; grab.zug = 0;
    d.zug = 0;
    d.state = 'charge'; d.charge = 0; d.vx = d.vy = 0;
    klickNote('down', d);
    emit('grab', { die: d.i, x: d.x, y: d.y });
    return true;
  }

  function onMove(ev) {
    if (!grab.on) return false;
    const p = stage.toField(ev, 0);
    if (!p) return false;
    grab.px = p.x; grab.py = p.y;
    return true;
  }

  /** WIE SCHNELL MUSS ER NACH OBEN, UM AUS DER GASSE ZU KOMMEN.
      BEFUND GEORG (04.09., am Bild): »würfel steckt in gasse fest«. Und zwar zwangsläufig: in einer
      Lücke von einer Zelle hat er bei Kontaktradius 0,233 gegen halbe Zelle 0,294 nur 0,06
      Spielraum — seitlich kommt er da nie heraus, egal wie stark der Zug ist. Das Design-Dokument
      hat die Antwort schon (§2): das Blatt ist ein TRAMPOLIN, der Würfel steigt wieder auf.
      Die Zahl ist nicht geraten, sie ist die Energiegleichung: v = √(2 g h), mit h = Wandhöhe über
      seinem Boden plus eine halbe Kante Luft. Gibt 0, wenn er frei steht — dann bleibt der Wurf
      flach, und das ist der Normalfall. */
  function pitLift(d) {
    const g = boxel.geometry();
    const k = boxel.cellOf(d.x, d.y);
    if (!k) return 0;
    let top = 0;
    const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dc, dr] of nb) {
      const cell = boxel.at(k.c + dc, k.r + dr);
      if (cell && cell.alive && cell.state === 'seated') top = Math.max(top, g.hgt * cell.lvl);
    }
    const need = top - d.z;
    if (need <= F.edge * 0.2) return 0;
    return Math.sqrt(2 * P.gravityZ * F.cell * (need + F.edge * 0.55));
  }

  /** DER EINE ORT, AN DEM DER WURF GERECHNET WIRD. Abschuss UND Zieldarstellung lesen hier — die
      Vorhersage kann dem Wurf nicht widersprechen, weil sie dieselbe Zahl ist (SSOT §4.3: »do not
      show an inaccurate full trajectory if physics will not follow it«). Einheiten: Zellbreiten/s.

      ⚠ V4-S14 · DREI GRÖSSEN, DREI REGLER — Georgs Vorgabe vom 06.09. wörtlich:
        »druck(dauer) bestimmt sprung-höhe · zugweite bestimmt geschwindigkeit ·
         winkel bestimmt schussrichtung«
      Vorher hing ALLES an der Ladung und der Abwurfwinkel war eine feste Zahl (25°) — damit gab es
      genau eine Bahnform, nur verschieden lang. Jetzt ist der Winkel das ERGEBNIS aus Höhe und
      Tempo: kurz gedrückt und weit gezogen = flacher Pflug durch die Zellen, lang gedrückt und
      kurz gezogen = Steilschuss fast auf der Stelle. Damit ist möglich, was Georg als Spielzug
      nennt: über Boxel hinwegspringen, entfernte Boxel treffen, an Wand oder Decke zielen.

      HERKUNFT DER ZAHLEN — beide abgeleitet, keine gewählt:
      · SPRUNGHÖHE aus der Druckdauer: `h = hMin … Deckenhöhe`, daraus `vZ = √(2·g·h)`. Die
        Obergrenze IST die Decke (Eigentümer: das Feld, `F.ceil`) — volle Druckdauer stößt also
        genau an sie, und das ist Georgs Bandenspiel über die Decke.
      · TEMPO aus der Zugweite: der Bremsweg eines rutschenden Kastens ist v²/(2·μ·g), also trägt
        `v = √(2·μ·g·Strecke)` genau `Strecke` weit. Voller Zug = einmal über das Feld, kürzester
        Zug = eine gute Zellbreite. μ kommt vom Eigentümer der Oberflächen (Papier), die Feldbreite
        vom Feld. */
  function wurfVektor(d, e, zugArg) {
    const gz = d.body.P.gravity;
    const breite = (F.right - F.left) / F.cell;
    const zug = Math.max(0, Math.min(1, zugArg != null ? zugArg : (d.zug || 0)));
    let mu = 0.72;
    try { const p = d.body.surfaces().values().find((v) => v.id === 'paper'); if (p) mu = p.mu; } catch (x) {}
    const hMax = Math.max(1, (d.ceilUp || F.ceil) / F.cell - P.edgeFrac);
    const hoehe = P.jumpMin + (hMax - P.jumpMin) * e;
    const vZ = Math.sqrt(2 * gz * hoehe) * P.launchPower;
    const weite = P.reichMin + (breite - P.reichMin) * zug;
    const vH = Math.sqrt(2 * mu * gz * weite) * P.launchPower;
    return { gz, alpha: Math.atan2(vZ, vH), vGes: Math.hypot(vH, vZ), vH, vZ, hoehe, weite, mu };
  }

  /** ABBRUCH · Georg 06.09.: »nach anklicken (vor dem loslassen) den Ziel-Vorgang durch [ESC]
      abbrechen«. Der Würfel bleibt liegen, wo er liegt, Ladung und Zug fallen auf null, die
      Zieldarstellung verschwindet. Kein Wurf, kein halber Wurf. */
  function abbrechen() {
    if (!grab.on) return false;
    const d = grab.die;
    if (d) klickNote('up', d);
    grab.on = false; grab.die = null; grab.eFix = null; grab.zug = 0;
    if (d) {
      d.state = d.settled ? 'asleep' : 'idle';
      d.charge = 0; d.zug = 0; d.squash = 0; d.squashV = 0;
      emit('aimCancel', { die: d.i });
    }
    drawAim();
    return true;
  }

  function onUp() {
    if (!grab.on) return false;
    const d = grab.die;
    grab.on = false; grab.die = null;
    if (!d) return false;
    d.state = 'live'; d.settled = false;
    const e = Math.max(0.08, d.charge);
    /* Die Richtung ist die des Zeigers RELATIV zum Würfel — »in eine beliebige Richtung«
       (Georg). Ohne Versatz gilt die letzte Richtung, damit ein reiner Halte-Klick nicht ins
       Nichts schießt. */
    /* SCHLEUDER: der Würfel fliegt ENTGEGEN dem Zug — wie der Abschussbolzen beim Pinball
       (Georg 06.09., und dieselbe Logik wie `SpinBallPop v3`). Vorher zielte er ZUM Zeiger. */
    const dx = d.x - grab.px, dy = d.y - grab.py;
    const L = Math.hypot(dx, dy);
    if (L > F.edge * 0.35) { d.aimX = dx / L; d.aimY = dy / L; }
    /* ⚠ DER WURF IST EIN WURF, KEIN SCHUB — und das steht so im Spiel-Dokument.
       §3: »Vertical flicks are supported. A die can rise, hit the invisible ceiling, rebound,
       strike an elevated Boxel or tower from above, and return to the playfield.« §8: »A high die
       trajectory can interact with these structures from above after bouncing off the invisible
       ceiling.« Der Bau hatte einen rein WAAGERECHTEN Stoß (`z: 0`) — also keine Flugphase, keinen
       Deckenabprall, kein Treffen von oben, und gemessen einen Weg von 41,9 Zellen auf einem Feld
       von 12: er flipperte, statt zu fliegen.

       DIE ZAHLEN SIND ABGELEITET, NICHT GEWÄHLT:
       · Abwurfwinkel 25° — flach genug, dass der Bogen im Bild lesbar bleibt, steil genough für
         einen sichtbaren Gipfel. Der einzige gesetzte Wert; er ist der Regler für das Gefühl.
       · Volle Ladung trägt EINMAL ÜBER DAS FELD: Wurfweite = v²·sin(2α)/g, also
         v = √(Feldbreite · g / sin 2α). Feldbreite und Schwere kommen von ihren Eigentümern
         (Feld bzw. Körper), nicht aus einem Faktor in dieser Datei.
       · Der Gipfel folgt daraus zu (v·sinα)²/(2g) ≈ 1,4 Zellen — unter der Decke bei 3,4, ein
         starker Abprall oder ein Bumper bringt ihn darauf.
       · ÜBERSCHLAG: genau eine Drehung je Flug, also ω = 2π/Flugzeit mit Flugzeit = 2·v_z/g.
         Damit überschlägt er sich einmal, gleich wie stark geworfen — lesbar statt zufällig.
         Die Achse liegt waagerecht QUER zur Wurfrichtung; der Stoß greift jetzt in der MITTE,
         weil die Drehung ausdrücklich gesetzt wird (ein Eigentümer je Größe). */
    const w = wurfVektor(d, e, d.zug);
    const gz = w.gz, vH = w.vH, vZ = w.vZ;
    const speed = vH * F.cell;
    /* ⚠ DER ABSCHUSS IST EIN IMPULS AN EINEM PUNKT, und der Punkt liegt OBEN.
       Gemessen in V4-S5: ein Stoß auf den Mittelpunkt lässt einen Kasten RUTSCHEN und nie rollen
       (Rollverhältnis 0,047) — das ist die Kippbedingung, ein Würfel kippt erst bei Reibung > 1,
       und unsere ist 0,72. Ein Schnips trifft oben; die Drehung fällt daraus ab, statt dazuerfunden
       zu werden. Der Gassen-Notbehelf (`pitLift` + `hold`) ist damit weg: ein Körper kippt sich
       aus einer Gasse heraus (Vorrichtung 09). Steckenbleiben wird gezählt, nicht umgangen. */
    /* Der Wurf ist ein IMPULS AN EINEM VERSETZTEN PUNKT — Vorbild `applyImpulse(kraft, (0,0,.2))`
       bei Kante 1,0, also 0,4 halbe Kanten über der Mitte. Die 0,8 aus meiner eigenen Fassung
       kamen aus der Kippbedingung eines handgeschriebenen Lösers und sind mit cannon hinfällig. */
    d.body.flick({ x: d.aimX, y: d.aimY, z: 0 }, vH, 0);
    d.body.push({ x: 0, y: 0, z: vZ });
    /* ⚠ V4-S30 · DER DRALL WAR VERKEHRT PROPORTIONAL. `wUeber = 2π/tFlug` bedeutet: eine
       Umdrehung je Flug — bei einem KURZEN Sprung ist die Flugzeit klein, also war der Drall
       groß (bis zum Deckel 14 rad/s), bei einem hohen Sprung klein. Ein sanft gedrückter Würfel
       wirbelte also am wildesten, und weil ein wirbelnder Kasten auf Ecken landet, kam daraus ein
       Teil des Chaos, das Georg als »sehr von der Zugweite abhängig« beschreibt.
       Jetzt hängt der Drall an der ZUGWEITE: wer weit zieht, wirft über die Fläche und der Würfel
       taumelt; wer nur drückt, bekommt einen fast senkrechten, ruhigen Sprung. */
    const wUeber = 2.0 + 5.5 * Math.min(1, d.zug || 0);
    d.body.addSpin({ x: -d.aimY * wUeber, y: d.aimX * wUeber, z: (rand() - 0.5) * 2 * e });
    d.seiteGemeldet = null; d.wandT = 0;
    d.vx = d.aimX * speed; d.vy = d.aimY * speed;
    d.spawn = false;
    /* Aus der Gasse heraus: ERST HOCH, DANN LOS.
       Gemessen (04.09.): mit gleichzeitigem Absprung und Bahn kam der Würfel 0,41 Einheiten weit —
       bei 11,3 Einheiten/s durchquert er die 0,06 Luft der Gasse in 5 ms, braucht zum Freikommen
       aber 40 ms. Er schlägt also an die Wand, bevor er oben ist, und rattert weiter im Schacht.
       Ein Würfel am Boden eines Schachts von einer Zelle KANN nur senkrecht heraus — das ist
       Geometrie, keine Einstellung. Also wird die Bahn GEHALTEN, bis die Wandhöhe erreicht ist:
       sichtbar ein Absprung mit Ausholen, und danach fliegt er genau in die gezogene Richtung. */
    const lift = 0;
    if (lift > 0) {
      d.vz = lift;
      d.hold = { vx: d.vx, vy: d.vy, z: d.z + lift * lift / (2 * P.gravityZ * F.cell) * 0.62 };
      d.vx = 0; d.vy = 0;
      emit('hop', { die: d.i, lift: +lift.toFixed(2), x: d.x, y: d.y });
    }
    /* DER ABSCHUSS IST EIN RÜCKSCHNAPPEN: die Stauchung von oben fällt weg, und der Würfel
       ÜBERSCHIESST in die Streckung (negative Stauchung) — das ist der Cartoon-Vorgang, den ein
       Gummiwürfel beim Loslassen macht. Richtung bleibt die Senkrechte, damit Aufladen und
       Loslassen dieselbe Achse benutzen; sonst springt die Verformung im Augenblick des Schusses. */
    d.squash = -P.deform * (0.35 + 0.45 * e);
    d.sqx = 0; d.sqy = 0; d.sqz = 1;
    d.squashV = 0;
    d.charge = 0;
    emit('launch', { die: d.i, power: e, x: d.x, y: d.y, dirX: d.aimX, dirY: d.aimY });
    return true;
  }

  function tickCharge(dt) {
    if (!grab.on || !grab.die) return;
    const d = grab.die;
    /* ⚠ DAS KONZEPT, GEORG 06.09., VOLLSTÄNDIG — und es ist eine SCHLEUDER, kein Schub:
       (1) Halten an der Stelle misst die Druckdauer (die Ladung),
       (2) sobald gezogen wird, ist die Druckdauer FESTGESETZT — der Zug bestimmt danach nur noch
           Richtung und Winkel,
       (3) der Würfel fliegt ENTGEGEN dem Zug, wie der Abschussbolzen beim Pinball
           (dieselbe Logik wie `SpinBallPop v3`: »Drag and Release, Angry-Birds-Logik«).
       Vorher zielte der Bau ZUM Zeiger hin und die Ladung wuchs während des Ziehens weiter. */
    /* ⚠⚠ V4-S34 · DER FEHLER, DEN GEORG SEIT SECHS RUNDEN SIEHT, STEHT IN DIESEN DREI ZEILEN.
       Sein Protokoll (in seinem Fenster gelesen):
         Klick 1: gehalten **1,62 s**, höchste Ladung **0,012**
         Klick 2: gehalten 0,75 s, höchste Ladung **0,003**
         Klick 3: gehalten 1,06 s, höchste Ladung **1,000**, Verformung 0,600 — es wirkt.
       Bei 1,62 s Hängen und 0,55 s Ladezeit MUSS die Ladung 1 sein. Sie war 0,012 = 6,6 ms — also
       wurde sie im ERSTEN Bild eingefroren. Und das kam so:
       `onMove` schreibt `grab.px` mit der AKTUELLEN Zeigerlage über (es ist kein Anker, sondern
       eine Mitschrift), und die Totzone prüfte `d.x − grab.px` — den Abstand zwischen dem WÜRFEL
       und dem Zeiger. Der ist beim Anfassen NIE null: wer den Würfel nicht genau in der Mitte
       trifft, hat sofort mehr als 0,35 Kanten Abstand — und damit gilt die Geste als »gezogen«,
       die Druckdauer ist im ersten Bild festgesetzt, und es gibt nichts mehr zu laden.
       Dass es beim dritten Klick ging, ist keine Laune: da lag der Griff näher an der Mitte.
       **Eine Totzone muss von dort messen, wo der Zeiger ANGEFANGEN hat, nicht von dem Ding, das
       er gegriffen hat.** Also ein echter Anker (`grab.ax/ay`, wird nie überschrieben), und die
       Zugstrecke ist die Bewegung des Zeigers seit dem Drücken. Die Zielrichtung bleibt, wie sie
       war (vom Würfel zum Zeiger) — daran hat Georg sein Zielen gelernt, das wird nicht mit
       derselben Änderung umgedreht. */
    const mdx = grab.px - grab.ax, mdy = grab.py - grab.ay;
    const M = Math.hypot(mdx, mdy);
    if (M > F.edge * 0.35) {
      if (grab.eFix == null) grab.eFix = Math.min(1, (time - grab.t0) / P.chargeTime);
      const dx = d.x - grab.px, dy = d.y - grab.py;
      const L = Math.hypot(dx, dy) || 1;
      d.aimX = dx / L; d.aimY = dy / L;
      /* Die Zugweite ist jetzt die WIRKLICHE Zugstrecke — vorher war es der Abstand Würfel–Zeiger,
         der schon beim Anfassen groß war (gemessen `zug 1` an einem Würfel, der nur lag). */
      grab.zug = Math.min(1, M / (F.cell * P.zugVoll));
      d.zug = grab.zug;                    // EIN Eigentümer: Vorhersage und Abschuss lesen ihn
    }
    d.charge = grab.eFix != null ? grab.eFix : Math.min(1, (time - grab.t0) / P.chargeTime);
    /* Aufzeichnung WÄHREND des Haltens — das Protokoll am `down` allein war nutzlos (dort ist die
       Ladung per Definition 0). Der letzte Eintrag wird laufend nachgeführt: höchste erreichte
       Ladung und der kleinste senkrechte Faktor, den die Verformung dabei hatte. */
    if (klicks.length) {
      const k = klicks[klicks.length - 1];
      const sc = d.mesh ? d.mesh.scale : null, e2 = F.edge || 1;
      if (d.charge > (k.maxCharge || 0)) k.maxCharge = +d.charge.toFixed(3);
      if (sc) {
        const mn = Math.min(sc.x, sc.y, sc.z) / e2;
        if (k.minFaktor == null || mn < k.minFaktor) k.minFaktor = +mn.toFixed(3);
      }
      k.haltDauer = +(time - grab.t0).toFixed(2);
    }
    /* ⚠ DER DRUCK KOMMT VON OBEN (Georg 06.09.: »mit cartoon-deformer → druck von oben sichtbar«).
       Vorher stauchte die Ladung in der BAHNRICHTUNG — also waagerecht, quer zur Geste, und damit
       war das Rückmeldesignal für »ich drücke« genau die Achse, die man am schlechtesten sieht.
       Jetzt wird er platt gedrückt, wie unter einem Daumen; die Breite wächst volumenerhaltend. */
    d.squash = P.deform * 0.92 * d.charge;
    d.sqx = 0; d.sqy = 0; d.sqz = 1;
    d.squashV = 0;
  }

  /* ================= Zielhilfe: Tuschepunkte, keine Linie ================= */
  /* ================= S1 · DIE ZIELDARSTELLUNG =================
     Georg 06.09.: »ballistische Kurve als dynamisch berechnete, dünne weiße Punktlinie · ein
     Lande-QUADRAT mit leicht abgerundeten Ecken wie der Ugur-Würfel · für die Sichtbarkeit ein
     dünner dunkler Pseudo-Schatten«. Spiel-Dokument §3: »a subtle aiming guide«. SSOT §4.3:
     Richtungslinie, VORHERGESAGTER ERSTER AUFTREFFPUNKT — keine ungenaue Vollbahn.
     Die Bahn kommt aus `wurfVektor` (derselben Zahl wie der Abschuss) und endet am ERSTEN Kontakt:
     Boden (Blatt oder Boxeldeckel — dieselbe `surfaceAt`, die die Physik füttert), Bande oder
     Decke. Was danach passiert (Abprall), wird NICHT gezeichnet — das wäre die Vollbahn, die die
     Physik nicht einhält. Prüfzahl (S1): der vorhergesagte Auftreffpunkt trifft den gemessenen auf
     eine halbe Zelle. */
  const AIM_N = 40;
  const dotTex = (() => {
    /* ⚠ V4-S20 · GESTRICHELTE LINIE STATT PUNKTEN — Georgs Skizze vom 06.09.: »gestrichelte weiße
       Ziel-Linie, bogig oder gerade je nach Sprunghöhe«. Ein Strich hat eine RICHTUNG, ein Punkt
       nicht; deshalb liest eine Strichkette als Bahn und eine Punktkette als Streuung. Jeder Strich
       ist ein Sprite, das in der BILDEBENE entlang der projizierten Bahn gedreht wird — damit ist
       die Linie immer zur Kamera gewandt und trotzdem dick (eine `Line` in WebGL ist einen
       Bildpunkt breit und war nie eine Option). */
    const W = 128, H = 32, c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    const bar = (dx, dy, farbe, dicke) => {
      g.lineWidth = dicke; g.strokeStyle = farbe; g.lineCap = 'round';
      g.beginPath(); g.moveTo(H * 0.5 + dx, H / 2 + dy); g.lineTo(W - H * 0.5 + dx, H / 2 + dy); g.stroke();
    };
    bar(2.5, 2.5, 'rgba(20,17,13,0.66)', 15);          // Schatten unten rechts, Lichtkonzept
    bar(0, 0, 'rgba(255,253,247,1)', 11);              // reines Weiß
    return new THREE.CanvasTexture(c);
  })();
  const padTex = (() => {
    /* ⚠ V4-S20 · FADENKREUZ NACH GEORGS SKIZZE: ein Ring mit vier Kreuzarmen, WEISS (»Fadenkreuz
       aber eher auch weiß«), Mitte offen. Die vier Ugur-Winkel und die dunkle Trägerscheibe sind
       weg — sie waren mein Entwurf, nicht seiner, und er hat ihn zweimal abgelehnt.
       Der Ring ist hier ausdrücklich erlaubt: `kfb-cartoon-animation_v2` §4.5 reserviert Ringe für
       **Zielen**, Laden, Portal und Zone — verboten sind sie als Aufprall-Effekt. Genau das ist er:
       eine Zielmarke, kein Einschlag. */
    const S = 256, c = document.createElement('canvas'); c.width = c.height = S;
    const g = c.getContext('2d');
    const zeichne = (dx, dy, farbe, dicke) => {
      g.lineWidth = dicke; g.strokeStyle = farbe; g.lineCap = 'round';
      const cx = S / 2 + dx, cy = S / 2 + dy, R = S * 0.235;
      g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
      const a = R * 0.42, b = R * 1.72;
      g.beginPath();
      g.moveTo(cx - b, cy); g.lineTo(cx - a, cy); g.moveTo(cx + a, cy); g.lineTo(cx + b, cy);
      g.moveTo(cx, cy - b); g.lineTo(cx, cy - a); g.moveTo(cx, cy + a); g.lineTo(cx, cy + b);
      g.stroke();
    };
    zeichne(6, 6, 'rgba(20,17,13,0.66)', 17);
    zeichne(0, 0, 'rgba(255,253,247,1)', 12);
    return new THREE.CanvasTexture(c);
  })();
  const aimDots = Array.from({ length: AIM_N }, () => {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTex, transparent: true, opacity: 0, depthWrite: false, depthTest: false }));
    m.visible = false; m.renderOrder = 20; root.add(m);
    return m;
  });
  const aimPad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: padTex, transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide }));
  aimPad.visible = false; aimPad.renderOrder = 21; root.add(aimPad);

  /** Die Bahn bis zum ERSTEN Kontakt, aus den Zahlen des Wurfs. Alles in Zellbreiten.
      ⚠ DER WÜRFEL IST EIN KASTEN, KEIN PUNKT. Die erste Fassung verfolgte die Bahn der MITTE und
      fragte `surfaceAt` an genau einem Punkt — gemessen lag sie damit in zwei von fünf Würfen um
      3,6 und 5,8 Zellen daneben, und zwar immer dann, wenn eine höhere Säule INNERHALB einer
      halben Würfelkante neben der Bahn stand: die Mitte fliegt darüber hinweg, die FLANKE des
      Kastens schlägt ein (gemessen `art:'seite'`, und zwar Bruchteile nach dem Abschuss).
      Jetzt fragt die Vorhersage den ganzen FUSSABDRUCK ab (Mitte plus vier Ecken) und nimmt die
      höchste Fläche darunter; die Bande rückt um dieselbe halbe Kante nach innen. Das ist derselbe
      Griff, mit dem `podcast-v2/flipper.v2.js` und der Gutter der v2 rechnen: ein Körper trifft
      mit seinem Rand, nicht mit seinem Mittelpunkt. */
  function vorhersage(d) {
    const e = Math.max(0.08, d.charge);
    const w = wurfVektor(d, e);
    const x0 = d.x / F.cell, y0 = d.y / F.cell, z0 = d.z / F.cell;
    const ceil = (d.ceilUp || F.ceil) / F.cell;
    const hw = P.edgeFrac * 0.5;                     // halbe Würfelkante, in Zellbreiten
    const hc = hw * F.cell;
    const bodenUnterFuss = (xc, yc) => {
      let m = boxel.surfaceAt(xc, yc);
      const s1 = boxel.surfaceAt(xc - hc, yc - hc); if (s1 > m) m = s1;
      const s2 = boxel.surfaceAt(xc + hc, yc - hc); if (s2 > m) m = s2;
      const s3 = boxel.surfaceAt(xc - hc, yc + hc); if (s3 > m) m = s3;
      const s4 = boxel.surfaceAt(xc + hc, yc + hc); if (s4 > m) m = s4;
      return m / F.cell;
    };
    const pts = [];
    let treffer = null, letzte = { x: x0, y: y0, z: z0 };
    const dt = 0.004;
    for (let i = 1; i <= 1500; i++) {
      const t = i * dt;
      const x = x0 + d.aimX * w.vH * t, y = y0 + d.aimY * w.vH * t, z = z0 + w.vZ * t - 0.5 * w.gz * t * t;
      const xc = x * F.cell, yc = y * F.cell;
      /* BANDE — die Marke steht SENKRECHT auf der Wand und schaut ins Feld (Georg: »an der
         unsichtbaren Wand … auf die Wand mit der entsprechenden Perspektive projiziert«). */
      if (xc < F.left + hc) { treffer = { x: (F.left + hc) / F.cell, y, z, art: 'wand', n: { x: 1, y: 0, z: 0 } }; break; }
      if (xc > F.right - hc) { treffer = { x: (F.right - hc) / F.cell, y, z, art: 'wand', n: { x: -1, y: 0, z: 0 } }; break; }
      if (yc < F.bot + hc) { treffer = { x, y: (F.bot + hc) / F.cell, z, art: 'wand', n: { x: 0, y: 1, z: 0 } }; break; }
      if (yc > F.top - hc) { treffer = { x, y: (F.top - hc) / F.cell, z, art: 'wand', n: { x: 0, y: -1, z: 0 } }; break; }
      if (z > ceil) { treffer = { x, y, z: ceil, art: 'decke', n: { x: 0, y: 0, z: -1 } }; break; }
      const mitte = boxel.surfaceAt(xc, yc) / F.cell;
      const boden = bodenUnterFuss(xc, yc);
      if (t > 0.03 && z <= boden) {
        /* ⚠ FLANKE ODER BODEN? Wenn die höchste Fläche unter dem Fußabdruck NICHT die unter der
           Mitte ist, schlägt der Kasten mit der SEITE an eine Nachbarsäule — dann ist die Marke
           eine senkrechte Fläche an dieser Säule und keine Landefläche. Genau das hat Georg als
           »die Kurve wird von benachbarten Boxeln begrenzt« gesehen: der Anschlag war richtig,
           die Marke log ihn als Landung. Jetzt sagt die Marke, WAS ihn stoppt. */
        if (boden > mitte + 1e-4) {
          const nx = -Math.sign(d.aimX) * (Math.abs(d.aimX) >= Math.abs(d.aimY) ? 1 : 0);
          const ny = -Math.sign(d.aimY) * (Math.abs(d.aimY) > Math.abs(d.aimX) ? 1 : 0);
          treffer = { x: letzte.x, y: letzte.y, z: Math.max(z, letzte.z), art: 'flanke',
                      n: { x: nx, y: ny, z: 0 } };
        } else {
          treffer = { x, y, z: boden, art: 'boden', n: { x: 0, y: 0, z: 1 } };
        }
        break;
      }
      pts.push({ x, y, z }); letzte = { x, y, z };
    }
    return { pts, treffer, w };
  }

  /* Die Marke wird GEGLÄTTET nachgezogen — Georg: »das ruckelt noch ein bisschen«. Die Bahn
     ändert sich während des Ladens jedes Bild, und ein Ziel, das jedes Bild springt, flackert.
     Ein Tiefpass auf Ort UND Normale; beim Anfassen wird er gesetzt statt gezogen. */
  const zielGlatt = { x: 0, y: 0, z: 0, nx: 0, ny: 0, nz: 1, art: null, frisch: true };

  function drawAim() {
    const d = grab.on ? grab.die : null;
    /* ⚠⚠ V4-S21 · DIE ZIELDARSTELLUNG IST ABGESCHALTET UND ALS FEHLSCHLAG ABGELEGT.
       Georgs Urteil 06.09. nach drei Fassungen (Punkte → Winkel+Scheibe → Striche+Fadenkreuz):
       »das Design funktioniert immer noch nicht — du orientierst die Striche nicht anhand einer
       Kurve, sondern setzt sie einfach stufig aneinander; zudem entspricht die tatsächliche
       Flugbahn nicht der angezeigten ballistischen Kurve. Ich würde sie als Fail kommentiert
       ausblenden, um sie später sauber zu konzipieren und zu bauen.«

       ZWEI FEHLER, beide von mir, beide benannt statt weiter beschraubt:
       (a) DIE LINIE IST KEINE KURVE. Jeder Strich ist ein eigenes Sprite mit einem eigenen Winkel;
           an jedem Strichende bricht die Richtung. Das liest als Treppe, nicht als Bogen. Eine
           Kurve braucht EIN durchgehendes Band (Streifengeometrie entlang der Bahn, zur Kamera
           gedreht, mit einer Strichelung in der Textur statt einer Kette von Einzelstücken) — das
           ist ein anderer Bau, keine Zahl an diesem.
       (b) DIE VORHERSAGE STIMMT NICHT MIT DEM FLUG. Sie rechnet den Bogen aus Anfangstempo und
           Schwere, kennt aber Reibung, Dämpfung und den ersten Streifschuss an einer Zellflanke
           nicht. Solange die vorhergesagte Bahn nicht gegen die GEFLOGENE geprüft ist, ist die
           Anzeige eine Behauptung. Die Prüfzahl dafür (S1: vorhergesagter gegen gemessenen
           Auftreffpunkt) steht offen — sie war die ganze Zeit die eigentliche Aufgabe.

       Der Bau bleibt vollständig stehen: `setParams({ aimShow: true })` schaltet ihn zurück, die
       Messgriffe (`dev.zielProbe`) arbeiten weiter. Nichts davon ist gelöscht — es ist stillgelegt,
       damit es nicht als Lösung im Bild steht. */
    if (!P.aimShow || !d || !F.ready) {
      for (const s of aimDots) s.visible = false;
      aimPad.visible = false; zielGlatt.frisch = true; return;
    }
    const V = vorhersage(d);
    d.ziel = V.treffer;                                  // für die Prüfzahl (S1) lesbar
    /* Striche nach WEGLÄNGE, nicht nach Zeit — sonst drängen sie sich am Gipfel. Der erste Strich
       eine Kante neben dem Würfel (ein Strich AUF dem Würfel liest als kaputte Textur).
       0,60 Zellen Rasterabstand bei 0,34 Strichlänge ergibt eine Lattung von etwa 1 : 0,8 — eine
       gestrichelte Linie, keine Kette und keine durchgezogene Spur. */
    const abstand = 0.60, start = P.edgeFrac * 1.2;
    let weg = 0, n = 0, naechster = start;
    const mitte = F.edge * 0.5;
    for (let i = 1; i < V.pts.length && n < AIM_N; i++) {
      const a = V.pts[i - 1], b = V.pts[i];
      weg += Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
      if (weg >= naechster) {
        const s = aimDots[n++];
        s.visible = true;
        s.position.set(b.x * F.cell, b.y * F.cell, b.z * F.cell + mitte);
        /* ⚠ JEDER STRICH WIRD IN DER BILDEBENE ENTLANG DER BAHN GEDREHT. Ohne das liegen 40
           waagerechte Balken im Bild und die Linie liest als Leiter. Der Winkel kommt aus den
           PROJIZIERTEN Nachbarpunkten — nicht aus der Weltrichtung: bei gekippter Karte und
           perspektivischer Kamera sind das zwei verschiedene Winkel, und sichtbar ist der auf dem
           Schirm. Ein `Sprite` kann genau das (`material.rotation` dreht in der Bildebene und
           bleibt zur Kamera gewandt); eine `Line` in WebGL ist einen Bildpunkt breit. */
        const kam = stage && stage.camera ? stage.camera : null;
        if (kam) {
          _p1.set(a.x * F.cell, a.y * F.cell, a.z * F.cell + mitte).project(kam);
          _p2.set(b.x * F.cell, b.y * F.cell, b.z * F.cell + mitte).project(kam);
          s.material.rotation = Math.atan2(_p2.y - _p1.y, _p2.x - _p1.x);
        }
        /* Verjüngung nach hinten gibt der Linie Tiefe: der nahe Strich ist der längste.
           ⚠ GRÖSSE GEMESSEN NACHGEZOGEN: 0,62 × 0,15 Kanten ergab auf dem Schirm einen Strich von
           etwa 22 × 5 Bildpunkten — im Bild ein Kratzer, nicht eine Linie. 0,85 × 0,22 sind rund
           30 × 8; die Lattung (Rasterabstand 0,60 zu Strichlänge 0,85·0,517) bleibt gestrichelt. */
        const f = Math.max(0.45, 1 - 0.45 * (n / 16));
        s.scale.set(F.edge * 0.85 * f, F.edge * 0.22 * f, 1);
        s.material.opacity = (0.82 + 0.18 * d.charge) * Math.max(0.55, f);
        naechster += abstand;
      }
    }
    for (let i = n; i < AIM_N; i++) aimDots[i].visible = false;

    const T = V.treffer;
    if (!T) { aimPad.visible = false; zielGlatt.frisch = true; return; }
    const nz = T.n || { x: 0, y: 0, z: 1 };
    const waagerecht = Math.abs(nz.z) > 0.5;
    const tx = T.x * F.cell + nz.x * 0.01 * F.cell;
    const ty = T.y * F.cell + nz.y * 0.01 * F.cell;
    /* Auf einer LIEGENDEN Fläche sitzt die Marke auf der Fläche; an einer SENKRECHTEN steht sie
       auf der Bahnhöhe und schaut ins Feld — dieselbe Marke, andere Lage. */
    const tz = T.z * F.cell + (waagerecht ? nz.z * 0.014 * F.cell : mitte);
    if (zielGlatt.frisch || zielGlatt.art !== T.art) {
      /* ⚠ BEI EINEM WECHSEL DER FLÄCHENART WIRD GESETZT, NICHT GEZOGEN. Während des Aufladens
         wandert das Ziel von der Bodenlandung zur Flanke zur Bande zur Decke — ein Tiefpass über
         diese Grenze zieht die Marke quer durch das Bild und dreht sie dabei: das war das starke
         »Springen«. Innerhalb einer Art wird geglättet, an der Grenze gesprungen. */
      zielGlatt.x = tx; zielGlatt.y = ty; zielGlatt.z = tz;
      zielGlatt.nx = nz.x; zielGlatt.ny = nz.y; zielGlatt.nz = nz.z;
      zielGlatt.frisch = false; zielGlatt.art = T.art;
    } else {
      const k = 0.3;
      zielGlatt.x += (tx - zielGlatt.x) * k;
      zielGlatt.y += (ty - zielGlatt.y) * k;
      zielGlatt.z += (tz - zielGlatt.z) * k;
      zielGlatt.nx += (nz.x - zielGlatt.nx) * k;
      zielGlatt.ny += (nz.y - zielGlatt.ny) * k;
      zielGlatt.nz += (nz.z - zielGlatt.nz) * k;
    }
    aimPad.visible = true;
    /* Das Fadenkreuz ist eine MARKE, kein Deckel: 1,5 Kanten — groß genug zum Lesen (gemessen 46
       Bildpunkte), klein genug, dass die getroffene Zelle darunter sichtbar bleibt. */
    const g = F.edge * 1.5;
    aimPad.scale.set(g, g, 1);
    aimPad.position.set(zielGlatt.x, zielGlatt.y, zielGlatt.z);
    _nrm.set(zielGlatt.nx, zielGlatt.ny, zielGlatt.nz);
    if (_nrm.lengthSq() < 1e-6) _nrm.set(0, 0, 1);
    _nrm.normalize();
    aimPad.quaternion.setFromUnitVectors(_ZPLUS, _nrm);
    aimPad.material.opacity = 0.55 + 0.45 * d.charge;
  }
  const _nrm = new THREE.Vector3();
  const _ZPLUS = new THREE.Vector3(0, 0, 1);
  const _p1 = new THREE.Vector3(), _p2 = new THREE.Vector3();

  /* ================= VFX: Tusche und Konfetti ================= */
  const inkTex = (() => {                              // game.v2.js Z. 560 — unverändert
    const S = 64, c = document.createElement('canvas'); c.width = c.height = S;
    const g = c.getContext('2d');
    const rg = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    rg.addColorStop(0, 'rgba(31,26,20,0.95)'); rg.addColorStop(0.4, 'rgba(31,26,20,0.42)');
    rg.addColorStop(1, 'rgba(31,26,20,0)');
    g.fillStyle = rg; g.fillRect(0, 0, S, S);
    return new THREE.CanvasTexture(c);
  })();
  const SPLAT_N = 16;
  const splats = Array.from({ length: SPLAT_N }, () => {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: inkTex, transparent: true, opacity: 0, depthWrite: false }));
    m.visible = false; m.renderOrder = 12; root.add(m);
    return { m, life: 1, sc: 0.1 };
  });
  let splatI = 0;
  function splat(x, y, z, scale) {
    const s = splats[splatI++ % SPLAT_N];
    s.m.position.set(x, y, (z || 0) + 0.02); s.life = 0; s.sc = scale || F.edge * 0.5;
    s.m.visible = true;
  }
  const RING_N = 10;
  const rings = Array.from({ length: RING_N }, () => {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.72, 1, 30),
      new THREE.MeshBasicMaterial({ color: 0x2b261e, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
    m.visible = false; m.renderOrder = 11; root.add(m);
    return { m, life: 1, sc: 1 };
  });
  let ringI = 0;
  function ripple(x, y, z, scale) {
    const r = rings[ringI++ % RING_N];
    r.m.position.set(x, y, (z || 0) + 0.012); r.life = 0; r.sc = scale || F.edge;
    r.m.visible = true;
  }
  /* Konfetti in der FARBE der aufgelösten Zelle — die Saftigkeit gehört dem Feld, die Tusche
     dem Aufprall. Kleine Würfelchen, nicht Sprites: sie drehen sich und fangen Licht. */
  const CONF_N = 48;
  const confGeo = new THREE.BoxGeometry(1, 1, 1);
  const confetti = Array.from({ length: CONF_N }, () => {
    const m = new THREE.Mesh(confGeo, new THREE.MeshStandardMaterial({ roughness: 0.5 }));
    m.visible = false; m.castShadow = false; root.add(m);
    return { m, life: 1, vx: 0, vy: 0, vz: 0, rx: 0, ry: 0, sc: 0.1 };
  });
  let confI = 0;
  function burst(x, y, z, hex, n) {
    for (let i = 0; i < (n || 6); i++) {
      const c = confetti[confI++ % CONF_N];
      c.m.visible = true; c.life = 0;
      c.m.position.set(x, y, (z || 0) + F.edge * 0.3);
      c.m.material.color.set(hex || '#e8556d');
      const a = rand() * Math.PI * 2, sp = F.cell * (2 + rand() * 5);
      c.vx = Math.cos(a) * sp; c.vy = Math.sin(a) * sp; c.vz = F.cell * (4 + rand() * 6);
      c.rx = (rand() - 0.5) * 14; c.ry = (rand() - 0.5) * 14;
      c.sc = F.edge * (0.16 + rand() * 0.14);
      c.m.scale.setScalar(c.sc);
    }
  }

  function drawFx(dt) {
    for (const s of splats) {
      if (!s.m.visible) continue;
      s.life += dt * 3.4;
      if (s.life >= 1) { s.m.visible = false; s.m.material.opacity = 0; continue; }
      const k = s.life;
      s.m.material.opacity = 0.7 * (1 - k) * (1 - k);
      const sc = s.sc * (0.5 + k * 1.5);
      s.m.scale.set(sc, sc, 1);
    }
    for (const r of rings) {
      if (!r.m.visible) continue;
      r.life += dt * 2.5;
      if (r.life >= 1) { r.m.visible = false; r.m.material.opacity = 0; continue; }
      r.m.material.opacity = 0.5 * (1 - r.life);
      const sc = r.sc * (0.4 + r.life * 1.9);
      r.m.scale.set(sc, sc, 1);
    }
    for (const c of confetti) {
      if (!c.m.visible) continue;
      c.life += dt * 1.15;
      if (c.life >= 1) { c.m.visible = false; continue; }
      c.vz -= P.gravityZ * F.cell * dt * 0.8;
      c.m.position.x += c.vx * dt; c.m.position.y += c.vy * dt; c.m.position.z += c.vz * dt;
      if (c.m.position.z < 0) { c.m.position.z = 0; c.vz = -c.vz * 0.42; c.vx *= 0.7; c.vy *= 0.7; }
      c.m.rotation.x += c.rx * dt; c.m.rotation.y += c.ry * dt;
      c.m.scale.setScalar(c.sc * (1 - c.life * c.life));
    }
  }

  /* ================= Klang (Synth, Ton standardmäßig aus) ================= */
  const Sfx = {                                        // game.v2.js `Sfx` — Primitive unverändert
    ctx: null, vol: null, nbuf: null,
    init() {
      if (this.ctx || !P.audio) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try { this.ctx = new AC(); } catch (e) { return; }
      this.vol = this.ctx.createGain(); this.vol.gain.value = 0.20;
      this.vol.connect(this.ctx.destination);
      const n = Math.floor(this.ctx.sampleRate * 0.25);
      this.nbuf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
      const d = this.nbuf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    },
    unlock() { this.init(); if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {}); },
    imp(v) { return Math.min(1, Math.max(0, (v - 0.2) / 3.0)); },
    tone(f0, f1, dur, type, g0) {
      if (!this.ctx || g0 < 0.01) return;
      const t = this.ctx.currentTime;
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
      g.gain.setValueAtTime(g0, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(this.vol); o.start(t); o.stop(t + dur + 0.02);
      o.onended = () => g.disconnect();
    },
    burst(dur, freq, q, g0, type) {
      if (!this.ctx || g0 < 0.01) return;
      const t = this.ctx.currentTime;
      const s = this.ctx.createBufferSource(); s.buffer = this.nbuf;
      const f = this.ctx.createBiquadFilter();
      f.type = type || 'bandpass'; f.frequency.value = freq; f.Q.value = q;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(g0, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      s.connect(f); f.connect(g); g.connect(this.vol);
      s.start(t); s.stop(t + dur + 0.02);
      s.onended = () => g.disconnect();
    },
    card(v) { const k = this.imp(v); this.burst(0.045, 200 + 120 * k, 0.6, 0.16 + 0.3 * k, 'lowpass'); this.tone(140 + 40 * k, 95, 0.06, 'triangle', 0.14 + 0.22 * k); },
    band(v) { const k = this.imp(v); this.tone(90 + 40 * k, 260 + 90 * k, 0.055, 'sawtooth', 0.10 + 0.2 * k); this.burst(0.03, 900, 1.1, 0.05 + 0.13 * k); },
    pop(v) { const k = this.imp(v); this.tone(420 + 260 * k, 180, 0.09, 'sine', 0.16 + 0.2 * k); this.burst(0.03, 1500, 1.2, 0.05 + 0.1 * k); },
    bumper(v) { const k = this.imp(v); this.tone(230 + 90 * k, 150, 0.09, 'sine', 0.20 + 0.26 * k); this.burst(0.035, 520, 0.8, 0.08 + 0.16 * k, 'lowpass'); },
    pull(p) { this.burst(0.035, 320 + 700 * p, 1.4, 0.05 + 0.06 * p); },
    launch(p) { this.tone(150, 150 + 520 * p, 0.2, 'sawtooth', 0.20 + 0.14 * p); this.burst(0.09, 700, 0.7, 0.14 + 0.18 * p, 'lowpass'); },
    settle() { [0, 90, 165].forEach((ms, i) => setTimeout(() => this.burst(0.035, 210 - i * 25, 0.6, 0.13 - i * 0.04, 'lowpass'), ms)); },
  };

  /* ================= Darstellung ================= */
  const _dn = new THREE.Vector3(), _dq = new THREE.Quaternion(), _ZP = new THREE.Vector3(0, 0, 1);
  const _iq = new THREE.Quaternion();
  const _axA = new THREE.Vector3(0, 0, 1), _axB = new THREE.Vector3(1, 0, 0);
  const _axL = new THREE.Vector3(0, 1, 0);
  function drawDice(dt) {
    for (const d of dice) {
      if (!d.mesh) continue;
      /* SICHTBARKEIT IST EINE FOLGE DES ZUSTANDS, KEIN EIGENER SCHALTER (Georg 05.09.: der
         Würfel erscheint noch direkt zu Beginn und verschwindet dann). `hide()` setzte
         `mesh.visible` EINMAL — aber das Netz entsteht erst, wenn das Ugur-Modell geladen ist,
         und ein neues Netz ist sichtbar. Ein einmaliger Schalter kann eine spätere Geburt nicht
         erreichen, ein Zustand kann es. `idle` heißt: diesen Würfel gibt es im Spiel noch nicht. */
      /* ── DIE VERFORMUNG FOLGT DER KINETIK ─────────────────────────────────────────────────
         ⚠ Georg 06.09.: die Verformung wirkt »unpassend zur Kinetik, Flugrichtung, Kollision, eher
         willkürlich« — und das war richtig. Es gab nur EINEN Kanal: ein Ereignis setzte eine
         Stauchung, die Feder zog sie in etwa 0,2 s auf null. Danach flog der Würfel den REST des
         Bogens **unverformt**, und die Streckung nach dem Abschuss lag auf der SENKRECHTEN,
         während er seitwärts flog. Die Verformung hatte also mit dem, was der Würfel gerade tut,
         nichts zu tun.
         `skills/cartoon-motion_v1.md` (Georgs Verweis) sagt es in einem Satz: *lebende Dinge
         bewegen sich nicht mit gleichbleibender Geschwindigkeit — sie verformen sich fortwährend*,
         Streckung entlang der Bewegung, Stauchung gegen die Fläche, die sie stoppt, und Bahnen
         sind Bogen (Grundsatz 1 und 7).
         ALSO ZWEI KANÄLE, und der größere gewinnt:
           EREIGNIS      · Feder, gesetzt von `deform()` — Aufprall, Kick, Bande, Ladung
           FORTWÄHREND   · im Flug: Streckung ENTLANG des Geschwindigkeitsvektors, Stärke aus dem
                           Tempo (Bezug: das Tempo des stärksten Wurfs)
         Am Boden ist der fortwährende Kanal null — ein rollender Würfel soll nicht wabbeln. */
      const bv = d.body && d.body.body ? d.body.body.vel : null;
      let sK = 0, kx = 0, ky = 0, kz = 1;
      if (bv && !d.onGround) {
        const sp = Math.hypot(bv.x, bv.y, bv.z);
        if (sp > P.vRef * 0.12) {
          sK = -P.stretch * Math.min(1, sp / P.vRef);
          kx = bv.x / sp; ky = bv.y / sp; kz = bv.z / sp;
        }
      }
      d.mesh.visible = d.state !== 'idle';
      d.sqOuter.visible = d.state !== 'idle';
      /* Die Feder: sie zieht die Stauchung nach null und darf INS NEGATIVE schwingen — dort ist der
         Würfel gestreckt. Vorher war bei null hart abgeschnitten, und damit fehlte dem Cartoon
         genau die zweite Hälfte: das Überschwingen. Grenze bei der halben Stauchung, sonst wird
         aus einem Würfel eine Nudel. */
      d.squashV += (-d.squash * P.deformBack - d.squashV * 5.2) * dt;
      d.squash += d.squashV * dt;
      if (d.squash < -P.deform * 0.6) { d.squash = -P.deform * 0.6; d.squashV = 0; }
      if (Math.abs(d.squash) < 1e-4 && Math.abs(d.squashV) < 1e-3) { d.squash = 0; d.squashV = 0; }
      /* Der größere Kanal gewinnt — ein Aufprall überschreibt die Flugstreckung, und wenn er
         abgeklungen ist, übernimmt wieder die Kinetik. Kein Addieren: zwei Verformungen auf zwei
         Achsen gleichzeitig ergeben eine Nudel, keine Aussage. */
      let s = d.squash;
      if (Math.abs(sK) > Math.abs(s)) { s = sK; d.sqx = kx; d.sqy = ky; d.sqz = kz; }
      const e = F.edge;
      /* Der Höhenmaßstab wird ZUERST gebraucht — die Lage des Mittelpunkts hängt an ihm (siehe
         unten: sonst wächst der Würfel in die Karte). */
      const grund = boxel.surfaceAt(d.x, d.y);
      const spanne = Math.max(1e-3, F.ceil - grund);
      const hochF = 1 + P.hoch * Math.max(0, Math.min(1, (d.z - grund) / spanne));
      /* Die senkrechte Lage wird nach der Skalierung nachgezogen (siehe unten) — hier nur x/y. */
      d.sqOuter.position.set(d.x, d.y, d.z + e * 0.5 * hochF);
      d.mesh.position.set(0, 0, 0);
      /* ⚠ V4-S20 · KEIN SCHERN MEHR — Georgs Frage 3 (»ist das schräge Abscheren/Trapez-Form für
         einen Hartgummi-Würfel das korrekte Verhalten?«). Antwort: nein, und es war MEIN Fehler
         aus V4-S18. Eine Skalierung entlang einer WELTACHSE ist eine affine Abbildung: bei einem
         GEDREHTEN Würfel werden aus Quadraten Parallelogramme — aus dem Würfel wird ein
         Spat, und genau das sieht er als Trapez. Für eine weiche Blase wäre das richtig; ein
         Hartgummi-Würfel bleibt beim Stauchen ein KASTEN, nur flacher.
         Also wird in den EIGENEN Achsen des Würfels gestaucht — und zwar in derjenigen, die der
         Stauchrichtung am nächsten liegt. Der Unterschied zur Weltachse ist der Winkel zwischen
         Körperachse und Stoßrichtung; für einen ruhenden Würfel null, im Flug höchstens 45° —
         und dort ist eine flach gedrückte Kastenform immer noch die lesbare Form.
         Die drei Knoten aus V4-S18 bleiben (sie halten Ort und Drehung getrennt), tragen aber
         keine Verzerrung mehr: die Faktoren sitzen auf `mesh.scale`, in Körperachsen. */
      d.sqOuter.quaternion.identity();
      d.sqOuter.scale.set(1, 1, 1);
      d.sqInner.quaternion.identity();
      _iq.copy(d.mesh.quaternion).invert();
      /** Eine Weltrichtung in die Koordinaten des Würfels — STUFENLOS. Die Auswahl unter den drei
          Würfelachsen ist ersatzlos weg; sie war der Grund für Georgs »Springen«. */
      const nachLokal = (v, wx, wy, wz, ex, ey, ez) => {
        v.set(wx, wy, wz);
        if (v.lengthSq() < 1e-9) v.set(ex, ey, ez);
        return v.normalize().applyQuaternion(_iq);
      };
      /** Welche der drei Würfelachsen zeigt nach oben? Für einen Würfel, der auf einer FLÄCHE
          liegt, ist das eindeutig — und hier gibt es kein Springen, weil er sich in diesem Zustand
          nicht dreht. Genau deshalb ist die Achsenskalierung NUR in diesem Fall ehrlich. */
      const lokaleAchseUp = () => {
        nachLokal(_dn, 0, 0, 1, 0, 0, 1);
        const a = Math.abs(_dn.x), b = Math.abs(_dn.y), c = Math.abs(_dn.z);
        return (a >= b && a >= c) ? 0 : (b >= c ? 1 : 2);
      };

      const laedt = grab.on && grab.die === d;
      if (d.quat) d.mesh.quaternion.set(d.quat[0], d.quat[1], d.quat[2], d.quat[3]);
      let amtA = 0, amtB = 0, rund = 0, woelb = 0;
      _axB.set(1, 0, 0);
      const f = [1, 1, 1];
      /* ⚠⚠ V4-S24 · DIE GEOMETRIE-VERFORMUNG IST ABGESCHALTET — Georgs Urteil 06.09.:
         »das funktioniert leider nicht und sieht auch nicht gut aus — wenn der Würfel so klein wird
         und sich dann auch noch streckt, sieht das alles sehr komisch aus; diese Abschrägung gibt
         es teilweise immer noch — da müssen wir den anderen Ansatz finden.«

         WARUM ER KLEIN WURDE, gerechnet: die Rundung blendete zur Kugel mit Radius 0,5 — das ist
         die INNENKUGEL des Würfels. Eine Ecke liegt bei 0,866; bei Rundung 0,62 landet sie auf
         0,639, also 26 % nach innen, während die Flächenmitten bei 0,5 stehen bleiben. Die
         Umrisslinie schrumpft stark, die Flächen nicht — genau das »klein und matschig«.
         Eine Rundung, die die Größe halten soll, müsste zur AUSSENkugel blenden.

         WOHER DIE RESTLICHE ABSCHRÄGUNG KAM: die Rundung zieht die Ecken radial nach innen, die
         Flächenmitten bleiben — dazwischen entsteht eine Schräge, die wie eine Fase aussieht.
         Sie war nie ein Scherfehler, sondern die Rundung selbst.

         UND DER GRUNDSÄTZLICHE FEHLER, den ich benennen muss: `kfb-cartoon-animation_v2` §14
         verbietet, »Cartoon als Ersatz für Timing und Staging zu behaupten«. Genau das habe ich
         vier Runden lang getan — die Lesbarkeit aus der VERFORMUNG holen wollen, wo sie aus TIMING
         kommen muss. Ein Hartgummi-Würfel streckt sich im Flug nicht; das tut ein Ball. Ein Würfel
         liest sich über Bogen, Drehung, Hitstop und Staub.

         WAS BLEIBT: genau der eine Fall, in dem eine Achsenskalierung ehrlich ist — der Würfel
         liegt auf einer FLÄCHE (beim Laden und beim Landen), seine Achsen stehen dann weltparallel,
         und Stauchen lässt ihn eine saubere, flachere Kiste sein: kein Schern, keine Rundung.
         Im FLUG wird nicht verformt.
         RÜCKWEG: `setParams({ round: 0.62, stretch: 0.22, pull: 0.26, bulge: 0.55 })` holt die
         Gummifassung zurück; der Shader-Weg steht vollständig und ist nur auf null gestellt. */
      if (laedt || (d.onGround && s > 0)) {
        /* ⚠ V4-S26 · GEORG SIEHT DIE STAUCHUNG NICHT — und die Rechnung sagt, warum: sie hing
           LINEAR an der Ladung, und eine Ladung braucht 1,05 s bis zum Anschlag. Ein normaler
           Druck von 0,3 s ergibt Ladung 0,29 und damit 9 % Stauchung: rund vier Bildpunkte, im
           Bild nichts. Erst bei voller Ladung waren es 31 %.
           Zwei Änderungen: die Höchststauchung ist eine EIGENE Zahl (0,30 statt der 0,313 aus
           `deform`, das dem Aufprall gehört), und sie wächst mit der WURZEL der Ladung — damit
           steht bei 0,3 s schon die halbe Stauchung im Bild. `kfb-cartoon-animation_v2` §»Snappiness«
           verlangt genau das: Rückmeldung im ersten Bild, nicht am Ende der Rampe.
           Georgs Vorgabe wörtlich: »zumindest in der Höhe eingedrückt und insgesamt ein bisschen
           breiter« — breiter ist volumenerhaltend automatisch (quer = 1/√(1−Stauchung)). */
        const sp = laedt ? P.press * Math.pow(Math.min(1, d.charge), P.pressKurve) : Math.max(0, s);
        const iP = lokaleAchseUp();
        const quer = 1 / Math.sqrt(Math.max(0.25, 1 - sp));
        f[0] = quer; f[1] = quer; f[2] = quer; f[iP] = 1 - sp;
        rund = P.round * Math.min(1, sp / P.deform);
        woelb = P.bulge * sp;
        nachLokal(_axA, 0, 0, 1, 0, 0, 1);
      } else if (P.stretch > 0 && s < 0) {
        const spd = bv ? Math.hypot(bv.x, bv.y, bv.z) : 0;
        amtA = s * Math.min(1, spd / (P.vRef * 0.35));
        nachLokal(_axA, d.sqx, d.sqy, d.sqz, 0, 0, 1);
        rund = P.round * Math.min(1, Math.abs(amtA) / P.deform);
      }

      /* ── V4-S25 · DIE ZUGWEITE IST EINE NEIGUNG, KEINE VERSCHIEBUNG UND KEINE STRECKUNG ────────
         Georg hat meinen Kolben-Vorschlag mit dem richtigen Argument erledigt: »das wird nicht
         funktionieren, weil ich teilweise gar keinen Raum habe, wo ich den Würfel optisch hinziehen
         könnte, wenn er zwischen irgendwelchen Boxeln sitzt.« Stimmt — eine VERSCHIEBUNG braucht
         freien Platz neben dem Würfel, und den gibt es in einer Gasse nicht.
         Eine DREHUNG braucht keinen. Der Würfel kippt über seine vordere Bodenkante nach HINTEN,
         gegen die Schussrichtung — wie ein Sprinter im Startblock, wie ein zurückgezogener
         Pinball-Kolben. Er bleibt dabei in seinem eigenen Grundriss stehen, und die Kante, um die
         er kippt, LIEGT AUF DEM BODEN: nichts sinkt ein, nichts ragt in einen Nachbarklotz.
         Das ist Georgs bevorzugter Weg (b): »wenn wir das ohne visuelle Hilfen darstellen können
         und es trotzdem intuitiv ist, ist das eigentlich besser«. Drei Träger, alle am Würfel:
           Druckdauer → STAUCHUNG (steht schon, ehrlich, weil er auf einer Fläche liegt)
           Zugweite   → NEIGUNG gegen die Schussrichtung
           Ladung     → ZITTERN, hochfrequent und winzig, wächst quadratisch mit der Ladung
         Das Zittern ist eine SINUSSCHWINGUNG über der Uhr, kein Zufall — Zufall je Bild flackert
         (`kfb-cartoon-animation_v2` §5.2: stabiler Keim, nur Transformationen animieren).
         ⚠ Alles drei sitzt auf den SICHT-Knoten. Der Körper wird nicht angefasst; beim Loslassen
         fällt es in einem Bild weg, und genau das IST das Schnappen.
         RÜCKWEG: `setParams({ lean: 0, tremor: 0 })`. */
      d.sqInner.position.set(0, 0, 0);
      let neigung = 0;
      if (laedt && P.lean > 0) {
        neigung = P.lean * Math.min(1, d.zug || 0);
        /* ⚠ V4-S26 · RICHTUNG UMGEKEHRT, nach Georgs Einwand: »ich ziehe ihn ja in eine bestimmte
           Richtung und er fliegt in die Abschussrichtung — aus meiner Sicht soll es umgekehrt sein,
           dass er sich, wenn ich ziehe, MIT der Zugrichtung nach hinten kippt und dann nach vorne
           beschleunigt.« Er hat recht, und das war ein Vorzeichenfehler gegen meinen eigenen
           Kommentar: gebaut war eine Neigung IN die Schussrichtung (Drehung um (−ay, ax) mit
           positivem Winkel kippt die Oberseite nach +Schuss), beschrieben war das Gegenteil.
           Jetzt kippt die Oberseite MIT dem Zug, also gegen den Schuss — und die Kante, um die er
           kippt, ist die HINTERE Bodenkante (auf der Zugseite): dort liegt er auf, vorne hebt er ab.
           Damit ist die Geste dieselbe wie beim Pinball-Kolben, und das Loslassen ist die Entladung
           genau der Richtung, in die er dann schießt. */
        const hx = d.aimX, hy = d.aimY;
        const px = -hx * e * 0.5, py = -hy * e * 0.5, pz = -e * 0.5;
        _axL.set(-hy, hx, 0).normalize();
        _dq.setFromAxisAngle(_axL, -neigung);
        d.sqInner.quaternion.copy(_dq);
        d.sqInner.position.set(px, py, pz);
        d.mesh.position.set(-px, -py, -pz);
      }
      if (laedt && P.tremor > 0 && d.charge > 0.25) {
        const k = (d.charge - 0.25) / 0.75;
        const amp = P.tremor * e * k * k;
        d.sqOuter.position.x += Math.sin(time * 163) * amp;
        d.sqOuter.position.y += Math.sin(time * 197 + 1.7) * amp;
      }

      /* ── (1) ÜBERZEICHNETE GRÖSSE MIT DER FLUGHÖHE — Georgs Frage 1 ───────────────────────
         »Spiegelt die Würfelgröße die Sprung-/Flughöhe perspektivisch korrekt (cartoonig
         überzeichnet) wieder?« — die Kamera allein gibt bei dieser Brennweite und diesem Abstand
         kaum etwas her: von der Sohle bis zur Decke schrumpft der Bildabstand nur um wenige
         Prozent, und im Bild ist gar nicht zu sehen, ob er zwei Zellen oder fünf hoch steht.
         Also wird es ÜBERZEICHNET: bis +16 % auf Deckenhöhe, Bezug ist die Fläche UNTER ihm
         (nicht das Blatt — wer auf einem Klotz sitzt, ist nicht »oben«).
         ⚠ Das bricht die Volumenerhaltung ABSICHTLICH: es ist keine Verformung, sondern ein
         Maßstab. Cartoon-Perspektive statt Physik — benannt, damit es niemand als Fehler in der
         Volumenrechnung sucht. Berechnet wird er weiter oben, weil die Lage des Mittelpunkts an
         ihm hängt. */
      d.mesh.scale.set(e * f[0] * hochF, e * f[1] * hochF, e * f[2] * hochF);
      /* ⚠⚠ V4-S32 · DIE SOHLE WIRD GERECHNET, NICHT GERATEN. Georg: »der vergrößerte Würfel steckt
         auch noch im Kartenboden.« Meine Fassung von vorhin setzte den Mittelpunkt auf
         `Sohle + halbe Kante · Höhenmaßstab` — und hat damit ZWEI Dinge übersehen: die
         **Stauchung** (die den Würfel flacher macht, also müsste der Mittelpunkt tiefer) und die
         **Drehlage** (ein gekippter Würfel ist senkrecht höher als eine Kante: bis zum Faktor √3).
         Ein einzelner Korrekturfaktor kann das nicht treffen — also wird die halbe senkrechte
         Ausdehnung AUSGERECHNET: die drei skalierten Halbachsen, jede mit dem Betrag ihrer
         z-Komponente in der Welt. Damit liegt die Sohle bei JEDER Drehung, Stauchung und
         Vergrößerung genau auf `d.z` — eine Formel statt drei Sonderfälle. */
      const sc = d.mesh.scale, mq = d.mesh.quaternion;
      _dn.set(1, 0, 0).applyQuaternion(mq); const az = Math.abs(_dn.z) * sc.x;
      _dn.set(0, 1, 0).applyQuaternion(mq); const bz = Math.abs(_dn.z) * sc.y;
      _dn.set(0, 0, 1).applyQuaternion(mq); const cz = Math.abs(_dn.z) * sc.z;
      d.sqOuter.position.z = d.z + 0.5 * (az + bz + cz);

      /* Die Verformung selbst liegt im Material (stufenlose Richtung, Rundung, Wölbung). */
      if (d.bulge) {
        for (const u of d.bulge) {
          u.kfbAxA.value.copy(_axA); u.kfbAmA.value = amtA;
          u.kfbAxB.value.copy(_axB); u.kfbAmB.value = amtB;
          u.kfbRound.value = rund; u.kfbBulge.value = woelb;
        }
      }
      /* EIN WÜRFEL RUHT AUF EINER FLÄCHE, IN JEDEM ZUSTAND (Georg 04.09.: »der würfel landet nicht
         3D-korrekt auf einer seite, sondern ruht auf kante«).
         Vorher stand dieses Einrasten INNERHALB von `state === 'live'`. Ein Würfel, der nie live
         war — der bereitliegende beim Start — wurde also niemals ausgerichtet, und einer, dessen
         Zustand während des Ausrollens wechselt, friert auf halbem Weg ein (das Einrasten braucht
         rund eine halbe Sekunde). Die Bedingung ist die LAGE, nicht der Zustand. */
      const langsam = Math.hypot(d.vx, d.vy) < P.rest * F.cell * 3;
      if (false && d.onGround && (langsam || d.state !== 'live')) {
        const snap = Math.PI / 2;
        const k = Math.min(1, dt * 7);
        d.mesh.rotation.x += (Math.round(d.mesh.rotation.x / snap) * snap - d.mesh.rotation.x) * k;
        d.mesh.rotation.y += (Math.round(d.mesh.rotation.y / snap) * snap - d.mesh.rotation.y) * k;
      }
    }
  }

  function update(dt) {
    if (!F.ready) { measure(); if (!F.ready) return; }
    time += dt;
    /* ── V4-S31 · HITSTOP ───────────────────────────────────────────────────────────
       `kfb-cartoon-animation_v2` §11.4 führt ihn als das eigentliche Wucht-Signal: 40–95 ms
       Stillstand direkt nach dem Kontakt. Wir haben die Wucht bisher allein der VERFORMUNG
       aufgeladen — genau der Fehler, den §14 verbietet (»Cartoon als Ersatz für Timing«).
       Angehalten wird die PHYSIK und die Pose des Würfels (`drawDice(0)` friert die Feder ein) —
       die Effekte laufen WEITER, weil der Burst genau in dieser Pause gelesen werden soll.
       Die Uhr (`time`) läuft ebenfalls weiter: sie gehört der Anzeige, nicht dem Löser. */
    if (stopT > 0) {
      stopT -= dt;
      drawDice(0); drawAim(); drawFx(dt);
      return;
    }
    if (stopArm > 0) {
      stopArm -= dt;
      if (stopArm <= 0) { stopT = stopPend; stopPend = 0; }
    }
    tickCharge(dt);
    acc += Math.min(dt, P.maxFrame);
    const h = 1 / P.hz;
    let steps = 0;
    while (acc >= h && steps < 900) {
      for (const d of dice) stepDie(d, h);
      acc -= h; steps++;
    }
    drawDice(dt);
    drawAim();
    drawFx(dt);
  }

  /* Klang und Bild hängen an den EREIGNISSEN dieses Moduls, nicht im Löser — ein Ort, an dem
     entschieden wird, was zu sehen und zu hören ist (dieselbe Trennung wie in Podcast v4). */
  listeners.push((kind, e) => {
    /* ⚠ DER SAMMELHÖRER — STILLGELEGT, SOBALD ES EINEN EIGENTÜMER DER ORDNUNG GIBT.
       Er feuerte bei JEDEM Ereignis dieselben drei Formen mit derselben Dauer ab; das ist Georgs
       Befund »beliebig« in acht Zeilen Code (Kritik §1). `juice.v1.js` schaltet ihn per
       `setParams({ autoJuice: false })` ab und ruft die Formen mit Rang, Takt und Tonhöhe.
       Er bleibt stehen: ohne das Juice-Modul ist er der Notbetrieb, und `setEnabled(false)` dort
       gibt ihn zurück. */
    if (P.autoJuice === false) return;
    if (kind === 'hit') {
      if (e.mode === 'roll') { splat(e.x, e.y, e.z, F.edge * 0.5); burst(e.x, e.y, e.z, e.hex, 5); Sfx.pop(1 + (e.impact || 0)); }
      else { splat(e.x, e.y, e.z, F.edge * 0.7); ripple(e.x, e.y, e.z, F.edge * 1.5); burst(e.x, e.y, e.z, e.hex, 7);
             if (e.kind === 'bumper') Sfx.bumper(e.impact || 1); else Sfx.pop(1 + (e.impact || 0)); }
    } else if (kind === 'wall') { splat(e.x, e.y, e.z, F.edge * 0.4); Sfx.card(e.impact / F.cell); }
    else if (kind === 'land') { if (e.impact > F.cell * 4) { ripple(e.x, e.y, e.z, F.edge * 1.2); (e.paper ? Sfx.band : Sfx.card).call(Sfx, e.impact / F.cell); } }
    else if (kind === 'launch') { ripple(e.x, e.y, 0, F.edge * 1.4); Sfx.launch(e.power); }
    else if (kind === 'settle') Sfx.settle();
  });

  const api = {
    root, update, measure,
    attach() { loadModel(); reset(P.count); return api; },
    dice, reset,
    place,
    onEvent(f) { listeners.push(f); return api; },
    onPointerDown(ev) { Sfx.unlock(); return onDown(ev); },
    onPointerMove: onMove,
    onPointerUp: onUp,
    /** ESC — der Wirt gibt Tastendrücke weiter; das Modul kennt keine Tastatur von sich aus
        (ein Eigentümer für die Bedienung). */
    onKeyDown(ev) { if (ev && (ev.key === 'Escape' || ev.keyCode === 27)) return abbrechen(); return false; },
    cancelAim: abbrechen,
    charging() { return grab.on ? { die: grab.die.i, charge: grab.die.charge } : null; },
    setAudio(on) { P.audio = !!on; if (on) Sfx.unlock(); return P.audio; },
    setParams(o) { Object.assign(P, o || {}); if (o && o.count != null) reset(o.count); return api; },
    anyMoving() { return dice.some((d) => d.state === 'live' && (Math.hypot(d.vx, d.vy) > P.rest * F.cell || Math.abs(d.vz) > F.cell * 0.4 || d.z > 1e-4)); },
    hide() { for (const d of dice) { d.state = 'idle'; d.mesh.visible = false; } return api; },
    burst, ripple, splat,
    /* Der Synthesizer, offen für das Juice-Modul: EIN Gerät, getrennte Aufgaben — die Physik
       (Wurf, Wand, Aufsetzen) klingt hier, die Tonleiter der Kette dort (Kritik §8). */
    get sfx() { return Sfx; },
    /* ⚠ DIE FELDGRENZEN GEHÖREN DAZU. Ohne sie erfindet sich jede Messung ihre eigenen (meine hat
       `F.left/right` erfunden, die es hier nicht gab → Wurf auf NaN, Würfel fällt durch das Blatt,
       Zieldarstellung leer, und das Protokoll meldete »Ist null« statt »deine Messung ist kaputt«).
       Wer eine Zahl nicht besitzt, bittet den Eigentümer — dann muss der sie auch herausgeben. */
    geometry() { return { edge: F.edge, r: F.r, ceil: F.ceil, cell: F.cell,
                          left: F.left, right: F.right, bot: F.bot, top: F.top,
                          mitteX: (F.left + F.right) / 2, mitteY: (F.bot + F.top) / 2 }; },
    stats() {
      return { model: proto.kind, note: proto.note, mats: proto.mats, tinted: proto.tinted,
               edge: +F.edge.toFixed(4), edgePx: Math.round(F.edge * stage.metrics().pxPerUnit),
               r: +F.r.toFixed(4), maxV: +MAXV.toFixed(2), ceil: +F.ceil.toFixed(3),
               audio: P.audio,
               autoJuice: P.autoJuice !== false,
               /* WIE SCHIEF LIEGT DER WÜRFEL? Abstand jeder ruhenden Drehachse zur nächsten
                  Vierteldrehung, in Grad. »Auf einer Fläche« heißt: unter 2°. Ohne diese Zahl
                  war »ruht auf Kante« nur am Bild zu sehen — und Georg musste es melden. */
               kante: (() => {
                 /* Jetzt aus der ECHTEN Drehlage des Körpers (`cube.v1.schiefe()`): Winkel der
                    Hochachse zur nächsten Flächennormale, in Grad. Die v1 hat hier ihr eigenes
                    Einrasten gemessen — eine Zahl, die den Defekt nicht sehen konnte. */
                 let max = 0;
                 for (const d of dice) {
                   if (!d.body || !d.onGround) continue;
                   max = Math.max(max, d.body.schiefe());
                 }
                 return +max.toFixed(2);
               })(),
               kanteAlt: (() => {
                 const snap = Math.PI / 2;
                 let max = 0;
                 for (const d of dice) {
                   if (!d.mesh || !d.onGround) continue;
                   for (const a of ['x', 'y']) {
                     const r = d.mesh.rotation[a];
                     max = Math.max(max, Math.abs(Math.round(r / snap) * snap - r));
                   }
                 }
                 return +((max * 180) / Math.PI).toFixed(2);
               })(),
               dice: dice.map((d) => ({ i: d.i, state: d.state, x: +d.x.toFixed(2), y: +d.y.toFixed(2),
                                        z: +d.z.toFixed(3), v: +Math.hypot(d.vx, d.vy).toFixed(2),
                                        charge: +d.charge.toFixed(2) })) };
    },
    dev: {
      /* ABNAHME, die durchfallen KANN: n Würfe mit gesätem Zufall. Gezählt wird, was schiefgehen
         KANN — ausserhalb des Feldes, unter dem Blatt, über der Decke, nie zur Ruhe gekommen.
         ⚠ SIE VERBRAUCHT DAS FELD: die Würfe lösen echte Zellen auf, weil genau dieser Weg
         geprüft werden soll. Nach einer Abnahme ist die laufende Runde hinfällig — das steht hier,
         damit niemand die Zahlen einer verbrauchten Runde für den Stand hält. */
      audit(n) {
        n = n || 10;
        const keep = rndState.s;
        const d = dice[0];
        if (!d) return { bad: 1, why: 'kein Würfel' };
        const save = { x: d.x, y: d.y, z: d.z, vx: d.vx, vy: d.vy, vz: d.vz, st: d.state };
        let outside = 0, under = 0, over = 0, settled = 0, maxsp = 0;
        for (let i = 0; i < n; i++) {
          d.state = 'live'; d.settled = false;
          d.x = (F.left + F.right) / 2 + (rand() - 0.5) * (F.right - F.left) * 0.5;
          d.y = (F.bot + F.top) / 2 + (rand() - 0.5) * (F.top - F.bot) * 0.5;
          d.z = F.cell * 2; d.vz = 0;
          const a = rand() * Math.PI * 2, sp = F.cell * (3 + rand() * 8);
          d.vx = Math.cos(a) * sp; d.vy = Math.sin(a) * sp;
          /* ⚠ DIE ABNAHME MUSS DEN KÖRPER TREIBEN, nicht die Felder, die er BESCHREIBT.
             Nach dem Fork sind `d.vx/vy/vz` RÜCKSCHRIFTEN — sie zu setzen bewegt gar nichts mehr,
             und der Test hätte 8 von 8 ruhenden Würfeln gemeldet: eine Zahl, die den Defekt nicht
             sehen kann. Der Wurf geht deshalb durch DENSELBEN Weg wie im Spiel. */
          d.body.setWorld(gridWorld()).setPose(d.x / F.cell, d.y / F.cell, d.z / F.cell);
          d.body.flick({ x: Math.cos(a), y: Math.sin(a), z: 0 }, sp / F.cell, 0.8);
          d.seiteGemeldet = null; d.wandT = 0;
          for (let k = 0; k < P.hz * 5; k++) {
            stepDie(d, 1 / P.hz);
            if (d.x < F.left - F.r * 1.5 || d.x > F.right + F.r * 1.5 || d.y < F.bot - F.r * 1.5 || d.y > F.top + F.r * 1.5) outside++;
            if (d.z < -1e-4) under++;
            if (d.z > F.ceil + 1e-4) over++;
            const s = Math.hypot(d.vx, d.vy);
            if (s > maxsp) maxsp = s;
          }
          if (d.settled) settled++;
        }
        rndState.s = keep;
        Object.assign(d, { x: save.x, y: save.y, z: save.z, vx: save.vx, vy: save.vy, vz: save.vz, state: save.st });
        const r = { wuerfe: n, ausserhalb: outside, unterDemBlatt: under, ueberDerDecke: over,
                    zurRuhe: settled, maxTempo: +maxsp.toFixed(2), deckel: +MAXV.toFixed(2),
                    feldVerbraucht: true,
                    bad: outside + under + over };
        console.table([r]);
        return r;
      },
      /* Determinismus: zweimal derselbe Wurf muss dieselbe Lage ergeben.
         ⚠ WÄHREND DER MESSUNG WIRD DAS FELD STILLGELEGT. Ohne das misst der Test sich selbst
         kaputt: der erste Durchlauf löst Zellen auf, der zweite läuft über ein anderes Feld, und
         das Ergebnis wäre immer »FAIL« — eine Zahl, die nicht bestehen KANN, ist keine Messung. */
      /** S1-Messgriff: Zieldarstellung ohne Zeiger auslösen und die Vorhersage lesen. */
      zielProbe(charge, aimX, aimY, halten) {
        const d = dice[0]; if (!d) return null;
        const war = { on: grab.on, die: grab.die };
        grab.on = true; grab.die = d; d.charge = charge != null ? charge : 0.8;
        if (aimX != null) { const L = Math.hypot(aimX, aimY) || 1; d.aimX = aimX / L; d.aimY = aimY / L; }
        drawAim();
        const V = vorhersage(d);
        const punkte = aimDots.filter((s) => s.visible).length;
        if (!halten) { grab.on = war.on; grab.die = war.die; }
        return { ziel: d.ziel, punkte, bahnpunkte: V.pts.length, quadrat: aimPad.visible,
                 padPos: [+aimPad.position.x.toFixed(3), +aimPad.position.y.toFixed(3), +aimPad.position.z.toFixed(3)],
                 padScale: +aimPad.scale.x.toFixed(3),
                 dot0: aimDots[0].visible ? [+aimDots[0].position.x.toFixed(3), +aimDots[0].position.y.toFixed(3), +aimDots[0].position.z.toFixed(3)] : null,
                 dieXYZ: [+d.x.toFixed(3), +d.y.toFixed(3), +d.z.toFixed(3)], cell: +F.cell.toFixed(4),
                 vH: +V.w.vH.toFixed(2), vZ: +V.w.vZ.toFixed(2) };
      },
      /** V4-S22-Messgriff: Ladepose setzen und die Verformung DIREKT aus dem Zeichenweg lesen.
          ⚠ Der Umweg über `tick()` war unbrauchbar: `tickCharge` rechnet `d.zug` jedes Bild aus der
          Zeigerlage neu und überschreibt jeden von Hand gesetzten Wert — die erste Messreihe zeigte
          deshalb fünfmal dieselbe Zahl. Und die Kantenlänge `F.edge` ändert sich beim Rundenwechsel,
          also wird sie im GLEICHEN Aufruf gelesen wie die Skalierung, nie davor. */
      ladeProbe(charge, zug, aimX, aimY) {
        const d = dice[0]; if (!d) return null;
        const war = { on: grab.on, die: grab.die, c: d.charge, z: d.zug, s: d.squash };
        grab.on = true; grab.die = d;
        d.charge = charge; d.zug = zug; d.squash = 0; d.squashV = 0;
        if (aimX != null) { const L = Math.hypot(aimX, aimY) || 1; d.aimX = aimX / L; d.aimY = aimY / L; }
        drawDice(0);
        const e = F.edge, u = d.bulge && d.bulge[0] ? d.bulge[0] : null;
        const a = u ? u.kfbAmA.value : 0, b = u ? u.kfbAmB.value : 0;
        /* Die Halbachsen der Ellipse aus BEIDEN Verformungen — die Skalierung am Knoten ist jetzt
           gleichmäßig, die Form entsteht im Material. A und B stehen beim Laden senkrecht
           aufeinander (Druck senkrecht, Zug in der Ebene), also multiplizieren sich die Faktoren. */
        const lgA = Math.max(0.05, 1 - a), qrA = 1 / Math.sqrt(lgA);
        const lgB = Math.max(0.05, 1 - b), qrB = 1 / Math.sqrt(lgB);
        const grund = boxel.surfaceAt(d.x, d.y);
        const hochF = 1 + P.hoch * Math.max(0, Math.min(1, (d.z - grund) / Math.max(1e-3, F.ceil - grund)));
        /* ⚠ ZWEI KANÄLE, ZWEI ORTE — und meine erste Fassung dieser Zahl las nur EINEN.
           Seit V4-S24 sitzt das Stauchen wieder am KNOTEN (`mesh.scale`), der Shader ist auf null.
           Eine Probe, die nur die Shader-Werte liest, meldet dann 1,000/1,000/1,000 bei voll
           gestauchtem Würfel — dritter Fall der Klasse »die Zahl misst etwas anderes als ihr Satz
           behauptet«, diesmal in der Probe selbst. Jetzt beide Kanäle, mit dem Höhenmaßstab
           herausgerechnet. */
        const sc = d.mesh.scale, k = e * hochF;
        const knoten = [sc.x / k, sc.y / k, sc.z / k];
        const shader = [lgA * qrB, qrA * lgB, qrA * qrB];
        grab.on = war.on; grab.die = war.die; d.charge = war.c; d.zug = war.z; d.squash = war.s;
        return { faktoren: knoten.map((v) => +v.toFixed(4)),
                 shaderFaktoren: shader.map((v) => +v.toFixed(4)),
                 volumen: +(knoten[0] * knoten[1] * knoten[2] * shader[0] * shader[1] * shader[2]).toFixed(4),
                 amtDruck: +a.toFixed(4), amtZug: +b.toFixed(4),
                 rundung: u ? +u.kfbRound.value.toFixed(4) : null,
                 woelbung: u ? +u.kfbBulge.value.toFixed(4) : null,
                 achseZug: u ? u.kfbAxB.value.toArray().map((v) => +v.toFixed(3)) : null,
                 hochFaktor: +hochF.toFixed(4), kante: +e.toFixed(4),
                 knotenGleichmaessig: Math.abs(sc.x - sc.y) < 1e-9 && Math.abs(sc.y - sc.z) < 1e-9 };
      },
      /** Höhenmaßstab bei gegebener relativer Flughöhe — ebenfalls im gleichen Aufruf gemessen. */
      hochProbe(rel) {
        const d = dice[0]; if (!d) return null;
        const war = { z: d.z, st: d.state, og: d.onGround, s: d.squash };
        d.state = 'live'; d.onGround = false; d.squash = 0; d.squashV = 0;
        const grund = boxel.surfaceAt(d.x, d.y);
        d.z = grund + (F.ceil - grund) * rel;
        drawDice(0);
        const e = F.edge, k = d.mesh.scale.x / e;
        d.z = war.z; d.state = war.st; d.onGround = war.og; d.squash = war.s;
        return { rel, kantenFaktor: +k.toFixed(4) };
      },
      /** Hüllkurve der Streckung über dem Tempo — Georgs zweiter Befund als Zahl. */
      streckProbe(tempo) {
        const d = dice[0]; if (!d) return null;
        const bv = d.body.body.vel;
        const war = { s: d.squash, v: [bv.x, bv.y, bv.z], og: d.onGround, on: grab.on };
        grab.on = false;
        d.squash = -P.deform * 0.6; d.squashV = 0; d.onGround = false;
        bv.x = tempo; bv.y = 0; bv.z = 0;
        drawDice(0);
        const u = d.bulge && d.bulge[0] ? d.bulge[0] : null;
        const amt = u ? u.kfbAmA.value : 0;
        d.squash = war.s; bv.x = war.v[0]; bv.y = war.v[1]; bv.z = war.v[2];
        d.onGround = war.og; grab.on = war.on;
        return { tempo, streckung: +(-amt).toFixed(4) };
      },
      /** Neigung und Zittern messen — und die Zahl, die den Defekt sehen KANN: sinkt der Würfel
          beim Kippen ein? Die Kante, um die er kippt, muss auf dem Boden liegen bleiben. */
      neigeProbe(zug, charge, aimX, aimY) {
        const d = dice[0]; if (!d) return null;
        const war = { on: grab.on, die: grab.die, c: d.charge, z: d.zug,
                      bp: [d.body.body.pos.x, d.body.body.pos.y, d.body.body.pos.z] };
        grab.on = true; grab.die = d; d.zug = zug; d.charge = charge;
        if (aimX != null) { const L = Math.hypot(aimX, aimY) || 1; d.aimX = aimX / L; d.aimY = aimY / L; }
        drawDice(0);
        d.sqOuter.updateMatrixWorld(true);
        const e = F.edge;
        const grad = +(2 * Math.asin(Math.min(1, Math.hypot(d.sqInner.quaternion.x, d.sqInner.quaternion.y,
                        d.sqInner.quaternion.z))) * 180 / Math.PI).toFixed(2);
        /* Kippt er GEGEN den Schuss? Der Deckelmittelpunkt darf sich nur nach HINTEN bewegen.
           Gemessen in der Ebene der Karte, also im Bezugssystem von `sqOuter` — nicht in der Welt:
           die Karte ist gekippt, und ein Weltvergleich wäre wieder der Fehler aus V4-S25. */
        _dn.set(0, 0, 0.5); d.mesh.localToWorld(_dn); d.sqOuter.worldToLocal(_dn);
        const vorn = +((_dn.x * d.aimX + _dn.y * d.aimY) / e).toFixed(4);
        const zit = +(Math.hypot(d.sqOuter.position.x - d.x, d.sqOuter.position.y - d.y) / e).toFixed(4);
        const bp = d.body.body.pos;
        const drift = +Math.hypot(bp.x - war.bp[0], bp.y - war.bp[1], bp.z - war.bp[2]).toFixed(6);
        grab.on = war.on; grab.die = war.die; d.charge = war.c; d.zug = war.z;
        return { zug, charge, neigungGrad: grad, zitternKanten: zit,
                 deckelNachVorn: vorn, kanten: [+(d.mesh.scale.x / e).toFixed(4),
                   +(d.mesh.scale.y / e).toFixed(4), +(d.mesh.scale.z / e).toFixed(4)],
                 /* ⚠ NICHT die z-Kante lesen. Die Stauchung sitzt auf der Würfelachse, die nach OBEN
                    zeigt — liegt der Würfel gekippt, ist das nicht z, und »1 − z« meldet dann eine
                    NEGATIVE Stauchung bei gestauchtem Würfel (gemessen −25 % bei voller Ladung).
                    Die gestauchte Achse ist immer die mit dem kleinsten Faktor. */
                 gestaucht: +(1 - Math.min(d.mesh.scale.x, d.mesh.scale.y, d.mesh.scale.z) / e).toFixed(4),
                 koerperDrift: drift };
      },
      /** Aufzeichnung für Georgs reproduzierbaren Befund »die Vergrößerung greift erst nach 5–6
          Klicks«. Sie zeichnet bei JEDEM Drücken und Loslassen auf, was die Kette wirklich hatte —
          Ladewert, Knotenfaktoren, Zeitstempel. Damit muss er nicht mitten in der Geste anhalten:
          er klickt sechsmal, und danach steht im Protokoll, wann es angefangen hat zu wirken. */
      klickLog() { return klicks.slice(); },
      /** V4-S34 \u00b7 Eine Geste nachbilden, OHNE Zeiger: Griff `offset` Kanten neben der Mitte,
          `sek` Sekunden halten, `zieh` Kanten Zeigerbewegung. Sie treibt `tickCharge` selbst \u2014
          genau den Weg, in dem der Fehler sa\u00df. Zustand wird danach wiederhergestellt. */
      klickProbe(offset, sek, zieh) {
        const d = dice[0]; if (!d) return null;
        const war = { on: grab.on, die: grab.die, t0: grab.t0, px: grab.px, py: grab.py,
                      ax: grab.ax, ay: grab.ay, eFix: grab.eFix, c: d.charge, z: d.zug };
        grab.on = true; grab.die = d; grab.t0 = time; grab.eFix = null; grab.zug = 0;
        d.charge = 0; d.zug = 0;
        const gx = d.x + (offset || 0) * F.edge, gy = d.y;
        grab.px = gx; grab.py = gy; grab.ax = gx; grab.ay = gy;      // Anker = Griffpunkt
        const dt = 1 / 60, n = Math.max(1, Math.round((sek || 1) / dt));
        let maxC = 0;
        for (let i = 0; i < n; i++) {
          if (zieh) { const f = (i + 1) / n; grab.px = gx + zieh * F.edge * f; }
          time += dt;
          tickCharge(dt);
          if (d.charge > maxC) maxC = d.charge;
        }
        const erg = { griffVersatz: offset || 0, gehalten: +(n * dt).toFixed(2), gezogen: zieh || 0,
                      maxLadung: +maxC.toFixed(3), eFix: grab.eFix == null ? null : +grab.eFix.toFixed(3),
                      zug: +d.zug.toFixed(3) };
        grab.on = war.on; grab.die = war.die; grab.t0 = war.t0; grab.px = war.px; grab.py = war.py;
        grab.ax = war.ax; grab.ay = war.ay; grab.eFix = war.eFix; d.charge = war.c; d.zug = war.z;
        return erg;
      },
      determinism() {
        const orig = boxel.contact;
        boxel.contact = () => null;
        const run = () => {
          rndState.s = P.seed | 0;
          const d = dice[0];
          d.state = 'live'; d.x = (F.left + F.right) / 2; d.y = (F.bot + F.top) / 2;
          d.z = F.cell; d.vx = F.cell * 5.1; d.vy = F.cell * 2.7; d.vz = 0; d.spin = 2;
          d.cell = null; d.onGround = false; d.spawn = false;
          d.body.setWorld(gridWorld()).setPose(d.x / F.cell, d.y / F.cell, d.z / F.cell);
          d.body.flick({ x: 5.1, y: 2.7, z: 0 }, Math.hypot(5.1, 2.7), 0.8);
          d.seiteGemeldet = null; d.wandT = 0;
          for (let k = 0; k < 1500; k++) stepDie(d, 1 / P.hz);
          return d.x.toFixed(9) + '|' + d.y.toFixed(9) + '|' + d.z.toFixed(9);
        };
        const a = run(), b = run();
        boxel.contact = orig;
        const ok = a === b;
        console.log('[boxelball] determinism', ok ? 'OK' : 'FAIL', a, b);
        return { ok, a, b };
      },
      glb: () => ({ kind: proto.kind, note: proto.note, mats: proto.mats, tinted: proto.tinted }),
    },
  };
  return api;
}
