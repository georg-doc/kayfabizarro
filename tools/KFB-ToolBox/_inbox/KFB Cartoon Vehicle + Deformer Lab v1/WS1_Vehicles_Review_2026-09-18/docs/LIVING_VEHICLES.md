# LIVING · Fahrzeug-Linie (lab-v7)

*Stand-Dokument dieser Linie, neben `LIVING_RIGGING.md` (Carl/Gesicht). Module: `lab-v7/`.*

## Übergabe

```
Zuletzt passiert   18.09.2026 · Session-Cut. Die dritte Runde (Georgs Sichtprüfung) ist
                   abgearbeitet: sieben Befunde behoben, darunter die mitrotierende Tür am
                   Police Car. Housekeeping, Changelog und zwei Übergaben geschrieben.
Als Nächstes       Sichtabnahme · Georg sieht die zwölf Sequenzen an. Ohne sie lässt sich
                   kein Profil abstimmen, und jede weitere Zahl wäre geraten.
So wird gearbeitet Die Strecke besitzt Physik und Lage, diese Werkbank besitzt die Sicht
                   darauf. Keine zweite Fahrphysik. Der Deformer liest Telemetrie und
                   schreibt nur in eigene Presentation-Knoten. Räder werden gefunden, nicht
                   erfunden — findet sich nichts, steht 0 im Bericht. Blickrichtung und
                   Orientierung sind Schalter mit Gedächtnis, keine Messungen. Eine Zahl
                   ohne Messung kommt nicht ins Rig.
```

Aktuelle Oberfläche: `KFB Cartoon Vehicle Deformer Lab.dc.html`.
Zeitachse: `CHANGELOG.md`. Rückmeldung: `RETURN_cartoon_vehicle_deformer.md`.
Übergaben: `HANDOVER_RACE_2026-09-18.md`, `HANDOVER_WSA_LEAD_2026-09-18.md`.

## Auftrag und was daraus wurde

Georg, 17.09.: das KayKit-Space-Base-Bits-Pack aufnehmen, die enthaltenen Fahrzeuge mit
Cartoon-Deformern und Fahrphysik für Speed-Race-Tracks vorbereiten. Nachtrag im selben Zug:
»nimm dann bitte die vehikel-assets aus dem json von hier« (Asset Librarian) — Track und
Teststrecke baut Georg selbst (`kfb-hub/stunt-race/track-lab-v062`).

Damit ist die Arbeitsteilung entschieden, und sie deckt sich mit dem Skill (§8.3): **die Strecke
besitzt Physik und Lage, diese Werkbank besitzt die Sicht darauf.** Es wird hier keine zweite
Fahrphysik gebaut. Die Naht ist eine Telemetrie-Funktion.

## Drei Befunde, die den Auftrag verändert haben

**B1 · Das Pack hat genau DREI Fahrzeuge.** `spacetruck`, `spacetruck_large`,
`spacetruck_trailer`. Die anderen 54 glTF sind Basismodule, Container, Terrain, Tunnel,
Landepads, Felsen, Solarpanels, Windturbinen. Gemessen über `github_search_code` im
gltf-Ordner — die Baumabfrage listet `.gltf` nicht (bekannte Falle, CLAUDE.md).

**B2 · Space Base Bits war nicht ladbar — seit 18.09. erledigt.** Der Befund vom 17.09. galt für
den alten Ort: das Pack lag in KFB-Stunt-Car-Race, der RAW-Abruf scheiterte dort, und eine Kopie
ins Projekt half nicht, weil die `.bin`-Puffer nicht mitkommen. Jetzt liegt das Pack in
`kayfabizarro/media/3D_Assets/KayKit_Space_Base_Bits_1.0_FREE` und ist im Registry-Pack
`kaykit-space-base-bits-1-0-free` indiziert. Byteweise geprüft am 18.09.: drei glTF
(10917/10963/10945 B), drei `.bin` (49524/67708/32656 B), eine Textur (25749 B) — alle im selben
Ordner, also löst der Loader die relativen `uri` von der RAW-Adresse aus auf, wie bei den City
Builder Cars. Pin: `eb48f50489b9e4903ec1e3d2fb1837605ce7d792`, aus dem Registry-Pack gelesen.
Nicht als `.glb` umgebaut — der Umweg war nur nötig, solange das Repo falsch war.
Zur bekannten Falle: die Ordneransicht zeigt die drei glTF weiterhin nicht. Gefunden wurden sie
über die Byte-Abfrage auf den Pfad (CLAUDE.md).

**B3 · Die Registry-Fahrzeuge sind die tragfähige Quelle.** 22 Fahrzeuge aus drei Packs, alle
über die gepinnte RAW-Adresse des Registry-Commits `34cde3f8f752d481a03c9714f1c3b3a8b2c15c46`
ladbar und gemessen: kenney-car-kit (10), kenney-toy-car-kit (8), kenney-racing-kit (4).

## Entscheidungen

**V1 · Räder werden gefunden, nicht erfunden.** Zwei Wege in dieser Reihenfolge: benannte
Radknoten, sonst Inseln (Union-Find über auf 0,5 mm verschweißte Positionen). In **beiden** Wegen
gilt dieselbe Formprüfung — fünf gemessene Bedingungen (`WHEEL_RULE`). Findet sich nichts, meldet
die Werkbank `0 Räder` und sagt, dass nichts erfunden wird.

**V2 · Ein Name ist ein Hinweis, die Form ist der Befund.** Die erste Fassung glaubte dem Namen:
`raceCarRed` lieferte damit **12 Räder**, weil das Pack Felge, Reifen und Nabe je einzeln als
Radknoten benennt. Jetzt wird zusätzlich die Form geprüft und **koaxial verschmolzen** (x und z
innerhalb 60 % des Radradius = eine Nabe). Gegengemessen: `raceCarRed · 4 Räder (node) · r 0,141 ·
Spur 0,57 · Radstand 0,80`.

**V2a · Die Dicke-Schwelle gilt nach Weg getrennt (18.09., `carrig.v2.js`).** Die Formprüfung
verlangte überall »Achse mindestens 1,5 × dünner als der Raddurchmesser«. `spacetruck_large`
fällt damit durch — 0,1620 u Breite gegen 0,2280 u Durchmesser, Verhältnis 1,407. Vier benannte,
gespiegelte, bodenberührende Radknoten wurden verworfen, weil das Fahrzeug dicke Räder hat.
Im **Knoten**-Weg genügt jetzt 1,3: der Autor hat die Knoten selbst `wheel_front_left` genannt,
und die vier bestätigen sich gegenseitig (Spiegelung in x und z, Bodenkontakt, gleicher Radius).
Im **Insel**-Weg bleibt 1,5, weil dort nur die Form spricht und eine dicke Scheibe auch ein
Kotflügel sein kann. Ein Würfel liegt bei 1,0 und fällt weiter durch. Nachgemessen: raceCarRed
bleibt bei 4 Rädern, das Skateboard ehrlich bei 0.

**V3 · Alles wird in EINEN gemessenen Raum gebacken.** y = 0 ist der Radaufstandspunkt (Unterkante
der Räder, nicht des Fahrzeugs — ein tiefer Frontsplitter hätte sonst den Boden bestimmt), x/z ist
die Fahrzeugmitte. Grund: der Deformer-Shader rechnet in **Objektkoordinaten**. Die erste Fassung
hängte Knoten um und rechnete Weltmatrizen gegeneinander — das Fahrzeug fiel auseinander, weil die
Matrizen der frisch gebauten Drehpunkte noch nicht aktualisiert waren. Dieselbe Lehre steht in
`kfb-cartoon-deform.js`, wo alle Teilnetze in den Wurzelraum gebacken werden, damit sie EINE Box
teilen. Gebacken wird in eine **Kopie** der Geometrie; die Quelldatei bleibt unberührt.

**V4 · Der Deformer fasst nur die Karosserie an.** Ein Rad, das mit der Karosserie staucht, liest
als Skalierungsfehler, nicht als Gummi. Räder bleiben rund und stauchen nur am Aufstandspunkt
(`WheelRig.setSuspension`, Höhe gibt nach, Breite bleibt).

**V5 · Starre Lage gehört der Gruppe, weiche Form dem Shader.** Nicken, Rollen, Gieren, Höhe sind
Gruppentransformationen (und damit später Physik-Eingaben); Squash, Stretch, Banane und
Verwringung sind Shader-Uniforms. Ein Sicht-Offset überschreibt nie eine Physik-Position (Skill
§8.3).

**V6 · Keine Zufallswerte am Fahrzeug.** Der Prop-Verbieger zieht seine Form aus einem Seed, damit
alle Fässer anders krumm sind. Ein Fahrzeug wird krumm, **weil etwas passiert ist** (Skill §1.1).
Die Pose kommt aus Telemetrie oder aus einer Fixture, nie aus `mulberry32`.

**V7 · Die Blickrichtung ist ein Schalter, keine Messung.** Kein Modell gibt sie her. Vorgabe +z,
`Flip` kehrt sie um — das entscheidet, welches Radpaar lenkt und in welche Richtung die Räder
laufen. Ein roter Pfeil auf der Bühne zeigt sie an. (Georgs Track Lab hat aus demselben Grund
einen FLIP-Knopf.)

**V8 · Der Regler hält die Fixture an.** Ein Standbild einer laufenden Choreografie ist nicht
reproduzierbar (Skill §12.3). Scrubben friert ein, `Play` läuft weiter, nach Ablauf kehrt jede
Fixture in den **Ruhezustand** zurück — nicht in ihr letztes Bild.

## Was gebaut ist

| Datei | Rolle |
|---|---|
| `lab-v7/registry-vehicles.v1.js` | Fahrzeugliste, aus den Registry-Pack-JSONs gezogen. Gepinnte RAW-Adressen, Bytes, Abhängigkeitsstand. Space-Base-Bits-Zeilen mit Grund und Abhilfe. |
| `lab-v7/carrig.v1.js` | Vermessen und riggen: Inseln, Radsuche (Knoten/Inseln + Formprüfung + koaxiale Verschmelzung), Backen in den Fahrzeugraum, Drehpunkte steer → susp → spin, `WheelRig`. |
| `lab-v7/cardeform.v1.js` | Cartoon-Deformer für Karosserien: Squash gegen den Aufstandspunkt, Stretch längs, Banane über s², Verwringung. Technik aus `kfb-cartoon-deform.js`, Anker und Achsen neu. |
| `lab-v7/fixtures.v1.js` | Fünf Fixtures mit Phasen und Millisekunden nach Skill §11: Start, Sprung, Landung, Kurve, Notbremse. Jede nennt ihren erwarteten Haupt-Read. |
| `KFB Cartoon Vehicle Deformer Lab.dc.html` | **Die aktuelle Werkbank.** Elf Briefing-Knöpfe plus Retrigger- und Ruhe-Test, Profile, Signal-Regler, Flip und Orient mit Gedächtnis. |
| `lab-v7/vehicle-cartoon-deformer.v2.js` | **Der aktuelle Deformer.** Gruppen und Springs statt Shader. |
| `lab-v7/fixture-adapters.v2.js` | **Die aktuelle Fixture-Liste.** 43 Fahrzeuge, aus Handoff und Registry generiert. |
| `KFB Vehicle Lab v1.dc.html` | **überholt.** Erste Werkbank. DocCheck-Rahmen (R12: Bühne bleibt neutral), Fahrzeugliste, Deformer-Regler, Fixtures mit Zeitregler, Fahrt-Regler, Messblende hinter »i«, Export. |

**Telemetrie-Naht für das Track Lab:**
`window.__vlab.setTelemetry({ speed, steer, pitch, roll, lift, squash, stretch, bend, twist, susp, scrunch })`
— `speed` in Fahrzeuglängen/s, Winkel in Grad, `lift`/`susp` in Fahrzeughöhen, Pose-Werte −1…1 als
Anteil der Deformer-Grenzen. Dazu `hold(id, ms)`, `fixture(id)`, `load(id)`, `rest()`, `config()`.

**Export:** `kfb.vehicle-actor/0.1` — gemessene Fakten, Blickrichtung, Deformer-Grenzen und
Fixture-Tabelle. Kandidat, nicht Wahrheit: die Strecke validiert die Laufzeit.

## Gemessene Zahlen (Auszug)

```
race                 4 Räder (node) · r 0,300 · Spur 1,00 · Radstand 1,52
raceCarRed           4 Räder (node, aus 12 koaxial verschmolzen) · r 0,141 · Spur 0,57 · Radstand 0,80
vehicle-monster-truck 4 Räder (node) · r 0,188 · Spur 0,44 · Radstand 0,50
spacetruck (gelesen)  5 Netze · 4 benannte Radknoten · r 0,0877 · Spur 0,344 · Radstand 0,427 ·
                      Karosserie 0,489 × 0,893 u   — Datei nicht ladbar, siehe B2
Registry             34cde3f8f7 · 13 338 Assets · 102 Packs
```

## Zweite Runde · 17.09. abends · das Briefing aus dem Race-Chat

Georg hat drei Fehler gemeldet und ein Briefing nachgeschoben
(`_handover/CLAUDE_DESIGN_CARTOON_VEHICLE_DEFORMER_BRIEF_2026-09-17.md`), dazu den
Asset-Handoff `kfb-race-track-asset-handoff-generic-runtime.json`. Das verschiebt die Linie
an drei Stellen.

**Q1 · Der Handoff ist ab jetzt die Quelle, nicht das Registry.** `kfb.asset-handoff.v1`,
sourceCommit `10a7fdce6b`, 141 Assets — das ist der Satz, den Race wirklich benutzt. Er sagt
selbst, was er ist: `selectionStatus: candidate-only`,
`suitabilityDecision: owned-by-receiving-consumer`. `lab-v7/fixture-adapters.v2.js` ist daraus
generiert, nicht getippt: 43 Fahrzeuge, 25 aus dem Handoff, 18 aus dem Registry, jede Zeile mit
ihrer Herkunft. Befund dabei: der Handoff enthält aus `kenney_car-kit` nur Karts und Trucks,
nicht die Straßenwagen, die v1 aus dem Registry zog. Beide Quellen bleiben, getrennt gekennzeichnet.

**Q2 · Kein Vertex-Shader mehr.** Das Briefing verlangt ausdrücklich »keinen Softbody-/Vertex-/
Lattice-Overkill«, sondern nested Groups, bounded non-uniform scale und gedämpfte Springs.
`vehicle-cartoon-deformer.v2.js` ist so gebaut. `cardeform.v1.js` (Shader) ist damit überholt und
bleibt nur als Nachweis liegen. Preis: die Bananen-Biegung ist entfallen, sie stand in keinem
Briefing-Kanal. Gewinn: Räder bleiben planiert, und ein Fixture-Wechsel kann keinen Uniform-Zustand
mitschleppen.

**Q3 · Fixtures sind nicht mehr Keyframes, sondern Signale.** `fixtures.v1.js` schrieb Posen über
Millisekunden-Stützwerte. Das war rückwärts: im Briefing-Modell erzeugt Fahrphysik Bedeutung und
das Cartoon-System choreographiert die Reaktion. Jetzt ziehen kontinuierliche Ursachen an
Spring-Zielen (daraus entstehen Load und Follow-through von selbst) und Ereignisse setzen einen
Spring-Impuls (daraus entstehen Impact, Overshoot und Settle von selbst). Die zwölf Sequenzen in
`TEST_SEQUENCES.json` sind nur noch synthetische Signalverläufe, keine Posen.

### Die drei gemeldeten Fehler

**F1 · kenney-toy-car-kit war falsch herum.** Bestätigt an Georgs Aufnahme: die Heckschürze zeigte
zum Fahrtrichtungspfeil. Die Gruppe steht jetzt auf `facing: -1`. Blickrichtung bleibt eine
ANNAHME, keine Messung — kein Modell gibt sie her. Neu: der Flip merkt sich die Korrektur je
Fahrzeug im Browser, damit sie nicht zweimal gemacht werden muss.

**F2 · Die KayKit City Builder Cars fehlten.** Sie waren die ganze Zeit im Registry
(`kaykit-city-builder-bits-1-0-free.json`) — meine Ordnerabfrage hat sie nicht gezeigt, weil
Verzeichnislisten `.gltf` nicht zuverlässig listen. Genau die Falle aus CLAUDE.md, und ich bin
hineingelaufen, weil ich der Liste geglaubt habe statt nach dem Inhalt zu suchen. Alle fünf sind
jetzt drin und geladen.

**F3 · Die Poly-Cars von Google fehlten.** Ebenfalls drin: Go-Kart, Taxi, Wagon, Police Car, dazu
Kart by Ben Harrison, Go Kart by Zsky, Police Car by Kay Lousberg, Skateboard.
Dabei zwei neue Befunde, beide gemessen:
- **Poly-Assets sind Z-up.** Der Taxi richtet sich über `upFix` auf (Hülle höher als lang).
  Beim Go-Kart greift die Messung nicht: 33,9 hoch gegen 39,5 lang — nach der Hüllbox liegt er
  flach und steht trotzdem auf der Nase. Eine Hüllbox kann das nicht von einem legitim hohen Mech
  unterscheiden, also wird nicht geraten: es gibt einen `Orient`-Knopf in 90°-Schritten, der sich
  je Fixture merkt.
- **Maßstäbe klaffen um Faktor 100.** car_hatchback Radstand 0,50, Poly-Taxi 37,1. Dem Deformer
  gleichgültig (alles rechnet in Anteilen der gemessenen Maße), einer gemeinsamen Strecke nicht.

### Was vom Briefing NICHT geht

**KayKit ActionFigure / Rig_Medium ist nicht im Handoff.** Briefing-Fixture 3 (Skateboard + Rider)
ist damit nicht baubar. Nächstliegende gerigte Figuren im Satz: `Astronaut_*` (43 Joints,
18 Clips), `Mech_*` (13 Joints, 17 Clips) — beide keine ActionFigure. Als offener AssetRef
zurückgemeldet, wie das Briefing es verlangt, statt ersatzweise etwas anderes zu nehmen.

Vollständige Rückmeldung mit IMPLEMENTED / STATIC TESTED / BROWSER TESTED / OPEN:
`RETURN_cartoon_vehicle_deformer.md`.

## Dritte Runde · Georgs Sichtprüfung 17.09. 22:0x

Sieben Befunde am Bild, und fast alle hatten EINE Ursache: die Insel-Radsuche nahm jede
scheibenförmige Insel für ein Rad. Beim Poly-Police-Car waren das 15 »Räder« — und weil die
Türplatte als Rad geriggt wurde, **rotierte die Tür bei ACCEL mit**. Das ist der Unterschied
zwischen einer falschen Zahl und sichtbar falscher Bewegung.

**V9 · Räder kommen paarweise.** Drei gemessene Bedingungen zusätzlich zur Form: GEGENSTÜCK auf
der anderen Fahrzeugseite bei gleichem z und gleichem Radius (±25 %), BODENKONTAKT auf derselben
Höhe wie die übrigen (innerhalb 15 % der Fahrzeughöhe), GLEICHE GRÖSSE (±35 % um den Median).
Eine Tür hat kein Gegenstück, ein Scheinwerfer trägt nicht, ein Zylinder hat den falschen Radius.
Police Car 15 → 4, Wagon 10 → 4. Bleibt nichts übrig, steht 0 im Bericht.

**V10 · Die Kamera folgt nicht der Blickrichtung.** Ihre z-Lage war mit `facing` multipliziert —
darum wurden die toy-cars nach rechts gezeigt und alle anderen nach links, obwohl beide richtig
ausgerichtet waren. Georgs Befund »korrekt ausgerichtet, aber andere Ansicht« war genau das.

**V11 · Near und Far kommen aus der Modellhülle.** Feste 0,01/200 gegen Modelle zwischen 0,5 und
43 Einheiten: beim Herauszoomen wurde der Go-Kart abgeschnitten.

**V12 · Sechs Orientierungen statt vier.** Der Schalter drehte nur um die Querachse. Assets, die
auf der SEITE liegen, waren damit unheilbar — vier Vierteldrehungen können nur die Hälfte der
Fälle heilen.

**Abgelesen und je Zeile eingetragen** (Sichtprüfung, nicht Messung): `Kart by Ben`,
`vehicle-monster-truck` und `vehicle-truck` auf −z; `Wagon` auf X−90°.

**Der Go-Kart von Poly bleibt offen.** Alle sechs achsenparallelen Lagen durchgemessen, keine
richtet ihn auf. Das Modell ist nicht achsenparallel autoriert und braucht eine freie Rotation im
Asset selbst. Ein Schalter in der Werkbank kann das nicht heilen — als offener AssetRef gemeldet,
statt eine Lage zu setzen, die auch falsch ist.

**Drehende Räder am Board** gehen nicht: das Skateboard ist ein verschweißtes Einzelnetz, die
Inseltrennung kann die Rollen nicht herauslösen. Es bräuchte benannte Rollenknoten im Asset.

## Offen

- **Abnahme durch Georg:** Grenzen des Deformers (`squash .22 · stretch .16 · bend .10 · twist 10°`)
  sind konservative Startwerte, keine Urteile. Regler stehen.
- **Der Insel-Weg ist nicht an einem echten Fall geprüft.** Alle drei Kenney-Packs benennen ihre
  Radknoten; der Rückfall ist gebaut und läuft, aber ungemessen.
- **Kein Ton, keine Kamera, kein VFX.** Skill §15 verlangt die Reihenfolge: erst die Choreografie.
  Impact-Burst, Staub, Lautwort und Kamera-Shake sind der nächste Schnitt — und der Skill deckelt
  sie (ein Haupt-Read, ein Lautwort, ein Kamera-Griff).
- **Trailer-Nachlauf** ist nicht gebaut; es fehlt die Quelle (B2) und die Entscheidung, ob der
  Nachlauf zum Zugfahrzeug gehört oder ein eigener Actor ist.
- **Fixtures sind noch nicht als Bildreihe abgenommen.** Belege liegen unter
  `screenshots/01-cvd-*.png` und `02-cvd-*.png`: Sprung-Einschlag, Kurve, Squash über
  Telemetrie, drei Fahrzeuge.
  *NACHTRAG 18.09.: hier stand `screenshots/v7-0*`. Den Pfad gibt es nicht — beim Schreiben
  aus dem Gedächtnis benannt statt nachgesehen. Regel: ein Pfad im Stand-Dokument wird
  abgefragt, nicht erinnert.*

## Vierte Runde · 18.09. · Session-Cut

Kein Bau. Housekeeping und Übergabe:

- `CHANGELOG.md` angelegt — additive Zeitachse über alle Sessions des Projekts, nicht nur
  dieser Linie. Bisher lag die Zeitachse verstreut in vier Handover-Dateien.
- `HOUSEKEEPING.md` um die `lab-v7`-Artefakte erweitert: Status je Datei, Clean Run,
  Pfad-Hygiene, Cleanup-Kandidaten. Der Check-in vom 12.09. bleibt unverändert stehen.
- `HANDOVER_RACE_2026-09-18.md` — die Naht, und sechs Punkte, die beim Race-Chat liegen
  (Signalvertrag, ActionFigure, Go-Kart, Rollerskate/Skateboard, Maßstab, Mech-Fixture).
- `HANDOVER_WSA_LEAD_2026-09-18.md` — Stand, die drei Abhängigkeiten außerhalb dieses Chats,
  und zwei Regeln, die über die Linie hinaus gelten (Rad-Paar-Regel, Ereignis-Energie aus der
  Zielabweichung statt aus der Amplitude).

**Nichts gelöscht.** Die Cleanup-Kandidaten stehen benannt in `HOUSEKEEPING.md` und warten
auf Freigabe, einzeln.

## Fünfte Runde · 18.09. · drei Motion-Familien

Gebaut, in Georgs Reihenfolge: Schlingern, dann Manöver und Zwei-Rad-Schräglage. Ausführlich mit
allen Messreihen in `CHANGELOG.md`; hier nur, was für jeden weiteren Bau an dieser Linie gilt.

**V6 · Jede Familie besitzt genau EINE Gruppe, und die Schichtung ist die Reihenfolge der
Besitzverhältnisse.** Von innen nach außen: Deformer (Pose, `responseRoot` + `shellRoot`) →
Schlingern (Gier um die Vorderachse) → Zwei-Rad (Kippen um die Aufstandslinie) → Manöver (Weg
über den Boden). Keine Familie fasst die Gruppe einer anderen an, alle Lenkanteile werden
addiert statt gesetzt. Das ist der Grund, warum das Fahrzeug an einer Bande entlangFAHREN und
dabei gekippt stehen kann, ohne dass eine der Bewegungen von der anderen weiß.

**V7 · Ein Manöver erfindet keine Deformation, es erzeugt Signale.** `speed`, `longAccel` und
`lateral` kommen aus einem kinematischen Einspurmodell auf dem gemessenen Radstand; der Deformer
verbraucht sie unverändert. `longAccel` wird differenziert, nicht geschrieben — deshalb taucht die
Nase beim Anfahren im Rückwärtsgang nach vorn, ohne dass das irgendwo eingestellt wäre. Wer eine
weitere Fahrfigur baut, baut sie als Weg und nicht als Pose.

**V8 · `rig.frame` mischt zwei Bezugssysteme. `contactY` ist VOR dem Einbacken gemessen,
`height` danach.** Im Rig-Raum liegt der Boden auf genau **0**. Wer `frame.contactY` als Höhe
einer Drehachse nimmt, dreht um eine Achse unter dem Asphalt — passiert in zwei Familien
unabhängig, sichtbar nur in der mit dem großen Winkel. Beide korrigiert.

**V9 · Ein gerolltes Rad steht auf seiner Kante.** Der Hebel gegen das Umfallen ist
(Spurweite + Radbreite)/2, nicht die halbe Spurweite. Aus zwei Schräglagen ergab sich zweimal
unabhängig dieselbe Radbreite, nachgemessen am Rig bestätigt. Gilt für jede Bewegung um eine
Aufstandslinie.

**V10 · Beweisgriffe gehören in die Werkbank, nicht in den Kopf.** `window.__cvd` hat jetzt
`paint()`, `stepMs(ms)`, `ticks()`, `seqState()` und `camState()`. Grund: in einem unsichtbaren
Rahmen hält der Browser `requestAnimationFrame` an, und drei Prüfrunden gingen auf die Suche nach
einem Fehler, den es nicht gab. Eine Aufnahme ohne eigenen Bildstempel beweist nichts.

**V11 · Neue Module werden mit Abrufstempel importiert (`?r=N`).** Ein überschriebenes Modul bleibt
im Zwischenspeicher liegen, und die Seite läuft still mit der alten Fassung — in dieser Runde
einmal voll hineingelaufen, obwohl die Regel in `CLAUDE.md` steht.

### Neu offen aus dieser Runde

- **Fassrolle** — gebaut, siehe `CHANGELOG.md`. Erledigt.
- **Türen öffnen · GEMESSEN, Entscheidung offen.** Georgs Frage vom 18.09. Acht Fixtures
  durchgesehen (car-hatchback, car-police, truck, firetruck, garbage-truck, van, suv, spacetruck):
  **kein einziges Modell hat einen Türknoten.** Die Kenney- und KayKit-Packs bestehen aus 6–8
  Knoten, nämlich Karosserie plus vier Räder; kein `door`, `hood`, `trunk`, `window`, `seat`.
  Die Poly-by-Google-Modelle sind noch weiter weg: ihre Netze heißen `Object003_1 … _6` und sind
  nach MATERIAL getrennt, nicht nach Bauteil — die Insel-Radsuche findet dort Platten, aber keine
  Türen. EIN Fund gegen den Trend: `garbage-truck` bringt `arm`, `body` und `trash` als eigene
  Knoten mit, also einen echten beweglichen Aufbau.
  Vorschlag ohne Bastelei (Cartoon-Logik, keine neue Geometrie, gilt für alle 46 Fixtures):
  die **Klappkarosserie** — der ganze Aufbau schwenkt um die gemessene untere Seitenkante der
  Karosseriehülle nach oben, Räder bleiben stehen. Liest als Cockpit-Haube. Zweite, noch
  billigere Variante: das Fahrzeug **duckt sich** zur Ausstiegsseite (kann der Deformer schon) und
  die Figur poppt heraus. Beides braucht Georgs Urteil, welcher Read gewollt ist.
- **Räder umklappen für Flug-/Drive-Mode · machbar ohne neue Geometrie.** Das Rad-Rig hat je Rad
  schon drei geschachtelte Gruppen: `steer` (y) → `susp` (y-Versatz) → `spin` (x). Eine Drehung
  der `steer`-Gruppe um **z** um 90° stellt die Radachse von quer auf senkrecht — die Scheibe
  liegt dann waagerecht und dreht um die Hochachse, also als Rotor. `susp.position.y` senkt sie
  unter den Aufbau. Ein Faktor 0–1 fährt Klappwinkel, Fahrhöhe und Schubneigung gemeinsam und
  gibt den fließenden Übergang. Noch nicht gebaut, noch nicht abgenommen.
- **VFX-Quelle geprüft.** `media/3D_Assets/FX_Visual` enthält **keine 3D-Effektnetze**, nur 2D:
  `kenney_smoke-particles/PNG` in fünf Ordnern (Black smoke 25, White puff 25, Explosion 9,
  Fart 9, Flash 9) als EINZELBILDER — direkt als Billboard-Sprites verwendbar, kein Zuschnitt
  nötig. `explosions_smoke` liefert dagegen GEPACKTE Spritesheets, deren Bildlagen in einer
  `.plist` stehen (siehe `explosion_smoke_HowTo_v01.md`); die müssten erst zerlegt werden.
  Folge: alle Effekte dieser Linie sind kamerazugewandte Billboards, keine Volumen. Für Cartoon
  ist das richtig, es muss nur vorher gesagt sein.
- **Kupplungskette** — unsichtbare Kupplung mit Kupplungspunkt vorn und hinten je Fahrzeug, dann
  Wiederholung der Naht für Ketten beliebiger Länge.
- **Die Zahlen der neuen Familien sind an EINEM Fahrzeug gemessen** (car_hatchback, Profil
  CAR_CHILL_LIGHT). Ableitung und Geometrie sind fahrzeugunabhängig, die Abnahme ist es nicht:
  der Monster-Truck kippt später, das Skateboard hat keine Spurweite, und der Trailer hat keinen
  Antrieb für einen Gangwechsel.
- **Die drei Fahrweisen sind gesetzt, nicht gemessen.** Tempo und Standzeit beim Gangwechsel sind
  der Charakter der Bewegung und gehören Georg, nicht der Ableitung.

**V12 · Ein Vorzeichen, das an zwei Stellen gebraucht wird, wird EINMAL abgeleitet.** Der
Drehpunkt einer Kippbewegung muss dem VORZEICHEN DES WINKELS folgen, nicht der Absprungseite.
Derselbe Fehler trat in zwei Familien unabhängig auf und wurde in der zweiten beim ersten Versuch
nur für eine Drehrichtung behoben.

**V13 · Eine Abnahme an einem Fahrzeug ist keine Abnahme.** Die Fassrolle war an car_hatchback
sauber und zog an `race` und `vehicle-monster-truck` die Räder unter den Boden — nicht wegen eines
Vorzeichens, sondern wegen eines VERHÄLTNISSES (breite Spur gegen kleinen Hub). Jede neue Familie
wird ab jetzt über mindestens sechs Fixtures abgetastet, darunter die Ausreißer nach oben
(`race`, `truck`) und nach unten (`car-hatchback`, `kart-oobi`).

**V14 · Die Bodenfreiheit ist eine Untergrenze, keine Flugbahn.** Eine gewünschte Wurfhöhe wird
gegen den je Frame gerechneten nötigen Hub gemaxt, und die Gipfelhöhe hat eine gemessene
Untergrenze aus dem eigenen Drehradius. Das ist zugleich der richtige Read: ein breites Fahrzeug
muss höher springen, um sich zu überschlagen.

**V15 · Radmaße werden über ALLE Räder gemessen.** `rig.report.wheelWidth` ist die Breite des
ersten Rades. `vehicle-drag-racer` hat vorn schmale und hinten breite Räder; die äußerste
Laufflaechenkante ist `max(|x| + Breite/2)` über alle vier.

**V16 · Eine abgeleitete Zahl wird über ihren BEREICH belegt, nicht an einem Punkt.** Die
Landestärke der Fassrolle war ein Festwert (16 von 16 Messungen exakt 0,35), obwohl der Kommentar
eine Ableitung behauptete — Gipfel und Flugzeit standen unabhängig an der Stärke und kürzten sich
in der Aufsetzgeschwindigkeit weg. Wer eine Größe ableitet, tastet sie über mehrere Stärken ab
und belegt die SPANNE. Eine Zahl, die immer gleich ist, ist keine Ableitung.

**V17 · Eine Wurfbahn hat eine Schwerkraft, nicht zwei unabhängige Regler.** Gipfel und Flugzeit
sind dieselbe Größe: Gipfel = g·t²/8. Wird eines von beiden gesetzt, folgt das andere — sonst
sinkt die wirksame Schwerkraft mit der Stärke und die Aufsetzgeschwindigkeit bleibt flach.
