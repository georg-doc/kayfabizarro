# FB Web-Kanon R1 · RETURN (WSB, Mac mini, 14.11.2026, V-1743)

**Ergebnis:** FrizzleBob als eine GLB-Datei, die in reinem three.js (GLTFLoader + MeshoptDecoder) so aussieht wie im Spiel und mit AnimationMixer lebt. Dazu zwei Varianten als eigene Dateien. Gültig ist **r1b**.

| Datei (`_privat_kauf_asset/`) | Größe | sha256 (Anfang) | Inhalt |
|---|---|---|---|
| `FB_WEB_KANON.r1b.glb` | 3,86 MB | a258d0ac3d9d0b84 | FB mit T-Shirt R2 (Hauptdatei) |
| `FB_WEB_KANON_twin.r1b.glb` | 4,08 MB | 4cb1cf2af4abd435 | FB mit Jetpack Twin am Rücken |
| `FB_WEB_KANON_agent.r1b.glb` | 3,31 MB | 169b07d4092f1dff | FB als Kayfabe-Agent (Entwurf bis zur Hub-Abnahme) |

- Alle drei liegen unter 8 MB.
- Die `.r1.glb` daneben sind Stände vor der Kritik (Augen ohne Glanz, Knet-Normal zu stark) und stehen auf der Löschliste.
- Volle Prüfsummen: `SHA256SUMS.txt`.

## Wie gebaut
FB wird nicht nachgebaut, sondern aus dem laufenden Spiel abgegriffen:
- **Quelle:** lokaler Build von `game/integration-r2 @2ea34061` mit `assets/private @53d36640`, Release-Schalter aus `build.json` (u. a. augen=r2, fbleben=r1, gesicht=r2, haltung=r1, fbmund=r1).
- **`scripts/r1b/wk_export.mjs`:**
  - lädt das Spiel im Browser und wartet, bis die Knete gebacken ist;
  - setzt die Gesichtsruhe;
  - hält die Spiel-Schleife an;
  - setzt FB in die Bindepose;
  - schreibt FB mit `GLTFExporter`.
  - Spielcode bleibt unverändert.
- **Gesicht beim Export:**
  - Mimik-Basis `mund_oh` (Ruhe „oh“);
  - Lider in FBs Grundstellung (oben 0,08, unten −0,4);
  - Blick Mitte;
  - die Brauen bewegen sich im Spiel ständig, eingefroren wird ein Bild nahe ihrer Mittellage.
- **Knete:**
  - Die Bake-Texturen des Spiels (clayBake T0–T2) werden mit der Formel aus kfb-clay v1.1 zu einem Farb- und einem Normal-Atlas (1024²) gerechnet.
  - Die Normal-Stärke ist 0,8, gemessen gegen das Spielbild gleicher Kamera.
  - Rauheit wie im Spiel (mindestens 0,72).
- **Augen:** Lederhaut und Pupille bleiben `MeshPhysicalMaterial` mit Klarlack wie im Spiel, darum mit Glanzpunkt.
- **`scripts/r1b/wk_phase2.mjs`:** Clips, Mund-Einschübe, Gesichts-Leerlauf, Normal-Stärke.
- **`scripts/r1b/wk_pack.mjs`:** Meshopt-Kompression (`EXT_meshopt_compression`, `KHR_mesh_quantization`), Farbatlas als JPEG.
- **`scripts/r1b/wk_check.mjs`:** Prüfung je Datei.

Laden in three.js:
```js
const g = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync('FB_WEB_KANON.r1b.glb')
```
- `MeshoptDecoder` kommt aus `three/addons/libs/meshopt_decoder.module.js`.
- Beispielseite: `scripts/r1b/web/beispiel_reines_threejs.html` (Clip-Auswahl, Gesicht läuft mit). Im Browser geprüft: 25 Körper-Clips, keine Fehler.

## Maße
- Höhe **1,742 m** (Bindepose, Ohrspitzen), Ursprung zwischen den Füßen, Blick nach +Z.
- Der Maßstab des Spiels (0,6166 am Knoten `pose-root`) ist übernommen; im Export ist nichts nachskaliert.
- Der Brief nennt 1,81 m. Das Spiel misst 1,742 m in Ruhe und etwa 1,63 m in der Ruhe-Animation (Ohren hängen).

## Inhalt je Datei
- **Körper:**
  - v5b mit linkem Ohr aus A11 (19 179 Ecken) und rechtem Ohr;
  - Hasenschwanz;
  - T-Shirt R2 (der Agent ohne Shirt, wie im Spiel unter dem Anzug).
- **Gesicht:**
  - KFB-Augen (EyeRig v6, Augen R2) mit E2-Lidhaut in FB-Lidfarbe;
  - Brauen, Nase;
  - Mund Satz A `gpt_a_r2`, Ruhe „oh“.
- **26 Clips:**
  - **Ruhe:** `Idle_A` und der Ruhe-Pool h1 (`kfb_idle_standing_idle_03_a`, `kfb_idle_happy_a`, `kfb_idle_drunk_idle_variation_a`, `kfb_idle_ninja_a`, `kfb_idle_mutant_idle_a`).
  - **Gesten aus dem Pool:** winken, zeigen, reden, necken, grüßen.
  - **Fortbewegung:** `Walking_B`, `Running_A`, `Running_B`, `Jump_Start`, `Jump_Idle`, `Jump_Land`.
  - **Flug:** die 8 Clips aus `FLY_CLIPS` (`flight_idle_hover`, `flight_cruise`, `flight_boost`, `flight_dive`, `flight_brake_recover`, `flight_bank_left`, `flight_bank_right`, `flight_land_prepare`).
  - **Gesicht:** `FB_Gesicht_Leerlauf`.
  - Quellen: `WSB_HALTUNG_R1/clips_fb` und `FLIGHT_FAMILY_01` (KFB_Flight.r1h).
- **Gesichts-Leerlauf `FB_Gesicht_Leerlauf`** (12 s, Schleife):
  - Blickwechsel als Sakkaden (0,09 s), Pupillenwinkel höchstens 0,42 rad wie fbLeben.
  - Blinzeln 0,18 s, davon eines beim großen Blickwechsel und ein Doppelblinzeln.
  - Die Lider folgen dem Blick: Blick nach unten senkt das Oberlid, Blick nach oben hebt das Unterlid.
  - Mund-Einschübe: smile 5,0–6,2 s, d 8,6–9,4 s, sonst oh.
- **Twin:**
  - Jetpack am Sitz des Spiels unter `spine`, ausgeklappt wie im Flug (im Spiel bis zum Flug auf 0,001 eingeklappt).
  - Anker nach dem Twin-Vertrag: `KFB_Jetpack_Anchor`, `KFB_Jetpack_Twin`, `KFB_Thrust_L`, `KFB_Thrust_R`.
- **Agent:**
  - Spy-Körper `kfb_spy_fbagent.r3.glb` (gültige Fassung aus Reihe R1 Auftrag 6) mit Fliege;
  - gebunden mit der Logik von `attachFbAnzug` 1:1 und `FB_KOERPER.spy = { prefix: 'Spy_', extra: ['BowTie'], fell: true }`;
  - Hände mit FB-Fell (216 Dreiecke).

## Knoten zum Steuern in three.js
Vollständige Bäume: `data/r1b/knoten_fb.txt`, `knoten_twin.txt`, `knoten_agent.txt`.

| Knoten | Was | Wie |
|---|---|---|
| `FB_Auge_L_Blick`, `FB_Auge_R_Blick` | Blick (Pupille) | Drehung Euler XYZ: x = −ny·0,5, y = nx·0,5 (nx, ny von −1 bis 1); Betrag höchstens 0,42 rad. Ruhe = keine Drehung. |
| `FB_Lidhaut_L`, `FB_Lidhaut_R` | Lider (E2-Haut) | Morphs `oben_halb`, `oben_zu`, `unten_halb`, `unten_zu`, `zu`. Bezug ist FBs Grundstellung, alle 0 = offen. Blinzeln: bis zur Hälfte `oben_halb` + `unten_halb` hoch, dann nach `zu` überblenden. |
| `FB_Mund_oh`, `FB_Mund_smile`, `FB_Mund_d` | Mundform | genau einer auf Skalierung 1 (oder `visible`), die anderen 0. Das Netz sitzt in einem namenlosen Kindknoten, darum den benannten Knoten schalten. |
| `FB_Braue_L_Pivot`, `FB_Braue_R_Pivot` | Brauen | position.y heben, rotation.z neigen |
| `FB_Nase_Pivot`, `FB_Pupille_L/R`, `FB_Lederhaut_L/R` | Nase, Pupille, Augapfel | Netze |
| `root`, `hips`, `spine`, `chest`, `head`, `upperarm.l` … | Skelett Rig_Medium | Knochennamen wie in den KayKit-Clips (mit Punkt) |

## Prüfung
- **Kanon-Wache** (`data/r1b/pruefung.json`), alle drei **ok**:
  - linkes Ohr A11, rechtes Ohr und Schwanz vorhanden;
  - alle Gesichtsknoten vorhanden, 5 Lid-Morphs, Gesichts-Clip 12 s mit 7 Spuren.
- **Bildpaare Spiel ↔ Web** (`blaetter/W1_paare_spiel_web.r1b.jpg`, Einzelbilder in `bilder_r1b/<variante>/`):
  - Gleiche Kamera, gleiche Lichter, 900×1100.
  - Das Spielbild rendert der Spiel-Renderer mit den Spiel-Materialien (Knete-Shader), das Webbild reines three.js mit der GLB.
  - Mittlere Abweichung je Pixel (0–255, vorn / seitlich / Gesicht): FB 2,5 / 2,0 / 3,1, Twin 2,5 / 2,7 / 3,2, Agent 1,7 / 1,6 / 3,1 (`data/r1b/paar_metrik.json`).
- **Clips und Gesicht im reinen three.js:**
  - `blaetter/W2_clips_web.r1b.jpg` (Flug-Clips für das Bild 0,6 m angehoben);
  - `blaetter/W3_gesicht_leerlauf.r1b.jpg`.
- **Packen:** gepackt gegen ungepackt mittlere Abweichung unter 0,2 je Pixel.

## Blinde Kritik (CRITIC_3D_R1, Figurenabnahme) · STOPP-BERICHT

| Runde | K4 | K6 | K10 | Mittel | Urteil |
|---|---|---|---|---|---|
| R1 (Stand r1) | 8 | 7 | 7 | 7,3 | REWORK |
| R2 (Stand r1b) | 9 | 6 | 8 | 7,7 | REWORK |

**R1 → R2 behoben:**
- Augen im Web hatten keinen Glanzpunkt; jetzt Physical-Material mit Klarlack wie im Spiel.
- Knet-Dellen im Web zu tief; jetzt Normal-Stärke 0,8.
- Flug-Clips standen im Bild am Boden; jetzt angehoben.
- Zeigen war nicht lesbar; jetzt das Bild bei 3 s.

**Ohne Befund in R2:**
- FB und Agent: Spiel und Web praktisch gleich.
- Augen, Lider, Blick und Mund-Einschübe lesen sich.
- Bodenkontakt, kein Gleiten.

**Offen (der Kritiker zählt beides gegen das Web, beides kommt aus dem Spiel):**
1. **Twin-Jetpack ohne Knetkorn (K6):**
   - Im Spiel bekommen die Jetpack-Teile ihr Korn zur Laufzeit aus dem Shader; anders als bei FB wird es nicht gebacken. Darum hat der Export dort nur Grundfarbe und Rauheit (Tanks glatt, rotes Band wirkt rosa).
   - Weg: Backt das Spiel den Jetpack wie die Figur (clayBake), nimmt der Exporter das ohne Änderung mit. Das ist ein Schritt im Spielcode, darum an WS0.
2. **Geschlossenes Lid mit hellem Spalt (K10):**
   - Der Morph `zu` ist genau die Stellung „zu“ des Spiel-Rigs (Lid-Winkel 1,30 − 1,18 = 0,12 rad je Lid). Im Spiel sieht man denselben Spalt.
   - Soll das Lid ganz schließen, gehört das ins Augen-Rig (WS0/Georg).
- Dazu ein kleiner Befund ohne Punkte: Der Hasenschwanz wirkt im Web etwas grauer als im Spiel.
- Nach zwei Runden höre ich hier auf. Die Hauptdatei FB besteht den Vergleich mit dem Spiel; die offenen Punkte brauchen Änderungen im Spiel.

## Bekannte Abweichungen
1. **Agent, Fell-Hände:**
   - Im Spiel tragen sie FBs Knete-Material. Im Web sind sie FB-Gelb ohne Knetkorn, weil die Hand-Dreiecke des Anzugs keine Lage im Knete-Atlas haben.
   - Die hautfarbenen Dreiecke am Handgelenk (Reihe R1, offener Punkt 1) bleiben, weil die Spiel-Logik sie so zuteilt.
2. **`kfb_idle_standing_idle_03_a`:** Dieser Clip dreht und senkt die Figur über den Wurzelknochen. Das Spiel spielt ihn genauso ab; nichts korrigiert.
3. **Schatten:** Wer im Web ein gerichtetes Licht mit Schatten nutzt, sollte `shadow.normalBias ≈ 0,02` setzen, sonst gibt es Schattenstreifen auf der Wange (die Beispielseite tut das).

## Hinweise an WS0
- **Twin-Platte:**
  - Sie bringt ein eigenes Skelett mit, dessen Bindung im Wurzelknochen den Maßstab 1,56 trägt (gebunden im Sitz).
  - Ruft Code `Skeleton.pose()` auf allen Skeletten der Figur auf, setzt dieses Skelett die geteilten Knochen um, und FB schrumpft auf 0,64.
  - Im Spielbetrieb ohne `pose()` fällt das nicht auf. Mein Export lässt dieses Skelett beim Posieren aus.
- **Kayfabe-Agent im Spiel:** braucht `FB_KOERPER.spy` und die Adresse in `garderobe.js` (wie in Reihe R1 beschrieben).
- **Eintrag in der Figurendatei:** `appearance.export.web` → `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON.r1b.glb`.
- **Folgeauftrag Dramatis Personae:**
  - Allgemein sind schon: Abgreifen, Knete backen, Clips, Packen, Prüfung, Spiel-Gegenbild.
  - FB-eigen sind noch: die Namen der Gesichtsknoten, die Ohr-Anzahl und die Mimik-Ruhe. Daraus mache ich Einträge je Figur.

## Ordner (gültig r1b)
- `_privat_kauf_asset/*.r1b.glb`
- `blaetter/W1–W3 *.r1b.jpg`
- `bilder_r1b/`
- `data/r1b/`: Export-Logs, Phase 2, Prüfung, Metrik, Knotenbäume
- `scripts/r1b/`: Exporter, Phase 2, Packen, Prüfung, Bilder; `web/view.html` (Prüf-Viewer), `web/beispiel_reines_threejs.html`
