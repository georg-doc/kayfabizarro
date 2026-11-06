# KFB Game Loop R3 · Karten als Weltwissen, NPC-Diskurs, Fluff als Nebenökonomie
29.10.2026 · Webchat / Georg creative steering

**Status: GEORG CREATIVE STEERING / DESIGN DIRECTION, proposed mechanics not approved runtime, no new V-number.**
**Relationship to R2:** additively clarifies and **overrides R2's reward priority**. R2's world-repair-as-primary-repeatable-payoff and obligatory six-colour craft path are no longer recommended primary design. R2's ideas stay as optional material/situation donors. R1's collected-card-first direction is strengthened.
**Owner:** KFB_HUB/30_DECISIONS conceptual intake. Receiving: existing Card/Almanac + Resident Knowledge/ChatterBox/Lean Memory + World/WS1 + Combat/FX; no second card, knowledge, dialogue, memory or economy runtime. No R4/R5 continuation.

## 1 · Georg's clarification / priority

- **Main objective, player-facing:** collect as many **real canonical KFB cards** as desired, learn their origin, and unlock meaningful encounters/deck experiences. Almanac is the player's accumulated reference trail, not a generic leveling tree.
- **Main interaction:** help Residents broaden their **world knowledge** through courier missions, gifting, showing and negotiating cards from **different decks**. Residents begin with a small, distinctive reference set of **1–6 cards** as Georg's creative target. No fabricated card lore; exact starting sets are later curated from real `deckId + cardNumber` sources.
- **Meta-narrative opponent:** shrinking opinion corridors, censorship, propaganda, manipulation and epistemic confinement. Men in Black, eraser/censorship, Goo/Ghoul adversaries, propaganda slogans and manipulated/damaged speech bubbles can **enact** these themes as concrete actions, with reversible counterplay.
- **Fluff:** physical resource circulation, Harvest/Repair/Build/Cleanse/Clay FX, occasional optional shortcuts/recipes and optional **cumulative total**; economically secondary. Wood/ore are form ingredients. No grind, wallet/HP conflation or mandatory Fluff expenses to collect cards.
- **Player freedom:** explore openly, accept or decline a delivery, agree/disagree with NPC, ignore a slogan. NPCs need not adopt the player's opinion or cease being themselves.

## 2 · New core loop and a 12–18-minute story

**Discover a Card/person -> drive/walk/fly for an invitation -> deliver/show/talk (or encounter resistance) -> recipient interprets, argues or refuses -> the world reacts via dialogue, gesture, bubble, media or consequence -> player obtains a canonical Card/provenance receipt -> next incompatible perspective becomes interesting.**

The player can acquire Cards via courier, discovering, dialogue, peaceful trading/gifting, crafting, challenge or destruction that reveals hidden Card truth. **No single action, resource type or moral stance is mandatory.**

**Example, only a design beat:** A Protopia Farmer, initially anchored in `embrace_protopia` material, receives a reference to the real Utopia Card `forget_utopia:1` / *The Glossy Horizon*. The Farmer knows maintenance costs and reads the card against a broken machine; a Utopia promotion-bot calls the same card “Proof of guaranteed progress”. The Farmer can react skeptically, reconsider one detail or simply object. A Men-in-Black agent overlays/censors a phrase from the conversation; the player can expose the original Card provenance, ask a third speaker, contest the spin or walk away. **One** canonical Card is credited to the player's Almanac if the encounter actually grants/discovers it; the Farmer's knowledge changes only according to the encounter outcome, and his personality/role remains. Restoring a bubble or helping with machinery gives a visible physical aftermath; Fluff is optional ancillary loot.

This is satire about **who gets to speak, what is preserved, how a claim travels and who benefits**, rather than a compulsory political conversion or a lecture.

## 3 · NPC knowledge is not NPC belief

The **existing source-locked** `DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` already specifies `RESIDENT_KNOWLEDGE_PROFILE` with `primaryDeckId`, optional counterpoint weights, `signatureCardRefs[]`, known/encountered Card refs, personality/profession filters and social/Lean Memory. **Reuse that contract; do not create `NPC_WORLD_KNOWLEDGE_ENGINE`.**

For each Resident, distinguish:

| Concept | Meaning | Existing owner / guard |
|---|---|---|
| **Starting set 1–6** | Explicit selection of real Card refs illustrating what the figure already knows and tends to cite. The count 1–6 is Georg's creative preference, not a tested universal quota. | Resident/Content Author; verified `deckId:cardNumber`. |
| **Encountered/shared Card** | A new claim has reached the figure; reception is a new memory event. | Resident Knowledge references + Lean Memory; not new full Deck JSON per actor. |
| **Interpretation/response** | Accept, dispute, quote selectively, joke, recontextualize, ignore, ask follow-up. | Character personality + ChatterBox/Triplet and current encounter state. |
| **Affiliation/conviction** | Role, loyalty, goals and relationship do **not** automatically invert on receipt. | Existing Character authoring, separate from simple known-card list. |
| **Provenance/visibility** | Whether original quote/card is currently visible, overprinted, censored or disputed; the original canonical Card never changes. | Card identity + existing presentation/event owner. |

**No “Card count = truth”, no mandatory ideological alignment, no arbitrary correctness points.** Cross-deck mismatch should arise from meaningful contradictions between a Card's claim and a Resident's interests/experience, not random opposite-deck selection.

**Canon-card identity is unique, but knowledge is shareable.** A Player's acquired Almanac Card remains in the collection when shown/delivered; Resident may reference having seen/received it, without cloning another canonical Card ID. Courier custody, Almanac collection, known-by-NPC and claim visibility are **distinct states**. Repeated exchanges must be idempotent for rewards but may produce new reactions when context genuinely changes.

## 4 · Diegetic speech/propaganda/censorship: small vocabulary, strong meaning

| Diegetic action | Visual/sonic event (proposal) | Reversible interaction and story consequence |
|---|---|---|
| **Propaganda shout / broadcast** | Source-anchored slogan as oversized clay speech bubble, billboard or loudspeaker; particular NPC/faction owns the claim. | Player asks who said it, confronts with real Card or hears the NPC's own interpretation. Never spawn contextless random mottos. |
| **Men in Black intervention** | Black bar/redaction slices through a specific quote; an NPC hesitates or a delivery is intercepted. | Investigate provenance, carry the Card by another route, recruit another speaker or refuse the detour. |
| **Eraser censorship** | A literal word or area of a bubble gets rubbed out; residue/ink or physical eraser remains as evidence. | Pencil/Player can reconstruct or point to the missing words; do not silently mutate actual stored `power/lore`. |
| **Goo/Ghoul contamination** | Goo occludes a Card motif, muffles a bubble or spreads ink over a talk-space/prop. | Existing cleanse/heal family restores visibility/colour; combat is one optional route, not obligatory. |
| **Cross-deck discussion** | Two opposed interpretations of the **same** Card, in speaker-specific Triplets and gestures; Emanata only when emotionally apt. | Player takes a position, mediates, laughs, asks BOGGLE, or leaves; NPCs retain agency and possible disagreement. |

Tone: satire and conflict should follow actual Card content, participant motivation and material stakes. No generic “all other opinions are bad” lesson. A censor's claim can itself be quotable and disputed; a resistant NPC is not automatically virtuous.

## 5 · Revised reward/UI economy

| Dimension | Primary or secondary | Player-facing consequence |
|---|---|---|
| **Unique Cards collected** | **PRIMARY** | Almanac/deck completion, canonical artwork, memorable provenance and new travel invitations. |
| **Card-influenced relationships/threads** | Primary experience, minimal UI | Changed NPC reaction, dialogue beat, optional handoff, remembered exchange; not a moral score. |
| **Card/deck song/landmark moments** | Milestone payoff | Art/music/scenelette unlock, according to existing source/owner gates. |
| **Fluff harvested / released total** | Secondary | Optional cumulative score, FX and craft/build affordances. Keep earned total separate from spendable balance if both exist. |
| **Wood, ore, construction, repair** | Secondary situational play | Player-made props and environmental feedback, never a universal prerequisite for Cards or travel. |

**R2 reclassification:** The priced repair menu (`3 Fluff + 1 wood`) and `6 Fluff of six colours -> real Card` remain *optional experiment recipes*. They must not accidentally make repetitive Fluff farming the fastest or required way to get Cards. “Repairing the world” can enrich a scene, but **not replace card-world-knowledge as the core objective**. Health vs wallet naming remains unresolved in older Overworld lineage; don't make Fluff score a hidden HP meter.

## 6 · Bounded first playable proof, only after separate authorization

One existing Resident + two **real Cards from different Decks**, a courier/show interaction, two distinct Resident replies (accept/dispute or refuse), one optional censored/redacted bubble, and one canonical Almanac receipt. Keep the existing Card pipeline, ChatterBox and Lean Memory. No universal NPC ideology simulator, no new runtime, no separate system for speech bubbles.

Four experience probes (future, **not executed**):
1. Does a player understand what **Card to bring to whom**, and why the mismatch is worth seeing?
2. Is the **recipient response** character-specific and substantively connected to both the Card and the visible situation?
3. Can a player restore/expose the **original quote**, while censorship and spin are visibly different from permanent deletion?
4. Does the Almanac show **one** real Card with traceable source, even after transfer, dialogue revisit and reload?

**Status/evidence:** `EVIDENCE_SCOUT` only; 0 browser tests, 0 runtime tests, 0 actual playtests, no screenshots. No main-branch/WS1 changes, no public Stage, no merge.

## 7 · One next gate

**WS0/Georg design-register intake:** classify this revised hierarchy as the working **player objective** (Card collection plus cross-deck world-knowledge exchange), with Fluff as secondary, and pick one authentic two-Card NPC exchange for a later narrow *design* / dialogue beat. No implementation mandate until the current World/Runtime owner allows it.

## Source anchors (read, not overwritten)

- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` – existing `WORLD_KNOWLEDGE_PROFILE` / `RESIDENT_KNOWLEDGE_PROFILE` and canonical Card provenance.
- `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md` – pull, don't gate; Cards as prompts/evidence; multiple readings.
- `skills/chat/RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md` – identity/affect/activity/encounter, light memory and social exchange as proposal.
- `skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.md` – Card noticed, exchange, talk/pose presentation as event.
- `skills/chat/town/LIVING_KFB_TOWN.md` – distinct resident voice, beliefs, role knowledge vs lean memory; serious disagreement without automatic opposition.
- `replies/GAME_LOOP_R1.md`, `replies/GAME_LOOP_FLUFF_ECONOMY_R2.md` – source variants, card acquisition routes and superseded R2 priority.
- `replies/BACKLOG_BLACKFLUFF_INFECTION_R1.md`, `replies/SPEC_FLUFF_SUCTION_R1.md` – Goo and Fluff recycling, not automatic new runtime scope.
- `skills/chat/recovery/KFB_ISLAND_MVP_FROZEN_MATRIX_2026-10-07.md` – full economy and full combat remain LATER; World R4 STOP.
