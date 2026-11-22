# Fisch-Akten R1 · „Wanted for Audio Crimes“ (Entwurf zur Abnahme)

**Kurz:** Je spielbarem Fisch ein Steckbrief im Knast-Rahmen von Georg: Das Aquarium ist ein Gefängnis, die Insassen sitzen wegen Vergehen gegen die Obrigkeit des Ozeans ein, „Escape Now!“ ist der Ausbruch.
Ton nach `replies/META_TEXTE/GOLDEN_SAMPLES_AQUA_R1.md`: ernstes Gesicht, eine Wendung pro Satz, Satire auf Behörden-, Medizin- und Werbesprache, nie auf Menschen.
Die Texte stehen auf Englisch, weil die Seite nur englisch läuft. Die deutschen Fassungen folgen nach Georgs Abnahme. Noch nichts davon ist eingebaut.

**Was Georg entscheiden soll:**
- Texte so, ändern oder streichen, je Fisch.
- Ob **Prof. MaBi** der Neon-Salmler wird. Grund für die Wahl: leuchtet wie ein Monitor, schläft nie, schnellster und wendigster Fisch, also der Hacker-Typ. Er ersetzt dort „Tachy“.
- Song je Fisch (aus `radio/data/songs.meta.json`; zwei Titel müssen erst noch ins Radio, siehe unten).
- Die Perks sind nur ein Vorschlag. Sie hängen an Systemen, die es im Spiel schon gibt.

Spalten in der späteren Datendatei `data/fisch_akten.json`: `id`, `alias`, `vergehen`, `strafmass`, `musikVergleich`, `signatureSong`, `perk`. KFB kann dieselben Felder später für Figuren und Fahrzeuge übernehmen.

---

## 1 · DocFish (crimson) · die Hauptfigur
- **Alias:** “Doc” DocFish, a.k.a. The Specialist
- **Offence:** Practising medicine without a licence, a lab coat or hands. Prescribed 312 escape plans to fellow inmates.
- **Sentence / Bounty:** Life, plus a waiting-room magazine subscription. Bounty: 4,711 shells.
- **Music:** Listens to heist funk the way other fish read the small print: twice, with the bass up.
- **Signature song:** *Underwater Heist* – Kelp Cartel (`underwater_heist`)
- **Perk (Vorschlag):** *Second Opinion* – the first catch per level costs no heart.

## 2 · FlexiFish (angel) · der Flexible
- **Alias:** “Flexi” FlexiFish, The Contortionist
- **Offence:** Read the ocean’s terms and conditions. All of them. Then quoted them back in court.
- **Sentence / Bounty:** Eight years for excessive literacy. Bounty: 900 shells, payable in footnotes.
- **Music:** Waltzes. Nothing says “I bend the rules” like three-four time in a tank.
- **Signature song:** *Tales from the Vienna Waters* – The Imperial Aquarium Orchestra (`tales_from_the_vienna_woods`)
- **Perk (Vorschlag):** *Bend* – tighter turns (uses the existing agility stat).

## 3 · Prof. MaBi (neon) · Ehrung für Markus, Head of IT bei DocCheck
- **Alias:** Prof. MaBi, Architect of Operation: AquaCare
- **Offence:** Gained root access to the aquarium. The filter, the lights and the feeding schedule now run on his scripts. Deployed on a Friday. It worked.
- **Sentence / Bounty:** Unknown. The court’s database was migrated during the hearing. Bounty: 0xFFFF shells (the bounty system was migrated too).
- **Music:** Scream metal at 110 BPM, the only tempo at which the keyboard keeps up with the brain.
- **Extra line for the info panel:** Wears sunglasses indoors. The monitors asked him to.
- **Signature song:** *Heist in E Minor* (scream, 110 BPM), Georg (`mixer_screamcore`). **Fehlt noch im Radio:** muss aus `suno_tests/mixer_screamcore` eingelesen werden.
- **Perk (Vorschlag):** *Loop the Cameras* – once per level, the searchlights go dark for 3 seconds.
- **Look:** sunglasses from the KayKit driver (`Driver_Sunglasses` and lens `KFB_Glass_lens` only), sitting in front of the KFB eyes. Private, artifact only.
- **Hommage-Check:** He is the mastermind who hacked the tank. The joke is always on the systems (court, database, bounty), never on him.

## 4 · Prof. Humoral (clown) · Klinikclown a. D.
- **Alias:** Prof. Humoral, Clinic Clown (Retired)
- **Offence:** Gave a ninety-minute lecture on the four humours to a jury that came for the jokes. Found guilty of being serious with intent.
- **Sentence / Bounty:** Twelve years, suspended for good material. Bounty: 650 shells and one red nose (evidence).
- **Music:** Satie in a waiting room. He insists the silence between the notes is the punchline.
- **Signature song:** *Gymnopédie No. 1 (Waiting Room Version)* – The Waiting Room Pianist (`gymnopedie_no_1`)
- **Perk (Vorschlag):** *Comic Relief* – searchlights take longer to spot him (uses the existing camouflage value).

## 5 · Tetro (puffer) · hochgiftig, leicht nervös
- **Alias:** Tetro, Highly Toxic, Mildly Anxious
- **Offence:** Carrying a concealed neurotoxin in a public tank. Claims it was for personal use.
- **Sentence / Bounty:** Indefinite. Every guard who tried the cuffs called in sick. Bounty: 2,000 shells, hazmat suit not included.
- **Music:** Breathing exercises with a beat. He has tried to calm down to them 400 times. Personal best: nine seconds.
- **Signature song:** *Breathe In, Bubble Out* – Mindscape Lab (`s02_atem_bett`)
- **Perk (Vorschlag):** *Inflate* – a short puff pushes hooks and eyes away.

## 6 · Placebo (guppy) · wirkt, weil du dran glaubst
- **Alias:** Placebo, Works Because You Believe
- **Offence:** Sold 30,000 bottles of tank water as a detox cleanse. Five-star reviews, no ingredients.
- **Sentence / Bounty:** Three years, reduced to six months for excellent lighting at the trial. Bounty: 1,200 shells, or one sponsored post.
- **Music:** Glossy art-pop. Sounds expensive, contains nothing, everyone feels better.
- **Signature song:** *Glossy Melancholy in Aisle Five* – Neon Anemone (`artpop_glossy`)
- **Perk (Vorschlag):** *Marketing* – chests pay 25 % more shells.

## 7 · Endo (sub) · technisch ein Gefäß
- **Alias:** Endo, Technically a Vessel
- **Offence:** Unauthorised imaging of the ocean’s insides. Has pictures the Ocean Authority would rather keep internal.
- **Sentence / Bounty:** Swallowed by the system twice, released twice on a technicality. Bounty: 3,500 shells for the memory card.
- **Music:** Motorik. Steady, forward, one long journey through the plumbing.
- **Signature song:** *Autobahn Under the Sea* – Kühlwasser (`motorik_kuehl`)
- **Perk (Vorschlag):** *Imaging* – the sonar also shows chests.

## 8 · Dieselpunk-U-Boot (Fahrzeug, kommt nach den Truhen)
- **Alias:** The Sub Racer, Unregistered Vessel
- **Offence:** Parked on a no-parking reef for forty years. Now half buried in sand and twice as wanted.
- **Sentence / Bounty:** Impounded, pending a dome nobody can see into. Bounty: 8,000 shells and the keys.
- **Music:** Surf noir. Twang guitar in the rain, and down here it is always raining.
- **Signature song:** Platzhalter *Rockabilly Gills* – Johnny Fin & The Sharkskins (`surf_und_rockabilly`, aus „KFB Surf und Rockabilly“), bis Georgs Surf-Noir-Song da ist.
- **Perk (Vorschlag):** *Headlights* – own light cones, they do not trigger the searchlights.

---

## Einbau nach der Abnahme (nicht jetzt)
- `data/fisch_akten.json` mit den Feldern oben; EN/DE.
- Info-Panel des Fisches als Steckbrief-Karte: Alias als Überschrift, Vergehen, Strafmaß/Kopfgeld, Musik-Vergleich, darunter Play/Stopp für den Signature-Song. Der Knopf spielt übers Radio, es gibt keine zweite Wiedergabe.
- Wählt man den Fisch, wird sein Song die Standardmusik in Bubble FM. Kapert man einen anderen Fisch, wechselt Bubble FM auf dessen Song.
- Fehlende Titel ins Radio holen: *Heist in E Minor* (`mixer_screamcore`) und später Georgs Surf-Noir-Song.
