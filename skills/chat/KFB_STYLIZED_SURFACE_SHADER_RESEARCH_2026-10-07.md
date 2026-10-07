# KFB Stylized Surface / Shader Research · 2026-10-07

Status: **RESEARCH INPUT · LAB CANDIDATES · NO RUNTIME CHANGE**  
Owner: **KFB visual presentation / receiving World**  
Visual Gold Standard: **Claybound**  
Repo: `georg-doc/kayfabizarro`  
Branch: `planning/hybrid-baked-clay-texture-architecture-2026-10-07`

## Executive conclusion

The most robust way to reach the KFB target is **not one monolithic Clay shader**.

The recurring production pattern across open-source toon/NPR work and industry references is a small shared stack:

1. **rounded/soft geometry and normals**;
2. **controlled stylized lighting** (toon ramp / Half-Lambert / warped diffuse);
3. **artist-controlled shadow/highlight hue**, not just black-to-white shading;
4. **restrained rim/specular/contact**;
5. **very limited surface microdetail**;
6. **shared materials / instancing / compressed textures**;
7. **triplanar only where UV-free mapping genuinely helps**;
8. **bake expensive detail instead of rebuilding it in every fragment every frame**.

Claybound remains the visual benchmark. Technical alternatives are challengers, not an excuse to lower the quality bar.

## 1 · Best KFB baseline candidate: Toon / Claybound Hybrid

### Visual construction

Recommended core:
- actual soft/beveled silhouettes where visible;
- smooth/weighted normals or source-proven equivalent;
- 2–4 controlled diffuse bands;
- colored shadow and highlight zones;
- soft ambient / Half-Lambert-like wrap so backsides retain form;
- restrained rim for silhouette separation;
- matte/waxy response rather than full realistic PBR;
- contact/shadow owner remains active.

The classic Valve TF2 illustrative-rendering paper is still highly relevant:
- Half-Lambert-style diffuse preserves form on the rear side;
- a 1D artist-authored diffuse warp controls the terminator;
- directional ambient + rim/specular complete the illustrative result.

This is close to the KFB need: **shape remains readable while lighting is art-directed rather than physically literal**.

### Three.js path

Start from:
- `MeshToonMaterial` + a small gradient map for the cheapest proof;
- move to one shared custom material only if the benchmark requires:
  - Half-Lambert/wrapped diffuse;
  - per-zone hue shifts;
  - controlled rim;
  - KFB contact integration.

Do not default to full-screen outlines for the whole world. Use outlines only when the screenshot gate proves they help Characters/Hero objects enough to justify the extra pass/cost.

## 2 · Directional / three-color world shading

Strong candidate for:
- procedural buildings;
- OSM massing;
- background architecture;
- clean toy-world blocks.

Technique:
- use surface/world normal orientation to choose or blend artist-defined top/side colors;
- optionally use +X/-X/+Y/-Y/+Z/-Z variants;
- add a world-height gradient / palette family;
- then apply shared contact/shadow.

This is the documented Monument Valley family of ideas: direct control over directional face colors gives much more predictable graphic design than relying on a normal Lambert light to produce those exact colors.

A simple three-axis color shader can be extremely cheap because it may use **no texture sample at all**.

For KFB this is worth testing as a mass-world/background profile, while Tier-A Characters/Props/Key Buildings/Signature Landmarks remain held to Claybound-level material quality.

## 3 · Triplanar is useful — but should not be the universal KFB material

Verified reference implementations:
- `keijiro/StandardTriplanar` — public-domain Unity reference;
- Unity built-in triplanar shader example;
- Unity Shader Graph Triplanar node;
- Minions Art triplanar terrain tutorial;
- `walterpalladino/urp-shaders` — triplanar terrain + vegetation/wind + toon examples.

Important cost fact:
- ordinary triplanar samples the same texture **three times**;
- if albedo + normal + roughness are all triplanar, sampling multiplies quickly.

Therefore for KFB:
- use triplanar for irregular terrain, rock, cliffs, procedural objects that genuinely need UV-free mapping;
- do not put full multi-map triplanar on every building/prop/character.

### Biplanar

Use `keijiro/BiplanarMapping` / Inigo Quilez's biplanar idea as a concrete optimization donor.

Biplanar chooses the two most relevant projections instead of always evaluating all three.

This is especially relevant to the previously discussed “Derek” optimization idea: a documented graphics-engine recommendation for Derek de la Peza explicitly describes replacing an expensive 3-sample triplanar path with a 2-sample method. Even if this is not necessarily the exact Reddit example Georg remembers, it confirms the same production optimization pattern.

### Three-direction color is not the same as three texture projections

Keep these separate:
- **directional 3-color shading:** often no textures, very cheap;
- **triplanar texture mapping:** 3 projected texture reads, more expensive;
- **biplanar:** usually 2 projected texture reads;
- **box mapping in Blender:** useful authoring approximation, but still not a free runtime texture pipeline.

## 4 · Clay-specific procedural research

Useful cautionary donor:
`joebinns/clay` · MIT.

It demonstrates:
- fingerprint normal/smoothness modulation;
- Voronoi normal flattening;
- Perlin fold/valley ideas;
- seamless procedural displacement/noise.

The author explicitly warns that the unbaked ShaderGraph version does too much work every frame and recommends recreating/baking the look for production.

This strongly supports KFB's hybrid direction:
- use procedural clay logic for **authoring/reference generation**;
- bake stable low/mid-frequency detail;
- leave only cheap near-band variation at runtime.

## 5 · Blender look-dev options

### Toon
Blender EEVEE:
`Shader to RGB → ColorRamp`
is an official NPR route.

Use it for:
- fast exploration of KFB shadow/highlight colors;
- testing number/placement of light bands;
- building reference renders.

Important: Shader-to-RGB is EEVEE-specific and does not automatically translate to Three.js/WebGL. The accepted look must be recreated or baked for the runtime.

### Rounded edges
Do not use Blender's shader Bevel node as the runtime solution.

Blender's own manual describes that node as expensive and recommends actual bevel geometry/modifier where practical.

For KFB:
- bevel/soften silhouettes offline;
- preserve good normals;
- do not spend fragment-shader budget simulating all rounded edges.

### Box projection
Blender Image Texture supports Box projection with blending, useful for quick UV-light material authoring and procedural-building exploration.

Again: recreate or bake the mapping for WebGL.

## 6 · Useful open-source study pool

### Production-grade / strong reference
- `Unity-Technologies/com.unity.toonshader`
  - official Unity Toon Shader;
  - multiple pipelines;
  - useful feature/architecture reference.

- Valve: **Illustrative Rendering in Team Fortress 2**
  - Half-Lambert;
  - diffuse warp;
  - ambient cube;
  - rim/specular;
  - strong industry reference for readable stylized forms.

### Open/simple toon references
- `nekotogd/Godot_BoTW_Toon_Shader` · CC0
  - toon bands;
  - rim;
  - colored lights;
  - stylized shadow behavior.

- `lalunru/npr-shaders`
  - stepped diffuse;
  - hue shifts;
  - Fresnel rim;
  - useful GLSL study source.

- `gdquest-demos/godot-shaders`
  - large open shader library;
  - advanced toon, outline, stylized VFX examples.

### Blender / cross-authoring
- `yuki-koyama/btoon`
  - Blender EEVEE toon materials + contour techniques.

- `Foos-Blender-Archive/RyShade`
  - Blender/Unity NPR bridge concept;
  - Half-Lambert + GGX hybrid;
  - useful architecture reference, but licensing must be respected before code reuse.

### UV-free / terrain / world mapping
- `keijiro/StandardTriplanar`
- `keijiro/BiplanarMapping`
- `radiatoryang/unity-triplanar-terrain-cliff-shader`
- `bonsairobo/bevy_triplanar_splatting`

### Anti-repetition
- `UnityLabs/procedural-stochastic-texturing`
  - archived/old package, but the technique is useful:
  break visible repetition while retaining smaller tileable textures.

## 7 · Web/Three.js performance rules

### Use the simplest material that reaches the visual target
Three.js itself recommends choosing the simplest material that provides the features needed.

### Instancing
`InstancedMesh` exists specifically to render many objects sharing geometry/material with fewer draw calls.

Strong KFB use:
- foliage clusters;
- grass;
- repeated props;
- building-family pieces.

### KTX2 / Basis Universal
Use KTX2 where texture content becomes substantial.

Three.js `KTX2Loader` can transcode Basis Universal textures to supported GPU compressed formats.

Benefits:
- lower GPU memory;
- faster upload;
- useful for atlases/material families.

For toon-like broad-color textures, ETC1S may be useful; for normals/packed detail, higher-quality UASTC is generally the safer starting point.

### Texture families
Prefer:
- one/few atlases;
- texture arrays where the runtime path is proven;
- palette/vertex/per-instance variation;
over:
- a unique 2K material for every procedural building.

## 8 · KFB candidate architecture

### Tier A · Characters / Hero Props / Key Buildings / Signature Landmarks
Target:
**Claybound Gold Standard**

Candidate material:
- soft source geometry;
- shared Toon/Claybound lighting;
- optional baked clay detail;
- controlled roughness;
- subtle rim/contact;
- near-only microdetail.

### Tier B · secondary buildings / prominent vegetation / road dressing
Target:
Claybound-compatible.

Candidate:
- same light model;
- simpler/baked material families;
- biplanar or atlas only where useful.

### Tier C · OSM/procedural background mass
Target:
world coherence over microscopic material fidelity.

Candidate:
- directional 3/6-color profile;
- shared palette family;
- vertex/per-instance color;
- simple toon ramp;
- optional tiny tiled surface texture;
- aggressive instancing/LOD.

This keeps the hero layer exact without making the whole island pay the hero shader cost.

## 9 · Recommended KFB lab order

Do **not** test ten unrelated shaders.

Build one same-scene comparison with five controlled variants:

### A · Claybound baseline
Current closest K2/Golden path.

### B · KFB Toon-Clay Hybrid · recommended primary challenger
- 3-band artist-controlled ramp;
- Half-Lambert/wrapped diffuse;
- colored shadow/highlight;
- restrained rim;
- baked/very cheap rough clay surface;
- strong contact.

### C · Directional Toy · recommended mass-world challenger
- top/side directional palette;
- optional world-height gradient;
- minimal/no texture;
- same contact/shadow.

### D · Biplanar Surface
- one small tileable stylized texture;
- two-projection mapping;
- same Toon-Clay lighting;
- no full triplanar normal/roughness stack.

### E · Matcap / Painted Toy
Cheap style stress-test, especially for props/characters.
Reject if it disconnects too strongly from world lighting.

Use the same:
- one KayKit Character;
- one hero prop;
- one key building;
- one Signature Landmark;
- one procedural building family;
- one OSM block;
- one Nature/Forest cluster;
- terrain/road seam.

Capture:
- fixed near screenshot;
- traversal screenshot;
- far/world screenshot;
- one <=30s motion clip;
- GPU frame time;
- draw calls;
- shader/program count;
- texture memory;
- visual Claybound comparison.

## 10 · Recommendation

The most promising KFB direction is:

**rounded source geometry + one shared stylized lighting model + baked/minimal tactile detail + strong contact + instancing/atlases + selective biplanar mapping.**

Not:

**full procedural Clay + full triplanar albedo/normal/roughness everywhere.**

Claybound remains the visual target; this research only broadens the technical ways to hit it efficiently.

## One next gate

**SURFACE-LANGUAGE LAB · A/B/C/D/E SAME-SCENE COMPARISON · CLAYBOUND SCREENSHOT GATE + TARGET-GPU PERF**
