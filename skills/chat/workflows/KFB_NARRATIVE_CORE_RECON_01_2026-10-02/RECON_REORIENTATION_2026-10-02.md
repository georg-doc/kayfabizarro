# KFB-NARRATIVE-CORE-RECON-01 · Reorientation after Georg's review (2026-10-02)

This note **supersedes the centre of gravity** of the first recon pass. The source map and the canon ledger stay valid as inventory. What changes is *what is built first*.

## 1 · What Georg decided

1. The Kayfabulation game simulation is a **special mode for later**: a King Kayfabian minigame where the player redeems collected Cards, kayfabulates the five-card composition himself, other Residents only give the social calls (KayfaBINGO / KayfaBONGO / KayfaBOGGLE / BLÖDSINN) and the King judges. It is not built now.
2. Now: in the cozy world, the player **gets to know Residents and Cards**. Residents live their own lives (AI-Town approach).
3. Cards are **artifacts in the world**. A Resident's Signature Deck is their home world and world knowledge on the Floating Islands; they also meet Cards that do not fit theirs.
4. Core mechanic first: the player **brings a Card to a Resident** (more practical than terrain discovery for the base mechanic). Residents **speculate** about it: meaning, role, function, what it claims, what it could say, how it relates to other Cards and to Resident 1's vs Resident 2's world knowledge. This is a **conflict situation**, not simulated game turns.
5. Memory lives in the **Resident memory** (Resident Social Memory, PR #272 line), not in a game-sim memory.
6. A **lean character system** carries personality, look, tragicomic backstory with a dark secret, motivation, points of interest, Signature Deck and signature moves, continued as Lean Memory.
7. Hunky & Dory personality details across sources are **irrelevant right now**.

## 2 · Invariants that keep getting lost (now explicit)

| Invariant | Source | Rule for every brief and build |
|---|---|---|
| **Semantic Triplets are the default speech** | Town J-13; #305 kernel (`subject / connector / reframe`, shared pool, signature Triplets); Signature Decks §10 "Card → Triplet mapping"; WS1 A2 grammar `fragment → turn → gap → player closure` | Residents speak from the **one shared Triplet pool** by default. No private phrase databases, no free LLM chat as default. |
| **Monkey-Island interaction** | Town J-13, J-14 (collectible retorts), Card Relay §5–6 | The player picks from a **short curated list**; "the joke lives in the choosing, not the branching". Retorts become available after being heard. No dialogue trees. |
| **English in-world** | WS1 A3/A5 "English-first", ChatterBox content convention | All Resident speech, Triplets, Card-facing content and UI strings in the world are **English**. German KFB proper names stay valid where canon. Planning docs for Georg may be German. |
| **No invented example dialogue in briefs** | Georg 2026-10-02 | Briefs, docs and handoffs **must not contain Claude-written sample lines** as illustration. They read as canon to the next chat and drift. Reference real pool `tripletId`s, real Card refs and real source quotes only; otherwise write `OPEN`. |
| **ChatterBox owns language, host owns timing** | #305/#306 owner lists | Character data supplies point of view, stance and context; it never owns wording. |
| **One memory owner** | #272, Town §07 ("an NPC memory is a filtered view of the Journey, not a new system") | Lean Memory receipts store social meaning, not transactions. No second store. |

The first recon pass broke two of these: its decision page contained invented German dialogue lines and it treated the King minigame as the core. Both are withdrawn (see §5).

## 3 · The existing design already matches Georg's direction

All on branch `chatgpt-web/town-resident-social-memory-2026-09-28` (PR #272, head `992ea989…`), design only, not runtime:

| Georg's element | Existing source |
|---|---|
| Lean character system | `RESIDENT_BASE24_ARCHETYPE_MAP_2026-09-29.md` §8 "Per-Resident Lean Character Card" (identity, rig, POI, routine, drives, desire, blind spot, tragicomic contradiction, epistemic lens, Signature Deck lanes, Gift/Brick Fish/dance responses, Triplet flavour, Fluff-o-lect tolerance, Lean Memory seeds, resume behaviour); §7 three-vector personality shortcut |
| Character overlay contract | `OFFICER_DOPPEL_DENK_RESIDENT_PROFILE_2026-09-28.md` §17 (routine preferences, attention biases, motivations, expectation tendencies, reaction-intent deck, language-owner reference, memory salience, escalation tendencies) |
| Signature Deck as world knowledge | `RESIDENT_SIGNATURE_DECKS_2026-09-28.md` (`ResidentDeckProfile`, stance incl. productive mismatch, 3–7 Signature Cards, `knowledgeSource = 'signature-deck'`, Card → Triplet mapping, social triangles) |
| Card brought by the player, Residents react | `RESIDENT_SOCIAL_CARD_RELAY_2026-09-28.md` (A → player → B, SHOW / SPIN / SELL as Monkey-Island choices, counter-Card, Lean Memory receipt `card-relay`, King as later synthesis, priority list) |
| Two Residents speculating about one Card | NPC-CARD-SPEC-01 "Resident Card Speculation Scene" (`tools/KFB-ToolBox/_inbox/KFB Resident Card Speculation Scene/npc-card-spec-01_2026-09-24/`) + #305 deterministic Triplet kernel + #306 seam into that scene |
| Knowledge provenance (seen vs heard vs deck) | #305 `knowledgeContext` (OBSERVED / HEARD / CARD_SEEN / CARD_REPORTED) + Signature Decks §7 |
| Gift, dance, Brick Fish, epistemic culture | `RESIDENT_GIFT_CULTURE…`, `RESIDENT_DANCE_CULTURE…`, `RESIDENT_EPISTEMIC_CULTURE…` |
| Real actors | Resident Atlas; #310 source-isolates Lorekeeper, Goth Girl, Clown, Witch |

One difference to name, not resolve: the Card Relay text says "the player is not a postman" (the player *performs* the Card via SHOW / SPIN / SELL); Georg described the base case as a courier job with Residents speculating. Both fit together: the courier job is the trigger, the presentation choice and the Residents' speculation are the content.

## 4 · New product order

1. **Lean Character Card** for two contrasting Residents (this recon prepares it, see `RESIDENT_LEAN_CHARACTER_CARD.md`).
2. **First Social Card Relay** (= #272 gate `RESIDENT-SOCIAL-MEMORY-01`, step 2): Resident A hands one real Card to the player → player brings it to Resident B → SHOW / SPIN / SELL choice → A and B speculate from their Signature-Deck lenses through the Triplet kernel → visible reaction → one Lean Memory receipt → both resume routines.
3. Gift / dance / Brick Fish as social culture.
4. Minigames as exceptional Card acquisition.
5. **Later:** King Kayfabian minigame (formerly "SIM-01").

## 5 · What happens to the first-pass recon files

| File | Status now |
|---|---|
| `SOURCE_MAP.md`, `CANON_DELTA_LEDGER.md` | valid inventory; ledger gains D-17 (speech invariants) |
| `NARRATIVE_RUNTIME_ARCHITECTURE.md` | layers and owner rules stay; the "Game Director" layer is **deferred** to the King minigame; the Culture Director and Lean Memory lines move up |
| `KFB_SIM_EVENT_SCHEMA.json` | **parked** as a draft for the King minigame; not a contract for the Resident world |
| `PRODUCTIVE_SLICES.md` | **rewritten** (Resident-first order) |
| `OPEN_DECISIONS_FOR_GEORG.md` | **rewritten** (only Resident-world questions) |
| `KFB_SIM01_ENTSCHEIDUNGEN.html` | **withdrawn** (contained invented dialogue lines; centre was the minigame); replaced by a short notice |
