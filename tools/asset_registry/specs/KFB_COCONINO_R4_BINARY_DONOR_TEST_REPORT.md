# KFB Coconino R4 · Actual Kenney/KayKit Binary Source Isolation Test
Date: 2026-10-11
Status: **SOURCE GEOMETRY ISOLATED IN VECTOR PROJECTIONS**, not Blender screenshot, no image-provider conditioning, no world runtime.
Existing source owner: `tools/asset_registry` / Asset Librarian · current branch `planning/kfb-coconino-mesa-asset-recon-2026-10-11`.
Source baseline main: `dccf75cabd222d951380693d84ab88053ee7e519`.

## Mechanism and reproducibility
- `mcp__GitHub__fetch_file({encoding:"base64"})` used on exact pinned GLB and bin source refs; decoded bytes in isolated JS processing, parsed GLB 12-byte header, JSON/BIN chunk lengths, glTF accessor types/strides, mesh primitives/indices and source node transforms. No edited native GLB or imported replacement image.
- `visual/KFB_COCONINO_R4_KENNEY_KAYKIT_SOURCE_ISOLATION.svg` renders actual triangles in isolated 3/4 and side views with neutral material (to compare shape without a misleading material recolor).
- `KFB_COCONINO_R4_BINARY_DONOR_RECEIPT.json` carries exact 40-digit source blob SHAs, bounding extents, source counts, per-source roles and truthful missing proof.
- This **is** actual mesh-data source isolation, but is not a browser-rendered WebGL capture, not a generator-conditioned source image and not a Blender GLB export.

## Actual 10/10 static evidence checks
1. **PASS** — GH binary headers and sizes: Kenney rock_tallA 12072 GLB, cliff_top 5312 GLB, cactus_tall 9668 GLB, KayKit Rock_1_A BIN 2848 bytes.
2. **PASS** — Actual GLTF/GLB triangles: rock_tallA 136; cliff_top_rock 53; cactus_tall 122; KayKit Forest Rock_1_A 48 = 359 total.
3. **PASS** — Source metadata and sha: 3 Kenney GLB object blob SHAs and KayKit glTF+BIN SHAs pinned; no transcoded mesh substitution.
4. **PASS** — Scene graph transform: Kenney source node vertical translation -0.05 applied to vertex position; KayKit identity.
5. **PASS** — Native dimensions measured: rock tall 0.983×0.996×0.683; cliff top 1×1×0.2685; cactus 0.396×0.75×0.339; KayKit rock 0.578×0.540×0.608.
6. **PASS** — 4/4 source-isolated panels: SVG contains actual 3D vertices/triangle polygons, each original asset isolated twice 3/4+side, not a fabricated visual source.
7. **PASS** — SVG triangle display count: 359 triangles x2 views = 718 projected polygons, source 4 source models.
8. **PASS** — GitHub committed source plate: R4 SVG readback exact 101527 UTF8 characters SHA cb6279f341a2616bfe61ca41616fb5460c558015.
9. **PASS** — GitHub receipt schema and readback: R4 binary receipt JSON exact 4328 UTF8 characters SHA d3a021a8376286aea1df92afbd3595ca7791a329.
10. **PASS** — R3 neutral originals preserved: M01/02/03 OBJ source branch unmodified by R4 binary donor source plate addition.

## Four source candidates / measured geometry
| Source | SHA prefix | Native dimensions | Source triangles | Design role |
|---|---|---|---:|---|
| Kenney `rock_tallA.glb` | `31d1fb48` | 0.983 × 0.996 × 0.683 | 136 | small rock/foreground only |
| Kenney `cliff_top_rock.glb` | `df883599` | 1 × 1 × 0.2685 | 53 | narrow thin cliff tile, conceal/hide geometric tile boundaries |
| Kenney `cactus_tall.glb` | `7896d4ee` | 0.396 × 0.75 × 0.339 | 122 | sparse dressing |
| KayKit `Rock_1_A_Color1.gltf` + `.bin` | `cfee4dd7` / `df23c5d4` | 0.578 × 0.540 × 0.608 | 48 | small boulders/talus |

4 real source models; 359 original source triangles total; displayed twice = 718 projected SVG triangles. No claim of source materials/baked texture use.

## Limits/negative evidence
- Real KFB K1/H0 `mesa()` final **softened** runtime geometry: **NOT ISOLATED**. Recreating its raw cylinder from parameters would be an approximation, not source proof.
- Dropbox references: preview references verified; temporary single-use Dropbox download link could be minted, but original pixels could **not** be transferred into rendering/image generation via this host. A file download blocked due to cross-tool access/URL policy is **not** a success. Do not escalate to a personal user gate; hand off to the existing Composer/Librarian source owner with the exact Dropbox IDs.
- Real image-generation calls with true donor source pixels: 0; original source-locked J1/J2 generated scenes 0; Blender/GLB exports 0; 3D WebGL browser screenshot 0; image visual QA independent 0; Track Core driving/collisions 0; fps 0; Site/Stage 0.
- R3 original neutral M01–M03 candidate meshes remain unaccepted artist forms. Their three structural manifold/winding source tests were separately PASSED in R3 and not counted as new R4 passes.
- Existing Four-Island R1 A/B visual gate and R4 STOP remain unchanged. Nothing authorizes R5 or scene geometry fan-out.

## Exactly one next gate
Recover true K1/H0 **post-soften** procedural `mesa()` mesh source pixels and secure original Dropbox Claymation reference pixels at the receiving Composer/generator host, then render isolated complete donor plate and source-conditioned SINGLE-IMAGE A/B Joyride J1/J2 scene concepts. Until then the three Composer jobs are `BLOCKED_SOURCE` for source-fidelity; the R3 warm island image remains `MOOD_ONLY`.
