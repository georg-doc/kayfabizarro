# WS0-Intake · Uncle FrizzleBob's Tragic Flaws [uncle_frizzlebob_s_tragic_flaws_id]

Quelle: `editorial/kfb-triplets-eight-decks-r2-2026-10-15 @31639721`, Kartentext `data/kfb-card-title-case-2026-10-15` @eade4aec (`media/kfb/Uncle_FrizzleBob_s_Tragic_Flaws_-_shakespeare_-_ADD_web_ID.pdf.json`), Register @52adc8f1. PDF: `media/kfb/Uncle_FrizzleBob_s_Tragic_Flaws - shakespeare - ADD web ID.pdf` (identisch mit der lokalen v05-Kopie, Git-Blob verglichen).

## Technik
- Python-Prüfskript (exakt, `triplet_set_check.py`) auf geliefertem `takes.csv`: **56 PASS / 0 FAIL** (Ausgabe: `uncle_frizzlebob_s_tragic_flaws_id.check.ws0.txt`).
- `suno.txt`: **4383 Zeichen** (< 5000). Nach allen Fixes unten: **4757 Zeichen**. Alle Fix-Zeilen mit demselben Prüfskript nachgeprüft: 0 FAIL (`uncle_frizzlebob_s_tragic_flaws_id.fixcheck.ws0.txt`).
- `takes.csv`, `suno.txt` und `hub.json` stimmen Zeile für Zeile überein; Skips stehen in `hub.json` mit `inTrack: false`.

## Intro
- Geliefert: „Uncle FrizzleBob's Tragic Flaws: Hamlet, Macbeth, Lear, Cleopatra, Queen Mab.“
- Urteil: **TUNE** – Nicht erfunden, aber 5 Kartentitel statt 2–3. Gedrucktes Manifest (S. 1) ungenutzt.
- Vorschlag (nur gedrucktes Material): „Uncle FrizzleBob's Tragic Flaws. Reality is for cowards. Hamlet, Macbeth, Lear.“

## Opener
- 19 Opener, Dubletten: 0, Familienabstand ≥ 10: ja (heard: Have you heard of (Z. 30), Did you hear of (Z. 51) – Abstand 21; know: You know (Z. 6), Do you know (Z. 48) – Abstand 42)
- Harte Passungsregeln („I once met“, „Ever tasted“, „You played“): nicht benutzt.
- „What if“ (Z. 9, #8) steht vor einer Nominalgruppe ohne Verb und ohne „?“ – passt nicht; Fix in der Tabelle.
- Zeichensetzung nach Opener fehlt in 10 Zeilen (Konvention der Goldens: Komma nach Anyway/No wait/Before we continue/Meanwhile elsewhere/You with the card in your hand; Doppelpunkt nach Not a metaphor/Everyone agrees/This one has a rule; „?“ nach Titel+Begriff bei Have you heard of/Did you hear of/Do you know). In der Tabelle mit „Z“ markiert und im Fix enthalten.
- Alle acht Decks nutzen exakt denselben Opener-Fahrplan (gleicher Opener auf gleicher Zeilennummer, jede 3. Zeile). Regelkonform, aber die Passung zur Karte ist dadurch Zufall.

## Zeilen
OK 41 · TUNE 15 · FAIL 0 · Z = nur Opener-Zeichensetzung

| Z. | # | Urteil | Geliefert | Befund | Fix (neuer Sprechtext) |
|---:|---:|---|---|---|---|
| 1 | Intro | TUNE | Uncle FrizzleBob's Tragic Flaws: Hamlet, Macbeth, Lear, Cleopatra, Queen Mab. | Nicht erfunden, aber 5 Kartentitel statt 2–3. Gedrucktes Manifest (S. 1) ungenutzt. | Uncle FrizzleBob's Tragic Flaws. Reality is for cowards. Hamlet, Macbeth, Lear. |
| 2 | 1 | OK | Hamlet, The Mopey Hound, Indecision: heads nothing, tails poem about nothing |  |  |
| 3 | 2 | TUNE | Remember Claudius, The Rat King, Usurp: swap hands | Nur Mechanik, Zitat fehlt. | Remember Claudius, The Rat King, Usurp: swap hands; a brother's murder. Pray can I not. |
| 4 | 3 | TUNE | Gertrude, The Poodle, Willful Ignorance: ignore Action effects | Nur Mechanik, Zitat fehlt. | Gertrude, The Poodle, Willful Ignorance: ignore Action; lady doth protest too much. |
| 5 | 4 | OK | The Ghost, The Sheet, Haunt: discard highest card; father's spirit walk the night. |  |  |
| 6 | 5 | TUNE | You know Polonius, The Parrot, Verbose: uninterrupted talk | Nur Mechanik, Zitat fehlt. | You know Polonius, The Parrot, Verbose: talk uninterrupted; brevity is soul of wit. |
| 7 | 6 | OK | Ophelia, The Otter, Distraction: sing song; know what we are, not what we may be. |  |  |
| 8 | 7 | TUNE | Laertes, The Gamecock, Revenge: double damage to player with Hamlet card | Nur Mechanik, Zitat fehlt. | Laertes, The Gamecock, Revenge: double damage to Hamlet player; I dare damnation. |
| 9 | 8 | TUNE | What if Horatio, The Retriever, Witness: narrate winner's victory | „What if“ braucht Satz und Fragezeichen. | What if Horatio, The Retriever, Witness, narrates winner's victory to make them feel guilty? |
| 10 | 9 | OK | Yorick, The Prop, Memento Mori: discard Vanity; infinite jest, where be your gibes? |  |  |
| 11 | 10 | TUNE | Rosencrantz & Guildenstern, Expendable: discard to avoid damage | Nur Mechanik, Zitat fehlt. | Rosencrantz & Guildenstern, Expendable: discard to avoid damage; not near my conscience. |
| 12 | 11 | OK · Z | Anyway The Mousetrap Play, Guilt Trip: King card discarded; play catches King's conscience. |  | Anyway, The Mousetrap Play, Guilt Trip: King card discarded; play catches King's conscience. |
| 13 | 12 | OK | The Poison Cup, Accidental Death: pass left, lose HP; drink, I am poison'd. |  |  |
| 14 | 13 | OK | Macbeth, The Hyena, Ambition: Power gained, cannot sleep; blood stepp'd in so far. |  |  |
| 15 | 14 | OK · Z | No wait Lady M, The Sphynx Cat, Coercion: force another to attack; out damned spot. |  | No wait, Lady M, The Sphynx Cat, Coercion: force another to attack; out damned spot. |
| 16 | 15 | TUNE | The Weird Sisters, Prophecy: Arrange cards; double toil, trouble, cauldron bubble. | Pointe fehlt („screw over your friends“). | The Weird Sisters, Prophecy: arrange cards to screw over friends; double toil and trouble. |
| 17 | 16 | TUNE | Banquo, The Ghost Dog, Guilt: most cards cannot play Actions | Nur Mechanik, Zitat fehlt. | Banquo, The Ghost Dog, Guilt: most cards cannot play Actions; never shake thy gory locks. |
| 18 | 17 | OK · Z | Before we continue Macduff, The Ram, Not Born of Woman: Tyrant defeated; womb untimely ripp'd. |  | Before we continue, Macduff, The Ram, Not Born of Woman: Tyrant defeated; womb untimely ripp'd. |
| 19 | 18 | TUNE | Lady Macduff, The Bird, Innocence: attacker loses Reputation | Nur Mechanik, Zitat fehlt. | Lady Macduff, The Bird, Innocence: attacker loses Reputation; poor bird! |
| 20 | 19 | OK | The Porter, The Badger, Comic Relief: pause game, everyone drink |  |  |
| 21 | 20 | OK · Z | Not a metaphor Malcolm, The Lamb, Restoration: discard pile back into deck; country's purge. |  | Not a metaphor: Malcolm, The Lamb, Restoration: discard pile back into deck; country's purge. |
| 22 | 21 | OK | The Air-Drawn Dagger, Hallucination: failed attack on yourself; dagger before me. |  |  |
| 23 | 22 | OK | Birnam Wood, Camouflage: units not targeted; wood comes toward Dunsinane. |  |  |
| 24 | 23 | OK | The thing about The Cauldron, Brew: weak cards into strong; baboon's blood, charm good. |  |  |
| 25 | 24 | OK | Sleep, Insomnia: no Rest or heal; murder innocent sleep. |  |  |
| 26 | 25 | OK | Lear, The Old Lion, Abdicate: give half cards, then scream |  |  |
| 27 | 26 | OK · Z | Everyone agrees The Fool, The Bird, Truth Bomb: reveal hand, mock strategy |  | Everyone agrees: The Fool, The Bird, Truth Bomb: reveal hand, mock strategy |
| 28 | 27 | OK | Goneril, The Vulture, Eviction: discard Home; boil, plague sore. |  |  |
| 29 | 28 | OK | Regan, The Cobra, Cruelty: player Blind, face-down cards; prescribe not us our duty. |  |  |
| 30 | 29 | OK · Z | Have you heard of Gloucester, The Mole, Despair: jump cliff or survive; no way, want no eyes. |  | Have you heard of Gloucester, The Mole, Despair? Jump cliff or survive; no way, want no eyes. |
| 31 | 30 | TUNE | Edmund, The Fox, Bastard's Ambition: lowest for highest card | Nur Mechanik, Zitat fehlt. | Edmund, The Fox, Bastard's Ambition: swap lowest for highest; gods, stand up for bastards! |
| 32 | 31 | OK | Edgar, The Mongrel, Disguise: no attacks target; foul fiend bites back. |  |  |
| 33 | 32 | OK | Let me tell you about Kent, The Bulldog, Bluntness: cancel Flattery; occupation to be plain. |  |  |
| 34 | 33 | OK | The Storm, Cataclysm: discard cards; winds crack cheeks, rage. |  |  |
| 35 | 34 | OK | The Stocks, Humiliation: lose next turn; Fortune ne'er turns key to poor. |  |  |
| 36 | 35 | OK · Z | This one has a rule The Cliff, Placebo: heal 5 HP, nothing actually happened; cliff altitude. |  | This one has a rule: The Cliff, Placebo: heal 5 HP, nothing actually happened; cliff altitude. |
| 37 | 36 | OK | Cordelia, The Dove, Tragic End: everyone loses; dog, horse, rat have life. |  |  |
| 38 | 37 | OK | Cleopatra, The Peacock-Snake, Infinite Variety: change rules; age cannot wither her. |  |  |
| 39 | 38 | TUNE | Nobody warned us about Antony, The Old War Horse, Dotage: ignore responsibilities | Nur Mechanik, Zitat fehlt. | Nobody warned us about Antony, The Old War Horse, Dotage: ignore responsibilities; triple pillar into strumpet's fool. |
| 40 | 39 | OK | Octavius, The Shark, Bureaucracy: tax players; fishes, drinks, wastes lamps. |  |  |
| 41 | 40 | TUNE | Enobarbus, The Fox, Defection: switch alliances, die later | Pointe verkürzt („die later“). | Enobarbus, The Fox, Defection: switch alliances mid-battle, die of heartbreak later. |
| 42 | 41 | TUNE | The deck insists on Charmian & Iras, Flamingos, Fortune Telling: predict next card | Nur Mechanik, Zitat fehlt. | The deck insists on Charmian & Iras, Flamingos, Fortune Telling: predict next card; three kings, widow them all. |
| 43 | 42 | OK | Lepidus, The Crocodile, Third Wheel: nothing effective; what manner thing crocodile? |  |  |
| 44 | 43 | OK | Eros, The Squire, Self-Sacrifice: damage for Leader; escape Antony's sorrow. |  |  |
| 45 | 44 | OK | Which brings us to The Messenger, Bad News: bearer damage; bad news infects teller. |  |  |
| 46 | 45 | OK | The Asp, Quick Exit: Character removed; sharp teeth untie life. |  |  |
| 47 | 46 | OK | Naval Battle, Retreat: flee battle; world lost with ignorance. |  |  |
| 48 | 47 | OK · Z | Do you know The Monument, Siege: cannot attack or be attacked; lock yourself, word you are dead. |  | Do you know The Monument, Siege? Cannot attack or be attacked; lock yourself, word you are dead. |
| 49 | 48 | OK | Excessive Wine, Debauchery: skip turn to party; judgments drop in filth. |  |  |
| 50 | 49 | OK | Mercutio, The Mongoose, A Plague on Both Houses: damage strongest; worms' meat. |  |  |
| 51 | 50 | TUNE | Did you hear of Queen Mab, The Bug, Inception: false idea in opponent's hand | Frage-Opener ohne „?“; Zitat fehlt. | Did you hear of Queen Mab, The Bug, Inception? False idea in opponent's hand; fairies' midwife. |
| 52 | 51 | OK | Dreams, Illusion: cancel attack; nothing but vain fantasy. |  |  |
| 53 | 52 | TUNE | The Hazel-Nut Chariot, Transport: discarded card to hand | Nur Mechanik, Zitat fehlt. | The Hazel-Nut Chariot, Transport: discarded card to hand; joiner squirrel or old grub. |
| 54 | 53 | OK | Welcome to Exeunt Omnes, Game Over: most Tragedy points win; rest silence. |  |  |
| 55 | 54 | OK | Exit, Pursued by a Bear, Sudden Death: player eliminated; gone for ever. |  |  |
| 56 | 55 | OK | The Skull's Song, Encore: character back from dead; skull had tongue, could sing. |  |  |
| 57 | 56 | OK · Z | Meanwhile elsewhere Uncle FrizzleBob's Approval, Chaos: Shuffle all hands, redeal |  | Meanwhile elsewhere, Uncle FrizzleBob's Approval, Chaos: Shuffle all hands, redeal |
