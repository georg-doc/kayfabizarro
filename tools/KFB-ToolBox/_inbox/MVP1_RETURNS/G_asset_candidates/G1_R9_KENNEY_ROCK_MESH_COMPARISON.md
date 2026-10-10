# G1 R9 · Kenney Nature Kit original mesh dimensions · 2026-10-10

Source family: `media/3D_Assets/kenney_nature-kit/Models/GLTF format/` on `sync/lab-rkit-2026-10-09`. Three actual GLB binaries decoded from GitHub; GLB 2 JSON `POSITION` accessor bounding box, `indices` face count and exact blob SHA read. The numbers are original GLB units **NOT** K2/H-scaled values.

| Real model | Git blob SHA | Position accessor count | Triangles | Source bbox X × Y × Z | Height / longest XZ footprint | Preliminary role |
|---|---|---:|---:|---|---:|---|
| `rock_largeA.glb` | `40e1365a43b706bd78c2658b48b189c9a35f8923` | 146 | 80 | 0.78491 × 0.25978 × 1.01546 | **0.256** | Low broad rock slab; appropriate as low bank/ledge/bridge contact, NOT a tall freestanding boulder |
| `rock_largeB.glb` | `52cdb4c8f63256a9756e9aced040808439c47e5b` | 163 | 85 | 0.76672 × 0.43025 × 1.01546 | **0.424** | More height/volume, best next source candidate in the same small family for a standalone rock shape |
| `rock_largeC.glb` | `ebaad0108531dd94d1135f176e3f31d07b9b8068` | 132 | 72 | 1.06441 × 0.32111 × 1.01566 | **0.302** | Broad low outcrop; not a tall monolith |

**New decision boundary:** Earlier G1 "large_boulders" had `rock_largeA` ranked A based on filename/inventory, before genuine 4-view inspection. Its *actual* source ratio explains why a tall imagegen tower was **not** donor-faithful. Do not stretch A into a high boulder just because category is "large." If a taller single rock is required, inspect B first or an existing Quaternius/StreakByte source; don't invent a new mountain.

### Reusable actual source proofs
- [A raw source material-color view](refs/source-isolation/G1_kenney_rock_largeA_source_4view_900.png): source-preserving technical view.
- [A four-view KFB palette study](refs/source-isolation/G1_kenney_rock_largeA_KFB_palette_source_locked_R9_900.png): **exactly same four original mesh silhouettes and 320 projected original faces**, recolored from original grass/earth categories to KFB green/claystone, NO resculpting and NO ImageGen shape invention. Both PNGs are pushed/verified actual GitHub binary files. SVG originals are alongside.
- [R9 ImageGen failures and recovery](G1_R9_ROCK_SOURCE_FIDELITY_RECOVERY.md): two promotional high-rock poster outputs rejected, no Golden/picked.

### Next single gate
Inspect and isolate Kenney `rock_largeB.glb` in the **existing KFB Island Lab** or same static source-proof route to establish whether its **height/footprint = 0.424** actually meets the desired large-boulder category. Then do source-preserving clay material conversion and show Georg. The material mockup is a technology path workaround, **not** an automatic KFB production acceptance.
