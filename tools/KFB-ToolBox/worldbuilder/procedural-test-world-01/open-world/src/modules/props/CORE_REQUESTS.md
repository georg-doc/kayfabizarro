# props — core requests

## 1. Per-instance vertex attributes in ChunkBuilder.add (occluder fade without extra draw calls)
`core/fade.ts` needs a per-vertex `aFadeAnchor`, but `ChunkBuilder.add()` / `mergeTransformed()` drop custom
attributes. Props therefore merge themselves into one extra mesh per chunk (named `props`, fade material), which costs
up to one draw call (+ one shadow-pass call) per chunk that holds props — measured 20 such meshes loaded on seed 97
(236 draw calls in the game view).
Request: `out.add(assetId, matrix, { material, attrs: { aFadeAnchor: [x, y, z, w] } })` — constant per-instance
attributes written for every vertex of the instance; buckets keyed by material as now. Then props, villages and
anything else using `occluderFadeMaterial(atlas)` share ONE fade bucket per chunk, and props can go back to `out.add`.
