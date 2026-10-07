# Blender MCP · Shield Fit · Rig_Medium + Rig_Large · 2026-10-07

Status: **READY BRIEF · HOLD UNTIL COWORKER / LOCAL RESOURCE CONTENTION IS CLEAR**
Executor: **Blender MCP**
Issue: **#367**
Outcome: **source-proven shield fit audit + only-if-needed 3D correction**
Open World runtime writes: **FORBIDDEN**

## 0 · Human finding

Current integrated view still shows shields incorrectly fitted for Medium/Large.

Visible failure pattern from Georg's review:
- shield reads too low;
- too close to leg/cape/body;
- lower edge approaches ground;
- carry/block silhouette is not convincingly attached to forearm/hand.

Do not assume the fix is "scale it".

First determine whether this is:
1. wrong source variant;
2. lost rig-specific attachment values;
3. wrong pose/clip;
4. wrong runtime consumer transform;
5. actual source/pivot/pose defect requiring Blender work.

## 1 · Existing structural rules · MUST preserve

Source:
`tools/resident_atlas_s6/data/cast.js`

### Hand-slot rule
KayKit `handslot.l/r` bones and prop pivots are authored to match.

Default:
**identity transform first**.

Do not invent Euler rotations/offsets per prop unless source isolation proves they are necessary.

### Shield exception
Measured existing rule:
- shield pivot lies on the shield back surface;
- hand volume may protrude into the shield;
- correction is a **push along shield normal**;
- do not re-orient the shield merely to create clearance.

### Rig size rule
Rig_Large is a real larger skeleton family, not rendered Rig_Medium.

Where the pack provides both variants:
- Medium → base prop file;
- Large → `*_Large` prop file.

Measured pack pairs are approximately exact 2× geometry scale.
Do not mount the Medium shield on a Large actor and then eyeball-scale it.

## 2 · Primary proof fixtures

### A · Rig_Medium · Cleric

Actor:
`media/3D_Assets/KayKit_Mystery_Series6/3 - September 2025 - Cleric/Cleric.glb`

Shield:
`media/3D_Assets/KayKit_Mystery_Series6/3 - September 2025 - Cleric/gltf/Cleric_Shield.gltf`

Rig:
`Rig_Medium`

Attachment:
`handslot.l`

Current Atlas push:
`0.16`

Measured source facts already recorded:
- Cleric approx 2.008 × 2.173 × 1.091;
- shield approx 0.749 round × 0.174 thick;
- pivot is on rear surface;
- current intended correction is normal push, not rotation.

### B · Rig_Large · Black Knight · PRIMARY LARGE

Actor:
`media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/characters/BlackKnight.glb`

Shield:
`media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/assets/gltf/BlackKnight_Shield_Large.gltf`

Rig:
`Rig_Large`

Attachment:
`handslot.l`

Current Atlas push:
`0.55`

Pose/clip donor:
`Melee_Blocking` from Rig_Large.

Important:
- do not bind Rig_Medium pose data to Black Knight;
- Medium shield file is only a size-comparison donor;
- `BlackKnight_Shield_Large.gltf` is the intended worn source.

### C · Rig_Large · Monstrosity · SECOND VALIDATION

Actor:
`media/3D_Assets/KayKit_Mystery_Series6/4 - October 2025 - Monstrosity/Monstrosity.glb`

Shield:
`media/3D_Assets/KayKit_Mystery_Series6/4 - October 2025 - Monstrosity/gltf/Monstrosity_BarndoorShield_Large.gltf`

Rig:
`Rig_Large`

Attachment:
`handslot.l`

Current Atlas push:
`0.5`

Pose donor:
`Melee_Blocking`.

This is a validation fixture, not a second first-gate requirement if resource/time is tight.

## 3 · Audit-first stop gate

Before modifying a source asset or creating a new clip:

1. show actor alone;
2. show shield alone with pivot/axes;
3. mount the exact intended shield on exact rig using existing Atlas recipe;
4. show front / side / 3-4 / rear;
5. compare with current bad integrated screenshot/behavior;
6. test the intended pose/clip;
7. measure ground, leg, torso/cape and hand clearance.

### If existing Atlas recipe is visually correct

Return:

`RUNTIME_ATTACHMENT_CONSUMER_MISMATCH`

and provide the exact attachment table the runtime should consume.

Do **not** create new Blender asset variants.

### Only if source/Atlas proof itself fails

Proceed to bounded Blender tuning.

## 4 · Allowed Blender tuning

Only when audit proves it is necessary:

- correct prop origin/pivot if source import semantics are actually wrong;
- create rig-specific attachment empty/socket helper only if it can be expressed as reusable data;
- adjust a shield-hold/guard pose;
- create a small pose correction/additive clip when no existing valid pose can solve readability;
- measure exact translation/rotation/scale values.

Do not:
- remodel the shield for style;
- invent a second hand-slot system;
- change actor skeleton proportions;
- bake runtime world position into animation;
- modify Open World;
- create one-off per-frame hacks.

## 5 · Runtime-ready output table

Return one row per accepted fixture:

```
rigFamily
actorSource
shieldSource
handBone
propScale
push
pushAxis
positionOffset
rotationOffset
poseRole / clip
minGroundClearance
minBodyClearance
notes
```

Prefer:
- identity rotation;
- source-native scale;
- one normal push.

Any additional offset/rotation must be justified by isolated evidence.

## 6 · Motion/readability proof

Minimum views:
- neutral/idle;
- intended block/carry pose;
- front;
- side;
- 3/4;
- rear;
- one locomotion sample if the receiving runtime carries the shield while moving.

Check:
- shield does not visually drag on ground;
- shield does not cut through thigh/torso/cape;
- forearm/hand relationship reads clearly;
- silhouette remains readable at gameplay distance;
- Large reads intentionally Large without becoming an accidental floor shield;
- Medium does not inherit Large offsets.

## 7 · Style references

Read:
`skills/chat/KFB_STYLE_REFERENCE_ROUTER_2026-10-07.md`

Use Style References / Open World Styleguide only for:
- silhouette/readability;
- appealing proportions;
- presentation/context;
- visual benchmark questions.

Do not use them to override measured KayKit source/rig facts.

## 8 · Evidence / Return

Required:
1. exact source pins;
2. isolated source screenshots;
3. before/after comparison;
4. front/side/3-4/rear;
5. Medium result;
6. Large result;
7. attachment table;
8. classification:
   - `RUNTIME_ATTACHMENT_CONSUMER_MISMATCH`, or
   - `BLENDER_FIT_TUNE_REQUIRED`;
9. changed Blender/GLB/JSON files only if actually needed;
10. one next gate.

## Acceptance

PASS only when Medium and Large are each:
- source-correct;
- rig-correct;
- ground-clear;
- body/cape-clear;
- visually attached to hand/forearm;
- documented as reusable attachment data.

No Open World writes.
No merge.
