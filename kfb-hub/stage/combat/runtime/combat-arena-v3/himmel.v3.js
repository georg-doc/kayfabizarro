/* KFB Combat Arena v3 · himmel.v3.js — S13: DER ZYLINDER-HIMMEL (Variante 3, »Inception«)
   ─────────────────────────────────────────────────────────────────────────────────────────────
   WAS DIESES MODUL IST: ein Zylindermantel um die Arena, auf dem SECHS Kartenmotive desselben
   Decks hängen. Man steht auf Karte 14, und am Horizont hängen ihre Nachbarn. Das ist
   Kartenvorstellung nebenbei — niemand muss aus dem Spiel heraus erklären, was ein Deck ist.

   WARUM ZYLINDER UND NICHT SPHÄRE. Ein rechteckiges Bild auf einer Kugel braucht eine
   Kugelprojektion und wird an den Polen zerquetscht; ein Kartenmotiv ist kein Panorama. Der
   Zylinder wickelt nur WAAGERECHT, die Senkrechte bleibt unverzerrt — und in einer Kartenarena
   schaut man ohnehin waagerecht, also entsteht dort gar kein Verlust.

   WARUM SECHS, UND WARUM DAS NICHT ABGESTIMMT IST. Bedingung: Motivbreite auf dem Mantel geteilt
   durch Mantelhöhe ergibt wieder 16:9. Bei Radius 100 ist der Umfang 628, ein Sechstel davon
   104,7, und 104,7 / (16/9) = 58,9. Dasselbe fällt bei Radius 60, 80 und 120 heraus (6,24 · 6,28 ·
   6,24) — es folgt aus 16:9 und normalen Proportionen, nicht aus einer Abstimmung.

   DIE NAHT GIBT ES NICHT. Ein Zylinder ist von Natur aus periodisch: einmal herumgedreht und man
   ist wieder bei der ersten. Kein Stitching, kein Versatz, nichts wird mit der Kamera mitbewegt.
   Sichtbar sind bei 74° waagerechtem Blickwinkel rund 20,6 % des Mantels, also etwa 1,2 Motive —
   man erkennt eines, und die Welt geht sichtbar weiter.

   ⚠ VIER ENTSCHEIDUNGEN, DIE MESSBAR SIND:

   (1) BLIND VIERTELN, NICHT MESSEN. Die Motive sind die vier Viertel einer PDF-Seite. Blind
       geviertelt ergibt das 776 × 433, also Seitenverhältnis 1,79 und damit praktisch 16:9 — genau
       was der Mantel braucht. Ein gemessener Zuschnitt (`cardGrid`) liegt bei 1,46, ist je Deck
       verschieden und steht für 130 Decks NICHT in `index.json`; er müsste also gerahmt oder
       verzerrt werden. Die Seitengröße wird zur Laufzeit gelesen: die beobachteten 1553 × 866 sind
       eine Beobachtung an einem Deck, keine Eigenschaft der Schnittstelle.

   (2) EIN ZEICHENAUFRUF. Ein Mantel, eine Textur, sechs Zellen in EINEM Atlas-Canvas. Sechs
       Einzelmeshes wären sechs Aufrufe und sechs Nähte.

   (3) DIE FARBE KOMMT AUS DEN MOTIVEN, NICHT AUS EINER PALETTE. Nach dem Füllen wird der
       Atlas-Mittelwert gelesen (`_farbeLesen`, 32 × 18 Abtastungen je Zelle) und daraus die
       Horizont- und Nebelfarbe gebildet. Damit gilt »das Deck SETZT, der Modus TRANSFORMIERT nur«
       ohne eine zweite Farbtabelle: die Basis ist gemessen, der Modus verschiebt sie über
       `tint`/`saettigung`. Eine Schicht setzt oder transformiert, nie beides.

   (4) KEIN RENDERTARGET, KEINE SPIEGELUNG. Die teure Fassung wäre, die Szene in sich selbst zu
       spiegeln — ein zusätzlicher Renderdurchgang für einen Hintergrund. Erst die freie Fassung.

   RÜCKWEG: `zeigen(false)`. Der Mantel verschwindet, der Gutter-Shader steht unverändert dahinter.

   BODEN C26: sechs Zellen, jede 16:9 ± 2 %, ein Zeichenaufruf, keine leere Zelle.               */

export const SPEC = {
  /* ⚠ DER RADIUS IST NICHT FREI — ER MUSS IN DIE SICHTWEITE PASSEN (Kritiker 08.09., mit Raycasts
     gemessen: `camera.far` ist 120, die Mantelunterkante lag bei d = 133, die Trichterspitze bei
     d = 190. Kein einziges Fragment des Trichters wurde je rasterisiert, und der Mantel selbst war
     ab 60,5° unter der Waagerechten weggeschnitten — GENAU die harte Kante, die Georg gemeldet hat.
     Ich hatte also die Geometrie geschlossen und die Ursache nicht angefasst.)
     DER AUSWEG IST NICHT MEHR SICHTWEITE, SONDERN WENIGER RADIUS. Ein Zylindermantel ist
     MASSSTABSINVARIANT: ein Motiv deckt ein Sechstel des Umfangs, also 60° Blickwinkel — bei
     Radius 34 genauso wie bei 60. Was sich mit dem Radius ändert, ist nur die ENTFERNUNG. Also
     schrumpft der ganze Aufbau, das Bild bleibt Pixel für Pixel dasselbe, und alles liegt innerhalb
     von 120 u. `camera.far` hochzuziehen hätte dagegen ein GETEILTES Modul angefasst
     (`combat-arena-v1/host.v1.js`, near 0,05) und die Tiefenauflösung für alle Slices verschlechtert
     — für einen Hintergrund.
     GERECHNET (Kamerahöhe 5,9, Mitte auf camY − 0,315 R, damit der Blickwinkel gleich bleibt):
     Unterkante d = 2,31 R = 78,5 · Spitze d = 2,08 R + H = 100 · beides unter 120, mit Reserve für
     die Kamerahöhe bis 14 u.
     Merksatz: was maßstabsinvariant aussieht, verschiebt man in den Frustum hinein, statt den
     Frustum zu dehnen. */
  radius: 34,
  motive: 6,
  /* ── DREI REIHEN IM BACKSTEINVERBAND (Georg 08.09.: »den Zylinder müssen wir nach unten/oben
     erweitern, dann gerne versetzt in Backstein-Mauer-Logik«) ────────────────────────────
     Eine Reihe deckte y −30,7 bis +4,3 — knapp den sichtbaren Streifen und sonst nichts. Drei Reihen
     decken −66 bis +40, also auch einen Blick nach oben und eine flachere Neigung.
     Der VERSATZ ist keine Zierde: Motive übereinander in derselben Spalte ergeben senkrechte Fugen,
     die über die ganze Höhe durchlaufen — das liest als Tapetenbahn. Eine halbe Zellbreite Versatz je
     Reihe bricht sie, genau wie im Mauerwerk. Und die Reihenfolge rotiert, damit kein Motiv über sich
     selbst steht. Das kostet nichts: dieselben sechs Bilder, andere Anordnung. */
  /* FÜNF REIHEN, UND KEIN BODEN MEHR. Der Scheibenboden ist zweimal durchgefallen (grau, dann dunkel:
     »störend, egal welche Farbe«) — und zu Recht, denn eine einfarbige Fläche unter einer gezeichneten
     Welt ist ein Loch mit Farbe. Die richtige Antwort auf »unten fehlen Kartenreihen« sind KARTENREIHEN:
     fünf Reihen spannen −101 bis +75 statt −66 bis +40, und damit trifft auch ein steil nach unten
     gerichteter Strahl die Wand (bei 40° unter der Waagerechten liegt er am Mantel auf −44, bei 60°
     auf −98). Es kostet nichts: dieselben sechs Motive, zwei Reihen mehr im Verband.
     Merksatz: ein Hintergrund, der fehlt, wird nicht durch eine Fläche ersetzt, sondern verlängert. */
  reihen: 6,
  segmente: 96,         // Mantelsegmente: bei 96 ist eine Kante 3,75° breit, also unsichtbar
  zelle: [768, 432],    // px je Motiv im Atlas (16:9 exakt) — 6 × 768 = 4608, unter der 8192-Grenze
  /* ⚠ DER MANTEL MUSS DORT STEHEN, WOHIN DIE KAMERA SCHAUT — UND SIE SCHAUT NACH UNTEN.
     Gerechnet und am Bild bestätigt (08.09.): bei 37° Neigung und 46° Blickwinkel zeigt die OBERE
     Bildkante noch 14° UNTER die Waagerechte. Aus Kamerahöhe 5,9 u trifft dieser Strahl bei 60 u
     Entfernung die Höhe 5,9 − 60 · tan 14° = −9,1. Mein erster Mittelpunkt lag bei +11, der Mantel
     spannte also von −17,7 bis +39,7 — und der sichtbare Streifen lag knapp UNTER seiner Unterkante:
     sechs Motive standen, keines war im Bild.
     Deshalb liegt die Mitte UNTER dem Blatt: von −41,7 bis +15,7. Was man »Himmel« nennt, ist in
     einer Draufsicht die FERNE, nicht das Oben.
     Merksatz: ein Hintergrund gehört in die Blickrichtung, nicht nach oben. */
  /* Mitte = Kamerahöhe − 0,315 · Radius (siehe Radius-Block): das hält den Blickwinkel auf Ober- und
     Unterkante konstant, egal wie groß der Mantel ist. Bei camY 5,9 und R 34 sind das −4,5. */
  hoeheY: -4.5,
  /* ⚠ DER NEBEL IST ABSOLUT UND HÄNGT NICHT AM RADIUS. Er blendet die KARTE (6 u breit, 12 u
     entfernt) in die Ferne — dieser Bedarf ändert sich nicht, wenn der Mantel schrumpft. Aus
     `radius × 0,72 × 2,2` wären beim Schrumpfen 54 u statt 95 geworden, und die Karte hätte
     plötzlich Nebel auf ihrer eigenen Fläche. */
  nebelU: [17, 95],     // u · Anfang · Ende (wird auf 96 % der Sichtweite gedeckelt)
  /* ── DER DUNST (Georg 08.09.) ───────────────────────────────────────────────
     »Unten fehlen noch Kartenreihen«: ein steil nach unten gerichteter Strahl läuft UNTER dem Mantel
     hindurch — er müsste 60 u weit fliegen, um die Wand zu treffen, und ist dort längst unter ihrer
     Unterkante. Weitere Reihen würden das nur verschieben und kosten Karten. Ein SCHEIBENBODEN am
     unteren Rand schließt es endgültig, in der Horizontfarbe: dort ist keine Karte nötig, weil dort
     auch keine hängen würde — unter dem Tisch ist Tisch.
     »Animierter Nebel, der die Motive vom Spielfeld trennt«: ein zweiter, etwas engerer Mantel mit
     einem weichen Band, das langsam dreht und driftet. Zwei Bewegungen mit verschiedenen
     Geschwindigkeiten — eine allein liest als drehende Tapete, zwei als Schwaden. */
  /* ⚠ DRITTER ANLAUF, UND DIESMAL GEMESSEN STATT GERECHNET. Mit roter Farbe und Deckkraft 1 änderte
     sich KEIN Bildpunkt — das Band war nicht schwach, es war außerhalb des Bildes. Bei y 1,5 und 58 u
     Entfernung liegt es 4,3° ÜBER der Waagerechten, und die obere Bildkante zeigt 14° DARUNTER (37°
     Neigung, 50° Blickwinkel). Im Bild ist bei 58 u also alles unterhalb von y ≈ −8,6.
     Merksatz: bevor man eine Deckkraft hochdreht, prüft man, ob das Ding überhaupt im Bild ist —
     eine unsichtbare Fläche wird durch mehr Farbe nicht sichtbarer. */
  /* ⚠ DIE NAHT LIEGT TIEFER, ALS DIE RECHNUNG VON VORHIN SAGTE. y −9 war der sichtbare Streifen in
     der BILDMITTE — die Kante des Blattes steht aber viel weiter unten im Bild: die ferne Blattkante
     ist nur ~12 u von der Kamera entfernt und liegt damit 26° unter der Waagerechten. Am Mantel (58 u)
     entspricht dieser Winkel y = 5,9 − 58 · tan 26° ≈ −22. Deshalb sah Georg den Dunst »nur oben«:
     das Band lag über der Naht, nicht an ihr.
     Merksatz: der Horizont im Bild ist nicht die Waagerechte, sondern die Kante des Vordergrunds. */
  dunstY: -20,              // u · Bandmitte (mit dem Radius mitgeschrumpft: (−40 − 5,9)/60 · 34 + 5,9)
  /* ⚠ DAS BAND MUSS DEN GANZEN SICHTBAREN HIMMEL DECKEN (Georg 08.09.: »nur oben ist Dunst, unten
     nicht«). 26 u um y −21 waren der Streifen direkt über der Blattkante; darunter — links und rechts
     am Blatt vorbei — stand der Himmel blank. Mit 80 u um y −32 spannt es −72 bis +8, also über die
     fünf Reihen hinweg, und der Verlauf der Textur macht das Aus- und Einlaufen. */
  dunstHoehe: 74,           // u · mit dem Radius mitgeschrumpft (130 · 34/60)
  /* ⚠ UND DIE GESCHWINDIGKEITEN WAREN EINE GRÖSSENORDNUNG ZU KLEIN (Georg: »der Dunst scheint
     statisch« — er hatte recht, und es war keine fehlende Taktung). 0,012 rad/s sind 0,7° in der
     Sekunde: nach zehn Sekunden knapp sieben Grad, und das sieht niemand. 0,06 rad/s sind 3,4°/s,
     also eine Umrundung in knapp zwei Minuten — sichtbar als Ziehen, nicht als Karussell. */
  /* ⚠ NOCH EINMAL SCHNELLER (Georg 08.09.: »der Dunst wirkt noch nicht animiert, eher wie ein
     transparentes Overlay«). 0,06 rad/s sind 3,4°/s — bei einem Band, das 60 u entfernt und weich
     ist, unterhalb der Wahrnehmungsschwelle. 0,15 rad/s sind 8,6°/s: eine Umrundung in 42 s, und
     das liest als Ziehen. Der DRIFT ist der zweite Teil: er verschiebt die Ballen GEGEN die
     Drehung, sonst dreht sich nur eine starre Tapete.
     Und die Kachelzahl runter (3 → 2): größere Ballen legen bei gleicher Winkelgeschwindigkeit
     mehr sichtbaren Weg zurück. */
  dunstDreh: 0.043,         // rad/s der äußeren Schicht (147 s je Umlauf); die innere läuft mit −0,63 davon
  dunstDrift: 0,            // UV-Drift: aus. Zwei Bewegungen auf DERSELBEN Textur scheren das Muster sichtbar.
  dunstDeckung: 1,          // Deckkraft · gemessen bei 0,7 nur 8 bis 32 Stufen Unterschied am Bildpunkt
  tint: 1.0,            // Modus-Transformation: Helligkeit
  saettigung: 1.0       // Modus-Transformation: Sättigung
};

export default class Himmel {
  static describe() {
    return { name: 'Himmel', capabilities: ['three@0.160'], view: '3d', determinism: 'seeded', spec: SPEC };
  }

  constructor(o = {}) {
    this.THREE = o.THREE || o.three;
    this.log = (s) => (o.log || console.info)('[himmel] ' + s);
    this.an = o.an === true;
    this.gefuellt = 0;
    this.quellen = [];
    this.radius = o.radius || SPEC.radius;
    /* Die Höhe EINER Reihe folgt aus Radius und 16:9 — sie ist keine Einstellung. Der Mantel ist so
       hoch wie `reihen` × diese Zeile. */
    this.reihenHoehe = +((2 * Math.PI * this.radius / SPEC.motive) / (16 / 9)).toFixed(2);
    this.reihen = o.reihen || SPEC.reihen;
    this.hoehe = +(this.reihenHoehe * this.reihen).toFixed(2);
    const T = this.THREE;
    const Z = SPEC.zelle;
    this.atlas = document.createElement('canvas');
    this.atlas.width = Z[0] * SPEC.motive;
    this.atlas.height = Z[1] * this.reihen;
    this._g = this.atlas.getContext('2d');
    this._g.fillStyle = '#241f18';
    this._g.fillRect(0, 0, this.atlas.width, this.atlas.height);
    this.tex = new T.CanvasTexture(this.atlas);
    this.tex.colorSpace = T.SRGBColorSpace;
    /* WAAGERECHT WIEDERHOLEN, SENKRECHT KLEMMEN: der Mantel ist periodisch, das Bild ist es oben und
       unten nicht — `RepeatWrapping` auf beiden Achsen würde die Karte am Rand spiegeln. */
    this.tex.wrapS = T.RepeatWrapping;
    /* ⚠ SENKRECHT WIEDERHOLEN, NICHT KLEMMEN. Der Mantel selbst braucht das nicht — seine v laufen
       exakt 0 bis 1 —, aber der Abschluss darunter muss ÜBER die 0 hinaus weiterlesen können, sonst
       schmiert dort eine einzelne Pixelzeile. Mit `RepeatWrapping` setzt sich der Backsteinverband
       einfach fort; für den Mantel ändert sich kein Bildpunkt. */
    this.tex.wrapT = T.RepeatWrapping;
    /* ⚠ VON INNEN GESEHEN IST ALLES SPIEGELVERKEHRT (Georg 08.09.: »die Karten sind spiegelverkehrt«).
       Die UV eines Zylinders sind für den Blick von AUSSEN gelegt; wir stehen drin und rendern
       `BackSide`, also läuft u in der Ansicht rückwärts. Ein negativer Wiederholungsfaktor dreht ihn
       um (u′ = 1 − u) — exakt, ohne die Geometrie anzufassen, und die Naht bleibt periodisch. */
    this.tex.repeat.x = -1;
    this.tex.offset.x = 1;
    this.tex.anisotropy = o.aniso || 4;
    const geo = new T.CylinderGeometry(this.radius, this.radius, this.hoehe, SPEC.segmente, 1, true);
    this.mat = new T.MeshBasicMaterial({
      map: this.tex, side: T.BackSide, toneMapped: false,
      /* ⚠ KEIN NEBEL AUF DEM HIMMEL (Georg 08.09.: »sie wirken auch noch etwas zu blass«). Der Nebel
         ist dafür da, die KARTE nach hinten in die Ferne zu blenden — auf dem Mantel bei 60 u frisst
         er dagegen die halbe Sättigung, weil er jenseits von `weit × 0,6` liegt. Ein Hintergrund, der
         die Ferne DARSTELLT, braucht sie nicht zusätzlich aufgetragen.
         Merksatz: Nebel gehört auf das, was in die Ferne läuft, nicht auf die Ferne selbst. */
      fog: false,
      /* ⚠ DER MANTEL IST EIN RÜCKGRUND, ALSO WIRD ER IN DER REIHENFOLGE GEZEICHNET UND NICHT IN DER
         TIEFE (Befund 08.09., nach drei Fehlversuchen am fremden Modul). Die Hintergrundfläche des
         Gutter-Shaders steht auf renderOrder −900 und SCHREIBT TIEFE — ein Zylinder bei 60 u fällt
         also durch die Tiefenprüfung. Sie auszublenden hat nicht getragen: die Gruppe heißt an zwei
         Stellen `gutter-panel`, die Kamera hängt mit im Baum, und das Modul führt eine eigene Bühne
         (`stage.panelGroup`) — drei Anläufe, drei Fehlschläge, und jeder hätte eine Annahme über
         fremden Code zementiert.
         Also ohne jede Annahme: `depthTest: false` und renderOrder −800 — nach dem Shader, vor der
         Welt. Kein Tiefenschreiben, also legt sich die Karte normal darüber.
         Merksatz: wer einen Hintergrund zeigen will, muss ihn nicht durchsetzen, sondern später
         zeichnen. */
      depthTest: false, depthWrite: false
    });
    this.mesh = new T.Mesh(geo, this.mat);
    this.mesh.name = 'himmel';
    this.mesh.position.y = o.hoeheY != null ? o.hoeheY : SPEC.hoeheY;
    this.mesh.renderOrder = -800;   // nach der Shader-Fläche (−900), vor allem übrigen
    this.mesh.frustumCulled = false;
    this.mesh.visible = this.an;
    this.basis = [36, 32, 26];
    this._trichterBauen();
    this._dunstBauen();
  }

  /* ── DAS LOCH UNTEN (Georg 08.09.: »das Loch unten schneidet jetzt hart die unteren Karten ab«)
     ───────────────────────────────────────────────────────────────────────────────────────────
     GERECHNET, warum es überhaupt eines gibt: der Mantel ist `openEnded`, seine Unterkante liegt bei
     y = −13 − 212,1/2 = −119. Aus Kamerahöhe 5,9 trifft ein Strahl den Mantel bei 60 u Radius auf
     y = 5,9 − 60 · tan α; für y = −119 ist α = 64,4°. Bei 37° Neigung und rund 46° Bildwinkel zeigt
     die untere Bildkante 60° nach unten — in den ECKEN, wo der Bildwinkel diagonal größer ist, sind
     es 64 bis 66°. Genau dort läuft der Blick unter dem Mantel hindurch, und weil eine Kante keinen
     Verlauf hat, sieht man sie als Schnitt.
     MEHR REIHEN LÖSEN DAS NICHT. Reihe sieben verschöbe die Kante auf 65,9°, Reihe acht auf 67,2° —
     die Grenze wandert, sie verschwindet nicht, und jede Reihe kostet Atlasfläche. Ein Loch schließt
     man, indem man es schließt.
     ALSO EIN TRICHTER, KEIN DECKEL. Ein Kegel von der Unterkante auf einen Punkt hat KEIN Loch mehr
     (Radius null), egal wie steil man schaut. Er trägt dieselbe Textur, gespiegelt an der Fuge, also
     ist der Übergang stetig; und eine Helligkeitsrampe über die Eckpunkte lässt ihn nach unten
     weglaufen. Das ist der Unterschied zum zweimal durchgefallenen Scheibenboden: der war eine
     FLÄCHE in einer Farbe, das hier ist die Wand, die weitergeht.
     Merksatz: einen Hintergrund, der unten aufhört, verlängert man nicht — man schließt ihn. */
  /* ── DER ABSCHLUSS NACH UNTEN ───────────────────────────────────────────────────────
     WARUM ÜBERHAUPT: der Mantel ist `openEnded`. Bei 37° Neigung zeigen die unteren Bildecken 64 bis
     66° nach unten, und dort läuft der Blick unter der Unterkante hindurch. Nachgezählt wird das in
     `deckungPruefen()`, nicht behauptet.

     ZWEI KORREKTUREN GEGENÜBER MEINEM ERSTEN KEGEL (Georg 08.09.):
     (1) »die unteren Karten sind teilweise gespiegelt/falsch herum«. Stimmt, und es war meine
         Abkürzung: ich hatte die v des Kegels GESPIEGELT (`(1 - uv.y)/reihen`), weil unter der
         letzten Atlasreihe keine weitere steht. Eine Spiegelung ist aber genau das, was man an einem
         Text sofort sieht — kopfüber gestellte Karten sind schlimmer als gar keine. Mit
         `wrapT = Repeat` braucht es die Spiegelung nicht: v läuft über 0 hinaus ins Negative und
         liest oben im Atlas weiter. Der Verband setzt sich fort, jede Karte steht aufrecht.
     (2) »er läuft unten zu krass/schnell zusammen«. Auch das stimmt, und es liegt an der FORM: ein
         Kegel trifft den Zylinder in einem Knick (Tangente springt von senkrecht auf 49°), und ab
         da läuft alles geradlinig auf einen Punkt. Eine Halbkugel hat am Äquator eine SENKRECHTE
         Tangente — sie setzt den Mantel ohne Knick fort und krümmt sich erst allmählich weg. Kein
         Ansatz, kein Stürzen, und geschlossen ist sie genauso.
     Merksatz: einen Zylinder schliesst man mit dem, was seine Tangente teilt — nicht mit dem, was
     am schnellsten zu ist. */
  _trichterBauen() {
    const T = this.THREE;
    const R = this.radius;
    const tiefe = +(R * 0.9).toFixed(2);          // leicht gestauchte Halbkugel: Spitze bei d ≈ 101, innerhalb von far = 120
    /* phiStart = pi/2 richtet die u der Kugel auf die u des Zylinders aus (three legt sie um 90°
       versetzt an) — sonst springt der Verband an der Fuge um eine Vierteldrehung. */
    const geo = new T.SphereGeometry(R, SPEC.segmente, 28, Math.PI / 2, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    geo.scale(1, 0.9, 1);
    const uv = geo.attributes.uv;
    /* uv.y ist 1 am Äquator und 0 am Pol. Am Äquator soll die Atlaszeile 0 stehen (stetig zum
       Mantel), zum Pol hin läuft sie ins Negative und wiederholt — 1,6 Reihen weit, danach ist es
       ohnehin fast schwarz. */
    const k = 1.6 / this.reihen;
    for (let i = 0; i < uv.count; i++) uv.setY(i, (uv.getY(i) - 1) * k);
    uv.needsUpdate = true;
    const pos = geo.attributes.position, col = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const t = Math.min(1, -pos.getY(i) / tiefe);      // 0 = Fuge, 1 = Pol
      const v = 1 - 0.9 * Math.pow(t, 1.25);
      col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = v;
    }
    geo.setAttribute('color', new T.BufferAttribute(col, 3));
    this.matTrichter = new T.MeshBasicMaterial({
      map: this.tex, side: T.BackSide, toneMapped: false, fog: false,
      vertexColors: true, depthTest: false, depthWrite: false
    });
    this.trichter = new T.Mesh(geo, this.matTrichter);
    this.trichter.name = 'himmel-trichter';
    this.trichter.position.y = -(this.hoehe / 2);       // Äquator genau auf der Mantelunterkante
    this.trichter.renderOrder = -800;
    this.trichter.frustumCulled = false;
    this.trichterHoehe = tiefe;
    this.mesh.add(this.trichter);
  }

  /* Der Dunstmantel hängt AM Himmelsmantel, damit er seine Lage teilt und nicht
     nachgeführt werden müssen (dieselbe Regel wie bei der Tuscheschicht: was mitgehen soll, wird
     Kind und nicht Beobachter). */
  /* ⚠ DER DUNST WAR EINE TAPETE, UND MAN HAT SIE VORBEILAUFEN SEHEN (Georg 08.09.: »der Nebel ist so
     in der Art von repetitivem Muster, das relativ schnell vorbeiläuft — das hat nichts mit Nebel zu
     tun, das sieht einfach nur scheiße aus«). Er hat recht, und die Zahlen sagen genau das:
     `repeat.x = 2` heißt PERIODE 180°, bei 0,15 rad/s ist das ein voller Durchlauf alle 21 Sekunden.
     Das Sichtfenster ist 74° breit, also sieht man dieselbe Ballenfolge dreimal pro Minute
     wiederkehren. Dazu lief `dunstDrift` GEGEN die Drehung — zwei Bewegungen auf DERSELBEN Textur
     ergeben keine Schwaden, sondern ein sichtbares Scheren des Musters.
     Ich stecke hier zum dritten Mal im selben Zielkonflikt: langsam liest als statisch, schnell liest
     als Tapete. Der Konflikt kommt aber nicht von der Geschwindigkeit, sondern von der PERIODE —
     bei einer Periode, die länger ist als das Sichtfenster, gibt es keine Wiederkehr, die man
     erkennen könnte.
     ALSO: `repeat.x = 1` (Periode 360° statt 180°) und viel größere Ballen — einer deckt rund 60°,
     es passt also gerade EINER ins Bild, und ein einzelner Ballen ist kein Muster. Kein UV-Drift.
     Und ZWEI Schichten mit unterschiedlichen Radien, die GEGENLÄUFIG drehen (0,043 und −0,027 rad/s):
     ihr gemeinsamer Takt ist irrational lang, damit gibt es keinen Punkt, an dem sich das Bild
     wiederholt — und die Parallaxe zwischen den beiden Radien macht die Tiefe, die eine Schicht
     nie hat.
     Merksatz: gegen ein erkennbares Muster hilft nicht Tempo, sondern eine Periode, die nicht ins
     Bild passt. */
  _dunstBauen() {
    const T = this.THREE;
    const W = 512, S = 256, c = document.createElement('canvas');
    c.width = W; c.height = S;
    const g = c.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 0, S);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.40, 'rgba(255,255,255,0.92)');
    grad.addColorStop(0.66, 'rgba(255,255,255,0.78)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad; g.fillRect(0, 0, W, S);
    g.globalCompositeOperation = 'destination-out';
    let a = 12345;
    const rnd = () => { a = (a * 1103515245 + 12345) & 0x7fffffff; return a / 0x7fffffff; };
    /* Sieben große Löcher statt achtzehn kleiner. Jedes wird zweimal gesetzt (einmal um die
       Canvasbreite versetzt), damit die Naht bei `repeat.x = 1` stimmt — ein Zylinder ist
       periodisch, ein Canvas nicht. */
    for (let i = 0; i < 7; i++) {
      const x = rnd() * W, y = S * (0.22 + rnd() * 0.56), r = W * (0.10 + rnd() * 0.15);
      const deck = (0.45 + rnd() * 0.4).toFixed(2);
      for (const dx of [0, -W, W]) {
        if (dx !== 0 && (x + dx + r < 0 || x + dx - r > W)) continue;
        const gg = g.createRadialGradient(x + dx, y, 0, x + dx, y, r);
        gg.addColorStop(0, 'rgba(0,0,0,' + deck + ')');
        gg.addColorStop(0.55, 'rgba(0,0,0,' + (deck * 0.6).toFixed(2) + ')');
        gg.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gg; g.beginPath(); g.arc(x + dx, y, r, 0, Math.PI * 2); g.fill();
      }
    }
    this.dunstTex = new T.CanvasTexture(c);
    this.dunstTex.wrapS = T.RepeatWrapping;
    this.dunstTex.wrapT = T.ClampToEdgeWrapping;
    this.dunstTex.repeat.set(1, 1);
    const hB = SPEC.dunstHoehe;
    this.dunstLagen = [];
    for (const L of [{ r: 0.97, w: SPEC.dunstDreh, o: 0, d: 1.0 }, { r: 0.92, w: -SPEC.dunstDreh * 0.63, o: 0.37, d: 0.72 }]) {
      const tex = L.o ? this.dunstTex.clone() : this.dunstTex;
      if (L.o) { tex.offset.x = L.o; tex.needsUpdate = true; }
      const mat = new T.MeshBasicMaterial({
        map: tex, side: T.BackSide, transparent: true, opacity: SPEC.dunstDeckung * L.d,
        toneMapped: false, fog: false,
        /* ⚠ TIEFENPRÜFUNG AN (Georg 08.09.: »Enemies sind teilweise vom Dunst überlagert«). Mit
           `depthTest: false` malt eine durchsichtige Fläche über ALLES, was vor ihr steht.
           Merksatz: `depthTest: false` heißt »ich bin vorne«, nicht »ich bin hinten«. */
        depthTest: true, depthWrite: false, color: 0xffffff
      });
      const m = new T.Mesh(new T.CylinderGeometry(this.radius * L.r, this.radius * L.r, hB, 64, 1, true), mat);
      m.position.y = SPEC.dunstY - this.mesh.position.y;
      m.renderOrder = -799;
      m.frustumCulled = false;
      m.userData.w = L.w;
      this.mesh.add(m);
      this.dunstLagen.push({ mesh: m, mat, tex });
    }
    this.dunst = this.dunstLagen[0].mesh;      // Rückweg-Name, unverändert
    this.matDunst = this.dunstLagen[0].mat;
  }

  /** Ein Bild Dunst: zwei Schichten, gegenläufig, unterschiedlich schnell. Kein UV-Drift. */
  update(dt) {
    if (!this.an || !(dt > 0) || !this.dunstLagen) return false;
    for (const L of this.dunstLagen) L.mesh.rotation.y += L.mesh.userData.w * dt;
    return true;
  }

  mount(parent) { this.parent = parent; parent.add(this.mesh); return this.mesh; }

  zeigen(an) {
    this.an = !!an;
    this.mesh.visible = this.an;
    return this.an;
  }

  /* EIN MOTIV EINSETZEN. `q` ist das Viertel der Seite (0 = links oben, 1 = rechts oben, 2 = links
     unten, 3 = rechts unten) — dieselbe Reihenfolge wie im Kartenkanon, damit »Karte 1 bis 6« am
     Horizont auch die Karten 1 bis 6 sind und nicht eine Zufallsauswahl.
     Der Zuschnitt ist BLIND (halbe Seite in beiden Richtungen) und wird dann auf die 16:9-Zelle
     gezogen: 1,79 gegen 1,778 sind 0,7 % Abweichung, das ist unter der Wahrnehmungsschwelle und
     ohne Deck-Daten zu haben.
     JE REIHE einmal, mit halber Zellbreite Versatz und rotierter Reihenfolge (Backsteinverband,
     siehe SPEC). Der Versatz braucht ZWEI Zeichnungen je Zelle, weil die überhängende Hälfte am
     anderen Rand wieder hereinkommen muss — ein Zylinder ist periodisch, ein Canvas nicht. */
  fuellen(i, seite, q) {
    if (!seite || i < 0 || i >= SPEC.motive) return false;
    const Z = SPEC.zelle;
    const W = seite.width, H = seite.height;
    const hw = Math.floor(W / 2), hh = Math.floor(H / 2);
    const sx = (q % 2) * hw, sy = (q < 2 ? 0 : 1) * hh;
    const breit = Z[0] * SPEC.motive;
    for (let r = 0; r < this.reihen; r++) {
      /* Reihe r zeigt Motiv (i + 2r) mod 6 an Platz i — also steht kein Bild über sich selbst. */
      const platz = ((i - 2 * r) % SPEC.motive + SPEC.motive) % SPEC.motive;
      const x0 = platz * Z[0] + (r % 2 ? Z[0] * 0.5 : 0);
      const y0 = r * Z[1];
      this._g.drawImage(seite, sx, sy, hw, hh, x0, y0, Z[0], Z[1]);
      if (x0 + Z[0] > breit) this._g.drawImage(seite, sx, sy, hw, hh, x0 - breit, y0, Z[0], Z[1]);
    }
    this.tex.needsUpdate = true;
    this.gefuellt = Math.max(this.gefuellt, 0) + 1;
    this.quellen[i] = { seite: seite.__seite != null ? seite.__seite : null, deck: seite.__deck || null,
                        q, sw: hw, sh: hh, ar: +(hw / hh).toFixed(3) };
    return true;
  }

  /** Nach dem Füllen: Horizont- und Nebelfarbe aus den Motiven lesen (siehe Kopf, Punkt 3). */
  farbeLesen(scene, kamera) {
    const T = this.THREE, Z = SPEC.zelle;
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < SPEC.motive; i++) {
      let d;
      try { d = this._g.getImageData(i * Z[0], 0, Z[0], Z[1]); } catch (e) { return null; }
      const px = d.data, schritt = 4 * Math.max(1, Math.floor(px.length / 4 / 576));
      for (let k = 0; k < px.length; k += schritt) { r += px[k]; g += px[k + 1]; b += px[k + 2]; n++; }
    }
    if (!n) return null;
    this.basis = [r / n, g / n, b / n];
    const c = new T.Color(this.basis[0] / 255, this.basis[1] / 255, this.basis[2] / 255);
    const hsl = { h: 0, s: 0, l: 0 };
    c.getHSL(hsl);
    /* MODUS TRANSFORMIERT, DECK SETZT: hier wird nur verschoben, und zwar auf den gemessenen Werten.
       Der Nebel ist dunkler und flauer als die Motive, sonst steht der Zylinder wie eine Tapete im
       Raum statt als Ferne. */
    const nebel = new T.Color().setHSL(hsl.h, Math.min(1, hsl.s * 0.55 * SPEC.saettigung), Math.min(1, hsl.l * 0.62 * SPEC.tint));
    /* Die MOTIVE bleiben ungetönt (`tint` als Grauwert), weil sie gezeichnete Karten sind und keine
       Landschaft — eine Einfärbung würde das Deck verfälschen. Transformiert wird die FERNE: Nebel
       und Horizont tragen die gemessene Farbe, gedämpft und entsättigt. */
    this.mat.color.setRGB(SPEC.tint, SPEC.tint, SPEC.tint);
    this.nebelFarbe = nebel.getHexString();
    /* Der Dunst trägt die gemessene Fernfarbe, etwas aufgehellt — sonst steht er als fremder Ton vor
       einem Deck, dessen Farbe gerade aus seinen eigenen Karten gelesen wurde. */
    if (this.matDunst) for (const L of this.dunstLagen) L.mat.color.copy(nebel).lerp(new T.Color(0xffffff), 0.35);
    this._kam = kamera || this._kam;
    if (scene) {
      /* ⚠ DER NEBEL MUSS INNERHALB DER SICHTWEITE ENDEN. Gemessen 08.09.: `camera.far` ist 120, mein
         erster Wert war 158 — der Nebel hätte den Mantel also nie ganz erreicht, und weiter hinten
         hätte die Kamera ohnehin abgeschnitten. Deckel bei 96 % der Sichtweite: die Ferne schließt
         mit Nebel und nicht mit einer Kante. */
      const weitMax = kamera && kamera.far ? kamera.far * 0.96 : Infinity;
      const weit = Math.min(weitMax, SPEC.nebelU[1]);
      const nah = Math.min(SPEC.nebelU[0], weit * 0.4);
      scene.fog = new T.Fog(nebel.getHex(), nah, weit);
      this._fog = { nah: +nah.toFixed(1), weit: +weit.toFixed(1) };
    }
    return this.nebelFarbe;
  }

  /* ── DER BODEN GEGEN DAS LOCH (Georg 08.09.: »da hast du jetzt eine andere Art der Beschneidung
     gewählt — da brauche ich eine Lösung«) ──────────────────────────────────────────────
     Er hat zweimal recht behalten, und beide Male habe ich BEHAUPTET, das Loch sei zu — einmal mit
     mehr Reihen, einmal mit einem Trichter, der komplett hinter der Sichtweite lag. Eine Behauptung
     ist keine Lösung; eine Zahl, die durchfallen kann, ist eine.
     Diese Methode schießt ein Raster von Strahlen durch den GANZEN Bildausschnitt (die Ecken
     zuerst — dort ist der Winkel am steilsten) und zählt zwei Arten von Loch:
       fehl      — der Strahl trifft überhaupt keine Himmelsfläche (Geometrie offen)
       jenseits  — er trifft, aber weiter weg als `camera.far` (Geometrie zu, aber weggeschnitten)
     Der zweite Fall ist der, den ich beim ersten Anlauf übersehen habe: geschlossen und trotzdem
     unsichtbar. Beide zusammen müssen null sein, sonst fällt C26 durch.
     Merksatz: ein Loch schließt man nicht, indem man Geometrie hinstellt, sondern indem man
     nachzählt, dass keine Blickrichtung mehr frei ist. */
  deckungPruefen(kamera) {
    const kam = kamera || this._kam;
    if (!kam || !this.mesh) return null;
    const T = this.THREE;
    const rc = this._rc || (this._rc = new T.Raycaster());
    rc.far = Infinity;
    const ziele = [this.mesh]; if (this.trichter) ziele.push(this.trichter);
    this.mesh.updateWorldMatrix(true, true);
    let fehl = 0, jenseits = 0, dmax = 0, n = 0;
    const v = new T.Vector3();
    for (let ix = 0; ix <= 8; ix++) {
      for (let iy = 0; iy <= 8; iy++) {
        const x = ix / 4 - 1, y = iy / 4 - 1;
        v.set(x, y, 0.5).unproject(kam).sub(kam.position).normalize();
        rc.set(kam.position, v);
        const tr = rc.intersectObjects(ziele, false);
        n++;
        if (!tr.length) { fehl++; continue; }
        const d = tr[0].distance;
        if (d > dmax) dmax = d;
        if (d > kam.far) jenseits++;
      }
    }
    return { strahlen: n, fehl, jenseits, dmax: +dmax.toFixed(1), far: kam.far };
  }

  probe() {
    const soll = 16 / 9;
    const ars = this.quellen.filter(Boolean).map((q) => q.ar);
    const abw = ars.length ? Math.max(...ars.map((a) => Math.abs(a - soll) / soll)) : null;
    return {
      an: !!this.an, radius: this.radius, hoehe: this.hoehe, reihen: this.reihen,
      motive: SPEC.motive, belegt: this.quellen.filter(Boolean).length,
      atlas: this.atlas.width + '×' + this.atlas.height,
      motivbreite: +((2 * Math.PI * this.radius) / SPEC.motive).toFixed(1),
      ar: ars, abweichung: abw != null ? +(abw * 100).toFixed(2) : null,
      trichter: this.trichter ? +(this.hoehe / 2 + this.trichterHoehe + Math.abs(this.mesh.position.y)).toFixed(1) : null,
      deckung: this.an ? this.deckungPruefen() : null,
      nebel: this.nebelFarbe || null, fog: this._fog || null,
      deckSoll: this.deckSoll || null,
      deckIst: [...new Set(this.quellen.filter(Boolean).map((q) => q.deck))].filter(Boolean),
      fremd: this.quellen.filter(Boolean).filter((q) => this.deckSoll && q.deck && q.deck !== this.deckSoll).length,
      /* ⚠ ZÄHLEN, NICHT BEHAUPTEN (Kritiker 08.09.). Hier stand die Konstante 1 — richtig, als der
         Himmel aus einem einzigen Mantel bestand. Inzwischen hängen vier Meshes darunter (Mantel,
         Halbkugel-Abschluss, zwei Dunstlagen), und die Protokollzeile meldete weiter „1
         Zeichenaufruf": Faktor vier daneben.
         Es ist dieselbe Fehlerklasse wie der Trichter, der hinter `camera.far` lag und trotzdem als
         geschlossen galt — ein Instrument, das die Absicht von damals meldet statt der Wirkung von
         jetzt. Solche Zahlen sind schlimmer als keine, weil man ihnen glaubt.
         Merksatz: eine Kennzahl, die eine Konstante ist, misst nichts — sie erinnert sich. */
      zeichenaufrufe: (() => { let z = 0; this.mesh.traverse((o) => { if (o.isMesh && o.visible) z++; }); return z; })()
    };
  }

  zeile() {
    const p = this.probe();
    return '[himmel] ' + (p.an ? 'an' : 'AUS') + ' · Zylinder r ' + p.radius + ' × h ' + p.hoehe
      + ' (' + p.reihen + ' Reihen im Verband)'
      + ' · ' + p.belegt + '/' + p.motive + ' Motive (Mantelbreite ' + p.motivbreite + ' u)'
      + (p.abweichung != null ? ' · 16:9 auf ' + p.abweichung + ' % genau' : '')
      + ' · Atlas ' + p.atlas + ' · 1 Zeichenaufruf'
      + (p.deckSoll ? ' · Deck ' + p.deckSoll : '')
      + (p.fremd ? ' · ⚠ ' + p.fremd + ' Motive aus einem anderen Deck' : '')
      + (p.deckung ? ' · dicht ' + (p.deckung.fehl + p.deckung.jenseits === 0 ? 'ja' : '⚠ ' + p.deckung.fehl + ' fehl / ' + p.deckung.jenseits + ' jenseits') : '')
      + (p.nebel ? ' · Nebel #' + p.nebel : '');
  }

  /* C26: sechs Motive, jedes 16:9 auf 2 % genau, eine Textur — UND ALLE AUS DEM DECK, AUF DEM MAN
     STEHT. Erste Fassung zählte nur belegte Zellen und meldete »6/6«, während am Horizont die Karten
     des VORIGEN Decks hingen (Kritiker 08.09.: `museum_of_modern_mess` unter den Füßen,
     `medkayfab_intensive_care_medicine` am Himmel). Damit prüfte der Boden die Vollständigkeit und
     nicht die Aussage. Ein Himmel mit einer leeren Zelle ist ein Loch; ein Himmel mit fremden Karten
     ist eine Lüge — die zweite ist schlimmer, weil sie nicht auffällt.
     Merksatz: ein Boden, der nur zählt, prüft die Menge und nicht die Bedeutung. */
  tor() {
    const p = this.probe();
    const d = p.deckung;
    const dicht = !this.an || (d && d.fehl === 0 && d.jenseits === 0);
    const ok = !this.an || (p.belegt === p.motive && p.abweichung != null && p.abweichung <= 2 && p.fremd === 0 && dicht);
    return { name: 'himmel.v3', bestanden: ok ? 1 : 0, von: 1, pass: ok,
             zeile: 'C26 · ' + p.belegt + '/' + p.motive + ' Motive · 16:9 ± ' + (p.abweichung != null ? p.abweichung : '–') + ' %'
               + ' · ' + p.fremd + ' fremd'
               + (d ? ' · dicht ' + (d.strahlen - d.fehl - d.jenseits) + '/' + d.strahlen + ' (max ' + d.dmax + ' u von ' + d.far + ')' : '')
               + ' · ' + p.zeichenaufrufe + ' Zeichenaufruf' + (p.zeichenaufrufe === 1 ? '' : 'e') + (this.an ? '' : ' (aus)') };
  }

  dispose() {
    if (this.mesh) {
      if (this.mesh.parent) this.mesh.parent.remove(this.mesh);
      if (this.mesh.geometry) this.mesh.geometry.dispose();
    }
    if (this.dunstLagen) for (const L of this.dunstLagen) { if (L.mesh.geometry) L.mesh.geometry.dispose(); L.mat.dispose(); L.tex.dispose(); }
    if (this.trichter && this.trichter.geometry) this.trichter.geometry.dispose();
    for (const m of [this.mat, this.matTrichter]) if (m) m.dispose();
    if (this.tex) this.tex.dispose();
    this.mesh = null; this.tex = null; this.mat = null; this.dunst = null; this.dunstLagen = null; this.trichter = null;
    return true;
  }
}
