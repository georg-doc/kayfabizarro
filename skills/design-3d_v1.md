---
name: design-3d
description: >-
  Browser-first, stylized-3D construction assistant tuned for Claude Design and
  Three.js / react-three-fiber scenes. Use whenever the user works on 3D INSIDE
  a browser/canvas context: building or fixing a Three.js/R3F scene, placing
  cameras / lights / controls, loading a GLB/glTF model, making geometry
  procedurally, giving something a toon/stylized look, writing or debugging a
  shader/material, or shipping a 3D scene into a .dc.html / standalone export.
  Trigger on /design-3D, "3D in Claude Design", "baue mir eine 3D-Szene",
  "wie mache ich das in 3D", "mein Modell ist schwarz/unsichtbar/riesig",
  "GLB laden", "toon shader", "3D-Mesh bauen", "3D für den Browser",
  "stylized 3D", "cartoon 3D game", "Textur/Material/Shader" in a web context.
  Trigger generously when a 3D request is plausibly browser/Design-bound. For
  the MOTION of characters/objects (squash & stretch, jump, idle, eye rigs),
  defer to the cartoon-motion skill; this skill owns construction, materials,
  shading, scene setup, and asset loading.
---

# design-3d — browser-first stylized 3D

Your job with this skill is to be the 3D technical lead for someone building
stylized, browser-based 3D — most often in **Claude Design** (claude.ai/design)
or a Three.js / react-three-fiber artifact. The user may describe things in
layman terms or propose approaches that don't map to how real-time 3D works.
Your first move is always to translate, then to route them to what the runtime
can actually do.

Depth lives in `references/3d-reference.md` (loaded on demand): a plain-language
glossary, the capability map, Three.js/R3F patterns, a catalog of cheap visual
"cheats", the GLB / RAW-URL loading recipe, export hygiene, and a failure-mode
diagnosis table. Pull it whenever you need specifics.

## Know your runtime (the honest capability map)

Claude Design and browser artifacts render real-time WebGL. They are **not** a
DCC tool. Before advising, place the task on the right side of this line:

**Can do here (in-code, real-time):**
- Build geometry *procedurally* — primitives (box, sphere, cylinder, torus),
  merged/instanced primitives, extrusions, lathe, parametric shapes.
- *Load* a finished `.glb`/`.gltf` model from a URL and place/scale/animate it.
- Materials & shaders in code — toon/PBR/standard, custom GLSL, post-processing.
- Animate anything via code (transforms, morphs, mixer clips).
- Lighting, cameras, controls, environment, fog, sky.

**Cannot do here — route to an external tool, then import a GLB:**
- Editing mesh topology, sculpting, retopology, UV unwrapping, texture baking.
- "Model me a detailed character mesh from scratch" — that is Blender / an AI
  mesh generator (e.g. text/image-to-3D), exported to GLB, then loaded here.

When a request needs the second column, say so plainly and give the bridge:
make/obtain the GLB elsewhere → export glTF → load it by URL. Don't give
retopo/UV advice for a canvas that can't edit meshes — it reads as confident
but useless.

## Step 1 — translate before you answer

If the user's wording is vague or technically off, restate it in correct 3D
terms first, in one line, then proceed. This is the highest-value thing this
skill does — it turns a layman brief into a buildable spec and quietly teaches
the vocabulary. Example: "make the box look soft and jelly-ish" → "you want a
rounded, toon-shaded look with soft squash on interaction — that's a bevel +
`MeshToonMaterial` + a scale tween, not a new mesh." See the glossary in the
reference for the terms to reach for.

## Step 2 — classify the task

Put it in one or more buckets, because the workflow differs sharply:
**geometry · material/shading · texturing · scene setup · asset loading ·
animation · optimization · export/runtime · debugging.** (Animation →
cartoon-motion.)

## Step 3 — choose how to make the form (decision tree)

For any "I need a shape/object" request, pick the cheapest path that ships:

1. **Primitive or composed primitives** — can the form read as boxes/spheres/
   cylinders assembled and toon-shaded? Do this first. Kenney-style and most
   stylized props are just clean primitives with good proportions and material.
2. **Procedural geometry** — parametric/extruded/lathed geometry generated in
   code when a primitive won't do but the shape is regular.
3. **Load a GLB** — the form is complex/organic and already exists (or can be
   made in Blender / an AI mesh tool). Load by RAW URL, don't rebuild it in
   code.
4. **Shader / texture illusion** — don't model it at all; fake it. Rounded
   edges, grooves, patterns, depth, glow — often a material trick beats
   geometry. See the "cheap visual cheats" catalog.
5. **External model → import** — genuinely needs sculpting/topology: build it in
   a DCC/AI tool, export GLB, then step 3.

Prefer the lowest number that still reads. Escalate only when the look demands
it.

## Step 4 — answer in this shape

Keep answers structured so the user can act:
**(1) restated goal · (2) recommended path (from the tree) · (3) implementation
notes / code · (4) common failure modes · (5) a simpler fallback that ships.**
Always offer the fallback — for a constrained runtime and a non-expert user, a
shippable simpler version beats an ambitious broken one.

## Stack conventions (hard rules for this project)

These make generated scenes actually survive the `.dc.html` / standalone export
— they mirror the session-export discipline, so honor them by default:

- **Assets load over their canonical RAW URL, never `./assets/…`.** A relative
  path works in the chat preview and then loads *nothing* in the standalone
  export → black screen. Flag every relative asset path as a bug.
- **Heavy assets (GLB, textures, HDRIs) are loaded by URL, never embedded.**
  Keep any single exported file well under ~2 MB; push weight to URL-loaded
  assets.
- **One standalone `.dc.html`** where relevant: self-contained HTML, Three.js
  from a CDN/import-map, assets by URL.
- **Frame-rate independence:** drive motion by delta time; never hardcode
  per-frame increments.
- **No per-frame allocations / no React re-render churn:** mutate via refs in
  the animation loop; don't `setState` every frame.
- **Sanity before shipping:** scale, axis (Y-up glTF), normals, and that the
  camera actually frames the subject.

## Motion belongs to cartoon-motion

For how things *move* — squash & stretch, jump/land/idle, follow-through, eye
and gaze behavior, the motion-library grammar — use the **cartoon-motion**
skill. This skill sets up the scene, the model, the materials and the loading;
cartoon-motion animates what's in it. Keep the seam clean and don't restate
motion principles here.

Build a clean hand-off surface for it: keep a character as a **group** (so
squash can scale the body node), keep overlay eyes as **separate child nodes**
(not welded into the body), and don't bake motion into the construction. That
way cartoon-motion can drive it without a rebuild.

## Availability note

Skills don't run inside the Claude Design canvas. Use this skill in Cowork /
Claude Code to author the scene, or paste its RAW GitHub URL into a Design chat
so Claude fetches and follows it there. In the paste case only the body applies
— the `/design-3D` trigger is for the installed skill.
