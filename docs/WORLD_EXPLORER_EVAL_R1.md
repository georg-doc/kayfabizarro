# World Explorer als Spender für die Endlos-Welt · Evaluierung und Konzept-Entwurf R1

Stand 26.10.2026 · WS1 Lead · Entwurf für Georg und WS0 · kein Bauauftrag

**Quelle:** `axieyangb/world-explorer` @e149dd5 (25.10.), MIT, © 2026 Jerry Xie; three r161, ohne Build-Schritt.
- Code gelesen (Lead-Stichproben und vollständiger Audit durch einen Hilfsagenten, nur gelesen, nichts ausgeführt; 154 JS-Dateien, ~76 000 Zeilen, keine Tests im Repo).
- Abgeglichen mit WS0s Spender-Notiz R7 (`planning/kfb-procedural-world-composition-wfc-osm-2026-10-24` @dbd05a05, PR #447).
- Abgeglichen mit WS0s Endlos-Welt auf `game/proc-world-ws0` @fc4fbc3 (`endlessTerrain.js`, `placeVeg.js`/`placeWorker.js`, `endlessVeg.js`).
- Abgeglichen mit unserem Konzept R1.6 (`ws1/prozedurale-welt`, §4.1 Ringe, §5.10 Kölner Tasche, §5.11 Fußabdrücke, §6 Leistungsrahmen).

## Kurzfassung

World Explorer ist ein **Erkunder für die echte Erde**: Zu einem Ort auf dem Globus streamt er OSM-Kacheln und Höhendaten und baut daraus eine flache Region von 40 × 40 km. Unsere Welt ist das Gegenteil, ein **endloser, erfundener Cartoon-Roadtrip** mit eigenem Höhenfeld, Biomen und `kfb-place`.

**Als Basis oder Laufzeit taugt er deshalb nicht.** Das deckt sich mit WS0s R7-Urteil „REJECT wholesale“. Es gäbe sonst einen zweiten Gelände-, Straßen-, Spieler- und Kamera-Owner auf three r161.

**Als Spender taugen fünf Techniken.** Jede ist einzeln herauslösbar und passt auf eine Lücke, die WS0 in Fahrplan 5b (V-815) oder wir in R1.6 schon benannt haben.

| # | Technik aus World Explorer | Lücke bei uns | Sichtbar? | Urteil |
|---|---|---|---|---|
| 1 | Kacheln im Worker bauen, Ergebnis als Transferable-Puffer zurück, veraltete Aufträge per Generation verwerfen | Gelände-Blätter entstehen heute auf dem Haupt-Thread (≤ 2,5 ms je Bild); bei Racer-Flug und schneller Fahrt wird die Warteschlange länger | nein (Mechanik) | **ADAPT, zuerst** |
| 2 | Horizont-Hülle: ein grobes Netz, aus dem geladene Kacheln per Index-Bereich ausgeschnitten werden (ein Draw Call, keine Lücken) | Sicht endet bei 820 m; bei Flughöhe ~33 m und Drohnen-Zoom (V-833) sieht man den Rand bzw. nur Nebel | ja | **ADAPT nach Bildpaket** |
| 3 | Echte Höhendaten (Terrarium-DEM, eine Formel) | Georgs Wunsch nach echten Höhenmustern (Kölner Bucht, Herkules/Bergpark) und die „Ebene“ für Stadtzonen (V-747) | ja | **ADAPT, nur offline gebacken** |
| 4 | Bäume nah als Modell, fern als gekreuzte Aufsteller (Atlas), Grenzen 150 m / 600 m | fern zeigt `endlessVeg` heute nur Baum-Silhouetten auf 128-m-Kacheln | ja | **ADAPT im KFB-Popup-Stil, nach Bildpaket** |
| 5 | Brücken-Profil: Rampen-Steigung über den Weg-Graphen, Deck-Höhe über Wasser | erst nötig, wenn Wasser (Fahrplan 3) und die Kölner Tasche mit Rhein kommen | ja | **HOLD bis dahin** |

**Nicht übernehmen:**
- Kachel-Streaming zur Laufzeit von OpenFreeMap/AWS. Das wäre eine Netz-Abhängigkeit mitten in der Fahrt, und die Z14-Kacheln sind vereinfacht. Es bleibt bei R1.6 §5.10: Zonen offline als Paket.
- Verkehr, Fußgänger und Routen-A* (Owner sind die beseelten Autos mit Ruf-Skala und WS-NPC).
- Wetter, Himmel, Steuerung, Kamera und Ton.
- Das WFC-Modul als Welt-Generator. Die Fassaden-Grammatik daraus ist höchstens ein späterer Spender für den Stadt-Baukasten.

**Vorrang:** Der Entwurf ändert nichts an WS0s Reihenfolge, also Fahrplan V-805 und dem Gate „Paper Racer + Golden-Auswahl“ aus R7. Owner der Welt ist WS0 (V-756, `game/proc-world-ws0`).
- Punkt 1 ist reine Mechanik. Er darf nach V-740 parallel hinter einem Schalter vorbereitet werden, wenn WS0 zustimmt.
- Die Punkte 2–4 brauchen vorher ein Bildpaket für Georg.

## 1 · Was World Explorer wirklich ist (am Code belegt)

| Behauptung (aus dem eingefügten Text) | Befund im Code | Stimmt? |
|---|---|---|
| 1-km-Kacheln, Region 40 × 40 km | `global_tiles.js`: `GRID_DIM=40`, `CHUNK_SIZE=1000` | ja |
| Worker baut Kacheln | `chunk_worker.js` mit `chunk_builder.js`; Ergebnis als typisierte Arrays, Rückfall auf den Haupt-Thread vorhanden | ja |
| OpenFreeMap-Vektorkacheln z14 | ja, dazu **AWS-Terrarium-Höhenkacheln z12**: `global_tiles.js:1426`, Dekodierung `r·256 + g + b/256 − 32768` in Zeile 1465 | ja (DEM ist z12) |
| 5 × 5 Kacheln am Desktop, 3 × 3 auf Touch | `main.js:94` `LOAD_RADIUS = TOUCH_UI ? 1 : 2`; Entladen erst bei 3 bzw. 2 (Hysterese) | ja |
| eine Worker-Kachel je Bild | `_processChunkBuildQueue(5.5)` in `main.js:2851`, Budget 5,5 ms; Kacheln außerhalb des Entlade-Radius werden verworfen | ja |
| Cache 24 bzw. 12 Kacheln | Cache der dekodierten Vektorkacheln, laut Kommentar ~3–4 MB je Kachel; Minikarte hat eigene Caches | ja, nur für diesen einen Cache |
| lokaler Ursprung beim Teleport | ja, aber **nur beim Teleport**: alles wird abgerissen und neu geladen. Ein mitwandernder Ursprung während der Fahrt fehlt | ja, mit Einschränkung |
| Brücken | `bridge_profile.js`, `bridge_deck.js`: Steigungen je Straßenklasse über Kachelgrenzen | ja |
| Vegetation nah/fern | `vegetation.js`: `NEAR_R=150` (Modell, Schatten, Wind), `FAR_R=600` (zwei feste gekreuzte Quads aus einem Canvas-Atlas, nicht zur Kamera gedreht), harter Wechsel ohne Überblendung; 14 Arten = bis 28 Draw Calls | ja |
| Horizont | `environment.js:349` `buildGlobalHorizonTerrain`: 40-km-Netz, 80 × 80 Felder, Farbe je Ecke. `updateGlobalHorizonTerrainCutout` (Zeile 429) blendet geladene Kacheln per Index-Bereich aus | ja |
| WFC | `src/wfc/`: Löser, Fassaden-Grammatik, 24 Pekinger Stile. Der echte WFC-Löser läuft nur in der Demo; im Spiel liefert ein Aufruf falsche Argumente (`wfc_mesh_builder.js:1228` gegen `wfc_solver.js:421`), Rücksprünge kommen dort nie vor. Fassaden-Atlas laut Tool „AI-Generated“ | teils |

**Wichtig für die Einordnung:**
- Das Höhenfeld des Horizonts und der Umgebung ist auf Peking geeicht (`getBeijingTerrainElevation`).
- Der Teleport an andere Orte lädt Terrarium nach.
- Die Region bleibt dabei flach, begrenzt und an echte Geografie gebunden.
- Die Höhen tastet World Explorer nur alle 200 m ab (201 × 201 Punkte für 40 km, nächster Pixel). Für Gelände ist das grob.
- Es gibt genau einen Worker. Höchstens 4 Kacheln sind gleichzeitig in Arbeit. Laufende Aufträge werden nicht abgebrochen, nur beim Eintreffen verworfen.
- Die Normalen rechnet jede Kachel für sich, ohne Nachbarn. Am Kachelrand sind deshalb Schattierungskanten zu erwarten (aus dem Code geschlossen, nicht gesehen).
- Die interaktive Seite haben weder WS0 (R7) noch ich im Browser gemessen. Es gibt keine fps- und Speicherzahlen, nur den Code.

**Wo WS0s Gelände schon weiter ist:**
- Normalen mit einer Randreihe Überstand (gleiche Nachbarn = gleiche Normale).
- Kanten zu gröberen Nachbarn auf deren Kante gelegt (Quadtree statt fester 1-km-Kacheln).
- Kollider aus genau den gezeigten Dreiecken.

Übernommen wird deshalb nur, was uns fehlt.

## 2 · Unser Stand, gegen den gemessen wird

WS0s Endlos-Welt (`game/proc-world-ws0` @fc4fbc3):
- **Gelände** `endlessTerrain.js`: Quadtree aus 512-m-Wurzeln, Blätter 64…512 m mit je 32 × 32 Zellen, Sicht 820 m.
  - Gebaut wird zeitgeteilt auf dem Haupt-Thread (`budgetMs 2,5`). Ein neuer Kachelsatz erscheint erst, wenn er ganz fertig ist.
  - Nähte zu gröberen Nachbarn werden geschlossen. Der Rapier-Kollider entsteht aus denselben Dreiecken der 64-m-Blätter.
  - Cache bis 420 Blätter, Abbau auf 360.
- **Platzierung** `placeVeg.js` + `placeWorker.js`: `kfb-place` rechnet je 64-m-Zelle **schon im Worker** (Löser 10–80 ms).
  - Die Höhen kommen als Raster vom Haupt-Thread, mit 30-m-Saum (V-831).
  - Offen laut Prüfpaket R2: Der Worker bekommt fest `biome: 'moos'`.
- **Alter Bewuchs** `endlessVeg.js`: fern nur Bäume auf 128-m-Kacheln.
- **Geplant in 5b (V-815):** mitwandernder Weltursprung, Wasser im Endlos-Gelände, Orte, Bühnen und Karten je Zone reproduzierbar, Orientierung.

Unser Konzept R1.6:
- Ringe Spiel < 140 m, Bühne 140–600 m, Reserve 600–1000 m, Silhouette > 1000 m (§4.1).
- Die Kölner Tasche als offline gebackene Zone; „Ebene“ nötig, weil drei Viertel der Gebäude sonst zu steile Hügel brauchen (§5.10).
- Leistungsrahmen: Basis 54–58 fps, Zuschläge nur gegen die leere Fahrt gemessen (§6).

**Schon früher geprüft und abgelehnt:** Three-geo-play P0 (dasselbe OpenFreeMap-z14-Streaming, ohne Höhenmodell; R1.6 §5.10a). World Explorer bringt neu nur zwei Dinge: das Höhenmodell und die Worker-Pipeline samt Horizont. Darauf konzentriert sich dieser Entwurf.

## 3 · Die fünf Spender im Einzelnen

### 3.1 Gelände-Blätter im Worker (ADAPT, zuerst)
- **Was World Explorer macht:** Der Worker rechnet Höhen, Normalen und Indizes und schickt sie als Transferable zurück, ohne Kopie. Der Haupt-Thread setzt je Bild höchstens eine fertige Kachel ein (Budget 5,5 ms). Aufträge aus einer alten Generation (nach dem Teleport) und Kacheln außerhalb des Entlade-Radius werden verworfen.
- **Was wir übernehmen:** das Muster, nicht den Code.
  - `endlessTerrain` schickt die Blatt-Aufträge (Schlüssel, Lage, Größe, Saum) an einen Worker.
  - Der Worker rechnet Höhe und Normale mit **derselben** Höhenfunktion.
  - Zurück kommen `Float32Array`-Puffer.
  - Auf dem Haupt-Thread bleiben nur `BufferGeometry` setzen, Naht-Anpassung, Kollider und Tausch des Kachelsatzes.
  - Generations-Marke je Plan: Ein veralteter Plan wird verworfen, bevor er eingesetzt wird.
  - Besser als das Vorbild: Veraltete Aufträge, die noch in der Warteschlange des Workers liegen, werden gestrichen statt fertig gerechnet (World Explorer bricht nichts ab).
- **Voraussetzung, schon weitgehend erfüllt:** `createEndlessHeight` ist laut WS0s eigenem Kommentar „ohne three; Node-Tests rechnen dieselbe Zahl“. Darin stecken Probe-Höhe, Biom-Faktor, Karten-Stempel, Werbetafel-Plätze, Kuppel-Mulden und Genius-Loci-Plätze. Damit kann der Worker dieselbe Funktion importieren.
  - **Eine Falle:** `cardgrid=0` und `boards=0` werden aus `location.hash` gelesen. Im Worker ist das die Adresse des Worker-Skripts, also leer. Die Schalter müssen deshalb als Optionen mitgegeben werden, sonst rechnet der Worker mit Karten und Tafeln, die der Haupt-Thread gerade abgeschaltet hat.
  - **Golden-Test:** byte-gleiche Höhen an 10 000 Punkten zwischen Haupt-Thread und Worker, mit allen Schalter-Kombinationen.
- **Nutzen:** Der Haupt-Thread wird frei für Fahrt, Szenen und HUD. Zweiter Gewinn: `placeVeg` holt sich sein Höhenraster je 64-m-Zelle heute zeitgeteilt vom Haupt-Thread; dasselbe Raster kann dann direkt aus dem Gelände-Worker kommen. Die Welt füllt sich bei Flug und Drohnen-Zoom schneller, ohne dass 2,5 ms je Bild fest verbraucht werden.
- **Probe P1** (unsichtbar, Schalter `terrainworker=1`): gleiche Fahrt im Slot, A/B im Wechsel.
  - Messgrößen: `maxSliceMs`, `pending`, Zeit bis zur vollen Sicht nach Teleport bzw. Start, p95/p99 der Bildzeit, Zahl der Kachelsatz-Tausche.
  - Strecken: Racer-Flug, 10 min Fahrt über Biomgrenzen, Zoom auf 40 K.
  - **PASS:** Höhen byte-gleich; p95 nicht schlechter; `maxSliceMs` auf dem Haupt-Thread mindestens halbiert; kein Loch, kein Sprung, Kollider unverändert (`test/unit/endlessSeams.mjs` grün).

### 3.2 Horizont-Hülle (ADAPT nach Bildpaket)
- **Was World Explorer macht:** ein einziges Netz über die ganze Region, grob (500-m-Felder), Farbe je Ecke aus dem Biom. Für jede geladene feine Kachel werden ihre Dreiecke aus dem Index-Puffer genommen (`setDrawRange`). Ergebnis: ein Draw Call, keine Lücke, kein Überlappen.
- **Was wir daraus machen:**
  - Ein Ring von 820 m bis etwa 3–4 km, der in 512-m-Schritten mitwandert.
  - Gleiche Höhenfunktion, stark vergröbert; Farbe aus den Fließbändern des Bioms (V-801/V-826 vergröbern ohnehin mit der Entfernung).
  - Ausgeschnitten wird, was der Quadtree zeigt.
  - Bewuchs fern nur als Farbe bzw. Aufsteller (3.4).
- **Warum:** Ab ~33 m Flughöhe (V-822) und beim Drohnen-Zoom (V-833) endet die Welt heute sichtbar oder im Nebel. Für den Roadtrip-Eindruck gilt: „dort hinten kommt das nächste Biom“.
- **Probe P2:** zuerst ein Bildpaket für Georg (V-740), Flug und Drohne mit und ohne Hülle, aus dem Live-Stand.
  - Budget: 1 Draw Call, ≤ 20 k Dreiecke, 0 neue Shader-Programme (gleiches Material wie terrain3).
  - Prüfen: kein Flackern an der Schnittkante, keine Tangente zwischen Hülle und Blatt.

### 3.3 Echte Höhenmuster, offline gebacken (ADAPT)
- **Was World Explorer macht:** AWS-Terrarium-PNG (z12), dekodiert mit einer Zeile (`r·256 + g + b/256 − 32768`), live beim Teleport geladen.
- **Was wir daraus machen:** ein Back-Skript, kein Laden zur Laufzeit. Übernommen wird nur die Formel, nicht das 200-m-Raster: Wir lesen die Kacheln in voller Auflösung (z12 ≈ 24 m in Köln, bei Bedarf z13–z15) und interpolieren bilinear.
  - Je Wunschort (Kölner Bucht, Bergpark Wilhelmshöhe/Herkules, später andere) einmal die Kacheln holen.
  - Daraus wird ein **Höhenmuster** im Format aus R1.6 §5.11 (`kfb.terrain-footprint/1` bzw. das Höhenbild-Format): normiert, geglättet, im Maßstab an unsere Hügel angepasst, cartoonig überhöht oder gedämpft.
  - `endlessTerrain` mischt das Muster als **Zonen-Relief** ein. Das ist dieselbe Stelle, an der die „Ebene“ (V-747) wirkt; kein zweites Gelände.
- **Warum:** Es erfüllt Georgs pragmatischen Ansatz („Höhenmuster wie die Kölner Bucht oder der Herkulesberg“), ohne eine Stadt nachzubauen. Die Kölner Tasche bekommt ihre echte, flache Bucht als Grund. So wird die „Ebene“ gemessen statt erfunden.
- **Credit:** Terrain Tiles (Mapzen/AWS Open Data) in die Creator-Credits; OSM-Daten wie bisher „© OpenStreetMap contributors“. Keine Lizenzprüfung, nur der Credit (Georg 21.10.).
- **Probe P3:** Zuerst Bilder: Kölner Bucht als Höhenmuster in der Biom-Fahrt, daneben das heutige Gelände. Dazu die Rampen-Tabelle aus R1.6 §5.10 neu gerechnet (Anteil Gebäude mit Rampe > 15°).
  - **PASS**, wenn die Bucht ohne Abtrag die „Ebene 0,3“-Werte erreicht oder unterbietet.

### 3.4 Ferne Bäume als Papier-Aufsteller (ADAPT im KFB-Stil, nach Bildpaket)
- **Was World Explorer macht:** nah (< 150 m) Low-Poly-Bäume mit Schatten und Wind; fern (< 600 m) gekreuzte, alpha-getestete Aufsteller aus einem Canvas-Atlas; dahinter nichts. Neuberechnung erst nach 20 m Kamera-Weg.
- **Was wir daraus machen:** keine festen Kreuz-Quads, kein harter Wechsel.
  - Fern stehen **KFB-Popup-Aufsteller**: Silhouette des KayKit-Baums mit weißem Rand, zur Kamera gedreht wie die Pariser Werbetafeln (V-839 „Kayfabe-Illusion“), eingefärbt mit der Biom-Palette (V-803).
  - Die Lage kommt aus demselben `kfb-place`-Rezept, damit der Wechsel nah ↔ fern nicht springt.
  - Übernommen wird das Sammeln: je Art und Stufe ein Instanz-Mesh, Neuaufbau erst nach 20 m Kamera-Weg, nur geänderte Bereiche hochladen (`vegetation.js:667–990`).
  - Ringe passend zu R1.6 §4.1: Modell im Spiel- und Bühnen-Ring, Aufsteller im Reserve-Ring, dahinter nur Farbe der Horizont-Hülle.
- **Probe P4:** Bildpaket für Georg zuerst. Danach Messung: Draw Calls, Überzeichnung durch Alpha (GPU-Zeit), Sprünge beim Wechsel.

### 3.5 Brücken-Profil (HOLD, technisch der stärkste Teil)
- **Was World Explorer macht:** Die Steigung der Rampen wird über den Weg-Graphen verteilt (je Straßenklasse 5/7/10 %). Das Deck liegt in Höhe über Wasser, auch über Kachelgrenzen.
- **Laut Audit der sauberste Baustein:** reine Funktion ohne three und DOM (`bridge_profile.js`, 568 Zeilen). Die Fahrbahnlinie wird per Öffnen/Schließen geglättet, die lichte Höhe ist 8 m über Straße, 4 m über Fußweg. Rampen breiten sich mit begrenzter Steigung über einen Max-Heap aus, Kachelnähte werden über kollineare Way-Enden geschlossen. Herauslösen kostet 1–2 Tage; Golden-Gate-, Bay-Bridge- und Landmark-Sonderfälle müssen raus.
- **Für uns** erst sinnvoll, wenn Wasser im Endlos-Gelände (Fahrplan 3) und die Kölner Tasche mit Rheinufer kommen.
- Dann als Spender für die Zufahrt und die Hohenzollernbrücke. Fahrkontakt bleibt das Gelände bzw. Track Core.
- Die Prozentwerte sind Upstream-Werte, keine KFB-Konstanten.

## 4 · Ausdrücklich nicht übernehmen

| Teil | Warum nicht |
|---|---|
| Laufzeit-Streaming von OpenFreeMap und AWS | Netz-Abhängigkeit in der Fahrt, Z14 vereinfacht, CORS bzw. Ratenlimits; R1.6 §5.10: Zonen offline als Paket |
| ganzer Motor (three r161, Steuerung, Kamera, Wetter, Himmel, Ton) | zweiter Owner für alles; wir sind auf three r186 mit Host-Vertrag |
| Verkehr, Fußgänger (`city_traffic`, `traffic_graph`) | Autos sind bei uns beseelt (Ruf-Skala V-712), Bewohner gehören WS-NPC |
| Routen-A* (`route_graph`) | Die Endlos-Welt hat kein Straßennetz; Aufträge in Fahrzeit laufen über R1.6 §5.2 |
| WFC als Welt- oder Platz-Generator | `kfb-place` ist der eine Platzierungs-Owner (V-748 ff.) |
| Kaiju, Waffen, Gebäude-Kollision | nicht unser Spiel bzw. Rapier ist Owner |

**Später vielleicht:** die **Fassaden-Grammatik** aus `src/wfc/` (Erdgeschoss-Reihe, Eck-Pfeiler, Krone, Socket-Regeln je Wand). Als Regelvorlage für Georgs Stadt-Baukasten mit Kenney-Fenstern und -Türen und Material-Codes, nur lokal je Gebäude, erst nach der Bildabnahme der Kölner Tasche. Nur die Regeln, nicht der Code: Er ist auf Peking zugeschnitten, im Spiel fehlerhaft verdrahtet, und der Fassaden-Atlas passt nicht zum Cartoon-Look.

## 5 · Konzept: wer was wann

| Schritt | Inhalt | Owner | Sichtbar? | Wann |
|---|---|---|---|---|
| P1 | Gelände-Blätter im Worker, `terrainworker=1`, Golden-Test Höhen, A/B im Slot | WS0 (Gelände-Owner); WS1 Lead kann die Probe als Patch gegen `endlessTerrain.js` liefern, wenn WS0 das will | nein | parallel zu Fahrplan 3–5, nach V-740 erlaubt |
| P3 | Back-Skript Terrarium → Höhenmuster (Kölner Bucht, Herkules), Bilder + Rampen-Tabelle | WS1b bzw. Lead (Konzept R1.6 §5.10/§5.11), Einbau WS0 | ja, Bild zuerst | vor dem Bau der Kölner Tasche |
| P2 | Horizont-Hülle, Bildpaket Flug/Drohne | WS0 mit Claude Design (Bildpaket) | ja | in Fahrplan 5b |
| P4 | ferne Popup-Bäume, Bildpaket | WS0 mit WSB/Claude Design | ja | in Fahrplan 5b, nach Bewuchs je Biom |
| P5 | Brücken-Profil | WS1c (Wasser) + WS0 | ja | nach Wasser und Kölner Tasche |

**Regeln für jede Übernahme:**
- Nur Muster oder kleine reine Funktionen übernehmen, keine Module. Wird eine Funktion wörtlich übernommen, bleibt der MIT-Kopf mit „© 2026 Jerry Xie“ in der Datei, und World Explorer steht in den Creator-Credits.
- Ein Höhen-Owner (`endlessTerrain`), ein Platzierungs-Owner (`kfb-place`), ein Licht-Rig.
- Jede Probe hinter einem Schalter. A/B startet auf NEU. Abnahme nur im Live-Stand mit Site-Hash.
- Messungen im Slot, A/B im Wechsel (GPU geteilt), immer gegen die leere Fahrt (R1.6 §6).

## 6 · Risiken

- **Höhenfunktion im Worker:** Wenn sie am Zustand des Haupt-Threads hängt (Schalter aus der Adresse, später live gesetzte Orte), weichen die Höhen ab. Dann gibt es Nähte und falsche Kollider. Gegenmittel: der Golden-Test vor allem anderen. Neue Orte gehen als Nachricht an den Worker, bevor ein Blatt dort gebaut wird (Reserve-Ring, R1.6 §4.1).
- **Ursprung:** World Explorer löst den mitwandernden Ursprung nicht; er setzt nur beim Teleport neu auf. Für 5b braucht es unsere eigene Lösung:
  - Sprung in festen Schritten.
  - Welt-Versatz als Uniform, damit Fließbänder und Rauschen im Shader nicht springen.
  - Rapier-Körper im selben Bild verschieben.
- **three r161 → r186:** Nur relevant, wenn Shader-Code übernommen wird. World Explorer hat 21 `onBeforeCompile`-Patches auf Shader-Chunk-Namen, die in r186 nicht geprüft sind. Wir übernehmen Muster, keine Shader-Patches.
- **Alpha-Überzeichnung** bei fernen Aufstellern auf Laptops: in P4 messen.
- **Echte Höhen zu steil oder zu flach** für Fahrspaß: Das Muster wird immer normiert und im Maßstab an unsere Hügel angepasst; Georg entscheidet im Bild.

## 7 · Fragen an Georg und WS0

1. **WS0:** Soll P1 (Worker-Gelände) jetzt als unsichtbare Mechanik vorbereitet werden, und von wem? Vorschlag: Der Lead liefert den Patch samt Golden-Test gegen `endlessTerrain.js`; WS0 entscheidet über den Einbau.
2. **Georg:** Echte Höhenmuster als Grund für Stadtzonen und als gelegentliche „Landschaft mit Wiedererkennung“, z. B. Kölner Bucht und Herkules: ja? Dann kommt zuerst ein Bild.
3. **Georg:** Ferne Bäume als Papier-Aufsteller im Popup-Stil (wie die Werbetafeln): ja als Bildpaket?
