# TEST REPORT · 2026-09-26 r1
Run in the Claude Design preview (Chromium), built-in self-test »…« › Self-test, on real sources (pins as SOURCE.json).
| # | Test | Result |
|---|---|---|
| 01 | ToolBox open · Studio | PASS |
| 02 | FrizzleBob Driver Graft loaded | PASS |
| 03 | Face · eyes + mouth owners | PASS |
| 04 | Pose · IK Hand R on stage | PASS |
| 05 | Pose Profile saved | PASS |
| 06 | Animation Lab · same actor, no rebuild | PASS |
| 07 | Motion Library clip on Rig_Medium | PASS |
| 08 | Scrub to frame 60 | PASS |
| 09 | Contact correction via IK at f60 | PASS |
| 10 | Clip · role · profile saved | PASS |
| 11 | Back to Studio · nothing lost | PASS |
| 12 | Reload restores profiles | PASS |
| 13 | Pose owner fix · wrist-aware chain | PASS |
| 14 | KayKit locomotion profiles measured | PASS |
| 15 | State preview · Jump Start → Air → Land | PASS |
| 16 | EAR-DANGLE-01 · one ear owner | PASS |
| 17 | S39 band on host support | PASS |
| 18 | Back to Studio · actor + profiles intact | PASS |
| 19 | Legacy fixture via builder | PASS |
| 20 | Rigging · face host on FB Ear Rig v5 | PASS |
| 21 | Source per part · painted ↔ rig | PASS |
| 22 | Stage dot → eye spacing (measured Jacobian) | PASS |
| 23 | Export → import round trip | PASS |
| 24 | Eye turn · side (frog) + inward | PASS |
| 25 | Lip-sync · text → 13 decals (NEW) | PASS |
| 26 | Hair tufts · with / middle / bald on the head bone (NEW) | PASS |
| 27 | Clay lids · PR #159 volume on EyeRig (NEW) | PASS |

**27/27 PASS** (evidence/06-selftest-27-27.png). Key readings: 25 · 52 steps, 11/13 shapes (smile/woo not in the test line) · 26 · tufts 108/84/108 tris, × 0.5435, bone »head«, visible 3/1/0 · 27 · 2 eyes, 4328+4328 tris, closed volume, shells hidden while on and back after.
- Visual: evidence/01–05, taken by hand in the same preview. **Human acceptance: NOT_RUN** (Georg).
- zipcheck.py: **NOT_RUN** here (no Python). The equivalent check (required files, no file > 2 MB, manifest and SOURCE JSON valid) was done in JS before zipping: PASS.
- Clean run from the unpacked ZIP over HTTP: **NOT_RUN** (no local server here).
