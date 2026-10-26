# KFB Mindspace Sphere × Globe.GL / three-globe × Meta-Worlds · R3
**Date:** 2026-10-25 · **Class:** USER INTENT + SOURCE-GROUNDED OPTIONS ONLY · NO BUILD · NO GOLDEN · NO RUNTIME CHANGE.
**Existing owner:** KFB Mindspace / Infinite Canvas design lane, georg-doc/kayfabizarro, branch planning/kfb-mindspace-modular-world-r1-2026-10-24, Draft PR #448. Actual active WS1 scene owner remains the receiving terrain/physics/renderer/camera/POI authority.

## 1 · Georg intent, not forced technique
Embed the pre-existing *planned* KFB Mindspace Sphere as an authored Genii-Loci/Pocket threshold in WS1 continuous terrain. Through/inside that sphere the player can see, turn and possibly enter surreal Meta-Worlds, conceptual continents, own KFB Cards/Almanac links, strange popup landmarks and nested spheres. A globe need not depict the literal Earth. Optical shifts, Gutter/caustic/Splat/art collage possible, but not imposed. No new engine or replacement of original H13, Audio, Card or scene owners. **The existing Sphere is still a design possibility, not a proven integrated model** (MINDSPACE_MODULE_ARCHITECTURE_R1.md, KFB_MINDSPACE_VISION_R1.md).

## 2 · Exact technology distinction
- [globe.gl](https://globe.gl/) is a DOM-hosted high-level ThreeJS/WebGL globe with own renderer/camera/controls/render cycle; best as external idea/reference or isolated standalone demo. Do **not** mount an additional active canvas/world renderer in WS1.
- [three-globe](https://github.com/vasturiano/three-globe) is a **Three.js Object3D globe** (official basic example adds to an existing Three Scene). Its layers include points, arcs, polylines/paths, polygons, 3D custom objects, custom layers, spherical coords and globeMaterial/showGlobe; can be an optional inner-world render object in WS1's single active renderer. Source docs confirmed, actual KFB scene integration NOT RUN.
- [r3f-globe](https://github.com/vasturiano/r3f-globe) offers actual React Three Fiber binding, an especially relevant adapter to WS1 R3F scene; `<R3fGlobe/>` belongs **inside** existing `<Canvas>` as a child, not a second Canvas. Three/R3F/peer package version compatibility not yet tested.
- External libs MIT does not license map textures, geographic datasets, Creator/Meshy models, purchased packs or hosted splat media. Donor/source pixels have **not** been visually isolated in KFB.

## 3 · Artistic construction options — no canon decision
| Option | What the player experiences | Requirements / caveats |
| --- | --- | --- |
| A · FLOATING WORLD WITHIN WORLD | From actual KFB terrain, look through a material/caustic shell at a tiny authored globe with a few luminous arcs, semantic cities, curated popup silhouettes and KFB Cards | **Smallest first comparison**; one camera, one renderer, true real terrain unchanged. Globe lat/lng may be synthetic semantic coordinates, not fake OSM. |
| B · INSIDE-OUT MAP | Enter bounded pocket and see surreal map of ideas/constellations on spherical **inner wall**; editorial nodes hover inward | An outward-oriented three-globe is NOT automatically an inward-facing texture. Requires explicit THREE.BackSide interior dome material/UV mapping and inward-facing objects or separate custom layers. Test depth/occlusion/label readability. |
| C · NESTED META-WORLDS | Enter a selected tiny sphere/Card node to change to a source-backed Pocket scene or Almanac; apparent infinite scale | Only one actual active scene owner, explicit enter/return context and control restore. Do not create 20 simultaneous full globe renderers. |
| D · NO GLOBE | Simple lightweight shader/cutout/constellation layer on own sphere for a scene that does not need globe geodesics | Compare this baseline to imported globe library. More efficient or artistic option may win. |

**Six existing Mindspace modes** (SIX_MINDSPACES_APPLICATION_AUDIO_SPLAT_MAPPING_R2.md): Threshold Observatory has strongest conceptual reason for globe or orbital mapping; Fractal Vision and Dream Passage use it optionally; Creative Atelier can display card-idea constellations; Mirror Chamber and Living Garden need not include globes at all. Don't turn all six modes into six globes.

## 4 · One existing WS1 entry/scene and data ownership
Planned flow:
`real WS1 terrain/POI → dormant Sphere shell / optional glimpse → WS1 host enter state → bounded Mindspace scene within same renderer → local globe/card relationships and H13 scene cues → select node (only source-verified Card/Deck/Scene/POI) → leave/ESC → exact host-owned player/camera/physics return`.
Use one authoritative WS1 terrain/physics/camera and one KFB Audio mixer; Mindspace local progress must not clone Quest, Almanac, Portal or asset registry state. `lat/lng` in the globe is only the content coordinate system, not World Terrain lat/lng; adapter must establish separate transforms.
Layer data could conceptually be curated `nodeRefs` + `relationRefs` + `visualRecipeRef`, but **no schema/API exists yet**. Curated Cards/semantic links are preferable to random dot placement.

## 5 · Performance / visual acceptance later
- Inactive Pocket = render no expensive inner detail; maybe a static low-cost sphere shell or cached preview. No duplicate requestAnimationFrame, WebGL context or AudioContext.
- A/B: same source-authentic small sphere and 3–5 real KFB nodes, first simple sphere + THREE line objects, then r3f-globe/three-globe. Compare meaningful visual depth & interaction, not library novelty.
- Test original opaque/glass/caustic shell, alpha overdraw, raycast hit target, shell clipping/depth sorting, backface interior, source KFB palette, near-camera readability, responsive selection, safe exit, reduced motion.
- Record measured frame time, draw calls, memory and loading **in actual WS1 receiver hardware**, not inferred FPS. `three-globe` docs include `globeCurvatureResolution`, `pointsMerge`, `setPointOfView(camera)`, `pauseAnimation()` for relevant tuning; no performance PASS claimed.
- Real Lovable breathing app, authentic source-isolated original H13, selected Garden and WS1 receiving API remain **SOURCE_REQUIRED**. No KFB rendered image, code import, screenshot, browser, interactive, GPU or Stage tests run (all 0).

## 6 · One unchanged next gate
**WS0 isolates the actual Lovable breathing app, unmodified authored H13 and one authentic beautiful Mindspace/Garden visual; Georg selects first design.** This new globe idea is a **nonblocking option inside that selection**, not authorization for a new Globe runtime, Site, mandatory Sphere feature or a second WS1 gate. Only afterward does WS1 inspect exact active receiver APIs and choose any bounded source-authentic scene/POI visualization test. No merge/Live.
