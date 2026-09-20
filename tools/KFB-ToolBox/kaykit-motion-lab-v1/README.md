# KFB ToolBox · KayKit Motion Lab v1

Status: **PUBLIC BROWSER 87/87 PASS · HUMAN MOTION/ATTACHMENT GATES OPEN**  
Owner: **KFB ToolBox / Motion authoring**  
Implementation tested at: `3ab2a439b013b816e843ea303e7015a26ee2aff8`

## Actors

- FrizzleBob · Driver Graft · Rig_Medium
- GothGirl · Rig_Medium
- Black Knight · Rig_Large

## What is implemented

- exact rig-family animation-library loading;
- runtime enumeration of actually bindable clips;
- one mixer per visual host;
- FrizzleBob through current `mountGraft(animation:'host')`;
- Root/Hips translation stripped so ToolBox does not own world movement;
- real foot-contact sampling;
- Walk/Run reference-speed and slip candidates;
- naive vs same-foot phase-sync A/B;
- crossfade + optional warp;
- measured speed→timeScale mapping;
- hysteresis preview;
- measured Walk/Run handoff-speed solver;
- attachment source proposals without guessed transforms.

## Browser evidence

Latest branch proof:
- run `35480849313`
- job `105998255165`
- **87/87 PASS**
- artifact `10595139102`
- digest `sha256:4065242e4a5be9c2a451dfc24a24a1ef409099f3dce00f02ec31bd277ff6aaf3`
- screenshots for all three actors
- 0 failed resources
- 0 page/console errors

## Main findings

### Rig_Medium

FrizzleBob and GothGirl bind the same 25 General+MovementBasic clips.

Primary measured pair:
- Walking_A ref ~0.611
- Running_A ref ~2.480
- handoff speed ~1.108
- current playback windows have a tiny ~0.016 gap;
- handoff rates reach current technical clamp edges: Walk ~1.80×, Run ~0.45×.

Running_B remains HOLD.

### Rig_Large

Black Knight exposes exactly eight bindable General+MovementBasic clips:

`Death_A · Death_A_Pose · Hit_A · Idle_A · Idle_B · T-Pose · Running_A · Walking_A`

No Walking_B/C, Running_B or Jump clips are enabled.

Primary measured pair:
- Walking_A ref ~1.772
- Running_A ref ~1.850
- handoff speed ~1.811
- playback-rate windows overlap;
- Walk ~1.02×, Run ~0.97×.

Running_A automatic compensated slip remains high (~15.27% actor height), so Large visual approval is required.

## Attachments

Pinned, proposed, **not silently mounted**:

- GothGirl microphone → `handslot.r`
- Black Knight Sword_Large → `handslot.r`
- Black Knight Shield_Large → `handslot.l`, donor push 0.55
- FrizzleBob weapon stays owned by the existing graft reader

This follows the donor-first rule: source presence is not attachment acceptance.

## Ownership

ToolBox owns profile authoring/calibration.

Named consumers still own movement, physics, state, damage/ammo, jump trajectory and interaction progress.

Animation Lab remains an unpromoted consumer/authoring target until its own SSOT is pinned.

## Next gate

Publicly verify the exact Stage candidate, then Georg reviews the three actors in the same Idle → Walk → Run / phase-sync workflow. No consumer default is promoted before that human gate.


## Public Stage evidence

Fixed route:

https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-motion-lab-v1/

Public proof:
- main publication commit `14707f7018ab1c49bfd2d073a01ab3789422245f`;
- Cloudflare mirror commit `b69d3c4bd512a8d34e72e0e074a142ba9e961198`;
- workflow run `35484127790`;
- public-proof job `106007210838`;
- **87/87 PASS**;
- artifact `10596912462`;
- digest `sha256:d4638aba0e4bd02b690f19cb931c92f99cac020d0af05e5d1124f11003300ca4`;
- screenshots: FrizzleBob, GothGirl, Black Knight;
- failed HTTP/resources: 0;
- page/console errors: 0.

`PUBLIC_VERIFIED = YES`.

Human review remains intentionally open.

## Current review target

Use the same semantic workflow on all three actors:

`Idle → Walking_A → Running_A`

with phase-sync enabled for Walk↔Run.

Key review questions:
- FrizzleBob / GothGirl Medium: does the current 1.80× → 0.45× handoff still feel natural, or should Walking_B/C become the preferred walk donor?
- Black Knight Large: does the near-native 1.02× → 0.97× handoff read cleanly despite the high automatic Running_A slip candidate?
- Attachments: microphone / Large sword / Large shield still need their own visible attachment gate.

No consumer default is promoted from technical PASS alone.
