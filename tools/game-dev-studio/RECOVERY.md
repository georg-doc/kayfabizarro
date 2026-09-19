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

## KAYKIT CREATOR RESEARCH · 2026-09-19

Additive research lane created:

- `research/KAYKIT_CREATOR_LESSONS_LIVING.md`
- `research/KAYKIT_CREATOR_LESSONS_SOURCE.json`
- `research/KAYKIT_CREATOR_LESSONS_TEST_REPORT.md`
- `research/KAYKIT_CREATOR_LESSONS_RETURN.md`

Current source pass starts with Kay Lousberg's detailed KayKit character/Godot tutorial and current official KayKit pack documentation. Engine-independent lessons are separated from KFB inference/proposals.

Primary consequences recorded, **not yet implemented as schema/runtime changes**:
- rig-family compatibility (`Rig_Medium` / `Rig_Large`) as explicit metadata;
- animation library separate from character identity;
- bone/socket attachment profiles with calibrated local transforms;
- semantic asset family vs recolor/texture/separate-part variants;
- staged retargeting evidence;
- current-vs-legacy KayKit generation;
- browser-first neutral Rig Bench and Platformer interactive-donor bench proposals.

Owner boundaries remain unchanged: Asset Librarian owns source discovery, ToolBox/FrankenStein/Animation own their authoring domains, consumers own gameplay/state/physics, Game Dev Studio owns package-facing evidence/research presentation.

**Research next gate:** deep-review KayKit Live Show Episodes 0–4 and append modeling grammar (primitives, proportions, bevels, origins/pivots, material/atlas use, part splitting and variation decisions). This research gate does not displace the Pilot 01 runtime/consumer gates below.

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
