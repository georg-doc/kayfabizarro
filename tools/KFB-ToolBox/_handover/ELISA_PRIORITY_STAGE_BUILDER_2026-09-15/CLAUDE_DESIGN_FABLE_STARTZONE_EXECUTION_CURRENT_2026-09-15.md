# KFB ToolBox · Fable Start Zone · CURRENT EXECUTION BRIEF

**Date:** 2026-09-15  
**Status:** CURRENT EXECUTION BRIEF · Georg-gated · no production merge implied

## Precedence

This is the single current execution brief for the next Claude Design / Fable Start Zone slice.

It supersedes for execution:
- `CLAUDE_DESIGN_FABLE_MEGA_SLICE_STARTZONE_2026-09-15.md`

It incorporates and repairs:
- `tools/KFB-ToolBox/_inbox/ACCEPTANCE_COMPLETENESS_ADDENDUM_2026-09-15.md`

The original brief and Coworker addendum remain **ARCHIVED / REVIEW EVIDENCE**. They are not competing execution contracts.

## Governing rule

Every identity-bearing requirement must either:
1. have explicit acceptance evidence; or
2. appear in `MAY BE MISSING` before implementation.

There is no third field.

Before work, silently red-team the brief: what could a literal executor omit, fake, simplify or rename and still claim PASS?

---

# G0 · VISUAL DIRECTION PRE-GATE

**Do this before building the editor.**

Return one still frame, optionally a second from a different azimuth, using the real renderer and real asset pipeline. No image-model concept render, no editor chrome.

The frame must show together:
- rolling terrain/world silhouette;
- actual coast/water relationship;
- lighthouse integrated into the terrain composition;
- readable foreground / midground / background;
- rainbow as a world-space element in depth;
- spatial 3D cartoon clouds;
- reserved Birthday/event clearing inside the same world;
- enough path/negative-space logic for later actors and event dressing;
- target look: **cozy/claymation substrate + KFB skew/asymmetry/cartoon shaping**.

### MAY BE MISSING at G0
- final GothGirl/Hihi presentation;
- finished theatre curtain;
- fireworks;
- Birthday runtime/audio;
- final Town geography;
- final prop population;
- final editor controls.

### Georg decision
Questions only:
- **Wallpaper:** would I keep this on screen?
- **Extendability:** can Birthday, Town and Travel grow naturally from this composition?

Decision: `ACCEPT DIRECTION · REPAIR · REJECT DIRECTION`

No editor build before explicit `ACCEPT DIRECTION`.

---

# G1 · AUTHORING PROOF ON THE ACCEPTED START ZONE

Viewport-first Stage. One navigation layer: `Actor · Face · Pose · Motion · Voice · Stage`.

Authoring loop:
`Browse → Place → Select → Move/Rotate/Scale/Deform → Orbit/Reframe → Duplicate/Variant → Save/Reload`

## Required authoring capabilities

### Camera
- free Orbit;
- pan/zoom;
- 3/4 world and Stage-wide useful views;
- compact `Skewed Cartoon Perspective` control.

### Transform
- viewport select;
- clear selection feedback;
- Translate / Rotate / Scale;
- duplicate;
- remove;
- reset transform;
- Orbit disabled while dragging handles.

### Cartoon Deformer
Non-destructive instance/config modifiers for:
- Bend;
- Skew/Shear;
- Taper;
- Squash/Stretch;
- Twist.

Source Registry asset stays untouched.

First QA case: GothGirl speaker pair or equivalent duplicate pair. Same source family, visibly different intentional shape treatment.

### Resource Picker
Use the existing Registry/Librarian-backed picker:
`Browse → Preview → Place → Transform → Accept/Revert`

Prove actual assets for:
- building;
- tree/nature;
- rock;
- fence/road/path;
- prop;
- light/emissive prop;
- hero landmark.

No second asset database.

### Save/reload
Persist:
- asset identity;
- transforms;
- deformer config;
- active camera/view;
- terrain settings;
- lighting/environment preset;
- active scene variant.

---

# WORLD / TERRAFORMER REQUIREMENTS

`KFB Terraformer & Worldbuilder v1` lives inside Stage, not as another app.

Reuse Travel / TinySkies / Travel-Dome direction; do not create a second world renderer.

Required:
- rolling terrain rather than flat floor;
- visible coastline as terrain/water intersection;
- foreground/midground/background depth;
- lighthouse as integrated world landmark;
- Birthday/event area inside the same terrain;
- readable approach/path logic;
- controlled KayKit demo-inspired clustering rather than random scatter;
- rainbow(s) in world space;
- chunky spatial 3D cartoon clouds with calm drift;
- restrained atmosphere/depth.

Birthday is an **event layer of the Start Zone**, not a detached selector scene.

Spatially reserve:
- curtain/reveal area;
- Uncle FrizzleBob / GothGirl / Hihi performance area;
- D6, disco balls, Newton cradle and speakers;
- later fireworks region;
- camera reveal path / hero composition.

---

# SCENE VARIANTS

Prove:
- `Authoring / Neutral`
- `Birthday Sunset`
- `Night / Disco`

Base geometry and ordinary world-object identities/transforms remain stable across variants.

Variant-only overlays may add explicit lights, emissive helpers, sky/environment changes and FX. A variant must not silently rebuild the world as a separate scene.

---

# MANDATORY RENDER LOOK

Rejected precedent: Astra Birthday visual result.

Target:
**cozy/claymation substrate + KFB skew/asymmetry/cartoon deformation**

Required qualities:
- soft broad key;
- warm/cool fill;
- real soft cast/contact shadows;
- grounded AO feel;
- matte/high-roughness clay/painted response;
- restrained metalness;
- subtle material variation;
- atmospheric depth;
- asymmetrical staging;
- selective deformation;
- no sterile grid-perfect placement;
- no blanket random distortion.

---

# G1 ACCEPTANCE EVIDENCE

Return:

**E1** Full Stage frame in `Birthday Sunset`.

**E2** Wide world frame showing terrain + lighthouse + Birthday-zone relationship.

**E3** Short direct-manipulation capture: select → move/rotate/scale → deform.

**E4** 15–30s clip: Orbit → manipulate/deform → variant switch → moving 3D clouds.

**E5** Save/reload table with before/after values for all seven persisted categories.

**E6** Explicit `REAL / PLACEHOLDER` list.

**E7 Rainbow world-space proof:** two materially different camera positions; show parallax and/or changing occlusion. Red if it behaves like a fixed screen overlay.

**E8 Skew proof:** identical scene, camera transform and normal FOV; skew OFF vs ON; report skew/projection parameter values. Red if no visible projection change or if it is only an ordinary FOV rename.

**E9 Night/Disco proof:** same base scene and camera; changed environment/light/emissive/FX; base object identities/transforms stable. Explicit variant-overlay nodes are allowed.

**E10 Coast/depth proof:** annotated wide frame naming at least one foreground, midground and background element plus the visible terrain/water intersection.

**E11 Deformer-by-kind strip:** same prop/camera showing undeformed + Bend + Taper + Squash/Stretch + Twist + Skew, with config values. Required visible behavior:
- Bend = curvature change;
- Taper = progressive width/scale gradient;
- Squash/Stretch = axis compression/extension;
- Twist = progressive angular rotation;
- Skew = shear/relative offset.

**E12 Speaker asymmetry:** same source asset twice, distinct non-destructive configs, deliberate visible asymmetry, same family identity.

**E13 Reload completeness:** no blank/`n/a` rows among the seven persisted categories unless predeclared missing.

**E14 Resource coverage:** actual named asset for each of the seven required Resource Picker categories.

---

# MAY BE MISSING AT G1

Only these omissions are allowed without defect:
- final GothGirl presentation;
- final Hihi presentation;
- final cloth curtain implementation;
- final Town geography;
- fireworks effect itself if location is reserved;
- Bulge/Pinch;
- local/world transform mode;
- extra camera presets beyond minimum useful views;
- cloud-specific lighting cues;
- Birthday runtime state machine/audio;
- universal full-body IK;
- full Performance Suite;
- universal KayKit Frankensteining;
- production Travel integration.

Anything identity-bearing that is absent and not listed here is a defect.

---

# GEORG G1 DECISION

Questions:
- **Tool:** would I actually want to build the Start Zone in this editor?
- **World:** is this the spatial/rendering direction for KFB?
- **Wallpaper:** is the settled composition attractive enough?
- **Screensaver:** does it stay alive for 30–60 seconds without becoming noisy?
- **Extendability:** can Birthday/Town/Travel grow naturally from it?

Decision: `ACCEPT · REPAIR · REJECT DIRECTION`

No automatic continuation without explicit ACCEPT.

---

# FABLE → ASTRA/CODEX HANDOVER CONTRACT

Screenshots are not enough.

The accepted package must contain where technically applicable:
- runnable accepted prototype/source artifact;
- scene bundle/config;
- world bundle/config;
- actor/pose/deformer configs used by the target;
- asset manifest with stable Registry/source IDs;
- camera + variant + lighting/environment config;
- explicit REAL/PLACEHOLDER manifest;
- acceptance captures E1–E14;
- short owner/source map.

Preferred downstream mode: **integration/adaptation** of accepted artifacts into existing production owners.

If Astra/Codex cannot consume an accepted implementation directly, mark the task `REIMPLEMENTATION REQUIRED`. Reimplementation must re-prove the relevant acceptance evidence and may not visually simplify/reinterpret the accepted target merely for convenience.

---

# BLENDER / MCP FALLBACK

**PROPOSAL / DEFERRED.** Blender may later become an offline precision workshop for mesh deformation, rig/IK, cloth, UV/material and GLB export.

Trigger only when the same concrete browser-authoring task fails twice for the same structural reason and the expected Blender result is already defined.

Do not switch the current owner/workflow now.

---

# MODEL / COST RULE

- Chat / Sol Medium–High: planning, source reconciliation, contracts.
- Asset Librarian chat + connectors: inventory/mapping.
- Claude Design / Fable: visual direction, world composition, authoring UX.
- Georg: explicit product gates.
- Astra/Codex/Work: production integration and browser QA only after target acceptance.

Hard preflight before expensive execution:
`Coverage · Reference · Acceptance`

If one is missing, do not launch a broad autonomous run.

---

# STATUS

- **DECISION:** this is the single current Fable Start Zone execution brief.
- **DECISION:** visual-direction Gate 0 precedes editor construction.
- **DECISION:** Birthday is an integrated event layer of the Start Zone.
- **DECISION:** lighthouse, coast/depth, rainbow and 3D cartoon clouds are identity-bearing world requirements.
- **DECISION:** acceptance coverage is requirement-linked; allowed omissions are predeclared.
- **DECISION:** Fable→Astra transfers runnable/configurable artifacts, not screenshots alone.
- **DECISION:** unavoidable downstream reimplementation is explicit and must re-prove the target.
- **PROPOSAL / DEFERRED:** Blender+MCP fallback after repeated structural browser failure.
- **IMPLEMENTATION:** none claimed by this brief.
- **TESTED RESULT:** none for this slice yet.
