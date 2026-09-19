# WSA MVP Consolidation · 2026-09-20

Status: **CURRENT HANDOFF CANDIDATE · NO MERGE / NO LIVE PROMOTION**
Owner: **existing WSA Work Lead / existing project owners**
Coordination owner: **KFB Production Hub / router only**
Source baseline: `georg-doc/kayfabizarro@9b3c57ec09af8a9601a7221a84ee9a6de1e287f5`
Stage target: `https://kayfabizarro.pages.dev/kfb-hub/stage/wsa-mvp-consolidation/`

## Goal

Give the WSA Work Lead one compact, current, GitHub-backed intake for a first coherent local MVP assembly without replaying the parallel Web chats.

This handoff **does not merge runtimes**. It pins which slices are useful, which public/deployment gates are still open, which failed candidates must stay out, and which small external slices can be run independently before WSA performs the local integration.

## MVP assembly direction

Use the current **Travel / TinySkies world** as macro-world truth. Add only already measured/tested seams around it:

1. **World surface / terrain owner** — Travel Globe / TinySkies.
2. **World visual language** — current TinySkies × OSM × Grotesque integration proof as visual donor, not a terrain owner.
3. **Drive / HUD** — current Race owner + HUD Game v3 candidate.
4. **Actor motion** — KCL-M1 only as measurement / transition-profile evidence until Georg chooses the visual motion variant.
5. **Residents** — existing Resident Scene Module seam; first consumer proof is the Clown module on a normal Platformer-owned 4×4 support island.
6. **Combat** — CA2 Driver Graft + verified Skeleton roles, after its own fixed Stage/browser proof.
7. **EyeRig** — Medium is useful now; Large remains human-calibration-gated until Monstrosity establishes the class default.

Do not create a second world, movement owner, asset registry, animation mixer, resident physics owner or universal editor.

## Current exact inputs

### A · Travel / TinySkies terrain donor

Repository: `georg-doc/KFB-Travel-Globe`
PR: **#30**
Branch/head: `wsa/tinyskies-terrain-donor-isolation-2026-09-19@0b354d8b8cdbe55e10ecc91221ae933058306f3b`
Base owner head: `8614282aab2ced43bb5dda9fcf7abadf9768100a`

Proven earlier on the candidate:
- 12/12 Chromium checks PASS;
- 0 page/script errors;
- 0 failed HTTP assets;
- 66,049 vertices per current Globe;
- 1,562 vertices / 2.365% changed by the existing terrain-zone seam.

Current public QA:
- `georg-doc/kayfabizarro#112`
- run `35474894951`
- **FAIL BEFORE BROWSER** at “Wait for exact Cloudflare deployment marker”.
- Browser proof was skipped.

Meaning: **do not restart terrain work**. The implementation donor exists; publication synchronization is the open gate.

Stage target:
`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/tinyskies-terrain-donor/`

### B · TinySkies × OSM × Grotesque visual integration

Repository: `georg-doc/kayfabizarro`
PR: **#110** stacked on #109
Head: `8033e64d2638740fe2c9133216d42c56c306a4aa`
Tested runtime in Stage marker: `aa28a743628699271c94c1911af23d0564c6f3cc`

Evidence:
- source/static 27/27 PASS;
- browser 19/19 PASS;
- workflow `35471501769` PASS;
- 0 browser errors.

Public gate:
- the current Stage `SOURCE.json` on main/cloudflare-live contains a trailing literal `\n`;
- public attempt 2, workflow `35471646709`, failed parsing that marker;
- this gate already consumed repeated repair work.

Meaning: **use as a local/source-backed visual donor; do not spend a third Web repair pass on the same public-marker foundation.** WSA may normalize the marker during deliberate local consolidation.

Stage target:
`https://kayfabizarro.pages.dev/kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/`

### C · Race HUD Game v3

Repository: `georg-doc/KFB-Stunt-Car-Race`
PR: **#28**
Head: `8918471bf6c5e3fa1b945109fd37019df600cad6`
Tested runtime: `6d8284c4d6069305e35f349ea1cfcdc605e27a02`

Evidence:
- 11/11 static PASS;
- 12/12 browser interaction PASS;
- exact-head workflow `35470897447` PASS.

Public gate:
- public workflow `35470815300` failed **before browser boot** while installing Playwright;
- Stage files exist on `kayfabizarro/main`;
- `kfb-hub/stage/stunt-world/hud-game-v3/SOURCE.json` is absent from current `cloudflare-live`.

Meaning: candidate logic is not the current blocker. One bounded publication/QA repair is appropriate; no new HUD redesign.

Stage target:
`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/hud-game-v3/`

### D · KCL-M1 locomotion sync

Repository: `georg-doc/kayfabizarro`
PR: **#107**
Head: `fc49a336af57adb6317b74211b3318d004d96de5`

Recorded evidence:
- source/static 20/20 PASS;
- local WebGL 39/39 PASS;
- public Cloudflare browser 39/39 PASS in the recorded workflow attempt;
- route is present in the selective publication branch.

Human gate:
- Georg still chooses **NAIVE vs PHASE SYNC** visually.
- Start with Walking_A → Running_A · LEFT · fade 0.12 s · warp ON · speed-match ON.

Metadata drift:
- current Stage `SOURCE.json` still says `PUBLIC_STAGE_CANDIDATE_PROOF_PENDING` and pins an older branch head.
- WSA must reconcile metadata with the later recorded public evidence before promotion.

Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/kcl-m1-locomotion-sync/`

### E · Resident Scene Modules

Canonical handoff:
`tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/START_HERE.md`

Already on current main:
- Clown + exact KayKit blue/green/red juggling pins;
- deterministic three-club activity;
- thin `kfb.resident-scene-module/1` seam;
- no transfer of consumer collision, camera, movement or persistence.

Recorded Cloudflare browser runs:
- `35421198328`
- `35421390825`
- HTTP 200, activity mounted/advancing, no browser errors.

Open:
- Georg visual trajectory/catch tuning;
- first real Platformer consumer proof.

Recommended isolated slice:
**Platformer Resident Consumer R1**
- normal Platformer-owned 4×4 grass support;
- mount `clown-juggling-island.module.json` at top-center;
- Resident writes only its local presentation/activity root;
- no invisible floor, controller, camera, portal or collision ownership.

Human route:
`https://kayfabizarro.pages.dev/resident-atlas-s6/?resident=clown`

### F · ToolBox EyeRig Batch

Repository: `georg-doc/kayfabizarro`
PR: **#104**
Head: `af2827b60ced330e57bf4a7f553ad30dbf45b205`

Current loader fix:
- full persisted checks 84/84 PASS;
- focused loader checks 8/8 PASS;
- Medium/Large model switching crash fixed.

Publication asymmetry:
- current corrected `SOURCE.json` exists on `cloudflare-live`;
- it explicitly records corrected public proof as **NOT_RUN**;
- historical pre-identity-correction proof must not be promoted as the corrected proof.

MVP boundary:
- Medium profiles may be consumed as current calibrated input.
- Large is **not an MVP blocker**.
- Large remains gated on Georg tuning Monstrosity and explicitly setting the Large class default.

Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

### G · Combat Arena CA2

Repository: `georg-doc/KFB-Combat-Arena`
PR: **#5**
Head: `6bd36e7a2da090d240ab520de9c280ac73fe12cb`

Current exact-head CI:
- workflow `35463139401` PASS;
- `npm test` PASS;
- portable build PASS;
- re-home verification PASS.

Scope is clean:
- current ToolBox graft driver behind CA2;
- one host AnimationMixer;
- Player remains movement/ground owner;
- exactly two verified Skeleton roles;
- MobBrain/Gunfight/Rewards/RunFlow remain owners.

Open gate:
- fixed Cloudflare Stage/browser proof and human visual gate.

Meaning: **do not redesign Combat**. Run only the publication/integration proof before treating Combat as part of a human-testable consolidated MVP.

## Explicitly OUT of the MVP assembly

Keep these as history/recovery/donors only:

- Race PR #29 S-T01b — frozen wrong macro-world foundation for this slice; Voxel remains valid only for deliberately voxel/block-based modes.
- kayfabizarro PR #108 TE-01 publication failure — recovery packet, not implementation base.
- kayfabizarro PR #106 C0-A1 Charming Kitchen — archived failed candidate; do not carry its Librarian patch forward.
- kayfabizarro PR #101 C0 Baukasten — visual rejection history.
- rejected Race HUD #26/#27 and HUD Rig v1.
- Birthday execution lanes.

## Cloudflare / sync diagnosis

Current publication branch:
`cloudflare-live@3c1135bc5d24727a011735a4d4bf2ff707b1757c`

Current `kayfabizarro/main`:
`9b3c57ec09af8a9601a7221a84ee9a6de1e287f5`

They are **deliberately divergent**, not a simple “main is ahead” situation:
- compare reports 183 commits on main not in the publication line;
- 40 commits on the publication line not in main.

Examples:
- KCL Stage exists on both.
- HUD Game v3 Stage marker exists on main but not `cloudflare-live`.
- corrected EyeRig Stage marker exists on `cloudflare-live` but not main.
- the OSM/Grotesque Stage route exists on both, but its marker is malformed.

Therefore **do not merge main wholesale into cloudflare-live**. The WSA/publication step must select exact tested Stage files and reconcile each route's marker.

## Incoming Cloud Design mini-editor

Georg reports a useful Cloud Design mini-editor for:
- Dungeon Generator v3 prop placement;
- similar Platformer scenery placement;
- Resident Atlas scene composition;
- later simple resident posing / reusable pose collection.

Current status in this handoff:
`USER_REPORTED_SOURCE · NOT YET PINNED`

No exact new editor implementation PR surfaced in the inspected GitHub state, and the targeted Dropbox search did not surface a confident exact current export.

Rule:
- do not rebuild it from prose;
- do not make it an MVP blocker;
- when its editable source/export is pinned, treat it as an **authoring donor** and extract a small transform/pose recipe seam shared by the existing owners.
- World Atlas/Dungeon, Platformer and Resident Atlas keep their own runtime semantics.

## Recommended parallel micro-slices before WSA local assembly

These are independent and can run in fresh Web chats without consuming Work volume:

1. **HUD v3 Publication Repair** — fix only the CI/deploy proof path, then open the exact Cloudflare Stage; no HUD redesign.
2. **Combat CA2 Stage Proof** — publish current tested CA2 and browser-test the fixed route; no combat redesign.
3. **EyeRig Corrected Public Smoke** — exact loader-fix Stage, Medium↔Large switch; no new class calibration.
4. **Platformer Resident Consumer R1** — 4×4 Platformer support + Clown module mount; no new world/editor.
5. **Mini-editor Intake** — only after the actual Cloud Design export is pinned; inspect/reuse, never recreate.

Do **not** spend another Web repair pass on the frozen OSM/Grotesque public-marker gate or the rejected C0/voxel foundations.

## WSA local assembly order

When the WSA Work Lead receives this:

1. fetch all exact heads above;
2. ingest only accepted/current files into the local multi-repo workspace;
3. normalize Stage/publication metadata without changing runtime owners;
4. assemble the smallest coherent MVP host around current Travel/TinySkies;
5. add Race/HUD, one Resident module and CA2 only after their respective public/browser gates are known;
6. run repository-native tests + local integrated browser/freeplay;
7. publish one named consolidated Stage route;
8. return exact repos/heads/files/test counts/screenshots/open items and one Georg gate.

No auto-merge. No Live promotion.

## Game Development Studio availability

`GAME_DEV_CLI_UNAVAILABLE · OPTIONAL FALLBACK USED`

The local optional `game-dev` helper is not available in this Web environment. This does not block the repository-native coordination, CI, Stage or WSA handoff. No sealed GDS package/run evidence is claimed here.
