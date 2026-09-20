# CHANGELOG · Cologne Option C · Slice C

## 2026-09-20T04:58:00Z · first playable Option-C candidate

**New**
- `KFB Cologne Race Option C.dc.html` — playable Design Component with the HUD v3 surface
- `lab-v9/option-c-style.v1.js` — the two authority boards measured; every colour carries its share
- `lab-v9/cologne-route.v1.js` — Dom Loop authored from a blank route, 23 control points, 1 997,4 m
- `lab-v9/cologne-track.v1.js` — TrackFlowDeformer: bed, shoulders, rails, walls, lane bands, soffit, pylons, tunnel shell and arches, start band
- `lab-v9/cologne-world.v1.js` — BuildingElastic on 850 real OSM footprints, Rhine shader, LandmarkElastic Dom, ground
- `lab-v9/cologne-play.v1.js` — Race v0.8 movement verbatim, measured vehicle frame, speed trails, propulsion orb, five review cameras
- `lab-v9/cologne-props.v1.js` — Kenney billboard and CCTV camera, real KFB card crop
- `lab-v9/cologne-stage.v1.js` — scene assembly and the evidence seam
- `KFB_COLOGNE_OPTION_C_EXPORT/donor-isolation.html` — eight donors alone and measured

**Decided**
- The roadbed is the measured teal #279797 from board 01. Board 02's warm clay became shoulders, walls and structure. Both boards are honoured; neither was averaged away.
- FILAMENT #02 informed cadence only. The route was written against real Cologne anchors.
- Where the track leaves the ground it carries a soffit and pylons. No terrain was raised.

## Nach Georgs erster Sichtung

- **Lenkung war spiegelverkehrt.** Das negative Vorzeichen von `steerBase` aus dem Spender war
  mit `Math.abs()` weggeworfen worden. Jetzt vorzeichenrichtig, Drift folgt derselben Regel.
- **Durchfahrten statt Kollisionen.** Gebäude auf der Strecke werden nicht gelöscht, sie bekommen
  eine Passage: Block ab 11,0 m Lichte, getragen von Pfeilern außerhalb des Korridors.
- **Spuren neu gebaut.** Nie breiter als das Heck (0,44 m je Spur gegen 1,08 m halbe Fahrzeugbreite),
  Tempo verlängert statt verbreitert, Abtastung nach Weg statt nach Bild, Seitenvektor aus der
  örtlichen Tangente — die Spur reißt in keiner Kurve mehr eckig ab.
- **UI aufgeräumt.** Keine Knopfleiste im Bild. Review-Steuerung hinter einem 26-px-Schalter,
  Radio als drei kleine Symbole oben rechts, Zustandsbänder dünn unter den Tacho.
- **Rhein beruhigt.** Die Schaumscheiben waren das Produkt zweier Wellen mit Maxima auf einem
  Gitter, die diagonalen Bänder eine Glanzwelle mit ungleichen Perioden. Beide Ursachen entfernt.

- **Durchfahrtstest an den Kanten statt an den Ecken.** Ein Block, dessen Kante die Strecke
  kreuzt, dessen Ecken aber beide außen liegen, blieb massiv — die Kamera stand darin. Kanten
  werden jetzt alle 6 m abgetastet, der Freihaltestreifen wuchs von 3 m auf 9 m.

## Zweite Sichtungsrunde

- **Ockerfarbene Platte am Start war die Start-Ziel-Bande.** `rotation.x` und `rotation.z` auf
  demselben Objekt: die zweite Drehung geht um eine Weltachse und kippt die eben gelegte Fläche
  wieder auf. Die Gierung sitzt jetzt in einem eigenen Träger.
- **Tacho 186 → 116 px, Minikarte 196 → 128 px.** Im geteilten Fenster waren beide dominanter
  als die Strecke.
- **Steuerung als kompakter Kopf oben mittig**, umbrechend, mit Streckennamen; Kartenfächer
  direkt darunter. Keine Leiste mehr im Sichtfeld.
- **Skydome aus der TinySkies-/Travel-Linie übernommen**, mit Sky Dice und Sky Cards. Farbstopps
  aus den gemessenen Tafeln statt aus den Travel-Paletten; Verzerrung und Kontrast halbiert.
- **Sechs Quaternius-Planeten organisch verteilt** — goldener Winkel als Gerüst, Streuung je
  Körper, Sonnenfenster frei. Erste Aufhängung bei 9–42 Grad Höhe lag komplett außerhalb des
  Blickfelds der Verfolgerkamera; gemessen und tiefer gehängt.

## Dritte Sichtungsrunde

- **Lenken und Driften waren beide falsch parametriert.** Die Lenkverstärkung ergab bei 41 m/s
  einen Kurvenradius von 210 m — das fühlt sich nicht nach Lenken an. Jetzt rund 60 m. Und der
  Zentrifugalanteil wurde ohne `dt` aufaddiert, bei 120 Bildern je Sekunde also 120-fach: das war
  das Wegschmieren. Der Drift-Anstoß war ein Querimpuls von 17 m/s; Drift ist jetzt eine
  begrenzte Querbeschleunigung mit Gierzuschlag.
- **Start/Ziel ist ein echtes Modell.** `roadStart.glb` an der gemessenen Hülle auf 20,7 m
  Bandbreite gezogen, dazu zwei Zielflaggen. Die eingefärbte Behelfsplatte ist raus.
- **Drei Checkpoint-Tore** aus `overheadLights.glb`. Nach dem Skalieren auf die Bandbreite wird
  die Lichte nachgemessen und das Tor notfalls hochskaliert — 8,21 / 8,33 / 8,20 m.

## Vierte Sichtungsrunde

- **Kopf einklappbar**: eingeklappt eine Zeile (`DOM LOOP │ CHASE │ km/h`), ausgeklappt Kameras,
  Schalter, Radio, Fahrzeugwahl und Beleg.
- **Ein Wurf in `renderVals` hatte den ganzen Kopf geleert.** `ev.checkpoints.gates.map()` lief
  auch dann, wenn der Torbau in den Fehlerzweig gegangen war. Ein einziger Wurf lässt sämtliche
  Löcher der Vorlage unaufgelöst. Die Belegzeilen liegen jetzt in try/catch, jedes optionale Feld
  ist geprüft.
- **Planeten waren weiße Klumpen.** Die Quaternius-Modelle tragen ihre Farbe in der Atlas-Textur,
  die Grundfarbe ist weiß — `emissive = color` ergab selbstleuchtendes Weiß. Override raus,
  Felsen aus dem Himmel entfernt.

## Fünfte Sichtungsrunde

- **KFB Power Donut Drive** als Antrieb (`donut_pink.gltf`, byteweise geprüft). Steht auf der
  Fahrtachse, Streuselseite nach hinten zur Kamera, dreht und pulsiert mit dem Tempo. Die Kugel
  bleibt als zweiter Skin, im Kopf umschaltbar.
- **Der Antrieb ist jetzt die Quelle.** Spur und Speedlines wachsen aus seinen Ansatzpunkten:
  eine kurze dichte Spur aus dem Ring, zwei dünne Linien an den Heckkanten über den Hinterrädern.
- **Ugur-Würfel als Begleiter** mit leuchtenden Augen; die gezeigte Augenzahl ist die Tempostufe,
  die Farbe pulsiert mit dem Antrieb.
- **Kaskade am Bandrand**: alle 9,5 m ein Stabpaar mit Winkelblech, Höhe über eine 133-m-Welle
  moduliert — eine Kaskade, kein Zaun.
- **Kopfzeile einzeilig.** Gemessen 897 px in einem 924-px-Fenster; nach dem Trimmen 661 px,
  Uhr und Rundenzahl daneben statt darunter.
- **Planeten in die Tafelpalette geholt** statt in der Quaternius-Eigenfarbe zu stehen.

## Sechste Sichtungsrunde

- **Belegzeile »Würfel« stand auf `undefined`.** Beim Umzug der Himmelswürfel nach `skyDice`
  blieb die Zeile auf den alten Feldern stehen. Jetzt zwei Zeilen mit echten Messwerten.
- **Planetenverteilung war nicht vollständig:** Planet_1 doppelt, Planet_3 fehlte. Jeder Körper
  wird genau einmal angefordert, eine von der Sonnenfenster-Sperre blockierte Stelle wird auf dem
  nächsten Azimut nachgeholt, und die Zeile meldet platziert-von-angefordert samt Ausweichungen.
- Wurzelhöhe auf `max-height: 100vh` — die unteren 2 px von Tacho und Minikarte waren im
  geteilten Fenster abgeschnitten.

## HUD v4 · siebte Runde

- Kopf auf Burger + drei Radioknöpfe + Regler reduziert; alles Weitere hinter dem Burger in
  11 px statt 8 px.
- Tacho 132 × 90, Zahl in Bangers 38 px, KM/H entfernt, eine stufenlose Farbrampe für Zahl
  und Bogen. Bogenlänge gemessen: Halbkreis r=52 → 163,4; der Schätzwert 204 füllte die
  Anzeige bei halbem Tempo nur zu 62 %.
- Grip kühl und ruhig, Boost als warmer Puls darüber; die rote Zone hängt am Tempo.
- Mini-map 100 px, Hover weich auf 132 (260 ms auf, 320 ms zu).
- Almanach 92 px, 420 ms auf cubic-bezier(.22,.78,.22,1) mit 45 ms Versatz je Karte.
- Donut im Stand halb so groß und fast stehend; wächst und dreht mit dem Tempo.
- Himmelswürfel von 62 auf 22 Einheiten — der alte füllte den halben Himmel.

## Achte Runde

- **Steuerung gemessen repariert.** Meine Herleitung war dreimal falsch, weil ich Bildschirm-
  rechts mit +X gleichgesetzt habe; die Verfolgerkamera blickt aber MIT der Fahrtrichtung,
  dadurch kehrt sich die Seite um. Jetzt am laufenden Bild gemessen: die Bewegung wird auf den
  Kamera-Rechtsvektor projiziert. A −2,6 (links), D +15,9 (rechts), Q −4,9 (Drift links),
  E +13,1 (Drift rechts). Rückwärts erreicht −9 m/s.
- **Donut dreht rückwärts mit**, sobald das Tempo negativ wird.
- **Torkette statt drei Einzeltore**: 8 Bögen in regelmäßigen 249,7 m aus dem gepinnten
  Asset-Handoff (overheadRound, overheadLights, overheadRoundColored, overhead). Lichte
  nachgemessen: 8,00–9,57 m. Im Tunnel steht kein Tor.
- **Durchfahrt-Klang** synthetisiert (gefiltertes Rauschen mit fallender Mittenfrequenz,
  Tonhöhe und Lautstärke am Tempo). Im Repo liegt unter media/3D_Assets/Sounds nur Musik,
  kein Torgeräusch — deshalb erzeugt statt geliehen.
- **Countdown 3·2·1** aus Numbers_1..3 des Handoffs, 9 m hoch, dreht sich zur Kamera.
- Beat-Meter am Donut auf Ansage zurückgestellt (kein Shake/Zittern am Radio).

## Neunte Runde · Genius Loci

- **Befund:** weder der Asset-Handoff (213 Assets) noch der Genius-Loci-Katalog des Projekts
  (22 Kandidaten) führt eine Kölner Landmarke. Es gab nichts zu laden.
- Gebaut nach der Vorschrift, die der Katalog für diesen Fall selbst angibt: OSM-Anker plus
  öffentliche Hauptmaße plus eigene Low-Poly-Module. Fünf Stück — Hohenzollernbrücke,
  Deutzer Brücke, Hauptbahnhof, Museum Ludwig, Philharmonie.
- **Konflikt gemessen und zugunsten von OSM entschieden:** die Hohenzollernbrücke liegt mit
  Fahrbahn auf y 12 und Bögen bis y 37 genau dort, wo das alte Rheindeck bei y 14–18 lief.
  Verschoben wurde nicht die Brücke, sondern die Strecke: sie steigt jetzt auf y 30–46 und
  fliegt über die echte Brücke.
- Countdown-Ziffern als **Ersatz deklariert**: das Racing Kit führt keine Ziffern (Regex über
  alle 213 Handoff-Assets plus 19 geratene Dateinamen, alle 404). Verwendet werden die des
  Platformer Game Kit, und die Belegzeile sagt das jetzt auch.

## Zehnte Runde

- **Planeten waren schwarze Silhouetten** — die Korrektur der Vorrunde hatte ins andere Extrem
  geschossen. Am Bild gemessen: Lum 14 gegen einen Himmel von Lum 88. Das Eigenleuchten ist
  zurück, aber im EIGENEN gemessenen Ton statt in der Grundfarbe; genau diese Unterscheidung
  war vorher der Fehler, weil die Quaternius-Grundfarbe weiß ist. Nachgemessen: Planet Lum 87,
  Himmel Lum 87.

## Elfte Runde · Streckenaudit, Antriebs-Skins, Klangschicht

- **Ursache für „man fährt durch Gebäude" gefunden.** Meine Korridorprüfung tastete nur die
  Grundriss-Kanten ab, und zwar im Umkreis von rund 30 m. Ein GROSSES Gebäude, dessen Kanten
  weit weg liegen, während die Strecke mitten hindurchläuft, fiel komplett durch. Jetzt wird
  direkt Punkt-in-Polygon getestet: jeder Streckenstützpunkt gegen jeden Grundriss.
  Ergebnis: **73 Gebäude werden verworfen** statt durchfahren (vorher 0), 2 bekommen eine
  Durchfahrt.
- **Die Rechteck-Blöcke am Start waren meine Bahnhofshalle.** Zwei Fehler auf einmal: die Halle
  ist 255 × 64 m und lief in die Startgerade, und ihre Dachrippen waren über eine Euler-Drehung
  ausgerichtet statt über ihre Endpunkte — im Bild ein aufgefächerter Haufen schräger Platten.
  Rippen jetzt über Endpunkte (dieselbe Regel, die der Dom-Spender schon anwendet), und jede
  Landmarke wird senkrecht zur Streckenachse freigestellt. Versatz wird gemeldet:
  Hauptbahnhof 124,7 m, Hohenzollernbrücke 65,5 m, die übrigen 0.
- **Streckenscan gebaut** (`stage.auditRoute`): jeder Stützpunkt gegen jedes Netz im Fahrraum.
  Ausgenommen sind verschmolzene Stadtnetze (deren Hülle sagt nichts) sowie Startlinie, Tore
  und der eigene Antrieb — die stehen absichtlich dort. Messreihe: **40 → 4** Befunde.
- **Würfel ist jetzt ein Antriebs-Skin**, nicht mehr der mitfliegende Begleiter. Drei Skins mit
  identischem Verhalten: Donut, Würfel (Hauptfarbe, weiße Augen), Kugel. Der Begleiter bleibt
  gebaut, ist aber standardmäßig aus — ein Gimmick für später.
- **Mittelstreifen nach Verkehrslogik**: 128 Striche, 5 m Strich auf 7 m Lücke. Bei 41 m/s läuft
  das rund dreieinhalb mal je Sekunde durchs Bild — daran liest man Tempo ab.
- **Motorenlauf als eigene Klangschicht** (`cologne-audio.v1.js`): V8-Schleife, Tonhöhe
  0,78–1,42 am Tempo, Pegel an Tempo und Gas. Drei Schichten sind jetzt sauber getrennt:
  BED Motor, MUSIC Jukebox, SFX Tordurchfahrt.
- **Eigener Audio-Pin**, weil er nicht selbstverständlich ist: der Ordner
  `media/3D_Assets/Audio/KFB Racer/` kam am 2026-09-20T06:24:33Z mit Commit `26c00b98a60e`
  dazu — also NACH dem Basis-Pin dieser Slice. Unter dem Basis-Pin liefert derselbe Pfad 404.
- Neu: `KFB_COLOGNE_OPTION_C_EXPORT/MODULES_AND_DONORS.md` — Modulbesitz und alle Spender mit
  Besitzer, Rolle und Grenze.

## Zwölfte Runde · Strecke frei

- **Ein Brückenpfeiler stand im Tunnelmund auf der Fahrbahn** — und mein Freistellen hatte dafür
  die OSM-Regel gebrochen, die dieses Projekt trägt: die Brücke lag 65,5 m neben ihrem Anker und
  blockierte trotzdem. Drei Fehler in einer Funktion:
  1. Sie schob entlang der Normalen EINES Punktes und prüfte die neue Lage nie gegen den Rest.
  2. Sie maß mit einem KREIS. Für eine 255-m-Halle sind das 127 m Radius — damit ist ein Bau,
     der längs NEBEN der Strecke liegt, nie freizustellen.
  3. Der Brückenabstand von 72 m war ein Notbehelf aus der Kreis-Zeit. Er forderte 78,8 m, wo
     der echte Abstand 21 m beträgt — deshalb warf mein eigener Code die Brücke weg.
  Neu: gedrehtes Rechteck statt Kreis, jede Kandidatenlage gegen ALLE 598 Stützpunkte, und drei
  Hebel in dieser Reihenfolge — kleiner gedeckelter Versatz, Verkleinern des EIGENEN Moduls
  (das gehört mir, nicht OSM), senkrechte Trennung. Alle fünf Landmarken stehen, vier exakt auf
  ihrem Anker, der Hauptbahnhof mit 28 m deklariertem Versatz, nichts verkleinert.
- **Drei der vier gemeldeten Befunde waren Fehlalarme** und haben den einen echten verdeckt. Der
  Filter prüfte nur den ersten benannten Vorfahren; die Zielflaggen tragen eigene glTF-Namen.
  Jetzt wird die ganze Ahnenkette geprüft.
- **Ergebnis: 0 Befunde bei Schrittweite 1** — jeder der 598 Stützpunkte gegen 463 Netze.
- Die Rampe zum Strom geht jetzt nördlich am Bogen vorbei und erreicht Deckhöhe, bevor sie das
  Brückenband kreuzt. Man sieht die Brücke, statt durch sie zu fliegen.

## Dreizehnte Runde · Lesbarkeit

- **Der v4-Tacho hatte seine dunkle Unterlage verloren.** Die v3-Fassung trug sie, mein Umbau
  nicht — die Zahl stand danach direkt auf der Szene. Gemessen am Bild: **1,89:1** im kühlen
  und **1,00:1** im roten Bereich. Bei Höchsttempo also keine Anzeige mehr.
  Die Ursache ist strukturell: das Teal-Cyan der Rampe und ihr Rot liegen beide auf derselben
  Helligkeit wie die teale Fahrbahn — mit Farbe allein ist das nicht zu lösen.
  Brief v4 §8 verlangt den Anthrazit-Grund ausdrücklich; ihn zurückzuholen ist keine Abweichung.
  Dazu ein 1,1-px-Konturstrich in Creme, weil Rot auf Anthrazit auch mit Platte knapp unter
  3:1 bleibt. Nachgerechnet: Zahl kühl **6,86**, heiß **3,64**, BEST **7,09**, Segment **8,71**,
  Oberfläche **4,97**.

## Vierzehnte Runde · eigene Tore, Klangschichten, Kamera

- **Die Kenney-Tore sind raus.** Sie sind auf ihre eigene Spurbreite modelliert; auf 18 m
  hochskaliert wurde aus einem schlanken Bogen eine Fläche quer über der Fahrbahn. Ein Modell
  zu verzerren, damit es passt, ist der falsche Weg herum.
- **Tore sind jetzt Streckenkomponenten** (`lab-v9/cologne-gates.v1.js`): parametrisch aus
  Bandbreite, Überhöhung und Tangente gebaut, zwei Grundformen (Bogen und Portal), Farben aus
  der gemessenen Palette, Leuchtband innen. Gemessen: 8 Tore, Spannweiten 13,0–22,4 m — jede
  folgt der tatsächlichen Bandbreite an ihrer Stelle, keine Verzerrung. Lichte überall 9 m bei
  1,90 m Fahrzeughöhe. Im Tunnel steht keins.
- **Start/Ziel** mit üblicher Zielflaggen-Logik: 2 × 12 Schachbrett quer über die Fahrbahn plus
  ein Portal in Schwarz-Weiß.
- **Jingles an den Toren**: 85 Dateien aus fünf Kenney-Familien (RETRO/HIT/PIZZI/SAX/STEEL),
  erst einmal zufällig, damit alle einmal zu hören sind; im Ziel ein Belohnungs-Jingle.
  Eigener Pin `7eebc7ca`, weil der Ordner nach dem Slice-Basis-Pin dazukam.
- **Klangschichten einzeln schaltbar und regelbar** im Overlay: MOTOR, MUSIK, JINGLE mit je
  einem Regler. Der Motor startet jetzt bei der ersten Geste selbst — vorher musste man den
  Schalter finden, deshalb war die V8-Schleife nicht zu hören.
- **Mini-Radio ohne Animation**: kein Zustandswechsel am Knopf, keine Hover-Farbe.
- **Spuren lückenlos und länger**: 132 Stützstellen alle 0,42 m ergeben rund 55 m Spur. Vorher
  wurde das Sichtfenster mit dem Tempo zusammengezogen — dabei brach die Spur sichtbar ab.
  Jetzt entscheidet das Tempo, OB eine Spur da ist, nicht wo sie aufhört: unter 6,5 m/s blendet
  sie aus und die Vorgeschichte wird verworfen.
- **Kamera-Kollision**: ein Strahl vom Fahrzeug zur Wunschlage; ist der Weg verstellt, rückt die
  Kamera bis 1,2 m vor das Hindernis nach, nie näher als 3,5 m ans Fahrzeug.
  Zwei Befunde dabei: `structure-soffit` fehlte in der Ausnahmeliste, also klemmte die Kamera
  unter dem eigenen Rheindeck fest — und wie schon beim Streckenscan wurde nur der ERSTE
  benannte Vorfahre geprüft statt der ganzen Kette.
- **Alle Durchfahrten vermessen** (`stage.measurePassages()`): ein Tunnel von 120,1 m Länge,
  Breite 12,7–16,2 m, Lichte 11,5 m; acht Tore mit 9 m Lichte. Screenshot-Beweise der
  Durchfahrt liegen in `screenshots/0*-passage.png` und `0*-cam.png`.

## Fünfzehnte Runde

- MOTOR stand doppelt im Overlay, DICE war verschwunden und sein Handler war toter Code.
  DICE ist zurück in der Schalterreihe, MOTOR sitzt einmal bei MUSIK und JINGLE.
- **Das Overlay dieser Runde hatte ich nicht nachgemessen.** Weiß auf `#279797` ergab 3,52:1,
  auf `#fb3233` 3,75:1 — bei 11 px und Fettschnitt gilt 4,5:1. Genau dieselbe Fehlerklasse wie
  beim Tacho eine Runde zuvor; ein Element zu reparieren und den Rest nicht nachzumessen ist
  der eigentliche Fehler. Aktivfarben auf gemessene Tafeltöne abgedunkelt.
  Nachgemessen: CHASE 8,88, DRIVE/TRAILS 5,28, DONUT 6,29, DICE 13,72.

## Sechzehnte Runde

- **Den DICE-Knopf zurückzusetzen war nicht der Fix.** `diceBg`, `diceFg` und `onToggleDice`
  waren beim Austausch gegen MOTOR aus `renderVals()` verschwunden — ohne sie bleiben die
  Löcher unaufgelöst, der Knopf trägt Browser-Chrom und der Klick bindet an nichts.
  Wieder ergänzt und diesmal über die WIRKUNG geprüft: der Klick kippt
  `kfb-dice-companion.visible` von false auf true.

## Siebzehnte Runde · Tore, zweiter Anlauf

- **Ich hatte zweimal daneben gegriffen und beim zweiten Mal etwas Neues erfunden, statt das zu
  nehmen, was schon funktioniert.** Der Brückenbogen der Hohenzollernbrücke — parabolischer
  Bogen aus kurzen Segmenten mit Kämpferauflagern — war die ganze Zeit da. Die Tore tragen
  jetzt genau diese Konstruktion, auf Bandbreite gespannt und in Palettentönen. Kein neues
  Formvokabular.
- **Die Ziellinie ist jetzt eine Textur AUF dem Band**, kein Stapel schwebender Plättchen: ein
  Streifen, der Breite und Überhöhung folgt, mit UV-Koordinaten und nahtlos gekacheltem
  Schachbrett (2 × 2 Zellen, RepeatWrapping — der Übergang kann gar nicht sichtbar werden).
- **Hänger entfernt.** Übernommen hatte ich sie mit dem Bogen; an einer Brücke tragen sie die
  Fahrbahn, an einem Tor standen sie als sechs Säulen quer im Fahrweg. Ein Tor ist eine
  Durchfahrt, kein Hindernis.

## Achtzehnte Runde

- **3D-Ziffern raus.** Low-Poly-Zahlen aus einem Platformer-Kit, nie für diese Entfernung
  gedacht — aus der Verfolgerkamera lasen sie unsauber. Der Countdown sitzt jetzt im HUD, in
  derselben Bangers-Schrift wie der Tacho, farbig über die Tempo-Rampe, mit Aufploppen und
  Kippen je Ziffer und einem roten GO! am Ende.
- **Der wackelnde Kopf war die Uhr.** Sie steht in Bangers, und Bangers hat keine
  Tabellenziffern — die Breite ändert sich mit jeder Ziffer, und der zentrierte Kopf rutschte
  jedes Bild mit. Linker und rechter Block haben jetzt feste Breiten (118 und 132 px), damit
  die Mitte stillsteht.

**Not done**
- Option A. Not started, its board not opened.
- Vehicle cartoon deformer wiring, AI opponents, Fernsehturm, mosque, Autobahnkreuz, rail mode, Almanac capture pipeline.
