# KFB HUD-Kit R1 · actual test report · 2026-11-04
Scope: source/authoring CONTRACT only. No live HUD renderer change or Stage publication.
## Local test evidence
- 7 / 7 synthetic PIL validator fixtures PASS, executed in local container using copy identical to GitHub docs/hud-kit/validate_sheet.py (Git blob SHA 98254fac9b1affc1ea9722faaaf109b41c06572e).
- Positive: valid sheet 1 band occupancy and transparent margin; valid sheet 2 complete 4x4 cells.
- Negative (correctly rejected): opaque RGB, wrong dimensions 1500x800, occupied sheet-1 gap, missing one sheet-2 cell, content touching sheet-2 intercell boundary.
- 9 / 9 representative chat asset PNGs inspected locally: all RGBA, fully transparent alpha 0 present, source SHA256 and dimensions recorded in LOCAL_SOURCE_HASHES.csv. This is format evidence, not proof of zero clip or design PASS.
- GitHub source census: 34 named WS0 icons across 7 categories in KFB-Stunt-Car-Race branch design/claude-design-r3, plus 14 slot PNGs; filenames/donor paths fetched. Other files in that branch (Almanac / Speech) were identified.
- 5 authoring files and 2 scripts created and fetched back exactly on new docs branch. Reference binary art itself is not hosted in GitHub.
## NOT tested / scope boundaries
- No actual new 2048x2048 generated Sheet1 or Sheet2 was tested.
- No browser/gameplay integration, no 48/64px human view, no slice seam acceptance for every skin, no QA proof of no clipping for all archived chat PNGs.
- No image generator agent/plugin was installed or invoked; generator jobs remain manual/new-job prompts.
- No automated action on actual audio, minimap, HUD state or travel telemetry owners.
- No Site / Cloudflare / Hub publication claimed.
## Known geometry constraint
WS0 nominal 512px + 640px + 1220px exceeds 2048px canvas, before padding. The authoring spec enforces 2048px canvas and 32px spacing first, proportionally fitting the radio into lower band. This is an intentional interpretive resolution of incompatible approximations, not a claim of their simultaneous fidelity.
## Outcome
READY AS DESIGN/AUTHORING STANDARD · SOURCE REFERENCES NOT YET GITHUB-PINNED · NOT GAME READY.
Next gate: source-isolated first real 2048 Sheet1 with attached accepted donor and actual alpha/layout/visual review.