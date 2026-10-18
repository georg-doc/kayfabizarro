# B29 · Mauer-Gizmo aus dem Scan + 2 Landmarken-Kandidaten (V-439) · RETURN (WSB, 2026-10-18)

**Stand:** Baukasten, Häute, Fußzone und Fugentest sind fertig. **Abnahme-Bögen fehlen noch:** Bühne v1.2 ist nicht freigegeben (WS0 18.10.), die Bühnen-GLBs liegen bereit (`kit/proof/`). Alle Bilder hier sind interne Blender-Prüfungen, keine Abnahme.

## Intake (`data/intake.json`)
| Datei | Ablage | Größe | sha256 (Anfang) | Lizenz | Prüfung |
|---|---|---|---|---|---|
| Scan Stone Monument | `_src/scan_stone_monument/` | 52,8 MB | `13b34847…` | CC0 (BlenderKit-API: Autor „Free poly“, cc_zero; Prüfung durch WS0) | 0 Skripte, 0 Treiber; 2 Objekte, 328 k Dreiecke |
| Pyramid Diorama | `_privat_kauf_asset/_src/pyramid_diorama/` | 19,3 MB | `f7f1c628…` | Royalty Free → privat | 0 Skripte, 0 Treiber; 61 Objekte (5 Lichter), 238 k Dreiecke |
| Liberty Island | `_privat_kauf_asset/_src/liberty_island/` | 72,4 MB | `c7ff7df4…` | Royalty Free → privat | 0 Skripte, 0 Treiber; 2 Objekte, 391 k Dreiecke |

- Georg hat den Download im WSB-Chat freigegeben.
- Jede Datei liegt in einem eigenen leeren Ordner und wurde nur mit `--disable-autoexec` geöffnet.
- Das Mausoleum ist **nicht** geladen.

## 1 · Mauer-Baukasten (`kit/`, Skript `scripts/b29_wallkit.py`)
**Vorschlag zu den Maßen (WS0 entscheidet, eine Zahl je Wert im Skript):**
- Zelle **4.0 u** (2,46 m).
- Höhe **3.6 u (2.218 m)**. FrizzleBob ist 2,94 u (1,81 m) groß, eine Medium-Figur sieht also nicht über die Mauer.
- Dicke: 0.95 u am Fuß, 0.62 u an der Krone, Fuß-Ausstellung 0.2 u je Seite.
- Lichter Gang zwischen zwei Mauern ≈ 3 u (1,85 m).
- Torbreite 2.2 u, ohne Sturz. Die V-438-Höhe für einen Sturz kommt mit den v1.2-Werten.

**Aus dem Scan übernommen:** die Form des Querschnitts (Fuß breiter, nach oben schmaler, runde Krone, Verhältnisse cartoonig verdickt) und die unruhige Oberkante (Hochpass des Scan-Profils, ±0,10 u). Das Relief der Fläche kommt **nicht** in die Geometrie, sondern als Haut (unten). Die Teile bleiben dadurch schlank (≈ 1–3 k Dreiecke).

**Raster:**
- Die Mauer läuft durch die Zellmitte.
- Die Anschluss-Ringe liegen exakt auf den Mitten der Zellkanten.
- Ursprung ist die Zellmitte am Boden; bei `straight_long` die gemeinsame Kante.
- In glTF ist +Y oben, die Mauer läuft in ±X/±Z.

| Teil | GLB | Dreiecke | Anschlüsse (Blender-Achsen) | Hinweis |
|---|---|---|---|---|
| `straight` | `kit/KFB_Wall_straight.r1.glb` | 1360 | -X, +X |  |
| `straight_long` | `kit/KFB_Wall_straight_long.r1.glb` | 2720 | -X, +X |  |
| `corner` | `kit/KFB_Wall_corner.r1.glb` | 1224 | -X, +Y(Blender)=-Z(glTF) |  |
| `tee` | `kit/KFB_Wall_tee.r1.glb` | 2073 | -X, +X, +Y |  |
| `cross` | `kit/KFB_Wall_cross.r1.glb` | 2720 | -X, +X, -Y, +Y |  |
| `end` | `kit/KFB_Wall_end.r1.glb` | 944 | -X |  |
| `gate` | `kit/KFB_Wall_gate.r1.glb` | 1992 | -X, +X |  |
| `broken` | `kit/KFB_Wall_broken.r1.glb` | 1360 | -X, +X |  |
| `curved_quarter` | `kit/KFB_Wall_curved_quarter.r1.glb` | 1088 | -X, +Y | Viertelkreis r = C/2 um die Zellecke, schließt wie corner |
| `curved_ring_r3` | `kit/KFB_Wall_curved_ring_r3.r1.glb` | 1632 | Bogenenden | Polar-Labyrinth: Ring r = 3C, Bogen 22,5°; Ursprung = Ringmitte, 16 Stück = Vollkreis |

**Budget-Vorschlag:** ≤ 3 k Dreiecke je Zellmodul, ≤ 6 k bei `straight_long`. Das Ergebnis liegt bei 0,9–2,7 k.

**Fußzone (aus dem Gelände wachsen, V-301/V-403):**
- Punkt-Attribut `_kfb_foot` (glTF `_KFB_FOOT`): 1 am Boden, 0 ab 0,8 u (smoothstep). Das Speckle-Modul färbt später danach.
- Geometrisch geht der Fuß 0,20 u in die Breite (Ausstellung).

**Material und Lizenz:**
- `kfb_role_stone_1` (Rolle wie bei B27, Farbe zur Laufzeit, Knete zur Laufzeit), kein Licht und keine Textur im Kit.
- Lizenz: eigene Geometrie + Profil aus dem CC0-Scan, also **öffentlich**.

## 2 · Häute (`skins/`, Skript `scripts/b29_skins.py`)
| Haut | Name | Dateien | Pixel | Kachel | Nahtprüfung (medianer Sprung) |
|---|---|---|---|---|---|
| W1 | Lehmstein (Scan-Relief) | `skins/W1_clay_stone_height.png` + `skins/W1_clay_stone_normal.png` | 1024×512 | 2.0×1.0 u | Kante 0.0033/0.00218 vs. innen 0.00389 |
| W2 | Ziegelrelief (Läuferverband) | `skins/W2_brick_height.png` + `skins/W2_brick_normal.png` | 1024×512 | 2.0×1.0 u | Kante 0.0/0.0 vs. innen 0.0052 |
| W3 | Feldstein | `skins/W3_fieldstone_height.png` + `skins/W3_fieldstone_normal.png` | 1024×1024 | 2.0×2.0 u | Kante 0.01277/0.01169 vs. innen 0.00516 |

- Höhe als 16-bit PNG, Normale als 8-bit PNG (OpenGL, +Y oben). Kachelbar in beide Richtungen, gedacht für Triplanar bzw. objekt-normiert wie `kfb-clay.v1.1`. Farbe bleibt Knete.
- **W1** entsteht aus dem Scan-Relief: Hochpass ~5 cm, nahtlos per Vierfach-Überblendung (varianzerhaltend).
- **W2** ist ein Läuferverband (Ziegel 0,5 × 0,2 u).
- **W3** ist Feldstein: periodisches Voronoi mit 25 Steinen je Kachel.
- Sichtprüfung 2×2 gekachelt: `renders/skins_preview_2x2.png`.

## 3 · Fugentest (`data/seamtest.r1.json`, Skript `scripts/b29_seamtest.py`)
Die Module werden per 90°-Drehung auf das Muster gesetzt und verbunden. Punkte unter 0,1 mm Abstand werden verschmolzen, dann zähle ich die offenen Kanten oberhalb des Bodens:

| Layout | Teile | offene Kanten vorher → nachher |
|---|---|---|
| 2x2_loop | corner | 272 → **0** |
| 2x2_round | curved_quarter | 272 → **0** |
| 3x3_maze | corner, cross, tee | 816 → **0** |
| lineup_row | broken, end, gate, straight | 340 → **0** |

**Alle 4 Layouts fugenlos (0).** Interne Sicht: `renders/intern_layouts.png`, `renders/intern_lineup_row.png`.

## 4 · Abnahme (wartet auf das Go für Bühne v1.2)
Bereit sind die Bühnen-GLBs `kit/proof/B29_proof_<3x3_maze|2x2_round|lineup_row>_<W1|W2>.glb`. Für den Bogen tragen sie Box-UV und die Normal-Map der Haut (zur Laufzeit triplanar). Lauf: `--type stage`, alle Standard-Ansichten. Danach liste ich hier jede Einzelansicht in voller Auflösung auf.

## 5 · Landmarken-Kandidaten (privat, nur Intake)
| Kandidat | GLB (Originalmaßstab, Basis y = 0) | Dreiecke | Größe (Blender-Einheiten) | Befund |
|---|---|---|---|---|
| Pyramid Diorama | `_privat_kauf_asset/KFB_Landmark_pyramid_diorama.r0.glb` (5.2 MB) | 228,072 | [9.276, 9.272, 6.424] | sauberes Cartoon-Modell mit Holztür; Farben aus Materialien, kein vorgebackenes Licht sichtbar. **Maßstab nach V-438** über die Türhöhe, sobald die v1.2-Werte kommen |
| Liberty Island | `_privat_kauf_asset/KFB_Landmark_liberty_island.r0.glb` (41.8 MB) | 391,381 | [71.883, 105.064, 19.111] | **Fotogrammetrie mit stark eingebranntem Licht und Schatten**, 391 k Dreiecke, 42 MB. Braucht Browser-Fassung (B8-Verfahren) und Entlichten (L2/L3 wie B24). Kein Cartoon-Look |

- Quellansichten: `_privat_kauf_asset/renders/quelle/`.
- Die Knete-Bögen (Bühne) folgen nach dem v1.2-Go.

## Offene Fragen an WS0
1. **Maße:** Zelle 4 u / Höhe 3,6 u / Torbreite 2,2 u? Soll das Tor einen Sturz bekommen (Höhe nach V-438)?
2. **W1:** Das Scan-Relief zeigt senkrechte Fugen (die Plattenstöße des Scans). Sie wiederholen sich je Kachel als ruhige Linien. Behalten (wirkt wie Lehmplatten) oder herausfiltern?
3. **Liberty Island:** Der Scan sieht nach Luftbild-Fotogrammetrie aus (Stil 3D-Kartendaten). Trotz „Royalty Free“ bitte prüfen, ob die Quelle erlaubt ist, bevor Arbeit hineinfließt. Danach Browser-Fassung + Entlichten.
4. **Polar-Labyrinth:** Wie in `curved_ring_r3` (r = 3C, 22,5°) weitere Radien erzeugen (Skript-Parameter)?

## Nachtrag 18.10. · WS0-Entscheidungen (V-446)
1. **Maße bestätigt:** Zelle 4 u, Höhe 3,6 u, Dicke 0,95 → 0,62 u. Das Tor bleibt ohne Sturz; eine Bogen-Variante kann später kommen.
2. **W1 neu:**
   - Alles, was über die Höhe konstant ist, ist herausgenommen (Spalten-Median). Damit sind die senkrechten Plattenfugen und Scan-Streifen weg.
   - Die großräumige 2D-Unruhe (5–25 cm) bleibt erhalten (×0,6). Ihr zeilenkonstanter Höhenverlauf ist entfernt, sonst gäbe es eine waagrechte Kachelnaht.
   - Nahtprüfung: Kante 0,0040 / 0,0020 gegenüber innen 0,0036, also unauffällig.
   - Sichtbar bleiben einzelne kleine Löcher aus dem Scan.
   - Vorschau: `renders/skins_preview_2x2.png`. Die Bühnen-GLBs in `kit/proof/` sind neu gebaut.
3. **Liberty Island: gestoppt.** Die Rechte an der Quelle sind unklar. Es bleiben nur das Intake (`data/intake.json`) und das Intake-GLB (privat, `KFB_Landmark_liberty_island.r0.glb`). Hier passiert nichts weiter.
4. **Polar-Ringe** mit etwa gleicher Segmentlänge (Ziel ≈ 4,7 u, Segmentzahl als Vielfaches von 4):

| Ring | Radius | Segmente | Winkel | Bogenlänge | Dreiecke |
|---|---|---|---|---|---|
| `curved_ring_r2` | 8 u | 12 | 30° | 4,19 u | 1 428 |
| `curved_ring_r3` | 12 u | 16 | 22,5° | 4,71 u | 1 632 |
| `curved_ring_r4` | 16 u | 20 | 18° | 5,03 u | 1 700 |
| `curved_ring_r5` | 20 u | 28 | 12,86° | 4,49 u | 1 496 |

   Fugentest Vollkreis je Ring: **0 offene Kanten** (`data/seamtest.r1.json`, `ring_r2`…`ring_r5`). Die übrigen Layouts sind weiter 0.

Die Bögen warten weiter auf das Go für v1.2.

## Abnahme auf Bühne v1.2 (18.10.) · 6 Bögen PASS (3 Layouts × W1/W2; G2–G6 PASS, G4 WARN)
Bühne **v1.2.1** (`--stage v1.2`, kfb-stage-light.v1.1, alle Standard-Ansichten, Maßstabszelle mit FrizzleBob 1,81 m + DemonLord 2,85 m). **Diese Bilder sind privat** (DemonLord in der Maßstabszelle ist ein Kauf-Asset), der Baukasten bleibt öffentlich.

### Einzelansichten in voller Auflösung (1600 × 1200)
- `_privat_kauf_asset/renders/proof_stage_v12/2x2_round_W1/`: Bogen `B29_proof_2x2_round_W1_contact_sheet.png` · Einzelansichten: `B29_proof_2x2_round_W1_back.png`, `B29_proof_2x2_round_W1_detail_low.png`, `B29_proof_2x2_round_W1_far.png`, `B29_proof_2x2_round_W1_front.png`, `B29_proof_2x2_round_W1_near_face.png`, `B29_proof_2x2_round_W1_scale_ref.png`, `B29_proof_2x2_round_W1_side.png`, `B29_proof_2x2_round_W1_threeq.png`, `B29_proof_2x2_round_W1_top.png`
- `_privat_kauf_asset/renders/proof_stage_v12/2x2_round_W2/`: Bogen `B29_proof_2x2_round_W2_contact_sheet.png` · Einzelansichten: `B29_proof_2x2_round_W2_back.png`, `B29_proof_2x2_round_W2_detail_low.png`, `B29_proof_2x2_round_W2_far.png`, `B29_proof_2x2_round_W2_front.png`, `B29_proof_2x2_round_W2_near_face.png`, `B29_proof_2x2_round_W2_scale_ref.png`, `B29_proof_2x2_round_W2_side.png`, `B29_proof_2x2_round_W2_threeq.png`, `B29_proof_2x2_round_W2_top.png`
- `_privat_kauf_asset/renders/proof_stage_v12/3x3_maze_W1/`: Bogen `B29_proof_3x3_maze_W1_contact_sheet.png` · Einzelansichten: `B29_proof_3x3_maze_W1_back.png`, `B29_proof_3x3_maze_W1_detail_low.png`, `B29_proof_3x3_maze_W1_far.png`, `B29_proof_3x3_maze_W1_front.png`, `B29_proof_3x3_maze_W1_near_face.png`, `B29_proof_3x3_maze_W1_scale_ref.png`, `B29_proof_3x3_maze_W1_side.png`, `B29_proof_3x3_maze_W1_threeq.png`, `B29_proof_3x3_maze_W1_top.png`
- `_privat_kauf_asset/renders/proof_stage_v12/3x3_maze_W2/`: Bogen `B29_proof_3x3_maze_W2_contact_sheet.png` · Einzelansichten: `B29_proof_3x3_maze_W2_back.png`, `B29_proof_3x3_maze_W2_detail_low.png`, `B29_proof_3x3_maze_W2_far.png`, `B29_proof_3x3_maze_W2_front.png`, `B29_proof_3x3_maze_W2_near_face.png`, `B29_proof_3x3_maze_W2_scale_ref.png`, `B29_proof_3x3_maze_W2_side.png`, `B29_proof_3x3_maze_W2_threeq.png`, `B29_proof_3x3_maze_W2_top.png`
- `_privat_kauf_asset/renders/proof_stage_v12/lineup_row_W1/`: Bogen `B29_proof_lineup_row_W1_contact_sheet.png` · Einzelansichten: `B29_proof_lineup_row_W1_back.png`, `B29_proof_lineup_row_W1_detail_low.png`, `B29_proof_lineup_row_W1_far.png`, `B29_proof_lineup_row_W1_front.png`, `B29_proof_lineup_row_W1_near_face.png`, `B29_proof_lineup_row_W1_scale_ref.png`, `B29_proof_lineup_row_W1_side.png`, `B29_proof_lineup_row_W1_threeq.png`, `B29_proof_lineup_row_W1_top.png`
- `_privat_kauf_asset/renders/proof_stage_v12/lineup_row_W2/`: Bogen `B29_proof_lineup_row_W2_contact_sheet.png` · Einzelansichten: `B29_proof_lineup_row_W2_back.png`, `B29_proof_lineup_row_W2_detail_low.png`, `B29_proof_lineup_row_W2_far.png`, `B29_proof_lineup_row_W2_front.png`, `B29_proof_lineup_row_W2_near_face.png`, `B29_proof_lineup_row_W2_scale_ref.png`, `B29_proof_lineup_row_W2_side.png`, `B29_proof_lineup_row_W2_threeq.png`, `B29_proof_lineup_row_W2_top.png`

**Maßstabszelle:** Die Mauer (2,22 m) verdeckt FrizzleBob (1,81 m) vollständig. DemonLord (2,85 m mit Hörnern) schaut mit dem Kopf darüber. Das entspricht V-446/V-439 (nur Medium verdecken). Soll auch Large verdeckt werden, wären 4,8 u (≈ 3,0 m) nötig.

## r2 · Bühnen-Fassungen als lesbares Labyrinth (WS0 18.10.) · Bühne v1.2.1
**Skript:** `scripts/b29_r2_proofs.py`. GLBs liegen in `kit/proof_r2/`, Daten in `data/proofs_r2.json`.

1. **Rechteck-Labyrinth 5 × 5** (Backtracker, Seed 29): Eingang unten links, Ausgang oben rechts, 34 Wandstücke auf dem Pfostengitter 6 × 6.
   - Module je Pfosten nach anliegenden Wänden: {"end": 9, "tee": 5, "straight": 9, "corner": 7, "broken": 6}; ~15 % der Geraden als `broken` (Seed 7).
   - Nach dem Verschmelzen **0 offene Kanten**. Haut W1 und W2.
2. **Polar-Labyrinth r2–r5** (Seed 31): 3 Zellringe, Sektoren = Segmente des inneren Rings (12/16/20), 22 radiale Wände.
   - Öffnungen sind weggelassene Ringsegmente; die Nachbarn bekommen Endkappen. Eingang im Außenring, Ziel ist der Innenhof.
   - **0 offene Kanten.** Haut W1.
   - Fast perfektes Labyrinth: Zwischen Ringen mit verschiedener Teilung kann ein Durchgang zwei innere Zellen berühren.
3. **Kit-Reihe:** die 10 Grundteile im 5 × 2-Raster, Haut W2. Offene Anschlussenden sind hier gewollt: Die Teile stehen einzeln.

**Neu im Kit (öffentlich):**
- `straight_capped`: freistehende Wand, beide Enden gerundet. Daraus sind die radialen Wände gebaut.
- `curved_ring_r2…r5_capA|capB|capAB`: Ringstücke mit Endkappe für Öffnungen.
- **Alle Module haben jetzt eine geschlossene Unterseite** (geschlossenes Volumen).
- Fugentest unverändert 0 bei allen Layouts und Vollkreisen.

### Bühne v1.2.1: 2 PASS, 2 FAIL (G6)
- `_privat_kauf_asset/renders/proof_stage_v12_r2/kit_lineup_W2/`: Bogen `B29_proof_kit_lineup_W2_contact_sheet.png` · Einzelansichten: `B29_proof_kit_lineup_W2_back.png`, `B29_proof_kit_lineup_W2_detail_low.png`, `B29_proof_kit_lineup_W2_far.png`, `B29_proof_kit_lineup_W2_front.png`, `B29_proof_kit_lineup_W2_near_face.png`, `B29_proof_kit_lineup_W2_scale_ref.png`, `B29_proof_kit_lineup_W2_side.png`, `B29_proof_kit_lineup_W2_threeq.png`, `B29_proof_kit_lineup_W2_top.png`
- `_privat_kauf_asset/renders/proof_stage_v12_r2/maze5x5_W1/`: Bogen `B29_proof_maze5x5_W1_contact_sheet_FAIL.png` · **keine Einzelansichten (G6 FAIL → nur Diagnose-Bogen)**
- `_privat_kauf_asset/renders/proof_stage_v12_r2/maze5x5_W2/`: Bogen `B29_proof_maze5x5_W2_contact_sheet_FAIL.png` · **keine Einzelansichten (G6 FAIL → nur Diagnose-Bogen)**
- `_privat_kauf_asset/renders/proof_stage_v12_r2/polar_r2r5_W1/`: Bogen `B29_proof_polar_r2r5_W1_contact_sheet.png` · Einzelansichten: `B29_proof_polar_r2r5_W1_back.png`, `B29_proof_polar_r2r5_W1_detail_low.png`, `B29_proof_polar_r2r5_W1_far.png`, `B29_proof_polar_r2r5_W1_front.png`, `B29_proof_polar_r2r5_W1_near_face.png`, `B29_proof_polar_r2r5_W1_scale_ref.png`, `B29_proof_polar_r2r5_W1_side.png`, `B29_proof_polar_r2r5_W1_threeq.png`, `B29_proof_polar_r2r5_W1_top.png`

**G6-Befund beim Rechteck-Labyrinth** (W1 und W2 gleich):
- Nur die ¾-Ansicht ist betroffen: **3 px** (genau die Mindestgröße), alle in einer Zeile (bbox x 1344–1346, y 665), maxDelta 13,8 Luma.
- Die Stelle ist die Spitze des langen, dünnen Schattens am rechten Rand (Mauer am Ausgang). Es ist kein Spalt in der Geometrie: Unterseiten sind geschlossen, 0 offene Kanten. Wahrscheinlich ist es die Auflösungsgrenze der Schattenkarte (Texel 7,5 mm) an einer schmalen Schattenspitze.
- Ich habe nichts „passend geschoben“. WS0 entscheidet: Grenzfall der Bühne prüfen, oder ich verlege den Ausgang (anderer Seed).
- Die älteren Bögen in `proof_stage_v12/` (3x3/2x2/Reihe aus r1) sind überholt.
