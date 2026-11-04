# Black Ink Sprite Export QA · repeatable gates

## Source vs derived vs imported
1. **Source:** exact approved original sheet PNG + SHA-256, original actual grid (2×3 or 3×2), user visual verdict and provenance. Keep unchanged.
2. **Derived candidate:** isolated crops from exact grid cells to a 512×512 RGBA canvas. Preserve the source alpha, geometry and identity; do not invent missing limbs/details or paint halos away automatically.
3. **Imported candidate:** actual bytes are in the agreed Git/private asset root and Asset Registry / Librarian can return them by stable ID; neither SOURCE_INTAKE.json nor a chat sandbox file is an import.
4. **Game PASS:** selected actor has proven correct atlas UVs, alpha blend/depth, readable eyes/mouth, appearance under game lighting, locomotion, hitbox, damage reaction, removal and unload/reload in WS1.

## Generate new sheets
- **Preferred:** two independent image jobs; each produces one **3 columns × 2 rows** sheet, exactly six complete nonoverlapping characters, 1536×1024 px (512×512 nominal cells).
- At least 8% whitespace inside every **cell**, not just around the whole image. No contact at boundaries, no crop of separated droplets, staffs, hair, props, tongues or arms; no fake transparency.
- For the six historic 2×3 sources, keep their real 768×1024 or 1086×1448 grid recorded and slice as **2 columns × 3 rows**, not as 3×2. A 3×2 rearrangement is a new explicitly derived file; preserve source.
- No web-found donor, generic placeholder, new alien-face generator, cropped half-body, shadow disc, checker bitmap, generic frame or UI chrome.

## Mandatory automated source audit
- PNG can be decoded; RGBA channel exists and is not entirely opaque.
- File dimensions and SHA-256 match the manifest.
- Exactly six stable crop rectangles cover the expected source grid.
- For each cell, threshold alpha >32 in a 6px edge band and report the affected-cell fraction. The current intake flags cells where >1.2% of tested edge-band pixels cross that threshold. This is a conservative *review flag*, not proof of clipping or overlap.
- Emit per-cell stable ID, rect, bbox, alpha edge score, output path, output SHA256.
- Source and cropped output remain separate; no destructive overwrite.
- ZIP CRC/consistency check; rebuild from source for deterministic integrity verification (pixel-level rather than compressed byte identity).

## Mandatory human visual export audit
1. **Source isolation:** display at least one approved actual source character *alone*, against a transparency checker and a real dark/bright in-game sample background. A loaded URL is not enough.
2. Inspect all six cells at full resolution: no chopped goo lobe, severed head/torso, stray silhouette from neighbor, mistaken character count, leftover opaque backdrop, glow/halo, background-paint artefact or false transparency.
3. Compare all twelve at 96×96: recognizable own silhouette + face, varied eye gazes/mouth action; minimal prop clutter at L0, more iconography only by tier.
4. Verify full sprite at intended three-quarter/front game camera, source crop and character ratio, and candidate sprite outline against accepted actual donor. Accept or reject each suspect boundary **manually**, not by automated mask alone.
5. Check frames on checker, flat dark and bright world surfaces; watch partial alpha on dark splats and yellow accent bleed.
6. Record each character as **VISUAL_ACCEPTED / TUNE / CROP_REPAIR / REGENERATE / REJECT**. Only accepted bytes enter atlas.
7. Upload/commit actual source or review-approved derivatives via the existing WS0 and Asset Registry intake; only then mark `registered`, with source SHA, paths, tags and pack.

## Failure decision
If two subjects literally touch on an opaque grid boundary, don't pretend simple crop restores missing texture. Preserve the sheet + failed cell proof and ask for a fresh six-character image job with wider gutters. Do **not** regenerate visually PASS characters without a specific source-backed defect. If only a clean external halo is present, one technical alpha correction can be tested against the original on dark and light.

## Evidence counts for this specific intake
- 18 source sheets decoded as RGBA with varying alpha; 18/18 have non-opaque pixels.
- 108 cells extracted; **48/108 flagged for edge-band review**, **60/108 not flagged by this check**.
- 1/108 shown as a real isolated visual donor in this execution (elderly ink blob with red cat-eye glasses).
- 1/1 ZIP CRC check PASS; original 18 sheets exact byte copies in the intake ZIP.
- **0/108** declared in-game ready; **0/18** actual PNGs committed to canonical Git source by this documentation slice.
