# Resident list vs. Dramatis Personae · alignment R1 · 20.10.2026
**Sources:**
- `WRITERS_ROOM_R1/RESIDENT_PROPOSALS_R1.json` (Georg confirmed it on 20.10. as a whole);
- the character sheets in `FIGURES_R1/characters/` @2a842c5.

**Rule proposal:** where a sheet already names a deck candidate or a role, the canon takes precedence over my list. Every conflict is decided individually by Georg; nothing is decided automatically.

| # | Figure | Dramatis Personae says | Resident list says | Options |
|---|---|---|---|---|
| 1 | 4GTN | "CEO of Utopia; face of transhumanist self-optimisation"; candidate *Forget Utopia* | 4GTN + 4GTN Forgotten → *Wrinkle Rumble* | 4GTN → *Forget Utopia* (Robot Two stays free or moves elsewhere) |
| 2 | 4GTN Forgotten | "maker space helper, repair café host" (twin, banished; utopia vs. protopia) | Farmer A → *Embrace Protopia* | 4GTN Forgotten → *Embrace Protopia*; Farmer A to *Bard's Barnyard* or a free deck |
| 3 | Goth Girl | candidate *Sonic Slaughterhouse* (DESIGN, not decided) | Goth Girl → *Ego Mania* and *Dream-Freud* | Goth Girl (b) → *Sonic Slaughterhouse*; Animatronic Creepy stays with The Move or elsewhere |
| 4 | FrizzleBob | Herald/Guide, outside the Base-24 residents | FrizzleBob → *Mission Control* (resident) and guest in *Ego Mania* | FrizzleBob only as herald/guest; *Mission Control* gets a different resident |
| 5 | Norman | systemic victim, tragicomic crash-test dummy | not used | Norman for *Bullshit Jobs* / *What Work Was For* or as the jobber figure |
| – | Mummy A/B | tomb residents | *Pharaoh Piledriver* duet | consistent |
| – | Orc Brute | war resident, deckLane strength, loyalty, labor, noise, anti-pretension | Orc Brute A+B → *Uruk Rumble* | consistent |
| – | Combat Mech | no sheet yet | *The Biological Metropolis* | sheet proposal `combat_mech.character.proposal.json` |

**Next step:** Georg decides 1–5. After that, the resident list and the Writers' Room are updated, additively, with the old values kept in the history.

## Status 20.10. (evening)
- **#5 Norman: decided (Georg).** Norman takes *Bullshit Jobs Uncut* and *What Work Was For*.
  - Writers' Room and `RESIDENT_PROPOSALS_R1.json` are updated; the old Driver A/B entries are kept as `previous`.
  - Home and fractal idea remain a proposal.
- **#1 4GTN / #2 4GTN Forgotten: Georg's canon of 20.10. supports the swap.**
  - 4GTN = CEO of Utopia (transhumanism, dark enlightenment, technocracy, surveillance capitalism; lures docile NPCs for the fluff harvest).
  - Forgotten = predecessor model / "good" twin in the Protopia maker space.
  - Proposal: 4GTN → *Forget Utopia*, 4GTN Forgotten → *Embrace Protopia*. Georg still has to confirm.
- **#3 Goth Girl, #4 FrizzleBob:** open.
- **Character canon of 20.10.:** recorded as a field patch in `PERSONAE_PATCH_R1.json` (4GTN, 4GTN Forgotten, Lord Hunky, Norman).

## Status 20.10. (late evening): Georg on FrizzleBob, Goth Girl, Caveman
- **#4 FrizzleBob: direction decided (Georg).** "Meta, and for now the default player avatar/character."
  - *Ego Mania*: Goth Girl stays the resident. FB is the player here (role "the guest who never gets a word in").
  - *Mission Control*: back to VORSCHLAG. Open question: does FB stay the resident of his own deck, or does another resident take over (with FB/the player listening)?
  - Conflict marked, not overwritten: the sheet field `cards.performanceDecks` says "MC of every deck song (stand-up opener)" [GEORG 17.10.]. That contradicts the resident principle of 20.10.
- **#3 Goth Girl: new canon (Georg).** Dark psychology, the occult and sarcasm, plus conspiracy and psyops. Deck candidates in light of this, as a proposal only:
  - *Ego Mania* (narcissism = dark psychology, already hers);
  - *Dream-Freud* (already hers);
  - *Geopolitical Thrillers & Conspiracy Theories* (currently Frost Golem);
  - *Sonic Slaughterhouse* (sheet DESIGN; currently Animatronic Creepy).
  - The psyops decks *Saboteur Sketchbook* and *Sonic Warfare* are not among the 60.
- **#6 Caveman (new, Georg).**
  - Native of the KFB multiverse. Lord Hunky made him out of plasticine in the Fluff Incident (claymation genesis satire).
  - His wife allegedly ran off with the Vampire.
  - In Hunky's eyes, his critical thinking is to blame for the unplanned high-vibrational fluff and the failure of the harvesting, terraforming and clayforming plans.
  - Deck candidates:
    - "Plato's Cave(man)/Dungeon Raid (RPG archetypes as philosophers)". The best fit is `philosopher_dungeon_raid` (Nietzsche, Arendt, Socrates, Diogenes, Plato, Boss: The Last Man …), but that deck is **not among the 60**.
    - Among the 60 are `platos_dungeon_raid_v05` (Ranger) and `…_hero_set_01` (Knight).
    - "Dionysos": no deck or card in the registry mentions Dionysos.
  - Currently the Caveman is the resident of *The Biology of Rebellion*.
  - Sheet: `caveman.character.proposal.json` (new; there is no register sheet).

## Status 20.10. (night): Lorekeeper, Toy Soldier, uniqueness
**#4 Mission Control: Georg's idea is the Lorekeeper.**
- Role: guide, mentor, meta figure and quest giver. FrizzleBob, as the player avatar, receives the quests.
- Entered in the Writers' Room as VORSCHLAG; FrizzleBob is kept under `previousPerformers`.
- Consequence: *Kraziest Philosophical Kayfabe-Theories* (Lorekeeper so far) becomes free.

**#6 Caveman: one more candidate.** *Kraziest Philosophical Kayfabe-Theories* (Descartes' doubt demon, The Room of the Mind …). He is the critical thinker with Plato's cave in his name. The deck is among the 60.
- Chain if Georg agrees: Lorekeeper → Mission Control, Caveman → Philosophy, *Biology of Rebellion* free.
- On Dionysos: *Wine, Woad & Warrior Chiefs* (Barbarian, longhouse with wine barrels) is the only deck among the 60 that mentions wine, and it is about Gauls, not Dionysos.

**#7 Toy Soldier (Georg): "could work for the geopolitical decks, but not all of them; every song/deck/character should be as unique as possible."**
- Currently resident of *Symphonic Savagery* (props: rifle, trumpet, gift box; one texture).
- Geopolitical decks among the 60:
  - *Power Pyramid Plumbing & Global Psyop Wrestling*: Round Table, NATO "Peacekeepers", Gladio, Paperclip, Gehlen; Frost Golem.
  - *Secret Spy Suplexes*: Marksman.
  - *Ruled by Organized Kayfabe-Krime*: Orc Raider ×2.
  - *Federal Kayfabe*: Santa.
  - *The Kayfabe Money Trail: 9/11*: Hoarder.
  - *Siege Kompendium*: Monstrosity, military history.
- WS-Song proposal: Toy Soldier → *Power Pyramid Plumbing*, as the wind-up pawn on the power pyramid's map table.
  - Frost Golem becomes free.
  - *Symphonic Savagery* would need a new resident, or the Toy Soldier stays there with the trumpet and the geopolitics deck gets someone else. Georg decides.

**Uniqueness audit (60 songs, 55 distinct models).** The same model is used several times:

| Model | Count | Decks |
|---|---:|---|
| MagicalGirl | 3 | 1001 Nights, Grimms 02, Coming-of-Age |
| MonsterCostume | 3 | Brain-Flipper, Monopolies Vol. II, How To Stage A Cover-Up |
| Superhero | 2 | Cinematic 2, MedKayfab Clinical Cases |
| Witch | 2 | Jung & Shinn, Romantic Kayfabe |
| BlackKnight | 2 | Ethics (with Paladin), Nibelungen |
| Tiefling | 2 | Mind Traps, Plot Pusher Posse |
| Hoarder | 2 | Museum of Modern Mess, Money Trail 9/11 |
| GothGirl | 2 | Dream-Freud, Ego Mania |
| Norman | 2 | Bullshit Jobs, What Work Was For |

- Norman is decided by Georg; the two decks belong together.
- GothGirl × 2 fits her new profile (dark psychology).
- Texture variants (e.g. MagicalGirl) can differentiate, but they don't make a figure unique.
- Free slots to fill this: Frost Golem (if #7), the Caveman shift (#6), and figures from the Dramatis Personae: Lord Hunky, Lady Dory, Brain-Cyborg, Vampire.
- Proposal: *How To Stage A Cover-Up* → Goth Girl? It fits conspiracy, psyops and sarcasm, but it would be her third deck. Alternatively Lady Dory (keeper of secrets on the UFO). Georg decides.
