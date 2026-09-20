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
