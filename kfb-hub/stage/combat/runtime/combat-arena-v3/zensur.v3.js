/* KFB Combat Arena v3 · zensur.v3.js — M12: DIE ZENSUR-SCHICHT (Slice S11)
   ─────────────────────────────────────────────────────────────────────────
   Georgs Rahmen (ENTWURF_zensur-und-heilung.md §1): die Monster sind infiziert und ZENSIEREN.
   Wer nicht eingreift, sieht die Karte zulaufen — schwarze Tuschespritzer, die zusammenwachsen.
   Ist die Karte schwarz, ist sie verloren. Das ist die Uhr, die dem Kampf fehlte, und sie hängt
   nicht als Balken oben rechts, sondern liegt im Bild.

   WAS DIESES MODUL IST: eine zweite Textur über der Karte, in die jeder Spritzer EINMAL gezeichnet
   wird. Sie wird nie gelöscht, nur ergänzt — deshalb kann der Deckungsgrad nicht fallen, und
   deshalb ist »wie schwarz ist die Karte« eine Zahl und kein Eindruck (Boden C22).

   WAS ES NICHT IST: keine Heilung (S13), kein Blumenweg (S14), kein Beat-Typ (S12 — dort bekommt
   das Spucken seine Zeitachse und seine Ansage). Hier steht nur die Bedrohung.

   ⚠ DREI ENTSCHEIDUNGEN, DIE MESSBAR SIND UND DESHALB HIER STEHEN, NICHT IN EINER MEINUNG:

   (1) ECHTE KLECKSE, KEINE NEBELFLECKEN. Die Formen sind die 36 PNGs aus
       `media/2D_Assets/kenney_splat-pack`, geladen über die RAW-Kette (nicht kopiert). Sie sind
       weiße Alphamasken, werden einmal in die Kanon-Tusche eingefärbt und danach gestempelt:
       36 Formen × freie Drehung × Spiegelung × Maßstab, plus Doppelschlag in einem Viertel der
       Fälle. Unter jedem Stempel liegt derselbe Klecks weich und halb deckend — dieser Halo ist
       der Schließmechanismus: zwei Flecken, die sich fast berühren, überschreiten die Schwelle
       gemeinsam. Laufüber wachsen Lücken deshalb von selbst zu.

   (2) DIE SCHICHT IST EIN KIND DER KARTE. Erster Wurf hing sie in die Szene und zog ihre Höhe
       jedes Bild aus `ring.floorY()` — und das war doppelt gezählter Atemhub (der Hub steht schon
       in `position.y`). Die Tusche lag die halbe Periode unter dem Papier: Georg 07.09., »das
       Schwarz verschwindet zwischendurch immer wieder«. Dieselbe Ursache hatte der gelbe
       Startring am Tag davor. `floorY()` ist korrigiert, und die Schicht hängt trotzdem IM
       Kartenknoten — was aufeinander liegen soll, gehört hinein, nicht daneben mit Nachführung.

   (3) EIN ZEICHENWEG, EIN RÜCKLESEWEG. Gezeichnet wird bei Ereignissen (ein Spritzer je Spucken),
       gelesen alle 0,5 s auf 64 × 64 — ein Wert je Lesung, deterministisch, prüfbar. Kein
       Rücklesen je Bild (das wäre ein GPU-Halt für eine Zahl, die sich in 16 ms nicht ändert).

   (4) 100 % SIND 100 % DER MESSFLÄCHE, NICHT DES BLATTS. Gelesen wird das Blatt ohne den
       Beschnittrand (`leseEinzug` 0,35 u je Seite) — dort liegt der gedruckte Tuscherahmen, keine
       Spielfläche. Herleitung und die Messung, die es erzwungen hat, stehen bei `SPEC.leseEinzug`.

   (5) DER ZULAUF IST STETIG UND UNGLEICHZEITIG (Georg 07.09.: »das Zusammenlaufen ist noch ruckelig
       und nicht tusche-mäßig fließend« · »eine bessere Fluss-Animation als die unnatürlich
       regelmäßigen Kreise«). Erste Fassung ließ ALLE Kleckse alle 0,4 s um 0,008 u wachsen — zwei
       bis drei Sprünge je Sekunde, alle im selben Bild, über die ganze Karte. Das ist ein Takt und
       kein Fließen, und man sieht den Takt.
       Drei Änderungen, gleiche Durchschnittsgeschwindigkeit (0,02 u/s):
         · JEDER Klecks hat seine eigene Uhr (Phase gestreut, Abstand 0,28 s ± Hälfte) und seine
           eigene Federweite. In jedem Bild läuft irgendwo etwas, nirgends alles.
         · Er läuft NICHT rundherum gleich weit: ein zweiter Durchgang ist in der Flussrichtung des
           Kleckses gestreckt (`zunge`) — eine Zunge statt eines aufgeblasenen Kreises.
         · Die Tropfen sind keine Kreise mehr, sondern derselbe Klecksatlas in klein, je mit eigener
           Drehung und Spiegelung. Ein perfekter Kreis kommt in Tusche nicht vor.

   (6) DIE TUSCHE LÄUFT ZUR OUTLINE, NICHT DIE OUTLINE INS FELD (Georg 07.09., zwei Bilder). Die
       letzten Lücken liegen an der Blattkante, weil gespuckt wird, wo die Zielsuche hinsieht: auf
       die MESSFLÄCHE (Blatt ohne Beschnittrand, siehe `leseEinzug`). Der erste Versuch zog deshalb
       die Kontur selbst mit wachsender Feder nach — wirksam, aber falsch herum: das liest sich als
       ausblutender Rahmen. Jetzt trägt ein Klecks im äußeren Viertel (`randZone`) seine
       Flussrichtung NACH AUSSEN und läuft dort schneller (`randSchub`); die Kontur bleibt reine
       Maske und klippt ihn. Die Fläche erreicht die Linie, die Linie rührt sich nicht.

   OFFENE FRAGE, ALS SCHALTER STATT ALS ANNAHME (ENTWURF §6.4): kriecht die Tusche ohne Monster
   weiter? Standard `kriechen: 0` — sie steht still. Wer es anders will, dreht die Zahl hoch; die
   Entscheidung bleibt sichtbar, statt in einer Konstante zu verschwinden.

   KEIN Math.random (Boden C10): jede Streuung kommt aus `rng` des Wirts.                        */

export const SPEC = {
  lange: 1024,          // Kantenlänge der langen Seite der Tuscheschicht (px)
  raster: 64,           // Rückleseraster — ein Wert je Lesung (ENTWURF §3)
  leseTakt: 0.5,        // s zwischen zwei Rücklesungen
  spuckTakt: 2.6,       // s zwischen zwei Spritzern EINES Monsters, im Frieden
  /* ── SPUR (Georg 08.09.: »lass uns das mit Spur zuerst ausprobieren«) ─────────────────────
     Ein Monster zensiert nicht nur, wenn es spuckt, sondern SCHON DURCHS LAUFEN: es stempelt seine
     Spur ins Blatt, der Flood lässt die Stempel zu einem Strich zusammenlaufen. Drei
     Entscheidungen, die daran hängen:
       (1) Getaktet nach STRECKE, nicht nach Zeit. Ein Zeittakt zeichnet auch im Stillstand — dann
           steht das Monster in einer Pfütze, statt eine Spur zu ziehen.
       (2) Runde, weiche Kleckse, KEINE Borstenstreifen (Georg, dasselbe Datum: »lieber ohne die
           Streifen und wie vorher mit Splats«). Ein Borstenpinsel entlang einer drehenden Bewegung
           bräuchte Ausrichtung, Andruck und Auflösung je Borste — drei Größen, die niemand geregelt
           hat. Der Strich entsteht stattdessen aus Überlappung, und das ist auch die ehrlichere
           Physik: ein nasser Stempel läuft in den nächsten.
       (3) Die Breite kommt aus dem KörPER. Der dicke rote Brocken ist ein Pinsel, der dünne braune
           ein Federstrich — ohne eine Tabelle je Monster. */
  spurAb: 0.42,         // u Strecke zwischen zwei Spurstempeln
  spurBreite: 1.15,     // × Körperradius = Radius des Spurkleckses
  spurGroesse: 0.72,    // die Spur ist etwas kleiner als ein Spucker (sie kommt dafür laufend)
  kampfAnteil: 0.5,     // im Kampf spucken sie halb so oft (Frage 3: immer, aber im Frieden mehr)
  radius: 0.62,         // Spritzer-Radius in Welt-u (Grundmaß, je Klecks variiert)
  groesse: [0.62, 1.5], // Größenspanne je Klecks (Georg 07.09.: die Splats sollen variieren)
  tropfen: [4, 9],      // freie Kreise je Klecks — Tropfen und Anschnitt
  tropfenR: [0.06, 0.3],// ihre Größe als Anteil des Klecksradius
  formen: 36,           // kenney_splat-pack · Vector — über RAW geladen, nicht kopiert
  schatten: 0.16,       // GLOBALER Schatten der Tuscheschicht (eine Ebene, kein Halo je Klecks)
  schattenVersatz: 0.05,// u, Versatz dieser Ebene
  zulaufAb: 0.45,       // ab dieser Deckung fängt die Tusche an zu laufen
  zulaufTakt: 0.28,     // s · MITTLERER Abstand zweier Laufschritte EINES Kleckses (Phase je Klecks gestreut)
  zulaufRate: 0.02,     // u/s · Laufweite nach außen. Dieselbe Geschwindigkeit wie 0,008 u je 0,4 s, nur stetig
  zunge: 0.22,          // Anisotropie: so viel läuft die Tusche in ihrer Flussrichtung MEHR als rundherum
  /* ⚠ KEIN RANDLAUF VON DER KONTUR NACH INNEN (Georg 07.09.: »die Outline selbst sollte nicht ins
     Feld fließen, sondern die Tusche-Flächen zur Outline«). Die erste Fassung zog die Kartenkontur
     mit wachsender Feder nach — das schloss den Streifen, aber die Richtung war falsch: es sah aus,
     als blüte der gedruckte Rahmen aus, statt dass die Tusche ihn erreicht. Jetzt bekommen die
     Kleckse AM RAND ihre Flussrichtung nach außen und mehr Laufneigung; sie wachsen also auf die
     Kontur zu und werden von ihr geklippt. Gleiche Wirkung, richtige Ursache. */
  randZone: 0.24,       // Anteil der halben Kante, in dem ein Klecks als Randklecks gilt
  randSchub: 2.1,       // Laufneigung dieser Kleckse × diesen Faktor, Flussrichtung nach außen
  bloecke: 8,           // Grobraster für die Zielsuche: 8 × 8 Felder über die Messfläche
  zielTakt: 1.4,        // s zwischen zwei Zielentscheidungen EINES Monsters
  zielNaehe: 0.55,      // Gewicht der Entfernung gegen die Sauberkeit (0 = nur sauber, 1 = nur nah)
  /* ⚠ DIE SCHWELLE SAGT, WAS »SCHWARZ« HEISST — und 0,62 hat gelogen (Georg 07.09.: »es scheint kein
     Vollschwarz zu sein«, bei gemeldeten 100 %). Gelesen wird auf 64 × 64, ein Rasterfeld ist also
     der MITTELWERT von 16 × 16 Bildpunkten. Bei 0,62 zählte ein Feld schon als zensiert, wenn ein
     gutes Drittel darin noch Papier war — mal 4096 Felder ist das die Karte, die er gesehen hat:
     Zahl voll, Bild löchrig. 0,86 heißt: ein Feld gilt erst als schwarz, wenn fast nichts mehr
     durchkommt. Der Preis ist eine längere Runde, und den zahlt lieber die Uhr als die Wahrheit. */
  schwelle: 0.86,       // ab diesem mittleren Alpha gilt ein Rasterfeld als zensiert
  verlustBei: 1,        // Deckungsgrad der MESSFLÄCHE, der die Karte verliert
  /* ⚠ DIE MESSFLÄCHE IST NICHT DAS BLATT. Gemessen 07.09. (Kritiker): 1480 Spritzer über die ganze
     Karte sättigen bei **99,4 %** und bleiben dort — 14 von 4096 Rasterfeldern bleiben offen, und
     ALLE 14 liegen in der äußersten Zeile oder Spalte (x = 0 · y = 0 · x = 63). Der Grund ist
     Geometrie, kein Rundungsfehler: ein Fleck deckt nur bis zu seinem Rand, also braucht die
     äußerste Pixelreihe einen Mittelpunkt JENSEITS der Kante. Damit war `deckung >= 1` ein Tor,
     das sich nicht schließen kann, und die zweite Backe der Zange hat nie gefeuert.
     Zwei Zeilen, ein Fix: (a) gelesen wird das Blatt OHNE den Beschnittrand — dort liegt der
     gedruckte Tuscherahmen, die Fläche ist ohnehin keine Spielfläche; (b) Spritzer dürfen über die
     Kante hinaus gesetzt werden, genau wie bei einem Monster, das am Rand nach außen spuckt.
     Merksatz: ein Boden bei 100 % muss sagen, 100 % WOVON. */
  leseEinzug: 0.35,     // u je Seite, die nicht gemessen werden — Beschnittrand + halber Fleckenradius
  streuung: 0.54,       // Salve: Mittelpunkte bis ±0,54 × Kante, also bewusst über den Rand hinaus
  kriechen: 0,          // Wachstum ohne Monster (offene Frage 4) — 0 = steht still
  ink: [31, 26, 20],    // #1f1a14, die Kanon-Tusche (dieselbe wie Kartenkante und Beschnitt)
  hoehe: 0.0            // ⚠ NULL, und der Vortritt kommt aus `polygonOffset` (siehe `neueKarte`)
};

export default class Zensur {
  static describe() {
    return { name: 'Zensur', capabilities: ['three@0.160', 'rng', 'time', 'assets'], view: '3d', determinism: 'seeded', spec: SPEC };
  }

  async init(ctx) {
    this.THREE = ctx.three;
    this.rng = ctx.rng;
    this.assets = ctx.assets || null;
    this.time = ctx.time || null;
    this.log = (s) => (ctx.log || console.info)('[zensur] ' + s);
    this.an = true;
    this.spuckTakt = SPEC.spuckTakt;
    this._ink = 'rgb(' + SPEC.ink[0] + ',' + SPEC.ink[1] + ',' + SPEC.ink[2] + ')';
    this.flecken = [];    // jeder gezeichnete Klecks, damit der Zulauf ihn nachziehen kann
    this.feder = 0;       // größte Laufweite eines Kleckses in Welt-u (jeder Klecks hat seine eigene)
    this.zulaeufe = 0;    // Laufschritte EINZELNER Kleckse (nicht mehr Durchgänge über alle)
    this.randKleckse = 0; this.umzuege = 0;
    this._zt = 0;
    this.deckung = 0; this.mittel = 0;
    this.messungen = 0; this.rueckgang = 0;
    this.gezeichnet = 0; this.spuckBeats = 0; this.verworfen = 0; this.spuren = 0;
    this.verlorenBei = null;
    this._leseT = 0; this._laufzeit = 0; this._vorher = null;
    this.gruppe = new this.THREE.Group();
    this.gruppe.name = 'zensur';
    this.gruppe.renderOrder = 2;
    this.blattLaden();   // 36 echte Kleckse aus dem Repo, im Hintergrund
  }

  /** Der Integrator montiert (CONTRACT: der Wirt kennt den Ort nicht). */
  mount(parent) { parent.add(this.gruppe); return this.gruppe; }

  /** Die drei Handgriffe, die dieses Modul liest — Karte, Gegner, Protokoll. */
  binden(o = {}) {
    this.ring = o.ring || this.ring || null;
    this.mb = o.mb || this.mb || null;
    if (o.fl !== undefined) this.fl = o.fl;   // S11b: die Flood-Darstellung (optional, Modul lebt ohne sie)
    if (o.sp !== undefined) this.sp = o.sp;   // S12: die Spuck-Choreographie (optional, siehe `update`)
    if (o.aniso) this.aniso = o.aniso;
    return this;
  }

  /* DIE KONTUR ALS MASKE FÜR DEN FLOOD (S11b). Die Canvas-Schicht ist beim Zeichnen geklippt — der
     Flood auf der GPU kennt kein `clip()`, er braucht die Form als Textur. Halbe Auflösung reicht:
     die Maske entscheidet drinnen/draußen, keine Zeichnung. */
  maskeTextur() {
    const T = this.THREE;
    if (!this.canvas || !T) return null;
    const W = this.canvas.width;
    const H = this.canvas.height;
    /* VOLLE AUFLÖSUNG, seit die Maske die Kontur IST (siehe unten). Halbe Auflösung war richtig,
       solange die Maske nur »drinnen/draußen« sagte und ein Überstand die Unschärfe verdeckte —
       jetzt entscheidet ihre Kante über die Tuschekante, und ±1 Maskentexel wären ±2 Texel auf dem
       Blatt. Kosten: ein Canvas je Karte, einmal. */
    const c = this._maskeCv || (this._maskeCv = document.createElement('canvas'));
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.clearRect(0, 0, W, H);
    g.fillStyle = '#ffffff';
    if (this._maske) { g.save(); g.scale(W / this.canvas.width, H / this.canvas.height); g.fill(this._maske); g.restore(); }
    /* ⚠ KEIN ÜBERSTAND MEHR. Vorher wurde die Maske mit einem Strich nach außen geweitet — als
       zweiter Gürtel gegen den hellen Faden an der Kartenkante. Der war ein Fehler in zwei Schritten:
       die ECHTE Ursache des Fadens war `alphaTest` 0,5 auf allen Blättern (behoben, SOP §4), und der
       Überstand hinterließ einen Streifen, den die Maske als Blatt zählt, den der Zeichen-Clip aber
       nie erreicht — gemessen 08.09.: 1,10 % der Maskenfläche blieb für immer hell, ALLE davon
       innerhalb von 5 Texeln am Rand. Gegen die KONTUR gemessen waren es nur 0,084 %, und die liegen
       unter der Tuscheoutline. Also: Maske = Kontur, exakt eine Kante.
       Merksatz: zwei Sicherungen gegen denselben Fehler heben sich nicht auf, sie schaffen einen
       Zwischenraum. */
    else g.fillRect(0, 0, W, H);
    if (this._maskeTex) this._maskeTex.dispose();
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    this._maskeTex = tex;
    return tex;
  }

  /* UMSCHALTER FÜR DEN BLINDVERGLEICH (Georg 07.09.). Dasselbe Mesh, andere Karte: `canvas` zeigt
     die gezeichnete Schicht, `flood` das gefloodete Bild. Der Schatten LEIHT sich dieselbe Textur,
     also wird sie an zwei Stellen gesetzt und an einer entsorgt (siehe `entfernen`).
     ⚠ `needsUpdate` NUR beim Moduswechsel: der Flood tauscht seine zwei Ziele je Schritt, also
     wechselt die Textur-Identität 60 × je Sekunde. Ein `needsUpdate` je Bild wäre ein Shader-Neubau
     je Bild — die Uniform allein reicht, weil beide Texturen dieselbe Art haben. */
  darstellung(modus) {
    if (!this.schicht) return this.modus || 'canvas';
    const flood = modus === 'flood' && this.fl && this.fl.an && this.fl.texture();
    const t = flood || this.tex;
    if (!t) return this.modus || 'canvas';
    const neu = flood ? 'flood' : 'canvas';
    const wechsel = neu !== this.modus;
    for (const m of [this.schicht, this.schattenM]) {
      if (!m || !m.material) continue;
      if (m.material.map !== t) { m.material.map = t; if (wechsel) m.material.needsUpdate = true; }
    }
    if (wechsel) this.log('Darstellung: ' + neu);
    this.modus = neu;
    return neu;
  }

  /* ── Die Schicht: eine je Karte, in ihrem eigenen UV-Raum ────────────────── */
  neueKarte() {
    const T = this.THREE;
    const u = this.ring && this.ring.current && this.ring.current.userData;
    if (!u || !(u.w > 0) || !(u.d > 0)) { this.log('keine Karte gemessen — Schicht wartet'); return null; }
    const w = u.w, d = u.d;
    /* Gleiches Maß = gleiche Schicht, nur frisch gewischt. Ein Neubau je Karte wäre eine Textur
       mehr im Speicher für dieselbe Geometrie. */
    if (this.schicht && Math.abs(this.w - w) < 1e-4 && Math.abs(this.d - d) < 1e-4) {
      /* Gleiches Maß, aber NEUE Karte: die Kontur gehört dem Seed der Karte, nicht ihrer Größe.
         ⚠ UND DER ORT GEHÖRT DAZU. Diese Abkürzung hat die Schicht am ALTEN Kartenknoten gelassen —
         der Ring baut je Karte einen neuen (neue uuid), also hing sie danach an einem Knoten, der
         nicht mehr in der Szene ist: 100 % Deckung im Zähler, blitzsaubere Karte im Bild. */
      this._anhaengen();
      this._maskeBauen(this.canvas.width, this.canvas.height);
      this.frei();
      this._floodNachziehen();
      return this.schicht;
    }
    this.entfernen();
    const W = SPEC.lange, H = Math.max(64, Math.round(SPEC.lange * d / w));
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    this.canvas = c; this._g = c.getContext('2d');
    const kl = document.createElement('canvas'); kl.width = SPEC.raster; kl.height = SPEC.raster;
    this._klein = kl; this._kg = kl.getContext('2d', { willReadFrequently: true });
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    tex.anisotropy = this.aniso || 8;
    this.tex = tex;
    const m = new T.Mesh(
      new T.PlaneGeometry(w, d),
      new T.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false,
        /* ⚠ KEIN HÖHENVERSATZ MEHR, SONDERN POLYGON-OFFSET. Die Schicht lag 0,02 u über dem Papier,
           und bei 37° Kameraneigung verschiebt das die Tusche gegen das Blatt um 0,02 × tan 53° ≈
           0,027 u — an der abgewandten Kante schaut cremefarbenes Papier hervor. Das waren die
           »hellen Blitzer im Schwarz« (Georg 08.09., Bild): keine Rechenlücke, sondern Parallaxe.
           `polygonOffset` gibt dem Mesh den Vortritt in der TIEFENPRÜFUNG, ohne es im Raum zu
           verschieben — damit ist der Versatz 0 und die Z-Fight-Gefahr trotzdem weg.
           RÜCKWEG: `hoehe` wieder auf 0,02 und diese drei Zeilen löschen. */
        polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.y = SPEC.hoehe;
    m.renderOrder = 2;
    m.name = 'zensur-schicht';
    /* ⚠ KIND DER KARTE, NICHT DER SZENE. Erster Wurf hing die Schicht in die Szene und zog ihre
       Höhe jedes Bild aus `ring.floorY()` — und `floorY()` addierte den Atemhub ein ZWEITES Mal
       (der Hub steht schon in `position.y`). Ergebnis: die Tusche lag die halbe Periode unter dem
       Papier, Georg 07.09.: »das Schwarz verschwindet zwischendurch immer wieder«. `floorY()` ist
       in `arena-ring.v1.js` korrigiert, aber die Schicht bleibt trotzdem ein KIND: als Kind kann
       sie gar nicht mehr auseinanderlaufen, egal wie die Karte sich bewegt.
       Merksatz: was auf etwas liegen soll, gehört hinein — nicht daneben mit Nachführung. */
    (this.ring.current || this.gruppe).add(m);
    this.schicht = m; this.w = w; this.d = d; this.pxU = W / w;
    this._maskeBauen(W, H);
    /* DER SCHATTEN IST GLOBAL: EINE Ebene, dieselbe Textur, versetzt, schwarz, halbdurchsichtig
       (Georg 07.09.: »einen leichten Schatten wäre wahrscheinlich nicht schlecht, aber den würde
       ich global setzen«). Ein Halo je Klecks war der Grund, warum die Tusche nicht auf der Karte
       zu liegen schien — dieser hier kostet einen Zeichenaufruf für die ganze Schicht.
       `color: 0x000000` × Textur = reines Schwarz mit dem Alpha der Tusche. */
    const sm = new T.Mesh(
      new T.PlaneGeometry(w, d),
      new T.MeshBasicMaterial({ map: tex, color: 0x000000, transparent: true, opacity: SPEC.schatten, toneMapped: false, depthWrite: false,
        polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })
    );
    sm.rotation.x = -Math.PI / 2;
    sm.position.set(SPEC.schattenVersatz, SPEC.hoehe, SPEC.schattenVersatz);
    sm.renderOrder = 1;
    sm.name = 'zensur-schatten';
    (this.ring.current || this.gruppe).add(sm);
    this.schattenM = sm;
    this.frei();
    this._floodNachziehen();
    const f = this._leseFeld();
    this.log('Schicht ' + W + ' × ' + H + ' px auf ' + w + ' × ' + d.toFixed(2) + ' u · ' + this.pxU.toFixed(1) + ' px/u'
      + ' · Messfläche ' + (f.x1 - f.x0).toFixed(2) + ' × ' + (f.z1 - f.z0).toFixed(2) + ' u (Einzug ' + f.einzug.toFixed(2) + ' u je Seite)');
    return m;
  }

  /* ⚠ DIE TUSCHE MUSS IN DER KARTE BLEIBEN. Solange die Karte ein Rechteck war, war die Schicht
     als Rechteck richtig. Seit die Kante nach Kanon gebaut ist (unregelmäßige Kontur,
     `arena-ring.v1.js · _traeger`), hängen Kleckse am Rand sonst über das Blatt hinaus in die Luft.
     Also dieselbe Kontur wie Blatt, Bild und Kante — zum dritten Mal dieselbe Regel des Builders:
     EINE Kontur, oder es sind zwei Formen. Ohne Builder (kein Deck erreichbar) bleibt die Schicht
     rechteckig, und das Protokoll sagt es. */
  _maskeBauen(W, H) {
    this._maske = null;
    const cur = this.ring && this.ring.current;
    const cb = this.ring && this.ring.cb;
    const rec = cur && cur.userData && cur.userData.rec;
    if (!cb || !cb.ink || !rec || typeof Path2D === 'undefined') { this.log('keine Kartenkontur — Schicht bleibt rechteckig'); return null; }
    try {
      const preset = (cb.params && cb.params.preset) || 'card';
      const pts = cb.ink.contour(preset, rec.seed, W, H);
      /* ⚠ DIE TUSCHE MUSS BIS UNTER DIE OUTLINE REICHEN (Georg 08.09.: »es gibt wieder die Lücke
         zwischen Outline und Kartenkante … evtl. eine dünnere Stelle der Outline«). Genau das ist es:
         die Kontur ist die MITTE der Feder, die Outline ist ein Band um sie herum. Wer die Tusche an
         der Konturmitte abschneidet, lässt an jeder Stelle, an der die Feder dünner läuft, einen
         cremefarbenen Faden zwischen Tusche und Außenkante der Outline stehen — und am fernen
         Blattrand wird dieser Faden bei 37° Neigung über mehrere Bildpunkte gezogen.
         Also wächst die Maske um die halbe Federbreite nach außen (`maskGrow` aus dem Kanon, genau
         der Wert, für den er da ist), und zwar für den ZEICHEN-Clip UND die Flood-Maske, weil es
         DIESELBE Form ist. Der Fehler vom Vormittag war, sie nur für die Flood-Maske zu weiten: dann
         entsteht ein Band, das die Maske als Blatt zählt und der Clip nie erreicht.

         Das Wachsen ist eine NÄHERUNG: die Punkte werden vom Blattmittelpunkt aus radial gestreckt,
         also wächst eine Ecke etwas mehr als eine Kantenmitte. Bei 1024 px Blattbreite und rund
         5 px Wachstum ist die Streuung unter 2 px — benannt, weil sie da ist. Exakt wäre ein
         Polygon-Offset je Segment, und der gehört in den Kanon und nicht hierher. */
      let g = 0;
      /* Die Signatur ist `(preset, pts, W, H, seed)` — mein erster Aufruf gab drei Argumente und
         bekam deshalb 0 zurück (gemessen: `_maskeGrow` blieb null). Der Kanon liefert hier »höchstens
         die KLEINSTE vorkommende Halbbreite«, also genau das Maß der dünnsten Stelle der Feder —
         die Stelle, an der Georgs Faden zu sehen war. */
      try { g = cb.ink.maskGrow ? (cb.ink.maskGrow(preset, pts, W, H, rec.seed) || 0) : 0; } catch (e) { g = 0; }
      if (!(g > 0)) g = 0;
      /* ⚠ EINE HALBE FEDER REICHT NICHT GANZ (Georg 08.09., drittes Bild vom selben Saum). `maskGrow`
         liefert die KLEINSTE vorkommende Halbbreite (gemessen 1,2 px) — das ist die sichere Grenze,
         an der nichts über die dünnste Stelle der Outline blitzen kann. Der Faden steht aber dort,
         wo die Feder DICKER ist: da endet die Tusche 1,2 px hinter der Konturmitte, während die
         Outline noch zwei, drei Pixel weiterläuft. Bei 37° Neigung wird das an der fernen Kante über
         mehrere Bildpunkte gezogen.
         Also das Doppelte, plus einen halben Pixel für die Kantenglättung des Zeichnens — und keinen
         Deut mehr: das ist die Grenze, ab der an den dünnen Stellen Tusche neben der Linie stünde.
         Merksatz: eine Zahl, die für den schlimmsten Fall stimmt, stimmt für den Normalfall nicht. */
      if (g > 0) g = g * 2 + 0.5;
      const cx = W / 2, cy = H / 2;
      let rSum = 0;
      for (const q of pts) rSum += Math.hypot(q[0] - cx, q[1] - cy);
      const rMit = rSum / pts.length || 1;
      const k = 1 + (g > 0 ? g / rMit : 0);
      const gew = pts.map((q) => [cx + (q[0] - cx) * k, cy + (q[1] - cy) * k]);
      const p = new Path2D();
      p.moveTo(gew[0][0], gew[0][1]);
      for (let i = 1; i < gew.length; i++) p.lineTo(gew[i][0], gew[i][1]);
      p.closePath();
      this._maske = p;
      this._maskeGrow = +g.toFixed(2);
      this.log('Kontur der Karte übernommen (Seed ' + rec.seed + ', ' + pts.length + ' Punkte)'
        + ' · um ' + this._maskeGrow + ' px nach außen gewachsen (halbe Feder), damit die Tusche unter die Outline reicht');
    } catch (e) { this.log('Kontur nicht lesbar: ' + ((e && e.message) || e)); }
    return this._maske;
  }

  radieren(x,z,r) {
    if(!this.canvas || this._loesenT!=null)return 0;
    const px=(x/this.w+.5)*this.canvas.width,py=(z/this.d+.5)*this.canvas.height;
    const before=this.flecken.length;
    this.flecken=this.flecken.filter(f=>Math.hypot(f.px-px,f.py-py)>r*this.pxU+f.rp*.35);
    if(before!==this.flecken.length){this._canvasDirty=true;this._vorher=null;}
    this.fl?.radieren?.(x/this.w+.5,.5-z/this.d,r/this.w,this.w/this.d);
    return before-this.flecken.length;
  }

  // One paint after ALL fixed simulation steps, immediately before the scene render.
  // A GPU-only erase still reaches Flood even when the source has no matching splat.
  flushFrame() {
    if(this._canvasDirty && this.canvas){
      this._canvasDirty=false;
      this._g.clearRect(0,0,this.canvas.width,this.canvas.height);
      for(const f of this.flecken)this._zeichnen(f,f.fe);
      this.tex.needsUpdate=true;
      this.canvasRedraws=(this.canvasRedraws||0)+1;
    }
    if(this._readPending){this._readPending=false;this._lesen();}
  }

  /** Karte frei: die Tusche geht, die Zähler der Sitzung bleiben (der Beweis ist kumulativ). */
  frei() {
    this._canvasDirty=false;this._readPending=false;
    if (!this.canvas) return false;
    /* ⚠ EIN WISCHEN BEENDET EINE AUFLÖSUNG PER DEFINITION. Sie ist die Darstellung genau dieses
       Wischens — also kann sie es nicht überleben. Ohne diese zwei Zeilen konnte `_loesenT` eine
       Karte überdauern, und weil `schwarz()` daran hängt, war die Niederlage für die Dauer der
       Restaufösung abgeschaltet (Kritiker 08.09.). Kein Phasenhaken kann das leisten: er ist
       überspringbar, dieser Weg nicht. */
    this._loesenT = null; this.loesen = 0;
    if (this.fl) this.fl.loesen = 0;
    this._g.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.tex) this.tex.needsUpdate = true;
    /* ⚠ DIE MARKE GEHÖRT ZUR KARTE. `_vorher` über einen Kartenwechsel stehen zu lassen hieße:
       der Sprung von 40 % auf 0 % wird als Rückgang gezählt und C22 fällt für einen Vorgang durch,
       der genau richtig ist (dieselbe Falle wie `_nullSeit` in runflow.v3). */
    this._vorher = null; this.deckung = 0; this.mittel = 0;
    this._laufzeit = 0; this.verlorenBei = null;
    this.flecken = []; this.feder = 0; this._zt = 0;
    this._loesenT = null; this.loesen = 0;
    if (this.fl && this.fl.wischen) this.fl.wischen();   // neue Karte = auch der Flood fängt bei Null an
    if (this.sp && this.sp.raeumen) this.sp.raeumen();    // und fliegende Tusche gehört zur alten Karte
    if (this.mb && this.mb.mobs) for (const m of this.mb.mobs) { m._spuckT = null; m._spurP = null; }
    return true;
  }

  entfernen() {
    this._canvasDirty=false;this._readPending=false;
    if (!this.schicht) return false;
    for (const m of [this.schicht, this.schattenM]) {
      if (!m) continue;
      /* Die Textur gehört der Tuscheschicht; der Schatten LEIHT sie sich, und seit S11b kann in
         `material.map` auch die Flood-Textur stehen (die gehört dem anderen Modul). Entsorgt wird
         deshalb `this.tex` — der eigene Besitz — und nicht, was gerade angezeigt wird. */
      if (m.material) { m.material.dispose(); }
      if (m.geometry) m.geometry.dispose();
      (m.parent || this.gruppe).remove(m);
    }
    this.schicht = null; this.schattenM = null; this.canvas = null; this._g = null;
    if (this.tex) { this.tex.dispose(); this.tex = null; }
    this.modus = null;
    return true;
  }

  /* ── Zeichnen: ein Spritzer, ein Vorgang ────────────────────────────────────────────────────

     DIE FORMEN SIND VEKTOREN, KEINE BILDER (Georgs Idee vom 07.09.: »es gibt die splats ja auch als
     SVG — über solche SVG & Vektoren ließe sich die Tusche-Area ja auch berechnen und ausbreiten«).
     Genau so, und es löst zwei Befunde mit einem Schritt:

       (a) »Die blur-dots sehen billig aus, als würden die nicht auf der Karte liegen.«
           Der Weichzeichner-Halo unter jedem Stempel ist WEG. Ein Vektorpfad hat eine harte,
           beliebig scharfe Kante — gedruckte Tusche hat keinen Schlagschatten. Ein leichter
           Schatten ist trotzdem da, aber GLOBAL: EINE Ebene unter der Tuscheschicht, versetzt und
           halbdurchsichtig (Georg: »den würde ich global setzen«). Regler `tuscheSchatten`.

       (b) Die Lücken schließen sich jetzt GEOMETRISCH statt über weiche Ränder: derselbe Pfad,
           mit einer Feder nachgezogen (`stroke` mit runden Enden), wächst genau um die halbe
           Federbreite nach außen. Das ist eine echte Dilatation — zwei Kleckse, die sich fast
           berühren, laufen ineinander, sobald die Feder den Abstand überbrückt. Über die Zeit
           gesteigert sieht es aus, wie Tusche wirklich läuft: von den Rändern her.

     `Path2D` bekommt das `d`-Attribut der SVG direkt — der Browser ist der Parser, wir schreiben
     keinen. Die Kenney-Pfade sind um (0,0) zentriert und reichen bis ±58 Einheiten; der Maßstab
     wird je Datei aus den Zahlen im Pfad gemessen, nicht angenommen.

     UNREGELMÄSSIG, wie Georg es beschrieben hat: um jeden Klecks freie Kreise als Tropfen — ein
     Teil davon IM ANSCHNITT (sie überlappen die Kante und beulen die Silhouette aus), der Rest
     abgesetzt daneben. Dazu variiert die GRÖSSE je Klecks um Faktor 0,62–1,50.                  */

  _basis() {
    const raw = (this.assets && this.assets.RAW) || 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/';
    return raw.replace('3D_Assets', '2D_Assets') + 'kenney_splat-pack/Vector/';
  }

  /** 36 Vektor-Kleckse laden. Bis sie da sind, zeichnet der Rückweg (gesetzte Kreise). */
  blattLaden() {
    if (this._blatt) return this._blatt;
    const basis = this._basis();
    this.formen = [];
    this._blatt = Promise.all(Array.from({ length: SPEC.formen }, (_, i) =>
      fetch(basis + 'splat' + String(i).padStart(2, '0') + '.svg')
        .then((r) => (r.ok ? r.text() : null))
        .then((txt) => (txt ? this._formAus(txt) : null))
        .catch(() => null)
    )).then((liste) => {
      this.formen = liste.filter(Boolean);
      this.log(this.formen.length + ' von ' + SPEC.formen + ' Vektor-Kleckse geladen (kenney_splat-pack · Vector, über RAW)'
        + (this.formen.length ? '' : ' — Rückweg: gezeichnete Kreise'));
      return this.formen;
    });
    return this._blatt;
  }

  /** SVG-Text → Pfade + gemessener Radius. Kein eigener Parser: `Path2D` nimmt das `d` wie es ist. */
  _formAus(txt) {
    if (typeof Path2D === 'undefined') return null;
    const ds = [];
    const re = /\sd="([^"]+)"/g;
    let m;
    while ((m = re.exec(txt))) ds.push(m[1]);
    if (!ds.length) return null;
    let max = 0;
    for (const d of ds) {
      const zahlen = d.match(/-?\d+(?:\.\d+)?/g) || [];
      for (const z of zahlen) { const v = Math.abs(+z); if (v > max) max = v; }
    }
    return { pfade: ds.map((d) => new Path2D(d)), r: max || 58 };
  }

  /* EIN ZEICHENWEG FÜR ERSTSTEMPEL UND ZULAUF (⚠ vorher zwei: `_vektor` stempelte, `_zulauf`
     zeichnete denselben Klecks nochmal mit eigener Transformation — zwei Stellen, an denen
     dasselbe Maß ausgerechnet wurde, und die Tropfen kannte nur die eine davon; sie blieben beim
     Laufen stehen und sahen deshalb wie aufgestreute Kreise aus).
     `feder` in Welt-u ist der Zuwachs nach außen; 0 = Erststempel.

     Zwei Durchgänge für den Körper, weil Tusche nicht rundherum gleich weit läuft:
       (a) gleichmäßig — die Fläche wächst überhaupt,
       (b) in der Flussrichtung des Kleckses gestreckt (`an`) — daraus wird eine Zunge statt eines
           aufgeblasenen Kreises. `stroke` liegt mittig auf der Kurve, also wächst die Form um die
           halbe Federbreite: echte Dilatation, kein Weichzeichner.
     Die Tropfen laufen mit halber Feder mit — die kleinen Formen bleiben klein, wachsen aber
     in den Körper hinein, statt als Punktwolke daneben zu liegen. */
  _zeichnen(f, feder) {
    const g = this._g;
    if (!g) return false;
    const b = Math.max(0, feder || 0) * this.pxU;
    const form = f.i >= 0 && this.formen && this.formen[f.i] ? this.formen[f.i] : null;
    g.save();
    if (this._maske) g.clip(this._maske);
    g.fillStyle = this._ink; g.strokeStyle = this._ink; g.lineJoin = 'round'; g.lineCap = 'round';
    g.translate(f.px, f.py);
    const koerper = (dreh, sx, sy, w, pfade, r) => {
      g.save();
      g.rotate(dreh);
      g.scale(sx, sy);
      if (w > 0) g.lineWidth = w;
      if (pfade) for (const p of pfade) { if (w > 0) g.stroke(p); g.fill(p); }
      else { g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); if (w > 0) g.stroke(); g.fill(); }
      g.restore();
    };
    const s = form ? f.rp / form.r : 1;
    const rr = form ? 0 : f.rp * 0.62;
    koerper(f.dreh, s * f.spiegel, s, b > 0 ? (2 * b * 0.62) / s : 0, form && form.pfade, rr);
    if (b > 0) koerper(f.dreh + f.fl, s * f.spiegel * (1 + f.an), s * (1 - f.an * 0.5), (2 * b * 0.9) / s, form && form.pfade, rr);
    for (const t of f.tr || []) {
      const tf = t.i >= 0 && this.formen && this.formen[t.i] ? this.formen[t.i] : null;
      const ts = tf ? t.r / tf.r : 1;
      g.save();
      g.translate(t.dx, t.dy);
      koerper(t.dreh, ts * t.spiegel, ts, b > 0 ? (2 * b * 0.5) / ts : 0, tf && tf.pfade, tf ? 0 : t.r);
      g.restore();
    }
    g.restore();
    return true;
  }

  /** Weltpunkt → Schicht. Gibt false zurück, wenn er neben der Karte liegt (gezählt, nicht still). */
  spritzer(x, z, r) {
    if (!this.schicht) return false;
    if (this._loesenT != null) { this.verworfen++; return false; }   // während der Auflösung zeichnet niemand
    const W = this.canvas.width, H = this.canvas.height;
    const px = ((x + this.w / 2) / this.w) * W;
    const py = ((z + this.d / 2) / this.d) * H;
    /* Größe variiert je Klecks (Georg 07.09.: »die einzelnen splats sollten auch leicht bzgl.
       Größe variieren«) — Faktor aus dem Seed, Spanne im SPEC, nicht im Code verstreut. */
    const gr = SPEC.groesse[0] + this.rng() * (SPEC.groesse[1] - SPEC.groesse[0]);
    const rp = (r || SPEC.radius) * gr * this.pxU;
    if (px < -rp || py < -rp || px > W + rp || py > H + rp) { this.verworfen++; return false; }
    const f = {
      i: this.formen && this.formen.length ? Math.floor(this.rng() * this.formen.length) : -1,
      px, py, rp,
      dreh: this.rng() * Math.PI * 2,
      spiegel: this.rng() < 0.5 ? -1 : 1,
      j: 0.75 + this.rng() * 0.5,          // je Klecks eigene Laufneigung (Zulauf)
      fl: this.rng() * Math.PI * 2,        // Flussrichtung: wohin dieser Klecks bevorzugt läuft
      an: SPEC.zunge * (0.5 + this.rng()), // wie deutlich — kein Klecks läuft rundherum gleich weit
      fe: 0, tL: null, tN: null,           // eigene Federweite und eigene Uhr
      tr: [], rand: false
    };
    /* RANDKLECKS: liegt er im äußeren Viertel, läuft er NACH AUSSEN und schneller — so erreicht die
       Fläche die Outline, statt dass die Outline ins Feld blutet (Georg 07.09.). Die Richtung ist
       die Achse, auf der er am nächsten an einer Kante steht; die Kontur klippt ihn ohnehin. */
    const nx = (px / W) * 2 - 1, ny = (py / H) * 2 - 1;
    const g0 = 1 - SPEC.randZone;
    if (Math.abs(nx) > g0 || Math.abs(ny) > g0) {
      f.rand = true;
      const ax = Math.abs(nx) > Math.abs(ny);
      f.fl = ax ? (nx > 0 ? 0 : Math.PI) : (ny > 0 ? Math.PI / 2 : -Math.PI / 2);
      f.j *= SPEC.randSchub;
      f.an = Math.min(0.5, f.an * 1.6);
      this.randKleckse++;
    }
    /* Tropfen: KEINE Kreise (Georg 07.09.: die regelmäßigen Kreise wirken unnatürlich), sondern
       derselbe Klecksatlas in klein — eigene Form, Drehung, Spiegelung. Ein Teil IM ANSCHNITT
       (0,80–1,05 × Radius, sie überlappen die Kante und beulen die Silhouette aus), der Rest
       abgesetzt daneben (1,05–1,45). Sie gehören zum Klecks und laufen mit ihm mit. */
    const n = SPEC.tropfen[0] + Math.floor(this.rng() * (SPEC.tropfen[1] - SPEC.tropfen[0] + 1));
    for (let i = 0; i < n; i++) {
      const a = this.rng() * Math.PI * 2;
      const anschnitt = this.rng() < 0.55;
      const dd = rp * (anschnitt ? 0.8 + this.rng() * 0.25 : 1.05 + this.rng() * 0.4);
      f.tr.push({
        i: this.formen && this.formen.length ? Math.floor(this.rng() * this.formen.length) : -1,
        dx: Math.cos(a) * dd, dy: Math.sin(a) * dd,
        r: rp * (SPEC.tropfenR[0] + this.rng() * (SPEC.tropfenR[1] - SPEC.tropfenR[0])) * (anschnitt ? 1.3 : 1),
        dreh: this.rng() * Math.PI * 2,
        spiegel: this.rng() < 0.5 ? -1 : 1
      });
    }
    if(!this._canvasDirty)this._zeichnen(f, 0);
    this.flecken.push(f);
    this.tex.needsUpdate = true;
    this.gezeichnet++;
    return true;
  }

  /* ── Zulauf: die Tusche läuft ineinander ────────────────────────────────────────────────────
     Ab `zulaufAb` Deckung fängt die Schicht an zu laufen — aber NICHT im Gleichschritt.
     ⚠ WAS HIER GEFIXT IST (Georg 07.09.: »noch ruckelig, nicht tusche-mäßig fließend«): vorher
     wuchsen ALLE Kleckse alle 0,4 s um denselben Betrag — zweieinhalb Sprünge je Sekunde, jeder
     über die ganze Karte, alle im selben Bild. Bei einer Bewegung, die man ansieht statt bedient,
     ist ein gemeinsamer Takt sofort ALS Takt zu erkennen; genau das war der Befund.
     Jetzt trägt jeder Klecks seine eigene Uhr (`tN`, Phase aus dem Seed) und seine eigene
     Federweite (`fe`). Der Zuwachs rechnet mit der TATSÄCHLICH vergangenen Zeit seit seinem
     letzten Schritt (`zulaufRate` × Zeit × Laufneigung) — gleiche Geschwindigkeit wie vorher
     (0,02 u/s), unabhängig von Bildrate und Streuung. Gezeichnet wird über `_zeichnen`, also
     laufen die Tropfen mit und die Zunge in Flussrichtung entsteht dort, wo sie hingehört.
     Monoton (es kommt nur Tusche dazu, C22 bleibt gültig), deterministisch (Streuung aus `rng`),
     und die Schritte werden getrennt gezählt (C23 sieht Spucken und Laufen auseinander). */
  _zulauf(dt) {
    if (!this.schicht || !this.flecken.length) return 0;
    this._zt = (this._zt || 0) + dt;
    let n = 0;
    for (const f of this.flecken) {
      /* Erste Begegnung: nur die Uhr stellen. Ein Klecks, der im Bild seiner Geburt schon läuft,
         wäre ein Sprung genau dort, wo das Auge gerade hinsieht. */
      if (f.tN == null) { f.tL = this._zt; f.tN = this._zt + this.rng() * SPEC.zulaufTakt; continue; }
      if (this._zt < f.tN) continue;
      const seit = Math.max(0, this._zt - (f.tL != null ? f.tL : this._zt));
      f.tL = this._zt;
      f.tN = this._zt + SPEC.zulaufTakt * (0.5 + this.rng());
      f.fe += SPEC.zulaufRate * seit * f.j;
      if(!this._canvasDirty)this._zeichnen(f, f.fe);
      if (f.fe > this.feder) this.feder = f.fe;
      n++;
    }
    if (n) { this.tex.needsUpdate = true; this.zulaeufe += n; }
    return n;
  }

  /** Ein Monster spuckt: vor die eigenen Füße, in Blickrichtung. */
  spucken(m) {
    if (!m || m.tot || m.weg || m.geheilt) return false;
    const r = SPEC.radius * (0.82 + this.rng() * 0.42);
    const vor = (m.radius || 0.4) + r * 0.5;
    const a = m.dir || 0;
    this.spuckBeats++;
    return this.spritzer(m.pos.x + Math.cos(a) * vor, m.pos.z + Math.sin(a) * vor, r);
  }

  /** Die Spur: ein Stempel je `spurAb` gelaufener Strecke, Breite aus dem Körper. */
  _spur(m) {
    if (!m || !m.pos || m.tot || m.weg || m.geheilt) return false;
    if (!m._spurP) { m._spurP = { x: m.pos.x, z: m.pos.z }; return false; }
    const d = Math.hypot(m.pos.x - m._spurP.x, m.pos.z - m._spurP.z);
    if (d < SPEC.spurAb) return false;
    m._spurP.x = m.pos.x; m._spurP.z = m.pos.z;
    const r = Math.max(0.26, (m.radius || 0.4) * SPEC.spurBreite) * SPEC.spurGroesse * (0.85 + this.rng() * 0.3);
    this.spuren++;
    return this.spritzer(m.pos.x, m.pos.z, r);
  }

  /** Prüfsalve: n Spritzer über die ganze Karte, aus dem Seed. Für C22 am Bild, in Sekunden. */
  salve(n) {
    if (!this.schicht) return 0;
    let ok = 0;
    const anz = n || 60;
    for (let i = 0; i < anz; i++) {
      /* Bis ±0,54 × Kante: die Mittelpunkte dürfen über das Blatt hinaus fallen. Ein Monster am
         Rand, das nach außen spuckt, macht genau das — und nur so bekommt die äußerste Reihe der
         Messfläche überhaupt Tusche (siehe SPEC.leseEinzug). */
      const x = (this.rng() - 0.5) * 2 * SPEC.streuung * this.w, z = (this.rng() - 0.5) * 2 * SPEC.streuung * this.d;
      if (this.spritzer(x, z, SPEC.radius * (0.9 + this.rng() * 0.6))) ok++;
    }
    this._lesen();
    this.log('Salve · ' + ok + ' von ' + anz + ' Spritzern · Deckung ' + (this.deckung * 100).toFixed(1) + ' %');
    return ok;
  }

  /* ── Messen: »wie schwarz ist die Karte« ist eine Zahl ───────────────────── */
  _lesen() {
    if(this._canvasDirty){this._readPending=true;return null;}
    if (!this.schicht) return null;
    const R = SPEC.raster, k = this._kg;
    const W = this.canvas.width, H = this.canvas.height;
    const f = this._leseFeld();
    const sx = ((f.x0 + this.w / 2) / this.w) * W, sy = ((f.z0 + this.d / 2) / this.d) * H;
    const sw = ((f.x1 - f.x0) / this.w) * W, sh = ((f.z1 - f.z0) / this.d) * H;
    k.clearRect(0, 0, R, R);
    k.drawImage(this.canvas, sx, sy, sw, sh, 0, 0, R, R);
    const dat = k.getImageData(0, 0, R, R).data;
    const grenze = SPEC.schwelle * 255;
    let sum = 0, ueber = 0;
    for (let i = 3; i < dat.length; i += 4) { sum += dat[i]; if (dat[i] >= grenze) ueber++; }
    /* Aus derselben Lesung fällt das Grobraster für die Zielsuche ab — kein zweiter Lesevorgang.
       Georg 07.09.: »ggf. können wir enemies so steuern, dass sie etwas gezielter die Kartenstellen
       ansäuern, die noch nicht schwarz sind«. Genau dafür ist die Zahl schon da. */
    const B = SPEC.bloecke, je = R / B;
    const bl = new Float32Array(B * B);
    for (let y = 0; y < R; y++) for (let x = 0; x < R; x++) {
      bl[(y / je | 0) * B + (x / je | 0)] += dat[(y * R + x) * 4 + 3] / 255;
    }
    const pro = je * je;
    for (let i = 0; i < bl.length; i++) bl[i] /= pro;
    this._bl = bl;
    const n = R * R;
    let deck = ueber / n;
    /* ⚠ GEMESSEN WIRD, WAS MAN SIEHT (S11b). Zeigt das Mesh das gefloodete Bild, ist die Deckung
       der Quelle die falsche Zahl — der Flood ist per Konstruktion ≥ Quelle, also würde das
       Prüfblatt eine Karte melden, die heller ist als die auf dem Schirm. Maximum beider Hälften:
       monoton bleibt es dadurch auch über einen Moduswechsel hinweg. */
    if (this.modus === 'flood' && this.fl && this.fl.an && this.fl.messungen > 0 && this.fl.deckung > deck) deck = this.fl.deckung;
    /* EINMAL JE KARTE STEHEN BEIDE ZAHLEN NEBENEINANDER IM PROTOKOLL (Kritiker 08.09.: »sonst ist
       der Boden wieder eine Behauptung«). Gleiche Fläche, gleiche Schwelle, gleicher Augenblick —
       nur zwei Leseverfahren. Weicht es weit ab, ist die Näherung im Abwärtspass der Verdächtige,
       nicht der Flood. */
    if (!this._floodVerglichen && this.fl && this.fl.an && this.fl.messungen >= 2) {
      this._floodVerglichen = true;
      const cv = ueber / n;
      this.log('Vergleich am selben Bild · Canvas ' + (cv * 100).toFixed(1) + ' % (Mittel ' + (sum / 255 / n * 100).toFixed(1) + ' %)'
        + ' · Flood ' + (this.fl.deckung * 100).toFixed(1) + ' % (Mittel ' + (this.fl.mittel * 100).toFixed(1) + ' %)'
        + ' · Δ ' + ((this.fl.deckung - cv) * 100).toFixed(1) + ' Punkte');
    }
    if (this._vorher != null && deck < this._vorher) this.rueckgang = Math.max(this.rueckgang, this._vorher - deck);
    this._vorher = deck;
    this.deckung = deck;
    this.mittel = sum / 255 / n;
    this.messungen++;
    if (this.verlorenBei == null && deck >= SPEC.verlustBei) {
      this.verlorenBei = +this._laufzeit.toFixed(1);
      this.log('Karte zu 100 % zensiert nach ' + this.verlorenBei + ' s · ' + this.gezeichnet + ' Spritzer');
    }
    return deck;
  }

  /* ⚠ DER ORT WIRD GEPRÜFT, NICHT ANGENOMMEN (Kritiker 07.09.). Die Schicht ist ein KIND der Karte —
     das löst das Auseinanderlaufen beim Atmen, aber es macht den Kartenknoten zur Voraussetzung.
     Der Ring ERSETZT ihn bei jedem Kartenwechsel (neue uuid), und wenn dieser Wechsel nicht über
     `neueKarte()` läuft, hängt die Schicht danach an einem Knoten ohne Szene: Deckung 1, `schwarz`
     wahr, Runde verloren — und im Bild eine saubere Karte. Genau der gemessene Befund.
     Also fragt die Schicht in jedem Bild, ob sie noch dort hängt, wo sie hingehört. Ein
     Elternwechsel heißt neue Karte, also auch neue Kontur und ein weißes Blatt.
     Merksatz: wer Kind von etwas ist, das ersetzt werden kann, muss seinen Vater prüfen. */
  _anhaengen() {
    const kn = (this.ring && this.ring.current) || this.gruppe;
    if (!kn) return false;
    if (this.schicht && this.schicht.parent !== kn) kn.add(this.schicht);
    if (this.schattenM && this.schattenM.parent !== kn) kn.add(this.schattenM);
    return true;
  }

  /* Der Flood arbeitet auf DIESER Quelle und DIESER Kontur — eine neue Karte heißt beides neu.
     Steht kein Flood, ist die Zeile ein No-Op: das Modul läuft ohne ihn vollständig. */
  _floodNachziehen() {
    if (!this.fl || !this.fl.binden || !this.canvas || !this.tex) return false;
    const e = this._leseFeld().einzug;
    this.fl.binden({ quelle: this.tex, maske: this.maskeTextur(), w: this.canvas.width, h: this.canvas.height, ink: SPEC.ink,
                     einzug: [e / this.w, e / this.d] });
    this._floodVerglichen = false;
    if (this.modus === 'flood') this.darstellung('flood');
    return true;
  }

  _ortPruefen() {
    if (!this.schicht || !this.ring) return false;
    const kn = this.ring.current;
    if (!kn || this.schicht.parent === kn) return false;
    this._anhaengen();
    this._maskeBauen(this.canvas.width, this.canvas.height);
    this.frei();
    this._floodNachziehen();
    this.umzuege++;
    this.log('Kartenknoten getauscht — Schicht umgehängt und gewischt (Umzug ' + this.umzuege + ')');
    return true;
  }

  /** Die Messfläche in Welt-u: das Blatt ohne den Beschnittrand (Herleitung bei SPEC.leseEinzug). */
  _leseFeld() {
    const e = Math.min(SPEC.leseEinzug, this.w / 4, this.d / 4);
    return { x0: -this.w / 2 + e, x1: this.w / 2 - e, z0: -this.d / 2 + e, z1: this.d / 2 - e, einzug: e };
  }

  /** Die eine Frage, die die Runde stellt (runflow.v3 · karteSchwarz).
      ⚠ Eine Karte, die sich gerade auflöst, ist NIE schwarz — auch nicht für einen Bruchteil einer
      Sekunde. Der Messwert fällt zwar schon in `aufloesen()`, aber die Sperre steht zusätzlich hier:
      der Zustand »wird zurückgesetzt« gehört in die Antwort und nicht in das Timing des Aufrufers. */
  schwarz() { return !!this.schicht && this._loesenT == null && this.deckung >= SPEC.verlustBei; }

  /* ── Zielsuche: wo ist die Karte noch weiß? ─────────────────────────────────
     Das Grobraster (8 × 8 = 64 Felder) fällt aus der Deckungslesung ab, kostet also nichts.
     Gewählt wird nicht das SAUBERSTE Feld, sondern das sauberste ERREICHBARE: Sauberkeit und
     Entfernung stehen in einer Note (`zielNaehe`). Würde nur die Sauberkeit zählen, liefen alle
     drei Monster zur selben Ecke und die Karte würde in einem Streifen schwarz statt in Flächen.
     `bevorzugt` hält die Wahl je Monster auseinander: gleiche Note, verschiedene Reihenfolge. */
  freiesZiel(x, z, streu) {
    if (!this.schicht || !this._bl) return null;
    const B = SPEC.bloecke, f = this._leseFeld();
    const bw = (f.x1 - f.x0) / B, bd = (f.z1 - f.z0) / B;
    const weit = Math.hypot(f.x1 - f.x0, f.z1 - f.z0);
    let best = null, bestNote = Infinity;
    for (let i = 0; i < B * B; i++) {
      const cx = f.x0 + ((i % B) + 0.5) * bw, cz = f.z0 + ((i / B | 0) + 0.5) * bd;
      const dist = Math.hypot(cx - x, cz - z) / weit;
      const note = this._bl[i] * (1 - SPEC.zielNaehe) + dist * SPEC.zielNaehe + (streu || 0) * this.rng();
      if (note < bestNote) { bestNote = note; best = { x: cx, z: cz, deckung: this._bl[i] }; }
    }
    return best;
  }

  /* EIN Wert, EIN Schreiber. M12 schreibt `m.dir` — sonst nichts. M3 (`mobs.v2.js`) liest diese
     Zahl im Friedensmodus ohnehin jedes Bild (Streifen mit Richtungswechsel); wir setzen sie nur
     bewusst statt zufällig. Kein Umbau von M3, kein zweiter Bewegungsweg, C2 unberührt.
     RÜCKWEG: `zielen = false`, dann streifen sie wieder zufällig. */
  _zielen(m) {
    const ziel = this.freiesZiel(m.pos.x, m.pos.z, 0.06);
    if (!ziel) return false;
    m.dir = Math.atan2(ziel.z - m.pos.z, ziel.x - m.pos.x);
    m._zielFeld = ziel;
    return true;
  }

  /* ── DIE AUFLÖSUNG (Georg 08.09.) ──────────────────────────────────────────
     Sein Befund: »wenn ich nach Ink-Death Blödsinn klicke, stirbt FB sofort wieder, weil die Fläche
     noch schwarz ist«. Das war kein Anzeigefehler, sondern ein FEHLENDER ÜBERGANG: `nochmal()`
     setzte die Runde zurück, aber niemand setzte die Tusche zurück — die nächste Lesung fand
     dieselben 100 % und verlor die Karte im selben Atemzug. Es gab also zwei Wege: still wischen
     (dann springt die Karte) oder den Vorgang ZEIGEN. Georg wollte ihn zeigen, und das ist auch das
     ehrlichere: der Spieler sieht, dass etwas zurückgesetzt wurde, statt es zu erraten.

     Wie es läuft: `loesen` wächst über `dauer` von 0 auf 1,25 und geht als Uniform in den Flood —
     dort hebt sich die Tusche in Flecken ab (niedriger Faserwert zuerst). AM ENDE wird beides
     gewischt (Canvas UND Flood) und `loesen` auf 0 gestellt, denn die Auflösung ist eine
     DARSTELLUNG des Wischens, nicht das Wischen selbst.
     Während sie läuft, zeichnet niemand: `spritzer` gibt false zurück (gezählt), und `update` kehrt
     früh zurück. Sonst spuckt ein Monster mitten in die Auflösung und die Karte fängt schwarz an.
     Ohne Flood gibt es kein Abheben — dann wird nach `dauer` schlicht gewischt, und das steht als
     Grund im Protokoll statt als stiller Sprung. */
  aufloesen(dauer) {
    if (!this.schicht) return false;
    this._loesenD = dauer || 0.9;
    this._loesenT = 0;
    this.loesen = 0.001;
    this.loesungen = (this.loesungen || 0) + 1;
    /* ⚠ DIE ZAHL FÄLLT MIT DEM BILD, NICHT NACH DEM BILD (Kritiker 08.09.). Erste Fassung ließ
       `deckung` bei 100 % stehen, weil `update` während der Auflösung früh zurückkehrt und `_lesen`
       deshalb nicht mehr läuft — `schwarz()` meldete also eine Karte als voll zensiert, die sich vor
       den Augen des Spielers abhebt, und FB starb sofort wieder. Eine Karte, die zurückgesetzt wird,
       kann kein Grund für eine Niederlage sein: die Marke fällt in DEMSELBEN Aufruf auf Null.
       Merksatz: wer die Messung anhält, muss den Messwert mit anhalten — sonst ist er eine Ruine. */
    this.deckung = 0; this.mittel = 0; this._vorher = null;
    if (this.fl) this.fl.loesen = this.loesen;
    this.log('Auflösung über ' + this._loesenD.toFixed(2) + ' s aus ' + (this.deckung * 100).toFixed(1) + ' % Deckung'
      + (this.fl && this.fl.an ? '' : ' · ohne Flood: wischt am Ende ohne Abheben'));
    return true;
  }

  loest() { return this._loesenT != null; }

  /* SOFORT FERTIG. Der einzige Weg, eine laufende Auflösung zu beenden — und er hinterlässt immer
     denselben Zustand: kein `_loesenT`, kein `loesen`, gewischtes Blatt. Ein halb beendeter Vorgang
     wäre schlimmer als ein abgeschnittener: `schwarz()` hängt an `_loesenT`, also hätte ein
     stehengebliebenes Flag die Niederlage für die ganze Sitzung abgeschaltet (Kritiker 08.09.). */
  loesenEnde() {
    if (this._loesenT == null) return false;
    this._loesenT = null;
    this.loesen = 0;
    if (this.fl) this.fl.loesen = 0;
    this.frei();
    return true;
  }

  _loesenSchritt(dt) {
    /* ⚠ GEZÄHLT WIRD IN GEZEIGTEN BILDERN, NICHT IN UHRZEIT. Gemessen 08.09.: die Auflösung war nach
       EINEM Bild fertig, obwohl 1,6 s eingestellt waren — das erste Bild nach einer Pause (Tabwechsel,
       parkende Bildschleife) bringt ein `dt` von mehreren Sekunden mit, und `t/d` sprang sofort über
       1. Genau derselbe Fehler wie ein Flood, der `dt` direkt verrechnet (siehe Kopf von flood.v3,
       Punkt 1) — nur hier mit sichtbarer Folge: Georg sah »das Dissolve ist zu schnell«.
       Deckel bei 1/30 s: ein Vorgang, den man ansehen soll, darf nicht in einem Bild vorbei sein. */
    this._loesenT += Math.min(Math.max(0, dt), 1 / 30);
    const k = Math.min(1, this._loesenT / this._loesenD);
    this.loesen = 0.001 + k * 1.25;
    if (this.fl) this.fl.loesen = this.loesen;
    if (k >= 1) {
      this.loesenEnde();
      this.log('Auflösung fertig · Karte bei 0 %');
    }
    return k;
  }

  update(dt) {
    if (!this.schicht || !(dt > 0)) return;
    this._ortPruefen();
    if (this._loesenT != null) { this._loesenSchritt(dt); return; }
    if (this.schattenM) this.schattenM.material.opacity = this.schatten != null ? this.schatten : SPEC.schatten;
    this._leseT += dt;
    if (this._leseT >= SPEC.leseTakt) { this._leseT = 0; this._lesen(); }
    const phase = this.time && this.time.state ? this.time.state.phase : 'play';
    if (!this.an || phase !== 'play') return;
    this._laufzeit += dt;
    /* ZULAUF: ab »genug Tusche« läuft sie ineinander (Georgs Wunsch: die verbleibenden Lücken von
       den Rändern her über die Zeit schließen). Bedingung ist die DICHTE, nicht die Uhr — eine
       einzelne Spucke auf leerer Karte läuft nicht. */
    if (this.deckung >= SPEC.zulaufAb && this.deckung < SPEC.verlustBei) this._zulauf(dt);
    const leben = this.mb && this.mb.lebende ? this.mb.lebende() : [];
    /* Frage 3, als Zahl beantwortet: sie spucken IMMER — im Frieden doppelt so oft wie im Kampf.
       Sonst hört die Uhr in dem Moment auf, in dem man eingreift, und die Zange hat nur eine Backe. */
    const takt = (this.spuckTakt || SPEC.spuckTakt) / (this.mb && this.mb.friedlich ? 1 : SPEC.kampfAnteil);
    for (const m of leben) {
      if (m.geheilt) continue;
      /* SPUR: läuft unabhängig vom Spucktakt und vom Frieden — wer geht, zensiert. */
      if (this.spur !== false) this._spur(m);
      /* Gezielt statt zufällig streifen — aber nur im Frieden: wer jagt, jagt FB, nicht die Fläche. */
      if (this.zielen !== false && this.mb && this.mb.friedlich) {
        if (m._zielT == null) m._zielT = this.rng() * SPEC.zielTakt;
        m._zielT -= dt;
        if (m._zielT <= 0) { m._zielT = SPEC.zielTakt * (0.8 + this.rng() * 0.4); this._zielen(m); }
      }
      if (m._spuckT == null) m._spuckT = this.rng() * takt;   // Phasen streuen: drei Monster spucken nicht im Gleichschritt
      m._spuckT -= dt;
      if (m._spuckT > 0) continue;
      m._spuckT = takt * (0.8 + this.rng() * 0.4);
      /* S12: WENN ES EINE CHOREOGRAPHIE GIBT, GEHT DAS SPUCKEN DORT HIN. Sie zeichnet den Klecks
         erst beim AUFPRALL (Ansage → Flug → Klecks) und gibt ihm eine Beat-Nummer. Sagt sie nein
         (kein Ziel, kein Platz, zu weit), spuckt dieses Modul wie bisher vor die Füße — ein
         Ausfall der Kür darf die Uhr des Spiels nicht anhalten. */
      if (this.sp && this.sp.an && this.sp.spucken(m)) { this.spuckBeats++; continue; }
      this.spucken(m);
    }
    if (SPEC.kriechen > 0) this._kriechen(dt);
  }

  /* Kriechen ist GEBAUT, aber AUS (SPEC.kriechen = 0): die Entscheidung gehört Georg, und ein
     Schalter, den man umlegen kann, ist ehrlicher als eine Zeile, die es nicht gibt. */
  _kriechen(dt) {
    this._kriechT = (this._kriechT || 0) + dt * SPEC.kriechen;
    if (this._kriechT < 1) return;
    this._kriechT = 0;
    this.spritzer((this.rng() - 0.5) * this.w * 0.96, (this.rng() - 0.5) * this.d * 0.96, SPEC.radius * 0.7);
  }

  probe() {
    return {
      steht: !!this.schicht,
      deckung: +(this.deckung * 100).toFixed(1),
      mittel: +(this.mittel * 100).toFixed(1),
      messungen: this.messungen,
      rueckgang: +(this.rueckgang * 100).toFixed(2),
      gezeichnet: this.gezeichnet,
      spuckBeats: this.spuckBeats,
      spuren: this.spuren,
      spur: this.spur !== false,
      verworfen: this.verworfen,
      verlorenBei: this.verlorenBei,
      schwarz: this.schwarz(),
      laufzeit: +this._laufzeit.toFixed(1),
      leseTakt: SPEC.leseTakt,
      messflaeche: this.schicht ? +((this.w - 2 * this._leseFeld().einzug) * (this.d - 2 * this._leseFeld().einzug)).toFixed(1) : 0,
      einzug: this.schicht ? +this._leseFeld().einzug.toFixed(2) : 0,
      zielen: this.zielen !== false,
      loest: this._loesenT != null,
      loesungen: this.loesungen || 0,
      modus: this.modus || 'canvas',
      formen: this.formen ? this.formen.length : 0,
      zulaeufe: this.zulaeufe,
      feder: +this.feder.toFixed(3),
      randKleckse: this.randKleckse,
      umzuege: this.umzuege,
      /* Der Ort ist ab jetzt eine ZAHL im Prüfblatt, nicht eine Zusage im Kommentar: hängt die
         Schicht am aktuellen Kartenknoten? Sonst zählt eine Deckung, die niemand sieht. */
      amKnoten: !!(this.schicht && this.ring && this.ring.current && this.schicht.parent === this.ring.current),
      an: !!this.an
    };
  }

  zeile() {
    if (!this.schicht) return '[zensur] Schicht steht nicht (keine Karte gemessen)';
    const p = this.probe();
    return '[zensur] Deckung ' + p.deckung.toFixed(1) + ' % (Mittel ' + p.mittel.toFixed(1) + ' %)'
      + ' · ' + p.gezeichnet + ' Spritzer aus ' + p.spuckBeats + ' Spucken'
      + (p.spuren ? ' + ' + p.spuren + ' Spurstempeln' : '')
      + ' · ' + p.messungen + ' Lesungen · Rückgang ' + p.rueckgang.toFixed(2) + ' %'
      + ' · ' + p.formen + ' Vektorformen'
      + (p.zulaeufe ? ' · Zulauf ' + p.zulaeufe + ' Schritte (Feder bis ' + p.feder.toFixed(3) + ' u)' : '')
      + (p.randKleckse ? ' · ' + p.randKleckse + ' Randkleckse laufen nach außen' : '')
      + ' · zeigt ' + p.modus
      + (p.loest ? ' · löst sich auf' : '')
      + (p.loesungen ? ' · ' + p.loesungen + ' Auflösungen' : '')
      + (p.umzuege ? ' · ' + p.umzuege + ' × umgehängt' : '')
      + (p.amKnoten ? '' : ' · ⚠ NICHT am Kartenknoten')
      + (p.zielen ? ' · zielt auf Weiß' : '')
      + (p.verlorenBei != null ? ' · SCHWARZ nach ' + p.verlorenBei + ' s' : '')
      + (p.an ? '' : ' · aus');
  }

  tor() {
    const ok = this.rueckgang <= 0.002;
    return { name: 'zensur.v3', bestanden: ok ? 1 : 0, von: 1, pass: ok,
             zeile: 'C22 · Rückgang ' + (this.rueckgang * 100).toFixed(2) + ' % über ' + this.messungen + ' Lesungen' };
  }

  dispose() { this.entfernen(); if (this.gruppe && this.gruppe.parent) this.gruppe.parent.remove(this.gruppe); }
}
