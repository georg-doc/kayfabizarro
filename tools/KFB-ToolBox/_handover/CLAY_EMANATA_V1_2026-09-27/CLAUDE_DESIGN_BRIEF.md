# CLAUDE DESIGN BRIEF · KFB ToolBox · Clay Emanata v1

Status: **QUEUED AFTER RECOVERY-01**  
Owner: **KFB ToolBox**  
Target: existing current ToolBox / Production successor, not a new tool  
Planned public Stage after integration: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/clay-emanata-v1/`  
Do not deploy or claim public/live from Claude Design.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`
5. `skills/kfb-cartoon-animation_v2.md`
6. `skills/KFB_3D_CartoonStyle_v1.md`
7. this folder's `START_HERE.md`
8. this folder's `clay-emanata.v0.1.json`
9. current ToolBox Production-02 Return/Recovery:
   - `tools/KFB-ToolBox/_inbox/KFB ToolBox Production-02-2/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-27_r1/RETURN.md`
   - `.../RECOVERY_PLAN.md`
   - `.../NEXT_CHAT.md`
   - `.../SOURCE.json`
   - `.../TEST_REPORT.md`

## Stop condition before implementation

If ToolBox **RECOVERY-01 is still open**, do not extend Production with Emanata. You may inspect sources and prepare a source map, but do not build a parallel prototype runtime or a substitute actor.

When RECOVERY-01 is closed/cleared by the current ToolBox owner, continue below in the actual Production successor.

## Outcome

Add a reusable 3D claymation Emanata layer to the **real current Resident actor** so facial acting, body punctuation and external symbolic clay objects work as one readable emotional performance.

First integrated proof:

1. **Tears** — single tear + tear burst from actual eye anchors.
2. **Hearts** — 1–3 pulsing/rising clay hearts above the head.
3. **Shock rays** — a radial crown of chunky rounded clay rays synchronized to shocked face/body reaction.

The proof is not a gallery. It must run on one real current Resident and use the current face/eye/brow/mouth system.

## Mandatory donor proof before building

Show these sources **in isolation in the Claude Design artifact/session before integrating them**:

### A · current face owner

Current ToolBox Production actor with current EyeRig/face/clay-lid behavior.

Record:
- exact source cut/path;
- exact face/clay-lid module path;
- current pre-slice self-test result.

Do not recreate eyes, lids, brows, mouth, visemes, gaze or body controls.

### B · existing Emanata donor

Exact image:

`media/2D_Assets/KFB_Custom/KFB_Emanata_ChatGPT Image 12. Aug. 2026, 16_41_34.png`

Record blob:
`bfcd4780e8d31363eb2ac771909cf800911d9c35`

This donor supplies symbol vocabulary/shape intent. Do not mount it as a billboard and call that 3D.

### C · ClayBound look donor

Choose at least one exact current screenshot/reference from:

`tools/KFB-ToolBox/_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/`

Show it in isolation and record exact path/blob before modeling. Use it for softness, handmade material/read, thickness and lighting language.

A loaded path/URL alone is not evidence that the donor was used.

## Visual constraints

Each Emanatum is a small genuine 3D clay object.

Required:
- chunky readable silhouette;
- soft rounded edges;
- toy/clay thickness;
- matte or semi-matte handmade surface;
- stable, seeded asymmetry;
- cute physical volume;
- camera-readable orientation;
- no dirty facial cast-shadow.

Avoid:
- flat PNG particles;
- razor-thin extruded icons;
- neon/glow;
- hard-surface bevel language;
- generic emoji models;
- mathematically perfect vector stars/hearts;
- per-frame random wobble;
- glossy plastic stock look;
- grey primitive stand-ins in the final candidate.

For manga-style spikes/zacken: translate the 2D graphic language into **rounded tapered clay wedges/tubes with softened tips**, not knife-like geometry.

## Architecture

Do not create another emotion state machine.

`consumer state/event → current acting preset → current face/body channels + Emanata request → Emanata renderer/pool`

Emanata:
- read semantic state;
- resolve actor anchors;
- animate pooled visual mesh instances;
- recover/clear;
- write nothing back into gameplay/AI/physics.

Default active-family budget: **1 family per actor**. Multiple instances inside the family are allowed.

## Minimum anchors

`head_top · head_left · head_right · temple_L · temple_R · eye_L_under · eye_R_under · mouth · actor_center`

If the current actor exposes different concrete nodes/bones, write one adapter map. Do not create a replacement skeleton.

## Proof 1 · Tears

Build actual 3D clay droplets.

### Single tear
- face enters sad/moved pose;
- bead forms at the actual lower-eye anchor;
- short hold;
- detaches;
- stretches subtly along travel;
- falls/arcs;
- clears.

### Tear burst
- 2–4 pooled droplets;
- originates at both real eye anchors;
- fast outward/downward arcs;
- stable geometry/seed;
- all instances recovered.

Important: tears are claymation objects, not realistic water simulation.

## Proof 2 · Hearts

Build a soft asymmetric heart with real thickness.

Motion:
- spawn small above head;
- pop/overshoot;
- pulse 1–2 times;
- rise gently with slight orbit/offset;
- shrink/settle and clear.

Use:
- one heart for a small affectionate beat;
- 2–3 for strong delight/love;
- no infinite fountain.

Coordinate with an affectionate face preset and slight head/body lean.

## Proof 3 · Shock rays

Build 4–8 thick tapered rounded clay rays.

Motion:
- shocked face/body anticipates/starts first;
- rays expand radially around head;
- short readable hold;
- retract/clear.

No thin line shader and no 2D starburst card.

## After the three proofs

If and only if the same architecture is clean, expand from `clay-emanata.v0.1.json` to:

- sweat_drop / panic_sweat;
- anger_knot / anger_spikes;
- question / exclamation / confusion_spiral;
- sparkle / dizzy_stars;
- unease_ticks / gloom_lines;
- steam_puff;
- sleep_z;
- idea_spark;
- optional broken_heart.

Do not create one custom renderer per symbol. Reuse a compact set of geometry construction patterns:

- rounded extruded profile;
- rounded tube/path;
- tapered soft wedge/ray;
- blob/metaball cluster;
- chunky glyph extrusion.

## Face/material effects that stay out of the particle library

Keep these with the actor face/material system:
- blush;
- pallor;
- forehead shading;
- iris/pupil treatment;
- lid/brow deformation;
- mouth shape.

Emanata amplify the face; they do not replace it.

## Performance / lifetime

Use shared geometries/materials and reuse instances.

Prefer:
- `THREE.InstancedMesh` where practical;
- otherwise a small reusable Object3D pool for individual paths;
- no new geometry/material allocation every trigger;
- no per-frame geometry rebuild;
- deterministic seed per event;
- explicit release on recovery.

Add a repeat-trigger test: trigger the same event repeatedly, verify pool count stabilizes and no dead objects accumulate.

## Shadow / lighting rule

The current ToolBox already has face-shadow regressions documented. Do not reintroduce them.

Emanata should read through:
- volume;
- scene light;
- self-shading;
- occlusion;
- scale/spacing.

Default: no actor-face cast shadow from Emanata.

## Small authoring seam only

Do not build a new control dashboard.

Inside the existing Studio/Face/Acting workflow expose only what is needed:

- emotion preset;
- Emanata family;
- intensity;
- variant;
- seed;
- preview trigger / stop.

The Stage remains visually dominant. Remove explanatory text if it competes with the actor.

## Required tests

Run and record actual numbers.

### Baseline
- existing Production tests/self-test before Emanata.

### Source
- donor paths exist;
- donor isolation proof recorded;
- current face owner unchanged.

### Functional
- each of tears/hearts/shock triggers on the real actor;
- all required anchors resolve;
- recovery clears every instance;
- repeat trigger works;
- rapid retrigger does not leak;
- one-family budget works;
- switching emotion cancels/replaces cleanly;
- stable seed does not flicker;
- no Emanata state writes to gameplay/physics.

### Visual
- tears start at real eyes;
- hearts read immediately at normal Resident scale;
- shock rays read as 3D clay;
- no face-shadow contamination;
- no flat-sprite fallback;
- current face/viseme/eye behavior still works.

### Regression
- rerun all existing ToolBox tests;
- no lower pass count than the pre-slice baseline without explicit unresolved return.

## Evidence

Return:
- isolated donor screenshots;
- one integrated sad/tear frame;
- one integrated affection/hearts frame;
- one integrated shock/rays frame;
- one short proof or frame sequence showing recovery/retrigger;
- exact test counts;
- console/browser errors;
- source paths and revisions.

Do not produce a separate grey-shape acceptance microsite.

## Export / handoff

Export a full editable Session Cut without being asked again:

- complete editable code/artifact;
- `SOURCE.json`;
- `TEST_REPORT.md`;
- additive `CHANGELOG.md`;
- `RETURN.md`;
- recovery instructions;
- evidence/screenshots;
- manifest/checksums when the project export convention supports them.

Claude Design does not claim GitHub push, Cloudflare Stage or Live. Web/GitHub rehomes and verifies after export.

## Exactly one next gate

**Integrated three-family Resident acting proof: tears + hearts + shock rays, after RECOVERY-01.**
