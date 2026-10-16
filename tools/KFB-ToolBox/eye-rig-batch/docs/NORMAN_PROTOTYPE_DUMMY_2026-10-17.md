# Norman · Prototype Dummy · Open-design EyeRig candidate

Date: 2026-10-17  
Owner: **KFB ToolBox / Rigging · existing Batch EyeRig Atlas**  
Execution mode: **BOUNDED_SLICE**  
Status: **IMPLEMENTED SOURCE-READY CANDIDATE · DESIGN_TUNE · SITE PUBLISH PENDING**  
No merge / no Live promotion.

## Goal

Register and build **Norman** from *Cancel This Planet / Hunky & Dory* as a deliberately tragicomic KayKit crash-test-dummy face candidate that can later serve presentation roles such as combat target or alien test subject **without creating a second combat/character runtime**.

Georg's current design decision is binding:

> **Norman's character design is not fixed.**

Therefore this slice does **not** promote the old brown Norman visual or this yellow crash-test-dummy interpretation as canon. The implementation is an editable starting point marked `OPEN_DESIGN / DESIGN_TUNE`.

## Exact source

Canonical geometry source:

- repo: `georg-doc/kayfabizarro`
- path: `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Prototype Bits/Character/Dummy.glb`
- source commit: `fe9d95e20d660261370c02cb6bca0afe439c0979`
- blob: `295357f6e031c47689d14f71ae2bcfaacbd05883`

Direct GLB JSON inspection in this slice proved:

- skin: `Rig_Medium`;
- joints: **23**;
- embedded animations: **0**;
- head node: `Dummy_Head`;
- head mesh: `PrototypePete_head.010`;
- one material / one embedded source texture.

The original eyes and mouth are painted into the head texture. They are **not** separate eye/mouth nodes, so geometry deletion would be the wrong cleanup method.

## Source isolation before integration

The workbench now exposes two Norman-specific comparison actions:

1. **Norman · Source only** — neutral source object, original painted eyes/mouth visible, EyeRig/brows/new mouth hidden;
2. **Norman · Face candidate** — reversible texture cleanup + EyeRig + brows + yellow mouth.

This keeps the actual donor/source object inspectable in isolation. The user-supplied source render is the current human visual reference; the new in-browser Source-only mode still requires the Site/browser pass before it can be claimed as runtime visual evidence.

## Face candidate

### Original source face cleanup

Reuses the existing pinned `texclean.js` donor rather than editing the GLB:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/lab-v6/texclean.js @ 5650b6c54d8789b20ea80abe857688173d506d3b`

The Norman adapter:

- finds the real Dummy head;
- clones the runtime head material;
- paints only measured head triangles inside two local face bands;
- keeps the original texture untouched;
- switches source ↔ cleaned map reversibly.

Current cleanup boxes are tuning candidates, not visual canon.

### Eyes / eyelids

Reuses **EyeRig v6** unchanged.

Starting values use the current Medium authoring baseline with:

- white EyeRig eyeballs;
- black pupils;
- base `#e4b53c`;
- existing EyeRig-v6 lid-color path darkens that base into the requested dark-yellow clay lids.

The lid color is exposed as a tuning color control.

### Block eyebrows

Reuses **BrowRig v2** unchanged:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/brow-rig.v2.js @ 5650b6c54d8789b20ea80abe857688173d506d3b`

Starting look:

- dark yellow `#9b741f`;
- thick;
- even;
- taper = 0;
- solid;
- symmetric;
- shallow roundness for a block-like read.

Color, thickness, length, height and lift are live tuning controls.

### New yellow cartoon mouth

The runtime uses the real pinned yellow source sheet rather than a placeholder.

Source:

- commit `ea603d31dbb7beefd6715ba0b455e0aa5502cae5`;
- blob `fcfaddb79ea1193ebfa0d7244629c5f6b33223bf`;
- `media/3D_Assets/Textures/FrizzleBob-Mouths_PNGs/YELLOW_Clay-Mundvisemen für Lippen-Synchronisation.png`.

The new Norman mouth catalog contains **20 source-measured forms**. Runtime crops the exact source cells and removes only near-white background connected to the crop edge, so enclosed white teeth remain opaque.

Current expression defaults:

- neutral → closed;
- happy → smile_teeth;
- angry → angry;
- sad → sad;
- surprised → surprised;
- thinking → smirk.

Expression preview is non-destructive: selecting an expression does not rewrite Norman's saved base mouth form.

## Unified authoring surface

No new workbench was created.

Existing owner remains:

`tools/KFB-ToolBox/eye-rig-batch/`

Existing storage key remains:

`kfb.toolbox.eye-rig-batch.v0`

Medium catalog is now **56 actors**, adding:

`Norman · Prototype Dummy`

Norman gets one conditional **open-design face** section inside the existing EyeRig workbench with:

- source-only / face-candidate compare;
- eyelid base color;
- brow color / thickness / length / height / lift;
- 20 mouth forms;
- mouth X / Y / width / depth;
- all existing EyeRig placement, pupil, expression, motion and QA controls.

## Evidence

Tested implementation head:

`e6283eacf0000fa7ccc8e15c14b9fa1b67f88343`

Focused source/contract checks: **40 / 40 PASS**.

Those checks include:

- exact Dummy source path / revision / blob;
- 56/56 Medium catalog consistency;
- OPEN_DESIGN / DESIGN_TUNE state;
- donor reuse;
- reversible texture cleanup contract;
- 20-form source-pinned mouth catalog;
- source-isolation UI;
- same workbench/storage owner;
- companion render-loop integration;
- JavaScript syntax **3 / 3 PASS**;
- exact GLB structure: Rig_Medium / 23 joints / 0 embedded animations / one texture.

Measured cleanup geometry preflight: **5 / 5 PASS**.

- head: 686 vertices / 734 triangles;
- painted-eyes box: 82 affected source triangles;
- painted-mouth box: 230 affected source triangles;
- union: 294 / 734 = 40.05%;
- both boxes hit real source geometry and remain below half of the head mesh.

This proves the cleanup candidate is geometrically active. It does **not** replace a browser visual check of the actual painted features.

### Not run

- full historical EyeRig static suite on this head: **NOT_RUN**; test contract was updated, but no Actions workflow triggered;
- current Norman browser/WebGL load: **NOT_RUN**;
- current source-only screenshot from the new runtime: **NOT_RUN**;
- GPT Site publication: **NOT_RUN**;
- Combat / damage / alien gameplay integration: **0** and intentionally outside this slice.

## Site / fine-tuning handoff

Requested human surface:

`https://kfb-toolbox.frizzlebob.chatgpt.site/`

Current dedicated unified EyeRig Site remains:

`https://kfb-eyerig-workbench.frizzlebob.chatgpt.site/`

This Webchat does not have the Site publisher. Therefore no Site update is claimed.

The Site-capable executor should **reuse the existing ToolBox + existing unified EyeRig workbench**, not create a second Site or second face runtime. Make Norman discoverable from the existing ToolBox surface, then open the exact published ToolBox URL and verify:

1. Norman loads from the pinned Dummy GLB;
2. **Source only** visibly shows the original painted source face;
3. **Face candidate** hides that source face and shows EyeRig + dark-yellow lids + block brows + yellow mouth;
4. the Norman-specific sliders/selects visibly tune the face;
5. a fresh reload preserves the current candidate profile through the existing storage owner.

## One next gate

**NORMAN_TOOLBOX_SITE_FINE_TUNE_01**

Site-capable Work/WSA publishes/links the current candidate through the **existing KFB ToolBox Site**, verifies the exact URL, then Georg performs **TUNE / APPROVE / REJECT** on Source-only vs Face-candidate. No merge, Live promotion or Combat integration before that gate.
