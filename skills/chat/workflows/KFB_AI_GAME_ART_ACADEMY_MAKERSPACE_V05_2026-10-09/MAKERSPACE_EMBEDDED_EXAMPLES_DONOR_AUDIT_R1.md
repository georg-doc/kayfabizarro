# Maker Space · Three.js / Viewer / Shader / VFX donor shortlist R1
2026-10-09 | PUBLIC REPOSITORY RESEARCH / SOURCE-LEVEL ONLY
Repo/branch: georg-doc/kayfabizarro / planning/kfb-ai-game-art-academy-makerspace-v05-2026-10-09
Status: NO external donor launched, NO original visual source-isolation, NO tested KFB integration, NO public Academy.

## Selection principle

Do NOT substitute a large all-in-one classroom/editor for KFB's existing source owners. Separate **interactive content donor**, **authoring-tool interaction donor**, **asset-processing donor** and **visual/aesthetic reference**. Only visual source isolation + compatibility test can authorize KEEP/ADAPT to runtime. Upstream repository descriptions are not KFB QA evidence.

### Current candidates (source verified 2026-10-09 at repository metadata/README level)

| Donor | What real source advertises | KFB tier | Decision for planning | Proof still required |
|---|---|---|---|---|
| [three.js Examples](https://threejs.org/examples/) + [mrdoob/three.js](https://github.com/mrdoob/three.js/tree/dev/examples) | Official examples for WebGL, WebGPU, TSL, CSS3D, animation, geometry, particles etc; public repo MIT | T0/T1 **after adaptation**; WebGPU/CSS3D T2/T5 | TOP source lesson catalog, not a generic embeddable player. First map source examples to existing KFB lesson adapter, one by one. | Exact example dependency imports, renderer pin, pointer behavior, no own RAF, reset/dispose, mobile GPU |
| [Alchemist0823/three.quarks](https://github.com/Alchemist0823/three.quarks) | Three.js VFX/particle systems, runtime API, batch renderer, visual editor and JSON export/load; public MIT | T0/T1 candidate, editor T2 | HIGHEST NEW FX DONOR for independent animated particle playground / saved effect recipes. WebGPU currently roadmap. | Original editor preview, exact JSON export/load, one FX beside KFB base scene; perf/draw calls; self-owned update lifecycle |
| [donmccurdy/three-gltf-viewer](https://github.com/donmccurdy/three-gltf-viewer) | Drag/drop glTF model preview with WebGL; public MIT, updated 2026-10-06 | T2 standalone inspection, T0 object subset | Strong **visual / inspection donor**, but KFB already has Asset Librarian and props; do not fork another browser library to create a new owner. | Exact GLB animation/material/morph/scale read-back, input lifecycle, reuse on an existing KFB asset clone |
| [donmccurdy/glTF-Transform](https://github.com/donmccurdy/glTF-Transform) | JS/TS SDK / CLI for GLB inspection, optimize, Draco/Meshopt, textures; public MIT | T4 authoring/packaging | HIGH VALUE for actual creator-export validation/optimization, non-visual background packaging tool ONLY after package-owner approval. | Exact KFB GLB transform parity, rig/animation retention, textures/UVs, license/provenance, source SHA |
| [RhythrosaLabs/webgl-studio](https://github.com/RhythrosaLabs/webgl-studio) | React+Three/WebGL2 IDE with live GLSL editor, scene builder, transforms, persistent project management; public MIT | T2 sandbox, T5 runtime | Reference for shader experiments / compiling errors, not whole KFB God Mode editor or in-world iframe as texture. Earlier KFB source audit on Surface owner exists. | Original app scene and GLSL compile/error/restore, shader precision/driver constraints |
| [takahirox/tsl-node-editor](https://github.com/takahirox/tsl-node-editor) | WebGPU TSL node graph, live material preview, JS/TS export; experimental, public MIT | T5 WebGPU research; T2 tool view | Optional later advanced Shader Academy, NOT default KFB WebGL scene shader writer. | Real WebGPU and fallback, serialized graph roundtrip, API compatibility |
| [threlte/three-inspect](https://github.com/threlte/three-inspect) | Debug/inspector for vanilla Three.js, scene hierarchy/material/texture/perf; public MIT, last repo activity 2024 | DEV-ONLY T2 overlay | Diagnostic donor for source inspection and Feynman “observe an actual state”; not a second user editor, version stability unresolved. | Isolate demo and verify API against current Three.js pinned version |
| [pmndrs/triplex](https://github.com/pmndrs/triplex) | Visual workspace for React Three Fiber components, mainly VS Code tool; repo metadata licence unconfirmed in this lookup | T4 authoring-tool reference | NOT an in-world embedded lesson/player; useful for offline source authoring if the owning tool adopts React/R3F. No wholesale fork. | License and React/R3F version, code export, God Mode semantics |
| [mrdoob/three.js editor](https://github.com/mrdoob/three.js/tree/dev/editor) | Official standalone Three.js scene editor family, public MIT project | T4 authoring reference | Useful reference for scene serialization, editing command/history; do NOT replace KFB God Mode. | Inspect actual editor export and compatibility with KFB owner-approved module schema |
| [theringsofsaturn/3D-ai-school-threejs](https://github.com/theringsofsaturn/3D-ai-school-threejs) | Classroom/teacher with HTML chat overlay and speech controls; no real manipulation lesson in inspected frontend; legacy proxy rejected | REFERENCE ONLY | DE-PRIORITIZED / NOT BLOCKING. Its large GLB is not needed for functional Maker Space proof. | No proof needed unless UX comparison specifically later requested |

Web technical grounding:
- Official [multiple scenes](https://threejs.org/manual/pages/multiple-scenes.html) warns against many WebGL contexts and resource duplication. Existing KFB `academy-live.js` renders in same host renderer instead of another context.
- Official [render targets](https://threejs.org/manual/pages/rendertargets.html) documents scene→RT texture flow, the fit for a teaching Billboard.
- Official [WebGPURenderer](https://threejs.org/manual/pages/webgpurenderer) documents WebGPU / TSL material and postprocessing incompatibilities with `WebGLRenderer` + traditional `EffectComposer`. Browser WebGPU support is not the same as drop-in same-runtime compatibility.
- A YouTube iframe is DOM, not an automatic Three.js `VideoTexture`. Direct video textures need usable media and rights/CORS. Focus overlay/DOM alignment/portal must be owner-approved.

## Compatibility and test selection for the first proof

A · **KFB native scene:** exact `misc_controls_drag` + `webgl_instancing_dynamic` from current KFB Travel, source isolate in existing renderer. Verify object move, camera orbit, one RTT host, dispose, fps/draw-call measurements.

B · **One new external functional donor:** recommend `three.quarks` real particle system in its own original demo with JSON export/reload; only **after** B original PASS consider fitting a controlled recipe to an owned KFB lesson-host adapter. Alternative B if shader priorities win: source-isolate a simple official Three.js compatible WebGL ShaderMaterial example (not WebGPU).

C · **KFB existing display/output receiver:** original current Billboard/MediaSurface and one real local KFB prop from Asset Librarian, not invented generic furniture or replacement branding. Verify current receiver owner, source geometry, scene/handoff; distinguish current WB2 from historical B0.

Measure each source independently before any combined composition: screenshot/video, source hash/ref, browser/renderer, dependency versions, GPU/errors, interaction, reset and cleanup, actual status PASS/FAIL/UNKNOWN. No source proof yet done in this audit.

## Extension pathway (not gate now)

Example-backed lesson registry records (concept only):
`lessonId, exampleRef, providerLicense, capabilityTier, preferredRenderer, requiredInputs, allowedMutations, sourcePin, assetRefs, learnerRubricRef, exportAdapter?, perfBudget?, status`.
A user may search original official examples and add *curated* recipes to the Academy domain adapter. Do not attempt remote JS eval or automatic raw demo imports into the World.

God Mode editor operations are reused through typed semantic action permissions; external shaders, particles or node graphs stay sandboxed until a validated profile/export is allowed by KFB Surface owner.

Asset import pathway: `draft → inspect/import → normalize → rig/material/animation test → preview → validated package → backpack reference`, not direct upload-to-Live.

**Acceptance limits:** 0 runnable external demos tested; 0 original visual donor proofs; 0 KFB runtime changes; 0 GPT Site/Cloudflare publishes; 0 human acceptance. This is a shortlist and technical design, not verified compatibility.

**One next gate:** `ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1`, now functional A/B/C and no mandatory original classroom GLB.
