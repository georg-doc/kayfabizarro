# Kartentext kanonisch = Drucktext – R1 (14.10.2026)

Basis: `data/kfb-card-print-text-2026-10-14` @ `7da0a70` (Drucktext-Abgleich R1, `PRINT_TEXT_AUDIT_R1.md`). Ziel: `cardName`, `power`, `lore` im Karten-JSON entsprechen dem gedruckten Kartentext der PDF v05. Keine PDFs, keine Bilder im Repo.

## Ergebnis

- Bearbeitet: **55 Decks** (alle Decks aus dem Audit mit WORDING_DIFF, MISSING oder UNSURE).
- **698 Karten kanonisiert** (Drucktext übernommen, alter Wert in `jsonLegacy`), **593 Karten bestätigt** (Druck = JSON, nur `textSource` ergänzt), **19 Karten OPEN** (unverändert, Grund unten).
- Alle 658 `print`-Blöcke sind abgearbeitet; 6 bleiben nur an OPEN-Karten stehen (dort unverändert gelassen).
- Alle 13+1 systematisch abweichenden Decks sind am Seitenbild Karte für Karte transkribiert. `kreative_kayfab`, `carnival_therapy` und `tragic_flaws_shakespeare` trugen Kurzfassungen; dort sind jetzt die gedruckten Texte drin.
- 37 Kartentitel wurden an den Druck angepasst (Liste unten). Das betrifft Systeme, die über den Titel zuordnen.

## Methode

1. **Welche Karten:** alle Karten mit `print`-Block (high/medium/low) und alle Karten, deren Text nicht sicher mit dem JSON übereinstimmt. Die UNSURE-Liste des Audits liegt nicht im Repo; deshalb eigener OCR-Lauf (Apple Vision, Viertel 4-fach gerendert, nur gelesen). Geprüft wurde jede Karte, bei der mindestens ein JSON-Wort im OCR-Text fehlt. Die Audit-UNSURE-Liste ist damit nicht 1:1 nachgebildet: Karten, die der schärfere OCR-Lauf vollständig mit dem JSON deckungsgleich liest, gelten als „ohne Befund“ (z. B. `the_move_1`: Audit 16 UNSURE, hier 2 auffällig).
2. **Ansehen:** jede dieser Karten am gerenderten Seitenbild (PDFKit, Seite bzw. Viertel, Zoom bei Kleinschrift) angesehen und POWER/LORE wie gedruckt übernommen. Auch `confidence: high`-Blöcke wurden alle angesehen (nicht nur Stichprobe), weil die OCR-Blöcke oft Zeilen vertauschen.
3. **Schreiben:** `cardName`/`power`/`lore` = Druck. Vorher-Werte in `jsonLegacy {cardName, power, lore}`. `print`-Block entfernt. Neu `textSource {source: "PDF v05 <Datei> p<Seite> <Viertel>", method: "visual-check", checkedAt: "2026-10-14"}`. Bestätigte Karten bekommen nur `textSource`.
4. **Druckfehler:** eindeutige Glyphen-/Tippfehler der Druckschrift (z. B. Schreibmaschinenfont mit verformten m/s/e, `Cognitive Dissenance`) sind im Kanontext als gemeintes Wort geschrieben und im Feld `printTypo` dokumentiert. Absichtlich wirkende Eigenheiten (z. B. `flonsiousness`, `Masted armies`, doppelte Wörter) bleiben wörtlich, ebenfalls mit `printTypo`. Mitgedruckte Layout-Artefakte (Schriftnamen wie "Architects Daughter", "Courier Prime") stehen nur in `printTypo`, nicht im Text.
5. **Unsicher → OPEN:** wenn der Druck nicht sicher lesbar ist (meist Textende unter dem GW-Signaturlogo) oder kein Text gedruckt ist, bleibt die Karte unverändert.
6. **Format:** jede Datei behält ihr bisheriges JSON-Format (Einrückung 2 oder 0). Zwei Dateien mit gemischtem Stil (`Mind_Traps`, `Reality_Redrawn`) werden nur an den geänderten Kartenobjekten neu geschrieben.

## Je Deck

| Deck | Karten | kanonisiert | bestätigt | OPEN | ohne Befund* | Struktur |
|---|---:|---:|---:|---:|---:|---|
| `kayfabizarro_monomyth_mayhem` | 56 | 36 | 8 | 0 | 12 | ok |
| `protopia_web` | 56 | 0 | 6 | 0 | 50 | ok |
| `help_i_am_a_human` | 56 | 1 | 6 | 0 | 49 | ok |
| `wrinkle_rumble` | 48 | 0 | 0 | 0 | 48 | ok |
| `1001_kayfabe_nights` | 60 | 4 | 6 | 0 | 50 | ok |
| `academic_anarchy_intellectual` | 56 | 0 | 21 | 0 | 35 | ok |
| `ai_kayfabe` | 56 | 51 | 5 | 0 | 0 | kein cardCount; `num`/`name` statt cardNumber/cardName |
| `big_bad_brain_wrestling` | 56 | 4 | 8 | 3 | 41 | ok |
| `brain_flipper_image_spots` | 60 | 43 | 17 | 0 | 0 | kein cardCount; `num`/`name` statt cardNumber/cardName |
| `cinematic_kayfabizarro_2` | 56 | 35 | 21 | 0 | 0 | ok |
| `cosmic_grift_dark_journalism` | 60 | 5 | 15 | 2 | 38 | ok |
| `dream_wrestling_with_kayfabe_freud` | 56 | 2 | 12 | 1 | 41 | ok |
| `embrace_protopia` | 56 | 0 | 0 | 0 | 56 | cardName „The Open Question“ 2× (wie gedruckt) |
| `epistemic_sabotage` | 60 | 0 | 11 | 0 | 49 | ok |
| `forget_utopia` | 56 | 0 | 1 | 0 | 55 | ok |
| `frizzlebob_s_kayfabizarro_kompendium_elender_wic` | 60 | 11 | 7 | 0 | 42 | kein cardCount; `num`/`name` statt cardNumber/cardName |
| `grimms_kayfabe_legends_expansion_set_02` | 52 | 0 | 13 | 0 | 39 | ok |
| `human_nature_uncut_hilfe_ich_bin_ein_mensch` | 56 | 10 | 6 | 0 | 40 | ok |
| `ideology_wrestling` | 68 | 0 | 13 | 0 | 55 | ok |
| `ignore_dystopia` | 56 | 6 | 9 | 0 | 41 | ok |
| `kayfabizarro_1_morale_ethics` | 56 | 0 | 9 | 0 | 47 | ok |
| `kayfabizarro_monopolies_manipulation_murder_vol` | 56 | 0 | 9 | 1 | 46 | ok |
| `kayfabizarro_philosophy` | 68 | 50 | 18 | 0 | 0 | ok |
| `kayfabizarro_pulitzer_punk` | 60 | 19 | 3 | 3 | 35 | ok |
| `kayfabizarro_siege_tower_wall_siege_kampaigns` | 60 | 2 | 9 | 0 | 49 | ok |
| `kayfabizzaro_politics` | 52 | 0 | 3 | 0 | 49 | ok |
| `kosmik_kayfabizarro_sci_fi_space_opera` | 56 | 5 | 4 | 0 | 47 | ok |
| `kreative_kayfab_creative_hero_journey` | 52 | 52 | 0 | 0 | 0 | kein cardCount; `name` statt cardName; keine Kartennummern |
| `mind_traps` | 56 | 0 | 5 | 0 | 51 | ok |
| `museum_of_modern_mess` | 60 | 1 | 11 | 0 | 48 | ok |
| `nibelungen_booster_pack_design` | 60 | 17 | 11 | 1 | 31 | ok |
| `pharaoh_piledriver` | 52 | 10 | 2 | 0 | 40 | ok |
| `platos_dungeon_raid_v05` | 56 | 0 | 1 | 1 | 54 | ok |
| `plot_pusher_posse` | 56 | 0 | 5 | 0 | 51 | ok |
| `programming_the_whole_child` | 60 | 0 | 20 | 0 | 40 | ok |
| `project_gateway_kayfabe` | 60 | 0 | 18 | 0 | 42 | ok |
| `reality_redrawn` | 60 | 8 | 7 | 0 | 45 | ok |
| `romantic_kayfabe` | 56 | 19 | 37 | 0 | 0 | ok |
| `saboteur_sketchbook_medicine_history_psyops_add_` | 56 | 49 | 6 | 1 | 0 | ok |
| `secret_spy_suplexes` | 56 | 4 | 5 | 1 | 46 | ok |
| `shadow_politics` | 48 | 0 | 0 | 0 | 48 | ok |
| `sonic_slaughterhouse` | 56 | 1 | 10 | 1 | 44 | ok |
| `sonic_warfare_music_history_01` | 48 | 2 | 10 | 0 | 36 | ok |
| `suppressed_book_deck` | 20 | 4 | 2 | 0 | 14 | ok |
| `symphonic_savagery` | 56 | 27 | 29 | 0 | 0 | ok |
| `the_bards_barnyard_beatdown` | 56 | 4 | 6 | 0 | 46 | ok |
| `the_biology_of_rebellion_hilfe_ich_bin_ein_mensc` | 36 | 9 | 27 | 0 | 0 | ok |
| `the_carnival_of_unsolved_problems_therapy` | 48 | 48 | 0 | 0 | 0 | kein cardCount; `name` statt cardName; keine Kartennummern |
| `the_kayfabe_crucible_coming_of_age` | 48 | 2 | 10 | 0 | 36 | ok |
| `the_kayfabe_money_trail_9_11` | 60 | 6 | 17 | 0 | 37 | ok |
| `the_kayfabizarro_manifesto_cover_up` | 60 | 5 | 12 | 1 | 42 | ok |
| `the_move_1` | 56 | 0 | 10 | 1 | 45 | ok |
| `the_move_id` | 56 | 7 | 4 | 1 | 44 | ok |
| `the_pharaoh_script_psychology_of_evil` | 60 | 0 | 8 | 0 | 52 | ok |
| `trust_and_betrayal` | 56 | 54 | 1 | 1 | 0 | ok |
| `uncle_frizzlebob_s_tragic_flaws_id` | 56 | 0 | 56 | 0 | 0 | ok |
| `uncle_frizzlebob_s_tragic_flaws_shakespeare` | 56 | 56 | 0 | 0 | 0 | kein cardCount; `name` statt cardName; keine Kartennummern |
| `what_work_was_for` | 56 | 0 | 0 | 0 | 56 | ok |
| `woad_and_warriors` | 52 | 29 | 23 | 0 | 0 | ok |

\* ohne Befund = OCR deckt sich mit dem JSON, Karte nicht einzeln angesehen, kein `textSource`. Decks ohne Abweichung im Audit (`wrinkle_rumble`, `embrace_protopia`, `shadow_politics`, `what_work_was_for`) wurden nur strukturell geprüft.

## OPEN (unverändert)

- `big_bad_brain_wrestling` #4 The Jobber: Letztes Wort im Druck vom GW-Signaturlogo verdeckt (JSON-Ergänzung in [Klammern] nicht prüfbar); JSON unverändert
- `big_bad_brain_wrestling` #8 The Little Giant: Lore-Ende im Druck vom GW-Signaturlogo verdeckt ('Defying the ph…'); JSON-Ergänzung in [Klammern] nicht prüfbar; JSON und print-Block unverändert
- `big_bad_brain_wrestling` #16 The Chop Fest: Letztes Wort im Druck vom GW-Signaturlogo verdeckt (JSON-Ergänzung in [Klammern] nicht prüfbar); JSON unverändert
- `cosmic_grift_dark_journalism` #20 Nature Elementals: Lore-Ende vom GW-Signaturlogo verdeckt ('…ghost-write your …'); letztes Wort nicht lesbar; JSON unverändert
- `cosmic_grift_dark_journalism` #40 Space Pearl Harbor: Lore-Ende vom GW-Signaturlogo verdeckt ('seize tota…'); JSON trägt '[text truncated]'; unverändert
- `dream_wrestling_with_kayfabe_freud` #2 THE PRECONSCIOUS (Vorbewusst): Verbotener Buchstabe im Druck nicht sicher lesbar (Glyphen-Schrift zeigt 'B' oder 'E'; JSON hat 'I'); JSON unverändert
- `kayfabizarro_monopolies_manipulation_murder_vol` #44 The Cashless Trap: Lore-Ende vom GW-Signaturlogo verdeckt ('total financial yster…'); JSON trägt Platzhalter [UNCLEAR …]; unverändert
- `kayfabizarro_pulitzer_punk` #40 The Whip: Lore-Ende vom GW-Signaturlogo verdeckt; JSON-Ergänzung in [Klammern] nicht prüfbar; unverändert (lesbarer Teil: 'Don't spend time setting the scene! Get them doing things! The tyranny of the writing progr…')
- `kayfabizarro_pulitzer_punk` #48 The Expectation Trap: Lore-Ende vom GW-Signaturlogo verdeckt; JSON-Ergänzung in [Klammern] nicht prüfbar; unverändert
- `kayfabizarro_pulitzer_punk` #52 The Retreat: Lore-Ende vom GW-Signaturlogo verdeckt; JSON-Ergänzung in [Klammern] nicht prüfbar; unverändert
- `nibelungen_booster_pack_design` #40 The Barred Doors: Druck: Power 'Lockdown: No one leaves the game until only one player remains.'; Lore teils vom GW-Signaturlogo verdeckt ('You're not locked in here with me. You're locked in he… the Badger.'); JSON weicht ab, Lore nicht vollständig lesbar; unverändert
- `platos_dungeon_raid_v05` #8 The Weather-Event Barbarian: Lore-Ende vom GW-Signaturlogo verdeckt ('…stops being a character and becom…'); JSON trägt Bearbeitungsnotiz; unverändert
- `saboteur_sketchbook_medicine_history_psyops_add_` #18 Acceptable Business Risk: Druck ohne POWER/LORE-Feld (nur Tafelbild 'Profits > Corpses = OK!'); JSON-Text unverändert
- `secret_spy_suplexes` #16 The Patriotic Lie: Druck: Lore beginnt mit '"Patriotism"' (JSON: "Patriot"); Lore-Ende vom GW-Signaturlogo verdeckt ('…feed you at r…'); unverändert
- `sonic_slaughterhouse` #33 The Tour Bus: Layoutfehler im Druck: Tour-Bus-Viertel ohne Text; Text ('Bus Fever. TRAP all band members. Tension increases by +1 every turn. in Nebraska.') steht im Nachbarviertel 'The Groupie'; JSON unverändert
- `the_kayfabizarro_manifesto_cover_up` #32 The Distraction-Deployment-Dingo: Lore-Ende vom GW-Signaturlogo verdeckt ('…domestic pressure ris…'); JSON 'peaks' passt nicht, Druckwort nicht vollständig lesbar; unverändert
- `the_move_1` #38 The Automation Shield: Druck zeigt auf dieser Karte keinen POWER/LORE-Text (nur Titel und Bild); JSON unverändert
- `the_move_id` #48 The Legal Drag: Druck-Lore weicht ab ('The case reseives; it requires years …'), erstes Verb in Glyphen-Schrift nicht sicher lesbar; JSON unverändert
- `trust_and_betrayal` #30 HEEL-FACE TURN: Druck ohne POWER/LORE (nur Titel und Werte [R] 3 | [A] 4 | [F] 4); JSON-Text unverändert

## Geänderte Kartentitel (wie gedruckt)

Bei Decks ohne Kartennummer (`kreative_kayfab`, `carnival_therapy`, `tragic_flaws_shakespeare`) ist # die Position im JSON.

- `ai_kayfabe` #11: „Claude 3.7's“ → „Claude 3.7's Ghost“
- `kreative_kayfab_creative_hero_journey` #6: „The Post-it Artefact“ → „The Post-it Artifact“
- `saboteur_sketchbook_medicine_history_psyops_add_` #9: „Cantargan / Thalidomide“ → „Contergan / Thalidomide“
- `saboteur_sketchbook_medicine_history_psyops_add_` #47: „The Medication Ad“ → „The Recalled Medication Ad“
- `saboteur_sketchbook_medicine_history_psyops_add_` #56: „The System Is Running on Time“ → „The System is Running on Time“
- `the_carnival_of_unsolved_problems_therapy` #5: „Hall of Distorting Mirrors“ → „The Hall of Distorting Mirrors“
- `the_carnival_of_unsolved_problems_therapy` #6: „Tent of Unnamed Feelings“ → „The Tent of Unnamed Feelings“
- `the_carnival_of_unsolved_problems_therapy` #7: „Rationalization Booth“ → „The Rationalization Fortune Booth“
- `the_carnival_of_unsolved_problems_therapy` #8: „Grand Ringmaster Stage“ → „The Grand Ringmaster Stage“
- `the_carnival_of_unsolved_problems_therapy` #12: „The Promise to Younger Self“ → „The Promise to the Younger Self“
- `the_carnival_of_unsolved_problems_therapy` #15: „Meta-Analysis Loop“ → „The Meta-Analysis Loop“
- `the_carnival_of_unsolved_problems_therapy` #16: „I Can Fix Them Kit“ → „The "I Can Fix Them" Kit“
- `the_carnival_of_unsolved_problems_therapy` #17: „The Gatekeeper (Strike)“ → „The Gatekeeper (On Strike)“
- `the_carnival_of_unsolved_problems_therapy` #18: „Gatekeeper (Overcompensating)“ → „The Gatekeeper (Overcompensating)“
- `the_carnival_of_unsolved_problems_therapy` #20: „Inner Critic (Megaphone)“ → „The Inner Critic (With Megaphone)“
- `the_carnival_of_unsolved_problems_therapy` #23: „Future Splitter“ → „The Future Splitter“
- `the_carnival_of_unsolved_problems_therapy` #24: „Regretometer“ → „The Regretometer“
- `the_carnival_of_unsolved_problems_therapy` #26: „Spiritual Ego Check“ → „The Spiritual Ego Check“
- `the_carnival_of_unsolved_problems_therapy` #29: „Clown Shoe Shuffle“ → „The Clown Shoe Shuffle“
- `the_carnival_of_unsolved_problems_therapy` #30: „Miracle Tonic Pitch“ → „The Miracle Tonic Pitch“
- `the_carnival_of_unsolved_problems_therapy` #31: „Stage Whisper“ → „The Stage Whisper“
- `the_carnival_of_unsolved_problems_therapy` #32: „Juggling Act“ → „The Juggling Act“
- `the_carnival_of_unsolved_problems_therapy` #35: „Bridge We Never Cross“ → „The Bridge We Never Cross“
- `the_carnival_of_unsolved_problems_therapy` #36: „Exit Sign (That Moves)“ → „The Exit Sign (That Moves)“
- `the_carnival_of_unsolved_problems_therapy` #37: „Solo Anti-Journaling“ → „Recipe: Solo Anti-Journaling“
- `the_carnival_of_unsolved_problems_therapy` #38: „Therapist & Client“ → „Recipe: Therapist & Client“
- `the_carnival_of_unsolved_problems_therapy` #39: „The Grey Stone“ → „Recipe: The Grey Stone“
- `the_carnival_of_unsolved_problems_therapy` #40: „7-Day Witness“ → „Recipe: The 7-Day Witness“
- `the_carnival_of_unsolved_problems_therapy` #41: „Couple’s Swap“ → „Recipe: The Couple's Swap“
- `the_carnival_of_unsolved_problems_therapy` #42: „Family Constellation“ → „Recipe: Family Constellation“
- `the_carnival_of_unsolved_problems_therapy` #43: „Workplace Hazard“ → „Recipe: Workplace Hazard“
- `the_carnival_of_unsolved_problems_therapy` #44: „FrizzleBob’s Guarantee“ → „FrizzleBob's Guarantee“
- `the_carnival_of_unsolved_problems_therapy` #45: „The Bardo“ → „Link: The Bardo (Psychedelic)“
- `the_carnival_of_unsolved_problems_therapy` #46: „The Codependent Tango“ → „Link: The Codependent Tango“
- `the_carnival_of_unsolved_problems_therapy` #48: „Back Cover / Manifesto“ → „The Back Cover / Manifesto“
- `uncle_frizzlebob_s_tragic_flaws_shakespeare` #41: „Charmian & Iras“ → „Charmian & Iras, Flamingos“
- `uncle_frizzlebob_s_tragic_flaws_shakespeare` #45: „The Asp“ → „The Asp (Baby Snake)“

## Doppelte Nummern/Titel, Feldnamen, cardCount

- Doppelte `cardNumber`: keine. Nummernlücken: keine.
- Doppelter `cardName`: `embrace_protopia` #29 und #50 heißen beide „The Open Question“. Im Druck ist das ebenso (zwei verschiedene Karten mit gleichem Titel, p9 TL und p14 TR). Kein Strukturfehler, nicht geändert.
- Feldnamen: `ai_kayfabe`, `brain_flipper_image_spots`, `frizzlebob_s_kayfabizarro_kompendium_elender_wic` nutzen `num`/`name` statt `cardNumber`/`cardName`; `kreative_kayfab_creative_hero_journey`, `the_carnival_of_unsolved_problems_therapy`, `uncle_frizzlebob_s_tragic_flaws_shakespeare` nutzen `name` und haben **keine Kartennummern**. Diese sechs Decks haben auch kein `cardCount`. Nicht umbenannt (nicht aus dem Bild beweisbar, betrifft Leser des Formats).
- Alle übrigen Decks: `cardCount` = Anzahl Karten = Registry-`cardCount`; Felder `cardNumber, cardName, power, lore, artworkPrompt` vollständig.
- Druck-Layoutfehler gefunden: `sonic_slaughterhouse` p10 (Text von „The Tour Bus“ steht im Viertel „The Groupie“), `the_move_1`/`the_move_id` p11 („The Automation Shield“ ohne Text), `trust_and_betrayal` #30 und `saboteur_sketchbook` #18 ohne POWER/LORE im Druck.

## 5 Beispiele vorher/nachher

1. **`kayfabizarro_monomyth_mayhem` #1 The Ordinary World**  
   Power vorher: „Stasis Loop. Play this to cancel any Quest progression this turn. Narrate why nothing can change.“ → Druck: „Stasis Loop. Play this to cancel any Quest progression this turn. Narrate why nothing changes.“  
   Lore vorher: „Dysfunction isn't just a state; it's a habit. We normalize the abnormal until the extraordinary seems impossible.“ → Druck: „Dysfunction isn't just a state; it's a habit. We normalize the pain until it feels like home.“  
2. **`kreative_kayfab_creative_hero_journey` #1 The Editor Reflex**  
   Power vorher: „Cancel last card played“ → Druck: „Veto. Cancel the last card played. The player must narrate the next turn as this Cat.“  
   Lore vorher: „Kills ideas before they breathe“ → Druck: „It runs fast and silent. "This is stupid. This won't work." It murders the idea before it has lungs.“  
3. **`saboteur_sketchbook_medicine_history_psyops_add_` #9 Contergan / Thalidomide**  
   Titel: „Cantargan / Thalidomide“ → „Contergan / Thalidomide“  
   Power vorher: „[partially obscured] Believed safe for 2 years, banned in 1961 after birth defects in 10,000+ children.“ → Druck: „Play to automatically win a round, but permanently reduce your max health by half.“  
   Lore vorher: „Believed safe for 2 years, banned in 1961 after birth defects in 10,000+ children. Some scandals survive.“ → Druck: „Deformed 10,000 children, but taught the industry how to survive a regulatory crisis.“  
4. **`kayfabizarro_siege_tower_wall_siege_kampaigns` #20 The Counter-mine**  
   Power vorher: „Tunnel Brawl. Intercept the diggers AND the boom.“ → Druck: „Tunnel Brawl. Intercept the diggers before the boom.“  
5. **`nibelungen_booster_pack_design` #57 Toxic Masculinity**  
   Power vorher: „Ego Boost: +8 Attack, but you cannot retreat or heal. Ever.“ → Druck: „Ego Boost: +5 Attack, but you cannot retreat or heal. Ever.“  

## Offen / nicht Teil dieser Runde

- Die 19 Decks, die die Registry-Korrektur als UNSAFE führt, sind weder im Audit noch hier geprüft (Liste in `PRINT_TEXT_AUDIT_R1.md`).
- Glyphen-Artefakte im JSON: Einige Decks mit Schreibmaschinen-Druckschrift tragen im JSON die verformten Glyphen als Text (z. B. `reality_redrawn` #5 „kinge … loane“, #7 „Syetemic … receelta aeks“; ähnlich `cosmic_grift_dark_journalism`). Wo der OCR dieselben Glyphen liest, fiel die Karte hier nicht auf. Diese Karten brauchen einen eigenen Durchgang „Glyphen → gemeintes Wort“.
- „ohne Befund“-Karten tragen kein `textSource`; ein voller Sichtlauf über alle Karten würde sie bestätigen.
- Die OPEN-Karten brauchen das Original (z. B. PRINT_HQ-PDF ohne Signaturlogo) oder eine Entscheidung des Autors.
