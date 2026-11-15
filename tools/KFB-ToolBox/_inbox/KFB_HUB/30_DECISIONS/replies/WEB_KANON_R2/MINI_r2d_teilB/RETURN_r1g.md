# FB Web-Kanon · r1g: Katana-Clips für Hero-Shot v9 · RETURN (WSB, Mac mini, 15.11.2026, V-1805)

**Auftrag:** Katana R2d Teil B, Auswahl Choreo R2d (`30_DECISIONS/replies/WEB_KANON_R2/CHOREO_R2D_AUSWAHL.md`). r1g ist r1f mit den Clips der Auswahl, sonst unverändert.

| Datei (`_privat_kauf_asset/`) | Größe | Clips |
|---|---|---|
| `FB_WEB_KANON_agent_twin.r1g.glb` | 5,84 MB | 61 (r1f 56 + 5) |

**Herkunft:**
- Gebaut aus dem ungepackten r1f-Stand (`~/.kfb_tmp/r2c/v1.p2.glb`) mit `scripts/r1g/clips_dazu_r1g.mjs`.
- Gepackt mit demselben Packer wie r1f (`scripts/r2b/wk_pack.mjs`).

**Neue Clips:** unverändert aus den Bibliotheken übernommen, nur a1/b1 sind Übertrag.

| Clip in r1g | Quelle |
|---|---|
| `Melee_1H_Attack_Jump_Chop` | Stamm @5d39e2e1 `Rig_Medium_CombatMelee.glb`, unverändert |
| `Melee_2H_Attack_Spinning` | dieselbe Bibliothek, unverändert |
| `Melee_2H_Attack_Spin` | dieselbe Bibliothek, unverändert |
| `KFB_Katana_a1_R2d` | Quaternius UAL 2 (CC0) `Sword_Regular_A`, Weltdrehungs-Übertrag auf Rig_Medium (roh, ohne Arm-Reparatur, wie die übrigen Web-Clips) |
| `KFB_Katana_b1_R2d` | Quaternius UAL 2 (CC0) `Sword_Regular_C`, ebenso |

**Schon in r1f vorhanden:**
- `Jump_Start`, `Jump_Idle` und `Jump_Land` (die Auswahl nennt sie als fehlend).
- `KFB_Katana_diagonal_R1` (= `Melee_1H_Attack_Slice_Diagonal`) und `KFB_Katana_chop_R1` (= `Melee_1H_Attack_Chop`).
- Nichts davon doppelt eingefügt.

**Kanon-Wache:** `data/r1g/pruefung_r1g.json`, ok wie r1f.
- Beide Ohren, Schwanz, Augen-Rig mit E2-Lidern, Gesicht.
- 10 Skins, 156 Knoten, 66 Netze, gleich wie r1f.

**Katana wie bisher:** `waffen/KFB_Katana.r1d.glb` an `handslot.r`, ohne Versatz.
- Ausnahme Vorschlag a1 (siehe unten): Waffen-Drehung x −30°, Quaternion `[-0.258819, 0, 0, 0.965926]`, nur im Fenster 0,13–0,27 s.

## Messung
Spitze `KFB_Tip` über dem Boden, in r1g mit dem Katana in der Hand, 30 Bilder/s (`data/r1g/spitze_messung_r1g.json`). Kontakt = schnellster Moment der Spitze.

| Clip | Länge | Kontakt · Spitze | tiefste Spitze | Hüfte hoch |
|---|---|---|---|---|
| `Melee_1H_Attack_Jump_Chop` | 1,33 s | 0,767 s · 0,683 m | 0,154 m bei 0,20 s | +0,41 m (Sprung im Clip) |
| `Melee_2H_Attack_Spinning` | 0,67 s | 0,267 s · 0,543 m | 0,539 m | 0 |
| `Melee_2H_Attack_Spin` | 2,40 s | 0,733 s · 0,561 m | 0,453 m bei 1,70 s | 0 |
| `KFB_Katana_a1_R2d` | 0,43 s | 0,267 s · 0,850 m | 0,033 m bei 0,233 s | 0 |
| `KFB_Katana_b1_R2d` | 2,00 s | 0,667 s · 0,602 m | **−0,191 m bei 0,10 s** (Spitze im Boden, außerhalb des Fensters 0,20–0,80 s) | +0,08 m |

## Extrem-Bilder der Auswahl
`KATANA_R2D/beleg/teilB/EXTREME_r2d_v2.jpg`, Einzelbilder in `KATANA_R2D/beleg/teilB/extreme_v2/`. Je Zeile Ausholen, Kontakt und Ausschwingen, mit r1g und Katana. Die Kamera richtet sich nach FBs Brust aus (Profil bzw. schräg vorn), nie von hinten.
- b4 ist mit Sprungbahn +0,30 m gerendert (Absprung 0,333 s, Landung 0,833 s).
- a1 gibt es zusätzlich mit Klingen-Versatz x −30°.

## Für Claude Design
- **a1:** Die Klinge geht bis zum Kontakt (0,27 s) mit Versatz frei am Gesicht vorbei. Im Ausschwingen (0,30–0,43 s) steckt sie bei jeder festen Drehung im Kopf.
  - Darum nur bis Kontakt spielen und dann überblenden, oder später durch Mixamo ersetzen.
- **b1:** nur das Fenster 0,20–0,80 s nehmen. Davor steckt die Spitze im Boden.
- **Nähte:** gemessen, siehe `KATANA_R2D/RETURN_teilB.md`.
