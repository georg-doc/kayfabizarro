# KFB Town · Prop Toss + Brick Fish interaction pattern

Status: **DESIGN DIRECTION / FUTURE SHARED INTERACTION · NOT IMPLEMENTED**  
Date: 2026-09-27  
Owner: **KFB Town design reference**  
Receiving runtime: existing WorldBuilder / Town / game host only  
Motion source: existing KayKit animation sources + KFB Motion Library; Animation Studio is a consumer/authoring surface, not a second motion store  
Asset source: Asset Librarian / KFB-owned Brick Fish source  
No Stage or human gate is created by this note.

## 1 · Core idea

KFB characters may casually throw physical props at one another as a recurring world interaction.

The useful structural reference is the recurring brick gag associated with *Krazy Kat*: a very simple physical action becomes a recognizable relationship beat. KFB does not copy that staging or visual language. The reusable principle is:

> one prop + one readable throw + one readable impact + one reaction + possible retaliation

This should work for:
- NPC → NPC;
- NPC → player;
- player → NPC;
- authored scene → actor;
- later owner-approved minigames.

Default Town meaning is **social slapstick, not combat**:
- no HP damage by default;
- no automatic combat aggro;
- no permanent stun;
- no transfer of Combat ownership into Town;
- retaliation is a social/cartoon beat, not a hidden combat state machine.

## 2 · Canonical default prop: Brick Fish / Red Herring

Georg's preferred KFB default is the **Brick Fish**.

Player-facing naming direction: **Brick Fish**.  
Semantic joke/lore layer: **Red Herring**.

Design:
- long, brick-like red body;
- handmade clay / KFB claymation surface;
- slightly rounded, imperfect brick edges rather than a perfect cuboid;
- two cartoon eyes;
- blunt/bulging fish mouth;
- visible tail fin;
- dorsal fin;
- small side fins only if they do not destroy the brick silhouette;
- fish anatomy remains readable, but the primary silhouette still reads as a thrown brick;
- deliberately red;
- compact enough to sit in one hand and read clearly in flight.

Narrative/game function:
- recurring KFB social projectile;
- visual running gag;
- literal **red herring**;
- Adventure-game / Monkey-Island-spirit MacGuffin;
- can appear important while being mechanically trivial;
- can be passed, stolen, found, thrown, returned, displayed or used as a false clue;
- may become a small recurring inventory/world object without becoming a quest-system owner.

The joke should come from the object's continued physical presence and reuse, not from explanatory dialogue.

### Brick Fish impact language

Preferred clay/cartoon variants:

**BONK**
- Brick Fish keeps its basic identity;
- squash at contact;
- target recoil;
- fish bends/compresses;
- drops to the ground and optionally flops once.

**SPLAT**
- fish compresses into a soft brick/fish-shaped clay patch;
- short smear/decal;
- then peels/reforms or despawns back to pool.

**POP**
- 3–6 rounded clay chunks;
- no glass shards;
- no generic particle fountain;
- deterministic seed;
- re-form/despawn after the beat.

First implementation should not require real mesh fracture or boolean destruction. Use squash/stretch, pooled fragments and a short-lived clay splat.

Eyes can be simple authored cartoon eyes for the first asset. EyeRig integration is optional later and must not block the prop.

## 3 · Encounter grammar

This extends Town's existing encounter-beat principle.

```text
notice
→ choose_prop
→ choose_throw
→ ready
→ windup / optional approach
→ release
→ flight
→ impact | miss
→ reaction
→ optional_retaliation
→ recovery
```

System separation:

```text
interaction orchestrator
  emits semantic beats

animation layer
  chooses and plays a compatible throw / reaction motion

prop layer
  owns held object → release → flight → impact/recovery

VFX layer
  owns clay/cartoon impact presentation

audio layer
  owns one concise event cue

dialogue layer
  may add a line, but is not required

social/AI layer
  decides whether retaliation is appropriate
```

Do not build a prop × actor × clip matrix.

## 4 · Throw animation is a palette, not one clip

Throw selection should depend on:
- target distance;
- free space;
- actor rig/capabilities;
- whether the actor is already moving;
- prop mass class;
- social intent;
- required readability;
- whether root motion is safe in the current world state.

The semantic role should be something like:

```text
throw.quick
throw.short
throw.medium
throw.long
throw.runup
throw.exaggerated
```

The receiving world asks for a role; the motion adapter resolves the best compatible source.

### Verified current sources

#### KFB Motion Library v2 · PR #213

Current v2 source:
- PR: https://github.com/georg-doc/kayfabizarro/pull/213
- branch source: `chat/kfb-motion-library-v2b-2026-09-25`
- catalogue: `media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json`
- **179 clips** on Rig_Medium and Rig_Large.

Verified useful throw candidates:

| role candidate | clip | measured notes |
|---|---|---|
| deliberate medium/long throw | `kfb_action_baseball_pitching_a` | 4.733 s, non-loop, travel classified, source `Baseball Pitching.fbx` |
| stronger long throw / approach | `kfb_action_quarterback_pass_a` | 7.7 s, non-loop, travel; 0.788 m net Medium travel / 2.022 m Large |
| stylised magic/exaggerated toss | `kfb_action_fireball_a` | 3.4 s, in-place |
| stock utility throw | KayKit `General/Throw` | already proven in current repository references |

Important: catalogue net travel is **not** enough to define throw distance. A baseball clip can visibly step/shift and still have small net travel. Actual throw classification needs the release frame, hand velocity/direction, approach phase and the prop trajectory chosen by gameplay.

Motion Library v2 remains the motion source. Do not copy these clips into a second WorldBuilder library.

### Distance-aware selection direction

Initial mapping direction, to be measured rather than hard-coded by metres:

```text
close
  → quick stock Throw / short toss

medium
  → Baseball Pitching or another compact authored throw

far
  → Quarterback Pass / run-up-capable throw

special/comic
  → Fireball-like exaggerated body action with Brick Fish trajectory
```

The same Brick Fish can therefore read differently depending on distance and situation.

## 5 · Release marker is the missing contract

A throw clip alone is not enough. Every throw recipe needs a measured release seam.

Proposed companion data:

```ts
type ThrowMotionProfile = {
  motionId: string
  rigs: string[]
  style: 'quick' | 'short' | 'medium' | 'long' | 'runup' | 'exaggerated'
  rootMotion: 'in-place' | 'travel'
  releaseTimeSec: number
  releaseHand: 'left' | 'right'
  releaseAnchor: string
  approachStartSec?: number
  approachEndSec?: number
  recoveryTimeSec?: number
  preferredDistanceClass?: 'close' | 'medium' | 'far'
}
```

These markers must be measured in ToolBox/Animation work. Do not infer release from the filename.

At `releaseTimeSec`:
1. detach prop from the actor's hand;
2. hand off world transform to the projectile/flight layer;
3. continue actor follow-through;
4. flight layer owns the prop until impact/recovery.

## 6 · Root motion handshake

Long throws may include steps, approach or body travel.

The world locomotion owner must remain single.

During a root-motion throw:
- interaction requests a temporary authored-action reservation;
- the locomotion owner approves/blocks it based on current state;
- the throw animation may advance the actor only within that reservation;
- terrain grounding remains world-owned;
- after the action, locomotion resumes from the final legal grounded transform;
- projectile flight is independent after release.

No second movement writer may be introduced by Animation Studio or the throw mechanic.

## 7 · Flight: authored cartoon ballistics

The projectile does not need full rigid-body physics.

Inputs:
- measured release transform;
- target semantic anchor;
- selected flight profile;
- distance;
- seed;
- optional miss offset.

Useful profiles:
- `lob`;
- `flat`;
- `spin`;
- `wobble`;
- `heavy_arc`.

Default Brick Fish flight should have a slight controlled wobble/spin so the fish silhouette remains readable.

Target anchors:
- head — default Brick Fish gag;
- torso — safer fallback;
- body center — generic prop fallback.

Never aim at the raw object origin.

## 8 · Hit, miss and reaction

Impact event:

```text
projectile reaches semantic contact
→ very short hit stop
→ target reaction
→ prop deformation / VFX
→ optional sound
→ recovery
```

Reaction motion should also be capability-based:
- small flinch;
- `Hit_A` / `Hit_B` where compatible;
- bigger knockback only for explicitly larger slapstick events;
- duck/dodge/miss later when a proven clip exists.

A miss is a valid social beat:
- fish sails past the head;
- hits ground or permitted scenery;
- target turns/reacts;
- attacker may look embarrassed;
- target may retaliate.

## 9 · Retaliation / revenge

After an eligible hit, emit:

`social.prop_toss.retaliation_available`

This is intentionally ephemeral.

Possible responses:
- target grabs the same Brick Fish after it drops/reforms;
- target uses another nearby tossable prop;
- player receives a short contextual opportunity to throw back;
- NPC decides to ignore it, taunt, laugh or retaliate.

No permanent revenge meter is required.

## 10 · Generic tossable prop profile

Brick Fish is the default, not the only projectile.

Proposed metadata:

```ts
type TossablePropProfile = {
  assetId: string
  hand: 'left' | 'right' | 'either'
  gripProfile?: string
  massClass: 'light' | 'medium' | 'heavy'
  flightProfile: 'lob' | 'flat' | 'spin' | 'wobble' | 'heavy_arc'
  targetZone: 'head' | 'torso' | 'body'
  impactProfile: 'soft_splat' | 'clay_burst' | 'rubber_bounce' | 'rigid_bonk' | 'fragile_pop'
  recoveryProfile: 'despawn' | 'drop' | 'reform' | 'return_to_pool'
}
```

This metadata should extend existing asset truth / candidate handoff. Do not create a second prop registry.

## 11 · WorldBuilder animation requirement

Georg also wants the richer jump family from the existing animation work available cleanly in WorldBuilder.

This is **source reuse**, not a copy from a UI.

### Existing KayKit stock jump family already proven

Current repository evidence for Rig_Medium includes:
- `Jump_Start`;
- `Jump_Idle`;
- `Jump_Land`;
- `Jump_Full_Short`;
- `Jump_Full_Long`.

The current Travel/WorldBuilder `movement-lab.js` already knows how to discover:
- jump start;
- airborne;
- landing;
- a full jump candidate including `Jump_Full_Short` / `Jump_Full_Long`.

### Motion Library v2 adds further jump choices

Verified v2:
- `kfb_locomotion_jump_a`;
- `kfb_locomotion_running_jump_a`;
- `kfb_locomotion_joyful_jump_a`;
- `kfb_locomotion_unarmed_jump_a`;
- `kfb_locomotion_jumping_up_a`.

Notably:
- `kfb_locomotion_running_jump_a` is measured as travelling about **3.03 m on Rig_Medium** and **7.779 m on Rig_Large** per cycle;
- `kfb_locomotion_jump_a` is a 2.2 s non-loop in-place jump;
- `kfb_locomotion_jumping_up_a` is a very short travelling jump-up accent.

WorldBuilder should consume these through semantic roles, for example:

```text
jump.short
jump.long
jump.running
jump.up
jump.joyful
jump.start
jump.air
jump.land
```

The game/world decides trajectory, collision and legal landing. The clip supplies body performance. For a full travelling clip, root-motion use must be explicit and reconciled with the world movement owner.

## 12 · Autonomy budget

NPC throws must remain occasional, not ambient spam.

Eligibility:
- both actors are socially available;
- neither is in focused dialogue, performance, quest-critical pose, vehicle state, combat, authoring mode or locomotion transition;
- valid line of sight / throw lane;
- tossable prop available;
- pair cooldown expired;
- global local-scene slapstick budget available.

Suggested world rule:
- one active toss interaction in the immediate camera neighborhood by default;
- no automatic chain beyond one retaliation unless an authored scene explicitly asks for it.

## 13 · Brick Fish asset production brief

The first asset should be a **real source object**, not a placeholder cube with fins.

Minimum deliverable:
- one KFB-owned clay Brick Fish GLB;
- hand-friendly pivot/origin;
- readable front/side silhouette;
- two simple cartoon eyes;
- mouth, tail and dorsal fin;
- red clay material compatible with current KFB clay look;
- collision proxy or simple bounds;
- tossable metadata;
- optional authored splat/decal/fragment companions only if cheaper than runtime-generated FX.

Before integration:
1. show Brick Fish source object in isolation;
2. verify dimensions/pivot/hand fit;
3. verify the actual model, not merely a loaded URL;
4. then integrate it into the throw interaction.

## 14 · What is still needed

### Needed before a real gameplay slice

1. **Pin Motion Library v2 source**
   - PR #213 is the current 179-clip source.
   - Main still exposes the older 33-clip v1 catalogue at the time of this note.
   - WorldBuilder must not independently reconstruct the v2 animations.

2. **Throw motion profiles**
   - measure release frame/hand;
   - identify approach section;
   - identify recovery;
   - assign distance/style roles.

3. **Brick Fish source asset**
   - model/material/pivot;
   - tossable metadata;
   - one clay impact preset.

4. **World interaction adapter**
   - actor capability query;
   - temporary authored-action reservation;
   - hand attach/detach;
   - deterministic flight;
   - semantic target anchor;
   - impact/reaction/recovery.

5. **WorldBuilder role map**
   - expose stock short/long jump;
   - expose v2 jump variants;
   - expose throw roles;
   - keep movement/collision owner unchanged.

6. **Technical tests**
   - no prop remains stuck to hand after release;
   - one projectile owner at a time;
   - actor recovers to legal grounded state;
   - miss/hit deterministic under same seed;
   - no permanent VFX/decal leaks;
   - no duplicate AnimationMixer / movement writer;
   - repeat throw after recovery works.

### Not required for first slice
- full rigid-body physics;
- mesh fracture;
- relationship score system;
- inventory redesign;
- combat integration;
- new keyboard owner;
- separate Animation Studio runtime;
- standalone review website.

## 15 · Recommended first productive implementation later

**BRICK-FISH-TOSS-01**

Inside the real WorldBuilder/Town receiving surface:
- two compatible actors;
- one real Brick Fish;
- one close throw;
- one long/approach throw;
- one hit;
- one miss;
- one retaliation;
- one clay impact profile;
- recovery to normal world state.

Use the real v2 motion source and existing world movement owner. Technical evidence stays internal. Human review only after the interaction is visible in the real world context.
