# KFB Motion Presets and Event Contract

These presets preserve concrete KFB v2 starting patterns. They are presentation starting points, not universal physical constants.

## Reusable motion event contract

A reusable motion event should declare:
- id;
- family;
- meaning;
- duration;
- loop/non-loop;
- phases;
- required anchors;
- protected areas;
- event budget;
- recovery.

Useful phases:
anticipation · action · impact/contact · follow-through · recovery.

Useful event budget fields:
- maxPrimaryVfx;
- maxSecondaryVfx;
- maxTertiaryVfx;
- maxSoundWords;
- maxAudioCues;
- maxCameraActions.

Recovery should state:
- restore pose;
- restore temporary transform;
- clear VFX;
- clear audio state;
- clear camera offset;
- expected recovery window.

## powerJump starting choreography

Approximate KFB v2 starting pattern:
- 0–120 ms: squash/load, shadow widens;
- 120–310 ms: launch/stretch;
- 310–560 ms: airborne arc, secondary parts trail;
- 560–680 ms: landing preparation;
- contact around 680 ms: short hitstop, compact foot burst/dust, optional word;
- to about 860 ms: compression, follow-through, recovery.

Gameplay physics still owns the jump trajectory.

## turn180 starting choreography

Approximate:
- 0–90 ms: brake/old-direction settle;
- 90–160 ms: anticipation away from new direction;
- 160–280 ms: main turn;
- 280–430 ms: limb/accessory follow-through;
- 430–560 ms: stable new facing.

For responsive gameplay, compress timings as required while preserving the readable force chain.

## celebrate starting choreography

Approximate:
- 0–100 ms: anticipation compression;
- 100–260 ms: upward/open action;
- 260–420 ms: one main expressive accent;
- 420–700 ms: landing/pose hold;
- 700–980 ms: settle to idle.

Use one dominant accent, not stars + hearts + coins + shake simultaneously.

## impact starting choreography

Approximate:
- contact registered;
- 40–95 ms: hitstop/body reaction;
- 60–220 ms: primary/secondary burst;
- 90–620 ms: optional readable sound word;
- 160–360 ms: limited debris;
- 360–620 ms: clear secondary elements;
- 620–850 ms: recovery.

These windows are KFB presentation defaults, not a rule that every impact must use text/VFX/camera.

## Why keep explicit presets

They provide:
- stable comparison fixtures;
- common vocabulary;
- known starting timing;
- regression targets.

Do not copy their exact timings into unrelated actors/actions without visual validation.
