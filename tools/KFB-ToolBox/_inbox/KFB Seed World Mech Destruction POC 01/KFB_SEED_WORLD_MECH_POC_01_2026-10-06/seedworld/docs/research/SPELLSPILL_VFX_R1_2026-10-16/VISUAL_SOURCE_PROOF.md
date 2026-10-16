# SpellSpill · Verified source screenshots visual breakdown · 2026-10-16

**Evidence class: ORIGINAL_USER_SCREENSHOT_BYTES_VERIFIED / NINE_SCREENSHOT_CONTACT_SHEET_VISUALLY_INSPECTED. NOT original shader source, frame video, gameplay behavior or KFB adoption.**

## Original + CI source proof
- Source: user-owned [Dropbox SpellSpill VFX Study](https://www.dropbox.com/scl/fo/khq2ourkr6ihtkvsofo3b/AF6uLp4fDDyuWr_5iGNl7_s?rlkey=75r24euxt8e6ybfo3d1y9j2pe&dl=0), exactly nine PNG originals.
- Successful read-only CI download and hash verification: https://github.com/georg-doc/kayfabizarro/actions/runs/38922347665 (job `117045170526`, conclusion **SUCCESS**).
- Each PNG downloaded, decoded by Pillow, and passed comparison with its original Dropbox content hash (**9/9 PASS**). The path traversal / ZIP absolute root issue in first CI run was repaired by Python safe flattened extraction; no target source change.
- Evidence artifact: https://github.com/georg-doc/kayfabizarro/actions/runs/38922347665/artifacts/12054229885 (contains `manifest.json` and `contact-sheet.jpg`; originals were kept temporary in CI and were NOT committed into KFB). Artifact zip SHA256 `d175d3e3d4331c4823b24abe5f25247b4f61c08f99aed278ff73961e86bb38b8`.
- Contact sheet 3 × 3 (1200×960) was downloaded and **visually inspected**. It is downsampled JPEG evidence of real PNGs, not inspection of each full-size pixel or original moving video.

## Visible observations (description, not alleged underlying shader technique)
| Original screenshot time | What can actually be read in the contact sheet |
|---|---|
| 16.52.47 | Bright orange/yellow blast at bottom, large soft gray/dark smoke plumes and many **angular dark brown shards**, top-down parchment/beige grid world |
| 16.52.57 | Warm tall flame-colored emission with layered gray/orange smoke and scattered sharp fragments |
| 16.53.09 | Dark smoke front and hot small bright impacts with block-like wood debris at edge, tiny character under heavy visual activity |
| 16.53.30 | Cool **cyan/blue translucent upright elements** near center-right (could be ice, magical barrier or splash; identity UNKNOWN), plus damage soot and scorch zones |
| 16.54.03 | **Actual waterfall/falling water** on right, vivid teal/blue pond or pool with white edge foam and splash, nearby warm tiled ground |
| 16.54.20 | Small bright orange burning spots along ground plus diffuse smoke/dust clusters without one enormous opaque covering |
| 16.54.36 | Gray/white turbulent smoke, localized bright flames and flying debris; an extensive but visually partitioned hit area |
| 16.54.50 | Very large **pale, off-white spiraling vortex/tornado**, layered circular curves with center gap; smaller circular marker on ground |
| 16.54.58 | Same broad pale spiral/vortex reading clearly against light ochre paving and teal water; material appears stylized, actual implementation UNKNOWN |

Common scene identity: **isometric miniature/diorama**, warm parchment/sandy paving, soft green vegetation, brown box-like props, saturated but *limited* orange hot cores, neutral warm/cool grays for smoke, teal water, pale cream vortex. Readability mostly depends on **contrast hierarchy and screen-space separation** (small bright primary blast + fragmented angular debris + larger less-bright smoke + slowly dying aftermath), not uniformly bright/opaque particles. The visible balls/lobes are visual shapes; they are **NOT proof of procedural 3D physical simulation**.

## Concrete KFB transfer candidates (hypotheses, not reverse-engineered recipes)
- **Explosion chains**: one bounded saturated core, radial shards + clay-like few 3D fragments, many cheap masked sprite plumes with muted smoke value and staggered lifetimes, then real static rubble. Readability should be checked at **whole-block** scale.
- **2D first**: reuse already existing Brackeys white-alpha muzzle/impact/smoke 4×4 atlas and predrawn flipbooks as the primary non-3D comparison, with opaque/instanced angular debris from real Mech source.
- **3D hero only**: reserve translucent/opaque volumetric clay lobes for foreground near-camera important events; do not apply full 3D Clay shading and shadows to every distant particle.
- **Waterfall**: separate water/environment shader owner (layered mesh/ribbon, directional UV and foam alpha atlas candidate) not automatically a full Navier-Stokes simulation.
- **White tornado/wind AOE**: visually clear hollow spiral path; candidate ring/trail atlas or a sparse helix ribbon/instancing under existing FX owner. The tornado/area hit itself must remain in existing Combat/Mech semantics, not the shader.

Performance acceptance: p50/p95/p99 on actual target renderer/window, screen-space alpha fill cost/overdraw, draw calls, shader compile hitch cold/warm, bounded caps and eviction strategy, subjective ability to follow hit/collapse under **1/4/whole-block** cascades. One VFX owner, one destruction event/physics owner, no generic postprocessing or new engine.

## Gaps
These are real **screen captures**, but no access to original Reddit permalink, engine repo, VFX source shader GLSL, palette parameters, animation timeline, flame thrower range semantics or water simulation; they must remain *UNKNOWN*. Also no side-by-side KFB Golden or source sprite A/B and no target-device performance. Screenshot ownership by Dropbox account does **not** grant a license to redistribute another game's sprites or extract source art.

**Exactly one next productive gate remains:** `KFB SEED WORLD BLOCK-DESTRUCTION HYBRID FX SOURCE-ISOLATION + PERFORMANCE A/B`.
