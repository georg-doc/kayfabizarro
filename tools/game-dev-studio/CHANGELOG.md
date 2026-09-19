# KFB Game Dev Studio · Additive Changelog

## 2026-09-18 · GDS-01 · permanent tool + preview lane

### USER DIRECTION
- Keep Game Development Studio as a permanent KFB production lane.
- Expose assets/packages with previews at a fixed Cloudflare URL.
- Use existing `tools/` and Asset Librarian/Registry as source infrastructure, but do not copy the Librarian's UI/UX pattern.
- Add this lane to `/kfb-hub/free-roam/`.
- Maintain recovery + additive changelog after substantive turns.

### DECISION
- `tools/game-dev-studio/` owns the small presentation catalog + recovery docs.
- `game-ready/` owns package metadata/derived package artifacts.
- `/kfb-hub/free-roam/game-dev-studio/` is the human-facing permanent page.
- Public previews use pinned GitHub source revisions.
- Librarian remains a source/registry donor, not the UX shell.

### IMPLEMENTATION
- Added data-driven package catalog.
- Added permanent public Game Dev Studio site with direct 3D previews.
- Added Free Roam navigation card.
- Added tool/recovery redirect and documentation wiring.
- Added downstream integration note to Librarian README.
- Added Game-Ready index link back to the public preview lane.

### TESTED RESULT
- Source/model preview URLs are exact pinned GitHub refs.
- Static public/browser deployment proof is still separate and must be verified after Pages deployment.

### PUBLIC DEPLOYMENT
- Target URL defined; verification pending after this GitHub update.

### GEORG ACCEPTANCE
- Pending first visual review of Game Dev Studio UI/previews.

### OPEN
- First public Cloudflare check.
- Binary Sedan collider generation/validation.
- Real consumer gates.


## 2026-09-18 · GDS-02 · first real Cloudflare proof

### IMPLEMENTATION
- Added repeatable Playwright proof at `kfb-hub/free-roam/game-dev-studio/qa/public.mjs`.
- Added workflow `.github/workflows/game-dev-studio-public.yml`.
- Test targets the actual fixed `kayfabizarro.pages.dev` URL, not GitHub Pages or localhost.
- Intended checks include catalog identity, four preview assets, WebGL Studio boot, Lorekeeper preview, Sedan preview, Sedan evidence overlay and pinned 40-character GitHub revisions.

### TESTED RESULT
- GitHub Actions run `35368827693`, attempt 1: **FAIL** at the first deployment gate.
- Exact failure: `https://kayfabizarro.pages.dev/tools/game-dev-studio/catalog.json` did not expose the current catalog during 30 × 10 s polling.
- Browser/WebGL steps were therefore never reached. This is not evidence that the viewer or models are broken.
- A second run attempt was started after all navigation/recovery wiring was committed.

### DEPLOYMENT FINDING
- Repository root contains `wrangler.jsonc` with asset directory `.`.
- No repository workflow references `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` or a Wrangler deployment action.
- No Cloudflare deployment plugin/connector is currently available in this chat.
- GitHub Pages deployment evidence remains separate and is not accepted as proof for the requested Cloudflare URL.

### OPEN
- Resolve whether the existing Cloudflare project auto-syncs the current `main` head or requires an external/manual Wrangler deployment.
- Do not label the Game Dev Studio URL PUBLIC PASS until the actual pages.dev workflow succeeds.


## 2026-09-18 · GDS-03 · public Cloudflare browser pass

### PUBLIC DEPLOYMENT / TESTED RESULT
The unchanged public proof passed on run `35368827693`, attempt 2 after deployment propagation.

- job: `105680028742`
- artifact: `10557444939`
- artifact SHA-256: `cea1a31ec087aaa697deb7c64b00f078c502735056473ee0cdb02deaa56a24ac`
- fixed public URL: `https://kayfabizarro.pages.dev/kfb-hub/free-roam/game-dev-studio/`
- catalog URL: `https://kayfabizarro.pages.dev/tools/game-dev-studio/catalog.json`

**11/11 public checks PASS:**
catalog deployed; four preview assets; fixed page HTTP; Studio/WebGL boot; four asset controls; Lorekeeper preview; Sedan preview; Sedan evidence overlay; pinned source revisions; tool route HTTP 200; zero browser errors.

The first attempt remains useful deployment-propagation evidence; no code/model repair occurred between the two attempts.

### HUMAN ACCEPTANCE
Still PENDING. Automated public delivery and WebGL preview evidence do not approve presentation quality or consumer behavior.


## 2026-09-18 · GDS-04 · Living Plant package registered as backlog

### SOURCE
Plant Prop Lab prepared under:
`skills/chat/workflows/PLANT_PROP_LAB_2026-09-18/`

Tiny Treats House Plants source is unpacked in GitHub; Quaternius Sci-Fi botanical donors and KFB EyeRig v6 are identified.

### DECISION
Register `GameReadyPlantPackage` as a later Game Dev Studio package type:
- exact pot/plant source refs;
- PlantRecipe;
- procedural pot-style recipe;
- transform-based prop rig;
- optional existing EyeRig adapter;
- support/collider proxy;
- VFX/SFX hooks;
- LOD/instancing notes;
- consumer evidence.

### BOUNDARY
This is **P2 / BACKLOG** and does not expand or replace active Pilot 01 (Lorekeeper + Sedan). No catalog entry is added until an actual package exists.


## 2026-09-18 · GDS-04 · Race owner Sedan handoff

### CREATED
Additive cross-repo handoff:

`georg-doc/KFB-Stunt-Car-Race/_handover/GAME_DEV_STUDIO_SEDAN_PACKAGE_2026-09-18.md`

Commit: `3286ed5315c837753d1efe93d5580460ee9b8642`.

### BOUNDARY
- No Race runtime patch was made by Game Dev Studio.
- FR-S04-02 remains immutable.
- The Race/Free-Roam owner receives exact package refs and decides when to create the next Sedan receiver candidate.
- Existing 62/62 FR-S04-02 evidence remains donor evidence, not Sedan acceptance.

### NEXT OWNER GATE
Mount exact `car_sedan.gltf`, numeric body proxy and four real wheel nodes in a later immutable receiver candidate; rerun the applicable handling/contact checks; keep human feel separate.


## 2026-09-18 · GDS-05 · Lorekeeper Travel owner handoff

### CREATED
- Package-local Travel adapter and handoff under `game-ready/pilot-01-lorekeeper-sedan/resident/lorekeeper/`.
- Additive Travel-owner brief: `georg-doc/KFB-Travel-Globe/_handover/GAME_DEV_STUDIO_LOREKEEPER_PACKAGE_2026-09-18.md`, commit `8614282aab2ced43bb5dda9fcf7abadf9768100a`.

### CURRENT GATE
Travel's repaired Ground state has public automated evidence, but the current Georg Ground human gate is still open. The Lorekeeper runtime import is therefore explicitly DEFERRED.

### OWNER BOUNDARY
The package supplies actor + lectern + Staff relative composition, Rig/animation refs and attachment calibration. Travel retains spherical placement, Hex/support semantics, ROAD, camera, locomotion and persistence.

### OPEN
After the Ground human gate carries, run the existing Travel Atlas Pilot 01 across `VISIBLE_HEX | SEATED_HEX | NO_VISIBLE_HEX`; do not create a parallel pilot.


## 2026-09-19 · GDS-06 · KayKit Creator Lessons living research

### USER DIRECTION
Analyze Kay Lousberg's own KayKit creator videos/how-tos, beginning with the detailed Godot character video, extract what KFB can apply even without Godot, and preserve the findings as an additive living document.

### CREATED
- `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_LIVING.md`
- `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_SOURCE.json`
- `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_TEST_REPORT.md`
- `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_RETURN.md`

### PRIMARY FINDINGS
- KayKit character identity, rig family, animation library, materials/textures and attachments are separable concerns.
- `Rig_Medium` and `Rig_Large` are explicit compatibility classes.
- reusable attachments require socket/bone target plus calibrated local transform.
- recolors/textures/separate pieces should be grouped under semantic asset families rather than counted as unrelated design assets.
- animation state machines remain consumer logic; packages should expose clips/tags/timing facts.
- retargeting needs staged rig-map → clip → library → visual/consumer evidence.
- a neutral Rig Bench/mannequin is a useful pre-consumer validator.
- current-vs-legacy KayKit generation must remain visible.
- Platformer buttons/switches are exact visual/mechanical donors; KFB interaction motion is a separate owned layer.
- Live Show / Mixed Bag demonstrates that eclectic props stay coherent through shared geometry/material grammar.

### BOUNDARY
No Asset Registry schema, runtime, binary, rig, animation or gameplay behavior was changed by this research pass. Proposed fields and benches remain proposals until their existing owners accept a bounded slice.

### EVIDENCE
Base main head: `a92e3c70029d811b76a88a15459adc20fea943bb`.

Documentation checkpoints were fetched back after every write; detailed counts and limitations are in `KAYKIT_CREATOR_LESSONS_TEST_REPORT.md`.

### NEXT RESEARCH GATE
Deep-review KayKit Live Show Episodes 0–4 and append creator modeling grammar: primitives, proportions, bevels, origins/pivots, part splitting, material/atlas usage and variant decisions.


## 2026-09-19 · GDS-07 · KayKit animation timing synthesis

### SOURCE
Added creator video:
`KayKit - Animations - Overview Set 1`
https://www.youtube.com/watch?v=T1KNCtAqJ7A

The video is treated as an older **visual animation overview**, not as current inventory truth or a state-machine how-to. Current implementation facts were rechecked against KFB main and the current official Character Animations source.

### CURRENT REPO EVIDENCE
At main `3d9ac78bfabcec0c43fc453c124133764221139c`:
- Rig_Medium motion Registry: **139 motions / 8 sets**;
- MovementBasic: 11;
- MovementAdvanced: 13;
- General: 15;
- CombatMelee: 22;
- CombatRanged: 20;
- Simulation: 14;
- Special: 15;
- Tools: 29;
- no explicit `Sprint` clip;
- Mixed Bag shard: **47 assets = 41 GLTF models + 6 PNG images**, pinned to source commit `378b209355b13304e3cff656ec0806ca5b89df28`.

### RESEARCH DECISION
The useful KFB synthesis is:
- phase-sync Walk/Run transitions rather than reset-to-frame-zero;
- measured speed ↔ playback-rate calibration;
- hysteresis around locomotion speed bands;
- optional temporary warp during crossfade;
- physics-owned Jump_Start → Jump_Idle → Jump_Land;
- phase-relative combat release/contact markers;
- entry/loop/exit interaction graphs;
- stance/equipment participates in locomotion selection.

### BOUNDARY
No runtime state machine, consumer movement, Registry schema or Animation Lab implementation changed in this pass.

### NEXT GATE
**KCL-M1 · Locomotion Sync Bench** — one current Rig_Medium actor, Walking_A/B/C + Running_A/B only, measurement and A/B evidence before any consumer integration.
