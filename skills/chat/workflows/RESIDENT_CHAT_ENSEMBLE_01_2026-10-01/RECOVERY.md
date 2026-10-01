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


---

# FINAL FAILURE RECOVERY · source-isolation gate stopped

## Stop condition reached

The final allowed repair pass for the same source-isolation gate also failed.

Per KFB production protocol:
- **STOP**
- preserve the candidate
- no third repair
- no four-Resident integration
- no Stage
- no merge

Final repair head under test:

`896976e29c8b1b04242532ec07151c8bf6796530`

GitHub Actions:
- workflow: `resident-chat-ensemble-01`
- run: **36871119073**
- job: **110398834167 · source-isolation**
- run number: **6**
- result: **FAILURE**

Final evidence artifact:
- id: **11167250587**
- name: `resident-chat-ensemble-source-isolation`
- size: **425255 bytes**
- digest: `sha256:a1709cad904512c6e93a7c99ecc594dbf60e5844fb0432da4d924054121cc3b9`
- files:
  - `source-isolation.json`
  - `source-lorekeeper.png`
  - `source-goth-girl.png`

## Final proven source-object state

### Lorekeeper · PASS

Fully isolated and screenshot captured.

- exactly one visible root: `vignette:lorekeeper`
- actor visible: PASS
- Rig_Medium
- Idle_A
- nodes: **3**
  - tome
  - lorekeeper
  - staff
- exact source fragments present:
  - `Lorekeeper.glb`
  - `Lorekeeper_Tome.gltf`
  - `Lorekeeper_Staff.gltf`
- Atlas QA: `ok`
- page errors: 0
- console errors: 0
- essential HTTP errors after promo-GIF quarantine: 0
- request failures: 0

### Goth Girl · PASS

Fully isolated and screenshot captured.

- exactly one visible root: `vignette:goth-girl`
- actor visible: PASS
- Rig_Medium
- Sit_Chair_Idle
- nodes: **5**
  - stool
  - gothgirl
  - speaker
  - micstand
  - microphone
- expected actor/stool/speaker/mic-stand sources present
- page errors: 0
- console errors: 0
- essential HTTP errors: 0
- request failures: 0

### Clown · SOURCE OBJECT PASS / gate blocked after proof

The actual Clown source object loaded successfully before the gate failed on a reference-art image.

Proven:
- selected recipe: `clown`
- exactly one visible root: `vignette:clown`
- actor present: PASS
- actor visible: PASS
- Rig_Medium
- Idle_B
- nodes: **21**
- Atlas QA class: `ok`
- Atlas QA text: `21 Objekte geladen · alle Pfade auflösbar`
- actor/source fragments include:
  - `Clown.glb`
  - `circus_podium.gltf`
  - `clown_hammer.gltf`
  - `juggling_pin_blue.gltf`
  - plus the full existing circus/balloon/prop set

Blocking HTTP line after the 3D source proof:

`media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/artwork.png → HTTP 404`

Current GitHub read proves this file **does exist on main**:

- path: `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/artwork.png`
- blob: `c7535f9b283752b89369f6d0daa0e2b2a63f741b`

The current Resident Atlas cast marks it explicitly as:

`reference ... label: KayKit Clown · Promo-Artwork`

Historical Atlas Return also classifies `media/.../Clown/artwork.png` under **Referenzbilder**.

### Why it 404s in CI

The current ensemble workflow sparse-checkout contains only:

- `skills/chat/workflows/RESIDENT_CHAT_ENSEMBLE_01_2026-10-01`
- the transported S15 session-cut directory

It does **not** checkout the external `media/3D_Assets/.../Clown/artwork.png` path.

Therefore this is a **CI transport / reference-art dependency mismatch**, not a missing Clown actor/set/rig source.

### Witch · NOT REACHED

The test aborts after Clown's reference-art assertion, so Witch has no final-pass screenshot/proof yet.

Do not infer Witch PASS.

## Repair history for this gate

1. Source-isolation attempt exposed non-transported Atlas reference assets.
2. Recovery classified `ref/atlas/*.gif` as optional promo/reference material. The actual Lorekeeper source object was already proven.
3. Final repair pass quarantined only those known non-transported promo GIF requests.
4. Final pass progressed through Lorekeeper + Goth Girl and loaded Clown's complete 21-node source vignette.
5. Gate then failed on Clown `artwork.png`, which is also reference art but exists outside the sparse checkout.
6. **Repair budget exhausted. No third repair.**

## Preserved candidate

Repository:
`georg-doc/kayfabizarro`

Branch:
`chatgpt-web/resident-chat-ensemble-01-2026-10-01`

Draft PR:
**#308**

Preserved final implementation/QA head:
`896976e29c8b1b04242532ec07151c8bf6796530`

Recovery checkpoint commit containing this document follows that head.

No four-Resident ensemble runtime was created.

## Unresolved

- Witch source isolation still unproven in the final run.
- Atlas source-isolation CI currently conflates real source dependencies with optional reference/promo art.
- Current sparse checkout is insufficient to reproduce every Atlas reference image used by the host.
- Do not continue by adding one more ad-hoc exclusion for Clown artwork; that would be repair pass 3.
- A receiving owner must make one coherent decision about **reference-asset transport vs reference-asset QA classification** before a new 4/4 attempt.

## Exactly one next gate

**RESIDENT-ATLAS-ISOLATION-TRANSPORT-01**

At the Resident Atlas / source-isolation owner level, define one reproducible rule:

- either transport the Atlas-declared reference assets required by the host into the browser proof checkout,
- or formally separate optional reference/promo assets from actor/set/rig source-critical HTTP assertions.

Then start a fresh bounded 4/4 source-isolation attempt from the preserved PR #308 candidate.

Do not continue ensemble integration until that owner-level transport/classification gate is resolved.


---

# GEORG DECISION · reference/promo images are NON-BLOCKING · 2026-10-01

Decision:
- Resident source acceptance is about the **actual 3D Resident object and its source-backed scene parts**.
- Required for source isolation:
  - actor/model;
  - relevant props/set objects;
  - rig family;
  - pose / animation source where part of the resident recipe;
  - source paths / provenance;
  - visible isolated vignette.
- NOT required for source acceptance:
  - promo GIFs;
  - pack artwork PNGs;
  - human-facing reference images;
  - decorative thumbnails / key art.

Reference/promo images may still be used as optional:
- authoring orientation;
- visual comparison;
- placeholder/fallback illustration when no 3D view is available.

But their absence or transport failure must **not** fail actor/set/rig source isolation when the real 3D source object is proven.

This resolves:
**RESIDENT-ATLAS-ISOLATION-TRANSPORT-01**

Resolved contract:
**FORMALLY SEPARATE OPTIONAL REFERENCE/PROMO ASSETS FROM ACTOR/SET/RIG SOURCE-CRITICAL HTTP ASSERTIONS.**

Do not copy large reference GIFs or artwork into runtime/browser proof solely to satisfy source-isolation CI.
Do not create replacement promo art.
Do not treat reference-image 404s as runtime/source failures.

The stopped PR #308 remains preserved as recovery evidence and is not repaired further.

Exactly one next gate:
**RESIDENT-CHAT-ENSEMBLE-01B · fresh 4/4 source isolation under the resolved source-critical contract**, starting from the preserved PR #308 state but as a new bounded attempt. Only after Lorekeeper / Goth Girl / Clown / Witch all pass actual 3D source isolation may four-Resident integration begin.
