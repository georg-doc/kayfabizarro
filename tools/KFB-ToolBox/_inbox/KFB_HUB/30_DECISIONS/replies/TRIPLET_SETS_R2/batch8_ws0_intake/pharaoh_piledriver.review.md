# WS0-Intake · Pharaoh Piledriver [pharaoh_piledriver]

Quelle: `editorial/kfb-triplets-eight-decks-r2-2026-10-15 @31639721`, Kartentext `data/kfb-card-title-case-2026-10-15` @eade4aec (`media/kfb/Pharaoh_Piledriver_-_ADD_web_ID.pdf.json`), Register @52adc8f1. PDF: `media/kfb/Pharaoh_Piledriver - ADD web ID.pdf` (identisch mit der lokalen v05-Kopie, Git-Blob verglichen).

## Technik
- Python-Prüfskript (exakt, `triplet_set_check.py`) auf geliefertem `takes.csv`: **51 PASS / 0 FAIL** (Ausgabe: `pharaoh_piledriver.check.ws0.txt`).
- `suno.txt`: **4167 Zeichen** (< 5000). Nach allen Fixes unten: **4444 Zeichen**. Alle Fix-Zeilen mit demselben Prüfskript nachgeprüft: 0 FAIL (`pharaoh_piledriver.fixcheck.ws0.txt`).
- `takes.csv`, `suno.txt` und `hub.json` stimmen Zeile für Zeile überein; Skips stehen in `hub.json` mit `inTrack: false`.

## Intro
- Geliefert: „Pharaoh Piledriver: Atum, Nun, Ra, Osiris, Set and Horus.“
- Urteil: **TUNE** – Nicht erfunden, aber 6 Kartentitel statt 2–3; gedrucktes Cover-Motto ungenutzt. „Pharaoh Piledriver“ steht nicht auf dem Cover (Registertitel).
- Vorschlag (nur gedrucktes Material): „Wrestle like an Egyptian Mummy Master! Pharaoh Piledriver: Atum, Ra and Set.“

## Opener
- 17 Opener, Dubletten: 0, Familienabstand ≥ 10: ja (know: You know (Z. 6), Do you know (Z. 48) – Abstand 42)
- Harte Passungsregeln („I once met“, „Ever tasted“, „You played“): nicht benutzt.
- „What if“ (Z. 9, #8) steht vor einer Nominalgruppe ohne Verb und ohne „?“ – passt nicht; Fix in der Tabelle.
- Zeichensetzung nach Opener fehlt in 8 Zeilen (Konvention der Goldens: Komma nach Anyway/No wait/Before we continue/Meanwhile elsewhere/You with the card in your hand; Doppelpunkt nach Not a metaphor/Everyone agrees/This one has a rule; „?“ nach Titel+Begriff bei Have you heard of/Did you hear of/Do you know). In der Tabelle mit „Z“ markiert und im Fix enthalten.
- Alle acht Decks nutzen exakt denselben Opener-Fahrplan (gleicher Opener auf gleicher Zeilennummer, jede 3. Zeile). Regelkonform, aber die Passung zur Karte ist dadurch Zufall.

## Ausgelassene Karten
- #46 The Field of Reeds (VIP Lounge): **DATENLÜCKE** – Druck S. 13 oben rechts zeigt „EFFECT: Heal all damage at end of turn.“ – im JSON @eade4aec fehlt die Power (power=null, kein textSource). Skip durch das Plugin korrekt (nichts erfunden), aber die Karte ist spielbar. Erst WS0-Datenfix (power aus dem Druck übernehmen), dann eine Zeile. Keine Zeile vorgeschlagen, solange das JSON nicht korrigiert ist.

## Zeilen
OK 37 · TUNE 14 · FAIL 0 · Z = nur Opener-Zeichensetzung

| Z. | # | Urteil | Geliefert | Befund | Fix (neuer Sprechtext) |
|---:|---:|---|---|---|---|
| 1 | Intro | TUNE | Pharaoh Piledriver: Atum, Nun, Ra, Osiris, Set and Horus. | Nicht erfunden, aber 6 Kartentitel statt 2–3; gedrucktes Cover-Motto ungenutzt. „Pharaoh Piledriver“ steht nicht auf dem Cover (Registertitel). | Wrestle like an Egyptian Mummy Master! Pharaoh Piledriver: Atum, Ra and Set. |
| 2 | 1 | OK | Atum, Autogenesis: new rule from thin air; ultimate freelancer, no union dues. |  |  |
| 3 | 2 | OK | Remember Nun, Reset Board: return to void; infinite dark water, unscripted pre-show. |  |  |
| 4 | 3 | OK | Shu, Wall of Wind: blocks flying attacks, separates tag teams; holding kids apart. |  |  |
| 5 | 4 | OK | Tefnut, Corrosive Spit: Equipment destroyed; born from a god's loogie. |  |  |
| 6 | 5 | OK | You know Geb, Earthquake Laughter: shake table; laugh destroys cities, goose on head. |  |  |
| 7 | 6 | OK | Nut, Star Fall: tokens drop; eats sun every night, heartburn central. |  |  |
| 8 | 7 | TUNE | Ra, Executive Order: change turn order; sky yacht, humanity stopped clapping. | Pointe fehlt: Ra schickt den Löwen, der die Menschheit frisst. | Ra, Executive Order: change turn order; sent lion to eat humanity, they stopped clapping. |
| 9 | 8 | TUNE | What if Khepri, Resurrection Roll: retrieve card; sun like ball of poop, it's a living. | „What if“ braucht einen Satz mit Verb und Fragezeichen. | What if Khepri, Resurrection Roll, retrieves card? Moves sun like ball of poop. It's a living. |
| 10 | 9 | TUNE | Osiris, Undying Popularity: cannot be eliminated | Lore fehlt ganz, Zeile abgeschnitten (authoring-notes hatten sie noch). | Osiris, Undying Popularity: cannot be eliminated; boxed, drowned, chopped up, still biggest pop. |
| 11 | 10 | TUNE | Isis, Gather the Pieces: reassemble card; sun god password, loyal to a fault. | „sun god password“ ohne „conned“ ist sinnlos. | Isis, Gather the Pieces: reassemble destroyed card; conned sun god for his password. |
| 12 | 11 | OK · Z | Anyway Set, Sandstorm Sabotage: blind opponent; killed brother over chair shot. |  | Anyway, Set, Sandstorm Sabotage: blind opponent; killed brother over chair shot. |
| 13 | 12 | TUNE | Horus, Vengeance Strike: Heel cards double damage; secret ingredient salad. | Mechanik verdreht: klingt, als machten Heel-Karten doppelten Schaden. | Horus, Vengeance Strike: double damage against Heel cards; fed uncle salad, secret ingredient. |
| 14 | 13 | TUNE | Anubis, Weighing Scale: heavy heart, no club; card value guessed. | Mechanik unklar („card value guessed“), Folge fehlt. | Anubis, Weighing Scale: guess card value, if correct, eliminate it; heavy heart, no club. |
| 15 | 14 | OK · Z | No wait Ma'at, Balance Check: equal stats; feather ruins afterlife, no cheating. |  | No wait, Ma'at, Balance Check: equal stats; feather ruins afterlife, no cheating. |
| 16 | 15 | OK | Ammit, Soul Crunch: permanently remove card; hearts of sinners, zero calorie diet. |  |  |
| 17 | 16 | OK | Thoth, Wiki-Edit: change Lore; Inventor of writing, knows cheat codes. |  |  |
| 18 | 17 | OK · Z | Before we continue Sekhmet, Rage Virus: attack every card including own; stopped by red beer. |  | Before we continue, Sekhmet, Rage Virus: attack every card including own; stopped by red beer. |
| 19 | 18 | OK | Bastet, Claws & Cuddles: heal or scratch; don't touch belly. |  |  |
| 20 | 19 | OK | Montu, Trample: ignore defense; Pharaoh's desire to hit things very hard. |  |  |
| 21 | 20 | OK · Z | Not a metaphor Shezmu, The Squeeze: defeated cards into Perfume; skulls like grapes. |  | Not a metaphor: Shezmu, The Squeeze: defeated cards into Perfume; skulls like grapes. |
| 22 | 21 | TUNE | Sobek, Ambush Drag: opponent into River; robbery and tourists. | „robbery and tourists“ verliert den Witz (frisst Touristen). | Sobek, Ambush Drag: pull opponent's card into River; loves robbery, eats tourists. |
| 23 | 22 | OK | Tawaret, Mama Bear Smash: threatened Child, stats triple; hippos kill more people. |  |  |
| 24 | 23 | OK | The thing about Khnum, Clay Clone: duplicate any card; babies out of river mud, original 3D printer. |  |  |
| 25 | 24 | OK | Hapi, High Water: flood board; silt, life, wet socks. |  |  |
| 26 | 25 | OK | Bes, Distraction Dance: cannot attack for laughing; ugly and loud, true hero. |  |  |
| 27 | 26 | OK · Z | Everyone agrees Medjed, Laser Eyes: shoot beams from eyes; unseen Smiter. |  | Everyone agrees: Medjed, Laser Eyes: shoot beams from eyes; unseen Smiter. |
| 28 | 27 | TUNE | Babi, Aggression: attack immediately; baboons, entrails, underworld ferry. | Aufzählung ohne Pointe, „underworld ferry“ allein sinnlos. | Babi, Aggression: attack immediately, ask questions never; eats entrails. Gross. |
| 29 | 28 | OK | Serket, Venom Heal: poison enemies or cure allies; misunderstood scorpions. |  |  |
| 30 | 29 | OK · Z | Have you heard of The Solar Barque, Night Travel: skip opponent's turn; millions of years, zero maintenance. |  | Have you heard of The Solar Barque, Night Travel? Skip opponent's turn; millions of years, zero maintenance. |
| 31 | 30 | OK | The Scales of Justice, Judgment: lower stat eliminated; hippo eats you if tilted. |  |  |
| 32 | 31 | OK | The Crook & Flail, Command: control opponent's card; shepherd people, beat grain. |  |  |
| 33 | 32 | TUNE | Let me tell you about The Eye of Ra, Solar Flare: Chaos cards damage; ancient remote-controlled drone strike. | „Chaos cards damage“: unklar, wer Schaden macht. | Let me tell you about The Eye of Ra, Solar Flare: damage all Chaos cards; ancient remote-controlled drone strike. |
| 34 | 33 | TUNE | Seshat, Blueprint: top cards; lifespan on stick, invented math. | „top cards“ ohne Verb, kein Bild. | Seshat, Blueprint: look at top cards; notches lifespan on stick, invented math. |
| 35 | 34 | OK | Ptah, Spoken Reality: name card, opponent discards; thought world into existence. |  |  |
| 36 | 35 | OK · Z | This one has a rule Imhotep, Polymath: use Manager power; mortal built pyramid, promoted to God. |  | This one has a rule: Imhotep, Polymath: use Manager power; mortal built pyramid, promoted to God. |
| 37 | 36 | OK | Neith, Fate Weave: rearrange hand; wove universe, do not ask her to knit. |  |  |
| 38 | 37 | TUNE | Apep, System Crash: nobody wins unless Ra; pray AGAINST him. | Versalien „AGAINST“; „End the game“ fehlt. | Apep, System Crash: end game, nobody wins unless Ra in play; pray against him. |
| 39 | 38 | OK | Nobody warned us about The Akhekh, Desert Terror: Fear status; visual non-sequitur scares tourists. |  |  |
| 40 | 39 | OK | Seven Scorpions, Swarm: 7 small attacks; bodyguards, they stung rich lady's son. |  |  |
| 41 | 40 | TUNE | The Red Cloud, Blindness: accuracy zero; angry breath of Set, red desert. | „red desert“ verändert die Aussage der Karte. | The Red Cloud, Blindness: accuracy zero; angry breath of Set, red is color of bad things. |
| 42 | 41 | OK | The deck insists on Nekhbet, White Crown: defense with Wadjet; vultures good mothers. |  |  |
| 43 | 42 | OK | Wadjet, Red Crown: attack with Nekhbet; fire-spitting snake, forehead protection. |  |  |
| 44 | 43 | TUNE | Shai, The Script: outcome before rolling; can't fight booking committee. | Verb fehlt („decide“). | Shai, The Script: decide dice outcome before rolling; can't fight booking committee. |
| 45 | 44 | OK | Which brings us to Renenutet, Harvest Gold: resources each turn; snakes and milk. |  |  |
| 46 | 45 | OK | The Duat, Graveyard cards attack; Underworld snakes, 12 gates to leave. |  |  |
| 47 | 47 | OK | Heliopolis, Solar gods get Stats; Ennead board meetings. |  |  |
| 48 | 48 | OK · Z | Do you know The Primeval Mound, High Ground: first solid ground; everything starts here. |  | Do you know The Primeval Mound, High Ground? First solid ground; everything starts here. |
| 49 | 49 | TUNE | The Lettuce Incident, Public Humiliation: opponent loses all Cool points | Lore-Pointe fehlt ganz. | The Lettuce Incident, Public Humiliation: opponent loses Cool points; Set ate salad with Horus's dressing. Awkward. |
| 50 | 50 | OK | The Red Beer Trick, Forced Sleep: strongest attacker removed; thought blood, dyed beer. |  |  |
| 51 | 51 | OK | Welcome to The Missing Piece, Prosthetic Power: replace lost limb with gold; fish ate the 14th. |  |  |
| 52 | 52 | OK | The Extra 5 Days, Overtime: extra turn; Thoth won 5 extra days gambling. |  |  |
