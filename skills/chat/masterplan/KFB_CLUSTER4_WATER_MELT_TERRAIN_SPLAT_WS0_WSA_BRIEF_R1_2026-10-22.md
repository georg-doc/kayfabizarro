# KFB · Cluster 4 · Water / Melt-Terrain Gaussian Splat POC · WS0 / WSA Brief R1

**Date:** 2026-10-22  
**Authoring status:** RESEARCH + DESIGN PROPOSAL / WS0-WSA INTAKE ONLY. No implementation, donor acceptance, Stage, Live, runtime change or implied R4 restart.  
**Owner for this document:** **existing Infinite Canvas / Meta-Narration Flatworld/Gutter Space lane** · `georg-doc/kayfabizarro` · `planning/kfb-flatworld-comic-gutter-r1-2026-10-18` · open Draft PR **#423**.  
**Potential actual runtime consumer:** **the current WS1/WS1b gameplay/MVP terrain & water implementation, as pinned by WS0 from live repo/head**, not the Flatworld design branch and **not** automatic WB2 R4 activation. Only that designated current runtime writer may implement a trial in its existing owner.  
**Relationship to earlier ideas:** additive **Cluster 4** to `KFB_GUTTER_SPACE_SPLAT_PORTAL_ALMANAC_R1_2026-10-22.md` (clusters 1–3: portals/dungeons; spatial Cards/Almanac; rollercoaster Gutter Space). Source term is **Gutter Space**, never “Gatter Space”.

## 1. Georg's product idea, in full

Experimentally overlay or embed a Gaussian-splat scenic layer in/under/along **the existing vivid color-melting KFB terrain and apparent water features**. While driving beside or above it, the player sees a genuine spatially parallaxing **otherworld / scene / depth illusion** through or beyond that terrain. The player does **not** initially need to drive *into* the splats or across a splat physical surface. “Drive-by” and “drive-over” are legitimate first demonstrations. Partial entry and portal crossing remain conditional future hypotheses.

Do **not** construe the proposal as replacing the current water shader, water collision, physics, Track Core contact, road mesh, surface truth, terrain form, Color/Clay look, or world runtime. The existing “water” may be merely a color/material zone rather than a physical plane (historical `travel/travel-v16/terrain-v16/voxel-terrain.js` explicitly uses color-only water/tint with unchanged height); **inspect current receiving source before assuming any transparent/refraction plane is available.**

**Narrative/design purpose:** a mundane KFB shore, tint basin, liquid-color terrain gutter or bridge briefly reveals a coherent, source-connected alternate world (card/deck environment, sunken place, Almanac echo, surreal landscape), with parallax and spatial depth from the moving third-person/drive camera. It should be more than generic particle decoration.

## 2. Three graduated scenes (not three new runtimes)

### POC-A · Shoreline / Melt-Basin Look-Through — FIRST

- Choose **one actual source-backed current MVP water-like or color-melt terrain seam**; maintain source geometry/support/collision/drive system unchanged.
- Scene or equivalent behind it: compact SplatMesh/scenic source in bounded volume. Placement may be under a translucent window, beside an ink-edged rim, beyond a visible opening, or inside a nonphysical reveal. Use the **currently implemented** water/material truth; no fake global water plane.
- Third-person drive-by + foot/camera walk-past, near/mid/far viewing, rotate camera and change speeds. Show actual parallax, correct concealment and a deliberate visual relation to the current deck/biome.
- Comparative controls: (A0) current unchanged water/terrain, (A1) cheap mesh/impostor/shader scenic layer, (A2) source-isolated Gaussian splat layer. If A1 achieves the product experience more cheaply/cleanly, **do not force Gaussian Splatting**.

### POC-B · Bridge / Drive-Over Otherworld — CONDITIONAL AFTER A

- Reuse real existing Track Core/Joyride bridge or safe elevated track; current driving/contact/camera remain unchanged.
- Under the carriageway a layered otherworld is visible; consider occlusion, alpha layering, apparent refraction and shadow mixing from multiple drive heights and camera angles.
- It is **not** a splat collision surface, and must not disable road readability or vehicle support.

### POC-C · Melt-Ribbon / Portal-Hint — DEFERRED

- Local colored terrain bands/runnels/paper-gutter-like cuts reveal separate world slices. Optional relation to future portal/card zone.
- No automatic transition logic, unlock bypass, instance creation or full cave/dungeon/free-drive-into-splat requirement.

**Anti-scope:** no entire map reskin, no “water replacement” architecture, no second full-screen WebGL canvas, no second RAF/camera/player controller or terrain/surface height truth, no generic neon ring and no revived WB2 R4.

## 3. What Gaussian splats are here (engineering distinction)

A Gaussian splat is a view-dependent volumetric rendering primitive, generally an oriented anisotropic Gaussian with color/opacity (and possibly view-dependent coefficients). It is **not** a water simulation, physically reliable collision geometry, a universal portal shader, raytraced refraction, fluid dynamics or a drivable heightfield. Some splat renderers permit transforms/editing, but dynamic non-Euclidean architecture requires separate scene/mesh/animation/shader logic.

Two practical strategies to test:
- **Behind/along existing opaque world geometry:** clip/mask/show the splat through a deliberately authored window/shore opening, lowering transparency and sorting risks.
- **Under an actual translucent surface if the current owner has one:** test blending, depth-buffer access, render order, occlusion, cross-object transparency, incorrect bleed-through and apparent refraction; no physical correctness assumed.

## 4. Tool / renderer shortlist — CODE licensing is not SCENE licensing

| Candidate | Role and verified license | Status / action |
| --- | --- | --- |
| **Spark** — https://github.com/sparkjsdev/spark | Three.js Gaussian splat renderer, **MIT**; README demonstrates `THREE.WebGLRenderer` with `SparkRenderer` and `SplatMesh`; dynamic transforms and editing advertised. | **P1 ISOLATE** an exact tagged release + license + source object. Evaluate compatibility with real WS1 R3F/Three.js versions, single render loop, depth/alpha, loading/cleanup and bundle/wasm constraints. |
| **SuperSplat** — https://github.com/playcanvas/supersplat | Browser Gaussian splat editor, **MIT** according to official PlayCanvas; supports cropping/cleanup/export and current WebGPU editing. | **P1 AUTHORING** tool for trim/compress/inspect sources; not a second live KFB world renderer. |
| **GaussianSplats3D** — https://github.com/mkkellogg/GaussianSplats3D | Three.js viewer/renderer, **MIT** on GitHub. | **P2 COMPARATOR** if Spark cannot meet existing render/occlusion budget. |
| **Three.js GaussianSplat** — https://threejs.org/docs/pages/GaussianSplat.html | Official Three.js API, tied to `WebGPURenderer` (its forceWebGL path supported, ordinary `WebGLRenderer` not); Three.js license separately check at pinned revision. | **P3 ONLY** if receiving renderer is already appropriately WebGPU-capable; do **not** replace existing renderer just to try a scenic layer. |

Verified web source: Spark https://github.com/sparkjsdev/spark; SuperSplat https://playcanvas.com/products/supersplat; GaussianSplats3D https://github.com/mkkellogg/GaussianSplats3D; Three.js API https://threejs.org/docs/pages/GaussianSplat.html (accessed 2026-10-22). **A renderer's MIT license does not confer MIT/CC0 on the sample scene or training imagery.**

## 5. Actual Splat / optical-illusion asset leads (individual content licensing)

| Source (exact scene page) | Web-observed facts (2026-10-22) | Suitability / readiness |
| --- | --- | --- |
| **Tornado — synthetic Gaussian splat** — https://superspl.at/scene/34cef7dd | Scene page explicitly shows **Download CC BY 4.0**, ca. **4.95 MB / 412.2K splats**; synthetic Houdini/LichtFeld VDB tornado; creator dabadan. | **FIRST EXTERNAL CANDIDATE**: compact rotating/funnel-like spatial illusion in melt basin. LICENSE PAGE FOUND, **payload not fetched/hashed/imported/rendered**. Preserve credit + adapted indicator. Check whether exported file and software can actually reproduce animated movement (trained capture is not automatically time-varying). |
| **Cobweb Scope — synthetic Gaussian splat** — https://superspl.at/scene/73614e89 | **Download CC BY 4.0**, ca. **75.97 MB / 5.9M splats**; transparent filament/cobweb study. | **REFERENCE / HEAVY**, good for alpha/depth stress test, unsuitable as first compact MVP candidate. No payload intake. |
| **ChatGPT dots – Felipe** — https://superspl.at/scene/ca6a4c9b | **Download CC BY 4.0**, ca. **113.59 MB / 3.5M splats**, stated Blender MCP + LichtFeld Studio origin. | **REFERENCE / LARGE** stylization precedent, not production KFB branding or an automatic import. No payload intake. |
| **Doors of Perception** — https://superspl.at/scene/a6df26f1 | Photographic/perceptual exhibition scene with **57.24 MB / 1.6M splats**. In inspected page text no explicit license or download grant confirmed. | **VISUAL REFERENCE ONLY — NOT CLEARED FOR IMPORT** until exact creator/scene rights, source/credit and downloadable artifact are verified. |

**Copyright & provenance rule:** SuperSplat platform/editor MIT does not make creator uploads MIT. CC BY 4.0 allows adaptation/commercial use with its attribution and change-notice obligations; no silent “CC0” relabeling. Other CC variants may constrain use; default to **reject/no-import** until exact license and file source are pinned. Scene pages are evidence for web-displayed licensing, **not** byte-level or source-object inspection.

## 6. Preferred CC0 source pipeline (these are NOT premade splats)

- **Poly Haven** — https://polyhaven.com/license — CC0 HDRIs, textures, models; suitable for legal Blender scenery inputs/lighting.
- **Kenney** — https://kenney.nl/support — CC0 game assets on asset pages; suitable for playful low-poly scene components, excluding Kenney logo.
- **Quaternius** — https://quaternius.com/faq.html — models stated CC0; candidate architecture/foliage/composition donors.
- **OpenGameArt: Abstract Texture Pack** — https://opengameart.org/content/abstract-texture-pack — 300 procedural abstract textures, source page CC0; **textures, not splats**.
- **OpenGameArt: Seamless Abstract Pack** — https://opengameart.org/content/seamless-abstract-pack — 150 seamless abstract textures, source page CC0; **textures, not splats**.
- **Existing KFB-owned Blender/scene sources** — rights/provenance must still be checked individually (including constituent purchased assets); **private purchased donor bytes never copied to public deployment**.

**Generation option:** compose a KFB style-authentic mini-world from actually license-cleared models/textures, render multi-view from Blender, train/export a compact splat, crop/compress with SuperSplat, then reproduce via one existing-Three.js Spark adapter. Check dependencies, training tool license and output/payload provenance; **none of these processing steps was run in this research slice**.

## 7. Research backlog with intake/evidence gates

**R0 · Source/owner inventory (WS0 → designated WS1 runtime writer):**
- Pin exact current MVP repo/branch/head, actual water/melt material/geometry, single surface/Track/vehicle/camera/renderer/Audio owners and already implemented 3D test route.
- Identify what “water” *really* means there (opaque color zone, transparent water plane, mesh, shader) and where one optional depth layer can attach non-destructively. Historical Travel water tint alone is NOT present-MVP proof.
- Pin current Three.js / R3F / WebGL-WebGPU versions, render loop/cleanup and existing current FPS/device/test surface.

**R1 · Licensing and donor sourcing (Asset Librarian is discovery/intake consumer, not renderer):**
- List exact repository tag/commit and MIT license files for Spark, SuperSplat, fallback.
- For each scene, record immutable URL/creator/title, download flag, full CC variant, credit format, commercial/derivative terms, size, format, source hash SHA-256 and approved public/private status; **do not mark 3D source isolated merely because a URL loads**.
- Obtain/download only cleared candidate payload(s); inventory renderable splat object in an **isolated viewer** with screenshot/clip and camera positions. Mark KEEP / ADAPT / REJECT.
- If no small ready-to-use CC0 splat is found, do **not invent one**; use explicit CC BY attribution or create own from verified CC0 inputs.

**R2 · Renderer/visual test (one receiving code writer, only after authorization):**
- One optional `SplatScenicLayer` consumer under existing world scene/camera; no own game/terrain owner or second canvas/RAF.
- Three screenshot/viewpoint tests (shoreline drive-by, eye-level parallax, high-angle drive-over), plus current default/A0 and cheapest A1 non-splat comparator with identical conditions.
- Record opacity/depth/occlusion, world-to-splat position/origin scale, animation limitations, cloud/public URL access and fallback when splat fails.
- Measure startup/load seconds, network bytes, GPU memory if available, frame timings/FPS on the same hardware and graphics load; define PASS budgets with current owner, do not invent numbers.

**R3 · Owner acceptance and handoff:**
- Independent factual integration tester + independent visual critic; Production Guard classifies continue/defer/quarantine/stop per existing protocol.
- If visual effect is poor or source/license uncleared after two non-improving repair passes, preserve candidate + evidence, defer smallest seam unless it is outcome-critical.
- Return exact repo/branch/PR/head, source hash and scene license, screenshot/video proof, numerical checks/fails and one next gate; Site/Stage URL only if required and actually opened/verified.
- No merge/Live by this document. No R4 restart without separate human authority.

## 8. Narrow acceptance / explicit negative tests

**Proposed functional checks:**
1. Current MVP surface collision/support/drive remain byte-for-byte or behaviorally unchanged. Existing “water” is not silently remodeled.
2. A real, rights-cleared SplatScene shows **viewer-dependent parallax** while driving along the bank/bridge. No 2D fake image counted as a successful Gaussian-splat integration.
3. Foreground props, vehicle, bank and bridge correctly occlude splat in tested views; no significant unwanted alpha/sorting bleed.
4. Existing material color, ink, clay, motion and camera remain coherent; generic realistic scan with no KFB visual relationship is not aesthetic PASS.
5. Disabling/failure/unavailability restores the same playable baseline (including support, collision and progression).
6. At least one **non-splat fallback comparator** evaluated; if cheaper method produces equal/better intended experience, keep it.
7. Runtime budget measured rather than claimed, on target hardware without parallel GPU load.
8. No unauthorized CC content, no private bytes published, and required attribution is retained.

**Not accepted by:** licensing badge alone, a downloaded .ply filename, successful import but invisible source, isolated screenshot masquerading as in-game, historical FPS number, a generic shader tunnel, local-only preview falsely called public Stage, or 3D splats being treated as drivable collision.

## 9. Executable WS0 → WSA handoff (copy-ready)

> **WS0**: Source-sync the current KFB production router, Flatworld PR #423 and Cluster-4 brief. Pin the **actual current MVP terrain/water owner** and identify its no-risk seam; assess whether a tiny isolated scenic test fits current WS1/WS1b milestones. Protect WB2 R4 STOP / Four-Island A/B gate. Route one scoped conditional proof to the current runtime writer only after owner authority, not to a new engine.
>
> **WSA Work/Claude Code (only after WS0 intake)**: In the pinned current runtime owner's repo/branch, independently inspect exact code. Show one permissively licensed actual splat asset in isolation first (preferred tiny synthetic Tornado CC BY 4.0 with credit or own CC0-derived source). Compare A0 unchanged / A1 cheap mesh-impostor / A2 splat for shoreline drive-by; record actual camera/occlusion/performance/fallback and render proof. B bridge and C melt ribbon remain conditional. Preserve canonical Track/Surface/Water/Audio and world state. No merge/Live. Return exact changed paths, head, measured tests, source/license SHA, visible proof, unresolved points and one next gate.

## 10. Single next gate and research status

**One gate:** **WS0 identifies the actual current WS1 MVP water/melt-terrain renderer/owner seam and authorizes or defers one isolated Shoreline A0/A1/A2 donor test.** Do not manufacture a separate Georgian human approval merely for collecting more URL lists.

**As of this research authoring:** source pages were web-checked 2026-10-22; **source code/asset payload isolation: 0; assets imported: 0; integration tests: 0; actual renders: 0; Site/Stage verification: 0.** This is a researched shortlist and execution brief, not a visual/runtime result.

## Evidence URLs (checked 2026-10-22)

- Spark MIT / Three.js WebGL setup: https://github.com/sparkjsdev/spark
- GaussianSplats3D MIT: https://github.com/mkkellogg/GaussianSplats3D
- SuperSplat MIT: https://playcanvas.com/products/supersplat and https://blog.playcanvas.com/new-in-supersplat-downloadable-splats-licenses-and-social-links/
- Three.js GaussianSplat renderer constraint: https://threejs.org/docs/pages/GaussianSplat.html
- SuperSplat user assets: https://superspl.at/scene/34cef7dd ; https://superspl.at/scene/73614e89 ; https://superspl.at/scene/ca6a4c9b ; https://superspl.at/scene/a6df26f1
- CC0 sources: https://polyhaven.com/license ; https://kenney.nl/support ; https://quaternius.com/faq.html ; https://opengameart.org/content/abstract-texture-pack ; https://opengameart.org/content/seamless-abstract-pack
- KFB source SSOT: `skills/chat/masterplan/KFB_GUTTER_SPACE_SPLAT_PORTAL_ALMANAC_R1_2026-10-22.md` ; `skills/chat/masterplan/KFB_FLATWORLD_COMIC_GUTTER_DESIGN_2026-10-18.md` ; `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md`.

## Additive history

- **2026-10-22:** Georg authorized the research/briefing follow-up to Cluster 4; source-backed tool/scene licensing distinction, bounded Shoreline/Bridge/Melt POC, WS0/WSA next gate and explicit 0-run evidence status documented. No runtime/asset/publication writes.
