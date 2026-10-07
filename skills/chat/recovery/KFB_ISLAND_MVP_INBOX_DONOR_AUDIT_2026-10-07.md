# KFB Island MVP · ToolBox _inbox Donor Audit · 2026-10-07

Status: **SOURCE/DONOR AUDIT · NO NEW RUNTIME OWNER · NO MVP**
Scope: `tools/KFB-ToolBox/_inbox/`
Observed top-level entries: **115**
Receiving product owner remains: **KFB WorldBuilder / WB2 · Issue #360 · Draft PR #348**

Purpose: prevent useful Claude Design / ToolBox slices from disappearing before the final Island-MVP One-Shot, while preventing historical inbox projects from silently becoming new owners.

## 0 · Inbox rule

The repository's own `_inbox/README.md` is binding:

- `_inbox` is an intake/source/donor area;
- an inbox package is **never automatically the implementation owner** of a consumer;
- source pins/status must not be inferred from filename suffixes;
- archived/superseded packages remain evidence, not current product truth.

This audit therefore classifies mechanisms and source families, not whole folders as new runtimes.

## 1 · Result

No missing capability found in this pass requires a **new REQUIRED row**. The Frozen Matrix remains:

- **44 REQUIRED**
- **12 STRONGLY INCLUDE**
- **7 OPTIONAL PROOF**
- existing LATER scope unchanged.

The audit materially strengthens the donor roster behind existing rows, especially:
- F-R17 Drive / F-S03 Flight kinetics;
- F-R20/F-R23 Claybound + Grounding;
- F-R28 direct authoring/snap/grounding;
- F-R32/F-R33/F-R34 Resident/ChatterBox/Card staging;
- F-R35 Billboard;
- F-S09 Clay transform / visual feedback;
- optional VFX/contact/destruction presentation.

## 2 · ACTIVE / USEFUL DONORS · preserve for final One-Shot intake

### D-01 · WhackMan v1-1 · generic Cartoon Contact / Bounce / Camera donor

Source:
`tools/KFB-ToolBox/_inbox/KFB WhackMan v1-1/WHACKMAN_SESSION_2026-09-22/`

KEEP / ADAPT:
- `wm-collide.js` is explicitly written without WhackMan-specific assumptions and is reusable as a **generic additive contact/bounce pattern**;
- canonical position remains authoritative; cartoon feedback is layered as temporary offsets/springs;
- hit reaction: vertical impulse + spin + fall + landing squash + recovery;
- actor/actor soft separation;
- prop/contact reaction returns to the fixed anchor rather than permanently distorting the authored layout;
- chase-camera arm shortening on collision;
- free-look with return to chase framing after movement.

Important lessons:
- spring/threshold logic must be verified on actual integration steps/zero crossings;
- permanent pushing of authored props was rejected; reactions should preserve the authored anchor;
- WhackMan itself, MazeGraph, dots/pursuers/minimap/game loop are **not** Island-MVP scope.

Classification:
**PRESERVE DONOR · OPTIONAL/STRONG INTERACTION FEEDBACK · REJECT AS RUNTIME OWNER**.

### D-02 · VFX-01 Review · source-isolated VFX donor bank

Source:
`tools/KFB-ToolBox/_inbox/KFB_VFX_01_REVIEW/`

Actually inspected in the returned review:
- Brackeys VFX Bundle;
- FreeHitVfx;
- free-cartoon-smoke-effects;
- Tiny Swords Particle FX;
- explosions_smoke;
- Kenney smoke-particles;
- real KFB Combat Ink Atlas + VFX recipe/sprite modules;
- Boxel Blitz audio-feedback POC.

Use:
- source-isolated candidate bank for shooting, impact, dust, explosion, smoke, transfer, vehicle and Flight presentation;
- compare against Seed World / Combat Mech POC and current Combat-Arena FX before choosing a consumer donor.

Boundary:
- some Combat FX files were only pinned, not opened in VFX-01; read fresh if needed;
- no new global VFX engine;
- visual family selection remains a product/source-isolation decision.

Classification:
**PRESERVE DONOR BANK · STRONGLY USE FOR DONOR ARBITRATION**.

### D-03 · Vehicle Animation Lab v4 · real Travel-flight-state → Cartoon kinetics seam

Source:
`tools/KFB-ToolBox/_inbox/KFB Vehicle Animation Lab v4/KFB_Vehicle_Lab_v4/`

KEEP:
- byte-identical Travel Flight source was run in the lab rather than reimplemented;
- `travel-flight-seam.v1.js` consumes real speed, bank, pitch, drift, climb, boost and derived acceleration/yaw/touchdown;
- measured multi-fixture flight frames/pivots;
- Flight deformer changes presentation, not physics.

Related vehicle-deformer donors:
- group/spring-based squash/stretch/roll/pitch;
- fishtail;
- two-wheel;
- tumble/barrel-roll;
- manoeuvre layers;
- deterministic review sequences.

Known FX donors referenced by this line:
- Speed Lines;
- Contrails;
- Drift Smoke;
- Impact Dust;
- Carpet Wake;
- post-radial pass.

Classification:
**STRONG DONOR for F-S03 Flight kinetics and future Drive cartoon response · NOT physics owner**.

### D-04 · Plant Prop Lab v2 · deterministic living-prop recipe

Source:
`tools/KFB-ToolBox/_inbox/KFB_Plant_Prop_Lab_v1/KFB_Plant_Prop_Lab_v2_EXPORT_2026-09-19/`

KEEP:
- unchanged source assets assembled by measured deterministic recipe;
- same recipe + seed = same composition;
- measured insertion/ground/contact dimensions;
- source materials cloned before adaptation;
- rig moves pivots, not world ownership;
- `STATIC | AMBIENT | AWARE` life layer;
- existing EyeRig reused; no second eye system;
- 72/72 source parts measured in its own evidence.

Caveat:
- old recipe revision used `main` rather than immutable commit; receiving integration must pin actual source revision.

Classification:
**STRONG environment/living-prop donor behind F-R21/F-R22/F-R23; no new world owner**.

### D-05 · Billboard B0 Source Proof · accepted billboard anatomy/source proof

Source:
`tools/KFB-ToolBox/_inbox/KFB Billboard Media Szene · B0 Source Proof/BILLBOARD_B0_SOURCE_PROOF_2026-09-24/`

Status:
**Georg accepted 2026-09-24**.

KEEP:
- real Kenney billboard source;
- merged-mesh material-slot face measured rather than guessed;
- exact visible ad face **4.20 × 2.10** in the tested scale;
- real KFB Card placed flush to source face;
- source failure shown honestly; no replacement art.

Classification:
**PRIMARY source/anatomy donor for F-R35 Billboard source fidelity**.

### D-06 · World Billboard Clay01 · island/road anchor and billboard runtime budget donor

Source:
`tools/KFB-ToolBox/_inbox/KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/`

KEEP / ADAPT:
- one-body / one-image-surface toy-clay billboard candidate;
- host scheduler rather than self-owned clock;
- explicit near/mid/far activity/LOD concepts;
- collision mode;
- `billboard.embed-spec.v1` road anchor:
  `mode=road · t · side · offsetFromKerb · groundSnap`.

Boundary:
- current `kaleido-cuts` content mode is not the new required HyperNormalisation/Quote consumer;
- structure PASS in its slice, timing NOT_RUN, Georg acceptance OPEN.

Classification:
**STRONG anchoring/LOD/geometry donor for F-R35/F-R23; content owner remains current Billboard/HyperNormalisation**.

### D-07 · Billboard Kaleidoscope H13 · visual/content motion donor; Collage Engine v0 rejected

Source:
`tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H13/`

KEEP:
- H4 lineage and H13 as authored music-driven collage reference;
- real KFB Cards and provenance-tracked/public-domain material mechanisms;
- useful timing/visual composition ideas.

REJECT:
- `collage-engine v0` is explicit Georg HUMAN FAIL / AI-slop candidate;
- no independent randomization of typography/effect/palette/text/mix as a quality strategy.

Current Island rule:
real HyperNormalisation + Quote Pool outranks the old random collage runtime, but H13 may donate authored visual language.

Classification:
**REFERENCE/STRONG VISUAL DONOR · COLLAGE ENGINE v0 GRAVEYARD**.

### D-08 · Resident Card Speculation Scene · thin Scenelet/Card/dialogue staging donor

Source:
`tools/KFB-ToolBox/_inbox/KFB Resident Card Speculation Scene/npc-card-spec-01_2026-09-24/`

KEEP / ADAPT:
- thin `mountResidentScene(...)` seam;
- real FrizzleBob Graft + GothGirl;
- EyeRig v6 + PetMouth;
- one canonical real Card;
- deterministic beat seek;
- one shared Card object;
- gaze impulses, speech bubbles, persona/Card commentary data;
- one mixer per actor.

TUNE/open:
- talk clip was missing and used an Idle stand-in;
- facehost/mouth tuning remained;
- no voice audio in that candidate;
- Georg visual acceptance remained open.

Classification:
**STRONG staging donor for F-R32/F-R33/F-R34 · NOT accepted current ChatterBox runtime**.

### D-09 · ToolBox P07/P08 editor lineage · snap / grounding / inline 3D editor

Sources include:
- `KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1`;
- `RETURN_TOOLBOX_PRODUCTION_07.md`;
- P08 reconciliation note.

KEEP:
- `edit-layer v2`;
- `snap.v1`;
- `grounding.v1`;
- undo/redo/focus/in-place object controls.

Version warning:
- P07 was not a linear successor of P06;
- P08 merged later rigging state with P07 editor and received a separate storage key;
- final Island consumer must resolve the current shared owner instead of copying an obsolete P06/P07 fork.

Classification:
**SOURCE/MECHANISM DONOR behind F-R23/F-R28 · existing WB2 editor remains consumer owner**.

### D-10 · World Core R0A Clay World Donor · composition / grounding reference only

Source:
`tools/KFB-ToolBox/_inbox/KFB World Core R0A · Clay World Donor/`

Useful visual mechanisms:
- Track→clay ridge→bridge/river→city-street continuity;
- baseplate-free buildings;
- terraces/slope cuts / partial burial;
- pressed clay ground seam around buildings;
- sparse clusters instead of blocks;
- walk/drive/flight composition masks;
- authored small landmarks.

Hard limitation:
- design preview was extremely expensive (~404k scene triangles, ~313 calls, reported ~6 fps in that preview);
- candidate/design donor only, not runtime truth.

Classification:
**VISUAL/GROUNDING DONOR for F-R22/F-R23/F-R39 · NEVER runtime/performance baseline**.

### D-11 · KlayBound / ClayBound POC + Style Reference

Source:
`KFB KlayBound POC 01.zip` and ClayBound Style Reference lineage.

Binding interpretation already present in current project:
- Claybound = visual comparison benchmark;
- KFB KlayBound POC is useful evidence but explicitly sub-optimal relative to the benchmark;
- POC does not replace WorldBuilder/Travel/Race/Clay owners.

Classification:
**BENCHMARK / REFERENCE · POC NOT OWNER**.

### D-12 · Public Domain Pool · provenance-tracked media source

Source:
`tools/KFB-ToolBox/_inbox/KFB Public Domain Pool - 02/`
plus current `tools/public_domain/` and `media/public_domain/`.

Use:
- provenance/rights-tracked visual media for Billboard/HyperNormalisation/H13-style authored material where appropriate.

Boundary:
- copyright/public-domain metadata does not automatically clear trademarks/privacy/restoration rights;
- current Quote/HyperNormalisation semantics still own content selection.

Classification:
**CONTENT SOURCE DONOR · NOT runtime owner**.

## 3 · REFERENCE / OPTIONAL DONORS

### R-01 · Racetrack Blender Kit
Useful for:
- measured track profile anatomy;
- support/arch/ground-transition contact;
- source-first module review;
- BVH/support checks.

Not for:
- replacing Track Core/Joyride;
- changing route, handling or vehicle physics.

Classification:
**AUTHORING/ANATOMY REFERENCE ONLY**.

### R-02 · Card Zone Lab v2
Useful:
- exact source Card Zone / Card Stack / projector / fluid-water mechanisms;
- source-locked fluid donor.

Limits:
- attempted ToolBox-module extraction was explicitly stopped after repeated failure;
- exported source itself was preserved; extracted modules are unvalidated.

Classification:
**REFERENCE/OPTIONAL Card/Water donor · DO NOT IMPORT FAILED EXTRACTION**.

### R-03 · StoryMap v1
Useful:
- map/board camera/presentation;
- Board Game Bits as source ideas;
- source-locked Card-Zone fluid comparison.

Limit:
- water visibility bug remained open;
- not a green runtime donor.

Classification:
**REFERENCE / OPEN-BUG DONOR ONLY**.

### R-04 · ProceduralTerrain Concept
Repository inbox README classification:
**LOOK REFERENCE ONLY · no reusable terrain runtime proven**.

Classification:
**REFERENCE ONLY · Surface Truth remains owner**.

### R-05 · Environment Atlas / Room Study / older World-Design packages
Use exact source-proven modules where current owner audit says KEEP.
Do not reconstruct missing S14–S17 runtime from prose.
Older World/Hex/Project-Island compositions do not override the current continuous bounded-island direction.

Classification:
**SELECTIVE DONORS / HISTORY DEPENDING ON EXACT SOURCE**.

### R-06 · Claude outputs
Current folder contains only isolated review PNG outputs (e.g. band/grip images), not an implementation owner.

Classification:
**EVIDENCE ONLY**.

## 4 · HISTORY / DO NOT REACTIVATE AS PRODUCT OWNER

- Birthday execution/reference lineage: archived FAIL/outdated per inbox README.
- old ToolBox ZIPs / Studio versions: provenance/measured donor only unless a current owner explicitly points to one.
- ProceduralTerrain as runtime.
- Collage Engine v0.
- failed Knet-Strecke candidates.
- old Project-Island / Platformer candidates already in Prototype Graveyard.
- any inbox copy whose own Return says candidate/TUNE/source-only may not be promoted wholesale.

## 5 · Existing matrix stacks already present in inbox

These were already represented in the Frozen Matrix/Census before this audit and remain important:
- Joyride J14–J17;
- Seed World / Combat Mech Destruction;
- SKY3 Skydome/Clouds;
- UFO Tractor Beam Event Lab;
- Theatre Curtain;
- K1/H0 + K2/v10 Clay packages;
- Resident Atlas current cuts;
- World Integration / WB2 donors;
- Style References / Etherington;
- Environment Atlas;
- World Core R2C/R2D historical donors;
- Combat Arena KayKit source package.

This audit does not duplicate their ownership.

## 6 · Donor routing into Frozen Matrix

| Donor | Primary matrix relation | Use |
| --- | --- | --- |
| WhackMan generic Bounce/Collision | F-R14 / F-S05 / optional feedback | additive reaction/contact pattern only |
| VFX-01 donor bank | F-S03 / F-S09 / Combat donor arbitration | source-isolated VFX family selection |
| Vehicle Lab v4 | F-S03 / F-R13 | flight-state → cartoon kinetics |
| Vehicle Deformer v2 | F-R17 / F-S03 | optional Drive cartoon response |
| Plant Prop v2 | F-R21 / F-R22 / F-R23 | deterministic source-first living props |
| Billboard B0 | F-R35 / F-R21 | accepted source/anatomy proof |
| Billboard Clay01 | F-R35 / F-R23 | road anchoring / LOD / geometry |
| H13 | F-R35 / F-R36 | authored visual/content motion donor only |
| Resident Card Speculation | F-R32 / F-R33 / F-R34 | Scenelet/Card/EyeRig/Bubble staging |
| ToolBox P08 editor lineage | F-R23 / F-R28 | snap/grounding/edit mechanisms |
| World Core R0A | F-R22 / F-R23 / F-R39 | composition/grounding visual donor |
| Public Domain Pool | F-R35 / F-R36 | provenance-tracked visual content source |
| Racetrack Blender Kit | F-R15/F-R16 authoring reference | supports/arches/transition anatomy |
| Card Zone / StoryMap | F-R26/F-R34 optional reference | fluid/Card presentation donors only |

## 7 · One-Shot intake rule

The final Work/WSA One-Shot brief must read:
1. Frozen Matrix v2;
2. this Inbox Donor Audit;
3. Integration Census;
4. current WB2 Island Foundation/Return;
5. exact specialist owner Returns only when their row opens.

It must **not** bulk-import `_inbox`.
For every reused donor:
`exact source → isolate → KEEP/ADAPT/REJECT → integrate through current owner → critic proof`.

## 8 · Next gate

**No new architecture gate.**
Use this audit as source routing when writing the final Work/WSA Island MVP ONE_SHOT brief.

