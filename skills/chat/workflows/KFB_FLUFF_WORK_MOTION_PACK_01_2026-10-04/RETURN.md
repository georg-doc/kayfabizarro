# RETURN · KFB Fluff Work Motion Pack 01 · Part 3 complete

Status: **BLENDER PART 3 COMPLETE · RUNTIME CONSUMER PROOF NEXT**  
Date: 2026-10-04  
Repo: `georg-doc/kayfabizarro`  
Branch: `planning/fluff-blender-slice-01-2026-10-04`  
Current head: `081023f51525b272d9d5197418fa9b25887b1737`  
Draft PR: **#356**  
Merge / Live: **NO / UNCHANGED**

## Current product result

The reuse-first Blender slice is complete through Part 3.

Delivered motion library delta:
- Rig_Medium: **17 clips**;
- Rig_Large: **13 clips**;
- `KFB_Motion_fluff01.glb` for both rigs;
- regenerated `KFB_Motion_Library.catalog.patch_fluff01.json`;
- no new animation clip family is required.

Current Fluff mass/visual rule:
- 6 Small = 1 Medium;
- 3 Medium = 1 Large;
- Small radius 0.20;
- Medium radius 0.723;
- Large radius 1.397;
- rolled work-ball diameter ≈ 2/3 of the carrier body height;
- irregular kneaded/lumpy clay form.

Implemented/proven in Blender:
- push / heavy push / steer for Medium and Large;
- Medium growing-ball push/steer from Medium → Large radius;
- 2- and 3-worker cooperative Large-ball push;
- ball surf / balance / dance;
- foot-driven roll;
- KayKit-native kick + existing header / head-bonk / side-kick / throw contact events;
- 6→1 merge prop reference with gather / squash / POP / puff / settle;
- High/Low / marbled Fluff look references.

Orc push is now clean: **0.00 m ball penetration**. The Part-2 Large-push leg defect is closed.

## Open defects / decisions

### 1 · Robot One pushing the Large ball · GEORG LOOK DECISION

On `*_big_a` at r 1.397, Robot One's large chibi head enters the ball by **0.38–0.45 m**.

Repair pass 1 made it worse:
- penetration up to 0.50 m;
- hand IK error 4 cm;
- loop seam jump 11°.

Repair was reverted.

Options:
- **A · cartoon clay dent / compression** around the head in the runtime;
- **B · author a separate head-up push pose**.

No second Blender repair is justified until Georg chooses A or B.

### 2 · Orc foot-roll · MINOR / QUARANTINABLE

Right leg penetrates the dribble ball by **0.19 m** at frame 18.

Robot foot-roll is clean enough.

This does not block the runtime consumer proof. Runtime may:
- quarantine Orc foot-roll for v1; or
- use a smaller Rig_Large dribble ball.

### 3 · Orc ball rides · MINOR

Surf/balance/dance legs enter the lumpy top by about **0.07–0.12 m**.

Current read is standing in soft clay. Not a runtime blocker unless the integrated consumer looks wrong.

### 4 · Marble look · GEORG LOOK DECISION

- six-colour version = loud / tie-dye;
- three-colour version = calmer.

Both remain valid look references. Runtime must keep this as a configurable/look choice until Georg decides.

### 5 · Runtime-specific items still unproven

NOT_RUN in Blender:
- actual KFB runtime radius blend;
- runtime root placement for ball rides;
- runtime consumption of contact events;
- per-actor hand-radius offsets;
- final runtime clay deformation/dent behavior.

These belong to the receiving runtime proof, not to another Blender pass by default.

## Exact Part 3 evidence

Read:
- `PART3_RETURN/RETURN.md`
- `PART3_RETURN/TEST_REPORT.md`
- `PART3_RETURN/REUSE_STATUS.md`
- `PART3_RETURN/part3_metrics.json`

Primary visual evidence:
- `PART3_FLUFF_SIZES.png`
- `PART3_PUSH_SISYPHOS_MEDIUM_LARGE.png`
- `PART3_PUSH_SISYPHOS.mp4`
- `PART3_COOP_LARGE_BALL.png`
- `PART3_PLAY_CONTACTS.png`
- `PART3_BALL_RIDE.png`
- `FLUFF_MARBLED_LOOK.png`
- `MERGE_6TO1_STRIP.png`

## Ownership

Blender owns:
- authored/derived motion;
- prop/reference timing;
- contact/event metadata;
- source measurements.

Blender does **not** own:
- world/building state;
- construction economy;
- ball physics;
- clay deformation runtime;
- gameplay/reward;
- runtime actor selection.

Those remain with the receiving KFB runtime/world owner.

## Exactly one next gate

**FLUFF_BUILDING_ASSEMBLY_KIT_01_RUNTIME_CONSUMER_PROOF**

Use the Part-3 motion library as the source. Prove in the real runtime:
1. Small→Medium→Large aggregation;
2. Medium and Large roll/push;
3. growing Medium worker ball;
4. 2–3 worker Large-ball cooperation;
5. one ball ride/play action;
6. 6→1 merge POP;
7. contact/event consumption;
8. chosen clay deformation/look behavior.

Do not reopen Blender authoring unless the real runtime proves a motion defect that cannot be solved by consumer configuration/deformation.

No merge. No Live promotion.
