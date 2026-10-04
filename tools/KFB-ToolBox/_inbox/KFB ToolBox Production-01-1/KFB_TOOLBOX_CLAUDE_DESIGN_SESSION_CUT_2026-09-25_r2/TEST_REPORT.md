# TEST REPORT · 2026-09-25 r2

## Static / source
- Local closure: entry references ./support.js, ./kfb-lib/pose-rig.v1.js, ./kfb-lib/locomotion-profiles.v1.js, ./kfb-lib/pet-library.v6.js — all in this folder. PASS
- JSON parse of data/*.json, SOURCE.json, EXPORT_MANIFEST.json — PASS (script)
- Secret scan (token/key patterns) over exported text — 0 hits. PASS
- zipcheck.py — ZIPCHECK_NOT_RUN (no Python in this environment); same checks run in JS: required files present, no file > 2 MB, manifest/SOURCE parse + schema — PASS

## Runtime / browser (Claude Design preview, Georg's tab, real sources)
Self-test 19/19 PASS:
01 Studio open · 02 Driver Graft (Rig_Medium, pose OK, 38 stock clips) · 03 eyes + mouth · 04 IK Hand R miss 0.0000 · 05 Pose Profile saved · 06 Lab, no rebuild · 07 kfb_music_drums_a 69/69 · 08 scrub f60 · 09 contact correction f60 miss 0.0000 · 10 role + profile saved · 11 back to Studio intact · 12 reload restores · 13 owner fix: upperarmr→lowerarmr→[wristr]→handr lenL 0.3338 (child.position 0.0738), 2 leg chains · 14 KayKit locomotion 14/14 roles (Driver: walk 0.564 m/s 112.5 spm, run 2.487 m/s, sprint Running_A playback-rate variant) · 15 Jump Start→Air→Land, events take-off + land · 16 EAR-DANGLE-01 on FB Ear Rig v5, ear bones 3+3, dance kfb_dance_chicken_a, all finite, peaks ≤ 19.4° (fixed-step drive) · 17 S39 band leader/guitarist/drummer/trumpeter, ground-like meshes 0, wd-sky real · 18 back to Studio, runtime identical · 19 Legacy builder 4 parts, 30 clips
Real-time EAR-DANGLE-01 (after teleport-reset fix, fixed 1/60 drive): idle 3.5°/0.6 s · walk 3.8° · run 16.6° · idle 21.7°/1.2 s · jump.start 7.8° · jump.air 3.1° · jump.land 17.3° · idle 11.8°/0.82 s · dance 17.7° · idle 5.6°/0.97 s · kicks take-off, land.
Locomotion set measured on FB Ear Rig v5: see data/ (walk 0.623 · walk.fast 0.809 (×1.3 variant) · run 3.01 · sprint Running_B 3.676 · backward 0.688 · strafe 3.13/3.18 diagonal · crouch 0.615 · sneak 0.605 · crawl 0.383 m/s).

## Verifier (background, Claude preview)
- Boot all sources green · Studio Body/Fit · Lab State/Ears/Band checked OK · groundReport drummer −0.105/−0.082 (matches band doc) · NEEDS_WORK drumContact key case → fixed.
- One empty `[error] {}` on load — origin not isolated (NOT_RUN).

## Visual / human
- NOT_RUN — Georg review is the next gate. Evidence: evidence/01-lab-state-locomotion.png only (preview captures of the moving preview were unreliable in a hidden tab and were discarded).

## Not tested
Solver gate A/B/C in Georg's tab (code path runs; no recorded result) · song playback (audio) · band drum-contact readout (fixed after verifier: head keys r/l; re-check pending) · CARD_SURF save in Georg's tab · split-screen in Georg's host · clean run from the unpacked ZIP (CLEAN_RUN_NOT_EXECUTED: cannot unpack/serve a ZIP here) · mobile.
