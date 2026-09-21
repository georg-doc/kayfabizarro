# Research · Cozy Look + ITHappy Characters + Fly-Brain Experiments

**Date:** 2026-09-15  
**Status:** RESEARCH / PROPOSAL. No runtime implementation, no compatibility promotion, no purchase decision.  
**Base:** `main` @ `a8ee7d662c85c37c0d0aa42e8d7ddd1117e430db`  
**Purpose:** evaluate three external directions against the current Elisa Stage/Scene Builder and KFB experiment stack.

## 1. Cozy-game 3D look without watercolor/Meshy

### SOURCE FACT
The referenced Reddit creator states that the original workflow is Gemini 2D watercolor -> Meshy 3D -> Blender cleanup -> Unity, and that consistent style comes from a fixed style reference + palette/art rules.

### OBSERVED REFERENCE FRAME
The supplied frame reads as:
- low-detail rounded/chunky geometry;
- pastel, low-saturation palette;
- very high roughness / almost no sharp specular;
- broad soft key light + strong ambient fill;
- soft contact shadows, no hard black shadow masses;
- moderate atmospheric depth/fog;
- compressed contrast and lifted darks;
- selective soft dark contour/crease emphasis rather than aggressive universal ink outline;
- subtle surface/color variation and image-level softness.

### PROPOSAL · KFB `cozy-lit` presentation preset
Do not reproduce the watercolor-to-Meshy asset pipeline. Reuse KFB geometry and approximate the presentation stack:

1. **Material layer**
   - roughness ~0.85-1.0;
   - metalness 0;
   - low specular / low environment intensity;
   - base-color palette harmonizer that pulls source colors toward a shared pastel palette;
   - optional world/object-position low-frequency tint variation, not a visible texture pattern.

2. **Lighting layer**
   - one broad warm-ish directional/area-style key;
   - strong cool/neutral hemisphere fill;
   - soft VSM/PCF contact shadow;
   - no crushed blacks;
   - ambient occlusion limited to creases/contact, not dirty global SSAO.

3. **Shading layer**
   - wrap-diffuse / half-Lambert component to keep unlit sides readable;
   - 3-4 broad tonal bands with soft transitions, or smooth diffuse with a gentle ramp;
   - optional cavity/curvature darkening for tree bark, rock seams, clothing folds;
   - selective silhouette/crease outline at low opacity, preferably depth/normal based and distance-aware.

4. **Atmosphere/post layer**
   - pastel fog matching sky/background;
   - mild contrast compression + lifted shadows;
   - slightly warm highlights / cool distant values;
   - very subtle grain/dither or paper-like luminance noise in screen space;
   - optional low-resolution internal render + upscale/TAA for the soft illustrated image feel, but preserve UI readability.

5. **Geometry/presentation rules**
   - smooth normals / bevels where assets are too faceted;
   - avoid tiny high-frequency detail;
   - broad readable silhouettes;
   - clustered vegetation / props rather than dense realism.

### EXISTING KFB DONORS TO PRESERVE
- Elisa Stage brief already requires real 3D lighting/shadows and rejects generic blur/blob shadows.
- Dropbox contains `kfb-duotone-shader` as a separate proven background/presentation owner; do not replace it. Its readme documents `fluid` Duo-Tone, `shader` watercolor fullscreen fallback, and a four-field stage seam.
- `cozy-lit` should therefore be an additive material/light/post preset, not a fork of the existing background shader owner.

### VERTICAL TEST
One deliberately tiny test scene:
`GothGirl + stool + one tree + one rock + grass plane + water strip`
with A/B/C presets:
- A current KFB neutral;
- B cozy-lit no outline;
- C cozy-lit selective outline.

Human gate: same geometry must become visibly closer to the reference frame without watercolor textures or AI-generated geometry.

## 2. ITHappy Creative Characters

### SOURCE FACT
Official product page currently states:
- 420 modular assets;
- 30 animations;
- Humanoid rig / Mixamo compatibility;
- face expressions via face-model swapping;
- FBX/OBJ/GLTF/STL plus DCC/engine packages;
- ~1.2K triangles per model component, 3 materials, one 1024px color texture;
- current version 2.6 (2026-08-04);
- Free trial pack with 30 assets.

Official standard licence allows use/modification inside commercial and non-commercial final products, but prohibits standalone redistribution and prohibits using the assets as input to generative-AI programs/datasets. The standard purchase currently includes five team seats per quantity.

### PROPOSAL
Technically promising for KFB, but onboard as a **separate actor family**, not as presumed KayKit-compatible donors.

Suggested lane:
`actorFamily = ithappy-creative-humanoid`

Initial intake should measure:
- skeleton/bone names and hierarchy;
- scale/orientation;
- animation clips;
- material/atlas structure;
- modular attachment rules;
- face-swap mechanism;
- GLTF web behavior;
- performance in Three.js.

Only after measurement should adapters to KFB Motion/Face/Pose/Stage be proposed.

### LICENCE GUARD
Do not feed the purchased/free raw ITHappy model/texture files into Gemini, Meshy or another generative AI. AI may help write generic loader/adapter code without ingesting the licensed asset content; keep the actual asset transformation/inspection inside conventional DCC/runtime tools unless written permission or an ML licence is obtained.

## 3. Fly Brain Bridge / FlySim / embodied-connectome experiments

### SOURCE FACT · Fly Brain Bridge
Dorian Todd describes a 2026 system using the MaleCNS connectome with 166,700 neurons and ~25.6M retained connections. Sensory stimulation drives identified command/readout populations and a behavior controller maps the strongest normalized drive to behaviors such as walk, turn, back away, feed, groom, escape and dance.

Important limitation from the author: the connectome carries stimulus -> command-neuron activity, but the mapping from command neurons to Sesame behaviors is authored. Joint control additionally needs a learned oscillator/body interface because the point-neuron model does not itself supply a rhythmic gait.

### SOURCE FACT · FlySim
`mikewolak/flysim` uses the FlyWire whole-brain connectome (139,266 neurons / 16.8M synapses) as a deterministic leaky-integrate-and-fire network. The repo exposes sensory clamps and motor/descending readouts through a local HTTP/JSON control surface and an SSE stream. The README reports 3.76x biological realtime on an M1 Pro for the GPU event-driven backend at 1 ms ticks.

**LICENCE:** FlySim code is educational/non-commercial only unless separately licensed. The FlyWire/FAFB data has separate terms. Therefore KFB may study/prototype with it privately for educational R&D, but must not ship FlySim-derived software in a commercial/revenue KFB product without permission.

## 4. KFB experiments enabled by this pattern

### E1 · Brain-Driven Stunt Driver
**PROPOSAL / private R&D first.** Map KFB driving sensors to fly sensory channels and descending outputs to throttle/steering:
- left/right visual motion -> steering bias;
- looming obstacle -> evade/brake;
- target/food bearing -> attraction;
- collision/touch -> startle;
- reward pickup -> sugar/reward stimulus.

The point is not a better AI driver. The point is an interpretable alien/biological driver whose decisions can be visualized.

### E2 · Brain Ghost / Possession Mode
A KFB actor or vehicle is visibly 'possessed' by the connectome. Player can swap eyes, blind a modality, stimulate smell/touch/reward and immediately see changed behavior. This is a strong FrizzleLab / Museum / Town attraction because the intervention is understandable.

### E3 · Connectome Boss / Creature Brain
Instead of one monolithic scripted boss FSM, sensory events feed the simulated brain; only a compact behavior adapter selects KFB actions. The brain display can be an in-world prop/screen. Keep the authored body adapter explicit so no false claim is made that the fly connectome directly controls arbitrary KFB anatomy.

### E4 · Evolution Playground
Borrow the *interface-training pattern*, not necessarily FlySim code: keep a behavior-source fixed and evolve only the body/control adapter in many parallel KFB physics instances. Potential uses:
- weird creature locomotion;
- procedural stunt recovery;
- obstacle-course steering adapters;
- vehicle suspension/traction behavior policies.

This can be implemented with a KFB-owned synthetic/abstract signal source if commercial licensing of the fly code/data is undesirable.

### E5 · Living NPC Ecology
Use simple sensory vectors -> behavioral drives -> winner/threshold controller for many cheap NPCs. This is inspired by the bridge architecture but can be implemented independently of the connectome. Drives could include curiosity, threat, crowding, music, gifts, light, player proximity. This is likely the most reusable commercial KFB takeaway.

### E6 · Brain View as Game UI
The Dorian project and FlySim both demonstrate that a live neural/activity view is itself compelling. KFB could use a stylized in-world 'brain oscilloscope' for an experiment character/vehicle, showing sensory bands -> internal activity -> action. This gives a concrete feedback loop for player experimentation.

## 5. Practical priority

1. **P0:** `cozy-lit` shader/light/post A/B test on existing KFB assets. Cheap, immediately useful to Elisa/Town/Travel.
2. **P0.5:** download/test only the ITHappy **free 30-asset pack** conventionally; measure rig/material/GLTF structure before any purchase or ToolBox integration.
3. **P1:** build a tiny KFB-owned `sensory -> drives -> behavior adapter` prototype with no external connectome dependency.
4. **P1 research:** run FlySim locally as a private educational R&D reference and connect its HTTP/SSE readout to a toy KFB vehicle only if license boundaries are accepted.
5. **P2:** only pursue commercial fly-connectome integration after code/data licences are explicitly cleared.

## 6. Status

- **SOURCE FACT:** external product/project/licence facts above verified from current official sources / repo.
- **OBSERVED REFERENCE:** cozy screenshot analyzed visually.
- **PROPOSAL:** all KFB shader/actor/brain experiment mappings.
- **IMPLEMENTATION:** none.
- **TESTED RESULT:** none for cozy-lit, ITHappy in Three.js, or fly-brain-to-KFB control.
- **UNRESOLVED:** exact ITHappy skeleton/GLTF quality in Three.js; desired KFB commercial/non-commercial boundary for fly-brain research; final cozy outline method and post stack after A/B test.
