# KFB Deck Homebases · Diorama Collection & Progression R0.2

**Date:** 2026-10-15. **Owner:** Island Worldbuilder Lab; post-MVP gameplay design, source-only, not implemented. **Branch:** recovery/kfb-minigames-fluff-source-bridge-2026-10-15 (Draft PR #400). **Parent:** KFB_POSTMVP_MINIGAMES_FLUFF_SOURCE_RECOVERY_2026-10-15.md and KFB_WATER_HARVEST_MICROGAME_FIRST_PROOF_DESIGN_R0_1_2026-10-15.md. No new runtime, stage, world owner or current MVP acceptance requirement.

## 1. Author direction and verified source

Georg proposes a **Deck Homebase**: an authored Diorama-Scene in an existing Open World, with a thematically coherent Resident/curator and meaningful attractions. The Player collects original Card references scattered through World POIs, harvesting, Fishing, Cartoon Blast Fishing/Mining, farming, Courier/social exchanges, Resident favors, optional Combat, exciting races or simply picking them up. Return home to see the collection, unlock small themed rewards and finally enjoy a world-scale deck-celebration with the Resident and, when finished media exists, the Deck's complete Triplet Song/performance.

**Current source verification:** GitHub main registry/assets/v1/decks/index.json blob b1399317c33fbd6ff17a622da68c684207bd5b4c has **130 registered Deck IDs / 6,985 Cards** and heterogeneous lengths. **79** decks have 56 Cards; also 60/52/48 etc. Actual examples embrace_protopia, forget_utopia, ignore_dystopia and frizzlebob_s_mission_control are each 56. Do NOT hardcode 56 globally or make zero-card/catalog-exception Decks collectible.

The source-owned Card contract (DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md, blob 15f8fce5428bfc6c2725b9e3042e9a8a83966468) mandates canonical **deckId + cardNumber**, final PDF crops and Card text JSON. Card / Billboard / Almanac / Courier all use one identity. Island Worldbuilder Lab SPEC_WORLDBUILDER_GODMODE_VISION_R1.md blob ca1f2968e15d594c5a64e1b6ba3b200d07346702 defines a WorldRecipe with worldId, decks[deckId,role] 0..N at most one primary, residents/anchors and future nodes[]. The authored WorldRecipe is NOT the PlayerSave. Golden Journey source provides a real example of courier/card/music/Orc Band interplay without claiming an arbitrary full-deck concert exists.

**Music production reality, 2026-10-15:** KFB-TRIPLET-SET-R2 Production Control records eight newly drafted sets covering 448 source cards, 445 candidate spoken lines and three explicit skips. They are editorial candidates, not a QA-accepted, Suno-rendered, staged performance. DO NOT gate Card completion on a song that has not been made, do not pretend 56 lines fit one single track, and do not label a preview as an accepted song.

## 2. One Homebase, not a new island for each of 130 decks

A Homebase can be an existing World module, resident's room, source-backed compact Diorama, stage or venue in an established island or a later bounded WorldInstance. The Diorama is a semantic place with a reason to exist, **not a floating Deck shop** or a fork of the engine. It has an actual Resident with history, preferences and life before the player arrives, two or three meaningful landmarks, a collection/billboard viewing station, one or two source-owned optional activity spots and a playable approach/departure route. The source Card/worldview shapes the set, and world history remains visible.

One island can host 0..N Deck associations; at most one primary in the existing island recipe, with linked sub-Dioramas for other Decks as author-approved content. Individual Cards may be found in distant islands. The Homebase is the thematic return hub, not a geo-fence requiring all Cards nearby. The curator may be a Lorekeeper, Witch, Orc performer, CEO, Farmer or new source-approved character; **do not assign the Lorekeeper to all decks**. Visiting other Homebases, musical performances and courier routes connects the world rather than creates an unrelated catalog of 130 dead-end rooms.

## 3. Numbered Card collection, freedom of discovery

For a 56-Card Deck display a clear numbered 1..56 grid or the existing source PDF/contact-sheet card grid. Uncollected slots get a legible locked/gray overlay; acquired slots reveal **original final PDF art** and authentic title/PowER/Lore from the source viewer. Do not alter/copy original artwork as a counterfeit replacement, break its aspect ratio, or leak a hidden Story card by accident. For other Decks use **actual registry cardCount and eligible source Card refs**, not 56.

**Recommendation:** fixed collection numbering, **not** mandatory acquisition order 1 then 2 then 3. The player can catch #37 before finding #12; an optional hint may point to the next missing Card at a true reachable POI. Linear local story beats are authored exceptions, not a blanket 56-stage game. Cards remain owned in canonical PlayerSave, never 56 inventory-slot items; Almanac shows real provenance how/where/who/when. Repeat encounter does not duplicate card ownership or a Deck progress counter.

DeckProgress is **derived collectedCount/eligibleCardCount** from canonical PlayerSave CardRefs. It is not a separate XP currency. On catalog revision preserve an already-earned completion/event even if an expansion adds new Cards.

## 4. What to do in the world: layered POI collection routes

Most Cards should be accessible via ordinary roaming and short source-authored actions. A plausible **illustrative** distribution for a full 56 Card deck: ~38 easy visible/discovery/gift finds, ~12 activity-driven catches/farm/Fluff mine/craft/courier pickups, ~6 memorable encounters or scenic race/showdown events with Chill-safe alternate collection. Not a fixed quota or identical 56 scripts for every Deck. Every POI needs actual world biography and source identity, not a field of random floating cards.

**Immediate 30–90-second activity:** source card/Fluff pickup, curious interactive prop, source pond bobber or cartoon blast, farmer carrot, resident quip. **Medium 5–15-minute outing:** cross-island Courier, thematic music gig, strange workshop recipe, scenic Drive challenge or a route to another Homebase. **Long-session arc:** return with discoveries, curator's interpretation changes, recognizable Homebase variants/performances unlock and eventually Deck completion.

Route grammar: real Resident or landmark gives a clue -> accessible World POI -> source-owned activity result -> canonical Card acquisition + Almanac Origin -> optional cross-world detour -> Homebase curator reaction/hint. Avoid forced quest arrows / grinding; include interesting places between destination points. Use existing Walk/Drive/Flight/Courier/Combat/Audio/ChatterBox owners and a single ResourceActivity/ActivityResult grant. A spectacular clay explosion cannot mint rewards by VFX particle count.

## 5. Five milestone beats without generic XP

**Suggested flexible 56-Card example** (not accepted reward table; thresholds scale to actual N):
- **1/N:** curator welcome + Almanac/contact sheet, one real Card/short accepted voice/Triplet beat.
- **14/56 (25%):** Homebase gains a visible source-approved activity/decoration; a recipe or tool variant and Resident context reaction.
- **28/56 (50%):** a curated little show or meaningful new route; themed vehicle/vehicle skin/ride accessory if the true Vehicle/Asset owner validates the source and safe unlock. Bonus vehicle never a prerequisite for base traversal.
- **42/56 (75%):** band rehearsal/preview or curated story contradiction/quest scene; an authored special prop or Almanac memory.
- **56/56:** **Deck Finale as World Event**: Resident/performance ensemble reacts, the set comes alive, a complete source-approved Triplet Song/medley plays **if actual accepted audio is available**, plus replayable stage/Almanac capsule, and optional cosmetic or uniquely meaningful themed bonus.

A single exported audio file alone is too small as the only completion reward. Players should get short genuine music and convincing resident life before 100% collection. With missing/not-yet-accepted Song, the game still registers complete Card collection, performs a source-approved non-audio scene if available, and keeps the song availability independent; never fake a track or softlock progression. Audio/voice files and their QA/status belong to existing Music/Triplets/KFB Audio owners, not the World achievement writer. Any runtime performance uses the single existing AudioContext.

Small unlocks use existing PlayerSave/EventReceipt (one award per threshold), true source asset/vehicle and World/Resident consumer. Fluff Wallet, lifetime Fluff Score and optional six-level reputation are distinct; do not create another compulsory levelling resource. All main travel routes stay open in Chill.

## 6. First later vertical proof for Claude Code: three Cards, one return

After playable Lab core and existing source/owner audit approval, test **one actual Deck and one real original Diorama/curator** only:

1. Isolate the original Resident/Diorama source visually and read true registry deckId/total and final PDF card crop.
2. Award 3 actual CardRefs through **simple pickup**, **one already-source-proven POI action**, and **one meaningful Resident/Courier beat**; no entirely new activity engine just to hit three.
3. Show the existing Viewer/Almanac numbered N-slot progress with three genuine PDF art reveals, actual origin receipts, missing slots and safe fresh reload.
4. Return to curator; one source-authored recognition beat and a minimal source-verified scene response. Do not award the same Card twice, interrupt travel movement or duplicate dialogue/audio runtime.
5. If an accepted media/performance source exists, audition a **small** real preview; complete Deck song remains editorial/production separate, NOT the proof's first acceptance target.

**Next gate remains the already named CLAUDE_CODE_RECOVERY_INTAKE_CONFIRMATION** for current Lab controller to acknowledge PR #400 and latest Lab SSOT. **After future playable foundation and Georg authorisation**, MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT remains deferred integration prerequisite. This file is documentation only; no new acceptance gate, MVP scope, build, stage, music upload or merge.

## 7. References

- registry/assets/v1/decks/index.json on current main, blob b1399317c33fbd6ff17a622da68c684207bd5b4c.
- DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md blob 15f8fce5428bfc6c2725b9e3042e9a8a83966468.
- SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md blob ff4571348634181323059b0babad3b5d862e409c.
- GOLDEN_JOURNEY_MVP_2026-10-04.md blob 5859e2c5854b9fc279be6ffe5aedee5d8121363a.
- Lab SPEC_WORLDBUILDER_GODMODE_VISION_R1.md on sync/lab-rkit-2026-10-09 blob ca1f2968e15d594c5a64e1b6ba3b200d07346702 and REVIEW_POSTMVP_CONCEPTS_ARCH_FIT_R1.md.
- KFB-TRIPLET-SET-R2 authenticated Production Control records on 2026-10-15, editorial-candidate status.

**Evidence:** source/static reads; no 3D source isolation, accepted Diorama/stage, player save, browser, gameplay, Suno render or end-to-end deck-performance test executed.
