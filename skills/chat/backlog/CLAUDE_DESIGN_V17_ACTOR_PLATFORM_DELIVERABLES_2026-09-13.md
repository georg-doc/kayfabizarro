# Claude Design Deliverables · FrankenStein Studio v17 Actor Platform

Status: DECISION / DESIGN-DELIVERY BRIEF
Date: 2026-09-13
Owner: Georg / KFB
Consumers: Travel, Combat Arena, Stunt Race, Cube Pet Podcast / Presenter Lab, Museum / Infinite Canvas, Wissens-Pilli / DocCheck Microlearning, Animation Lab, Rigging Toolbox

## 0. Purpose

FrankenStein Studio v17 must not deliver another app-specific FrizzleBob. It should deliver one reusable, machine-readable KFB Actor Platform contract that can be consumed by several apps without rebuilding face, mouth, talk, viseme, eye, nose, brow, look or basic behavior ownership.

The current v17 WIP demonstrates the intended direction: the same `graft-driver` actor already carries look/material zones, eye anchors, mouth parameters and viseme map, brow/nose modules, pose/seat/card-rider fields, animation rig metadata and semantic behavior bundles including `talk`.

This is WIP evidence, not final acceptance. v17 remains unpromoted until source pin + exports + browser/visual QA + Georg approval exist.

## 1. Hard architecture decision

**One FrizzleBob Actor Contract, many roles.**

Shared actor identity owns:
- graft/body/head identity;
- face ownership;
- eye rig / lids / pupils / gaze;
- mouth geometry and rest/talk states;
- viseme vocabulary;
- brow / nose / moustache or equivalent face modules;
- material/look zones and finish values;
- donor-eye removal / source-geometry cleanup;
- semantic emotes and behavior bundle vocabulary;
- animation-rig metadata needed by downstream consumers.

App/role-specific profiles own:
- Driver / Presenter / Combat / Museum / Surf role;
- static/base pose;
- vehicle/seat/card fit;
- runtime acting channels;
- locomotion or consumer movement;
- camera/content interaction;
- project-specific audio/TTS voice choice;
- combat/projectile/damage/world-facing semantics.

No consumer may fork face/mouth/eyes merely because it needs a different role.

## 2. Immediate v17 goal

Produce a stable `graft-driver` actor configuration that can serve both:

1. FrizzleBob Driver in Travel / Combat / Stunt vehicle contexts;
2. FrizzleBob Presenter / Podcast host using the same visible actor and face system.

The Presenter role may use different poses, framing and acting, but must not create a second FrizzleBob face or mouth implementation.

## 3. Mouth / Talk / future Lip-Sync contract

### MVP now

Implement/verify a simple semantic talk gate with modifiers:

- `talk.on = true|false`;
- mouth enters talking state while on;
- talking motion varies enough to read as speech without claiming phoneme-perfect lip-sync;
- talking respects current emote/rest state;
- talk off returns cleanly to the correct rest mouth;
- no permanent mouth jitter when silent.

Recommended semantic inputs:
- `talk` on/off;
- optional `energy` / emphasis;
- optional `rate`;
- optional `emotion` / rest-state influence.

### Viseme readiness

Keep stable abstract viseme IDs rather than app-specific texture names. The current WIP vocabulary already points in the right direction: `closed`, `open`, `wide`, `round`, `smile` mapped to concrete mouth shapes.

Deliver:
- canonical viseme IDs;
- mapping from IDs to current mouth-set shapes;
- fallback behavior if a mouth set lacks a requested viseme;
- explicit neutral/rest mapping per emote;
- API seam that later accepts timestamped viseme events without replacing the mouth owner.

Future lip-sync should therefore be an input stream into the same mouth owner, not a second implementation.

## 4. Face module deliverables

For FrizzleBob deliver one accepted machine-readable face block covering at least:

- eye anchor / pupil / lid parameters;
- gaze neutral and safe bounds;
- blink settings;
- emote vocabulary;
- mouth position/scale/wrap/lift/rotation and mouth-set ID;
- viseme map;
- brow module and parameters;
- nose module and parameters;
- moustache if active;
- source/donor face pieces that are hidden, retained or replaced.

The temporary CapsuleCarl-style dangle nose on FrizzleBob is a **DEMO / EXPERIMENTAL module use**, not automatically canonical FrizzleBob design. It is useful because it proves that a face module can be mounted across actors.

## 5. Actor Profile separation

Please export separate composable artifacts rather than one giant consumer-specific JSON.

### A · Actor Identity / Look

Suggested artifact:

`FRIZZLEBOB_ACTOR_PROFILE.v1.json`

Contains:
- actor ID / source pins;
- graft/head/face configuration;
- material zones and finishes;
- eyes / brows / nose / mouth / donor-eye state;
- wordmark / visible identity details;
- semantic emote vocabulary;
- talk/viseme capability declaration.

### B · Role Profile

Examples:

`FRIZZLEBOB_ROLE_DRIVER.v1.json`
`FRIZZLEBOB_ROLE_PRESENTER.v1.json`
`FRIZZLEBOB_ROLE_COMBAT.v1.json`

Contains only role-specific defaults such as base pose, acting preset, held-prop policy, framing hints and enabled behavior bundles.

### C · Vehicle / Surface Fit

Examples:

`FRIZZLEBOB_FIT_BATH.v1.json`
`FRIZZLEBOB_FIT_PAPER_PLANE.v1.json`
`FRIZZLEBOB_FIT_CARD_SURF.v1.json`

Contains measured local placement/seat/contact/grip/trail-anchor information. It must not own Travel/Combat/Stunt world movement.

## 6. Canonical actor loader / mount seam

Deliver a single documented mount/loader seam so consumers do not manually reconstruct the actor.

Conceptually:

`load actor profile -> construct one actor root -> attach face owners -> attach optional role -> expose runtime handles`

Required runtime handles should be explicit and minimal, e.g.:
- `object3D/root`;
- `update(dt)`;
- `setEmote(id)`;
- `setTalk(on, modifiers?)`;
- `setGaze(target|semanticTarget)`;
- `play/trigger behavior`;
- optional viseme input seam;
- `dispose()`.

Do not expose multiple competing eye/mouth/mixer owners.

## 7. App-consumer matrix

### Travel

Uses:
- FrizzleBob Actor Profile;
- Driver role;
- Bath / Paper Plane / Card Surf fit;
- Drive/Flight acting adapter.

Travel remains movement/camera/world owner.

### Combat Arena

Uses:
- same Actor Profile;
- Driver or Combat role;
- Arena-specific surface/world transform and aim/combat adapters.

Combat remains combat/projectile/damage/world-facing owner.

### Stunt Race

Uses:
- same Actor Profile;
- vehicle fits / seat / drive acting.

Race remains vehicle physics/world movement owner.

### Cube Pet Podcast / Presenter Lab

Goal: replace any need for a separate FrizzleBob implementation with the same Graft Actor when the full FrizzleBob host is desired.

Uses:
- same Actor Profile;
- Presenter role;
- talk/emote/gaze API;
- existing Podcast persona/voice/transcript/research systems as donors.

Do not replace the Cube-Pet presenter stack globally. Cube pets remain valid actors. The requirement is that FrizzleBob Graft can plug into the same presenter/podcast semantics.

### Museum / Infinite Canvas

Uses:
- Presenter/Guide role;
- talk/emote/gaze;
- optional Combat role switch in explicit game mode.

### Wissens-Pilli / DocCheck Microlearning

Wissens-Pilli should follow the same platform pattern with **CapsuleCarl as its own actor profile**.

Future product direction includes DocCheck CME / medical-learning content presented in podcast-like or presenter-led form.

Reuse:
- common actor/profile schema;
- talk/viseme API;
- semantic emote/gaze vocabulary;
- Presenter/Podcast runtime patterns.

Do **not** copy FrizzleBob coordinates or geometry measurements into CapsuleCarl. Shared contract, separate measurements/profile.

## 8. Animation Lab handoff

Animation Lab should consume the actor, not rebuild it.

Deliver enough metadata for Animation Lab to:
- enumerate rig / clips;
- play current GLB clips;
- layer procedural/body acting;
- drive semantic behaviors;
- test talk while clips are active;
- later author Surf, Swim, Driver, Presenter and Combat acting profiles.

Load/observe `skills/kfb-cartoon-animation_v2.md` for motion choreography unless superseded.

## 9. Rigging Toolbox handoff

Rigging/Vehicle Lab should consume the same actor profile and export only measured fit/configuration:
- scale;
- local offset;
- yaw/orientation;
- seat/surface lift;
- hand/grip targets;
- foot/contact targets;
- optional presentation anchors such as trail L/R;
- source asset/revision.

It must not fork Actor Look or face ownership.

## 10. Required v17 deliverables

Please deliver a self-contained handoff package containing:

1. `START_HERE.md`
   - exact v17 source path/revision;
   - read order;
   - current status;
   - owner boundaries.

2. `CHANGELOG.md`
   - additive v16 -> v17 changes;
   - no rewritten history.

3. `ACTOR_CONTRACT.md`
   - one actor / face / mouth / eyes / mixer ownership;
   - runtime API / loader contract.

4. `FRIZZLEBOB_ACTOR_PROFILE.v1.json`
   - Georg-approved production profile when final.
   - Until then label WIP exports explicitly `WIP`, never canonical.

5. Role profiles
   - at minimum Driver and Presenter.

6. Mouth/Talk/Viseme specification
   - current talk behavior;
   - stable viseme vocabulary;
   - future timestamped-viseme seam;
   - fallback behavior.

7. Face-module inventory
   - eye/brow/nose/mouth/moustache modules;
   - their owner and lifecycle;
   - temporary/demo modules clearly marked.

8. `MODULES.json`
   - module path;
   - responsibility;
   - dependencies;
   - owner;
   - status CURRENT/WIP/LEGACY;
   - consumers.

9. `TEST_RESULTS.md`
   Separate evidence classes:
   - source/static checks;
   - numerical/round-trip checks;
   - real browser/render checks;
   - Georg visual acceptance.

10. Captures
   - front / 3-quarter / rear look;
   - neutral + talk-on + talk-off;
   - at least two emotes;
   - one animation clip with talk active;
   - one Driver pose;
   - one Presenter framing.

11. Round-trip proof
   - load profile -> export unchanged -> semantic diff empty, except allowed version/provenance fields.

12. Consumer handoff notes
   - Travel;
   - Combat;
   - Stunt;
   - Presenter/Podcast;
   - Animation Lab;
   - Rigging Toolbox;
   - Wissens-Pilli.

## 11. Acceptance gates

v17 may be proposed for promotion from WIP only when:

- one source revision is pinned;
- one Actor Profile reproduces the accepted FrizzleBob consistently;
- face/eyes/mouth do not duplicate owners;
- talk on/off visibly works and restores rest state;
- viseme seam is documented even if true lip-sync is deferred;
- Driver and Presenter roles both use the same actor identity;
- profile round-trip is safe;
- browser captures exist;
- Georg has approved the visible production look.

True audio-driven lip-sync is **DEFERRED**, not required for v17 promotion.

## 12. Do not do

- do not make Podcast own another FrizzleBob mouth/face;
- do not make Travel own FrizzleBob look literals;
- do not copy CapsuleCarl measurements into FrizzleBob or vice versa;
- do not turn role profiles into second Actor Profiles;
- do not let Animation Lab silently change actor identity while authoring motion;
- do not call v17 canonical while it is still being tuned;
- do not erase v16 history; mark supersession explicitly when promotion happens.

## 13. Return format

Return with:

- exact source revision / files changed;
- IMPLEMENTATION versus TESTED RESULT;
- WIP versus candidate-canonical artifacts;
- screenshots/captures;
- unresolved visual decisions;
- exact consumer-facing files/API;
- explicit recommendation: `PROMOTE`, `KEEP WIP`, or `BLOCKED`, with reasons.
