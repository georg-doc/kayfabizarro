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
