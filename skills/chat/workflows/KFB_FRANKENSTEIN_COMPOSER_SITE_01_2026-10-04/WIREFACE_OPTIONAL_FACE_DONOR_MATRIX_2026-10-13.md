# KFB FrankenStein Composer · Wireface optional face donor matrix (2026-10-13)

Status: **RESEARCH / ADOPTION CANDIDATE ONLY · VENDOR DOCS REVIEWED · GEORG DEMO VISUAL POSITIVE · NO KFB SDK OR RUNTIME PROOF**
Owner: existing KFB ToolBox FrankenStein Composer, Draft PR #355, `planning/frankenstein-composer-gpt-site-2026-10-04`.
Current owner pre-note head: `5ab92c75ec1f51cfe9946e344f8e515cac5d70ee`.
Existing Composer private GPT Site v4: https://kfb-frankenstein-composer.frizzlebob.chatgpt.site . Its **existing human WebGL/GLB/JSON export-import QA gate remains OPEN and is not displaced** by this research.
Consumer only later: existing Card Performance Scenelet / ChatterBox Voice PR #379 and Audio PR #365; World R4 STOP not reopened.

## Input and evidence

Georg reports that the Wireface public Three.js demo's faces work **very well visually**. This is positive **human donor-demo feedback**, not proof of speech quality, KFB donor identity, actual Composer integration, mobile performance or KFB clay parity. The official Wireface Three.js SDK user guide was read 2026-10-13 at https://wireface.dev/docs/three/ ; developer guide at https://wireface.dev/docs/engine/ ; licence at https://wireface.dev/license/ ; visual demo at https://wireface.dev/threejs/demo/.

Vendor-documented `@wireface/sdk/three` functions:
- `FaceMesh` with 468-point geometry/back of head; `attachFace(headOrBone, face, {at, rotation, size, motion})`, `findBone(gltf, /head/i)`; source skeleton/body animations remain underneath.
- `ModelFace` uses *model's own eyes* with fitted blinking lids and adds new lip-sync mouth after its feature anchors are measured/saved.
- `FaceScreen` paints a 2D/3D speaking face on a mesh/screen; `wrapGeometry`/`paintOn` for surface-aligned cartoon faces.
- `skinFromPhoto` maps texture without changing face geometry; `createCharacter` fits a 3D face/head to a photograph in browser; `exportCharacter`/`loadCharacter` preserve `.wireface.json` with baked mesh, texture and expression channels.
- MediaPipe local/on-device detects **clear front-facing photos/realistic portraits**; drawn, anime, pixel-art and nonhuman faces often FAIL local detection. Optional hosted Gemini detection for 2D drawn faces needs account token service, and should not be sold as all-offline or zero per-rig external processing.
- `express`, `mood`, `state`, `gazeAt`, `say`, `listenTo(audioContext, source)`; vendor states recorded SDK clips are phoneme-aligned. `listenTo` can analyze an existing MediaElement/AudioNode/MediaStream without allocating a second context.
- `@wireface/sdk/three/characters` offers 11 cast recipes, `three/kit` offers clay/vinyl/metal toy materials and body/ears/hair kit, and 14 examples include attach-to-gltf.
- Requires Three.js >=0.160, WebGL2/Safari15+ per vendor; verify against actual owner's pinned renderer, do not introduce a competing Three.js instance.

## FrankenSteining candidate matrix

| Mix | Preferred interface | Risks / source rules | Status |
| --- | --- | --- | --- |
| Real KayKit character + existing KFB EyeRig/PetMouth/Clay Lids | Keep source KayKit skeleton/rig-family clips and existing KFB face chain; Wireface only as OPTIONAL alternative or narrowly mapped facial channel output | No duplicate lips, eyelids, facial state or head transform writers; preserve identity and rig-family-specific animation | Existing Composer owns core; Wireface version NOT TESTED |
| KayKit body + verified FrizzleBob `FB_TEMPLATE_LOOK_v5` or other authentic KFB head + cartoon/photo face | Existing FaceHost/FrizzleGraft/HeadProfile mounts source head; optional Wireface `FaceMesh` with `skinFromPhoto` or `createCharacter`; sculpt/toon + matched skin/materials; sometimes `ModelFace` on KFB head | Face vs whole head vs full overlay mutually exclusive by face region, measured transform/front/bounds, no cartoon detection success guarantee. FB v5 is pinned historical GLB donor, not assumed on current main. Name 'Banko' was not verified as an exact repo asset; resolve its actual asset identity before use | TECHNICALLY PLAUSIBLE, NOT TESTED |
| Modify 11 Wireface Theatre demo actors | Load original licensed SDK `buildCharacter`/kit recipe in SOURCE-only view; modify costume, body, headShape, skins/materials and actor choreography; optionally apply KFB Clay AFTER real donor isolation | Keep vendor example provenance/licence, avoid replacing established KFB canonical residents with modified lookalikes; do not imply GLB export of a full live SDK actor from an example | Vendor-documented, NOT KFB-tested |
| Other GLTF/GLB 3D models | `attachFace` to actual measured head bone, `ModelFace` feature anchors on real eyes/mouth, `FaceScreen` for TV/visor/flat/cylindrical surfaces, or a bone-less measured transform host | Head naming, origin, +Z face direction, facial surface clipping, multiple-eye/nonhumanoid hosts, per-rig animation/LOD/licences; detect missing landmarks and FAIL CLOSED | Conditional feasibility, requires real source sample |

Do not attach Wireface and KFB EyeRig/PetMouth simultaneously with both actively writing the same mouth/eyes/head. Recommend per-actor `faceDriver=KFB_NATIVE | WIREFACE_MESH | WIREFACE_MODEL | WIREFACE_SCREEN` and explicit gaze/gesture ownership; this is a **planning selector**, not a new canonical API. Keep the existing `kfb.pets/1` Actor Recipe, and add a companion reference to `.wireface.json`/provider version/mount transform/driver mode if selected. Wireface's portable file is **not proven equivalent to exporting one self-contained animated GLB**; binary GLB export, saved procedural face semantics and playback after cold reimport require separate validation. Avoid copying proprietary compiled SDK files into a public GitHub repo without licence/distribution verification.

## Smallest next proof AFTER current Composer human acceptance

1. **Source isolation:** show one exact source KayKit GothGirl Rig_Medium, current FrizzleBob template head, and one Wireface original demo actor/SDK face separately in the EXISTING Composer / sandboxed QA context. Record actual source identity, head bone/landmark positions and screenshots.
2. **Single visual A/B:** same authenticated real body+head, first existing EyeRig/PetMouth then optional Wireface ModelFace or FaceMesh under identical lighting/camera; inspect clay surface, cartoon anatomy, blinking, mouth/eye occlusion, head turning and original silhouette. No new character shell or generic proxy.
3. **Only after successful A/B:** drive a **real source-card** one-sentence Card Beat/Opener in an isolated Scenelet using existing Voice PR #379 content and Audio PR #365 clock/mixer. Observe lip sync (recorded vs live TTS), pause, valid silence, gestures and partner gaze without creating an AudioContext or dialogue runtime. Existing Card title/POWER/LORE and approved Bridges remain authoritative; original PDF/Card Billboard displayed from existing source.

No actual SDK installation, real actor Wireface comparison, Browser/WebGL integration, GLB export or KFB audio test in this research pass. Vendor documentation and user's demo feedback are **not acceptance of vendor character as a KFB resident**. Existing Composer v4 review stays one next ACTIVE owner gate: `GEORG_COMPOSER_PRIVATE_SITE_WEBGL_EXPORT_IMPORT_PASS_TUNE_FAIL`. Wireface optional later research gate: `WIREFACE_SOURCE_ISOLATED_KFB_ACTOR_FACE_A_B_R1`.

Licence: vendor Personal free for own websites incl commercial use; charging for a product/game/app/service built on SDK needs Developer (listed £50/year for named small-developer product) or Enterprise; compiled SDK doesn't grant source distribution. Vendor licence: https://wireface.dev/license/ . No purchase or acceptance implied.
