# HANDOVER · KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r2

## What is in here
The Claude Design workspace state after ANIMATION-LIBRARY-V1: one entry, 14 local modules, docs, samples, evidence. Remote sources are pinned by commit (SOURCE.json). The 204-row catalog and the GLBs are **not** copied; the entry reads them live from the pin.

## What WSA does
1. Put this folder unchanged into `tools/KFB-ToolBox/_inbox/KFB ToolBox Production-05/` (or unpack the ZIP there). Report the commit SHA back to Georg.
2. Run `zipcheck.py` in the unpacked folder and write the result into TEST_REPORT (here NOT_RUN, no Python in Claude Design).
3. Clean start over HTTP (`python3 -m http.server` in the folder): the page loads, then Library › … › Run LIBRARY self-test. Expected: 24/24.
4. Don't merge the owners. `kfb-lib/anim-library.v1.js` and `kfb-lib/librarian-motion-projection.v1.js` are candidates. The Librarian adapter belongs to `tools/asset_registry/librarian/` (owner: Librarian); moving it there is its own slice.

## Next Gate
**WSA: clean run from the unpacked ZIP over HTTP → Library self-test 24/24 and zipcheck PASS, with the commit SHA reported back.**
