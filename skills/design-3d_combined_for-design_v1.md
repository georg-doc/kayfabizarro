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

---

# Appendix: full 3D reference (inlined for single-link / Claude-Design paste use)


Depth for the `design-3d` skill. Read the section you need. Everything here
assumes a real-time WebGL runtime (Claude Design / Three.js / R3F), not a DCC
tool.

## Table of contents

- [Plain-language glossary](#plain-language-glossary)
- [Capability map](#capability-map)
- [Three.js minimal scene](#threejs-minimal-scene)
- [Loading a GLB from a RAW URL](#loading-a-glb-from-a-raw-url)
- [Stylized / toon look](#stylized--toon-look)
- [Cheap visual cheats](#cheap-visual-cheats)
- [react-three-fiber notes](#react-three-fiber-notes)
- [Export & pipeline hygiene](#export--pipeline-hygiene)
- [Failure-mode diagnosis](#failure-mode-diagnosis)

---

## Plain-language glossary

Translate the user's words into these; use them back so the vocabulary sticks.

- **Mesh** — the actual 3D surface, made of **vertices** (points) joined into
  **faces** (usually triangles; "polys"/"polygons"). "Poly count" = how many.
- **Topology** — how the faces are laid out. Only matters here if a mesh
  *deforms* (bends at joints). For rigid props it's irrelevant.
- **Normal** — the direction a face points; decides how light hits it. "Flipped
  normals" = a face lit from the wrong side (looks dark/inside-out).
- **UV / UV map** — how a 2D texture image wraps onto the 3D surface. Made in a
  modeling tool, baked into the GLB. You don't unwrap UVs in the browser.
- **Material vs shader** — a **material** is a preset surface (color, metalness,
  roughness); a **shader** is the actual program computing each pixel. In
  Three.js you mostly pick a material; a custom shader is the escape hatch.
- **PBR** — "physically based" material (metalness/roughness). Realistic.
  Usually *not* what you want for stylized — reach for toon instead.
- **Toon / cel shading** — flat banded shading; the stylized/cartoon look.
- **Texture / atlas** — image(s) on the surface. An **atlas** packs many into
  one image to save draw calls.
- **Draw call** — one "please render this" to the GPU. Fewer = faster. Merging
  meshes / instancing reduces them.
- **GLB / glTF** — the web-native 3D file format. `.glb` is the single-file
  binary version — the thing you load by URL. **Y-up**, meters.
- **Rig / bones / skinning** — a skeleton that deforms a mesh. Kenney Cube Pets
  have **none** — they're rigid; you transform nodes (see cartoon-motion).
- **Keyframe / mixer / clip** — baked animation data in a GLB, played by
  Three.js's `AnimationMixer`.
- **LOD** — swapping simpler versions of a model at distance. Rarely needed for
  a few stylized props.

---

## Capability map

| Task | In Claude Design / browser? | How / route |
|---|---|---|
| Box/sphere/cylinder props | ✅ | `BoxGeometry` etc., composed + toon material |
| Parametric / extruded shape | ✅ | `ExtrudeGeometry`, `LatheGeometry`, `TubeGeometry` |
| Load a finished character | ✅ | `GLTFLoader` from a RAW URL |
| Toon / stylized look | ✅ | `MeshToonMaterial` + gradient map, or custom GLSL |
| Custom shader / post-fx | ✅ | `ShaderMaterial`, `EffectComposer` |
| Animate transforms / clips | ✅ | mixer + code (motion → cartoon-motion) |
| Lights / camera / controls / sky | ✅ | standard Three.js |
| Sculpt / edit mesh topology | ❌ | Blender / DCC → export GLB → load |
| Retopology / UV unwrap / bake | ❌ | Blender → GLB → load |
| Model organic mesh from scratch | ❌ | Blender **or** AI text/image-to-3D → GLB → load |

The bridge for every ❌: make/obtain the GLB elsewhere, then load it by URL.

---

## Three.js minimal scene

Standalone-export friendly: import map + CDN, no bundler, no `./` paths.

```html
<!doctype html>
<html>
<head>
  <style>html,body{margin:0;height:100%;overflow:hidden;background:#0e1116}</style>
  <script type="importmap">
  { "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  } }
  </script>
</head>
<body>
<script type="module">
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); // cap for perf
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
camera.position.set(3, 2, 4);

scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 1.0)); // soft fill
const key = new THREE.DirectionalLight(0xffffff, 1.5);
key.position.set(5, 8, 5);
scene.add(key);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshToonMaterial({ color: 0x8ab4ff })
);
scene.add(cube);

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = clock.getDelta();          // frame-rate independent
  cube.rotation.y += dt * 0.6;
  controls.update();
  renderer.render(scene, camera);
});
</script>
</body>
</html>
```

---

## Loading a GLB from a RAW URL

The core move for anything complex. Always by URL — never embedded, never `./`.

```js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const URL = "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/GLB_cube-pets/cat.glb";

loader.load(URL, (gltf) => {
  const model = gltf.scene;
  frameObject(model, 1.6);   // normalize size (below)
  scene.add(model);
  // gltf.animations -> AnimationMixer if the GLB carries clips
}, undefined, (err) => console.error("GLB load failed:", err));

// Normalize wildly different model scales to a target size, feet on the floor.
function frameObject(obj, targetSize = 1.6) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const s = targetSize / Math.max(size.x, size.y, size.z);
  obj.scale.setScalar(s);
  obj.position.sub(center.multiplyScalar(s));                 // center it
  obj.position.y += (size.y * s) / 2;                          // base to y=0
}
```

Notes: if a GLB is DRACO-compressed, add a `DRACOLoader` with a decoder URL. If
textures 404, they were saved as external files — re-export the GLB with
textures embedded, or fix the texture URLs. Kenney Cube Pets: the overlaid round
eyes are separate nodes — grab them with `model.getObjectByName(...)` (see the
eye reference in cartoon-motion).

---

## Stylized / toon look

The single biggest lever for "cartoon, not realistic". Give `MeshToonMaterial` a
small gradient ramp so lighting bands instead of smoothly falling off:

```js
// 3 hard bands. RGBA (4 bytes/texel) — THREE.RGBFormat was removed in ~r137.
const ramp = new Uint8Array([ 80,80,80,255,  160,160,160,255,  255,255,255,255 ]);
const grad = new THREE.DataTexture(ramp, 3, 1, THREE.RGBAFormat);
grad.minFilter = grad.magFilter = THREE.NearestFilter; // crisp bands, not a blur
grad.needsUpdate = true;
const mat = new THREE.MeshToonMaterial({ color: 0x8ab4ff, gradientMap: grad });
```

Round the silhouette (stylized reads as *rounded*): bevel primitives, or use
slightly rounded box geometry. Add a dark outline via `edges`, an inverted-hull
pass, or post-process. Keep palettes few and saturated.

**Glossy / "wet" stylized (clay, jelly, toy plastic):** this is the one case
where the "avoid PBR" rule bends. Don't reach for full metal/rough PBR — instead
either use a **matcap** (`MeshMatcapMaterial`, lighting + gloss baked into one
image, zero real lights) or add just a **clearcoat** on top of a flat base
(`MeshPhysicalMaterial({ clearcoat: 1, clearcoatRoughness: 0.2, roughness: 0.6 })`).
Matcap needs an external image (load it by RAW URL like any asset — good public
sources exist, e.g. the `nidorx/matcaps` repo; copy a RAW image URL from it);
clearcoat needs no asset, so it's the turn-key fallback when you want gloss
without hunting a matcap. Full PBR metal/rough still fights the flat look — skip
it for stylized props.

---

## Cheap visual cheats

Fake the look instead of modeling it. Reach here before adding geometry:

- **Rim / fresnel glow** — a shader term that brightens edges; makes plush/toy
  forms pop without lights.
- **Fake contact shadow** — a soft dark radial-gradient plane under the object;
  far cheaper than real shadow maps and reads great for stylized.
- **Gradient sky / vignette** — a big background sphere or CSS gradient sets
  mood for near-zero cost.
- **Matcap** — bakes lighting into a single sphere image; zero real lights,
  instant stylized metal/clay/toy.
- **Emissive** — make a material *glow* by setting `emissive`; fakes lights,
  screens, magic.
- **Vertex colors** — paint color into geometry, no texture image needed.
- **Billboard / sprite** — a flat always-facing image for distant or tiny
  objects (crowds, particles, far props) instead of real meshes.
- **Instancing** — hundreds of identical props (grass, coins) in one draw call
  via `InstancedMesh`.
- **Bevel + toon** — rounded edges catch light and read as "soft"; often
  replaces an entire modeling request.

---

## react-three-fiber notes

If the scene is in R3F rather than vanilla Three.js:

- Separate scene *setup* (JSX) from per-frame *logic* (`useFrame`).
- Per-frame changes go through **refs**, not React state — never `setState`
  every frame (re-render churn kills FPS).
- Load models with `useGLTF(url)` from `@react-three/drei`; `useAnimations` for
  clips.
- `<OrbitControls/>`, `<Environment/>`, `<ContactShadows/>` from drei cover most
  setup cheaply.
- Simple animation state = a small state machine in a ref, not nested effects.

---

## Export & pipeline hygiene

Non-negotiable for surviving the `.dc.html` / standalone export:

- Every asset over its **canonical RAW URL**, never `./assets/…`.
- Heavy files (GLB/textures/HDRI) **by URL, not embedded**; keep any exported
  file well under ~2 MB.
- Self-contained HTML: Three.js via import-map/CDN, assets by URL.
- Delta-time motion; no hardcoded per-frame increments.
- No per-frame allocations; reuse vectors/objects outside the loop.
- Before shipping, verify scale, Y-up axis, normals, and that the camera frames
  the subject.

---

## Failure-mode diagnosis

| Symptom | Likely cause | Fix |
|---|---|---|
| Black / empty screen in export | relative `./assets/` path | switch every asset to its RAW URL |
| Model invisible but no error | wrong scale (huge/tiny) or off-camera | `frameObject()`; log bounding box |
| Model is all dark | no/weak lights, or flipped normals | add hemisphere+key light; check normals in DCC |
| Model too shiny / not cartoon | PBR material | swap to `MeshToonMaterial` + gradient |
| Flicker where faces meet (z-fighting) | overlapping coplanar faces / near-far range | offset faces; widen camera near plane |
| Textures missing (magenta/none) | external textures not embedded / bad URL | re-export GLB with embedded textures |
| Eyes/decals slide or look glued | overlay nodes mis-parented / rigidly synced | see cartoon-motion eye system |
| Stutters / heat on mobile | too many draw calls / big textures / re-renders | instance, atlas, cap pixel ratio, refs not state |
| Animation runs at wrong speed | hardcoded per-frame increments | scale by `clock.getDelta()` |
