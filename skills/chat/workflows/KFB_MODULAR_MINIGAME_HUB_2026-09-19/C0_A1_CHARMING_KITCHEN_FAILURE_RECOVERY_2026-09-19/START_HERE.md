# START HERE · C0-A1 Charming Kitchen Failure Recovery

**Date:** 2026-09-19  
**Status:** `ARCHIVED_FAILED_CANDIDATE · RECOVERY READY`  
**Repository:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/c0-a1-charming-kitchen-2026-09-19`  
**Frozen product head:** `a5a8fcfb25e2ec89ab4346a812870d5b18bf91e6`  
**Original base:** `ca7abdb04493168a30f8792981f22e786e300d92`

## Why this exists

C0-A1 was the first end-to-end proof of the agreed production chain:

`Registry → Pack Analysis → Module Library → 3D Sample Builds → Asset Librarian → Game Dev Studio candidate → later ToolBox / Builder / Generator`

The pack analysis succeeded, but the browser integration gate failed twice after product repair attempts. Per the KFB two-pass rule the candidate is frozen. Do not patch this branch again as the implementation foundation.

## Read order

1. `POSTMORTEM.md`
2. `SALVAGE_MAP.md`
3. `SOURCE.json`
4. `TEST_REPORT.md`
5. `EXPORT_MANIFEST.json`
6. `NEXT_GATE.md`
7. `RETURN.md`

## Frozen candidate

The complete editable source is preserved in GitHub at the frozen product head:

`a5a8fcfb25e2ec89ab4346a812870d5b18bf91e6`

No source-model files were copied into the module kit or GDS package.

## What is proven useful

- 118/118 Charming Kitchen GLTF models classified.
- 0 unclassified.
- derived lanes: **69 Build · 26 Furnish · 23 Story**.
- CC0 source license pinned.
- Module Library, Pack Profile, Generator Profile and three sample recipes exist.
- Asset Librarian Pack Workbench architecture exists but does **not** boot in Chromium on the frozen candidate.
- GDS metadata candidate exists but is not sealed/verified by `game-dev`.

## What is not accepted

- Librarian browser integration.
- any sample-build browser result.
- any connector/snap geometry.
- any Kitchen Generator.
- any public C0-A1 Stage result.
- any sealed GDS package.
- Georg acceptance.

## One next gate

Start from current `main`, not this failed implementation branch.

Build **only one clean Librarian Module-Kit reader proof**:

- reuse the already-proven Module Library data model;
- one Pack deep-link;
- one alias;
- one `wall-grammar` sample only;
- no GDS changes;
- no furnished cell;
- no generator;
- no broad string replacement.

The gate is: **the exact six wall-grammar source assets load in the existing Librarian shell, at shared scale, with zero browser parse/runtime errors.**
