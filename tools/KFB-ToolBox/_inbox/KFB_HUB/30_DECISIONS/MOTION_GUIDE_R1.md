# KFB · Motion- und Animations-Leitfaden R1 (v0.1)

Stand 11.10.2026 · Agent Motion-Director nach [V-177] · **kein neuer Beschluss**.
Maßgeblich bleiben DECISIONS.md, Plan R1 und PROJECT_STATE [V-117]. Bei Widerspruch gilt das Register.
Fokus: MVP. Demos erst als eigener Bauschritt mit Georgs Okay [V-177].

**Lesehilfe**
- `[V-xxx]` = verbindliche Vorgabe aus dem Register.
- **gem.** = gemessen, mit Quelle.
- **Bestand** = Wert steht in einer vorhandenen Datei (Pfad dabei).
- **MD-Vorschlag** = Vorschlag Motion-Director ohne Quelle. Gilt erst nach Georgs Ja.
- Maße in Lab-Einheiten bzw. H (H = 3,64) [V-060]. „lab/s“ = Lab-Einheiten pro Sekunde.
- Frames immer bei 30 fps (1 f = 33,3 ms), außer wo „60 fps“ steht.
- Offenes steht in §7, nicht im Fließtext.

Pfad-Kürzel:
- `LAB` = `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/`
- `AL` = `~/Dropbox/CLAUDE/KFB Animation Lab/`
- `ACT` = `~/Dropbox/CLAUDE/KFB Pet Studio/Studies/Acting-Lab-v0.4-Ad-Astra/`
- `GH` = Repo-Klon `~/KFB_GitHub_sync` (Branch-Stand HEAD, nur gelesen mit `git show`)
- `DL` = `~/Downloads/`

---

## 1 · Bestand und Such-Protokoll

### 1a · Such-Protokoll

| Ort | Methode | Ergebnis |
| --- | --- | --- |
| `DL` | `ls` mit Filter anim, flight, travel, motion, emot, pose, rig, chatter, gait, locomot, visem, bubble, npc; Zips mit `unzip -l`, Briefing- und Lab-Zips entpackt nach `scratchpad/motion/`; HTML nur als Text | rund 150 Treffer, ausgewertet (§1b). PDFs (`THE_BIZARRO_MOTION_MATRIX.pdf`, `H&D Runtime Animation Strategy.pdf`) nicht lesbar: kein `pdftotext` installiert. |
| `DL/KFB Animation + Flight + Travel Concept v1/` | Dokumente 001–015 gelesen | Architektur ohne Zahlen: Beschlüsse D-001…D-005, Flug-Zustandsmaschine, Sitzplätze (§2b). |
| ChatterBox Studio | `~/Dropbox/CLAUDE/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/` (SSOT laut `KFB_HUB/projects.json`) | Triplet-Schema, Bubble-Timing, 3D-Bühnen-Hooks (§3c). |
| Stimme | `KFB_HUB/30_PACKAGES/2026-10-10_mvp1-parallel/B_chat_mvp1-dialog.zip` → `VOICE_LAYER_INTEGRATION_CONTRACT.md` v1 | 15 Affekt-IDs, `onBeat`, Viseme „später“ (§3c). |
| ToolBox Stage-First | `~/Dropbox/CLAUDE/KFB ToolBox Studio Rig Anim/KFB ToolBox Stage v1/KFB-ToolBox/stage-first/` | Gesichts-Module (Mund, Brauen, Pose-Rig), „ACCEPTED FOR WORKING BASELINE“ 16.09. |
| Overworld v13 | `~/Dropbox/CLAUDE/KFB VoxelWorld/KFB Overworld v13-WS0/overworld-v13_2026-08-12/` | `bubble-layout.js`, Bubble-Fixtures 15/15 PASS, `cartoon-motion-2d.js` (Grenzen). |
| `LAB/src/play/` | Code gelesen: `travel.ts`, `figure.ts`, `car-hop.ts`, `seat.ts`, `vendor/travel-core.j17.js`, `vendor/locomotion-profiles.v1.js`, `vendor/walk-controller.js` | Ein Gangschema, Zustände, Überblendzeiten, Hop-Timeline. Basis von §2. |
| `LAB/src/residents/` | `pet-eye-rig.v6.js`, `anchored-eyes.v1.js`, `figure-b2.ts`, `resident.ts` | Eye-Rig-Kanäle (Lider, Slant, Blick, Pupille, Blinzeln, Kinetik, Leben). Basis von §3. |
| `LAB/public/assets/kaykit/anims/*.glb` | Clipnamen und Dauern per glTF-JSON ausgelesen | 6 Dateien, Liste §1b. Kein MovementAdvanced, kein CombatMelee/Ranged, kein Tools im Lab. |
| `LAB/public/assets/kfb-motion/KFB_Motion_interaction_i06.glb` | ausgelesen | 6 KFB-Clips (Fahren, Ein-, Aussteigen, Karten, Schreiben). |
| `LAB/public/assets/figures-b2/` | `catalog.json` + Morph-Zählung | 67 Figuren (55 Medium, 9 Large, 3 Legacy). **0 Morph-Targets** in Farmer A und FrizzleBob v3–v5. |
| `LAB/docs/` | SCALE_CONTRACT_K2, PHASE_C_DONORS_R1, MVP1_DONOR_AND_MODEL_MAP_R1, SPEC_CHARACTER_INTEGRITY_R1, Plan R1, REVIEW_POSTMVP_CONCEPTS_ARCH_FIT_R1 | Figuren-Karte, MVP-Bewohner, Reaktionsstufen, Phase H. |
| `LAB/docs/ACCEPTANCE_INDEX.md` | grep nach gait, hop, eye, anim, pose, chatter | Keine Georg-Abnahme zu Animation. Einziger Treffer: ToolBox Stage-First „ACCEPTED FOR WORKING BASELINE“ (16.09.). |
| `LAB/docs/critic/lab-track/2026-10-11_V157-gait/gait_v157.json` | gelesen | Gemessene Gangwerte Medium-Rig (§2b). |
| `LAB/docs/critic/lab-stage2/2026-10-10_08…10` | Berichte gelesen | Probe 6: kein Mini-Hüpfer beim Start, Kamera-Drehrate. |
| `30_DECISIONS/replies/RKIT_TRAIL_R1.md`, `RKIT_TRAIL_VORLAGE_R1.md` | gelesen | Treppen- und Trittstein-Tests mit gemessenem gait. |
| `30_DECISIONS/CHANGELOG.md` | grep Hüfte | Hüfthöhe Farmer A 0,65–0,83 lab (RKIT-Korrektur). |
| `AL` | README, MISSING_ANIMATIONS, HANDOVER_LAB_v4_COMBAT, LAB_QA | Zustand → Clip-Tabelle (139 Medium-Clips im Vollpaket), Cross-Rig-Regel FIT. |
| `ACT` | START_HERE, LIVING_DOCUMENT, `score.js`, `face-score.js`, `emanata.js`, `acting.js` | Gesichts-Partitur mit Zahlen, Emanata-Pool, Eye-FX. Basis von §3. |
| `GH` `skills/kfb-cartoon-animation/` | SKILL.md + Referenzen 10, 30, 70, 76 | Methode, Ebenen-Stapel, KFB-Presets (powerJump, celebrate, impact). |
| `~/Dropbox/CLAUDE/KFB HUD Flight Board - Flight VFX/` | `kfb-flight-vfx.js`, README | `hoverPose`, `FLIGHT_IDLE`, Speed-Trails. |
| Memory `kfb-chatterbox-triplets.md` | gelesen | Triplet-Vertrag (subject → connector → reframe, EN, Pool). |
| „Kulturmechanik“, „cultural mechanic“ | grep in `LAB/docs`, `KFB_HUB`, ChatterBox | nicht gefunden in `LAB/docs`, `KFB_HUB` und ChatterBox Studio. Nächster Bestand: soziale Operatoren BINGO/BOGGLE/BONGO/BLÖDSINN (ChatterBox), sechs Reaktionsstufen und Gatekeeper-Grammatik (REVIEW_POSTMVP), High × Low-Kollision (`DL/KFB_ChatterBox_v9.md` um Z. 2962). |
| Emanata 3D in Knete | grep emanata in `LAB` | nicht gefunden in `LAB/src`. Bestand nur als 2D-Studie in `ACT`. |
| Beifahrer-Clip | Clip-Listen Lab + kfb-motion + `DL` | nicht gefunden in `LAB/public/assets` und `DL` (nur Sitz-Verträge; Konzept 006 nennt Plätze Passenger A/B). |
| Tanz-Clip | `AL/MISSING_ANIMATIONS.md`, `DL` | nicht im KayKit-1.1-Vollpaket (139 Medium-Clips). `Dance` im Legacy-Rig KayKit 1.2; Mixamo-Tänze in `DL`, Lizenz ungeklärt. |
| Viseme mit Lippensynchronität, Morph-Namen | `DL`, ToolBox, Lab | nicht gefunden. PetMouth mischt 13 PNG-Viseme zufällig, kein Lip-Sync. |
| Sprech-Clip („talk“) | alle Clip-Listen | nicht gefunden in KayKit, KFB Motion Library und Lab. Stand-ins: Kopfnicken (ChatterBox `stage3d.js`) bzw. `kfb_idle_happy_a` (Card-Szene). Mixamo „Talking ×12“ in `DL`, Lizenz ungeklärt. |

### 1b · Was es gibt

**Laufzeit im Lab (läuft, Teil der Parity)**

| Teil | Pfad | Status | 1:1 nutzbar |
| --- | --- | --- | --- |
| Gangschema J17-Travel-Core | `LAB/src/play/vendor/travel-core.j17.js` + `travel.ts` | [V-020] PASS, [V-021] RULE, [V-023] RULE, [V-088] PASS | ja, Besitzer aller Gangarten |
| Locomotion-Profile (Rollen → Clip, Messung am eigenen Rig) | `LAB/src/play/vendor/locomotion-profiles.v1.js` | im Lab | ja |
| Walker (Boden, Sprung, Auto-Hüpfer) | `LAB/src/play/vendor/walk-controller.js` | Gold-Vorlage, kein Eingriff [V-160] | ja |
| Hop am geschlossenen Auto | `LAB/src/play/car-hop.ts` | [V-031] TUNE „etwa 30 %“ | ja, Arbeitsstand |
| Cabrio-Sitz (Fahrer sichtbar) | `LAB/src/play/cabrio-seat.ts`, `seat.ts` | Cabrio post-MVP [V-030, V-126] | später |
| Figuren-Karte Farmer A (Sitz) | `LAB/public/cards/farmer_a.card.json` | gemessen 10.10., `approved: null` | ja |
| Eye-Rig v6 an Ankern | `LAB/src/residents/pet-eye-rig.v6.js`, `anchored-eyes.v1.js` | [V-090] PASS (Gruppe A) | ja |
| Clay-VFX (Staub, Landung, Puff) | `LAB/src/play/vendor/clay-vfx.v1.js` + `clay-particle-profiles.v1.json` | im Lab (Hop-Staub) | ja |

**Clips im Lab** (gem., aus den GLB-Dateien gelesen)

| Datei | Clips (Dauer in s) |
| --- | --- |
| `Rig_Medium_General.glb` | Death_A 0,80 · Death_B 2,63 · Hit_A 0,67 · Hit_B 0,87 · Idle_A 1,07 · Idle_B 2,13 · Interact 1,30 · PickUp 1,30 · Spawn_Air 1,30 · Spawn_Ground 1,30 · Throw 1,37 · Use_Item 1,60 |
| `Rig_Medium_MovementBasic.glb` | Jump_Full_Long 2,33 · Jump_Full_Short 1,17 · Jump_Idle 1,07 · Jump_Land 0,67 · Jump_Start 0,60 · Running_A 0,80 · Running_B 0,80 · Walking_A 1,07 · Walking_B 1,07 · Walking_C 1,60 |
| `Rig_Medium_Simulation.glb` | Cheering 1,67 · Lie_Down 3,00 · Lie_Idle 2,67 · Lie_StandUp 2,33 · Push_Ups 1,03 · Sit_Chair_Down 0,80 · Sit_Chair_Idle 3,60 · Sit_Chair_StandUp 0,80 · Sit_Floor_Down 1,00 · Sit_Floor_Idle 4,00 · Sit_Floor_StandUp 1,13 · Sit_Ups 1,73 · Waving 2,13 |
| `Rig_Large_General.glb` | Death_A 1,67 · Hit_A 0,70 · Idle_A 1,97 · Idle_B 6,00 |
| `Rig_Large_MovementBasic.glb` | Running_A 1,07 · Walking_A 1,07 |
| `Rig_Large_Simulation.glb` | Flexing 4,30 |
| `kfb-motion/KFB_Motion_interaction_i06.glb` (KFB Motion Library v6) | kfb_interaction_driving_a 5,03 · kfb_interaction_entering_car_a 5,50 · kfb_interaction_exiting_car_a 5,83 · kfb_interaction_cards_a 12,53 · kfb_interaction_cards_b 9,03 · kfb_interaction_writing_a 5,03 |

Rig_Medium hat 23 Knochen: root, hips, spine, chest, head, upperarm/lowerarm/wrist/hand/handslot je .l/.r, upperleg/lowerleg/foot/toes je .l/.r, dazu `eye_anchor.l/.r` in den NoEyes-Dateien. FrizzleBob v3–v5: 47 Knochen (Ohren). Keine Figur hat Blendshapes.

**Bestand außerhalb des Lab**

| Teil | Pfad | Status | Nutzen |
| --- | --- | --- | --- |
| Animation Lab v1–v4 (Messwerkzeug, Zustand → Clip) | `AL/` (`MISSING_ANIMATIONS.md`, `export/AnimationMap.v0.json`) | Audit „OPEN, Georgs Lauf steht aus“ (QA_CLIPSCHAU) | Zustands-Tabelle und Lückenliste 1:1 |
| KayKit 1.1 Vollpaket (139 Medium-Clips: u. a. Tools, CombatMelee 22, CombatRanged 20, MovementAdvanced) | Quelle laut `locomotion-profiles.v1.js`: Repo `georg-doc/kayfabizarro` @ b97b5ac, `media/3D_Assets/KayKit_Character_Animations_1.1/`; Zips in `DL` | gemessen 12.09. (AL) | Nachladen der fehlenden Sets |
| Acting Lab v0.2–v0.4 (Gesicht, Emanata, Eye-FX) | `ACT` | „keine Georg-Abnahme“ (LIVING_DOCUMENT §00, §12) | Partitur-Zahlen, Pool, Kanal-Regeln |
| Pet Studio v12 Gesicht (brow-rig.v2, pet-nose.v2, pet-moustache.v1, pet-mouth.v1, Ausdrucksliste) | `~/Dropbox/CLAUDE/KFB Pet Studio/` (laut `AL/HANDOVER_LAB_v4_COMBAT.md` §1, §5) | im Repo, nicht im Lab | Phase H [V-062] |
| ToolBox Stage-First: `pet-mouth.v1.js` (13 PNG-Viseme, zufällig gemischt, 8–11 Wechsel/s; Ruhe-Münder neutral, happy, angry, sad, surprised, thinking), `brow-rig.v2.js`, `pose-rig.v1.js` (Sitz-IK, zwei Knochen) | `~/Dropbox/CLAUDE/KFB ToolBox Studio Rig Anim/KFB ToolBox Stage v1/KFB-ToolBox/stage-first/src/petstudio-v9/` | „ACCEPTED FOR WORKING BASELINE“ 16.09.; Stimme, Bubble, Pose nicht abgenommen; three 0.160 | Phase H |
| ChatterBox 3D-Bühne `lib/chatterbox/stage3d.js` | ChatterBox Studio Cut 05.10. | Studio v2 TUNE („top!“); three 0.184 | Sprech-Nicken, Rückprall, Blick 1:1 |
| Card-Szene (Beat-Uhr mit Verben settle, card, emote, gaze, say, think, motion) | `~/Dropbox/CLAUDE/KFB Resident Card Speculation Scene/npc-card-spec-01_2026-09-24/` | CANDIDATE, Georg-Abnahme offen | Muster für Choreografie-Daten |
| Combat Arena v2, Kenney Blaster Kit 2.1 (CC0, 206 Teile gemessen), `weapon-mods.v1.js` | laut `AL/HANDOVER_LAB_v4_COMBAT.md` §1 | eigene Linie | §4 |
| KFB Cartoon Animation Skill v2 (Methode) | `GH skills/kfb-cartoon-animation/` | Methodenquelle | Ebenen-Stapel, Presets |
| Flight-VFX + Schwebe-Pose | `KFB HUD Flight Board - Flight VFX/KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/hud-flight/kfb-flight-vfx.js` | gebaut gegen r170, „r186 nicht live getestet“ | Flug später |
| Clown-Jonglage J5, Eye-Guard-Skripte | Branch `blender-mcp/motion-forge-poc-01-2026-10-08` (laut MVP1-Donor-Map, SPEC_CHARACTER_INTEGRITY §3b) | „läuft, Beweis vorhanden“ | Prop-Prüfung |

**In `DL` ausgewertet** (Auswahl, alles nur gelesen):

| Datei | Inhalt | Status |
| --- | --- | --- |
| `KFB Animation + Flight + Travel Concept v1/` (Juli) | D-001…D-005 (Pet besitzt keine Bewegung · Fahrzeug und Pet getrennt · Animation nur lesend · Boden und Flug eine Laufzeit · CardRig rein visuell); Zustände Grounded, Hover, Flight, Docked, Locked, Disabled; Sitzplätze Driver, Passenger A/B, Cargo, Companion | Konzept, keine Zahlen |
| `3D Cartoon-Animation Library erstellen.zip` (= Animation Lab v1-Export) | `lab/locomotion.js`, KFB_STATES (24), Inventare | Audit OPEN |
| `AnimationInventory(1).md/json`, `RigCompatibility(1).json` | Medium 139 Clips in 8 Packs, Large 34 in 6; Large ohne Sprung, Strafe, Rückwärts; alle 45 Figuren binden 23/23 | gemessen 12.09. |
| `KFB Animation Lab.zip`, `(2)`, `(4)`, `(5)`, `(6)` | meist Knet-Straße (`(6)` FAILED) bzw. Vehicle- und Flight-Deformer, keine Figuren-Animation | – |
| `BRIEFING_ANIMATION_LAB_Wissens-Pilli_v0.1.md` | Kette Ursache → Antizipation → Aktion → Betonung → Nachlauf → Erholung → Ruhe; Deformer „correct“ 520 ms, scaleY [1, 1,08, 0,98, 1] | Briefing |
| `09_CHARACTER_RIG.md` | Kanäle Blick, Lider, Brauen, Mund, Kopf, Körper getrennt; Primitive (LOOK_AT, SQUINT, NOD …); „kein Emotions-Knopf“ | SSOT-Entwurf |
| `KFB Cartoon Motion Matrix v1.md`, `…Research v1.md`, `Browser-Based 3D Cartoon Animation v1.md` | 38 Bewegungen mit Dauern (z. B. double_take 0,5–1,0 s, hit_react 0,15–0,35 s); Squash-Grenze Sy 0,75 / Sx,Sz 1,15 | Recherche (Perplexity), kein Beschluss |
| `KFB_TRAVEL_GLOBE_CONVERGENCE_01_…_2026-09-29.md` | erste Leertaste = Sprung, zweite frische Leertaste in **400 ms** = Flug anfragen | „human-accepted“ laut Brief, nicht im Register |
| `KFB_TRAVEL_COMBAT_V25_PRODUCTION_PREP_v1.md` | Doppel-Leertaste 280 ms (alt), takeOff Y+0,8, Steigziel +12 | Audit, kein Produktionsstand |
| `Cube Pets Flight Controller.docx` | Dragonflight-Gefühl: Start, Boost, Gleiten, Sturzflug, Vigor | Konzept ohne Zahlen |
| `KFB ChatterBox/` | nur 14 ElevenLabs-MP3s | – |
| `kenney_emotes-pack.zip` | CC0: alert, anger, cloud, drop(s), exclamation, heart(s), idea, laugh, music, question, sleep, star(s), swirl … | Emanata-Kandidat |
| `KayKit Character Animations 1.2 - legacy.zip` | Legacy-Rig mit u. a. Cheer, Dance, Hop, Wave, Defeat, Roll | CC0 |
| `Universal Animation Library 2[Standard].zip` | Quaternius, CC0, Clipliste im GLB (nicht ausgelesen) | – |
| 365 Mixamo-FBX, retargetet auf Rig_Medium (354) bzw. Rig_Large (10); Locomotion-Packs Basic, Male, Female Basic, Magic | u. a. Entering/Exiting Car, Flying, Floating, Angry Gesture, Surprised, Laughing, Talking ×12, Tänze | **Lizenz ungeklärt** |

### 1c · Lücken

| Nr | Lücke | Folge |
| --- | --- | --- |
| L1 | Zwei PDFs ungelesen (kein `pdftotext`); Mixamo-FBX und Locomotion-Packs ohne geklärte Lizenz; PetFlight als Modul nicht gefunden in `DL`. | Diese Quellen nicht nutzen, bis Lizenz bzw. Inhalt geklärt sind. |
| L2 | Im Lab fehlen MovementAdvanced (Rückwärts, Strafe, Crouch), Tools, CombatMelee/Ranged. | Rollen `backward`, `strafe.*`, `crouch`, `sneak`, `crawl` sind im Lab UNMAPPED. Strafe nach [V-022] hat keinen eigenen Clip. |
| L3 | Large-Rig hat im Lab nur Idle, Walk, Run, Hit, Death, Flexing. | Kein Sprung, kein Sitzen, kein Winken, kein Jubel für Large ohne Cross-Rig-Versuch. |
| L4 | Keine Brauen, kein animierter Mund im Lab. | Gesicht im MVP = nur Augen und Lider. Brauen und Viseme = Phase H [V-062, V-086]. |
| L5 | Emanata gibt es nur als 2D-Studie. | Knet-Emanata sind neu zu bauen (§3b). |
| L6 | Kein Beifahrer-Clip, kein Sprech-Clip; Tanz nur im Legacy-Rig. | Beifahrer post-MVP (Cabrio). Sprechen = Nicken + Mund. Tanz offen. |
| L6b | Drei Emotions-Wortschätze sind nicht aufeinander abgebildet: 6 Mund/Augen-Emotes (PetMouth), 15 Affekt-IDs (Voice Layer), 8 Acting-Lab-Rezepte. | §3b schlägt eine Abbildung vor; Besitzer klären (§7). |
| L7 | Keine Animation hat eine Georg-Abnahme außer Gangtempo [V-020] und Kamera [V-088]. | Alle Acting-Werte sind Startwerte, keine Vorgabe. |

---

## 2 · Fortbewegung und Reisezustände

### 2a · Grundsätze (aus dem Register)

- Ein Gangschema für alle Einstiege: J17-Travel-Core. `walk.ts` ist stillgelegt [V-021].
- Der Controller besitzt die Position. Clips schreiben sie nie. KayKit-Clips laufen in-place (Bestand `locomotion-profiles.v1.js`).
- Tempo wird am eigenen Rig gemessen, nicht geschätzt (`measureProfiles`, Bestand). Füße gleiten nicht, weil `worldSpeed = stanceSpeed × rate`.
- Figuren werden nie skaliert [V-060]. Das Template rechnet in Metern; Umrechnung 1 m Figur = 3,64 / 1,85 = 1,9676 lab (Bestand `figure.ts`, `M2LAB_FIG`).
- Steuerung: W = Joggen, Shift+W = Sprint, Strg+W = Gehen [V-020]. WoW-Schema [V-022].
- Fuß- und Fahrtests zählen nur bei ≥ 50 fps [V-159].

### 2b · Zustände mit Werten

| Zustand | Clip (Rig_Medium) | Werte | Herkunft |
| --- | --- | --- | --- |
| Stehen | Idle_A 1,07 s | – | Bestand (Lab-GLB) |
| Gehen (Strg+W) | Walking_A 1,07 s, Rate 1 | 1,052 lab/s · Kadenz 112,5/min · Schritt 0,561 | gem. `gait_v157.json` |
| Joggen (W) | Running_A 0,80 s, Rate 1 | 5,084 lab/s (≈ 1,40 H/s) · Kadenz 150 · Schritt 2,034 | gem. `gait_v157.json`; [V-020] PASS |
| Sprint (Shift+W) | Running_B 0,80 s, Rate 1,3 | 8,071 lab/s (≈ 2,22 H/s) · Kadenz 195 · Schritt 2,483 | gem. `gait_v157.json`; [V-020] |
| Sprung im Stand | Jump_Start 0,60 → Jump_Idle (Halten) → Jump_Land 0,67 | Kante ≤ 1,181 | gem. `gait_v157.json`; [V-023] |
| Sprung aus Joggen | Jump_Full_Short 1,17 s, Rate an Flugzeit angepasst | Lücke ≤ 2,705 · Gipfel 1,285 | gem. `gait_v157.json`; Rate-Formel Bestand `travel-core.j17.js` Z. 165 |
| Weitsprung (Shift+Leertaste) | Jump_Full_Long 2,33 s | Absprung 1,15 × jumpV · Lücke ≤ 4,933 · Gipfel 1,747 | [V-088]; gem. `gait_v157.json` |
| Anlauf (Antizipation im Walker) | – | windup 0,09 s, Tempo im windup 0,55 | Bestand `walk-controller.js` |
| Treppe | Gang läuft weiter | Setzstufe 0,30 / Tritt ≥ 1,3 (Alternative 0,22 / 0,889); stepMax 0,885 | [V-160]; gem. Treppen-Fußtest 60 fps |
| Hang | Gang läuft weiter | begehbar ≤ 35°; Pfad ≤ 12 %, sonst Treppe | Bestand `figure.ts`; [V-158] |
| Einsteigen (geschlossenes Auto) | Run zur Tür → Hop aufs Dach → Puff | siehe §2d | Bestand `car-hop.ts`; [V-031] TUNE |
| Fahren | Figur unsichtbar | Auto-Squash J17 .12 / .18 / .06 | [V-030, V-126, V-103] |
| Auto in der Luft | AUTO.TAKEOFF 0,25 s → AIRBORNE → LANDING 0,45 s | Kamera „fly-chase“ | Bestand `travel-core.j17.js` |
| Aussteigen | Pop aus dem Dach → Hop → Landung neben der Tür | siehe §2d | Bestand `car-hop.ts` |
| Beifahrer | – | nicht gefunden; Konzept nennt Plätze Passenger A/B | L6; Konzept 006 in `DL/KFB Animation + Flight + Travel Concept v1/`; post-MVP mit Cabrio |
| Sitzen (NPC) | Sit_Chair_Down 0,80 → Sit_Chair_Idle 3,60 → Sit_Chair_StandUp 0,80; Sit_Floor_* | Hüfte auf Sitz ≤ 0,02 H | Bestand Lab-GLB; Prüfgrenze SPEC_CHARACTER_INTEGRITY §3 |
| Flug / Jetpack | – | Doppel-Leertaste, später. Konzept: Grounded → Takeoff → Flight → Landing → Grounded; Hover, Boost, Glide, Stall als Unterzustände; Neigen nur Darstellung. Fenster zweite Leertaste 400 ms (Convergence-Brief, „human-accepted“, nicht im Register). Schwebe-Pose: 0,55 Hz, y ±0,12, Pitch 0,05, Roll 0,06, Bein 0,22; Schub im Schweben 0,14 | [V-024] TBD; Konzept 005 in `DL/KFB Animation + Flight + Travel Concept v1/`; Bestand `kfb-flight-vfx.js` |
| Reise zwischen Inseln | im Auto auf der schwebenden Strecke | – | [V-120a]; Paternoster später [V-099] |

Hüfthöhe Farmer A: 0,65–0,83 lab; Poller 0,85 = Hüfte (Bestand CHANGELOG, RKIT_POLLER_R1).

### 2c · Zustandsgraph

Zu Fuß (Überblendzeiten = Bestand `locomotion-profiles.v1.js` TRANSITIONS, Hinweise; der Core besitzt das Timing):

```
            0,25            0,20 sync          0,15 sync
  IDLE ──────────▶ WALK ─────────────▶ RUN ─────────────▶ SPRINT
   ▲   ◀──────────      ◀───────────────     ◀─────────────
   │      0,30             0,25 sync           0,20 sync
   │   (IDLE → RUN direkt: Crossfade ohne Startclip, Probe 6)
   │
   │  any ──0,08──▶ JUMP.START ──Clipende, 0,10──▶ JUMP.AIR
   │                                                │ Bodenkontakt, 0,05
   └──── Clipende, 0,15 ◀──────── JUMP.LAND ◀───────┘
         (auch → WALK)
   Volle Sprünge (kurz/lang): Clip bis 85 % oder ≤ 0,35 s nach Landung → WALK.GROUND
```

Fuß ↔ Auto (Bestand `travel-core.j17.js`, Konstanten Z. 10–13):

```
 WALK.GROUND ──Leertaste, Stand (< 0,5 m/s), ≤ 3,5 m zur Tür──▶ CUT.ENTER
 CUT.ENTER ──fertig──▶ CAM.TO_AUTO (0,7 s) ──▶ AUTO.SEATED
 AUTO.SEATED ⇄ AUTO.PARKED  (v < 0,5 m/s, nach 0,15 s)
 AUTO.SEATED ──Luftstück──▶ AUTO.TAKEOFF (0,25 s) ──▶ AUTO.AIRBORNE ──▶ AUTO.LANDING (0,45 s) ──▶ AUTO.SEATED
 AUTO.PARKED ──Leertaste──▶ CUT.EXIT ──fertig──▶ CAM.TO_WALK (0,7 s) ──▶ WALK.GROUND
```

Leertaste im Auto: unter 0,5 m/s Aussteigen, darüber Hüpfen (Schema wsa6, Bestand). Kamera-Drehrate in Schnitten ≤ 36°/s, gemessen ≤ 45°/s (Bestand `travel.ts`; Probe 6: 39,8°/s).

### 2d · Hop-Timeline (Bestand, [V-031] TUNE)

`car-hop.ts`, J17-Vorlage `cabrio-seat.j17.js` / `hop.py`:

| Phase | Einsteigen | Aussteigen |
| --- | --- | --- |
| Anlauf | Run zur Tür mit gemessenem Run-Profil; Andockpunkt 0,3 H neben der Vordertür; Drehen zur Tür 0,25 s | – |
| 1 | Hocke 12 f (45 % Richtung Sitzpose) | Pop aus dem Dach 0,2 s + Puff |
| 2 | Hop 20 f, Bogen 0,5 lab über dem höheren Ende, Hüftweg Bézier | Hop 20 f |
| 3 | Landung 10 f, eingezogen auf dem Dach | Landung 12 f, 0,3 H neben der Tür |
| 4 | „Plop“ 0,2 s, Knet-Puff verdeckt, weg | Aufstehen 20 f |

- Arme im Sprung auf Standpose (KayKit-Sprünge spreizen 46–88°), zurück in 0,15 s (Bestand).
- Staub: 5 Knetkleckse in Insel-Sandfarbe, ≤ 0,4 s (Bestand).
- Core-Squash: Ausstieg `squash 1,1`, Ausspucken `squash −1,0` (Bestand `travel-core.j17.js` Z. 75, 96).

### 2e · Vorschläge Fortbewegung

Alle **MD-Vorschlag**, frühestens mit [V-033] (Cartoon-Prinzipien, TBD später). [V-031] warnt: „bevor wir uns verkünsteln“.

1. **Landung mit Nachfedern:** nach Jump_Land eine additive Hüft-Senke 0,04 H über 4 f, zurück über 6 f. Nur Knochen `hips`, `spine`. Kein Root-Scale.
2. **Start-Akzent ohne Hüpfer:** IDLE → RUN bekommt 3 f Vorlage des Oberkörpers (`spine` +6° nach vorn), dann Crossfade. Kein Hüpfer (Probe 6 hat ihn bewusst entfernt).
3. **Stopp-Akzent:** RUN → IDLE mit 4 f Rücklage (`spine` −5°), dann Settle 6 f.
4. **Treppe:** Füße liegen 14–19 Bilder unter der Trittkante (gem., RKIT_TRAIL_R1 Nachtest). Fuß-IK nur für `foot.l/r`, nur auf Treppen. Erst nach Georgs Blick aufs Bild.
5. **Strafe (Q/E):** MovementAdvanced-Clips `Running_Strafe_Left/Right` aus dem Vollpaket nachladen. Sie stehen schon in den Rollen von `locomotion-profiles.v1.js`.

---

## 3 · Emotionales Acting

### 3a · Was im Lab spielen kann

- **Körper:** KayKit-Clips (Tabelle §1b) plus additive Knochen-Offsets.
- **Augen:** Eye-Rig v6 (Bestand `pet-eye-rig.v6.js`):
  - `applyEmote({ lidUpper, lidLower, slant, pupil, gaze })`; Zahl = beide Augen, `[L, R]` = je Auge.
  - Blick: `front`, `down` (0, −0,85), `away` (0,9, 0,2); Pupille `normal` oder `wide`.
  - Blinzeln: Pause 2,5–6,5 s, Dauer 0,12 s.
  - Kinetik `setKinetics({a, c, j})`: Bremse → Sorge, Kurve → Blick nach außen, Fall → Schreck.
  - Leben `setLife({wander, tremor})`: langsames Driften.
- **Brauen, Mund, Nase:** nicht im Lab (L4). Bestand in der ToolBox (PetMouth, brow-rig.v2). Phase H [V-062], KFB-Münder [V-086].
- **Lesbarkeit:** Silhouette und Pose → Ausrichtung → große Geste → Emanata → Gesicht (Bestand `LAB/docs/BASELINE_ACCEPTED_R1.md` Zeile 3; der Style Guide §8 lässt Emanata aus). Dort auch: Augen sind aus der Spielkamera zu klein. Der Körper trägt, das Gesicht verstärkt nur.

### 3b · Matrix Emotion → Ausdruck

Die acht Emotionen kommen aus dem Acting Lab (`ACT/score.js` RECIPES). Gesichtswerte = Bestand `ACT/face-score.js` FACE_SCORE, gebaut für FrizzleBob mit Eye-Rig v5. Eye-Rig v6 hat dieselbe API. Auf KayKit-Figuren sind die Werte **ungeprüft**.

**Gesicht und Emanata**

| Emotion | Oberlid u [L,R] | Unterlid l | Slant s | Blick g | Pupille | Brauen (Phase H) | Mund (Phase H) | Emanata |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| neutral | −0,35 / −0,35 | 0 / 0 | 0 / 0 | 0 / 0 | normal | ruhig | neutral | – |
| Freude | wie überrascht: −0,45 / −0,45 | −0,18 | 0 | 0 / 0,18 | normal | hoch | smile | Freude-Strahlen (`joy`) |
| Wut | 0,24 / 0,24 | 0,17 | −0,42 | 0 / −0,04 | normal | tief, innen runter | neutral | Wut-Zeichen (`anger`) |
| Skepsis | −0,32 / 0,28 | 0,04 / 0,20 | 0,18 / −0,12 | 0,40 / 0,02 | normal | eine hoch | neutral | Schweißtropfen (`sweat`) |
| Schreck | −0,45 / −0,45 | −0,18 | 0 | 0 / 0,18 | wide (MD) | ganz hoch | „oh“ | Schweißtropfen; neu: Schreck-Strahlen (MD) |
| Sorge | −0,12 / 0,03 | 0,04 / 0,12 | 0,35 / 0,30 | −0,2 / −0,1 | normal | innen hoch | neutral | Schweißtropfen |
| Trauer | wie Sorge | wie Sorge | wie Sorge | wie Sorge | normal | innen hoch | „oh“ | Tränen (`tears`) |
| Müde / benommen | 0,58 / 0,50 | 0,15 / 0,20 | 0,12 / 0,06 | 0 / −0,25 | normal | schwer | neutral | Schwindel-Sterne (`dizzy`) |

Zuordnung Emotion → Emanata ist Bestand (`ACT/emanata.js` `effectFor`). Pool-Werte (Bestand): `joy` Periode 0,65 s, ≤ 6 Zeichen; `tears` 0,65 s, ≤ 6; `sweat` 1,1 s, 1; `anger` 0,5 s, 1; `dizzy` 1,6 s, 3. Höchstens 6 Zeichen je Figur.

**Körper und Timing**

| Emotion | Körperpose (Basis + additiv) | Geste | Timing (MD-Vorschlag, 30 fps) | Squash/Stretch |
| --- | --- | --- | --- | --- |
| Freude | Idle_A; Brust hoch, Kopf +8° hoch | Cheering (Bestand) bzw. Arme auf | Antizipation 3 f · Aktion 5 f · Akzent 5 f · Halten 9 f · Settle 8 f (= Preset celebrate) | Stretch beim Hochgehen |
| Wut | Brust vor, Kopf −6° (runter), Schultern hoch | Faust nach unten (`lowerarm` +30°) | Antizipation 4 f · Stoß 3 f · Halten 20 f · Settle 10 f | Squash beim Stoß |
| Skepsis | Gewicht auf ein Bein, Kopf schräg 10° | Hand ans Kinn (`upperarm.r`, `lowerarm.r`) | Doppelblick: Blick hin 4 f, weg 6 f, zurück 3 f; Halten 30 f | keins |
| Schreck | Rückprall: Brust −10°, Arme hoch | Hit_B als Basis (Bestand), Hände auf | Antizipation 1–2 f · Aktion 4 f · Überschwinger 3 f · Halten 15 f · Erholung 15 f | Stretch nach oben, dann Squash |
| Sorge | Schultern hoch, Arme eng | Hände vor der Brust | langsam: Ein 10 f · Halten 45 f · Aus 15 f | keins |
| Trauer | Kopf −15°, Brust eingesunken | Hand ans Gesicht | Ein 15 f · Halten loop · Aus 20 f | leichter Squash |
| Müde | Kopf hängt, Wanken (`spine` ±4°, 1,6 s) | – | Wanken im Takt der Sterne (1,6 s, Bestand `dizzy`) | keins |

**Gemeinsamer Zeitrahmen (Bestand `ACT/score.js`):** eine Reaktion dauert 3,6 s. Antizipation 0–0,25 s, Aktion 0,25–0,8 s, Halten 0,8–2,2 s, Erholung 2,2–3,6 s. Hüllkurve mit Smoothstep. Die Tabelle oben verkürzt das für Spielszenen (MD-Vorschlag). Die 3,6 s bleiben der Prüfrahmen.

**KFB-Presets (Bestand `GH skills/kfb-cartoon-animation/references/76-kfb-motion-presets.md`):**
- powerJump: Laden 0–120 ms, Absprung 120–310, Flug 310–560, Vorbereitung 560–680, Kontakt ≈ 680 mit kurzem Hitstop, Erholung bis ≈ 860 ms.
- celebrate: 0–100 Antizipation, 100–260 Aktion, 260–420 Akzent, 420–700 Halten, 700–980 Settle. „Ein Akzent, nicht Sterne + Herzen + Münzen gleichzeitig.“
- impact: Hitstop 40–95 ms, Burst 60–220, Erholung 620–850.

**Squash und Stretch in Knete (MD-Vorschlag)**
- Körper der Figur: höchstens 8 % Squash (y 0,92, x/z 1,04) und 6 % Stretch, volumenerhaltend, über die Knochen `hips`/`spine`, zurück auf 1,0 in ≤ 6 f.
- Kopf nie getrennt skalieren: die Augen hängen an `eye_anchor` am Kopfknochen.
- Props in der Hand nie mit-squashen (Acting Lab lässt Ganzkörper-Squash deshalb weg, `ACT` LIVING_DOCUMENT §06).
- Eye-Rig gleicht Squash schon aus: Klemme 0,5–1,5 (Bestand `pet-eye-rig.v6.js` `update`).
- Vergleichswerte im Bestand: Overworld v13 `cartoon-motion-2d.js` deckelt Verformung auf ≤ 12 % Scale, ≤ 6° Drehung, ≤ 0,3 s (Squash-Kanal 0,09); „Verformung nur im Bild, nie in der Physik“. Die Recherche `DL/Browser-Based 3D Cartoon Animation v1.md` erlaubt bis Sy 0,75 / Sx,Sz 1,15. Der Vorschlag oben bleibt bewusst darunter, weil Knete-Figuren Augen und Props tragen.
- Ob vorübergehender Squash mit [V-060] „Figuren nie skalieren“ vereinbar ist, entscheidet Georg (§7 Frage 1). Vorbild: der J17-Schnitt schreibt heute schon `root.scale` aus `S.pose.s` (Bestand `travel.ts`).

**Emanata bauen (neu, L5)**
- Bestand: 2D-Striche am projizierten Kopf-Anker (`ACT/emanata.js`); Eye-FX auf der Augenkugel: Death-X, Herz, Stern, Spirale, wässrig, große Pupillen (`ACT` LIVING_DOCUMENT §12).
- **MD-Vorschlag:** Emanata als kleine, flache Knet-Plättchen mit Kamera-Ausrichtung. Gerundete Kanten [V-011]. Farben aus der Inselpalette bzw. fest je Zeichen (Tropfen hellblau, Wut rot, Sterne gelb wie im Bestand).
- Neu zu bauen (MD-Vorschlag): Schreck-Strahlen bzw. „!“, Fragezeichen, Dampfwölkchen bei Wut, Bewegungslinien am Körper bei Sprint und Landung.
- Kandidat als Formvorlage: `DL/kenney_emotes-pack.zip` (CC0; alert, anger, cloud, drop, exclamation, heart, idea, question, sleep, star, swirl …). Kenney steht in der Reihenfolge zuletzt [V-070].
- Weitere Bedeutungsliste im Bestand: 18 Emotes, eins pro Blase (skull, grin, lightning, bang, spark, cloud, brain, spiral, question, exclamation …; `DL/KFB_WS0_Combined_Briefing_Chatter_Soundscape_v1.md` §14).
- Budget: ≤ 6 Zeichen je Figur (Bestand), ≤ 2 Figuren gleichzeitig mit Emanata (MD-Vorschlag).

### 3c · Kopplung an ChatterBox-Triplets und Interaktionen

**Vertrag (Bestand, Memory `kfb-chatterbox-triplets.md`):** ChatterBox besitzt den Inhalt. Jede Äußerung ist ein Triplet aus dem EN-Pool: subject → connector → reframe, mit Quelle (deckId + cardNumber). Der Voice Layer spielt nur ab. Dieser Leitfaden schreibt **keine** Dialogzeilen.

**Takt-Kopplung (MD-Vorschlag):** Die Animation liest die drei Beats als Zeitmarken. Sie liest nicht den Text.

| Beat | Sprecher | Zuhörer |
| --- | --- | --- |
| subject | Antizipation: Blick zum Zuhörer (Augen 3 f vor dem Kopf), kleiner Atem-Heber | Blick zum Sprecher nach 6 f |
| connector | eine Geste auf der Betonung (Hand oder Kopfnicken), 4 f Aufbau, 6 f Halten | Mikro-Reaktion: Lid-Änderung 0,1, keine Geste |
| reframe | Hauptpose der Emotion (§3b), Halten bis Beat-Ende | Reaktion der Pointe: Emotion des Zuhörers + ein Emanata; Start 4–6 f **nach** dem Beat |

**Was ChatterBox schon liefert** (Bestand ChatterBox Studio Cut 05.10., Studio v2 TUNE):
- Triplet-Felder: `tripletId`, `subject`, `connector`, `reframe`, `relation` (COLLISION, MISFIT, SYNERGY, ESCALATION, CATEGORY_SHIFT), `tags`. **Kein Emotions-Feld.** Affekt sitzt beim Sprecher (Profil `attitude.baseline`, Affekte WARY, INTRIGUED, MOVED, IRRITATED, AMUSED, ENERGIZED, BORED).
- `presentationHints` je Bewohner sind Animations-Hinweise, z. B. Lorekeeper „pause-before-correction, low-animation-intensity“, Goth Girl „gaze-hold“, Clown „acting-can-expand-not-wordcount“, Witch „lean-in-when-testable“. Der Kern steuert nie das Rig direkt.
- Darstellung: ein Triplet = eine Sprechblase mit drei Blöcken. Block n öffnet bei n × **520 ms**, Kippen über **300 ms**. Schweigen = Denkblase „…“.
- Haltezeit: 800 + 42 × Zeichen ms, höchstens 5000, Ausblenden 220, mindestens 1200 (Overworld v13 `bubble-layout.js` TIME, auch `chatterbox-core.js`).
- 3D-Hooks (`stage3d.js`, three 0.184): `talk` = Squash 0,3 s (+5 % / −6 %) + Kopfnicken; `recoil` = 0,34 s + Hit_A; `setGaze` = additiver Kopf-Yaw ±0,95, Pitch ±0,32, Glättung 1 − e^(−6 dt), nach dem Mixer. Ein Idle (Idle_A) für alle (Georg 05.10.).
- Blickregel: nach einem Zug schaut der Sprecher zum Partner und der Partner zum Sprecher. Zur Antwortwahl schauen beide in die Kamera.
- Voice Layer (`VOICE_LAYER_INTEGRATION_CONTRACT.md` v1): `onBeat(i)` öffnet Blasen-Block, Mund, Augen-Reaktion, optional Emanata. 15 Affekt-IDs: calm, curious, attentive, joyful, amused, grateful, proud, surprised, worried, sad, annoyed, angry, embarrassed, suspicious, tired. „Lip-Sync/Viseme später; Stufe 1 = Sprechaktivität + Amplitude/Beat.“
- **Folge für die Takt-Kopplung:** Die drei Beats sind die drei Blasen-Blöcke (0 / 520 / 1040 ms bzw. `onBeat(0…2)`). Die Tabelle oben hängt an diesen Zeitmarken.

**Abbildung der Wortschätze (MD-Vorschlag, L6b)**

| Acting-Rezept (§3b) | Voice-Affekt-IDs | PetMouth-Ruhemund |
| --- | --- | --- |
| neutral | calm, attentive | neutral |
| Freude | joyful, amused, grateful, proud | happy |
| Wut | annoyed, angry | angry |
| Skepsis | suspicious, curious | thinking |
| Schreck | surprised | surprised |
| Sorge | worried, embarrassed | sad |
| Trauer | sad | sad |
| Müde | tired | neutral |

- Sprechblasen im Spiel sind TBD [V-085]. Viseme kommen mit Phase H [V-062].

**Interaktionen (Bestand, REVIEW_POSTMVP_CONCEPTS_ARCH_FIT_R1):**
- Sechs Reaktionsstufen: „Welt reagiert über Blick, Pose, Gruß, Gefallen; keine Balken“, P3, nach MVP. Schwellen 0/1/3/10/28/51 sind Vorschlag.
- Gatekeeper-Grammatik: „Welt entscheidet, NPC spielt nur“. MVP: Dark Knight nur Wach-Idle.
- **MD-Vorschlag:** Jede Reaktionsstufe bekommt eine Begrüßungs-Variante aus §3d (Stufe niedrig = nur Blick; mittel = Nicken; hoch = Winken + Freude). Daten in der Figuren-Karte unter `expressions` (Schema-Vorschlag SPEC_CHARACTER_INTEGRITY §2).
- Soziale Operatoren (Bestand ChatterBox): BINGO = Landen, Hand zurück an den Spieler · BONGO = Halten, ein Element einen Beat weiter · BOGGLE = Umdeuten · BLÖDSINN = Widerspruch ohne Feindschaft. **MD-Vorschlag** Körper dazu: BINGO = offene Hand zum Spieler; BONGO = Pose halten (`holdFrame`); BOGGLE = Doppelblick + Kopfneigung; BLÖDSINN = Rücklage + abwinkende Hand.
- „Kulturmechanik“: nicht gefunden in `LAB/docs`, `KFB_HUB` und ChatterBox (§7 Frage 7).

### 3d · NPC-Choreografie-Vorlagen

Rollen heißen A, B, C. Es werden keine Figuren erfunden. Besetzung nur aus den MVP-Bewohnern (SPEC_CHARACTER_INTEGRITY §5) und mit Figuren-Karte.
Alle Frames bei 30 fps. Knochen = Rig_Medium. „Gesicht“ = `applyEmote` am Eye-Rig v6. Alle Werte **MD-Vorschlag**, außer Clipnamen und -dauern (Bestand).

**Vorlage 1 · Begrüßen (A trifft B)**
1. f 0: A in Idle_A. Gesicht neutral. B in Idle_A.
2. f 0–4: A Augen zu B (Blick per Ziel). f 3–9: Kopf `head` dreht nach. f 6–14: Brust `chest` dreht 50 % mit.
3. f 10–14: A Antizipation: `spine` −4° (leicht zurück), Oberlid −0,1.
4. f 14: A Crossfade 0,15 s auf **Waving** (2,13 s = 64 f). Gesicht Freude bis f 20.
5. f 20: B Blick zu A (6 f Verzug). f 26: B Gesicht Freude. f 30–45: B Nicken (`head` ±8°, 2 Takte à 7 f).
6. f 78: A Waving endet. Crossfade 0,3 s auf Idle_A. Gesicht zurück über 15 f.
7. Optional Emanata `joy` auf A f 18–48.
- Varianten nach Reaktionsstufe: nur Schritt 2 (Blick) · Schritt 2 + 5 (Nicken) · alles.

**Vorlage 2 · Streiten (A gegen B, drei Triplet-Beats)**
1. f 0: beide Idle_A, Abstand ≈ 1 H, einander zugewandt.
2. Beat subject (A): f 0–6 A Antizipation (`chest` vor 6°). Gesicht Skepsis. f 6–30 Geste: `upperarm.r` vor, `lowerarm.r` gestreckt (Zeigen), Halten.
3. B reagiert ab f 12: Gesicht Wut, Rücklage `spine` −5°.
4. Beat connector (B): f 0–4 B Stoß nach vorn (`chest` +8°), Faust runter (`lowerarm.l` +30°), Halten 20 f. A: Lid-Mikro +0,1.
5. Beat reframe (A): A Hauptpose Wut (Tabelle §3b). Emanata `anger` auf A. B Schreck nach 5 f (Hit_B als Basis, Bestand), dann Sorge.
6. Ende: beide 15 f zurück zu Idle_A. Gesichter 20 f zurück.
- Abstand nie unter 0,8 H (Arme dürfen sich nicht durchdringen).

**Vorlage 3 · Feiern (A, optional Gruppe)**
1. f 0–3: Antizipation, `hips` −0,04 H (Hocke), Oberlid +0,1.
2. f 3: Crossfade 0,08 s auf **Cheering** (1,67 s = 50 f).
3. f 3–8: Stretch 6 % (MD-Grenze). f 8–13: Akzent Gesicht Freude, Emanata `joy`.
4. f 13–25: Halten.
5. f 53: Crossfade 0,3 s auf Idle_A. Settle 8 f, Squash 4 % → 1,0.
- Large-Figuren: Flexing (4,30 s) als Ersatz (Bestand AL: „liest sich als Pose, nicht als Jubel“) oder Cheering per Cross-Rig FIT.

**Vorlage 4 · Überrascht werden (A, Auslöser von der Seite)**
1. f 0: Auslöser (Geräusch, Auto, Landung). A merkt noch nichts.
2. f 4: Augen zum Auslöser (Pupille `wide`). f 6: Kopf folgt. Doppelblick: f 6–10 kurz zurück, f 12 wieder hin.
3. f 12–13: Antizipation 2 f (`hips` −0,03 H).
4. f 14: Crossfade 0,05 s auf **Hit_B** (0,87 s) als Rückprall. Gesicht Schreck. Stretch 6 % f 14–18, Überschwinger f 18–21.
5. f 21–36: Halten. Emanata Schreck-Strahlen (neu) bzw. `sweat`.
6. f 36–51: Erholung zu Idle_A. Gesicht zu Sorge oder Freude, je nach Auslöser.
- Kinetik-Kanal: Ist A Beifahrer oder sieht das Auto, kann `setKinetics({ j: 1 })` den Schreck tragen (Bestand).

**Vorlage 5 · Gruppenreaktion (3–6 NPCs auf ein Ereignis)**
1. Ereignis bei f 0 mit Ort P.
2. Reihenfolge nach Abstand zu P. Erster reagiert f 4, jeder weitere +3–5 f (Welle).
3. Jede Figur spielt Vorlage 4 bzw. 3 mit eigener Variation: Kopfwinkel ±5°, Haltedauer ±6 f, Spiegelung links/rechts zufällig mit festem Seed.
4. Höchstens 2 Figuren mit Emanata gleichzeitig (Budget §3b). Die nächste zu P bekommt sie.
5. Keine zwei Figuren starten im selben Frame (sonst wirkt es mechanisch).
6. Ende gestaffelt rückwärts: die Letzte hört zuerst auf.

### 3e · Ebenen je Figur

Vier Kanäle mit gemeinsamer Uhr (Bestand `ACT` LIVING_DOCUMENT §11): **Körper/Pose**, **Gesicht/Anhängsel**, **Emanata/VFX**, **SFX**. Genau ein Gesichts-Besitzer (Bestand AL Handover §5).

Stapel (Bestand `GH …/70-layering-acting-face-secondary.md`):
1. Basis-Gang bzw. Körperzustand (Travel-Core bzw. Resident-Clip).
2. Oberkörper-Geste mit Knochenmaske (`spine`, `chest`, Arme, `head`); Beine laufen weiter.
3. Blick/Zielen (Augen → Kopf → Brust).
4. Emotion/Haltung additiv.
5. Cartoon-Additiv (Squash, Nachfedern).
6. Kontakt-Korrektur (Füße).
7. Gesicht (Eye-Rig).
Niedrige Ebenen löschen nie Kontakt oder Gameplay-Pose.

---

## 4 · Kampf (später, nicht MVP)

**später, nicht MVP.** Register: Tab-Ziel, Angriff per Maustaste, Fluff abklopfen bzw. abschießen = TBD nach F [V-083]; Plan R1 §2c.

| Art | Bestand | Skizze |
| --- | --- | --- |
| Nahkampf | KayKit CombatMelee 22 Clips (Vollpaket, nicht im Lab); z. B. `Melee_Unarmed_Attack_Punch_A` 1,17 s (AL) | Fluff vom Baum boxen als erster Einsatz; Preset impact (Hitstop 40–95 ms) |
| Fernkampf | CombatRanged 20 Clips; Kenney Blaster Kit 2.1 (CC0, 206 Teile); `weapon-mods.v1.js`; Lab-v4 `WEAPON_HOLDS.md`; Combat Arena v2 | Blaster gegen Fluff; Waffenhaltung je Hand messen, nie raten (AL Handover §3) |
| Magie | KayKit-1.1-Vollpaket: Raise 2,10 · Shoot 0,93 · Spellcasting 0,67 · Spellcasting_Long 2,53 · Summon 4,30 s (`DL/AnimationInventory(1).md`); `Magic Locomotion Pack.zip` (Mixamo, Lizenz ungeklärt) | nur Platzhalter |
| Treffer/Erholung | Hit_A, Hit_B, Lie_StandUp (Bestand) | chill & fun: kein Tod, Erholung mit Puff (MD-Vorschlag) |

---

## 5 · Technischer Vertrag für das Lab (three r186)

**Clip-Namen**
- Quell-Clips behalten ihren Namen (Idle_A, Running_A …). Nie umbenennen (Bestand AL: „Clipname kommt aus dem GLB“).
- KFB-eigene Clips: `kfb_<familie>_<aktion>_<variante>` wie `kfb_interaction_driving_a` (Bestand Motion Library v6).
- Spiel-Code spricht **Rollen**, nicht Clips: `idle`, `walk`, `run`, `sprint`, `jump.start` … (Bestand `locomotion-profiles.v1.js`).
- **MD-Vorschlag** für Acting-Rollen: `act.greet`, `act.argue`, `act.celebrate`, `act.surprise`, `act.group`; Gesichtsrezepte `face.<emotion>` mit den Namen aus §3b; Emanata `ema.<name>` (Pool-Namen aus `ACT/emanata.js`).

**Retargeting**
- Eigenes Rig gewinnt immer. Ein fremder Clip füllt nur eine Lücke (Bestand AL README).
- Medium → Large nur mit **FIT**: Positionsspuren weg, Drehungen bleiben. Roh faltet die Figur (Bestand AL LAB_RETURN, LAB_QA).
- Legacy ohne Fußknochen: Medium-Referenztempo, markiert „Medium-Referenz“ (Bestand `figure.ts`).
- FrizzleBob (47 Knochen): eigene Ohr-Kanäle; Ohr-Acting ist eine eigene Ebene (Bestand `ACT` §04).
- Root Motion: erkennen, berichten, nie still anwenden.

**Figuren nie skalieren [V-060]**
- Kein `root.scale` außer dem vorhandenen J17-Schnitt und nur nach Georgs Antwort auf §7 Frage 1.
- Die Welt passt sich an: Treppen [V-160], Trittsteine [V-157], Sitzhöhe aus der Figuren-Karte.

**Additiv und Ebenen**
- Ein `AnimationMixer` je Figur (Bestand).
- Additive Clips per `THREE.AnimationUtils.makeClipAdditive`, Ebenen über Gewicht; Knochenmasken durch Filtern der Spuren nach Knochennamen.
- Gesicht über Eye-Rig, nicht über Morph-Targets (es gibt keine).
- Eye-Rig-Zugriff nur über öffentliche API (`applyEmote`, `setKinetics`, `setLife`, `eyeFrame`). Der Eye-FX-Adapter aus `ACT` nutzt private Felder und wird nicht 1:1 übernommen (Bestand `ACT` §12).

**Leistungsbudget**
- Liefer-Schranke ≥ 30 fps im sichtbaren Fenster [V-115].
- Gemessen: Travel-Update 0,2 ms, Kamera 0,1 ms je Frame; die Kosten liegen in den Pixeln (Bestand `critic/lab-stage2/2026-10-10_09`).
- **MD-Vorschlag** Stufen nach Abstand zur Kamera:

| Stufe | Abstand | Mixer | Augen | Emanata |
| --- | --- | --- | --- | --- |
| nah | ≤ 4 MC | jedes Frame | voll | ja |
| mittel | ≤ 12 MC | jedes 2. Frame | nur Blinzeln | nein |
| fern | > 12 MC | jedes 4. Frame bzw. eingefroren | aus | nein |

- Höchstens 8 Figuren in „nah“ (MD-Vorschlag). Clip-Sets je Rig einmal laden (Bestand `rigClips`).

**Prüfung**
- Parity vor jeder Lieferung; Fußtests ≥ 50 fps [V-159]; Sim-Zeit [V-107].
- Keine Messwerte im Spiel, nur `?debug=1` [V-041]. Arbeitsstände hinter URL-Schalter [V-166].
- Sperrliste Lab-src beachten (`src/main.ts`, `src/play/travel.ts` … nur Bau-Sitzung; START_HERE_STEERING).

---

## 6 · Demo-Plan (erst nach Georgs Okay, je hinter URL-Schalter)

Alle Demos laufen auf der Demo-Insel bzw. dem Hub, nie im RKIT-Test-Hub [V-014]. Besetzung nur mit Figuren der Gruppe A (Augen PASS: mummy_a, mummy_b, orcbrute, witch) bzw. MVP-Bewohnern mit Karte. Standardansicht bleibt unverändert [V-166].

**D1 · `?motion=loco` Gang-Parcours**
- Inhalt: Stand → Gehen → Joggen → Sprint → Sprung → Weitsprung → Treppe 0,30/1,3 → Stopp. Autopilot, Standbild-Serie + Messtabelle.
- PASS: Gangtempo = `gait_v157.json` ± 3 %; Fußgleiten ≤ 0,02 H je Schritt; Treppe ohne Hüpfer; Überblendzeiten wie §2c; ≥ 50 fps.
- TUNE: Werte stimmen, aber ein Übergang ruckt sichtbar (Georgs Auge).
- FAIL: ein Gang gleitet oder ein Test lief unter 50 fps.

**D2 · `?motion=greet` Begrüßung (Vorlage 1)**
- Inhalt: zwei Figuren, drei Varianten nach Reaktionsstufe.
- PASS: Blick vor Kopf vor Brust sichtbar; Winken ohne Armbruch (Gelenkgrenzen, SPEC_CHARACTER_INTEGRITY §3); Augen schielen nicht; Georg liest „Freude“ aus der Spielkamera.
- TUNE: lesbar, aber Timing zu schnell oder zu langsam.
- FAIL: Gruß nicht lesbar aus der Spielkamera.

**D3 · `?motion=react` Überraschung + Gruppenreaktion (Vorlagen 4, 5)**
- Inhalt: Auto landet neben 3–5 Figuren; Welle der Reaktionen.
- PASS: keine zwei Starts im selben Frame; ≤ 2 Emanata gleichzeitig; Erholung zurück in Idle ohne Sprung; ≥ 30 fps [V-115].
- TUNE: Welle lesbar, Emanata zu groß bzw. zu klein.
- FAIL: wirkt mechanisch (alle gleich) oder fps unter Schranke.

**D4 · `?motion=faces` Emotions-Kontaktbogen**
- Inhalt: acht Emotionen aus §3b auf 4 Figuren der Gruppe A, Spielkamera und nah, Standbilder.
- PASS: Georg erkennt jede Emotion ohne Beschriftung in mindestens 6 von 8 Fällen; Lider decken die Augen sauber.
- TUNE: Werte müssen je Figur angepasst werden.
- FAIL: Gesichtswerte vom FrizzleBob passen auf KayKit nicht.

**D5 · `?motion=argue` Streit im Triplet-Takt (Vorlage 2)** – nur, wenn ChatterBox ein freigegebenes Triplet liefert.
- PASS: Gesten sitzen auf den drei Beats; Zuhörer reagiert 4–6 f nach dem Beat; keine Durchdringung.
- TUNE: Takt stimmt, Posen zu schwach.
- FAIL: Gesten laufen gegen die Beats.

---

## 7 · Offene Fragen an Georg

1. **Squash an Figuren:** Ist vorübergehender, volumenerhaltender Squash (≤ 8 %, zurück auf 1,0) mit [V-060] vereinbar? Oder bleibt jede Verformung in Knochen-Posen ohne Scale?
2. **Emanata-Stil:** 2D-Tuschestrich wie im Acting Lab oder flache Knet-Plättchen im Claymation-Look?
3. **Gesicht im MVP:** Reichen Augen und Lider für das MVP-Acting, oder sollen Brauen (brow-rig.v2) schon vor Phase H ins Lab?
4. **Hop [V-031]:** Bleibt der Hop bei „30 %“, oder soll D-Schritt Nachfedern nach [V-033] schon jetzt kommen?
5. **Strafe und Rückwärts:** MovementAdvanced aus dem KayKit-Vollpaket nachladen, damit Q/E einen eigenen Clip haben?
6. **Emotion beim Sprechen:** Triplets haben kein Emotions-Feld; der Affekt kommt vom Sprecher. Wer besitzt die Abbildung Affekt-ID → Acting-Rezept → Ruhemund (Tabelle §3c): ChatterBox, Voice Layer oder Figuren-Karte?
7. **„Kulturmechanik“:** Was ist damit gemeint? Nicht gefunden in `LAB/docs`, `KFB_HUB` und ChatterBox. Sind es die sozialen Operatoren (BINGO/BOGGLE/BONGO/BLÖDSINN), die sechs Reaktionsstufen oder die Gatekeeper-Grammatik?
8. **Large-Figuren:** Cross-Rig FIT für Sitzen, Winken, Jubeln testen, oder bleiben Large-NPCs bei Idle/Flexing?
9. **Flug:** Gilt das 400-ms-Fenster für die zweite Leertaste aus dem Convergence-Brief („human-accepted“) auch für [V-024]? Dann bitte mit V-Nummer eintragen.
10. **Beifahrer:** Gibt es im MVP Mitfahrer, oder erst mit dem Cabrio?
11. **Mixamo-Clips:** 365 auf KayKit retargetete FBX liegen in Downloads (Sprechen, Emotionen, Ein-/Aussteigen, Tänze). Lizenz klären und als KFB Motion Library nutzen, oder weglassen?
12. **Kenney Emotes:** Dürfen die Kenney-Emotes (CC0) als Formvorlage für Emanata dienen, obwohl Kenney in der Reihenfolge zuletzt steht [V-070]?
13. **Timing-Rahmen:** Gilt der 3,6-s-Rahmen aus dem Acting Lab als Prüfrahmen, mit verkürzten Spielszenen nach §3b?
14. **Demo-Reihenfolge:** Welche Demos zuerst? Vorschlag D1 → D4 → D2 → D3, D5 erst mit Triplet.

---

## 8 · Quellen

- Register: `30_DECISIONS/DECISIONS.md` (V-020–V-033, V-053, V-060–V-062, V-083, V-085–V-090, V-115, V-126, V-157–V-160, V-166, V-177); `STYLE_GUIDE_3D_R1.md` (Format, §8 Lesbarkeit).
- Lab-Code: `LAB/src/play/travel.ts`, `figure.ts`, `car-hop.ts`, `seat.ts`, `vendor/travel-core.j17.js`, `vendor/locomotion-profiles.v1.js`, `vendor/walk-controller.js`, `vendor/clay-particle-profiles.v1.json`; `LAB/src/residents/pet-eye-rig.v6.js`, `anchored-eyes.v1.js`, `figure-b2.ts`, `resident.ts`; `LAB/src/island/spec.ts` (ResidentSpec).
- Lab-Daten: `LAB/public/assets/kaykit/anims/*.glb`, `kfb-motion/KFB_Motion_interaction_i06.glb`, `figures-b2/catalog.json`, `public/cards/farmer_a.card.json`.
- Messungen: `LAB/docs/critic/lab-track/2026-10-11_V157-gait/gait_v157.json`, `…_V157-stairs/`; `LAB/docs/critic/lab-stage2/2026-10-10_08`, `_09`.
- Lab-Docs: `SCALE_CONTRACT_K2.md`, `SPEC_CHARACTER_INTEGRITY_R1.md`, `KFB_WORLDBUILDER_PLAN_R1.md` (B2, H, §2c), `MVP1_DONOR_AND_MODEL_MAP_R1.md`, `REVIEW_POSTMVP_CONCEPTS_ARCH_FIT_R1.md`, `ACCEPTANCE_INDEX.md`.
- RKIT: `30_DECISIONS/replies/RKIT_TRAIL_R1.md`, `RKIT_TRAIL_VORLAGE_R1.md`; CHANGELOG (Hüfthöhe).
- Animation Lab: `AL/README.md`, `MISSING_ANIMATIONS.md`, `HANDOVER_LAB_v4_COMBAT.md`, `LAB_QA.md`, `LAB_RETURN.md`.
- Acting Lab: `ACT/LIVING_DOCUMENT.md`, `START_HERE.md`, `score.js`, `face-score.js`, `emanata.js`, `acting.js`.
- Methode: `GH skills/kfb-cartoon-animation/` (SKILL.md, references 10, 30, 70, 76).
- Flug: `KFB HUD Flight Board - Flight VFX/KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/hud-flight/kfb-flight-vfx.js` (`hoverPose`: 0,55 Hz, y ±0,12, pitch 0,05, roll 0,06, Bein 0,22; `FLIGHT_IDLE` 0,14).
- ChatterBox: Memory `kfb-chatterbox-triplets.md`; `~/Dropbox/CLAUDE/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/` (`lib/triplet-stage/donor/resident-chat-ensemble-data.mjs`, `lib/chatterbox/stage3d.js`, `docs/chatterbox-studio/SPEC_COMPONENTS.md`); `VOICE_LAYER_INTEGRATION_CONTRACT.md` v1 (in `KFB_HUB/30_PACKAGES/2026-10-10_mvp1-parallel/B_chat_mvp1-dialog.zip`).
- Bubbles und 2D-Motion: `~/Dropbox/CLAUDE/KFB VoxelWorld/KFB Overworld v13-WS0/overworld-v13_2026-08-12/` (`bubble-layout.js`, `cartoon-motion-2d.js`).
- ToolBox-Gesicht: `~/Dropbox/CLAUDE/KFB ToolBox Studio Rig Anim/KFB ToolBox Stage v1/KFB-ToolBox/stage-first/` (RETURN_STAGE_FIRST_P0, `pet-mouth.v1.js`, `brow-rig.v2.js`, `pose-rig.v1.js`).
- Downloads: `KFB Animation + Flight + Travel Concept v1/`, `3D Cartoon-Animation Library erstellen.zip`, `AnimationInventory(1).md`, `RigCompatibility(1).json`, `09_CHARACTER_RIG.md`, `BRIEFING_ANIMATION_LAB_Wissens-Pilli_v0.1.md`, `KFB Cartoon Motion Matrix v1.md`, `Browser-Based 3D Cartoon Animation v1.md`, `KFB_TRAVEL_GLOBE_CONVERGENCE_01_CLAUDE_DESIGN_BRIEF_2026-09-29.md`, `kenney_emotes-pack.zip`.
