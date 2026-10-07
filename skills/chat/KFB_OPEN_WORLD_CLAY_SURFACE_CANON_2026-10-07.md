# KFB Open World · Clay / Surface Canon · 2026-10-07

Status: **BINDING CORRECTION · DO NOT SUBSTITUTE WITH "KAYKIT STYLE"**
Owner: **KFB Clay presentation / receiving World**
Receiving product: **Open World #360 / PR #348**

## 0 · Correction

The phrase **"KayKit style" is not a material/surface specification.**

Correct separation:

- **KayKit/Kenney/KFB source assets own form, identity, rig/connectors and recognizable source design.**
- **KFB Clay Style SSOT owns clay presentation: material, relief, hand marks, fingerprints, deformation limits, contact/shadows and Golden comparison.**

A consumer must preserve both.

Do not revert to default KayKit materials merely because source fidelity is required.

## 1 · Binding visual SSOT

Current Clay SSOT remains PR #301 / branch:

`work/clay-style-ssot-2026-10-01`

Read:
- `tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md`
  - blob `435b9ca51ce23b1d8c36c7cc89c65c2b1e03b65a`
- `tools/KFB-ToolBox/docs/KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md`
  - blob `5d37512ed6583c1f0f005397fe0721dbbfb8bae5`

PR #301 locked facts:
- K1/H0 v8 = **visual Golden line**;
- K2/v10 = **new-stage technical baseline**, but only after Golden parity;
- newer shader/material version is not automatically visually accepted;
- missing SSOT access = `SOURCE_REQUIRED`, not permission to improvise.

## 2 · Golden source line

Canonical K1/H0 package:

`tools/KFB-ToolBox/_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/`

Visual meaning:
- softened but source-recognizable forms;
- low-frequency handmade massing;
- fixed-world/hand-scale surface marks;
- bounded dents/gouges;
- preserved source colors/details;
- deliberate visible contact/shadows.

## 3 · K2 technical baseline for new stages

Current modules on main:

- `clay-material.v10.js`
  - blob `d994a9b656131be3b7a13d45edcb4253d34f3620`
- `clay-relief.v4.js`
  - blob `7e01da48674c080d7b0aa9601cc88648d11035ff`
- `clay-toolmix.v1.js`
  - blob `b9a039ccfb90ea04910db3cf05928817d92e9399`
- shared `clay-profiles.v2.js` where required.

Canonical K2 source package:

`tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/`

K2 handover values for its T2/T3 world context:
- Handmaß: **1.5 m**;
- tile: **4.8 m**;
- fingerprint tile: **13.5 m**;
- six named tool families in relief/toolmix.

These are not universal replacements for every Golden-locked family.
A Golden-locked asset first matches its fixed comparison.

## 4 · Fixed building Golden gate

Master:
KayKit `building_A`.

Fixed comparison:
- camera distance: **6 m**;
- elevation: **30° from above**;
- K1 light;
- soften `maxEdge = 0.18`;
- maximum 3 subdivision stages;
- `maxTris = 90000`;
- order: soften → seed geometry → material;
- exact Golden material: `clay-material.v8`, profile `house`;
- K1 Golden uniforms:
  - Hand = **0.5**
  - tile = **1.6**
  - fingerprint tile = **4.5**
  scaled against real object size.

Evidence:
`UNCHANGED SOURCE | LOCKED GOLDEN | CURRENT CANDIDATE | CONTACT/EDGE CLOSE-UP | COST`

No bend, mega-mesh merge or fake base plate before that comparison passes.

## 5 · Terrain / world Golden

Terrain visual truth:
- K1/H0 `screenshots/05-h0-totale.png`;
- K1/H0 `screenshots/07-h0-gelaende-nah.png`.

Required views:
- near;
- traversal height;
- far;
- silhouette;
- track/terrain seam;
- underside where relevant;
- contact/shadow;
- cost for same camera.

Joyride/World palette transition owner:
`transition-atlas.v1.js`.

Do not replace the accepted irregular clay-patch transition with generic gradients.

## 6 · Triplanar / tri-axial mapping · important distinction

### K2/v10

`clay-material.v10.js` uses **three-axis projection in object rest-space** for clay relief.

Important properties already encoded in v10:
- hand marks, grain and fingerprints have a fixed physical/hand scale;
- texture sampling uses derivative-aware `textureGrad` to suppress cell seams;
- marks stick to moving objects because projection is object/rest-space;
- near microdetail fades using pixel footprint / derivative LOD;
- source color/map/vertex color/normal map are preserved when supplied;
- existing normal maps are attenuated, not destroyed.

This is the final-owner direction for new KFB clay stages.

### `clay_floor_001` triplanar

Seed World proved a very cheap **stand-in**:
world-space triplanar `clay_floor_001` microtexture.

Its own Return explicitly says:
**stand-in only; K2 `clay-material.v10.js` owner was not consumed.**

Open-World rule:
- it may be used in the current closure pass as a bounded ground/world microtexture tune if safe;
- it must be labelled **STAND-IN / DONOR**, not final KFB Clay;
- it must not replace the K2/Golden gate at Architecture Freeze.

## 7 · `clay_floor_001` measured limits

Existing KFB relief measurement records:

- `clay_floor_001` local grain score: **4.67**;
- relief threshold: **8**;
- therefore it should **not automatically receive an extra relief overlay** from those maps;
- applying a low-information grey relief flattened measured contrast in the waste test:
  **1.90 → 1.14**.

Meaning:
- use it as subtle microtexture/albedo/bump donor only where it visibly helps;
- do not stack an invented generic relief layer merely because four texture maps exist;
- visual comparison wins over filename or texture availability.

Current source path used by Seed World:
`media/3D_Assets/Textures/clay_floor_001/clay_floor_001_diffuse.jpg`

Seed World pin:
`30558ae3b990352adb4d010278c7a43e6965b0b1`.

License/provenance must be verified before final production use.
Do not infer a Poly Haven/CC0 licence from filename alone.

## 8 · Distance / performance optimization

Already-decided clay optimization principles:

- microdetail fades by distance / pixel footprint;
- fingerprints belong primarily to the near band;
- expensive static softening may be prebaked/offline;
- instanced families should share geometry/material and vary by seed/attributes;
- preserve semantic object identity even when render geometry is batched;
- one failed non-instanced scene does not prove instancing is bad.

Seed World's 60 m microtexture fade may be reused as a **performance donor**, not as universal visual canon.

## 9 · Shadows and contact are part of the look

Binding:
`tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md`
blob `fb0e1398f411889015f664bb924aad124f2a554e`.

Required invariant:
- fit orthographic shadow frustum to relevant casters/receivers;
- tight near/far;
- derive world-units-per-shadow-texel;
- snap light-space centre to texel grid;
- `normalBias` scales with texel size;
- ordinary `bias` remains small;
- keep PCFSoftShadowMap for this line.

Known failure:
large fixed frustum + large hard-coded normalBias → bright contact seams / Peter-panning.

Do not accept bright bands as "clay highlight".
Do not hide contact defects with fake plinth/base plate.

## 10 · Geometry/material layers stay separate

For buildings/world assets:

1. source truth / placement;
2. massing deformation;
3. façade/detail grammar;
4. clay surface;
5. normals/support/contact/shadows.

Do not repair one layer by replacing another.

Examples:
- contact problem ≠ reason to change clay shader;
- clay surface problem ≠ reason to change terrain heights;
- KayKit source fidelity ≠ permission to remove KFB clay presentation.

## 11 · Current Coworker closure pass

Coworker may safely finish the known Clay-texture correction now, but this is **not a full K2 integration wave**.

For the closure round:

### Allowed
- verify `clay_floor_001` provenance/licence;
- use its triplanar microtexture as a bounded visual tune where safe;
- preserve current geometry/physics;
- compare visible before/after at fixed cameras;
- ensure no obvious repetition/stretching/UV seams;
- keep microdetail subtle at traversal/far distance;
- keep KayKit source colors/forms recognizable.

### Must record
- exact texture/source pin;
- mapping method and scale;
- whether it is `STAND_IN` or K2 owner;
- before/after evidence;
- FPS/draw-call/material cost delta if measurable.

### Must not claim
- "final KFB Clay";
- "K2 integrated";
- Golden parity
unless those exact modules/gates were actually consumed and tested.

## 12 · Architecture Freeze requirement

The Freeze must explicitly decide the receiving Open-World clay adapter:

```
Source Asset / World Material
        ↓
Clay Presentation Adapter
        ├─ K2/v10 material + relief/toolmix
        ├─ family profile
        ├─ distance LOD
        ├─ source-map preservation
        └─ contact/shadow contract
```

The adapter is presentation only.

It may not become:
- terrain owner;
- building owner;
- deformation owner for every asset family;
- palette owner;
- shadow-camera owner.

## 13 · Acceptance language

Never write only:
**"KayKit style."**

Write:
**"Source-proven KayKit/Kenney/KFB geometry and identity, presented through the current KFB Clay SSOT / Golden gate."**

That distinction is binding.
