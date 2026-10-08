# KFB 3D Editor / Shader / Inspector Donor Audit R1 · 2026-10-08

**Status:** RESEARCH / SOURCE-INSPECTED CANDIDATES ONLY · NO RUNTIME ADOPTION · NO LIVE CLAIM
**Existing owner:** KFB Surface / Material Language · receiving KFB World
**Branch:** `planning/hybrid-baked-clay-texture-architecture-2026-10-07`
**Companion track:** AI Game Art Academy Living Document v0.4 (learning product, deliberately separate; no Academy runtime changes).
**Read with:** `skills/chat/KFB_SURFACE_MATERIAL_LANGUAGE_STEERING_2026-10-07.md`, `skills/chat/KFB_HYBRID_BAKED_CLAY_TEXTURE_ARCHITECTURE_PREP_2026-10-07.md`, `skills/chat/KFB_STYLIZED_SURFACE_SHADER_RESEARCH_2026-10-07.md`, and main `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`.
**Protection:** Existing K1/H0 Golden, K2/v10 ownership, source identity, Claybound visual threshold, material lab A–E, WB2 world/Track Core/Unity/Godot boundaries, current Island R4 STOP, and A/B visual-design gate all remain untouched.

## 0. Executive finding

The external projects do **not** provide a tested replacement for the KFB Clay material language or editor. Their most immediate production value is **inspection, parameter exploration, visual comparison, and a reproducible test harness** surrounding the existing material implementations. Source read != running demo; no source object was visually source-isolated during this research. Integration is blocked until that is done.

In particular, the repository already planned a **same-scene material lab A–E** comparing K2/v10 clay, baked hybrid, toon/cel, mathematical family, and optional matcap. This audit **adds candidate controls and measurements to that lab**; it does not open a second lab or material authority.

## 1. Source contact sheet — source objects in isolation, before any integration

| Donor and code | Confirmed in actual source | Potential isolated sample | Assessment / limitations |
|---|---|---|---|
| `RhythrosaLabs/webgl-studio` [repo](https://github.com/RhythrosaLabs/webgl-studio), [ShaderEditor.tsx](https://github.com/RhythrosaLabs/webgl-studio/blob/main/src/components/Editor/ShaderEditor.tsx), [WorldView.tsx](https://github.com/RhythrosaLabs/webgl-studio/blob/main/src/components/SceneBuilder/WorldView.tsx) | React/CodeMirror vertex+fragment code inputs; R3F scene/primitive/GLTF view, TransformControls, editable object transforms. README claims live preview/IndexedDB. | Run **donor alone**, with its own demo/default mesh and error console; screenshot GLSL + mesh + actual compile response; do not mix with KFB. | **ADAPT INTERACTION PATTERNS / NOT WHOLE APP**. Small early repository (~3 commits), old Three/R3F stack; object selection/transform code needs stability and perf tests. MIT. |
| `takahirox/tsl-node-editor` [repo](https://github.com/takahirox/tsl-node-editor) | Node-graph editor for Three.js TSL, WebGPU preview and source/material export as documented. Source tree `src/App.tsx` very large and monolithic (~677 KB). | Show untouched donor editor, one parameter-linked shader node changing an isolated sphere in WebGPU browser; record unsupported-browser fallback. | **KEEP AS REFERENCE / ADAPT ONLY AFTER COST AUDIT**. MIT; author explicitly experimental/not thoroughly tested; likely heavyweight integration. |
| `threlte/three-inspect` [repo](https://github.com/threlte/three-inspect) | `createInspector(target,{scene,camera,renderer})` documented for vanilla Three.js; object/material/texture tree, lighting/shadow helpers, perf monitoring. | Run on its default example **alone**; object hierarchy, material editor, memory, frame stats; record library overhead/dispose. | **TOP PRIORITY FOR DIAGNOSTIC DONOR**; MIT. Project warns pre-1.0 breaking changes; dev-only first. Must NOT become another production editor. |
| `Design0r/shaderpass` [repo](https://github.com/Design0r/shaderpass) | GLSL visual graph, values/noise nodes, realtime sphere preview, serializable graph JSON as described. | Source-only graph demonstration; export/reload one minimal shader graph in donor app before adaptation. | **OPTIONAL STUDY / NO ADOPTION**: small codebase, weak maintenance evidence, potential divergent format; MIT per repository. |
| KFB `KFB Material Bench.dc.html` [source](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/donor-bank/KFB%20Material%20Bench.dc.html) | Existing legacy Material Bench file located in ToolBox inbox. | Show KFB Bench untouched, before considering external tools; compare its available knobs, display & style identity. | **SOURCE REQUIRED BEFORE EDITING.** No visuals or running behavior accepted in this audit. |
| KFB `pet-surface.v1.js` [source](https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/pet-surface.v1.js) | Actual custom GLSL via `onBeforeCompile`, object-space triplanar, noise, color/paper/normal adjustment. This is a specific Pet-surface donor, NOT automatically K2/Clay World owner. | Show canonical source Pet material by itself with untouched material defaults and fixed light/camera. | **OWNER-FILTERED REFERENCE**; preserve Pet visual/rig ownership. |
| KFB `clay-material.v10.js` / `clay-relief.v4.js` / `clay-toolmix.v1.js` | Exact named K2 owner modules and K1 Golden requirement specified in current Clay Surface Canon. | Render current K2 and fixed K1 Golden first, before adding any comparison or shader control. | **AUTHORITATIVE EXISTING OWNER.** Do not swap shaders by loading another demo. |

**Source-isolation rule:** link or source-code inspection alone does not prove the original visual donor was reproduced; require exact donor app/object, untouched code or pinned revision, one fixed camera, screenshot/short video, console + browser/renderer versions and clear KEEP/ADAPT/REJECT. KFB source isolation comes before combined comparison. Never publish donor demos as acceptance routes. Formal human testing, if later authorized, uses a direct `https://kayfabizarro.pages.dev/…` Hub-linked Stage route.

## 2. Concrete uses in active KFB workflows — rank by expected benefit

### P1 · Diagnostic overlay for existing material/visual lab
- Try `three-inspect` in an **isolated lab** with a representative source-accepted KFB asset; inspect hierarchy, material parameters, transforms, textures, shadow frustum/normalBias and memory/frame statistics.
- Keep editor read-only or sandbox-local; do not let it write into WB2 or live asset manifest.
- Important use: distinguish contact/shadow defects from shader/terrain geometry defects; avoid fake base plates or 'fixed' texture hiding a seam.
- Test: same camera, same KFB object; snapshot actual uniform/material/texture state, compare screenshots before/after one controlled parameter change; no change to source asset/owner.

### P1 · Surface-profile comparison & safe shader experiment
- Extend **existing** KFB Surface/Material Language Lab A–E with live material tweaking, fixed-scene screenshot pairs, and an exportable *parameter receipt* (family profile, exact source blob/commit, seed, K1/K2 ref, camera, light, GPU/frame time, material and draw-call count, texture memory where measurable).
- Candidates already approved *for comparison only*: K2/v10 Clay, baked hybrid, Toon/Cel, procedural/material family, optional matcap.
- `webgl-studio` may contribute GLSL code-edit/compile-error patterns; `tsl-node-editor` may contribute visually editable TSL flow but **only if compatible with the actual active renderer and its pin**.
- Do not count generic glossy GLSL as Claybound quality; visual acceptance requires K1 Golden / whole-scene cohesion.

### P2 · Runtime cost differentiation and cheap surface alternatives
- Bench cost of object-rest-space K2 tri-axial relief vs cheap world-space triplanar `clay_floor_001` **stand-in**; label the latter DONOR, never 'KFB final clay.'
- Add one biplanar / directional 3-color alternative already discussed in `KFB_STYLIZED_SURFACE_SHADER_RESEARCH_2026-10-07.md`.
- Record shader/fragment time, draw calls, VRAM, near/traversal/far and shadow contact with identical content & light; profile fixed Golden K1 and K2 before alternatives.
- For OSM/World procedural mass geometry test shared deterministic per-family palette/atlas instead of per-building arbitrary unique shaders.

### P2 · Blender ↔ web material translation
- Blender Eevee Shader-to-RGB / ColorRamp is an **authoring reference**; web runtime must reimplement in Three.js or bake the result. TSL/GLSL WebGPU experiments are not automatically Unity Shader Graph or Godot .gdshader.
- When useful, specify a neutral intermediate **material-recipe record** (visual intent, palette, surface frequencies, light response, maps, provenance) and engine-specific implementations. Do NOT introduce a new material runtime owner/schema without owning approval.

### P3 · Academy-linked demo lessons (separate learner product)
- Shader graphs, inspectable materials, and performance experiments can become **optional learning missions** with an external tutor later.
- Academy exercise progress, learner identity and completion records MUST NOT mutate KFB World/Asset Registry/Production Control truth.
- Reuse source-proven KFB material lab demos only by explicit snapshot/donor contract.

## 3. Security and technical caution

- External shader editing / arbitrary GLSL should run in development-only sandbox with error handling, resource limits, no user-provided scripts in privileged live world.
- A public 3D tutoring proof `theringsofsaturn/3D-ai-school-threejs` contains a classroom/teacher avatar and voice/chat UI (React/R3F); its inspected `proxy-server/proxy.js` uses open CORS, logs request bodies, a fixed legacy `gpt-3.5-turbo` endpoint and no user authentication/rate limit, while the frontend calls `http://localhost:3001/api/chatgpt`. The public repository tree contains a tracked `proxy-server/.env` path; **do not fetch, copy or trust any possible secrets**. Classification: **UX concept donor only, backend REJECT**. KFB characters/rigs need current source isolation; historical Cube-Pets are not current-character canon.
- Do not confuse having an LLM chat with a documented mastery evaluator or durable user-bound course persistence.

## 4. One bounded next production gate (not yet authorized)

**KFB_SURFACE_LAB_INSPECTOR_DONOR_PROOF_01 — development-only.**
Use the already named `planning/hybrid-baked-clay-texture-architecture-2026-10-07` owner (no new shader owner):
1. Isolate and show current KFB Material Bench, fixed K1 Golden, and current K2 candidate with correct camera/light.
2. Isolate and run `three-inspect` source demo; record actual supported material/texture/perf controls, visible version and CPU/GPU overhead.
3. If compatible, connect to one **disposable clone** of KFB source scene on an isolated lab route, not WB2/PR #348; compare same-camera screenshot, uniform receipt, material cost and errors. If incompatible, preserve donor and report REJECT without creating a replacement inspector.
4. Return code/evidence; human Stage acceptance only via direct Hub-linked `https://kayfabizarro.pages.dev/…` route. No Site/Cloudflare deployment, PR merge or Live promotion from this research document.

**Current audit evidence:** static source inspection and repository contracts only. Browser tests 0, runtime builds 0, visual donor isolation passes 0, Stage routes 0. All candidates UNTESTED for integration.
