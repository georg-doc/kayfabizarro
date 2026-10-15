# WS0-Intake · Cosmic Grift – Dark Journalism [cosmic_grift_dark_journalism]

Quelle: `editorial/kfb-triplets-eight-decks-r2-2026-10-15 @31639721`, Kartentext `data/kfb-card-title-case-2026-10-15` @eade4aec (`media/kfb/Cosmic_Grift_-_Dark_Journalism_-_ADD_web_ID.pdf.json`), Register @52adc8f1. PDF: `media/kfb/Cosmic_Grift_-_Dark_Journalism - ADD web ID.pdf` (identisch mit der lokalen v05-Kopie, Git-Blob verglichen).

## Technik
- Python-Prüfskript (exakt, `triplet_set_check.py`) auf geliefertem `takes.csv`: **60 PASS / 0 FAIL** (Ausgabe: `cosmic_grift_dark_journalism.check.ws0.txt`).
- `suno.txt`: **4403 Zeichen** (< 5000). Nach allen Fixes unten: **4895 Zeichen**. Alle Fix-Zeilen mit demselben Prüfskript nachgeprüft: 0 FAIL (`cosmic_grift_dark_journalism.fixcheck.ws0.txt`).
- `takes.csv`, `suno.txt` und `hub.json` stimmen Zeile für Zeile überein; Skips stehen in `hub.json` mit `inTrack: false`.

## Intro
- Geliefert: „Cosmic Grift – Dark Journalism. The UFO File. The Belial Group. Majestic 12.“
- Urteil: **OK** – Nicht erfunden: Registertitel + 3 gedruckte Kartentitel. Deck hat kein Cover; „Dark Journalism“ steht nirgends im PDF (alle 15 Seitenköpfe geprüft), nur der Registertitel trägt es.

## Opener
- 20 Opener, Dubletten: 0, Familienabstand ≥ 10: ja (heard: Have you heard of (Z. 30), Did you hear of (Z. 54) – Abstand 24; know: You know (Z. 6), Do you know (Z. 48) – Abstand 42)
- Harte Passungsregeln („I once met“, „Ever tasted“, „You played“): nicht benutzt.
- „What if“ (Z. 9, #8) steht vor einer Nominalgruppe ohne Verb und ohne „?“ – passt nicht; Fix in der Tabelle.
- Zeichensetzung nach Opener fehlt in 11 Zeilen (Konvention der Goldens: Komma nach Anyway/No wait/Before we continue/Meanwhile elsewhere/You with the card in your hand; Doppelpunkt nach Not a metaphor/Everyone agrees/This one has a rule; „?“ nach Titel+Begriff bei Have you heard of/Did you hear of/Do you know). In der Tabelle mit „Z“ markiert und im Fix enthalten.
- Alle acht Decks nutzen exakt denselben Opener-Fahrplan (gleicher Opener auf gleicher Zeilennummer, jede 3. Zeile). Regelkonform, aber die Passung zur Karte ist dadurch Zufall.

## Zeilen
OK 0 · TUNE 60 (davon 29 nur Versalien) · FAIL 0 · Z = nur Opener-Zeichensetzung

| Z. | # | Urteil | Geliefert | Befund | Fix (neuer Sprechtext) |
|---:|---:|---|---|---|---|
| 1 | Intro | OK | Cosmic Grift – Dark Journalism. The UFO File. The Belial Group. Majestic 12. | Nicht erfunden: Registertitel + 3 gedruckte Kartentitel. Deck hat kein Cover; „Dark Journalism“ steht nirgends im PDF (alle 15 Seitenköpfe geprüft), nur der Registertitel trägt es. |  |
| 2 | 1 | TUNE | Welcome to the Cosmic Grift! PASSIVE: narratives into comedic fodder | Lore-Pointe fehlt; Versalien. | Welcome to the Cosmic Grift! Passive: aliens are feds, tax dollars bought moon base. |
| 3 | 2 | TUNE | Remember The UFO File, INITIATIVE: File commands military-industrial complex | Pointe fehlt (proprietary tech); Versalien. | Remember The UFO File, Initiative: not little green men; proprietary tech. |
| 4 | 3 | TUNE | COG: The Shadow Rules, SURVIVAL: ignore rules and keep wealth tokens | Nur Versalien. | COG: The Shadow Rules, Survival: ignore rules and keep wealth tokens |
| 5 | 4 | TUNE | Professor Scott's Deep State, EXTRACTION: siphon Truth Tokens without noticing | Nur Versalien. | Professor Scott's Deep State, Extraction: siphon Truth Tokens without noticing |
| 6 | 5 | TUNE | You know The Amelius Group, HARMONY: weapon into flower | Nur Versalien. | You know The Amelius Group, Harmony: weapon into flower |
| 7 | 6 | TUNE | The Belial Group, DESTRUCTION: sacrifice civilization | Flach; Versalien. | The Belial Group, Destruction: occult evil meets defense spending. |
| 8 | 7 | TUNE | The TUAOI Firestone, OVERCHARGE: infinite energy, cataclysmic flood | Nur Versalien. | The TUAOI Firestone, Overcharge: infinite energy, cataclysmic flood |
| 9 | 8 | TUNE | What if Atlantean Automatons, LABOR: free work drains Empathy | „What if“ braucht Satz mit Verb und Fragezeichen; Versalien. | What if Atlantean Automatons, Labor, generate free work but drain Empathy? |
| 10 | 9 | TUNE | High Priest Rata, FORESIGHT: opponent's hand | Verb fehlt, Pointe fehlt; Versalien. | High Priest Rata, Foresight: you lived this life 12,000 years ago. |
| 11 | 10 | TUNE | Hermes the Architect, CONSTRUCTION: indestructible structure | Flach; Pointe (Giza-Backup) fehlt; Versalien. | Hermes the Architect, Construction: laid out Giza to stash Atlantean backups. |
| 12 | 11 | TUNE | Anyway Hall of Records, HOARD: knowledge cannot be destroyed | Pointe fehlt; Versalien. | Anyway, Hall of Records, Hoard: good luck getting permits to dig. |
| 13 | 12 | TUNE | Vitle, BANISH: Dark Magic; Mayan Christ-figure stops black magicians. | Nur Versalien. | Vitle, Banish: Dark Magic; Mayan Christ-figure stops black magicians. |
| 14 | 13 | TUNE | Madame Blavatsky, ATAVISTIC MEDIUMSHIP: astral discard pile | Nur Etikett, kein Bild; Versalien. | Madame Blavatsky, Atavistic Mediumship: mystery schools needed leak; she was firehose. |
| 15 | 14 | TUNE | No wait Hermetic Order of the Golden Dawn, RITUAL: summon entity | Pointe fehlt (Streit um den größten Hut); Versalien. | No wait, Hermetic Order of the Golden Dawn, Ritual: group breaks up over biggest hat. |
| 16 | 15 | TUNE | Vril Energy, SUBTERRANEAN BOOST: underground units | Nur Etikett; Versalien. | Vril Energy, Subterranean Boost: sci-fi mystery schools took way too seriously. |
| 17 | 16 | TUNE | The Eighth Sphere, TRAP: defeated units lost to virtual reality | Nur Versalien. | The Eighth Sphere, Trap: defeated units lost to virtual reality |
| 18 | 17 | TUNE | Before we continue The Sleeping Prophet, LIFE READING: predict opponent's next moves | Pointe fehlt; Versalien. | Before we continue, The Sleeping Prophet, Life Reading: found Atlantis, hacked TUAOI stone. |
| 19 | 18 | TUNE | The Hot Zone, GEOPOLITICAL TENSION: discard hands and panic | Nur Versalien. | The Hot Zone, Geopolitical Tension: discard hands and panic |
| 20 | 19 | TUNE | The Bimini Road, VALIDATION: crazy theories true; Atlantean land would rise. | Nur Versalien. | The Bimini Road, Validation: crazy theories true; Atlantean land would rise. |
| 21 | 20 | TUNE | Not a metaphor Nature Elementals, INVISIBLE HELP: fix broken item | Flach; Versalien. Datenhinweis: Lore im JSON endet mit „[text truncated]“. | Not a metaphor: Nature Elementals, Invisible Help: clean your energetic knots. |
| 22 | 21 | TUNE | Jack Parsons, BABALON WORKING: rapid tech advancement, die in explosion | Nur Versalien. | Jack Parsons, Babalon Working: rapid tech advancement, die in explosion |
| 23 | 22 | TUNE | Wernher von Braun, REVERSE ENGINEER: morality token discarded | Nur Versalien. | Wernher von Braun, Reverse Engineer: morality token discarded |
| 24 | 23 | TUNE | The thing about 1947 Moonchild Ritual, THE RIP: board rules altered, UFO sightings | Pointe fehlt (Roswell); Versalien. | The thing about 1947 Moonchild Ritual, The Rip: magic in desert; weeks later, Roswell happened. |
| 25 | 24 | TUNE | O.T.R.O.G. Congo Compound, BLACK SITE: weapons without oversight | Nur Versalien. | O.T.R.O.G. Congo Compound, Black Site: weapons without oversight |
| 26 | 25 | TUNE | The Roswell Debris, THE CAT IS OUT: cover-up mode | Nur Etikett; Versalien. | The Roswell Debris, The Cat Is Out: totally just weather balloon, promise. |
| 27 | 26 | TUNE | Everyone agrees The "Weather Balloon", GASLIGHT: Truth card nullified | Pointe fehlt; Versalien. | Everyone agrees: The "Weather Balloon", Gaslight: most successful, blatantly obvious lie. |
| 28 | 27 | TUNE | Intelligence Officer Marcel, INSURANCE POLICY: secret card hidden | Pointe fehlt; Versalien. | Intelligence Officer Marcel, Insurance Policy: kept piece of real wreckage. |
| 29 | 28 | TUNE | Majestic 12, COMPLETE CLASSIFICATION: opponents face down | Pointe fehlt (filing cabinets); Versalien. | Majestic 12, Complete Classification: do not mess with their filing cabinets. |
| 30 | 29 | TUNE | Have you heard of Secretary Forrestal, TOO MUCH TRUTH: massive insight, discarded out window | Nur Versalien. | Have you heard of Secretary Forrestal, Too Much Truth? Massive insight, discarded out window. |
| 31 | 30 | TUNE | Allen Dulles, DIRTY TRICKS: steal opponent's election token; replace with puppet. | Nur Versalien. | Allen Dulles, Dirty Tricks: steal opponent's election token; replace with puppet. |
| 32 | 31 | TUNE | MK Ultra Programmer, MANCHURIAN CANDIDATE: opponent's units for one turn | Verb fehlt; Versalien. | MK Ultra Programmer, Manchurian Candidate: highly suggestible assassins. |
| 33 | 32 | TUNE | Let me tell you about The Blue Enigma Program, HAZING: fake lead, wasted turn | Nur Versalien. | Let me tell you about The Blue Enigma Program, Hazing: fake lead, wasted turn |
| 34 | 33 | TUNE | The Staggering Announcement, ALMOST DISCLOSURE: about to win, turn skipped | Nur Versalien. | The Staggering Announcement, Almost Disclosure: about to win, turn skipped |
| 35 | 34 | TUNE | The Legend Builder, PATSY: incoming damage onto weakest card; perfect fall guy. | Nur Versalien. | The Legend Builder, Patsy: incoming damage onto weakest card; perfect fall guy. |
| 36 | 35 | TUNE | This one has a rule The Umbrella Man, SIGNAL: board-altering event; umbrella sunny day, Dallas shots. | Nur Versalien. | This one has a rule: The Umbrella Man, Signal: board-altering event; umbrella sunny day, Dallas shots. |
| 37 | 36 | TUNE | Lyndon B. Johnson, GET OUT OF JAIL: becoming boss | Nur Etikett, Pointe fehlt; Versalien. | Lyndon B. Johnson, Get Out of Jail: left Dallas as President. Convenient. |
| 38 | 37 | TUNE | Secret Space Program, BLACK BUDGET: public resources into private stash | Pointe fehlt; Versalien. | Secret Space Program, Black Budget: didn't stop going to space; just stopped telling you. |
| 39 | 38 | TUNE | Nobody warned us about Astronaut Gordon Cooper, GAG ORDER: know truth, lose ability to speak | Nur Versalien. | Nobody warned us about Astronaut Gordon Cooper, Gag Order: know truth, lose ability to speak |
| 40 | 39 | TUNE | The Apollo Alibi, PUBLIC RELATIONS: approval while hiding operations | Flach; Versalien. | The Apollo Alibi, Public Relations: last manned moon mission, last one they televised. |
| 41 | 40 | TUNE | Space Pearl Harbor, FALSE FLAG: destroy own units, Emergency Martial Law | Nur Versalien. | Space Pearl Harbor, False Flag: destroy own units, Emergency Martial Law |
| 42 | 41 | TUNE | The deck insists on The Archeology Wars, CONFISCATE: steal historical artifact | Pointe fehlt; Versalien. | The deck insists on The Archeology Wars, Confiscate: Indiana Jones with black ops budgets. |
| 43 | 42 | TUNE | Paulina Zelitzky, SUPPRESSED DISCOVERY: submerged city found | Kern fehlt (unterdrückt); Versalien. | Paulina Zelitzky, Suppressed Discovery: submerged city, instantly suppressed. |
| 44 | 43 | TUNE | Alfred L. Loomis Expeditions, MEMORY HOLE: permanently remove card | Flach; Versalien. | Alfred L. Loomis Expeditions, Memory Hole: ruins locked in university basements. |
| 45 | 44 | TUNE | Which brings us to Maps of the Ancient Sea Kings, PARADIGM SHIFT: anomalous ancient maps | Nur Versalien. | Which brings us to Maps of the Ancient Sea Kings, Paradigm Shift: anomalous ancient maps |
| 46 | 45 | TUNE | Ahriman, MATERIALISM: spiritual cards disabled; humanity in materialism and AI. | Nur Versalien. | Ahriman, Materialism: spiritual cards disabled; humanity in materialism and AI. |
| 47 | 46 | TUNE | War of All Against All, ATTRITION: discard until one left; society eating itself. | Nur Versalien. | War of All Against All, Attrition: discard until one left; society eating itself. |
| 48 | 47 | TUNE | Do you know AI Soul Farmers, ENERGY HARVEST: drain power every time technology | Grammatik kaputt, Frage-Opener ohne „?“; Versalien. | Do you know AI Soul Farmers, Energy Harvest? Harvest consciousness while you doomscroll. |
| 49 | 48 | TUNE | Great White Brotherhood, DIVINE INTERVENTION: lost health restored | Flach; Versalien. | Great White Brotherhood, Divine Intervention: Hermes' boss; nudge us from self-destruction. |
| 50 | 49 | TUNE | Luis Elizondo, FALSE DISCLOSURE: threat narrative; Pentagon gets more funding. | Nur Versalien. | Luis Elizondo, False Disclosure: threat narrative; Pentagon gets more funding. |
| 51 | 50 | TUNE | You with the card in your hand Bigelow Aerospace, PRIVATIZATION: UFO cards, proprietary corporate assets | Nur Versalien. | You with the card in your hand, Bigelow Aerospace, Privatization: UFO cards, proprietary corporate assets |
| 52 | 51 | TUNE | The Debunker, SWAMP GAS: nullify UFO evidence; public goes back to sleep. | Nur Versalien. | The Debunker, Swamp Gas: nullify UFO evidence; public goes back to sleep. |
| 53 | 52 | TUNE | To The Stars Academy, HYPE SQUAD: attention tokens, zero results | Nur Versalien. | To The Stars Academy, Hype Squad: attention tokens, zero results |
| 54 | 53 | TUNE | Did you hear of Mr. Global, THE GREAT RESET: player economies wiped, Mr. Global takes bank. | Nur Versalien. | Did you hear of Mr. Global, The Great Reset? Player economies wiped, Mr. Global takes bank. |
| 55 | 54 | TUNE | The Golden Dome, ORBITAL DEFENSE: attacks from space blocked | Flach; Versalien. | The Golden Dome, Orbital Defense: parity with extraterrestrials. |
| 56 | 55 | TUNE | The AI Architects, ALGORITHMIC CONTROL: predict and counter moves | Flach; Versalien. | The AI Architects, Algorithmic Control: Deep State meets Deep Tech. |
| 57 | 56 | TUNE | Meanwhile elsewhere Disinformation Board, CENSORSHIP: opponent not allowed to speak | Nur Versalien. | Meanwhile elsewhere, Disinformation Board, Censorship: opponent not allowed to speak |
| 58 | 57 | TUNE | Breakaway Civilization, ESCAPE VELOCITY: leave board, win | Halbe Pointe; Versalien. | Breakaway Civilization, Escape Velocity: you win, everyone else fights over scraps. |
| 59 | 58 | TUNE | Akashic Records, ULTIMATE TRUTH: view all cards; astral chronicle of everything. | Nur Versalien. | Akashic Records, Ultimate Truth: view all cards; astral chronicle of everything. |
| 60 | 59 | TUNE | Welcome to The A.I. Trap Door, GAME OVER: end in draw | Flach; Versalien. | Welcome to The A.I. Trap Door, Game Over: draw; no one reaches spiritual evolution. |
| 61 | 60 | TUNE | The New Continent, REBIRTH: reset board peaceful | Pointe fehlt; Versalien. | The New Continent, Rebirth: try not to blow up Firestone this time. |
