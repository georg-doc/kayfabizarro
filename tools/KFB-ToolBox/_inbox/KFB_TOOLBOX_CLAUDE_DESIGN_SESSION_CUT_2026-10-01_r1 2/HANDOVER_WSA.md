# HANDOVER → WSA / Web Lead · 2026-10-01 (from Claude Design · ToolBox P08)

Claude Design cannot write to GitHub (403). This folder is the delivery: place it unchanged at `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/` and return the commit SHA to Georg.

## Do
1. Unpack, run `python3 zipcheck.py`, write the result into TEST_REPORT.md (NOT_RUN on the Claude Design side, no Python there).
2. Serve over HTTP and open `KFB ToolBox Production-08.dc.html`; run the 5 checks in START_HERE.
3. Shared libs changed or new. Check consumers outside the ToolBox (Resident Atlas, WorldBuilder, Animation Lab):
   - changed: kfb-lib/clay-lids.v1.js (`_lvl` LIDS-04; r2 frozen in _ref/clay-lids.v1.lids03.js), kfb-lib/contact-ao.v1.js (ear class, `ears` param, default 0 = no ear-root darkening), kfb-lib/face-mount.v1.js (Laute hold)
   - from the P07 editor lane, local and not pushed: kfb-lib/edit-layer.v2.js, snap.v1.js, grounding.v1.js
4. Router writeback (proposal, not applied):
   - CHANGELOG: "ToolBox P08 = P06 rigging + P07 editor; lids level/roll measured (FIX-01 5/5); ear-root shadow off; Laute on the model mouth. Open: standalone boot, full self-test re-run, LIDS-02 check 7."
   - REGISTRY: status DELIVERED-NOT-INTEGRATED, nextGate "Georg look call P08".

## Do not
Merge, promote or publish. Do not ship the standalone HTML: it fails to boot (TEST_REPORT).

## Pins
See SOURCE.json (unchanged since r2). pet-library.v6.js PET_BASE still points at `main` (unpinned, inherited).

## WSA NEEDED
Unpack + commit, zipcheck, consumer check for the shared libs, router writeback. **WSA NOT NEEDED:** design and runtime decisions.
