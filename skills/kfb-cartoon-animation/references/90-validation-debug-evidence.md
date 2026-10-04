# Validation, Debug and Evidence

## No claim without evidence

A motion fix is not proven by code or a Blender viewport alone.

Choose evidence appropriate to the changed thing:
- fixed-camera before/after;
- runtime playback;
- contact overlay;
- measured duration/speed;
- exported clip inspection;
- browser/game state log;
- screenshot/video;
- deterministic test.

## Neutral fixture first

Use the smallest representative host that isolates the animation problem.

Do not use a large consumer/world as the first diagnostic surface if a neutral fixture already exists.

## Debug overlay

Useful fields:
- actor/rig;
- current semantic state;
- presentation clip;
- playback rate;
- previous/next state;
- transition/fade;
- foot/contact phase;
- root/hips;
- actual speed;
- local forward/side speed;
- grounded;
- vertical velocity;
- desired facing/turn;
- travel mode;
- active additive layers;
- IK/warp targets;
- device-normalized intent;
- console/runtime errors.

Hide diagnostics for ordinary human visual review unless the decision requires them.

## Locomotion matrix

Test at minimum:
- idle → walk;
- walk → jog;
- jog → run.easy where used;
- run.easy → run;
- run → sprint;
- reverse transitions;
- release-to-stop;
- 90/180 turn;
- backward;
- strafe left/right;
- jump idle;
- jump moving;
- land + immediate re-input.

If a state is unavailable, record HOLD/MISSING rather than pretending it passed.

## Device matrix

Where supported:
- keyboard WASD;
- Shift/sprint;
- Space/jump;
- mouse/pointer look;
- wheel/trackpad mapping;
- analog gamepad;
- touch/pointer.

## Visual failure taxonomy

### Foot slide
Check:
clip natural speed → playback range → root/in-place policy → phase/contact → controller speed → stride correction → IK.

### Transition pop
Check:
pose compatibility → phase → fade → inertialization → root discontinuity → wrong skeleton/action.

### Floaty motion
Check:
weight transfer → spacing → contact duration → pelvis/root → ground truth → missing compression.

### Mechanical/cartoon-flat
Check:
line of action → timing contrast → asymmetry → overlap → overshoot → silhouette → style profile.

### Unresponsive controls
Check:
raw device mapping → acceleration → state thresholds → animation anticipation delay → blocking recovery.

### Wrong directional read
Check:
velocity/facing spaces → local axes → source direction → orientation warping range → missing authored clip.

## Runtime invariants

- one movement writer;
- one semantic motion owner per project;
- no device-specific clip table;
- no clip reset every frame;
- no unbounded playback rate;
- no raw wheel delta to speed;
- no visual transform overwriting world/collision facts;
- deterministic state for identical motion facts;
- explicit recovery/interruption.

## Evidence labels

Use literal distinctions:
- PROPOSAL
- IMPLEMENTED
- TESTED
- BROWSER/PLAYBACK PASS
- PUBLIC_VERIFIED
- HUMAN_ACCEPTED
- HOLD / UNRESOLVED

Never convert a technical PASS into human visual acceptance.

## Repair loop

Pass 1:
diagnose owner/data/clip/timing/contact.

Pass 2:
one bounded repair based on evidence.

If the same explicit gate still does not improve:
freeze candidate;
preserve evidence;
separate observation from hypothesis;
return one smaller recovery gate.
