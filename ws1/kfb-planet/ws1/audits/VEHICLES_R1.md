# VEHICLES R1 · 14 Racer, Heldenfarbe, Front-Scheinwerfer, kfb-groundfx · WS1d · 22.10.2026

**Register:** V-631 (Fahrzeuge), V-632 (kfb-groundfx). **Branch:** `ws1/vehicles-r1` im Spiel-Repo (Basis `ws1/mvp-r1`). Kein Merge, Einbau über den Lead.
kfb-groundfx ist schon vorab in `ws1/mvp-r1` (@1116dcb, Lead) – Disco läuft darauf.

## Kurz
- **Alle 14 Dieselpunk-Racer sind im Spiel wählbar:** an der Startseite (Feld „Fahrzeug“) und im Auto mit **V** (Umschalt+V zurück). Der Wechsel geschieht an Ort und Stelle, schon geladene Racer kommen aus dem Speicher.
- **Heldenfarbe** wie in der Probe: Lackflächen in KFB-Rot, blankes Rost-/Messing-Metall bleibt.
- **Front-Scheinwerfer** an allen 14: Glas-Glühen, Lichtkegel und Lichtfleck auf dem Gelände, keine echten Lichter. Farbe aus der Antriebsfarbe. Kosten 0,015–0,04 ms je Bild.
- **kfb-groundfx:** ein Modul für Kegel, Pfütze und Ring auf dem Gelände, mit Mischer für Scheinwerfer, Laternen, Disco und Boombox. 16 große Effekte kosten 0,45 ms, typisch 0,38 ms.
- **fps:** alle 14 nachts fahrend bei 60 fps (Bildrate des Prüfrechners), Scheinwerfer an und aus ohne messbaren Unterschied.

## Prüfbilder
- Kontaktbogen 14 × Tag | Nacht (mit Scheinwerfern): [sheet.jpg](img/vehicles-r1/sheet.jpg)
- Scheinwerfer nachts am Hang (Steigung 40 %): [hang-night.jpg](img/vehicles-r1/hang-night.jpg), [hang-night-side.jpg](img/vehicles-r1/hang-night-side.jpg)
- groundfx auf welligem Gelände (Hang links, Mulde Mitte, Kante rechts): [Kegel](img/vehicles-r1/groundfx-cone.jpg), [Pfütze](img/vehicles-r1/groundfx-pool.jpg), [Ring](img/vehicles-r1/groundfx-ring.jpg)
- 30-s-Fahrclips je neuer Klasse, nachts (lokal, nicht im Repo): `test/out/vehicles/clip-rad-racer.webm` (Düsen-Limousine), `test/out/vehicles/clip-laster.webm` (Rost-Laster); Endbilder [Rad-Racer](img/vehicles-r1/clip-rad-racer-end.jpg), [Laster](img/vehicles-r1/clip-laster-end.jpg)
- Ferne-Aufhellung am Spielabstand: [Standard](img/vehicles-r1/far-near.jpg), [ganz herausgezoomt](img/vehicles-r1/far-out.jpg)
- Startseite mit Fahrzeug-Wahl: [start-select.jpg](img/vehicles-r1/start-select.jpg)

Alle Bilder mit `look=terrain3`, `world=probe`, headless (Metal-GPU). Hinweis: Das Spiel kennt keinen Sonnenhöhen-Regler; „Sonne 12°“ aus der Probe ist im Spiel nicht einstellbar. Tag = Standard-Stimmung mesa, Nacht = `tod=night`.

## 1 · Racer
| Klasse | Racer | Fahrphysik |
|---|---|---|
| Schwebe-Racer (9) | 01 Messing-Coupé, 02 Flammen-Dragster, 03 Donner-Jet, 04 Graffiti-Kreuzer, 05 Eisen-Phantom, 06 Panzer-Gleiter, 09 Rost-Runner, 11 Flossen-Kreuzer, 13 Straßen-Biest | K2B wie abgenommen (V-251), Verformung CAR_CHILL_LIGHT |
| Rad-Racer (3, neu) | 08 Düsen-Limousine, 10 Rostfeuer-Muscle, Ödland-Käfer | K2B, Räder auf dem Boden (Darstellung um die Fahrhöhe tiefer), CAR_CHILL_LIGHT |
| Laster (2, neu) | 07 Abschlepp-Koloss, 12 Rost-Laster | K2B, Räder auf dem Boden, Verformung SPACE_HAULER |

- **Karte je Racer** in `src/data/vehicles/kfb-vehicle-rig.r1.json`: Maße, Schwebe- bzw. Radpunkte, Kamera, Düsen, Antriebsfarben, Klasse (`class`, `wheels`), Verformungsprofil (`deform`), Scheinwerfer-Anker (`headlights`). Quelle: Probe (`port/vehicle-rig-extra.r1.json`, `port/headlight-anchors.r1.json`), Klasse aus `<id>.kfb-vehicle.v3.json`.
- **Kein Neubau der Fahrphysik.** Die Klasse wählt nur vorhandene Werte: Verformungsprofil aus `deformer-profiles.json` (SPACE_HAULER ist dort als „nicht abgestimmt“ markiert) und die Radlage.
- **Modelle** werden wie bisher von der öffentlichen kayfabizarro-Adresse am Commit 9bd8e037 geladen, auf der Site über `/raw`.
- **Laden ohne Ruckler:** Look und Heldenfarbe rechnen in Häppchen (≤ 6 ms), danach Texturen einzeln und Shader vorab, erst dann erscheint der Wagen. Alte Antriebs- und Scheinwerfer-Materialien gehen 3 s später, damit der neue Wagen die fertigen Shader übernimmt.
  - Gemessen (zwei Läufe, ohne Slot, Rechnerlast 25–31): Zurückwechseln auf einen geladenen Racer 18–19 ms längstes Bild, 0 neue Shader (beide Läufe).
  - Erstladen: im ruhigeren Lauf meist 21–39 ms, im voll ausgelasteten Lauf 60–116 ms. Ausreißer beim ersten Laden: Ödland-Käfer bis 196 ms (eigene Leucht-Textur, 2 neue Shader-Varianten) und Abschlepp-Koloss 117–290 ms (8 Varianten).

## 2 · Heldenfarbe
- **Georg 22.10.: Standard ist für alle 14 die Originalfarbe, die Heldenfarbe ist eine Einstellung.**
  - Startseite, Zeile „Fahrzeugfarbe“: Original | Heldenfarbe. Gemerkt je Browser (`localStorage kfb.heroColor`).
  - Der Schalter färbt geladene Racer sofort um (Ereignis `kfb:hero`). Fehlt die Umrechnung, läuft sie in Häppchen nach.
  - Hash `hero=1` bzw. `hero=0` überschreibt (Tests).
  - Der Ödland-Käfer ist damit wieder rostig-orange.
  - Test: `vehicles-r1 data` (Standard aus, an/aus im Spiel) und `start` (Schalter, Speicher, `hero=1`).
- 1:1 aus der Probe in `src/look/vehicleLook.js` (`applyHeroColor`): Flächenmaske statt Pixel, Rost-/Bronze-/Messing-Lack (Farbton 15–50°, Sättigung < 0,3) bleibt.
- Umgefärbt: 02, 03, 04, 11, 13, Ödland-Käfer. Metall bleibt: 01, 05, 06, 07, 08, 09, 10, 12.
- **Ferne-Aufhellung nachgemessen:** Am echten Spielabstand steht die Kamera 6,8 m (Standard) bis 18,9 m (ganz herausgezoomt) vom Wagen. Die Aufhellung beginnt erst bei 13 m und ist bei 78 m voll. Im Spiel liegt sie also bei 0,80 bis 0,82 und ist praktisch aus. Sie wirkt nur bei fremden Wagen in der Ferne.
  - Vorschlag: Soll der eigene Wagen herausgezoomt heller werden, Bereich auf 8–40 m setzen (`VEHICLE_LOOK.near/far`). Das braucht Georgs Blick.

## 2a · Machart R3 (Georg 22.10. nach Kritiker R3): Originalanmutung + Knet-Zusätze · **Standard**
- **Georg:** „Möglichst die Originalanmutung erhalten … Was wir selbst aufsetzen, bekommt Knet-Look oder wird etwas matter. Nicht versuchen, die Racer in Claymation zu setzen.“
- **Karosserie:** Originaltextur (Look A wie abgenommen) ohne Umtönen und ohne kfb-clay-Relief; die Heldenfarbe bleibt Einstellung (Startseite).
  - `vmatte=1`: leicht matter (Metall 0,15, Rauheit ≥ 0,68, Spiegelung 0,55), Farbe unangetastet. A/B: [matte-ab.jpg](img/vehicles-r1/matte-ab.jpg).
  - Mein Urteil: Standard ohne `vmatte`, der Unterschied ist klein und die Originalanmutung ist der Wunsch. Georg entscheidet.
- **Eigene Zusätze in Knete:**
  - Knet-Flamme (R3: weiche Tonübergänge, helle Oberseite = Volumen, durchscheinender Rand statt Kontur, schwacher Glutkern als Licht)
  - Knet-Lüfter (dunkler Rotor) mit Leuchtring
  - Knet-Funken (kleine feste Krümel)
- **Schalter:** `vclay=body` = alte Voll-Knete zum Vergleich, `vclay=0` = alles original (Leucht-Fahnen).
- **Kohärenz:** [look-sheet.jpg](img/vehicles-r1/look-sheet.jpg). 4 Racer (Flammen-Dragster, Donner-Jet mit Lüftern, Ödland-Käfer, Rost-Runner) × Tag/Gold/Nacht × Spielkamera nah | Fahrt | Übersicht. Startseite: [look-start.jpg](img/vehicles-r1/look-start.jpg).
- **Tests:** data PASS in allen drei Stufen (Standard, `vclay=body`, `vclay=0`; neu rigStylePerMode), start/unit/contract-static PASS.

## 2b · Knet-Stufe der Racer (jetzt nur noch `vclay=body`, Vergleich) (V-654 C5 „eine Machart“) · **Standard an (Georg 22.10.)**, `vclay=0` = Original
- **Georg 22.10.:**
  - Knete ist Standard.
  - Der Käfer behält mehr Originalfarbe: `clayTone` in seiner Rig-Karte (hueShift 0,15, lShift 0, greySat 0,8, lift 0,1, sat 1,4).
  - Die Lüfter werden auch Knete, der Leuchtring bleibt als Effekt. Ein heller Knet-Rotor wirkte wie eine Radkappe, deshalb ist der Rotor dunkel, mit drei Tonstufen; der additive Ring liegt darüber.
  - Hinweis: Das Blau der Käfer-Reifen im Original ist zum großen Teil Himmelsspiegelung auf Metall. Matte Knete wirkt deshalb dunkler.
- **Was:** Racer in Knet-Machart (Standard). `vclay=0` zeigt das Original.
  1. **Umtönen** (`prepVehicleClay`, in Häppchen beim Laden): Die Textur wird in 5 Farbgruppen zerlegt. Bunte Gruppen rücken in Farbton und Buntheit 50 % zur nächsten Rolle der Biom-Palette, graue nur leicht getönt; die Helligkeit bleibt beim Wagen („Meshy nur leicht tönen“, Gebiet 6). Kein Weichzeichnen: Meshy-Atlanten bestehen aus winzigen UV-Inseln.
  2. **kfb-clay** (vendor 1:1): Profil `vehicle` (= midground), Maßstab FB-Höhe, Palettenzug 0,12. Ein Programm für alle Racer; nur Racer mit eigenen Leucht- oder Normal-Texturen bringen beim Erstladen Varianten mit, die das Vorwärmen vorher übersetzt.
  3. **Knet-Flamme** (vehicleRig `style: 'clay'`): eine Tropfen-Masse mit wandernden Beulen, 3 Tonstufen, normal geblendet mit Tonemapping. Keine Schockdiamanten, kein Glühkern (Gebiet 11).
- **Heldenfarbe** in der Knet-Stufe: Die Lackgruppe wird KFB-Rot (gleicher Schalter auf der Startseite).
- **Leistung:** Zurückwechseln 56–60 ms ohne neue Shader (Einzeltest unter Last). Gefunden und behoben: Klonen kopierte das von kfb-clay in `userData` abgelegte Original-Material per JSON, samt Textur (≈ 600 ms je Racer). Jetzt liegt der Verweis in einer WeakMap.
- **A/B für Georg:** [vclay-ab.jpg](img/vehicles-r1/vclay-ab.jpg) (Spielkamera bei Gas, Tag/Gold, Flammen-Dragster, Donner-Jet mit Lüftern, Panzer-Gleiter, Ödland-Käfer).
- **Offen:** Sollen alle Knet-Racer insgesamt heller werden (matt statt Metallglanz)? Das wäre ein Wert für alle (`VCLAY.lift`).

## 3 · Front-Scheinwerfer
- Modul aus der Probe 1:1 (`src/look/kfb-headlights.v1.js`), dazu eine dünne Hülle (`src/look/headlights.js`): Farbraum unter r186 (Kegelfarbe als sRGB ausgegeben, gleiches Bild wie die Probe) und Maße im Spielmaßstab.
- Lichtfleck über kfb-groundfx, Kanal `headlights`, mit Vorrang vor allen anderen.
- **Tageslicht:** aus der Tageszeit des Licht-Rigs (Nacht 0, Gold 0,35, Tag 1).
  - `HEADLIGHTS.daylight` und `HEADLIGHTS.dark` sind Haken für die Biom-Fahrt (Uhr, Tunnel, MIB). WS1b setzt sie nach dem Einbau.
  - Schalter `hl=0` schaltet die Scheinwerfer ab.
- **Anker halbautomatisch:** 8 von 14 stehen auf „im Rig-Studio prüfen“ (01, 03, 04, 05, 06, 08, 11, 13); auf dem Kontaktbogen steht es je Racer dabei. **Georg 22.10.: alle 8 PASS, Tune später** (Unterlage [VEHICLES_R1_ANKER.md](VEHICLES_R1_ANKER.md)).

## 4 · kfb-groundfx (V-632)
- **Datei:** `src/look/kfb-groundfx.v1.js` (THREE injiziert, ohne React), Spiel-Instanz `src/look/groundFx.js`.
- **Formen:** `cone` (Kegel-Projektion, Rechnung wie kfb-light-pool.v1), `pool` (Pfütze senkrecht von oben), `ring` (Ring von oben).
- **Werte je Eintrag:** Anker, Farbe, Stärke, Form, Reichweite, Radius, Breite. Zeitkurven laufen auf der CPU (`curves`, `createRingEmitter`).
- **Ring-Geber für Boombox-Ringe:** liest `musicPulse()` von WS-Audio (kick, bass, energy.rhythm01; Zwischenringe auf dem Schlag nur bei confidence01 > 0,5).
- **Mischer:** `gfxChannel('headlights' | 'lanterns' | 'disco' | 'boombox').set(list)`, zusammen 16 Plätze. Vorrang: Scheinwerfer 3, Laternen und Disco 2, Boombox 1. Bei Gleichstand gewinnt der nähere zur Kamera.
- **Im Geländeshader:** `M1World.LightPools` hängt die Effekte jede Sekunde an Gelände, Weg, Laternen, Obstgarten und Fundstücke (MeshStandard, nach terrain3). Laternen laufen jetzt als Kanal `lanterns` (gleiche Rechnung). m1-terrain.js und terrain3.js sind unverändert.
- **Kosten:** Eine Gitter-Karte (64 × 64 Zellen über 128 m um die Kamera) merkt je Zelle die treffenden Plätze. Pixel ohne Effekt rechnen fast nichts. Vorher kostete die reine Schleife über 16 Plätze ≈ 3,7 ms.

| Messung (Test-Slot, 1440×900, A/B im Wechsel) | Auflösung ×1,25 (Standard) | Auflösung ×2 |
|---|---|---|
| 16 große Effekte über das ganze Bild | +0,45 ms | +0,91 ms |
| typisch: 2 Scheinwerfer + 6 Pfützen + 4 Ringe | +0,38 ms | – |
| 16 Effekte außerhalb des Bildes | +0,14 ms | – |

Budget ≤ 0,5 ms ist bei Standard-Qualität eingehalten. Bei ×2 liegt es darüber; „Scharf“ (×1,5) ist nicht gemessen und liegt vermutlich knapp darüber.

## 5 · fps-Tabelle (nachts, fahrend, 1280×720, Standard)
| Racer | Klasse | fps an | ms p95 an | fps aus | ms p95 aus | Scheinwerfer CPU ms |
|---|---|---|---|---|---|---|
| 01 Messing-Coupé | Schwebe | 60 | 17.8 | 60 | 17.7 | 0.023 |
| 02 Flammen-Dragster | Schwebe | 60 | 17.6 | 60 | 17.7 | 0.019 |
| 03 Donner-Jet | Schwebe | 60 | 17.9 | 60 | 17.6 | 0.019 |
| 04 Graffiti-Kreuzer | Schwebe | 60 | 17.8 | 60 | 17.8 | 0.020 |
| 05 Eisen-Phantom | Schwebe | 60 | 17.7 | 60 | 17.7 | 0.018 |
| 06 Panzer-Gleiter | Schwebe | 60 | 17.6 | 60 | 17.7 | 0.027 |
| 07 Abschlepp-Koloss | Laster | 60 | 17.6 | 60 | 17.5 | 0.021 |
| 08 Düsen-Limousine | Rad | 60 | 17.6 | 60 | 17.6 | 0.020 |
| 09 Rost-Runner | Schwebe | 60 | 17.7 | 60 | 17.7 | 0.020 |
| 10 Rostfeuer-Muscle | Rad | 60 | 17.5 | 60 | 18.0 | 0.019 |
| 11 Flossen-Kreuzer | Schwebe | 60 | 17.7 | 60 | 17.5 | 0.016 |
| 12 Rost-Laster | Laster | 60 | 17.5 | 60 | 17.4 | 0.015 |
| 13 Straßen-Biest | Schwebe | 60 | 17.2 | 60 | 17.0 | 0.019 |
| Ödland-Käfer | Rad | 60 | 17.0 | 60 | 17.0 | 0.017 |

Die Bildzeit ist an die Bildwiederholrate gebunden (60 Hz headless). Die reinen GPU-Kosten stehen in Abschnitt 4. Clips: 1800 Bilder in 30 s, Median 16,7 ms, p95 17,5 ms.

## 6 · Blinder Kritiker (Sub-Agent, nur der Kontaktbogen)
- **Tag:** Die Wagen sind detailreich und attraktiv. Stark sind 02 Flammen-Dragster, 07 Abschlepp-Koloss (Kran), 10 Rostfeuer-Muscle (Flammen), 12 Rost-Laster und der Ödland-Käfer.
- **Größte Punkte:**
  1. **Nacht:** In der Kachel (seitlich, weit weg) sind die Lampen am Wagen kaum zu sehen. Der Lichtfleck ist groß und hart und beginnt mit einer Lücke vor dem Wagen. Er wirkt „aufgeklebt“.
  2. **Zu ähnlich:** sechs rote (Heldenfarbe) und fünf graue Wagen; 08/09 und 04/13 lassen sich verwechseln.
  3. **Schweben kaum sichtbar** bei 01, 03, 05, 11, 13. 13 wirkt eingesunken.
  4. **Lichtfarbe** mal warm, mal kühl (Käfer, 04). Das ist gewollt (Antriebsfarbe, V-385), wirkt aber uneinheitlich.
- **Mein Abgleich:**
  - Punkt 1: Teils liegt es an der Kameralage (Gläser leuchten nach vorn, die Kachel schaut von der Seite). Teils sind es die Probe-Werte: Der Lichtfleck zielt 11 m vor die Lampe, der Bereich davor bekommt nur den schwachen Kegel. Vorschlag zur Abnahme: `poolDist` 11 → 7 m und Fleck etwas weicher.
  - Punkt 2 folgt aus der Heldenfarbe (Brief). Unterscheidung über die Antriebsfarbe der Lichter ist da.
  - Punkt 3: Schwebehöhe wie abgenommen (V-251). Mehr Abstand wäre eine Georg-Entscheidung.

## Tests
- `node test/unit/vehicleRig.mjs`: PASS (6er-Werte + alle 14, Scheinwerfer-Anker, 5 Radfahrzeuge).
- `PW_GPU=1 node test/groundfx.mjs`: PASS (Kegel, Pfütze, Ring hellen an Hang, Mulde und Kante auf; Mischer). Mit `GFX_COST=1` (nur im Slot) kommt die Kostenmessung dazu: Standard PASS, ×2 FAIL (0,91 ms).
- `PW_GPU=1 node test/vehicles-r1.mjs data`: PASS (14 laden, Scheinwerfer, Räder, Heldenfarbe, Profil je Klasse, Zurückwechseln ohne neue Shader und < 100 ms). `start`: PASS. `sheet`, `clip`, `fps`: PASS (Slot).
- `contract-static` PASS, `r1a` PASS, `vlook` PASS, `unit-lanterns` PASS.
- Keine volle Reihe gelaufen (Absprache Lead).

## Offen
1. ~~Scheinwerfer-Anker abnehmen~~ – Georg 22.10.: PASS, Tune später.
2. **Georg/WS0:** Nachtbild der Scheinwerfer (Kritiker Punkt 1): `poolDist` 7 m statt 11 m? Ferne-Aufhellung auf den Spielabstand (8–40 m)?
3. Erstladen mit neuen Shader-Varianten (Käfer bis 196 ms, Abschlepp-Koloss bis 290 ms unter Volllast). Wenn nötig: alle 14 im Leerlauf nach dem Start vorwärmen.
4. Bei `tod=night` bleibt der Himmel in terrain3 hell (pfirsichfarben), nur das Gelände wird dunkel (siehe Clip-Endbild). Nicht Fahrzeug-Bereich, Hinweis an Licht/Himmel.
5. groundfx-Budget bei „Scharf“/×2 über 0,5 ms. Falls nötig: Pfützen bei hoher Auflösung halb so oft je Pixel rechnen oder max. 12 Plätze.
6. SPACE_HAULER-Profil ist in der Vorlage „nicht abgestimmt“. Die Laster nutzen es wie vorhanden.
