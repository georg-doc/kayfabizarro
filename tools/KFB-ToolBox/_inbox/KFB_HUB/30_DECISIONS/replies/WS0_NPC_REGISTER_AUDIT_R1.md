# WS0 · NPC-Register-Audit R1 (Mikro-Szenen)

Stand 28.10.2026 · WS-NPC · Branch `game/npc-scenes-probe-r1` (Worktree `~/kfb-ws0/npc-scenes`, Basis `game/proc-world-ws0` @c15b4de). Nur gelesen, kein Code geändert für diesen Teil.

Quellen: `src/data/characters/registry.r1.json` (132 Figuren), `src/data/npc/residents.r1.json`, `src/npc/*`, `src/actors/*` (stageCast, privateCast, discoCast, botCast), `src/assets/actors/*`, `src/private` (nur Namen), Hub-Register `30_DECISIONS/CHARACTERS_R1/` (index.json, GAPS.md). Clip-Listen direkt aus den GLB-Dateien gelesen (433 Dateien).

## Kurz

- **132 Figuren** im Register. **38 spielbar** heute (Modell + Augen-Weg + Clips im Spiel verdrahtet). Davon 16 Fluffer-Würfel, Spielfigur FrizzleBob und Partnerin GothGirl. **20 menschenähnliche NPCs** bleiben.
- Von den 20 NPCs gehen **10 nur mit `src/private`** (Disco-Körper K12, Ork-Band, Bots B17). Ohne private Dateien: 10 (Lorekeeper, Farmer B, Barbarian, Mage, Rogue Hooded, 4 Skelette, Spielzeugsoldat).
- **9 Modelle da, aber nicht verdrahtet** (Agenten B40, HeroMan, Mech, Lady Dory, Lord Hunky, Monstrosity, Rogue-Proof). **37 nur in den kayfabizarro-Medien** (KayKit-Original, ladbar wie die Disco-Requisiten, aber ohne KFB-Augenprofil). **48 fehlen ganz** (23 Tiere, Eigen-Rigs aus dem Hub, Requisiten-Figuren).
- **Aktivitäten:** idle, walk, sit, cheer, dance gehen für alle Rig_Medium-Figuren. **read** nur Lorekeeper (privat). **tend** nur Farmer B und Lorekeeper (privat). **carry/push** nur Lorekeeper (privat) und Bots. **fish** gibt es nicht. **talk/gossip** hat keinen eigenen Clip (Ersatz: Waving, Interact, Idle_B).
- **Requisiten:** Im Spiel-Repo selbst liegen fast keine Szenen-Requisiten. Zelt, Feuer, Kessel, Tränke, Tisch, Bank, Bücher, Fässer, Kisten, Radio liegen am **kayfabizarro-Pin c746a956** (den die Disco schon nutzt) und laden zur Laufzeit. **Fehlen:** Lesepult, Angel, Werkbank (KayKit-Stil), Lagerfeuer-Flamme.

- **R2 (28.10., Georg q279):** alle 30 Resident-Atlas-Bewohner als Vignetten portiert: **lädt 6 · teilweise 23 · fehlt 1** (Orc Warband). Details und Promo-Abgleich unten (Abschnitte R2 und Promo-Abgleich).

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

## R2 · RA-Vignetten im Spiel (Georg q279: NPCs mit ihren Resident-Atlas-Settings)

Stand 28.10. · Quelle `30_DECISIONS/replies/RESIDENT_ATLAS_S17_1to1/data/cast.js` (30 RESIDENTS). Wandler `scripts/npc/ra-to-scenes.mjs` → `src/data/npc/ra_scenes.r1.json` (30 Vorlagen `kfb.scene/1`, typ `vignette`, Feld `vignette.items` = Komposition 1:1: p, r, rx, rz, s, y, on, float, hand, sitOn, pose, layer, hide, skin, parts, graft). Bau im Spiel `src/npc/raVignette.js`, Platzierung `src/npc/raProbe.js` hinter `#npcprobe=2` (`raonly=lorekeeper|witch` begrenzt). Bilder `scripts/look/ra-vignettes-shot.mjs`.

**Zählung (30 Bewohner): lädt 6 · teilweise 23 · fehlt 1.**
- **lädt** (alles aus Spiel/Pin, KFB-Augen, Pose aus den Spiel-Clips): Lorekeeper (mit Lesepult), Goth Girl, Toy Soldier, Skeleton Warrior, Rogue, Mage.
- **teilweise**, häufigste Gründe: **kein Augenprofil im Spiel** (Figur läuft als Kit-Original mit gemalten Augen) bei 21 Bewohnern; **Pose nur am Clip-Pin** (KayKit Character Animations 1.1 @aa16a777: CombatMelee, Tools mit Holding_B/C, alle Rig_Large-Clips) bei 13; Atlas-Extras nicht portiert (hover, spin, strum, hold, faceTile, paletteShift, Atlas-Handy `gen`).
- **fehlt:** Orc Warband – zwei Legacy-Figuren, die der Atlas aus Teilen an `KayKit_AnimatedCharacter_v1.2` zusammensetzt; nur das Banner lädt. Im Spiel gibt es die gebackenen Ork-Körper `ORKBAND/KFB_Orc_Legacy_A/B.r1.glb` (privat) – als Ersatz nicht eingesetzt, Entscheidung offen.
- Requisiten: alle Pack-Requisiten laden vom Pin der Vorlage (891eadf0, Skelette/Mixed Bag `main`, Legacy 10a7fdce); einzige Lücke sind die zwei Atlas-Handys (Protagonists) und die Legacy-Hand-Requisiten des Warband.

Blätter (links Kay-Promo bzw. Pack-Bild, rechts Spiel 3/4): `~/kfb-ws0/npc-scenes/test/out/ra_vignettes_sheet_1.jpg` … `_5.jpg`, Einzelbilder `test/out/ra_vignettes/<id>.png`, Status `test/out/ra_vignettes/results.json`.

| Bewohner | Port | Figuren | Requisiten geladen | Referenz im Blatt | Warum nicht voll |
|---|---|---|---|---|---|
| Goth Girl (`goth-girl`) | **lädt** | gothgirl (KFB-Augen, Pose spiel) | 4/4 | Promo promo.png | – |
| Clown (`clown`) | **teilweise** | clown (Original-Augen, Pose spiel) | 20/20 | Pack-Bild | kein Augenprofil im Spiel: clown |
| Toy Soldier (`toy-soldier`) | **lädt** | soldier (KFB-Augen, Pose spiel) | 6/6 | Promo contents (9).png | Enthüllung nur als Endbild |
| Farmers (`farmers`) | **teilweise** | farmer_a (Original-Augen, Pose spiel), farmer_b (KFB-Augen, Pose spiel) | 13/13 | Promo promo (1).png | kein Augenprofil im Spiel: farmer_a |
| Caveman (`caveman`) | **teilweise** | caveman (Original-Augen, Pose pin) | 5/5 | Pack-Bild | Pose nur am Clip-Pin: caveman; kein Augenprofil im Spiel: caveman |
| Lorekeeper (`lorekeeper`) | **lädt** | lorekeeper (KFB-Augen, Pose spiel) | 2/2 | Promo lorekeeper promo (4).png | – |
| Witch (`witch`) | **teilweise** | witch (KFB-Augen, Pose pin) | 10/10 | Pack-Bild | Pose nur am Clip-Pin: witch |
| Black Knight (`black-knight`) | **teilweise** | knight (Original-Augen, Pose pin) | 4/4 | Pack-Bild | Pose nur am Clip-Pin: knight; kein Augenprofil im Spiel: knight |
| Avian Swordsman (`avian-swordsman`) | **teilweise** | avian (KFB-Augen, Pose pin) | 2/2 | Promo promo (7).png | Pose nur am Clip-Pin: avian |
| Skeleton Warrior (`skeleton-warrior`) | **lädt** | warrior (KFB-Augen, Pose spiel) | 3/3 | Pack-Bild | – |
| Skeleton Rogue (`skeleton-rogue`) | **lädt** | rogue (KFB-Augen, Pose spiel) | 5/5 | Pack-Bild | – |
| Skeleton Mage (`skeleton-mage`) | **lädt** | mage (KFB-Augen, Pose spiel) | 1/1 | Pack-Bild | – |
| Demon Lord (`demon-lord`) | **teilweise** | demon (Original-Augen, Pose pin) | 2/2 | Promo promo (2).png | Pose nur am Clip-Pin: demon; kein Augenprofil im Spiel: demon |
| Orc Brute (`orc-brute`) | **teilweise** | brute (Original-Augen, Pose pin) | 9/9 | Promo promo (4).png | Pose nur am Clip-Pin: brute; kein Augenprofil im Spiel: brute |
| Monstrosity (`monstrosity`) | **teilweise** | monster (Original-Augen, Pose pin) | 4/4 | Promo promo (10).png | Pose nur am Clip-Pin: monster; kein Augenprofil im Spiel: monster |
| Orc Warband (`orc-warband`) | **fehlt** | – | 1/4 | Pack-Bild | orcA: blockiert (Legacy-Figur (Zusammenbau aus Teilen an KayKit_AnimatedCharacter_v1.2)); orcB: blockiert (Legacy-Figur (Zusammenbau aus Teilen an KayKit_AnimatedCharacter_v1.2)); sword: fehlt (Hand orcA/armRight nicht da); shield: fehlt (Hand orcB/armLeft nicht da); hammeraxe: fehlt (Hand orcB/armRight nicht da) |
| Prototype Pete (`prototype-pete`) | **teilweise** | pete (Original-Augen, Pose spiel) | 4/4 | keine | kein Augenprofil im Spiel: pete; pencil:  aimIn (Basispose) → Anzeigepose |
| Ultra Turbo Hero Man (`hero-man`) | **teilweise** | hero_red (Original-Augen, Pose spiel), hero_blue (Original-Augen, Pose spiel) | 4/4 | Promo promo (6).png | kein Augenprofil im Spiel: hero_red, hero_blue; hero_red: eigene Clip-Bibliothek des Packs (animLib) nicht im Spiel; hero_blue: eigene Clip-Bibliothek des Packs (animLib) nicht im Spiel |
| Cleric (`cleric`) | **teilweise** | cleric (Original-Augen, Pose spiel), cleric_dark (Original-Augen, Pose pin) | 5/5 | Promo promo (11).png | Pose nur am Clip-Pin: cleric_dark; kein Augenprofil im Spiel: cleric, cleric_dark |
| Animatronic (`animatronic`) | **teilweise** | creepy (Original-Augen, Pose spiel), normal (Original-Augen, Pose pin) | 5/5 | Pack-Bild | Pose nur am Clip-Pin: normal; kein Augenprofil im Spiel: creepy, normal; normal: Anschlag-Spur (strum) nur im Atlas; guitar_normal: Arm-Nachführung (hold) nur im Atlas |
| Action Figure (`action-figure`) | **teilweise** | figure (Original-Augen, Pose spiel) | 4/4 | Pack-Bild | kein Augenprofil im Spiel: figure; head_calm: Gesichts-Kachel nur im Atlas |
| The Marksman (`marksman`) | **teilweise** | marksman (Original-Augen, Pose spiel), marksman_open (Original-Augen, Pose spiel), marksman_hood (Original-Augen, Pose spiel), marksman_snow (Original-Augen, Pose spiel) | 3/3 | Promo promo (8).png | kein Augenprofil im Spiel: marksman, marksman_open, marksman_hood, marksman_snow; marksman_snow: Paletten-Verschiebung nur im Atlas |
| The Hoarder (`hoarder`) | **teilweise** | hoarder (Original-Augen, Pose spiel), hoarder_b (Original-Augen, Pose spiel) | 2/2 | Promo promo (9).png | kein Augenprofil im Spiel: hoarder, hoarder_b |
| The Plant Warrior (`plant-warrior`) | **teilweise** | plant_a (Original-Augen, Pose spiel), plant_guard (Original-Augen, Pose pin), plant_fall (Original-Augen, Pose spiel) | 7/7 | Promo promo (5).png | Pose nur am Clip-Pin: plant_guard; kein Augenprofil im Spiel: plant_a, plant_guard, plant_fall |
| 4GTN (`gtn`) | **teilweise** | gtn (Original-Augen, Pose pin), gtn_forgotten (Original-Augen, Pose pin) | 2/2 | Promo contents (8).png | Pose nur am Clip-Pin: gtn, gtn_forgotten; kein Augenprofil im Spiel: gtn, gtn_forgotten |
| The Hiker (`hiker`) | **teilweise** | hiker_a (Original-Augen, Pose spiel), hiker_b (Original-Augen, Pose pin) | 2/2 | Pack-Bild | Pose nur am Clip-Pin: hiker_b; kein Augenprofil im Spiel: hiker_a, hiker_b |
| The Protagonists (`protagonists`) | **teilweise** | prot_a (KFB-Augen, Pose pin), prot_b (Original-Augen, Pose spiel) | 0/2 | Pack-Bild | phone_a: übersprungen (Atlas-eigene Geometrie (phone), kein Pack-Asset); phone_b: übersprungen (Atlas-eigene Geometrie (phone), kein Pack-Asset); Pose nur am Clip-Pin: prot_a; kein Augenprofil im Spiel: prot_b |
| The Mummy (`mummy`) | **teilweise** | mummy_b (Original-Augen, Pose spiel), mummy_a (Original-Augen, Pose spiel) | 7/7 | Pack-Bild | kein Augenprofil im Spiel: mummy_b, mummy_a |
| The Combat Mech (`combat-mech`) | **teilweise** | mech_ground (Original-Augen, Pose spiel), mech_flight (Original-Augen, Pose spiel) | 3/3 | Pack-Bild | kein Augenprofil im Spiel: mech_ground, mech_flight; mech_flight: Schweben (hover) nicht portiert; minigun_flight: drehendes Teil (spin) nicht portiert |
| The Combat Mech · Oliv (`combat-mech-alt`) | **teilweise** | mech_ground_alt (Original-Augen, Pose spiel), mech_flight_alt (Original-Augen, Pose spiel) | 3/3 | Pack-Bild | kein Augenprofil im Spiel: mech_ground_alt, mech_flight_alt; mech_flight_alt: Schweben (hover) nicht portiert; minigun_flight_alt: drehendes Teil (spin) nicht portiert |

**Schwach (ehrlich):**
- **Bildgröße:** Die Spielkamera (4–7 m, Polar 1,15) zeigt die Vignette klein in weiter Landschaft; die Promos zeigen die Figur groß. Farmers und Marksman sind breit gestellt (bis ± 4 m) und wirken verloren.
- **Lorekeeper-Krummstab:** liegt laut Messung an der rechten Hand (0,1–1,0 m hoch, fast senkrecht wie im Atlas), ist aus der 3/4-Kamera aber hinter dem Körper verdeckt. Haltung Idle_A statt gestütztem Stab der Promo.
- **Black Knight, Monstrosity:** aus der keyArt-Richtung verdeckt Schild bzw. Scheunentor die Figur.
- **Animatronic:** Gitarren stehen neben den Bären (Arm-Nachführung `hold` und Anschlag `strum` sind Atlas-Code).
- **Hero Man, Marksman, Plant Warrior:** Waffen ohne Hand-Haltung liegen am Boden (Pack-Clips/animLib fehlen im Spiel).
- **Toy Soldier:** nur das Endbild der Enthüllung (Box offen); das Aufspringen ist nicht portiert.
- **Augen:** RA nutzt für Witch, Orc Brute, Mummy bereinigte NoEyes-Dateien mit Anker-Augen; das Spiel hat dafür nur die Witch (Disco-Körper). Alle anderen zeigen Originalaugen.
- Gelände: jede Requisite sitzt auf der Geländehöhe an ihrer Stelle (Plätze mit Neigung ≤ 0,1); auf Hängen weicht das leicht von der flachen Atlas-Komposition ab.

**Für die Produktion:** `vignette` als Typ in `src/npc/sceneTypes.js` aufnehmen (Freigabe „entwurf“), Fabrik im Szenen-Wirt = `createRaVignette`. Vorrang: Augenprofile für die Kit-Originale (Batch, wie Hiker), Clip-Sätze CombatMelee/Tools und Rig_Large ins Spiel (heute nur Pin), Begegnungs-Kamera bzw. Plinthe nach Promo-Vorbild.

## Promo-Abgleich (V-782, Kay-Lousberg-Promos als Maßstab)

Quelle: `~/Dropbox/CLAUDE/KFB Stunt Car Race/_inbox/KayKit_PACKS_References_Scenes_Demos/` (164 Dateien, privat, nur gelesen, nicht ins Repo). Die RA-Referenzen `ref/atlas/*` und `uploads/*` fehlen im S17-Export; drei davon sind dort als gleiche Datei wiederzufinden (`uploads/contents (9).png` Toy Soldier, `uploads/promo (1).png` Farmers, `uploads/promo (7).png` Avian). Im Blatt steht links das Monthly-Mystery-Bild (Set mit Licht und Kulisse), sonst die GIF (erstes Bild), sonst das Contents-Blatt, sonst Pack-artwork aus der kayfabizarro-Kopie.

| Bewohner | Promo-Dateien | Varianten in der Promo | Set-Requisiten / Umgebung in der Promo | Lücke im Spiel |
|---|---|---|---|---|
| Lorekeeper | `lorekeeper promo (4).png`, `LOREKEEPER SET 1.gif`, `lorekeeper - demo - contents (3).png` | 1 | Lesepult (Tome) mit Kerzen und Rollen, Krummstab gestützt, Sand-Insel mit Wasser | Krummstab im Spiel verdeckt (Haltung); keine Kerzenflamme |
| Goth Girl | `promo.png`, `GothGirl.gif`, `contents.png` | 2 (schwarz, weiß/Kleid) | Hocker, Mikrofonständer, Box | zweite Variante nicht im Spiel |
| Farmers | `promo (1).png`, `June2026_Farmers.gif`, `contents (1).png` | **4 Figuren = Farmer A/B × 2 Texturen** (hell, dunkel) | Schubkarre mit Gemüse, Beete, Salat, Möhren, Sonnenblume, Mistgabel, Nadelbäume | Textur B beider Farmer nicht im Spiel; Sonnenblume nicht im RA-Set |
| Toy Soldier | `contents (9).png` | 1 | Geschenkbox zu/offen, Gewehr, Trompete | Enthüllung nur als Endbild |
| Avian Swordsman | `promo (7).png`, `March2026_AvianSwordsman.gif`, `contents (5).png` | 2 (blau, braun) | Trainingspuppe, Schwert, Holzsteg am Wasser | braune Variante fehlt; Puppe nicht im RA-Set |
| Demon Lord | `promo (2).png`, `contents (2).png` | 1 (+ Varianten im Contents) | Pentagramm-Bodenplatte, Herz, Glut-Boden | Glut/Licht-Effekt nicht erlaubt (ein Rig); Rig_Large ohne Spiel-Clips |
| Orc Brute | `promo (4).png`, `August2025_OrcBrute.gif`, `contents (3).png` | 2 (grün, grau-blau) | Banner (Large), Axt, Nadelbäume | grau-blaue Variante; Rig_Large |
| Monstrosity | `promo (10).png`, `October2025_Monstrosity.gif`, `contents (10).png` | 2 (grau, grün) | Scheunentor (Large), Mistgabel, Pflaster, Bäume | zweite Variante; Rig_Large |
| Hero Man | `promo (6).png`, `BLASTER+GUN SETTING - contents (5).png` | 2 (rot, blau) | Stadt-Kulisse, Blaster, Schwert | Stadt-Kulisse fehlt; eigene Clip-Bibliothek |
| Cleric | `promo (11).png`, `September2025_Cleric.gif`, `contents (11).png` | 2 | Taufbecken/Brunnen, Streitkolben, Buch, Schild, Pflaster | zweite Textur im RA gesetzt, im Spiel kein Profil |
| Marksman | `promo (8).png`, `April2026_Marksman.gif`, `contents (6).png` | 3 (Helm/Kapuze modular) | Gewehre, Liegen im Wald, Tarnung | kein Augenprofil; Paletten-Variante nur im Atlas |
| Hoarder | `promo (9).png`, `February2026_Hoarder.gif`, `contents (7).png` | 2 (+ Roboter-Rucksack) | Rucksack mit Waren, Laterne | Textur B; kein Augenprofil |
| Plant Warrior | `promo (5).png`, `November2025_PlantWarrior.gif`, `contents (4).png`, `contents_alt.png` | 3 (grün, rot, orange) | Blumen-Speer, Blatt-Schild, Bogen, Wiese | zwei Varianten; kein Augenprofil |
| 4GTN | `contents (8).png` | 2 (grün, weiß) | Schwert, Schild | Rig_Large; kein Augenprofil |
| Magical Girl (kein RA-Bewohner) | `promo (3).png`, `May2026_MagicalGirl.gif` | 4 | – | nicht im Register-Set des Atlas |
| übrige (Clown, Caveman, Witch, Black Knight, Skelette, Animatronic, Action Figure, Hiker, Protagonists, Mummy, Combat Mech, Orc Warband, Prototype Pete) | keine Datei im Ordner | – | Pack-artwork/contents aus kayfabizarro (Witch, Clown, Caveman, Black Knight, Demon, Animatronic, Action Figure, Skelette, Warband) | Promo-GIF fehlt in der Sammlung |

**Licht und Bild der Promos (Ziel für die 3/4-Bilder):** Figuren groß im Bild (≈ 40–60 % Bildhöhe), Kamera leicht erhöht, frontal-schräg; weiches Studio-Licht von vorn oben, warme Lichter, kurze weiche Schatten, kein harter Kontrast; Hintergrund zweifarbig geteilt (Varianten links/rechts) oder Kay-Wald (Nadelbäume, Büsche) auf einer kleinen Insel mit Wasserrand; Requisiten dicht um die Figur (≤ 1,5 Figurhöhen). **Abstand zum Spiel:** Unsere Bilder zeigen die Figur klein in weiter Landschaft (Spielkamera 4–6 m), das Rig ist Tageslicht ohne Studio-Aufhellung, der Grund ist das Bänder-Gelände statt einer Insel. Für Vignetten wäre eine nähere „Begegnungs-Kamera“ und ein kleiner Bodenteller (Kay-Insel als Plinthe) nötig – das ist eine Entscheidung für Georg, kein zweites Licht.

**Varianten, die das Spiel noch nicht nutzt:** Farmer A/B Textur B (dunkel), Goth Girl weiß, Avian braun, Orc Brute grau-blau, Monstrosity grün, Hero Man blau (nur im Atlas), Cleric zweite Textur, Hoarder B, Plant Warrior rot/orange, 4GTN weiß, Marksman Helm/Kapuze, Magical Girl ×4. Die Texturen liegen in den Packs (`textures/…_B.png`, z. B. `farmer_texture_B.png`, `hoarder_texture_B.png`); der Atlas setzt sie über `skin`, die Spiel-Darsteller kennen heute nur die eingebettete Textur.

## Belege

- Probe-Bilder (Teil 2): `~/kfb-ws0/npc-scenes/test/out/npc_scenes_sheet.jpg`, Einzelbilder `~/kfb-ws0/npc-scenes/test/out/npc_scenes/m*.png`, Status `probe_status*.json` daneben.
- Inventur-Skript (GLB-Clips, Knochen, Texturen) lief über `src/assets` und `src/private`; Ergebnis nicht eingecheckt.
