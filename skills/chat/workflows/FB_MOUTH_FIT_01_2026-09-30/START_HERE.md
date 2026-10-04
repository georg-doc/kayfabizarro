# FB-MOUTH-FIT-01 · Fit the painted mouth to the head

Status: **BUILD INSTRUCTION FOR KFB TOOLBOX STUDIO (Claude Design, Rigging / FaceHost) · reference built in Blender on the real model**
Date: 2026-09-30
Model: `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb` @ `19088b142c6a7e7626f27fba8e80caf6ab2437c1`
Pet entry: `frizzlebob-earrig-v5` (Georg's export 2026-09-30); `parts.mouth = original`, `original.mouth = { scale 1.34, lift 0.1, depth −0.188, pitch 18, spread 0, tilt 0 }`
Code read: ToolBox P06 `kfb-lib/face-mount.v1.js` (`wrapMouthToSkin`, original-part handling), `partrig.v1.js` (lab-v6)

Georg judges the look. Every number below is a starting value.

## 1 · What is wrong today (measured on the model)

1. **The painted mouth `FB_Mouth_Smile` is a flat card, not a curved patch.**
   - Grid of 17 × 9 vertices (256 triangles), flat to within 1.3 cm.
   - It carries a soft decal texture: 274 × 169 px, alpha blend, 35 % of the pixels partly transparent.
2. **At rest, the card floats 20–34 cm in front of the face.**
3. **PartRig moves the card rigidly** (scale about its own centre, then pitch, then move). With Georg's values the card still floats in front of the skin by:
   - **1.9 cm at the centre;**
   - **up to 17.8 cm at the corners.**

   The head curves away behind a flat card.
4. **Result:**
   - In the ¾ view the corners stand past the cheek.
   - The soft decal edge hangs in the air in front of the background and reads as a grey smudge.
   - `renders/before_after.png`, top row: this is exactly Georg's screenshot.
5. **Only the rig mouth is attached to the skin.**
   - `wrapMouthToSkin()` in `face-mount.v1.js` attaches only the rig mouth plane (PetMouth).
   - The original model mouth (source `original`) is never fitted to the skin.

## 2 · Fix: attach the mouth card to the skin after every placement change

For every mesh in `orig.mouth.items`:

1. **Keep a pristine copy** of the card's vertex positions at load: `restPos`, in mesh-local space. Every fit starts from `restPos`, never from the previous result.
2. **After each `orig.mouth.set(...)`** (scale, spread, lift, depth, tilt, pitch, yaw, sx/sy/sz), after the host transform is applied:
   - transform `restPos` to world;
   - **card normal** `n` = the card's forward axis after pitch and yaw (the direction the decal faces);
   - for each vertex `v`: cast a ray from `v + n·0.6` along `−n` against the **skin proxy of the head**, i.e. the same baked, head-bone-space proxy and local patch that `wrapMouthToSkin` builds;
   - hit → new position = `hit + n·EPS`, with `EPS = 0.004` × figure scale;
   - miss → keep the vertex (report the count);
   - write back in mesh-local space (inverse of `mesh.matrixWorld`), then `needsUpdate`, bounds, normals.
3. **Reuse `wrapMouthToSkin`**: generalise it to take any mesh plus its `restPos`, rather than writing a second implementation. The rig mouth keeps its current behaviour.
4. **Timing:** fit on parameter changes only (the throttled `soon()` pattern), not per frame. The head skin is rigid on the head bone, so the result stays valid for all mouth animations.
5. **Toggle** `mouth.conform = true | false`:
   - default `true` for new saves;
   - `false` reproduces today exactly (legacy).

### Why along the card normal

A projection along the direction the decal faces keeps the **front-view image unchanged**: every texel lands where it was seen from the front. The card only bends back around the cheeks. The UVs are untouched.

## 3 · All mouths and all animations

| Mouth source | What happens |
|---|---|
| `original`, at rest (painted smile) | Fitted as above |
| `original`, while speaking (the 12 visemes and the smile/neutral decals are swapped **as textures on the same card**) | Covered automatically: same card, same fit |
| `rig` (PetMouth plane) | Already attached by `wrapMouthToSkin`; unchanged |
| Emotes (`restMap`: happy → smile, angry → s, …) | Texture swaps only; covered |

If Georg means another "third mouth" (another set, e.g. `set: male/female`): every set is a texture set on the same card or plane, so the same rule applies.

## 4 · Decal edge (the grey smudge)

- After the fit, the soft edge lies on the skin instead of in the air. Most of the smudge disappears with that alone (bottom row of the render).
- Add a slider `mouth.edge` (alpha test 0 … 0.6, default 0 = today's soft edge) so Georg can choose a crisper, paper-cut edge.
- Keep `depthWrite` on and `polygonOffset` (−1, −1) on the card, so it never z-fights the skin at 4 mm.

## 5 · Reference (Blender, `source/build.py`)

- **Georg's values:** scale 1.34, pitch 18°, lift 0.1, depth −0.188.
- **Pivot:** the card's world bounding-box centre.
- **Axes:** three.js +y lift = Blender +z; three.js +z depth = Blender −y.
- The nose is hidden in the renders so the mouth is visible.
- `MEASURE.json`: signed distance of the card to the head skin, per vertex and at triangle centres.

| State | Vertices | Triangle centres |
|---|---|---|
| Rest (GLB) | +19.9 … +33.6 cm | +20.0 … +32.6 cm |
| ToolBox today (rigid) | +1.9 … +17.8 cm | +1.9 … +16.4 cm |
| **Fitted** | **+2.1 … +4.0 mm** | **+0.5 … +3.3 mm** (never inside) |

`renders/before_after.png`:
- top row: ToolBox today;
- bottom row: fitted;
- columns: front, ¾, side, top.
- The top view shows the problem most clearly: a straight line that leaves the head versus a curve on the head.

## 6 · Acceptance (machine checks in the ToolBox)

1. **On the skin:** after any placement change, every mouth-card vertex has a signed distance to the head skin of 0 … 2·EPS. Triangle centres are ≥ 0 (nothing inside the head).
2. **Front image unchanged:** in the front view, the mouth's screen-space outline differs from before the fit by at most 1 px at 1080p.
3. **Silhouette:** in the ¾ and side views, no mouth pixel lies outside the head silhouette.
4. **All states:** checks 1–3 pass for the rest smile, all 12 visemes and the 6 emote mouths.
5. **Legacy:** with `mouth.conform = false`, the placement is identical to today.
6. **Cost:** one fit takes less than 20 ms on the local skin patch.
7. **Untouched:** eyes, lids, brows, nose and ears do not change.

## Exactly one next gate

**ToolBox Studio: implement §2–4 behind `mouth.conform`, run acceptance 1–7 on `frizzlebob-earrig-v5`, then Georg judges the look.**
