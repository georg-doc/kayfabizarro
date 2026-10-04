# KFB ToolBox · Stage-First Default v1 · 2026-09-23

Status: **CURRENT CONSOLIDATION BRIEF · CLAUDE DESIGN FIRST · WEB REHOME/HTML REVIEW AFTER**
Owner: `georg-doc/kayfabizarro/tools/KFB-ToolBox/`

## Product goal

Turn the proven ToolBox pieces into one **functional default ToolBox UI** instead of forcing Georg to jump between isolated EyeRig / motion / rig / scene labs.

The default working surface should make fast visual questions cheap:

- Legacy EyeRig front / 3/4 review;
- eye spacing/placement on characters and vehicles;
- hand/weapon orientation;
- one alternate KayKit body under the existing FrizzleBob Driver graft;
- source-object inspection;
- simple stage / Resident-scene placement;
- in-place transform correction;
- HTML-first review without Cloudflare.

This is a consolidation/authoring shell, not a new rigging engine.

## Current UI source

### Exact visual concept source

Dropbox:

`/CLAUDE/KFB ToolBox v0.5/KFB-ToolBox/_handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/design/KFB ToolBox Stage-First Concept.dc.html`

File size at review:
`42,850 B`

This is the preferred visual/UI donor.

GitHub design contract:
`tools/KFB-ToolBox/_handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/START_HERE.md`

Hard UI rules:
- one persistent top bar;
- `Actor ▾`;
- one navigation layer: `Body · Face · Motion · Voice · Messen`;
- stage dominates;
- one context palette/drawer;
- compact camera controls;
- `Stage ▾` scene preset;
- diagnostics/source info only under `…`;
- no workflow band / second nav / developer prose wall;
- split-screen ~832 px remains usable;
- full roster remains discoverable.

**Use the actual concept source. Do not redraw it from prose.**

## Current v0.5 source intake

GitHub package:
`tools/KFB-ToolBox/_inbox/KFB ToolBox v0.5.zip`

Intake:
`tools/KFB-ToolBox/_handover/TOOLBOX_V05_EXPORT_INTAKE_2026-09-23/START_HERE.md`

Current classification:
**SOURCE RECEIVED · REVIEWED INTAKE · NOT YET PROMOTED**

The 19 MB ZIP contains substantial duplicated history; useful current runtime is concentrated in its ~4 MB `stage-first/` tree.

Final promotion still wants a lean source delta / fresh manifest.

Claude Design may use the unpacked current source in Dropbox for authoring, but must not treat the full historical ZIP as the new owner tree.

## Proven modules to consume, not rebuild

### EyeRig owner

Canonical:
`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

EyeRig v6 remains the only eye runtime.

### Medium / Large EyeRig batch

Draft PR #104:
`toolbox/eye-rig-batch-2026-09-18@e277c3456651d314a01adea046e0105d2a12cdd1`

- 27 Rig_Medium actors remain available;
- four human-reviewed Rig_Large profiles: Monstrosity, Black Knight, Demon Lord, Orc Brute;
- 95/95 persisted suite PASS;
- 4/4 runtime syntax PASS.

### Legacy EyeRig

Draft PR #162:
`chatgpt-web/legacy-eye-batch-17-2026-09-21@7b1b52a60d64c9dc710514a59d1a7365f8a168e7`

- 17/17 Legacy head profiles;
- 16 `MEASURED_CANDIDATE`;
- Skull = `HUMAN_REQUIRED`;
- source-first run: 24/24 static + 247/247 browser/WebGL PASS;
- persisted reconstruction: 30/30 static/profile + 215/215 browser/WebGL PASS.

Current human review route exists:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/legacy/`

Do not require that route for normal iteration; the new ToolBox should expose the same profiles in its own Face/Messen contexts.

### Eye Actor Studio

Draft PR #159:
`chatgpt-web/toolbox-eye-actor-studio-v1-2026-09-21@306bb882594f002670069708a853d55eb099fb54`

Authoritative tested runtime:
`64d16e754a3b149efa64f2b7f3045d42f32e4bca`

Evidence:
- 51/51 static;
- 10/10 syntax;
- 53/53 desktop/mobile browser;
- zero resource/page/console errors.

Use as an **Eye Actor / unusual host authoring donor**.
Do not create another EyeRig schema.

### In-scene edit donor

PR #120:
`toolbox/inline-3d-edit-layer-intake-2026-09-20@c52e4139d2b5f311ef5dc9a8cfdecbd8944a469f`

S21 source proves:
- real Three.js TransformControls;
- move/rotate;
- 0.1 / 15° snap;
- floor drop;
- part ↔ semantic-group scope;
- picking;
- local correction cache;
- patch output.

PR #133 second-host candidate remains:
`FROZEN_CANDIDATE · STATIC_PASS · BROWSER_PROOF_HARNESS_BLOCKED`

Therefore:
**reuse the S21 source interaction directly; do not claim the generic second-host extraction is already accepted.**

### KayKit compatibility source bench

PR #147:
`chatgpt-web/toolbox-kaykit-character-compat-2026-09-20@d230909626ae24844d2b3109bc45a757b04b1959`

Use its real donor/source matrix for alternate hosts.

PR #148 adds presentation-only Race secondary-motion facts; it is not a body/physics owner.

### FrizzleBob Driver graft

Existing owner:
`tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js`

Do not rebuild Driver/Graft logic inside the ToolBox shell.

## Default ToolBox interaction model

The Stage-First Concept becomes the candidate **default ToolBox UI**.

### Actor

One `Actor ▾` searchable roster.

Source objects first.

### Face

Use the existing EyeRig v6 / Eye Actor sources.

For current selected actor:
- visible eyes;
- front / 3/4 camera;
- anchor controls only where the owner exposes them;
- Preview / Accept / Revert;
- eye-profile save patch.

### Messen

This becomes the compact in-place correction surface for:
- EyeRig anchor/spacing;
- weapon/hand attachment orientation;
- source-object pivot/support inspection;
- later seat/mount anchors.

Use S21-style TransformControls / attached mini-menu.
No separate alignment app for every prop.

### Stage

`Stage ▾` should offer a small set of environment presets without changing runtime ownership:

1. neutral standard floor;
2. Resident Atlas scene/preset when source-backed;
3. later World/Environment preset.

This is presentation context only.

## Current micro-review fixtures

The ToolBox should make these fast and disposable through HTML review.

### TB-F1 · Legacy EyeRig review

Show all 17 Legacy profiles in the default ToolBox Face/Messen UI.

Human goal:
front + 3/4 approve/adjust/reject without leaving ToolBox.

### TB-F2 · Alternate KayKit body + FrizzleBob Driver graft

First bounded candidate:
**one real Rig_Medium body from the current KCC/Registry source set**.

Recommended first fixture:
`ActionFigure` if its exact current source remains available and compatible.

Order:
1. body source alone;
2. FrizzleBob Driver graft source alone;
3. graft on that body;
4. no new movement/animation owner.

This is an experiment, not a requirement that all KayKit bodies work.

### TB-F3 · Vehicle EyeRig

Use the exact vehicle from the v0.5 export **only after its source path is identified**.

Eye owner remains EyeRig v6.

A vehicle/static FaceHost supplies:
- measured front/facing axis;
- host bounds;
- eye centerline;
- `anchor.dx` spacing;
- optional `dy/ring/track`.

No second vehicle-eye runtime.

If the v0.5 car source is still ambiguous, mark this fixture `SOURCE_REQUIRED` and continue ToolBox work.

### TB-F4 · Weapon / hand orientation

Use one real actor + one real handheld prop.

Messen mode:
- source prop alone;
- mounted result;
- in-place transform correction;
- save a small attachment patch;
- regenerate a `REVIEW.html`.

This is exactly the kind of issue that should take one HTML feedback loop, not a Cloudflare/Work project.

## HTML-first review

Normal loop:

`Claude Design Session Cut → Web rehome/checkpoint → TOOLBOX_REVIEW.html → Georg feedback → repair`

No Cloudflare during ordinary visual iteration.

No Work.

Cloudflare/Hub only after Georg accepts a coherent ToolBox milestone.

## First Claude Design gate

Create one coherent Stage-First session that:

- reproduces the actual Stage-First Concept layout;
- keeps the stage dominant;
- connects the current real source roster;
- exposes Legacy EyeRig review in Face/Messen;
- demonstrates one in-place edit operation;
- includes neutral Stage preset;
- leaves alternate-body, vehicle-eye and weapon fixtures as explicit next micro-fixtures if not completed safely.

Do not redesign the UI before the exact concept source has been shown and matched.

## Done when

Georg can open the rehomed HTML review and do at least:

1. choose an actor;
2. inspect Legacy eyes front / 3/4;
3. adjust/save one eye anchor through the existing EyeRig seam;
4. select one object/attachment and transform it in place;
5. save/reload that small authoring state.

That is enough to call the consolidated ToolBox **functional candidate**.

Do not block this gate on every actor, vehicle or prop.
