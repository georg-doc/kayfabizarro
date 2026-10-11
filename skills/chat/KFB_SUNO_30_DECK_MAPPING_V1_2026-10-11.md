# KFB Suno 30 · Readable 130-Deck Music Routing Map · v1

**Status:** DESIGN/AUTHORING recommendation, no rendered audio and no 6985-card individual validation. **As of:** 2026-10-11.
**Source:** canonical `registry/assets/v1/decks/index.json` (130 decks / 6985 Cards), machine-readable mapping [`KFB_SUNO_30_DECK_MAPPING_V1_2026-10-11.json`](./KFB_SUNO_30_DECK_MAPPING_V1_2026-10-11.json), complete copy/paste prompt pack [`KFB_SUNO_30_SOUNDSCAPE_PROMPT_PACK_V1_2026-10-11.md`](./KFB_SUNO_30_SOUNDSCAPE_PROMPT_PACK_V1_2026-10-11.md).

## Usage

Deck seed is not a song file. The **primary** slot gives the proposed mood family; secondary slots are optional changes for drama/location/scene. The existing KFB Audio selector remains responsible for actual track eligibility, valid silence, provenance and availability. User playlists and external personal MP3s are a separate player-private source; they never modify global deck/music catalog.

## Song-first browsing (find decks for a prompt)

| Slot | Priority | Proposed song title | Primary deck count | Primary deck examples | Additional secondary links |
|:---:|:---:|---|---:|---|---:|
| 01 | P0 | KFB Hotel Afterhours 01 | 1 | `the_importance_of_being_kayfab_earnest` | 5 |
| 02 | P0 | KFB Detective Rain Ledger 01 | 11 | `cosmic_grift_dark_journalism`, `medkayfab_diagnostic_tools`, `medkayfab_laboratory_medicine`, `medkayfab_pathology`, `medkayfab_radiology` | 42 |
| 03 | P0 | KFB Spycraft Listening Room 01 | 11 | `deep_state_plumbing`, `federal_kayfabe`, `geopolitical_thrillers_conspiracy_theories`, `kayfabizarro_monopolies_manipulation_murder_vol`, `kayfabizzaro_politics` | 15 |
| 04 | P0 | KFB Akashic Closed Stacks 01 | 6 | `help_i_am_a_human`, `kayfabizarro_philosophy`, `medkayfab_ancestral_medicine`, `medkayfab_science`, `suppressed_book_deck` | 17 |
| 05 | P0 | KFB Dungeon Torchline 01 | 4 | `kayfabizarro_siege_tower_wall_siege_kampaigns`, `kayfabizarros_ontological_hazards`, `philosopher_dungeon_raid`, `platos_dungeon_raid_v05` | 6 |
| 06 | P0 | KFB Forest Second Footstep 01 | 2 | `dream_wrestling_with_kayfabe_freud`, `jung_and_shinn_a_guide_to_cosmic_cringe` | 13 |
| 07 | P0 | KFB Coast Blue Hour Pier 01 | 0 | Scene-specific, no primary deck | 3 |
| 08 | P0 | KFB Polar Under Ice 01 | 0 | Scene-specific, no primary deck | 2 |
| 09 | P0 | KFB Pharaoh Painted Chamber 01 | 2 | `pharaoh_piledriver`, `the_pharaoh_script_psychology_of_evil` | 0 |
| 10 | P0 | KFB Woad And Iron 01 | 3 | `nibelungen_booster_pack_design`, `the_uruk_rumble`, `woad_and_warriors` | 0 |
| 11 | P0 | KFB MedKayfab Differential 01 | 31 | `medkayfab_atomic_elements`, `medkayfab_biochemistry`, `medkayfab_cardiology`, `medkayfab_dentistry`, `medkayfab_dermatology_01` | 5 |
| 12 | P0 | KFB MedKayfab Golden Hour 01 | 5 | `medkayfab_clinical_cases`, `medkayfab_emergency_medicine`, `medkayfab_intensive_care_medicine`, `medkayfab_orthopedics_trauma`, `medkayfab_surgery` | 31 |
| 13 | P1 | KFB Canopy Tiger Trails 01 | 1 | `medkayfab_tropical_medicine` | 2 |
| 14 | P1 | KFB Almost A Waltz 01 | 2 | `romantic_kayfabe`, `the_kayfabe_crucible_coming_of_age` | 2 |
| 15 | P1 | KFB After The Door 01 | 8 | `brain_flipper_image_spots`, `frizzlebob_s_ego_mania_narcissist`, `human_nature_uncut_hilfe_ich_bin_ein_mensch`, `medkayfab_geriatrics`, `medkayfab_psychiatry` | 8 |
| 16 | P1 | KFB Window Rain & Tea 01 | 4 | `medkayfab_neonatal_medicine`, `medkayfab_nursing_care`, `medkayfab_pediatrics`, `medkayfab_the_bedside_ballet` | 17 |
| 17 | P1 | KFB Town Saturday Assembly 01 | 3 | `bullshit_jobs_uncut`, `medkayfab_hospital_hierarchy`, `what_work_was_for` | 12 |
| 18 | P1 | KFB Protopia Repair Waltz 01 | 4 | `anti_rules_toolkit`, `embrace_protopia`, `protopia_web`, `the_biology_of_rebellion_hilfe_ich_bin_ein_mensc` | 7 |
| 19 | P1 | KFB Maker Conveyor Samba 01 | 3 | `epistemic_sabotage`, `kayfabizarro_pulitzer_punk`, `kreative_kayfab_creative_hero_journey` | 2 |
| 20 | P1 | KFB Utopia Service Corridor 01 | 2 | `ai_kayfabe`, `forget_utopia` | 1 |
| 21 | P1 | KFB Dystopia Emergency Over 01 | 4 | `ideology_wrestling`, `ignore_dystopia`, `programming_the_whole_child`, `shadow_politics` | 4 |
| 22 | P1 | KFB Slow Orbit 01 | 2 | `frizzlebob_s_mission_control`, `kosmik_kayfabizarro_sci_fi_space_opera` | 0 |
| 23 | P2 | KFB Next Ridge Adventure 01 | 4 | `1001_kayfabe_nights`, `grimms_kayfabe_legends_expansion_set_02`, `kayfabizarro_monomyth_mayhem`, `platos_dungeon_raid_hero_set_01` | 9 |
| 24 | P2 | KFB Third Attempt Boss 01 | 2 | `kayfabizarro_1_morale_ethics`, `medkayfab_oncology` | 6 |
| 25 | P2 | KFB Counterpunch Arena 01 | 1 | `big_bad_brain_wrestling` | 5 |
| 26 | P2 | KFB Filing For Fun 01 | 5 | `frizzlebob_s_kayfabizarro_kompendium_elender_wic`, `kayfabizarro_improv_comedy`, `medkayfab_rules_comic_01`, `museum_of_modern_mess`, `plot_pusher_posse` | 10 |
| 27 | P2 | KFB Plastic Promises Disco 01 | 2 | `sonic_slaughterhouse`, `sonic_warfare_music_history_01` | 5 |
| 28 | P2 | KFB Scenic Detour RoadTrip 01 | 0 | Scene-specific, no primary deck | 10 |
| 29 | P2 | KFB Last Exit NightDrive 01 | 0 | Scene-specific, no primary deck | 13 |
| 30 | P2 | KFB Fugue Of Bad Ideas 01 | 7 | `academic_anarchy_intellectual`, `cinematic_kayfabizarro_2`, `shakespearean_animal_beatdown`, `symphonic_savagery`, `the_bards_barnyard_beatdown` | 8 |

## Deck-first browsing (all canonical 130)

| # | Canonical Deck | Primary track | Optional secondary track(s) |
|---:|---|:---:|---|
| 1 | **Uncle FrizzleBob's 1001 Kayfabe Nights** · `1001_kayfabe_nights` | KFB_SC23 | KFB_SC05, KFB_SC28 |
| 2 | **Unseal the Academic Anarchy — Academic Alphas vs Brain Benders** · `academic_anarchy_intellectual` | KFB_SC30 | KFB_SC26, KFB_SC04 |
| 3 | **Roko's Basilisk & The AI Kayfabe Takeover** · `ai_kayfabe` | KFB_SC20 | KFB_SC29, KFB_SC21 |
| 4 | **The Anti-Rules Manifesto** · `anti_rules_toolkit` | KFB_SC18 | KFB_SC16, KFB_SC19 |
| 5 | **Big Bad Brain Wrestling** · `big_bad_brain_wrestling` | KFB_SC25 | KFB_SC26, KFB_SC24 |
| 6 | **The Brain-Flipper Pack** · `brain_flipper_image_spots` | KFB_SC15 | KFB_SC16, KFB_SC06 |
| 7 | **Bullshit Jobs Uncut: A Field Report from Before the Timesheet** · `bullshit_jobs_uncut` | KFB_SC17 | KFB_SC01, KFB_SC28 |
| 8 | **Cinematic Legacy & Motion Picture Kayfabe** · `cinematic_kayfabizarro_2` | KFB_SC30 | KFB_SC26, KFB_SC04 |
| 9 | **Cosmic Grift – Dark Journalism** · `cosmic_grift_dark_journalism` | KFB_SC02 | KFB_SC03, KFB_SC04 |
| 10 | **Power, Plumbing & Pyramid Pimps** · `deep_state_plumbing` | KFB_SC03 | KFB_SC02, KFB_SC29 |
| 11 | **Dream-Wrestling with Kayfabe-Freud: Where the Id Always Kicks Out at Two!** · `dream_wrestling_with_kayfabe_freud` | KFB_SC06 | KFB_SC13, KFB_SC15 |
| 12 | **Protopia Sketchbook — Deck C: EMBRACE** · `embrace_protopia` | KFB_SC18 | KFB_SC16, KFB_SC28 |
| 13 | **Epistemic Sabotage: Let AI Read Your Comic** · `epistemic_sabotage` | KFB_SC19 | KFB_SC18, KFB_SC17 |
| 14 | **Federal Kayfabe** · `federal_kayfabe` | KFB_SC03 | KFB_SC02, KFB_SC29 |
| 15 | **Forget Utopia** · `forget_utopia` | KFB_SC20 | KFB_SC29, KFB_SC21 |
| 16 | **It’s All About Me! (And Also FrizzleBob)** · `frizzlebob_s_ego_mania_narcissist` | KFB_SC15 | KFB_SC16, KFB_SC06 |
| 17 | **Du Elender Wicht! — Uncle FrizzleBob’s Kayfabizarro Kompendium of Insults, Curses & Ritual Provocations** · `frizzlebob_s_kayfabizarro_kompendium_elender_wic` | KFB_SC26 | KFB_SC17, KFB_SC27 |
| 18 | **Uncle FrizzleBob’s Mission Control Deck** · `frizzlebob_s_mission_control` | KFB_SC22 | KFB_SC28, KFB_SC08 |
| 19 | **Power Pyramid Plumbing & Global Psyop Wrestling – Expansion Deck 01** · `geopolitical_thrillers_conspiracy_theories` | KFB_SC03 | KFB_SC02, KFB_SC29 |
| 20 | **Grimms' Kayfabe Legends — Expansion Set 02: The Fairy Tale Screwjob** · `grimms_kayfabe_legends_expansion_set_02` | KFB_SC23 | KFB_SC05, KFB_SC28 |
| 21 | **Hilfe, ich bin ein Mensch! — Human Nature Science Wrestling** · `help_i_am_a_human` | KFB_SC04 | KFB_SC30, KFB_SC16 |
| 22 | **Human Nature Uncut — Hilfe ich bin ein Mensch** · `human_nature_uncut_hilfe_ich_bin_ein_mensch` | KFB_SC15 | KFB_SC16, KFB_SC06 |
| 23 | **George's Ideology-Wrestling Kayfabizarro Komik Kards — A Field Guide to the War for Your Mind (Version 4.1 Unstable)** · `ideology_wrestling` | KFB_SC21 | KFB_SC03, KFB_SC15 |
| 24 | **IGNORE DYSTOPIA — Anatomy of a Trap (Deck B)** · `ignore_dystopia` | KFB_SC21 | KFB_SC03, KFB_SC15 |
| 25 | **Jung and Shinn: A Guide to Cosmic Cringe** · `jung_and_shinn_a_guide_to_cosmic_cringe` | KFB_SC06 | KFB_SC13, KFB_SC15 |
| 26 | **Beyond the Banalities of Good vs Evil — Uncle FrizzleBob's KAYFABIZARRO Komik Kards for Monster Morality Wrestling & Flexible Kayfabizarro Ethiks** · `kayfabizarro_1_morale_ethics` | KFB_SC24 | KFB_SC25, KFB_SC21 |
| 27 | **The Great Kayfabe Improv Komedy SKETCHBOOK** · `kayfabizarro_improv_comedy` | KFB_SC26 | KFB_SC17, KFB_SC27 |
| 28 | **Monomyth Mayhem** · `kayfabizarro_monomyth_mayhem` | KFB_SC23 | KFB_SC28, KFB_SC05 |
| 29 | **Monopolies, Manipulation & Murder Vol. II** · `kayfabizarro_monopolies_manipulation_murder_vol` | KFB_SC03 | KFB_SC02, KFB_SC29 |
| 30 | **The Kraziest Philosophical Kayfabe-Theories Expansion** · `kayfabizarro_philosophy` | KFB_SC04 | KFB_SC30, KFB_SC16 |
| 31 | **Pulitzer Punk — Kayfabizarro #05** · `kayfabizarro_pulitzer_punk` | KFB_SC19 | KFB_SC18, KFB_SC17 |
| 32 | **Kayfabizarro Siege Kompendium** · `kayfabizarro_siege_tower_wall_siege_kampaigns` | KFB_SC05 | KFB_SC23, KFB_SC06 |
| 33 | **Plato’s Dungeon Raids** · `kayfabizarros_ontological_hazards` | KFB_SC05 | KFB_SC23, KFB_SC06 |
| 34 | **Politics — The Starter Set of Doom: 5,000 Years of Bad Ideas & One Very Tired Ballot Box** · `kayfabizzaro_politics` | KFB_SC03 | KFB_SC02, KFB_SC29 |
| 35 | **Kosmik Kayfabizarro Kollektive (Vol II)** · `kosmik_kayfabizarro_sci_fi_space_opera` | KFB_SC22 | KFB_SC08, KFB_SC20 |
| 36 | **Kreative Kayfab-Kicks & Boomerang Brain Boosters** · `kreative_kayfab_creative_hero_journey` | KFB_SC19 | KFB_SC18, KFB_SC17 |
| 37 | **History of Medicine: The Ancestral Arena** · `medkayfab_ancestral_medicine` | KFB_SC04 | KFB_SC30, KFB_SC16 |
| 38 | **MedKayfab Elemental Wrestling: The Atomic Arena** · `medkayfab_atomic_elements` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 39 | **Biochemistry & Cell Biology Wrestling** · `medkayfab_biochemistry` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 40 | **MedKayfab: Cardiology Expansion** · `medkayfab_cardiology` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 41 | **MedKayfab Synthesis Scenarios: The Grand Rumble** · `medkayfab_clinical_cases` | KFB_SC12 | KFB_SC11, KFB_SC24 |
| 42 | **MedKayfab: Dentistry — The Oral Arena** · `medkayfab_dentistry` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 43 | **MedKayfab Dermatology 01: The Great Barrier Brawl** · `medkayfab_dermatology_01` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 44 | **Dermatology Wrestling: The Surface Skirmish** · `medkayfab_dermatology_02` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 45 | **The Diagnostic Toolkit: The Detective's Gear** · `medkayfab_diagnostic_tools` | KFB_SC02 | KFB_SC03, KFB_SC04 |
| 46 | **The Differential Engine** · `medkayfab_differential_diagnosis` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 47 | **Disease Timeline Wrestling: The Temporal Tide** · `medkayfab_disease_timelines` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 48 | **The Golden Hour Gauntlet — Resuscitation, Rhythms & The Triage Tempest** · `medkayfab_emergency_medicine` | KFB_SC12 | KFB_SC11, KFB_SC24 |
| 49 | **Endocrinology Edition** · `medkayfab_endocrinology` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 50 | **Essential Pharmacology: The Synaptic Arsenal** · `medkayfab_essential_pharmacology` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 51 | **Gastrology Edition** · `medkayfab_gastrology` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 52 | **Medical Genetics: The Genetic Codebreaker — Source Code Sabotage & The Blueprint Rebellion** · `medkayfab_genetics` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 53 | **MedKayfab Geriatrics — The Silver Circuit** · `medkayfab_geriatrics` | KFB_SC15 | KFB_SC16, KFB_SC06 |
| 54 | **MedKayfab: Gross Anatomy — Systems Edition** · `medkayfab_gross_anatomy` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 55 | **Hematology Wrestling: The Bloodline Feuds** · `medkayfab_hematology` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 56 | **MedKayfab: Histology & Microanatomy Edition** · `medkayfab_histology` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 57 | **The Hospital Hierarchy** · `medkayfab_hospital_hierarchy` | KFB_SC17 | KFB_SC01, KFB_SC28 |
| 58 | **MedKayfab: Immunology & Pathology Edition** · `medkayfab_immunology` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 59 | **Intensive Care Medicine: The Vital Vigil** · `medkayfab_intensive_care_medicine` | KFB_SC12 | KFB_SC11, KFB_SC24 |
| 60 | **Internal Medicine Wrestling: The Multimorbid Melee** · `medkayfab_internal_medicine` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 61 | **Laboratory Medicine Wrestling: The Numerical Noir & The Biomarker Betrayal** · `medkayfab_laboratory_medicine` | KFB_SC02 | KFB_SC03, KFB_SC04 |
| 62 | **MedKayfab: Microbiology & Infectiology Edition** · `medkayfab_microbiology_infectiology` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 63 | **Neonatal Medicine: The Micro-Battalion** · `medkayfab_neonatal_medicine` | KFB_SC16 | KFB_SC17, KFB_SC18 |
| 64 | **Nephrology Edition — MedKayfab** · `medkayfab_nephrology` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 65 | **MedKayfab: Neuroanatomy Edition** · `medkayfab_neuroanatomy` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 66 | **Neurology Edition** · `medkayfab_neurology` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 67 | **Nursing & Care: The Vigilance Vanguard** · `medkayfab_nursing_care` | KFB_SC16 | KFB_SC17, KFB_SC18 |
| 68 | **The Pelvic Proving Grounds — MedKayfab OB/GYN** · `medkayfab_obstetrics_gynaecology` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 69 | **MedKayfab: Oncology Wrestling! — The Hall of Malignant Mirrors** · `medkayfab_oncology` | KFB_SC24 | KFB_SC25, KFB_SC21 |
| 70 | **The Optical Octagon: Focal Points & Retinal Rebels** · `medkayfab_ophthalmology` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 71 | **The Kinetic Chaos — Orthopaedics & Trauma** · `medkayfab_orthopedics_trauma` | KFB_SC12 | KFB_SC11, KFB_SC24 |
| 72 | **ENT: The Sensory Siege** · `medkayfab_otolaryngology_ent` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 73 | **Pathology & Forensic Medicine: The Post-Mortem Posture** · `medkayfab_pathology` | KFB_SC02 | KFB_SC03, KFB_SC04 |
| 74 | **Pediatrics: The Growing Gauntlet** · `medkayfab_pediatrics` | KFB_SC16 | KFB_SC17, KFB_SC18 |
| 75 | **Pharmacology Core Edition** · `medkayfab_pharmacology_01` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 76 | **MedKayfab: Pharmacology Wrestling** · `medkayfab_pharmacology_02` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 77 | **Physiology Wrestling: Life-Force Logic & Homeostatic Heavyweights** · `medkayfab_physiology` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 78 | **Pneumology — MedKayfab Pneumology Wrestling!** · `medkayfab_pneumology` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 79 | **MedKayfab — Psychiatry Wrestling: The Mind-Bending Mat** · `medkayfab_psychiatry` | KFB_SC15 | KFB_SC16, KFB_SC06 |
| 80 | **MedKayfab: Radiology ADD** · `medkayfab_radiology` | KFB_SC02 | KFB_SC03, KFB_SC04 |
| 81 | **MedKayfab: Mnemetic Medicine Mayhem — Anti-Rule Book** · `medkayfab_rules_comic_01` | KFB_SC26 | KFB_SC17, KFB_SC27 |
| 82 | **The Epistemia Edge: Peer-Review Pandemonium!** · `medkayfab_science` | KFB_SC04 | KFB_SC30, KFB_SC16 |
| 83 | **MedKayfab: General Surgery — The Surgical Scrimmage** · `medkayfab_surgery` | KFB_SC12 | KFB_SC11, KFB_SC24 |
| 84 | **The Bedside Ballet: Human Interaction** · `medkayfab_the_bedside_ballet` | KFB_SC16 | KFB_SC17, KFB_SC18 |
| 85 | **Thinking Traps: The Mental Muddle** · `medkayfab_thinking_traps` | KFB_SC02 | KFB_SC03, KFB_SC04 |
| 86 | **Global Outbreak: The Vector Vengeance** · `medkayfab_tropical_medicine` | KFB_SC13 | KFB_SC06, KFB_SC07 |
| 87 | **MedKayfab Urology 01 — The Renal Reservoir: Pressure, Pipes, and the Pelvic Vault** · `medkayfab_urology_01` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 88 | **MedKayfab Urology Wrestling: The Renal Reservoir** · `medkayfab_urology_02` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 89 | **17 Kayfabe-Questions from Socrates to the FBI** · `mind_traps` | KFB_SC02 | KFB_SC03, KFB_SC04 |
| 90 | **Museum of Modern Mess** · `museum_of_modern_mess` | KFB_SC26 | KFB_SC17, KFB_SC27 |
| 91 | **Nibelungen Booster Pack** · `nibelungen_booster_pack_design` | KFB_SC10 | KFB_SC23, KFB_SC25 |
| 92 | **Observation Underground — ADD** · `observation_underground` | KFB_SC03 | KFB_SC02, KFB_SC29 |
| 93 | **Pharaoh Piledriver** · `pharaoh_piledriver` | KFB_SC09 | KFB_SC05, KFB_SC23 |
| 94 | **Plato's Dungeon Raids: The Odyssey Edition** · `philosopher_dungeon_raid` | KFB_SC05 | KFB_SC23, KFB_SC06 |
| 95 | **Plato's Dungeon Raid: Bring Your Own Legend — Hero Set 01** · `platos_dungeon_raid_hero_set_01` | KFB_SC23 | KFB_SC28, KFB_SC05 |
| 96 | **Plato's Dungeon Raid — Full Class Roster v05** · `platos_dungeon_raid_v05` | KFB_SC05 | KFB_SC23, KFB_SC06 |
| 97 | **Dramatic Drops & Krazy Konflikts** · `plot_pusher_posse` | KFB_SC26 | KFB_SC17, KFB_SC27 |
| 98 | **Programming the Whole Child** · `programming_the_whole_child` | KFB_SC21 | KFB_SC03, KFB_SC15 |
| 99 | **Project Gateway Kayfabe** · `project_gateway_kayfabe` | KFB_SC03 | KFB_SC02, KFB_SC29 |
| 100 | **Propositum 2040: Forget Utopia, Ignore Dystopia, Embrace Protopia** · `protopia_web` | KFB_SC18 | KFB_SC28, KFB_SC07 |
| 101 | **Reality Redrawn** · `reality_redrawn` | KFB_SC02 | KFB_SC03, KFB_SC04 |
| 102 | **Romantic Love-Wrestling & Krass Kayfabe-Heartbreaks** · `romantic_kayfabe` | KFB_SC14 | KFB_SC01, KFB_SC15 |
| 103 | **Medicine Madness: The Waiting Room Anarchy** · `saboteur_sketchbook_medicine_history_psyops_add_` | KFB_SC02 | KFB_SC03, KFB_SC04 |
| 104 | **Secret Spy Suplexes** · `secret_spy_suplexes` | KFB_SC03 | KFB_SC02, KFB_SC29 |
| 105 | **Shadow Monopoly: The Great Octopus Wrestling Match — BlackRock, Vanguard & Co** · `shadow_monopoly_blackrock_vanguard_co` | KFB_SC03 | KFB_SC02, KFB_SC29 |
| 106 | **Ruled by Organized Kayfabe-Krime** · `shadow_politics` | KFB_SC21 | KFB_SC03, KFB_SC15 |
| 107 | **Shakespearean Animal Beatdown — The Shakespearean Expansion** · `shakespearean_animal_beatdown` | KFB_SC30 | KFB_SC14, KFB_SC26 |
| 108 | **Sonic Slaughterhouse — Music Industry** · `sonic_slaughterhouse` | KFB_SC27 | KFB_SC30, KFB_SC26 |
| 109 | **The Iceberg Session Cards** · `sonic_warfare_music_history_01` | KFB_SC27 | KFB_SC30, KFB_SC26 |
| 110 | **The Most Suppressed Books** · `suppressed_book_deck` | KFB_SC04 | KFB_SC30, KFB_SC16 |
| 111 | **Symphonic Savagery** · `symphonic_savagery` | KFB_SC30 | KFB_SC04, KFB_SC26 |
| 112 | **The Bard's Barnyard Beatdown** · `the_bards_barnyard_beatdown` | KFB_SC30 | KFB_SC26, KFB_SC04 |
| 113 | **The Biological Metropolis** · `the_biological_metropolis` | KFB_SC11 | KFB_SC12, KFB_SC02 |
| 114 | **The Biology of Rebellion** · `the_biology_of_rebellion_hilfe_ich_bin_ein_mensc` | KFB_SC18 | KFB_SC16, KFB_SC19 |
| 115 | **The Carnival of Unsolved Problems** · `the_carnival_of_unsolved_problems_therapy` | KFB_SC15 | KFB_SC16, KFB_SC06 |
| 116 | **Oscar Wilde's Importance of KAYFAB-EARNEST** · `the_importance_of_being_kayfab_earnest` | KFB_SC01 | KFB_SC14, KFB_SC07 |
| 117 | **Kayfabe Koming-of-Age Wrestling All-Stars** · `the_kayfabe_crucible_coming_of_age` | KFB_SC14 | KFB_SC01, KFB_SC15 |
| 118 | **The Kayfabe Money Trail: 9/11** · `the_kayfabe_money_trail_9_11` | KFB_SC02 | KFB_SC03, KFB_SC04 |
| 119 | **How To Stage A Cover-Up** · `the_kayfabizarro_manifesto_cover_up` | KFB_SC02 | KFB_SC03, KFB_SC04 |
| 120 | **THE MOVE: A Field Guide to Managed Reactions** · `the_move_1` | KFB_SC03 | KFB_SC02, KFB_SC29 |
| 121 | **The Move: A Field Guide to Managed Reactions** · `the_move_id` | KFB_SC03 | KFB_SC02, KFB_SC29 |
| 122 | **The Pharaoh Script — Psychology of Evil** · `the_pharaoh_script_psychology_of_evil` | KFB_SC09 | KFB_SC05, KFB_SC23 |
| 123 | **The Uruk Rumble** · `the_uruk_rumble` | KFB_SC10 | KFB_SC23, KFB_SC25 |
| 124 | **Trust & Betrayal — The 'Trust Me, Bro' Edition** · `trust_and_betrayal` | KFB_SC15 | KFB_SC16, KFB_SC06 |
| 125 | **Uncle FrizzleBob's Tragic Flaws** · `uncle_frizzlebob_s_tragic_flaws_id` | KFB_SC30 | KFB_SC26, KFB_SC04 |
| 126 | **Uncle FrizzleBob’s Tragic Flaws** · `uncle_frizzlebob_s_tragic_flaws_shakespeare` | KFB_SC30 | KFB_SC26, KFB_SC04 |
| 127 | **Unspoken Systems — Kayfabizarro Meta Deck 01** · `unspoken_systems_kayfabizarro_meta_deck_01` | KFB_SC04 | KFB_SC30, KFB_SC16 |
| 128 | **What Work Was For: A Field Report from Before the Timesheet — Vol. I** · `what_work_was_for` | KFB_SC17 | KFB_SC01, KFB_SC28 |
| 129 | **Wine, Woad & Warrior Chiefs** · `woad_and_warriors` | KFB_SC10 | KFB_SC23, KFB_SC25 |
| 130 | **Fractal Future Fantasy: The Wrinkle-Rumble Starter Kit** · `wrinkle_rumble` | KFB_SC15 | KFB_SC16, KFB_SC06 |

## Scope, listening and mapping acceptance

- 130/130 canonical deck identities each have one primary recommendation. The full relation table is in the paired machine-readable JSON; the map only claims **deck-title/type/tag-level** theme correspondence, not review of individual Card text or music stems.
- Four physical-scene oriented titles (coast, polar, scenic road, night drive) may have no primary deck because they intentionally cover **WorldRecipe/route context**; they are still valid secondary map targets. They do not invent new Decks.
- Existing canonical three world decks remain intact: `forget_utopia`, `ignore_dystopia`, `embrace_protopia`. Existing source-proven playable songs always take precedence over generating needless duplicates.
- Very broad families like MedKayfab deliberately share a few core music slots instead of purchasing a separate song for 40+ medically specialized decks; dramatic variants are secondary and can be curated per live scene.
- Track context, festival/performance and NPC gifts remain different original event owners; earning songs still flows through **PlayerSave / Lean Memory / Journey** and Golden Demon Lord full-song completion remains unchanged.
- No music or playback generated in this mapping; human listening KEEP/TUNE/FAIL is deferred as user requested. No date was given for a scheduled reminder.
