# RETURN · TOOLBOX-COHERENT-INTEGRATION-01

Date: 2026-09-24  
Repo: `georg-doc/kayfabizarro`  
PR: **#185** · Draft / no auto-merge  
Branch: `chatgpt-web/toolbox-source-lock-2026-09-23`  
Runtime-tested head: `1f59903bfae25e959e106cf4fd1d06dd2cf62588`  
Actions: run `36027616075` / job `107728032734` · **SUCCESS**

## Delivered milestone

One directly reviewable ToolBox candidate now supports the requested coherent path without introducing a second runtime owner:

`Stage-First → real roster → current Driver Graft → real Resident scene → select → Move → Rotate → free Scale → Drop → Save → Reload → continue editing`

Candidate:
`tools/KFB-ToolBox/stage-first/src/TOOLBOX_COHERENT_INTEGRATION_01.html`

Integration adapter:
`tools/KFB-ToolBox/stage-first/coherent-integration-01.js`

## Owners preserved

- Stage shell / actor roster: accepted Stage-First v1 donor, SHA-256 `08f9108a6a2a556d0e1e2e34ce564842062a4fdd77a80fb1020a8e723b688fba`;
- FrizzleBob: current Driver Graft via `kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js` + `kfb-pet-graft-driver.v4.json`;
- Residents: `tools/resident_atlas_s6/` pinned at `10f661a542e2553b4d3433bfc5b45dfc1401e660`;
- edit layer: accepted shared `tools/KFB-ToolBox/lib/edit-layer.js`, blob `c15a200ba8615d55f9d3ae26616e0a8ceba8dc01`;
- persistence: `kfb.scene-patch.v1`.

No second roster, Resident DB, EyeRig, face system, editor, renderer or persistence schema was created. Missing mandated Resident nodes and Driver-owner failures surface as visible `SOURCE FAIL` errors instead of fallback geometry.

## Evidence

- **22/22 static/source/contract PASS**
- **20/20 Chromium coherent-flow PASS**
- exact run: `36027616075`
- exact job: `107728032734`
- detailed assertions: [TEST_REPORT.md](TEST_REPORT.md)

## Changed runtime/test files

- `tools/KFB-ToolBox/stage-first/src/TOOLBOX_COHERENT_INTEGRATION_01.html`
- `tools/KFB-ToolBox/stage-first/coherent-integration-01.js`
- `tools/KFB-ToolBox/lib/edit-layer.js` — exact accepted shared blob, not a fork
- `tools/KFB-ToolBox/stage-first/test/coherent-integration-01.static.mjs`
- `tools/KFB-ToolBox/stage-first/test/coherent-integration-01.browser.mjs`
- `.github/workflows/toolbox-coherent-integration-01.yml`

The accepted donor itself remains unchanged at:
`tools/KFB-ToolBox/stage-first/src/KFB ToolBox Stage-First v1.dc.html`
blob `a565a9418f1478ee5d4d8a470e1b5d79e1d20f5c`.

## Human review / publication

Status: **CHAT REVIEW READY**.

No new Cloudflare route was published, exactly as required by the slice brief. Therefore there is deliberately **no new Stage URL and no claim of PUBLIC_VERIFIED/live**. Existing ToolBox Stage routes remain unchanged.

## Unresolved visible issues

The runtime passes the requested flow, but the accepted Stage-First donor still logs template/import-map warnings, software-WebGL/readback performance warnings and a `pet-LIBRARY.json` 404 with its own `lab-v2/sources.js` fallback. Those are not hidden or claimed fixed; see TEST_REPORT.

## Exactly one next useful ToolBox capability

**TB-EYE-01 · EyeRig Production Studio.**

Human gate first: Georg reviews this coherent ToolBox milestone. No merge, Stage promotion or Live promotion is authorized by this Return.


## ADDITIVE UPDATE · AN-PROFILE-02 · 2026-09-24

Georg explicitly continued from AN-PROFILE-01 into the Production Architecture v3 T4 Animation Studio lane before the earlier TB-EYE follow-up. The original coherent milestone above remains its own unaccepted human gate; this update does not retroactively mark it accepted.

Current ToolBox owner remains this same PR #185 / branch. No second Animation Lab tool owner was promoted.

AN-PROFILE-02 extends the existing Stage-First `KFB Animation Lab v3.dc.html` with the source-backed 33-clip Motion Library and measured profile metadata from PR #206/#197. It reuses the existing clip pool, selection and mixer path.

Runtime-tested head:
`93d9dd6f763c064313fe5d3bef690496487145a9`

Actions:
`36032905791 / 107745811232 · SUCCESS`

Evidence:
- original coherent owner/static: **22/22 PASS**;
- AN-PROFILE-02 static: **34/34 PASS**;
- original coherent browser flow: **20/20 PASS**;
- AN-PROFILE-02 browser: **25/25 PASS**;
- 33/33 real KFB Motion clips load on Rig_Medium;
- 33/33 real KFB Motion clips load on Rig_Large;
- Large foot contacts remain unknown instead of inheriting Medium measurements;
- 0 Motion/profile network failures;
- 0 Animation Studio page errors.

Detailed handoff:
`../AN_PROFILE_02_2026-09-24/START_HERE.md`

Current next gate for this explicitly authorized lane:
**AN-PROFILE-02 direct Chat HTML human review · judge 33-clip Library browsing + measured Data readability/usefulness only.**

TB-EYE-01 remains a later ToolBox capability; WorldBuilder Motion consumption stays HOLD until this first Animation Studio consumer review.

## ADDITIVE UPDATE · TOOLBOX r2 OWNER REHOME · 2026-09-26

Claude ToolBox Production r2 has returned and the reusable owner deltas are now re-homed on this existing PR #185 rather than promoting the Inbox bundle as a second ToolBox.

Current tested head:
`5dcf34bcdf9d87445e927c98f60d41adae72f00e`

Promoted:
- canonical `kfb-rigs-embed-v3/.../pose-rig.v1.js` wrist/intermediate-bone world-position chain fix;
- byte-identical Stage-First PoseRig mirror;
- `stage-first/src/lab/locomotion-profiles.v1.js` canonical KayKit semantic locomotion profile owner;
- measured FrizzleBob EarRig-v5 Rig_Medium consumer JSON.

Not promoted into this owner:
- duplicate ear physics (PR #214 remains owner);
- S39 band runtime (Resident owner remains);
- CARD_SURF Flight behavior (Travel remains owner);
- r2 standalone Design shell as a second ToolBox runtime.

Actions run `36197260540` SUCCESS:
**31/31 static · 34/34 AN-PROFILE static · 20/20 Chromium coherent · 25/25 Animation Studio · 13/13 plain review**.

Current next gate:
**ToolBox r2 Stage review using the re-homed owners, with a dominant unobstructed 3D stage.**

No merge or Live promotion authorized.
