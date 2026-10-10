# KFB TinySkies Portal Visuals & Comic Closure · Source Note v1
Date: 2026-10-10 · Status: SOURCE-READ PLANNING DONOR / NOT ADOPTED / NOT BUILT
Owner: existing KFB World/Portal/Instance transition route as future consumer; documentation lives under existing post-MVP Island/Minigame planning branch `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`.
Author intent: carry over TinySkies portals as a **separate visual/conceptual feature** across KFB islands, not as part of the tiny Forest weather prototype.

## Actual TinySkies code inspected
At `georg-doc/tinyskies`, branch `cursor/globefly-multiplayer-globe-flight-game`:
- `client/src/game/CarpetPortalSystem.ts`, blob `02a142693b5a91aed3776fd02def346267dfbfa3`: `PortalVisual` uses colored ring, glow, inner disc and two swirls; has animated spawn/morph from circle to oval, time-based motion, paired endpoints, trigger/cooldown and carpet-specific placement/teleport handling. **Visual mechanics exist**, but KFB island routing and direct use remain UNTESTED.
- `client/src/game/CosmicWorldPortal.ts`, blob `cd22b26c69f0682e0eb76b4f17d2d7ccd38150a1`: different cosmic/void portal with a swaying interior, halo/sprite and star-particle elements; globe placement and source navigation semantics are specific to TinySkies. **Alternative visual donor**, not yet adopted.
- Both are real code, not only mockups. Source/rights/build compatibility, exact original visual quality, interface/persistence and KFB Clay material parity still require actual isolated browser render/audit; a working URL or parsed file is NOT an accepted integrated portal.

## Why portals belong in KFB
1. The entrance is a playable comic **gutter / closure** between islands, decks, vignettes, instances or story beats. It can physically reframe the player's interpretation of the departure and arrival.
2. A freestanding animated opening may reveal its own theatrical construction when seen from behind (existing KFB Paper/Facade threshold idea); passing **around** it should not secretly change worlds.
3. It can be a visual affordance for Forest secret trail/Cabin alternate door; Graveyard revival path; Prison Maze intentional visitor entry; and more broadly inter-island travel when Tracks are absent or flight is inappropriate.
4. The visible form may change with location/palette but must not obscure source identity or force every portal to be a loud cosmic rift. Examples: soft forest oval with wind-driven rim; dusty graveyard/afterlife threshold; taller theatrical prison gateway. These are look proposals, not new source assets.
5. Portal appearance does NOT grant progression/teleport by itself: one authoritative World/Progression state and existing Portal/Instance routing decide whether enter is enabled, where the safe exit/return is, and how it persists. The earlier F-S13 state-dependent threshold proof is preserved as a prior KFB architectural seam (current R4 STOP unaffected).

## Strict KISS route
- **Do not add portals to the first Forest breeze/rain/fog/SFX patch.** They are a separate optional source-visual proof.
- Later show original TinySkies Carpet Portal and Cosmic Portal **isolated**, identical framing, actual source code. Pick **one** KEEP/ADAPT candidate for a small KFB material/look variation; do not launch both.
- One source-backed opening in an existing KFB host, with existing owner deciding destination, collision, trigger/cooldown and return. If World/Portal source not available, stop after isolated visuals; do not invent teleport engine.
- One visible arrival/departure comparison and a behind-the-frame walkaround, no generic sci-fi interface chrome; preserve actual source / license findings.
- Avoid creating another portal system, sky owner, physics or audio owner. Optional entrance SFX goes through existing KFB Audio.

## Explicit state and handoff
This is a research/design donor, not proof of reuse, not a new current-MVP requirement, not a fifth island and not a new PR/Stage/Site route. Later execution authority follows current Four-Island A/B and World/Portal owner gates. One existing deferred parent Minigame/Fluff gate remains `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT`; portal isolation is a scoped optional donor subsection, not a new blocker.
Recover: main START_HERE → CHAT_GITHUB_KFB_STAGE_WORKFLOW → FRESH_CHAT_SLICE_PROTOCOL → current Island Galaxy, Forest v1.1 and Weather v1.1 → this donor note → owning Return.
