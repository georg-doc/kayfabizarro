# Eye Calibration QA Loop · Rig_Medium / GothGirl · 2026-09-19

Status: **CURRENT CANDIDATE QA LOOP**  
Owner: KFB ToolBox / Rigging  
Applies to: GothGirl first, then later Rig_Medium sample actors only after Georg accepts the calibration grammar.

## Rejected baseline

The user-supplied 2026-09-19 screenshot is the visual failure baseline:

- eyeballs dominate the face and protrude far beyond the head;
- pupils are too large;
- lid shells read yellow instead of as part of the face;
- the failure is clearest in a 3/4 camera.

Do not optimize against Front view alone.

## Candidate defaults

The current Rig_Medium candidate derives its proportions from the existing tuned GothGirl JSON:

`tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/kfb-pet-gothgirl.json`

Reference values:

- actor eye spacing `dx = 0.49`;
- actor eye ring `ring = 0.32`;
- therefore tuned visual ratio `ring / dx = 0.653061224`;
- actor pupil size `0.34`;
- actor face color `#e6cbc3`;
- lid policy `base-darkened`.

Because the old GothGirl JSON and the Batch FaceHost use different normalized spaces, raw `ring=0.32` is **not copied**. Runtime mapping is:

`Rig_Medium ring = current measured source-eye dx × 0.32 / 0.49`

The file seed uses `ring=0.20` only as a safe boot fallback until current FaceHost measurement exists.

## Fixed screenshot loop

Use **QA 4-view** in the workbench after every meaningful calibration change. It captures one 2×2 contact sheet from:

1. **Front**
2. **¾ L**
3. **¾ R**
4. **Side R**

Keep expression and motion constant within one comparison. For default calibration use Neutral + Bind/T first; motion comes after static face geometry is plausible.

## Four QA questions

### Q1 · Eye scale
Do the sclerae read as cartoon eyes attached to the face rather than two dominant external balls?

Fail if either 3/4 or Side makes the eye mass visually larger than the face depth or obviously detached.

### Q2 · Pupil scale
Does enough sclera remain visible around the pupil in Front and both 3/4 views?

The current default candidate is `pupilSize=0.34`, taken directly from the tuned GothGirl JSON. Do not return to the previous Batch default `0.50` without a named visual reason.

### Q3 · Lids / skin relationship
Do upper and lower lids read as a darker version of the character's own face/skin color?

For GothGirl the base is `#e6cbc3`; EyeRig v6 applies its existing darkening function. Yellow fallback lids are a FAIL.

For future KayKit characters, each actor profile must provide or measure its own face base color. Do not make GothGirl pink the global KayKit lid color.

### Q4 · Attachment / silhouette
In ¾ and Side, do eyes and lids stay on the facial surface without deep clipping, floating, or ear/accessory interference?

Source cleanup must still remove only current verified eye components 2+3; components 6/7/8 remain untouched.

## Iteration rule

One loop changes one parameter family:

1. eye size / ring;
2. pupil size;
3. inset / surface fit;
4. spacing / vertical only if the first three are already plausible.

Capture the same four views after each loop. Preserve rejected contact sheets as evidence rather than overwriting them.

## Gate

GothGirl remains `AUTO_CANDIDATE` until Georg accepts one four-view sheet plus a short Idle/Walk/Run/Jump attachment check.

Only after that approval may the resulting values become the initial Rig_Medium class seed for a varied 5–8 actor calibration sample.
