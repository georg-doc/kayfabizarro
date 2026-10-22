# WSA → WS0 · FB_CANON R1 · Import/Export STOP · 2026-10-22

Status: BLOCKED — no FB_CANON GLB, no GLB hash, no canonical-card promotion, no Georg acceptance. The stop is confined to this FB_CANON export/acceptance path, not all ToolBox operation.

## Auftrag und Grenze

Georg requests one FB_CANON.glb from the existing P08 actor with Rig eyes, original brow depth −0.08 and pitch 8°, measured height 1.81 m, SHA-256, independent GLB reimport and Stage images (front, three-quarter, side, face, eyes open/half/closed, beside the Dieselpunk Racer). WS0 then stores the artifact on the private branch and presents it in the Hub. No new tool, substitute figure, merge or Live promotion.

**Latest Georg instruction overrides the older same-batch request: V-643 ear reduction is a separate subsequent step. Do not delay FB_CANON for it.**

## Sources recovered

- Site owner: KFB ToolBox, project appgprj_6ac2ba44282881919d1a49287a32054e.
- Site managed source review branch: wsa/toolbox-frizzlebob-face-2026-10-21.
- Exact P08 source: 20a012324f6d71080ae5927ee2dfe8f633b2410a.
- This is a managed Sites source repository, not a branch in georg-doc/kayfabizarro.
- Actual entry tested: root dist/index.html, not the older nested dist/production-08 snapshot.
- Register read: 36252aec051cc90979f9adcdf36593a96199bfc6, georg-doc/kayfabizarro / docs/kfb-decisions-register-2026-10-11.
- Owning reply read: replies/WS0_TO_WSA_COMBAT_ARENA_R2.md (V-658).
- Canonical card still points to old v5b: replies/FIGURES_R1/figures/frizzlebob.figure.json. Its historical approval is not approval of a new FB_CANON.

## Material test result: fresh browser import FAIL

Started the exact P08 cut locally over HTTP and opened it in Chrome. The visible application refuses rendering with:

> SOURCE MISSING · Georg actor import  
> Georg actor import mismatch: original.brows.depth, original.brows.pitch

This is distinct from the earlier private-preview login/401 issue. The P08 guard itself fails on actor-value consistency.

The source-level cause matches the browser failure:

| Consumer/source | Eyes | Brow depth | Brow pitch |
|---|---|---:|---:|
| actor-bootstrap.v1.js → data/actors/frizzlebob-earrig-v5.georg-2026-10-14.kfb-pets.json | rig | -0.056 | 0 |
| index.html, _mountFaceOn (around line 3263), unconditional P08 override | rig | -0.08 | 8 |
| data/kfb-pet-frizzlebob-earrig-v5.georg-2026-10-21.p08.json, existing candidate | rig | -0.08 | 8 |

Bootstrap source SHA-256:
604449e169dcf522bf6d3d78eb59023ed8ba2de9985fa73141f3ffee79a3873e

Existing P08 candidate JSON SHA-256:
8b7ac319a0ba9c4b9cdce5fddc738a35d85a8dc517b6f1f40585c378fc843ce9

These are JSON hashes, **not FB_CANON.glb hashes**. The existing P08 candidate is not wired into loadActorDocument. Do not bypass verifyActorWorkspace, pre-seed its receipt, reveal its hidden renderer, or claim this import passed.

Evidence captured locally:
work/fb-canon-evidence-2026-10-22/P08-import-stop.png
in the shared KFB Hub workspace.

## Second open seam: the implemented export is JSON only

The existing Rigging methods _rigExportDoc, rigDownload, rigImport and rigRoundTrip operate on kfb.pets/1 JSON. rigDownload creates application/json. rigRoundTrip checks F.export → F.load → F.export fields; it does not independently reload a GLB or prove body/surface/hair/ears, physical height, skeleton or animation preservation.

Read-only source audit found no GLTFExporter/implemented GLB-export route in this source cut. Runtime clay uses shader modifications; EyeRig/mouth/ear behavior belongs to runtime owners. A generic mesh export must not be silently substituted and called a faithful P08 export.

No paid model generation, second renderer or replacement figure was attempted.

## Independent Production Guard

Independent read-only review confirms the source mismatch and classifies this seam as outcome-critical for the requested FB_CANON. STOP applies to the export/acceptance path. This is not a stop of the rest of ToolBox. No production code or card was edited to conceal the failure.

## Delivery matrix

| Required result | Actual state |
|---|---|
| P08 fresh actor import | FAIL: explicit brow depth/pitch mismatch |
| JSON download → file reimport | NOT RUN after the known-failure stop |
| FB_CANON.glb | NOT CREATED |
| GLB independent reimport | NOT RUN |
| SHA-256 of FB_CANON.glb | NOT AVAILABLE |
| GLB measured height 1.81 m | NOT VERIFIED; 1.81 m is the required target only |
| Front/¾/side/face/open-half-closed/Racer Stage images | NOT PRODUCED as canon evidence |
| Canonical figure-card switch | NOT DONE; no resolvable tested artifact exists yet |
| Ear reduction V-643 | DEFERRED as Georg explicitly requested |
| Site / Hub / Live promotion | NONE |

Optional game-dev CLI was checked once and is unavailable; repository-native/browser checks were used. This is not the blocker.

## One next productive gate — no Georg action required

**WS0 / existing ToolBox owner: establish a single valid P08 actor source and align bootstrap path, checksum and runtime values to it, preserving the import guard.** The already-existing P08 candidate contains Georg's requested eye/brow values; reuse it rather than construct another figure. Prove a fresh import first.

Then explicitly identify/implement the GLB export seam in the existing ToolBox owner, preserving the assembled actor, clay contract, EyeRig, skeleton and required clips. Independently reload the emitted bytes and measure 1.81 m before naming them FB_CANON. Produce the requested Stage images under the shared stage-light owner, store the real binary privately, and only then switch the figure card to that exact private source/hash as a candidate for Georg. Ear reduction remains later.

No new source request, copying task or acceptance decision is needed from Georg to address this technical seam.
