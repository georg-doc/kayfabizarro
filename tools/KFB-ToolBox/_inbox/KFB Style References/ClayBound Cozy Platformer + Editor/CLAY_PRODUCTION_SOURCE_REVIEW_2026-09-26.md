# KFB ClayBound · External Production Source Review · 2026-09-26

Status: **SOURCE REVIEW COMPLETE · INPUTS CLASSIFIED · NO RUNTIME / STAGE CHANGE**

Owner: **KFB ToolBox / ClayBound material exploration**  
Human: Georg  
Branch: `chatgpt-web/clay-gemini-seam-qa-2026-09-26`

## Outcome

Classify the new external clay / claymation references against the existing KFB production lane without creating a second material owner, animation library or runtime.

Current production gate remains:

**CLAY-ASSET-01 · Smooth matte clay seamless texture → source + repeat/edge evidence → Georg review.**

## 1. RandTextureGen / Xargiv — productive texture-authoring tool

Sources:
- https://git.1ioe.top/xargiv/
- https://github.com/DD-moe/xargiv
- https://dd-moe.github.io/xargiv/

Repository:
- `DD-moe/xargiv`
- public
- current default branch: `main`

### Verified capabilities

The current source describes a browser texture generator that:
- creates textures from **32×32 through 4096×4096**;
- targets **seamless** output;
- targets **unique / unrepetitive** output;
- can start from fragments of user images/photos;
- allows generated textures to be further processed, published or sold.

This is directly useful for KFB because it can produce or post-process small, bounded clay texture candidates without introducing an Unreal-only or Blender-only authoring dependency.

### License split — important

Do not collapse the licenses into one statement.

1. **Repository `LICENSE`**: MIT license for the software repository.
2. **Website `terms.html`**: site features/code/tutorial material are described as CC BY-NC-ND.
3. **Generated images**: explicitly described as **CC BY**, including commercial use, with attribution required.

Because the software/site wording is not perfectly aligned, KFB should:
- use the hosted generator freely for texture production;
- treat generated textures as **CC BY output requiring attribution**;
- preserve source/provenance and source-image rights;
- avoid redistributing/forking the whole site/codebase as a KFB tool until the software-vs-site-license wording is deliberately reconciled.

### KFB role

**ADOPT AS TOOL REFERENCE · NO NEW OWNER**

Use for:
- seamless-edge repair experiments;
- anti-repeat / unrepetitive texture generation;
- controlled texture-size variants;
- deriving clay candidates from KFB-owned/source-safe imagery;
- comparison against image-generation outputs.

Do not use it to replace:
- KFB Clay Asset Studio review gates;
- ToolBox / Asset Librarian ownership;
- Blender material implementation.

## 2. Dandruff · Clay seamless texture pack

Source:
https://dandruff.itch.io/clay-seamless-textures

Verified page facts:
- **5 clay textures**;
- **1024×1024**;
- maps listed: Diffuse, Height, Normal, AO, Smoothness, Metallic, Edge;
- Roughness and Specular are explicitly not included;
- the author links RandTextureGen/Xargiv as the creator used.

### KFB role

**SOURCE / CALIBRATION PACK · LICENSE ATTRIBUTION REQUIRED**

Best use:
- compare map-family conventions;
- inspect how a generator-built clay set distributes height/normal/AO/smoothness;
- calibrate the first Blender clay material after a KFB texture is accepted;
- use as a benchmark for repeat visibility and scale.

Do not treat its Metallic map as evidence that clay should be metallic; for KFB clay this is a source map to inspect, not a material truth.

The generator terms support commercial CC BY output, but the itch pack page itself does not restate a separate pack license. Preserve attribution to the pack author/source and do not relabel as CC0.

Georg is uploading this under:
`media/3D_Assets/Textures/`

Until the upload is visible and inventoried, status stays:
**EXPECTED SOURCE · NOT YET LIBRARY-APPROVED**.

## 3. Clay Knight — combat / animation feel reference, not an asset donor

Source:
https://emiss23.itch.io/clay-knight

Verified:
- small third-person boss-rush / souls-like;
- light attack;
- heavy attack + charged heavy;
- roll;
- sprint;
- healing;
- lock-on;
- creator states the visuals, character/environment models and animations were made during the jam.

No reusable source/asset license is exposed on the itch page.

### KFB role

**BEHAVIOR / FEEL DONOR ONLY**

Do not import its meshes or animations.

Reuse the interaction grammar as a reference:
- lock-on state;
- attack anticipation → active hit window → recovery;
- light/heavy timing contrast;
- charged attack risk/reward;
- dodge invulnerability / recovery timing;
- boss telegraph and punish windows;
- stamina coupling;
- camera + target-facing behavior.

KFB already owns the relevant animation source family in:
`media/3D_Assets/KayKit_Character_Animations_1.1/`

The current resource registry already exposes real `Rig_Medium` clips including:
- `Melee_1H_Attack_Chop`
- `Melee_1H_Attack_Slice_Diagonal`
- `Melee_1H_Attack_Slice_Horizontal`
- `Melee_1H_Attack_Stab`
- `Melee_2H_Attack_Chop`
- `Melee_2H_Attack_Slice`
- `Melee_2H_Attack_Spin`
- `Melee_2H_Attack_Stab`
- `Melee_Block`, `Melee_Block_Hit`, `Melee_Blocking`
- `Dodge_Backward`, `Dodge_Forward`, `Dodge_Left`, `Dodge_Right`
- strafe/run/walk and hit/death clips.

Therefore the useful next Combat mapping is **state timing and gameplay contracts over existing KayKit clips**, not a new animation pack.

Community feedback on Clay Knight repeatedly points to dodge i-frame timing, post-roll recovery, hitbox readability, stamina pressure and punish-window duration as the sensitive feel parameters. Treat those as lessons to test, not settings to copy.

## 4. Clay stop motion Project for Unreal Engine — concept donor only

Source:
https://danionova.itch.io/clay-project-for-unreal-engine

Verified page features:
- subtle texture simulation;
- wobbly edge distortion;
- customizable clay colors/textures;
- material settings;
- shader files + example scene.

It is Unreal-specific and the page contains at least one user complaint that the material was not usable as expected.

### KFB role

**CONCEPT DONOR · NOT IMPLEMENTATION DONOR**

Useful idea:
split the look into a stable clay base plus an **optional handmade edge / silhouette irregularity layer**.

KFB translation:
- stable base color + roughness + restrained micro detail remains baseline;
- optional edge-wobble can be tested later as geometry/vertex/screen-space treatment;
- no per-frame texture shimmer as default;
- no Unreal node graph copy;
- no renderer-specific claims transferred into Blender/WebGL.

This matches the existing KFB rule that stop-motion character should primarily come from animation/acting and geometry/material craft, with temporal jitter only as an optional later layer.

## 5. Belimoth · Clay (Classic)

Source:
https://belimoth.itch.io/clay-classic

The title is misleading for the current task: it is described as a **patch-based programming environment for generative art**, not a clay material, clay texture system or claymation renderer.

### KFB role

**DEFERRED GENERATIVE-AUTHORING REFERENCE**

Potentially useful later for:
- patch/node interaction ideas;
- procedural visual authoring UX.

Not useful as:
- clay look donor;
- texture source;
- Blender shader source;
- current CLAY-ASSET-01 input.

Do not let the name “Clay” route it into the clay material stack.

## Production decision

### Adopt now as references
- **RandTextureGen/Xargiv** → productive external texture-authoring tool.
- **Dandruff Clay seamless pack** → incoming calibration/source pack.
- **Clay Knight** → combat feel/state timing reference.
- **Unreal Clay stop-motion project** → concept reference for optional edge irregularity.

### Do not adopt into current material stack
- **Belimoth Clay (Classic)** → unrelated generative-art patch environment.

## Protected boundaries

- No new asset registry.
- No new animation library.
- No asset extraction from Clay Knight.
- No Unreal shader transplant.
- No Xargiv code fork in this slice.
- No automatic license promotion beyond the exact source terms.
- No Stage / Live change.

## Exactly one next gate

**Finish CLAY-ASSET-01 on the current KFB candidate path; external tools/references stay supporting inputs until Georg accepts the base texture.**
