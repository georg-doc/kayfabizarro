# Für WSB (Mac mini, Blender MCP) · Katana R2d: Luft- und Sprung-Hiebe für Spiel, Hero-Shots und Choreografie · 15.11. (Georg, V-1805)

**Kern (3 Zeilen):**
1. Claude Design baut den Hero-Shot v9 mit echter Körpermechanik: Sprungbahn, Schnitt am Scheitel oder im Fallen, Landung (V-1766). Es fehlen drei Bewegungen: ein **steigender Aufwärtsschnitt**, ein **waagerechter Luft-Hieb mit Körperdrehung** und eine **Katana-Landung mit Nachfedern**.
2. Georg: Die Clips sollen auch im Spiel nutzbar sein und Kampf, Hero-Shots und Choreografien voranbringen. Also auf FB (Web und Spiel) und auf KayKit Medium.
3. Bestand zuerst, nur fertige Clips, keine eigenen Keyframes (V-574). Teil A: Kandidaten, Georg wählt im Hub. Teil B: Einbau nach der Wahl.

**Grundlage:** Stamm `game/integration-r2` @5d39e2e1, Assets `assets/private` @f922c319. Pfade ohne Präfix liegen in `assets/private`.

| Teil | Bestand (geprüfter Pfad) |
|---|---|
| FB-Web mit Katana (heute r1f) | `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON_agent_twin.r1f.glb`, Messblatt `50_BLENDER/FB_WEB_KANON_R1/RETURN_r1f.md` |
| Katana, Griff, `KFB_Tip` | `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/waffen/KFB_Katana.r1d.glb`; Spiel-Karte Stamm `src/data/combat/k10/kfb_kit_ninja_katana.fb_r1.weapon.json` |
| Katana im Spiel (Clips, Treffer, Hit-Stop 48 ms) | Stamm `src/data/combat/katanaReference.r1.json` |
| KayKit-Nahkampf, unverändert (V-1752) | Stamm `src/assets/actors/Rig_Medium_CombatMelee.glb`, z. B. `Melee_1H_Attack_Jump_Chop`, `Melee_2H_Attack_Spin`, `Melee_2H_Attack_Spinning`, `Melee_1H_Attack_Slice_Horizontal`; Sprung `Jump_Start`, `Jump_Idle`, `Jump_Land` |
| Weitere Bibliotheken | `motion_lib_r1/`, `50_BLENDER/GEGNER_R1/_privat_kauf_asset/mixamo/`, Quaternius UAL 1/2 (lokal, wie Kulturtechniken Teil A) |
| FB-Spiel-Clips (Übertrag) | Skript `50_BLENDER/IDLE_R1/scripts/clips_auf_figur.mjs`, Ablage wie `50_BLENDER/IDLE_R1/clips_fb/` |

**Teil A (sofort):**
- Je Bewegung (Aufwärtsschnitt, Luft-Hieb mit Drehung, Landung mit Nachfedern) höchstens 6 Kandidaten. Zuerst aus dem Bestand oben, dann aus freien Bibliotheken.
- Mixamo lädt nur Georg selbst (V-454): Name, Link und Vorschau der Quelle auf einer eigenen Hub-Folie, wie in Kulturtechniken Teil A.
- Auch Ketten aus Bestandsclips zählen als Kandidat, z. B. `Jump_Start` → `Melee_1H_Attack_Jump_Chop` → `Jump_Land`, mit Blend-Daten (blendS, Einstiegsframe). Es werden keine neuen Zwischenbilder erzeugt.
- Je Kandidat eine eigene Vorschau, FB mit Katana auf derselben Bühne und mit derselben Kamera wie Kulturtechniken Teil A, vorn-seitlich, Dateiname = Kandidat.
- Je Kandidat gemessen:
  - Höhe von `KFB_Tip` über dem Boden im Schnittmoment, mit Zeitpunkt.
  - Wurzelweg in Metern (vor, hoch).
  - Bodenkontakt Absprung und Landung in Sekunden.

**Teil B (nach Georgs Hub-Wahl):**
- **FB-Web:** `FB_WEB_KANON_agent_twin.r1g.glb` = r1f plus die gewählten Clips, sonst nichts geändert, Messwerte in `RETURN_r1g.md` wie bei r1f.
- **FB-Spiel und KayKit Medium:**
  - Importierte Clips nach V-1752 repariert (≤ 1,5 cm im Rumpf).
  - Bodenausgleich je Figur × Clip wie K12 (V-596).
  - Katana an `KFB_Grip` mit festem slotOffset (V-536, V-574).
  - Daten im Pool-Format wie `clips.kulturtechniken_r1.json`, mit Feldern für Schnittzeit, Tip-Höhe, Wurzelweg, Absprung/Landung und `rigs`.
- **Beleg:** vorn oder seitlich auf der einheitlichen Proof-Stage, Knete, KFB-Augen, Kanon-Wache FB, ein Kritiker je Runde.

**Rückgabe:** Git-Bundle mit Zweig `assets/wsb-katana-luft-r2d` von `assets/private` @f922c319, RETURN.md und Vorschauen in `KFB_HUB/30_DECISIONS/replies/WEB_KANON_R2/MINI_r2d/`. WS0 pusht, baut die Hub-Karten, gibt r1g an Claude Design weiter und baut die Clips ins Spiel ein (Katana-Kombos, Hero-Shots, `kfb-choreo`).
