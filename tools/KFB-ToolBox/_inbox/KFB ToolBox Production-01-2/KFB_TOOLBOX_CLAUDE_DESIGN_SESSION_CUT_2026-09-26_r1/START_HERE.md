# START HERE · KFB ToolBox · Claude Design Session Cut 2026-09-26 r1

**Entry point:** `KFB ToolBox Production-02.dc.html` (Design Component, opens directly in the browser over HTTP; `support.js` next to it).
**Status:** TECHNICAL_PASS in the preview (self-test 27/27) · **Georg visual gate open** (clay lids, hair tufts, lip-sync).

## Open it
1. Serve this folder over HTTP (`python3 -m http.server` in this folder) and open `KFB ToolBox Production-02.dc.html`. file:// does not work because the owner modules are ES imports.
2. Rigging tab › actor »FrizzleBob · Ear Rig v5«.
3. »…« › Self-test → expect 27/27 PASS. It restores your save afterwards.

## What is new in this cut
- Free orbit camera: no polar limit, zoom to cursor, min distance 0.02, near plane 0.005.
- Rigging › Mouth: **Lip-sync over all 13 decals** from typed text (DE/EN) plus »▶ All 13«; **expression rest mouths** (restMap: 6 expressions × decal · corners · roll); a note when the painted mouth is the source (static mesh, no shapes).
- Painted parts (partrig): Depth down to −0.6, wider Height/Spacing/Size. The rig mouth offset may go to −0.06.
- Rigging › Eyes: lid shells (upper down, lower up from below, slant, Δ left) **and Lid style »Clay volume«** = Eye Actor Studio v1 donor (PR #159 `upper-lid-volume.v1.mjs`), sweeping with blink and emotes.
- Rigging › Hair: FrizzleBob's three tufts cut from `FrizzleBob_Yellow.gltf`, on the head bone, own material `KFB_Hair`.
- Blender brief v2: `blender/BLENDER_BRIEF_v2.md`.

Read next: `HANDOVER.md` (WSA), `CURRENT_STATE.md`, `TEST_REPORT.md`.
