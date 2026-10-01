# RECOVERY · RESIDENT-CHAT-ENSEMBLE-01 · 2026-10-01

Status: **SOURCE OBJECT PROVEN · SOURCE-ISOLATION GATE BLOCKED BY OPTIONAL PROMO REFERENCE 404**

## Exact owner / branch / PR

- Repository: `georg-doc/kayfabizarro`
- Owner: Resident Atlas source truth → Resident Chat ensemble consumer
- Branch: `chatgpt-web/resident-chat-ensemble-01-2026-10-01`
- Draft PR: **#308**
- Stacked base: PR #306 / `chatgpt-web/resident-chat-presentation-01-2026-10-01@ba38ed7b9dd9ec0cb3373cbe0ea6ad06a45fa4ff`
- Failed gate head before this Recovery write: `138bcab1ddafccc34c5c0f4011e0198de172149e`
- Stage: **NOT DEPLOYED**
- Live: **NOT PROMOTED**
- No ensemble integration has started.

## Gate

Before any four-Resident integration, the existing Resident Atlas S15 host must source-isolate:

- `#lorekeeper`
- `#goth-girl`
- `#clown`
- `#witch`

The actual 3D source object must be shown through the existing Atlas owner. A loaded URL alone is not acceptance.

## Current source pins

- S15 Return blob: `64670df2c39d65c63242ef7fc1f7d7e57dc5023b`
- S15 cast blob: `dc62757ead4ba13906c3e5b6cf2f22d239a6f6b9`
- S15 host blob: `de83d09dd21b944b01ce4a8bf477289521a6cabb`
- Atlas loader blob: `9c54869db0c208c019fe87e356c625cdaf5c35fd`

Source isolation route owner:
`KFB_Resident_Atlas_S15.html#<residentId>`

## Failed source-isolation run

GitHub Actions:
- run: **36860128355**
- job: **110362010182 · source-isolation**
- run number: **2**
- conclusion: **FAILURE**

Evidence artifact:
- id: **11161656760**
- name: `resident-chat-ensemble-source-isolation`
- digest: `sha256:d59920d65787a81d910c6b321b5b5b87246d0772306e76d2b25a9d2c2ffeddb4`
- content: `source-isolation.json`

## Proven result before the failure

The actual **Lorekeeper source object passed** all substantive isolation checks before the QA harness rejected one optional reference-image 404.

Proven in the browser artifact:

- requested selector: `lorekeeper`
- selected recipe: `lorekeeper`
- visible root: exactly `vignette:lorekeeper`
- actor node exists: **PASS**
- actor visible: **PASS**
- node count: **3**
- node ids:
  - `tome`
  - `lorekeeper`
  - `staff`
- rig family: `Rig_Medium`
- pose: `Idle_A`
- QA class from Atlas: `ok`
- Atlas text: `3 Objekte geladen · alle Pfade auflösbar`
- source paths:
  - `Lorekeeper.glb`
  - `Lorekeeper_Tome.gltf`
  - `Lorekeeper_Staff.gltf`
- canvas: 1440×850
- page errors: **0**
- console errors: **0**
- request failures: **0**

Therefore the actual Resident source-object gate is not failing on Lorekeeper.

## Blocking line

Only failed assertion:

`ref/atlas/Lorekeeper.gif → HTTP 404`

This file is the Resident Atlas **promo/reference image**, not actor/set/rig truth.

Historical export provenance is explicit:

`tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1/EXPORT_MANIFEST.json`
blob `5928f2576d15881dd233e0afa47fd568747c382b`

records:

- `ref/atlas/GothGirl.gif` → `LOCAL_NOT_EXPORTED` → `> 2 MB`
- `ref/atlas/Lorekeeper.gif` → `LOCAL_NOT_EXPORTED` → `> 2 MB`

The current 2026-09-30 session cut retains the reference path in `data/cast.js` but does not transport that GIF.

## Classification

**MINOR / QUARANTINABLE**

Reason:
- it is a promo/reference image only;
- the actual Lorekeeper actor + Tome + Staff source objects load and are visible;
- source paths, rig family and pose are proven;
- no runtime/source-object error is present.

Do not copy/rebuild a replacement GIF and do not make it a source dependency.

## Repair budget

Exactly one final repair pass is allowed for this source-isolation gate:

- adjust QA essential-HTTP policy to exclude the known non-transported `/ref/atlas/*.gif` promo references;
- do **not** change Resident Atlas source objects, recipes, actor paths, rig, pose, camera or renderer;
- rerun the unchanged 4/4 source isolation.

If that final repair fails on the same gate, STOP, preserve the candidate and write full FAILURE_RECOVERY. No third repair.

## Exactly one next action

**SOURCE-ISOLATION REPAIR PASS 2:** quarantine non-transported Atlas promo GIF requests in QA only, then rerun 4/4 Lorekeeper / Goth Girl / Clown / Witch source isolation.
