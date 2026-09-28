# Resident Profile · Officer Doppel-Denk · Toy Soldier · 2026-09-28

Status: **WORKING CHARACTER PROFILE · DESIGN PERSISTENCE · NOT RUNTIME IMPLEMENTED**  
Owner: **KFB Town Resident Social Memory**  
Technical Resident source: `toy-soldier` / KayKit Mystery Series 6 Toy Soldier  
Working character name: **Officer Doppel-Denk**  
Branch: `chatgpt-web/town-resident-social-memory-2026-09-28`

## 1 · Why this Resident matters

Officer Doppel-Denk is the first explicit proof that KFB Residents should differ not only by animation and routine but by **what they notice, what they expect, what they interpret as a problem and which reaction deck they prefer**.

His comic motor is not random officious dialogue. It is a stable mismatch:

- he wants to embody public order and royal authority;
- he overestimates his own legitimacy;
- most Residents do not take him seriously;
- King K. Fabian may use his willingness to obey but does not need to respect his judgement;
- routine disruptions therefore become tiny status conflicts rather than generic NPC chatter;
- he keeps returning to duty after humiliation, because duty is also how he protects his self-image.

This should remain tragicomic rather than villainous. He is not a combat guard by default and not a universal law-enforcement system.

## 2 · Source-proven physical baseline

Current Resident Atlas source already provides:

- `residentId: toy-soldier`;
- `Rig_Medium`;
- `ToySoldier.glb`;
- `ToySoldier_Rifle.gltf` attached to `handslot.r`;
- `ToySoldier_Trumpet.gltf` attached to `handslot.l`;
- `Present_Base.gltf`;
- `Present_UnwrappedBase.gltf`;
- a timed reveal sequence with anticipation, pop, overshoot and settle;
- exact closed/open present states rather than an invented opening lid.

Current Atlas caveat:
- under `Idle_B` the rifle sits sideways;
- no existing standing shoulder-rifle clip is proven;
- `Running_HoldingRifle` exists in `Rig_Medium_MovementAdvanced` and is the first source-backed motion candidate to audition;
- `Walking_A` and `Walking_B` exist but do not by themselves prove the rifle pose;
- if none produces the intended Nutcracker shoulder-carry march, a new Mixamo/donor clip may be admitted through the existing Motion Library intake rather than faking a permanent hand offset.

## 3 · Spawn / reveal mini-scenario

The Atlas currently loops the reveal for preview. In the world, the desired semantic state is different.

### World state

```text
CLOSED_PRESENT
→ proximity / attention trigger
→ REVEAL_PLAYING
→ OFFICER_EMERGED
→ PATROL_ACTIVE
```

The present should normally stay **opened** after the first reveal within that world/save context. Re-entering range should not replay the birth gag every few seconds.

Possible reset conditions remain owner-specific:
- explicit scene reset;
- world/session reset;
- authored seasonal reset;
- respawn after a deliberately defined lifecycle.

No duplicate rewards or duplicate Resident spawn.

## 4 · Core routine: patrol

Default routine:

```text
emerge from present
→ settle / shoulder rifle
→ acquire patrol route
→ march
→ scan local POIs
→ investigate selected disorder candidate
→ react / admonish / inspect
→ social consequence
→ resume route
```

The route belongs to the world/navigation owner. The Resident profile supplies:
- patrol preference;
- attention bias;
- interruption thresholds;
- reaction candidates;
- return-to-duty behavior.

He should not become generic Idle after every interruption.

## 5 · Resident-specific Attention Bias

Officer Doppel-Denk should heavily up-weight POIs that can be interpreted as disorder, obstruction, improper conduct or an opportunity to display authority.

Suggested interpretation tags:

- `possible_disorder`
- `public_obstruction`
- `litter`
- `noise`
- `unsafe_horseplay`
- `improper_use`
- `queue_or_line_violation`
- `unattended_object`
- `unauthorized_gathering`
- `authority_opportunity`
- `royal_interest`
- `repeat_offender_memory`

This is **his subjective classifier**, not world truth.

A pizza slice on the ground can become `litter`.  
A Brick Fish exchange can become `unsafe_horseplay` or `public_disorder`.  
A plant leaning into a path may become `public_obstruction`.  
A Resident dancing in the wrong place can become `noise` or `unauthorized_gathering`.

The same POIs should mean very different things to another Resident.

## 6 · False positives are part of the character

His uniqueness improves if his perception is not merely stricter but sometimes **misapplied**.

Examples:
- admonishes a plant as if it could comply;
- inspects a harmless prop because it is unattended;
- interrupts a friendly Brick Fish exchange after both participants are already laughing;
- treats one Tiny Treats pizza slice as a civic problem while ignoring a larger absurdity nearby;
- attempts to organize Residents who have no interest in being organized.

Important: the world does not confirm that he is correct. Other Residents may:
- ignore him;
- laugh;
- comply theatrically;
- answer with a retort;
- redirect him toward another “problem”;
- deliberately bait another officious intervention;
- occasionally agree with him when the underlying issue is real.

That variance prevents him from becoming a one-note scold.

## 7 · Personal motivations and current goals

Stable motivations:

1. **Duty / patrol** — keep moving and visibly perform responsibility.
2. **Authority display** — be seen giving instructions.
3. **Royal loyalty** — align himself with King K. Fabian's perceived interests.
4. **Recognition** — seek proof that his office matters.
5. **Order-making** — convert ambiguous situations into legible rules.
6. **Status preservation** — recover composure after ridicule.

Typical current goals:
- reach next patrol marker;
- investigate a noise;
- clear an obstruction;
- stop a Brick Fish exchange;
- identify who left an object;
- restore an imagined line/formation;
- report or perform diligence near a royal POI;
- recover dignity after being laughed at.

These goals can conflict. For example:
`patrol duty` versus `authority opportunity`, or `royal loyalty` versus `obvious local common sense`.

## 8 · AIDA examples for Officer Doppel-Denk

### 8.1 · Brick Fish

```text
ATTENTION
Brick Fish impact / raised Brick Fish enters visible field

INTEREST
high: unsafe_horseplay + repeat-offender memory

EXPECTATION
"Someone is disturbing public order."

INTERACTION
approach / point / command / inspect

REACTION
participants laugh, retort, comply theatrically or throw again

INTERPRET
authority challenged OR order briefly restored

MEMORY
only if recurring relationship/social thread matters

RETURN
resume patrol, possibly with wounded dignity
```

### 8.2 · Pizza slice on ground

```text
ATTENTION
Tiny Treats pizza slice tagged loose-prop + food + ground

INTEREST
litter / unattended_object

EXPECTATION
"Someone has left this here."

INTERACTION
inspect nearby Residents / demand ownership / request removal

REACTION
owner retrieves it, denies ownership, or another Resident eats it

RETURN
patrol resumes; no memory unless this becomes a recurring culprit/object
```

### 8.3 · Plant

```text
ATTENTION
plant overlaps path or simply has high visual salience

INTEREST
possible public_obstruction

EXPECTATION
"Path should be kept clear."

INTERACTION
addresses plant / gestures it back / looks for responsible gardener

REACTION
plant does nothing; nearby Resident reacts instead

INTERPRET
he may treat silence as defiance, bureaucracy completed, or gardener responsibility

RETURN
patrol
```

The humor comes from causal behavior, not a random “talking to plants” gag.

## 9 · Reaction deck

Prefer semantic reaction intents rather than hardcoded lines:

- `notice_disorder`
- `inspect`
- `halt_and_point`
- `reprimand`
- `request_compliance`
- `invoke_royal_authority`
- `confiscation_attempt` only if the prop/world owner permits pickup
- `receive_retort`
- `authority_deflated`
- `recover_composure`
- `write_off_as_warning`
- `resume_patrol`
- `rare_real_help` when his concern is actually useful

Reaction Choreography should combine:
- head/eye focus;
- mouth/ChatterBox timing;
- rigid toy-soldier body language;
- arm/point or rifle-safe pose;
- Emanata where appropriate;
- clean transition back into march.

No new animation owner.

## 10 · Social response pattern

Officer Doppel-Denk should create **interaction triangles**, not only player-to-NPC exchanges.

Common pattern:

```text
Officer notices POI
→ addresses Resident A
→ Resident A retorts / ignores
→ Resident B witnesses and may laugh, support or escalate
→ Officer interprets status outcome
→ one compact social receipt if it matters
→ everyone resumes or retargets
```

This is useful because his authority attempts manufacture low-cost social opportunities between nearby Residents.

## 11 · Relationship direction

### King K. Fabian

Working direction:
- Doppel-Denk is a willing subordinate and wants visible royal approval;
- he may invoke the King's authority more often than the King actually asked him to;
- the King can use him as a convenient functionary;
- the King does not need to respect his competence or social standing;
- this mismatch can create loyalty without intimacy.

Do not turn this into a global faction score.

### Other Residents

Default social perception:
- low fear;
- low obedience;
- moderate familiarity;
- high retort opportunity;
- occasional genuine cooperation when order concern overlaps a real need.

A few Residents may enjoy baiting him. Others may protect him from total humiliation. This should be character-specific later, not a universal matrix.

## 12 · ChatterBox / Triplet language direction

Language remains owned by ChatterBox / semantic Triplets / selectable retorts.

The Officer profile contributes:
- point of view: order / duty / authority;
- current POI;
- expectation;
- whether prior authority was challenged;
- whether King K. Fabian is contextually relevant.

Avoid:
- generic bureaucratic word salad;
- long legalistic speeches;
- catchphrase spam;
- random “regulation number” jokes;
- making every line mention the King.

Preferred shape:
- short concrete observation;
- officious interpretation;
- command or claim of authority;
- room for another Resident's retort.

Illustrative, not canon:

**Brick Fish**
- Officer: “Brick Fish. Public path. Put it down.”
- Retort candidate: “It was already airborne.”
- Officer follow-up intent: `authority_deflated → recover_composure`.

**Plant**
- Officer: “You are over the path.”
- silence / body reaction
- Officer: “I will find whoever is responsible for you.”

The second works because the interaction transfers from an impossible target to a new search goal.

## 13 · Lean Memory rules

Persist only socially meaningful outcomes.

Good receipts:
- Resident repeatedly challenged his authority;
- same Resident complied unexpectedly;
- Brick Fish incident opened a bounded banter thread;
- someone deliberately redirected him toward a false “violation”;
- King K. Fabian directly praised/rebuked him;
- a recurring nuisance object has known provenance.

Do not persist:
- every litter inspection;
- every plant admonition;
- every patrol marker;
- every ignored command.

A useful subjective interpretation may be:
`"Resident X treats my warnings as entertainment."`

The source event remains immutable; the judgement is his.

## 14 · Gift reveal persistence

The present is not only scenery; it is his entrance state.

Suggested resident-local flags:

```ts
{
  revealed: boolean,
  revealWorldEventRef?: string,
  activeRoutine: "patrol" | "inspect" | "social" | "returning",
  patrolRouteRef?: string,
  lastAuthorityOutcome?: "obeyed" | "ignored" | "mocked" | "helpful"
}
```

Do not turn these into a second global NPC database. They belong in the existing receiving persistence owner.

## 15 · First animation gate

### 15.1 · Priority candidate · Mixamo `Walk with Briefcase`

Georg has identified Mixamo **`Walk with Briefcase`** as the current preferred donor candidate.

Why it is promising:
- the right arm already stays in a deliberate carrying pose rather than performing a normal walk swing;
- the left arm keeps a normal locomotion swing;
- this gives the desired asymmetric Nutcracker silhouette;
- the exact Toy Soldier rifle can potentially replace the implied briefcase load and be fitted so it reads as a shoulder-carried rifle;
- the clip can therefore solve locomotion and character silhouette together instead of combining an unrelated walk with a rigid weapon correction.

Source status: **USER-IDENTIFIED EXTERNAL DONOR · NOT YET ADMITTED / NOT YET PINNED IN REPO**.

Preferred adaptation path:

1. obtain/export the exact Mixamo `Walk with Briefcase` clip and preserve its source identity;
2. admit it through the existing Motion Library / motion-intake path rather than embedding an anonymous animation in the Resident;
3. retarget it to the current `Rig_Medium` Toy Soldier;
4. attach exact `ToySoldier_Rifle.gltf` to `handslot.r`;
5. preserve the clip's lower body and left-arm swing;
6. use the carried right-arm pose as the base;
7. if needed, apply only a small additive right shoulder / forearm / wrist pose patch to establish the classic shoulder-rifle silhouette;
8. adjust the rifle's local grip transform only as needed for believable hand contact and shoulder resting position;
9. do not keyframe the rifle as an independent fake world-space prop while the body walks;
10. save the final motion + pose/attachment recipe as reusable resident configuration.

Validation across the entire loop:
- right hand stays on a plausible grip point;
- rifle visually rests on/near the shoulder rather than floating;
- no shoulder, cheek, hat/head or bayonet clipping;
- no forearm/wrist break;
- left arm keeps its natural swing;
- torso counter-rotation does not make the rifle cut through the head/body;
- feet do not visibly slide at the intended patrol speed;
- loop seam is clean;
- transition from reveal/settle into march and from interruption back into march is acceptable.

### 15.2 · Existing KFB motions remain comparison donors

Still audition:
- `Running_HoldingRifle`;
- `Walking_A`;
- `Walking_B`.

They remain useful A/B references and possible fallback sources, but `Walk with Briefcase` is now the **priority candidate** because its asymmetric arm behavior matches the intended Officer walk more directly.

A static prop transform must not compensate for a fundamentally wrong arm animation. A small attachment fit or additive right-arm pose patch is acceptable when the base motion already provides the correct carrying behavior.

## 16 · First integrated Officer mini-scenario

A productive first world proof could be:

```text
closed present beside a patrol route
→ player enters trigger radius
→ existing reveal animation plays once
→ Officer emerges
→ rifle / march clip begins
→ patrol route starts
→ nearby Brick Fish exchange occurs
→ Officer notices and interrupts
→ one Resident retorts
→ brief Reaction Choreography
→ Officer stores at most one meaningful social receipt
→ patrol resumes
→ later pizza-slice or plant POI can trigger a different order interpretation
```

This one Resident would test:
- entrance state;
- prop attachment;
- motion audition;
- patrol routine;
- POI selection;
- resident-specific attention bias;
- multi-NPC interaction;
- ChatterBox/Triplet;
- Reaction Choreography;
- Lean Memory;
- resume-to-routine.

## 17 · Reusable lesson for all Residents

The generic Resident contract should eventually expose a small character overlay:

```text
routine preferences
+ attention biases
+ motivations
+ expectation tendencies
+ reaction-intent deck
+ language/voice owner reference
+ memory salience rules
+ social vulnerability / escalation tendencies
```

This is the layer that makes the same POI ecology produce a unique population without authoring a bespoke quest tree for every inhabitant.

## 18 · Open items

- final player-facing name remains open; **Officer Doppel-Denk** is the working name;
- exact patrol route belongs to the receiving world;
- Mixamo `Walk with Briefcase` is the **priority** march/walk donor candidate but is not yet admitted/pinned;
- `Running_HoldingRifle` and `Walking_A/B` remain comparison/fallback candidates;
- shoulder-rifle pose must be visually proven across the whole loop;
- trumpet usage is not part of the first patrol proof;
- exact King K. Fabian interactions remain authored social content, not autonomous political hierarchy;
- concrete dialogue takes remain ChatterBox-owned;
- no Stage deployment from this design checkpoint.

## One next gate

Add Officer Doppel-Denk as the **first resident-specific profile overlay** when the current `RESIDENT-SOCIAL-MEMORY-01` implementation starts; use his reveal → patrol → disorder-interruption → resume loop as the concrete character proof rather than creating a generic personality dashboard.
