# WS0-Intake · Nibelungen Booster Pack [nibelungen_booster_pack_design]

Quelle: `editorial/kfb-triplets-eight-decks-r2-2026-10-15 @31639721`, Kartentext `data/kfb-card-title-case-2026-10-15` @eade4aec (`media/kfb/Nibelungen_Booster_Pack_Design_-_ADD_web_ID.pdf.json`), Register @52adc8f1. PDF: `media/kfb/Nibelungen_Booster_Pack_Design - ADD web ID.pdf` (identisch mit der lokalen v05-Kopie, Git-Blob verglichen).

## Technik
- Python-Prüfskript (exakt, `triplet_set_check.py`) auf geliefertem `takes.csv`: **60 PASS / 0 FAIL** (Ausgabe: `nibelungen_booster_pack_design.check.ws0.txt`).
- `suno.txt`: **4590 Zeichen** (< 5000). Nach allen Fixes unten: **4914 Zeichen**. Alle Fix-Zeilen mit demselben Prüfskript nachgeprüft: 0 FAIL (`nibelungen_booster_pack_design.fixcheck.ws0.txt`).
- `takes.csv`, `suno.txt` und `hub.json` stimmen Zeile für Zeile überein; Skips stehen in `hub.json` mit `inTrack: false`.

## Intro
- Geliefert: „Nibelungen Booster Pack: Siegfried, Brunhild, Hagen, The Ring, The Curse.“
- Urteil: **TUNE** – Nicht erfunden, aber 5 Kartentitel statt 2–3. Deck hat kein Cover; Titel nur im Register. Gedruckte Randnotiz „No refunds!“ (S. 1) verfügbar.
- Vorschlag (nur gedrucktes Material): „Nibelungen Booster Pack: Siegfried, Brunhild and Hagen. No refunds!“

## Opener
- 20 Opener, Dubletten: 0, Familienabstand ≥ 10: ja (heard: Have you heard of (Z. 30), Did you hear of (Z. 51) – Abstand 21; know: You know (Z. 6), Do you know (Z. 48) – Abstand 42)
- Harte Passungsregeln („I once met“, „Ever tasted“, „You played“): nicht benutzt.
- „What if“ (Z. 9, #8) steht vor einer Nominalgruppe ohne Verb und ohne „?“ – passt nicht; Fix in der Tabelle.
- Zeichensetzung nach Opener fehlt in 10 Zeilen (Konvention der Goldens: Komma nach Anyway/No wait/Before we continue/Meanwhile elsewhere/You with the card in your hand; Doppelpunkt nach Not a metaphor/Everyone agrees/This one has a rule; „?“ nach Titel+Begriff bei Have you heard of/Did you hear of/Do you know). In der Tabelle mit „Z“ markiert und im Fix enthalten.
- Alle acht Decks nutzen exakt denselben Opener-Fahrplan (gleicher Opener auf gleicher Zeilennummer, jede 3. Zeile). Regelkonform, aber die Passung zur Karte ist dadurch Zufall.

## Zeilen
OK 43 · TUNE 17 · FAIL 0 · Z = nur Opener-Zeichensetzung

| Z. | # | Urteil | Geliefert | Befund | Fix (neuer Sprechtext) |
|---:|---:|---|---|---|---|
| 1 | Intro | TUNE | Nibelungen Booster Pack: Siegfried, Brunhild, Hagen, The Ring, The Curse. | Nicht erfunden, aber 5 Kartentitel statt 2–3. Deck hat kein Cover; Titel nur im Register. Gedruckte Randnotiz „No refunds!“ (S. 1) verfügbar. | Nibelungen Booster Pack: Siegfried, Brunhild and Hagen. No refunds! |
| 2 | 1 | OK | Andvari, Asset Freeze: auditing hoard; Loki squeezed him like stress ball. |  |  |
| 3 | 2 | OK | Remember Loki, Forced Liquidation: steal Item; pike, otter, dwarf, standard consultant. |  |  |
| 4 | 3 | OK | The Ring, Compound Interest: gold breeds, eats owners; debt always wins. |  |  |
| 5 | 4 | OK | The Curse, Bad Ending: Hero dies; death to owner, everyone renting life. |  |  |
| 6 | 5 | TUNE | You know Siegfried, Main Character Syndrome: dragon killed; leaves on back | Pointe verkürzt bis unklar („leaves on back“). | You know Siegfried, Main Character Syndrome: kill dragon, not check back for leaves. |
| 7 | 6 | OK | Dragon Blood, Thick Skin: ignore damage; sulfur and ego, legally invincible. |  |  |
| 8 | 7 | OK | The Linden Leaf, Critical Fail: Siegfried Defense drops to 0 |  |  |
| 9 | 8 | TUNE | What if Balmung, Overkill: destroy weapon too; cleave anvil in half. | „What if“ braucht Satz und Fragezeichen. | What if Balmung, Overkill, destroys opponent's weapon too? Cleave anvil in half. |
| 10 | 9 | TUNE | Gunther, Delegate Authority: another player fights | Pointe fehlt. | Gunther, Delegate Authority: brave, as long as someone else is fighting. |
| 11 | 10 | OK | Tarnkappe, Assist Mode: invisible cheating; wrestling women stronger than you. |  |  |
| 12 | 11 | OK · Z | Anyway The Proxy Wooing, Identity Theft: swap hands, claim misunderstanding |  | Anyway, The Proxy Wooing, Identity Theft: swap hands, claim misunderstanding |
| 13 | 12 | TUNE | The Boat to Iceland, Travel Montage: skip turn, draw cards | Flach. | The Boat to Iceland, Travel Montage: woman who can kill you with pebble. Men are idiots. |
| 14 | 13 | OK | Brunhild, Gatekeeper: challenge incoming player; Queen throws boulders for fun. |  |  |
| 15 | 14 | TUNE | No wait The Boulder Throw, Heavy Artillery: Gunther, 10 damage | Bruchstück („Gunther, 10 damage“). | No wait, The Boulder Throw, Heavy Artillery: can't lift this, don't ask for her number. |
| 16 | 15 | TUNE | The Spear Toss, Shield Breaker: ignore Defense | Flach. | The Spear Toss, Shield Breaker: shield, armor, ego; Gunther fainted. |
| 17 | 16 | OK | The Wall-Hook, Time Out: Hero cannot act; King hung on wall until morning. |  |  |
| 18 | 17 | TUNE | Before we continue The Wrestling Match, Tag Team: double Attack, lose Health | Pointe fehlt (Kayfabe). | Before we continue, The Wrestling Match, Tag Team: lights out, King very strong. Kayfabe. |
| 19 | 18 | TUNE | The Girdle, Disempower: special abilities gone | Flach. | The Girdle, Disempower: Siegfried's souvenir; terrible brother-in-law. |
| 20 | 19 | OK | The Ring of Tears, Evidence: ring starts war; Rookie mistake, tactical suicide. |  |  |
| 21 | 20 | OK · Z | Not a metaphor The Submission, Depower: Brunhild lost her strength |  | Not a metaphor: The Submission, Depower: Brunhild lost her strength |
| 22 | 21 | OK | Hagen, Pragmatism: cancel Magic or Lore; buries bodies, does his job. |  |  |
| 23 | 22 | TUNE | The Cross on the Robe, Marked for Death: robe cross used as bullseye, protect | Satz zerfällt („bullseye, protect“). | The Cross on the Robe, Marked for Death: sewed on to protect, used as bullseye. |
| 24 | 23 | OK | The thing about The False War Alarm, Distraction: fake invasion, hero out of house |  |  |
| 25 | 24 | OK | The Spring, Ambush Location: Forest; drink at spring, don't worry about back. |  |  |
| 26 | 25 | TUNE | The Spear in the Back, Assassination: destroy Hero with Cross on Robe | Pointe fehlt. | The Spear in the Back, Assassination: honor is for dead people. |
| 27 | 26 | OK · Z | Everyone agrees The Corpse at the Door, Trauma: discard hand due grief; corpse dumped at door. |  | Everyone agrees: The Corpse at the Door, Trauma: discard hand due grief; corpse dumped at door. |
| 28 | 27 | OK | The Grief, Vengeance Oath: Grudge tokens; poodle scorned, demon born. |  |  |
| 29 | 28 | OK | The Cover-Up, Denial: negate Truth; robbers in woods, talk inheritance. |  |  |
| 30 | 29 | OK · Z | Have you heard of The Treasure Pile, Bribery: pay gold cancel attack; wealth buys friends. |  | Have you heard of The Treasure Pile, Bribery? Pay gold, cancel attack; wealth buys friends. |
| 31 | 30 | OK | The Rhine River, The Vault: Treasure removed; Hagen sank all, nobody gets them. |  |  |
| 32 | 31 | OK | The Empty Hole, Economic Crash: Where is gold? Ask fish; liquidity crisis. |  |  |
| 33 | 32 | OK | Let me tell you about Oath of Silence, Omerta: hand hidden; gold remains hidden, spite powerful glue. |  |  |
| 34 | 33 | OK | Etzel, Horde Command: Hun tokens; King weapon in wife's purse. |  |  |
| 35 | 34 | OK | The Invitation, Trap Location: solstice invitation, stay for massacre. |  |  |
| 36 | 35 | OK · Z | This one has a rule The Journey East, Point of No Return: no retreat; Danube crossed, boat smashed. |  | This one has a rule: The Journey East, Point of No Return: no retreat; Danube crossed, boat smashed. |
| 37 | 36 | OK | The Prophecy, Spoiler Alert: worst card; chaplain returns, everyone else meat. |  |  |
| 38 | 37 | OK | The Banquet Table, Tension: no attacks, next double damage; helmet at table. |  |  |
| 39 | 38 | OK | Nobody warned us about Volker, Violent Music: attacks Art, ignore armor; dance then head off. |  |  |
| 40 | 39 | OK | The Severed Head, First Blood: combat immediately; kid's head in queen's lap. |  |  |
| 41 | 40 | OK | The Barred Doors, Lockdown: no one leaves, suffering begins. |  |  |
| 42 | 41 | TUNE | The deck insists on The Burning Roof, Environment Damage: hall on fire | Pointe fehlt. | The deck insists on The Burning Roof, Environment Damage: really committed to this revenge thing. |
| 43 | 42 | OK | The Thirst, Desperate Measure: heal by drinking blood; better than wine. |  |  |
| 44 | 43 | OK | The Shield-Wall, Bunker: invulnerable to fire; tactical positioning in oven. |  |  |
| 45 | 44 | OK | Which brings us to Staircase of Bodies, High Ground: standing on mistakes; bodies down stairs. |  |  |
| 46 | 45 | OK | Dietrich von Bern, The Reluctant Hero: attacked, destroys attacker; Lion awake. |  |  |
| 47 | 46 | OK | Hildebrand, Veteran Instinct: reroll failed die; too old, too loyal. |  |  |
| 48 | 47 | OK · Z | Do you know Rüdiger, Moral Conflict: fight and die or refuse and die; promise a favor. |  | Do you know Rüdiger, Moral Conflict? Fight and die or refuse and die; promise a favor. |
| 49 | 48 | OK | The Dungeon, Capture: execution phase; fighting over, suffering begins. |  |  |
| 50 | 49 | OK | Gunther's Head, Proof: force Hagen to speak; he won't, brother's head cut off. |  |  |
| 51 | 50 | TUNE | Did you hear of Balmung Reclaimed, Execution: defenseless prisoner, no Honor | Frage-Opener ohne „?“; Pointe fehlt. | Did you hear of Balmung Reclaimed, Execution? Defenseless prisoner; poetic justice, written in blood. |
| 52 | 51 | TUNE | Hagen's Laugh, Last Word: opponent gets 0 points | Pointe fehlt. | Hagen's Laugh, Last Word: taking gold to hell. You lose. |
| 53 | 52 | OK | The Mastercut, Sudden Death: eliminate winner; Chivalry is weird. |  |  |
| 54 | 53 | TUNE | Welcome to The Survivors, Mourning: skip turns | Flach. | Welcome to The Survivors, Mourning: lot of crying for heavy metal album cover. |
| 55 | 54 | OK | The Moral, Nullify: no one wins; don't steal gold, don't trust badgers. |  |  |
| 56 | 55 | OK | The Reset Button, New Game: shuffle and start over; never ends, reboots. |  |  |
| 57 | 56 | TUNE | Meanwhile elsewhere Uncle FrizzleBob, Rule Breaker: change rule permanently | Pointe fehlt. | Meanwhile elsewhere, Uncle FrizzleBob, Rule Breaker: play with corpses; you bought expansion. |
| 58 | 57 | TUNE | Toxic Masculinity, Ego Boost: cannot retreat or heal | Pointe fehlt. | Toxic Masculinity, Ego Boost: cannot retreat or heal; if anyone had gone to therapy, thousands alive. |
| 59 | 58 | OK | Plot Armor, Narrative Necessity: cannot die until act 5; script said no. |  |  |
| 60 | 59 | TUNE | I used to believe Germanic Depression, Weltschmerz: all players lose morale token | Pointe fehlt. | I used to believe Germanic Depression, Weltschmerz: enduring inevitable doom with stoic face. |
| 61 | 60 | OK | The McGuffin, Wildcard: any value; gold, ring, belt, people kill each other. |  |  |
