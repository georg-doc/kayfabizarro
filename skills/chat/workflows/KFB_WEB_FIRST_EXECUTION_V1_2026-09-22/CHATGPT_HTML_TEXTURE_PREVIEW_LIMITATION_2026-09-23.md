# ChatGPT attached HTML previews · WebGL texture preview limitation

Status: **OBSERVED HOST-SURFACE LIMITATION · SOURCE ASSET NOT INVALIDATED · WORKAROUND HUMAN-VERIFIED**  
Date: 2026-09-23  
Scope: KFB zero-install HTML review artifacts opened directly from ChatGPT attachments.

## Human observation

Georg reports a recurring pattern across ChatGPT-delivered HTML/3D previews:

- geometry loads;
- actor/object identity is otherwise correct;
- texture maps may be missing in the rendered preview — including textures already embedded inside a valid GLB.

This has now been observed again on the WorldBuilder WB1 Caveman review.

Do **not** infer from this symptom that the source GLB/GLTF, Resident Atlas entry or asset pack has no valid texture.

The host/root cause is not yet proven. Current evidence is compatible with a sandbox/browser-path problem during image decode, Blob/ImageBitmap handling or WebGL texture upload rather than an asset-side absence. Treat it as a ChatGPT-review-surface limitation until a specific asset-side failure is measured.

## Source-first rule

When a ChatGPT HTML preview shows an untextured model:

1. verify the exact source object and pinned asset revision;
2. inspect the owning donor for an explicit texture/skin binding, glTF URI, atlas or sidecar;
3. show the source object in isolation before composition;
4. if an explicit source texture is already declared, bind that exact source in the review artifact rather than inventing a replacement material;
5. if the texture still fails only in the ChatGPT attachment host, report **HOST_TEXTURE_LIMITATION** and keep the source asset unchanged;
6. re-test on the eventual public Stage only when texture appearance is part of that human gate.

A loaded model URL is not proof that the intended donor texture was actually rendered.

## Preferred review fallback

For an explicitly known source texture:

- first try `fetch(url) → Blob → createImageBitmap() → THREE.Texture`;
- fall back to `THREE.TextureLoader` if needed;
- for glTF-style color textures use sRGB;
- use `flipY = false` for glTF UV orientation;
- preserve the original source path and commit in visible review diagnostics.

This is a review-host adapter. It must not mutate the Registry, source asset, Resident Atlas or game runtime.

## Human-verified workaround · WB1 R1

Georg reopened the repaired WorldBuilder R1 HTML directly from ChatGPT and confirmed: **the Caveman texture is visible**.

The successful review-host adapter is therefore a verified fallback for future KFB ChatGPT HTML/3D reviews when the source texture is known:

1. keep the original GLB/GLTF and its material ownership unchanged;
2. pin the exact donor texture path + immutable commit;
3. try `fetch(url) → Blob → createImageBitmap() → THREE.Texture`;
4. fall back to `THREE.TextureLoader`;
5. for glTF-style color maps use `THREE.SRGBColorSpace` and `flipY = false`;
6. clone review-only materials and bind the exact donor map there;
7. show the texture source path in the review diagnostics;
8. never promote this adapter into Resident Atlas, Registry or consumer runtime unless a separate runtime gate proves that the product needs it.

Verified WB1 review blob:
`dd6379815295adf07bdf0132210e1f7e6c9a3b49`

Human result:
**TEXTURE_VISIBLE_IN_CHAT_ATTACHMENT · PASS**

This validates the adapter, not a universal root-cause theory about ChatGPT's renderer.

## Current concrete examples

### Caveman

Exact binary inspection of:

`media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/characters/Caveman.glb`
@ `891eadf01e218f5fc21387e64cea1fec8332c5b6`

proves the source GLB itself is valid GLB 2.0 and already contains:
- material `caveman`;
- `pbrMetallicRoughness.baseColorTexture.index = 0`;
- texture 0 → image 0;
- image `caveman_texture`;
- MIME `image/png`;
- embedded `bufferView = 6`;
- no external image URI is required for that embedded texture.

Therefore the untextured ChatGPT review symptom cannot be explained simply by a missing external PNG path.

Resident Atlas also exposes the exact source texture as:

`media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/assets/gltf/caveman_texture.png`

The WB1 R1 review binds that exact texture explicitly as a host-adapter fallback.

### Orc Raider

Asset Librarian PR #179 already documents a related packaging case where geometry/skin loads but material `orc_texture_A` has no map while the real PNG exists in the source pack. Its bounded `texture-fallback.js` is a donor for the same source-first principle.

These examples do not establish one universal technical root cause; they establish the review rule: **missing preview texture is not permission to invent a new material or replace the donor.**
