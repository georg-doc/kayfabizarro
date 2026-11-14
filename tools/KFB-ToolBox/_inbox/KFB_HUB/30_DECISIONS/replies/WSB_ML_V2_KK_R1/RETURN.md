# ML v2 KayKit-Korrektur R1 · RETURN (WSB, Mac mini, 14.11.2026)

**Auftrag (WS0, Georgs Ja):** Dieselbe Arm-Korrektur je Clip wie bei ML v1 (WSB_HALTUNG_R1), jetzt für die v2-Bibliotheken. Geliefert als `.kk.glb`.
- Geändert nur `kfb_idle_*` und `kfb_gesture_*` mit Armen im Körper.
- KayKit-Originalclips bleiben unverändert (q665).
- Beleg: vorher/nachher an 2 NPCs.

## Dateien (`clips_kaykit/`)

| Datei | sha256 (Anfang) | Quelle |
|---|---|---|
| `KFB_Motion_idle.v2.Rig_Medium.kk.glb` | 3e28b53c29a14b9a | `KFB_Motion_idle.glb` (1 774 948 B, 44583608cdeec566…) |
| `KFB_Motion_gesture.v2.Rig_Medium.kk.glb` | 1408804636d3153e | `KFB_Motion_gesture.glb` (1 109 192 B, e1211f1bc00a94de…) |

- Quellen: `30_DECISIONS/replies/WSB_HALTUNG_R1/v2_quellen/` (kayfabizarro @7b5cf664). Volle Prüfsummen in `clips_kaykit/QUELLEN_SHA256.txt`.
- Gleiche Clipnamen, gleiche Clipzahl wie die Quelle (29 und 17).
- Geändert sind nur die Drehspuren von `upperarm.l` und `upperarm.r` in den korrigierten Clips. Alle anderen Spuren sind bitgleich zur Quelle, geprüft: idle 1951 gleich, 50 Oberarm-Spuren geändert; gesture 1151 gleich, 22 geändert.

## Verfahren (wie ML v1)
1. **Messen:**
   - Werkzeug: `scripts/messe4.mjs`. Das ist der Innen-Test mit Strahlen-Parität, weil die KayKit-Rümpfe offen sind.
   - Sechs KayKit-Körper: Barbarian, Farmer_B, Lorekeeper, Skeleton_Warrior, Mage und GothGirl.
   - Gemessen werden alle 46 Clips, jeweils mit 0, 4, 8 und 12° Abspreizen. Testfiguren entstehen mit `scripts/mkfig.mjs`.
2. **Stufe je Clip:**
   - Abgespreizt wird nur, wenn es den Höchstwert „Unterarm/Hand im Rumpf“ über alle sechs Körper um mindestens 0,5 cm senkt.
   - Dann gilt die kleinste Stufe, die ≤ 1,5 cm erreicht, sonst die kleinste Stufe innerhalb von 0,3 cm des besten Werts.
   - Gegenüber v1 kamen die 0,5 cm Mindestnutzen dazu. Sonst bekämen Clips wie Winken 12° für 0,05 cm.
3. **Backen:**
   - Werkzeug: `scripts/arm_korr.mjs` (IDLE_R1), gleiche Achse wie v1.
   - Drei Stufen zu je −4°, mit Gewicht je Clip (`data/gewichte_w4/w8/w12_*.json`).
4. **Gegenprobe:**
   - Die gebackenen Dateien wurden ohne Laufzeit-Korrektur gemessen und entsprechen den Werten der gewählten Stufe.
   - Ergebnis: 92 von 92 gleich (Barbarian und Lorekeeper, `data/messung/mkk_*.json`).

## Ergebnis je Clip
Volle Tabelle mit allen Stufen in `data/auswahl_v2.json`.

| Stufe | Clips |
|---|---|
| +12° (30) | idle: breathing_a/b, defeat, drunk_idle_variation, happy, idle_a–f, injured, kneeling, laughing, lying_down, ninja_a/b, offensive_idle, orc, sad, sitting, standing, unarmed_idle_looking · gesture: angry, clapping, dismissing, pointing, standing_clap, strong, thoughtful_head_shake |
| +8° (5) | idle: mutant_idle, rejected · gesture: standing_greeting, talking_on_phone, yelling |
| +4° (1) | gesture: counting |
| 0, unverändert (10) | idle: old_man_idle, praying, standing_idle_03, treading_water · gesture: cheering, look_over_shoulder, salute, talking, taunt, waving |

**Befund:** Die v2-Clips stecken die KayKit-Arme deutlich tiefer in den Rumpf als ML v1.
- Höchstwerte vorher meist 8–16 cm, bei v1 waren es 2–6 cm.
- Mit +12° sinkt das um rund ein Drittel, z. B. happy 7,9 → 4,4 cm, drunk 8,4 → 4,9 cm, ninja 9,8 → 5,4 cm, breathing 13,6 → 9,3 cm.
- Ursache: Viele v2-Idles beugen schon in den Daten den Oberkörper stark vor, z. B. idle_a, standing, breathing. Die Arme hängen dann in den Bauch.
- Die sanfte Korrektur (höchstens 12°, nur Oberarm) löst das bei diesen Clips nicht ganz.
- Wege, Entscheid WS0 bzw. Georg:
  - stärkere Stufen (16/20°) nur für die tief gebeugten Clips;
  - diese Clips für KayKit-NPCs aus den Pools nehmen;
  - eine eigene Fassung je Clip mit Ellbogen.

## Beleg
`blaetter/V1_npc_vorher_nachher.jpg`:
- Körper: Barbarian und Lorekeeper.
- Clips: happy, idle_b, drunk_idle, ninja, pointing, dismissing.
- Je Clip das schlimmste Bild, vorher und nachher, mit dem gemessenen Wert für diesen Körper.

## Einbau (WS0)
- Die `.kk.glb` ersetzen für KayKit-Körper die v2-Bibliotheken `libs/Rig_Medium/KFB_Motion_idle.glb` und `KFB_Motion_gesture.glb`, so wie die ML-v1-`.kk.glb`.
- Wo die Datei im Spiel hinkommt, entscheidet WS0.
- FB behält seine `.fb.glb` aus WSB_HALTUNG_R1.
- Spielcode unverändert.

## Ordner
- `clips_kaykit/`
- `data/`: Auswahl, Stufen, Gewichte, `messung/` mit 24 Messläufen und 2 Gegenproben
- `blaetter/`
- `scripts/`: mkfig, messe4, arm_korr, Korrektur-Dateien k0–k12
