# Claude Design brief · FrizzleBob clay look via the POC route · 2026-09-26

**For:** Claude Design (KFB ToolBox Production-02).
**Author:** Claude Coworker.
**Status:** READY. Georg decides the look.

## Why this route

- Blender shader-only clay on FB v5 was a **clear FAIL** (Georg, 26.09; see `CLAY_B1_FB_V5_VERDICT_FAIL_2026-09-26.md` in this folder). It changed the surface, not the form.
- The earlier three.js POC (`_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/KFB ClayBound-Perplexity v1/main.js`) convinced Georg because it **moves the geometry**.
- The ClayBound screenshots in that `_inbox` folder confirm it: the clay read comes from lumpy, uneven silhouettes plus deep, saturated, velvet-matte colour. Fine grain is not the carrier.

## Inputs (use exactly these)

1. **Character:** Georg's WIP FrizzleBob, `kfb-pet-frizzlebob-earrig-v5.georg-2026-09-26_2.json` in this folder (schema `kfb.pets/1`).
   - It includes ears tuning, `lids`, `clayLids` (off), mouth pitch and brow yaw.
   - GLB: `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb` @19088b14.
2. **Technique donor:** POC `main.js`, `clayMaterial()`. `MeshStandardMaterial`, roughness ≈ 0.91, metalness 0, plus `onBeforeCompile`:
   - vertex displacement along the normal: broad noise at ×0.72 and medium noise at ×2.7, in *object/rest* space, before skinning;
   - fragment: low-frequency colour "charge" of ±13 %, very faint grain, and roughness variation clamped to 0.58–1.0;
   - a per-object seed.
3. **Light donor (POC):**
   - warm hemisphere (`#fff0cf`/`#59676e`);
   - warm key `#ffe2b3` with soft PCF shadows;
   - cool rim `#b9c8ff`;
   - ACES filmic tone mapping, exposure ≈ 1.08.
4. **Scale concept (NotebookLM, `ClayBound_Research_NotebooLM_01.md`):**
   - **macro:** soft massing and form;
   - **meso:** broad presses and tool marks;
   - **micro:** matte grain that only breaks highlights.
   - No fingerprint stamps, no clearcoat, no wet gloss.
   - Distance rule: displacement only on sufficiently dense hero meshes; switch it off for distant or decorative objects.

## Known constraint

- The FB v5 body, arm and leg meshes are **low-poly** (≈190–250 verts each), so displacement there will look faceted.
- The head (6k) and ears (2 × 11k) are dense enough.
- The Blender lane has a smoothed copy (subdivision L2, same names, bones and weights; head and ears untouched). Its GLB export is **pending**: Blender crashed during export on 26.09.
- Until it lands, use the original GLB. Judge the head/ears first.

## Acceptance (checkable)

1. The same FB identity: colour, face parts from the JSON, proportions. Clay is an option toggle (ON/OFF A/B), not a replacement.
2. At the default Studio camera the silhouette visibly undulates (form change). A bump/normal effect alone does not count.
3. No texture swimming: the idle animation plays with displacement anchored in rest space.
4. No screen-space noise, sparkle or shadow acne (see Georg's screenshot in `TOOLBOX_FACE_EDITOR_NOTES_2026-09-26/`).
5. Face parts (painted mouth, brows, nose) stay attached to the displaced head surface, or displacement is masked near them.
6. The export stays `kfb.pets/1`-compatible. Clay parameters go in a new optional block, e.g. `"clay": {"schema":"kfb.clay-material/0.1","on":true,"seed":…,"relief":…,"micro":…}`.

## Deliver

- An A/B capture at the same light: clay OFF / ON, front and back.
- An updated JSON export.
- A short RETURN with defects first. Georg decides PASS / TUNE.
