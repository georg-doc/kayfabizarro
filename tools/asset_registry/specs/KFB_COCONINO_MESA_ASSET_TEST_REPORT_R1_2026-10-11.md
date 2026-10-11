# KFB Coconino Mesa R1 · Evidence / Test Report
Date: 2026-10-11
Scope: static repository research only; not model build, not a 3D artist's screenshot, not a scene acceptance, not R4 repair.

## Verified baseline
Repository: `georg-doc/kayfabizarro`; main `dccf75cabd222d951380693d84ab88053ee7e519`; branch `planning/kfb-coconino-mesa-asset-recon-2026-10-11` created from that head.
Owner: existing `tools/asset_registry` asset discovery. Current Four-Island R4 STOP/Story Vision design-only respected.

## Automated structural checks actually executed through live GitHub trees/files: 19/19 PASS

4 exact pack Git trees fetched using SHA resolved from live `media/3D_Assets` directory. Assertions for exact present blobs:
- Quaternius SciFi: `Environment/GLTF/Rock_Large_1.gltf`, `Rock_Large_2.gltf`, `Rock_1.gltf`, `License.txt`: **4/4**.
- Quaternius Ultimate Nature: `Blends/Rock_1.blend`, `Blends/Cactus_1.blend`, `OBJ/Rock_1.obj`, `License.txt`: **4/4**.
- Kenney Nature Kit: `Models/GLTF format/cactus_short.glb`, `rock_tallA.glb`, `cliff_top_rock.glb`, `cliff_diagonal_rock.glb`, `rock_largeA.glb`: **5/5**.
- KayKit Forest Nature: `Assets/gltf/Rock_1_A_Color1.gltf`, matching `.bin`, and `License.txt`: **3/3**.
- Source-code check `mesa() { ... }` exists in KFB K1/H0 `clay-catalog.v5.js`: **1/1**.
- Real JSON-GLTF index accessor check: `Rock_Large_1.gltf` 666 indices / 222 triangles; `Rock_1_A_Color1.gltf` 144 indices / 48 triangles: **2/2**.

Authoritative example blob SHAs:
- KFB `clay-catalog.v5.js`: `1cb40e45dc4d2ca20a554e4315b68f9331af4152`.
- Quaternius SciFi `Rock_Large_1.gltf`: `4074d7c4f766026916138eeb704e561898c91ca0`.
- KayKit `Rock_1_A_Color1.gltf`: `cfee4dd720002583c195f1e4f6ce35eeb984b51d`.
- KayKit Forest `License.txt`: `7c2808d2eade7da0cc719bea46ba8a219abe6718`; CC0 confirmed in file.
- Quaternius Ultimate Nature `License.txt`: `f55d873d20718a1d16c086bb9cc4ac3dcbff901e`; CC0 confirmed in file.
- Quaternius SciFi `License.txt`: `88540924712d81d4500171f782bba37962f42254`; CC0 text, WRONG 'Ultimate Platformer Pack' header; open provenance mismatch.

Kenney license also independently checked on official source: https://kenney.nl/assets/nature-kit (CC0). External Sketchfab donors are CC-BY and are NOT copied/imported.

## Limits / negative evidence
- No blender file opened/rendered, no Kenney binary GLB geometry viewed in isolation, no screenshot or contact sheet made. Therefore source-isolation visual gate = **NOT RUN**.
- No imported new third-party asset and no generated source geometry/GLB; no runtime candidate.
- No shader/surface regression test, browser/engine visual test, LOD/collider proof, island/road connection test or performance measurement: **0**.
- No Site/Stage/Cloudflare/public verification, no merge/live.
- KFB clay K1 procedural cylinder donor exists, but matching Herriman's stylized silhouettes is UNPROVEN.
- Historical `media/3D_Assets/CATALOG/INDEX.md` is descriptive and NOT inventory SSOT; live Git trees and the current Registry are authoritative.
- Source-isolation gate must use actual rendered mesh pixels; a URL/asset load does not count.

Next gate: produce an isolated side-by-side mesh contact sheet for the 4 named local donor families and original grey-clay M01–M03 candidate before any model-scene or road integration.
