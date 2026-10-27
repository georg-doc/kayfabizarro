# Deck-Abgleich R1 – main gegen Spielstand (24.10.2026)

Automatisch, ohne PDF-Lesen. Erzeugt mit `deck_abgleich_r1.py` (liegt daneben), Rohdaten in `DECK_ABGLEICH_R1.json`.

- **main** = `origin/main` @ 7e1c4ab (media/kfb zuletzt geändert am 04.08.)
- **Spielstand** = `origin/ws1/karten-druck-spiel` @ 0c20db9 = `52adc8f1` (15.10.) + Druckfassung Mission Control, Ego Mania, Brain Flipper #59

## Wichtigster Befund: die Richtung ist umgekehrt

`52adc8f1` ist **nicht älter** als main, sondern **neuer**. Er sitzt auf einer Abzweigung vom 12.10. (`ac9dbaed`) mit 39 Commits „Drucktext kanonisch“ vom 14./15.10., die **nie nach main gemergt** wurden. main hat seit der Abzweigung keine Änderung an `media/kfb`.

Was main von außen wie „große Änderungen“ aussehen lässt, ist der alte Stand:
- **Versalien-Titel:** main hat sie noch. Der Spielstand hat sie nach V-271 schon in Titelschreibung, die Druckschreibweise in `cardNamePrint` (1503 Titel, 44 Decks, `CARD_TITLE_CASE_R1.md`).
- **Kartenzahlen:** gleich, bis auf zwei Fälle: `anti_rules_toolkit` (main 57 mit doppelter Karte #51, Spiel 56) und `frizzlebob_s_ego_mania_narcissist` (main 56, Spiel 48 nach Druck). `trust_and_betrayal` und `pharaoh_piledriver` haben in beiden Ständen 56 bzw. 52 Karten; dort weicht nur der Text ab (main = alter Text, Spiel = Druck).
- **Texte:** In 41 Decks weichen Power/Lore ab. Das ist der Drucktext-Abgleich vom 14.10. (698 Karten kanonisiert, alter Wert in `jsonLegacy`).

Weitere Druckarbeit, die weder auf main noch im Spiel ist: `data/kfb-card-fixes-batch8-2026-10-16` @ 4d4b811 (Pharaoh #46, Trust #30, Cosmic #20/#40, Observation 5 Karten).

**Folge:** `ws1/karten-druck` (@bc00877, auf main) bringt nur 3 Decks Druckfassung nach main. Die 14.10.-Arbeit fehlt dort. Ein Merge nach main sollte auf der 52adc8f1-Linie aufbauen, nicht auf main.

## Druckstand je Deck

| Stand | Decks | Bedeutung |
|---|---:|---|
| A Sichtung 14.10. | 59 | OCR gegen JSON; jede auffällige Karte am Seitenbild angesehen und auf Druck gesetzt. Karten ohne OCR-Befund nicht einzeln angesehen. 19 Karten OPEN. |
| C nicht geprüft | 17 | Seiten-/Viertel-Zuordnung war am 14.10. unsicher (UNSAFE), deshalb ausgelassen |
| D Druck neu erfasst 23.10. | 2 | Mission Control, Ego Mania (`ws1/karten-druck`) |
| E nie geprüft | 52 | alle MedKayfab-Decks; nicht im WS1-Pool |

Abgleich main ↔ Spiel (Klasse):

| Klasse | Decks |
|---|---:|
| gleich | 60 |
| nur Schreibweise | 27 |
| Text abweichend | 41 |
| Karten fehlen/neu | 2 |
| unklar | 0 |

## Bewertung (Bestand)

Inflation ist messbar: Karten-Grades über alle Decks G1 3853 (56 %), G2 2705 (39 %), G3 330 (5 %). `overallScore` ist bei 94 Decks 9 und bei 25 Decks 8, kein Deck darunter. `viralScore` 8–10 bei 115 von 130 Decks. Extraktion: `cowork_task_v3` 116, `chatgpt_v6` 11, Rest einzeln. Eine schriftliche Definition von G1/G2/G3 fand sich im Repo nicht.

## MVP-Umfang (Lead 24.10.)

| Deck | Rolle | Karten | Druckstand | main ↔ Spiel |
|---|---|---:|---|---|
| `forget_utopia` | Bühne | 56 | A (0 kanonisiert, 1 bestätigt, 0 OPEN) | gleich |
| `ignore_dystopia` | Trio | 56 | A (6 kanonisiert, 9 bestätigt, 0 OPEN) | Text abweichend |
| `embrace_protopia` | Trio | 56 | A (0 kanonisiert, 0 bestätigt, 0 OPEN) | nur Schreibweise |
| `frizzlebob_s_mission_control` | SIM lorekeeper | 56 | D | Text abweichend |
| `frizzlebob_s_ego_mania_narcissist` | SIM kayfabrick_bot | 48 | D | Karten fehlen/neu |
| `the_bards_barnyard_beatdown` | SIM farmer_b | 56 | A (4 kanonisiert, 6 bestätigt, 0 OPEN) | Text abweichend |
| `sonic_warfare_music_history_01` | SIM skeleton_warrior | 48 | A (2 kanonisiert, 10 bestätigt, 0 OPEN) | Text abweichend |
| `the_kayfabe_money_trail_9_11` | SIM skeleton_rogue | 60 | A (6 kanonisiert, 17 bestätigt, 0 OPEN) | Text abweichend |
| `symphonic_savagery` | SIM skeleton_mage | 56 | A (27 kanonisiert, 29 bestätigt, 0 OPEN) | Text abweichend |
| `geopolitical_thrillers_conspiracy_theories` | SIM toy_soldier | 56 | C | gleich |
| `anti_rules_toolkit` | SIM orc_legacy_b | 56 | C | Karten fehlen/neu |
| `shadow_politics` | SIM orc_raider | 48 | A (0 kanonisiert, 0 bestätigt, 0 OPEN) | nur Schreibweise |
| `the_biology_of_rebellion_hilfe_ich_bin_ein_mensc` | SIM orc_brute | 36 | A (9 kanonisiert, 27 bestätigt, 0 OPEN) | Text abweichend |
| `cinematic_kayfabizarro_2` | SIM orc_legacy_a | 56 | A (35 kanonisiert, 21 bestätigt, 0 OPEN) | Text abweichend |
| `the_uruk_rumble` | Signatur orc_brute (0 Karten) | 54 | C | nur Schreibweise |

Lücken im MVP: `geopolitical_thrillers_conspiracy_theories` und `anti_rules_toolkit` sind nie gegen den Druck geprüft. `the_uruk_rumble` (Signatur-Deck Orc Brute) hat bei allen 54 Karten Power und Lore leer.

## Alle Decks

| Deck | Karten main/Spiel | Klasse | Titel nur Schreibweise | Titel anders | Power anders | Lore anders | Druckstand | MVP |
|---|---|---|---:|---:|---:|---:|---|---|
| `1001_kayfabe_nights` | 60/60 | Text abweichend | 59 | 0 | 3 | 2 | A |  |
| `academic_anarchy_intellectual` | 56/56 | nur Schreibweise | 56 | 0 | 0 | 0 | A |  |
| `ai_kayfabe` | 56/56 | Text abweichend | 0 | 1 | 41 | 46 | A |  |
| `big_bad_brain_wrestling` | 56/56 | Text abweichend | 0 | 2 | 4 | 5 | A |  |
| `brain_flipper_image_spots` | 60/60 | Text abweichend | 0 | 0 | 30 | 32 | A |  |
| `cinematic_kayfabizarro_2` | 56/56 | Text abweichend | 56 | 0 | 19 | 25 | A | SIM orc_legacy_a |
| `cosmic_grift_dark_journalism` | 60/60 | Text abweichend | 0 | 0 | 4 | 3 | A |  |
| `dream_wrestling_with_kayfabe_freud` | 56/56 | Text abweichend | 51 | 0 | 0 | 2 | A |  |
| `embrace_protopia` | 56/56 | nur Schreibweise | 1 | 0 | 0 | 0 | A | Trio |
| `epistemic_sabotage` | 60/60 | gleich | 0 | 0 | 0 | 0 | A |  |
| `forget_utopia` | 56/56 | gleich | 0 | 0 | 0 | 0 | A | Bühne |
| `frizzlebob_s_kayfabizarro_kompendium_elender_wic` | 60/60 | Text abweichend | 0 | 0 | 6 | 11 | A |  |
| `grimms_kayfabe_legends_expansion_set_02` | 52/52 | nur Schreibweise | 52 | 0 | 0 | 0 | A |  |
| `help_i_am_a_human` | 56/56 | Text abweichend | 56 | 0 | 0 | 1 | A |  |
| `human_nature_uncut_hilfe_ich_bin_ein_mensch` | 56/56 | Text abweichend | 56 | 0 | 5 | 6 | A |  |
| `ideology_wrestling` | 68/68 | nur Schreibweise | 68 | 0 | 0 | 0 | A |  |
| `ignore_dystopia` | 56/56 | Text abweichend | 1 | 0 | 3 | 4 | A | Trio |
| `kayfabizarro_1_morale_ethics` | 56/56 | gleich | 0 | 0 | 0 | 0 | A |  |
| `kayfabizarro_monomyth_mayhem` | 56/56 | Text abweichend | 3 | 0 | 31 | 28 | A |  |
| `kayfabizarro_monopolies_manipulation_murder_vol` | 56/56 | gleich | 0 | 0 | 0 | 0 | A |  |
| `kayfabizarro_philosophy` | 68/68 | Text abweichend | 0 | 0 | 38 | 36 | A |  |
| `kayfabizarro_pulitzer_punk` | 60/60 | Text abweichend | 0 | 0 | 7 | 16 | A |  |
| `kayfabizarro_siege_tower_wall_siege_kampaigns` | 60/60 | Text abweichend | 0 | 0 | 1 | 1 | A |  |
| `kayfabizzaro_politics` | 52/52 | gleich | 0 | 0 | 0 | 0 | A |  |
| `kosmik_kayfabizarro_sci_fi_space_opera` | 56/56 | Text abweichend | 56 | 0 | 2 | 4 | A |  |
| `kreative_kayfab_creative_hero_journey` | 52/52 | Text abweichend | 0 | 1 | 52 | 52 | A |  |
| `mind_traps` | 56/56 | nur Schreibweise | 52 | 0 | 0 | 0 | A |  |
| `museum_of_modern_mess` | 60/60 | Text abweichend | 0 | 0 | 1 | 0 | A |  |
| `nibelungen_booster_pack_design` | 60/60 | Text abweichend | 0 | 0 | 10 | 13 | A |  |
| `pharaoh_piledriver` | 52/52 | Text abweichend | 52 | 0 | 8 | 3 | A |  |
| `platos_dungeon_raid_v05` | 56/56 | gleich | 0 | 0 | 0 | 0 | A |  |
| `plot_pusher_posse` | 56/56 | nur Schreibweise | 56 | 0 | 0 | 0 | A |  |
| `programming_the_whole_child` | 60/60 | nur Schreibweise | 57 | 0 | 0 | 0 | A |  |
| `project_gateway_kayfabe` | 60/60 | nur Schreibweise | 4 | 0 | 0 | 0 | A |  |
| `protopia_web` | 56/56 | gleich | 0 | 0 | 0 | 0 | A |  |
| `reality_redrawn` | 60/60 | Text abweichend | 60 | 0 | 6 | 6 | A |  |
| `romantic_kayfabe` | 56/56 | Text abweichend | 4 | 0 | 10 | 14 | A |  |
| `saboteur_sketchbook_medicine_history_psyops_add_` | 56/56 | Text abweichend | 1 | 2 | 46 | 49 | A |  |
| `secret_spy_suplexes` | 56/56 | Text abweichend | 16 | 0 | 0 | 4 | A |  |
| `shadow_politics` | 48/48 | nur Schreibweise | 48 | 0 | 0 | 0 | A | SIM orc_raider |
| `sonic_slaughterhouse` | 56/56 | Text abweichend | 12 | 0 | 1 | 0 | A |  |
| `sonic_warfare_music_history_01` | 48/48 | Text abweichend | 47 | 0 | 0 | 2 | A | SIM skeleton_warrior |
| `suppressed_book_deck` | 20/20 | Text abweichend | 0 | 0 | 3 | 1 | A |  |
| `symphonic_savagery` | 56/56 | Text abweichend | 0 | 0 | 13 | 20 | A | SIM skeleton_mage |
| `the_bards_barnyard_beatdown` | 56/56 | Text abweichend | 0 | 0 | 1 | 3 | A | SIM farmer_b |
| `the_biology_of_rebellion_hilfe_ich_bin_ein_mensc` | 36/36 | Text abweichend | 8 | 0 | 6 | 3 | A | SIM orc_brute |
| `the_carnival_of_unsolved_problems_therapy` | 48/48 | Text abweichend | 0 | 30 | 48 | 48 | A |  |
| `the_kayfabe_crucible_coming_of_age` | 48/48 | Text abweichend | 0 | 0 | 1 | 2 | A |  |
| `the_kayfabe_money_trail_9_11` | 60/60 | Text abweichend | 0 | 0 | 3 | 5 | A | SIM skeleton_rogue |
| `the_kayfabizarro_manifesto_cover_up` | 60/60 | Text abweichend | 0 | 0 | 2 | 3 | A |  |
| `the_move_1` | 56/56 | gleich | 0 | 0 | 0 | 0 | A |  |
| `the_move_id` | 56/56 | Text abweichend | 0 | 0 | 3 | 5 | A |  |
| `the_pharaoh_script_psychology_of_evil` | 60/60 | gleich | 0 | 0 | 0 | 0 | A |  |
| `trust_and_betrayal` | 56/56 | Text abweichend | 56 | 0 | 51 | 46 | A |  |
| `uncle_frizzlebob_s_tragic_flaws_id` | 56/56 | Text abweichend | 0 | 0 | 0 | 1 | A |  |
| `uncle_frizzlebob_s_tragic_flaws_shakespeare` | 56/56 | Text abweichend | 0 | 2 | 56 | 55 | A |  |
| `what_work_was_for` | 56/56 | gleich | 0 | 0 | 0 | 0 | A |  |
| `woad_and_warriors` | 52/52 | Text abweichend | 0 | 0 | 20 | 18 | A |  |
| `wrinkle_rumble` | 48/48 | gleich | 0 | 0 | 0 | 0 | A |  |
| `anti_rules_toolkit` | 57/56 | Karten fehlen/neu | 0 | 6 | 6 | 6 | C | SIM orc_legacy_b |
| `bullshit_jobs_uncut` | 56/56 | gleich | 0 | 0 | 0 | 0 | C |  |
| `deep_state_plumbing` | 52/52 | nur Schreibweise | 52 | 0 | 0 | 0 | C |  |
| `federal_kayfabe` | 60/60 | gleich | 0 | 0 | 0 | 0 | C |  |
| `geopolitical_thrillers_conspiracy_theories` | 56/56 | gleich | 0 | 0 | 0 | 0 | C | SIM toy_soldier |
| `jung_and_shinn_a_guide_to_cosmic_cringe` | 60/60 | nur Schreibweise | 60 | 0 | 0 | 0 | C |  |
| `kayfabizarro_improv_comedy` | 60/60 | nur Schreibweise | 2 | 0 | 0 | 0 | C |  |
| `kayfabizarros_ontological_hazards` | 47/47 | gleich | 0 | 0 | 0 | 0 | C |  |
| `observation_underground` | 48/48 | nur Schreibweise | 43 | 0 | 0 | 0 | C |  |
| `philosopher_dungeon_raid` | 20/20 | nur Schreibweise | 20 | 0 | 0 | 0 | C |  |
| `platos_dungeon_raid_hero_set_01` | 56/56 | gleich | 0 | 0 | 0 | 0 | C |  |
| `shadow_monopoly_blackrock_vanguard_co` | 60/60 | nur Schreibweise | 56 | 0 | 0 | 0 | C |  |
| `shakespearean_animal_beatdown` | 7/7 | gleich | 0 | 0 | 0 | 0 | C |  |
| `the_biological_metropolis` | 32/32 | nur Schreibweise | 32 | 0 | 0 | 0 | C |  |
| `the_importance_of_being_kayfab_earnest` | 10/10 | gleich | 0 | 0 | 0 | 0 | C |  |
| `the_uruk_rumble` | 54/54 | nur Schreibweise | 54 | 0 | 0 | 0 | C | Signatur orc_brute (0 Karten) |
| `unspoken_systems_kayfabizarro_meta_deck_01` | 56/56 | Text abweichend | 55 | 1 | 0 | 0 | C |  |
| `frizzlebob_s_ego_mania_narcissist` | 56/48 | Karten fehlen/neu | 0 | 11 | 29 | 38 | D | SIM kayfabrick_bot |
| `frizzlebob_s_mission_control` | 56/56 | Text abweichend | 0 | 21 | 56 | 43 | D | SIM lorekeeper |
| `medkayfab_ancestral_medicine` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_atomic_elements` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_biochemistry` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_cardiology` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_clinical_cases` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_dentistry` | 56/56 | nur Schreibweise | 1 | 0 | 0 | 0 | E |  |
| `medkayfab_dermatology_01` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_dermatology_02` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_diagnostic_tools` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_differential_diagnosis` | 56/56 | nur Schreibweise | 8 | 0 | 0 | 0 | E |  |
| `medkayfab_disease_timelines` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_emergency_medicine` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_endocrinology` | 56/56 | nur Schreibweise | 5 | 0 | 0 | 0 | E |  |
| `medkayfab_essential_pharmacology` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_gastrology` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_genetics` | 56/56 | nur Schreibweise | 4 | 0 | 0 | 0 | E |  |
| `medkayfab_geriatrics` | 56/56 | nur Schreibweise | 28 | 0 | 0 | 0 | E |  |
| `medkayfab_gross_anatomy` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_hematology` | 52/52 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_histology` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_hospital_hierarchy` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_immunology` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_intensive_care_medicine` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_internal_medicine` | 56/56 | nur Schreibweise | 24 | 0 | 0 | 0 | E |  |
| `medkayfab_laboratory_medicine` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_microbiology_infectiology` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_neonatal_medicine` | 52/52 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_nephrology` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_neuroanatomy` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_neurology` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_nursing_care` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_obstetrics_gynaecology` | 56/56 | nur Schreibweise | 4 | 0 | 0 | 0 | E |  |
| `medkayfab_oncology` | 60/60 | nur Schreibweise | 59 | 0 | 0 | 0 | E |  |
| `medkayfab_ophthalmology` | 55/55 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_orthopedics_trauma` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_otolaryngology_ent` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_pathology` | 56/56 | nur Schreibweise | 4 | 0 | 0 | 0 | E |  |
| `medkayfab_pediatrics` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_pharmacology_01` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_pharmacology_02` | 54/54 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_physiology` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_pneumology` | 52/52 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_psychiatry` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_radiology` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_rules_comic_01` | 0/0 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_science` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_surgery` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_the_bedside_ballet` | 25/25 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_thinking_traps` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_tropical_medicine` | 56/56 | nur Schreibweise | 4 | 0 | 0 | 0 | E |  |
| `medkayfab_urology_01` | 52/52 | gleich | 0 | 0 | 0 | 0 | E |  |
| `medkayfab_urology_02` | 56/56 | gleich | 0 | 0 | 0 | 0 | E |  |
