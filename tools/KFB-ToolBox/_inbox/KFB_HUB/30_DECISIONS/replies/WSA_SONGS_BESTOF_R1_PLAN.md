# WSA · Songs Best-of Batch 1 · Plan R1
Datum 2026-10-18 · PLAN ZUR ANSICHT, noch keine Songs oder Generierungen.
Owner WSA / bestehendes kfb-triplets Writer's Room.
Branch `wsa/songs-bestof-r1-2026-10-18`; Quelle Register `9bab2865b9323c75a0bed109d5d18032f72a61d6`.

## Umfang und belastbare Annahmen
20 verschiedene Decks mit zusammen 1089 Karten. In den vollständigen tools-/content-/kfb-hub-Teilbäumen des gepinnten Registers wurden keine vorhandenen .suno.txt-Dateien dieser Deck-IDs gefunden. Das belegt keine Abwesenheit unverknüpfter externer Suno-Aufnahmen; vor Produktion mit Georgs tatsächlicher Trackliste abgleichen.
Alle 20 gewählten Druck-PDF-JSONs wurden gegen die Registry gelesen: Kartennummer, Titel, Lore und Power stimmen für 1089/1089 Karten überein. Seitenzuordnung ist im Registry-Index als verified geführt. Die PDF-Bilder wurden für diesen Plan nicht neu visuell abgenommen; visualVerified bleibt false, Bildmotive sind nicht behauptet. Vor Lyrics tatsächliche gedruckte Seiten prüfen.
Geschätzter Vollumfang = N × 97 + 900 Unicode-Zeichen: 95 je Kartenzeile + 2 Zeilenumbrüche, 900 für Intro/Outro/Opener/Callbacks. Die 900 sind ein Budget und kein bereits geschriebener Rahmen. Gemessen wird später streng mit Python len(), inklusive aller Zeilenumbrüche, <5000. Ziel fertig höchstens 4700 als Puffer.
Bei langen Decks zunächst 36–38 tragende Karten (~4392–4586 Zeichen); endgültiges bestOf erst aus dem tatsächlichen Deckbogen, nicht durch erstes-N-Abschneiden. Meta-Karten nur mit protokolliertem Grund abziehen. Kurze Decks vollständig versuchen.

## Vorgesehene Reihenfolge und Stil-Matrix
| # | Deck-ID | Druckkarten | Vollumfang ca. | Best-of | Zielkarten / Zielumfang ca. | Hauptstil | BPM |
|---|---|---:|---:|---|---|---|---:|
| 1 | the_biological_metropolis | 32 | 4004 | nein | 32 / 4004 | Afrobeat | 112 |
| 2 | the_biology_of_rebellion_hilfe_ich_bin_ein_mensc | 36 | 4392 | nein | 36 / 4392 | Polka-Punk | 126 |
| 3 | academic_anarchy_intellectual | 56 | 6332 | ja | 36–38 / 4392–4586 | Bluegrass | 124 |
| 4 | anti_rules_toolkit | 57 | 6429 | ja | 36–38 / 4392–4586 | Ska | 124 |
| 5 | big_bad_brain_wrestling | 56 | 6332 | ja | 36–38 / 4392–4586 | Trap-Musical | 108 |
| 6 | brain_flipper_image_spots | 60 | 6720 | ja | 36–38 / 4392–4586 | Surf Rock | 128 |
| 7 | bullshit_jobs_uncut | 56 | 6332 | ja | 36–38 / 4392–4586 | Delta-Blues Shuffle | 116 |
| 8 | cinematic_kayfabizarro_2 | 56 | 6332 | ja | 36–38 / 4392–4586 | Baroque Pop | 118 |
| 9 | embrace_protopia | 56 | 6332 | ja | 36–38 / 4392–4586 | Bossa Nova | 112 |
| 10 | forget_utopia | 56 | 6332 | ja | 36–38 / 4392–4586 | Balkan Brass | 124 |
| 11 | frizzlebob_s_ego_mania_narcissist | 56 | 6332 | ja | 36–38 / 4392–4586 | Nu-Disco | 120 |
| 12 | frizzlebob_s_mission_control | 56 | 6332 | ja | 36–38 / 4392–4586 | Krautrock | 118 |
| 13 | jung_and_shinn_a_guide_to_cosmic_cringe | 60 | 6720 | ja | 36–38 / 4392–4586 | Bollywood Disco | 122 |
| 14 | kayfabizarro_1_morale_ethics | 56 | 6332 | ja | 36–38 / 4392–4586 | Gospel | 110 |
| 15 | kayfabizarro_improv_comedy | 60 | 6720 | ja | 36–38 / 4392–4586 | Cumbia | 108 |
| 16 | kosmik_kayfabizarro_sci_fi_space_opera | 56 | 6332 | ja | 36–38 / 4392–4586 | Synthwave | 116 |
| 17 | platos_dungeon_raid_hero_set_01 | 56 | 6332 | ja | 36–38 / 4392–4586 | Mariachi | 120 |
| 18 | what_work_was_for | 56 | 6332 | ja | 36–38 / 4392–4586 | Funk | 114 |
| 19 | project_gateway_kayfabe | 60 | 6720 | ja | 36–38 / 4392–4586 | Electro-Swing | 124 |
| 20 | woad_and_warriors | 52 | 5944 | ja | 36–38 / 4392–4586 | Sea Shanty Dance | 116 |

Die ersten beiden kurzen Decks prüfen die vollständige Ein-Track-Kette, danach folgen längere Best-of-Decks. Kein Stil doppelt; alle Grooves 100–130 BPM. Das sind Produktionsrichtungen, noch keine fertigen Suno-STYLE-Felder. Pro Deck später zwei rein musikalische Alternativen A/B; die gewählte Hauptfamilie bleibt im Batch eindeutig. Auch gegen die fünf vorher tatsächlich produzierten Tracks prüfen, bevor die Reihenfolge feststeht.
1. **The Biological Metropolis**: polyrhythmische Verzahnung für das arbeitsteilige Körpersystem.
2. **The Biology of Rebellion**: treibende Gegenbewegung zur gesellschaftlichen Disziplinierung.
3. **Unseal the Academic Anarchy — Academic Alphas vs Brain Benders**: flinke Wechsel und virtuose Konkurrenz der akademischen Stimmen.
4. **The Anti-Rules Manifesto**: Offbeat-Reibung passt zur Regelverweigerung.
5. **Big Bad Brain Wrestling**: pointierte Ansagen und harte Wechsel für die Denkduelle.
6. **The Brain-Flipper Pack**: kurze helle Riffs tragen schnelle Perspektivwechsel.
7. **Bullshit Jobs Uncut: A Field Report from Before the Timesheet**: erdiger Shuffle für die Arbeits- und Wertfrage, tanzbar statt langsam.
8. **Cinematic Legacy & Motion Picture Kayfabe**: präzise arrangierte Wechsel für die Filmmythen.
9. **Protopia Sketchbook — Deck C: EMBRACE**: leichter federnder Groove für konkrete kleine Verbesserungen.
10. **Forget Utopia**: vorwärtsdrängende Ensemblekonflikte für große Gesellschaftsentwürfe.
11. **It’s All About Me! (And Also FrizzleBob)**: glatte verführerische Oberfläche zur Ego-Satire.
12. **Uncle FrizzleBob’s Mission Control Deck**: motorischer Puls für Kontroll- und Planungsroutinen.
13. **Jung and Shinn: A Guide to Cosmic Cringe**: große dynamische Kontraste für die kosmischen Selbstversprechen.
14. **Beyond the Banalities of Good vs Evil — Uncle FrizzleBob's KAYFABIZARRO Komik Kards for Monster Morality Wrestling & Flexible Kayfabizarro Ethiks**: Call-and-response der moralischen Überzeugungen.
15. **The Great Kayfabe Improv Komedy SKETCHBOOK**: federnde Reaktionsketten für Improvisation.
16. **Kosmik Kayfabizarro Kollektive (Vol II)**: analoge Sequencer und Synth-Bass, ohne Chiptune, für die Space-Opera.
17. **Plato's Dungeon Raid: Bring Your Own Legend — Hero Set 01**: präzise Ensembleantworten für rivalisierende Heldenansprüche.
18. **What Work Was For: A Field Report from Before the Timesheet — Vol. I**: synkopierte Spannung für Arbeit, Organisation und Macht.
19. **Project Gateway Kayfabe**: scharfe Akzente für die Versprechen der Bewusstseinsexperimente.
20. **Wine, Woad & Warrior Chiefs**: gemeinsamer Vorwärtspuls für die Stammes- und Machtkonflikte.

## Best-of- und Schreibverfahren
1. Gedruckte Karten/Seiten und Metakarten prüfen, Karten-JSON mit Quellen-/Seitenbeleg speichern. Vor jedem Deck aktuelle Spec erneut lesen.
2. Deckthese in einem Satz festhalten. In Deck-Reihenfolge Hook → Aufbau → Steigerung → Wendung → Höhepunkt → Landung auswählen; nur Karten behalten, die diesen Bogen tragen. Die These und widersprechende Stimmen erhalten.
3. `songlines.json`: `bestOf:[Kartennummern]` (bei Best-of), 3–6 Zeilen Begründung der Auswahlabschnitte, metaSkipped mit Gründen, A7-/Wortänderungsprotokoll. Keine heimlichen Textkorrekturen der Karten.
4. Ein Track je Deck, genau eine Zeile je ausgewählter Karte, normaler Kartentitel, Quellenwörter, keine Regelrezitation. R3.7 schlägt die ältere Zwei-Teile-Regel. Intro [Spoken Word], Decktitel/These in Beat 1, mindestens zwei eigene Intro-Beats, Normie-Setup/Punch plus präzise Insiderbezüge, unbenannter Erzähler, mindestens zwei Callbacks, satirischer Schluss und separate Zeile „Stay Fluffy, Folks!“. Leerzeile zwischen jedem Beat. Keine Objekt-Personifizierung im Rahmen.
5. Rein musikalische Styles (Genre, Produktion, 5–7 Instrumente, Groove/BPM, klanglich beschriebene Stimme bzw. Duett), keine Story-Requisiten oder Rollen. Ton-Check 16b und aktuelle Decknotizen anwenden.
6. Originale zentrale Gates: triplet_set_check.py und song_gate.py R3.7 (lyrics mit --deck, --songlines, --media und aktuellem --corpus; style mit --corpus). Keine private Gate-Kopie. Erst die tatsächlich erzeugte Datei kann PASS bekommen.
7. Externer blinder Kritiker bleibt gemäß Abend-Reihenfolge GESPERRT, bis WS0 das aktualisierte Briefing freigibt. Keine Kritiker-Chats und keine erfundenen Scores. Später nur das dann gültige Reviewer-Paket verwenden, eine Writer's-Room-Revision, erneut Gates, WS0-Endprüfung.
8. Nach Prüfung eine bestehende Hub-Karte je Track mit STIL + LYRICS, Quellen-/Gate-/Kritikerbelegen. WS0 übernimmt die Endprüfung/Trackkarten. Dieser Plan wird als ein Plan-Eintrag übergeben; keine 20 leeren Trackkarten.
9. Suno erst nach Planansicht und tatsächlichem Credit-Abgleich. „1 Credit je Track / etwa 60 vorhanden“ ist die Planannahme aus Georgs Brief, keine hier verifizierte Suno-Abrechnung. Keine API-/Provideranfrage ausgelöst. Falls Preis/Outputzahl anders ausfallen, innerhalb des bestätigten Budgets neu rechnen; keine kostenpflichtigen Wiederholungen automatisch.

## Zurückgestellte Quellenkonflikte
AI Kayfabe: Lore 23/25; Human Nature Uncut: Lore 45; Ignore Dystopia: Lore/Power 9; Pulitzer Punk: Power 57. Zusätzlich Plot Pusher Posse: ein Kartentext-Konflikt. Vor Aufnahme erst gedruckte PDF-Seite prüfen und über den Kanon-Owner klären. Kein Ersatztext im Plan. Decks mit ungeprüfter Registry-Seitenzuordnung sowie vorhandene Song-Decks wurden für diesen ersten Batch bevorzugt vermieden.

## Quellenbelege
Bindend: BRIEF_WSA_SONGS_BESTOF_R1.md Blob 502a296ab2ba1224804c04eab7e68397c8781c1a; SONG_SPEC_R3.md (inhaltlich R3.7) Blob ccd178e7cfc24bfcc9ff27093f98522a2f33a9bc. Registry-Index b1399317c33fbd6ff17a622da68c684207bd5b4c. Alle nachstehenden Quellen am oben gepinnten Register-Commit.
| Deck | Registry-Blob | PDF-JSON-Pfad | PDF-JSON-Blob |
|---|---|---|---|
| the_biological_metropolis | 4a308c2c50f58bb2dc30380b5776e2b1b5a349dd | media/kfb/The_Biological_Metropolis_-_ADD_web_ID.pdf.json | 779f1be59017065003812753e40f0478a0e9e1f0 |
| the_biology_of_rebellion_hilfe_ich_bin_ein_mensc | 992696c0bd157067431ee03a90dc54a081333ea6 | media/kfb/The_Biology_of_Rebellion_-_Hilfe,_ich_bin_ein_Mensch_-_ADD_web.pdf.json | ce56dfc2c6606168d20202094a1f63520a58147e |
| academic_anarchy_intellectual | 8c84fe40bc8d7e7665a682e23b6a02a5661ff5af | media/kfb/Academic_Anarchy_-_INTELLECTUAL_ADD_web_ID.pdf.json | e5d52af4ebabd94a523a7fbb6aad5e4a42a4f1cd |
| anti_rules_toolkit | 18fa39fe3ae0c26d3b37a1720f3899f42fca49f1 | media/kfb/Anti-Rules_Toolkit_-_ADD_web.pdf.json | b0230c5ccf5d56b09c8e652b5a37e755ab6c9dc2 |
| big_bad_brain_wrestling | 55922d7e9c300fb756b7c63f421c4b2a9c1da0f7 | media/kfb/Big_Bad_Brain_Wrestling_-_ADD_web.pdf.json | 831dddcbbe7af1c6fe67c322c8a30185bb9a23bb |
| brain_flipper_image_spots | 846851267031a7f04cb4913dc685b70b2611d12c | media/kfb/Brain_Flipper_IMAGE_SPOTS_-_ADD_web.pdf.json | 70784638e2c8730642dbae7d4144e165f7e81d0c |
| bullshit_jobs_uncut | 56fcf10679f007d94485bc675d704a30efa94d46 | media/kfb/What_Work_Was_For_(3)_Bullshit_Jobs_Uncut_-_ADD_web_ID.pdf.json | 9e9533757b6002e90d03fb51599c504bee1687be |
| cinematic_kayfabizarro_2 | 01aa2cc2b1cbd1b2291e4d8b1a3fa1004bfc32c9 | media/kfb/Cinematic_Kayfabizarro__2__-_ADD_web.pdf.json | 24df27941aba57b4b300085ff991c287bfa5ae98 |
| embrace_protopia | 2d9aeb01737fa23bd85deb071b520053121a22f5 | media/kfb/Deck_C_PROTOPIA_-_Protopia_Sketchbook_(1)_web_H.pdf.json | e95c585da13b8c565a3c5ff910f486434f3b1c44 |
| forget_utopia | 38cde115ce02fef5f2ffd5f7ec58ea3921848ae4 | media/kfb/Deck_A_UTOPIA_-_Forget_Utopia_web_H.pdf.json | 362fe54ddb0a945a5a8006a585ead75cf4bec37a |
| frizzlebob_s_ego_mania_narcissist | b91dcb375fbfc9145455de5f923bf94a9e73c027 | media/kfb/FrizzleBob_s_Ego_Mania_NARCISSIST_-_ADD_web.pdf.json | 22b9f956be8c662327defec1f5b2cd3095c39538 |
| frizzlebob_s_mission_control | adeae374ff089021a845b3d411a95a17defafd57 | media/kfb/FrizzleBob_s_Mission_Control_-_ADD_web.pdf.json | 262dc6bff378f3f7469521374e074b8336466e4c |
| jung_and_shinn_a_guide_to_cosmic_cringe | 0b10b779bd788722251591572421b7bf742fd165 | media/kfb/Jung_and_Shinn_A_Guide_to_Cosmic_Cringe_-_ADD_web.pdf.json | 225da8c5581eadf6a541facd724fbc8e6c11a272 |
| kayfabizarro_1_morale_ethics | af5a79769cb5cead3f4db911114491c82b7a4ac4 | media/kfb/KAYFABIZARRO-1_-_MORALE___ETHICS_-_ADD_web_RE.pdf.json | cf8e3b1796f929c2d3b2f8f1f977b946a5888c12 |
| kayfabizarro_improv_comedy | e9b2767f23f775f0b21538aad062b974ed438f39 | media/kfb/Kayfabizarro_Improv_Comedy_WEB_v1.pdf.json | 30da6ffcdb465c4c7961e5f4b4469f3fa465613a |
| kosmik_kayfabizarro_sci_fi_space_opera | ef358e4d109c0e20077f366a1d3c9f56a708b88f | media/kfb/KOSMIK_KAYFABIZARRO_-_SCI-FI_SPACE_OPERA_long_dark_II_-_ADD_web.pdf.json | be10c1eec97fbaa216857963780a12eac126243c |
| platos_dungeon_raid_hero_set_01 | 90d9c9a7f04183440054171f0be65d86a0ad7af1 | media/kfb/Plato_s_Dungeon_Raid_-_Hero_Set_01_-_ADD_web.pdf.json | 0b64ceb76c670279857bd5c1aacb8fd1e9ec275a |
| what_work_was_for | 003455a1b33d9f6fa70b3260ae70b7357bfaee5d | media/kfb/Kayfabizarro_What_Work_Was_For_Vol_1_WEB_v1_ID.pdf.json | 0badb0bae80fcbe1f32caf0e4103dfca60f81fba |
| project_gateway_kayfabe | c78e8aa0eafc1ff373567fd6f0055d99022a780d | media/kfb/Project_GATEWAY_Kayfabe_-_ADD_web_ID.pdf.json | b2c3f56b4fc3ccc6ebe42a8e8e89aaef0eb6fa63 |
| woad_and_warriors | c4ceb4385cec70435fc2d60cad4ac33de7826865 | media/kfb/Woad_and_Warriors_-_ADD_web_ID.pdf.json | 7a5fa8561e0a2155d7d8bb7400ff82812c9dd59d |

## Tatsächliche Prüfungen / nächster Gate
20/20 eindeutige Decks, 20/20 unterschiedliche Hauptstile, 20/20 BPM innerhalb 100–130; 1089/1089 Kartendatensätze textgleich in Druck-JSON/Registry; keine vorhandenen Lyrics mit diesen IDs im geprüften Register-Korpus. Kein Lyrics-/Style-/Kritiker-Gate ausgeführt, weil noch keine entsprechenden Kandidaten vorliegen. Keine Audioaufnahme gehört oder erzeugt.
Nächster Gate: Georg sieht den Plan; WS0 bestätigt Batchauswahl/Produktionsreihenfolge und den aktualisierten Kritikerweg. Dann zuerst Deck 1 als vollständiger Mustertrack, bevor die übrigen 19 produziert werden.
