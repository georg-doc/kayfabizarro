# HANDOVER → WSA / Web Lead · 2026-09-30 (from Claude Design · ToolBox)

Write path Claude Design → GitHub is blocked (403). This folder is the delivery; place it unchanged at `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r2/` and return the commit SHA to Georg.

## Do
1. Unpack, run `python3 zipcheck.py`, write the result into TEST_REPORT.md (Claude Design has no Python: NOT_RUN there).
2. Serve over HTTP and open `KFB ToolBox Production-06.dc.html`; confirm Rigging › Eyes and › Mouth show the new rows.
3. Changed shared libs (additive) — check consumers outside ToolBox: `kfb-lib/face-mount.v1.js`, `kfb-lib/clay-lids.v1.js`, `kfb-lib/ear-dangle.v1.js` (Animation Lab PR #214 owner; original frozen in kfb-lib/_ref/). Resident Atlas / WorldBuilder / Animation Lab may mount the same libs (RETURN_TOOLBOX_PRODUCTION_06 §Resident Atlas).
4. Router writeback (proposal, not applied):
   - CHANGELOG: "ToolBox P06: eye socket + hinge/slide lids (9/10), floppy ears (7/7), lid level/roll, conforming painted mouth. Open: eye-edge fineness decision; mouth acceptance NOT_RUN."
   - REGISTRY: status DELIVERED-NOT-INTEGRATED, nextGate "Georg look call".
5. Open items from the lane handover still valid: repo-wide `facingYawDeg` consumer check; P05/Cube Pets/self-test 01–28e not re-run after shared-lib changes.

## Do not
Merge, promote, or publish. Do not treat the standalone HTML as a release: it inlines the page only; three.js (unpkg r160), Google Fonts and the GLB/Pet assets (raw.githubusercontent, jsDelivr @PIN) stay remote.

## Pins
See SOURCE.json (PIN 8922d4b1, EAR 19088b14, MAIN b64d7edc, ML 032c9d50, ML3 4fa08271, …). `pet-library.v6.js` PET_BASE still points at `main` (unpinned, inherited).

## WSA NEEDED
Unpack + commit, consumer check for shared libs, router writeback. **WSA NOT NEEDED:** all design/runtime decisions.
