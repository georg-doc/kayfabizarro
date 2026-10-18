# B30 · Schach-Diorama „Die Welt als Spielzeug“ (V-455, V-457) · RETURN (WSB, 2026-10-18)

**Quellen:**
- **Poly Haven „Chess Set“** (Riley Queen, CC0). Download von WS0 nach Georgs OK, `_src/polyhaven_chess_set_2k/` (INTAKE.json). Geöffnet mit `--disable-autoexec`.
- **KayKit Board Game Bits 1.0 FREE** (Kay Lousberg, CC0):
  - Der entpackte FREE-Ordner auf Dropbox enthält nur Spielplättchen, Marken und Ständer. Dominos, Würfel, Münzen, Meeples und Sanduhr stecken im lokalen Archiv `KayKit_BoardGameBits_1.0_FREE 2.zip` (sha256 25197e8a…, License.txt = CC0).
  - Nur glTF, Texturen und Lizenz entpackt nach `_src/kaykit_bgb_free_1.0/` (eigener, leerer Ordner; WS0 hat das freigegeben). Der „Patreon Early Access“-Ordner ist nicht verwendet.
- **Morph Chess** (MIT, © 2026 AmethystineAlpaca; Kopie ohne Medien `_src/morph_chess_mit/`, LICENSE dort): nur Punktdaten gelesen (Drehprofile, Kronen-Schnitte, Pferde-Umriss). Die Geometrie ist in Blender neu aufgebaut, **kein Code im Asset**.
  - **MIT-Hinweis:** Der Lizenztext (Copyright © 2026 AmethystineAlpaca) liegt als `B30/LICENSES/morph-chess-MIT.txt` beim Asset. WS0 hat das am 18.10. geprüft; Satz M ist damit im Handoff öffentlich, die Lizenzdatei wird mitgegeben.

## 1 · Figuren: zwei Sätze zum Wählen
**Maßstab:** Bauer 1,8 m (= Medium), König 3,6 m (= 2 × Bauer), dazwischen linear nach Quellhöhe. Feld 3 m. Damit laufen Figuren zwischen den Steinen (Fußdurchmesser 0,9–1,9 m bei 3 m Feld).
- **Animationsfähig:**
  - Ursprung in der Mitte der Standfläche.
  - Voxel-Remesh mit gleichmäßiger Dichte, ≈ 80 Lagen über die Höhe (Squash/Stretch, Biegen).
  - Anker `KFB_Top` an der Oberkante.
  - Bauer und Dame mit gleicher relativer Dichte; ein Morph Bauer → Dame ist später als Shape-Key möglich, nicht gebaut.
- **Farben** als Material: Creme `#E8D8B8` / Dunkelbraun `#4E3F3A`. Knete zur Laufzeit, nichts eingebacken.
- **Satz A · Poly Haven** (`pieces/KFB_Chess_<typ>_<light|dark>.r1.glb`, `scripts/b30_pieces.py`):
  - cartoonisiert: gedrungener (×1,06), Fuß breiter, Kopfpartie größer, weich geglättet, leicht aufgebläht;
  - **Königskreuz** neu als kräftiges Cartoon-Kreuz: Das Originalkreuz ist zu dünn für das Raster und wurde erst unsichtbar, dann zum Klumpen;
  - **Läufer-Kerbe** breiter eingeschnitten;
  - Pferd schaut nach vorn (glTF +Z).
- **Satz M · Morph Chess** (`pieces_morph/KFB_ChessM_<typ>_<light|dark>.r1.glb`, `scripts/b30_pieces_morph.py`):
  - Drehkörper mit 48 Segmenten, Proportions-Schlüssel wie im Original;
  - Turm: Sechseck mit 6 Zinnen;
  - Läufer: zwei ungleiche Mitra-Lappen mit echter Schrägöffnung;
  - Dame: Schale, 6 Kronenblätter, Mittelstein, Spitze;
  - König: Reif, 4 offene Bügel, Birnen-Stein, Kugel, Kreuz;
  - Springer: Umriss-Platte mit Fasen und zwei Ohren.
  - Weggelassen (zu fein für Knete): Rubin-Adern, Shader, Augenlid- und Nüstern-Kerben des Pferds.

| Typ | Satz A: Höhe · Fuß · Dreiecke | Satz M: Höhe · Fuß · Dreiecke |
|---|---|---|
| Bauer | 1.817 m · Ø 1.171 m · 24748 | 1.808 m · Ø 0.89 m · 20676 |
| Turm | 2.115 m · Ø 1.543 m · 33472 | 2.046 m · Ø 1.029 m · 30188 |
| Springer | 2.734 m · Ø 1.856 m · 28688 | 2.276 m · Ø 1.247 m · 22468 |
| Läufer | 3.221 m · Ø 1.471 m · 15968 | 2.594 m · Ø 1.237 m · 19984 |
| Dame | 3.427 m · Ø 1.78 m · 19864 | 3.191 m · Ø 1.478 m · 22012 |
| König | 3.696 m · Ø 1.926 m · 16288 | 3.621 m · Ø 1.637 m · 20644 |

- **Silhouetten nebeneinander** (flach, Pferd im Profil): `proof/B30_silhouetten_polyhaven_oben_morph_unten.png`.
  - Satz A ist klassisch und rundlich.
  - Satz M ist schlanker und lebt von markanten Kronen: gespaltene Mitra, Bügelkrone, Kronenblätter. Das liest sich auch von weitem.
- **Entscheid Georg:** Satz A oder Satz M.

## 2 · Steinbrett (`board/KFB_ChessBoard.r1.glb`, `scripts/b30_board.py`, eigenes Werk)
- Feld 3.0 m = 4.8701 u, 8 × 8, Gesamtbreite ≈ 29.4 m, 37234 Dreiecke.
- Felder als einzelne Platten `KFB_Square_a1…h8` mit leichter Höhen- und Kipp-Unruhe, 117 abgeschlagene Kanten oder Ecken, 12 Felder mit Riss.
- Hell `#D6C49C` / dunkel `#6E5A47` statt Marmor, Rahmen `#9A876A`.
- Rahmen als umlaufendes Profil mit abgerundeten Ecken, leicht verbeult, Fuß-Ausstellung + `_KFB_FOOT` wie B29 (wächst später ins Gelände, V-341).
- `extras.kfb`: `a1_center_u`, `square_u`, `top_y_u` = 1.5, Linien a–h entlang +X, Reihe 1 (hell) auf der Seite +Z.
- **Fix:** Im ersten Lauf kamen die Felder ohne Material an (G2 FAIL); jetzt wird das Material vor dem Export geprüft und gesetzt. Danach hatten geglättete Schnittflächen dunkle Dreiecks-Schlieren; die Felder sind jetzt flach schattiert.

## 3 · Spielteile als Umgebung (`dominoes/`, `props/`, `scripts/b30_bits.py`)
- **28 Dominos** stehend: 3.0 m hoch, 1.5 m breit, 0.388 m dick, Augen nach vorn.
  - Physikfähig: `extras.kfb.physics` (Box-Halbmaße, Schwerpunkt, Masse 1134.5 kg bei Holz 650 kg/m³, Reibung 0,6).
- **Beispielstrecken** `data/b30_domino_courses.r1.json`, Abstand 0,55 × Höhe = 2.679 u:
  - S-Kurve 22 Steine;
  - Spirale 68 Steine;
  - Abzweig 22 Steine (der letzte Stamm-Stein trifft beide Äste).
- **12 Props:** W4, W6, W8, W20 (1,6–2,2 m), 2 Münzen (Ø 2,4 m), 4 Meeples (2,6 m), 2 Sanduhren (4,0 m), je mit Physik-Näherung.

## Bühne v1.2.2 · 4 × PASS (privat, DemonLord in der Maßstabszelle)
- Bühnen-Fassungen in `proof/` (`scripts/b30_proofs.py`):
  - Vergleich Satz A vorn / Satz M hinten;
  - Brett mit Startaufstellung (Satz A, jede Figur per Strahl auf ihr Feld gesetzt);
  - Domino-Strecken S-Kurve + Abzweig;
  - Props-Reihe.
- **Fix:** Beim Duplizieren wirkte die Drehung zuerst nicht (glTF-Import setzt Quaternionen). Jetzt erzwinge ich Euler; Pferd im Profil, Dominos und Blickrichtung stimmen.
- `B30/_privat_kauf_asset/renders/proof_stage_v12/pieces_polyhaven_vs_morph/`: Bogen `B30_proof_pieces_polyhaven_vs_morph_contact_sheet.png` · Einzelansichten: `B30_proof_pieces_polyhaven_vs_morph_back.png`, `B30_proof_pieces_polyhaven_vs_morph_detail_low.png`, `B30_proof_pieces_polyhaven_vs_morph_far.png`, `B30_proof_pieces_polyhaven_vs_morph_front.png`, `B30_proof_pieces_polyhaven_vs_morph_near_face.png`, `B30_proof_pieces_polyhaven_vs_morph_scale_ref.png`, `B30_proof_pieces_polyhaven_vs_morph_side.png`, `B30_proof_pieces_polyhaven_vs_morph_threeq.png`, `B30_proof_pieces_polyhaven_vs_morph_top.png`
- `B30/_privat_kauf_asset/renders/proof_stage_v12/board_start_polyhaven/`: Bogen `B30_proof_board_start_polyhaven_contact_sheet.png` · Einzelansichten: `B30_proof_board_start_polyhaven_back.png`, `B30_proof_board_start_polyhaven_detail_low.png`, `B30_proof_board_start_polyhaven_far.png`, `B30_proof_board_start_polyhaven_front.png`, `B30_proof_board_start_polyhaven_near_face.png`, `B30_proof_board_start_polyhaven_scale_ref.png`, `B30_proof_board_start_polyhaven_side.png`, `B30_proof_board_start_polyhaven_threeq.png`, `B30_proof_board_start_polyhaven_top.png`
- `B30/_privat_kauf_asset/renders/proof_stage_v12/domino_courses/`: Bogen `B30_proof_domino_courses_contact_sheet.png` · Einzelansichten: `B30_proof_domino_courses_back.png`, `B30_proof_domino_courses_detail_low.png`, `B30_proof_domino_courses_far.png`, `B30_proof_domino_courses_front.png`, `B30_proof_domino_courses_near_face.png`, `B30_proof_domino_courses_scale_ref.png`, `B30_proof_domino_courses_side.png`, `B30_proof_domino_courses_threeq.png`, `B30_proof_domino_courses_top.png`
- `B30/_privat_kauf_asset/renders/proof_stage_v12/bgb_props_lineup/`: Bogen `B30_proof_bgb_props_lineup_contact_sheet.png` · Einzelansichten: `B30_proof_bgb_props_lineup_back.png`, `B30_proof_bgb_props_lineup_detail_low.png`, `B30_proof_bgb_props_lineup_far.png`, `B30_proof_bgb_props_lineup_front.png`, `B30_proof_bgb_props_lineup_near_face.png`, `B30_proof_bgb_props_lineup_scale_ref.png`, `B30_proof_bgb_props_lineup_side.png`, `B30_proof_bgb_props_lineup_threeq.png`, `B30_proof_bgb_props_lineup_top.png`
- Überholte Bögen aus dem ersten Lauf: `…_contact_sheet_FAIL_vor_Materialfix.png` (Brett).
- G4-Warnungen (nur Hinweis): kleine lose Inseln in KayKit-Teilen (Münzrelief, Sanduhr-Glas) und Morph-Läufer/-Pferd; keine offenen Ränder an den Figuren.

## Lizenz / Handoff
- **Öffentlich (CC0 bzw. eigenes Werk):** Satz A, Brett, Dominos, Props, Strecken-JSON.
- **Satz M** öffentlich mit Lizenztext `LICENSES/morph-chess-MIT.txt` (MIT, WS0-geprüft).
- Renders privat (DemonLord).
- Handoff neu: 344 Dateien, 268 öffentlich.

## r2 · Steinbrett + Figurenfarben (WS0 18.10.: r1 las sich wie ein braunes Holztablett) · Bühne v1.2.2 · 2 × PASS
- **Brett r2** `board/KFB_ChessBoard.r2.glb` (`scripts/b30_board_r2.py`, eigenes Werk, 36032 Dreiecke):
  - **Rahmen** aus 44 wuchtigen, ungleich langen Steinblöcken (2,6–5,2 u). Er ragt 0,5 u über die Felder; die Blöcke sind leicht verdreht, verschieden hoch und haben drei Grautöne (`#8C877C`, `#7D786E`, `#9A948A`).
  - **Sockel** breiter als der Rahmen, mit Fuß-Ausstellung, `_KFB_FOOT` an Sockel und Blöcken.
  - **Felder** in warmem Sandstein `#CDB98C` und kühlem Schiefer `#59666E` (statt Creme/Braun), dick abgerundet.
  - **Abnutzung** (V-456, unregelmäßig), 209 Schnitte insgesamt: 1–3 große Abschläge je Feld, 10 ausgebrochene Ecken, 20 Felder mit breitem, geknicktem Riss.
  - Flach schattiert; Materialprüfung vor dem Export (0 von 110 Meshes ohne Material).
  - `extras.kfb` wie r1 (a1_center_u, square_u, top_y_u = 1,5).
- **Figurenfarben, zwei Vorschläge** (nur im Bogen umgefärbt; die Figuren-GLBs bekommen die gewählte Palette danach):
  - **F1:** Elfenbein `#EADFC6` / Aubergine `#5A3550`. Kräftigster Kontrast auf Sandstein und Schiefer.
  - **F2:** Elfenbein `#EADFC6` / Petrol `#2E6466`. Wirkt grüner; auf den Schieferfeldern etwas weniger Kontrast.
  - Skript `scripts/b30_proofs_r2.py`, Satz A in Startaufstellung.
- **Bögen (privat):**
  - `B30/_privat_kauf_asset/renders/proof_stage_v12_r2/board_r2_start_A_F1/`: Bogen `B30_proof_board_r2_start_A_F1_contact_sheet.png` · Einzelansichten: `B30_proof_board_r2_start_A_F1_back.png`, `B30_proof_board_r2_start_A_F1_detail_low.png`, `B30_proof_board_r2_start_A_F1_far.png`, `B30_proof_board_r2_start_A_F1_front.png`, `B30_proof_board_r2_start_A_F1_near_face.png`, `B30_proof_board_r2_start_A_F1_scale_ref.png`, `B30_proof_board_r2_start_A_F1_side.png`, `B30_proof_board_r2_start_A_F1_threeq.png`, `B30_proof_board_r2_start_A_F1_top.png`
  - `B30/_privat_kauf_asset/renders/proof_stage_v12_r2/board_r2_start_A_F2/`: Bogen `B30_proof_board_r2_start_A_F2_contact_sheet.png` · Einzelansichten: `B30_proof_board_r2_start_A_F2_back.png`, `B30_proof_board_r2_start_A_F2_detail_low.png`, `B30_proof_board_r2_start_A_F2_far.png`, `B30_proof_board_r2_start_A_F2_front.png`, `B30_proof_board_r2_start_A_F2_near_face.png`, `B30_proof_board_r2_start_A_F2_scale_ref.png`, `B30_proof_board_r2_start_A_F2_side.png`, `B30_proof_board_r2_start_A_F2_threeq.png`, `B30_proof_board_r2_start_A_F2_top.png`
- Brett r1 bleibt liegen, ist aber überholt.

## Nächstes Gate (eins)
Georg (q33): Figurensatz A oder M, dazu Farbe F1 oder F2. Danach färbe ich die Figuren-GLBs um und baue die Startaufstellung im gewählten Satz.
