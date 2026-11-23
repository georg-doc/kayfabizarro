# Read-only GIF audit · 2026-11-06

Scope: six existing Dropbox GIFs; no originals changed, animation generated, repairs performed, GitHub writes or runtime acceptance. Contact sheets are extracted QA derivatives only. Canonical Asset Librarian identities/source mappings remain unknown.

## Inventory

All files have six frames, GIF infinite-loop metadata (`loop=0`), transparent backgrounds and disposal method 2 on full-canvas frames. Four unique animations run at 220 ms/frame (1.32 s, ~4.55 fps); the duplicated pirate runs at 240 ms/frame (1.44 s, ~4.17 fps). These slow pose changes are suitable references for a stylized stop-motion cadence, not evidence of smooth animation.

- **Animierter Tintenblob mit Steampunk-Goggles.gif** — 512×512, SHA256 `61754d01a4ef4aa6ae05c3cb21e8564298ff8acd1824a33a5c175d6861837686`; QA `qa-0.jpg`.
- **Animierter Tintenblob-König geschniegelt.gif** — 627×418, SHA256 `29771b8bc3fd97d511e794979d99faa96909a02bb8cc2b91d915ad6bfbb9b523`; QA `qa-1.jpg`.
- **Animierter lila Blob-Pirat_ wütendes Brüllen.gif** — 512×512, SHA256 `acbaa492cc350ec893f133949cce22c45959a38590d2f96d0f02940324ef687a`; QA `qa-2.jpg`.
- **Gif des ruhelosen Schleimzauberers.gif** — 768×340, SHA256 `3b33b0f6b8bcdc267773cccf5668b6c8a3c4195ab027e597a4d5bde4ae90d6f5`; QA `qa-3.jpg`.
- **KFB_Ink_Blob_Pirat_Claymation_Loop.gif** — 512×512, SHA256 `acbaa492cc350ec893f133949cce22c45959a38590d2f96d0f02940324ef687a`; QA `qa-4.jpg`.
- **Sechsfaches Tintenmonster im Schlummerloop.gif** — 627×418, SHA256 `1b56c79d1256ad7e37ccd384c4007f765f5f313a6ecbe35214a4e8830c027dcb`; QA `qa-5.jpg`.

The two pirate filenames are byte-identical: five unique GIFs, not six distinct results. Every frame contains one isolated character. “Sechsfaches…” is a six-frame mummy-like character animation, not a six-character sheet.

## Visual findings

- **Goggles:** coherent blink/squash beat, red irises remain recognizable. The whole head, body, goggles, small floating blobs and flame move or deform together; this is broader than an eye-only blink. Small facial/teeth/edge variation should be reviewed against a locked source rather than assumed faithful.
- **King:** recognizable crown, mantle, jewelry and face throughout, with blink/mouth/body bounce. Crown reaches the top canvas in frames 2 and 3 (5 and 4 nontransparent top-edge pixels); clipping or inadequate headroom is a concrete review gate. Strong decorative detail increases the cost of judging identity drift.
- **Pirate (both names):** clear mouth-open roar peak in frame 2, with coordinated eyelid/gaze and body squash. Hat, patch, stitches, droplets and edge textures also shift. Broad identity remains recognizable in this sample; this does not establish source fidelity. No canvas-edge contact detected.
- **Wizard:** subtle body/hand/scepter/cloak/green-smoke changes; eyes and mouth stay broadly recognizable. More complex props and narrow headroom (only 1–2 px at top) make this a poor first automated pilot. Canvas 768×340 includes considerable empty lateral space; character itself is only about 306–311 px wide.
- **Mummy (“Sechsfaches…”):** clearest bounded blink example. Eye closes and reopens while mouth remains a toothy grin; bandages, hand/wing-like appendages, beads and floating blobs still wobble. Silhouette centroid spans only about 1.7 px horizontally and 1.9 px vertically; overall stability is better than the more exaggerated body-bounce clips. No canvas-edge contact detected.

## Continuity, transparency and limits

Static six-frame inspection plus decoded metadata and pixel measurements found no gross last-to-first discontinuity: foreground union RGBA mean absolute difference for frame 5→0 is lower than each clip’s ordinary frame-to-frame maximum (indeed lower than every other transition in all five unique clips). This is an indicator, not a perceptual smooth-loop certificate. The first and last frames are not identical; wrap motion still needs actual playback review at intended display size.

All decoded frames retain transparency. Full-canvas disposal=2 avoids dependence on incremental dirty rectangles in this decoder; no obvious accumulated trails are visible in decoded frames. GIF provides hard transparency rather than a graded alpha edge, so edge quality needs light/dark/checkerboard playback review in the eventual target viewer. No such player/engine acceptance was performed here. Full-body centroid movement can reflect intentional squash/bounce; it is not automatically unwanted jitter. Frame-to-frame texture and accessory wobble should be distinguished from deliberate motion using a fixed donor reference and protected regions.

## Recommended bounded pilot

After canonical librarian mapping and donor isolation/approval, use exactly one mapped character and one idle blink, six frames, fixed canvas, fixed root anchor and approved timing. The mummy example is the most stable existing motion reference; it is not a newly approved canonical donor. Protect mouth, teeth, bandage/prop details and silhouette except explicitly allowed eyelid/very small squash motion. Review extracted frames and loop playback on light, dark and checkerboard backgrounds. Require no clipped nontransparent boundary pixels, stable protected features, no newly invented details and a deliberate 5→0 transition. Record source hash/identity, frame/timing manifest and reviewer decision. Ship only a review package until the owning product specifies its runtime and acceptance surface.

Do not expand to multiple expressions, directional sets, combat, sheet extraction or unattended batch production until this one-character gate passes. The sample proves that short transparent loops already exist; it does not prove repeatable identity-preserving generation, agent reliability or game readiness.
