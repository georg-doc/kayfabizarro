# WS0-Intake · Epistemic Sabotage: Let AI Read Your Comic [epistemic_sabotage]

Quelle: `editorial/kfb-triplets-eight-decks-r2-2026-10-15 @31639721`, Kartentext `data/kfb-card-title-case-2026-10-15` @eade4aec (`media/kfb/Epistemic_Sabotage_LET_AI_READ_YOUR_COMIC_v1_-_ADD_web.pdf.json`), Register @52adc8f1. PDF: `media/kfb/Epistemic_Sabotage_LET_AI_READ_YOUR_COMIC_v1 - ADD web.pdf` (identisch mit der lokalen v05-Kopie, Git-Blob verglichen).

## Technik
- Python-Prüfskript (exakt, `triplet_set_check.py`) auf geliefertem `takes.csv`: **60 PASS / 0 FAIL** (Ausgabe: `epistemic_sabotage.check.ws0.txt`).
- `suno.txt`: **4296 Zeichen** (< 5000). Nach allen Fixes unten: **4908 Zeichen**. Alle Fix-Zeilen mit demselben Prüfskript nachgeprüft: 0 FAIL (`epistemic_sabotage.fixcheck.ws0.txt`).
- `takes.csv`, `suno.txt` und `hub.json` stimmen Zeile für Zeile überein; Skips stehen in `hub.json` mit `inTrack: false`.

## Intro
- Geliefert: „Epistemic Sabotage: Let AI Read Your Comic. The Monocled Robo-Owl, The Giant Ear-Bat.“
- Urteil: **OK** – Registertitel + 2 gedruckte Kartentitel; nicht erfunden. Titel steht nicht im PDF; gedruckte Alternative: „Why draw swords when the machine can read your mind?“ (S. 1).

## Opener
- 20 Opener, Dubletten: 0, Familienabstand ≥ 10: ja (heard: Have you heard of (Z. 30), Did you hear of (Z. 51) – Abstand 21; know: You know (Z. 6), Do you know (Z. 48) – Abstand 42)
- Harte Passungsregeln („I once met“, „Ever tasted“, „You played“): nicht benutzt.
- „What if“ (Z. 9, #8) steht vor einer Nominalgruppe ohne Verb und ohne „?“ – passt nicht; Fix in der Tabelle.
- Zeichensetzung nach Opener fehlt in 10 Zeilen (Konvention der Goldens: Komma nach Anyway/No wait/Before we continue/Meanwhile elsewhere/You with the card in your hand; Doppelpunkt nach Not a metaphor/Everyone agrees/This one has a rule; „?“ nach Titel+Begriff bei Have you heard of/Did you hear of/Do you know). In der Tabelle mit „Z“ markiert und im Fix enthalten.
- Alle acht Decks nutzen exakt denselben Opener-Fahrplan (gleicher Opener auf gleicher Zeilennummer, jede 3. Zeile). Regelkonform, aber die Passung zur Karte ist dadurch Zufall.

## Zeilen
OK 19 · TUNE 41 · FAIL 0 · Z = nur Opener-Zeichensetzung

| Z. | # | Urteil | Geliefert | Befund | Fix (neuer Sprechtext) |
|---:|---:|---|---|---|---|
| 1 | Intro | OK | Epistemic Sabotage: Let AI Read Your Comic. The Monocled Robo-Owl, The Giant Ear-Bat. | Registertitel + 2 gedruckte Kartentitel; nicht erfunden. Titel steht nicht im PDF; gedruckte Alternative: „Why draw swords when the machine can read your mind?“ (S. 1). |  |
| 2 | 1 | TUNE | Uncle FrizzleBob's Meta-Cover, Initiates protocol, question reality | Nur Etikett, Pointe fehlt. | Uncle FrizzleBob's Meta-Cover, question reality; revolution won't be generated. |
| 3 | 2 | TUNE | Remember The Two-Headed Podium Monster, False Friend or Fee binary | Pointe fehlt. | Remember The Two-Headed Podium Monster, Friend or Fee; loudest arguments miss point. |
| 4 | 3 | OK | The Monocled Robo-Owl, AI receptive tool reads image instead of stealing style |  |  |
| 5 | 4 | TUNE | The Paint-Vomiting Toad, Strips value and authorship | Pointe fehlt. | The Paint-Vomiting Toad, copies your voice, forgets what you were trying to say. |
| 6 | 5 | TUNE | You know The Brick Wall Turtle, Visual storytelling inaccessible without sight | Pointe fehlt. | You know The Brick Wall Turtle, inaccessible; comics built fortresses, not doors. |
| 7 | 6 | OK | The Boombox Bat, Silent panels into multi-layered audio play; story escapes page. |  |  |
| 8 | 7 | OK | The Tactile Mole, Visual nuance into touchable geography; felt before understood. |  |  |
| 9 | 8 | TUNE | What if The Simple-Speak Sloth, Convoluted webs into Leichte Sprache | „What if“ braucht Satz und Fragezeichen. | What if The Simple-Speak Sloth distills webs into Leichte Sprache? Complexity, ego trip. |
| 10 | 9 | TUNE | The Polyglot Parrot, Mechanical translation at lightning speed | Pointe fehlt. | The Polyglot Parrot, translation at lightning speed; skeleton, cannot breathe life. |
| 11 | 10 | TUNE | The Rhythm Rhino, Cultural nuance and comedic timing | Pointe fehlt. | The Rhythm Rhino, soul of joke rarely survives literal border crossing. |
| 12 | 11 | TUNE | Anyway The Scar-Shifting Chameleon, Timeline glitches exposed | Pointe fehlt. | Anyway, The Scar-Shifting Chameleon, timeline glitches; magically healing wound. |
| 13 | 12 | TUNE | The Dyslexic Woodpecker, Quotation marks and lettering | Nur Etikett. | The Dyslexic Woodpecker, hunts forgotten quotation marks across 200 pages. |
| 14 | 13 | TUNE | The Retro-Tram Walrus, Historical accuracy for signpost and uniform | Pointe fehlt. | The Retro-Tram Walrus, accuracy for every signpost; past, unforgiving critic. |
| 15 | 14 | OK · Z | No wait The Caffeinated Bloodhound, Obscure historical research |  | No wait, The Caffeinated Bloodhound, Obscure historical research |
| 16 | 15 | TUNE | The Lying Fox-Bot, Historical falsehoods, confidently delivered | Pointe fehlt. | The Lying Fox-Bot, lies to save itself from saying I don't know. |
| 17 | 16 | OK | The Dust-Bunny Librarian, Hallucination validated against archives |  |  |
| 18 | 17 | TUNE | Before we continue The Begging Bear, Life's work in marketable sentences | Pointe fehlt. | Before we continue, The Begging Bear, masterpiece easier than asking strangers to pay. |
| 19 | 18 | TUNE | The Bureaucracy Beaver, Artistic vision into funding language | Pointe fehlt. | The Bureaucracy Beaver, German funding jungle worships format. |
| 20 | 19 | TUNE | The Boxing Kangaroo-Bot, Narrative intentions reflected | Pointe fehlt. | The Boxing Kangaroo-Bot, know your story once forced to defend it. |
| 21 | 20 | OK · Z | Not a metaphor The Staring Lemur, Architecture of masterpieces; machine look with you, not draw. |  | Not a metaphor: The Staring Lemur, Architecture of masterpieces; machine look with you, not draw. |
| 22 | 21 | OK | The Indexing Arachnid, Twenty years into searchable index; archive or trash can. |  |  |
| 23 | 22 | OK | The Umbrella Frog, Rain and night scenes located; unspectacular utility as grace. |  |  |
| 24 | 23 | OK | The thing about The Monolithic Data-Whale, Monopolizes tools, dictates survival |  |  |
| 25 | 24 | TUNE | The Seesaw Elephant, Creator agency reclaimed | Nur Etikett. | The Seesaw Elephant, refusing tools hands future to corporations. |
| 26 | 25 | TUNE | The Wide-Eyed Fawn, Reads comic exactly as it is | Kern fehlt (ohne Ausreden des Autors). | The Wide-Eyed Fawn, reads comic stripped of author's defensive explanations. |
| 27 | 26 | TUNE | Everyone agrees The Nerd-Herd Sheep, Target audience expectations simulated | Pointe fehlt. | Everyone agrees: The Nerd-Herd Sheep, you can't bluff genre fan. |
| 28 | 27 | TUNE | The Stumbling Goat, Panel transition breaks flow | Pointe fehlt. | The Stumbling Goat, eye confused, brain stops caring about heart. |
| 29 | 28 | TUNE | The Mood-Ring Octopus, Emotional resonance tracked | Pointe fehlt. | The Mood-Ring Octopus, perfect page worthless if emotional temperature flat. |
| 30 | 29 | OK · Z | Have you heard of The Spectacled Badger, Constructive feedback; what works before what's broken. |  | Have you heard of The Spectacled Badger, constructive feedback? What works before what's broken. |
| 31 | 30 | OK | The Ticking Tortoise, Narrative rhythm audited; time physical distance in ink. |  |  |
| 32 | 31 | OK | The Drafting-Table Beaver, Compositional flow; reader's eye bullied by layout. |  |  |
| 33 | 32 | TUNE | Let me tell you about The Interrogator Toad, Single structural question | Pointe fehlt. | Let me tell you about The Interrogator Toad, small questions won't save broken foundation. |
| 34 | 33 | TUNE | The Salt-Shaker Vulture, Strips away politeness | Pointe fehlt. | The Salt-Shaker Vulture, kindness to artist, cruelty to art. |
| 35 | 34 | OK | The Yawning Hippo, Predictable story part; greatest sin is being convenient. |  |  |
| 36 | 35 | OK · Z | This one has a rule The Sadistic Pelican, Deep idea merely pretending; hollow echo deafens reader. |  | This one has a rule: The Sadistic Pelican, Deep idea merely pretending; hollow echo deafens reader. |
| 37 | 36 | TUNE | The St. Bernard of Rescue, Structural annihilation followed by insight | Pointe fehlt. | The St. Bernard of Rescue, destruction without path to salvation is just vandalism. |
| 38 | 37 | TUNE | The Silver-Haired Time-Fox, Creator projected ten years | Pointe fehlt. | The Silver-Haired Time-Fox, time, only critic that cannot be argued with. |
| 39 | 38 | OK | Nobody warned us about The Puffed-Up Peacock, Technical triumphs endure; worst work monument to skill. |  |  |
| 40 | 39 | TUNE | The Facepalming Ostrich, Stylistic crutches and future regret | Pointe fehlt. | The Facepalming Ostrich, growth measured by severity of future embarrassment. |
| 41 | 40 | TUNE | The Sprouting Acorn-Pig, Unpolished seed of masterpiece | Pointe fehlt. | The Sprouting Acorn-Pig, next great era hiding as mistake in current draft. |
| 42 | 41 | TUNE | The deck insists on The Perspiring Penguin, Comic-Salon terror simulated | Pointe fehlt. | The deck insists on The Perspiring Penguin, brilliance evaporates if you cannot speak its name. |
| 43 | 42 | TUNE | The Ascending Giraffe, Graphic novel into Elevator Pitch | Pointe fehlt. | The Ascending Giraffe, more than one breath, they have stopped listening. |
| 44 | 43 | OK | The Fishing Cat, Hook differentiates work; good irrelevant, distinct survival. |  |  |
| 45 | 44 | TUNE | Which brings us to The Jabba-Toad Publisher, Publisher's brutal questions | Pointe fehlt. | Which brings us to The Jabba-Toad Publisher, publishing, transaction with swamp. |
| 46 | 45 | TUNE | The Sand-Burying Ostrich, Artistic navel-gazing | Pointe fehlt. | The Sand-Burying Ostrich, pencil strokes while world burns. |
| 47 | 46 | TUNE | The Missile-Riding Pigeon, AI military reality acknowledged | Nur Etikett. | The Missile-Riding Pigeon, algorithm that helps you draw, cousin of strike algorithm. |
| 48 | 47 | TUNE | Do you know The Lantern Anglerfish, Tech billionaires' endgame | Frage-Opener ohne „?“; Pointe fehlt. | Do you know The Lantern Anglerfish, billionaires' endgame? Marketing, not liberation. |
| 49 | 48 | TUNE | The Gavel Vulture, Training data legal corpses | Pointe fehlt. | The Gavel Vulture, law at speed of bureaucracy, machine at speed of theft. |
| 50 | 49 | OK | The Giant Ear-Bat, AI receptive, analytical entity; machine listens or replaces. |  |  |
| 51 | 50 | TUNE | Did you hear of The Steering-Wheel Raccoon, Tech giants cannot dictate utilization | Frage-Opener ohne „?“; Pointe fehlt. | Did you hear of The Steering-Wheel Raccoon, means of utilization? Hotwire master's car. |
| 52 | 51 | TUNE | The Probe-Stage Chameleon, Rehearsal before real human | Pointe fehlt. | The Probe-Stage Chameleon, crash-test dummy for your ego. |
| 53 | 52 | TUNE | The Multi-Armed Sloth, Automate grunt work | Pointe fehlt. | The Multi-Armed Sloth, automates grunt work; resurrects artist. |
| 54 | 53 | TUNE | Welcome to The Panting Cheetah, Panel timing and heart rate | Pointe fehlt. | Welcome to The Panting Cheetah, action easy to draw; exhaustion requires genius. |
| 55 | 54 | OK | The Gap-Toothed Gator, White space between boxes; magic in blood between boxes. |  |  |
| 56 | 55 | TUNE | The Elephant's Post-it, Specific image stays in reader's head | Pointe fehlt. | The Elephant's Post-it, 200 pages so they remember one panel forever. |
| 57 | 56 | TUNE | Meanwhile elsewhere The Machete-Wielding Monkey, German funding labyrinth slashed | Pointe fehlt. | Meanwhile elsewhere, The Machete-Wielding Monkey, German funding labyrinth; administrative violence. |
| 58 | 57 | OK | The Glowing Firefly, Human spark, authorial intent; machine cannot decide home. |  |  |
| 59 | 58 | TUNE | The Sentient Eraser, Editorial judgment over stays or destroyed; wisdom to erase. | Satz zerfällt („over stays or destroyed“). | The Sentient Eraser, judgment over what stays and what is destroyed; wisdom to erase. |
| 60 | 59 | TUNE | I used to believe The Screaming Possum, Cures paralysis of blank page | Pointe fehlt. | I used to believe The Screaming Possum, easier to edit garbage than birth perfection. |
| 61 | 60 | TUNE | Uncle FrizzleBob's Megaphone, Creators build own reading machines | Pointe fehlt. | Uncle FrizzleBob's Megaphone, pick up pencils, hotwire algorithm. |
