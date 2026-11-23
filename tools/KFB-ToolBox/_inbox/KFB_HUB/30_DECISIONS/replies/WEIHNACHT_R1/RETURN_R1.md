# RETURN · Weihnachts-Scenelet R1 (Agent für WS0, 23.11.2026)

**Zweig:** `ws0/weihnacht-r1` @ `b6d746fc` (fünf Commits ab Stamm @68f8fb42), gepusht nach origin, nicht gemergt. Kein `src/private` im Zweig (diff-tree geprüft).
**Ergebnis:** Gebaut und im Spiel belegt, alle Handwerks-Gates grün. Die Blind-Kritik bleibt FAIL: nach 5 Runden bestes Mittel 6,67 (Runde 5); die von WS0 freigegebene Runde 6 kam auf 6,50 (netto gleich zu R5). Nötig wären 8.

## 1 · Teile und Größe (für Aqua)
KayKit Holiday Bits 1.0 FREE, aus dem ZIP in einen eigenen Scratch-Ordner entpackt. Ins Repo kamen nur die benötigten Teile, unverändert, nach `src/assets/weihnacht/`: **35 Dateien, 1,43 MB** (17 glTF + .bin, dazu die eine Textur `holiday_bits_texture.png`).

| Rolle | Teile |
|---|---|
| Baum | `christmas_tree_decorated` (Lichterkette = Material `holiday_glow`) |
| Gleise | `tracks_crossing`, `tracks_straight` ×4, `tracks_curve` ×6 |
| Zug | `train_locomotive`, `train_tender_coal`, `train_wagon`, `train_tender_presents_A` (Lok + 3 Wagen) |
| Requisiten | `snowman_B` (mit Zylinder), `lantern_decorated`, `chair_large_red`, `gingerbread_house_decorated`, `snowball_pile`, Geschenke `present_A_red`, `present_B_blue`, `present_C_green`, `present_sphere_A_yellow` |

Die Kit-Logos aus dem Promobild wurden nicht übernommen. Es gibt keine Texte im Bild.

## 2 · Was gebaut ist
- **Modul `src/world/weihnacht/`.** Es folgt dem Host-Vertrag wie `bandLife` und `danceLife` und hängt nicht von M1World ab.
  - `kern.js` ist Node-sicher und enthält Strecke, Zuglage, Gate-Werte, Takt, Schneemann-Körper und Federn.
  - `index.js` enthält `createWeihnacht`.
  - `README.md` beschreibt die Schnittstelle.
  - Daten: `src/data/scenelets/weihnacht_baum.r1.json`.
- **Acht.** Die Kreuzung liegt in der Mitte. Jede Schleife besteht aus 1 Gerade vor und 1 Gerade nach der Kreuzung plus 3 Viertelbögen (r = 2 u), zusammen ein 270°-Bogen. Die Gesamtlänge ist 26,85 u (16,5 m).
  - Die Lok fährt mit zwei Achsen je Wagen auf der Mittellinie, die Räder drehen.
  - In den Bögen rollen die Wagen leicht nach außen (Feder).
  - Das Tempo „atmet“ zweimal je Runde: schnell durch die Kreuzung, langsamer in den Schleifen. Eine Runde dauert 12 s und ist eine reine Funktion der Weltzeit.
- **Rauchfahne.** Sie nutzt den vorhandenen Düsenrauch `dustTrail.createThrustSmoke` mit dem Satz `DUST3_JET`, wie beim Jetpack. Es gibt keinen neuen Rauch-Code.
  - Angepasst sind nur Parameter: Farbe, Auftrieb, Lebensdauer und Menge. Die Menge steigt mit dem Tempo.
  - Der Wirt reicht die Rauch-Fabrik über `options.rauch` herein.
- **Licht.** Es gibt nur das eine Rig plus die Kit-Emission.
  - Die Lichterkette ist in drei Gruppen geteilt. Diese wechseln weich im Takt (Lauf über drei Schläge), der Stern atmet.
  - Abends liefern Baum und Laterne warme Punkte über `lichtQuellen()` an die vorhandenen **Lichtinseln** des Wirts: Leuchthof und Bodenlicht, nur nachts. Das ist die Lichtquellen-Option des Rigs, keine eigene Lampe.
- **Schneemann.** Das eine Kit-Netz wurde in Teile zerlegt: Körper mit Schal, Kopf, Hut, zwei Äste. Zerlegt wurde nach Zusammenhangskomponenten, nichts ist neu modelliert.
  - Takt: Ork-Band-Uhr (`bandClock.beatPos`, 100 bpm wie die Ork-Band) an derselben Weltzeit wie `BAND_OPTS`.
  - Auf der Eins staucht er (≤ 7,5 %, volumenerhaltend), dann streckt er sich mit Halt.
  - Auf der Takt-Eins gibt es einen Akzent. Die Neigung pendelt mit Halt.
  - Kopf, Hut und Äste schwingen über Federn nach.
  - Ist der Spieler näher als 7 m, dreht sich der Kopf zu ihm (≤ 35°) und ein Ast winkt.
- **Boden.**
  - Die Gleise liegen auf einer Ebene durch das Gelände (bis 11° geneigt). Sie ist so angehoben, dass kein Gleis einsinkt.
  - Requisiten stehen senkrecht auf dem höchsten Geländepunkt unter ihrem Fuß (V-1578). Sie haben Kontaktflecken über den Szenen-Wirt (Namen `prop:*`).
  - Bleibt nach der Ebene ein Rest über 4 cm, sucht das Modul die ruhigste Stelle im Umkreis von ≤ 14 m.
- **Knete.** Die Kit-Teile laufen als `midground` über `clayTargets()` im claySSOT. Die Leuchtteile sind ausgenommen.
- **Einbindung (M1World).**
  - Lader `weihnacht` in `SZ_MAKE`.
  - Katalog-Eintrag `weihnacht_baum` in `kfb-szenen.r1.json` mit `lader: weihnacht` und `schalter: weihnacht`; Familie eigen, `gleiche_min_m` 1500, alle Tageszeiten, Biom alle.
  - Sprungziel `szene:weihnacht_baum` kommt automatisch aus dem Katalog.
  - Knete und Lichtinseln holen ihre Ziele bzw. Quellen aus den laufenden Szenen.
- **Schalter.** `weihnacht=r1` in `src/flags.js`: owner WS0, status pruefen, nicht in Testfahrt oder Release. Ohne Schalter bleibt alles unverändert: Der Katalog-Eintrag wird vor der Planung herausgefiltert, keine Assets werden geladen. Der Smoke-Test mit und ohne Schalter ist grün.

## 3 · Gate-Werte (Spiel-Look, Split-Build `KFB_SPLIT=1 --base=./`, Release-Hash + `weihnacht=r1`, am geplanten Platz)
Gemessen mit `messen()` in `test/_weihnacht-beleg.mjs` (Runde 5, Tag / Abend):

| Prüfung | Wert | Grenze |
|---|---|---|
| Gleis schwebt (größter Abstand Gleis–Gelände) | 2,8 cm / 3,3 cm; einsinken 0 | nichts schwebt/versinkt |
| Requisiten: Unterkante gegen den höchsten Geländepunkt unter dem Fuß | 0 bis +0,5 cm (keine sinkt ein); größte Luft talseitig 1,8 / 4,5 cm (Lebkuchenhaus-Sockel am Hang) | sitzen, gern minimal schwebend (V-1578) |
| Wagen auf der Strecke (Achsmitten zur Mittellinie) | 0,92 cm (Unit: 0,92 cm über eine ganze Runde) | < 3 cm |
| Kreuzung: zwei Wagen quer zueinander gleichzeitig im Kreuzungsfeld | 0; kleinster Abstand nicht benachbarter Wagen 45 cm, Pufferabstand ≥ 2,6 cm | keine Kollision |
| Schneemann-Phase (Stauch-Minimum gegen den ganzen Schlag, 13–14 Minima in 8 s) | Mittel −0,002 / −0,017 Schlag, größte Abweichung 0,028 Schlag (= Bildtakt); Volumen 1,0000 | auf dem Takt |
| Seitenfehler / Konsole | 0 / 0 | 0 |
| Kosten des Moduls | 0,3–0,5 ms je Bild | – |

Unit-Test `test/unit/weihnachtBahn.mjs` prüft:
- Acht geschlossen und knickfrei, Kit-Teile auf der Mittellinie (Abweichung 4e-16 u), zwei senkrechte Durchfahrten
- Zug, Lichtraum der Bahn gegen alle Requisiten, Requisiten ohne Überschneidung
- Takt = Ork-Band-Uhr, Dateien vollständig, Katalog nur hinter dem Schalter

## 4 · CI, Smoke-Test, Build
- **CI** (`node scripts/ci/run.mjs`, nach R6 erneut): **232 Tests, grün 230, bekannt rot 2** (audioMixer, deps wie im Stamm), **Rückfall 0**. Der Stamm hatte 229/231, dazu kommt der neue Unit-Test.
- **Smoke-Test** `PW_GPU=1 node test/_smoke-hashes.mjs weihnacht=r1`: Testfahrt, Slice und beide mit Schalter grün, 0 Fehler.
- **Build:** `npx vite build` (`KFB_SPLIT=1 --base=./`) grün.

## 5 · Belege (nur `belegVideo`-Presets, Spiel-Look)
`replies/WEIHNACHT_R1/_privat/belege_r5/` (bester Stand nach Mittel; `belege_r6/` = Code-Stand nach WS0-Runde, gleicher Aufbau):
- `weihnacht_tag.mp4`: 15 s, Preset totale, eine ganze Acht (Runde 12 s), Schneemann im Takt, Baum leuchtet
- `weihnacht_tag_dreiviertel.png`, `weihnacht_abend_dreiviertel.png`: Stills im Preset dreiviertel (Tag 12 Uhr, Abend 19 Uhr)
- dazu `*_totale.png`, `gate_*.json`, `log_*.txt`

Die Runden 1–4 liegen in `belege_r1` bis `belege_r4`.

**Ort:** Die Szene steht am Platz, den der Verteiler im Spiel plant (Sprungziel, ≈ 3,6 km vom Start). Für die Sonnenseite wurde sie dort mit der Prüfhilfe `drehen()` gedreht. FB steht als Maßstab links neben der Baum-Schleife.

## 6 · Kritik-Verlauf (frischer Kritiker je Runde, nur ABSICHT, GENRE, Belege, Prompt, Matrix; ab Runde 2 Paarvergleich gegen den besten Stand)
Achsen F und G waren in allen Runden n/a (ab Runde 2 auch F).

| Runde | A | B | C | D | E | H | Mittel | Paarvergleich | wichtigste Befunde → Reparatur |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 7 | 6 | 5 | 6 | 5 | 6 | 5,86 (F 6) | – | Lebkuchenhaus und Sessel verdecken den Zug, Rauch durch den Sessel, Laterne wächst aus dem Hut, Baum leuchtet abends nicht → Anordnung neu, Leuchthof am Baum |
| 2 | 7 | 7 | 5 | 6 | 6 | 6 | 6,17 | besser A, B, E, H | Zug fährt durch FB (Beleg-Stellung), Schal löst sich vom Hals, Rauch durch Hocker → FB weg vom Gleis, Schal am Körper, Rauch steigt schneller |
| 3 | 7 | 7 | 6 | 7 | 6 | 6 | 6,50 | besser C, D, E, H | FB am Bildrand angeschnitten, Rauch durch Baum und Geschenke, Laterne abends schwach |
| 4 | 7 | 7 | 6 | 6 | 6 | 6 | 6,33 | schlechter C (FB in den Zweigen) | 1. Runde ohne Verbesserung |
| 5 | 7 | 7 | 6 | 7 | 7 | 6 | **6,67** | besser A, sonst gleich | Rauch scheint durch Körper; FB in den Dreiviertel-Stills hinter dem Baum; Rauch abends dunkelgrau; ungleichmäßiger Bildtakt der Aufnahme |
| 6 (WS0-Freigabe) | 7 | 7 | 6 | 7 | 6 | 6 | 6,50 | netto gleich: C, H leicht besser, E gemischt (Dreiviertel-Still: Zug hinter dem Baum) | Rauch zieht weiter durch Schneemann und Sessel; Zug je Runde ≈ 1,5 s hinter dem Baum; unruhiger Boden, Horizont-Flicken |

Nach 5 Runden war das Höchstmaß erreicht (bester Stand R5 = Commit `9f93ebff`).

**Runde 6 (WS0, 23.11. spät):**
- WS0 hat einen Eingriff in `dustTrail` freigegeben: `depthTest` als Option von `createThrustSmoke`. Befund: Das Puff-Material in `createDustPuffView` hat schon heute `depthTest: true` (nur `depthWrite: false`). Der Schalter hätte also nichts geändert, und ich habe `dustTrail` nicht angefasst (git diff leer). Ein Jetpack-Vorher/Nachher-Still entfällt deshalb, weil der Jetpack-Pfad bytegleich ist.
- Der sichtbare „Durchgang“ kommt woanders her: Die kameragerichteten Puff-Scheiben schneiden sich weich mit Körpern bzw. liegen davor, und es fehlt ein weiches Ausblenden an der Tiefe (soft particles).
- Umgesetzt:
  - Dampf hellgrau-weiß, Deckkraft 0,30–0,44, kleinere Puffs (nur Parameter)
  - Ausweich-Suche ≤ 3 m
  - Prüfhilfe `versetzen(x, z)`
  - Beleg ohne FB im Bild: FB steht seitlich hinter der Kamera
- Belegt am selben ebenen Platz wie R5: Die geplante Instanz wird dorthin versetzt, es entsteht keine zweite.
- Belege: `_privat/belege_r6/`. Mittel 6,50.
- Bester Stand nach Mittel bleibt R5. Der Code-Stand ist R6 (`bf662c6e`), weil WS0 diese Änderungen angeordnet hat.

## 7 · Aqua-Schnittstelle (Kurzfassung, vollständig in `src/world/weihnacht/README.md`)
```js
createWeihnacht({ cfg, urls /* Dateiname → URL */, at: [x, z], yaw, groundAt, clock /* Weltzeit s */, takt? /* Schlag aus der Musik */,
  player?, rauch?: ({ einheit, farbe, auftrieb, leben }) => createThrustSmoke(...), worldScale, classScale, suchen? })
// → { object3d, ready, update(dt), status, debug, messen, lichtQuellen, clayTargets, holders, drehen, dispose }
```
- Kein Import aus M1World. Aqua braucht `three`, den GLTFLoader, `src/npc/bandClock.js` und optional `src/modules/dustTrail.js`.
- Asset-Last: **1,43 MB**.
- Ohne `rauch` fährt die Bahn ohne Fahne, ohne `groundAt` steht die Szene auf y = 0.
- Takt: `takt()` kann den Schlag aus Aquas Musik vorgeben, sonst gilt die Ork-Band-Uhr.

## 8 · Abweichungen, Annahmen, offene Punkte
1. **Blind-Kritik nicht bestanden (6,67).** Der kleinste Blocker liegt außerhalb dieses Auftrags: Der vorhandene Düsenrauch (Puffs ohne Tiefentest, `renderOrder 7`) zeichnet über Körper. Deshalb sieht die Fahne aus, als ginge sie durch Baum, Schneemann und Geschenke; abends wirkt sie dunkelgrau. Der Brief verbietet neuen Rauch-Code. Vorschlag: eine Karte an den Owner des Rauch-Moduls (Tiefe oder weiches Ausblenden an Körpern, Nachtfarbe). Ich habe nichts geändert.
2. **Weitere Kritik-Punkte, die nicht im Modul liegen:**
   - Flicken- bzw. Streifentextur am Horizont abends (Gelände, Fernzellen)
   - wandernder, knallbunter Boden um die Szene
   - unruhiger Bildtakt der Video-Aufnahme: MediaRecorder unter GPU-Last, ≈ 300 von 450 Bildern verschieden
   - kein Handy-Beleg
3. **Ton.** Im Musik-Katalog gibt es keinen Weihnachts-Titel (gefunden nur „The Christmas Truce“, thematisch unpassend und nicht im Katalog). Der Schneemann wippt deshalb auf der Ork-Band-Uhr wie die Ork-Band selbst; die Band spielt ihre Musik ebenfalls nicht hörbar. Im Katalog steht `ton.datei: null` mit Hinweis. Der Wirt kann den Schlag über `takt()` an echte Musik koppeln. Die Achse G war deshalb n/a.
4. **Katalog-Status `pruefen`.** So steht es im Brief. Der vorhandene Unit-Test `test/unit/szenen.mjs` kennt nur fertig, baubar und idee. Er war schon im Stamm rot und läuft in der CI nicht als Pflicht. Ändert WS0 den Status auf `baubar`, ist das eine Ein-Wort-Änderung.
5. **Ausweich-Suche jetzt ≤ 3 m (R6) – Zielkonflikt mit „nichts schwebt“.** Ich habe die Plätze gemessen, die der Verteiler im Umkreis von 5 km für `weihnacht_baum` plant. Auf allen 10 Plätzen liegt der Gelände-Rest über der besten Ebene bei 0,18–1,0 m (r = 3 m).
   - Am geplanten Platz der Belege schwebt das Gleis mit ≤ 3 m Suche 14 cm, Requisiten talseitig bis 21 cm (`belege_r6`, erster Lauf, verworfen). Erst nach einer Suche über 14 m (R1–R5) waren es 2,8 cm.
   - Ich habe eine Ebenheits-Prüfung im Szenen-Wirt getestet (`eben_max_m`). Sie ließ 0 von 10 Plätzen zu, das Sprungziel wäre dann unerreichbar. Ich habe sie deshalb wieder entfernt.
   - Entscheidung für WS0, eine der drei Optionen:
     - (a) größere Suche mit KEEPOUT = `fuss_r_m`
     - (b) Gelände-Plateau unter Szenen mit Gleisen (Gelände-Owner)
     - (c) Schweben auf hügeligen Plätzen hinnehmen

   **WS0 hat (a) entschieden; umgesetzt in `91374e04`:**
   - Suche wieder bis 14 m. Der Katalog trägt `such_r_m: 14`, der Lader reicht den Wert als `suchMax` an das Modul.
   - Die Suche geht immer vom Planplatz aus; es gibt kein Weiterwandern beim zweiten Setzen.
   - KEEPOUT für Bewuchs um die Szenen-Plätze: `max(9·K, fuss_r_m + such_r_m)` = 18,1 m statt fest 5,9 m. Andere Szenen bleiben unverändert.
   - Gate am geplanten Platz neu gemessen (`_privat/gate_r6a/`):
     - versetzt um 14 m
     - Gleis schwebt 2,8 cm, nichts sinkt ein
     - Requisiten-Luft ≤ 1,8 cm
     - Achsabweichung 0,92 cm
   - CI 230/232 (Rückfall 0), Smoke-Test grün.
6. **Spielerkörper.** FB kann durch Baum und Gleise laufen; die Requisiten der Szenen haben im Spiel generell keine Kollision. Der Zug weicht dem Spieler nicht aus.
7. **Beleg-Kamera.** Nahe dem Start greift die feste Kamera (`kopie`) nicht: `feuerDraw` rendert in der Nähe des Amphitheater-Feuers (70 m) in ein Ziel, und das Override in `beleg.mjs` überspringt Ziel-Renderings. Ich habe deshalb am geplanten Platz belegt. Das ist ein allgemeiner Befund für `test/lib/beleg.mjs` bzw. `feuerNaht` (fremder Owner, nicht angefasst).
8. **Licht.**
   - Tagsüber lesen sich die Lichter nur als helle Punkte: Emission ohne Bloom, kein eigenes Licht erlaubt.
   - Der warme Schein entsteht nur nachts über die Lichtinseln (Rig-Option). Er überlagert sich mit der Laterne zu einer großen, hellen Bodenfläche.
9. **Konzeptblatt.** Ein Konzeptblatt nach V-561 gab es nicht. Die Anordnung folgt Georgs Vorlage, die Ein-Satz-Absicht steht im Brief.
10. **Fußhocker.** Er wurde nach Runde 3 wieder entfernt, weil er in der Rauchbahn stand.

## 9 · Nachtrag Georg q864 (Lichterkette als Welle), Commit `b6d746fc`
- Die Lichterkette blinkt jetzt als laufende Welle: Die Lichter gehen nacheinander die Kette entlang an und wieder aus.
  - Die Lichter sind nach ihrer Lage auf der Spirale geordnet (Höhe, bei gleicher Höhe der Winkel) und in 12 aufeinanderfolgende Gruppen geteilt.
  - Die Welle läuft einmal je Takt (4 Schläge der Ork-Band-Uhr) von unten nach oben, mit weicher Flanke.
  - Zwischen den Wellen sind die Lichter fast aus (6 % der Leuchtkraft).
- Beleg: `_privat/belege_r7/weihnacht_abend_baum.mp4` (6 s, Abend, Preset dreiviertel, nah am Baum) und ein Still.
- CI 230/232 (Rückfall 0), Smoke-Test grün. Keine Kritikrunde.

