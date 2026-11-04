# FRESH IMAGE JOB RESET · Hazard Yellow ONLY · 2026-11-04
**Status:** FRESH JOB BRIEF · NOT OUTPUT PASS · previous generator jobs quarantined; do not edit, inpaint, expand or condition on them.

## Inputs and donor precedence
1. **STYLE DONOR:** `source_hazard_panel_original_RGBA.png` (259×400; SHA256 `df7783a82fbf7693aa9fdb12723a2c3f595ca1279cfd32a560a8522a62eaf638`). This exact accepted mustard-yellow industrial clay panel owns the design, edge anatomy, material, hazard stripes, frame/rivets and warm cream interior.
2. **GEOMETRY/ASSEMBLY REFERENCE ONLY:** `HAZARD_GEOMETRY_ONLY_REF_TOP_ROW.png` (cropped upper part of Georg's latest infographic, only Hazard source and 9/3-slice explanation). It is NOT the texture/color source. The UNcropped infographic has other colors in lower row and MUST NOT be given to the generator as an image input.
3. **RADIO SHAPE CANDIDATE:** `source_hazard_radio_candidate_RGBA.png` (127×510). Freestanding vertical bar; four empty square slots, grille and warning beacon. One historical candidate touches bottom image edge: visually check; if cropped, draw a fresh COMPLETE closed base, do not copy/propagate a clipped edge.
4. **DO NOT INPUT:** prior 3 mixed-theme jobs, the failed new job `c46ee857…`, any multicolor reference sheet, or images with drawn checkerboard/background. Keep all earlier assets only in failure archive, not active prompt.
The three input files are supplied in `KFB_Hazard_Modular_Donor_Reset_R1.zip` from the originating ChatGPT conversation. Their binaries are NOT hosted on GitHub. The images are the actual source proof, not a GitHub URL load test.

## Copy-ready image brief
NEW IMAGE JOB. Generate exactly ONE **2048 × 2048 PNG** with genuine **RGBA alpha**, fully transparent background (not black, not brown, not RGB with checkerboard drawn in). ONE SKIN ONLY: **HAZARD YELLOW** from the exact attached original, using warm mustard-yellow plasticine, reddish-copper pipes, dark hazard stripes, dark-brown/charcoal aged framing, tactile but SMOOTH matte clay, deliberate rivets, small orange-red warning beacon, cream interior. No blue/teal/purple/green/red skins. No gallery, comparison, infographic, legends, headings, labels, wordmarks, UI screenshots, captions, baked drop shadows, visible background, scene lighting panel or repeated surface-stamp texture. All parts geometrically clean with constant edge thickness and at least 32px empty alpha margin between items.

SHEET 1 arrangement matching WS0 runtime:
- BAND 1 y 32–462: one fully closed horizontal Fluff resource bar, themed head at left, **EXACTLY SIX** empty circular Fluff sockets in one straight row, one empty long total-number window on right, one complete end-cap. No numbers or filling yet.
- BAND 2 y 494–1059: the same Fluff bar OPEN, with one empty expansion drawer immediately below, one little down/up arrow centered in drawer's lower border. Match band-1 identity, do not change count.
- BAND 3 y 1091–2016 left: ONE standalone *vertical* minified radio column for placement at the **LEFT** screen edge, complete closed contour, warning beacon, grille, **FOUR** empty square 1:1 button sockets, **THREE** tiny status lights. The actual expanded radio panel opens **RIGHT** and is a separately code-generated neutral Master-Kit component: DO NOT paint a duplicate radio or its drawer.
- BAND 3 right: TWO small round themed gear glyphs (normal and warm-glowing hover), ONE independent small arrow, and THREE to FIVE isolated signature detail pieces: hazard warning lamp, copper pipe elbow, riveted plate, pressure gauge and/or valve. One per isolated cell.
- For long/movable parts, leave straight uniform middles to be 3/9-sliced in code. Protect every stripe, screw, beacon, vent and glass lamp as fixed-size details; NEVER stretch decorative features.
- Front view. Readable at 48/64px, visually continuous with accepted Hazard source, no lumpy/wobbly contours, no edge crop. True alpha pixels outside each object.

After generation, verify actual dimensions, alpha 0 background and isolated bbox/32px gaps. Inspect ONLY this exact job; if incorrect theme/colors or drawn background appears, mark FAIL and start a NEW image job from the two accepted input images, never use an old failed output as a reference.
## Acceptance order
1. Isolated source proof.
2. Inspect one actual 2048 PNG native RGBA; reject any 1536x1024 variant and any wrong-color elements. Do not upscale a wrong-size output just to greenwash.
3. Alpha/crop checks; 6 sockets / 4 radio buttons / 3 lamps; 32px gaps; 48px silhouette; protected decorations.
4. Only then extract via Race runtime `scripts/hud-kit/cut-sheet1.py`, produce `runtime_hudbar` and `geometry.drawer_slice_insets_px`. Record human review.
5. Do not start Hazard Sheet2 or Reactor Blue/Slime until Hazard Sheet1 real PASS or explicitly quarantined with parent gate decision.
