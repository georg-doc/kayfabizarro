# KFB Game Loop R25 · Mannequin Crowd Palette / Source-preserving Recolour
2026-11-01 · Georg creative request · BOUNDED CONCEPT / MATERIAL-RESEARCH NOTE ONLY

**Owner**: existing KFB_HUB/30_DECISIONS/replies concept lane, Draft PR #460 on `planning/kfb-game-loop-fluff-economy-r2-2026-10-29`. Receiving products: current Resident Atlas / Actor Look, Clay/Material, Motion, World/WS1 and R24 Destruction Crowd; **no new crowd runtime, shader/material owner, mesh export or code**.

## 1. Creative direction
Keep original **KayKit Mannequin Medium/Large silhouette** and recognizable **blue-red baseline body/texturing**, but produce a **coherent, gently varied crowd**. Georg prefers skin-ish warm heads/hands if achievable cheaply, with small outfit/body color variants and uniform visual identity. Reuse source materials and texture rather than replacing identity with generic generated people. Happy fixed faces may contrast with panic, irritation or hostility in the R24 Destruction Crowd.

**Caution from existing source evidence:** the FrankenStein Graft `graft-biped.v1.js` actually records that a Mannequin Medium hand color `#ea5229` was **mistaken for skin** but sampled as **gloves**. `HOST_HANDS.medium = 'gloves'`; it explicitly says the Mannequin source is not a source-evidenced skin-face/skin-hands model. The prior Graft's head is a **separately grafted FrizzleBob head**, not a proof that the native unmodified Mannequin GLB has a separable face material. Georg's new requested skin-tone head/hands would thus be an intentional palette edit and must visually preserve anatomy/texture. **Do not claim the original provides a clean `skin` material.**

## 2. Exact real sources
`registry/assets/v1/packs/kaykit-character-animations-1-1.json` explicitly lists:
- `media/3D_Assets/KayKit_Character_Animations_1.1/Mannequin Character/characters/Mannequin_Medium.glb` — `sizeBytes:420044`, blob `c15d93a623acde4c08862290f4465bb994506fd8`, source snapshot commit `073b79c3fb4052f7f4691976663ffc0c9449f7f3`.
- `media/3D_Assets/KayKit_Character_Animations_1.1/Mannequin Character/characters/Mannequin_Large.glb` — `sizeBytes:541784`, blob `c332cd774562dc053aa93c450fe0eb618a73c213`, same registered source snapshot.
- `media/3D_Assets/KayKit_Character_Animations_1.1/Mannequin Character/Textures/mannequin_texture.png` — `sizeBytes:18117`, blob `d9f5ae836be8ab2988a2d26e33b47ee47a7a181a`, registered texture candidate. GLB metadata says dependencies embedded, so **verify which embedded source image/material the loaded actor actually uses**; do not assume external PNG automatically binds to glTF.

**Visual/source gap:** exact GLB mesh/material/UV slot mapping and actual rendered head/hand color regions **not visually isolated in this R25 conceptual session**. Repository's prior Graft source inspection is relevant but does not replace isolated native Medium/Large screenshots. Even a successfully loaded GLB URL would be insufficient as donor look proof.

## 3. Three solutions in ascending complexity
**A · Preferred KISS: a small finite palette of source-preserving texture variants.**
1. Keep original GLB mesh/skeleton/UV unchanged.
2. Once original actual color texture/UV layout is inspected, produce **4–6 shared outfit/body-color variants** from its genuine base texture, keeping face/hands identical within each variant where source-aligned and desired. If native head/hands contain gloves or painted regions, selective **warm skin-style recoloring** becomes an intentional cosmetic variant, not source truth.
3. Preserve original base as one palette; add small coordinated shifts (blue, teal, dusty blue, sage/olive) and keep recognizable red-orange accents; no mandatory exact hex until measured against source art.
4. Reuse one texture/material **per palette**, not one per character; no per-instance texture generation or draw-time procedural paint. Group extras by palette/LODs.

**B · If the actual GLB already has distinct head/hands/body mesh/material slots:** keep warm zone as one shared material, clone or select only body material from a small accepted palette for each actor. BUT no source evidence yet that such slots exist; test actual GLB in isolation.

**C · Only if higher dynamic needs warrant it:** a custom UV/vertex mask with per-character tint uniform, or GPU instanced-color attribute confined to clothing. This introduces a shader owner/performance burden and is **not recommended for first crowd visual proof**. A global `material.color` multiplier on a single atlas or `InstancedMesh.setColorAt` without segmentation recolors **head/hands too**, so cannot guarantee Georg's requested fixed skin palette.

**Fallback:** original coherent blue-red mannequin with only tiny permissible uniform tint/lighting differences and varied silhouettes/animations; better than broken hand/face palettes. Do **not** make per-instance head masking a first MVP blocker.

## 4. The animation/instancing seam is independent
- **Source model cloning:** official Three.js `SkeletonUtils.clone` correctly associates **SkinnedMesh bones** to per-actor skeletons; geometry/material references remain **shared** unless intentionally changed. Do not mutate a shared `material.color` for one actor or all clones change. Use preselected **shared palette material objects** assigned after cloning.
- **Animation:** near, reactive residents still need their own mixer / real Rig_Medium clips under actual Motion/Resident owner. **`THREE.InstancedMesh` reduces draw calls and supports `setColorAt` for static/common-geometry draws, but it is not a built-in independently animated skinned-character solution**. Mobile draw/update budgets must be demonstrated empirically.
- Large **not** Medium stretched: Mannequin_Large exists as a real registered GLB but current Rig_Large motion-set coverage is more limited. Medium and Large first need **separate original material/texture/rigger screenshots and clip QA** before any production crowd pool.
- Use a few true near skinned residents/hostiles and a limited number of farther visual extras if the actual scene needs it. Distant instancing/LOD is a **different optimization task**, not required merely to recolor costumes.

Official Three.js docs: `https://threejs.org/docs/pages/module-SkeletonUtils`; `https://threejs.org/docs/pages/InstancedMesh.html`; `https://threejs.org/docs/pages/SkinnedMesh.html`.

## 5. Visual proposal, not source-derived measured palette
- Palette 0: original unchanged, keep the blue/red familiar.
- Palette 1: muted teal body / original warm red accent.
- Palette 2: dusty blue body / restrained brick accent.
- Palette 3: sage-olive body / muted red accent.
- Optional 4–5: one darker/lighter tonal variant **without** changing source cartoon readability.
- **Head/hands:** consistent source-approved warm tint, if visual source zoning proves it can be done without damaging original UV, gloves or facial features. Otherwise preserve original source head/hands for the first test.

No new skins, random rainbow per-NPC noise, forced male/female uniforms, photorealistic skin, anonymous replacements or identity/ideology color coding. Visual variation is **cosmetic only**, not a combat faction or truth indicator.

## 6. Smallest source proof and one next gate
Suggested *future* test under the existing Actor/Material owner, not executed now:
1. Load **unchanged** exact native Medium GLB with original texture in isolation; show front, 3/4, side and a closeup on head/hands; list exact actual mesh/material names, texture maps and UV regions. Repeat original Large separately if selected.
2. Show one **material-only** recolor against original on the exact same viewport, pose/lighting and with original palette preserved; demonstrate no bleeding into head/hands and no shared-material mutation.
3. Show 4–6 native-character variants side by side, source look intact, and an idle+run clip proof on one Medium. Actual **draw calls / frame time / memory** recorded under the receiving owner if pursuing multi-character runtime.
4. Reject new zoning if it damages the face/hands: use original texture and coordinate small source-safe palette variations offline.

**Current R25 evidence:** GitHub source document verification and official Three.js API documentation, no GLB bytes/texture sampled here, no source-isolation screenshot, no renderer/motion/LOD benchmark. R24 crowd is a docs proposal only and World R4 remains NO MVP. No public Stage/Site/Live, no implementation or new SSOT/Hub owner.

**Exactly one next gate:** Georg/WS0 approves **“original blue/red Mannequin + 4–6 gentle body palette variants; fixed warm head/hands only if source-verified zoning allows it”**, and authorizes one isolated **Medium original vs recolour** proof through the current Actor/Material owner (Large only if useful). No merge.
