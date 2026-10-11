# WSO → Steuerung · Clip-Katalog R1 (12.10.2026)

Auftrag: `replies/BRIEF_WSA_CLIP_CATALOG_R1.md` (für den Motion-Leitfaden `MOTION_GUIDE_R1.md` v0.2, [V-177], [V-179]–[V-181]). Bearbeitet von WSO/Fable02, nicht WSA. **Kein neuer Beschluss.** Maßgeblich bleibt das Register [V-117].
Daten: `WSO_CLIP_CATALOG_R1/clip-catalog.json` (290 Einträge, je Clip Messwerte und Vorschlag getrennt).

**Lesehilfe**
- **gem.** = aus dem glTF-JSON und dem BIN-Block der GLB gelesen (eigenes Skript, kein three.js): Dauer = letzter Keyframe; „Rückkehr“ = alle bewegten Kanäle enden ≤ 6° bzw. ≤ 3 % Hüfthöhe von der Startpose (Schwelle wie KFB Motion Library RETURN); Körper = Knochen mit Bewegung > 2° bzw. > 1 % Hüfthöhe; Versatz = horizontale Wanderung von root/hips Start→Ende in Hüfthöhen.
- **Vorschlag** = WSO-Vorschlag ohne Quelle: Schleife, Trigger, Ebene (Leitfaden §1d: Grundzustand, Ausdruck, Physik, Gameplay), Augen (lead/lag/lock/float), Kamera (gut/mittel/schlecht aus der Chase-Kamera), Zuordnungen. Gilt erst nach Georgs Ja.
- „Schleife“ unterscheidet Zyklus (läuft rund), Halten (Zyklus in der Luft), einmal (spielt einmal, Endpose = Startpose) und einmal ohne Rückkehr (Übergang in eine andere Pose). KayKit legt bei fast allen Clips die Startpose ans Ende, darum ist „Rückkehr = ja“ bei KayKit kein Beleg für eine Schleife.
- Lab = Datei liegt heute in `LAB/public/assets/` (Teil der Parity). Sonst „nachladen“.

## 0 · Kurzfassung

- Gelesen: 16 GLB-Dateien, 290 Clip-Einträge (KayKit 1.1: 139 Medium in 8 Packs, 34 Large in 6 Packs, jeweils inkl. 8 bzw. 6 T-Posen und 3 Standbildern; KFB Motion Library: 33 × 2 Rigs; i06: 6; Quaternius-Figur: 45). Die Zahlen des Leitfadens §1b stimmen.
- Repo-Stand: `georg-doc/kayfabizarro` main `dccf75c` (10.10.2026, lokaler Klon). Die sechs Lab-GLBs sind byte-gleich mit dem Repo (md5 geprüft an `Rig_Medium_General.glb`).
- Im Lab liegen 45 KayKit-Clips (M 35 + L 10) und 6 KFB-Interaktionsclips. Nachzuladen für die Demos §6: KFB Motion Library (Repo, 33 Clips je Rig) und bei Bedarf `Rig_Medium_MovementAdvanced` (§7 Frage 5).
- Quaternius Universal Animation Library als Ordner: nicht gefunden im Repo. Ersatz im Repo: `KFB/Animated Base Character by Quaternius` mit 45 eingebauten UAL-Clips auf einem Rigify-Rig (u. a. `Idle_Talking_Loop`, `Dance_Loop`, `Driving_Loop`). Nur mit Retargeting nutzbar.
- Lücken ohne Clip in allen Quellen: Flug, Beifahrer, turn_90, look_at/blink (prozedural, Eye-Rig), Wut/Skepsis/Sorge als Idle, Sprech-Clip auf KayKit-Rig, Geschenke, Kayfabulieren, Paar-Tanz, Lesen. Liste §4.
- Top 20 fürs MVP: 17 davon schon im Lab (§5).

## 1 · Quellen und Methode

| Quelle | Pfad | Rig | Clips | Stand |
| --- | --- | --- | --- | --- |
| KayKit Character Animations 1.1 | `media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/*.glb`, `…/Rig_Large/*.glb` (14 Dateien) | Rig_Medium (23 Knochen) / Rig_Large (23 Knochen) | 139 M / 34 L (inkl. Posen) | Repo main dccf75c |
| KFB Motion Library 01 | `media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library_Rig_Medium.glb`, `…_Rig_Large.glb` + `catalog.json`, `RETURN.md` | Rig_Medium / Rig_Large | 33 + 33 | Repo main dccf75c; Georg ACCEPTED 24.09. (RETURN); Nutzung nach [V-179] |
| KFB Motion interaction i06 | `LAB/public/assets/kfb-motion/KFB_Motion_interaction_i06.glb` | Rig_Medium | 6 | nur im Lab; im Repo nicht gefunden |
| Quaternius-Figur mit UAL-Clips | `media/3D_Assets/KFB/Animated Base Character by Quaternius - cwYvO5UauX.glb` | Rigify (`DEF-*`), nicht KayKit | 45 | Repo main dccf75c; Retargeting nötig |
| Quaternius Universal Animation Library (Ordner) | – | – | – | nicht gefunden in `media/3D_Assets`; nur Erwähnung in `skills/chat/workflows/FREE_ROAM_PLATFORMER_POC_2026-09-18/CLAUDE_DESIGN_BRIEF.md`; Zip laut Leitfaden §1b in `DL`, hier nicht ausgelesen (Auftrag: „falls im Repo“) |
| KayKit Legacy 1.2 | `media/3D_Assets/KayKit Legacy/KayKit Character Animations 1.2 - legacy/` | – | 0 | nur Doku-Ordner, keine GLB/FBX im Repo |

Methode: `glb_clips.py` + `measure.py` (liegen neben der JSON, §7). Die Cross-Check-Werte stimmen mit dem Bestand überein: Dauern der Lab-GLBs = Leitfaden §1b, Dauern und Loop-Flags der KFB Motion Library = `RETURN.md` (alle 33), Rollen-Clips = `locomotion-profiles.v1.js`.

## 2 · Übersicht je Datei (gem. + Vorschlag)

Spalten: s = Dauer in Sekunden (gem.) · R = Rückkehr zur Startpose (gem.) · Körper (gem.) · V = Versatz root/hips in Hüfthöhen (gem.) · Schleife, Ebene, Augen, Kamera, Zuordnung = Vorschlag.

### 2a · KayKit Character Animations 1.1

**`Rig_Medium_CombatMelee.glb`** · Medium · 21 Clips + 1 Standbild(er) · nachladen

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Melee_1H_Attack_Chop | 1,07 | ja | Ganzkörper (19) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_1H_Attack_Jump_Chop | 1,33 | ja | Ganzkörper (19) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_1H_Attack_Slice_Diagonal | 1,00 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_1H_Attack_Slice_Horizontal | 1,37 | nein | Ganzkörper (18) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_1H_Attack_Stab | 1,60 | ja | Ganzkörper (16) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_2H_Attack_Chop | 1,63 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_2H_Attack_Slice | 1,10 | ja | Ganzkörper (16) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_2H_Attack_Spin | 2,40 | ja | Ganzkörper (18) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_2H_Attack_Spinning | 0,67 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_2H_Attack_Stab | 1,60 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_2H_Idle | 1,07 | ja | Ganzkörper (15) | 0 | Zyklus | Grundzustand | lead | gut | M: Kampf §4 |
| Melee_Block | 1,07 | nein | Ganzkörper (17) | 0,25 | einmal | Gameplay | lock | mittel | M: Rauferei (abwehren), Kampf §4 · *Endpose ≠ Startpose (Übergang in Blocking)* |
| Melee_Block_Attack | 1,07 | ja | Ganzkörper (18) | 0 | einmal | Gameplay | lock | mittel | M: Rauferei (abwehren), Kampf §4 |
| Melee_Block_Hit | 1,07 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lock | mittel | M: Rauferei (abwehren), Kampf §4 |
| Melee_Blocking | 1,07 | ja | Ganzkörper (15) | 0 | Zyklus | Gameplay | lock | mittel | M: Rauferei (abwehren), Kampf §4 |
| Melee_Dualwield_Attack_Chop | 1,27 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_Dualwield_Attack_Slice | 1,17 | ja | Ganzkörper (19) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_Dualwield_Attack_Stab | 1,60 | ja | Ganzkörper (18) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_Unarmed_Attack_Kick | 0,93 | ja | Ganzkörper (16) | 0 | einmal | Gameplay | lead | gut | M: Rauferei · *cartoonig ohne Schaden: Abgrenzung §4 offen* |
| Melee_Unarmed_Attack_Punch_A | 1,17 | ja | Ganzkörper (16) | 0 | einmal | Gameplay | lead | gut | M: Rauferei · *cartoonig ohne Schaden: Abgrenzung §4 offen* |
| Melee_Unarmed_Idle | 1,07 | ja | Ganzkörper (11) | 0 | Zyklus | Grundzustand | lead | gut | E: Wut (Kampfhaltung, Kandidat) · M: Rauferei (Haltung) |
| T-Pose | 0 | – | Pose | – | Standbild | – | – | – | – |

**`Rig_Medium_CombatRanged.glb`** · Medium · 19 Clips + 1 Standbild(er) · nachladen

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ranged_1H_Aiming | 1,07 | nein | Ganzkörper (18) | 0,16 | Zyklus | Gameplay | lock | mittel | M: Kampf §4 · *Aiming/Draw: Endpose ≠ Startpose* |
| Ranged_1H_Reload | 1,17 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lock | mittel | M: Kampf §4 |
| Ranged_1H_Shoot | 1,07 | ja | Ganzkörper (18) | 0 | einmal | Gameplay | lock | mittel | M: Kampf §4 |
| Ranged_1H_Shooting | 1,60 | ja | Ganzkörper (16) | 0 | Zyklus | Gameplay | lock | mittel | M: Kampf §4 |
| Ranged_2H_Aiming | 1,60 | nein | Ganzkörper (18) | 0 | Zyklus | Gameplay | lock | mittel | M: Kampf §4 · *Aiming/Draw: Endpose ≠ Startpose* |
| Ranged_2H_Reload | 1,60 | ja | nur Oberkörper (10) | 0 | einmal | Gameplay | lock | mittel | M: Kampf §4 |
| Ranged_2H_Shoot | 1,07 | nein | Ganzkörper (18) | 0 | einmal | Gameplay | lock | mittel | M: Kampf §4 · *Aiming/Draw: Endpose ≠ Startpose* |
| Ranged_2H_Shooting | 1,07 | ja | Ganzkörper (16) | 0 | Zyklus | Gameplay | lock | mittel | M: Kampf §4 |
| Ranged_Bow_Aiming_Idle | 1,83 | ja | Ganzkörper (14) | 0 | Zyklus | Gameplay | lock | mittel | M: Kampf §4 |
| Ranged_Bow_Draw | 1,33 | nein | Ganzkörper (17) | 0,19 | einmal | Gameplay | lock | mittel | M: Kampf §4 · *Aiming/Draw: Endpose ≠ Startpose* |
| Ranged_Bow_Draw_Up | 1,33 | nein | Ganzkörper (18) | 0,19 | einmal | Gameplay | lock | mittel | M: Kampf §4 · *Aiming/Draw: Endpose ≠ Startpose* |
| Ranged_Bow_Idle | 1,57 | ja | Ganzkörper (14) | 0 | Zyklus | Gameplay | lock | mittel | M: Kampf §4 |
| Ranged_Bow_Release | 1,33 | nein | Ganzkörper (17) | 0,03 | einmal | Gameplay | lock | mittel | M: Kampf §4 · *Aiming/Draw: Endpose ≠ Startpose* |
| Ranged_Bow_Release_Up | 1,37 | nein | Ganzkörper (17) | 0,03 | einmal | Gameplay | lock | mittel | M: Kampf §4 · *Aiming/Draw: Endpose ≠ Startpose* |
| Ranged_Magic_Raise | 2,10 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4, Kayfabulieren (Geste „große Behauptung“, Idee WSO) |
| Ranged_Magic_Shoot | 0,93 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4, Kayfabulieren (Geste „große Behauptung“, Idee WSO) |
| Ranged_Magic_Spellcasting | 0,67 | ja | Ganzkörper (13) | 0 | Zyklus | Gameplay | lead | gut | M: Kampf §4, Kayfabulieren (Geste „große Behauptung“, Idee WSO) |
| Ranged_Magic_Spellcasting_Long | 2,53 | ja | Ganzkörper (19) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4, Kayfabulieren (Geste „große Behauptung“, Idee WSO) |
| Ranged_Magic_Summon | 4,30 | ja | Ganzkörper (18) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4, Kayfabulieren (Geste „große Behauptung“, Idee WSO) |
| T-Pose | 0 | – | Pose | – | Standbild | – | – | – | – |

**`Rig_Medium_General.glb`** · Medium · 12 Clips + 3 Standbild(er) · Lab

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Death_A | 0,80 | nein | Ganzkörper (20) | 1,15 | einmal ohne Rückkehr (Endpose = Death_A_Pose) | Physik | lock | gut | M: Rauferei (Cartoon-KO) · *Root wandert, liegt am Ende* |
| Death_A_Pose | 0 | – | Pose | – | Standbild | – | – | – | – |
| Death_B | 2,63 | nein | Ganzkörper (19) | 0,60 | einmal ohne Rückkehr (Endpose = Death_B_Pose) | Physik | lock | gut | M: Rauferei (Cartoon-KO) |
| Death_B_Pose | 0 | – | Pose | – | Standbild | – | – | – | – |
| Hit_A | 0,67 | ja | Ganzkörper (15) | 0 | einmal | Physik | lag | mittel | E: Schreck (leicht) · M: Rauferei, Brick-Fish (Treffer), Debatte (recoil) · *Large: Endpose ≠ Startpose (19°)* |
| Hit_B | 0,87 | ja | Ganzkörper (14) | 0 | einmal | Physik | lag | gut | **MVP 13** · E: Schreck · M: Rauferei, Brick-Fish (Treffer) |
| Idle_A | 1,07 | ja | Ganzkörper (10) | 0 | Zyklus | Grundzustand | float | gut | **MVP 1** · Z: Stehen · E: neutral · SK: idle_breathe (Basis, Mikro prozedural) |
| Idle_B | 2,13 | ja | Ganzkörper (15) | 0 | Zyklus | Grundzustand | float | gut | Z: Stehen · E: neutral · SK: idle_breathe (Variante) · *Large: 6,0 s* |
| Interact | 1,30 | ja | Ganzkörper (16) | 0 | einmal | Gameplay | lock | mittel | M: Geschenke (geben/annehmen, Kandidat), Fluff (formen, Kandidat), Lesen (Buch nehmen, Kandidat) |
| PickUp | 1,30 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lock | gut | M: Geschenke (annehmen vom Boden), Fluff (nur wenn nicht durch Darüberlaufen; Steuer-Gedächtnis: Aufsammeln = Darüberlaufen) · *Reserve-Rang 22* |
| Spawn_Air | 1,30 | nein | Ganzkörper (23) | 0 | einmal ohne Rückkehr | Gameplay | lock | gut | – · *Root fällt aus 5,1 Hüfthöhen; nur für Spawn-Effekte* |
| Spawn_Ground | 1,30 | nein | Ganzkörper (23) | 0 | einmal ohne Rückkehr | Gameplay | lock | gut | – |
| T-Pose | 0 | – | Pose | – | Standbild | – | – | – | – |
| Throw | 1,37 | ja | Ganzkörper (19) | 0 | einmal | Gameplay | lead | gut | M: Brick-Fish (Wurf), Geschenke (werfen) · *Augen zuerst zum Ziel* |
| Use_Item | 1,60 | ja | Ganzkörper (14) | 0 | einmal | Gameplay | lock | mittel | M: Fluff (formen, Kandidat) |

**`Rig_Medium_MovementAdvanced.glb`** · Medium · 12 Clips + 1 Standbild(er) · nachladen

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Crawling | 1,07 | ja | Ganzkörper (18) | 0 | Zyklus | Grundzustand | float | mittel | – · *kein §2b-Zustand* |
| Crouching | 1,07 | ja | Ganzkörper (18) | 0 | Zyklus | Grundzustand | float | gut | – · *kein §2b-Zustand* |
| Dodge_Backward | 0,40 | nein | Ganzkörper (17) | 2,42 | einmal mit Versatz | Physik | lead | mittel | M: Rauferei (ausweichen), Brick-Fish (ausweichen) · *Root-Versatz 0,9–2,4 Hüfthöhen: erkennen, nie still anwenden (§5)* |
| Dodge_Forward | 0,40 | nein | Ganzkörper (18) | 0,93 | einmal mit Versatz | Physik | lead | mittel | M: Rauferei (ausweichen), Brick-Fish (ausweichen) · *Root-Versatz 0,9–2,4 Hüfthöhen: erkennen, nie still anwenden (§5)* |
| Dodge_Left | 0,40 | nein | Ganzkörper (18) | 1,86 | einmal mit Versatz | Physik | lead | gut | M: Rauferei (ausweichen), Brick-Fish (ausweichen) · *Root-Versatz 0,9–2,4 Hüfthöhen: erkennen, nie still anwenden (§5)* |
| Dodge_Right | 0,40 | nein | Ganzkörper (18) | 1,86 | einmal mit Versatz | Physik | lead | gut | M: Rauferei (ausweichen), Brick-Fish (ausweichen) · *Root-Versatz 0,9–2,4 Hüfthöhen: erkennen, nie still anwenden (§5)* |
| Running_HoldingBow | 0,80 | ja | Ganzkörper (15) | 0 | Zyklus | Gameplay | float | gut | – |
| Running_HoldingRifle | 0,80 | ja | Ganzkörper (16) | 0 | Zyklus | Gameplay | float | gut | – |
| Running_Strafe_Left | 0,80 | ja | Ganzkörper (19) | 0 | Zyklus | Grundzustand | lead | mittel | – · *Widerspruch zu [V-022] melden, nicht still lösen* |
| Running_Strafe_Right | 0,80 | ja | Ganzkörper (19) | 0 | Zyklus | Grundzustand | lead | mittel | – · *[V-022]* |
| Sneaking | 2,13 | ja | Ganzkörper (17) | 0 | Zyklus | Grundzustand | lead | gut | – · *kein §2b-Zustand* |
| T-Pose | 0 | – | Pose | – | Standbild | – | – | – | – |
| Walking_Backwards | 1,07 | ja | Ganzkörper (17) | 0 | Zyklus | Grundzustand | float | mittel | Z: Gehen (rückwärts) · M: Debatte (Rückzug, Kandidat) · *Figur kommt auf die Chase-Kamera zu* |

**`Rig_Medium_MovementBasic.glb`** · Medium · 10 Clips + 1 Standbild(er) · Lab

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jump_Full_Long | 2,33 | ja | Ganzkörper (17) | 0 | einmal | Grundzustand | lag | gut | **MVP 10** · Z: Weitsprung |
| Jump_Full_Short | 1,17 | ja | Ganzkörper (17) | 0 | einmal | Grundzustand | lag | gut | **MVP 9** · Z: Sprung aus Joggen · SK: hop (Basis-Kandidat, kurz) |
| Jump_Idle | 1,07 | ja | Ganzkörper (14) | 0 | Halten (Zyklus in der Luft) | Grundzustand | lock | gut | **MVP 7** · Z: Sprung im Stand (Luft), Flug (Schwebe-Stand-in, bis Flug-Clip da ist) · *Motion Matrix: Schweben = Augen gelockt* |
| Jump_Land | 0,67 | nein | Ganzkörper (17) | 0 | einmal → Idle/Walk | Physik | lag | gut | **MVP 8** · Z: Sprung im Stand (Landung) · SK: hop (Landung, Kandidat) · *Squash-Fenster für [V-179]* |
| Jump_Start | 0,60 | nein | Ganzkörper (15) | 0 | einmal → Jump_Idle | Grundzustand | lag | gut | **MVP 6** · Z: Sprung im Stand (Start) · SK: hop (Absprung, Kandidat) · *Endpose = Anfang Jump_Idle* |
| Running_A | 0,80 | ja | Ganzkörper (18) | 0 | Zyklus | Grundzustand | float | gut | **MVP 4** · Z: Joggen · *[V-020] PASS* |
| Running_B | 0,80 | ja | Ganzkörper (18) | 0 | Zyklus | Grundzustand | float | gut | **MVP 5** · Z: Sprint |
| T-Pose | 0 | – | Pose | – | Standbild | – | – | – | – |
| Walking_A | 1,07 | ja | Ganzkörper (17) | 0 | Zyklus | Grundzustand | float | gut | **MVP 3** · Z: Gehen · *gem. gait_v157: 1,052 lab/s* |
| Walking_B | 1,07 | ja | Ganzkörper (17) | 0 | Zyklus | Grundzustand | float | gut | Z: Gehen (Variante) |
| Walking_C | 1,60 | ja | Ganzkörper (15) | 0 | Zyklus | Grundzustand | float | gut | Z: Gehen (Variante, langsam 1,6 s) · *Start/Endpose 2,5° Abstand* |

**`Rig_Medium_Simulation.glb`** · Medium · 13 Clips + 1 Standbild(er) · Lab

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cheering | 1,67 | ja | Ganzkörper (16) | 0 | einmal (Zyklus möglich: Start = Endpose) | Ausdruck | lock | gut | **MVP 12** · E: Freude · M: Geschenke (Freude beim Annehmen), Tanz (Ersatz, kurz), Kayfabulieren (Triumph, Kandidat) |
| Lie_Down | 3,00 | nein | Ganzkörper (18) | 0,31 | einmal → Lie_Idle | Grundzustand | float | mittel | E: Müde (Einstieg) |
| Lie_Idle | 2,67 | ja | nur Oberkörper (9) | 0 | Zyklus | Grundzustand | float | schlecht | E: Müde (Kandidat, Schlaf laut Motion Matrix) · *nur Oberkörper, flach am Boden* |
| Lie_StandUp | 2,33 | nein | Ganzkörper (18) | 0,31 | einmal → Idle | Grundzustand | lead | mittel | – |
| Push_Ups | 1,03 | ja | Ganzkörper (18) | 0 | Zyklus | Gameplay | lock | mittel | – |
| Sit_Chair_Down | 0,80 | nein | Ganzkörper (18) | 1,01 | einmal → Sit_Chair_Idle | Grundzustand | float | mittel | **MVP 14** · Z: Sitzen (NPC) · M: Lesen (Beginn), Debatte (Publikum) · *Root wandert 1,0 Hüfthöhe nach hinten* |
| Sit_Chair_Idle | 3,60 | ja | nur Oberkörper (10) | 0 | Zyklus | Grundzustand | float | mittel | **MVP 15** · Z: Sitzen (NPC) · E: neutral · SK: idle_breathe (sitzend) · M: Lesen (sitzend, Oberkörper-Maske frei), Debatte (Publikum) · *nur Oberkörper animiert* |
| Sit_Chair_StandUp | 0,80 | nein | Ganzkörper (19) | 1,01 | einmal → Idle | Grundzustand | lead | mittel | **MVP 16** · Z: Sitzen (NPC) |
| Sit_Floor_Down | 1,00 | nein | Ganzkörper (17) | 0,30 | einmal → Sit_Floor_Idle | Grundzustand | float | mittel | Z: Sitzen (NPC) · M: Lesen, Debatte (Publikum am Boden) |
| Sit_Floor_Idle | 4,00 | ja | nur Oberkörper (10) | 0 | Zyklus | Grundzustand | float | mittel | Z: Sitzen (NPC) · E: neutral · M: Lesen, Debatte (Publikum) · *nur Oberkörper animiert* |
| Sit_Floor_StandUp | 1,13 | nein | Ganzkörper (18) | 0,30 | einmal → Idle | Grundzustand | lead | mittel | Z: Sitzen (NPC) |
| Sit_Ups | 1,73 | ja | Ganzkörper (15) | 0 | Zyklus | Gameplay | lock | mittel | – |
| T-Pose | 0 | – | Pose | – | Standbild | – | – | – | – |
| Waving | 2,13 | ja | Ganzkörper (15) | 0 | einmal (Zyklus möglich) | Ausdruck | lock | gut | **MVP 11** · E: Freude · M: Geschenke (Dank), Debatte (Abwinken, Kandidat) |

**`Rig_Medium_Special.glb`** · Medium · 11 Clips + 4 Standbild(er) · nachladen

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EXPERIMENTAL_Medium_Transform | 1,00 | nein | Ganzkörper (19) | 0,08 | einmal | – | – | – | – · *nicht einsetzen* |
| Skeletons_Awaken_Floor | 2,30 | nein | Ganzkörper (22) | 0,58 | einmal ohne Rückkehr | Gameplay | lock | gut | – · *nur Skelett-Figuren; Root-Versatz* |
| Skeletons_Awaken_Floor_Long | 3,83 | nein | Ganzkörper (22) | 0,58 | einmal ohne Rückkehr | Gameplay | lock | gut | – · *nur Skelett-Figuren; Root-Versatz* |
| Skeletons_Awaken_Standing | 1,00 | nein | Ganzkörper (19) | 1,61 | einmal ohne Rückkehr | Gameplay | lock | gut | – · *nur Skelett-Figuren; Root-Versatz* |
| Skeletons_Death | 2,00 | nein | Ganzkörper (21) | 3,61 | einmal ohne Rückkehr | Gameplay | lock | gut | – · *nur Skelett-Figuren; Root-Versatz* |
| Skeletons_Death_Pose | 0 | – | Pose | – | Standbild | – | – | – | – |
| Skeletons_Death_Resurrect | 2,70 | nein | Ganzkörper (21) | 3,61 | einmal ohne Rückkehr | Gameplay | lock | gut | – · *nur Skelett-Figuren; Root-Versatz* |
| Skeletons_Idle | 4,27 | ja | Ganzkörper (15) | 0 | Zyklus | Grundzustand | float | gut | Z: Stehen · *nur Skelett-Figuren* |
| Skeletons_Inactive_Floor_Pose | 0 | – | Pose | – | Standbild | – | – | – | – |
| Skeletons_Inactive_Standing_Pose | 0 | – | Pose | – | Standbild | – | – | – | – |
| Skeletons_Spawn_Ground | 3,57 | nein | Ganzkörper (22) | 1,21 | einmal ohne Rückkehr | Gameplay | lock | gut | – · *nur Skelett-Figuren; Root-Versatz* |
| Skeletons_Taunt | 1,03 | nein | Ganzkörper (20) | 0,10 | einmal | Ausdruck | lock | gut | E: Wut (Kandidat) · M: Debatte (taunt, Motion Matrix), Rauferei (Provokation) · *nur für KayKit_Skeletons-Figuren* |
| Skeletons_Taunt_Longer | 3,00 | nein | Ganzkörper (20) | 0,10 | einmal | Ausdruck | lock | gut | E: Wut (Kandidat) · M: Debatte (taunt, Motion Matrix), Rauferei (Provokation) · *nur für KayKit_Skeletons-Figuren* |
| Skeletons_Walking | 1,60 | ja | Ganzkörper (17) | 0 | Zyklus | Grundzustand | float | gut | Z: Gehen · *nur Skelett-Figuren* |
| T-Pose | 0 | – | Pose | – | Standbild | – | – | – | – |

**`Rig_Medium_Tools.glb`** · Medium · 28 Clips + 1 Standbild(er) · nachladen

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chop | 4,33 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lock | gut | M: Fluff (zerstören, Kandidat), Alltags-Register (§1d) · *Prop-Pflicht: Werkzeug in handslot* |
| Chopping | 1,33 | ja | Ganzkörper (17) | 0 | Zyklus | Gameplay | lock | gut | M: Fluff (zerstören, Kandidat), Alltags-Register (§1d) |
| Dig | 4,67 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lock | gut | M: Fluff (ernten am Boden, Kandidat), Alltags-Register (§1d) · *Prop-Pflicht: Werkzeug in handslot* |
| Digging | 1,40 | ja | Ganzkörper (16) | 0 | Zyklus | Gameplay | lock | gut | M: Fluff (ernten am Boden, Kandidat), Alltags-Register (§1d) |
| Fishing_Bite | 2,23 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lock | gut | M: Brick-Fish (Fisch beschaffen, Idee WSO), Alltags-Register (§1d) |
| Fishing_Cast | 1,93 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lock | gut | M: Brick-Fish (Fisch beschaffen, Idee WSO), Alltags-Register (§1d) |
| Fishing_Catch | 3,23 | ja | Ganzkörper (16) | 0 | einmal | Gameplay | lock | gut | E: Freude · M: Brick-Fish (Fisch beschaffen, Idee WSO), Alltags-Register (§1d) |
| Fishing_Idle | 2,33 | ja | Ganzkörper (8) | 0 | Zyklus | Gameplay | lock | gut | M: Brick-Fish (Fisch beschaffen, Idee WSO), Alltags-Register (§1d) |
| Fishing_Reeling | 1,60 | ja | Ganzkörper (15) | 0 | Zyklus | Gameplay | lock | gut | M: Brick-Fish (Fisch beschaffen, Idee WSO), Alltags-Register (§1d) |
| Fishing_Struggling | 3,43 | ja | Ganzkörper (17) | 0 | Zyklus | Gameplay | lock | gut | M: Brick-Fish (Fisch beschaffen, Idee WSO), Alltags-Register (§1d) |
| Fishing_Tug | 1,90 | ja | nur Oberkörper (8) | 0 | einmal | Gameplay | lock | gut | M: Brick-Fish (Fisch beschaffen, Idee WSO), Alltags-Register (§1d) |
| Hammer | 4,33 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lock | gut | M: Fluff (formen, Kandidat), Alltags-Register (§1d) · *Prop-Pflicht: Werkzeug in handslot* |
| Hammering | 2,67 | ja | nur Oberkörper (9) | 0 | Zyklus | Gameplay | lock | gut | M: Fluff (formen, Kandidat), Alltags-Register (§1d) |
| Holding_A | 1,00 | ja | Ganzkörper (13) | 0 | Zyklus | Gameplay | lock | mittel | M: Geschenke (tragen), Lesen (Buch halten, Variante ungeprüft) · *welche Variante zu Buch/Geschenk passt: Sichtprüfung nötig* |
| Holding_B | 1,00 | ja | Ganzkörper (11) | 0 | Zyklus | Gameplay | lock | mittel | M: Geschenke (tragen), Lesen (Variante ungeprüft) |
| Holding_C | 1,00 | ja | Ganzkörper (10) | 0 | Zyklus | Gameplay | lock | mittel | M: Geschenke (tragen), Lesen (Variante ungeprüft) |
| Lockpick | 3,00 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lock | schlecht | – |
| Lockpicking | 2,33 | ja | nur Oberkörper (9) | 0 | Zyklus | Gameplay | lock | schlecht | – · *nur Oberkörper* |
| Pickaxe | 6,03 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lock | gut | M: Alltags-Register (§1d) · *Prop-Pflicht: Werkzeug in handslot* |
| Pickaxing | 3,73 | ja | Ganzkörper (14) | 0 | Zyklus | Gameplay | lock | gut | M: Alltags-Register (§1d) |
| Saw | 2,40 | ja | Ganzkörper (16) | 0 | einmal | Gameplay | lock | gut | M: Alltags-Register (§1d) · *Prop-Pflicht: Werkzeug in handslot* |
| Sawing | 0,67 | ja | Ganzkörper (16) | 0 | Zyklus | Gameplay | lock | gut | M: Alltags-Register (§1d) |
| T-Pose | 0 | – | Pose | – | Standbild | – | – | – | – |
| Work_A | 2,53 | ja | Ganzkörper (15) | 0 | einmal | Gameplay | lock | mittel | M: Fluff (formen, Kandidat), Alltags-Register (§1d) |
| Work_B | 3,10 | ja | nur Oberkörper (11) | 0 | einmal | Gameplay | lock | mittel | M: Fluff (formen, Kandidat), Alltags-Register (§1d) |
| Work_C | 3,67 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lock | mittel | M: Fluff (formen, Kandidat), Alltags-Register (§1d) |
| Working_A | 1,50 | ja | Ganzkörper (15) | 0 | Zyklus | Gameplay | lock | mittel | M: Fluff (formen, Kandidat), Alltags-Register (§1d) |
| Working_B | 2,53 | ja | nur Oberkörper (11) | 0 | Zyklus | Gameplay | lock | mittel | M: Fluff (formen, Kandidat), Alltags-Register (§1d) |
| Working_C | 2,00 | ja | Ganzkörper (13) | 0 | Zyklus | Gameplay | lock | mittel | M: Fluff (formen, Kandidat), Alltags-Register (§1d) |

**`Rig_Large_CombatMelee.glb`** · Large · 15 Clips + 1 Standbild(er) · nachladen

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Melee_1H_Slash | 1,57 | ja | Ganzkörper (19) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_1H_Stab | 1,40 | ja | Ganzkörper (19) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_2H_Attack | 1,33 | ja | Ganzkörper (18) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_2H_Idle | 1,57 | ja | Ganzkörper (13) | 0 | Zyklus | Grundzustand | lead | gut | M: Kampf §4 |
| Melee_2H_Slam | 2,83 | ja | Ganzkörper (20) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_Block | 1,07 | nein | Ganzkörper (18) | 0,09 | einmal | Gameplay | lock | mittel | M: Rauferei (abwehren), Kampf §4 · *Endpose ≠ Startpose (Übergang in Blocking)* |
| Melee_Block_Attack | 1,03 | ja | Ganzkörper (16) | 0 | einmal | Gameplay | lock | mittel | M: Rauferei (abwehren), Kampf §4 |
| Melee_Block_Hit | 0,67 | ja | Ganzkörper (18) | 0 | einmal | Gameplay | lock | mittel | M: Rauferei (abwehren), Kampf §4 |
| Melee_Blocking | 1,07 | ja | Ganzkörper (11) | 0 | Zyklus | Gameplay | lock | mittel | M: Rauferei (abwehren), Kampf §4 |
| Melee_Dualwield_Slash | 1,03 | ja | Ganzkörper (20) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_Dualwield_SlashCombo | 1,60 | ja | Ganzkörper (20) | 0 | einmal | Gameplay | lead | gut | M: Kampf §4 · *Waffen-Prop in handslot* |
| Melee_Unarmed_Idle | 1,07 | ja | Ganzkörper (16) | 0 | Zyklus | Grundzustand | lead | gut | E: Wut (Kampfhaltung, Kandidat) · M: Rauferei (Haltung) |
| Melee_Unarmed_Kick | 1,70 | ja | Ganzkörper (19) | 0 | einmal | Gameplay | lead | gut | M: Rauferei · *cartoonig ohne Schaden: Abgrenzung §4 offen* |
| Melee_Unarmed_Punch | 1,23 | ja | Ganzkörper (17) | 0 | einmal | Gameplay | lead | gut | M: Rauferei · *cartoonig ohne Schaden: Abgrenzung §4 offen* |
| Melee_Unarmed_Smash | 3,47 | ja | Ganzkörper (20) | 0 | einmal | Gameplay | lead | gut | M: Rauferei · *cartoonig ohne Schaden: Abgrenzung §4 offen* |
| T-Pose | 0 | – | Pose | – | Standbild | – | – | – | – |

**`Rig_Large_General.glb`** · Large · 4 Clips + 2 Standbild(er) · Lab

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Death_A | 1,67 | nein | Ganzkörper (19) | 0,77 | einmal ohne Rückkehr (Endpose = Death_A_Pose) | Physik | lock | gut | M: Rauferei (Cartoon-KO) · *Root wandert, liegt am Ende* |
| Death_A_Pose | 0 | – | Pose | – | Standbild | – | – | – | – |
| Hit_A | 0,70 | nein | Ganzkörper (17) | 0 | einmal | Physik | lag | mittel | E: Schreck (leicht) · M: Rauferei, Brick-Fish (Treffer), Debatte (recoil) · *Large: Endpose ≠ Startpose (19°)* |
| Idle_A | 1,97 | ja | Ganzkörper (14) | 0 | Zyklus | Grundzustand | float | gut | **MVP 2** · Z: Stehen · E: neutral · SK: idle_breathe (Basis, Mikro prozedural) |
| Idle_B | 6,00 | ja | Ganzkörper (17) | 0 | Zyklus | Grundzustand | float | gut | Z: Stehen · E: neutral · SK: idle_breathe (Variante) · *Large: 6,0 s* |
| T-Pose | 0 | – | Pose | – | Standbild | – | – | – | – |

**`Rig_Large_MovementAdvanced.glb`** · Large · 4 Clips + 1 Standbild(er) · nachladen

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dodge_Backwards | 0,33 | nein | Ganzkörper (20) | 1,86 | einmal mit Versatz | Physik | lead | mittel | M: Rauferei (ausweichen), Brick-Fish (ausweichen) · *Root-Versatz 0,9–2,4 Hüfthöhen: erkennen, nie still anwenden (§5)* |
| Dodge_Forward | 0,33 | nein | Ganzkörper (17) | 0,86 | einmal mit Versatz | Physik | lead | mittel | M: Rauferei (ausweichen), Brick-Fish (ausweichen) · *Root-Versatz 0,9–2,4 Hüfthöhen: erkennen, nie still anwenden (§5)* |
| Dodge_Left | 0,33 | nein | Ganzkörper (17) | 1,04 | einmal mit Versatz | Physik | lead | gut | M: Rauferei (ausweichen), Brick-Fish (ausweichen) · *Root-Versatz 0,9–2,4 Hüfthöhen: erkennen, nie still anwenden (§5)* |
| Dodge_Right | 0,33 | nein | Ganzkörper (17) | 1,04 | einmal mit Versatz | Physik | lead | gut | M: Rauferei (ausweichen), Brick-Fish (ausweichen) · *Root-Versatz 0,9–2,4 Hüfthöhen: erkennen, nie still anwenden (§5)* |
| T-Pose | 0 | – | Pose | – | Standbild | – | – | – | – |

**`Rig_Large_MovementBasic.glb`** · Large · 2 Clips + 1 Standbild(er) · Lab

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Running_A | 1,07 | ja | Ganzkörper (18) | 0 | Zyklus | Grundzustand | float | gut | Z: Joggen · *[V-020] PASS* |
| T-Pose | 0 | – | Pose | – | Standbild | – | – | – | – |
| Walking_A | 1,07 | ja | Ganzkörper (18) | 0 | Zyklus | Grundzustand | float | gut | **MVP 20** · Z: Gehen · *gem. gait_v157: 1,052 lab/s* |

**`Rig_Large_Simulation.glb`** · Large · 1 Clips + 1 Standbild(er) · Lab

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Flexing | 4,30 | ja | Ganzkörper (16) | 0 | Zyklus | Ausdruck | lock | gut | E: Freude (Large-Ersatz) · M: Kayfabulieren (Angeben, Kandidat) · *nur Large* |
| T-Pose | 0 | – | Pose | – | Standbild | – | – | – | – |

**`Rig_Large_Special.glb`** · Large · 1 Clips + 1 Standbild(er) · nachladen

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EXPERIMENTAL_Large_Transform | 1,67 | nein | Ganzkörper (18) | 0,16 | einmal | – | – | – | – · *nicht einsetzen* |
| T-Pose | 0 | – | Pose | – | Standbild | – | – | – | – |

### 2b · KFB Motion Library 01 (Mixamo-Retarget auf KayKit-Rigs)

Beide GLBs tragen dieselben 33 Clips mit denselben Dauern; die Tabelle zeigt Rig_Medium, Rig_Large misst identisch (Versatz in Hüfthöhen gleich, in Metern ×2,56). Loop-Flags und Root-Motion stimmen mit `RETURN.md` überein.

**`KFB_Motion_Library_Rig_Medium.glb`** · Medium · 33 Clips + 0 Standbild(er) · nachladen

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kfb_action_fireball_a | 3,40 | ja | Ganzkörper (15) | 0 | Zyklus | Gameplay | lead | gut | M: Brick-Fish (großer Wurf, Kandidat), Kayfabulieren (Geste „große Behauptung“, Idee WSO) |
| kfb_climb_to_top_a | 4,03 | nein | Ganzkörper (15) | 1,84 | einmal ohne Rückkehr | Gameplay | lock | mittel | – · *Start/Endpose 290° auseinander (Bestand RETURN)* |
| kfb_climb_up_a | 3,00 | nein | Ganzkörper (15) | 0,72 | Zyklus mit Versatz (steigt 0,79 m/Zyklus Medium) | Gameplay | lock | mittel | – · *kein §2b-Zustand; Treppe braucht keinen Clip [V-160]* |
| kfb_climb_up_b | 1,60 | nein | Ganzkörper (15) | 0,37 | Zyklus mit Versatz | Gameplay | lock | mittel | – |
| kfb_dance_chicken_a | 4,80 | ja | Ganzkörper (15) | 0 | Zyklus | Ausdruck | float | gut | **MVP 19** · E: Freude · M: Tanz (Solo; Paar/Gruppe offen §3f) · *kurz, 4,8 s: MVP-Kandidat Solo-Tanz* |
| kfb_dance_hip_hop_a | 13,67 | ja | Ganzkörper (15) | 0 | Zyklus | Ausdruck | float | gut | E: Freude · M: Tanz (Solo; Paar/Gruppe offen §3f) |
| kfb_dance_house_a | 19,83 | ja | Ganzkörper (15) | 0 | Zyklus | Ausdruck | float | gut | E: Freude · M: Tanz (Solo; Paar/Gruppe offen §3f) |
| kfb_dance_house_b | 19,83 | ja | Ganzkörper (15) | 0 | Zyklus | Ausdruck | float | gut | E: Freude · M: Tanz (Solo; Paar/Gruppe offen §3f) |
| kfb_dance_locking_hip_hop_a | 17,03 | nein | Ganzkörper (15) | 1,03 | Zyklus mit Versatz | Ausdruck | float | gut | E: Freude · M: Tanz (Solo; Paar/Gruppe offen §3f) · *Versatz 1,0 Hüfthöhe* |
| kfb_dance_samba_a | 23,90 | ja | Ganzkörper (15) | 0 | Zyklus | Ausdruck | float | gut | E: Freude · M: Tanz (Solo; Paar/Gruppe offen §3f) |
| kfb_dance_slide_hip_hop_a | 17,33 | ja | Ganzkörper (15) | 0 | Zyklus | Ausdruck | float | gut | E: Freude · M: Tanz (Solo; Paar/Gruppe offen §3f) |
| kfb_dance_step_hip_hop_a | 7,83 | nein | Ganzkörper (15) | 4,56 | Zyklus mit Versatz | Ausdruck | float | gut | E: Freude · M: Tanz (Solo; Paar/Gruppe offen §3f) · *Versatz 4,6 Hüfthöhen* |
| kfb_dance_thriller_part3_a | 25,60 | nein | Ganzkörper (15) | 6,44 | einmal ohne Rückkehr | Ausdruck | float | gut | E: Freude · M: Tanz (Solo; Paar/Gruppe offen §3f) · *kein Loop, Versatz 6,4 Hüfthöhen* |
| kfb_dance_wave_hip_hop_a | 16,87 | ja | Ganzkörper (15) | 0 | Zyklus | Ausdruck | float | gut | E: Freude · M: Tanz (Solo; Paar/Gruppe offen §3f) |
| kfb_idle_breathing_a | 9,97 | ja | Ganzkörper (15) | 0 | Zyklus | Grundzustand | float | gut | **MVP 17** · Z: Stehen · E: neutral · SK: idle_breathe (lang, Bestand best) |
| kfb_idle_breathing_b | 9,97 | ja | Ganzkörper (15) | 0 | Zyklus | Grundzustand | float | gut | Z: Stehen · E: neutral · SK: idle_breathe (Variante) |
| kfb_idle_defeat_a | 1,77 | ja | Ganzkörper (15) | 0 | Zyklus | Ausdruck | lock | gut | E: Trauer · M: Rauferei (verloren), Debatte (verloren) |
| kfb_idle_happy_a | 2,97 | ja | Ganzkörper (15) | 0 | Zyklus | Ausdruck | float | gut | **MVP 18** · E: Freude · M: Geschenke (annehmen), Debatte (gewonnen), Tanz (Einstieg) · *Bestand Card-Szene: Stand-in fürs Sprechen* |
| kfb_idle_injured_a | 9,37 | ja | Ganzkörper (15) | 0 | Zyklus | Ausdruck | lag | mittel | E: Müde / benommen (Kandidat) · M: Rauferei (danach) |
| kfb_idle_kneeling_a | 4,30 | ja | nur Oberkörper (4) | 0 | Zyklus | Grundzustand | lock | mittel | M: Geschenke (kniend überreichen, Idee WSO) · *nur Oberkörper animiert, Beine statisch* |
| kfb_idle_laughing_a | 10,40 | ja | Ganzkörper (15) | 0 | Zyklus | Ausdruck | float | gut | E: Freude · M: Debatte (BLÖDSINN-Reaktion), Kayfabulieren (Publikum) |
| kfb_idle_ninja_a | 3,37 | ja | nur Beine (6) | 0 | Zyklus | Grundzustand | lead | gut | M: Rauferei (Haltung, Kandidat) · *gem.: nur Beine über Schwelle, Oberkörper fast statisch* |
| kfb_idle_orc_a | 5,37 | ja | Ganzkörper (14) | 0 | Zyklus | Ausdruck | lock | gut | E: Wut (Haltung, Kandidat, ungeprüft) · M: Rauferei (Haltung) |
| kfb_idle_rejected_a | 4,83 | ja | Ganzkörper (15) | 0 | Zyklus | Ausdruck | lag | mittel | E: Sorge (Kandidat), Trauer · M: Geschenke (abgelehnt werden), Debatte (verloren) |
| kfb_idle_sad_a | 2,83 | ja | Ganzkörper (15) | 0 | Zyklus | Ausdruck | lag | mittel | E: Trauer · M: Geschenke (abgelehnt), Debatte (verloren) · *Reserve-Rang 21* |
| kfb_locomotion_run_backward_a | 0,63 | nein | Ganzkörper (15) | 1,97 | Zyklus mit Versatz | Grundzustand | float | mittel | Z: Joggen (rückwärts) · M: Rauferei (Rückzug) · *Root-Motion gebacken* |
| kfb_locomotion_run_forward_a | 0,77 | nein | Ganzkörper (15) | 3,85 | Zyklus mit Versatz | Grundzustand | float | gut | Z: Joggen (Variante) · *Root-Motion gebacken 3,85 Hüfthöhen/Zyklus* |
| kfb_locomotion_sad_walk_a | 1,50 | nein | Ganzkörper (15) | 1,98 | Zyklus mit Versatz | Ausdruck | lag | gut | Z: Gehen (Ausdrucks-Variante) · E: Trauer · M: Geschenke (abgelehnt, weggehen) · *Root-Motion gebacken* |
| kfb_locomotion_walk_backward_a | 1,27 | nein | Ganzkörper (15) | 1,69 | Zyklus mit Versatz | Grundzustand | float | mittel | Z: Gehen (rückwärts) · M: Debatte (Rückzug) · *Root-Motion gebacken* |
| kfb_music_drums_a | 4,73 | ja | Ganzkörper (15) | 0 | Zyklus | Gameplay | lock | mittel | M: Tanz (Begleitung), Alltags-Register (§1d) · *ohne Instrument-Prop* |
| kfb_music_guitar_a | 4,80 | ja | Ganzkörper (13) | 0 | Zyklus | Gameplay | float | gut | M: Tanz (Begleitung), Alltags-Register (§1d) · *ohne Instrument-Prop* |
| kfb_music_guitar_b | 4,80 | ja | Ganzkörper (13) | 0 | Zyklus | Gameplay | float | gut | M: Tanz (Begleitung) |
| kfb_music_guitar_c | 8,33 | ja | Ganzkörper (15) | 0 | Zyklus | Gameplay | float | gut | M: Tanz (Begleitung) |

### 2c · KFB Motion interaction i06 (nur Lab)

**`KFB_Motion_interaction_i06.glb`** · Medium · 6 Clips + 0 Standbild(er) · Lab

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kfb_interaction_cards_a | 12,53 | ja | Ganzkörper (15) | 0 | Zyklus | Gameplay | lock | mittel | M: Kayfabulieren (Karten, Kandidat), Debatte (Karte als Argument), Lesen (Karte lesen) |
| kfb_interaction_cards_b | 9,03 | ja | Ganzkörper (15) | 0 | Zyklus | Gameplay | lock | mittel | M: Kayfabulieren (Karten, Kandidat), Debatte |
| kfb_interaction_driving_a | 5,03 | ja | Ganzkörper (10) | 0 | Zyklus | Grundzustand | lead | gut | Z: Fahren (Cabrio), Beifahrer (Sitzpose-Kandidat, ungeprüft) · *Lenkbewegung; als Beifahrer ohne Lenken maskieren* |
| kfb_interaction_entering_car_a | 5,50 | nein | Ganzkörper (15) | 3,20 | einmal ohne Rückkehr | Gameplay | lock | gut | Z: Einsteigen (Cabrio) · *Root-Versatz 3,2 Hüfthöhen* |
| kfb_interaction_exiting_car_a | 5,83 | nein | Ganzkörper (15) | 3,38 | einmal ohne Rückkehr | Gameplay | lock | gut | Z: Aussteigen (Cabrio) · *Root-Versatz 3,4 Hüfthöhen* |
| kfb_interaction_writing_a | 5,03 | ja | nur Oberkörper (7) | 0 | Zyklus | Gameplay | lock | schlecht | M: Lesen (Schreiben am Pult) · *nur Oberkörper; Tisch-Prop nötig* |

### 2d · Quaternius-Figur „Animated Base Character“ (UAL-Clips, fremdes Rig)

Clipnamen im GLB tragen das Präfix `Rig|` (z. B. `Rig|Idle_Loop`); hier ohne Präfix. Rig = Rigify (`DEF-hips`, `DEF-spine.001…003`, `DEF-neck`, `DEF-head`, Arme mit Fingern, `DEF-thigh/shin/foot/toe`), nicht die 23 KayKit-Knochen: kein Clip bindet direkt an KayKit-Figuren.

**`Animated Base Character by Quaternius - cwYvO5UauX.glb`** · Quaternius-Rigify · 45 Clips + 0 Standbild(er) · nachladen

| Clip | s | R | Körper | V | Schleife | Ebene | Augen | Kamera | Zuordnung (§2b / §3b / Survival / §3f) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Crouch_Fwd_Loop | 2,00 | ja | Ganzkörper (16) | 0 | Zyklus | Grundzustand | float | gut | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Crouch_Idle_Loop | 2,92 | ja | Ganzkörper (39) | 0 | Zyklus | Grundzustand | float | gut | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Dance_Loop | 1,00 | ja | Ganzkörper (19) | 0 | Zyklus | Ausdruck | float | gut | E: Freude · M: Tanz · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Death01 | 2,38 | nein | Ganzkörper (50) | 2,91 | einmal ohne Rückkehr | Physik | lock | gut | M: Rauferei (Cartoon-KO) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Driving_Loop | 1,67 | ja | nur Oberkörper (3) | 0 | Zyklus | Grundzustand | lead | gut | Z: Fahren (Cabrio), Beifahrer (Kandidat) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Fixing_Kneeling | 5,17 | ja | Ganzkörper (50) | 0 | Zyklus | Gameplay | lock | mittel | M: Fluff (formen, Kandidat), Alltags-Register (§1d) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Hit_Chest | 0,33 | nein | Ganzkörper (45) | 0,07 | einmal | Physik | lag | mittel | E: Schreck · M: Rauferei, Brick-Fish (Treffer) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Hit_Head | 0,42 | nein | Ganzkörper (43) | 0 | einmal | Physik | lag | mittel | E: Schreck · M: Brick-Fish (Treffer am Kopf), Rauferei · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Idle_Loop | 2,50 | ja | Ganzkörper (14) | 0 | Zyklus | Grundzustand | float | gut | Z: Stehen · E: neutral · SK: idle_breathe · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Idle_Talking_Loop | 2,92 | ja | Ganzkörper (39) | 0 | Zyklus | Ausdruck | lead | gut | M: Debatte (Sprecher), Kayfabulieren (Erzähler) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Idle_Torch_Loop | 1,25 | ja | Ganzkörper (17) | 0 | Zyklus | Grundzustand | float | gut | Z: Stehen (Variante) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Interact | 2,00 | ja | Ganzkörper (18) | 0 | einmal | Gameplay | lock | mittel | M: Geschenke (Kandidat) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Jog_Fwd_Loop | 0,92 | nein | Ganzkörper (19) | 0,08 | Zyklus | Grundzustand | float | gut | Z: Joggen · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Jump_Land | 1,25 | nein | Ganzkörper (49) | 0,21 | einmal | Physik | lag | gut | Z: Sprung im Stand (Landung) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Jump_Loop | 2,50 | ja | Ganzkörper (13) | 0 | Halten | Grundzustand | lock | gut | Z: Sprung im Stand (Luft), Flug (Stand-in) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Jump_Start | 1,33 | nein | Ganzkörper (47) | 1,24 | einmal | Grundzustand | lag | gut | Z: Sprung im Stand (Start) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| PickUp_Table | 0,83 | ja | Ganzkörper (29) | 0 | einmal | Gameplay | lock | mittel | M: Geschenke (annehmen vom Tisch), Lesen (Buch nehmen) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Pistol_Aim_Down | 0,17 | ja | keine (0) | 0 | einmal | Gameplay | lock | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Pistol_Aim_Neutral | 0,17 | ja | keine (0) | 0 | einmal | Gameplay | lock | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Pistol_Aim_Up | 0,17 | ja | keine (0) | 0 | einmal | Gameplay | lock | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Pistol_Idle_Loop | 1,67 | ja | nur Oberkörper (9) | 0 | Zyklus | Gameplay | lock | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Pistol_Reload | 1,67 | ja | Ganzkörper (29) | 0 | einmal | Gameplay | lock | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Pistol_Shoot | 0,62 | ja | nur Oberkörper (8) | 0 | einmal | Gameplay | lock | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Punch_Cross | 1,00 | ja | Ganzkörper (18) | 0 | einmal | Gameplay | lead | gut | M: Rauferei · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Punch_Enter | 0,83 | nein | Ganzkörper (17) | 0,19 | einmal | Gameplay | lead | gut | E: Wut (Kandidat) · M: Rauferei · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Punch_Jab | 0,83 | ja | Ganzkörper (16) | 0 | einmal | Gameplay | lead | gut | M: Rauferei · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Push_Loop | 2,67 | ja | Ganzkörper (16) | 0 | Zyklus | Gameplay | lock | gut | M: Fluff (formen/rollen, Kandidat) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Roll | 1,46 | nein | Ganzkörper (49) | 1,31 | einmal mit Versatz | Physik | lock | gut | M: Rauferei (Wipeout) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Roll_RM | 1,46 | nein | Ganzkörper (50) | 1,31 | einmal mit Versatz | Physik | lock | gut | M: Rauferei (Wipeout) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Sitting_Enter | 1,29 | nein | Ganzkörper (48) | 1,20 | einmal | Grundzustand | float | mittel | Z: Sitzen (NPC) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Sitting_Exit | 1,00 | nein | Ganzkörper (48) | 1,20 | einmal | Grundzustand | lead | mittel | Z: Sitzen (NPC) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Sitting_Idle_Loop | 1,67 | ja | nur Oberkörper (11) | 0 | Zyklus | Grundzustand | float | mittel | Z: Sitzen (NPC) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Sitting_Talking_Loop | 2,92 | ja | Ganzkörper (37) | 0 | Zyklus | Ausdruck | lead | mittel | Z: Sitzen (NPC) · M: Debatte (Sprecher sitzend), Lesen (vorlesen, Kandidat) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Spell_Simple_Enter | 0,50 | nein | Ganzkörper (47) | 0,09 | einmal | Gameplay | lock | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Spell_Simple_Exit | 0,42 | nein | Ganzkörper (47) | 0,09 | einmal | Gameplay | lock | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Spell_Simple_Idle_Loop | 2,08 | ja | Ganzkörper (14) | 0 | Zyklus | Gameplay | lock | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Spell_Simple_Shoot | 0,50 | ja | Ganzkörper (36) | 0 | einmal | Gameplay | lock | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Sprint_Loop | 0,67 | ja | Ganzkörper (19) | 0 | Zyklus | Grundzustand | float | gut | Z: Sprint · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Swim_Fwd_Loop | 1,33 | ja | Ganzkörper (19) | 0 | Zyklus | Grundzustand | float | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Swim_Idle_Loop | 3,33 | ja | Ganzkörper (40) | 0 | Zyklus | Grundzustand | float | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Sword_Attack | 1,50 | ja | Ganzkörper (21) | 0 | einmal | Gameplay | lock | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Sword_Attack_RM | 1,50 | nein | Ganzkörper (22) | 0 | einmal | Gameplay | lock | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Sword_Idle | 1,67 | ja | Ganzkörper (26) | 0 | einmal | Gameplay | lock | mittel | – · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Walk_Formal_Loop | 1,33 | ja | Ganzkörper (19) | 0 | Zyklus | Grundzustand | float | gut | Z: Gehen (Variante) · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |
| Walk_Loop | 1,33 | ja | Ganzkörper (21) | 0 | Zyklus | Grundzustand | float | gut | Z: Gehen · *fremdes Rig (Rigify), Retargeting nötig, keine 1:1-Nutzung* |

## 3 · Zuordnung rückwärts: Zustand, Emotion, Survival Kit, Mechanik → Clips (Vorschlag)

### 3a · Zustände §2b

| Ziel | Clips (Rig, Quelle) |
| --- | --- |
| Stehen | Idle_A (L), Idle_B (L), Idle_A (M), Idle_B (M), Skeletons_Idle (M), kfb_idle_breathing_a (M+L, KFBML), kfb_idle_breathing_b (M+L, KFBML), Idle_Loop (Q, Quat), Idle_Torch_Loop (Q, Quat) |
| Joggen | Running_A (L), Running_A (M), kfb_locomotion_run_backward_a (M+L, KFBML), kfb_locomotion_run_forward_a (M+L, KFBML), Jog_Fwd_Loop (Q, Quat) |
| Gehen | Walking_A (L), Walking_Backwards (M), Walking_A (M), Walking_B (M), Walking_C (M), Skeletons_Walking (M), kfb_locomotion_sad_walk_a (M+L, KFBML), kfb_locomotion_walk_backward_a (M+L, KFBML), Walk_Formal_Loop (Q, Quat), Walk_Loop (Q, Quat) |
| Weitsprung | Jump_Full_Long (M) |
| Sprung aus Joggen | Jump_Full_Short (M) |
| Sprung im Stand | Jump_Idle (M), Jump_Land (M), Jump_Start (M), Jump_Land (Q, Quat), Jump_Loop (Q, Quat), Jump_Start (Q, Quat) |
| Flug | Jump_Idle (M), Jump_Loop (Q, Quat) |
| Sprint | Running_B (M), Sprint_Loop (Q, Quat) |
| Sitzen | Sit_Chair_Down (M), Sit_Chair_Idle (M), Sit_Chair_StandUp (M), Sit_Floor_Down (M), Sit_Floor_Idle (M), Sit_Floor_StandUp (M), Sitting_Enter (Q, Quat), Sitting_Exit (Q, Quat), Sitting_Idle_Loop (Q, Quat), Sitting_Talking_Loop (Q, Quat) |
| Fahren | kfb_interaction_driving_a (M, i06), Driving_Loop (Q, Quat) |
| Beifahrer | kfb_interaction_driving_a (M, i06), Driving_Loop (Q, Quat) |
| Einsteigen | kfb_interaction_entering_car_a (M, i06) |
| Aussteigen | kfb_interaction_exiting_car_a (M, i06) |

### 3b · Emotionen §3b

| Ziel | Clips (Rig, Quelle) |
| --- | --- |
| Wut | Melee_Unarmed_Idle (L), Melee_Unarmed_Idle (M), Skeletons_Taunt (M), Skeletons_Taunt_Longer (M), kfb_idle_orc_a (M+L, KFBML), Punch_Enter (Q, Quat) |
| Schreck | Hit_A (L), Hit_A (M), Hit_B (M), Hit_Chest (Q, Quat), Hit_Head (Q, Quat) |
| neutral | Idle_A (L), Idle_B (L), Idle_A (M), Idle_B (M), Sit_Chair_Idle (M), Sit_Floor_Idle (M), kfb_idle_breathing_a (M+L, KFBML), kfb_idle_breathing_b (M+L, KFBML), Idle_Loop (Q, Quat) |
| Freude | Flexing (L), Cheering (M), Waving (M), Fishing_Catch (M), kfb_dance_chicken_a (M+L, KFBML), kfb_dance_hip_hop_a (M+L, KFBML), kfb_dance_house_a (M+L, KFBML), kfb_dance_house_b (M+L, KFBML), kfb_dance_locking_hip_hop_a (M+L, KFBML), kfb_dance_samba_a (M+L, KFBML), kfb_dance_slide_hip_hop_a (M+L, KFBML), kfb_dance_step_hip_hop_a (M+L, KFBML), kfb_dance_thriller_part3_a (M+L, KFBML), kfb_dance_wave_hip_hop_a (M+L, KFBML), kfb_idle_happy_a (M+L, KFBML), kfb_idle_laughing_a (M+L, KFBML), Dance_Loop (Q, Quat) |
| Müde | Lie_Down (M), Lie_Idle (M) |
| Trauer | kfb_idle_defeat_a (M+L, KFBML), kfb_idle_rejected_a (M+L, KFBML), kfb_idle_sad_a (M+L, KFBML), kfb_locomotion_sad_walk_a (M+L, KFBML) |
| Müde / benommen | kfb_idle_injured_a (M+L, KFBML) |
| Sorge | kfb_idle_rejected_a (M+L, KFBML) |

### 3c · Survival Kit MVP 1 (§1d)

| Ziel | Clips (Rig, Quelle) |
| --- | --- |
| idle_breathe | Idle_A (L), Idle_B (L), Idle_A (M), Idle_B (M), Sit_Chair_Idle (M), kfb_idle_breathing_a (M+L, KFBML), kfb_idle_breathing_b (M+L, KFBML), Idle_Loop (Q, Quat) |
| hop | Jump_Full_Short (M), Jump_Land (M), Jump_Start (M) |

### 3d · Kulturmechaniken §3f (und Kampf §4, Alltags-Register §1d)

| Ziel | Clips (Rig, Quelle) |
| --- | --- |
| Kampf §4 | Melee_1H_Slash (L), Melee_1H_Stab (L), Melee_2H_Attack (L), Melee_2H_Idle (L), Melee_2H_Slam (L), Melee_Block (L), Melee_Block_Attack (L), Melee_Block_Hit (L), Melee_Blocking (L), Melee_Dualwield_Slash (L), Melee_Dualwield_SlashCombo (L), Melee_1H_Attack_Chop (M), Melee_1H_Attack_Jump_Chop (M), Melee_1H_Attack_Slice_Diagonal (M), Melee_1H_Attack_Slice_Horizontal (M), Melee_1H_Attack_Stab (M), Melee_2H_Attack_Chop (M), Melee_2H_Attack_Slice (M), Melee_2H_Attack_Spin (M), Melee_2H_Attack_Spinning (M), Melee_2H_Attack_Stab (M), Melee_2H_Idle (M), Melee_Block (M), Melee_Block_Attack (M), Melee_Block_Hit (M), Melee_Blocking (M), Melee_Dualwield_Attack_Chop (M), Melee_Dualwield_Attack_Slice (M), Melee_Dualwield_Attack_Stab (M), Ranged_1H_Aiming (M), Ranged_1H_Reload (M), Ranged_1H_Shoot (M), Ranged_1H_Shooting (M), Ranged_2H_Aiming (M), Ranged_2H_Reload (M), Ranged_2H_Shoot (M), Ranged_2H_Shooting (M), Ranged_Bow_Aiming_Idle (M), Ranged_Bow_Draw (M), Ranged_Bow_Draw_Up (M), Ranged_Bow_Idle (M), Ranged_Bow_Release (M), Ranged_Bow_Release_Up (M), Ranged_Magic_Raise (M), Ranged_Magic_Shoot (M), Ranged_Magic_Spellcasting (M), Ranged_Magic_Spellcasting_Long (M), Ranged_Magic_Summon (M) |
| Rauferei | Melee_Block (L), Melee_Block_Attack (L), Melee_Block_Hit (L), Melee_Blocking (L), Melee_Unarmed_Idle (L), Melee_Unarmed_Kick (L), Melee_Unarmed_Punch (L), Melee_Unarmed_Smash (L), Death_A (L), Hit_A (L), Dodge_Backwards (L), Dodge_Forward (L), Dodge_Left (L), Dodge_Right (L), Melee_Block (M), Melee_Block_Attack (M), Melee_Block_Hit (M), Melee_Blocking (M), Melee_Unarmed_Attack_Kick (M), Melee_Unarmed_Attack_Punch_A (M), Melee_Unarmed_Idle (M), Death_A (M), Death_B (M), Hit_A (M), Hit_B (M), Dodge_Backward (M), Dodge_Forward (M), Dodge_Left (M), Dodge_Right (M), Skeletons_Taunt (M), Skeletons_Taunt_Longer (M), kfb_idle_defeat_a (M+L, KFBML), kfb_idle_injured_a (M+L, KFBML), kfb_idle_ninja_a (M+L, KFBML), kfb_idle_orc_a (M+L, KFBML), kfb_locomotion_run_backward_a (M+L, KFBML), Death01 (Q, Quat), Hit_Chest (Q, Quat), Hit_Head (Q, Quat), Punch_Cross (Q, Quat), Punch_Enter (Q, Quat), Punch_Jab (Q, Quat), Roll (Q, Quat), Roll_RM (Q, Quat) |
| Brick-Fish | Hit_A (L), Dodge_Backwards (L), Dodge_Forward (L), Dodge_Left (L), Dodge_Right (L), Hit_A (M), Hit_B (M), Throw (M), Dodge_Backward (M), Dodge_Forward (M), Dodge_Left (M), Dodge_Right (M), Fishing_Bite (M), Fishing_Cast (M), Fishing_Catch (M), Fishing_Idle (M), Fishing_Reeling (M), Fishing_Struggling (M), Fishing_Tug (M), kfb_action_fireball_a (M+L, KFBML), Hit_Chest (Q, Quat), Hit_Head (Q, Quat) |
| Debatte | Hit_A (L), Hit_A (M), Walking_Backwards (M), Sit_Chair_Down (M), Sit_Chair_Idle (M), Sit_Floor_Down (M), Sit_Floor_Idle (M), Waving (M), Skeletons_Taunt (M), Skeletons_Taunt_Longer (M), kfb_idle_defeat_a (M+L, KFBML), kfb_idle_happy_a (M+L, KFBML), kfb_idle_laughing_a (M+L, KFBML), kfb_idle_rejected_a (M+L, KFBML), kfb_idle_sad_a (M+L, KFBML), kfb_locomotion_walk_backward_a (M+L, KFBML), kfb_interaction_cards_a (M, i06), kfb_interaction_cards_b (M, i06), Idle_Talking_Loop (Q, Quat), Sitting_Talking_Loop (Q, Quat) |
| Kayfabulieren | Flexing (L), Ranged_Magic_Raise (M), Ranged_Magic_Shoot (M), Ranged_Magic_Spellcasting (M), Ranged_Magic_Spellcasting_Long (M), Ranged_Magic_Summon (M), Cheering (M), kfb_action_fireball_a (M+L, KFBML), kfb_idle_laughing_a (M+L, KFBML), kfb_interaction_cards_a (M, i06), kfb_interaction_cards_b (M, i06), Idle_Talking_Loop (Q, Quat) |
| Geschenke | Interact (M), PickUp (M), Throw (M), Cheering (M), Waving (M), Holding_A (M), Holding_B (M), Holding_C (M), kfb_idle_happy_a (M+L, KFBML), kfb_idle_kneeling_a (M+L, KFBML), kfb_idle_rejected_a (M+L, KFBML), kfb_idle_sad_a (M+L, KFBML), kfb_locomotion_sad_walk_a (M+L, KFBML), Interact (Q, Quat), PickUp_Table (Q, Quat) |
| Fluff | Interact (M), PickUp (M), Use_Item (M), Chop (M), Chopping (M), Dig (M), Digging (M), Hammer (M), Hammering (M), Work_A (M), Work_B (M), Work_C (M), Working_A (M), Working_B (M), Working_C (M), Fixing_Kneeling (Q, Quat), Push_Loop (Q, Quat) |
| Lesen | Interact (M), Sit_Chair_Down (M), Sit_Chair_Idle (M), Sit_Floor_Down (M), Sit_Floor_Idle (M), Holding_A (M), Holding_B (M), Holding_C (M), kfb_interaction_cards_a (M, i06), kfb_interaction_writing_a (M, i06), PickUp_Table (Q, Quat), Sitting_Talking_Loop (Q, Quat) |
| Tanz | Cheering (M), kfb_dance_chicken_a (M+L, KFBML), kfb_dance_hip_hop_a (M+L, KFBML), kfb_dance_house_a (M+L, KFBML), kfb_dance_house_b (M+L, KFBML), kfb_dance_locking_hip_hop_a (M+L, KFBML), kfb_dance_samba_a (M+L, KFBML), kfb_dance_slide_hip_hop_a (M+L, KFBML), kfb_dance_step_hip_hop_a (M+L, KFBML), kfb_dance_thriller_part3_a (M+L, KFBML), kfb_dance_wave_hip_hop_a (M+L, KFBML), kfb_idle_happy_a (M+L, KFBML), kfb_music_drums_a (M+L, KFBML), kfb_music_guitar_a (M+L, KFBML), kfb_music_guitar_b (M+L, KFBML), kfb_music_guitar_c (M+L, KFBML), Dance_Loop (Q, Quat) |
| Alltags-Register | Chop (M), Chopping (M), Dig (M), Digging (M), Fishing_Bite (M), Fishing_Cast (M), Fishing_Catch (M), Fishing_Idle (M), Fishing_Reeling (M), Fishing_Struggling (M), Fishing_Tug (M), Hammer (M), Hammering (M), Pickaxe (M), Pickaxing (M), Saw (M), Sawing (M), Work_A (M), Work_B (M), Work_C (M), Working_A (M), Working_B (M), Working_C (M), kfb_music_drums_a (M+L, KFBML), kfb_music_guitar_a (M+L, KFBML), Fixing_Kneeling (Q, Quat) |

Abkürzungen: M = Rig_Medium, L = Rig_Large, Q = Quaternius-Rigify (Retargeting nötig), KFBML = KFB Motion Library, i06 = nur Lab.

## 4 · Lücken

| Bereich | Was | Stand | Such-Protokoll |
| --- | --- | --- | --- |
| Zustand §2b | Treppe, Hang | kein eigener Clip nötig: Gang läuft weiter [V-158, V-160] | – |
| Zustand §2b | Einsteigen / Aussteigen (geschlossenes Auto, MVP) | Bestand car-hop.ts prozedural; Cabrio-Clips nur in i06 (nicht im Repo) | nicht gefunden in KayKit 1.1, KFB Motion Library |
| Zustand §2b | Beifahrer | nicht gefunden; Kandidaten: kfb_interaction_driving_a ohne Lenk-Maske (ungeprüft), Quaternius Driving_Loop (fremdes Rig) | nicht gefunden in KayKit 1.1, KFB Motion Library, i06 |
| Zustand §2b | Flug / Jetpack / Schwebe | nicht gefunden; Stand-in Jump_Idle + hoverPose prozedural (Bestand kfb-flight-vfx.js) | nicht gefunden in KayKit 1.1, KFB Motion Library, i06, Quaternius-Figur |
| Zustand §2b | Reise zwischen Inseln | Figur im Auto, kein Figurenclip nötig [V-120a] | – |
| Zustand §2b | Sprint Large, Sprung Large, Sitzen Large, Winken Large | Large hat nur Idle_A/B, Walking_A, Running_A, Hit_A, Death_A, Flexing, 4 Dodges, 15 Melee, Transform; Rest nur per Cross-Rig FIT (§5, §7 Frage 8). KFB Motion Library liefert Large zusätzlich 33 Clips (Tänze, Idles, Rückwärts) | nicht gefunden in Rig_Large_* (KayKit 1.1) |
| Emotion §3b | Wut | kein Wut-Clip; Kandidaten als Haltung: kfb_idle_orc_a, Melee_Unarmed_Idle; sonst additiv nach §3b | nicht gefunden in KayKit 1.1, KFB Motion Library, i06 |
| Emotion §3b | Skepsis | kein Clip; Doppelblick + Kopfneigung prozedural (§3b) | nicht gefunden in allen vier Quellen |
| Emotion §3b | Sorge | kein Clip; nächster Bestand kfb_idle_rejected_a | nicht gefunden in KayKit 1.1, i06, Quaternius-Figur |
| Emotion §3b | Müde / benommen | kein Clip; nächster Bestand kfb_idle_injured_a, Lie_Idle | nicht gefunden in KayKit 1.1 (außer Lie_Idle), i06 |
| Emotion §3b | Schreck | nur als Rückprall Hit_B / Hit_A (Physik), kein gehaltener Schreck-Idle | nicht gefunden in KFB Motion Library, i06 |
| Survival Kit | look_at | kein Clip; Eye-Rig v6 + setGaze (Bestand stage3d) prozedural | nicht gefunden in allen vier Quellen |
| Survival Kit | blink | kein Clip; Eye-Rig v6 (Bestand) | nicht gefunden in allen vier Quellen |
| Survival Kit | hop | kein Hop-Clip; Kandidaten Jump_Full_Short (zu lang, 1,17 s) bzw. Jump_Start→Jump_Land ohne Jump_Idle; car-hop.ts prozedural [V-031]. „Hop“ im KayKit-Legacy-Rig 1.2: im Repo nur Doku-Ordner, keine GLB | nicht gefunden in KayKit 1.1, KFB Motion Library, i06, Quaternius-Figur |
| Survival Kit | turn_90 | kein Dreh-Clip in keiner Quelle; prozedural (Augen zuerst, dann Kopf, dann Root-Yaw) | nicht gefunden in allen vier Quellen |
| Mechanik §3f | Geschenke | kein Geben/Annehmen-Clip; Teilstücke Interact, PickUp, Throw, Holding_A–C, Cheering, kfb_idle_rejected_a | nicht gefunden in allen vier Quellen |
| Mechanik §3f | Tanz (Paar, Gruppe) | Solo-Tänze: 10 in KFB Motion Library (M+L); Paar/Gruppe nicht gefunden | nicht gefunden in allen vier Quellen |
| Mechanik §3f | Debatte (Sprech-Clip) | kein Sprech-Clip auf KayKit-Rig (L6 bleibt); Quaternius Idle_Talking_Loop / Sitting_Talking_Loop nur mit Retargeting; sonst Nicken + Mund (§1d H&D) | nicht gefunden in KayKit 1.1, KFB Motion Library, i06 |
| Mechanik §3f | Rauferei | Teilstücke vorhanden: Melee_Unarmed_Punch/Kick/Idle, Melee_Block*, Hit_A/B, Dodge_*, Death_A/B, kfb_idle_defeat_a; kein Ringen/Raufen als Paar | Paar-Clip nicht gefunden in allen vier Quellen |
| Mechanik §3f | Brick-Fish | Wurf: Throw, kfb_action_fireball_a; Treffer: Hit_A/B, Quaternius Hit_Head; Fisch als Prop und Fang nicht gefunden (Fishing_* = Angeln, Idee) | Fisch-Prop nicht gefunden in allen vier Quellen |
| Mechanik §3f | Kayfabulieren | kein Clip; Kandidaten: kfb_interaction_cards_a/b (nur Lab), Ranged_Magic_Raise/Summon als Geste, kfb_idle_laughing_a als Publikum | nicht gefunden in allen vier Quellen |
| Mechanik §3f | Fluff ernten / formen / zerstören | kein eigener Clip; Kandidaten: PickUp (aufsammeln), Dig/Digging (ernten), Hammer/Work (formen), Chop (zerstören), Use_Item | nicht gefunden in allen vier Quellen |
| Mechanik §3f | Lesen | kein Lese-Clip; Kandidaten: Sit_Chair_Idle + Holding_A–C (Oberkörper-Maske), kfb_interaction_writing_a (nur Lab), Quaternius PickUp_Table | nicht gefunden in KayKit 1.1, KFB Motion Library |
| Quelle | Quaternius Universal Animation Library (eigener Ordner) | nicht gefunden im Repo-Stand main dccf75c; nur Erwähnung in skills/chat/workflows/FREE_ROAM_PLATFORMER_POC_2026-09-18/CLAUDE_DESIGN_BRIEF.md. Ersatz im Repo: Quaternius-Figur mit 45 eingebauten UAL-Clips (fremdes Rig). Zip laut Leitfaden §1b in DL, hier nicht ausgelesen | nicht gefunden in media/3D_Assets |
| Quelle | KayKit Legacy 1.2 Clips (Dance, Hop, Cheer …) | im Repo nur Doku-Ordner ohne GLB/FBX | nicht gefunden in media/3D_Assets/KayKit Legacy/KayKit Character Animations 1.2 - legacy/ |
| Quelle | KFB_Motion_interaction_i06.glb | liegt nur im Lab; im Repo nicht gefunden (J17-Ordner nennt die Clipnamen nur in JSON/JS) | nicht gefunden im Repo-Stand main dccf75c |

„Alle vier Quellen“ = KayKit 1.1 (14 GLB), KFB Motion Library (2 GLB), i06 (1 GLB), Quaternius-Figur (1 GLB). Die Mixamo-Rohdateien in `DL` und die UAL-Zip wurden nicht gelesen.

## 5 · Die 20 wichtigsten Clips fürs MVP (Vorschlag)

Reihenfolge nach Demo-Plan §6 (D1 Gang → D2 Begrüßung → D3 Reaktion → D4 Gesichter) und Survival Kit. Besetzung Gruppe A enthält `orcbrute` (Large), darum zwei Large-Clips.

| Rang | Clip | Rig | s | Lab | Wofür |
| --- | --- | --- | --- | --- | --- |
| 1 | Idle_A | Medium | 1,07 | ja | Rolle idle (Bestand locomotion-profiles) |
| 2 | Idle_A | Large | 1,97 | ja | Rolle idle (Bestand locomotion-profiles) |
| 3 | Walking_A | Medium | 1,07 | ja | Rolle walk (Bestand, Strg+W) |
| 4 | Running_A | Medium | 0,80 | ja | Rolle run (Bestand, W) |
| 5 | Running_B | Medium | 0,80 | ja | Rolle sprint, Rate 1,3 (Bestand, Shift+W) |
| 6 | Jump_Start | Medium | 0,60 | ja | Rolle jump.start (Bestand) |
| 7 | Jump_Idle | Medium | 1,07 | ja | Rolle jump.air (Bestand, Halten) |
| 8 | Jump_Land | Medium | 0,67 | ja | Rolle jump.land (Bestand, Bodenkontakt) |
| 9 | Jump_Full_Short | Medium | 1,17 | ja | Sprung aus Joggen (Bestand, Rate an Flugzeit) |
| 10 | Jump_Full_Long | Medium | 2,33 | ja | Weitsprung (Shift+Leertaste) [V-088] |
| 11 | Waving | Medium | 2,13 | ja | Vorlage 1 Begrüßen |
| 12 | Cheering | Medium | 1,67 | ja | Vorlage 3 Feiern |
| 13 | Hit_B | Medium | 0,87 | ja | Rückprall, Vorlage 4 Überrascht werden |
| 14 | Sit_Chair_Down | Medium | 0,80 | ja | NPC setzt sich (Stuhl) |
| 15 | Sit_Chair_Idle | Medium | 3,60 | ja | NPC sitzt (Stuhl) |
| 16 | Sit_Chair_StandUp | Medium | 0,80 | ja | NPC steht auf (Stuhl) |
| 17 | kfb_idle_breathing_a | Medium | 9,97 | nachladen (Repo) | Stehen, langer Atem-Idle (10 s) |
| 18 | kfb_idle_happy_a | Medium | 2,97 | nachladen (Repo) | Freude als Haltung (Dauerzustand) |
| 19 | kfb_dance_chicken_a | Medium | 4,80 | nachladen (Repo) | Kulturmechanik Tanz (Solo) |
| 20 | Walking_A | Large | 1,07 | ja | Rolle walk (Bestand, Strg+W) |

Reserve 21–24: Idle_B (M), kfb_idle_sad_a (M, Trauer für D4), PickUp (M, Geschenke), Walking_Backwards (M, nur wenn §7 Frage 5 geöffnet wird).
Nicht in den Top 20, obwohl gewünscht: ein Hop-Clip und ein Dreh-Clip (turn_90) existieren in keiner Quelle; beide bleiben prozedural (Bestand `car-hop.ts`, Eye-Rig).

## 6 · An die Steuerung

1. **Widerspruch gemeldet, nicht gelöst:** `Running_Strafe_Left/Right` existieren im Repo; [V-022] sagt „Strafe ohne eigenen Clip“. Katalog markiert sie als „nur wenn Georg §7 Frage 5 öffnet“.
2. **Georg-Entscheidung aus dem Bestand, nicht im Register:** KFB Motion Library 01 „ACCEPTED by Georg (2026-09-24) as a whole, judged from the contact sheets“ (`RETURN.md`). → an Steuerung zur V-Nummer, falls noch nicht erfasst (Nutzung der Mixamo-Retargets ist [V-179]).
3. **Neuer Fall, eine Zeile:** `KFB/Animated Base Character by Quaternius - cwYvO5UauX.glb` trägt 45 UAL-Clips; Quelle/Bedingungen der Figur im Repo nicht dokumentiert (kein NOTICE neben der Datei).
4. **i06 nur im Lab:** `KFB_Motion_interaction_i06.glb` (Cabrio-Ein-/Aussteigen, Karten, Schreiben) ist im Repo nicht gefunden. Wenn die Clips bleiben sollen, gehört die Datei neben die KFB Motion Library (`media/3D_Assets/Animations/`).
5. **Nachladen fürs Lab (Vorschlag):** `KFB_Motion_Library_Rig_Medium.glb` + `_Large.glb` (Idle-Emotionen, Tänze, Rückwärts) vor D4; `Rig_Medium_MovementAdvanced.glb` erst nach §7 Frage 5. Beides Bau-Sitzung, Sperrliste [V-141].
6. **Prüfung offen:** Welche `Holding_A/B/C`-Variante zu Buch bzw. Geschenk passt, und ob `kfb_idle_orc_a` als Wut-Haltung lesbar ist, braucht eine Sichtprüfung im Lab (hier nur Knochen-Daten gelesen).

## 7 · Dateien

- `replies/WSO_CLIP_CATALOG_R1.md` (dieser Bericht)
- `replies/WSO_CLIP_CATALOG_R1/clip-catalog.json` (Schema `kfb.clip-catalog.v1`: `clips[]` mit `measured{}` und `proposal{}`, `gaps[]`, `mvpTop20[]`, `sources{}`)
- `replies/WSO_CLIP_CATALOG_R1/glb_clips.py`, `measure.py` (Messskripte, reine Python-Standardbibliothek; Aufruf: `python3 -I glb_clips.py <GLBs> > raw.json && python3 -I measure.py`)
