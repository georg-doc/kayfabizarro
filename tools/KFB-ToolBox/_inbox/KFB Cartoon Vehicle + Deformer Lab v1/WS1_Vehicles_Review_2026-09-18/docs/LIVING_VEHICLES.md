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

**B2 · Space Base Bits liegt nicht im Registry und ist im Browser nicht ladbar.** Das Registry
indiziert `media/2D_Assets` und `media/3D_Assets` von kayfabizarro; das Pack liegt in
KFB-Stunt-Car-Race. Suche nach `space_base`/`spacebits`/`spacetruck`: null Treffer in 1494
Dateien. Der RAW-Abruf auf KFB-Stunt-Car-Race scheitert im Browser (gemessen: fetch error auf
`main`), und eine Kopie im Projekt hilft nicht — die `.bin`-Puffer der glTF lassen sich mit den
Werkzeugen nicht ablegen. **Abhilfe, die Georg entscheiden muss:** die drei Fahrzeuge als `.glb`
nach `kayfabizarro/media/3D_Assets` legen. Eine Datei ohne Sidecar, öffentlich abrufbar, danach
im Registry indiziert — und dann fällt die Zeile in der Werkbank von »fehlt« auf »pinned«.
Die Zeilen stehen bis dahin mit `available: false`, Grund und Abhilfe im Tooltip.

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
