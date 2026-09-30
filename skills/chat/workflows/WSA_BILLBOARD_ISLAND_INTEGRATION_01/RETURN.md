# Billboard island integration · checkpoint 1 · 2026-10-01

**r2 INTAKE VERIFIED · BODY/ANCHOR UNIT PASS · integration IN PROGRESS**

Repo: `georg-doc/kayfabizarro`.
Branch: `work/billboard-island-integration-01-2026-10-01`.
Base: `99d882ca8e3bae53999a4c939cbfb46d4444d874`.
Latest exact branch head is carried by the Git ref and Production Control receipt.

Georg's r2 feedback: **TUNE, ready**. Incoming cut is preserved without edits.
All **35/35** original checksum entries verified. Folder size reported by
Dropbox: **1,368,114 bytes**. Plain/TV source evidence inspected; no claim that
the authoring screenshots constitute this integration's WebGL performance proof.

Extracted the actual geometry/palette/anchor blocks through a reproducible
source-hash-locked build. Did not copy the sample island, sample clay shader,
content painter, Billboard runtime or scheduler. B1/B2a ownership stays intact.

One actual defect reproduced: Plain at uniform terrain height 10m returned a
5m anchor. The extracted seam now returns 10m by dividing by the two actual
feet; Highway still divides by four. **20/20** executed Node unit tests PASS,
including positive/negative terrain, slope footprint, scale, offset, rotation,
default style, flat override, road anchors, and exclusion of runtime owners.
JS syntax checks for build, test and generated output PASS.

## Not yet proven

- Body seam in receiving B1/B2a runtime: NOT_INTEGRATED.
- Rich PD video/image pool and triplet rotation: NOT_IMPLEMENTED.
- Canonical prop material on these body variants: NOT_INTEGRATED.
- Visible 0/1/4/8/16 performance and source/integration browser proof: NOT_RUN.
- New public Stage route: NOT_PUBLISHED; no merge or Live promotion.

## One next productive step

Connect r2 body-only seam to the accepted B1/B2a owner in the reduced island
consumer, with the rich-pool provider; perform browser proof there.
See START_HERE.md for complete current user scope and compact handoff limits.
