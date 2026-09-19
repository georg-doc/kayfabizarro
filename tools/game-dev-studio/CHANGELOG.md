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


## 2026-09-19 · GDS-06 · Charming Kitchen Module Kit candidate / archived fail

### USER DIRECTION
- Build Dungeon-Generator equivalents across all KayKit + Tiny Treats packs.
- First analyse each pack, create 3D previews/sample builds, expose the modules through Asset Librarian, then prepare Game Development Studio packages before ToolBox/Builder/Generator consumers.

### SOURCE / CREATED
- Tiny Treats Charming Kitchen 1.1 analysed from the central Registry.
- 118/118 GLTF models classified; 0 unclassified.
- Build 69 · Furnish 26 · Story 23.
- CC0-1.0 source license pinned.
- Module Library, Pack Profile, Generator Profile and three sample recipes created.
- GDS metadata candidate created without copying source assets.

### TESTED RESULT
- repository-native source/static checks passed;
- browser Module-Kit integration did **not** boot;
- final repair run `35461231731` failed at Chromium parse of Librarian `app.js`, CDP line 174 / column 96;
- browser sample assertions reached: 0.

### DECISION
- two product repair passes consumed on the same browser gate;
- no third repair;
- frozen product head `a5a8fcfb25e2ec89ab4346a812870d5b18bf91e6`;
- status `ARCHIVED_FAILED_CANDIDATE`;
- GDS metadata is salvage only, not a current package.

### GAME DEV STUDIO CLI
`GAME_DEV_CLI_UNAVAILABLE · OPTIONAL FALLBACK USED`

No package-build, package-verify or vendor-admission receipt exists.

### NEXT GATE
GDS stays out of the immediate repair. First prove one clean six-asset wall-grammar sample in the existing Asset Librarian from current main.
