# RETURN · Rauch weich ausblenden (Soft Particles) R1 (Agent für WS0, 24.11.2026)

**Zweig:** `ws0/rauch-soft-r1` @ `6421cb25` (sechs Commits ab Stamm @b6d746fc), gepusht nach origin, nicht gemergt. Kein `src/private` im Zweig (diff-tree geprüft).

**Ergebnis:** Gebaut, geschaltet und im Spiel belegt. Beim Fahrzeug-Staub wirkt es klar: Staub-Puffs stehen nicht mehr als Scheibe mit gerader Kante vor dem Wagen. Beim Lok-Dampf und beim Jetpack-Start ändert sich im Bild nichts, weil der Rauch dort keinen Körper berührt (gemessen über eine ganze Runde der Bahn). Die Blind-Kritik bleibt FAIL: Runde 1 5,4, Runde 2 5,6 (nötig 8). Bildzeit: Meist +0,4 bis +0,9 ms. In einer von sechs Ansichten (Jetpack dreiviertel) kommen aber reproduzierbar +6 bis +11 ms dazu, Ursache offen (Punkt 8.1).

## 1 · Bestand und Absicht
- **Bestand:**
  - `src/modules/dustTrail.js`: Puff-Material `createDustPuffView` (Tiefentest an, schreibt keine Tiefe, weich am Boden über die Höhe).
  - Nutzer: Jetpack (`createThrustSmoke`), Weihnachts-Bahn (`rauch`-Hook in M1World), Fahrzeug-Staub (`createDustTrail` in M2Car), Wasser-Fahnen.
  - Tiefentextur gibt es nur in der HDR-Naht `src/look/feuerNaht.js` (Feuer näher als 70 m oder Elements).
  - Übernommen: Material, alle Sätze, Farben und Mengen unverändert. Neu: die Tiefenquelle `src/look/rauchTiefe.js`.
- **Absicht gespiegelt:** Rauch soll wie eine Wolke im Raum wirken. Wo er einen Körper oder den Boden berührt, blendet er weich aus, statt als Scheibe davor zu stehen. Genre: Cartoon-Action, Claymation-Vordergrund.

## 2 · Was gebaut ist
- **Schalter `rauchweich=r1`** in `src/flags.js` (owner WS0, status pruefen, nicht in Testfahrt oder Release).
  - Ohne Schalter bleiben Shader-Text, Uniforms (Reihenfolge), Material-Haken und Zeichenzustand bytegleich. Das prüft der Unit-Test.
  - Mit Schalter, aber ohne Tiefe in einem Bild rechnet das Material genau wie vorher (`uTiefeAn = 0`). Das gilt für Aqua (keine Quelle gesetzt), andere Kameras, Ortho, Würfel-Ziele und abgeschaltete Quelle. Die Lage-Rechnung im Vertex-Shader ist Zeichen für Zeichen dieselbe, es kommen nur zwei Varyings dazu.
- **Puff-Material** (`dustTrail.js`, nur Variante mit Schalter):
  - Deckkraft × smoothstep(0, Übergang, Szenenabstand − Puffabstand) entlang der Blickachse.
  - Übergang = `weich` × Puff-Radius. Das Satz-Feld `weich` ist optional, Standard `RAUCH_WEICH_K = 0,5`.
  - Die Tiefe wird als fernstes von 2 × 2 Texeln abgetastet. So blendet an Umrissen nichts falsch aus. Mit einem einzelnen Texel entstand an Fensterrahmen ein gezackter dunkler Saum.
  - Der Wirt reicht die Quelle mit `setRauchTiefe(createRauchTiefe())` herein. Das steht in M1World direkt nach `WEIHNACHT_ON`, nur mit Schalter, dazu `__kfbRauchWeich` unter `debug`.
- **Weg der Tiefe** (`src/look/rauchTiefe.js`, angehängt an `scene.onBeforeRender` hinter den vorhandenen Haken, also mit der Kamera, die wirklich zeichnet, auch der Beleg-Kopie):
  1. **naht:** Zeichnet das Spiel gerade in ein Ziel mit Tiefentextur (feuerNaht), wird diese Tiefe beim ersten Puff mit `copyTextureToTexture` (blit, gleiche Größe und Format) kopiert. Danach wird das Ziel der Naht wieder gebunden. Kein Neuzeichnen, kein Umbau der Naht.
  2. **vorstufe:** Sonst gibt es eine Tiefen-Vorstufe direkt vor dem Bild, aber nur, wenn lebende Puffs sichtbar sind:
     - dustTrail meldet die Hülle der lebenden Puffs, gerechnet wie im Vertex-Shader plus Übergang. Liegt die Hülle nicht im Sichtkegel, entfällt die Vorstufe.
     - Gezeichnet werden Stellvertreter in einer eigenen Szene. Sie teilen Geometrie und Instanzen mit dem Original, ihre Lage kommt je Bild aus der Weltmatrix. Dabei laufen keine Spiel-Haken, keine Schattenkarte, kein Hintergrund und keine zweite Welt-Matrix-Rechnung.
     - Nur undurchsichtige Netze, deren Hüllkugel den Rauch-Raum berührt, und nur mit mindestens 5 cm Radius.
     - Eingebaute Materialien, auch mit Knet-`onBeforeCompile`, zeichnen mit `MeshDepthMaterial` ohne Farbe, mit Alpha-Test und Verschiebungskarte, wo vorhanden. ShaderMaterial ohne Licht zeichnet mit sich selbst ohne Farbe.
     - Geskinnte Figuren sind standardmäßig aus (`figuren: false`, siehe 8.1).
     - Volle Auflösung, Schere auf den Bildausschnitt der Hülle, Ferne 80 m. Die Kandidatenliste wird alle 30 Vorstufen neu gesammelt.
     - Optionen (`aufloesung`, `fern`, `klein`, `eigen`, `naht`, `figuren`) sind zur Laufzeit über `quelle().setze()` änderbar. `info()` zeigt Weg, Züge und die CPU-Aufteilung.
- **Prüfhilfen:**
  - `test/_rauch-weich-beleg.mjs`: Beleg, Deckungs-Alpha, Kanten Schnitt/Umriss, Tiefenbild, gepaarte Bildzeit, Kosten-Diagnose.
  - `test/unit/rauchWeich.mjs`: 22 Prüfungen, darunter Bytegleichheit ohne Schalter, Quelle, Hülle und Tiefe → Abstand mit Ansichtsversatz und gekappter Ferne.

## 3 · Messung (Spiel-Look, Split-Build `KFB_SPLIT=1 --base=./`, Release-Hash + `rauchweich=r1`, Uhr gehalten)
Vorher und nachher stammen aus derselben Seite im selben Augenblick mit derselben Kamera (`belegVideo` seite und dreiviertel). Vorher = Quelle aus, dann rechnet das Material wie ohne Schalter.

**Kantenprüfung im Still:**
- Gemessen wird die Rauch-Deckung als Alpha-Bild: Szene ohne Puffs gegen Szene mit weißen Deckungs-Puffs.
- „Kante“ = Nachbarpixel mit einem Deckungssprung über 0,12.
- Getrennt wird nach der Szenentiefe an beiden Pixeln:
  - Schnitt: auf einer durchgehenden Fläche, also Rauch schneidet eine Fläche.
  - Umriss: an einem Tiefensprung, also ein Körper steht vor dem Rauch.

Werte aus `belege_r5`:

| Szene/Ansicht | Kanten | Schnitt (größter Sprung) | Umriss | Deckung |
|---|---|---|---|---|
| Staub seite | 1348 → 1306 | 156 → 516 (0,157 → 0,262) | 1192 → **790** | −4,4 % |
| Staub dreiviertel | 2038 → **1579** | 325 → 328 (0,171 → 0,457) | 1713 → **1251** | −2,6 % |
| Jetpack seite | 65 → 65 | 0 → 0 | 65 → 65 | ±0 |
| Jetpack dreiviertel | 154 → 154 | 6 → 6 | 148 → 148 | ±0 |
| Bahn abends seite | 0 → 0 | 0 | 0 | ±0 |
| Bahn abends dreiviertel | 0 → 0 | 0 | 0 | ±0 |

Der Weg „naht“ (volle Tiefe aus einem Ziel mit Tiefentextur) liefert dieselben Werte: Staub dreiviertel 2038 → 1614, Deckung 96491 → 93895.

Früherer Staub-Augenblick (`belege_r2`, Fahrt): Kanten 1596 → 895 (seite) und 1435 → 1282 (dreiviertel). Der Staub im Wageninneren und auf Dach und Heckflügel entfällt.

**Bildzeit:**
- Gemessen wird Zeichnen + 1 Pixel zurücklesen, Median aus 120 Dreiergruppen aus/an/aus, mit Gegenprobe aus/aus.
- Der Rechner war die ganze Zeit von anderen Programmen mit GPU-Last belegt: Ride-Agent, Chrome, Firefox, Claude-App. Ein Bild kostete dabei 21–46 ms.

| Ansicht | Vorstufe (Gegenprobe) | Naht | CPU der Vorstufe |
|---|---|---|---|
| Staub seite / dreiviertel | +0,9 / +0,65 (−0,4 / −0,2) | +0,85 / +0,75 | 0,67 / 0,54 ms |
| Jetpack seite / dreiviertel | +0,4 / **+6,05** (0,1 / 0) | +1,25 / +0,9 | 0,39 / 0,44 ms |
| Bahn seite / dreiviertel | +0,4 / +0,9 (0,6 / 0,6) | +0,4 / +0,6 | 0,42 / 0,42 ms |

- CPU-Aufteilung (Staub): Hülle 0,02 ms, Sammeln 0,24 ms, Zeichnen 0,15 ms.
- Ohne Schalter kostet es nichts (bytegleich).

**Ergebnis:** +1 ms ist in 5 von 6 Ansichten eingehalten. In „Jetpack dreiviertel“ nicht, siehe 8.1.

## 4 · Jetpack-Regression
- Jetpack-Paare sind vorher/nachher pixelgleich (größte Abweichung 1–2 von 255, Kritiker-Prüfsumme).
- Der Düsenrauch bleibt in Form, Farbe und Menge unverändert.
- Die harten Kanten am Jetpack sind Umrisse: Schuh und Bein stehen vor dem Rauch und verdecken ihn richtig.
- Seitenfehler 0.

## 5 · CI, Rauchtest, Build
- **CI** (`node scripts/ci/run.mjs`, Endstand): **233 Tests, grün 230, bekannt rot 2** (audioMixer, deps wie im Stamm), **Rückfall 1: `begegnungTaktung`**.
  - Der Test läuft in den 180-s-Deckel. Einzeln braucht er unter Last 183 s und ist grün.
  - Er importiert nur `begegnungTakt.js` und `taktWaechter.js`, also nichts aus diesem Zweig. Es ist eine Last- bzw. Laufzeitfrage, siehe 8.8.
  - Dazu kommt der neue Unit-Test `rauchWeich` (grün).
- **Rauchtest** `PW_GPU=1 node test/_smoke-hashes.mjs rauchweich=r1`: Testfahrt, Slice und beide mit Schalter grün, 0 Seitenfehler.
- **Build:** `npx vite build` (`KFB_SPLIT=1 --base=./`) mehrfach grün.
- **Unit** `node test/unit/rauchWeich.mjs`: PASS.

## 6 · Belege (`replies/RAUCH_SOFT_R1/_privat/`)
- **`belege_r5/`** (Endstand, Code @`b5161624`): je Szene `*_seite|dreiviertel_vorher|nachher.png`. Dazu je Paar:
  - `*_ausschnitt.png`: Vergrößerung, links vorher, rechts nachher
  - `*_deckung_vorher|nachher.png`: Alpha-Bild
  - `*_tiefe_vorstufe|naht.png`: Tiefe, die das Material bekam
  - `messung_*.json`: Rohdaten, Zeit, fehlende Dateien
- Bester Staub-Beleg: `staub_dreiviertel_ausschnitt.png` (r5). Vorher steht ein senkrechtes Dunstband mit gerader Kante vor der Tür, nachher sind Tür und „27“ frei.
- `belege_r1` bis `belege_r4`: Zwischenrunden. Runde 1 hatte halbe Auflösung mit Treppen an Fensterrahmen, Runde 3 Übergang 1 × Radius mit −20 % Staubdeckung.

## 7 · Kritik-Verlauf (frischer Kritiker je Runde: ABSICHT, GENRE, Belege, Messprotokoll, Prompt, Matrix; D/F/G n/a)

| Runde | Belege | A | B | C | E | H | Mittel | wichtigste Befunde → Reparatur |
|---|---|---|---|---|---|---|---|---|
| 1 | r2 | 5 | 5 | 5 | 6 | 6 | 5,4 | nur Staub verändert; Konsole „ERR_FILE_NOT_FOUND“; Jetpack dreiviertel +11 ms; Bahn ohne Kontakt; Staubkanten an der Wagenkontur → Kanten nach Schnitt/Umriss getrennt, Augenblick der Bahn nach Kontakt über das ganze Bild gesucht, Stoß-Staub am stehenden Wagen, Ursache der +11 ms gesucht |
| 2 | r5 | 6 | 5 | 5 | 6 | 6 | 5,6 | Dunstband vor der Tür weg (besser); neue Schnittsprünge am Fensterrahmen bis 0,46; Bahn und Jetpack pixelgleich; lila Puffs (Trümmer-Kugeln, nicht dieses Modul) hart; Wagen schwebt über weißer Leere |

Runde 3 habe ich nicht gestartet. Die übrigen Blocker liegen außerhalb dieses Auftrags (siehe 8.2 bis 8.5) und lassen sich im Puff-Material nicht lösen. Eine dritte Runde hätte die Plateau-Regel ausgelöst.

## 8 · Offene Punkte
1. **Bildzeit in „Jetpack dreiviertel“: +6 bis +11 ms (vier Läufe: 11,2 / 10,8 / 10,2 / 6,1).**
   - Gemessen:
     - Die Vorstufe allein (mit eigenem Rücklesen) kostet dort nur 1–2,6 ms.
     - Erst das Bild danach wird langsamer, auch ohne Abtasten der Tiefe („ohne_abtasten“ 5,6–9,4 ms).
     - Eine leere Vorstufe kostet nichts.
     - Ohne geskinnte Figuren ging es im Diagnose-Lauf auf −0,1 ms zurück, im nächsten Lauf mit `figuren: false` aber wieder auf 6 ms.
     - Wird die Knochen-Textur nicht neu hochgeladen, ändert sich nichts.
   - Vermutung: Die zusätzliche GPU-Übergabe gerät unter fremder GPU-Last in eine Wartereihe. Belegt ist das nicht.
   - Der Weg „naht“ kostet in derselben Ansicht +0,9 ms.
   - Vorschlag: Messung auf einem freien Rechner (Mac mini) wiederholen. Bleibt es, mit `naht: 'vorstufe'` gegenprüfen oder die Vorstufe auf Puff-Sätze mit Bodenkontakt beschränken (Staub, Bahn).
2. **Bahn (Weihnachten):** Der Dampf berührt über eine ganze Runde (48 Augenblicke) weder Schneemann noch Sessel noch einen anderen Körper. Die Deckung ändert sich höchstens um 0,8 von rund 1300. Der Eindruck „Rauch zieht durch Schneemann und Sessel“ aus R5/R6 kommt also nicht von einer Schnittkante. Der Dampf steht von der Kamera aus richtig vor oder hinter den Körpern. Soft Particles ändern daran nichts. Für mehr Wirkung bräuchte es Anordnung oder Rauchweg (Weihnachts-Owner), nicht das Material.
3. **Neue Schnittsprünge am Fensterrahmen des Wagens** (bis 0,46): Hinter der Scheibe liegt Dunst, an der Rahmenkante wird der Übergang im Bild sehr kurz, weil die Fläche schräg steht. Das ist kontrastarm, aber sichtbar in der Vergrößerung. Hebel: Übergang länger (dann weniger Staubdeckung, bei 1 × Radius −20 %) oder ein Mindestübergang in Pixeln. Nicht gebaut.
4. **Beleg-Bühne Staub:** Der Wagen kippt nach `moveTo` auf den gewählten ebenen Platz. In der dreiviertel-Ansicht sieht man unten die weiße Fläche unter der Welt. Die Fahrt-Variante (`STAUB_FAHRT=1`) liefert je nach Gelände selten Kontakt. Ein fester Fahrzeug-Belegplatz fehlt.
5. **Konsole:** 10–12 „ERR_FILE_NOT_FOUND“ je Lauf. Es sind Dev-Server-Pfade (`@kfb-audio`, `@kfb-cast`), Kartenpakete, `h15/` und ein HeyGen-Video im `file://`-Build, in vorher und nachher gleich. Mit dem Rauch haben sie nichts zu tun, sie fallen bei jedem Split-Build-Beleg an. Seitenfehler 0.
6. **Geskinnte Figuren** bekommen das weiche Ausblenden nur über den Weg „naht“ (bei Feuer), in der Vorstufe nicht (`figuren: false`). Einschalten mit `quelle().setze({ figuren: true })`.
7. **Kein Handy-Beleg.**
8. **CI-Laufzeit:** `placeField`, `begegnungTakt` und `begegnungTaktung` liefen im ersten CI-Lauf unter Last in den 180-s-Deckel. Einzeln sind sie grün (26 s / 252 s / 183 s). Sie hängen nicht an diesem Zweig.
