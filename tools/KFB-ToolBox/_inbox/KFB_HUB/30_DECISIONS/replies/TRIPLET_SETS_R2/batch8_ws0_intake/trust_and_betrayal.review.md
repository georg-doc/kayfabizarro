# WS0-Intake · Trust & Betrayal — The 'Trust Me, Bro' Edition [trust_and_betrayal]

Quelle: `editorial/kfb-triplets-eight-decks-r2-2026-10-15 @31639721`, Kartentext `data/kfb-card-title-case-2026-10-15` @eade4aec (`media/kfb/Uncle_FrizzleBobs_Kayfabizarro_Kards_TRUST_&_BETRAYAL_-_ADD_web.pdf.json`), Register @52adc8f1. PDF: `media/kfb/Uncle_FrizzleBobs_Kayfabizarro_Kards_TRUST_&_BETRAYAL - ADD web.pdf` (identisch mit der lokalen v05-Kopie, Git-Blob verglichen).

## Technik
- Python-Prüfskript (exakt, `triplet_set_check.py`) auf geliefertem `takes.csv`: **55 PASS / 0 FAIL** (Ausgabe: `trust_and_betrayal.check.ws0.txt`).
- `suno.txt`: **4201 Zeichen** (< 5000). Nach allen Fixes unten: **4656 Zeichen**. Alle Fix-Zeilen mit demselben Prüfskript nachgeprüft: 0 FAIL (`trust_and_betrayal.fixcheck.ws0.txt`).
- `takes.csv`, `suno.txt` und `hub.json` stimmen Zeile für Zeile überein; Skips stehen in `hub.json` mit `inTrack: false`.

## Intro
- Geliefert: „Trust & Betrayal — The Trust Me, Bro Edition: The Oath-Breaker, The Mole.“
- Urteil: **OK** – Cover druckt „The “Trust Me, Bro” Edition“; „Trust & Betrayal“ ist Registertitel. 2 Kartentitel. Nicht erfunden.

## Opener
- 18 Opener, Dubletten: 0, Familienabstand ≥ 10: ja (heard: Have you heard of (Z. 30), Did you hear of (Z. 51) – Abstand 21; know: You know (Z. 6), Do you know (Z. 48) – Abstand 42)
- Harte Passungsregeln („I once met“, „Ever tasted“, „You played“): nicht benutzt.
- „What if“ (Z. 9, #8) steht vor einer Nominalgruppe ohne Verb und ohne „?“ – passt nicht; Fix in der Tabelle.
- Zeichensetzung nach Opener fehlt in 9 Zeilen (Konvention der Goldens: Komma nach Anyway/No wait/Before we continue/Meanwhile elsewhere/You with the card in your hand; Doppelpunkt nach Not a metaphor/Everyone agrees/This one has a rule; „?“ nach Titel+Begriff bei Have you heard of/Did you hear of/Do you know). In der Tabelle mit „Z“ markiert und im Fix enthalten.
- Alle acht Decks nutzen exakt denselben Opener-Fahrplan (gleicher Opener auf gleicher Zeilennummer, jede 3. Zeile). Regelkonform, aber die Passung zur Karte ist dadurch Zufall.

## Ausgelassene Karten
- #30 Heel-Face Turn: **BERECHTIGT (Grund präzisieren)** – Druck S. 9 oben rechts zeigt nur Titel und Werte, weder Power noch Lore. Das JSON führt trotzdem eine Power („Switch from 'Evil' to 'Good' …“) – die ist nicht gedruckt (Datenfehler für WS0). Skip richtig, Grund ist „kein gedruckter Text“, nicht „LORE null“.

## Zeilen
OK 39 · TUNE 15 · FAIL 1 · Z = nur Opener-Zeichensetzung

| Z. | # | Urteil | Geliefert | Befund | Fix (neuer Sprechtext) |
|---:|---:|---|---|---|---|
| 1 | Intro | OK | Trust & Betrayal — The Trust Me, Bro Edition: The Oath-Breaker, The Mole. | Cover druckt „The “Trust Me, Bro” Edition“; „Trust & Betrayal“ ist Registertitel. 2 Kartentitel. Nicht erfunden. |  |
| 2 | 1 | TUNE | Inevitable Mutual Betrayal, Lowest value loses everything | Pointe fehlt. | Inevitable Mutual Betrayal, reveal hands, lowest loses everything; why are you surprised? |
| 3 | 2 | OK | Remember In the Back, Steal best card when opponent leaves; cowards live longer. |  |  |
| 4 | 3 | OK | The Oath-Breaker, Cancel Promise or Alliance; words wind, paper burns. |  |  |
| 5 | 4 | TUNE | False Friend, Opponent's highest card discarded | Pointe fehlt („tell them you love them“). | False Friend, tell them you love them, discard their highest card. |
| 6 | 5 | OK | You know Properly Paranoid, Check bottom card; universe actually out to get you. |  |  |
| 7 | 6 | OK | Spies Are Despicable, Worst possible order; hate spies for lying, pay for truth. |  |  |
| 8 | 7 | TUNE | Betrayal Insurance, If player steals from you, steal two items | Pointe fehlt. | Betrayal Insurance, steal two items; poisoned your coffee three weeks ago. |
| 9 | 8 | TUNE | What if Chronic Backstabbing Disorder, MUST betray ally | Versalien „MUST“; „What if“ braucht Satz und Fragezeichen. | What if Chronic Backstabbing Disorder, must betray ally? Like sneezing, but with more knives. |
| 10 | 9 | TUNE | The Starscream, Challenge leader, apologize on loss | Pointe fehlt. | The Starscream, challenge leader, if you lose, apologize; grovel to face, plot against back. |
| 11 | 10 | OK | The Yes-Man, Copy action, do it worse; agree with what you said yesterday. |  |  |
| 12 | 11 | TUNE | Anyway Stealing the Credit, Take card someone else played | Pointe fehlt. | Anyway, Stealing the Credit, take card someone else played; it's yours now. I made this. |
| 13 | 12 | OK | Bastard Understudy, Eliminated player, take seat and hand; break a leg, crowbar. |  |  |
| 14 | 13 | OK | The Coup, Overthrow player with most points; Captain now until Lemurs hungry. |  |  |
| 15 | 14 | TUNE | No wait The Puppet Master, Force another player's move | Pointe fehlt. | No wait, The Puppet Master, force another player's move; dance, little fly. |
| 16 | 15 | TUNE | I Can Rule Alone, Break alliance, shared resources | Verb und Pointe fehlen. | I Can Rule Alone, break alliance, take shared resources; lose turn, you are now lonely. |
| 17 | 16 | OK | Board to Death, Meeting: everyone gives card; email, but then eat you. |  |  |
| 18 | 17 | OK · Z | Before we continue The Mole, Peek at everyone's hand; digging for dirt, not worms. |  | Before we continue, The Mole, Peek at everyone's hand; digging for dirt, not worms. |
| 19 | 18 | OK | Double Agent, Play on someone else's turn; their move, your target; mostly my side. |  |  |
| 20 | 19 | OK | The Stool Pigeon, Name card, opponent discards; sing like bird for plea deal. |  |  |
| 21 | 20 | TUNE | Not a metaphor Dead Person Impersonation, Retrieve graveyard card | Pointe fehlt. | Not a metaphor: Dead Person Impersonation, retrieve graveyard card; death exaggerated to collect insurance money. |
| 22 | 21 | OK | Betrayal by Offspring, Bad card to parent; thanks food Mom, now out of kingdom. |  |  |
| 23 | 22 | TUNE | Parental Betrayal, Sacrifice lower card for higher; brought you into world, snack. | „snack“ ohne „take you out for“ sinnlos. | Parental Betrayal, sacrifice lower card for higher; I can take you out for snack. |
| 24 | 23 | OK | The thing about Not Actually His Child, Reveal secret, swap hand with deck; milkman's beak. |  |  |
| 25 | 24 | OK | Kinslaying, Same faction eliminated; evil saves on holiday gifts. |  |  |
| 26 | 25 | OK | Love-Interest Traitor, Opponent helps, steal points; working for Empire all along. |  |  |
| 27 | 26 | TUNE | Everyone agrees The Honey Trap, Force attack, reflect damage | Pointe fehlt. | Everyone agrees: The Honey Trap, force attack, reflect damage; not love, bioluminescent predatory bait. |
| 28 | 27 | OK | Fair-Weather Friend, Abandon ally for points; with you until slightly inconvenient. |  |  |
| 29 | 28 | FAIL | Mistaken for Betrayal, Attack looks like healing; why hitting with newspaper? | Mechanik umgekehrt: Karte sieht aus wie Angriff und heilt, Zeile sagt das Gegenteil. | Mistaken for Betrayal, looks like attack, actually heals; why hitting me with newspaper? |
| 30 | 29 | OK · Z | Have you heard of Face-Heel Turn, Good to Evil, healing into damage; chew furniture. |  | Have you heard of Face-Heel Turn? Good to Evil, healing into damage; chew furniture. |
| 31 | 31 | OK | Going Native, Adopt ability of player to left; shrimp better here. |  |  |
| 32 | 32 | OK | The Quisling, Help opponent against own team; new insect-eating overlords. |  |  |
| 33 | 33 | OK | Let me tell you about Trojan Horse, Gift card, opponent loses cards; Greeks bearing gifts, wooden Cats. |  |  |
| 34 | 34 | OK | Lured Into a Trap, High-value card face down; looked delicious, snapped spine. |  |  |
| 35 | 35 | OK | False Innocence Trick, Negate accusation; who me, just a lil' guy. |  |  |
| 36 | 36 | OK · Z | This one has a rule Nasty Party, Lowest roll executed; Red Wedding catering exquisite. |  | This one has a rule: Nasty Party, Lowest roll executed; Red Wedding catering exquisite. |
| 37 | 37 | OK | Prisoner's Dilemma, Snitch or Silent; if both talk, we cook. |  |  |
| 38 | 38 | OK | I Surrender, Suckers!, Cancel combat, then double damage; white flag, just napkin. |  |  |
| 39 | 39 | OK | Nobody warned us about Rash Equilibrium, No attacks until next turn; stand here and die of thirst. |  |  |
| 40 | 40 | OK | The Gambit, Sacrifice best card to win unless die first |  |  |
| 41 | 41 | TUNE | Thirty Pieces of Silver, Sell ally for resource tokens | Pointe fehlt. | Thirty Pieces of Silver, sell out ally; loyalty surprisingly affordable in this economy. |
| 42 | 42 | OK | The deck insists on Poisoned Chalice, Offer card, accept and die; toast to health or lack. |  |  |
| 43 | 43 | TUNE | Lying Finger Cross, Retroactively cancel deal | Pointe fehlt. | Lying Finger Cross, cancel deal; doesn't count if digits intertwined. International law. |
| 44 | 44 | OK | Burner Phone, Secret contact, swap cards; new number, already gone. |  |  |
| 45 | 45 | OK | Which brings us to The Scapegoat, Transfer damage to another player; guy with horns, I have horns. |  |  |
| 46 | 46 | OK | Cannon Fodder, Discard Minion to block; bravery matched by expendability. |  |  |
| 47 | 47 | OK | Shoot the Messenger, Discard card from their hand; bad news capital offense. |  |  |
| 48 | 48 | TUNE | Do you know You Have Outlived Your Usefulness, Eliminate own ally for strength | Frage-Opener ohne „?“; Pointe fehlt. | Do you know You Have Outlived Your Usefulness? Eliminate own ally; job is done, and so are you. |
| 49 | 49 | OK | Sixth Ranger Traitor, Join team, betray immediately; evil since opening credits. |  |  |
| 50 | 50 | OK | Evil All Along, True form revealed, new hand; cocooning rage. |  |  |
| 51 | 51 | TUNE | Did you hear of Manchurian Candidate, Activate Sleeper, control next turn | Frage-Opener ohne „?“; Pointe fehlt. | Did you hear of Manchurian Candidate, activate Sleeper? When you hear Omelette, kill Prime Minister. |
| 52 | 52 | OK | The Corruptible, Join opponent's team for card; morals and mud. |  |  |
| 53 | 53 | OK | Et Tu, Brute?, Best friend attack wins, heartbreak; then fall Fido. |  |  |
| 54 | 54 | OK | Welcome to The Vendetta, Target player who hurt you 5 turns ago; elephants never forget. |  |  |
| 55 | 55 | OK | Curse Your Sudden but Inevitable Betrayal!, Betrayed, shout title, steal shoes |  |  |
| 56 | 56 | OK | Regretful Traitor, Sacrifice yourself to save another; I won, at what cost? |  |  |
