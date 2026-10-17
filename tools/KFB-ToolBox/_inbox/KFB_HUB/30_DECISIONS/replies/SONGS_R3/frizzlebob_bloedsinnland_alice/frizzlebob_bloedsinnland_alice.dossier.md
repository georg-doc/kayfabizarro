# Dossier wr1: FrizzleBob's BlödsinnLand Deck – Alice ("Alice in Blödsinnland")

- **deckId:** `frizzlebob_bloedsinnland_alice`, **provisional**. No registry JSON and no `pdf.json` on gh/main, so this is the exception case under V-377.
- **Card truth source:** PDF `Comic Seminar PDFS/MODIFIED PROTOTYPES (PDFs, uncompressed, v05)/FrizzleBob’s_BlödsinnLand_Deck ALICE - ADD.pdf`, 15 landscape pages. The PDF has no text layer. Text came from OCR (macOS Vision on PDFKit renders at 4x). Every card was then checked against the rendered page images, which fixed OCR errors such as "Ereathing" → "Breathing" and the truncated "re:/ower:" on the Visitor card.
- **Card numbers 1–30 are provisional:** they follow the printed sheet order A→K, since the cards have no printed numbers. `mappingVerified:false`.
- **Image motifs** come from my own look at the rendered pages (`motifSource: PDF page render`, `visualVerified: true` at ~900 px). There is no artworkPrompt JSON.
- **Character count:** 4905 (Python `len()`, newlines included), under the 5000 limit.

## Purpose and thesis
The deck is printed as "Vol. 3.2: The Expansion" for Kayfabizarro. Subtitle: "A Psychedelic Card Game for Crazy Animals (Who Think They Are People)". Cover: "Cost: your sanity", "HUMANS BANNED! (Unless tasty)". Rules page: Alice is banned and appears only as "The Visitor", a cryptid anomaly ("Do not look directly at her"). The one new rule, BLÖDSINN! (Nonsense Check), turns the core Kayfabizarro interrupt upside down. In the base game you call Blödsinn when a story doesn't hold up (rules v05, Almanac: "Sinnfeld collapse"). Here you yell it when the story gets **too logical**: "It is not an accusation. It is a reset button. Laugh. Rewind. Continue."

**Thesis:** meaning is kayfabe. Carroll's court, tea party and taxonomy are institutions that perform logic. The punchline aims at authority: the Queen's power is "made of cardboard", and the evidence is a nonsense poem. The ending hands the cards to the players: "Did we win? Who cares! You have the cards. ... Create your own Blödsinn."

## Card inventory (as printed)
| # | Sheet / page | Card | Lore (or Goal/Risk) | Power (satire only) | imageMotif |
|---|---|---|---|---|---|
| 1 | A The Guides / p3 | The White Rabbit | Late for a very important date. Possibly a hallucination. | ANXIETY INDUCER: force the current Quest to change | wide-eyed rabbit, melting pocket watch, fan |
| 2 | A / p3 | The Caterpillar | Demands you explain who you are. Rejects your answer. | THE HOOKAH HAZE: force a player to swap Actor card | blue caterpillar on mushroom, question-mark smoke |
| 3 | A / p3 | The Cheshire Cat | We're all mad here. I'm just honest about it. | GASLIGHT: remove a card, claim it was never there | pencil-sketch cat fading, huge grin |
| 4 | B The Madness / p4 | The Mad Hatter | Murdered time. Now lives in eternal 6:00 PM. | FILIBUSTER: speak without breathing | weasel in 10/6 top hat pouring spilling tea |
| 5 | B / p4 | The March Hare | Aggressive hospitality. Takes "best butter" very seriously. | FORCED TEA: force an unwanted Tool card | frantic hare flinging teapot |
| 6 | B / p4 | The Dormouse | Breathing while sleeping is the same as sleeping while breathing. | NARCOLEPSY: end the Scene | dormouse asleep inside teapot; margin "Twinkle, Twinkle, Little Bat!" |
| 7 | C The Management / p5 | The Queen of Hearts | Verdict first, sentence later. OFF WITH THEIR HEADS! | EXECUTION: remove an Actor permanently | lioness in playing-card gown, heart scepter |
| 8 | C / p5 | The King of Hearts | Pardons everyone when the Queen isn't looking. | PARDON: cancel the Queen's action | tiny mouse, oversized crown over eyes |
| 9 | C / p5 | The Duchess | Everything has a moral, if you can find it. Usually involves pepper. | MORALIZING: invent a nonsense rule for one round | toad duchess holding piglet baby |
| 10 | D The Visitor / p6 | The Visitor (The Anomaly) | A cryptid ape. Changes size rapidly. Ask the Dodo for classification. | DIMENSIONAL SHIFT: describe scene as Giant or Micro | TV-static girl silhouette, galaxy belly, "TOP SECRET"; pigeon shouting "SERPENT!" |
| 11 | E Down the Hole / p7 | The Rabbit Hole | (location) | GRAVITY OPTIONAL: retrieve discarded cards as they fall | vortex of cupboards, clocks, marmalade jar |
| 12 | E / p7 | The Pool of Tears | (location) | SALTY: all communication while holding your nose | dodo and mouse in waves |
| 13 | E / p7 | The Hall of Doors | (location) | LOCKED OUT: no Quest until you solve a riddle | corridor of doors, golden key on glass table |
| 14 | F Domestic Disturbances / p8 | The Duchess' Kitchen | (location) | PEPPER SNEEZE: sneeze before speaking | flying pans in pepper smoke, Cheshire grin |
| 15 | F / p8 | The Mad Tea Party | (location) | TIME LOOP: repeat the previous player's last sentence | long table, empty chairs, teapot |
| 16 | F / p8 | The Rose Garden | (location) | COVER UP: overwrite a Scene card at no cost | white roses dripping red paint, card soldiers with brushes |
| 17 | G The Courtroom / p9 | The Croquet Ground | (location) | LIVE AMMO: Tools might run away | flamingo mallets, hedgehog balls |
| 18 | G / p9 | The High Tribunal | (location) | KANGAROO COURT: logic forbidden; if a story makes sense, call "Blödsinn!" | jury box of animals with slates; guinea pig in sack "(suppressed)" |
| 19 | G / p9 | The Mock Turtle's Rock | (location) | MELANCHOLY: tell all stories with a deep, heavy sigh | weeping calf-headed turtle on sea rock |
| 20 | H Consumables / p10 | Suspicious Cake | (item) | GROW: Actor becomes Giant, can intimidate the King | "EAT ME" cake |
| 21 | H / p10 | Unknown Bottle | (item) | SHRINK: Actor becomes Micro, hides inside other cards | "DRINK ME" bottle |
| 22 | H / p10 | The Mushroom | (item) | MUTATION: coin flip; heads grow, tails shrink, edge: neck like a serpent | bitten red fly agaric |
| 23 | I Weaponized Nonsense / p11 | The Vorpal Flamingo | (tool) | BLUNT FORCE: "strike" a conversation, change topic | grumpy flamingo with baseball bat |
| 24 | I / p11 | The Squeaky Slate-Pencil | (tool) | ANNOYANCE: force a player to write instead of speak | slate reading "SCREECH" |
| 25 | I / p11 | The Treacle Well | (tool) | STICKY TRAP: Actor cannot leave the Scene | treacle pit, teapot and bowler stuck; "Humbug!" |
| 26 | J Impossible Tasks / p12 | Quest: Paint the Roses Red | Goal: conceal a mistake before the Queen arrives. Risk: decapitation. | – | paint bucket over white roses |
| 27 | J / p12 | Quest: Find the Gloves | Goal: help the White Rabbit find his accessories. Risk: mistaken for housemaid 'Mary Ann'. | – | pair of white gloves |
| 28 | J / p12 | Quest: Solve the Riddle | Goal: answer "Why is a raven like a writing desk?" Risk: no answer, infinite loop. | – | raven on writing desk |
| 29 | K The Trial / p13 | Quest: Who Stole the Tarts? | Goal: prove innocence (or guilt). Risk: the Knave is guilty, but the evidence is a poem that makes no sense. | – | tray of heart tarts, card-Knave running |
| 30 | K / p13 | Quest: Give Evidence | Goal: recite a poem correctly. Risk: words come out wrong ("Twinkle Twinkle Little Bat"). | – | lectern, scroll of "Twinkle Twinkle Little Bat" |

Non-card pages and printed elements: p1 cover; p2 rules (Blödsinn rule, "Stay fluffy!"); the p13 FrizzleBob Note ("Pro Tip: If the Queen gets angry, just remember she's made of cardboard."); p14 the Borromean Die, a constructible with faces LATE! / BLÖDSINN! / OFF WITH HEAD / CURIOUSER / TEA TIME / WAKE UP; p15 "THE END? NO. WAKE UP!", "Did we win? Who cares! You have the cards."

## Page/stanza table
Each printed sheet is one stanza. Sheets carry 3 cards, and Sheet D carries 1 card plus its beat.
| Stanza | Sheet (page) | Cards | Micro-story |
|---|---|---|---|
| Intro | Cover + rules (p1–2) | – | wrong hole; humans banned unless tasty; the inverted law (sense → yell Blödsinn) |
| 1 | A The Guides (p3) | 1–3 | three guides, none of them helpful: one is late, one rejects you, one deletes cards |
| 2 | B The Madness (p4) | 4–6 | tea at an eternal six o'clock; Dormouse plants "twinkle, little bat" |
| 3 | C The Management (p5) | 7–9 | power structure: verdict-first Queen, blind pardoning King, invented morals |
| 4 | D The Visitor (p6) | 10 | **turn:** the banned human appears; the Pigeon says serpent; the Dodo's classification starts to make sense → **Blödsinn! Rewind.** |
| 5 | E Down the Hole (p7) | 11–13 | the rewind as a literal fall; the riddle-locked doors are set up |
| 6 | F Domestic Disturbances (p8) | 14–16 | callbacks: Cheshire grin "saw nothing", tea party still at six (performed loop), roses painted over |
| 7 | G The Courtroom (p9) | 17–19 | the court: equipment walks off; **Blödsinn becomes law** (gang shout); sighing testimony |
| 8 | H Consumables (p10) | 20–22 | size change hands the Visitor's power to "you"; Mushroom edge → "So the Pigeon was right" (callback payoff) |
| 9 | I Weaponized Nonsense (p11) | 23–25 | nonsense as weapons: topic change, forced writing, nobody leaves |
| 10 | J Impossible Tasks (p12) | 26–28 | cover-up quest (callback Rose Garden), Rabbit late again, the riddle loop → "the doors stay shut forever" (callback Hall of Doors) |
| 11 | K The Trial (p13) | 29–30 + FrizzleBob Note | nonsense poem as evidence (Dormouse callback), "Verdict first!" cut off; "somebody at the back is growing"; cardboard tip → "You're nothing but a pack of cards!" |
| Outro | End page (p15) | – | wake up; "You have the cards"; final Blödsinn shout; Stay Fluffy! |

## Arc
- **Build-up:** the guests are banned, the guides misguide, the tea is eternal, and management rules by verdict-first. Each card sells its madness as normal.
- **Turn / reset (middle):** the Visitor, the one human, gets studied. The Dodo's file "adds up", sense is about to break out, and the room yells Blödsinn. The rewind becomes the literal fall down the Rabbit Hole, where discarded cards fall back.
- **Escalation:** the callbacks pay out (Cheshire grin, six o'clock, painted roses). The court makes Blödsinn its law. The consumables pass the size-shifting to the listener. The Pigeon's "serpent", which sounded absurd, turns out to be correct.
- **Payoff:** the riddle has no answer, so the doors never open, so the only way out is through the trial. The evidence is the wrong poem from stanza 2. The Queen's verdict is interrupted by someone growing at the back (the Visitor, set up by cake and Dimension Shift) and by FrizzleBob's single tip. Then comes Carroll's own exit line, "You're nothing but a pack of cards!", which is literally true of a card game: authority was cardboard all along. The ending: wake up; you hold the cards; whenever it makes sense, yell Blödsinn.

## Openers (all unique; checked against OPENER_ARC_R2 and the SONGS_R3 siblings)
Tick, tick · Smile · Six o'clock sharp · Shh · Head office (pun: heads) · Behind her back · Eyes down · Down we go · Try the doors · Bless you (sneeze setup) · Still six o'clock (callback) · Game on · Hear ye · Eat me · Drink me · Pick a side · Change of subject (Vorpal Flamingo changes topics) · Sit down · Quick, the brushes · Late again (callback White Rabbit) · Order, order · Take the stand.
Lines with no opener, left to breathe: Caterpillar, March Hare, Duchess, Pool of Tears, Rose Garden, Mock Turtle, Slate-Pencil, Solve the Riddle.
Removed during the check: "Anyway" (an R2 pool opener) and "All rise", "Pro tip", "Top secret" (taken in the 9/11 and Freud songs). Also avoided "Admission/Price:" phrasing (Carnival, Trust).

## Brief compliance notes
- FrizzleBob appears exactly once (the cardboard tip, which is printed on the deck). There is no Meta-Message and no "Welcome to …" line. Comic Card Karaoke is not used.
- POWER appears only as punchlines (Cheshire "never there", Dormouse "scene over", Duchess "new rule", Tribunal shout, Mushroom edge). Nothing is recited as a rule.
- "Blödsinn" is kept as a brand word and hook shout, glossed once as "Nonsense-Land". If Suno mangles the umlaut, fall back to spelling it "Blurdsinn!" in the shout lines (not applied in wr1).
- Quoted Carroll phrases ("We're all mad here", "verdict first, sentence later", "no room", "snicker-snack", "pack of cards", "Twinkle, twinkle, little bat") are public domain (1865/1871) and printed on the cards themselves.

## Sources
- PDF above (OCR + page renders, scratchpad only, nothing written outside the output folder).
- `MD BOOKLETS (drafts)/01 kayfabizarro-rules-v05.md` (Blödsinn interrupt: "a correction, not an attack"), `02 kayfabizarro_frizzleBob-almanac_v01.md` (Blödsinn as "Sinnfeld collapse", a formal interrupt for everyone).
- `30_DECISIONS/DECISIONS.md`: V-361, V-362, V-364/V-366, V-372, V-373, V-377. Brief `SONGS_R3/WRITERS_ROOM_BRIEF_R3.md`.
- Repetition check: `replies/OPENER_ARC_R2/*.suno.txt`, `replies/SONGS_R3/*/*.suno.txt` and the sibling style files (circus funk/second-line, neo-soul/calypso, slow funk, electro-swing, Arabic funk, Balkan funk were already taken).

---

## wr2 revision (after WS0 blind review: listen 6 · stand-up 7 · spirit 7.5)
- **File:** `frizzlebob_bloedsinnland_alice.wr2.suno.txt` (wr1 is kept). **Character count: 3448** (Python `len()`), down from 4905.
- **Kept, since the review said these work:** the Blödsinn engine (intro law → mid-song reset → court shout → final shout), the Pigeon turn ("serpent" → "So the Pigeon was right"), the courtroom crescendo, and the "pack of cards" payoff. The page/stanza table and arc are unchanged.
- **Groove:** every card line now follows **"Name: claim."** in short sentences, with at most one image. The semicolon stacks and three-part art descriptions are gone. Opener tags now end in "." or "!" instead of a colon, so no line carries two colons.
- **Performed instead of recited:** Cheshire ("And I was never here."), Rabbit Hole ("isn't that the marmalade you threw away?"), Unknown Bottle ("small enough to hide in a teacup"), Hall of Doors ("every lock whispers, riddle first"). The intro ending is now "And we fall all over again." The outro no longer says "Cut them out".
- **The Visitor (hinge card):** "the girl who fell in. I change size. Don't look directly at me." This tells the listener who she is without naming the banned Alice.
- **Mock Turtle:** one sigh only, then "every story ends in soup. Beautiful soup."
- **Paint the Roses Red:** "three gardeners, one bucket. She's coming round the corner. Faster, faster!" The Rose Garden keeps the white-to-red image ("Don't touch, still wet").
- **White Rabbit:** the Disney lyric is replaced with Carroll's "oh my ears and whiskers, how late it's getting!"
- **Caterpillar:** "who are you?" and "Wrong answer." now sit on separate lines.
- **Outro:** "The End? / No." is dropped. It now runs Wake up → Did we win? → Who cares. → You're holding the cards. → Blödsinn! → Stay Fluffy!
- **Openers:** 14 out of 30 card lines carry one: Smile · Shh · Head office · Eyes down · Down we go · Still six o'clock · Hear ye · Eat me · Drink me · Change of subject · Quick, the brushes · Late again · Order, order · Take the stand. These were cut: Tick tick, Six o'clock sharp, Behind her back, Try the doors, Bless you, Game on, Pick a side, Sit down.
- **Phonetic fallback:** if Suno mispronounces "Blödsinn", spell the shout lines **"Blerd-zin!"**. The lyrics keep "Blödsinn".
- **songlines.json:** the wr2 entries (`version: "wr2"`) come first; the wr1 entries are kept below them for traceability.
