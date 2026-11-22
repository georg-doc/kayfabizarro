# Fish Files R2 · The Crew (Entwurf nach Georgs FAIL q830)

**Kurz:** R1 war Medizin-Humor mit deutschen Titeln. R2 macht aus den Fischen eine Heist-Crew mit GTA-Rollen. Jeder Fisch hat genau eine Stärke. Die Texte sind kurz und trocken, mit einer Pointe, wie Ladebildschirm-Sprüche. Alles auf Englisch, Songs nur aus Bubble FM.
Gegenlesung: ein blinder Leser ohne Regelwissen. Sein Urteil: Rap sheet und Kopfgeld treffen den GTA-Ton, die Ladebildschirm-Sprüche waren zu oft Schablone. Überarbeitet: Ladesprüche jetzt um konkrete absurde Fakten gebaut, Stärken als schlichte Werte, keine Produktionsnotizen in Spielertexten, zwei „Professoren“ entzerrt. Das ist der Stand unten.
Felder für `data/fisch_akten.json`: `id`, `rolle`, `alias`, `akte`, `kopfgeld`, `staerke`, `song`, `ladespruch`.

---

## DocFish (crimson) · The Wheelman
- **Alias:** "Doc." Nobody remembers why. Neither does Doc.
- **Rap sheet:** Grand theft aqua, four counts. Joyriding a filter pump. Resisting a net.
- **Bounty:** 4,711 shells.
- **Strength:** Fastest fish in the crew.
- **On the radio:** *Underwater Heist* – Kelp Cartel
- **Loading screen:** "Doc has eleven speeding tickets. Fish don't get speeding tickets."

## FlexiFish (angel) · The Cat Burglar
- **Alias:** "Flexi." Fits through gaps the blueprints don't show.
- **Rap sheet:** Breaking and entering, mostly entering. Stole the castle ornament. Returned the castle. Kept the drawbridge.
- **Bounty:** 900 shells.
- **Strength:** Tightest turns in the crew.
- **On the radio:** *Night Shift at the Pump Station* – Midnight Filter
- **Loading screen:** "Flexi doesn't pick locks. Flexi picks the gap next to the lock."

## Prof. MaBi (neon) · The Hacker, Mastermind
- **Alias:** Prof. MaBi. Runs the tank's network. The tank hasn't noticed.
- **Rap sheet:** Root access to the filter, the lights and the feeding schedule. Deployed on a Friday. It worked.
- **Bounty:** 0xFFFF shells.
- **Strength:** Searchlights spot him slower.
- **On the radio:** *Heist in E Minor* – Root Access
- **Look:** Sunglasses indoors. The monitors asked him to.
- **Loading screen:** "The tank's security footage is just MaBi's screensaver now."

## Prof. Humoral (clown) · The Con Artist
- **Alias:** Prof. Humoral. Smiles. Shakes fins. Counts them afterwards.
- **Rap sheet:** Sold the same treasure chest to three pirates. Twice.
- **Bounty:** 650 shells and one red nose, held as evidence.
- **Strength:** Chests pay more.
- **On the radio:** *Last Call at the Reef Bar* – Brass Barracudas
- **Loading screen:** "Humoral sold the warden a priority release. The warden is still waiting in line."

## Tetro (puffer) · The Muscle
- **Alias:** Tetro. Six inches of attitude. Twelve when provoked.
- **Rap sheet:** Headbutted a vending machine. Won. Puffed up at a guard once. The guard took early retirement.
- **Bounty:** 2,000 shells. Bring gloves.
- **Strength:** Takes one extra hit per level.
- **On the radio:** *Cold-Blooded Wave* – The Reptilian Surf Club
- **Loading screen:** "Every heist plan has a Tetro step. It just says: Tetro."

## Placebo (guppy) · The Smuggler
- **Alias:** Placebo. Moves product. Never says which.
- **Rap sheet:** Got 30,000 shells past customs in one very confident tail.
- **Bounty:** 1,200 shells, or one sponsored post.
- **Strength:** Pulls in shells from further away.
- **On the radio:** *Agua de Mar, Agua de Más* – Los Tiburones Tristes
- **Loading screen:** "Placebo has nothing to declare. Customs checked. Twice. It was fine. It was fine."

## Endo (sub) · The Informant
- **Alias:** Endo. Sees everything. Tells whoever pays.
- **Rap sheet:** Filmed the warden's feeding schedule. Sold the tape to the warden.
- **Bounty:** 3,500 shells for the memory card.
- **Strength:** The radar shows chests and hazards.
- **On the radio:** *Autobahn Under the Sea* – The Coolant Line
- **Loading screen:** "Endo sold the crew's escape plan to the warden. Then sold the warden's answer back to the crew."

## Sub Racer · The Getaway Vehicle
- **Alias:** Unregistered vessel. Half buried, fully wanted.
- **Rap sheet:** Parked on a no-parking reef for forty years. Fined daily. Paid never.
- **Bounty:** 8,000 shells and the keys.
- **Strength:** Its headlights don't trip searchlights.
- **On the radio:** *Submarine Chase* – The Ballast Brothers
- **Loading screen:** "Wanted: one sub, smoked glass. Last seen: silver. Still the same sub."

---

## Hinweise für den Einbau (nach Georgs Abnahme)
- Stärken hängen an vorhandenen Systemen: Tempo, Wendigkeit, Scheinwerfer-Erkennung, Truhen-Muscheln, Treffer/Leben, Muschel-Anziehung, Radar. Die Werte der Fische werden so angepasst, dass je Fisch nur diese eine Stärke heraussticht.
- *Heist in E Minor* (Künstler „Root Access“) muss erst aus `suno_tests/mixer_screamcore` ins Radio geholt werden.
- Songs kommen aus Bubble FM (`radio/data/songs.meta.json`). Der deutsche Künstlername „Kühlwasser“ heißt jetzt „The Coolant Line“ (Radio-Manifest und Quelle).
- Wählt man einen Fisch, wird sein Song Standard in Bubble FM. Kapert man einen anderen, wechselt der Sender.
