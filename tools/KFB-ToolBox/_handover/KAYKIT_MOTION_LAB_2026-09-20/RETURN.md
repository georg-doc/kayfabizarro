# KFB ToolBox · KayKit Motion / Animation Lab proposal · RETURN

**Date:** 2026-09-20  
**Owner:** KFB ToolBox / Motion authoring  
**State:** PUBLIC_BROWSER_PASS · HUMAN_REVIEW_OPEN  
**Branch:** `chatgpt-web/toolbox-kaykit-motion-profiles-2026-09-20`  
**Draft PR:** #127  
**Fixed Stage:** https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-motion-lab-v1/

## Outcome

The Kay Lousberg creator-tutorial findings and KCL-M1 measurements have been transferred into a ToolBox-owned three-actor Motion Lab candidate.

Actors:
1. FrizzleBob · Driver Graft · Rig_Medium
2. GothGirl · Rig_Medium
3. Black Knight · Rig_Large

The implementation follows the creator/KCL principles directly:

```text
actor source
→ rig family
→ separate animation library
→ semantic state
→ measured clip profile
→ phase-aware transition
→ local playback-rate correction
→ attachment/event profile
→ consumer-owned physics/state
```

No second Animation owner, Registry, mixer, movement controller or gameplay runtime was introduced.

## Exact source / implementation

Tested implementation head:

`3ab2a439b013b816e843ea303e7015a26ee2aff8`

Runtime blobs used by public Stage:
- `index.html` → `38dfb46c3388cf7481ad51a485505c8faa555024`
- `lab.mjs` → `ca7bec89776035f1af81ce35c1eec408ba566fa2`
- `proof.mjs` → `76376dab339b1baf738df8d007b3f792fc653cfb`

Main Stage mirror:

`14707f7018ab1c49bfd2d073a01ab3789422245f`

Cloudflare publication mirror:

`b69d3c4bd512a8d34e72e0e074a142ba9e961198`

## Tests

### Static/source
**25/25 PASS**

### Local real-browser
- run `35480849313`
- job `105998255165`
- **87/87 PASS**
- artifact `10595139102`
- digest `sha256:4065242e4a5be9c2a451dfc24a24a1ef409099f3dce00f02ec31bd277ff6aaf3`
- 0 failed resources
- 0 page/console errors

### Public Cloudflare browser
- run `35484127790`
- job `106007210838`
- **87/87 PASS**
- artifact `10596912462`
- digest `sha256:d4638aba0e4bd02b690f19cb931c92f99cac020d0af05e5d1124f11003300ca4`
- FrizzleBob screenshot
- GothGirl screenshot
- Black Knight screenshot
- 0 failed resources
- 0 page/console errors

`PUBLIC_VERIFIED = YES`

## Main implementation findings

### Rig_Medium · FrizzleBob + GothGirl

Both actors bind the same 25 General + MovementBasic clips.

Primary pair:
- Walking_A ref ≈ 0.611
- Running_A ref ≈ 2.480
- candidate handoff speed ≈ 1.108
- current technical playback windows do not overlap by ~0.016
- Walking_A reaches ~1.80×
- Running_A reaches ~0.45×

This is technically workable but close to the clamp edges. Walking_B/C remain useful alternatives to inspect before a Medium profile is accepted.

Running_B remains **HOLD**.

### Rig_Large · Black Knight

The tested Large General + MovementBasic sets expose only:

`Death_A · Death_A_Pose · Hit_A · Idle_A · Idle_B · T-Pose · Running_A · Walking_A`

Therefore:
- no Walking_B/C;
- no Running_B;
- no Jump state in this tested Large set;
- no Medium-profile reuse.

Measured primary pair:
- Walking_A ref ≈ 1.772
- Running_A ref ≈ 1.850
- candidate handoff speed ≈ 1.811
- playback windows overlap
- Walk ≈ 1.02×
- Run ≈ 0.97×

This is a cleaner cadence handoff than Medium, but Running_A still has a high automatic compensated-slip candidate (~15.27% actor height), so visual acceptance is required.

## Proposed profile architecture

The evidence supports:

```text
RigMotionProfile
  shared source/clip timing/contact facts per rig family

ActorMotionReview
  binding proof
  actor dimensions
  normalized slip
  approved playback range
  attachment profile
  human acceptance / overrides
```

This avoids repeating identical Medium facts for every actor while still preserving actor-specific visual QA.

## Actor proposals

### FrizzleBob · Driver Graft

Use:
- current `mountGraft(animation:'host')`;
- `graft.figure` as mixer root;
- frame order: `mixer.update(dt) → graft.update(dt,camera) → render`;
- Idle_A / Walking_A / Running_A;
- Walking_B/C available for comparison;
- Running_B HOLD;
- phase-aware Walk↔Run;
- speed→timeScale only inside an approved range.

Do not rebuild weapon/face ownership. Existing graft reader remains authoritative.

### GothGirl

Use:
- direct real GLB;
- Rig_Medium animation library;
- same Medium shared profile facts;
- actor-specific visual review;
- current EyeRig/Face owner remains external.

Attachment proposal:
- `GothGirl_Microphone.gltf`
- `handslot.r`
- source-pinned
- visual attachment acceptance still open.

### Black Knight

Use:
- direct real GLB;
- **Rig_Large** animation library only;
- independent Large measurements;
- Idle_A / Walking_A / Running_A only from current tested set.

Attachment proposals:
- `BlackKnight_Sword_Large.gltf` → `handslot.r`
- `BlackKnight_Shield_Large.gltf` → `handslot.l`
- shield donor push `0.55`

Never substitute Medium weapon variants for this actor.

## What is now sufficiently clear for production

The following can be treated as implementation guidance without Georg first studying the Godot tutorials in detail:

- animation libraries remain separate from actor identity;
- rig-family compatibility is explicit;
- state semantics are separate from clip names;
- Walk↔Run transitions should preserve gait phase/contact when possible;
- timeScale is local cadence correction, not a universal speed system;
- hysteresis belongs around consumer speed bands;
- physics/state remains consumer-owned;
- contact/release/tool events should be tied to animation phase;
- attachments require exact donor + correct rig-size variant + named socket + local calibration + visual test;
- actor-specific review may override a shared rig-family profile;
- retargeting remains a later staged proof, not a default assumption.

## Boundaries

Not promoted:
- Animation Lab as CURRENT_TOOL;
- any consumer locomotion default;
- Sprint;
- attachment acceptance;
- combat/ranged event profiles;
- Large/Medium interchangeability.

No auto-merge or Live promotion.

## Exactly one next gate

Georg reviews the three actors on the fixed Stage in the same semantic Idle → Walk → Run / phase-sync workflow.

Review:
- FrizzleBob Medium handoff;
- GothGirl Medium handoff;
- Black Knight Large handoff;
- whether Walking_B/C should replace Walking_A for Medium;
- visible weight/foot slip/cadence.

Only after that human gate should the accepted MotionProfile seam be promoted into named consumers.


## Final synchronized handoff

State before this Return update:
- repository: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/toolbox-kaykit-motion-profiles-2026-09-20`
- synced branch head: `d5f0657dc5210fd61f462555b90e81cf590bb7a8`
- base: `main@53b828a29c71b9ee20635dc0133813e37697f961`
- Draft PR: **#127 · OPEN · DRAFT · UNMERGED**
- compare: **20 commits ahead · 0 behind · 11 changed files**
- PR mergeable: **true**

Public Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-motion-lab-v1/`

Public browser:
- **87/87 PASS**
- run `35484127790`
- job `106007210838`
- artifact `10596912462`
- 0 failed resources
- 0 page/console errors

Main/Hub metadata:
- main publication checkpoint: `53b828a29c71b9ee20635dc0133813e37697f961`
- Hub badge: `PUBLIC 87/87`
- ToolBox START/CHANGELOG updated additively
- public mirror metadata commit: `2df31bea695d634037bd7135401d3b86d108f623`

Exactly one next gate remains human:
Georg reviews FrizzleBob, GothGirl and Black Knight motion feel on the public Stage. No consumer profile or attachment is promoted before that gate.
