# R14 · CORRECTION — Gaussian Splats inside HyperNorm Card Buildings
**2026-10-29 | User correction to previous answer: "gaussian splats meinte ich…"**
**CONCEPT ADDENDUM ONLY. NO new runtime, source/GPU proof, approval or official V-962 brief rewrite.**

## 0. Correct reading (source-of-truth wording)
The user means **Gaussian Splats / 3D Gaussian Splatting (3DGS)**, NOT "Splits" (splits/rips) as a named feature. There can still be **a portal-like opening** created by the existing shell damage masks and structural destruction: through it the player sees **a 3D Gaussian-splat scene or volume**. The visual 3DGS dataset is what was proposed for the windows/portals, not a "split portal" technology.

Do not continue to write a new "Split" typology as if the user asked for one. Visual openings, cuts or peeling facades remain just optional geometry/mask exposure methods for revealing the 3D Gaussian splats.

## 1. Concept sketch
Outside: stable rectangular Card Building with current KFB HyperNorm moving collage/atlas across selected faces, clipped by a game-approved damage mask.
Behind the opening: a **bounded 3D Gaussian-splat volume** (possible pocket landscape, server-farm interior, KFB abstract mindscape, localized card-derived spatial scene), visible with depth/parallax on camera movement; an original source KFB card may be readable in its own separate layer / vault.
Gutter: existing maze edges → real Joyride/Track Core road/contact and Fluff movement, FB remains original fully animated 3D actor; the splat interior is an attractive visual layer, **not automatically a driveable/walkable collidable environment**.
Optional bridge: while the outer wall breaks, splat volume may become visible and colors can inform other independent KFB clay ball debris/Fluff trails; **Gaussian splat primitives ≠ physical spherical particles**. 3DGS uses view-dependent anisotropic Gaussian primitives with color/opacity; source-colored KFB beads with actual visible rolling and contact are a different instanced-mesh/physics system.

## 2. Feasible stage sequence and important traps
**S0:** one source-authentic single-building prototype with animated exterior, one precomputed verified/licensed 3DGS file or scene, one readable damage aperture, camera moves across multiple angles, source card visible separately, original FB_CANON freely navigates outside.
**S1:** only after transparency/depth proof, reveal scene through a shell aperture (stencil/depth mask/geometry-backed opening or offscreen composite). Test splat transparency sorting with other shell and Goo transparent overlays, depth/occlusion of the shell, and clipping/projection at oblique camera angles. Shader alpha discard alone does not change collider; actual structural wall breach requires matching Destruction sector event/host collider update.
**S2 (optional):** animated splat transition or splat-derived ambiance spilling across boundary. If physically rolling colored spheres are wanted, spawn a separate bounded instanced-clay-bead system, with only sparse real collisions; the splat renderer does not solve granular fluid physics. An actual pocket world travel portal is a separate later Game/World transition, not an automatic consequence of rendering splats behind a hole.
**Perf:** 3DGS sorting, alpha overdraw, asset memory/loading and video/CanvasTexture uploads may be expensive, especially with multiple live HyperNorm faces. Start with **one** splat scene visible through **one** card-building aperture; freeze/LOD/hide when outside view, and provide static/card art fallback on weak mobile hardware. Real desktop and phone frame time/p50/p95 required before expanding to 4/12/56 buildings.
**Data/source:** a flat 2D card image does not itself supply a true 3D Gaussian splat scene; obtain a genuinely sourced 3DGS asset or explicitly generate/render a source-compatible volume as a separate validated experiment. Do not mislabel earlier Card Zone v2 source-colored instanced voxels or the R2/R3 ball experiment as a production-ready 3DGS reconstruction.

## 3. Existing source relationship / provenance limitations
- `R13` already documented HyperNorm 2D source (H13), H14-derived CanvasTexture Billboard-to-3D bridge, and masked Card Vault + separate colored instanced balls. Those source facts remain intact.
- `V-968` referenced Gaussian-splat and GPU particle explorations for Mindscapes, but this particular audited main-repo search did **not** find a verified reusable **runtime 3DGS renderer pipeline/contract**. The existing KFB research/proofs from other branches/sites should be located and source-pinned by WS0/WSA *before* declaring POC readiness. A source image or static splat screenshot is not equivalent to real inspectable 3DGS rendering.
- The existing R13 concept's "pocket scene" and "card reveal" options remain valid, now with an explicit **3DGS_PORTAL_VIEW** candidate alongside native scene rendering and a static fallback.
- Reference semantic placement: `CardBuilding.shellDamageMask` gives the visual opening, `CardBuilding.splatView` references the bounded splat dataset/visual runtime and enabled LOD, `CardBuilding.cardVault` references a real Card Registry item, while `cascade-core` and Destruct/Combat authority determine actual state/collision and Fluff exchange.

## 4. WS0 desired correction
In any future amended V-962 / Gutter City briefing, explicitly state:
> A damaged HyperNorm Card Building can expose a **bounded Gaussian-Splat 3D scene** behind a real visually and physically consistent aperture. Gaussian splats are a volumetric visual representation (pocket worlds and surreal interiors), NOT a scripted "Split" feature, not source-colored rigid beads, and not player collision or a traversable world by default. Preserve real 3D FB_CANON, existing Maze/Track/Combat/Destruct/Card owners. First gate: one original building, one real source-pinned 3DGS dataset, one aperture, three camera angles, and an independently observable fps/memory fall-back test. No broad 56-building live splat simulation or new 3DGS owner before source proof.

**No authorization to implement:** exact GS format, renderer, WebGPU/WebGL backend, site owner and license not selected; no source 3DGS asset retrieved or compiled. R14 only corrects the misunderstanding and records the concept for WS0. Official V-962 remains unchanged.
