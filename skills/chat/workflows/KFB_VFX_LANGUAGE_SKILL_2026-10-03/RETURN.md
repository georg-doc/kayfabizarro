# RETURN · KFB VFX Language Skill 01

Date: 2026-10-03
Workflow: KFB-VFX-LANGUAGE-SKILL-01
Status: DOCUMENTATION / RESEARCH SLICE COMPLETE · DRAFT PR OPEN · NOT MERGED

## Owner

Repository:
- georg-doc/kayfabizarro

Branch:
- chatgpt-web/kfb-vfx-language-skill-01-2026-10-03

Draft PR:
- #347

Return parent head:
- d5539ebdd678ddf7d9c3731f6ade0780bc89867b

Final branch rule:
- this RETURN.md is the final write on the VFX branch;
- therefore the final branch head is the commit containing this RETURN.md;
- the exact resulting head is read back immediately after this write and recorded in PR #347 plus the KFB Production Control final RETURN checkpoint.

Base:
- main

State:
- OPEN / DRAFT / NOT MERGED

## Outcome

A provider-neutral and engine-neutral KFB Cartoon VFX semantic / authoring skill now exists.

Primary artifact:
- skills/kfb-cartoon-vfx_v1.md

Verified skill blob:
- 49578e9459ebad994a4a0c928e5c9b0f7cbe302d

Core model:

~~~text
authoritative gameplay / animation / collision truth
→ semantic VFX event
→ recipe
→ hierarchy
→ anchors
→ timing
→ presentation primitives
→ style adapter
→ existing pooled renderer
→ proof
~~~

The skill does not create a second global VFX runtime.

## Main design result

Primary KFB clay effect syllables:
- BALL
- DROP
- CHIP

Specialized peer primitives:
- RIBBON
- RING / SHEET
- MASK / SPRITE
- GLYPH
- SCREEN

Semantic truth states explicitly distinguish:
- confirmed target contact;
- confirmed world contact;
- bounce;
- scrape;
- near miss.

Energy and visual significance are separate.

Attached emitters and released world effects are separate ownership states.

Continuous emission is simulation-dt based.

## Covered VFX domains

- combat impact / melee contact;
- weapon and projectile trails;
- landing / jumping / skidding;
- racer roll / drift / off-road / braking / scrape / impact / boost;
- vehicle enter / exit transition concealment;
- flight speed lines / contrails;
- low-flight leaves / litter / dust disturbance;
- boat wake / bow response / splash;
- fire / smoke;
- AOE / ground effects;
- comic typography / onomatopoeia;
- bounded screen effects;
- pooling / instancing / quality / determinism / prewarm;
- LLM authoring and QA workflow.

## Retained owners

Unchanged:
- gameplay state;
- physics;
- collision / contact truth;
- damage;
- movement;
- vehicle physics;
- actor / rig;
- weapon attachments;
- camera;
- current KFB clay / K2 look owner;
- current consumer-specific VFX runtimes.

Existing implementations remain the preferred renderer/donor layer.

## Direct KFB donor proof

### Combat
Read directly:
1. kfb-vfx-recipes.js
2. kfb-hit-response.js
3. kfb-fx-sprites.js
4. kfb-fx-trails.js
5. kfb-combat-cues.js
6. kfb-fx-flame.js

### Travel / mobility
Read directly:
1. speed-lines.js
2. drift-smoke.js
3. impact-dust.js
4. carpet-wake.js
5. contrails.js
6. post-radial.js

### Clay
Read directly:
1. clay-vfx.v1.js
2. clay-particle-profiles.v1.json

The older branch-local clay donor is used for architecture only. Its reduced material does not replace the current KFB clay-look owner.

## Tiny Skies upstream proof

Repository:
- dannylimanseta/tinyskies

Verified upstream commit:
- 2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6

Direct source files:
- CarpetLeaves.ts · 9c6b68e74865f3cc3dc687edffa3b19412ce8f00
- CarpetWake.ts · 89d1d1cd69244ccf6db50a67c16568574711ef7a
- CarpetDriftSmoke.ts · ca57d9df2eb530744c2e0ea392beb7c044064d0f
- SpeedLines.ts · 4fbb6c74d90c448d49f30669dfb6730bd26c317a

This proves the current KFB Travel relationship to real upstream source rather than relying on remembered inspiration.

## Research evidence

Durable GitHub files:
- skills/chat/workflows/KFB_VFX_LANGUAGE_SKILL_2026-10-03/START_HERE.md
- skills/chat/workflows/KFB_VFX_LANGUAGE_SKILL_2026-10-03/RESEARCH_SOURCE_MATRIX.md
- skills/chat/workflows/KFB_VFX_LANGUAGE_SKILL_2026-10-03/SOURCE.json
- skills/chat/workflows/KFB_VFX_LANGUAGE_SKILL_2026-10-03/TEST_REPORT.md
- skills/chat/workflows/KFB_VFX_LANGUAGE_SKILL_2026-10-03/RECOVERY.md
- this RETURN.md

External research categories include:
- Riot VFX style / gameplay clarity;
- Unreal Niagara event/data-channel architecture;
- Godot particles/subemitters/trails;
- Three.js InstancedMesh;
- stylized smoke / impact / weapon tutorials;
- Ghost of Tsushima environment-response production patterns;
- vehicle / racer VFX;
- water/wake production discussions;
- comic typography / HAWKED;
- Juicy Text / ICMI 2024;
- open-source reusable VFX authoring architectures;
- Reddit/community sanity checks.

## Timeout recovery

A create-file call for RESEARCH_SOURCE_MATRIX.md returned ReadTimeout.

The write was correctly classified UNKNOWN.

No blind retry occurred.

Later recovery proved:
- the matrix had landed exactly once;
- recovered head e8fde3005fa4a030f984f8a07fd70df30aa163c7;
- matrix blob 2cbaf028ccb9a1ee3f1c2d0c0f9daf3c7d11e855.

During the timeout main advanced by 12 commits.

The VFX branch was converged with current main through merge commit:
- eaf8fbd59794caa7056ec53a5f623fdd474504a8

The three original VFX blobs remained unchanged.

## Routing updates

Updated on this branch:
- skills/chat/REGISTRY.json
  - kfb-cartoon-vfx = CURRENT_REFERENCE
- skills/chat/START_HERE.md
  - new 2026-10-03 VFX routing section
- skills/chat/CHANGELOG.md
  - additive VFX v1 entry

The separate KFB Hub owner is PR #202.
Its existing vfx-sfx lane is updated after this Return to reference the final VFX source; no second Hub lane is created.

## Tests

### Skill semantic/content validation
- 71/71 PASS
- 0 fail

### Post-routing / recovery validation
- 16/16 PASS
- 0 fail

Covered:
- skill scope / truth contract;
- primitive vocabulary;
- transition concealment;
- flight / water / typography;
- authoring / QA;
- research durability;
- recovery closure;
- REGISTRY JSON parse;
- Registry CURRENT_REFERENCE entry;
- Router entry;
- Changelog entry;
- no false public/human acceptance claims.

## Stage / browser / human evidence

Reserved route:
- https://kayfabizarro.pages.dev/kfb-hub/stage/vfx-language-skill-01/

Status:
- NOT_DEPLOYED
- NOT REQUIRED for this documentation/research closure

No runtime VFX fixture was integrated in this slice.

Therefore:
- runtime browser test: not applicable to the named outcome;
- screenshot proof: not claimed;
- PUBLIC_VERIFIED: false;
- HUMAN_ACCEPTED: false;
- Live promotion: false.

A future real consumer fixture may use the reserved route only when there is an actual visual/product decision to review.

## Changed files on the VFX owner branch

Primary:
- skills/kfb-cartoon-vfx_v1.md

Workflow/evidence:
- skills/chat/workflows/KFB_VFX_LANGUAGE_SKILL_2026-10-03/START_HERE.md
- skills/chat/workflows/KFB_VFX_LANGUAGE_SKILL_2026-10-03/RESEARCH_SOURCE_MATRIX.md
- skills/chat/workflows/KFB_VFX_LANGUAGE_SKILL_2026-10-03/SOURCE.json
- skills/chat/workflows/KFB_VFX_LANGUAGE_SKILL_2026-10-03/TEST_REPORT.md
- skills/chat/workflows/KFB_VFX_LANGUAGE_SKILL_2026-10-03/RECOVERY.md
- skills/chat/workflows/KFB_VFX_LANGUAGE_SKILL_2026-10-03/RETURN.md

Routing:
- skills/chat/REGISTRY.json
- skills/chat/START_HERE.md
- skills/chat/CHANGELOG.md

## Site persistence

KFB Production Control workflow:
- KFB-VFX-LANGUAGE-SKILL-01

Persisted there:
- research ledger 01;
- research ledger 02;
- preserved source-matrix recovery candidate;
- test/evidence artifact;
- full failure-recovery export;
- recovery-closed checkpoint;
- routing/evidence checkpoints.

The final exact branch head and Hub metadata head are recorded in the final Site RETURN after this file is written.

## Unresolved / deferred

DEFERRED:
- first real integrated VFX consumer fixture;
- visual calibration of clay primitive proportions / material against current K2 look;
- per-consumer semantic adapters;
- actual transition-concealment timing in a vehicle consumer;
- near-ground leaf/downwash fixture;
- boat bow-wave fixture;
- combat typography visual calibration.

These are not blockers for the documentation/research skill.

## Exactly one next productive gate

**VFX-CONSUMER-FIXTURE-01**

Use one real current consumer and its existing runtime owner to prove the semantic event → recipe → existing renderer path with no second physics/VFX owner.

Recommended first fixture:
- one current Combat or Racer interaction with:
  - confirmed semantic event;
  - contact/anchor proof;
  - BALL/DROP/CHIP clay response;
  - one RIBBON or GLYPH peer channel where justified;
  - actual pool/draw-call/cleanup stats;
  - real browser visual proof.

Do not start a new global VFX engine.

No automatic merge.
No automatic Live promotion.
