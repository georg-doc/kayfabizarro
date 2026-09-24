# AN-PROFILE-01 · Motion Profile Consumer Contract

Status: **CANDIDATE · additive metadata only**  
Owner: **KFB ToolBox / shared motion metadata**  
Source clip owner: **KFB Motion Library 01 / PR #197**

## One shared layer

Consumers read the existing clip catalogue plus one companion profile catalogue:

- `KFB_Motion_Library.catalog.json` — clip identity, duration, loop, root/travel and original measured fields;
- `KFB_Motion_Library.profile-catalog.v1.json` — normalized measured/derived motion metadata;
- `motion-profile-reader.v1.js` — read-only accessor. It creates no mixer and owns no movement state.

Do not fork either catalogue into consumer-local copies.

## Evidence hierarchy

1. PR #197 / Motion Library 01 supplies the 33 retargeted clips and measured catalogue facts.
2. PR #107 / KCL-M1 supplies measured KayKit stock locomotion contacts, planted intervals and reference-speed candidates.
3. PR #127 / ToolBox Motion Lab supplies actor/rig-family playback and handoff candidates.
4. AN-PROFILE-01 normalizes those facts. It does not invent missing measurements.

The older KayKit stock playback clamp/profile is exposed only under `referenceProfiles` and is explicitly **REFERENCE_ONLY**. It is not inherited by the 33 retargeted Motion Library clips.

## Unknown rule

Unknown stays unknown.

In particular:
- Rig_Large foot contact windows are not copied from Rig_Medium;
- hand contacts are not measured;
- contact/release/impact/recovery action markers are not inferred from filenames or poses;
- per-clip acceptable playback-rate windows remain unknown until measured;
- in-place clips do not receive a fake locomotion reference speed.

## ToolBox Animation Studio / Animation Lab v2

Use the profile layer to:
- show state family, gait/direction/stance tags where evidence exists;
- display measured Rig_Medium planted intervals;
- expose root/travel behavior and cycle-average reference speed for travel clips;
- compare exact KayKit stock reference profiles without applying them to different clip sources;
- keep unknown marker/rate fields visibly unknown.

The Studio remains the authoring/preview consumer. Existing ToolBox animation/mixer/actor ownership is unchanged.

Example:

```js
import {
  loadMotionProfileCatalog,
  getClipProfile,
  getPlantedIntervals
} from './motion-profile-reader.v1.js';

const profiles = await loadMotionProfileCatalog();
const clip = getClipProfile(profiles, 'kfb_locomotion_run_forward_a');
const leftPlant = getPlantedIntervals(clip, 'Rig_Medium', 'foot.l');
```

## WorldBuilder

Use the same profile layer to:
- read `rootTravel.mode` and direction;
- read measured-derived `referenceSpeed` for travel clips;
- decide whether a clip is in-place or travelling without filename inference;
- consume explicit action markers such as `endsOnTop`;
- refuse unknown action markers instead of synthesizing them.

WorldBuilder still owns world position, pathing, collision, terrain interaction, triggers and gameplay state.

Example:

```js
import {
  loadMotionProfileCatalog,
  getClipProfile,
  getReferenceSpeedMps,
  hasMeasuredActionMarker
} from './motion-profile-reader.v1.js';

const profiles = await loadMotionProfileCatalog();
const clip = getClipProfile(profiles, 'kfb_climb_to_top_a');
const speed = getReferenceSpeedMps(clip, 'Rig_Medium');
const endsOnTop = hasMeasuredActionMarker(clip, 'endsOnTop');
```

## Promotion rule

This layer is reusable metadata, not a consumer default approval.

A clip-specific playback window or semantic event becomes consumer-default only after:
1. the exact source clip is measured;
2. the exact rig/actor path is browser-proven where relevant;
3. the named human gate accepts it when visual feel matters.
