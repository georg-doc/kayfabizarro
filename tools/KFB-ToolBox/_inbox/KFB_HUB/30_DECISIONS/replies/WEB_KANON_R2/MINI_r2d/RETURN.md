# Katana R2d · Teil A · RETURN (WSB, Mac mini, 15.11.2026, V-1805)

**Auftrag:** `30_DECISIONS/replies/WEB_KANON_R2/BRIEF_WSB_KATANA_LUFT_R2D.md`.
- Teil A: je Bewegung höchstens 6 Kandidaten, Bestand zuerst. Nichts am Bestand geändert, keine eigenen Keyframes.
- Grundlage: Stamm `game/integration-r2` @5d39e2e1, `assets/private` @74bf0c0b (Zweig laut WS0 von dort statt @f922c319).

## Kurz
1. **Sichtung:** 64 Clips auf FB-Web r1f mit Katana durchgemessen.
   - KayKit CombatMelee/MovementBasic (Bestand, unverändert).
   - Quaternius UAL 1/2 (lokal).
   - Georgs vorhandene Mixamo-Downloads auf dem KayKit-Rig (Great Sword Pack und einzelne Sprung-/Landungs-Clips).
   - Gemessen je Bild: Bahn der Spitze `KFB_Tip`, Hüfte, Fußhöhe, Gierung (`data/messung_sichtung_je_bild.json`).
2. **18 Kandidaten**, je 6 für die drei Bewegungen, darunter zwei Ketten aus Bestandsclips.
   - Je Kandidat eine Einzelvorschau: FB-Web r1f mit Katana an `handslot.r` wie die Spielkarte, Bühne und Kamera wie Kulturtechniken Teil A (vorn-seitlich).
   - Dateien: `vorschau/<kandidat>.webp` (Clip) und `.jpg` (6 Momente, Schnittmoment rot).
   - Messwerte: `data/kandidaten_r2d.json`.
3. **Login-Folie:** `login_folie/LOGIN_FOLIE_r2d.jpg`, 10 Mixamo-Kandidaten, die Georg noch nicht geladen hat. Namen aus der öffentlichen Suche (ohne Login), Kacheln in `login_folie/mixamo_kacheln/`.
4. **Kontaktbogen:** `blaetter/KONTAKTBOGEN_r2d.jpg`.

## Messregeln
- **Schnittmoment:**
  - Aufwärtsschnitt: größte Aufwärtsgeschwindigkeit der Spitze.
  - Luft-Hieb: größte waagerechte Geschwindigkeit der Spitze.
  - Landung: größte Spitzengeschwindigkeit.
- **Tip-Höhe:** `KFB_Tip` über dem Boden (y 0 = Fußsohle in Ruhe), FB-Maß in Metern (Höhe 1,742 m, Hüfte 0,25 m), roh ohne Bodenausgleich.
- **Wurzelweg:** Hüfte vor (in Startblickrichtung) und hoch, jeweils größter Wert.
- **Bodenkontakt:** Fuß- und Zehenknochen mehr als 2 cm über dem Startstand gilt als in der Luft. Absprung = erstes Bild in der Luft, Landung = erstes Bild wieder am Boden.
- **Vorschau:** Bodenausgleich je Bild an, damit nichts einsinkt.

## Kandidaten
| Kandidat | Quelle | Schnitt s · Spitze m | vor / hoch m | Absprung / Landung s | Drehung | Kritiker |
|---|---|---|---|---|---|---|
| **Aufwärtsschnitt** | | | | | | |
| a1_ual2_sword_regular_a | UAL 2 · Sword_Regular_A | 0,27 · 0,85 | 0,04 / 0 | – | 131° | schwach: Bogen klar, Klinge geht durch Gesicht und Kopf |
| a2_ual1_sword_attack | UAL 1 · Sword_Attack | 0,87 · 1,22 | 0,02 / 0,02 | – | 78° | (nicht geprüft) Spitze steigt 0,03 → 0,84 m, Hüfte steigt mit |
| a3_mixamo_jump_attack | Mixamo · Jump Attack | 0,40 · 0,88 | 1,00 / 0,79 | 0,60 / 1,53 | 77° | nicht: Schnittmoment liegt im Hocken vor dem Sprung, Klinge hängt im Sprung |
| a4_mixamo_backflip | Mixamo · Backflip | 0,50 · 0,63 | 0,16 / 0,55 | 0,70 / 1,30 | 386° | nicht: Salto ohne Schnitt |
| a5_mixamo_great_sword_slash_5 | Mixamo Great Sword · slash (5) | 0,60 · 1,10 | 0,23 / 0,05 | – | 97° | (nicht geprüft) Spitze 0,41 → 1,35 m |
| a6_mixamo_jumping_over_into_combat | Mixamo · Jumping Over Into Combat | 2,90 · 0,77 | 1,80 / 0,27 | 1,47 / 2,60 | 112° | nicht: Schnitt im Rücken verdeckt |
| **Luft-Hieb mit Drehung** | | | | | | |
| b1_ual2_sword_regular_c | UAL 2 · Sword_Regular_C | 0,67 · 0,60 | 0,04 / 0,08 | 0,07 / 2,03 | 413° | schwach: Hieb mit Drehung, aber am Boden, Spitze im Boden |
| b2_mixamo_great_sword_jump_attack | Mixamo Great Sword · jump attack | 1,20 · 0,56 | 1,14 / 0,09 | 0,70 / 0,90 | 728° | schwach: Schnitt erst nach der Landung |
| b3_kaykit_melee_2h_attack_spin | KayKit · Melee_2H_Attack_Spin (Bestand) | 0,73 · 0,56 | 0,09 / 0 | – | 393° | (nicht geprüft) Bodendrehung, Zweihand |
| b4_kette_jump_start_2h_spinning_jump_land | Kette Bestand, Blend-Daten unten | 0,57 · 0,56 | 0,09 / 0,07 | 0,33 / 0,53 | 360° | nicht: Rückenansicht im Schnitt, kein Sprung zu sehen |
| b5_mixamo_great_sword_high_spin_attack | Mixamo Great Sword · high spin attack | 0,43 · 1,19 | 0,83 / 0,02 | – | 418° | (nicht geprüft) hohe Drehung am Boden |
| b6_ual2_sword_heavy_combo | UAL 2 · Sword_Heavy_Combo | 1,83 · 0,13 | 0,11 / 0 | 0,30 / 2,27 | 575° | nicht: gebückt, Klinge durch den Kopf |
| **Landung mit Nachfedern** | | | | | | |
| c1_kaykit_jump_land | KayKit · Jump_Land (Bestand) | 0,23 · 0,39 | 0 / 0 | – / 0,07 | 0° | (nicht geprüft) Nachfedern 9 cm |
| c2_kette_jump_start_1h_jump_chop_jump_land | Kette Bestand, Blend-Daten unten | 1,00 · 0,68 | 0,36 / 0,36 | 0,33 / 0,93 | 20° | **liest sich, bester C-Kandidat:** Sprung, Hieb, Landung, Einfedern 8 cm, Klinge sauber |
| c3_mixamo_hard_landing | Mixamo · hard landing | 0,13 · 0,37 | 0,02 / 0 | – / 0,07 | 70° | schwach: Bruchlandung, Kopf am Boden |
| c4_ual2_ninjajump_land | UAL 2 · NinjaJump_Land | 0,13 · **−0,26** | 0 / 0 | – / 0,10 | 6° | liest sich (klares Nachfedern), aber die Klinge steckt 26 cm im Boden |
| c5_ual1_jump_land | UAL 1 · Jump_Land | 0,10 · 0,33 | 0 / 0 | 0,07 / 0,67 | 0° | (nicht geprüft) Nachfedern nur 1 cm |
| c6_mixamo_standing_land_to_idle | Mixamo · Standing Land To Standing Idle | 0,03 · 0,61 | 0,48 / 0 | – / 0,10 | 44° | schwach: kaum Nachfedern, Klinge durch Jetpack und Kopf |

**Blend-Daten der Ketten** (nur Abspielfolge mit Überblendung, keine neuen Bilder; Einstiegsbild = kleinste Haltungsabweichung zum letzten Bild des Vorgängers):
- **b4:** `Jump_Start` → `Melee_2H_Attack_Spinning`, Einstieg 0,167 s (Bild 5, 24,4°), blendS 0,2 → `Jump_Land`, Einstieg 0 s (25,6°), blendS 0,2.
- **c2:** `Jump_Start` → `Melee_1H_Attack_Jump_Chop`, Einstieg 0,167 s (Bild 5, 25,4°), blendS 0,2 → `Jump_Land`, Einstieg 0,4 s (Bild 12, 20,9°), blendS 0,2.

## Befunde
1. **Ein echter Luft-Hieb mit Drehung fehlt** im Bestand und in den freien Bibliotheken.
   - Alle B-Kandidaten drehen am Boden oder heben die Hüfte höchstens 9 cm.
   - KayKit-Sprünge laufen auf der Stelle, die Höhe kommt im Spiel aus der Sprungphysik, im Hero-Shot aus der Sprungbahn.
   - Mit Höhe im Clip kämen nur die Mixamo-Kandidaten der Login-Folie in Frage: Standing Melee Attack 360 High, Corkscrew Evade, Spin Flip Kick. Georg lädt sie selbst.
2. **Aufwärtsschnitt:** Gut lesbar ist nur der Bogen in a1, a2 und a5, alle am Boden.
   - Ein steigender Schnitt aus dem Sprung (a3) zeigt im Sprung eine hängende Klinge.
   - Für den Hero-Shot ginge a1 oder a5 mit der Sprungbahn von Claude Design.
3. **Klinge durch Kopf und Ohren** (a1, b2, b6, c6): FBs großer Kopf und die Ohren liegen in der Schwungbahn der Klinge. Die Spielkarte erlaubt einen festen Versatz nur bei sichtbarem Durchgang (V-581); das wäre Teil B.
4. **Klinge im Boden:** c4 (−0,26 m), b1 (Bild 4–5).
5. **Kopf am Boden:** a3 (Hocken), a4 (Landung), c3 (Bruchlandung).
   - Der Bodenausgleich verhindert das Einsinken.
   - Gesicht und Augen liegen dabei aber flach am Boden.

## Ordner
| Ordner | Inhalt |
|---|---|
| `vorschau/` | 18 × .webp + .jpg |
| `login_folie/` | Folie und Mixamo-Kacheln |
| `blaetter/KONTAKTBOGEN_r2d.jpg` | Kontaktbogen |
| `data/` | `kandidaten_r2d.json` (Messwerte und Quellen), Messung je Bild (Kandidaten und Sichtung), `login_kandidaten_r2d.json`, `sichtung_quellen.json` |
| `scripts/` | Übertrag, Kandidaten-Bibliothek, Messung, Einstiegsbilder, Vorschau, Bogen, Folie, Proof-Bühne `spiel_view.html` mit Kettenwiedergabe |
| `in_mixamo/` | Ablage für Georgs Downloads |
