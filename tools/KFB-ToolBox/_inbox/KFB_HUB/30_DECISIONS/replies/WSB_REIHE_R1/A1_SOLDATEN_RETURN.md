# WSB_REIHE_R1 · Auftrag 1 · Plastik-Spielzeugsoldaten mit KFB-Augen · RETURN

WSB (Mac mini), 14.11.2026. Brief: `30_DECISIONS/replies/WSB_REIHE_R1/BRIEF_WSB_REIHE_R1.md` §1. Konzeptblatt: `replies/WSB_REIHE_R1/KONZEPTBLATT.md`. Spielstand gelesen: `game/integration-r2` @d3e8cdf0. Nichts ins Spiel eingebaut, nichts gepusht.

## Ergebnis
- **Charakter `plastic_army_soldier`** (`karten/plastic_army_soldier.character.json`, `kfb.character/2`), getrennt vom KayKit-`toy_soldier`.
  - Vier Farbvarianten im Feld `variants`: grün Gewehr, beige Streuung, blau Schnellfeuer, grau Scharfschütze. Die Farben sind wie heute.
  - Im `appearance`-Block stehen eyeRig, originals (remove/keep/cover), Mund, Knete und augenR2.
- **Figurenkarten für die Bühne** (`karten/plastic_army_soldier_<farbe>.figure.json`), je Variante eine, jede mit eigener Lidfarbe.
- **Modell `glb/plastic_army_soldier.r4.glb`** = `army_green_r3.glb` plus zwei Knoten `eye_anchor.l/.r` als Kinder von `Head`.
  - Netze, Haut, 53 Clips, Materialien und Erweiterungen sind unverändert. Geprüft mit `scripts/vergleich.mjs`: gleiche Zugriffsdaten (8756), gleiche Animationen, Skins und Materialien; nur 2 Knoten mehr.
  - Asset-Pass: `glb/plastic_army_soldier.r4.asset_pass.json`, vollständig.
- **Augen**
  - Augen R2 auf dem Gesicht unter der Helmkante, an der Stelle der Original-Augen.
  - Original-Augen: zwei schwarze vertiefte Quadrate von je 2,4 cm, Geometrie in GreenBody. Es gibt kein eigenes Netz zum Ausblenden; die KFB-Augen überdecken sie.
  - Anker: ±0,040 m, Höhe 1,628 m, vorn 0,122 m. Radius 0,023 m, das ist die Kartenregel 0,08 · Kopfbreite / 1,085 mal augenR2-Größe 1,15.
  - converge 0,12, Pupille matte-cute 0,42.
- **Lider:** E2 in der dunkleren Hautfarbe je Variante, nach augenR2.skinLidTone (LID_RULE):

  | Variante | Lidfarbe |
  |---|---|
  | grün | #47721c |
  | beige | #97855a |
  | blau | #375ca4 |
  | grau | #7f848a |

- **Mund:** Vorschlag Originalmund (GreenMouth, SMILE mit 15 Mundformen aus dem Paket). Am Nahbild entscheidet Georg.

## Belege (`proof/`)
- `uebersicht_p2.png`: je Farbe Gesicht nah mit Augen auf und zu, Ganzkörper vorn und seitlich (Clip idle).
- `r1/<farbe>/`: Kontaktbogen und Einzelbilder je Farbe in vorn, seitlich und Gesicht nah, je mit Augen Ruhe, halb und zu.
- `schussfolge.png`: firing_rifle_standing seitlich, Bild 0/2/4/6/8 von 9.
- **Augen leben**
  - Lidschlag in drei Stufen (Ruhe, halb, zu) auf jedem Kontaktbogen.
  - Blickziel: `r1/blick/pupil_measure.json`. Die Pupillen bleiben bei Blick links, rechts, oben und unten sichtbar (2992–3023 px).
- **Augensitz über alle 53 Clips (V-1122):** `data/augensitz_53clips.json`.
  - Je Clip fünf Stichproben.
  - Die Anker relativ zum Kopfknochen streuen 0,0 mm.
  - Der Abstand zum Helm ist in allen Clips gleich.
  - Der Sitz bleibt fest, nur der Blick dreht.

## Gate (Proof-Stage v1.2)
- G1 Augen PASS (seat eye-anchor, 2 Augen, 2 E2-Lidhäute), G2 PASS, G5 PASS, G6 PASS, alle vier Farben.
- **G3 nur mit `--liftCm 4.48`:** Der Sockel (GreenBaseplate) liegt in allen Clips 4,48 cm unter dem Ursprung (idle, Feuern, Gehen gemessen). Ohne Anhebung FAIL. Siehe Befund 5.
- G4 WARN: kleine Inseln und offene Kanten der Paket-Geometrie (Colt, Holster, M1, Mund-Ebene), unverändert aus dem Paket.

## Befunde für WS0
1. **Schattenempfang:** `src/world/arena/arenaSoldat.js:46` setzt `receiveShadow = false`. Soll ist `true` wie bei allem im einen Rig (V-385, CANON Gebiet 7). Ein eigenes Fehlerbild aus dem Spiel habe ich nicht gemacht; die Codezeile ist der Beleg.
2. **Farben sind keine Paket-Texturen:**
   - Beige, blau und grau entstehen zur Laufzeit als Ton über die Paket-Palette (`arenaGegner.js` WAFFE.*.ton → `arenaSoldat.js` farbeAn).
   - Das Paket hat mindestens Tan-Dateien (`AH-Tan.png` wird in `GEGNER_R1/scripts/build_army.py` umbenannt). Die Paket-Ordner liegen nicht auf dem Mac mini.
   - Nicht selbst umgefärbt. Die Beleg-GLBs `glb/*_<farbe>.beleg.glb` backen nur denselben Laufzeit-Ton für die Bühne ein; das Spiel tönt weiter zur Laufzeit.
3. **Grau gegen Konzeptblatt:** Der Scharfschützen-Ton #8a8f96 liegt nah an Mittelgrau. Das Konzeptblatt sagt „kein Grau als Figurenfarbe“ (Kanon K2: kein Mittelgrau). Georg entscheidet.
4. **Lidfarbe im Spiel:** `augenR2.applyAugenR2` liest den Haut-Texel der ungetönten Palette. Getönte Soldaten bekämen dort grüne Lider. Die Karte trägt deshalb je Variante die eigene Lidfarbe (`variants[].lid`).
5. **Sockel versinkt 4,48 cm:** `holder.y = groundAt` setzt den Ursprung auf den Boden, der Sockel steckt dann 4,5 cm im Boden.
   - Entweder ist das gewolltes Einsinken (dann als SINK der Figur festhalten),
   - oder der Darsteller hebt um 0,045 m an.
   - Die GLB habe ich dafür nicht geändert (Clips unverändert).

## Kritiker (CRITIC_3D_R1, Figurenabnahme) · STOPP-BERICHT

Zwei blinde Kritiker-Läufe mit je frischem Agenten. Gesehen haben sie nur die Bilder, das Konzeptblatt, CRITIC und den Kanon. Gezählt werden K4, K6 und K10.

| Runde | Stand | K4 | K6 | K10 | Mittel | Urteil |
|---|---|---|---|---|---|---|
| R1 | Ordner `proof/r1`, Anker 1,628 m | 7 | 7 | 6 | 6,7 | REWORK |
| R2 | Ordner `r2/`, Modell r5 | 6 | 7 | **8** | 7,0 | REWORK |

**R1 → R2 behoben (meins):**
- Oben am Augapfel schauten zwei schwarze Keile hervor; das waren die Ecken der Original-Augenquadrate.
- Behoben, indem die Anker auf deren Mitte (1,631 m) und 4 mm nach vorn (0,126 m) sitzen. Danach war K10 von 6 auf 8.
- Neu ist die Fuß-Nahaufnahme `detail_low`.

**Offen, außerhalb meiner Grenzen.** Deshalb stoppe ich hier und baue kein eigenes Licht, keine eigene Knete und keine neue Pose:
1. **Schwebende Fußspitze (K4, „Immer ein Befund“):**
   - Im Clip `idle` ragt die linke Fußspitze über die Sockelhälfte und hängt frei. Gilt für alle Farben.
   - Ursache: Paket-Clip und Sockel-Logik aus army_green_r3 („Basis-Hälften folgen den Füßen“). Die Clips bleiben unverändert (V-574).
   - Lösungsweg für WS0: größere Sockelhälften bzw. Sockel am Ballen statt am Knöchel (GEGNER_R1 `build_army.py`). Das wäre ein Umbau der Figur und braucht Georgs Ja.
2. **Augen ohne Helmschatten (K6):**
   - Die Augäpfel unter der Helmkrempe sind voll hell; der Krempenschatten fällt nicht auf sie.
   - Ursache: das Kanon-Augenmodul der Bühne (pet-eye-rig.v6, „eye meshes without clay and without shadow casting“). Wie die Augen Schatten empfangen, entscheidet WS0 bzw. WS1 im Modul, nicht die Figur.
3. **Blick im Halbprofil schwer lesbar (K10, R2):**
   - In der Schussfolge (seitlich) ist das Auge ein kleiner heller Punkt unter der Krempe.
   - Ursache: Die Augen sitzen nach Kartenregel an der Stelle der Original-Augen unter dem Helm. Größer als die Regel (r 0,023 m) gehe ich nicht ohne Vorgabe.
   - Frage an Georg über WS0: Augen größer bzw. tiefer, oder so lassen?

Kritiker-Hinweise ohne Wertung:
- G4 WARN steht auf allen Blättern (Paket-Kleinteile).
- G7 gibt es in der Bühne nur für Edelstein-Knoten; hier N/A.
- Grau widerspricht dem Konzeptblatt (Befund 3).

**Gültiger Stand ist R2:** `r2/glb/plastic_army_soldier.r5.glb`, dazu Karten, Proofs, Asset-Pass, die Charakterkarte `r2/karten/plastic_army_soldier.character.json` und `r2/data/augensitz_53clips.json` (Streuung 0,001 mm). Die Dateien im Ordner oben (r4, `proof/r1`) bleiben als Runde 1 liegen.

## Dateien
- `glb/`: r4-Modell, Asset-Pass, vier Beleg-GLBs, `varianten.json`
- `karten/`: character/2 und vier figure/1
- `proof/`
- `data/`
- `scripts/`: `anker.mjs`, `varianten.mjs`, `karten.py`, `vergleich.mjs`, `augen_mess.py`, `sitz53.py`
