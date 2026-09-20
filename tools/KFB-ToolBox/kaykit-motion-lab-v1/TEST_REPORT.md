# KayKit Motion Lab v1 · Test / Evidence

Date: 2026-09-20  
Owner: KFB ToolBox / Motion authoring  
Branch: `chatgpt-web/toolbox-kaykit-motion-profiles-2026-09-20`

## Scope

Three exact actors:

1. FrizzleBob · Driver Graft · Rig_Medium
2. GothGirl · Rig_Medium
3. Black Knight · Rig_Large

This candidate authors/tests motion profiles only. It does not own consumer movement, physics or gameplay state.

## Source/static sanity

1. exactly three named actors — PASS
2. FrizzleBob = Rig_Medium — PASS
3. GothGirl = Rig_Medium — PASS
4. Black Knight = Rig_Large — PASS
5. distinct Medium library — PASS
6. distinct Large library — PASS
7. no Sprint runtime source — PASS
8. Running_B is visibly HOLD — PASS
9. Root/Hips translation stripped — PASS
10. real foot sampling — PASS
11. 240 sample intervals — PASS
12. phase-sync transition — PASS
13. speed→timeScale mapping — PASS
14. hysteresis proposal — PASS
15. crossfade + optional warp — PASS
16. FrizzleBob uses current mountGraft reader — PASS
17. FrizzleBob animation ownership = host — PASS
18. one mixer per direct visual host — PASS
19. one mixer per graft visual host — PASS
20. mixer update precedes graft update — PASS
21. no keyboard/input ownership — PASS
22. no velocity/world movement writer — PASS
23. Black Knight rejects Medium profile reuse — PASS
24. Black Knight attachments use Large variants — PASS
25. proposal remains non-promoted — PASS

**25/25 PASS.**

## Browser status

Pending next checkpoint.

Required browser proof:
- FrizzleBob loads and graft reader reports ready;
- GothGirl loads directly;
- Black Knight loads directly at Rig_Large scale;
- exact General + MovementBasic names enumerated per rig;
- Idle/Walking_A/Running_A enabled only when real source exists;
- Walking/Running foot measurement finite;
- A/B transition executes;
- no duplicate mixer/face owner;
- no failed resources/page errors.

## Attachment status

Attachments are intentionally **source-pinned proposals**, not silently mounted:
- GothGirl microphone → handslot.r;
- Black Knight Sword_Large → handslot.r;
- Black Knight Shield_Large → handslot.l, measured donor push 0.55;
- FrizzleBob weapon remains existing graft-reader ownership.

This prevents “asset loaded = attachment proved”.

## Current next gate

Run the exact three-actor browser proof. Do not publish a consumer default or Animation-Lab promotion from static PASS alone.


## Branch browser proof · 87/87 PASS

Workflow:
- run `35480691218`
- job `105997821543`
- source head `35ac2306ed4308b853161edea7113cbbbb49b9c2`
- **87/87 PASS**
- artifact `10595562539`
- digest `sha256:b160162a2a8b7047e0925d966bebdc4f51829fd18c551c816554055cef8e69f3`
- screenshots: FrizzleBob, GothGirl, Black Knight
- `browser.json`
- failed HTTP/resources: 0
- page/console errors: 0

### FrizzleBob · Driver Graft

- Rig_Medium
- adapter: current `mountGraft`
- exact General + MovementBasic bindable inventory: **25 clips**
- Idle_A / Walking_A / Running_A present
- Walking_A: 1.067 s · ref ~0.611 · slip/body ~1.32%
- Running_A: 0.800 s · ref ~2.480 · slip/body ~6.36%
- Running_B present but remains HOLD
- A/B transition executes
- one visual-host mixer; graft update follows mixer
- existing graft weapon/face ownership preserved

### GothGirl

- Rig_Medium
- direct actor
- exact General + MovementBasic bindable inventory: **25 clips**
- same Medium clip names as FrizzleBob
- Walking_A: 1.067 s · ref ~0.611 · slip/body ~1.45%
- Running_A: 0.800 s · ref ~2.480 · slip/body ~6.96%
- Running_B present but remains HOLD
- A/B transition executes
- existing EyeRig/Face owner remains external
- microphone remains source-pinned attachment proposal

### Black Knight

- **Rig_Large**
- direct actor
- exact bindable General + MovementBasic inventory: **8 clips only**:
  `Death_A · Death_A_Pose · Hit_A · Idle_A · Idle_B · T-Pose · Running_A · Walking_A`
- therefore no Walking_B/C, Running_B or Jump state in this Large proposal
- Walking_A: 1.067 s · ref ~1.772 · slip/body ~2.93%
- Running_A: **1.067 s** · ref ~1.850 · slip/body ~15.27%
- A/B transition executes
- Large timing is independent from Medium
- high Running_A compensated-slip candidate requires visual review; do not promote it as final speed mapping
- Sword_Large / Shield_Large remain source-pinned attachment proposals

## Architecture finding

The browser evidence supports a two-level authoring model:

```text
RigMotionProfile
  shared clip/source facts for one rig family
  duration / phase / reference-cadence candidate

ActorMotionReview
  binding proof
  actor dimensions / normalized slip
  approved playback range
  attachment profile
  human status
```

FrizzleBob and GothGirl share Medium clip timing/reference-speed facts but still require actor-specific visual QA. Black Knight proves that Large must remain a separate profile family.

## Current next gate

Improve the candidate transition-speed default from a fixed number to a measured **Walk/Run handoff-speed candidate**, then rerun the same 3-actor proof before Stage publication.
