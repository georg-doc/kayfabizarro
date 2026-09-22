# RETURN · Hybrid Surface v2 failure recovery

Date: 2026-09-22  
Status: **FROZEN FAILED CANDIDATE · RECOVERY COMPLETE · NO PUBLIC V2**

## Exact source state

Repo: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/toolbox-hybrid-surface-v2-2026-09-22`  
Draft PR: **#166**  
Base: `chatgpt-web/kfb-3d-style-surface-scale-2026-09-22`  
Frozen runtime/code head: `7cbad52b55fb9ec2300aa4b25ca92b0997ce448a`

The final documentation branch head is fetched at handoff time; later recovery commits do not redefine the frozen runtime.

## SOURCE

Exact editable v2 source remains at:
- `.github/workflows/toolbox-hybrid-surface-v2.yml`
- `kfb-hub/stage/toolbox/hybrid-surface-scene-lab-v2/index.html`
- `kfb-hub/stage/toolbox/hybrid-surface-scene-lab-v2/hybrid-surface.v2.js`
- `kfb-hub/stage/toolbox/hybrid-surface-scene-lab-v2/lab.mjs`
- `kfb-hub/stage/toolbox/hybrid-surface-scene-lab-v2/proof.mjs`
- `kfb-hub/stage/toolbox/hybrid-surface-scene-lab-v2/SOURCE.json`

Exact frozen blobs are recorded in `SOURCE_SNAPSHOT.md` and `EXPORT_MANIFEST.json`.

## ATTEMPTS

Four browser-proof runs are recorded. Runs 3 and 4 are the two failed repair passes on the same actor shader compile-census gate.

## WORKING PARTS

Proven before the stop:
- exact World Atlas Dungeon + five exact actor donors load;
- deterministic exact head proxies resolve;
- head-size calibration normalizes all five head metrics;
- resulting total heights keep Legacy below Medium and Large above Medium;
- one shared RGB macro texture;
- procedural 3D clay grain, no second texture;
- source maps/colors/roughness/metalness preserved;
- non-uniform source roughness retained;
- environment shaders compile.

## FAILURE EVIDENCE

Run 4: `35672227722` / job `106571025025`

Gate:
`visible actor shaders compiled`

Observed:
- decorated actor materials 64
- proof-counted effectively visible 63
- compiled markers 58
- visible compiled markers 58

The same 58/63 mismatch occurred in Run 3 after which one targeted visibility repair was attempted. Run 4 still failed. Stop rule triggered.

## PROVEN CAUSES

The proof cannot currently identify the exact five decorated actor material records whose compile marker is not observed. Ancestor visibility alone does not explain them.

## HYPOTHESES

Renderer submission / dormant variant / culling / geometry draw-path explanations remain hypotheses until the records are named.

## SALVAGE

See `SALVAGE_MAP.md`. Head-size scale and source-property-preserving material architecture remain reuse candidates, not accepted defaults.

## LESSONS LEARNED

See `LESSONS_LEARNED.md`.

## NEXT GATE

One gate only:
**actor material compile census diagnostic**.

No shader styling change, no proof weakening, no public v2 publication and no environment integration before the five records are classified.

## EXPORT

Recovery folder:
`tools/KFB-ToolBox/_handover/HYBRID_SURFACE_V2_FAILURE_RECOVERY_2026-09-22/`

Manifest:
`EXPORT_MANIFEST.json`

A downloadable ZIP mirror is produced for handoff; GitHub branch state remains source truth.

## TESTED RESULT

Candidate browser proof: **FAIL**.  
Do not summarize the partial PASS observations as an overall PASS.

## PUBLIC DEPLOYMENT

v2: **NONE**.

Current public human baseline remains v1:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/hybrid-surface-scene-lab/`

## GEORG ACCEPTANCE

v2: **NOT REACHED**.

## OPEN

Five actor material compile-census records need exact identity/classification.
