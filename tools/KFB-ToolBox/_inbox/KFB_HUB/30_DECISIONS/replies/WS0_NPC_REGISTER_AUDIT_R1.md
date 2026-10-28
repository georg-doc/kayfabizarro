# WS0 · NPC-Register-Audit R1 (Mikro-Szenen)

Stand 28.10.2026 · WS-NPC · Branch `game/npc-scenes-probe-r1` (Worktree `~/kfb-ws0/npc-scenes`, Basis `game/proc-world-ws0` @c15b4de). Nur gelesen, kein Code geändert für diesen Teil.

Quellen: `src/data/characters/registry.r1.json` (132 Figuren), `src/data/npc/residents.r1.json`, `src/npc/*`, `src/actors/*` (stageCast, privateCast, discoCast, botCast), `src/assets/actors/*`, `src/private` (nur Namen), Hub-Register `30_DECISIONS/CHARACTERS_R1/` (index.json, GAPS.md). Clip-Listen direkt aus den GLB-Dateien gelesen (433 Dateien).

## Kurz

- **132 Figuren** im Register. **38 spielbar** heute (Modell + Augen-Weg + Clips im Spiel verdrahtet). Davon 16 Fluffer-Würfel, Spielfigur FrizzleBob und Partnerin GothGirl. **20 menschenähnliche NPCs** bleiben.
- Von den 20 NPCs gehen **10 nur mit `src/private`** (Disco-Körper K12, Ork-Band, Bots B17). Ohne private Dateien: 10 (Lorekeeper, Farmer B, Barbarian, Mage, Rogue Hooded, 4 Skelette, Spielzeugsoldat).
- **9 Modelle da, aber nicht verdrahtet** (Agenten B40, HeroMan, Mech, Lady Dory, Lord Hunky, Monstrosity, Rogue-Proof). **37 nur in den kayfabizarro-Medien** (KayKit-Original, ladbar wie die Disco-Requisiten, aber ohne KFB-Augenprofil). **48 fehlen ganz** (23 Tiere, Eigen-Rigs aus dem Hub, Requisiten-Figuren).
- **Aktivitäten:** idle, walk, sit, cheer, dance gehen für alle Rig_Medium-Figuren. **read** nur Lorekeeper (privat). **tend** nur Farmer B und Lorekeeper (privat). **carry/push** nur Lorekeeper (privat) und Bots. **fish** gibt es nicht. **talk/gossip** hat keinen eigenen Clip (Ersatz: Waving, Interact, Idle_B).
- **Requisiten:** Im Spiel-Repo selbst liegen fast keine Szenen-Requisiten. Zelt, Feuer, Kessel, Tränke, Tisch, Bank, Bücher, Fässer, Kisten, Radio liegen am **kayfabizarro-Pin c746a956** (den die Disco schon nutzt) und laden zur Laufzeit. **Fehlen:** Lesepult, Angel, Werkbank (KayKit-Stil), Lagerfeuer-Flamme.

Legende Status: **spielbar** = Darsteller-Weg da (Rezept, Augenprofil oder Anker, Clips). **privat** = nur mit `src/private` beim Bauen. **Modell da** = GLB im Spiel oder privat, aber kein Darsteller-Weg. **nur Pin** = Modell nur in `kayfabizarro/media/3D_Assets` (KayKit Mystery Series 6, Adventurers 2.0, Skeletons), Augenprofil fehlt. **fehlt** = kein Modell erreichbar.

Fußnoten: ¹ dance = Motion Library Rig_Medium (33 Clips, Pin c746a956, sha256 08b76780…, zur Laufzeit von GitHub). ² talk = kein Sprech-Clip; Ersatz Waving (Simulation), Interact, Idle_B.

## Clip-Sätze im Spiel (Rig_Medium, KayKit as-is)

| Satz | Datei | Clips (Auswahl) |
|---|---|---|
| General | `src/assets/actors/Rig_Medium_General.glb` | Idle_A, Idle_B, Interact, PickUp, Use_Item, Throw, Hit, Death, Spawn |
| MovementBasic | `src/assets/actors/Rig_Medium_MovementBasic.glb` | Walking_A/B/C, Running_A/B, Jump_* |
| MovementAdvanced | `src/assets/actors/Rig_Medium_MovementAdvanced.glb` | Sneaking, Crouching, Crawling, Dodge_*, Strafe, Walking_Backwards |
| Simulation | `src/assets/actors/Rig_Medium_Simulation.glb` | **Sit_Chair_Idle, Sit_Floor_Idle**, Lie_Idle, **Cheering**, **Waving**, Push_Ups, Sit_Ups |
| Special | `src/assets/actors/Rig_Medium_Special.glb` | Skeletons_* (Awaken, Taunt, Walking, Death) |
| CombatRanged | `src/assets/actors/Rig_Medium_CombatRanged.glb` | Ranged_1H/2H/Bow/Magic_* |
| Motion Library (Pin) | `MOTION_LIBRARY_URL` in `src/actors/discoCast.js` | kfb_dance_* (10), kfb_idle_* (sad, happy, laughing, kneeling …), kfb_music_drums/guitar, kfb_climb_* |
| K11 Lorekeeper (privat) | `src/private/50_BLENDER/K11/_privat_kauf_asset/KFB_Lorekeeper.k11b.glb` | kfb_npc_read_page_turn_a, Holding_B/C, kfb_work_push_a, push_heavy, holding_walk, jogging_with_box, Digging, Pickaxing, Hammering, wheelbarrow_walk, sad_walk |
| K11 Farmer (privat) | `…/K11/_privat_kauf_asset/KFB_Farmer_harke.k11.glb` | Digging, Dig, Working_A–C, Chopping, Hammering, Holding_A–C, wheelbarrow_walk, Cheering, Waving |
| N26 J5 Soldat (privat) | `…/N26/_privat_kauf_asset/J5_soldier_march.carrier.glb` | kfb_locomotion_strut_walking_a (Marsch), Gewehr-Clips |
| B17 Bots (privat) | `…/B17/_privat_kauf_asset/KayfabrickBot_*.r1.glb` | kfb_bot_carry_a, **kfb_bot_sisyphus_a**, kfb_bot_angry_a |
| Rig_Large | – | **Kein Rig_Large-Clipsatz im Spiel.** Nur die Motion Library Rig_Large liegt am Pin (nicht eingebunden). |

## Figuren-Tabelle (alle 132)

| ID | Art | Modell im Spiel | Rig | Varianten | Aktivitäten (Clips) | Requisite | Status |
|---|---|---|---|---|---|---|---|
| `4gtn_ceo` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `4gtn_forgotten` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `action_figure` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `adventurer_barbarian` | kit_character | `src/assets/actors/cast/Barbarian.glb` | Medium | 1 | idle, walk, sit, dance¹, cheer, talk², patrol | – | spielbar (öffentlich) |
| `adventurer_knight` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `adventurer_mage` | kit_character | `src/assets/actors/cast/Mage.glb` | Medium | 1 | idle, walk, sit, dance¹, cheer, talk², patrol | – | spielbar (öffentlich) |
| `adventurer_ranger` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `adventurer_rogue` | kit_character | `src/private/50_BLENDER/K10/…/K10_rogue_*.proof.glb` | Medium | 4 Texturen | idle, Bogen, Wurf, kfb_camp_count_a | Bogen K10 | Modell da (Proof, kein Darsteller-Pfad) |
| `adventurer_rogue_hooded` | kit_character | `src/assets/actors/Rogue_Hooded.glb` | Medium | 1 | idle, walk, sit, dance¹, cheer, talk², patrol | – | spielbar (F1-Prüffigur) |
| `agent` | custom_rig | `src/private/50_BLENDER/B40/…/agents/AG*.glb` | Large (41) | 8 (Glatze, Brille) | Blaster-Kampf, idle | Blaster B40 | Modell da (kein Darsteller-Pfad) |
| `agent_large` | custom_rig | `src/private/50_BLENDER/B40/…/agents/AGL*.glb` | Medium (23) | 4 | Blaster-Kampf, walk_blaster | Blaster B40 | Modell da (kein Darsteller-Pfad) |
| `animal_beaver` | pet | – | – | – | – | – | fehlt |
| `animal_bee` | pet | – | – | – | – | – | fehlt |
| `animal_cat` | pet | – | – | – | – | – | fehlt |
| `animal_caterpillar` | pet | – | – | – | – | – | fehlt |
| `animal_chick` | pet | – | – | – | – | – | fehlt |
| `animal_cow` | pet | – | – | – | – | – | fehlt |
| `animal_crab` | pet | – | – | – | – | – | fehlt |
| `animal_deer` | pet | – | – | – | – | – | fehlt |
| `animal_dog` | pet | – | – | – | – | – | fehlt |
| `animal_elephant` | pet | – | – | – | – | – | fehlt |
| `animal_fish` | pet | – | – | – | – | – | fehlt |
| `animal_fox` | pet | – | – | – | – | – | fehlt |
| `animal_giraffe` | pet | – | – | – | – | – | fehlt |
| `animal_hog` | pet | – | – | – | – | – | fehlt |
| `animal_koala` | pet | – | – | – | – | – | fehlt |
| `animal_lion` | pet | – | – | – | – | – | fehlt |
| `animal_monkey` | pet | – | – | – | – | – | fehlt |
| `animal_panda` | pet | – | – | – | – | – | fehlt |
| `animal_parrot` | pet | – | – | – | – | – | fehlt |
| `animal_penguin` | pet | – | – | – | – | – | fehlt |
| `animal_pig` | pet | – | – | – | – | – | fehlt |
| `animal_polar` | pet | – | – | – | – | – | fehlt |
| `animal_tiger` | pet | – | – | – | – | – | fehlt |
| `animatronic_creepy` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `animatronic_normal` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `astronaut_barbarathebee` | kit_character | – | – | – | – | – | fehlt (Blender-Daten im Hub: B50) |
| `astronaut_fernandotheflamingo` | kit_character | – | – | – | – | – | fehlt (Blender-Daten im Hub: B50) |
| `astronaut_finnthefrog` | kit_character | – | – | – | – | – | fehlt (Blender-Daten im Hub: B50) |
| `astronaut_raetheredpanda` | kit_character | – | – | – | – | – | fehlt (Blender-Daten im Hub: B50) |
| `avian_swordsman` | kit_character | `src/private/50_BLENDER/B50/disco/…/KFB_Disco_avian.src.glb` | Medium | 1 | idle, walk, sit, dance (chicken, locking, step, wave), cheer | – | spielbar (privat, Disco) |
| `black_knight` | kit_character | `src/private/50_BLENDER/B50/disco/…/KFB_Disco_knight.src.glb` + K13 carrier | Medium (24) | 2 | idle, walk, dance, Nahkampf (K13) | Schild, Schwert K13 | spielbar (privat, Augen PROOF) |
| `brain_cyborg` | custom_rig | – | – | – | – | – | fehlt (Blender-Daten im Hub: B10) |
| `brick_fish` | custom_rig | – | – | – | – | – | fehlt (Blender-Daten im Hub: B41) |
| `caveman` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | Lagerfeuer, Axt, Keule, Speer (Pin) | nur Pin (Modell ladbar, kein Augenprofil) |
| `chief_warden` | custom_rig | – | – | – | – | – | fehlt (Blender-Daten im Hub: B47) |
| `clanker` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `cleric` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `clown` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | Hammer K13 (privat) | nur Pin (Modell ladbar, kein Augenprofil) |
| `combat_mech` | kit_character | `src/private/50_BLENDER/K10/…/K10_mech_side_frozen.v2.proof.glb` | Medium | 1 | Gewehr-Kampf | Minigun K10 | Modell da (Proof) |
| `demon_lord` | kit_character | `src/private/50_BLENDER/B50/disco/…/KFB_Disco_demon.src.glb` + K13 carrier | Medium | 2 | idle, walk, dance, Nahkampf (K13) | – | spielbar (privat, Augen PROOF) |
| `driver` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `eraser` | prop_character | – | – | – | – | – | fehlt (Blender-Daten im Hub: B46) |
| `farmer_a` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `farmer_b` | kit_character | `src/assets/actors/cast/Farmer_B.glb` + `src/private/50_BLENDER/K11/…/KFB_Farmer_harke.k11.glb` | Medium | 1 (Textur B) | idle, walk, sit, **tend** (Digging, Working_A–C, Chopping), carry (wheelbarrow_walk, Holding_A–C), cheer, Waving, dance¹ | Mistgabel K11 (Halterung) | spielbar (Werkzeug-Clips nur privat) |
| `farmer_daumen` | custom_rig | – | – | – | – | – | fehlt (Blender-Daten im Hub: B44) |
| `farmer_hut` | custom_rig | – | – | – | – | – | fehlt (Blender-Daten im Hub: B44) |
| `farmer_karre` | custom_rig | – | – | – | – | – | fehlt (Blender-Daten im Hub: B44) |
| `flyer_bat` | custom_rig | – | – | – | – | – | fehlt (Blender-Daten im Hub: B47) |
| `flyer_raven` | custom_rig | – | – | – | – | – | fehlt (Blender-Daten im Hub: B47) |
| `frizzlebob` | hero | `src/assets/actors/FB_TEMPLATE_LOOK_v5b.glb` (+ privat FB_CANON, J3 MC, J7 Dach) | Medium + Ohren (47 Knochen) | 1 (Georgs Look) | idle, walk, sit, cheer, dance (J3 MC + ML), Kampf | Waffen K10 | spielbar (Spielfigur, Disco-MC) |
| `frost_golem` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | Axt K13 (privat) | nur Pin (Modell ladbar, kein Augenprofil) |
| `gothgirl` | hero | `src/assets/actors/cast/GothGirl.glb` | Medium | 1 | idle, walk, sit, dance¹, cheer, talk² | Lautsprecher (Pin) | spielbar (Partnerin) |
| `helper_a` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `helper_b` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `hero_man` | kit_character | `src/private/50_BLENDER/B50/…/KFB_HeroMan_blue.r1.glb` (+ K10 Proof) | Medium | 1 (blau) | Blaster-Kampf, Tod | Blaster K10 | Modell da (nur Waffe im Spiel) |
| `hiker` | kit_character | – (nur kayfabizarro-Medien, am Pin geprüft) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | Zelt, Flasche (Pin) | nur Pin (Modell ladbar, kein Augenprofil) |
| `hoarder` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `kaeptn_kayfa_bizarro` | custom_rig | – | – | – | – | – | fehlt (Blender-Daten im Hub: B42, B45) |
| `kayfabrick_bot` | custom_rig | `src/private/50_BLENDER/B17/…/KayfabrickBot_<farbe>[_helm].r1.glb` | Medium | 6 Farben × mit/ohne Helm | idle, walk = **carry** (kfb_bot_carry_a), **push** (kfb_bot_sisyphus_a), angry run | Block je Farbe, Station | spielbar (privat, Augen PROOF) |
| `kayfabrick_bot_one` | custom_rig | – | – | – | – | – | fehlt (Blender-Daten im Hub: B31) |
| `kayfabrick_bot_two` | custom_rig | – | – | – | – | – | fehlt (Blender-Daten im Hub: B31) |
| `king_kayfabian` | custom_rig | – | – | – | – | – | fehlt (Blender-Daten im Hub: B45) |
| `lady_dory` | hero | `src/private/50_BLENDER/B34/…/LadyDory_RigMedium…treading.glb` | Medium (28) | 1 | kfb_idle_treading_water_a | – | Modell da (Karte im Spiel, kein NPC-Pfad) |
| `lord_hunky` | hero | `src/private/50_BLENDER/B34/…/LordHunky…treading.glb` + J7 | Medium (27) | 1 | treading water, Dach-Fahrt (J7) | – | Modell da (Karte im Spiel, kein NPC-Pfad) |
| `lorekeeper` | kit_character | `src/assets/actors/cast/Lorekeeper.glb` + `src/private/50_BLENDER/K11/…/KFB_Lorekeeper.k11b.glb` | Medium | 1 | idle, walk, sit, **read** (kfb_npc_read_page_turn_a), tend (Digging, Pickaxing), carry/push (kfb_work_push_a, holding_walk), dance¹, cheer, talk² | Buch K11 (CC0, Halterung); Pult fehlt | spielbar (Lese-Clip nur privat) |
| `magical_girl` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `man_in_black` | custom_rig | – | – | – | – | – | fehlt (Blender-Daten im Hub: B12) |
| `mannequin_medium` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin? (nicht geprüft) |
| `marksman` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `monster` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `monstrosity` | kit_character | `src/private/50_BLENDER/N32/…/src/fist_monstrosity/Monstrosity.glb` | Medium | 1 | keine | – | Modell da (nur HUD-Faust) |
| `mummy_a` | kit_character | – (nur kayfabizarro-Medien) | Medium? | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin? (nicht geprüft) |
| `mummy_b` | kit_character | – (nur kayfabizarro-Medien) | Medium? | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin? (nicht geprüft) |
| `ninja` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `norman` | prop_character | – | – | – | – | – | fehlt |
| `orc_brute` | hero | `src/private/50_BLENDER/ORKBAND/…/KFB_Band_Drummer.r1.glb` (+ B40, K13) | Medium | 3 | idle, walk (eigene), Trommel, Boxen/Fallen (K13) | Kriegstrommel (Band) | spielbar (privat, Band) |
| `orc_legacy_a` | kit_character | `src/private/50_BLENDER/ORKBAND/…/KFB_Band_Trumpeter.r1.glb` | eigenes Rig (8 Knochen) | 1 | Idle, trumpet_set, trumpet_groove | Trompete | spielbar (privat, Band; kein Gehen) |
| `orc_legacy_b` | kit_character | `src/private/50_BLENDER/ORKBAND/…/KFB_Band_Leader.r1.glb` | eigenes Rig (8 Knochen) | 1 | Idle, bounce | Mikro | spielbar (privat, Band; kein Gehen) |
| `orc_raider` | kit_character | `src/private/50_BLENDER/ORKBAND/…/KFB_Band_Guitarist.r1.glb` (+ K13) | Medium | 2 | idle, walk (eigene), strum, Kampf (K13) | Gitarre (Band) | spielbar (privat, Band) |
| `paladin` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `pencil` | prop_character | – | – | – | – | – | fehlt (Blender-Daten im Hub: B46) |
| `pet_chick` | cube_pet | – | – | – | – | – | fehlt (Blender-Daten im Hub: B44) |
| `pet_cow` | cube_pet | – | – | – | – | – | fehlt (Blender-Daten im Hub: B44) |
| `pet_pig` | cube_pet | – | – | – | – | – | fehlt (Blender-Daten im Hub: B44) |
| `plant_warrior` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `protagonist_a` | kit_character | `src/private/50_BLENDER/B50/disco/…/KFB_Disco_teen.src.glb` | Medium | 1 | idle, walk, sit, dance (house_b, slide), cheer | – | spielbar (privat, Disco) |
| `protagonist_b` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `prototype_pete` | npc | – | – | – | – | – | fehlt |
| `q_alien` | cube_pet | `src/assets/fluffer/k15/KFB_Alien_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer K15) |
| `q_alien_tall` | cube_pet | `src/assets/fluffer/k15/KFB_Alien_Tall_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer K15) |
| `q_cactus` | plant | `src/assets/fluffer/k15/KFB_Cactus_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer K15) |
| `q_chicken` | cube_pet | `src/assets/fluffer/k15/KFB_Chicken_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer K15) |
| `q_crab` | cube_pet | `src/assets/fluffer/k15/KFB_Crab_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer K15) |
| `q_cyclops` | cube_pet | `src/assets/fluffer/k15/KFB_Cyclops_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer K15) |
| `q_deer` | cube_pet | `src/assets/fluffer/k15/KFB_Deer_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer K15) |
| `q_demon` | cube_pet | `src/assets/fluffer/k15/KFB_Demon_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer K15) |
| `q_ghost` | cube_pet | `src/assets/fluffer/KFB_Ghost_healed.k11c.glb` | Würfel-Rig (7) | 2 (dunkel, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer) |
| `q_greendemon` | cube_pet | `src/assets/fluffer/k15/KFB_GreenDemon_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer K15) |
| `q_mushroom` | plant | `src/assets/fluffer/k15/KFB_Mushroom_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer K15) |
| `q_panda` | cube_pet | `src/assets/fluffer/k15/KFB_Panda_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer K15) |
| `q_penguin` | cube_pet | `src/assets/fluffer/k15/KFB_Penguin_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer K15) |
| `q_pig` | cube_pet | `src/assets/fluffer/k15/KFB_Pig_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer K15) |
| `q_tree` | plant | `src/assets/fluffer/k15/KFB_Tree_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No | Obstbaum | spielbar (Dark Fluffer K15) |
| `q_yeti` | cube_pet | `src/assets/fluffer/k15/KFB_Yeti_healed.k11c.glb` | Würfel-Rig | 2 (dunkel privat, geheilt) | Idle, Walk, Dance, Jump, Bite, Yes/No, Death | Obstbaum | spielbar (Dark Fluffer K15) |
| `robot_one` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `robot_two` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `skeleton_mage` | kit_character | `src/assets/actors/cast/Skeleton_Mage.glb` | Medium | 1 | idle, walk, sit, dance¹, cheer, talk², patrol, Skelett-Clips, Magie (CombatRanged) | Stab K10 (privat) | spielbar (Patrouille) |
| `skeleton_minion` | kit_character | `src/assets/actors/cast/Skeleton_Minion.glb` + Disco K12 | Medium | 2 (öffentlich, Disco) | idle, walk, sit, dance¹, cheer, talk², patrol, dance (K12) | – | spielbar |
| `skeleton_rogue` | kit_character | `src/assets/actors/cast/Skeleton_Rogue.glb` | Medium | 1 | idle, walk, sit, dance¹, cheer, talk², patrol, Skelett-Clips | – | spielbar (Patrouille) |
| `skeleton_warrior` | kit_character | `src/assets/actors/cast/Skeleton_Warrior.glb` | Medium | 1 | idle, walk, sit, dance¹, cheer, talk², patrol, Skelett-Clips (Special) | Klinge K10 (privat) | spielbar (Patrouille) |
| `space_ranger` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `suit_ct` | custom_rig | `src/private/50_BLENDER/B40/…/agents/Suit_CT_*.b40.glb` | Large (41) | 4 | keine (Proof: Idle) | – | Modell da (ohne Clips) |
| `superhero` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `survivalist` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | Rucksack, Schilde, Hydrant (Pin) | nur Pin (Modell ladbar, kein Augenprofil) |
| `tiefling` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `toy_soldier` | faction_unit | `src/assets/actors/cast/ToySoldier.glb` + privat N15, N26 J5, K12 | Medium | 2 (öffentlich, Disco) | idle, walk, sit, dance¹, cheer, talk², patrol, Marsch (kfb_locomotion_strut_walking_a, privat), Gewehr, KO/Aufstehen (N15) | Geschenk-Box (Repo) | spielbar (Trupp, Disco) |
| `toy_soldier_cop` | custom_rig | – | – | – | – | – | fehlt (Blender-Daten im Hub: B11) |
| `vampire` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `werewolf_man` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `werewolf_wolf` | kit_character | – (nur kayfabizarro-Medien) | Medium (KayKit) | laut Pack | würde Rig_Medium-Sätze nutzen (idle, walk, sit, dance¹, cheer, talk², patrol) | – | nur Pin (Modell ladbar, kein Augenprofil) |
| `witch` | kit_character | `src/private/50_BLENDER/B50/disco/…/KFB_Disco_witch.src.glb` | Medium | 1 | idle, walk, sit, dance (samba, house, wave), cheer, talk² | Kessel, Tränke, Tisch, Korb, Besen (Pin, Witch-Pack) | spielbar (privat, Disco-Körper) |

## Aktivitäts-Matrix (wer kann was heute im Spiel)

✓ = Clip vorhanden und verdrahtbar · P = nur mit `src/private` · ~ = Ersatz-Clip · – = nein. Spalten nur für die 20 NPC-Menschen plus Würfel.

| Aktivität | Lorekeeper | Farmer B | Barbarian, Mage, Rogue H. | Skelette (4) | Spielzeugsoldat | Hexe, Avian, Teen (K12) | Ritter, Dämon (K12) | Ork-Band (4) | Bots (B17) | Fluffer (16) |
|---|---|---|---|---|---|---|---|---|---|---|
| idle | ✓ | ✓ | ✓ | ✓ | ✓ | P | P | P | P | ✓ |
| walk | ✓ | ✓ | ✓ | ✓ | ✓ (Marsch P) | P | P | P (Brute, Raider) | P (= Tragen) | ✓ |
| sit | ✓ | ✓ | ✓ | ✓ | ✓ | P | P | – | – | – |
| read/study | P | – | ~ (Buch + Sitzen, Probe) | – | – | – | – | – | – | – |
| fish | – | – | – | – | – | – | – | – | – | – |
| dance | ✓¹ | ✓¹ | ✓¹ | ✓¹ | ✓¹ | P | P | – | – | ✓ (Dance) |
| tend/farm | P | P | ~ (Interact, PickUp) | – | – | ~ | – | – | – | – |
| patrol | ✓ | ✓ | ✓ | ✓ (groupLife) | ✓ (groupLife) | P | P | – | P (bot_crew) | ✓ (Route am Baum) |
| carry/push | P | P (Schubkarre) | – | – | – | – | – | – | P (Block, Sisyphos) | – |
| talk/gossip | ~² | ~² | ~² | ~ (Taunt) | ~² | ~² | ~² | ~ (Musik) | – | ~ (Yes/No) |
| cheer | ✓ | ✓ | ✓ | ~ (Taunt) | ✓ | P | P | – | – | ~ (Jump) |
| musizieren | – | – | – | – | – | – | – | P | – | – |

Abdeckung (Aktivität hat mindestens eine öffentliche Figur): idle, walk, sit, dance, patrol, cheer = ja. read, tend, carry/push = nur privat. talk = nur Ersatz. fish = nein.

## Requisiten für Mikro-Szenen

Pin = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/c746a9567e0ea20a24b8969fe9130ac0756e7a7e/media/3D_Assets/` (derselbe Pin wie `DISCO_OPTS.propsBase`; alle Zeilen per HEAD am 28.10. mit 200 geprüft).

| Requisite | Datei | Ort | Hinweis |
|---|---|---|---|
| Zelt | `KayKit_Mystery_Series6/11 - May 2025 - Hiker/assets/gltf/Tent.gltf` | Pin | Hiker-Pack |
| Wasserflasche | `…/11 - May 2025 - Hiker/assets/gltf/Waterbottle.gltf` | Pin | |
| Lagerfeuer | `…/8 - February 2025 - Caveman/assets/gltf/Campfire_Base.gltf`, `Campfire_Logs.gltf` | Pin | ohne Flamme |
| Kessel | `…/5 - November 2024 - Witch/assets/gltf/Cauldron.gltf` | Pin | |
| Tränke-Regal | `…/Witch/assets/gltf/Potionstation_decorated.gltf` (auch ohne Deko) | Pin | |
| kleiner Tisch | `…/Witch/assets/gltf/Table_Small.gltf` | Pin | |
| Korb, Pilze, Besen, Mörser | `…/Witch/assets/gltf/Basket_Mushrooms.gltf`, `Broom.gltf`, `Mortar.gltf`, `Pestle.gltf` | Pin | |
| Bank | `Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/bench.gltf` | Pin | Tiny-Treats-Stil, nicht KayKit |
| Straßenlaterne | `Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/street_lantern.gltf` | Pin | |
| Bücher | `KayKit_Furniture_Bits_1.0_FREE/Assets/gltf/book_set.gltf`; offenes Buch `src/private/50_BLENDER/K11/props/KFB_Book_Open.k11.glb` (CC0) | Pin / privat | Buch mit Halterung am Lorekeeper |
| Journal, Laterne, Karte, Werkzeuge | `KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/journal_open.gltf`, `lantern.gltf`, `map.gltf`, `shovel.gltf`, `pickaxe.gltf` … | Pin | |
| Fässer, Kisten | `KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/barrel_small.gltf`, `box_stacked.gltf` | Pin | |
| Radio | `Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/radio.gltf` | Pin | schon in der Disco |
| Lautsprecher | `KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Speaker.gltf` | Pin | schon in der Disco |
| Schirm, Ofen | `KayKit_Mixed_Bag_1_FREE/Assets/gltf/umbrella_yellow.gltf`, `woodstove.gltf` | Pin | Schirm wirkt mit Knete als Klumpen |
| Bäume, Büsche, Steine | `src/assets/place/kaykit_forest_kfb.glb` (20 Bäume, 22 Büsche, 22 Steine) | Repo | auch Forest-Pack am FOREST_PIN |
| Steine | `src/assets/place/kfb_stone_kit.v4.glb` | Repo | |
| Palmen | `src/assets/place/palms_quaternius_kfb.glb` | Repo | |
| Geschenk-Box | `src/assets/gift/Present_Base.gltf` | Repo | Spielzeugtrupp |
| Mistgabel | `src/private/50_BLENDER/K11/_privat_kauf_asset/KFB_Pitchfork.k11.glb` | privat | Farmer B |
| Bot-Block, Station | `src/private/50_BLENDER/B17/_privat_kauf_asset/KayfabrickBlock_*.r1.glb`, `KayfabrickStation_*.r1.glb` | privat | |
| Instrumente | `src/private/50_BLENDER/ORKBAND/…/instruments/KFB_Instr_*.r1.glb`, `K5/…/KFB_Band_*.k5.glb` | privat | Band |
| Disco-Technik | `src/private/50_BLENDER/K4/…/KFB_Disco_*.k4.glb` | privat | |
| Labor-Möbel (UFO) | `src/private/50_BLENDER/B34/out/KFB_Ship_*.r1.glb` (Herd, Experimentiertisch, Werkzeugregal, Staffelei) | privat | UFO-Innenraum, Stil passt teils |
| Fluff-Flecken | `src/private/50_BLENDER/B34/out/KFB_FluffPatch_S/M/L.r1.glb` | privat | |

**Fehlen (nirgends im Spiel oder am Pin gefunden):**
- **Lesepult** (lectern): kein Modell. Ersatz in der Probe: Kistenstapel mit Büchern.
- **Angel**: kein Modell, kein Angel-Clip. Nur Kenney „campfire-fishing-stand“ in Dropbox (anderer Stil). Ersatz in der Probe: Stab.
- **Werkbank im KayKit-Stil**: nur Quaternius (Fantasy Props MegaKit) und Kenney in Dropbox, B36 Garagen-Werkbank im Hub. Nicht im Spiel.
- **Flamme / Glut** fürs Lagerfeuer: nur Holzscheite; Licht darf nicht dazukommen (ein Rig), Flamme wäre ein Mesh-Effekt.
- **große Fluff-Kugel** (Sisyphos): kein Asset; Probe nutzt eine Platzhalter-Kugel mit Knete. B34 FluffPatch wäre eine Grundlage.
- **Hiker-Augenprofil**: Hiker.glb ist da, aber Georgs Batch hat kein Profil (wie bei Ritter/Dämon: Anker-Sitz wäre der PROOF-Weg).

## Lücken (für Entscheidungen)

1. **Lese-, Arbeits- und Trage-Clips nur privat.** Ohne `src/private` kann niemand lesen, arbeiten, tragen. Für einen Generator ist das in Ordnung (Build hat private Dateien), aber jede neue Figur braucht eigene K11-artige Clip-Pakete.
2. **Kein Sprech-Clip.** Wechselrede läuft nur über Blasen. Gossip-Szenen sehen stumm aus. Kandidaten: Motion Library kfb_idle_laughing_a, Waving, Interact.
3. **Kein Angel-Clip, keine Angel.** Szene 8 geht nur als Ersatz und nur mit `desert=1` (Oasen V-904); in der Standard-Endloswelt gibt es kein Wasser.
4. **37 KayKit-Figuren nur am Pin.** Laden geht wie bei der Disco. Es fehlen je Figur: Augenprofil (oder Anker-PROOF), Rezept, Kastenbreite. Das ist der günstigste Weg zu mehr Besetzung (z. B. Hiker, Caveman, Survivalist, Farmer A, Hoarder, Clown).
5. **Kein Rig_Large-Clipsatz im Spiel.** Agenten (B40) und Suit-CT sind Large-Rig; sie hätten nur ihre eingebetteten Kampf-Clips.
6. **23 Tiere fehlen ganz** (kein Modell erreichbar, Quelle offen). Würfel-Tiere gibt es nur als Fluffer (K15).
7. **Register-Felder:** `performance.animations` ist bei 75 von 132 Figuren todo (GAPS.md). Die Clip-Wahrheit steht heute nur in den GLB-Dateien, nicht im Register.

## Probe Mikro-Szenen (Teil 2): was schwach ist

Blatt: `~/kfb-ws0/npc-scenes/test/out/npc_scenes_sheet.jpg` (9 Bilder, 8 Szenen). Hash `#m1,look=terrain3,world=endless,npcprobe=1` (+ `desert=1,npcprobeonly=m8` für das Wasser).

- **1 Wanderer:** Hiker ohne KFB-Augen (Original-Augen). Sit_Floor_Idle wirkt wie Hocken. Feuer ohne Flamme.
- **2 Hexe:** kein Rühr-Clip, „Interact“ ist ein Griff nach vorn. Kahler Baum ist mit Knete sehr dominant.
- **3 Lorekeeper:** liest gut (eigener Clip + Buch). Pult fehlt. Großer Baumschatten im Vordergrund.
- **4 Streife:** liest sich, aber Requisiten (Fässer, Kisten) sind beliebig, kein Ziel der Runde.
- **5 Bank:** Sitzen + Buch in der Hand; kein echter Lese-Sitz-Clip, Seite zeigt zur Kamera. Bank im Tiny-Treats-Stil.
- **6 Tanz:** drei Tänzer klein im Bild, Radio fast verdeckt. Wirkt leer ohne Bühne oder Publikum.
- **7 Fluff rollen:** stärkstes Bild. Kugel ist ein Platzhalter (facettig), kein Fluff-Material, rollt nicht über den Boden.
- **8 Angler:** nur mit `desert=1`; Angel ist ein Stab, Sitz-Clip ist Hocken; Wasser > 1 km vom Start.
- Allgemein: Plätze sind die flachsten Stellen im Ring 30–170 m; Hänge bleiben bis Neigung ≈ 0,1. Requisiten sitzen am tiefsten Punkt ihrer Grundfläche (nie schwebend, am Hang leicht eingesunken).

## Was ein echter Generator braucht

- **Datensatz:** `kfb.scene/1` aus `src/npc/sceneTypes.js` (makeScene/validScene) um ein Feld `kulisse` erweitern: Requisiten mit Lage im Szenenraum (wie `PROBE_SCENES` in `src/npc/npcSceneProbe.js`), Figuren mit `aktivitaet` → Clip-Wunschliste. Neue Typen: `lager`, `hexe`, `lesen`, `bank`, `tanz`, `sisyphos`, `angeln` (Freigabe „entwurf“ bis Georgs Bildwahl).
- **Platz:** Szenen-Raster `src/npc/sceneGrid.js` (heute Platzhalter, 192-m-Zellen) liefert Plätze mit Neigung; Typen mit Requisiten brauchen `maxSlope` ≈ 0,08 oder einen Erdkeil (Grounding wie V-654), Wasser-Typen eine Platzquelle `oasesAround` (wie Fluffer: `spotSources`). Ausschluss: Pappkulissen, Tafeln, Kuppel, Café (`blocked`/`avoid` der Probe).
- **Regie:** `src/npc/sceneDirector.js` Phasen Aufbau → Konflikt → Ruhe. Vorschlag: Ruhe = Lesen, Bank, Angler, Lager; Aufbau = Hexe, Tanz; Konflikt = Streife, Sisyphos (Bots gegen Fluff). Platz voraus im Kegel ±35°, Abbau hinter dem Spieler (`src/npc/sceneHost.js`).
- **Assets:** Requisiten vom Pin vorladen (Cache je Datei), Kit-Maßstab = Klassen-Faktor × K; fehlende Teile (Pult, Angel, Flamme, Fluff-Kugel) als WSB-Aufträge; Augenprofile für Pin-Figuren (Hiker zuerst).
- **Clips:** Sprech-Clip und Rühr-/Angel-Clip fehlen; Sitz-am-Boden-Ersatz prüfen (kfb_idle_kneeling_a aus der Motion Library).
- **Knete:** Figuren über `kitClayTargets`, Requisiten als `midground` (wie Fundsachen) – so in der Probe verdrahtet.

## Belege

- Probe-Bilder (Teil 2): `~/kfb-ws0/npc-scenes/test/out/npc_scenes_sheet.jpg`, Einzelbilder `~/kfb-ws0/npc-scenes/test/out/npc_scenes/m*.png`, Status `probe_status*.json` daneben.
- Inventur-Skript (GLB-Clips, Knochen, Texturen) lief über `src/assets` und `src/private`; Ergebnis nicht eingecheckt.
