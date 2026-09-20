# WSA Handoff · Resident Scene Modules / Resident Atlas S33

**Date:** 2026-09-19  
**Status:** `HANDOFF READY · WSA REVIEW`  
**Implementation SSOT:** `georg-doc/kayfabizarro`  
**Existing integration lead:** **WSA** — unchanged.

## 2026-09-19 REVIEW UPDATE

Before using this handoff, read:

`GEORG_REVIEW_FAIL_C0_2026-09-19.md`

The later C0 consumer proof produced a **GEORG VISUAL REVIEW FAIL**. `juggle-cascade-v1` is **not accepted**; arm/catch/club-clearance review remains open. Technical mount/browser PASS must not be interpreted as visual acceptance.

## GOAL

Hand WSA one bounded resident-scene package that can later be consumed by the KFB Free Roam Platformer or other KFB runtimes without creating a second movement, collision, camera, quest, animation or world owner.

First proof:

`Clown · Juggling Island Module v1`

The module reuses the existing Resident Atlas S6 Clown vignette and exact KayKit props, adds the measured 3-club activity, and exposes a thin mount/update/dispose seam. The receiving Platformer remains responsible for the floating island, support/collision, player movement, camera and persistence.

## CURRENT SOURCE / REVISIONS

Current repository state at handoff branch creation:

- repository: `georg-doc/kayfabizarro`
- current main when handoff started: `1e9318954c584e8af8498024fd1342e61b604faf`
- S33 implementation merge: `c867788416c50fa9c6e6ce57abc4bad85dca90d1`
- S33 PR: `#85`
- exact S33 runtime source pin used by the Clown module manifest: `be4843354c5cf420ddecbb25ed5a51aa5f21ca18`
- Resident Atlas asset pin: `891eadf01e218f5fc21387e64cea1fec8332c5b6`
- shared KayKit animation pin: `aa16a777a970f23d3f11fb3c23dc40718b04fa88`
- Platformer pack candidate pin from the current Claude export: `eb48f50489b9e4903ec1e3d2fb1837605ce7d792`

Read in this order:

1. this file;
2. `SOURCE_STATE.json`;
3. `RETURN.md`;
4. `TEST_REPORT.md`;
5. `BACKLOG.md`;
6. `tools/resident_atlas_s6/docs/ATLAS_RETURN.md`;
7. `tools/resident_atlas/modules/README.md`;
8. only then inspect implementation files.

## EXACT IMPLEMENTATION FILES

Resident/activity owner lane:

- `tools/resident_atlas_s6/data/cast.js`
- `tools/resident_atlas_s6/lib/atlas.js`
- `tools/resident_atlas_s6/lib/juggle-math.js`
- `tools/resident_atlas_s6/KFB_Resident_Atlas_S6.html`
- `tools/resident_atlas_s6/tests/test-juggle-module.mjs`
- `.github/workflows/resident-scene-modules-cloudflare-qa.yml` — canonical Cloudflare browser proof; not a runtime owner.

Plug&Play seam:

- `tools/resident_atlas/modules/index.json`
- `tools/resident_atlas/modules/clown-juggling-island.module.json`
- `tools/resident_atlas/modules/runtime/s6-resident-module.js`
- `tools/resident_atlas/modules/README.md`

## PROTECTED BOUNDARIES

Do not silently replace or merge owners.

- Resident Atlas S6 owns resident vignette / rig / pose / prop / activity evidence.
- Asset Registry / exact GitHub paths own asset identity/provenance.
- The scene-module adapter owns only mount/update/dispose presentation.
- Free Roam Platformer owns platform assembly, SOLID collision, player movement, jump/contact truth, camera, portal behavior and persistence.
- Travel, Race and Town retain their existing runtime owners.
- The generic Animation Lab node remains whatever the current central router says; this handoff does not promote it.
- Do not build a second quest/progression system around these modules.
- Do not copy model assets into a second module store.

## PUBLICATION RULE · CURRENT DECISION

**All human-facing KFB previews, Stage proofs and Live links use the KFB Cloudflare publication surface.**

Primary human entry:

`https://kayfabizarro.pages.dev/kfb-hub/`

Resident review:

`https://kayfabizarro.pages.dev/resident-atlas-s6/?resident=clown`

Stage entry when a separate candidate card is needed:

`https://kayfabizarro.pages.dev/kfb-hub/stage/`

Do **not** use raw.githack, rawcdn.githack or similar third-party GitHub-rendering/CDN links as review/publication URLs. GitHub links remain valid for source, PRs, exact commits and recovery documents. Raw GitHub asset URLs may remain internal runtime source references where already part of the pinned asset contract; they are not human publication surfaces.

## DROPBOX PROVENANCE · READ-ONLY

Dropbox was checked only as provenance / donor evidence. GitHub remains SSOT.

Located exports:

- `/CLAUDE/KFB ToolBox Studio Rig Anim/KayKit Resident Atlas/`
  - Atlas Return modified 2026-09-17; older than current GitHub S33.
- `/CLAUDE/KFB Card Viewer + Crda Zones + Combat Mech + Voxel World + Hex Assets Worldbuilding(5)/KFB_Free_Roam_Platformer_POC_v0/`
  - candidate export modified 2026-09-18;
  - README says PUBLICATION NOT PERFORMED and Georg acceptance OPEN;
  - useful donor for measured cell/platform support and actor adapters, but its Project Island visual composition is superseded by the current recovery rebrief.

No Dropbox mutation is required for this handoff.

## DONE WHEN FOR WSA REVIEW

WSA can close this handoff when all of the following are explicit:

1. exact S33 source/revisions re-read from GitHub;
2. Clown public Cloudflare route loads current S33;
3. 3-club loop is visually reviewed for height, tempo, catches and arm motion;
4. one receiving Platformer support island is built through the Platformer's own measured module grammar;
5. Resident module mounts at consumer top-center without writing player/world physics;
6. actual browser tests are recorded on the Cloudflare URL;
7. Return identifies whether the module seam is accepted, needs tuning or is rejected;
8. no githack/raw-CDN review URL is introduced.

## ONE HUMAN REVIEW QUESTION

**Is the Clown 3-club loop visually good enough in height, tempo, catches and arm motion to accept `juggle-cascade-v1` as the first reusable Resident Activity contract before WSA mounts it into the Platformer?**


## 2026-09-20 · Incoming 2.5D cutout candidate

Separate prepared handoff:

`tools/KFB-ToolBox/_handover/2D_RESIDENT_ACTOR_WSA_2026-09-20/START_HERE.md`

First candidate: source-exact DocCheck Eumel as a `2p5d-cutout-resident`.

This addition does **not** change the current Clown S33 visual gate and does not promote Eumel into the Resident module index.

WSA should first require a browser-proven world-space `three2p5d` adapter, then test one mount through the same scene-module lifecycle.
