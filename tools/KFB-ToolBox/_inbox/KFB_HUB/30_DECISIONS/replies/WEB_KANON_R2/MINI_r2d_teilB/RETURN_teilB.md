# Katana R2d · Teil B · RETURN (WSB, Mac mini, 15.11.2026, V-1805)

**Auftrag:** WS0 15.11., Auswahl Choreo R2d (`30_DECISIONS/replies/WEB_KANON_R2/CHOREO_R2D_AUSWAHL.md`, `fb_katana_hero_v9.choreo.json`).
- Zweig `assets/wsb-katana-luft-r2d` weiter ab @0aeab754.
- Mixamo-Runde folgt, wenn Georg die Clips geladen hat.

## Kurz
1. **Web-Datei r1g:** `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON_agent_twin.r1g.glb` = r1f plus `Melee_1H_Attack_Jump_Chop`, `Melee_2H_Attack_Spinning`, `Melee_2H_Attack_Spin`, a1, b1.
   - Messblatt: `FB_WEB_KANON_R1/RETURN_r1g.md`.
   - `Jump_Start/Idle/Land` sowie Diagonal und Chop lagen schon in r1f.
2. **Nähte N1–N3** gemessen (`data/teilB/naehte_r2d.jsonl`). Alle liegen im selben Bereich wie die schon benutzten Ketten b4 und c2 (24–25°).

   | Naht | Übergang | Haltungsabweichung beim Vorschlag | bestes Einstiegsbild |
   |---|---|---|---|
   | N1 | Jump_Chop 0,967 s → Jump_Start 0,13 s | 21,8° | 0,133 s (21,7°) |
   | N2 | Jump_Idle 0,12 s → 2H_Spinning 0,167 s | 24,6° | 0,167 s, gleich |
   | N3a | Jump_Start 0,30 s → 2H_Spin 0,25 s | 26,6° | im Ausholen kein besseres; 22,2° erst bei 1,43 s, nach dem Hieb |
   | N3b | 2H_Spin 1,11 s → Jump_Land 0 s | 22,6° | 0 s, gleich |

3. **a1, Klingen-Versatz nach V-581** (`data/teilB/versatz_a1.json`).
   - Ohne Versatz geht die Klinge bis 24 cm in Kopf und Ohren.
   - Geprüft: feste Drehungen um alle drei Waffen-Achsen, je ±10–40°.
   - Bester Wert: **x −30°**. Damit ist die Klinge bis zum Kontakt (0,13–0,27 s) frei, +1 cm.
   - Im Ausschwingen (0,30–0,43 s) steckt sie bei jeder Drehung 11–24 cm im Kopf.
   - **Vorschlag:** a1 mit x −30° nur bis Kontakt spielen und direkt danach in Chop überblenden, oder ersetzen durch Mixamo „Stable Sword Outward/Inward Slash“.
4. **Spiel-Clips** (FB-Spiel und KayKit Medium):
   - a1 und b1 nach V-1752 repariert. FB 1,16 / 1,09 cm, KayKit 1,16 / 1,24 cm, alle ≤ 1,5 cm (`data/teilB/ik_r2d.json`).
   - Dateien: `clips_fb/`, `clips_kaykit/`, `clips_roh/` `KFB_Katana_R2d.*`, Clipnamen `kfb_katana_a1_r2d` und `kfb_katana_b1_r2d`.
   - KayKit-Originale (Diagonal, Chop, Jump_Chop, 2H_Spinning, 2H_Spin, Jump_*) bleiben unverändert.
   - Katana an `handslot.r` ohne Versatz, außer dem a1-Vorschlag.
5. **Bodenausgleich** je Figur × Clip und je Bild, 8 Figuren × 10 Clips (`data/teilB/floorlift/`).
   - Auffällig sind nur b1 (bis 11 cm, Hocke in der Drehung) und Jump_Idle (Füße 5 cm unter Standhöhe, im Spiel in der Luft).
   - Kein Kopf ist tiefster Punkt.
6. **Daten im Pool-Format:** `data/teilB/clips.katana_r2d.json`.
   - Je Clip: Rolle (Leicht 1–3, Schwer FB/NPC, Sprungangriff, Landung), Fenster, Extreme (Ausholen, Kontakt, Ausschwingen), Kontaktzeit, `rigs`.
   - Dazu: Messung (Spitze im Kontakt, Wurzelweg, Absprung/Landung), Reparaturwerte, Bodenausgleich, Nähte, a1-Versatz.
   - `rigs`: b1 nur `fb`, b3 nur `kaykit` (für FB gesperrt), alle übrigen `fb` und `kaykit`.

## Beleg
- **Extrem-Bilder** aus der Liste der Auswahl, nur Extreme: `beleg/teilB/EXTREME_r2d_v2.jpg`, Einzelbilder `beleg/teilB/extreme_v2/`. Web-FB r1g mit Katana.
  - c2: Hocke 0,27 · Luft 0,87 · Kontakt 1,00 · Ausschwingen 1,17.
  - waagerecht: 0,20 · 0,27 · 0,50.
  - b4 (Sprungbahn +0,30 m): 0,27 · 0,58 · 0,90.
  - b3: 0,40 · 0,73 · 1,33.
  - a1 (ohne und mit Versatz): 0,20 · 0,23 · 0,27 · 0,33.
  - b1: 0,43 · 0,67 · 0,77.
  - Diagonal: 0,30 · 0,433 · 0,50.
  - Chop: 0,37 · 0,60 · 0,67.
  - c1: Aufsetzen 0,07 · Einfedern 0,10 · tiefster Punkt 0,27.
- **Spiel-Belege:** Spiel-FB (`FB_WEB_KANON.r1d`) und NPC Lord Hunky mit Katana, je Pick seitlich bzw. schräg vorn plus Spielkamera. `beleg/teilB/BELEG_SPIEL_r2d_v2.jpg`, Einzelbilder `beleg/teilB/spiel_v2/`.
- **Kanon-Wache:** Ohren, Schwanz und Augen überall vorhanden.
- **Kritiker:** blind, nur Bilder. Sein größter Befund war, dass die Kamera bei Drehungen von hinten zeigt.
  - **Behoben:** Die Kamera richtet sich jetzt nach der Brust der Figur im jeweiligen Bild (Profil bzw. schräg vorn).
  - Die erste Fassung (`beleg/teilB/extreme/`, `beleg/teilB/spiel/`, ohne `_v2`) liegt noch in der Dropbox, ist nicht im Bundle und steht auf der Löschliste.
- **Weitere Befunde aus den Clips selbst**, zur Kenntnis für die Choreo:
  - Chop holt mit der Klinge senkrecht vor dem Gesicht aus, und der Kontakt liest sich eher als Stich.
  - In c2 sind „Hocke“, Kontakt und Ausschwingen sich ähnlich; das Ausholen in der Luft (0,87 s) ist das starke Bild.
  - FB_Katana_waagerecht: Im Kontakt wirkt die Klinge verkürzt, weil sie in Blickrichtung zeigt.
  - c1: Beim Aufsetzen ist wenig Stauchung zu sehen.

## Offen
- Mixamo-Runde (9 Clips) nach Georgs Download.
- Echtes Wegstecken der Klinge fehlt weiter.
- Sprungangriff c2: Der Chop hebt die Hüfte selbst um 0,36 m; mit der Sprungphysik im Spiel darf das nicht doppelt zählen (WS1).

## Ordner (neu in Teil B)
| Ordner | Inhalt |
|---|---|
| `clips_fb/`, `clips_kaykit/`, `clips_roh/` | `KFB_Katana_R2d.*` |
| `data/teilB/` | `clips.katana_r2d.json`, `floorlift/` (8 Figuren), `naehte_r2d.jsonl`, `versatz_a1.json`, `ik_r2d.json`, `extreme_r2d.v2.json` |
| `beleg/teilB/` | `EXTREME_r2d_v2.jpg`, `BELEG_SPIEL_r2d_v2.jpg`, `extreme_v2/`, `spiel_v2/` |
| `scripts/teilB/` | Skripte |
| `../FB_WEB_KANON_R1/` | `_privat_kauf_asset/FB_WEB_KANON_agent_twin.r1g.glb`, `RETURN_r1g.md`, `data/r1g/`, `scripts/r1g/` |
