# KFB-NARRATIVE-CORE-RECON-01 · CANON_DELTA_LEDGER

Every contradiction found between sources, with both sides quoted or paraphrased from the file, the consequence for a build, and who decides. **Nothing here is resolved by the recon.** "Default for SIM-01" says what the first build would do *unless Georg decides otherwise*; it is always the public canon when the public canon speaks.

Sources are abbreviated as in `SOURCE_MAP.md`: **PUB** public rules · **SIM** Simulator v0.8 · **GM** Gameplay Engine (GM_PROTOCOL/ENGINE_SPEC_v2) · **M50** NIE freestyle rules · **OPM** NIE OPERATION_MODES · **CE** CritEngine · **S01** Sprint-01 YAML bundle · **CtP** Hunky & Dory CtP YAML · **HDT** `hunky_dory_dialogue.ts` · **NOS** NOS/AOS handoff.

## A · Required deltas (from the brief)

### D-01 · Public rules vs Simulator v0.8

| Topic | PUB | SIM v0.8 |
|---|---|---|
| Who tells | each player, as their Actor, every turn | one LLM ("das LLM ist der Tisch") tells the whole episode |
| Story Mode | rolled every turn, "not optional, commit" | player picks one **dominant** mode; prompt: ≥5 of 8 beats in it |
| King | rotating player on the left, one verdict per story | FrizzleBob is permanent King and narrator (`d` per beat) |
| Quest Die path | moves only by verdicts; can fail below 1; reaching 6 → *next* turn is Finale | prompt forces 8 beats from 1 to exactly 6, never below 1; sanitizer sets last `die` = 6 |
| Finale | "the return", told by the next player; loot is the table's drawings | four LLM readings (Plan / Humbug / Payout / Blödsinn) + player pencil synthesis |
| Card Ritual | Show · Spin · Sell for every card | not modelled; cards go into the seed prompt |
| Social calls | four calls, King rules | none |
| Solo | public solo gears A–D, Quest Die starts at **3** | v0.8 calls itself "Solo Gear E"; the public page lists no gear E |

Consequence: v0.8 is a **solo director/demo**, not a rules engine. Its finale (four readings + pencil) is a design asset with no rule counterpart.
Default for SIM-01: rules from PUB; v0.8 reused for corpus, Match Card, beat/finale JSON hygiene, UI tokens, four-readings finale as an *optional* after-show. Decision: **Georg** (G-01, G-02).

### D-02 · Five visible beats vs eight simulator beats

PUB turn = 5 beats: Roll mode · Play card (+ Ritual) · Tell · Draw · Verdict. M50 (older NIE rules) = 8 steps: Draw · Roll · Choose · INTRO · Heckling · Scene · BLÖDSINN check · Quest Pressure. SIM "8 beats" are **8 story panels of one episode**, not turn steps. GM = 5 beats but draws to 4 *before* playing and has an extra Intro Ritual "Name it · Claim it · Power it".
Three different things share the word "beat". Default for SIM-01: a *turn* has the 5 PUB beats; SIM panels become `story_beat` events inside the Tell beat. Decision: none needed if the naming split is accepted; listed in G-03 for confirmation.

### D-03 · Six Story Modes vs six seats

PUB: Story-Mode Die has six faces; "1–6 people". Layer Zero maps the six modes to six FrizzleBob voices (Tragic→bedside, Comic→mensch, Absurd→rapgod, Heroic→carny, Mystical→fixer, Forbidden→analyst). GM roster has six players. Nothing in any source binds a seat or persona to a mode. The coincidence of six is numerical only.
Default for SIM-01: `seat`, `persona`, `storyMode` are independent axes (as the brief demands). The Layer Zero voice map applies only when FrizzleBob narrates alone. Decision: none; recorded so nobody "maps" them later.

### D-04 · Six wanted sim players vs eight planned crits

CE plans **8 main crits** (FrizzleBob, Hunky, Dory, Mr Shark, Hobbes, Dr Checkov, Roboto, Norm). The v0.2-delta renames the set to Uncle FrizzleBob, Lord Hunky, Lady Dory, **Aunt Sophia, Mr Roboto, Mister Bommel, Miss Jenny, NPC Norman** (Shark/Hobbes/Checkov gone, Hobbes as Bommel's mask). S01 delivers exactly that renamed 8. GM's playable cast is a **different six**: FrizzleBob, A.I.Liza, Stef.A.I.n, Doc H.A.I.ner, KA.I.Fabster, Nad.A.I.a. CtP adds GodGPT and MephistoBro.
So there are at least **three cast lists**. Max seats per PUB = 6; 8 crits can never all sit at one table.
Default for SIM-01: Hunky, Dory, FrizzleBob as the brief requires; other seats Human or empty. Decision: **Georg** (G-04 which cast list is the persona canon; G-05 does NPC Norman sit at the table or only react).

### D-05 · Five Advisory-Council archetypes vs sixteen Roundtable positions

NIE advisory council: exactly 5 advisors (Prophet, Investigator, Trickster, Historian-Poet, Mediator), decision-support. NIE roundtable: 16 positions (14 speaking + Silence Filter + Referee), satire-first. START_HERE calls the roundtable "14 cognitive archetypes". These are **lenses/formats**, not seats and not crits. Neither maps onto the crit casts.
Default: both stay NIE output formats reachable through the Lens layer; not persona sources. Decision: none for SIM-01; G-07 for later.

### D-06 · CritEngine as planned SSOT vs its implementation state

CE `CLAUDE.md` declares SSOT for engine, schema, 8 archetypes, 8×8 matrix. Verified 2026-10-02: `engine/`, `matrix/`, `archetypes/`, `schema/` contain only `README.md`. The boot decision says "Daten vor Code" and the YAMLs are still awaited. The YAMLs that do exist (S01) live in `FractalAlmanacComicCreator/sprints/…`, outside CE, with an open revision note (three visual drifts, missing `masks`, missing Bommel↔Roboto axis).
Status: **CritEngine = PLANNED / INCOMPLETE.** No runtime owner may claim "CritEngine says …" today.
Default for SIM-01: personas are read through a thin adapter from a *pinned candidate file*, marked `canon:false`, so that a later CE drop replaces the data without code changes. Decision: **Georg** (G-06 accept S01 as the interim candidate or wait for CE Sprint-02).

### D-07 · Hunky & Dory: inbox YAML vs validated crit profiles

Four incompatible Hunky/Dory definitions:

| Source | Hunky | Dory |
|---|---|---|
| CE archetypes README | Senex | Puer |
| CtP YAML v6.5.2 (`inbox/`) | Lord Hunky, *Reality Janitor*, control-addicted architect, interjections "damn/hell/wait" | Lady Dory, *Moral Inquisitor / archivist*, "indeed/nay/verily" |
| HDT + NIE M66 | grumpy nihilistic technocrat, cold admin-speak | empathic saboteur, naive-poetic "weaponized un-knowing" |
| S01 + revision note | Lord Hunky, blue stalk-eyed alien (visual canon per note) | Lady Dory, red/orange blob alien |

The CtP file is a different product (*Cancel This Planet!*) with GodGPT and MephistoBro; it is not validated against any CE schema (there is none yet).
Default for SIM-01: none of these is canon; SIM-01 uses one pinned profile per persona and records which source it came from. Decision: **Georg** (G-04).

### D-08 · NIE PLAY mode vs KFB-specific rule and quest state

OPM PLAY: "Set the Quest Die to 3 (neutral)", "Run the Freestyle session (8-step Turn Structure)". PUB: multiplayer Quest Die starts at **1**; **3** only in solo; 5 beats. M50: Quest Pressure +1 normally, +2 if mode matches quest value, +1 if another Actor joins (automatic, no King). PUB: King's discretionary +2/+1/0/−1. M50 heckling call **HUMBUG** and "KayfaBONGO = wild story suggestion"; PUB KayfaBONGO = "you narrated your Power as a mechanic". M50 Finale: active player resolves when pressure hits 6; PUB: the *next* player's turn is the Finale. M50 intro "Name It · Claim It · Threaten It"; PUB "Show it · Spin it · Sell it"; GM "Name it · Claim it · Power it".
NIE also carries no persistent quest state; it produces text, not state.
Default for SIM-01: NIE is *never* the rule source; M50 is LEGACY for rules. NIE can feed seeds (Tafel) and lenses. Decision: **Georg** (G-08 whether M50 gets a "superseded by #kfb" note in the NIE).

### D-09 · Status of existing outputs

| Artefact | Classification | Why |
|---|---|---|
| Public #kfb rules | **CANON** | Brief's anchor |
| Deck JSON SSOT | **CANON (content)** | One corpus, two surfaces |
| Layer Zero | **CANON-SUPPORT** (style) | Used by SIM and GM alike |
| Simulator v0.8 | **DONOR** | Works, but rule-divergent (D-01) |
| Gameplay Engine (GM v2) | **DONOR** | Closest to PUB; small drifts (D-12) |
| `crit_memory.py` | **DONOR** (memory candidate) | Implemented, bounded, but not the decided memory owner |
| NIE M49 / field solver / Warburg / Tafel | **CANON-SUPPORT** | Theory and seed models |
| NIE M50 freestyle rules | **LEGACY** (for rules) | Superseded by PUB |
| Advisory council / roundtable / Quill flows | **DONOR** (formats) | Lens/output layer |
| CritEngine | **PLANNED / INCOMPLETE** | D-06 |
| S01 YAML bundle | **CANDIDATE** | Not validated, revision open |
| CtP Hunky & Dory YAML | **DONOR** (other universe) | D-07 |
| `hunky_dory_dialogue.ts` | **DONOR** (LLM flow) | Output format consumer of Tafel |
| FrizzleCrits runtime pick (Electron MVP) | **LEGACY** for this scope | Superseded by spin-out |
| PR #305 | **DONOR** (ambient speech kernel) | Deterministic, tested; operator-name conflict D-11 |
| PR #306 | **CANDIDATE** (presentation consumer) | Browser PASS, no human acceptance |
| PR #308 | **LEGACY** (stopped) | Preserved recovery |
| PR #310 | **CANDIDATE** (embodiment source gate) | Open |
| PR #272 | **CANDIDATE** (memory/AIDA design) | Design only |
| Mnemosyne Quill 3.1 app | **UNAVAILABLE** | 0-byte files |

## B · Additional deltas found during the recon

### D-10 · Verdict rules inside the existing engines

- GM: "+2 Hard-Push, max 1× pro Episode". PUB: "+2 use sparingly", no hard cap. GM's own delta file already flagged this as unverified.
- GM: Finale turn has no King verdict and no die move. PUB: Finale uses "same 5 beats", silent on whether the verdict happens.
- GM and PUB agree on: next player judges, BLÖDSINN upheld → no move, below 1 → Quest Fail.
Default for SIM-01: no +2 cap (PUB); Finale verdict recorded as `verdict` with `dieDelta:null`. Decision: **Georg** (G-09).

### D-11 · Social-call names reused with different meanings (PR #305)

| Call | PUB meaning | #305 operator meaning |
|---|---|---|
| KayfaBINGO! | "That landed", active player draws an extra card | synergy, "hand closure to player" |
| KayfaBOGGLE? | "I'm lost", one concrete question, 1–2 sentence answer | REFRAME / CATEGORY_SHIFT of the prior utterance |
| KayfaBONGO! | Power narrated as a mechanic → restate as story | "hold frame": share material with the prior utterance |
| BLÖDSINN! | rule broken, King rules, no die move | OBJECT / COLLISION transform |

Same words, different semantics, in the same universe. If Residents later shout "BONGO" in the world with the #305 meaning while the card table uses the PUB meaning, players learn two games.
Default: the event schema keeps **two separate enums** (`socialCall` = PUB semantics; `tripletOperator` = #305 semantics) and never maps one onto the other silently. Decision: **Georg** (G-10 rename the #305 operators or accept the double meaning).

**CORRECTION 2026-10-03 (Georg + code re-read): D-11 is not a conflict; G-10 is closed, no rename.** Georg: the four calls are social reactions in every context (table game and world), and in the Resident chat they are the player's Monkey-Island answer options: three standard reactions plus BLÖDSINN as reject/cancel. They link no Card and are not actions on Cards. Re-reading `resident-chatter-adapter.v0.1.mjs` @`5b595a07`: `socialOperator` is an **input** (the call that was made); it only filters and weights which pool Triplet the Resident answers with (BINGO: any line, prefers SYNERGY, hands closure to the player · BONGO: must share material with the previous line · BOGGLE: shares material and reframes / shifts category · BLÖDSINN: COLLISION / OBJECT line). That is the reaction to the call, consistent with Georg's intent. The table rules add game effects on top (BINGO draws +1 card, BLÖDSINN upheld = no Quest-Die move); those apply only at the card table. The event schema may keep `socialCall` as one enum for both surfaces.

### D-12 · Card Ritual and hand size drift

PUB: Ritual = Show · Spin · Sell; hand 3; draw *after* telling, back to 3; KayfaBINGO draws +1. GM: Ritual "Name it · Claim it · Power it"; draw to 4 *before* playing. M50: draw first, hand 3, Wrestler Intro Name/Claim/Threaten.
Default for SIM-01: PUB. Decision: none (canon is clear); listed so GM code is adapted, not copied.

### D-13 · Two memory designs, zero memory owner

`crit_memory.py` (implemented, per-crit, card-game focused: couldNotHold, signatureWins, kingStance, calls; ON for play / OFF for blind QA) vs PR #272 "Resident Social Memory" (design: witness-specific Lean Memory, social threads, POI, AIDA loop). #305 points to #272 as the memory owner; GM points to `crit_memory.json`. The brief also wants "Lean-Memory-Receipts".
Default for SIM-01: SIM-01 emits `memory_receipt` events only and writes **no** store. Decision: **Georg** (G-11 which design owns memory; recommendation in OPEN_DECISIONS).

### D-14 · The brief's single donor vs two real donors

The brief says "Simulator v0.8 as donor". The gameplay engine (GM v2) is a better fit for seats 1–6, rotating King, social calls and replay logs; v0.8 is better for corpus handling, Match Card, finale, look. Using only v0.8 would rebuild the multi-seat loop that already exists in GM.
Default for SIM-01: both donors, with explicit per-contract mapping (see `NARRATIVE_RUNTIME_ARCHITECTURE.md` §6). Decision: **Georg/WSA** (G-02).

### D-15 · LLM in the hot path

SIM: two LLM calls per episode (the whole story is LLM). GM: LLM tells every turn. Brief: "kein Dauer-LLM im Render- oder Gameplay-Hot-Path". Rules state (die, King, deck, hand, stage, calls) can be fully deterministic; the *Tell* text for a simulated seat needs either an LLM (async, out of the frame loop) or authored/Triplet material.
Default for SIM-01: deterministic rules engine; sim-seat Tell from a pluggable `TellProvider` (deterministic template/Triplet provider by default, optional async LLM provider) whose output is validated and logged; replay never re-calls the LLM. Decision: **Georg** (G-12 whether SIM-01 ships with an LLM provider at all).

### D-16 · Smaller documentation drifts (no decision needed)

- NIE file count: START_HERE "158 active files" vs matrix "218 files".
- Mnemosyne Quill: "13 Genkit flows" header vs 16 flows listed.
- Roundtable: "14 cognitive archetypes" (START_HERE) vs 16 positions (file).
- v0.8 corpus 712 cards (v1.3) vs 711 (v1.4, one duplicate removed).
- Simulator runtime voice is hard-wired to `claude-sonnet-4-6` in `apiCall()`.

## C · Stop-rule check

| Stop rule | Triggered? |
|---|---|
| Source claimed but not found | **No.** All 20+ named sources exist. One adjacent source is unreadable (Mnemosyne Quill 3.1, 0 bytes) and is marked UNAVAILABLE, not used. |
| CritEngine would have to appear finished | **No.** Marked PLANNED / INCOMPLETE everywhere. |
| Rules would have to change silently | **No.** Every divergence is listed above with PUB as default. |
| A second narrative, dialogue or memory owner would arise | **Not in the recon.** Risk points named: D-11 (dialogue), D-13 (memory). The architecture keeps one owner per concern. |
| Scope creep into Open World | **No.** World PRs only noted. |
| Two failed repair passes | n/a (no build) |

## D · Corrections after Georg's review (2026-10-02)

### C-01 · Telling is done AS the Actor card (recon error, now a rule test)

Georg: the player never narrates as himself. PUB beat 3: "Speak as your Actor, first person, you don't play your Actor, you are them." The persona at the seat (Hunky, Dory, FrizzleBob, human) is the **performer**; the **Actor card** is the speaker. The persona only shapes *how* the card is played (cadence, humour vector, stance).
The recon's own demo violated this (its invented sample had the persona speak as itself; that page is withdrawn), and so do stored GM runs (`crit_memory.json` best line: "I am FrizzleBob, and the Correct Nonsense …"). The GM tell frame "I am [actor], …" is correct, but generated text drifted.
Consequence for SIM-01: hard rule test: `story_told.speaker` = the seat's current Actor card; a tell that names the persona as the first-person speaker is rejected. The event schema already carries `actor` on `story_told`.

### C-02 · CritEngine status was under-reported (D-06 / D-07 corrected)

The recon read only the folders. The CritEngine Living-Doc `livedocs/main-chat-v0_1.html` (v0.9, 2026-05-27) records: decision `04_BIBLE_ANCHOR` (Crit-Engine handover v0.1 = canonical SSOT for schema and cast, cast locked to 8 poles), H&D consolidation resolved 2026-05-26, **ChatGPT Sprint-01 bundle adopted** (runtime formula, `repair_affinities`, `symbolic_neighbors`, title as functional role), six conflict axes incl. Lord Hunky ↔ Lady Dory "Control vs. Intuition · toxic_marriage · fluff_incident_guilt", CtP kept as `ctp_voice_anchor`. Pending Sprint-02: split the bundle into `archetypes/*.yaml`, add `tier`/`masks`/`ctp_voice_anchor`, fix visuals (Hunky blue stalk-eyed alien `#4a8aba`, Dory red/orange blob `#c44a4a`).
Corrected status: **CritEngine = content adopted, files not yet split, resolver not built.** Persona source for SIM-01 = the adopted Sprint-01 YAML (Georg, 02.10.). The four Hunky/Dory versions in D-07 are not equal rivals: Sprint-01 is adopted, CtP is the voice anchor, HDT/M66 is the older Mnemosyne-app characterisation.
The Living-Doc also already names this exact use case: "Im Gameplay-Mode wählt der Spieler einzelne oder mehrere Crits aus dem 8-Pole-Roster als Sim-Player", with a planned `gameplay.*` layer per crit YAML (`inbox/BRIEFING_2026-05-23_kfr-bizarro-gameplay-sandbox.md`).

### C-03 · Decisions taken by Georg (2026-10-02)

G-02: Gameplay Engine is the base, together with Simulator v0.8. G-06/G-04: personality from the CritEngine YAML (Sprint-01, adopted), not central for SIM-01. Already recorded in project memory (July): "one engine, two surfaces; the Simulator consumes the engine contract, does not fork it" (Run-Spec `{deck, players[], cardPool, mode}`).


### D-17 · Speech invariants that drifted out of the first pass (2026-10-02)

Georg: semantic Triplets are the default speech (shared pool, #305 kernel, Town J-13), the player interaction is Monkey-Island selectable lines with collectible retorts (Town J-13/J-14, Card Relay §5–6), everything in-world is English (WS1 A3/A5), and Claude-written sample dialogue must never be handed on in briefs (it reads as canon and drifts). The first pass ignored the Triplet/Monkey-Island grammar in its architecture prose and put invented German lines into the decision page. Correction: the decision page is withdrawn; every remaining recon artefact references only real `tripletId`s, real Card refs or real source quotes; `RECON_REORIENTATION_2026-10-02.md` §2 lists the invariants; `PRODUCTIVE_SLICES.md` repeats them for every slice.

### D-18 · Centre of gravity (2026-10-02)

The first pass made the Kayfabulation table simulation the core. Georg: it is a later King Kayfabian minigame. The core is Residents with a lean character system, Cards as world artefacts, the player bringing Cards, Residents speculating from their Signature-Deck knowledge, memory in Resident Social Memory. This matches PR #272 (Social Card Relay, Signature Decks, Base-24 Lean Character Card). See `RECON_REORIENTATION_2026-10-02.md`.
