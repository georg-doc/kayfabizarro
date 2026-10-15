# Suno-Schiene · nächste Decks R1 (15.10.2026, zu V-308)

**Stand:** Vorschlag WS0. Fertig sind kayfabizarro_monomyth_mayhem, kayfabizarro_philosophy, help_i_am_a_human, wrinkle_rumble (TRIPLET_SETS_R2); forget_utopia liegt bei WSA (Hub b30).
**Quellen:** Deck-Register `media/kfb/index.json` @52adc8f1 (Branch `data/kfb-registry-generator-offset-2026-10-15`), Kartentext `data/kfb-card-title-case-2026-10-15` @eade4aec, Bühnen aus V-281/V-300/V-306/V-309 und WS0_TO_WS1.md.
**Auswahl:** Titel, deckType, Hashtags und Kartentext aller 130 Register-Decks nach Bühnen-Themen durchsucht; danach geprüft, ob der Kartentext im kanonischen Druckstand liegt (Commits auf dem Kanon-Branch) und ob das Deck in einen Track passt.

## Vorschlag: 8 Decks in dieser Reihenfolge

| # | Bühne | deckId | Gedruckter Titel (Register) | Karten | Warum |
|---|---|---|---|---|---|
| 1 | Atlantis / Hidden History | `cosmic_grift_dark_journalism` | Cosmic Grift – Dark Journalism | 60 | Das einzige Deck mit Atlantis im Kartentext (Atlantean Automatons, Hall of Records, Bimini Road, The Sleeping Prophet); Hermes the Architect legt Giza an. Passt zusätzlich zur Akashic Library. |
| 2 | Giza | `pharaoh_piledriver` | Pharaoh Piledriver | 52 | Ägyptisches Pantheon als Wrestling-Roster (Ra, Osiris, Set, Apep, The Lettuce Incident); Kartentext kanonisch, klare Bilder. |
| 3 | Goblin-Bank | `kayfabizarro_monopolies_manipulation_murder_vol` | Monopolies, Manipulation & Murder Vol. II | 56 | Echte Banken als Karten: Riksbank 1668, Bank of England, BIS (Basel Tower), IMF (Loan Shark), Swiss Vault Neutrality. Das ist die Schalterhalle mit Tresor. |
| 4 | Gefängnis-Panoptikum | `observation_underground` | Observation Underground — ADD | 48 | Überwachung komplett: „the digital panopticon“ steht wörtlich auf Karte 2, dazu Social Credit System, Geofencing Collar, NSA Surveillance Backdoor, Ausgang über Escaping the Matrix. Kurzes Deck, viel Luft im Zeichenbudget. |
| 5 | Retro-Arcade-Casino | `trust_and_betrayal` | Trust & Betrayal — The 'Trust Me, Bro' Edition | 56 | Spieltheorie und Einsatz: The Gambit, Prisoner's Dilemma, Rash Equilibrium, Betrayal Insurance, Thirty Pieces of Silver. Kanonischer Kartentext. |
| 6 | Köln | `nibelungen_booster_pack_design` | Nibelungen Booster Pack | 60 | Rhein-Sage, deutsches Publikum: The Rhine River (Hagen versenkt den Schatz), Siegfried, Kriemhild, Dietrich von Bern. |
| 7 | Theater (steht) | `uncle_frizzlebob_s_tragic_flaws_id` | Uncle FrizzleBob's Tragic Flaws | 56 | Hamlet, Macbeth, Lear und Antony & Cleopatra als Tierbesetzung. Die Bühne ist schon gebaut. |
| 8 | Comic-Broadcast (steht) | `epistemic_sabotage` | Epistemic Sabotage: Let AI Read Your Comic | 60 | Das Comic-Deck selbst („Let AI Read Your Comic“); passt zur Sendebühne und zum KI-Workshop-Strang. |

**Zeichenbudget:** Alle acht passen in **einen Track unter 5000 Zeichen** (V-277). Rechnung: (4900 − Intro − Outro) / Karten = 80 Zeichen pro Zeile bei 60 Karten, 100 bei 48. Kayfabizarro Philosophy hat mit 68 Karten und 71 Zeichen pro Zeile gepasst (4982). Kein Deck braucht zwei Tracks. Credits: 8 Tracks = 8 von Georgs 60.

## Reserve, falls ein Vorschlag nicht gefällt

| Bühne | deckId | Titel | Karten | Hinweis |
|---|---|---|---|---|
| Retro-Arcade-Casino | `frizzlebob_s_mission_control` | Uncle FrizzleBob’s Mission Control Deck | 56 | Videospiel-Klischees (Mini-Game, Speedrun, New Game Plus, DLC Paywall), thematisch noch näher am Arcade. **Aber:** Kartentext ist nicht im kanonischen Druckstand (alte Felder `num/name`, keine Druckprüfung). Erst gegen das PDF prüfen. |
| Goblin-Bank | `federal_kayfabe` | Federal Kayfabe | 60 | Fed-Geschichte (Jekyll Island, Gold Heist 1934). Gleiches Problem: nicht im Kanon-Stand, alte Felder. |
| Köln | `woad_and_warriors` | Wine, Woad & Warrior Chiefs | 52 | Caesar gegen die Gallier, Eburonen/Ambiorix am Rhein (Römer-Grenze, aus der Colonia wurde). Kanonisch. |
| Atlantis / Giza | `the_pharaoh_script_psychology_of_evil` | The Pharaoh Script — Psychology of Evil | 60 | „Secret History Vol. 06“, aber großteils MK-Ultra/Abu Ghraib; als Song schwerer verdaulich. |
| Bibliothek | `suppressed_book_deck` | The Most Suppressed Books | 20 | Passt wörtlich zur Bibliothek und ist ein billiger kurzer Track. Enthält aber Titel extremistischer Bücher (z. B. The Myth of the 20th Century, Camp of the Saints). Inhaltlich Georgs Entscheidung. |

## Zwei Punkte für die Umsetzung (keine Frage an Georg nötig)
- **Gimmick-Namen in Klammern:** In Pharaoh Piledriver und Nibelungen steckt der Witz oft in der Klammer („Set (The Heel)“, „Andvari (The Mole)“). Die Spezifikation bleibt: Klammern werden nicht gesprochen. Weil die Klammerwörter Kartenwörter sind, darf das Plugin sie im Fragment benutzen, ohne Klammer („Set, the Heel: …“ besteht das Prüfskript). Das ist eine Stilentscheidung des Plugins je Zeile, keine neue Regel.
- **Deutsche Kartentitel:** Observation Underground hat deutsche Titel mit englischer Übersetzung in Klammern („Observationsökonomie (The Attention Economy)“). Gesprochen wird der deutsche Titel; das passt zu „Hilfe, ich bin ein Mensch!“.

## Kokoro parallel
Jedes neue Deck läuft nach der Suno-Fassung auch durch den Kokoro-Decktest (`40_AUDIO/kokoro_deck_test_r1/_scripts/kdt_render.py`, deckId als Parameter: `python kdt_render.py <deckId>`; Titel-Metadaten im Skript anpassen). Ergebnis R1 für help_i_am_a_human steht in VOICE_CASTING_R1.md.

---

## Briefing zum Einfügen (WSA kfb-triplets-Plugin oder Agent-Lauf)

```text
TASK: Produce the next 8 KFB deck tracks for Suno with the kfb-triplets plugin (skill compose-card-performance), one deck after the other, in this order. Same rules as the four finished decks (TRIPLET_SET_SPEC_R2, Georg 15.10.). This works the same in the plugin or as a standalone agent run.

DECKS (exact deckId = packId from media/kfb/index.json; printed title; card count)
1. cosmic_grift_dark_journalism | Cosmic Grift – Dark Journalism | 60
2. pharaoh_piledriver | Pharaoh Piledriver | 52
3. kayfabizarro_monopolies_manipulation_murder_vol | Monopolies, Manipulation & Murder Vol. II | 56
4. observation_underground | Observation Underground — ADD | 48
5. trust_and_betrayal | Trust & Betrayal — The 'Trust Me, Bro' Edition | 56
6. nibelungen_booster_pack_design | Nibelungen Booster Pack | 60
7. uncle_frizzlebob_s_tragic_flaws_id | Uncle FrizzleBob's Tragic Flaws | 56   (NOT the duplicate uncle_frizzlebob_s_tragic_flaws_shakespeare)
8. epistemic_sabotage | Epistemic Sabotage: Let AI Read Your Comic | 60

SOURCES (repo georg-doc/kayfabizarro, read-only)
- Card text: branch data/kfb-card-title-case-2026-10-15 @eade4aec, file media/kfb/<data> where <data> is the "data" field of the deck in media/kfb/index.json. Fields: cardName, power, lore (cardNamePrint = print spelling, do not speak caps).
- Registry (deckId, title, cardCount, data, pdf): media/kfb/index.json @52adc8f1.
- Intro material: the printed deck PDF (media/kfb/<pdf>), cover page and printed slogans only.
- Never use jsonLegacy, artworkPrompt, grade, gradeReason, blurb, marketingText or any analysis text.
- Card text marked OPEN gets no line. Meta cards without game content (blank, how to use, license, QR, card back) get no line. List both in the report.
- Golden examples and finished tracks: TRIPLET_SETS_R2/kayfabizarro_monomyth_mayhem, kayfabizarro_philosophy, help_i_am_a_human, wrinkle_rumble.

THE TRACK (one deck = one Suno track)
- Under 5000 characters total, including intro and outro. All 8 decks fit in one track (48–60 cards, about 80–100 characters per line). Only if a deck really does not fit after hard compression: two tracks, and say so in the report.
- Layout: first line [Spoken Word]. Then the intro, then one line per card in card-number order, then the outro "Stay Fluffy!". A blank line between every beat. No other tags ([Break] etc.).
- Intro: one short host line, 6–15 words, built only from printed deck material (deck title, subtitle or cover tagline, printed slogans), may tease 2–3 card titles. No opener, not "Welcome to" every time, no invented slogans or facts.
- Each line stands alone as one take (it will be cut out of the stem). No invented bridges between lines.

ONE CARD LINE
- Card title first, in normal case (never caps), merged with the term from the POWER: "The Ordinary World stasis loop", "Jean-Jacques Rousseau, Natural Goodness".
- Then short telegram fragments from the card. Comic compression: drop articles, auxiliaries, copula and empty fillers while the sense stays ("Force a card" -> "Force card", "just a game" -> "just game", "man born free"). Keep negations, load-bearing numbers and names; the card title keeps its own articles; openers are never compressed. Only delete, never add.
- Only words from the card. Allowed extras: grammar (endings, pronouns, articles, and/but/so, punctuation) and at most one Fluff-o-lect word per line ("un-fluff").
- No new verbs, images, events or explanations. Mechanics only when they are an image ("hand new cards"); dice values, numbers and rule labels drop out. Do not explain the card; a semantic gap is fine, a mechanical error is not.
- No parentheses ever in the spoken text. Text in brackets in a title is not spoken as a bracket ("Homo Ludens (Play)" -> "Homo Ludens"). Bracket words are card words, so a line may use them without brackets ("Set, the Heel: ...") when that carries the joke.
- One breath, about 8–20 words, English. German titles stay German.
- Goldens: "Welcome to The Ordinary World stasis loop: nothing changes; Dysfunction is habit. Normalize pain – feels like home." / "Remember Crossing the Threshold: hand new cards, old self dead. Fear becomes movement. You can't un-fluff the pill." / "You know Jean-Jacques Rousseau, Natural Goodness: man born free, everywhere in chains."

OPENERS (own layer, from this pool only)
Welcome to | Remember | You know | Do you know | Ever tasted | I once met | Let me tell you about | You know the thing with | Did you ever try | What if | Have you heard of | Did you hear of | Anyway | Which brings us to | Meanwhile elsewhere | No wait | Before we continue | Here is something nobody asked for | This one has a rule | Nobody warned us about | The thing about | Everyone agrees | Not a metaphor | I used to believe | You with the card in your hand | You played | The deck insists on
- Each opener at most once per track. Variants of one family need at least 10 lines between them: heard (Did you hear of / Have you heard of), know (You know / Do you know / You know the thing with), try (Did you ever try / Ever tasted), nobody (Nobody warned us about / Here is something nobody asked for), thing (The thing about / You know the thing with).
- As many opener lines as the budget allows (aim at least one third, spread evenly, prefer short openers).
- The opener must fit the card: "I once met" only before a person, "Ever tasted" only before something edible, "You played" only if the card is played.

CHECK (must pass before delivery)
- Run replies/triplet_set_check.py <deck.json> <deckId>.takes.csv (the checker in KFB_HUB/30_DECISIONS/replies). Exit 0 = every card line PASS. Save the output as <deckId>.check.txt; it must show 0 FAIL.
- Count characters of <deckId>.suno.txt (must be < 5000).

DELIVERABLES PER DECK (file names always start with the exact deckId, V-291)
1. <deckId>.suno.txt – the one Suno track as above.
2. <deckId>.takes.csv – columns: set, line_no, kind, card_number, card_title, opener, triplet, spoken_text, start_seconds, end_seconds, sync_status, intro_source. kind = intro | card | outro; spoken_text = opener + triplet; times empty; sync_status = UNTIMED_AWAIT_REAL_AUDIO; intro_source = where the intro words are printed (PDF page + text).
3. <deckId>.hub.json – one object per card: cardNumber, card {name, power, lore, source}, spokenTitle, opener, line, inTrack (true/false), plus a reason when inTrack is false (OPEN, meta card).
4. <deckId>.check.txt – checker output, 0 FAIL.
5. Report per deck (short): character count, number of card lines, skipped OPEN/meta cards, openers used.
- Suno song title: "KFB <printed title> [<deckId>] v1", e.g. "KFB Pharaoh Piledriver [pharaoh_piledriver] v1".
- Plugin run: return the 4 files per deck as downloads. Agent run with repo access: put them on a new branch (no PR, no merge). WS0 files them into KFB_HUB/30_DECISIONS/replies/TRIPLET_SETS_R2/.

ORDER OF WORK
One deck after the other in the order above. Finish each deck completely (4 files, check 0 FAIL, under 5000 characters) and hand it over before starting the next, so Georg can record it in Suno right away.
```
