# KFB MVP-1 · Bildserie Webchat → ZIP → WSA Work → GitHub R1

**Stand:** 2026-10-10 · **Owner:** KFB Island Worldbuilder Lab / G1 image-series coordination · **Mode:** bounded creative image concepts, not runtime or asset-Golden acceptance.  
**Repo:** `georg-doc/kayfabizarro` · **Branch:** `planning/kfb-mvp1-asset-candidates-2026-10-10`.  
**Wichtige Entscheidung der aktuellen Sitzung:** Neue Motive im Webchat fortsetzen und PNGs gesammelt über einen binärfähigen Work/WSA-Executor in demselben Repo-Branch ablegen. **Der einzelne fehlgeschlagene G4-Bildgeneratorzweig bleibt QUARANTINED.**

## Was aktuell tatsächlich gesichert ist

1. **G1-Inseln: 3 Original-PNGs, 1448×1086.** Chat-Datei `KFB_MVP1_G1_Concept_Images_2026-10-10.zip`; in der aktuellen Session geprüft: ZIP integrity OK, SHA256 `d6587ac87a1a55cc6fb454acb42221461d76931d67b7f7e6f74440a603fbff83`. Enthält `SOURCE.json`, `README.md` und `upload_images_to_github.py` sowie die drei PNGs:
   - `G1_Town_Island_R1_initial.png` — SHA256 `611a4a0d5877637e13f4c239616048631f8abe53128fe793b15440355b339908`, 2,068,235 bytes.
   - `G1_Town_Island_R2_cartoon_clay.png` — SHA256 `aa4851db8a895c74a16810610a8b367b5ce7d9c2109364ce49945e4f91e13cd1`, 1,899,026 bytes.
   - `G1_Protopia_Island_R1_clay.png` — SHA256 `c0d961dabd4f41dd3bd5cd7ac8e128cc2d728c5896d2349f853cb8d72fb6a240`, 1,772,119 bytes.
   - 3/3 smaller 256×192 WebP previews already **PUSHED/VERIFIED** under `refs/_concepts/`. **0/3 full PNGs pushed**, until Work finishes.
2. **G4 bridge attempts: not accepted.** `KFB_G4_BRIDGE_FAILURE_RECOVERY_2026-10-10_r1.zip` SHA256 `4cdf6cbf812650baf62982d17a4402c00d519f8706de6c7d661884b224435735`. Additional drift archive `KFB_G4_BRIDGE_GENERATOR_DRIFT_RECOVERY_2026-10-10_r2.zip`, SHA256 `6032029fd97748f18443d6f00cddefb1278002527c645cf80c5c9b62c37bb556`. Three **failed** bridge marketing-board images across both packages; **NOT** to the accepted G1 gallery/G4 Golden. Archive separately as failure evidence only when explicitly requested.
3. **Next genuinely new motif:** G1 `large_boulders` — Kenney Nature Kit `rock_largeA.glb`, source blob `40e1365a43b706bd78c2658b48b189c9a35f8923`; genuine source vertex/index data and 4 source-geometry projections in `G1_ROCK_LARGEA_SOURCE_EVIDENCE_R1.md` / `refs/source-isolation/G1_kenney_rock_largeA_source_4view.svg`. *No successful new clay-diorama PNG of this boulder yet.*

## Production loop in Webchat

1. Select **one new G1 element** from `G1_SCENE_ASSET_WORKLIST_R1.md` and its source candidate JSON. Reuse original geometry/image where genuinely available; distinguish source-accurate evidence from free creative clay treatment.
2. Generate exactly **one** isolated main 3/4 image at a time: single boulder/cliff/island, no labels, added objects, diagrams, posters, context scene, logos or extra characters. If output is the wrong subject, do **not** file it as a successful asset. Retain it only in a failure envelope, applying the two non-improving-pass rule to that seam.
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

## Exactly one next G1 creative gate
Render **a new single isolated Kenney `rock_largeA`-based boulder** as cartoonier KFB claymation diorama material study, preserving the broad original rock proportions; verify that the returned image actually shows *one rock* and not the previous G4 bridge sheet. If it fails the subject constraint, freeze as evidence and do not present as a completed motif. Add the successful full-resolution PNG to a new incremental image ZIP checkpoint; queue it with the original three for eventual Work upload.
