# VFX, Audio, Camera and Comic Motion

This reference preserves the presentation doctrine of the existing KFB Cartoon Motion v2 skill.

## VFX is semantic choreography

Classify the event before choosing a shape:
movement · contact · impact · charge · target · portal · zone · reveal · speech · emotion · transition.

Choose:
- one primary read;
- controlled secondary support;
- quiet tertiary detail.

## Movement VFX

Use trajectory-aligned accents when speed needs help reading.
Avoid impact bursts/rings when nothing impacted.

## Contact VFX

Contact may use:
- body/object reaction;
- small filled contact burst;
- small grounded dust/fragments.

Keep it subordinate.

## Impact VFX

Prefer one dominant impact signal:
- strong burst OR readable word;
- recoil/squash/hitstop as support;
- few tertiary fragments.

Do not stack all effects.

## Ring restriction

Rings/halos are for:
charge · targeting · portals · zones · magic fields · card activation/reveal.

Do not use a generic ring as default impact punctuation.

## Dust

Dust is:
small · filled · brief · grounded · subordinate.

Large outlined loops read as undefined geometry.

## Stable hand-drawn/ink variation

Irregularity should be:
- intentional;
- stable across frames;
- seeded per event/object.

Do not regenerate random contour/noise every frame.

Recognition first; irregularity second.

## Onomatopoeia

Treat movement words and impact words differently.

Movement word:
- aligns with trajectory;
- occupies free space;
- supports motion lines.

Impact word:
- sits near semantic contact;
- stays out of protected areas;
- supports the main impact.

Normally allow one readable sound word at a time.

Measure final text using the actual font, not character-count estimates.

Separate persistent positioning transform from animated scale/rotation transform.

If no safe placement exists, omit the word.

## Protected areas

Protect:
face · eyes · card/held object · bubble · UI · action/contact · landmark.

## Audio

Audio is punctuation, not duplication.

Use one event-defining cue, optional support, and silence deliberately.

Do not create one sound for every visible secondary element.

## Camera

Camera is the reader's eye.

A move needs a purpose:
establish · follow · reveal · emphasize · hide · reframe · pause · release.

Per event, normally choose one dominant camera action:
push · pan · shake · hold.

Do not stack them by default.

Use camera shake for meaningful impact, not every action.
Camera must settle before the next important read.

## Comic/cartoon event budget

A reusable event should declare limits such as:
- max primary VFX;
- max secondary VFX;
- max tertiary VFX;
- max readable words;
- max audio cues;
- max camera actions.

Budgets are guards against equal-weight noise, not targets to fill.

## Recovery

Temporary VFX, camera offsets, audio state and animated presentation classes must clear deterministically.
