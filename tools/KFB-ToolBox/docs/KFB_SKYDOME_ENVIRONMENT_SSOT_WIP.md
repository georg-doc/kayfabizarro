# KFB Skydome + Environment SSOT/WIP

Status: **CURRENT SHARED ENVIRONMENT WIP v0.1**  
Date: 2026-10-01  
Owner: current receiving World/Hex/Island environment owner  
Companion: `KFB_CLAYMATION_STYLE_SSOT.md`  
Claude workflow: `KFB_HX1_SKYDOME_ENV_2026-10-01`

This is the stable read-first route for KFB sky shells, time of day, weather, atmosphere and clay-cloud anatomy. It is a WIP contract, not a claim that the complete environment stack is already integrated or accepted.

## Short rule

**One EnvironmentHost, one active sky shell, one shared time/weather/light stack.**

Do not build a second renderer, clock, fog writer, sun, lighting owner or weather loop. Do not replace the named cloud donor with generic sphere clusters.

## Source lock

### Production Control brief and manifest

- workflow: `KFB_HX1_SKYDOME_ENV_2026-10-01`;
- brief: `CD-HX1-SKY-01_CARD_SPINDLE_TINYSKIES_ENVIRONMENT_INTEGRATION.md`;
- brief fileId: `b4c2458b-0814-463f-8a0b-478837539783`;
- brief SHA-256: `a6b4ec902cff0a100fe69728cc80d332275cd5d30dea6245c31cb7a39ae58d9c`;
- source manifest fileId: `c81a2f7a-7565-49aa-8194-f5da27fd2c7d`;
- source manifest SHA-256: `e0f53716a4753a1ac84819506abd388303d4c67297ffed76bf91683642c28c72`.

Pinned source heads:

- KFB mirror: `georg-doc/kayfabizarro@a4e0503273e0672ba84e585317ca999d324acc3a`;
- Travel: `georg-doc/KFB-Travel-Globe@8614282aab2ced43bb5dda9fcf7abadf9768100a`;
- TinySkies: `georg-doc/tinyskies@2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`;
- Combat Spindle: `georg-doc/KFB-Combat-Arena`, branch `wsa/ca2-kaykit-prep-2026-09-20`, head `735b5449bf09fb1a069d4a81db44608a58166677`.

### Cloud anatomy donor

Canonical donor:

`media/3D_Assets/KFB/Clouds by Jarlan Perez - b3Kia9N2fS2.glb`

- Git blob: `acd9d653f31f249d0bcf11a8b6311594a9d6e153`;
- size: 201,576 bytes;
- state: **SOURCE DONOR · NOT YET GOLDEN**.

This GLB defines the base anatomy and silhouette language for the KFB clay-cloud family. A loaded URL is not sufficient proof: the exact donor must first be shown in isolation.

## Environment ownership

The receiving scene owns exactly one `EnvironmentHost` with:

- one scene, camera, renderer and clock;
- one fog state;
- one sun/light-rig state;
- one time-of-day state;
- one weather state;
- one mood/palette state;
- one active sky shell and deterministic disposal of the previous shell.

The host does not take ownership of terrain, Track Core, Race, movement, gameplay camera or persistence.

## Three sky shells

1. **TinySkies Gradient** — radial/gradient atmosphere without opaque dome geometry.
2. **Travel Skydome** — existing Travel shell following the camera; it does not become a second time/light owner.
3. **KFB Card-Spindle** — extracted Combat donor with six real KFB card motifs, funnel and upper/lower closure.

Never run two opaque shells at the same time.

Extraction target for the Combat donor remains:

`kfb.environment.spindle-sky/0.1-candidate`

Lifecycle remains:

`mount(parent, ctx)` · `setPreset(...)` · `setPalette(...)` · `update(dt, signals)` · `probe()` · `dispose()`

## Shared atmosphere stack

Reuse the pinned current modules:

| Module | Blob | Responsibility |
|---|---|---|
| `sky-presets.js` | `04dd730ee735f064888e8472eff79583f17bebb0` | Day / Evening / Night presets |
| `day-night.js` | `f5386acba48d69d51d688d876689490bf688b55d` | single time-of-day writer |
| `sky-atmosphere.js` | `1fae8d4e58285f8d4728b0947d3d5f05dbc3af62` | Aurora + God Rays |
| `lens-flare.js` | `c3d9d145a8607207cd5d0598d1f4883b8cc61fb7` | flare from the actual host sun |
| `rain-overlay.js` | `679defc912b2648a04778a3154ed9c0553dee30f` | screen-space rain; no snow |
| `starfield.js` | `e29272e144cd1885bd703fbd23fbe9641d15ffde` | night depth |
| `sun-shadow.js` | `6745a0c8cc7f71cd50a86181cae0817b57245f59` | player-neighbourhood sun shadow recipe |
| `light-budget.js` | `fd4659ae2924ea6ecbfd068a9b065a2f3967e6c6` | measurement only |
| `weltstimmungen.js` | `2747a526e2aa38989c9c4052304da8733662b61c` | hue-family mood; not brightness rewrite |
| Travel `skydome-shader.js` | `919ed27bb4ab5a6bb9b823421804d73cb5ae64bd` | Travel shell families |

Preserve source behaviour:

- night weights Aurora; day/sun weights God Rays;
- Lens Flare uses the existing host sun and day weight;
- Rain is an overlay, not a second renderer or invented 3D rain system;
- TinySkies rain currently has no snow;
- mood changes hue family only;
- sky shells do not cast or receive dynamic shadows.

## Clay-cloud anatomy contract

### What must be preserved

The Jarlan donor supplies the cloud family's recognizable anatomy:

- asymmetric large and small lobes rather than equal spheres;
- a readable primary mass with secondary bulges;
- a flatter lower belly and a softer, irregular upper silhouette;
- visible overlap and depth between lobes;
- compact toy-like proportions suitable for near, middle and far readings.

Do not replace this with procedural ball piles, particle puffs, metaball defaults or unrelated cloud packs.

### Allowed variation

Create a small prebaked family from the isolated donor anatomy. Variants may use:

- deterministic lobe selection and recombination from the donor;
- bounded non-uniform scale, squash/stretch, yaw and mirroring;
- bounded lobe offsets that preserve overlap and the lower-belly silhouette;
- caller-provided clay palette and stable seed;
- near/mid/far LODs or impostors after the full form is accepted.

Variants must remain recognizably related. Randomized topology per frame is forbidden.

### Clay treatment

- Follow `KFB_CLAYMATION_STYLE_SSOT.md`; do not invent a new cloud shader.
- First show unchanged donor, then clay candidate under the same camera/light.
- Keep hand detail at cloud scale; no terrain-scale fingerprints.
- Prevent bright seams between lobes through the shared contact/AO treatment.
- Avoid transparent sorting noise unless transparency visibly improves the accepted form.
- Preserve soft daylight, sunset and night readability without self-illumination hacks.
- The first accepted cloud becomes the Golden comparison for later variants; until Georg accepts it, the family stays `TUNE`.

### Performance contract

- prebake a bounded number of shared geometries;
- instance repeated clouds when the receiving renderer supports it;
- variation travels through instance attributes/seed, not cloned heavy geometry;
- distance reduces microdetail before silhouette;
- prove the same camera with 0, 4, 12 and 24 clouds;
- record triangles, draw calls, materials, frame time and visible artifacts;
- do not claim a win by hiding islands, track, vehicle or atmosphere effects.

## Mandatory E0–E4 gates

### E0 · Exact sources isolated

Show the actual TinySkies atmosphere stack and the unchanged Jarlan cloud donor. For the cloud, show front, side and three-quarter silhouette plus mesh/object inventory.

### E1 · Travel shell isolated

Show one procedural Travel mode and one static/watercolor mode with camera-follow and horizon seam evidence.

### E2 · Combat Card-Spindle isolated

Show the exact donor with six KFB card motifs, funnel and upper/lower closure. An approximation fails.

### E3 · Standalone candidates

Prove both:

- `kfb.environment.spindle-sky/0.1-candidate` lifecycle and repeated disposal;
- a compact clay-cloud family derived from the pinned Jarlan anatomy, including unchanged source and near/mid/far A/B views.

### E4 · Receiving HX1/WorldBuilder integration

Prove:

- `TinySkies → Travel → Spindle → TinySkies` hot switching;
- Day / Evening / Night / Auto;
- Clear / Rain;
- Aurora/God Rays relationship;
- Lens Flare from the real sun;
- accepted cloud family in the same island/track scene;
- a 10-cycle switch leak test;
- 0/4/12/24-cloud performance measurements.

Do not rebuild terrain, Track Core, Race, movement or gameplay camera in this slice.

## Stage and status truth

Reserved module route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/modules/spindle-sky-v1/`

Current status: **PLANNED · NOT DEPLOYED · NOT LIVE**.

Claude Design produces local/design evidence and returns it to Production Control. A later receiving-owner integration step creates GitHub/Stage evidence. No Claude pass may silently promote the planned route.

## Required return

Return exact source refs, files changed, E0–E3 isolation images, E4 integrated images, cloud source/candidate comparisons, EnvironmentHost signal schema, shell lifecycle results, performance table, observed defects and exactly one next gate.

## Exactly one next gate

**Claude Design executes E0–E4, including the pinned Jarlan cloud-anatomy family, and returns one integrated environment candidate to KFB Production Control. No GitHub or Stage promotion occurs in that Claude pass.**
