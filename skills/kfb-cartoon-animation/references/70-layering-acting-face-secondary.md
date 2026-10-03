# Layering, Acting, Face and Secondary Motion

## Performance starts with intention

Before animating, state:
- what the character perceives;
- what they want;
- what changes during the beat;
- what the audience/player should read first.

A moving character is not automatically a thinking character.

## Gameplay versus cinematic

Label authored use:
- GAMEPLAY_360
- GAMEPLAY_DIRECTIONAL
- INTERACTION_LOCKED
- CINEMATIC_SHOT

Gameplay requires:
- interruption;
- arbitrary camera exposure;
- loop/recovery;
- responsive input;
- retargetability;
- collision/contact compatibility.

Cinematic work may use shot-specific cheats and longer holds when the camera is controlled.

## Layer stack

Recommended:
1. base locomotion/body state;
2. upper-body action;
3. look/aim;
4. emotion/posture;
5. cartoon additive;
6. secondary motion;
7. contact correction;
8. facial/eye.

Do not let lower-priority expressive layers erase gameplay-critical contact or action pose.

## Gesture over locomotion

A gesture should define:
- bone mask;
- additive/override mode;
- entry/exit;
- locomotion continuity;
- root policy.

Legs should not freeze because an upper-body gesture played.

## Look and aim

Separate:
- eyes;
- head;
- chest/torso;
- full-body facing.

A useful natural ordering is often eyes → head → torso/body, but intent and style may reverse or exaggerate it.

Clamp ranges to the rig and style.

## Eyes

Eyes are not a permanent random oscillator.

Use:
- gaze target;
- saccade/lead;
- hold;
- blink;
- eyelid/brow support;
- return.

Eye motion should reinforce thought/attention.

## Blink

Blink frequency should respond to:
- cut/transition;
- thought change;
- stress/effort;
- dialogue phrasing;
- idle rhythm.

Avoid metronomic blinking.

## Facial animation

Choose fidelity appropriate to role:
- background NPC;
- gameplay speaking character;
- hero;
- cinematic close-up.

Do not impose hero facial complexity on every actor.

Possible channels:
- jaw/mouth;
- phoneme/viseme;
- brows;
- lids;
- cheek;
- gaze;
- head accent.

## Body language

Emotion is a whole-body posture problem.

Examples:
neutral:
- stable weight;
- quiet openness;
- minimal unnecessary motion.

happy:
- upward/open force;
- lifted gaze;
- buoyant timing.

angry:
- compressed posture;
- directional force;
- sharper timing;
- reduced softness.

These are starting grammars, not universal canned presets.

## Secondary dynamics

Ears, tails, cape, hair, loose gear and soft props:
- follow the force source;
- lag;
- overshoot;
- settle;
- respect collision/attachment where needed.

Secondary motion must not compete with the action read.

## Procedural secondary motion

Procedural springs/physics are allowed when:
- deterministic enough for the product;
- clamped;
- stable at frame-rate variation;
- reset/teleport behavior exists;
- animation intent can override them.

Do not use uncontrolled simulation as a substitute for authored acting.

## Speech

Speech punctuation may use:
- head/body lean;
- small hand accent;
- gaze change;
- brief posture change.

Do not continuously shake the character while dialogue is active.
