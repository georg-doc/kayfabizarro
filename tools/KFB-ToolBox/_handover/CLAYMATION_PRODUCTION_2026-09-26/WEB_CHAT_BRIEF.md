# Web Chat · Claymation MVP consumer briefs

Status: **PREPARED · SEQUENTIAL OWNER GATES · NO RUNTIME CHANGES HERE**

Read the common `START_HERE.md` and PR #228. Use the actual approved asset and its source/QA evidence. No generic clay filter, no new terrain, physics, actor, asset registry, shader-runtime or camera owner. The three consumers are separate follow-up slices, not a single cross-repo rewrite.

## T1 · ToolBox material preview (first)

Owner: existing KFB ToolBox stage/editor. Locate its current material-zone and texture-preview host. Isolate the exact KFB source object; show clean baseline, then Asset 01 r1 on one allowed body/prop material zone. Retain EyeRig, skin/face, props and movement ownership. Test save/reload, rotation under stable light, source hash and two scales. Asset 03 remains off. Deliver one owner PR, direct Stage route and browser screenshot after local proof. Human gate: does this read as handmade clay at character/prop scale without losing identity?

## W1 · WorldBuilder local scene (second)

Owner: existing ToolBox WorldBuilder local world host. Reuse WB1/WB2 terrain/sculpt, Scene Patch and current environment preview; Travel/TinySkies owns weather/light/atmosphere. Apply the approved portable material to **one static prop or bounded terrain patch**, not the entire world or sky. Show original and clay patch isolated at matching light, then integrated in one Hürth/Cologne local scene. Check source ground contact, distance/tiling, save/reload and no interference with terrain/OSM/track constraints. Use object/triplanar only on static geometry; do not transplant into rigged residents. A game WorldBuilder MVP is one walkable materialized patch, not world-wide reskin.

## R1 · Race roadside material (third)

Owner: `georg-doc/KFB-Stunt-Car-Race`, its current Track Core/OMS placement and runtime. Consume a single approved static clay prop or barrier/roadside surface recipe, never replace Track topology, grip/physics, checkpoint, barriers or TinySkies/Travel world surface. Isolate the existing Track/roadside donor first; then one bounded sector A/B at driving speed. Test UV/scale stability, repetition and visibility near/mid distance plus lap safety. Do not infer a track material pass from a ToolBox sphere proof. Return a separate Race owner PR, direct Stage route and human drive gate.

Each slice: exact repo/ref, source donor screenshot, changed paths, actual tests, screenshot, direct `kayfabizarro.pages.dev` Stage route **only after verified deployment**, Return/changelog and one next gate. After two failed repair passes on the same gate freeze/export. Do not auto-merge or promote Live.

## G1 · Gemini image seam gate (current Web Chat task)

Before T1, check the [Gemini image seam QA](GEMINI_IMAGE_SEAM_QA_2026-09-26.md) against its pinned main blob and file SHA. The 2048² JPEG looks tactile but raw 3×3 repeats expose both joins and recurring macro folds. Show the 3×3 at fit and 100%, compare opposite edges and run one neutral-light Blender plane/sphere scale preview if available. Return a screenshot and PASS/FAIL per seam, repetition, baked light and intended material role. Treat it as a style donor until a derivative has passed both numeric and visual tile gates; do not substitute it for the already separately tracked Asset 01 r1 or Asset 03 r2.
