# Deck-Daten-Prüfung R1 · `media/kfb/index.json` gegen Karten-JSONs

Stand 2026-10-09 · Claude Code · Quelle `georg-doc/kayfabizarro@main` (`kfb-deck-registry/v2`, 130 Decks). Echte PDF-Seitenzahlen sind **nicht** gemessen (das macht der Work-Job mit pdf.js).

**Auffällig: 22 von 130 Decks.** Alle anderen: Schema `cardNumber/cardName`, Kartenzahl passt, Seiten passen.

| packId | Karten (Index) | Seiten (Index) | Karten (JSON) | Schema | Befund |
| --- | ---: | ---: | ---: | --- | --- |
| `ai_kayfabe` | 56 | 15 | 56 | num/name | Schema |
| `anti_rules_toolkit` | 57 | 16 | 57 | num/name | Schema; Kartenzahl nicht durch 4 teilbar |
| `brain_flipper_image_spots` | 60 | 16 | 60 | num/name | Schema |
| `federal_kayfabe` | 60 | 16 | 60 | num/name | Schema |
| `frizzlebob_s_ego_mania_narcissist` | 56 | 15 | 56 | num/name | Schema |
| `frizzlebob_s_kayfabizarro_kompendium_elender_wic` | 60 | 16 | 60 | num/name | Schema |
| `frizzlebob_s_mission_control` | 56 | 15 | 56 | num/name | Schema |
| `kayfabizarros_ontological_hazards` | 47 | 13 | 47 | name only | Schema; Kartenzahl nicht durch 4 teilbar |
| `kreative_kayfab_creative_hero_journey` | 52 | 14 | 52 | name only | Schema |
| `medkayfab_gastrology` | 56 | 15 | 56 | cardNumber/name | Schema |
| `medkayfab_ophthalmology` | 55 | 15 | 55 | cardNumber/cardName | Kartenzahl nicht durch 4 teilbar |
| `medkayfab_pharmacology_02` | 54 | 15 | 54 | cardNumber/cardName | Kartenzahl nicht durch 4 teilbar |
| `medkayfab_rules_comic_01` | 0 | 2 | 0 | keine Karten | Schema |
| `medkayfab_the_bedside_ballet` | 25 | 8 | 25 | cardNumber/cardName | Kartenzahl nicht durch 4 teilbar |
| `philosopher_dungeon_raid` | 20 | 15 | 20 | cardNumber/cardName | Index-Seiten 15 ≫ nötig 6 |
| `shakespearean_animal_beatdown` | 7 | 15 | 7 | cardNumber/cardName | Kartenzahl nicht durch 4 teilbar; Index-Seiten 15 ≫ nötig 3 |
| `suppressed_book_deck` | 20 | 8 | 20 | cardNumber/cardName | Index-Seiten 8 ≫ nötig 6 |
| `the_bards_barnyard_beatdown` | 56 | 19 | 56 | cardNumber/cardName | Index-Seiten 19 ≫ nötig 15 |
| `the_carnival_of_unsolved_problems_therapy` | 48 | 13 | 48 | name only | Schema |
| `the_importance_of_being_kayfab_earnest` | 10 | 15 | 10 | cardNumber/cardName | Kartenzahl nicht durch 4 teilbar; Index-Seiten 15 ≫ nötig 4 |
| `the_uruk_rumble` | 54 | 15 | 54 | cardNumber/cardName | Kartenzahl nicht durch 4 teilbar |
| `uncle_frizzlebob_s_tragic_flaws_shakespeare` | 56 | 15 | 56 | name only | Schema |
