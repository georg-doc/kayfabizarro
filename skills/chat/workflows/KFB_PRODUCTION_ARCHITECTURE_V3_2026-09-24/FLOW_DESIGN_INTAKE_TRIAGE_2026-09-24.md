# Flow Design intake triage · 2026-09-24

Status: **CLASSIFIED INPUT · NOT PROMOTED BY INBOX LOCATION**

Purpose: pre-sort Georg's three newest Flow Design exports before any WSA/Work session. The exports remain candidate inputs until their receiving owners accept the useful delta.

## 1 · Cologne World Shell

Inbox source:
`tools/KFB-ToolBox/_inbox/KFB WB-D1 · Cologne World Shell/SESSION_2026-09-24_WB-D1/`

Main upload commit:
`3f3246eb2ae4711c69dbd2d607994ae79309d608`

Useful result:
- source-real Dom/Hbf shell on the frozen Cologne fixture;
- Elastic Grotesque Clay presentation;
- Card Zone v2 water;
- current shared edit layer;
- Dom/Hbf landmark placement;
- empty Racer track socket;
- clean seam `wd1-seam.js -> loadZone({kind})`.

Owner boundary is correct:
OSM City Lab owns geography; World Zone Bake owns package/elevation/conflicts; Race owns track; this shell owns presentation.

Important new recovery fact:
WORLD-ZONE-BAKE-01 is no longer an unfinished dependency. The G0→G3 continuation produced the canonical Cologne package and a real-browser load/place/reload PASS. Current G3 Return:
`tools/osm-city-lab/docs/WORLD_ZONE_REVIEW_G3_RETURN_2026-09-24.md`
on `chatgpt-web/world-zone-review-g3-2026-09-24`.

Classification:
**KEEP · WEB/GITHUB INTEGRATION NEXT · NOT WORK**

Next gate:
**WB-ZONE-SEAM-01** — add only the `kind:'world-zone-bake'` adapter so this accepted visual shell consumes the proven Cologne World Zone. Presenter, landmarks and editor stay untouched.

Do not send Hürth/Mülheim/Ehrenfeld/Ringe future sprints to Work now.

## 2 · Resident Card Speculation Scene

Inbox source:
`tools/KFB-ToolBox/_inbox/KFB Resident Card Speculation Scene/npc-card-spec-01_2026-09-24/`

Main upload commit:
`d8a02ceada2275d168b818e86e808383678d4911`

Useful result:
- FrizzleBob Driver Graft + GothGirl + one real KFB Card;
- deterministic ~26 s worldview/Triplet beat recipe;
- current EyeRig/PetMouth/bubble/Card owners;
- one movable scene root, no baseplate;
- thin `mountResidentScene(...)` seam.

Source question is resolved in the export: Georg identified the user-named “FrizzleBobrick” as the current Driver Graft.

Motion dependency changed after the Design session:
PR #209 now contains the shared 33-clip Rig_Medium/Rig_Large Motion Library. Do not preserve a local copied Motion Library as a new owner; bind to the current library source when integrating.

Classification:
**KEEP · HUMAN VISUAL GATE FIRST · NOT WORK**

Next gate:
Georg judges the two faces/mouths as the Resident talk look. Only after PASS should Web mount the thin scene recipe into one Town/WorldBuilder host.

Do not create a second mouth, eye, mixer, bubble, Card renderer or persistence owner.

## 3 · Resident Atlas S39 / Orc Band

Inbox source:
`tools/KFB-ToolBox/_inbox/KFB Resident Atlas v3/S39-band-module-01/`

Main upload commit:
`dcb31ef84d5dd0facb8aa9f61139300fbde628b0`

Useful result:
- the former standalone band page has already been superseded by Resident Atlas S8;
- baseplate-free band composition;
- one movable root;
- browser pose/edit/IK workshop;
- Leader and guitarist source work retained;
- drummer hand-pose → constant Resident patch or POSE-TO-BLENDER route;
- shared Motion Library PR #209 can supply motion.

Critical architecture correction:
the export-local `kfb.resident-band-module/1` must **not** become a second proprietary production runtime. MUSIC-PERF-01 already proved the reusable `kfb.resident-performance.v1` song/performance seam, and the wider Resident architecture already owns thin placeable Resident scenes.

Salvage:
- actors/props;
- browser pose workflow;
- no-baseplate/root behavior;
- drummer reference-pose workflow;
- song/action references.

Do not promote:
- a band-specific global runtime owner;
- a second song clock/player;
- a second scene persistence contract.

Classification:
**KEEP AS INPUT · RECONCILE INTO EXISTING RESIDENT PERFORMANCE/SCENE OWNERS · NOT WORK YET**

Next gate:
Georg reviews guitarist/trumpeter/drummer presentation and supplies the drummer hand pose. Then Web/GitHub Bridge maps accepted data onto the existing general Resident performance/scene contract.

## Intake conclusion

None of the three Flow Design exports currently needs WSA/Work execution.

They are already sufficiently bounded for:
- human review;
- Web/GitHub integration;
- or later Blender only where a time-varying motion correction is actually required.

WSA/Work should not re-audit these folders or rebuild their owners.
