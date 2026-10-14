# Drucktext-Abgleich Karten-JSON gegen PDF v05 – R1 (14.10.2026)

Frage: Steht im Karten-JSON (`cardName`, `power`, `lore`) derselbe Text wie auf der gedruckten Karte? Basis ist der Registry-Stand von `data/kfb-registry-mapping-fix-2026-10-14` @ `a9f5ffa1` (Seite/Viertel je Karte). Die Originalfelder bleiben unverändert. Wo der Druck abweicht, steht der Drucktext zusätzlich im Block `"print"` der Karte.

## Ergebnis

- Geprüft: **59 Decks** (Monomyth Mayhem + alle 58 Decks, die die Registry-Korrektur als SAFE vorhersagt), **3264 Karten**.
- SAME 2443 · WORDING_DIFF 656 · MISSING_IN_JSON 2 · UNSURE 163 · nicht im Registry-PDF 8.
- **14 Decks weichen systematisch ab** (≥ 40 % der lesbaren Karten anders): `kreative_kayfab_creative_hero_journey` (41/41), `the_carnival_of_unsolved_problems_therapy` (19/19), `uncle_frizzlebob_s_tragic_flaws_shakespeare` (53/53), `ai_kayfabe` (46/54), `saboteur_sketchbook_medicine_history_psyops_add_` (44/52), `trust_and_betrayal` (42/53), `kayfabizarro_philosophy` (40/61), `kayfabizarro_monomyth_mayhem` (36/56), `brain_flipper_image_spots` (29/59), `cinematic_kayfabizarro_2` (25/53), `romantic_kayfabe` (23/53), `symphonic_savagery` (23/54), `woad_and_warriors` (22/52), `the_biology_of_rebellion_hilfe_ich_bin_ein_mensc` (15/36). Dort stammt das JSON offenbar aus einem anderen Textstand (andere Formulierung ganzer Sätze, nicht nur Tippfehler).
- Drei davon haben im JSON Kurzfassungen bzw. eine ältere Fassung statt des gedruckten Kartentexts (`kreative_kayfab_creative_hero_journey`, `the_carnival_of_unsolved_problems_therapy`, `uncle_frizzlebob_s_tragic_flaws_shakespeare`). Auffällig: `uncle_frizzlebob_s_tragic_flaws_id` nutzt dieselbe PDF und deckt sich mit dem Druck (49 SAME, 6 DIFF).
- In den übrigen Decks sind es Einzeländerungen: einzelne Wörter oder ein Satz anders (z. B. Siege #20 „AND the boom“, gedruckt „before the boom“).
- Keine Abweichung gefunden (höchstens einzelne UNSURE): `protopia_web`, `help_i_am_a_human`, `wrinkle_rumble`, `cosmic_grift_dark_journalism`, `embrace_protopia`, `forget_utopia`, `kayfabizzaro_politics`, `mind_traps`, `shadow_politics`, `what_work_was_for`.
- Offen: keines der SAFE-Decks. Nicht geprüft wurden die 19 Decks, die die Registry-Korrektur als UNSAFE führt (Liste unten).

## Methode

1. **PDF-Quelle:** die lokalen PDFs aus `MODIFIED PROTOTYPES (PDFs, uncompressed, v05)`, nur gelesen. Für 58 Decks ist die lokale Datei byte-gleich mit der Repo-PDF (gleicher git-Blob-Hash). `museum_of_modern_mess`: die Repo-PDF ist ein Ausschnitt (Seiten 1–13) der lokalen `Museum_of_Modern_Mess - ADD web.pdf`; die Seiten sind bildgleich geprüft. Karten auf Seite 14–15 liegen außerhalb der Registry-PDF und zählen nicht.
2. **Kein Textlayer:** Die PDFs enthalten nur Bilder (PDFKit liefert 0 Zeichen). Deshalb OCR mit Apple Vision: Seite 4-fach gerendert, je Viertel mit 8 % Überlappung, zwei Durchläufe (mit und ohne Sprachkorrektur). Die WS1-Rohdaten (`ws1/kfb-planet/test/audit/`, Branch `ws1/r3f-frame`) wurden zuerst genutzt; sie sind aber mit Faktor 1,5 gelesen und für POWER/LORE zu unscharf. Sie zählen als dritte Lesung: bestätigen sie den JSON-Text ohne echte Abweichung, gilt die Karte als SAME (`ws1-ocr`, 34 Karten).
3. **Abgleich:** Text normalisiert (Groß/klein, Satzzeichen, Anführungszeichen, Apostrophe, Trennstriche, Leerraum), dann Wort-für-Wort-Ausrichtung. Nicht als Abweichung zählen: Ein-Zeichen-Fehler und OCR-ähnliche Verleser, Feldnamen (POWER, LORE, Effect, Text), Stempel (BONGO!, BLÖDSINN!, Zap!), Bildtext in Großbuchstaben, Signatur, der Kartentitel im Textfeld, vertauschte Zeilenreihenfolge, vertauschte Reihenfolge Lore/Power.
4. **Einstufung:** SAME = gleicher Wortlaut. WORDING_DIFF = mindestens eine echte Wortabweichung (oder mindestens zwei Wörter). MISSING_IN_JSON = JSON leer, Druck hat Text. UNSURE = Text nur teilweise gelesen, nur ein einzelnes Wort strittig, schlechte OCR oder unklare Zeilenfolge.
5. **Titel:** Die Kartentitel hat WS1 schon für die SAFE-Freigabe geprüft. Hier zählt ein Titel nur als abweichend, wenn er sicher anders gelesen wird. Das kam in keinem Fall sicher vor; die wenigen unklaren Titel-Lesungen sind OCR-Rauschen. `print.cardName` ist daher der JSON-Titel, wenn der Titel im Druck gefunden wurde, sonst `null`.

## Der Block `"print"` im Karten-JSON

```json
"print": {"cardName": "…", "power": "…", "lore": "…", "source": "PDF v05 <Datei> p<Seite> <TL|TR|BL|BR>", "method": "ocr", "confidence": "high"}
```
- Wörter, die nur durch OCR- oder Druckfehler abweichen, stehen in JSON-Schreibweise; abweichende Passagen stehen so, wie der Druck sie zeigt.
- `confidence: high` = Text und Trennung Power/Lore sicher. `medium` = Text sicher, Trennung Power/Lore unsicher (`splitUncertain: true`) oder JSON war leer. `low` = Druck weicht so stark ab, dass weniger als 60 % der JSON-Wörter wiederkehren; der Drucktext ist gelesen, kann aber Überschriften, Bildtext oder Lesefehler enthalten. Vor Nutzung in der Sprachausgabe ansehen. `medium` gilt auch, wenn im Drucktext Wörter stehen, die kein Wörterbuchwort sind (OCR- oder Druckfehler).
- Blöcke gesamt: 367 high, 112 medium, 179 low.

## Je Deck

| Deck | Karten | SAME | DIFF | MISSING | UNSURE | DIFF-Anteil | Einschätzung | print-Blöcke (h/m/l) |
|---|---:|---:|---:|---:|---:|---:|---|---|
| `kayfabizarro_monomyth_mayhem` | 56 | 20 | 36 | 0 | 0 | 64 % | systematisch (anderer Textstand) | 28/8/0 |
| `protopia_web` | 56 | 55 | 0 | 0 | 1 | 0 % | deckt sich | 0/0/0 |
| `help_i_am_a_human` | 56 | 55 | 0 | 0 | 1 | 0 % | deckt sich | 0/0/0 |
| `wrinkle_rumble` | 48 | 48 | 0 | 0 | 0 | 0 % | deckt sich | 0/0/0 |
| `1001_kayfabe_nights` | 60 | 51 | 8 | 0 | 1 | 14 % | vereinzelt | 7/1/0 |
| `academic_anarchy_intellectual` | 56 | 44 | 6 | 0 | 6 | 12 % | vereinzelt | 1/1/4 |
| `ai_kayfabe` | 56 | 8 | 46 | 0 | 2 | 85 % | systematisch (anderer Textstand) | 26/5/15 |
| `big_bad_brain_wrestling` | 56 | 48 | 5 | 0 | 3 | 9 % | vereinzelt | 5/0/0 |
| `brain_flipper_image_spots` | 60 | 30 | 29 | 0 | 1 | 49 % | systematisch (anderer Textstand) | 23/4/2 |
| `cinematic_kayfabizarro_2` | 56 | 28 | 25 | 0 | 3 | 47 % | systematisch (anderer Textstand) | 23/2/0 |
| `cosmic_grift_dark_journalism` | 60 | 55 | 0 | 0 | 5 | 0 % | deckt sich | 0/0/0 |
| `dream_wrestling_with_kayfabe_freud` | 56 | 50 | 4 | 0 | 2 | 7 % | vereinzelt | 2/2/0 |
| `embrace_protopia` | 56 | 56 | 0 | 0 | 0 | 0 % | deckt sich | 0/0/0 |
| `epistemic_sabotage` | 60 | 56 | 1 | 0 | 3 | 2 % | vereinzelt | 0/1/0 |
| `forget_utopia` | 56 | 55 | 0 | 0 | 1 | 0 % | deckt sich | 0/0/0 |
| `frizzlebob_s_kayfabizarro_kompendium_elender_wic` | 60 | 49 | 9 | 0 | 2 | 16 % | viele Einzeländerungen | 7/1/1 |
| `grimms_kayfabe_legends_expansion_set_02` | 52 | 45 | 2 | 0 | 5 | 4 % | vereinzelt | 1/1/0 |
| `human_nature_uncut_hilfe_ich_bin_ein_mensch` | 56 | 43 | 6 | 0 | 7 | 12 % | vereinzelt | 4/2/0 |
| `ideology_wrestling` | 68 | 64 | 3 | 0 | 1 | 4 % | vereinzelt | 3/0/0 |
| `ignore_dystopia` | 56 | 47 | 6 | 1 | 2 | 11 % | vereinzelt | 6/1/0 |
| `kayfabizarro_1_morale_ethics` | 56 | 55 | 1 | 0 | 0 | 2 % | vereinzelt | 1/0/0 |
| `kayfabizarro_monopolies_manipulation_murder_vol` | 56 | 50 | 4 | 0 | 2 | 7 % | vereinzelt | 3/1/0 |
| `kayfabizarro_philosophy` | 68 | 21 | 40 | 0 | 7 | 66 % | systematisch (anderer Textstand) | 29/9/2 |
| `kayfabizarro_pulitzer_punk` | 60 | 38 | 20 | 0 | 2 | 34 % | viele Einzeländerungen | 15/5/0 |
| `kayfabizarro_siege_tower_wall_siege_kampaigns` | 60 | 59 | 1 | 0 | 0 | 2 % | vereinzelt | 1/0/0 |
| `kayfabizzaro_politics` | 52 | 50 | 0 | 0 | 2 | 0 % | deckt sich | 0/0/0 |
| `kosmik_kayfabizarro_sci_fi_space_opera` | 56 | 49 | 6 | 0 | 1 | 11 % | vereinzelt | 2/4/0 |
| `kreative_kayfab_creative_hero_journey` | 52 | 0 | 41 | 0 | 11 | 100 % | systematisch (anderer Textstand) | 4/5/32 |
| `mind_traps` | 56 | 55 | 0 | 0 | 1 | 0 % | deckt sich | 0/0/0 |
| `museum_of_modern_mess` | 52 | 49 | 3 | 0 | 0 | 6 % | vereinzelt | 3/0/0 |
| `nibelungen_booster_pack_design` | 60 | 35 | 22 | 0 | 3 | 39 % | viele Einzeländerungen | 9/9/4 |
| `pharaoh_piledriver` | 52 | 43 | 9 | 0 | 0 | 17 % | viele Einzeländerungen | 2/7/0 |
| `platos_dungeon_raid_v05` | 56 | 55 | 1 | 0 | 0 | 2 % | vereinzelt | 0/1/0 |
| `plot_pusher_posse` | 56 | 53 | 2 | 0 | 1 | 4 % | vereinzelt | 0/0/2 |
| `programming_the_whole_child` | 60 | 50 | 8 | 0 | 2 | 14 % | vereinzelt | 5/2/1 |
| `project_gateway_kayfabe` | 60 | 55 | 2 | 0 | 3 | 4 % | vereinzelt | 2/0/0 |
| `reality_redrawn` | 60 | 57 | 1 | 0 | 2 | 2 % | vereinzelt | 0/1/0 |
| `romantic_kayfabe` | 56 | 30 | 23 | 1 | 2 | 43 % | systematisch (anderer Textstand) | 20/2/2 |
| `saboteur_sketchbook_medicine_history_psyops_add_` | 56 | 8 | 44 | 0 | 4 | 85 % | systematisch (anderer Textstand) | 1/1/42 |
| `secret_spy_suplexes` | 56 | 53 | 3 | 0 | 0 | 5 % | vereinzelt | 2/1/0 |
| `shadow_politics` | 48 | 48 | 0 | 0 | 0 | 0 % | deckt sich | 0/0/0 |
| `sonic_slaughterhouse` | 56 | 50 | 4 | 0 | 2 | 7 % | vereinzelt | 1/2/1 |
| `sonic_warfare_music_history_01` | 48 | 40 | 4 | 0 | 4 | 9 % | vereinzelt | 4/0/0 |
| `suppressed_book_deck` | 20 | 17 | 3 | 0 | 0 | 15 % | viele Einzeländerungen | 3/0/0 |
| `symphonic_savagery` | 56 | 31 | 23 | 0 | 2 | 43 % | systematisch (anderer Textstand) | 19/4/0 |
| `the_bards_barnyard_beatdown` | 56 | 54 | 2 | 0 | 0 | 4 % | vereinzelt | 2/0/0 |
| `the_biology_of_rebellion_hilfe_ich_bin_ein_mensc` | 36 | 21 | 15 | 0 | 0 | 42 % | systematisch (anderer Textstand) | 6/0/9 |
| `the_carnival_of_unsolved_problems_therapy` | 48 | 0 | 19 | 0 | 29 | 100 % | systematisch (anderer Textstand) | 0/0/19 |
| `the_kayfabe_crucible_coming_of_age` | 48 | 39 | 7 | 0 | 2 | 15 % | viele Einzeländerungen | 3/1/3 |
| `the_kayfabe_money_trail_9_11` | 60 | 46 | 12 | 0 | 2 | 21 % | viele Einzeländerungen | 10/2/0 |
| `the_kayfabizarro_manifesto_cover_up` | 60 | 46 | 10 | 0 | 4 | 18 % | viele Einzeländerungen | 5/1/4 |
| `the_move_1` | 56 | 31 | 9 | 0 | 16 | 22 % | viele Einzeländerungen | 6/1/2 |
| `the_move_id` | 56 | 44 | 7 | 0 | 5 | 14 % | vereinzelt | 4/2/1 |
| `the_pharaoh_script_psychology_of_evil` | 60 | 58 | 1 | 0 | 1 | 2 % | vereinzelt | 0/1/0 |
| `trust_and_betrayal` | 56 | 11 | 42 | 0 | 3 | 79 % | systematisch (anderer Textstand) | 22/5/15 |
| `uncle_frizzlebob_s_tragic_flaws_id` | 56 | 49 | 6 | 0 | 1 | 11 % | vereinzelt | 6/0/0 |
| `uncle_frizzlebob_s_tragic_flaws_shakespeare` | 56 | 0 | 53 | 0 | 3 | 100 % | systematisch (anderer Textstand) | 21/14/18 |
| `what_work_was_for` | 56 | 56 | 0 | 0 | 0 | 0 % | deckt sich | 0/0/0 |
| `woad_and_warriors` | 52 | 30 | 22 | 0 | 0 | 42 % | systematisch (anderer Textstand) | 20/2/0 |

## 10 Beispiele (am Kartenbild nachgesehen)

1. **`kayfabizarro_monomyth_mayhem` #1 The Ordinary World** (Lore, Kayfabizarro_Monomyth_Mayhem_WEB_v1 ID.pdf p2 TL)  
   JSON: „Dysfunction isn't just a state; it's a habit. We normalize the abnormal until the extraordinary seems impossible.“  
   Druck: „Dysfunction isn't just a state; it's a habit. We normalize the pain until it feels like home.“
2. **`kayfabizarro_monomyth_mayhem` #5 Crossing the Threshold** (Power + Lore, Kayfabizarro_Monomyth_Mayhem_WEB_v1 ID.pdf p3 TL)  
   JSON: „… The old world is gone. / … You can't un-take the step.“  
   Druck: „… The old self is dead. / … You can't un-take the pill.“
3. **`kayfabizarro_siege_tower_wall_siege_kampaigns` #20 The Counter-mine** (Power, Kayfabizarro_Siege_-_TOWER_&_WALL_SIEGE_KAMPAIGNS - ADD web ID.pdf p6 BR)  
   JSON: „Tunnel Brawl. Intercept the diggers AND the boom.“  
   Druck: „Tunnel Brawl. Intercept the diggers before the boom.“
4. **`secret_spy_suplexes` #2 The Grey Desk** (Lore, Secret_Spy_Suplexes - ADD web ID.pdf p2 TR)  
   JSON: „Treason doesn't wear a mask; a cheap suit and denies your pension.“  
   Druck: „Treason doesn't wear a mask; it wears a cheap suit and denies your pension.“
5. **`secret_spy_suplexes` #5 The Exhausted Veteran** (Lore, Secret_Spy_Suplexes - ADD web ID.pdf p3 TL)  
   JSON: „Too many missions, too many names. He runs out, but the door is walled over.“  
   Druck: „Too many missions, too many names. He wants out, but the door is walled over.“
6. **`brain_flipper_image_spots` #35 The Pregnant Army** (Power, Brain_Flipper IMAGE SPOTS - ADD web ID.pdf p10 BL)  
   JSON: „Hormone Vision: Stun all players with pure absurdity.“  
   Druck: „Horrible Vision: Stun all players with pure absurdity.“
7. **`ai_kayfabe` #53 The Next Generation** (Lore, AI_Kayfabe - ADD web ID.pdf p15 TL)  
   JSON: „The surviving generation will slowly live in regal luxury, never knowing they are just pets to the algorithm.“  
   Druck: „The surviving generation will surely live in great luxury, never knowing they are just pets to the algorithm.“
8. **`kayfabizarro_philosophy` #26 The Rebuilt Clone Ship** (Lore, Kayfabizarro_Philosophy - ADD web.pdf p8 TR)  
   JSON: „If someone reconstructs the truth and rebuilds the exact original structure, which one is the real Ship of Theseus?“  
   Druck: „If someone collects the trash and rebuilds the exact original structure, which one is the real Ship of Theseus?“
9. **`frizzlebob_s_kayfabizarro_kompendium_elender_wic` #51 Imbécil (Clinical)** (Lore + Power, FrizzleBob_s_KayfaBizarro_Kompendium_ELENDER_WICHT_INSULTS - ADD web ID.pdf p15 BL)  
   JSON: „Not just an insult. A clinical diagnosis of mental vacation. / Diagnose weakness, ignoring armor.“  
   Druck: „Not just an insult. A clinical diagnosis of mental weakness. / Diagnose a weakness, ignoring armor.“
10. **`ignore_dystopia` #47 The Atrophied Will** (Lore, Deck_B_DYSTOPIA_-_ANATOMY_OF_A_TRAP web H.pdf p13 BL)  
   JSON: „Decision follows a use-it-or-lose-it principle; switched off, the habit weakens.“  
   Druck: „Decision-making follows a use-it-or-lose-it principle; handed off, the habit weakens.“

## Nicht geprüft (nicht SAFE laut Registry-Korrektur)

`anti_rules_toolkit`, `bullshit_jobs_uncut`, `deep_state_plumbing`, `federal_kayfabe`, `frizzlebob_s_ego_mania_narcissist`, `frizzlebob_s_mission_control`, `geopolitical_thrillers_conspiracy_theories`, `jung_and_shinn_a_guide_to_cosmic_cringe`, `kayfabizarro_improv_comedy`, `kayfabizarros_ontological_hazards`, `observation_underground`, `philosopher_dungeon_raid`, `platos_dungeon_raid_hero_set_01`, `shadow_monopoly_blackrock_vanguard_co`, `shakespearean_animal_beatdown`, `the_biological_metropolis`, `the_importance_of_being_kayfab_earnest`, `the_uruk_rumble`, `unspoken_systems_kayfabizarro_meta_deck_01`.

Diese Decks brauchen erst eine sichere Seiten-/Viertel-Zuordnung (siehe `MAPPING_FIX_R1.md`).

## Hinweise

- UNSURE-Karten haben keinen `print`-Block. Gründe stehen in der Rohauswertung (nicht im Repo); häufigster Grund: Text nur teilweise gelesen.
- `the_move_1` und `the_move_id`, `uncle_frizzlebob_s_tragic_flaws_id` und `uncle_frizzlebob_s_tragic_flaws_shakespeare` teilen sich jeweils eine PDF, haben aber eigene JSONs.
- Einzelne JSONs enthalten Bearbeitungsnotizen statt Kartentext (z. B. „[m—text clipped at page edge]“, „[UNCLEAR — legibility issue …]“). Diese Karten erscheinen als WORDING_DIFF mit dem gelesenen Drucktext.
