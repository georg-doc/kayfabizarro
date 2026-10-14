# Befunde zur KFB ToolBox beim Einbau von FrizzleBob v5 · R1 · 14.10.2026

**Von:** WS1, Darsteller-Slot. **An:** WS0 und den Owner der ToolBox / Rigging-Lane (Claude Design).
**Grundlage:**
- ToolBox Production-06, Session-Cut 30.09. r1 (main @ac9dbaed), lokal nachgelaufen, alle 45 Prüfsummen OK;
- zum Vergleich die späteren Cuts r2 (Production-06) und 01.10. r1 (Production-08) sowie Joyride J17.

**Prüfweg:** Bildpaar ToolBox | Spiel aus gleicher Kamera und gleichem Eintrag (`scripts/fb/donor-pair.mjs`, Test `test/actors.mjs`).
Am Spender ist nichts geändert. Die Eingriffe für die Aufnahme sind unten genannt und betreffen nur die Prüfsitzung.

## A · Befunde an der ToolBox (Vorschläge an ihren Owner)

| # | Befund | Folge | Vorschlag |
|---|---|---|---|
| A1 | **Das Posenwerkzeug setzt die Arme anders an.** Im Studio- und Rigging-Tab schreibt `_studioBones` mit `pose-rig.v1` jede Bildfolge eine eigene Haltung (Arme ab). Das GLB selbst steht in T-Pose. | Die ToolBox-Bilder (Belege 01, 02, 04) zeigen die Pose-Rig-Haltung, nicht die Bindepose. Ein Bildpaar gegen ein Spiel in Bindepose weicht deshalb im Körper ab (Gesichtsausschnitt 12,1/255, mit gleicher Haltung 3,0/255). | Neben jedem Beleg vermerken, welche Haltung gezeigt ist (Bindepose / pose-rig / Clip). Für Abnahmen einen Schalter „Bindepose“ anbieten. WS1 hat für die Referenz `_studioBones` in der Prüfsitzung übersprungen und `skeleton.pose()` gesetzt. |
| A2 | **Die Kennung `frizzlebob-earrig-v5` lädt ab Cut r2 die Figur v5b** (FLOPPY-01 hat `EAR.figPin` auf 23615cff gestellt; P08 und J17 ebenso). Der Name blieb gleich. | Werte und Belege nach dem 30.09. 04:21 können auf v5b eingestellt sein, obwohl „v5“ dasteht. Der Fehler fällt nicht auf. | Eine eigene Kennung je Figur (`frizzlebob-earrig-v5b`), gespeicherte Einträge ebenfalls je Figur. |
| A3 | **Georgs Einstellungen liegen nur im localStorage** des Browsers (`kfb-toolbox-production-06`, ab 01.10. `-08`). P06 und P07 schrieben eine Zeit lang in denselben Schlüssel und überschrieben sich gegenseitig (RETURN FB-LIDS-LEVEL-FIX-01 §0). | Kein Verbraucher kann Georgs Look nachbauen. J17 hat deshalb eigene Werte fest eingesetzt, WS1 nutzt vorläufige Werte aus den Belegen (siehe C). | Bei jedem Session-Cut den Rigging-Export (`kfb.pets/1`, Rigging › Import · Export) als Datei mit in den Cut legen. |
| A4 | **Abnahme 1–7 hängt am gespeicherten Eintrag, der Beleg nennt ihn nicht.** Nachlauf ohne Eintrag ergibt 6/7: Punkt 6 „Spiegel“ hat Normale Δ 0,127° bei einer Grenze von 0,1°, weil der Standard-Anker greift. | Der 7/7-Beleg lässt sich nicht wiederholen. | Den Eintrag (eye, clayLids, original.*) als Schnappschuss ins Abnahme-JSON schreiben. |
| A5 | **Mit Georgs Augenhöhe (dy 0,21) verdecken die Rig-Augen die Modellbrauen.** Die Brauen erscheinen dann nur noch als schwarze Reste neben den Augen. Im Beleg 04 stehen sie darüber. | Georgs Eintrag enthält also eine Brauen-Verschiebung (`original.brows.lift`), die nicht im Repo steht. | Kommt mit A3. WS1 nutzt vorläufig lift 0,18, geschätzt nach Beleg 04 (Probe 0,10/0,14/0,18). |
| A6 | **Ungepinnte Netzquellen:** Die Mund-Decals lädt `pet-mouth.v1` von `raw.githubusercontent.com/…/main/…` (`MOUTH_BASE`), `pet-library` lädt über `PET_BASE` ebenfalls von main. | Ändert sich main, ändert sich der Mund ohne neuen Pin. | Auf einen Commit pinnen. WS1 nutzt Kopien von main @ac9dbaed (13 Dateien, Blobs geprüft). |
| A7 | **Der gemalte Mund steht in ¾ und Seitenansicht vor dem Gesicht** (bekannt seit RETURN r1). MOUTH-FIT-01 gibt es nur in der v5b-Linie. | Auch im Spiel sichtbar (Bildpaar ¾). | MOUTH-FIT-01 auf v5 übertragen oder bestätigen, dass v5 so bleibt. |
| A8 | **Zwei Fassungen von `eyeoval.v1`:** Die ToolBox P06 nutzt @8922d4b1 (Blob 397e5174, ohne `pupilSeatDelta`), das Eye-Rig-Studio cloudflare-live nutzt @2bfbe0d (mit `pupilSeatDelta`). | Die Pupille, die durchs Lid scheint, gibt es nur bei der neueren Fassung (F1-Naht). Bei FrizzleBob mit Knet-Lidern ist die Pupille bei Lid zu ganz verdeckt: ToolBox 0 von 2836 Strahlen, Spiel 0 Pixel. | Für den Rigging-Owner: Die Ursache der F1-Naht liegt in der neueren eyeoval-Fassung bzw. am fehlenden Knet-Lid. |
| A9 | **Der Lid-Mechanismus ist nicht eindeutig:** Der Beleg lief mit `hinge`, Georgs Speicherstand war laut RETURN LIDS-02 `glide`. | Unklar, welcher Look gilt. | Georgs Wahl kommt mit dem Export (A3). WS1 nimmt bis dahin `hinge`, also den Beleg. |
| A10 | **Die Mundbild-Spur läuft über `setTimeout`** (`_lipRun`). | Wiederholungen sind nicht bildgenau. | Im Spiel läuft die Spur über den Takt des Hosts (dt je Bild, höchstens 0,1 s), Spur und `setTex`-Aufrufe sind gleich, das erste Mundbild kommt sofort. Für die ToolBox nur ein Hinweis. |
| A11 | **`brow-rig.v2` und `pet-moustache.v1` laden immer `kfb-ink-canon.js`,** auch wenn Modellbrauen gewählt sind. | Mit `parts.brows: original` bleibt das Rig aus. Im Spiel ist keine Tusche zu sehen (V-204 geprüft am Bild). | Kein Handlungsbedarf, nur ein Hinweis für die Plain-Regel. |
| A12 | **three-Fassung:** Der Spender läuft auf three 0.160, das Spiel auf 0.186.1. | Kein sichtbarer Unterschied (Gesicht 2,0–2,4/255, Augenlage bis auf die 4. Stelle gleich). | — |
| A13 | **Die Pupillen-Feder im Eye-Rig wird bei wenigen Bildern pro Sekunde instabil** (G4-Vorprobe 14.10. spät): `pet-eye-rig.v6.js` (853bcf5f) Z. 331 rechnet `_pvx += (_tx − _px)·150·dt − _pvx·13·dt` als einfachen Schritt je Bild. Ab etwa 0,15 s pro Bild schwingt sie auf. Die Brauen folgen dem Blick (face-mount `browLife`, `gaze`) und fliegen mit davon. | Auf der Bühne headless (≈ 5 Bilder/s) wuchs `_px` je Bild um das 2,3-Fache, nach etwa 30 s stand eine Braue auf der Brust. Die ToolBox hat dasselbe Verhalten auf schwachen Geräten oder in einem Hintergrund-Tab. | Gesicht mit begrenztem Schritt rechnen (Teilschritte ≤ 1/30 s), wie es ear-dangle schon tut (`P.substep`). WS1 macht das im Host (`faceMountActor`, `FACE_STEP`), die Lib bleibt 1:1. Test `slowFramesStable`: 40 × update(0,25) bleibt stabil, die Gegenprobe ohne Teilschritte erreicht 10³⁹. |
| A14 | **Brauen- und Nasenfarbe der Original-Teile stehen nicht im Export** (WS0 14.10.). | Im Spiel trägt die Original-Nase die Modellfarbe #b0131e, Georgs Export sagt `nose.color` #e96049. Die Brauen stimmen zufällig, Modell und Export haben beide #17130f. | Farben der Original-Teile mit exportieren. WS1 setzt bis dahin `brow.color`/`nose.color` aus dem Export auf die Original-Teile, je Figur mit eigenem Material. Das Bildpaar gegen den P08-Spender läuft mit Modellfarben (`partcolors=model`). |

## B · Was WS1 beim Einbau beachtet bzw. korrigiert hat
1. **Gleiches Ergebnis wie die ToolBox:**
   - Der Einbau folgt der Reihenfolge der ToolBox: Mixer, Gesicht (applyLids · face.update · postRig mit Lid-Schräge „clean“ und clay-lids.sync), Weltmatrizen, Ohren.
   - Ergebnis: eyeFrame bis auf die 4. Stelle gleich, Bild 2,0–2,4/255 (Augen eingefroren).
2. **Netzquellen lokal, Spender unverändert:**
   - Die Mund-Decals setzt der Host über das exportierte Objekt `MOUTH_SETS.male` auf lokale Adressen.
   - Den Haar-Spender lädt ein Loader, der `DONOR_URL` auf die Kopie umlenkt.
3. **Knotennamen:** GLTFLoader entfernt Punkte aus Knotennamen (`ear.l.1` → `earl1`). `ear-dangle` findet sie trotzdem über die eigene Regel. Der Test ist entsprechend angepasst.
4. **Blick:** Beim Sitz `surface` hängt der Pupillen-Drehpunkt unter `kfb-pupil-free` (face-mount Z. 213). Der Blicktest misst deshalb `e._pivot` statt `children[1]`, und `lookAt` nutzt `pointTo` des Eye-Rigs.
5. **Lid-Messung:** Der Messausschnitt enthält keine Brauen und keinen Hintergrund. Als Pupille zählt nur neutrales Schwarz; den bräunlichen Lid-Schatten zählt der Test nicht mit.
6. **Nicht übernommen (Studio-Werkzeuge):** pose-rig, Kontaktschatten, Oberfläche K2 und die Emote-Tabelle. Die Emotes kommen mit D1.

## C · Vorläufige Werte (Georg 14.10.: „das können wir nachher alles austauschen“)
Alle vorläufigen Werte stehen mit Quelle in `ws1/kfb-planet/src/data/actors/frizzlebob-v5.recipe.json`:
- **Augen:** Abstand 0,455, Höhe 0,21, Matte cute und #F2C93C aus Beleg 04; ring 0,255 aus MEASURE.json; Oval 1,06/1,04/0,98/−25 aus CURRENT_STATE r1.
- **Brauen:** lift 0,18, geschätzt.
- **Lider:** hinge.
- **Ohren:** Standard-Rig.

Austauschen heißt: eine Datei ersetzen. Der Code ändert sich dabei nicht.
