# START HERE · KFB_CLAY_PERF_P0A_BLENDER_2026-10-01

Gate: **CLAY-PERF-P0A** · building_A · K2_BAKED_LITE · Blender MCP / Coworker · 2026-10-01
Read next: `RETURN.md` (problems first), `TEST_REPORT.md`, `SOURCE.json` (pins, settings, numbers).

## What this is

One clay derivative of KayKit `building_A` in which the mid/far clay relief of the exact K2 / v10 shader is baked into maps. Fingerprints, hairline cracks and grain are deliberately not in the maps; they stay procedural in Web for near views. There is no runtime performance claim.

## Files

| File | What |
|---|---|
| `building_A__kfb-clay-k2-baked-p0a.glb` | candidate: softened geometry (exact clay-soften.v1), base colour on TEXCOORD_0, normal + roughness variant v1 on TEXCOORD_1, sheen as in v10 |
| `building_A__kfb-clay-k2-normal-v1…v4.png` | tangent normal maps (three.js derivative frame), seeds 101–104 |
| `building_A__kfb-clay-k2-roughness-v1…v4.png` | glTF metallicRoughness layout: G = roughness, B = 0 |
| `building_A__kfb-clay-k2-tint-debug-v1.png` | v10 colour multiplier (mottle + cavity), 204 = ×1.0; not used by the GLB |
| `evidence/` | 01 source isolation · 02 matched 6 m / 30° sheet · 03–05 close facade / roof / base · 06 variants · 07 wireframe · 08 maps · 09 Blender re-import · JSON measurements |
| `source/` | `.blend` (images packed; source hidden in collection `KFB_CLAY_BAKE_P0A`), low-poly with KFB_CLAY_UV, bake harness + scripts |

## Use in three.js (runtime requirement)

```js
const gltf = await new GLTFLoader().loadAsync('building_A__kfb-clay-k2-baked-p0a.glb');
const b = gltf.scene.getObjectByName('building_A__kfb_clay_p0a');
b.scale.setScalar(3.2 / 1.65);          // bake scale (K1 Golden); other scales change clay detail size
// variant n: same UV1, swap maps
// t.flipY = false; t.channel = 1; t.colorSpace = THREE.NoColorSpace; mat.normalMap = tN; mat.roughnessMap = mat.metalnessMap = tR;
```

Do not add a TANGENT attribute: the normal maps are encoded in three.js's derivative tangent frame (GLTFLoader then sets normalScale.y = −1).

## Reproduce

1. Lay out the sources as `src/k1h0/…` (K1_H0_CODEBASE), `src/k2/…` (K2 folder), `src/donor/…`, `src/ext/Fingerprints01_3K.png`, and `nm/three` (three 0.160.0).
2. Run `blender_s1_source_gate_uv.py`.
3. Serve the folder over http and run `p0a_drive.py ref,export,bake` with `p0a_bake_harness.html`.
4. Run `p0a_encode_maps.py`, then `blender_s2_assemble_glb.py`, then `blender_s3_reimport_qa.py`.
5. Run `p0a_drive.py render` for the comparison renders.

## Exactly one next gate

**WC1 runtime comparison** `SOURCE → K2_PROC_OPT → K2_BAKED_LITE` (1 / 25 / 100, variants rotating, plus a near-procedural / far-baked switch). Nothing is merged; Draft PR only.
