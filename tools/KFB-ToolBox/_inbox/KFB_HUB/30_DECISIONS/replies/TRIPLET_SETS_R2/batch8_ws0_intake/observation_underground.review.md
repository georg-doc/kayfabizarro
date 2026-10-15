# WS0-Intake · Observation Underground — ADD [observation_underground]

Quelle: `editorial/kfb-triplets-eight-decks-r2-2026-10-15 @31639721`, Kartentext `data/kfb-card-title-case-2026-10-15` @eade4aec (`media/kfb/Observation_Underground_-_ADD_web.pdf.json`), Register @52adc8f1. PDF: `media/kfb/Observation_Underground - ADD web.pdf` (identisch mit der lokalen v05-Kopie, Git-Blob verglichen).

## Technik
- Python-Prüfskript (exakt, `triplet_set_check.py`) auf geliefertem `takes.csv`: **48 PASS / 0 FAIL** (Ausgabe: `observation_underground.check.ws0.txt`).
- `suno.txt`: **3583 Zeichen** (< 5000). Nach allen Fixes unten: **4078 Zeichen**. Alle Fix-Zeilen mit demselben Prüfskript nachgeprüft: 0 FAIL (`observation_underground.fixcheck.ws0.txt`).
- `takes.csv`, `suno.txt` und `hub.json` stimmen Zeile für Zeile überein; Skips stehen in `hub.json` mit `inTrack: false`.

## Intro
- Geliefert: „Observation Underground — ADD: Uncle FrizzleBob, Die Taschenspion, The Media Matrix.“
- Urteil: **TUNE** – „— ADD“ ist ein Datei-/Produktionskürzel, nicht gedruckt, wird aber gesprochen; „Die Taschenspion“ steht so nicht im Druck („The Taschenspion“). Gedrucktes Cover-Motto ungenutzt.
- Vorschlag (nur gedrucktes Material): „Welcome to the Kult, Sheeple! Uncle FrizzleBob, Observationsökonomie, The Media Matrix.“

## Opener
- 16 Opener, Dubletten: 0, Familienabstand ≥ 10: ja (know: You know (Z. 6), Do you know (Z. 48) – Abstand 42)
- Harte Passungsregeln („I once met“, „Ever tasted“, „You played“): nicht benutzt.
- „What if“ (Z. 9, #8) steht vor einer Nominalgruppe ohne Verb und ohne „?“ – passt nicht; Fix in der Tabelle.
- Zeichensetzung nach Opener fehlt in 8 Zeilen (Konvention der Goldens: Komma nach Anyway/No wait/Before we continue/Meanwhile elsewhere/You with the card in your hand; Doppelpunkt nach Not a metaphor/Everyone agrees/This one has a rule; „?“ nach Titel+Begriff bei Have you heard of/Did you hear of/Do you know). In der Tabelle mit „Z“ markiert und im Fix enthalten.
- Alle acht Decks nutzen exakt denselben Opener-Fahrplan (gleicher Opener auf gleicher Zeilennummer, jede 3. Zeile). Regelkonform, aber die Passung zur Karte ist dadurch Zufall.

## Zeilen
OK 34 · TUNE 14 · FAIL 0 · Z = nur Opener-Zeichensetzung

| Z. | # | Urteil | Geliefert | Befund | Fix (neuer Sprechtext) |
|---:|---:|---|---|---|---|
| 1 | Intro | TUNE | Observation Underground — ADD: Uncle FrizzleBob, Die Taschenspion, The Media Matrix. | „— ADD“ ist ein Datei-/Produktionskürzel, nicht gedruckt, wird aber gesprochen; „Die Taschenspion“ steht so nicht im Druck („The Taschenspion“). Gedrucktes Cover-Motto ungenutzt. | Welcome to the Kult, Sheeple! Uncle FrizzleBob, Observationsökonomie, The Media Matrix. |
| 2 | 1 | TUNE | Uncle FrizzleBob, Narrative Sabotage: dispels techno-scenic illusions | Pointe fehlt (Eimer Wasserfarbe). | Uncle FrizzleBob, Narrative Sabotage: ruin Big Tech's PR with sloppy bucket of watercolour ink. |
| 3 | 2 | TUNE | Remember Observationsökonomie, Extracts lifespan daily | Pointe fehlt. | Remember Observationsökonomie, extracts lifespan daily; you aren't customer, your brain chemistry is product. |
| 4 | 3 | OK | Die Taschenspion, Pocket infiltrated, soul uploaded to Cloud | Datenhinweis: Druck zeigt „The Taschenspion“, JSON „Die Taschenspion“ (WS0-Daten, nicht Plugin). |  |
| 5 | 4 | TUNE | The Media Matrix, Infinite scroll doom loop | Pointe fehlt. | The Media Matrix, infinite scroll doom loop; captive animals staring into glowing rectangles. |
| 6 | 5 | OK | You know Smartphone-Akne, Charisma reduced, Wrist Shame; Petri dishes willingly held to face. |  |  |
| 7 | 6 | OK | Video-Schulter & Handy-Nacken, Submission posture, melee attention crippled |  |  |
| 8 | 7 | OK | P.V.S., Phantom notifications, Sanity points; ghost haunting pocket. |  |  |
| 9 | 8 | TUNE | What if M.A.I.D.S., Full brain rot; distraction dictatorship destroys cognitive capacity. | „What if“ braucht Satz und Fragezeichen. | What if M.A.I.D.S. unlocks full brain rot? Distraction dictatorship destroying cognitive capacity. |
| 10 | 9 | OK | F.O.M.O., Check screen every 4 seconds; digital world does not care. |  |  |
| 11 | 10 | OK | PtSS, Communication paralyzed; blinking dots, social contract as torture. |  |  |
| 12 | 11 | OK · Z | Anyway The Dopamine Drip, Synthetic joy replaces real achievements |  | Anyway, The Dopamine Drip, Synthetic joy replaces real achievements |
| 13 | 12 | TUNE | The 72-Million-Point Child, Digital destiny pre-computed | Pointe fehlt. | The 72-Million-Point Child, digital destiny pre-computed; profile finished before you're born. |
| 14 | 13 | TUNE | The G-Searcher, Records secrets and fears | Pointe fehlt. | The G-Searcher, records secrets and fears; knows what you want before you do. |
| 15 | 14 | TUNE | No wait The Apple-Deity, Surveillance as Lifestyle Premium | Pointe fehlt. | No wait, The Apple-Deity, surveillance as Lifestyle Premium; publicly defends privacy. |
| 16 | 15 | OK | The 52,000 Facebook Entries, Sells deepest neuroses |  |  |
| 17 | 16 | TUNE | Cambridge Analytica Ghost, Democratic realities altered | Flach. | Cambridge Analytica Ghost, took your quizzes, mapped your anger, sold custom political reality. |
| 18 | 17 | TUNE | Before we continue Face ID Infrared Sweeper, Maps bone structure | Pointe fehlt (alle 5 Sekunden, auch gesperrt). | Before we continue, Face ID Infrared Sweeper, maps bone structure every 5 seconds, even when locked. |
| 19 | 18 | TUNE | Siri the Eavesdropper, Always listening | Flach. | Siri the Eavesdropper, always listening; how else does she know when you want her? |
| 20 | 19 | OK | Attention-Sensitive Cam, Actions anticipated, micro-expressions analyzed |  |  |
| 21 | 20 | TUNE | Not a metaphor Neural Hashing, Local photos scanned | Flach. | Not a metaphor: Neural Hashing, scans every local photo; true privacy for photos no longer exists. |
| 22 | 21 | OK | The iCloud Trap, Nightly uploads; disabled cloud, life whispered to database. |  |  |
| 23 | 22 | OK | The Deleted Photo, Deleted files resurrected; ghosts of photos on servers. |  |  |
| 24 | 23 | OK | The thing about Microsoft's Recall, Encryption bypassed by screen photographs |  |  |
| 25 | 24 | OK | The Transcript File, Legal loopholes bypassed; audio into text, Checkmate privacy. |  |  |
| 26 | 25 | OK | Geofencing Collar, GPS coordinates lock functions; not available in region. |  |  |
| 27 | 26 | OK · Z | Everyone agrees CO2-Budgeting, Consumption restricted; smartphone tracks purchase and movement. |  | Everyone agrees: CO2-Budgeting, Consumption restricted; smartphone tracks purchase and movement. |
| 28 | 27 | TUNE | Social Credit System, Cancels digital existence | Kern fehlt (wrong-think). | Social Credit System, cancels digital existence for real-world wrong-think. |
| 29 | 28 | OK | Programmable Digital Currency, Money expires or refuses blacklisted items |  |  |
| 30 | 29 | OK · Z | Have you heard of B.L.E. Mesh Network, Devices communicate without user consent |  | Have you heard of B.L.E. Mesh Network? Devices communicate without user consent. |
| 31 | 30 | TUNE | The Contact-Tracing Kraken, Physical encounters tracked | Pointe fehlt. | The Contact-Tracing Kraken, reads physical encounters; you are carrying sanctioned radar beacon. |
| 32 | 31 | OK | Malware Over-the-Air, Installs military-grade payloads remotely and invisibly |  |  |
| 33 | 32 | OK | Let me tell you about Smartdust Frequency, Biological payload activated remotely |  |  |
| 34 | 33 | OK | DARPA's Toy, Weapons rebranded luxury; military budgets, lifestyle gadget. |  |  |
| 35 | 34 | OK | IN-Q-TEL, Covert creation funded; startup capital for surveillance tools. |  |  |
| 36 | 35 | TUNE | This one has a rule NSA Surveillance Backdoor, Reads everything regardless of encryption | Pointe „cute“ fehlt. | This one has a rule: NSA Surveillance Backdoor, reads everything regardless of your cute encryption. |
| 37 | 36 | OK | Google Play Protect, Unapproved apps deleted automatically |  |  |
| 38 | 37 | OK | The Dumb-Phone, Immunity to Dopamine, Tracking, Apps; when off, actually off. |  |  |
| 39 | 38 | OK | Nobody warned us about The Murena Fairphone, Breaks hardware duopoly |  |  |
| 40 | 39 | OK | The Volla Phone, Control over own data; zero pre-installed corporate wiretaps. |  |  |
| 41 | 40 | OK | The Removable Battery, True Stealth Mode; only guarantee device isn't recording. |  |  |
| 42 | 41 | OK | The deck insists on Graphene OS, Android base hardened; privacy fortress, security measures. |  |  |
| 43 | 42 | OK | F-Droid Repository, Play Store bypassed, no tracking; free open source sanctuary. |  |  |
| 44 | 43 | OK | The Aurora Store, Downloads mainstream apps anonymously; without logging in. |  |  |
| 45 | 44 | OK | Which brings us to The Unwanted Apps, Algorithmic censorship nullified |  |  |
| 46 | 45 | OK | The Offline P.C., Deep focus restored; fixed location, internet out of pants. |  |  |
| 47 | 46 | OK | The Privacy Academy, Hunted Victim to System Admin; education as antivirus. |  |  |
| 48 | 47 | OK · Z | Do you know Tactical Flight Mode, Feed cut, anxiety zero; loaded weapon locked in drawer. |  | Do you know Tactical Flight Mode? Feed cut, anxiety zero; loaded weapon locked in drawer. |
| 49 | 48 | OK | Escaping the Matrix, Reclaims human freedom; convenience has high price: Freedom. |  |  |
