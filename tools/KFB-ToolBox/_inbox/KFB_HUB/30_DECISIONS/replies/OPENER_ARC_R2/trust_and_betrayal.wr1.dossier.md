# trust_and_betrayal – Writer's Room 1 (wr1) – Dossier

Song: `trust_and_betrayal.wr1.suno.txt` (4991 Zeichen inkl. Zeilenumbrüche, per python `len()`). 55 Kartenzeilen in Deck-Reihenfolge (Karte 30 hat keinen gedruckten Text, siehe unten). 35 Zeilen byte-identisch mit `triplet` aus `arc2.takes.csv`, 20 Zeilen als `songLine` (V-364), alle dokumentiert in `trust_and_betrayal.wr1.songlines.json`. Reihenfolge und Byte-Identität per Skript geprüft.

## Zweck des Decks
**Titel (Registry/Cover):** "Trust & Betrayal – The 'Trust Me, Bro' Edition". deckType `Betrayal Archetypes Satire`, Tags u. a. `#PrisonersDilemma`, `#BackstabSimulator`, `#TableTopSabotage`, `#TrustIssues`, `performative`, `social sabotage`.

**Cover (S. 1), gedruckt:** "For Backstabbers & Traitor-Wrestling!" · "Contains 56 Cut-&-Play Artifacts for Epistemic Sabotage!" · "Price: YOUR SOUL" · "WARNING: May cause trust issues and table flips." Bild: FrizzleBob mit einem Blatt voller Pik-Asse schneidet mit der Schere ein rotes Band "RED TAPE" durch, eine Anzughand blutet.

**These (aus Cover, Kartentiteln und Booklets abgeleitet):** Das Deck ist ein spielbarer **Katalog der Verrats-Archetypen**. Fast alle Kartentitel sind etablierte Erzähl-Tropes (Face-Heel Turn, The Starscream, Sixth Ranger Traitor, Evil All Along, Et Tu Brute, Curse Your Sudden but Inevitable Betrayal …), dazu ein Spieltheorie-Kern (Prisoner's Dilemma, Rash [Nash] Equilibrium, The Gambit, Betrayal Insurance, Thirty Pieces of Silver). Das Cover nennt es **"Traitor-Wrestling"**. Verrat wird als Kayfabe gespielt: als Performance, die alle am Tisch durchschauen und trotzdem genießen. Daraus folgt die Pointe des Decks. Man spielt den Verräter, um ihn im echten Leben zu erkennen. Die Table-Flips gehören zur Show, die Freundschaft bleibt.

**Stützen aus den Booklets:**
- *66 IT'S STILL REAL TO ME (Wrestling):* Kayfabe ist "the agreement". Die Menge willigt ein zu glauben, der Performer willigt ein, geglaubt zu werden. Der Face/Heel-Turn ist ein Kernereignis, die "Hidden Agenda is the heel turn nobody saw coming". Gefährliche Moves wie der Dragon Suplex "require absolute trust between both performers". Der Montreal Screwjob ist der Fall, in dem der gespielte Verrat echt wird (Shoot). Daher die Intro-Zeile "Kayfabe: your best friend holds the chair."
- *06 Cooperation & Teamplay:* "If you expect cooperation, you get it. If you expect betrayal, you provoke it. … It's feedback logic." Homo Economicus ist selten (ca. 7 %), "The Myth: most assume others are selfish". Spielmodus "Trust Test". Das ist die Gegenthese, die das Deck satirisch umkreist: Es übertreibt Paranoia so lange, bis sie lächerlich wird.
- *21 META Theory:* Kayfabe = "maintenance of performed reality. Everyone knows it is staged. Yet everyone commits to it."
- *57 Homo Ludens / pvp_deck2:* Bündnisse und Verrat als Grundmotor von Gesellschaftsspielen (Uno, Diplomacy, Betrayal at House on the Hill). Die Karte THE BETRAYAL im PvP-Deck hat Brutus als Referenz.

**Publikum:** Kayfabizarro-Tische (Freestyle/Party), Social-Deduction- und Trope-Fans, Wrestling-Fans. Ton: grob, albern, Tierbesetzung (Hyänen, Walross, Gottesanbeterin, Seeteufel …), aber mit einem warmen Kern. Bühne laut `SUNO_NEXT_DECKS_R1`: Retro-Arcade-Casino.

## Kapitel
**Das gedruckte Deck hat keine Kapiteltitel und keine Seiten-Slogans.** Geprüft wurden alle 15 PDF-Seiten: Die Seiten 2–15 tragen nur je 4 Karten plus einen Eckausruf. Karte 30 (Heel-Face Turn, S. 9) zeigt nur Titel und Werte, keine Power und keine Lore. Deshalb fehlt sie im Triplet-Set (vgl. `TRIPLET_SETS_R2/batch8_ws0_intake/trust_and_betrayal.review.md`). Die Clusternamen unten sind **redaktionell** (wr1), nicht gedruckt. Im Song entspricht jede Seite einer Strophe.

| Seite | Karten | Cluster (redaktionell) | gedruckter Eckausruf |
|---|---|---|---|
| 1 | Cover | – | "Trust Me, Bro" / "Price: YOUR SOUL" / "WARNING: May cause trust issues and table flips." |
| 2 | 1–4 | Die Allianz | BLÖDSINN! |
| 3 | 5–8 | Paranoia & Versicherung | What the FLUFF?! |
| 4 | 9–12 | Die Nummer Zwei | – |
| 5 | 13–16 | Putsch & Vorstand | HUMBUG! |
| 6 | 17–20 | Spitzel & Singvögel | – |
| 7 | 21–24 | Familie | Stay fluffy! |
| 8 | 25–28 | Liebe | KayfaBONGO! |
| 9 | 29–32 | Turns (Face-Heel, Heel-Face [leer], Going Native, Quisling) | KayfaBIZARRO! |
| 10 | 33–36 | Fallen | BLÖDSINN! |
| 11 | 37–40 | Spieltheorie | KayfaBONGO! |
| 12 | 41–44 | Deals | What the FLUFF?! |
| 13 | 45–48 | Die Entbehrlichen | – |
| 14 | 49–52 | Enthüllungen | KayfaBOGGLE! |
| 15 | 53–56 | Finale | – |

## Dramatischer Bogen (Meta-Story)
Uncle FrizzleBob eröffnet den Karaoke-Abend als **Tag-Team mit dem Publikum** ("Tag team, partner:"). Die erste Karte ist natürlich der Pakt zum gegenseitigen Verrat ("why are you surprised?"). Er klaut, während der Partner auf dem Klo ist ("Bathroom break?"), sagt "Love you." und spielt den False Friend. Der Kaffee ist vergiftet ("Who made the coffee?"). Die Mitte läuft ohne Kommentar durch Büro, Spitzel, "Family hour." und Liebe, die Karten tragen sich selbst. Bei Face-Heel Turn wird FrizzleBob selbst zum Heel ("Boo me!"). Dann das Wrestling-Herz des Songs: **Karte 30, Heel-Face Turn, ist leer gedruckt** ("Thirty: blank. Nobody bought it." Auf dem Bild hält ein Wolf den drei Schweinchen ein Gänseblümchen hin.) Die Rückkehr zum Guten glaubt keiner. Danach Geschenk ("A gift:", Trojanisches Pferd), Gefangenendilemma ("Partner? Silent."), zweiter Kaffee ("Second coffee?", Giftkelch), das Cover-Versprechen als Lüge ("Trust me, bro." vor dem gekreuzten Finger). Im Finale verrät das Publikum ihn ("You too, partner?", Et Tu Brute), er verliert die Schuhe ("My shoes!", Karte 55: "steal shoes"). Mit Regretful Traitor füllt er die leere Karte 30 selbst aus ("Thirty, filled in:", er opfert sich). Schluss: "Shoes gone. Soul kept. Still partners." Das schließt "Price: your soul." aus dem Intro (Sole/Soul).

Innere Logik: Den ganzen Abend verraten sich Bühne und Saal gegenseitig, und am Ende sind sie immer noch Partner. Das ist Kayfabe und genau die These des Decks: Verrat als Spiel, Vertrauen als Bedingung des Spiels.

## Running Jokes und Callbacks
1. **Partner (Tag-Team):** 1 "Tag team, partner:" → 37 "Partner? Silent." → 53 "You too, partner?" → Schluss "Still partners."
2. **Karte 30 / Heel-Face Turn:** 29 "Boo me!" (Heel) → "Thirty: blank. Nobody bought it." → 56 "Thirty, filled in:" (Erlösung via Regretful Traitor).
3. **Kaffee:** 7 "Who made the coffee?" (vergiftet vor drei Wochen) → 42 "Second coffee?" (Giftkelch).
4. **Soul/Sole:** Intro "Price: your soul." (Cover) → 55 "My shoes!" → "Shoes gone. Soul kept."
5. **Trust me, bro.:** Intro-Tagline (Cover-Slogan) → 43 als Opener vor Lying Finger Cross (das Versprechen ist die Lüge).

## Opener-Liste (13 + 1 Zwischenzeile)
| Karte | Opener | Typ |
|---|---|---|
| 1 | Tag team, partner: | Setup (Wrestling) |
| 2 | Bathroom break? | Situationsfrage |
| 4 | Love you. | Ironie |
| 7 | Who made the coffee? | Setup Kaffee |
| 21 | Family hour. | Ortsmarke |
| 29 | Boo me! | Heel-Turn (Selbstinszenierung) |
| (30) | Thirty: blank. Nobody bought it. | Zwischenzeile, Meta |
| 33 | A gift: | Ironie |
| 37 | Partner? Silent. | Callback Partner |
| 42 | Second coffee? | Callback Kaffee |
| 43 | Trust me, bro. | Callback Cover |
| 53 | You too, partner? | Callback/Klimax |
| 55 | My shoes! | Ausruf, Setup Schluss |
| 56 | Thirty, filled in: | Auflösung Karte 30 |

Keine mechanische Rotation. Die Lücken (u. a. 8–20 und 44–52) sind gewollt, aber auch dem Zeichenlimit geschuldet: Die Triplets allein brauchen schon ca. 4400 Zeichen. Gestrichene Kandidaten: "Boss, a word?" (9), "Quick meeting." (16), "Off the record:" (19), "Date night." (25), "Dinner is served." (36), "Make me an offer." (41), "Wasn't me:" (45), "Thanks for everything." (48), "New guy!" (49), "Who ordered breakfast?" (51), "Remember the bathroom?" (54, Callback auf 2).

## Intro
- "Trust and Betrayal: Fake the backstab – not the friendship!" (Kernthese im "– not X!"-Format; "and" statt "&" für die Aussprache)
- Karaoke-Zeile + Taglines "Trust me, bro." / "Price: your soul." (beide gedruckt auf dem Cover)
- "Uncle FrizzleBob's Meta-Message: play the traitor, spot the traitor." / "Kayfabe: your best friend holds the chair."

## Editorial-Pass (V-364) – Übersicht
20 songLines, alle minimal: Artikel und Verben in wörtlicher Rede, Lore-Pointen, die im Telegrammstil verloren gehen (16 Email, 32 Overlords, 42 "or lack thereof", 45 "Wait, I have horns"), Satzzeichen-Kollisionen nach Titeln mit "!"/"?" (38, 53, 55), Ziffer → Wort (54). Telegrammzeilen im Stil der Gold-Referenz bleiben unverändert (z. B. 5, 6, 12, 40, 41). Details mit Begründung in der JSON.

## Style-Prompts (V-362, rein musikalisch)
**A – männlich, 98 bpm:**
Minor-key slow funk, dry close-mic studio sound with warm tape saturation; slinky fretless bass, wah guitar scratches, Rhodes stabs, tight rimshot backbeat and finger snaps; sly, suspicious mood with sudden stop-time breaks; solo male baritone, smooth deadpan spoken delivery with crisp consonants and knowing pauses; swaggering head-nodding pocket groove; 98 bpm

**B – weiblich, 112 bpm:**
Tango-funk, bandoneon stabs and staccato piano over upright bass, syncopated hand percussion and a dry snare backbeat; tense, playful minor-key mood with sharp accents and sudden breaks; solo female mezzo, low sultry spoken delivery with sharp diction and teasing pauses; danceable habanera groove; 112 bpm

Abgrenzung zur Epistemic-Take (weiblich solo, Electro-Swing, 124 bpm): A wechselt Stimme und Genre, B wechselt Genre und Tempo. Kein Story-Vokabular. Alle Begriffe sind Instrumente, Spielweisen, Stimmlage, Delivery oder Stimmung.

## Quellen (für das Deck-Dossier-Datenmodell: sources → essay → deck → cards → song)
**Primär (Deck):**
- PDF "Uncle_FrizzleBobs_Kayfabizarro_Kards_TRUST_&_BETRAYAL - ADD.pdf" (MODIFIED PROTOTYPES v05), alle 15 Seiten gesichtet
- Registry `bb/main:registry/assets/v1/decks/trust_and_betrayal.json` (cardName, lore, power, deckType, tags)
- `trust_and_betrayal.arc2.takes.csv` (kanonische Triplets)

**Booklets ("MD BOOKLETS (drafts)"):**
- `66 FrizzleBob's_Fractal_Almanac - ITS_STILL_REAL_Wrestling_Card Deck Add-On 21.md`: Kayfabe als Agreement, Face/Heel-Turn, Dragon-Suplex-Vertrauen, Montreal Screwjob, Hidden Agenda = Heel Turn
- `06 ADD-ON - Cooperation & Teamplay v4.0.md`: "If you expect betrayal, you provoke it", Trust Test, Homo-Economicus-Mythos
- `21 META - About Kayfabizarro & Theory v4.0.md`: Kayfabe als performte Realität
- `57 FrizzleBob's_Fractal_Almanac - homo_ludens_full_deck.md`: Bündnis und Verrat als Spielmotor
- `kayfabizarro_pvp_deck2_longGame.md`: Karte THE BETRAYAL (Brutus)
- `09 ADD-ON - Love & Bonding v4.0.md` (Randnotiz: Beziehungen zerbrechen eher an Logistik als an dramatischem Verrat; nicht verwendet)

**Substack (cancelthiscomic.substack.com):** Das Archiv wurde komplett per API gelistet und nach betray/trust/kayfabe/heel/wrestling/loyalty durchsucht. **Kein Post bezieht sich direkt auf dieses Deck.** Die meisten Posts sind Audio/Video mit wenig Text. Am nächsten dran:
- "This Is Not Your Average Substack: An Open Invitation to the Creative Chaos of 'Cancel This Comic!'" (`this-is-not-your-average-blog-an`): Publikum "slightly paranoid (trust me, you're in good company)", passt zu Properly Paranoid und "Trust me, bro"
- "FrizzleBob's 'Five Star Trust' Audit" (`frizzlebobs-five-star-trust-audit`): "'trust' = betrayal vault", "narrative escrow: belief held in trust". Satirische Lesart von Vertrauen als Erzählung, nur thematisch verwandt
- "WTF is Cancel This Comic!?" (`wtf-is-cancel-this-comic-intro-podcast`): Figurenhintergrund (Didi, Filterblasen-Vertrauen), nur Kontext

**Hub-intern:** `SUNO_NEXT_DECKS_R1.md` (Bühne Retro-Arcade-Casino, Spieltheorie-Fokus), `TRIPLET_SETS_R2/batch8_ws0_intake/trust_and_betrayal.review.md` (Karte 30 ohne gedruckten Text).

## Offene Punkte
- Karte 30 ist im Song nur als Meta-Zwischenzeile präsent. Falls Georg eine eigene Triplet-Zeile für Heel-Face Turn will, fehlt dafür der gedruckte Text (JSON-Power ist ein Datenfehler laut WS0-Review).
- Zeichenreserve nur 9 Zeichen. Jeder zusätzliche Opener braucht eine Streichung.
