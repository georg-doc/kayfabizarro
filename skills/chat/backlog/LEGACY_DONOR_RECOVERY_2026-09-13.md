# KFB Legacy Artifact Recovery · Lead commentary

Status: `SOURCE-READ DONOR AUDIT / BACKLOG INPUT`
Date: 2026-09-13
Lead context: Georg + ChatGPT Web
Source package: `georg-doc/KFB-Stunt-Car-Race/_inbox/KFB_legacy_artefacts_claude_ws0/`

Read first:
- `KFB_LEGACY_ARTIFACT_RECOVERY_REPORT_2026-09-13.md`
- `DONOR_CANDIDATES.json`

## Evidence boundary

The Claude WS0 recovery report is useful and unusually disciplined: it labels `SOURCE FACT`, `TESTED`, `INFERENCE` and `PROPOSAL`, and explicitly says it read source/docs but did not execute the `.dc.html` artifacts itself.

Therefore this audit is **not** authority to promote every local `CURRENT_TOOL` label into the central KFB router. Promotion still requires an exact current source path/revision plus the consumer-specific proof that matters.

## Lead interpretation

### 1 · Do not rebuild the recovered systems

The report identifies a real repeated-regression pattern. Before creating new presenter, eye, mouth, speech bubble, ground-shadow, camera, pinball hit/VFX/audio, asset-loading, die-physics or 2D overworld helpers, search this donor audit first.

Use the same treatment vocabulary already proven in Travel:

`REUSE UNCHANGED` · `ADAPT` · `EXTRACT MODULE` · `REFERENCE ONLY` · `DEFER` · `REJECT`

Every actual adoption must name source repo/revision/path and the consumer seam.

### 2 · Actor ownership remains singular

The recovered Cube Pet/Pet Stack is a strong donor for **cube-pet presenters and related avatar tooling**. It does **not** silently replace the current FrankenStein/FrizzleGraft owner for the FrizzleBob Driver line.

Current rule:
- FrankenStein Studio v16/v17 line owns the current Driver actor/look/rig/static-pose authoring contract once the current version is explicitly promoted.
- Cube Pet Podcast/Pet Stack remains a donor for cube-pet presenters, eye/mouth/motion behavior and future Presenter/Podcast tooling.
- Consumers must not merge the two stacks into two simultaneous owners of eyes, mouth, pose, actor material or mixer state.

### 3 · Highest-value recovered donor families

#### P0 · Pin / locate exact canonical sources

- Cube Pet/Pet Stack composition layer and high-level `cube-pet.js` avatar API.
- `ground-plane` / stamp-shadow solution and its postmortem, because the same shadow problem was repeatedly rebuilt incorrectly.
- `kfb-pinball-vfx.js` + `kfb-pinball-audio.js` as a shared semantic event pair.
- `mirror.v1.js` / proven private-repo asset loading pattern, after current hosting assumptions are reverified.

These are high accidental-rebuild risks, not automatic runtime imports.

#### P1 · Register as donors

- Cube Pet Podcast v5: presenter/voice/personas/gaze/research/transcript/ground systems.
- `kfb-bumper-kit` and `kfb-bg-shader-kit` / duotone shader kits.
- `inspect.v5` guided free-camera donor.
- 3D speech-bubble bank.
- Boxel Blitz palette/juice/gutter/dice-physics work plus its postmortem.
- FrizzleGraft + Frankenstein methods/skill where they remain relevant to current sources.

#### P2 · Tool/site or reusable-module candidates

- **Presenter / Podcast Lab** based on Cube Pet Podcast v5. Do not greenfield a new presenter tool.
- Table/Diorama v6: extract TurnState/NavState/cel-outline ideas after source verification.
- 2D Overworld v13: bubble layout, terrain paint, journey, card rail, gutter, HUD/water/UI-SFX modules.
- Pet/rig tooling only after reconciliation with the current FrankenStein v17 line.

#### P3 · History/reference only unless a consumer proves otherwise

- older Card Viewer/comic-cube branches described by the audit as an unstable/rival-model line;
- older Pet Editor, Table, Overworld and SpinBall revisions superseded by later documented lines.

## Cube Pet Podcast v5 · strategic value

This is the most important recovered single product donor outside the current Studio line.

The audit reports existing modules/contracts for:
- two cube-pet presenters;
- persona/role/director-state logic;
- gaze ownership;
- speech/voice timing where voice is the clock;
- transcript presentation;
- per-pet grounded shadow treatment;
- LLM research tooling with structured claim/mechanism/number/cost/friction output;
- media/reaction flow and card/commentary seams.

The report did **not** find a dedicated finished closure/persistence module, so session closure remains a real open item rather than something we should assume exists.

### Proposed product consequence

Future tool-sites should include a **Presenter / Podcast Lab** or equivalent mode derived from the recovered Podcast v5 implementation. It should interoperate with FrankenStein/Animation/Rigging tools through exported actor/profile contracts rather than becoming a competing actor owner.

## Boxel Blitz / SpinBall / Pinball

The scan confirms several partially overlapping physics/game-feel branches already exist. This makes pinball/collision work a **mandatory donor-search category** before any new Combat/Stunt/Museum slice invents another implementation.

Do not declare one universal physics owner from this report alone. Instead, use a consumer-specific decision tree:

1. define required behavior;
2. inspect the existing donor variants and postmortems;
3. choose `REUSE`, `ADAPT` or `REJECT` with evidence;
4. preserve one movement/physics owner in the consumer.

Shared semantic VFX/audio events may be reusable even when physics itself is not.

## Table Diorama v6

The audit's most promising reusable concepts are the TurnState event bus, NavState pattern and cel-outline/staging work. These are good Museum/Infinite-Canvas and turn-based presentation donors.

Do not promote the whole table runtime merely because these subsystems are useful. Extract only after an actual consumer slice needs them.

## 2D Overworld v13

This is a major donor for future 2D/2.5D KFB presentation:
- speech-bubble layout/typesetting;
- terrain paint;
- journey/routes;
- card rail;
- gutter logic;
- HUD/water interaction;
- UI-SFX mapping.

Likely consumers: Museum/Infinite Canvas, Travel presentation layers, Combat UI/NPC presentation, future chatter/soundscape work.

Its existence should be checked before building a new NPC chatter/bubble/navigation layer.

## Donor registry direction

The central production router should gain a donor registry derived from `DONOR_CANDIDATES.json`, but the local report's status labels must not be copied blindly.

Recommended central donor entry fields:

```text
id
capability
sourceRepository
sourceRevision
sourcePath
sourceEvidence
status
reuseTreatment
owners / doesNotOwn
knownConsumers
knownRisks
promotionGate
```

If a donor currently exists only in a local Dropbox/Claude export, first locate the exact GitHub counterpart or migrate/pin it through the private production inbox. A local path is provenance, not a cross-chat reusable source.

## `use-what-works` skill

The recovery reinforces the existing anti-regression skill `skills/session-entry-use-what-works_v1.md`: functioning sources are copied/reused with a named seam and proof instead of being re-derived.

There is a metadata mismatch to resolve separately: the file exists as `session-entry-use-what-works_v1.md`, while its own header names a different canonical path. Until corrected, consumers should use the **existing repository path**, not invent the missing alias.

## Immediate masterplan consequences

1. Add Legacy Donor Recovery as a cross-project backlog source, not as a new implementation project.
2. Make donor search mandatory before new Actor/Presenter, Camera, Bubble, Shadow, Pinball/Collision, VFX/Audio or 2D Overworld helpers.
3. Plan Presenter/Podcast Lab as a future tool-site based on Podcast v5.
4. Add Overworld v13 and Table v6 as Museum/Infinite-Canvas donor families.
5. Build the central Donor Registry only after exact source/revision reconciliation; do not convert local audit labels directly into CURRENT status.
6. Keep current Studio v17 work, Travel Bath MVP and current project owners higher priority than broad legacy modernization.

## Source status summary

- Recovery report and JSON: `IMPLEMENTATION` as audit artifacts.
- Source reading claims: `SOURCE FACT` where the report names inspected files/modules.
- Historical measured claims: retain as `TESTED RESULT (historical context)` only when the cited donor docs contain the measurement.
- `.dc.html` runtime not personally executed by the recovery scan: `UNVERIFIED` for current runtime behavior.
- Recommendations in this document: `PROPOSAL` until promoted through the central Masterplan/Registry or a consumer project contract.
