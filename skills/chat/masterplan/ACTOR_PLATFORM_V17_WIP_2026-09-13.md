# KFB Living Masterplan Addendum · Actor Platform v17 WIP

Status: DECISION / WIP PLATFORM DIRECTION
Date: 2026-09-13
Owner: Georg / KFB
Current production tool remains FrankenStein Studio v16 until v17 promotion gates pass.

Detailed Claude Design delivery brief:

`skills/chat/backlog/CLAUDE_DESIGN_V17_ACTOR_PLATFORM_DELIVERABLES_2026-09-13.md`

## Lead decision

KFB should converge on **one reusable actor contract per character, many role/consumer profiles**.

For FrizzleBob this means the Graft Driver is not only a vehicle-specific driver asset. The same actor identity, head/face system, eyes, mouth, talk/viseme vocabulary and semantic behaviors should be reusable in:

- Travel;
- Combat Arena;
- Stunt Race;
- Cube Pet Podcast / future Presenter-Podcast Lab;
- Museum / Infinite Canvas;
- Animation Lab;
- Rigging Toolbox.

Role-specific pose, vehicle fit, combat semantics, camera framing or presenter behavior remain separate profiles/adapters and must not fork actor identity.

## Current WIP evidence

The 2026-09-13 v17 WIP export supplied by Georg already demonstrates a machine-readable `kfb.pets/1` direction for `graft-driver` containing, among other things:

- graft/material-zone state;
- eye anchor data;
- mouth position/shape parameters;
- a compact viseme map (`closed/open/wide/round/smile` -> current mouth shapes);
- brow and nose modules;
- pose and seat fields;
- Card Rider fields;
- animation-rig metadata;
- behavior bundles including semantic `talk`;
- weapon attachment configuration.

This is evidence of the intended schema direction, not final production acceptance.

The screenshot supplied with the WIP also shows the FrizzleBob Graft running as a coherent actor inside the current Studio surface. Visible appearance remains WIP.

## Talk now, lip-sync later

MVP requirement for the shared actor platform:

- semantic `talk` on/off;
- optional lightweight rate/energy/emotion modifiers;
- visible mouth motion while talking;
- clean return to emote-appropriate rest mouth when talking stops;
- no competing mouth owner.

The actor contract should already expose stable abstract viseme IDs and a future timestamped-viseme input seam.

True audio-driven lip-sync is **DEFERRED**. Future lip-sync feeds the existing mouth owner; it does not introduce another face/mouth implementation.

## FrizzleBob Presenter / Podcast reuse

Cube Pet Podcast remains a valuable presenter-runtime donor for persona, voice timing, gaze, transcript, research, reaction and related presentation mechanics.

The platform decision is **not** to replace Cube Pets. Instead, a full FrizzleBob Graft Actor should be able to plug into the same presenter/podcast semantics through the shared actor API.

Do not build a separate Podcast FrizzleBob face, mouth or eye rig.

## Wissens-Pilli / DocCheck CME direction

Wissens-Pilli should follow the same platform pattern with CapsuleCarl as a distinct actor profile.

Product direction includes presenter-/podcast-style delivery of DocCheck medical learning and later CME content.

Shared across actors/applications:

- actor/profile schema;
- semantic emote/gaze vocabulary;
- talk/viseme API;
- Presenter/Podcast runtime patterns;
- Animation Lab motion handoff.

Not shared blindly:

- geometry-specific measurements;
- face anchors;
- mouth positions;
- body deformation values;
- visual identity.

CapsuleCarl and FrizzleBob therefore share contracts, not coordinates.

## Demo face modules

The temporary CapsuleCarl-derived dangle nose shown on FrizzleBob in the v17 WIP is classified **EXPERIMENTAL / DEMO**.

Its value is architectural: it proves face modules can be mounted across actors. It does not become canonical FrizzleBob design unless Georg explicitly approves that visual choice later.

## Profile layers

Preferred separation:

1. **Actor Profile** — persistent identity/look/face/mouth/eyes/emote/talk capability.
2. **Role Profile** — Driver, Presenter, Combat, Museum Guide etc.
3. **Pose Profile** — Bath Driver, Cockpit Driver, Card Surf, Presenter stance etc.
4. **Vehicle/Surface Fit Profile** — scale, local offset, seat/contact/grip/trail anchors.
5. **Consumer Adapter** — Travel movement, Combat aim/damage, Stunt physics, Podcast content/voice timing.

Consumer code must not become a second authoring owner for layers 1–4.

## v17 promotion gate

v17 remains WIP until at least:

- exact source revision/path is pinned;
- additive v16 -> v17 changelog exists;
- one Actor Profile reproduces the accepted FrizzleBob consistently;
- Driver and Presenter roles use the same Actor Profile;
- one eye owner, one mouth owner, one active mixer/animation owner are proven;
- talk on/off visibly works and restores rest state;
- viseme vocabulary and future timestamped input seam are documented;
- profile round-trip is safe;
- browser/render captures exist;
- Georg approves the visible production look.

Only then may the central router consider `frankenstein-studio-v17` for promotion and mark v16 as superseded/current-reference history.

## Immediate consumer sequencing

### Travel MVP1

Do not block the current Bath slice on broad v17 architecture work. Once a usable approved FrizzleBob Actor Profile is available, Travel consumes it through the smallest adapter while retaining movement/camera/world ownership.

### Presenter / Podcast Lab

After v17 profile/API stabilization, use Cube Pet Podcast recovery donors to prove the same FrizzleBob actor in a presenter/podcast context rather than building a fresh presenter actor.

### Animation Lab

Consume actor/profile state; author dynamic acting and clips downstream. Do not re-author identity/face ownership.

### Rigging Toolbox

Measure/export fit only. Do not mutate Actor Look.

### Wissens-Pilli

Use CapsuleCarl as the second actor-platform proof after its own measurements/profile are stable. Reuse presenter/talk semantics, not FrizzleBob geometry.

## Recovery note

A fresh production chat encountering v17 must read the detailed Claude Design brief above and verify actual GitHub/Design source state. Chat references to “v17” do not themselves prove current-tool status.
