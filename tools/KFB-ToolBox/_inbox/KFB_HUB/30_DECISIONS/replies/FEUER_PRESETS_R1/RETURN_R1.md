# RETURN R1 · Feuer-Presets R1 (V-2102)

**Zweig:** `ws0/feuer-presets-r1` @ `0aeb166a` (Stamm `game/integration-r2` @20a8f013 eingemergt, nicht in den Stamm gemergt)
**Schalter:** `feuerorte=r1` in `src/flags.js` (owner WS0, status `pruefen`). Ohne Schalter läuft keine Zeile des neuen Moduls, das Amphitheater zeichnet weiter das campfire (Rauchtest „ohne“: 0 Seitenfehler, Feuer-Naht wie heute).
**Ergebnis:** alle acht Presets haben einen Ort und einen Träger aus dem Bestand. Die stille Blind-Kritik bestand nicht (bester Stand R3: Mittel 5,4). Der Stand reicht als Einbau hinter Schalter, nicht als Abnahme durch Georg.

## Bestand (Schritt 0)
- **Vorhanden und genutzt:** Feuer-Naht `src/look/feuerNaht.js` (`feuerAdd`, nur aufgerufen), Patch-Feuer `src/vendor/fire` (unverändert), Rezept-Format `src/core/rezept.js` mit Bus `core/cueBus.js`, Zielhaken `modules/combatTargets.js`, Spieler-Leben `world/spielerLeben.js`, Diorama-Pool (`diorama:*`), Kampfbühne (`buehne=r1`), Kit-Requisiten über den kayfabizarro-Pin (`propsBase`, wie npcSceneProbe und das Amphitheater-Lagerfeuer).
- **Neu:** das Modul `src/world/feuerorte.r1.js`, die Daten `src/data/world/feuerorte.r1.json`, zwei Rezepte `src/data/choreo/kiste_brand.r1.json` und `feuerwand.r1.json`, der Einheitstest `test/unit/feuerorte.mjs` und der Beleg `test/_feuerorte-beleg.mjs`.
- **Suche nach Trägern:** Inventur im kayfabizarro-Baum (7468 Modelle) plus 3D-Suche (mcp 3d-assets, „brazier fire bowl“, „fireplace“). Gewählt wurde Bestand: KayKit vor Kenney.

## Je Preset: Ort, Träger, Ergebnis

| Preset | Ort / Zustand | Träger (Quelle) | Ergebnis |
|---|---|---|---|
| `brazier` | Amphitheater an der bisherigen Feuerstelle (`AMPH_FEUER`), ersetzt dort das campfire | Kenney Graveyard `pillar-square` + `fire-basket` (×2,4) | Liest als Kohlebecken auf einer Säule. Offen: Licht auf Säule und Boden schwach; ein einzelnes Becken mitten auf der Fläche (Ort aus dem Bestand übernommen) |
| `torch` | Gefängnis-Diorama `prison_panopticon`, vordere Fassade (Wand per Strahl gesucht, ohne Überhang) | KayKit Dungeon `torch_mounted`, Flamme aus dem Kelch (`outOf`) | 2 Fackeln (von 6 Kandidaten), 2 mit Licht. Im Nahbild lesbar, in der Totale zu klein, eine steht hinter einem Busch |
| `candle` | Imbiss-Ruine, freie Stelle auf der Theke (`counter`) | KayKit Dungeon `candle` (×0,75) | Kerze steht, die Flamme ist klein (Kritik: kaum sichtbar) |
| `fireplace` | Imbiss-Ruine an der Rückwand (`wall_back_*`), Platz mit dem größten freien Fliesenkreis und Sicht von der Blickseite | KayKit Caveman `Campfire_Base` (Steinkranz) + KayKit Resource Bits `Wood_Log_B` | Liest als Herdfeuer. Im Bestand fehlt ein offener Kamin: der `woodstove` ist geschlossen, `chimney-base` von Kenney hat keine Textur im Pin |
| `bonfire` | Abenteuer-Lager, Anker `KFB_Campfire` (V-1546, dort fehlte bisher jedes Feuer) | KayKit Caveman `Campfire_Logs` (setzt der Diorama-Lader ein) | Bester Ort: hohes Freudenfeuer und Lichtinsel |
| `gas` | Alien-Werkstatt `alien_workshop`, zwei Düsen vor der Schauseite | Kenney Factory `pipe-large`, aufrecht (×0,6) | Blaue Strahlen mit kaltem Lichtfleck, lesen sofort. Offen: die Düsen stehen frei vor dem Bau |
| `crate` | Kampfbühne, Kiste neben Z. Ein Treffer über den Zielhaken startet das Rezept `kiste_brand.r1`: anbrennen über die Feuergröße, brennen, erlöschen, 15 s verkohlt, neu | KayKit Dungeon `box_large` | Kaskade läuft (Video). Offen: im Beleg ist der Auslöser nicht als Schuss zu sehen; die Flammen kleben an den Seitenfeldern (Form des Presets mit `rows`) |
| `line` | Kampfbühne, Feuerwand 7,4 m südlich der Achse. Rezept `feuerwand.r1` als Falle: zünden, brennen, erlöschen, Pause. An/aus über `wand.an`. Schaden 8 je 0,6 s über `spielerLeben.treffer` (Band ±0,9 m) | 3× KayKit Dungeon `floor_tile_grate`, Rost bündig, Wanne im Boden | Wirkt als Wand. Offen: die Treffer zählen (4 im Video), aber die Figur reagiert sichtbar kaum, das Leben bleibt durch die Selbstheilung bei 100. Die Rostränder liest die Kritik als „Platte“ |

**Licht:** nur die Lichter der Presets, je Ort höchstens zwei (`mitLicht`), `shadow: false`. Die Orte streamen nach Nähe: Aufbau unter 170 m, Abbau über 230 m. So stehen die Preset-Lichter nur lokal in der Szene.
**Rotation:** Patch-Feuer ignoriert die Drehung. Darum laufen Reihen-Presets (`line`, `fireplace`) immer entlang Welt-x, und die Träger sind danach ausgerichtet.

## Gebogener Flammenstrahl: geht nicht
Geprüft mit `line` bei `wind = 1`, `windDirection = π/2` und 0,6 rad Drehung am eigenen Elternknoten (Bild `_privat/belege_r4/strahl_line_wind1.png`, Werte in `beleg.json → strahl`).
- Die Reihe bleibt eine Gerade entlang Welt-x. `Fire.tick` setzt die Teilfeuer auf `uFirePos.x += here·halfX·size` und übernimmt aus dem Elternknoten nur die Position, nie die Drehung (Vendor: „leave its rotation and scale alone“).
- Der Wind neigt jede Zunge gleich stark in dieselbe Richtung (`windBend` je Teil). Das ergibt eine schräge Wand und keinen Bogen in der Fläche.
- Das Volumen steigt im Flammenraum immer nach +y auf. Ein liegender Strahl wie aus einem Flammenwerfer ist mit den Parametern nicht darstellbar.
- Nicht nachgebaut (Brief: nur prüfen).

## Messwerte
**Bildzeit (Readback-Gate wie V-GPU).** Gepaart in derselben Seite: A = Feuer am Ort, B = dieselben Feuer 5 km hoch geschoben (außerhalb `FEUER.NAH`). 8 Paare je Ort, Median der Paardifferenz, feste Kamera, Nacht, Belegbuild `KFB_SPLIT=1 --base=./`.

| Lauf | Amphitheater heute (campfire) | Amphitheater neu (brazier) | Kampfbühne Höchstlast (Wand dauernd + Kiste brennt) | Gefängnis (2 Fackeln) |
|---|---|---|---|---|
| L1 | +2,62 | −1,00 | −2,58 | −13,31 |
| L2 | −1,15 | +1,57 | +0,88 | — |
| L3 | −1,98 | +0,10 | +2,09 | −10,21 |
| L4 | −0,11 | +0,73 | +0,93 | — |
| L5 (Merge-Stand, Rechner stark belastet) | −2,17 | +2,25 | +2,14 | −7,02 |
| **Median** | **−1,15** (→ 0) | **+0,73** | **+0,93** | **−10,2** |

Bewertung gegen FERTIG 3 (≤ heute + 2 ms): die Mediane halten die Grenze. Einzelne Läufe streuen um ±2–3 ms, weil parallele Sitzungen die GPU belasten (L5: der Rauchtest zeichnete nur etwa ¼ der Bilder). Negative Kosten sind Rauschen oder ein echter Effekt: Mit Feuer zeichnet die Naht in ein HDR-Ziel ohne MSAA, und das ist bei schweren Dioramen billiger als der Standardweg mit MSAA (Gefängnis: −7 bis −13 ms).

**CI (Merge-Stand 0aeb166a):** 234 Tests · grün 232 · bekannt rot 2 (audioMixer, deps; wie im Stamm) · Rückfall 0. Die Zahl liegt um eins höher als im Stamm, weil `test/unit/feuerorte.mjs` neu dazukommt · **Rauchtest (Belegbuild des Merge-Stands, je 20 s ohne und mit Schalter):** 0 Seitenfehler in beiden Läufen; die Feuer-Naht zeichnet in beiden; `__kfbFeuerorte` gibt es nur mit Schalter · **`npx vite build` (KFB_SPLIT=1 --base=./):** grün auf dem Merge-Stand.

## Belege (nur `_privat`)
`replies/FEUER_PRESETS_R1/_privat/belege_r1` … `belege_r4`, je Ort Tag (hour 14) und Nacht (hour 21) über die festen `belegVideo`-Presets dreiviertel und totale. Dazu `FEUERORTE_kiste_brand.mp4` und `FEUERORTE_feuerwand.mp4`, ab R2 bildgenau mit 30 fps (`replay=30`, je Bild 1/30 s Spielzeit). Protokoll jeweils in `beleg.json`.
Bester Stand ist **`belege_r3`**. In R4 ist die Kamera klarer (klares Wetter, Herd sichtbar), aber die Gefängnis- und Imbiss-Ausschnitte sind schlechter.

## Kritik-Verlauf (still, blind; Matrix r1; Ton n/a, weil die Belege stumm sind)

| Runde | A | B | C | D | E | F | H | Mittel | Paarvergleich |
|---|---|---|---|---|---|---|---|---|---|
| R1 | 5 | 5 | 4 | 3 | 5 | 4 | 5 | 4,43 | — |
| R2 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4,86 | besser (C, D) |
| R3 | 6 | 6 | 5 | 5 | 5 | 4 | 7 | **5,43** | besser (A, B, H) |
| R4 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4,86 | schlechter (C, H), E knapp besser |

Ergebnis: FAIL, keine Achse ≥ 7 außer H in R3. Nach R4 habe ich gestoppt: eine Runde ohne Verbesserung, und die verbliebenen Blocker liegen außerhalb dieses Moduls oder brauchen eine Entscheidung (siehe unten). Eine fünfte Runde ist nach der Regel noch erlaubt.

## Vermerke (Brief gegen Register bzw. Bestand)
- **Labyrinth:** Im Spiel gibt es kein Gefängnis-Labyrinth. Es existiert nur in `table-diorama` (WS1-Theater). Als nächster Wandort dient das Diorama `prison_panopticon`.
- **Innenraum:** Café und Kartengebäude sind im Spiel nicht betretbar (das Café ist eine Pop-up-Kulisse). Genutzt wird die halboffene Imbiss-Ruine.
- **Großes Lager:** Im NPC-Lager (`npcSceneProbe` m1) bleibt das campfire. Das Freudenfeuer bekommt das Abenteuer-Lager. Das deckt sich mit V-1546, der dort ein Feuer als Lichtinsel verlangt.
- **Kein Widerspruch zum Register** gefunden (V-385/386 ein Rig, V-1544/1556 Nacht-Lichtinseln, V-574 Kit-Teile unverändert).
- **Beleg-Bibliothek:** `test/lib/beleg.mjs` hat zwei neue Optionen, beide rückwärtsverträglich. `belegVideo(…, { kopie, licht })`: Die Kamera-Kopie greift nicht, sobald das Patch-Feuer zeichnet (die Naht rendert über die Spielkamera in ein eigenes Ziel). Darum nehmen Feuer-Belege `kopie: false`. Mit `licht: 'frei'` bleibt die Kameraseite bei Tag und Nacht gleich.

## Offene Punkte (kleinste Blocker zuerst)
1. **Gefahr der Feuerwand sichtbar machen:** Eine Trefferreaktion von FB (`fbtreffer`) gibt es, aber sie ist zu fein und auf 0,6 s gedrosselt. Die Selbstheilung hält das Leben bei 100. Gebraucht wird eine stärkere Reaktion bzw. Verbrennungsreaktion der Figur. Das ist eine Aufgabe für den Animations- bzw. Figur-Besitzer, nicht für dieses Modul.
2. **Kisten-Auslöser im Beleg:** Den echten Schuss von FB auf die Kiste aufnehmen. Heute ruft der Beleg den Zielhaken direkt auf, so wie ein Schuss ihn aufruft.
3. **Gefängnis-Fackeln:** größere Halter bzw. mehr Fackeln an der Front. Die Sichtprüfung gegen Bewuchs (Raycast in die Szene) schloss alle Halter aus und ist darum wieder entfernt; sie braucht eine Liste der Vegetations-Meshes.
4. **Kamin:** Ein offener Kamin fehlt im Bestand (Liste „fehlt im Kit“). Kandidat ist Kenney Fantasy Town `chimney-base`, wenn die Textur nachgezogen wird.
5. **Gas-Düsen** an Rohre oder Plattform der Werkstatt setzen statt frei davor (Diorama ohne Knoten, nur per Strahl möglich).
6. **Kohlebecken:** Lichtwirkung auf Säule und Boden. Bei licht 8 überstrahlte der Arenaboden, darum steht der Wert jetzt auf 3.
7. **Messung** auf einem ruhigen Rechner wiederholen, ohne parallele GPU-Sitzungen.
8. **Georg:** keine Hub-Karte, bis die Kritik besteht (SOP §2: Georg sieht nur Bestandenes).
