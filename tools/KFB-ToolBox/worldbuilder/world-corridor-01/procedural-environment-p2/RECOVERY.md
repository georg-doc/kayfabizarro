# RECOVERY · WC1 PROCEDURAL ENVIRONMENT · P2 → BUILDING B0

Status: **RECOVERABLE · P2 COMPLETE · NEXT = BUILDING B0**
Date: 2026-10-02
Owner: **KFB WorldBuilder / World Corridor 01**

## Fresh-chat instruction

Do **not** ask Georg to reconstruct the previous chat.

Recover from this file, then read:
1. `SOURCE.json`
2. `RETURN.md`
3. `P2_TEST_REPORT.md`
4. parent `../START_HERE.md`
5. parent `../RETURN.md`

GitHub state overrides chat memory.

## Exact lane

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/wc1-procedural-environment-p2-2026-10-02`
- Draft PR: **#316**
- base branch: `chatgpt-web/wc1-procedural-props-local-proof-2026-10-01`
- base head: `a5fefb273b274e40b3a1e642788c87113fa6ea27`
- P2 tested procedural head: `5f2a4444feed8f38883499de2a044f0e9e8b36eb`
- Stage: **none**
- merge: **none**
- Live: **none**

Always fetch the branch head before writing; documentation commits are newer than the tested implementation head.

## Last proven result

**P2_SOURCE_DERIVED_GEOMETRY_PASS**

The procedural environment vocabulary is broad enough to stop inventing more small-prop families before building work.

Source-derived procedural roles now cover:
- tree;
- pebble / boulder / accent rock;
- bush;
- log;
- stump;
- mushroom;
- grass.

Material/Clay remains a separate parallel lane.

## Exact source-object proof

Exact authored donor isolation happened **before** procedural transfer.

Source pin:
`a5fefb273b274e40b3a1e642788c87113fa6ea27`

Initial dedicated source run:
- run `36960716414`
- job `110693565332`
- artifact `11207717976`
- digest `sha256:9a430ac22b91bdcc66b04b8dcfe10089de66088b617734bb65b457dfa4c8dd17`

13/13 exact authored donors loaded:
- logs: `log`, `log_large`, `log_stack`
- stumps: `stump_old`, `stump_round`, `stump_roundDetailed`
- negative stump control: `stump_oldTall`
- mushrooms: `mushroom_red`, `mushroom_redTall`, `mushroom_redGroup`, `mushroom_tanGroup`
- grass: `Grass_1_A_Color1`, `Grass_2_A_Color1`

Verified:
- original donor materials;
- no KFB deformation;
- no material adaptation;
- no fallback;
- loaded bounds match catalog evidence;
- `stump_oldTall` remains explicit outlier/negative control.

## Procedural transfer proof

Geometry-only module:
`environment-family-p2.mjs`

Seven source-derived generated roles:
1. `SOFT_LOG_SEPARATOR`
2. `SOFT_LOG_STACK3`
3. `SOFT_STUMP_ROUND`
4. `SOFT_STUMP_DETAILED`
5. `SOFT_MUSHROOM_NORMAL`
6. `SOFT_MUSHROOM_GROUP3`
7. `SOFT_GRASS_TUFT`

Final combined PASS:
- tested head `5f2a4444feed8f38883499de2a044f0e9e8b36eb`
- run `37012562325`
- job `110855562506`

Source evidence:
- artifact `11228612568`
- digest `sha256:3d7d60220fdae97466b503c2237161c5d5f28f7f2fb754572d48482ebfaf0826`

Procedural evidence:
- artifact `11228413648`
- digest `sha256:162562b8da803cf4e9ae5d2a54b91036d59d84f6ee3382e23e2f6424ed108df9`

Final assertions:
- 13/13 source donors PASS;
- 7/7 generated geometries PASS;
- WebGL2;
- 0 display-material texture maps;
- 0 console errors;
- 0 page errors;
- 0 QA problems.

Hosted SwiftShader FPS is not representative product-performance evidence.

## Repair history

Exactly one repair pass was needed in the procedural-transfer gate.

Initial QA false-negative:
renderer memory reported one texture.

Diagnosis:
that texture was the viewer shadow map, not a prop/display material texture.

Repair Pass 1:
QA now measures actual display-material texture slots.

Geometry changed:
**NO**

Final run:
**PASS**

## Site / Production Control anchors

Workflow:
`WORLD-CORRIDOR-01`

Relevant checkpoints:
- props/trees human PROCEED: `e072b8e2-498a-460b-94e7-88b930f5336f`
- Use-what-works deformation routing: `748f9fbc-c863-43c1-8f93-9b2118879766`
- Polly × Rocko × Metropolis axis: `6e00f28e-ea81-4015-9f9c-3817ebef105e`
- P1 source-derived geometry PASS: `0042693b-5301-464b-9593-b699d07d8d5d`
- P2 exact source objects PASS: `e73b2e77-23a2-4dea-a744-4b455dee2e59`
- P2 source-derived geometry PASS: `d3a82471-38ad-43ce-bbba-a6f657760678`

## Binding design lineage for buildings

Do **not** derive buildings from the reduced P0B/P1/P2 prop deformation.

Use:

`Golden/deformed samples → Elastic Grotesque Clay V2 → City Cartoon/Grotesque → LandmarkElastic → LOOK-TORSION → FACADE_RULE v1 → KayKit/K-Kid identity`

Skewed cartoon perspective remains two-layered:
1. geometry deformation;
2. presentation lens/camera.

Do not bake camera distortion into geometry merely to fake the old look.

## Binding style grading axis

`Polly & Her Pals × Rocko's Modern Life × Fritz Lang / Metropolis`

Use as separate roles:
- **Polly** = designed graphic/perspective distortion;
- **Rocko** = characterful everyday cartoon architecture / wonky object language;
- **Metropolis** = urban hierarchy / monumental massing / stacked city drama.

Hivebound wording remains a softening constraint:
- cozy;
- cute;
- relaxing;
- smooth stylized 3D;
- soft rounded cushion forms;
- not low-poly;
- not pixel art.

It does not replace KFB building identity.

## Protected owners / non-goals

Do not introduce:
- a second renderer;
- a second WorldBuilder owner;
- a second material lane;
- a generic random-city generator;
- replacement hero branding/assets.

Protect:
- WB2 / WC1 renderer + world owner;
- Track Core;
- Race/Ground movement;
- authored Resident/KayKit/FrizzleBob hero assets;
- parallel Material/Clay lane.

## Parallel lane boundary

The material/Clay thread is independent.

Do not reopen Clay002/Derek/clay_floor/procedural-Clay arbitration here.

This form/building lane may use neutral/simple display materials until the form language is stable.

## Exactly one next gate

# PROCEDURAL BUILDING B0 · GOLDEN FAMILY SPEC

Outcome:
define the **first normal everyday low-rise procedural building family** from actual accepted/deformed KFB donors.

B0 must identify:
- exact Golden source sample(s);
- exact source path/pin;
- ordinary low-rise/everyday role;
- body deformation field;
- base anchoring;
- roof coupling through the same deformation field;
- FACADE_RULE behavior;
- role-bounded variation;
- geometry vs lens/perspective responsibility;
- Polly / Rocko / Metropolis grading;
- KayKit/K-Kid identity traits to preserve;
- explicit exclusions.

B0 must **not**:
- start from prose alone;
- invent a generic “wonky house” system;
- pick universal bend/twist/taper numbers without donor evidence;
- implement a whole city generator;
- decide materials;
- create a human Stage before there is a meaningful integrated visual decision.

After B0 source/spec extraction, the next implementation should prove one normal building family in source isolation before integration.
