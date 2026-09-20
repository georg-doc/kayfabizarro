# KFB Game Dev Studio · Recovery

**Date:** 2026-09-18  
**Public target:** https://kayfabizarro.pages.dev/kfb-hub/free-roam/game-dev-studio/  
**Tool home:** `tools/game-dev-studio/`

## CURRENT

Pilot 01 is the active package:

`game-ready/pilot-01-lorekeeper-sedan/`

Current package state:

```text
SOURCE REVIEW      PASS
PACKAGE METADATA   IMPLEMENTED
STRUCTURAL QA      PARTIAL PASS
BINARY DERIVATIVE  BLOCKED_TOOL_UNAVAILABLE
CONSUMER TEST      NOT RUN
HUMAN ACCEPTANCE   PENDING
```

The package contains Lorekeeper + Tome/lectern + Staff, exact BOX1 `car-sedan`, wheel/socket evidence, source-derived collider proxy spec, physics/deformer handoff, shared gameplay/VFX/SFX event maps and consumer test plan.

## PUBLIC / PREVIEW LANE

Public target:

`https://kayfabizarro.pages.dev/kfb-hub/free-roam/game-dev-studio/`

Public proof workflow:

`.github/workflows/game-dev-studio-public.yml`

Latest evidence:
- run `35368827693`, attempt 1: **FAIL before browser boot** because `/tools/game-dev-studio/catalog.json` was not deployed on the real `kayfabizarro.pages.dev` host during the five-minute polling window;
- therefore no WebGL/preview failure is established by attempt 1;
- attempt 2: **PUBLIC BROWSER PASS** against the same fixed public URL after deployment propagation;
- real Cloudflare proof: run `35368827693`, attempt 2, job `105680028742`, artifact `10557444939`, artifact SHA-256 `cea1a31ec087aaa697deb7c64b00f078c502735056473ee0cdb02deaa56a24ac`;
- no Cloudflare deployment credential/workflow is present in repository source, and no Cloudflare deployment connector is available in this chat.

The new public Game Dev Studio site is data-driven from:

`tools/game-dev-studio/catalog.json`

Public checks passed: 11/11:
- catalog deployed;
- four preview assets;
- fixed page HTTP;
- Studio/WebGL boot;
- four asset controls;
- Lorekeeper default preview;
- Sedan preview selection;
- Sedan evidence overlay enabled;
- pinned GitHub revision links;
- tool route HTTP 200;
- zero browser errors.

Human visual acceptance remains pending.

Initial preview set:

- Lorekeeper;
- Lorekeeper Tome / lectern;
- Lorekeeper Staff;
- BOX1 Sedan.

The Sedan preview may additionally show the persisted proposed chassis AABB and wheel-node markers. This is visualization of package evidence, **not** a generated/validated binary collider.

## OWNER BOUNDARIES

- canonical asset identity/provenance → Asset Registry / Librarian / exact GitHub source;
- resident rig / motion compatibility → ToolBox / Animation receiving owner;
- vehicle physical pose/contact → selected Race / Free-Roam receiver;
- Travel → world / mode / persistence;
- Game Dev Studio → package metadata, explicit derived assets when actually produced, preview/recovery surface.

### Sedan receiver adapter

Current receiver donor is pinned to `fr-s04-02` (62/62 public donor checks PASS). The package now has an explicit source-derived adapter contract:

- `game-ready/pilot-01-lorekeeper-sedan/vehicle/car-sedan/FR_S04_02_RECEIVER_ADAPTER.json`
- `game-ready/pilot-01-lorekeeper-sedan/vehicle/car-sedan/FR_S04_02_RECEIVER_HANDOFF.md`

Important: FR-S04-02 still uses the original kart. The adapter is implementation-ready metadata, not a Sedan consumer PASS.

The first receiver probe can use the numeric AABB proxy directly with Rapier; the missing binary chassis GLB remains a separate Studio producer-capability gate.

### Race owner handoff

Additive owner brief created in `georg-doc/KFB-Stunt-Car-Race`:

`_handover/GAME_DEV_STUDIO_SEDAN_PACKAGE_2026-09-18.md`

Commit: `3286ed5315c837753d1efe93d5580460ee9b8642`.

It requests no runtime patch by itself and preserves FR-S04-02 immutably. It gives the Race/Free-Roam owner exact package refs, numeric-proxy path, real source-wheel binding and Sedan-specific regression gates for the next scheduled candidate.

### Lorekeeper Travel consumer handoff

Package-local mapping:

- `game-ready/pilot-01-lorekeeper-sedan/resident/lorekeeper/TRAVEL_ATLAS_PILOT_01_ADAPTER.json`
- `game-ready/pilot-01-lorekeeper-sedan/resident/lorekeeper/TRAVEL_ATLAS_PILOT_01_HANDOFF.md`

Additive Travel owner brief:

`georg-doc/KFB-Travel-Globe/_handover/GAME_DEV_STUDIO_LOREKEEPER_PACKAGE_2026-09-18.md`

Commit: `8614282aab2ced43bb5dda9fcf7abadf9768100a`.

**Gate remains binding:** current Travel Ground human review must carry before Lorekeeper runtime import. This is READY input, not a Travel consumer PASS.

## NEXT

1. keep the verified Cloudflare preview proof green after catalog/UI changes;
2. produce + inspect + validate `car-sedan-chassis-proxy.glb` when the Game Development Studio CLI is available;
3. after the current Travel Ground human gate carries, execute the existing Atlas Pilot 01 with the prepared Lorekeeper package handoff;
4. execute the Sedan gate only in the Race/Free-Roam owner from the prepared FR-S04-02 handoff;
5. bind exact existing SFX source refs;
6. only then decide batch expansion.

## BACKLOG

After Pilot 01 gates:

- CameraRecipe / HeroShotRecipe;
- TransitionRecipe;
- MomentReceipt / JourneyEntry;
- Rule-of-Three SceneKit;
- dungeon/instance transition proof;
- **Living Plant / Plant Prop package** from `skills/chat/workflows/PLANT_PROP_LAB_2026-09-18/`: pot+plant recipe, pattern style, prop rig and optional existing EyeRig adapter. **P2 / BACKLOG only; do not displace Pilot 01 consumer gates.**

See `GAME_DEV_STUDIO_ASSET_PACKAGING_LIVING.md`.

## 2026-09-20 · Theatre Curtain v1 · public technical gate

Draft PR: `#114`  
Owner: KFB Game Dev Studio  
Fixed Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/theatre-curtain-v1/`

Current evidence:
- isolated pinned Three.js compute-cloth donor;
- reusable two-panel CPU Verlet/WebGL curtain fallback;
- four exact KFB PBR fabric sets;
- opening/closing through moving supported top targets and cloth gathering;
- local/browser state contract: **22/22 PASS**;
- exact Cloudflare Stage browser proof: **25/25 PASS**, run `35479125591`;
- zero public failed resources and zero browser errors.

The one failed follow-up run was test timing only: the proof sampled `closing` after a fixed 350 ms delay even though `openProgress` was already zero. Commit `3bdfdd2e9de648871102d91c89612a5b7ee3c4ab` changed only the wait condition; runtime/material/physics code did not change.

Human visual/physics acceptance remains open. Do not merge or integrate into consumers yet.

Exactly one next gate:
Georg reviews weight/folds, idle wind, side gathering, closing, impact and fabric choice on the isolated Curtain Stage.

Deferred until after that gate:
aging/burn/stain/torn decals; lower-third tieback/swag presets; card breach/ripple/dissolve; production WebGPU backend; Shader Pool / Texture Cauldron research.



## 2026-09-20 · Eumel 2.5D candidate package

A second **candidate package** is registered:

`game-ready/eumel-2p5d-actor/`

It does not replace Pilot 01 as the existing active package/gate.

Source chain:

`DocCheck Illustrator → 2D Animation Studio source-exact components → three2p5d adapter → game-ready metadata → named consumer`

Current evidence:

- source/component pins: PASS;
- package metadata: IMPLEMENTED;
- upstream three2p5d static sanity: PASS;
- browser three2p5d proof: PENDING;
- Resident candidate: PREPARED, NOT INDEXED;
- DocCheck Project Island handoff: PREPARED;
- named KFB game runtime: not selected yet;
- human acceptance: PENDING.

Catalog note:

`tools/game-dev-studio/catalog.json` now contains this package, but the current public Studio UI still renders `packages[0]` only. No package-selector/public Eumel preview is claimed by this registration.

Next Eumel gate remains the isolated three2p5d browser/visual review before Resident or Project-Island runtime work.
