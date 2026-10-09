# KFB Maker Space · Interactive Learning & Crafting Architecture v0.6
2026-10-09 | PLANNING SSOT ADDENDUM | owner: KFB AI Game Art Academy / Maker Space, learner/crafting-facing contracts ONLY
Repo: georg-doc/kayfabizarro
Branch: planning/kfb-ai-game-art-academy-makerspace-v05-2026-10-09
Status: source-researched architecture, NO new World runtime, NO browser acceptance, NO new editor owner.

## 0. Product correction and scope

The upstream `theringsofsaturn/3D-ai-school-threejs` is a **chat/tutor experience housed in a 3D classroom**. It does NOT supply a source-verified, manipulable lesson/workbench engine. Previous requirement to load its entire ~31 MB classroom for Academy acceptance is now explicitly **non-blocking, optional historic UX reference**. Do not require, download or integrate that GLB unless a later visual comparison genuinely needs it.

The productive Academy concept is instead **KFB Maker Space / World Workshop**: same KFB Open World and God Mode semantic authoring capabilities, presented as constrained Player/Student actions, with the existing Shared Adaptive Learning Core as tutor/evidence layer. Not a second editor, world, renderer, asset library, audio graph or learning state service.

Cartoon-readable spatial grammar:
- ONE source-backed tutor/teacher character, FrizzleBob v5/v5b candidate subject to source-pin/rig proof;
- ONE source-backed Clay Billboard/MediaSurface + optional front teaching station;
- THREE student/maker desks = “many” in KFB cartoon logic;
- ONE central manipulable object / workbench pad;
- optional open-air dome/skydome, stage amphitheater or focused teaching instance **only through World/Material/Portal owners**.
Learning surface and workshop are spatially one scene. Players can observe, manipulate, craft, demonstrate, teach and share under owner-approved actions.

## 1. Reuse policy: one typed operation, three presentations

Single current underlying operation and authoritative owner:
1. **GOD MODE:** privileged author/placement/scene control (World WB2).
2. **PLAYER MAKER MODE:** permission- and resource-limited action on the same operation (owned craft/state consumer, future).
3. **FEYNMAN TUTOR:** explanation, diagnostic, assisted modification, observed evidence & spaced recapture layered over a permitted operation (Academy).
No separate TransformControls stack, shader/material truth, clip/rig builder, inventory or new renderer. An AI tutor calls only declared semantic operations, NEVER arbitrary JS or uncontrolled runtime script execution.

Illustrative action families, not existing public APIs:
- PLACE / TRANSFORM / ATTACH → existing God Mode in-place editor, authored prop receipts;
- MATERIAL_TUNE / COMPARE → existing Surface/Material owner;
- ANIMATION_PREVIEW / BIND_CLIP → existing Rig/Animation owner;
- EFFECT_PREVIEW / EDIT_RECIPE → FX candidate adapter in a quarantined lesson context;
- REGISTER_CREATED_ARTIFACT → existing Asset Registry/intake + owning Player Save/Inventory;
- DISPLAY / FOCUS / RETURN → World Billboard/MediaSurface + World navigation/portal;
- TEACH_BACK / ASSESS / RECAPTURE → shared adaptive Learning Core + Academy adapter.

All action names above are conceptual, NOT claim of implemented APIs.

## 2. Embedding tiers · strict compatibility

`T0 NATIVE_SCENE`: pure Three.js geometry/material/animation/actions compatible with pinned KFB World renderer and one update/input loop; add to sandboxed owned subscene with existing renderer; perf/physics/style/rig/license check. Best for drag, object edits, many GLB turntables, compatible WebGL particles.

`T1 RENDER_TO_TEXTURE`: real self-contained lesson scene + camera + `update(dt)` + `onPointer(u,v,type)` + `dispose()`, hosted by existing KFB `academy-live.js` same-renderer RTT. Preserve UV→NDC, texture color space, host lifecycle and reporter stats. Best for interactive Board/MediaSurface lesson; **T0 and T1 may share renderer, but must not add own canvas/rAF**.

`T2 SANDBOXED_TOOL_VIEW`: HTML/DOM/React editor, 3D external app, untrusted scripts, large UI or isolation-requiring examples → separate focused, permissioned sandbox/editor view; diegetic entry/return via existing World. No claim it is a real WebGL-texture video; do not give privileged World state/API tokens or run unknown code in main renderer.

`T3 MEDIA_REFERENCE`: YouTube tutorials, HyperNormalisation videos, PDFs, user documents, Cards, external interactive code links → use existing MediaSurface/Card/Video/HyperNormalisation owner; actual YouTube iframe needs permitted DOM/player presentation (possibly spatially aligned CSS layer or focused surface), it cannot automatically be drawn into a WebGLRenderTarget by embedding an iframe. Direct video textures require controllable media/CORS and rights.

`T4 OFFLINE_AUTHORING_IMPORT`: Blender project, Mixamo FBX, non-web shader/engine code → external Blender/rig tool produces inspected GLB/animation or validated preset; KFB consumes only compatible exported artifact after rig, license, provenance and quality check. This is not in-browser Blender execution.

`T5 RESEARCH_ONLY`: WebGPU/TSL compute/postprocessing demos, CSS3D, WebXR, experimental node graph, heavy multi-pass/offscreen scenes, and unknown-origin JS → isolated donor tests only. Do NOT assume they can share the current KFB WebGLRenderer or EffectComposer; require explicit owner-approved migration or isolated experience. `WebGPURenderer` may have a WebGL2 backend but does not make all WebGL shaders/postpasses compatible.

**IMPORTANT:** There is currently no verified universal “paste any three.js/examples URL into a KFB MediaSurface” adapter. Every example is a donor until ported to a bounded lesson contract with tested loader/input, render pass, disposal, dependency pin, mobile/perf.

## 3. Domain-agnostic interactive learning on top

Already-authoritative shared core: KFB Production Control workflow `SHARED_ADAPTIVE_LEARNING_ENGINE_V01_2026-10-09`. Keep a distinct Academy domain adapter, no DocCheck medical sources or state mixed into KFB.

First focus: Blender / Game Art / Three.js with character materials, models, rigs, animation, VFX, optimization. A user may later bring documents/ideas/Cards as *source material* to generate a task plan and task examples, but not arbitrary executable code. Use source ingestion/provenance and generated tasks with explicit evaluator, not “upload PDF and get verified 3D skill”.

Each lesson/mission: RECAPTURE → SEE (original demo) → PREDICT/EXPLAIN → MODIFY (observed real tool action) → BUILD (artifact) → SHOW (receipted output) → RECAP delayed. E0–E5 evidence and optional rank live in **learner state**, separate from Player Save, World Stage/Live, KFB Production Control and Card source truth. User-declared expertise is only a hypothesis until diagnostic probes.

Existing first lesson seed: `ACADEMY_FIRST_LESSON_DRAG_V01.json`; content checks 12/12 and source checks 9/9 PASS, no browser proof. `academy-lessons.js` has only three registered runnable scenes: `misc_controls_drag`, `webgl_instancing_dynamic`, `kfb_academy_hub`; the 30-lesson curriculum does NOT mean 30 runnable embedded demos.

## 4. Maker Space output / player economy (proposals, NOT existing canon)

Proposed maker loop:
Explore → gather satirical six-color **Fluff** resource → optional lesson/project unlock → choose source-backed recipe → try on workbench → alter/material/attach/animate → tutor asks prediction/teach-back → validate asset/rig/render → publish **Maker Artifact Receipt** → player Backpack/Inventory receives a versioned, reversible ITEM REFERENCE → optional Stage candidate via existing God Mode owner.

Six-color Fluff-as-crafting material is a user-proposed direction, not a verified current economy contract. Existing older Overworld glossary also uses “Fluff” as HP and POP as progression; do NOT silently overwrite those semantics. Inventory/World economy owner must settle denominations, acquisition, cost vs XP/HP and transaction safety. Use an illustrative palette, not a minted canonical currency or hardcoded prices. Skills must not depend on resource grind; learning exercises may remain accessible while cosmetics/recipes are earned.

Possible outcomes: color-tinted hats, equipped skins, source-backed props, material variants, GLB mini-objects, bounded VFX/particle presets, rig-family-compatible gesture/dance clips. Source/capability receipt required before a “Created” claim. If an imported Mixamo/FBX clip does not match KFB rig family or rights, leave it in PREVIEW/NEEDS_RETARGET, not backpack-equip ready.

Maker Artifact Receipt, conceptual fields (NOT new runtime schema/SSOT):
`id, kind, owner, parentSourceRef, licenseRef, recipeRef, variantParams, materialFamily, rigFamily?, animationClip?, effectProfile?, previewRef?, sourceCommit, provenance, validation, memory/evidenceRefs?, status(DRAFT/PREVIEW/VALIDATED/PACKAGED), inventoryRef?`.
Existing Asset Registry & owner decides when an item is packageable. Undo/replay/rollback precedes consumption of Fluff. Avoid executing user-uploaded JS/GLSL in the privileged World.

## 5. Concrete grounded KFB donors

- `travel/KFB Travel Combat v25/terrain-v25/academy-lessons.js` / `academy-live.js` → three native runnable lessons + RTT interaction, ONE renderer.
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` → authoritative typed World actions, one pointer router, SCENE_COMPOSE and Object Edit; SITE/World WB2 owns actual implementation and save.
- `tools/KFB-ToolBox/_inbox/KFB HUD Flight Board - Flight VFX/KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/hud-flight/kfb-hud.js` → candidate existing `setFluff`, `addFluff`, Backpack host/count; `kfb-backpack.js` → 20-slot overlay prototype with add/remove/select/use and standalone **own WebGL context for miniature**. This miniature renderer is a donor, not a license to add it to World; adapter/profiling needed.
- `tools/asset_registry/librarian/animation-sources.js` → source-backed KayKit rig-family discovery and clip indices, not blanket compatibility.
- `skills/chat/tool-nodes/frankenstein-studio.md` → own graft/head/material zone/pose authoring, Studio v16; current FrankenStein Composer GPT Site separate authoring owner.
- `skills/chat/research/KFB_3D_EDITOR_SHADER_INSPECTOR_DONOR_AUDIT_2026-10-08.md` on `planning/hybrid-baked-clay-texture-architecture-2026-10-07` → shader/inspector prior source audit, not new Surface/Material owner.
- `tools/KFB-ToolBox/_inbox/KFB Billboard Media Szene · B0 Source Proof/BILLBOARD_B0_SOURCE_PROOF_2026-09-24/bb-scene.js` → source-proven candidate, still requires current receiver confirmation.
- FrizzleBob v5/v5b remains a real source candidate, not Academy tutor verified; `FB_TEMPLATE_LOOK_v5b.glb` pin reconciliation still open.

## 6. First product proof, not whole island

First visually productive slice:
**One KFB Maker bench + one existing MediaSurface** in an isolated legitimate owner test surface. Show the existing real `misc_controls_drag` and `webgl_instancing_dynamic` lessons and one selected actual KFB prop in inspect/modify/preview mode; the tutor guides a single bounded lesson on source-backed action and produces *one* validation receipt. No new island, portal, economy, arbitrary upload or new renderer. Source A/B/C in old proof is reinterpreted around these **functional** originals; the external 31-MB chat classroom is not required.

Visual design can use 1 tutor station + 1 screen + 3 desks + 1 workbench + optional Skydome, only with current source-backed KFB asset geometry/Clay style. No placeholder objects counted as donor proof.

**Next gate remains `ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1`, now re-scoped to functional donor isolation**: A actual KFB RTT lesson with pointer; B one compatible shader/particle/prop viewer donor shown unchanged; C current KFB Billboard receiving asset shown unchanged. Work may only integrate after A/B/C source proof; no World R5 changes.

Preferred executor: Claude Design for visual original-source and spatial review; Claude Code/ChatGPT Work only as sequential technical runner if real Three.js interactive source cannot be run in Claude Design. Independent tester/critic/guard required for substantial integration; Georg only after a real meaningful visual product choice.

No new Stage/public route for this research. GPT Site is later primary if Academy product publishing is required.
