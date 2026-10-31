# KFB Game Loop R5 · Signal Memory: die Reihenfolge, in der Karten bekannt werden
2026-10-29 · Additive Webchat concept session

**Status:** Georg creative steering: remember the order of canonical Card acquisition/exposure and when a mismatching, cross-deck Card entered a Resident's experience. The *primacy effect* is a **soft design hypothesis**, not an accepted formula, knowledge doctrine, psychological simulation or runtime feature.

**Lineage:** `GAME_LOOP_R1.md` → `GAME_LOOP_FLUFF_ECONOMY_R2.md` → `GAME_LOOP_CARD_WORLD_KNOWLEDGE_R3.md` → `GAME_LOOP_LEAN_MEMORY_REPUTATION_WAYFINDING_R4.md` → R5. No changes to the card-first player objective, reputation vs friendship separation, NPC agency or optional Fluff economy.

**Owner:** `KFB_HUB/30_DECISIONS/replies` on existing concept PR #460. Later receiving owner remains the *existing* `PLAYER_SAVE` / Lean Event Memory / NPC Social Memory + `RESIDENT_KNOWLEDGE_PROFILE` / Card/Almanac. **Signal Memory names a small projection over the existing ordered receipts**, not a new store, writer, schema authority, LLM memory or NPC model.

## 1 · Minimum idea

The player and each NPC may reach the same set of known Cards by **different histories**. Record the sequence of the meaningful events that created those histories:

- For the **player**: first acquisition of canonical `deckId:cardNumber`, and optional discovery context (place, Resident, quest, route); membership in the player Almanac stays binary/unique.
- For an **NPC**: curated authorial starting set (1–6 canonical Card refs) + *ordered* first exposures to additional Cards from another Resident or the player, source and encounter outcome.
- For **mismatch**: flag when a new Card's Deck is not the NPC's usual primary Deck/known thematic frame; keep the *actual reference and event context* authoritative. Mismatch may be expected, surprising, disputed or welcomed; not automatically hostile.
- For **experience**: meaningful reactions and later reconsiderations may themselves have receipts. **One Card known once** does not mean **only one conversation about it ever**.

Do not copy entire Deck JSON into saves and do not record every routine sentence.

## 2 · Tiny source-agnostic event example (illustrative, NOT a new schema)

```json
{
  "seq": 42,
  "kind": "card-first-shared",
  "npcId": "farmer_a",
  "cardRef": "forget_utopia:1",
  "sourceActorId": "player",
  "encounterRef": "encounter-42",
  "locationRef": "protopia_farm",
  "reactionTag": "curious-disagreement"
}
```

The values `seq`, `kind`, `npcId` etc. illustrate what an existing `MOMENT_RECEIPT`/`ENCOUNTER_RECEIPT` and the resident memory projection need to be able to express; **do not adopt these literal keys/POI IDs in runtime without inspecting the actual consumer contracts**. `seq` is a stable monotonically increasing event sequence **within one player's save/journey**. A timestamp can be supplemental for display, but ordering must not depend on a device clock. Event identifiers remain unique and replay-safe.

For the same save's player, the Card might have been first acquired at `seq=18` and delivered to the Farmer at `seq=42`: **player acquisition order and NPC knowledge order are not the same chronology**.

An NPC's initial 1–6 references remain source-authored `signatureCardRefs[]`. Their list order may be retained as an authorial priority, but it must not be misreported as a historical lived chronology if the story never supplied one. Only actual after-start exposures get `seq` receipts.

## 3 · Primacy with almost no computation

**Minimal default (R5 proposal):**
1. **First contact stays remembered**: the earliest encountered Card in a new topic/deck may be selected preferentially when a familiar subject comes up.
2. **Recent relevant events also count**: an important new gift, contradiction or shared experience can displace the old priority.
3. **Character interest and actual context win**: the Farmer responds as a Farmer, the Utopia marketing bot as a marketer. No global “first Card is truth” rule.
4. **No permanent automatic conversion**: exposure, belief, agreement, trust, reputation and friendship remain distinct.
5. **Optional weighting only after a comparative playtest**: easiest initial selection is a deterministic *tie-break*: among equally topic-relevant Cards prefer the first learned, unless a later important event has higher authored salience. Do **not** predefine numeric decay curves, psychology multipliers, a reinforcement-learning model or a live multi-agent memory network.

**Two player histories:** Two players share the same initial Farmer. In journey A the Farmer first hears `forget_utopia:1` before a related Protopia Card; in journey B the order is reversed. Same final known-card set, slightly different preferred first reference and dialogue opportunity. The distinction comes from actual receipts, not random personality changes.

## 4 · Cross-deck event trace: what can be reconstructed?

For each NPC the player may optionally inspect a compact timeline in the Almanac or character relationship view:

`Starting Cards (authored) → ① The Glossy Horizon [from player, Protopia farm] → ② The Open Notebook [later] → ③ debated at workshop`.

This is a small provenance trail, **not** a second card collection owned by the NPC, not a copy of the player's Almanac and not a full chat transcript.

A repeated gift of `forget_utopia:1` does not create a new first-known record, a new unique card, another reputation tick or a second first-discovery achievement. A distinct later debate can add one meaningful memory receipt if it actually changes the situation. The receiving `NPC_MEMORY_VIEW` derives order from the ledger; rebuilding after fresh import should preserve the order exactly.

**Privacy/save scope:** these are per-player-journal game facts; do not let two players silently share the same NPC progression state unless a separate multiplayer ownership model is explicitly authorized.

## 5 · Smallest meaningful test (later, not executed)

One source-backed Resident, two real Cards from different Decks, two **different event orders** in separate disposable save fixtures:
- A: `forget_utopia:1` then `embrace_protopia:1`;
- B: `embrace_protopia:1` then `forget_utopia:1`.

Expected:
1. final NPC known-card set equal (two refs plus authored starting refs) while first-exposure chronology differs;
2. source/provenance/encounter refs remain inspectable; first cross-deck receipt recorded;
3. tiny contextually grounded dialogue difference may be shown without changing immutable Card text;
4. fresh save/export/import recovers both histories; re-delivery does not duplicate rewards/known-card events;
5. Player's own collection and acquisition order remain distinct from the Resident exposure order.

**Evidence of this concept session:** GitHub source alignment only, **0 game/runtime tests, 0 browser tests, 0 playtests, 0 authored animation proofs**. No acceptance/Live/Stage claim. The illustrative location/receipt IDs above are *not* implemented fixture IDs.

## 6 · Protected contracts and one next gate

- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`: PLAYER_SAVE + Lean event ledger + NPC/Social Memory + Almanac. Receipts are truth; generated memory views are caches. No ChatGPT memory as savegame.
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md`: source-locked `RESIDENT_KNOWLEDGE_PROFILE`, canonical Card IDs, relevant Card-first dialogue; no NPC deck copy.
- `replies/GAME_LOOP_LEAN_MEMORY_REPUTATION_WAYFINDING_R4.md`: distinct acquisition, familiarity, friendship, faction standing and optional achievements; event idempotency; no world/Combat owner change.
- Current World R4 STOP/NO MVP, existing character/Almanac/ChatterBox/Motion owner boundaries unchanged.

**Exactly one next gate:** **WS0/Georg design-register intake of minimal ordered Card receipts as an extension of the existing Lean Memory contract**; later a 2-order paper test, then separately authorized runtime consumer proof if warranted. No additional generic NPC AI system.
