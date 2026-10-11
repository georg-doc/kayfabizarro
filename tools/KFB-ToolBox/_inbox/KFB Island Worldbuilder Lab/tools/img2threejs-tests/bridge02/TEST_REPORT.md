# img2threejs v2.0.0 - Test bridge02 (KFB stone arch bridge field vs G4 sheet)

Date 2026-10-10, about 70 min (10 min over the box). Reference: `docs/golden/candidates/G4_stone_bridge_sheet_webchat_r1.webp`. Panel F (3/4) is used as `reference.png`; panels B, C, D and E plus the detail crops are in `ref/`.
Gate state: blockout pass, **2 of 3 correction loops used**. The last review is `stop` because the timebox ran out. Structural through optimization passes were not run.

## Result
- **Triangles: 36,756** (bridge01 had 234k). 6 meshes and 13 draw calls including the shadow pass. All clay parts share one `MeshStandardMaterial` with vertex colours; the lantern glass has a second, emissive material. Build time is about 40 ms.
- Factory: `src/createKfbStoneBridgeField.ts`. Viewer: `src/view.ts`. Test page: `http://localhost:5192/img2threejs-test/bridge02/index.html?view=f34|front|under|side|top|rear|left`.
- Renders (1600x1000): `renders/final_*.png`. Comparison: `COMPARISON_sheet_vs_bridge02.png` (sheet panels B and F next to the front and 3/4 renders).
- Scale (K2): clear span 30, rise 10.5 (0.35 of span), deck 19.2 wide, flat deck top at y=0 (gradient 0), parapet cap top at 1.95 (0.54 H), lantern top at 5.82 (1.6 H). Abutments run from the springing at x=±15 to x=±23.7 and sit on boulders. Origin is the deck centre.
- `userData.kfbBridgeField` holds the spans, the drive collider box and the end sockets.

## Honest method note
The geometry is **hand-written layout code**, not produced by the skill's generator. The generator cannot make wedges, chord-cut blocks or merged per-family meshes, and it cannot stay within 40k triangles (bridge01 showed this). What the code does:
- **Clay blocks.** Each block (`clayBlock`) is a chamfered hexahedron with 24 vertices and 44 triangles. Each vertex carries a slightly tilted ("pillow") face normal, so the chamfer is shaded as a rounded edge. Blocks are mapped trilinearly onto 8 arbitrary corners. That one primitive gives tapered voussoirs and spandrel blocks whose lower edge is cut along the arch, following the outer curve of the ring (the extrados) as a straight chord.
- **Rocks and grass.** Rocks use a shared `RoundedBoxGeometry` (seg 2), warped so the fillet radius is kept. Grass caps are `RoundedBoxGeometry` (seg 3) with blob drapes.
- **Skill's share.** The skill supplied only the process: state gate, assessment, detail inventory, a group-level spec (33 components), strict validation, Tier-1, multi-angle, comparison sheets and review history. Strict validation passed on the 2nd run, against 5 runs in bridge01.

## What changed vs bridge01
1. **Voussoir ring:** 15 tapered wedge voussoirs with radial joints and no V-gaps. The keystone is wider and stands 0.18 proud. A barrel soffit of darker staggered courses sits between the face rings, and the ring springs from skewback stones.
2. **Spandrel courses:** cut to the extrados as chords, so they never cut into the ring. A hidden backing core in the darkest masonry tone closes every joint, so no background shows through.
3. **Footing and grass:** grey rounded boulders under both abutments, plus a rock stack at each outer end. A thick grass cap (1.8) with a rounded lip and blob drapes sits on top.
4. **Pillars and lanterns:** 4 end pillars running from the boulders to 0.95 above the caps, each with a chunky clay lantern (dark green frame, warm emissive box).
5. **Parapet and deck:** the parapet has rounded overhanging cap stones in darker tones. The deck is flat rounded stone-slab pavement (7 rows plus raised sidewalks) instead of blue planks.
6. **Ivy:** 3 clusters of 8 to 10 big blobby teardrop leaves each, plus grass drapes.
7. **Colours:** only the role palette (masonry 4 tones; rocks #aaa59b and #918c83; grass #94b834 and #7fa42b; lantern #2f4a3a and #ffd27a). Tones vary per block with no immediate repeats. Neutral tone mapping; no textures, gradients, speckle or outlines.

## Iterations (state gate loop counter)
- **it0 (blockout):** the ring was clean, but the walls looked like small bricks, the joints were see-through, the rocks were octagonal and dark, the ivy was spiky and the grass lip was a bar.
- **it1 (refine-code):** added the backing core, used fewer and larger courses (7 instead of 11), went from 17 to 15 voussoirs, switched to RoundedBox rocks in lighter greys, made the ivy blobby and the lip blobby, and made the lantern chunkier.
- **it2 (refine-code):** raised the pillars above the caps and scaled the lantern to land at 1.6 H. Lightened the pillar and slab tones and lowered the 3/4 camera. Then stopped on the timebox.

## Gates
- **Tier-1: FAIL** (IoU 0.39, aspect delta 0.34, scale delta 0.58). The thresholds assume pixel likeness to the reference. The reference here is AI concept art with different proportions, so this gate cannot meaningfully pass.
- **Multi-angle: PASS** (no degenerate view).
- **Strict spec validation: PASS.**
- **AI-vision self-score: 0.50.**

## Gaps remaining (honest)
1. **Silhouette and proportions.** The sheet bridge reads as a compact near-semicircular ring sitting almost directly under the parapet, with tall, dominant pillars and big lanterns. With span 30 and deck 19.2, ours is long, low and wall-heavy: it has a lot of spandrel masonry, and the pillars and lanterns look small (lantern at 1.6 H is about half the sheet's relative size).
2. **Rock footing and grass are too regular.** The outer end is a 3x2 grid of grey rounded boxes, and the grass cap still reads as a bar with blobs. The sheet has irregular boulder sizes, a sandy rock variant and grass that flows over the edge.
3. **Block scale and busyness.** There are too many mid-size blocks in the spandrels and pillars, the pavement still looks slightly checkerboard, and the cap stones are thin. The sheet uses fewer, larger blocks plus a second, greyer cap course above the ring.
4. **Faceted edges up close.** The 44-triangle chamfer reads as faceted at close range. It is fine at game distance, and the under view (E) holds up best.

## Verdict
Would it pass as the bridge look for MVP-1? **Not yet; it is close in parts.**
- The ring, the clay blocks, the palette, the lanterns and the slab pavement are in the family, and the triangle budget is game-ready.
- Side by side with B and F, it still reads as a different, heavier bridge, mostly because of proportions and the regular rock and grass.

My score against the sheet:

| Aspect | Score |
|---|---|
| Silhouette | 5 |
| Blocks | 6 |
| Ring | 7 |
| Rocks/grass | 4 |
| **Overall** | **5/10** |

## What a production version needs
- **Bridge chain.** A chain of 3 fields over two floating rocks, built from a parametric field (this factory already takes span, rise, width, abutment length and seed). Middle piers become shared abutments on the floating rocks, with niches cut into the abutment face (an arched recess using the same wedge builder at a smaller radius). The deck stays continuous at gradient 0, with end sockets for snapping.
- **Proportions as a style parameter.** Allow a thinner crown (ring directly under the parapet), taller pillars and a lantern-scale override. Agree with Georg whether 1.6 H is the lantern top or the lantern size.
- **Rock kit.** 3 or 4 boulder shapes with jittered sizes and non-grid placement, plus a sandy variant. A grass-cap kit with draping lip pieces that wrap over the rock edges.
- **Block kit.** Larger block modules, a two-step bevel for hero blocks (voussoirs and caps), and a second cap course. Keep the merged-per-family plus single-material setup (about 37k triangles; expect about 25k with LOD on the hidden core and soffit).
- **Process.** Treat `clayBlock` with trilinear corners as the KFB masonry primitive (it solves wedges and chord cuts). Use img2threejs, if at all, only for the gate scaffolding.
