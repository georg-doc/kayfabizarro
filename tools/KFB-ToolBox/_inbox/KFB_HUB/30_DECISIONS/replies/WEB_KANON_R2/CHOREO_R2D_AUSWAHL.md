# Choreo R2d · Auswahl Katana (Hero-Shot v9 und Spiel) · 15.11.2026

Grundlage: 18 Kandidaten aus `MINI_r2d`, Messung je Bild (`messung_kandidaten_je_bild.json`, `messung_sichtung_je_bild.json` @0aeab754), WSBs `extreme_r2d.v2.json`, Messblatt r1f.
Choreo-Datei: `fb_katana_hero_v9.choreo.json` (gleicher Ordner).

## Kurz
1. **Senkrecht (Schnitt 1–4): Kette c2** (`Jump_Start` → `Melee_1H_Attack_Jump_Chop` → `Jump_Land`). Einziger echter fallender Hieb aus dem Sprung, Klinge sauber, Sprung steckt ehrlich im Clip.
2. **Waagerecht unten (Schnitt 5): `FB_Katana_dash` → `FB_Katana_waagerecht`.** Der wahre Kontakt liegt bei 0,27 s, nicht bei 0,50 s. 0,50 s ist schon das Ausschwingen.
3. **Waagerecht am Scheitel (Schnitt 6–8): Kette b4**, dreimal mit steigender Sprungbahn. Kontakt bei halber Drehung, Kamera seitlich, dann ist es keine Rückenansicht. Schnitt 8 mit dem Ausholen aus `Melee_2H_Attack_Spin`.
4. **Zeitlupe bei Schnitt 1, 5 und 8**, immer im Ausholen. Davor und danach volles Tempo, Hit-Stop 48 ms im Kontakt.
5. **Ehrlich:** Ein echter Luft-Hieb mit Drehung fehlt. b4 ist ein Notbehelf (Drehung ohne Ausholen, Beine stehen in der Luft). Dafür auf Mixamo „Standing Melee Attack 360 High“ warten.

## Was ich als Extrem zeige
- **Ausholen-Extrem:** tiefste Hocke oder höchste Klinge vor dem Hieb. Das ist das Haltebild.
- **Impact-Extrem:** das Bild im Hit-Stop, Klinge im Karton. Ich nehme den schnellsten Moment der Spitze als Kontakt.
- **Ausschwingen:** erster Ruhepunkt danach. WSBs „impactS“ in v2 ist bei mir das Ausschwingen (c2 1,17 s, a1 0,33 s).
- Mittelbilder des Schwungs zeige ich nie als Standbild.

## Hero-Shot: Schnittliste

Zeiten: **Clip** = Zeit im Clip oder in der Kette. **Film** = Spielzeit der Choreo mit Zeitlupe und Hit-Stop. Gesamtlänge 14,25 s.
Seite hängt an fünf Klammern. Vier senkrechte Schnitte von links nach rechts, dann vier waagerechte von unten nach oben. Die Karten fallen erst nach Schnitt 8.

### Baustein S: fallender Hieb (Kette c2, 1,63 s)
| Moment | Kette | im Clip | Messwert |
|---|---|---|---|
| Ausholen am Boden (Hocke) | 0,27 s | `Jump_Start` 0,27 | Hüfte 0,17 m (tiefster Punkt), Spitze 0,19 m |
| Absprung | 0,33 s | | |
| Scheitel | 0,67 s | Chop 0,43 | Hüfte 0,60 m |
| **Ausholen in der Luft** | 0,87 s | Chop 0,63 | Spitze 1,84 m über dem Kopf, FB fällt schon |
| Landung der Füße | 0,93 s | Chop 0,70 | |
| **Kontakt** | 1,00 s | Chop 0,77 | schnellster Moment, Spitze 0,68 m |
| **Ausschwingen** | 1,17–1,20 s | Chop 0,95 | Spitze 0,25 m, Hüfte 0,19 m, tief geduckt |

- Die Höhe steckt im Clip (Hüfte +0,36 m, 0,60 s Flug). Die Bühne gibt nur den Weg zur nächsten Schnittlinie. Keine Zusatzhöhe, sonst stimmt die Flugzeit nicht.
- Die Klinge läuft von 1,84 m bis 0,25 m. Die Schneidematte berührt sie nicht.
- Schnitt 2–4 als Dreierfolge: Ausstieg bei Kette 1,20 s, Überblendung 0,15 s in `Jump_Start` 0,13 s. Ein Sprung dauert so 1,07 s. Diese Naht (N1) ist noch nicht gemessen.

### Schnitt 1 · senkrecht · Zeitlupe
- **Clips:** `FB_Katana_dash` (ganz, 0,40 s) als Anlauf, dann c2 von 0,07 bis 1,20 s.
- **Extreme (Film):** Hocke 1,10 s · Klinge über Kopf 2,26 s (**Haltebild**) · Kontakt 2,49 s · Ausschwingen 2,70 s.
- **Richtung:** oben nach unten. **Sprungphase:** Kontakt im Fallen, mit der Landung.
- **Rampe (Zeitfaktor):** 1,0 bis Film 1,57 → 0,15 von 1,66 bis 2,33 (Kette 0,78–0,88, Klinge über Kopf) → 1,2 ab 2,43 (zwei Bilder vor Kontakt) → Hit-Stop 48 ms bei 2,49 → 1,0.
- **Kamera:** Start im Profil, tief auf Hüfthöhe, weit. In der Zeitlupe Orbit 120° um FB vom Profil nach schräg vorn, steigt auf Kopfhöhe, kommt näher. Im Kontakt steht sie.
- **Gesicht:** `zielen` (Gefühl `konzentration`) im Ausholen, `anstrengung` kurz vor Kontakt, `treffer` im Kontakt.
- **Impact:** Stoß Stärke 0,8, 5 Bilder, nach unten, gedämpft. Seite biegt sich am Schnitt nach unten und federt. Ton: `katana.r1.swing` 0,08 s vorher, Kontakt über `katanaPlanR1` contact.

### Schnitt 2 · senkrecht · schnell
- **Clips:** c2 von 0,13 bis 1,20 s (Naht N1).
- **Extreme (Film):** Hocke 2,87 s · Klinge über Kopf 3,47 s · Kontakt 3,60 s · Ausschwingen 3,82 s (**Haltebild**, tief geduckt).
- **Richtung/Phase:** wie Schnitt 1. **Zeitlupe:** nein, Hit-Stop 48 ms.
- **Kamera:** Schnitt auf Profil, Brusthöhe, normale Optik. Fährt seitlich mit FB an der Seite entlang, bis Schnitt 4 durch ist. Kein Umschnitt in der Dreierfolge.
- **Gesicht:** `anstrengung`, im Kontakt `grimmig`.
- **Impact:** Stoß 0,35, 3 Bilder, nach unten. Seite biegt und federt.

### Schnitt 3 · senkrecht · schnell
- Wie Schnitt 2. **Film:** Hocke 3,99 s (**Haltebild**) · über Kopf 4,59 s · Kontakt 4,72 s · Ausschwingen 4,94 s.
- **Impact:** Stoß 0,4, 3 Bilder, nach unten.

### Schnitt 4 · senkrecht · schnell
- Wie Schnitt 2. **Film:** Hocke 5,11 s · über Kopf 5,71 s (**Haltebild**) · Kontakt 5,84 s · Ausschwingen 6,06 s.
- **Impact:** Stoß 0,5, 4 Bilder, nach unten. Etwas stärker, weil die Dreierfolge hier endet.

### Schnitt 5 · waagerecht unten · aus dem Lauf · kurze Zeitlupe
- **Clips:** `FB_Katana_dash` (ganz) → `FB_Katana_waagerecht` von 0,03 bis 0,60 s, Überblendung 0,1 s.
- **Extreme (Clip waagerecht):** Ausholen 0,20 s (Körper 47° eingedreht, Spitze 0,59 m) · Kontakt 0,27 s (Spitze 0,63 m, schnellster Moment) · Ausschwingen 0,50 s (Spitze 0,385 m).
- **Film:** Ausholen 7,02 s (**Haltebild**) · Kontakt 7,08 s · Ausschwingen 7,36 s.
- **Richtung:** waagerecht in Laufrichtung. **Sprungphase:** keine, am Boden.
- **Rampe:** 1,0 bis 6,54 → 0,2 von 6,62 bis 7,02 (Clip 0,12–0,20, eingedreht) → 1,2 sofort → Hit-Stop bei 7,08 → 1,0.
- **Kamera:** schräg vorn, auf Kniehöhe, weit. Kurzer Orbit 60° in der Zeitlupe.
- **Gesicht:** `zielen`, dann `anstrengung`, im Kontakt `grimmig`.
- **Impact:** Stoß 0,7, 5 Bilder, in Hiebrichtung. Der untere Streifen biegt sich in Hiebrichtung und federt.

### Schnitt 6 · waagerecht · Scheitel eines kleinen Sprungs · schnell
- **Clips:** Kette b4 von 0,10 bis 1,10 s, wie gemessen. Sprungbahn +0,30 m, 0,50 s Flug.
- **Extreme (Kette):** Hocke 0,27 s · Kontakt 0,58 s (halbe Drehung, schnellster Moment, Scheitel) · Ausschwingen 0,90 s (Drehung fertig, landet).
- **Film:** Hocke 7,63 s · Kontakt 7,94 s (**Haltebild**) · Ausschwingen 8,30 s.
- **Kamera:** steht dort, wohin FB nach einer Vierteldrehung schaut. Dann sieht man: Profil, Gesicht, Profil im Kontakt. Der Rücken kommt erst nach dem Kontakt. Kranfahrt mit den Sprüngen nach oben bis Schnitt 7.
- **Gesicht:** `anstrengung`, im Kontakt `grimmig`.
- **Impact:** Stoß 0,4, 3 Bilder, in Drehrichtung der Klinge.

### Schnitt 7 · waagerecht · Scheitel eines mittleren Sprungs · schnell
- **Clips:** Kette k7 = b4 mit 0,12 s `Jump_Idle` nach `Jump_Start`, Drehung läuft ganz aus, `Jump_Land` bei 0,99 s. Sprungbahn +0,65 m, 0,73 s Flug. Naht N2 offen.
- **Extreme (Kette):** Hocke 0,27 s · Kontakt 0,70 s · Ausschwingen 1,19 s (tiefste Landung).
- **Film:** Hocke 8,67 s (**Haltebild**) · Kontakt 9,10 s · Ausschwingen 9,64 s.
- **Kamera:** wie Schnitt 6, die Fahrt läuft durch.
- **Impact:** Stoß 0,5, 4 Bilder, in Drehrichtung.

### Schnitt 8 · waagerecht oben · Scheitel des höchsten Sprungs · Zeitlupe
- **Clips:** Kette k8: `Jump_Start` bis 0,30 s → `Melee_2H_Attack_Spin` ab 0,25 s (blendS 0,2) → `Jump_Land` bei Kette 1,16 s. Sprungbahn +1,00 m, 0,90 s Flug. Nähte N3 offen.
- **Rückfall, falls N3 nicht hält:** k7 mit höherer Bahn, Zeitlupe dann im `Jump_Idle` kurz vor der Drehung.
- **Extreme (Clip Spin):** Ausholen 0,40–0,57 s (Klinge hoch hinter der Schulter, Spitze 1,27 m) · Kontakt 0,73 s (erster Peitschenmoment, FB schaut noch schräg nach vorn) · Ausschwingen 1,33 s (Überdrehen).
- **Film:** Hocke 9,98 s · Ausholen in der Luft 10,59 s (**Haltebild**) · Kontakt 11,35 s am Scheitel · Landung 11,85 s · Ausschwingen 12,05 s.
- **Rampe:** 1,0 bis 10,17 → 0,15 von 10,26 bis 11,13 (Clip 0,45–0,58, Klinge hoch, FB steigt) → 1,2 ab 11,30 → Hit-Stop bei 11,35 → 1,0.
- **Kamera:** Untersicht von schräg vorn, weit. In der Zeitlupe Orbit 150° um FB, steigt bis auf Klingenhöhe. Im Kontakt steht sie auf Kopfhöhe.
- **Gesicht:** `zielen` im Ausholen, `anstrengung`, `treffer` im Kontakt. Nach der Landung Blick zur Kamera, `triumph` (Gefühl `stolz`).
- **Impact:** Stoß 1,0, 6 Bilder, in Hiebrichtung. Stärkster Stoß des Films.
- **Danach:** Karten fallen bei 11,85 s mit der Landung. `FB_Katana_wegstecken` ab 12,45 s, Kamera ruhig von vorn.

### Impact-Paket, für alle acht gleich gebaut
- **Reihenfolge:** Schwung-Ton → Tempo 1,2 → Kontakt → Hit-Stop 48 ms → Stoß und Reaktion starten im selben Bild → Tempo 1,0.
- **Kamerastoß:** nur in Richtung der Schnittkraft, gedämpft, ein Ausschlag und ein halber zurück. Kein Zufallswackeln. Stärken: 0,8 · 0,35 · 0,4 · 0,5 · 0,7 · 0,4 · 0,5 · 1,0.
- **Reaktion:** Schnitt 1–4 Ziel `seite`, biegt sich nach unten und federt. Schnitt 5–8 Ziel `karte`, biegt sich in Hiebrichtung und federt.
- **VFX:** nur das Spielrezept `katana.hit` (Schicht `staub`) aus `src/data/combat/katanaReference.r1.json`, am Kontaktpunkt, in Schnittrichtung. Nichts am Boden.
- **Licht und Funken:** keiner. Das einzige Funken-Rezept ist `katana.hit.metal` (`metal-specks`), das passt nicht zu Karton. Kein Aufblitzen der Schnittkante.
- **Papierfetzen:** In `src/data/combat/trefferEreignisse.r1.json` gibt es unter `ausbruch` das Material `paper`. Ob es ohne Explosion nutzbar ist, habe ich nicht geprüft; bis dahin ohne.
- **Ton:** `katana.r1.swing` und der Kontakt-Weg aus `src/audio/katanaPlan.r1.js`. Karton gibt es dort nicht als Material. Nächster Bestand ist `wood` (`hit_holz`). Das muss WS-Audio bestätigen.
- **Matte:** Die Klinge trifft sie nie. Darum gibt es dort keinen Stoß, auch nicht bei der Landung.

## Spiel

| Angriff | Clip | Fenster | Ausholen | **Kontakt (Hit-Stop, VFX)** | Ausschwingen |
|---|---|---|---|---|---|
| Leicht 1 | `Melee_1H_Attack_Slice_Diagonal` (`KFB_Katana_diagonal_R1`) | 0,03–0,60 s | 0,30 s (Spitze 0,90 m, eingedreht) | **0,42 s** | 0,50 s (0,13 m) |
| Leicht 2 | a1 `Sword_Regular_A` | 0,13–0,43 s | 0,20–0,23 s (geduckt, Spitze 0,03 m) | **0,27 s** | 0,33 s (1,52 m) |
| Leicht 3 | `Melee_1H_Attack_Chop` (`KFB_Katana_chop_R1`) | 0,13–0,80 s | 0,37 s (1,60 m) | **0,60 s** | 0,67 s (0,36 m) |
| Schwer, FB | b1 `Sword_Regular_C` | 0,20–0,80 s | 0,43 s (mitten in der Drehung) | **0,67 s** | 0,73–0,80 s |
| Schwer, NPC | b3 `Melee_2H_Attack_Spin` | 0,13–1,50 s | 0,40 s (1,27 m) | **0,73 s**, Trefferfenster bis 1,27 s | 1,33 s |
| Sprungangriff | Kette c2 | 0–1,63 s | Hocke 0,27 s, Klinge oben 0,87 s | **1,00 s** (Füße landen 0,93 s) | 1,17 s, steht wieder 1,63 s |
| Landung ohne Hieb | c1 `Jump_Land` | 0–0,67 s | | Aufsetzen 0,07 s | tiefster Punkt 0,20–0,33 s |

- **Leichte Folge:** schräg nach unten, von dort hoch, dann der Hieb von oben. Leicht 1 endet tief, Leicht 2 beginnt tief.
- **Leicht 1:** Die Spielkarte hat den Kontakt bei 0,467 s. Da ruht die Klinge schon. Der schnellste Moment ist 0,40–0,43 s.
- **Leicht 2:** Klinge geht durch Gesicht und Kopf. Braucht den festen Versatz, sonst erst mit Mixamo ersetzen.
- **Schwer, FB:** b1 ist einhändig. Nur das Fenster nehmen. Davor und danach steckt die Spitze im Boden.
- **Schwer, NPC:** b3 ist zweihändig und für FB im Spiel gesperrt.
- **Sprungangriff:** Der Chop-Clip hebt die Hüfte selbst um 0,36 m. Mit der Sprungphysik des Spiels darf das nicht doppelt zählen. Das klärt WS1.

## Verworfen
- **a2:** Spitze steckt 15 cm im Boden und wartet dort.
- **a3:** Der schnelle Moment liegt im Hocken, im Sprung hängt die Klinge, Kopf am Boden.
- **a4:** Salto ohne Hieb.
- **a5:** Klinge steht im Kontakt vor dem Gesicht, ganze Bewegung in tiefer Hocke, zweihändig.
- **a6:** Hieb im Rücken verdeckt, über vier Sekunden lang.
- **b2:** zwei Drehungen, Hieb erst nach der Landung und schräg, Klinge durch den Kopf.
- **b5:** zwei schräge Hiebe nach unten statt eines waagerechten, Spitze am Boden.
- **b6:** gebückt, Klinge durch den Kopf, Spitze 20 cm im Boden.
- **c3:** Bruchlandung, Kopf am Boden.
- **c4:** Klinge steckt bis 41 cm im Boden.
- **c5:** fast kein Nachfedern.
- **c6:** Klinge durch Jetpack und Kopf.

## Wartet auf Mixamo
| Clip | ersetzt voraussichtlich |
|---|---|
| Standing Melee Attack 360 High | Schnitt 7 und 8 (k7, k8), wenn er Höhe und ein echtes Ausholen hat. Dann auch Schwer für FB. |
| Standing Melee Attack 360 Low | Schnitt 6 und als Variante Schnitt 5. |
| Corkscrew Evade | nur, wenn die Klinge dabei waagerecht läuft: Schnitt 8. Sonst Übergang zwischen zwei Schnitten. |
| Spin Flip Kick | kein Klingenhieb. Höchstens Schlussfigur. Geringe Erwartung. |
| Falling To Landing, Swing To Land | Landung nach dem hohen Sprung (Schnitt 8) statt `Jump_Land`. |
| Stable Sword Outward / Inward Slash | Schnitt 5 und die leichte Folge. Ersetzt a1 (Klinge im Gesicht). |
| Sword And Shield Slash, Pro Sword And Shield Pack | einhändige leichte Folge, Schwer für FB statt b1, vielleicht ein zweiter Sprunghieb für Schnitt 2–4. |

**Bleibt auch mit Mixamo offen:** echtes Wegstecken der Klinge.

## Für WSB Teil B

### Zu rendern als Extrem-Bilder
Je Zeile drei Bilder: Ausholen, Kontakt, Ausschwingen. Kamera von der Seite oder schräg vorn, nie von hinten.

| Kandidat | Ausholen | Kontakt | Ausschwingen |
|---|---|---|---|
| c2 Kette | 0,27 s und 0,87 s | 1,00 s | 1,17 s |
| `FB_Katana_waagerecht` | 0,20 s | 0,27 s | 0,50 s |
| b4 Kette | 0,27 s | 0,58 s | 0,90 s |
| b3 `Melee_2H_Attack_Spin` | 0,40 s | 0,73 s | 1,33 s |
| a1 | 0,20 s und 0,23 s | 0,27 s | 0,33 s |
| b1 | 0,43 s | 0,67 s | 0,77 s |
| `Melee_1H_Attack_Slice_Diagonal` | 0,30 s | 0,42 s (Bild 0,433) | 0,50 s |
| `Melee_1H_Attack_Chop` | 0,37 s | 0,60 s | 0,67 s |
| c1 `Jump_Land` | 0,10 s | 0,07 s Aufsetzen | 0,27 s |

- b4 bitte mit Kamera dort, wohin FB nach einer Vierteldrehung schaut, und mit Sprungbahn +0,30 m.

### Nähte messen (Einstiegsbild und blendS wie bei b4 und c2)
- **N1:** `Melee_1H_Attack_Jump_Chop` 0,967 s → `Jump_Start` 0,13 s.
- **N2:** `Jump_Idle` 0,12 s → `Melee_2H_Attack_Spinning` 0,167 s.
- **N3:** `Jump_Start` 0,30 s → `Melee_2H_Attack_Spin` 0,25 s, und `Melee_2H_Attack_Spin` 1,11 s → `Jump_Land` 0 s.

### In die Web-Datei
`Jump_Start`, `Jump_Idle`, `Jump_Land`, `Melee_1H_Attack_Jump_Chop`, `Melee_2H_Attack_Spinning`, `Melee_2H_Attack_Spin` unverändert. Ob sie in r1f schon liegen, habe ich nicht geprüft.

## Nicht geprüft
- Ich habe nur Standbilder und Messwerte gesehen, keine laufenden Clips.
- k7 und k8 sind aus Messwerten gerechnet, nicht abgespielt.
- Die Kamerarichtungen bei b4 folgen aus dem Drehwinkel. Auf welcher Seite die Klinge im Kontakt steht, muss das Extrem-Bild zeigen.
