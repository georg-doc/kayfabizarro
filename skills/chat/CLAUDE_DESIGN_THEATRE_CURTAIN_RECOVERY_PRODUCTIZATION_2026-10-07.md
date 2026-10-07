# Claude Design · KFB Theatre Curtain Recovery + Productization · 2026-10-07

Status: **READY · GITHUB-READABLE CLAUDE DESIGN JOB · NO SITE ACCESS REQUIRED**
Executor: **Claude Design**
Issue: **#372**
Owner: **KFB Theatre Curtain / transition presentation**
Execution mode: **BOUNDED_SLICE**
Receiving product later: **KFB Open World / Character Select / in-game reveal consumers**
Protected Open World owner: **Issue #360 / PR #348**
Recommended work branch: `design/theatre-curtain-recovery-2026-10-07`

## 0 · Outcome

Recover the **existing physical KFB Theatre Curtain**, prove the old donor in isolation, analyse the failed WSA/Birthday integration against it, and produce one isolated modular design candidate that can later be consumed for:

1. loading / boot cover and reveal;
2. Character Select;
3. optional in-game theatrical reveal.

This is **not** permission to rebuild the Open World, invent a second Curtain engine or reintroduce the failed UI/plaque/branding solution.

The visible design question is:

**How do we keep the proven physical two-panel Curtain behavior, make it read as a convincing old KFB theatre curtain, and leave a small reusable transition module rather than another start-screen hack?**

## 1 · Read first

Read in this order:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. this file
5. `skills/chat/KFB_STYLE_REFERENCE_ROUTER_2026-10-07.md`
6. `tools/KFB-ToolBox/_inbox/KFB Theatre Curtain v2/2026-09-24-theatre-curtain/docs/HANDOVER_WSA_THEATRE_CURTAIN_2026-09-24.md`
7. `tools/KFB-ToolBox/_inbox/KFB Theatre Curtain v2/2026-09-24-theatre-curtain/docs/POSTMORTEM_2026-09-24_theatre-curtain-stripe-artifact.md`
8. `tools/KFB-ToolBox/_handover/BILLBOARD_CURTAIN_NEXT_2026-09-24.md`
9. `skills/chat/recovery/CLAUDE_COWORKER_BRIEFING_AUDIT_2026-09-15/FAILURE_TIMELINE.md`
10. `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/GOLDEN_JOURNEY_MVP_2026-10-04.md`
11. `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/CURTAIN_CHARACTER_SELECT_MVP_2026-10-04.md`

Do not require Site access. All required design evidence is in GitHub.

## 2 · Authority correction

There are several historical Curtain layers. Do not flatten them into one “Curtain” source.

### A · CURRENT VISUAL / PHYSICAL DONOR · KEEP

Root:
`tools/KFB-ToolBox/_inbox/KFB Theatre Curtain v2/2026-09-24-theatre-curtain/`

Primary candidate:
`KFB Theatre Curtain v2.html`

Known result:
- two independent left/right physical cloth panels;
- WebGPU compute cloth;
- symmetric opening/closing;
- closed overlap with no centre gap;
- cleaner, straighter folds after tuning;
- solid red + sheen + HDR/environment response;
- **no tiled fabric texture**;
- no stripe/flicker artifact reported in the recovered v2;
- closed/open states were checked.

Reference screenshots:
- `screenshots/v2-closed.png`
- `screenshots/postmortem-donor-webgpu-clean.png`

This is the visual/physical donor to show in isolation **before adapting anything**.

### B · HISTORICAL FAILED CLOTH PATH · REJECT AS IMPLEMENTATION

Historical v1 CPU-Verlet + tiled KFB fabric texture path:
`KFB Theatre Curtain.dc.html`
and
`game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs`

Its postmortem records five non-improving repair attempts against moving stripe/flicker artifacts.

Do not “improve” this path again.
Use it only for:
- lessons;
- old control/wrapper ideas;
- comparison evidence.

### C · FAILED / OVERLOADED CONSUMER PRESENTATION · NEGATIVE EVIDENCE

The later Birthday/Astra and Playable-MVP planning/integration lineage introduced or amplified:
- cheap/wrong Curtain behavior in a failed user-facing implementation;
- insufficient loading feedback;
- unreliable Enter/click feedback;
- clay `BLÖDSINN!` and `Enter` plaque concepts;
- replacement sign/wordmark treatment;
- UI/SVG-like layers over the Curtain.

Georg's current direction for this recovery supersedes those presentation choices.

**REJECT as binding direction:**
- fake Claymation 3D sign as replacement branding;
- sloppy replacement wordmark;
- big SVG/UI graphics layered over the physical curtain;
- generic splash-screen composition;
- any consumer implementation that hides or replaces the physical Curtain donor.

A historical concept may still contain a useful semantic idea such as “loading cover → actor select → reveal”, but its **visual execution is not the donor**.

## 3 · Primary visual reference · GitHub readable

Use this exact image as the primary mood/look reference:

`tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/CURATIN-THREE-js - old-stage-red-curtains-wooden-architecture-dilapidated-velvet-set-aged-ornate-stone-architectural-frame-387640660.webp`

Blob:
`068887825acd85d78bf27d7fdbf89066518670ec`

Role:
**BENCHMARK / VISUAL DIRECTION — NOT 1:1 TEMPLATE**

Extract only the useful grammar:
- aged dark-red velvet;
- believable cloth weight;
- large readable folds;
- worn / imperfect material;
- old theatre/proscenium feeling;
- physical architectural framing;
- shadowed depth around the stage opening.

Do not copy its exact architecture or ornament.

## 4 · First gate · source isolation

Before creating the candidate:

1. show/render the exact `KFB Theatre Curtain v2.html` donor unchanged;
2. capture at least:
   - closed;
   - partially opening;
   - open;
3. show the old-theatre visual reference beside it;
4. state what is:
   - `KEEP`
   - `TUNE`
   - `REJECT`

A loaded path is not proof.
The actual donor must be visibly isolated.

## 5 · KEEP / TUNE / REJECT baseline

### KEEP

Unless isolated evidence disproves it:
- two physical cloth panels;
- real deformation/gathering;
- physical centre opening;
- deterministic open/close;
- v2 clean WebGPU donor technique;
- current separation between Curtain presentation and host/world state.

### TUNE

Expected tune seams:
- cloth colour/material richness;
- old/aged theatre read;
- fold weight/readability;
- top attachment / rings/hooks readability;
- optional lower-third tieback/swag grammar if it improves theatre recognition;
- proscenium/pelmet/trim as separate physical presentation;
- lighting/environment response;
- loading / Character Select / in-game composition around the Curtain.

### REJECT

- flat CSS/SVG curtain;
- rigid translating panels;
- giant plaque/sign as fake KFB identity;
- replacement wordmark invented for this module;
- dashboard/splash-screen chrome;
- text/UI fighting the physical Curtain;
- decorative micro-detail that flickers or crawls during cloth motion.

## 6 · Material / texture problem · binding technical caution

The current v2 looks too cheap/simple for the desired old-theatre direction, but **do not solve that by blindly restoring the old tiled texture stack**.

The postmortem is explicit:
- tiled fabric maps on moving cloth were associated with stripe/flicker artifacts;
- anisotropy, topology, normal tuning and analytic normals did not solve the old path;
- the clean WebGPU donor gets its fabric read from geometry/folds + solid colour + sheen + environment light.

Therefore separate:

**A. cloth identity / physical motion**
from
**B. old-theatre surface character**.

### Material directions to explore

Produce 2–3 bounded directions, including these families:

#### Direction A · Donor-clean aged velvet
- keep cloth free of tiled normal/roughness maps;
- deep oxblood / burgundy base;
- tuned sheen + roughness;
- lighting/environment does most of the velvet read;
- age comes primarily from colour/value and stage context.

#### Direction B · Motion-safe macro patina
- Direction A foundation;
- add only low-frequency, non-repeating colour/roughness variation;
- no obvious tiled grain;
- no high-frequency normal map;
- prove several moving frames before calling it usable.

#### Direction C · Clean cloth + aged theatre hardware
- moving cloth stays technically simple/stable;
- age/detail is carried by separate:
  - rail;
  - rings/hooks;
  - tieback/cord;
  - pelmet/valance;
  - proscenium/trim;
- these may carry stronger wear, chips, abrasion or patina because they do not deform like cloth.

You may combine the best of A/B/C in the preferred candidate.

## 7 · Texture search / source rule

Before inventing or importing a new texture:

1. inspect the existing repo-visible Curtain/fabric assets;
2. inspect the KFB Style Reference Router;
3. inspect the exact old-theatre reference image;
4. ask whether a texture is actually necessary.

A candidate texture is acceptable only when:
- exact source/provenance is recorded;
- licensing/usage status is known;
- it is shown in isolation;
- its use is non-destructive/reversible;
- moving-frame proof shows no crawling/striping/flicker;
- it improves the old-theatre read beyond colour/sheeen/lighting alone.

If no repo-backed texture passes this bar:
**do not block the design job.**
Return the preferred motion-safe material recipe and mark external texture sourcing as optional follow-up.

## 8 · Module use cases

Design one Curtain module, not three separate screens.

### Loading / boot

Current practical reason:
the game currently has a several-second critical-load window.

Desired behavior:
- Curtain is already closed / visually settled while critical loading proceeds;
- loading feedback is minimal and subordinate to the physical stage;
- reveal happens only when the host says the minimum playable bundle is ready;
- no fake percentage.

Do not design a generic loading page in front of the Curtain.

### Character Select

Reuse:
`CURTAIN_CHARACTER_SELECT_MVP_2026-10-04.md`
for semantic intent only.

Keep:
- actual real 3D selected Actor;
- optional left/right actor selection;
- Curtain as theatrical framing/reveal.

Reject:
- the old fake plaque/sign presentation as mandatory design;
- RPG stat wall;
- creator wizard;
- generic card carousel.

### In-game reveal

Support a simple theatrical event use:
- cover;
- transition;
- reveal;
- close/reopen where useful.

Do not make Curtain Core own game state, navigation, camera, save, audio or dialogue.

## 9 · Minimal module state grammar

Design around a small contract, conceptually:

- `closed_rest`
- `covered_wait`
- `opening`
- `open_rest`
- `closing`
- `impact`
- `fallback_reveal`

Host facts may include:
- `loadingReady`
- `selectedActorReady`
- `revealAllowed`
- `reducedMotion`

Claude Design may refine visual timing, but must not invent a second runtime state owner.

## 10 · Branding / typography rule

**Curtain is the identity-bearing object.**

Do not compensate for weak Curtain design with a large branding object.

Preferred hierarchy:
1. cloth / stage;
2. selected actor or revealed world;
3. only then restrained text if actually needed.

Rules:
- no fake KFB plaque;
- no replacement logo;
- no sloppy wordmark;
- no huge floating 3D sign;
- no SVG art pretending to be the stage.

If a title/loading hint is necessary:
- use restrained clean type or an existing canonical KFB wordmark only if source-proven;
- keep it small enough that the Curtain still reads first;
- make it removable by the consumer.

## 11 · Isolated candidate output

Fork; do not overwrite the donor.

Recommended candidate owner:
`tools/KFB-ToolBox/_inbox/KFB_THEATRE_CURTAIN_RECOVERY_CLAUDE_DESIGN_2026-10-07/`

Return:
- source donor copy/reference, unchanged;
- candidate code;
- `SOURCE_AUDIT.md`;
- `FAIL_ANALYSIS.md`;
- `KEEP_TUNE_REJECT.md`;
- `MATERIAL_LOOK_STUDY.md`;
- `CURTAIN_MODULE_CONTRACT.md`;
- `IMPLEMENTATION_HANDOFF.md`;
- `RETURN.md`;
- before/after and motion-sequence stills.

Do not require a GPT Site or Cloudflare Stage for this design slice.
GitHub-readable files/evidence are the handoff surface.

## 12 · Required visible proof

Minimum:
- donor closed;
- donor open;
- preferred candidate closed;
- preferred candidate mid-open;
- preferred candidate open;
- one Character Select composition;
- one loading composition;
- one in-game reveal composition or storyboard;
- at least 3 sequential moving frames for any new cloth material treatment.

The candidate must prove the **real Curtain donor remains present**.

## 13 · Critic questions

Judge:

1. Does this immediately read as an old theatre curtain?
2. Does the cloth still look physically suspended and heavy?
3. Is the actual Curtain more important than UI/branding?
4. Is the old WSA/Birthday fake-sign/SVG-overlay failure clearly gone?
5. Does the material stay visually stable while moving?
6. Can the same module credibly cover loading, Character Select and an in-game reveal?
7. Does it feel KFB without relying on generic “clay” decoration?

## 14 · Protected boundaries

Do not:
- edit PR #348 / Open World runtime;
- create another Curtain simulation owner;
- replace v2 with CSS/SVG/video;
- reanimate from scratch before donor isolation;
- create a new KFB logo/wordmark;
- build ChatterBox, Character Creator or loading-state runtime;
- publish a Site;
- touch Hub shell/CSS;
- merge;
- promote Live.

After two non-improving repair passes on one material/motion seam:
preserve the candidate, classify the smallest failing seam, and continue the rest of the design packet unless that seam blocks the Curtain outcome.

## 15 · Done when

PASS for this Claude Design job means:

- exact v2 donor is shown in isolation;
- the failed WSA/Birthday presentation is clearly diagnosed;
- one preferred old-theatre Curtain candidate exists;
- material strategy is motion-safe rather than still-image-only;
- Loading / Character Select / in-game uses share one module grammar;
- fake plaque/sign/wordmark/SVG-overlay behavior is absent;
- implementation handoff is specific enough for a later runtime owner;
- no Open World or consumer runtime was mutated.

## 16 · Return

Return exact:
- repo;
- branch;
- head;
- changed files;
- donor paths + blobs;
- visual-reference path + blob;
- generated candidate/evidence files;
- actual motion/frame/browser/design checks performed;
- KEEP/TUNE/REJECT conclusions;
- material direction selected;
- unresolved items;
- exactly one next gate.

No merge.
No Live promotion.
