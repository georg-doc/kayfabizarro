# CLAY-B1 · FrizzleBob v5 · Georg's verdict: FAIL · 2026-09-26

**Georg:** "that does not work, neither from the front nor from the back. Either it is super subtle or it is the completely wrong concept. Clear FAIL."

## Coworker diagnosis: wrong concept, not wrong strength

1. **Shader-only clay cannot work on this model.**
   - FB v5 is a smooth toy mesh. Plasticine reads through **hand-worked form**: thumb presses, pinched seams, slightly lumpy silhouettes, tool marks.
   - Those live in the *geometry*, not in bump/roughness. Bump never changes the silhouette, so from any distance it looks like smooth vinyl with noise on top.
2. **The grain in Georg's screenshot is an artifact, not the look.**
   - The Ambient Occlusion node in EEVEE is noisy.
   - It is worst where separate meshes intersect (the arm and body objects meet at the shoulder).
   - The bump chain added more fine noise on top.
3. **Tuning happened on a grey neutral stage without a target image.** So there was no way to steer toward "claymation".

## What stays useful

- The **smoothing** of body, arms and legs (Georg OK, rig/JSON-safe, head untouched). It is a prerequisite for any clay look.
- The rest-pose coordinates and per-object seeds (no texture swimming).
- The eval rig (camera, lights).

## What is dropped

- ClayMaster v0.1/v0.2 as a look candidate.
- AO node in EEVEE.
- Micro grain as the main carrier.

## New concept (proposal, not started)

**Geometry first, material second, matched to one reference image.**

1. **Reference:** one ClayBound still (the `_inbox` screenshots) or a claymation still Georg names. Blender matches it side by side, including light.
2. **Form:** procedural *geometry* displacement on the smoothed copy: soft thumb presses, a slight lumpiness of the silhouette, pinched joins where the parts meet. Seeded, rest-pose, animation-safe (deforms with the armature).
   - For the game, it is baked to a normal map plus optional real geometry. That decision comes after the look PASS.
3. **Material:** simple, matte to slightly waxy, muted colour (Georg decides the colour), no screen-space noise.
4. **Light:** warm key with soft visible shadows and a darker set, like a stop-motion photo.

**Exactly one next gate:** Georg names the reference image (or says "ClayBound deck screenshots"). Only then round 3.
