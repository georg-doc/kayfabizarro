# Principles and Choreography

This file carries the shared doctrine from the existing KFB Cartoon Motion v2 skill.

## Motion is meaning in time

Every motion should answer at least one of:
- what happened;
- who caused it;
- where it happened;
- how strong it was;
- what the viewer should read first;
- what state remains afterward.

Decorative motion without a semantic purpose is noise.

## One clear read

At an important instant, establish:
1. primary action/read;
2. secondary reaction/support;
3. tertiary atmosphere/detail.

Do not make every layer equally large, bright, fast or loud.

## Whole-body participation

Speech, emotion and action may affect torso, head, eyes, limbs, held props, clothing/accessories and shadow, but motion remains punctuation. Return to a quiet readable baseline.

## Default event arc

```text
cause
→ anticipation
→ action
→ contact / impact
→ follow-through
→ recovery
```

Not every continuous action requires a theatrical anticipation or impact, but every authored event needs a readable cause and recovery policy.

### Anticipation
Usually prepares the viewer by loading force or briefly moving against the main action. In games, anticipation may be visually compressed so input response is not delayed.

### Action
The primary readable movement.

### Contact / impact
The exact moment where meaning changes: foot plant, landing, hand contact, strike, reveal, collision.

### Follow-through
Secondary parts continue after the primary mass changes direction or stops.

### Recovery
Return to a stable, interruptible, known state. Clear temporary offsets/effects.

## Timing versus spacing

Timing = total duration.
Spacing = distribution of poses/positions through that duration.

The same duration can feel:
- mechanical with even spacing;
- accelerated with widening spacing;
- decelerated with tightening spacing;
- snappy with a held anticipation and fast travel;
- heavy with delayed recovery and compressed contact.

Never claim weight, gravity, acceleration or bounce unless spacing supports it.

## Staging

Check from the camera that matters to the user, not only from an animator-friendly angle.

Protect:
- face and eyes;
- hands/feet when contact matters;
- held gameplay objects;
- UI and dialogue;
- silhouette-critical limbs;
- the actual contact point.

If the important action is unreadable at target camera/distance, more animation detail is not a repair.

## Secondary action

Secondary action supports the primary read. It must not steal it.

## Overlap and follow-through

A useful force chain:
```text
root/body force
→ pelvis/chest
→ shoulders/head
→ limbs
→ hands/feet
→ ears/tail/cape/hair/loose gear
```

Offsets are character/style dependent, not universal constants.

## Controlled stillness

Idle is evidence that something is alive, not permission for constant bounce or random rotation. Holds, pauses and stillness are active animation choices.

## Interruption

Game animation must define when an action can:
- be interrupted;
- blend out;
- be cancelled by a higher-priority state;
- finish recovery.

A beautiful motion that traps controls is not a successful gameplay animation.
