# WSA Planning Note · Storytelling Maps Prop Rigs

Status: **PLANNING ONLY · NO CONSUMER RUNTIME CHANGE**
Date: 2026-09-20

## Direction

Storytelling Maps will likely introduce a reusable **legless PropActor** family:

- responsive media standees;
- pencil;
- eraser;
- signs/books/other object characters;
- later EyeRig-enabled props.

The intent is to reuse existing KFB motion systems rather than create a Storytelling-Maps-only animation stack.

## Proven donors to coordinate with

### Resident Atlas · Rig_Legacy

Current measured facts:

- six bones:
  `Body, Head, armLeft, handSlotLeft, armRight, handSlotRight`;
- 30 clips in one legacy animation file;
- `legacyAssemble()` already mounts rigid source parts to the legacy skeleton.

This is a strong candidate for legless/cardboard/prop actors.

### CapsuleCarl / ToolBox actor adapter

Current Platformer adapter proves a second lane:

- 0-bone procedural actor;
- semantic states shared with other actors;
- procedural breathing/hop/squash/jump/land/hit.

## Proposed shared seam

Do not decide globally that every prop uses one animation family.

Candidate:

```text
PropActorProfile
├── geometry source
├── rig class: rig-legacy | procedural
├── optional EyeRig
├── verified clip/state compatibility
└── consumer adapter
```

## WSA boundary

Receiving games keep:
- movement;
- collision;
- physics;
- camera;
- progression;
- persistence.

Storytelling Maps / ToolBox provide presentation rigs and animation adapters only.

## Needed before integration

One isolated proof:

1. responsive card standee on Rig_Legacy;
2. same standee on procedural KFB motion;
3. compare which motions are actually useful;
4. publish a small compatibility table.

Do not copy the Legacy loader or CapsuleCarl motion into WSA/Race before that proof.
