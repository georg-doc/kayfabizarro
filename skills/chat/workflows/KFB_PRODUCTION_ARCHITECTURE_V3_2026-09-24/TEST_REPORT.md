# TEST REPORT · KFB Production Architecture v3 · 2026-09-24

Status: **52/52 ARCHITECTURE / SOURCE CHECKS PASS**

Scope: architecture, complete self-service production strands, source locks, adjacent-owner routing and Hub briefing definitions. No new product runtime, Cloudflare deployment or visual product acceptance is claimed.

## Catalog / self-service contract · 23/23

1. `INPUT_LOCKS.json` parses as `kfb.production-architecture.v3-input-locks/3`.
2. `HUB_BRIEFING_CATALOG.json` parses as `kfb.hub-briefing-catalog/3`.
3. Eleven production strands exist.
4. Forty-five copy-ready jobs exist.
5. Twenty jobs are READY.
6. Twenty-five jobs are dependency-gated HOLD.
7. Every HOLD card names its exact dependency.
8. Hub default presentation is strand-first.
9. Job cards are collapsed by default.
10. Every one of the 45 jobs has a copy-ready prompt.
11. Every job source set resolves to an input-lock job/strand.
12. 45/45 normal jobs do not require Cloudflare in the edit loop.
13. 45/45 normal jobs do not require Work/WSA.
14. Canonical CubePet contract reports exactly 24 pet IDs.
15. Three distinct FrizzleBob technical identities are locked.
16. Town Living source blob matches current main.
17. ChatterBox reuse source blob matches current main.
18. Combat/Duel strand is present.
19. Travel/Surface strand is present.
20. Vertical/Babel strand is present.
21. Town/NPC-Life strand is present.
22. Shared Stage/Transition strand is present.
23. World topology and Travel mode are explicitly orthogonal; NPC-vs-NPC/Hero-Shot choreography is explicitly represented.

## Adjacent-owner routing · 6/6

24. 2D/2.5D Animation Studio is routed through the Actor Capability Matrix / Resident / World consumers rather than replaced.
25. Storytelling Maps / CardRig / Billboards are routed as placeable media/stage modules rather than a second WorldBuilder card renderer.
26. Dungeon / Environment Atlas keeps room/layout ownership and consumes shared Stage / Combat / Resident adapters.
27. Card Zone / Project Islands remains a card-system owner feeding Vertical/World/Combat support modules.
28. VFX/SFX Consolidation is routed into Shared Stage semantic event maps instead of a new global FX engine.
29. Tourbus/WaterBowser and other mini-games are routed as composite scene/instance consumers rather than new movement/dialogue/card owners.

## Current public-repo source heads · 8/8

30. EyeRig PR #104 = `e277c3456651d314a01adea046e0105d2a12cdd1`.
31. KayKit creator/KCL PR #107 = `fc49a336af57adb6317b74211b3318d004d96de5`.
32. Theatre Curtain PR #114 = `cd9c04cbf009b1211b9b6b008162b9d322d6e152`.
33. Motion Lab PR #127 = `7c8cc218ec46dabb20409c9e0b5368afcf5845c6`.
34. Card Zone/Hex planning PR #156 = `ee0f9bb6d738c538e042f799e5fb6f9b20893a01`.
35. ToolBox integration PR #185 = `2833674b36be707fa4d14c8b532faee78ef3ba28`.
36. Shared editor PR #186 = `7267185cdbdc60e576b946ee589f0b2e932c8c8b`.
37. WB2 PR #190 = `5a98e674184ea4694a5ad7d696d8cc84c1618bdf`.

## Current animation / Combat source heads · 8/8

38. Blender MCP proof PR #192 = `b49fb6e1adde070d658e1cc21dadb3294164cb29`.
39. Orc Warband PR #195 = `9dda7957a33e69926265c1e3a69028a4b35b26f0`.
40. Motion Library PR #197 = `bf0eace2332a48f0b220318ad7567c68cc6dfbad`.
41. WB-W0 PR #203 = `40fe2c10959a2022694a2342482e04dd34cbe7be`.
42. Combat actor integration PR #5 = `d6cf532e64d45fd3117775ec61cfc87b9e948ac0`.
43. Combat planning/Spindle/Choreography PR #6 = `735b5449bf09fb1a069d4a81db44608a58166677`.
44. Combat melee PR #7 = `f773dbeb0cfa09fa7e1bd72a4323130b2c0eff06`.
45. Combat Legacy readiness PR #10 = `663f0610eb960f322d67b078f1302d0c6178d1c2`.

## Current private-repo / donor-source validation · 7/7

46. Travel mode bridge PR #38 = `08147fb4a6726f4c0248ff79ade67eec24afdbca`.
47. Racer PR #33 = `71e7051b2eea1ad731912b634f44ce5ba0218736`.
48. Surface Adapter preflight blob = `f13cfe80443075f6d2fd2b507452562481a8a63b`.
49. Babel Hex Platform brief blob = `c9d609b23f6940ea27ffc03a2e13bc99712e46c5`.
50. Theatre Curtain Core v2 brief blob = `d4ecf7526000d4caf36010154f85eefa42e9b885`.
51. Travel main = `8614282aab2ced43bb5dda9fcf7abadf9768100a`.
52. Combat main = `f6a59ad15b9ffcf3164b0ab013f223962b63f61f`.

## Important source-status distinctions preserved

- TinySkies Boat/Plane are source-proven as upstream features, but not claimed as already ported KFB modes.
- Failed Platformer auto-jump source remains `SOURCE_REQUIRED`; no code is reconstructed from memory.
- CubePet Bunny, legacy Arena FrizzleBob and Driver Graft FrizzleBob are separate actor identities.
- Combat choreography preview does not become the damage/reward owner.
- WorldBuilder/Open World does not become a second Combat or Race runtime.
- Spindle and Curtain remain presentation modules.
- ChatterBox does not own NPC movement/combat/memory storage.
- FLAT/SPHERE/TORUS topology is independent from Ground/Drive/Flight/Boat movement mode.

## Deliberately not tested

- HUB-CTRL PR #202 rendering of the expanded 11-strand / 45-job catalog;
- public Hub publication;
- future product runtime behavior of the newly prepared jobs;
- cleanup/closure of historical open PRs;
- exact TinySkies Boat/Plane source implementation, intentionally a future source-recovery job;
- missing failed Platformer auto-jump source.

These are separate product/integration actions, not prerequisites for a correct recoverable architecture.
