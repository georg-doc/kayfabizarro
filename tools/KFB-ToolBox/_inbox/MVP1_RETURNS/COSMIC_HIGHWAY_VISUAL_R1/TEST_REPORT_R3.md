# Cosmic Highway R3 · Reference Pack Integrity QA · 2026-10-11

**Deliverable:** a reference pack of five **unchanged** previous PNGs plus role manifest and a new single-hero job brief, not a newly generated Cosmic Highway image.

**User-visible ZIP:** `KFB_Cosmic_Highway_R3_Curated_Reference_Pack_2026-10-11.zip`, **12,036,109 bytes**, SHA256 `2cf4371443154fecd35ebe9257072797ecceb30e8fb1c53305cc8575e34207ff`. `CONTACT_SHEET.png` inside; companion preview contact image generated separately.

## Executed file/manifest checks
**15/15 semantic checks PASS** after correcting one overly literal string matcher. Zipfile CRC PASS; five manifest items and exact archive entries; 5/5 image SHA256 matches; 5/5 exact byte sizes; five source-image dimensions verified; both R2 failed hero images explicitly MOOD_ONLY; actual GitHub source raster not falsely marked as included; exact Git blob SHA anchored; `NEXT_JOB_R3.md` explicitly requests *one high-resolution PNG* with *no modular-sheet rows or typography*; `newHeroImage=false`, `golden=false`; exactly 10 ZIP entries; role classifications match; full ZIP SHA256 readback matches.
- Initial QA yielded **14/15** because a matcher searched exact phrase `ONE 3/4 hero`, whereas the job text actually says `one 16:9/3:2 high-resolution PNG` and `no modular-sheet rows`. Semantic check corrected without altering original file or archive. Final **15/15 PASS**.
- No modification/cropping/repainting of the five original PNGs. This repack is a curation/metadata milestone only.

## Source/imagegen distinctions
- **True Quaternius mesh source raster remains on GitHub**, external to ZIP: `refs/Quaternius_Source_4View_R2_920.png`, blob `89b68c66a50d84910b72a9d847a20eaf3f7fe250`. Work must fetch actual image bytes and verify source identity before image generation.
- Previous Cosmos/Joyride images are user-positive **visual references, not collision/socket or true-source Golden**.
- R2 A1/A2 are **failed single-hero results, 0/2**, kept for atmosphere and color only. No new hero rendered, no provider source-conditioning receipt, no independent model/traffic or Georg Golden PASS.
- ZIP binary and contact are conversation output, **not on GitHub**. This repo stores an exact-indexed instruction manifest and test report.

## One next gate
Use the R3 ZIP with actual Quaternius source image fetched as true pixel data to generate **exactly one uncluttered 3/4 floating-island Cosmic Highway KFB-clay hero**, not a branded modular chart. Persist image-source input receipt/output bytes and Georg A/B/FAIL; if source cannot be conditioned, say `BLOCKED_SOURCE`, not 'generated from source'. No Stage, Site deployment or merge.
