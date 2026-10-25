# WSB · FrizzleBob R8 Ohren · zwei Proben, eine Entscheidung (Georg q221 TUNE)

**Tier 0**
1. Nur ein Ohr trägt den Biss, wie in der Referenz `fb_meshy_ears_head.jpg`: FBs linkes Ohr (im Frontbild rechts).
2. Beide Ohren haben dieselbe Form und Größe. Kein eigenes Modellieren; erlaubt sind nur Spiegeln, gleichmäßiges Skalieren, starres Verschieben und der Biss-Schnitt mit Meshys eigener Biss-Kontur (Georg q218: aus dem Meshy-Original 1:1, keine eigenen Maßnahmen).
3. Abnahme nur über die Bühne v1.3 (Knete, Licht, Augen, Gates wie R7) ; das Blatt wie unten beschrieben.

**Georgs Befund zu R7 (q221):**
- „total inkonsistent“: Im Frontbild sind beide Ohren angebissen. Ursache: Das linke Meshy-Ohr mit Biss wurde gespiegelt, der Biss kam mit.
- „die ohren sind klobiger als die alten ohren“ (v5 in R5).

**Bitte zwei Proben bauen, beide sonst wie R7** (Bind-Korrektur, Gewichte nach v5-Profil, Naht durch starres Einsinken, Mund b, E2-Lider, Rig und Clips unverändert):
- **Probe A (alte Form):** die Ohr-Meshes `FB_Ear_L_v5`/`FB_Ear_R_v5` aus `R5/FB_R5_candidate.glb` (sha256 a8949dfe…, Stand vor R7) unverändert, rechts wie bisher; nur FBs linkes Ohr bekommt den Biss als Schnitt mit Meshys Biss-Kontur, übertragen über die eine Kopf-Transformation (× 1,798). Die Fransen am Biss-Rand werden wie in R7 gesäubert (höchstens 1,0 cm). Das ist Georgs ausdrücklicher Wunsch „sauber ausgebissene Ecke ohne die Ausziehungen am Rand“; darüber hinaus wird nichts geglättet.
- **Probe B (Meshy-Form, schlank geprüft):** Basis ist das unangebissene Meshy-Ohr (FBs rechtes) 1:1 über die Kopf-Transformation, gespiegelt auf die linke Seite. Nur links kommt der Biss als Schnitt mit Meshys Biss-Kontur dazu. Keine Ausdünnung. Biss-Rand gesäubert wie in Probe A.

**Blatt** `R5/R8/FB_R8_ohren_AB.jpg`, groß und lesbar: jede Kachel mindestens 700 px breit, auf Kopf und Ohren beschnitten, kein Kontaktbogen:
- Zeile 1 Referenz, Zeile 2 R5 (v5), Zeile 3 Probe A, Zeile 4 Probe B, je drei Viertel, Seite, vorn;
- je Zeile unter dem Bild: Ohrdicke (größte Stärke senkrecht zur Ohrfläche) und Ohrbreite in cm sowie die Gesamthöhe der Figur, verglichen mit dem Sollwert 1,81 m. Eine Abweichung nur melden; über die Höhe entscheidet Georg zusammen mit der Formwahl.

**Selbstprüfung vor dem Melden:** In jeder Ansicht jeder Probe genau ein Biss, und zwar an FBs linkem Ohr. Sonst nicht melden.

**Rückgabe:** zwei GLBs mit sha256 in `R5/R8/`, Blatt, Abschnitt R8 in `RETURN.md`, STATUS-Zeile. Nicht kanonisch. FB bleibt gesperrt bis auf diesen Ohren-Auftrag (Georg q218/q221). Den Kanon-Eintrag macht WS0 nach Georgs Wahl.
