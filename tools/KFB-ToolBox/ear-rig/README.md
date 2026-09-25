# FrizzleBob Ear Rig · handover for WSA · 2026-09-25

Status: **candidate, not accepted.** Georg reviewed the ear shape in several rounds on 2026-09-25 and asked for this package. He has not yet accepted the ear-to-head junction (see gap 1). Nothing here changes a game runtime, a mixer owner or the EyeRig.

## Known gaps first
1. **Ear-to-head junction still looks "plugged in".** Three attempts did not produce the soft fillet Georg sketched: a thicker root, a foot projected onto the head (ragged rim) and a flaring foot (looks like a stalk). Georg has not yet decided between two options:
   - a merged head+ear mesh with a real fillet (best look, but the ears can no longer be swapped in the combined model);
   - keeping the ears as a module and shaping the junction in the Studio.
2. **Three bones per ear.** A strong fold creases like a knee. 5–6 bones would give a round flop. This is a Blender re-export; the chain API does not change.
3. **No separate inner-ear material.** Pink is not split yet; everything is `FB_Yellow`.
4. **Not integrated anywhere yet.** No ToolBox, FrankenStein Studio, Animation Lab or game consumer loads these files. The dangle module ran in a Node test and in the Ear Rig Studio in headless Chromium only. There is no browser PASS in a consumer.
5. **The modelled floppy-ear variant does not exist yet.** Georg wants it once the base shape is final. Until then, the floppy ear is a pose (`fold`) on the straight ear.
6. **Custom GLB models in the editor are untested.** Only FrizzleBob was checked. For other models the ears attach to the first bone named `head`; without one they attach to the whole model.

## What is in this folder
| Path | What |
|---|---|
| `ear-dangle.v1.js` | **Runtime SSOT.** Secondary-motion chain (`DangleChain`), `rigEars()` finder, `bakeDangle()` clip baker. three.js only, no mixer. |
| `EAR_DANGLE_INTEGRATION.md` | How to build this into the Animation Studio / Animation Lab / game: frame order, layering with clips, events, baking, cartoon tuning. |
| `studio/ear_rig_template.html` | Ear Rig Studio **authoring source** (`__BASE__`, `__EAR__` and `/*__EAR_DANGLE__*/` placeholders). |
| `studio/ear_rig_studio.html` | **Built bundle** (1.5 MB, GLBs + module inlined). Output, do not hand-edit. |
| `studio/build_ear_studio.py` | Rebuilds the bundle: `python3 build_ear_studio.py <glb-dir>`. |
| `glb/FB_EAR_UNIT_v5.glb` | One left ear with its own mini rig: `ear_root` → `ear.1` → `ear.2` → `ear.3`. Base at the origin, up +Y, face +Z. The right ear = mirrored copy. |
| `glb/FB_BASE_NOEARS_v5.glb` | FrizzleBob template (KayKit Rig_Medium + pear head) without ears. Default model in the editor. |
| `glb/FB_TEMPLATE_LOOK_v5.glb` | Combined model: ears skinned to the main rig (`ear.l.1–3`, `ear.r.1–3` under `head`). |
| `rigs/fb-default.ear-rig.json` | Default rig in the `kfb.ear-rig.v0` contract. |
| `blender/build_fb_v5.py` | Reproducible Blender build (runs on `FB_TEMPLATE_LOOK_v1.blend`, ~2 s). All shape values are keys in `P` at the top. |
| `previews/*.png` | Blender checks and Ear Rig Studio screenshots. |

The source .blend files (`FB_TEMPLATE_LOOK_v1.blend` … `v5.blend`) stay in Georg's Dropbox under `3D ASSETS/BLENDER MCP/FB_GRAFT/`.

## Ears as Actors: the model
Each ear is an actor with three layers, applied every frame in this order:
1. **Clip:** whatever the AnimationMixer wrote. Most clips do not touch ear bones, so this is usually the rest pose.
2. **Acted pose:**
   - `droop`: at the root;
   - `fold`: floppy bend, with `foldAt` as the position of the bend;
   - `curl`: sideways.
   It comes from the rig JSON, an expression preset or a script. This is the "performance".
3. **Dangle:** a damped spring per bone, driven by:
   - head acceleration;
   - head spin (nod/shake);
   - wind (vehicle speed);
   - optional gravity;
   - impulses (landings).
   Bone 1 can squash and stretch ("rubber").

The ear rig never owns a mixer. It adds to the actor's single mixer (ToolBox rule: one mixer per skinned actor).

## Contract `kfb.ear-rig.v0`
```json
{ "schema": "kfb.ear-rig.v0", "unit": "FB_EAR_UNIT_v5.glb", "attachBone": "head", "mirrored": true,
  "ears": { "L": { "px":0.16,"py":2.128,"pz":-0.02,"sink":0,"out":19,"back":4,"twist":0,
                   "size":1,"len":1,"wid":1,"thick":1,
                   "droop":0,"fold":0,"foldAt":0.55,"curl":0,
                   "stiff":1,"damp":1,"elastic":0.6,"wind":1 },
            "R": { "...": "same keys, read in mirrored space" } } }
```
- **Units and axes:**
  - positions in metres, in model space (glTF, y up, +z = face);
  - angles in degrees;
  - sizes are factors.
- **Right ear:** its values are read in mirrored space, so `out`, `back` and `curl` mean the same for both ears.
- **Placement (unit ear):** `M = T(p) · R(Z −out, X −back, Y twist; order ZXY) · T(0, −sink, 0) · S(size·wid, size·len, size·thick)`. The right ear is `Mirror_x · M`. The result is attached to the head bone via `headNow · headRest⁻¹`.
- **Dangle mapping:**
  - `stiff` scales the base stiffness [60, 38, 24];
  - `damp` scales the base damping [7, 5, 3.5];
  - `wind` scales lean and flutter;
  - `elastic` sets the rubber stretch.

## Asks
**WSA:**
- register `tools/KFB-ToolBox/ear-rig/` as a ToolBox candidate lane (next to `eye-rig-batch`);
- decide the owner: FrankenStein Studio (placement and acting) or Animation Lab (motion);
- keep `ear-dangle.v1.js` as the single runtime copy.

**Animation Lab / Studio:**
- mount `rigEars()` on the FrizzleBob graft as described in `EAR_DANGLE_INTEGRATION.md`;
- first gate: FB Walk/Run/Jump clips from the Motion Library with ears active, human review by Georg.

**Georg (open):**
- the junction decision (gap 1);
- 5–6 bones yes/no;
- inner-ear colour;
- when to build the modelled floppy variant.

## Tested
- **Node** (three 0.160):
  - fold pose applied;
  - hop, nod and 20 m/s wind stay finite and bounded (max 57°);
  - ears lean back in wind;
  - the dangle follows an animated ear clip exactly (45.8° target → 45.8°);
  - `bakeDangle` writes 12 tracks.
- **Headless Chromium, Ear Rig Studio:**
  - loads with no page errors;
  - presets, hop and drive run;
  - fold pose renders.
- **Not tested:**
  - a real consumer (Studio/Lab/game);
  - mobile;
  - custom GLB models.
