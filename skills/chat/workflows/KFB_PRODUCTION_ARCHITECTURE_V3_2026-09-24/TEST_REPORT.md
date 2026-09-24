# TEST REPORT · KFB Production Architecture v3 · 2026-09-24

Status: **158/158 ARCHITECTURE / SOURCE CHECKS PASS**

Scope: architecture, complete self-service production strands, source locks, adjacent-owner routing and Hub briefing definitions. No new product runtime, Cloudflare deployment or visual product acceptance is claimed.

## Catalog / self-service contract · 23/23

1. `INPUT_LOCKS.json` parses as `kfb.production-architecture.v3-input-locks/8`.
2. `HUB_BRIEFING_CATALOG.json` parses as `kfb.hub-briefing-catalog/7`.
3. Thirteen production strands exist.
4. Seventy-nine copy-ready jobs exist.
5. Thirty-six jobs are READY.
6. Forty-three jobs are dependency-gated HOLD.
7. Every HOLD card names its exact dependency.
8. Hub default presentation is strand-first.
9. Job cards are collapsed by default.
10. Every one of the 79 jobs has a copy-ready prompt.
11. Every job source set resolves to an input-lock job/strand.
12. 79/79 normal jobs do not require Cloudflare in the edit loop.
13. 79/79 normal jobs do not require Work/WSA.
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


## Race / OSM / Look / Audio-VFX decision extension · 21/21

53. RKIT physics decision is Rapier-based for stunt dimensions: real airborne/contact owner, speed basis 27 m/s, gravity magnitude 15 m/s² downward.
54. Accepted v0.8 handling remains a feel/tuning donor and is not promoted as a second airborne/contact owner.
55. Canonical width ladder remains 10.8 / 14.4 / 18.0 / 21.6 m.
56. 28.8 m is special/XL-only if retained and does not silently redefine HERO.
57. Jump family explicitly preserves a forgiving ~12 m base module plus a ~30 m Hero step-down.
58. Ideal 30 m Rapier geometry aid is recorded separately from runtime acceptance.
59. Cologne is the first World Zone bake because current normalized source/cache/anchors exist.
60. Barcelona is the second-city portability proof rather than the first implementation dependency.
61. General spline/track editor is explicitly deferred; authored Track Recipes are the fast-path product decision.
62. Track Module Bake separates compact recipe/route/stunt metadata from cached visual GLB and Race-owned contact truth.
63. OSM World Zone Bake removes runtime Overpass dependency and retains source/provenance/compiler revision.
64. Geographic OSM truth and fictional WorldBuilder landmark placement are explicitly separated.
65. Hürth R2 remains frozen; Elastic Torsion is a new isolated proof rather than a third patch pass.
66. Existing City GROTESQUE twist/torsion is a donor/reference, not a silently copied global constant.
67. Sound Audition Library uses human labels + semantic events instead of opaque filenames.
68. Music Performance stores song references + beat/bar/choreography metadata without baking songs into animation clips.
69. VFX Audition Library starts from existing source-backed donors and creates small semantic adaptations only after visual selection.
70. RKIT PR #34 current head = `f368dd0c71eb2798bcd057d30196cb8da4d967b6`.
71. RKIT PR #35 current head = `37047b5a14c00e8b3cb5ddb4129e76ce3f10b2d9`.
72. Hürth / Elastic PR #194 current head = `b7f28824299b15e5d8a61c4bd9d847cfbe8f18ea`.
73. Current donor blobs revalidated: OSM build-context `92ac7dd9a48f7bf9c9b0471d57a6b9a647fb7a96`; City GROTESQUE style `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782`; VFX review bank `b208eb36d869078242c93c617de92cf10d873e36`.

## New prepared jobs

- `RACE-TRACK-RECIPE-01`
- `RACE-RKIT-03`
- `WORLD-ZONE-BAKE-01`
- `WORLD-ZONE-BAKE-02`
- `LOOK-TORSION-01`
- `AUDIO-AUDITION-01`
- `MUSIC-PERF-01`
- `VFX-AUDITION-01`

Current catalog metrics:
**11 strands · 53 jobs · 26 READY · 27 HOLD**.


## Card Zone / Player Meta / Interface extension · 23/23

74. Input locks advanced to schema v5 with explicit Card Zone, Player Journey and Interface Grammar donors.
75. Hub catalog advanced to schema v4.
76. Primary production map now contains 13 strands.
77. Self-service catalog now contains 68 copy-ready jobs.
78. 32 jobs are currently READY.
79. 36 jobs are dependency-gated HOLD.
80. Every new HOLD card names its dependency.
81. All 15 new Card Zone / Player Meta / Interface jobs have copy-ready prompts.
82. All new jobs resolve to their source-set locks.
83. 68/68 normal jobs still avoid mandatory Cloudflare in the edit loop.
84. 68/68 normal jobs still avoid mandatory Work/WSA.
85. Exact Card Zone v2 source still contains `buildFluidSurface`.
86. Exact Card Zone v2 source still contains `buildCardCube`.
87. Exact Card Zone v2 source still contains the real card reveal path `prepReveal / tickReveal`.
88. Exact Card Zone v2 source still contains `buildProjection / updateProjection` for Beam/projection.
89. StoryMap Housekeeping marks `kfb-fluid-v2/card-zone-v2-fluid-source.js` **AKTIV** and source-locked to the real Card Zone v2 donor.
90. StoryMap Housekeeping marks old `kfb-fluid-v1/` **DEAD** and explicitly a diminished form; it is not reusable authority.
91. Existing Journey donor still has versioning, migrators, cards and Diary state.
92. Travel Card/POP HUD still proves its current POP value is local runtime state (`popScore = 0`), supporting the need for a separate durable account owner.
93. Race HUD v3 donor still explicitly contains Tacho, Radio, Almanac and actual-route Minimap roles.
94. Exact historical source for the earlier “20-slot Backpack” sketch is not pinned; architecture records the 20-slot layout as current Georg product direction, not falsely as recovered implementation.
95. Current Resident inline editor presentation is measured at 28×28 CSS-px buttons with 13-px glyphs, matching Georg's legibility complaint.
96. Both new primary strands are present: **Card Zones / Card Objects** and **Player Meta / Fractal Almanac / Adaptive Interface**.

Current catalog metrics:
**13 strands · 68 jobs · 32 READY · 36 HOLD**.


## Skills / Runtime Contracts consolidation extension · 21/21

97. Input locks advanced to schema v6 with explicit current/legacy Skill runtime owners.
98. Hub catalog advanced to schema v5.
99. Primary product architecture remains 13 strands; Skills consolidation is P2 hygiene, not a fourteenth runtime.
100. Self-service catalog now contains 73 jobs.
101. 33 jobs are READY.
102. 40 jobs are dependency-gated HOLD.
103. Five new P2 prompts exist: Skills Census, Current Runtime Shelf, Compatibility Archive, Unified PDF/Card Viewer Core and Ink 3D Adapters.
104. Hub presentation explicitly keeps P2 READY work out of the default Today priority view while P0/P1 work exists.
105. Old `skills/EMBED_CUBE_PET_FULL_v2.2.md` exact blob remains pinned as legacy-general / current-for-24-CubePets evidence.
106. Current `kfb-rigs-embed-v3/EMBED_KFB_RIGS_v3.md` exact blob remains pinned and explicitly supersedes the old embed for KayKit/Graft/CapsuleCarl while keeping CubePets on their canonical stack.
107. Current CapsuleCarl/Wissens-Pilli rigging still records the `red` mouth set and texture-cleanup path.
108. Current Actor Platform brief still requires one reusable actor contract and forbids consumers from forking face/mouth/eyes.
109. Current CardBuilder/PDF SSOT explicitly rejects blind quarter-crop as a universal rule.
110. Deck Viewer v4 remains ACTIVE and `deckviewer/kfb-corpus.js` remains ACTIVE/SHARED in its current Housekeeping.
111. Current `kfb-corpus.js` proves IndexedDB caching, a document LRU and bounded parallel PDF/contact-sheet rendering.
112. Current Ink runtime remains the continuous `family:'band'` / `inkRibbon2D` one-fill implementation; no second “ring” canon was introduced.
113. Stale `skills/SOT_REGISTRY.md` still reports 2026-07-24 and routes Pet embedding through the old Cube-Pet instruction, proving reconciliation is required.
114. Current ToolBox UI brief already requires validated Hex/Copy/Colorpicker behavior and Texture/Surface routing through the existing material owner.
115. PR #204 changes remain architecture/chat documents only; no runtime Skill root was moved/deleted by this planning slice.
116. ToolBox Production milestone now explicitly retains Mouth/Viseme/Talk, Voice/Bubbles, Material Zones/Color/Texture Surface and Card/PDF viewer access.
117. Current Skills consolidation rule is compatibility-first: census/import scan before move/archive/delete.

Current catalog metrics:
**13 strands · 73 jobs · 33 READY · 40 HOLD**.


## Character / Resident production workflow extension · 17/17

118. Input locks advanced to schema v7 with Character/Resident workflow source pins.
119. Hub catalog advanced to schema v6.
120. Primary architecture remains 13 strands; this workflow extends Animation/Residents + ToolBox rather than creating another runtime.
121. Self-service catalog now contains 78 jobs.
122. 35 jobs are READY.
123. 43 jobs are dependency-gated HOLD.
124. Five new copy-ready briefs exist: Resident Band Module, Pose-to-Blender, Actor Family Factory, Named Missing Motion and Custom Legacy Actor.
125. All three new HOLD jobs name their exact source/dependency.
126. Resident Atlas S7 source blob is pinned at `20ef6153dcd4819fb6929a3c87e0e539aecdf4a3`.
127. Mixamo intake source blob is pinned at `5b3e28a5cb16ae945959b311273cdaa13886808d`.
128. Blender animation proof PR #192 current head = `b49fb6e1adde070d658e1cc21dadb3294164cb29`.
129. Orc Band PR #195 current head = `9dda7957a33e69926265c1e3a69028a4b35b26f0`.
130. Motion Library PR #197 current head = `bf0eace2332a48f0b220318ad7567c68cc6dfbad`.
131. Combat Legacy PR #10 current head = `663f0610eb960f322d67b078f1302d0c6178d1c2`.
132. Workflow explicitly sets browser-first pose/scene authoring and Blender-only technical-boundary work.
133. Frizzle-Orc 3 Rig-Warp / Musknacker / blank Legacy head accessories remain honestly SOURCE_REQUIRED rather than guessed.
134. Animation/Residents strand exposes `RESIDENT-BAND-MODULE-01` and `POSE-TO-BLENDER-01` as READY.

Current catalog metrics:
**13 strands · 78 jobs · 35 READY · 43 HOLD**.


## IK parity + execution/model dispatch extension · 20/20

135. Hub catalog advanced to schema v7.
136. Self-service catalog now contains 79 jobs.
137. 36 jobs are READY.
138. 43 jobs remain dependency-gated HOLD.
139. 79/79 jobs resolve a stable execution profile.
140. 79/79 jobs carry explicit current model, reasoning and budget metadata.
141. 79/79 jobs keep Work disabled as the default executor.
142. No job uses Cowork as the default primary profile; Cowork is explicit secondary/escalation only.
143. 79/79 catalog prompt sections exist in the copy-ready briefing sources.
144. 79/79 catalog prompt sections visibly include an `Execution profile` line.
145. Base Self-Service Job C explicitly carries `BLENDER_STANDARD`.
146. Base Self-Service Job D explicitly carries `WEB_DEEP` with bounded secondary Design/Blender roles.
147. Current Resident `chainOf()` builds the IK parent chain with `unshift`, giving the current typical proximal→distal order.
148. Current KFB `reachChain()` has no per-link `rotationMin/rotationMax`.
149. Current KFB `reachChain()` iterates the configured bones directly.
150. Upstream Three.js r184 `CCDIKSolver` supports per-link `rotationMin/rotationMax`.
151. Upstream r184 `CCDIKSolver` supports per-step `minAngle/maxAngle`.
152. Upstream r184 `CCDIKSolver` supports blend factor / quaternion slerp.
153. Upstream r184 `CCDIKSolver` has the small-angle early-out used to reduce vibration.
154. `IK-CCDIK-PARITY-01` is READY with `WEB_DEEP · GPT-5.6 Sol · high`, while retaining the current Resident Puppet/Studio owner until A/B passes.

Current catalog metrics:
**13 strands · 79 jobs · 36 READY · 43 HOLD**.

Current primary profile distribution:
- WEB_FAST: 5
- WEB_STANDARD: 40
- WEB_DEEP: 29
- BLENDER_STANDARD: 3
- BLENDER_DEEP: 2

Work/Cowork/Claude Design appear only as capability-specific secondary/escalation profiles where needed.


## Dispatch / WSA / recovery routing final checks · 4/4

155. `INPUT_LOCKS.json` parses as `kfb.production-architecture.v3-input-locks/8`.
156. `EXECUTION_DISPATCH_POLICY_2026-09-24.md` exists and is pinned on the architecture branch.
157. `WSA_HUB_V3_MOUNT_HANDOFF_2026-09-24.md` exists and routes the mount to existing HUB-CTRL #202 with `WEB_STANDARD`, not Work.
158. `ARCHITECTURE_CHAT_HANDOFF_2026-09-24.md` exists as the fresh-chat continuation/recovery entry for the architecture/planning role.


## RES-DISCO-01 additive planning validation · 2026-09-24

Scope: documentation/catalogue preparation only; no Resident runtime, animation binary or public Stage was changed in this checkpoint.

**Result: 9/9 PASS**

1. `HUB_BRIEFING_CATALOG.json` parses as JSON.
2. Catalogue count = **82** jobs.
3. READY count = **39**.
4. HOLD count = **43**.
5. `res-disco-01` occurs exactly once.
6. Animation & Residents `currentReady` contains `res-disco-01`.
7. `promptSection` resolves to the Self-Service Briefings heading.
8. Detailed `RESIDENT_DISCO_01_2026-09-24.md` exists on the architecture branch.
9. Planned review route uses the required direct Cloudflare surface: `https://kayfabizarro.pages.dev/kfb-hub/stage/resident-atlas/disco/`.

Existing formal architecture/source checkpoint remains the prior **158/158 PASS**. This 9/9 result is an additive planning/catalogue validation and is not misreported as a runtime/browser test.
