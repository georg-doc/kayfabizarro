# Eye Actor Studio v1 · Eye Cluster Contract v0

**Status:** CANDIDATE AUTHORING CONTRACT  
**Owner:** ToolBox Eye Actor Studio candidate  
**Does not supersede:** EyeRig v6, EyeOval v1, BrowRig v2, EyeRig Batch profiles.

## Why

Current EyeRig v6 is explicitly pair-based:
- it creates `[L, R]`;
- `eyeFrame()` returns left/right;
- asymmetric emote arrays address left/right.

Current EyeOval v1 proves safe group scale/tilt without a fork, but applies one W/H/D to both eyes.

Studio v1 needs:
- unequal eyes;
- arbitrary 3D orientation;
- 1–4 eyes.

Therefore the Studio needs a **companion Eye Cluster authoring model** while preserving EyeRig v6 as the canonical pair donor.

## Eye Cluster

```text
Host
└── EyeCluster
    ├── EyeSlot[0]
    ├── EyeSlot[1]
    ├── EyeSlot[2] optional
    └── EyeSlot[3] optional
```

Valid eye count:
**1–4** in Studio v1.

## Eye Slot fields

Each slot independently owns candidate authoring metadata:

- `id`
- `enabled`
- `position: [x,y,z]`
- `quaternion: [x,y,z,w]`
- readable `eulerDeg: [pitch,yaw,roll]`
- `size` overall
- `shape: [width,height,depth]`
- `role`: primary / secondary / custom
- optional material override
- optional local acting overrides

Recommended local axes:
- +X eye right
- +Y eye up
- +Z eye forward

## Transform composition

`Host × EyeSlot(position, quaternion, size/shape) × EyeActorLocal`

EyeActorLocal includes:
- pupil gaze;
- lid closure;
- lid slant;
- blink;
- local expression.

## Size and shape

Do not conflate:
- overall size;
- oval shape.

Example:

```text
eye A: size 1.00, shape [1.0,1.0,1.0]
eye B: size 1.35, shape [0.9,1.25,0.85]
```

Existing `eyeoval.v1.js` remains the symmetric pair donor.

Studio v1's Eye Cluster adapter may apply equivalent transforms independently to each Eye Slot after build, but must not fork donor behavior semantics.

## Orientation

Each eye has independent:
- Pitch
- Yaw
- Roll

Author modes:
- same;
- mirrored;
- independent;
- copy;
- reset.

EyeRig v6 `splay` remains a convenience/legacy mirrored-Yaw control for the donor pair.

It is not the general Eye Cluster orientation field.

## Acting scope

For 3–4 eyes every operation must state its scope:

- all eyes;
- selected eye;
- primary pair;
- custom selection.

Examples:
- blink all;
- blink selected;
- aim with one primary eye;
- secondary eye remains wide;
- skeptical pose on primary pair only.

Do not make hidden assumptions that index 0/1 are always the whole face.

## Blink policy

Candidate cluster policies:
- linked;
- staggered;
- independent.

Studio v1 only needs to prove:
- linked all;
- selected-eye manual blink.

Do not overbuild a random four-eye life system in the first slice.

## Gaze policy

Candidate:
- linked target;
- selected-eye target;
- custom target per eye.

First proof:
- linked all;
- selected one-eye aim.

## Brow boundary

BrowRig v2 is pair-based.

Studio v1 should support:
- brows on the primary pair;
- `UNSUPPORTED` for automatic 3/4-eye brow generation.

No guessed spider/alien brow layout.

## Lid boundary

Clay Lid geometry is per Eye Slot.

Every slot with lids must preserve:
- upper/lower motion;
- slant;
- hard inner rim;
- positive pupil clearance;
- non-uniform eye shape;
- arbitrary quaternion.

## Emanata

Eye-relative emanata target:
- selected eye;
- primary pair;
- cluster centroid.

## Candidate export

Keep cluster metadata companion/local until a second real host proves reuse.

Example:

```json
{
  "schema": "kfb.eye-cluster/0.1-candidate",
  "count": 3,
  "eyes": [
    {
      "id": "eye-0",
      "role": "primary",
      "position": [-0.3,0,0.6],
      "quaternion": [0,0,0,1],
      "eulerDeg": [0,0,0],
      "size": 1,
      "shape": [1,1,1]
    },
    {
      "id": "eye-1",
      "role": "primary",
      "position": [0.3,0,0.6],
      "quaternion": [0,0,0,1],
      "eulerDeg": [0,0,0],
      "size": 1.2,
      "shape": [0.9,1.15,0.9]
    },
    {
      "id": "eye-2",
      "role": "secondary",
      "position": [0,0.42,0.54],
      "quaternion": [0,0,0,1],
      "eulerDeg": [-8,0,0],
      "size": 0.65,
      "shape": [1,1,1]
    }
  ]
}
```

## Required fixtures

1. equal frontal pair;
2. unequal asymmetric pair;
3. frog-side pair;
4. single eye;
5. three eyes;
6. four eyes.

These are Studio fixtures, not character canon.

## Promotion rule

Do not modify the global shared EyeRig protocol/profile schema merely because the Studio can represent Eye Clusters.

Promote only after at least one real nonstandard host proves the companion model useful.
