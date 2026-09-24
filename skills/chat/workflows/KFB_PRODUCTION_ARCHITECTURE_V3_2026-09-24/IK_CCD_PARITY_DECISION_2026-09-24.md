# KFB Production Architecture v3 · Three.js CCD IK parity decision · 2026-09-24

Status: **READY TECHNICAL A/B · DO NOT REPLACE CURRENT PUPPET YET**
Owner: ToolBox / Resident Atlas authoring
Parent: CHARACTER_RESIDENT_PRODUCTION_WORKFLOW_2026-09-24.md

## User observation

Georg reports that the upstream Three.js example
`examples/webgl_animation_skinning_ik.html`
appears more stable and less torsion/glitch-prone for some IK poses than the current KFB Resident Atlas puppet.

This is plausible from source inspection and merits a direct same-actor A/B.

## Exact upstream donor

Upstream:
- `mrdoob/three.js/examples/webgl_animation_skinning_ik.html`
- `mrdoob/three.js/examples/jsm/animation/CCDIKSolver.js`

Current Resident Atlas S7 uses Three.js **0.184.0**.
The same IK example / `CCDIKSolver` exists on the Three.js `r184` tag, so this is not a major-version mismatch.

The upstream example uses:
- `CCDIKSolver`;
- `CCDIKHelper`;
- a target bone;
- an effector bone;
- explicit chain links;
- per-link `rotationMin` / `rotationMax`;
- optional solver `iteration`;
- optional `minAngle` / `maxAngle`;
- optional per-link axis `limitation`;
- optional chain `blendFactor`;
- world-to-link-local solving;
- a tiny-angle early-out to reduce vibration.

The visible demo arm chain is ordered **distal → proximal**:
`lowerarm → upperarm`.

## Current KFB solver

Resident Atlas S7:
- `lib/rigwork.js` builds interactive hand/foot puppet handles;
- `lib/atlas.js::reachChain()` performs the current IK solve.

Current `reachChain()`:
- is a custom CCD-like iterative solver;
- rotates every configured bone toward the target;
- has no per-link joint rotation min/max;
- has no per-step min/max angle;
- has no link axis limitation;
- has no blend factor;
- does not preserve explicit initial-chain quaternions for blending;
- runs many iterations (Puppet currently calls 18; other Atlas helpers can call 40);
- records the resulting bone transforms as Studio corrections.

Current hand chain construction in `rigwork.js::chainOf()` unshifts parents, producing a typical order like:
`upperarm → lowerarm → wrist`.

`reachChain()` then iterates that order directly.

This differs from the upstream example's distal-first CCD ordering.

## Why this can explain current torsion/glitch

The current KFB solver has more unconstrained rotational freedom:
- every chain link may rotate on arbitrary axes;
- repeated iterations can accumulate a visually bad twist while still reducing target error;
- the solver has no anatomical rotation envelope;
- proximal-first iteration can move the entire downstream chain before the distal joints get their correction;
- target residual alone does not score whether the pose looks anatomically sane.

This is the same general failure class already seen in the Orc drummer:
a numerically better contact can still produce a worse arm.

This does **not** prove CCDIKSolver is universally superior.
It does prove that the upstream constraint model should be tested before we spend more time repairing the custom solver.

## Integration caveat

Three.js `CCDIKSolver` expects its target and effector as indices in the `SkinnedMesh.skeleton.bones` array.

KayKit source rigs do not generally ship dedicated IK target bones.

For the A/B proof:
- clone the actor;
- add a **non-weighted helper target Bone** or a thin adapter that presents the TransformControls target as a solver target;
- do not modify source GLB files;
- do not add skin weights;
- do not make the helper target part of exported actor identity.

If exact upstream use becomes awkward solely because of target-bone plumbing, a thin KFB adapter may reuse the upstream solver algorithm/API semantics while accepting an Object3D target. That adapter must remain source-attributed and behavior-parity tested.

## IK-CCDIK-PARITY-01 · required A/B

Use the same real source actor and the same targets.

Preferred fixtures:

### Fixture A · Rig_Medium arm
Use a current Rig_Medium resident with a normal arm chain.

Test:
- hand to reachable targets;
- target across torso;
- target high/low;
- target just outside reach;
- smooth target drag path.

### Fixture B · Rig_Large Orc Brute
Use Orc Brute because the drummer exposes exactly the torsion/contact problem.

Test:
- hand/stick contact around the Wardrum;
- several target points around one strike arc;
- one deliberately unreachable target.

### Optional Fixture C · foot / planted leg
Only if the first two are green.
Compare current foot pinning behavior under hip movement.

## Three solver lanes

Render all three side-by-side on the same fixture:

### A · CURRENT KFB
Current `reachChain()`, unchanged.

### B · THREE CCD RAW
Upstream `CCDIKSolver` with the same chain and no extra anatomical constraints beyond required setup.

Purpose:
separate solver/order behavior from joint-limit behavior.

### C · THREE CCD CONSTRAINED
Same upstream solver with:
- explicit distal→proximal links;
- per-link rotation envelopes;
- conservative `maxAngle` per iteration;
- small fixed iteration count;
- optional blend factor if useful.

Do not invent extreme constraints solely to make C win.
Start from bind/local axes and source/known action ranges.

## Evidence to record

For each target sample:
- effector residual distance;
- per-bone local quaternion / Euler delta from base;
- max per-step angular change;
- sudden flip count between adjacent target samples;
- any visible elbow/wrist inversion;
- mesh/prop penetration notes;
- solve iteration count.

Human review matters more than the numeric residual.

The direct review must show:
- source actor;
- A/B/C simultaneously or toggleable without reload;
- target marker;
- skeleton/helper lines;
- same camera;
- same start pose;
- current selected target preset.

## Acceptance

Promote upstream CCDIK semantics only if it is visibly at least as controllable and materially reduces torsion/flip/glitch behavior on the same KFB actors.

Possible outcomes:

### PASS CCD
Replace only the IK solve inside the existing Puppet input layer.
Keep:
- current handle UI;
- shared edit-layer TransformControls;
- Studio Patch recording;
- foot-pin/product behavior where still valid.

### HYBRID
Use CCD for arms/hands, keep current logic for another chain if it is demonstrably better there.

### NO GAIN
Keep current solver and carry over only proven useful constraints/order fixes.

Do not rebuild the Resident Atlas UI around the Three.js demo.

## Product rule

The Three.js example is a **solver donor**, not a new pose editor.

The current KFB authoring ownership remains:
`Resident Atlas / ToolBox Puppet + shared edit-layer + Studio patches`.

Exactly one next gate:
**IK-CCDIK-PARITY-01 direct real-source A/B on Rig_Medium + Orc Brute.**
