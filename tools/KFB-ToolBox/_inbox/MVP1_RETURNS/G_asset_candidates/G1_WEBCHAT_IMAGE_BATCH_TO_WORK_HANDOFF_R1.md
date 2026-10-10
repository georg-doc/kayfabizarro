# KFB MVP-1 · Bildserie Webchat → ZIP → WSA Work → GitHub R1

## CURRENT R8 OVERRIDE · 2026-10-10

The **planning-branch uploaded [§7a brief](https://github.com/georg-doc/kayfabizarro/blob/planning/kfb-mvp1-asset-candidates-2026-10-10/tools/KFB-ToolBox/_inbox/KFB%20Island%20Worldbuilder%20Lab/deliveries/BRIEF_WEBCHAT_ASSET_CANDIDATES_R1.md)** supersedes the old strict single-view/no-label rule below. **One asset per board** is still binding, but presentation boards may include main 3/4, other views, details, and variants with neutral view labels. No brands, logos, game title, advertising copy, figures, vehicles or boats. Build-light 5–6 large form roles and a per-board `PARTS.md` are mandatory for new proposals.

The `STONE BRIDGE 01` sheet previously in G4 image quarantine is now **STYLE_DIRECTION_ONLY** on Georg's explicit new brief authority, not Golden/Asset-Pick; previous failures remain recorded. Latest Kenney rock image is useful `MOOD_ONLY` but **not donor faithful**; [real GLB source proof](G1_ROCK_LARGEA_SOURCE_EVIDENCE_R1.md), [form-target PARTS](refs/large_boulders/PARTS.md), [prompt](refs/large_boulders/PROMPT.md) apply. **R8 user-facing ZIP** `KFB_G1_WEBCHAT_IMAGE_CHECKPOINT_R8_2026-10-10.zip` (SHA256 `ff939342f5df8d474d70232b269c0a51b0d8f7866b10c54643e8f834a5f92aca`) supersedes earlier asset lists by containing 4 G1 full-res concept PNGs and 1 G4 style PNG; all full-res images still require Work binary upload, previews 4/4 verified. The ZIP must be explicitly transferred to Work or kept in durable user storage before changing chat. **[R8 detailed rule reconciliation](G1_R8_BRIEF_RECONCILIATION.md)**.

**Stand:** 2026-10-10 · **Owner:** KFB Island Worldbuilder Lab / G1 image-series coordination · **Mode:** bounded creative image concepts, not runtime or asset-Golden acceptance.  
**Repo:** `georg-doc/kayfabizarro` · **Branch:** `planning/kfb-mvp1-asset-candidates-2026-10-10`.  
**Wichtige Entscheidung der aktuellen Sitzung:** Neue Motive im Webchat fortsetzen und PNGs gesammelt über einen binärfähigen Work/WSA-Executor in demselben Repo-Branch ablegen. **Historical failed G4 prompt-following records remain, but the specific STONE BRIDGE 01 sheet is now accepted as STYLE_DIRECTION_ONLY per §7a.**

## Was aktuell tatsächlich gesichert ist

1. **G1-Inseln: 3 Original-PNGs, 1448×1086.** Chat-Datei `KFB_MVP1_G1_Concept_Images_2026-10-10.zip`; in der aktuellen Session geprüft: ZIP integrity OK, SHA256 `d6587ac87a1a55cc6fb454acb42221461d76931d67b7f7e6f74440a603fbff83`. Enthält `SOURCE.json`, `README.md` und `upload_images_to_github.py` sowie die drei PNGs:
   - `G1_Town_Island_R1_initial.png` — SHA256 `611a4a0d5877637e13f4c239616048631f8abe53128fe793b15440355b339908`, 2,068,235 bytes.
   - `G1_Town_Island_R2_cartoon_clay.png` — SHA256 `aa4851db8a895c74a16810610a8b367b5ce7d9c2109364ce49945e4f91e13cd1`, 1,899,026 bytes.
   - `G1_Protopia_Island_R1_clay.png` — SHA256 `c0d961dabd4f41dd3bd5cd7ac8e128cc2d728c5896d2349f853cb8d72fb6a240`, 1,772,119 bytes.
   - 3/3 smaller 256×192 WebP previews already **PUSHED/VERIFIED** under `refs/_concepts/`. **0/3 full PNGs pushed**, until Work finishes.
2. **G4 bridge attempts: not accepted.** `KFB_G4_BRIDGE_FAILURE_RECOVERY_2026-10-10_r1.zip` SHA256 `4cdf6cbf812650baf62982d17a4402c00d519f8706de6c7d661884b224435735`. Additional drift archive `KFB_G4_BRIDGE_GENERATOR_DRIFT_RECOVERY_2026-10-10_r2.zip`, SHA256 `6032029fd97748f18443d6f00cddefb1278002527c645cf80c5c9b62c37bb556`. Three **failed** bridge marketing-board images across both packages; **NOT** to the accepted G1 gallery/G4 Golden. Archive separately as failure evidence only when explicitly requested.
3. **Next genuinely new motif:** G1 `large_boulders` — Kenney Nature Kit `rock_largeA.glb`, source blob `40e1365a43b706bd78c2658b48b189c9a35f8923`; genuine source vertex/index data and 4 source-geometry projections in `G1_ROCK_LARGEA_SOURCE_EVIDENCE_R1.md` / `refs/source-isolation/G1_kenney_rock_largeA_source_4view.svg`. *A later clay boulder MOOD PNG exists, but Georg notes clear geometry mismatch to the donor; a source-faithful result remains open.*

## Production loop in Webchat

1. Select **one new G1 element** from `G1_SCENE_ASSET_WORKLIST_R1.md` and its source candidate JSON. Reuse original geometry/image where genuinely available; distinguish source-accurate evidence from free creative clay treatment.
2. Generate **one asset per board**: a main 3/4 hero view **may be accompanied by labeled front/side/top/below, closeups and variants**, but no unrelated elements, game branding, promotional text, figures, vehicles or boats. If output is the wrong subject, do **not** file it as a successful asset. Retain it only in a failure envelope, applying the two non-improving-pass rule to that seam.
3. Georg provides feedback. Classify `CONCEPT_WORKING`, `CONCEPT_TUNE`, `CONCEPT_REJECTED` or `GOLDEN` **only upon explicit approval**; positive remarks alone aren't source-accurate or production acceptance.
4. At each image milestone save the original generated full-resolution PNG in a fresh or additive **ZIP checkpoint**, with `SOURCE.json` (exact image filename, width/height, bytes, SHA256, creation stage, group/element/view, class, feedback, source donor path/verified status, previous-batch references), plus previews if useful. Do not overwrite old ZIPs; keep rejected bridge evidence separated.
5. Immediately link the new ZIP in the chat and, **before relying on a new chat**, save a copy to enduring user-controlled storage (local disk or existing authorized Dropbox destination). A `sandbox:/mnt/data` link or conversation attachment alone is **not guaranteed accessible in another Work chat**. No background upload is implied.
6. GitHub can receive small manifests/metadata at coherent image/evidence checkpoints; avoid pushing a misleading "fullres uploaded" flag until Work truly writes and verifies the binary PNG.

## Work / WSA integration batch — exact handoff

**Input:** attach all accepted/working image ZIP checkpoint(s) directly in Work or provide their verified persistent Dropbox locations. Do not assume another chat automatically inherits this conversation's sandbox file handles.  
**Owner/route:** only `georg-doc/kayfabizarro` / `planning/kfb-mvp1-asset-candidates-2026-10-10`, path prefix `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/G_asset_candidates/refs/_concepts/`.  
**Action:**
- Read each `SOURCE.json` and the branch's `G1_RENDERED_CONCEPTS_R1.json`; reject mismatched bytes/SHA256 and duplicated image IDs with conflicting content.
- For each new full-size PNG, check whether the intended path exists first; if identical, skip; if changed, keep both revisions or request approval, no destructive overwrite.
- Upload the exact binary PNG under its manifest target path, no WebP-only substitutions. Keep concepts tagged as **CONCEPT** and G4 failure archives separate.
- After **each actual GitHub write** read back exact branch head and intended file, validating SHA256 of actual bytes (not just matching a URL). A timeout is UNKNOWN until ref/files inspected.
- When all selected PNGs verified, update `G1_RENDERED_CONCEPTS_R1.json/.md`, `RECOVERY_G1.md`, `RETURN_G1.md`, additive `CHANGELOG.md`, and one test report with actual counts, heads and missing files.
- **No auto-merge, no Live/Stage, no alternative runtime owner.** This is archival image intake only.

## Exactly one next G1 creative gate (R8)
Using **actual source image pixels** derived from Kenney `rock_largeA.glb` plus inspected KFB Style References, create one **source-faithful, build-light asset board** with 5–6 max large form roles, allowed neutral view labels, and a concrete `PARTS.md`. Preserve the positive but source-divergent previous rock as MOOD only. Check the same donor shape across every view. Package full-resolution PNG, `SOURCE.json`, prompt, PARTS and SHA256 into the next ZIP. WSA Work later uploads exact binary files to G1 branch with readback. No Site or Live work.
