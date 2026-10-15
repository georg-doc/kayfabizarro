# Batch 8 · WS0-Intake (15.10.2026)

Quelle: `georg-doc/kayfabizarro`, Branch `editorial/kfb-triplets-eight-decks-r2-2026-10-15` @31639721 (nur gelesen, kein Checkout, kein Push). Kartentext `data/kfb-card-title-case-2026-10-15` @eade4aec, Register `media/kfb/index.json` @52adc8f1. Alle 8 Quell-Blobs stimmen mit `BATCH_INDEX.json` überein. Regeln: `TRIPLET_SET_SPEC_R2.md`, V-266/271/275/276/277/280/291; Vergleich mit den Goldens in `TRIPLET_SETS_R2/`.

## Ergebnis auf einen Blick

| Deck | Prüfskript PASS/FAIL | Zeichen geliefert → nach Fix | Opener | Intro OK? | TUNE | FAIL | Urteil |
|---|---|---|---|---|---:|---:|---|
| Cosmic Grift – Dark Journalism [`cosmic_grift_dark_journalism`] | 60 / 0 | 4403 → 4895 | 20, 0 Dubletten, Familien ok; „What if“ passt nicht; 11× Zeichensetzung | ja | 60 (davon 29 nur Versalien) | 0 | Zurück ans Plugin. |
| Pharaoh Piledriver [`pharaoh_piledriver`] | 51 / 0 | 4167 → 4444 | 17, 0 Dubletten, Familien ok; „What if“ passt nicht; 8× Zeichensetzung | nein (TUNE) | 14 | 0 | Kleine Korrekturen. |
| Monopolies, Manipulation & Murder Vol. II [`kayfabizarro_monopolies_manipulation_murder_vol`] | 55 / 0 | 4018 → 4674 | 18, 0 Dubletten, Familien ok; „What if“ passt nicht; 9× Zeichensetzung | ja | 17 | 0 | Kleine Korrekturen. |
| Observation Underground — ADD [`observation_underground`] | 48 / 0 | 3583 → 4078 | 16, 0 Dubletten, Familien ok; „What if“ passt nicht; 8× Zeichensetzung | nein (TUNE) | 14 | 0 | Kleine Korrekturen. |
| Trust & Betrayal — The 'Trust Me, Bro' Edition [`trust_and_betrayal`] | 55 / 0 | 4201 → 4656 | 18, 0 Dubletten, Familien ok; „What if“ passt nicht; 9× Zeichensetzung | ja | 15 | 1 | Kleine Korrekturen. |
| Nibelungen Booster Pack [`nibelungen_booster_pack_design`] | 60 / 0 | 4590 → 4914 | 20, 0 Dubletten, Familien ok; „What if“ passt nicht; 10× Zeichensetzung | nein (TUNE) | 17 | 0 | Kleine Korrekturen. |
| Uncle FrizzleBob's Tragic Flaws [`uncle_frizzlebob_s_tragic_flaws_id`] | 56 / 0 | 4383 → 4757 | 19, 0 Dubletten, Familien ok; „What if“ passt nicht; 10× Zeichensetzung | nein (TUNE) | 15 | 0 | Kleine Korrekturen. |
| Epistemic Sabotage: Let AI Read Your Comic [`epistemic_sabotage`] | 60 / 0 | 4296 → 4908 | 20, 0 Dubletten, Familien ok; „What if“ passt nicht; 10× Zeichensetzung | ja | 41 | 0 | Zurück ans Plugin. |

**Summe:** 445 Kartenzeilen, Prüfskript 445 PASS / 0 FAIL, alle 8 Tracks < 5000 Zeichen. Semantik: 193 TUNE (davon 29 nur Versalien), 1 FAIL, Rest OK. Alle Fix-Zeilen sind mit demselben Prüfskript nachgeprüft (8 × 0 FAIL, `*.fixcheck.ws0.txt`), alle Tracks bleiben nach Fix unter 4920 Zeichen.

## Urteil je Deck

- **Cosmic Grift – Dark Journalism** [`cosmic_grift_dark_journalism`]: **Zurück ans Plugin.** Alle 60 Zeilen sprechen den POWER-Begriff in Versalien (PASSIVE, INITIATIVE …); 31 Zeilen sind zudem reine Etiketten ohne Pointe. Fixliste unten vollständig; nach Einspielen 4895 Zeichen. Details: `cosmic_grift_dark_journalism.review.md`.
- **Pharaoh Piledriver** [`pharaoh_piledriver`]: **Kleine Korrekturen.** 14 TUNE (u. a. Osiris-Zeile abgeschnitten, Horus-Mechanik verdreht, Versalien „AGAINST“), Intro auf Cover-Motto umstellen. #46 ist kein OPEN, sondern eine Datenlücke: erst WS0-Datenfix, dann eine Zeile nachliefern. Details: `pharaoh_piledriver.review.md`.
- **Monopolies, Manipulation & Murder Vol. II** [`kayfabizarro_monopolies_manipulation_murder_vol`]: **Kleine Korrekturen.** 17 TUNE (flache Etiketten, Druckfehler „Canfiscats“ gesprochen). Intro OK, Skip #44 berechtigt. Details: `kayfabizarro_monopolies_manipulation_murder_vol.review.md`.
- **Observation Underground — ADD** [`observation_underground`]: **Kleine Korrekturen.** 14 TUNE; Intro spricht „— ADD“ (Dateikürzel) – neues Intro aus dem gedruckten Cover-Motto. Details: `observation_underground.review.md`.
- **Trust & Betrayal — The 'Trust Me, Bro' Edition** [`trust_and_betrayal`]: **Kleine Korrekturen.** 15 TUNE + 1 FAIL (#28 Mechanik umgekehrt: „Attack looks like healing“). Skip #30 berechtigt, Begründung präzisieren. Details: `trust_and_betrayal.review.md`.
- **Nibelungen Booster Pack** [`nibelungen_booster_pack_design`]: **Kleine Korrekturen.** 17 TUNE, Intro auf 3 Kartentitel kürzen. Nach Fix 4914 Zeichen (knapp, aber < 5000). Details: `nibelungen_booster_pack_design.review.md`.
- **Uncle FrizzleBob's Tragic Flaws** [`uncle_frizzlebob_s_tragic_flaws_id`]: **Kleine Korrekturen.** 15 TUNE (Shakespeare-Zitat fehlt in reinen Mechanik-Zeilen), Intro auf 3 Kartentitel kürzen. Details: `uncle_frizzlebob_s_tragic_flaws_id.review.md`.
- **Epistemic Sabotage: Let AI Read Your Comic** [`epistemic_sabotage`]: **Zurück ans Plugin.** 41 von 60 Zeilen sind abstrakte Etiketten ohne Pointe (die Pointe steht in der LORE). Fixliste unten vollständig; nach Einspielen 4908 Zeichen. Details: `epistemic_sabotage.review.md`.

Bereit für Suno ohne Änderung ist keines der acht Decks: in jedem Deck fehlen die Satzzeichen nach den Openern, und „What if“ steht überall vor einer Nominalgruppe ohne Verb.

## Was das Prüfskript nicht sieht (deckübergreifend)

1. **Opener-Zeichensetzung:** Die Goldens schreiben „Anyway, …“, „Not a metaphor: …“, „Have you heard of X, Begriff? …“. Der Batch klebt den Opener ohne Zeichen an („Anyway Set, …“, „Have you heard of … skip opponent's turn“). Das ändert die Betonung bei Suno. In 75 Zeilen korrigiert.
2. **„What if“** braucht einen Satz mit Verb und „?“ (Golden: „What if The Prestige Glitch machine forgets to kill original?“). In allen 8 Decks falsch, in allen 8 korrigiert.
3. **Gleicher Opener-Fahrplan in allen 8 Tracks** (Remember Z. 3, You know Z. 6, What if Z. 9 …). Regelkonform, aber die Passung Opener ↔ Karte ist Zufall. Kein Fix verlangt; Hinweis für die nächste Runde.
4. **Etiketten statt Pointe:** Das Prüfskript prüft nur den Wortschatz. Viele Zeilen behalten Titel + Mechanik-Etikett und verlieren den Witz, der in der LORE steht. Die Fixe tauschen das Etikett gegen das LORE-Bild, statt Text anzuhängen (deshalb bleiben die Tracks im Budget).
5. **Großschreibung nach dem Titel** („Bank of England, Infinite liquidity …“) in Monopolies, Observation, Trust: kein Versalien-Verstoß, für Suno egal; in den Fix-Zeilen klein geschrieben, sonst nicht verlangt.

## Ausgelassene Karten (3)

- **Pharaoh #46 The Field of Reeds – nicht berechtigt als OPEN, sondern Datenlücke.** Druck S. 13 oben rechts: „EFFECT: Heal all damage at end of turn.“ Im JSON @eade4aec steht `power: null` (ohne Sichtprüfung, anders als #45/#47/#48 daneben). Das Plugin hat richtig nichts erfunden. **WS0 (Daten):** Power aus dem Druck ins JSON übernehmen, danach liefert das Plugin eine Zeile nach (Budget reicht: 4444 Zeichen).
- **Monopolies #44 The Cashless Trap – berechtigt.** Druck S. 12 unten rechts ist in Web- und Print-PDF unlesbarer KI-Glyphensalat, die Lore ist am Kartenrand abgeschnitten. OPEN bleibt; keine Zeile vorgeschlagen.
- **Trust #30 Heel-Face Turn – berechtigt, Grund falsch benannt.** Druck S. 9 oben rechts zeigt nur Titel und Werte, keine Power und keine Lore. Das JSON führt eine Power, die nicht gedruckt ist (Datenfehler für WS0). Grund ist „kein gedruckter Text“, nicht „LORE null“.

## Datenhinweise für WS0 (nicht ans Plugin)

- Pharaoh #46: Power fehlt im JSON (siehe oben).
- Trust #30: JSON-Power nicht gedruckt; auf OPEN setzen oder Herkunft klären.
- Cosmic #20 Nature Elementals: Lore im JSON endet mit „[text truncated]“.
- Observation #3: JSON-Titel „Die Taschenspion“, Druck „The Taschenspion“.
- Registertitel „Observation Underground — ADD“ trägt das Produktionskürzel „ADD“ (auch im Suno-Songtitel nach V-291).
- Nur Cover-Decks zeigen den Titel gedruckt (Monopolies, Trust-Untertitel, Pharaoh nur Motto). Cosmic, Epistemic, Nibelungen und Observation haben kein Cover; ihr Titel steht nur im Register.

## Intro-Prüfung (Cover gerendert, alle Seitenköpfe gesichtet)

Kein Intro enthält erfundene Slogans. Alle bestehen aus Registertitel + gedruckten Kartentiteln. TUNE bei Pharaoh (6 Titel, Motto ungenutzt), Observation („— ADD“ gesprochen, „Die Taschenspion“), Nibelungen (5 Titel) und Tragic Flaws (5 Titel). Die Vorschläge nutzen nur Gedrucktes: Pharaoh-Cover „Wrestle like an Egyptian Mummy Master!“, Observation-Cover „Welcome to the Kult, Sheeple!“, Nibelungen-Randnotiz „No refunds!“ (S. 1), Tragic-Flaws-Manifest „Reality is for cowards.“ (S. 1).

## Dateien

- Je Deck: `<deckId>.check.ws0.txt` (exaktes Prüfskript auf der Lieferung), `<deckId>.review.md` (alle Zeilen mit Urteil und Fix, Intro, Opener, Skips), `<deckId>.fixcheck.ws0.txt` (Prüfskript auf den Fix-Zeilen).
- Die gelieferten Dateien (`suno.txt`, `takes.csv`, `hub.json`, `check.txt`) liegen unverändert unter ihrem deckId-Namen in `TRIPLET_SETS_R2/`. Achtung: die gelieferten `check.txt` sind die JS-Ersatzprüfung des Plugins, nicht das Python-Skript; maßgeblich ist `*.check.ws0.txt`.

---

## Correction brief for the plugin (English, paste as is)

```text
KFB triplets, batch 8 R2: WS0 intake corrections
Branch: editorial/kfb-triplets-eight-decks-r2-2026-10-15 @31639721. Source unchanged (@eade4aec, registry @52adc8f1).
Exact Python checker: 445 PASS / 0 FAIL on your delivery. Every replacement below was run through the same checker: 0 FAIL. All tracks stay under 4920 chars.
Apply exactly. Change nothing else. For each line: set spoken_text as given. Where a triplet is given, set the triplet column to it (the opener column stays). Where no triplet is given, the line has no opener and triplet = spoken_text. Rebuild suno.txt and hub.json from takes.csv, rerun triplet_set_check.py, and return the four files per deck on the same branch.
Opener punctuation convention, already included in the lines below: comma after Anyway / No wait / Before we continue / Meanwhile elsewhere / You with the card in your hand; colon after Not a metaphor / Everyone agrees / This one has a rule; '?' after title + power term for Have you heard of / Did you hear of / Do you know; 'What if' takes a verb clause ending in '?'.
Pharaoh #46: do not add a line yet. WS0 is fixing the card data first.

## cosmic_grift_dark_journalism (Cosmic Grift – Dark Journalism) – 4403 → 4895 chars
- L2 #1 spoken_text: `Welcome to the Cosmic Grift! Passive: aliens are feds, tax dollars bought moon base.`
- L3 #2 spoken_text: `Remember The UFO File, Initiative: not little green men; proprietary tech.`  (triplet: `The UFO File, Initiative: not little green men; proprietary tech.`)
- L4 #3 spoken_text: `COG: The Shadow Rules, Survival: ignore rules and keep wealth tokens`
- L5 #4 spoken_text: `Professor Scott's Deep State, Extraction: siphon Truth Tokens without noticing`
- L6 #5 spoken_text: `You know The Amelius Group, Harmony: weapon into flower`  (triplet: `The Amelius Group, Harmony: weapon into flower`)
- L7 #6 spoken_text: `The Belial Group, Destruction: occult evil meets defense spending.`
- L8 #7 spoken_text: `The TUAOI Firestone, Overcharge: infinite energy, cataclysmic flood`
- L9 #8 spoken_text: `What if Atlantean Automatons, Labor, generate free work but drain Empathy?`  (triplet: `Atlantean Automatons, Labor, generate free work but drain Empathy?`)
- L10 #9 spoken_text: `High Priest Rata, Foresight: you lived this life 12,000 years ago.`
- L11 #10 spoken_text: `Hermes the Architect, Construction: laid out Giza to stash Atlantean backups.`
- L12 #11 spoken_text: `Anyway, Hall of Records, Hoard: good luck getting permits to dig.`  (triplet: `Hall of Records, Hoard: good luck getting permits to dig.`)
- L13 #12 spoken_text: `Vitle, Banish: Dark Magic; Mayan Christ-figure stops black magicians.`
- L14 #13 spoken_text: `Madame Blavatsky, Atavistic Mediumship: mystery schools needed leak; she was firehose.`
- L15 #14 spoken_text: `No wait, Hermetic Order of the Golden Dawn, Ritual: group breaks up over biggest hat.`  (triplet: `Hermetic Order of the Golden Dawn, Ritual: group breaks up over biggest hat.`)
- L16 #15 spoken_text: `Vril Energy, Subterranean Boost: sci-fi mystery schools took way too seriously.`
- L17 #16 spoken_text: `The Eighth Sphere, Trap: defeated units lost to virtual reality`
- L18 #17 spoken_text: `Before we continue, The Sleeping Prophet, Life Reading: found Atlantis, hacked TUAOI stone.`  (triplet: `The Sleeping Prophet, Life Reading: found Atlantis, hacked TUAOI stone.`)
- L19 #18 spoken_text: `The Hot Zone, Geopolitical Tension: discard hands and panic`
- L20 #19 spoken_text: `The Bimini Road, Validation: crazy theories true; Atlantean land would rise.`
- L21 #20 spoken_text: `Not a metaphor: Nature Elementals, Invisible Help: clean your energetic knots.`  (triplet: `Nature Elementals, Invisible Help: clean your energetic knots.`)
- L22 #21 spoken_text: `Jack Parsons, Babalon Working: rapid tech advancement, die in explosion`
- L23 #22 spoken_text: `Wernher von Braun, Reverse Engineer: morality token discarded`
- L24 #23 spoken_text: `The thing about 1947 Moonchild Ritual, The Rip: magic in desert; weeks later, Roswell happened.`  (triplet: `1947 Moonchild Ritual, The Rip: magic in desert; weeks later, Roswell happened.`)
- L25 #24 spoken_text: `O.T.R.O.G. Congo Compound, Black Site: weapons without oversight`
- L26 #25 spoken_text: `The Roswell Debris, The Cat Is Out: totally just weather balloon, promise.`
- L27 #26 spoken_text: `Everyone agrees: The "Weather Balloon", Gaslight: most successful, blatantly obvious lie.`  (triplet: `The "Weather Balloon", Gaslight: most successful, blatantly obvious lie.`)
- L28 #27 spoken_text: `Intelligence Officer Marcel, Insurance Policy: kept piece of real wreckage.`
- L29 #28 spoken_text: `Majestic 12, Complete Classification: do not mess with their filing cabinets.`
- L30 #29 spoken_text: `Have you heard of Secretary Forrestal, Too Much Truth? Massive insight, discarded out window.`  (triplet: `Secretary Forrestal, Too Much Truth? Massive insight, discarded out window.`)
- L31 #30 spoken_text: `Allen Dulles, Dirty Tricks: steal opponent's election token; replace with puppet.`
- L32 #31 spoken_text: `MK Ultra Programmer, Manchurian Candidate: highly suggestible assassins.`
- L33 #32 spoken_text: `Let me tell you about The Blue Enigma Program, Hazing: fake lead, wasted turn`  (triplet: `The Blue Enigma Program, Hazing: fake lead, wasted turn`)
- L34 #33 spoken_text: `The Staggering Announcement, Almost Disclosure: about to win, turn skipped`
- L35 #34 spoken_text: `The Legend Builder, Patsy: incoming damage onto weakest card; perfect fall guy.`
- L36 #35 spoken_text: `This one has a rule: The Umbrella Man, Signal: board-altering event; umbrella sunny day, Dallas shots.`  (triplet: `The Umbrella Man, Signal: board-altering event; umbrella sunny day, Dallas shots.`)
- L37 #36 spoken_text: `Lyndon B. Johnson, Get Out of Jail: left Dallas as President. Convenient.`
- L38 #37 spoken_text: `Secret Space Program, Black Budget: didn't stop going to space; just stopped telling you.`
- L39 #38 spoken_text: `Nobody warned us about Astronaut Gordon Cooper, Gag Order: know truth, lose ability to speak`  (triplet: `Astronaut Gordon Cooper, Gag Order: know truth, lose ability to speak`)
- L40 #39 spoken_text: `The Apollo Alibi, Public Relations: last manned moon mission, last one they televised.`
- L41 #40 spoken_text: `Space Pearl Harbor, False Flag: destroy own units, Emergency Martial Law`
- L42 #41 spoken_text: `The deck insists on The Archeology Wars, Confiscate: Indiana Jones with black ops budgets.`  (triplet: `The Archeology Wars, Confiscate: Indiana Jones with black ops budgets.`)
- L43 #42 spoken_text: `Paulina Zelitzky, Suppressed Discovery: submerged city, instantly suppressed.`
- L44 #43 spoken_text: `Alfred L. Loomis Expeditions, Memory Hole: ruins locked in university basements.`
- L45 #44 spoken_text: `Which brings us to Maps of the Ancient Sea Kings, Paradigm Shift: anomalous ancient maps`  (triplet: `Maps of the Ancient Sea Kings, Paradigm Shift: anomalous ancient maps`)
- L46 #45 spoken_text: `Ahriman, Materialism: spiritual cards disabled; humanity in materialism and AI.`
- L47 #46 spoken_text: `War of All Against All, Attrition: discard until one left; society eating itself.`
- L48 #47 spoken_text: `Do you know AI Soul Farmers, Energy Harvest? Harvest consciousness while you doomscroll.`  (triplet: `AI Soul Farmers, Energy Harvest? Harvest consciousness while you doomscroll.`)
- L49 #48 spoken_text: `Great White Brotherhood, Divine Intervention: Hermes' boss; nudge us from self-destruction.`
- L50 #49 spoken_text: `Luis Elizondo, False Disclosure: threat narrative; Pentagon gets more funding.`
- L51 #50 spoken_text: `You with the card in your hand, Bigelow Aerospace, Privatization: UFO cards, proprietary corporate assets`  (triplet: `Bigelow Aerospace, Privatization: UFO cards, proprietary corporate assets`)
- L52 #51 spoken_text: `The Debunker, Swamp Gas: nullify UFO evidence; public goes back to sleep.`
- L53 #52 spoken_text: `To The Stars Academy, Hype Squad: attention tokens, zero results`
- L54 #53 spoken_text: `Did you hear of Mr. Global, The Great Reset? Player economies wiped, Mr. Global takes bank.`  (triplet: `Mr. Global, The Great Reset? Player economies wiped, Mr. Global takes bank.`)
- L55 #54 spoken_text: `The Golden Dome, Orbital Defense: parity with extraterrestrials.`
- L56 #55 spoken_text: `The AI Architects, Algorithmic Control: Deep State meets Deep Tech.`
- L57 #56 spoken_text: `Meanwhile elsewhere, Disinformation Board, Censorship: opponent not allowed to speak`  (triplet: `Disinformation Board, Censorship: opponent not allowed to speak`)
- L58 #57 spoken_text: `Breakaway Civilization, Escape Velocity: you win, everyone else fights over scraps.`
- L59 #58 spoken_text: `Akashic Records, Ultimate Truth: view all cards; astral chronicle of everything.`
- L60 #59 spoken_text: `Welcome to The A.I. Trap Door, Game Over: draw; no one reaches spiritual evolution.`  (triplet: `The A.I. Trap Door, Game Over: draw; no one reaches spiritual evolution.`)
- L61 #60 spoken_text: `The New Continent, Rebirth: try not to blow up Firestone this time.`

## pharaoh_piledriver (Pharaoh Piledriver) – 4167 → 4444 chars
- L1 intro: `Wrestle like an Egyptian Mummy Master! Pharaoh Piledriver: Atum, Ra and Set.`
- L8 #7 spoken_text: `Ra, Executive Order: change turn order; sent lion to eat humanity, they stopped clapping.`
- L9 #8 spoken_text: `What if Khepri, Resurrection Roll, retrieves card? Moves sun like ball of poop. It's a living.`  (triplet: `Khepri, Resurrection Roll, retrieves card? Moves sun like ball of poop. It's a living.`)
- L10 #9 spoken_text: `Osiris, Undying Popularity: cannot be eliminated; boxed, drowned, chopped up, still biggest pop.`
- L11 #10 spoken_text: `Isis, Gather the Pieces: reassemble destroyed card; conned sun god for his password.`
- L12 #11 spoken_text: `Anyway, Set, Sandstorm Sabotage: blind opponent; killed brother over chair shot.`  (triplet: `Set, Sandstorm Sabotage: blind opponent; killed brother over chair shot.`)
- L13 #12 spoken_text: `Horus, Vengeance Strike: double damage against Heel cards; fed uncle salad, secret ingredient.`
- L14 #13 spoken_text: `Anubis, Weighing Scale: guess card value, if correct, eliminate it; heavy heart, no club.`
- L15 #14 spoken_text: `No wait, Ma'at, Balance Check: equal stats; feather ruins afterlife, no cheating.`  (triplet: `Ma'at, Balance Check: equal stats; feather ruins afterlife, no cheating.`)
- L18 #17 spoken_text: `Before we continue, Sekhmet, Rage Virus: attack every card including own; stopped by red beer.`  (triplet: `Sekhmet, Rage Virus: attack every card including own; stopped by red beer.`)
- L21 #20 spoken_text: `Not a metaphor: Shezmu, The Squeeze: defeated cards into Perfume; skulls like grapes.`  (triplet: `Shezmu, The Squeeze: defeated cards into Perfume; skulls like grapes.`)
- L22 #21 spoken_text: `Sobek, Ambush Drag: pull opponent's card into River; loves robbery, eats tourists.`
- L27 #26 spoken_text: `Everyone agrees: Medjed, Laser Eyes: shoot beams from eyes; unseen Smiter.`  (triplet: `Medjed, Laser Eyes: shoot beams from eyes; unseen Smiter.`)
- L28 #27 spoken_text: `Babi, Aggression: attack immediately, ask questions never; eats entrails. Gross.`
- L30 #29 spoken_text: `Have you heard of The Solar Barque, Night Travel? Skip opponent's turn; millions of years, zero maintenance.`  (triplet: `The Solar Barque, Night Travel? Skip opponent's turn; millions of years, zero maintenance.`)
- L33 #32 spoken_text: `Let me tell you about The Eye of Ra, Solar Flare: damage all Chaos cards; ancient remote-controlled drone strike.`  (triplet: `The Eye of Ra, Solar Flare: damage all Chaos cards; ancient remote-controlled drone strike.`)
- L34 #33 spoken_text: `Seshat, Blueprint: look at top cards; notches lifespan on stick, invented math.`
- L36 #35 spoken_text: `This one has a rule: Imhotep, Polymath: use Manager power; mortal built pyramid, promoted to God.`  (triplet: `Imhotep, Polymath: use Manager power; mortal built pyramid, promoted to God.`)
- L38 #37 spoken_text: `Apep, System Crash: end game, nobody wins unless Ra in play; pray against him.`
- L41 #40 spoken_text: `The Red Cloud, Blindness: accuracy zero; angry breath of Set, red is color of bad things.`
- L44 #43 spoken_text: `Shai, The Script: decide dice outcome before rolling; can't fight booking committee.`
- L48 #48 spoken_text: `Do you know The Primeval Mound, High Ground? First solid ground; everything starts here.`  (triplet: `The Primeval Mound, High Ground? First solid ground; everything starts here.`)
- L49 #49 spoken_text: `The Lettuce Incident, Public Humiliation: opponent loses Cool points; Set ate salad with Horus's dressing. Awkward.`

## kayfabizarro_monopolies_manipulation_murder_vol (Monopolies, Manipulation & Murder Vol. II) – 4018 → 4674 chars
- L3 #2 spoken_text: `Remember Bank of England, infinite liquidity out of nothing; sovereign debt into private profit.`  (triplet: `Bank of England, infinite liquidity out of nothing; sovereign debt into private profit.`)
- L5 #4 spoken_text: `Federal Reserve Act, paradigm shift: empire runs on contracts and liabilities, not standing armies.`
- L6 #5 spoken_text: `You know The Fiat Flood, devalue all currency; constant inflation to sustain illusion.`  (triplet: `The Fiat Flood, devalue all currency; constant inflation to sustain illusion.`)
- L7 #6 spoken_text: `Government Bonds, state crowdfunding: broke government sells IOUs to own citizens.`
- L9 #8 spoken_text: `What if The Taxation Illusion extracts wealth via subsidies? Taxes just maintain illusion money printer isn't running.`  (triplet: `The Taxation Illusion extracts wealth via subsidies? Taxes just maintain illusion money printer isn't running.`)
- L11 #10 spoken_text: `The Pujo Committee Kabuki, nullify Regulatory Investigation; hearings merely paved way for Federal Reserve.`
- L12 #11 spoken_text: `Anyway, Hjalmar Schacht, markets love totalitarian regimes; Hitler's Banker. Capital has no morals.`  (triplet: `Hjalmar Schacht, markets love totalitarian regimes; Hitler's Banker. Capital has no morals.`)
- L13 #12 spoken_text: `Union Banking Corp., secretly fund opponent's enemies; Prescott Bush, Fritz Thyssen, fascist war machine.`
- L15 #14 spoken_text: `No wait, The IMF, Rescue bankrupt player, permanent infrastructure control`  (triplet: `The IMF, Rescue bankrupt player, permanent infrastructure control`)
- L18 #17 spoken_text: `Before we continue, Liberty Loans, Civilian wealth into military debt; financed bloodshed of WWI.`  (triplet: `Liberty Loans, Civilian wealth into military debt; financed bloodshed of WWI.`)
- L20 #19 spoken_text: `Swiss Vault Neutrality, illicit wealth immune to audits; Alps made of pure morality.`
- L21 #20 spoken_text: `Not a metaphor: The Ukraine Rebuild, Crisis privatizes state assets`  (triplet: `The Ukraine Rebuild, Crisis privatizes state assets`)
- L23 #22 spoken_text: `Regime Change, remove non-compliant leader; swiftly acquainted with harder arguments.`
- L24 #23 spoken_text: `The thing about Resource Extraction, drain developing nation; true goal of development loans.`  (triplet: `Resource Extraction, drain developing nation; true goal of development loans.`)
- L25 #24 spoken_text: `The Privatization Vise, indebted player sells public utilities; liberalization means stealing commons.`
- L27 #26 spoken_text: `Everyone agrees: Banco Ambrosiano Collapse, Debt offshore before collapse`  (triplet: `Banco Ambrosiano Collapse, Debt offshore before collapse`)
- L28 #27 spoken_text: `Roberto Calvi's Bridge, suicide problematic witness; silenced before he could sing.`
- L30 #29 spoken_text: `Have you heard of BCCI, phantom loans cover illegal operations? Bribery, trafficking, nuclear tech sales.`  (triplet: `BCCI, phantom loans cover illegal operations? Bribery, trafficking, nuclear tech sales.`)
- L31 #30 spoken_text: `The Price Waterhouse Blindfold, ignore insolvency; consulting firms deliberately ignored BCCI insolvent.`
- L33 #32 spoken_text: `Let me tell you about Osama's Offshore Wallet, untraceable shell company; CIA used BCCI to teach future enemies offshore finance.`  (triplet: `Osama's Offshore Wallet, untraceable shell company; CIA used BCCI to teach future enemies offshore finance.`)
- L36 #35 spoken_text: `This one has a rule: The War on Drugs Loop, Expand Police State without reducing supply`  (triplet: `The War on Drugs Loop, Expand Police State without reducing supply`)
- L46 #46 spoken_text: `GoFundMe Theft, opponent's crowdfunding donated to yourself; redirect donations to charities.`
- L48 #48 spoken_text: `Do you know Financial Paternalism? Erase non-cooperative players; cease to exist financially.`  (triplet: `Financial Paternalism? Erase non-cooperative players; cease to exist financially.`)
- L51 #51 spoken_text: `Did you hear of BRICS New Development Bank? Alternative system, exact same panopticon.`  (triplet: `BRICS New Development Bank? Alternative system, exact same panopticon.`)
- L55 #55 spoken_text: `The Physical Barter, move assets offline; they cannot take physical away from you.`

## observation_underground (Observation Underground — ADD) – 3583 → 4078 chars
- L1 intro: `Welcome to the Kult, Sheeple! Uncle FrizzleBob, Observationsökonomie, The Media Matrix.`
- L2 #1 spoken_text: `Uncle FrizzleBob, Narrative Sabotage: ruin Big Tech's PR with sloppy bucket of watercolour ink.`
- L3 #2 spoken_text: `Remember Observationsökonomie, extracts lifespan daily; you aren't customer, your brain chemistry is product.`  (triplet: `Observationsökonomie, extracts lifespan daily; you aren't customer, your brain chemistry is product.`)
- L5 #4 spoken_text: `The Media Matrix, infinite scroll doom loop; captive animals staring into glowing rectangles.`
- L9 #8 spoken_text: `What if M.A.I.D.S. unlocks full brain rot? Distraction dictatorship destroying cognitive capacity.`  (triplet: `M.A.I.D.S. unlocks full brain rot? Distraction dictatorship destroying cognitive capacity.`)
- L12 #11 spoken_text: `Anyway, The Dopamine Drip, Synthetic joy replaces real achievements`  (triplet: `The Dopamine Drip, Synthetic joy replaces real achievements`)
- L13 #12 spoken_text: `The 72-Million-Point Child, digital destiny pre-computed; profile finished before you're born.`
- L14 #13 spoken_text: `The G-Searcher, records secrets and fears; knows what you want before you do.`
- L15 #14 spoken_text: `No wait, The Apple-Deity, surveillance as Lifestyle Premium; publicly defends privacy.`  (triplet: `The Apple-Deity, surveillance as Lifestyle Premium; publicly defends privacy.`)
- L17 #16 spoken_text: `Cambridge Analytica Ghost, took your quizzes, mapped your anger, sold custom political reality.`
- L18 #17 spoken_text: `Before we continue, Face ID Infrared Sweeper, maps bone structure every 5 seconds, even when locked.`  (triplet: `Face ID Infrared Sweeper, maps bone structure every 5 seconds, even when locked.`)
- L19 #18 spoken_text: `Siri the Eavesdropper, always listening; how else does she know when you want her?`
- L21 #20 spoken_text: `Not a metaphor: Neural Hashing, scans every local photo; true privacy for photos no longer exists.`  (triplet: `Neural Hashing, scans every local photo; true privacy for photos no longer exists.`)
- L27 #26 spoken_text: `Everyone agrees: CO2-Budgeting, Consumption restricted; smartphone tracks purchase and movement.`  (triplet: `CO2-Budgeting, Consumption restricted; smartphone tracks purchase and movement.`)
- L28 #27 spoken_text: `Social Credit System, cancels digital existence for real-world wrong-think.`
- L30 #29 spoken_text: `Have you heard of B.L.E. Mesh Network? Devices communicate without user consent.`  (triplet: `B.L.E. Mesh Network? Devices communicate without user consent.`)
- L31 #30 spoken_text: `The Contact-Tracing Kraken, reads physical encounters; you are carrying sanctioned radar beacon.`
- L36 #35 spoken_text: `This one has a rule: NSA Surveillance Backdoor, reads everything regardless of your cute encryption.`  (triplet: `NSA Surveillance Backdoor, reads everything regardless of your cute encryption.`)
- L48 #47 spoken_text: `Do you know Tactical Flight Mode? Feed cut, anxiety zero; loaded weapon locked in drawer.`  (triplet: `Tactical Flight Mode? Feed cut, anxiety zero; loaded weapon locked in drawer.`)

## trust_and_betrayal (Trust & Betrayal — The 'Trust Me, Bro' Edition) – 4201 → 4656 chars
- L2 #1 spoken_text: `Inevitable Mutual Betrayal, reveal hands, lowest loses everything; why are you surprised?`
- L5 #4 spoken_text: `False Friend, tell them you love them, discard their highest card.`
- L8 #7 spoken_text: `Betrayal Insurance, steal two items; poisoned your coffee three weeks ago.`
- L9 #8 spoken_text: `What if Chronic Backstabbing Disorder, must betray ally? Like sneezing, but with more knives.`  (triplet: `Chronic Backstabbing Disorder, must betray ally? Like sneezing, but with more knives.`)
- L10 #9 spoken_text: `The Starscream, challenge leader, if you lose, apologize; grovel to face, plot against back.`
- L12 #11 spoken_text: `Anyway, Stealing the Credit, take card someone else played; it's yours now. I made this.`  (triplet: `Stealing the Credit, take card someone else played; it's yours now. I made this.`)
- L15 #14 spoken_text: `No wait, The Puppet Master, force another player's move; dance, little fly.`  (triplet: `The Puppet Master, force another player's move; dance, little fly.`)
- L16 #15 spoken_text: `I Can Rule Alone, break alliance, take shared resources; lose turn, you are now lonely.`
- L18 #17 spoken_text: `Before we continue, The Mole, Peek at everyone's hand; digging for dirt, not worms.`  (triplet: `The Mole, Peek at everyone's hand; digging for dirt, not worms.`)
- L21 #20 spoken_text: `Not a metaphor: Dead Person Impersonation, retrieve graveyard card; death exaggerated to collect insurance money.`  (triplet: `Dead Person Impersonation, retrieve graveyard card; death exaggerated to collect insurance money.`)
- L23 #22 spoken_text: `Parental Betrayal, sacrifice lower card for higher; I can take you out for snack.`
- L27 #26 spoken_text: `Everyone agrees: The Honey Trap, force attack, reflect damage; not love, bioluminescent predatory bait.`  (triplet: `The Honey Trap, force attack, reflect damage; not love, bioluminescent predatory bait.`)
- L29 #28 spoken_text: `Mistaken for Betrayal, looks like attack, actually heals; why hitting me with newspaper?`
- L30 #29 spoken_text: `Have you heard of Face-Heel Turn? Good to Evil, healing into damage; chew furniture.`  (triplet: `Face-Heel Turn? Good to Evil, healing into damage; chew furniture.`)
- L36 #36 spoken_text: `This one has a rule: Nasty Party, Lowest roll executed; Red Wedding catering exquisite.`  (triplet: `Nasty Party, Lowest roll executed; Red Wedding catering exquisite.`)
- L41 #41 spoken_text: `Thirty Pieces of Silver, sell out ally; loyalty surprisingly affordable in this economy.`
- L43 #43 spoken_text: `Lying Finger Cross, cancel deal; doesn't count if digits intertwined. International law.`
- L48 #48 spoken_text: `Do you know You Have Outlived Your Usefulness? Eliminate own ally; job is done, and so are you.`  (triplet: `You Have Outlived Your Usefulness? Eliminate own ally; job is done, and so are you.`)
- L51 #51 spoken_text: `Did you hear of Manchurian Candidate, activate Sleeper? When you hear Omelette, kill Prime Minister.`  (triplet: `Manchurian Candidate, activate Sleeper? When you hear Omelette, kill Prime Minister.`)

## nibelungen_booster_pack_design (Nibelungen Booster Pack) – 4590 → 4914 chars
- L1 intro: `Nibelungen Booster Pack: Siegfried, Brunhild and Hagen. No refunds!`
- L6 #5 spoken_text: `You know Siegfried, Main Character Syndrome: kill dragon, not check back for leaves.`  (triplet: `Siegfried, Main Character Syndrome: kill dragon, not check back for leaves.`)
- L9 #8 spoken_text: `What if Balmung, Overkill, destroys opponent's weapon too? Cleave anvil in half.`  (triplet: `Balmung, Overkill, destroys opponent's weapon too? Cleave anvil in half.`)
- L10 #9 spoken_text: `Gunther, Delegate Authority: brave, as long as someone else is fighting.`
- L12 #11 spoken_text: `Anyway, The Proxy Wooing, Identity Theft: swap hands, claim misunderstanding`  (triplet: `The Proxy Wooing, Identity Theft: swap hands, claim misunderstanding`)
- L13 #12 spoken_text: `The Boat to Iceland, Travel Montage: woman who can kill you with pebble. Men are idiots.`
- L15 #14 spoken_text: `No wait, The Boulder Throw, Heavy Artillery: can't lift this, don't ask for her number.`  (triplet: `The Boulder Throw, Heavy Artillery: can't lift this, don't ask for her number.`)
- L16 #15 spoken_text: `The Spear Toss, Shield Breaker: shield, armor, ego; Gunther fainted.`
- L18 #17 spoken_text: `Before we continue, The Wrestling Match, Tag Team: lights out, King very strong. Kayfabe.`  (triplet: `The Wrestling Match, Tag Team: lights out, King very strong. Kayfabe.`)
- L19 #18 spoken_text: `The Girdle, Disempower: Siegfried's souvenir; terrible brother-in-law.`
- L21 #20 spoken_text: `Not a metaphor: The Submission, Depower: Brunhild lost her strength`  (triplet: `The Submission, Depower: Brunhild lost her strength`)
- L23 #22 spoken_text: `The Cross on the Robe, Marked for Death: sewed on to protect, used as bullseye.`
- L26 #25 spoken_text: `The Spear in the Back, Assassination: honor is for dead people.`
- L27 #26 spoken_text: `Everyone agrees: The Corpse at the Door, Trauma: discard hand due grief; corpse dumped at door.`  (triplet: `The Corpse at the Door, Trauma: discard hand due grief; corpse dumped at door.`)
- L30 #29 spoken_text: `Have you heard of The Treasure Pile, Bribery? Pay gold, cancel attack; wealth buys friends.`  (triplet: `The Treasure Pile, Bribery? Pay gold, cancel attack; wealth buys friends.`)
- L36 #35 spoken_text: `This one has a rule: The Journey East, Point of No Return: no retreat; Danube crossed, boat smashed.`  (triplet: `The Journey East, Point of No Return: no retreat; Danube crossed, boat smashed.`)
- L42 #41 spoken_text: `The deck insists on The Burning Roof, Environment Damage: really committed to this revenge thing.`  (triplet: `The Burning Roof, Environment Damage: really committed to this revenge thing.`)
- L48 #47 spoken_text: `Do you know Rüdiger, Moral Conflict? Fight and die or refuse and die; promise a favor.`  (triplet: `Rüdiger, Moral Conflict? Fight and die or refuse and die; promise a favor.`)
- L51 #50 spoken_text: `Did you hear of Balmung Reclaimed, Execution? Defenseless prisoner; poetic justice, written in blood.`  (triplet: `Balmung Reclaimed, Execution? Defenseless prisoner; poetic justice, written in blood.`)
- L52 #51 spoken_text: `Hagen's Laugh, Last Word: taking gold to hell. You lose.`
- L54 #53 spoken_text: `Welcome to The Survivors, Mourning: lot of crying for heavy metal album cover.`  (triplet: `The Survivors, Mourning: lot of crying for heavy metal album cover.`)
- L57 #56 spoken_text: `Meanwhile elsewhere, Uncle FrizzleBob, Rule Breaker: play with corpses; you bought expansion.`  (triplet: `Uncle FrizzleBob, Rule Breaker: play with corpses; you bought expansion.`)
- L58 #57 spoken_text: `Toxic Masculinity, Ego Boost: cannot retreat or heal; if anyone had gone to therapy, thousands alive.`
- L60 #59 spoken_text: `I used to believe Germanic Depression, Weltschmerz: enduring inevitable doom with stoic face.`  (triplet: `Germanic Depression, Weltschmerz: enduring inevitable doom with stoic face.`)

## uncle_frizzlebob_s_tragic_flaws_id (Uncle FrizzleBob's Tragic Flaws) – 4383 → 4757 chars
- L1 intro: `Uncle FrizzleBob's Tragic Flaws. Reality is for cowards. Hamlet, Macbeth, Lear.`
- L3 #2 spoken_text: `Remember Claudius, The Rat King, Usurp: swap hands; a brother's murder. Pray can I not.`  (triplet: `Claudius, The Rat King, Usurp: swap hands; a brother's murder. Pray can I not.`)
- L4 #3 spoken_text: `Gertrude, The Poodle, Willful Ignorance: ignore Action; lady doth protest too much.`
- L6 #5 spoken_text: `You know Polonius, The Parrot, Verbose: talk uninterrupted; brevity is soul of wit.`  (triplet: `Polonius, The Parrot, Verbose: talk uninterrupted; brevity is soul of wit.`)
- L8 #7 spoken_text: `Laertes, The Gamecock, Revenge: double damage to Hamlet player; I dare damnation.`
- L9 #8 spoken_text: `What if Horatio, The Retriever, Witness, narrates winner's victory to make them feel guilty?`  (triplet: `Horatio, The Retriever, Witness, narrates winner's victory to make them feel guilty?`)
- L11 #10 spoken_text: `Rosencrantz & Guildenstern, Expendable: discard to avoid damage; not near my conscience.`
- L12 #11 spoken_text: `Anyway, The Mousetrap Play, Guilt Trip: King card discarded; play catches King's conscience.`  (triplet: `The Mousetrap Play, Guilt Trip: King card discarded; play catches King's conscience.`)
- L15 #14 spoken_text: `No wait, Lady M, The Sphynx Cat, Coercion: force another to attack; out damned spot.`  (triplet: `Lady M, The Sphynx Cat, Coercion: force another to attack; out damned spot.`)
- L16 #15 spoken_text: `The Weird Sisters, Prophecy: arrange cards to screw over friends; double toil and trouble.`
- L17 #16 spoken_text: `Banquo, The Ghost Dog, Guilt: most cards cannot play Actions; never shake thy gory locks.`
- L18 #17 spoken_text: `Before we continue, Macduff, The Ram, Not Born of Woman: Tyrant defeated; womb untimely ripp'd.`  (triplet: `Macduff, The Ram, Not Born of Woman: Tyrant defeated; womb untimely ripp'd.`)
- L19 #18 spoken_text: `Lady Macduff, The Bird, Innocence: attacker loses Reputation; poor bird!`
- L21 #20 spoken_text: `Not a metaphor: Malcolm, The Lamb, Restoration: discard pile back into deck; country's purge.`  (triplet: `Malcolm, The Lamb, Restoration: discard pile back into deck; country's purge.`)
- L27 #26 spoken_text: `Everyone agrees: The Fool, The Bird, Truth Bomb: reveal hand, mock strategy`  (triplet: `The Fool, The Bird, Truth Bomb: reveal hand, mock strategy`)
- L30 #29 spoken_text: `Have you heard of Gloucester, The Mole, Despair? Jump cliff or survive; no way, want no eyes.`  (triplet: `Gloucester, The Mole, Despair? Jump cliff or survive; no way, want no eyes.`)
- L31 #30 spoken_text: `Edmund, The Fox, Bastard's Ambition: swap lowest for highest; gods, stand up for bastards!`
- L36 #35 spoken_text: `This one has a rule: The Cliff, Placebo: heal 5 HP, nothing actually happened; cliff altitude.`  (triplet: `The Cliff, Placebo: heal 5 HP, nothing actually happened; cliff altitude.`)
- L39 #38 spoken_text: `Nobody warned us about Antony, The Old War Horse, Dotage: ignore responsibilities; triple pillar into strumpet's fool.`  (triplet: `Antony, The Old War Horse, Dotage: ignore responsibilities; triple pillar into strumpet's fool.`)
- L41 #40 spoken_text: `Enobarbus, The Fox, Defection: switch alliances mid-battle, die of heartbreak later.`
- L42 #41 spoken_text: `The deck insists on Charmian & Iras, Flamingos, Fortune Telling: predict next card; three kings, widow them all.`  (triplet: `Charmian & Iras, Flamingos, Fortune Telling: predict next card; three kings, widow them all.`)
- L48 #47 spoken_text: `Do you know The Monument, Siege? Cannot attack or be attacked; lock yourself, word you are dead.`  (triplet: `The Monument, Siege? Cannot attack or be attacked; lock yourself, word you are dead.`)
- L51 #50 spoken_text: `Did you hear of Queen Mab, The Bug, Inception? False idea in opponent's hand; fairies' midwife.`  (triplet: `Queen Mab, The Bug, Inception? False idea in opponent's hand; fairies' midwife.`)
- L53 #52 spoken_text: `The Hazel-Nut Chariot, Transport: discarded card to hand; joiner squirrel or old grub.`
- L57 #56 spoken_text: `Meanwhile elsewhere, Uncle FrizzleBob's Approval, Chaos: Shuffle all hands, redeal`  (triplet: `Uncle FrizzleBob's Approval, Chaos: Shuffle all hands, redeal`)

## epistemic_sabotage (Epistemic Sabotage: Let AI Read Your Comic) – 4296 → 4908 chars
- L2 #1 spoken_text: `Uncle FrizzleBob's Meta-Cover, question reality; revolution won't be generated.`
- L3 #2 spoken_text: `Remember The Two-Headed Podium Monster, Friend or Fee; loudest arguments miss point.`  (triplet: `The Two-Headed Podium Monster, Friend or Fee; loudest arguments miss point.`)
- L5 #4 spoken_text: `The Paint-Vomiting Toad, copies your voice, forgets what you were trying to say.`
- L6 #5 spoken_text: `You know The Brick Wall Turtle, inaccessible; comics built fortresses, not doors.`  (triplet: `The Brick Wall Turtle, inaccessible; comics built fortresses, not doors.`)
- L9 #8 spoken_text: `What if The Simple-Speak Sloth distills webs into Leichte Sprache? Complexity, ego trip.`  (triplet: `The Simple-Speak Sloth distills webs into Leichte Sprache? Complexity, ego trip.`)
- L10 #9 spoken_text: `The Polyglot Parrot, translation at lightning speed; skeleton, cannot breathe life.`
- L11 #10 spoken_text: `The Rhythm Rhino, soul of joke rarely survives literal border crossing.`
- L12 #11 spoken_text: `Anyway, The Scar-Shifting Chameleon, timeline glitches; magically healing wound.`  (triplet: `The Scar-Shifting Chameleon, timeline glitches; magically healing wound.`)
- L13 #12 spoken_text: `The Dyslexic Woodpecker, hunts forgotten quotation marks across 200 pages.`
- L14 #13 spoken_text: `The Retro-Tram Walrus, accuracy for every signpost; past, unforgiving critic.`
- L15 #14 spoken_text: `No wait, The Caffeinated Bloodhound, Obscure historical research`  (triplet: `The Caffeinated Bloodhound, Obscure historical research`)
- L16 #15 spoken_text: `The Lying Fox-Bot, lies to save itself from saying I don't know.`
- L18 #17 spoken_text: `Before we continue, The Begging Bear, masterpiece easier than asking strangers to pay.`  (triplet: `The Begging Bear, masterpiece easier than asking strangers to pay.`)
- L19 #18 spoken_text: `The Bureaucracy Beaver, German funding jungle worships format.`
- L20 #19 spoken_text: `The Boxing Kangaroo-Bot, know your story once forced to defend it.`
- L21 #20 spoken_text: `Not a metaphor: The Staring Lemur, Architecture of masterpieces; machine look with you, not draw.`  (triplet: `The Staring Lemur, Architecture of masterpieces; machine look with you, not draw.`)
- L25 #24 spoken_text: `The Seesaw Elephant, refusing tools hands future to corporations.`
- L26 #25 spoken_text: `The Wide-Eyed Fawn, reads comic stripped of author's defensive explanations.`
- L27 #26 spoken_text: `Everyone agrees: The Nerd-Herd Sheep, you can't bluff genre fan.`  (triplet: `The Nerd-Herd Sheep, you can't bluff genre fan.`)
- L28 #27 spoken_text: `The Stumbling Goat, eye confused, brain stops caring about heart.`
- L29 #28 spoken_text: `The Mood-Ring Octopus, perfect page worthless if emotional temperature flat.`
- L30 #29 spoken_text: `Have you heard of The Spectacled Badger, constructive feedback? What works before what's broken.`  (triplet: `The Spectacled Badger, constructive feedback? What works before what's broken.`)
- L33 #32 spoken_text: `Let me tell you about The Interrogator Toad, small questions won't save broken foundation.`  (triplet: `The Interrogator Toad, small questions won't save broken foundation.`)
- L34 #33 spoken_text: `The Salt-Shaker Vulture, kindness to artist, cruelty to art.`
- L36 #35 spoken_text: `This one has a rule: The Sadistic Pelican, Deep idea merely pretending; hollow echo deafens reader.`  (triplet: `The Sadistic Pelican, Deep idea merely pretending; hollow echo deafens reader.`)
- L37 #36 spoken_text: `The St. Bernard of Rescue, destruction without path to salvation is just vandalism.`
- L38 #37 spoken_text: `The Silver-Haired Time-Fox, time, only critic that cannot be argued with.`
- L40 #39 spoken_text: `The Facepalming Ostrich, growth measured by severity of future embarrassment.`
- L41 #40 spoken_text: `The Sprouting Acorn-Pig, next great era hiding as mistake in current draft.`
- L42 #41 spoken_text: `The deck insists on The Perspiring Penguin, brilliance evaporates if you cannot speak its name.`  (triplet: `The Perspiring Penguin, brilliance evaporates if you cannot speak its name.`)
- L43 #42 spoken_text: `The Ascending Giraffe, more than one breath, they have stopped listening.`
- L45 #44 spoken_text: `Which brings us to The Jabba-Toad Publisher, publishing, transaction with swamp.`  (triplet: `The Jabba-Toad Publisher, publishing, transaction with swamp.`)
- L46 #45 spoken_text: `The Sand-Burying Ostrich, pencil strokes while world burns.`
- L47 #46 spoken_text: `The Missile-Riding Pigeon, algorithm that helps you draw, cousin of strike algorithm.`
- L48 #47 spoken_text: `Do you know The Lantern Anglerfish, billionaires' endgame? Marketing, not liberation.`  (triplet: `The Lantern Anglerfish, billionaires' endgame? Marketing, not liberation.`)
- L49 #48 spoken_text: `The Gavel Vulture, law at speed of bureaucracy, machine at speed of theft.`
- L51 #50 spoken_text: `Did you hear of The Steering-Wheel Raccoon, means of utilization? Hotwire master's car.`  (triplet: `The Steering-Wheel Raccoon, means of utilization? Hotwire master's car.`)
- L52 #51 spoken_text: `The Probe-Stage Chameleon, crash-test dummy for your ego.`
- L53 #52 spoken_text: `The Multi-Armed Sloth, automates grunt work; resurrects artist.`
- L54 #53 spoken_text: `Welcome to The Panting Cheetah, action easy to draw; exhaustion requires genius.`  (triplet: `The Panting Cheetah, action easy to draw; exhaustion requires genius.`)
- L56 #55 spoken_text: `The Elephant's Post-it, 200 pages so they remember one panel forever.`
- L57 #56 spoken_text: `Meanwhile elsewhere, The Machete-Wielding Monkey, German funding labyrinth; administrative violence.`  (triplet: `The Machete-Wielding Monkey, German funding labyrinth; administrative violence.`)
- L59 #58 spoken_text: `The Sentient Eraser, judgment over what stays and what is destroyed; wisdom to erase.`
- L60 #59 spoken_text: `I used to believe The Screaming Possum, easier to edit garbage than birth perfection.`  (triplet: `The Screaming Possum, easier to edit garbage than birth perfection.`)
- L61 #60 spoken_text: `Uncle FrizzleBob's Megaphone, pick up pencils, hotwire algorithm.`

```