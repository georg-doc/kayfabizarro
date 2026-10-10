# G1 image-series continuation · Unexpected G4 generation / Recovery R2
Date: 2026-10-10 · owner G1 (editorial evidence), G4 bridge stays independently owned.

## Actual attempt and failure
- User requested GitHub upload of earlier full-resolution island PNGs and continuation of the series. The G1 executor selected the next in-owner `large_boulders` item, source candidate Kenney Nature Kit `rock_largeA.glb`, and explicitly requested **one isolated cartoon clay rock** without text, scenery, props or logos.
- **Unexpected result:** image-generation service returned another G4 stone-arch bridge **multipanel marketing sheet with labels and environment**. This is neither a rock concept nor acceptable G4 isolated bridge proof, and is not added to either accepted gallery or picked source.
- This is the third visible bridge-sheet failure overall (preceding two documented in [G4 failure recovery R1](G1_G4_BRIDGE_VISUAL_FAILURE_RECOVERY_R1.md)), and the first while requesting a different G1 object. **Do not retry the same image-generation route again**.
- Root cause internal to image generator **unknown**. "Cross-turn context reuse" is only a hypothesis, not a demonstrated tool bug.

## Complete preservation and checks
- Failed R3 image: `wide_clean_3d_stylized_game_asset_presentation_bo.png` (1536×1024; 2,258,995 bytes), SHA-256 `4b85e9a21549846c10a3cc20f82af286a72a965602a74c8d49cdfc1dc34f7724`.
- User-visible archive: `KFB_G4_BRIDGE_GENERATOR_DRIFT_RECOVERY_2026-10-10_r2.zip` (6,511,709 bytes), SHA-256 `6032029fd97748f18443d6f00cddefb1278002527c645cf80c5c9b62c37bb556`. The ZIP contains original prior G4 R1 recovery ZIP, untouched R3 output, manifest and explanation. ZIP integrity tested. **ZIP is conversation attachment, not on GitHub**.
- No accepted G4 or G1 image added. No source mesh/animation/runtime owner touched; no Cloudflare, PR or Live action.

## Useful separate progress
The **exact** source mesh `media/3D_Assets/kenney_nature-kit/Models/GLTF format/rock_largeA.glb` was independently read from GitHub, not via the image generator. [G1 source geometry report](G1_ROCK_LARGEA_SOURCE_EVIDENCE_R1.md) and [four-view source-only SVG](refs/source-isolation/G1_kenney_rock_largeA_source_4view.svg) are persisted on G1 branch. **11/11** source/status static tests PASS; visual critic not run.

## Blocker and exactly one next step
The three prior G1 original-size PNGs are still waiting for actual GitHub binary upload: `KFB_MVP1_G1_Concept_Images_2026-10-10.zip` in conversation, all 3 source SHA-256 checks previously verified. GitHub connector can write text and supplied base64 blobs, but has no direct source-file-ref/container-binary forwarding and the container has no network route/credentials. **Full-size upload is BLOCKED, not complete**. Use an authorized network-capable file uploader (e.g. Work/cloud browser or locally using the included checksum-verified helper) to upload exact original PNGs into the registered G1 paths, verify the pushed branch and file hashes, then update gallery metadata. Do not auto-merge.
