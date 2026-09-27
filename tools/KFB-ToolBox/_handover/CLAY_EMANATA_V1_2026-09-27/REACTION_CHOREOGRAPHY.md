# KFB Resident Reaction Choreography · v0.1 proposal

Status: **PROPOSAL · SAME TOOLBOX / CLAY-EMANATA-V1 SLICE · IMPLEMENT AFTER RECOVERY-01**  
Date: 2026-09-27  
Owner: **KFB ToolBox acting authoring**  
Runtime authority: **receiving consumer / game state**  
Companion catalog: `reaction-choreography.v0.1.json`

## Purpose

Turn one semantic in-game event into one coherent Resident performance across:

1. **Animation clip / skeletal action**
2. **Body + parts-as-actors accents**
3. **EyeRig**
4. **Brows**
5. **Mouth / visemes**
6. **Ears / stalks / tails / secondary chains**
7. **Clay Emanata**
8. optional semantic VFX/SFX

The choreography layer is a **conductor, not another instrument**. It calls existing owners and aligns their timing. It does not become a second mixer, face rig, physics owner, movement controller or emotion-state machine.

```
game / consumer event
    ↓
ReactionEvent
    ↓
Reaction Choreography resolver
    ├─ existing animation / mixer owner
    ├─ existing PoseRig / subtree-layer seam
    ├─ EyeRig v6
    ├─ Face/Brow/Mouth owner
    ├─ Ear Dangle / secondary-chain owner
    ├─ Parts-as-Actors additive accents
    └─ Clay Emanata pool
    ↓
recovery to consumer-owned state
```

# 1 · Verified owner seams to reuse

## 1.1 EyeRig v6

Current 3D donor:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

Verified public controls include:

- `applyEmote(...)`;
- `blinkNow()`;
- `setKinetics(...)`;
- `setLife(...)`;
- gaze / lid / pupil channels;
- `update(dt)`.

Reaction choreography calls these controls. It does not manipulate EyeRig meshes directly.

## 1.2 Face / brows / mouth

Current Production-02 face seam:

`.../KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-27_r1/kfb-lib/face-mount.v1.js`

Verified behavior:

- “Eyes & eyebrows as actors” is already an explicit north star;
- `browReact(kind)` and `browLife(dt)` exist;
- face parts have one owner;
- active Talk / Viseme swaps the visible mouth through the existing owner;
- mouth state is therefore **not** free for reaction choreography to overwrite while speech owns it.

## 1.3 Ears / flexible secondary chains

Owner donor:

PR #214 · `tools/KFB-ToolBox/ear-rig/ear-dangle.v1.js`  
head at source audit: `19088b142c6a7e7626f27fba8e80caf6ab2437c1`

Verified semantics:

- `setPose(...)`;
- `impulse({ pitch, roll })`;
- `reset()`;
- `update(dt, env)`;
- spring target combines acted pose + animation + forces;
- intended update order is **after mixer update and after character/root movement**.

Production already uses takeoff / landing impulses.

## 1.4 Body shape is not the reaction animator

Current `body-shape.v1.js` preserves the actor's morphology while clips animate.

It explicitly updates **after mixer.update()** so fresh clip positions are correctly scaled. Therefore:

- Reaction Choreography may ask for body **motion** through clips / PoseRig / additive part actors;
- it must **not** animate emotion by changing persistent body-shape proportions;
- temporary squash/stretch belongs to the motion/acting layer, not the authoring morphology profile.

## 1.5 Animation / clip layering

Reuse the existing one-mixer animation owner.

Existing evidence:
- Production has semantic `react.cheer` / `react.neg` pads;
- Cube Pets expose `react-positive` / `react-negative`;
- bipeds resolve real own/stock clips for semantic roles;
- Resident Atlas S6 already proves **clip layering along a bone subtree** (`Sit_Chair_Idle + Waving`);
- KFB Motion Library remains the action/variant layer.

No second `AnimationMixer` is allowed for reactions.

# 2 · Core principle: one event, one performance

A semantic event produces **one ReactionCue**, not independent random decisions by each subsystem.

Example:

```
damage.light
  ↓
body: short recoil
eyes: squeeze → refocus
brows: sharp negative accent
mouth: grimace, unless Viseme currently owns mouth
ears: backward impulse + delayed settle
emanata: optional anger_spikes at high intensity only
audio: one dry hit cue
  ↓
return to the previous locomotion / acting state
```

The parts can have different timing, but they express the same event.

# 3 · ReactionEvent contract

Proposal:

```ts
type ReactionEvent = {
  id: string;
  actorId: string;
  semantic:
    | 'attention.notice'
    | 'speech.emphasis'
    | 'social.positive'
    | 'social.negative'
    | 'social.prop_hit'
    | 'surprise'
    | 'threat.alert'
    | 'damage.light'
    | 'damage.heavy'
    | 'collision.bump'
    | 'jump.takeoff'
    | 'jump.land'
    | 'pickup.reward'
    | 'success'
    | 'failure'
    | 'knockdown'
    | 'recover'
    | 'defeat';
  intensity: number;       // 0..1
  direction?: [number, number, number];
  worldPoint?: [number, number, number];
  targetId?: string;
  seed: number;
  source?: string;
  sourcePropId?: string;
  targetKind?: 'npc' | 'player' | 'other';
  relationshipTone?: 'neutral' | 'affectionate' | 'buddy-banter' | 'argument' | 'hostile';
  sceneMode?: 'ambient' | 'social-play' | 'kayfabe-performance' | 'combat';
  dramaticBeat?: 'setup' | 'escalation' | 'sell' | 'reversal' | 'reconciliation';
  harmMode?: 'social' | 'staged' | 'real';
};
```

The consumer emits the fact. Reaction Choreography decides only **how that fact is performed**.

For Town/social interactions, the consumer must also supply relationship/dramaturgy context when it matters. Choreography must **not infer hostility from physical contact alone**. A Brick Fish hit is therefore `social.prop_hit` by default, not `damage.light`. Real combat/hazard damage stays on the existing `damage.*` semantics.

A heart emitted by this reaction is **visual Emanata only**. It is not a relationship point, affection meter, reward currency or UI state.

# 4 · ReactionCue tracks

Each resolved cue can schedule the following tracks.

## 4.1 Clip track

```ts
clip: {
  role: string | null;
  layer: 'full-body' | 'upper-body' | 'head-neck' | 'arms' | 'none';
  rootPolicy: 'consumer-owned' | 'locked' | 'authored-travel';
  blendInMs: number;
  blendOutMs: number;
  maxDurationMs: number;
  resume: 'previous-base' | 'semantic-hold' | 'idle';
}
```

### Hard rule

For reactions, `rootPolicy = 'consumer-owned'` or `'locked'` by default.

A reaction clip may not drag a walking/racing/combat actor through the world merely because its source FBX contains translation. Consumer movement remains authoritative.

Only a consumer event that explicitly grants authored travel may use `authored-travel`.

## 4.2 Parts-as-Actors track

Parts are subordinate actors with their own timing, gain and recovery.

Useful semantic part actors:

```
head
torso
shoulders
arm_L / arm_R
hand_L / hand_R
legs / feet
eyes
brows
mouth
ear_L / ear_R
tail / stalk / antenna / hair / hat
held_prop
```

A part actor never invents a separate emotion. It receives the same ReactionCue and performs a local accent.

Each local accent declares:

```ts
{
  actor: 'head' | 'torso' | 'arm_L' | ...;
  delayMs: number;
  gain: number;
  durationMs: number;
  action: string;
  recoveryMs: number;
}
```

This formalizes the existing KFB overlap principle:

```
primary body action
→ limbs settle
→ ears / tails / props settle later
```

Starting-point offset already present in the KFB motion SOP:

```
body: 0 ms
ears: +35 ms
eyes: +55 ms
held/card object: +70 ms
shadow settle: +85 ms
```

These are defaults, not constants.

## 4.3 Face track

Face is a composition, not a named bitmap.

```
EyeRig:
  emote / lids / pupil / gaze
  blink accent
  kinetics gain
  life modulation

Brows:
  expression
  browReact()
  life strength / asymmetry

Mouth:
  rest / smile / grimace / O / small-open
  reaction accent only when speech does not own active Viseme
```

### Speech ownership

When Talk/Viseme is active:

- Viseme retains mouth-shape ownership;
- reaction may adjust eyes, brows, head, torso, ears and Emanata;
- a mild reaction changes the post-phrase rest mouth, not the current viseme;
- a strong interrupt such as `damage.heavy` or `knockdown` may cancel speech through the **speech owner**, then use a reaction mouth;
- Reaction Choreography must not directly hide/show competing mouth systems.

## 4.4 Secondary-chain track

Rabbit ears are a first-class reaction actor.

Do not key every ear bone manually while Ear Dangle is active.

Use:

- acted base pose for semantic posture: perk / back / droop / asymmetric;
- `impulse({pitch, roll})` for discrete events;
- DangleChain spring/forces for follow-through;
- actor profile controls response strength;
- update after mixer + body/head reaction so the ears react to the final head motion.

The same contract can later drive tails, antennae, eye stalks or flexible accessories that use the same owner seam.

## 4.5 Emanata track

Clay Emanata remains the external punctuation layer from `clay-emanata.v0.1.json`.

Default budget:

- max **1 active Emanata family / actor**;
- Emanata may start after the primary face/body read;
- low-intensity events often use **no** Emanata;
- Emanata recovery may trail the body by a short interval.

# 5 · Frame/update order

The implementation must preserve current owners.

Per frame:

```
1. consumer movement / physics writes authoritative root
2. existing AnimationMixer evaluates base motion + reaction clip layer
3. body-shape owner updates clip positions for authored morphology
4. existing pose / parts-as-actors additive reaction accents apply
5. head/body world transforms become final for this frame
6. ear / secondary-chain owner updates from final root/head movement
7. face owner updates EyeRig + brows + mouth / active Viseme
8. Emanata anchors resolve from final actor/face transforms
9. Emanata instances update
10. renderer
```

No subsystem should later overwrite an earlier authority's semantic fact.

# 6 · Clip semantics and availability

Reaction Choreography addresses clips by **semantic role**, not hard-coded filename.

Initial roles:

```
react.positive
react.negative
react.social_prop_hit
react.surprise
react.alert
react.hit.light
react.hit.heavy
react.bump
react.reward
react.victory
react.failure
react.knockdown
react.recover
react.speech_emphasis
react.jump_takeoff
react.jump_land
```

## 6.1 Current proven clip sources

### Cube Pets / legacy Pet motion

Already exposes:
- `react-positive`;
- `react-negative`;
- `celebrate`;
- `talk`;
- idle / movement roles.

### Production biped resolver

Current Production semantic pads include:
- `react.cheer` → source-backed matches such as cheer / wave / yes / victory / interact;
- `react.neg` → source-backed matches such as no / hit / death / sad / defeat / lose.

### Current KFB Motion Library

Current catalog includes useful **state/hold** clips:
- `kfb_idle_happy_a`;
- `kfb_idle_laughing_a`;
- `kfb_idle_sad_a`;
- `kfb_idle_rejected_a`;
- `kfb_idle_injured_a`;
- `kfb_idle_defeat_a`;
- `kfb_locomotion_sad_walk_a`;
- dance/action variants.

These are not automatically equivalent to short one-shot reactions. Use them as post-reaction holds or semantic state variants where appropriate.

## 6.2 Missing clip policy

A semantic role with no source-backed compatible clip is **SOURCE_REQUIRED**, not license to fabricate a hidden generic clip.

Fallback order:

1. exact actor-specific semantic clip;
2. compatible source-backed generic clip;
3. source-backed subtree clip;
4. procedural body/parts accent through existing pose/acting owner;
5. face + ears + Emanata only;
6. no reaction if even that cannot be represented safely.

This lets the choreography ship before every actor has every clip.

# 7 · Intensity ladder

Use intensity to remove noise, not merely scale everything.

## 0.00–0.30 · micro

- eyes/brows/head only;
- maybe tiny ear response;
- no full-body clip;
- normally no Emanata.

## 0.30–0.70 · readable

- short body/part accent or compatible reaction clip;
- clear face;
- ear follow-through;
- optional one Emanata family.

## 0.70–1.00 · strong

- whole-body or strong subtree reaction when a source-backed clip exists;
- strong face;
- stronger ear/appendage impulse;
- one Emanata family;
- optional one semantic SFX;
- camera action only when the consumer's event budget allows it.

Do not scale every channel linearly to maximum at intensity 1.

# 8 · Interruption / priority

Recommended priority:

```
defeat / terminal
> knockdown / damage.heavy
> damage.light / collision
> threat / surprise
> success / failure / reward
> social.prop_hit / social reactions
> speech emphasis
> ambient attention
```

Rules:

- higher-priority cue may interrupt a lower one;
- lower-priority cue waits, coalesces or is dropped;
- repeated same-family low events within a short cooldown coalesce;
- a strong new cue clears previous Emanata cleanly;
- recovery always targets the **current consumer state**, not blindly `idle`.

Example: if hit while running, recover to **running**, not a frozen idle.

# 9 · Core choreography presets

These are semantic recipes. Exact timings are tunable against the real actor.

## 9.1 attention.notice

**Use:** NPC notices player/object.

```
0 ms      head/gaze begins turn
+35 ms    ears orient / mild lag
+55 ms    eyes lock target
+80 ms    brows small lift
180–400   settle into attention hold
```

Clip:
- usually none;
- optional head/upper-body source-backed look/turn clip.

Emanata:
- none by default;
- optional `exclamation` only for a genuinely sudden notice.

## 9.2 speech.emphasis

**Use:** accented phrase / punchline / important word.

Clip:
- optional upper-body gesture / point / wave;
- current locomotion or seated base remains.

Face:
- Viseme keeps mouth;
- browReact + gaze accent;
- optional blink just before or after emphasis, not over the stressed phoneme.

Body/parts:
- small lean or head accent;
- ears/hat follow 35–80 ms late.

Emanata:
- semantic only, never automatically because speech happened.

## 9.3 social.positive

**Use:** compliment, affection, approval, friendly success.

Clip:
- `react.positive` / `react.cheer` / compatible source-backed wave/cheer;
- otherwise upward body bounce + open posture.

Face:
- soft/open eyes;
- brows relaxed/up;
- smile/rest-mouth when not speaking.

Ears:
- perk then soft overshoot.

Emanata:
- `heart` for affection;
- `sparkle` for pride/delight;
- never both by default.

## 9.3A social.prop_hit · Brick Fish / Red Herring

**Use:** a non-damaging social projectile hits an actor. The canonical Town/default prop is the **Brick Fish** from the Town Prop-Toss slice.

Source/design lock:
- Town Prop-Toss / Brick Fish: Draft PR #254 @ `79d7c18a8f07b99efe8276211a9cda527ac2f2ea`;
- source blob: `skills/chat/town/references/KFB_PROP_TOSS_BRICK_FISH_2026-09-27.md` @ `99205974c8fcc08ef41e6f66edcdd495f5e81cef`;
- current Town encounter model: semantic encounter beats drive animation and text independently;
- Town attitude remains friendly-by-default; physical slapstick does not silently become Combat.

### Canonical default · Krazy Kat inversion

For an **NPC target** with no stronger context supplied:

```text
Brick Fish contact
→ physical recoil / BONK read
→ eyes blink/squeeze
→ ears/secondary parts kick opposite contact
→ actor refocuses on thrower
→ heart Emanata pops after the impact read
→ optional retaliation window
→ recovery to prior social/locomotion state
```

The comic inversion is intentional: **the target is hit, then displays affection**. This is the default Brick Fish signature.

Timing direction:
- contact/recoil begins at 0 ms;
- blink/brow accent begins with or immediately after contact;
- heart appears **after** the physical hit is readable, roughly +80–180 ms;
- one family only: normally 1–3 `heart` instances;
- heart recovery may trail the body recovery;
- retaliation availability is emitted/owned by the social interaction layer, not by Emanata.

This heart is not a Town relationship meter. It is a transient performance mark.

### Context resolver

The same contact may be performed differently when the consumer supplies relationship/dramaturgy context.

| Context | Physical performance | Face / secondary acting | Emanata direction | Dialogue handoff |
|---|---|---|---|---|
| default / friendly | readable short recoil, quick recovery | blink → soften/refocus | **`heart` default** | none required |
| affectionate | lighter recoil, playful overshoot | smile/soft eyes | `heart`, possibly stronger | optional existing social line |
| buddy-banter | recoil + quick counter-ready pose | side-eye / grin / smug or amused read | `heart` **or** `sparkle` according to beat | existing ChatterBox/Triplet/Kayfabulation only |
| argument | sharper recoil, hold toward thrower | negative brow / glare | `anger_knot`, `anger_spikes` or no Emanata | existing argument/response content only |
| kayfabe-performance | deliberately **sell** the hit, potentially exaggerated full-body reaction | showmanship, refocus to partner/audience | `dizzy_stars`, `anger_spikes`, or `heart` for wink/reconciliation beat | existing show/buddy-banter layer |
| hostile / real harm | **do not stay on `social.prop_hit`** | consumer remaps to real damage state | governed by `damage.light/heavy` | Combat/consumer owner |

The choreography receives these meanings; it does not decide that two actors are friends, arguing, performing Kayfabe or actually fighting.

### Kayfabe / buddy-banter rule

A staged fight may use a **larger physical sell with a friendlier semantic meaning**.

Therefore:
- body magnitude does not equal hostility;
- an exaggerated knockback/sell may still be `harmMode: 'staged'`;
- real HP/damage/aggro changes require the consumer to emit a real `damage.*` event;
- a Kayfabe hit may end on a smirk, taunt, heart, sparkle or counter-ready pose depending on the dramatic beat;
- `reconciliation` may deliberately return to the Brick Fish heart signature.

### Town / dialogue boundary

Town's encounter model already separates the animation layer from the text/Triplet layer. Keep that separation here.

Reaction Choreography may expose a semantic cue such as `buddy-banter`, `argument-response` or `kayfabe-sell`, but:
- it does not generate dialogue;
- it does not create a second banter system;
- ChatterBox/Triplet/Kayfabulation remains the dialogue/content owner;
- the existing Town speech-bubble attention budget still applies;
- no line is required for the Brick Fish gag to work.

### Prop / VFX boundary

Brick Fish BONK/SPLAT/POP deformation belongs to the prop/VFX interaction owner. Reaction Choreography consumes the same contact event and performs the **target actor**.

Do not make Emanata own:
- projectile flight;
- collision truth;
- Brick Fish deformation;
- retaliation state;
- damage.

## 9.4 social.negative

**Use:** rejection, insult, disappointment.

Clip:
- `react.negative` / `react.neg`;
- optional post-state `kfb_idle_rejected_a` or `kfb_idle_sad_a`.

Face:
- gaze away;
- inner brow raise or narrow depending personality;
- downturned / grimace rest mouth.

Ears:
- droop/back with slower recovery.

Body:
- small sink/withdrawal.

Emanata:
- optional `gloom_lines`, `sweat_drop` or `tear_bead` depending semantics;
- no automatic tear for every negative event.

## 9.5 surprise

Clip:
- short recoil if source-backed;
- otherwise torso/head recoil part accent.

Face:
- wide eyes;
- high brows;
- O/open mouth if speech is not active.

Ears:
- fast perk / outward throw then spring settle.

Emanata:
- `shock_rays`.

Timing:
```
0–60 ms    face/body onset
35–120 ms  ear throw
70–220 ms  shock rays expand
220–380 ms hold/read
380–650 ms recovery
```

## 9.6 threat.alert / panic

Clip:
- source-backed alert/fear/recoil if available;
- otherwise compact crouch/withdrawal, then consumer locomotion may transition to run.

Face:
- wide eyes / target gaze;
- high/tensed brows;
- open or grimace mouth.

Ears:
- back/out, asymmetric if direction is known.

Emanata:
- `panic_sweat` for panic;
- `unease_ticks` for lower intensity.

Important: choreography does not itself choose fleeing movement.

## 9.7 damage.light

Clip:
- `react.hit.light` if source-backed;
- otherwise short directional torso/head recoil through existing pose/parts seam.

Face:
- quick squeeze / blink;
- negative brow accent;
- grimace if mouth is free.

Ears:
- impulse opposite hit direction;
- quick settle.

Emanata:
- none at low intensity;
- optional `anger_spikes` at high end.

Recovery:
- previous locomotion/combat state.

## 9.8 damage.heavy

Clip:
- compatible source-backed strong hit / knockback / fall candidate only;
- root remains consumer-owned unless the combat/physics owner explicitly grants displacement.

Face:
- squeeze → reopen/unfocused;
- strong brow;
- gasp/grimace if speech interrupted by its owner.

Ears:
- strong impulse + long settle.

Emanata:
- `dizzy_stars` after impact or `anger_spikes`, not both.

Possible follow-up state:
- `kfb_idle_injured_a` when consumer state becomes injured.

## 9.9 collision.bump

Use for non-damaging contact / environmental bump.

- very short clip/torso bounce;
- blink;
- ear impulse;
- no emotion Emanata by default;
- optional world contact VFX belongs to the consumer VFX owner.

## 9.10 jump.takeoff

Clip:
- existing jump-start owner.

Parts:
- body anticipates/squashes;
- ears lag downward/back after launch.

Face:
- gaze follows intent where appropriate.

Emanata:
- none.

Ear owner:
- current takeoff impulse seam reused.

## 9.11 jump.land

Clip:
- existing landing/locomotion owner.

Parts:
- body compression → recovery;
- ears throw forward/down and settle;
- blink may coincide just after contact.

Emanata:
- none; landing dust is world/contact VFX, not emotional Emanata.

## 9.12 pickup.reward

Clip:
- small `react.positive` / wave / interaction clip if compatible;
- otherwise hand/head/torso accent.

Face:
- eyes to object → brighten;
- smile.

Ears:
- perk.

Emanata:
- `sparkle` by default;
- `heart` only if object/relationship meaning supports affection.

## 9.13 success / victory

Clip:
- `celebrate`, `react.positive`, compatible cheer/victory;
- optional post-state `kfb_idle_happy_a` / `kfb_idle_laughing_a`.

Face:
- happy/open;
- gaze up or toward source.

Ears:
- upbeat bounce with delayed settle.

Emanata:
- one of `sparkle`, `heart`, or other consumer-approved success family.

## 9.14 failure

Clip:
- `react.negative`;
- optional `kfb_idle_rejected_a`, `kfb_idle_sad_a`, or `kfb_idle_defeat_a` as a post-state if the semantic state actually persists.

Face/body:
- sink / gaze down or away;
- mouth down/grimace.

Ears:
- droop.

Emanata:
- optional `gloom_lines` or `sweat_drop`.

## 9.15 knockdown / recover / defeat

### knockdown

High priority.
- cancel lower reaction cues;
- consumer/combat physics owns displacement;
- reaction clip may shape pose but may not independently move root;
- face/ears trail the impact;
- Emanata optional after body contact.

### recover

- return from knockdown/injured hold to current valid gameplay state;
- eyes refocus;
- brows/mouth neutralize;
- ears settle;
- clear Emanata.

### defeat

Terminal/highest-priority presentation cue.
- compatible defeat/death owner clip if source-backed;
- `kfb_idle_defeat_a` may be a hold, not the entire transition;
- clears ordinary social/ambient reactions.

# 10 · Personality / actor profiles

The same event should not make every Resident identical.

A per-actor reaction profile may tune:

```
faceGain
bodyGain
earGain
emanataGain
clipPreference
reactionDelayMs
recoveryScale
asymmetry
stoicism / exuberance
```

But it cannot change event truth.

Example:
- stoic actor: strong eye/brow read, tiny body, no Emanata at medium intensity;
- exuberant rabbit: clear body bounce + large ear follow-through + optional Emanata;
- rigid robot: minimal squash, sharper head motion, no ear channel;
- earless actor: simply reports ear channel unsupported.

Missing capability is not a reason to mount a replacement system.

# 11 · Reaction clip resolver

Resolve semantic role against **actor capability**, not filenames alone.

Proposed result:

```ts
type ResolvedReactionClip = {
  semanticRole: string;
  clipId: string | null;
  source: 'actor' | 'motion-library' | 'pet-library' | 'none';
  layer: 'full-body' | 'upper-body' | 'head-neck' | 'arms' | 'none';
  rootPolicy: 'consumer-owned' | 'locked' | 'authored-travel';
  status: 'SOURCE_BACKED' | 'FALLBACK_PROCEDURAL' | 'SOURCE_REQUIRED';
};
```

Record mappings in the actor profile/catalog. Do not use a hidden fuzzy-name match as canonical truth.

# 12 · Acceptance for Reaction Choreography proof

After RECOVERY-01, the same integrated Resident proof should demonstrate at least:

1. **surprise**  
   reaction body accent / clip + EyeRig/brows + mouth + ears + `shock_rays`;

2. **social.positive**  
   positive clip/body accent + face + ears + `heart` or `sparkle`;

3. **damage.light**  
   directional body recoil + blink/brow/mouth + ear impulse + optional high-intensity `anger_spikes`;

4. **speech.emphasis while Talk is active**  
   Viseme keeps mouth ownership while eyes/brows/head/body/ears layer correctly;

5. **jump.land**  
   existing clip/contact + body compression + ear impulse + blink, with **no emotional Emanata**.

Brick Fish / `social.prop_hit` is now part of the choreography contract, but it does **not** expand the first post-RECOVERY-01 visual proof into a new prop-production gate. Its real visual integration waits for a source-proven Brick Fish asset / `BRICK-FISH-TOSS-01`. Contract-level checks must already verify the default NPC-heart mapping and context overrides.

For each:
- trigger the same cue repeatedly;
- interrupt with one higher-priority cue;
- return to the correct prior/current locomotion state;
- verify one mixer / one Face owner / one ear owner;
- verify no persistent part transforms remain after recovery.

## Exactly one next gate

After ToolBox RECOVERY-01, implement the **combined Reaction Choreography + Clay Emanata proof on the real current Resident**, including animation clips as the skeletal primary-motion layer.
