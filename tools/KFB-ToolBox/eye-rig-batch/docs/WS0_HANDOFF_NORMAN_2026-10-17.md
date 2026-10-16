# WS0 Handoff · Norman Prototype Dummy · 2026-10-17

Owner: **KFB ToolBox / Rigging · existing Batch EyeRig Atlas**  
Repo: `georg-doc/kayfabizarro`  
Branch: `toolbox/eye-rig-batch-2026-09-18`  
Draft PR: **#104**  
Outcome: **Norman open-design face candidate prepared inside the existing EyeRig workbench; Site/browser fine-tuning remains.**  
Merge / Live: **DO NOT MERGE / DO NOT PROMOTE LIVE**

## Georg direction

Norman's character design is **not fixed**.

Treat the yellow KayKit crash-test-dummy interpretation as an editable starting point only:

- canonical series role remains Norman from *Cancel This Planet / Hunky & Dory*;
- the old brown visual is not binding;
- this candidate is `OPEN_DESIGN / DESIGN_TUNE`;
- future use as combat target / alien test subject is presentation intent only, not a second combat runtime.

## What is already implemented

Existing runtime owner only:

`tools/KFB-ToolBox/eye-rig-batch/`

Norman is added to the Rig_Medium roster as actor #56 using the exact KayKit Prototype Bits Dummy:

`media/3D_Assets/KayKit_Bits_Bundle1_1.1/Prototype Bits/Character/Dummy.glb`

Pinned source:
- commit `fe9d95e20d660261370c02cb6bca0afe439c0979`
- blob `295357f6e031c47689d14f71ae2bcfaacbd05883`
- Rig_Medium / 23 joints / 0 embedded animations

New files:
- `data/norman.prototype-profile.v0.json`
- `data/norman-mouth-r3.v1.json`
- `lib/norman-face.v1.js`
- `docs/NORMAN_PROTOTYPE_DUMMY_2026-10-17.md`

Modified:
- `data/rig-medium-actors.v0.json`
- `app.js`
- `index.html`
- `styles.css`
- `tests/static-check.mjs`
- `site.manifest.json`

## Source isolation requirement

The runtime now has two Norman-only comparison buttons:

- **Norman · Source only**
- **Norman · Face candidate**

Source-only must be shown first in browser evidence.

The original source eyes and mouth are painted into one head texture. They are not separate eye/mouth nodes. Candidate cleanup therefore reuses the existing pinned `texclean.js` donor and swaps a runtime-cleaned texture only; the GLB/source texture remains untouched.

## Face candidate

### Eyes
Existing EyeRig v6.

Starting lid base:
`#e4b53c`

Existing EyeRig lid path darkens it into the requested dark-yellow clay lids. Color remains tunable.

### Brows
Existing BrowRig v2 donor.

Starting intent:
- thick
- even
- block-like
- dark yellow `#9b741f`
- taper 0
- solid / symmetric

Live controls:
color, thickness, length, height, lift.

### Mouth
Real source-pinned yellow cartoon/clay mouth sheet:
- source commit `ea603d31dbb7beefd6715ba0b455e0aa5502cae5`
- blob `fcfaddb79ea1193ebfa0d7244629c5f6b33223bf`
- 20 measured forms

Live controls:
form, X, Y, width, depth.

## Evidence already done

Tested implementation head:
`e6283eacf0000fa7ccc8e15c14b9fa1b67f88343`

Focused source / contract checks:
**40/40 PASS**

Syntax:
**3/3 PASS**

Exact source GLB:
- Rig_Medium
- 23 joints
- 0 embedded animations
- Dummy_Head present
- one material / one embedded texture

Cleanup geometry preflight:
**5/5 PASS**
- eye band: 82 source triangles
- mouth band: 230 source triangles
- union: 294 / 734 head triangles = 40.05%

Important boundary:
these are static/source checks only. Browser/WebGL visual proof of Norman is still **NOT_RUN**.

## Site / browser work for WS0

Preferred human fine-tuning surface:
`https://kfb-toolbox.frizzlebob.chatgpt.site/`

Existing dedicated EyeRig Site:
`https://kfb-eyerig-workbench.frizzlebob.chatgpt.site/`

Do **not** create a second Norman runtime or replacement Site.

Use Site-capable Work/WSA to expose the existing unified EyeRig workbench through the existing ToolBox surface, then visibly verify the exact Site revision.

Required browser proof:

1. select Norman;
2. show **Source only** first: original painted eyes/mouth visible;
3. switch to **Face candidate**: source face paint is hidden;
4. EyeRig + dark-yellow lids + block brows + yellow mouth are visible;
5. tune lid color, brows and mouth controls;
6. exercise Front / ¾ / Side;
7. exercise Bind / Idle / Walk / Run;
8. reload and confirm the same existing storage owner preserves the candidate.

If the cleanup bands visibly erase helmet/face regions beyond the painted features, tune only `norman.prototype-profile.v0.json#cleanup.boxesLocal/grow` and keep the source reversible.

## Human gate

One gate only:

**NORMAN_TOOLBOX_SITE_FINE_TUNE_01**

Georg decides:
**TUNE / APPROVE / REJECT**

No merge, Live promotion, Combat integration, damage runtime or global Norman visual canon before that gate.
